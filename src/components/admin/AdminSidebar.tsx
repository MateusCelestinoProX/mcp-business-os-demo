"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  BarChart3,
  FileText,
  BookOpen,
  ShoppingBag,
  Users,
  Shield,
  CreditCard,
  Server,
  Crown,
  Globe,
  RefreshCw,
  LogOut,
  ExternalLink,
  ChevronDown,
  Sparkles,
  Activity,
  Layers,
  Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type AdminTabId =
  | "overview"
  | "posts"
  | "library_control"
  | "shop_resources"
  | "leads"
  | "members"
  | "finance"
  | "infra";

export interface AdminSidebarProps {
  activeTab: AdminTabId;
  onSelectTab?: (tab: AdminTabId) => void;
  articlesCount?: number;
  leadsCount?: number;
  membersCount?: number;
  transactionsCount?: number;
  userEmail?: string;
  onRefresh?: () => void;
  isLoadingData?: boolean;
  onLogout?: () => void;
  className?: string;
}

export function AdminSidebar({
  activeTab,
  onSelectTab,
  articlesCount = 0,
  leadsCount = 0,
  membersCount = 0,
  transactionsCount = 0,
  userEmail = "mcp6667@proton.me",
  onRefresh,
  isLoadingData = false,
  onLogout,
  className,
}: AdminSidebarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const internalPages: {
    id: AdminTabId;
    label: string;
    sublabel: string;
    icon: React.ComponentType<{ className?: string }>;
    count?: number | null;
    tag?: string;
    href: string;
  }[] = [
    {
      id: "overview",
      label: "Visão Geral",
      sublabel: "Dashboard & KPIs",
      icon: BarChart3,
      count: null,
      href: "/admin?tab=overview",
    },
    {
      id: "posts",
      label: "Posts & Artigos",
      sublabel: "Notion Diary OS",
      icon: FileText,
      count: articlesCount,
      href: "/admin?tab=posts",
    },
    {
      id: "library_control",
      label: "Library Control",
      sublabel: "Cofre & Acervo Digital",
      icon: BookOpen,
      count: null,
      tag: "Acervo",
      href: "/admin?tab=library_control",
    },
    {
      id: "shop_resources",
      label: "Loja Virtual (Shop)",
      sublabel: "Produtos & Serviços",
      icon: ShoppingBag,
      count: null,
      tag: "Catálogo",
      href: "/admin?tab=shop_resources",
    },
    {
      id: "leads",
      label: "Leads & Tráfego UTM",
      sublabel: "TikTok, Meta & Orgânico",
      icon: Users,
      count: leadsCount,
      href: "/admin?tab=leads",
    },
    {
      id: "members",
      label: "Membros da Comunidade",
      sublabel: "Assinantes & Cargos",
      icon: Shield,
      count: membersCount,
      href: "/admin?tab=members",
    },
    {
      id: "finance",
      label: "Vendas & Transações",
      sublabel: "Faturamento & Checkout",
      icon: CreditCard,
      count: transactionsCount,
      href: "/admin?tab=finance",
    },
    {
      id: "infra",
      label: "Infraestrutura & Status",
      sublabel: "Supabase, SSR & WebGL",
      icon: Server,
      count: null,
      tag: "Online",
      href: "/admin?tab=infra",
    },
  ];

  const externalPortals = [
    { label: "Portal Institucional", href: "/", icon: Globe },
    { label: "Loja Pública (/shop)", href: "/shop", icon: ShoppingBag },
    { label: "Hidden Library (/biblioteca)", href: "/biblioteca", icon: BookOpen },
    { label: "Comunidade VIP (/comunidade)", href: "/comunidade", icon: Sparkles },
  ];

  const handlePageClick = (tabId: AdminTabId) => {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(10);
    }
    if (onSelectTab) {
      onSelectTab(tabId);
    }
    setMobileMenuOpen(false);
  };

  const activePageItem = internalPages.find((p) => p.id === activeTab) || internalPages[0];

  return (
    <aside
      className={cn(
        "w-full lg:w-72 xl:w-80 flex-shrink-0 lg:sticky lg:top-24 z-20 space-y-4",
        className
      )}
    >
      {/* SELETOR MOBILE EXPANDÍVEL (visível apenas em telas menores que lg) */}
      <div className="lg:hidden p-3.5 rounded-2xl bg-white/[0.06] backdrop-blur-2xl border border-white/15 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <div className="flex flex-col">
              <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">
                Página Interna Ativa
              </span>
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                {activePageItem.label}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold text-neutral-200 transition-colors border border-white/10"
          >
            <span>Ver Coluna ({internalPages.length})</span>
            <ChevronDown
              className={cn("w-3.5 h-3.5 transition-transform duration-200", mobileMenuOpen && "rotate-180")}
            />
          </button>
        </div>
      </div>

      {/* COLUNA VERTICAL PRINCIPAL DE PÁGINAS INTERNAS */}
      <div
        className={cn(
          "space-y-4 transition-all duration-300",
          mobileMenuOpen ? "block" : "hidden lg:block"
        )}
      >
        {/* CARD DE IDENTIDADE SOBERANA */}
        <div className="p-4 rounded-2xl bg-[#0c0507]/90 backdrop-blur-3xl border border-white/15 shadow-[0_12px_40px_rgba(0,0,0,0.7)] relative overflow-hidden">
          <div className="absolute -top-16 -right-16 w-32 h-32 bg-red-600/20 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-500 shadow-[0_0_15px_rgba(255,7,58,0.35)] flex-shrink-0">
              <Crown className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                <span className="text-[10px] font-mono font-bold tracking-wider text-red-300 uppercase">
                  SOVEREIGN ADMIN
                </span>
              </div>
              <h2 className="text-sm font-bold text-white tracking-tight truncate">
                MCP OS Business
              </h2>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between text-[11px] font-mono text-neutral-300">
            <span className="truncate pr-2">{userEmail}</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex-shrink-0">
              Online
            </span>
          </div>
        </div>

        {/* COLUNA VERTICAL: TODAS AS INTERNAL PAGES ESTÃO AQUI */}
        <div className="p-3 rounded-2xl bg-[#0c0507]/90 backdrop-blur-3xl border border-white/15 shadow-[0_12px_40px_rgba(0,0,0,0.7)] space-y-1.5">
          <div className="px-3 pt-2 pb-1.5 flex items-center justify-between text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400">
            <span className="flex items-center gap-1.5">
              <Layers className="w-3 h-3 text-red-500" />
              <span>Páginas Internas</span>
            </span>
            <span className="text-neutral-500">{internalPages.length} Módulos</span>
          </div>

          {/* LISTA VERTICAL DE PÁGINAS INTERNAS */}
          <nav className="space-y-1" aria-label="Navegação Interna do Painel Admin">
            {internalPages.map((page) => {
              const Icon = page.icon;
              const isActive = activeTab === page.id;

              const content = (
                <div className="w-full flex items-center justify-between gap-2.5">
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={cn(
                        "w-7 h-7 rounded-lg flex items-center justify-center transition-colors flex-shrink-0",
                        isActive
                          ? "bg-black text-white shadow-sm"
                          : "bg-white/5 text-neutral-400 group-hover:text-white group-hover:bg-white/10"
                      )}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex flex-col min-w-0 text-left">
                      <span className="text-xs font-semibold truncate leading-tight">
                        {page.label}
                      </span>
                      <span
                        className={cn(
                          "text-[10px] font-mono truncate leading-tight mt-0.5",
                          isActive ? "text-neutral-700 font-medium" : "text-neutral-500 group-hover:text-neutral-400"
                        )}
                      >
                        {page.sublabel}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    {page.tag && (
                      <span
                        className={cn(
                          "text-[9px] px-1.5 py-0.5 rounded-md font-mono uppercase tracking-wider",
                          isActive
                            ? "bg-black/10 text-neutral-800 font-bold"
                            : "bg-white/5 text-neutral-400 border border-white/10"
                        )}
                      >
                        {page.tag}
                      </span>
                    )}
                    {typeof page.count === "number" && (
                      <span
                        className={cn(
                          "text-[10px] min-w-[20px] text-center px-1.5 py-0.5 rounded-full font-mono font-bold",
                          isActive
                            ? "bg-black text-white"
                            : "bg-white/10 text-neutral-200 border border-white/10"
                        )}
                      >
                        {page.count}
                      </span>
                    )}
                  </div>
                </div>
              );

              const baseButtonClasses = cn(
                "w-full flex items-center px-3 py-2.5 rounded-xl text-xs transition-all duration-200 group relative",
                isActive
                  ? "bg-white text-black font-bold shadow-[0_0_25px_rgba(255,255,255,0.4)] scale-[1.01]"
                  : "bg-white/[0.03] text-neutral-300 hover:text-white hover:bg-white/[0.08] border border-white/5 hover:border-white/15"
              );

              if (onSelectTab) {
                return (
                  <button
                    key={page.id}
                    type="button"
                    onClick={() => handlePageClick(page.id)}
                    className={baseButtonClasses}
                  >
                    {content}
                  </button>
                );
              }

              return (
                <Link
                  key={page.id}
                  href={page.href}
                  className={baseButtonClasses}
                >
                  {content}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* ECOSSISTEMA EXTERNO & ATALHOS RÁPIDOS */}
        <div className="p-3 rounded-2xl bg-[#0c0507]/90 backdrop-blur-3xl border border-white/15 shadow-[0_12px_40px_rgba(0,0,0,0.7)] space-y-1.5">
          <div className="px-3 pt-2 pb-1 flex items-center justify-between text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400">
            <span className="flex items-center gap-1.5">
              <Globe className="w-3 h-3 text-red-500" />
              <span>Ecossistema Externo</span>
            </span>
          </div>

          <div className="space-y-1">
            {externalPortals.map((portal) => {
              const PortalIcon = portal.icon;
              return (
                <Link
                  key={portal.href}
                  href={portal.href}
                  target="_blank"
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-neutral-300 hover:text-white bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 hover:border-white/10 transition-colors group"
                >
                  <div className="flex items-center gap-2.5">
                    <PortalIcon className="w-3.5 h-3.5 text-neutral-400 group-hover:text-red-400 transition-colors" />
                    <span>{portal.label}</span>
                  </div>
                  <ExternalLink className="w-3 h-3 text-neutral-500 group-hover:text-white transition-colors" />
                </Link>
              );
            })}
          </div>
        </div>

        {/* RODAPÉ DA COLUNA ESQUERDA: AÇÕES ADMINISTRATIVAS */}
        <div className="p-3 rounded-2xl bg-[#0c0507]/90 backdrop-blur-3xl border border-white/15 shadow-[0_12px_40px_rgba(0,0,0,0.7)] space-y-2">
          {onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              disabled={isLoadingData}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-white bg-white/[0.05] hover:bg-white/[0.1] border border-white/15 hover:border-white/25 transition-all"
            >
              <RefreshCw className={cn("w-3.5 h-3.5", isLoadingData && "animate-spin text-red-400")} />
              <span>{isLoadingData ? "Sincronizando..." : "Atualizar Dados"}</span>
            </button>
          )}

          {onLogout && (
            <button
              type="button"
              onClick={onLogout}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-red-400 hover:text-red-300 bg-red-950/30 hover:bg-red-950/50 border border-red-900/40 hover:border-red-500/50 transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Encerrar Sessão</span>
            </button>
          )}

          <div className="pt-1 text-center">
            <span className="text-[10px] font-mono text-neutral-500">
              Soberania • Criptografia P2P • V2.6
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
