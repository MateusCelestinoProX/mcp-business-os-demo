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

test('ids de âncora (publicacoes/sobre/contato) únicos: apenas nas <section>', () => {
  const bad = offenders(/<div id="(publicacoes|sobre|contato)"/);
  assert.deepEqual(bad, []);
});

test('shaders fixos com blend: DPR nunca fixado em 1.0 (blur/pixelização em retina)', () => {
  const bad = offenders(/(?:const dpr = 1\.0;|setPixelRatio\(1\.0\))/, (f) => /shaders/.test(f));
  assert.deepEqual(bad, []);
});
