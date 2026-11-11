'use client';

import React, { useState } from 'react';
import {
  Crown,
  ShieldCheck,
  Sparkles,
  Copy,
  Check,
  LogOut,
  Zap,
  TrendingUp,
  Award,
} from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

export interface MemberProfile {
  id: string;
  name: string;
  email: string;
  role?: string;
  tier: 'free' | 'pro' | 'vip';
  status?: string;
  createdAt?: string;
}

export interface MemberCardProps {
  member?: MemberProfile | null;
  onUpgradeClick?: () => void;
  onLogoutClick?: () => void;
  className?: string;
}

export function MemberCard({
  member,
  onUpgradeClick,
  onLogoutClick,
  className,
}: MemberCardProps) {
  const [copied, setCopied] = useState(false);

  // Perfil padrão caso o usuário esteja navegando em modo visitante / preview
  const currentMember: MemberProfile = member || {
    id: '',
    name: 'Visitante',
    email: 'membro@mateuscelestinopro.com',
    tier: 'free',
    role: 'Membro',
    status: 'active',
    createdAt: new Date().toISOString().split('T')[0],
  };

  const copyMemberId = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(currentMember.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const tierBadgeMap = {
    free: { label: 'Membro Gratuito', variant: 'outline' as const, glow: 'white' as const },
    pro: { label: 'Membro PRO', variant: 'gold' as const, glow: 'gold' as const },
    vip: { label: 'VIP SOBERANO', variant: 'red' as const, glow: 'red' as const },
  };

  const tierInfo = tierBadgeMap[currentMember.tier] || tierBadgeMap.free;

  return (
    <GlassCard
      variant="crystal"
      glow={currentMember.tier === 'vip'}
      glowColor="red"
      className={cn('relative overflow-hidden p-4 sm:p-6 w-full max-w-full', className)}
    >
      {/* Background Holographic Glow */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-red-600/15 blur-3xl" />
      <div className="pointer-events-none absolute -left-16 -bottom-16 h-40 w-40 rounded-full bg-amber-500/10 blur-3xl" />

      {/* Top Identity Header */}
      <div className="relative flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="relative flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-gradient-to-br from-neutral-800 to-black text-lg sm:text-xl font-black text-white shadow-xl">
            {currentMember.name.charAt(0)}
            {currentMember.tier === 'vip' && (
              <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[11px] font-black text-white shadow-[0_0_12px_#ff073a]">
                <Crown className="h-3 w-3" />
              </span>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h4 className="text-sm sm:text-base font-bold text-white tracking-tight truncate">{currentMember.name}</h4>
            </div>
            <p className="text-xs text-neutral-400 font-mono truncate max-w-full">
              {currentMember.email}
            </p>
            <div className="mt-1 flex items-center gap-1.5">
              <Badge variant={tierInfo.variant} dot={currentMember.tier === 'vip'} className="text-[0.65rem] px-2 py-0">
                {tierInfo.label}
              </Badge>
            </div>
          </div>
        </div>

        {onLogoutClick && (
          <button
            onClick={onLogoutClick}
            className="flex h-10 w-10 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-neutral-400 transition-all hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-400 touch-manipulation"
            title="Sair da Conta"
            aria-label="Sair da Conta"
          >
            <LogOut className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Member ID and Verification */}
      <div className="mt-4 flex items-center justify-between gap-2 rounded-xl border border-white/5 bg-black/40 px-3 sm:px-3.5 py-2">
        <div className="flex items-center gap-1.5 min-w-0 flex-1">
          <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
          <span className="text-[0.7rem] font-mono text-neutral-400 truncate">
            ID: {currentMember.id}
          </span>
        </div>
        <button
          onClick={copyMemberId}
          className="flex items-center gap-1 text-[0.68rem] text-neutral-400 hover:text-white transition-all shrink-0 py-1 px-2 rounded-lg hover:bg-white/5 min-h-[32px] touch-manipulation"
          aria-label="Copiar ID do membro"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3 text-emerald-400" />
              <span className="text-emerald-400 font-semibold">Copiado</span>
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" />
              <span>Copiar</span>
            </>
          )}
        </button>
      </div>

      {/* Member Stats Grid */}
      <div className="mt-4 grid grid-cols-3 gap-1.5 sm:gap-2">
        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-2 sm:p-2.5 text-center">
          <div className="flex items-center justify-center gap-1 text-red-400">
            <Zap className="h-3 w-3" />
            <span className="text-xs font-bold text-white">40+</span>
          </div>
          <span className="text-[0.62rem] sm:text-[0.65rem] text-neutral-400 block truncate">Prompts VIP</span>
        </div>

        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-2 sm:p-2.5 text-center">
          <div className="flex items-center justify-center gap-1 text-amber-400">
            <TrendingUp className="h-3 w-3" />
            <span className="text-xs font-bold text-white">100%</span>
          </div>
          <span className="text-[0.62rem] sm:text-[0.65rem] text-neutral-400 block truncate">Mídias 4K</span>
        </div>

        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-2.5 text-center">
          <div className="flex items-center justify-center gap-1 text-emerald-400">
            <ShieldCheck className="h-3 w-3" />
            <span className="text-xs font-bold text-white">Ativo</span>
          </div>
          <span className="text-[0.62rem] sm:text-[0.65rem] text-neutral-400 block truncate">Status</span>
        </div>
      </div>

      {/* Upgrade Callout if not VIP */}
      {currentMember.tier !== 'vip' && (
        <div className="mt-4 rounded-xl border border-red-500/30 bg-gradient-to-r from-red-950/40 to-neutral-900/60 p-3 sm:p-3.5">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <Sparkles className="h-4 w-4 shrink-0 text-red-400" />
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">Upgrade para VIP Soberano</p>
                <p className="text-[0.65rem] text-neutral-400 truncate">Acesso ilimitado e mentorias exclusivas.</p>
              </div>
            </div>
            {onUpgradeClick && (
              <Button onClick={onUpgradeClick} variant="fired" size="sm" className="text-xs px-4 min-h-[38px] touch-manipulation w-full sm:w-auto">
                Upgrade
              </Button>
            )}
          </div>
        </div>
      )}
    </GlassCard>
  );
}
