# Graph Report - plataforma-unificada-soberana  (2026-10-16)

## Corpus Check
- 219 files · ~21,979,637 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1841 nodes · 3613 edges · 136 communities (90 shown, 36 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 72 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `09298bd4`
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
- tn
- ShaderBackground.tsx
- BRIEFING — 2026-10-14T15:40:00Z
- BRIEFING — 2026-10-14T15:54:00Z
- BRIEFING — 2026-10-14T15:55:00Z
- route.ts
- Progress — Form Builder SaaS Specialist
- migrate_to_supabase.js
- Progress — Growth Engineer & Portal Institucional Specialist
- Progress — Members Area & Community Engineer (agent-members)
- verifyAdminRequest
- types.ts
- Relatório de Handoff — WebGL & Shaders Specialist (agent-shaders)
- devDependencies
- Relatório de Handoff — Members Area & Community Engineer (agent-members)
- Badge.tsx
- Relatório de Handoff — Lead Frontend & Glassmorphism Architect (agent-foundations)
- scripts
- library.test.mjs
- admin/page.tsx
- react
- Relatório de Handoff — Database Architect & Drizzle Master (agent-database)
- auth.ts
- builder/page.tsx
- [slug]/page.tsx
- Relatório de Handoff — Growth Engineer & Portal Institucional Specialist (agent-marketing)
- auth_feedback_comunidade.test.mjs
- articles/route.ts
- ResourceCard.tsx
- builder.ts
- portal_restoration.test.ts
- CheckoutModal.tsx
- comunidade/package.json
- send-email/route.ts
- community-shaders.js
- create-payment/route.ts
- _
- biblioteca/route.ts
- comunidade/route.ts
- 🚀 Guia Oficial de Deploy na Vercel & Auditoria de Segurança — A.I VISUALS
- cn
- tailwindcss
- U
- ar
- lucide-react
- .z
- it
- .computeFrenetFrames
- library-manager.ts
- ks
- le
- V
- .update
- pt
- zt
- vercel.json
- .copy
- ke
- q
- en
- .addAttribute
- webgl-utils.ts
- K
- ShopSection.tsx
- sr
- Beams.tsx
- .x
- l
- RecursosSection.tsx
- gr
- W
- drizzle-kit
- comunidade_red_shaders_enriched.test.mjs
- FaultyTerminalShader.tsx
- j
- Fs
- Galaxy
- fr
- middleware.ts

## God Nodes (most connected - your core abstractions)
1. `_` - 208 edges
2. `react` - 70 edges
3. `lucide-react` - 49 edges
4. `requestAnimationFrame()` - 39 edges
5. `instantiateShader()` - 35 edges
6. `U` - 35 edges
7. `cn()` - 35 edges
8. `setupEventListeners()` - 33 edges
9. `V` - 33 edges
10. `getOptimizedDPR()` - 31 edges

## Surprising Connections (you probably didn't know these)
- `runTests()` --calls--> `POST()`  [EXTRACTED]
  tests/portal_marketing.test.ts → src/app/api/leads/route.ts
- `runTests()` --calls--> `GET()`  [EXTRACTED]
  tests/portal_marketing.test.ts → src/app/api/leads/route.ts
- `CatalogGridProps` --references--> `LibraryResource`  [EXTRACTED]
  src/components/library/CatalogGrid.tsx → src/lib/library/catalog.ts
- `AdminPanelPage()` --calls--> `cn()`  [EXTRACTED]
  src/app/admin/page.tsx → src/lib/utils.ts
- `verifyServerSession()` --calls--> `setStoredUser()`  [EXTRACTED]
  src/app/admin/page.tsx → src/lib/auth/unified-auth.ts

## Import Cycles
- None detected.

## Communities (136 total, 36 thin omitted)

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
Nodes (22): description, name, private, version, framer-motion, jose, marked, @neondatabase/serverless (+14 more)

### Community 42 - "dependencies"
Cohesion: 0.11
Nodes (19): dependencies, bcryptjs, clsx, drizzle-orm, framer-motion, jose, lucide-react, marked (+11 more)

### Community 43 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 44 - "catalog.ts"
Cohesion: 0.14
Nodes (24): dynamic, GET(), getMimeType(), POST(), dynamic, GET(), BibliotecaItemPage(), dynamicParams (+16 more)

### Community 45 - "schema.ts"
Cohesion: 0.08
Nodes (30): dynamic, checkDatabaseHealth(), checkDbStatus, connectionString, AdminUser, adminUsers, Article, articles (+22 more)

### Community 47 - "app.js"
Cohesion: 0.07
Nodes (91): applyBgSettingsUI(), clearAuthAlert(), convertToEmbedUrl(), _deprecatedAdminViewLegacy(), embedLessonMetadata(), escapeHtml(), escapeJs(), extractLessonMetadata() (+83 more)

### Community 49 - "ShaderBackground.tsx"
Cohesion: 0.12
Nodes (25): ogl, AdminRedShader(), AdminRedShaderProps, CinematicCanvasProps, CinematicShaderMode, ColorBendsProps, GridScanShaderProps, LineWavesShader() (+17 more)

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
Cohesion: 0.14
Nodes (9): bcryptjs, pg, bcrypt, fs, migrate(), path, { Pool }, { Client } (+1 more)

### Community 58 - "verifyAdminRequest"
Cohesion: 0.18
Nodes (17): DEFAULT_CONFIG, dynamic, GET(), normalizeShopResourcesConfig(), POST(), dynamic, GET(), DELETE() (+9 more)

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

### Community 63 - "Badge.tsx"
Cohesion: 0.10
Nodes (22): CommunityPost, INITIAL_POSTS, PostComment, FormData, SERVICES_LIST, ArticleItem, EcosystemModule, ecosystems (+14 more)

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
Cohesion: 0.12
Nodes (26): AdminPanelPage(), verifyServerSession(), ArticleItem, FormItem, LeadItem, MemberItem, RecursoConfig, ShopHeroConfig (+18 more)

### Community 68 - "react"
Cohesion: 0.12
Nodes (19): react, Testimonial, testimonials, ArticleData, ArticleModal(), ArticleModalProps, ContatoSection(), ContatoSectionProps (+11 more)

### Community 69 - "Relatório de Handoff — Database Architect & Drizzle Master (agent-database)"
Cohesion: 0.29
Nodes (6): 1. Observation (Observações Diretas), 2. Logic Chain (Cadeia de Raciocínio), 3. Caveats (Ressalvas), 4. Conclusion (Conclusão), 5. Verification Method (Método de Verificação), Relatório de Handoff — Database Architect & Drizzle Master (agent-database)

### Community 70 - "auth.ts"
Cohesion: 0.22
Nodes (23): drizzle-orm, POST(), DELETE(), GET(), POST(), dynamic, GET(), authenticateAdmin() (+15 more)

### Community 71 - "builder/page.tsx"
Cohesion: 0.29
Nodes (7): PublicFormProps, BRAND_COLORS, FormPage, MASTER_PAGES, MASTER_QUESTIONS, Question, SavedForm

### Community 72 - "[slug]/page.tsx"
Cohesion: 0.21
Nodes (12): GET(), ArtigosPortalPage(), ArtigoDetailPage(), generateMetadata(), generateStaticParams(), PageProps, Article, articlesList (+4 more)

### Community 73 - "Relatório de Handoff — Growth Engineer & Portal Institucional Specialist (agent-marketing)"
Cohesion: 0.29
Nodes (6): 1. Observation (Observações Diretas), 2. Logic Chain (Cadeia Lógica), 3. Caveats (Ressalvas), 4. Conclusion (Conclusão), 5. Verification Method (Método de Verificação), Relatório de Handoff — Growth Engineer & Portal Institucional Specialist (agent-marketing)

### Community 75 - "articles/route.ts"
Cohesion: 0.24
Nodes (15): dynamic, GET(), POST(), PUT(), slugify(), COVER_PRESETS, PostEditorModal(), PostEditorModalProps (+7 more)

### Community 76 - "ResourceCard.tsx"
Cohesion: 0.32
Nodes (5): ResourceCardProps, ResourceDetailViewerProps, LibraryCategoryGroup, LibraryItem, LibraryResponse

### Community 77 - "builder.ts"
Cohesion: 0.31
Nodes (9): BRAND_COLORS, DEFAULT_MASTER_PAGES, DEFAULT_MASTER_QUESTIONS, FormPage, FormSchema, FormSubmissionPayload, INITIAL_FORM_TEMPLATE, Question (+1 more)

### Community 78 - "portal_restoration.test.ts"
Cohesion: 0.22
Nodes (7): articles, articlesPath, BASE_DIR, requiredComponents, siteData, siteDataPath, testContactApi()

### Community 79 - "CheckoutModal.tsx"
Cohesion: 0.21
Nodes (10): dynamic, EXTENDED_PLANS, POST(), GET(), POST(), CheckoutModal(), CheckoutModalProps, COMMUNITY_PLANS (+2 more)

### Community 80 - "comunidade/package.json"
Cohesion: 0.12
Nodes (15): author, dependencies, html-minifier, sharp, description, engines, node, name (+7 more)

### Community 81 - "send-email/route.ts"
Cohesion: 0.31
Nodes (6): dynamic, escapeHtml(), POST(), attemptsMap, checkRateLimit(), RateLimitRecord

### Community 82 - "community-shaders.js"
Cohesion: 0.07
Nodes (60): buildStrandsPalette(), easePower2InOut(), getOptimizedDPR(), hexToRgb(), hexToRgbArr(), initAntigravity(), initAurora(), initBalatro() (+52 more)

### Community 84 - "_"
Cohesion: 0.03
Nodes (51): _, ae(), As(), at, bs(), bt(), ce(), ct() (+43 more)

### Community 89 - "🚀 Guia Oficial de Deploy na Vercel & Auditoria de Segurança — A.I VISUALS"
Cohesion: 0.20
Nodes (9): 📧 Autenticação e Domínio Próprio no Resend, 🌐 Configuração Global do Resend MCP (Antigravity), 🚀 Guia Oficial de Deploy na Vercel & Auditoria de Segurança — A.I VISUALS, Passo 1: Enviar o Código para o GitHub, Passo 2: Importar o Projeto na Vercel, Passo 3: Configurar Variáveis de Ambiente (Environment Variables), Passo 4: Concluir o Deploy, 📋 Passo a Passo para Deploy na Vercel (+1 more)

### Community 90 - "cn"
Cohesion: 0.11
Nodes (23): clsx, tailwind-merge, MEDIA_CATALOG, MediaItem, MidiasPage(), CommunityFeed(), MemberCard(), MemberCardProps (+15 more)

### Community 92 - "U"
Cohesion: 0.05
Nodes (19): ai(), ci(), di(), _e(), fi(), gi(), hi(), ii() (+11 more)

### Community 95 - "ar"
Cohesion: 0.09
Nodes (5): ar, kt(), mr, Ut(), yr

### Community 96 - "lucide-react"
Cohesion: 0.14
Nodes (9): nextConfig, lucide-react, next, metadata, FormSummary, metadata, LibraryControlSuite(), Footer() (+1 more)

### Community 97 - ".z"
Cohesion: 0.08
Nodes (4): Gs(), Hs(), qs(), Xs()

### Community 100 - ".computeFrenetFrames"
Cohesion: 0.14
Nodes (5): cr, dr(), Ee(), ki(), pr()

### Community 101 - "library-manager.ts"
Cohesion: 0.12
Nodes (30): dynamic, POST(), DELETE(), dynamic, PUT(), DELETE(), dynamic, GET() (+22 more)

### Community 104 - "V"
Cohesion: 0.09
Nodes (3): De(), qi(), V

### Community 105 - ".update"
Cohesion: 0.16
Nodes (4): cs, is, rr, Ys()

### Community 106 - "pt"
Cohesion: 0.10
Nodes (8): bi(), _i(), pn, pt, Se(), Si(), Ti(), vi()

### Community 107 - "zt"
Cohesion: 0.24
Nodes (4): Ie(), Ne(), or, zt

### Community 110 - ".copy"
Cohesion: 0.09
Nodes (11): he(), Lt, nn(), Ot, ri(), C(), N(), ur() (+3 more)

### Community 111 - "ke"
Cohesion: 0.11
Nodes (6): er, ji(), ke, ue(), we(), xe()

### Community 112 - "q"
Cohesion: 0.19
Nodes (4): p(), q, ze, zi()

### Community 117 - "webgl-utils.ts"
Cohesion: 0.25
Nodes (17): three, CinematicCanvas(), ColorBends, Galaxy, GridScanShader, resolveEffectiveStep(), ShaderMode, ColorBends() (+9 more)

### Community 118 - "K"
Cohesion: 0.17
Nodes (4): br, K, kr, nr

### Community 119 - "ShopSection.tsx"
Cohesion: 0.16
Nodes (12): AlternatingHeroBanner(), AlternatingHeroBannerProps, ShopData, ShopFeature, ShopHero, ShopProductItem, ShopSection(), ShopSectionProps (+4 more)

### Community 120 - "sr"
Cohesion: 0.15
Nodes (7): sr(), et(), L(), tt(), xs(), St, ui()

### Community 121 - "Beams.tsx"
Cohesion: 0.25
Nodes (9): Beams(), BeamsProps, createStackedPlanesBufferGeometry(), degToRad(), extendMaterial(), hexToNormalizedRGB(), MergedPlanes, MergedPlanesProps (+1 more)

### Community 123 - "l"
Cohesion: 0.19
Nodes (7): be(), gt, rn, l(), zr, h(), l()

### Community 124 - "RecursosSection.tsx"
Cohesion: 0.24
Nodes (8): RecursoCard, RecursoItem, RecursoSocialChannel, RecursosSection(), RecursosSectionProps, LightningShader(), LightningShaderProps, cleanupWebGLContext()

### Community 126 - "W"
Cohesion: 0.22
Nodes (3): on, un, W

### Community 129 - "FaultyTerminalShader.tsx"
Cohesion: 0.36
Nodes (6): InstagramIcon(), LinkedinIcon(), SobreSection(), SobreSectionProps, FaultyTerminalShader(), FaultyTerminalShaderProps

### Community 130 - "j"
Cohesion: 0.33
Nodes (4): v(), j(), tr, R()

### Community 133 - "fr"
Cohesion: 0.83
Nodes (4): fr(), A(), E(), m()

### Community 134 - "middleware.ts"
Cohesion: 0.67
Nodes (3): config, isRestrictedAdminRoute(), middleware()

## Knowledge Gaps
- **562 isolated node(s):** `nextConfig`, `name`, `version`, `private`, `description` (+557 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 800 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **36 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `_` connect `_` to `j`, `Fs`, `fr`, `tn`, `community-shaders.js`, `U`, `ar`, `.z`, `it`, `.computeFrenetFrames`, `ks`, `le`, `V`, `.update`, `pt`, `zt`, `.copy`, `ke`, `q`, `en`, `.addAttribute`, `K`, `sr`, `.x`, `l`, `gr`, `W`?**
  _High betweenness centrality (0.308) - this node is a cross-community bridge._
- **Why does `cn()` connect `cn` to `lucide-react`, `admin/page.tsx`, `ResourceCard.tsx`, `catalog.ts`, `W`, `Badge.tsx`?**
  _High betweenness centrality (0.238) - this node is a cross-community bridge._
- **Why does `on` connect `W` to `_`?**
  _High betweenness centrality (0.237) - this node is a cross-community bridge._
- **What connects `nextConfig`, `name`, `version` to the rest of the system?**
  _562 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Relatório de Survey Técnico — Explorer 2` be split into smaller, more focused modules?**
  _Cohesion score 0.08 - nodes in this community are weakly interconnected._
- **Should `3. Investigação Detalhada: Projeto 4 — Biblioteca Oculta de Recursos (`s-a-a-s-full-hidden-library`)` be split into smaller, more focused modules?**
  _Cohesion score 0.08695652173913043 - nodes in this community are weakly interconnected._
- **Should `🏛️ RELATÓRIO TÉCNICO DE SURVEY — EXPLORER 3` be split into smaller, more focused modules?**
  _Cohesion score 0.09090909090909091 - nodes in this community are weakly interconnected._