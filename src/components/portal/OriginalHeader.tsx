'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  MessageSquare,
  ArrowDown,
  Compass,
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
      onNavigate('sobre');
    } else {
      const el = document.getElementById('sobre');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const whatsappUrl =
    profile?.whatsapp || '/contato';

  return (
    <header
      id="home"
      className="relative w-full overflow-hidden bg-transparent flex flex-col justify-center items-center"
    >
      {/* =========================================================================
          CINEMATIC FULL-WIDTH COVER HERO — ESCALA MONUMENTAL & ENQUADRAMENTO CINEMÁTICO 100VH
          ========================================================================= */}
      <div className="relative w-full min-h-[calc(100vh-5rem)] lg:min-h-[calc(100vh-5rem)] flex flex-col justify-center items-center text-center pt-2 sm:pt-4 md:pt-6 lg:pt-8 pb-8 sm:pb-10 md:pb-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
        
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

        {/* NÚCLEO CENTRAL DO HERO — MINIMALISTA, ESPAÇADO & CINEMATOGRÁFICO */}
        <div className="relative z-10 max-w-4xl lg:max-w-5xl mx-auto flex flex-col items-center justify-center w-full px-2 sm:px-4">
          
          {/* TAGLINE SUPERIOR / EYEBROW */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-950/60 border border-red-500/30 text-[10px] sm:text-xs font-mono text-red-400 font-semibold tracking-widest uppercase mb-5 sm:mb-7 shadow-[0_0_20px_rgba(255,7,58,0.2)] touch-manipulation">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff073a] animate-pulse shrink-0" />
            <span className="truncate">Digital Marketing • Generative A.I. • Systems</span>
          </div>

          {/* Ícone de Vidro Lapidado Monumental com Halo Sangue Obscurecido */}
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-3xl p-1.5 sm:p-2 glass-crystal shadow-[0_20px_50px_rgba(0,0,0,0.98),0_0_35px_rgba(138,0,18,0.4)] shrink-0 group mb-5 sm:mb-7 transition-transform duration-500 hover:scale-105 active:scale-95 touch-manipulation">
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
          <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.08] drop-shadow-[0_25px_45px_rgba(0,0,0,0.95)] mb-4 sm:mb-6 max-w-full break-words">
            <span className="sr-only">MATEUS CELESTINO PRO X</span>
            <span className="inline-block">MATEUS CELESTINO</span>{' '}
            <span className="text-[#ff073a] inline-block">PRO X</span>
          </h1>

          {/* Subtítulo Especialista Organizado em Badges Líquidos e Responsivos */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs sm:text-sm font-mono text-zinc-300 max-w-full mx-auto mb-5 sm:mb-7 px-1">
            <span className="px-3 py-1 rounded-xl bg-black/60 border border-white/10 text-white font-medium whitespace-nowrap">
              A.I. Infrastructure
            </span>
            <span className="text-[#ff073a] hidden xs:inline">•</span>
            <span className="px-3 py-1 rounded-xl bg-black/60 border border-white/10 text-zinc-200 font-medium whitespace-nowrap">
              Agentic Workers
            </span>
            <span className="text-[#ff073a] hidden xs:inline">•</span>
            <span className="px-3 py-1 rounded-xl bg-red-950/60 border border-red-500/30 text-red-300 font-semibold shadow-[0_0_15px_rgba(255,7,58,0.2)] whitespace-nowrap">
              Smart Software Business
            </span>
          </div>

          {/* Descrição Aesthetic e Minimalista com Espaçamento Amplo */}
          <div className="max-w-2xl mx-auto mb-6 sm:mb-8 text-center space-y-3 px-4">
            <p className="text-sm sm:text-base md:text-lg text-zinc-300 font-light leading-relaxed tracking-wide">
              Ecossistema de Inteligência Artificial aplicada, engenharia de sistemas e esteiras de automação de alta escala para operações digitais de elite.
            </p>
            <div className="flex items-center justify-center pt-1">
              <button
                type="button"
                onClick={() => setIsSitemapOpen(true)}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-red-500/40 text-[11px] sm:text-xs font-mono text-zinc-400 hover:text-white transition-all duration-300 cursor-pointer touch-manipulation active:scale-95"
                title="Abrir Mapa Visual da Plataforma"
                aria-label="Abrir SiteMap do Portal"
              >
                <Compass className="w-3.5 h-3.5 text-[#ff073a]" />
                <span>Explorar Mapa da Plataforma</span>
              </button>
            </div>
          </div>

          {/* Ação Primária Soberana do Hero — CTA Único e Monumental */}
          <div className="flex items-center justify-center w-full max-w-md mx-auto mb-6 sm:mb-8 px-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-button-fired w-full sm:w-auto min-h-[48px] px-8 sm:px-10 py-3.5 sm:py-3 rounded-2xl text-xs sm:text-sm font-mono font-bold tracking-wider text-white flex items-center justify-center gap-2.5 shadow-[0_0_35px_rgba(255,7,58,0.55)] hover:shadow-[0_0_50px_rgba(255,7,58,0.75)] hover:scale-105 active:scale-95 transition-all touch-manipulation cursor-pointer"
              title="Abrir WhatsApp oficial"
              aria-label="VAMOS AUTOMATIZAR ?!"
            >
              <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 fill-white/20 shrink-0" />
              <span>VAMOS AUTOMATIZAR ?!</span>
            </a>
          </div>

          {/* Indicador de Navegação Inferior para Sobre */}
          <button
            onClick={handleExplore}
            className="mt-5 sm:mt-7 inline-flex flex-col items-center justify-center gap-1 text-zinc-400 hover:text-white transition-colors cursor-pointer group touch-manipulation"
            title="Rolar para sobre o autor"
            aria-label="Rolar para sobre o autor"
          >
            <span className="text-[9px] sm:text-[10px] font-mono tracking-widest uppercase text-zinc-400 group-hover:text-[#ff073a] transition-colors">
              SOBRE O AUTOR
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
      <div className="absolute bottom-0 left-0 right-0 h-28 sm:h-36 lg:h-44 pointer-events-none z-10 flex flex-col justify-end">
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
