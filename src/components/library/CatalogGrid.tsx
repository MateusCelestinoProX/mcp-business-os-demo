'use client';

import React from 'react';
import Link from 'next/link';
import {
  FileText,
  Smartphone,
  Code2,
  FileCode,
  Image as ImageIcon,
  Sparkles,
  ExternalLink,
  BookOpen,
  Layers,
  Inbox,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { LibraryResource } from '@/lib/library/catalog';
import { DownloadButton } from './DownloadButton';

export interface CatalogGridProps {
  items: LibraryResource[];
  isLoading?: boolean;
  onResetFilters?: () => void;
}

function getExtensionBadge(ext: string) {
  const e = ext.toLowerCase().replace('.', '');
  switch (e) {
    case 'pdf':
      return {
        label: 'PDF',
        icon: <FileText className="w-3 h-3" />,
        badgeClass: 'bg-red-500/10 text-red-400 border-red-500/30',
      };
    case 'apk':
      return {
        label: 'APK ANDROID',
        icon: <Smartphone className="w-3 h-3" />,
        badgeClass: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.2)]',
      };
    case 'md':
      return {
        label: 'MARKDOWN',
        icon: <BookOpen className="w-3 h-3" />,
        badgeClass: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
      };
    case 'txt':
      return {
        label: 'PROMPT / TXT',
        icon: <Sparkles className="w-3 h-3" />,
        badgeClass: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
      };
    case 'docx':
      return {
        label: 'DOCX',
        icon: <FileText className="w-3 h-3" />,
        badgeClass: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
      };
    case 'png':
    case 'jpg':
    case 'webp':
      return {
        label: 'IMAGEM',
        icon: <ImageIcon className="w-3 h-3" />,
        badgeClass: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
      };
    case 'py':
    case 'js':
    case 'json':
    case 'html':
    case 'css':
      return {
        label: e.toUpperCase(),
        icon: <FileCode className="w-3 h-3" />,
        badgeClass: 'bg-yellow-500/15 text-yellow-300 border-yellow-500/30',
      };
    default:
      return {
        label: e.toUpperCase() || 'ARQUIVO',
        icon: <Code2 className="w-3 h-3" />,
        badgeClass: 'bg-white/10 text-neutral-300 border-white/20',
      };
  }
}

export function CatalogGrid({ items, isLoading = false, onResetFilters }: CatalogGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="glass-crystal rounded-2xl p-5 sm:p-6 h-64 animate-pulse flex flex-col justify-between border border-white/5"
          >
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div className="w-16 h-6 bg-white/10 rounded-full" />
                <div className="w-12 h-5 bg-white/5 rounded-full" />
              </div>
              <div className="w-3/4 h-5 bg-white/10 rounded-lg" />
              <div className="w-full h-12 bg-white/5 rounded-lg" />
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-white/5">
              <div className="w-20 h-4 bg-white/5 rounded" />
              <div className="w-8 h-8 bg-white/10 rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto text-center py-12 sm:py-16 px-4 sm:px-6 glass-crystal rounded-3xl border border-white/10">
        <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
          <Inbox className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-bold text-white mb-2">Nenhum recurso encontrado</h3>
        <p className="text-xs sm:text-sm text-neutral-400 mb-6 leading-relaxed">
          Não localizamos itens correspondentes aos filtros ou termo pesquisado no cofre.
        </p>
        {onResetFilters && (
          <button
            onClick={onResetFilters}
            className="glass-button-fired px-6 py-3 rounded-xl text-xs font-semibold text-white uppercase tracking-wider min-h-[44px] touch-manipulation"
          >
            Resetar Filtros
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
      {items.map((item) => {
        const extBadge = getExtensionBadge(item.ext);

        return (
          <div
            key={item.id}
            className="group relative flex flex-col justify-between rounded-2xl p-4 sm:p-5 bg-[#0e0e13]/85 hover:bg-[#13131a]/95 border border-white/10 hover:border-red-500/40 backdrop-blur-xl shadow-lg hover:shadow-[0_0_30px_rgba(255,7,58,0.18)] transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
          >
            {/* Top metadata row */}
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span
                  className={cn(
                    'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wider uppercase border shrink-0',
                    extBadge.badgeClass
                  )}
                >
                  {extBadge.icon}
                  <span>{extBadge.label}</span>
                </span>

                <span className="text-[11px] font-mono text-neutral-400 bg-white/5 px-2 py-0.5 rounded-md shrink-0">
                  {item.size_formatted}
                </span>
              </div>

              {/* Title with link */}
              <Link href={`/biblioteca/${item.id}`} className="block group/link">
                <h3 className="font-semibold text-white text-sm sm:text-base leading-snug line-clamp-2 group-hover/link:text-red-400 transition-colors">
                  {item.title}
                </h3>
              </Link>

              {/* Category Breadcrumb */}
              <div className="flex items-center gap-1.5 mt-2 text-xs text-neutral-400">
                <Layers className="w-3 h-3 text-neutral-500 shrink-0" />
                <span className="truncate" title={item.category_group || item.category}>
                  {item.category_group || item.category}
                </span>
              </div>

              {/* Text excerpt preview */}
              <p className="mt-2.5 text-xs text-neutral-400 line-clamp-3 leading-relaxed break-words">
                {item.description}
              </p>
            </div>

            {/* Bottom Actions Row Touch-First */}
            <div className="mt-4 pt-3.5 border-t border-white/5 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                {item.pages ? (
                  <span className="text-[11px] text-neutral-400 font-mono truncate">
                    {item.pages} {item.pages === 1 ? 'pág' : 'págs'}
                  </span>
                ) : (
                  <span className="text-[11px] text-neutral-400 font-mono truncate">
                    {item.quick_categories[0] || 'Ativo'}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Link
                  href={`/biblioteca/${item.id}`}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-neutral-300 hover:text-white bg-white/5 hover:bg-white/10 transition-colors border border-white/5 hover:border-white/20 min-h-[36px] touch-manipulation"
                >
                  <span>Abrir</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>

                <DownloadButton
                  resourceId={item.id}
                  filename={item.file}
                  variant="compact"
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
