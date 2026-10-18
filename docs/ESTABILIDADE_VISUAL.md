# Estabilidade Visual — Incidente INC-2026-10-17-SCROLL

## Sintoma
Ao rolar a home (`/`) muito rápido: áreas inteiras ficam em branco/blur avermelhado
sem conteúdo (blocos borrados, retângulos soltos), saltos de scroll e barra de rolagem
instável. Começou recentemente.

## Causa raiz
Regra em `src/app/globals.css` (gambiarra "prevenção de GPU em fast scroll"):

```css
section[id] { content-visibility: auto; contain-intrinsic-size: 1px 600px; }
```

- `content-visibility: auto` descarta render de seções fora da viewport e as trata com
  altura-placeholder de **600px**. A seção `#publicacoes` (176 artigos) tem vários
  milhares de px. Em scroll rápido o navegador entra numa seção, renderiza, recalcula a
  altura real → **layout shift + conteúdo não pintado** (o "vazio" do print) e a
  scrollbar muda de tamanho.
- Efeito amplificador: o fundo global (`LiquidGlassBackground`) é uma camada `fixed`
  com WebGL + `mix-blend-screen` + orbes com `blur(55–65px)`, e dezenas de elementos
  `backdrop-filter` sobre ele. Cada frame de scroll recompõe tudo; sem a primeira causa
  o custo é tolerável, com ela vira tile-dropping.

## Gambiarras removidas (todas não commitadas, empilhadas na tentativa de corrigir)
| Gambiarra | Problema |
|---|---|
| `content-visibility` em `section[id]` | **Causa raiz** (acima) |
| `isPageScrolling()` pausando `requestAnimationFrame` dos shaders | Fundo congela durante scroll e "pula" ao parar (120 ms) → flicker |
| `dpr = 1.0` / `setPixelRatio(1.0)` nos shaders | Fundo pixelado/borrado em Retina |
| `transform: translateZ(0)` em todas as classes `glass-*` | Uma camada composta por card + backdrop-filter → estouro de memória GPU |
| `<main>` aninhado em `page.tsx` | HTML inválido (layout já tem `<main>`) — corrigido para `<div>` |
| `id` duplicado no `<div>` e na `<section>` (`publicacoes`, `sobre`, `contato`) | `getElementById` ambíguo — mantido só na `<section>` |

Mantido: redução dos raios de `backdrop-filter` (32–36px → 14–20px), que baixa custo
sem alterar a identidade visual; e a troca do 2º `LiquidChrome` na CTA final por um
gradiente CSS (menos 1 contexto WebGL).

## Regras para não acontecer de novo
1. **Nunca** usar `content-visibility`/`contain-intrinsic-size` em seções de altura variável.
   Se for indispensável, medir a altura real e usar `contain-intrinsic-size: auto <altura>`
   num bloco filho de altura estável (ex.: cards de lista).
2. **Nunca** pausar/ligar renderização com base em evento de scroll. Pausa só por
   `IntersectionObserver` (fora da tela) e `document.hidden`.
3. Máximo **1 shader WebGL fixo global**; shaders locais só dentro do hero e sempre com
   `IntersectionObserver`. Não criar novo contexto por seção.
4. DPR de shader: `Math.min(devicePixelRatio, 1.5)`. Nunca fixar em 1.
5. Sem `translateZ(0)`/`will-change` em classes reutilizáveis de vidro. `will-change`
   apenas em elementos animados contínuos (orbes do fundo).
6. `backdrop-filter` ≤ 20px; evitar aninhar elementos com backdrop-filter.
7. Ids de âncora únicos, apenas na `<section>`. Uma única tag `<main>` (no `layout.tsx`).

## Verificação
- `npm test` inclui `tests/visual_stability.test.mjs`, que falha se qualquer padrão
  proibido voltar.
- Manual: Chrome DevTools → Rendering → *Frame rendering stats* + *Layout shift regions*;
  rolar `/` de cima a baixo com `End`/`Home` repetidos e arrastando a scrollbar. CLS ≈ 0
  e nenhuma região em branco.


---

# Fase 2 — Investigação completa da fonte (instabilidade residual)

Após a fase 1 o usuário reportou: "menos perceptível, mas ainda existe". Medimos em vez
de supor (Brave real, janela visível, DPR 2, roda do mouse em rajadas de 700px, 3x
descendo/subindo; métricas: tempo de quadro, CLS, altura do documento). Script de
referência: `scripts/perf/scroll-probe.mjs`.

## Causas encontradas (em ordem de impacto)

