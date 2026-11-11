import { marked } from 'marked';
import { sanitizeDangerousHtml, escapeHtml, sanitizeSafeUrl } from '@/lib/security/sanitize';

/**
 * ==============================================================================
 * NOTION & DIARY OS MARKDOWN PARSER (PORTABILIDADE SOBERANA)
 * ==============================================================================
 * Inspirado na arquitetura do Diary OS (Personal OS de Mateus Celestino Pro).
 * Converte blocos especiais Notion-like e Markdown livre para HTML de alta fidelidade:
 *  - :::callout [icon] [tipo] ... :::
 *  - :::toggle [título] ... :::
 *  - :::columns-2 / 3 ... :::col ... :::
 *  - :::embed [url] :::
 *  - :::bookmark [url] | [título] | [desc] :::
 *  - :::gallery ... :::
 */

// Configuração segura do marked
marked.setOptions({
  gfm: true,
  breaks: true,
});

/**
 * Renderiza um vídeo ou mídia embedada de forma responsiva
 */
function renderEmbedHtml(url: string): string {
  const cleanUrl = url.trim();
  
  // YouTube
  const ytMatch = cleanUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
  if (ytMatch && ytMatch[1]) {
    return `
      <div class="notion-embed my-6 aspect-video w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black">
        <iframe 
          src="https://www.youtube.com/embed/${ytMatch[1]}" 
          title="YouTube video player" 
          class="w-full h-full border-0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowfullscreen>
        </iframe>
      </div>
    `;
  }

  // Vimeo
  const vimeoMatch = cleanUrl.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|video\/|)(\d+)/i);
  if (vimeoMatch && vimeoMatch[3]) {
    return `
      <div class="notion-embed my-6 aspect-video w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black">
        <iframe 
          src="https://player.vimeo.com/video/${vimeoMatch[3]}" 
          class="w-full h-full border-0" 
          allow="autoplay; fullscreen; picture-in-picture" 
          allowfullscreen>
        </iframe>
      </div>
    `;
  }

  // Fallback para Link Interativo
  const safeUrl = escapeHtml(cleanUrl);
  return `
    <div class="notion-embed my-4 p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-[#ff073a]/40 transition-colors">
      <a href="${safeUrl}" target="_blank" rel="noopener noreferrer" class="flex items-center justify-between text-xs font-mono text-zinc-300 hover:text-white">
        <span class="truncate max-w-[85%]">${safeUrl}</span>
        <span class="text-[#ff073a] font-bold">Abrir Embed ↗</span>
      </a>
    </div>
  `;
}

/**
 * Renderiza Card de Bookmark Notion-like
 */
function renderBookmarkHtml(url: string, title?: string, desc?: string): string {
  const cleanUrl = url.trim();
  const safeUrl = escapeHtml(cleanUrl);
  const displayTitle = title ? title.trim() : cleanUrl;
  const displayDesc = desc ? desc.trim() : 'Recurso e referência externa.';

  return `
    <div class="notion-bookmark my-5 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-white/[0.04] to-black/40 border border-white/10 hover:border-[#ff073a]/40 transition-all shadow-lg group">
      <a href="${safeUrl}" target="_blank" rel="noopener noreferrer" class="block space-y-1.5">
        <div class="flex items-center justify-between">
          <span class="text-sm font-bold text-white group-hover:text-[#ff073a] transition-colors flex items-center gap-2">
            <span>🔖</span>
            <span class="truncate">${escapeHtml(displayTitle)}</span>
          </span>
          <span class="text-xs font-mono text-zinc-500 group-hover:text-zinc-300">↗</span>
        </div>
        <p class="text-xs text-zinc-400 font-light line-clamp-2">${escapeHtml(displayDesc)}</p>
        <span class="text-[11px] font-mono text-[#ff073a]/80 block pt-1 truncate">${safeUrl}</span>
      </a>
    </div>
  `;
}

