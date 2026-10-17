import { test, describe, after } from 'node:test';
import assert from 'node:assert/strict';
import { like } from 'drizzle-orm';
import { db } from '../../src/lib/db';
import { members } from '../../src/lib/db/schema';
import { POST as registerRoute } from '../../src/app/api/auth/register/route';
import { POST as loginRoute } from '../../src/app/api/auth/login/route';
import { GET as meRoute, DELETE as logoutRoute } from '../../src/app/api/auth/me/route';
import { signToken, verifyToken } from '../../src/lib/auth/jwt';
import { hashPassword, verifyPassword } from '../../src/lib/auth/auth';

describe('Suite de Testes de Autenticação & Membros Soberanos', () => {
  after(async () => {
    try {
      await db.delete(members).where(like(members.email, '%@soberano.com'));
    } catch (e) {
      console.warn('Erro ao limpar dados de teste de membros:', e);
    }
  });

  describe('Criptografia e JWT', () => {
    test('hashPassword e verifyPassword devem proteger senhas com bcrypt', async () => {
      const password = 'MinhaSenhaUltraSegura2026!';
      const hash = await hashPassword(password);

      assert.notEqual(hash, password);
      assert.ok(hash.startsWith('$2'));

      const isMatch = await verifyPassword(password, hash);
      assert.equal(isMatch, true);

      const isWrongMatch = await verifyPassword('SenhaErrada123', hash);
      assert.equal(isWrongMatch, false);
    });

    test('signToken e verifyToken devem emitir e validar payload com jose HS256', async () => {
      const payload = {
        userId: '11111111-2222-3333-4444-555555555555',
        email: 'aluno@mateuscelestinopro.com',
        name: 'Aluno Vip',
        role: 'member' as const,
        tier: 'vip' as const,
      };

      const token = await signToken(payload);
      assert.ok(typeof token === 'string' && token.split('.').length === 3);

      const decoded = await verifyToken(token);
      assert.ok(decoded);
      assert.equal(decoded?.userId, payload.userId);
      assert.equal(decoded?.email, payload.email);
      assert.equal(decoded?.tier, 'vip');
    });

    test('verifyToken deve rejeitar tokens corrompidos ou adulterados', async () => {
      const invalidToken = 'eyJhbGciOiJIUzI1NiJ9.invalid.payload';
      const result = await verifyToken(invalidToken);
      assert.equal(result, null);
    });
  });

  describe('Endpoint /api/auth/register', () => {
    test('deve rejeitar cadastro com nome vazio ou com menos de 2 caracteres', async () => {
      const req = new Request('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'A', email: 'teste@email.com', password: '12345678password' }),
      });

      const res = await registerRoute(req);
      assert.equal(res.status, 400);

      const data = await res.json();
      assert.equal(data.success, false);
      assert.match(data.error, /nome completo deve ter ao menos 2 caracteres/i);
    });

    test('deve rejeitar cadastro com formato de e-mail inválido', async () => {
      const req = new Request('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Nome Valido', email: 'email_invalido_sem_arroba', password: 'senhaValida123' }),
      });

      const res = await registerRoute(req);
      assert.equal(res.status, 400);

      const data = await res.json();
      assert.equal(data.success, false);
      assert.match(data.error, /endereço de e-mail válido/i);
    });

    test('deve rejeitar senha com menos de 6 caracteres', async () => {
      const req = new Request('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Nome Valido', email: 'membro@teste.com', password: '123' }),
      });

      const res = await registerRoute(req);
      assert.equal(res.status, 400);

      const data = await res.json();
      assert.equal(data.success, false);
      assert.match(data.error, /no mínimo 6 caracteres/i);
    });

    test('deve registrar novo membro válido com status 201 e emitir token', async () => {
      const uniqueEmail = `membro_${Date.now()}@soberano.com`;
      const req = new Request('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Novo Membro da Comunidade',
          email: uniqueEmail,
          password: 'SenhaForteSoberana2026!',
        }),
      });

      const res = await registerRoute(req);
      assert.equal(res.status, 201);

      const data = await res.json();
      assert.equal(data.success, true);
      assert.equal(data.member.email, uniqueEmail);
      assert.equal(data.member.tier, 'free');
      assert.equal(data.member.status, 'active');
      assert.ok(data.token);
    });
  });

  describe('Endpoint /api/auth/login', () => {
    test('deve autenticar membro demo com sucesso (HTTP 200)', async () => {
      const req = new Request('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'membro@mateuscelestinopro.com',
          password: 'MembroProX@2026!',
        }),
      });

      const res = await loginRoute(req);
      assert.equal(res.status, 200);

      const data = await res.json();
      assert.equal(data.success, true);
      assert.equal(data.member.email, 'membro@mateuscelestinopro.com');
      assert.equal(data.member.tier, 'vip');
      assert.ok(data.token);
    });

    test('deve rejeitar login com senha incorreta (HTTP 401)', async () => {
      const req = new Request('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'membro@mateuscelestinopro.com',
          password: 'SenhaTotalmenteIncorreta',
        }),
      });

      const res = await loginRoute(req);
      assert.equal(res.status, 401);

      const data = await res.json();
      assert.equal(data.success, false);
      assert.match(data.error, /credenciais/i);
    });

    test('deve rejeitar requisição sem e-mail ou senha (HTTP 400)', async () => {
      const req = new Request('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });

      const res = await loginRoute(req);
      assert.equal(res.status, 400);
    });
  });

  describe('Endpoint /api/auth/me', () => {
    test('deve retornar 401 caso não haja token ou sessão', async () => {
      const req = new Request('http://localhost:3000/api/auth/me', {
        method: 'GET',
      });

      const res = await meRoute(req);
      assert.equal(res.status, 401);

      const data = await res.json();
      assert.equal(data.authenticated, false);
    });

    test('deve validar token via header Authorization: Bearer', async () => {
      const payload = {
        userId: '99999999-8888-7777-6666-555555555555',
        email: 'bearer@mateuspro.com',
        name: 'Membro Bearer',
        role: 'member' as const,
        tier: 'vip' as const,
      };
      const token = await signToken(payload);

      const req = new Request('http://localhost:3000/api/auth/me', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const res = await meRoute(req);
      assert.equal(res.status, 200);

      const data = await res.json();
      assert.equal(data.authenticated, true);
      assert.equal(data.member.email, 'bearer@mateuspro.com');
      assert.equal(data.member.tier, 'vip');
    });

    test('DELETE /api/auth/me deve processar encerramento de sessão', async () => {
      const res = await logoutRoute();
      assert.equal(res.status, 200);

      const data = await res.json();
      assert.equal(data.success, true);
      assert.match(data.message, /encerrada com sucesso/i);
    });
  });
});
