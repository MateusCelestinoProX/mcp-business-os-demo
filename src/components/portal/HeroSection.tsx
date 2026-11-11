"use client";

import React from "react";
import Link from "next/link";
import {
  Flame,
  Zap,
  ArrowRight,
  Shield,
  Layers,
  Sparkles,
  Users,
  Terminal,
  MessageSquare,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { GlassCard } from "@/components/ui/GlassCard";

interface HeroSectionProps {
  onExploreArticles?: () => void;
  onOpenLeadForm?: () => void;
}

export function HeroSection({ onExploreArticles, onOpenLeadForm }: HeroSectionProps) {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative pt-8 pb-16 md:pt-14 md:pb-24 overflow-hidden">
      {/* Background Ambient Glow & Refraction Lines */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[750px] h-[450px] bg-red-600/10 blur-[160px] rounded-full" />
        <div className="absolute top-10 left-10 w-[350px] h-[350px] bg-red-900/15 blur-[120px] rounded-full" />
        <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-red-500/10 blur-[140px] rounded-full" />
      </div>

      <div className="relative max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Top Badges de Autoridade Soberana */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 border border-red-500/30 backdrop-blur-2xl shadow-[0_0_20px_rgba(255,7,58,0.25)] max-w-full">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_10px_#ff073a] shrink-0" />
            <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-wider text-neutral-200 font-semibold truncate sm:overflow-visible">
              O PRIMEIRO SITE SOBRE AUTOMAÇÃO DO BRASIL
            </span>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-2xl">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-wider text-neutral-300 font-medium">
              4 ECOSSISTEMAS UNIFICADOS
            </span>
          </div>
        </div>

        {/* Título Principal Imponente & Responsivo */}
        <div className="mt-6 sm:mt-8 text-center max-w-5xl mx-auto space-y-4 sm:space-y-6">
          <div className="space-y-2">
            <span className="text-[11px] sm:text-sm font-mono tracking-widest text-red-500 font-bold uppercase block px-1">
              PORTAL INSTITUCIONAL & ARQUITETURA DE DADOS
            </span>
            <h1 className="text-3xl xs:text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.1] px-1 break-words">
              O Futuro Pertence a Quem{" "}
              <span className="relative inline-block">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-red-400 to-red-600 text-neon-red">
                  Automatiza.
                </span>
                <span
                  className="absolute -bottom-1 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-red-500 to-transparent shadow-[0_0_12px_#ff073a]"
                  aria-hidden="true"
                />
              </span>
            </h1>
          </div>

          <p className="text-sm sm:text-base md:text-xl text-neutral-300 font-light leading-relaxed max-w-3xl mx-auto px-2">
            A convergência definitiva da engenharia de software de <strong className="text-white font-semibold">Mateus Celestino Pro X</strong>: 
            hiperautomação com n8n, inteligência artificial generativa, formulários cinemáticos, 
            área de membros VIP e cofre oculto com mais de 400 ferramentas.
          </p>

          {/* Botões de Ação com Touch Targets Confortáveis de 44px */}
          <div className="pt-2 sm:pt-4 flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center justify-center gap-3 w-full max-w-2xl mx-auto px-2">
            {/* 1. Explorar Acervo */}
            <Button
              variant="fired"
              size="lg"
              className="gap-2.5 shadow-[0_0_35px_rgba(255,7,58,0.5)] hover:shadow-[0_0_50px_rgba(255,7,58,0.8)] min-h-[44px] w-full sm:w-auto justify-center"
              onClick={() => {
                if (onExploreArticles) {
                  onExploreArticles();
                } else {
                  scrollToSection("artigos");
                }
              }}
            >
              <Flame className="w-4 h-4 fill-white/20 shrink-0" />
              <span className="font-mono uppercase tracking-wider text-xs sm:text-sm font-bold">
                EXPLORAR OS 176 ARTIGOS
              </span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </Button>

            {/* 2. Contato / Demonstração */}
            <Link
              href="/contato"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl glass-crystal border border-red-500/30 text-white hover:text-white hover:border-red-500/60 shadow-[0_0_25px_rgba(255,7,58,0.25)] min-h-[44px] text-xs sm:text-sm font-mono font-bold uppercase tracking-wider active:scale-95 transition-all w-full sm:w-auto"
            >
              <MessageSquare className="w-4 h-4 text-red-400 shrink-0" />
              <span>ATENDIMENTO & CONTATO</span>
              <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            </Link>

            {/* 3. Infoprodutos */}
            <Link
              href="/comunidade"
              className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-amber-500/40 text-amber-300 hover:text-white min-h-[44px] text-xs sm:text-sm font-mono font-bold uppercase tracking-wider active:scale-95 transition-all w-full sm:w-auto"
            >
              <Users className="w-4 h-4 text-amber-400 shrink-0" />
              <span>COMUNIDADE VIP</span>
            </Link>
          </div>
        </div>

        {/* Pilares de Autoridade e Confiança */}
        <div className="mt-10 sm:mt-14 max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 pt-4 px-1">
          <div className="flex items-center gap-3 p-3.5 sm:p-4 rounded-xl bg-white/[0.02] border border-white/5">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <div className="text-left">
              <div className="text-xs font-bold text-white uppercase tracking-wider">
                Infraestrutura Soberana
              </div>
              <div className="text-[11px] text-neutral-400">
                100% autônoma em Linux, Docker e PostgreSQL
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 sm:p-4 rounded-xl bg-white/[0.02] border border-white/5">
            <Shield className="w-5 h-5 text-red-400 shrink-0" />
            <div className="text-left">
              <div className="text-xs font-bold text-white uppercase tracking-wider">
                Blindagem e Performance
              </div>
              <div className="text-[11px] text-neutral-400">
                Shaders a 60 FPS e Glassmorphism responsivo
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 sm:p-4 rounded-xl bg-white/[0.02] border border-white/5">
            <Zap className="w-5 h-5 text-amber-400 shrink-0" />
            <div className="text-left">
              <div className="text-xs font-bold text-white uppercase tracking-wider">
                Tráfego de Alta Conversão
              </div>
              <div className="text-[11px] text-neutral-400">
                Captura nativa de UTMs TikTok e Meta Ads
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
