# Relatório de Survey 1 — Site Institucional com Shaders & Biblioteca Oculta de Recursos

**Data e Hora**: 2026-10-14T15:35:00Z  
**Autor**: Explorer Survey 1 (Teamwork Agent)  
**Destino**: Orquestrador e Arquitetos da Plataforma Unificada Soberana  
**Escopo**: Mapeamento exaustivo de:
1. **Site Institucional com Shaders & Neon Postgres** (`/Users/mcp/.gemini/antigravity/scratch/mateus-celestino-pro-x`)
2. **Biblioteca Oculta de Recursos (Galadriel Library)** (`/Users/mcp/.gemini/antigravity/scratch/s-a-a-s-full-hidden-library`)

---

## 1. Sumário Executivo

Ambos os projetos analisados possuem altíssimo nível de maturidade visual, fidelidade estética e sofisticação arquitetural:
- **`mateus-celestino-pro-x`** entrega um portal institucional de branding tecnológico de elite baseado em **Apple Liquid Glassmorphism**, **Vanta Black (`#000000`)** e acentos em **Vermelho Carmesim Neon Blaster (`#FF073A`)**, sustentado por **5 Shaders WebGL dedicados** (com Three.js e OGL), hub editorial com **176 artigos técnicos e capas WebP dedicadas**, captura de leads para WhatsApp/CRM e painel administrativo integrado ao Neon Postgres (com fallback de emulação local idempotente).
- **`s-a-a-s-full-hidden-library` (Galadriel)** oferece uma biblioteca de conhecimento oculta contendo **406 itens catalogados** (293 PDFs técnicos de IA, 47 TXTs de prompts/estratégia, 30 guias DOCX, 20 assets visuais, APK mobile Android 14 nativo de 8.8MB e arquivos ZIP), sistema de pesquisa instantânea ponderada por relevância, visualizadores embutidos de múltiplos formatos, cerimônia de boas-vindas com transição suave, rotação de 5 shaders WebGL2 procedurais (`GhostFibers`, `AeroShards`, `Dither`, `GradientWaves`, `Grainient`) e um servidor de ferramentas MCP avançado (`mcp_server.py`) com blueprints cinematográficos (Google Veo 3 e Nano Banana Pro).

A fusão de ambos no ecossistema soberano em Next.js 15 App Router com Drizzle ORM é perfeitamente viável, limpa e agregará enorme valor ao portfólio de Mateus Celestino.

---

## 2. Investigação Detalhada: Projeto 1 — Site Institucional com Shaders (`mateus-celestino-pro-x`)

### 2.1. Arquitetura e Stack Técnica
- **Framework & Build**: React 19 (`react` 19.0.0, `react-dom` 19.0.0), Vite 6 (`vite` 6.0.0, `@vitejs/plugin-react` 4.3.4).
- **Estilização**: Tailwind CSS v4 (`tailwindcss` 4.0.0, `@tailwindcss/vite` 4.0.0), `clsx` (2.1.1), `tailwind-merge` (3.0.2).
- **Motores Gráficos 3D / WebGL**:
  - `three`: versão `^0.186.1` (utilizado no `GridScanShader`).
  - `ogl`: versão `^1.0.11` (utilizado nos shaders `LightningShader`, `RippleGridShader`, `FaultyTerminalShader`, `BalatroShader`).
- **Banco de Dados**: `@neondatabase/serverless` (1.2.0) com driver SQL Serverless para Neon Postgres e emulação em memória segura (`memoryStore`).
- **Ícones**: `lucide-react` (1.16.0).

### 2.2. Design System & Tokens Visuais (Apple Liquid Glassmorphism)
Definido em `src/index.css`:
- **Cores Oficiais**:
  - `--vanta-black`: `#000000` (preto absoluto de fundo)
  - `--neon-red`: `#ff073a` (vermelho carmesim neon de alto contraste)
  - `--neon-red-bright`: `#ff0033`
  - `--neon-blood`: `#800010` (tom profundo para refrações e sombras)
  - `--glass-surface`: `rgba(12, 12, 12, 0.55)`
  - `--glass-border`: `rgba(255, 255, 255, 0.12)`
  - `--glass-specular`: `rgba(255, 255, 255, 0.28)`
