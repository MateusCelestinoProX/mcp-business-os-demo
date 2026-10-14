import { NextResponse } from 'next/server';
import { db, isDbConfigured } from '@/lib/db';
import { members } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

/**
 * GET /api/members
 * Retorna lista de membros reais registrados na base de dados do Supabase
 */
export async function GET() {
  try {
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
      success: true,
      members: [],
      total: 0,
      error: error?.message,
    });
  }
}
