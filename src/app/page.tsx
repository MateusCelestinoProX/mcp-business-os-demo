'use client';

import React, { useState, useEffect, useRef } from 'react';
import LiquidGlassBackground from '@/components/portal/LiquidGlassBackground';
import OriginalHeader from '@/components/portal/OriginalHeader';
import MetricsBanner from '@/components/portal/MetricsBanner';
import MainNotionLayout from '@/components/portal/MainNotionLayout';
import SobreSection from '@/components/portal/SobreSection';
import ContatoSection from '@/components/portal/ContatoSection';
import ArticleModal, { ArticleData } from '@/components/portal/ArticleModal';
import LegalModal from '@/components/portal/LegalModal';
import ShaderTransitionZone from '@/components/shaders/ShaderTransitionZone';
import { JsonLd } from '@/components/seo/JsonLd';
import { buildFaqSchema } from '@/services/seo/structured-data';

import rawArticles from '@/data/articles-summary.json';
import siteData from '@/data/siteData.json';

const HOME_FAQS = [
  {
    question: "O que é o MCP Business OS / Plataforma Unificada?",
    answer: "O MCP Business OS é a plataforma unificada soberana de hiperautomação, agentes autônomos de IA e cofre intelectual criada por Mateus Celestino Pro X, integrando n8n, Typebot, Drizzle ORM, Next.js e marketing open source."
  },
  {
    question: "Como funcionam os Agentes Autônomos de IA desenvolvidos por Mateus Celestino?",
    answer: "Os agentes de IA atuam de ponta a ponta na qualificação de leads, agendamento de reuniões, orquestração de APIs, suporte e inteligência de negócios operacional 24/7."
  },
  {
    question: "Quais tecnologias de automação open source são abordadas?",
    answer: "A plataforma foca em ferramentas robustas e de alta performance como n8n, Typebot, Mautic, Baserow, Docker, PostgreSQL e Next.js com shaders WebGL."
  },
  {
    question: "Como acessar os packs gratuitos (Automation Pack e WordPress Pack)?",
    answer: "Os recursos gratuitos estão disponíveis no Cofre Aberto (/biblioteca) da plataforma, com download direto de workflows e templates validados."
  }
];

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
    <div className="min-h-screen bg-transparent text-[#ececec] flex flex-col selection:bg-[#ff073a] selection:text-white relative overflow-x-hidden">
      {/* Schema.org FAQPage para Rich Results nos SERPs do Google */}
      <JsonLd data={buildFaqSchema(HOME_FAQS)} id="homepage-faq-schema" />

      <div className="flex-1 relative z-10">

        {/* =========================================================================
            1. HEADER AUTÊNTICO COM CAPA ANIMADA & SHADER 01: GRID SCAN (HERO CENTRALIZADO)
            ========================================================================= */}
        <OriginalHeader
          profile={siteData?.profile || {}}
          onNavigate={handleNavigate}
        />

        {/* =========================================================================
            MÉTRICAS DO ECOSSISTEMA SOBERANO (2 COLUNAS NO MOBILE)
            ========================================================================= */}
        <MetricsBanner />



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
