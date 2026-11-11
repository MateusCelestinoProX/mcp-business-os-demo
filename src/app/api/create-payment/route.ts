import { NextResponse } from 'next/server';
import { isTrustedOrigin, getTrustedSiteUrl } from '@/lib/security/url-guard';

export const dynamic = 'force-dynamic';

export async function OPTIONS(req: Request) {
  const origin = req.headers.get('origin') || '';
  const allowed = isTrustedOrigin(origin);

  const headers: Record<string, string> = {
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Vary': 'Origin',
  };

  if (allowed && origin) {
    headers['Access-Control-Allow-Origin'] = origin;
  }

  return new NextResponse(null, {
    status: 200,
    headers,
  });
}

export async function POST(req: Request) {
  try {
    const origin = req.headers.get('origin');
    if (origin && !isTrustedOrigin(origin)) {
      return NextResponse.json({ error: 'Origem não autorizada' }, { status: 403 });
    }

    const body = await req.json().catch(() => ({}));
    const { productSlug, userEmail } = body;
    if (!productSlug || typeof productSlug !== 'string') {
      return NextResponse.json({ error: 'productSlug required' }, { status: 400 });
    }

    const isProd = process.env.NODE_ENV === 'production';
    const MP_ACCESS_TOKEN =
      process.env.MP_ACCESS_TOKEN ||
      process.env.MERCADO_LIVRE_TOKEN ||
      process.env.MERCADOPAGO_ACCESS_TOKEN;

    const isMockToken = !MP_ACCESS_TOKEN || MP_ACCESS_TOKEN === 'TEST-MOCK-TOKEN' || MP_ACCESS_TOKEN.includes('placeholder');

    const PRODUCTS: Record<string, { title: string; price: number }> = {
      'ai-art': { title: 'A.I ART PRO', price: 120.0 },
      'ai-portraits-pro': { title: 'A.I PORTRAIT PRO', price: 120.0 },
      'ai-effects-pro': { title: 'A.I EFFECT PRO', price: 120.0 },
    };

    const product = PRODUCTS[productSlug];
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 400 });
    }

    const siteUrl = getTrustedSiteUrl(req);
    const safeEmail = typeof userEmail === 'string' ? userEmail.trim().slice(0, 255) : undefined;
    const externalRef = `${productSlug}_${Date.now()}`;

    const preference = {
      items: [
        {
          id: productSlug,
          title: product.title,
          description: 'Acesso vitalício ao acervo completo de prompts de IA.',
          quantity: 1,
          currency_id: 'BRL',
          unit_price: product.price,
        },
      ],
      payer: safeEmail ? { email: safeEmail } : undefined,
      payment_methods: {
        excluded_payment_methods: [],
        excluded_payment_types: [],
        installments: 12,
      },
      back_urls: {
        success: `${siteUrl}/comunidade?payment=success&product=${productSlug}`,
        failure: `${siteUrl}/comunidade?payment=failure`,
        pending: `${siteUrl}/comunidade?payment=pending`,
      },
      auto_return: 'approved',
      statement_descriptor: 'AI VISUALS',
      external_reference: externalRef,
      notification_url: `${siteUrl}/api/payment/webhook`,
    };

    if (MP_ACCESS_TOKEN && !isMockToken) {
      const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + MP_ACCESS_TOKEN,
          'Content-Type': 'application/json',
          'X-Idempotency-Key': externalRef,
        },
        body: JSON.stringify(preference),
      });

      const data = await response.json();
      if (!response.ok) {
        if (isProd) {
          return NextResponse.json({ error: 'Falha na comunicação com gateway de pagamento' }, { status: 502 });
        }
        return NextResponse.json({
          id: 'pref_demo_' + Date.now(),
          init_point: 'https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=demo',
          sandbox_init_point: 'https://sandbox.mercadopago.com.br/checkout/v1/redirect?pref_id=demo',
          warning: 'Mercado Pago token não configurado ou em modo sandbox',
        });
      }

      return NextResponse.json({
        id: data.id,
        init_point: data.init_point,
        sandbox_init_point: data.sandbox_init_point,
      });
    }

    if (isProd) {
      return NextResponse.json({ error: 'Serviço de pagamentos indisponível no momento' }, { status: 503 });
    }

    return NextResponse.json({
      id: 'pref_demo_' + Date.now(),
      init_point: 'https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=demo',
      sandbox_init_point: 'https://sandbox.mercadopago.com.br/checkout/v1/redirect?pref_id=demo',
      warning: 'Modo sandbox de desenvolvimento local ativo',
    });
  } catch (err: any) {
    console.error('Erro em /api/create-payment:', err);
    return NextResponse.json({ error: 'Falha ao processar pagamento' }, { status: 500 });
  }
}
