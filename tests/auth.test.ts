import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { hashPassword, verifyPassword, authenticateAdmin, authenticateMember } from '../src/lib/auth/auth';
import { signToken, verifyToken, type SessionPayload } from '../src/lib/auth/jwt';

describe('Auth & Security Module Tests (bcryptjs + jose JWT)', () => {
  describe('Password Hashing & Verification (bcryptjs)', () => {
    test('Deve gerar hash seguro e verificar senha com sucesso', async () => {
      const password = 'SuperSecretPassword@2026!';
      const hash = await hashPassword(password);

      assert.ok(hash, 'Hash gerado deve existir');
      assert.notStrictEqual(hash, password, 'Hash não pode ser igual à senha plana');
      assert.ok(hash.startsWith('$2'), 'Hash deve seguir formato bcrypt padrão');

      const isValid = await verifyPassword(password, hash);
      assert.strictEqual(isValid, true, 'Senha correta deve retornar true');

      const isInvalid = await verifyPassword('WrongPassword', hash);
      assert.strictEqual(isInvalid, false, 'Senha incorreta deve retornar false');
    });

    test('Deve rejeitar strings vazias ou nulas graciosamente', async () => {
      const isValidNull = await verifyPassword('', '');
      assert.strictEqual(isValidNull, false, 'String vazia deve retornar false');
    });
  });

  describe('JWT Generation & Verification (jose)', () => {
    test('Deve gerar token válido e recuperar payload idêntico', async () => {
      const payload: SessionPayload = {
        userId: '11111111-2222-3333-4444-555555555555',
        email: 'mateus@mateuscelestinopro.com',
        name: 'Mateus Celestino',
        role: 'admin',
      };

      const token = await signToken(payload, '1h');
      assert.ok(token, 'Token JWT deve ser gerado');
      assert.strictEqual(typeof token, 'string', 'Token deve ser uma string');
      assert.strictEqual(token.split('.').length, 3, 'JWT deve conter 3 partes separadas por ponto');

      const decoded = await verifyToken(token);
      assert.ok(decoded, 'Token deve ser verificado com sucesso');
      assert.strictEqual(decoded.userId, payload.userId, 'userId deve coincidir');
      assert.strictEqual(decoded.email, payload.email, 'email deve coincidir');
      assert.strictEqual(decoded.role, payload.role, 'role deve coincidir');
    });

    test('Deve retornar null ao validar token corrompido ou adulterado', async () => {
      const invalidToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.invalidpayload.invalidsignature';
      const result = await verifyToken(invalidToken);
      assert.strictEqual(result, null, 'Token adulterado deve retornar null');
    });
  });

  describe('Authentication Flow & Fallbacks', () => {
    test('authenticateAdmin deve autenticar com credenciais corretas', async () => {
      const adminEmail = process.env.ADMIN_EMAIL || 'mcp6667@proton.me';
      const adminPass = process.env.ADMIN_PASSWORD || 'McpProX#2026_Sovereign@Admin!7Kz9Pq';
      const result = await authenticateAdmin(adminEmail, adminPass);

      assert.strictEqual(result.success, true, 'Deve autenticar com credenciais válidas');
      assert.ok(result.token, 'Deve retornar token de sessão');
      assert.ok(result.user, 'Deve retornar dados do usuário');
      assert.strictEqual(result.user?.role, 'admin');
    });

    test('authenticateAdmin deve rejeitar credenciais inválidas', async () => {
      const adminEmail = process.env.ADMIN_EMAIL || 'mcp6667@proton.me';
      const result = await authenticateAdmin(
        adminEmail,
        'SenhaIncorreta@999'
      );

      assert.strictEqual(result.success, false, 'Deve falhar com senha incorreta');
      assert.ok(result.error, 'Deve retornar mensagem de erro');
    });

    test('authenticateMember deve autenticar membro demonstrativo com sucesso', async () => {
      const result = await authenticateMember(
        'membro@mateuscelestinopro.com',
        'MembroProX@2026!'
      );

      assert.strictEqual(result.success, true, 'Membro deve ser autenticado com sucesso');
      assert.ok(result.token, 'Deve retornar token de membro');
      assert.strictEqual(result.member?.tier, 'vip');
    });

    test('authenticateMember deve rejeitar membro com senha inválida', async () => {
      const result = await authenticateMember(
        'membro@mateuscelestinopro.com',
        'SenhaErrada'
      );

      assert.strictEqual(result.success, false, 'Deve falhar autenticação de membro com senha errada');
    });
  });
});
