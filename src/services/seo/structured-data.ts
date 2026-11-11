import {
  SITE_URL,
  SITE_NAME,
  SITE_TAGLINE,
  SITE_DESCRIPTION,
  AUTHOR_NAME,
  AUTHOR_TITLE,
  AUTHOR_EMAIL,
  AUTHOR_PHONE,
  AUTHOR_GITHUB,
  AUTHOR_LINKEDIN,
  AUTHOR_INSTAGRAM,
  DEFAULT_OG_IMAGE,
  SITE_LANG,
} from '@/constants/seo';
import { BreadcrumbItem, FaqItem, BaseJsonLd } from '@/types/seo';
import { Article } from '@/lib/articles';

/**
 * Sanitiza o JSON-LD contra injeções XSS (substitui `<` por `\u003c`, `>` por `\u003e`, `&` por `\u0026`)
 */
export function sanitizeJsonLd(data: unknown): string {
  try {
    const json = typeof data === 'string' ? data : JSON.stringify(data);
    return json
      .replace(/</g, '\\u003c')
      .replace(/>/g, '\\u003e')
      .replace(/&/g, '\\u0026')
      .replace(/\u2028/g, '\\u2028')
      .replace(/\u2029/g, '\\u2029');
  } catch {
    return '{}';
  }
}

/**
 * Retorna uma URL canônica absoluta sem barra final
 */
export function canonicalUrl(path: string = ''): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  if (cleanPath === '/') return SITE_URL;
  return `${SITE_URL}${cleanPath.replace(/\/$/, '')}`;
}

/**
 * Constrói o schema unificado de Organização e Especialista (E-E-A-T)
 * Alimenta o Google Knowledge Graph com sinais de autoridade.
 */
export function buildOrganizationAndPersonSchema(): BaseJsonLd {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
        name: SITE_NAME,
        url: SITE_URL,
        logo: {
          '@type': 'ImageObject',
          '@id': `${SITE_URL}/#logo`,
          url: `${SITE_URL}/assets/site_icon.webp`,
          caption: SITE_NAME,
        },
        image: DEFAULT_OG_IMAGE,
        description: SITE_DESCRIPTION,
        email: AUTHOR_EMAIL,
        telephone: AUTHOR_PHONE,
        sameAs: [
          AUTHOR_LINKEDIN,
          AUTHOR_INSTAGRAM,
          AUTHOR_GITHUB,
        ],
        founder: {
          '@id': `${SITE_URL}/#founder`,
        },
      },
      {
        '@type': 'Person',
        '@id': `${SITE_URL}/#founder`,
        name: AUTHOR_NAME,
        jobTitle: AUTHOR_TITLE,
        url: SITE_URL,
        image: `${SITE_URL}/assets/mateus_avatar.webp`,
        description: `${AUTHOR_NAME} — ${AUTHOR_TITLE}`,
        email: AUTHOR_EMAIL,
        telephone: AUTHOR_PHONE,
        sameAs: [
          AUTHOR_LINKEDIN,
          AUTHOR_INSTAGRAM,
          AUTHOR_GITHUB,
        ],
        worksFor: {
          '@id': `${SITE_URL}/#organization`,
        },
        knowsAbout: [
          'Hiperautomação',
          'Inteligência Artificial',
          'n8n Workflows',
          'Typebot',
          'Mautic',
          'Next.js',
          'TypeScript',
          'Arquitetura de Software',
          'Marketing Open Source',
        ],
      },
    ],
  };
}

/**
 * Constrói o schema WebSite com Google Sitelinks Searchbox
 */
export function buildWebSiteSchema(): BaseJsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    publisher: {
      '@id': `${SITE_URL}/#organization`,
    },
    inLanguage: SITE_LANG,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/artigos?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

/**
 * Constrói o schema de Artigo Técnico / BlogPosting
 */
export function buildArticleSchema(article: Article): BaseJsonLd {
  const articleUrl = canonicalUrl(`/artigos/${article.slug}`);
  const coverUrl = article.coverImage?.startsWith('http')
    ? article.coverImage
    : `${SITE_URL}${article.coverImage?.startsWith('/') ? '' : '/'}${article.coverImage || 'assets/hero_cover.webp'}`;

  // Estimativa de contagem de palavras para o Google Bot
  const rawText = (article.contentHtml || '').replace(/<[^>]+>/g, ' ');
  const wordCount = rawText.split(/\s+/).filter(Boolean).length;

  return {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    '@id': `${articleUrl}/#article`,
    isPartOf: {
      '@id': `${SITE_URL}/#website`,
    },
    headline: article.title,
    description: article.excerpt,
    url: articleUrl,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': articleUrl,
    },
    image: [coverUrl],
    datePublished: article.createdAt,
    dateModified: article.createdAt,
    author: {
      '@id': `${SITE_URL}/#founder`,
    },
    publisher: {
      '@id': `${SITE_URL}/#organization`,
    },
    articleSection: article.category,
    inLanguage: SITE_LANG,
    wordCount: wordCount > 0 ? wordCount : 500,
    keywords: [
      article.category,
      'Mateus Celestino Pro X',
      'Artigo Técnico',
      'Automação',
      'IA',
    ],
  };
}

/**
 * Constrói o schema BreadcrumbList (migalhas de pão) para SERPs do Google
 */
export function buildBreadcrumbSchema(items: BreadcrumbItem[]): BaseJsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: canonicalUrl(item.url),
    })),
  };
}

/**
 * Constrói o schema de Produto / SoftwareApplication (Loja & Packs)
 */
export interface ProductSchemaInput {
  name: string;
  description: string;
  price?: number;
  currency?: string;
  image?: string;
  sku?: string;
  url?: string;
  category?: string;
}

export function buildProductSchema(product: ProductSchemaInput): BaseJsonLd {
  const prodUrl = canonicalUrl(product.url || '/shop');
  const imageUrl = product.image?.startsWith('http')
    ? product.image
    : `${SITE_URL}${product.image?.startsWith('/') ? '' : '/'}${product.image || 'assets/shop_banner.webp'}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${prodUrl}#product-${product.sku || 'general'}`,
    name: product.name,
    description: product.description,
    image: [imageUrl],
    sku: product.sku || 'MCP-PROD',
    category: product.category || 'Software & Automação',
    brand: {
      '@type': 'Brand',
      name: SITE_NAME,
    },
    offers: {
      '@type': 'Offer',
      price: product.price ? product.price.toFixed(2) : '0.00',
      priceCurrency: product.currency || 'BRL',
      availability: 'https://schema.org/InStock',
      url: prodUrl,
      seller: {
        '@id': `${SITE_URL}/#organization`,
      },
    },
  };
}

/**
 * Constrói o schema de Perguntas Frequentes (FAQPage) para acordeões no Google
 */
export function buildFaqSchema(faqs: FaqItem[]): BaseJsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/**
 * Constrói o schema ItemList para páginas de índice (Artigos, Catálogo)
 */
export function buildItemListSchema(items: { name: string; url: string; image?: string }[], listName: string): BaseJsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: listName,
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      url: canonicalUrl(item.url),
      ...(item.image ? { image: item.image } : {}),
    })),
  };
}

/**
 * Agrupa múltiplos schemas num único @graph
 */
export function buildGraphSchema(schemas: BaseJsonLd[]): BaseJsonLd {
  return {
    '@context': 'https://schema.org',
    '@graph': schemas.flatMap((s) => (s['@graph'] ? s['@graph'] : s)),
  };
}
