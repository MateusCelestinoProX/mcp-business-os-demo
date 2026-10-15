import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { getSession, destroySession } from '@/lib/auth/session';
import { verifyToken } from '@/lib/auth/jwt';
import { db, isDbConfigured } from '@/lib/db';
import { members } from '@/lib/db/schema';

export async function GET(req: Request) {
  try {
    // 1. Tenta recuperar sessão via cookie HTTP-Only
    let session = await getSession();

    // 2. Se não houver cookie, tenta o header Authorization: Bearer <token>
    if (!session) {
      const authHeader = req.headers.get('authorization');
      if (authHeader?.startsWith('Bearer ')) {
        const token = authHeader.substring(7).trim();
        session = await verifyToken(token);
      }
    }

    if (!session) {
      return NextResponse.json(
        { authenticated: false, member: null, error: 'Nenhuma sessão ativa encontrada.' },
        { status: 401 }
      );
    }

    // 3. Tenta buscar informações atualizadas diretamente do banco de dados
    let memberDetails = {
      id: session.userId,
      email: session.email,
      name: session.name,
      role: session.role || 'member',
      tier: session.tier || 'free',
      status: 'active',
    };

    if (isDbConfigured && session.userId) {
      try {
        const rows = await db
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

        if (rows.length > 0) {
          const m = rows[0];
          memberDetails = {
            id: m.id,
            email: m.email,
            name: m.name,
            role: session.role || 'member',
            tier: (m.tier as 'free' | 'pro' | 'vip') || 'free',
            status: m.status || 'active',
          };
        }
      } catch (dbErr) {
        console.warn('⚠️ [Auth Me] Erro ao sincronizar dados com o banco:', dbErr);
      }
    }

    return NextResponse.json(
      {
        authenticated: true,
        member: memberDetails,
        user: memberDetails,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('❌ [Auth Me] Erro ao obter perfil:', error);
    return NextResponse.json(
      { authenticated: false, error: 'Erro interno ao consultar sessão' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    await destroySession();
    return NextResponse.json(
      { success: true, message: 'Sessão encerrada com sucesso.' },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Falha ao encerrar sessão: ' + error.message },
      { status: 500 }
    );
  }
}
