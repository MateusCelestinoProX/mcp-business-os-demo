# Relatório de Survey Técnico — Explorer 2
**Plataforma Unificada Soberana (Mateus Celestino Pro)**
**Data:** 2026-10-14  
**Escopo:**
1. Projeto 2: Área de Membros & Comunidade Fechada (`/Users/mcp/.gemini/antigravity/scratch/visuals-app-saas`)
2. Projeto 3: Form Builder Cinemático (`/Users/mcp/.gemini/antigravity/scratch/form-builder-saas`)

---

## 1. Sumário Executivo

Este relatório detalha a arquitetura, regras de negócio, dados, segurança, interfaces visuais e fluxos transacionais dos dois projetos de ecossistema sob a responsabilidade do Explorer 2:
1. **Área de Membros & Comunidade Fechada (`visuals-app-saas`)**: Uma aplicação de experiência líquida (Apple Liquid Glass VisionOS) voltada à entrega de prompts de inteligência artificial de alta fidelidade, cursos/aulas organizadas em servidores temáticos, feed social interativo da comunidade (posts, mídias, comentários e curtidas), integração com Mercado Pago Checkout Pro (Pix e parcelamento em 12x) e e-mails transacionais via Resend.
2. **Form Builder Cinemático (`form-builder-saas`)**: Um construtor visual de formulários de onboarding e diagnóstico corporativo de alta conversão, com renderização em tempo real de shaders WebGL avançados (Three.js, OGL e React Bits), autenticação segura de administrador com proteção contra timing attacks, e submissão automatizada com despacho paralelo para a API do Notion Business e notificações via Resend.

Ambos os projetos possuem elevado refinamento estético e aderência aos requisitos soberanos de Mateus Celestino Pro (dark mode radical, vidro fosco, shaders WebGL a 60 FPS e tipografia premium). Abaixo são mapeadas as estruturas necessárias para sua fusão definitiva no Next.js 15 App Router com Drizzle ORM sobre PostgreSQL.

---

## 2. Projeto 2: Área de Membros & Comunidade Fechada (`visuals-app-saas`)

### 2.1 Visão Geral e Estrutura de Arquivos
- **Caminho absoluto:** `/Users/mcp/.gemini/antigravity/scratch/visuals-app-saas`
- **Pilha tecnológica atual:** Vanilla JavaScript (ES6+), HTML5, Tailwind CSS (via CDN), Supabase SDK v2 (`@supabase/supabase-js`), Mercado Pago SDK v2, YouTube IFrame API, Three.js r128, GSAP 3.12, Lucide Icons.
- **Estrutura de diretórios:**
  ```
  visuals-app-saas/
  ├── api/
  │   ├── create-payment.js        # Vercel Serverless Function: Criação de Preference Mercado Pago
  │   └── send-email.js            # Vercel Serverless Function: E-mails transacionais via Resend
  ├── netlify/
  │   └── functions/
  │       └── create-payment.js    # Netlify Function espelho para Mercado Pago
  ├── public/
  │   └── assets/
  │       └── images/              # 1.172 imagens WebP otimizadas (56 MB total)
  ├── src/
  │   └── data/
  │       └── products_data.json   # 1,73 MB com 3 produtos, 40 categorias e centenas de prompts
  ├── effects/                     # 122 pastas com renders e prompts em HTML/CSV
  ├── app.js                       # 2.687 linhas de lógica (Core do Frontend SPA)
  ├── index.html                   # 1.167 linhas de marcação e componentes glass
  ├── package.json                 # Versão 7.0.0, scripts de build e serve
  └── DEPLOY.MD                    # Documentação e auditoria de variáveis de ambiente
  ```

### 2.2 Autenticação, Sessões e Controle de Acesso (RBAC)
No projeto de origem, a autenticação ocorre no client-side via Supabase Auth (`sb.auth`):
- Login via `sb.auth.signInWithPassword({ email, password })`.
- Cadastro via `sb.auth.signUp({ email, password, options: { data: { name } } })`.
- Gestão de sessão em tempo real com `sb.auth.onAuthStateChange` e `sb.auth.getSession()`.
- Hierarquia estrita de papéis de usuário (`USER_ROLES`):
  1. `guest` (Nível -2): Visitante não logado, apenas preview bloqueado.
  2. `free` (Nível -1): Membro cadastrado gratuitamente; visualiza amostras.
  3. `level_0` (Nível 0): Acesso ao produto 1 (`ai-art` / A.I ART PRO).
  4. `level_1` (Nível 1): Acesso a 2 produtos (`ai-art` + `ai-portraits-pro`).
  5. `level_2` (Nível 2): Acesso a 3 produtos (`ai-art` + `ai-portraits-pro` + `ai-effects-pro`).
  6. `full` (Nível 99): VIP Full Access vitalício a todos os produtos presentes e futuros.
  7. `moderator` (Nível 10): Pode gerenciar servidores, aulas e moderar comunidade.
  8. `admin` (Nível 999): Acesso irrestrito a todos os acervos, painel admin, métricas, banners e gestão de usuários.
