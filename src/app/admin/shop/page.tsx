import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Shield, ShoppingBag, Sparkles } from 'lucide-react';
import { ShopControlSuite } from '@/components/admin/ShopControlSuite';

export const metadata: Metadata = {
  title: 'Shop & Cards Manager — Painel Admin | Mateus Celestino Pro X',
  description: 'Gerenciador soberano da Loja Virtual, heros, banners alternados e criador de cards com Markdown e botão único Saiba mais.',
};

export default function AdminShopPage() {
  return (
    <div className="relative min-h-screen bg-[#07070a] text-white pt-24 pb-24 px-4 sm:px-6 lg:px-8 selection:bg-red-600 selection:text-white">
      {/* Luzes de Ambientação e Shaders */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <div className="absolute -top-40 left-1/4 w-[700px] h-[600px] bg-red-600/10 blur-[180px] rounded-full" />
        <div className="absolute top-1/2 right-10 w-[500px] h-[500px] bg-red-800/10 blur-[160px] rounded-full" />
        <div className="absolute -bottom-20 left-10 w-[600px] h-[500px] bg-zinc-900/50 blur-[170px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto space-y-6">
        {/* Breadcrumb Soberano */}
        <div className="flex items-center justify-between text-xs font-mono text-neutral-400 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 hover:text-white transition-colors py-1 px-2.5 rounded-lg bg-white/5 border border-white/10"
              title="Voltar ao Painel Admin"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#ff073a]" />
              <span>Voltar ao Painel Admin</span>
            </Link>
            <span className="text-neutral-600">/</span>
            <span className="text-[#ff073a] font-semibold flex items-center gap-1.5">
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Shop Manager</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-300 font-mono">
              <Shield className="w-3 h-3 text-[#ff073a]" />
              <span>ADMIN SOVEREIGN SESSION</span>
            </span>
            <Link
              href="/shop"
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1 text-[11px] text-zinc-300 hover:text-white transition-colors px-2 py-0.5 rounded-md bg-white/5 border border-white/5"
            >
              <Sparkles className="w-3 h-3 text-[#ff073a]" />
              <span>Abrir Loja (/shop) ↗</span>
            </Link>
          </div>
        </div>

        {/* Suite Completa de Gestão da Loja Virtual e Cards */}
        <ShopControlSuite />
      </div>
    </div>
  );
}
