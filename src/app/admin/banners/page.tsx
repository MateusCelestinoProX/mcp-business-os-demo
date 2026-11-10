import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ArrowLeft, Shield, Sparkles, Flame, Megaphone } from 'lucide-react';
import { BannersControlSuite } from '@/components/admin/BannersControlSuite';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { getSession } from '@/lib/auth/session';

export const metadata: Metadata = {
  title: 'Banners & Exit-Intent — Painel Admin | Mateus Celestino Pro X',
  description: 'Gerenciador soberano de banners inteligentes, gatilhos de saída (Exit-Intent) e popups de onboarding por rotas.',
};

export default async function AdminBannersPage() {
  const session = await getSession();
  const isAllowed = session && (
    session.role === 'admin' ||
    (session as any).role === 'moder' ||
    (session as any).role === 'moderator'
  );

  if (!isAllowed) {
    redirect('/comunidade/login?redirectUrl=/admin/banners');
  }

  return (
    <div className="relative min-h-screen bg-[#07070a] text-white pt-4 pb-24 px-3 sm:px-6 lg:px-8 selection:bg-red-600 selection:text-white">
      {/* Luzes de Ambientação e Shaders */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <div className="absolute -top-40 left-1/4 w-[700px] h-[600px] bg-red-600/10 blur-[180px] rounded-full" />
        <div className="absolute top-1/2 right-10 w-[500px] h-[500px] bg-red-800/10 blur-[160px] rounded-full" />
        <div className="absolute -bottom-20 left-10 w-[600px] h-[500px] bg-zinc-900/50 blur-[170px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-[1720px] mx-auto">
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* COLUNA VERTICAL ESQUERDA: TODAS AS INTERNAL PAGES ESTÃO AQUI */}
          <AdminSidebar activeTab="banners" />

          {/* ÁREA PRINCIPAL DA PÁGINA INTERNA */}
          <div className="flex-1 min-w-0 w-full space-y-6">
            {/* Breadcrumb Soberano */}
            <div className="flex items-center justify-between text-xs font-mono text-neutral-400 flex-wrap gap-2 p-4 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-xl">
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
                <span className="text-white font-medium">Banners & Exit-Intent</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-emerald-400 font-bold uppercase tracking-wider text-[11px]">
                  Retenção em Tempo Real
                </span>
              </div>
            </div>

            {/* SUITE DE CONTROLE MESTRE DOS BANNERS */}
            <BannersControlSuite />
          </div>
        </div>
      </div>
    </div>
  );
}
