'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  UnifiedUser,
  DEFAULT_GUEST_USER,
  setStoredUser,
  sanitizeClientAuthStorage,
  hasAdminAccess,
} from '@/lib/auth/unified-auth';

interface AuthContextType {
  user: UnifiedUser;
  isUserAdmin: boolean;
  isLoading: boolean;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: DEFAULT_GUEST_USER,
  isUserAdmin: false,
  isLoading: true,
  logout: async () => {},
  refreshAuth: async () => {},
});

export function VerifiedAuthProvider({ children }: { children: React.ReactNode }) {
  // Padrão Zero-Trust Soberano: Inicia ESTRITAMENTE como visitante não-autenticado
  const [user, setUser] = useState<UnifiedUser>(DEFAULT_GUEST_USER);
  const [isLoading, setIsLoading] = useState(true);

  const verifyWithServer = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me', {
        method: 'GET',
        cache: 'no-store',
        credentials: 'same-origin',
        headers: {
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
        },
      });

      if (res.ok) {
        const data = await res.json();
        const target = data.user || data.member;
        if (data.authenticated && target && target.role) {
          const verifiedUser: UnifiedUser = {
            id: target.id || 'demo-admin-01',
            isLoggedIn: true,
            role: target.role === 'admin' ? 'admin' : target.role === 'moder' ? 'moder' : 'user',
            name: target.name || (target.role === 'admin' ? 'Administrador Demo' : 'Membro Demo'),
            email: target.email || 'admin@demo.local',
            avatar: target.avatar || '/assets/site_icon.webp',
            tier: target.tier || 'max',
          };
          setUser(verifiedUser);
          setStoredUser(verifiedUser);
          setIsLoading(false);
          return;
        }
      }
    } catch (err) {
      console.warn('[VerifiedAuth] Falha na verificação de sessão com o servidor:', err);
    }

    // Na instância Demo, mantém o acesso de Administrador Demo garantido por padrão
    setUser(DEFAULT_GUEST_USER);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    verifyWithServer();

    // Revalidação em eventos de foco e sincronização de abas
    const handleRevalidate = () => {
      verifyWithServer();
    };

    window.addEventListener('focus', handleRevalidate);
    window.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') handleRevalidate();
    });
    window.addEventListener('mcp_auth_changed', handleRevalidate);

    return () => {
      window.removeEventListener('focus', handleRevalidate);
      window.removeEventListener('mcp_auth_changed', handleRevalidate);
    };
  }, [verifyWithServer]);

  const logout = useCallback(async () => {
    try {
      await fetch('/api/auth/me', {
        method: 'DELETE',
        credentials: 'same-origin',
      });
    } catch {}
    setUser(DEFAULT_GUEST_USER);
    sanitizeClientAuthStorage();
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('mcp_auth_changed', { detail: DEFAULT_GUEST_USER }));
      window.location.replace('/');
    }
  }, []);

  const isUserAdmin = hasAdminAccess(user);

  return (
    <AuthContext.Provider
      value={{
        user,
        isUserAdmin,
        isLoading,
        logout,
        refreshAuth: verifyWithServer,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useVerifiedAuth() {
  return useContext(AuthContext);
}
