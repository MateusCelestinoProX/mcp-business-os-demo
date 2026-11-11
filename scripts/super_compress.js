const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const sharp = require('sharp');

const PUBLIC_DIR = path.join(__dirname, '..', 'public');

function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return (bytes / Math.pow(k, i)).toFixed(2) + ' ' + sizes[i];
}

function getDirSize(dir) {
  let total = 0;
  if (!fs.existsSync(dir)) return 0;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    try {
      const stat = fs.lstatSync(fullPath);
      if (stat.isSymbolicLink()) continue;
      if (stat.isDirectory()) {
        total += getDirSize(fullPath);
      } else {
        total += stat.size;
      }
    } catch (e) {}
  }
  return total;
}

function getAllFiles(dir, extFilter = null) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir, { withFileTypes: true });
  for (const item of list) {
    const fullPath = path.join(dir, item.name);
    try {
      const stat = fs.lstatSync(fullPath);
      if (stat.isSymbolicLink()) continue;
      if (stat.isDirectory()) {
        results = results.concat(getAllFiles(fullPath, extFilter));
      } else {
        const ext = path.extname(item.name).toLowerCase();
        if (!extFilter || extFilter.includes(ext)) {
          results.push(fullPath);
        }
      }
    } catch (e) {}
  }
  return results;
}

