import { NextRequest, NextResponse } from 'next/server';
import fs from 'node:fs';
import path from 'node:path';
import { addItemToLibrary, determineFileType } from '@/lib/library/library-manager';

export const dynamic = 'force-dynamic';

const UPLOAD_DIR = path.resolve(process.cwd(), 'public/uploads/library');

export async function POST(request: NextRequest) {
  try {
    // Garantir que a pasta de uploads exista
    if (!fs.existsSync(UPLOAD_DIR)) {
      fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    }

    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    const singleFile = formData.get('file') as File | null;
    const categoryName = (formData.get('categoryName') as string) || 'Geral / Core';
    const categorySlug = (formData.get('categorySlug') as string) || 'geral-core';

    const targetFiles: File[] = [];
    if (singleFile && singleFile.size > 0) targetFiles.push(singleFile);
    if (files && files.length > 0) {
      files.forEach((f) => {
        if (f.size > 0 && !targetFiles.some((t) => t.name === f.name && t.size === f.size)) {
          targetFiles.push(f);
        }
      });
    }

    if (targetFiles.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Nenhum arquivo enviado para upload do Mac' },
        { status: 400 }
      );
    }

    const uploadedItems = [];

    for (const file of targetFiles) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Nome seguro e preservação da extensão
      const rawName = file.name;
      const ext = path.extname(rawName).toLowerCase();
      const baseName = path.basename(rawName, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
      const safeFilename = `${Date.now()}_${baseName}${ext}`;

      const filePath = path.join(UPLOAD_DIR, safeFilename);
      fs.writeFileSync(filePath, buffer);

      // Se for texto ou markdown, extrai preview
      let textPreview = '';
      if (['.txt', '.md', '.json', '.csv', '.log'].includes(ext)) {
        try {
          textPreview = buffer.toString('utf-8').slice(0, 500);
        } catch {}
      }

      const item = addItemToLibrary({
        file: rawName,
        rel_path: safeFilename,
        url: `/uploads/library/${safeFilename}`,
        category: categorySlug,
        category_group: categoryName,
        ext: ext,
        type: determineFileType(rawName),
        size: file.size,
        source: 'mac',
        title: rawName.replace(/\.[^/.]+$/, '').replace(/[-_]+/g, ' '),
        description: `Arquivo enviado do Mac (${file.type || ext}) em ${new Date().toLocaleDateString('pt-BR')}`,
        text_preview: textPreview,
        tags: ['mac-upload', ext.replace('.', ''), categorySlug].filter(Boolean),
      });

      uploadedItems.push(item);
    }

    return NextResponse.json({
      success: true,
      message: `${uploadedItems.length} arquivo(s) enviado(s) com sucesso diretamente do Mac`,
      items: uploadedItems,
    });
  } catch (error: any) {
    console.error('Erro na rota POST /api/admin/libraries/upload:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Falha no upload de arquivos do Mac' },
      { status: 500 }
    );
  }
}
