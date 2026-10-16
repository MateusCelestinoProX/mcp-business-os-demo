import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const projectRoot = process.cwd();

test('Blindagem da Suíte de Shaders Vermelhos de Personal OS & Comunidade Enriquecida', async (t) => {
  const indexHtmlPath = path.join(projectRoot, 'public', 'comunidade', 'index.html');
  const appJsPath = path.join(projectRoot, 'public', 'comunidade', 'app.js');
  const shadersJsPath = path.join(projectRoot, 'public', 'comunidade', 'js', 'community-shaders.js');
  const oglJsPath = path.join(projectRoot, 'public', 'comunidade', 'js', 'ogl.js');

  const indexHtml = fs.readFileSync(indexHtmlPath, 'utf-8');
  const appJs = fs.readFileSync(appJsPath, 'utf-8');
  const shadersJs = fs.readFileSync(shadersJsPath, 'utf-8');

  await t.test('1. Shaders WebGL de Personal OS devem estar presentes e importados', () => {
    assert.ok(fs.existsSync(shadersJsPath), 'community-shaders.js deve existir em public/comunidade/js/');
    assert.ok(fs.existsSync(oglJsPath), 'ogl.js deve existir em public/comunidade/js/');
    assert.ok(indexHtml.includes('src="/comunidade/js/community-shaders.js"'), 'index.html deve carregar community-shaders.js');
    assert.ok(indexHtml.includes('id="bg-webgl-container"'), 'index.html deve conter container WebGL fixo');
    assert.ok(indexHtml.includes('id="bg-webgl-vignette"'), 'index.html deve conter vinheta de profundidade');
  });

  await t.test('2. Adaptação para paleta vermelha e brilho suavizado nos shaders', () => {
    // Verifica presença de cores vermelhas carmesim/rubro
    assert.ok(shadersJs.includes('#dc2626') || shadersJs.includes('#ef4444') || shadersJs.includes('#991b1b'), 'Shaders devem utilizar paletas de vermelho/crimson');
    // Verifica que paletas primárias antigas de Personal OS foram substituídas no renderWebGLBackground
    assert.ok(shadersJs.includes("case 'strands':"), 'Deve conter caso strands');
    assert.ok(shadersJs.includes("case 'ferrofluid':"), 'Deve conter caso ferrofluid');
    assert.ok(shadersJs.includes("case 'darkveil':"), 'Deve conter caso darkveil');
    assert.ok(shadersJs.includes("case 'balatro':"), 'Deve conter caso balatro');
    assert.ok(shadersJs.includes("case 'liquidether':"), 'Deve conter caso liquidether');

    // Verifica que window.COMMUNITY_SHADERS e helpers existem
    assert.ok(shadersJs.includes('window.COMMUNITY_SHADERS'), 'Deve exportar lista de shaders');
    assert.ok(shadersJs.includes('window.setCommunityShader'), 'Deve exportar seletor dinâmico');
    assert.ok(shadersJs.includes('window.toggleCommunityRotative'), 'Deve exportar modo rotativo');
  });

  await t.test('3. Transição contextual da view comunidade no app.js', () => {
    assert.ok(appJs.includes("currentView === 'community'"), 'app.js deve gerenciar transição de background');
    assert.ok(appJs.includes("webglContainer.style.opacity = '1'"), 'Container WebGL deve ficar visível na comunidade');
    assert.ok(appJs.includes("window.stopWebGLBackground()"), 'Shaders devem ser pausados fora da comunidade para economizar GPU');
  });

  await t.test('4. Enriquecimento da interface da comunidade', () => {
    // Hero & Barra de atmosfera
    assert.ok(appJs.includes('Atmosfera Visual WebGL (Personal OS)'), 'Deve conter barra de atmosfera dos shaders');
    assert.ok(appJs.includes('shader-pill-btn'), 'Deve conter pills seletores de shaders');

    // Métricas Bento
    assert.ok(appJs.includes('Membros VIP Ativos'), 'Deve conter métrica de membros');
    assert.ok(appJs.includes('Prompts & Workflows'), 'Deve conter métrica de prompts');

    // Filtros e busca
    assert.ok(appJs.includes('window.appFilterCommunity'), 'Deve ter filtro por categorias');
    assert.ok(appJs.includes('window.appSearchCommunity'), 'Deve ter busca em tempo real');

    // Formatador de Prompts (AI Prompt Studio)
    assert.ok(appJs.includes('AI Prompt Studio'), 'Composer deve ter módulo de prompt formatado');
    assert.ok(appJs.includes('window.appCopyPrompt'), 'Cards devem ter botão de copiar prompt com 1 clique');

    // Lightbox modal de imagens
    assert.ok(indexHtml.includes('id="communityImageLightbox"'), 'index.html deve conter modal lightbox');
    assert.ok(appJs.includes('window.openCommunityLightbox'), 'app.js deve permitir zoom em tela cheia');

    // Sidebar enriquecida
    assert.ok(appJs.includes('Trending Prompts'), 'Sidebar deve conter Trending Prompts');
    assert.ok(appJs.includes('Top Criadores da Semana'), 'Sidebar deve conter Leaderboard');
    assert.ok(appJs.includes('Salas Rápidas'), 'Sidebar deve conter atalhos para canais');
  });
});
