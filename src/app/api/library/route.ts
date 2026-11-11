import { NextRequest, NextResponse } from 'next/server';
import { searchAndFilterResources, getAllResources, getResourceById } from '@/lib/library/catalog';
import { memoryCache } from '@/lib/cache/memory-cache';
import { getSession } from '@/lib/auth/session';
import { verifyToken } from '@/lib/auth/jwt';

export const dynamic = 'force-dynamic';

function isResourcePremium(res: any): boolean {
  return Boolean(
    res?.is_premium ||
    res?.isPremium ||
    res?.tags?.some((t: string) => ['premium', 'vip', 'master', 'pago'].includes(t.toLowerCase()))
  );
}

function sanitizeResourceForTier(res: any, hasPrivilege: boolean) {
  if (!isResourcePremium(res) || hasPrivilege) return res;
  return {
    ...res,
    url: null,
    rel_path: undefined,
    text_preview: 'Conteúdo exclusivo para assinantes VIP da Comunidade Soberana.',
    is_locked: true,
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || searchParams.get('search') || searchParams.get('query') || '';
    const category = searchParams.get('category') || searchParams.get('cat') || 'Todos';
    const rawPage = parseInt(searchParams.get('page') || '1', 10);
    const rawLimit = parseInt(searchParams.get('limit') || '12', 10);
    const page = Number.isFinite(rawPage) && rawPage >= 1 ? rawPage : 1;
    const limit = Number.isFinite(rawLimit) && rawLimit >= 1 ? Math.min(100, rawLimit) : 12;
    const id = searchParams.get('id');

    // Identificação de privilégio do usuário
    let session = await getSession();
    if (!session) {
      const authHeader = request.headers.get('authorization');
      if (authHeader?.startsWith('Bearer ')) {
        session = await verifyToken(authHeader.substring(7).trim());
      }
    }
    const hasPrivilege = Boolean(
      session &&
      (session.role === 'admin' ||
        session.role === 'editor' ||
        session.role === 'moder' ||
        session.tier === 'vip' ||
        session.tier === 'pro' ||
        (session.tier as string) === 'master')
    );

    // Se um ID específico for solicitado diretamente
    if (id) {
      const cacheKey = `library:item:${id}:${hasPrivilege ? 'priv' : 'pub'}`;
      const cachedItem = memoryCache.get<any>(cacheKey);
      if (cachedItem) {
        return NextResponse.json(
          { success: true, item: cachedItem, source: 'memory_cache' },
          {
            headers: {
              'Cache-Control': hasPrivilege ? 'private, no-store' : 'public, s-maxage=300, stale-while-revalidate=1800, max-age=60',
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

      const safeItem = sanitizeResourceForTier(item, hasPrivilege);
      memoryCache.set(cacheKey, safeItem, 600);
      return NextResponse.json(
        { success: true, item: safeItem, source: 'catalog' },
        {
          headers: {
            'Cache-Control': hasPrivilege ? 'private, no-store' : 'public, s-maxage=300, stale-while-revalidate=1800, max-age=60',
            'X-Cache': 'MISS',
          },
        }
      );
    }

    const cacheKey = `library:list:${category}:${query}:${page}:${limit}:${hasPrivilege ? 'priv' : 'pub'}`;
    const cachedList = memoryCache.get<any>(cacheKey);
    if (cachedList) {
      return NextResponse.json(
        { ...cachedList, source: 'memory_cache' },
        {
          headers: {
            'Cache-Control': hasPrivilege ? 'private, no-store' : 'public, s-maxage=180, stale-while-revalidate=900, max-age=60',
            'X-Cache': 'HIT',
          },
        }
      );
    }

    const result = searchAndFilterResources({
      query,
      category,
      page,
      limit,
    });

    const safeItems = (result.items || []).map((r: any) => sanitizeResourceForTier(r, hasPrivilege));

    const payload = {
      success: true,
      query,
      category,
      ...result,
      items: safeItems,
      resources: safeItems,
    };
    memoryCache.set(cacheKey, payload, 300);

    return NextResponse.json(payload, {
      headers: {
        'Cache-Control': hasPrivilege ? 'private, no-store' : 'public, s-maxage=180, stale-while-revalidate=900, max-age=60',
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
