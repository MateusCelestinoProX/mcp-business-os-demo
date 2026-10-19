import { NextRequest, NextResponse } from 'next/server';
import {
  uploadToImageKit,
  deleteFromImageKit,
  listImageKitFiles,
  getImageKitAuthParams,
  isImageKitConfigured,
  IMAGEKIT_URL_ENDPOINT,
  IMAGEKIT_PUBLIC_KEY,
  getCanonicalImageKitFolder,
} from '@/lib/storage/imagekit';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action') || 'status';

    if (action === 'auth') {
      const auth = getImageKitAuthParams();
      return NextResponse.json({ success: true, ...auth });
    }

    if (action === 'status') {
      return NextResponse.json({
        success: true,
        configured: isImageKitConfigured(),
        account: 'mcp6667@proton.me',
        alias: 'smartflow',
        urlEndpoint: IMAGEKIT_URL_ENDPOINT,
        publicKey: IMAGEKIT_PUBLIC_KEY,
      });
    }

    if (action === 'list') {
      const pathParam = searchParams.get('path') || undefined;
      const limit = Number(searchParams.get('limit')) || 50;
      const skip = Number(searchParams.get('skip')) || 0;

      const files = await listImageKitFiles({ path: pathParam, limit, skip });
      return NextResponse.json({
        success: true,
        count: files.length,
        files,
      });
    }

    return NextResponse.json(
      { success: false, error: `Ação inválida: ${action}` },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('Erro na rota GET /api/storage/imagekit:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Falha na consulta ImageKit' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || '';

    // Upload via FormData
    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const file = formData.get('file') as File | null;
      const folder = (formData.get('folder') as string) || undefined;
      const rawTags = (formData.get('tags') as string) || '';
      const tags = rawTags ? rawTags.split(',').map((t) => t.trim()) : undefined;

      if (!file) {
        return NextResponse.json(
          { success: false, error: 'Nenhum arquivo enviado no formData' },
          { status: 400 }
        );
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const result = await uploadToImageKit({
        file: buffer,
        fileName: file.name,
        folder: folder || getCanonicalImageKitFolder(file.name),
        tags: tags || ['plataforma-soberana', 'api-upload'],
      });

      return NextResponse.json({
        success: true,
        message: 'Arquivo enviado com sucesso para a CDN do ImageKit',
        ...result,
      });
    }

    // Upload via JSON (Base64 ou URL remota)
    if (contentType.includes('application/json')) {
      const body = await request.json();
      const { file, fileName, folder, tags } = body;

      if (!file || !fileName) {
        return NextResponse.json(
          { success: false, error: 'Campos file e fileName são obrigatórios' },
          { status: 400 }
        );
      }

      const result = await uploadToImageKit({
        file,
        fileName,
        folder: folder || getCanonicalImageKitFolder(fileName),
        tags: Array.isArray(tags) ? tags : ['plataforma-soberana', 'json-upload'],
      });

      return NextResponse.json({
        success: true,
        message: 'Arquivo enviado com sucesso para o ImageKit',
        ...result,
      });
    }

    return NextResponse.json(
      { success: false, error: 'Content-Type deve ser multipart/form-data ou application/json' },
      { status: 415 }
    );
  } catch (error: any) {
    console.error('Erro na rota POST /api/storage/imagekit:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Falha no upload para o ImageKit' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fileId = searchParams.get('fileId');

    if (!fileId) {
      return NextResponse.json(
        { success: false, error: 'Parâmetro fileId é obrigatório' },
        { status: 400 }
      );
    }

    const deleted = await deleteFromImageKit(fileId);
    return NextResponse.json({
      success: deleted,
      message: deleted ? 'Arquivo excluído do ImageKit' : 'Não foi possível excluir o arquivo',
    });
  } catch (error: any) {
    console.error('Erro na rota DELETE /api/storage/imagekit:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Falha ao deletar arquivo no ImageKit' },
      { status: 500 }
    );
  }
}
