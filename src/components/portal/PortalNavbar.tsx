'use client';

import React, { useState, useEffect } from 'react';
import {
  Flame,
  BookOpen,
  User,
  Mail,
  Search,
  MessageSquare,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react';

export interface PortalNavbarProps {
  activeTab?: string;
  onNavigate?: (tabId: string) => void;
  onOpenSearch?: () => void;
  profileWhatsapp?: string;
}

export function PortalNavbar({
  activeTab = 'home',
  onNavigate,
  onOpenSearch,
  profileWhatsapp,
}: PortalNavbarProps) {
  const [currentSection, setCurrentSection] = useState(activeTab);
  const [isScrolled, setIsScrolled] = useState(false);

  // Monitorar scroll e atualizar aba ativa
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 80);

      const sections = ['contato', 'sobre', 'publicacoes'];
      let detected = 'home';

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 200) {
            detected = sectionId;
            break;
          }
        }
      }

      setCurrentSection(detected);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home', label: 'Início', icon: Flame },
    { id: 'publicacoes', label: 'Artigos (176)', icon: BookOpen },
    { id: 'sobre', label: 'Sobre', icon: User },
    { id: 'contato', label: 'Contato', icon: Mail },
  ];

  const handleTabClick = (id: string) => {
    setCurrentSection(id);
    if (onNavigate) {
      onNavigate(id);
    } else {
      if (id === 'home') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.location.href = `/#${id}`;
        }
      }
    }
  };

  const whatsappUrl =
    profileWhatsapp ||
    'https://api.whatsapp.com/send/?phone=553197724257&text=QUERO+AUTOMATIZAR+TUDO.&type=phone_number&app_absent=0';

  return (
    <nav
      id="portal-navigation-map"
      aria-label="Mapa de Navegação Setorial Mateus Celestino Pro X"
      className="fixed top-16 left-0 right-0 z-40 px-3 sm:px-6 py-2.5 pointer-events-none transition-all duration-300"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between pointer-events-auto">
        {/* Links Centrais do Mapa de Navegação (Desktop) */}
        <div className="hidden lg:flex items-center gap-1.5 glass-crystal px-3 py-1.5 rounded-full shadow-[0_20px_45px_rgba(0,0,0,0.9)] border border-white/10">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono tracking-wide transition-all duration-300 relative cursor-pointer ${
                  isActive
                    ? 'text-white glass-pill-red font-bold shadow-[0_0_20px_rgba(255,7,58,0.35)]'
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

        {/* Ações Rápidas à Direita: Buscar (⌘K) + CTA WhatsApp */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-2 glass-crystal hover:border-[#ff073a]/50 text-zinc-300 hover:text-white px-3 py-1.5 rounded-xl text-xs font-mono transition-all duration-300 shadow-lg cursor-pointer"
            title="Pesquisar artigos do acervo (⌘K)"
          >
            <Search className="w-3.5 h-3.5 text-[#ff073a]" />
            <span className="hidden sm:inline">Buscar</span>
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[9px] bg-white/10 border border-white/15 rounded text-zinc-300 font-mono">
              ⌘K
            </kbd>
          </button>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="glass-button-fired flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold tracking-wide text-white shadow-xl hover:scale-105 active:scale-95 transition-transform"
            title="Abrir WhatsApp oficial"
          >
            <MessageSquare className="w-3.5 h-3.5 fill-white/20" />
            <span className="hidden sm:inline">QUERO AUTOMATIZAR TUDO</span>
            <span className="sm:hidden text-[11px]">AUTOMATIZAR</span>
          </a>
        </div>

      </div>

      {/* Navegação Mobile em Pílula Scrollável Horizontalmente */}
      <div className="lg:hidden mt-2 pointer-events-auto flex items-center justify-center">
        <div className="flex items-center gap-1 glass-crystal px-2.5 py-1.5 rounded-full overflow-x-auto max-w-full shadow-2xl no-scrollbar border border-white/10">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-mono whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'text-white glass-pill-red font-bold shadow-[0_0_15px_rgba(255,7,58,0.4)]'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Icon className={`w-3 h-3 ${isActive ? 'text-[#ff073a]' : 'text-zinc-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

export default PortalNavbar;
