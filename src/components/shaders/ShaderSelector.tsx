"use client";

import React, { useState, useEffect } from 'react';
import { ShaderBackgroundMode } from './ShaderBackground';
import { isWebGLSupported } from '@/lib/shaders/webgl-utils';
import { Sparkles, Layers, Palette, Eye, ChevronDown, ChevronUp, Cpu } from 'lucide-react';

export interface ShaderSelectorProps {
  currentMode?: ShaderBackgroundMode;
  onModeChange?: (mode: ShaderBackgroundMode) => void;
  currentColor?: string;
  onColorChange?: (colorHex: string) => void;
  className?: string;
  defaultOpen?: boolean;
}

const SHADER_OPTIONS: { id: ShaderBackgroundMode; name: string; tag: string; description: string }[] = [
  { id: 'galaxy', name: 'Galaxy Stars', tag: 'OGL', description: 'Campo estelar volumétrico e nebulosas em rotação suave' },
  { id: 'beams', name: 'Volumetric Beams', tag: 'Three.js', description: 'Feixes de luz volumétrica com ruído Simplex e dispersão' },
  { id: 'colorbends', name: 'Color Bends', tag: 'Three.js', description: 'Distorção e refração cromática com fluido em tempo real' },
  { id: 'gridscan', name: 'Grid Scan', tag: 'Three.js', description: 'Scanner matricial 3D de alta precisão com perspectiva' },
  { id: 'balatro', name: 'Balatro Vortex', tag: 'OGL', description: 'Vórtice psicodélico carmesim espiralado com alto contraste' },
  { id: 'ripple', name: 'Ripple Grid', tag: 'OGL', description: 'Malha geométrica reativa com ondulações sob o cursor' },
  { id: 'lightning', name: 'Plasma Arc', tag: 'OGL', description: 'Descargas elétricas e arco de plasma incandescente' },
  { id: 'terminal', name: 'Cyber Terminal', tag: 'OGL', description: 'Scanlines de tubo CRT analógico com distorção e glitch' },
  { id: 'cinematic', name: 'Cinematic Fluid', tag: 'WebGL2', description: 'Véu fluido cinemático procedural em tela inteira' }
];

const COLOR_PRESETS = [
  { name: 'Neon Red', hex: '#ff073a', border: 'border-[#ff073a]' },
  { name: 'Blood Crimson', hex: '#800010', border: 'border-[#800010]' },
  { name: 'Cyber Cyan', hex: '#00e5ff', border: 'border-[#00e5ff]' },
  { name: 'Sovereign Gold', hex: '#ffb703', border: 'border-[#ffb703]' },
  { name: 'Royal Violet', hex: '#7928ca', border: 'border-[#7928ca]' },
  { name: 'Emerald Matrix', hex: '#00df8f', border: 'border-[#00df8f]' }
];

/**
 * ShaderSelector
 * Painel flutuante ultra-luxuoso em Glassmorphism para alternância em tempo real
 * dos shaders WebGL e paleta cromática na Plataforma Unificada Soberana.
 */
