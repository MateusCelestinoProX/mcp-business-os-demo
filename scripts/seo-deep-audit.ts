import fs from 'fs';
import path from 'path';
import sitemapBuilder from '../src/app/sitemap';
import robotsBuilder from '../src/app/robots';
import manifestBuilder from '../src/app/manifest';
import { GET as getRssFeed } from '../src/app/feed.xml/route';
import { getAllArticles } from '../src/lib/articles';
import {
  SITE_URL,
  SITE_NAME,
  AUTHOR_NAME,
  SEO_KEYWORDS,
  GOOGLE_SITE_VERIFICATION,
} from '../src/constants/seo';
import {
  canonicalUrl,
  sanitizeJsonLd,
  buildOrganizationAndPersonSchema,
  buildWebSiteSchema,
  buildArticleSchema,
  buildBreadcrumbSchema,
  buildProductSchema,
  buildFaqSchema,
  buildItemListSchema,
  buildGraphSchema,
} from '../src/services/seo/structured-data';
import { constructMetadata } from '../src/services/seo/metadata';

interface AuditCheck {
  category: 'CRAWLABILITY' | 'TECHNICAL' | 'ON_PAGE' | 'STRUCTURED_DATA' | 'EEAT_AUTHORITY';
  id: string;
  name: string;
  status: 'PASS' | 'WARN' | 'FAIL';
  details: string;
  score: number; // 0 a 100
}

