"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Copy, 
  Check, 
  Download, 
  Share2, 
  FileText, 
  Smartphone, 
  FileCode, 
  FileSpreadsheet, 
  ArrowLeft,
  Terminal,
  Sparkles,
  ShieldCheck,
  CheckCircle2
} from "lucide-react";
import { LibraryItem } from "@/types/library";
import { Badge } from "@/components/ui/Badge";
import { GlassCard } from "@/components/ui/GlassCard";

interface ResourceDetailViewerProps {
  resource: LibraryItem;
  fullContent?: string | null;
  relatedResources: LibraryItem[];
}

export const ResourceDetailViewer: React.FC<ResourceDetailViewerProps> = ({
  resource,
  fullContent,
  relatedResources,
}) => {
  const [copied, setCopied] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  const displayContent = fullContent || resource.text_preview;

  const handleCopyContent = async () => {
    if (displayContent) {
      try {
        await navigator.clipboard.writeText(displayContent);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Erro ao copiar:", err);
      }
    }
  };

  const handleShare = async () => {
    try {
      if (typeof window !== "undefined") {
        await navigator.clipboard.writeText(window.location.href);
        setShareCopied(true);
        setTimeout(() => setShareCopied(false), 2000);
      }
    } catch (err) {
      console.error("Erro ao compartilhar link:", err);
    }
  };

  const lines = displayContent ? displayContent.split("\n") : [];
  const wordCount = displayContent ? displayContent.trim().split(/\s+/).length : 0;
  const charCount = displayContent ? displayContent.length : 0;

  return (
    <div className="space-y-6 sm:space-y-8 w-full max-w-full overflow-hidden">
      {/* Action Toolbar Touch-First */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 sm:p-4 rounded-2xl glass-crystal border-white/10">
        <div className="flex items-center justify-between sm:justify-start gap-2 sm:gap-3">
          <Link
            href="/biblioteca"
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white transition-all flex items-center gap-2 text-xs font-mono border border-white/10 min-h-[40px] touch-manipulation"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar ao Cofre</span>
          </Link>
          <span className="text-xs font-mono text-neutral-400">
            ID: #{resource.id}
          </span>
        </div>

        {/* Botoes de Ação com Download Evidente */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          {displayContent && (
            <button
              onClick={handleCopyContent}
              className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-200 hover:text-white transition-all text-xs font-medium flex items-center justify-center gap-1.5 border border-white/10 shadow-sm min-h-[42px] touch-manipulation"
              title="Copiar texto / prompt"
              aria-label="Copiar conteúdo"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400 font-semibold">Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-neutral-400" />
                  <span>Copiar</span>
                </>
              )}
            </button>
          )}

          <button
            onClick={handleShare}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white transition-all text-xs border border-white/10 min-h-[42px] min-w-[42px] flex items-center justify-center touch-manipulation"
            title="Copiar link permanente deste recurso"
            aria-label="Compartilhar link"
          >
            {shareCopied ? (
              <Check className="w-4 h-4 text-emerald-400" />
            ) : (
              <Share2 className="w-4 h-4" />
            )}
          </button>

          <a
            href={`/api/library/download?id=${resource.id}`}
            download={resource.file}
            className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 via-red-500 to-red-600 hover:from-red-500 hover:to-red-700 text-white transition-all text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 border border-red-500/50 shadow-[0_0_25px_rgba(255,7,58,0.4)] hover:shadow-[0_0_35px_rgba(255,7,58,0.6)] min-h-[42px] touch-manipulation"
            title="Baixar Arquivo Oficial"
            aria-label="Baixar Arquivo Oficial"
          >
            <Download className="w-4 h-4" />
            <span>Baixar Arquivo</span>
          </a>
        </div>
      </div>

      {/* Main Content Viewer Adaptado */}
      {resource.ext === ".apk" ? (
        <GlassCard variant="crystal" className="p-4 sm:p-8 border-emerald-500/30 rounded-2xl sm:rounded-3xl">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-5 pb-6 border-b border-white/10">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="p-3 sm:p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shrink-0">
                <Smartphone className="w-7 h-7 sm:w-8 sm:h-8" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white leading-snug">
                  Pacote Mobile Free Resources APK (Android Nativo)
                </h3>
                <p className="text-xs sm:text-sm text-neutral-400 mt-1 leading-relaxed">
                  Assinado em modo debug, validado em hardware real (Galaxy S22 Ultra — Android 14 / One UI 6.1).
                </p>
              </div>
            </div>

            <a
              href={`/api/library/download?id=${resource.id}`}
              download={resource.file}
              className="w-full lg:w-auto px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(16,185,129,0.35)] transition-all min-h-[48px] touch-manipulation"
            >
              <Download className="w-4 h-4" />
              <span>Baixar APK ({resource.size_formatted})</span>
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-6">
            <div className="p-3.5 sm:p-4 rounded-xl bg-white/[0.02] border border-white/5">
              <span className="text-[10px] sm:text-xs text-neutral-400 uppercase font-mono block mb-1">
                Versão do Sistema
              </span>
              <span className="text-xs sm:text-sm text-white font-semibold">
                Android 14 (One UI 6.1)
              </span>
            </div>
            <div className="p-3.5 sm:p-4 rounded-xl bg-white/[0.02] border border-white/5">
              <span className="text-[10px] sm:text-xs text-neutral-400 uppercase font-mono block mb-1">
                Arquitetura
              </span>
              <span className="text-xs sm:text-sm text-white font-semibold">
                Universal (ARM64 / v7a / x86)
              </span>
            </div>
            <div className="p-3.5 sm:p-4 rounded-xl bg-white/[0.02] border border-white/5">
              <span className="text-[10px] sm:text-xs text-neutral-400 uppercase font-mono block mb-1">
                Autenticação
              </span>
              <span className="text-xs sm:text-sm text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                Acesso Total Desbloqueado
              </span>
            </div>
          </div>
        </GlassCard>
      ) : displayContent ? (
        <div className="rounded-2xl glass-crystal overflow-hidden border-white/10 w-full">
          {/* Code Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-black/60 border-b border-white/10 text-xs text-neutral-400 font-mono">
            <div className="flex items-center gap-2 truncate">
              <Terminal className="w-4 h-4 text-red-400 shrink-0" />
              <span className="text-neutral-200 font-medium truncate">{resource.file}</span>
            </div>
            <div className="flex items-center gap-3 text-[11px] sm:text-xs shrink-0">
              <span>{lines.length} linhas</span>
              <span>•</span>
              <span>{wordCount} palavras</span>
              <span>•</span>
              <span>{charCount} caracteres</span>
            </div>
          </div>

          {/* Code / Markdown Content Box */}
          <div className="p-3 sm:p-6 bg-black/40 overflow-x-auto max-h-[70vh] sm:max-h-[700px] overflow-y-auto">
            <pre className="text-xs md:text-sm font-mono text-neutral-200 leading-relaxed">
              <code>
                {lines.map((line, index) => (
                  <div key={index} className="table-row">
                    <span className="table-cell select-none pr-3 sm:pr-4 text-neutral-600 text-right w-8 sm:w-12 font-mono text-[10px] sm:text-xs">
                      {index + 1}
                    </span>
                    <span className="table-cell whitespace-pre-wrap break-all sm:break-words">
                      {line || " "}
                    </span>
                  </div>
                ))}
              </code>
            </pre>
          </div>
        </div>
      ) : (
        <GlassCard variant="crystal" className="p-6 sm:p-12 text-center rounded-2xl sm:rounded-3xl">
          <FileText className="w-12 h-12 sm:w-16 sm:h-16 text-neutral-500 mx-auto mb-4" />
          <h3 className="text-base sm:text-lg font-bold text-white mb-2">
            Pré-visualização não disponível para formato binário
          </h3>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-md mx-auto mb-6 leading-relaxed">
            O arquivo <span className="font-mono text-neutral-200">{resource.file}</span> está pronto para ser baixado e executado em seu ambiente local.
          </p>
          <a
            href={`/api/library/download?id=${resource.id}`}
            download={resource.file}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-xs sm:text-sm uppercase tracking-wider inline-flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(255,7,58,0.35)] transition-all min-h-[48px] touch-manipulation"
          >
            <Download className="w-4 h-4" />
            <span>Download Direto ({resource.size_formatted})</span>
          </a>
        </GlassCard>
      )}

      {/* Related Resources Grid */}
      {relatedResources.length > 0 && (
        <div className="space-y-4 pt-6 sm:pt-8 border-t border-white/5">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-red-400 shrink-0" />
              <span className="truncate">Recursos Relacionados</span>
            </h3>
            <Link
              href="/biblioteca"
              className="text-xs text-red-400 hover:text-red-300 font-mono transition-colors shrink-0"
            >
              Ver todos →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
            {relatedResources.map((rel) => (
              <Link
                key={rel.id}
                href={`/biblioteca/${rel.id}`}
                className="glass-interactive rounded-xl p-3.5 sm:p-4 block group transition-all"
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-mono uppercase bg-white/5 px-2 py-0.5 rounded text-neutral-400">
                    {rel.ext.replace(".", "")}
                  </span>
                  <span className="text-[11px] font-mono text-neutral-500">
                    {rel.size_formatted}
                  </span>
                </div>
                <h4 className="text-xs sm:text-sm font-semibold text-white group-hover:text-red-400 transition-colors line-clamp-2 leading-snug">
                  {rel.title}
                </h4>
                <p className="text-[11px] sm:text-xs text-neutral-500 font-mono truncate mt-1">
                  {rel.rel_path}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
