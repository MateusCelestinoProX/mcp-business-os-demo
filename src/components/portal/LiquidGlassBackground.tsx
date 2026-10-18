'use client';

import React from 'react';
import LiquidChromeShader from '@/components/shaders/LiquidChromeShader';

export function LiquidGlassBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#0c0003] [contain:strict]">
      {/* 1. Base da Piscina de Energia Vermelha Massiva (Profundidade Visceral Carmesim) */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 120% 90% at 50% 100%, #6e0010 0%, #3d0008 35%, #1f0004 65%, #0b0002 100%),
            radial-gradient(circle 800px at 15% 20%, rgba(220, 10, 45, 0.35) 0%, rgba(138, 0, 18, 0.18) 45%, transparent 75%),
            radial-gradient(circle 900px at 85% 60%, rgba(255, 7, 58, 0.3) 0%, rgba(160, 0, 24, 0.16) 50%, transparent 80%),
            radial-gradient(ellipse 1000px 500px at 50% 45%, rgba(200, 0, 30, 0.2) 0%, transparent 70%)
          `
        }}
      />

      {/* 2. Shader WebGL OGL Real: Ondulação Viscosa de Cromo Líquido Carmesim Encorpado */}
      <div className="absolute inset-0 opacity-75 mix-blend-screen pointer-events-none">
        <LiquidChromeShader
          baseColor="#ff073a"
          opacity={0.6}
          speed={0.18}
          amplitude={0.35}
          frequencyX={2.0}
          frequencyY={2.0}
        />
      </div>

      {/* 3. Orbes de Plasma Fluido em Movimento Orgânico com Aceleração por GPU */}
      {/* Orbe 01 - Núcleo Superior Esquerdo */}
      <div 
        className="absolute -top-[10%] left-[5%] w-[650px] h-[650px] rounded-full bg-gradient-to-br from-[#ff073a]/45 via-[#b3001e]/30 to-transparent blur-[55px] animate-liquid-flow-1 transform-gpu will-change-transform pointer-events-none" 
      />

      {/* Orbe 02 - Reservatório Central Direita */}
      <div 
        className="absolute top-[35%] -right-[5%] w-[700px] h-[700px] rounded-full bg-gradient-to-bl from-[#ff1744]/40 via-[#8a0012]/40 to-transparent blur-[65px] animate-liquid-flow-2 transform-gpu will-change-transform pointer-events-none" 
      />

      {/* Orbe 03 - Piscina Inferior Profunda Massiva */}
      <div 
        className="absolute -bottom-[15%] left-[10%] w-[850px] h-[650px] rounded-full bg-gradient-to-t from-[#ff0033]/50 via-[#990018]/40 to-transparent blur-[65px] animate-liquid-breathe transform-gpu will-change-transform pointer-events-none" 
      />

      {/* 4. Sutil Grid Holográfico Cyberpunk Vermelho */}
      <div 
        className="absolute inset-0 opacity-[0.08] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 40, 70, 0.35) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 40, 70, 0.35) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px'
        }}
      />

      {/* 5. Vignette e Profundidade de Borda para Iluminação Cinematográfica */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(10, 0, 2, 0.6) 100%)'
        }}
      />
    </div>
  );
}

export default LiquidGlassBackground;

