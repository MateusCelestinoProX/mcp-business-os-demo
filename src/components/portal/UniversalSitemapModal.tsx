'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Compass,
  Layers,
  BookOpen,
  ShoppingBag,
  User,
  Mail,
  Users,
  Shield,
  Zap,
  Cpu,
  Search,
  ExternalLink,
  ChevronRight,
  Database,
  Terminal,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import GridScanShader from '@/components/shaders/GridScanShader';
import { getStoredUser, hasAdminAccess } from '@/lib/auth/unified-auth';

export interface UniversalSitemapModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateSection?: (sectionId: string) => void;
}

export function UniversalSitemapModal({
  isOpen,
  onClose,
  onNavigateSection,
}: UniversalSitemapModalProps) {
  const [activeFilter, setActiveFilter] = useState<'all' | 'site' | 'vault' | 'comunidade'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isUserAdmin, setIsUserAdmin] = useState(false);

  useEffect(() => {
    setIsUserAdmin(hasAdminAccess(getStoredUser()));
    const handleAuthChange = () => {
      setIsUserAdmin(hasAdminAccess(getStoredUser()));
    };
    window.addEventListener('mcp_auth_changed', handleAuthChange);
    window.addEventListener('storage', handleAuthChange);
    return () => {
      window.removeEventListener('mcp_auth_changed', handleAuthChange);
      window.removeEventListener('storage', handleAuthChange);
    };
  }, []);

  // Trava scroll da página quando modal estiver aberto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = 'unset';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleAction = (type: 'scroll' | 'route', target: string) => {
    onClose();
    if (type === 'scroll') {
      if (onNavigateSection) {
        onNavigateSection(target);
      } else {
        const el = document.getElementById(target);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.location.href = target;
    }
  };

  const vaultCategories = [
    'The Skeleton Method',
    'Prompts & Frameworks',
    'Miko AI',
    'Security & Sentinel',
    'Creative Studio',
    'Nova Era da IA',
    'Nano Banana',
    'AI Animation',
    'Historika AI',
    'Sex Scalating',
    'Geral / Core'
  ];

  const searchLower = searchTerm.toLowerCase();
  const matchesSearch = (text: string) => !searchTerm || text.toLowerCase().includes(searchLower);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-5 md:p-8 bg-black/85 backdrop-blur-2xl animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* Container Central Monumental em Vidro Líquido com Shader Integrado */}
      <div
        className="relative w-full h-full sm:h-auto sm:max-w-6xl sm:max-h-[92vh] flex flex-col rounded-none sm:rounded-3xl bg-[#060609]/95 border-0 sm:border sm:border-white/10 shadow-[0_0_80px_rgba(255,7,58,0.2),0_30px_70px_rgba(0,0,0,0.95)] overflow-hidden safe-pt safe-pb"
        onClick={(e) => e.stopPropagation()}
      >
        {/* SHADER DINÂMICO DE FUNDO (GridScan Vermelho Carmesim em Baixa Opacidade) */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none rounded-none sm:rounded-3xl">
          <GridScanShader
            className="w-full h-full mix-blend-screen opacity-40"
            linesColor="#100003"
            scanColor="#ff073a"
            bloomIntensity={0.65}
            scanGlow={0.45}
          />
          {/* Fusão em Gradiente Radial e Vanta Black para Legibilidade Absoluta */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#060609]/85 via-[#060609]/75 to-[#060609]/95 backdrop-blur-[2px]" />
          <div className="absolute inset-0 bg-radial from-transparent via-[#060609]/40 to-[#060609]/90" />
          <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#ff073a] to-transparent opacity-80" />
        </div>

        {/* =========================================================================
            HEADER HUD MINIMALISTA & VISUAL MOBILE-FIRST
            ========================================================================= */}
        <div className="relative z-10 px-4 sm:px-7 py-3.5 sm:py-4 border-b border-white/[0.08] bg-black/50 backdrop-blur-xl flex flex-col gap-3">
          {/* Linha 1: Título e Botão Fechar */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-gradient-to-br from-red-600/30 via-red-950/40 to-black border border-red-500/40 flex items-center justify-center text-[#ff073a] shadow-[0_0_15px_rgba(255,7,58,0.3)] shrink-0">
                <Compass className="w-4 h-4 sm:w-5 sm:h-5 text-[#ff073a]" />
              </div>
              <div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-widest text-[#ff073a]">
                    SITEMAP // FLUXOGRAMA
                  </span>
                  <span className="text-zinc-600 text-xs">•</span>
                  <span className="text-[10px] sm:text-[11px] font-mono text-zinc-400">Mateus Celestino Pro X</span>
                </div>
                <h2 className="text-sm sm:text-lg font-black text-white tracking-tight">
                  Arquitetura Geral do Ecossistema
                </h2>
              </div>
            </div>

            {/* Botão Fechar Modal com Touch Target de 44px */}
            <button
              onClick={onClose}
              className="w-11 h-11 rounded-xl bg-white/[0.05] hover:bg-red-950/60 active:scale-95 border border-white/10 hover:border-red-500/40 text-zinc-300 hover:text-white transition-all flex items-center justify-center cursor-pointer touch-manipulation shrink-0"
              title="Fechar (ESC)"
              aria-label="Fechar sitemap"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Linha 2: Filtros e Busca Rápida */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-1">
            {/* Pílulas de Filtro (Scroll horizontal suave) */}
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5 bg-black/40 p-1 rounded-xl border border-white/[0.08]">
              {[
                { id: 'all', label: 'Tudo' },
                { id: 'site', label: 'Site' },
                { id: 'vault', label: 'Vault' },
                { id: 'comunidade', label: 'VIP' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveFilter(tab.id as any)}
                  className={`min-h-[36px] px-3 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer shrink-0 touch-manipulation active:scale-95 ${
                    activeFilter === tab.id
                      ? 'bg-red-950/80 text-white border border-red-500/50 shadow-[0_0_10px_rgba(255,7,58,0.25)] font-bold'
                      : 'text-zinc-400 hover:text-white hover:bg-white/[0.05]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Input de Busca Rápida (text-[16px] no mobile) */}
            <div className="relative w-full sm:w-56">
              <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Filtrar rotas ou guias..."
                className="w-full min-h-[40px] bg-black/60 border border-white/[0.08] rounded-xl pl-8 pr-3 py-1.5 text-[16px] sm:text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-500/50 font-mono touch-manipulation"
              />
            </div>
          </div>
        </div>

        {/* =========================================================================
            CORPO DO FLUXOGRAMA (SCROLLABLE, VISUAL & MINIMALISTA)
            ========================================================================= */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 space-y-6 relative z-10 custom-scrollbar">

          {/* NÓ CENTRAL / ROOT DO FLUXOGRAMA COM RAMIFICAÇÃO SVG */}
          <div className="flex flex-col items-center justify-center text-center">
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-[#0b0b12]/90 border border-red-500/40 shadow-[0_0_30px_rgba(255,7,58,0.28)] backdrop-blur-2xl">
              <div className="w-8 h-8 rounded-xl overflow-hidden bg-black border border-white/20 p-0.5 shrink-0">
                <img
                  src="/assets/site_icon.webp"
                  alt="Mateus Celestino Pro X Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-mono uppercase text-[#ff073a] font-bold tracking-widest">
                    HQ HUB PRINCIPAL
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ff073a] shadow-[0_0_6px_#ff073a] animate-pulse" />
                </div>
                <span className="text-sm font-extrabold text-white tracking-wide">
                  MATEUS CELESTINO <span className="text-[#ff073a]">PRO X</span>
                </span>
              </div>
            </div>

            {/* RAMIFICAÇÃO GRÁFICA DO FLUXOGRAMA EM SVG (DESKTOP) */}
            <div className="w-full max-w-4xl h-8 my-1 hidden md:flex justify-center items-center pointer-events-none">
              <svg className="w-full h-full" viewBox="0 0 800 32" fill="none">
                <line x1="400" y1="0" x2="400" y2="12" stroke="#ff073a" strokeWidth="1.5" strokeOpacity="0.8" />
                <circle cx="400" cy="12" r="2.5" fill="#ff073a" />
                
                <path d="M 120 30 L 120 20 Q 120 12 135 12 L 665 12 Q 680 12 680 20 L 680 30" stroke="url(#flowBusGlow)" strokeWidth="1.5" />
                <line x1="300" y1="12" x2="300" y2="30" stroke="#eab308" strokeWidth="1.2" strokeOpacity="0.7" />
                <line x1="500" y1="12" x2="500" y2="30" stroke="#ff073a" strokeWidth="1.2" strokeOpacity="0.7" />

                <circle cx="120" cy="30" r="2.5" fill="#ff073a" />
                <circle cx="300" cy="30" r="2.5" fill="#eab308" />
                <circle cx="500" cy="30" r="2.5" fill="#ff073a" />
                <circle cx="680" cy="30" r="2.5" fill="#a855f7" />

                <defs>
                  <linearGradient id="flowBusGlow" x1="120" y1="12" x2="680" y2="12" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#ff073a" stopOpacity="0.85" />
                    <stop offset="35%" stopColor="#eab308" stopOpacity="0.85" />
                    <stop offset="65%" stopColor="#ff073a" stopOpacity="0.85" />
                    <stop offset="100%" stopColor="#a855f7" stopOpacity="0.85" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>

          {/* =========================================================================
              OS 4 PILARES INTEGRADOS (CARDS MINIMALISTAS EM LIQUID GLASS)
              ========================================================================= */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

            {/* ---------------------------------------------------------------------
                PILAR 1: PORTAL INSTITUCIONAL (SITE /)
                --------------------------------------------------------------------- */}
            {(activeFilter === 'all' || activeFilter === 'site') && (
              <div className="rounded-2xl p-5 bg-[#09090f]/70 border border-white/[0.08] hover:border-red-500/40 backdrop-blur-xl shadow-[0_15px_35px_rgba(0,0,0,0.6)] space-y-4 transition-all">
                <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-red-500/20 border border-red-500/30 flex items-center justify-center text-[#ff073a]">
                      <Compass className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-white flex items-center gap-2">
                        <span>1. Portal Institucional (Site)</span>
                        <span className="text-[10px] px-2 py-0.2 rounded-full bg-red-950/60 text-red-300 font-mono border border-red-500/30">
                          /
                        </span>
                      </h4>
                      <p className="text-[11px] text-zinc-400">Página inicial, vitrine tecnológica e ecossistema de automação</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleAction('scroll', 'home')}
                    className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.1] text-zinc-300 hover:text-white transition-all cursor-pointer"
                    title="Rolar ao Início"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Submódulo: Páginas e Acesso Rápido */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                  {[
                    { id: 'shop', label: 'Shop', desc: '800+ Flows & Make', icon: ShoppingBag, color: 'text-amber-400', action: 'route' as const, target: '/shop' },
                    { id: 'sobre', label: 'Sobre', desc: 'Bio & Formação', icon: User, color: 'text-purple-400', action: 'scroll' as const, target: 'sobre' },
                    { id: 'contato', label: 'Contato', desc: 'WhatsApp & Email', icon: Mail, color: 'text-emerald-400', action: 'scroll' as const, target: 'contato' },
                  ].map((p) => {
                    const Icon = p.icon;
                    if (!matchesSearch(p.label) && !matchesSearch(p.desc)) return null;
                    return (
                      <button
                        key={p.id}
                        onClick={() => handleAction(p.action, p.target)}
                        className="p-2.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.05] text-left transition-all cursor-pointer group/sec"
                      >
                        <Icon className={`w-3.5 h-3.5 ${p.color} mb-1`} />
                        <span className="block text-xs font-bold text-white group-hover/sec:text-red-300 transition-colors">
                          {p.label}
                        </span>
                        <span className="text-[10px] text-zinc-500 font-mono block truncate">
                          {p.desc}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ---------------------------------------------------------------------
                PILAR 2: FREE RESOURCES / KNOWLEDGE VAULT
                --------------------------------------------------------------------- */}
            {(activeFilter === 'all' || activeFilter === 'vault') && (
              <div className="rounded-2xl p-5 bg-[#09090f]/70 border border-white/[0.08] hover:border-amber-500/40 backdrop-blur-xl shadow-[0_15px_35px_rgba(0,0,0,0.6)] space-y-4 transition-all">
                <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                      <Database className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-white flex items-center gap-2">
                        <span>2. Free Resources (Knowledge Vault)</span>
                        <span className="text-[10px] px-2 py-0.2 rounded-full bg-amber-500/20 text-amber-300 font-mono border border-amber-500/30">
                          /biblioteca
                        </span>
                      </h4>
                      <p className="text-[11px] text-zinc-400">Central de Conhecimento e Acervo Intelectual Aberto</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleAction('route', '/biblioteca')}
                    className="p-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 transition-all cursor-pointer flex items-center gap-1 text-xs font-mono"
                    title="Acessar Free Resources"
                  >
                    <span>Abrir</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* 11 Módulos em Tag Cloud Minimalista */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-zinc-200 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>11 Categorias Catalogadas</span>
                    </span>
                    <span className="text-[10px] font-mono text-amber-400/90 font-bold px-2 py-0.5 rounded bg-amber-950/40 border border-amber-500/30">
                      100% GRATUITO
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {vaultCategories.map((vCat, idx) => {
                      if (!matchesSearch(vCat)) return null;
                      return (
                        <button
                          key={idx}
                          onClick={() => handleAction('route', '/biblioteca')}
                          className="px-2.5 py-1 rounded-lg bg-white/[0.02] hover:bg-amber-500/20 border border-white/[0.06] hover:border-amber-500/30 text-[11px] font-mono text-zinc-300 hover:text-white transition-all cursor-pointer flex items-center gap-1.5"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                          <span>{vCat}</span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="pt-2 flex items-center justify-between text-[11px] text-zinc-500 font-mono border-t border-white/[0.06]">
                    <span>Livros, PDFs, prompts e códigos</span>
                    <button
                      onClick={() => handleAction('route', '/biblioteca')}
                      className="text-amber-400 hover:text-amber-300 flex items-center gap-1 font-bold cursor-pointer"
                    >
                      <span>Acessar Acervo</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ---------------------------------------------------------------------
                PILAR 3: COMUNIDADE PRIVADA (A.I VISUALS)
                --------------------------------------------------------------------- */}
            {(activeFilter === 'all' || activeFilter === 'comunidade') && (
              <div className="rounded-2xl p-5 bg-[#09090f]/70 border border-white/[0.08] hover:border-red-500/40 backdrop-blur-xl shadow-[0_15px_35px_rgba(0,0,0,0.6)] space-y-4 transition-all">
                <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-red-600/20 border border-red-500/30 flex items-center justify-center text-[#ff073a]">
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-white flex items-center gap-2">
                        <span>3. Comunidade Privada (A.I Visuals)</span>
                        <span className="text-[10px] px-2 py-0.2 rounded-full bg-red-500/20 text-red-300 font-mono border border-red-500/30">
                          /comunidade
                        </span>
                      </h4>
                      <p className="text-[11px] text-zinc-400">Área de membros restrita & biblioteca multimídia cinematográfica</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleAction('route', '/comunidade')}
                    className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-300 transition-all cursor-pointer flex items-center gap-1 text-xs font-mono"
                    title="Acessar Comunidade"
                  >
                    <span>Abrir</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {[
                    { title: 'Feed & Aulas', desc: 'Vídeos e postagens em tempo real' },
                    { title: 'AI Art Pro', desc: 'Prompts e composições estéticas' },
                    { title: 'AI Portraits Pro', desc: 'Retratos e modelos hiper-realistas' },
                    { title: 'AI Effects & VIP', desc: 'Shaders e checkout Mercado Pago' },
                  ].map((item, i) => (
                    <button
                      key={i}
                      onClick={() => handleAction('route', '/comunidade')}
                      className="p-3 rounded-xl bg-white/[0.02] hover:bg-red-950/30 border border-white/[0.05] hover:border-red-500/30 text-left transition-all cursor-pointer"
                    >
                      <span className="text-xs font-bold text-white block">{item.title}</span>
                      <span className="text-[10px] text-zinc-500 font-mono block mt-0.5 truncate">{item.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ---------------------------------------------------------------------
                PILAR 4: SAAS & FERRAMENTAS AVANÇADAS (EXCLUSIVO PARA ADMIN)
                --------------------------------------------------------------------- */}
            {isUserAdmin && (activeFilter === 'all' || activeFilter === 'site') && (
              <div className="rounded-2xl p-5 bg-[#09090f]/70 border border-white/[0.08] hover:border-purple-500/40 backdrop-blur-xl shadow-[0_15px_35px_rgba(0,0,0,0.6)] space-y-4 transition-all">
                <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
                      <Zap className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-white flex items-center gap-2">
                        <span>4. Ferramentas & Administração</span>
                        <span className="text-[10px] px-2 py-0.2 rounded-full bg-purple-500/20 text-purple-300 font-mono border border-purple-500/30">
                          SAAS & MASTER
                        </span>
                      </h4>
                      <p className="text-[11px] text-zinc-400">Controle administrativo e governança soberana</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-2.5">
                  <button
                    onClick={() => handleAction('route', '/admin')}
                    className="p-3.5 rounded-xl bg-white/[0.02] hover:bg-red-950/30 border border-white/[0.06] hover:border-red-500/30 text-left transition-all cursor-pointer group/btn"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white group-hover/btn:text-red-300 flex items-center gap-1.5">
                        <Shield className="w-3.5 h-3.5 text-red-400" />
                        <span>Painel Master Admin</span>
                      </span>
                      <ExternalLink className="w-3.5 h-3.5 text-red-400" />
                    </div>
                    <span className="text-[10px] text-zinc-500 font-mono block mt-1">
                      /admin • Gestão unificada, leads, mídias e telemetria
                    </span>
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* RODAPÉ DO MODAL (MINIMALISTA) */}
          <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-zinc-500 font-mono">
            <span>Clique em qualquer cartão ou nó para navegar</span>
            <span>ESC para fechar</span>
          </div>

        </div>
      </div>
    </div>
  );
}

export default UniversalSitemapModal;
