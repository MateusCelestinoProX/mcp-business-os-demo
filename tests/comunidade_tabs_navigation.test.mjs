import { test } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';

test('Comunidade - Validação de Abas Internas e Ausência de Erros de Execução', async (t) => {
  const code = fs.readFileSync('public/comunidade/app.js', 'utf8');

  // 1. Verificar declaração de escapeJs
  assert.ok(code.includes('function escapeJs('), 'escapeJs deve estar declarada');

  // 2. Verificar sub-abas suportadas
  assert.ok(code.includes("let communityActiveTab = 'feed'"), 'communityActiveTab deve estar inicializado');
  assert.ok(code.includes('window.appSwitchCommunityTab'), 'window.appSwitchCommunityTab deve estar implementado');
  assert.ok(code.includes('renderCommunityPromptsTab'), 'renderCommunityPromptsTab deve existir');
  assert.ok(code.includes('renderCommunityRankingTab'), 'renderCommunityRankingTab deve existir');
  assert.ok(code.includes('renderCommunityChallengesTab'), 'renderCommunityChallengesTab deve existir');
  assert.ok(code.includes('renderCommunitySavedTab'), 'renderCommunitySavedTab deve existir');

  // 3. Simular execução em ambiente mock
  let domLoadedCallback = null;
  const elements = {};
  const mockEl = () => ({
    style: {},
    classList: { add: ()=>{}, remove: ()=>{}, contains: ()=>false, toggle: ()=>{} },
    addEventListener: ()=>{},
    appendChild: ()=>{},
    value: '',
    innerHTML: '',
    focus: ()=>{},
    onclick: null,
    play: () => Promise.resolve(),
    getAttribute: (attr) => 'community'
  });

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
      return null;
    },
    setItem: ()=>{}
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

  // Executa o código
  eval(code);

  assert.ok(domLoadedCallback, 'DOMContentLoaded callback deve estar registrado');
  domLoadedCallback();
  await new Promise(r => setTimeout(r, 150));

  // 4. Testar navegação entre abas internas
  assert.strictEqual(typeof window.appSwitchCommunityTab, 'function');

  // Aba Feed
  window.appSwitchCommunityTab('feed');
  assert.ok(document.getElementById('mainAppContainer').innerHTML.includes('Feed & Discussões'));

  // Aba Prompts Vault
  window.appSwitchCommunityTab('prompts');
  assert.ok(document.getElementById('mainAppContainer').innerHTML.includes('Acervo de Prompts VIP Exclusivos'));

  // Aba Ranking
  window.appSwitchCommunityTab('ranking');
  assert.ok(document.getElementById('mainAppContainer').innerHTML.includes('Hall da Fama & Ranking VIP'));

  // Aba Desafios
  window.appSwitchCommunityTab('challenges');
  assert.ok(document.getElementById('mainAppContainer').innerHTML.includes('Desafio #04'));

  // Aba Salvos
  window.appSwitchCommunityTab('saved');
  assert.ok(document.getElementById('mainAppContainer').innerHTML.includes('Suas Publicações e Favoritos'));

  console.log('✅ Todas as 5 abas internas da Comunidade renderizaram sem qualquer erro!');
  process.exit(0);
});
