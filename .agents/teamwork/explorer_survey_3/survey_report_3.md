# 🏛️ RELATÓRIO TÉCNICO DE SURVEY — EXPLORER 3
## Arquitetura Global da Plataforma Unificada, Camada de Dados (PostgreSQL + Drizzle ORM), Setup Next.js 15 App Router e Observabilidade Graphify

**Data:** 14 de Outubro de 2026  
**Autor:** Explorer 3 (Survey Teamwork)  
**Destino:** `/Users/mcp/.gemini/antigravity/scratch/plataforma-unificada-soberana`  
**Status:** Concluído — Pronto para Implementação  

---

## 1. Diagnóstico do Diretório de Destino e Repositório

### 1.1. Inspeção do Diretório Alvo
* **Caminho absoluto:** `/Users/mcp/.gemini/antigravity/scratch/plataforma-unificada-soberana`
* **Conteúdo observado:**
  - `ORIGINAL_REQUEST.md` (3.806 bytes) — Requisitos canônicos definidos pelo usuário.
  - `.agents/` — Estrutura de orquestração multi-agente (`teamwork`).
  - Nenhum `package.json`, `tsconfig.json` ou código-fonte foi criado previamente no diretório de destino.
* **Status do Git:**
  - Comando: `git status` no diretório alvo retornou:
    `fatal: not a git repository (or any of the parent directories): .git` (Exit code 128).
  - O diretório encontra-se limpo, pronto para a inicialização controlada (`git init`).

### 1.2. Regra Permanente de Identidade Git (Regra Obrigatória #4)
Ao inicializar o repositório no destino, os seguintes comandos devem ser executados obrigatoriamente:
```bash
git init
git config user.name "Mateus Celestino"
git config user.email "202405039459@alunos.estacio.br"
```
*Critério:* Garantir que commits e pushes utilizem exclusivamente a identidade da conta `@MateusCelestinoProX`, evitando cobranças indevidas de assentos e permitindo integração contínua na Vercel sem falhas de permissão.

---

## 2. Matriz de Convergência das Dependências dos 4 Ecossistemas

Investigamos minuciosamente os quatro ecossistemas de origem para identificar dependências, divergências de versões e desenhar o `package.json` unificado soberano.

### 2.1. Inventário dos 4 Ecossistemas de Origem

| Projeto | Caminho | Stack Original | Principais Dependências Observadas |
| :--- | :--- | :--- | :--- |
| **1. Site Institucional** | `/scratch/mateus-celestino-pro-x` | Vite 6 + React 19 + Tailwind v4 | `@neondatabase/serverless` (^1.2.0), `three` (^0.186.1), `ogl` (^1.0.11), `lucide-react` (^1.16.0), `clsx`, `tailwind-merge` |
| **2. Área de Membros** | `/scratch/visuals-app-saas` | HTML5/Vanilla/Node + API Serverless | `sharp` (^0.35.3), `html-minifier`, Mercado Pago Checkout Pro (API REST), Supabase Auth (Client-side), acervo JSON de 1.7 MB |
| **3. Form Builder** | `/scratch/form-builder-saas` | Next.js 16 (React 19) + Tailwind v4 | `next` (16.2.12), `react` (19.2.4), `@react-three/fiber` (^9.6.1), `@react-three/drei` (^10.7.7), `framer-motion` (^12.43.0), `ogl`, `three`, `lucide-react`, Integrações Notion e Resend |
| **4. Biblioteca Oculta** | `/scratch/s-a-a-s-full-hidden-library` | Python / Static Web / Códex Galadriel | Não possui `package.json`. Contém `build_site.py`, `library_catalog_index.json` (473 KB, 3.486 linhas), APK Mobile (8.8 MB), acervo categorizado |

### 2.2. Resolução de Conflitos e Harmonização

