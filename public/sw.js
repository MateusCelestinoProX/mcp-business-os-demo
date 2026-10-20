/**
 * =========================================================================
 * SERVICE WORKER INTELIGENTE SOBERANO (PWA & SMART CACHE ENGINE)
 * =========================================================================
 * Plataforma Unificada Soberana — Mateus Celestino Pro X
 *
 * Estratégias Avançadas de Caching:
 * 1. Cache-First: Assets imutáveis, fontes, imagens, WebGL shaders, chunks JS/CSS
 * 2. Stale-While-Revalidate: Páginas HTML e navegação de rotas (0ms de latência)
 * 3. Network-First com Fallback: APIs públicas de leitura (/api/articles, /api/library)
 * 4. Bypass Seguro: Rotas administrativas, autenticação e checkout/pagamentos
 * 5. Auto-Purge: Limpeza automática de caches defasados na ativação de novas versões
 * =========================================================================
 */

const CACHE_VERSION = 'mcp-business-os-v1.0.0';
const STATIC_CACHE = `mcp-static-${CACHE_VERSION}`;
const PAGES_CACHE = `mcp-pages-${CACHE_VERSION}`;
const API_CACHE = `mcp-api-${CACHE_VERSION}`;

// Recursos vitais pré-cacheados durante o install
const PRECACHE_ASSETS = [
  '/',
  '/manifest.webmanifest',
  '/favicon.ico',
  '/icon.png',
  '/assets/site_icon.webp',
  '/assets/hero_cover.webp',
];

// Instalação do Service Worker
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn('⚠️ [SW] Alguns itens não puderam ser pré-cacheados:', err);
      });
    })
  );
});

// Ativação e limpeza de caches obsoletos
self.addEventListener('activate', (event) => {
  const currentCaches = [STATIC_CACHE, PAGES_CACHE, API_CACHE];
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (!currentCaches.includes(cacheName) && cacheName.startsWith('mcp-')) {
              console.log('🧹 [SW] Removendo cache obsoleto:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Interceptor inteligente de requisições de rede
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Apenas intercepta métodos GET
  if (request.method !== 'GET') {
    return;
  }

  // Ignora extensões do Chrome, esquemas não-HTTP e requisições administrativas/sensíveis
  if (!url.protocol.startsWith('http')) return;
  if (url.pathname.startsWith('/admin') || url.pathname.startsWith('/api/auth') || url.pathname.startsWith('/api/payment') || url.pathname.startsWith('/api/checkout')) {
    return;
  }

  // 1. ESTRATÉGIA CACHE-FIRST: Assets estáticos, fontes, imagens, áudio, vídeos e shaders WebGL
  const isStaticAsset =
    url.pathname.startsWith('/_next/static/') ||
    url.pathname.startsWith('/assets/') ||
    url.pathname.startsWith('/effects/') ||
    url.pathname.startsWith('/icons/') ||
    request.destination === 'image' ||
    request.destination === 'font' ||
    request.destination === 'style' ||
    request.destination === 'script' ||
    /\.(png|jpg|jpeg|webp|avif|svg|ico|woff|woff2|ttf|otf|mp4|webm|glb|gltf|bin|json)$/i.test(url.pathname);

  if (isStaticAsset) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(request).then((networkResponse) => {
          if (!networkResponse || networkResponse.status !== 200 || networkResponse.type === 'opaque') {
            return networkResponse;
          }

          const responseToCache = networkResponse.clone();
          caches.open(STATIC_CACHE).then((cache) => {
            cache.put(request, responseToCache);
          });

          return networkResponse;
        }).catch(() => {
          // Retorna resposta vazia ou null se offline para assets opcionais
          return new Response('', { status: 408, statusText: 'Request Timeout (Offline)' });
        });
      })
    );
    return;
  }

  // 2. ESTRATÉGIA STALE-WHILE-REVALIDATE: Documentos e Páginas HTML (Navegação Instantânea)
  const isNavigation = request.mode === 'navigate' || request.destination === 'document';
  if (isNavigation) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        const fetchPromise = fetch(request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const responseToCache = networkResponse.clone();
              caches.open(PAGES_CACHE).then((cache) => {
                cache.put(request, responseToCache);
              });
            }
            return networkResponse;
          })
          .catch((err) => {
            if (cachedResponse) return cachedResponse;
            // Se não houver nada no cache, tenta a rota raiz
            return caches.match('/');
          });

        // Se já possuímos a página em cache, devolvemos imediatamente em 0ms!
        return cachedResponse || fetchPromise;
      })
    );
    return;
  }

  // 3. ESTRATÉGIA NETWORK-FIRST COM FALLBACK DE CACHE: APIs Públicas de Consulta
  const isPublicApi =
    url.pathname.startsWith('/api/articles') ||
    url.pathname.startsWith('/api/library') ||
    url.pathname.startsWith('/api/admin/shop-resources');

  if (isPublicApi) {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(API_CACHE).then((cache) => {
              cache.put(request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          return caches.match(request).then((cachedResponse) => {
            if (cachedResponse) return cachedResponse;
            return new Response(
              JSON.stringify({ success: false, error: 'Offline', source: 'sw_offline_fallback' }),
              { headers: { 'Content-Type': 'application/json' }, status: 503 }
            );
          });
        })
    );
    return;
  }
});
