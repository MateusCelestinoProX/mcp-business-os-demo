/**
 * =========================================================================
 * SERVICE WORKER INTELIGENTE SOBERANO (PWA & SMART CACHE ENGINE)
 * =========================================================================
 * Plataforma Unificada Soberana — Mateus Celestino Pro X
 *
 * Estratégias Avançadas de Caching:
 * 1. Network-First com Fallback: Documentos/Páginas HTML (sempre reflete último deploy Vercel)
 * 2. Stale-While-Revalidate: Assets mutáveis dos hubs (/showcase, /comunidade, /biblioteca)
 * 3. Cache-First: Assets imutáveis (/\_next/static, imagens, fontes, shaders WebGL)
 * 4. Network-First com Fallback: APIs públicas de leitura (/api/articles, /api/library)
 * 5. Bypass Seguro: Rotas administrativas, autenticação e checkout/pagamentos
 * 6. Auto-Purge: Limpeza automática de caches defasados na ativação de novas versões
 * =========================================================================
 */

const CACHE_VERSION = 'mcp-business-os-v1.0.3';
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

  // Ignora extensões do Chrome, esquemas não-HTTP e requisições administrativas/sensíveis e telemetria Umami
  if (!url.protocol.startsWith('http')) return;
  if (
    url.pathname.startsWith('/admin') ||
    url.pathname.startsWith('/api/admin') ||
    url.pathname.startsWith('/api/auth') ||
    url.pathname.startsWith('/api/members') ||
    url.pathname.startsWith('/api/finance') ||
    url.pathname.startsWith('/api/leads') ||
    url.pathname.startsWith('/api/payment') ||
    url.pathname.startsWith('/api/checkout') ||
    url.hostname.includes('umami') ||
    url.pathname.includes('/api/send')
  ) {
    return;
  }

  // 1. ESTRATÉGIA STALE-WHILE-REVALIDATE: CSS/JS não-hasheados dos Hubs Estáticos
  const isMutableHubAsset =
    (url.pathname.startsWith('/showcase/') ||
      url.pathname.startsWith('/comunidade/') ||
      url.pathname.startsWith('/biblioteca/') ||
      url.pathname.startsWith('/smartflow/')) &&
    /\.(css|js)$/i.test(url.pathname);

  if (isMutableHubAsset) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        const fetchPromise = fetch(request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200 && networkResponse.type !== 'opaque') {
              const responseToCache = networkResponse.clone();
              caches.open(STATIC_CACHE).then((cache) => {
                cache.put(request, responseToCache);
              });
            }
            return networkResponse;
          })
          .catch(() => cachedResponse);

        return cachedResponse || fetchPromise;
      })
    );
    return;
  }

  // 2. ESTRATÉGIA CACHE-FIRST: Assets imutáveis, fontes, imagens, áudio, vídeos e shaders WebGL
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

  // 3. ESTRATÉGIA NETWORK-FIRST COM FALLBACK OFFLINE: Documentos e Páginas HTML
  // Garante que novos deploys na Vercel apareçam imediatamente sem HTML obsoleto preso no SW.
  const isNavigation = request.mode === 'navigate' || request.destination === 'document';
  if (isNavigation) {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const cacheControl = networkResponse.headers.get('cache-control') || '';
            if (!cacheControl.includes('no-store')) {
              const responseToCache = networkResponse.clone();
              caches.open(PAGES_CACHE).then((cache) => {
                cache.put(request, responseToCache);
              });
            }
          } else if (networkResponse && networkResponse.status >= 400) {
            caches.open(PAGES_CACHE).then((cache) => {
              cache.delete(request);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          return caches.match(request).then((cachedResponse) => {
            if (cachedResponse) return cachedResponse;
            // Se não houver nada no cache, tenta a rota raiz
            return caches.match('/');
          });
        })
    );
    return;
  }

  // 3. ESTRATÉGIA NETWORK-FIRST COM FALLBACK DE CACHE: APIs Públicas de Consulta
  const isPublicApi =
    url.pathname.startsWith('/api/articles') ||
    url.pathname.startsWith('/api/library') ||
    url.pathname.startsWith('/api/shop');

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
