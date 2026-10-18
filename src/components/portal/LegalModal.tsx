'use client';

import React, { useEffect } from 'react';
import { X, Shield } from 'lucide-react';

export interface LegalModalProps {
  title: string;
  contentHtml?: string | null;
  onClose: () => void;
}

export function LegalModal({ title, contentHtml, onClose }: LegalModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [onClose]);

  if (!contentHtml) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-6 overflow-y-auto bg-black/90 backdrop-blur-3xl animate-in fade-in duration-200">
      <div className="fixed inset-0 -z-10 hidden sm:block cursor-pointer" onClick={onClose} />
      
      <div className="relative w-full h-full sm:h-auto sm:max-w-3xl sm:max-h-[88vh] overflow-y-auto rounded-none sm:rounded-3xl bg-[#060606]/95 border-0 sm:border sm:border-white/10 shadow-[0_25px_80px_rgba(0,0,0,0.95)] flex flex-col p-4 sm:p-8 safe-pt safe-pb">
        
        {/* Top Bar */}
        <div className="flex items-center justify-between pb-4 sm:pb-5 border-b border-white/10 mb-5 sm:mb-6 sticky top-0 bg-[#060606]/95 backdrop-blur-xl z-10 pt-2">
          <div className="flex items-center gap-2.5">
            <Shield className="w-5 h-5 text-[#ff073a] shrink-0" />
            <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="w-11 h-11 rounded-xl bg-white/5 hover:bg-[#ff073a] hover:text-white border border-white/10 flex items-center justify-center text-zinc-300 transition-all cursor-pointer touch-manipulation active:scale-95"
            aria-label="Fechar termos"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Legal Text */}
        <div 
          className="article-prose text-xs sm:text-sm text-zinc-300 space-y-4 flex-1 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />

        {/* Bottom Bar */}
        <div className="mt-6 sm:mt-8 pt-4 sm:pt-5 border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="w-full sm:w-auto min-h-[46px] px-6 py-2.5 rounded-xl text-xs font-mono font-semibold text-white bg-white/10 hover:bg-white/20 active:scale-95 transition-all cursor-pointer touch-manipulation flex items-center justify-center"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}

export default LegalModal;
