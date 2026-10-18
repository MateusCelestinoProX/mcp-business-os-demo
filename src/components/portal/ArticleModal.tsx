'use client';

import React, { useEffect, useState } from 'react';
import { X, Clock, Calendar, Share2, Check, MessageSquare, ArrowLeft, ArrowRight, BookOpen } from 'lucide-react';

export interface ArticleData {
  id: string | number;
  slug?: string;
  title: string;
  category: string;
  createdAt?: string;
  isFeatured?: boolean;
  excerpt: string;
  readingTime?: string | number;
  coverImage?: string;
  contentHtml?: string;
}

export interface ArticleModalProps {
  article: ArticleData | null;
  allArticles: ArticleData[];
  onClose: () => void;
  onOpenContact?: () => void;
  onSelectArticle: (article: ArticleData) => void;
}

export function ArticleModal({
  article,
  onClose,
  onOpenContact,
  onSelectArticle,
  allArticles,
}: ArticleModalProps) {
  const [copied, setCopied] = useState(false);
  const [fullContent, setFullContent] = useState<string | null>(article?.contentHtml || null);
  const [loadingContent, setLoadingContent] = useState(false);

  useEffect(() => {
    if (!article) return;
    if (article.contentHtml) {
      setFullContent(article.contentHtml);
      return;
    }
    setLoadingContent(true);
    fetch(`/api/articles/${article.slug || article.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.article?.contentHtml) {
          setFullContent(data.article.contentHtml);
        }
      })
      .catch(() => {})
      .finally(() => setLoadingContent(false));
  }, [article]);

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

  if (!article) return null;

  const handleCopy = () => {
    if (typeof window !== 'undefined') {
      const shareUrl = window.location.href;
      if (navigator.clipboard) {
        navigator.clipboard.writeText(`${article.title} - ${shareUrl}`);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const currentIndex = allArticles.findIndex((a) => a.id === article.id);
  const prevArticle = currentIndex > 0 ? allArticles[currentIndex - 1] : null;
  const nextArticle = currentIndex < allArticles.length - 1 ? allArticles[currentIndex + 1] : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 md:p-6 overflow-y-auto bg-black/90 backdrop-blur-2xl animate-in fade-in duration-200">
      <div 
        className="fixed inset-0 -z-10 cursor-pointer hidden sm:block" 
        onClick={onClose} 
      />

      {/* Janela de Leitura: Full-Screen no Mobile / Caixa Flutuante Lapidada no Desktop */}
      <div className="relative w-full h-full sm:h-auto sm:max-w-4xl sm:max-h-[92vh] overflow-y-auto rounded-none sm:rounded-3xl glass-crystal border-0 sm:border sm:border-white/20 shadow-[0_30px_100px_rgba(0,0,0,0.98)] flex flex-col my-auto safe-pt safe-pb">
        
        {/* Barra Superior Fixa de Navegação e Fechamento */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 glass-crystal border-b border-white/10 backdrop-blur-xl">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <span className="px-2.5 py-1 rounded-xl glass-pill-red text-[11px] sm:text-xs font-mono text-[#ff073a] font-bold uppercase tracking-wider">
              {article.category}
            </span>
            <span className="flex items-center gap-1.5 text-[11px] sm:text-xs font-mono text-zinc-300">
              <Clock className="w-3.5 h-3.5 text-[#ff073a]" />
              <span>{article.readingTime || 5} min</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="min-h-[44px] min-w-[44px] px-3 py-2 rounded-xl glass-crystal hover:bg-white/10 active:scale-95 transition-all text-xs font-mono text-zinc-300 flex items-center justify-center gap-1.5 border border-white/10 cursor-pointer touch-manipulation"
              title="Copiar link do guia"
              aria-label="Compartilhar artigo"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-bold hidden xs:inline">Copiado!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-[#ff073a]" />
                  <span className="hidden xs:inline">Compartilhar</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="w-11 h-11 rounded-xl glass-crystal hover:bg-red-500/20 active:scale-95 transition-all flex items-center justify-center text-zinc-300 hover:text-white border border-white/10 hover:border-red-500/40 cursor-pointer touch-manipulation"
              title="Fechar leitura"
              aria-label="Fechar modal de artigo"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Corpo Editorial com Tipografia Nobre e Leitura Imersiva */}
        <div className="p-4 sm:p-8 lg:p-10 flex-1 overflow-x-hidden">
          
          {/* Imagem de Capa do Artigo */}
          <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden mb-6 sm:mb-8 bg-black border border-white/10 shadow-2xl">
            <img
              src={article.coverImage || '/assets/hero_cover.webp'}
              alt={article.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.currentTarget;
                if (!target.src.endsWith('/assets/hero_cover.webp')) {
                  target.src = '/assets/hero_cover.webp';
                }
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
          </div>

          {/* Metadados e Título */}
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs font-mono text-zinc-400 mb-3">
              <span className="text-[#ff073a] font-bold">Mateus Celestino Pro X</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                {article.createdAt || 'Publicação Soberana'}
              </span>
            </div>

            <h1 className="text-xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
              {article.title}
            </h1>

            <p className="mt-3 sm:mt-4 text-xs sm:text-base text-zinc-300 font-light leading-relaxed border-l-2 border-[#ff073a] pl-3 sm:pl-4 italic glass-pill p-3 rounded-r-xl">
              {article.excerpt}
            </p>
          </div>

          {/* Divisor Carmesim */}
          <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-red-500/30 to-transparent my-6" />

          {/* Conteúdo Integral do Artigo */}
          <div className="prose prose-invert max-w-none text-zinc-200 text-sm sm:text-base leading-relaxed space-y-4">
            {loadingContent ? (
              <div className="py-12 flex flex-col items-center justify-center gap-3">
                <div className="w-8 h-8 rounded-full border-2 border-red-500 border-t-transparent animate-spin" />
                <span className="text-xs font-mono text-zinc-400">Carregando guia técnico completo...</span>
              </div>
            ) : fullContent ? (
              <div
                dangerouslySetInnerHTML={{ __html: fullContent }}
                className="article-body font-sans leading-relaxed break-words"
              />
            ) : (
              <div className="space-y-4">
                <p>
                  Este é um artigo completo do ecossistema <strong className="text-white">Mateus Celestino Pro X</strong>, cobrindo práticas de automação, integrações inteligentes com IA generativa, fluxos no n8n e infraestrutura soberana.
                </p>
                <p>
                  Para implementar este fluxo de automação ou consultar mais detalhes técnicos diretamente com o arquiteto chefe, utilize o canal de atendimento rápido via WhatsApp.
                </p>
              </div>
            )}
          </div>

          {/* CTA Especial no Final da Leitura */}
          <div className="mt-8 sm:mt-12 p-5 sm:p-6 rounded-2xl glass-crystal border border-[#ff073a]/40 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="text-xs font-mono font-bold text-[#ff073a] uppercase tracking-wider mb-1">
                IMPLEMENTE ESTE SISTEMA NA SUA EMPRESA
              </div>
              <p className="text-xs sm:text-sm text-zinc-300 font-light">
                Automações sob medida, esteiras n8n, agentes no WhatsApp e servidores self-hosted.
              </p>
            </div>
            <a
              href="https://api.whatsapp.com/send/?phone=553197724257&text=QUERO+AUTOMATIZAR+TUDO.&type=phone_number&app_absent=0"
              target="_blank"
              rel="noopener noreferrer"
              className="glass-button-fired min-h-[48px] w-full sm:w-auto px-5 py-3 rounded-xl text-xs font-mono font-bold text-white flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-transform touch-manipulation cursor-pointer shrink-0"
            >
              <MessageSquare className="w-4 h-4 fill-white/20" />
              <span>QUERO AUTOMATIZAR TUDO</span>
            </a>
          </div>

        </div>

        {/* Rodapé do Modal com Navegação Entre Artigos Touch-Friendly */}
        <div className="sticky bottom-0 z-20 px-4 sm:px-6 py-3.5 glass-crystal border-t border-white/10 backdrop-blur-xl flex items-center justify-between gap-2">
          {prevArticle ? (
            <button
              onClick={() => onSelectArticle(prevArticle)}
              className="flex-1 min-h-[44px] px-3 py-2 rounded-xl glass-crystal text-xs font-mono text-zinc-300 hover:text-white border border-white/10 active:scale-95 transition-all flex items-center gap-1.5 touch-manipulation truncate cursor-pointer"
              title={prevArticle.title}
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#ff073a] shrink-0" />
              <span className="truncate hidden xs:inline">{prevArticle.title}</span>
              <span className="xs:hidden">Anterior</span>
            </button>
          ) : (
            <div className="flex-1" />
          )}

          {nextArticle ? (
            <button
              onClick={() => onSelectArticle(nextArticle)}
              className="flex-1 min-h-[44px] px-3 py-2 rounded-xl glass-crystal text-xs font-mono text-zinc-300 hover:text-white border border-white/10 active:scale-95 transition-all flex items-center justify-end gap-1.5 touch-manipulation truncate cursor-pointer"
              title={nextArticle.title}
            >
              <span className="truncate hidden xs:inline">{nextArticle.title}</span>
              <span className="xs:hidden">Próximo</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#ff073a] shrink-0" />
            </button>
          ) : (
            <div className="flex-1" />
          )}
        </div>

      </div>
    </div>
  );
}

export default ArticleModal;
