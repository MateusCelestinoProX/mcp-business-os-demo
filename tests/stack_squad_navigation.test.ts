import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

describe('Suíte de Validação: Page Stack & Squad no Header e SmartFlow Injetada', () => {
  const baseDir = path.resolve(__dirname, '..');
  const navbarPath = path.join(baseDir, 'src/components/layout/Navbar.tsx');
  const mobileNavPath = path.join(baseDir, 'src/components/layout/MobileBottomNav.tsx');
  const footerPath = path.join(baseDir, 'src/components/layout/Footer.tsx');
  const routePath = path.join(baseDir, 'src/app/stack-squad/route.ts');
  const smartflowHtmlPath = path.join(baseDir, 'public/smartflow/index.html');
  const sitemapPath = path.join(baseDir, 'src/app/sitemap.ts');
  const comunidadeHtmlPath = path.join(baseDir, 'public/comunidade/index.html');
  const showcaseHtmlPath = path.join(baseDir, 'public/showcase/index.html');
  const bibliotecaHtmlPath = path.join(baseDir, 'public/biblioteca/index.html');

  test('1. Navbar.tsx deve incluir o link Stack & Squad imediatamente ao lado de Showcase', () => {
    assert.ok(fs.existsSync(navbarPath), 'Navbar.tsx deve existir');
    const content = fs.readFileSync(navbarPath, 'utf-8');

    assert.ok(content.includes('Stack & Squad'), 'Deve conter o label Stack & Squad');
    assert.ok(content.includes('/stack-squad'), 'Deve conter a rota /stack-squad');

    const showcaseIndex = content.indexOf('{ name: "Showcase"');
    const stackSquadIndex = content.indexOf('{ name: "Stack & Squad"');
    const shopIndex = content.indexOf('{ name: "Shop"');

    assert.ok(showcaseIndex !== -1, 'Showcase deve estar nos navLinks');
    assert.ok(stackSquadIndex !== -1, 'Stack & Squad deve estar nos navLinks');
    assert.ok(shopIndex !== -1, 'Shop deve estar nos navLinks');
    assert.ok(
      showcaseIndex < stackSquadIndex && stackSquadIndex < shopIndex,
      'Stack & Squad deve estar posicionado ao lado de Showcase (entre Showcase e Shop)'
    );
  });

  test('2. MobileBottomNav.tsx deve incorporar Stack & Squad no dock móvel', () => {
    assert.ok(fs.existsSync(mobileNavPath), 'MobileBottomNav.tsx deve existir');
    const content = fs.readFileSync(mobileNavPath, 'utf-8');

    assert.ok(content.includes('Stack & Squad'), 'Dock móvel deve conter Stack & Squad');
    assert.ok(content.includes('/stack-squad'), 'Dock móvel deve conter href /stack-squad');
  });

  test('3. Footer.tsx deve conter Stack & Squad sincronizado', () => {
    assert.ok(fs.existsSync(footerPath), 'Footer.tsx deve existir');
    const content = fs.readFileSync(footerPath, 'utf-8');

    assert.ok(content.includes('Stack & Squad'), 'Footer deve conter Stack & Squad');
    assert.ok(content.includes('/stack-squad'), 'Footer deve conter rota /stack-squad');
  });

  test('4. A rota src/app/stack-squad/route.ts deve servir a interface SmartFlow', () => {
    assert.ok(fs.existsSync(routePath), 'src/app/stack-squad/route.ts deve existir');
    assert.ok(fs.existsSync(smartflowHtmlPath), 'public/smartflow/index.html deve existir');

    const routeContent = fs.readFileSync(routePath, 'utf-8');
    assert.ok(routeContent.includes('smartflow'), 'Route deve referenciar o diretório smartflow');
    assert.ok(routeContent.includes('NextResponse'), 'Route deve usar NextResponse');

    const htmlContent = fs.readFileSync(smartflowHtmlPath, 'utf-8');
    // Validar presença de SmartFlow
    assert.ok(htmlContent.includes('SmartFlow'), 'HTML deve conter a marca SmartFlow');
    assert.ok(htmlContent.includes('Estratégia de quem'), 'HTML deve conter o catchphrase oficial');
    assert.ok(htmlContent.includes('Mateus Celestino'), 'HTML deve conter Mateus Celestino no Squad');
    assert.ok(htmlContent.includes('Odilon'), 'HTML deve conter Odilon no Squad');
    assert.ok(htmlContent.includes('/smartflow/mateus.png'), 'HTML deve carregar foto de Mateus');
    assert.ok(htmlContent.includes('/smartflow/odilon.png'), 'HTML deve carregar foto de Odilon');
    assert.ok(htmlContent.includes('/smartflow/vid1.mp4'), 'HTML deve carregar vídeo de fundo vid1');
    assert.ok(htmlContent.includes('calendar.google.com/calendar/appointments'), 'HTML deve conter iframe do Google Calendar');

    // Validar presença e estado ativo da Master Sovereign Bar
    assert.ok(htmlContent.includes('id="master-sovereign-bar"'), 'HTML deve possuir Master Sovereign Bar');
    assert.match(
      htmlContent,
      /<a href="\/stack-squad"[^>]*class="[^"]*active[^"]*"[^>]*title="Stack & Squad"/,
      'Link Stack & Squad deve estar ativo na Master Sovereign Bar'
    );
    assert.ok(htmlContent.includes('id="mobile-sovereign-bottom-bar"'), 'HTML deve possuir dock móvel');
    assert.match(
      htmlContent,
      /<a href="\/stack-squad"[^>]*class="[^"]*active[^"]*"/,
      'Item Stack & Squad deve estar ativo no dock móvel'
    );
  });

  test('5. sitemap.ts deve indexar a rota /stack-squad', () => {
    assert.ok(fs.existsSync(sitemapPath), 'sitemap.ts deve existir');
    const content = fs.readFileSync(sitemapPath, 'utf-8');
    assert.ok(content.includes('/stack-squad'), 'sitemap deve incluir /stack-squad');
  });

  test('6. Headers estáticos de Comunidade, Showcase e Biblioteca devem incluir Stack & Squad', () => {
    for (const filePath of [comunidadeHtmlPath, showcaseHtmlPath, bibliotecaHtmlPath]) {
      assert.ok(fs.existsSync(filePath), `Arquivo ${filePath} deve existir`);
      const content = fs.readFileSync(filePath, 'utf-8');
      assert.ok(
        content.includes('href="/stack-squad"'),
        `${filePath} deve conter link para /stack-squad`
      );
      assert.ok(
        content.includes('Stack & Squad'),
        `${filePath} deve exibir texto Stack & Squad`
      );
    }
  });
});
