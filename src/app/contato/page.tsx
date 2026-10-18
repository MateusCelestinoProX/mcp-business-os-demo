'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import ContatoSection from '@/components/portal/ContatoSection';
import siteData from '@/data/siteData.json';

export default function ContatoPage() {
  return (
    <div className="relative min-h-[100dvh] w-full bg-transparent text-[#ececec] flex flex-col selection:bg-[#ff073a] selection:text-white overflow-hidden">

      {/* Barra superior de retorno / navegação rápida */}
      <header className="fixed top-4 left-4 right-4 z-50 flex items-center justify-between pointer-events-none">
        <div className="pointer-events-auto">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 px-4 py-2 rounded-2xl glass-crystal text-xs font-mono text-zinc-300 hover:text-white hover:border-[#ff073a]/50 transition-all duration-300 shadow-2xl cursor-pointer"
            title="Voltar ao Portal Institucional"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform text-[#ff073a]" />
            <span>Portal Institucional</span>
          </Link>
        </div>

        <div className="pointer-events-auto hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/80 border border-white/10 text-[11px] font-mono text-zinc-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Canal de Contato Oficial Ativo</span>
        </div>
      </header>

      {/* Main Content: Sessão de Contato Soberana de Tamanho Completo */}
      <div className="flex-1 w-full h-full relative z-10 pt-16">
        <ContatoSection profile={siteData?.profile || {}} />
      </div>
    </div>
  );
}
