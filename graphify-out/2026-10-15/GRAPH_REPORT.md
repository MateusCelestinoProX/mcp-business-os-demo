# Graph Report - plataforma-unificada-soberana  (2026-10-15)

## Corpus Check
- 205 files · ~21,912,690 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1145 nodes · 2111 edges · 103 communities (67 shown, 28 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 35 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `81fa3f79`
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
- schema.ts
- app.js
- comunidade/auth.test.ts
- ShaderBackground.tsx
- BRIEFING — 2026-10-14T15:40:00Z
- BRIEFING — 2026-10-14T15:54:00Z
- BRIEFING — 2026-10-14T15:55:00Z
- route.ts
- Progress — Form Builder SaaS Specialist
- migrate_to_supabase.js
- Progress — Growth Engineer & Portal Institucional Specialist
- Progress — Members Area & Community Engineer (agent-members)
- articles/route.ts
- types.ts
- Relatório de Handoff — WebGL & Shaders Specialist (agent-shaders)
- devDependencies
- Relatório de Handoff — Members Area & Community Engineer (agent-members)
- react
- Relatório de Handoff — Lead Frontend & Glassmorphism Architect (agent-foundations)
- scripts
- library.test.mjs
- admin/page.tsx
- lucide-react
- Relatório de Handoff — Database Architect & Drizzle Master (agent-database)
- builder.ts
- cn
- [slug]/page.tsx
- Relatório de Handoff — Growth Engineer & Portal Institucional Specialist (agent-marketing)
- auth_feedback_comunidade.test.mjs
- auth.ts
- GlassCard.tsx
- leads/route.ts
- portal_restoration.test.ts
- adversarial.test.ts
- comunidade/package.json
- db/index.ts
- shop-resources/route.ts
- create-payment/route.ts
- send-email/route.ts
- biblioteca/route.ts
- comunidade/route.ts
- 🚀 Guia Oficial de Deploy na Vercel & Auditoria de Segurança — A.I VISUALS
- finance/route.ts
- tailwindcss
- pg
- CommunityFeed.tsx
- next
- SobreSection.tsx
- drizzle-kit
- vercel.json

## God Nodes (most connected - your core abstractions)
1. `react` - 68 edges
2. `lucide-react` - 47 edges
3. `cn()` - 32 edges
4. `setupEventListeners()` - 28 edges
5. `renderCurrentView()` - 26 edges
6. `Badge` - 23 edges
7. `isWebGLSupported` - 21 edges
8. `GlassCard` - 20 edges
9. `Button` - 19 edges
10. `db` - 19 edges

## Surprising Connections (you probably didn't know these)
- `runTests()` --calls--> `POST()`  [EXTRACTED]
  tests/portal_marketing.test.ts → src/app/api/leads/route.ts
- `runTests()` --calls--> `GET()`  [EXTRACTED]
  tests/portal_marketing.test.ts → src/app/api/leads/route.ts
- `CommunityFeed()` --calls--> `cn()`  [EXTRACTED]
  src/components/comunidade/CommunityFeed.tsx → src/lib/utils.ts
- `AdminPanelPage()` --calls--> `cn()`  [EXTRACTED]
  src/app/admin/page.tsx → src/lib/utils.ts
- `verifyServerSession()` --calls--> `setStoredUser()`  [EXTRACTED]
  src/app/admin/page.tsx → src/lib/auth/unified-auth.ts

## Import Cycles
- None detected.

## Communities (103 total, 28 thin omitted)

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
Nodes (21): description, name, private, version, clsx, framer-motion, jose, @neondatabase/serverless (+13 more)

### Community 42 - "dependencies"
Cohesion: 0.11
Nodes (19): dependencies, bcryptjs, clsx, drizzle-orm, framer-motion, jose, lucide-react, marked (+11 more)

### Community 43 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 44 - "catalog.ts"
Cohesion: 0.16
Nodes (21): dynamic, GET(), getMimeType(), POST(), dynamic, GET(), BibliotecaItemPage(), dynamicParams (+13 more)

### Community 45 - "schema.ts"
Cohesion: 0.11
Nodes (17): AdminUser, Article, AuthSession, authSessions, Form, FormSubmission, Lead, LibraryItem (+9 more)

### Community 47 - "app.js"
Cohesion: 0.11
Nodes (66): applyBgSettingsUI(), clearAuthAlert(), convertToEmbedUrl(), escapeHtml(), formatDate(), getActivePlaylist(), getBadge(), handleAuthSession() (+58 more)

### Community 48 - "comunidade/auth.test.ts"
Cohesion: 0.24
Nodes (14): DELETE(), GET(), dynamic, GET(), getJwtSecret(), signToken(), verifyToken(), destroySession() (+6 more)

### Community 49 - "ShaderBackground.tsx"
Cohesion: 0.07
Nodes (62): ogl, @react-three/drei, @react-three/fiber, three, AdminRedShader(), AdminRedShaderProps, BalatroShader(), BalatroShaderProps (+54 more)

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

### Community 55 - "migrate_to_supabase.js"
Cohesion: 0.20
Nodes (6): bcryptjs, bcrypt, fs, migrate(), path, { Pool }

### Community 58 - "articles/route.ts"
Cohesion: 0.25
Nodes (14): marked, dynamic, GET(), POST(), PUT(), slugify(), PostEditorModal(), calculateReadingTime() (+6 more)

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

### Community 63 - "react"
Cohesion: 0.12
Nodes (18): react, COVER_PRESETS, PostEditorModalProps, CheckoutModal(), FormData, SERVICES_LIST, ArticleItem, HeroSectionProps (+10 more)

### Community 64 - "Relatório de Handoff — Lead Frontend & Glassmorphism Architect (agent-foundations)"
Cohesion: 0.29
Nodes (6): 1. Observation (Observações Diretas), 2. Logic Chain (Cadeia de Raciocínio), 3. Caveats (Ressalvas), 4. Conclusion (Conclusão), 5. Verification Method (Método de Verificação), Relatório de Handoff — Lead Frontend & Glassmorphism Architect (agent-foundations)

### Community 65 - "scripts"
Cohesion: 0.22
Nodes (9): scripts, build, db:generate, db:push, db:seed, dev, lint, start (+1 more)

### Community 66 - "library.test.mjs"
Cohesion: 0.33
Nodes (3): PROJECT_ROOT, PUBLIC_CATALOG_PATH, SRC_CATALOG_PATH

### Community 67 - "admin/page.tsx"
Cohesion: 0.06
Nodes (44): AdminPanelPage(), verifyServerSession(), ArticleItem, FormItem, LeadItem, MemberItem, RecursoConfig, ShopHeroConfig (+36 more)

### Community 68 - "lucide-react"
Cohesion: 0.08
Nodes (26): lucide-react, FormSummary, Testimonial, testimonials, ArticleData, ArticleModal(), ArticleModalProps, ContatoSection() (+18 more)

### Community 69 - "Relatório de Handoff — Database Architect & Drizzle Master (agent-database)"
Cohesion: 0.29
Nodes (6): 1. Observation (Observações Diretas), 2. Logic Chain (Cadeia de Raciocínio), 3. Caveats (Ressalvas), 4. Conclusion (Conclusão), 5. Verification Method (Método de Verificação), Relatório de Handoff — Database Architect & Drizzle Master (agent-database)

### Community 70 - "builder.ts"
Cohesion: 0.31
Nodes (9): BRAND_COLORS, DEFAULT_MASTER_PAGES, DEFAULT_MASTER_QUESTIONS, FormPage, FormSchema, FormSubmissionPayload, INITIAL_FORM_TEMPLATE, Question (+1 more)

### Community 71 - "cn"
Cohesion: 0.11
Nodes (23): MEDIA_CATALOG, MediaItem, MidiasPage(), MemberCard(), MemberCardProps, MemberProfile, VideoPlayer(), VideoPlayerProps (+15 more)

### Community 72 - "[slug]/page.tsx"
Cohesion: 0.21
Nodes (12): GET(), ArtigosPortalPage(), ArtigoDetailPage(), generateMetadata(), generateStaticParams(), PageProps, Article, articlesList (+4 more)

### Community 73 - "Relatório de Handoff — Growth Engineer & Portal Institucional Specialist (agent-marketing)"
Cohesion: 0.29
Nodes (6): 1. Observation (Observações Diretas), 2. Logic Chain (Cadeia Lógica), 3. Caveats (Ressalvas), 4. Conclusion (Conclusão), 5. Verification Method (Método de Verificação), Relatório de Handoff — Growth Engineer & Portal Institucional Specialist (agent-marketing)

### Community 75 - "auth.ts"
Cohesion: 0.30
Nodes (12): POST(), POST(), authenticateAdmin(), authenticateMember(), hashPassword(), verifyPassword(), SessionPayload, attemptsMap (+4 more)

### Community 76 - "GlassCard.tsx"
Cohesion: 0.18
Nodes (10): ResourceCardProps, ResourceDetailViewerProps, EcosystemModule, ecosystems, EcosystemShowcase(), GlassCard, GlassCardProps, LibraryCategoryGroup (+2 more)

### Community 77 - "leads/route.ts"
Cohesion: 0.67
Nodes (4): GET(), POST(), resolveLeadSource(), runTests()

### Community 78 - "portal_restoration.test.ts"
Cohesion: 0.20
Nodes (8): leads, articles, articlesPath, BASE_DIR, requiredComponents, siteData, siteDataPath, testContactApi()

### Community 79 - "adversarial.test.ts"
Cohesion: 0.24
Nodes (8): dynamic, EXTENDED_PLANS, POST(), GET(), POST(), CheckoutModalProps, COMMUNITY_PLANS, PlanConfig

### Community 80 - "comunidade/package.json"
Cohesion: 0.12
Nodes (15): author, dependencies, html-minifier, sharp, description, engines, node, name (+7 more)

### Community 81 - "db/index.ts"
Cohesion: 0.12
Nodes (14): drizzle-orm, dynamic, checkDatabaseHealth(), checkDbStatus, connectionString, db, isDbConfigured, adminUsers (+6 more)

### Community 82 - "shop-resources/route.ts"
Cohesion: 0.38
Nodes (6): DEFAULT_CONFIG, dynamic, GET(), normalizeShopResourcesConfig(), POST(), systemSettings

### Community 89 - "🚀 Guia Oficial de Deploy na Vercel & Auditoria de Segurança — A.I VISUALS"
Cohesion: 0.20
Nodes (9): 📧 Autenticação e Domínio Próprio no Resend, 🌐 Configuração Global do Resend MCP (Antigravity), 🚀 Guia Oficial de Deploy na Vercel & Auditoria de Segurança — A.I VISUALS, Passo 1: Enviar o Código para o GitHub, Passo 2: Importar o Projeto na Vercel, Passo 3: Configurar Variáveis de Ambiente (Environment Variables), Passo 4: Concluir o Deploy, 📋 Passo a Passo para Deploy na Vercel (+1 more)

### Community 92 - "pg"
Cohesion: 0.40
Nodes (3): pg, { Client }, runSeed()

### Community 93 - "CommunityFeed.tsx"
Cohesion: 0.40
Nodes (4): CommunityFeed(), CommunityPost, INITIAL_POSTS, PostComment

### Community 96 - "SobreSection.tsx"
Cohesion: 0.60
Nodes (4): InstagramIcon(), LinkedinIcon(), SobreSection(), SobreSectionProps

## Knowledge Gaps
- **519 isolated node(s):** `nextConfig`, `name`, `version`, `private`, `description` (+514 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 635 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **28 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `SobreSection.tsx`, `admin/page.tsx`, `lucide-react`, `cn`, `[slug]/page.tsx`, `package.json`, `catalog.ts`, `GlassCard.tsx`, `ShaderBackground.tsx`, `types.ts`, `CommunityFeed.tsx`?**
  _High betweenness centrality (0.111) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `lucide-react` to `SobreSection.tsx`, `admin/page.tsx`, `cn`, `[slug]/page.tsx`, `package.json`, `catalog.ts`, `GlassCard.tsx`, `ShaderBackground.tsx`, `types.ts`, `CommunityFeed.tsx`, `react`?**
  _High betweenness centrality (0.063) - this node is a cross-community bridge._
- **Why does `drizzle-orm` connect `db/index.ts` to `package.json`, `auth.ts`, `leads/route.ts`, `schema.ts`, `adversarial.test.ts`, `comunidade/auth.test.ts`, `shop-resources/route.ts`, `articles/route.ts`?**
  _High betweenness centrality (0.051) - this node is a cross-community bridge._
- **Are the 7 inferred relationships involving `setupEventListeners()` (e.g. with `handleDeleteLessonModal()` and `handleDeleteServerModal()`) actually correct?**
  _`setupEventListeners()` has 7 INFERRED edges - model-reasoned connections that need verification._
- **Are the 9 inferred relationships involving `renderCurrentView()` (e.g. with `renderAdminView()` and `renderCategoryView()`) actually correct?**
  _`renderCurrentView()` has 9 INFERRED edges - model-reasoned connections that need verification._
- **What connects `nextConfig`, `name`, `version` to the rest of the system?**
  _519 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Relatório de Survey Técnico — Explorer 2` be split into smaller, more focused modules?**
  _Cohesion score 0.08 - nodes in this community are weakly interconnected._