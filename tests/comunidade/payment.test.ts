import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { POST as checkoutRoute } from '../../src/app/api/payment/checkout/route';
import { POST as webhookPostRoute, GET as webhookGetRoute } from '../../src/app/api/payment/webhook/route';
import { COMMUNITY_PLANS } from '../../src/lib/plans';

describe('Suite de Testes de Pagamento & Mercado Pago da Comunidade', () => {
  describe('Configuração dos Planos da Comunidade', () => {
    test('deve conter todos os 5 planos oficiais de produtos e memberships', () => {
      const expectedSlugs = [
        'ai-art',
        'ai-portraits-pro',
        'ai-effects-pro',
        'membership-vip',
        'membership-anual',
      ];

      for (const slug of expectedSlugs) {
        assert.ok(COMMUNITY_PLANS[slug], `O plano ${slug} deve estar configurado`);
        assert.ok(COMMUNITY_PLANS[slug].price > 0, `O preço de ${slug} deve ser positivo`);
        assert.ok(
          ['pro', 'vip'].includes(COMMUNITY_PLANS[slug].tier),
          `O tier de ${slug} deve ser 'pro' ou 'vip'`
        );
        assert.ok(COMMUNITY_PLANS[slug].title.length > 3, `O título de ${slug} deve ser descritivo`);
      }
    });
  });

  describe('Endpoint /api/payment/checkout', () => {
    test('deve rejeitar checkout com plano inexistente (HTTP 400)', async () => {
      const req = new Request('http://localhost:3000/api/payment/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planSlug: 'plano-inexistente-xyz',
          memberEmail: 'teste@email.com',
        }),
      });

      const res = await checkoutRoute(req);
      assert.equal(res.status, 400);

      const data = await res.json();
      assert.equal(data.success, false);
      assert.match(data.error, /plano inválido/i);
    });

    test('deve rejeitar requisição sem parâmetros (HTTP 400)', async () => {
      const req = new Request('http://localhost:3000/api/payment/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });

      const res = await checkoutRoute(req);
      assert.equal(res.status, 400);
    });

    test('deve gerar preferência de checkout com sucesso no modo sandbox resiliente (HTTP 200)', async () => {
      const req = new Request('http://localhost:3000/api/payment/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planSlug: 'membership-vip',
          memberEmail: 'mateus@vip.com',
          memberName: 'Mateus Vip',
        }),
      });

      const res = await checkoutRoute(req);
      assert.equal(res.status, 200);

      const data = await res.json();
      assert.equal(data.success, true);
      assert.ok(data.id, 'Deve conter ID da preferência gerada');
      assert.ok(data.init_point, 'Deve conter link de redirecionamento init_point');
      assert.match(data.init_point, /comunidade\?payment=success/);
    });

    test('deve suportar todos os planos de produtos visuais', async () => {
      for (const slug of ['ai-art', 'ai-portraits-pro', 'ai-effects-pro', 'membership-anual']) {
        const req = new Request('http://localhost:3000/api/payment/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            planSlug: slug,
            memberEmail: 'comprador@soberano.com',
          }),
        });

        const res = await checkoutRoute(req);
        assert.equal(res.status, 200);

        const data = await res.json();
        assert.equal(data.success, true);
        assert.ok(data.id);
      }
    });
  });

  describe('Endpoint /api/payment/webhook', () => {
    test('GET deve retornar status online e metadados de saúde do webhook', async () => {
      const req = new Request('http://localhost:3000/api/payment/webhook', {
        method: 'GET',
      });

      const res = await webhookGetRoute(req);
      assert.equal(res.status, 200);

      const data = await res.json();
      assert.equal(data.status, 'online');
      assert.match(data.service, /mercado pago/i);
    });

    test('POST deve receber notificação de pagamento e processar aprovação', async () => {
      const req = new Request('http://localhost:3000/api/payment/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: 'TEST_PAYMENT_123456',
          status: 'approved',
          email: 'aluno.pago@mateuspro.com',
          planSlug: 'membership-vip',
        }),
      });

      const res = await webhookPostRoute(req);
      assert.equal(res.status, 200);

      const data = await res.json();
      assert.equal(data.received, true);
      assert.equal(data.status, 'approved');
      assert.equal(data.tier, 'vip');
    });

    test('POST deve processar via query params caso enviado pelo gateway do Mercado Pago', async () => {
      const req = new Request('http://localhost:3000/api/payment/webhook?id=MP_QUERY_987&plan=ai-art&email=query@teste.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const res = await webhookPostRoute(req);
      assert.equal(res.status, 200);

      const data = await res.json();
      assert.equal(data.received, true);
      assert.equal(data.tier, 'pro');
    });
  });
});
