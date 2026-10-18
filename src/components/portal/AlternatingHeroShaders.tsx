'use client';

import React, { useState } from 'react';
import GridScanShader from '@/components/shaders/GridScanShader';
import RippleGridShader from '@/components/shaders/RippleGridShader';

export function AlternatingHeroShaders() {
  const [activeShader, setActiveShader] = useState<number>(0);

  const shaderNames = [
    { id: 0, name: 'GridScan Matrix', shortName: 'GridScan', label: '01' },
    { id: 1, name: 'Ripple Grid Wave', shortName: 'RippleGrid', label: '02' },
  ];

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      {/* SHADER 1: GridScan (Personal OS Matrix Scanning Grid em Carmesim Encorpado) */}
      {activeShader === 0 && (
        <div className="absolute inset-0 z-10 animate-fadeIn">
          <GridScanShader
            className="w-full h-full mix-blend-screen"
            opacity={0.85}
            linesColor="#38000a"
            scanColor="#ff073a"
            bloomIntensity={0.95}
            scanGlow={0.7}
          />
        </div>
      )}

      {/* SHADER 2: RippleGrid (Personal OS 3D Wave Lattice em Vermelho Carmesim Encorpado) */}
      {activeShader === 1 && (
        <div className="absolute inset-0 z-10 animate-fadeIn">
          <RippleGridShader
            className="w-full h-full mix-blend-screen"
            gridColor="#ff073a"
            rippleIntensity={0.085}
            glowIntensity={0.45}
            opacity={0.80}
          />
        </div>
      )}

      {/* Especular de Vidro & Gradientes de Fusão Vanta Black Equilibrados para Visibilidade Máxima */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/60 pointer-events-none" />
      <div className="absolute inset-0 bg-radial from-transparent via-black/20 to-black/80 pointer-events-none" />
      
      {/* Linha Carmesim de Refração Inferior */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#ff073a] to-transparent opacity-80" />

      {/* Seletor Manual de Shaders Touch-Friendly: visível tanto no Mobile quanto no Desktop */}
      <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-5 z-20 flex items-center gap-2 px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-full bg-black/85 backdrop-blur-md border border-white/15 shadow-[0_0_20px_rgba(0,0,0,0.9)] pointer-events-auto touch-manipulation">
        <span className="w-1.5 h-1.5 rounded-full bg-[#ff073a] animate-pulse" />
        <span className="text-[10px] font-mono text-zinc-300 tracking-wider uppercase">
          <span className="hidden sm:inline">Shader: </span>
          <strong className="text-white font-semibold">
            <span className="hidden sm:inline">{shaderNames[activeShader]?.name}</span>
            <span className="sm:hidden">{shaderNames[activeShader]?.shortName}</span>
          </strong>
        </span>
        <div className="flex items-center gap-1.5 ml-1">
          {shaderNames.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveShader(s.id)}
              className={`p-1 flex items-center justify-center cursor-pointer transition-all touch-manipulation`}
              title={`Trocar para ${s.name}`}
              aria-label={`Trocar shader para ${s.name}`}
            >
              <span
                className={`block h-2 rounded-full transition-all duration-300 ${
                  activeShader === s.id
                    ? 'w-5 bg-[#ff073a] shadow-[0_0_8px_#ff073a]'
                    : 'w-2 bg-white/20 hover:bg-white/50'
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AlternatingHeroShaders;
