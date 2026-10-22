import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { verifyAdminRequest } from '../src/lib/auth/admin-guard';
import { signToken } from '../src/lib/auth/jwt';
import { GET as getFinance } from '../src/app/api/finance/route';
import { POST as postShop } from '../src/app/api/admin/shop-resources/route';
import { POST as postArticle } from '../src/app/api/articles/route';
import { POST as postSendEmail } from '../src/app/api/send-email/route';
import { GET as getDownload } from '../src/app/api/library/download/route';
import { NextRequest } from 'next/server';

describe('🛡️ Plataforma Unificada Soberana — Suíte de Auditoria e Testes de Segurança', () => {

  test('1. Bloqueio de Spoofing de Cabeçalhos: /api/finance rejeita x-user-role não assinado', async () => {
    // Tenta bypass com header forjado x-user-role: admin sem cookie nem Bearer token
    const fakeRequest = new Request('http://localhost:3000/api/finance', {
      method: 'GET',
      headers: {
        'x-user-role': 'admin',
      },
    });

    // Temporariamente sobrescreve NODE_ENV para simular ambiente produtivo estrito
    const prevEnv = process.env.NODE_ENV;
    (process.env as any).NODE_ENV = 'production';
    try {
      const res = await getFinance(fakeRequest);
      assert.strictEqual(res.status, 401, 'Requisição com header forjado deve receber HTTP 401');
      const data = await res.json();
      assert.strictEqual(data.success, false);
    } finally {
      (process.env as any).NODE_ENV = prevEnv;
    }
  });

  test('2. Proteção de Modificação de Loja: POST /api/admin/shop-resources exige autenticação admin', async () => {
    const unauthRequest = new NextRequest('http://localhost:3000/api/admin/shop-resources', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ shop: { produtos: [] } }),
    });

    const prevEnv = process.env.NODE_ENV;
    (process.env as any).NODE_ENV = 'production';
    try {
      const res = await postShop(unauthRequest);
      assert.strictEqual(res.status, 401, 'POST sem sessão admin deve retornar 401');
    } finally {
      (process.env as any).NODE_ENV = prevEnv;
    }
  });

  test('3. Proteção de Postagem de Conteúdo: POST /api/articles exige sessão admin', async () => {
    const unauthRequest = new NextRequest('http://localhost:3000/api/articles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Hacked Post', content: 'Injeção' }),
    });

    const prevEnv = process.env.NODE_ENV;
    (process.env as any).NODE_ENV = 'production';
    try {
      const res = await postArticle(unauthRequest);
      assert.strictEqual(res.status, 401, 'POST de artigo sem sessão deve retornar 401');
    } finally {
      (process.env as any).NODE_ENV = prevEnv;
    }
  });

  test('4. Rejeição de E-mail Malicioso / Injeção: POST /api/send-email valida destinatário', async () => {
    const reqInvalid = new Request('http://localhost:3000/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to: 'invalid-email-address', userName: '<script>alert(1)</script>' }),
    });

    const res = await postSendEmail(reqInvalid);
    assert.strictEqual(res.status, 400, 'Destinatário sem formato válido deve retornar 400');
  });

  test('6. Proteção de Path Traversal no Cofre de Recursos: /api/library/download rejeita escape', async () => {
    const reqEscape = new NextRequest('http://localhost:3000/api/library/download?id=../../etc/passwd');
    const res = await getDownload(reqEscape);
    // Deve retornar 404 (não encontrado no catálogo) ou 403 (violação de segurança)
    assert.ok(res.status === 404 || res.status === 403, `Esperado 404 ou 403, recebido ${res.status}`);
  });

  test('7. Validação Criptográfica de JWT: verifyAdminRequest autoriza token admin legítimo', async () => {
    process.env.JWT_SECRET = 'sovereign-production-master-secret-key-64-characters-minimum-secure-audit-jwt';
    const adminToken = await signToken({
      userId: 'admin_real_id',
      email: 'mcp6667@proton.me',
      name: 'Mateus Celestino',
      role: 'admin',
    });

    const authReq = new Request('http://localhost:3000/api/finance', {
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
    });

    const prevEnv = process.env.NODE_ENV;
    (process.env as any).NODE_ENV = 'production';
    try {
      const verification = await verifyAdminRequest(authReq);
      assert.strictEqual(verification.authorized, true, 'Token com assinatura HS256 válida deve ser autorizado');
      assert.strictEqual(verification.session?.email, 'mcp6667@proton.me');
      assert.strictEqual(verification.session?.role, 'admin');
    } finally {
      (process.env as any).NODE_ENV = prevEnv;
    }
  });

  test('8. Rejeição de Token com Privilégio Comum: verifyAdminRequest barra role membro', async () => {
    process.env.JWT_SECRET = 'sovereign-production-master-secret-key-64-characters-minimum-secure-audit-jwt';
    const memberToken = await signToken({
      userId: 'member_id',
      email: 'membro@teste.com',
      name: 'Membro Comum',
      role: 'member',
    });

    const authReq = new Request('http://localhost:3000/api/finance', {
      headers: {
        Authorization: `Bearer ${memberToken}`,
      },
    });

    const prevEnv = process.env.NODE_ENV;
    (process.env as any).NODE_ENV = 'production';
    try {
      const verification = await verifyAdminRequest(authReq);
      assert.strictEqual(verification.authorized, false, 'Membro comum deve ser rejeitado em rota admin');
      assert.ok(verification.error?.includes('privilégios de Administrador'));
    } finally {
      (process.env as any).NODE_ENV = prevEnv;
    }
  });

  test('9. Validação de Moderador: verifyAdminRequest autoriza role moderador para gestão', async () => {
    process.env.JWT_SECRET = 'sovereign-production-master-secret-key-64-characters-minimum-secure-audit-jwt';
    const moderToken = await signToken({
      userId: 'moder_id',
      email: 'moderador@mateuscelestinopro.com',
      name: 'Moderador Oficial',
      role: 'moder',
    });

    const authReq = new Request('http://localhost:3000/api/finance', {
      headers: {
        Authorization: `Bearer ${moderToken}`,
      },
    });

    const prevEnv = process.env.NODE_ENV;
    (process.env as any).NODE_ENV = 'production';
    try {
      const verification = await verifyAdminRequest(authReq);
      assert.strictEqual(verification.authorized, true, 'Moderador com token válido deve ser autorizado');
      assert.strictEqual(verification.session?.role, 'moder');
    } finally {
      (process.env as any).NODE_ENV = prevEnv;
    }
  });

  test('10. Blindagem de Rotas de Bibliotecas: GET/POST/DELETE /api/admin/libraries exigem autenticação', async () => {
    const { GET, POST, DELETE } = await import('../src/app/api/admin/libraries/route');
    const prevEnv = process.env.NODE_ENV;
    (process.env as any).NODE_ENV = 'production';
    try {
      const unauthGet = new NextRequest('http://localhost:3000/api/admin/libraries');
      const resGet = await GET(unauthGet);
      assert.strictEqual(resGet.status, 401, 'GET /api/admin/libraries não autenticado deve retornar 401');

      const unauthPost = new NextRequest('http://localhost:3000/api/admin/libraries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Hacked Library' }),
      });
      const resPost = await POST(unauthPost);
      assert.strictEqual(resPost.status, 401, 'POST /api/admin/libraries não autenticado deve retornar 401');

      const unauthDelete = new NextRequest('http://localhost:3000/api/admin/libraries?id=123', {
        method: 'DELETE',
      });
      const resDel = await DELETE(unauthDelete);
      assert.strictEqual(resDel.status, 401, 'DELETE /api/admin/libraries não autenticado deve retornar 401');
    } finally {
      (process.env as any).NODE_ENV = prevEnv;
    }
  });

  test('11. Blindagem de Edição e Exclusão de Artigos: PUT e DELETE /api/articles exigem autenticação', async () => {
    const { PUT, DELETE } = await import('../src/app/api/articles/route');
    const prevEnv = process.env.NODE_ENV;
    (process.env as any).NODE_ENV = 'production';
    try {
      const unauthPut = new NextRequest('http://localhost:3000/api/articles', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: '123', title: 'Hacked Article' }),
      });
      const resPut = await PUT(unauthPut);
      assert.strictEqual(resPut.status, 401, 'PUT /api/articles não autenticado deve retornar 401');

      const unauthDel = new NextRequest('http://localhost:3000/api/articles?id=123', {
        method: 'DELETE',
      });
      const resDel = await DELETE(unauthDel);
      assert.strictEqual(resDel.status, 401, 'DELETE /api/articles não autenticado deve retornar 401');
    } finally {
      (process.env as any).NODE_ENV = prevEnv;
    }
  });

  test('12. Botão Admin em Layouts: restrito estritamente a administradores', async () => {
    const fs = await import('node:fs');
    const path = await import('node:path');

    // 1. Shop Page: botão Gerenciar Shop protegido por isUserAdmin
    const shopContent = fs.readFileSync(path.resolve(__dirname, '../src/app/shop/page.tsx'), 'utf-8');
    assert.ok(shopContent.includes('{isUserAdmin && ('), 'Botão Gerenciar Shop deve estar protegido por isUserAdmin');

    // 2. Universal Sitemap: Pilar 4 protegido por isUserAdmin
    const sitemapContent = fs.readFileSync(path.resolve(__dirname, '../src/components/portal/UniversalSitemapModal.tsx'), 'utf-8');
    assert.ok(sitemapContent.includes('{isUserAdmin && (activeFilter ==='), 'Pilar 4 no sitemap deve estar protegido por isUserAdmin');

    // 3. Navbar: Botões protegidos por isUserAdmin
    const navbarContent = fs.readFileSync(path.resolve(__dirname, '../src/components/layout/Navbar.tsx'), 'utf-8');
    assert.ok(navbarContent.includes('{isUserAdmin && ('), 'Navbar desktop deve condicionar botão admin a isUserAdmin');

    // 4. MobileBottomNav: adminOnly filtrado por isUserAdmin
    const mobileNavContent = fs.readFileSync(path.resolve(__dirname, '../src/components/layout/MobileBottomNav.tsx'), 'utf-8');
    assert.ok(mobileNavContent.includes('!item.adminOnly || isUserAdmin'), 'MobileBottomNav deve condicionar botão admin a isUserAdmin');

    // 5. Footer: protegido por isUserAdmin
    const footerContent = fs.readFileSync(path.resolve(__dirname, '../src/components/layout/Footer.tsx'), 'utf-8');
    assert.ok(footerContent.includes('{isUserAdmin && ('), 'Footer deve condicionar botão admin a isUserAdmin');
  });

  test('13. Permissões de Acesso ao Painel Admin: administradores e moderadores autorizados, outros bloqueados', async () => {
    const { hasAdminAccess, hasAdminOrModerAccess } = await import('../src/lib/auth/unified-auth');

    const adminUser = { id: '1', isLoggedIn: true, role: 'admin' as const, name: 'Admin', email: 'a@a.com', avatar: '' };
    const moderUser = { id: '2', isLoggedIn: true, role: 'moder' as const, name: 'Moder', email: 'm@m.com', avatar: '' };
    const memberUser = { id: '3', isLoggedIn: true, role: 'user' as const, name: 'User', email: 'u@u.com', avatar: '' };
    const guestUser = { id: '4', isLoggedIn: false, role: 'visitante' as const, name: '', email: '', avatar: '' };

    // Botão no layout: APENAS ADMIN
    assert.strictEqual(hasAdminAccess(adminUser), true, 'Admin deve ter hasAdminAccess = true');
    assert.strictEqual(hasAdminAccess(moderUser), false, 'Moderador NÃO deve ter hasAdminAccess = true (botão do layout exclusivo para admin)');
    assert.strictEqual(hasAdminAccess(memberUser), false, 'Membro NÃO deve ter hasAdminAccess');
    assert.strictEqual(hasAdminAccess(guestUser), false, 'Visitante NÃO deve ter hasAdminAccess');

    // Acesso ao Painel: ADMIN E MODERADOR
    assert.strictEqual(hasAdminOrModerAccess(adminUser), true, 'Admin deve ter acesso ao painel');
    assert.strictEqual(hasAdminOrModerAccess(moderUser), true, 'Moderador deve ter acesso ao painel');
    assert.strictEqual(hasAdminOrModerAccess(memberUser), false, 'Membro NÃO deve ter acesso ao painel');
    assert.strictEqual(hasAdminOrModerAccess(guestUser), false, 'Visitante NÃO deve ter acesso ao painel');
  });

  test('14. Blindagem do Middleware: Rejeita Bearer token falso/inválido em rota restrita', async () => {
    const { middleware } = await import('../src/middleware');
    const fakeBearerReq = new NextRequest('http://localhost:3000/api/admin/libraries', {
      headers: {
        Authorization: 'Bearer invalid_forged_token_bypass',
      },
    });

    const res = await middleware(fakeBearerReq);
    assert.strictEqual(res.status, 401, 'Bearer token inválido no middleware deve retornar 401');
  });

  test('15. Proteção de Storage ImageKit: Ações restritas exigem autenticação admin', async () => {
    const { GET, POST, DELETE } = await import('../src/app/api/storage/imagekit/route');
    const prevEnv = process.env.NODE_ENV;
    (process.env as any).NODE_ENV = 'production';
    try {
      // action=list sem auth
      const reqList = new NextRequest('http://localhost:3000/api/storage/imagekit?action=list');
      const resList = await GET(reqList);
      assert.strictEqual(resList.status, 401, 'action=list não autenticado deve retornar 401');

      // action=auth sem auth
      const reqAuth = new NextRequest('http://localhost:3000/api/storage/imagekit?action=auth');
      const resAuth = await GET(reqAuth);
      assert.strictEqual(resAuth.status, 401, 'action=auth não autenticado deve retornar 401');

      // POST sem auth
      const reqPost = new NextRequest('http://localhost:3000/api/storage/imagekit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ file: 'test', fileName: 'test.png' }),
      });
      const resPost = await POST(reqPost);
      assert.strictEqual(resPost.status, 401, 'POST /api/storage/imagekit não autenticado deve retornar 401');

      // DELETE sem auth
      const reqDel = new NextRequest('http://localhost:3000/api/storage/imagekit?fileId=123', {
        method: 'DELETE',
      });
      const resDel = await DELETE(reqDel);
      assert.strictEqual(resDel.status, 401, 'DELETE /api/storage/imagekit não autenticado deve retornar 401');
    } finally {
      (process.env as any).NODE_ENV = prevEnv;
    }
  });

  test('16. Proteção de Itens da Biblioteca: GET/PUT/DELETE /api/admin/libraries/items/[id] exigem auth', async () => {
    const { GET, PUT, DELETE } = await import('../src/app/api/admin/libraries/items/[id]/route');
    const prevEnv = process.env.NODE_ENV;
    (process.env as any).NODE_ENV = 'production';
    try {
      const dummyParams = { params: Promise.resolve({ id: 'res-test' }) };

      const unauthGet = new NextRequest('http://localhost:3000/api/admin/libraries/items/res-test');
      const resGet = await GET(unauthGet, dummyParams);
      assert.strictEqual(resGet.status, 401, 'GET item não autenticado deve retornar 401');

      const unauthPut = new NextRequest('http://localhost:3000/api/admin/libraries/items/res-test', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'Hacked' }),
      });
      const resPut = await PUT(unauthPut, dummyParams);
      assert.strictEqual(resPut.status, 401, 'PUT item não autenticado deve retornar 401');

      const unauthDel = new NextRequest('http://localhost:3000/api/admin/libraries/items/res-test', {
        method: 'DELETE',
      });
      const resDel = await DELETE(unauthDel, dummyParams);
      assert.strictEqual(resDel.status, 401, 'DELETE item não autenticado deve retornar 401');
    } finally {
      (process.env as any).NODE_ENV = prevEnv;
    }
  });

  test('17. Bloqueio de Open Email Relay: Envio de e-mail customizado exige auth de administrador', async () => {
    const prevEnv = process.env.NODE_ENV;
    (process.env as any).NODE_ENV = 'production';
    try {
      const customEmailReq = new Request('http://localhost:3000/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: 'victim@example.com',
          subject: 'Phishing Attempt',
          html: '<script>alert(1)</script>',
        }),
      });

      const res = await postSendEmail(customEmailReq);
      assert.strictEqual(res.status, 401, 'E-mail customizado não autenticado deve ser rejeitado com 401');
    } finally {
      (process.env as any).NODE_ENV = prevEnv;
    }
  });

  test('18. Proteção contra Open Redirect e Validação de Recursos no Download', async () => {
    // 1. Tentar baixar recurso inexistente -> 404
    const reqNotFound = new NextRequest('http://localhost:3000/api/library/download?id=recurso-inexistente-12345');
    const resNotFound = await getDownload(reqNotFound);
    assert.strictEqual(resNotFound.status, 404, 'Recurso inexistente deve retornar 404');

    // 2. Tentar download sem parâmetro id -> 400
    const reqNoId = new NextRequest('http://localhost:3000/api/library/download');
    const resNoId = await getDownload(reqNoId);
    assert.strictEqual(resNoId.status, 400, 'Requisição sem ID deve retornar 400');
  });

});
