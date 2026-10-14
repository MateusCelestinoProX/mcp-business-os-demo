# DISPATCH — Lead Frontend & Glassmorphism Architect (agent-foundations)

## Identidade e Função
- Archetype: teamwork_preview_test_writer
- Role: Lead Frontend & Glassmorphism Architect
- Working directory: /Users/mcp/.gemini/antigravity/scratch/plataforma-unificada-soberana/.agents/teamwork/worker_foundations
- Parent Conversation ID: 5dd56657-d5a1-41aa-93aa-1f5dddb6096b

## MANDATORY INTEGRITY WARNING
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

## Documentos Mandatórios para Leitura
- /Users/mcp/.gemini/antigravity/scratch/plataforma-unificada-soberana/ORIGINAL_REQUEST.md
- /Users/mcp/.gemini/antigravity/scratch/plataforma-unificada-soberana/.agents/teamwork/orchestrator_1/DISPATCH.md

## Arquivos Exclusivos de Propriedade
- `/Users/mcp/.gemini/antigravity/scratch/plataforma-unificada-soberana/package.json`
- `/Users/mcp/.gemini/antigravity/scratch/plataforma-unificada-soberana/tsconfig.json`
- `/Users/mcp/.gemini/antigravity/scratch/plataforma-unificada-soberana/next.config.ts`
- `/Users/mcp/.gemini/antigravity/scratch/plataforma-unificada-soberana/postcss.config.mjs`
- `/Users/mcp/.gemini/antigravity/scratch/plataforma-unificada-soberana/tailwind.config.ts`
- `/Users/mcp/.gemini/antigravity/scratch/plataforma-unificada-soberana/.env.example`
- `/Users/mcp/.gemini/antigravity/scratch/plataforma-unificada-soberana/.gitignore`
- `/Users/mcp/.gemini/antigravity/scratch/plataforma-unificada-soberana/src/app/layout.tsx`
- `/Users/mcp/.gemini/antigravity/scratch/plataforma-unificada-soberana/src/app/globals.css`
- `/Users/mcp/.gemini/antigravity/scratch/plataforma-unificada-soberana/src/components/layout/Navbar.tsx`
- `/Users/mcp/.gemini/antigravity/scratch/plataforma-unificada-soberana/src/components/layout/Footer.tsx`
- `/Users/mcp/.gemini/antigravity/scratch/plataforma-unificada-soberana/src/components/ui/GlassCard.tsx`
- `/Users/mcp/.gemini/antigravity/scratch/plataforma-unificada-soberana/src/components/ui/Button.tsx`
- `/Users/mcp/.gemini/antigravity/scratch/plataforma-unificada-soberana/src/components/ui/Badge.tsx`
- `/Users/mcp/.gemini/antigravity/scratch/plataforma-unificada-soberana/src/components/ui/Input.tsx`
- `/Users/mcp/.gemini/antigravity/scratch/plataforma-unificada-soberana/src/lib/utils.ts`

## Missão
1. Inicializar a base do projeto em `/Users/mcp/.gemini/antigravity/scratch/plataforma-unificada-soberana`:
   - package.json completo com scripts (dev, build, start, db:push), unificando dependências: next@15, react@19, react-dom@19, typescript, tailwindcss, postcss, autoprefixer, three, @types/three, @react-three/fiber, three-stdlib, ogl, drizzle-orm, drizzle-kit, @neondatabase/serverless, pg, @types/pg, lucide-react, clsx, tailwind-merge, framer-motion, jose, bcryptjs, @types/bcryptjs.
   - tsconfig.json com alias @/* -> ./src/*
   - next.config.ts configurado para Next.js 15
   - tailwind.config.ts e postcss.config.mjs
   - .env.example e .gitignore
2. Executar `npm install` no diretório do projeto.
3. Implementar Shell Soberano:
   - src/app/globals.css com design dark glassmorphism premium (#0a0a0c, bordas sutis com backdrop-blur, paleta oficial Mateus Celestino Pro).
   - src/app/layout.tsx com Navbar e Footer soberanos.
   - src/components/layout/Navbar.tsx conectando:
     * Portal (/)
     * Comunidade (/comunidade)
     * Construtor (/builder)
     * Biblioteca (/biblioteca)
     Com indicador de rota ativa, badge de status de conexão e visual de vidro escuro cinemático.
   - src/components/layout/Footer.tsx
   - src/components/ui/GlassCard.tsx, Button.tsx, Badge.tsx, Input.tsx e src/lib/utils.ts (cn).
4. Validar e entregar `handoff.md` com status de execução.


## 2026-10-14T15:36:27Z
Você é o Lead Frontend & Glassmorphism Architect (agent-foundations).
Seu diretório de trabalho dedicado é: /Users/mcp/.gemini/antigravity/scratch/plataforma-unificada-soberana/.agents/teamwork/worker_foundations
LEIA OBRIGATORIAMENTE:
- /Users/mcp/.gemini/antigravity/scratch/plataforma-unificada-soberana/ORIGINAL_REQUEST.md
- /Users/mcp/.gemini/antigravity/scratch/plataforma-unificada-soberana/.agents/teamwork/worker_foundations/DISPATCH.md
- /Users/mcp/.gemini/antigravity/scratch/plataforma-unificada-soberana/.agents/teamwork/explorer_survey_3/handoff.md

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Sua missão específica:
Construir e consolidar as fundações da Plataforma Unificada em /Users/mcp/.gemini/antigravity/scratch/plataforma-unificada-soberana:
1. Criar `package.json` completo e unificado com scripts (dev, build, start, db:push), unificando as dependências de todos os 4 ecossistemas (Next 15, React 19, Tailwind CSS, Three.js, @react-three/fiber, three-stdlib, ogl, drizzle-orm, @neondatabase/serverless, pg, lucide-react, clsx, tailwind-merge, framer-motion, jose, bcryptjs).
2. Criar `tsconfig.json` (com paths @/* apontando para ./src/*), `next.config.ts`, `postcss.config.mjs`, `tailwind.config.ts`, `.env.example`, `.gitignore`.
3. Executar `npm install` no diretório raiz do projeto para instalar as dependências.
4. Implementar o Shell Soberano:
   - `src/app/globals.css`: Design System Glassmorphism Dark Premium oficial de Mateus Celestino Pro (#0a0a0c, neon accents #6366f1, #a855f7, #ff073a, efeitos de vidro com backdrop-blur e bordas translúcidas).
   - `src/app/layout.tsx`: Layout raiz com metadata oficial, fontes e Navbar soberana unificada.
   - `src/components/layout/Navbar.tsx`: Navbar fluida conectando Portal (/), Comunidade (/comunidade), Construtor (/builder) e Biblioteca (/biblioteca), status de conexão e visual de vidro.
   - `src/components/layout/Footer.tsx`: Rodapé com branding oficial de Mateus Celestino Pro.
   - Componentes UI base: `src/components/ui/GlassCard.tsx`, `Button.tsx`, `Badge.tsx`, `Input.tsx` e `src/lib/utils.ts`.
5. Se realizar commits git, use: `Mateus Celestino <202405039459@alunos.estacio.br>`.
6. Validar que os arquivos foram criados, registrar seu progresso em `progress.md` e entregar seu `handoff.md`. Ao concluir, avise o parent.
