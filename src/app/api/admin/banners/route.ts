import { NextRequest, NextResponse } from 'next/server';
import { db, systemSettings } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { verifyAdminRequest, denyAdminRequest } from '@/lib/auth/admin-guard';
import defaultBannersData from '@/data/banners.json';
import { memoryCache } from '@/lib/cache/memory-cache';
import { BannersConfig, SmartBanner } from '@/types/banners';
import { sanitizeSafeUrl } from '@/lib/security/sanitize';

export const dynamic = 'force-dynamic';

const SETTINGS_KEY = 'smart_banners_config';
const PUBLIC_CACHE_KEY = 'banners:public:config';
const ADMIN_CACHE_KEY = 'banners:admin:config';

const LEGACY_MOCK_BANNER_IDS = new Set([
  'banner-exit-intent-global',
  'banner-onboarding-home',
  'banner-onboarding-shop',
]);

export async function GET(req: NextRequest) {
  const auth = await verifyAdminRequest(req);
  if (!auth.authorized) {
    return denyAdminRequest(auth);
  }

  try {
    let config: BannersConfig = defaultBannersData as unknown as BannersConfig;

    try {
      const records = await db
        .select()
        .from(systemSettings)
        .where(eq(systemSettings.key, SETTINGS_KEY))
        .limit(1);

      if (records && records.length > 0 && records[0].value) {
        const val = records[0].value as any;
        if (Array.isArray(val.banners)) {
          const sanitizedBanners = val.banners.filter(
            (b: any) => b && b.id && !LEGACY_MOCK_BANNER_IDS.has(b.id)
          );
          config = {
            globalEnabled: typeof val.globalEnabled === 'boolean' ? val.globalEnabled : true,
            exitIntentSensitivity: val.exitIntentSensitivity || 'medium',
            banners: sanitizedBanners,
          };
        }
      }
    } catch (dbErr) {
      console.warn('[Admin Banners API] DB Offline, usando fallback de dados:', dbErr);
    }

    const totalCount = config.banners.length;
    const activeCount = config.banners.filter((b) => b.isActive).length;
    const exitIntentCount = config.banners.filter((b) => b.type === 'exit_intent').length;
    const onboardingCount = config.banners.filter((b) => b.type === 'onboarding').length;

    return NextResponse.json({
      success: true,
      data: config,
      stats: {
        total: totalCount,
        active: activeCount,
        exitIntent: exitIntentCount,
        onboarding: onboardingCount,
      },
    });
  } catch (error: any) {
    console.error('[Admin Banners API] Erro ao carregar:', error);
    return NextResponse.json(
      { success: false, error: 'Falha ao processar requisição administrativa' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const auth = await verifyAdminRequest(req);
  if (!auth.authorized) {
    return denyAdminRequest(auth);
  }

  try {
    const body = await req.json();

    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { success: false, error: 'Payload inválido enviado ao servidor' },
        { status: 400 }
      );
    }

    // Suporta receber ou { banners, globalEnabled, exitIntentSensitivity }
    // ou um banner individual para salvar/adicionar
    let updatedConfig: BannersConfig;

    if (Array.isArray(body.banners)) {
      updatedConfig = {
        globalEnabled: typeof body.globalEnabled === 'boolean' ? body.globalEnabled : true,
        exitIntentSensitivity: body.exitIntentSensitivity || 'medium',
        banners: body.banners.map((b: any) => ({
          ...b,
          updatedAt: new Date().toISOString(),
        })),
      };
    } else if (body.id && body.title) {
      // É uma atualização ou inserção de um único banner
      let currentConfig: BannersConfig = defaultBannersData as unknown as BannersConfig;
      try {
        const records = await db
          .select()
          .from(systemSettings)
          .where(eq(systemSettings.key, SETTINGS_KEY))
          .limit(1);

        if (records && records.length > 0 && records[0].value) {
          const val = records[0].value as any;
          if (Array.isArray(val.banners)) {
            const sanitized = val.banners.filter(
              (b: any) => b && b.id && !LEGACY_MOCK_BANNER_IDS.has(b.id)
            );
            currentConfig = {
              globalEnabled: typeof val.globalEnabled === 'boolean' ? val.globalEnabled : true,
              exitIntentSensitivity: val.exitIntentSensitivity || 'medium',
              banners: sanitized,
            };
          }
        }
      } catch (err) {
        console.warn('[Admin Banners API] Fallback durante insert individual');
      }

      const existingIndex = currentConfig.banners.findIndex((b) => b.id === body.id);
      let newBannersList: SmartBanner[];

      const now = new Date().toISOString();
      const newBannerItem: SmartBanner = {
        id: body.id,
        title: body.title,
        subtitle: body.subtitle || '',
        content: body.content || '',
        type: body.type || 'exit_intent',
        targetPages: Array.isArray(body.targetPages) && body.targetPages.length > 0 ? body.targetPages : ['*'],
        ctaText: body.ctaText || 'Acessar Agora',
        ctaUrl: body.ctaUrl || '/',
        secondaryCtaText: body.secondaryCtaText || '',
        secondaryCtaUrl: body.secondaryCtaUrl || '',
        discountCode: body.discountCode || '',
        imageUrl: body.imageUrl || '',
        badge: body.badge || '',
        isActive: typeof body.isActive === 'boolean' ? body.isActive : true,
        delaySeconds: Number(body.delaySeconds) || 0,
        frequency: body.frequency || 'once_per_session',
        theme: body.theme || 'cyber_red',
        createdAt: body.createdAt || now,
        updatedAt: now,
      };

      if (existingIndex >= 0) {
        newBannersList = [...currentConfig.banners];
        newBannersList[existingIndex] = newBannerItem;
      } else {
        newBannersList = [newBannerItem, ...currentConfig.banners];
      }

      updatedConfig = {
        ...currentConfig,
        banners: newBannersList,
      };
    } else {
      return NextResponse.json(
        { success: false, error: 'Formato de dados não reconhecido' },
        { status: 400 }
      );
    }

    // Salva na tabela systemSettings
    try {
      await db
        .insert(systemSettings)
        .values({
          key: SETTINGS_KEY,
          value: updatedConfig,
          updatedAt: new Date(),
        })
        .onConflictDoUpdate({
          target: systemSettings.key,
          set: {
            value: updatedConfig,
            updatedAt: new Date(),
          },
        });
    } catch (dbErr) {
      console.error('[Admin Banners API] Falha ao persistir no DB:', dbErr);
    }

    // Invalida os caches de memória
    memoryCache.delete(PUBLIC_CACHE_KEY);
    memoryCache.delete(ADMIN_CACHE_KEY);

    return NextResponse.json({
      success: true,
      message: 'Configuração de banners atualizada com sucesso!',
      data: updatedConfig,
    });
  } catch (error: any) {
    console.error('[Admin Banners API] Erro ao salvar banners:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Falha interna ao salvar banners' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const auth = await verifyAdminRequest(req);
  if (!auth.authorized) {
    return denyAdminRequest(auth);
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID do banner é obrigatório para exclusão' },
        { status: 400 }
      );
    }

    let currentConfig: BannersConfig = defaultBannersData as unknown as BannersConfig;

    try {
      const records = await db
        .select()
        .from(systemSettings)
        .where(eq(systemSettings.key, SETTINGS_KEY))
        .limit(1);

      if (records && records.length > 0 && records[0].value) {
        const val = records[0].value as any;
        if (Array.isArray(val.banners)) {
          const sanitized = val.banners.filter(
            (b: any) => b && b.id && !LEGACY_MOCK_BANNER_IDS.has(b.id)
          );
          currentConfig = {
            globalEnabled: typeof val.globalEnabled === 'boolean' ? val.globalEnabled : true,
            exitIntentSensitivity: val.exitIntentSensitivity || 'medium',
            banners: sanitized,
          };
        }
      }
    } catch (err) {
      console.warn('[Admin Banners API] Fallback para deleção');
    }

    const filteredBanners = currentConfig.banners.filter((b) => b.id !== id);

    const updatedConfig: BannersConfig = {
      ...currentConfig,
      banners: filteredBanners,
    };

    try {
      await db
        .insert(systemSettings)
        .values({
          key: SETTINGS_KEY,
          value: updatedConfig,
          updatedAt: new Date(),
        })
        .onConflictDoUpdate({
          target: systemSettings.key,
          set: {
            value: updatedConfig,
            updatedAt: new Date(),
          },
        });
    } catch (dbErr) {
      console.error('[Admin Banners API] Erro ao persistir exclusão no DB:', dbErr);
    }

    memoryCache.delete(PUBLIC_CACHE_KEY);
    memoryCache.delete(ADMIN_CACHE_KEY);

    return NextResponse.json({
      success: true,
      message: 'Banner excluído com sucesso!',
      data: updatedConfig,
    });
  } catch (error: any) {
    console.error('[Admin Banners API] Erro ao excluir banner:', error);
    return NextResponse.json(
      { success: false, error: 'Falha interna ao deletar banner' },
      { status: 500 }
    );
  }
}
