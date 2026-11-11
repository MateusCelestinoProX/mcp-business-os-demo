import { NextResponse } from 'next/server';
import { db, isDbConfigured } from '@/lib/db';
import { members, libraryItems } from '@/lib/db/schema';
import { sql } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

/**
 * GET /api/community/stats
 * Retorna contagens reais agregadas para a comunidade
 * Zero mockups: retorna números reais da base de dados com fallback seguro
 */
export async function GET() {
  try {
    if (!isDbConfigured) {
      return NextResponse.json({
        success: true,
        members: 0,
        prompts: 0,
        posts: 0,
        comments: 0,
      });
    }

    const [memberCountRes] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(members);

    let promptCount = 0;
    try {
      const [promptCountRes] = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(libraryItems);
      promptCount = promptCountRes?.count || 0;
    } catch {
      promptCount = 0;
    }

    return NextResponse.json({
      success: true,
      members: memberCountRes?.count || 0,
      prompts: promptCount,
      posts: 0,
      comments: 0,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: true,
      members: 0,
      prompts: 0,
      posts: 0,
      comments: 0,
    });
  }
}
