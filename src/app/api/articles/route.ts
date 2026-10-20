import { NextRequest, NextResponse } from 'next/server';
import { db, articles } from '@/lib/db';
import { eq, desc, ilike, or } from 'drizzle-orm';
import { parseNotionMarkdown, calculateReadingTime, extractExcerpt } from '@/lib/notion-diary-parser';
import rawArticles from '@/data/articles-summary.json';
import { verifyAdminRequest, unauthorizedResponse } from '@/lib/auth/admin-guard';
import { memoryCache } from '@/lib/cache/memory-cache';

export const dynamic = 'force-dynamic';

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

/**
 * GET /api/articles
 * Retorna lista de artigos com filtros de busca, categoria e paginação
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || 'TODOS';
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '50', 10)));
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const offset = (page - 1) * limit;

    const cacheKey = `articles:list:${category}:${search}:${page}:${limit}`;
    const cached = memoryCache.get<any>(cacheKey);
    if (cached) {
      return NextResponse.json(
        { ...cached, source: 'memory_cache' },
        {
          headers: {
            'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=600, max-age=60',
            'X-Cache': 'HIT',
          },
        }
      );
    }

    let dbArticles: any[] = [];
    try {
      const query = db
        .select()
        .from(articles)
        .orderBy(desc(articles.createdAt))
        .limit(limit)
        .offset(offset);

      dbArticles = await query;
    } catch (dbErr) {
      console.warn('Fallback para acervo local de artigos:', dbErr);
    }

    if (dbArticles.length > 0) {
      // Normaliza retorno para o formato padrão do portal
      const normalized = dbArticles.map((a) => ({
        id: a.id,
        slug: a.slug,
        title: a.title,
        category: a.category,
        createdAt: a.createdAt ? new Date(a.createdAt).toISOString() : new Date().toISOString(),
        isFeatured: false,
        excerpt: a.summary,
        readingTime: a.readingTime || '5 min',
        coverImage: a.coverUrl || '/assets/hero_cover.webp',
        contentHtml: parseNotionMarkdown(a.content),
        rawContent: a.content,
        isPublished: a.isPublished,
      }));

      // Aplica filtros se houver
      let filtered = normalized;
      if (category && category !== 'TODOS' && category !== 'all') {
        filtered = filtered.filter((a) => a.category.toLowerCase().includes(category.toLowerCase()));
      }
      if (search && search.trim()) {
        const q = search.toLowerCase().trim();
        filtered = filtered.filter(
          (a) => a.title.toLowerCase().includes(q) || a.excerpt.toLowerCase().includes(q)
        );
      }

      const supabasePayload = {
        success: true,
        source: 'supabase',
        articles: filtered,
        total: filtered.length,
        page,
        limit,
      };
      memoryCache.set(cacheKey, supabasePayload, 300);

      return NextResponse.json(supabasePayload, {
        headers: {
          'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=600, max-age=60',
          'X-Cache': 'MISS',
        },
      });
    }

    // Fallback gracioso para arquivo JSON local
    let staticList = (rawArticles as any[]).map((a) => ({
      ...a,
      rawContent: a.contentHtml || a.excerpt,
      isPublished: true,
    }));

    if (category && category !== 'TODOS' && category !== 'all') {
      staticList = staticList.filter((a) => a.category.toLowerCase().includes(category.toLowerCase()));
    }
    if (search && search.trim()) {
      const q = search.toLowerCase().trim();
      staticList = staticList.filter(
        (a) => a.title.toLowerCase().includes(q) || a.excerpt.toLowerCase().includes(q)
      );
    }

    const localPayload = {
      success: true,
      source: 'local_archive',
      articles: staticList.slice(offset, offset + limit),
      total: staticList.length,
      page,
      limit,
    };
    memoryCache.set(cacheKey, localPayload, 300);

    return NextResponse.json(localPayload, {
      headers: {
        'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=600, max-age=60',
        'X-Cache': 'MISS',
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Erro ao consultar artigos.' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/articles
 * Criação de novo artigo pelo painel administrativo
 */