- **Proteção do Super Admin:** O e-mail `mcp6667@proton.me` possui salvaguarda no código contra exclusão ou rebaixamento de privilégios.

### 2.3 Catálogo de Mídias, Prompts e Vídeos
1. **Acervo de Prompts (`src/data/products_data.json`):**
   - **Produto 1 (`ai-art`):** A.I ART PRO — "Edição Artística Ultra Premium", `access_level: 0`, 40 categorias (`TERROR`, `COSMIC`, `SURREAL`, `CINEMATIC`, etc.), dezenas de variações com texto do prompt em inglês para IA generativa e link local para imagem webp em `public/assets/images/`.
   - **Produto 2 (`ai-portraits-pro`):** A.I PORTRAITS PRO — Retratos hiper-realistas, moda, iluminação e fotografia editorial.
   - **Produto 3 (`ai-effects-pro`):** A.I EFFECTS PRO — Texturas 3D, efeitos de objetos, renderizações conceituais.
   - **Total de imagens locais:** 1.172 arquivos `.webp` pesando 56 MB, já comprimidos e prontos para servir em `/public/assets/images/`.
2. **Motor de Vídeo de Fundo Cinemático (Crossfade sem som):**
   - Sistema dual layer (`#bg-player-a` e `#bg-player-b`) para transição suave de 2.500ms entre vídeos.
   - **Servidor 1 (CloudFront MP4):** 7 vídeos MP4 hospedados em CDN CloudFront (`https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/...mp4`).
   - **Servidor 2 (YouTube Ambient):** Playlist com 19 IDs de vídeos do YouTube em modo silencioso e em loop contínuo.
   - Controles visuais no cliente para alternar servidor de vídeo, ajustar nível de desfoque (`blur`) de 0px a 20px e escurecimento (`darkness`) de 0% a 90%.

### 2.4 Interação Social e Comunidade (`/comunidade`)
O módulo de comunidade provê uma rede social fechada e completa:
- **Publicações (`community_posts`):** Criação de posts com título, conteúdo em texto, links enriquecidos e múltiplas imagens (via upload em Supabase Storage).
- **Fixação (`is_pinned`):** Posts de administradores/moderadores podem ser fixados no topo do feed.
- **Curtidas (`community_likes`):** Sistema reativo com toggle de like por usuário e contagem instantânea.
- **Comentários (`community_comments`):** Respostas encadeadas aos posts com identificação visual do papel do membro (badges personalizadas para Admin, Moderador, Full VIP e Membro Free).
- **Moderação:** Exclusão de posts e comentários inapropriados por moderadores e administradores.

### 2.5 Módulo SERVERS (Cursos & Aulas)
- Estrutura inspirada no Discord e plataformas de streaming:
  - Tabela `servers`: canais/módulos principais com título, descrição e imagem de capa (`hero_image`).
  - Tabela `server_lessons`: aulas vinculadas ao servidor, contendo título, URL de vídeo (YouTube embed ou MP4 CloudFront), ordem de exibição (`display_order`) e conteúdo formatado em Markdown (`content_markdown`).
  - CRUD completo integrado para administradores e moderadores (criação, edição e exclusão de servidores e aulas com modais fluidos).

### 2.6 Integração Mercado Pago Checkout Pro (`/api/create-payment`)
- Endpoint HTTP POST recebendo `{ productSlug, userEmail, productTitle }`.
- Tabela de preços pré-configurada:
  - `ai-art`: R$ 120,00
  - `ai-portraits-pro`: R$ 120,00
  - `ai-effects-pro`: R$ 120,00
