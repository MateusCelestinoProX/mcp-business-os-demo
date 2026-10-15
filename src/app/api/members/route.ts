import { NextResponse } from 'next/server';
import { db, isDbConfigured } from '@/lib/db';
import { members } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';
import { getSession } from '@/lib/auth/session';
import { verifyToken } from '@/lib/auth/jwt';

export const dynamic = 'force-dynamic';

/**
 * GET /api/members
 * Retorna lista de membros reais registrados na base de dados (Exclusivo para Administrador)
 */
export async function GET(req: Request) {
  try {
    // 1. Validação de Sessão Administrativa (Cookie HttpOnly ou Bearer Token)
    let session = await getSession();
    if (!session) {
      const authHeader = req.headers.get('authorization');
      if (authHeader?.startsWith('Bearer ')) {
        const token = authHeader.substring(7).trim();
        session = await verifyToken(token);
      }
    }

    if (!session || (session.role !== 'admin' && (session as any).role !== 'moder')) {
      return NextResponse.json(
        { success: false, error: 'Acesso restrito. Autenticação de Administrador obrigatória.' },
        { status: 403 }
      );
    }

    if (!isDbConfigured) {
      return NextResponse.json({
        success: true,
        members: [],
        total: 0,
        message: 'Banco de dados offline ou aguardando configuração.',
      });
    }

    const rows = await db
      .select({
        id: members.id,
        name: members.name,
        email: members.email,
        tier: members.tier,
        status: members.status,
        lastLogin: members.lastLogin,
        createdAt: members.createdAt,
      })
      .from(members)
      .orderBy(desc(members.createdAt));

    return NextResponse.json({
      success: true,
      members: rows,
      total: rows.length,
    });
  } catch (error: any) {
    console.warn('⚠️ [API Members GET] Erro ao buscar membros do banco:', error?.message);
    return NextResponse.json({
      success: false,
      members: [],
      total: 0,
      error: error?.message,
    }, { status: 500 });
  }
}
