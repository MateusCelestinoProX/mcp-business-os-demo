'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  MessageSquare,
  BookOpen,
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
          CINEMATIC FULL-WIDTH COVER HERO — ADAPTAÇÃO MOBILE-FIRST ULTRA-RÁPIDA
          ========================================================================= */}
      <div className="relative w-full min-h-[calc(100svh-4rem)] lg:min-h-[calc(100vh-8.5rem)] flex flex-col justify-center items-center text-center pt-4 sm:pt-6 md:pt-8 pb-10 sm:pb-14 px-4 sm:px-6 lg:px-8 overflow-hidden">
        
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

        {/* NÚCLEO CENTRAL DO HERO — PERFEITAMENTE CENTRALIZADO E ENQUADRADO NA TELA DO SMARTPHONE */}
        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center justify-center w-full">
          
          {/* TAGLINE SUPERIOR / EYEBROW */}
          <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1 rounded-full bg-red-950/70 border border-red-500/40 text-[10px] sm:text-xs font-mono text-red-400 font-bold tracking-widest uppercase mb-3 sm:mb-4 shadow-[0_0_25px_rgba(255,7,58,0.25)] touch-manipulation">
            <span className="w-2 h-2 rounded-full bg-[#ff073a] animate-pulse shrink-0" />
            <span className="truncate">Digital Marketing, Generative A.I, Sales.</span>
          </div>

          {/* Ícone de Vidro Lapidado com Halo Sangue Obscurecido */}
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-2xl sm:rounded-3xl p-1.5 sm:p-2 glass-crystal shadow-[0_20px_50px_rgba(0,0,0,0.95),0_0_30px_rgba(138,0,18,0.4)] shrink-0 group mb-3 sm:mb-4 transition-transform duration-500 hover:scale-105 active:scale-95 touch-manipulation">
            <div className="w-full h-full rounded-xl sm:rounded-2xl overflow-hidden bg-black border border-white/20 flex items-center justify-center">
              <img
                src={profile?.siteIcon || '/assets/site_icon.webp'}
                alt="Mateus Celestino Pro X Ícone Oficial"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#9e0015] shadow-[0_0_12px_#9e0015] animate-pulse border-2 border-black" />
          </div>

          {/* Título Monumental Soberano — Escala Fluida Sem Quebras Estranhas no Celular */}
          <h1 className="text-2xl xs:text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.12] drop-shadow-[0_20px_35px_rgba(0,0,0,0.9)] mb-2.5 sm:mb-3 max-w-full">
            <span className="inline-block">MATEUS CELESTINO</span>{' '}
            <span className="text-[#ff073a] inline-block">PRO X</span>
          </h1>

          {/* Subtítulo Especialista Organizado em Badges Líquidos e Responsivos */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs md:text-sm font-mono text-zinc-300 max-w-full mx-auto mb-3.5 sm:mb-4 px-1">
            <span className="px-2 py-0.5 rounded-lg bg-black/40 border border-white/10 text-white font-semibold whitespace-nowrap">
              A.I. Infrastructure
            </span>
            <span className="text-[#ff073a] hidden xs:inline">•</span>
            <span className="px-2 py-0.5 rounded-lg bg-black/40 border border-white/10 text-zinc-200 font-medium whitespace-nowrap">
              Agentic Workers
            </span>
            <span className="text-[#ff073a] hidden xs:inline">•</span>
            <span className="px-2 py-0.5 rounded-lg bg-black/40 border border-white/10 text-zinc-300 font-medium whitespace-nowrap">
              A.I. Systems
            </span>
            <span className="text-[#ff073a] hidden sm:inline">•</span>
            <span className="px-2.5 py-0.5 rounded-lg bg-red-950/50 border border-red-500/30 text-red-300 font-semibold shadow-[0_0_12px_rgba(255,7,58,0.2)] text-center">
              Sob Demanda • Smart Software Business
            </span>
          </div>

          {/* Descrição com Botão Sutil para o SiteMap Touch-Friendly */}
          <div className="text-xs sm:text-sm md:text-base text-zinc-300 font-light leading-relaxed max-w-2xl mx-auto mb-5 sm:mb-6 space-y-1 sm:space-y-1.5 px-2">
            <p>
              Esse é Mateus Celestino PRO X, o portal de Inteligência Artificial aplicada a Business e Marketing digital de forma completa.
            </p>
            <p className="hidden xs:block">
              Inteligência artificial aplicada, esteiras de automação e conteúdo de alto valor técnico você encontra exatamente aqui.
            </p>
            <div className="flex items-center justify-center flex-wrap gap-1 text-zinc-200 pt-1">
              <span>Use o SiteMap (</span>
              <button
                type="button"
                onClick={() => setIsSitemapOpen(true)}
                className="inline-flex items-center gap-1.5 min-h-[44px] px-3 py-1 rounded-xl bg-red-950/70 border border-red-500/50 text-[#ff073a] hover:text-white hover:bg-[#ff073a]/30 font-mono font-bold text-xs transition-all duration-200 shadow-[0_0_15px_rgba(255,7,58,0.3)] hover:scale-105 active:scale-95 cursor-pointer touch-manipulation align-middle"
                title="Abrir Fluxograma Visual do SiteMap"
                aria-label="Abrir SiteMap do Portal"
              >
                <Compass className="w-3.5 h-3.5 text-[#ff073a]" />
                <span>clicando aqui</span>
              </button>
              <span>) e navegue pelo portal de forma intuitiva.</span>
            </div>
          </div>

          {/* Ações Primárias do Hero Centralizadas & Mobile-First (Alvos de Toque ≥ 48px) */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-md sm:max-w-xl mx-auto px-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-button-fired w-full sm:w-auto min-h-[50px] px-6 py-3.5 rounded-2xl text-xs sm:text-sm font-mono font-bold tracking-wide text-white flex items-center justify-center gap-2.5 shadow-[0_0_35px_rgba(255,7,58,0.55)] active:scale-95 transition-all touch-manipulation cursor-pointer"
              title="Abrir WhatsApp oficial"
            >
              <MessageSquare className="w-4 h-4 fill-white/20 shrink-0" />
              <span>QUERO AUTOMATIZAR TUDO</span>
            </a>

            <button
              onClick={handleExplore}
              className="glass-interactive w-full sm:w-auto min-h-[50px] px-5 py-3.5 rounded-2xl text-xs sm:text-sm font-mono font-bold text-zinc-200 hover:text-white flex items-center justify-center gap-2 border border-white/15 hover:border-[#ff073a]/50 active:scale-95 transition-all touch-manipulation cursor-pointer"
              aria-label="Explorar 176 Guias Técnicos"
            >
              <BookOpen className="w-4 h-4 text-[#ff073a] shrink-0" />
              <span>EXPLORAR GUIAS TÉCNICOS (176)</span>
            </button>
          </div>

          {/* Indicador de Navegação Inferior para o Acervo */}
          <button
            onClick={handleExplore}
            className="mt-6 sm:mt-8 min-h-[44px] inline-flex flex-col items-center justify-center gap-1 text-zinc-400 hover:text-white transition-colors cursor-pointer group touch-manipulation"
            title="Rolar para os artigos"
            aria-label="Rolar para o acervo de publicações"
          >
            <span className="text-[10px] font-mono tracking-widest uppercase text-zinc-300 group-hover:text-[#ff073a] transition-colors">
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

      {/* Zona Suave de Fade Inferior do Cover */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#0c0003]/80 to-transparent pointer-events-none z-10" />
    </header>
  );
}

export default OriginalHeader;
