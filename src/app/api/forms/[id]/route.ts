import { NextResponse } from 'next/server';
import { db, isDbConfigured } from '@/lib/db';
import { forms } from '@/lib/db/schema';
import { eq, or } from 'drizzle-orm';
import { INITIAL_FORM_TEMPLATE } from '@/types/builder';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!isDbConfigured) {
      return NextResponse.json({
        success: true,
        data: INITIAL_FORM_TEMPLATE,
        source: 'local_fallback',
      });
    }

    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

    let formRecord = null;
    if (isUuid) {
      formRecord = await db.query.forms.findFirst({
        where: eq(forms.id, id),
      });
    } else {
      formRecord = await db.query.forms.findFirst({
        where: or(eq(forms.slug, id), eq(forms.id, id as any)),
      });
    }

    if (!formRecord) {
      return NextResponse.json({
        success: true,
        data: INITIAL_FORM_TEMPLATE,
        source: 'not_found_fallback',
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        id: formRecord.id,
        title: formRecord.title,
        description: formRecord.description,
        slug: formRecord.slug,
        schemaJson: formRecord.schemaJson,
        isActive: formRecord.isActive,
        createdAt: formRecord.createdAt,
        updatedAt: formRecord.updatedAt,
      },
    });
  } catch (error: any) {
    console.warn('⚠️ [API Forms [id] GET] Erro:', error.message);
    return NextResponse.json({
      success: true,
      data: INITIAL_FORM_TEMPLATE,
      source: 'error_fallback',
    });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { title, description, schemaJson, isActive } = body;

    if (!isDbConfigured) {
      return NextResponse.json({
        success: true,
        message: 'Atualizado em modo offline',
        data: { id, title, schemaJson },
      });
    }

    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

    const updatePayload: Record<string, any> = {
      updatedAt: new Date(),
    };
    if (title !== undefined) updatePayload.title = title;
    if (description !== undefined) updatePayload.description = description;
    if (schemaJson !== undefined) updatePayload.schemaJson = schemaJson;
    if (isActive !== undefined) updatePayload.isActive = isActive;

    let updated = null;
    if (isUuid) {
      [updated] = await db
        .update(forms)
        .set(updatePayload)
        .where(eq(forms.id, id))
        .returning();
    } else {
      [updated] = await db
        .update(forms)
        .set(updatePayload)
        .where(eq(forms.slug, id))
        .returning();
    }

    return NextResponse.json({
      success: true,
      data: updated,
    });
  } catch (error: any) {
    console.error('Erro ao atualizar formulário:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Erro ao atualizar' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!isDbConfigured) {
      return NextResponse.json({
        success: true,
        message: 'Deletado em modo offline',
      });
    }

    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

    if (isUuid) {
      await db.delete(forms).where(eq(forms.id, id));
    } else {
      await db.delete(forms).where(eq(forms.slug, id));
    }

    return NextResponse.json({
      success: true,
      message: 'Formulário excluído com sucesso',
    });
  } catch (error: any) {
    console.error('Erro ao deletar formulário:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Erro ao deletar' },
      { status: 500 }
    );
  }
}