- Criação de `Preference` na API do Mercado Pago (`https://api.mercadopago.com/checkout/preferences`):
  - Suporte a Pix e Cartão de Crédito em até 12x.
  - `back_urls`: URLs de retorno dinâmicas para `/?payment=success&product={productSlug}`, `/?payment=failure` e `/?payment=pending`.
  - `auto_return: 'approved'`.
  - `notification_url: siteUrl + '/api/payment-webhook'`.
  - `external_reference: productSlug + '_' + Date.now()`.
  - Retorna `init_point` (produção) ou `sandbox_init_point` (testes).
- E-mails pós-compra disparados via `/api/send-email` (`type: 'purchase_success'`).

---

## 3. Projeto 3: Form Builder Cinemático (`form-builder-saas`)

### 3.1 Visão Geral e Estrutura de Arquivos
- **Caminho absoluto:** `/Users/mcp/.gemini/antigravity/scratch/form-builder-saas`
- **Pilha tecnológica atual:** Next.js 16.2.12 (compatível com 15), React 19.2.4, TypeScript 5, Tailwind CSS v4 (`@tailwindcss/postcss`), Three.js (`^0.185.1`), OGL (`^1.0.11`), `@react-three/fiber` (`^9.6.1`), `@react-three/drei` (`^10.7.7`), Framer Motion (`^12.43.0`), Lucide React (`^1.28.0`), `@supabase/supabase-js` (`^2.111.0`).
- **Estrutura de diretórios:**
  ```
  form-builder-saas/
  ├── app/
  │   ├── api/
  │   │   ├── auth/verify-password/route.ts   # Autenticação de admin com timing-safe crypto
  │   │   └── submit-form/route.ts            # Envio para Notion Business e Resend
  │   ├── builder/
  │   │   └── page.tsx                        # Editor visual cinemático (1.105 linhas de código)
  │   ├── components/
  │   │   ├── Beams.jsx & Beams.css           # React Bits Three.js/Fiber Beams Shader
  │   │   ├── ColorBends.jsx & ColorBends.css # Three.js ColorBends Wave Shader
  │   │   ├── Galaxy.jsx & Galaxy.css         # OGL Galaxy Particles Shader
  │   │   └── CinematicCanvas.tsx             # Orquestrador dos 7 Shaders WebGL
  │   ├── globals.css                         # Variáveis de cor, Glassmorphism, Tailwind v4
  │   ├── layout.tsx                          # Root layout Next.js
  │   └── page.tsx                            # Dashboard de formulários salvos e alternador de perfil
  ├── public/
  │   ├── media/header-cover.mp4              # Vídeo oficial de capa de alta qualidade (4,3 MB)
  │   ├── index.html & script.js & styles.css # Versão standalone do formulário de 30 perguntas
  │   ├── metaballs.js                        # Metaballs WebGL Shader para pop-up de aviso (35 balls)
  │   └── shaders.js                          # ShaderEngine standalone
  └── package.json                            # Dependências e scripts
  ```

### 3.2 O Construtor Visual Cinemático (`/builder`)
O editor visual em `app/builder/page.tsx` é dividido em 4 abas completas com preview em tempo real:
1. **Aba "Estrutura" (Editor):**
   - Criação e ordenação de etapas/páginas ilimitadas.
   - Cada página possui título, subtítulo e seleção de Shader WebGL (etapas 1 a 7).
   - Adição dinâmica de campos nos formatos: Texto (`text`), Número (`number`) e Múltipla Escolha (`choice`).
   - Configuração de rótulo (`label`), placeholder, opções personalizadas e obrigatoriedade (`required`).
   - Botão para importar o **Modelo Mestre Oficial de Onboarding** (4 etapas e 30 perguntas pré-configuradas).
2. **Aba "Design":**
   - Customização do título do cabeçalho estilo macOS (`headerName`).
   - Paleta de 12 Cores de Marca:
     - Neon Blood Red (`#FF0033`)
     - Electric Sapphire (`#0066FF`)
     - Neon Emerald (`#00FF66`)
     - Deep Violet (`#A855F7`)
     - Cyber Amber (`#FF6B00`)
     - Hot Magenta (`#EC4899`)
     - Cyan Ether (`#06B6D4`)
     - Luxury Gold (`#EAB308`)
     - Mint Glow (`#14B8A6`)
     - Ultra Indigo (`#6366F1`)
     - Sanguine Crimson (`#E11D48`)
     - Titanium Glass (`#94A3B8`)
   - URL do banner de capa (imagem ou vídeo de topo).
