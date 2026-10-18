'use client';

import React, { useState } from 'react';
import {
  X,
  CreditCard,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Zap,
  ArrowRight,
  Lock,
} from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { formatCurrencyBRL } from '@/lib/utils';
import { COMMUNITY_PLANS, type PlanConfig } from '@/lib/plans';

export interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultPlanSlug?: string;
  memberEmail?: string;
  memberName?: string;
  onPaymentSuccess?: (plan: PlanConfig) => void;
}

export function CheckoutModal({
  isOpen,
  onClose,
  defaultPlanSlug = 'membership-vip',
  memberEmail = '',
  memberName = '',
  onPaymentSuccess,
}: CheckoutModalProps) {
  const [selectedPlanSlug, setSelectedPlanSlug] = useState<string>(defaultPlanSlug);
  const [email, setEmail] = useState(memberEmail);
  const [name, setName] = useState(memberName);
  const [paymentMethod, setPaymentMethod] = useState<'mp' | 'pix' | 'card'>('mp');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successSimulated, setSuccessSimulated] = useState(false);

  if (!isOpen) return null;

  const currentPlan = COMMUNITY_PLANS[selectedPlanSlug] || COMMUNITY_PLANS['membership-vip'];

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/payment/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planSlug: currentPlan.slug,
          memberEmail: email.trim(),
          memberName: name.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Falha ao processar checkout');
      }

      // Se for modo live com init_point do Mercado Pago, redireciona
      if (data.mode === 'live' && data.init_point) {
        window.location.href = data.init_point;
        return;
      }

      // Modo Sandbox Localhost: simula ativação instantânea com webhook interno
      await fetch('/api/payment/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: data.id || 'SANDBOX_CHECKOUT_SUCCESS',
          email: email.trim() || 'membro@mateuscelestinopro.com',
          planSlug: currentPlan.slug,
          status: 'approved',
        }),
      });

      setSuccessSimulated(true);
      if (onPaymentSuccess) {
        onPaymentSuccess(currentPlan);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Erro inesperado ao gerar pagamento.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl">
        <GlassCard
          variant="luxury"
          className="relative max-h-[94vh] sm:max-h-[90vh] overflow-y-auto border-white/20 p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl"
        >
          {/* Close Button Touch-First */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 sm:top-5 sm:right-5 flex h-10 w-10 sm:h-9 sm:w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-neutral-400 transition-all hover:bg-white/10 hover:text-white touch-manipulation z-20"
            aria-label="Fechar checkout"
          >
            <X className="h-5 w-5" />
          </button>

          {successSimulated ? (
            <div className="py-6 sm:py-8 text-center space-y-4">
              <div className="mx-auto flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/20 text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                <CheckCircle2 className="h-8 w-8 sm:h-9 sm:w-9" />
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Pagamento Aprovado com Sucesso!
              </h3>

              <p className="text-xs sm:text-sm text-neutral-300 max-w-md mx-auto leading-relaxed">
                Seu plano <strong className="text-white">{currentPlan.title}</strong> foi ativado com
                sucesso na Comunidade Soberana. Seu status foi atualizado para{' '}
                <span className="text-red-400 font-bold uppercase">{currentPlan.tier}</span>.
              </p>

              <div className="pt-4">
                <Button
                  onClick={() => {
                    setSuccessSimulated(false);
                    onClose();
                    window.location.reload();
                  }}
                  variant="fired"
                  size="lg"
                  className="w-full min-h-[48px] touch-manipulation text-xs sm:text-sm uppercase tracking-wider font-bold"
                >
                  Acessar Conteúdo VIP Imediatamente
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleCheckout} className="space-y-5 sm:space-y-6">
              {/* Header do Modal */}
              <div className="pr-8 sm:pr-0">
                <Badge variant="red" dot className="mb-2 text-[0.65rem] px-2 py-0.5">
                  Mercado Pago Checkout Seguro
                </Badge>
                <h3 className="text-lg sm:text-xl md:text-2xl font-black text-white tracking-tight leading-snug">
                  Eleve seu Acesso à Comunidade Soberana
                </h3>
                <p className="text-xs sm:text-sm text-neutral-400 mt-1 leading-relaxed">
                  Tenha acesso vitalício ao acervo completo de prompts, vídeos 4K e ecossistema de software.
                </p>
              </div>

              {/* Seletor de Planos Fluidos */}
              <div className="space-y-2">
                <label className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-neutral-400">
                  Selecione seu Plano:
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-2.5">
                  {Object.values(COMMUNITY_PLANS).map((p) => (
                    <div
                      key={p.slug}
                      onClick={() => setSelectedPlanSlug(p.slug)}
                      className={`cursor-pointer rounded-xl border p-3 sm:p-3.5 transition-all touch-manipulation ${
                        selectedPlanSlug === p.slug
                          ? 'border-red-500/60 bg-red-950/30 shadow-[0_0_20px_rgba(255,7,58,0.25)]'
                          : 'border-white/10 bg-white/[0.02] hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-white truncate">{p.title}</span>
                        <span className="text-xs font-bold text-red-400 shrink-0">
                          {formatCurrencyBRL(p.price)}
                        </span>
                      </div>
                      <p className="mt-1 text-[0.7rem] text-neutral-400 line-clamp-2 leading-relaxed">
                        {p.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Formulário de Identificação do Pagador */}
              <div className="space-y-3">
                <Input
                  label="Nome Completo"
                  placeholder="Seu nome oficial"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <Input
                  label="E-mail de Membro (para liberação de acesso)"
                  type="email"
                  placeholder="seuemail@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {/* Métodos de Pagamento Adaptados para Telas Verticais */}
              <div className="space-y-2">
                <label className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-neutral-400">
                  Forma de Pagamento:
                </label>
                <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('mp')}
                    className={`flex flex-col items-center justify-center gap-1 sm:gap-1.5 rounded-xl border p-2 sm:p-3 text-[11px] sm:text-xs font-semibold transition-all min-h-[58px] sm:min-h-[64px] touch-manipulation ${
                      paymentMethod === 'mp'
                        ? 'border-red-500 bg-red-500/15 text-white shadow-[0_0_15px_rgba(255,7,58,0.2)]'
                        : 'border-white/10 bg-white/5 text-neutral-400 hover:text-white'
                    }`}
                  >
                    <Zap className="h-4 w-4 shrink-0 text-red-400" />
                    <span className="truncate w-full text-center">Mercado Pago</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('pix')}
                    className={`flex flex-col items-center justify-center gap-1 sm:gap-1.5 rounded-xl border p-2 sm:p-3 text-[11px] sm:text-xs font-semibold transition-all min-h-[58px] sm:min-h-[64px] touch-manipulation ${
                      paymentMethod === 'pix'
                        ? 'border-emerald-500 bg-emerald-500/15 text-white shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                        : 'border-white/10 bg-white/5 text-neutral-400 hover:text-white'
                    }`}
                  >
                    <QrCode className="h-4 w-4 shrink-0 text-emerald-400" />
                    <span className="truncate w-full text-center">Pix Instantâneo</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`flex flex-col items-center justify-center gap-1 sm:gap-1.5 rounded-xl border p-2 sm:p-3 text-[11px] sm:text-xs font-semibold transition-all min-h-[58px] sm:min-h-[64px] touch-manipulation ${
                      paymentMethod === 'card'
                        ? 'border-amber-500 bg-amber-500/15 text-white shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                        : 'border-white/10 bg-white/5 text-neutral-400 hover:text-white'
                    }`}
                  >
                    <CreditCard className="h-4 w-4 shrink-0 text-amber-400" />
                    <span className="truncate w-full text-center">Cartão 12x</span>
                  </button>
                </div>
              </div>

              {/* Resumo do Pedido e Garantia */}
              <div className="rounded-xl border border-white/5 bg-black/40 p-3.5 sm:p-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-neutral-400">Total a Pagar:</span>
                  <span className="text-lg sm:text-xl font-black text-white">
                    {formatCurrencyBRL(currentPlan.price)}
                  </span>
                </div>
                <div className="mt-2 flex items-start sm:items-center gap-1.5 text-[0.68rem] sm:text-[0.7rem] text-neutral-400 leading-relaxed">
                  <Lock className="h-3.5 w-3.5 shrink-0 text-emerald-400 mt-0.5 sm:mt-0" />
                  <span>Criptografia ponta a ponta SSL 256 bits e garantia incondicional de 7 dias.</span>
                </div>
              </div>

              {errorMessage && (
                <p className="text-xs text-red-400 bg-red-950/40 border border-red-500/30 rounded-xl p-3">
                  {errorMessage}
                </p>
              )}

              {/* Botão de Finalização Touch-First */}
              <Button
                type="submit"
                variant="fired"
                size="lg"
                isLoading={isLoading}
                className="w-full gap-2 text-xs sm:text-sm uppercase tracking-wider min-h-[48px] touch-manipulation font-bold shadow-xl"
              >
                <span>Finalizar Pagamento Seguro</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>
          )}
        </GlassCard>
      </div>
    </div>
  );
}
