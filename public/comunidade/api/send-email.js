/**
 * Vercel Serverless Function: api/send-email.js
 * Integração Backend de E-mails Transacionais via Resend + Supabase
 */
module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { type, to, userName, productName, productSlug } = req.body || {};

  if (!to) {
    return res.status(400).json({ error: 'Destinatário (to) é obrigatório' });
  }

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
          <p style="color: #71717a; font-size: 12px; font-weight: 700; text-transform: uppercase; tracking: 2px; margin-top: 5px;">Plataforma de Prompts de Alta Performance</p>
        </div>
        <div style="background-color: rgba(255,255,255,0.05); border-radius: 16px; padding: 25px; margin-bottom: 25px; border: 1px solid rgba(255,255,255,0.1);">
          <h2 style="font-size: 20px; margin-top: 0; color: #00f2fe;">Olá, ${userName || 'Criador'}! 👋</h2>
          <p style="color: #d4d4d8; font-size: 14px; line-height: 1.6;">Sua conta foi criada com sucesso na plataforma <strong>A.I VISUALS</strong>.</p>
          <p style="color: #d4d4d8; font-size: 14px; line-height: 1.6;">Agora você tem acesso aos acervos de prompts, servidores de aulas de IA e à comunidade exclusiva de criadores.</p>
        </div>
        <div style="text-align: center; margin-top: 30px;">
          <a href="https://ai-visuals.vercel.app" style="display: inline-block; background-color: #ffffff; color: #000000; font-weight: 800; font-size: 14px; text-decoration: none; padding: 14px 32px; border-radius: 12px; transition: all 0.3s ease;">Acessar Plataforma</a>
        </div>
        <div style="border-t: 1px solid rgba(255,255,255,0.1); margin-top: 40px; padding-top: 20px; text-align: center; font-size: 11px; color: #52525b;">
          <p>© 2026 A.I VISUALS — Todos os direitos reservados.</p>
        </div>
      </div>
    `;
  } else if (type === 'purchase_success') {
    subject = `🎉 Acesso Liberado: ${productName || 'A.I PRO Pack'}`;
    htmlContent = `
      <div style="font-family: 'Segoe UI', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0b0c10; color: #ffffff; border-radius: 20px; padding: 40px; border: 1px solid rgba(255,255,255,0.15);">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="font-size: 28px; font-weight: 900; margin: 0; color: #ffffff;">A.I VISUALS</h1>
          <p style="color: #00f2fe; font-size: 12px; font-weight: 700; text-transform: uppercase; margin-top: 5px;">Pagamento Confirmado ✅</p>
        </div>
        <div style="background-color: rgba(0, 242, 254, 0.08); border-radius: 16px; padding: 25px; margin-bottom: 25px; border: 1px solid rgba(0, 242, 254, 0.2);">
          <h2 style="font-size: 20px; margin-top: 0; color: #ffffff;">Parabéns, ${userName || 'Membro VIP'}! 🚀</h2>
          <p style="color: #d4d4d8; font-size: 14px; line-height: 1.6;">Seu pagamento do produto <strong>${productName || 'VIP Pack'}</strong> foi processado com sucesso!</p>
          <p style="color: #d4d4d8; font-size: 14px; line-height: 1.6;">O seu acesso vitalício aos prompts com cópia em 1-clique e downloads está liberado.</p>
        </div>
        <div style="text-align: center; margin-top: 30px;">
          <a href="https://ai-visuals.vercel.app" style="display: inline-block; background-color: #00f2fe; color: #000000; font-weight: 800; font-size: 14px; text-decoration: none; padding: 14px 32px; border-radius: 12px;">Ir para o Acervo VIP</a>
        </div>
      </div>
    `;
  } else {
    subject = req.body.subject || 'Notificação A.I VISUALS';
    htmlContent = req.body.html || `<p>${req.body.text || 'Notificação do sistema'}</p>`;
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: SENDER,
        to: Array.isArray(to) ? to : [to],
        subject: subject,
        html: htmlContent
      })
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ error: 'Erro na API do Resend', details: data });
    }

    return res.status(200).json({ success: true, id: data.id, message: 'E-mail transacional enviado com sucesso via Resend!' });
  } catch (err) {
    return res.status(500).json({ error: 'Erro de conexão: ' + err.message });
  }
};