- **Tipografia**: `'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif` para interface; `'JetBrains Mono', monospace` para código e dados técnicos.
- **Classes de Vidro (Glassmorphism)**:
  - `.glass-crystal`: Painéis e seções principais, `backdrop-filter: blur(40px) saturate(220%)`, gradiente especular superior e borda com `rgba(255, 255, 255, 0.25)`.
  - `.glass-interactive`: Cards com hover dinâmico e iluminação reflexiva carmesim (`hover:border-[#ff073a]/45`).
  - `.glass-card-luxury`: Cards com chanfro arredondado de 1.75rem e linha de reflexo no topo.
  - `.glass-button-fired`: Botões de alta conversão/CTA com gradiente `#ff073a` a `#b80024`, borda iluminada e glow expansivo.
  - `.glass-pill` e `.glass-pill-red`: Badges, pílulas e tags flutuantes.
  - `.glass-input`: Inputs e textareas para captura de leads com foco carmesim (`box-shadow: 0 0 20px rgba(255, 7, 58, 0.3)`).
- **Camada de Fundo Contínua**: `LiquidGlassBackground.jsx` projeta 4 orbes colossais de difusão de luz líquida (`filter: blur(140px)`) em posições calculadas, criando refração autêntica sob os painéis de vidro.

### 2.3. Os 5 Shaders WebGL do Personal OS
Localizados em `src/components/shaders/`:
1. **`GridScanShader.jsx` (Hero / Capa Principal)**:
   - Motor: **Three.js**.
   - Efeito: Malha 3D tática em perspectiva com varredura contínua em ping-pong, cálculo de atenuação cúbica (`smoother01`), reação ao movimento do mouse via amortecimento suave (`smoothDampVec2`) e pulso sonar ativado por clique.
2. **`RippleGridShader.jsx` (Publicações & 176 Guias Técnicos)**:
   - Motor: **OGL**.
   - Efeito: Grade matricial com ondulação gravitacional interativa concêntrica ao mover o cursor.
3. **`LightningShader.jsx` (Recursos & Packs Oficiais)**:
   - Motor: **OGL**.
   - Efeito: Arcos voltaicos de plasma contínuo em alta voltagem (Arc Plasma) em tom carmesim elétrico.
4. **`BalatroShader.jsx` (Shop & Serviços de Automação)**:
   - Motor: **OGL**.
   - Efeito: Vórtice psicodélico estilo CRT com refração líquida hipnótica e alto contraste.
5. **`FaultyTerminalShader.jsx` (Sobre Mateus & Infraestrutura Linux)**:
   - Motor: **OGL**.
   - Efeito: Matriz hacker de dígitos em glitch, scanlines analógicas, ruído FBM e fósforo carmesim.
- **Sistema de Transição (`ShaderTransitionZone.jsx`)**:
  - Implementa transição cinematográfica fluida entre cada um dos shaders com `backdrop-blur-3xl`, gradientes verticais de fusão, linha laser carmesim de 1px com glow central e badge tático (`ZONA DE TRANSIÇÃO • FROM ➔ TO`).
- **Segurança e Otimização de GPU**:
  - Todos os shaders utilizam `IntersectionObserver` acoplado ao `requestAnimationFrame`. Se o canvas estiver fora do viewport ou a aba do navegador estiver oculta (`document.hidden`), a renderização é suspensa, mantendo consumo de GPU em 0%.
  - Ciclo de vida robusto com descarte de geometrias, materiais, programas WebGL e listeners de eventos no unmount.

### 2.4. Hub de Conteúdo & Artigos Dinâmicos
- **Base de Dados Editorial**: `src/data/articles.json` (3.7 MB) contém exatamente **176 artigos técnicos e guias avançados** com conteúdo completo, sumário, tempo de leitura e categoria.
- **Capas Dedicadas**: A pasta `public/assets/covers/` contém **176 capas WebP individuais** de alta qualidade, correlacionadas a cada artigo.
- **Categorias Oficiais**:
  - `TODOS` (176)
  - `INTELIGÊNCIA ARTIFICIAL` (68)
  - `FERRAMENTAS` (48)
  - `BUSINESS` (45)
  - `LINUX` (5)
