import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getResourceById, recordDownload } from '@/lib/library/catalog';

export const dynamic = 'force-dynamic';

const SOURCE_LIBRARY_BASE = '/Users/mcp/.gemini/antigravity/scratch/s-a-a-s-full-hidden-library';

function getMimeType(filename: string): string {
  const ext = path.extname(filename).toLowerCase();
  switch (ext) {
    case '.pdf':
      return 'application/pdf';
    case '.apk':
      return 'application/vnd.android.package-archive';
    case '.docx':
      return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    case '.txt':
      return 'text/plain; charset=utf-8';
    case '.md':
      return 'text/markdown; charset=utf-8';
    case '.png':
      return 'image/png';
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.zip':
      return 'application/zip';
    case '.html':
      return 'text/html; charset=utf-8';
    case '.json':
      return 'application/json; charset=utf-8';
    case '.py':
      return 'text/x-python; charset=utf-8';
    case '.js':
      return 'application/javascript; charset=utf-8';
    default:
      return 'application/octet-stream';
  }
}

// POST: Registra telemetria de download e devolve metadados
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const id = body.id || body.resourceId;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Parâmetro ID obrigatório para registrar download' },
        { status: 400 }
      );
    }

    const resource = getResourceById(String(id));
    if (!resource) {
      return NextResponse.json(
        { success: false, error: 'Recurso não encontrado no acervo' },
        { status: 404 }
      );
    }

    const { newCount } = recordDownload(resource.id);

    return NextResponse.json({
      success: true,
      id: resource.id,
      file: resource.file,
      downloadCount: newCount,
      downloadUrl: `/api/library/download?id=${resource.id}`,
      message: 'Download registrado com sucesso pela telemetria Free Resources',
    });
  } catch (error: any) {
    console.error('Erro ao processar telemetria de download:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Falha ao registrar download' },
      { status: 500 }
    );
  }
}

// GET: Serve o arquivo físico de forma segura com Content-Disposition ou metadados
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const mode = searchParams.get('mode'); // 'meta' | 'file'

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID do recurso não informado' },
        { status: 400 }
      );
    }

    const resource = getResourceById(id);
    if (!resource) {
      return NextResponse.json(
        { success: false, error: 'Recurso não encontrado' },
        { status: 404 }
      );
    }

    // Registra o download na telemetria
    const { newCount } = recordDownload(resource.id);

    // Se o cliente quer apenas metadados
    if (mode === 'meta') {
      return NextResponse.json({
        success: true,
        resource,
        downloadCount: newCount,
      });
    }

    // Se o recurso está hospedado no ImageKit CDN, redireciona diretamente (Zero overhead de servidor)
    if (resource.url && (resource.url.startsWith('https://ik.imagekit.io/') || resource.url.startsWith('http'))) {
      return NextResponse.redirect(resource.url, 302);
    }

    // Validação estrita de Path Traversal com bloqueio absoluto de escape (POSIX e Windows)
    const normalizedInput = resource.rel_path.replace(/\\/g, '/');
    const absoluteFilePath = path.resolve(SOURCE_LIBRARY_BASE, normalizedInput);

    // Garante que o caminho resolvido não escapou do diretório base
    if (!absoluteFilePath.startsWith(SOURCE_LIBRARY_BASE)) {
      return NextResponse.json(
        { success: false, error: 'Acesso negado: violação de segurança de sandbox de arquivo' },
        { status: 403 }
      );
    }

    // Se o arquivo físico existe no disco
    if (fs.existsSync(absoluteFilePath)) {
      const fileBuffer = fs.readFileSync(absoluteFilePath);
      const mimeType = getMimeType(resource.file);

      // Limpeza do filename para o header Content-Disposition
      const safeFilename = encodeURIComponent(resource.file).replace(/['()]/g, escape);

      return new NextResponse(fileBuffer, {
        status: 200,
        headers: {
          'Content-Type': mimeType,
          'Content-Disposition': `attachment; filename="${resource.file}"; filename*=UTF-8''${safeFilename}`,
          'Content-Length': fileBuffer.length.toString(),
          'X-Download-Count': newCount.toString(),
          'Cache-Control': 'public, max-age=3600',
        },
      });
    }

    // Fallback gracioso: gera conteúdo a partir do preview de texto
    const textContent = resource.text_preview || `# ${resource.title}\n\n${resource.description}`;
    const textBuffer = Buffer.from(textContent, 'utf-8');

    return new NextResponse(textBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Content-Disposition': `attachment; filename="${resource.file}.txt"`,
        'Content-Length': textBuffer.length.toString(),
        'X-Download-Count': newCount.toString(),
      },
    });
  } catch (error: any) {
    console.error('Erro no download do recurso:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Falha ao processar download do recurso' },
      { status: 500 }
    );
  }
}
