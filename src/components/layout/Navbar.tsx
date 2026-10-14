"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Shield,
  Users,
  FolderGit2,
  Menu,
  X,
  Sparkles,
  Crown,
  ChevronDown,
  UserCheck,
  LogOut,
  LogIn,
  Sliders,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  UserRole,
  UnifiedUser,
  DEFAULT_GUEST_USER,
  DEMO_USERS,
  getStoredUser,
  setStoredUser,
  hasAdminOrModerAccess,
} from "@/lib/auth/unified-auth";

export interface NavLinkItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

/**
 * Links Soberanos Centrais Públicos (Form Builder removido por diretriz e alocado no Painel Admin)
 */
export const navLinks: NavLinkItem[] = [
  { name: "Portal Institucional", href: "/", icon: Shield },
  { name: "Comunidade VIP", href: "/comunidade", icon: Users, badge: "PRO" },
  { name: "Biblioteca Galadriel", href: "/biblioteca", icon: FolderGit2, badge: "COFRE" },
];

/**
 * Master Sovereign Bar — FULL SCREEN WIDTH
 * Barra de Navegação Soberana Unificada de Largura Total
 */
export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<UnifiedUser>(DEFAULT_GUEST_USER);

  // Carrega e sincroniza autenticação global
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

    window.addEventListener('mcp_auth_changed', handleAuthChange);
    window.addEventListener('storage', handleAuthChange);
    return () => {
      window.removeEventListener('mcp_auth_changed', handleAuthChange);
      window.removeEventListener('storage', handleAuthChange);
    };
  }, []);

  const handleSwitchRole = (newRole: UserRole) => {
    const userToSet = DEMO_USERS[newRole];
    setStoredUser(userToSet);
    setCurrentUser(userToSet);
    setRoleDropdownOpen(false);
  };

  const handleLogout = () => {
    setStoredUser(DEFAULT_GUEST_USER);
    setCurrentUser(DEFAULT_GUEST_USER);
    setRoleDropdownOpen(false);
  };

  const canAccessAdmin = hasAdminOrModerAccess(currentUser);

  return (
    <header
      id="master-sovereign-bar"
      data-component="MasterSovereignBar"
      className="fixed top-0 left-0 right-0 w-full z-50 h-16 bg-[#030305]/90 backdrop-blur-3xl border-b border-white/10 shadow-[0_10px_35px_rgba(0,0,0,0.85)] transition-all duration-300"
    >
      <div className="w-full px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
        {/* Logo & Marca Soberana */}
        <Link
          href="/"
          title="Ir para o Portal Institucional"
          className="flex items-center gap-3 group transition-transform duration-200 active:scale-95"
        >
          <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-red-600 via-red-800 to-black p-[1px] flex items-center justify-center shadow-[0_0_15px_rgba(255,7,58,0.4)] group-hover:shadow-[0_0_25px_rgba(255,7,58,0.7)] transition-all">
            <div className="w-full h-full bg-[#030305] rounded-[11px] flex items-center justify-center">
              <span className="font-extrabold text-sm tracking-tighter text-white group-hover:text-red-400 transition-colors">
                MCP
              </span>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm tracking-wide text-white">
                MATEUS CELESTINO
              </span>
              <span className="text-[10px] font-black uppercase px-1.5 py-0.5 rounded bg-red-600/30 text-red-400 border border-red-500/40">
                PRO
              </span>
            </div>
            <span className="text-[10px] tracking-widest text-neutral-400 font-mono">
              PLATAFORMA SOBERANA
            </span>
          </div>
        </Link>

        {/* Links Centrais Desktop (Sem Form Builder, exclusivo para as 3 páginas principais) */}
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
                title={`Navegar para ${item.name}`}
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

        {/* Status, Botão Painel Admin (apenas Moder/Admin) & Ações de Usuário */}
        <div className="hidden lg:flex items-center gap-3">
          <Badge variant="success" dot className="text-[10px] py-1">
            SOBERANO ONLINE
          </Badge>

          {/* BOTÃO PAINEL ADMIN: Somente Moder e Admin possuem acesso no layout */}
          {canAccessAdmin && (
            <Link href="/admin">
              <button
                id="header-admin-panel-btn"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-amber-600/20 hover:from-amber-500/30 hover:to-amber-600/30 border border-amber-500/40 text-amber-300 text-xs font-bold transition-all shadow-[0_0_15px_rgba(245,158,11,0.25)] hover:scale-105 active:scale-95"
                title="Acessar Painel Administrativo Geral"
              >
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                <span>Painel Admin</span>
              </button>
            </Link>
          )}

          {/* User Profile / Role Switcher Pill */}
          <div className="relative">
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 transition-all text-xs text-white"
            >
              <img
                src={currentUser.avatar}
                alt="Avatar"
                width={24}
                height={24}
                className="w-6 h-6 rounded-full border border-white/20 object-cover flex-shrink-0"
              />
              <div className="flex flex-col text-left">
                <span className="text-[11px] font-bold leading-tight">
                  {currentUser.name}
                </span>
                <span className="text-[9px] font-mono tracking-wider font-semibold uppercase text-red-400">
                  {currentUser.role === 'admin'
                    ? '👑 ADMIN'
                    : currentUser.role === 'moder'
                    ? '🛡️ MODER'
                    : currentUser.role === 'user'
                    ? '🔵 MEMBRO'
                    : '⚪ VISITANTE'}
                </span>
              </div>
              <ChevronDown className="w-3 h-3 text-neutral-400" />
            </button>

            {/* User Profile / Menu Autêntico */}
            {roleDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#09080c]/95 backdrop-blur-2xl border border-white/15 p-2.5 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-3 py-2 border-b border-white/10 space-y-0.5">
                  <div className="text-xs font-bold text-white truncate">{currentUser.name}</div>
                  <div className="text-[10px] text-neutral-400 font-mono truncate">{currentUser.email || "Sessão Anônima"}</div>
                </div>

                <div className="pt-2 space-y-1">
                  {canAccessAdmin && (
                    <Link
                      href="/admin"
                      onClick={() => setRoleDropdownOpen(false)}
                      className="w-full flex items-center gap-2 py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-medium transition-colors"
                    >
                      <Crown className="w-3.5 h-3.5 text-amber-400" />
                      <span>Painel Admin</span>
                    </Link>
                  )}

                  <Link
                    href="/comunidade"
                    onClick={() => setRoleDropdownOpen(false)}
                    className="w-full flex items-center gap-2 py-2 px-3 rounded-xl hover:bg-white/5 text-neutral-300 hover:text-white text-xs transition-colors"
                  >
                    <Users className="w-3.5 h-3.5 text-red-400" />
                    <span>Área de Membros</span>
                  </Link>

                  {currentUser.isLoggedIn ? (
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-red-400 hover:bg-red-950/20 transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Encerrar Sessão</span>
                    </button>
                  ) : (
                    <Link
                      href="/comunidade/login"
                      onClick={() => setRoleDropdownOpen(false)}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-emerald-400 hover:bg-emerald-950/20 transition-colors"
                    >
                      <LogIn className="w-3.5 h-3.5" />
                      <span>Fazer Login</span>
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>

          <Link href="/comunidade">
            <Button variant="fired" size="sm" className="gap-1.5 text-xs shadow-md">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Área VIP</span>
            </Button>
          </Link>
        </div>

        {/* Botão Mobile Menu */}
        <div className="flex md:hidden items-center gap-2">
          {canAccessAdmin && (
            <Link href="/admin">
              <button className="p-1.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold">
                👑
              </button>
            </Link>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-white/[0.05] border border-white/10 text-neutral-300 hover:text-white"
            aria-label="Abrir menu soberano"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Drawer Mobile Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden w-full bg-[#030305]/95 backdrop-blur-3xl border-b border-white/15 p-4 space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
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
                  "flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all",
                  isActive
                    ? "bg-red-600/20 text-white border border-red-500/40"
                    : "text-neutral-300 hover:bg-white/[0.05]"
                )}
              >
                <div className="flex items-center gap-3">
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

          {canAccessAdmin && (
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40"
            >
              <div className="flex items-center gap-3">
                <Crown className="w-4 h-4 text-amber-400" />
                <span>Painel Admin (Restrito)</span>
              </div>
              <Badge variant="gold">ADMIN</Badge>
            </Link>
          )}

          <div className="pt-2 border-t border-white/10 flex flex-col gap-2">
            <div className="flex items-center justify-between px-2 text-xs text-neutral-400">
              <span>Papel Atual:</span>
              <span className="font-bold uppercase text-white font-mono">
                {currentUser.role}
              </span>
            </div>
            <div className="grid grid-cols-4 gap-1 pt-1">
              <button
                onClick={() => handleSwitchRole('visitante')}
                className="py-1 px-1 text-[10px] rounded bg-white/5 border border-white/10 text-neutral-300"
              >
                Visitante
              </button>
              <button
                onClick={() => handleSwitchRole('user')}
                className="py-1 px-1 text-[10px] rounded bg-white/5 border border-white/10 text-neutral-300"
              >
                User
              </button>
              <button
                onClick={() => handleSwitchRole('moder')}
                className="py-1 px-1 text-[10px] rounded bg-amber-500/20 border border-amber-500/30 text-amber-300"
              >
                Moder
              </button>
              <button
                onClick={() => handleSwitchRole('admin')}
                className="py-1 px-1 text-[10px] rounded bg-red-600/20 border border-red-500/30 text-red-300"
              >
                Admin
              </button>
            </div>
            <Link href="/comunidade" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="fired" size="md" className="w-full mt-2">
                Acessar Comunidade VIP
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

// Exportação explícita como MasterSovereignBar
export const MasterSovereignBar = Navbar;
