# Graph Report - plataforma-unificada-soberana  (2026-10-14)

## Corpus Check
- 185 files · ~4,868,765 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1081 nodes · 1888 edges · 94 communities (63 shown, 25 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 34 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `99c3ff72`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Relatório de Survey Técnico — Explorer 2
- 3. Investigação Detalhada: Projeto 4 — Biblioteca Oculta de Recursos (`s-a-a-s-full-hidden-library`)
- 🏛️ RELATÓRIO TÉCNICO DE SURVEY — EXPLORER 3
- Original User Request
- BRIEFING — 2026-10-14T15:46:45Z
- Requirements
- BRIEFING — 2026-10-14T15:37:00Z
- BRIEFING — 2026-10-14T15:49:30Z
- BRIEFING — 2026-10-14T15:45:30Z
- BRIEFING — 2026-10-14T15:37:00Z
- BRIEFING — 2026-10-14T15:55:00Z
- BRIEFING — 2026-10-14T15:51:00Z
- Project: Plataforma Unificada Soberana — Mateus Celestino Pro
- BRIEFING — 2026-10-14T15:40:00Z
- BRIEFING — 2026-10-14T15:37:00Z
- BRIEFING — 2026-10-14T15:33:00Z
- DISPATCH — WebGL & Shaders Specialist (agent-shaders)
- DISPATCH — Form Builder SaaS Specialist (agent-builder)
- DISPATCH — Database Architect & Drizzle Master (agent-database)
- DISPATCH — Lead Frontend & Glassmorphism Architect (agent-foundations)
- DISPATCH — Growth Engineer & Portal Institucional Specialist (agent-marketing)
- DISPATCH — Members Area & Community Engineer (agent-members)
- Relatório de Handoff — Explorer Survey 1
- Handoff Report — Explorer 2 (Survey Phase)
- Relatório de Handoff — Explorer 3 (Fase de Survey)
- Progress Heartbeat — Database Architect (agent-database)
- Progress Tracker - Explorer Survey 1
- Progresso - Explorer 2 (Survey: Área de Membros/Comunidade & Form Builder)
- Progresso do Explorer 3 - Survey Arquitetural, Camada de Dados e Setup Next.js 15
- orchestrator_1/DISPATCH.md
- orchestrator_1/progress.md
- Progress — worker_foundations (agent-foundations)
- Progresso — Digital Assets & Vault Engineer (agent-library)
- Progress - WebGL & Shaders Specialist
- explorer_survey_1/DISPATCH.md
- explorer_survey_2/DISPATCH.md
- explorer_survey_3/DISPATCH.md
- GATE_STATUS.md
- worker_auditor/DISPATCH.md
- worker_auditor/progress.md
- worker_library/DISPATCH.md
- package.json
- dependencies
- compilerOptions
- catalog.ts
- lib/db/schema.ts
- comunidade/app.js
- src/db/schema.ts
- ShaderBackground.tsx
- BRIEFING — 2026-10-14T15:40:00Z
- BRIEFING — 2026-10-14T15:54:00Z
- BRIEFING — 2026-10-14T15:55:00Z
- route.ts
- Progress — Form Builder SaaS Specialist
- ResourceCard.tsx
- Progress — Growth Engineer & Portal Institucional Specialist
- Progress — Members Area & Community Engineer (agent-members)
- Badge.tsx
- types.ts
- Relatório de Handoff — WebGL & Shaders Specialist (agent-shaders)
- devDependencies
- Relatório de Handoff — Members Area & Community Engineer (agent-members)
- [slug]/page.tsx
- Relatório de Handoff — Lead Frontend & Glassmorphism Architect (agent-foundations)
- scripts
- library.test.mjs
- tailwindcss
- app/page.tsx
- Relatório de Handoff — Database Architect & Drizzle Master (agent-database)
- Navbar.tsx
- utils.ts
- Relatório de Handoff — Growth Engineer & Portal Institucional Specialist (agent-marketing)
- react
- auth.ts
- lib/db/index.ts
- leads/route.ts
- portal_restoration.test.ts
- api/checkout/route.ts
- comunidade/package.json
- builder/f/[id]/page.tsx
- builder.ts
- create-payment/route.ts
- send-email/route.ts
- biblioteca/route.ts
- comunidade/route.ts
- drizzle-kit
- 🚀 Guia Oficial de Deploy na Vercel & Auditoria de Segurança — A.I VISUALS
- vercel.json

## God Nodes (most connected - your core abstractions)
1. `react` - 63 edges
2. `lucide-react` - 46 edges
3. `cn()` - 34 edges
4. `setupEventListeners()` - 26 edges
5. `renderCurrentView()` - 25 edges
6. `Badge` - 22 edges
7. `GlassCard` - 20 edges
8. `Button` - 18 edges
9. `showToast()` - 16 edges
10. `compilerOptions` - 16 edges

## Surprising Connections (you probably didn't know these)
- `runTests()` --calls--> `POST()`  [EXTRACTED]
  tests/portal_marketing.test.ts → src/app/api/leads/route.ts
- `runTests()` --calls--> `GET()`  [EXTRACTED]
  tests/portal_marketing.test.ts → src/app/api/leads/route.ts
- `runSeed()` --calls--> `hashPassword()`  [EXTRACTED]
  src/lib/db/seed.ts → src/lib/auth/auth.ts
- `generateStaticParams()` --calls--> `getAllArticles()`  [EXTRACTED]
  src/app/artigos/[slug]/page.tsx → src/lib/articles.ts
- `generateStaticParams()` --calls--> `getAllResources()`  [EXTRACTED]
  src/app/biblioteca/[id]/page.tsx → src/lib/library/catalog.ts

## Import Cycles
- None detected.

## Communities (94 total, 25 thin omitted)

### Community 0 - "Relatório de Survey Técnico — Explorer 2"
Cohesion: 0.08
Nodes (24): 1. Sumário Executivo, 2.1 Visão Geral e Estrutura de Arquivos, 2.2 Autenticação, Sessões e Controle de Acesso (RBAC), 2.3 Catálogo de Mídias, Prompts e Vídeos, 2.4 Interação Social e Comunidade (`/comunidade`), 2.5 Módulo SERVERS (Cursos & Aulas), 2.6 Integração Mercado Pago Checkout Pro (`/api/create-payment`), 2. Projeto 2: Área de Membros & Comunidade Fechada (`visuals-app-saas`) (+16 more)

### Community 1 - "3. Investigação Detalhada: Projeto 4 — Biblioteca Oculta de Recursos (`s-a-a-s-full-hidden-library`)"
Cohesion: 0.09
Nodes (22): 1. Sumário Executivo, 2.1. Arquitetura e Stack Técnica, 2.2. Design System & Tokens Visuais (Apple Liquid Glassmorphism), 2.3. Os 5 Shaders WebGL do Personal OS, 2.4. Hub de Conteúdo & Artigos Dinâmicos, 2.5. Captura de Leads, Tráfego Pago & Endpoints de API, 2.6. Schema de Dados Existente (`schema.sql`), 2. Investigação Detalhada: Projeto 1 — Site Institucional com Shaders (`mateus-celestino-pro-x`) (+14 more)

### Community 2 - "🏛️ RELATÓRIO TÉCNICO DE SURVEY — EXPLORER 3"
Cohesion: 0.09
Nodes (21): 1.1. Inspeção do Diretório Alvo, 1.2. Regra Permanente de Identidade Git (Regra Obrigatória #4), 1. Diagnóstico do Diretório de Destino e Repositório, 2.1. Inventário dos 4 Ecossistemas de Origem, 2.2. Resolução de Conflitos e Harmonização, 2.3. Proposta do `package.json` Unificado, 2. Matriz de Convergência das Dependências dos 4 Ecossistemas, 3.1. Visão Geral da Modelagem (+13 more)

### Community 3 - "Original User Request"
Cohesion: 0.15
Nodes (12): 2026-10-14T15:20:14Z, 2026-10-14T15:24:54Z, Acceptance Criteria, Banco de Dados & APIs, Compilação, Build e Grafo, Interface & Performance, Original User Request, R1. Shell Unificado e Design System de Branding Software (+4 more)

### Community 4 - "BRIEFING — 2026-10-14T15:46:45Z"
Cohesion: 0.17
Nodes (11): Active Timers, Artifact Index, BRIEFING — 2026-10-14T15:46:45Z, Current Parent, 🔒 Key Constraints, Key Decisions Made, Mission, 🔒 My Identity (+3 more)

### Community 5 - "Requirements"
Cohesion: 0.17
Nodes (11): 2026-10-14T15:20:14Z, Acceptance Criteria, Banco de Dados & APIs, Compilação, Build e Grafo, Interface & Performance, Original User Request, R1. Shell Unificado e Design System de Branding Software, R2. Camada Unificada de Dados PostgreSQL & Drizzle ORM (+3 more)

### Community 6 - "BRIEFING — 2026-10-14T15:37:00Z"
Cohesion: 0.18
Nodes (10): Artifact Index, Attack Surface, BRIEFING — 2026-10-14T15:37:00Z, Current Parent, 🔒 Key Constraints, Key Decisions Made, Mission, 🔒 My Identity (+2 more)

### Community 7 - "BRIEFING — 2026-10-14T15:49:30Z"
Cohesion: 0.18
Nodes (10): Artifact Index, BRIEFING — 2026-10-14T15:49:30Z, Current Parent, 🔒 Key Constraints, Key Decisions Made, Loaded Skills, Mission, 🔒 My Identity (+2 more)

### Community 8 - "BRIEFING — 2026-10-14T15:45:30Z"
Cohesion: 0.18
Nodes (10): Artifact Index, BRIEFING — 2026-10-14T15:45:30Z, Current Parent, 🔒 Key Constraints, Key Decisions Made, Loaded Skills, Mission, 🔒 My Identity (+2 more)

### Community 9 - "BRIEFING — 2026-10-14T15:37:00Z"
Cohesion: 0.18
Nodes (10): Artifact Index, BRIEFING — 2026-10-14T15:37:00Z, Current Parent, 🔒 Key Constraints, Key Decisions Made, Loaded Skills, Mission, 🔒 My Identity (+2 more)

### Community 10 - "BRIEFING — 2026-10-14T15:55:00Z"
Cohesion: 0.18
Nodes (10): Artifact Index, BRIEFING — 2026-10-14T15:55:00Z, Current Parent, 🔒 Key Constraints, Key Decisions Made, Loaded Skills, Mission, 🔒 My Identity (+2 more)

### Community 11 - "BRIEFING — 2026-10-14T15:51:00Z"
Cohesion: 0.20
Nodes (9): Artifact Index, BRIEFING — 2026-10-14T15:51:00Z, 🔒 Key Constraints, Mission, 🔒 My Identity, Project Status, Routing Decision, User Context (+1 more)

### Community 12 - "Project: Plataforma Unificada Soberana — Mateus Celestino Pro"
Cohesion: 0.20
Nodes (9): 1. Camada de Dados Drizzle ORM (`src/lib/db/schema.ts`), 2. Endpoints de API REST / JSON, 3. Shaders WebGL (`src/components/shaders/ShaderBackground.tsx`), Architecture, Code Layout, Feature Inventory, Interface Contracts, Milestones (+1 more)

### Community 13 - "BRIEFING — 2026-10-14T15:40:00Z"
Cohesion: 0.22
Nodes (8): Artifact Index, BRIEFING — 2026-10-14T15:40:00Z, Current Parent, Investigation State, 🔒 Key Constraints, Key Decisions Made, Mission, 🔒 My Identity

### Community 14 - "BRIEFING — 2026-10-14T15:37:00Z"
Cohesion: 0.22
Nodes (8): Artifact Index, BRIEFING — 2026-10-14T15:37:00Z, Current Parent, Investigation State, 🔒 Key Constraints, Key Decisions Made, Mission, 🔒 My Identity

### Community 15 - "BRIEFING — 2026-10-14T15:33:00Z"
Cohesion: 0.22
Nodes (8): Artifact Index, BRIEFING — 2026-10-14T15:33:00Z, Current Parent, Investigation State, 🔒 Key Constraints, Key Decisions Made, Mission, 🔒 My Identity

### Community 16 - "DISPATCH — WebGL & Shaders Specialist (agent-shaders)"
Cohesion: 0.22
Nodes (8): 2026-10-14T15:36:27Z, Arquivos Exclusivos de Propriedade, DISPATCH — WebGL & Shaders Specialist (agent-shaders), Documentos Mandatórios para Leitura, Fontes Originais para Portabilidade, Identidade e Função, MANDATORY INTEGRITY WARNING, Missão

### Community 17 - "DISPATCH — Form Builder SaaS Specialist (agent-builder)"
Cohesion: 0.22
Nodes (8): 2026-10-14T15:36:27Z, Arquivos Exclusivos de Propriedade, DISPATCH — Form Builder SaaS Specialist (agent-builder), Documentos Mandatórios para Leitura, Fontes Originais para Portabilidade, Identidade e Função, MANDATORY INTEGRITY WARNING, Missão

### Community 18 - "DISPATCH — Database Architect & Drizzle Master (agent-database)"
Cohesion: 0.25
Nodes (7): 2026-10-14T15:36:27Z, Arquivos Exclusivos de Propriedade, DISPATCH — Database Architect & Drizzle Master (agent-database), Documentos Mandatórios para Leitura, Identidade e Função, MANDATORY INTEGRITY WARNING, Missão

### Community 19 - "DISPATCH — Lead Frontend & Glassmorphism Architect (agent-foundations)"
Cohesion: 0.25
Nodes (7): 2026-10-14T15:36:27Z, Arquivos Exclusivos de Propriedade, DISPATCH — Lead Frontend & Glassmorphism Architect (agent-foundations), Documentos Mandatórios para Leitura, Identidade e Função, MANDATORY INTEGRITY WARNING, Missão

### Community 20 - "DISPATCH — Growth Engineer & Portal Institucional Specialist (agent-marketing)"
Cohesion: 0.22
Nodes (8): 2026-10-14T15:36:27Z, Arquivos Exclusivos de Propriedade, DISPATCH — Growth Engineer & Portal Institucional Specialist (agent-marketing), Documentos Mandatórios para Leitura, Fontes Originais para Portabilidade, Identidade e Função, MANDATORY INTEGRITY WARNING, Missão

### Community 21 - "DISPATCH — Members Area & Community Engineer (agent-members)"
Cohesion: 0.22
Nodes (8): 2026-10-14T15:36:27Z, Arquivos Exclusivos de Propriedade, DISPATCH — Members Area & Community Engineer (agent-members), Documentos Mandatórios para Leitura, Fontes Originais para Portabilidade, Identidade e Função, MANDATORY INTEGRITY WARNING, Missão

### Community 22 - "Relatório de Handoff — Explorer Survey 1"
Cohesion: 0.29
Nodes (6): 1. Observation (Observações Diretas), 2. Logic Chain (Cadeia Lógica), 3. Caveats (Ressalvas), 4. Conclusion (Conclusão), 5. Verification Method (Método de Verificação), Relatório de Handoff — Explorer Survey 1

### Community 23 - "Handoff Report — Explorer 2 (Survey Phase)"
Cohesion: 0.29
Nodes (6): 1. Observation, 2. Logic Chain, 3. Caveats, 4. Conclusion, 5. Verification Method, Handoff Report — Explorer 2 (Survey Phase)

### Community 24 - "Relatório de Handoff — Explorer 3 (Fase de Survey)"
Cohesion: 0.29
Nodes (6): 1. Observation (Observações Diretas), 2. Logic Chain (Cadeia de Raciocínio), 3. Caveats (Ressalvas e Limitações), 4. Conclusion (Conclusão), 5. Verification Method (Método de Verificação), Relatório de Handoff — Explorer 3 (Fase de Survey)

### Community 41 - "package.json"
Cohesion: 0.09
Nodes (21): description, name, private, version, bcryptjs, clsx, framer-motion, jose (+13 more)

### Community 42 - "dependencies"
Cohesion: 0.11
Nodes (18): dependencies, bcryptjs, clsx, drizzle-orm, framer-motion, jose, lucide-react, @neondatabase/serverless (+10 more)

### Community 43 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 44 - "catalog.ts"
Cohesion: 0.14
Nodes (25): dynamic, GET(), getMimeType(), POST(), dynamic, GET(), BibliotecaItemPage(), dynamicParams (+17 more)

### Community 45 - "lib/db/schema.ts"
Cohesion: 0.10
Nodes (23): AdminUser, adminUsers, Article, articles, AuthSession, authSessions, Form, formsRelations (+15 more)

### Community 47 - "comunidade/app.js"
Cohesion: 0.11
Nodes (60): applyBgSettingsUI(), convertToEmbedUrl(), formatDate(), getActivePlaylist(), getBadge(), handleAuthSession(), handleDeleteLessonModal(), handleDeleteServerModal() (+52 more)

### Community 48 - "src/db/schema.ts"
Cohesion: 0.07
Nodes (38): @neondatabase/serverless, pg, checkDbStatus(), createFallbackProxy(), db, DbStatus, getConnectionString(), getDb() (+30 more)

### Community 49 - "ShaderBackground.tsx"
Cohesion: 0.08
Nodes (53): ogl, @react-three/drei, @react-three/fiber, three, BalatroShader(), BalatroShaderProps, Beams(), BeamsProps (+45 more)

### Community 50 - "BRIEFING — 2026-10-14T15:40:00Z"
Cohesion: 0.18
Nodes (10): Artifact Index, BRIEFING — 2026-10-14T15:40:00Z, Current Parent, 🔒 Key Constraints, Key Decisions Made, Loaded Skills, Mission, 🔒 My Identity (+2 more)

### Community 51 - "BRIEFING — 2026-10-14T15:54:00Z"
Cohesion: 0.18
Nodes (10): Artifact Index, BRIEFING — 2026-10-14T15:54:00Z, Current Parent, 🔒 Key Constraints, Key Decisions Made, Loaded Skills, Mission, 🔒 My Identity (+2 more)

### Community 52 - "BRIEFING — 2026-10-14T15:55:00Z"
Cohesion: 0.18
Nodes (10): Artifact Index, BRIEFING — 2026-10-14T15:55:00Z, Current Parent, 🔒 Key Constraints, Key Decisions Made, Loaded Skills, Mission, 🔒 My Identity (+2 more)

### Community 53 - "route.ts"
Cohesion: 0.40
Nodes (4): handleMercadoPagoWebhook(), PlanDefinition, PLANS, POST()

### Community 54 - "Progress — Form Builder SaaS Specialist"
Cohesion: 0.50
Nodes (3): Progress — Form Builder SaaS Specialist, Status Atual: Build & Verificação Final, Tarefas

### Community 55 - "ResourceCard.tsx"
Cohesion: 0.29
Nodes (5): ResourceCardProps, ResourceDetailViewerProps, LibraryCategoryGroup, LibraryItem, LibraryResponse

### Community 58 - "Badge.tsx"
Cohesion: 0.12
Nodes (20): CommunityFeed(), CommunityPost, INITIAL_POSTS, PostComment, ComunidadeDashboard(), MemberCard(), MemberCardProps, MemberProfile (+12 more)

### Community 59 - "types.ts"
Cohesion: 0.13
Nodes (16): FieldPaletteProps, ICON_MAP, FormCanvasProps, TYPE_ICONS, TYPE_LABELS, FormRunner(), FormRunnerProps, LivePreviewProps (+8 more)

### Community 60 - "Relatório de Handoff — WebGL & Shaders Specialist (agent-shaders)"
Cohesion: 0.29
Nodes (6): 1. Observation (Observações Diretas), 2. Logic Chain (Cadeia Lógica), 3. Caveats (Ressalvas), 4. Conclusion (Conclusão), 5. Verification Method (Método de Verificação), Relatório de Handoff — WebGL & Shaders Specialist (agent-shaders)

### Community 61 - "devDependencies"
Cohesion: 0.15
Nodes (13): devDependencies, drizzle-kit, postcss, tailwindcss, @tailwindcss/postcss, tsx, @types/bcryptjs, @types/node (+5 more)

### Community 62 - "Relatório de Handoff — Members Area & Community Engineer (agent-members)"
Cohesion: 0.29
Nodes (6): 1. Observation (Observações Diretas), 2. Logic Chain (Cadeia de Raciocínio), 3. Caveats (Ressalvas e Limitações), 4. Conclusion (Conclusão), 5. Verification Method (Método de Verificação), Relatório de Handoff — Members Area & Community Engineer (agent-members)

### Community 63 - "[slug]/page.tsx"
Cohesion: 0.23
Nodes (11): ArtigosPortalPage(), ArtigoDetailPage(), generateMetadata(), generateStaticParams(), PageProps, Article, articlesList, getAllArticles() (+3 more)

### Community 64 - "Relatório de Handoff — Lead Frontend & Glassmorphism Architect (agent-foundations)"
Cohesion: 0.29
Nodes (6): 1. Observation (Observações Diretas), 2. Logic Chain (Cadeia de Raciocínio), 3. Caveats (Ressalvas), 4. Conclusion (Conclusão), 5. Verification Method (Método de Verificação), Relatório de Handoff — Lead Frontend & Glassmorphism Architect (agent-foundations)

### Community 65 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, build, db:generate, db:push, db:seed, dev, lint, start

### Community 66 - "library.test.mjs"
Cohesion: 0.33
Nodes (3): PROJECT_ROOT, PUBLIC_CATALOG_PATH, SRC_CATALOG_PATH

### Community 68 - "app/page.tsx"
Cohesion: 0.07
Nodes (31): Testimonial, testimonials, ArticleData, ArticleModal(), ArticleModalProps, ContatoSection(), ContatoSectionProps, EcosystemShowcase() (+23 more)

### Community 69 - "Relatório de Handoff — Database Architect & Drizzle Master (agent-database)"
Cohesion: 0.29
Nodes (6): 1. Observation (Observações Diretas), 2. Logic Chain (Cadeia de Raciocínio), 3. Caveats (Ressalvas), 4. Conclusion (Conclusão), 5. Verification Method (Método de Verificação), Relatório de Handoff — Database Architect & Drizzle Master (agent-database)

### Community 70 - "Navbar.tsx"
Cohesion: 0.18
Nodes (8): nextConfig, next, metadata, Footer(), MasterSovereignBar, Navbar(), NavLinkItem, navLinks

### Community 71 - "utils.ts"
Cohesion: 0.17
Nodes (7): CheckoutModal(), FormData, SERVICES_LIST, CapturedUTMs, Input, InputProps, formatCurrencyBRL()

### Community 73 - "Relatório de Handoff — Growth Engineer & Portal Institucional Specialist (agent-marketing)"
Cohesion: 0.29
Nodes (6): 1. Observation (Observações Diretas), 2. Logic Chain (Cadeia Lógica), 3. Caveats (Ressalvas), 4. Conclusion (Conclusão), 5. Verification Method (Método de Verificação), Relatório de Handoff — Growth Engineer & Portal Institucional Specialist (agent-marketing)

### Community 74 - "react"
Cohesion: 0.10
Nodes (27): lucide-react, react, FormSummary, MEDIA_CATALOG, MediaItem, MidiasPage(), VideoPlayer(), VideoPlayerProps (+19 more)

### Community 75 - "auth.ts"
Cohesion: 0.23
Nodes (18): POST(), DELETE(), GET(), POST(), POST(), authenticateAdmin(), authenticateMember(), hashPassword() (+10 more)

### Community 76 - "lib/db/index.ts"
Cohesion: 0.17
Nodes (12): drizzle-orm, GET(), GET(), POST(), POST(), checkDatabaseHealth(), checkDbStatus, connectionString (+4 more)

### Community 77 - "leads/route.ts"
Cohesion: 0.67
Nodes (4): GET(), POST(), resolveLeadSource(), runTests()

### Community 78 - "portal_restoration.test.ts"
Cohesion: 0.20
Nodes (8): leads, articles, articlesPath, BASE_DIR, requiredComponents, siteData, siteDataPath, testContactApi()

### Community 79 - "api/checkout/route.ts"
Cohesion: 0.24
Nodes (7): dynamic, EXTENDED_PLANS, POST(), GET(), CheckoutModalProps, COMMUNITY_PLANS, PlanConfig

### Community 80 - "comunidade/package.json"
Cohesion: 0.12
Nodes (15): author, dependencies, html-minifier, sharp, description, engines, node, name (+7 more)

### Community 81 - "builder/f/[id]/page.tsx"
Cohesion: 0.26
Nodes (7): PublicFormProps, BRAND_COLORS, FormPage, MASTER_PAGES, MASTER_QUESTIONS, Question, SavedForm

### Community 82 - "builder.ts"
Cohesion: 0.31
Nodes (9): BRAND_COLORS, DEFAULT_MASTER_PAGES, DEFAULT_MASTER_QUESTIONS, FormPage, FormSchema, FormSubmissionPayload, INITIAL_FORM_TEMPLATE, Question (+1 more)

### Community 89 - "🚀 Guia Oficial de Deploy na Vercel & Auditoria de Segurança — A.I VISUALS"
Cohesion: 0.20
Nodes (9): 📧 Autenticação e Domínio Próprio no Resend, 🌐 Configuração Global do Resend MCP (Antigravity), 🚀 Guia Oficial de Deploy na Vercel & Auditoria de Segurança — A.I VISUALS, Passo 1: Enviar o Código para o GitHub, Passo 2: Importar o Projeto na Vercel, Passo 3: Configurar Variáveis de Ambiente (Environment Variables), Passo 4: Concluir o Deploy, 📋 Passo a Passo para Deploy na Vercel (+1 more)

## Knowledge Gaps
- **511 isolated node(s):** `nextConfig`, `name`, `version`, `private`, `description` (+506 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 616 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **25 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `app/page.tsx`, `Navbar.tsx`, `utils.ts`, `package.json`, `catalog.ts`, `builder/f/[id]/page.tsx`, `ShaderBackground.tsx`, `ResourceCard.tsx`, `Badge.tsx`, `types.ts`, `[slug]/page.tsx`?**
  _High betweenness centrality (0.118) - this node is a cross-community bridge._
- **Why does `drizzle-orm` connect `lib/db/index.ts` to `package.json`, `auth.ts`, `leads/route.ts`, `lib/db/schema.ts`, `src/db/schema.ts`?**
  _High betweenness centrality (0.092) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `react` to `app/page.tsx`, `Navbar.tsx`, `utils.ts`, `package.json`, `catalog.ts`, `builder/f/[id]/page.tsx`, `ShaderBackground.tsx`, `ResourceCard.tsx`, `Badge.tsx`, `types.ts`, `[slug]/page.tsx`?**
  _High betweenness centrality (0.059) - this node is a cross-community bridge._
- **Are the 7 inferred relationships involving `setupEventListeners()` (e.g. with `handleDeleteLessonModal()` and `handleDeleteServerModal()`) actually correct?**
  _`setupEventListeners()` has 7 INFERRED edges - model-reasoned connections that need verification._
- **Are the 9 inferred relationships involving `renderCurrentView()` (e.g. with `renderAdminView()` and `renderCategoryView()`) actually correct?**
  _`renderCurrentView()` has 9 INFERRED edges - model-reasoned connections that need verification._
- **What connects `nextConfig`, `name`, `version` to the rest of the system?**
  _511 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Relatório de Survey Técnico — Explorer 2` be split into smaller, more focused modules?**
  _Cohesion score 0.08 - nodes in this community are weakly interconnected._