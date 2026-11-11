'use client';

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Shield,
  FileText,
  CheckCircle2,
  Sparkles,
  ShoppingBag,
  Users,
  FolderGit2,
  Crown,
  Mail,
  ArrowUpRight,
  Cookie,
} from "lucide-react";
import SilkShader from "@/components/shaders/SilkShader";
import { openCookiePreferences } from "@/lib/cookies";
import { useVerifiedAuth } from "@/components/auth/VerifiedAuthProvider";

export function Footer() {
  const currentYear = new Date().getFullYear();
  const pathname = usePathname();
  const { isUserAdmin } = useVerifiedAuth();

  const headerNavButtons = [
    { name: "Home Page", href: "/", icon: Shield },
    { name: "Showcase", href: "/showcase", icon: Sparkles },
    { name: "Shop Oficial", href: "/shop", icon: ShoppingBag },
    { name: "Comunidade VIP", href: "/comunidade", icon: Users },
    { name: "Free Resources", href: "/biblioteca", icon: FolderGit2 },
    { name: "Contato Direto", href: "/contato", icon: Mail },
  ];

  return (
    <footer className="relative z-20 mt-0 border-t border-red-500/30 bg-[#0c0003]/95 shadow-[0_-25px_60px_rgba(180,0,25,0.3)] overflow-hidden w-full pb-32 sm:pb-16">
      {/* Shader WebGL do Rodapé: Silk Líquido Carmesim */}
      <SilkShader
        className="z-0 mix-blend-screen pointer-events-none"
        color="#b80018"
        opacity={0.22}
        speed={0.18}
      />

      {/* Linha superior de iluminação especular do vidro com halo carmesim */}
      <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-red-500/70 to-transparent pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-24 bg-red-600/20 blur-[90px] pointer-events-none" />

      {/* Brilho fluido de energia vermelha na base do rodapé */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-red-950/40 via-red-900/10 to-transparent pointer-events-none" />

      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 relative z-10 flex flex-col items-center justify-center gap-8">

        {/* =========================================================================
            1. BOTÕES DA BARRA PRINCIPAL DO HEADER INCORPORADOS NO FOOTER
            ========================================================================= */}
        <div className="w-full flex flex-col items-center">
          <div className="w-full grid grid-cols-2 sm:grid-cols-3 lg:flex lg:flex-row lg:flex-wrap lg:items-center lg:justify-center gap-2 sm:gap-2.5 lg:gap-2 xl:gap-3 max-w-6xl mx-auto">
            {headerNavButtons.map((btn) => {
              const Icon = btn.icon;
              const isActive = btn.href === "/" ? pathname === "/" : pathname.startsWith(btn.href);

              return (
                <Link
                  key={btn.href}
                  href={btn.href}
                  className={`flex items-center gap-2 sm:gap-2.5 min-h-[44px] sm:min-h-[48px] px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl border text-xs font-mono font-medium transition-all duration-200 active:scale-95 group touch-manipulation whitespace-nowrap shrink-0 lg:w-auto ${
                    isActive
                      ? "bg-red-950/60 border-red-500/60 text-white shadow-[0_0_15px_rgba(255,7,58,0.3)]"
                      : "bg-white/[0.03] border-white/10 text-neutral-300 hover:text-white hover:bg-white/[0.08] hover:border-red-500/40"
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                      isActive
                        ? "bg-red-600/30 text-red-400"
                        : "bg-white/5 text-neutral-400 group-hover:text-red-400"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span className="truncate whitespace-nowrap">{btn.name}</span>
                </Link>
              );
            })}

            {/* Botão de Painel Admin Exclusivo: Renderizado SOMENTE quando logado como admin */}
            {isUserAdmin && (
              <Link
                href="/admin"
                className="col-span-2 sm:col-span-3 lg:col-span-auto lg:w-auto shrink-0 flex items-center justify-center sm:justify-start gap-2 sm:gap-2.5 min-h-[44px] sm:min-h-[48px] px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl border border-amber-500/50 bg-amber-950/40 text-amber-300 hover:bg-amber-900/50 hover:border-amber-400 shadow-[0_0_20px_rgba(255,215,0,0.25)] text-xs font-mono font-bold transition-all duration-200 active:scale-95 group touch-manipulation whitespace-nowrap"
              >
                <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0">
                  <Crown className="w-3.5 h-3.5" />
                </div>
                <span className="truncate whitespace-nowrap">Painel Admin</span>
                <ArrowUpRight className="w-3 h-3 ml-auto lg:ml-1 opacity-70 group-hover:opacity-100 shrink-0" />
              </Link>
            )}
          </div>
        </div>

        {/* Separador de Energia Carmesim */}
        <div className="w-full max-w-2xl h-[1px] bg-gradient-to-r from-transparent via-red-500/30 to-transparent" />

        {/* =========================================================================
            2. ACESSO A PRIVACIDADE, TERMOS E PREFERÊNCIAS DE COOKIES
            ========================================================================= */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6">
          <Link
            href="/privacidade"
            className="inline-flex items-center gap-2 min-h-[44px] px-4 sm:px-5 py-2.5 rounded-2xl glass-crystal text-xs font-mono text-neutral-200 hover:text-white border border-white/10 hover:border-red-500/60 hover:shadow-[0_0_25px_rgba(255,7,58,0.35)] transition-all duration-300 group cursor-pointer touch-manipulation active:scale-95"
          >
            <Shield className="w-4 h-4 text-red-500 group-hover:scale-110 transition-transform shrink-0" />
            <span className="font-medium tracking-wide">Política de Privacidade</span>
          </Link>

          <span className="w-1.5 h-1.5 rounded-full bg-red-500/50 hidden sm:block" />

          <Link
            href="/termos"
            className="inline-flex items-center gap-2 min-h-[44px] px-4 sm:px-5 py-2.5 rounded-2xl glass-crystal text-xs font-mono text-neutral-200 hover:text-white border border-white/10 hover:border-red-500/60 hover:shadow-[0_0_25px_rgba(255,7,58,0.35)] transition-all duration-300 group cursor-pointer touch-manipulation active:scale-95"
          >
            <FileText className="w-4 h-4 text-red-500 group-hover:scale-110 transition-transform shrink-0" />
            <span className="font-medium tracking-wide">Termos de Uso</span>
          </Link>

          <span className="w-1.5 h-1.5 rounded-full bg-red-500/50 hidden sm:block" />

          <button
            type="button"
            onClick={openCookiePreferences}
            className="inline-flex items-center gap-2 min-h-[44px] px-4 sm:px-5 py-2.5 rounded-2xl glass-crystal text-xs font-mono text-neutral-200 hover:text-white border border-white/10 hover:border-red-500/60 hover:shadow-[0_0_25px_rgba(255,7,58,0.35)] transition-all duration-300 group cursor-pointer touch-manipulation active:scale-95"
          >
            <Cookie className="w-4 h-4 text-red-500 group-hover:scale-110 transition-transform shrink-0" />
            <span className="font-medium tracking-wide">Preferências de Cookies</span>
          </button>
        </div>

        {/* Identificação Oficial da Demo */}
        <div className="text-center px-2">
          <div className="flex items-center justify-center gap-1.5 sm:gap-3 text-xs sm:text-sm font-mono text-neutral-300 flex-wrap">
            <span className="font-black tracking-wider uppercase text-white drop-shadow-[0_0_12px_rgba(255,7,58,0.4)]">
              MCP BUSINESS OS <span className="text-[#ff073a]">[DEMO INSTANCE]</span>
            </span>
            <span className="text-red-500 font-bold">•</span>
            <span className="text-neutral-200 font-semibold">{currentYear}</span>
            <span className="text-red-500 font-bold hidden xs:inline">•</span>
            <span className="inline-flex items-center gap-1.5 text-neutral-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-red-500 shrink-0" />
              <span>Demonstração de Software Interativa.</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
