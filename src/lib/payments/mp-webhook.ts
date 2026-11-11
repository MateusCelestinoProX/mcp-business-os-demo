import crypto from 'node:crypto';

/**
 * ============================================================
 * VERIFICADOR CRIPTOGRÁFICO DE WEBHOOK MERCADO PAGO
 * ============================================================
 * - Validação HMAC-SHA256 com tempo constante (crypto.timingSafeEqual)
 * - Janela temporal anti-replay (padrão <= 300s)
 * - Idempotência por paymentId para prevenir replay de créditos
 * - Falha fechada (fail-closed) em NODE_ENV === 'production'
 */

const REPLAY_WINDOW_SECONDS = 300;
const processedPaymentIds = new Map<string, number>();
const MAX_PROCESSED_IDS = 10_000;

export function hasProcessedPayment(paymentId: string): boolean {
  const ts = processedPaymentIds.get(paymentId);
  if (!ts) return false;
  if (Date.now() - ts > 24 * 60 * 60 * 1000) {
    processedPaymentIds.delete(paymentId);
    return false;
  }
  return true;
}

export function markPaymentProcessed(paymentId: string): void {
  if (processedPaymentIds.size >= MAX_PROCESSED_IDS) {
    const firstKey = processedPaymentIds.keys().next().value;
    if (firstKey) processedPaymentIds.delete(firstKey);
  }
  processedPaymentIds.set(paymentId, Date.now());
}

export interface WebhookSignatureCheck {
  ok: boolean;
  valid: boolean;
  status: 200 | 400 | 401 | 403 | 503;
  reason?: string;
}

export function verifyMercadoPagoWebhookSignature(params: {
  xSignature: string | null;
  xRequestId: string | null;
  dataId: string | null;
  webhookSecret?: string;
}): WebhookSignatureCheck {
  const isProd = process.env.NODE_ENV === 'production';
  const secret = (params.webhookSecret || process.env.MERCADOPAGO_WEBHOOK_SECRET || '').trim();

  if (!secret) {
    if (isProd) {
      return {
        ok: false,
        valid: false,
        status: 503,
        reason: 'Configuração de segurança do webhook ausente.',
      };
    }
    // Permite testes de integração locais sandbox sem secret explícito somente fora de produção
    if (!params.xSignature) {
      return { ok: true, valid: true, status: 200 };
    }
    return {
      ok: false,
      valid: false,
      status: 403,
      reason: 'Assinatura enviada sem MERCADOPAGO_WEBHOOK_SECRET configurado.',
    };
  }

  if (!params.xSignature || !params.xRequestId || !params.dataId) {
    return {
      ok: false,
      valid: false,
      status: 403,
      reason: 'Cabeçalhos criptográficos de assinatura ou identificador de pagamento ausentes.',
    };
  }

  let ts = '';
  let v1 = '';
  for (const part of params.xSignature.split(',')) {
    const eqIdx = part.indexOf('=');
    if (eqIdx === -1) continue;
    const key = part.slice(0, eqIdx).trim().toLowerCase();
    const val = part.slice(eqIdx + 1).trim();
    if (key === 'ts') ts = val;
    if (key === 'v1') v1 = val;
  }

  if (!ts || !v1 || !/^\d+$/.test(ts) || !/^[a-f0-9]{64}$/i.test(v1)) {
    return {
      ok: false,
      valid: false,
      status: 403,
      reason: 'Formato de assinatura HMAC inválido.',
    };
  }

  const tsSeconds = Number(ts);
  const nowSeconds = Math.floor(Date.now() / 1000);
  if (!Number.isFinite(tsSeconds) || Math.abs(nowSeconds - tsSeconds) > REPLAY_WINDOW_SECONDS) {
    return {
      ok: false,
      valid: false,
      status: 403,
      reason: 'Assinatura do webhook expirada (fora da janela anti-replay).',
    };
  }

  const normalizedDataId = /^[a-zA-Z0-9_-]+$/.test(params.dataId)
    ? params.dataId.toLowerCase()
    : params.dataId;
  const manifest = `id:${normalizedDataId};request-id:${params.xRequestId};ts:${ts};`;
  const expectedHex = crypto
    .createHmac('sha256', secret)
    .update(manifest)
    .digest('hex');

  const sigBuf = Buffer.from(v1.toLowerCase(), 'hex');
  const expBuf = Buffer.from(expectedHex.toLowerCase(), 'hex');

  if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
    return {
      ok: false,
      valid: false,
      status: 403,
      reason: 'Assinatura criptográfica HMAC do webhook inválida.',
    };
  }

  return { ok: true, valid: true, status: 200 };
}
