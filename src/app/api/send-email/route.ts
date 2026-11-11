import { NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/auth/rate-limit';
import { verifyAdminRequest, denyAdminRequest } from '@/lib/auth/admin-guard';
import { getClientIp } from '@/lib/security/request-ip';
import { isTrustedOrigin } from '@/lib/security/url-guard';
import { escapeHtml, stripCrlf } from '@/lib/security/sanitize';

export const dynamic = 'force-dynamic';

export async function OPTIONS(req: Request) {
  const origin = req.headers.get('origin') || '';
  const allowed = isTrustedOrigin(origin);

  const headers: Record<string, string> = {
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-internal-secret',
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
    const ip = getClientIp(req);
    const rateCheck = checkRateLimit(`email_${ip}`, 10, 60 * 1000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: 'Limite de envio atingido. Aguarde antes de tentar novamente.' },
        { status: 429 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const { type, to, userName, productName } = body;

    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/;
    if (!to || typeof to !== 'string' || !emailRegex.test(to.trim()) || /[\r\n]/.test(to)) {
      return NextResponse.json({ error: 'Destinatário (to) inválido ou ausente' }, { status: 400 });
    }

    const cleanTo = stripCrlf(to.trim());
    const safeUserName = escapeHtml(stripCrlf(userName || 'Criador'));
    const safeProductName = escapeHtml(stripCrlf(productName || 'VIP Pack'));

    const isProd = process.env.NODE_ENV === 'production';
    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const SENDER = process.env.SENDER_EMAIL_ADDRESS || 'onboarding@resend.dev';

    let subject = 'Bem-vindo ao Business OS Demo 🎨';
    let htmlContent = '';

    if (type === 'welcome') {
      // Em produção, disparos transacionais exigem autenticação admin ou chave interna de serviço
      if (isProd) {
        const auth = await verifyAdminRequest(req);
        const internalKey = process.env.INTERNAL_SERVICE_KEY;
        const reqSecret = req.headers.get('x-internal-secret');
        const isInternalAuthorized = internalKey && reqSecret === internalKey;
        if (!auth.authorized && !isInternalAuthorized) {
          return denyAdminRequest(auth);
        }
      }

      subject = '🎨 Seja bem-vindo ao Business OS Demo!';
      htmlContent = `
        <div style="font-family: 'Segoe UI', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0b0c10; color: #ffffff; border-radius: 20px; padding: 40px; border: 1px solid rgba(255,255,255,0.15);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="font-size: 28px; font-weight: 900; letter-spacing: -0.5px; background: linear-gradient(135deg, #ffffff 0%, #a1a1aa 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin: 0;">BUSINESS OS DEMO</h1>
            <p style="color: #71717a; font-size: 12px; font-weight: 700; text-transform: uppercase; margin-top: 5px;">Plataforma de Infoprodutos e Software Demo</p>
          </div>
          <div style="background-color: rgba(255,255,255,0.05); border-radius: 16px; padding: 25px; margin-bottom: 25px; border: 1px solid rgba(255,255,255,0.1);">
            <h2 style="font-size: 20px; margin-top: 0; color: #00f2fe;">Olá, ${safeUserName}! 👋</h2>
            <p style="color: #d4d4d8; font-size: 14px; line-height: 1.6;">Sua conta foi criada com sucesso na plataforma <strong>Business OS Demo</strong>.</p>
            <p style="color: #d4d4d8; font-size: 14px; line-height: 1.6;">Agora você tem acesso aos infoprodutos, recursos e experiências da plataforma.</p>
          </div>
          <div style="text-align: center; margin-top: 30px;">
            <a href="/comunidade" style="display: inline-block; background-color: #ffffff; color: #000000; font-weight: 800; font-size: 14px; text-decoration: none; padding: 14px 32px; border-radius: 12px;">Acessar Plataforma</a>
          </div>
        </div>
      `;
    } else if (type === 'purchase_success') {
      if (isProd) {
        const auth = await verifyAdminRequest(req);
        const internalKey = process.env.INTERNAL_SERVICE_KEY;
        const reqSecret = req.headers.get('x-internal-secret');
        const isInternalAuthorized = internalKey && reqSecret === internalKey;
        if (!auth.authorized && !isInternalAuthorized) {
          return denyAdminRequest(auth);
        }
      }

      subject = `🎉 Acesso Liberado: ${safeProductName}`;
      htmlContent = `
        <div style="font-family: 'Segoe UI', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0b0c10; color: #ffffff; border-radius: 20px; padding: 40px; border: 1px solid rgba(255,255,255,0.15);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="font-size: 28px; font-weight: 900; margin: 0; color: #ffffff;">BUSINESS OS DEMO</h1>
            <p style="color: #00f2fe; font-size: 12px; font-weight: 700; text-transform: uppercase; margin-top: 5px;">Pagamento Confirmado ✅</p>
          </div>
          <div style="background-color: rgba(0, 242, 254, 0.08); border-radius: 16px; padding: 25px; margin-bottom: 25px; border: 1px solid rgba(0, 242, 254, 0.2);">
            <h2 style="font-size: 20px; margin-top: 0; color: #ffffff;">Parabéns, ${safeUserName}! 🚀</h2>
            <p style="color: #d4d4d8; font-size: 14px; line-height: 1.6;">Seu pagamento do produto <strong>${safeProductName}</strong> foi processado com sucesso!</p>
          </div>
        </div>
      `;
    } else {
      // O envio de e-mails customizados com assunto ou HTML livre exige estritamente autenticação de administrador
      const auth = await verifyAdminRequest(req);
      if (!auth.authorized) {
        return denyAdminRequest(auth);
      }
      subject = escapeHtml(stripCrlf(body.subject || 'Notificação Business OS Demo'));
      htmlContent = body.html || `<p>${escapeHtml(body.text || 'Notificação do sistema')}</p>`;
    }

    if (!RESEND_API_KEY) {
      console.warn('RESEND_API_KEY ausente. E-mail simulado com sucesso para:', cleanTo);
      return NextResponse.json({ success: true, simulated: true, to: cleanTo, subject });
    }

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `Business OS Demo <${SENDER}>`,
        to: [cleanTo],
        subject,
        html: htmlContent,
      }),
    });

    const data = await response.json();
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (err: any) {
    console.error('❌ [Send Email] Erro interno:', err);
    return NextResponse.json({ error: 'Erro interno ao enviar e-mail' }, { status: 500 });
  }
}
