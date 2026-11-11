'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  AlertCircle,
  KeyRound,
  CheckCircle2,
  Crown,
  Zap,
} from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { setStoredUser, UnifiedUser } from '@/lib/auth/unified-auth';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const executeLoginSuccess = (userPayload: UnifiedUser, redirectUrl: string) => {
    setStoredUser(userPayload);
    // Dispara evento global
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('mcp_auth_changed', { detail: userPayload }));
    }
    setSuccessMessage(`Bem-vindo, ${userPayload.name}! Redirecionando...`);
    setTimeout(() => {
      window.location.href = redirectUrl;
    }, 600);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.success) {
        throw new Error(data?.error || 'Credenciais de acesso inválidas.');
      }

      const role = data.role || (data.user?.role === 'admin' ? 'admin' : 'user');
      const userPayload: UnifiedUser = {
        id: data.user?.id,
        isLoggedIn: true,
        role: role,
        name: data.user?.name || (role === 'admin' ? 'Mateus Celestino Pro X' : 'Membro Pro'),
        email: data.user?.email || email.trim(),
        avatar: '',
        tier: role === 'admin' ? 'max' : (data.user?.tier || 'vip'),
      };

      if (typeof window !== 'undefined') {
        localStorage.removeItem('mcp_auth_token');
      }

      const targetUrl = data.redirectUrl || (role === 'admin' ? '/admin' : '/comunidade');
      executeLoginSuccess(userPayload, targetUrl);
    } catch (err: any) {
      setErrorMessage(err.message || 'Erro ao realizar login.');
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-80px)] flex items-center justify-center px-3 sm:px-4 py-8 sm:py-12">
      {/* Luz ambiente de fundo */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-red-600/10 blur-[120px]" />
      <div className="pointer-events-none absolute right-1/4 top-1/3 h-64 w-64 rounded-full bg-purple-600/10 blur-[100px]" />

      <div className="relative w-full max-w-md mx-auto">
        <GlassCard variant="luxury" className="p-5 sm:p-8 border-white/15 shadow-2xl rounded-2xl sm:rounded-3xl">
          {/* Top Brand & Badge */}
          <div className="text-center space-y-2 mb-6">
            <Badge variant="red" dot className="mx-auto text-[0.65rem] px-2 py-0.5">
              Área Restrita Soberana
            </Badge>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight leading-snug">
              Acesso Unificado
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed max-w-xs mx-auto">
              Entre com suas credenciais de Administrador ou Membro Soberano.
            </p>
          </div>

          {errorMessage && (
            <div className="mb-5 flex items-start sm:items-center gap-2 rounded-xl border border-red-500/30 bg-red-950/40 p-3 sm:p-3.5 text-xs text-red-300">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-400 mt-0.5 sm:mt-0" />
              <span className="leading-relaxed">{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-5 flex items-start sm:items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-950/40 p-3 sm:p-3.5 text-xs text-emerald-300">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5 sm:mt-0" />
              <span className="leading-relaxed">{successMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              label="E-mail de Acesso"
              type="email"
              icon={<Mail className="h-4 w-4" />}
              placeholder="seuemail@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              label="Senha de Acesso"
              type="password"
              icon={<Lock className="h-4 w-4" />}
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Button
              type="submit"
              variant="fired"
              size="lg"
              isLoading={isLoading}
              className="w-full gap-2 uppercase tracking-wider text-xs sm:text-sm font-bold mt-2 shadow-xl min-h-[48px] h-12 touch-manipulation"
            >
              <span>Entrar no Sistema</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          {/* Footer Callout */}
          <div className="mt-6 border-t border-white/5 pt-4 text-center space-y-2">
            <div>
              <Link
                href="/comunidade/cadastro"
                className="inline-block py-1.5 text-xs text-neutral-300 hover:text-white font-semibold transition-colors touch-manipulation"
              >
                Não possui conta? Cadastre-se na Comunidade →
              </Link>
            </div>
            <div>
              <Link
                href="/"
                className="inline-block py-1.5 text-xs text-neutral-500 hover:text-white transition-colors touch-manipulation"
              >
                ← Voltar para a Home Page
              </Link>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
