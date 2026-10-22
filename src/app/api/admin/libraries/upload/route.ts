import { NextRequest, NextResponse } from 'next/server';
import fs from 'node:fs';
import path from 'node:path';
import { addItemToLibrary, determineFileType } from '@/lib/library/library-manager';
import { uploadToImageKit, isImageKitConfigured, getCanonicalImageKitFolder } from '@/lib/storage/imagekit';
import { verifyAdminRequest, unauthorizedResponse } from '@/lib/auth/admin-guard';

export const dynamic = 'force-dynamic';

const UPLOAD_DIR = path.resolve(process.cwd(), 'public/uploads/library');
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const ALLOWED_EXTENSIONS = new Set([
  '.png', '.jpg', '.jpeg', '.webp', '.gif', '.avif', '.ico',
  '.mp4', '.mov', '.webm', '.mkv', '.avi',
  '.mp3', '.wav', '.ogg', '.m4a', '.flac',
  '.pdf', '.docx', '.txt', '.md', '.markdown', '.json', '.csv',
  '.zip', '.rar', '.7z', '.tar', '.gz', '.apk',
  '.py', '.js', '.ts', '.css', '.sql'
]);

export async function POST(request: NextRequest) {
  try {
    const auth = await verifyAdminRequest(request);
    if (!auth.authorized) {
      return unauthorizedResponse(auth.error);
    }

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

    // Validação preventiva de tamanho e extensão
    for (const file of targetFiles) {
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { success: false, error: `Arquivo ${file.name} excede o limite máximo permitido de 50MB.` },
          { status: 400 }
        );
      }

      const ext = path.extname(file.name).toLowerCase();
      if (!ALLOWED_EXTENSIONS.has(ext)) {
        return NextResponse.json(
          { success: false, error: `Extensão de arquivo '${ext}' não é permitida por motivos de segurança.` },
          { status: 400 }
        );
      }
    }

    const uploadedItems = [];
    const imageKitActive = isImageKitConfigured();

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

      const fileType = determineFileType(rawName);
      let fileUrl = `/uploads/library/${safeFilename}`;
      let fileId: string | undefined = undefined;
      let thumbnailUrl: string | undefined = undefined;
      let storageSource: 'mac' | 'cloud' | 'core' = 'mac';

      // Enviar para ImageKit se for imagem, vídeo ou PDF (ou qualquer arquivo suportado)
      if (imageKitActive && ['image', 'video', 'pdf'].includes(fileType)) {
        try {
          const ikFolder = getCanonicalImageKitFolder(rawName);
          const ikResult = await uploadToImageKit({
            file: buffer,
            fileName: `${baseName}${ext}`,
            folder: ikFolder,
            tags: ['plataforma-soberana', categorySlug, fileType],
            useUniqueFileName: true,
          });

          fileUrl = ikResult.url;
          fileId = ikResult.fileId;
          thumbnailUrl = ikResult.thumbnailUrl;
          storageSource = 'cloud';
          console.log(`[ImageKit Storage] Arquivo ${rawName} enviado para ${fileUrl}`);
        } catch (ikErr) {
          console.error(`[ImageKit Storage] Erro ao enviar ${rawName} para ImageKit, usando fallback local:`, ikErr);
        }
      }

      const item = addItemToLibrary({
        file: rawName,
        rel_path: safeFilename,
        url: fileUrl,
        category: categorySlug,
        category_group: categoryName,
        ext: ext,
        type: fileType,
        size: file.size,
        source: storageSource,
        title: rawName.replace(/\.[^/.]+$/, '').replace(/[-_]+/g, ' '),
        description: `Arquivo enviado (${file.type || ext}) em ${new Date().toLocaleDateString('pt-BR')}${storageSource === 'cloud' ? ' • Hospedado em ImageKit CDN' : ''}`,
        text_preview: textPreview,
        tags: ['soberana-upload', ext.replace('.', ''), categorySlug, storageSource].filter(Boolean),
        file_id: fileId,
        thumbnail_url: thumbnailUrl,
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
