/**
 * Vercel Serverless Function: api/create-payment.js
 * Cria uma Preference do Mercado Pago Checkout Pro (Server-side)
 */
module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const body = req.body || {};
  const { productSlug, userEmail, productTitle } = body;
  if (!productSlug) return res.status(400).json({ error: 'productSlug required' });

  const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN || process.env.MERCADO_LIVRE_TOKEN || process.env.MERCADOPAGO_ACCESS_TOKEN;
  if (!MP_ACCESS_TOKEN) return res.status(500).json({ error: 'Payment not configured' });

  const PRODUCTS = {
    'ai-art':           { title: 'A.I ART PRO',      price: 120.00 },
    'ai-portraits-pro': { title: 'A.I PORTRAIT PRO', price: 120.00 },
    'ai-effects-pro':   { title: 'A.I EFFECT PRO',   price: 120.00 },
  };

  const product = PRODUCTS[productSlug];
  if (!product) return res.status(400).json({ error: 'Product not found' });

  const siteUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : (process.env.URL || 'https://ai-visuals.vercel.app');
  const preference = {
    items: [{ id: productSlug, title: productTitle || product.title, description: 'Acesso vitalício ao acervo completo de prompts de IA.', quantity: 1, currency_id: 'BRL', unit_price: product.price }],
    payer: userEmail ? { email: userEmail } : undefined,
    payment_methods: {
      excluded_payment_methods: [],
      excluded_payment_types: [],
      installments: 12
    },
    back_urls: {
      success: siteUrl + '/?payment=success&product=' + productSlug,
      failure: siteUrl + '/?payment=failure',
      pending: siteUrl + '/?payment=pending',
    },
    auto_return: 'approved',
    statement_descriptor: 'AI VISUALS',
    external_reference: productSlug + '_' + Date.now(),
    notification_url: siteUrl + '/api/payment-webhook',
  };

  try {
    const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + MP_ACCESS_TOKEN,
        'Content-Type': 'application/json',
        'X-Idempotency-Key': productSlug + '_' + Date.now()
      },
      body: JSON.stringify(preference),
    });
    const data = await response.json();
    if (!response.ok) return res.status(500).json({ error: 'MP API error', details: data });
    return res.status(200).json({ id: data.id, init_point: data.init_point, sandbox_init_point: data.sandbox_init_point });
  } catch (err) {
    return res.status(500).json({ error: 'Network error: ' + err.message });
  }
};
