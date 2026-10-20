import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ArrowLeft, Shield, Sparkles, BookOpen } from 'lucide-react';
import { LibraryControlSuite } from '@/components/admin/LibraryControlSuite';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { getSession } from '@/lib/auth/session';

export const metadata: Metadata = {
  title: 'Library Control & Editor — Painel Admin | Mateus Celestino Pro X',
  description: 'Controle mestre de bibliotecas e editor de acervo intelectual com suporte a uploads do Mac e Nuvem.',
};

export default async function AdminLibraryControlPage() {
  const session = await getSession();
  const isAllowed = session && (
    session.role === 'admin' ||
    (session as any).role === 'moder' ||
    (session as any).role === 'moderator'
  );

  if (!isAllowed) {
    redirect('/comunidade/login?redirectUrl=/admin/library-control');
  }
  return (
    <div className="relative min-h-screen bg-[#07070a] text-white pt-24 pb-24 px-3 sm:px-6 lg:px-8 selection:bg-purple-500 selection:text-white">
      {/* Luzes de Ambientação & Shaders */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <div className="absolute -top-40 left-1/4 w-[700px] h-[600px] bg-purple-600/10 blur-[180px] rounded-full" />
        <div className="absolute top-1/2 right-10 w-[500px] h-[500px] bg-indigo-600/10 blur-[160px] rounded-full" />
        <div className="absolute -bottom-20 left-10 w-[600px] h-[500px] bg-red-600/5 blur-[170px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-[1720px] mx-auto">
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* COLUNA VERTICAL ESQUERDA: TODAS AS INTERNAL PAGES ESTÃO AQUI */}
          <AdminSidebar activeTab="library_control" />

          {/* ÁREA PRINCIPAL DA PÁGINA INTERNA */}
          <main className="flex-1 min-w-0 w-full space-y-6">
            {/* Breadcrumb Soberano */}
            <div className="flex items-center justify-between text-xs font-mono text-neutral-400 flex-wrap gap-2 p-4 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-xl">
              <div className="flex items-center gap-2">
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-1.5 hover:text-white transition-colors py-1 px-2.5 rounded-lg bg-white/5 border border-white/10"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Voltar ao Painel Admin</span>
                </Link>
                <span className="text-neutral-600">/</span>
                <span className="text-purple-400 font-semibold flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Library Control</span>
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-mono">
                  <Shield className="w-3 h-3" />
                  <span>ADMIN SOVEREIGN SESSION</span>
                </span>
                <Link
                  href="/biblioteca"
                  target="_blank"
                  className="hidden sm:inline-flex items-center gap-1 text-[11px] text-purple-300 hover:text-white transition-colors"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Abrir Hidden Library</span>
                </Link>
              </div>
            </div>

            {/* Suite Completa de Controle e Editor */}
            <LibraryControlSuite />
          </main>
        </div>
      </div>
    </div>
  );
}
