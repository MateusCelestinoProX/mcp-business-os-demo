"use client";

import React, { useRef, useEffect } from "react";
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

export interface MobileNavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  badge?: string;
}

export const mobileNavItems: MobileNavItem[] = [
  { name: "Portal", href: "/", icon: Shield },
  { name: "Showcase", href: "/showcase", icon: Sparkles },
  { name: "Shop", href: "/shop", icon: ShoppingBag },
  { name: "Comunidade", href: "/comunidade", icon: Users },
  { name: "Free Resources", href: "/biblioteca", icon: FolderGit2 },
  { name: "Artigos", href: "/artigos", icon: BookOpen },
  { name: "Admin", href: "/admin", icon: Crown },
  { name: "Contato", href: "/contato", icon: Mail },
];

export function MobileBottomNav() {
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement>(null);
  const activeItemRef = useRef<HTMLAnchorElement>(null);

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
  }, [pathname]);

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
      aria-label="Navegação Móvel Soberana — Elementos do Header do Sistema"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#070002]/95 backdrop-blur-2xl border-t border-red-950/60 shadow-[0_-10px_35px_rgba(0,0,0,0.95),0_-1px_15px_rgba(255,7,58,0.15)] pb-[max(0.5rem,env(safe-area-inset-bottom,0.5rem))] pt-1 px-1 transition-all"
    >
      {/* Máscaras de Gradiente Esquerda/Direita para sinalizar scroll horizontal */}
      <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-[#070002] to-transparent pointer-events-none z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-4 bg-gradient-to-l from-[#070002] to-transparent pointer-events-none z-10" />

      <div
        ref={containerRef}
        className="flex items-center justify-start overflow-x-auto no-scrollbar h-14 max-w-full mx-auto gap-1 px-2 scroll-smooth touch-pan-x"
      >
        {mobileNavItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              ref={isActive ? activeItemRef : null}
              href={item.href}
              onClick={handleTabClick}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "relative flex flex-col items-center justify-center flex-shrink-0 min-w-[66px] h-12 py-1 px-1.5 rounded-xl transition-all duration-200 active:scale-95 group",
                isActive
                  ? "text-white font-bold"
                  : "text-neutral-400 hover:text-neutral-200"
              )}
            >
              {/* Active Indicator Carmesim Superior */}
              {isActive && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-[2px] bg-gradient-to-r from-transparent via-[#ff073a] to-transparent shadow-[0_0_8px_#ff073a]" />
              )}

              {/* Ícone com cápsula e active glow carmesim */}
              <div
                className={cn(
                  "relative flex items-center justify-center w-8 h-7 rounded-lg transition-all duration-300",
                  isActive
                    ? "bg-red-950/70 text-red-400 shadow-[0_0_18px_rgba(255,7,58,0.45)] border border-red-600/50"
                    : "text-neutral-400 group-hover:text-neutral-200"
                )}
              >
                <Icon
                  className={cn(
                    "w-4 h-4 transition-transform duration-200",
                    isActive ? "scale-110 text-red-400" : "group-hover:scale-105"
                  )}
                  strokeWidth={isActive ? 2.3 : 1.8}
                />
                {isActive && (
                  <span className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-[#ff073a] shadow-[0_0_8px_#ff073a]" />
                )}
              </div>

              {/* Rótulo de texto nítido */}
              <span
                className={cn(
                  "text-[9.5px] tracking-tight mt-0.5 whitespace-nowrap leading-none transition-colors",
                  isActive
                    ? "text-red-400 font-bold drop-shadow-[0_0_8px_rgba(255,7,58,0.3)]"
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
