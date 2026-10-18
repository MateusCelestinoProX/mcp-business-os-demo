// Sonda de estabilidade de scroll (Brave/Chromium real). Uso: npm i -D playwright-core && node scripts/perf/scroll-probe.mjs
// Variáveis: URL (padrão http://localhost:3000), ONLY=baseline,sem-backdrop-filter,... Ver docs/ESTABILIDADE_VISUAL.md
import { chromium } from 'playwright-core';

const URL = process.env.URL || 'http://localhost:3000';
const BRAVE = '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser';

const browser = await chromium.launch({
  executablePath: BRAVE,
  headless: false,
  args: ['--enable-gpu-rasterization', '--ignore-gpu-blocklist'],
});

async function openPage() {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  const errs = [];
  page.on('console', (m) => { if (['error', 'warning'].includes(m.type())) errs.push(`[${m.type()}] ${m.text().slice(0, 220)}`); });
  page.on('pageerror', (e) => errs.push('[pageerror] ' + String(e).slice(0, 220)));
  await page.addInitScript(() => {
    window.__cls = 0; window.__shifts = [];
    new PerformanceObserver((l) => {
      for (const e of l.getEntries()) {
        if (!e.hadRecentInput) {
          window.__cls += e.value;
          window.__shifts.push({ v: +e.value.toFixed(4), t: Math.round(e.startTime), src: (e.sources || []).slice(0, 2).map((s) => (s.node && (s.node.id || s.node.className || s.node.nodeName) || '?').toString().slice(0, 60)) });
        }
      }
    }).observe({ type: 'layout-shift', buffered: true });
    window.__long = [];
    try { new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__long.push(Math.round(e.duration)); }).observe({ type: 'longtask', buffered: true }); } catch {}
  });
  await page.goto(URL, { waitUntil: 'load' });
  await page.waitForTimeout(3500);
  return { page, ctx, errs };
}

async function inventory(page) {
  return page.evaluate(() => {
    const all = [...document.querySelectorAll('*')];
    const cs = (el) => getComputedStyle(el);
    const bf = all.filter((el) => { const s = cs(el); return (s.backdropFilter && s.backdropFilter !== 'none') || (s.webkitBackdropFilter && s.webkitBackdropFilter !== 'none'); });
    const canv = [...document.querySelectorAll('canvas')].map((c) => {
      const r = c.getBoundingClientRect();
      let ctxType = 'unknown';
      return { w: c.width, h: c.height, css: `${Math.round(r.width)}x${Math.round(r.height)}`, pos: cs(c.parentElement).position, parentCls: (c.parentElement.className || '').toString().slice(0, 70) };
    });
    const fixed = all.filter((el) => cs(el).position === 'fixed').map((el) => (el.id || (el.className || '').toString().slice(0, 60) || el.nodeName));
    const blends = all.filter((el) => cs(el).mixBlendMode !== 'normal').length;
    const blurs = all.filter((el) => /blur/.test(cs(el).filter)).length;
    const anims = document.getAnimations().length;
    const infinite = document.getAnimations().filter((a) => a.effect && a.effect.getComputedTiming().iterations === Infinity).length;
    const imgs = [...document.images];
    return {
      dom: all.length, backdropFilterEls: bf.length, canvases: canv, fixed, mixBlendEls: blends, cssFilterBlurEls: blurs,
      animations: anims, infiniteAnimations: infinite,
      imgs: imgs.length, imgsNoDims: imgs.filter((i) => !i.getAttribute('width') && !i.getAttribute('height') && !i.closest('[class*=aspect]')).length,
      docHeight: document.documentElement.scrollHeight,
      sections: [...document.querySelectorAll('section')].map((s) => ({ id: s.id, h: Math.round(s.getBoundingClientRect().height), cv: cs(s).contentVisibility })),
    };
  });
}

