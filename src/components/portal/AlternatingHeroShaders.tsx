'use client';

import React, { useState, useEffect } from 'react';
import GridScanShader from '@/components/shaders/GridScanShader';
import FaultyTerminalShader from '@/components/shaders/FaultyTerminalShader';
import RippleGridShader from '@/components/shaders/RippleGridShader';

export function AlternatingHeroShaders() {
  const [activeShader, setActiveShader] = useState<number>(0);

  // Alterna dinamicamente entre os 3 shaders a cada 3 segundos
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveShader((prev) => (prev + 1) % 3);
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  const shaderNames = [
    { id: 0, name: 'GridScan Matrix', label: '01' },
    { id: 1, name: 'Faulty Terminal CRT', label: '02' },
    { id: 2, name: 'Ripple Grid Wave', label: '03' },
  ];

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      {/* SHADER 1: GridScan (Personal OS Matrix Scanning Grid em Carmesim) */}
      <div
        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
          activeShader === 0 ? 'opacity-85 z-10' : 'opacity-0 z-0'
        }`}
      >
        <GridScanShader
          className="w-full h-full mix-blend-screen"
          opacity={0.65}
          linesColor="#160003"
          scanColor="#ff073a"
          bloomIntensity={0.7}
          scanGlow={0.5}
        />
      </div>

      {/* SHADER 2: FaultyTerminal (Personal OS Cyberpunk CRT Terminal Glitch em Vermelho) */}
      <div
        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
          activeShader === 1 ? 'opacity-75 z-10' : 'opacity-0 z-0'
        }`}
      >
        <FaultyTerminalShader
          className="w-full h-full mix-blend-screen"
          tint="#ff073a"
          opacity={0.45}
          scanlineIntensity={0.7}
          glitchAmount={0.5}
          flickerAmount={0.3}
          brightness={1.15}
        />
      </div>

      {/* SHADER 3: RippleGrid (Personal OS 3D Wave Lattice em Vermelho Carmesim) */}
      <div
        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
          activeShader === 2 ? 'opacity-80 z-10' : 'opacity-0 z-0'
        }`}
      >
        <RippleGridShader
          className="w-full h-full mix-blend-screen"
          gridColor="#e00025"
          rippleIntensity={0.08}
          glowIntensity={0.35}
          opacity={0.65}
        />
      </div>

      {/* Especular de Vidro & Gradientes de Fusão Vanta Black */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/35 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-transparent to-black/85 pointer-events-none" />
      <div className="absolute inset-0 bg-radial from-transparent via-black/40 to-black/95 pointer-events-none" />
      
      {/* Linha Carmesim de Refração Inferior */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#ff073a] to-transparent opacity-80" />

      {/* Badge / Indicador Sutil no Canto Inferior Direito do Hero */}
      <div className="absolute bottom-5 right-5 z-20 hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/70 border border-white/10 backdrop-blur-md shadow-[0_0_20px_rgba(0,0,0,0.8)] pointer-events-auto">
        <span className="w-1.5 h-1.5 rounded-full bg-[#ff073a] animate-pulse" />
        <span className="text-[10px] font-mono text-zinc-400 tracking-wider uppercase">
          Shader: <strong className="text-white">{shaderNames[activeShader].name}</strong>
        </span>
        <div className="flex items-center gap-1 ml-1.5">
          {shaderNames.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveShader(s.id)}
              className={`h-1.5 rounded-full transition-all duration-500 cursor-pointer ${
                activeShader === s.id
                  ? 'w-4 bg-[#ff073a] shadow-[0_0_8px_#ff073a]'
                  : 'w-1.5 bg-white/20 hover:bg-white/40'
              }`}
              title={`Trocar para ${s.name}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default AlternatingHeroShaders;
