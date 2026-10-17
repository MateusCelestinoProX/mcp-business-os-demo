"use client";

import React from "react";
import Link from "next/link";
import {
  Shield,
  Users,
  FileCode2,
  FolderGit2,
  ArrowUpRight,
  Zap,
} from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface EcosystemModule {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge: string;
  badgeVariant?: "default" | "red" | "gold" | "success" | "outline";
  glowColor: "red" | "gold" | "white";
  stats: string;
  features: string[];
  ctaText: string;
}

const ecosystems: EcosystemModule[] = [
  {
    id: "portal",
    title: "Branding Software & Portal",
    subtitle: "NÚCLEO INSTITUCIONAL",
    description:
      "A vitrine imponente de Mateus Celestino Pro com arquitetura de alta fidelidade visual, acervo com 176 guias técnicos e funis de conversão para tráfego pago.",
    href: "/",
    icon: Shield,
    badge: "SOBERANO",
    badgeVariant: "red",
    glowColor: "red",
    stats: "176 Artigos Publicados",
    features: [
      "Design System Liquid Glass Apple Dark",
      "Arquitetura modular de alta fidelidade",
      "Rastreamento avançado de UTMs",
      "Banco de dados unificado",
    ],
    ctaText: "Explorar Portal",
  },
  {
    id: "comunidade",
    title: "Área de Membros & Visuals",
    subtitle: "COMUNIDADE PRIVADA VIP",
    description:
      "Plataforma restrita para membros e assinantes com catálogo de mídias cinematográficas em alta definição, feed em tempo real e checkout Mercado Pago.",
    href: "/comunidade",
    icon: Users,
    badge: "ÁREA RESTRITA",
    badgeVariant: "gold",
    glowColor: "gold",
    stats: "Streaming HD Cinemático",
    features: [
      "Player de vídeos otimizado com telemetria",
      "Feed de comunicados em tempo real",
      "Checkout integrado Mercado Pago",
      "Controle de acesso por planos (VIP/Pro)",
    ],
    ctaText: "Entrar na Comunidade",
  },
  {
    id: "builder",
    title: "Form Builder Cinemático",
    subtitle: "CONSTRUTOR DE FORMULÁRIOS",
    description:
      "Editor visual de formulários multi-step com live preview cinemático em tempo real, submissões seguras e sincronização direta com Notion e Resend.",
    href: "/builder",
    icon: FileCode2,
    badge: "NO-CODE SAAS",
    badgeVariant: "default",
    glowColor: "red",
    stats: "Live Preview Instantâneo",
    features: [
      "Editor visual com múltiplos tipos de campo",
      "Rotas públicas dinâmicas /builder/f/[id]",
      "Notificações automáticas via email",
      "Webhooks e automação de CRM",
    ],
    ctaText: "Criar Formulário",
  },
  {
    id: "biblioteca",
    title: "Cofre Oculto de Recursos",
    subtitle: "BIBLIOTECA SECRET COVAULT",
    description:
      "Repositório soberano e zero-touch com mais de 400 ativos catalogados, incluindo prompts cinemáticos para Veo 3 e Nano Banana, automações n8n e scripts.",
    href: "/biblioteca",
    icon: FolderGit2,
    badge: "406 ATIVOS SECRETOS",
    badgeVariant: "outline",
    glowColor: "white",
    stats: "Acesso Livre & Imediato",
    features: [
      "Visualizador de PDFs, Markdowns e DOCX",
      "Blueprints para Google Veo 3 e Nano Banana",
      "Pesquisa instantânea sobre catálogo indexado",
      "Downloads ultrarrápidos e telemetria",
    ],
    ctaText: "Abrir o Cofre",
  },
];

export function EcosystemShowcase() {
  return (
    <section id="ecossistemas" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full relative">
      {/* Cabeçalho da Seção */}
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-pill-red text-xs font-mono text-red-500 uppercase tracking-widest font-bold">
          <Zap className="w-3.5 h-3.5" />
          <span>FUSÃO TECNOLÓGICA SOBERANA</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Quatro Ecossistemas. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-neutral-200 to-red-400">
            Um Único Ecossistema: Mateus Celestino Pro X.
          </span>
        </h2>

        <p className="text-sm sm:text-base text-neutral-400 font-light leading-relaxed">
          Cada aplicação antes operava isoladamente. Agora, todas compartilham a mesma
          camada de dados PostgreSQL, design system com Glassmorphism refinado e motor WebGL de alto desempenho.
        </p>
      </div>

      {/* Grid com os 4 Cards dos Ecossistemas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {ecosystems.map((eco) => {
          const Icon = eco.icon;
          return (
            <GlassCard
              key={eco.id}
              variant="interactive"
              glow
              glowColor={eco.glowColor}
              className="group relative flex flex-col justify-between p-7 sm:p-9 rounded-3xl border border-white/10 hover:border-red-500/40 transition-all duration-300"
            >
              <div>
                {/* Topo do Card */}
                <div className="flex items-center justify-between gap-4 mb-6">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-500/20 via-black to-red-950/40 border border-white/10 flex items-center justify-center text-red-400 group-hover:scale-110 group-hover:text-red-300 transition-all shadow-[0_0_20px_rgba(255,7,58,0.2)]">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono font-bold tracking-widest text-red-500 uppercase block">
                        {eco.subtitle}
                      </span>
                      <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-red-400 transition-colors">
                        {eco.title}
                      </h3>
                    </div>
                  </div>

                  <Badge variant={eco.badgeVariant || "default"} className="text-[10px] uppercase tracking-wider">
                    {eco.badge}
                  </Badge>
                </div>

                {/* Descrição */}
                <p className="text-sm text-neutral-300 font-light leading-relaxed mb-6">
                  {eco.description}
                </p>

                {/* Lista de Recursos Principais */}
                <div className="space-y-2.5 mb-8">
                  {eco.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2.5 text-xs text-neutral-400">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500/80 shadow-[0_0_6px_#ff073a]" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Rodapé do Card com Métrica e Botão de Ação */}
              <div className="pt-6 border-t border-white/10 flex items-center justify-between gap-4">
                <div className="text-xs font-mono text-neutral-400">
                  <span className="text-neutral-500">DESTAQUE:</span>{" "}
                  <strong className="text-white font-semibold">{eco.stats}</strong>
                </div>

                <Link href={eco.href}>
                  <Button
                    variant="fired"
                    size="sm"
                    className="gap-2 text-xs font-mono uppercase tracking-wider"
                  >
                    <span>{eco.ctaText}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </div>
            </GlassCard>
          );
        })}
      </div>
    </section>
  );
}
