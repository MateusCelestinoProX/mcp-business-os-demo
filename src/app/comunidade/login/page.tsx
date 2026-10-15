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
        isLoggedIn: true,
        role: role,
        name: data.user?.name || (role === 'admin' ? 'Mateus Celestino Pro' : 'Membro VIP Mateus Pro'),
        email: data.user?.email || email.trim(),
        avatar: '',
        tier: role === 'admin' ? 'max' : (data.user?.tier || 'vip'),
      };

      const targetUrl = data.redirectUrl || (role === 'admin' ? '/admin' : '/comunidade');
      executeLoginSuccess(userPayload, targetUrl);
    } catch (err: any) {
      setErrorMessage(err.message || 'Erro ao realizar login.');
      setIsLoading(false);
    }
  };

  const fillAdminCredentials = () => {
    setEmail('mateus@mateuscelestinopro.com');
    setPassword('MateusProX@2026!');
    setErrorMessage('');
  };

  const fillMemberCredentials = () => {
    setEmail('membro@mateuscelestinopro.com');
    setPassword('MembroProX@2026!');
    setErrorMessage('');
  };



  return (
    <div className="relative min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-12">
      {/* Luz ambiente de fundo */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-red-600/10 blur-[120px]" />
      <div className="pointer-events-none absolute right-1/4 top-1/3 h-64 w-64 rounded-full bg-purple-600/10 blur-[100px]" />

      <div className="relative w-full max-w-md">
        <GlassCard variant="luxury" className="p-8 border-white/15 shadow-2xl">
          {/* Top Brand & Badge */}
          <div className="text-center space-y-2 mb-6">
            <Badge variant="red" dot className="mx-auto">
              Área Restrita Soberana
            </Badge>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              Acesso Unificado
            </h1>
            <p className="text-xs text-neutral-400">
              Entre com suas credenciais de Administrador ou Membro Soberano.
            </p>
          </div>

          {/* Quick Demo Credentials Tabs */}
          <div className="mb-6 space-y-2">
            <span className="text-[11px] font-mono text-neutral-400 block uppercase tracking-wider font-semibold">
              Preenchimento Rápido (1-Clique):
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={fillAdminCredentials}
                className="cursor-pointer rounded-xl border border-red-500/30 bg-red-950/20 p-2.5 text-left text-xs transition-all hover:bg-red-500/10 hover:border-red-500/50"
              >
                <div className="flex items-center gap-1.5 font-bold text-red-400">
                  <Crown className="h-3.5 w-3.5" />
                  <span>Admin Master</span>
                </div>
                <p className="mt-1 font-mono text-[10px] text-neutral-400 truncate">
                  mateus@mateuscelestino...
                </p>
              </button>

              <button
                type="button"
                onClick={fillMemberCredentials}
                className="cursor-pointer rounded-xl border border-white/10 bg-white/[0.03] p-2.5 text-left text-xs transition-all hover:bg-white/[0.08] hover:border-white/20"
              >
                <div className="flex items-center gap-1.5 font-bold text-neutral-200">
                  <KeyRound className="h-3.5 w-3.5 text-amber-400" />
                  <span>Membro VIP</span>
                </div>
                <p className="mt-1 font-mono text-[10px] text-neutral-400 truncate">
                  membro@mateuscelestino...
                </p>
              </button>
            </div>
          </div>

          {errorMessage && (
            <div className="mb-5 flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-950/40 p-3.5 text-xs text-red-300">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-5 flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-950/40 p-3.5 text-xs text-emerald-300">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
              <span>{successMessage}</span>
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
              className="w-full gap-2 uppercase tracking-wider text-xs font-bold mt-2 shadow-xl"
            >
              <span>Entrar no Sistema</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>



          {/* Footer Callout */}
          <div className="mt-6 border-t border-white/5 pt-4 text-center">
            <Link
              href="/"
              className="text-xs text-neutral-400 hover:text-white transition-colors"
            >
              ← Voltar ao Portal Institucional
            </Link>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