1. **Framework Principal:** Next.js 15 App Router (utilizando `next@15.2.x` estável ou o motor React 19 já validado no form builder `next@16.2.x / 15.x`). Opta-se por Next.js com React 19, compatível com todos os componentes modernos de shaders, OGL e Three.js.
2. **Estilização e Design System:** Tailwind CSS v4 (`tailwindcss@^4.0.0` com `@tailwindcss/postcss@^4.0.0`), unificando os tokens de vidro líquido (`glass-crystal`, `glass-interactive`), cores de marca (`--neon-red: #ff073a`, `--vanta-black: #000000`) e animações.
3. **Motores 3D e Shaders:** Consolidação de `three@^0.186.0`, `@types/three`, `ogl@^1.0.11`, `@react-three/fiber@^9.6.1` e `@react-three/drei@^10.7.7`. Todos os canvas 3D serão renderizados sob diretiva `'use client';` para prevenir conflitos de SSR.
4. **Camada de Dados:** Inclusão de `drizzle-orm@^0.38.3` e `drizzle-kit@^0.30.2`, além de driver PostgreSQL universal `postgres@^3.4.5` (Postgres.js) e `@neondatabase/serverless@^1.2.0`.
5. **Autenticação & Segurança:** Inclusão de `jose` (Web Crypto padrão para JWTs seguros) e `bcryptjs` (hashing seguro de senhas para administradores e membros).
6. **Validação:** Inclusão de `zod@^3.24.1` para validação de endpoints e schemas.

### 2.3. Proposta do `package.json` Unificado

```json
{
  "name": "plataforma-unificada-soberana",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev --port 3000",
    "build": "next build",
    "start": "next start --port 3000",
    "lint": "next lint",
    "db:generate": "drizzle-kit generate",
    "db:push": "drizzle-kit push",
    "db:studio": "drizzle-kit studio",
    "graphify": "graphify update ."
  },
  "dependencies": {
    "@neondatabase/serverless": "^1.2.0",
    "@react-three/drei": "^10.7.7",
    "@react-three/fiber": "^9.6.1",
    "bcryptjs": "^3.0.2",
    "clsx": "^2.1.1",
    "drizzle-orm": "^0.38.3",
    "framer-motion": "^12.43.0",
    "jose": "^5.9.6",
    "lucide-react": "^1.28.0",
    "next": "^15.2.1",
    "ogl": "^1.0.11",
    "postgres": "^3.4.5",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "tailwind-merge": "^3.0.2",
    "three": "^0.186.1",
    "zod": "^3.24.1"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4.0.0",
    "@types/bcryptjs": "^2.4.6",
    "@types/node": "^20.17.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@types/three": "^0.186.0",
    "drizzle-kit": "^0.30.2",
    "eslint": "^9.0.0",
    "eslint-config-next": "^15.2.1",
    "tailwindcss": "^4.0.0",
    "typescript": "^5.7.0"
  }
}
```

---

## 3. Arquitetura da Camada Unificada de Dados (PostgreSQL + Drizzle ORM)

### 3.1. Visão Geral da Modelagem
O requisito R2 exige a substituição de bancos dispersos e mocks locais por uma camada centralizada e tipada sobre PostgreSQL via Drizzle ORM, compatível com Neon Postgres, Supabase e instâncias locais.

### 3.2. Especificação do Schema Drizzle (`db/schema.ts`)

Abaixo está o projeto de schema completo consolidando todas as entidades exigidas no R2:

