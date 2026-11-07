'use client';

import React, { useState, useEffect } from 'react';

export interface ContatoSectionProps {
  profile?: {
    whatsapp?: string;
    email?: string;
    whatsappNumber?: string;
    [key: string]: any;
  };
}

const backgroundImages = [
  '/photografy-contato/l1.jpg',
  '/photografy-contato/l2.jpg',
  '/photografy-contato/l3.jpg',
  '/photografy-contato/l4.jpg',
  '/photografy-contato/l5.jpg',
];

export function ContatoSection({ profile }: ContatoSectionProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const whatsappLink =
    profile?.whatsapp ||
    'https://api.whatsapp.com/send/?phone=553197724257&text=QUERO+AUTOMATIZAR+TUDO.&type=phone_number&app_absent=0';

  const rawEmail = profile?.email || 'mcp6667@proton.me';
  const emailHref = rawEmail.startsWith('mailto:') ? rawEmail : `mailto:${rawEmail}`;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % backgroundImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section
      id="contato"
      className="scroll-mt-20 sm:scroll-mt-28 relative overflow-hidden w-full min-h-[80vh] sm:min-h-[90vh] flex flex-col items-center justify-center bg-black select-none"
    >
      {/* 1. Background Slider Container com Crossfade Suave */}
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
        {backgroundImages.map((src, index) => (
          <div
            key={src}
            className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1500 ease-in-out ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              backgroundImage: `url('${src}')`,
            }}
          />
        ))}
      </div>

      {/* 2. Overlay escura principal */}
      <div className="absolute inset-0 w-full h-full z-[1] pointer-events-none bg-gradient-to-b from-black/85 via-black/75 to-black/90" />

      {/* 3. Transição Black no Começo (Topo) - Suave */}
      <div className="absolute top-0 left-0 right-0 h-32 sm:h-48 z-[2] pointer-events-none bg-gradient-to-b from-black via-black/90 to-transparent" />

      {/* 4. Transição Black no Fim (Rodapé) - Suave */}
      <div className="absolute bottom-0 left-0 right-0 h-32 sm:h-48 z-[2] pointer-events-none bg-gradient-to-t from-black via-black/90 to-transparent" />

      {/* 5. Main Content Hub - Centralizado e Focado */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-md mx-auto px-6 py-20 sm:py-28 animate-fade-in-up">
        
        {/* Foto de Perfil com Borda Gradiente */}
        <div className="mb-4 relative">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full p-[2px] bg-gradient-to-tr from-white/20 to-white/50 backdrop-blur-sm shadow-2xl">
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
        <h2 className="text-xs sm:text-sm font-light tracking-[0.3em] uppercase text-center mb-8 text-white/90">
          Mateus Celestino<br />
          <span className="text-[10px] tracking-[0.4em] text-white/60 mt-1 block">Digital Hub</span>
        </h2>

        {/* Botões Exclusivos: WHATSAPP e E-MAIL */}
        <div className="w-full flex flex-col gap-3.5">
          {/* WhatsApp */}
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 sm:py-4 px-5 rounded-2xl flex items-center justify-center text-center transition-all duration-300 bg-white/[0.05] hover:bg-white/[0.15] backdrop-blur-md border border-white/15 hover:border-white/35 hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-[0_0_25px_rgba(255,255,255,0.1)] group cursor-pointer"
          >
            <span className="font-medium tracking-wider text-xs sm:text-sm text-white relative z-10 font-sans">
              WHATSAPP
            </span>
          </a>

          {/* E-mail */}
          <a
            href={emailHref}
            className="w-full py-3.5 sm:py-4 px-5 rounded-2xl flex items-center justify-center text-center transition-all duration-300 bg-white/[0.05] hover:bg-white/[0.15] backdrop-blur-md border border-white/15 hover:border-white/35 hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-[0_0_25px_rgba(255,255,255,0.1)] group cursor-pointer"
          >
            <span className="font-medium tracking-wider text-xs sm:text-sm text-white relative z-10 font-sans">
              E-MAIL
            </span>
          </a>
        </div>

      </div>
    </section>
  );
}

export default ContatoSection;
