import { NextRequest, NextResponse } from 'next/server';
import { createNewDocumentInLibrary } from '@/lib/library/library-manager';
import { verifyAdminRequest, unauthorizedResponse } from '@/lib/auth/admin-guard';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const auth = await verifyAdminRequest(request);
    if (!auth.authorized) {
      return unauthorizedResponse(auth.error);
    }

    const body = await request.json();
    const { libraryName, librarySlug, filename, content, title, description, tags } = body;

    if (!libraryName || !filename || typeof content !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Biblioteca, nome do arquivo e conteúdo são obrigatórios' },
        { status: 400 }
      );
    }

    const item = createNewDocumentInLibrary({
      libraryName,
      librarySlug: librarySlug || libraryName.toLowerCase().replace(/\s+/g, '-'),
      filename,
      content,
      title: title || filename,
      description,
      tags,
    });

    return NextResponse.json({
      success: true,
      item,
      message: `Documento "${item.title}" criado e sincronizado com sucesso na biblioteca ${libraryName}!`,
    });
  } catch (error: any) {
    console.error('Erro ao criar documento na biblioteca:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Falha ao criar documento' },
      { status: 500 }
    );
  }
}
