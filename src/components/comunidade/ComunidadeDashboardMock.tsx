'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  Crown,
  PlayCircle,
  BookOpen,
  Calendar,
  Users,
  Flame,
  ArrowRight,
  Shield,
  Zap,
  Radio,
  ExternalLink,
  Lock,
} from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { CommunityFeed } from '@/components/comunidade/CommunityFeed';
import { MemberCard, type MemberProfile } from '@/components/comunidade/MemberCard';
import { CheckoutModal } from '@/components/comunidade/CheckoutModal';

export default function ComunidadeDashboard() {
  const router = useRouter();
  const [member, setMember] = useState<MemberProfile | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedPlanSlug, setSelectedPlanSlug] = useState('membership-vip');

  useEffect(() => {
    async function loadSession() {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated && data.member) {
            setMember(data.member);
          }
        }
      } catch (err) {
        console.warn('Sessão offline ou não autenticado.');
      } finally {
        setIsLoadingAuth(false);
      }
    }
    loadSession();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/me', { method: 'DELETE' });
      setMember(null);
      router.push('/comunidade/login');
    } catch (e) {
      console.error(e);
    }
  };

  const handleOpenUpgrade = (planSlug: string = 'membership-vip') => {
    setSelectedPlanSlug(planSlug);
    setIsCheckoutOpen(true);
  };

  const learningTracks = [
    {
      id: 't1',
      title: 'Pipeline de Vídeo Cinemático com Kling AI & Midjourney v6',
      lessonsCount: 14,
      duration: '4h 30m',
      level: 'Avançado',
      badge: 'NOVA',
      href: '/comunidade/midias',
    },
    {
      id: 't2',
      title: 'Engenharia de Shaders WebGL com Three.js e OGL a 60 FPS',
      lessonsCount: 18,
      duration: '6h 15m',
      level: 'Especialista',
      badge: 'DESTAQUE',
      href: '/comunidade/midias',
    },
    {
      id: 't3',
      title: 'Branding Software Soberano & Arquitetura Next.js 15',
      lessonsCount: 12,
      duration: '3h 45m',
      level: 'Intermediário',
      badge: 'ESSENCIAL',
      href: '/comunidade/midias',
    },
  ];

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Top Banner de Boas-Vindas */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-red-950/30 via-neutral-900/50 to-black p-6 md:p-8 backdrop-blur-xl">
        <div className="pointer-events-none absolute right-0 top-0 h-64 w-64 rounded-full bg-red-600/15 blur-[100px]" />

        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <Badge variant="red" dot>
                Área de Membros & Comunidade Fechada
              </Badge>
              <span className="flex items-center gap-1 text-[0.7rem] font-bold text-emerald-400">
                <Radio className="h-3 w-3 animate-pulse" />
                128 Membros Ativos Agora
              </span>
            </div>

            <h1 className="text-2xl md:text-4xl font-black text-white tracking-tight">
              Olá, {member ? member.name.split(' ')[0] : 'Visionário'} — Bem-vindo ao Santuário Soberano
            </h1>

            <p className="text-xs md:text-sm text-neutral-300 leading-relaxed">
              Explore masterclasses exclusivas em 4K, compartilhe prompts avançados com a rede e
              eleve seu padrão de branding audiovisual com software.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link href="/comunidade/midias">
              <Button variant="fired" size="md" className="gap-2">
                <PlayCircle className="h-4 w-4" />
                <span>Assistir Masterclasses 4K</span>
              </Button>
            </Link>

            {(!member || member.tier !== 'vip') && (
              <Button
                onClick={() => handleOpenUpgrade('membership-vip')}
                variant="glass"
                size="md"
                className="gap-2 border-red-500/30 text-red-300 hover:border-red-500/60"
              >
                <Crown className="h-4 w-4 text-amber-400" />
                <span>Upgrade VIP Soberano</span>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid: Feed on Left (2 cols), Sidebar on Right (1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Community Feed & Announcements (Col Span 2) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Comunicado Oficial em Destaque */}
          <GlassCard className="border-red-500/30 bg-gradient-to-r from-red-950/20 to-black p-5 md:p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-600/20 text-red-400">
                  <Flame className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">
                    Masterclass Semanal ao Vivo com Mateus Celestino
                  </h3>
                  <p className="text-xs text-neutral-400">
                    Nesta quinta-feira às 20h00 — "Da Iluminação Anamórfica ao Código WebGL"
                  </p>
                </div>
              </div>
              <Badge variant="red" className="text-[0.65rem]">
                AO VIVO
              </Badge>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3 text-xs">
              <span className="text-neutral-400">
                Acesso exclusivo para membros <strong className="text-red-400">VIP & PRO</strong>
              </span>
              <Link
                href="/comunidade/midias"
                className="flex items-center gap-1 font-semibold text-white hover:text-red-400 transition-colors"
              >
                <span>Acessar Sala de Transmissão</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </GlassCard>

          {/* Feed Interativo de Postagens e Prompts */}
          <div>
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-red-400" />
                <h2 className="text-lg font-bold text-white tracking-tight">
                  Discussões & Compartilhamento de Prompts
                </h2>
              </div>
              <span className="text-xs text-neutral-400">Atualizado em tempo real</span>
            </div>

            <CommunityFeed />
          </div>
        </div>

        {/* Right Column: Member Card, Learning Paths, Quick Links (Col Span 1) */}
        <div className="space-y-6">
          {/* Card de Identidade do Membro */}
          <MemberCard
            member={member}
            onUpgradeClick={() => handleOpenUpgrade('membership-vip')}
            onLogoutClick={handleLogout}
          />

          {/* Trilhas de Aprendizagem */}
          <GlassCard className="p-5 md:p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white">Trilhas de Aprendizagem</h3>
              </div>
              <Link
                href="/comunidade/midias"
                className="text-[0.7rem] font-semibold text-red-400 hover:underline"
              >
                Ver todas
              </Link>
            </div>

            <div className="space-y-3">
              {learningTracks.map((track) => (
                <Link
                  key={track.id}
                  href={track.href}
                  className="block group rounded-xl border border-white/5 bg-white/[0.02] p-3.5 transition-all hover:border-red-500/30 hover:bg-white/[0.04]"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white group-hover:text-red-400 transition-colors">
                      {track.title}
                    </span>
                    <Badge variant="red" className="text-[0.6rem] px-1.5 py-0">
                      {track.badge}
                    </Badge>
                  </div>
                  <div className="mt-2 flex items-center gap-3 text-[0.68rem] text-neutral-400">
                    <span>{track.lessonsCount} aulas</span>
                    <span>•</span>
                    <span>{track.duration}</span>
                    <span>•</span>
                    <span className="text-neutral-300">{track.level}</span>
                  </div>
                </Link>
              ))}
            </div>
          </GlassCard>

          {/* Atalhos para Outros Módulos da Plataforma Unificada */}
          <GlassCard className="p-5 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
              Ecossistemas Conectados
            </h4>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <Link
                href="/builder"
                className="flex items-center gap-2 rounded-xl border border-white/5 bg-white/[0.02] p-3 text-neutral-300 hover:border-white/15 hover:text-white transition-all"
              >
                <Zap className="h-4 w-4 text-red-400" />
                <span>Form Builder</span>
              </Link>

              <Link
                href="/biblioteca"
                className="flex items-center gap-2 rounded-xl border border-white/5 bg-white/[0.02] p-3 text-neutral-300 hover:border-white/15 hover:text-white transition-all"
              >
                <BookOpen className="h-4 w-4 text-purple-400" />
                <span>Biblioteca</span>
              </Link>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Modal Integrado de Checkout */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        defaultPlanSlug={selectedPlanSlug}
        memberEmail={member?.email || ''}
        memberName={member?.name || ''}
        onPaymentSuccess={(plan) => {
          setMember((prev) =>
            prev
              ? { ...prev, tier: plan.tier }
              : {
                  id: 'mcp-new-member',
                  name: 'Membro Soberano',
                  email: 'membro@mateuscelestinopro.com',
                  tier: plan.tier,
                }
          );
        }}
      />
    </div>
  );
}
