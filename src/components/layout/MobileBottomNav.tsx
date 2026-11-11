"use client";

import React, { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Shield,
  Sparkles,
  ShoppingBag,
  Users,
  FolderGit2,
  Crown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useVerifiedAuth } from "@/components/auth/VerifiedAuthProvider";

export interface MobileNavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  badge?: string;
  adminOnly?: boolean;
}

export const mobileNavItems: MobileNavItem[] = [
  { name: "Home Page", href: "/", icon: Shield },
  { name: "Showcase", href: "/showcase", icon: Sparkles },
  { name: "Shop", href: "/shop", icon: ShoppingBag },
  { name: "Comunidade", href: "/comunidade", icon: Users },
  { name: "Free Resources", href: "/biblioteca", icon: FolderGit2 },
  { name: "Admin", href: "/admin", icon: Crown, adminOnly: true },
];

export function MobileBottomNav() {
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement>(null);
  const activeItemRef = useRef<HTMLAnchorElement>(null);
  const { isUserAdmin } = useVerifiedAuth();

  // Filtra itens dinamicamente: Admin só aparece se admin estiver autenticado
  const visibleNavItems = mobileNavItems.filter(
    (item) => !item.adminOnly || isUserAdmin
  );

  // Auto-scroll suave para centralizar o item ativo na barra móvel
  useEffect(() => {
    if (activeItemRef.current && containerRef.current) {
      const container = containerRef.current;
      const element = activeItemRef.current;
      const containerWidth = container.clientWidth;
      const elementOffsetLeft = element.offsetLeft;
      const elementWidth = element.clientWidth;

      container.scrollTo({
        left: elementOffsetLeft - containerWidth / 2 + elementWidth / 2,
        behavior: "smooth",
      });
    }
  }, [pathname, isUserAdmin]);

  const handleTabClick = () => {
    // Dispara haptic feedback nativo para Android Bridge ou Web Vibration API
    try {
      if (typeof window !== "undefined") {
        if ((window as any).AndroidBridge?.vibrate) {
          (window as any).AndroidBridge.vibrate(25);
        } else if (navigator && "vibrate" in navigator) {
          navigator.vibrate(15);
        }
      }
    } catch {
      // Ignora silenciosamente caso não haja suporte
    }
  };

  return (
    <nav
      id="mobile-sovereign-bottom-bar"
      aria-label="Navegação Móvel Soberana — Android Docker Navbar"
      className="md:hidden fixed bottom-3 inset-x-2 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 sm:w-auto sm:max-w-xl z-40 bg-[#0a0a0e]/90 backdrop-blur-2xl border border-white/10 border-t-white/15 rounded-2xl sm:rounded-3xl shadow-[0_16px_36px_rgba(0,0,0,0.8),0_0_1px_rgba(255,255,255,0.15)] pb-[max(0.35rem,env(safe-area-inset-bottom,0.35rem))] pt-1.5 px-1.5 transition-all"
    >
      {/* Máscaras sutis de Gradiente Esquerda/Direita para sinalizar scroll caso necessário */}
      <div className="absolute left-1 top-1 bottom-1 w-3 bg-gradient-to-r from-[#0a0a0e]/95 to-transparent pointer-events-none z-10 rounded-l-xl" />
      <div className="absolute right-1 top-1 bottom-1 w-3 bg-gradient-to-l from-[#0a0a0e]/95 to-transparent pointer-events-none z-10 rounded-r-xl" />

      <div
        ref={containerRef}
        className="flex items-center justify-between sm:justify-center overflow-x-auto no-scrollbar h-12 max-w-full mx-auto gap-1 px-1 scroll-smooth touch-pan-x"
      >
        {visibleNavItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          const Icon = item.icon;
          const isAdminItem = item.adminOnly;

          return (
            <Link
              key={item.href}
              ref={isActive ? activeItemRef : null}
              href={item.href}
              onClick={handleTabClick}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "relative flex flex-col items-center justify-center flex-shrink-0 min-w-[48px] xs:min-w-[52px] sm:min-w-[60px] min-h-[44px] h-11 py-1 px-1 rounded-xl transition-all duration-200 active:scale-95 group",
                isActive
                  ? "text-white font-semibold"
                  : "text-neutral-400 hover:text-neutral-200"
              )}
            >
              {/* Active Indicator Carmesim Superior */}
              {isActive && (
                <span className="absolute top-0.5 left-1/2 -translate-x-1/2 w-4.5 h-[2px] bg-[#ff073a] shadow-[0_0_6px_#ff073a] rounded-full" />
              )}

              {/* Ícone com cápsula e active glow carmesim refinado */}
              <div
                className={cn(
                  "relative flex items-center justify-center w-7 h-6 sm:w-8 sm:h-7 rounded-lg transition-all duration-300",
                  isActive
                    ? isAdminItem
                      ? "bg-amber-950/60 text-amber-300 shadow-[0_0_14px_rgba(255,215,0,0.35)] border border-amber-500/50"
                      : "bg-red-500/15 text-red-400 shadow-[0_0_14px_rgba(255,7,58,0.25)] border border-red-500/35"
                    : isAdminItem
                    ? "text-amber-400/80 group-hover:text-amber-300"
                    : "text-neutral-400 group-hover:text-neutral-200"
                )}
              >
                <Icon
                  className={cn(
                    "w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-200",
                    isActive
                      ? isAdminItem
                        ? "scale-105 text-amber-300"
                        : "scale-105 text-red-400"
                      : "group-hover:scale-105"
                  )}
                  strokeWidth={isActive ? 2.2 : 1.8}
                />
                {isActive && (
                  <span
                    className={cn(
                      "absolute -bottom-0.5 w-1 h-1 rounded-full shadow-[0_0_6px]",
                      isAdminItem ? "bg-amber-400 shadow-amber-400" : "bg-[#ff073a] shadow-[#ff073a]"
                    )}
                  />
                )}
              </div>

              {/* Rótulo de texto nítido */}
              <span
                className={cn(
                  "text-[8.5px] xs:text-[9px] tracking-tight mt-0.5 whitespace-nowrap leading-none transition-colors",
                  isActive
                    ? isAdminItem
                      ? "text-amber-300 font-semibold"
                      : "text-red-400 font-semibold"
                    : "text-neutral-400 group-hover:text-neutral-300"
                )}
              >
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export default MobileBottomNav;
