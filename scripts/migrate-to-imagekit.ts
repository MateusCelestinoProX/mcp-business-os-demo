import fs from 'node:fs';
import path from 'node:path';
import {
  uploadToImageKit,
  isImageKitConfigured,
  getCanonicalImageKitFolder,
  IMAGEKIT_URL_ENDPOINT,
} from '../src/lib/storage/imagekit';
import { LibraryItem } from '../src/lib/library/library-manager';

const CATALOG_PATH = path.resolve(process.cwd(), 'src/data/library_catalog_index.json');
const PUBLIC_CATALOG_PATH = path.resolve(process.cwd(), 'public/biblioteca/library_catalog_index.json');
const MANIFEST_PATH = path.resolve(process.cwd(), 'src/data/imagekit_media_manifest.json');

interface ManifestEntry {
  localPath: string;
  relPath: string;
  fileName: string;
  url: string;
  fileId: string;
  size: number;
  type: string;
  folder: string;
  migratedAt: string;
}

// Fila concorrente simples e robusta (sem dependências externas)
async function asyncPool<T, R>(
  poolLimit: number,
  array: T[],
  iteratorFn: (item: T, index: number) => Promise<R>
): Promise<R[]> {
  const ret: Promise<R>[] = [];
  const executing: Set<Promise<any>> = new Set();

  for (let i = 0; i < array.length; i++) {
    const item = array[i];
    const p = Promise.resolve().then(() => iteratorFn(item, i));
    ret.push(p);
    executing.add(p);

    const clean = () => executing.delete(p);
    p.then(clean, clean);

    if (executing.size >= poolLimit) {
      await Promise.race(executing);
    }
  }

  return Promise.all(ret);
}

// Upload com retry em caso de instabilidade de rede
async function uploadWithRetry(
  options: Parameters<typeof uploadToImageKit>[0],
  maxRetries = 2
): Promise<ReturnType<typeof uploadToImageKit>> {
  let attempt = 0;
  while (true) {
    try {
      return await uploadToImageKit(options);
    } catch (err) {
      attempt++;
      if (attempt > maxRetries) throw err;
      await new Promise((r) => setTimeout(r, 1000 * attempt));
    }
  }
}

