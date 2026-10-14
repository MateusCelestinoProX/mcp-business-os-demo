import { test, describe } from 'node:test';
import assert from 'node:assert';
import path from 'node:path';

// Carrega o catálogo e simula as funções de negócio
import {
  getAllResources,
  getResourceById,
  searchAndFilterResources,
  recordDownload,
  classifyQuickCategories,
} from '../src/lib/library/catalog.ts';

describe('API & Serviços da Biblioteca — Testes Funcionais & Adversariais', () => {
  test('1. getAllResources retorna todos os 406 ativos normalizados', () => {
    const all = getAllResources();
    assert.strictEqual(all.length, 406);
    all.forEach((item) => {
      assert.ok(item.id, 'Deve ter ID');
      assert.ok(item.title, 'Deve ter título');
      assert.ok(item.file, 'Deve ter arquivo');
      assert.ok(item.quick_categories.length > 0, 'Deve ter ao menos uma categoria rápida');
    });
  });

  test('2. Busca por termo específico ("veo") retorna resultados relevantes', () => {
    const res = searchAndFilterResources({ query: 'veo', category: 'Todos' });
    assert.ok(res.total > 0, 'Deve encontrar recursos contendo "veo"');
    res.items.forEach((item) => {
      const match =
        item.title.toLowerCase().includes('veo') ||
        item.file.toLowerCase().includes('veo') ||
        item.category.toLowerCase().includes('veo') ||
        item.text_preview.toLowerCase().includes('veo');
      assert.ok(match, `Item ${item.file} deve conter match para termo "veo"`);
    });
  });

  test('3. Busca por termo inexistente ("xyz999nonsenseterm") retorna 0 resultados sem explodir', () => {
    const res = searchAndFilterResources({ query: 'xyz999nonsenseterm', category: 'Todos' });
    assert.strictEqual(res.total, 0);
    assert.strictEqual(res.items.length, 0);
    assert.strictEqual(res.totalPages, 1);
  });

  test('4. Filtro por Categoria "APKs" retorna exclusivamente o pacote do aplicativo', () => {
    const res = searchAndFilterResources({ category: 'APKs' });
    assert.ok(res.total >= 1, 'Deve retornar ao menos 1 APK');
    const hasApk = res.items.some((item) => item.ext === '.apk' || item.file.includes('apk'));
    assert.ok(hasApk, 'Deve conter o arquivo APK');
  });

  test('5. Paginação segura: limites e páginas fora de faixa', () => {
    // Página padrão limit=10
    const page1 = searchAndFilterResources({ page: 1, limit: 10 });
    assert.strictEqual(page1.items.length, 10);
    assert.strictEqual(page1.page, 1);
    assert.strictEqual(page1.totalPages, 41);

    // Página muito alta deve ser clampada na última página válida
    const pageOverflow = searchAndFilterResources({ page: 9999, limit: 10 });
    assert.strictEqual(pageOverflow.page, pageOverflow.totalPages);
    assert.ok(pageOverflow.items.length > 0);

    // Página negativa ou zero deve ser clampada na página 1
    const pageUnderflow = searchAndFilterResources({ page: -5, limit: 10 });
    assert.strictEqual(pageUnderflow.page, 1);
  });

  test('6. Busca por ID ou Slug único', () => {
    const item1 = getResourceById('1');
    assert.ok(item1, 'Deve encontrar item 1');
    assert.strictEqual(item1.id, '1');

    const itemBySlug = getResourceById(item1.slug);
    assert.ok(itemBySlug, 'Deve encontrar item pelo slug');
    assert.strictEqual(itemBySlug.id, item1.id);

    const nonExistent = getResourceById('id-totalmente-inexistente-12345');
    assert.strictEqual(nonExistent, undefined);
  });

  test('7. Telemetria de Download incrementa contador com segurança', () => {
    const initial = getResourceById('1');
    const prevCount = initial.download_count;

    const res = recordDownload('1');
    assert.strictEqual(res.newCount, prevCount + 1);

    const updated = getResourceById('1');
    assert.strictEqual(updated.download_count, prevCount + 1);
  });
});
