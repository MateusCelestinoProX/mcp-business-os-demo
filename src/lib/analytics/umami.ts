/**
 * =========================================================================
 * UMAMI ANALYTICS SOBERANO — TELEMETRIA & EVENTOS EM TEMPO REAL
 * =========================================================================
 * Plataforma Unificada Soberana — Mateus Celestino Pro X
 *
 * Instância Oficial Umami Analytics:
 * Host: https://umami-chi-topaz.vercel.app
 * Tracker: https://umami-chi-topaz.vercel.app/script.js
 * Website ID: 482f25fc-b97b-41da-80da-4f780f093655
 * =========================================================================
 */

import { getCookieConsent } from "../cookies";

export const UMAMI_CONFIG = {
  websiteId:
    process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID ||
    '482f25fc-b97b-41da-80da-4f780f093655',
  hostUrl:
    process.env.NEXT_PUBLIC_UMAMI_HOST_URL ||
    'https://umami-chi-topaz.vercel.app',
  scriptUrl:
    process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL ||
    'https://umami-chi-topaz.vercel.app/script.js',
  domains:
    'mcp-business-os.vercel.app,mcp-business-os-mcp-team.vercel.app,localhost',
} as const;

declare global {
  interface Window {
    umami?: {
      track: {
        (eventName: string, eventData?: Record<string, any>): void;
        (customPayload: (defaultPayload: any) => any): void;
        (): void;
      };
      identify?: (data: Record<string, any>) => void;
    };
  }
}

/**
 * Registra um evento personalizado de conversão, engajamento ou navegação
 * Seguro contra adblockers e ambientes SSR.
 */
export function trackEvent(eventName: string, eventData?: Record<string, any>): void {
  if (typeof window === 'undefined') return;

  // Respeita opt-out de cookies e telemetria
  if (getCookieConsent() === 'essential') {
    return;
  }

  try {
    if (window.umami && typeof window.umami.track === 'function') {
      if (eventData) {
        window.umami.track(eventName, eventData);
      } else {
        window.umami.track(eventName);
      }
    } else {
      // Se o script ainda estiver carregando ou adblocker estiver ativo, registra em debug silencioso
      if (process.env.NODE_ENV === 'development') {
        console.debug(`[Umami Analytics Dev] Evento disparado: "${eventName}"`, eventData);
      }
    }
  } catch (error) {
    console.warn('[Umami Analytics] Falha ao registrar evento:', error);
  }
}

/**
 * Registra visualização de página SPA explicitamente
 */
export function trackPageView(url?: string, title?: string): void {
  if (typeof window === 'undefined') return;

  // Respeita opt-out de cookies e telemetria
  if (getCookieConsent() === 'essential') {
    return;
  }

  try {
    if (window.umami && typeof window.umami.track === 'function') {
      window.umami.track((props: any) => ({
        ...props,
        ...(url ? { url } : {}),
        ...(title ? { title } : {}),
      }));
    }
  } catch (error) {
    console.warn('[Umami Analytics] Falha ao registrar pageview:', error);
  }
}

/**
 * Identifica o usuário logado para segmentação de telemetria
 */
export function identifyUser(userData: { id?: string; email?: string; role?: string; tier?: string }): void {
  if (typeof window === 'undefined') return;

  try {
    if (window.umami && typeof window.umami.identify === 'function') {
      window.umami.identify(userData);
    }
  } catch (error) {
    console.warn('[Umami Analytics] Falha ao identificar usuário:', error);
  }
}
