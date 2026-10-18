"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Shield,
  Users,
  Menu,
  X,
  Crown,
  LogOut,
  LogIn,
  ShoppingBag,
  Sparkles,
  FolderGit2,
  BookOpen,
  ChevronRight,
  User,
  ShieldAlert,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  UnifiedUser,
  DEFAULT_GUEST_USER,
  getStoredUser,
  setStoredUser,
  hasAdminAccess,
} from "@/lib/auth/unified-auth";

export interface NavLinkItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

export const navLinks: NavLinkItem[] = [
  { name: "Portal Institucional", href: "/", icon: Shield },
  { name: "Showcase", href: "/showcase", icon: Sparkles },
  { name: "Shop", href: "/shop", icon: ShoppingBag },
  { name: "Comunidade", href: "/comunidade", icon: Users },
  { name: "Free Resources", href: "/biblioteca", icon: FolderGit2 },
  { name: "Artigos", href: "/artigos", icon: BookOpen, badge: "176+" },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<UnifiedUser>(DEFAULT_GUEST_USER);

  useEffect(() => {
    setCurrentUser(getStoredUser());

    const handleAuthChange = (e: Event) => {
      const customEvent = e as CustomEvent<UnifiedUser>;
      if (customEvent.detail) {
        setCurrentUser(customEvent.detail);
      } else {
        setCurrentUser(getStoredUser());
      }
    };

    window.addEventListener("mcp_auth_changed", handleAuthChange);
    window.addEventListener("storage", handleAuthChange);
    return () => {
      window.removeEventListener("mcp_auth_changed", handleAuthChange);
      window.removeEventListener("storage", handleAuthChange);
    };
  }, []);

  // Bloqueio suave do scroll no body quando o menu mobile estiver expandido
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const handleLogout = () => {
    setStoredUser(DEFAULT_GUEST_USER);
    setCurrentUser(DEFAULT_GUEST_USER);
  };

  const isUserAdmin = hasAdminAccess(currentUser);

  return (
    <header
      id="master-sovereign-bar"
      className="fixed top-0 left-0 right-0 w-full z-50 h-16 bg-[#030305]/95 border-b border-white/10 shadow-[0_10px_35px_rgba(0,0,0,0.85)] transition-all duration-300"
    >
      <div className="w-full px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
        {/* Logo & Marca Soberana */}
        <Link
          href="/"
          title="Ir para o Portal Institucional"
          className="flex items-center gap-3 group transition-transform duration-200 active:scale-95"
        >
          <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-red-600 via-red-800 to-black p-[1px] flex items-center justify-center shadow-[0_0_15px_rgba(255,7,58,0.4)] group-hover:shadow-[0_0_25px_rgba(255,7,58,0.7)] transition-all overflow-hidden shrink-0">
            <div className="w-full h-full bg-[#030305] rounded-[11px] overflow-hidden flex items-center justify-center">
              <img
                src="/assets/site_icon.webp"
                alt="Mateus Celestino Pro X Logo"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
            </div>
          </div>
          <div className="flex flex-col justify-center">
            <span className="font-extrabold text-sm tracking-wide text-white uppercase group-hover:text-red-300 transition-colors">
              MATEUS CELESTINO <span className="text-red-500 font-black">PRO X</span>
            </span>
          </div>
        </Link>

        {/* Links Centrais Desktop (md/xl) */}
        <nav
          aria-label="Navegação Central Principal"
          className="hidden xl:flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/5"
        >
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all duration-200 relative group",
                  isActive
                    ? "text-white bg-white/[0.12] shadow-[inset_0_1px_1px_rgba(255,255,255,0.25)] border border-white/15"
                    : "text-neutral-400 hover:text-neutral-100 hover:bg-white/[0.05]"
                )}
              >
                <Icon
                  className={cn(
                    "w-3.5 h-3.5 transition-colors group-hover:text-red-400",
                    isActive ? "text-red-400" : "text-neutral-400"
                  )}
                />
                <span>{item.name}</span>
                {item.badge && (
                  <span
                    className={cn(
                      "text-[9px] px-1.5 py-0.2 rounded-full font-bold uppercase",
                      item.badge === "PRO"
                        ? "bg-red-500/20 text-red-400 border border-red-500/30"
                        : "bg-red-950/50 text-red-300 border border-red-700/40"
                    )}
                  >
                    {item.badge}
                  </span>
                )}
                {isActive && (
                  <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-gradient-to-r from-transparent via-red-500 to-transparent" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Lado Direito Desktop: Botões fiéis e soberanos sempre presentes */}
        <div className="hidden lg:flex items-center gap-3">
          <Link href="/admin">
            <Button
              variant="secondary"
              size="sm"
              className="gap-1.5 text-xs border-white/10 hover:border-red-500/40 transition-colors"
            >
              <Crown className="w-3.5 h-3.5 text-red-400" />
              <span>Painel Admin</span>
            </Button>
          </Link>

          {currentUser.isLoggedIn ? (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs">
              <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
              <span className="font-semibold text-white truncate max-w-[140px]">
                {currentUser.name || "Mateus Celestino Pro X"}
              </span>
              <button
                onClick={handleLogout}
                title="Encerrar sessão"
                className="text-neutral-400 hover:text-red-400 transition-colors ml-1 p-0.5 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <Link
              href="/comunidade/login"
              title="Acessar sessão / Login"
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs hover:border-red-500/40 hover:bg-white/[0.08] transition-all group cursor-pointer"
            >
              <span className="font-semibold text-white">Mateus Celestino Pro X</span>
              <LogIn className="w-3.5 h-3.5 text-neutral-400 group-hover:text-red-400 transition-colors" />
            </Link>
          )}
        </div>

        {/* Botão Hambúrguer Mobile com touch target ergonômico */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Fechar menu de navegação" : "Abrir menu de navegação"}
            aria-expanded={mobileMenuOpen}
            className="flex items-center justify-center w-11 h-11 rounded-xl bg-white/5 border border-white/10 text-neutral-300 hover:text-white active:scale-95 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-500/40"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5 text-red-400 transition-transform duration-200 rotate-90 scale-110" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Overlay Escuro para Mobile */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 top-16 bg-black/80 z-40 lg:hidden animate-fadeIn"
          aria-hidden="true"
        />
      )}

      {/* Gaveta / Dropdown Mobile Soberano com TODOS os elementos do Desktop */}
      {mobileMenuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Menu Principal de Navegação"
          className="fixed top-16 left-0 right-0 z-50 lg:hidden max-h-[calc(100vh-4.5rem)] overflow-y-auto no-scrollbar bg-[#070002]/98 border-b border-red-950/60 shadow-[0_30px_70px_rgba(0,0,0,0.98)] px-4 py-5 animate-fadeIn"
        >
          {/* Card de Identidade / Autenticação no Topo da Gaveta */}
          <div className="mb-5 p-3.5 rounded-2xl bg-gradient-to-br from-red-950/30 via-neutral-900/60 to-black/80 border border-white/10 shadow-lg">
            {currentUser.isLoggedIn ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-xl bg-red-950/60 border border-red-600/40 flex items-center justify-center text-red-400 shadow-[0_0_15px_rgba(255,7,58,0.3)]">
                    <User className="w-5 h-5" />
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#070002]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-sm text-white">
                        {currentUser.name || "Membro Autenticado"}
                      </span>
                      {isUserAdmin && (
                        <span className="text-[10px] px-1.5 py-0.2 bg-red-500/20 text-red-400 font-extrabold rounded border border-red-500/30">
                          ADMIN
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-neutral-400 font-mono">
                      {currentUser.email || "Sessão Ativa Soberana"}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-950/40 border border-red-600/30 text-red-400 hover:text-red-300 text-xs font-semibold transition-all active:scale-95 cursor-pointer"
                  title="Encerrar sessão"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sair</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-red-400">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">Área de Membros Pro X</span>
                    <span className="text-[11px] text-neutral-400">Acesse seus ativos e comunidade</span>
                  </div>
                </div>

                <Link
                  href="/comunidade/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-red-600 to-red-800 text-white font-bold text-xs shadow-[0_0_15px_rgba(255,7,58,0.35)] active:scale-95 transition-all cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Entrar</span>
                </Link>
              </div>
            )}
          </div>

          {/* Seção de Navegação Principal */}
          <div className="mb-2">
            <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-neutral-400 px-3 block mb-2">
              Navegação do Ecossistema
            </span>

            <div className="space-y-1.5">
              {navLinks.map((item) => {
                const Icon = item.icon;
                const isActive =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium transition-all active:scale-[0.98]",
                      isActive
                        ? "bg-red-950/40 text-white border border-red-600/40 shadow-[0_0_20px_rgba(255,7,58,0.2)] font-semibold"
                        : "text-neutral-300 hover:text-white hover:bg-white/5 border border-transparent"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
                          isActive
                            ? "bg-red-600/30 text-red-400"
                            : "bg-white/5 text-neutral-400"
                        )}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-sm">{item.name}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {item.badge && (
                        <Badge variant={item.badge === "PRO" ? "red" : "gold"}>
                          {item.badge}
                        </Badge>
                      )}
                      <ChevronRight
                        className={cn(
                          "w-4 h-4 text-neutral-500",
                          isActive && "text-red-400 translate-x-0.5"
                        )}
                      />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Seção Administrativa & Ferramentas Soberanas */}
          <div className="pt-3 mt-3 border-t border-white/10 space-y-2">
            <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-neutral-400 px-3 block mb-1">
              Controle Soberano
            </span>

            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className={cn(
                "flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-bold transition-all active:scale-[0.98]",
                pathname.startsWith("/admin")
                  ? "bg-red-950/50 text-white border border-red-500/50 shadow-[0_0_20px_rgba(255,7,58,0.3)]"
                  : "bg-white/[0.03] text-red-300 hover:text-white hover:bg-white/[0.08] border border-white/10"
              )}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-red-500/20 text-red-400 flex items-center justify-center border border-red-500/30">
                  <Crown className="w-4 h-4" />
                </div>
                <span>Painel Admin Soberano</span>
              </div>
              <ChevronRight className="w-4 h-4 text-red-400" />
            </Link>
          </div>

          {/* Rodapé de Encerramento com Safe Area */}
          <div className="mt-4 pt-3 border-t border-white/5 text-center safe-bottom">
            <span className="text-[10px] font-mono text-neutral-400 tracking-wider">
              MATEUS CELESTINO PRO X • BUSINESS OS
            </span>
          </div>
        </div>
      )}
    </header>
  );
}

export const MasterSovereignBar = Navbar;