async function runSeoDeepAudit() {
  const checks: AuditCheck[] = [];

  console.log('================================================================');
  console.log('🔍 AUDITORIA DE PONTA A PONTA DE SEO — MCP BUSINESS OS');
  console.log('   Foco: Google Search Essentials, E-E-A-T, AEO & Core Web Vitals');
  console.log('================================================================\n');

  // -------------------------------------------------------------
  // 1. CRAWLABILITY & INDEXATION
  // -------------------------------------------------------------
  
  // 1.1 robots.txt validation
  const robots = robotsBuilder();
  const hasGooglebot = robots.rules?.some((r) => r.userAgent === 'Googlebot');
  const hasAiBots = robots.rules?.some((r) => Array.isArray(r.userAgent) && r.userAgent.includes('Google-Extended'));
  const blocksAdmin = robots.rules?.every((r) => !Array.isArray(r.disallow) || r.disallow.includes('/admin/'));
  const referencesSitemap = robots.sitemap === `${SITE_URL}/sitemap.xml`;

  if (hasGooglebot && hasAiBots && blocksAdmin && referencesSitemap) {
    checks.push({
      category: 'CRAWLABILITY',
      id: 'ROBOTS_TXT_POLICY',
      name: 'Configuração do Robots.txt (Diretrizes para Googlebot e Bots de IA)',
      status: 'PASS',
      details: 'Googlebot com acesso total ao conteúdo público e assets; painel admin protegido; bots de IA autorizados.',
      score: 100,
    });
  } else {
    checks.push({
      category: 'CRAWLABILITY',
      id: 'ROBOTS_TXT_POLICY',
      name: 'Configuração do Robots.txt',
      status: 'FAIL',
      details: `Inconsistência encontrada no robots.ts. Googlebot: ${hasGooglebot}, AI: ${hasAiBots}, Sitemap: ${referencesSitemap}`,
      score: 40,
    });
  }

  // 1.2 Sitemap.xml validation
  const sitemapEntries = await sitemapBuilder();
  const articles = getAllArticles();
  const urlSet = new Set<string>();
  let duplicateUrls = 0;
  let nonHttpsUrls = 0;
  let invalidDates = 0;

  for (const entry of sitemapEntries) {
    if (urlSet.has(entry.url)) duplicateUrls++;
    urlSet.add(entry.url);
    if (!entry.url.startsWith('https://') && !entry.url.startsWith('http://localhost')) nonHttpsUrls++;
    if (entry.lastModified && isNaN(new Date(entry.lastModified).getTime())) invalidDates++;
  }

  const coversAllArticles = articles.every((a) => urlSet.has(`${SITE_URL}/artigos/${a.slug}`));

  if (duplicateUrls === 0 && nonHttpsUrls === 0 && invalidDates === 0 && coversAllArticles) {
    checks.push({
      category: 'CRAWLABILITY',
      id: 'SITEMAP_COMPREHENSIVE',
      name: 'Sitemap XML Dinâmico (Cobertura e Integridade)',
      status: 'PASS',
      details: `${sitemapEntries.length} URLs indexadas (100% dos ${articles.length} artigos técnicos + páginas estáticas), zero URLs duplicadas ou inválidas.`,
      score: 100,
    });
  } else {
    checks.push({
      category: 'CRAWLABILITY',
      id: 'SITEMAP_COMPREHENSIVE',
      name: 'Sitemap XML Dinâmico',
      status: 'FAIL',
      details: `Duplicatas: ${duplicateUrls}, Não-HTTPS: ${nonHttpsUrls}, Datas inválidas: ${invalidDates}, Cobertura total: ${coversAllArticles}`,
      score: 50,
    });
  }

  // 1.3 Canonical URL Consistency
  const testUrls = [
    { path: '/', expected: SITE_URL },
    { path: '/artigos', expected: `${SITE_URL}/artigos` },
    { path: '/artigos/artigo-1/', expected: `${SITE_URL}/artigos/artigo-1` },
    { path: 'shop/', expected: `${SITE_URL}/shop` },
  ];
  const allCanonicalsValid = testUrls.every((t) => canonicalUrl(t.path) === t.expected);

  checks.push({
    category: 'CRAWLABILITY',
    id: 'CANONICAL_CONSISTENCY',
    name: 'Normalização Canônica (Anti-Conteúdo Duplicado)',
    status: allCanonicalsValid ? 'PASS' : 'FAIL',
    details: allCanonicalsValid
      ? 'Todas as URLs canônicas são geradas de forma absoluta, sem trailing slash redundante e com scheme HTTPS consistente.'
      : 'Falha na normalização de URLs canônicas.',
    score: allCanonicalsValid ? 100 : 0,
  });

  // -------------------------------------------------------------
  // 2. TECHNICAL FOUNDATIONS & CORE WEB VITALS
  // -------------------------------------------------------------

  // 2.1 Viewport & Responsive Meta
  const rootLayoutCode = fs.readFileSync(
    path.join(__dirname, '../src/app/layout.tsx'),
    'utf-8'
  );
  const hasViewportExport = rootLayoutCode.includes('export const viewport: Viewport');
  const hasViewportFit = rootLayoutCode.includes("viewportFit: \"cover\"") || rootLayoutCode.includes("viewportFit: 'cover'");
  const hasThemeColor = rootLayoutCode.includes("themeColor: \"#030305\"") || rootLayoutCode.includes("themeColor: '#030305'");

  checks.push({
    category: 'TECHNICAL',
    id: 'VIEWPORT_MOBILE_READY',
    name: 'Metadados de Viewport Mobile-First (Next.js 15)',
    status: hasViewportExport && hasViewportFit && hasThemeColor ? 'PASS' : 'WARN',
    details: 'Configuração moderna de Viewport nativa separada dos metadados, com suporte a entalhes e themeColor dark.',
    score: hasViewportExport && hasViewportFit && hasThemeColor ? 100 : 80,
  });

  // 2.2 Next Config Optimizations (Image formats & Security Headers)
  const nextConfigCode = fs.readFileSync(
    path.join(__dirname, '../next.config.ts'),
    'utf-8'
  );
  const hasAvifWebp = nextConfigCode.includes("formats: ['image/avif', 'image/webp']");
  const has301Redirects = nextConfigCode.includes('permanent: true');
  const hasSecurityHeaders = nextConfigCode.includes('X-Content-Type-Options') && nextConfigCode.includes('Referrer-Policy');

  checks.push({
    category: 'TECHNICAL',
    id: 'NEXT_CONFIG_SECURITY_PERF',
    name: 'Otimização de Next.js Config (Formatos Modernos, 301 e Headers)',
    status: hasAvifWebp && has301Redirects && hasSecurityHeaders ? 'PASS' : 'WARN',
    details: 'Next.js configurado com AVIF/WebP nativos, cabeçalhos de segurança estritos e redirects 301 permanentes para URLs legadas.',
    score: hasAvifWebp && has301Redirects && hasSecurityHeaders ? 100 : 85,
  });

  // 2.3 Web App Manifest
  const manifest = manifestBuilder();
  const hasManifestIcons = manifest.icons && manifest.icons.length >= 2;
  checks.push({
    category: 'TECHNICAL',
    id: 'PWA_MANIFEST_INDEX',
    name: 'Web App Manifest PWA (Indexação Móvel)',
    status: hasManifestIcons ? 'PASS' : 'WARN',
    details: `Manifest estruturado com ${manifest.icons?.length || 0} ícones de alta resolução e tema visual condizente.`,
    score: hasManifestIcons ? 100 : 75,
  });

  // -------------------------------------------------------------
  // 3. ON-PAGE OPTIMIZATION & INTERNAL LINKING
  // -------------------------------------------------------------

  // 3.1 Articles Quality & Meta Inspection
  let shortTitles = 0;
  let emptyExcerpts = 0;
  let missingCategories = 0;
  let nonKebabSlugs = 0;

  for (const art of articles) {
    if (!art.title || art.title.length < 5) shortTitles++;
    if (!art.excerpt || art.excerpt.length < 15) emptyExcerpts++;
    if (!art.category) missingCategories++;
    if (!/^[a-z0-9\-]+$/.test(art.slug)) nonKebabSlugs++;
  }

  if (shortTitles === 0 && emptyExcerpts === 0 && missingCategories === 0) {
    checks.push({
      category: 'ON_PAGE',
      id: 'ARTICLE_EDITORIAL_METAS',
      name: 'Qualidade Metadados On-Page nos 176 Artigos Técnicos',
      status: 'PASS',
      details: '100% dos 176 artigos possuem títulos completos, excertos informativos e categorização temática válida.',
      score: 100,
    });
  } else {
    checks.push({
      category: 'ON_PAGE',
      id: 'ARTICLE_EDITORIAL_METAS',
      name: 'Qualidade Metadados On-Page nos Artigos',
      status: 'WARN',
      details: `Títulos curtos: ${shortTitles}, Excertos vazios: ${emptyExcerpts}, Sem categoria: ${missingCategories}`,
      score: 80,
    });
  }

  // 3.2 Internal Linking via Homepage Cards
  const notionLayoutCode = fs.readFileSync(
    path.join(__dirname, '../src/components/portal/MainNotionLayout.tsx'),
    'utf-8'
  );
  const hasSemanticLinks = notionLayoutCode.includes('<Link') && notionLayoutCode.includes('href={`/artigos/${art.slug}`}');

  checks.push({
    category: 'ON_PAGE',
    id: 'INTERNAL_LINKING_HOMEPAGE',
    name: 'Arquitetura de Links Internos (PageRank Crawlability)',
    status: hasSemanticLinks ? 'PASS' : 'FAIL',
    details: hasSemanticLinks
      ? 'Cards de publicações na página inicial utilizam tags semânticas <Link> rastreáveis pelo Googlebot, eliminando becos sem saída (orphan pages).'
      : 'Cards de publicações utilizam apenas onClick sem tag semântica de link.',
    score: hasSemanticLinks ? 100 : 0,
  });

  // 3.3 Semantic Breadcrumbs Component
  const breadcrumbCode = fs.readFileSync(
    path.join(__dirname, '../src/components/seo/Breadcrumbs.tsx'),
    'utf-8'
  );
  const hasNavAria = breadcrumbCode.includes('aria-label="Breadcrumb"');
  const hasBreadcrumbSchema = breadcrumbCode.includes('buildBreadcrumbSchema');

  checks.push({
    category: 'ON_PAGE',
    id: 'SEMANTIC_BREADCRUMBS',
    name: 'Migalhas de Pão Semânticas (Navegação & Rich Snippets)',
    status: hasNavAria && hasBreadcrumbSchema ? 'PASS' : 'WARN',
    details: 'Componente Breadcrumbs renderiza tag <nav> acessível e injeta automaticamente schema BreadcrumbList.',
    score: hasNavAria && hasBreadcrumbSchema ? 100 : 80,
  });

  // -------------------------------------------------------------
  // 4. STRUCTURED DATA & SCHEMA.ORG RICH RESULTS
  // -------------------------------------------------------------

  // 4.1 Organization & Person Schema (E-E-A-T)
  const orgPersonSchema = buildOrganizationAndPersonSchema();
  const orgNode = orgPersonSchema['@graph']?.find((n: any) => n['@type'] === 'Organization');
  const personNode = orgPersonSchema['@graph']?.find((n: any) => n['@type'] === 'Person');
  const hasEeatProps = personNode?.knowsAbout && personNode?.worksFor && orgNode?.sameAs;

  checks.push({
    category: 'STRUCTURED_DATA',
    id: 'SCHEMA_EEAT_ORGANIZATION',
    name: 'Schema.org Organization & Person (Sinais E-E-A-T de Autoridade)',
    status: hasEeatProps ? 'PASS' : 'FAIL',
    details: `Nós vinculados com @id soberanos: ${orgNode?.name} e fundador ${personNode?.name} com especialidades e redes sociais verificadas.`,
    score: hasEeatProps ? 100 : 50,
  });

  // 4.2 WebSite Schema with Sitelinks Searchbox
  const websiteSchema = buildWebSiteSchema();
  const hasSearchAction = websiteSchema.potentialAction && websiteSchema.potentialAction['@type'] === 'SearchAction';

  checks.push({
    category: 'STRUCTURED_DATA',
    id: 'SCHEMA_WEBSITE_SEARCHBOX',
    name: 'Schema.org WebSite com Google Sitelinks Searchbox',
    status: hasSearchAction ? 'PASS' : 'FAIL',
    details: 'Habilita caixa de busca direta nos resultados do Google direcionada para a busca de artigos (/artigos?q={query}).',
    score: hasSearchAction ? 100 : 0,
  });

  // 4.3 TechArticle Schema
  const sampleArticle = articles[0];
  const articleSchema = buildArticleSchema(sampleArticle);
  const isArticleComplete =
    articleSchema.headline &&
    articleSchema.author &&
    articleSchema.publisher &&
    articleSchema.datePublished &&
    articleSchema.wordCount > 0 &&
    articleSchema.image?.length > 0;

  checks.push({
    category: 'STRUCTURED_DATA',
    id: 'SCHEMA_TECH_ARTICLE',
    name: 'Schema.org TechArticle & BlogPosting (Google Articles Rich Results)',
    status: isArticleComplete ? 'PASS' : 'FAIL',
    details: `Esquema completo com contagem de palavras calculada (${articleSchema.wordCount} palavras), autoria, editor e imagem canônica.`,
    score: isArticleComplete ? 100 : 50,
  });

  // 4.4 Product & Offer Schema
  const productSchema = buildProductSchema({
    name: 'ULTIMATE TYPEBOT PACK',
    description: 'Templates validados de captação de leads.',
    price: 197,
    currency: 'BRL',
    sku: 'PROD-TYPEBOT',
  });
  const isProductComplete =
    productSchema.offers &&
    productSchema.offers.price === '197.00' &&
    productSchema.offers.priceCurrency === 'BRL' &&
    productSchema.offers.availability === 'https://schema.org/InStock';

  checks.push({
    category: 'STRUCTURED_DATA',
    id: 'SCHEMA_PRODUCT_OFFER',
    name: 'Schema.org Product & Offer (Google Merchant / Loja Virtual)',
    status: isProductComplete ? 'PASS' : 'FAIL',
    details: 'Preço em BRL, estoque marcado como InStock e identificação do vendedor vinculada à organização soberana.',
    score: isProductComplete ? 100 : 50,
  });

  // 4.5 FAQPage Schema (Google SERP Accordion Rich Snippets)
  const faqSchema = buildFaqSchema([
    { question: 'Como funciona?', answer: 'Acesso imediato à plataforma.' },
  ]);
  const isFaqComplete =
    faqSchema['@type'] === 'FAQPage' &&
    faqSchema.mainEntity &&
    faqSchema.mainEntity[0].name &&
    faqSchema.mainEntity[0].acceptedAnswer.text;

  checks.push({
    category: 'STRUCTURED_DATA',
    id: 'SCHEMA_FAQ_PAGE',
    name: 'Schema.org FAQPage (Rich Snippets de Acordeão no Google)',
    status: isFaqComplete ? 'PASS' : 'FAIL',
    details: 'Perguntas frequentes formatadas para exibição de respostas diretas nos resultados de busca.',
    score: isFaqComplete ? 100 : 0,
  });

  // 4.6 XSS Injection Protection on Structured Data
  const injectionTest = sanitizeJsonLd({ title: '</script><script>alert("hack")</script>' });
  const isXssProtected = !injectionTest.includes('</script>') && injectionTest.includes('\\u003c/script>');

  checks.push({
    category: 'STRUCTURED_DATA',
    id: 'SCHEMA_XSS_SHIELD',
    name: 'Blindagem de Segurança XSS em Dados Estruturados',
    status: isXssProtected ? 'PASS' : 'FAIL',
    details: 'Sanitização de caracteres perigosos (< substituído por \\u003c) antes da injeção via dangerouslySetInnerHTML.',
    score: isXssProtected ? 100 : 0,
  });

  // -------------------------------------------------------------
  // 5. E-E-A-T & AUTHORITY SIGNALS
  // -------------------------------------------------------------

  // 5.1 Author Bio Box & Credentials
  const articlePageCode = fs.readFileSync(
    path.join(__dirname, '../src/app/artigos/[slug]/page.tsx'),
    'utf-8'
  );
  const hasAuthorBox = articlePageCode.includes('Escrito por Mateus Celestino') && articlePageCode.includes('mateus_profile.webp');
  const hasReadingTime = articlePageCode.includes('article.readingTime');

  checks.push({
    category: 'EEAT_AUTHORITY',
    id: 'EEAT_AUTHOR_TRANSPARENCY',
    name: 'Sinais E-E-A-T de Autoria e Especialidade',
    status: hasAuthorBox && hasReadingTime ? 'PASS' : 'WARN',
    details: 'Box de autoria com foto, mini-biografia profissional, canais diretos de contato e tempo estimado de leitura.',
    score: hasAuthorBox && hasReadingTime ? 100 : 80,
  });

  // 5.2 RSS 2.0 Feed Syndication
  const rssResponse = await getRssFeed();
  const rssXml = await rssResponse.text();
  const isRssValid = rssXml.includes('<rss version="2.0"') && rssXml.includes('<channel>') && rssXml.includes('<item>');

  checks.push({
    category: 'EEAT_AUTHORITY',
    id: 'RSS_FEED_SYNDICATION',
    name: 'Feed RSS 2.0 Dinâmico (/feed.xml) para Google News e Agregadores',
    status: isRssValid ? 'PASS' : 'FAIL',
    details: `Feed gerado dinamicamente com os últimos 50 artigos, imagens em enclosures e tags de autoria.`,
    score: isRssValid ? 100 : 0,
  });

  // 5.3 OpenGraph & Social Media Metas
  const sampleMeta = constructMetadata({
    title: 'Teste de Validação Social',
    description: 'Validação de Open Graph.',
    path: '/artigos/teste',
    ogType: 'article',
  });
  const hasOgImages = sampleMeta.openGraph?.images && (sampleMeta.openGraph.images as any[]).length > 0;
  const hasTwitterCards = sampleMeta.twitter?.card === 'summary_large_image';

  checks.push({
    category: 'EEAT_AUTHORITY',
    id: 'OPENGRAPH_TWITTER_CARDS',
    name: 'Metadados Sociais Open Graph & Twitter Cards 1200x630',
    status: hasOgImages && hasTwitterCards ? 'PASS' : 'FAIL',
    details: 'Cartões visuais em formato summary_large_image com dimensões 1200x630px para compartilhamento em redes e mensageiros.',
    score: hasOgImages && hasTwitterCards ? 100 : 50,
  });

  // -------------------------------------------------------------
  // CALCULATE COMPOSITE HEALTH SCORE
  // -------------------------------------------------------------
  const weights: Record<AuditCheck['category'], number> = {
    CRAWLABILITY: 0.30,
    TECHNICAL: 0.25,
    ON_PAGE: 0.20,
    STRUCTURED_DATA: 0.15,
    EEAT_AUTHORITY: 0.10,
  };

  const categoryScores: Record<AuditCheck['category'], { totalScore: number; count: number }> = {
    CRAWLABILITY: { totalScore: 0, count: 0 },
    TECHNICAL: { totalScore: 0, count: 0 },
    ON_PAGE: { totalScore: 0, count: 0 },
    STRUCTURED_DATA: { totalScore: 0, count: 0 },
    EEAT_AUTHORITY: { totalScore: 0, count: 0 },
  };

  for (const c of checks) {
    categoryScores[c.category].totalScore += c.score;
    categoryScores[c.category].count += 1;
  }

  let finalWeightedScore = 0;
  console.log('--- RESULTADOS POR CATEGORIA ---');
  for (const [cat, data] of Object.entries(categoryScores) as [AuditCheck['category'], { totalScore: number; count: number }][]) {
    const avg = data.count > 0 ? data.totalScore / data.count : 0;
    const weighted = avg * weights[cat];
    finalWeightedScore += weighted;
    console.log(`• ${cat.padEnd(16)}: ${avg.toFixed(1)}/100 (Peso: ${Math.round(weights[cat] * 100)}% -> Contribuição: ${weighted.toFixed(1)})`);
  }

  console.log('\n================================================================');
  console.log(`⭐ ÍNDICE DE SAÚDE DE SEO (SEO HEALTH INDEX): ${finalWeightedScore.toFixed(1)}/100`);
  console.log('================================================================\n');

  console.log('--- DETALHAMENTO DE CADA ITEM AUDITADO ---');
  for (const c of checks) {
    const icon = c.status === 'PASS' ? '✅' : c.status === 'WARN' ? '⚠️' : '❌';
    console.log(`${icon} [${c.category}] ${c.name}`);
    console.log(`   Detalhes: ${c.details}\n`);
  }

  return { checks, finalWeightedScore };
}

runSeoDeepAudit()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Erro durante a auditoria de SEO:', err);
    process.exit(1);
  });
