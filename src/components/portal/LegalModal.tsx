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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/90 backdrop-blur-3xl animate-in fade-in duration-200">
      <div className="fixed inset-0 -z-10" onClick={onClose} />
      
      <div className="relative w-full max-w-3xl max-h-[88vh] overflow-y-auto rounded-3xl bg-[#060606] border border-white/10 shadow-[0_25px_80px_rgba(0,0,0,0.95)] flex flex-col p-6 sm:p-8">
        
        {/* Top Bar */}
        <div className="flex items-center justify-between pb-5 border-b border-white/10 mb-6 sticky top-0 bg-[#060606]/95 backdrop-blur-xl z-10">
          <div className="flex items-center gap-2.5">
            <Shield className="w-5 h-5 text-[#ff073a]" />
            <h3 className="text-xl font-bold text-white tracking-tight">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white/5 hover:bg-[#ff073a] hover:text-white border border-white/10 flex items-center justify-center text-zinc-400 transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Legal Text */}
        <div 
          className="article-prose text-sm text-zinc-300 space-y-4"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />

        {/* Bottom Bar */}
        <div className="mt-8 pt-5 border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-mono font-semibold text-white bg-white/10 hover:bg-white/20 transition-all cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}

export default LegalModal;
