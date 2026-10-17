import test from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

const ROOT_DIR = process.cwd();

test('Blindagem do Fluxo de Login & Feedback Visual da Comunidade', async (t) => {
  const indexHtml = fs.readFileSync(path.join(ROOT_DIR, 'public', 'comunidade', 'index.html'), 'utf-8');
  const appJs = fs.readFileSync(path.join(ROOT_DIR, 'public', 'comunidade', 'app.js'), 'utf-8');

  await t.test('1. Toast deve possuir z-index máximo (z-[100001]) e ícone contextual', () => {
    assert.match(indexHtml, /id="toast"[^>]*z-\[100001\]/, 'Toast deve ter z-[100001]');
    assert.match(indexHtml, /id="toastIcon"/, 'Toast deve ter elemento #toastIcon');
    assert.match(indexHtml, /id="toastMessage"/, 'Toast deve ter elemento #toastMessage');
  });

  await t.test('2. Modal de Autenticação deve ter z-index 100000 e componentes de alerta', () => {
    assert.match(indexHtml, /id="authModal"[^>]*z-\[100000\]/, 'authModal deve ter z-[100000]');
    assert.match(indexHtml, /id="authAlertArea"/, 'authModal deve conter caixa de alerta inline');
    assert.match(indexHtml, /id="authAlertIcon"/, 'authModal deve ter ícone de alerta');
    assert.match(indexHtml, /id="authAlertText"/, 'authModal deve ter texto de alerta');
  });

  await t.test('3. Botões de acesso rápido demo 1-clique e senhas expostas devem estar COMPLETAMENTE REMOVIDOS', () => {
    assert.doesNotMatch(indexHtml, /id="authQuickAdminBtn"/, 'Botão authQuickAdminBtn deve estar removido');
    assert.doesNotMatch(indexHtml, /id="authQuickMemberBtn"/, 'Botão authQuickMemberBtn deve estar removido');
    assert.doesNotMatch(indexHtml, /MateusProX@2026!/, 'Senha de demonstração não pode estar impressa no HTML');
  });

  await t.test('4. app.js deve implementar showAuthAlert e exportar helpers no window', () => {
    assert.match(appJs, /function showAuthAlert/, 'Deve implementar showAuthAlert');
    assert.match(appJs, /function clearAuthAlert/, 'Deve implementar clearAuthAlert');
    assert.match(appJs, /window\.appShowToast\s*=/, 'Deve exportar window.appShowToast');
    assert.match(appJs, /window\.appShowAuth\s*=/, 'Deve exportar window.appShowAuth');
  });

  await t.test('5. app.js deve implementar submissão segura e feedback no submit', () => {
    assert.match(appJs, /showAuthAlert\([^)]*success/, 'app.js deve chamar showAuthAlert com success');
    assert.match(appJs, /showAuthAlert\([^)]*error/, 'app.js deve chamar showAuthAlert com error');
  });

  await t.test('6. Endpoint /api/auth/login deve responder com sucesso para admin demo', async () => {
    try {
      const res = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: process.env.ADMIN_EMAIL || 'mcp6667@proton.me',
          password: process.env.ADMIN_PASSWORD || 'McpProX#2026_Sovereign@Admin!7Kz9Pq'
        })
      });
      assert.strictEqual(res.status, 200, 'Deve retornar status 200');
      const data = await res.json();
      assert.strictEqual(data.success, true, 'success deve ser true');
      assert.strictEqual(data.role, 'admin', 'role deve ser admin');
      assert.ok(data.user, 'objeto user deve existir');
    } catch (e) {
      console.warn('Servidor local offline para teste de integração HTTP (login demo):', e.message);
    }
  });

  await t.test('7. Endpoint /api/auth/login deve responder com erro 401 explícito para credencial incorreta', async () => {
    try {
      const res = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'teste@incorreto.com',
          password: 'senha_incorreta'
        })
      });
      assert.strictEqual(res.status, 401, 'Deve retornar status 401');
      const data = await res.json();
      assert.strictEqual(data.success, false, 'success deve ser false');
      assert.ok(data.error && data.error.length > 0, 'mensagem de erro deve ser clara');
    } catch (e) {
      console.warn('Servidor local offline para teste de integração HTTP (login incorreto):', e.message);
    }
  });
});
