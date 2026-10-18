'use client';

import React from "react";
import Link from "next/link";
import { Shield, FileText, CheckCircle2 } from "lucide-react";
import SilkShader from "@/components/shaders/SilkShader";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative z-20 mt-16 sm:mt-20 border-t border-red-500/30 bg-[#0c0003]/95 shadow-[0_-25px_60px_rgba(180,0,25,0.3)] overflow-hidden w-full pb-20 sm:pb-10">
      {/* Shader WebGL do Rodapé: Silk Líquido Carmesim */}
      <SilkShader
        className="z-0 mix-blend-screen pointer-events-none"
        color="#b80018"
        opacity={0.22}
        speed={0.18}
      />

      {/* Linha superior de iluminação especular do vidro com halo carmesim */}
      <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-red-500/70 to-transparent pointer-events-none" />
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[700px] h-32 bg-red-600/30 blur-[90px] pointer-events-none" />

      {/* Brilho fluido de energia vermelha na base do rodapé */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-red-950/40 via-red-900/10 to-transparent pointer-events-none" />

      <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-16 py-8 sm:py-10 relative z-10 flex flex-col items-center justify-center gap-5 sm:gap-6">

        {/* Botões de Acesso Rápido a Privacidade e Termos */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6">
          <Link
            href="/privacidade"
            className="inline-flex items-center gap-2 min-h-[44px] px-4 sm:px-5 py-2.5 rounded-2xl glass-crystal text-xs font-mono text-neutral-200 hover:text-white border border-white/10 hover:border-red-500/60 hover:shadow-[0_0_25px_rgba(255,7,58,0.35)] transition-all duration-300 group cursor-pointer touch-manipulation active:scale-95"
          >
            <Shield className="w-4 h-4 text-red-500 group-hover:scale-110 transition-transform shrink-0" />
            <span className="font-medium tracking-wide">Privacidade Blindada</span>
          </Link>

          <span className="w-1.5 h-1.5 rounded-full bg-red-500/50 hidden sm:block" />

          <Link
            href="/termos"
            className="inline-flex items-center gap-2 min-h-[44px] px-4 sm:px-5 py-2.5 rounded-2xl glass-crystal text-xs font-mono text-neutral-200 hover:text-white border border-white/10 hover:border-red-500/60 hover:shadow-[0_0_25px_rgba(255,7,58,0.35)] transition-all duration-300 group cursor-pointer touch-manipulation active:scale-95"
          >
            <FileText className="w-4 h-4 text-red-500 group-hover:scale-110 transition-transform shrink-0" />
            <span className="font-medium tracking-wide">Termos de Uso Soberanos</span>
          </Link>
        </div>

        {/* Separador de Energia Carmesim */}
        <div className="w-full max-w-xl h-[1px] bg-gradient-to-r from-transparent via-red-500/30 to-transparent" />

        {/* Identificação Oficial: Mateus Celestino Pro X */}
        <div className="text-center px-2">
          <div className="flex items-center justify-center gap-1.5 sm:gap-3 text-xs sm:text-sm font-mono text-neutral-300 flex-wrap">
            <span className="font-black tracking-wider uppercase text-white drop-shadow-[0_0_12px_rgba(255,7,58,0.4)]">
              MATEUS CELESTINO PRO X
            </span>
            <span className="text-red-500 font-bold">•</span>
            <span className="text-neutral-200 font-semibold">{currentYear}</span>
            <span className="text-red-500 font-bold hidden xs:inline">•</span>
            <span className="inline-flex items-center gap-1.5 text-neutral-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-red-500 shrink-0" />
              <span>Todos os direitos registrados.</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
