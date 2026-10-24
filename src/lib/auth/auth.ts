import bcrypt from 'bcryptjs';
import crypto from 'node:crypto';
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
 * Comparação em tempo constante contra ataques de timing
 */
function safeCompare(a: string, b: string): boolean {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) {
    crypto.timingSafeEqual(bufA, bufA);
    return false;
  }
  return crypto.timingSafeEqual(bufA, bufB);
}

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

  const masterEmail = (process.env.ADMIN_EMAIL || 'mcp6667@proton.me').toLowerCase().trim();
  const masterPassword = process.env.ADMIN_PASSWORD;

  // 1. Tentar validação prioritária no banco de dados via Drizzle / PostgreSQL
  if (isDbConfigured) {
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
      console.warn('[Auth] Falha de consulta no DB para admin_users (ativando contingência soberana):', dbError);
    }
  }

  // 2. Contingência Soberana A: Validação via Supabase Auth GoTrue REST (HTTPS resiliente)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
  if (supabaseUrl && supabaseKey) {
    try {
      const authRes = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
        method: 'POST',
        headers: {
          apikey: supabaseKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: cleanEmail, password: plainPassword }),
      });
      if (authRes.ok) {
        const authData = await authRes.json();
        const role = authData.user?.user_metadata?.role || authData.user?.app_metadata?.role;
        if (role === 'admin' || cleanEmail === masterEmail) {
          const payload: SessionPayload = {
            userId: authData.user?.id || 'admin-root',
            email: cleanEmail,
            name: authData.user?.user_metadata?.name || 'Mateus Celestino Pro X',
            role: 'admin',
          };
          const token = await createSession(payload);
          return {
            success: true,
            user: {
              id: payload.userId,
              email: cleanEmail,
              name: payload.name,
              role: 'admin',
            },
            token,
          };
        }
      }
    } catch (gotrueErr) {
      console.warn('[Auth] Falha no fallback GoTrue Supabase:', gotrueErr);
    }
  }

  // 3. Contingência de Emergência: Chave de Acesso Mestre (.env)
  if (masterPassword && cleanEmail === masterEmail && safeCompare(plainPassword, masterPassword)) {
    const payload: SessionPayload = {
      userId: 'ef593ee7-4ceb-43d0-90a2-fcfc71633ee1',
      email: masterEmail,
      name: 'Mateus Celestino Pro X',
      role: 'admin',
    };
    const token = await createSession(payload);
    return {
      success: true,
      user: {
        id: payload.userId,
        email: masterEmail,
        name: payload.name,
        role: 'admin',
      },
      token,
    };
  }

  return { success: false, error: 'Credenciais de administrador inválidas.' };
}

/**
 * Autentica Membro da Comunidade estritamente via banco de dados Supabase com fallback seguro
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

  // 1. Tentar validação prioritária no banco de dados via Drizzle / PostgreSQL
  if (isDbConfigured) {
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
      console.warn('[Auth] Erro ao consultar membro no Supabase (ativando fallback):', e);
    }
  }

  // 2. Contingência via Supabase Auth GoTrue REST (HTTPS)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
  if (supabaseUrl && supabaseKey) {
    try {
      const authRes = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
        method: 'POST',
        headers: {
          apikey: supabaseKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: cleanEmail, password: plainPassword }),
      });
      if (authRes.ok) {
        const authData = await authRes.json();
        const tier = (authData.user?.user_metadata?.tier || (cleanEmail === 'membro@mateuscelestinopro.com' ? 'vip' : 'free')) as 'free' | 'pro' | 'vip';
        const payload: SessionPayload = {
          userId: authData.user?.id || 'member-root',
          email: cleanEmail,
          name: authData.user?.user_metadata?.name || 'Membro da Comunidade',
          role: 'member',
          tier,
        };
        const token = await createSession(payload);
        return {
          success: true,
          member: {
            id: payload.userId,
            email: cleanEmail,
            name: payload.name,
            status: 'active',
            tier,
          },
          token,
        };
      }
    } catch (err) {
      console.warn('[Auth] Falha no fallback GoTrue para membro:', err);
    }
  }

  // 3. Membro Demo / Fallback via MEMBER_PASSWORD configurado
  const memberPassword = process.env.MEMBER_PASSWORD;
  if (
    memberPassword &&
    cleanEmail === 'membro@mateuscelestinopro.com' &&
    safeCompare(plainPassword, memberPassword)
  ) {
    const payload: SessionPayload = {
      userId: 'b2503983-86b7-41e2-a7d5-b218c6037bb6',
      email: cleanEmail,
      name: 'Membro Fundador Pro',
      role: 'member',
      tier: 'vip',
    };
    const token = await createSession(payload);
    return {
      success: true,
      member: {
        id: payload.userId,
        email: cleanEmail,
        name: payload.name,
        status: 'active',
        tier: 'vip',
      },
      token,
    };
  }

  return { success: false, error: 'Credenciais de membro inválidas.' };
}
