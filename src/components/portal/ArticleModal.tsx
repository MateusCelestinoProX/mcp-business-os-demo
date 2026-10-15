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
      navigator.clipboard.writeText(`${article.title} - por Mateus Celestino Pro X`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const currentIndex = allArticles.findIndex((a) => a.id === article.id);
  const prevArticle = currentIndex > 0 ? allArticles[currentIndex - 1] : null;
  const nextArticle = currentIndex < allArticles.length - 1 ? allArticles[currentIndex + 1] : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-3xl animate-in fade-in duration-200">
      <div 
        className="fixed inset-0 -z-10" 
        onClick={onClose} 
      />

      {/* Janela de Leitura em Vidro Cristalino Lapidado */}
      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-3xl glass-crystal border border-white/20 shadow-[0_30px_100px_rgba(0,0,0,0.98)] flex flex-col my-auto">
        
        {/* Barra Superior Fixa de Vidro */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 glass-crystal border-b border-white/10">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-xl glass-pill-red text-xs font-mono text-[#ff073a] font-bold uppercase tracking-wider">
              {article.category}
            </span>
            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-mono text-zinc-300">
              <Clock className="w-3.5 h-3.5 text-[#ff073a]" />
              {article.readingTime || 5} min de leitura
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass-pill hover:border-white/25 text-xs font-mono text-zinc-300 hover:text-white transition-all cursor-pointer"
              title="Copiar Título"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{copied ? 'Copiado!' : 'Compartilhar'}</span>
            </button>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl glass-pill hover:bg-[#ff073a] hover:text-white flex items-center justify-center text-zinc-400 transition-all duration-200 cursor-pointer"
              title="Fechar (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Corpo do Artigo */}
        <div className="p-6 sm:p-10">
          {/* Capa Ampliada em Vidro */}
          {article.coverImage && (
            <div className="relative aspect-[21/9] sm:aspect-[24/9] w-full rounded-2xl overflow-hidden mb-8 border border-white/15 bg-black shadow-2xl">
              <img
                src={article.coverImage}
                alt={article.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
            </div>
          )}

          {/* Título Principal */}
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
            {article.title}
          </h1>

          {/* Faixa de Autor em Vidro */}
          <div className="mt-4 pb-6 border-b border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-zinc-400">
            <div className="flex items-center gap-3">
              <img
                src="/assets/mateus_avatar.webp"
                alt="Mateus Celestino"
                className="w-10 h-10 rounded-2xl border border-[#ff073a]/50 object-cover shadow-lg"
              />
              <div>
                <span className="text-white font-bold block">Mateus Celestino Pro</span>
                <span className="text-zinc-500 text-[11px]">Especialista em Automação & IA</span>
              </div>
            </div>

            {article.createdAt && (
              <div className="flex items-center gap-1.5 text-zinc-400 glass-pill px-3 py-1 rounded-xl">
                <Calendar className="w-3.5 h-3.5 text-[#ff073a]" />
                <span>Publicado em: {article.createdAt}</span>
              </div>
            )}
          </div>

          {/* Conteúdo Editorial Formatado */}
          <div className="mt-8 article-prose text-zinc-300">
            {loadingContent ? (
              <div className="space-y-4 py-8 animate-pulse">
                <div className="h-4 bg-white/10 rounded-full w-3/4" />
                <div className="h-4 bg-white/10 rounded-full w-5/6" />
                <div className="h-4 bg-white/10 rounded-full w-2/3" />
                <div className="h-32 bg-white/5 rounded-2xl w-full" />
              </div>
            ) : fullContent ? (
              <div dangerouslySetInnerHTML={{ __html: fullContent }} />
            ) : (
              <div className="space-y-4">
                <p>{article.excerpt}</p>
                <div className="p-5 rounded-2xl glass-pill-red text-zinc-200">
                  <p className="font-bold text-white">Conteúdo do Acervo Original:</p>
                  <p className="mt-1 text-sm">Este guia faz parte do acervo original do primeiro site de automação do Mateus Celestino. Para discutir a aplicação prática deste fluxo ou ferramenta no seu negócio, entre em contato direto.</p>
                </div>
              </div>
            )}
          </div>

          {/* CTA de Rodapé do Artigo em Vidro Líquido */}
          <div className="mt-12 p-6 sm:p-8 rounded-3xl glass-crystal border border-[#ff073a]/40 relative overflow-hidden shadow-2xl">
            <h4 className="text-lg font-bold text-white tracking-tight">
              Quer implementar essa automação na sua empresa?
            </h4>
            <p className="mt-2 text-sm text-zinc-300 font-light max-w-xl">
              Mateus Celestino projeta, implementa e mantém sistemas de automação sob medida com n8n, Typebot, IA e servidores Linux autônomos.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <a
                href={`https://api.whatsapp.com/send/?phone=553197724257&text=Oi+Mateus,+li+o+artigo+sobre+${encodeURIComponent(article.title)}+e+quero+automatizar+isso.&type=phone_number&app_absent=0`}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-button-fired flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-mono font-bold text-white shadow-lg"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Falar no WhatsApp sobre este artigo</span>
              </a>
              <button
                onClick={() => { onClose(); if (onOpenContact) onOpenContact(); }}
                className="px-4 py-2.5 rounded-xl text-xs font-mono text-zinc-300 hover:text-white glass-pill hover:border-white/20 transition-all cursor-pointer"
              >
                Ver outros canais de contato
              </button>
            </div>
          </div>

          {/* Navegação Entre Artigos em Vidro */}
          <div className="mt-10 pt-6 border-t border-white/10 flex items-center justify-between gap-4">
            {prevArticle ? (
              <button
                onClick={() => onSelectArticle(prevArticle)}
                className="group text-left max-w-[45%] flex items-center gap-2.5 text-xs font-mono text-zinc-400 hover:text-white transition-all glass-interactive p-3 rounded-2xl cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 text-[#ff073a] group-hover:-translate-x-1 transition-transform shrink-0" />
                <div className="truncate">
                  <span className="block text-[10px] text-zinc-500 uppercase">Anterior</span>
                  <span className="truncate block font-semibold text-zinc-200 group-hover:text-white">{prevArticle.title}</span>
                </div>
              </button>
            ) : <div />}

            {nextArticle && (
              <button
                onClick={() => onSelectArticle(nextArticle)}
                className="group text-right max-w-[45%] flex items-center gap-2.5 text-xs font-mono text-zinc-400 hover:text-white transition-all glass-interactive p-3 rounded-2xl ml-auto cursor-pointer"
              >
                <div className="truncate">
                  <span className="block text-[10px] text-zinc-500 uppercase">Próximo</span>
                  <span className="truncate block font-semibold text-zinc-200 group-hover:text-white">{nextArticle.title}</span>
                </div>
                <ArrowRight className="w-4 h-4 text-[#ff073a] group-hover:translate-x-1 transition-transform shrink-0" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ArticleModal;