async function run() {
  console.log('=== INICIANDO AUDITORIA E COMPRESSÃO MÁXIMA ===');
  const initialPublicSize = getDirSize(PUBLIC_DIR);
  console.log(`Tamanho inicial da pasta public/: ${formatBytes(initialPublicSize)} (${initialPublicSize.toLocaleString()} bytes)`);

  // ETAPA 1: Limpeza de duplicatas e pastas brutas desnecessárias
  console.log('\n--- ETAPA 1: Removendo pastas e arquivos duplicados brutos ---');
  
  const foldersToRemove = [
    path.join(PUBLIC_DIR, 'assets/notion/shop/COMPRE AGORA'),
    path.join(PUBLIC_DIR, 'assets/notion/recursos/R E C U R S O S'),
    path.join(PUBLIC_DIR, 'biblioteca/graphify-out')
  ];

  for (const f of foldersToRemove) {
    if (fs.existsSync(f)) {
      const sz = getDirSize(f);
      console.log(`Removendo pasta duplicada/órfã: ${path.relative(PUBLIC_DIR, f)} (${formatBytes(sz)})`);
      fs.rmSync(f, { recursive: true, force: true });
    }
  }

  // Duplicatas pontuais de arquivos
  const fileDuplicates = [
    path.join(PUBLIC_DIR, 'photografy-contato/l3.png.jpg'),
    path.join(PUBLIC_DIR, 'photografy-contato/l4.png.jpg'),
    path.join(PUBLIC_DIR, 'photografy-contato/l5.png.jpg'),
  ];
  for (const fp of fileDuplicates) {
    if (fs.existsSync(fp)) {
      const sz = fs.statSync(fp).size;
      console.log(`Removendo duplicata redundante: ${path.relative(PUBLIC_DIR, fp)} (${formatBytes(sz)})`);
      fs.unlinkSync(fp);
    }
  }

  // Symlinks para arquivos duplicados idênticos para não duplicar espaço
  const symlinkPairs = [
    { target: '../galadriel-mobile.apk', link: path.join(PUBLIC_DIR, 'biblioteca/apk/galadriel-mobile.apk') },
    { target: 'cover.gif', link: path.join(PUBLIC_DIR, 'assets/notion/recursos/1.gif') },
    { target: 'cover.gif', link: path.join(PUBLIC_DIR, 'assets/notion/shop/4.gif') },
    { target: 'hero_art.png', link: path.join(PUBLIC_DIR, 'assets/notion/shop/ChatGPT_Image_9_de_jun._de_2025_22_34_04.png') },
    { target: 'icon_shop.png', link: path.join(PUBLIC_DIR, 'assets/notion/shop/ChatGPT_Image_30_de_abr._de_2025_00_18_26.png') },
    { target: 'icon_recursos.png', link: path.join(PUBLIC_DIR, 'assets/notion/recursos/Icone_de_Sacola_com_Simbolo_de_Dolar.png') },
  ];

  for (const pair of symlinkPairs) {
    if (fs.existsSync(pair.link) && !fs.lstatSync(pair.link).isSymbolicLink()) {
      const sz = fs.statSync(pair.link).size;
      fs.unlinkSync(pair.link);
      fs.symlinkSync(pair.target, pair.link);
      console.log(`Substituído por symlink leve: ${path.relative(PUBLIC_DIR, pair.link)} (economizou ${formatBytes(sz)})`);
    }
  }

  const afterDeduplicationSize = getDirSize(PUBLIC_DIR);
  console.log(`Tamanho após deduplicação: ${formatBytes(afterDeduplicationSize)} (Economia de ${formatBytes(initialPublicSize - afterDeduplicationSize)})`);

  // ETAPA 2: Compressão de Vídeos (.mp4)
  console.log('\n--- ETAPA 2: Compressão H.264 / FastStart de Vídeos MP4 ---');
  const mp4Files = getAllFiles(PUBLIC_DIR, ['.mp4']);
  let mp4Saved = 0;
  for (const mp4 of mp4Files) {
    const origSize = fs.statSync(mp4).size;
    const tmpOut = mp4 + '.tmp.mp4';
    try {
      console.log(`Processando vídeo: ${path.relative(PUBLIC_DIR, mp4)} (${formatBytes(origSize)})...`);
      execFileSync('ffmpeg', [
        '-y', '-i', mp4,
        '-c:v', 'libx264', '-crf', '26', '-preset', 'slow',
        '-c:a', 'aac', '-b:a', '128k',
        '-movflags', '+faststart',
        tmpOut
      ], { stdio: 'ignore' });
      if (fs.existsSync(tmpOut)) {
        const newSize = fs.statSync(tmpOut).size;
        if (newSize < origSize) {
          fs.renameSync(tmpOut, mp4);
          const saved = origSize - newSize;
          mp4Saved += saved;
          console.log(`  -> Reduzido para ${formatBytes(newSize)} (Economia: ${formatBytes(saved)} / -${((saved/origSize)*100).toFixed(1)}%)`);
        } else {
          fs.unlinkSync(tmpOut);
          console.log(`  -> Já estava no menor tamanho ideal.`);
        }
      }
    } catch (err) {
      if (fs.existsSync(tmpOut)) fs.unlinkSync(tmpOut);
      console.error(`  Erro ao comprimir ${mp4}:`, err.message);
    }
  }

  // ETAPA 3: Compressão de GIFs animados (.gif)
  console.log('\n--- ETAPA 3: Otimização de GIFs Animados com Paleta Bayer ---');
  const gifFiles = getAllFiles(PUBLIC_DIR, ['.gif']);
  let gifSaved = 0;
  for (const gif of gifFiles) {
    const origSize = fs.statSync(gif).size;
    const tmpOut = gif + '.tmp.gif';
    try {
      console.log(`Otimizando GIF: ${path.relative(PUBLIC_DIR, gif)} (${formatBytes(origSize)})...`);
      execFileSync('ffmpeg', [
        '-y', '-i', gif,
        '-filter_complex', '[0:v] fps=12,scale=min(iw\\,800):-1:flags=lanczos,split [a][b];[a] palettegen=max_colors=128:reserve_transparent=on [p];[b][p] paletteuse=dither=bayer:bayer_scale=3',
        tmpOut
      ], { stdio: 'ignore' });
      if (fs.existsSync(tmpOut)) {
        const newSize = fs.statSync(tmpOut).size;
        if (newSize < origSize) {
          fs.renameSync(tmpOut, gif);
          const saved = origSize - newSize;
          gifSaved += saved;
          console.log(`  -> Reduzido para ${formatBytes(newSize)} (Economia: ${formatBytes(saved)} / -${((saved/origSize)*100).toFixed(1)}%)`);
        } else {
          fs.unlinkSync(tmpOut);
          console.log(`  -> Mantido original.`);
        }
      }
    } catch (err) {
      if (fs.existsSync(tmpOut)) fs.unlinkSync(tmpOut);
      console.error(`  Erro ao comprimir ${gif}:`, err.message);
    }
  }

  // ETAPA 4: Compressão de Fotos JPG/JPEG com MozJPEG Progressivo
  console.log('\n--- ETAPA 4: Compressão de Fotos JPG com MozJPEG Progressivo ---');
  const jpgFiles = getAllFiles(PUBLIC_DIR, ['.jpg', '.jpeg']);
  let jpgSaved = 0;
  for (const jpg of jpgFiles) {
    const origSize = fs.statSync(jpg).size;
    const tmpOut = jpg + '.tmp.jpg';
    try {
      await sharp(jpg)
        .resize({ width: 2048, withoutEnlargement: true })
        .jpeg({ quality: 80, progressive: true, mozjpeg: true })
        .toFile(tmpOut);
      if (fs.existsSync(tmpOut)) {
        const newSize = fs.statSync(tmpOut).size;
        if (newSize < origSize) {
          fs.renameSync(tmpOut, jpg);
          const saved = origSize - newSize;
          jpgSaved += saved;
          console.log(`Comprimido: ${path.relative(PUBLIC_DIR, jpg)}: ${formatBytes(origSize)} -> ${formatBytes(newSize)} (-${((saved/origSize)*100).toFixed(1)}%)`);
        } else {
          fs.unlinkSync(tmpOut);
        }
      }
    } catch (err) {
      if (fs.existsSync(tmpOut)) fs.unlinkSync(tmpOut);
      console.error(`Erro ao processar JPG ${jpg}:`, err.message);
    }
  }

  // ETAPA 5: Compressão de Imagens PNG com Sharp Palette Quantization
  console.log('\n--- ETAPA 5: Compressão de Imagens PNG com Quantização de Paleta ---');
  const pngFiles = getAllFiles(PUBLIC_DIR, ['.png']);
  let pngSaved = 0;
  let pngCount = 0;
  for (const png of pngFiles) {
    const origSize = fs.statSync(png).size;
    // Otimizar se for maior que 100 KB
    if (origSize < 100 * 1024) continue;
    const tmpOut = png + '.tmp.png';
    try {
      await sharp(png)
        .resize({ width: 1920, withoutEnlargement: true })
        .png({ compressionLevel: 9, palette: true, quality: 85 })
        .toFile(tmpOut);
      if (fs.existsSync(tmpOut)) {
        const newSize = fs.statSync(tmpOut).size;
        if (newSize < origSize) {
          fs.renameSync(tmpOut, png);
          const saved = origSize - newSize;
          pngSaved += saved;
          pngCount++;
          console.log(`PNG ${pngCount}: ${path.relative(PUBLIC_DIR, png)}: ${formatBytes(origSize)} -> ${formatBytes(newSize)} (-${((saved/origSize)*100).toFixed(1)}%)`);
        } else {
          fs.unlinkSync(tmpOut);
        }
      }
    } catch (err) {
      if (fs.existsSync(tmpOut)) fs.unlinkSync(tmpOut);
      console.error(`Erro ao processar PNG ${png}:`, err.message);
    }
  }

  const finalPublicSize = getDirSize(PUBLIC_DIR);
  const totalSaved = initialPublicSize - finalPublicSize;

  console.log('\n======================================================');
  console.log('              RESUMO FINAL DA COMPRESSÃO             ');
  console.log('======================================================');
  console.log(`Tamanho Inicial (public/):     ${formatBytes(initialPublicSize)}`);
  console.log(`Tamanho Final (public/):       ${formatBytes(finalPublicSize)}`);
  console.log(`Total Economizado:             ${formatBytes(totalSaved)} (-${((totalSaved/initialPublicSize)*100).toFixed(1)}%)`);
  console.log(`  - Economia em Vídeos MP4:    ${formatBytes(mp4Saved)}`);
  console.log(`  - Economia em GIFs Animados: ${formatBytes(gifSaved)}`);
  console.log(`  - Economia em Fotos JPG:     ${formatBytes(jpgSaved)}`);
  console.log(`  - Economia em PNGs:          ${formatBytes(pngSaved)}`);
  console.log('======================================================\n');
}

run().catch(err => {
  console.error('Falha geral na compressão:', err);
  process.exit(1);
});
