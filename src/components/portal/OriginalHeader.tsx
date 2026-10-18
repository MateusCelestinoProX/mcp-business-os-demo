'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  MessageSquare,
  BookOpen,
  ArrowDown,
  Compass,
  Sparkles,
} from 'lucide-react';
import AlternatingHeroShaders from './AlternatingHeroShaders';
import UniversalSitemapModal from './UniversalSitemapModal';

export interface ProfileData {
  title?: string;
  greeting?: string;
  headline?: string;
  welcomeMessage?: string;
  heroGif?: string;
  heroCover?: string;
  siteIcon?: string;
  mateusAvatar?: string;
  mateusProfile?: string;
  whatsapp?: string;
  whatsappNumber?: string;
  email?: string;
  linkedin?: string;
  instagram?: string;
  tallyForm?: string;
}

export interface OriginalHeaderProps {
  profile?: ProfileData;
  onNavigate?: (tabId: string) => void;
}

export function OriginalHeader({ profile, onNavigate }: OriginalHeaderProps) {
  const [isSitemapOpen, setIsSitemapOpen] = useState(false);

  const handleExplore = () => {
    if (onNavigate) {
      onNavigate('publicacoes');
    } else {
      const el = document.getElementById('publicacoes');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const whatsappUrl =
    profile?.whatsapp ||
    'https://api.whatsapp.com/send/?phone=553197724257&text=QUERO+AUTOMATIZAR+TUDO.&type=phone_number&app_absent=0';

  return (
    <header
      id="home"
      className="relative w-full overflow-hidden bg-transparent flex flex-col justify-center items-center"
    >
      {/* =========================================================================
          CINEMATIC FULL-WIDTH COVER HERO — ESCALA MONUMENTAL & ENQUADRAMENTO CINEMÁTICO 100VH
          ========================================================================= */}
      <div className="relative w-full min-h-[calc(100vh-5rem)] lg:min-h-[calc(100vh-5rem)] flex flex-col justify-center items-center text-center pt-2 sm:pt-4 md:pt-6 lg:pt-8 pb-10 sm:pb-14 md:pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        
        {/* Imagem de Fundo Full-Width + SHADER DINÂMICO ESTÁVEL DE ALTA PERFORMANCE */}
        <div className="absolute inset-0 z-0">
          <img
            src={profile?.heroGif || '/assets/hero_landscape.gif'}
            alt="Mateus Celestino Pro X Cover Cyberpunk"
            className="w-full h-full object-cover object-[center_40%] scale-[1.02] transform filter brightness-[0.62] contrast-[1.2]"
            loading="eager"
          />
          {/* Suíte com Shaders Adaptados ao Vermelho Carmesim com Estabilidade Total */}
          <AlternatingHeroShaders />
        </div>

        {/* NÚCLEO CENTRAL DO HERO — PERFEITAMENTE CENTRALIZADO COM ESCALA IMPONENTE */}
        <div className="relative z-10 max-w-5xl lg:max-w-6xl mx-auto flex flex-col items-center justify-center w-full">
          
          {/* TAGLINE SUPERIOR / EYEBROW */}
          <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1 rounded-full bg-red-950/70 border border-red-500/40 text-[10px] sm:text-xs font-mono text-red-400 font-bold tracking-widest uppercase mb-3 sm:mb-4 shadow-[0_0_25px_rgba(255,7,58,0.25)] touch-manipulation">
            <span className="w-2 h-2 rounded-full bg-[#ff073a] animate-pulse shrink-0" />
            <span className="truncate">Digital Marketing, Generative A.I, Sales.</span>
          </div>

          {/* Ícone de Vidro Lapidado Monumental com Halo Sangue Obscurecido */}
          <div className="relative w-20 h-20 sm:w-26 sm:h-26 md:w-30 md:h-30 rounded-3xl p-1.5 sm:p-2 glass-crystal shadow-[0_20px_50px_rgba(0,0,0,0.98),0_0_35px_rgba(138,0,18,0.45)] shrink-0 group mb-3 sm:mb-4 transition-transform duration-500 hover:scale-105 active:scale-95 touch-manipulation">
            <div className="w-full h-full rounded-2xl overflow-hidden bg-black border border-white/20 flex items-center justify-center">
              <img
                src={profile?.siteIcon || '/assets/site_icon.webp'}
                alt="Mateus Celestino Pro X Ícone Oficial"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#9e0015] shadow-[0_0_15px_#9e0015] animate-pulse border-2 border-black" />
          </div>

          {/* Título Monumental Soberano — Escala Cinematográfica Imponente */}
          <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tight text-white leading-[1.08] drop-shadow-[0_25px_45px_rgba(0,0,0,0.95)] mb-2.5 sm:mb-3.5 max-w-full break-words">
            <span className="sr-only">MATEUS CELESTINO PRO X</span>
            <span className="inline-block">MATEUS CELESTINO</span>{' '}
            <span className="text-[#ff073a] inline-block">PRO X</span>
          </h1>

          {/* Subtítulo Especialista Organizado em Badges Líquidos e Responsivos */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs md:text-sm font-mono text-zinc-300 max-w-full mx-auto mb-3.5 sm:mb-4 px-1">
            <span className="px-2.5 py-0.5 rounded-lg bg-black/50 border border-white/10 text-white font-semibold whitespace-nowrap">
              A.I. Infrastructure
            </span>
            <span className="text-[#ff073a] hidden xs:inline">•</span>
            <span className="px-2.5 py-0.5 rounded-lg bg-black/50 border border-white/10 text-zinc-200 font-medium whitespace-nowrap">
              Agentic Workers
            </span>
            <span className="text-[#ff073a] hidden xs:inline">•</span>
            <span className="px-2.5 py-0.5 rounded-lg bg-black/50 border border-white/10 text-zinc-300 font-medium whitespace-nowrap">
              A.I. Systems
            </span>
            <span className="text-[#ff073a] hidden sm:inline">•</span>
            <span className="px-3 py-0.5 rounded-lg bg-red-950/60 border border-red-500/30 text-red-300 font-semibold shadow-[0_0_15px_rgba(255,7,58,0.2)] text-center">
              Sob Demanda • Smart Software Business
            </span>
          </div>

          {/* Descrição com Botão Sutil para o SiteMap Touch-Friendly */}
          <div className="text-xs sm:text-sm md:text-base text-zinc-300 font-light leading-relaxed max-w-2xl sm:max-w-3xl mx-auto mb-4 sm:mb-6 space-y-0.5 sm:space-y-1 px-2">
            <p>
              Esse é Mateus Celestino PRO X, o portal de Inteligência Artificial aplicada a Business e Marketing digital de forma completa.
            </p>
            <p className="hidden xs:block text-zinc-400">
              Inteligência artificial aplicada, esteiras de automação e conteúdo de alto valor técnico você encontra exatamente aqui.
            </p>
            <div className="flex items-center justify-center flex-wrap gap-1 text-zinc-300 pt-0.5">
              <span>Use o SiteMap (</span>
              <button
                type="button"
                onClick={() => setIsSitemapOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-red-950/80 border border-red-500/50 text-[#ff073a] hover:text-white hover:bg-[#ff073a]/30 font-mono font-bold text-xs transition-all duration-200 shadow-[0_0_12px_rgba(255,7,58,0.3)] hover:scale-105 active:scale-95 cursor-pointer touch-manipulation align-baseline mx-0.5 min-h-[32px]"
                title="Abrir Fluxograma Visual do SiteMap"
                aria-label="Abrir SiteMap do Portal"
              >
                <Compass className="w-3.5 h-3.5 text-[#ff073a]" />
                <span>clicando aqui</span>
              </button>
              <span>) e navegue pelo portal de forma intuitiva.</span>
            </div>
          </div>

          {/* Ações Primárias do Hero Centralizadas — Mobile First (Fitts' Law: Target >= 44px) */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-3 w-full max-w-2xl mx-auto px-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-button-fired w-full sm:w-auto min-h-[44px] px-5 sm:px-6 py-3 sm:py-2.5 rounded-xl text-xs sm:text-xs font-mono font-bold tracking-wide text-white flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(255,7,58,0.45)] active:scale-95 transition-all touch-manipulation cursor-pointer"
              title="Abrir WhatsApp oficial"
              aria-label="VAMOS AUTOMATIZAR ?!"
            >
              <MessageSquare className="w-4 h-4 fill-white/20 shrink-0" />
              <span>VAMOS AUTOMATIZAR ?!</span>
            </a>

            <button
              onClick={handleExplore}
              className="glass-interactive w-full sm:w-auto min-h-[44px] px-4.5 sm:px-5 py-3 sm:py-2.5 rounded-xl text-xs sm:text-xs font-mono font-bold text-zinc-200 hover:text-white flex items-center justify-center gap-2 border border-white/15 hover:border-[#ff073a]/50 active:scale-95 transition-all touch-manipulation cursor-pointer"
              aria-label="Explorar 176 Guias Técnicos"
            >
              <BookOpen className="w-4 h-4 text-[#ff073a] shrink-0" />
              <span>EXPLORAR GUIAS TÉCNICOS (176)</span>
            </button>

            <Link
              href="/comunidade"
              className="glass-interactive w-full sm:w-auto min-h-[44px] px-4.5 sm:px-5 py-3 sm:py-2.5 rounded-xl text-xs sm:text-xs font-mono font-bold text-amber-300 hover:text-white flex items-center justify-center gap-2 border border-amber-500/20 hover:border-amber-500/50 active:scale-95 transition-all touch-manipulation cursor-pointer"
              title="Acessar Área de Membros / Comunidade"
            >
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span>COMUNIDADE VIP</span>
            </Link>
          </div>

          {/* Indicador de Navegação Inferior para o Acervo */}
          <button
            onClick={handleExplore}
            className="mt-5 sm:mt-7 inline-flex flex-col items-center justify-center gap-1 text-zinc-400 hover:text-white transition-colors cursor-pointer group touch-manipulation"
            title="Rolar para os artigos"
            aria-label="Rolar para o acervo de publicações"
          >
            <span className="text-[9px] sm:text-[10px] font-mono tracking-widest uppercase text-zinc-400 group-hover:text-[#ff073a] transition-colors">
              ACERVO SOBERANO
            </span>
            <ArrowDown className="w-3.5 h-3.5 text-[#ff073a] animate-bounce" />
          </button>

        </div>

      </div>

      {/* Modal / Página Centralizada Universal do Sitemap */}
      <UniversalSitemapModal
        isOpen={isSitemapOpen}
        onClose={() => setIsSitemapOpen(false)}
        onNavigateSection={onNavigate}
      />

      {/* ZONA DE TRANSIÇÃO CINEMÁTICA MULTICAMADAS COM BLUR & SHADOWS NA BASE DO HERO */}
      <div className="absolute bottom-0 left-0 right-0 h-44 sm:h-64 lg:h-80 pointer-events-none z-10 flex flex-col justify-end">
        {/* 1. Halo Óptico Difuso de Luz Carmesim com Blur Suave */}
        <div
          className="absolute inset-x-0 bottom-0 h-36 sm:h-48 mx-auto max-w-4xl opacity-25"
          style={{
            background: 'radial-gradient(ellipse 60% 45% at 50% 100%, #ff073a 0%, rgba(138, 0, 18, 0.4) 40%, transparent 80%)',
            filter: 'blur(45px)',
          }}
        />

        {/* 2. Sombra Volumétrica Profunda de Fusão Progressiva */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#030305] via-[#030305]/80 to-transparent" />
        
        {/* 3. Linha Carmesim de Refração Anamórfica Especular */}
        <div className="relative w-full h-[1px] bg-gradient-to-r from-transparent via-[#ff073a]/40 to-transparent" />
      </div>
    </header>
  );
}

export default OriginalHeader;
