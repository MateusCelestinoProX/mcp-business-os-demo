import { NextRequest, NextResponse } from 'next/server';
import { deleteMultipleItems } from '@/lib/library/library-manager';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const ids: string[] = body.ids;

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ success: false, error: 'Lista de IDs para exclusão é obrigatória' }, { status: 400 });
    }

    const count = deleteMultipleItems(ids);

    return NextResponse.json({
      success: true,
      deletedCount: count,
      message: `${count} arquivo(s) removido(s) com sucesso da biblioteca`,
    });
  } catch (error: any) {
    console.error('Erro na rota POST bulk-delete:', error);
    return NextResponse.json({ success: false, error: error?.message || 'Falha ao excluir itens em massa' }, { status: 500 });
  }
}
