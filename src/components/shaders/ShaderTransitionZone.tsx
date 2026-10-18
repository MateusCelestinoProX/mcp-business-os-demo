'use client';

import React from 'react';

export interface ShaderTransitionZoneProps {
  from?: string;
  to?: string;
  index?: string;
  className?: string;
  accentColor?: string;
}

/**
 * ShaderTransitionZone
 * Espaço de transição cinemático de alto luxo entre shaders e seções da interface.
 * Equipado com:
 * - Sombras volumétricas e vinhetas profundas de fusão cinematográfica
 * - Desfoque óptico difuso (lentes e orbs com blur 48px/72px)
 * - Feixe anamórfico carmesim neon com flare horizontal suave
 * - Micro-indicador setorial com estética cyberpunk de precisão
 */
export default function ShaderTransitionZone({
  from = 'PORTAL',
  to = 'SISTEMA',
  index = '01 // 02',
  className = '',
  accentColor = '#ff073a',
}: ShaderTransitionZoneProps) {
  return (
    <div
      className={`relative w-full max-w-full overflow-hidden overflow-x-hidden z-20 py-12 sm:py-16 md:py-20 lg:py-24 flex flex-col items-center justify-center pointer-events-none select-none ${className}`}
    >
      {/* 1. SOMBRAS CINEMÁTICAS PROFUNDAS & VINHETAS DE TRANSIÇÃO (TOP & BOTTOM FADE) */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#030305] via-[#030305]/90 to-[#030305] pointer-events-none" />
      <div className="absolute inset-0 bg-radial from-transparent via-black/40 to-black pointer-events-none" />

      {/* Sombra de oclusão de contato superior e inferior com queda de luz suave */}
      <div className="absolute -top-12 left-0 right-0 h-24 bg-gradient-to-b from-black via-black/80 to-transparent pointer-events-none" />
      <div className="absolute -bottom-12 left-0 right-0 h-24 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none" />

      {/* 2. GLOW E DESFOQUE ÓPTICO DIFUSO (ATMOSFERA CINEMÁTICA SOFT BLUR) */}
      <div
        className="absolute w-72 sm:w-96 md:w-[32rem] h-20 sm:h-28 rounded-full pointer-events-none opacity-30"
        style={{
          background: `radial-gradient(ellipse at center, ${accentColor} 0%, rgba(138, 0, 18, 0.4) 45%, transparent 75%)`,
          filter: 'blur(54px)',
          transform: 'translate3d(0, 0, 0)',
        }}
      />
      <div
        className="absolute w-40 sm:w-60 h-10 sm:h-14 rounded-full pointer-events-none opacity-40"
        style={{
          background: `radial-gradient(ellipse at center, #ffffff 0%, ${accentColor} 50%, transparent 80%)`,
          filter: 'blur(32px)',
          transform: 'translate3d(0, 0, 0)',
        }}
      />

      {/* 3. NÚCLEO DA TRANSIÇÃO: FEIXE ANAMÓRFICO & MARCADOR SETORIAL */}
      <div className="relative w-full max-w-5xl mx-auto px-4 sm:px-6 flex flex-col items-center justify-center">
        
        {/* Feixe Laser Anamórfico Horizontal com Flare Especular */}
        <div className="relative w-full flex items-center justify-center">
          {/* Linha de fusão difusa com sombra envolvente */}
          <div
            className="w-full h-[1px] opacity-75"
            style={{
              background: `linear-gradient(90deg, transparent 0%, rgba(255, 7, 58, 0.05) 15%, rgba(255, 7, 58, 0.45) 50%, rgba(255, 7, 58, 0.05) 85%, transparent 100%)`,
              boxShadow: '0 0 16px rgba(255, 7, 58, 0.45), 0 0 32px rgba(0, 0, 0, 0.95)',
            }}
          />

          {/* Ponto focal de refração com brilho branco/carmesim no centro */}
          <span className="absolute w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_12px_#ffffff,0_0_24px_#ff073a] opacity-90 animate-pulse" />
        </div>

        {/* 4. CHIP DE NAVEGAÇÃO SETORIAL COMPACTO & ELEGANTE */}
        {(from || to) && (
          <div className="mt-3.5 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/80 border border-white/10 shadow-[0_10px_25px_rgba(0,0,0,0.9),0_0_15px_rgba(255,7,58,0.15)] text-[9px] sm:text-[10px] font-mono tracking-widest uppercase text-zinc-400">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff073a] animate-pulse shrink-0" />
            <span className="text-zinc-300 font-semibold">{from}</span>
            <span className="text-[#ff073a] font-bold">→</span>
            <span className="text-zinc-300 font-semibold">{to}</span>
            {index && (
              <>
                <span className="text-white/20">|</span>
                <span className="text-[#ff073a] font-mono">{index}</span>
              </>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
