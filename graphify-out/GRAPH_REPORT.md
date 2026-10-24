# Graph Report - mcp-business-os  (2026-10-24)

## Corpus Check
- 270 files · ~8,572,260 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 2153 nodes · 4345 edges · 152 communities (99 shown, 36 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 74 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `d722d206`
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
- it
- addItemToLibrary
- BRIEFING — 2026-10-14T15:40:00Z
- BRIEFING — 2026-10-14T15:54:00Z
- BRIEFING — 2026-10-14T15:55:00Z
- route.ts
- Progress — Form Builder SaaS Specialist
- migrate_to_supabase.js
- Progress — Growth Engineer & Portal Institucional Specialist
- Progress — Members Area & Community Engineer (agent-members)
- leads/route.ts
- ShaderBackground.tsx
- Relatório de Handoff — WebGL & Shaders Specialist (agent-shaders)
- devDependencies
- Relatório de Handoff — Members Area & Community Engineer (agent-members)
- Badge.tsx
- Relatório de Handoff — Lead Frontend & Glassmorphism Architect (agent-foundations)
- scripts
- library.test.mjs
- Navbar.tsx
- server-guardian.js
- Relatório de Handoff — Database Architect & Drizzle Master (agent-database)
- verifyToken
- cn
- structured-data.ts
- Relatório de Handoff — Growth Engineer & Portal Institucional Specialist (agent-marketing)
- auth_feedback_comunidade.test.mjs
- imagekit.ts
- .copy
- tn
- W
- adversarial.test.ts
- comunidade/package.json
- .update
- community-shaders.js
- create-payment/route.ts
- _
- biblioteca/route.ts
- comunidade/route.ts
- 🚀 Guia Oficial de Deploy na Vercel & Auditoria de Segurança — A.I VISUALS
- .computeFrenetFrames
- tailwindcss
- U
- ar
- security_audit.test.ts
- .z
- l
- gr
- library-manager.ts
- ks
- le
- V
- react
- script.js
- vercel.json
- MCP Business OS — Plataforma Unificada Soberana
- q
- en
- ke
- memoryCache
- K
- ShopControlSuite.tsx
- ResourceCard.tsx
- vercel.json
- .x
- verifyAdminRequest
- showcase/route.ts
- .addAttribute
- visual_stability.test.mjs
- comunidade_red_shaders_enriched.test.mjs
- scroll-probe.mjs
- Recursos Adicionais, Shaders & Integrações — MCP Business OS
- Arquitetura do Backend — MCP Business OS
- 2.1. Tabelas e Entidades
- 5. Especificação das Rotas de API (REST / JSON)
- 🚀 Os 6 Pilares do Sistema
- 3. Acervos de Dados Embutidos & Ativos Intelectuais
- admin/page.tsx
- sw.js
- admin_vertical_sidebar_layout.test.ts
- auth.ts
- sr
- drizzle-kit
- lucide-react
- portal_home_mobile.test.ts
- Estabilidade Visual & Resolução de GPU Scroll — Incidente INC-2026-10-17-SCROLL
- 🔬 Diagnóstico e Investigação das Causas Raízes
- contact/route.ts

## God Nodes (most connected - your core abstractions)
1. `_` - 208 edges
2. `react` - 80 edges
3. `lucide-react` - 50 edges
4. `verifyAdminRequest()` - 41 edges
5. `cn()` - 41 edges
6. `requestAnimationFrame()` - 39 edges
7. `setupEventListeners()` - 36 edges
8. `instantiateShader()` - 35 edges
9. `U` - 35 edges
10. `unauthorizedResponse()` - 34 edges

## Surprising Connections (you probably didn't know these)
- `uploadWithRetry()` --calls--> `uploadToImageKit()`  [EXTRACTED]
  scripts/migrate-to-imagekit.ts → src/lib/storage/imagekit.ts
- `runCompleteMigration()` --calls--> `getCanonicalImageKitFolder()`  [EXTRACTED]
  scripts/migrate-to-imagekit.ts → src/lib/storage/imagekit.ts
- `runCompleteMigration()` --calls--> `isImageKitConfigured()`  [EXTRACTED]
  scripts/migrate-to-imagekit.ts → src/lib/storage/imagekit.ts
- `runSeoDeepAudit()` --calls--> `GET()`  [EXTRACTED]
  scripts/seo-deep-audit.ts → src/app/feed.xml/route.ts
- `runSeoDeepAudit()` --calls--> `manifest()`  [EXTRACTED]
  scripts/seo-deep-audit.ts → src/app/manifest.ts

## Import Cycles
- None detected.

## Communities (152 total, 36 thin omitted)

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
Cohesion: 0.08
Nodes (23): description, name, private, version, clsx, framer-motion, jose, @neondatabase/serverless (+15 more)

### Community 42 - "dependencies"
Cohesion: 0.11
Nodes (19): dependencies, bcryptjs, clsx, drizzle-orm, framer-motion, jose, lucide-react, marked (+11 more)

### Community 43 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 44 - "catalog.ts"
Cohesion: 0.17
Nodes (21): dynamic, GET(), getMimeType(), POST(), dynamic, GET(), BibliotecaItemPage(), dynamicParams (+13 more)

### Community 45 - "schema.ts"
Cohesion: 0.09
Nodes (24): dynamic, dynamic, checkDatabaseHealth(), checkDbStatus, connectionString, db, isDbConfigured, AdminUser (+16 more)

### Community 47 - "app.js"
Cohesion: 0.07
Nodes (93): applyBgSettingsUI(), clearAuthAlert(), convertToEmbedUrl(), _deprecatedAdminViewLegacy(), embedLessonMetadata(), escapeHtml(), escapeJs(), extractLessonMetadata() (+85 more)

### Community 48 - "it"
Cohesion: 0.15
Nodes (3): Ds(), it, St

### Community 49 - "addItemToLibrary"
Cohesion: 0.36
Nodes (7): dynamic, POST(), dynamic, POST(), addItemToLibrary(), createNewDocumentInLibrary(), determineFileType()

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

### Community 58 - "leads/route.ts"
Cohesion: 0.67
Nodes (4): GET(), POST(), resolveLeadSource(), runTests()

### Community 59 - "ShaderBackground.tsx"
Cohesion: 0.06
Nodes (62): initGalaxy(), initSingularity(), ogl, three, BalatroShader(), BalatroShaderProps, Beams(), BeamsProps (+54 more)

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
Cohesion: 0.11
Nodes (23): Section, SECTIONS, TERM_SECTIONS, TermSection, CheckoutModal(), CommunityPost, INITIAL_POSTS, PostComment (+15 more)

### Community 64 - "Relatório de Handoff — Lead Frontend & Glassmorphism Architect (agent-foundations)"
Cohesion: 0.29
Nodes (6): 1. Observation (Observações Diretas), 2. Logic Chain (Cadeia de Raciocínio), 3. Caveats (Ressalvas), 4. Conclusion (Conclusão), 5. Verification Method (Método de Verificação), Relatório de Handoff — Lead Frontend & Glassmorphism Architect (agent-foundations)

### Community 65 - "scripts"
Cohesion: 0.13
Nodes (15): scripts, build, cache:test, db:generate, db:push, db:seed, dev, dev:guardian (+7 more)

### Community 66 - "library.test.mjs"
Cohesion: 0.29
Nodes (4): PROJECT_ROOT, PUBLIC_CATALOG_PATH, SOURCE_DIR, SRC_CATALOG_PATH

### Community 67 - "Navbar.tsx"
Cohesion: 0.16
Nodes (21): AdminPanelPage(), verifyServerSession(), LoginPage(), ShopPage(), Footer(), MobileBottomNav(), MobileNavItem, mobileNavItems (+13 more)

### Community 68 - "server-guardian.js"
Cohesion: 0.20
Nodes (17): checkHealthThreshold(), cleanNextCache(), freePort(), fs, gracefulShutdown(), http, lastRestartTime, log() (+9 more)

### Community 69 - "Relatório de Handoff — Database Architect & Drizzle Master (agent-database)"
Cohesion: 0.29
Nodes (6): 1. Observation (Observações Diretas), 2. Logic Chain (Cadeia de Raciocínio), 3. Caveats (Ressalvas), 4. Conclusion (Conclusão), 5. Verification Method (Método de Verificação), Relatório de Handoff — Database Architect & Drizzle Master (agent-database)

### Community 70 - "verifyToken"
Cohesion: 0.22
Nodes (12): AdminLibraryControlPage(), AdminShopPage(), DELETE(), GET(), dynamic, GET(), verifyToken(), destroySession() (+4 more)

### Community 71 - "cn"
Cohesion: 0.11
Nodes (22): MEDIA_CATALOG, MediaItem, MidiasPage(), CommunityFeed(), MemberCard(), VideoPlayer(), VideoPlayerProps, CatalogGrid() (+14 more)

### Community 72 - "structured-data.ts"
Cohesion: 0.05
Nodes (85): nextConfig, next, AuditCheck, runSeoDeepAudit(), ArtigosLayout(), metadata, ArtigosPortalPage(), ArtigoDetailPage() (+77 more)

### Community 73 - "Relatório de Handoff — Growth Engineer & Portal Institucional Specialist (agent-marketing)"
Cohesion: 0.29
Nodes (6): 1. Observation (Observações Diretas), 2. Logic Chain (Cadeia Lógica), 3. Caveats (Ressalvas), 4. Conclusion (Conclusão), 5. Verification Method (Método de Verificação), Relatório de Handoff — Growth Engineer & Portal Institucional Specialist (agent-marketing)

### Community 75 - "imagekit.ts"
Cohesion: 0.12
Nodes (30): asyncPool(), CATALOG_PATH, MANIFEST_PATH, ManifestEntry, PUBLIC_CATALOG_PATH, runCompleteMigration(), uploadWithRetry(), ALLOWED_EXTENSIONS (+22 more)

### Community 76 - ".copy"
Cohesion: 0.16
Nodes (5): he(), Lt, Ot, ri(), ur()

### Community 77 - "tn"
Cohesion: 0.15
Nodes (6): fr(), A(), E(), m(), ns(), tn

### Community 78 - "W"
Cohesion: 0.06
Nodes (15): bi(), Fs(), _i(), on, pn, pt, rn, Se() (+7 more)

### Community 79 - "adversarial.test.ts"
Cohesion: 0.24
Nodes (8): dynamic, EXTENDED_PLANS, POST(), GET(), POST(), CheckoutModalProps, COMMUNITY_PLANS, PlanConfig

### Community 80 - "comunidade/package.json"
Cohesion: 0.09
Nodes (24): author, dependencies, html-minifier, sharp, description, engines, node, name (+16 more)

### Community 81 - ".update"
Cohesion: 0.16
Nodes (4): cs, is, rr, Ys()

### Community 82 - "community-shaders.js"
Cohesion: 0.07
Nodes (60): buildStrandsPalette(), easePower2InOut(), getOptimizedDPR(), hexToRgb(), hexToRgbArr(), initAntigravity(), initAurora(), initBalatro() (+52 more)

### Community 84 - "_"
Cohesion: 0.03
Nodes (52): _, ae(), at, bs(), bt(), ce(), ct(), dt (+44 more)

### Community 89 - "🚀 Guia Oficial de Deploy na Vercel & Auditoria de Segurança — A.I VISUALS"
Cohesion: 0.20
Nodes (9): 📧 Autenticação e Domínio Próprio no Resend, 🌐 Configuração Global do Resend MCP (Antigravity), 🚀 Guia Oficial de Deploy na Vercel & Auditoria de Segurança — A.I VISUALS, Passo 1: Enviar o Código para o GitHub, Passo 2: Importar o Projeto na Vercel, Passo 3: Configurar Variáveis de Ambiente (Environment Variables), Passo 4: Concluir o Deploy, 📋 Passo a Passo para Deploy na Vercel (+1 more)

### Community 90 - ".computeFrenetFrames"
Cohesion: 0.13
Nodes (5): cr, dr(), Ee(), ki(), pr()

### Community 92 - "U"
Cohesion: 0.05
Nodes (18): ai(), ci(), di(), fi(), gi(), hi(), ii(), li() (+10 more)

### Community 95 - "ar"
Cohesion: 0.09
Nodes (5): ar, kt(), mr, Ut(), yr

### Community 96 - "security_audit.test.ts"
Cohesion: 0.11
Nodes (13): DEFAULT_CONFIG, dynamic, GET(), normalizeShopResourcesConfig(), POST(), dynamic, GET(), dynamic (+5 more)

### Community 97 - ".z"
Cohesion: 0.08
Nodes (4): Gs(), Hs(), qs(), Xs()

### Community 98 - "l"
Cohesion: 0.24
Nodes (6): be(), gt, l(), zr, h(), l()

### Community 100 - "gr"
Cohesion: 0.29
Nodes (3): As(), gr, Vr()

### Community 101 - "library-manager.ts"
Cohesion: 0.15
Nodes (33): dynamic, POST(), DELETE(), dynamic, GET(), PUT(), DELETE(), dynamic (+25 more)

### Community 104 - "V"
Cohesion: 0.08
Nodes (4): De(), ji(), qi(), V

### Community 105 - "react"
Cohesion: 0.09
Nodes (23): react, ErrorProps, GlobalErrorProps, HOME_FAQS, HomePage(), AlternatingHeroShaders(), ArticleData, ArticleModal() (+15 more)

### Community 106 - "script.js"
Cohesion: 0.15
Nodes (6): animate(), closeMobileMenu(), initParticles(), openMobileMenu(), Particle, toggleMobileMenu()

### Community 110 - "MCP Business OS — Plataforma Unificada Soberana"
Cohesion: 0.20
Nodes (7): 📚 Documentação Especializada, 🛠️ Instalação e Execução Local, MCP Business OS — Plataforma Unificada Soberana, Passo a Passo, Pré-requisitos, 🔒 Segurança e Governança, 🏛️ Visão Geral da Arquitetura

### Community 112 - "q"
Cohesion: 0.27
Nodes (3): p(), q, ze

### Community 116 - "ke"
Cohesion: 0.09
Nodes (10): er, v(), ke, j(), tr, R(), ue(), we() (+2 more)

### Community 117 - "memoryCache"
Cohesion: 0.13
Nodes (6): dynamic, POST(), CacheEntry, CacheStats, globalForCache, memoryCache

### Community 118 - "K"
Cohesion: 0.13
Nodes (4): br, K, kr, nr

### Community 119 - "ShopControlSuite.tsx"
Cohesion: 0.19
Nodes (13): PRESET_COVERS, ShopControlSuiteProps, AlternatingHeroBanner(), AlternatingHeroBannerProps, BannerMetricItem, DEFAULT_BANNER_METRICS, ShopData, ShopFeature (+5 more)

### Community 120 - "ResourceCard.tsx"
Cohesion: 0.29
Nodes (5): ResourceCardProps, ResourceDetailViewerProps, LibraryCategoryGroup, LibraryItem, LibraryResponse

### Community 121 - "vercel.json"
Cohesion: 0.29
Nodes (6): buildCommand, cleanUrls, framework, headers, installCommand, $schema

### Community 124 - "verifyAdminRequest"
Cohesion: 0.22
Nodes (18): marked, GET(), DELETE(), dynamic, GET(), POST(), PUT(), slugify() (+10 more)

### Community 127 - "visual_stability.test.mjs"
Cohesion: 0.38
Nodes (5): files, offenders(), read(), rel(), SRC

### Community 130 - "Recursos Adicionais, Shaders & Integrações — MCP Business OS"
Cohesion: 0.15
Nodes (12): 1.1. Catálogo de Shaders Implementados, 1.2. Arquitetura de Execução dos Shaders, 1. Motor Gráfico de Shaders WebGL 2 & Efeitos Visuais, 2.1. Notion API (Gestão de Leads & CRM), 2.2. Resend API (Notificações Transacionais), 2.3. Mercado Pago Checkout Pro (Gateways de Pagamento), 2.4. WhatsApp Direct API, 2. Integrações Externas & Serviços de Terceiros (+4 more)

### Community 131 - "Arquitetura do Backend — MCP Business OS"
Cohesion: 0.22
Nodes (9): 1. Visão Geral do Backend, 2. Camada de Dados (Drizzle ORM & PostgreSQL), 3.1. Hierarquia de Papéis (*Roles*), 3.2. Ciclo de Vida da Sessão, 3. Autenticação Unificada & RBAC, 4. Middleware de Segurança (`src/middleware.ts`), 6. Sementes e Inicialização de Dados (`seed.ts`), Arquitetura do Backend — MCP Business OS (+1 more)

### Community 132 - "2.1. Tabelas e Entidades"
Cohesion: 0.25
Nodes (8): 2.1. Tabelas e Entidades, `admin_users` — Superusuários e Administradores, `articles` — Acervo Editorial Técnico, `auth_sessions` & `system_settings`, `forms` & `form_submissions` — Form Builder Cinemático, `leads` — Tráfego Pago & Captação, `library_items` — Catálogo do Cofre de Recursos, `members` — Comunidade Privada & Área VIP

### Community 133 - "5. Especificação das Rotas de API (REST / JSON)"
Cohesion: 0.25
Nodes (8): 5.1. Autenticação & Sessões, 5.2. Gestão Administrativa (`/api/admin/*`), 5.3. Acervo de Artigos (`/api/articles/*`), 5.4. Form Builder Cinemático (`/api/forms/*` e `/api/submit-form`), 5.5. Biblioteca & Downloads (`/api/library/*`), 5.6. Captação de Leads & Contato, 5.7. Pagamentos & Monetização, 5. Especificação das Rotas de API (REST / JSON)

### Community 134 - "🚀 Os 6 Pilares do Sistema"
Cohesion: 0.29
Nodes (7): 1. Portal Institucional (`/`), 2. Shop Oficial (`/shop`), 3. Comunidade Privada VIP (`/comunidade`), 4. Free Resources Vault (`/biblioteca`), 5. Form Builder Cinemático (`/builder`), 6. Painel Admin & Library Control Suite (`/admin`), 🚀 Os 6 Pilares do Sistema

### Community 136 - "3. Acervos de Dados Embutidos & Ativos Intelectuais"
Cohesion: 0.50
Nodes (4): 3.1. Acervo de 176 Artigos Técnicos, 3.2. Cofre com 406 Recursos Intelectuais, 3.3. Dados do Shop e Perfil Institucional, 3. Acervos de Dados Embutidos & Ativos Intelectuais

### Community 137 - "admin/page.tsx"
Cohesion: 0.09
Nodes (23): metadata, ArticleItem, EndpointLatency, LeadItem, MemberItem, ShopHeroConfig, ShopProductConfig, ShopServiceConfig (+15 more)

### Community 140 - "auth.ts"
Cohesion: 0.29
Nodes (15): drizzle-orm, POST(), POST(), authenticateAdmin(), authenticateMember(), hashPassword(), safeCompare(), verifyPassword() (+7 more)

### Community 141 - "sr"
Cohesion: 0.11
Nodes (12): Ie(), Ne(), nn(), or, sr(), C(), et(), L() (+4 more)

### Community 143 - "lucide-react"
Cohesion: 0.14
Nodes (7): lucide-react, ContatoSection(), ContatoSectionProps, CapturedUTMs, LeadCaptureForm(), backgroundImages, PhotografyContactHubProps

### Community 148 - "Estabilidade Visual & Resolução de GPU Scroll — Incidente INC-2026-10-17-SCROLL"
Cohesion: 0.22
Nodes (9): 📜 As 13 Regras de Ouro de Estabilidade Visual e Performance, Critérios Validados pela Suíte:, 🔍 Diagrama da Arquitetura de Renderização & Gargalos, Estabilidade Visual & Resolução de GPU Scroll — Incidente INC-2026-10-17-SCROLL, 🚀 Ferramenta de Benchmark e Profiling, 📑 Sumário Executivo, 🧪 Suíte de Testes Automatizados de Regressão, 🛠️ Tabela Comparativa: Gambiarras vs. Solução Definitiva (+1 more)

### Community 149 - "🔬 Diagnóstico e Investigação das Causas Raízes"
Cohesion: 0.25
Nodes (8): 1. Causa Raiz Primária: `content-visibility: auto` com `contain-intrinsic-size` Fixo, 2. Causa Raiz Secundária: Sobrecarga de `backdrop-filter` sobre Fundo WebGL Animado, 3. Causa Raiz Terciária: Erro de Compilação no Fragment Shader `RippleGrid`, 4. Causa Raiz Quaternária: Colisão de Cache entre `next build` e `next dev`, 🔬 Diagnóstico e Investigação das Causas Raízes, O Mecanismo da Falha:, O Mecanismo da Falha:, O Problema dos 87 Filtros de Fundo:

### Community 154 - "contact/route.ts"
Cohesion: 0.18
Nodes (11): POST(), attemptsMap, checkRateLimit(), RateLimitRecord, articles, articlesPath, BASE_DIR, requiredComponents (+3 more)

## Knowledge Gaps
- **673 isolated node(s):** `nextConfig`, `name`, `version`, `private`, `description` (+668 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 948 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **36 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `_` connect `_` to `sr`, `it`, `.copy`, `tn`, `W`, `.update`, `community-shaders.js`, `.computeFrenetFrames`, `U`, `ar`, `.z`, `l`, `gr`, `ks`, `le`, `V`, `q`, `en`, `ke`, `K`, `.x`, `.addAttribute`?**
  _High betweenness centrality (0.280) - this node is a cross-community bridge._
- **Why does `cn()` connect `cn` to `Navbar.tsx`, `admin/page.tsx`, `W`, `ShopControlSuite.tsx`, `ResourceCard.tsx`, `Badge.tsx`?**
  _High betweenness centrality (0.227) - this node is a cross-community bridge._
- **Why does `on` connect `W` to `_`?**
  _High betweenness centrality (0.224) - this node is a cross-community bridge._
- **What connects `nextConfig`, `name`, `version` to the rest of the system?**
  _673 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Relatório de Survey Técnico — Explorer 2` be split into smaller, more focused modules?**
  _Cohesion score 0.08 - nodes in this community are weakly interconnected._
- **Should `3. Investigação Detalhada: Projeto 4 — Biblioteca Oculta de Recursos (`s-a-a-s-full-hidden-library`)` be split into smaller, more focused modules?**
  _Cohesion score 0.08695652173913043 - nodes in this community are weakly interconnected._
- **Should `🏛️ RELATÓRIO TÉCNICO DE SURVEY — EXPLORER 3` be split into smaller, more focused modules?**
  _Cohesion score 0.09090909090909091 - nodes in this community are weakly interconnected._