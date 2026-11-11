import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  sanitizeDangerousHtml,
  sanitizeEmbedUrl,
  sanitizeSafeUrl,
  escapeHtml,
  safeContentDispositionFilename,
  stripCrlf,
} from '../src/lib/security/sanitize';
import { assertSafeExternalUrl, isTrustedOrigin, getTrustedSiteUrl } from '../src/lib/security/url-guard';
import { signToken, verifyToken } from '../src/lib/auth/jwt';
import { revokeToken, isTokenRevoked } from '../src/lib/auth/token-revocation';
import { extractUserRoleAndTier } from '../src/lib/auth/auth';
import { verifyMercadoPagoWebhookSignature, hasProcessedPayment, markPaymentProcessed } from '../src/lib/payments/mp-webhook';
import { NextRequest } from 'next/server';
import crypto from 'node:crypto';

describe('🛡️ Google Mantis Security Hardening — Comprehensive Verification Suite', () => {

  describe('1. Multi-Pass Fixed-Point Sanitization & XSS Neutralization', () => {
    test('Variant 1: Nested and recursive HTML tags are completely eliminated', () => {
      const nestedPayloads = [
        '<<<script>script>alert(1)<</script>/script>',
        '<scr<script>ipt>alert(2)</script>',
        '<<iframe src=javascript:alert(3)>iframe>',
        '<s<style>tyle>body{background:red}</s<style>tyle>',
      ];

      for (const payload of nestedPayloads) {
        const sanitized = sanitizeDangerousHtml(payload);
        assert.doesNotMatch(sanitized, /<script/i, `Nested payload must not contain <script: ${payload}`);
        assert.doesNotMatch(sanitized, /<iframe/i, `Nested payload must not contain <iframe: ${payload}`);
        assert.doesNotMatch(sanitized, /<style/i, `Nested payload must not contain <style: ${payload}`);
      }
    });

    test('Variant 2: Event handlers, inline execution, and SVG/MathML vectors stripped', () => {
      const eventPayloads = [
        '<img src=x onerror=alert(1)>',
        '<svg onload="alert(document.domain)">',
        '<math><mtext><table><mglyph><style><!--</style><img src=x onerror=alert(1)>',
        '<div onfocus="fetch(\'/steal\')" tabindex="1">click</div>',
        '<input type="button" onclick="alert(1)" value="Attack">',
      ];

      for (const payload of eventPayloads) {
        const sanitized = sanitizeDangerousHtml(payload);
        assert.doesNotMatch(sanitized, /on\w+\s*=/i, `Sanitized string must not have event handlers: ${payload}`);
        assert.doesNotMatch(sanitized, /<svg/i, `Sanitized string must not have <svg: ${payload}`);
        assert.doesNotMatch(sanitized, /<math/i, `Sanitized string must not have <math: ${payload}`);
        assert.doesNotMatch(sanitized, /<input/i, `Sanitized string must not have <input: ${payload}`);
      }
    });

    test('Variant 3: Protocol-based XSS (javascript, vbscript, data) neutralizado', () => {
      const protocolPayloads = [
        '<a href="javascript:alert(1)">click me</a>',
        '<a href="vbscript:msgbox(1)">click me</a>',
        '<a href="data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==">click</a>',
        '<a href=" java\\x09script:alert(1)">obfuscated</a>',
      ];

      for (const payload of protocolPayloads) {
        const sanitized = sanitizeDangerousHtml(payload);
        assert.doesNotMatch(sanitized, /href\s*=\s*["']?\s*(javascript|vbscript|data):/i, `Must strip dangerous href: ${payload}`);
      }
    });

    test('Variant 4: Embed URL sanitizer only permits validated YouTube/Vimeo embeds', () => {
      assert.strictEqual(sanitizeEmbedUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ'), 'https://www.youtube.com/embed/dQw4w9WgXcQ');
      assert.strictEqual(sanitizeEmbedUrl('https://youtu.be/dQw4w9WgXcQ'), 'https://www.youtube.com/embed/dQw4w9WgXcQ');
      assert.strictEqual(sanitizeEmbedUrl('https://vimeo.com/123456789'), 'https://player.vimeo.com/video/123456789');
      
      // Ataques e URLs não permitidas devem retornar null
      assert.strictEqual(sanitizeEmbedUrl('javascript:alert(1)'), null);
      assert.strictEqual(sanitizeEmbedUrl('https://evil-hacker.com/malicious.mp4'), null);
      assert.strictEqual(sanitizeEmbedUrl('data:text/html,<script>alert(1)</script>'), null);
    });
  });

  describe('2. Anti-SSRF URL Guard & RFC1918 / Cloud Metadata Protection', () => {
    test('Variant 1: Private IPv4 (RFC1918) e CGNAT ranges bloqueados', async () => {
      const privateIps = [
        'https://10.0.0.1/admin',
        'https://10.254.1.1/secret',
        'https://172.16.0.1/status',
        'https://172.31.255.255/internal',
        'https://192.168.1.1/router',
        'https://100.64.0.1/cgnat',
      ];

      for (const url of privateIps) {
        await assert.rejects(
          async () => await assertSafeExternalUrl(url),
          /(Acesso a faixa de IP privada ou reservada bloqueado|Destino de rede interna ou restrita bloqueado)/i,
          `Deve bloquear IP privado: ${url}`
        );
      }
    });

    test('Variant 2: AWS / GCP / Azure Instance Metadata (169.254.169.254) bloqueado', async () => {
      const metadataUrls = [
        'https://169.254.169.254/latest/meta-data/',
        'https://169.254.169.254/computeMetadata/v1/',
        'https://instance-data/latest/meta-data/',
      ];

      for (const url of metadataUrls) {
        await assert.rejects(
          async () => await assertSafeExternalUrl(url),
          /(Acesso a faixa de IP privada ou reservada bloqueado|Destino de rede interna ou restrita bloqueado)/i,
          `Deve bloquear metadata URL: ${url}`
        );
      }
    });

    test('Variant 3: Loopback (127.0.0.1, localhost, ::1, 0.0.0.0) bloqueado', async () => {
      const loopbacks = [
        'https://127.0.0.1:8080/actuator',
        'https://localhost:3000/api/admin',
        'https://0.0.0.0:5432/',
      ];

      for (const url of loopbacks) {
        await assert.rejects(
          async () => await assertSafeExternalUrl(url),
          /(Acesso a faixa de IP privada ou reservada bloqueado|Destino de rede interna ou restrita bloqueado)/i,
          `Deve bloquear loopback: ${url}`
        );
      }
    });

    test('Variant 4: Protocolos não HTTP/HTTPS estritamente rejeitados', async () => {
      const badProtocols = [
        'file:///etc/passwd',
        'gopher://127.0.0.1:6379/_flushall',
        'ftp://192.168.1.5/backup',
        'dict://127.0.0.1:11211/stats',
      ];

      for (const url of badProtocols) {
        await assert.rejects(
          async () => await assertSafeExternalUrl(url),
          /Protocolo não permitido/i,
          `Deve rejeitar protocolo perigoso: ${url}`
        );
      }
    });
  });

  describe('3. Origin Validation & Host Header Poisoning Defense', () => {
    test('Variant 1: isTrustedOrigin aceita somente origens autorizadas', () => {
      assert.strictEqual(isTrustedOrigin('https://mcp-business-os.vercel.app'), true);
      assert.strictEqual(isTrustedOrigin('https://mateuscelestinopro.com'), true);
      assert.strictEqual(isTrustedOrigin('https://evil-attacker.com'), false);
      assert.strictEqual(isTrustedOrigin('https://mcp-business-os.vercel.app.attacker.com'), false);
      assert.strictEqual(isTrustedOrigin('null'), false);
    });

    test('Variant 2: Host header spoofing em produção não envenena getTrustedSiteUrl', () => {
      const prevEnv = process.env.NODE_ENV;
      const prevSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;
      try {
        (process.env as any).NODE_ENV = 'production';
        process.env.NEXT_PUBLIC_SITE_URL = 'https://mateuscelestinopro.com.br';

        const spoofedRequest = new Request('http://localhost:3000/api/checkout', {
          headers: {
            'host': 'attacker-controlled.com',
            'x-forwarded-host': 'malicious-proxy.org',
          },
        });

        const trustedUrl = getTrustedSiteUrl(spoofedRequest);
        assert.strictEqual(trustedUrl, 'https://mateuscelestinopro.com.br', 'Em produção, Host header forjado deve ser ignorado');
      } finally {
        (process.env as any).NODE_ENV = prevEnv;
        process.env.NEXT_PUBLIC_SITE_URL = prevSiteUrl;
      }
    });
  });

  describe('4. Edge JWT Security & Token Revocation', () => {
    test('Variant 1: Tokens com algoritmo não HS256 são rejeitados', async () => {
      const validToken = await signToken({ userId: 'u-1', email: 'user@test.com', name: 'User 1', role: 'member' });
      assert.ok(validToken);

      const verified = await verifyToken(validToken);
      assert.strictEqual(verified?.userId, 'u-1');

      // Tenta forjar payload com "none" algorithm
      const parts = validToken.split('.');
      const fakeHeader = Buffer.from(JSON.stringify({ alg: 'none', typ: 'JWT' })).toString('base64url');
      const noneToken = `${fakeHeader}.${parts[1]}.`;
      const noneResult = await verifyToken(noneToken);
      assert.strictEqual(noneResult, null, 'Tokens alg: none devem ser rejeitados');
    });

    test('Variant 2: Token revogado via revokeToken() é rejeitado imediatamente por verifyToken()', async () => {
      const token = await signToken({ userId: 'u-revoked', email: 'revoked@test.com', name: 'User Revoked', role: 'member' });
      const payloadBefore = await verifyToken(token);
      assert.ok(payloadBefore);
      assert.ok(payloadBefore.jti);

      // Revoga o token
      revokeToken({ jti: payloadBefore.jti });
      assert.strictEqual(await isTokenRevoked({ jti: payloadBefore.jti }), true);

      // verifyToken deve retornar null
      const payloadAfter = await verifyToken(token);
      assert.strictEqual(payloadAfter, null, 'Token revogado deve retornar null');
    });
  });

  describe('5. Supabase app_metadata Privilege Isolation', () => {
    test('Variant 1: Atacante injeta role: admin em user_metadata -> sistema ignora e mantém member', () => {
      const maliciousUser = {
        id: 'attacker-123',
        email: 'attacker@evil.com',
        user_metadata: {
          role: 'admin',
          tier: 'vip',
        },
        app_metadata: {},
      };

      const extracted = extractUserRoleAndTier(maliciousUser);
      assert.strictEqual(extracted.role, 'member', 'Role em user_metadata deve ser completamente ignorado');
      assert.strictEqual(extracted.tier, 'free', 'Tier em user_metadata deve ser completamente ignorado');
    });

    test('Variant 2: Apenas app_metadata assinado pelo backend confere privilégios', () => {
      const legitimateAdmin = {
        id: 'admin-sole',
        email: 'admin@mateuscelestinopro.com.br',
        user_metadata: {
          role: 'member', // user_metadata falso ou padrão
        },
        app_metadata: {
          role: 'admin',
          tier: 'vip',
        },
      };

      const extracted = extractUserRoleAndTier(legitimateAdmin);
      assert.strictEqual(extracted.role, 'admin');
      assert.strictEqual(extracted.tier, 'vip');
    });
  });

  describe('6. Mercado Pago Webhook Verification & Anti-Replay', () => {
    const secret = 'test-secret-key-1234567890';

    test('Variant 1: Assinatura HMAC válida é aceita e inválida é rejeitada com 403', () => {
      const timestamp = Math.floor(Date.now() / 1000);
      const dataId = '12345678';
      const manifest = `id:${dataId};request-id:req-123;ts:${timestamp};`;
      const hash = crypto.createHmac('sha256', secret).update(manifest).digest('hex');
      const validHeader = `ts=${timestamp},v1=${hash}`;

      const resValid = verifyMercadoPagoWebhookSignature({
        xSignature: validHeader,
        xRequestId: 'req-123',
        dataId,
        webhookSecret: secret,
      });
      assert.strictEqual(resValid.valid, true, 'Assinatura válida deve retornar valid: true');

      // Assinatura adulterada
      const resInvalid = verifyMercadoPagoWebhookSignature({
        xSignature: `ts=${timestamp},v1=badhash123456`,
        xRequestId: 'req-123',
        dataId,
        webhookSecret: secret,
      });
      assert.strictEqual(resInvalid.valid, false, 'Assinatura forjada deve retornar valid: false');
    });

    test('Variant 2: Timestamp além da janela de 300 segundos é rejeitado (anti-replay)', () => {
      const oldTimestamp = Math.floor(Date.now() / 1000) - 400; // 400s atrás
      const dataId = '12345678';
      const manifest = `id:${dataId};request-id:req-123;ts:${oldTimestamp};`;
      const hash = crypto.createHmac('sha256', secret).update(manifest).digest('hex');
      const expiredHeader = `ts=${oldTimestamp},v1=${hash}`;

      const resExpired = verifyMercadoPagoWebhookSignature({
        xSignature: expiredHeader,
        xRequestId: 'req-123',
        dataId,
        webhookSecret: secret,
      });
      assert.strictEqual(resExpired.valid, false, 'Assinatura expirada (> 300s) deve falhar com valid: false');
    });

    test('Variant 3: Idempotência de pagamentos impede reprocessamento duplicado', () => {
      const paymentId = 'pay-unique-' + Date.now();
      assert.strictEqual(hasProcessedPayment(paymentId), false);
      markPaymentProcessed(paymentId);
      assert.strictEqual(hasProcessedPayment(paymentId), true);
    });
  });

  describe('7. Path Traversal & Safe Filename Sanitization', () => {
    test('Variant 1: Directory traversal e sequências ../ removidos de filenames', () => {
      assert.strictEqual(safeContentDispositionFilename('../../../../etc/passwd'), 'etc_passwd');
      assert.strictEqual(safeContentDispositionFilename('..\\..\\windows\\system32\\cmd.exe'), 'windows_system32_cmd.exe');
      assert.strictEqual(safeContentDispositionFilename('normal-file.pdf'), 'normal-file.pdf');
    });

    test('Variant 2: Quebras de linha e injeção de cabeçalhos HTTP CRLF eliminados', () => {
      const maliciousName = 'file\r\nContent-Type: text/html\r\n\r\n<script>alert(1)</script>';
      const sanitized = safeContentDispositionFilename(maliciousName);
      assert.doesNotMatch(sanitized, /[\r\n]/, 'Filename não pode conter CRLF');
      assert.doesNotMatch(sanitized, /[<>]/, 'Filename não pode conter tags HTML');
    });

    test('Variant 3: stripCrlf elimina CRLF de inputs de email e cabeçalhos', () => {
      assert.strictEqual(stripCrlf('admin@site.com\r\nBcc: victim@target.com'), 'admin@site.com Bcc: victim@target.com');
      assert.strictEqual(stripCrlf('Assunto Seguro'), 'Assunto Seguro');
    });
  });

});
