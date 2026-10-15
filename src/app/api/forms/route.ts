import { NextResponse } from 'next/server';
import { db, isDbConfigured } from '@/lib/db';
import { forms } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';
import { INITIAL_FORM_TEMPLATE } from '@/types/builder';

export async function GET() {
  try {
    if (!isDbConfigured) {
      return NextResponse.json({
        success: true,
        data: [INITIAL_FORM_TEMPLATE],
        source: 'local_fallback',
      });
    }

    const allForms = await db
      .select()
      .from(forms)
      .orderBy(desc(forms.updatedAt));

    const formatted = allForms.map((f: any) => ({
      id: f.id,
      title: f.title,
      description: f.description,
      slug: f.slug,
      schemaJson: f.schemaJson,
      isActive: f.isActive,
      createdAt: f.createdAt,
      updatedAt: f.updatedAt,
    }));

    return NextResponse.json({
      success: true,
      data: formatted.length > 0 ? formatted : [INITIAL_FORM_TEMPLATE],
      source: 'drizzle_postgres',
    });
  } catch (error: any) {
    console.warn('⚠️ [API Forms GET] Fallback por erro:', error.message);
    return NextResponse.json({
      success: true,
      data: [INITIAL_FORM_TEMPLATE],
      source: 'error_fallback',
    });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, description, slug, schemaJson } = body;

    if (!title) {
      return NextResponse.json(
        { success: false, error: 'O título do formulário é obrigatório' },
        { status: 400 }
      );
    }

    const formSlug = slug || `form-${Date.now()}`;

    if (!isDbConfigured) {
      return NextResponse.json({
        success: true,
        message: 'Formulário salvo localmente (DB não configurado)',
        data: {
          id: `local_${Date.now()}`,
          title,
          description,
          slug: formSlug,
          schemaJson: schemaJson || {},
        },
      });
    }

    const [created] = await db
      .insert(forms)
      .values({
        title,
        description: description || null,
        slug: formSlug,
        schemaJson: schemaJson || {},
        isActive: true,
      })
      .onConflictDoUpdate({
        target: forms.slug,
        set: {
          title,
          description: description || null,
          schemaJson: schemaJson || {},
          updatedAt: new Date(),
        },
      })
      .returning();

    return NextResponse.json({
      success: true,
      data: created,
    });
  } catch (error: any) {
    console.error('Erro ao criar formulário:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Erro ao criar formulário' },
      { status: 500 }
    );
  }
}
