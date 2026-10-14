'use client';

import React, { useState } from 'react';
import { Download, Check, AlertCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface DownloadButtonProps {
  resourceId: string;
  filename: string;
  sizeFormatted?: string;
  variant?: 'primary' | 'glass' | 'compact';
  className?: string;
  onDownloaded?: (newCount: number) => void;
}

export function DownloadButton({
  resourceId,
  filename,
  sizeFormatted,
  variant = 'primary',
  className,
  onDownloaded,
}: DownloadButtonProps) {
  const [status, setStatus] = useState<'idle' | 'downloading' | 'success' | 'error'>('idle');

  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (status === 'downloading') return;

    setStatus('downloading');

    try {
      // 1. Telemetria via POST
      const res = await fetch('/api/library/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: resourceId }),
      });

      const data = await res.json().catch(() => ({}));
      if (data.downloadCount && onDownloaded) {
        onDownloaded(data.downloadCount);
      }

      // 2. Disparo de download seguro no navegador
      const downloadUrl = `/api/library/download?id=${encodeURIComponent(resourceId)}`;
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setStatus('success');
      setTimeout(() => setStatus('idle'), 3000);
    } catch (err) {
      console.error('Falha ao processar download:', err);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3500);
    }
  };

  if (variant === 'compact') {
    return (
      <button
        onClick={handleDownload}
        disabled={status === 'downloading'}
        title={`Baixar ${filename}`}
        className={cn(
          'relative inline-flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-300',
          'bg-white/[0.04] hover:bg-white/[0.1] border border-white/10 hover:border-red-500/40 text-neutral-300 hover:text-white',
          status === 'downloading' && 'cursor-wait border-amber-500/50 text-amber-400',
          status === 'success' && 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400',
          status === 'error' && 'border-red-500/50 bg-red-500/10 text-red-400',
          className
        )}
      >
        {status === 'downloading' && <Loader2 className="w-4 h-4 animate-spin text-amber-400" />}
        {status === 'success' && <Check className="w-4 h-4 text-emerald-400 animate-in zoom-in-50" />}
        {status === 'error' && <AlertCircle className="w-4 h-4 text-red-400 animate-in zoom-in-50" />}
        {status === 'idle' && <Download className="w-4 h-4 transition-transform group-hover:scale-110" />}
      </button>
    );
  }

  const isPrimary = variant === 'primary';

  return (
    <button
      onClick={handleDownload}
      disabled={status === 'downloading'}
      className={cn(
        'group relative inline-flex items-center justify-center gap-2.5 px-5 py-3 rounded-xl font-semibold text-sm transition-all duration-300 active:scale-98 select-none',
        isPrimary
          ? 'glass-button-fired text-white shadow-[0_0_25px_rgba(255,7,58,0.25)] hover:shadow-[0_0_35px_rgba(255,7,58,0.45)]'
          : 'bg-white/[0.04] hover:bg-white/[0.08] text-white border border-white/10 hover:border-white/20 backdrop-blur-md shadow-lg',
        status === 'downloading' && 'opacity-80 cursor-wait',
        status === 'success' && 'border-emerald-500/60 bg-emerald-500/15 text-emerald-300 shadow-[0_0_25px_rgba(16,185,129,0.25)]',
        status === 'error' && 'border-red-500/60 bg-red-500/15 text-red-300 shadow-[0_0_25px_rgba(255,7,58,0.25)]',
        className
      )}
    >
      {status === 'downloading' && (
        <>
          <Loader2 className="w-4 h-4 animate-spin text-white" />
          <span>Baixando Ativo...</span>
        </>
      )}

      {status === 'success' && (
        <>
          <Check className="w-4 h-4 text-emerald-400" />
          <span>Download Concluído</span>
        </>
      )}

      {status === 'error' && (
        <>
          <AlertCircle className="w-4 h-4 text-red-400" />
          <span>Erro no Download</span>
        </>
      )}

      {status === 'idle' && (
        <>
          <Download className="w-4 h-4 text-red-400 group-hover:translate-y-0.5 transition-transform" />
          <span>Baixar Ativo</span>
          {sizeFormatted && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-neutral-300 font-mono">
              {sizeFormatted}
            </span>
          )}
        </>
      )}
    </button>
  );
}
