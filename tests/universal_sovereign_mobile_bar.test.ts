import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

describe('Suíte de Validação: Presença Universal da Barra Geral Soberana & Otimizações Mobile', () => {
  const baseDir = path.resolve(__dirname, '..');
  const bibliotecaHtmlPath = path.join(baseDir, 'public/biblioteca/index.html');
  const comunidadeHtmlPath = path.join(baseDir, 'public/comunidade/index.html');
  const showcaseHtmlPath = path.join(baseDir, 'public/showcase/index.html');
  const mobileNavTsxPath = path.join(baseDir, 'src/components/layout/MobileBottomNav.tsx');
  const comunidadeAppJsPath = path.join(baseDir, 'public/comunidade/app.js');

  const requiredHubs = [
    { label: 'Portal', href: '/' },
    { label: 'Showcase', href: '/showcase' },
    { label: 'Shop', href: '/shop' },
    { label: 'Comunidade', href: '/comunidade' },
    { label: 'Free Resources', href: '/biblioteca' },
    { label: 'Admin', href: '/admin' },
  ];

  test('1. MobileBottomNav.tsx (Next.js Global) deve possuir a Barra Geral com as 6 rotas soberanas', () => {
    assert.ok(fs.existsSync(mobileNavTsxPath), 'MobileBottomNav.tsx deve existir');
    const content = fs.readFileSync(mobileNavTsxPath, 'utf-8');

    assert.ok(content.includes('id="mobile-sovereign-bottom-bar"'), 'Deve conter o id soberano universal');
    for (const hub of requiredHubs) {
      assert.ok(
        content.includes(`href: "${hub.href}"`) || content.includes(`href="${hub.href}"`),
        `Deve incluir rota ${hub.href} (${hub.label})`
      );
    }
  });

  test('2. Biblioteca (Free Resources) deve possuir a Barra Geral Soberana com item ativo correto', () => {
    assert.ok(fs.existsSync(bibliotecaHtmlPath), 'biblioteca/index.html deve existir');
    const content = fs.readFileSync(bibliotecaHtmlPath, 'utf-8');

    assert.ok(content.includes('id="mobile-sovereign-bottom-bar"'), 'Deve conter Barra Geral Soberana');
    assert.match(content, /href="\/biblioteca"[^>]*class="[^"]*active[^"]*"/, 'Free Resources deve estar ativo');
    for (const hub of requiredHubs) {
      assert.ok(content.includes(`href="${hub.href}"`), `Biblioteca deve conter link ${hub.href} (${hub.label})`);
    }
    // Regra Soberana: Nenhuma interface, dock ou seletor de shaders deve existir em Free Resources
    assert.ok(!content.includes('id="shader-control-dock"'), 'Nenhum dock de shader deve existir em Free Resources');
    assert.ok(!content.includes('id="btn-shader-min-toggle"'), 'Nenhum botão de toggle de shader deve existir em Free Resources');
    assert.ok(!content.includes('class="shader-pills-row"'), 'Nenhuma linha de seleção de shaders deve existir em Free Resources');
  });

  test('3. Comunidade (A.I Visuals) deve possuir a Barra Geral Soberana com item ativo correto', () => {
    assert.ok(fs.existsSync(comunidadeHtmlPath), 'comunidade/index.html deve existir');
    const content = fs.readFileSync(comunidadeHtmlPath, 'utf-8');

    assert.ok(content.includes('id="mobile-sovereign-bottom-bar"'), 'Deve conter Barra Geral Soberana');
    assert.match(content, /href="\/comunidade"[^>]*class="[^"]*active[^"]*"/, 'Comunidade deve estar ativa');
    for (const hub of requiredHubs) {
      assert.ok(content.includes(`href="${hub.href}"`), `Comunidade deve conter link ${hub.href} (${hub.label})`);
    }
    // Sub-navegação interna preservada
    assert.ok(content.includes('id="mobileDockHomeBtn"'), 'Deve preservar botão Início');
    assert.ok(content.includes('id="mobileDockCommunityBtn"'), 'Deve preservar botão Feed');
    assert.ok(content.includes('id="mobileDockServersBtn"'), 'Deve preservar botão Servers');
    assert.ok(content.includes('id="mobileDockSearchBtn"'), 'Deve preservar botão Buscar');
    assert.ok(content.includes('id="mobileDockProfileBtn"'), 'Deve preservar botão Perfil');
  });

  test('4. Showcase deve possuir a Barra Geral Soberana com item ativo correto', () => {
    assert.ok(fs.existsSync(showcaseHtmlPath), 'showcase/index.html deve existir');
    const content = fs.readFileSync(showcaseHtmlPath, 'utf-8');

    assert.ok(content.includes('id="mobile-sovereign-bottom-bar"'), 'Deve conter Barra Geral Soberana');
    assert.match(content, /href="\/showcase"[^>]*class="[^"]*active[^"]*"/, 'Showcase deve estar ativo');
    for (const hub of requiredHubs) {
      assert.ok(content.includes(`href="${hub.href}"`), `Showcase deve conter link ${hub.href} (${hub.label})`);
    }
  });

  test('5. Toast de Prompt Copiado na Comunidade nunca deve bloquear toques do usuário', () => {
    const htmlContent = fs.readFileSync(comunidadeHtmlPath, 'utf-8');
    const jsContent = fs.readFileSync(comunidadeAppJsPath, 'utf-8');

    // HTML do Toast
    assert.ok(htmlContent.includes('pointer-events-none'), 'Toast deve ter pointer-events-none no HTML');
    assert.ok(htmlContent.includes('opacity-0'), 'Toast deve iniciar com opacity-0');
    assert.match(htmlContent, /<span id="toastMessage"[^>]*><\/span>/, 'Toast não deve ter texto estático pré-renderizado');

    // JS do Toast
    assert.ok(jsContent.includes("toast.style.pointerEvents = 'none'"), 'app.js deve blindar pointerEvents como none');
    assert.ok(!jsContent.includes("toast.classList.add('opacity-100', 'pointer-events-auto'"), 'app.js não deve adicionar pointer-events-auto');
  });

  test('6. Blindagem de Acesso Admin: Widget Admin na barra móvel deve estar estritamente oculto por padrão (display: none !important) e condicionado a sessão admin', () => {
    const htmlFiles = [showcaseHtmlPath, bibliotecaHtmlPath, comunidadeHtmlPath];

    for (const filePath of htmlFiles) {
      const content = fs.readFileSync(filePath, 'utf-8');

      // 1. CSS deve esconder com !important por padrão
      assert.ok(
        content.includes('#msb-dock-admin-link {') && content.includes('display: none !important;'),
        `${filePath} deve possuir regra CSS #msb-dock-admin-link { display: none !important; }`
      );
      assert.ok(
        content.includes('#msb-dock-admin-link.is-admin-active {') && content.includes('display: flex !important;'),
        `${filePath} deve possuir regra CSS #msb-dock-admin-link.is-admin-active { display: flex !important; }`
      );

      // 2. Tag HTML inline deve ter display: none !important
      assert.ok(
        content.includes('id="msb-dock-admin-link"') && content.includes('style="display: none !important;"'),
        `${filePath} deve iniciar com style="display: none !important;" no elemento #msb-dock-admin-link`
      );

      // 3. Script deve verificar explicitamente isLoggedIn === true && role === 'admin'
      assert.ok(
        content.includes("u.isLoggedIn === true && u.role === 'admin'") ||
        content.includes("user.isLoggedIn === true && user.role === 'admin'"),
        `${filePath} deve validar explicitamente isLoggedIn === true && role === 'admin'`
      );

      // 4. renderMSB deve controlar dockAdminLink
      assert.ok(
        content.includes("dockAdminLink.classList.remove('is-admin-active')"),
        `${filePath} renderMSB deve remover a classe is-admin-active quando não for admin`
      );
    }
  });
});
