'use client';

import React from 'react';
import Image from 'next/image';
import { Layers, User, Mail, ShoppingBag, MessageSquare, Flame, Sparkles, BookOpen, ArrowDown } from 'lucide-react';
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
    <header className="relative w-full overflow-hidden bg-black -mt-24 pt-24">
      {/* =========================================================================
          CINEMATIC FULL-WIDTH COVER HEADER
          ========================================================================= */}
      <div className="relative w-full min-h-[580px] md:min-h-[660px] lg:h-[76vh] flex flex-col justify-between pt-20 pb-12 sm:pb-16 overflow-hidden">
        
        {/* Imagem de Fundo Full-Width + SHADER 1: GridScan (Personal OS) */}
        <div className="absolute inset-0 z-0">
          <img
            src={profile?.heroGif || '/assets/hero_landscape.gif'}
            alt="Mateus Celestino Pro X Cover Cyberpunk"
            className="w-full h-full object-cover object-[center_40%] scale-102 transform filter brightness-[0.68] contrast-[1.15]"
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
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/25 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-transparent to-black/75 pointer-events-none" />
          <div className="absolute inset-0 bg-radial from-transparent via-black/30 to-black/90 pointer-events-none" />
          {/* Linha de Refração Carmesim Inferior do Cover */}
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#ff073a] to-transparent opacity-80" />
        </div>

        {/* Top Floating Glass Badges */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-wrap items-center justify-end gap-3 pt-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-pill border border-[#ff073a]/30 shadow-lg">
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

        {/* Conteúdo Central e Base do Header Cover */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-auto">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8">
            
            {/* Bloco de Identidade: Ícone Cyberpunk + Nome e Título */}
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6">
              {/* Ícone de Vidro Lapidado com Halo Sangue Ultra Fired */}
              <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-3xl p-2 glass-crystal shadow-[0_25px_60px_rgba(0,0,0,0.98),0_0_40px_rgba(255,7,58,0.5)] shrink-0 group">
                <div className="w-full h-full rounded-2xl overflow-hidden bg-black border border-white/20">
                  <img
                    src={profile?.siteIcon || '/assets/site_icon.webp'}
                    alt="Mateus Celestino Pro X Ícone Oficial"
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                  />
                </div>
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[#ff073a] shadow-[0_0_16px_#ff073a] animate-pulse border-2 border-black" />
              </div>

              {/* Título & Badge de Pioneirismo */}
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-pill-red">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ff073a] shadow-[0_0_8px_#ff073a]" />
                  <span className="text-[10px] sm:text-xs font-mono tracking-widest text-[#ff073a] font-bold uppercase">
                    O PRIMEIRO SITE SOBRE AUTOMAÇÃO
                  </span>
                </div>
                
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-none drop-shadow-2xl">
                  MATEUS CELESTINO PRO X
                </h1>

                <p className="text-xs sm:text-sm font-mono text-zinc-300 flex flex-wrap items-center gap-2 pt-1">
                  <span className="text-white font-medium">T.I. & Digital Marketing Automation Specialist</span>
                  <span className="text-[#ff073a]">•</span>
                  <span className="text-zinc-400">n8n, Typebot, IA Generativa & Linux</span>
                </p>
              </div>
            </div>

            {/* Ações Primárias do Header */}
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-button-fired px-6 py-3.5 rounded-2xl text-xs font-mono font-bold text-white flex items-center justify-center gap-2.5 shadow-2xl flex-1 sm:flex-initial"
              >
                <MessageSquare className="w-4 h-4 fill-white/20" />
                <span>QUERO AUTOMATIZAR TUDO</span>
              </a>

              <button
                onClick={handleExplore}
                className="glass-interactive px-5 py-3.5 rounded-2xl text-xs font-mono font-bold text-zinc-200 hover:text-white flex items-center justify-center gap-2 flex-1 sm:flex-initial cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-[#ff073a]" />
                <span>EXPLORAR GUIAS TÉCNICOS</span>
              </button>
            </div>

          </div>

        </div>

      </div>

      {/* Zona de Escurecimento e Blur Inferior do Cover */}
      <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-black via-black/85 to-transparent pointer-events-none z-10 backdrop-blur-[4px]" />
    </header>
  );
}

export default OriginalHeader;
