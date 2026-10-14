export type UserRole = 'visitante' | 'user' | 'moder' | 'admin';

export interface UnifiedUser {
  isLoggedIn: boolean;
  role: UserRole;
  name: string;
  email: string;
  avatar: string;
  tier?: string;
}

export const DEFAULT_GUEST_USER: UnifiedUser = {
  isLoggedIn: false,
  role: 'visitante',
  name: 'Visitante',
  email: '',
  avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=GuestVisitor',
  tier: 'free',
};

export const DEMO_USERS: Record<UserRole, UnifiedUser> = {
  visitante: DEFAULT_GUEST_USER,
  user: {
    isLoggedIn: true,
    role: 'user',
    name: 'Membro Aluno Pro',
    email: 'membro@mateuscelestinopro.com',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=MemberProX',
    tier: 'vip',
  },
  moder: {
    isLoggedIn: true,
    role: 'moder',
    name: 'Moderador Oficial',
    email: 'moderador@mateuscelestinopro.com',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=ModeratorShield',
    tier: 'vip',
  },
  admin: {
    isLoggedIn: true,
    role: 'admin',
    name: 'Mateus Celestino Pro',
    email: 'mateus@mateuscelestinopro.com',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=AdminBoss',
    tier: 'max',
  },
};

export const AUTH_STORAGE_KEY = 'mcp_session_user';

export function getStoredUser(): UnifiedUser {
  if (typeof window === 'undefined') return DEFAULT_GUEST_USER;
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return DEFAULT_GUEST_USER;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object' && parsed.role) {
      return parsed as UnifiedUser;
    }
  } catch (err) {
    console.warn('[UnifiedAuth] Erro ao recuperar sessão:', err);
  }
  return DEFAULT_GUEST_USER;
}

export function setStoredUser(user: UnifiedUser): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    // Sincroniza também chaves legadas para compatibilidade
    localStorage.setItem('mcp_user_role', user.role);
    localStorage.setItem('mcp_admin_auth', (user.role === 'admin' || user.role === 'moder') ? 'true' : 'false');
    // Emite evento customizado para reatividade entre abas/componentes
    window.dispatchEvent(new CustomEvent('mcp_auth_changed', { detail: user }));
  } catch (err) {
    console.warn('[UnifiedAuth] Erro ao salvar sessão:', err);
  }
}

export function hasAdminOrModerAccess(user: UnifiedUser): boolean {
  return user.isLoggedIn && (user.role === 'admin' || user.role === 'moder');
}

export function hasAdminAccess(user: UnifiedUser): boolean {
  return user.isLoggedIn && user.role === 'admin';
}
