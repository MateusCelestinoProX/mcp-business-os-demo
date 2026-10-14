# 📜 CONSTITUIÇÃO DO PROJETO — GEMINI.MD

Este documento serve como a fonte da verdade e constituição para o projeto de conversão de arquivos e diretórios em uma página web interativa.

---

## 📐 ESQUEMA DE DADOS (JSON DATA SCHEMA)

O site é autocontido e renderiza o conteúdo a partir de uma estrutura de árvore em JSON injetada na tag `<script id="site-data" type="application/json">`.

### Estrutura de Nó da Árvore (Tree Node)

Cada nó na árvore pode ser um diretório (pasta) ou um arquivo.

```json
{
  "name": "Nome original do arquivo/pasta no sistema de arquivos",
  "displayName": "Nome limpo para exibição na interface",
  "type": "root | folder | file",
  "path": "Caminho relativo ao diretório raiz do projeto (ex: 'A.I ANIMATION/Styles/1.pdf')",
  "fileType": "txt | pdf | md | docx | other",
  "content": "Texto bruto (para .txt, .md). No caso de .docx, o texto extraído. Para .pdf ou outros tipos não-texto, este campo pode ser nulo ou conter metadados.",
  "children": [
    // Lista de nós filhos (apenas se type for 'root' ou 'folder')
  ]
}
```

---

## 🛠️ REGRAS COMPORTAMENTAIS E DE DESIGN

1. **Ultra Dark Vanta Black**: O site deve seguir um design premium, com fundo `#000000` puro, superfícies translúcidas com efeito de vidro (glassmorphic) usando `backdrop-filter: blur`, e luzes/efeitos white-glow divinos.
2. **Homepage Dinâmica (Novidade)**: O site deve abrir em uma Homepage que possui Hero Sections (uma para cada pasta de nível superior na raiz do projeto).
3. **Caminho Perfeito (Breadcrumbs)**: Dentro de cada pasta, o caminho completo e a hierarquia original devem ser preservados exatamente como no modelo original.
4. **Visualização de Arquivos**:
   - **TXT**: Renderizado com quebras de linha e formatação de seções.
   - **MD (Markdown)**: Renderizado com parser HTML para títulos, links, tabelas, blocos de código e listas.
   - **PDF**: Exibido de forma integrada na página via tag `<iframe src="caminho/do/arquivo.pdf">` ou `<embed>` para permitir visualização e leitura direta na web.
   - **DOCX**: O texto e estrutura básica devem ser lidos e apresentados de forma legível na web.
5. **Autocontido (Single File)**: A compilação gera um arquivo `index.html` único que incorpora todo o CSS, JS e a base de dados em JSON. Os arquivos binários pesados (como PDFs) são referenciados de forma relativa por seus caminhos.

---

## 🪵 LOG DE MANUTENÇÃO E HISTÓRICO

- **2026-07-12**: Inicialização do projeto e adoção do protocolo V.L.A.E.G. Mapeamento das novas regras e planejamento da conversão de múltiplos formatos de arquivo.
