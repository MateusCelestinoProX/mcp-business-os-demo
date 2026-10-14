'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  AlertCircle,
  KeyRound,
} from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Credenciais de acesso inválidas.');
      }

      // Redireciona para o dashboard da comunidade fechada
      router.push('/comunidade');
    } catch (err: any) {
      setErrorMessage(err.message || 'Erro ao realizar login.');
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemoCredentials = () => {
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
        <GlassCard variant="luxury" className="p-8 border-white/15">
          {/* Top Brand & Badge */}
          <div className="text-center space-y-2 mb-8">
            <Badge variant="red" dot className="mx-auto">
              Área Restrita de Membros
            </Badge>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              Acesso à Comunidade
            </h1>
            <p className="text-xs text-neutral-400">
              Entre com suas credenciais de membro soberano para desbloquear o acervo completo.
            </p>
          </div>

          {/* Quick Demo Pill */}
          <div
            onClick={fillDemoCredentials}
            className="mb-6 cursor-pointer rounded-xl border border-white/10 bg-white/[0.03] p-3 text-xs transition-all hover:border-red-500/40 hover:bg-red-500/5 group"
          >
            <div className="flex items-center justify-between text-neutral-300">
              <span className="flex items-center gap-1.5 font-semibold text-red-400">
                <KeyRound className="h-3.5 w-3.5" />
                Credencial VIP de Teste:
              </span>
              <span className="text-[0.65rem] text-neutral-400 group-hover:text-white">
                Clique para auto-preencher
              </span>
            </div>
            <p className="mt-1 font-mono text-[0.7rem] text-neutral-400">
              membro@mateuscelestinopro.com
            </p>
          </div>

          {errorMessage && (
            <div className="mb-6 flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-950/40 p-3.5 text-xs text-red-300">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              label="E-mail de Membro"
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

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 text-neutral-400 cursor-pointer select-none">
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded border-white/20 bg-black text-red-500 focus:ring-0"
                />
                Lembrar neste navegador
              </label>

              <Link
                href="/comunidade/cadastro"
                className="text-neutral-400 hover:text-red-400 transition-colors"
              >
                Esqueceu a senha?
              </Link>
            </div>

            <Button
              type="submit"
              variant="fired"
              size="lg"
              isLoading={isLoading}
              className="w-full gap-2 uppercase tracking-wider text-xs font-bold mt-2"
            >
              <span>Entrar na Área de Membros</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          {/* Footer Callout */}
          <div className="mt-8 border-t border-white/5 pt-6 text-center">
            <p className="text-xs text-neutral-400">
              Ainda não possui uma conta de membro?{' '}
              <Link
                href="/comunidade/cadastro"
                className="font-bold text-red-400 hover:text-red-300 transition-colors underline underline-offset-4"
              >
                Criar Cadastro Gratuito
              </Link>
            </p>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