3. **Aba "Integrações":**
   - Configuração de credenciais corporativas do Notion: `Notion Integration Token` e `URL da Página Mãe no Notion`.
   - Configuração do Resend: `Resend API Key` e `E-mail de Destino para Notificações`.
   - Bloqueio inteligente para visitantes (somente Admin autenticado pode salvar credenciais sensíveis).
4. **Aba "Preview":**
   - Renderização idêntica ao produto final entregue ao cliente.
   - Fundo animado pelos Shaders WebGL controlados pela página ativa.
   - Componentes em vidro líquido com saturação e reflexos dinâmicos.
   - Validação de campos obrigatórios e navegação entre etapas.
   - Teste de submissão interativa chamando `/api/submit-form`.

### 3.3 Engine de Shaders Cinemáticos (`CinematicCanvas.tsx`)
O componente `CinematicCanvas.tsx` sintetiza 7 motores gráficos de shaders WebGL a 60 FPS:
- **Passo 1 — DarkVeil:** Ondas senoidais e cossenoidais profundas em tons de obsidiana com a cor de destaque ativa.
- **Passo 2 — Strands:** Múltiplos filamentos harmônicos incandescentes com brilho difuso volumétrico.
- **Passo 3 — Balatro:** Efeito psicodélico rotacional com dobra de espaço e distorção tridimensional.
- **Passo 4 — LiquidEther:** Fluido orgânico reflexivo com distorção por coordenadas UV cruzadas.
- **Passo 5 — Beams (React Bits Three.js/Fiber):** Feixes luminosos volumétricos verticais com ruído procedural.
- **Passo 6 — ColorBends (Three.js):** Faixas de gradiente onduladas com deformação por campo de força vetorial.
- **Passo 7 — Galaxy (OGL):** Espiral galáctica de partículas interativas com rotação estelar e repulsão por ponteiro do mouse.

### 3.4 Motor de Formulários Interativos & Validação (Pop-up de 6 Segundos)
- **Modal de Aviso Obrigatório:**
  - Carregado na entrada do formulário com animação de fundo em Metaballs WebGL vermelho neon.
  - Temporizador travado de 6 segundos (`Aguarde (6s)...`).
  - Bloqueio contra clique fora e tecla `Escape`.
  - Botão "Estou ciente" desbloqueado somente após a contagem regressiva zerar.
- **Modal Customizado Glassmorphism de Validação:**
  - Substitui o alert padrão do navegador por um pop-up elegante em vidro escuro quando campos obrigatórios não são preenchidos.
- **Modelo Mestre de Onboarding Corporativo (30 Perguntas em 4 Seções):**
  - **Etapa 1 (Dados da Empresa):** Razão Social, CNPJ, E-mail Corporativo, WhatsApp, Instagram, Estado/Cidade, Bairro, Endereço.
  - **Etapa 2 (Dados do Sócio Responsável):** Nome Completo, Naturalidade, Data de Nascimento, CEP, Estado/Cidade, Bairro, Telefone Direto.
  - **Etapa 3 (Perfil & Diagnóstico do Negócio):** Faixa Etária, Escolaridade, Origem da Indicação, Faturamento Atual, Meta para 12 meses, Maior Dificuldade, Sentimento diante do Desafio, Motivo da Escolha de Mateus Celestino Pro, Dúvidas prévias, Pergunta informal do Café.
  - **Etapa 4 (Inteligência Artificial & Meta):** Conhecimento de IA, Histórico de Tentativas de IA, Expectativa Principal, Descrição Detalhada do Modelo de Negócio, Orçamento Disponível para IA e Tecnologia.

### 3.5 Submissão de Dados & Automações (`/api/submit-form`)
- **Payload Recebido:**
  ```typescript
  interface SubmitFormPayload {
    formTitle: string;
    responses: Array<{ label: string; answer: string }>;
    notionToken?: string;
    notionPageUrl?: string;
    resendApiKey?: string;
    notifyEmail?: string;
  }
  ```
- **Gravação no Notion Business:**
  - Extração automática do ID da página-mãe via regex (32 caracteres hexadecimais).
  - Chamada à API oficial do Notion: `PATCH https://api.notion.com/v1/blocks/{parentPageId}/children`.
  - Criação de bloco Callout com emoji 🚀 e fundo vermelho (`red_background`), cabeçalho `heading_2` e parágrafos com rótulo em negrito e resposta do cliente com recuo.
