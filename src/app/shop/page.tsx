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
    <div className="min-h-screen bg-transparent text-[#ececec] flex flex-col selection:bg-[#ff073a] selection:text-white relative">

      <div className="relative z-10 w-full pt-4 pb-2 px-4 sm:px-6 lg:px-10 xl:px-16">
        {/* Breadcrumb e Status do Shop Otimizado para Mobile */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3 border-b border-white/10">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl glass-crystal text-xs font-mono text-zinc-300 hover:text-white hover:border-[#ff073a]/50 transition-all cursor-pointer group min-h-[44px]"
              title="Voltar ao Portal Institucional"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform text-[#ff073a]" />
              <span>Portal Institucional</span>
            </Link>
            <span className="text-zinc-600 font-mono hidden sm:inline">/</span>
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-white px-2 py-1">
              <ShoppingBag className="w-4 h-4 text-[#ff073a]" />
              <span>Loja & Serviços Oficiais</span>
            </div>
          </div>

          <div className="flex items-center">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-950/60 border border-red-500/40 text-[11px] font-mono font-semibold text-red-400">
              <span className="w-2 h-2 rounded-full bg-[#ff073a] animate-pulse" />
              <span>Atendimento Direto & Checkout Validado</span>
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 relative z-10">
        <ShopSection
          shopData={siteData?.shop || {}}
          onOpenContact={handleOpenContact}
        />
      </div>
    </div>
  );
}
