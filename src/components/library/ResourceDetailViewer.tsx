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
    <div className="space-y-8">
      {/* Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl glass-crystal border-white/10">
        <div className="flex items-center gap-3">
          <Link
            href="/biblioteca"
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white transition-all flex items-center gap-2 text-xs font-mono border border-white/10"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar ao Cofre</span>
          </Link>
          <span className="text-neutral-500 hidden sm:inline">•</span>
          <span className="text-xs font-mono text-neutral-400 hidden sm:inline">
            ID: #{resource.id}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {displayContent && (
            <button
              onClick={handleCopyContent}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-200 hover:text-white transition-all text-xs font-medium flex items-center gap-2 border border-white/10 shadow-sm"
              title="Copiar texto / prompt"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">Conteúdo Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-neutral-400" />
                  <span>Copiar Conteúdo</span>
                </>
              )}
            </button>
          )}

          <button
            onClick={handleShare}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white transition-all text-xs border border-white/10"
            title="Copiar link permanente deste recurso"
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
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white transition-all text-xs font-medium flex items-center gap-2 border border-red-500/40 shadow-[0_0_20px_rgba(255,7,58,0.3)] hover:shadow-[0_0_30px_rgba(255,7,58,0.5)]"
          >
            <Download className="w-4 h-4" />
            <span>Baixar Arquivo</span>
          </a>
        </div>
      </div>

      {/* Main Content Viewer */}
      {resource.ext === ".apk" ? (
        <GlassCard variant="crystal" className="p-8 border-emerald-500/30">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-white/10">
            <div className="flex items-center gap-4">
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                <Smartphone className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">
                  Pacote Mobile Free Library APK (Android Nativo)
                </h3>
                <p className="text-sm text-neutral-400 mt-0.5">
                  Assinado em modo debug, validado em hardware real (Galaxy S22 Ultra — Android 14 / One UI 6.1).
                </p>
              </div>
            </div>

            <a
              href={`/api/library/download?id=${resource.id}`}
              download={resource.file}
              className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm flex items-center gap-2 shadow-[0_0_25px_rgba(16,185,129,0.3)] transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Baixar APK ({resource.size_formatted})</span>
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
              <span className="text-xs text-neutral-400 uppercase font-mono block mb-1">
                Versão do Sistema
              </span>
              <span className="text-sm text-white font-semibold">
                Android 14 (One UI 6.1)
              </span>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
              <span className="text-xs text-neutral-400 uppercase font-mono block mb-1">
                Arquitetura
              </span>
              <span className="text-sm text-white font-semibold">
                Universal (ARM64 / v7a / x86)
              </span>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
              <span className="text-xs text-neutral-400 uppercase font-mono block mb-1">
                Autenticação
              </span>
              <span className="text-sm text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                Acesso Total Desbloqueado
              </span>
            </div>
          </div>
        </GlassCard>
      ) : displayContent ? (
        <div className="rounded-2xl glass-crystal overflow-hidden border-white/10">
          {/* Code Header Bar */}
          <div className="flex items-center justify-between px-6 py-3 bg-black/60 border-b border-white/10 text-xs text-neutral-400 font-mono">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-red-400" />
              <span className="text-neutral-200 font-medium">{resource.file}</span>
            </div>
            <div className="flex items-center gap-4">
              <span>{lines.length} linhas</span>
              <span>{wordCount} palavras</span>
              <span>{charCount} caracteres</span>
            </div>
          </div>

          {/* Code / Markdown Content Box */}
          <div className="p-6 bg-black/40 overflow-x-auto max-h-[700px] overflow-y-auto">
            <pre className="text-xs md:text-sm font-mono text-neutral-200 leading-relaxed">
              <code>
                {lines.map((line, index) => (
                  <div key={index} className="table-row">
                    <span className="table-cell select-none pr-4 text-neutral-600 text-right w-12 font-mono text-xs">
                      {index + 1}
                    </span>
                    <span className="table-cell whitespace-pre-wrap break-words">
                      {line || " "}
                    </span>
                  </div>
                ))}
              </code>
            </pre>
          </div>
        </div>
      ) : (
        <GlassCard variant="crystal" className="p-12 text-center">
          <FileText className="w-16 h-16 text-neutral-500 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-white mb-2">
            Pré-visualização não disponível para formato binário
          </h3>
          <p className="text-sm text-neutral-400 max-w-md mx-auto mb-6">
            O arquivo <span className="font-mono text-neutral-200">{resource.file}</span> está pronto para ser baixado e executado em seu ambiente local.
          </p>
          <a
            href={`/api/library/download?id=${resource.id}`}
            download={resource.file}
            className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-medium text-sm inline-flex items-center gap-2 shadow-[0_0_20px_rgba(255,7,58,0.3)] transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Download Direto ({resource.size_formatted})</span>
          </a>
        </GlassCard>
      )}

      {/* Related Resources Grid */}
      {relatedResources.length > 0 && (
        <div className="space-y-4 pt-8 border-t border-white/5">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-red-400" />
              Recursos Relacionados em &quot;{resource.category_group}&quot;
            </h3>
            <Link
              href="/biblioteca"
              className="text-xs text-red-400 hover:text-red-300 font-mono transition-colors"
            >
              Ver todos ({resource.category_group}) →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {relatedResources.map((rel) => (
              <Link
                key={rel.id}
                href={`/biblioteca/${rel.id}`}
                className="glass-interactive rounded-xl p-4 block group"
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-mono uppercase bg-white/5 px-2 py-0.5 rounded text-neutral-400">
                    {rel.ext.replace(".", "")}
                  </span>
                  <span className="text-[11px] font-mono text-neutral-500">
                    {rel.size_formatted}
                  </span>
                </div>
                <h4 className="text-sm font-semibold text-white group-hover:text-red-400 transition-colors line-clamp-1">
                  {rel.title}
                </h4>
                <p className="text-xs text-neutral-500 font-mono truncate mt-1">
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