- **Disparo de E-mail via Resend:**
  - Chamada HTTP POST: `https://api.resend.com/emails`.
  - Notificação formatada em HTML com paleta dark `#030305` e destaque vermelho `#FF0033` contendo todas as perguntas e respostas preenchidas.

### 3.6 Autenticação do Administrador (`/api/auth/verify-password`)
- Endpoint POST com validação segura no servidor:
  - Comparação via `crypto.timingSafeEqual` para prevenir ataques de temporização (timing attacks).
  - Senha do administrador lida de `process.env.ADMIN_PASSWORD` com fallback seguro.
  - Geração de token de sessão criptográfico (`crypto.randomBytes(32).toString('hex')`).

---

## 4. Mapeamento de Schemas Unificados para PostgreSQL & Drizzle ORM

Atualmente, `visuals-app-saas` utiliza tabelas Supabase e `form-builder-saas` utiliza `localStorage` no client-side para armazenar os formulários construídos. Para atender integralmente ao requisito **R2** da unificação em PostgreSQL via Drizzle ORM, foram mapeadas as seguintes entidades e relações:

### 4.1 Entidades da Área de Membros & Comunidade (`members` e redes sociais)

```typescript
// 1. Perfis de Membros & Autenticação
export const members = pgTable('members', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  name: varchar('name', { length: 150 }).notNull(),
  bio: text('bio'),
  avatarUrl: text('avatar_url'),
  role: varchar('role', { length: 50 }).default('free').notNull(), // guest, free, level_0, level_1, level_2, full, moderator, admin
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// 2. Permissões de Moderadores
export const moderatorPermissions = pgTable('moderator_permissions', {
  id: uuid('id').primaryKey().defaultRandom(),
  memberId: uuid('member_id').references(() => members.id, { onDelete: 'cascade' }).notNull(),
  canManageServers: boolean('can_manage_servers').default(true).notNull(),
  canManageCommunity: boolean('can_manage_community').default(true).notNull(),
  canManageBanners: boolean('can_manage_banners').default(false).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// 3. Servidores de Aprendizado (Cursos)
export const servers = pgTable('servers', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: varchar('title', { length: 200 }).notNull(),
  description: text('description'),
  heroImage: text('hero_image'),
  displayOrder: integer('display_order').default(0).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// 4. Aulas dos Servidores
export const serverLessons = pgTable('server_lessons', {
  id: uuid('id').primaryKey().defaultRandom(),
  serverId: uuid('server_id').references(() => servers.id, { onDelete: 'cascade' }).notNull(),
  title: varchar('title', { length: 200 }).notNull(),
  videoUrl: text('video_url'),
  contentMarkdown: text('content_markdown'),
  displayOrder: integer('display_order').default(0).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// 5. Postagens da Comunidade
export const communityPosts = pgTable('community_posts', {
  id: uuid('id').primaryKey().defaultRandom(),
  memberId: uuid('member_id').references(() => members.id, { onDelete: 'cascade' }).notNull(),
  title: varchar('title', { length: 250 }),
  content: text('content').notNull(),
  linkUrl: text('link_url'),
  linkTitle: varchar('link_title', { length: 200 }),
  images: jsonb('images').$type<string[]>().default([]).notNull(),
  isPinned: boolean('is_pinned').default(false).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// 6. Comentários da Comunidade
export const communityComments = pgTable('community_comments', {
  id: uuid('id').primaryKey().defaultRandom(),
  postId: uuid('post_id').references(() => communityPosts.id, { onDelete: 'cascade' }).notNull(),
  memberId: uuid('member_id').references(() => members.id, { onDelete: 'cascade' }).notNull(),
  content: text('content').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// 7. Curtidas da Comunidade
export const communityLikes = pgTable('community_likes', {
  id: uuid('id').primaryKey().defaultRandom(),
  postId: uuid('post_id').references(() => communityPosts.id, { onDelete: 'cascade' }).notNull(),
  memberId: uuid('member_id').references(() => members.id, { onDelete: 'cascade' }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// 8. Compras e Acessos Mercado Pago
export const userPurchases = pgTable('user_purchases', {
  id: uuid('id').primaryKey().defaultRandom(),
  memberId: uuid('member_id').references(() => members.id, { onDelete: 'cascade' }).notNull(),
  productSlug: varchar('product_slug', { length: 100 }).notNull(),
  paymentId: varchar('payment_id', { length: 150 }),
  paymentStatus: varchar('payment_status', { length: 50 }).notNull(),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  externalReference: varchar('external_reference', { length: 150 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// 9. Banners Informativos
export const banners = pgTable('banners', {
  id: uuid('id').primaryKey().defaultRandom(),
  type: varchar('type', { length: 50 }).default('promo').notNull(),
  title: varchar('title', { length: 200 }).notNull(),
  subtitle: text('subtitle'),
  imageUrl: text('image_url'),
  linkUrl: text('link_url'),
  linkLabel: varchar('link_label', { length: 100 }),
  isActive: boolean('is_active').default(true).notNull(),
  displayOrder: integer('display_order').default(0).notNull(),
  createdBy: uuid('created_by').references(() => members.id),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});
```

