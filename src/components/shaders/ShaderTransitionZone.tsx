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
  accentColor = '#8a0012',
}: ShaderTransitionZoneProps) {
  return (
    <div className={`relative w-full max-w-full overflow-hidden overflow-x-hidden z-20 py-4 sm:py-6 ${className}`}>
      {/* Linha de Refração Laser Carmesim Energetic Fired Neon — Leve e Fluida */}
      <div className="relative w-full max-w-full sm:max-w-5xl mx-auto px-4 sm:px-6 flex flex-col items-center justify-center pointer-events-none overflow-x-hidden">
        {/* Glow difuso central suave */}
        <div
          className="w-48 sm:w-72 max-w-[80vw] h-1 opacity-25 blur-sm -mb-[1px] rounded-full pointer-events-none"
          style={{ backgroundColor: accentColor }}
        />

        {/* Linha laser ultra fina e elegante em vermelho obscurecido */}
        <div
          className="w-full max-w-full h-[1px]"
          style={{
            background: `linear-gradient(to right, transparent, ${accentColor}55, transparent)`,
          }}
        />
      </div>
    </div>
  );
}
