'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Crown,
  ShieldCheck,
  ArrowRight,
  RefreshCw,
  ShoppingBag,
  Users,
  Layers,
  ChevronUp,
  ChevronDown,
  ExternalLink,
  Lock,
} from 'lucide-react';

interface DemoExperienceWrapperProps {
  children: React.ReactNode;
}

export function DemoExperienceWrapper({ children }: DemoExperienceWrapperProps) {
  const [introState, setIntroState] = useState<'showing' | 'transitioning' | 'completed'>('showing');
  const [progress, setProgress] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isWidgetExpanded, setIsWidgetExpanded] = useState(false);

  const steps = [
    'Carregando kernel do Business OS e shaders WebGL...',
    'Aplicando ambiente seguro e dados mock de demonstração...',
    'Concedendo credenciais de Super Administrador (Admin Demo)...',
    'Todos os subsistemas operacionais. Revelando interface...',
  ];

  useEffect(() => {
    // Verifica se já viu a intro nesta sessão do navegador
    const alreadySeen = typeof window !== 'undefined' ? sessionStorage.getItem('mcp_demo_intro_seen') : null;
    
    // Se for rota direta de admin, login ou midias, acelera ou respeita navegação
    const isDirectSubroute = typeof window !== 'undefined' && 
      (window.location.pathname.startsWith('/admin') || window.location.pathname.includes('/login'));

    if (alreadySeen && isDirectSubroute) {
      setIntroState('completed');
      return;
    }

    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 2.5;
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(interval);
        setProgress(100);
        setCurrentStepIndex(steps.length - 1);

        // Dispara transição suave após atingir 100%
        setTimeout(() => {
          triggerLayoutReveal();
        }, 350);
      } else {
        setProgress(Math.floor(currentProgress));
        if (currentProgress > 75) setCurrentStepIndex(3);
        else if (currentProgress > 45) setCurrentStepIndex(2);
        else if (currentProgress > 15) setCurrentStepIndex(1);
      }
    }, 45);

    return () => clearInterval(interval);
  }, []);

  const triggerLayoutReveal = () => {
    setIntroState('transitioning');
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('mcp_demo_intro_seen', 'true');
    }
    setTimeout(() => {
      setIntroState('completed');
    }, 750);
  };

  const handleReplayIntro = () => {
    setProgress(0);
    setCurrentStepIndex(0);
    setIntroState('showing');
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 3.5;
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(interval);
        setProgress(100);
        setCurrentStepIndex(steps.length - 1);
        setTimeout(() => {
          triggerLayoutReveal();
        }, 300);
      } else {
        setProgress(Math.floor(currentProgress));
        if (currentProgress > 75) setCurrentStepIndex(3);
        else if (currentProgress > 45) setCurrentStepIndex(2);
        else if (currentProgress > 15) setCurrentStepIndex(1);
      }
    }, 40);
  };

  return (
    <>
      {/* TELA BASE E APRESENTAÇÃO INICIAL CINEMATOGRÁFICA (DEMO INTRO SHOWCASE) */}
      {introState !== 'completed' && (
        <div
          className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#030305] text-white px-4 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            introState === 'transitioning'
              ? 'opacity-0 scale-105 pointer-events-none blur-md'
              : 'opacity-100 scale-100'
          }`}
        >
          {/* Luzes e Efeitos de Fundo */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/15 rounded-full blur-[140px] pointer-events-none" />
          <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />

          {/* Grid de Linhas Sutis */}
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-40" />

          <div className="relative z-10 max-w-lg w-full text-center space-y-6">
            {/* Badge de Demonstração */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-950/70 border border-red-500/40 text-[11px] font-mono font-bold text-red-300 shadow-[0_0_20px_rgba(255,7,58,0.25)] animate-pulse">
              <span className="w-2 h-2 rounded-full bg-[#ff073a] shadow-[0_0_8px_#ff073a]" />
              <span>SOFTWARE DEMO EXPERIENCE // v2.5</span>
            </div>

            {/* Logotipo com Brilho e Efeito Espelho */}
            <div className="relative w-20 h-20 mx-auto">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-red-600 via-amber-500 to-red-600 blur-lg opacity-60 animate-pulse" />
              <div className="relative w-full h-full rounded-2xl bg-[#090305] border border-white/20 p-2.5 flex items-center justify-center shadow-2xl overflow-hidden">
                <img
                  src="/assets/site_icon.webp"
                  alt="MCP Business OS"
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
            </div>

            {/* Tipografia Principal */}
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white uppercase">
                MCP BUSINESS <span className="text-[#ff073a]">OS</span>
              </h1>
              <p className="text-xs sm:text-sm text-neutral-400 font-mono tracking-wide max-w-sm mx-auto">
                Plataforma Unificada Soberana • Instância Demo de Alta Performance
              </p>
            </div>

            {/* Painel Procedural de Carregamento Suave */}
            <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-2xl p-5 space-y-3.5 shadow-2xl text-left">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-neutral-300 flex items-center gap-1.5 truncate">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span className="truncate">{steps[currentStepIndex]}</span>
                </span>
                <span className="text-red-400 font-bold ml-2 shrink-0">{progress}%</span>
              </div>

              {/* Barra de Progresso Fluida */}
              <div className="w-full h-2 bg-black/60 rounded-full overflow-hidden border border-white/10 p-[1px]">
                <div
                  className="h-full bg-gradient-to-r from-red-600 via-red-500 to-amber-400 rounded-full transition-all duration-100 ease-out shadow-[0_0_12px_rgba(255,7,58,0.8)]"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="flex items-center justify-between pt-1 text-[10px] font-mono text-neutral-400 border-t border-white/5">
                <span className="flex items-center gap-1">
                  <Crown className="w-3 h-3 text-amber-400" />
                  Status: Super Admin Habilitado
                </span>
                <span className="text-emerald-400">Pronto para Interação</span>
              </div>
            </div>

            {/* Ações Imediatas */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={triggerLayoutReveal}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-mono text-xs font-bold shadow-[0_0_25px_rgba(255,7,58,0.4)] flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
              >
                <span>Explorar Software Demo</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <Link
                href="/admin"
                onClick={triggerLayoutReveal}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white border border-white/10 font-mono text-xs font-semibold flex items-center justify-center gap-2 active:scale-95 transition-all"
              >
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                <span>Painel Admin Direto</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ANIMAÇÃO SUAVE DE ENTRADA DO LAYOUT COMPLETO DO SOFTWARE */}
      <div
        className={`w-full min-h-screen transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          introState === 'showing'
            ? 'opacity-0 scale-[0.98] translate-y-4 blur-[2px]'
            : introState === 'transitioning'
            ? 'opacity-80 scale-[0.99] translate-y-1 blur-[1px]'
            : 'opacity-100 scale-100 translate-y-0 blur-0'
        }`}
      >
        {children}
      </div>

      {/* FLOATING DEMO CONTROLLER (Pill Discreto e Sofisticado no Canto da Tela) */}
      <aside
        aria-label="Controles da Demonstração"
        className="fixed bottom-4 right-4 z-[9990] font-mono text-xs select-none"
      >
        <div className="bg-[#0b0507]/90 backdrop-blur-2xl border border-red-500/30 rounded-2xl shadow-[0_10px_35px_rgba(0,0,0,0.8),0_0_20px_rgba(255,7,58,0.2)] overflow-hidden transition-all duration-300">
          {/* Header do Widget */}
          <div className="p-2.5 sm:p-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="font-bold text-white text-[11px] tracking-wide">
                MODO DEMO <span className="text-[#ff073a]">ADMIN</span>
              </span>
            </div>

            <button
              type="button"
              onClick={() => setIsWidgetExpanded(!isWidgetExpanded)}
              className="text-neutral-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10 cursor-pointer"
              title={isWidgetExpanded ? 'Recolher opções' : 'Expandir atalhos rápidos'}
            >
              {isWidgetExpanded ? (
                <ChevronDown className="w-3.5 h-3.5" />
              ) : (
                <ChevronUp className="w-3.5 h-3.5" />
              )}
            </button>
          </div>

          {/* Atalhos Rápidos da Demo */}
          {isWidgetExpanded && (
            <div className="p-3 pt-0 border-t border-white/10 space-y-1.5 animate-fadeIn">
              <Link
                href="/admin"
                className="flex items-center gap-2 p-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition-all text-[11px]"
              >
                <Crown className="w-3.5 h-3.5 shrink-0" />
                <span>Painel Admin (Acesso Total)</span>
              </Link>

              <Link
                href="/shop"
                className="flex items-center gap-2 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white border border-white/10 transition-all text-[11px]"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-[#ff073a] shrink-0" />
                <span>Loja & Serviços Demo</span>
              </Link>

              <Link
                href="/comunidade"
                className="flex items-center gap-2 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white border border-white/10 transition-all text-[11px]"
              >
                <Layers className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                <span>Infoprodutos Demo</span>
              </Link>

              <Link
                href="/comunidade/login"
                className="flex items-center gap-2 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white border border-white/10 transition-all text-[11px]"
              >
                <Lock className="w-3.5 h-3.5 text-red-400 shrink-0" />
                <span>Tela de Login Preenchida</span>
              </Link>

              <button
                type="button"
                onClick={handleReplayIntro}
                className="w-full flex items-center justify-center gap-1.5 p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/5 text-[10px] transition-all cursor-pointer mt-1"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Rever Animação de Entrada</span>
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}