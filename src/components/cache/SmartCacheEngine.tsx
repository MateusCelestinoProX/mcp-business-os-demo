'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * =========================================================================
 * MOTOR CLIENTE DE CACHE INTELIGENTE & PRERENDER INSTANTÂNEO (SPECULATION RULES)
 * =========================================================================
 * Plataforma Unificada Soberana — Mateus Celestino Pro X
 *
 * Funcionalidades:
 * 1. Registro automático e resiliente do Service Worker Soberano (/sw.js)
 * 2. Injeção nativa da Speculation Rules API (Chrome / Edge / Brave / Opera)
 * 3. Prefetch especulativo universal em mouseenter / touchstart (Safari / Firefox)
 * 4. Carregamento instantâneo (0ms TTFB percebido) para navegação interna
 * =========================================================================
 */

const SPECULATION_RULES = {
  prerender: [
    {
      source: 'document',
      where: {
        and: [
          { href_matches: '/*' },
          { not: { href_matches: '/admin/*' } },
          { not: { href_matches: '/api/*' } },
          { not: { href_matches: '/*\\?*logout*' } },
        ],
      },
      eagerness: 'moderate', // Dispara no hover de ~200ms ou toque inicial
    },
  ],
  prefetch: [
    {
      source: 'document',
      where: {
        and: [
          { href_matches: '/*' },
          { not: { href_matches: '/admin/*' } },
          { not: { href_matches: '/api/*' } },
        ],
      },
      eagerness: 'conservative',
    },
  ],
};

export function SmartCacheEngine() {
  const router = useRouter();

  useEffect(() => {
    let cleanupSW: (() => void) | undefined;

    // 1. Registro do Service Worker Soberano
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      const hadController = Boolean(navigator.serviceWorker.controller);
      let refreshing = false;

      const onControllerChange = () => {
        if (!hadController || refreshing) return;
        try {
          if (sessionStorage.getItem('mcp_sw_reloaded') === '1') return;
          sessionStorage.setItem('mcp_sw_reloaded', '1');
        } catch (err) {}
        refreshing = true;
        window.location.reload();
      };

      navigator.serviceWorker.addEventListener('controllerchange', onControllerChange);

      const registerServiceWorker = () => {
        navigator.serviceWorker
          .register('/sw.js', { scope: '/', updateViaCache: 'none' })
          .then((registration) => {
            registration.update().catch(() => {});
            // Verifica atualizações silenciosamente
            registration.onupdatefound = () => {
              const installingWorker = registration.installing;
              if (installingWorker) {
                installingWorker.onstatechange = () => {
                  if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
                    console.log('⚡ [SmartCache] Nova versão do cache ativada.');
                  }
                };
              }
            };
          })
          .catch((err) => {
            console.warn('⚠️ [SmartCache] Falha ao registrar Service Worker:', err);
          });
      };

      if (document.readyState === 'complete') {
        registerServiceWorker();
      } else {
        window.addEventListener('load', registerServiceWorker, { once: true });
      }

      cleanupSW = () => {
        navigator.serviceWorker.removeEventListener('controllerchange', onControllerChange);
        window.removeEventListener('load', registerServiceWorker);
      };
    }

    // 2. Prefetcher especulativo universal para links visíveis e hover (suporte total a Safari / Firefox)
    const prefetchedUrls = new Set<string>();

    const prefetchUrl = (url: string) => {
      if (!url || prefetchedUrls.has(url)) return;
      if (url.startsWith('/admin') || url.startsWith('/api') || url.startsWith('http') || url.startsWith('#')) return;

      prefetchedUrls.add(url);
      try {
        router.prefetch(url);
      } catch (err) {}
    };

    const handlePointerOver = (e: MouseEvent | TouchEvent) => {
      const target = (e.target as HTMLElement)?.closest('a');
      if (target) {
        const href = target.getAttribute('href');
        if (href && href.startsWith('/')) {
          prefetchUrl(href);
        }
      }
    };

    document.addEventListener('mouseover', handlePointerOver, { passive: true });
    document.addEventListener('touchstart', handlePointerOver, { passive: true });

    return () => {
      if (cleanupSW) cleanupSW();
      document.removeEventListener('mouseover', handlePointerOver);
      document.removeEventListener('touchstart', handlePointerOver);
    };
  }, [router]);

  return (
    <>
      {/* Speculation Rules API Nativa para Navegação Instantânea */}
      <script
        type="speculationrules"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(SPECULATION_RULES),
        }}
      />
    </>
  );
}

export default SmartCacheEngine;
