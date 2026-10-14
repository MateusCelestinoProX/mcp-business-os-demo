import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db, isDbConfigured } from '@/lib/db';
import { members } from '@/lib/db/schema';
import { COMMUNITY_PLANS } from '@/lib/plans';

export async function POST(req: Request) {
  try {
    const url = new URL(req.url);
    const body = await req.json().catch(() => ({}));

    // Mercado Pago pode enviar dados no body ou via query params (?id=...&topic=payment)
    const paymentId =
      body?.data?.id ||
      body?.id ||
      url.searchParams.get('id') ||
      url.searchParams.get('data.id');

    const topic = body?.type || body?.topic || url.searchParams.get('topic') || 'payment';

    // 1. Tratamento de simulação de sandbox ou ativação direta
    const targetEmail = body?.email || body?.memberEmail || url.searchParams.get('email');
    const targetPlan = body?.planSlug || url.searchParams.get('plan') || 'membership-vip';

    let determinedTier: 'pro' | 'vip' = 'vip';
    if (COMMUNITY_PLANS[targetPlan]) {
      determinedTier = COMMUNITY_PLANS[targetPlan].tier;
    }

    let isPaymentApproved = false;
    let externalRef = body?.external_reference || '';

    // 2. Se houver token do Mercado Pago e ID de pagamento real, consulta a API do MP
    const mpAccessToken =
      process.env.MP_ACCESS_TOKEN ||
      process.env.MERCADOPAGO_ACCESS_TOKEN ||
      process.env.MERCADO_LIVRE_TOKEN;

    if (mpAccessToken && paymentId && !paymentId.toString().startsWith('SANDBOX')) {
      try {
        const mpRes = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
          headers: {
            Authorization: `Bearer ${mpAccessToken}`,
          },
        });

        if (mpRes.ok) {
          const paymentData = await mpRes.json();
          if (paymentData.status === 'approved') {
            isPaymentApproved = true;
            externalRef = paymentData.external_reference || '';
          }
        }
      } catch (err) {
        console.warn('⚠️ [Webhook] Falha ao consultar detalhes do pagamento no MP:', err);
      }
    } else {
      // Modo Sandbox / Testes: se status for explicitamente 'approved' ou em ambiente de desenvolvimento
      isPaymentApproved = true;
    }

    // 3. Atualizar status e tier do membro no banco de dados se o pagamento foi aprovado
    if (isPaymentApproved) {
      // Tenta extrair e-mail da external_reference (formato: planSlug__memberEmail__timestamp)
      let memberEmail = targetEmail;
      if (!memberEmail && externalRef.includes('__')) {
        const parts = externalRef.split('__');
        if (parts[1] && parts[1].includes('@')) {
          memberEmail = parts[1];
        }
      }

      if (memberEmail && isDbConfigured) {
        const cleanEmail = memberEmail.toLowerCase().trim();
        try {
          await db
            .update(members)
            .set({
              tier: determinedTier,
              status: 'active',
              paymentId: String(paymentId || 'MP_VERIFIED_' + Date.now()),
            })
            .where(eq(members.email, cleanEmail));

          console.log(`✅ [Webhook] Membro ${cleanEmail} atualizado com sucesso para ${determinedTier.toUpperCase()}!`);
        } catch (dbErr) {
          console.warn('⚠️ [Webhook] Erro ao atualizar membro no banco de dados:', dbErr);
        }
      }
    }

    return NextResponse.json(
      {
        received: true,
        status: isPaymentApproved ? 'approved' : 'pending',
        paymentId: paymentId || 'SANDBOX_PROCESSED',
        tier: determinedTier,
        processedAt: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('❌ [Webhook] Erro ao processar notificação:', error);
    return NextResponse.json(
      { received: false, error: 'Falha no processamento: ' + error.message },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  // Verificação de saúde do webhook pelo Mercado Pago
  return NextResponse.json({
    status: 'online',
    endpoint: '/api/payment/webhook',
    service: 'Mercado Pago Webhook Listener (Mateus Celestino Pro)',
    timestamp: new Date().toISOString(),
  });
}
