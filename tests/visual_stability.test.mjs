/**
 * Guarda de regressão — Estabilidade Visual em scroll rápido.
 * Ver docs/ESTABILIDADE_VISUAL.md (incidente INC-2026-10-17-SCROLL).
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const SRC = path.resolve(process.cwd(), 'src');

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (/\.(tsx?|css)$/.test(e.name)) out.push(p);
  }
  return out;
}

const files = walk(SRC);
const read = (f) => fs.readFileSync(f, 'utf8');
const rel = (f) => path.relative(process.cwd(), f);

function offenders(regex, filter = () => true) {
  return files.filter(filter).filter((f) => regex.test(read(f))).map(rel);
}

test('proibido content-visibility / contain-intrinsic-size (seções blank em scroll rápido)', () => {
  assert.deepEqual(offenders(/content-visibility|contain-intrinsic-size|\[content-visibility/), []);
});

test('proibido pausar shaders/renderização durante scroll (isPageScrolling / fastScrolling)', () => {
  assert.deepEqual(offenders(/isPageScrolling|fastScrolling/), []);
});

test('proibido transform: translateZ(0) em classes de vidro (camadas compostas em excesso)', () => {
  const css = files.filter((f) => f.endsWith('.css'));
  const bad = css.filter((f) => /translateZ\(0\)/.test(read(f))).map(rel);
  assert.deepEqual(bad, []);
});

test('proibido <main> aninhado: layout.tsx já provê <main>', () => {
  const bad = offenders(/<main[\s>]/, (f) => /[\\/]app[\\/].*page\.tsx$/.test(f));
  assert.deepEqual(bad, []);
});

test('ids de âncora (publicacoes/sobre/servicos/stacks/squad/contato) únicos: apenas nas <section>', () => {
  const bad = offenders(/<div id="(publicacoes|sobre|servicos|stacks|squad|contato)"/);
  assert.deepEqual(bad, []);
});

test('shaders fixos com blend: DPR nunca fixado em 1.0 (blur/pixelização em retina)', () => {
  const bad = offenders(/(?:const dpr = 1\.0;|setPixelRatio\(1\.0\))/, (f) => /shaders/.test(f));
  assert.deepEqual(bad, []);
});

// ---------------------------------------------------------------------------
// INC-2026-10-17-SCROLL (2ª fase): backdrop-filter sobre fundo animado
// ---------------------------------------------------------------------------

test('globals.css: backdrop-filter permitido SOMENTE em .glass-frosted (opt-in)', () => {
  const css = read(path.join(SRC, 'app', 'globals.css'));
  // remove blocos .glass-frosted e comentários, o que sobrar não pode ter backdrop-filter
  const semFrosted = css
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\.glass-frosted\s*\{[^}]*\}/g, '');
  assert.ok(!/backdrop-filter/.test(semFrosted), 'backdrop-filter encontrado fora de .glass-frosted');
});

test('componentes sempre visíveis da home não usam backdrop-blur-* (Tailwind)', () => {
  const persistentes = [
    'components/layout/Navbar.tsx:desktop',
    'components/layout/Footer.tsx',
    'components/portal/MainNotionLayout.tsx',
    'components/portal/SobreSection.tsx',
    'components/portal/ServicosSection.tsx',
    'components/portal/StacksSection.tsx',
    'components/portal/SquadSection.tsx',
    'components/portal/ContatoSection.tsx',
    'components/portal/PortalNavbar.tsx',
    'components/portal/AlternatingHeroShaders.tsx',
    'components/ui/Badge.tsx',
    'components/ui/Button.tsx',
    'components/ui/GlassCard.tsx',
  ];
  const bad = [];
  for (const entry of persistentes) {
    const [file, mode] = entry.split(':');
    let txt = read(path.join(SRC, file));
    // Navbar: o menu mobile só monta quando aberto (lg:hidden) — permitido
    if (mode === 'desktop') txt = txt.split('\n').filter((l) => !/lg:hidden/.test(l)).join('\n');
    if (/backdrop-blur/.test(txt)) bad.push(file);
  }
  assert.deepEqual(bad, []);
});

test('shaders: proibido fwidth() em GLSL ES 1.00 (não compila -> useProgram inválido a cada frame)', () => {
  const bad = offenders(
    /fwidth\(/,
    // GridScanShader usa three.js (converte para GLSL 3.00 automaticamente) — permitido
    (f) => /shaders[\\/]/.test(f) && !/GridScanShader/.test(f),
  );
  assert.deepEqual(bad, []);
});

