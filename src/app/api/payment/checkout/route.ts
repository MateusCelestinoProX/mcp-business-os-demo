import { NextResponse } from 'next/server';
import { COMMUNITY_PLANS } from '@/lib/plans';
import { getTrustedSiteUrl } from '@/lib/security/url-guard';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { planSlug, memberEmail, memberName } = body;

    if (!planSlug || !COMMUNITY_PLANS[planSlug]) {
      return NextResponse.json(
        {
          success: false,
          error: `Plano inválido ou não selecionado. Planos válidos: ${Object.keys(COMMUNITY_PLANS).join(', ')}`,
        },
        { status: 400 }
      );
    }

    const plan = COMMUNITY_PLANS[planSlug];
    const isProd = process.env.NODE_ENV === 'production';
    const mpAccessToken =
      process.env.MP_ACCESS_TOKEN ||
      process.env.MERCADOPAGO_ACCESS_TOKEN ||
      process.env.MERCADO_LIVRE_TOKEN;

    const siteUrl = getTrustedSiteUrl(req);
    const safeEmail = typeof memberEmail === 'string' ? memberEmail.trim().slice(0, 255) : undefined;
    const safeName = typeof memberName === 'string' ? memberName.trim().slice(0, 100) : 'Membro Soberano';
    const externalReference = `${plan.slug}__${safeEmail || 'anon'}__${Date.now()}`;

    // 1. Caso haja token configurado do Mercado Pago, cria a preferência real via API oficial
    if (mpAccessToken) {
      try {
        const preferencePayload = {
          items: [
            {
              id: plan.slug,
              title: plan.title,
              description: plan.description,
              quantity: 1,
              currency_id: 'BRL',
              unit_price: plan.price,
            },
          ],
          payer: safeEmail
            ? {
                email: safeEmail,
                name: safeName,
              }
            : undefined,
          payment_methods: {
            installments: 12,
          },
          back_urls: {
            success: `${siteUrl}/comunidade?payment=success&plan=${plan.slug}&ref=${externalReference}`,
            failure: `${siteUrl}/comunidade?payment=failure`,
            pending: `${siteUrl}/comunidade?payment=pending`,
          },
          auto_return: 'approved',
          statement_descriptor: 'MATEUS CELESTINO',
          external_reference: externalReference,
          notification_url: `${siteUrl}/api/payment/webhook`,
        };

        const mpRes = await fetch('https://api.mercadopago.com/checkout/preferences', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${mpAccessToken}`,
            'Content-Type': 'application/json',
            'X-Idempotency-Key': externalReference,
          },
          body: JSON.stringify(preferencePayload),
        });

        const mpData = await mpRes.json();

        if (!mpRes.ok) {
          console.warn('⚠️ [Mercado Pago] Erro retornado pela API MP:', mpData);
          if (isProd) {
            return NextResponse.json(
              { success: false, error: 'Falha na comunicação com o gateway de pagamento.' },
              { status: 502 }
            );
          }
          // Fallback para sandbox simulado apenas em ambiente de desenvolvimento
          return NextResponse.json({
            success: true,
            mode: 'sandbox_fallback',
            id: `MP_ERR_FALLBACK_${Date.now()}`,
            init_point: `${siteUrl}/comunidade?payment=success&sandbox=true&plan=${plan.slug}&email=${encodeURIComponent(safeEmail || '')}`,
            sandbox_init_point: `${siteUrl}/comunidade?payment=success&sandbox=true&plan=${plan.slug}&email=${encodeURIComponent(safeEmail || '')}`,
            details: mpData,
          });
        }

        return NextResponse.json({
          success: true,
          mode: 'live',
          id: mpData.id,
          init_point: mpData.init_point,
          sandbox_init_point: mpData.sandbox_init_point,
        });
      } catch (mpFetchError: any) {
        console.warn('⚠️ [Checkout] Erro de rede com Mercado Pago:', mpFetchError);
        if (isProd) {
          return NextResponse.json(
            { success: false, error: 'Gateway de pagamento temporariamente indisponível.' },
            { status: 503 }
          );
        }
      }
    }

    if (isProd) {
      return NextResponse.json(
        { success: false, error: 'Configuração de pagamento indisponível no momento.' },
        { status: 503 }
      );
    }

    // 2. Modo Sandbox Simulado Localhost (Sem necessidade de credenciais de produção em dev/test)
    const simulatedId = `SANDBOX_PREF_${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
    const simulatedReturnUrl = `${siteUrl}/comunidade?payment=success&sandbox=true&plan=${plan.slug}&email=${encodeURIComponent(safeEmail || '')}&ref=${externalReference}`;

    return NextResponse.json({
      success: true,
      mode: 'sandbox',
      id: simulatedId,
      plan: {
        slug: plan.slug,
        title: plan.title,
        price: plan.price,
        tier: plan.tier,
      },
      init_point: simulatedReturnUrl,
      sandbox_init_point: simulatedReturnUrl,
      message: 'Checkout gerado com sucesso em modo Sandbox Localhost (Simulação Segura Ativa).',
    });
  } catch (error: any) {
    console.error('❌ [Checkout] Erro interno:', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno ao processar checkout.' },
      { status: 500 }
    );
  }
}
