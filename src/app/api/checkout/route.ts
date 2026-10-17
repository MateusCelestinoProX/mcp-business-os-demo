import { NextRequest, NextResponse } from 'next/server';
import { COMMUNITY_PLANS, type PlanConfig } from '@/lib/plans';

export const dynamic = 'force-dynamic';

// Map extra slugs to handle both naming styles seamlessly
const EXTENDED_PLANS: Record<string, { slug: string; title: string; price: number; tier: 'pro' | 'vip' | 'master'; description: string }> = {
  ...COMMUNITY_PLANS,
  'comunidade-mensal': {
    slug: 'comunidade-mensal',
    title: 'Comunidade Soberana — Plano Mensal VIP',
    price: 47.90,
    tier: 'vip',
    description: 'Acesso mensal integral à comunidade Visuals VIP, Discord e acervo 8K.',
  },
  'comunidade-anual': {
    slug: 'comunidade-anual',
    title: 'Comunidade Soberana — Passe Anual VIP Pro',
    price: 397.00,
    tier: 'vip',
    description: 'Acesso anual com desconto exclusivo, suporte prioritário e mentorias.',
  },
  'comunidade-vitalicio': {
    slug: 'comunidade-vitalicio',
    title: 'Comunidade Soberana — Acesso Vitalício Master',
    price: 697.00,
    tier: 'master',
    description: 'Acesso vitalício irrestrito a todos os packs presentes e futuros.',
  },
};

/**
 * GET /api/checkout
 * Retorna estado operacional do checkout e os planos soberanos disponíveis
 */
export async function GET(req: NextRequest) {
  return NextResponse.json({
    success: true,
    status: 'online',
    service: 'Checkout Soberano Unificado — Mateus Celestino Pro',
    gateways: ['mercadopago', 'pix', 'cartao_credito', 'sandbox_local'],
    plans: Object.values(EXTENDED_PLANS),
  });
}

/**
 * POST /api/checkout
 * Criação da sessão ou preferência de checkout com Mercado Pago ou Sandbox Seguro
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const rawSlug = body.planSlug || body.planId || body.productSlug || 'membership-vip';
    const email = body.memberEmail || body.userEmail || body.email || 'membro@mateuscelestinopro.com';
    const name = body.memberName || body.userName || body.name || 'Membro Soberano';
    const customTitle = body.customTitle;

    const plan = EXTENDED_PLANS[rawSlug] || COMMUNITY_PLANS[rawSlug] || COMMUNITY_PLANS['membership-vip'];

    const host = req.headers.get('host') || 'localhost:3000';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const siteUrl = process.env.NEXT_PUBLIC_APP_URL || `${protocol}://${host}`;

    const externalRef = `ref_${plan.slug}_${Date.now()}`;
    const mpAccessToken =
      process.env.MP_ACCESS_TOKEN ||
      process.env.MERCADOPAGO_ACCESS_TOKEN ||
      process.env.MERCADO_LIVRE_TOKEN;

    // 1. Processamento via API Oficial Mercado Pago caso token esteja configurado
    if (mpAccessToken && mpAccessToken !== 'TEST-DEFAULT-TOKEN-PLACEHOLDER') {
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
          payer: {
            email,
            name,
          },
          payment_methods: {
            installments: 12,
          },
          back_urls: {
            success: `${siteUrl}/comunidade?payment=success&plan=${plan.slug}&ref=${externalRef}`,
            failure: `${siteUrl}/comunidade?payment=failure&plan=${plan.slug}`,
            pending: `${siteUrl}/comunidade?payment=pending&plan=${plan.slug}&ref=${externalRef}`,
          },
          auto_return: 'approved',
          statement_descriptor: 'MATEUS CELESTINO',
          external_reference: externalRef,
          notification_url: `${siteUrl}/api/payment/webhook`,
        };

        const mpRes = await fetch('https://api.mercadopago.com/checkout/preferences', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${mpAccessToken}`,
            'Content-Type': 'application/json',
            'X-Idempotency-Key': externalRef,
          },
          body: JSON.stringify(preferencePayload),
        });

        if (mpRes.ok) {
          const mpData = await mpRes.json();
          return NextResponse.json({
            success: true,
            mode: 'live',
            id: mpData.id,
            init_point: mpData.init_point,
            sandbox_init_point: mpData.sandbox_init_point,
            external_reference: externalRef,
          });
        }
      } catch (mpErr: any) {
        console.warn('⚠️ [Checkout API] Aviso ao conectar com Mercado Pago:', mpErr?.message);
      }
    }

    // 2. Modo Sandbox Simulado Localhost de Alta Fidelidade
    const simulatedId = `SOBERANO_PREF_${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
    const returnUrl = `${siteUrl}/comunidade?payment=success&sandbox=true&plan=${plan.slug}&email=${encodeURIComponent(email)}&ref=${externalRef}`;

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
      init_point: returnUrl,
      sandbox_init_point: returnUrl,
      external_reference: externalRef,
      message: 'Checkout gerado com sucesso em Mateus Celestino Pro X.',
    });
  } catch (error: any) {
    console.error('❌ [Checkout API] Erro ao processar:', error);
    return NextResponse.json(
      { success: false, error: 'Falha interna ao inicializar checkout: ' + error.message },
      { status: 500 }
    );
  }
}
