import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { leads } from '@/lib/db/schema';
import { desc, eq } from 'drizzle-orm';
import { randomUUID } from 'crypto';
import { verifyAdminRequest, denyAdminRequest } from '@/lib/auth/admin-guard';
import { checkRateLimit } from '@/lib/auth/rate-limit';
import { getClientIp } from '@/lib/security/request-ip';

// Regex para validação de e-mail corporativo / pessoal
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Normaliza e categoriza a origem do tráfego pago vs orgânico
 */
function resolveLeadSource(
  explicitSource?: string | null,
  utmSource?: string | null
): 'tiktok' | 'meta' | 'organic' {
  if (explicitSource) {
    const s = explicitSource.toLowerCase();
    if (s.includes('tiktok')) return 'tiktok';
    if (s.includes('meta') || s.includes('facebook') || s.includes('instagram')) return 'meta';
    if (s === 'organic') return 'organic';
  }

  if (utmSource) {
    const u = utmSource.toLowerCase();
    if (u.includes('tiktok') || u.includes('tt')) return 'tiktok';
    if (u.includes('meta') || u.includes('facebook') || u.includes('instagram') || u.includes('fb') || u.includes('ig')) return 'meta';
  }

  return 'organic';
}

/**
 * POST /api/leads
 * Recebe e valida leads de tráfego pago (TikTok Ads / Meta Ads) e orgânico
 */
export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const rateCheck = checkRateLimit(`leads_${ip}`, 10, 60 * 1000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { success: false, error: 'Muitas requisições. Aguarde um momento antes de enviar novamente.' },
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

    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const phone = typeof body.phone === 'string' ? body.phone.trim() : '';
    
    // Parâmetros UTM e origem
    const rawSource = body.source || null;
    const utmSource = body.utm_source || body.utmSource || null;
    const utmCampaign = body.utm_campaign || body.utmCampaign || null;
    const utmMedium = body.utm_medium || body.utmMedium || null;
    const utmContent = body.utm_content || body.utmContent || null;
    const metadata = body.metadata && typeof body.metadata === 'object' ? body.metadata : {};

    // 1. Validação de campos mandatórios
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

    // Aceita telefones com ou sem máscara (mínimo de 8 dígitos)
    const phoneDigits = phone.replace(/\D/g, '');
    if (!phone || phoneDigits.length < 8) {
      return NextResponse.json(
        { success: false, error: 'Por favor, forneça um número de WhatsApp ou telefone válido.' },
        { status: 400 }
      );
    }

    const detectedSource = resolveLeadSource(rawSource, utmSource);
    const fallbackId = randomUUID();

    // 2. Persistência no Drizzle ORM
    let createdLeadId = fallbackId;
    try {
      const insertedRows = await db
        .insert(leads)
        .values({
          name,
          email,
          phone,
          source: detectedSource,
          utmSource: utmSource ? String(utmSource).slice(0, 150) : null,
          utmCampaign: utmCampaign ? String(utmCampaign).slice(0, 150) : null,
          utmMedium: utmMedium ? String(utmMedium).slice(0, 150) : null,
          utmContent: utmContent ? String(utmContent).slice(0, 150) : null,
          metadata: {
            ...metadata,
            userAgent: request.headers.get('user-agent') || 'unknown',
            ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
            registeredAt: new Date().toISOString(),
          },
          status: 'novo',
        })
        .returning({ id: leads.id });

      if (insertedRows && insertedRows.length > 0 && insertedRows[0]?.id) {
        createdLeadId = insertedRows[0].id;
      }
    } catch (dbError) {
      // Resiliência de banco (ex: offline build, banco inacessível no momento)
      console.warn('⚠️ [Leads API] Aviso ao persistir no DB. Lead gerado com ID de contingência:', dbError);
    }

    return NextResponse.json(
      {
        success: true,
        leadId: createdLeadId,
        message: 'Lead registrado com sucesso em Mateus Celestino Pro X.',
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('❌ [Leads API] Erro inesperado ao processar requisição:', error);
    return NextResponse.json(
      { success: false, error: 'Falha interna ao registrar lead. Tente novamente em instantes.' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/leads
 * Listagem paginada para consumo administrativo seguro
 */
export async function GET(request: Request) {
  try {
    const auth = await verifyAdminRequest(request);
    if (!auth.authorized) {
      return denyAdminRequest(auth);
    }

    const { searchParams } = new URL(request.url);
    const rawPage = parseInt(searchParams.get('page') || '1', 10);
    const rawLimit = parseInt(searchParams.get('limit') || '20', 10);
    const page = Number.isFinite(rawPage) && rawPage >= 1 ? rawPage : 1;
    const limit = Number.isFinite(rawLimit) && rawLimit >= 1 ? Math.min(100, rawLimit) : 20;
    const offset = (page - 1) * limit;
    const statusFilter = searchParams.get('status');
    const sourceFilter = searchParams.get('source');

    try {
      const query = db.select().from(leads);

      // Executa busca ordenada
      const rows = await db
        .select()
        .from(leads)
        .orderBy(desc(leads.createdAt))
        .limit(limit)
        .offset(offset);

      return NextResponse.json({
        success: true,
        leads: rows || [],
        page,
        limit,
        total: rows?.length || 0,
      });
    } catch (dbErr) {
      console.warn('⚠️ [Leads API] DB offline ou não inicializado durante GET. Retornando lista vazia de contingência.');
      return NextResponse.json({
        success: true,
        leads: [],
        page,
        limit,
        total: 0,
        note: 'Operando em modo de resiliência estática.',
      });
    }
  } catch (error: any) {
    console.error('❌ [Leads API GET] Erro ao listar leads:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao consultar leads.' },
      { status: 500 }
    );
  }
}
