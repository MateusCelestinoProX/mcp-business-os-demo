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
 * Espaço de transição cinemático entre shaders e seções da interface.
 * Contém escurecimento progressivo Vanta Black, desfoque óptico (blur 40px)
 * e linha de refração laser carmesim para criar uma passagem suave e fluida.
 */
export default function ShaderTransitionZone({
  from = 'PORTAL',
  to = 'SISTEMA',
  index = '01 // 02',
  className = '',
  accentColor = '#ff073a',
}: ShaderTransitionZoneProps) {
  return (
    <div className={`relative w-full overflow-hidden z-20 ${className}`}>
      {/* 1. Camada de Escurecimento Total (Vanta Black) */}
      <div className="absolute inset-0 bg-black pointer-events-none" />

      {/* 2. Camadas de Desfoque Óptico e Difusão de Profundidade */}
      <div
        className="absolute inset-0 backdrop-blur-3xl pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.95) 0%, rgba(0,0,0,1) 85%)',
        }}
      />

      {/* 3. Gradiente de Fusão Superior e Inferior com as seções vizinhas */}
      <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-black via-black/80 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none" />

      {/* 4. Linha de Refração Laser Carmesim Energetic Fired Neon */}
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-10 md:py-14 flex flex-col items-center justify-center">
        {/* Glow difuso central */}
        <div
          className="w-64 h-1.5 opacity-30 blur-md -mb-[1px] rounded-full pointer-events-none"
          style={{ backgroundColor: accentColor }}
        />

        {/* Linha laser ultra fina com gradiente */}
        <div
          className="w-full h-[1px]"
          style={{
            background: `linear-gradient(to right, transparent, ${accentColor}99, transparent)`,
          }}
        />

        {/* Badge Flutuante da Zona de Transição */}
        <div className="mt-4 inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/[0.03] backdrop-blur-xl border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.9)]">
          <span
            className="w-1.5 h-1.5 rounded-full animate-pulse"
            style={{
              backgroundColor: accentColor,
              boxShadow: `0 0 8px ${accentColor}`,
            }}
          />
          <span className="font-mono text-[9px] sm:text-[10px] tracking-widest text-zinc-400 font-bold uppercase">
            ZONA DE TRANSIÇÃO • {from} <span style={{ color: accentColor }}>➔</span> {to}
          </span>
          <span
            className="hidden sm:inline font-mono text-[9px] font-semibold border-l border-white/10 pl-2"
            style={{ color: `${accentColor}B3` }}
          >
            {index}
          </span>
        </div>
      </div>
    </div>
  );
}
