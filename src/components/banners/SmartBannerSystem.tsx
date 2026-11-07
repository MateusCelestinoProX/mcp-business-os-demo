'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  X,
  Sparkles,
  ArrowRight,
  Flame,
  Tag,
  Check,
  Copy,
  ExternalLink,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { SmartBanner, BannerType } from '@/types/banners';

export function SmartBannerSystem() {
  const pathname = usePathname();
  const router = useRouter();

  const [activeBanners, setActiveBanners] = useState<SmartBanner[]>([]);
  const [globalEnabled, setGlobalEnabled] = useState(true);
  const [currentModalBanner, setCurrentModalBanner] = useState<SmartBanner | null>(null);
  const [copiedCoupon, setCopiedCoupon] = useState(false);

  // Evita re-disparar repetidamente em memória na mesma navegação
  const shownBannerIdsRef = useRef<Set<string>>(new Set());
  const hasTriggeredExitRef = useRef(false);

  // Não exibe nem monitora nas telas de administração para não atrapalhar o fluxo
  const isAdminArea = pathname?.startsWith('/admin');

  // Carrega banners da API pública
  useEffect(() => {
    if (isAdminArea) return;

    let isMounted = true;
    const controller = new AbortController();

    async function loadBanners() {
      try {
        const res = await fetch('/api/banners', {
          signal: controller.signal,
          headers: { Accept: 'application/json' },
        });
        if (!res.ok) return;

        const data = await res.json();
        if (isMounted && data.success && data.data) {
          setGlobalEnabled(data.data.globalEnabled ?? true);
          setActiveBanners(data.data.banners || []);
        }
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.debug('[SmartBannerSystem] Fetch info:', err.message);
        }
      }
    }

    loadBanners();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [isAdminArea]);

  // Função utilitária para testar correspondência de rotas
  const matchesRoute = useCallback(
    (targetPages: string[] = []): boolean => {
      if (!pathname) return false;
      if (targetPages.includes('*')) return true;

      return targetPages.some((pattern) => {
        const cleanPattern = pattern.trim();
        if (cleanPattern === pathname) return true;
        if (cleanPattern.endsWith('/*') && pathname.startsWith(cleanPattern.slice(0, -2))) {
          return true;
        }
        return false;
      });
    },
    [pathname]
  );

  // Verifica se o banner já foi visualizado de acordo com a sua regra de frequência
  const canShowBanner = useCallback((banner: SmartBanner): boolean => {
    if (!banner.isActive) return false;
    if (shownBannerIdsRef.current.has(banner.id)) return false;

    if (banner.frequency === 'always') return true;

    if (typeof window === 'undefined') return false;

    if (banner.frequency === 'once_per_session') {
      const sessionKey = `mcp_banner_session_${banner.id}`;
      return sessionStorage.getItem(sessionKey) === null;
    }

    if (banner.frequency === 'once_per_user') {
      const localKey = `mcp_banner_dismissed_${banner.id}`;
      return localStorage.getItem(localKey) === null;
    }

    return true;
  }, []);

  // Marca banner como visualizado/descartado
  const markBannerAsShown = useCallback((banner: SmartBanner) => {
    shownBannerIdsRef.current.add(banner.id);

    if (typeof window !== 'undefined') {
      const sessionKey = `mcp_banner_session_${banner.id}`;
      sessionStorage.setItem(sessionKey, 'true');

      if (banner.frequency === 'once_per_user') {
        const localKey = `mcp_banner_dismissed_${banner.id}`;
        localStorage.setItem(localKey, 'true');
      }
    }
  }, []);

  // Fecha o banner atual
  const handleClose = useCallback(() => {
    if (currentModalBanner) {
      markBannerAsShown(currentModalBanner);
    }
    setCurrentModalBanner(null);
    setCopiedCoupon(false);
  }, [currentModalBanner, markBannerAsShown]);

  // Executa a ação do CTA principal
  const handleCtaClick = useCallback(() => {
    if (!currentModalBanner) return;

    markBannerAsShown(currentModalBanner);
    const url = currentModalBanner.ctaUrl || '/';
    setCurrentModalBanner(null);

    if (url.startsWith('http://') || url.startsWith('https://')) {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      router.push(url);
    }
  }, [currentModalBanner, markBannerAsShown, router]);

  // Copia cupom de desconto
  const handleCopyCoupon = (code: string) => {
    if (!code) return;
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(code);
      setCopiedCoupon(true);
      setTimeout(() => setCopiedCoupon(false), 2500);
    }
  };

  // Trava scroll da página quando modal estiver ativo e gerencia ESC
  useEffect(() => {
    if (currentModalBanner) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          handleClose();
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = originalOverflow;
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [currentModalBanner, handleClose]);

  // =========================================================================
  // GATILHO 1: ONBOARDING BANNER (Quando abre a página com delay configurável)
  // =========================================================================
  useEffect(() => {
    if (isAdminArea || !globalEnabled || currentModalBanner) return;

    const onboardingCandidate = activeBanners.find(
      (b) => b.type === 'onboarding' && matchesRoute(b.targetPages) && canShowBanner(b)
    );

    if (!onboardingCandidate) return;

    const delayMs = Math.max(0, (onboardingCandidate.delaySeconds || 0) * 1000);

    const timer = setTimeout(() => {
      setCurrentModalBanner(onboardingCandidate);
    }, delayMs);

    return () => clearTimeout(timer);
  }, [pathname, activeBanners, globalEnabled, currentModalBanner, matchesRoute, canShowBanner, isAdminArea]);

  // =========================================================================
  // GATILHO 2: EXIT INTENT (Quando o usuário move o mouse para sair do site)
  // =========================================================================
  useEffect(() => {
    if (isAdminArea || !globalEnabled || hasTriggeredExitRef.current) return;

    const exitCandidate = activeBanners.find(
      (b) => b.type === 'exit_intent' && matchesRoute(b.targetPages) && canShowBanner(b)
    );

    if (!exitCandidate) return;

    // Monitoramento Desktop (Mouse saindo pelo topo da janela)
    const handleMouseLeave = (e: MouseEvent) => {
      // clientY <= 20 indica que o cursor subiu em direção à barra de abas / botão fechar
      if (e.clientY <= 20 && !hasTriggeredExitRef.current) {
        hasTriggeredExitRef.current = true;
        setCurrentModalBanner(exitCandidate);
      }
    };

    // Monitoramento Mobile (detecta tentativa de botão Voltar via popstate)
    const handlePopState = () => {
      if (!hasTriggeredExitRef.current) {
        hasTriggeredExitRef.current = true;
        setCurrentModalBanner(exitCandidate);
      }
    };

    // Monitoramento Mobile (Visibility change: quando tenta sair ou trocar de aba após 5s)
    let pageStayTimeout = setTimeout(() => {
      const handleVisibilityChange = () => {
        if (document.visibilityState === 'hidden' && !hasTriggeredExitRef.current) {
          // Prepara para exibir quando o usuário retornar o foco
          hasTriggeredExitRef.current = true;
          setCurrentModalBanner(exitCandidate);
        }
      };
      document.addEventListener('visibilitychange', handleVisibilityChange);
    }, 5000);

    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('popstate', handlePopState);

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('popstate', handlePopState);
      clearTimeout(pageStayTimeout);
    };
  }, [pathname, activeBanners, globalEnabled, matchesRoute, canShowBanner, isAdminArea]);

  if (isAdminArea || !currentModalBanner) {
    return null;
  }

  // Definições de Estilos por Tema
  const isRed = currentModalBanner.theme === 'cyber_red' || !currentModalBanner.theme;
  const isGold = currentModalBanner.theme === 'gold_vip';
  const isEmerald = currentModalBanner.theme === 'emerald_stealth';

  const themeAccentColor = isGold ? '#eab308' : isEmerald ? '#10b981' : '#ff073a';
  const themeBorderClass = isGold
    ? 'border-yellow-500/30 shadow-[0_0_80px_rgba(234,179,8,0.25)]'
    : isEmerald
    ? 'border-emerald-500/30 shadow-[0_0_80px_rgba(16,185,129,0.25)]'
    : 'border-red-500/35 shadow-[0_0_90px_rgba(255,7,58,0.28)]';

  const themeBadgeBg = isGold
    ? 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30'
    : isEmerald
    ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
    : 'bg-red-500/15 text-red-400 border-red-500/30';

  const themeCtaGradient = isGold
    ? 'bg-gradient-to-r from-yellow-500 via-amber-600 to-yellow-600 text-black hover:from-yellow-400 hover:to-amber-500 shadow-[0_0_30px_rgba(234,179,8,0.4)]'
    : isEmerald
    ? 'bg-gradient-to-r from-emerald-500 via-teal-600 to-emerald-600 text-white hover:from-emerald-400 hover:to-teal-500 shadow-[0_0_30px_rgba(16,185,129,0.4)]'
    : 'bg-gradient-to-r from-red-600 via-[#ff073a] to-red-700 text-white hover:from-red-500 hover:to-red-600 shadow-[0_0_35px_rgba(255,7,58,0.5)]';

  return (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-2xl animate-in fade-in duration-300 selection:bg-red-600 selection:text-white"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="smart-banner-title"
    >
      {/* Container Central com Borda Glassmorphism & Brilho Neon */}
      <div
        className={`relative w-full max-w-xl md:max-w-2xl bg-[#090305]/95 rounded-3xl border ${themeBorderClass} overflow-hidden p-6 sm:p-8 backdrop-blur-3xl animate-in zoom-in-95 duration-200`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glows de Fundo Decorativos */}
        <div className="pointer-events-none absolute -top-32 -right-32 w-64 h-64 rounded-full blur-3xl opacity-30"
          style={{ backgroundColor: themeAccentColor }}
        />
        <div className="pointer-events-none absolute -bottom-32 -left-32 w-64 h-64 rounded-full blur-3xl opacity-20"
          style={{ backgroundColor: themeAccentColor }}
        />

        {/* Linha de fechar rápida superior direita */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-all border border-white/10 focus:outline-none focus:ring-2 focus:ring-red-500"
          title="Fechar (Esc)"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header do Banner: Badges & Tags */}
        <div className="flex flex-wrap items-center gap-2 mb-3 pr-10">
          {currentModalBanner.badge && (
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold tracking-wider uppercase border ${themeBadgeBg}`}
            >
              {currentModalBanner.type === 'exit_intent' ? (
                <Flame className="w-3 h-3 animate-pulse" />
              ) : (
                <Sparkles className="w-3 h-3" />
              )}
              <span>{currentModalBanner.badge}</span>
            </span>
          )}

          <span className="px-2 py-0.5 rounded-md bg-white/5 text-neutral-400 border border-white/10 text-[10px] font-mono uppercase">
            {currentModalBanner.type === 'exit_intent' ? 'Exit-Intent Inteligente' : 'Tour & Boas-Vindas'}
          </span>
        </div>

        {/* Subtítulo / Tagline */}
        {currentModalBanner.subtitle && (
          <p className="text-xs sm:text-sm font-mono uppercase tracking-wider text-red-400/90 font-bold mb-1.5 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
            <span>{currentModalBanner.subtitle}</span>
          </p>
        )}

        {/* Título Principal Monumental */}
        <h2
          id="smart-banner-title"
          className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight leading-tight mb-3"
        >
          {currentModalBanner.title}
        </h2>

        {/* Conteúdo / Descrição Persuasiva */}
        <div className="text-sm sm:text-base text-neutral-300 leading-relaxed font-sans mb-6 bg-white/[0.02] p-3.5 sm:p-4 rounded-2xl border border-white/5">
          {currentModalBanner.content}
        </div>

        {/* Seção Opcional de Cupom de Desconto */}
        {currentModalBanner.discountCode && (
          <div className="mb-6 p-3 sm:p-3.5 rounded-2xl bg-black/60 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 text-xs font-mono text-neutral-300 w-full sm:w-auto">
              <Tag className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span>Use o cupom na finalização:</span>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <code className="px-3 py-1 rounded-lg bg-red-950/60 border border-red-500/40 text-red-300 font-mono font-bold text-xs tracking-wider">
                {currentModalBanner.discountCode}
              </code>
              <button
                type="button"
                onClick={() => handleCopyCoupon(currentModalBanner.discountCode!)}
                className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/15 text-neutral-200 text-xs font-mono font-semibold flex items-center gap-1.5 transition-colors border border-white/10"
              >
                {copiedCoupon ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Ações: Botão CTA Principal & Botão Secundário */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 border-t border-white/10">
          <button
            type="button"
            onClick={handleCtaClick}
            className={`w-full sm:flex-1 py-3.5 px-6 rounded-2xl font-bold text-sm tracking-wide transition-all transform active:scale-95 flex items-center justify-center gap-2 ${themeCtaGradient}`}
          >
            <span>{currentModalBanner.ctaText}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleClose}
            className="w-full sm:w-auto py-3 px-5 rounded-2xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-neutral-200 text-xs font-semibold transition-colors border border-white/5"
          >
            {currentModalBanner.secondaryCtaText || 'Fechar e Continuar'}
          </button>
        </div>

        {/* Rodapé de Confiança / Segurança */}
        <div className="mt-4 pt-3 flex items-center justify-between text-[10px] font-mono text-neutral-400 border-t border-white/5">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span>MCP Sovereign Security Core</span>
          </span>
          <span className="flex items-center gap-1">
            <Zap className="w-3 h-3 text-red-500" />
            <span>Sistema Inteligente 2026</span>
          </span>
        </div>
      </div>
    </div>
  );
}
