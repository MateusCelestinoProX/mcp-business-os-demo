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

  test('Recursos: 2 Packs Oficiais do Notion presentes com manifesto e licença GPL', () => {
    const recursos = siteData.recursos || [];
    assert.strictEqual(recursos.length, 2, 'Devem existir os 2 packs de recursos do Notion');

    const autoPack = recursos.find(r => r.title === 'AUTOMATION PACK');
    assert.ok(autoPack, 'AUTOMATION PACK deve existir');
    assert.ok(autoPack.manifesto.includes('OPEN SOURCE'), 'AUTOMATION PACK deve conter manifesto open source');
    assert.ok(fs.existsSync(path.join('public', autoPack.cover)), 'Capa do AUTOMATION PACK deve existir');

    const wpPack = recursos.find(r => r.title === 'THE ULTIMATE WORDPRESS PACK');
    assert.ok(wpPack, 'THE ULTIMATE WORDPRESS PACK deve existir');
    assert.ok(/licen[cç]a gpl/i.test(wpPack.manifesto), 'THE ULTIMATE WP PACK deve destacar a licença GPL');
    assert.ok(wpPack.cards?.length === 4, 'THE ULTIMATE WP PACK deve conter os 4 cards de valor');
    assert.ok(fs.existsSync(path.join('public', wpPack.cover)), 'Capa do THE ULTIMATE WP PACK deve existir');
  });

  test('Renderização HTTP no portal (localhost:3000)', async () => {
    const res = await fetch('http://localhost:3000/');
    assert.strictEqual(res.status, 200);
    const html = await res.text();

    // Validar presença de termos autênticos na página pré-renderizada
    assert.ok(html.includes('SEJA BEM VINDO A LOJA VIRTUAL DE MATEUS CELESTINO PRO'));
    assert.ok(html.includes('ULTIMATE TYPEBOT PACK'));
    assert.ok(html.includes('ULTIMATE N8N PACK'));
    assert.ok(html.includes('ULTIMATE MAKE PACK'));
    assert.ok(html.includes('I.A PRO (CURSO)'));
    assert.ok(html.includes('AUTOMATION PACK'));
    assert.ok(html.includes('THE ULTIMATE WORDPRESS PACK'));
    assert.ok(html.includes('SERVIÇOS'));
  });
});
