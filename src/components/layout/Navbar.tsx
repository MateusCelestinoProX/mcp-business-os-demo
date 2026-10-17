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

  const handleLogout = () => {
    setStoredUser(DEFAULT_GUEST_USER);
    setCurrentUser(DEFAULT_GUEST_USER);
  };

  const isUserAdmin = hasAdminAccess(currentUser);

  return (
    <header
      id="master-sovereign-bar"
      className="fixed top-0 left-0 right-0 w-full z-50 h-16 bg-[#030305]/90 backdrop-blur-3xl border-b border-white/10 shadow-[0_10px_35px_rgba(0,0,0,0.85)] transition-all duration-300"
    >
      <div className="w-full px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
        {/* Logo & Marca */}
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

        {/* Links Centrais Desktop */}
        <div className="hidden md:flex items-center gap-1.5 bg-black/40 p-1 rounded-xl border border-white/5">
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
                  "flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all duration-200 relative group",
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
                        : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
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
        </div>

        {/* Lado Direito Desktop: Botões fiéis e soberanos sempre presentes */}
        <div className="hidden lg:flex items-center gap-3">
          <Link href="/admin">
            <Button variant="secondary" size="sm" className="gap-1.5 text-xs border-white/10 hover:border-white/20">
              <Crown className="w-3.5 h-3.5 text-red-400" />
              <span>Painel Admin</span>
            </Button>
          </Link>

          {currentUser.isLoggedIn ? (
            <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs">
              <span className="font-semibold text-white">{currentUser.name || "Mateus Celestino Pro X"}</span>
              <button
                onClick={handleLogout}
                title="Encerrar sessão"
                className="text-neutral-400 hover:text-red-400 transition-colors ml-1 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <Link
              href="/comunidade/login"
              title="Acessar sessão / Login"
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs hover:border-white/20 transition-colors group cursor-pointer"
            >
              <span className="font-semibold text-white">Mateus Celestino Pro X</span>
              <LogIn className="w-3.5 h-3.5 text-neutral-400 group-hover:text-red-400 transition-colors" />
            </Link>
          )}
        </div>

        {/* Botão Mobile */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-white/5 border border-white/10 text-neutral-300 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Menu Mobile */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#030305]/98 backdrop-blur-2xl border-b border-white/10 px-4 py-4 space-y-3">
          {navLinks.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium text-neutral-300 hover:bg-white/5"
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 text-red-400" />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <Badge variant={item.badge === "PRO" ? "red" : "gold"}>
                    {item.badge}
                  </Badge>
                )}
              </Link>
            );
          })}

          <div className="pt-2 border-t border-white/10 space-y-2">
            {currentUser.isLoggedIn ? (
              <>
                {isUserAdmin && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-bold text-red-400 bg-red-950/20"
                  >
                    <Crown className="w-4 h-4" />
                    <span>Painel Admin</span>
                  </Link>
                )}
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2 text-xs text-red-400"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Encerrar Sessão</span>
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2">
                <Link href="/comunidade/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="secondary" size="md" className="w-full justify-center">
                    Entrar
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export const MasterSovereignBar = Navbar;
