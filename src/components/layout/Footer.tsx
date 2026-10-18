'use client';

import React from "react";
import Link from "next/link";
import {
  Shield,
  FileText,
  CheckCircle2,
  Sparkles,
  ShoppingBag,
  Users,
  FolderGit2,
  BookOpen,
  Crown,
  Mail,
  Activity,
  ArrowUpRight,
} from "lucide-react";
import SilkShader from "@/components/shaders/SilkShader";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const ecosystemLinks = [
    { label: "Portal Institucional", href: "/", icon: Shield },
    { label: "Showcase & Projetos", href: "/showcase", icon: Sparkles },
    { label: "Shop & Soluções", href: "/shop", icon: ShoppingBag },
    { label: "Comunidade Exclusiva", href: "/comunidade", icon: Users },
    { label: "Free Resources", href: "/biblioteca", icon: FolderGit2 },
    { label: "Artigos Técnicos (176+)", href: "/artigos", icon: BookOpen },
  ];

  const legalLinks = [
    { label: "Privacidade Blindada", href: "/privacidade", icon: Shield },
    { label: "Termos de Uso Soberanos", href: "/termos", icon: FileText },
    { label: "Canal de Contato Oficial", href: "/contato", icon: Mail },
    { label: "Painel Administrativo", href: "/admin", icon: Crown },
  ];

  return (
    <footer
      id="master-footer"
      className="relative z-20 mt-16 md:mt-24 border-t border-red-500/30 bg-[#0c0003]/95 shadow-[0_-25px_60px_rgba(180,0,25,0.25)] overflow-hidden w-full pb-24 md:pb-12"
    >
      {/* Shader WebGL do Rodapé: Silk Líquido Carmesim */}
      <SilkShader
        className="z-0 mix-blend-screen pointer-events-none"
        color="#b80018"
        opacity={0.2}
        speed={0.16}
      />

      {/* Linha superior de iluminação especular do vidro com halo carmesim */}
      <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-red-500/70 to-transparent pointer-events-none" />
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] sm:w-[800px] h-32 bg-red-600/25 blur-[100px] pointer-events-none" />

      {/* Brilho fluido de energia vermelha na base do rodapé */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-red-950/40 via-red-900/10 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 relative z-10">
        {/* Grid de Conteúdo: Colunas Empilhadas no Mobile, 3 Colunas no Desktop */}
        <div className="flex flex-col lg:flex-row items-start justify-between gap-10 lg:gap-14 pb-10 border-b border-white/10">
          
          {/* Coluna 1: Identidade da Marca, Missão e Status de Sistema */}
          <div className="w-full lg:max-w-sm space-y-4">
            <Link
              href="/"
              className="inline-flex items-center gap-3 group active:scale-95 transition-transform"
            >
              <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 via-red-800 to-black p-[1px] flex items-center justify-center shadow-[0_0_20px_rgba(255,7,58,0.4)] overflow-hidden shrink-0">
                <div className="w-full h-full bg-[#030305] rounded-[11px] overflow-hidden flex items-center justify-center">
                  <img
                    src="/assets/site_icon.webp"
                    alt="Mateus Celestino Pro X Logo"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-base tracking-wide text-white uppercase group-hover:text-red-300 transition-colors">
                  MATEUS CELESTINO <span className="text-red-500 font-black">PRO X</span>
                </span>
                <span className="text-[11px] font-mono text-neutral-400">
                  Business Operating System & Hiperautomação
                </span>
              </div>
            </Link>

            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
              Ecossistema soberano de hiperautomação, agentes autônomos orientados a objetivos com IA, engenharia de sistemas distribuídos e cofre de recursos de alta performance.
            </p>

            {/* Badge de Status de Saúde Operacional */}
            <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-xs font-mono text-neutral-300">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 shadow-[0_0_8px_#10b981]" />
              </span>
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-bold">100% OPERACIONAL</span>
              <span className="text-neutral-500">•</span>
              <span className="text-[11px] text-neutral-400">Infraestrutura Blindada</span>
            </div>
          </div>

          {/* Coluna 2: Navegação Rápida com Touch Targets Confortáveis (min 44px) */}
          <div className="w-full lg:w-auto space-y-3">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-red-400 px-1">
              Ecossistema & Recursos
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {ecosystemLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-2.5 px-3 py-2.5 min-h-[44px] rounded-xl text-xs sm:text-sm text-neutral-300 hover:text-white hover:bg-white/5 active:scale-[0.98] transition-all border border-transparent hover:border-white/10 group cursor-pointer"
                  >
                    <Icon className="w-4 h-4 text-neutral-500 group-hover:text-red-400 transition-colors shrink-0" />
                    <span>{item.label}</span>
                    <ArrowUpRight className="w-3 h-3 text-neutral-600 group-hover:text-neutral-300 transition-colors ml-auto opacity-0 group-hover:opacity-100" />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Coluna 3: Blindagem Jurídica & Governança */}
          <div className="w-full lg:w-auto space-y-3">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-red-400 px-1">
              Governança & Segurança
            </h3>
            <div className="flex flex-col gap-2">
              {legalLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-2.5 px-3.5 py-2.5 min-h-[44px] rounded-xl text-xs sm:text-sm text-neutral-300 hover:text-white hover:bg-white/5 active:scale-[0.98] transition-all border border-transparent hover:border-red-500/30 group cursor-pointer"
                  >
                    <Icon className="w-4 h-4 text-red-500/80 group-hover:text-red-400 transition-colors shrink-0" />
                    <span className="font-medium">{item.label}</span>
                    <ArrowUpRight className="w-3 h-3 text-neutral-600 group-hover:text-neutral-300 transition-colors ml-auto opacity-0 group-hover:opacity-100" />
                  </Link>
                );
              })}
            </div>
          </div>

        </div>

        {/* Linha Inferior de Direitos Autorais & Carimbo Soberano */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2 sm:gap-3 text-xs sm:text-sm font-mono text-neutral-400 flex-wrap">
            <span className="font-black tracking-wider uppercase text-white drop-shadow-[0_0_12px_rgba(255,7,58,0.4)]">
              MATEUS CELESTINO PRO X
            </span>
            <span className="text-red-500 font-bold">•</span>
            <span className="text-neutral-300 font-semibold">{currentYear}</span>
            <span className="text-red-500 font-bold">•</span>
            <span className="inline-flex items-center gap-1.5 text-neutral-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-red-500 shrink-0" />
              <span>Todos os direitos registrados.</span>
            </span>
          </div>

          <div className="text-[11px] font-mono text-neutral-400 flex items-center gap-2">
            <span>PLATAFORMA UNIFICADA SOBERANA</span>
            <span>•</span>
            <span>V2.4</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

