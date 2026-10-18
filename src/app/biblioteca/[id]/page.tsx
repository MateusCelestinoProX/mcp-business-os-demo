import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ChevronLeft,
  Calendar,
  HardDrive,
  FileType,
  FolderTree,
  Tag,
  ShieldCheck,
  Share2,
  Sparkles,
  ArrowLeft,
  ExternalLink,
} from 'lucide-react';
import { getResourceById, getAllResources, LibraryResource } from '@/lib/library/catalog';
import { ResourceViewer } from '@/components/library/ResourceViewer';
import { DownloadButton } from '@/components/library/DownloadButton';

export const dynamicParams = true;

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const all = getAllResources();
  // Pré-renderiza os primeiros 40 itens no build para velocidade instantânea
  return all.slice(0, 40).map((item) => ({
    id: item.id,
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const resource = getResourceById(id);

  if (!resource) {
    return {
      title: 'Recurso não encontrado | Free Resources',
      description: 'Ativo não localizado no acervo.',
    };
  }

  return {
    title: `${resource.title} — Free Resources | Mateus Celestino Pro`,
    description: resource.description,
  };
}

export default async function BibliotecaItemPage({ params }: PageProps) {
  const { id } = await params;
  const resource = getResourceById(id);

  if (!resource) {
    notFound();
  }

  // Ativos relacionados na mesma categoria
  const all = getAllResources();
  const related = all
    .filter((item) => item.id !== resource.id && item.category === resource.category)
    .slice(0, 4);

  return (
    <div className="relative min-h-screen bg-[#070709] text-white pt-16 sm:pt-24 pb-16 sm:pb-24 px-3 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-1/3 w-[600px] h-[500px] bg-red-600/10 blur-[150px] rounded-full" />
        <div className="absolute top-96 right-10 w-[400px] h-[400px] bg-amber-500/5 blur-[130px] rounded-full" />
      </div>

      <div className="relative max-w-6xl mx-auto space-y-6 sm:space-y-8">
        {/* Navigation Breadcrumb Touch-Friendly */}
        <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-neutral-400 font-mono flex-wrap">
          <Link
            href="/biblioteca"
            className="inline-flex items-center gap-1 hover:text-white transition-colors py-1 min-h-[36px] touch-manipulation"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Free Resources</span>
          </Link>
          <span className="text-neutral-600">/</span>
          <span className="text-neutral-400 truncate max-w-[120px] sm:max-w-xs">{resource.category_group || resource.category}</span>
          <span className="text-neutral-600">/</span>
          <span className="text-red-400 font-semibold truncate max-w-[140px] sm:max-w-xs">{resource.title}</span>
        </div>

        {/* Hero Header Card with Metadata */}
        <div className="p-4 sm:p-8 rounded-2xl sm:rounded-3xl bg-[#0e0e14]/90 border border-white/10 backdrop-blur-2xl shadow-2xl space-y-5 sm:space-y-6">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-5 sm:gap-6">
            <div className="space-y-3 flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <span className="px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-semibold uppercase tracking-wider bg-red-500/15 text-red-400 border border-red-500/30 shrink-0">
                  {resource.ext.toUpperCase() || 'ARQUIVO'}
                </span>
                <span className="px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-mono bg-white/5 border border-white/10 text-neutral-300 shrink-0">
                  {resource.size_formatted}
                </span>
                {resource.pages && (
                  <span className="px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-mono bg-white/5 border border-white/10 text-neutral-300 shrink-0">
                    {resource.pages} {resource.pages === 1 ? 'página' : 'páginas'}
                  </span>
                )}
                <span className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Ativo Verificado
                </span>
              </div>

              <h1 className="text-xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight break-words">
                {resource.title}
              </h1>

              <p className="text-xs sm:text-sm md:text-base text-neutral-300 leading-relaxed max-w-3xl break-words">
                {resource.description}
              </p>
            </div>

            {/* Main Action: Download Button Evidente */}
            <div className="shrink-0 flex flex-col items-stretch sm:items-end gap-2.5 w-full md:w-auto">
              <DownloadButton
                resourceId={resource.id}
                filename={resource.file}
                sizeFormatted={resource.size_formatted}
                variant="primary"
                className="w-full sm:w-auto min-h-[48px] touch-manipulation font-bold text-xs sm:text-sm uppercase tracking-wider shadow-[0_0_30px_rgba(255,7,58,0.35)]"
              />
              <span className="text-[11px] text-neutral-500 font-mono text-center sm:text-right">
                Integridade SHA-256 Validada
              </span>
            </div>
          </div>

          {/* Detailed Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 pt-4 sm:pt-6 border-t border-white/10 text-xs">
            <div className="p-2.5 sm:p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1 overflow-hidden">
              <div className="flex items-center gap-1.5 text-neutral-500 font-semibold uppercase tracking-wider text-[10px]">
                <FolderTree className="w-3 h-3 shrink-0" />
                <span>Categoria</span>
              </div>
              <p className="font-semibold text-neutral-200 truncate" title={resource.category}>
                {resource.category}
              </p>
            </div>

            <div className="p-2.5 sm:p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1 overflow-hidden">
              <div className="flex items-center gap-1.5 text-neutral-500 font-semibold uppercase tracking-wider text-[10px]">
                <HardDrive className="w-3 h-3 shrink-0" />
                <span>Tamanho</span>
              </div>
              <p className="font-mono font-semibold text-neutral-200 truncate">
                {resource.size.toLocaleString('pt-BR')} B
              </p>
            </div>

            <div className="p-2.5 sm:p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1 overflow-hidden">
              <div className="flex items-center gap-1.5 text-neutral-500 font-semibold uppercase tracking-wider text-[10px]">
                <FileType className="w-3 h-3 shrink-0" />
                <span>Arquivo</span>
              </div>
              <p className="font-mono font-semibold text-neutral-200 truncate" title={resource.file}>
                {resource.file}
              </p>
            </div>

            <div className="p-2.5 sm:p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1 overflow-hidden">
              <div className="flex items-center gap-1.5 text-neutral-500 font-semibold uppercase tracking-wider text-[10px]">
                <Calendar className="w-3 h-3 shrink-0" />
                <span>Acesso</span>
              </div>
              <p className="font-semibold text-emerald-400 truncate">
                Livre / Soberano
              </p>
            </div>
          </div>

          {/* Tags */}
          {resource.tags && resource.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 pt-2">
              <span className="text-xs text-neutral-500 flex items-center gap-1 mr-1">
                <Tag className="w-3 h-3 shrink-0" /> Tags:
              </span>
              {resource.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-0.5 rounded-lg text-[11px] font-mono bg-white/5 text-neutral-400 border border-white/5"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Content Preview & Viewer Component */}
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-red-500 shrink-0" />
              <span>Visualização do Conteúdo do Ativo</span>
            </h2>
            <span className="text-xs text-neutral-400 font-mono shrink-0">
              Renderização Segura
            </span>
          </div>

          <ResourceViewer resource={resource} />
        </div>

        {/* Related Items Section */}
        {related.length > 0 && (
          <div className="pt-8 sm:pt-10 border-t border-white/10 space-y-4 sm:space-y-6">
            <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <span>Recursos Relacionados nesta Categoria</span>
              <span className="text-xs font-normal text-neutral-400 font-mono">({related.length})</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {related.map((item) => (
                <Link
                  key={item.id}
                  href={`/biblioteca/${item.id}`}
                  className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-[#0d0d12] hover:bg-[#13131a] border border-white/5 hover:border-red-500/30 transition-all flex flex-col justify-between group touch-manipulation"
                >
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-neutral-400 uppercase">
                      {item.ext}
                    </span>
                    <h4 className="text-xs sm:text-sm font-semibold text-white group-hover:text-red-400 transition-colors line-clamp-2 leading-snug">
                      {item.title}
                    </h4>
                  </div>
                  <span className="mt-3 text-[11px] sm:text-xs text-neutral-500 font-mono">
                    {item.size_formatted}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
