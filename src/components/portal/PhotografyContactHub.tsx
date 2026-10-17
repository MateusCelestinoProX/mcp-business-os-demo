'use client';

import React, { useEffect, useState } from 'react';

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
  whatsappUrl = 'https://wa.me/5531998622489',
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
      className={`relative w-full max-w-[420px] mx-auto overflow-hidden text-white flex flex-col items-center justify-center rounded-[2.25rem] transition-all duration-300 ${
        isEmbedded
          ? 'min-h-[560px] sm:min-h-[600px] py-10 px-5 shadow-[0_25px_60px_rgba(0,0,0,0.95),0_0_35px_rgba(255,7,58,0.2)] border border-white/15'
          : 'min-h-[600px] my-auto py-12 px-6 shadow-[0_30px_70px_rgba(0,0,0,0.98),0_0_45px_rgba(255,7,58,0.25)] border border-white/20'
      } ${className}`}
      style={{ touchAction: 'pan-y' }}
    >
      {/* 1. Background Slider Container */}
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

      {/* 2. Overlay escura principal */}
      <div className="absolute inset-0 w-full h-full z-[1] pointer-events-none bg-gradient-to-b from-black/85 via-black/75 to-black/95" />

      {/* 3. Main Content Hub */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full w-full max-w-md mx-auto px-6 py-6 sm:py-8 animate-fade-in-up">
        {/* Foto de Perfil */}
        <div className="mb-4 relative">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full p-[2px] bg-gradient-to-tr from-white/20 to-white/50 backdrop-blur-sm shadow-2xl relative overflow-hidden">
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
        </div>

        {/* Título */}
        <h1 className="text-xs sm:text-sm font-light tracking-[0.3em] uppercase text-center mb-6 text-white/90 font-sans">
          Mateus Celestino
          <span className="text-[10px] tracking-[0.4em] text-white/60 mt-1 block">
            Digital Hub
          </span>
        </h1>

        {/* Apenas os Botões de WhatsApp e E-mail em Glassmorphism */}
        <div className="w-full flex flex-col gap-3 font-sans">
          {/* WhatsApp */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="glass-button w-full py-3.5 sm:py-4 px-4 rounded-2xl flex items-center justify-center group relative overflow-hidden bg-white/[0.05] hover:bg-white/[0.15] border border-white/[0.15] hover:border-white/30 backdrop-blur-md transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <span className="font-light tracking-wider text-xs sm:text-sm relative z-10 text-white">
              WHATSAPP
            </span>
          </a>

          {/* Email */}
          <a
            href={emailHref}
            className="glass-button w-full py-3.5 sm:py-4 px-4 rounded-2xl flex items-center justify-center group relative overflow-hidden bg-white/[0.05] hover:bg-white/[0.15] border border-white/[0.15] hover:border-white/30 backdrop-blur-md transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <span className="font-light tracking-wider text-xs sm:text-sm relative z-10 text-white">
              E-MAIL
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}

export default PhotografyContactHub;
