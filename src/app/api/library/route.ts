import { NextRequest, NextResponse } from 'next/server';
import { searchAndFilterResources, getAllResources, getResourceById } from '@/lib/library/catalog';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || searchParams.get('search') || searchParams.get('query') || '';
    const category = searchParams.get('category') || searchParams.get('cat') || 'Todos';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '12', 10);
    const id = searchParams.get('id');

    // Se um ID específico for solicitado diretamente
    if (id) {
      const item = getResourceById(id);
      if (!item) {
        return NextResponse.json(
          { success: false, error: 'Recurso não encontrado no acervo Galadriel' },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true, item });
    }

    const result = searchAndFilterResources({
      query,
      category,
      page: isNaN(page) ? 1 : page,
      limit: isNaN(limit) ? 12 : limit,
    });

    return NextResponse.json({
      success: true,
      query,
      category,
      ...result,
    });
  } catch (error: any) {
    console.error('Erro na API de biblioteca:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Falha ao consultar acervo' },
      { status: 500 }
    );
  }
}
