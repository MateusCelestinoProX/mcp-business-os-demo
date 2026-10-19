import { describe, it } from 'node:test';
import assert from 'node:assert';
import fs from 'fs';
import path from 'path';

const BASE_DIR = path.resolve(__dirname, '..');

describe('Loja Virtual (Shop) & Painel Admin /admin/shop — Suite de Validação Soberana', () => {
  it('1. Deve existir a página dedicada src/app/admin/shop/page.tsx', () => {
    const pagePath = path.join(BASE_DIR, 'src/app/admin/shop/page.tsx');
    assert.ok(fs.existsSync(pagePath), 'src/app/admin/shop/page.tsx deve existir');

    const content = fs.readFileSync(pagePath, 'utf8');
    assert.ok(content.includes('ShopControlSuite'), 'Deve renderizar ShopControlSuite');
    assert.ok(content.includes('/admin'), 'Deve conter link de retorno ao painel admin');
    assert.ok(content.includes('/shop'), 'Deve conter link para a loja oficial');
  });

  it('2. Deve existir o componente master src/components/admin/ShopControlSuite.tsx', () => {
    const suitePath = path.join(BASE_DIR, 'src/components/admin/ShopControlSuite.tsx');
    assert.ok(fs.existsSync(suitePath), 'src/components/admin/ShopControlSuite.tsx deve existir');

    const content = fs.readFileSync(suitePath, 'utf8');
    assert.ok(content.includes('AlternatingHeroBanner'), 'Deve suportar banner com imagens alternadas');
    assert.ok(content.includes('parseNotionMarkdown'), 'Deve usar parser de Markdown');
    assert.ok(content.includes('Saiba mais'), 'Deve conter o botão único Saiba mais');
    assert.ok(content.includes('/api/admin/shop-resources'), 'Deve se comunicar com a rota de API do banco');
  });

  it('3. O componente ShopSection deve possuir apenas o botão único "Saiba mais" e suporte a Markdown', () => {
    const shopSectionPath = path.join(BASE_DIR, 'src/components/portal/ShopSection.tsx');
    assert.ok(fs.existsSync(shopSectionPath), 'ShopSection.tsx deve existir');

    const content = fs.readFileSync(shopSectionPath, 'utf8');
    
    // Validar presença de "Saiba mais" como ação primária
    assert.ok(content.includes('<span>Saiba mais</span>'), 'Deve conter o texto do botão único Saiba mais');
    assert.ok(content.includes('parseNotionMarkdown'), 'Deve importar e usar parseNotionMarkdown');
    
    // Garantir que os botões antigos "Ver Detalhes" ou "Ver Escopo" foram removidos do card principal
    assert.ok(!content.includes('<span>Ver Detalhes</span>'), 'Botão secundário "Ver Detalhes" não deve mais constar no card principal');
    assert.ok(!content.includes('<span>Ver Escopo</span>'), 'Botão secundário "Ver Escopo" não deve mais constar no card principal');
  });

  it('4. A página /shop deve estar sincronizada com a API e possuir atalho para o admin', () => {
    const shopPagePath = path.join(BASE_DIR, 'src/app/shop/page.tsx');
    assert.ok(fs.existsSync(shopPagePath), 'src/app/shop/page.tsx deve existir');

    const content = fs.readFileSync(shopPagePath, 'utf8');
    assert.ok(content.includes('/api/admin/shop-resources'), 'ShopPage deve buscar dados atualizados na API');
    assert.ok(content.includes('/admin/shop'), 'ShopPage deve ter atalho para gerenciar a loja');
  });

  it('5. A rota POST /api/admin/shop-resources deve exigir autenticação de administrador', async () => {
    const { POST } = await import('../src/app/api/admin/shop-resources/route');
    const { NextRequest } = await import('next/server');

    const unauthReq = new NextRequest('http://localhost:3000/api/admin/shop-resources', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ shop: { produtos: [] } }),
    });

    const prevEnv = process.env.NODE_ENV;
    (process.env as any).NODE_ENV = 'production';
    try {
      const res = await POST(unauthReq);
      assert.strictEqual(res.status, 401, 'Requisição sem autenticação deve retornar 401 Unauthorized');
    } finally {
      (process.env as any).NODE_ENV = prevEnv;
    }
  });

  it('6. A rota GET /api/admin/shop-resources deve retornar configurações normalizadas com catálogo completo', async () => {
    const { GET } = await import('../src/app/api/admin/shop-resources/route');

    const res = await GET();
    assert.strictEqual(res.status, 200, 'GET /api/admin/shop-resources deve responder HTTP 200');
    const data = await res.json();
    assert.strictEqual(data.success, true, 'Resposta deve indicar success: true');
    assert.ok(data.config.shop, 'Deve conter nó shop');
    assert.ok(Array.isArray(data.config.shop.produtos), 'Deve conter produtos em array');
    assert.ok(data.config.shop.produtos.length >= 4, 'Deve conter pelo menos 4 produtos digitais oficiais');
    assert.ok(Array.isArray(data.config.shop.servicos), 'Deve conter servicos em array');
    assert.ok(data.config.shop.servicos.length >= 2, 'Deve conter pelo menos 2 serviços sob medida oficiais');
    assert.ok(data.config.shop.hero, 'Deve conter hero configurado');
  });

  it('7. ShopControlSuite e rotas devem ser resilientes contra records vazios no banco', () => {
    const suiteContent = fs.readFileSync(path.join(BASE_DIR, 'src/components/admin/ShopControlSuite.tsx'), 'utf8');
    assert.ok(suiteContent.includes('sh.produtos.length > 0'), 'ShopControlSuite não deve limpar produtos se array vier vazio');
    assert.ok(suiteContent.includes('siteData.shop.produtos'), 'ShopControlSuite deve usar siteData como fallback para produtos');
  });
});
