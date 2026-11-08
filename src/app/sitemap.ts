import { MetadataRoute } from 'next';
import { SITE_URL } from '@/constants/seo';
import { getAllArticles } from '@/lib/articles';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // Páginas institucionais e pilares centrais da plataforma
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
      images: [`${SITE_URL}/assets/hero_cover.webp`],
    },
    {
      url: `${SITE_URL}/artigos`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/shop`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
      images: [`${SITE_URL}/assets/shop_banner.webp`],
    },
    {
      url: `${SITE_URL}/biblioteca`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/comunidade`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/contato`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/showcase`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/stack-squad`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/privacidade`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/termos`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  // Todos os 170+ artigos técnicos do acervo editorial
  const articles = getAllArticles();
  const articleRoutes: MetadataRoute.Sitemap = articles.map((article) => {
    let articleDate = now;
    if (article.createdAt) {
      const parsed = new Date(article.createdAt);
      if (!isNaN(parsed.getTime())) {
        articleDate = parsed;
      }
    }

    const coverUrl = article.coverImage?.startsWith('http')
      ? article.coverImage
      : `${SITE_URL}${article.coverImage?.startsWith('/') ? '' : '/'}${article.coverImage || 'assets/hero_cover.webp'}`;

    return {
      url: `${SITE_URL}/artigos/${article.slug}`,
      lastModified: articleDate,
      changeFrequency: 'monthly',
      priority: article.isFeatured ? 0.85 : 0.75,
      images: [coverUrl],
    };
  });

  return [...staticRoutes, ...articleRoutes];
}
