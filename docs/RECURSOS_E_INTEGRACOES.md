# Recursos Adicionais, Shaders & Integrações — MCP Business OS

Este documento detalha os recursos complementares, o motor gráfico WebGL de shaders, as integrações de automação externa e a suíte de testes da **Plataforma Unificada Soberana (MCP Business OS)**.

---

## 1. Motor Gráfico de Shaders WebGL 2 & Efeitos Visuais

A interface da plataforma foi desenhada para oferecer uma experiência imersiva e cinematográfica com alta fidelidade visual, operando a **60 FPS estáveis** em navegadores modernos por meio de shaders desenvolvidos com GLSL e Three.js / OGL.

### 1.1. Catálogo de Shaders Implementados

| Shader | Arquivo Fonte | Localização Principal | Efeito Visual & Atmosfera |
|---|---|---|---|
| **Balatro Vortex** | [`BalatroShader.tsx`](file:///Users/mcp/.gemini/antigravity/scratch/plataforma-unificada-soberana/src/components/shaders/BalatroShader.tsx) | Loja Oficial (`/shop`) | Redemoinhos hipnóticos em carmesim e preto profundo inspirados em cartas dinâmicas. |
| **Grid Scan** | [`GridScanShader.tsx`](file:///Users/mcp/.gemini/antigravity/scratch/plataforma-unificada-soberana/src/components/shaders/GridScanShader.tsx) | Hero Centralizado (`/`) | Grade cibernética com feixes luminosos de escaneamento em profundidade. |
| **Ripple Grid** | [`RippleGridShader.tsx`](file:///Users/mcp/.gemini/antigravity/scratch/plataforma-unificada-soberana/src/components/shaders/RippleGridShader.tsx) | Seção de Artigos (`/`) | Malha geométrica ondulante reativa à rolagem e micro-movimentos. |
| **Arc Lightning** | [`LightningShader.tsx`](file:///Users/mcp/.gemini/antigravity/scratch/plataforma-unificada-soberana/src/components/shaders/LightningShader.tsx) | Recursos (`/`) | Arcos elétricos de alta energia canalizados em vermelho luminescente. |
| **Faulty Terminal** | [`FaultyTerminalShader.tsx`](file:///Users/mcp/.gemini/antigravity/scratch/plataforma-unificada-soberana/src/components/shaders/FaultyTerminalShader.tsx) | Sobre Mateus (`/`) | Estética CRT analógica retrô com linhas de varredura (*scanlines*) e glitches controlados. |
| **Liquid Chrome** | [`LiquidChromeShader.tsx`](file:///Users/mcp/.gemini/antigravity/scratch/plataforma-unificada-soberana/src/components/shaders/LiquidChromeShader.tsx) | Transições Globais | Superfície metálica reflexiva fluida com refração de luz carmesim. |
| **Silk Waves** | [`SilkShader.tsx`](file:///Users/mcp/.gemini/antigravity/scratch/plataforma-unificada-soberana/src/components/shaders/SilkShader.tsx) | Vitrines & Modais | Tecido de seda orgânico em movimento contínuo com dobras de sombra suaves. |
| **Cinematic Canvas** | [`CinematicCanvas.tsx`](file:///Users/mcp/.gemini/antigravity/scratch/plataforma-unificada-soberana/src/components/shaders/CinematicCanvas.tsx) | Form Builder (`/builder`) | Canvas de partículas flutuantes com gradientes dinâmicos de alta elegância. |
| **Beams, Galaxy & ColorBends** | Diretório `src/components/shaders/` | Áreas de Membros & Backgrounds | Efeitos de partículas galácticas, raios volumétricos e dispersão espectral. |

### 1.2. Arquitetura de Execução dos Shaders
- **Carregamento Seguro SSR**: Os shaders utilizam a diretiva `'use client'` combinada com verificação prévia de suporte via [`isWebGLSupported()`](file:///Users/mcp/.gemini/antigravity/scratch/plataforma-unificada-soberana/src/lib/shaders/webgl-utils.ts).
- **Gerenciamento de Memória & Context Loss**: Funções de cleanup registradas no hook `useEffect` desalocam buffers, texturas e listeners de WebGL no desmonte de componentes, prevenindo vazamentos de memória na GPU.
- **Degradação Elegante**: Em navegadores ou dispositivos sem aceleração gráfica por hardware, o sistema ativa gradientes CSS estáticos equivalentes sem interromper a usabilidade.

---

## 2. Integrações Externas & Serviços de Terceiros

### 2.1. Notion API (Gestão de Leads & CRM)
- **Finalidade**: Sincronização automática de dados capturados nos formulários cinemáticos para bases de dados no Notion.
- **Configuração**:
  - `NOTION_API_KEY`: Token de integração oficial.
  - `NOTION_DATABASE_ID`: Identificador da base de leads.
- **Mapeamento**:
  - Campos de texto, telefone, e-mail e respostas customizadas são convertidos diretamente para as propriedades correspondentes do Notion.

### 2.2. Resend API (Notificações Transacionais)
- **Finalidade**: Disparo de e-mails de alerta em tempo real para novos leads, submissões de formulários e confirmações de compra.
- **Configuração**:
  - `RESEND_API_KEY`: Chave da API oficial do Resend.
  - `RESEND_FROM_EMAIL`: E-mail de remetente autenticado com SPF/DKIM.
  - `RESEND_NOTIFY_EMAIL`: Destinatário principal dos avisos operacionais (`202405039459@alunos.estacio.br`).

### 2.3. Mercado Pago Checkout Pro (Gateways de Pagamento)
- **Finalidade**: Cobrança transparente para planos da comunidade VIP e serviços especializados.
- **Configuração**:
  - `MERCADOPAGO_ACCESS_TOKEN`: Token de autenticação OAuth para criação de preferências de pagamento.
  - `MERCADOPAGO_PUBLIC_KEY`: Chave pública para renderização do botão de checkout.
- **Webhook IPN**:
  - Rota `/api/payment/webhook` processa notificações assíncronas do Mercado Pago e libera o acesso instantâneo ao membro via atualização de status no banco.

### 2.4. WhatsApp Direct API
- **Finalidade**: Conversão de alta velocidade para compras na loja e contratação de serviços sob demanda.
- **Mecanismo**: Geração de links profundos (`https://api.whatsapp.com/send/?phone=553197724257&text=...`) com codificação percentual de mensagem contendo o nome do produto/serviço e identificador de interesse.

---

## 3. Acervos de Dados Embutidos & Ativos Intelectuais

### 3.1. Acervo de 176 Artigos Técnicos
- Arquivos: [`articles-summary.json`](file:///Users/mcp/.gemini/antigravity/scratch/plataforma-unificada-soberana/src/data/articles-summary.json) e [`articles.json`](file:///Users/mcp/.gemini/antigravity/scratch/plataforma-unificada-soberana/src/data/articles.json).
- Categorias:
  1. *Inteligência Artificial* (68 artigos)
  2. *Ferramentas & No-Code* (48 artigos)
  3. *Business & Growth* (45 artigos)
  4. *Linux & Infraestrutura Soberana* (5 artigos)
- Recursos: Busca textual instantânea com debounce e atalho de teclado `⌘K`.

### 3.2. Cofre com 406 Recursos Intelectuais
- Arquivos: [`library_catalog_index.json`](file:///Users/mcp/.gemini/antigravity/scratch/plataforma-unificada-soberana/src/data/library_catalog_index.json) e [`libraries.json`](file:///Users/mcp/.gemini/antigravity/scratch/plataforma-unificada-soberana/src/data/libraries.json).
- Categorias: Ebooks, prompts validados, templates n8n/Typebot, códigos-fonte, pipelines de automação e ativos visuais de alta definição.

### 3.3. Dados do Shop e Perfil Institucional
- Arquivo: [`siteData.json`](file:///Users/mcp/.gemini/antigravity/scratch/plataforma-unificada-soberana/src/data/siteData.json).
- Contém a árvore completa de sitemap, produtos em destaque, carrosséis de banners alternantes, dados biográficos e canais de contato.

---

## 4. Suíte de Testes Automatizados

A plataforma possui testes automatizados abrangentes cobrindo os fluxos críticos de negócio:

| Arquivo de Teste | Escopo de Validação |
|---|---|
| [`tests/auth.test.ts`](file:///Users/mcp/.gemini/antigravity/scratch/plataforma-unificada-soberana/tests/auth.test.ts) | Testes unitários de login, registro, criptografia de senhas e geração de tokens JWT. |
| [`tests/auth_feedback_comunidade.test.mjs`](file:///Users/mcp/.gemini/antigravity/scratch/plataforma-unificada-soberana/tests/auth_feedback_comunidade.test.mjs) | Teste end-to-end de autenticação na comunidade, persistência de sessão e feedback visual de erro. |
| [`tests/comunidade/adversarial.test.ts`](file:///Users/mcp/.gemini/antigravity/scratch/plataforma-unificada-soberana/tests/comunidade/adversarial.test.ts) | Testes de resistência a payloads maliciosos, injeção de scripts e violação de permissões RBAC. |
| [`tests/library_control_suite.test.ts`](file:///Users/mcp/.gemini/antigravity/scratch/plataforma-unificada-soberana/tests/library_control_suite.test.ts) | Validação das operações de CRUD, upload, deleção em massa e sincronização em nuvem do painel admin. |
| [`tests/notion_diary_and_shop.test.ts`](file:///Users/mcp/.gemini/antigravity/scratch/plataforma-unificada-soberana/tests/notion_diary_and_shop.test.ts) | Validação do parsing de artigos do Notion e integridade dos itens e rotas do Shop Oficial. |
| [`tests/security_audit.test.ts`](file:///Users/mcp/.gemini/antigravity/scratch/plataforma-unificada-soberana/tests/security_audit.test.ts) | Auditoria automatizada de segurança de rotas de API, cabeçalhos HTTP e isolamento de dados. |

Para executar a suíte de testes:
```bash
npm run test
```

---

## 5. Observabilidade Estrutural via Graphify

O projeto adota o **Graphify** como ferramenta central de mapeamento e integridade arquitetural:
- **Nós Mapeados**: 1.890 entidades (componentes, rotas, funções, shaders, schemas).
- **Arestas de Conexão**: 3.717 relações (importações, chamadas de função, renderizações de subcomponentes).
- **Comunidades Topológicas**: 129 módulos agrupados semanticamente.

### Comandos de Manutenção do Mapa:
- `graphify update .`: Extrai e atualiza os arquivos modificados na árvore de código.
- `graphify query "<termo>"`: Executa busca contextual antes de refatorações de alto impacto.
- `graphify path "<de>" "<para>"`: Identifica dependências transitivas entre módulos.
