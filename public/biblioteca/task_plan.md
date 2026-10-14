# 📋 PLANO DE TAREFAS — TASK_PLAN.MD

Este documento define o checklist de desenvolvimento do Conversor Multi-formatos de Arquivos em Website.

---

## 🚀 CHECKLIST DE DESENVOLVIMENTO

- [x] **Fase 0: Inicialização e Mapeamento**
    - [x] Criar `gemini.md` (Constituição)
    - [x] Criar `task_plan.md` (Plano de tarefas)
    - [x] Criar `findings.md` (Descobertas)
    - [x] Criar `progress.md` (Progresso)
    - [x] Identificar e catalogar todos os arquivos das pastas no workspace por tipo/extensão
- [x] **Fase 1: Implementação Plan e Design**
    - [x] Criar `implementation_plan.md` (como artefato do sistema para aprovação)
    - [x] Definir a lógica de leitura para `.txt`, `.md`, `.pdf`, `.docx` e outros no script de build
- [x] **Fase 2: Script de Build (`build_site.py`)**
    - [x] Atualizar o mapeamento de pastas do script para incluir todas as pastas do workspace, exceto `.git`, `RULES`, etc.
    - [x] Implementar leitura de Markdown (`.md`)
    - [x] Implementar leitura de DOCX (`.docx`) usando módulo nativo `zipfile` para extrair texto do XML interno (evitando dependências externas)
    - [x] Registrar arquivos PDF e outros sem carregar conteúdo binário direto no JSON (manter referência ao caminho)
    - [x] Gerar estrutura hierárquica completa no JSON
- [x] **Fase 3: Interface do Frontend (`app.js` e `style.css`)**
    - [x] Projetar a Homepage com Hero Sessions (uma para cada pasta de nível superior)
    - [x] Atualizar navegação por breadcrumbs para suportar múltiplos diretórios de nível superior
    - [x] Implementar renderizador Markdown simples no frontend
    - [x] Implementar visualizador de PDF usando `<iframe>` ou `<embed>` integrado no layout de leitura
    - [x] Implementar renderizador para conteúdo DOCX (texto formatado simples)
    - [x] Manter e aprimorar o estilo Ultra Dark Vanta Black com glassmorphism e efeitos luminosos
- [x] **Fase 4: Verificação e Deploy**
    - [x] Rodar o build e verificar geração do `index.html`
    - [x] Testar no navegador
    - [x] Validar links e responsividade