```typescript
import { 
  pgTable, 
  serial, 
  text, 
  varchar, 
  timestamp, 
  boolean, 
  integer, 
  bigint, 
  jsonb 
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ============================================================
// 1. ADMIN USERS (Administradores da Plataforma)
// ============================================================
export const adminUsers = pgTable('admin_users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 150 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  role: varchar('role', { length: 50 }).default('admin').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  lastLogin: timestamp('last_login', { withTimezone: true }),
});

// ============================================================
// 2. LEADS (Captação de Tráfego, Meta Ads & TikTok Ads)
// ============================================================
export const leads = pgTable('leads', {
  id: serial('id').primaryKey(),
  nome: varchar('nome', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  whatsapp: varchar('whatsapp', { length: 100 }).notNull(),
  servico: varchar('servico', { length: 200 }).notNull(),
  mensagem: text('mensagem').notNull(),
  origem: varchar('origem', { length: 100 }).default('site_institucional').notNull(),
  status: varchar('status', { length: 50 }).default('novo').notNull(), // 'novo', 'em_contato', 'convertido', 'arquivado'
  metadata: jsonb('metadata').default({}).notNull(), // UTM tags, pixel IDs, IP, referrer
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// ============================================================
// 3. MEMBERS (Membros da Comunidade / A.I Visuals)
// ============================================================
export const members = pgTable('members', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  avatarUrl: text('avatar_url'),
  plan: varchar('plan', { length: 100 }).default('free').notNull(), // 'free', 'pro', 'lifetime'
  status: varchar('status', { length: 50 }).default('active').notNull(),
  mercadoPagoCustomerId: varchar('mercado_pago_customer_id', { length: 255 }),
  mercadoPagoPaymentId: varchar('mercado_pago_payment_id', { length: 255 }),
  purchasedProducts: jsonb('purchased_products').default([]).notNull(), // ['ai-art', 'ai-portraits-pro', 'ai-effects-pro']
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  lastLogin: timestamp('last_login', { withTimezone: true }),
});

// ============================================================
// 4. FORMS (Formulários Cinemáticos do Construtor)
// ============================================================
export const forms = pgTable('forms', {
  id: text('id').primaryKey(), // UUID v4 ou ID amigável
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  creatorId: integer('creator_id').references(() => adminUsers.id),
  schema: jsonb('schema').notNull(), // Campos, steps, tipos de input, validações
  settings: jsonb('settings').default({}).notNull(), // notionToken, notionPageUrl, resendApiKey, notifyEmail
  theme: varchar('theme', { length: 50 }).default('galaxy').notNull(), // 'galaxy', 'beams', 'colorbends'
  isPublished: boolean('is_published').default(true).notNull(),
  viewsCount: integer('views_count').default(0).notNull(),
  submissionsCount: integer('submissions_count').default(0).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// ============================================================
// 5. FORM SUBMISSIONS (Envios e Respostas dos Formulários)
// ============================================================
export const formSubmissions = pgTable('form_submissions', {
  id: serial('id').primaryKey(),
  formId: text('form_id').references(() => forms.id, { onDelete: 'cascade' }).notNull(),
  formSlug: varchar('form_slug', { length: 255 }),
  responses: jsonb('responses').notNull(), // Array de { label, answer }
  leadName: varchar('lead_name', { length: 255 }),
  leadEmail: varchar('lead_email', { length: 255 }),
  leadPhone: varchar('lead_phone', { length: 100 }),
  status: varchar('status', { length: 50 }).default('received').notNull(),
  notionSynced: boolean('notion_synced').default(false).notNull(),
  emailNotified: boolean('email_notified').default(false).notNull(),
  metadata: jsonb('metadata').default({}).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// ============================================================
// 6. LIBRARY ITEMS (Biblioteca Oculta / Códex Galadriel)
// ============================================================
export const libraryItems = pgTable('library_items', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 300 }).notNull(),
  category: varchar('category', { length: 100 }).notNull(),
  relPath: text('rel_path').notNull(),
  fileType: varchar('file_type', { length: 50 }).notNull(), // 'md', 'pdf', 'docx', 'apk', 'zip', 'html'
  fileSize: bigint('file_size', { mode: 'number' }).default(0).notNull(),
  textPreview: text('text_preview'),
  tags: jsonb('tags').default([]).notNull(),
  isHidden: boolean('is_hidden').default(false).notNull(),
  downloadsCount: integer('downloads_count').default(0).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// ============================================================
// 7. AUTH SESSIONS (Sessões Seguras JWT / HttpOnly)
// ============================================================
export const authSessions = pgTable('auth_sessions', {
  id: text('id').primaryKey(), // Session UUID
  userId: integer('user_id').notNull(),
  userType: varchar('user_type', { length: 50 }).notNull(), // 'admin' ou 'member'
  tokenHash: text('token_hash').notNull(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  userAgent: text('user_agent'),
  ipAddress: varchar('ip_address', { length: 100 }),
});

// ============================================================
// 8. ARTICLES (Publicações do Hub Institucional)
// ============================================================
export const articles = pgTable('articles', {
  id: serial('id').primaryKey(),
  slug: varchar('slug', { length: 255 }).unique().notNull(),
  title: varchar('title', { length: 300 }).notNull(),
  summary: text('summary').notNull(),
  content: text('content').notNull(),
  category: varchar('category', { length: 100 }).notNull(),
  readTime: varchar('read_time', { length: 50 }).default('5 min').notNull(),
  featured: boolean('featured').default(false).notNull(),
  published: boolean('published').default(true).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// ============================================================
// 9. RELATIONS
// ============================================================
export const formsRelations = relations(forms, ({ many, one }) => ({
  submissions: many(formSubmissions),
  creator: one(adminUsers, {
    fields: [forms.creatorId],
    references: [adminUsers.id],
  }),
}));

export const formSubmissionsRelations = relations(formSubmissions, ({ one }) => ({
  form: one(forms, {
    fields: [formSubmissions.formId],
    references: [forms.id],
  }),
}));
```

