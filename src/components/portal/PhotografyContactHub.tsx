'use client';

import React, { useEffect, useState } from 'react';

import { MessageSquare, Mail, Sparkles, CheckCircle2 } from 'lucide-react';

interface PhotografyContactHubProps {
  className?: string;
  isEmbedded?: boolean;
  whatsappUrl?: string;
  email?: string;
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
  whatsappUrl = 'https://wa.me/553197724257',
  email = 'CONTATO-SMARTFLOW@proton.me',
}: PhotografyContactHubProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Background slider cycling every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % backgroundImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const emailHref = email.startsWith('mailto:') ? email : `mailto:${email}`;

  return (
    <div
      className={`relative w-full max-w-[420px] sm:max-w-[440px] mx-auto overflow-hidden text-white flex flex-col items-center justify-center rounded-[2rem] sm:rounded-[2.25rem] transition-all duration-500 ${
        isEmbedded
          ? 'min-h-[580px] sm:min-h-[620px] py-10 px-5 sm:px-7 shadow-[0_25px_60px_rgba(0,0,0,0.85),0_0_35px_rgba(255,7,58,0.2)] border border-white/15 hover:border-red-500/30'
          : 'min-h-[600px] my-auto py-12 px-6 shadow-[0_30px_70px_rgba(0,0,0,0.95),0_0_45px_rgba(255,7,58,0.25)] border border-white/20'
      } ${className}`}
      style={{ touchAction: 'pan-y' }}
    >
      {/* 1. Background Slider Container com Suavização de Transição */}
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-none select-none">
        {backgroundImages.map((src, index) => (
          <div
            key={src}
            className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ backgroundImage: `url('${src}')` }}
          />
        ))}
      </div>

      {/* 2. Overlays escuras com Vinheta e Gradiente Suave */}
      <div className="absolute inset-0 w-full h-full z-[1] pointer-events-none bg-gradient-to-b from-black/85 via-black/70 to-black/95" />
      <div className="absolute inset-0 w-full h-full z-[2] pointer-events-none shadow-[inset_0_0_60px_rgba(0,0,0,0.9)]" />

      {/* 3. Main Content Hub */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full w-full max-w-md mx-auto px-4 sm:px-6 py-6 sm:py-8 animate-fade-in-up">
        {/* Foto de Perfil com Indicador Ativo */}
        <div className="mb-4 relative">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full p-[2px] bg-gradient-to-tr from-[#ff073a]/60 via-white/30 to-white/60 shadow-2xl relative overflow-hidden">
            <img
              src="/photografy-contato/kz.jpg"
              alt="Mateus Celestino"
              className="w-full h-full object-cover rounded-full"
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
        <h1 className="text-xs sm:text-sm font-light tracking-[0.3em] uppercase text-center mb-6 text-white/90 font-sans">
          Mateus Celestino
          <span className="text-[10px] tracking-[0.4em] text-[#ff073a]/90 mt-1 block font-mono font-medium">
            DIGITAL HUB // OFICIAL
          </span>
        </h1>

        {/* Botões de Ação em Vidro Líquido Suave */}
        <div className="w-full flex flex-col gap-3 font-sans">
          {/* WhatsApp */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 sm:py-4 px-5 rounded-2xl flex items-center justify-center gap-2.5 group relative overflow-hidden bg-white/[0.08] hover:bg-[#ff073a]/25 border border-white/15 hover:border-[#ff073a]/50 text-white transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-lg hover:shadow-[0_0_25px_rgba(255,7,58,0.35)]"
          >
            <MessageSquare className="w-4 h-4 text-[#ff073a] group-hover:text-white transition-colors shrink-0" />
            <span className="font-light tracking-[0.2em] text-xs sm:text-sm relative z-10 text-white font-mono">
              WHATSAPP
            </span>
          </a>

          {/* Email */}
          <a
            href={emailHref}
            className="w-full py-3.5 sm:py-4 px-5 rounded-2xl flex items-center justify-center gap-2.5 group relative overflow-hidden bg-white/[0.08] hover:bg-[#ff073a]/25 border border-white/15 hover:border-[#ff073a]/50 text-white transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-lg hover:shadow-[0_0_25px_rgba(255,7,58,0.35)]"
          >
            <Mail className="w-4 h-4 text-zinc-300 group-hover:text-white transition-colors shrink-0" />
            <span className="font-light tracking-[0.2em] text-xs sm:text-sm relative z-10 text-white font-mono">
              E-MAIL
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}

export default PhotografyContactHub;
