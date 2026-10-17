import { test, describe } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

describe('Validação da Restauração Autêntica do Notion: Shop e Recursos', () => {
  const siteDataPath = path.resolve('src/data/siteData.json');
  const siteData = JSON.parse(fs.readFileSync(siteDataPath, 'utf8'));

  test('Shop: Hero e Blocos de Destaque autênticos do Notion', () => {
    assert.ok(siteData.shop?.hero, 'Hero do Shop deve existir');
    assert.strictEqual(
      siteData.shop.hero.welcome,
      'SEJA BEM VINDO A LOJA VIRTUAL DE MATEUS CELESTINO PRO'
    );
    assert.strictEqual(siteData.shop.hero.features.length, 3);
    assert.strictEqual(siteData.shop.hero.idealFor.length, 5);
    assert.ok(fs.existsSync(path.join('public', siteData.shop.hero.artImage)), 'Arte oficial do Shop deve existir em public');
  });

  test('Shop: 4 Produtos Oficiais do Notion presentes com dados completos', () => {
    const produtos = siteData.shop?.produtos || [];
    assert.strictEqual(produtos.length, 4, 'Devem existir exatamente os 4 produtos do Notion');
    
    const titles = produtos.map(p => p.title);
    assert.ok(titles.includes('ULTIMATE TYPEBOT PACK'));
    assert.ok(titles.includes('ULTIMATE N8N PACK'));
    assert.ok(titles.includes('ULTIMATE MAKE PACK'));
    assert.ok(titles.includes('I.A PRO (CURSO)'));

    for (const prod of produtos) {
      assert.ok(prod.headline, `Produto ${prod.title} deve ter headline`);
      assert.ok(prod.highlights.length >= 4, `Produto ${prod.title} deve ter ao menos 4 destaques`);
      assert.ok(fs.existsSync(path.join('public', prod.cover)), `Capa do produto ${prod.title} deve existir em public`);
    }
  });

  test('Shop: 2 Serviços Oficiais do Notion presentes com dados completos', () => {
    const servicos = siteData.shop?.servicos || [];
    assert.strictEqual(servicos.length, 2, 'Devem existir exatamente os 2 serviços do Notion');

    const titles = servicos.map(s => s.title);
    assert.ok(titles.includes('A.I AGENTS'));
    assert.ok(titles.includes('PÁGINA DE LINKS (SUPERIOR)'));

    for (const serv of servicos) {
      assert.ok(serv.headline, `Serviço ${serv.title} deve ter headline`);
      assert.ok(serv.highlights.length >= 4, `Serviço ${serv.title} deve ter ao menos 4 destaques`);
      assert.ok(fs.existsSync(path.join('public', serv.cover)), `Capa do serviço ${serv.title} deve existir em public`);
    }
  });

  test('Garantir que a aba e seção de Recursos foi removida do portal e do header', async () => {
    const res = await fetch('http://localhost:3000/');
    assert.strictEqual(res.status, 200);
    const html = await res.text();

    // Validar ausência do link Free Resources na navbar superior e Recursos na subnav
    assert.ok(!html.includes('id="recursos"'), 'Seção #recursos não deve existir no HTML');
    assert.ok(!html.includes('Free Resources totalmente de graça'), 'Texto antigo de recursos não deve constar');
  });
});
