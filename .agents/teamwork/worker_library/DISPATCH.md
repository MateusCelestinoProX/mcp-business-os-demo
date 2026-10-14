## 2026-10-14T15:36:27Z
Você é o Digital Assets & Vault Engineer (agent-library).
Seu diretório de trabalho dedicado é: /Users/mcp/.gemini/antigravity/scratch/plataforma-unificada-soberana/.agents/teamwork/worker_library
LEIA OBRIGATORIAMENTE:
- /Users/mcp/.gemini/antigravity/scratch/plataforma-unificada-soberana/ORIGINAL_REQUEST.md
- /Users/mcp/.gemini/antigravity/scratch/plataforma-unificada-soberana/.agents/teamwork/worker_library/DISPATCH.md
- /Users/mcp/.gemini/antigravity/scratch/plataforma-unificada-soberana/.agents/teamwork/explorer_survey_1/handoff.md

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Sua missão específica:
Implementar o Cofre da Biblioteca Oculta de Recursos em Next.js 15 App Router em /Users/mcp/.gemini/antigravity/scratch/plataforma-unificada-soberana:
1. Copiar o catálogo oficial:
   - Copiar `/Users/mcp/.gemini/antigravity/scratch/s-a-a-s-full-hidden-library/library_catalog_index.json` (406 itens catalogados) para `/Users/mcp/.gemini/antigravity/scratch/plataforma-unificada-soberana/public/data/library_catalog_index.json`.
2. Implementar as páginas em `src/app/biblioteca/`:
   - `page.tsx`: Interface do cofre com Cerimônia de Acesso ("Galadriel & Associados"), barra de busca instantânea com debounce e contagem de itens, filtros rápidos por categorias (Prompts, Ferramentas, Blueprints, APKs, Materiais, Documentação), visualização em grid responsivo de cards dark glass e paginação inteligente.
   - `[id]/page.tsx`: Visualizador detalhado do item com metadados completos (tamanho, formato, categoria, data), preview do texto/conteúdo e botão de download.
3. Componentes dedicados em `src/components/library/`:
   - `CatalogGrid.tsx`: Exibição de cards com efeito glassmorphism e badges de extensão.
   - `SearchHeader.tsx`: Campo de busca cinemático com atalho de teclado e filtros dinâmicos.
   - `ResourceViewer.tsx`: Renderizador para múltiplos tipos (código, prompt, texto formatado, PDF viewer).
   - `DownloadButton.tsx`: Botão de download com feedback animado e registro de telemetria.
4. Rotas de API:
   - `src/app/api/library/route.ts`: Endpoint para consulta com paginação, busca por termos nos campos `title`, `description` e `text_preview`, e filtragem por categoria.
   - `src/app/api/library/download/route.ts`: Endpoint para registrar download e servir os metadados/arquivo seguro.
5. Se realizar commits git, use: `Mateus Celestino <202405039459@alunos.estacio.br>`.
6. Registrar progresso em `progress.md` e entregar `handoff.md`. Ao concluir, avise o parent.