/**
 * Transforma texto em Markdown com blocos customizados Notion-like em HTML
 */
export function parseNotionMarkdown(markdownContent: string): string {
  if (!markdownContent || typeof markdownContent !== 'string') {
    return '';
  }

  let safeMd = markdownContent;
  const blocks: string[] = [];

  // 1. Bloco de Callout :::callout [icon] [tipo]\nConteúdo\n:::
  safeMd = safeMd.replace(/:::callout(?:[ \t]+([^\n]*))?\n([\s\S]*?):::/g, (_m, header, content) => {
    const rawHeader = (header || '').trim();
    let icon = '💡';
    let type = 'info';

    let calloutTitle = '';
    if (rawHeader.includes('warning') || rawHeader.includes('aviso')) {
      icon = '⚠️';
      type = 'warning';
      calloutTitle = rawHeader.replace(/warning|aviso/gi, '').trim();
    } else if (rawHeader.includes('danger') || rawHeader.includes('perigo')) {
      icon = '🛑';
      type = 'danger';
      calloutTitle = rawHeader.replace(/danger|perigo/gi, '').trim();
    } else if (rawHeader.includes('success') || rawHeader.includes('sucesso')) {
      icon = '✅';
      type = 'success';
      calloutTitle = rawHeader.replace(/success|sucesso/gi, '').trim();
    } else if (rawHeader.length > 0) {
      const parts = rawHeader.split(' ');
      if (parts[0]) icon = parts[0];
      if (parts.length > 1) {
        calloutTitle = parts.slice(1).join(' ').trim();
      }
    }

    const parsedContent = marked.parse(content.trim()) as string;
    const borderClass =
      type === 'danger'
        ? 'border-red-500/50 bg-red-950/20'
        : type === 'warning'
        ? 'border-amber-500/50 bg-amber-950/20'
        : type === 'success'
        ? 'border-emerald-500/50 bg-emerald-950/20'
        : 'border-[#ff073a]/40 bg-[#8a0012]/10';

    const html = `
      <div class="notion-callout my-5 p-4 sm:p-5 rounded-2xl border ${borderClass} flex items-start gap-3.5 backdrop-blur-md shadow-md">
        <span class="notion-callout-icon text-2xl shrink-0 select-none">${icon}</span>
        <div class="text-sm text-zinc-200 leading-relaxed flex-1 prose-callout">
          ${calloutTitle ? `<div class="font-bold text-white mb-1">${escapeHtml(calloutTitle)}</div>` : ''}
          ${parsedContent}
        </div>
      </div>
    `;

    const idx = blocks.length;
    blocks.push(html);
    return `\n\n<div data-notion-placeholder="${idx}"></div>\n\n`;
  });

  // 2. Bloco de Alternância / Toggle Acordeão :::toggle Título\nConteúdo\n:::
  safeMd = safeMd.replace(/:::toggle\s+([^\n]+)\n([\s\S]*?):::/g, (_m, title, content) => {
    const parsedContent = marked.parse(content.trim()) as string;
    const html = `
      <details class="notion-toggle my-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all overflow-hidden group/toggle" open>
        <summary class="p-4 cursor-pointer flex items-center justify-between text-sm font-bold text-white select-none hover:bg-white/[0.02]">
          <div class="flex items-center gap-2.5">
            <span class="w-2 h-2 rounded-full bg-[#ff073a] animate-pulse"></span>
            <span>${escapeHtml(title.trim())}</span>
          </div>
          <span class="text-xs font-mono text-zinc-500 group-open/toggle:rotate-180 transition-transform">▼</span>
        </summary>
        <div class="p-4 pt-1 border-t border-white/5 text-sm text-zinc-300 leading-relaxed">
          ${parsedContent}
        </div>
      </details>
    `;

    const idx = blocks.length;
    blocks.push(html);
    return `\n\n<div data-notion-placeholder="${idx}"></div>\n\n`;
  });

  // 3. Colunas :::columns-2 / 3 :::col ou ---
  safeMd = safeMd.replace(/:::columns-([23])\s*\n([\s\S]*?):::/g, (_m, colNum, inner) => {
    const cols = inner.split(/(?::::col|---)\s*\n/).filter((c: string) => c.trim().length > 0);
    const colsHtml = cols
      .map((c: string) => `<div class="flex-1 p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-sm text-zinc-300">${marked.parse(c.trim())}</div>`)
      .join('');
    const gridCols = colNum === '3' ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1 md:grid-cols-2';
    const html = `<div class="notion-columns-${colNum} grid ${gridCols} gap-4 my-6">${colsHtml}</div>`;

    const idx = blocks.length;
    blocks.push(html);
    return `\n\n<div data-notion-placeholder="${idx}"></div>\n\n`;
  });

  // 4. Mídia Embedada :::embed URL :::
  safeMd = safeMd.replace(/:::embed(?:\s+|\s*\n)(https?:\/\/[^\s\n]+)(?:[\t ]*:::)?/g, (_m, url) => {
    const html = renderEmbedHtml(url.trim());
    const idx = blocks.length;
    blocks.push(html);
    return `\n\n<div data-notion-placeholder="${idx}"></div>\n\n`;
  });

  // 5. Bookmark Card :::bookmark URL | Título | Descrição :::
  safeMd = safeMd.replace(/:::bookmark(?:\s+|\s*\n)(https?:\/\/[^\s|\n]+)(?:\s*\|\s*([^|\n]+))?(?:\s*\|\s*([^\n]+))?(?:[\t ]*:::)?/g, (_m, url, title, desc) => {
    const html = renderBookmarkHtml(url, title, desc);
    const idx = blocks.length;
    blocks.push(html);
    return `\n\n<div data-notion-placeholder="${idx}"></div>\n\n`;
  });

  // 6. Galeria de Mídias :::gallery\nURL1\nURL2\n:::
  safeMd = safeMd.replace(/:::gallery(?:[ \t]+([^\n]*))?\n([\s\S]*?):::/g, (_m, title, inner) => {
    const lines = inner
      .split('\n')
      .map((l: string) => l.trim())
      .filter((l: string) => l.startsWith('http') || l.startsWith('/'));

    const itemsHtml = lines
      .map(
        (url: string) => `
          <div class="relative aspect-video rounded-xl overflow-hidden bg-black border border-white/10 group/img">
            <img src="${url}" alt="Mídia da Galeria" class="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500" loading="lazy" />
          </div>
        `
      )
      .join('');

    const html = `
      <div class="my-6 space-y-2">
        ${title ? `<h5 class="text-xs font-mono text-zinc-400 font-bold uppercase tracking-wider">${escapeHtml(title.trim())}</h5>` : ''}
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">${itemsHtml}</div>
      </div>
    `;

    const idx = blocks.length;
    blocks.push(html);
    return `\n\n<div data-notion-placeholder="${idx}"></div>\n\n`;
  });

  // Renderiza o restante via marked
  let finalHtml = marked.parse(safeMd) as string;

  // Reinsere os blocos customizados removendo qualquer parágrafo envolvente
  blocks.forEach((block, idx) => {
    const placeholder = `<div data-notion-placeholder="${idx}"></div>`;
    const regex = new RegExp(`(?:<p>\\s*)?${placeholder}(?:\\s*<\\/p>)?`, 'g');
    finalHtml = finalHtml.replace(regex, block);
  });

  return sanitizeDangerousHtml(finalHtml);
}

