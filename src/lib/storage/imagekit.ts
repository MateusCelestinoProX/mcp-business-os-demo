import crypto from 'node:crypto';

export interface ImageKitUploadResult {
  fileId: string;
  name: string;
  url: string;
  thumbnailUrl?: string;
  size: number;
  filePath: string;
  fileType: 'image' | 'non-image';
  height?: number;
  width?: number;
}

export interface ImageKitUploadOptions {
  file: Buffer | string; // Buffer ou Base64 string
  fileName: string;
  folder?: string;
  tags?: string[];
  isPrivateFile?: boolean;
  useUniqueFileName?: boolean;
  customMetadata?: Record<string, any>;
}

export interface ImageKitAuthParams {
  token: string;
  expire: number;
  signature: string;
  publicKey: string;
  urlEndpoint: string;
}

export const IMAGEKIT_PUBLIC_KEY =
  process.env.IMAGEKIT_PUBLIC_KEY ||
  process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY ||
  'public_tk5YQVVARmsNo/V3ZYrr0UpgyGs=';

export const IMAGEKIT_PRIVATE_KEY =
  process.env.IMAGEKIT_PRIVATE_KEY || 'private_3hfnNnkOAokeFvzZm8FsViiMZXI=';

export const IMAGEKIT_URL_ENDPOINT = (
  process.env.IMAGEKIT_URL_ENDPOINT ||
  process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT ||
  'https://ik.imagekit.io/lojoakxmk'
).replace(/\/$/, '');

/**
 * Retorna se o ImageKit possui chaves ativas configuradas
 */
export function isImageKitConfigured(): boolean {
  return Boolean(IMAGEKIT_PUBLIC_KEY && IMAGEKIT_PRIVATE_KEY && IMAGEKIT_URL_ENDPOINT);
}

/**
 * Gera cabeçalho de autenticação HTTP Basic para ImageKit API
 */
function getBasicAuthHeader(): string {
  const token = Buffer.from(`${IMAGEKIT_PRIVATE_KEY}:`).toString('base64');
  return `Basic ${token}`;
}

/**
 * Gera parâmetros de autenticação para upload seguro via cliente (browser)
 */
export function getImageKitAuthParams(expireSeconds = 2400): ImageKitAuthParams {
  const token = crypto.randomUUID();
  const expire = Math.floor(Date.now() / 1000) + expireSeconds;

  const signature = crypto
    .createHmac('sha1', IMAGEKIT_PRIVATE_KEY)
    .update(token + expire)
    .digest('hex');

  return {
    token,
    expire,
    signature,
    publicKey: IMAGEKIT_PUBLIC_KEY,
    urlEndpoint: IMAGEKIT_URL_ENDPOINT,
  };
}

/**
 * Determina a pasta canônica da Plataforma Soberana baseada na extensão/tipo
 */
export function getCanonicalImageKitFolder(filename: string, preferredFolder?: string): string {
  if (preferredFolder) {
    return preferredFolder.startsWith('/') ? preferredFolder : `/${preferredFolder}`;
  }

  const ext = filename.split('.').pop()?.toLowerCase() || '';

  if (['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg', 'avif', 'ico'].includes(ext)) {
    return '/soberana/images';
  }
  if (['mp4', 'webm', 'mov', 'mkv', 'avi', 'm4v'].includes(ext)) {
    return '/soberana/videos';
  }
  if (['pdf'].includes(ext)) {
    return '/soberana/pdfs';
  }
  return '/soberana/library';
}

/**
 * Realiza upload de arquivo para a CDN ImageKit
 */
