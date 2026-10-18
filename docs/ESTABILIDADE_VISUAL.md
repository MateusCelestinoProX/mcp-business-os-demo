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