/**
 * Calcula tempo estimado de leitura (200 palavras/minuto)
 */
export function calculateReadingTime(text: string): string {
  if (!text) return '3 min';
  const clean = text.replace(/<[^>]*>/g, '').replace(/:::[^:]+:::/g, '');
  const words = clean.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min`;
}

/**
 * Extrai resumo conciso das primeiras linhas de texto
 */
export function extractExcerpt(text: string, maxLength: number = 180): string {
  if (!text) return '';
  const clean = text
    .replace(/<[^>]*>/g, '')
    .replace(/:::[^:]+:::/g, '')
    .replace(/[#*`_~\[\]]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  if (clean.length <= maxLength) return clean;
  return clean.slice(0, maxLength).trim() + '...';
}

/**
 * Templates de Estrutura Inicial para Criação Rápida
 */
export const NOTION_ARTICLE_TEMPLATES = [
  {
    id: 'tutorial',
    name: 'Guia Prático / Tutorial',
    description: 'Estrutura com introdução, pré-requisitos, passo a passo e callouts.',
    content: `# Introdução ao Processo

Neste artigo você aprenderá a arquitetar uma solução moderna, robusta e escalável.

:::callout 💡 Destaque
Este guia foi testado e validado em ambiente de produção com alto tráfego.
:::

## Pré-requisitos Obrigatórios

- Ambiente Node.js v24+ ou Docker configurado
- Chave de API ativa do serviço
- Acesso ao terminal de comandos

## Passo a Passo de Execução

1. Inicialize o repositório oficial
2. Configure as variáveis de ambiente necessárias
3. Execute os testes de integração

:::toggle ⚙️ Ver Detalhes Avançados de Configuração
Aqui você pode detalhar parâmetros extras, arquivos de configuração e variáveis opcionais.
:::

## Arquitetura em Múltiplas Colunas

:::columns-2
### Fluxo de Entrada
Recebimento do webhook e sanitização de dados em tempo real.
:::col
### Fluxo de Saída
Distribuição assíncrona para o banco de dados e notificação.
:::

## Conclusão e Próximos Passos

Agora que a infraestrutura está operacional, você pode conectar novos endpoints e monitorar a telemetria.
`,
  },
  {
    id: 'review',
    name: 'Análise de Ferramenta / Benchmark',
    description: 'Comparativo, prós e contras, bookmarks e galeria de telas.',
    content: `# Análise Aprofundada da Ferramenta

Uma visão técnica e detalhada dos benefícios, arquitetura interna e limites de escalabilidade.

:::bookmark https://github.com/mateuscelestinopro | Repositório Oficial | Código-fonte e documentação aberta. :::

## Principais Recursos e Diferenciais

- Performance otimizada com baixo consumo de memória
- Interface intuitiva inspirada no Notion
- Total compatibilidade com bancos de dados relacionais modernos

:::callout ⚠️ Ponto de Atenção
Certifique-se de configurar políticas de segurança e RLS antes de expor endpoints ao público.
:::

## Galeria de Mídias e Telas

:::gallery Telas de Demonstração
/assets/recursos_cover.webp
/assets/hero_cover.webp
:::

## Veredito Técnico

Uma excelente adição ao arsenal de qualquer engenheiro de automação e desenvolvedor full-stack.
`,
  },
  {
    id: 'case-study',
    name: 'Estudo de Caso & Engenharia Soberana',
    description: 'Documentação profunda de arquitetura, decisões técnicas e métricas.',
    content: `# Estudo de Caso de Engenharia Soberana

Detalhamento arquitetural de alta fidelidade e métricas de desempenho sob estresse.

:::callout 🚀 Sucesso Operacional
Atingimos 99.99% de disponibilidade com tempo de resposta médio inferior a 80ms.
:::

## Contexto e Desafio Técnico

Como unificamos múltiplos microsserviços em uma plataforma soberana sem perda de dados e com isolamento total.

:::columns-2
### Camada de Ingestão
APIs resilientes com validação e tipagem forte em runtime.
:::col
### Camada de Persistência
Supabase PostgreSQL com Drizzle ORM e transações atômicas.
:::

## Conclusão
Uma arquitetura pronta para suportar escala massiva sem sobrecarga de servidores.
`,
  },
];
