import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getResourceById, recordDownload } from '@/lib/library/catalog';
import { getSession } from '@/lib/auth/session';
import { verifyToken, type SessionPayload } from '@/lib/auth/jwt';
import { safeContentDispositionFilename } from '@/lib/security/sanitize';
import { checkRateLimit } from '@/lib/auth/rate-limit';
import { getClientIp } from '@/lib/security/request-ip';

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
    const ip = getClientIp(request);
    const rateCheck = checkRateLimit(`download_telemetry_${ip}`, 30, 60 * 1000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { success: false, error: 'Muitas requisições de download. Aguarde um momento.' },
        { status: 429 }
      );
    }

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
      { success: false, error: 'Falha ao registrar download' },
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

    // Validação de autorização para recursos premium/exclusivos
    const isPremiumResource = Boolean(
      (resource as any).is_premium ||
      (resource as any).isPremium ||
      resource.tags?.some((t: string) => ['premium', 'vip', 'master', 'pago'].includes(t.toLowerCase()))
    );

    if (isPremiumResource) {
      let session: SessionPayload | null = await getSession();
      if (!session) {
        const authHeader = request.headers.get('authorization');
        if (authHeader && authHeader.startsWith('Bearer ')) {
          session = await verifyToken(authHeader.substring(7).trim());
        }
      }

      if (!session) {
        return NextResponse.json(
          {
            success: false,
            error: 'Recurso exclusivo para assinantes. Faça login para realizar o download.',
            code: 'AUTH_REQUIRED',
          },
          { status: 401 }
        );
      }

      const role = session.role;
      const tier = session.tier;
      const hasPrivilege =
        role === 'admin' ||
        role === 'editor' ||
        role === 'moder' ||
        role === 'moderator' ||
        tier === 'vip' ||
        tier === 'pro' ||
        (tier as string) === 'master';

      if (!hasPrivilege) {
        return NextResponse.json(
          {
            success: false,
            error: 'Acesso restrito: seu plano atual não permite o download deste ativo.',
            code: 'TIER_UPGRADE_REQUIRED',
          },
          { status: 403 }
        );
      }
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

    // Se o recurso está hospedado em CDN, valida contra Open Redirect
    if (resource.url) {
      try {
        const parsedUrl = new URL(resource.url, process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000');
        const allowedHosts = ['ik.imagekit.io'];
        if (process.env.IMAGEKIT_URL_ENDPOINT) {
          try {
            allowedHosts.push(new URL(process.env.IMAGEKIT_URL_ENDPOINT).hostname);
          } catch {}
        }
        if (process.env.NEXT_PUBLIC_APP_URL) {
          try {
            allowedHosts.push(new URL(process.env.NEXT_PUBLIC_APP_URL).hostname);
          } catch {}
        }

        const isAllowed = allowedHosts.some(
          (host) => parsedUrl.hostname === host || parsedUrl.hostname.endsWith(`.${host}`)
        );

        if (!isAllowed) {
          return NextResponse.json(
            { success: false, error: 'Acesso negado: URL de recurso não autorizada para redirecionamento' },
            { status: 403 }
          );
        }

        return NextResponse.redirect(parsedUrl.toString(), 302);
      } catch {
        return NextResponse.json(
          { success: false, error: 'URL de recurso inválida' },
          { status: 400 }
        );
      }
    }

    // Validação estrita de Path Traversal com bloqueio absoluto de escape (POSIX e Windows)
    const normalizedInput = resource.rel_path.replace(/\\/g, '/');
    const resolvedBase = path.resolve(SOURCE_LIBRARY_BASE);
    const absoluteFilePath = path.resolve(resolvedBase, normalizedInput);

    // Garante que o caminho resolvido não escapou do diretório base
    if (!absoluteFilePath.startsWith(resolvedBase + path.sep) && absoluteFilePath !== resolvedBase) {
      return NextResponse.json(
        { success: false, error: 'Acesso negado: violação de segurança de sandbox de arquivo' },
        { status: 403 }
      );
    }

    // Se o arquivo físico existe no disco
    if (fs.existsSync(absoluteFilePath)) {
      const fileBuffer = fs.readFileSync(absoluteFilePath);
      const mimeType = getMimeType(resource.file);
      const contentDisposition = safeContentDispositionFilename(resource.file);

      return new NextResponse(fileBuffer, {
        status: 200,
        headers: {
          'Content-Type': mimeType,
          'Content-Disposition': contentDisposition,
          'Content-Length': fileBuffer.length.toString(),
          'X-Download-Count': newCount.toString(),
          'X-Content-Type-Options': 'nosniff',
          'Cache-Control': 'public, max-age=3600',
        },
      });
    }

    // Fallback gracioso: gera conteúdo a partir do preview de texto
    const textContent = resource.text_preview || `# ${resource.title}\n\n${resource.description}`;
    const textBuffer = Buffer.from(textContent, 'utf-8');
    const fallbackDisposition = safeContentDispositionFilename(`${resource.file}.txt`);

    return new NextResponse(textBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Content-Disposition': fallbackDisposition,
        'Content-Length': textBuffer.length.toString(),
        'X-Download-Count': newCount.toString(),
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error: any) {
    console.error('Erro no download do recurso:', error);
    return NextResponse.json(
      { success: false, error: 'Falha ao processar download do recurso' },
      { status: 500 }
    );
  }
}
