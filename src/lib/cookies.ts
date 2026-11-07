/**
 * Utilitários de Gerenciamento de Cookies Reais e Consentimento LGPD
 * Plataforma Mateus Celestino Pro X
 */

export const COOKIE_CONSENT_KEY = 'cookie_consent';

export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;

  const nameEQ = `${name}=`;
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) {
      return decodeURIComponent(c.substring(nameEQ.length, c.length));
    }
  }
  return null;
}

export function setCookie(name: string, value: string, days: number = 365): void {
  if (typeof document === 'undefined') return;

  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);

  const isSecure = typeof window !== 'undefined' && window.location.protocol === 'https:';
  const secureFlag = isSecure ? '; Secure' : '';

  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires.toUTCString()}; path=/; SameSite=Lax${secureFlag}`;

  // Sincroniza também no localStorage para leitura instantânea e sem latência
  try {
    localStorage.setItem(name, value);
  } catch {
    // Falha silenciosa em ambientes com restrição de storage
  }
}

export function deleteCookie(name: string): void {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax`;
  try {
    localStorage.removeItem(name);
  } catch {
    // Falha silenciosa
  }
}

export type CookieConsentType = 'accepted' | 'essential' | null;

export function getCookieConsent(): CookieConsentType {
  if (typeof window === 'undefined') return null;

  // Tenta ler do cookie real primeiro
  const cookieVal = getCookie(COOKIE_CONSENT_KEY);
  if (cookieVal === 'accepted' || cookieVal === 'essential') {
    return cookieVal;
  }

  // Fallback para localStorage
  try {
    const localVal = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (localVal === 'accepted' || localVal === 'essential') {
      return localVal;
    }
  } catch {
    // ignora
  }

  return null;
}

export function setCookieConsent(type: 'accepted' | 'essential'): void {
  setCookie(COOKIE_CONSENT_KEY, type, 365);

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('cookie_consent_updated', { detail: type }));
  }
}

export function openCookiePreferences(): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('mcp_open_cookie_preferences'));
  }
}
