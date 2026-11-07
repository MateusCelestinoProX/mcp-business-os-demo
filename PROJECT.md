# Project: Plataforma Unificada Soberana — Mateus Celestino Pro

## Architecture
A Plataforma Unificada Soberana consolida os 4 ecossistemas independentes de software em uma única aplicação web de altíssima performance em Next.js 15 (App Router), React 19, Tailwind CSS e TypeScript, com motor gráfico WebGL (Three.js 0.186 & OGL 1.0.11), camada de dados universal PostgreSQL com Drizzle ORM, e observabilidade estrutural Graphify.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        SHELL SOBERANO & NAVBAR                         │
│             (Apple Liquid Glassmorphism Dark Premium #0a0a0c)          │
├───────────────┬──────────────────┬─────────────────┬───────────────────┤
│    PORTAL     │    COMUNIDADE    │  FORM BUILDER   │ BIBLIOTECA OCULTA │
│ Institucional │ Área de Membros  │    Cinemático   │   406 Recursos    │
│      (/)      │   (/comunidade)  │    (/builder)   │   (/biblioteca)   │
├───────────────┴──────────────────┴─────────────────┴───────────────────┤
│                     MOTOR DE SHADERS WEBGL (60 FPS)                    │
│      (CinematicCanvas, Galaxy, Beams, ColorBends, ShaderBackground)    │
├────────────────────────────────────────────────────────────────────────┤
│                 CAMADA UNIVERSAL DE DADOS DRIZZLE ORM                  │
│       (PostgreSQL / Neon: leads, members, forms, library, auth)        │
└────────────────────────────────────────────────────────────────────────┘
```

---

## Feature Inventory
| # | Feature | Descrição | Milestone | Fonte de Origem |
|---|---------|-----------|-----------|-----------------|
| 1 | Shell Soberano & Design System | Setup Next.js 15, Tailwind, Navbar fluida e Glassmorphism | M1 (Foundations) | mateus-celestino-pro-x & visuals-app-saas |
| 2 | Motor de Shaders WebGL | CinematicCanvas, Galaxy, Beams, ColorBends a 60 FPS com 'use client' | M2 (Shaders) | mateus-celestino-pro-x & form-builder-saas |
| 3 | Camada de Dados Drizzle ORM | Schema consolidado em PostgreSQL (leads, members, forms, library, auth) | M3 (Database) | Todos os 4 projetos |
| 4 | Autenticação Unificada | Sessões seguras, JWT via jose, hash bcrypt e middleware | M3 (Database) | visuals-app-saas |
| 5 | Portal Institucional & Tráfego | Landing page de alta conversão, vitrine e prova social | M4 (Marketing) | mateus-celestino-pro-x |
| 6 | Transição Direta de Autoridade | Conexão fluida do Hero cinematográfico à biografia de Mateus Celestino | M4 (Marketing) | mateus-celestino-pro-x |
| 7 | Captura de Leads Tráfego Pago | Rota /api/leads com parâmetros UTM (TikTok Ads e Meta Ads) | M4 (Marketing) | mateus-celestino-pro-x |
| 8 | Área de Membros & Comunidade | Dashboard restrito, feed comunitário e comunicados | M5 (Members) | visuals-app-saas |
| 9 | Catálogo de Mídias & Vídeos | Player de alta definição cinemático em /comunidade/midias | M5 (Members) | visuals-app-saas |
| 10 | Checkout Mercado Pago | Rota /api/payment/checkout e webhook de confirmação | M5 (Members) | visuals-app-saas |
| 11 | Editor Visual de Formulários | Construtor multi-step com múltiplos campos e Live Preview | M6 (Builder) | form-builder-saas |
| 12 | Rota Pública de Formulários | Renderizador dinâmico /builder/f/[id] para respondentes | M6 (Builder) | form-builder-saas |
| 13 | Notificações Notion & Resend | Submissão /api/forms/submit com automação de email e CRM | M6 (Builder) | form-builder-saas |
| 14 | Cofre da Biblioteca Oculta | Interface /biblioteca com Cerimônia de Boas-Vindas | M7 (Library) | s-a-a-s-full-hidden-library |
| 15 | Catálogo 406 Recursos | Busca com debounce, paginação e visualizador de múltiplos formatos | M7 (Library) | s-a-a-s-full-hidden-library |
| 16 | Rota de Download Seguro | Endpoint /api/library/download com telemetria | M7 (Library) | s-a-a-s-full-hidden-library |
| 17 | Compilação e Build Localhost | npm run build concluído sem erros TypeScript/SSR | M8 (Auditor) | Requisito R4 |
| 18 | Observabilidade Graphify | Grafo de dependências gerado e atualizado (graphify update .) | M8 (Auditor) | Regra Global Graphify |

---

## Milestones
| # | Nome | Escopo | Responsável | Status |
|---|------|--------|-------------|--------|
| M1 | Foundations & Shell Soberano | Next.js 15, package.json, Tailwind, Shell, Navbar, UI base | agent-foundations (`f29aeb8e`) | **DONE** |
| M2 | WebGL & Shaders Engine | CinematicCanvas, Galaxy, Beams, ColorBends, Background | agent-shaders (`a711df2f`) | **DONE** |
| M3 | Drizzle ORM & Auth Layer | Schema consolidado PostgreSQL, conexão resiliente, JWT | agent-database (`a60e82ea`) | **DONE** |
| M4 | Portal Institucional & Leads | Landing Page, Bio Autor, formulário UTM TikTok/Meta | agent-marketing (`cf9148ba`) | **DONE** |
| M5 | Área de Membros & Comunidade | Dashboard, Feed, Vídeos, Checkout Mercado Pago | agent-members (`9f936e71`) | **DONE** |
| M6 | Form Builder Cinemático | Construtor, Live Preview, submissão, Resend/Notion | agent-builder (`f64d22d7`) | **DONE** |
| M7 | Biblioteca Oculta de Recursos | Catálogo 406 itens, busca instantânea, downloads | agent-library (`7af0bb02`) | **DONE** |
| M8 | Auditoria Forense & Graphify | npm run build, graphify update ., validação localhost | agent-auditor (`5c0973c3`) | **DONE** |
| M9 | Shop Oficial & Header Unificado | Nova rota /shop no header soberano, integração Balatro | agent-shop (`7b819e4a`) | **DONE** |

---

## Interface Contracts

### 1. Camada de Dados Drizzle ORM (`src/lib/db/schema.ts`)
- `admin_users`: `{ id: string, email: string, password_hash: string, role: string, name: string }`
- `leads`: `{ id: serial, name: string, email: string, phone: string, source: string, utm_source?: string, utm_campaign?: string }`
- `members`: `{ id: uuid, email: string, password_hash: string, name: string, status: 'active' | 'pending' | 'inactive', tier: string }`
- `forms`: `{ id: uuid, title: string, slug: string, schema_json: any, is_active: boolean }`
- `form_submissions`: `{ id: uuid, form_id: uuid, data_json: any, ip_address?: string }`
- `library_items`: `{ id: string, title: string, category: string, file_url: string, size_bytes: number, tags: any }`
- `articles`: `{ id: string, slug: string, title: string, content: string, cover_url: string }`

### 2. Endpoints de API REST / JSON
- `POST /api/leads` -> Body: `{ name, email, phone, source, utm_source, utm_campaign }` -> Response: `{ success: true, leadId }` (HTTP 201)
- `POST /api/auth/login` -> Body: `{ email, password }` -> Response: `{ success: true, token, user }` (HTTP 200)
- `POST /api/payment/checkout` -> Body: `{ planId, memberId }` -> Response: `{ init_point: string }` (HTTP 200)
- `POST /api/forms/submit` -> Body: `{ formId, answers: Record<string, any> }` -> Response: `{ success: true, submissionId }` (HTTP 201)
- `GET /api/library` -> Query: `?q=prompt&category=IA&page=1` -> Response: `{ items: Item[], total, page }` (HTTP 200)

### 3. Shaders WebGL (`src/components/shaders/ShaderBackground.tsx`)
- Props: `{ mode?: 'galaxy' | 'beams' | 'colorbends' | 'gridscan', opacity?: number, className?: string }`
- Diretiva: `'use client';` com carregamento dinâmico SSR-safe (`next/dynamic` com `{ ssr: false }`).

---

## Code Layout
```
/Users/mcp/.gemini/antigravity/scratch/plataforma-unificada-soberana/
├── package.json               # Dependências unificadas Next 15 + React 19 + Three/OGL + Drizzle
├── tsconfig.json              # Configuração TypeScript com alias @/*
├── next.config.ts             # Configuração Next.js 15
├── tailwind.config.ts         # Design tokens oficial Mateus Celestino Pro
├── postcss.config.mjs
├── .env.example
├── public/
│   ├── assets/covers/         # Capas dos 176 artigos
│   └── data/
│       └── library_catalog_index.json  # Catálogo oficial dos 406 recursos
└── src/
    ├── app/
    │   ├── layout.tsx         # Shell Soberano com Navbar e Footer
    │   ├── globals.css        # Glassmorphism dark styles & CSS variables
    │   ├── page.tsx           # Portal Institucional (/)
    │   ├── comunidade/        # Área de Membros (/comunidade)
    │   ├── builder/           # Form Builder Cinemático (/builder)
    │   ├── biblioteca/        # Biblioteca Oculta de Recursos (/biblioteca)
    │   └── api/               # API Routes unificadas (/api/*)
    ├── components/
    │   ├── layout/            # Navbar, Footer
    │   ├── ui/                # GlassCard, Button, Badge, Input
    │   ├── shaders/           # CinematicCanvas, Galaxy, Beams, ColorBends
    │   ├── portal/            # HeroSection, Articles, LeadCaptureForm
    │   ├── comunidade/        # VideoPlayer, CommunityFeed, MemberCard
    │   ├── builder/           # FormCanvas, LivePreview, FormRunner
    │   └── library/           # CatalogGrid, SearchHeader, ResourceViewer
    └── lib/
        ├── db/                # Drizzle schema, conexão PostgreSQL, seed
        ├── auth/              # JWT, hash de senhas, sessões seguras
        └── utils.ts           # Helpers (cn, formatações)
```
