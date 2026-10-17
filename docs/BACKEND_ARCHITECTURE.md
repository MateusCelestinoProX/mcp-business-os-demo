# Arquitetura do Backend — MCP Business OS

Este documento detalha minuciosamente a arquitetura do backend, persistência de dados, autenticação unificada, controle de acesso baseado em papéis (RBAC), middlewares de segurança e especificação técnica de todas as rotas de API da **Plataforma Unificada Soberana (MCP Business OS)**.

---

## 1. Visão Geral do Backend

O backend foi construído utilizando as **Route Handlers do Next.js 15 (App Router)** rodando em ambiente Node.js de alta performance, complementado por processamento Edge onde aplicável. Toda a camada de negócios é orientada a contratos TypeScript estritos, isolamento modular e tolerância a falhas.

### Pilares Tecnológicos
- **Runtime**: Node.js >= 18.18 / Next.js Server Components e Route Handlers
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/) com dialeto PostgreSQL
- **Banco de Dados**: PostgreSQL Serverless (compatível com Neon, Supabase e PostgreSQL padrão) com camada de fallback resiliente
- **Criptografia & Sessões**: `jose` para geração e verificação de JSON Web Tokens (JWT) e `bcryptjs` para hashing de senhas com sal
- **Comunicação Segura**: Cookies com atributos `HttpOnly`, `SameSite=Lax`, `Secure` (em produção) e headers `x-user-*` injetados via Middleware

---

## 2. Camada de Dados (Drizzle ORM & PostgreSQL)

