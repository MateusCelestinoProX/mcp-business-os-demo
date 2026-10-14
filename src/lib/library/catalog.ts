import fs from 'node:fs';
import path from 'node:path';

// Carregamento universal e resiliente do catálogo de 406 recursos
let rawCatalog: any[] = [];
try {
  const jsonPath = path.resolve(process.cwd(), 'src/data/library_catalog_index.json');
  if (fs.existsSync(jsonPath)) {
    rawCatalog = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
  } else {
    const fallback = path.resolve(process.cwd(), 'public/biblioteca/library_catalog_index.json');
    rawCatalog = JSON.parse(fs.readFileSync(fallback, 'utf-8'));
  }
} catch (err) {
  console.error('Falha ao carregar catálogo JSON:', err);
}

export type QuickCategory =
  | 'Todos'
  | 'Prompts'
  | 'Ferramentas'
  | 'Blueprints'
  | 'APKs'
  | 'Materiais'
  | 'Documentação';

export interface LibraryResource {
  id: string;
  slug: string;
  title: string;
  description: string;
  file: string;
  rel_path: string;
  category: string;
  category_group: string;
  quick_categories: QuickCategory[];
  ext: string;
  size: number;
  size_formatted: string;
  pages: number | null;
  text_preview: string;
  tags: string[];
  download_count: number;
  created_at: string;
}

// In-memory telemetry counter for downloads
const downloadCounters: Record<string, number> = {};

