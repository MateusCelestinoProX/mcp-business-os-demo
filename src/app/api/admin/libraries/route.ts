import { NextRequest, NextResponse } from 'next/server';
import {
  loadAllLibraries,
  createLibrary,
  updateLibrary,
  deleteLibrary,
  loadAllItems,
  LibraryCategory,
} from '@/lib/library/library-manager';
import { verifyAdminRequest, unauthorizedResponse } from '@/lib/auth/admin-guard';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const auth = await verifyAdminRequest(request);
    if (!auth.authorized) {
      return unauthorizedResponse(auth.error);
    }

    const { searchParams } = new URL(request.url);
    const libraryId = searchParams.get('id');
    const libraries = loadAllLibraries();
    const items = loadAllItems();

    // Calcular estatísticas globais reais
    const totalItems = items.length;
    const totalBytes = items.reduce((acc, curr) => acc + (curr.size || 0), 0);
    const macUploads = items.filter((it) => it.source === 'mac').length;
    const cloudUploads = items.filter((it) => it.source === 'cloud').length;

    const stats = {
      totalLibraries: libraries.length,
      totalItems,
      totalBytes,
      macUploads,
      cloudUploads,
    };

    if (libraryId) {
      const selectedLib = libraries.find((l) => l.id === libraryId || l.slug === libraryId);
      if (!selectedLib) {
        return NextResponse.json({ success: false, error: 'Biblioteca não encontrada' }, { status: 404 });
      }
      const libItems = items.filter(
        (it) =>
          it.category_group?.toLowerCase() === selectedLib.name.toLowerCase() ||
          it.category?.toLowerCase() === selectedLib.slug.toLowerCase() ||
          it.category_group?.toLowerCase() === selectedLib.slug.toLowerCase()
      );
      return NextResponse.json({ success: true, library: selectedLib, items: libItems, stats });
    }

    return NextResponse.json({
      success: true,
      libraries,
      stats,
      items: items.slice(0, 100), // Primeiros 100 para listagem rápida
    });
  } catch (error: any) {
    console.error('Erro na rota GET /api/admin/libraries:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Falha ao buscar bibliotecas' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await verifyAdminRequest(request);
    if (!auth.authorized) {
      return unauthorizedResponse(auth.error);
    }

    const body = await request.json();
    if (!body.name || !body.name.trim()) {
      return NextResponse.json({ success: false, error: 'Nome da biblioteca é obrigatório' }, { status: 400 });
    }

    const created = createLibrary({
      name: body.name.trim(),
      slug: body.slug,
      description: body.description?.trim(),
      icon: body.icon || '📁',
      badge: body.badge || 'PRO',
      gradient: body.gradient,
    });

    return NextResponse.json({ success: true, library: created, message: 'Biblioteca criada com sucesso' });
  } catch (error: any) {
    console.error('Erro na rota POST /api/admin/libraries:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Falha ao criar biblioteca' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const auth = await verifyAdminRequest(request);
    if (!auth.authorized) {
      return unauthorizedResponse(auth.error);
    }

    const body = await request.json();
    if (!body.id) {
      return NextResponse.json({ success: false, error: 'ID da biblioteca é obrigatório' }, { status: 400 });
    }

    const updated = updateLibrary(body.id, {
      name: body.name,
      description: body.description,
      icon: body.icon,
      badge: body.badge,
      gradient: body.gradient,
    });

    if (!updated) {
      return NextResponse.json({ success: false, error: 'Biblioteca não encontrada para edição' }, { status: 404 });
    }

    return NextResponse.json({ success: true, library: updated, message: 'Biblioteca atualizada com sucesso' });
  } catch (error: any) {
    console.error('Erro na rota PUT /api/admin/libraries:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Falha ao atualizar biblioteca' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const auth = await verifyAdminRequest(request);
    if (!auth.authorized) {
      return unauthorizedResponse(auth.error);
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID da biblioteca é obrigatório' }, { status: 400 });
    }

    const deleted = deleteLibrary(id);
    if (!deleted) {
      return NextResponse.json({ success: false, error: 'Biblioteca não encontrada para exclusão' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Biblioteca removida com sucesso' });
  } catch (error: any) {
    console.error('Erro na rota DELETE /api/admin/libraries:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Falha ao deletar biblioteca' },
      { status: 500 }
    );
  }
}