async function runCompleteMigration() {
  console.log('================================================================');
  console.log('🚀 PLATAFORMA SOBERANA — MIGRAÇÃO TOTAL DE MÍDIAS PARA IMAGEKIT');
  console.log(`📡 CDN Endpoint: ${IMAGEKIT_URL_ENDPOINT}`);
  console.log('================================================================\n');

  if (!isImageKitConfigured()) {
    console.error('❌ ImageKit não está configurado. Verifique as credenciais em .env.local');
    process.exit(1);
  }

  const isDryRun = process.argv.includes('--dry-run');
  const concurrency = 6;

  // Carregar manifesto existente para idempotência estrita
  let manifest: Record<string, ManifestEntry> = {};
  if (fs.existsSync(MANIFEST_PATH)) {
    try {
      manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf-8'));
    } catch {
      manifest = {};
    }
  }

  // -------------------------------------------------------------
  // FASE 1: Migração do Catálogo Oficial da Biblioteca
  // -------------------------------------------------------------
  console.log('--- [FASE 1] Migração do Catálogo da Biblioteca ---');
  const catalogRaw = fs.readFileSync(CATALOG_PATH, 'utf-8');
  const catalog: LibraryItem[] = JSON.parse(catalogRaw);

  const eligibleCatalogItems = catalog.filter((item) => {
    return ['pdf', 'image', 'video'].includes(item.type);
  });

  const pendingCatalogItems = eligibleCatalogItems.filter((item) => {
    return !(item.url && item.url.startsWith('https://ik.imagekit.io/lojoakxmk/'));
  });

  console.log(`Total elegíveis no catálogo: ${eligibleCatalogItems.length}`);
  console.log(`Já migrados no ImageKit: ${eligibleCatalogItems.length - pendingCatalogItems.length}`);
  console.log(`Pendentes de envio: ${pendingCatalogItems.length}\n`);

  let catalogSuccessCount = 0;
  let catalogFailCount = 0;

  if (pendingCatalogItems.length > 0) {
    await asyncPool(concurrency, pendingCatalogItems, async (item, idx) => {
      // Localizar arquivo físico
      const candidates = [
        path.resolve(process.cwd(), 'public/biblioteca', item.rel_path),
        path.resolve(process.cwd(), 'public/uploads/library', item.rel_path),
        path.resolve(process.cwd(), 'public', item.rel_path.replace(/^\/+/, '')),
      ];

      let physicalPath: string | null = null;
      for (const cand of candidates) {
        if (fs.existsSync(cand) && fs.statSync(cand).isFile()) {
          physicalPath = cand;
          break;
        }
      }

      if (!physicalPath) {
        console.warn(`[Catálogo ${idx + 1}/${pendingCatalogItems.length}] ⚠️ Não encontrado: ${item.file}`);
        catalogFailCount++;
        return;
      }

      if (isDryRun) {
        console.log(`[DRY-RUN Catálogo ${idx + 1}] Localizado: ${item.file}`);
        return;
      }

      try {
        const buffer = fs.readFileSync(physicalPath);
        const folder = getCanonicalImageKitFolder(item.file);
        const uploadResult = await uploadWithRetry({
          file: buffer,
          fileName: path.basename(physicalPath),
          folder: folder,
          tags: ['plataforma-soberana', 'biblioteca-core', item.type, item.category],
          useUniqueFileName: true,
        });

        item.url = uploadResult.url;
        item.file_id = uploadResult.fileId;
        item.thumbnail_url = uploadResult.thumbnailUrl;
        item.source = 'cloud';
        item.tags = Array.from(new Set([...(item.tags || []), 'imagekit-cdn', 'cloud-storage']));

        // Registra no manifesto
        const relKey = path.relative(process.cwd(), physicalPath);
        manifest[relKey] = {
          localPath: physicalPath,
          relPath: relKey,
          fileName: item.file,
          url: uploadResult.url,
          fileId: uploadResult.fileId,
          size: uploadResult.size,
          type: item.type,
          folder: folder,
          migratedAt: new Date().toISOString(),
        };

        catalogSuccessCount++;
        if (catalogSuccessCount % 10 === 0 || catalogSuccessCount === pendingCatalogItems.length) {
          console.log(`[Catálogo] ⚡ Progresso: ${catalogSuccessCount}/${pendingCatalogItems.length} enviados...`);
        }
      } catch (err: any) {
        console.error(`[Catálogo] ❌ Falha em ${item.file}:`, err?.message || err);
        catalogFailCount++;
      }
    });

    if (!isDryRun && catalogSuccessCount > 0) {
      console.log('\n💾 Sincronizando arquivos de catálogo com URLs do ImageKit...');
      fs.writeFileSync(CATALOG_PATH, JSON.stringify(catalog, null, 2), 'utf-8');
      if (fs.existsSync(PUBLIC_CATALOG_PATH)) {
        fs.writeFileSync(PUBLIC_CATALOG_PATH, JSON.stringify(catalog, null, 2), 'utf-8');
      }
      console.log('✅ Catálogos sincronizados com sucesso.');
    }
  }

  // -------------------------------------------------------------
  // FASE 2: Migração dos Vídeos e Certificações do Showcase
  // -------------------------------------------------------------
  console.log('\n--- [FASE 2] Migração de Mídias do Showcase (Vídeos e Certificados) ---');
  const showcaseFiles: string[] = [];
  const showcaseDir = path.resolve(process.cwd(), 'public/showcase');

  if (fs.existsSync(showcaseDir)) {
    const walkShowcase = (dir: string) => {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          walkShowcase(full);
        } else if (entry.isFile()) {
          const ext = path.extname(entry.name).toLowerCase();
          if (['.mp4', '.mov', '.webm', '.pdf'].includes(ext)) {
            showcaseFiles.push(full);
          }
        }
      }
    };
    walkShowcase(showcaseDir);
  }

  const pendingShowcase = showcaseFiles.filter((f) => {
    const rel = path.relative(process.cwd(), f);
    return !manifest[rel];
  });

  console.log(`Total mídias encontradas no showcase: ${showcaseFiles.length}`);
  console.log(`Já presentes no manifesto: ${showcaseFiles.length - pendingShowcase.length}`);
  console.log(`Pendentes de envio: ${pendingShowcase.length}\n`);

  let showcaseSuccessCount = 0;
  let showcaseFailCount = 0;

  if (pendingShowcase.length > 0) {
    await asyncPool(concurrency, pendingShowcase, async (filePath, idx) => {
      const fileName = path.basename(filePath);
      const ext = path.extname(fileName).toLowerCase();
      const isVideo = ['.mp4', '.mov', '.webm'].includes(ext);
      const folder = isVideo ? '/soberana/showcase/videos' : '/soberana/showcase/certificacoes';
      const fileType = isVideo ? 'video' : 'pdf';

      if (isDryRun) {
        console.log(`[DRY-RUN Showcase ${idx + 1}] Localizado: ${fileName}`);
        return;
      }

      try {
        const buffer = fs.readFileSync(filePath);
        const uploadResult = await uploadWithRetry({
          file: buffer,
          fileName: fileName,
          folder: folder,
          tags: ['plataforma-soberana', 'showcase-media', fileType],
          useUniqueFileName: true,
        });

        const relKey = path.relative(process.cwd(), filePath);
        manifest[relKey] = {
          localPath: filePath,
          relPath: relKey,
          fileName: fileName,
          url: uploadResult.url,
          fileId: uploadResult.fileId,
          size: uploadResult.size,
          type: fileType,
          folder: folder,
          migratedAt: new Date().toISOString(),
        };

        showcaseSuccessCount++;
        if (showcaseSuccessCount % 10 === 0 || showcaseSuccessCount === pendingShowcase.length) {
          console.log(`[Showcase] ⚡ Progresso: ${showcaseSuccessCount}/${pendingShowcase.length} enviados...`);
        }
      } catch (err: any) {
        console.error(`[Showcase] ❌ Falha em ${fileName}:`, err?.message || err);
        showcaseFailCount++;
      }
    });
  }

  // -------------------------------------------------------------
  // FASE 3: Salvar Manifesto Global ImageKit
  // -------------------------------------------------------------
  if (!isDryRun) {
    fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2), 'utf-8');
    console.log(`\n💾 Manifesto global salvo em: ${MANIFEST_PATH}`);
  }

  console.log('\n================================================================');
  console.log('🏁 RESULTADO FINAL DA MIGRAÇÃO:');
  console.log(`   - Catálogo da Biblioteca: ${catalogSuccessCount} enviados com sucesso, ${catalogFailCount} falhas`);
  console.log(`   - Mídias do Showcase: ${showcaseSuccessCount} enviadas com sucesso, ${showcaseFailCount} falhas`);
  console.log(`   - Total Geral no Manifesto ImageKit: ${Object.keys(manifest).length} arquivos`);
  console.log('================================================================\n');
}

runCompleteMigration().catch((e) => {
  console.error('Erro na migração:', e);
  process.exit(1);
});