### 4.2 Entidades do Form Builder Cinemático (`forms` e `form_submissions`)

```typescript
// 10. Formulários Criados pelo Construtor
export const forms = pgTable('forms', {
  id: varchar('id', { length: 100 }).primaryKey(), // ex: form_1713...
  headerName: varchar('header_name', { length: 150 }).default('MATEUS CELESTINO PRO').notNull(),
  formTitle: varchar('form_title', { length: 200 }).notNull(),
  accentColor: varchar('accent_color', { length: 30 }).default('#FF0033').notNull(),
  bannerUrl: text('banner_url'),
  notionToken: text('notion_token'),
  notionPageUrl: text('notion_page_url'),
  resendApiKey: text('resend_api_key'),
  notifyEmail: varchar('notify_email', { length: 255 }),
  pages: jsonb('pages').$type<Array<{
    id: string;
    title: string;
    subtitle: string;
    shaderStep: number;
    bannerUrl?: string;
  }>>().notNull(),
  questions: jsonb('questions').$type<Array<{
    id: string;
    pageId: string;
    type: 'text' | 'number' | 'choice';
    label: string;
    placeholder?: string;
    options?: string[];
    required: boolean;
  }>>().notNull(),
  createdBy: uuid('created_by').references(() => members.id),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// 11. Submissões de Leads do Form Builder
export const formSubmissions = pgTable('form_submissions', {
  id: uuid('id').primaryKey().defaultRandom(),
  formId: varchar('form_id', { length: 100 }).references(() => forms.id, { onDelete: 'cascade' }).notNull(),
  responses: jsonb('responses').$type<Array<{
    label: string;
    answer: string;
  }>>().notNull(),
  leadName: varchar('lead_name', { length: 150 }),
  leadEmail: varchar('lead_email', { length: 255 }),
  leadPhone: varchar('lead_phone', { length: 50 }),
  notionSynced: boolean('notion_synced').default(false).notNull(),
  resendNotified: boolean('resend_notified').default(false).notNull(),
  userAgent: text('user_agent'),
  ipAddress: varchar('ip_address', { length: 45 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});
```

---

## 5. Variáveis de Ambiente Requeridas

A unificação desses dois projetos necessita das seguintes variáveis de ambiente centralizadas no arquivo `.env` do projeto soberano:

| Variável | Módulo | Descrição | Exemplo / Padrão |
| :--- | :--- | :--- | :--- |
| `DATABASE_URL` | Global / Drizzle | String de conexão PostgreSQL (Neon ou Supabase) | `postgresql://postgres:postgres@localhost:5432/soberano` |
| `MP_ACCESS_TOKEN` | Comunidade / Checkout | Token de Acesso de Produção do Mercado Pago | `APP_USR-6268276789394780-...` |
| `MP_PUBLIC_KEY` | Comunidade / Frontend | Chave pública do Mercado Pago para SDK client-side | `APP_USR-77fe0fd7-600a-4b1e-8bd2-25007f12a351` |
| `ADMIN_PASSWORD` | Builder / Admin | Senha mestra com proteção crypto timing-safe | `MCP_SuperSecure_Admin_2026!#LiquidGlass` |
| `RESEND_API_KEY` | Builder & Comunidade | Chave de API de envio de e-mails transacionais | `re_efgVfaN2_J2UTVcQXEkGyzmpvxHa1i2Zq` |
| `SENDER_EMAIL_ADDRESS`| Builder & Comunidade | Remetente verificado do Resend | `onboarding@resend.dev` *(ou domínio próprio)* |
| `NOTION_TOKEN` | Form Builder / Server | Token de integração padrão com Notion Business | `ntn_3ad8112a6332804699c9d77ff9537746` |
| `NOTION_PARENT_PAGE_ID`| Form Builder / Server | ID da página-mãe de preenchimentos no Notion | `3ad8112a6332804699c9d77ff9537746` |
| `JWT_SECRET` | Global Auth | Segredo criptográfico para emissão de JWTs seguros | Chave aleatória de 64 bytes hex |

