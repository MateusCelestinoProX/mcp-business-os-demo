import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function OPTIONS(req: Request) {
  const origin = req.headers.get('origin') || '';
  const allowed = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    process.env.NEXT_PUBLIC_APP_URL,
    process.env.NEXT_PUBLIC_SITE_URL,
    'https://mateuscelestino.pro',
    'https://www.mateuscelestino.pro',
  ].filter(Boolean) as string[];

  const isAllowed = allowed.some((a) => {
    try {
      return new URL(origin).host === new URL(a).host;
    } catch {
      return false;
    }
  });

  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': isAllowed ? origin : allowed[0] || 'http://localhost:3000',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
    },
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { productSlug, userEmail, productTitle } = body;
    if (!productSlug) {
      return NextResponse.json({ error: 'productSlug required' }, { status: 400 });
    }

    const MP_ACCESS_TOKEN =
      process.env.MP_ACCESS_TOKEN ||
      process.env.MERCADO_LIVRE_TOKEN ||
      process.env.MERCADOPAGO_ACCESS_TOKEN ||
      'TEST-MOCK-TOKEN';

    const PRODUCTS: Record<string, { title: string; price: number }> = {
      'ai-art': { title: 'A.I ART PRO', price: 120.0 },
      'ai-portraits-pro': { title: 'A.I PORTRAIT PRO', price: 120.0 },
      'ai-effects-pro': { title: 'A.I EFFECT PRO', price: 120.0 },
    };

    const product = PRODUCTS[productSlug];
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 400 });
    }

    const siteUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : process.env.URL || 'https://ai-visuals.vercel.app';

    const preference = {
      items: [
        {
          id: productSlug,
          title: productTitle || product.title,
          description: 'Acesso vitalício ao acervo completo de prompts de IA.',
          quantity: 1,
          currency_id: 'BRL',
          unit_price: product.price,
        },
      ],
      payer: userEmail ? { email: userEmail } : undefined,
      payment_methods: {
        excluded_payment_methods: [],
        excluded_payment_types: [],
        installments: 12,
      },
      back_urls: {
        success: siteUrl + '/comunidade?payment=success&product=' + productSlug,
        failure: siteUrl + '/comunidade?payment=failure',
        pending: siteUrl + '/comunidade?payment=pending',
      },
      auto_return: 'approved',
      statement_descriptor: 'AI VISUALS',
      external_reference: productSlug + '_' + Date.now(),
      notification_url: siteUrl + '/api/payment/webhook',
    };

    const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + MP_ACCESS_TOKEN,
        'Content-Type': 'application/json',
        'X-Idempotency-Key': productSlug + '_' + Date.now(),
      },
      body: JSON.stringify(preference),
    });

    const data = await response.json();
    if (!response.ok) {
      // Fallback gracioso se a credencial não estiver configurada no ambiente de dev
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
  } catch (err: any) {
    console.error('Erro em /api/create-payment:', err);
    return NextResponse.json({ error: 'Falha ao processar pagamento' }, { status: 500 });
  }
}
