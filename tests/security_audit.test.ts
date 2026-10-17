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

});
