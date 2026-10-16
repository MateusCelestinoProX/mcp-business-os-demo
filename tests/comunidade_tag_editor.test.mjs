import { test } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';

test('Comunidade - Sistema Completo de Tag Editor & Navegação de Posts por Tag', async (t) => {
  const html = fs.readFileSync('public/comunidade/index.html', 'utf8');
  const code = fs.readFileSync('public/comunidade/app.js', 'utf8');

  // 1. Validar elementos do Modal no HTML
  assert.ok(html.includes('id="tagEditorModal"'), 'tagEditorModal deve existir no index.html');
  assert.ok(html.includes('id="tagEditorName"'), 'input tagEditorName deve existir');
  assert.ok(html.includes('id="tagEditorSlug"'), 'input tagEditorSlug deve existir');
  assert.ok(html.includes('id="tagEditorIcon"'), 'input tagEditorIcon deve existir');
  assert.ok(html.includes('id="tagEditorColor"'), 'input tagEditorColor deve existir');
  assert.ok(html.includes('id="tagEditorDesc"'), 'input tagEditorDesc deve existir');
  assert.ok(html.includes('id="tagModalSaveBtn"'), 'botão tagModalSaveBtn deve existir');

  // 2. Validar funções no código JS
  assert.ok(code.includes('function getCommunityTags()'), 'getCommunityTags deve estar declarada');
  assert.ok(code.includes('function saveCommunityTags('), 'saveCommunityTags deve estar declarada');
  assert.ok(code.includes('function renderCommunityTagEditorTab()'), 'renderCommunityTagEditorTab deve existir');
  assert.ok(code.includes('window.appOpenTagModal'), 'window.appOpenTagModal deve estar implementada');
  assert.ok(code.includes('window.appCloseTagModal'), 'window.appCloseTagModal deve estar implementada');
  assert.ok(code.includes('window.appSaveTag'), 'window.appSaveTag deve estar implementada');
  assert.ok(code.includes('window.appDeleteTag'), 'window.appDeleteTag deve estar implementada');
  assert.ok(code.includes('window.appRestoreDefaultTags'), 'window.appRestoreDefaultTags deve estar implementada');

  // 3. Simular ambiente no Node.js
  let domLoadedCallback = null;
  const elements = {};
  const mockEl = () => ({
    style: {},
    classList: { add: ()=>{}, remove: ()=>{}, contains: ()=>false, toggle: ()=>{} },
    firstElementChild: { classList: { add: ()=>{}, remove: ()=>{} } },
    addEventListener: ()=>{},
    appendChild: ()=>{},
    value: '',
    innerHTML: '',
    focus: ()=>{},
    onclick: null,
    play: () => Promise.resolve(),
    getAttribute: (attr) => 'community'
  });

  const storageMap = new Map();
  storageMap.set('mcp_session_user', JSON.stringify({
    id: 'usr_mateus',
    name: 'Mateus Celestino',
    email: '202405039459@alunos.estacio.br',
    role: 'admin'
  }));
  storageMap.set('mcp_user_role', 'admin');

  global.window = global;
  global.window.addEventListener = (ev, cb) => {};
  global.document = {
    getElementById: (id) => {
      if (!elements[id]) elements[id] = mockEl();
      return elements[id];
    },
    querySelectorAll: () => [mockEl()],
    createElement: () => mockEl(),
    addEventListener: (event, cb) => {
      if (event === 'DOMContentLoaded') domLoadedCallback = cb;
    },
    title: ''
  };
  global.localStorage = {
    getItem: (k) => {
      if (k === 'mcp_session_user') return JSON.stringify({ id: 'usr_mateus', name: 'Mateus Celestino', email: '202405039459@alunos.estacio.br', role: 'admin' });
      if (k === 'mcp_user_role') return 'admin';
      return storageMap.get(k) || null;
    },
    setItem: (k, v) => storageMap.set(k, String(v)),
    removeItem: (k) => storageMap.delete(k)
  };
  global.location = { hash: '#community', pathname: '/comunidade', search: '' };
  global.history = { pushState: ()=>{}, replaceState: ()=>{} };
  try {
    Object.defineProperty(global, 'navigator', {
      value: { userAgent: 'test', clipboard: { writeText: () => Promise.resolve() } },
      configurable: true,
      writable: true
    });
  } catch(e) {}
  global.fetch = () => Promise.resolve({ ok: true, json: () => Promise.resolve([]) });

  // Executa o bundle no ambiente mockado
  eval(code);

  assert.ok(domLoadedCallback, 'DOMContentLoaded callback deve estar registrado');
  domLoadedCallback();
  await new Promise(r => setTimeout(r, 250));

  try {
    // 4. Testar Sub-aba Tag Editor
    assert.strictEqual(typeof window.appSwitchCommunityTab, 'function');
    window.appSwitchCommunityTab('tag-editor');
    const mainHtml = document.getElementById('mainAppContainer').innerHTML;
    assert.ok(mainHtml.includes('Gerenciador & Editor de Tags'), 'Deve exibir título do Tag Editor');
    assert.ok(mainHtml.includes('Nova Tag'), 'Deve exibir botão de criar nova tag');
    assert.ok(mainHtml.includes('Taxonomia & Navegação VIP') || mainHtml.includes('TAXONOMIA & NAVEGAÇÃO VIP'), 'Deve exibir badge de taxonomia');

    // 5. Testar Criação de Nova Tag via appSaveTag
    document.getElementById('tagEditorEditingId').value = '';
    document.getElementById('tagEditorName').value = 'ComfyUI Nodes';
    document.getElementById('tagEditorSlug').value = 'comfy-nodes';
    document.getElementById('tagEditorIcon').value = '🧩';
    document.getElementById('tagEditorColor').value = 'purple';
    document.getElementById('tagEditorDesc').value = 'Nós e fluxos customizados de ComfyUI';

    window.appSaveTag();

    const savedTagsRaw = storageMap.get('mcp_community_tags');
    assert.ok(savedTagsRaw, 'Tags devem ser gravadas no localStorage');
    const savedTags = JSON.parse(savedTagsRaw);
    const createdTag = savedTags.find(t => t.id === 'comfy-nodes');
    assert.ok(createdTag, 'Tag comfy-nodes deve existir nas tags gravadas');
    assert.strictEqual(createdTag.name, 'ComfyUI Nodes');
    assert.strictEqual(createdTag.icon, '🧩');

    // 6. Testar Edição de Tag Existente
    document.getElementById('tagEditorEditingId').value = 'comfy-nodes';
    document.getElementById('tagEditorName').value = 'ComfyUI Master Nodes';
    document.getElementById('tagEditorIcon').value = '⚡';
    document.getElementById('tagEditorColor').value = 'cyan';
    document.getElementById('tagEditorDesc').value = 'Nós avançados e pipelines';

    window.appSaveTag();

    const updatedTags = JSON.parse(storageMap.get('mcp_community_tags'));
    const updatedTag = updatedTags.find(t => t.id === 'comfy-nodes');
    assert.strictEqual(updatedTag.name, 'ComfyUI Master Nodes');
    assert.strictEqual(updatedTag.color, 'cyan');

    // 7. Testar Navegação/Filtro por Tag
    window.appFilterCommunity('comfy-nodes');
    const feedHtml = document.getElementById('mainAppContainer').innerHTML;
    assert.ok(feedHtml.includes('Feed & Discussões'), 'appFilterCommunity deve navegar para o Feed');

    // 8. Testar Exclusão de Tag com confirmação
    setTimeout(() => {
      const confirmBtn = document.getElementById('confirmModalConfirmBtn');
      if (confirmBtn && typeof confirmBtn.onclick === 'function') {
        confirmBtn.onclick();
      }
    }, 20);

    await window.appDeleteTag('comfy-nodes');

    const afterDeleteTags = JSON.parse(storageMap.get('mcp_community_tags'));
    assert.strictEqual(afterDeleteTags.some(t => t.id === 'comfy-nodes'), false, 'Tag comfy-nodes deve ter sido removida');

    console.log('✅ Testes do Tag Editor & Navegação de Posts por Tag passaram com 100% de sucesso!');
    process.exit(0);
  } catch (err) {
    console.error('ERRO NO TESTE:', err);
    process.exit(1);
  }
});
