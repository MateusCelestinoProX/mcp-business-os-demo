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
    <div className="min-h-screen bg-black text-[#ececec] flex flex-col selection:bg-[#ff073a] selection:text-white relative">
      {/* Dynamic Liquid Carmesim Refraction Layer */}
      <LiquidGlassBackground />

      <div className="relative z-10 w-full pt-4 pb-2 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Breadcrumb e Status do Shop */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-3 border-b border-white/10">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl glass-crystal text-xs font-mono text-zinc-400 hover:text-white hover:border-[#ff073a]/50 transition-all cursor-pointer group"
              title="Voltar ao Portal Institucional"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform text-[#ff073a]" />
              <span>Portal Institucional</span>
            </Link>
            <span className="text-zinc-600 font-mono">/</span>
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-white">
              <ShoppingBag className="w-4 h-4 text-[#ff073a]" />
              <span>Loja & Serviços Oficiais</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950/60 border border-red-500/40 text-[11px] font-mono font-semibold text-red-400">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff073a] animate-pulse" />
              <span>Atendimento Direto & Checkout Validado</span>
            </span>
          </div>
        </div>
      </div>

      <main className="flex-1 relative z-10">
        <ShopSection
          shopData={siteData?.shop || {}}
          onOpenContact={handleOpenContact}
        />
      </main>
    </div>
  );
}