// Rola rápido via roda do mouse (caminho real do compositor) medindo frames
async function fastScroll(page, label) {
  await page.evaluate(() => {
    window.scrollTo(0, 0);
    window.__frames = []; window.__run = true; window.__hts = [];
    let last = performance.now();
    const tick = (t) => { window.__frames.push(t - last); window.__ys = window.__ys || []; window.__ys.push(Math.round(scrollY)); last = t; if (window.__run) requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  });
  await page.waitForTimeout(400);
  await page.evaluate(() => { window.__cls = 0; window.__shifts = []; window.__long = []; window.__frames = []; window.__ys = []; });
  await page.mouse.move(700, 500);
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  const t0 = Date.now();
  // desce e sobe 3x com rajadas grandes
  for (let rep = 0; rep < 3; rep++) {
    for (let i = 0; i < 40; i++) { await page.mouse.wheel(0, 700); await page.waitForTimeout(16); }
    for (let i = 0; i < 40; i++) { await page.mouse.wheel(0, -700); await page.waitForTimeout(16); }
  }
  const dur = Date.now() - t0;
  const res = await page.evaluate(() => {
    window.__run = false;
    const f = window.__frames.slice(2); const ys = window.__ys.slice(2); const bk = {}; f.forEach((x,i)=>{ const b = Math.floor((ys[i]||0)/500)*500; (bk[b] = bk[b] || []).push(x); }); const buckets = Object.fromEntries(Object.entries(bk).map(([b,a])=>[b, {n:a.length, slow:a.filter(x=>x>50).length, max:Math.round(Math.max(...a))}]));
    const sorted = [...f].sort((a, b) => a - b);
    const p = (q) => +sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * q))].toFixed(1);
    return {
      frames: f.length, avg: +(f.reduce((a, b) => a + b, 0) / f.length).toFixed(1), p50: p(0.5), p95: p(0.95), p99: p(0.99), max: +Math.max(...f).toFixed(1),
      over33: f.filter((x) => x > 33.4).length, over50: f.filter((x) => x > 50).length, over100: f.filter((x) => x > 100).length,
      buckets, cls: +window.__cls.toFixed(4), shifts: window.__shifts.slice(0, 6), longTasks: window.__long.length, longMax: Math.max(0, ...window.__long),
      docHeightAfter: document.documentElement.scrollHeight,
    };
  });
  return { label, docHeightBefore: h, ms: dur, ...res };
}

const variants = {
  'sem-hero-gif': async (p) => p.addStyleTag({ content: 'header#home img[src*="hero_landscape"]{display:none!important}' }),
  'sem-gif+sem-backdrop': async (p) => p.addStyleTag({ content: 'header#home img[src*="hero_landscape"]{display:none!important} *{backdrop-filter:none!important;-webkit-backdrop-filter:none!important}' }),
  'sem-backdrop+sem-canvas+sem-anim': async (p) => p.addStyleTag({ content: 'canvas{display:none!important} *,*::before,*::after{animation:none!important;backdrop-filter:none!important;-webkit-backdrop-filter:none!important}' }),
  baseline: async () => {},
  'sem-shader-global(LiquidGlassBackground canvas)': async (p) => p.addStyleTag({ content: 'body > div.fixed.inset-0.z-0 canvas{display:none!important}' }),
  'sem-ripple-publicacoes': async (p) => p.addStyleTag({ content: '#publicacoes canvas{display:none!important}' }),
  'sem-gridscan-hero': async (p) => p.addStyleTag({ content: 'main > div canvas:not(#publicacoes canvas){}' }),
  'sem-NENHUM-canvas': async (p) => p.addStyleTag({ content: 'canvas{display:none!important}' }),
  'sem-backdrop-filter': async (p) => p.addStyleTag({ content: '*{backdrop-filter:none!important;-webkit-backdrop-filter:none!important}' }),
  'sem-blur-orbes+mix-blend': async (p) => p.addStyleTag({ content: '[class*="blur-["]{filter:none!important} [class*="mix-blend"]{mix-blend-mode:normal!important}' }),
  'sem-animacoes-css': async (p) => p.addStyleTag({ content: '*,*::before,*::after{animation:none!important}' }),
  'sem-fundo-fixo-inteiro': async (p) => p.addStyleTag({ content: 'body > div.fixed.inset-0.z-0{display:none!important}' }),
};

const only = process.env.ONLY ? process.env.ONLY.split(',') : Object.keys(variants);
const out = {};
for (const name of only) {
  const { page, ctx, errs } = await openPage();
  if (name === 'baseline') out.inventory = await inventory(page);
  await variants[name](page);
  await page.waitForTimeout(600);
  out[name] = await fastScroll(page, name);
  if (name === 'baseline') out.consoleBaseline = errs.slice(0, 12);
  await ctx.close();
}
console.log(JSON.stringify(out, null, 1));
await browser.close();
