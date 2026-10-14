'use client';

import React from 'react';
import Image from 'next/image';
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
} from 'lucide-react';
import GridScanShader from '@/components/shaders/GridScanShader';

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
      className="relative w-full overflow-hidden bg-black flex flex-col justify-center items-center"
    >
      {/* =========================================================================
          CINEMATIC FULL-WIDTH COVER HERO — CENTRALIZAÇÃO HARMONIOSA E SOBERANA
          ========================================================================= */}
      <div className="relative w-full min-h-[calc(100vh-4rem)] md:min-h-[820px] lg:min-h-[88vh] flex flex-col justify-center items-center text-center pt-28 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        
        {/* Imagem de Fundo Full-Width + SHADER 1: GridScan (Personal OS) */}
        <div className="absolute inset-0 z-0">
          <img
            src={profile?.heroGif || '/assets/hero_landscape.gif'}
            alt="Mateus Celestino Pro X Cover Cyberpunk"
            className="w-full h-full object-cover object-[center_40%] scale-102 transform filter brightness-[0.62] contrast-[1.2]"
          />
          {/* SHADER 1: GridScan (Personal OS - Energetic Fired Neon Blaster Red) */}
          <GridScanShader
            className="z-1 mix-blend-screen"
            opacity={0.85}
            linesColor="#38000a"
            scanColor="#ff073a"
            bloomIntensity={0.95}
            scanGlow={0.7}
          />
          {/* Camadas de Fusão com Vanta Black 100% e Especular de Vidro */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/35 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/80 pointer-events-none" />
          <div className="absolute inset-0 bg-radial from-transparent via-black/40 to-black/95 pointer-events-none" />
          {/* Linha de Refração Carmesim Inferior do Cover */}
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#ff073a] to-transparent opacity-80" />
        </div>

        {/* Top Floating Glass Badges — Centralizados */}
        <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-wrap items-center justify-center gap-3 mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-pill border border-[#ff073a]/30 shadow-lg">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff073a] shadow-[0_0_8px_#ff073a] animate-ping" />
            <span className="font-mono text-[10px] text-[#ff073a] font-bold tracking-widest uppercase">
              SHADER 01: GRID SCAN // NEON BLASTER
            </span>
          </div>
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full glass-pill border border-white/20 shadow-lg">
            <span className="w-2 h-2 rounded-full bg-[#ff073a] animate-pulse shadow-[0_0_10px_#ff073a]" />
            <span className="font-mono text-[11px] text-zinc-200 font-bold tracking-widest uppercase">
              APPLE LIQUID GLASS // VANTA EDITION
            </span>
          </div>
        </div>

        {/* =========================================================================
            NÚCLEO CENTRAL DO HERO — PERFEITAMENTE CENTRALIZADO
            ========================================================================= */}
        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center justify-center">
          
          {/* Ícone de Vidro Lapidado com Halo Sangue Ultra Fired — Centralizado */}
          <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-3xl p-2 glass-crystal shadow-[0_25px_60px_rgba(0,0,0,0.98),0_0_40px_rgba(255,7,58,0.55)] shrink-0 group mb-6 transition-transform duration-500 hover:scale-105">
            <div className="w-full h-full rounded-2xl overflow-hidden bg-black border border-white/20">
              <img
                src={profile?.siteIcon || '/assets/site_icon.webp'}
                alt="Mateus Celestino Pro X Ícone Oficial"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[#ff073a] shadow-[0_0_16px_#ff073a] animate-pulse border-2 border-black" />
          </div>

          {/* Badge de Pioneirismo */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-pill-red mb-4 shadow-[0_0_20px_rgba(255,7,58,0.3)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff073a] shadow-[0_0_8px_#ff073a] animate-ping" />
            <span className="text-[10px] sm:text-xs font-mono tracking-widest text-[#ff073a] font-bold uppercase">
              O PRIMEIRO SITE SOBRE AUTOMAÇÃO DO BRASIL — 100% REFATORADO
            </span>
          </div>

          {/* Título Monumental Soberano */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-white leading-none drop-shadow-[0_20px_35px_rgba(0,0,0,0.9)] mb-4">
            MATEUS CELESTINO PRO X
          </h1>

          {/* Subtítulo Especialista */}
          <p className="text-xs sm:text-sm md:text-base font-mono text-zinc-300 flex flex-wrap items-center justify-center gap-2 max-w-2xl mx-auto mb-4">
            <span className="text-white font-semibold">T.I. & Digital Marketing Automation Specialist</span>
            <span className="text-[#ff073a]">•</span>
            <span className="text-zinc-400">n8n, Typebot, IA Generativa & Linux</span>
          </p>

          <p className="text-sm sm:text-base text-zinc-300 font-light leading-relaxed max-w-2xl mx-auto mb-8">
            O primeiro portal brasileiro sobre hiperautomação, agentes autônomos com IA e engenharia de sistemas soberanos em Vanta Black e Apple Liquid Glass.
          </p>

          {/* Ações Primárias do Hero Centralizadas */}
          <div className="flex flex-wrap items-center justify-center gap-4 w-full max-w-lg mx-auto">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-button-fired px-7 py-4 rounded-2xl text-xs sm:text-sm font-mono font-bold text-white flex items-center justify-center gap-2.5 shadow-[0_0_35px_rgba(255,7,58,0.55)] hover:scale-105 active:scale-95 transition-all flex-1 sm:flex-initial"
            >
              <MessageSquare className="w-4 h-4 fill-white/20" />
              <span>QUERO AUTOMATIZAR TUDO</span>
            </a>

            <button
              onClick={handleExplore}
              className="glass-interactive px-6 py-4 rounded-2xl text-xs sm:text-sm font-mono font-bold text-zinc-200 hover:text-white flex items-center justify-center gap-2 border border-white/15 hover:border-[#ff073a]/50 hover:scale-105 active:scale-95 transition-all flex-1 sm:flex-initial cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-[#ff073a]" />
              <span>EXPLORAR GUIAS TÉCNICOS (176)</span>
            </button>
          </div>

          {/* Indicador de Navegação Inferior para o Acervo */}
          <button
            onClick={handleExplore}
            className="mt-12 inline-flex flex-col items-center gap-1.5 text-zinc-400 hover:text-white transition-colors cursor-pointer group"
            title="Rolar para os artigos"
          >
            <span className="text-[10px] font-mono tracking-widest uppercase text-zinc-300 group-hover:text-[#ff073a] transition-colors">
              ACERVO SOBERANO
            </span>
            <ArrowDown className="w-4 h-4 text-[#ff073a] animate-bounce" />
          </button>

        </div>

      </div>

      {/* Zona Suave de Escurecimento e Blur Inferior do Cover */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none z-10 backdrop-blur-[2px]" />
    </header>
  );
}

export default OriginalHeader;
