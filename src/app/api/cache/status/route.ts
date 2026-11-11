import { NextRequest, NextResponse } from 'next/server';
import { memoryCache } from '@/lib/cache/memory-cache';
import { verifyAdminRequest, denyAdminRequest } from '@/lib/auth/admin-guard';

export const dynamic = 'force-dynamic';

/**
 * GET /api/cache/status
 * Retorna estatísticas de performance do cache em memória e configurações de cache ativas (restrito a admin)
 */
export async function GET(request: NextRequest) {
  const auth = await verifyAdminRequest(request);
  if (!auth.authorized) {
    return denyAdminRequest(auth);
  }

  const stats = memoryCache.getStats();

  return NextResponse.json(
    {
      success: true,
      service: 'MCP Sovereign Smart Cache Engine',
      stats,
      timestamp: new Date().toISOString(),
      policies: {
        edgeCache: 'stale-while-revalidate enabled',
        browserStaticTtl: '31536000s (immutable)',
        swEnabled: true,
        speculationRules: 'prerender + prefetch active',
      },
    },
    {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
        'X-Cache-Engine': 'MCP-Memory-Cache-v1',
      },
    }
  );
}

/**
 * POST /api/cache/status
 * Executa o expurgo (purge) total ou seletivo do cache. Exige autenticação de administrador.
 */
export async function POST(request: NextRequest) {
  try {
    const auth = await verifyAdminRequest(request);
    if (!auth.authorized) {
      return denyAdminRequest(auth);
    }

    const body = await request.json().catch(() => ({}));
    const pattern = body.pattern;

    let purgedCount = 0;
    if (pattern && typeof pattern === 'string') {
      purgedCount = memoryCache.invalidatePattern(pattern);
    } else {
      const statsBefore = memoryCache.getStats();
      purgedCount = statsBefore.size;
      memoryCache.clear();
    }

    return NextResponse.json({
      success: true,
      message: pattern
        ? `Expurgo seletivo concluído: ${purgedCount} chaves removidas para o padrão '${pattern}'.`
        : `Expurgo total concluído com sucesso: ${purgedCount} chaves removidas do cache.`,
      purgedCount,
      currentStats: memoryCache.getStats(),
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Falha ao executar expurgo de cache.' },
      { status: 500 }
    );
  }
}
