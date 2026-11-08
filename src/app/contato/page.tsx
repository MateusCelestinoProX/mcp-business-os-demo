'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  MessageSquare, 
  Sparkles, 
  Send, 
  Radio 
} from 'lucide-react';
import ContatoSection from '@/components/portal/ContatoSection';
import { LeadCaptureForm } from '@/components/portal/LeadCaptureForm';
import siteData from '@/data/siteData.json';

export default function ContatoPage() {
  const [activeTab, setActiveTab] = useState<'hub' | 'formulario'>('hub');

  return (
    <div className="min-h-screen bg-transparent text-[#ececec] flex flex-col selection:bg-[#ff073a] selection:text-white relative">
      
      {/* Topo / Breadcrumb Mobile-First */}
      <div className="relative z-10 w-full pt-4 pb-2 px-4 sm:px-6 lg:px-10 xl:px-16">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3 border-b border-white/10">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl glass-crystal text-xs font-mono text-zinc-300 hover:text-white hover:border-[#ff073a]/50 transition-all cursor-pointer group min-h-[44px]"
              title="Voltar para a Home Page"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform text-[#ff073a]" />
              <span>Home Page</span>
            </Link>
            <span className="text-zinc-600 font-mono hidden sm:inline">/</span>
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-white px-2 py-1">
              <MessageSquare className="w-4 h-4 text-[#ff073a]" />
              <span>Digital Hub & Ativação de Projetos</span>
            </div>
          </div>

          <div className="flex items-center">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-[11px] font-mono font-semibold text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Canais Oficiais Ativos 24/7</span>
            </span>
          </div>
        </div>

        {/* Seletor Tátil de Modos: Hub Oficial vs Formulário de Projeto */}
        <div className="mt-4 flex items-center justify-center">
          <div className="w-full sm:w-auto flex p-1.5 rounded-2xl glass-pill border border-white/10">
            <button
              type="button"
              onClick={() => setActiveTab('hub')}
              className={`flex-1 sm:flex-initial px-4 sm:px-7 py-3 rounded-xl text-xs font-mono tracking-wider font-bold transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 min-h-[46px] ${
                activeTab === 'hub'
                  ? 'glass-button-fired text-white shadow-xl scale-[1.01]'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Radio className="w-3.5 h-3.5 text-[#ff073a]" />
              <span>CANAIS RÁPIDOS & WHATSAPP</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('formulario')}
              className={`flex-1 sm:flex-initial px-4 sm:px-7 py-3 rounded-xl text-xs font-mono tracking-wider font-bold transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 min-h-[46px] ${
                activeTab === 'formulario'
                  ? 'glass-button-fired text-white shadow-xl scale-[1.01]'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Send className="w-3.5 h-3.5 text-[#ff073a]" />
              <span>SOLICITAR PROPOSTA (LEAD)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Conteúdo Dinâmico */}
      <div className="flex-1 relative z-10">
        {activeTab === 'hub' ? (
          <ContatoSection profile={siteData?.profile || {}} />
        ) : (
          <div className="animate-fade-in">
            <LeadCaptureForm />
          </div>
        )}
      </div>

    </div>
  );
}

