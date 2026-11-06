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
  { value: "24/7", label: "Agentes IA" },
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
  const activeMetrics = metrics || (showMetrics ? DEFAULT_BANNER_METRICS : null);
  const validImages = Array.isArray(images) && images.length > 0
    ? images.filter(Boolean)
    : ["/assets/notion/shop/hero_art.png"];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  useEffect(() => {
    if (validImages.length <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % validImages.length);
    }, intervalMs);

    return () => clearInterval(timer);
  }, [validImages.length, intervalMs, isPaused]);

  const handlePrev = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + validImages.length) % validImages.length);
  };

  const handleNext = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % validImages.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    if (diff > 40) {
      // Swipe para a esquerda (próxima imagem)
      setCurrentIndex((prev) => (prev + 1) % validImages.length);
    } else if (diff < -40) {
      // Swipe para a direita (imagem anterior)
      setCurrentIndex((prev) => (prev - 1 + validImages.length) % validImages.length);
    }
    setTouchStartX(null);
  };

  return (
    <div
      className={`relative w-full ${aspectRatio} rounded-3xl overflow-hidden glass-card-nested border border-[#ff073a]/30 shadow-[0_0_50px_rgba(255,7,58,0.25)] group select-none touch-pan-y ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
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
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-2 pointer-events-none" />

      {/* Controles de Navegação Rápida (quando houver mais de 1 imagem) */}
      {validImages.length > 1 && (
        <>
          <button
            type="button"
            onClick={handlePrev}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 z-10 w-9 h-9 sm:w-8 sm:h-8 rounded-full bg-black/70 hover:bg-[#ff073a] active:bg-[#ff073a] text-white flex items-center justify-center opacity-85 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300 backdrop-blur-md border border-white/15 cursor-pointer touch-manipulation active:scale-90"
            title="Imagem Anterior"
            aria-label="Imagem Anterior"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 z-10 w-9 h-9 sm:w-8 sm:h-8 rounded-full bg-black/70 hover:bg-[#ff073a] active:bg-[#ff073a] text-white flex items-center justify-center opacity-85 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300 backdrop-blur-md border border-white/15 cursor-pointer touch-manipulation active:scale-90"
            title="Próxima Imagem"
            aria-label="Próxima Imagem"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Indicadores Pontilhados de Slide Alternado com hit target touch amigável */}
          <div className="absolute top-3.5 right-3.5 z-10 flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/15">
            {validImages.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                className={`transition-all duration-300 rounded-full cursor-pointer touch-manipulation ${
                  idx === currentIndex
                    ? "w-5 h-2 bg-[#ff073a]"
                    : "w-2 h-2 bg-white/40 hover:bg-white/80"
                }`}
                title={`Ir para imagem ${idx + 1}`}
                aria-label={`Ir para imagem ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}

      {/* Badge Inferior em Vidro Líquido */}
      <div className="absolute bottom-5 left-5 right-5 p-4 rounded-2xl glass-crystal border border-white/15 backdrop-blur-md z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#ff073a] animate-pulse" />
            <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              {badgeText}
            </span>
          </div>
          <span className="text-[10px] font-mono text-zinc-400">
            {validImages.length > 1
              ? `${currentIndex + 1} DE ${validImages.length} ATIVOS`
              : "100% VALIDADO"}
          </span>
        </div>
        <p className="mt-1 text-xs text-zinc-300 font-light truncate">
          {tagline || subText}
        </p>

        {/* Métricas de Destaque Opcionais em Grid Responsivo (2 colunas no mobile) */}
        {activeMetrics && activeMetrics.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2 mt-2 sm:mt-2.5 pt-2 border-t border-white/10">
            {activeMetrics.map((m, i) => (
              <div
                key={i}
                className="bg-black/60 border border-white/10 rounded-lg p-1.5 text-center"
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
