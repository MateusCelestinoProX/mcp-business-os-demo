import { NextRequest, NextResponse } from 'next/server';
import {
  deleteItemFromLibrary,
  updateLibraryItem,
  getFileContent,
  saveFileContent,
  loadAllItems,
} from '@/lib/library/library-manager';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const items = loadAllItems();
    const item = items.find((it) => it.id === id || it.slug === id);

    if (!item) {
      return NextResponse.json({ success: false, error: 'Item não encontrado no acervo' }, { status: 404 });
    }

    // Tentar ler conteúdo para arquivos de texto/código/markdown
    let rawContent: string | null = null;
    const isTextLike = ['md', 'txt', 'code'].includes(item.type) || ['.md', '.txt', '.json', '.csv', '.py', '.js', '.ts'].includes(item.ext);
    if (isTextLike) {
      const readResult = getFileContent(item.id);
      if (readResult.success) {
        rawContent = readResult.content || '';
      }
    }

    return NextResponse.json({
      success: true,
      item,
      content: rawContent,
      isEditableText: isTextLike,
    });
  } catch (error: any) {
    console.error('Erro na rota GET item:', error);
    return NextResponse.json({ success: false, error: error?.message || 'Falha ao buscar item' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ success: false, error: 'ID do item é obrigatório' }, { status: 400 });
    }

    const deleted = deleteItemFromLibrary(id);
    if (!deleted) {
      return NextResponse.json({ success: false, error: 'Item não encontrado no acervo para exclusão' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Arquivo removido com sucesso de forma sincronizada' });
  } catch (error: any) {
    console.error('Erro na rota DELETE item:', error);
    return NextResponse.json({ success: false, error: error?.message || 'Falha ao deletar item' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Se houver alteração no conteúdo de texto do arquivo
    if (typeof body.content === 'string') {
      const saveRes = saveFileContent(id, body.content);
      if (!saveRes.success) {
        console.warn('Aviso ao salvar conteúdo textual físico:', saveRes.error);
      }
    }

    const updated = updateLibraryItem(id, {
      title: body.title,
      description: body.description,
      tags: body.tags,
      category: body.category,
      category_group: body.category_group,
    });

    if (!updated) {
      return NextResponse.json({ success: false, error: 'Item não encontrado para atualização' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      item: updated,
      message: 'Arquivo e metadados atualizados com sucesso no cofre',
    });
  } catch (error: any) {
    console.error('Erro na rota PUT item:', error);
    return NextResponse.json({ success: false, error: error?.message || 'Falha ao atualizar item' }, { status: 500 });
  }
}
