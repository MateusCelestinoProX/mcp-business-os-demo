# MCP Business OS — [DEMO SHOWCASE & PORTFÓLIO]

> **Instância Interativa de Portfólio e Demonstração do Sistema Operacional de Negócios Digitais, Hiperautomação, Agentes Autônomos de IA e Cofre Intelectual.**  
> Criado por **Mateus Celestino Pro X**.

---

## 🌟 Recursos Exclusivos da Versão Demo

Esta edição foi concebida para demonstração pública, testes interativos e exibição técnica de portfólio de engenharia de software de altíssimo nível:

1. **🎬 Intro Suave & Revelação Cinematográfica (`DemoExperienceWrapper`)**:
   - Tela base escura com inicialização procedural e barra de progresso suave de telemetria (0-100%).
   - Transição fluida e animada que revela a interface completa do sistema sem quebras visuais.
   - Pílula flutuante de controle de demonstração para acesso rápido aos módulos.

2. **🛡️ Acesso de Administrador por Padrão & Auto-Login**:
   - O visitante é reconhecido imediatamente com perfil de privilégio elevado (`Administrador Demo`, `role: 'admin'`).
   - A tela de autenticação (`/comunidade/login` e `/admin`) já carrega com as credenciais preenchidas e executa o login automaticamente com barra de progresso visual de 1 segundo.
   - Acesso irrestrito a todas as áreas administrativas sem necessidade de banco de dados externo ou chaves sensíveis.

3. **🧼 Dados Higienizados e Proteção de Privacidade**:
   - Dados proprietários, números de telefone pessoais e e-mails foram 100% substituídos por mocks e fallbacks dinâmicos.
   - Catálogo de produtos e serviços da loja e comunidade padronizados com referências genéricas (*"Seu produto aqui"*, *"Sua descrição aqui"*).

---

## 🏛️ Visão Geral da Arquitetura

