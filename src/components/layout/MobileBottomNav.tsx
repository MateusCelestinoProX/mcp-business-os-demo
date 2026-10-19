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
  BookOpen,
  Crown,
  Mail,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  UnifiedUser,
  DEFAULT_GUEST_USER,
  getStoredUser,
  hasAdminAccess,
} from "@/lib/auth/unified-auth";

export interface MobileNavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  badge?: string;
  adminOnly?: boolean;
}

export const mobileNavItems: MobileNavItem[] = [
  { name: "Portal", href: "/", icon: Shield },
  { name: "Showcase", href: "/showcase", icon: Sparkles },
  { name: "Shop", href: "/shop", icon: ShoppingBag },
  { name: "Comunidade", href: "/comunidade", icon: Users },
  { name: "Free Resources", href: "/biblioteca", icon: FolderGit2 },
  { name: "Artigos", href: "/artigos", icon: BookOpen },
  { name: "Admin", href: "/admin", icon: Crown, adminOnly: true },
  { name: "Contato", href: "/contato", icon: Mail },
];

export function MobileBottomNav() {
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement>(null);
  const activeItemRef = useRef<HTMLAnchorElement>(null);
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

  const isUserAdmin = hasAdminAccess(currentUser);

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
      className="md:hidden fixed bottom-3 inset-x-2 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 sm:w-auto sm:max-w-xl z-40 bg-[#060002]/92 backdrop-blur-2xl border border-red-950/70 rounded-2xl sm:rounded-3xl shadow-[0_12px_40px_rgba(0,0,0,0.95),0_0_22px_rgba(255,7,58,0.22)] pb-[max(0.35rem,env(safe-area-inset-bottom,0.35rem))] pt-1.5 px-1.5 transition-all"
    >
      {/* Máscaras sutis de Gradiente Esquerda/Direita para sinalizar scroll caso necessário */}
      <div className="absolute left-1 top-1 bottom-1 w-3 bg-gradient-to-r from-[#060002]/90 to-transparent pointer-events-none z-10 rounded-l-xl" />
      <div className="absolute right-1 top-1 bottom-1 w-3 bg-gradient-to-l from-[#060002]/90 to-transparent pointer-events-none z-10 rounded-r-xl" />

      <div
        ref={containerRef}
        className="flex items-center justify-between sm:justify-center overflow-x-auto no-scrollbar h-13 max-w-full mx-auto gap-1 px-1 scroll-smooth touch-pan-x"
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
                "relative flex flex-col items-center justify-center flex-shrink-0 min-w-[50px] xs:min-w-[54px] sm:min-w-[62px] min-h-[44px] h-12 py-1 px-1 rounded-xl transition-all duration-200 active:scale-95 group",
                isActive
                  ? "text-white font-bold"
                  : "text-neutral-400 hover:text-neutral-200"
              )}
            >
              {/* Active Indicator Carmesim Superior */}
              {isActive && (
                <span className="absolute top-0.5 left-1/2 -translate-x-1/2 w-5 h-[2px] bg-gradient-to-r from-transparent via-[#ff073a] to-transparent shadow-[0_0_8px_#ff073a]" />
              )}

              {/* Ícone com cápsula e active glow carmesim */}
              <div
                className={cn(
                  "relative flex items-center justify-center w-7 h-6 sm:w-8 sm:h-7 rounded-lg transition-all duration-300",
                  isActive
                    ? isAdminItem
                      ? "bg-amber-950/80 text-amber-300 shadow-[0_0_18px_rgba(255,215,0,0.5)] border border-amber-500/60"
                      : "bg-red-950/70 text-red-400 shadow-[0_0_18px_rgba(255,7,58,0.45)] border border-red-600/50"
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
                        ? "scale-110 text-amber-300"
                        : "scale-110 text-red-400"
                      : "group-hover:scale-105"
                  )}
                  strokeWidth={isActive ? 2.3 : 1.8}
                />
                {isActive && (
                  <span
                    className={cn(
                      "absolute -bottom-0.5 w-1.5 h-1.5 rounded-full shadow-[0_0_8px]",
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
                      ? "text-amber-300 font-bold drop-shadow-[0_0_8px_rgba(255,215,0,0.4)]"
                      : "text-red-400 font-bold drop-shadow-[0_0_8px_rgba(255,7,58,0.3)]"
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
