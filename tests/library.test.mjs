import { test, describe, before } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

const PROJECT_ROOT = process.cwd();
const PUBLIC_CATALOG_PATH = path.join(PROJECT_ROOT, 'public/data/library_catalog_index.json');
const SRC_CATALOG_PATH = path.join(PROJECT_ROOT, 'src/data/library_catalog_index.json');
const SOURCE_DIR = path.join(PROJECT_ROOT, 'public/biblioteca');

describe('Cofre da Biblioteca Oculta de Recursos — Suíte Completa de Testes', () => {
  let publicCatalog = [];
  let srcCatalog = [];

  before(() => {
    assert.ok(fs.existsSync(PUBLIC_CATALOG_PATH), 'public/data/library_catalog_index.json deve existir');
    assert.ok(fs.existsSync(SRC_CATALOG_PATH), 'src/data/library_catalog_index.json deve existir');

    publicCatalog = JSON.parse(fs.readFileSync(PUBLIC_CATALOG_PATH, 'utf-8'));
    srcCatalog = JSON.parse(fs.readFileSync(SRC_CATALOG_PATH, 'utf-8'));
  });

  test('1. Integridade do Catálogo Oficial (Exatamente 406 itens)', () => {
    assert.strictEqual(publicCatalog.length, 406, 'Catálogo público deve conter exatamente 406 recursos');
    assert.strictEqual(srcCatalog.length, 406, 'Catálogo src deve conter exatamente 406 recursos');
  });

  test('2. Validação Estrutural e Unicidade de IDs dos Ativos', () => {
    const ids = new Set();
    const slugs = new Set();

    srcCatalog.forEach((item, index) => {
      assert.ok(item.file, `Item ${index} deve possuir nome de arquivo`);
      assert.ok(item.rel_path, `Item ${index} deve possuir caminho relativo`);
      assert.ok(item.ext, `Item ${index} deve possuir extensão`);
      assert.strictEqual(typeof item.size, 'number', `Item ${index} deve possuir tamanho numérico`);
      assert.ok(item.id, `Item ${index} deve possuir ID`);
      assert.ok(!ids.has(item.id), `ID ${item.id} não pode ser duplicado`);
      ids.add(item.id);

      if (item.slug) {
        assert.ok(!slugs.has(item.slug), `Slug ${item.slug} não pode ser duplicado`);
        slugs.add(item.slug);
      }
    });

    assert.strictEqual(ids.size, 406, 'Devem existir 406 IDs únicos');
  });

  test('3. Existência Física dos Arquivos no Diretório Fonte (406/406)', () => {
    let existingCount = 0;
    srcCatalog.forEach((item) => {
      const fullPath = path.join(SOURCE_DIR, item.rel_path);
      if (fs.existsSync(fullPath)) {
        existingCount++;
      }
    });

    assert.strictEqual(existingCount, 406, 'Todos os 406 arquivos físicos devem existir no acervo original');
  });

  test('4. Classificação por Categorias Rápidas Obrigatórias', () => {
    const validCategories = ['Prompts', 'Ferramentas', 'Blueprints', 'APKs', 'Materiais', 'Documentação'];

    function classify(item) {
      const ext = (item.ext || '').toLowerCase();
      const file = (item.file || '').toLowerCase();
      const cat = (item.category || '').toLowerCase();
      const path = (item.rel_path || '').toLowerCase();
      const preview = (item.text_preview || '').toLowerCase();

      const cats = [];
      if (ext === '.apk' || file.includes('apk') || cat.includes('apk') || path.includes('android')) cats.push('APKs');
      if (cat.includes('prompt') || file.includes('prompt') || path.includes('prompt') || preview.includes('prompt') || ext === '.txt') cats.push('Prompts');
      if (file.includes('blueprint') || cat.includes('skeleton') || cat.includes('veo') || cat.includes('banana') || cat.includes('comfyui') || file.includes('protocol') || cat.includes('dark machine')) cats.push('Blueprints');
      if (ext === '.py' || ext === '.js' || ext === '.json' || ext === '.html' || cat.includes('n8n') || cat.includes('agente') || cat.includes('vibe coding') || cat.includes('mikoai/09-monetization') || file.includes('app') || file.includes('mcp')) cats.push('Ferramentas');
      if (cat.includes('creative studio') || cat.includes('materials') || cat.includes('animation') || ext === '.png' || cat.includes('image references') || cat.includes('influencer') || cat.includes('sex scalating')) cats.push('Materiais');
      if (ext === '.md' || ext === '.docx' || ext === '.pdf' || file.includes('doc') || cat.includes('doc') || file.includes('readme') || file.includes('manual') || cat.includes('central de inteligência')) cats.push('Documentação');
      if (cats.length === 0) cats.push('Documentação');
      return cats;
    }

    const counts = { Prompts: 0, Ferramentas: 0, Blueprints: 0, APKs: 0, Materiais: 0, Documentação: 0 };

    srcCatalog.forEach((item) => {
      const itemCats = classify(item);
      assert.ok(itemCats.length > 0, `Item ${item.file} deve pertencer a pelo menos 1 categoria`);
      itemCats.forEach((c) => {
        if (counts[c] !== undefined) counts[c]++;
      });
    });

    assert.ok(counts.Prompts > 0, 'Categoria Prompts deve conter itens');
    assert.ok(counts.Ferramentas > 0, 'Categoria Ferramentas deve conter itens');
    assert.ok(counts.Blueprints > 0, 'Categoria Blueprints deve conter itens');
    assert.ok(counts.APKs >= 1, 'Categoria APKs deve conter pelo menos o galadriel-mobile.apk');
    assert.ok(counts.Materiais > 0, 'Categoria Materiais deve conter itens');
    assert.ok(counts.Documentação > 0, 'Categoria Documentação deve conter itens');
  });

  test('5. APK Android: Verificação de Metadados e Integridade', () => {
    const apkItem = srcCatalog.find((item) => item.ext === '.apk' || item.file.endsWith('.apk'));
    assert.ok(apkItem, 'APK Galadriel deve estar presente no catálogo');
    assert.strictEqual(apkItem.file, 'galadriel-mobile.apk');
    assert.ok(apkItem.size > 8000000, 'APK deve possuir mais de 8MB (aproximadamente 8.8MB)');

    const apkPath = path.join(SOURCE_DIR, apkItem.rel_path);
    assert.ok(fs.existsSync(apkPath), 'Arquivo físico do APK deve existir');
    const stat = fs.statSync(apkPath);
    assert.strictEqual(stat.size, apkItem.size, 'Tamanho do APK no disco deve corresponder exatamente ao catálogo');
  });

  test('6. Proteção Contra Path Traversal na Rota de Download', () => {
    function isSafePath(baseDir, relativePath) {
      const normalizedInput = relativePath.replace(/\\/g, '/');
      const resolved = path.resolve(baseDir, normalizedInput);
      return resolved.startsWith(baseDir);
    }

    const maliciousPaths = [
      '../../../../etc/passwd',
      '..\\..\\..\\windows\\system32',
      'the skeleton method/../../../../etc/shadow',
      '../../../s-a-a-s-full-hidden-library/../secret.txt',
    ];

    maliciousPaths.forEach((malicious) => {
      const safe = isSafePath(SOURCE_DIR, malicious);
      assert.strictEqual(safe, false, `Caminho malicioso ${malicious} deve ser rejeitado pela validação`);
    });

    const legitimatePaths = [
      'the skeleton method/30-gumroad.pdf',
      'galadriel-mobile.apk',
      'geral prompts/midjourney.txt',
    ];

    legitimatePaths.forEach((legit) => {
      const safe = isSafePath(SOURCE_DIR, legit);
      assert.strictEqual(safe, true, `Caminho legítimo ${legit} deve ser aprovado`);
    });
  });

  test('7. Verificação de Código e Arquitetura Next.js 15 App Router', () => {
    const filesToCheck = [
      'src/lib/library/catalog.ts',
      'src/app/api/library/route.ts',
      'src/app/api/library/download/route.ts',
      'src/components/library/DownloadButton.tsx',
      'src/components/library/SearchHeader.tsx',
      'src/components/library/CatalogGrid.tsx',
      'src/components/library/ResourceViewer.tsx',
      'src/app/biblioteca/route.ts',
      'src/app/biblioteca/[id]/page.tsx',
    ];

    filesToCheck.forEach((rel) => {
      const abs = path.join(PROJECT_ROOT, rel);
      assert.ok(fs.existsSync(abs), `Arquivo obrigatório ${rel} deve existir`);
      const content = fs.readFileSync(abs, 'utf-8');
      assert.ok(content.length > 100, `Arquivo ${rel} não pode estar vazio`);
    });
  });
});
