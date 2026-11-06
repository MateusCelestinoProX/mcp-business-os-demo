"use client";

import React from "react";
import { Terminal, Cpu, ShieldCheck, Sparkles, Database, Layers, Flame, Zap } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/Badge";

interface MetricItem {
  id: string;
  label: string;
  value: string;
  subtext: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

const metrics: MetricItem[] = [
  {
    id: "agents",
    label: "Agentes Autônomos de IA",
    value: "24/7",
    subtext: "Esteiras inteligentes, SDRs e automações",
    icon: Terminal,
    badge: "PRO X",
  },
  {
    id: "ecosystems",
    label: "Ecossistemas Unificados",
    value: "4 em 1",
    subtext: "Portal, Membros, Form Builder e Cofre",
    icon: Layers,
    badge: "SOBERANO",
  },
  {
    id: "vault",
    label: "Recursos Ocultos no Cofre",
    value: "406+",
    subtext: "Blueprints, scripts, automações n8n e IA",
    icon: Database,
    badge: "ZERO-TOUCH",
  },
  {
    id: "performance",
    label: "Desempenho Visual",
    value: "60 FPS",
    subtext: "Renderização fluida e zero latência",
    icon: Zap,
    badge: "SISTEMA",
  },
];

export function MetricsBanner() {
  return (
    <section className="relative py-8 sm:py-12 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      {/* Barra de Status ao Vivo no Topo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4 mb-6 sm:mb-8 pb-3 sm:pb-4 border-b border-white/5">
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <div className="relative flex items-center justify-center shrink-0">
            <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-emerald-500 animate-ping absolute" />
            <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-emerald-500 relative" />
          </div>
          <span className="text-[10px] sm:text-xs font-mono font-medium tracking-wider text-neutral-300 uppercase">
            STATUS DO NÚCLEO: <span className="text-emerald-400 font-bold">100% OPERACIONAL</span>
          </span>
          <span className="hidden md:inline-block text-neutral-700">|</span>
          <span className="hidden md:inline-block text-xs font-mono text-neutral-400">
            LATÊNCIA MÉDIA: 1.2ms
          </span>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
          <Badge variant="outline" className="text-[9px] sm:text-[10px] tracking-wider sm:tracking-widest uppercase">
            POSTGRESQL UNIFICADO
          </Badge>
          <Badge variant="red" dot className="text-[9px] sm:text-[10px] tracking-wider sm:tracking-widest uppercase">
            LIQUID GLASS
          </Badge>
        </div>
      </div>

      {/* Grid Responsivo de 4 Métricas: 2 colunas no mobile (360px a 430px) e 4 colunas no desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 md:gap-5">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <GlassCard
              key={metric.id}
              variant="interactive"
              glow
              className="relative overflow-hidden group hover:scale-[1.02] transition-all duration-300 p-3 sm:p-4 md:p-5 rounded-2xl"
            >
              <div className="flex items-start justify-between gap-1 mb-2.5 sm:mb-4">
                <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 group-hover:text-red-300 group-hover:shadow-[0_0_20px_rgba(255,7,58,0.35)] transition-all shrink-0">
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                {metric.badge && (
                  <span className="text-[8px] xs:text-[9px] sm:text-[10px] font-mono tracking-wider sm:tracking-widest uppercase px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-neutral-300 shrink-0">
                    {metric.badge}
                  </span>
                )}
              </div>

              <div className="space-y-1">
                <div className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-black font-mono tracking-tight text-white group-hover:text-red-400 transition-colors">
                  {metric.value}
                </div>
                <div className="text-xs sm:text-sm font-semibold text-neutral-200 leading-snug line-clamp-2">
                  {metric.label}
                </div>
                <p className="text-[10px] sm:text-xs text-neutral-400 font-light leading-relaxed line-clamp-2">
                  {metric.subtext}
                </p>
              </div>

              {/* Linha decorativa carmesim inferior */}
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-red-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </GlassCard>
          );
        })}
      </div>
    </section>
  );
}

export default MetricsBanner;
