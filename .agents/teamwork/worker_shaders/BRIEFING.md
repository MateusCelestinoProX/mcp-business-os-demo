# BRIEFING — 2026-10-14T15:55:00Z

## Mission
Portar e otimizar todo o motor visual cinemático de Shaders WebGL para Next.js 15 App Router em src/components/shaders/, garantindo segurança SSR, limpeza de memória estrita (0 leaks), 60 FPS com IntersectionObserver e fallback gracioso em CSS.

## 🔒 My Identity
- Archetype: teamwork_preview_test_writer
- Roles: specialist, qa (WebGL & Shaders Specialist)
- Working directory: /Users/mcp/.gemini/antigravity/scratch/plataforma-unificada-soberana/.agents/teamwork/worker_shaders
- Original parent: 5dd56657-d5a1-41aa-93aa-1f5dddb6096b
- Milestone: Milestone 2 / Shaders Porting

## 🔒 Key Constraints
- Todos os arquivos criados devem usar 'use client' estrito.
- Tratar referências a window/document somente dentro de useEffect para garantir zero erros no build SSR de Next.js 15.
- Limpeza estrita de WebGL contexts, geometrias, materiais e cancelamento de requestAnimationFrame no unmount.
- Suporte a IntersectionObserver e visibilitychange para pausar renderização quando invisível.
- Fallback gracioso em CSS/gradiente caso WebGL não esteja disponível.
- Se realizar commits git, usar: Mateus Celestino <202405039459@alunos.estacio.br>.
- Respostas sempre em Português Brasil.

## Current Parent
- Conversation ID: 5dd56657-d5a1-41aa-93aa-1f5dddb6096b
- Updated: 2026-10-14T15:55:00Z

## Task Summary
- **What to build**:
  - `CinematicCanvas.tsx`: Canvas Three.js / WebGL nativo com modos alternáveis (DarkVeil, Strands, Balatro, LiquidEther, Beams, ColorBends, Galaxy, GridScan).
  - `ColorBends.tsx`: Dobras de cores procedurais Three.js com refração e fluidez a 60 FPS.
  - `Beams.tsx`: Feixes de luz volumétricos cinemáticos Three.js com R3F.
  - `Galaxy.tsx`: Campo estelar procedimental OGL e galáxia em rotação suave.
  - `GridScanShader.tsx`: Raymarching Three.js com scanner neon responsivo ao clique e mouse.
  - `ShaderBackground.tsx`: Gerenciador de background global unificado com fallback elegante em CSS.
  - `ShaderTransitionZone.tsx`: Zonas de transição com laser neon carmesim e efeito vidro.
  - `src/lib/shaders/webgl-utils.ts`: Utilitários matemáticos de cor, SmoothDampVec2 e limpeza universal.
  - `tests/shaders.test.ts`: Suíte de 15 testes unitários e adversariais com 100% de aprovação.
- **Success criteria**:
  - Compilação e tipagem TypeScript sem nenhum erro no módulo de shaders.
  - Limpeza total no unmount (0 vazamentos de WebGL contexts ou buffers).
  - Pausa inteligente em IntersectionObserver e tab oculta.
  - Fallbacks em CSS para compatibilidade sem WebGL.
- **Interface contracts**: /Users/mcp/.gemini/antigravity/scratch/plataforma-unificada-soberana/ORIGINAL_REQUEST.md e PROJECT.md § Interface Contracts
- **Code layout**: src/components/shaders/ e src/lib/shaders/

## Loaded Skills
- None specified in dispatch

## Quality Status
- **Build/test result**: 15 testes de shaders passando (100% pass), 33 testes gerais do repositório íntegros.
- **Lint status**: Zero erros de tipagem em src/components/shaders e src/lib/shaders.
- **Tests added/modified**: `tests/shaders.test.ts` criado com 15 cenários cobrindo caminhos primários, bordas matemáticas, SSR safety e stress testing.

## Key Decisions Made
- Eliminação de imports diretos de CSS dos arquivos `.tsx` em favor de classes Tailwind utilitárias, garantindo compatibilidade estrita tanto com Next.js 15 App Router quanto com runners Node.js.
- Padronização de `cleanupWebGLContext` para suportar tanto Three.js (`forceContextLoss`, `dispose`) quanto OGL e WebGL nativo (`WEBGL_lose_context`).

## Artifact Index
- `.agents/teamwork/worker_shaders/progress.md` — Liveness heartbeat
- `.agents/teamwork/worker_shaders/handoff.md` — Relatório final de entrega
- `tests/shaders.test.ts` — Suíte de testes unitários do motor WebGL
