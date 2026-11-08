import { test, describe } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { GET as getPublicBanners } from '../src/app/api/banners/route';
import {
  GET as getAdminBanners,
  POST as postAdminBanners,
  DELETE as deleteAdminBanners,
} from '../src/app/api/admin/banners/route';
import { NextRequest } from 'next/server';

describe('Sistema Inteligente de Banners & Exit-Intent — Validação Soberana', () => {
  test('1. Deve existir o arquivo de dados padrão src/data/banners.json com estrutura válida e lista vazia', () => {
    const bannersPath = path.join(process.cwd(), 'src/data/banners.json');
    assert.ok(fs.existsSync(bannersPath), 'src/data/banners.json deve existir');

    const content = JSON.parse(fs.readFileSync(bannersPath, 'utf8'));
    assert.ok(Array.isArray(content.banners), 'banners deve ser um array');
    assert.strictEqual(
      content.banners.length,
      0,
      'banners deve iniciar vazio até que o administrador crie e publique banners'
    );
    assert.strictEqual(typeof content.globalEnabled, 'boolean', 'globalEnabled deve ser booleano');
  });

  test('2. Deve existir a página dedicada src/app/admin/banners/page.tsx', () => {
    const pagePath = path.join(process.cwd(), 'src/app/admin/banners/page.tsx');
    assert.ok(fs.existsSync(pagePath), 'src/app/admin/banners/page.tsx deve existir');

    const code = fs.readFileSync(pagePath, 'utf8');
    assert.ok(code.includes('BannersControlSuite'), 'deve renderizar BannersControlSuite');
    assert.ok(code.includes('AdminSidebar'), 'deve renderizar AdminSidebar');
    assert.ok(code.includes('getSession'), 'deve validar sessão do administrador');
  });

  test('3. Deve existir o componente master src/components/admin/BannersControlSuite.tsx', () => {
    const suitePath = path.join(process.cwd(), 'src/components/admin/BannersControlSuite.tsx');
    assert.ok(fs.existsSync(suitePath), 'BannersControlSuite.tsx deve existir');

    const code = fs.readFileSync(suitePath, 'utf8');
    assert.ok(code.includes('BannersControlSuite'), 'deve exportar BannersControlSuite');
    assert.ok(code.includes('toggleBannerStatus'), 'deve permitir alternar status do banner');
    assert.ok(code.includes('handleDeleteBanner'), 'deve permitir excluir banners');
  });

  test('4. Deve existir o componente cliente src/components/banners/SmartBannerSystem.tsx com suporte a exit_intent e onboarding', () => {
    const bannerSystemPath = path.join(process.cwd(), 'src/components/banners/SmartBannerSystem.tsx');
    assert.ok(fs.existsSync(bannerSystemPath), 'SmartBannerSystem.tsx deve existir');

    const code = fs.readFileSync(bannerSystemPath, 'utf8');
    assert.ok(code.includes('SmartBannerSystem'), 'deve exportar SmartBannerSystem');
    assert.ok(code.includes('exit_intent'), 'deve gerenciar eventos de exit_intent');
    assert.ok(code.includes('onboarding'), 'deve gerenciar eventos de onboarding');
    assert.ok(code.includes("pathname?.startsWith('/admin')"), 'deve ignorar rotas do admin');
  });

  test('5. AdminSidebar deve possuir o item de navegação de banners', () => {
    const sidebarPath = path.join(process.cwd(), 'src/components/admin/AdminSidebar.tsx');
    const code = fs.readFileSync(sidebarPath, 'utf8');
    assert.ok(code.includes('banners'), 'AdminSidebar deve conter id banners');
    assert.ok(code.includes('/admin/banners'), 'AdminSidebar deve ter link para /admin/banners');
  });

  test('6. A rota pública GET /api/banners deve retornar com status 200 e lista limpa sem banners mock', async () => {
    const response = await getPublicBanners();
    assert.strictEqual(response.status, 200);

    const json = await response.json();
    assert.strictEqual(json.success, true);
    assert.ok(Array.isArray(json.data.banners), 'data.banners deve ser array');
    assert.strictEqual(
      json.data.banners.length,
      0,
      'nenhum banner mock deve ser retornado se o admin não cadastrou banners'
    );
  });

  test('7. As rotas /api/admin/banners devem exigir autenticação de administrador (401 sem token)', async () => {
    const unauthReq = new NextRequest('http://localhost:3000/api/admin/banners');

    const getRes = await getAdminBanners(unauthReq);
    assert.strictEqual(getRes.status, 401, 'GET /api/admin/banners sem auth deve retornar 401');

    const postRes = await postAdminBanners(
      new NextRequest('http://localhost:3000/api/admin/banners', {
        method: 'POST',
        body: JSON.stringify({ title: 'Hack' }),
      })
    );
    assert.strictEqual(postRes.status, 401, 'POST /api/admin/banners sem auth deve retornar 401');

    const delRes = await deleteAdminBanners(
      new NextRequest('http://localhost:3000/api/admin/banners?id=test', {
        method: 'DELETE',
      })
    );
    assert.strictEqual(delRes.status, 401, 'DELETE /api/admin/banners sem auth deve retornar 401');
  });
});