---

## 6. Componentes Reutilizáveis, Hooks e Shaders

### 6.1 Componentes UI Reutilizáveis
- `CinematicCanvas.tsx`: Orquestrador de shaders WebGL com detecção dinâmica de DPI, suporte a resize e injeção de parâmetros dinâmicos.
- `Beams.jsx` & `Beams.css`: Efeito de raios verticais volumétricos com `@react-three/fiber` e `three`.
- `ColorBends.jsx` & `ColorBends.css`: Ondulações de cor líquida e gradiente harmônico.
- `Galaxy.jsx` & `Galaxy.css`: Espiral cósmica interativa com motor `OGL`.
- `MetaBallsPopup`: Shader de metaballs 3D acelerado via WebGL para pop-ups de onboarding.
- `AppleNav` / `SovereignNavbar`: Barra de navegação com desfoque de 24px (`backdrop-filter: blur(24px)`), logotipo em relevo e dropdown de papéis.
- `GlassCard` / `UltraGlassCard`: Cartão com bordas reflexivas de 1px, sombra multicamadas e desfoque profundo.
- `LiquidButton`: Botão com efeito de iluminação no hover e borda sutil responsiva à paleta de cor ativa.

### 6.2 Dependências de Pacotes & Compatibilidade Next.js 15
Para que o projeto unificado compile sem atritos no Next.js 15 App Router:
- **Dependências Chave Requeridas:**
  - `three` (`^0.185.1` ou `^0.160.0`)
  - `ogl` (`^1.0.11`)
  - `@react-three/fiber` (`^8.16.0` ou `^9.x`)
  - `@react-three/drei` (`^9.x` ou `^10.x`)
  - `framer-motion` (`^11.x` ou `^12.x`)
  - `lucide-react` (`^0.400.0+`)
  - `drizzle-orm` e `postgres` (ou `@neondatabase/serverless`)
  - `mercadopago` (SDK oficial Node.js para backend)
  - `resend` (SDK oficial)
  - `@notionhq/client` (para chamadas seguras e tipadas ao Notion)
- **Atenção SSR / Client Components:** Todos os componentes de Shaders WebGL (`CinematicCanvas`, `ColorBends`, `Beams`, `Galaxy`) e os formulários interativos devem conter a diretiva `"use client";` no topo e ser carregados com `next/dynamic({ ssr: false })` para evitar erros de renderização no servidor (onde `window`, `canvas` e `WebGLRenderingContext` não existem).

---

## 7. Recomendações Estratégicas para os Workers de Implementação

1. **Migração dos 1.172 assets de imagem:** Copiar a pasta `/Users/mcp/.gemini/antigravity/scratch/visuals-app-saas/public/assets/images` diretamente para a pasta `/public/assets/images` do projeto unificado. Isso garantirá a integridade de todas as referências do catálogo `products_data.json`.
2. **Importação do Catálogo JSON:** Mudar o carregamento de `products_data.json` para leitura no servidor via Node.js `fs/promises` ou Server Component, evitando requisições client-side com falhas de caminho relativo.
3. **Conversão de rotas de API:**
   - Converter `/api/create-payment.js` para rota Next.js 15 App Router: `app/api/payment/route.ts`.
   - Adicionar o webhook de pagamentos: `app/api/payment/webhook/route.ts` para confirmação automática de pagamentos aprovados do Mercado Pago e atualização da role do membro no banco de dados (`members.role = 'full'`).
   - Converter `/api/submit-form` para: `app/api/forms/submit/route.ts` com gravação na tabela `form_submissions` do PostgreSQL antes do disparo para Notion e Resend.
4. **Camada de Autenticação Unificada:** Unificar o login do membro da comunidade e a senha do construtor de formulários em uma sessão centralizada (`/api/auth`), permitindo que administradores acessem o painel administrativo da comunidade e o construtor sem login duplicado.
