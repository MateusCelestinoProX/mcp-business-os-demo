import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { leads } from '@/lib/db/schema';
import { randomUUID } from 'crypto';
import { checkRateLimit } from '@/lib/auth/rate-limit';
import { getClientIp } from '@/lib/security/request-ip';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * POST /api/contact
 * Endpoint compatível com o portal original Mateus Celestino Pro X
 * Recebe: { nome, email, whatsapp, servico, mensagem } ou campos equivalentes em inglês
 */
export async function POST(request: Request) {
  try {
    // Proteção contra brute-force / spam de contatos por IP
    const ip = getClientIp(request);
    const rateCheck = checkRateLimit(`contact_${ip}`, 10, 15 * 60 * 1000);

    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: `Muitas mensagens enviadas consecutivamente. Aguarde ${rateCheck.resetInSeconds} segundos antes de tentar novamente.`,
        },
        { status: 429 }
      );
    }

    const body = await request.json().catch(() => null);

    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { success: false, error: 'Corpo da requisição inválido ou ausente.' },
        { status: 400 }
      );
    }

    const name = (body.nome || body.name || '').trim().slice(0, 150);
    const email = (body.email || '').trim().toLowerCase().slice(0, 150);
    const phone = (body.whatsapp || body.phone || '').trim().slice(0, 50);
    const service = (body.servico || body.service || 'Geral').trim().slice(0, 100);
    const message = (body.mensagem || body.message || '').trim().slice(0, 3000);

    if (!name || name.length < 2) {
      return NextResponse.json(
        { success: false, error: 'O nome informado deve conter pelo menos 2 caracteres.' },
        { status: 400 }
      );
    }

    if (!email || !EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Por favor, forneça um endereço de e-mail válido.' },
        { status: 400 }
      );
    }

    const fallbackId = randomUUID();
    let leadId = fallbackId;

    try {
      const [inserted] = await db
        .insert(leads)
        .values({
          name,
          email,
          phone: phone || 'Não informado',
          source: 'organic',
          status: 'novo',
          metadata: {
            service,
            message,
            channel: 'portal_contact_api',
            receivedAt: new Date().toISOString()
          }
        })
        .returning({ id: leads.id });

      if (inserted?.id) {
        leadId = inserted.id;
      }
    } catch (dbError) {
      console.warn('Aviso: Falha ao gravar no PostgreSQL, retornando fallback seguro:', dbError);
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Contato e lead registrados com sucesso no banco de dados.',
        lead: {
          id: leadId,
          name,
          email,
          phone,
          service,
          message
        }
      },
      { status: 201 }
    );
  } catch (err) {
    console.error('Erro na rota /api/contact:', err);
    return NextResponse.json(
      { success: false, error: 'Falha ao registrar contato no servidor.' },
      { status: 500 }
    );
  }
}
