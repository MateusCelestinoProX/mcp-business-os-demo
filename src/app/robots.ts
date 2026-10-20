import { MetadataRoute } from 'next';
import { SITE_URL } from '@/constants/seo';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/builder/',
          '/_next/',
          '/server-sitemap.xml',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: [
          '/',
          '/artigos/',
          '/shop/',
          '/biblioteca/',
          '/comunidade/',
          '/contato/',
          '/assets/',
          '/*.js$',
          '/*.css$',
        ],
        disallow: [
          '/admin/',
          '/api/',
          '/builder/',
        ],
      },
      {
        userAgent: 'Googlebot-Image',
        allow: ['/assets/', '/*.png$', '/*.jpg$', '/*.webp$', '/*.gif$'],
        disallow: ['/admin/'],
      },
      {
        // Garante visibilidade e citação no Google AI Overviews & Search Generative Experience
        userAgent: ['Google-Extended', 'GPTBot', 'PerplexityBot', 'ClaudeBot', 'Applebot-Extended'],
        allow: ['/', '/artigos/', '/shop/', '/biblioteca/'],
        disallow: ['/admin/', '/api/', '/builder/'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
