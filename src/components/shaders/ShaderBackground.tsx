"use client";

import React, { useState, useEffect } from 'react';
import Galaxy from './Galaxy';
import Beams from './Beams';
import ColorBends from './ColorBends';
import GridScanShader from './GridScanShader';
import BalatroShader from './BalatroShader';
import RippleGridShader from './RippleGridShader';
import LightningShader from './LightningShader';
import FaultyTerminalShader from './FaultyTerminalShader';
import CinematicCanvas from './CinematicCanvas';
import { isWebGLSupported, hexToHueShift } from '@/lib/shaders/webgl-utils';

export type ShaderBackgroundMode = 
  | 'galaxy' 
  | 'beams' 
  | 'colorbends' 
  | 'gridscan' 
  | 'balatro' 
  | 'ripple' 
  | 'lightning' 
  | 'terminal'
  | 'cinematic';

export interface ShaderBackgroundProps {
  /**
   * Modo do shader ativo em segundo plano
   * Padrão: 'galaxy'
   */
  mode?: ShaderBackgroundMode;
  /**
   * Cor primária da marca em formato hexadecimal (#FF073A)
   */
  colorHex?: string;
  /**
   * Nível de opacidade global da camada de shaders
   * Padrão: 0.8
   */
  opacity?: number;
  /**
   * Se true, fixa o shader na tela inteira (fixed inset-0).
   * Se false, atua como absolute inset-0 na seção pai.
   * Padrão: true
   */
  fixed?: boolean;
  isFixed?: boolean;
  /**
   * Classes adicionais
   */
  className?: string;
  /**
   * Estilos inline adicionais
   */
  style?: React.CSSProperties;
}

/**
 * ShaderBackground
 * Gerenciador unificado de plano de fundo cinemático em WebGL.
 * Oferece transição dinâmica entre todos os shaders do ecossistema Mateus Celestino Pro,
 * com fallback elegante e automático em CSS puro caso a aceleração WebGL esteja ausente.
 */
export default function ShaderBackground({
  mode = 'galaxy',
  colorHex = '#ff073a',
  opacity = 0.8,
  fixed = true,
  isFixed,
  className = '',
  style = {}
}: ShaderBackgroundProps) {
  const [mounted, setMounted] = useState<boolean>(false);
  const [hasWebGL, setHasWebGL] = useState<boolean>(true);

  useEffect(() => {
    setMounted(true);
    setHasWebGL(isWebGLSupported());
  }, []);

  const shouldBeFixed = isFixed !== undefined ? isFixed : fixed;
  const positionClass = shouldBeFixed ? 'fixed inset-0' : 'absolute inset-0';
  const containerClasses = `${positionClass} w-full h-full pointer-events-none z-0 overflow-hidden transition-opacity duration-1000 ${className}`;

  // Fallback gracioso em CSS/Gradiente caso WebGL não esteja disponível ou antes da montagem
  if (!mounted || !hasWebGL) {
    return (
      <div 
        className={`${containerClasses} bg-[#030305]`} 
        style={{ opacity, ...style }}
        aria-hidden="true"
      >
        <div 
          className="absolute inset-0" 
          style={{
            background: `radial-gradient(ellipse 80% 60% at 50% 10%, ${colorHex}18 0%, rgba(3,3,5,0.85) 60%, #030305 100%)`
          }}
        />
        <div 
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: `radial-gradient(${colorHex} 1px, transparent 1px)`,
            backgroundSize: '24px 24px'
          }}
        />
      </div>
    );
  }

  return (
    <div 
      className={containerClasses} 
      style={{ opacity, ...style }}
      aria-hidden="true"
    >
      {mode === 'galaxy' && (
        <Galaxy 
          hueShift={hexToHueShift(colorHex)}
          density={1.6}
          glowIntensity={0.85}
          starSpeed={0.7}
          mouseInteraction={true}
          mouseRepulsion={true}
        />
      )}

      {mode === 'beams' && (
        <Beams 
          lightColor={colorHex}
          beamWidth={2.4}
          beamHeight={18}
          beamNumber={14}
          speed={2.0}
          noiseIntensity={1.5}
        />
      )}

      {mode === 'colorbends' && (
        <ColorBends 
          colors={[colorHex, '#030305', colorHex]}
          rotation={45}
          speed={0.25}
          scale={1.2}
          frequency={1.4}
          warpStrength={1.2}
          intensity={1.7}
        />
      )}

      {mode === 'gridscan' && (
        <GridScanShader 
          scanColor={colorHex}
          linesColor="#200006"
          lineThickness={1.2}
          gridScale={0.1}
          bloomIntensity={0.85}
          opacity={opacity}
        />
      )}

      {mode === 'balatro' && (
        <BalatroShader 
          color1={colorHex}
          color2="#800010"
          color3="#030305"
          spinSpeed={5.0}
          contrast={3.0}
          opacity={opacity}
        />
      )}

      {mode === 'ripple' && (
        <RippleGridShader 
          gridColor={colorHex}
          rippleIntensity={0.07}
          gridSize={14.0}
          glowIntensity={0.3}
          opacity={opacity}
        />
      )}

      {mode === 'lightning' && (
        <LightningShader 
          speed={1.2}
          intensity={1.8}
          size={1.1}
          opacity={opacity}
        />
      )}

      {mode === 'terminal' && (
        <FaultyTerminalShader 
          tint={colorHex}
          scale={1.2}
          glitchAmount={0.8}
          scanlineIntensity={0.8}
          opacity={opacity}
        />
      )}

      {mode === 'cinematic' && (
        <CinematicCanvas 
          shaderStep={1}
          colorHex={colorHex}
        />
      )}
    </div>
  );
}
