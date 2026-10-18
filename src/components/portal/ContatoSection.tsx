'use client';

import React from 'react';
import { PhotografyContactHub } from './PhotografyContactHub';
import LineWavesShader from '@/components/shaders/LineWavesShader';

export interface ContatoSectionProps {
  profile?: {
    whatsapp?: string;
    email?: string;
    tallyForm?: string;
    whatsappNumber?: string;
  };
}

export function ContatoSection({ profile }: ContatoSectionProps) {
  const whatsappLink =
    profile?.whatsapp ||
    'https://api.whatsapp.com/send/?phone=553197724257&text=QUERO+AUTOMATIZAR+TUDO.&type=phone_number&app_absent=0';

  const email = profile?.email || 'CONTATO-SMARTFLOW@proton.me';

  return (
    <section id="contato" className="scroll-mt-28 py-12 lg:py-20 min-h-[calc(100vh-4rem)] flex flex-col justify-center relative overflow-hidden w-full">
      {/* 0. Shader WebGL Dedicado da Sessão Contato: LineWaves Fluido Encorpado */}
      <LineWavesShader
        className="z-0 mix-blend-screen pointer-events-none"
        color1="#ff073a"
        color2="#b80018"
        color3="#66000c"
        opacity={0.65}
        speed={0.26}
        warpIntensity={0.85}
      />

      {/* Zonas de Transição Internas com Blur e Escurecimento Progressivo */}
      <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-black/80 via-black/40 to-transparent pointer-events-none z-1" />
      <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none z-1" />

      <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-16 relative z-10 flex-1 flex flex-col justify-center">
        {/* Social Card Soberano em Largura Completa */}
        <PhotografyContactHub
          isEmbedded={true}
          whatsappUrl={whatsappLink}
          email={email}
        />
      </div>
    </section>
  );
}

export default ContatoSection;
