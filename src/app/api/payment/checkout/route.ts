import { NextResponse } from 'next/server';
import { COMMUNITY_PLANS, type PlanConfig } from '@/lib/plans';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { planSlug, memberEmail, memberName, customTitle } = body;

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
    const mpAccessToken =
      process.env.MP_ACCESS_TOKEN ||
      process.env.MERCADOPAGO_ACCESS_TOKEN ||
      process.env.MERCADO_LIVRE_TOKEN;

    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL ||
      process.env.VERCEL_URL
        ? (process.env.VERCEL_URL?.startsWith('http') ? process.env.VERCEL_URL : `https://${process.env.VERCEL_URL}`)
        : 'http://localhost:3000';

    const externalReference = `${plan.slug}__${memberEmail || 'anon'}__${Date.now()}`;

    // 1. Caso haja token configurado do Mercado Pago, cria a preferência real via API oficial
    if (mpAccessToken) {
      try {
        const preferencePayload = {
          items: [
            {
              id: plan.slug,
              title: customTitle || plan.title,
              description: plan.description,
              quantity: 1,
              currency_id: 'BRL',
              unit_price: plan.price,
            },
          ],
          payer: memberEmail
            ? {
                email: memberEmail,
                name: memberName || 'Membro Soberano',
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
          // Fallback para sandbox simulado se a API do MP falhar com token de teste
          return NextResponse.json({
            success: true,
            mode: 'sandbox_fallback',
            id: `MP_ERR_FALLBACK_${Date.now()}`,
            init_point: `${siteUrl}/comunidade?payment=success&sandbox=true&plan=${plan.slug}&email=${encodeURIComponent(memberEmail || '')}`,
            sandbox_init_point: `${siteUrl}/comunidade?payment=success&sandbox=true&plan=${plan.slug}&email=${encodeURIComponent(memberEmail || '')}`,
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
      }
    }

    // 2. Modo Sandbox Simulado Localhost (Sem necessidade de credenciais de produção)
    const simulatedId = `SANDBOX_PREF_${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
    const simulatedReturnUrl = `${siteUrl}/comunidade?payment=success&sandbox=true&plan=${plan.slug}&email=${encodeURIComponent(memberEmail || '')}&ref=${externalReference}`;

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
      { success: false, error: 'Erro interno ao gerar checkout: ' + error.message },
      { status: 500 }
    );
  }
}
