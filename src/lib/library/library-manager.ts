import fs from 'node:fs';
import path from 'node:path';

export interface LibraryCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  badge: string;
  gradient?: string;
  itemCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface LibraryItem {
  id: string;
  slug: string;
  title: string;
  description: string;
  file: string;
  rel_path: string;
  url?: string;
  category: string;
  category_group: string;
  ext: string;
  type: 'image' | 'video' | 'pdf' | 'md' | 'txt' | 'archive' | 'apk' | 'audio' | 'code' | 'other';
  size: number;
  size_formatted: string;
  source: 'mac' | 'cloud' | 'core';
  tags: string[];
  text_preview?: string;
  download_count: number;
  created_at: string;
  file_id?: string;
  thumbnail_url?: string;
}

const LIBRARIES_PATH = path.resolve(process.cwd(), 'src/data/libraries.json');
const CATALOG_PATH = path.resolve(process.cwd(), 'src/data/library_catalog_index.json');
const PUBLIC_CATALOG_PATH = path.resolve(process.cwd(), 'public/biblioteca/library_catalog_index.json');
const UPLOADS_DIR = path.resolve(process.cwd(), 'public/uploads/library');
const BIBLIOTECA_DIR = path.resolve(process.cwd(), 'public/biblioteca');
const SOURCE_FALLBACK_DIR = '/Users/mcp/.gemini/antigravity/scratch/s-a-a-s-full-hidden-library';

// Categorias padrão inteligentes derivadas do acervo de 406 itens
export const DEFAULT_LIBRARIES: LibraryCategory[] = [
  {
    id: 'geral-core',
    name: 'Geral / Core',
    slug: 'geral-core',
    description: 'Ativos centrais, documentações de arquitetura, guias mestre e arquivos essenciais da plataforma.',
    icon: '🏛️',
    badge: 'CORE OFICIAL',
    gradient: 'from-blue-600/30 via-indigo-600/20 to-transparent',
    createdAt: '2026-10-14T00:00:00.000Z',
    updatedAt: '2026-10-16T15:00:00.000Z',
  },
  {
    id: 'nova-era-da-ia',
    name: 'Nova Era da IA',
    slug: 'nova-era-da-ia',
    description: 'Modelos, protocolos de inteligência, automações sistêmicas e ecossistema executivo ΝΞΙΔ™.',
    icon: '⚡',
    badge: 'ΝΞΙΔ PRO',
    gradient: 'from-purple-600/30 via-violet-600/20 to-transparent',
    createdAt: '2026-10-14T00:00:00.000Z',
    updatedAt: '2026-10-16T15:00:00.000Z',
  },
  {
    id: 'the-skeleton-method',
    name: 'The Skeleton Method',
    slug: 'the-skeleton-method',
    description: 'Frameworks estruturais, metodologias de esqueleto para sistemas autônomos e arquiteturas robustas.',
    icon: '💀',
    badge: 'BLUEPRINT ELITE',
    gradient: 'from-amber-600/30 via-yellow-600/20 to-transparent',
    createdAt: '2026-10-14T00:00:00.000Z',
    updatedAt: '2026-10-16T15:00:00.000Z',
  },
  {
    id: 'prompts',
    name: 'Prompts',
    slug: 'prompts',
    description: 'Acervo massivo de prompts supremos, meta-prompts para agentes, raciocínio e síntese de código.',
    icon: '🔮',
    badge: 'ACERVO SUPREMO',
    gradient: 'from-pink-600/30 via-rose-600/20 to-transparent',
    createdAt: '2026-10-14T00:00:00.000Z',
    updatedAt: '2026-10-16T15:00:00.000Z',
  },
  {
    id: 'miko-ai',
    name: 'Miko AI',
    slug: 'miko-ai',
    description: 'Workflows completos de monetização, automações n8n avançadas e ecossistema de bots Miko.',
    icon: '🦊',
    badge: 'AUTOMATION VIP',
    gradient: 'from-emerald-600/30 via-teal-600/20 to-transparent',
    createdAt: '2026-10-14T00:00:00.000Z',
    updatedAt: '2026-10-16T15:00:00.000Z',
  },
  {
    id: 'ai-animation',
    name: 'AI Animation',
    slug: 'ai-animation',
    description: 'Pipelines de renderização de vídeo sintético, animações neurais, ComfyUI e assets cinematográficos.',
    icon: '🎬',
    badge: 'STUDIO 4K',
    gradient: 'from-cyan-600/30 via-blue-600/20 to-transparent',
    createdAt: '2026-10-14T00:00:00.000Z',
    updatedAt: '2026-10-16T15:00:00.000Z',
  },
  {
    id: 'creative-studio',
    name: 'Creative Studio',
    slug: 'creative-studio',
    description: 'Materiais de estúdio criativo, referências visuais de altíssima definição, shaders e composições.',
    icon: '🎨',
    badge: 'VISUAL ASSETS',
    gradient: 'from-orange-600/30 via-red-600/20 to-transparent',
    createdAt: '2026-10-14T00:00:00.000Z',
    updatedAt: '2026-10-16T15:00:00.000Z',
  },
  {
    id: 'historika-ai',
    name: 'Historika AI',
    slug: 'historika-ai',
    description: 'Narrativas imersivas, roteirização com modelos generativos e inteligência histórica de vanguarda.',
    icon: '📜',
    badge: 'LORE ENGINE',
    gradient: 'from-indigo-600/30 via-purple-600/20 to-transparent',
    createdAt: '2026-10-14T00:00:00.000Z',
    updatedAt: '2026-10-16T15:00:00.000Z',
  },
  {
    id: 'nano-banana',
    name: 'Nano Banana',
    slug: 'nano-banana',
    description: 'Produtos digitais, empacotamento para Gumroad, estratégias de tráfego e esteiras de conversão.',
    icon: '🍌',
    badge: 'PRODUCT STACK',
    gradient: 'from-yellow-600/30 via-amber-600/20 to-transparent',
    createdAt: '2026-10-14T00:00:00.000Z',
    updatedAt: '2026-10-16T15:00:00.000Z',
  },
  {
    id: 'sex-scalating',
    name: 'Sex Scalating',
    slug: 'sex-scalating',
    description: 'Estratégias de escalada de conteúdo, copy persuasivo e psicologia de alta atração de audiência.',
    icon: '🔥',
    badge: 'HIGH CONVERSION',
    gradient: 'from-red-600/30 via-rose-600/20 to-transparent',
    createdAt: '2026-10-14T00:00:00.000Z',
    updatedAt: '2026-10-16T15:00:00.000Z',
  },
  {
    id: 'security-sentinel',
    name: 'Security & Sentinel',
    slug: 'security-sentinel',
    description: 'Auditorias de segurança, defesas de infraestrutura, APKs verificados e blindagem de dados.',
    icon: '🛡️',
    badge: 'SENTINEL DEFENSE',
    gradient: 'from-emerald-600/30 via-slate-600/20 to-transparent',
    createdAt: '2026-10-14T00:00:00.000Z',
    updatedAt: '2026-10-16T15:00:00.000Z',
  },
];

