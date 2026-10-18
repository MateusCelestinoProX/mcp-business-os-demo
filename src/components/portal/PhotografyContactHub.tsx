'use client';

import React, { useEffect, useState, useRef } from 'react';
import { 
  MessageSquare, 
  Mail, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  Camera, 
  ExternalLink 
} from 'lucide-react';

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
  </svg>
);

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

interface PhotografyContactHubProps {
  className?: string;
  isEmbedded?: boolean;
  whatsappUrl?: string;
  email?: string;
  linkedinUrl?: string;
  instagramUrl?: string;
  photoPortfolioUrl?: string;
}

const backgroundImages = [
  '/photografy-contato/l1.jpg',
  '/photografy-contato/l2.jpg',
  '/photografy-contato/l3.jpg',
  '/photografy-contato/l4.jpg',
  '/photografy-contato/l5.jpg',
];

export function PhotografyContactHub({
  className = '',
  isEmbedded = false,
  whatsappUrl = 'https://api.whatsapp.com/send/?phone=553197724257&text=QUERO+AUTOMATIZAR+TUDO.&type=phone_number&app_absent=0',
  email = 'CONTATO-SMARTFLOW@proton.me',
  linkedinUrl = 'https://www.linkedin.com/in/mateus-celestino-0ba50626a/',
  instagramUrl = 'https://www.instagram.com/celestinoautomacao/',
  photoPortfolioUrl = 'https://photografy-home.vercel.app/',
}: PhotografyContactHubProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Background slider cycling a cada 4.5 segundos se não estiver pausado
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % backgroundImages.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [isPaused]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % backgroundImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + backgroundImages.length) % backgroundImages.length);
  };

  // Suporte a gestos touch swipe no mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const diff = touchStartX.current - touchEndX.current;
    // Mínimo de 45px para registrar swipe
    if (diff > 45) {
      nextSlide();
    } else if (diff < -45) {
      prevSlide();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const emailHref = email.startsWith('mailto:') ? email : `mailto:${email}`;

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className={`relative w-full overflow-hidden text-white flex flex-col items-center justify-center rounded-2xl sm:rounded-3xl lg:rounded-[2.5rem] transition-all duration-500 select-none ${
        isEmbedded
          ? 'min-h-[580px] sm:min-h-[680px] lg:min-h-[740px] py-8 sm:py-14 px-4 sm:px-8 shadow-[0_30px_90px_rgba(0,0,0,0.85),0_0_45px_rgba(255,7,58,0.25)] border border-white/15 hover:border-red-500/40'
          : 'min-h-[560px] my-auto py-10 px-4 sm:px-6 shadow-[0_30px_70px_rgba(0,0,0,0.95),0_0_45px_rgba(255,7,58,0.25)] border border-white/20'
      } ${className}`}
      style={{ touchAction: 'pan-y' }}
    >
      {/* 1. Background Slider Container com Suavização de Transição */}
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-none select-none">
        {backgroundImages.map((src, index) => (
          <div
            key={src}
            className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
            }`}
            style={{
              backgroundImage: `url('${src}')`,
              transitionProperty: 'opacity, transform',
              transitionDuration: '1500ms',
            }}
          />
        ))}
      </div>

      {/* 2. Overlays escuras com Vinheta e Gradiente Suave */}
      <div className="absolute inset-0 w-full h-full z-[1] pointer-events-none bg-gradient-to-b from-black/85 via-black/70 to-black/95" />
      <div className="absolute inset-0 w-full h-full z-[2] pointer-events-none shadow-[inset_0_0_80px_rgba(0,0,0,0.9)]" />

      {/* Halos de Iluminação Ambiente Carmesim Integrados no Card */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-3xl pointer-events-none -mr-40 -mt-40 z-[3]" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-red-950/20 rounded-full blur-3xl pointer-events-none -ml-40 -mb-40 z-[3]" />

      {/* Controles de Navegação da Galeria (Anterior e Próximo) */}
      <button
        type="button"
        onClick={prevSlide}
        aria-label="Foto anterior"
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full glass-crystal border border-white/10 flex items-center justify-center text-zinc-300 hover:text-white hover:border-[#ff073a]/50 transition-all opacity-70 hover:opacity-100 cursor-pointer"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        type="button"
        onClick={nextSlide}
        aria-label="Próxima foto"
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full glass-crystal border border-white/10 flex items-center justify-center text-zinc-300 hover:text-white hover:border-[#ff073a]/50 transition-all opacity-70 hover:opacity-100 cursor-pointer"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* 3. Main Content Hub */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full w-full max-w-md mx-auto px-2 sm:px-6 py-4 sm:py-6 animate-fade-in-up">
        {/* Foto de Perfil com Indicador Ativo */}
        <div className="mb-3.5 relative">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full p-[2.5px] bg-gradient-to-tr from-[#ff073a] via-white/40 to-white shadow-[0_0_25px_rgba(255,7,58,0.4)] relative overflow-hidden group">
            <img
              src="/photografy-contato/kz.jpg"
              alt="Mateus Celestino"
              className="w-full h-full object-cover rounded-full group-hover:scale-105 transition-transform duration-500"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'https://placehold.co/200x200/111/FFF?text=MC';
              }}
            />
          </div>
          {/* Indicador de Status Online / Ativo */}
          <span
            className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-black shadow-[0_0_10px_#10b981]"
            title="Online // Atendimento Oficial Ativo"
          />
        </div>

        {/* Título com Tipografia Refinada */}
        <h1 className="text-xs sm:text-sm font-light tracking-[0.3em] uppercase text-center mb-5 text-white/90 font-sans">
          Mateus Celestino
          <span className="text-[10px] tracking-[0.35em] text-[#ff073a] mt-1 block font-mono font-bold">
            DIGITAL HUB // OFICIAL
          </span>
        </h1>

        {/* Social Bubbles em Vidro Líquido & Neon Carmine — Touch Target >= 48px */}
        <div className="w-full grid grid-cols-2 gap-2.5 sm:gap-3 font-sans">
          {/* WhatsApp com destaque supremo */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="min-h-[48px] py-3 px-3 rounded-xl sm:rounded-2xl flex items-center justify-center gap-2 group relative overflow-hidden bg-[#ff073a]/15 hover:bg-[#ff073a]/25 border border-[#ff073a]/40 hover:border-[#ff073a] text-white transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-lg hover:shadow-[0_0_20px_rgba(255,7,58,0.35)]"
          >
            <MessageSquare className="w-4 h-4 text-[#ff073a] group-hover:text-white transition-colors shrink-0" />
            <span className="font-semibold tracking-[0.14em] text-[11px] sm:text-xs relative z-10 text-white font-mono truncate">
              WHATSAPP
            </span>
          </a>

          {/* Instagram */}
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="min-h-[48px] py-3 px-3 rounded-xl sm:rounded-2xl flex items-center justify-center gap-2 group relative overflow-hidden bg-white/[0.08] hover:bg-[#ff073a]/20 border border-white/15 hover:border-[#ff073a]/50 text-white transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-lg"
          >
            <InstagramIcon className="w-4 h-4 text-zinc-300 group-hover:text-[#ff073a] transition-colors shrink-0" />
            <span className="font-light tracking-[0.14em] text-[11px] sm:text-xs relative z-10 text-white font-mono truncate">
              INSTAGRAM
            </span>
          </a>

          {/* LinkedIn */}
          <a
            href={linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="min-h-[48px] py-3 px-3 rounded-xl sm:rounded-2xl flex items-center justify-center gap-2 group relative overflow-hidden bg-white/[0.08] hover:bg-[#ff073a]/20 border border-white/15 hover:border-[#ff073a]/50 text-white transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-lg"
          >
            <LinkedinIcon className="w-4 h-4 text-zinc-300 group-hover:text-[#ff073a] transition-colors shrink-0" />
            <span className="font-light tracking-[0.14em] text-[11px] sm:text-xs relative z-10 text-white font-mono truncate">
              LINKEDIN
            </span>
          </a>

          {/* Email Proton */}
          <a
            href={emailHref}
            className="min-h-[48px] py-3 px-3 rounded-xl sm:rounded-2xl flex items-center justify-center gap-2 group relative overflow-hidden bg-white/[0.08] hover:bg-[#ff073a]/20 border border-white/15 hover:border-[#ff073a]/50 text-white transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-lg"
          >
            <Mail className="w-4 h-4 text-zinc-300 group-hover:text-[#ff073a] transition-colors shrink-0" />
            <span className="font-light tracking-[0.14em] text-[11px] sm:text-xs relative z-10 text-white font-mono truncate">
              PROTON MAIL
            </span>
          </a>
        </div>

        {/* Link de Destaque: Acessar Portfólio de Fotografia Completo */}
        <div className="w-full mt-4 pt-3 border-t border-white/10">
          <a
            href={photoPortfolioUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 px-3 rounded-xl glass-crystal border border-white/10 hover:border-[#ff073a]/50 flex items-center justify-between gap-2 text-[11px] font-mono text-zinc-300 hover:text-white transition-all group"
          >
            <span className="flex items-center gap-2 truncate">
              <Camera className="w-3.5 h-3.5 text-[#ff073a] shrink-0" />
              <span>GALERIA COMPLETA DE FOTOGRAFIA</span>
            </span>
            <ExternalLink className="w-3.5 h-3.5 text-zinc-500 group-hover:text-white transition-colors shrink-0" />
          </a>
        </div>

        {/* 4. Indicadores Táteis de Slides da Galeria (Dots Interativos) */}
        <div className="mt-4 flex items-center justify-center gap-2">
          {backgroundImages.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentSlide(idx)}
              aria-label={`Ir para foto ${idx + 1}`}
              className={`transition-all duration-300 rounded-full cursor-pointer min-h-[32px] min-w-[32px] flex items-center justify-center p-1.5`}
            >
              <span
                className={`block rounded-full transition-all duration-300 ${
                  idx === currentSlide
                    ? 'w-6 h-1.5 bg-[#ff073a] shadow-[0_0_8px_#ff073a]'
                    : 'w-1.5 h-1.5 bg-white/30 hover:bg-white/60'
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PhotografyContactHub;
