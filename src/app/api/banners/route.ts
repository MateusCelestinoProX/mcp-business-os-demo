import { NextResponse } from 'next/server';
import { db, systemSettings } from '@/lib/db';
import { eq } from 'drizzle-orm';
import defaultBannersData from '@/data/banners.json';
import { memoryCache } from '@/lib/cache/memory-cache';
import { BannersConfig } from '@/types/banners';

export const dynamic = 'force-dynamic';

const SETTINGS_KEY = 'smart_banners_config';
const CACHE_KEY = 'banners:public:config';

export async function GET() {
  try {
    const cached = memoryCache.get<BannersConfig>(CACHE_KEY);
    if (cached) {
      return NextResponse.json(
        {
          success: true,
          source: 'cache',
          data: {
            ...cached,
            banners: cached.banners.filter((b) => b.isActive),
          },
        },
        {
          headers: {
            'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=120, max-age=15',
            'X-Cache': 'HIT',
          },
        }
      );
    }

    let rawConfig: BannersConfig = defaultBannersData as unknown as BannersConfig;

    try {
      const records = await db
        .select()
        .from(systemSettings)
        .where(eq(systemSettings.key, SETTINGS_KEY))
        .limit(1);

      if (records && records.length > 0 && records[0].value) {
        const val = records[0].value as any;
        if (Array.isArray(val.banners)) {
          rawConfig = {
            globalEnabled: typeof val.globalEnabled === 'boolean' ? val.globalEnabled : true,
            exitIntentSensitivity: val.exitIntentSensitivity || 'medium',
            banners: val.banners,
          };
        }
      }
    } catch (dbErr) {
      // Fallback gracioso para arquivo JSON caso db offline
      console.warn('[Banners Public API] Fallback para arquivo local JSON:', dbErr);
    }

    // Armazena no cache da memória por 60s
    memoryCache.set(CACHE_KEY, rawConfig, 60);

    const activeBanners = rawConfig.banners.filter((b) => b.isActive);

    return NextResponse.json(
      {
        success: true,
        source: 'database',
        data: {
          ...rawConfig,
          banners: activeBanners,
        },
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=120, max-age=15',
          'X-Cache': 'MISS',
        },
      }
    );
  } catch (error: any) {
    console.error('[Banners Public API] Erro ao carregar banners:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Falha ao buscar banners',
        data: {
          globalEnabled: true,
          exitIntentSensitivity: 'medium',
          banners: (defaultBannersData.banners as any[]).filter((b) => b.isActive),
        },
      },
      { status: 500 }
    );
  }
}
