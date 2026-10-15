import { NextRequest, NextResponse } from 'next/server';
import { getArticleBySlug } from '@/lib/articles';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const article = getArticleBySlug(id);

    if (!article) {
      return NextResponse.json(
        { success: false, error: 'Artigo não encontrado no acervo soberano.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      article,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Erro ao carregar artigo.' },
      { status: 500 }
    );
  }
}
