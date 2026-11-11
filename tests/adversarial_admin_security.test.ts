import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { NextRequest } from 'next/server';
import {
  verifyAdminRequest,
  verifySameOriginRequest,
  authErrorResponse,
  NO_STORE_HEADERS,
} from '@/lib/auth/admin-guard';
import { signToken } from '@/lib/auth/jwt';
import { revokeToken } from '@/lib/auth/token-revocation';

describe('🛡️ Testes Adversariais de Segurança — Blindagem Total do Painel Admin', () => {
  const baseDir = path.resolve(__dirname, '..');

  test('1. Vetor Alg: none & Falsificação de Assinatura: Tokens sem assinatura ou adulterados devem ser rejeitados', async () => {
    // Token unsigned / alg none simulado
    const fakeHeader = Buffer.from(JSON.stringify({ alg: 'none', typ: 'JWT' })).toString('base64url');
    const fakePayload = Buffer.from(JSON.stringify({
      id: 'attacker-123',
      role: 'admin',
      email: 'attacker@evil.com',
      iss: 'mcp-business-os',
      aud: 'mcp-platform'
    })).toString('base64url');
    const fakeToken = `${fakeHeader}.${fakePayload}.`;

    const req = new NextRequest('http://localhost:3000/api/admin/shop-resources', {
      headers: {
        authorization: `Bearer ${fakeToken}`
      }
    });

    const result = await verifyAdminRequest(req, { requireInDev: true });
    assert.equal(result.authorized, false, 'Token alg none deve ser sumariamente invalidado');
    assert.equal(result.statusCode, 401);
  });

  test('2. Vetor Revogação de Token: Tokens revogados/logout devem ser barrados imediatamente', async () => {
    const adminToken = await signToken({
      userId: 'admin-master-id',
      email: 'mateus@mateuscelestinopro.com',
      role: 'admin',
      name: 'Mateus Celestino Pro X'
    });

    // Revoga o token na denylist criptográfica em memória
    await revokeToken({ token: adminToken });

    const req = new NextRequest('http://localhost:3000/api/admin/shop-resources', {
      headers: {
        authorization: `Bearer ${adminToken}`
      }
    });

    const result = await verifyAdminRequest(req, { requireInDev: true });
    assert.equal(result.authorized, false, 'Token revogado deve ter authorized === false');
    assert.equal(result.statusCode, 401);
  });

  test('3. Vetor Elevação de Privilégios (Member -> Admin): Usuário membro comum tentando rota admin deve receber 403', async () => {
    const memberToken = await signToken({
      userId: 'member-legit-id',
      email: 'membro@exemplo.com',
      role: 'member',
      name: 'Membro Normal'
    });

    const req = new NextRequest('http://localhost:3000/api/admin/shop-resources', {
      headers: {
        authorization: `Bearer ${memberToken}`
      }
    });

    const result = await verifyAdminRequest(req, { requireInDev: true });
    assert.equal(result.authorized, false, 'Membro comum não deve ter acesso de administrador');
    assert.equal(result.statusCode, 403, 'Tentativa de elevação deve resultar em 403 Forbidden');
    assert.equal(result.session?.role, 'member', 'Role deve ser reconhecido como member');
  });

  test('4. Vetor CSRF Cross-Origin: Requisições de origens não autorizadas em mutações administrativas devem ser bloqueadas', () => {
    const maliciousReq = new NextRequest('http://localhost:3000/api/admin/shop-resources', {
      method: 'POST',
      headers: {
        origin: 'https://evil-attacker-site.com',
        host: 'localhost:3000'
      }
    });

    const isSafe = verifySameOriginRequest(maliciousReq);
    assert.equal(isSafe, false, 'Origem externa não confiável deve ser bloqueada contra CSRF');
  });

  test('5. Vetor Anti-Cache & Purga: authErrorResponse deve aplicar cabeçalhos no-store rigorosos', () => {
    const deniedResponse = authErrorResponse({
      authorized: false,
      statusCode: 401,
      session: null,
      error: 'Acesso Negado'
    });

    assert.equal(deniedResponse.status, 401);
    assert.ok(deniedResponse.headers.get('Cache-Control')?.includes('no-store'), 'Deve conter diretiva no-store');
    assert.ok(deniedResponse.headers.get('Cache-Control')?.includes('no-cache'), 'Deve conter diretiva no-cache');
  });

  test('6. Vetor Defense-in-Depth UI: Todos os layouts e componentes verificam estritamente isUserAdmin', () => {
    const navbar = fs.readFileSync(path.join(baseDir, 'src/components/layout/Navbar.tsx'), 'utf-8');
    const footer = fs.readFileSync(path.join(baseDir, 'src/components/layout/Footer.tsx'), 'utf-8');
    const dock = fs.readFileSync(path.join(baseDir, 'src/components/layout/MobileBottomNav.tsx'), 'utf-8');
    const sitemap = fs.readFileSync(path.join(baseDir, 'src/components/portal/UniversalSitemapModal.tsx'), 'utf-8');
    const shop = fs.readFileSync(path.join(baseDir, 'src/app/shop/page.tsx'), 'utf-8');

    assert.ok(navbar.includes('isUserAdmin'), 'Navbar deve checar isUserAdmin');
    assert.ok(footer.includes('isUserAdmin'), 'Footer deve checar isUserAdmin');
    assert.ok(dock.includes('isUserAdmin'), 'MobileBottomNav deve checar isUserAdmin');
    assert.ok(sitemap.includes('isUserAdmin'), 'UniversalSitemapModal deve checar isUserAdmin');
    assert.ok(shop.includes('isUserAdmin'), 'ShopPage deve checar isUserAdmin');
  });

  test('7. Vetor Static Hubs: Biblioteca, Showcase e Comunidade possuem blindagem inline e revalidação assíncrona', () => {
    const hubFiles = ['public/biblioteca/index.html', 'public/showcase/index.html', 'public/comunidade/index.html'];

    for (const file of hubFiles) {
      const content = fs.readFileSync(path.join(baseDir, file), 'utf-8');
      assert.ok(content.includes('id="msb-admin-btn"') && content.includes('style="display: none !important;"'), `${file} deve iniciar com display: none !important no admin desktop`);
      assert.ok(content.includes('id="msb-mobile-admin-btn"') && content.includes('style="display: none !important;'), `${file} deve iniciar com display: none !important no admin mobile`);
      assert.ok(content.includes('/api/auth/me'), `${file} deve revalidar com servidor /api/auth/me`);
    }
  });

  test('8. Vetor Bunker Server Component: src/app/admin/layout.tsx e page.tsx executam no servidor e barram acessos não-admin', () => {
    const layout = fs.readFileSync(path.join(baseDir, 'src/app/admin/layout.tsx'), 'utf-8');
    const page = fs.readFileSync(path.join(baseDir, 'src/app/admin/page.tsx'), 'utf-8');

    assert.ok(layout.includes('requireAdminSession'), 'Layout admin deve exigir requireAdminSession() no servidor');
    assert.ok(layout.includes("force-dynamic"), 'Layout admin deve ser force-dynamic');
    assert.ok(page.includes('hasAdminAccess(currentUser)'), 'Page admin deve validar hasAdminAccess');
  });
});