### 3.3. Conexão Universal e Resiliência em Localhost (`db/index.ts`)
Para garantir que a aplicação compile e funcione 100% em localhost mesmo quando `DATABASE_URL` ainda não estiver apontada para um PostgreSQL ativo, a camada de banco de dados implementa um padrão de inicialização segura com fallback em memória:
- **Modo Ativo (PostgreSQL / Neon / Supabase):** Quando `process.env.DATABASE_URL` é válida, utiliza `postgres(process.env.DATABASE_URL)` e instancia o Drizzle ORM.
- **Modo Desenvolvimento/Mock:** Se `DATABASE_URL` estiver ausente ou o banco offline, as rotas de API fornecem respostas locais estruturadas e seguras, permitindo que `npm run build` conclua com código 0 e que o desenvolvedor navegue em todas as páginas sem quebras.

---

## 4. Setup do Next.js 15 App Router e Layout Soberano

### 4.1. Estrutura Canônica de Diretórios
```
plataforma-unificada-soberana/
├── app/
│   ├── layout.tsx                # Layout Raiz Soberano (Vanta Black + Vidro + Navbar Global)
│   ├── page.tsx                  # Rota (/): Landing Page Institucional & Shaders
│   ├── globals.css               # Design System Tailwind v4 + Vidro Líquido
│   ├── comunidade/
│   │   ├── page.tsx              # Rota (/comunidade): Catálogo de IA, Membros & Checkout MP
│   │   └── login/page.tsx        # Login exclusivo da Área de Membros
│   ├── builder/
│   │   ├── page.tsx              # Rota (/builder): Construtor Visual Cinemático
│   │   └── [id]/page.tsx         # Visualizador público de formulário renderizado
│   ├── biblioteca/
│   │   └── page.tsx              # Rota (/biblioteca): Códex Galadriel, Busca Instantânea e Downloads
│   ├── admin/
│   │   └── page.tsx              # Painel Administrativo Centralizado (Leads, Membros, Forms)
│   └── api/
│       ├── health/route.ts       # Status da Camada de Dados e Latência
│       ├── leads/route.ts        # POST: Captura de Leads com tracking de Ads
│       ├── auth/
│       │   ├── login/route.ts    # POST: Autenticação JWT (Admin & Membros)
│       │   └── me/route.ts       # GET: Sessão atual
│       ├── payment/
│       │   └── route.ts          # POST: Criação de Preferência Mercado Pago
│       ├── forms/
│       │   ├── route.ts          # GET/POST: Gestão de formulários
│       │   ├── [id]/route.ts     # GET/PUT/DELETE formulário
│       │   └── submit/route.ts   # POST: Submissão com BD + Notion + Resend
│       └── library/
│           └── route.ts          # GET: Catálogo filtrável de arquivos
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx            # Navbar Soberana Unificada Flutuante
│   │   └── Footer.tsx            # Rodapé Oficial Soberano
│   ├── shaders/
│   │   ├── CinematicCanvas.tsx   # Canvas Three.js cliente com troca de shaders
│   │   ├── ColorBends.tsx        # Shader OGL ColorBends
│   │   ├── Beams.tsx             # Shader OGL Beams
│   │   ├── Galaxy.tsx            # Shader OGL Galaxy
│   │   └── BalatroShader.tsx     # Shader Balatro
│   ├── ui/
│   │   ├── GlassCard.tsx         # Card de Vidro Líquido Especular
│   │   ├── SearchModal.tsx       # Busca Global (⌘K)
│   │   └── Toast.tsx             # Notificações visuais
│   ├── portal/                   # Seções Hero, Artigos, Contato do site institucional
│   ├── comunidade/               # Cards de Prompts, Visualizador de Mídias, Botão MP
│   ├── builder/                  # Editor de Campos, Painel de Configurações, Preview
│   └── biblioteca/               # Tabela/Grid de Arquivos, Pré-visualizador e Download
├── db/
│   ├── index.ts                  # Conexão Drizzle ORM resiliente
│   └── schema.ts                 # Schema Unificado
├── lib/
│   ├── auth.ts                   # Utilitários JWT (jose) e hash
│   ├── catalog.ts                # Carregador do library_catalog_index.json
│   └── utils.ts                  # Helpers de classe e formatação
├── public/                       # Assets estáticos, ícones, APK mobile
├── drizzle.config.ts             # Configuração do Drizzle Kit
├── next.config.ts                # Configuração Next.js com transpilePackages
└── tsconfig.json                 # Configuração TypeScript estrita
```

