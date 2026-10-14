# BRIEFING — 2026-10-14T15:40:00Z

## Mission
Construir o Construtor Cinemático de Formulários (Form Builder SaaS) integrado em Next.js 15 App Router com suporte a múltiplos campos, Live Preview interativo, renderizador FormRunner cinemático com etapas/validação, rotas de API conectadas ao Drizzle ORM e integração com notificações Notion / Resend.

## 🔒 My Identity
- Archetype: Form Builder SaaS Specialist (agent-builder)
- Roles: specialist, qa
- Working directory: /Users/mcp/.gemini/antigravity/scratch/plataforma-unificada-soberana/.agents/teamwork/worker_builder
- Original parent: 5dd56657-d5a1-41aa-93aa-1f5dddb6096b
- Milestone: Construtor Cinemático de Formulários

## 🔒 Key Constraints
- Arquivos de propriedade exclusiva:
  - `src/app/builder/page.tsx`
  - `src/app/builder/f/[id]/page.tsx`
  - `src/app/builder/dashboard/page.tsx`
  - `src/components/builder/FormCanvas.tsx`
  - `src/components/builder/FieldPalette.tsx`
  - `src/components/builder/LivePreview.tsx`
  - `src/components/builder/FormRunner.tsx`
  - `src/app/api/forms/route.ts`
  - `src/app/api/forms/[id]/route.ts`
  - `src/app/api/forms/submit/route.ts`
- Respeitar estritamente a identidade Git: `Mateus Celestino <202405039459@alunos.estacio.br>`
- Todas as respostas e documentação em Português Brasil
- Sem implementações falsas ou facades; integração robusta com fallback gracioso para DB local
- Manter design cinemático dark glass oficial com Tailwind CSS

## Current Parent
- Conversation ID: 5dd56657-d5a1-41aa-93aa-1f5dddb6096b
- Updated: 2026-10-14T15:40:00Z

## Task Summary
- **What to build**: Construtor Cinemático de Formulários multi-step com Live Preview, página pública do formulário, dashboard de métricas e submissões, e APIs REST conectadas ao Drizzle ORM com envio assíncrono para Notion e Resend.
- **Success criteria**: Todas as páginas e rotas compilam sem erros de tipagem, suportam múltiplos tipos de campo (texto, email, telefone, múltipla escolha, escala 1-10, NPS, textarea), reordenação, validação em tempo real e persistência.
- **Interface contracts**: PROJECT.md / ORIGINAL_REQUEST.md / DISPATCH.md
- **Code layout**: `src/app/builder/`, `src/components/builder/`, `src/app/api/forms/`

## Loaded Skills
- **Source**: N/A
- **Local copy**: N/A
- **Core methodology**: Design cinemático com Next.js 15 App Router, React 19, Tailwind CSS e Drizzle ORM

## Quality Status
- **Build/test result**: Inicializando implementação
- **Lint status**: Pendente
- **Tests added/modified**: Testes de validação de formulário e submissões planejados

## Key Decisions Made
- Implementar suporte completo a tipos de campo: `text`, `email`, `phone`, `select`, `scale`, `nps`, `textarea`.
- Suporte a formulário em modo etapas (multi-step wizard) ou modo contínuo (scroll).
- FormRunner com feedback instantâneo de validação, barra de progresso fluida e visual dark glass.
- Fallback gracioso em rotas de API para garantir funcionamento mesmo se o banco de dados estiver desconectado em testes locais.

## Artifact Index
- `src/app/builder/page.tsx` — Construtor visual cinemático
- `src/app/builder/f/[id]/page.tsx` — Página de resposta pública
- `src/app/builder/dashboard/page.tsx` — Painel de métricas e formulários
- `src/components/builder/FormCanvas.tsx` — Canvas de edição e ordenação
- `src/components/builder/FieldPalette.tsx` — Paleta de campos adicionáveis
- `src/components/builder/LivePreview.tsx` — Preview em tempo real
- `src/components/builder/FormRunner.tsx` — Executor interativo multi-step
- `src/app/api/forms/route.ts` — Listagem e criação de formulários
- `src/app/api/forms/[id]/route.ts` — CRUD de formulário por ID
- `src/app/api/forms/submit/route.ts` — Submissão com gravação e notificações
