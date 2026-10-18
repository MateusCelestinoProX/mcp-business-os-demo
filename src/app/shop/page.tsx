'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingBag, ArrowLeft, ShieldCheck, Sparkles } from 'lucide-react';
import LiquidGlassBackground from '@/components/portal/LiquidGlassBackground';
import ShopSection from '@/components/portal/ShopSection';
import siteData from '@/data/siteData.json';

export default function ShopPage() {
  const handleOpenContact = () => {
    window.location.href = '/#contato';
  };

  return (
    <div className="min-h-screen bg-transparent text-[#ececec] flex flex-col selection:bg-[#ff073a] selection:text-white relative overflow-x-hidden">

      {/* Top Header & Breadcrumb Mobile-First */}
      <div className="relative z-10 w-full pt-2 sm:pt-4 pb-2 px-3 sm:px-6 lg:px-10 xl:px-16">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 sm:gap-4 py-2.5 sm:py-3 border-b border-white/10">
          
          {/* Navegação e Identificação */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-3 py-2 sm:py-1.5 rounded-xl glass-crystal text-xs font-mono text-zinc-300 hover:text-white active:scale-95 transition-all cursor-pointer group min-h-[44px] sm:min-h-[36px] border border-white/10 hover:border-[#ff073a]/50 touch-manipulation"
              title="Voltar ao Portal Institucional"
              aria-label="Voltar ao Portal Institucional"
            >
              <ArrowLeft className="w-4 h-4 sm:w-3.5 sm:h-3.5 group-hover:-translate-x-1 group-active:-translate-x-1 transition-transform text-[#ff073a] shrink-0" />
              <span className="font-medium">Portal</span>
            </Link>
            <span className="text-zinc-600 font-mono text-xs">/</span>
            <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-mono font-bold text-white tracking-wide">
              <ShoppingBag className="w-4 h-4 text-[#ff073a] shrink-0" />
              <span className="truncate">Loja & Serviços Oficiais</span>
            </div>
          </div>

          {/* Badge de Status e Garantia (adaptativo: enxuto no mobile, completo no desktop) */}
          <div className="flex items-center self-start sm:self-auto">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-950/70 border border-red-500/40 text-[11px] font-mono font-semibold text-red-300 shadow-[0_0_15px_rgba(255,7,58,0.15)]">
              <span className="w-2 h-2 rounded-full bg-[#ff073a] animate-pulse shrink-0" />
              <span className="sm:hidden">Checkout & Suporte 24/7</span>
              <span className="hidden sm:inline">Atendimento Direto & Checkout Validado</span>
            </span>
          </div>

        </div>
      </div>

      <div className="flex-1 relative z-10 w-full">
        <ShopSection
          shopData={siteData?.shop || {}}
          onOpenContact={handleOpenContact}
        />
      </div>
    </div>
  );
}