export function classifyQuickCategories(item: {
  file?: string;
  ext?: string;
  category?: string;
  category_group?: string;
  rel_path?: string;
  text_preview?: string;
}): QuickCategory[] {
  const ext = (item.ext || '').toLowerCase();
  const file = (item.file || '').toLowerCase();
  const cat = (item.category || '').toLowerCase();
  const path = (item.rel_path || '').toLowerCase();
  const preview = (item.text_preview || '').toLowerCase();

  const categories: QuickCategory[] = [];

  // APKs
  if (ext === '.apk' || file.includes('apk') || cat.includes('apk') || path.includes('android')) {
    categories.push('APKs');
  }

  // Prompts
  if (
    cat.includes('prompt') ||
    file.includes('prompt') ||
    path.includes('prompt') ||
    preview.includes('prompt') ||
    ext === '.txt'
  ) {
    categories.push('Prompts');
  }

  // Blueprints
  if (
    file.includes('blueprint') ||
    file.includes('protocol') ||
    cat.includes('skeleton') ||
    cat.includes('veo') ||
    cat.includes('banana') ||
    cat.includes('comfyui') ||
    cat.includes('dark machine')
  ) {
    categories.push('Blueprints');
  }

  // Ferramentas
  if (
    ext === '.py' ||
    ext === '.js' ||
    ext === '.json' ||
    ext === '.html' ||
    cat.includes('n8n') ||
    cat.includes('agente') ||
    cat.includes('vibe coding') ||
    cat.includes('mikoai/09-monetization') ||
    file.includes('app') ||
    file.includes('mcp')
  ) {
    categories.push('Ferramentas');
  }

  // Materiais
  if (
    cat.includes('creative studio') ||
    cat.includes('materials') ||
    cat.includes('animation') ||
    ext === '.png' ||
    cat.includes('image references') ||
    cat.includes('influencer') ||
    cat.includes('sex scalating')
  ) {
    categories.push('Materiais');
  }

  // Documentação
  if (
    ext === '.md' ||
    ext === '.docx' ||
    ext === '.pdf' ||
    file.includes('doc') ||
    cat.includes('doc') ||
    file.includes('readme') ||
    file.includes('manual') ||
    cat.includes('central de inteligência')
  ) {
    categories.push('Documentação');
  }

  if (categories.length === 0) {
    categories.push('Documentação');
  }

  return categories;
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

function cleanTitle(filename: string): string {
  const withoutExt = filename.replace(/\.[^/.]+$/, '');
  return withoutExt
    .replace(/^(\d+[-_])+/g, '')
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

// Build normalized catalog once
const catalogList: LibraryResource[] = (rawCatalog as any[]).map((item, index) => {
  const id = item.id ? String(item.id) : String(index + 1);
  const file = item.file || 'resource';
  const slug = item.slug || `${id}-${file.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}`;
  const title = item.title || cleanTitle(file);
  const size = Number(item.size) || 0;
  const ext = item.ext || (file.includes('.') ? `.${file.split('.').pop()}` : '');
  const quick_categories = classifyQuickCategories(item);

  let desc = item.description || '';
  if (!desc && item.text_preview) {
    const cleanPreview = item.text_preview.replace(/^#+\s+/gm, '').replace(/\n+/g, ' ').trim();
    desc = cleanPreview.slice(0, 160) + (cleanPreview.length > 160 ? '...' : '');
  }
  if (!desc) {
    desc = `Ativo técnico oficial ${title} (${ext}) pertencente ao cofre intelectual da Free Library.`;
  }

  return {
    id,
    slug,
    title,
    description: desc,
    file,
    rel_path: item.rel_path || file,
    category: item.category || 'root',
    category_group: item.category_group || 'Geral / Core',
    quick_categories,
    ext,
    size,
    size_formatted: item.size_formatted || formatBytes(size),
    pages: item.pages ?? null,
    text_preview: item.text_preview || '',
    tags: Array.isArray(item.tags) ? item.tags : [ext.replace('.', '')],
    download_count: downloadCounters[id] || 0,
    created_at: item.created_at || '2026-10-14T00:00:00.000Z',
  };
});

export function getAllResources(): LibraryResource[] {
  return catalogList.map((item) => ({
    ...item,
    download_count: downloadCounters[item.id] || 0,
  }));
}

export function getResourceById(idOrSlug: string): LibraryResource | undefined {
  const needle = decodeURIComponent(idOrSlug).toLowerCase().trim();
  const found = catalogList.find(
    (item) =>
      item.id.toLowerCase() === needle ||
      item.slug.toLowerCase() === needle ||
      item.file.toLowerCase() === needle
  );
  if (found) {
    return {
      ...found,
      download_count: downloadCounters[found.id] || 0,
    };
  }
  return undefined;
}

export function searchAndFilterResources({
  query = '',
  category = 'Todos',
  page = 1,
  limit = 12,
}: {
  query?: string;
  category?: string;
  page?: number;
  limit?: number;
}): {
  items: LibraryResource[];
  total: number;
  page: number;
  totalPages: number;
  limit: number;
  categoriesCount: Record<QuickCategory, number>;
} {
  const all = getAllResources();
  const q = query.toLowerCase().trim();
  const cat = category.trim();

  // Calculate counts for all categories
  const categoriesCount: Record<QuickCategory, number> = {
    Todos: all.length,
    Prompts: 0,
    Ferramentas: 0,
    Blueprints: 0,
    APKs: 0,
    Materiais: 0,
    Documentação: 0,
  };

  all.forEach((item) => {
    item.quick_categories.forEach((qc) => {
      if (categoriesCount[qc] !== undefined) {
        categoriesCount[qc]++;
      }
    });
  });

  // Filter by category
  let filtered = all;
  if (cat && cat !== 'Todos' && cat !== 'all' && cat !== 'TODOS') {
    filtered = filtered.filter((item) => {
      // Check quick categories
      if (item.quick_categories.some((qc) => qc.toLowerCase() === cat.toLowerCase())) {
        return true;
      }
      // Check category group or raw category
      if (
        item.category.toLowerCase().includes(cat.toLowerCase()) ||
        item.category_group.toLowerCase().includes(cat.toLowerCase())
      ) {
        return true;
      }
      return false;
    });
  }

  // Filter & score by query
  if (q) {
    const scored = filtered
      .map((item) => {
        let score = 0;
        const titleLower = item.title.toLowerCase();
        const fileLower = item.file.toLowerCase();
        const catLower = item.category.toLowerCase();
        const catGroupLower = item.category_group.toLowerCase();
        const previewLower = item.text_preview.toLowerCase();
        const descLower = item.description.toLowerCase();

        if (titleLower.includes(q) || fileLower.includes(q)) score += 15;
        if (catLower.includes(q) || catGroupLower.includes(q)) score += 8;
        if (previewLower.includes(q) || descLower.includes(q)) score += 4;

        for (const word of q.split(/\s+/)) {
          if (word.length >= 2) {
            if (titleLower.includes(word)) score += 5;
            if (fileLower.includes(word)) score += 3;
            if (previewLower.includes(word)) score += 2;
          }
        }

        return { item, score };
      })
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((entry) => entry.item);

    filtered = scored;
  }

  const total = filtered.length;
  const safeLimit = Math.max(1, Math.min(100, limit));
  const totalPages = Math.max(1, Math.ceil(total / safeLimit));
  const safePage = Math.max(1, Math.min(totalPages, page));

  const start = (safePage - 1) * safeLimit;
  const paginated = filtered.slice(start, start + safeLimit);

  return {
    items: paginated,
    total,
    page: safePage,
    totalPages,
    limit: safeLimit,
    categoriesCount,
  };
}

export function recordDownload(id: string): { newCount: number; item?: LibraryResource } {
  const item = getResourceById(id);
  if (!item) {
    return { newCount: 0 };
  }
  const current = downloadCounters[item.id] || 0;
  const newCount = current + 1;
  downloadCounters[item.id] = newCount;
  return { newCount, item: { ...item, download_count: newCount } };
}
