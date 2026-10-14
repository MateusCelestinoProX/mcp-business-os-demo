# DISPATCH — WebGL & Shaders Specialist (agent-shaders)

## Identidade e Função
- Archetype: teamwork_preview_test_writer
- Role: WebGL & Shaders Specialist
- Working directory: /Users/mcp/.gemini/antigravity/scratch/plataforma-unificada-soberana/.agents/teamwork/worker_shaders
- Parent Conversation ID: 5dd56657-d5a1-41aa-93aa-1f5dddb6096b

## MANDATORY INTEGRITY WARNING
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

## Documentos Mandatórios para Leitura
- /Users/mcp/.gemini/antigravity/scratch/plataforma-unificada-soberana/ORIGINAL_REQUEST.md
- /Users/mcp/.gemini/antigravity/scratch/plataforma-unificada-soberana/.agents/teamwork/explorer_survey_1/handoff.md
- /Users/mcp/.gemini/antigravity/scratch/plataforma-unificada-soberana/.agents/teamwork/explorer_survey_3/handoff.md

## Arquivos Exclusivos de Propriedade
- `/Users/mcp/.gemini/antigravity/scratch/plataforma-unificada-soberana/src/components/shaders/CinematicCanvas.tsx`
- `/Users/mcp/.gemini/antigravity/scratch/plataforma-unificada-soberana/src/components/shaders/ColorBends.tsx`
- `/Users/mcp/.gemini/antigravity/scratch/plataforma-unificada-soberana/src/components/shaders/Beams.tsx`
- `/Users/mcp/.gemini/antigravity/scratch/plataforma-unificada-soberana/src/components/shaders/Galaxy.tsx`
- `/Users/mcp/.gemini/antigravity/scratch/plataforma-unificada-soberana/src/components/shaders/ShaderBackground.tsx`
- `/Users/mcp/.gemini/antigravity/scratch/plataforma-unificada-soberana/src/components/shaders/ShaderTransitionZone.tsx`
- `/Users/mcp/.gemini/antigravity/scratch/plataforma-unificada-soberana/src/lib/shaders/*`

## Fontes Originais para Portabilidade
- `/Users/mcp/.gemini/antigravity/scratch/mateus-celestino-pro-x/src/components/shaders/` (`GridScanShader.jsx`, `RippleGridShader.jsx`, `LightningShader.jsx`, `BalatroShader.jsx`, `FaultyTerminalShader.jsx`, `ShaderTransitionZone.jsx`)
- `/Users/mcp/.gemini/antigravity/scratch/form-builder-saas/app/components/` (`CinematicCanvas.tsx`, `ColorBends.jsx`, `Beams.jsx`, `Galaxy.jsx`)

## Missão
1. Portar e consolidar os Shaders WebGL para Next.js 15 App Router:
   - Todos os componentes DEVEM ter a diretiva `'use client';` no topo.
   - Tratar referências a `window` e `document` apenas dentro de `useEffect` para evitar erros de SSR no `npm run build`.
   - Limpeza estrita de WebGL contexts, geometrias, materiais e cancelamento de `requestAnimationFrame` no unmount (0 vazamentos de memória).
   - Suporte a `IntersectionObserver` e `visibilitychange` para pausar animações quando fora de vista, garantindo 60 FPS consistentes.
   - Implementar fallback gracioso em CSS/Gradiente caso WebGL não esteja disponível no cliente.
2. Criar `ShaderBackground.tsx`:
   - Componente unificado que pode ser colocado em segundo plano (fixed/absolute, pointer-events-none, z-0) com modos alternáveis ('galaxy', 'beams', 'colorbends', 'gridscan').
3. Testar a compilação e sintaxe TypeScript dos componentes criados.
4. Entregar `handoff.md` com evidências de código e comandos executados.


## 2026-10-14T15:36:27Z
Mensagem recebida do orquestrador (5dd56657-d5a1-41aa-93aa-1f5dddb6096b):
Missão específica:
Portar e otimizar todo o motor visual cinemático de Shaders WebGL para Next.js 15 App Router em /Users/mcp/.gemini/antigravity/scratch/plataforma-unificada-soberana/src/components/shaders/:
1. Criar:
   - `CinematicCanvas.tsx`: Canvas Three.js / OGL com 'use client' estrito e dynamic SSR safety.
   - `ColorBends.tsx`: Dobras de cores com refração e fluidez a 60 FPS.
   - `Beams.tsx`: Feixes de luz volumétricos cinemáticos.
   - `Galaxy.tsx`: Campo estelar e galáxia em rotação suave.
   - `ShaderBackground.tsx`: Gerenciador de background global unificado com fallback elegante em CSS/gradiente caso WebGL não esteja disponível no cliente.
   - `ShaderTransitionZone.tsx`: Zonas de transição com laser e efeitos de borda.
2. Garantir isolamento contra SSR (evitar erros de window/document no build) e limpeza rigorosa de geometrias, materiais e cancelamento de `requestAnimationFrame` no desmonte para evitar memory leaks.
3. Se realizar commits git, use: `Mateus Celestino <202405039459@alunos.estacio.br>`.
4. Registrar progresso em `progress.md` e entregar `handoff.md`. Ao concluir, avise o parent.
