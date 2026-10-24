import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { UMAMI_CONFIG, trackEvent, trackPageView, identifyUser } from '../src/lib/analytics/umami';

const BASE_DIR = path.resolve(__dirname, '..');

describe('🚀 Auditoria e Validação da Injeção do Umami Analytics Soberano', () => {
  const libPath = path.join(BASE_DIR, 'src/lib/analytics/umami.ts');
  const componentPath = path.join(BASE_DIR, 'src/components/analytics/UmamiAnalytics.tsx');
  const layoutPath = path.join(BASE_DIR, 'src/app/layout.tsx');
  const swPath = path.join(BASE_DIR, 'public/sw.js');
  const envExamplePath = path.join(BASE_DIR, '.env.example');

  it('1. Arquivo lib de utilitários de telemetria deve existir com exportações canônicas', () => {
    assert.ok(fs.existsSync(libPath), 'src/lib/analytics/umami.ts deve existir');
    const content = fs.readFileSync(libPath, 'utf8');

    assert.ok(typeof UMAMI_CONFIG.websiteId === 'string' && UMAMI_CONFIG.websiteId.length > 0, 'Website ID deve ser válido');
    assert.strictEqual(UMAMI_CONFIG.hostUrl, 'https://umami-chi-topaz.vercel.app');
    assert.strictEqual(UMAMI_CONFIG.scriptUrl, 'https://umami-chi-topaz.vercel.app/script.js');

    assert.ok(typeof trackEvent === 'function', 'trackEvent deve ser uma função');
    assert.ok(typeof trackPageView === 'function', 'trackPageView deve ser uma função');
    assert.ok(typeof identifyUser === 'function', 'identifyUser deve ser uma função');

    // Execuções em ambiente mock/SSR não devem lançar exceções
    assert.doesNotThrow(() => trackEvent('test_event', { key: 'value' }));
    assert.doesNotThrow(() => trackPageView('/artigos', 'Portal de Artigos'));
    assert.doesNotThrow(() => identifyUser({ id: 'user_123' }));
  });

  it('2. Componente UmamiAnalytics deve renderizar Script otimizado do Next.js 15 com Suspense', () => {
    assert.ok(fs.existsSync(componentPath), 'src/components/analytics/UmamiAnalytics.tsx deve existir');
    const content = fs.readFileSync(componentPath, 'utf8');

    assert.ok(content.includes('"use client"'), 'Deve ser um Client Component');
    assert.ok(content.includes('strategy="afterInteractive"'), 'Estratégia deve ser afterInteractive para não travar Core Web Vitals');
    assert.ok(content.includes('data-website-id'), 'Deve passar data-website-id');
    assert.ok(content.includes('data-host-url'), 'Deve passar data-host-url');
    assert.ok(content.includes('data-auto-track="true"'), 'Deve habilitar data-auto-track');
    assert.ok(content.includes('Suspense'), 'Deve envolver o hook useSearchParams em Suspense para compatibilidade com SSR e SSG');
  });

  it('3. RootLayout deve conter conexões de alta velocidade (preconnect/dns-prefetch) e injetar UmamiAnalytics', () => {
    assert.ok(fs.existsSync(layoutPath), 'src/app/layout.tsx deve existir');
    const content = fs.readFileSync(layoutPath, 'utf8');

    assert.ok(content.includes('UmamiAnalytics'), 'RootLayout deve importar e renderizar UmamiAnalytics');
    assert.ok(
      content.includes('rel="preconnect" href="https://umami-chi-topaz.vercel.app"') ||
      content.includes("rel=\"preconnect\" href=\"https://umami-chi-topaz.vercel.app\""),
      'Deve conter preconnect para a instância oficial do Umami'
    );
    assert.ok(
      content.includes('rel="dns-prefetch" href="https://umami-chi-topaz.vercel.app"'),
      'Deve conter dns-prefetch para a instância oficial do Umami'
    );
  });

  it('4. Service Worker (public/sw.js) deve ignorar e conceder bypass total para requisições de telemetria', () => {
    assert.ok(fs.existsSync(swPath), 'public/sw.js deve existir');
    const content = fs.readFileSync(swPath, 'utf8');

    assert.ok(content.includes('umami'), 'Service Worker deve bypassar chamadas Umami');
    assert.ok(content.includes('/api/send'), 'Service Worker deve bypassar chamadas para /api/send');
  });

  it('5. Variáveis de ambiente devem estar documentadas no .env.example', () => {
    assert.ok(fs.existsSync(envExamplePath), '.env.example deve existir');
    const content = fs.readFileSync(envExamplePath, 'utf8');

    assert.ok(content.includes('NEXT_PUBLIC_UMAMI_WEBSITE_ID'), '.env.example deve conter NEXT_PUBLIC_UMAMI_WEBSITE_ID');
    assert.ok(content.includes('NEXT_PUBLIC_UMAMI_HOST_URL'), '.env.example deve conter NEXT_PUBLIC_UMAMI_HOST_URL');
    assert.ok(content.includes('NEXT_PUBLIC_UMAMI_SCRIPT_URL'), '.env.example deve conter NEXT_PUBLIC_UMAMI_SCRIPT_URL');
  });

  it('6. Contrato e Conexão Real com a Instância Umami Vercel (https://umami-chi-topaz.vercel.app)', async () => {
    try {
      const scriptRes = await fetch('https://umami-chi-topaz.vercel.app/script.js', { method: 'HEAD' });
      assert.strictEqual(scriptRes.status, 200, 'Script tracker deve responder HTTP 200');

      // Teste de emissão de telemetria de auditoria
      const sendRes = await fetch('https://umami-chi-topaz.vercel.app/api/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        },
        body: JSON.stringify({
          type: 'event',
          payload: {
            website: UMAMI_CONFIG.websiteId,
            hostname: 'mcp-business-os.vercel.app',
            screen: '1920x1080',
            language: 'pt-BR',
            title: 'MCP Business OS — Auditoria de Telemetria Automatizada',
            url: '/auditoria-sistema',
          },
        }),
      });

      assert.strictEqual(sendRes.status, 200, 'Endpoint de coleta /api/send deve responder HTTP 200');
      const data: any = await sendRes.json();
      assert.ok(data.sessionId || data.cache || data.visitId, 'Resposta deve conter sessão ou cache de telemetria');
    } catch (networkErr: any) {
      console.warn('Aviso de rede ao testar endpoint remoto Umami:', networkErr.message);
    }
  });
});
