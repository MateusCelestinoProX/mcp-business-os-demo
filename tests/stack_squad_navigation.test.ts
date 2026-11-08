import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

describe('Suíte de Validação: Page Stack & Squad no Header e Plataforma Unificada', () => {
  const baseDir = path.resolve(__dirname, '..');
  const navbarPath = path.join(baseDir, 'src/components/layout/Navbar.tsx');
  const mobileNavPath = path.join(baseDir, 'src/components/layout/MobileBottomNav.tsx');
  const footerPath = path.join(baseDir, 'src/components/layout/Footer.tsx');
  const pagePath = path.join(baseDir, 'src/app/stack-squad/page.tsx');
  const viewPath = path.join(baseDir, 'src/components/stack-squad/StackSquadView.tsx');
  const sitemapPath = path.join(baseDir, 'src/app/sitemap.ts');
  const comunidadeHtmlPath = path.join(baseDir, 'public/comunidade/index.html');
  const showcaseHtmlPath = path.join(baseDir, 'public/showcase/index.html');
  const bibliotecaHtmlPath = path.join(baseDir, 'public/biblioteca/index.html');

  test('1. Navbar.tsx deve incluir o link Stack & Squad imediatamente ao lado de Showcase', () => {
    assert.ok(fs.existsSync(navbarPath), 'Navbar.tsx deve existir');
    const content = fs.readFileSync(navbarPath, 'utf-8');

    assert.ok(content.includes('Stack & Squad'), 'Deve conter o label Stack & Squad');
    assert.ok(content.includes('/stack-squad'), 'Deve conter a rota /stack-squad');

    // Validar posição: Showcase deve vir imediatamente antes de Stack & Squad
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

  test('4. A página src/app/stack-squad/page.tsx e sua view devem existir e ser válidas', () => {
    assert.ok(fs.existsSync(pagePath), 'src/app/stack-squad/page.tsx deve existir');
    assert.ok(fs.existsSync(viewPath), 'src/components/stack-squad/StackSquadView.tsx deve existir');

    const pageContent = fs.readFileSync(pagePath, 'utf-8');
    assert.ok(pageContent.includes('constructMetadata'), 'Página deve configurar metadados SEO');
    assert.ok(pageContent.includes('/stack-squad'), 'Metadata deve referenciar /stack-squad');
    assert.ok(pageContent.includes('StackSquadView'), 'Página deve renderizar StackSquadView');

    const viewContent = fs.readFileSync(viewPath, 'utf-8');
    assert.ok(viewContent.includes('n8n Enterprise Automation'), 'View deve exibir stack de automação');
    assert.ok(viewContent.includes('Typebot Pro Conversational'), 'View deve exibir Typebot');
    assert.ok(viewContent.includes('PostgreSQL & Drizzle ORM'), 'View deve exibir PostgreSQL e Drizzle');
    assert.ok(viewContent.includes('Next.js 15 App Router & React 19'), 'View deve exibir Next.js');
    assert.ok(viewContent.includes('SDR & Qualificador Conversacional 24/7'), 'View deve listar Agente SDR');
    assert.ok(viewContent.includes('Orquestrador de Fluxos & Eventos'), 'View deve listar Agente Orquestrador');
    assert.ok(viewContent.includes('Guardião de Dados & Inteligência CRM'), 'View deve listar Agente de Dados');
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
