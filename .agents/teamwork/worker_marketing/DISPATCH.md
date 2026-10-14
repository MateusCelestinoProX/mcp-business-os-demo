# DISPATCH — Growth Engineer & Portal Institucional Specialist (agent-marketing)

## Identidade e Função
- Archetype: teamwork_preview_test_writer
- Role: Growth Engineer & Portal Specialist
- Working directory: /Users/mcp/.gemini/antigravity/scratch/plataforma-unificada-soberana/.agents/teamwork/worker_marketing
- Parent Conversation ID: 5dd56657-d5a1-41aa-93aa-1f5dddb6096b

## MANDATORY INTEGRITY WARNING
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

## Documentos Mandatórios para Leitura
- /Users/mcp/.gemini/antigravity/scratch/plataforma-unificada-soberana/ORIGINAL_REQUEST.md
- /Users/mcp/.gemini/antigravity/scratch/plataforma-unificada-soberana/.agents/teamwork/explorer_survey_1/handoff.md

## Arquivos Exclusivos de Propriedade
- `/Users/mcp/.gemini/antigravity/scratch/plataforma-unificada-soberana/src/app/page.tsx`
- `/Users/mcp/.gemini/antigravity/scratch/plataforma-unificada-soberana/src/components/portal/HeroSection.tsx`
- `/Users/mcp/.gemini/antigravity/scratch/plataforma-unificada-soberana/src/components/portal/EcosystemShowcase.tsx`
- `/Users/mcp/.gemini/antigravity/scratch/plataforma-unificada-soberana/src/components/portal/DynamicArticles.tsx`
- `/Users/mcp/.gemini/antigravity/scratch/plataforma-unificada-soberana/src/components/portal/LeadCaptureForm.tsx`
- `/Users/mcp/.gemini/antigravity/scratch/plataforma-unificada-soberana/src/components/portal/MetricsBanner.tsx`
- `/Users/mcp/.gemini/antigravity/scratch/plataforma-unificada-soberana/src/app/api/leads/route.ts`
- `/Users/mcp/.gemini/antigravity/scratch/plataforma-unificada-soberana/src/data/articles.json` (cópia otimizada dos 176 artigos)

## Fontes Originais para Portabilidade
- `/Users/mcp/.gemini/antigravity/scratch/mateus-celestino-pro-x/src/` (`App.jsx`, `components/Hero.jsx`, `components/ArticlesSection.jsx`, `components/ContatoSection.jsx`, `data/articles.json`)

## Missão
1. Implementar a Landing Page do Portal Institucional em `src/app/page.tsx`:
   - Hero cinemático com tipografia imponente, acentos carmesim e integração com o fundo Shader/Glass.
   - Vitrine dos 4 ecossistemas (Branding Software, Área de Membros Visuals, Construtor de Formulários e Cofre Oculto de Recursos).
   - Seção de Artigos Dinâmicos com busca rápida, paginação e modal/drawer de leitura.
   - Métricas de impacto e autoridade de Mateus Celestino Pro.
   - Formulário de Captura de Leads com captura automática de parâmetros UTM (TikTok Ads e Meta Ads: `utm_source`, `utm_campaign`, etc.).
2. Implementar a Rota de API `src/app/api/leads/route.ts`:
   - POST: Validação segura de nome, email, telefone e UTMs, salvando via Drizzle ORM na tabela `leads` e retornando HTTP 201 JSON.
   - GET: Consulta protegida de leads com paginação.
3. Copiar e garantir a integridade dos artigos de `/Users/mcp/.gemini/antigravity/scratch/mateus-celestino-pro-x/src/data/articles.json` para `src/data/articles.json`.
4. Validar e entregar `handoff.md`.


## 2026-10-14T15:36:27Z
Você é o Growth Engineer & Portal Institucional Specialist (agent-marketing).
Seu diretório de trabalho dedicado é: /Users/mcp/.gemini/antigravity/scratch/plataforma-unificada-soberana/.agents/teamwork/worker_marketing
LEIA OBRIGATORIAMENTE:
- /Users/mcp/.gemini/antigravity/scratch/plataforma-unificada-soberana/ORIGINAL_REQUEST.md
- /Users/mcp/.gemini/antigravity/scratch/plataforma-unificada-soberana/.agents/teamwork/worker_marketing/DISPATCH.md
- /Users/mcp/.gemini/antigravity/scratch/plataforma-unificada-soberana/.agents/teamwork/explorer_survey_1/handoff.md

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Sua missão específica:
Implementar o Portal Institucional & Tráfego de Alta Conversão em /Users/mcp/.gemini/antigravity/scratch/plataforma-unificada-soberana:
1. `src/app/page.tsx`: Landing page institucional com Hero imponente integrado aos Shaders e Glassmorphism, Vitrine dos 4 Ecossistemas de Software, Catálogo dinâmico de Artigos, Prova Social e Seção de Captura de Leads.
2. Componentes dedicados em `src/components/portal/`:
   - `HeroSection.tsx`: Chamada de autoridade, tipografia refinada e botões cinemáticos com brilho neon.
   - `EcosystemShowcase.tsx`: Cards de vidro conectando os 4 módulos (Institucional, Comunidade, Construtor, Biblioteca).
   - `DynamicArticles.tsx`: Busca instantânea e paginação sobre os 176 artigos técnicos de Mateus Celestino Pro.
   - `LeadCaptureForm.tsx`: Formulário com captura automática de parâmetros UTM de tráfego pago (TikTok Ads e Meta Ads: utm_source, utm_campaign, etc.) e feedback em tempo real.
   - `MetricsBanner.tsx`: Métricas de impacto e autoridade.
3. Portar o catálogo de 176 artigos de `/Users/mcp/.gemini/antigravity/scratch/mateus-celestino-pro-x/src/data/articles.json` para `src/data/articles.json`.
4. `src/app/api/leads/route.ts`: Rota de API POST para receber e validar leads com persistência no Drizzle ORM (tabela `leads`), retornando HTTP 201, e GET para listagem administrativa paginada.
5. Se realizar commits git, use: `Mateus Celestino <202405039459@alunos.estacio.br>`.
6. Registrar progresso em `progress.md` e entregar `handoff.md`. Ao concluir, avise o parent.
