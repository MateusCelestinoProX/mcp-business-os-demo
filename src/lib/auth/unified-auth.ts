export type UserRole = 'visitante' | 'user' | 'moder' | 'admin';

export interface UnifiedUser {
  id?: string;
  isLoggedIn: boolean;
  role: UserRole;
  name: string;
  email: string;
  avatar: string;
  tier?: string;
}

/**
 * Padrão Demonstração: O usuário possui acesso de Administrador por padrão
 * para livre experimentação de todos os módulos e dashboards.
 */
export const DEFAULT_DEMO_ADMIN_USER: UnifiedUser = {
  id: '00000000-0000-4000-8000-000000000001',
  isLoggedIn: true,
  role: 'admin',
  name: 'Administrador Demo',
  email: 'admin@demo.local',
  avatar: '/assets/site_icon.webp',
  tier: 'max',
};

export const DEFAULT_GUEST_USER: UnifiedUser = DEFAULT_DEMO_ADMIN_USER;

export const AUTH_STORAGE_KEY = 'mcp_session_user';

export function getStoredUser(): UnifiedUser {
  if (typeof window === 'undefined') return DEFAULT_DEMO_ADMIN_USER;
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return DEFAULT_DEMO_ADMIN_USER;

    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object') {
      if (parsed.isLoggedIn && parsed.role) {
        return parsed as UnifiedUser;
      }
    }
  } catch (err) {
    console.warn('[UnifiedAuth] Erro ao recuperar sessão:', err);
  }
  return DEFAULT_DEMO_ADMIN_USER;
}

export function setStoredUser(user: UnifiedUser): void {
  if (typeof window === 'undefined') return;
  try {
    if (!user.isLoggedIn || user.role === 'visitante') {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      localStorage.removeItem('mcp_user_role');
      localStorage.removeItem('mcp_admin_auth');
    } else {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      localStorage.setItem('mcp_user_role', user.role);
      localStorage.setItem('mcp_admin_auth', user.role === 'admin' ? 'true' : 'false');
    }
    window.dispatchEvent(new CustomEvent('mcp_auth_changed', { detail: user }));
  } catch (err) {
    console.warn('[UnifiedAuth] Erro ao salvar sessão:', err);
  }
}

export function sanitizeClientAuthStorage(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem('mcp_user_role');
    localStorage.removeItem('mcp_admin_auth');
    localStorage.removeItem('mcp_auth_token');
    sessionStorage.removeItem('mcp_admin_auth');
  } catch (err) {
    console.warn('[UnifiedAuth] Erro ao sanitizar storage:', err);
  }
}

export function hasAdminOrModerAccess(user: UnifiedUser): boolean {
  return Boolean(user && user.isLoggedIn && (user.role === 'admin' || user.role === 'moder'));
}

export function hasAdminAccess(user: UnifiedUser): boolean {
  return Boolean(user && user.isLoggedIn && user.role === 'admin');
}
