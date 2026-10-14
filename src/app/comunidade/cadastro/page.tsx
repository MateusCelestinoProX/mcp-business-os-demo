'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  User,
  Mail,
  Lock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (password !== confirmPassword) {
      setErrorMessage('A confirmação de senha não confere com a senha digitada.');
      return;
    }

    if (!termsAccepted) {
      setErrorMessage('Você deve aceitar os termos de compromisso da comunidade.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Falha ao registrar novo membro.');
      }

      // Redireciona diretamente para o dashboard da comunidade com a nova sessão ativa
      router.push('/comunidade');
    } catch (err: any) {
      setErrorMessage(err.message || 'Erro inesperado ao realizar cadastro.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-12">
      {/* Luz ambiente de fundo */}
      <div className="pointer-events-none absolute left-1/3 top-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-red-600/10 blur-[130px]" />
      <div className="pointer-events-none absolute right-1/3 top-1/2 h-80 w-80 rounded-full bg-amber-500/10 blur-[120px]" />

      <div className="relative w-full max-w-lg">
        <GlassCard variant="luxury" className="p-8 border-white/15">
          {/* Header */}
          <div className="text-center space-y-2 mb-8">
            <Badge variant="red" dot className="mx-auto">
              Novo Membro Soberano
            </Badge>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              Cadastre-se na Comunidade
            </h1>
            <p className="text-xs text-neutral-400">
              Crie seu acesso exclusivo para interagir com criadores, prompts de IA e trilhas em 4K.
            </p>
          </div>

          {errorMessage && (
            <div className="mb-6 flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-950/40 p-3.5 text-xs text-red-300">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleRegister} className="space-y-4">
            <Input
              label="Nome Completo"
              icon={<User className="h-4 w-4" />}
              placeholder="Mateus da Silva"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <Input
              label="E-mail Pessoal ou Profissional"
              type="email"
              icon={<Mail className="h-4 w-4" />}
              placeholder="seuemail@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Senha (mínimo 6 caracteres)"
                type="password"
                icon={<Lock className="h-4 w-4" />}
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <Input
                label="Confirmar Senha"
                type="password"
                icon={<ShieldCheck className="h-4 w-4" />}
                placeholder="••••••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <div className="pt-1">
              <label className="flex items-start gap-2.5 text-xs text-neutral-400 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-0.5 rounded border-white/20 bg-black text-red-500 focus:ring-0"
                />
                <span>
                  Concordo com os{' '}
                  <strong className="text-white">Termos da Comunidade Fechada</strong> e com o código de ética
                  de compartilhamento de ativos de IA de alta resolução.
                </span>
              </label>
            </div>

            <Button
              type="submit"
              variant="fired"
              size="lg"
              isLoading={isLoading}
              className="w-full gap-2 uppercase tracking-wider text-xs font-bold mt-4"
            >
              <span>Criar Minha Conta de Membro</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          {/* Footer Callout */}
          <div className="mt-8 border-t border-white/5 pt-6 text-center">
            <p className="text-xs text-neutral-400">
              Já possui uma conta ativa?{' '}
              <Link
                href="/comunidade/login"
                className="font-bold text-red-400 hover:text-red-300 transition-colors underline underline-offset-4"
              >
                Fazer Login
              </Link>
            </p>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