### 4.2. Especificação da Navbar Soberana Unificada (`components/layout/Navbar.tsx`)
A Navbar Soberana substitui as barras isoladas dos 4 projetos, funcionando como a espinha dorsal de navegação:
1. **Identidade Visual:** Vidro líquido cristalino (`backdrop-filter: blur(40px)`), borda superior especular com luz branca e neon red (`#ff073a`), cantos arredondados (`rounded-full` no centro e `rounded-2xl` nos botões).
2. **Rotas Centrais:**
   - **Início (`/`)**: Ícone `Flame` — Portal de Branding & Shaders.
   - **Comunidade (`/comunidade`)**: Ícone `Sparkles` — Área de Membros & Prompts.
   - **Construtor (`/builder`)**: Ícone `Layers` — Form Builder Cinemático.
   - **Biblioteca (`/biblioteca`)**: Ícone `BookOpen` — Códex Galadriel & Acervo.
3. **Indicador de Rota Ativa:** Efeito pílula iluminada (`glass-pill-red`) com barra inferior neon e animação fluida.
4. **Ações à Direita:**
   - **Busca Unificada (`⌘K`)**: Abre modal de busca global indexando Artigos, Prompts e Arquivos da Biblioteca.
   - **Acesso Admin (`/admin`)**: Ícone `Lock` com acesso rápido ao painel de dados.
   - **CTA de Tráfego Direto**: Botão WhatsApp com pulso neon ("AUTOMATIZAR TUDO").
5. **Responsividade Mobile:** Menu horizontal inferior compacto em vidro líquido de alta saturação.

### 4.3. Prevenção de Erros SSR nos Shaders WebGL
Para garantir 100% de sucesso no `npm run build`:
- Todos os componentes em `components/shaders/` devem possuir a diretiva `'use client';` na primeira linha.
- Na renderização de shaders pesados dentro de páginas estáticas ou no `layout.tsx`, recomenda-se a importação dinâmica:
  ```typescript
  import dynamic from 'next/dynamic';
  const CinematicCanvas = dynamic(() => import('@/components/shaders/CinematicCanvas'), { ssr: false });
  ```
