# DISPATCH — Members Area & Community Engineer (agent-members)

## Identidade e Função
- Archetype: teamwork_preview_test_writer
- Role: Members Area & Community Engineer
- Working directory: /Users/mcp/.gemini/antigravity/scratch/plataforma-unificada-soberana/.agents/teamwork/worker_members
- Parent Conversation ID: 5dd56657-d5a1-41aa-93aa-1f5dddb6096b

## MANDATORY INTEGRITY WARNING
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

## Documentos Mandatórios para Leitura
- /Users/mcp/.gemini/antigravity/scratch/plataforma-unificada-soberana/ORIGINAL_REQUEST.md
- /Users/mcp/.gemini/antigravity/scratch/plataforma-unificada-soberana/.agents/teamwork/explorer_survey_3/handoff.md

## Arquivos Exclusivos de Propriedade
- `/Users/mcp/.gemini/antigravity/scratch/plataforma-unificada-soberana/src/app/comunidade/page.tsx`
- `/Users/mcp/.gemini/antigravity/scratch/plataforma-unificada-soberana/src/app/comunidade/midias/page.tsx`
- `/Users/mcp/.gemini/antigravity/scratch/plataforma-unificada-soberana/src/app/comunidade/login/page.tsx`
- `/Users/mcp/.gemini/antigravity/scratch/plataforma-unificada-soberana/src/app/comunidade/cadastro/page.tsx`
- `/Users/mcp/.gemini/antigravity/scratch/plataforma-unificada-soberana/src/components/comunidade/VideoPlayer.tsx`
- `/Users/mcp/.gemini/antigravity/scratch/plataforma-unificada-soberana/src/components/comunidade/CommunityFeed.tsx`
- `/Users/mcp/.gemini/antigravity/scratch/plataforma-unificada-soberana/src/components/comunidade/MemberCard.tsx`
- `/Users/mcp/.gemini/antigravity/scratch/plataforma-unificada-soberana/src/components/comunidade/CheckoutModal.tsx`
- `/Users/mcp/.gemini/antigravity/scratch/plataforma-unificada-soberana/src/app/api/auth/login/route.ts`
- `/Users/mcp/.gemini/antigravity/scratch/plataforma-unificada-soberana/src/app/api/auth/register/route.ts`
- `/Users/mcp/.gemini/antigravity/scratch/plataforma-unificada-soberana/src/app/api/auth/me/route.ts`
- `/Users/mcp/.gemini/antigravity/scratch/plataforma-unificada-soberana/src/app/api/payment/checkout/route.ts`
- `/Users/mcp/.gemini/antigravity/scratch/plataforma-unificada-soberana/src/app/api/payment/webhook/route.ts`

## Fontes Originais para Portabilidade
- `/Users/mcp/.gemini/antigravity/scratch/visuals-app-saas/` (`app.js`, `index.html`, `api/create-payment.js`, `src/data/products_data.json`)

## Missão
1. Implementar a Área de Membros e Comunidade Fechada em `src/app/comunidade/`:
   - `page.tsx`: Dashboard de boas-vindas com trilhas de conteúdo, anúncios oficiais e status do membro.
   - `midias/page.tsx`: Catálogo interativo de vídeos e mídias de alta performance com player cinemático customizado (`VideoPlayer.tsx`).
   - `login/page.tsx` e `cadastro/page.tsx`: Telas com visual dark glass, campos validados e integração direta com as APIs de autenticação.
2. Criar os componentes interativos em `src/components/comunidade/`:
   - `VideoPlayer.tsx`: Player customizado de vídeo com controles premium dark glass.
   - `CommunityFeed.tsx`: Feed de postagens e discussões entre membros.
   - `MemberCard.tsx`: Cartão de identidade VIP com badges de nível de acesso.
   - `CheckoutModal.tsx`: Modal integrado para aquisição de planos via Mercado Pago.
3. Implementar as Rotas de API:
   - `/api/auth/login` e `/api/auth/register`: Autenticação e emissão de JWT/Cookies seguros via Drizzle ORM (tabela `members`).
   - `/api/auth/me`: Retorno do perfil autenticado.
   - `/api/payment/checkout`: Criação de preferência de pagamento Mercado Pago (ou modo sandbox nativo).
   - `/api/payment/webhook`: Processamento de notificações de pagamento e ativação do status do membro.
4. Validar e entregar `handoff.md`.


## 2026-10-14T15:36:27Z
Você é o Members Area & Community Engineer (agent-members).
Seu diretório de trabalho dedicado é: /Users/mcp/.gemini/antigravity/scratch/plataforma-unificada-soberana/.agents/teamwork/worker_members
LEIA OBRIGATORIAMENTE:
- /Users/mcp/.gemini/antigravity/scratch/plataforma-unificada-soberana/ORIGINAL_REQUEST.md
- /Users/mcp/.gemini/antigravity/scratch/plataforma-unificada-soberana/.agents/teamwork/worker_members/DISPATCH.md
- /Users/mcp/.gemini/antigravity/scratch/plataforma-unificada-soberana/.agents/teamwork/explorer_survey_3/handoff.md

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Sua missão específica:
Implementar a Área de Membros e Comunidade Fechada em Next.js 15 App Router em /Users/mcp/.gemini/antigravity/scratch/plataforma-unificada-soberana:
1. Páginas em `src/app/comunidade/`:
   - `page.tsx`: Dashboard restrito da comunidade fechada com feed interativo, comunicados oficiais, trilhas de aprendizagem e status VIP do membro.
   - `midias/page.tsx`: Catálogo cinemático de mídias e vídeos exclusivos com player de alta definição integrado.
   - `login/page.tsx` e `cadastro/page.tsx`: Telas de autenticação com visual dark glass, campos validados e integração com auth API.
2. Componentes dedicados em `src/components/comunidade/`:
   - `VideoPlayer.tsx`: Player cinematográfico com controles customizados dark glass.
   - `CommunityFeed.tsx`: Feed de postagens com reações e comentários.
   - `MemberCard.tsx`: Card de perfil com badge de nível de membro.
   - `CheckoutModal.tsx`: Modal integrado para compra e upgrade de planos via Mercado Pago.
3. Rotas de API:
   - `src/app/api/auth/login/route.ts` e `src/app/api/auth/register/route.ts`: Autenticação e emissão de JWT/Cookies seguros via Drizzle ORM (tabela `members`).
   - `src/app/api/auth/me/route.ts`: Verificação do membro autenticado.
   - `src/app/api/payment/checkout/route.ts`: Criação de preferência de pagamento Mercado Pago (ou modo sandbox simulado quando sem token).
   - `src/app/api/payment/webhook/route.ts`: Webhook para confirmação de pagamento e ativação do plano do membro.
4. Se realizar commits git, use: `Mateus Celestino <202405039459@alunos.estacio.br>`.
5. Registrar progresso em `progress.md` e entregar `handoff.md`. Ao concluir, avise o parent.