- **Componentes do Hub**:
  - `MainNotionLayout.jsx`: Interface minimalista com busca full-text instantânea em tempo real, atalho global `⌘K` / `Ctrl+K`, filtros por categoria e paginação de 6 cards por página.
  - `ArticleCard.jsx`: Card interativo com glassmorphism, badge de categoria, tempo de leitura e efeito hover iluminado.
  - `ArticleModal.jsx`: Modal editorial completo com tipografia refinada (`.article-prose`), leitura integral do artigo, recomendação de artigos relacionados e botão para transição direta ao terminal de contato.

### 2.5. Captura de Leads, Tráfego Pago & Endpoints de API
- **Formulário de Contato (`ContatoSection.jsx`)**:
  - Campos: `nome`, `email`, `whatsapp`, `servico` (Agentes WhatsApp, Workflows n8n, etc.) e `mensagem`.
  - Disparo duplo: grava via `POST /api/contact` e redireciona automaticamente para o WhatsApp oficial com payload pré-formatado codificado.
  - Canais adicionais mapeados: WhatsApp Direto (`+55 31 9772-4257`), Email Corporativo Proton (`CONTATO-SMARTFLOW@proton.me`) e Questionário de Diagnóstico Tally (`https://tally.so/r/w2V6LL`).
- **Endpoints de Backend (`api/`)**:
  - `api/contact.js`: Recebe requisição de lead, valida campos obrigatórios e chama `createLead()`.
  - `api/auth/login.js` e `api/auth/me.js`: Autenticação administrativa com geração e verificação de JWT.
  - `api/admin/leads.js` e `api/admin/stats.js`: Listagem paginada de leads, atualização de status (`novo`, `em_contato`, `convertido`, `arquivado`) e métricas consolidadas.
  - `api/db.js`: Gerenciamento unificado de conexão via `@neondatabase/serverless` com reconexão resiliente e armazenamento em memória para testes offline quando `DATABASE_URL` não for informada.
- **Painel Administrativo (`src/components/admin/AdminDashboard.jsx`)**:
  - Dashboard completo com status do Neon Postgres (latência em ms, contagem de leads, nome do banco), tabela interativa de leads com alteração de status e modal de detalhes.