export function determineFileType(filename: string): LibraryItem['type'] {
  const ext = path.extname(filename).toLowerCase();
  if (['.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg', '.bmp', '.tiff'].includes(ext)) return 'image';
  if (['.mp4', '.mov', '.webm', '.mkv', '.avi'].includes(ext)) return 'video';
  if (ext === '.pdf') return 'pdf';
  if (['.md', '.markdown'].includes(ext)) return 'md';
  if (['.txt', '.csv', '.rtf', '.log'].includes(ext)) return 'txt';
  if (['.mp3', '.wav', '.ogg', '.m4a', '.flac'].includes(ext)) return 'audio';
  if (['.zip', '.rar', '.7z', '.tar', '.gz'].includes(ext)) return 'archive';
  if (ext === '.apk') return 'apk';
  if (['.js', '.ts', '.py', '.json', '.html', '.css', '.sh', '.sql'].includes(ext)) return 'code';
  return 'other';
}

export function formatBytes(bytes: number): string {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

// Carregar catálogo de itens sempre atualizado do disco
export function loadAllItems(): LibraryItem[] {
  try {
    if (fs.existsSync(CATALOG_PATH)) {
      const raw = JSON.parse(fs.readFileSync(CATALOG_PATH, 'utf-8'));
      return (raw as any[]).map((item, index) => {
        const file = item.file || 'resource';
        const ext = item.ext || path.extname(file) || '';
        const id = String(item.id || index + 1);
        return {
          id,
          slug: item.slug || `${id}-${file.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}`,
          title: item.title || file.replace(/\.[^/.]+$/, '').replace(/[-_]+/g, ' '),
          description: item.description || item.text_preview?.slice(0, 160) || 'Ativo do cofre intelectual.',
          file: file,
          rel_path: item.rel_path || file,
          url: item.url || (item.rel_path ? `/biblioteca/${item.rel_path}` : undefined),
          category: item.category || 'root',
          category_group: item.category_group || 'Geral / Core',
          ext: ext,
          type: item.type || determineFileType(file),
          size: Number(item.size) || 0,
          size_formatted: item.size_formatted || formatBytes(Number(item.size) || 0),
          source: item.source || 'core',
          tags: Array.isArray(item.tags) ? item.tags : [ext.replace('.', '')],
          text_preview: item.text_preview || '',
          download_count: item.download_count || 0,
          created_at: item.created_at || '2026-10-14T00:00:00.000Z',
        };
      });
    }
  } catch (err) {
    console.error('Erro ao ler catálogo de itens:', err);
  }
  return [];
}

// Salvar itens sincronizados em ambos os destinos (src e public)
export function saveAllItems(items: LibraryItem[]) {
  try {
    const jsonStr = JSON.stringify(items, null, 2);
    fs.writeFileSync(CATALOG_PATH, jsonStr, 'utf-8');
    if (fs.existsSync(path.dirname(PUBLIC_CATALOG_PATH))) {
      fs.writeFileSync(PUBLIC_CATALOG_PATH, jsonStr, 'utf-8');
    }
  } catch (err) {
    console.error('Erro ao salvar catálogo de itens:', err);
    throw err;
  }
}

// Carregar lista de bibliotecas
export function loadAllLibraries(): LibraryCategory[] {
  try {
    let libs: LibraryCategory[] = [];
    if (fs.existsSync(LIBRARIES_PATH)) {
      libs = JSON.parse(fs.readFileSync(LIBRARIES_PATH, 'utf-8'));
    } else {
      libs = DEFAULT_LIBRARIES;
      fs.writeFileSync(LIBRARIES_PATH, JSON.stringify(libs, null, 2), 'utf-8');
    }

    // Calcula contagem atualizada de itens por biblioteca
    const allItems = loadAllItems();
    return libs.map((lib) => {
      const count = allItems.filter(
        (it) =>
          it.category_group?.toLowerCase() === lib.name.toLowerCase() ||
          it.category?.toLowerCase() === lib.slug.toLowerCase() ||
          it.category_group?.toLowerCase() === lib.slug.toLowerCase()
      ).length;
      return {
        ...lib,
        itemCount: count,
      };
    });
  } catch (err) {
    console.error('Erro ao ler bibliotecas:', err);
    return DEFAULT_LIBRARIES;
  }
}

// Salvar lista de bibliotecas
export function saveAllLibraries(libs: LibraryCategory[]) {
  try {
    fs.writeFileSync(LIBRARIES_PATH, JSON.stringify(libs, null, 2), 'utf-8');
  } catch (err) {
    console.error('Erro ao salvar bibliotecas:', err);
    throw err;
  }
}

// Operações CRUD de Bibliotecas
export function createLibrary(data: Partial<LibraryCategory>): LibraryCategory {
  const current = loadAllLibraries();
  const slug = (data.slug || data.name || 'Nova Biblioteca')
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');

  const newLib: LibraryCategory = {
    id: `lib-${Date.now()}`,
    name: data.name || 'Nova Biblioteca',
    slug: slug,
    description: data.description || 'Biblioteca do cofre de conhecimento.',
    icon: data.icon || '📁',
    badge: data.badge || 'SOBERANO',
    gradient: data.gradient || 'from-indigo-600/30 via-purple-600/20 to-transparent',
    itemCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  current.push(newLib);
  saveAllLibraries(current);

  // Criar pasta de upload dedicada para essa biblioteca
  const libUploadDir = path.join(UPLOADS_DIR, slug);
  if (!fs.existsSync(libUploadDir)) {
    fs.mkdirSync(libUploadDir, { recursive: true });
  }

  return newLib;
}

export function updateLibrary(id: string, data: Partial<LibraryCategory>): LibraryCategory | null {
  const current = loadAllLibraries();
  const index = current.findIndex((lib) => lib.id === id || lib.slug === id);
  if (index === -1) return null;

  const oldName = current[index].name;
  const newName = data.name || oldName;

  current[index] = {
    ...current[index],
    ...data,
    updatedAt: new Date().toISOString(),
  };

  saveAllLibraries(current);

  // Se o nome mudou, atualizar category_group nos itens vinculados
  if (newName !== oldName) {
    const items = loadAllItems();
    let changed = false;
    items.forEach((item) => {
      if (item.category_group?.toLowerCase() === oldName.toLowerCase()) {
        item.category_group = newName;
        changed = true;
      }
    });
    if (changed) {
      saveAllItems(items);
    }
  }

  return current[index];
}

export function deleteLibrary(id: string): boolean {
  const current = loadAllLibraries();
  const target = current.find((lib) => lib.id === id || lib.slug === id);
  if (!target) return false;

  const filtered = current.filter((lib) => lib.id !== id && lib.slug !== id);
  saveAllLibraries(filtered);

  // Opcional: desvincular ou marcar itens
  const items = loadAllItems();
  const updatedItems = items.filter(
    (item) =>
      item.category_group?.toLowerCase() !== target.name.toLowerCase() &&
      item.category?.toLowerCase() !== target.slug.toLowerCase()
  );
  if (updatedItems.length !== items.length) {
    saveAllItems(updatedItems);
  }

  return true;
}

// Operações de Itens da Biblioteca
export function addItemToLibrary(itemData: Partial<LibraryItem>): LibraryItem {
  const items = loadAllItems();
  const filename = itemData.file || 'arquivo';
  const ext = itemData.ext || path.extname(filename) || '';
  const type = itemData.type || determineFileType(filename);
  const size = itemData.size || 0;

  const newItem: LibraryItem = {
    id: itemData.id || `res-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    slug: itemData.slug || `${Date.now()}-${filename.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}`,
    title: itemData.title || filename.replace(/\.[^/.]+$/, '').replace(/[-_]+/g, ' '),
    description: itemData.description || `Ativo adicionado à biblioteca em ${new Date().toLocaleDateString('pt-BR')}`,
    file: filename,
    rel_path: itemData.rel_path || filename,
    url: itemData.url || (itemData.rel_path ? `/uploads/library/${itemData.rel_path}` : undefined),
    category: itemData.category || 'geral-core',
    category_group: itemData.category_group || 'Geral / Core',
    ext: ext,
    type: type,
    size: size,
    size_formatted: itemData.size_formatted || formatBytes(size),
    source: itemData.source || 'mac',
    tags: itemData.tags && itemData.tags.length > 0 ? itemData.tags : [type, ext.replace('.', '')].filter(Boolean),
    text_preview: itemData.text_preview || '',
    download_count: 0,
    created_at: new Date().toISOString(),
  };

  items.unshift(newItem); // Novos no topo
  saveAllItems(items);
  return newItem;
}

// Resolver o caminho físico de um arquivo no disco
export function resolvePhysicalFilePath(item: LibraryItem): string | null {
  const candidates = [
    path.join(UPLOADS_DIR, item.rel_path),
    path.join(UPLOADS_DIR, item.file),
    path.join(BIBLIOTECA_DIR, item.rel_path),
    path.join(BIBLIOTECA_DIR, item.file),
    path.join(SOURCE_FALLBACK_DIR, item.rel_path),
    path.join(SOURCE_FALLBACK_DIR, item.file),
  ];

  for (const p of candidates) {
    if (fs.existsSync(p) && fs.statSync(p).isFile()) {
      return p;
    }
  }
  return null;
}

// Ler conteúdo textual de um arquivo
export function getFileContent(id: string): { success: boolean; content?: string; error?: string } {
  const items = loadAllItems();
  const item = items.find((it) => it.id === id || it.slug === id);
  if (!item) return { success: false, error: 'Arquivo não encontrado no catálogo' };

  if (item.text_preview && !item.rel_path) {
    return { success: true, content: item.text_preview };
  }

  const physicalPath = resolvePhysicalFilePath(item);
  if (physicalPath) {
    try {
      const content = fs.readFileSync(physicalPath, 'utf-8');
      return { success: true, content };
    } catch (e: any) {
      return { success: false, error: `Erro ao ler arquivo: ${e.message}` };
    }
  }

  if (item.text_preview) {
    return { success: true, content: item.text_preview };
  }

  return { success: false, error: 'Arquivo físico não acessível para leitura de texto' };
}

// Salvar conteúdo textual editado
export function saveFileContent(id: string, content: string): { success: boolean; error?: string } {
  const items = loadAllItems();
  const itemIndex = items.findIndex((it) => it.id === id || it.slug === id);
  if (itemIndex === -1) return { success: false, error: 'Arquivo não encontrado' };

  const item = items[itemIndex];
  const physicalPath = resolvePhysicalFilePath(item);

  if (physicalPath) {
    try {
      fs.writeFileSync(physicalPath, content, 'utf-8');
      item.size = Buffer.byteLength(content, 'utf-8');
      item.size_formatted = formatBytes(item.size);
    } catch (e: any) {
      console.warn('Não foi possível gravar no arquivo físico existente, criando nos uploads:', e);
    }
  } else {
    // Se não existia físico, cria no uploads
    const safeName = item.file.replace(/[^a-zA-Z0-9._-]/g, '_');
    const newPath = path.join(UPLOADS_DIR, safeName);
    fs.writeFileSync(newPath, content, 'utf-8');
    item.rel_path = safeName;
    item.url = `/uploads/library/${safeName}`;
    item.size = Buffer.byteLength(content, 'utf-8');
    item.size_formatted = formatBytes(item.size);
  }

  item.text_preview = content.slice(0, 1000);
  items[itemIndex] = item;
  saveAllItems(items);
  return { success: true };
}

// Excluir item
export function deleteItemFromLibrary(id: string): boolean {
  const items = loadAllItems();
  const item = items.find((it) => it.id === id || it.slug === id);
  if (!item) return false;

  // Remover arquivo físico se estiver na pasta de uploads
  const physicalPath = resolvePhysicalFilePath(item);
  if (physicalPath && physicalPath.includes('/uploads/library/')) {
    try {
      if (fs.existsSync(physicalPath)) {
        fs.unlinkSync(physicalPath);
      }
    } catch (err) {
      console.warn('Aviso ao deletar arquivo físico:', err);
    }
  }

  const filtered = items.filter((it) => it.id !== id && it.slug !== id);
  saveAllItems(filtered);
  return true;
}

// Excluir múltiplos itens
export function deleteMultipleItems(ids: string[]): number {
  let count = 0;
  ids.forEach((id) => {
    if (deleteItemFromLibrary(id)) {
      count++;
    }
  });
  return count;
}

// Atualizar metadados do item
export function updateLibraryItem(id: string, data: Partial<LibraryItem>): LibraryItem | null {
  const items = loadAllItems();
  const index = items.findIndex((it) => it.id === id || it.slug === id);
  if (index === -1) return null;

  items[index] = {
    ...items[index],
    ...data,
  };

  saveAllItems(items);
  return items[index];
}

// Criar novo arquivo textual diretamente dentro de uma biblioteca
export function createNewDocumentInLibrary(params: {
  libraryName: string;
  librarySlug: string;
  filename: string;
  content: string;
  title: string;
  description?: string;
  tags?: string[];
}): LibraryItem {
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }

  let finalFilename = params.filename.trim();
  if (!finalFilename.includes('.')) {
    finalFilename += '.md';
  }

  const safeName = `${Date.now()}_${finalFilename.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
  const filePath = path.join(UPLOADS_DIR, safeName);

  fs.writeFileSync(filePath, params.content, 'utf-8');
  const size = Buffer.byteLength(params.content, 'utf-8');

  return addItemToLibrary({
    file: finalFilename,
    rel_path: safeName,
    url: `/uploads/library/${safeName}`,
    category: params.librarySlug,
    category_group: params.libraryName,
    ext: path.extname(finalFilename),
    type: determineFileType(finalFilename),
    size: size,
    size_formatted: formatBytes(size),
    source: 'mac',
    title: params.title || finalFilename.replace(/\.[^/.]+$/, ''),
    description: params.description || `Documento criado via Library Control em ${new Date().toLocaleDateString('pt-BR')}`,
    text_preview: params.content.slice(0, 500),
    tags: params.tags || ['documento', 'library-control'],
  });
}
