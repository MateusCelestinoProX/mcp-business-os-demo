'use client';

import React from 'react';

export function LiquidGlassBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-black">
      {/* 100% Vanta Black Base */}
      <div className="absolute inset-0 bg-[#000000]" />

      {/* Orbes de Refração Carmesim Sanguíneo para alimentar o Liquid Glass */}
      <div className="liquid-glow-orb top-[-10%] left-[20%] w-[600px] h-[600px] bg-[#ff073a] opacity-15" />
      <div className="liquid-glow-orb top-[30%] -left-[10%] w-[500px] h-[500px] bg-[#800010] opacity-25" />
      <div className="liquid-glow-orb top-[50%] right-[-5%] w-[650px] h-[650px] bg-[#ff0033] opacity-12" />
      <div className="liquid-glow-orb bottom-[10%] left-[30%] w-[550px] h-[550px] bg-[#b80024] opacity-15" />

      {/* Sutil Grid Holográfico Cyberpunk */}
      <div 
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />
    </div>
  );
}

export default LiquidGlassBackground;
