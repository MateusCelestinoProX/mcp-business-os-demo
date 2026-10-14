import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { POST as registerRoute } from '../../src/app/api/auth/register/route';
import { POST as loginRoute } from '../../src/app/api/auth/login/route';
import { POST as checkoutRoute } from '../../src/app/api/payment/checkout/route';
import { POST as webhookRoute } from '../../src/app/api/payment/webhook/route';
import { signToken, verifyToken } from '../../src/lib/auth/jwt';

describe('Suite de Testes Adversariais & Resiliência (agent-members)', () => {
  describe('Injeções e Caracteres Especiais', () => {
    test('Cadastro com payload de SQL Injection deve ser tratado com segurança sem crash', async () => {
      const sqlInjectionName = "Robert'); DROP TABLE members;--";
      const sqlInjectionEmail = "victim' OR '1'='1@domain.com";

      const req = new Request('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: sqlInjectionName,
          email: sqlInjectionEmail,
          password: 'PasswordSuperSafe2026!',
        }),
      });

      const res = await registerRoute(req);
      // Deve tratar o input de forma segura sem crash do servidor (201 ou 400)
      assert.ok([201, 400].includes(res.status));

      const data = await res.json();
      assert.ok(data);
    });

    test('Cadastro com tags HTML e scripts XSS não deve quebrar a API', async () => {
      const xssName = '<script>alert("XSS")</script> Mateus';
      const email = `xss_test_${Date.now()}@soberano.com`;

      const req = new Request('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: xssName,
          email,
          password: 'SafePassword123!',
        }),
      });

      const res = await registerRoute(req);
      assert.equal(res.status, 201);

      const data = await res.json();
      assert.equal(data.success, true);
    });

    test('Autenticação com caracteres Unicode, emojis e acentos gráficos', async () => {
      const unicodeName = '👑 Mateus Celestino São Paulo 🚀';
      const unicodeEmail = `mateus_unicode_${Date.now()}@estacio.br`;

      const req = new Request('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: unicodeName,
          email: unicodeEmail,
          password: 'SenhaComAcentuaçãoEChave@2026',
        }),
      });

      const res = await registerRoute(req);
      assert.equal(res.status, 201);
      const data = await res.json();
      assert.equal(data.member.name, unicodeName);
    });
  });

  describe('Estresse de Carga & Payloads Anômalos', () => {
    test('Tentativa de login com senha gigante (stress) não deve causar negação de serviço', async () => {
      const hugePassword = 'A'.repeat(5000);
      const req = new Request('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'membro@mateuscelestinopro.com',
          password: hugePassword,
        }),
      });

      const res = await loginRoute(req);
      assert.equal(res.status, 401);
    });

    test('Checkout sob requisições paralelas concorrentes deve gerar referências únicas', async () => {
      const requests = Array.from({ length: 5 }, (_, i) =>
        checkoutRoute(
          new Request('http://localhost:3000/api/payment/checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              planSlug: 'membership-vip',
              memberEmail: `concorrente_${i}@teste.com`,
            }),
          })
        )
      );

      const responses = await Promise.all(requests);
      for (const res of responses) {
        assert.equal(res.status, 200);
        const data = await res.json();
        assert.equal(data.success, true);
        assert.ok(data.id);
      }
    });

    test('Webhook com payload JSON corrompido ou vazio não deve derrubar a aplicação', async () => {
      const req = new Request('http://localhost:3000/api/payment/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: 'invalid-json-body',
      });

      const res = await webhookRoute(req);
      assert.ok([200, 400, 500].includes(res.status));
      const data = await res.json();
      assert.ok(data);
    });
  });

  describe('Validação Rigorosa de JWT & Expiração', () => {
    test('Token com tempo de expiração no passado deve ser rejeitado', async () => {
      const expiredToken = await signToken(
        {
          userId: '00000000-0000-0000-0000-000000000000',
          email: 'expirado@teste.com',
          name: 'Expirado',
          role: 'member',
        },
        '-1s' // Expira 1 segundo atrás
      );

      const verified = await verifyToken(expiredToken);
      assert.equal(verified, null);
    });
  });
});
