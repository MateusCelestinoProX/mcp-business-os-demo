import crypto from 'node:crypto';
import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db, isDbConfigured } from '@/lib/db';
import { members, adminUsers } from '@/lib/db/schema';
import { hashPassword } from '@/lib/auth/auth';
import { createSession } from '@/lib/auth/session';
import { checkRateLimit } from '@/lib/auth/rate-limit';
import { getClientIp } from '@/lib/security/request-ip';
import { isTrustedOrigin } from '@/lib/security/url-guard';
import { NO_STORE_HEADERS } from '@/lib/auth/admin-guard';
import type { SessionPayload } from '@/lib/auth/jwt';

export async function POST(req: Request) {
  try {
    // 0. Proteção CSRF via verificação estrita de origem
    const origin = req.headers.get('origin');
    if (origin && !isTrustedOrigin(origin)) {
      return NextResponse.json(
        { success: false, error: 'Violação de política CSRF: Origem não autorizada.' },
        { status: 403, headers: NO_STORE_HEADERS }
      );
    }

    // Rate Limiting confiável de Cadastros
    const ip = getClientIp(req);
    const limit = process.env.NODE_ENV === 'production' ? 5 : 50;
    const rateCheck = checkRateLimit(`register_${ip}`, limit, 60 * 60 * 1000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { success: false, error: 'Muitos cadastros a partir deste endereço IP. Aguarde antes de tentar novamente.' },
        { status: 429, headers: NO_STORE_HEADERS }
      );
    }

    const body = await req.json().catch(() => ({}));
    const { name, email, password } = body;

    // 1. Validação rigorosa de dados de entrada
    if (!name || typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 120) {
      return NextResponse.json(
        { success: false, error: 'O nome completo deve ter ao menos 2 caracteres.' },
        { status: 400, headers: NO_STORE_HEADERS }
      );
    }

    const emailRegex = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/;
    const cleanEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
    if (!cleanEmail || cleanEmail.length > 254 || !emailRegex.test(cleanEmail)) {
      return NextResponse.json(
        { success: false, error: 'Forneça um endereço de e-mail válido.' },
        { status: 400, headers: NO_STORE_HEADERS }
      );
    }

    if (!password || typeof password !== 'string' || password.length < 6 || password.length > 128) {
      return NextResponse.json(
        { success: false, error: 'A senha deve conter no mínimo 6 caracteres.' },
        { status: 400, headers: NO_STORE_HEADERS }
      );
    }

    // 2. Proteção de reserva: impede cadastro de membro com o e-mail do administrador soberano
    const masterEmail = (process.env.ADMIN_EMAIL || 'mcp6667@proton.me').toLowerCase().trim();
    if (cleanEmail === masterEmail) {
      return NextResponse.json(
        { success: false, error: 'Este e-mail é reservado pelo sistema.' },
        { status: 409, headers: NO_STORE_HEADERS }
      );
    }

    // 3. Verificar duplicidade de e-mail e conflito com adminUsers no banco
    if (isDbConfigured) {
      try {
        const [existingMember, existingAdmin] = await Promise.all([
          db
            .select({ id: members.id, email: members.email })
            .from(members)
            .where(eq(members.email, cleanEmail))
            .limit(1),
          db
            .select({ id: adminUsers.id, email: adminUsers.email })
            .from(adminUsers)
            .where(eq(adminUsers.email, cleanEmail))
            .limit(1),
        ]);

        if (existingAdmin.length > 0) {
          return NextResponse.json(
            { success: false, error: 'Este e-mail é reservado pelo sistema.' },
            { status: 409, headers: NO_STORE_HEADERS }
          );
        }

        if (existingMember.length > 0) {
          return NextResponse.json(
            { success: false, error: 'Este e-mail já está cadastrado na comunidade fechada.' },
            { status: 409, headers: NO_STORE_HEADERS }
          );
        }
      } catch (dbErr) {
        console.error('❌ [Register] Falha crítica ao consultar duplicidade no banco:', dbErr);
        return NextResponse.json(
          { success: false, error: 'Serviço de cadastro temporariamente indisponível.' },
          { status: 503, headers: NO_STORE_HEADERS }
        );
      }
    }

    // 4. Gerar hash de senha seguro
    const passwordHash = await hashPassword(password);
    let memberId = crypto.randomUUID();

    // 5. Inserir novo membro quando o banco estiver configurado
    if (isDbConfigured) {
      try {
        const [inserted] = await db
          .insert(members)
          .values({
            id: memberId,
            name: name.trim(),
            email: cleanEmail,
            passwordHash,
            tier: 'free',
            status: 'active',
          })
          .returning();

        if (inserted?.id) {
          memberId = inserted.id;
        }
      } catch (insertErr: any) {
        console.error('❌ [Register] Erro ao persistir membro no banco:', insertErr);
        if (insertErr?.code === '23505') {
          return NextResponse.json(
            { success: false, error: 'Este e-mail já está cadastrado na comunidade fechada.' },
            { status: 409, headers: NO_STORE_HEADERS }
          );
        }
        return NextResponse.json(
          { success: false, error: 'Falha ao persistir cadastro. Tente novamente.' },
          { status: 503, headers: NO_STORE_HEADERS }
        );
      }
    }

    // 6. Emitir sessão JWT e gravar Cookie HTTP-Only seguro
    const payload: SessionPayload = {
      userId: memberId,
      email: cleanEmail,
      name: name.trim(),
      role: 'member',
      tier: 'free',
    };

    const token = await createSession(payload);

    return NextResponse.json(
      {
        success: true,
        message: 'Bem-vindo à Área de Membros Soberana!',
        member: {
          id: memberId,
          name: name.trim(),
          email: cleanEmail,
          tier: 'free',
          status: 'active',
        },
        token,
      },
      { status: 201, headers: NO_STORE_HEADERS }
    );
  } catch (error: any) {
    console.error('❌ [Register] Erro interno:', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno ao processar cadastro.' },
      { status: 500, headers: NO_STORE_HEADERS }
    );
  }
}
