import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db, isDbConfigured } from '@/lib/db';
import { members } from '@/lib/db/schema';
import { hashPassword } from '@/lib/auth/auth';
import { createSession } from '@/lib/auth/session';
import type { SessionPayload } from '@/lib/auth/jwt';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { name, email, password } = body;

    // 1. Validação de dados de entrada
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: 'O nome completo deve ter ao menos 2 caracteres.' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const cleanEmail = email?.trim().toLowerCase();
    if (!cleanEmail || !emailRegex.test(cleanEmail)) {
      return NextResponse.json(
        { success: false, error: 'Forneça um endereço de e-mail válido.' },
        { status: 400 }
      );
    }

    if (!password || typeof password !== 'string' || password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'A senha deve conter no mínimo 6 caracteres.' },
        { status: 400 }
      );
    }

    // 2. Verificar duplicidade de e-mail no Drizzle ORM
    if (isDbConfigured) {
      try {
        const existing = await db
          .select({ id: members.id, email: members.email })
          .from(members)
          .where(eq(members.email, cleanEmail))
          .limit(1);

        if (existing.length > 0) {
          return NextResponse.json(
            { success: false, error: 'Este e-mail já está cadastrado na comunidade fechada.' },
            { status: 409 }
          );
        }
      } catch (dbErr) {
        console.warn('⚠️ [Register] Falha ao verificar e-mail no banco, continuando em modo resiliente:', dbErr);
      }
    }

    // 3. Gerar hash de senha seguro
    const passwordHash = await hashPassword(password);
    let memberId = crypto.randomUUID();

    // 4. Inserir novo membro na tabela members
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
      } catch (insertErr) {
        console.warn('⚠️ [Register] Erro ao persistir membro no banco:', insertErr);
      }
    }

    // 5. Emitir sessão JWT e gravar Cookie HTTP-Only seguro
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
      { status: 201 }
    );
  } catch (error: any) {
    console.error('❌ [Register] Erro interno:', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno ao processar cadastro: ' + (error?.message || 'Inesperado') },
      { status: 500 }
    );
  }
}
