## 2026-10-14T15:36:27Z
# DISPATCH — Database Architect & Drizzle Master (agent-database)

## Identidade e Função
- Archetype: teamwork_preview_test_writer
- Role: Database Architect & Drizzle Master
- Working directory: /Users/mcp/.gemini/antigravity/scratch/plataforma-unificada-soberana/.agents/teamwork/worker_database
- Parent Conversation ID: 5dd56657-d5a1-41aa-93aa-1f5dddb6096b

## MANDATORY INTEGRITY WARNING
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

## Documentos Mandatórios para Leitura
- /Users/mcp/.gemini/antigravity/scratch/plataforma-unificada-soberana/ORIGINAL_REQUEST.md
- /Users/mcp/.gemini/antigravity/scratch/plataforma-unificada-soberana/.agents/teamwork/explorer_survey_3/handoff.md
- /Users/mcp/.gemini/antigravity/scratch/plataforma-unificada-soberana/.agents/teamwork/explorer_survey_1/handoff.md

## Arquivos Exclusivos de Propriedade
- `/Users/mcp/.gemini/antigravity/scratch/plataforma-unificada-soberana/src/lib/db/schema.ts`
- `/Users/mcp/.gemini/antigravity/scratch/plataforma-unificada-soberana/src/lib/db/index.ts`
- `/Users/mcp/.gemini/antigravity/scratch/plataforma-unificada-soberana/src/lib/db/seed.ts`
- `/Users/mcp/.gemini/antigravity/scratch/plataforma-unificada-soberana/drizzle.config.ts`
- `/Users/mcp/.gemini/antigravity/scratch/plataforma-unificada-soberana/src/lib/auth/auth.ts`
- `/Users/mcp/.gemini/antigravity/scratch/plataforma-unificada-soberana/src/lib/auth/jwt.ts`
- `/Users/mcp/.gemini/antigravity/scratch/plataforma-unificada-soberana/src/lib/auth/session.ts`

## Missão
1. Implementar o Schema Consolidado Drizzle ORM em `src/lib/db/schema.ts`:
   - `admin_users`: id (uuid/text), email (unique), password_hash, role ('admin' | 'editor'), name, created_at, updated_at.
   - `leads`: id, name, email, phone, source ('tiktok' | 'meta' | 'organic'), utm_source, utm_campaign, utm_medium, utm_content, metadata (jsonb), created_at.
   - `members`: id, email (unique), password_hash, name, status ('active' | 'pending' | 'inactive'), tier ('free' | 'pro' | 'vip'), payment_id, created_at, last_login.
   - `forms`: id, title, description, slug (unique), schema_json (jsonb), is_active (boolean default true), user_id, created_at, updated_at.
   - `form_submissions`: id, form_id (references forms.id), data_json (jsonb), ip_address, created_at.
   - `library_items`: id, title, category, description, file_url, size_bytes, tags (jsonb), download_count (integer default 0), is_premium (boolean default false), created_at.
   - `articles`: id, slug (unique), title, summary, content, category, cover_url, reading_time, is_published (boolean default true), created_at.
   - `auth_sessions`: id, user_id, token (unique), expires_at, created_at.
2. Em `src/lib/db/index.ts`:
   - Configurar cliente Drizzle unificado compatível com PostgreSQL padrão e Neon Postgres (`@neondatabase/serverless` / `pg`).
   - Implementar fallback resiliente (safe mock/in-memory ou degraded handler) caso `DATABASE_URL` não esteja acessível em tempo de compilação estática (`npm run build`), garantindo que o build passe liso a frio.
3. Criar `drizzle.config.ts` na raiz do projeto.
4. Em `src/lib/auth/`:
   - `jwt.ts` e `auth.ts`: Criação e verificação de tokens JWT com `jose`, hash de senhas com `bcryptjs` e validação de sessão em cookies Next.js 15.
5. Criar `seed.ts` para popular itens padrão e o admin inicial `mateus@mateuscelestinopro.com`.
6. Validar tipagem e entregar `handoff.md`.