### 2.6. Schema de Dados Existente (`schema.sql`)
```sql
CREATE TABLE admin_users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'admin',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP WITH TIME ZONE
);

CREATE TABLE leads (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    whatsapp VARCHAR(100) NOT NULL,
    servico VARCHAR(200) NOT NULL,
    mensagem TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'novo',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE articles (
    id SERIAL PRIMARY KEY,
    slug VARCHAR(255) UNIQUE,
    title VARCHAR(300) NOT NULL,
    summary TEXT NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    read_time VARCHAR(50) DEFAULT '5 min',
    featured BOOLEAN DEFAULT false,
    published BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE system_settings (
    key VARCHAR(100) PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

---

## 3. Investigação Detalhada: Projeto 4 — Biblioteca Oculta de Recursos (`s-a-a-s-full-hidden-library`)

### 3.1. Acervo e Catálogo Indexado (`library_catalog_index.json`)
O acervo da biblioteca totaliza **406 recursos técnicos de alto nível** distribuídos em:
- **293 arquivos PDF** (manuais de engenharia de prompts, automações, arquitetura de IA, guias do Skeleton Method, monetização com IA).
- **47 arquivos TXT** (prompts puros para ChatGPT, Midjourney, Claude e fluxos de atendimento).
- **30 documentos DOCX** (guias estruturados e apostilas).
- **20 imagens** (assets, esquemas conceituais e capas).
- **9 arquivos Markdown** (documentação técnica e especificações).
- **1 APK Mobile Nativo Android** (`galadriel-mobile.apk`, 8.8 MB) assinado e funcional para Android 14.
- **1 arquivo ZIP** com pacotes de automação e templates.

### 3.2. Estrutura de Categorias de Origem
1. **`the skeleton method`**: 56 arquivos (estratégias de Reels, monetização no Facebook, escala orgânica).
2. **`neia ia - nova era da ia™`**: Mais de 70 arquivos organizados em Jornadas:
   - `01 - mapa da ia` (engenharia avançada de prompts, clareza, velocidade).
   - `02 - mapa da monetização` (ganhando em dólar com serviços de IA).
   - `03 - influencer$ ia` (criação e clonagem de influenciadores virtuais, promptbook).
   - `04 - tikt0k shop com ia` (escala e afiliados no TikTok).
   - `05 - dark machine` (canais automatizados sem rosto).
   - `06 - agente$ ia & n8n` (orquestração de agentes de automação empresarial).
   - `07 - nano banana` (composição visual em alta precisão).
   - `08 - comfyui` (fluxos nodais avançados para difusão de imagens).
   - `09 - agente$ gpt` (criação de assistentes personalizados).
   - `10 - vibe coding` (programação assistida por IA).
   - `11 - google veo 3` (direção cinematográfica 24fps, consistência e áudio foley).
3. **`mikoai`**: 120 arquivos sobre infoprodutos, dropshipping com IA, copywriting persuasivo e UGC com IA.
4. **`a.i animation`**: 71 arquivos (societies-r content guide, cheat sheets, 100+ estilos visuais para geradores de vídeo).
5. **`a.i creative studio materials`**: 13 arquivos com matrizes de prompts de estúdio.
6. **`geral prompts`**: 24 coleções de comandos avançados para múltiplos modelos.
7. **`historika ai`**: 11 arquivos focados em narrativa visual histórica com IA.
8. **`nano banana (gumroad)`**: 7 guias de infoprodutos de design e estética.
9. **`sex scalating`**: 7 roteiros e táticas de copywriting persuasivo.

### 3.3. Mecanismo de Busca Instantânea & Algoritmo de Relevância
No `mcp_server.py` e `app.js`, o mecanismo de busca implementa um sistema de pontuação por pesos:
- **Match exato no nome do arquivo**: +10 pontos.
- **Match na categoria/jornada**: +5 pontos.
- **Match no snippet de texto / preview (`text_preview`)**: +3 pontos.
- **Match em palavras-chave individuais (> 2 caracteres)**: +3 no título / +1 no preview.
- Retorno ordenado decrescente com cálculo dinâmico de tamanho em KB e número de páginas para PDFs.

### 3.4. Visualizadores Integrados e Download por Tipo de Mídia
- **PDFs**: Renderização via leitor seguro PyMuPDF (`fitz`) com paginação e limite de caracteres, ou exibição no frontend através de `<iframe>` responsivo com suporte a download direto.
- **Documentos DOCX**: Extração nativa de parágrafos diretamente do nó XML `word/document.xml` sem necessidade de Word ou bibliotecas externas pesadas.
- **Arquivos TXT / Markdown**: Renderização estilizada com preservação de quebras de linha e tipografia `JetBrains Mono` para códigos de prompts.
- **Imagens e Banners**: Visualizador lightbox com zoom e download em alta resolução.
- **Pacotes ZIP e APK**: Cards de download direto com metadados de tamanho e hash.

### 3.5. Cerimônia de Boas-Vindas & Experiência de Acesso Livre
Conforme estabelecido nas atualizações recentes da Galadriel Library:
- **Acesso Livre Zero-Touch**: Telas de bloqueio por senha foram removidas da experiência primária, garantindo exploração livre e acolhedora.
- **Cerimônia de Boas-Vindas Preservada**:
  - Insígnia `ΝΞΙΔ · NOVA ERA DA IA™`
  - Saudação: *"Seja Bem Vindo, Galadriel e associados. Que o conhecimento esteja sempre contigo."*
  - Cartão em Apple Liquid Glass com halo pulsante e barra de progresso suave em gradiente cósmico (Aqua/Violeta/Branco) com duração de 4.5 segundos, com dispensabilidade instantânea ao tocar em qualquer área.

### 3.6. Shaders WebGL2 Procedurais Integrados
O repositório Galadriel inclui 5 shaders procedurais GLSL de alta fidelidade:
1. `GhostFibers`: Feixes neurais de fibra óptica com rotação 2D e glow volumétrico.
2. `AeroShards`: Cristais pontiagudos flutuantes com iluminação especular.
3. `Dither`: Malha retrô de dither com ruído estocástico.
4. `GradientWaves`: Ondas sinusoidais suaves com saturação e profundidade.
5. `Grainient`: Gradiente granulado suave para fundos com textura tátil.
- O loop mestre `masterAnimLoop` aplica suspensão em segundo plano e downsampling dinâmico a 0.5x DPR para economia de fillrate da GPU.

### 3.7. O Servidor MCP (`mcp_server.py`) & Ferramentas Integradas
O projeto possui um servidor MCP (`mcp_server.py`) que expõe ferramentas JSON-RPC:
- `library_list_categories`: Lista todas as categorias e contagens de arquivos.
- `library_search`: Busca com pontuação ponderada de relevância.
- `library_read_item`: Leitura segura de itens com sandbox anti-path traversal e extração de texto de PDFs via `fitz` e DOCX via `zipfile/xml`.
- `library_get_model_blueprint`: Retorna especificações e diretrizes de geração para modelos SOTA:
  - `google_veo_3`: Direção cinematográfica 24fps em câmera Arri Alexa LF, lente anamórfica Cooke 35mm T2.0, áudio foley e handoff de primeiro frame sem concept bleed.
  - `nano_banana_pro`: Blueprint de proporção 4:5 (1080x1350px) para capas de alta definição sem artefatos tipográficos.

---

## 4. Análise de Compatibilidade & Diretrizes para a Unificação Soberana

### 4.1. Unificação do Design System em Next.js 15 App Router
| Elemento | Projeto 1 (`mateus-celestino-pro-x`) | Projeto 4 (`s-a-a-s-full-hidden-library`) | Plataforma Unificada Proposta |
| :--- | :--- | :--- | :--- |
| **Cor Base** | Vanta Black (`#000000`) | Ultra Dark Vanta (`#000000`) | **Vanta Black Soberano (`#000000`)** |
| **Acentos Primários**| Vermelho Neon Blaster (`#FF073A`) | Ciano Cósmico / Ouro / Branco Divino | **Acento Vermelho Carmesim (`#FF073A`) com micro-acentos âmbar/ouro** |
| **Efeito Vidro** | Apple Liquid Glassmorphism | Divine Glassmorphism | **Apple Liquid Glass Crystal (`backdrop-blur-3xl`)** |
| **Tipografia** | Plus Jakarta Sans + JetBrains Mono | Outfit + JetBrains Mono | **Plus Jakarta Sans (UI) + JetBrains Mono (Código)** |
| **Shaders** | 5 Shaders (Three.js + OGL) | 5 Shaders WebGL2 nativos | **Unificar motores: Three.js / OGL modulares e reativos** |

