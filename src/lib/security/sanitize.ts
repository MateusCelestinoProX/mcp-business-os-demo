import crypto from 'node:crypto';

/**
 * ============================================================
 * MÓDULO SOBERANO DE SANITIZAÇÃO DE HTML, URL, XML E HEADERS
 * ============================================================
 * Proteção em profundidade contra Stored/Reflected XSS, DOM XSS,
 * XML Injection, JSON-LD Script Breakout e CRLF Header Injection.
 */

const NAMED_HTML_ENTITIES: Record<string, string> = {
  lt: '<',
  gt: '>',
  amp: '&',
  quot: '"',
  apos: "'",
  nbsp: ' ',
  colon: ':',
  tab: '\t',
  newline: '\n',
};

export function decodeHtmlEntities(input: string): string {
  if (!input || typeof input !== 'string') return '';
  return input
    .replace(/&#x([0-9a-fA-F]+);?/gi, (_, hex) => {
      const code = parseInt(hex, 16);
      return Number.isFinite(code) && code > 0 && code <= 0x10ffff
        ? String.fromCodePoint(code)
        : '';
    })
    .replace(/&#(\d+);?/g, (_, dec) => {
      const code = parseInt(dec, 10);
      return Number.isFinite(code) && code > 0 && code <= 0x10ffff
        ? String.fromCodePoint(code)
        : '';
    })
    .replace(/&([a-zA-Z]+);?/g, (full, name: string) => {
      const lower = name.toLowerCase();
      return lower in NAMED_HTML_ENTITIES ? NAMED_HTML_ENTITIES[lower] : full;
    });
}

