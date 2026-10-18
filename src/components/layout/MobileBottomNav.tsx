"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Shield,
  BookOpen,
  Sparkles,
  Users,
  FolderGit2,
  ShoppingBag,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileNavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

const mobileNavItems: MobileNavItem[] = [
  { name: "Início", href: "/", icon: Shield },
  { name: "Artigos", href: "/artigos", icon: BookOpen },
  { name: "Showcase", href: "/showcase", icon: Sparkles },
  { name: "Comunidade", href: "/comunidade", icon: Users },
  { name: "Cofre", href: "/biblioteca", icon: FolderGit2 },
  { name: "Shop", href: "/shop", icon: ShoppingBag },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  const handleTabClick = () => {
    // Dispara haptic feedback se executando dentro do container nativo Android
    try {
      if (typeof window !== "undefined" && (window as any).AndroidBridge?.vibrate) {
        (window as any).AndroidBridge.vibrate(25);
      }
    } catch {
      // Ignora silenciosamente fora do Android
    }
  };

  return (
    <nav
      id="mobile-sovereign-bottom-bar"
      aria-label="Navegação Móvel Soberana"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#070002]/90 backdrop-blur-2xl border-t border-red-950/40 shadow-[0_-10px_30px_rgba(0,0,0,0.9)] pb-[env(safe-area-inset-bottom,0.5rem)] pt-1 px-2"
    >
      <div className="flex items-center justify-around h-14 max-w-lg mx-auto">
        {mobileNavItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={handleTabClick}
              className={cn(
                "flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl transition-all duration-200 active:scale-90",
                isActive
                  ? "text-red-500 font-bold"
                  : "text-zinc-400 hover:text-zinc-200"
              )}
            >
              <div
                className={cn(
                  "relative flex items-center justify-center w-8 h-8 rounded-lg transition-all",
                  isActive
                    ? "bg-red-950/60 text-red-500 shadow-[0_0_15px_rgba(255,7,58,0.5)] border border-red-600/40"
                    : "text-zinc-400"
                )}
              >
                <Icon className={cn("w-4 h-4 transition-transform", isActive && "scale-110")} />
                {isActive && (
                  <span className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_8px_#ff073a]" />
                )}
              </div>
              <span className="text-[10px] tracking-tight mt-0.5 whitespace-nowrap">
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
