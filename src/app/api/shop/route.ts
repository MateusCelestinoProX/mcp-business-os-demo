import { NextResponse } from 'next/server';
import { db, isDbConfigured } from '@/lib/db';
import { systemSettings } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { memoryCache } from '@/lib/cache/memory-cache';
import siteData from '@/data/siteData.json';

export const dynamic = 'force-dynamic';

const SETTINGS_KEY = 'shop_and_resources_config';

export async function GET() {
  try {
    const cacheKey = 'shop:public_catalog';
    const cached = memoryCache.get<any>(cacheKey);
    if (cached) {
      return NextResponse.json(
        {
          success: true,
          source: 'memory_cache',
          config: cached,
          data: cached,
        },
        {
          headers: {
            'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300, max-age=30',
            'X-Cache': 'HIT',
          },
        }
      );
    }

    let configData = null;

    if (isDbConfigured) {
      try {
        const rows = await db
          .select()
          .from(systemSettings)
          .where(eq(systemSettings.key, SETTINGS_KEY))
          .limit(1);

        if (rows.length > 0 && rows[0].value) {
          configData = rows[0].value;
        }
      } catch (err) {
        console.warn('[PublicShopApi] Falha ao consultar banco, usando fallback local:', err);
      }
    }

    if (!configData) {
      configData = {
        shop: {
          hero: {
            welcome: 'SEJA BEM-VINDO AO SHOP & CATÁLOGO DEMO',
            tagline: 'SEU CATÁLOGO PROFISSIONAL DE PRODUTOS E SERVIÇOS DIGITAIS DE ALTA PERFORMANCE.',
            artImages: [
              '/assets/notion/shop/hero_art.png',
              '/assets/hero_cover.webp',
            ],
          },
          produtos: siteData.shop?.produtos || [],
          servicos: siteData.shop?.servicos || [],
        },
      };
    }

    memoryCache.set(cacheKey, configData, 300);

    return NextResponse.json(
      {
        success: true,
        source: 'fresh_fetch',
        config: configData,
        data: configData,
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300, max-age=30',
          'X-Cache': 'MISS',
        },
      }
    );
  } catch (error: any) {
    console.error('[PublicShopApi] Erro:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Erro ao carregar catálogo da loja virtual.',
      },
      { status: 500 }
    );
  }
}
