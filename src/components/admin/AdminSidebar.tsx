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
  Compass,
  Zap,
  CheckCircle2,
  Flame,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type AdminTabId =
  | "overview"
  | "leads"
  | "members"
  | "finance"
  | "posts"
  | "library_control"
  | "shop_resources"
  | "banners"
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
  lastSyncTime?: string;
}

interface NavItemConfig {
  id: AdminTabId;
  label: string;
  sublabel: string;
  icon: React.ComponentType<{ className?: string }>;
  count?: number | null;
  tag?: string;
  href: string;
  hotkey: string;
}

interface NavGroup {
  groupName: string;
  items: NavItemConfig[];
}

export function AdminSidebar({
  activeTab,
  onSelectTab,
  articlesCount = 0,
  leadsCount = 0,
  membersCount = 0,
  transactionsCount = 0,
  userEmail = "",
  onRefresh,
  isLoadingData = false,
  onLogout,
  className,
  lastSyncTime,
}: AdminSidebarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Módulos organizados de forma executiva em 3 grupos estratégicos
  const navigationGroups: NavGroup[] = [
    {
      groupName: "DASHBOARD & OPERAÇÃO",
      items: [
        {
          id: "overview",
          label: "Visão Geral",
          sublabel: "Dashboard & KPIs",
          icon: BarChart3,
          count: null,
          href: "/admin?tab=overview",
          hotkey: "1",
        },
        {
          id: "leads",
          label: "Leads & Tráfego UTM",
          sublabel: "TikTok, Meta & Orgânico",
          icon: Users,
          count: leadsCount,
          href: "/admin?tab=leads",
          hotkey: "2",
        },
        {
          id: "members",
          label: "Membros da Comunidade",
          sublabel: "Assinantes & Cargos",
          icon: Shield,
          count: membersCount,
          href: "/admin?tab=members",
          hotkey: "3",
        },
        {
          id: "finance",
          label: "Vendas & Transações",
          sublabel: "Faturamento & Checkout",
          icon: CreditCard,
          count: transactionsCount,
          href: "/admin?tab=finance",
          hotkey: "4",
        },
      ],
    },
    {
      groupName: "CONTEÚDO & VENDAS",
      items: [
        {
          id: "posts",
          label: "Posts & Artigos",
          sublabel: "Notion Diary OS",
          icon: FileText,
          count: articlesCount,
          href: "/admin?tab=posts",
          hotkey: "5",
        },
        {
          id: "library_control",
          label: "Library Control",
          sublabel: "Cofre & Acervo Digital",
          icon: BookOpen,
          count: null,
          tag: "Acervo",
          href: "/admin?tab=library_control",
          hotkey: "6",
        },
        {
          id: "shop_resources",
          label: "Loja Virtual (Shop)",
          sublabel: "Produtos & Serviços",
          icon: ShoppingBag,
          count: null,
          tag: "Catálogo",
          href: "/admin?tab=shop_resources",
          hotkey: "7",
        },
        {
          id: "banners",
          label: "Banners & Exit-Intent",
          sublabel: "Retenção & Onboarding",
          icon: Flame,
          count: null,
          tag: "Smart",
          href: "/admin/banners",
          hotkey: "8",
        },
      ],
    },
    {
      groupName: "SISTEMA & INFRA",
      items: [
        {
          id: "infra",
          label: "Infraestrutura & Status",
          sublabel: "Supabase, SSR & WebGL",
          icon: Server,
          count: null,
          tag: "Online",
          href: "/admin?tab=infra",
          hotkey: "9",
        },
      ],
    },
  ];

  const allItems = navigationGroups.flatMap((g) => g.items);
  const activePageItem = allItems.find((p) => p.id === activeTab) || allItems[0];

  const externalPortals = [
    { label: "Home Page", href: "/", icon: Globe },
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

  return (
    <aside
      className={cn(
        "w-full lg:w-72 xl:w-80 flex-shrink-0 lg:sticky lg:top-24 z-20 space-y-3.5",
        className
      )}
    >
      {/* SELETOR MOBILE EXPANDÍVEL */}
      <div className="lg:hidden p-3.5 rounded-2xl bg-[#0c0507]/90 backdrop-blur-2xl border border-red-500/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.6)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_#ff073a]" />
            <div className="flex flex-col">
              <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">
                Módulo Ativo
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
            <span>Navegação ({allItems.length})</span>
            <ChevronDown
              className={cn("w-3.5 h-3.5 transition-transform duration-200", mobileMenuOpen && "rotate-180")}
            />
          </button>
        </div>
      </div>

      {/* COLUNA PRINCIPAL DE NAVEGAÇÃO */}
      <div
        className={cn(
          "space-y-3.5 transition-all duration-300",
          mobileMenuOpen ? "block" : "hidden lg:block"
        )}
      >
        {/* CARD DE IDENTIDADE SOBERANA */}
        <div className="p-4 rounded-2xl bg-gradient-to-b from-[#14080b]/95 to-[#090305]/95 backdrop-blur-3xl border border-red-500/20 shadow-[0_12px_40px_rgba(0,0,0,0.8)] relative overflow-hidden group">
          <div className="absolute -top-16 -right-16 w-32 h-32 bg-red-600/15 rounded-full blur-2xl pointer-events-none group-hover:bg-red-600/25 transition-all" />

          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600/30 to-red-950/40 border border-red-500/40 flex items-center justify-center text-red-400 shadow-[0_0_15px_rgba(255,7,58,0.35)] flex-shrink-0">
              <Crown className="w-5 h-5 text-red-500 animate-pulse" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_6px_#ff073a] animate-ping" />
                <span className="text-[10px] font-mono font-bold tracking-wider text-red-400 uppercase">
                  SOVEREIGN ADMIN
                </span>
              </div>
              <h2 className="text-sm font-black text-white tracking-tight truncate">
                MCP OS Business
              </h2>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-black/50 border border-white/10 flex items-center justify-between text-[11px] font-mono text-neutral-300">
            <div className="flex items-center gap-1.5 min-w-0 pr-2">
              <Shield className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
              <span className="truncate">{userEmail || "Sessão Administrativa"}</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex-shrink-0 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Online
            </span>
          </div>

          {/* Telemetria de Sessão */}
          <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-neutral-400">
            <span className="flex items-center gap-1 text-neutral-400">
              <Activity className="w-3 h-3 text-red-500" />
              <span>Sincronização P2P</span>
            </span>
            <span className="text-emerald-400/90 font-medium">99.98% Operacional</span>
          </div>
        </div>

        {/* GRUPOS DE NAVEGAÇÃO EXECUTIVA */}
        <div className="p-2.5 rounded-2xl bg-[#0c0507]/90 backdrop-blur-3xl border border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.7)] space-y-4" aria-label="Páginas Internas">
          <div className="sr-only">Páginas Internas</div>
          {navigationGroups.map((group, groupIdx) => (
            <div key={group.groupName} className="space-y-1">
              {/* Header do Grupo */}
              <div className="px-2.5 pt-1.5 pb-1 flex items-center justify-between text-[9px] font-mono font-bold uppercase tracking-wider text-neutral-400">
                <span className="flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-red-500/70" />
                  <span>{group.groupName}</span>
                </span>
                <span className="text-neutral-600 text-[8px]">{group.items.length}</span>
              </div>

              {/* Itens do Grupo */}
              <nav className="space-y-1" aria-label={group.groupName}>
                {group.items.map((page) => {
                  const Icon = page.icon;
                  const isActive = activeTab === page.id;

                  const content = (
                    <div className="w-full flex items-center justify-between gap-2 relative">
                      {/* Active glowing indicator pill on left edge */}
                      {isActive && (
                        <div className="absolute -left-3 top-1 bottom-1 w-1 rounded-r-full bg-[#ff073a] shadow-[0_0_10px_#ff073a]" />
                      )}

                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className={cn(
                            "w-7 h-7 rounded-lg flex items-center justify-center transition-all flex-shrink-0",
                            isActive
                              ? "bg-red-600/30 text-red-400 border border-red-500/50 shadow-[0_0_12px_rgba(255,7,58,0.4)]"
                              : "bg-white/[0.04] text-neutral-400 group-hover:text-white group-hover:bg-white/[0.08] border border-white/5"
                          )}
                        >
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div className="flex flex-col min-w-0 text-left">
                          <span
                            className={cn(
                              "text-xs font-semibold truncate leading-tight transition-colors",
                              isActive ? "text-white font-bold" : "text-neutral-300 group-hover:text-white"
                            )}
                          >
                            {page.label}
                          </span>
                          <span
                            className={cn(
                              "text-[10px] font-mono truncate leading-tight mt-0.5",
                              isActive
                                ? "text-red-300/80 font-medium"
                                : "text-neutral-500 group-hover:text-neutral-400"
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
                                ? "bg-red-500/20 text-red-300 border border-red-500/40 font-bold"
                                : "bg-white/5 text-neutral-400 border border-white/10"
                            )}
                          >
                            {page.tag}
                          </span>
                        )}
                        {typeof page.count === "number" && (
                          <span
                            className={cn(
                              "text-[10px] min-w-[20px] text-center px-1.5 py-0.5 rounded-full font-mono font-bold transition-all",
                              isActive
                                ? "bg-red-600 text-white shadow-[0_0_10px_rgba(255,7,58,0.5)]"
                                : "bg-white/10 text-neutral-300 border border-white/10 group-hover:text-white group-hover:border-white/20"
                            )}
                          >
                            {page.count}
                          </span>
                        )}
                        {/* Hotkey Indicator */}
                        <span className="hidden xl:inline-block text-[9px] font-mono text-neutral-600 group-hover:text-neutral-400 px-1 py-0.5 rounded bg-black/40 border border-white/5">
                          {page.hotkey}
                        </span>
                      </div>
                    </div>
                  );

                  const buttonClasses = cn(
                    "w-full flex items-center px-2.5 py-2 rounded-xl text-xs transition-all duration-200 group relative",
                    isActive
                      ? "bg-gradient-to-r from-red-600/20 via-red-950/40 to-black/60 text-white font-bold border border-red-500/40 shadow-[0_0_20px_rgba(255,7,58,0.2)] scale-[1.01]"
                      : "bg-white/[0.02] text-neutral-300 hover:text-white hover:bg-white/[0.06] border border-white/5 hover:border-red-500/30"
                  );

                  if (onSelectTab) {
                    return (
                      <button
                        key={page.id}
                        type="button"
                        onClick={() => handlePageClick(page.id)}
                        className={buttonClasses}
                      >
                        {content}
                      </button>
                    );
                  }

                  return (
                    <Link
                      key={page.id}
                      href={page.href}
                      className={buttonClasses}
                    >
                      {content}
                    </Link>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>

        {/* ECOSSISTEMA EXTERNO & ATALHOS RÁPIDOS */}
        <div className="p-3 rounded-2xl bg-[#0c0507]/90 backdrop-blur-3xl border border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.7)] space-y-1.5">
          <div className="px-2 pt-1 pb-1 flex items-center justify-between text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400">
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
                  className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-medium text-neutral-300 hover:text-white bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 hover:border-white/15 transition-colors group"
                >
                  <div className="flex items-center gap-2">
                    <PortalIcon className="w-3.5 h-3.5 text-neutral-500 group-hover:text-red-400 transition-colors" />
                    <span className="text-[11px]">{portal.label}</span>
                  </div>
                  <ExternalLink className="w-3 h-3 text-neutral-500 group-hover:text-white transition-colors" />
                </Link>
              );
            })}
          </div>
        </div>

        {/* RODAPÉ DA COLUNA ESQUERDA: AÇÕES ADMINISTRATIVAS */}
        <div className="p-3 rounded-2xl bg-[#0c0507]/90 backdrop-blur-3xl border border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.7)] space-y-2">
          {onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              disabled={isLoadingData}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-white bg-white/[0.05] hover:bg-white/[0.1] border border-white/15 hover:border-white/25 transition-all cursor-pointer"
            >
              <RefreshCw className={cn("w-3.5 h-3.5", isLoadingData && "animate-spin text-red-400")} />
              <span>{isLoadingData ? "Sincronizando..." : "Atualizar Dados (R)"}</span>
            </button>
          )}

          {onLogout && (
            <button
              type="button"
              onClick={onLogout}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-red-400 hover:text-red-300 bg-red-950/30 hover:bg-red-950/50 border border-red-900/40 hover:border-red-500/50 transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Encerrar Sessão</span>
            </button>
          )}

          <div className="pt-1 text-center">
            <span className="text-[9px] font-mono text-neutral-500">
              Soberania • Criptografia P2P • V2.6
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
