'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import {
  Flame,
  BookOpen,
  User,
  Mail,
  MessageSquare,
} from 'lucide-react';

export interface PortalNavbarProps {
  activeTab?: string;
  onNavigate?: (tabId: string) => void;
  profileWhatsapp?: string;
}

export function PortalNavbar({
  activeTab = 'home',
  onNavigate,
  profileWhatsapp,
}: PortalNavbarProps) {
  const pathname = usePathname();
  const [currentSection, setCurrentSection] = useState(activeTab);
  const [isScrolled, setIsScrolled] = useState(false);

  // Monitorar scroll suave com RAF (zero jank / 60-120fps)
  useEffect(() => {
    if (pathname !== '/') {
      setCurrentSection('');
      return;
    }

    let ticking = false;

    const updateActiveSection = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 80);

      const sections = ['contato', 'sobre', 'publicacoes'];
      let detected = 'home';

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const rect = el.getBoundingClientRect();
          // Offset ergonômico considerando viewport móvel e desktop
          if (rect.top <= 260) {
            detected = sectionId;
            break;
          }
        }
      }

      setCurrentSection(detected);
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateActiveSection);
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    updateActiveSection();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  const navItems = [
    { id: 'home', label: 'Início', shortLabel: 'Início', icon: Flame },
    { id: 'publicacoes', label: 'Artigos (176)', shortLabel: 'Artigos', icon: BookOpen },
    { id: 'sobre', label: 'Sobre', shortLabel: 'Sobre', icon: User },
    { id: 'contato', label: 'Contato', shortLabel: 'Contato', icon: Mail },
  ];

  const handleTabClick = (id: string) => {
    setCurrentSection(id);
    if (onNavigate) {
      onNavigate(id);
      return;
    }

    if (id === 'home') {
      if (pathname === '/') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        window.location.href = '/';
      }
    } else {
      if (pathname === '/') {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.location.href = `/#${id}`;
        }
      } else {
        window.location.href = `/#${id}`;
      }
    }
  };

  const whatsappUrl =
    profileWhatsapp ||
    'https://api.whatsapp.com/send/?phone=553197724257&text=QUERO+AUTOMATIZAR+TUDO.&type=phone_number&app_absent=0';

  // O PortalNavbar (sub-header com Início, Artigos, Sobre, Contato) pertence exclusivamente à Home do Portal (/)
  if (pathname !== '/') {
    return null;
  }

  return (
    <>
      {/* =========================================================================
          1. VERSÃO DESKTOP (lg:flex): BARRA SUPERIOR SUSPENSA EM CRISTAL
          ========================================================================= */}
      <nav
        id="portal-navigation-map-desktop"
        aria-label="Mapa de Navegação Setorial Desktop Mateus Celestino Pro X"
        className="hidden lg:block fixed top-16 left-0 right-0 z-40 px-6 py-2.5 pointer-events-none transition-all duration-300"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between pointer-events-auto">
          {/* Links Centrais do Mapa de Navegação */}
          <div className="flex items-center gap-1 glass-crystal px-2.5 py-1 rounded-full shadow-[0_20px_45px_rgba(0,0,0,0.9)] border border-white/10">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] sm:text-xs font-mono tracking-wide transition-all duration-300 relative cursor-pointer touch-manipulation ${
                    isActive
                      ? 'text-white glass-pill-red font-bold shadow-[0_0_15px_rgba(255,7,58,0.35)]'
                      : 'text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#ff073a]' : 'text-zinc-400'}`} />
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-[2px] bg-[#ff073a] rounded-full shadow-[0_0_8px_#ff073a]" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Ação Rápida à Direita: CTA WhatsApp Soberano Compacto */}
          <div className="flex items-center gap-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-button-fired flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-mono font-bold tracking-wide text-white shadow-lg hover:scale-105 active:scale-95 transition-transform touch-manipulation cursor-pointer"
              title="Abrir WhatsApp oficial"
            >
              <MessageSquare className="w-3 h-3 fill-white/20" />
              <span>QUERO AUTOMATIZAR TUDO</span>
            </a>
          </div>
        </div>
      </nav>

      {/* =========================================================================
          2. VERSÃO MOBILE (lg:hidden): FLOATING THUMB DOCK (ZONA DO POLEGAR - FITTS' LAW)
          Alvos táteis ergonômicos e refinados.
          Exibido exclusivamente na Home (/), liberando a tela móvel para controles dedicados em páginas setoriais como /shop.
          ========================================================================= */}
      {pathname === '/' && (
        <aside
          id="portal-navigation-mobile-dock"
          aria-label="Dock Móvel de Navegação Tátil Mateus Celestino Pro X"
          className="lg:hidden fixed bottom-3 sm:bottom-4 inset-x-3 sm:inset-x-6 z-40 max-w-md mx-auto pointer-events-auto select-none touch-manipulation"
          style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
        >
          <div className="glass-crystal rounded-2xl p-1 shadow-[0_15px_40px_rgba(0,0,0,0.95),0_0_25px_rgba(255,7,58,0.25)] border border-white/20 flex items-center justify-between gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`flex-1 min-h-[36px] sm:min-h-[48px] py-1 px-1.5 rounded-xl flex flex-col items-center justify-center gap-0.5 transition-all duration-200 active:scale-95 relative cursor-pointer touch-manipulation ${
                    isActive
                      ? 'text-white glass-pill-red shadow-[0_0_15px_rgba(255,7,58,0.4)] font-bold'
                      : 'text-zinc-400 hover:text-zinc-200 active:bg-white/5'
                  }`}
                >
                  <Icon
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      isActive ? 'text-white scale-110 drop-shadow-[0_0_8px_#ff073a]' : 'text-zinc-400'
                    }`}
                  />
                  <span className="text-[9px] font-mono leading-none tracking-tight">
                    {item.shortLabel}
                  </span>
                  {isActive && (
                    <span className="absolute -top-1 w-2 h-1 bg-[#ff073a] rounded-full shadow-[0_0_6px_#ff073a]" />
                  )}
                </button>
              );
            })}

            {/* Botão de Ação Rápida WhatsApp no Thumb Dock (Min 48px hit target / min-h-[36px] touch) */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="Quero Automatizar Tudo (WhatsApp Oficial)"
              aria-label="AUTOMATIZAR"
              className="glass-button-fired min-h-[36px] sm:min-h-[48px] min-w-[48px] px-3 rounded-xl flex flex-col items-center justify-center gap-0.5 text-white shadow-lg active:scale-95 transition-transform touch-manipulation shrink-0 ml-0.5 cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 fill-white/20" />
              <span className="text-[8px] font-mono font-bold leading-none uppercase tracking-wider">
                AUTOMATIZAR
              </span>
            </a>
          </div>
        </aside>
      )}
    </>
  );
}

export default PortalNavbar;