O schema está centralizado em [`src/lib/db/schema.ts`](file:///Users/mcp/.gemini/antigravity/scratch/plataforma-unificada-soberana/src/lib/db/schema.ts) e consolida os dados dos quatro subsistemas da plataforma:

### 2.1. Tabelas e Entidades

#### `admin_users` — Superusuários e Administradores
Armazena as contas com privilégios de gestão total da plataforma.
- `id` (`uuid`, PK, `defaultRandom()`)
- `email` (`varchar(255)`, unique, not null)
- `passwordHash` (`text`, not null)
- `role` (`varchar(50)`, default `'admin'`, not null)
- `name` (`varchar(255)`, not null)
- `lastLogin` (`timestamp with timezone`)
- `createdAt` / `updatedAt` (`timestamp with timezone`)

#### `leads` — Tráfego Pago & Captação
Captura contatos provenientes de campanhas de tráfego pago (TikTok Ads, Meta Ads) e tráfego orgânico.
- `id` (`uuid`, PK, `defaultRandom()`)
- `name` (`varchar(255)`, not null)
- `email` (`varchar(255)`, not null, indexado)
- `phone` (`varchar(100)`, not null)
- `source` (`varchar(50)`, default `'organic'`, indexado)
- `utmSource` / `utmCampaign` / `utmMedium` / `utmContent` (`varchar(150)`)
- `metadata` (`jsonb`)
- `status` (`varchar(50)`, default `'novo'`)
- `createdAt` (`timestamp with timezone`, indexado)

#### `members` — Comunidade Privada & Área VIP
Registra os membros da comunidade exclusiva de A.I Visuals e automação.
- `id` (`uuid`, PK, `defaultRandom()`)
- `email` (`varchar(255)`, unique, not null)
- `passwordHash` (`text`, not null)
- `name` (`varchar(255)`, not null)
- `status` (`varchar(50)`, default `'active'`)
- `tier` (`varchar(50)`, default `'free'`) — `'free'` | `'pro'` | `'vip'`
- `paymentId` (`varchar(255)`)
- `lastLogin` (`timestamp with timezone`)
- `createdAt` (`timestamp with timezone`)

#### `forms` & `form_submissions` — Form Builder Cinemático
Gerencia a estrutura dos formulários dinâmicos e suas respectivas respostas.
- **`forms`**:
  - `id` (`uuid`, PK)
  - `title` (`varchar(255)`)
  - `description` (`text`)
  - `slug` (`varchar(255)`, unique, indexado)
  - `schemaJson` (`jsonb`, definição de páginas, campos, regras condicionais e estilo)
  - `isActive` (`boolean`, default `true`)
  - `userId` (`uuid`)
  - `createdAt` / `updatedAt` (`timestamp with timezone`)
- **`form_submissions`**:
  - `id` (`uuid`, PK)
  - `formId` (`uuid`, FK cascade em `forms.id`)
  - `dataJson` (`jsonb`, respostas estruturadas)
  - `ipAddress` (`varchar(64)`)
  - `createdAt` (`timestamp with timezone`)

#### `library_items` — Catálogo do Cofre de Recursos
Catálogo com os 406 recursos da biblioteca intelectual aberta.
- `id` (`varchar(255)`, PK)
- `title` (`varchar(255)`, not null)
- `category` (`varchar(100)`, not null, indexado)
- `description` (`text`)
- `fileUrl` (`text`, not null)
- `sizeBytes` (`integer`, default 0)
- `tags` (`jsonb`)
- `downloadCount` (`integer`, default 0)
- `isPremium` (`boolean`, default `false`, indexado)
- `createdAt` (`timestamp with timezone`)

#### `articles` — Acervo Editorial Técnico
Catálogo dos 176 artigos e tutoriais com metadados editoriais.
- `id` (`uuid`, PK)
- `slug` (`varchar(255)`, unique, indexado)
- `title` (`varchar(300)`, not null)
- `summary` / `content` (`text`, not null)
- `category` (`varchar(100)`, not null, indexado)
- `coverUrl` (`text`)
- `readingTime` (`varchar(50)`, default `'5 min'`)
- `isPublished` (`boolean`, default `true`, indexado)
- `createdAt` (`timestamp with timezone`)

#### `auth_sessions` & `system_settings`
- **`auth_sessions`**: Controle persistente de revogação de tokens e rastreamento de acessos.
- **`system_settings`**: Armazenamento chave-valor em JSONB para configurações dinâmicas de banner, shop e integrações.

---

## 3. Autenticação Unificada & RBAC

O subsistema de segurança opera em camada dupla (Client-Side State + Server-Side JWT Validation):

### 3.1. Hierarquia de Papéis (*Roles*)
1. **`admin`**: Acesso irrestrito a todos os recursos, rotas de gestão de arquivos (`/admin`), telemetria financeira, gerenciamento de membros e deleção em lote.
2. **`moder`**: Moderação de comunidade, edição de artigos e acompanhamento de chamados.
3. **`user` / `member`**: Acesso à área restrita de membros (`/comunidade`), vídeos VIP e materiais exclusivos.
4. **`visitante`**: Acesso público ao Portal Institucional, Shop, leitura de artigos e pesquisa no catálogo aberto da biblioteca.

### 3.2. Ciclo de Vida da Sessão
- **Geração de Token**: O endpoint `/api/auth/login` valida as credenciais contra o banco e gera um token JWT assinado criptograficamente com `HS256` utilizando `JWT_SECRET`.
- **Propagação de Identidade**: O token é retornado na resposta JSON e gravado em cookie HttpOnly (`mcp_session_token`).
- **Evento de Sincronização Local**: A aplicação dispara o evento `mcp_auth_changed` no browser para que os componentes de cabeçalho reflitam instantaneamente a mudança de estado sem recarregar a página.

---

## 4. Middleware de Segurança (`src/middleware.ts`)

O middleware atua em todas as requisições antes de atingirem os manipuladores de rota:

1. **Decodificação de Token**: Extrai o cookie `mcp_session_token` e invoca `verifyToken()`.
2. **Injeção de Contexto**: Se o token for válido, adiciona os cabeçalhos internos:
   - `x-user-id`
   - `x-user-email`
   - `x-user-role`
3. **Barreira de Acesso Administrativo**:
   - Rotas como `/api/members` e `/api/finance` exigem autenticação ativa com papel `admin` ou header `Authorization: Bearer <token>`. Retorna `401 Unauthorized` ou `403 Forbidden` quando o acesso for inválido.
4. **Cabeçalhos de Segurança HTTP**:
   - `X-Frame-Options: SAMEORIGIN`
   - `X-Content-Type-Options: nosniff`
   - `Referrer-Policy: strict-origin-when-cross-origin`
   - `Permissions-Policy: camera=(), microphone=(), geolocation=()`

---

## 5. Especificação das Rotas de API (REST / JSON)

### 5.1. Autenticação & Sessões
- `POST /api/auth/login`
  - **Payload**: `{ email: string, password: string }`
  - **Resposta**: `{ success: true, token: string, user: { id, name, email, role, avatar } }`
- `POST /api/auth/register`
  - **Payload**: `{ name: string, email: string, password: string }`
  - **Resposta**: `{ success: true, memberId: string }`
- `GET /api/auth/me`
  - **Resposta**: Retorna a identidade do usuário a partir do token de sessão ativo.

### 5.2. Gestão Administrativa (`/api/admin/*`)
- `GET /api/admin/libraries`: Lista todos os itens do acervo com contadores e filtros de busca.
- `POST /api/admin/libraries`: Cria um novo item no acervo.
- `POST /api/admin/libraries/upload`: Realiza o upload e processamento de arquivos para o cofre.
- `POST /api/admin/libraries/create-document`: Cria documentos técnicos e guias diretamente no acervo.
- `POST /api/admin/libraries/bulk-delete`: Exclusão em lote com array de identificadores `{ ids: string[] }`.
- `POST /api/admin/libraries/cloud`: Sincronização e backup de recursos com a infraestrutura em nuvem.
- `DELETE /api/admin/libraries/items/[id]`: Remove um item específico pelo ID.
- `GET/PUT /api/admin/shop-resources`: Gestão dos recursos e serviços exibidos na loja oficial.

### 5.3. Acervo de Artigos (`/api/articles/*`)
- `GET /api/articles`: Retorna o resumo dos 176 artigos com suporte a paginação e busca.
- `GET /api/articles/[id]`: Retorna o conteúdo integral do artigo com metadados editoriais e tempo estimado de leitura.

### 5.4. Form Builder Cinemático (`/api/forms/*` e `/api/submit-form`)
- `GET /api/forms`: Lista todos os formulários cadastrados.
- `POST /api/forms`: Cria ou atualiza a estrutura de um formulário (`schemaJson`).
- `GET /api/forms/[id]`: Retorna a configuração completa para o Form Runner (`LivePreview` e `/f/[id]`).
- `POST /api/forms/submit` & `POST /api/submit-form`:
  - Recebe as respostas dos respondentes.
  - Grava a submissão em `form_submissions`.
  - Dispara automações para a **Notion API** (criação de página de lead) e **Resend API** (envio de e-mail de notificação).

### 5.5. Biblioteca & Downloads (`/api/library/*`)
- `GET /api/library`: Consulta paginada dos 406 recursos intelectuais com busca textual e filtro de categoria.
- `GET /api/library/download`: Endpoint seguro para download de recursos com incremento de métricas em `download_count`.

### 5.6. Captação de Leads & Contato
- `POST /api/leads`:
  - **Payload**: `{ name: string, email: string, phone: string, source: string, utm_source?: string, utm_campaign?: string }`
  - **Tratamento**: Grava o lead com dados de atribuição e aciona fluxos de boas-vindas.
- `POST /api/contact` & `POST /api/send-email`:
  - Envio de mensagens e solicitações de orçamento via integração direta com Resend.

### 5.7. Pagamentos & Monetização
- `POST /api/checkout` & `POST /api/payment/checkout`:
  - Integração com Mercado Pago Checkout Pro. Cria a preferência de pagamento e devolve a URL (`init_point`).
- `POST /api/payment/webhook`:
  - Recebe notificações IPN/Webhook do gateway, valida a assinatura e altera o status do membro para `active` / `tier: pro`.
- `GET /api/finance`:
  - Consulta administrativa restrita com faturamento agregado, conversões e novos membros.

---

## 6. Sementes e Inicialização de Dados (`seed.ts`)

Para inicializar a base de dados com as configurações oficiais e o superusuário administrador:
```bash
npm run db:seed
# ou execução direta via script auxiliar
node scripts/set_sole_admin.mjs
```
O script garante que a conta oficial `202405039459@alunos.estacio.br` esteja devidamente cadastrada com privilégio de administrador soberano.