### 1. O servidor de desenvolvimento servia CSS ANTIGO (causa de "a correção não pegou")
`.next` manteve `layout.css` com `content-visibility: auto` mesmo depois de a regra sair
do `globals.css`. Evidência: `contato` media 792px→1082px e o documento crescia
5474→5763px durante o scroll (CLS 0,14). Com o servidor reiniciado e `.next` limpo:
CLS 0 e altura estável. O hot-reload de **CSS** não é confiável neste projeto
(Next 15 + Tailwind v4): alterações em JS/TSX recarregam, CSS não.
**Regra:** após editar `globals.css`, rode `rm -rf .next` e reinicie `npm run dev`; para
validar, confira o CSS servido: `curl -s localhost:3000/_next/static/css/app/layout.css | grep <trecho>`.

### 2. `backdrop-filter` sobre fundo animado (causa dominante da instabilidade residual)
87 elementos tinham `backdrop-filter` (36 pílulas/badges com `blur(24px)`, 17 painéis
`glass-crystal`, 6 cards, footer/navbar `blur(64px)`...). O fundo global é `fixed` e
animado (shader WebGL + orbes CSS), então CADA elemento re-desfoca o fundo a cada
quadro durante o scroll.

Isolamento (variante → p99 / quadros >100ms): baseline 282ms/44 · sem canvases 266ms/22 ·
sem GIF 267ms/41 · sem animações CSS 183ms/17 · **sem backdrop-filter 83ms/2** ·
sem backdrop+canvas+animações 50ms/0. O GIF do hero, os shaders e as animações CSS são
contribuintes menores; o `backdrop-filter` responde por ~70% do problema.

Correção: removido de todas as classes `glass-*` compartilhadas e dos utilitários
`backdrop-blur-*` em componentes sempre visíveis (Navbar, Footer, seções, pílulas,
`Badge`, `Button`, `GlassCard`). A perda de "vidro" é imperceptível porque o que está
atrás já é um gradiente muito desfocado; compensado com fundo ~10–15% mais opaco.
Opt-in `.glass-frosted` para overlays/modais montados sob demanda.

### 3. Shader RippleGrid não compilava (erro a cada quadro)
`fwidth()` em GLSL ES 1.00 sem extensão: `'fwidth' : no matching overloaded function` +
`useProgram: program not valid` no console durante toda a sessão. Corrigido com largura de
pixel analítica (`gridSize * 2.0 / iResolution.y`), sem derivadas — funciona em
WebGL1/2. (`GridScanShader` usa three.js, que converte para GLSL 3.00 — não afetado.)

## Contribuintes menores (não corrigidos, documentados)
- 6 contextos WebGL simultâneos, alguns do tamanho da seção inteira (até 1434×1432 CSS ×
  DPR 1.5) com `mix-blend-screen`: custam ~15ms no p99 (65→50ms sem canvases).
  Candidato futuro: um único shader fixo global, remover os de seção.
- `hero_landscape.gif`: 240×360px esticado para tela cheia com `filter: brightness/contrast`
  em imagem animada (54 quadros, 3,3MB). Impacto pequeno medido; substituir por
  vídeo/WebP animado em resolução real quando houver asset.
- Um quadro isolado de ~400ms no início do scroll (decodificação de imagens/primeiro
  rasterize) — não recorrente.

## Regras adicionais (somam às 7 da fase 1)
8. **Nunca** `backdrop-filter`/`backdrop-blur-*` em elemento sempre visível ou repetido.
   Só `.glass-frosted` em overlay/modal. Teste automatizado bloqueia.
9. **Nunca** `fwidth`/`dFdx`/`dFdy` em shader OGL GLSL 1.00. Use cálculo analítico ou
   `#version 300 es`.
10. Console de WebGL deve ficar **vazio**: erro de shader a cada quadro é regressão.
11. Reiniciar o dev server com `.next` limpo após mudar CSS global — e verificar o CSS servido.
12. Medir antes de "otimizar": rodar `scripts/perf/scroll-probe.mjs`; meta p99 ≤ 70ms,
    quadros >100ms ≤ 2, CLS = 0.

## Resultado medido

| Métrica (scroll rápido, Brave, DPR 2) | Antes | Depois |
|---|---|---|
| p99 tempo de quadro | 282 ms | 65 ms |
| Quadros > 100 ms | 44 | 1 |
| Quadros > 50 ms | 56 | 10 |
| CLS | 0,14 (com CSS stale) | 0 |
| Elementos com backdrop-filter | 87 | 3 |
| Erros WebGL no console | 3 | 0 |

### 13. Conflito entre `next build` e `next dev` (Falso "Layout quebrado")
Nunca execute `next build` (ou `npm run build`) com o processo `next dev` ativo na mesma pasta sem limpar o cache depois. O build de produção sobrescreve o manifesto de chunks no `.next`, fazendo o `next dev` perder a referência do bundle de CSS e servir temporariamente o HTML cru (fundo branco, links azuis/roxos).
Caso ocorra: pare o servidor, rode `rm -rf .next` e inicie `npm run dev` novamente.
