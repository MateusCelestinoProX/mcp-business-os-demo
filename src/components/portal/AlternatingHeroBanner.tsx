"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

export interface BannerMetricItem {
  label: string;
  value: string;
}

export interface AlternatingHeroBannerProps {
  images: string[];
  alt?: string;
  intervalMs?: number;
  className?: string;
  badgeText?: string;
  subText?: string;
  title?: string;
  tagline?: string;
  aspectRatio?: string;
  metrics?: BannerMetricItem[];
  showMetrics?: boolean;
}

const DEFAULT_BANNER_METRICS: BannerMetricItem[] = [
  { value: "176+", label: "Artigos" },
  { value: "406+", label: "Recursos" },
  { value: "4 em 1", label: "Sistemas" },
  { value: "60 FPS", label: "Shaders" },
];

export function AlternatingHeroBanner({
  images = [],
  alt = "Hero Banner Alternado",
  intervalMs = 4000,
  className = "",
  badgeText = "COMPRE AGORA",
  subText = "Soluções validadas prontas para execução.",
  title,
  tagline,
  aspectRatio = "aspect-square",
  metrics,
  showMetrics = false,
}: AlternatingHeroBannerProps) {
  const validImages = Array.isArray(images) && images.length > 0
    ? images.filter(Boolean)
    : ["/assets/notion/shop/hero_art.png"];

  const activeMetrics = metrics || (showMetrics ? DEFAULT_BANNER_METRICS : null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (validImages.length <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % validImages.length);
    }, intervalMs);

    return () => clearInterval(timer);
  }, [validImages.length, intervalMs, isPaused]);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + validImages.length) % validImages.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % validImages.length);
  };

  return (
    <div
      className={`relative w-full ${aspectRatio} rounded-2xl sm:rounded-3xl overflow-hidden glass-card-nested border border-[#ff073a]/30 shadow-[0_0_50px_rgba(255,7,58,0.25)] group select-none ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Imagens Ocupando Exatamente o Mesmo Espaço com Cross-fade Fluido */}
      {validImages.map((src, idx) => {
        const isActive = idx === currentIndex;
        return (
          <div
            key={idx}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              isActive
                ? "opacity-100 scale-100 pointer-events-auto z-1"
                : "opacity-0 scale-105 pointer-events-none z-0"
            }`}
          >
            <img
              src={src}
              alt={`${alt} - Slide ${idx + 1}`}
              className="w-full h-full object-cover"
              loading={idx === 0 ? "eager" : "lazy"}
              onError={(e) => {
                // Fallback para capa padrão
                (e.target as HTMLImageElement).src = "/assets/hero_cover.webp";
              }}
            />
          </div>
        );
      })}

      {/* Gradiente de Fusão Elegante */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent z-2 pointer-events-none" />

      {/* Controles de Navegação Rápida (quando houver mais de 1 imagem) */}
      {validImages.length > 1 && (
        <>
          <button
            type="button"
            onClick={handlePrev}
            className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/60 hover:bg-[#ff073a] text-white flex items-center justify-center opacity-80 sm:opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-md border border-white/10 active:scale-95"
            title="Imagem Anterior"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/60 hover:bg-[#ff073a] text-white flex items-center justify-center opacity-80 sm:opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-md border border-white/10 active:scale-95"
            title="Próxima Imagem"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Indicadores Pontilhados de Slide Alternado */}
          <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10">
            {validImages.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                className={`transition-all duration-300 rounded-full ${
                  idx === currentIndex
                    ? "w-4 h-1.5 bg-[#ff073a]"
                    : "w-1.5 h-1.5 bg-white/40 hover:bg-white/80"
                }`}
                title={`Ir para imagem ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}

      {/* Card Inferior em Liquid Glassmorphism */}
      <div className="absolute bottom-2.5 sm:bottom-4 left-2.5 sm:left-4 right-2.5 sm:right-4 p-2.5 sm:p-4 rounded-xl sm:rounded-2xl glass-crystal border border-white/15 backdrop-blur-md z-10">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-[#ff073a] animate-pulse shrink-0" />
            <span className="text-[11px] sm:text-xs font-mono font-bold text-white uppercase tracking-wider truncate">
              {badgeText}
            </span>
          </div>
          <span className="text-[9px] sm:text-[10px] font-mono text-zinc-400 shrink-0">
            {validImages.length > 1
              ? `${currentIndex + 1}/${validImages.length} ATIVOS`
              : "100% VALIDADO"}
          </span>
        </div>

        <p className="mt-1 text-[11px] sm:text-xs text-zinc-300 font-light truncate">
          {tagline || subText}
        </p>

        {/* Métricas de Destaque Opcionais em Grid Responsivo (2 colunas no mobile) */}
        {activeMetrics && activeMetrics.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2 mt-2 sm:mt-2.5 pt-2 border-t border-white/10">
            {activeMetrics.map((m, i) => (
              <div
                key={i}
                className="bg-black/40 border border-white/10 rounded-lg p-1.5 text-center backdrop-blur-sm"
              >
                <div className="text-xs sm:text-sm font-black font-mono text-white leading-tight">
                  {m.value}
                </div>
                <div className="text-[9px] font-mono text-zinc-400 uppercase tracking-wider truncate">
                  {m.label}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AlternatingHeroBanner;
