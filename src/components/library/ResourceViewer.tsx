'use client';

import React, { useState } from 'react';
import {
  Copy,
  Check,
  FileText,
  Code2,
  Sparkles,
  Smartphone,
  BookOpen,
  Eye,
  Maximize2,
  Minimize2,
  Layers,
  ShieldCheck,
  Download,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { LibraryResource } from '@/lib/library/catalog';

export interface ResourceViewerProps {
  resource: LibraryResource;
  onDownloadRequested?: () => void;
}

export function ResourceViewer({ resource, onDownloadRequested }: ResourceViewerProps) {
  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeTab, setActiveTab] = useState<'content' | 'raw' | 'metadata'>('content');

  const contentText = resource.text_preview || resource.description || '';
  const ext = (resource.ext || '').toLowerCase().replace('.', '');

  const isCode = ['py', 'js', 'json', 'html', 'css', 'ts'].includes(ext);
  const isPrompt = ext === 'txt' || resource.quick_categories.includes('Prompts');
  const isPdf = ext === 'pdf';
  const isApk = ext === 'apk';
  const isMarkdown = ext === 'md';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(contentText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Falha ao copiar:', err);
    }
  };

  // Word count & reading estimate
  const words = contentText ? contentText.trim().split(/\s+/).length : 0;
  const readTimeMin = Math.max(1, Math.ceil(words / 200));

  return (
    <div
      className={cn(
        'w-full rounded-2xl bg-[#0d0d12]/95 border border-white/10 backdrop-blur-2xl overflow-hidden transition-all duration-300 shadow-2xl',
        isFullscreen ? 'fixed inset-4 z-50 overflow-y-auto max-w-none' : 'relative'
      )}
    >
      {/* Viewer Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-white/10 bg-white/[0.02]">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono font-semibold uppercase">
            {isPdf && <FileText className="w-3.5 h-3.5" />}
            {isCode && <Code2 className="w-3.5 h-3.5" />}
            {isPrompt && <Sparkles className="w-3.5 h-3.5" />}
            {isApk && <Smartphone className="w-3.5 h-3.5" />}
            {isMarkdown && <BookOpen className="w-3.5 h-3.5" />}
            <span>{resource.ext.toUpperCase() || 'ARQUIVO'}</span>
          </div>

          <div className="text-xs text-neutral-400 font-mono hidden sm:flex items-center gap-3">
            <span>{resource.size_formatted}</span>
            {resource.pages && <span>• {resource.pages} páginas</span>}
            <span>• ~{readTimeMin} min leitura</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {contentText && (
            <button
              onClick={handleCopy}
              className={cn(
                'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border select-none cursor-pointer',
                copied
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white border-white/10'
              )}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar Conteúdo</span>
                </>
              )}
            </button>
          )}

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white border border-white/10 transition-colors cursor-pointer"
            title={isFullscreen ? 'Reduzir visualizador' : 'Expandir visualizador'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Content Area by Resource Type */}
      <div className="p-6">
        {/* TYPE 1: APK / ANDROID */}
        {isApk && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-950/20 via-black to-emerald-950/10 border border-emerald-500/30 flex flex-col md:flex-row items-center gap-6">
              <div className="w-20 h-20 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.2)] shrink-0">
                <Smartphone className="w-10 h-10 animate-pulse" />
              </div>

              <div className="space-y-2 text-center md:text-left flex-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-xs font-semibold uppercase tracking-wider">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Compilação Oficial Verificada
                </div>
                <h3 className="text-xl font-bold text-white">{resource.title}</h3>
                <p className="text-sm text-neutral-300">
                  Pacote APK compilado para Android 12+ (API 31-34) com suporte a Galaxy S22 Ultra e dispositivos móveis de alta densidade.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10">
                <span className="text-xs text-neutral-400 uppercase font-semibold">Tamanho do APK</span>
                <p className="text-lg font-mono font-bold text-white mt-1">{resource.size_formatted}</p>
              </div>
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10">
                <span className="text-xs text-neutral-400 uppercase font-semibold">Arquitetura</span>
                <p className="text-lg font-mono font-bold text-emerald-400 mt-1">Universal (arm64/v7a)</p>
              </div>
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10">
                <span className="text-xs text-neutral-400 uppercase font-semibold">Cerimônia de Acesso</span>
                <p className="text-lg font-mono font-bold text-amber-400 mt-1">Zero-Touch Ativa</p>
              </div>
            </div>

            {contentText && (
              <div className="mt-4 p-5 rounded-xl bg-black/60 border border-white/10 font-mono text-xs text-neutral-300 leading-relaxed overflow-x-auto whitespace-pre-wrap">
                {contentText}
              </div>
            )}
          </div>
        )}

        {/* TYPE 2: PROMPTS / ENGENHARIA DE PROMPT */}
        {isPrompt && !isApk && (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-xl bg-cyan-950/20 border border-cyan-500/30 text-cyan-300 text-xs">
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                Prompt Cinematográfico Estruturado de Alta Performance
              </span>
              <span className="font-mono">{words} palavras</span>
            </div>

            <div className="relative p-6 rounded-2xl bg-black/80 border border-white/15 font-mono text-sm text-neutral-200 leading-relaxed whitespace-pre-wrap selection:bg-cyan-500/30">
              {contentText || 'Nenhum preview de texto disponível para este prompt.'}
            </div>
          </div>
        )}

        {/* TYPE 3: CÓDIGO FONTE & SCRIPTS */}
        {isCode && !isApk && (
          <div className="space-y-4">
            <div className="rounded-2xl bg-black/90 border border-white/15 overflow-hidden">
              <div className="px-4 py-2.5 bg-white/5 border-b border-white/10 flex items-center justify-between text-xs text-neutral-400 font-mono">
                <span>{resource.file}</span>
                <span>{resource.size_formatted}</span>
              </div>
              <div className="p-4 overflow-x-auto">
                <pre className="font-mono text-xs md:text-sm text-neutral-200 leading-relaxed whitespace-pre">
                  {contentText || '// Código sem prévia de texto disponível'}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* TYPE 4: PDF & DOCUMENTOS */}
        {isPdf && !isApk && (
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-red-950/20 border border-red-500/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-red-400" />
                <div>
                  <h4 className="text-sm font-semibold text-white">Visualizador de Documento PDF</h4>
                  <p className="text-xs text-neutral-400">
                    {resource.pages ? `${resource.pages} páginas catalogadas` : 'Documento técnico integral'}
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono px-2.5 py-1 rounded bg-white/10 text-neutral-300">
                {resource.size_formatted}
              </span>
            </div>

            {/* Content Preview Container */}
            <div className="p-6 rounded-2xl bg-black/70 border border-white/10 max-h-[600px] overflow-y-auto space-y-4">
              <div className="text-xs font-mono text-neutral-400 uppercase tracking-wider pb-2 border-b border-white/10 flex items-center justify-between">
                <span>Extração de Texto Seguro (PyMuPDF)</span>
                <span>{words} palavras analisadas</span>
              </div>
              <div className="text-sm text-neutral-200 leading-relaxed font-sans whitespace-pre-wrap">
                {contentText || 'Prévia em texto não catalogada para este documento.'}
              </div>
            </div>
          </div>
        )}

        {/* TYPE 5: MARKDOWN & DOCUMENTAÇÃO GERAL */}
        {!isApk && !isPrompt && !isCode && !isPdf && (
          <div className="space-y-4">
            <div className="p-6 rounded-2xl bg-black/70 border border-white/10 font-sans text-sm text-neutral-200 leading-relaxed whitespace-pre-wrap">
              {contentText || resource.description}
            </div>
          </div>
        )}
      </div>

      {/* Viewer Footer Bar */}
      <div className="px-6 py-4 border-t border-white/10 bg-white/[0.01] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs text-neutral-400">
          <Layers className="w-3.5 h-3.5" />
          <span>Localização no Cofre:</span>
          <span className="font-mono text-neutral-300">{resource.rel_path}</span>
        </div>

        <div className="flex items-center gap-3 text-xs text-neutral-400">
          <span>Telemetria: {resource.download_count} acessos registrados</span>
        </div>
      </div>
    </div>
  );
}
