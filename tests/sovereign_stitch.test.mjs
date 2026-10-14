import { describe, it } from 'node:test';
import assert from 'node:assert';

describe('Sovereign Master Stitch & Navigation Tests', () => {
  it('1. As 4 plataformas soberanas devem responder com HTTP 200 no localhost:3000', async () => {
    const pages = [
      { name: 'Portal Institucional', url: 'http://localhost:3000/' },
      { name: 'Comunidade VIP', url: 'http://localhost:3000/comunidade' },
      { name: 'Form Builder', url: 'http://localhost:3000/builder' },
      { name: 'Biblioteca Galadriel', url: 'http://localhost:3000/biblioteca' },
    ];

    for (const page of pages) {
      const res = await fetch(page.url);
      assert.strictEqual(res.status, 200, `Página ${page.name} (${page.url}) deve responder com status 200`);
    }
  });

  it('2. O Header de Navegação Soberana (master-sovereign-bar) deve estar presente em TODAS as páginas e subpáginas', async () => {
    const pages = [
      '/',
      '/comunidade',
      '/builder',
      '/biblioteca',
      '/artigos',
      '/admin',
      '/comunidade/login',
      '/builder/dashboard',
    ];

    for (const path of pages) {
      const res = await fetch(`http://localhost:3000${path}`);
      assert.strictEqual(res.status, 200, `Rota ${path} deve responder com status 200`);
      const html = await res.text();
      assert.ok(
        html.includes('id="master-sovereign-bar"') || html.includes('MasterSovereignBar'),
        `Rota ${path} DEVE conter o header obrigatório id="master-sovereign-bar"`
      );
      assert.ok(
        html.includes('href="/comunidade"'),
        `Rota ${path} deve conter link para /comunidade`
      );
      assert.ok(
        html.includes('href="/biblioteca"'),
        `Rota ${path} deve conter link para /biblioteca`
      );
    }
  });

  it('2.1 A página /admin deve conter o acesso exclusivo ao Form Builder Cinemático', async () => {
    const res = await fetch('http://localhost:3000/admin');
    assert.strictEqual(res.status, 200);
    const html = await res.text();
    assert.ok(html.includes('Form Builder Cinemático') || html.includes('/builder'), 'Painel admin deve conter o Form Builder Cinemático');
  });

  it('2.2 O Portal Institucional (/) deve conter o Mapa de Navegação Setorial e o Hero Centralizado', async () => {
    const res = await fetch('http://localhost:3000/');
    assert.strictEqual(res.status, 200);
    const html = await res.text();
    // Validar presença do mapa de navegação e seções do acervo
    assert.ok(
      html.includes('id="portal-navigation-map"') || html.includes('PortalNavbar') || html.includes('Artigos (176)'),
      'Portal deve conter o Mapa de Navegação Setorial original'
    );
    assert.ok(
      html.includes('id="home"') || html.includes('MATEUS CELESTINO PRO X'),
      'Portal deve conter o Hero com a identidade oficial centralizada'
    );
  });

  it('3. Rotas de backend obrigatórias devem estar ativas no servidor local', async () => {
    const endpoints = [
      { url: 'http://localhost:3000/api/leads', method: 'GET', expectedStatus: 200 },
      { url: 'http://localhost:3000/api/checkout', method: 'GET', expectedStatus: 200 },
      { url: 'http://localhost:3000/api/library', method: 'GET', expectedStatus: 200 },
    ];

    for (const ep of endpoints) {
      const res = await fetch(ep.url, { method: ep.method });
      assert.strictEqual(res.status, ep.expectedStatus, `Endpoint ${ep.url} deve retornar HTTP ${ep.expectedStatus}`);
      const data = await res.json();
      assert.strictEqual(data.success, true, `Endpoint ${ep.url} deve responder success: true`);
    }
  });

  it('4. POST /api/checkout deve gerar sessão em modo sandbox sem quebras', async () => {
    const res = await fetch('http://localhost:3000/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        planSlug: 'membership-vip',
        email: 'stitch.auditor@mateuscelestinopro.com',
      }),
    });

    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert.ok(json.init_point, 'Deve gerar init_point');
  });

  it('5. POST /api/forms/submit deve aceitar payload e registrar resposta', async () => {
    const res = await fetch('http://localhost:3000/api/forms/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        formId: 'stitch_test',
        formTitle: 'Teste de Costura Soberana',
        responses: [{ label: 'Integrado', answer: 'Sim' }],
      }),
    });

    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert.ok(json.submissionId);
  });
});