export function escapeHtml(input: string | null | undefined): string {
  if (typeof input !== 'string') return '';
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/`/g, '&#96;');
}

export function escapeXml(input: string | null | undefined): string {
  if (typeof input !== 'string') return '';
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export function stripCrlf(input: string | null | undefined): string {
  if (typeof input !== 'string') return '';
  return input.replace(/[\r\n\x00-\x1f\x7f]+/g, ' ').trim();
}

export function safeContentDispositionFilename(name: string | null | undefined): string {
  const base = stripCrlf(name || 'resource')
    .replace(/[/\\]+/g, '_')
    .replace(/["';]+/g, '_')
    .replace(/[^\w.\-()\s[\]]+/g, '_')
    .trim();
  return base || 'resource';
}

export function sanitizeJsonLd(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
}

export interface SafeUrlOptions {
  allowRelative?: boolean;
  allowMailto?: boolean;
  allowDataImage?: boolean;
}

/**
 * Valida e normaliza URLs removendo entidades ofuscadas e esquemas perigosos
 * (javascript:, vbscript:, data:text/html, file:, //protocol-relative).
 */
export function sanitizeSafeUrl(
  rawUrl: string | null | undefined,
  options: SafeUrlOptions = {}
): string {
  if (!rawUrl || typeof rawUrl !== 'string') return '#';
  const { allowRelative = true, allowMailto = false, allowDataImage = false } = options;

  let normalized = rawUrl.trim();
  if (!normalized) return '#';

  // Decodifica iterativamente para detectar esquemas ofuscados via HTML entities ou % encoding
  let inspected = normalized;
  for (let i = 0; i < 3; i++) {
    inspected = decodeHtmlEntities(inspected);
    try {
      inspected = decodeURIComponent(inspected);
    } catch {
      // ignora sequências percentuais parciais
    }
  }
  const compact = inspected.replace(/[\x00-\x20\x7f\u00a0]+/g, '').toLowerCase();

  if (
    compact.startsWith('javascript:') ||
    compact.startsWith('vbscript:') ||
    compact.startsWith('file:')
  ) {
    return '#';
  }

  if (compact.startsWith('data:')) {
    if (
      allowDataImage &&
      /^data:image\/(png|jpeg|jpg|webp|gif);base64,[a-z0-9+/=]+$/i.test(
        normalized.replace(/\s+/g, '')
      )
    ) {
      return normalized.trim();
    }
    return '#';
  }

  if (compact.startsWith('mailto:')) {
    if (!allowMailto) return '#';
    const addr = normalized.trim().slice(7).split('?')[0];
    if (!/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(addr)) return '#';
    return normalized.trim();
  }

  // Bloquear URLs protocol-relative (//attacker.com)
  if (normalized.startsWith('//') || compact.startsWith('//')) {
    return '#';
  }

  // Caminhos relativos explícitos seguros
  if (
    allowRelative &&
    (normalized.startsWith('/') ||
      normalized.startsWith('./') ||
      normalized.startsWith('#'))
  ) {
    // Rejeita aspas ou quebras que possam escapar atributos
    if (/["'<>\x00-\x1f\x7f]/.test(normalized)) return '#';
    return normalized;
  }

  try {
    const parsed = new URL(normalized);
    if (parsed.protocol === 'https:' || parsed.protocol === 'http:') {
      return parsed.toString();
    }
  } catch {
    // fallback inválido
  }

  return '#';
}

/**
 * Converte ou valida estritamente URLs de vídeo incorporadas (YouTube / Vimeo).
 */
export function sanitizeEmbedUrl(rawUrl: string | null | undefined): string | null {
  if (!rawUrl || typeof rawUrl !== 'string') return null;
  const candidate = sanitizeSafeUrl(rawUrl, { allowRelative: false });
  if (candidate === '#') return null;

  try {
    const parsed = new URL(candidate);
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') return null;

    const host = parsed.hostname.toLowerCase();

    if (
      host === 'youtube.com' ||
      host === 'www.youtube.com' ||
      host === 'm.youtube.com' ||
      host === 'youtube-nocookie.com' ||
      host === 'www.youtube-nocookie.com'
    ) {
      if (parsed.pathname.startsWith('/embed/')) {
        const videoId = parsed.pathname.slice('/embed/'.length).split('/')[0];
        if (/^[a-zA-Z0-9_-]{6,32}$/.test(videoId)) {
          return `https://www.youtube.com/embed/${videoId}`;
        }
      }
      if (parsed.pathname === '/watch') {
        const v = parsed.searchParams.get('v') || '';
        if (/^[a-zA-Z0-9_-]{6,32}$/.test(v)) {
          return `https://www.youtube.com/embed/${v}`;
        }
      }
      if (parsed.pathname.startsWith('/shorts/')) {
        const videoId = parsed.pathname.slice('/shorts/'.length).split('/')[0];
        if (/^[a-zA-Z0-9_-]{6,32}$/.test(videoId)) {
          return `https://www.youtube.com/embed/${videoId}`;
        }
      }
      return null;
    }

    if (host === 'youtu.be') {
      const videoId = parsed.pathname.replace(/^\/+/, '').split('/')[0];
      if (/^[a-zA-Z0-9_-]{6,32}$/.test(videoId)) {
        return `https://www.youtube.com/embed/${videoId}`;
      }
      return null;
    }

    if (host === 'vimeo.com' || host === 'www.vimeo.com' || host === 'player.vimeo.com') {
      const parts = parsed.pathname.split('/').filter(Boolean);
      const idCandidate = host === 'player.vimeo.com' && parts[0] === 'video' ? parts[1] : parts[0];
      if (idCandidate && /^\d{4,16}$/.test(idCandidate)) {
        return `https://player.vimeo.com/video/${idCandidate}`;
      }
      return null;
    }
  } catch {
    return null;
  }

  return null;
}

/**
 * Sanitização rigorosa de HTML em profundidade (ponto fixo iterativo).
 * Neutraliza tags ativas (<script>, <style>, <svg>, <math>, <object>, <embed>,
 * <meta>, <base>, <form>), atributos srcdoc/on*, esquemas perigosos e iframes
 * fora da lista branca (YouTube/Vimeo HTTPS).
 */
