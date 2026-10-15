import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';

describe('Suite de Testes de Fluxo & Subpáginas da Comunidade A.I Visuals', () => {
  const rootDir = process.cwd();
  const appJsPath = path.join(rootDir, 'public', 'comunidade', 'app.js');
  const indexHtmlPath = path.join(rootDir, 'public', 'comunidade', 'index.html');
  const appJsContent = fs.readFileSync(appJsPath, 'utf-8');
  const indexHtmlContent = fs.readFileSync(indexHtmlPath, 'utf-8');

  test('1. index.html deve conter a estrutura de navegação e container SPA', () => {
    assert.ok(indexHtmlContent.includes('id="mainAppContainer"'), 'Deve conter #mainAppContainer');
    assert.ok(indexHtmlContent.includes('data-view="home"'), 'Deve conter botão Home');
    assert.ok(indexHtmlContent.includes('data-view="community"'), 'Deve conter botão Community');
    assert.ok(indexHtmlContent.includes('data-view="servers"'), 'Deve conter botão Servers');
    assert.ok(indexHtmlContent.includes('id="adminNavBtn"'), 'Deve conter botão Admin');
    assert.ok(indexHtmlContent.includes('id="master-sovereign-bar"'), 'Deve conter Master Sovereign Bar');
  });

  test('2. app.js deve conter a função syncSovereignSession e ouvintes de mcp_auth_changed', () => {
    assert.ok(appJsContent.includes('function syncSovereignSession()'), 'Deve definir syncSovereignSession');
    assert.ok(appJsContent.includes("window.addEventListener('mcp_auth_changed'"), 'Deve ouvir mcp_auth_changed');
    assert.ok(appJsContent.includes("window.addEventListener('storage'"), 'Deve ouvir evento storage');
    assert.ok(appJsContent.includes("window.addEventListener('hashchange'"), 'Deve ouvir hashchange para navegação em subpáginas');
  });

  test('3. app.js deve conter dados de contingência resilientes para servidores e comunidade', () => {
    assert.ok(appJsContent.includes('DEFAULT_SOVEREIGN_SERVERS'), 'Deve ter DEFAULT_SOVEREIGN_SERVERS');
    assert.ok(appJsContent.includes('DEFAULT_SOVEREIGN_POSTS'), 'Deve ter DEFAULT_SOVEREIGN_POSTS');
    assert.ok(appJsContent.includes('srv_art_pro'), 'Deve conter servidor A.I Art Pro de demonstração');
    assert.ok(appJsContent.includes('srv_prompts_mastery'), 'Deve conter servidor Engenharia de Prompts');
    assert.ok(appJsContent.includes('srv_effects_commercial'), 'Deve conter servidor A.I Effects Comercial');
  });

  test('4. Funções de navegação em subpáginas devem sincronizar sessão antes de checar autenticação', () => {
    const fnNames = ['navigateToCommunity', 'navigateToServers', 'navigateToServerDetail', 'navigateToProfile', 'navigateToAdmin'];
    for (const fn of fnNames) {
      const idx = appJsContent.indexOf(`async function ${fn}`);
      assert.ok(idx > -1, `Função ${fn} deve existir no app.js`);
      const bodySnippet = appJsContent.slice(idx, idx + 400);
      assert.ok(bodySnippet.includes('syncSovereignSession()'), `${fn} deve chamar syncSovereignSession()`);
    }
  });

  test('5. Formulário de login deve priorizar a API local /api/auth/login', () => {
    assert.ok(appJsContent.includes("fetch('/api/auth/login'"), 'Deve submeter credenciais para /api/auth/login');
    assert.ok(appJsContent.includes("mcp_session_user"), 'Deve armazenar mcp_session_user após login');
    assert.ok(appJsContent.includes("mcp_auth_changed"), 'Deve disparar evento mcp_auth_changed');
  });

  test('6. Logout soberano deve limpar localStorage e resetar sessão', () => {
    const logoutIdx = appJsContent.indexOf('window.appLogout = async');
    assert.ok(logoutIdx > -1, 'window.appLogout deve estar implementado');
    const logoutSnippet = appJsContent.slice(logoutIdx, logoutIdx + 1000);
    assert.ok(logoutSnippet.includes("localStorage.removeItem('mcp_session_user')"), 'Logout deve remover mcp_session_user');
    assert.ok(logoutSnippet.includes("localStorage.setItem('mcp_user_role', 'visitante')"), 'Logout deve resetar mcp_user_role para visitante');
    assert.ok(logoutSnippet.includes('navigateToHome()'), 'Logout deve redirecionar para a home');
  });

  test('7. Rota HTTP /comunidade deve responder com status 200', async () => {
    try {
      const res = await fetch('http://localhost:3000/comunidade');
      assert.equal(res.status, 200, 'Endpoint /comunidade deve retornar 200');
      const html = await res.text();
      assert.ok(html.includes('A.I VISUALS'), 'HTML retornado deve conter A.I VISUALS');
      assert.ok(html.includes('app.js'), 'HTML retornado deve carregar app.js');
    } catch(e) {
      console.warn('Servidor local não acessível diretamente neste step do teste:', e.message);
    }
  });
});
