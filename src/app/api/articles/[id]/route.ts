import { NextRequest, NextResponse } from 'next/server';
import { db, articles } from '@/lib/db';
import { eq, or } from 'drizzle-orm';
import { getArticleBySlug } from '@/lib/articles';
import { parseNotionMarkdown } from '@/lib/notion-diary-parser';

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
      const dbArticle = await db
        .select()
        .from(articles)
        .where(or(eq(articles.slug, cleanId), eq(articles.id, cleanId as any)))
        .limit(1);

      if (dbArticle && dbArticle.length > 0) {
        const item = dbArticle[0];
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
            excerpt: item.summary,
            readingTime: item.readingTime || '5 min',
            coverImage: item.coverUrl || '/assets/hero_cover.webp',
            contentHtml: parseNotionMarkdown(item.content),
            rawContent: item.content,
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

    return NextResponse.json({
      success: true,
      source: 'local_archive',
      article: staticArticle,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Erro ao carregar artigo.' },
      { status: 500 }
    );
  }
}
