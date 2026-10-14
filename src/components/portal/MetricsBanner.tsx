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
    id: "articles",
    label: "Acervo Técnico Especializado",
    value: "176",
    subtext: "Artigos, guias práticos e arquiteturas",
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
    label: "Motor Gráfico WebGL",
    value: "60 FPS",
    subtext: "Shaders Three.js & OGL em tempo real",
    icon: Zap,
    badge: "CINEMATIC",
  },
];

export function MetricsBanner() {
  return (
    <section className="relative py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      {/* Barra de Status ao Vivo no Topo */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping absolute" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 relative" />
          </div>
          <span className="text-xs font-mono font-medium tracking-wider text-neutral-300 uppercase">
            STATUS DO NÚCLEO: <span className="text-emerald-400 font-bold">100% OPERACIONAL</span>
          </span>
          <span className="hidden sm:inline-block text-neutral-700">|</span>
          <span className="hidden sm:inline-block text-xs font-mono text-neutral-400">
            LATÊNCIA MÉDIA: 1.2ms
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-[10px] tracking-widest uppercase">
            POSTGRESQL + DRIZZLE ORM
          </Badge>
          <Badge variant="red" dot className="text-[10px] tracking-widest uppercase">
            APPLE GLASS 2026
          </Badge>
        </div>
      </div>

      {/* Grid de 4 Métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <GlassCard
              key={metric.id}
              variant="interactive"
              glow
              className="relative overflow-hidden group hover:scale-[1.02] transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-11 h-11 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 group-hover:text-red-300 group-hover:shadow-[0_0_20px_rgba(255,7,58,0.35)] transition-all">
                  <Icon className="w-5 h-5" />
                </div>
                {metric.badge && (
                  <span className="text-[10px] font-mono tracking-widest uppercase px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-neutral-300">
                    {metric.badge}
                  </span>
                )}
              </div>

              <div className="space-y-1">
                <div className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-white group-hover:text-red-400 transition-colors">
                  {metric.value}
                </div>
                <div className="text-sm font-semibold text-neutral-200">
                  {metric.label}
                </div>
                <p className="text-xs text-neutral-400 font-light leading-relaxed">
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
