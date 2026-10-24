import { NextRequest, NextResponse } from 'next/server';
import { db, articles } from '@/lib/db';
import { eq, or } from 'drizzle-orm';
import { getArticleBySlug } from '@/lib/articles';
import { parseNotionMarkdown } from '@/lib/notion-diary-parser';
import { verifyAdminRequest } from '@/lib/auth/admin-guard';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const cleanId = id.trim();

    // 1. Busca primeiro no banco Supabase
    try {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(cleanId);
      const dbArticle = await db
        .select()
        .from(articles)
        .where(isUuid ? or(eq(articles.slug, cleanId), eq(articles.id, cleanId)) : eq(articles.slug, cleanId))
        .limit(1);

      if (dbArticle && dbArticle.length > 0) {
        const item = dbArticle[0];

        // Artigos não publicados só podem ser visualizados por administradores
        if (!item.isPublished) {
          const auth = await verifyAdminRequest(request);
          if (!auth.authorized) {
            return NextResponse.json(
              { success: false, error: 'Artigo não encontrado no acervo soberano.' },
              { status: 404 }
            );
          }
        }
        const cover = item.coverUrl || '/assets/hero_cover.webp';
        const summary = item.summary || '';
        const readingTime = typeof item.readingTime === 'number' ? `${item.readingTime} min` : String(item.readingTime || '5 min');
        const content = item.content || '';
        const contentHtml = content.startsWith('<') ? content : parseNotionMarkdown(content);

        return NextResponse.json({
          success: true,
          source: 'supabase',
          article: {
            id: item.id,
            slug: item.slug,
            title: item.title,
            category: item.category,
            createdAt: item.createdAt ? new Date(item.createdAt).toLocaleDateString('pt-BR') : '2026',
            isFeatured: false,
            summary: summary,
            excerpt: summary,
            readingTime: readingTime,
            coverUrl: cover,
            coverImage: cover,
            content: content,
            rawContent: content,
            contentHtml: contentHtml,
            isPublished: item.isPublished,
          },
        });
      }
    } catch (dbErr) {
      console.warn('Fallback para arquivo estático ao buscar artigo individual:', dbErr);
    }

    // 2. Fallback para artigos estáticos
    const staticArticle = getArticleBySlug(cleanId);
    if (!staticArticle) {
      return NextResponse.json(
        { success: false, error: 'Artigo não encontrado no acervo soberano.' },
        { status: 404 }
      );
    }

    const cover = (staticArticle as any).coverUrl || staticArticle.coverImage || '/assets/hero_cover.webp';
    const summary = (staticArticle as any).summary || staticArticle.excerpt || '';
    const readingTime = typeof staticArticle.readingTime === 'number' ? `${staticArticle.readingTime} min` : String(staticArticle.readingTime || '5 min');
    const content = (staticArticle as any).content || staticArticle.contentHtml || '';

    return NextResponse.json({
      success: true,
      source: 'local_archive',
      article: {
        ...staticArticle,
        summary: summary,
        excerpt: summary,
        coverUrl: cover,
        coverImage: cover,
        readingTime: readingTime,
        content: content,
        rawContent: content,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Erro ao carregar artigo do acervo.' },
      { status: 500 }
    );
  }
}
