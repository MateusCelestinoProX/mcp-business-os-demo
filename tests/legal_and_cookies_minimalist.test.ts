import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';

const BASE_DIR = path.resolve(__dirname, '..');

describe('⚖️ Auditoria e Validação de Termos de Uso, Privacidade e Cookies Minimalistas', () => {
  const privacidadePagePath = path.join(BASE_DIR, 'src/app/privacidade/page.tsx');
  const privacidadeLayoutPath = path.join(BASE_DIR, 'src/app/privacidade/layout.tsx');
  const termosPagePath = path.join(BASE_DIR, 'src/app/termos/page.tsx');
  const termosLayoutPath = path.join(BASE_DIR, 'src/app/termos/layout.tsx');
  const cookieBannerPath = path.join(BASE_DIR, 'src/components/cookies/CookieBanner.tsx');
  const cookiesLibPath = path.join(BASE_DIR, 'src/lib/cookies.ts');
  const footerPath = path.join(BASE_DIR, 'src/components/layout/Footer.tsx');
  const rootLayoutPath = path.join(BASE_DIR, 'src/app/layout.tsx');

  it('1. Política de Privacidade deve ser minimalista, sem termos sci-fi/gimmicks e em conformidade LGPD', () => {
    assert.ok(fs.existsSync(privacidadePagePath), 'src/app/privacidade/page.tsx deve existir');
    const content = fs.readFileSync(privacidadePagePath, 'utf8');

    // Palavras que NÃO devem constar na interface
    assert.ok(!content.includes('Privacidade Blindada'), 'NÃO deve conter "Privacidade Blindada"');
    assert.ok(!content.includes('v2.4.0-SOBERANA'), 'NÃO deve conter "v2.4.0-SOBERANA"');
    assert.ok(!content.includes('AES-256 + TLS 1.3'), 'NÃO deve conter badge sci-fi "AES-256 + TLS 1.3"');
    assert.ok(!content.includes('Shader:'), 'NÃO deve conter seletor de shaders');
    assert.ok(!content.includes('DOCUMENT_HASH'), 'NÃO deve conter fake hashes criptográficos');

    // Termos que DEVEM constar na interface
    assert.ok(content.includes('Política de Privacidade'), 'Deve conter "Política de Privacidade"');
    assert.ok(content.includes('Umami Analytics'), 'Deve explicar a telemetria anônima do Umami Analytics');
    assert.ok(content.includes('LGPD'), 'Deve citar a conformidade com a LGPD');
    assert.ok(content.includes('openCookiePreferences'), 'Deve disponibilizar ação para gerenciar preferências de cookies');
  });

  it('2. Termos de Uso deve ser minimalista, sem termos extravagantes e em conformidade com Marco Civil', () => {
    assert.ok(fs.existsSync(termosPagePath), 'src/app/termos/page.tsx deve existir');
    const content = fs.readFileSync(termosPagePath, 'utf8');

    // Palavras que NÃO devem constar na interface
    assert.ok(!content.includes('Termos de Uso Soberanos'), 'NÃO deve conter "Termos de Uso Soberanos"');
    assert.ok(!content.includes('v2.1.0-ENTERPRISE'), 'NÃO deve conter "v2.1.0-ENTERPRISE"');
    assert.ok(!content.includes('Shaders a 60 FPS'), 'NÃO deve conter cláusula espúria "Shaders a 60 FPS"');
    assert.ok(!content.includes('Shader:'), 'NÃO deve conter seletor de shaders');
    assert.ok(!content.includes('TERMS_HASH'), 'NÃO deve conter fake hashes criptográficos');

    // Termos que DEVEM constar na interface
    assert.ok(content.includes('Termos de Uso'), 'Deve conter "Termos de Uso"');
    assert.ok(content.includes('Propriedade Intelectual'), 'Deve conter seção de Propriedade Intelectual');
    assert.ok(content.includes('Marco Civil da Internet'), 'Deve citar Marco Civil da Internet');
  });

  it('3. Layouts de metadados SEO devem possuir títulos limpos e profissionais', () => {
    const privLayout = fs.readFileSync(privacidadeLayoutPath, 'utf8');
    const termosLayout = fs.readFileSync(termosLayoutPath, 'utf8');

    assert.ok(privLayout.includes('title: "Política de Privacidade"'), 'Metadados devem ter título limpo');
    assert.ok(!privLayout.includes('Privacidade Blindada'), 'Metadados não devem ter termos espúrios');

    assert.ok(termosLayout.includes('title: "Termos de Uso"'), 'Metadados devem ter título limpo');
    assert.ok(!termosLayout.includes('Termos de Uso Soberanos'), 'Metadados não devem ter termos espúrios');
  });

  it('4. Biblioteca de Cookies e Componente CookieBanner devem existir com suporte a cookies reais', () => {
    assert.ok(fs.existsSync(cookiesLibPath), 'src/lib/cookies.ts deve existir');
    const libContent = fs.readFileSync(cookiesLibPath, 'utf8');
    assert.ok(libContent.includes('document.cookie'), 'Deve manipular cookies reais do navegador');
    assert.ok(libContent.includes('COOKIE_CONSENT_KEY'), 'Deve definir chave de consentimento de cookies');
    assert.ok(libContent.includes('setCookieConsent'), 'Deve exportar setCookieConsent');
    assert.ok(libContent.includes('getCookieConsent'), 'Deve exportar getCookieConsent');

    assert.ok(fs.existsSync(cookieBannerPath), 'src/components/cookies/CookieBanner.tsx deve existir');
    const bannerContent = fs.readFileSync(cookieBannerPath, 'utf8');
    assert.ok(bannerContent.includes('Aceitar todos'), 'Banner deve ter botão de aceitar');
    assert.ok(bannerContent.includes('Apenas essenciais'), 'Banner deve ter opção de apenas essenciais');
    assert.ok(bannerContent.includes('Umami Analytics'), 'Banner deve citar Umami Analytics com transparência');
  });

  it('5. RootLayout e Footer devem integrar o CookieBanner e botões limpos', () => {
    const layoutContent = fs.readFileSync(rootLayoutPath, 'utf8');
    assert.ok(layoutContent.includes('CookieBanner'), 'RootLayout deve renderizar CookieBanner');

    const footerContent = fs.readFileSync(footerPath, 'utf8');
    assert.ok(footerContent.includes('Política de Privacidade'), 'Footer deve ter link "Política de Privacidade"');
    assert.ok(footerContent.includes('Termos de Uso'), 'Footer deve ter link "Termos de Uso"');
    assert.ok(footerContent.includes('Preferências de Cookies'), 'Footer deve ter botão para preferências de cookies');
    assert.ok(!footerContent.includes('Privacidade Blindada'), 'Footer não deve conter "Privacidade Blindada"');
    assert.ok(!footerContent.includes('Termos de Uso Soberanos'), 'Footer não deve conter "Termos de Uso Soberanos"');
  });
});
