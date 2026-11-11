import rawArticles from '@/data/articles.json';
import { sanitizeDangerousHtml } from '@/lib/security/sanitize';

export interface Article {
  id: string;
  slug: string;
  title: string;
  category: string;
  createdAt: string;
  isFeatured: boolean;
  excerpt: string;
  readingTime: string;
  coverImage: string;
  contentHtml: string;
}

const articlesList: Article[] = (rawArticles as any[]).map((a) => ({
  ...a,
  readingTime: typeof a.readingTime === 'number' ? `${a.readingTime} min` : String(a.readingTime || '5 min'),
  contentHtml: a.contentHtml ? sanitizeDangerousHtml(a.contentHtml) : '',
}));

export function getAllArticles(): Article[] {
  return articlesList;
}

export function getArticleBySlug(slug: string): Article | undefined {
  const cleanSlug = slug.toLowerCase().trim();
  return articlesList.find(
    (a) =>
      a.slug.toLowerCase().trim() === cleanSlug ||
      a.id.toLowerCase().trim() === cleanSlug
  );
}

export function getFeaturedArticles(limit: number = 6): Article[] {
  const featured = articlesList.filter((a) => a.isFeatured);
  if (featured.length >= limit) {
    return featured.slice(0, limit);
  }
  return articlesList.slice(0, limit);
}

export function getArticlesByCategory(category: string): Article[] {
  if (!category || category === 'all' || category === 'TODOS') {
    return articlesList;
  }
  const target = category.toUpperCase().trim();
  return articlesList.filter((a) =>
    a.category.toUpperCase().includes(target)
  );
}

export function searchArticles(query: string, category?: string): Article[] {
  let list = articlesList;

  if (category && category !== 'all' && category !== 'TODOS') {
    const targetCat = category.toUpperCase().trim();
    list = list.filter((a) => a.category.toUpperCase().includes(targetCat));
  }

  if (!query || !query.trim()) {
    return list;
  }

  const q = query.toLowerCase().trim();
  return list.filter(
    (a) =>
      a.title.toLowerCase().includes(q) ||
      a.excerpt.toLowerCase().includes(q) ||
      a.category.toLowerCase().includes(q)
  );
}

export function getCategoriesWithCounts() {
  const counts: Record<string, number> = {
    TODOS: articlesList.length,
    'INTELIGÊNCIA ARTIFICIAL': 0,
    FERRAMENTAS: 0,
    BUSINESS: 0,
    LINUX: 0,
  };

  articlesList.forEach((a) => {
    const cat = a.category.toUpperCase();
    if (cat.includes('INTELIGÊNCIA ARTIFICIAL') || cat.includes('IA')) {
      counts['INTELIGÊNCIA ARTIFICIAL']++;
    }
    if (cat.includes('FERRAMENTAS')) {
      counts['FERRAMENTAS']++;
    }
    if (cat.includes('BUSINESS')) {
      counts['BUSINESS']++;
    }
    if (cat.includes('LINUX')) {
      counts['LINUX']++;
    }
  });

  return [
    { name: 'TODOS', slug: 'all', count: counts.TODOS },
    { name: 'INTELIGÊNCIA ARTIFICIAL', slug: 'ia', count: counts['INTELIGÊNCIA ARTIFICIAL'] },
    { name: 'FERRAMENTAS', slug: 'ferramentas', count: counts['FERRAMENTAS'] },
    { name: 'BUSINESS', slug: 'business', count: counts['BUSINESS'] },
    { name: 'LINUX', slug: 'linux', count: counts['LINUX'] },
  ];
}
