'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
} from 'lucide-react';

import LiquidGlassBackground from '@/components/portal/LiquidGlassBackground';
import OriginalHeader from '@/components/portal/OriginalHeader';
import MainNotionLayout from '@/components/portal/MainNotionLayout';
import SobreSection from '@/components/portal/SobreSection';
import ContatoSection from '@/components/portal/ContatoSection';
import ArticleModal, { ArticleData } from '@/components/portal/ArticleModal';
import LegalModal from '@/components/portal/LegalModal';
import ShaderTransitionZone from '@/components/shaders/ShaderTransitionZone';
import { Button } from '@/components/ui/Button';

import rawArticles from '@/data/articles-summary.json';
import siteData from '@/data/siteData.json';

export default function HomePage() {
  const articles = rawArticles as ArticleData[];
  const [selectedArticle, setSelectedArticle] = useState<ArticleData | null>(null);
  const [legalModalType, setLegalModalType] = useState<'privacidade' | 'termos' | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Atalho global Cmd+K / Ctrl+K para busca instantânea de artigos
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        const el = document.getElementById('publicacoes');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => {
          if (searchInputRef.current) searchInputRef.current.focus();
        }, 250);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleNavigate = (tabId: string) => {
    if (tabId === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (tabId === 'shop') {
      window.location.href = '/shop';
      return;
    }
    const el = document.getElementById(tabId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-transparent text-[#ececec] flex flex-col selection:bg-[#ff073a] selection:text-white relative">
      <div className="flex-1 relative z-10">

        {/* =========================================================================
            1. HEADER AUTÊNTICO COM CAPA ANIMADA & SHADER 01: GRID SCAN (HERO CENTRALIZADO)
            ========================================================================= */}
        <OriginalHeader
          profile={siteData?.profile || {}}
          onNavigate={handleNavigate}
        />

        {/* ZONA DE TRANSIÇÃO 01 -> 02: Hero -> Acervo */}
        <ShaderTransitionZone
          from="HERO PORTAL"
          to="ACERVO TÉCNICO"
          index="01 // 02"
        />

        {/* =========================================================================
            2. ACERVO HISTÓRICO & TÉCNICO (176 ARTIGOS)
            ========================================================================= */}
        <div>
          <MainNotionLayout
            articles={articles}
            categories={siteData?.categories || []}
            profile={siteData?.profile || {}}
            onSelectArticle={(art) => setSelectedArticle(art)}
            searchInputRef={searchInputRef}
          />
        </div>

        {/* ZONA DE TRANSIÇÃO 02 -> 03: Acervo -> Sobre */}
        <ShaderTransitionZone
          from="ACERVO TÉCNICO"
          to="SOBRE O AUTOR"
          index="02 // 03"
        />

        {/* =========================================================================
            3. SOBRE MATEUS CELESTINO PRO X
            ========================================================================= */}
        <div>
          <SobreSection
            profile={siteData?.profile || {}}
          />
        </div>

        {/* ZONA DE TRANSIÇÃO 03 -> END: Sobre -> Contato */}
        <ShaderTransitionZone
          from="SOBRE O AUTOR"
          to="CANAL DIRETO"
          index="03 // END"
        />


        {/* =========================================================================
            8. CANAL DIRETO & FORMULÁRIO DE CAPTURA DE LEADS DE ALTA CONVERSÃO
            ========================================================================= */}
        <div>
          <ContatoSection
            profile={siteData?.profile || {}}
          />
        </div>

        {/* =========================================================================
            9. BANNER FINAL DE FECHAMENTO SOBERANO
            ========================================================================= */}
        <section className="py-16 px-4 sm:px-6 lg:px-10 xl:px-16 w-full">
          <div className="glass-crystal p-8 sm:p-14 rounded-3xl text-center space-y-6 border border-red-500/40 shadow-[0_0_60px_rgba(255,7,58,0.25),0_25px_60px_rgba(0,0,0,0.85)] relative overflow-hidden">
            {/* Fundo Cinemático Gradiente Carmesim em Vidro */}
            <div 
              className="absolute inset-0 pointer-events-none opacity-40"
              style={{
                background: 'radial-gradient(circle at 50% 50%, rgba(255, 7, 58, 0.28) 0%, rgba(138, 0, 18, 0.15) 50%, transparent 80%)'
              }}
            />

            <div className="relative z-10 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-950/40 border border-red-800/40 text-xs font-mono text-red-400 font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>ENGENHARIA DE SOFTWARE SOBERANA</span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight max-w-3xl mx-auto">
                Pronto para Unificar e Escalar Seu Ecossistema Tecnológico?
              </h2>

            <p className="text-sm sm:text-base text-neutral-300 font-light max-w-2xl mx-auto leading-relaxed">
              Junte-se à comunidade restrita, acesse o acervo com centenas de recursos confidenciais
              e acelere sua operação com arquitetura de inteligência artificial de alta performance.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link href="/comunidade">
                <Button variant="fired" size="lg" className="gap-2 shadow-lg">
                  <Sparkles className="w-4 h-4" />
                  <span>Entrar na Área de Membros</span>
                </Button>
              </Link>
              <Link href="/shop">
                <Button variant="glass" size="lg" className="gap-2">
                  <span>Conhecer a Loja de Ativos</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
            </div>
          </div>
        </section>
      </div>

      {/* =========================================================================
          MODAL EDITORIAL DE LEITURA INTEGRAL DE ARTIGO (176 ARTIGOS)
          ========================================================================= */}
      {selectedArticle && (
        <ArticleModal
          article={selectedArticle}
          allArticles={articles}
          onClose={() => setSelectedArticle(null)}
          onSelectArticle={(art) => setSelectedArticle(art)}
          onOpenContact={() => {
            setSelectedArticle(null);
            handleNavigate('contato');
          }}
        />
      )}

      {/* =========================================================================
          MODAIS LEGAIS (PRIVACIDADE & TERMOS)
          ========================================================================= */}
      {legalModalType === 'privacidade' && (
        <LegalModal
          title="Política de Privacidade"
          contentHtml={siteData?.legal?.privacidadeHtml || null}
          onClose={() => setLegalModalType(null)}
        />
      )}

      {legalModalType === 'termos' && (
        <LegalModal
          title="Termos de Uso"
          contentHtml={siteData?.legal?.termosHtml || null}
          onClose={() => setLegalModalType(null)}
        />
      )}
    </div>
  );
}
