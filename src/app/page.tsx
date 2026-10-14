'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Star,
  Quote,
  CheckCircle,
  ExternalLink,
  Lock,
  Layers,
  ArrowRight,
  BookOpen,
} from 'lucide-react';

import LiquidGlassBackground from '@/components/portal/LiquidGlassBackground';
import PortalNavbar from '@/components/portal/PortalNavbar';
import OriginalHeader from '@/components/portal/OriginalHeader';
import MainNotionLayout from '@/components/portal/MainNotionLayout';
import RecursosSection from '@/components/portal/RecursosSection';
import ShopSection from '@/components/portal/ShopSection';
import SobreSection from '@/components/portal/SobreSection';
import ContatoSection from '@/components/portal/ContatoSection';
import ArticleModal, { ArticleData } from '@/components/portal/ArticleModal';
import LegalModal from '@/components/portal/LegalModal';
import ShaderTransitionZone from '@/components/shaders/ShaderTransitionZone';
import { MetricsBanner } from '@/components/portal/MetricsBanner';
import { EcosystemShowcase } from '@/components/portal/EcosystemShowcase';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

import rawArticles from '@/data/articles.json';
import siteData from '@/data/siteData.json';

interface Testimonial {
  name: string;
  role: string;
  company: string;
  quote: string;
  impact: string;
  stars: number;
}

const testimonials: Testimonial[] = [
  {
    name: "Dr. Roberto Guimarães",
    role: "Diretor de Operações",
    company: "HealthTech Solutions",
    quote:
      "A implementação dos fluxos no n8n e atendimento com IA pelo Mateus reduziu nosso tempo de triagem de 45 minutos para 30 segundos, economizando mais de R$ 180 mil por trimestre.",
    impact: "+92% Eficiência Operacional",
    stars: 5,
  },
  {
    name: "Juliana Mendes",
    role: "Head de Growth",
    company: "Apex Media Scale",
    quote:
      "O ecossistema de formulários dinâmicos e rastreio de tráfego com TikTok Ads e Meta Ads elevou nossa taxa de conversão de 3.2% para impressionantes 11.8% em 2 semanas.",
    impact: "+268% Conversão de Tráfego",
    stars: 5,
  },
  {
    name: "Carlos Eduardo Silveira",
    role: "Founder & CTO",
    company: "Nexus Cloud B2B",
    quote:
      "A blindagem dos nossos servidores Linux e a criação da esteira de dados autônoma nos deram a soberania tecnológica que nenhum serviço SaaS genérico conseguiu entregar.",
    impact: "99.99% Uptime Soberano",
    stars: 5,
  },
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

        {/* ZONA DE TRANSIÇÃO 02 -> 03: Ripple Grid -> Arc Lightning */}
        <ShaderTransitionZone
          from="RIPPLE GRID"
          to="ARC LIGHTNING"
          index="02 // 03"
        />

        {/* =========================================================================
            3. RECURSOS & PACKS OFICIAIS & SHADER 03: ARC LIGHTNING
            ========================================================================= */}
        <div id="recursos">
          <RecursosSection
            recursos={siteData?.recursos || []}
            onOpenContact={() => handleNavigate('contato')}
          />
        </div>

        {/* ZONA DE TRANSIÇÃO 03 -> 04: Arc Lightning -> Balatro Vortex */}
        <ShaderTransitionZone
          from="ARC LIGHTNING"
          to="BALATRO VORTEX"
          index="03 // 04"
        />

        {/* =========================================================================
            4. LOJA & SERVIÇOS DE AUTOMAÇÃO & SHADER 04: BALATRO VORTEX
            ========================================================================= */}
        <div id="shop">
          <ShopSection
            shopData={siteData?.shop || {}}
            onOpenContact={() => handleNavigate('contato')}
          />
        </div>

        {/* ZONA DE TRANSIÇÃO 04 -> 05: Balatro Vortex -> Faulty Terminal */}
        <ShaderTransitionZone
          from="BALATRO VORTEX"
          to="FAULTY TERMINAL"
          index="04 // 05"
        />

        {/* =========================================================================
            5. SOBRE MATEUS CELESTINO PRO X & SHADER 05: FAULTY TERMINAL
            ========================================================================= */}
        <div id="sobre">
          <SobreSection
            profile={siteData?.profile || {}}
          />
        </div>

        {/* ZONA DE TRANSIÇÃO 05 -> END: Faulty Terminal -> Terminal de Contato */}
        <ShaderTransitionZone
          from="FAULTY TERMINAL"
          to="TERMINAL DE CONTATO"
          index="05 // END"
        />

        {/* =========================================================================
            6. SEÇÃO DE PROVA SOCIAL E CASOS DE SUCESSO COMPROVADOS
            ========================================================================= */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full relative">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-pill-red text-xs font-mono text-[#ff073a] uppercase tracking-widest font-bold">
              <Star className="w-3.5 h-3.5 fill-[#ff073a]" />
              <span>RESULTADOS COMPROVADOS EM CAMPO</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Impacto Mensurável e Soberania Real
            </h2>
            <p className="text-sm sm:text-base text-neutral-400 font-light leading-relaxed">
              Soluções aplicadas em operações de alta complexidade que exigem zero falhas, 
              sigilo total e automações de ponta a ponta.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, idx) => (
              <GlassCard
                key={idx}
                variant="interactive"
                glow
                className="flex flex-col justify-between p-7 rounded-3xl border border-white/10 hover:border-red-500/40 transition-all duration-300"
              >
                <div className="space-y-4">
                  {/* Estrelas & Badge de Impacto */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(t.stars)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400" />
                      ))}
                    </div>
                    <Badge variant="red" className="text-[10px] uppercase">
                      {t.impact}
                    </Badge>
                  </div>

                  {/* Citação */}
                  <p className="text-sm text-neutral-300 font-light leading-relaxed italic">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                </div>

                {/* Autor */}
                <div className="pt-6 mt-6 border-t border-white/5 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-600 to-black border border-white/20 flex items-center justify-center font-bold font-mono text-xs text-white shrink-0">
                    {t.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{t.name}</h4>
                    <p className="text-xs text-neutral-400 font-mono">
                      {t.role} • <span className="text-neutral-300">{t.company}</span>
                    </p>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </section>

        {/* =========================================================================
            7. STATUS DO NÚCLEO E MÉTRICAS
            ========================================================================= */}
        <MetricsBanner />

        {/* =========================================================================
            8. VITRINE DOS 4 ECOSSISTEMAS UNIFICADOS DA PLATAFORMA SOBERANA
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
          <div className="glass-crystal p-8 sm:p-14 rounded-3xl text-center space-y-6 border border-red-500/30 shadow-[0_0_50px_rgba(255,7,58,0.2)] relative overflow-hidden">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-600/20 border border-red-500/40 text-xs font-mono text-red-400 font-bold uppercase tracking-wider">
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
