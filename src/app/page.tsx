'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
} from 'lucide-react';

import LiquidGlassBackground from '@/components/portal/LiquidGlassBackground';
import PortalNavbar from '@/components/portal/PortalNavbar';
import OriginalHeader from '@/components/portal/OriginalHeader';
import MainNotionLayout from '@/components/portal/MainNotionLayout';
import SobreSection from '@/components/portal/SobreSection';
import ContatoSection from '@/components/portal/ContatoSection';
import ArticleModal, { ArticleData } from '@/components/portal/ArticleModal';
import LegalModal from '@/components/portal/LegalModal';
import ShaderTransitionZone from '@/components/shaders/ShaderTransitionZone';
import ShaderBackground from '@/components/shaders/ShaderBackground';
import { EcosystemShowcase } from '@/components/portal/EcosystemShowcase';
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

  const handleOpenSearch = () => {
    const el = document.getElementById('publicacoes');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => {
      if (searchInputRef.current) searchInputRef.current.focus();
    }, 250);
  };

  return (
    <div className="min-h-screen bg-black text-[#ececec] flex flex-col selection:bg-[#ff073a] selection:text-white relative">
      {/* 0. Dynamic Liquid Carmesim Refraction Layer */}
      <LiquidGlassBackground />

      <main className="flex-1 relative z-10">
        {/* =========================================================================
            MAPA DE NAVEGAÇÃO SETORIAL ORIGINAL EM VIDRO LÍQUIDO (PORTAL NAVBAR)
            ========================================================================= */}
        <PortalNavbar
          onNavigate={handleNavigate}
          onOpenSearch={handleOpenSearch}
          profileWhatsapp={siteData?.profile?.whatsapp}
        />

        {/* =========================================================================
            1. HEADER AUTÊNTICO COM CAPA ANIMADA & SHADER 01: GRID SCAN (HERO CENTRALIZADO)
            ========================================================================= */}
        <OriginalHeader
          profile={siteData?.profile || {}}
          onNavigate={handleNavigate}
        />

        {/* ZONA DE TRANSIÇÃO 01 -> 02: Grid Scan -> Ripple Grid */}
        <ShaderTransitionZone
          from="GRID SCAN"
          to="RIPPLE GRID"
          index="01 // 02"
        />

        {/* =========================================================================
            2. ACERVO HISTÓRICO & TÉCNICO (176 ARTIGOS) & SHADER 02: RIPPLE GRID
            ========================================================================= */}
        <div id="publicacoes">
          <MainNotionLayout
            articles={articles}
            categories={siteData?.categories || []}
            profile={siteData?.profile || {}}
            onSelectArticle={(art) => setSelectedArticle(art)}
            searchInputRef={searchInputRef}
          />
        </div>

        {/* ZONA DE TRANSIÇÃO 02 -> 03: Ripple Grid -> Faulty Terminal */}
        <ShaderTransitionZone
          from="RIPPLE GRID"
          to="FAULTY TERMINAL"
          index="02 // 03"
        />

        {/* =========================================================================
            3. SOBRE MATEUS CELESTINO PRO X & SHADER 03: FAULTY TERMINAL
            ========================================================================= */}
        <div id="sobre">
          <SobreSection
            profile={siteData?.profile || {}}
          />
        </div>

        {/* ZONA DE TRANSIÇÃO 03 -> END: Faulty Terminal -> Terminal de Contato */}
        <ShaderTransitionZone
          from="FAULTY TERMINAL"
          to="TERMINAL DE CONTATO"
          index="03 // END"
        />


        {/* =========================================================================
            8. VITRINE DOS 4 ECOSSISTEMAS UNIFICADOS DE MATEUS CELESTINO PRO X
            ========================================================================= */}
        <EcosystemShowcase />

        {/* =========================================================================
            9. CANAL DIRETO & FORMULÁRIO DE CAPTURA DE LEADS DE ALTA CONVERSÃO
            ========================================================================= */}
        <div id="contato">
          <ContatoSection
            profile={siteData?.profile || {}}
          />
        </div>

        {/* =========================================================================
            10. BANNER FINAL DE FECHAMENTO SOBERANO
            ========================================================================= */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
          <div className="glass-crystal p-8 sm:p-14 rounded-3xl text-center space-y-6 border border-red-500/30 shadow-[0_0_50px_rgba(138,0,18,0.3)] relative overflow-hidden">
            {/* Fundo Cinemático Liquid Chrome em Vermelho Obscurecido */}
            <ShaderBackground mode="liquidchrome" colorHex="#8a0012" opacity={0.25} fixed={false} />

            <div className="relative z-10 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-950/40 border border-red-800/40 text-xs font-mono text-red-400 font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>ENGENHARIA DE SOFTWARE SOBERANA</span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight max-w-3xl mx-auto">
                Pronto para Unificar e Escalar Seu Ecossistema Tecnológico?
              </h2>

            <p className="text-sm sm:text-base text-neutral-300 font-light max-w-2xl mx-auto leading-relaxed">
              Junte-se à comunidade restrita, acesse o cofre com mais de 400 recursos confidenciais
              ou construa formulários cinemáticos com o Form Builder.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link href="/comunidade">
                <Button variant="fired" size="lg" className="gap-2 shadow-lg">
                  <Sparkles className="w-4 h-4" />
                  <span>Entrar na Área de Membros</span>
                </Button>
              </Link>
              <Link href="/builder">
                <Button variant="glass" size="lg" className="gap-2">
                  <span>Criar Formulário Agora</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
            </div>
          </div>
        </section>
      </main>

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