O **MCP Business OS** consolida os pilares de produto, marketing, vendas, comunidade privada, formulários inteligentes e gestão de ativos digitais em uma única arquitetura web de altíssima performance construída sobre:

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/) + [React 19](https://react.dev/) + [TypeScript 5](https://www.typescriptlang.org/)
- **Estilização & Design**: Tailwind CSS v3 com Design Tokens customizados, Vidro Líquido (*Liquid Glassmorphism Dark Premium* `#030305`), microinterações e halos carmesim
- **Motor Gráfico & Shaders WebGL**: Three.js `0.186.0`, OGL `1.0.11` e shaders WebGL 2 nativos a 60 FPS (Balatro Vortex, Grid Scan, Ripple Grid, Faulty Terminal, Arc Lightning, Beams, Galaxy, Silk)
- **Persistência de Dados**: [Drizzle ORM](https://orm.drizzle.team/) com suporte universal PostgreSQL (Neon Serverless, Supabase e Postgres Local) e banco de fallback resiliente
- **Segurança & RBAC**: Autenticação unificada JWT (`jose`), senhas com hash bcrypt, cookies HttpOnly e Middleware Edge com controle estrito de papéis (*Admin*, *Moderador*, *Membro*, *Visitante*)
- **Observabilidade Estrutural**: Mapa de dependências dinâmico via **Graphify** com regeneração contínua de topologia

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        MASTER SOVEREIGN BAR (HEADER GERAL)                             │
│                  (Navegação Unificada com Efeito Liquid Glassmorphism)                 │
├───────────────────┬──────────────────┬────────────────────┬────────────────────────────┤
│      PORTAL       │       SHOP       │     COMUNIDADE     │       FREE RESOURCES       │
│   Institucional   │     Oficial      │   Área de Membros  │        Cofre Aberto        │
│        (/)        │     (/shop)      │   (/comunidade)    │       (/biblioteca)        │
├───────────────────┴──────────────────┴────────────────────┴────────────────────────────┤
│                       FORM BUILDER CINEMÁTICO & FORM RUNNER                            │
│                 (/builder • Lógica Condicional, Webhooks & Notion)                     │
├────────────────────────────────────────────────────────────────────────────────────────┤
│                       PAINEL ADMINISTRATIVO & LIBRARY CONTROL                          │
│               (/admin • Gestão de Catálogo, Uploads, Nuvem & Métricas)                 │
├────────────────────────────────────────────────────────────────────────────────────────┤
│                      MOTOR DE SHADERS WEBGL 2 (60 FPS NATIVO)                          │
│       (Balatro Vortex, Grid Scan, Ripple Grid, Faulty Terminal, Arc Lightning)         │
├────────────────────────────────────────────────────────────────────────────────────────┤
│                      CAMADA UNIVERSAL DRIZZLE ORM & POSTGRESQL                         │
│             (Leads, Membros, Formulários, Biblioteca, Sessões & Configs)               │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Os 6 Pilares do Sistema

### 1. Portal Institucional (`/`)
- **Hero Cinemático**: Alternância dinâmica de shaders WebGL carmesim a cada 3 segundos, capa animada e tipografia editorial de alto impacto.
- **Zonas de Transição de Shaders**: Passagem fluida entre seções através de gradientes de dispersão e blur atmosférico.
- **Prova Social & Autor**: Apresentação direta de Mateus Celestino, autoridade técnica, ecossistema e casos de sucesso auditados.

### 2. Shop Oficial (`/shop`)
- **Produtos Demonstrativos**:
  - *Seu Produto Aqui #1*: Template de alta conversão para vendas de ativos digitais.
  - *Seu Produto Aqui #2*: Pacote de fluxos e automações empresariais escaláveis.
  - *Seu Produto Aqui #3*: Sistema inteligente de captação e nutrição de leads.
  - *Seu Produto Aqui #4*: Treinamento imersivo e framework de agentes autônomos.
- **Serviços Demonstrativos**:
  - *Seu Serviço Aqui #1*: Consultoria e arquitetura de sistemas corporativos de IA.
  - *Seu Serviço Aqui #2*: Engenharia de software e plataformas customizadas de alta escala.
- **Checkout Direto & Modais**: Simulação interativa via canal oficial sanitizado.

### 3. Comunidade Privada VIP (`/comunidade`)
- **Área Restrita de Membros**: Acesso autenticado com feed de discussões, publicações técnicas e novidades exclusivas.
- **Editor de Tags & Navegação Inteligente**: Sistema de categorização de postagens e filtragem contextual por tópicos.
- **Biblioteca Multimídia & Video Player**: Player cinematográfico em `/comunidade/midias` com resolução otimizada.
- **Checkout Integrado Mercado Pago**: Checkout Pro em `/api/payment/checkout` com webhooks automatizados.

### 4. Free Resources Vault (`/biblioteca`)
- **Acervo Intelectual Aberto com 406 Recursos**: Livros, prompts, templates, códigos, planilhas e guias distribuídos em 11 categorias catalogadas.
- **Visualizador e Downloader Seguro**: Pré-visualização de arquivos de múltiplos formatos e download com telemetria via `/api/library/download`.
- **Busca em Tempo Real com Debounce**: Localização veloz de itens por título, categoria e tags.

### 5. Form Builder Cinemático (`/builder`)
- **Construtor Drag-and-Drop**: Criação dinâmica de formulários multi-step com múltiplos tipos de campos (texto, email, telefone, select, upload, etc.).
- **Form Runner Público** (`/builder/f/[id]` e `/f/[id]`): Interface responsiva e fluida com shaders em tempo real para os respondentes.
- **Lógica Condicional & Webhooks**: Disparo automático de dados para CRM, Notion API e e-mails transacionais via Resend.

### 6. Painel Admin & Library Control Suite (`/admin`)
- **Governança de Recursos**: Suíte completa de controle de acervo com criação de documentos, upload de arquivos, exclusão em massa (*bulk-delete*) e sincronização com a nuvem.
- **Editor de Postagens**: Modal avançado para criação e edição de artigos e comunicados oficiais.
- **Métricas de Negócio**: Acompanhamento de leads capturados, membros ativos e telemetria financeira.

---

## 🛠️ Instalação e Execução Local

### Pré-requisitos
- **Node.js** >= 18.18 (compatível com Node 20 / 22 / 24+)
- **NPM** >= 9.x
- **PostgreSQL** (Opcional para persistência remota via Neon/Supabase; opera com fallback autônomo local)

### Passo a Passo

1. **Clonar o Repositório:**
   ```bash
   git clone https://github.com/MateusCelestinoProX/mcp-business-os-demo.git
   cd mcp-business-os-demo
   ```

2. **Instalar Dependências:**
   ```bash
   npm install
   ```

3. **Configurar Variáveis de Ambiente:**
   ```bash
   cp .env.example .env.local
   # Preencha suas credenciais caso utilize os serviços externos (Neon, Mercado Pago, Resend, Notion)
   ```

4. **Executar em Modo de Desenvolvimento:**
   ```bash
   npm run dev
   ```
   Acesse a plataforma em `http://localhost:3000`.

5. **Compilar para Produção:**
   ```bash
   npm run build
   npm run start
   ```

---

## 📚 Documentação Especializada

- 📘 [**Arquitetura do Backend & APIs**](docs/BACKEND_ARCHITECTURE.md)
  - Drizzle ORM, schema relacional, autenticação JWT, controle de acesso RBAC, middleware Edge e especificação técnica de todos os endpoints REST.
- 📙 [**Recursos Adicionais & Integrações**](docs/RECURSOS_E_INTEGRACOES.md)
  - Motor de Shaders WebGL 2, integrações externas (Mercado Pago, Resend, Notion, WhatsApp), acervo de 176 artigos, 406 recursos da biblioteca e suíte de testes automatizados.
- 📕 [**Estabilidade Visual & Resolução de GPU Scroll**](docs/ESTABILIDADE_VISUAL.md)
  - Post-mortem técnico completo, investigação de gargalos de GPU/Compositor, eliminação de gambiarras, 13 regras de ouro de estabilidade visual e suite de testes de regressão automatizados.

---

## 🔒 Segurança e Governança

- **Identidade Oficial de Commit**: `Mateus Celestino <202405039459@alunos.estacio.br>`
- **Repositório**: Privado e restrito à conta `@MateusCelestinoProX`.
- **Licença**: Proprietária. Todos os direitos reservados a Mateus Celestino Pro X.
