# 🔍 DESCOBERTAS E RESTRIÇÕES — FINDINGS.MD

Este documento consolida as descobertas iniciais sobre a estrutura de arquivos e restrições do projeto.

---

## 📁 ESTRUTURA E EXTENSÕES DETECTADAS

Após mapear o diretório do projeto (excluindo arquivos de controle e pasta `RULES`), identificamos as seguintes extensões e quantidades de arquivos:

| Extensão | Quantidade | Descrição | Tratamento Proposto |
|---|---|---|---|
| **.pdf** | 281 | Documentos PDF | Renderização direta via `<iframe>` ou `<embed>` integrado no visualizador. |
| **.docx** | 24 | Documentos Microsoft Word | Extração de texto de `word/document.xml` no build Python e exibição na web. |
| **.txt** | 18 | Arquivos de texto simples | Renderização com quebras de linha e formatação padrão. |
| **.html / .htm** | 26 | Páginas web completas ou trechos | Visualização direta em iframe ou exibição do código/conteúdo. |
| **.png / .jpeg** | 19 | Imagens | Renderização de tag `<img>` com o caminho relativo para a imagem. |
| **.zip** | 1 | Arquivo compactado | Link para download ou exibição de metadados do arquivo. |

---

## 🏛️ PASTAS DE ORIGEM DE NÍVEL SUPERIOR (PASTAS PRINCIPAIS)

Estas pastas serão mapeadas como as **Hero Sessions** da Homepage:

1. `A.I ANIMATION`
2. `GERAL PROMPTS`
3. `HISTORIKA AI`
4. `MikoAI`
5. `Terrell Gentry - Build AI Agents Without Coding`
6. `The Skeleton Method`
7. `nano banana (gumroad).`

---

## ⚠️ RESTRIÇÕES E COMPORTAMENTO ESPERADO

- **Nenhuma biblioteca externa de terceiros**: A extração de `.docx` e manipulação de arquivos deve ser feita em Python nativo (`zipfile`, `xml.etree.ElementTree`, etc.).
- **Navegação aninhada perfeita**: A estrutura de pastas internas de cada Hero Session deve ser preservada em sua totalidade, permitindo navegar por subpastas e abrir os arquivos de forma responsiva e elegante.
- **Design Ultra Dark Vanta Black**: O visualizador deve integrar o conteúdo de forma harmônica no estilo escuro do site.
