"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Cookie, Shield, Check, X } from "lucide-react";
import {
  getCookieConsent,
  setCookieConsent,
  CookieConsentType,
} from "@/lib/cookies";

export function CookieBanner() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentConsent, setCurrentConsent] = useState<CookieConsentType>(null);

  useEffect(() => {
    // Verifica o consentimento atual no cookie
    const consent = getCookieConsent();
    setCurrentConsent(consent);

    // Se o usuário ainda não escolheu, exibe o aviso
    if (!consent) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    // Permite reabrir o banner a qualquer momento via evento customizado
    const handleOpen = () => {
      setCurrentConsent(getCookieConsent());
      setIsOpen(true);
    };

    window.addEventListener("mcp_open_cookie_preferences", handleOpen);
    return () => {
      window.removeEventListener("mcp_open_cookie_preferences", handleOpen);
    };
  }, []);

  const handleAcceptAll = () => {
    setCookieConsent("accepted");
    setCurrentConsent("accepted");
    setIsOpen(false);
  };

  const handleEssentialOnly = () => {
    setCookieConsent("essential");
    setCurrentConsent("essential");
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <aside
      aria-label="Aviso de Cookies e Privacidade"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 sm:max-w-md z-50 animate-in fade-in slide-in-from-bottom-4 duration-300"
    >
      <div className="bg-[#140609]/95 border border-red-500/25 backdrop-blur-xl rounded-2xl p-5 shadow-[0_20px_50px_rgba(0,0,0,0.6)] text-neutral-200">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-red-950/60 border border-red-500/30 flex items-center justify-center text-red-400 shrink-0 mt-0.5">
            <Cookie className="w-4 h-4" />
          </div>

          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-white tracking-tight flex items-center gap-1.5">
                <span>Preferências de Cookies</span>
              </h2>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-neutral-400 hover:text-white p-1 -mr-1 rounded-lg transition-colors"
                aria-label="Fechar aviso"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-neutral-300 leading-relaxed">
              Utilizamos cookies essenciais e telemetria anônima com{" "}
              <strong className="text-white font-medium">Umami Analytics</strong>{" "}
              para compreender o tráfego sem rastrear dados pessoais entre sites,
              em total conformidade com a LGPD.
            </p>

            <div className="text-[11px] text-neutral-400 flex items-center gap-2 pt-1">
              <Link
                href="/privacidade"
                className="text-red-400 hover:text-red-300 underline underline-offset-2 transition-colors"
              >
                Política de Privacidade
              </Link>
              <span>•</span>
              <Link
                href="/termos"
                className="text-red-400 hover:text-red-300 underline underline-offset-2 transition-colors"
              >
                Termos de Uso
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-white/5 flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2">
          <button
            type="button"
            onClick={handleEssentialOnly}
            className="px-3.5 py-2 rounded-xl text-xs font-mono font-medium text-neutral-300 bg-white/5 hover:bg-white/10 hover:text-white border border-white/10 transition-colors text-center"
          >
            Apenas essenciais
          </button>
          <button
            type="button"
            onClick={handleAcceptAll}
            className="px-4 py-2 rounded-xl text-xs font-mono font-semibold text-white bg-red-600 hover:bg-red-500 shadow-[0_0_15px_rgba(255,7,58,0.35)] transition-all text-center flex items-center justify-center gap-1.5"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Aceitar todos</span>
          </button>
        </div>
      </div>
    </aside>
  );
}

export default CookieBanner;
