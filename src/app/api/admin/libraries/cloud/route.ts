import { NextRequest, NextResponse } from 'next/server';
import path from 'node:path';
import { addItemToLibrary, determineFileType } from '@/lib/library/library-manager';
import { verifyAdminRequest, denyAdminRequest, verifySameOriginRequest } from '@/lib/auth/admin-guard';
import { assertSafeExternalUrl } from '@/lib/security/url-guard';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    if (!verifySameOriginRequest(request)) {
      return NextResponse.json(
        { success: false, error: 'Origem não autorizada (violação CSRF).' },
        { status: 403 }
      );
    }

    const auth = await verifyAdminRequest(request);
    if (!auth.authorized) {
      return denyAdminRequest(auth);
    }

    const body = await request.json().catch(() => ({}));
    const { url, title, description, categoryName, categorySlug, tags, customType } = body;

    if (!url || typeof url !== 'string' || !url.trim()) {
      return NextResponse.json({ success: false, error: 'URL do arquivo na nuvem é obrigatória' }, { status: 400 });
    }

    const cleanUrl = url.trim();

    // Validação estrita anti-SSRF para URLs remotas
    try {
      await assertSafeExternalUrl(cleanUrl);
    } catch (urlErr: any) {
      return NextResponse.json({ success: false, error: 'URL fornecida rejeitada pela proteção anti-SSRF.' }, { status: 400 });
    }

    // Dedução do nome do arquivo a partir da URL
    let inferredFilename = 'arquivo-nuvem';
    try {
      const urlObj = new URL(cleanUrl);
      const pathname = urlObj.pathname;
      const basename = path.basename(pathname);
      if (basename && basename.includes('.')) {
        inferredFilename = decodeURIComponent(basename);
      }
    } catch {
      inferredFilename = cleanUrl.split('/').pop()?.split('?')[0] || 'arquivo-nuvem';
    }

    const ext = path.extname(inferredFilename).toLowerCase() || '.bin';
    const computedType = customType || determineFileType(inferredFilename);

    const item = addItemToLibrary({
      file: inferredFilename,
      rel_path: cleanUrl,
      url: cleanUrl,
      category: categorySlug || 'geral-core',
      category_group: categoryName || 'Geral / Core',
      ext: ext,
      type: computedType,
      size: 0,
      size_formatted: 'Nuvem (Externo)',
      source: 'cloud',
      title: title?.trim() || inferredFilename.replace(/\.[^/.]+$/, '').replace(/[-_]+/g, ' '),
      description: description?.trim() || `Ativo sincronizado da nuvem (${cleanUrl}) em ${new Date().toLocaleDateString('pt-BR')}`,
      tags: Array.isArray(tags) ? tags : ['cloud-sync', computedType, ext.replace('.', '')].filter(Boolean),
    });

    return NextResponse.json({
      success: true,
      message: 'Ativo da nuvem importado com sucesso para a biblioteca',
      item,
    });
  } catch (error: any) {
    console.error('Erro na rota POST /api/admin/libraries/cloud:', error);
    return NextResponse.json(
      { success: false, error: 'Falha ao importar ativo da nuvem' },
      { status: 500 }
    );
  }
}