### 4.2. Mapeamento de Rotas no Next.js 15 App Router
1. **Portal Institucional**:
   - `app/page.tsx`: Landing page com Header Notion, `GridScanShader`, estatísticas, sobre, recursos e contato.
   - `app/artigos/page.tsx` & `app/artigos/[slug]/page.tsx`: Hub completo dos 176 artigos técnicos com capas WebP.
   - `app/api/leads/route.ts` & `app/api/contact/route.ts`: Endpoint unificado de captura de leads com inserção direta no PostgreSQL via Drizzle ORM e tracking de UTMs (TikTok/Meta Ads).
2. **Biblioteca Oculta de Recursos**:
   - `app/biblioteca/page.tsx`: Interface imersiva da Biblioteca Galadriel com cerimônia de boas-vindas, cards de categorias e estatísticas.
   - `app/biblioteca/[...category]/page.tsx`: Navegação hierárquica por pastas e subpastas.
   - `app/biblioteca/item/page.tsx`: Visualizador de arquivos (PDFs, DOCX, TXTs, imagens e downloads).
   - `app/api/library/route.ts`: Rota de busca rápida e listagem de recursos do catálogo `library_catalog_index.json`.
   - `app/api/library/download/route.ts`: Streaming seguro de arquivos estáticos da biblioteca.