export async function uploadToImageKit(
  options: ImageKitUploadOptions
): Promise<ImageKitUploadResult> {
  if (!IMAGEKIT_PRIVATE_KEY) {
    throw new Error('IMAGEKIT_PRIVATE_KEY não está configurada no ambiente.');
  }

  const folder = getCanonicalImageKitFolder(options.fileName, options.folder);
  const formData = new FormData();

  // Tratamento do conteúdo do arquivo: Buffer -> Blob ou string base64
  if (Buffer.isBuffer(options.file)) {
    const arrayBuffer = options.file.buffer.slice(
      options.file.byteOffset,
      options.file.byteOffset + options.file.byteLength
    ) as ArrayBuffer;
    const blob = new Blob([arrayBuffer]);
    formData.append('file', blob, options.fileName);
  } else {
    // String base64 ou URL
    formData.append('file', options.file);
  }

  formData.append('fileName', options.fileName);
  formData.append('folder', folder);
  formData.append('useUniqueFileName', String(options.useUniqueFileName ?? true));

  if (options.tags && options.tags.length > 0) {
    formData.append('tags', options.tags.join(','));
  }
  if (options.isPrivateFile) {
    formData.append('isPrivateFile', 'true');
  }
  if (options.customMetadata) {
    formData.append('customMetadata', JSON.stringify(options.customMetadata));
  }

  const response = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
    method: 'POST',
    headers: {
      Authorization: getBasicAuthHeader(),
    },
    body: formData,
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Falha no upload para o ImageKit (${response.status}): ${errText}`);
  }

  const data = await response.json();

  return {
    fileId: data.fileId,
    name: data.name,
    url: data.url,
    thumbnailUrl: data.thumbnailUrl || data.thumbnail || data.url,
    size: data.size,
    filePath: data.filePath,
    fileType: data.fileType,
    height: data.height,
    width: data.width,
  };
}

/**
 * Remove um arquivo do ImageKit através de seu fileId
 */
export async function deleteFromImageKit(fileId: string): Promise<boolean> {
  if (!IMAGEKIT_PRIVATE_KEY) {
    throw new Error('IMAGEKIT_PRIVATE_KEY não está configurada.');
  }

  const response = await fetch(`https://api.imagekit.io/v1/files/${encodeURIComponent(fileId)}`, {
    method: 'DELETE',
    headers: {
      Authorization: getBasicAuthHeader(),
    },
  });

  if (response.status === 204 || response.status === 200) {
    return true;
  }

  const errText = await response.text();
  console.warn(`[ImageKit] Erro ao deletar arquivo ${fileId}:`, errText);
  return false;
}

/**
 * Lista arquivos armazenados no ImageKit com suporte a filtros e paginação
 */
export async function listImageKitFiles(params?: {
  path?: string;
  limit?: number;
  skip?: number;
  searchQuery?: string;
}): Promise<any[]> {
  const query = new URLSearchParams();
  if (params?.limit) query.set('limit', String(params.limit));
  if (params?.skip) query.set('skip', String(params.skip));
  if (params?.path) query.set('path', params.path);
  if (params?.searchQuery) query.set('searchQuery', params.searchQuery);

  const url = `https://api.imagekit.io/v1/files?${query.toString()}`;
  const response = await fetch(url, {
    headers: {
      Authorization: getBasicAuthHeader(),
    },
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Falha ao listar arquivos no ImageKit: ${err}`);
  }

  return await response.json();
}

/**
 * Constrói URL com parâmetros de transformação CDN (otimização de imagem/vídeo)
 */
export function getOptimizedMediaUrl(
  pathOrUrl: string,
  transformations?: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'webp' | 'avif' | 'auto';
    blur?: number;
    crop?: 'maintain_ratio' | 'force' | 'at_least';
  }
): string {
  if (!pathOrUrl) return '';

  let cleanPath = pathOrUrl;
  if (cleanPath.startsWith(IMAGEKIT_URL_ENDPOINT)) {
    cleanPath = cleanPath.slice(IMAGEKIT_URL_ENDPOINT.length);
  }
  cleanPath = cleanPath.replace(/^\/+/, '');

  if (!transformations) {
    return `${IMAGEKIT_URL_ENDPOINT}/${cleanPath}`;
  }

  const trs: string[] = [];
  if (transformations.width) trs.push(`w-${transformations.width}`);
  if (transformations.height) trs.push(`h-${transformations.height}`);
  if (transformations.quality) trs.push(`q-${transformations.quality}`);
  if (transformations.format) trs.push(`f-${transformations.format}`);
  if (transformations.blur) trs.push(`bl-${transformations.blur}`);
  if (transformations.crop) trs.push(`c-${transformations.crop}`);

  const trString = trs.length > 0 ? `?tr=${trs.join(',')}` : '';
  return `${IMAGEKIT_URL_ENDPOINT}/${cleanPath}${trString}`;
}
