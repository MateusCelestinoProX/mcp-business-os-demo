"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  FileText, 
  FileCode, 
  FileSpreadsheet, 
  Download, 
  Copy, 
  Check, 
  ExternalLink, 
  Smartphone, 
  Archive, 
  Layers, 
  Code2, 
  FileQuestion,
  Sparkles
} from "lucide-react";
import { LibraryItem } from "@/types/library";
import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

interface ResourceCardProps {
  resource: LibraryItem;
  viewMode?: "grid" | "list";
  onSelect?: (resource: LibraryItem) => void;
}

export const ResourceCard: React.FC<ResourceCardProps> = ({
  resource,
  viewMode = "grid",
  onSelect,
}) => {
  const [copied, setCopied] = useState(false);

  const getFileIcon = (ext: string) => {
    switch (ext.toLowerCase()) {
      case ".pdf":
        return <FileText className="w-5 h-5 text-red-400" />;
      case ".apk":
        return <Smartphone className="w-5 h-5 text-emerald-400" />;
      case ".md":
      case ".txt":
        return <FileCode className="w-5 h-5 text-blue-400" />;
      case ".docx":
        return <FileSpreadsheet className="w-5 h-5 text-amber-400" />;
      case ".html":
      case ".js":
      case ".py":
        return <Code2 className="w-5 h-5 text-purple-400" />;
      case ".zip":
        return <Archive className="w-5 h-5 text-cyan-400" />;
      default:
        return <FileQuestion className="w-5 h-5 text-neutral-400" />;
    }
  };

  const getBadgeVariant = (group: string) => {
    switch (group) {
      case "Security & Sentinel":
      case "The Skeleton Method":
        return "red";
      case "AI Animation":
      case "Nova Era da IA":
        return "gold";
      case "Creative Studio":
      case "Miko AI":
        return "default";
      default:
        return "outline";
    }
  };

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const content = resource.text_preview || resource.file;
    if (content) {
      try {
        await navigator.clipboard.writeText(content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Falha ao copiar:", err);
      }
    }
  };

  if (viewMode === "list") {
    return (
      <div className="glass-interactive rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 group transition-all duration-300 hover:border-red-500/40">
        <div className="flex items-start md:items-center gap-4 flex-1 min-w-0">
          <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10 group-hover:border-red-500/30 transition-all flex-shrink-0">
            {getFileIcon(resource.ext)}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <Link
                href={`/biblioteca/${resource.id}`}
                className="text-white font-medium hover:text-red-400 transition-colors truncate max-w-md text-sm md:text-base"
              >
                {resource.title}
              </Link>
              <Badge variant={getBadgeVariant(resource.category_group)} className="text-[10px] py-0.5 px-2">
                {resource.category_group}
              </Badge>
              <span className="text-[11px] text-neutral-400 font-mono uppercase bg-white/5 px-2 py-0.5 rounded border border-white/5">
                {resource.ext.replace(".", "")}
              </span>
              {resource.pages && (
                <span className="text-[11px] text-neutral-400 bg-white/5 px-2 py-0.5 rounded">
                  {resource.pages} {resource.pages === 1 ? "página" : "páginas"}
                </span>
              )}
            </div>

            <p className="text-xs text-neutral-400 truncate mt-0.5 font-mono">
              {resource.rel_path}
            </p>

            {resource.text_preview && (
              <p className="text-xs text-neutral-400 line-clamp-1 mt-1 italic">
                &ldquo;{resource.text_preview.slice(0, 140)}...&rdquo;
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end border-t md:border-t-0 pt-3 md:pt-0 border-white/5">
          <span className="text-xs text-neutral-400 font-mono mr-2">
            {resource.size_formatted}
          </span>

          {resource.text_preview && (
            <button
              onClick={handleCopy}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white transition-all text-xs flex items-center gap-1.5 border border-white/5"
              title="Copiar prévia do prompt/conteúdo"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{copied ? "Copiado" : "Copiar"}</span>
            </button>
          )}

          <a
            href={`/api/library/download?id=${resource.id}`}
            download={resource.file}
            className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 text-neutral-300 hover:text-red-400 transition-all text-xs flex items-center gap-1.5 border border-white/5 hover:border-red-500/30"
            title="Download do Recurso"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Baixar</span>
          </a>

          <Link
            href={`/biblioteca/${resource.id}`}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all text-xs flex items-center gap-1 border border-white/10"
          >
            <span>Ver</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    );
  }

  // Grid View
  return (
    <GlassCard
      variant="interactive"
      className="flex flex-col justify-between h-full group hover:border-red-500/40 relative overflow-hidden"
    >
      {/* Top Specular Glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-red-500/15 transition-all duration-500" />

      <div>
        {/* Card Header */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10 group-hover:border-red-500/30 transition-all">
              {getFileIcon(resource.ext)}
            </div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 bg-white/5 px-2 py-0.5 rounded border border-white/5">
              {resource.ext.replace(".", "")}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-mono text-neutral-400">
              {resource.size_formatted}
            </span>
          </div>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap items-center gap-1.5 mb-2">
          <Badge variant={getBadgeVariant(resource.category_group)} className="text-[10px] py-0.5 px-2">
            {resource.category_group}
          </Badge>
          {resource.pages && (
            <Badge variant="outline" className="text-[10px] py-0.5 px-2">
              {resource.pages} {resource.pages === 1 ? "pág" : "págs"}
            </Badge>
          )}
        </div>

        {/* Title & Path */}
        <Link href={`/biblioteca/${resource.id}`} className="block">
          <h3 className="text-white font-semibold text-base line-clamp-2 group-hover:text-red-400 transition-colors mb-1">
            {resource.title}
          </h3>
        </Link>
        
        <p className="text-xs text-neutral-400 font-mono truncate mb-3" title={resource.rel_path}>
          {resource.rel_path}
        </p>

        {/* Preview Snippet */}
        {resource.text_preview ? (
          <div className="relative rounded-lg p-3 bg-black/40 border border-white/5 mb-4 group-hover:border-white/10 transition-all">
            <p className="text-xs text-neutral-400 font-mono line-clamp-3 leading-relaxed whitespace-pre-wrap select-none">
              {resource.text_preview}
            </p>
            <div className="absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-black/80 to-transparent rounded-b-lg" />
          </div>
        ) : (
          <div className="rounded-lg p-3 bg-white/[0.02] border border-white/5 mb-4 text-center">
            <p className="text-xs text-neutral-400 italic">
              {resource.ext === ".apk" ? "Pacote Android Instalável Galaxy S22 Ultra" : "Recurso binário pronto para download"}
            </p>
          </div>
        )}
      </div>

      {/* Card Actions Footer */}
      <div className="flex items-center justify-between gap-2 pt-3 border-t border-white/5 mt-auto">
        <div className="flex items-center gap-1.5">
          {resource.text_preview && (
            <button
              onClick={handleCopy}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white transition-all text-xs flex items-center gap-1 border border-white/5"
              title="Copiar prompt / conteúdo"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="text-[11px]">{copied ? "Copiado!" : "Copiar"}</span>
            </button>
          )}

          <a
            href={`/api/library/download?id=${resource.id}`}
            download={resource.file}
            className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 text-neutral-300 hover:text-red-400 transition-all text-xs flex items-center gap-1 border border-white/5 hover:border-red-500/30"
            title="Download do Recurso"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="text-[11px]">Baixar</span>
          </a>
        </div>

        <Link
          href={`/biblioteca/${resource.id}`}
          className="py-1.5 px-3 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all text-xs font-medium flex items-center gap-1 border border-white/10 hover:border-white/20"
        >
          <span>Abrir</span>
          <ExternalLink className="w-3 h-3" />
        </Link>
      </div>
    </GlassCard>
  );
};
