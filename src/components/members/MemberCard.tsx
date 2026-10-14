'use client';

import React, { useState } from 'react';
import { 
  Copy, 
  Check, 
  Download, 
  Eye, 
  Sparkles, 
  Lock, 
  ShieldCheck, 
  Layers, 
  Share2,
  ExternalLink,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface MemberAsset {
  id: string;
  title: string;
  category: 'Celestial' | 'Digital Art' | 'Dreamcore' | 'Effects' | 'Food' | 'Gen-X Soft Club' | string;
  promptText: string;
  imageUrl: string;
  aspectRatio?: string;
  resolution?: string; // ex: '8K Master', '4K UHD', 'Raw 16-bit'
  accessTier?: 'free' | 'vip' | 'master';
  downloadsCount?: number;
  tags?: string[];
  dimensions?: string;
}

interface MemberCardProps {
  asset: MemberAsset;
  userTier?: 'free' | 'vip' | 'master';
  onInspect?: (asset: MemberAsset) => void;
  className?: string;
}

export function MemberCard({
  asset,
  userTier = 'vip',
  onInspect,
  className
}: MemberCardProps) {
  const [copied, setCopied] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const hasAccess = 
    userTier === 'master' || 
    (userTier === 'vip' && asset.accessTier !== 'master') ||
    asset.accessTier === 'free';

  const handleCopyPrompt = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(asset.promptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const openPreview = () => {
    if (onInspect) {
      onInspect(asset);
    } else {
      setIsModalOpen(true);
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Celestial':
        return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
      case 'Dreamcore':
        return 'text-purple-400 border-purple-500/30 bg-purple-500/10';
      case 'Digital Art':
        return 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10';
      case 'Effects':
        return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
      case 'Food':
        return 'text-rose-400 border-rose-500/30 bg-rose-500/10';
      case 'Gen-X Soft Club':
        return 'text-fuchsia-400 border-fuchsia-500/30 bg-fuchsia-500/10';
      default:
        return 'text-indigo-400 border-indigo-500/30 bg-indigo-500/10';
    }
  };

  return (
    <>
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={openPreview}
        className={cn(
          "group relative flex flex-col rounded-2xl overflow-hidden border border-white/10 bg-[#0d0e12]/80 backdrop-blur-xl transition-all duration-300 hover:border-white/25 hover:shadow-2xl hover:shadow-indigo-500/10 cursor-pointer",
          className
        )}
      >
        {/* Imagem & Overlay */}
        <div className="relative aspect-square w-full overflow-hidden bg-black/60">
          <img
            src={asset.imageUrl}
            alt={asset.title}
            loading="lazy"
            className={cn(
              "w-full h-full object-cover transition-transform duration-700 ease-out",
              isHovered ? "scale-105" : "scale-100"
            )}
          />

          {/* Gradiente escuro para legibilidade */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-transparent to-black/40 pointer-events-none" />

          {/* Badges superiores */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
            {/* Categoria Badge */}
            <span className={cn(
              "text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full border backdrop-blur-md",
              getCategoryColor(asset.category)
            )}>
              {asset.category}
            </span>

            {/* Access Tier Badge */}
            <div className="flex items-center gap-1.5">
              {asset.resolution && (
                <span className="text-[10px] font-mono text-white/80 bg-black/50 backdrop-blur-md px-2 py-0.5 rounded border border-white/10">
                  {asset.resolution}
                </span>
              )}
              {asset.accessTier === 'master' ? (
                <span className="flex items-center gap-1 text-[10px] font-bold text-amber-300 bg-amber-500/20 backdrop-blur-md px-2 py-0.5 rounded border border-amber-500/40">
                  <Sparkles className="w-2.5 h-2.5" /> MASTER
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[10px] font-bold text-indigo-300 bg-indigo-500/20 backdrop-blur-md px-2 py-0.5 rounded border border-indigo-500/40">
                  <ShieldCheck className="w-2.5 h-2.5" /> VIP
                </span>
              )}
            </div>
          </div>

          {/* Quick Action Overlay on Hover */}
          <div className={cn(
            "absolute inset-0 bg-black/50 backdrop-blur-[2px] flex items-center justify-center gap-2.5 transition-opacity duration-200",
            isHovered ? "opacity-100" : "opacity-0 pointer-events-none"
          )}>
            <button
              onClick={openPreview}
              aria-label="Inspecionar ativo"
              className="p-2.5 rounded-full bg-white/20 hover:bg-white/35 backdrop-blur-md text-white transition-transform hover:scale-110 shadow-lg border border-white/20"
              title="Expandir Visualização"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={handleCopyPrompt}
              aria-label="Copiar prompt"
              className="p-2.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white transition-transform hover:scale-110 shadow-lg"
              title="Copiar Prompt IA"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
            {hasAccess && (
              <a
                href={asset.imageUrl}
                download
                onClick={(e) => e.stopPropagation()}
                aria-label="Baixar ativo em alta resolução"
                className="p-2.5 rounded-full bg-white/20 hover:bg-white/35 backdrop-blur-md text-white transition-transform hover:scale-110 shadow-lg border border-white/20"
                title="Download 8K"
              >
                <Download className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>

        {/* Card Body */}
        <div className="p-4 flex flex-col flex-1 justify-between gap-3">
          <div>
            <div className="flex items-center justify-between gap-2 mb-1">
              <h3 className="font-semibold text-sm text-white/95 group-hover:text-indigo-300 transition-colors truncate">
                {asset.title}
              </h3>
            </div>

            {/* Prompt Preview Snippet */}
            <p className="text-xs text-white/50 line-clamp-2 font-mono leading-relaxed bg-black/30 p-2 rounded-lg border border-white/5">
              "{asset.promptText}"
            </p>
          </div>

          {/* Footer Controls */}
          <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs text-white/60">
            <button
              type="button"
              onClick={handleCopyPrompt}
              className="flex items-center gap-1.5 text-xs font-medium text-white/70 hover:text-indigo-400 transition-colors py-1"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-semibold">Prompt Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar Prompt</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={openPreview}
              className="flex items-center gap-1 text-[11px] text-white/40 hover:text-white/80 transition-colors"
            >
              <span>Detalhes</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Modal de Inspeção Cinemática (quando não controlado externamente) */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200"
          onClick={() => setIsModalOpen(false)}
        >
          <div 
            className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-[#0d0e14] border border-white/20 rounded-2xl shadow-2xl p-6 text-white space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Fechar Modal */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/80 transition-colors z-10"
              aria-label="Fechar modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Imagem Full Size */}
            <div className="relative rounded-xl overflow-hidden aspect-video bg-black/70 flex items-center justify-center border border-white/10">
              <img
                src={asset.imageUrl}
                alt={asset.title}
                className="max-h-[60vh] w-auto object-contain"
              />
              <div className="absolute top-3 left-3 flex gap-2">
                <span className={cn(
                  "text-xs font-semibold px-3 py-1 rounded-full border backdrop-blur-md uppercase tracking-wider",
                  getCategoryColor(asset.category)
                )}>
                  {asset.category}
                </span>
                <span className="text-xs font-mono text-white/90 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded border border-white/15">
                  {asset.resolution || '8K Master'}
                </span>
              </div>
            </div>

            {/* Informações e Detalhes */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-white">{asset.title}</h2>
                  <p className="text-xs text-white/50 mt-1">Acervo Exclusivo de Membros • Visuals App Pro</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyPrompt}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-medium text-xs text-white transition-all shadow-lg shadow-indigo-600/30"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copied ? 'Copiado para Clipboard' : 'Copiar Prompt Completo'}</span>
                  </button>
                  <a
                    href={asset.imageUrl}
                    download
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 font-medium text-xs text-white border border-white/15 transition-all"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Raw</span>
                  </a>
                </div>
              </div>

              {/* Caixa com o Prompt em Alta Fidelidade */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-white/60">
                  Prompt Generativo (Midjourney v6 / Flux / Stable Diffusion 3)
                </label>
                <div className="p-4 rounded-xl bg-black/50 border border-white/10 font-mono text-xs text-indigo-200/90 leading-relaxed select-all">
                  {asset.promptText}
                </div>
              </div>

              {/* Metadados Técnicos */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                  <span className="text-white/40 block text-[10px] uppercase">Formato</span>
                  <span className="font-semibold text-white/80">WebP / Lossless</span>
                </div>
                <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                  <span className="text-white/40 block text-[10px] uppercase">Resolução</span>
                  <span className="font-semibold text-white/80">{asset.resolution || '8192 × 8192'}</span>
                </div>
                <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                  <span className="text-white/40 block text-[10px] uppercase">Licença</span>
                  <span className="font-semibold text-emerald-400">Comercial VIP</span>
                </div>
                <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                  <span className="text-white/40 block text-[10px] uppercase">Nível Requerido</span>
                  <span className="font-semibold text-indigo-400 uppercase">{asset.accessTier || 'VIP'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