### 4.3. Schema Drizzle ORM Integrado (PostgreSQL)
Para unificar as entidades do Site Institucional e da Biblioteca Oculta de Recursos:
```typescript
import { pgTable, serial, varchar, text, timestamp, boolean, jsonb, integer } from 'drizzle-orm/pg-core';

// 1. Administradores e Sessões
export const adminUsers = pgTable('admin_users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 150 }).notNull(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  role: varchar('role', { length: 50 }).default('admin'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  lastLogin: timestamp('last_login', { withTimezone: true }),
});

// 2. Leads & Tráfego Pago (TikTok & Meta Ads)
export const leads = pgTable('leads', {
  id: serial('id').primaryKey(),
  nome: varchar('nome', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  whatsapp: varchar('whatsapp', { length: 100 }).notNull(),
  servico: varchar('servico', { length: 200 }).notNull(),
  mensagem: text('mensagem').notNull(),
  utmSource: varchar('utm_source', { length: 100 }), // tiktok, meta, google, organico
  utmMedium: varchar('utm_medium', { length: 100 }),
  utmCampaign: varchar('utm_campaign', { length: 100 }),
  status: varchar('status', { length: 50 }).default('novo'), // novo, em_contato, convertido, arquivado
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

// 3. Artigos Editoriais (176 Guias Oficiais)
export const articles = pgTable('articles', {
  id: serial('id').primaryKey(),
  slug: varchar('slug', { length: 255 }).unique().notNull(),
  title: varchar('title', { length: 300 }).notNull(),
  summary: text('summary').notNull(),
  content: text('content').notNull(),
  category: varchar('category', { length: 100 }).notNull(),
  coverImage: varchar('cover_image', { length: 500 }),
  readTime: varchar('read_time', { length: 50 }).default('5 min'),
  featured: boolean('featured').default(false),
  published: boolean('published').default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

// 4. Acervo da Biblioteca Oculta (406 Itens Catalogados)
export const libraryItems = pgTable('library_items', {
  id: serial('id').primaryKey(),
  file: varchar('file', { length: 255 }).notNull(),
  relPath: varchar('rel_path', { length: 500 }).unique().notNull(),
  category: varchar('category', { length: 255 }).notNull(),
  ext: varchar('ext', { length: 20 }).notNull(),
  sizeBytes: integer('size_bytes').notNull(),
  pages: integer('pages').default(1),
  textPreview: text('text_preview'),
  isPublic: boolean('is_public').default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

// 5. Configurações Globais do Sistema
export const systemSettings = pgTable('system_settings', {
  key: varchar('key', { length: 100 }).primaryKey(),
  value: jsonb('value').notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});
```

---

## 5. Próximos Passos Recomendados para o Time de Arquitetura & Implementação

1. **Portabilidade dos Shaders**: Modularizar os componentes WebGL (`GridScanShader`, `RippleGridShader`, `LightningShader`, `BalatroShader`, `FaultyTerminalShader`) com a diretiva `'use client'` do Next.js 15, garantindo hidratação segura e desativação em SSR.
2. **Migração de Assets Estáticos**: Copiar o diretório `public/assets/` de `mateus-celestino-pro-x` (contendo as 176 capas WebP e imagens de avatar) e os arquivos de mídia selecionados da Biblioteca Oculta para a pasta `public/` do projeto unificado.
3. **Carga do Catálogo**: Disponibilizar o arquivo `library_catalog_index.json` diretamente na raiz ou em `data/` do projeto unificado para permitir busca rápida em memória com fallback ou sincronização com a tabela `library_items`.
4. **Padronização de CSS**: Integrar as classes de vidro de `index.css` e os tokens de animação de `style.css` dentro do arquivo `globals.css` do Tailwind v4 / Next.js 15.