export function sanitizeDangerousHtml(html: string | null | undefined): string {
  if (!html || typeof html !== 'string') return '';

  let clean = html.replace(/\x00/g, '').replace(/<!--[\s\S]*?(-->|$)/g, '');

  const dangerousPairTags =
    /<(script|style|svg|math|object|embed|applet|template|noscript|xmp|plaintext|title|textarea|form|select|button)\b[\s\S]*?(?:<\/\1\s*>|$)/gi;
  const dangerousSingleTags =
    /<\/?\s*(script|style|svg|math|object|embed|applet|template|meta|base|link|frame|frameset|form|input|button|textarea|select|xmp|plaintext|keygen|isindex)\b[^>]*>/gi;

  for (let pass = 0; pass < 8; pass++) {
    const before = clean;

    clean = clean
      .replace(dangerousPairTags, '')
      .replace(dangerousSingleTags, '');

    // Remove qualquer <iframe> contendo srcdoc antes da validação normalizada
    clean = clean.replace(/<iframe\b[^>]*\bsrcdoc\b[^>]*>[\s\S]*?(?:<\/iframe\s*>|$)/gi, '');

    // Normaliza <iframe> permitindo exclusivamente embeds YouTube/Vimeo válidos
    clean = clean.replace(/<iframe\b([^>]*)>(?:[\s\S]*?<\/iframe\s*>)?/gi, (_, attrs: string) => {
      if (/srcdoc\s*=/i.test(attrs)) return '';
      const srcMatch = attrs.match(/(?:^|[\s"'\/`])src\s*=\s*(?:"([^"]*)"|'([^']*)'|`([^`]*)`|([^\s"'=<>`]+))/i);
      const rawSrc = srcMatch ? (srcMatch[1] ?? srcMatch[2] ?? srcMatch[3] ?? srcMatch[4] ?? '') : '';
      const safeEmbed = sanitizeEmbedUrl(decodeHtmlEntities(rawSrc));
      if (!safeEmbed) return '';
      return `<iframe src="${escapeHtml(safeEmbed)}" title="Vídeo incorporado" sandbox="allow-scripts allow-same-origin allow-presentation" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy" class="w-full h-full"></iframe>`;
    });

    // Sanitiza atributos estritamente dentro de tags HTML reais (cobre delimitadores / e sem espaço pós-aspas)
    clean = clean.replace(/<([a-zA-Z][a-zA-Z0-9:-]*)\b([^>]*)>/g, (_, tagName: string, rawAttrs: string) => {
      let attrs = rawAttrs
        // Remove event handlers on* mesmo precedidos por / ou aspas sem espaço
        .replace(/(^|[\s\/"'`])on[a-z0-9_-]+\s*=\s*(?:"[^"]*"|'[^']*'|`[^`]*`|[^\s"'=<>`]+)/gi, '$1 ')
        // Remove atributos srcdoc, action, formaction remanescentes
        .replace(/(^|[\s\/"'`])(?:srcdoc|action|formaction)\s*=\s*(?:"[^"]*"|'[^']*'|`[^`]*`|[^\s"'=<>`]+)/gi, '$1 ')
        // Remove estilos com vetores CSS perigosos
        .replace(
          /(^|[\s\/"'`])style\s*=\s*(?:"([^"]*)"|'([^']*)'|`([^`]*)`|([^\s"'=<>`]+))/gi,
          (full, sep: string, d1, d2, d3, d4) => {
            const val = d1 ?? d2 ?? d3 ?? d4 ?? '';
            const decodedVal = decodeHtmlEntities(val).replace(/[\s\x00-\x1f]+/g, '').toLowerCase();
            if (
              decodedVal.includes('expression(') ||
              decodedVal.includes('javascript:') ||
              decodedVal.includes('vbscript:') ||
              decodedVal.includes('-moz-binding') ||
              decodedVal.includes('behavior:') ||
              decodedVal.includes('@import')
            ) {
              return `${sep} `;
            }
            return full;
          }
        )
        // Sanitiza URLs em atributos (href, src, xlink:href, poster, background)
        .replace(
          /(^|[\s\/"'`])(href|src|xlink:href|poster|background)\s*=\s*(?:"([^"]*)"|'([^']*)'|`([^`]*)`|([^\s"'=<>`]+))/gi,
          (_, sep: string, attrName: string, d1, d2, d3, d4) => {
            const lowerAttr = attrName.toLowerCase();
            const rawVal = d1 ?? d2 ?? d3 ?? d4 ?? '';
            const allowDataImage = lowerAttr === 'src' || lowerAttr === 'poster';
            const safeUrl = sanitizeSafeUrl(rawVal, {
              allowRelative: true,
              allowMailto: lowerAttr === 'href',
              allowDataImage,
            });
            const normalizedSep = sep === '/' ? ' ' : sep;
            if (safeUrl === '#') {
              return lowerAttr === 'href'
                ? `${normalizedSep}href="#blocked" rel="noopener noreferrer"`
                : `${normalizedSep}${lowerAttr}=""`;
            }
            return `${normalizedSep}${lowerAttr}="${escapeHtml(safeUrl)}"`;
          }
        );

      return `<${tagName}${attrs}>`;
    });

    if (clean === before) break;
  }

  return clean;
}

export function hashDigestHex(input: string): string {
  return crypto.createHash('sha256').update(input).digest('hex');
}
