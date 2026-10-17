import { NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/auth/rate-limit';

export const dynamic = 'force-dynamic';

function escapeHtml(str: string): string {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
    },
  });
}

export async function POST(req: Request) {
  try {
    const forwarded = req.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : '127.0.0.1';
    const rateCheck = checkRateLimit(`email_${ip}`, 10, 60 * 1000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: 'Limite de envio atingido. Aguarde antes de tentar novamente.' },
        { status: 429 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const { type, to, userName, productName } = body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!to || typeof to !== 'string' || !emailRegex.test(to.trim())) {
      return NextResponse.json({ error: 'Destinatário (to) inválido ou ausente' }, { status: 400 });
    }

    const safeUserName = escapeHtml(userName || 'Criador');
    const safeProductName = escapeHtml(productName || 'VIP Pack');

    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const SENDER = process.env.SENDER_EMAIL_ADDRESS || 'onboarding@resend.dev';

    let subject = 'Bem-vindo à A.I VISUALS 🎨';
    let htmlContent = '';

    if (type === 'welcome') {
      subject = '🎨 Seja bem-vindo à plataforma A.I VISUALS!';
      htmlContent = `
        <div style="font-family: 'Segoe UI', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0b0c10; color: #ffffff; border-radius: 20px; padding: 40px; border: 1px solid rgba(255,255,255,0.15);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="font-size: 28px; font-weight: 900; letter-spacing: -0.5px; background: linear-gradient(135deg, #ffffff 0%, #a1a1aa 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin: 0;">A.I VISUALS</h1>
            <p style="color: #71717a; font-size: 12px; font-weight: 700; text-transform: uppercase; margin-top: 5px;">Plataforma de Prompts de Alta Performance</p>
          </div>
          <div style="background-color: rgba(255,255,255,0.05); border-radius: 16px; padding: 25px; margin-bottom: 25px; border: 1px solid rgba(255,255,255,0.1);">
            <h2 style="font-size: 20px; margin-top: 0; color: #00f2fe;">Olá, ${safeUserName}! 👋</h2>
            <p style="color: #d4d4d8; font-size: 14px; line-height: 1.6;">Sua conta foi criada com sucesso na plataforma <strong>A.I VISUALS</strong>.</p>
            <p style="color: #d4d4d8; font-size: 14px; line-height: 1.6;">Agora você tem acesso aos acervos de prompts, servidores de aulas de IA e à comunidade exclusiva de criadores.</p>
          </div>
          <div style="text-align: center; margin-top: 30px;">
            <a href="/comunidade" style="display: inline-block; background-color: #ffffff; color: #000000; font-weight: 800; font-size: 14px; text-decoration: none; padding: 14px 32px; border-radius: 12px;">Acessar Plataforma</a>
          </div>
        </div>
      `;
    } else if (type === 'purchase_success') {
      subject = `🎉 Acesso Liberado: ${safeProductName}`;
      htmlContent = `
        <div style="font-family: 'Segoe UI', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0b0c10; color: #ffffff; border-radius: 20px; padding: 40px; border: 1px solid rgba(255,255,255,0.15);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="font-size: 28px; font-weight: 900; margin: 0; color: #ffffff;">A.I VISUALS</h1>
            <p style="color: #00f2fe; font-size: 12px; font-weight: 700; text-transform: uppercase; margin-top: 5px;">Pagamento Confirmado ✅</p>
          </div>
          <div style="background-color: rgba(0, 242, 254, 0.08); border-radius: 16px; padding: 25px; margin-bottom: 25px; border: 1px solid rgba(0, 242, 254, 0.2);">
            <h2 style="font-size: 20px; margin-top: 0; color: #ffffff;">Parabéns, ${safeUserName}! 🚀</h2>
            <p style="color: #d4d4d8; font-size: 14px; line-height: 1.6;">Seu pagamento do produto <strong>${safeProductName}</strong> foi processado com sucesso!</p>
          </div>
        </div>
      `;
    } else {
      subject = body.subject || 'Notificação A.I VISUALS';
      htmlContent = body.html || `<p>${body.text || 'Notificação do sistema'}</p>`;
    }

    if (!RESEND_API_KEY) {
      console.warn('RESEND_API_KEY ausente. E-mail simulado com sucesso para:', to);
      return NextResponse.json({ success: true, simulated: true, to, subject });
    }

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `A.I VISUALS <${SENDER}>`,
        to: [to],
        subject,
        html: htmlContent,
      }),
    });

    const data = await response.json();
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: 'Erro ao enviar e-mail: ' + err.message }, { status: 500 });
  }
}