- O arquivo `next.config.ts` deve conter:
  ```typescript
  const nextConfig: NextConfig = {
    transpilePackages: ['three', 'ogl', '@react-three/fiber', '@react-three/drei'],
  };
  ```

---

## 5. Pipeline de Compilação Localhost e Observabilidade Graphify

### 5.1. Teste de Compilação em Localhost (`npm run build`)
1. Execução de tipagem TypeScript sem erros (`tsc --noEmit`).
2. Geração otimizada de páginas no App Router com fallback gracioso para rotas dinâmicas.
3. Inexistência de chamadas a serviços externos obrigatórios durante o build estático.
4. Respeito rigoroso às Acceptance Criteria do `ORIGINAL_REQUEST.md`:
   - `npm run build` conclui com sucesso (código 0).
   - Servidor sobe em localhost e rotas principais (`/`, `/comunidade`, `/builder`, `/biblioteca`) retornam HTTP 200.

### 5.2. Observabilidade Estrutural com Graphify (Regra Obrigatória #3)
1. **Instalação e Disponibilidade:** Confirmado via terminal que o utilitário `graphify` está instalado e funcional em `/Users/mcp`.
2. **Procedimento de Inicialização do Mapa:**
   Assim que os arquivos fundamentais forem criados pela equipe de implementação, o grafo deve ser gerado com:
   ```bash
   graphify update .
   ```
   *(Ou `graphify extract . --code-only` caso se deseje extração rápida sem consumo de token de modelo).*
3. **Artefatos Gerados:**
   - `.graphify_manifest.json` (controle incremental)
   - `graphify-out/graph.json` (grafo de dependências e chamadas)
   - `graphify-out/graph.html` (visualização interativa de nós e conexões)
4. **Governança:** A cada alteração ou inclusão de novos módulos na plataforma unificada, o comando `graphify update .` deve ser reexecutado, permitindo consultas instantâneas (`graphify query <modulo>`, `graphify explain <funcao>`).

---

## 6. Checklist de Implementação Recomendado para a Próxima Fase

- [ ] **Passo 1:** Inicializar Git com identidade oficial:
  - `git init`
  - `git config user.name "Mateus Celestino"`
  - `git config user.email "202405039459@alunos.estacio.br"`
- [ ] **Passo 2:** Criar `package.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs` e `drizzle.config.ts` conforme especificado na Seção 2 e 3.
- [ ] **Passo 3:** Executar `npm install` e verificar resolução limpa de dependências.
- [ ] **Passo 4:** Criar `db/schema.ts` com as 8 tabelas centrais e `db/index.ts` com resiliência local.
- [ ] **Passo 5:** Criar `app/globals.css` com o sistema Apple Liquid Glass e Tailwind v4.
- [ ] **Passo 6:** Criar `components/layout/Navbar.tsx` e `components/layout/Footer.tsx`.
- [ ] **Passo 7:** Portar os componentes de Shaders (`CinematicCanvas`, `ColorBends`, `Beams`, `Galaxy`, `Balatro`) em `components/shaders/` com `'use client';`.
- [ ] **Passo 8:** Estruturar as 4 rotas no App Router:
  - `app/page.tsx` (Portal & Tráfego)
  - `app/comunidade/page.tsx` (Membros & Prompts de IA)
  - `app/builder/page.tsx` (Construtor Cinemático)
  - `app/biblioteca/page.tsx` (Códex Galadriel & Catálogo)
- [ ] **Passo 9:** Implementar endpoints unificados em `app/api/` (`/api/leads`, `/api/forms/submit`, `/api/payment`, `/api/auth`, `/api/library`, `/api/health`).
- [ ] **Passo 10:** Executar `npm run build` para validação de integridade.
- [ ] **Passo 11:** Executar `graphify update .` para observabilidade estrutural permanente.

---
*Relatório elaborado e aprovado pelo Explorer 3.*
