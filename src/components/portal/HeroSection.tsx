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

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Badges de Autoridade Soberana */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-black/60 border border-red-500/30 backdrop-blur-2xl shadow-[0_0_20px_rgba(255,7,58,0.25)]">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_10px_#ff073a]" />
            <span className="font-mono text-[11px] uppercase tracking-wider text-neutral-200 font-semibold">
              O PRIMEIRO SITE SOBRE AUTOMAÇÃO DO BRASIL
            </span>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-2xl">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-mono text-[11px] uppercase tracking-wider text-neutral-300 font-medium">
              4 ECOSSISTEMAS UNIFICADOS
            </span>
          </div>
        </div>

        {/* Título Principal Imponente */}
        <div className="mt-8 text-center max-w-5xl mx-auto space-y-6">
          <div className="space-y-2">
            <span className="text-xs sm:text-sm font-mono tracking-widest text-red-500 font-bold uppercase block">
              PORTAL INSTITUCIONAL & ARQUITETURA DE DADOS
            </span>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.08]">
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

          <p className="text-base sm:text-lg md:text-xl text-neutral-300 font-light leading-relaxed max-w-3xl mx-auto">
            A convergência definitiva da engenharia de software de <strong className="text-white font-semibold">Mateus Celestino Pro</strong>: 
            hiperautomação com n8n, inteligência artificial generativa, formulários cinemáticos, 
            área de membros VIP e cofre oculto com mais de 400 ferramentas.
          </p>

          {/* Botões de Ação com Brilho Neon */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Button
              variant="fired"
              size="lg"
              className="gap-3 shadow-[0_0_35px_rgba(255,7,58,0.5)] hover:shadow-[0_0_50px_rgba(255,7,58,0.8)]"
              onClick={() => {
                if (onExploreArticles) {
                  onExploreArticles();
                } else {
                  scrollToSection("artigos");
                }
              }}
            >
              <Flame className="w-4 h-4 fill-white/20" />
              <span className="font-mono uppercase tracking-wider text-xs sm:text-sm font-bold">
                EXPLORAR OS 176 ARTIGOS
              </span>
              <ArrowRight className="w-4 h-4" />
            </Button>

            <Button
              variant="glass"
              size="lg"
              className="gap-2.5 hover:border-red-500/40 hover:shadow-[0_0_30px_rgba(255,7,58,0.2)]"
              onClick={() => {
                if (onOpenLeadForm) {
                  onOpenLeadForm();
                } else {
                  scrollToSection("captura-leads");
                }
              }}
            >
              <MessageSquare className="w-4 h-4 text-red-400" />
              <span className="font-mono uppercase tracking-wider text-xs sm:text-sm">
                FALAR COM MATEUS PRO
              </span>
              <Zap className="w-3.5 h-3.5 text-amber-400" />
            </Button>
          </div>
        </div>

        {/* Pilares de Autoridade e Confiança */}
        <div className="mt-14 max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
          <div className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/5 backdrop-blur-md">
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

          <div className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/5 backdrop-blur-md">
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

          <div className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/5 backdrop-blur-md">
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
