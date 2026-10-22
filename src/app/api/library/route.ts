import { NextRequest, NextResponse } from 'next/server';
import { searchAndFilterResources, getAllResources, getResourceById } from '@/lib/library/catalog';
import { memoryCache } from '@/lib/cache/memory-cache';

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
      const cacheKey = `library:item:${id}`;
      const cachedItem = memoryCache.get<any>(cacheKey);
      if (cachedItem) {
        return NextResponse.json(
          { success: true, item: cachedItem, source: 'memory_cache' },
          {
            headers: {
              'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=1800, max-age=60',
              'X-Cache': 'HIT',
            },
          }
        );
      }

      const item = getResourceById(id);
      if (!item) {
        return NextResponse.json(
          { success: false, error: 'Recurso não encontrado no acervo Free Resources' },
          { status: 404 }
        );
      }
      memoryCache.set(cacheKey, item, 600);
      return NextResponse.json(
        { success: true, item, source: 'catalog' },
        {
          headers: {
            'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=1800, max-age=60',
            'X-Cache': 'MISS',
          },
        }
      );
    }

    const cacheKey = `library:list:${category}:${query}:${page}:${limit}`;
    const cachedList = memoryCache.get<any>(cacheKey);
    if (cachedList) {
      return NextResponse.json(
        { ...cachedList, source: 'memory_cache' },
        {
          headers: {
            'Cache-Control': 'public, s-maxage=180, stale-while-revalidate=900, max-age=60',
            'X-Cache': 'HIT',
          },
        }
      );
    }

    const result = searchAndFilterResources({
      query,
      category,
      page: isNaN(page) ? 1 : page,
      limit: isNaN(limit) ? 12 : limit,
    });

    const payload = {
      success: true,
      query,
      category,
      ...result,
    };
    memoryCache.set(cacheKey, payload, 300);

    return NextResponse.json(payload, {
      headers: {
        'Cache-Control': 'public, s-maxage=180, stale-while-revalidate=900, max-age=60',
        'X-Cache': 'MISS',
      },
    });
  } catch (error: any) {
    console.error('Erro na API de biblioteca:', error);
    return NextResponse.json(
      { success: false, error: 'Falha ao consultar acervo.' },
      { status: 500 }
    );
  }
}
