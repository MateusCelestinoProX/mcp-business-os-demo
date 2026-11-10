'use client';

import React from 'react';

export interface ContatoSectionProps {
  profile?: {
    whatsapp?: string;
    email?: string;
    whatsappNumber?: string;
    [key: string]: any;
  };
}

/**
 * ContatoSection
 * Injeta a page base de contato (photografy-fotografia-contato) com proporção
 * vertical otimizada (sem lacunas excessivas entre sessões), envolvida pelo
 * ambiente de blackout total da Plataforma Unificada.
 */
export function ContatoSection({ profile }: ContatoSectionProps) {
  return (
    <section
      id="contato-hub"
      className="relative w-full h-[460px] sm:h-[520px] lg:h-[560px] min-h-[440px] bg-[#000000] flex items-center justify-center overflow-hidden select-none"
    >
      <iframe
        src="https://photografy-fotografia-contato.vercel.app/"
        title="Mateus Celestino — Digital Hub Contato"
        className="w-full h-full border-0 select-none block bg-black"
        allow="autoplay; clipboard-write"
      />
    </section>
  );
}

export default ContatoSection;