export default function ShaderSelector({
  currentMode = 'galaxy',
  onModeChange,
  currentColor = '#ff073a',
  onColorChange,
  className = '',
  defaultOpen = false
}: ShaderSelectorProps) {
  const [isOpen, setIsOpen] = useState<boolean>(defaultOpen);
  const [selectedMode, setSelectedMode] = useState<ShaderBackgroundMode>(currentMode);
  const [selectedColor, setSelectedColor] = useState<string>(currentColor);
  const [webglActive, setWebglActive] = useState<boolean>(true);

  useEffect(() => {
    setSelectedMode(currentMode);
  }, [currentMode]);

  useEffect(() => {
    setSelectedColor(currentColor);
  }, [currentColor]);

  useEffect(() => {
    setWebglActive(isWebGLSupported());
  }, []);

  const handleSelectMode = (mode: ShaderBackgroundMode) => {
    setSelectedMode(mode);
    if (onModeChange) onModeChange(mode);
  };

  const handleSelectColor = (hex: string) => {
    setSelectedColor(hex);
    if (onColorChange) onColorChange(hex);
  };

  const currentOption = SHADER_OPTIONS.find((s) => s.id === selectedMode) || SHADER_OPTIONS[0];

  return (
    <div className={`fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 select-none max-w-[calc(100vw-2rem)] ${className}`}>
      {/* Botão Gatilho / Mini Badge Flutuante */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-3 px-4 py-2.5 min-h-[44px] rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-2xl border border-white/10 hover:border-[#ff073a]/50 text-white shadow-[0_12px_36px_rgba(0,0,0,0.85)] transition-all duration-300 group cursor-pointer"
          title="Alternador de Shaders em Tempo Real"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span 
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                webglActive ? 'bg-[#ff073a]' : 'bg-amber-500'
              }`}
            />
            <span 
              className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                webglActive ? 'bg-[#ff073a]' : 'bg-amber-500'
              }`}
              style={{ backgroundColor: selectedColor }}
            />
          </span>

          <span className="font-mono text-xs font-semibold tracking-wider text-zinc-300 group-hover:text-white flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#ff073a]" />
            <span className="hidden sm:inline">SHADER:</span> {currentOption.name}
          </span>

          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[#ff073a]">
            {currentOption.tag}
          </span>

          {isOpen ? (
            <ChevronDown className="w-4 h-4 text-zinc-400 group-hover:text-white transition-transform" />
          ) : (
            <ChevronUp className="w-4 h-4 text-zinc-400 group-hover:text-white transition-transform" />
          )}
        </button>
      </div>

      {/* Painel Expansível */}
      {isOpen && (
        <div className="mt-3 w-[calc(100vw-2rem)] max-w-sm sm:w-96 rounded-2xl bg-black/85 backdrop-blur-3xl border border-white/15 p-4 shadow-[0_24px_50px_rgba(0,0,0,0.95)] animate-in fade-in slide-in-from-bottom-3 duration-200">
          {/* Cabeçalho */}
          <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#ff073a]" />
              <span className="font-semibold text-xs tracking-wider uppercase text-zinc-200">
                Motor Visual Cinemático
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-400">
              <Cpu className="w-3 h-3 text-[#ff073a]" />
              <span>{webglActive ? 'WebGL 60 FPS' : 'CSS Fallback'}</span>
            </div>
          </div>

          {/* Seleção de Shaders */}
          <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
            {SHADER_OPTIONS.map((opt) => {
              const active = opt.id === selectedMode;
              return (
                <button
                  key={opt.id}
                  onClick={() => handleSelectMode(opt.id)}
                  className={`w-full text-left p-2.5 min-h-[44px] rounded-xl text-xs transition-all flex items-center justify-between cursor-pointer ${
                    active
                      ? 'bg-white/10 border border-[#ff073a]/60 text-white shadow-[0_0_15px_rgba(255,7,58,0.2)]'
                      : 'bg-white/[0.02] border border-white/5 text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.05]'
                  }`}
                >
                  <div>
                    <div className="font-medium text-zinc-200 flex items-center gap-1.5">
                      {opt.name}
                      {active && <span className="w-1.5 h-1.5 rounded-full bg-[#ff073a]" />}
                    </div>
                    <div className="text-[10px] text-zinc-500 mt-0.5 line-clamp-1">
                      {opt.description}
                    </div>
                  </div>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md border ${
                    active ? 'border-[#ff073a]/40 text-[#ff073a] bg-[#ff073a]/10' : 'border-white/10 text-zinc-500'
                  }`}>
                    {opt.tag}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Paleta de Cores */}
          <div className="mt-4 pt-3 border-t border-white/10">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-[11px] font-medium text-zinc-300">
                <Palette className="w-3.5 h-3.5 text-[#ff073a]" />
                <span>Paleta Cromática</span>
              </div>
              <span className="font-mono text-[10px] text-zinc-400 uppercase">{selectedColor}</span>
            </div>

            <div className="grid grid-cols-6 gap-2">
              {COLOR_PRESETS.map((color) => {
                const active = color.hex.toLowerCase() === selectedColor.toLowerCase();
                return (
                  <button
                    key={color.hex}
                    onClick={() => handleSelectColor(color.hex)}
                    className={`h-9 min-h-[36px] rounded-lg transition-transform hover:scale-105 relative flex items-center justify-center cursor-pointer border ${
                      active ? 'ring-2 ring-white scale-105' : 'border-white/10'
                    }`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  >
                    {active && <span className="w-1.5 h-1.5 rounded-full bg-white shadow-sm" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
