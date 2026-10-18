'use client';

import React, { useEffect } from 'react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function RootError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('🛡️ [Root Error Boundary Capturado]:', {
      message: error?.message,
      digest: error?.digest,
      stack: error?.stack,
    });
  }, [error]);

  return (
    <div className="min-h-screen bg-[#070002] text-white flex items-center justify-center p-6 selection:bg-red-500/30 selection:text-white relative overflow-hidden">
      <div className="absolute w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[120px] pointer-events-none -top-20 -left-20" />
      <div className="absolute w-[400px] h-[400px] bg-amber-500/10 rounded-full blur-[100px] pointer-events-none -bottom-20 -right-20" />

      <div className="relative z-10 max-w-lg w-full bg-[#120005]/80 backdrop-blur-xl border border-red-500/20 rounded-3xl p-8 sm:p-10 shadow-2xl shadow-red-950/50 text-center">
        <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-red-500/20 to-amber-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
          <svg className="w-8 h-8 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>

        <span className="inline-block px-3 py-1 mb-3 text-xs font-mono font-semibold tracking-widest uppercase bg-red-500/10 text-red-400 border border-red-500/20 rounded-full">
          Resiliência do Sistema Ativada
        </span>

        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-3">
          Oscilação Temporária Detectada
        </h1>

        <p className="text-sm text-zinc-400 leading-relaxed mb-6">
          O servidor encontrou uma interrupção inesperada ao processar este módulo. O sistema de proteção soberana isolou a falha para preservar sua sessão.
        </p>

        {error?.digest && (
          <div className="mb-6 p-3 rounded-xl bg-black/40 border border-white/5 font-mono text-[11px] text-zinc-400 select-all text-left">
            <span className="text-zinc-500 block mb-1">Identificador da Ocorrência:</span>
            <code className="text-red-400 font-semibold">{error.digest}</code>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-red-600 to-red-500 text-white font-semibold text-sm hover:from-red-500 hover:to-red-400 transition-all shadow-lg shadow-red-600/25 active:scale-95 cursor-pointer"
          >
            Tentar Novamente
          </button>
          <a
            href="/"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-zinc-300 font-medium text-sm hover:bg-white/10 hover:text-white transition-all text-center active:scale-95"
          >
            Retornar ao Início
          </a>
        </div>
      </div>
    </div>
  );
}
