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
    id: 'mcp-demo-vip-001',
    name: 'Mateus Celestino (Preview)',
    email: 'membro@mateuscelestinopro.com',
    tier: 'vip',
    role: 'VIP Member',
    status: 'active',
    createdAt: '2026-10-14',
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
      className={cn('relative overflow-hidden p-6', className)}
    >
      {/* Background Holographic Glow */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-red-600/15 blur-3xl" />
      <div className="pointer-events-none absolute -left-16 -bottom-16 h-40 w-40 rounded-full bg-amber-500/10 blur-3xl" />

      {/* Top Identity Header */}
      <div className="relative flex items-start justify-between">
        <div className="flex items-center gap-3.5">
          <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-white/20 bg-gradient-to-br from-neutral-800 to-black text-xl font-black text-white shadow-xl">
            {currentMember.name.charAt(0)}
            {currentMember.tier === 'vip' && (
              <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[11px] font-black text-white shadow-[0_0_12px_#ff073a]">
                <Crown className="h-3 w-3" />
              </span>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-base font-bold text-white tracking-tight">{currentMember.name}</h4>
            </div>
            <p className="text-xs text-neutral-400 font-mono truncate max-w-[190px]">
              {currentMember.email}
            </p>
            <div className="mt-1 flex items-center gap-1.5">
              <Badge variant={tierInfo.variant} dot={currentMember.tier === 'vip'}>
                {tierInfo.label}
              </Badge>
            </div>
          </div>
        </div>

        {onLogoutClick && (
          <button
            onClick={onLogoutClick}
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-neutral-400 transition-all hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-400"
            title="Sair da Conta"
          >
            <LogOut className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Member ID and Verification */}
      <div className="mt-4 flex items-center justify-between rounded-xl border border-white/5 bg-black/40 px-3.5 py-2">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
          <span className="text-[0.7rem] font-mono text-neutral-400 truncate max-w-[170px]">
            ID: {currentMember.id}
          </span>
        </div>
        <button
          onClick={copyMemberId}
          className="flex items-center gap-1 text-[0.68rem] text-neutral-400 hover:text-white transition-all"
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
      <div className="mt-4 grid grid-cols-3 gap-2">
        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-2.5 text-center">
          <div className="flex items-center justify-center gap-1 text-red-400">
            <Zap className="h-3 w-3" />
            <span className="text-xs font-bold text-white">40+</span>
          </div>
          <span className="text-[0.65rem] text-neutral-400">Prompts VIP</span>
        </div>

        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-2.5 text-center">
          <div className="flex items-center justify-center gap-1 text-amber-400">
            <TrendingUp className="h-3 w-3" />
            <span className="text-xs font-bold text-white">100%</span>
          </div>
          <span className="text-[0.65rem] text-neutral-400">Mídias 4K</span>
        </div>

        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-2.5 text-center">
          <div className="flex items-center justify-center gap-1 text-purple-400">
            <Award className="h-3 w-3" />
            <span className="text-xs font-bold text-white">Nível 8</span>
          </div>
          <span className="text-[0.65rem] text-neutral-400">Reputação</span>
        </div>
      </div>

      {/* Upgrade Callout if not VIP */}
      {currentMember.tier !== 'vip' && (
        <div className="mt-4 rounded-xl border border-red-500/30 bg-gradient-to-r from-red-950/40 to-neutral-900/60 p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-red-400" />
              <div>
                <p className="text-xs font-bold text-white">Upgrade para VIP Soberano</p>
                <p className="text-[0.65rem] text-neutral-400">Acesso ilimitado e mentorias exclusivas.</p>
              </div>
            </div>
            {onUpgradeClick && (
              <Button onClick={onUpgradeClick} variant="fired" size="sm" className="text-xs px-3">
                Upgrade
              </Button>
            )}
          </div>
        </div>
      )}
    </GlassCard>
  );
}
