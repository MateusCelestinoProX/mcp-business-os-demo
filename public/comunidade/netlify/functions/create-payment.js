/**
 * Netlify Function: create-payment.js
 * Cria uma Preference do Mercado Pago Checkout Pro (server-side)
 * O Access Token NUNCA vai para o frontend.
 */
exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };

  let body;
  try { body = JSON.parse(event.body || '{}'); } catch { return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid JSON' }) }; }

  const { productSlug, userEmail, productTitle } = body;
  if (!productSlug) return { statusCode: 400, headers, body: JSON.stringify({ error: 'productSlug required' }) };

  const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN;
  if (!MP_ACCESS_TOKEN) return { statusCode: 500, headers, body: JSON.stringify({ error: 'Payment not configured' }) };

  const PRODUCTS = {
    'ai-art':           { title: 'A.I ART PRO',      price: 120.00 },
    'ai-portraits-pro': { title: 'A.I PORTRAIT PRO', price: 120.00 },
    'ai-effects-pro':   { title: 'A.I EFFECT PRO',   price: 120.00 },
  };

  const product = PRODUCTS[productSlug];
  if (!product) return { statusCode: 400, headers, body: JSON.stringify({ error: 'Product not found' }) };

  const siteUrl = process.env.URL || 'https://ai-visuals.netlify.app';
  const preference = {
    items: [{ id: productSlug, title: productTitle || product.title, description: 'Acesso vitalício ao acervo completo de prompts de IA.', quantity: 1, currency_id: 'BRL', unit_price: product.price }],
    payer: userEmail ? { email: userEmail } : undefined,
    back_urls: {
      success: siteUrl + '/?payment=success&product=' + productSlug,
      failure: siteUrl + '/?payment=failure',
      pending: siteUrl + '/?payment=pending',
    },
    auto_return: 'approved',
    statement_descriptor: 'AI VISUALS',
    external_reference: productSlug + '_' + Date.now(),
    notification_url: siteUrl + '/.netlify/functions/payment-webhook',
  };

  try {
    const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + MP_ACCESS_TOKEN, 'Content-Type': 'application/json', 'X-Idempotency-Key': productSlug + '_' + Date.now() },
      body: JSON.stringify(preference),
    });
    const data = await response.json();
    if (!response.ok) return { statusCode: 500, headers, body: JSON.stringify({ error: 'MP API error', details: data }) };
    return { statusCode: 200, headers, body: JSON.stringify({ id: data.id, init_point: data.init_point, sandbox_init_point: data.sandbox_init_point }) };
  } catch (err) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Network error: ' + err.message }) };
  }
};
