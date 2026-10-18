'use client';

import React, { useEffect } from 'react';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error('🛡️ [Global Error Boundary - Layout Raiz Capturado]:', {
      message: error?.message,
      digest: error?.digest,
      stack: error?.stack,
    });
  }, [error]);

  return (
    <html lang="pt-BR" className="dark">
      <body className="bg-[#070002] text-white min-h-screen flex items-center justify-center p-6 selection:bg-red-500/30 selection:text-white font-sans antialiased m-0">
        <div className="relative z-10 max-w-lg w-full bg-[#120005] border border-red-500/30 rounded-3xl p-8 sm:p-10 shadow-2xl shadow-red-950/80 text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-500">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>

          <span className="inline-block px-3 py-1 mb-3 text-xs font-mono font-semibold tracking-widest uppercase bg-red-500/10 text-red-400 border border-red-500/20 rounded-full">
            Recuperação Global Soberana
          </span>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-3">
            Reinicialização de Camada Necessária
          </h1>

          <p className="text-sm text-zinc-400 leading-relaxed mb-6">
            Ocorreu uma falha no carregamento dos elementos estruturais da página. A infraestrutura de contingência manteve sua conexão segura.
          </p>

          {error?.digest && (
            <div className="mb-6 p-3 rounded-xl bg-black/60 border border-white/5 font-mono text-[11px] text-zinc-400 select-all text-left">
              <span className="text-zinc-500 block mb-1">Código de Diagnóstico:</span>
              <code className="text-red-400 font-semibold">{error.digest}</code>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => reset()}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-red-600 to-red-500 text-white font-semibold text-sm hover:from-red-500 hover:to-red-400 transition-all shadow-lg shadow-red-600/25 active:scale-95 cursor-pointer border-none"
            >
              Reiniciar Camada
            </button>
            <a
              href="/"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-zinc-300 font-medium text-sm hover:bg-white/10 hover:text-white transition-all text-center active:scale-95 no-underline flex items-center justify-center"
            >
              Recarregar Aplicação
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