export async function POST(request: NextRequest) {
  try {
    const auth = await verifyAdminRequest(request);
    if (!auth.authorized) {
      return unauthorizedResponse(auth.error);
    }

    const body = await request.json();
    const { title, content, category, coverUrl, summary, readingTime, isPublished } = body;

    if (!title || !title.trim()) {
      return NextResponse.json(
        { success: false, error: 'O título do post é obrigatório.' },
        { status: 400 }
      );
    }

    if (!content || !content.trim()) {
      return NextResponse.json(
        { success: false, error: 'O conteúdo do post em blocos/markdown é obrigatório.' },
        { status: 400 }
      );
    }

    const calculatedSlug = body.slug ? slugify(body.slug) : `${slugify(title)}-${Date.now().toString().slice(-4)}`;
    const finalSummary = summary && summary.trim() ? summary.trim() : extractExcerpt(content, 180);
    const finalReadingTime = readingTime && readingTime.trim() ? readingTime.trim() : calculateReadingTime(content);
    const finalCategory = category && category.trim() ? category.trim().toUpperCase() : 'INTELIGÊNCIA ARTIFICIAL';
    const finalCover = coverUrl && coverUrl.trim() ? coverUrl.trim() : '/assets/recursos_cover.webp';
    const publishedFlag = typeof isPublished === 'boolean' ? isPublished : true;

    // Inserção no Supabase com Drizzle ORM
    const [inserted] = await db
      .insert(articles)
      .values({
        slug: calculatedSlug,
        title: title.trim(),
        summary: finalSummary,
        content: content.trim(),
        category: finalCategory,
        coverUrl: finalCover,
        readingTime: finalReadingTime,
        isPublished: publishedFlag,
      })
      .returning();

    // Invalidação imediata do cache de artigos
    memoryCache.invalidatePattern('articles:');

    return NextResponse.json({
      success: true,
      message: 'Artigo publicado com sucesso no acervo soberano!',
      article: {
        ...inserted,
        contentHtml: parseNotionMarkdown(inserted.content),
      },
    }, { status: 201 });
  } catch (error: any) {
    console.error('Erro ao criar artigo:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Falha ao salvar novo post no banco de dados.' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/articles
 * Atualização de artigo existente
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, title, slug, content, category, coverUrl, summary, readingTime, isPublished } = body;

    if (!id && !slug) {
      return NextResponse.json(
        { success: false, error: 'Identificador (id ou slug) é obrigatório para atualização.' },
        { status: 400 }
      );
    }

    const updateData: any = {};
    if (title) updateData.title = title.trim();
    if (slug) updateData.slug = slugify(slug);
    if (content) {
      updateData.content = content.trim();
      if (!summary) updateData.summary = extractExcerpt(content, 180);
      if (!readingTime) updateData.readingTime = calculateReadingTime(content);
    }
    if (summary) updateData.summary = summary.trim();
    if (readingTime) updateData.readingTime = readingTime.trim();
    if (category) updateData.category = category.trim().toUpperCase();
    if (coverUrl !== undefined) updateData.coverUrl = coverUrl.trim();
    if (isPublished !== undefined) updateData.isPublished = Boolean(isPublished);

    let updatedRows: any[] = [];
    if (id) {
      updatedRows = await db
        .update(articles)
        .set(updateData)
        .where(eq(articles.id, id))
        .returning();
    } else if (slug) {
      updatedRows = await db
        .update(articles)
        .set(updateData)
        .where(eq(articles.slug, slug))
        .returning();
    }

    if (!updatedRows || updatedRows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Artigo não localizado para atualização.' },
        { status: 404 }
      );
    }

    // Invalidação imediata do cache de artigos
    memoryCache.invalidatePattern('articles:');

    return NextResponse.json({
      success: true,
      message: 'Artigo atualizado com sucesso!',
      article: updatedRows[0],
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Falha ao atualizar artigo.' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/articles
 * Exclusão de artigo
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const slug = searchParams.get('slug');

    if (!id && !slug) {
      return NextResponse.json(
        { success: false, error: 'Parâmetro id ou slug é necessário para remoção.' },
        { status: 400 }
      );
    }

    if (id) {
      await db.delete(articles).where(eq(articles.id, id));
    } else if (slug) {
      await db.delete(articles).where(eq(articles.slug, slug));
    }

    // Invalidação imediata do cache de artigos
    memoryCache.invalidatePattern('articles:');

    return NextResponse.json({
      success: true,
      message: 'Artigo removido com sucesso.',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Falha ao remover artigo.' },
      { status: 500 }
    );
  }
}
