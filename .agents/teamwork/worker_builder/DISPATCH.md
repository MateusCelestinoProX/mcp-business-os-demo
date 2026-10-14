# DISPATCH — Form Builder SaaS Specialist (agent-builder)

## Identidade e Função
- Archetype: teamwork_preview_test_writer
- Role: Form Builder Specialist
- Working directory: /Users/mcp/.gemini/antigravity/scratch/plataforma-unificada-soberana/.agents/teamwork/worker_builder
- Parent Conversation ID: 5dd56657-d5a1-41aa-93aa-1f5dddb6096b

## MANDATORY INTEGRITY WARNING
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

## Documentos Mandatórios para Leitura
- /Users/mcp/.gemini/antigravity/scratch/plataforma-unificada-soberana/ORIGINAL_REQUEST.md
- /Users/mcp/.gemini/antigravity/scratch/plataforma-unificada-soberana/.agents/teamwork/explorer_survey_3/handoff.md

## Arquivos Exclusivos de Propriedade
- `/Users/mcp/.gemini/antigravity/scratch/plataforma-unificada-soberana/src/app/builder/page.tsx`
- `/Users/mcp/.gemini/antigravity/scratch/plataforma-unificada-soberana/src/app/builder/f/[id]/page.tsx`
- `/Users/mcp/.gemini/antigravity/scratch/plataforma-unificada-soberana/src/app/builder/dashboard/page.tsx`
- `/Users/mcp/.gemini/antigravity/scratch/plataforma-unificada-soberana/src/components/builder/FormCanvas.tsx`
- `/Users/mcp/.gemini/antigravity/scratch/plataforma-unificada-soberana/src/components/builder/FieldPalette.tsx`
- `/Users/mcp/.gemini/antigravity/scratch/plataforma-unificada-soberana/src/components/builder/LivePreview.tsx`
- `/Users/mcp/.gemini/antigravity/scratch/plataforma-unificada-soberana/src/components/builder/FormRunner.tsx`
- `/Users/mcp/.gemini/antigravity/scratch/plataforma-unificada-soberana/src/app/api/forms/route.ts`
- `/Users/mcp/.gemini/antigravity/scratch/plataforma-unificada-soberana/src/app/api/forms/[id]/route.ts`
- `/Users/mcp/.gemini/antigravity/scratch/plataforma-unificada-soberana/src/app/api/forms/submit/route.ts`

## Fontes Originais para Portabilidade
- `/Users/mcp/.gemini/antigravity/scratch/form-builder-saas/` (`app/page.tsx`, `app/components/`, `app/api/submit-form/route.ts`)

## Missão
1. Implementar o Construtor Cinemático de Formulários em `src/app/builder/`:
   - `page.tsx`: Interface completa de edição com paleta de campos (texto, email, telefone, múltipla escolha, escala de 1 a 10, NPS, textarea), reordenação e configuração de propriedades (título, placeholder, obrigatório).
   - Painel de `LivePreview.tsx`: Simulador instantâneo com alternância de visão desktop e mobile.
   - `f/[id]/page.tsx`: Rota pública de exibição de formulário responsiva com tema dark glass cinemático para respondentes.
   - `dashboard/page.tsx`: Visão geral dos formulários criados, total de respostas coletadas e botão para gerar novo link.
2. Criar os componentes interativos em `src/components/builder/`:
   - `FormCanvas.tsx`: Painel central onde os campos são dispostos e editados.
   - `FieldPalette.tsx`: Lista de blocos de campos adicionáveis com 1 clique.
   - `LivePreview.tsx`: Preview em tempo real sincronizado com o estado do formulário.
   - `FormRunner.tsx`: Executor dinâmico do formulário para o usuário final com barra de progresso por etapas.
3. Implementar as Rotas de API:
   - `/api/forms`: Listagem e criação de novos formulários gravando na tabela `forms` do Drizzle ORM.
   - `/api/forms/[id]`: Leitura, atualização do `schema_json` e remoção.
   - `/api/forms/submit`: Recebimento das respostas, gravação em `form_submissions` e despacho assíncrono de notificações (Resend / Notion API caso as chaves estejam configuradas em `.env`).
4. Validar e entregar `handoff.md`.


## 2026-10-14T15:36:27Z
Você é o Form Builder SaaS Specialist (agent-builder).
Seu diretório de trabalho dedicado é: /Users/mcp/.gemini/antigravity/scratch/plataforma-unificada-soberana/.agents/teamwork/worker_builder
LEIA OBRIGATORIAMENTE:
- /Users/mcp/.gemini/antigravity/scratch/plataforma-unificada-soberana/ORIGINAL_REQUEST.md
- /Users/mcp/.gemini/antigravity/scratch/plataforma-unificada-soberana/.agents/teamwork/worker_builder/DISPATCH.md
- /Users/mcp/.gemini/antigravity/scratch/plataforma-unificada-soberana/.agents/teamwork/explorer_survey_3/handoff.md

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Sua missão específica:
Implementar o Construtor Cinemático de Formulários em Next.js 15 App Router em /Users/mcp/.gemini/antigravity/scratch/plataforma-unificada-soberana:
1. Páginas em `src/app/builder/`:
   - `page.tsx`: Editor visual cinemático com suporte a múltiplos tipos de campo (texto, email, telefone, múltipla escolha, escala de 1 a 10, NPS, textarea), reordenação e configuração de propriedades (título, placeholder, obrigatório), com Live Preview interativo em tempo real.
   - `f/[id]/page.tsx`: Rota pública de exibição de formulário responsiva com tema dark glass cinemático para respondentes finais.
   - `dashboard/page.tsx`: Painel de formulários criados, total de respostas coletadas e ações de copiar link/editar.
2. Componentes dedicados em `src/components/builder/`:
   - `FormCanvas.tsx`: Painel central onde os campos são dispostos e editados.
   - `FieldPalette.tsx`: Lista de blocos de campos adicionáveis com 1 clique.
   - `LivePreview.tsx`: Preview em tempo real sincronizado com o formulário em edição.
   - `FormRunner.tsx`: Executor dinâmico do formulário para o usuário final com barra de progresso por etapas e validação instantânea.
3. Rotas de API:
   - `src/app/api/forms/route.ts`: Listagem e criação de novos formulários gravando na tabela `forms` do Drizzle ORM.
   - `src/app/api/forms/[id]/route.ts`: Leitura, atualização do `schema_json` e remoção.
   - `src/app/api/forms/submit/route.ts`: Recebimento das respostas dos respondentes, gravação em `form_submissions` e disparo assíncrono de notificações (Resend / Notion API caso as chaves estejam configuradas).
4. Se realizar commits git, use: `Mateus Celestino <202405039459@alunos.estacio.br>`.
5. Registrar progresso em `progress.md` e entregar `handoff.md`. Ao concluir, avise o parent.
