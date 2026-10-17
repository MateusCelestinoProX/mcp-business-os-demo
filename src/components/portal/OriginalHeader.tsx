'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Layers,
  User,
  Mail,
  ShoppingBag,
  MessageSquare,
  Flame,
  Sparkles,
  BookOpen,
  ArrowDown,
  Terminal,
  Zap,
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
          CINEMATIC FULL-WIDTH COVER HERO — CENTRALIZAÇÃO HARMONIOSA E SOBERANA
          ========================================================================= */}
      <div className="relative w-full min-h-[calc(100vh-8.5rem)] flex flex-col justify-center items-center text-center pt-4 sm:pt-6 md:pt-8 pb-8 sm:pb-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
        
        {/* Imagem de Fundo Full-Width + SHADER DINÂMICO ESTÁVEL DE ALTA PERFORMANCE */}
        <div className="absolute inset-0 z-0">
          <img
            src={profile?.heroGif || '/assets/hero_landscape.gif'}
            alt="Mateus Celestino Pro X Cover Cyberpunk"
            className="w-full h-full object-cover object-[center_40%] scale-[1.02] transform filter brightness-[0.62] contrast-[1.2]"
          />
          {/* Suíte com Shaders Adaptados ao Vermelho Carmesim com Estabilidade Total */}
          <AlternatingHeroShaders />
        </div>

        {/* NÚCLEO CENTRAL DO HERO — PERFEITAMENTE CENTRALIZADO E ENQUADRADO NA TELA */}
        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center justify-center">
          
          {/* TAGLINE SUPERIOR / EYEBROW */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-950/60 border border-red-500/40 text-[11px] sm:text-xs font-mono text-red-400 font-bold tracking-widest uppercase mb-4 shadow-[0_0_25px_rgba(255,7,58,0.25)]">
            <span className="w-2 h-2 rounded-full bg-[#ff073a] animate-pulse" />
            <span>Digital Marketing, Generative A.I, Sales.</span>
          </div>

          {/* Ícone de Vidro Lapidado com Halo Sangue Obscurecido */}
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-2xl sm:rounded-3xl p-2 glass-crystal shadow-[0_20px_50px_rgba(0,0,0,0.95),0_0_30px_rgba(138,0,18,0.4)] shrink-0 group mb-4 transition-transform duration-500 hover:scale-105">
            <div className="w-full h-full rounded-xl sm:rounded-2xl overflow-hidden bg-black border border-white/20">
              <img
                src={profile?.siteIcon || '/assets/site_icon.webp'}
                alt="Mateus Celestino Pro X Ícone Oficial"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#9e0015] shadow-[0_0_12px_#9e0015] animate-pulse border-2 border-black" />
          </div>

          {/* Título Monumental Soberano */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-white leading-tight drop-shadow-[0_20px_35px_rgba(0,0,0,0.9)] mb-3">
            MATEUS CELESTINO PRO X
          </h1>

          {/* Subtítulo Especialista Corrigido */}
          <p className="text-xs sm:text-sm font-mono text-zinc-300 flex flex-wrap items-center justify-center gap-2 max-w-3xl mx-auto mb-4">
            <span className="text-white font-semibold">A.I. Infrastructure</span>
            <span className="text-[#ff073a]">•</span>
            <span className="text-zinc-200 font-medium">Agentic Workers</span>
            <span className="text-[#ff073a]">•</span>
            <span className="text-zinc-300 font-medium">A.I. Systems</span>
            <span className="text-[#ff073a]">•</span>
            <span className="text-red-400 font-semibold">Sob Demanda • Smart Software Business</span>
          </p>

          {/* Descrição com Botão Sutil para o SiteMap */}
          <div className="text-xs sm:text-sm md:text-base text-zinc-300 font-light leading-relaxed max-w-2xl mx-auto mb-6 space-y-1.5">
            <p>
              Esse é Mateus Celestino PRO X, o portal de Inteligência Artificial aplicada a Business e Marketing digital de forma completa.
            </p>
            <p>
              Inteligência artificial aplicada, esteiras de automação e conteúdo de alto valor técnico você encontra exatamente aqui.
            </p>
            <p className="flex items-center justify-center flex-wrap gap-1 text-zinc-200 pt-0.5">
              <span>Use o SiteMap (</span>
              <button
                type="button"
                onClick={() => setIsSitemapOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-red-950/70 border border-red-500/50 text-[#ff073a] hover:text-white hover:bg-[#ff073a]/30 font-mono font-bold text-xs transition-all duration-200 shadow-[0_0_15px_rgba(255,7,58,0.3)] hover:scale-105 active:scale-95 cursor-pointer align-middle"
                title="Abrir Fluxograma Visual do SiteMap"
              >
                <Compass className="w-3.5 h-3.5 text-[#ff073a]" />
                <span>clicando aqui</span>
              </button>
              <span>) e navegue pelo portal de forma intuitiva.</span>
            </p>
          </div>

          {/* Ações Primárias do Hero Centralizadas & Responsivas */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 w-full max-w-2xl mx-auto">
            <Link
              href="/contato"
              className="glass-button-fired px-6 py-3.5 sm:px-7 sm:py-3.5 rounded-2xl text-xs sm:text-sm font-mono font-bold text-white flex items-center justify-center gap-2.5 shadow-[0_0_35px_rgba(255,7,58,0.55)] hover:scale-105 active:scale-95 transition-all flex-1 sm:flex-initial cursor-pointer"
              title="Abrir página de contato"
            >
              <MessageSquare className="w-4 h-4 fill-white/20" />
              <span>vamos  automatizar ?!</span>
            </Link>

            <button
              onClick={handleExplore}
              className="glass-interactive px-5 py-3.5 sm:px-6 sm:py-3.5 rounded-2xl text-xs sm:text-sm font-mono font-bold text-zinc-200 hover:text-white flex items-center justify-center gap-2 border border-white/15 hover:border-[#ff073a]/50 hover:scale-105 active:scale-95 transition-all flex-1 sm:flex-initial cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-[#ff073a]" />
              <span>EXPLORAR GUIAS TÉCNICOS (176)</span>
            </button>
          </div>

          {/* Indicador de Navegação Inferior para o Acervo */}
          <button
            onClick={handleExplore}
            className="mt-6 sm:mt-8 inline-flex flex-col items-center gap-1 text-zinc-400 hover:text-white transition-colors cursor-pointer group"
            title="Rolar para os artigos"
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

      {/* Zona Suave de Fade Inferior do Cover — Sem sobrecarga de backdrop-blur */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#0c0003]/80 to-transparent pointer-events-none z-10" />
    </header>
  );
}

export default OriginalHeader;
