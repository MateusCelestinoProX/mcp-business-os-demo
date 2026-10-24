import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
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
import sitemap from '../src/app/sitemap';
import robots from '../src/app/robots';
import manifest from '../src/app/manifest';
import { GET as getRssFeed } from '../src/app/feed.xml/route';
import { getAllArticles } from '../src/lib/articles';

describe('🏛️ Suíte de Testes da Arquitetura de SEO Soberana (Google Focus)', () => {
  test('1. Constantes de SEO e Identidade Digital devem estar íntegras', () => {
    assert.ok(SITE_URL.startsWith('http'), 'SITE_URL deve ser uma URL absoluta válida');
    assert.strictEqual(SITE_URL.endsWith('/'), false, 'SITE_URL não deve possuir barra no final');
    assert.ok(SITE_NAME.includes('Mateus Celestino'), 'SITE_NAME deve refletir o nome oficial');
    assert.ok(AUTHOR_NAME.includes('Mateus Celestino'), 'AUTHOR_NAME deve refletir o autor');
    assert.ok(Array.isArray(SEO_KEYWORDS) && SEO_KEYWORDS.length > 5, 'SEO_KEYWORDS deve conter lista de palavras-chave');
    assert.ok(GOOGLE_SITE_VERIFICATION.length > 5, 'GOOGLE_SITE_VERIFICATION deve estar configurado');
  });

  test('2. canonicalUrl deve normalizar caminhos para URLs absolutas canônicas', () => {
    assert.strictEqual(canonicalUrl(''), SITE_URL);
    assert.strictEqual(canonicalUrl('/'), SITE_URL);
    assert.strictEqual(canonicalUrl('/artigos'), `${SITE_URL}/artigos`);
    assert.strictEqual(canonicalUrl('artigos/'), `${SITE_URL}/artigos`);
    assert.strictEqual(canonicalUrl('/shop/produto-1/'), `${SITE_URL}/shop/produto-1`);
  });

  test('3. sanitizeJsonLd deve neutralizar tags HTML para prevenir vulnerabilidades XSS', () => {
    const dangerousInput = { title: '</script><script>alert("hack")</script>' };
    const sanitized = sanitizeJsonLd(dangerousInput);
    assert.strictEqual(sanitized.includes('</script>'), false, 'Não deve conter tags de fechamento de script raw');
    assert.ok(sanitized.includes('\\u003c/script>'), 'Deve substituir < por \\u003c');
  });

  test('4. Schema Organization & Person deve possuir identificadores unificados e autoridade E-E-A-T', () => {
    const schema = buildOrganizationAndPersonSchema();
    assert.strictEqual(schema['@context'], 'https://schema.org');
    assert.ok(Array.isArray(schema['@graph']));
    
    const org = schema['@graph'].find((item: any) => item['@type'] === 'Organization');
    const person = schema['@graph'].find((item: any) => item['@type'] === 'Person');

    assert.ok(org, 'Deve conter nó Organization');
    assert.ok(person, 'Deve conter nó Person');
    assert.strictEqual(org['@id'], `${SITE_URL}/#organization`);
    assert.strictEqual(person['@id'], `${SITE_URL}/#founder`);
    assert.ok(Array.isArray(person.knowsAbout) && person.knowsAbout.length > 0);
  });

  test('5. Schema WebSite deve implementar Sitelinks Searchbox para o Google', () => {
    const website = buildWebSiteSchema();
    assert.strictEqual(website['@type'], 'WebSite');
    assert.ok(website.potentialAction, 'Deve conter potentialAction para Searchbox');
    assert.strictEqual(website.potentialAction['@type'], 'SearchAction');
    assert.ok(
      website.potentialAction.target.urlTemplate.includes('/artigos?q={search_term_string}'),
      'Deve apontar para a busca de artigos'
    );
  });

  test('6. Schema Article / TechArticle deve estruturar artigos técnicos com precisão', () => {
    const dummyArticle = {
      id: 'art-1',
      slug: 'guia-n8n-ia',
      title: 'Como Criar Agentes no n8n',
      category: 'INTELIGÊNCIA ARTIFICIAL',
      createdAt: '2026-05-10',
      isFeatured: true,
      excerpt: 'Tutorial completo de n8n e IA.',
      readingTime: '7 min',
      coverImage: '/assets/n8n_guide.webp',
      contentHtml: '<p>Este é o conteúdo do artigo com mais de cem palavras para validação do crawler do Google.</p>',
    };

    const articleSchema = buildArticleSchema(dummyArticle);
    assert.strictEqual(articleSchema['@type'], 'TechArticle');
    assert.strictEqual(articleSchema.headline, dummyArticle.title);
    assert.strictEqual(articleSchema.url, `${SITE_URL}/artigos/guia-n8n-ia`);
    assert.ok(articleSchema.wordCount > 0, 'wordCount deve ser calculado');
    assert.strictEqual(articleSchema.inLanguage, 'pt-BR');
    assert.strictEqual(articleSchema.author['@id'], `${SITE_URL}/#founder`);
  });

  test('7. Schema Breadcrumbs, Products e FAQPage devem respeitar diretrizes de Rich Results', () => {
    // Breadcrumbs
    const breadcrumbs = buildBreadcrumbSchema([
      { name: 'Artigos', url: '/artigos' },
      { name: 'Guia IA', url: '/artigos/guia-ia' },
    ]);
    assert.strictEqual(breadcrumbs['@type'], 'BreadcrumbList');
    assert.strictEqual(breadcrumbs.itemListElement.length, 2);
    assert.strictEqual(breadcrumbs.itemListElement[0].position, 1);
    assert.strictEqual(breadcrumbs.itemListElement[1].position, 2);

    // Product
    const product = buildProductSchema({
      name: 'Pack Typebot Master',
      description: 'Templates prontos de alta conversão.',
      price: 197,
      currency: 'BRL',
      sku: 'TYPEBOT-01',
    });
    assert.strictEqual(product['@type'], 'Product');
    assert.strictEqual(product.offers['@type'], 'Offer');
    assert.strictEqual(product.offers.price, '197.00');
    assert.strictEqual(product.offers.priceCurrency, 'BRL');

    // FAQ
    const faq = buildFaqSchema([
      { question: 'Como acessar?', answer: 'Direto pelo painel web.' },
    ]);
    assert.strictEqual(faq['@type'], 'FAQPage');
    assert.strictEqual(faq.mainEntity[0].name, 'Como acessar?');
    assert.strictEqual(faq.mainEntity[0].acceptedAnswer.text, 'Direto pelo painel web.');
  });

  test('8. constructMetadata deve produzir objeto Next.js 15 completo com canonical e Googlebot', () => {
    const meta = constructMetadata({
      title: 'Página de Teste',
      description: 'Descrição de teste para SEO.',
      path: '/teste-seo',
      keywords: ['Teste', 'SEO'],
    });

    assert.ok(meta.title, 'Título deve existir');
    assert.strictEqual(meta.description, 'Descrição de teste para SEO.');
    assert.ok(meta.alternates?.canonical === `${SITE_URL}/teste-seo`);
    assert.strictEqual((meta.robots as any)?.googleBot?.index, true);
    assert.strictEqual((meta.robots as any)?.googleBot?.['max-image-preview'], 'large');
    assert.strictEqual((meta.openGraph as any)?.type, 'website');
    assert.strictEqual((meta.twitter as any)?.card, 'summary_large_image');
  });

  test('9. Sitemap dinâmico deve indexar rotas estáticas e todos os 176 artigos', async () => {
    const sitemapData = await sitemap();
    assert.ok(Array.isArray(sitemapData), 'Sitemap deve retornar um array de URLs');

    // Verifica páginas estáticas
    const homeEntry = sitemapData.find((item) => item.url === SITE_URL);
    const artigosEntry = sitemapData.find((item) => item.url === `${SITE_URL}/artigos`);
    const shopEntry = sitemapData.find((item) => item.url === `${SITE_URL}/shop`);
    const bibliotecaEntry = sitemapData.find((item) => item.url === `${SITE_URL}/biblioteca`);

    assert.ok(homeEntry, 'Home deve estar no sitemap');
    assert.strictEqual(homeEntry.priority, 1.0);
    assert.ok(artigosEntry, '/artigos deve estar no sitemap');
    assert.ok(shopEntry, '/shop deve estar no sitemap');
    assert.ok(bibliotecaEntry, '/biblioteca deve estar no sitemap');

    // Verifica que artigos dinâmicos foram indexados
    const articles = getAllArticles();
    assert.ok(articles.length >= 170, 'Devem existir mais de 170 artigos catalogados');
    
    // O total no sitemap deve conter pelo menos staticRoutes + total de artigos
    assert.ok(
      sitemapData.length >= articles.length + 8,
      `Sitemap deve conter pelo menos ${articles.length + 8} entradas, obteve ${sitemapData.length}`
    );
  });

  test('10. Robots.ts deve definir políticas para Googlebot, agentes e bots de IA', () => {
    const robotsConfig = robots();
    assert.ok(Array.isArray(robotsConfig.rules));
    assert.strictEqual(robotsConfig.sitemap, `${SITE_URL}/sitemap.xml`);
    assert.strictEqual(robotsConfig.host, SITE_URL);

    const googleRule = robotsConfig.rules.find((r) => r.userAgent === 'Googlebot');
    assert.ok(googleRule, 'Deve existir regra dedicada para o Googlebot');
    assert.ok(Array.isArray(googleRule.disallow) && googleRule.disallow.includes('/admin/'));
  });

  test('11. Manifest PWA deve retornar metadados móveis para motores de busca', () => {
    const manifestData = manifest();
    assert.strictEqual(manifestData.name, SITE_NAME);
    assert.strictEqual(manifestData.start_url, '/');
    assert.ok(manifestData.icons && manifestData.icons.length > 0);
  });

  test('12. Rota de Feed RSS (/feed.xml) deve produzir XML 2.0 válido', async () => {
    const response = await getRssFeed();
    assert.strictEqual(response.status, 200);
    assert.ok(response.headers.get('Content-Type')?.includes('application/xml'));

    const xmlText = await response.text();
    assert.ok(xmlText.includes('<?xml version="1.0" encoding="UTF-8"?>'));
    assert.ok(xmlText.includes('<rss version="2.0"'));
    assert.ok(xmlText.includes(`<title>${SITE_NAME}</title>`));
    assert.ok(xmlText.includes('<item>'));
    assert.ok(xmlText.includes('<guid isPermaLink="true">'));
  });

  test('13. Verificação do Google Search Console deve estar ativa no metadata', () => {
    const meta = constructMetadata();
    assert.ok(meta.verification?.google, 'Deve conter token de verificação do Google Search Console');
    assert.strictEqual(meta.verification?.google, GOOGLE_SITE_VERIFICATION);
  });
});
