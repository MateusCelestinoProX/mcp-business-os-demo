import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { db, isDbConfigured } from '@/lib/db';
import { adminUsers, members } from '@/lib/db/schema';
import { signToken, type SessionPayload } from './jwt';
import { createSession } from './session';

/**
 * ============================================================
 * MÓDULO PRINCIPAL DE AUTENTICAÇÃO & SEGURANÇA
 * ============================================================
 */

const SALT_ROUNDS = 10;

/**
 * Gera hash seguro de senha utilizando bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Compara senha em texto plano com hash armazenado
 */
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  if (!password || !hash) return false;
  return await bcrypt.compare(password, hash);
}

/**
 * Autentica Administrador no sistema
 */
export async function authenticateAdmin(
  email: string,
  plainPassword: string
): Promise<{
  success: boolean;
  user?: { id: string; email: string; name: string; role: string };
  token?: string;
  error?: string;
}> {
  const cleanEmail = email?.trim().toLowerCase();
  if (!cleanEmail || !plainPassword) {
    return { success: false, error: 'E-mail e senha são obrigatórios.' };
  }

  if (!isDbConfigured) {
    return {
      success: false,
      error: 'Serviço de banco de dados de autenticação indisponível.',
    };
  }

  try {
    const users = await db
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.email, cleanEmail))
      .limit(1);

    const user = users[0];
    if (user) {
      const isMatch = await verifyPassword(plainPassword, user.passwordHash);
      if (isMatch) {
        try {
          await db
            .update(adminUsers)
            .set({ lastLogin: new Date(), updatedAt: new Date() })
            .where(eq(adminUsers.id, user.id));
        } catch (e) {
          console.warn('[Auth] Não foi possível atualizar lastLogin:', e);
        }

        const payload: SessionPayload = {
          userId: user.id,
          email: user.email,
          name: user.name,
          role: 'admin',
        };

        const token = await createSession(payload);

        return {
          success: true,
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          },
          token,
        };
      }
    }
  } catch (dbError) {
    console.error('[Auth] Erro ao consultar tabela admin_users no Supabase:', dbError);
    return {
      success: false,
      error: 'Erro ao validar credenciais no servidor.',
    };
  }

  return { success: false, error: 'Credenciais de administrador inválidas.' };
}

/**
 * Autentica Membro da Comunidade estritamente via banco de dados Supabase
 */
export async function authenticateMember(
  email: string,
  plainPassword: string
): Promise<{
  success: boolean;
  member?: { id: string; email: string; name: string; status: string; tier: string };
  token?: string;
  error?: string;
}> {
  const cleanEmail = email?.trim().toLowerCase();
  if (!cleanEmail || !plainPassword) {
    return { success: false, error: 'E-mail e senha são obrigatórios.' };
  }

  if (!isDbConfigured) {
    return {
      success: false,
      error: 'Serviço de banco de dados da comunidade indisponível.',
    };
  }

  try {
    const list = await db
      .select()
      .from(members)
      .where(eq(members.email, cleanEmail))
      .limit(1);

    const member = list[0];
    if (member) {
      if (member.status !== 'active') {
        return {
          success: false,
          error: 'Sua conta está inativa ou suspensa.',
        };
      }

      const isMatch = await verifyPassword(plainPassword, member.passwordHash);
      if (isMatch) {
        try {
          await db
            .update(members)
            .set({ lastLogin: new Date() })
            .where(eq(members.id, member.id));
        } catch (e) {
          console.warn('[Auth] Falha ao atualizar lastLogin de membro:', e);
        }

        const payload: SessionPayload = {
          userId: member.id,
          email: member.email,
          name: member.name,
          role: 'member',
          tier: member.tier as 'free' | 'pro' | 'vip',
        };

        const token = await createSession(payload);

        return {
          success: true,
          member: {
            id: member.id,
            email: member.email,
            name: member.name,
            status: member.status,
            tier: member.tier,
          },
          token,
        };
      }
    }
  } catch (e) {
    console.error('[Auth] Erro ao consultar membro no Supabase:', e);
    return {
      success: false,
      error: 'Erro ao validar credenciais no servidor.',
    };
  }

  return { success: false, error: 'Credenciais de membro inválidas.' };
}
