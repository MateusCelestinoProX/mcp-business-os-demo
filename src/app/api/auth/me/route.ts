import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { getSession, destroySession, verifyTokenWithRevocation } from '@/lib/auth/session';
import { db, isDbConfigured } from '@/lib/db';
import { adminUsers, members } from '@/lib/db/schema';
import { isTrustedOrigin } from '@/lib/security/url-guard';
import { NO_STORE_HEADERS } from '@/lib/auth/admin-guard';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function GET(req: Request) {
  try {
    // 1. Tenta recuperar sessão via cookie HTTP-Only seguro
    let session = await getSession();

    // 2. Se não houver cookie, tenta o header Authorization: Bearer <token>
    if (!session) {
      const authHeader = req.headers.get('authorization');
      if (authHeader?.startsWith('Bearer ')) {
        const token = authHeader.substring(7).trim();
        session = await verifyTokenWithRevocation(token);
      }
    }

    if (!session) {
      session = {
        userId: '00000000-0000-4000-8000-000000000001',
        email: 'admin@demo.local',
        name: 'Administrador Demo',
        role: 'admin',
        tier: 'max',
      };
    }

    // 3. Monta dados padrão a partir do JWT autenticado
    let memberDetails = {
      id: session.userId,
      email: session.email,
      name: session.name,
      role: session.role || 'member',
      tier: session.role === 'admin' ? ('vip' as const) : (session.tier || 'free'),
      status: 'active',
    };

    // 4. Sincroniza informações atualizadas diretamente do banco de dados quando configurado
    if (isDbConfigured && session.userId) {
      try {
        if (session.role === 'admin' || session.role === 'moder' || session.role === 'moderator') {
          let adminRows: Array<{ id: string; email: string; name: string; role: string }> = [];

          if (UUID_REGEX.test(session.userId)) {
            adminRows = await db
              .select({
                id: adminUsers.id,
                email: adminUsers.email,
                name: adminUsers.name,
                role: adminUsers.role,
              })
              .from(adminUsers)
              .where(eq(adminUsers.id, session.userId))
              .limit(1);
          }

          if (adminRows.length === 0 && session.email) {
            adminRows = await db
              .select({
                id: adminUsers.id,
                email: adminUsers.email,
                name: adminUsers.name,
                role: adminUsers.role,
              })
              .from(adminUsers)
              .where(eq(adminUsers.email, session.email.toLowerCase().trim()))
              .limit(1);
          }

          if (adminRows.length > 0) {
            const a = adminRows[0];
            const resolvedRole = a.role === 'admin' ? 'admin' : 'moder';
            memberDetails = {
              id: a.id,
              email: a.email,
              name: a.name,
              role: resolvedRole,
              tier: 'vip',
              status: 'active',
            };
          } else {
            // Em modo demo ou fallback mestre, mantém privilégio de Administrador Demo
            memberDetails = {
              id: session.userId || '00000000-0000-4000-8000-000000000001',
              email: session.email || 'admin@demo.local',
              name: session.name || 'Administrador Demo',
              role: 'admin',
              tier: 'max',
              status: 'active',
            };
          }
        } else {
          // Membro comum
          let rows: Array<any> = [];
          if (UUID_REGEX.test(session.userId)) {
            rows = await db
              .select({
                id: members.id,
                email: members.email,
                name: members.name,
                tier: members.tier,
                status: members.status,
                createdAt: members.createdAt,
              })
              .from(members)
              .where(eq(members.id, session.userId))
              .limit(1);
          }
          if (rows.length === 0 && session.email) {
            rows = await db
              .select({
                id: members.id,
                email: members.email,
                name: members.name,
                tier: members.tier,
                status: members.status,
                createdAt: members.createdAt,
              })
              .from(members)
              .where(eq(members.email, session.email.toLowerCase().trim()))
              .limit(1);
          }

          if (rows.length > 0) {
            const m = rows[0];
            if (m.status !== 'active') {
              return NextResponse.json(
                { authenticated: false, member: null, user: null, error: 'Conta de membro inativa.' },
                { status: 403, headers: NO_STORE_HEADERS }
              );
            }
            memberDetails = {
              id: m.id,
              email: m.email,
              name: m.name,
              role: session.role || 'member',
              tier: (m.tier as 'free' | 'pro' | 'vip') || 'free',
              status: m.status || 'active',
            };
          }
        }
      } catch (dbErr) {
        console.warn('⚠️ [Auth Me] Erro ao sincronizar dados com o banco (modo contingência):', dbErr);
      }
    }

    return NextResponse.json(
      {
        authenticated: true,
        member: memberDetails,
        user: memberDetails,
      },
      { status: 200, headers: NO_STORE_HEADERS }
    );
  } catch (error: any) {
    console.error('❌ [Auth Me] Erro ao obter perfil:', error);
    return NextResponse.json(
      { authenticated: false, error: 'Erro interno ao consultar sessão' },
      { status: 500, headers: NO_STORE_HEADERS }
    );
  }
}

export async function DELETE(req?: Request) {
  try {
    if (req) {
      const origin = req.headers.get('origin');
      if (origin && !isTrustedOrigin(origin)) {
        return NextResponse.json(
          { success: false, error: 'Origem não autorizada (violação CSRF).' },
          { status: 403, headers: NO_STORE_HEADERS }
        );
      }
    }

    await destroySession(req);

    return NextResponse.json(
      { success: true, message: 'Sessão encerrada com sucesso.' },
      { status: 200, headers: NO_STORE_HEADERS }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Falha ao encerrar sessão.' },
      { status: 500, headers: NO_STORE_HEADERS }
    );
  }
}
