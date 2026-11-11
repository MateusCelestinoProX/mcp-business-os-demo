"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import Image from "next/image";
import {
  Search,
  BookOpen,
  Clock,
  Calendar,
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Flame,
  ArrowRight,
  Share2,
  ExternalLink,
  MessageSquare,
} from "lucide-react";
import rawArticles from "@/data/articles-summary.json";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { sanitizeDangerousHtml } from "@/lib/security/sanitize";

export interface ArticleItem {
  id: string | number;
  slug: string;
  title: string;
  category: string;
  createdAt: string;
  isFeatured?: boolean;
  excerpt: string;
  readingTime?: string | number;
  coverImage?: string;
  contentHtml?: string;
}

const ITEMS_PER_PAGE = 9;

export function DynamicArticles() {
  const articles = rawArticles as ArticleItem[];
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("TODOS");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeArticle, setActiveArticle] = useState<ArticleItem | null>(null);
  const [copyFeedback, setCopyFeedback] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Extrai lista única de categorias
  const categories = useMemo(() => {
    const set = new Set<string>();
    articles.forEach((a) => {
      if (a.category && a.category.trim()) {
        set.add(a.category.trim());
      }
    });
    return ["TODOS", ...Array.from(set).sort()];
  }, [articles]);

  // Filtra artigos por busca e categoria
  const filteredArticles = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    return articles.filter((art) => {
      const matchCategory =
        selectedCategory === "TODOS" ||
        (art.category && art.category.toLowerCase() === selectedCategory.toLowerCase());

      const matchSearch =
        !term ||
        art.title?.toLowerCase().includes(term) ||
        art.excerpt?.toLowerCase().includes(term) ||
        art.category?.toLowerCase().includes(term);

      return matchCategory && matchSearch;
    });
  }, [articles, searchTerm, selectedCategory]);

  // Paginação
  const totalPages = Math.max(1, Math.ceil(filteredArticles.length / ITEMS_PER_PAGE));
  const currentArticles = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredArticles.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredArticles, currentPage]);

  // Resetar página ao buscar ou mudar categoria
  const handleCategorySelect = (cat: string) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setCurrentPage(1);
    if (searchInputRef.current) searchInputRef.current.focus();
  };

  // Atalho global Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        const section = document.getElementById("artigos");
        if (section) section.scrollIntoView({ behavior: "smooth" });
        setTimeout(() => {
          searchInputRef.current?.focus();
        }, 300);
      }
      if (e.key === "Escape" && activeArticle) {
        setActiveArticle(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeArticle]);

  // Compartilhar artigo
  const handleShare = (art: ArticleItem) => {
    if (navigator.share) {
      navigator.share({
        title: art.title,
        text: art.excerpt,
        url: window.location.href,
      }).catch(() => null);
    } else {
      navigator.clipboard.writeText(`${art.title} - ${window.location.href}`);
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 2000);
    }
  };

  return (
    <section id="artigos" className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full relative">
      {/* Cabeçalho da Seção */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 sm:mb-12">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-pill-red text-xs font-mono text-red-500 uppercase tracking-widest font-bold">
            <BookOpen className="w-3.5 h-3.5" />
            <span>ACERVO TÉCNICO OFICIAL</span>
          </div>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
            176 Guias e Arquiteturas Práticas
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-neutral-400 font-light leading-relaxed">
            Tutoriais aprofundados sobre automação de processos com n8n, engenharia de prompts, 
            orquestração de agentes IA, Typebot e servidores Linux autônomos.
          </p>
        </div>

        {/* Métrica Dinâmica */}
        <div className="flex items-center gap-3 p-3.5 sm:p-4 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl shrink-0">
          <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 shrink-0">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] sm:text-xs font-mono text-neutral-400 uppercase tracking-wider">
              TOTAL DE ARTIGOS
            </div>
            <div className="text-lg sm:text-xl font-bold font-mono text-white">
              {filteredArticles.length} <span className="text-xs font-normal text-neutral-500">de {articles.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Barra de Busca com Atalho Cmd+K */}
      <div className="mb-6 sm:mb-8 space-y-4">
        <div className="relative flex items-center">
          <div className="absolute left-4 flex items-center pointer-events-none text-neutral-500">
            <Search className="w-4 h-4 sm:w-5 sm:h-5 text-red-500/80" />
          </div>
          <input
            ref={searchInputRef}
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Pesquisar por assunto, ferramenta (n8n, IA, Docker...) ou tema..."
            className="w-full pl-11 sm:pl-12 pr-14 sm:pr-28 py-3 sm:py-3.5 min-h-[44px] rounded-2xl bg-neutral-900/80 border border-white/10 hover:border-white/20 focus:border-red-500/60 focus:shadow-[0_0_25px_rgba(255,7,58,0.2)] text-white placeholder:text-neutral-500 text-xs sm:text-sm outline-none transition-all duration-200 backdrop-blur-xl"
          />
          <div className="absolute right-3 flex items-center gap-2">
            {searchTerm && (
              <button
                onClick={handleClearSearch}
                className="w-8 h-8 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors flex items-center justify-center cursor-pointer touch-manipulation"
                title="Limpar busca"
                aria-label="Limpar busca"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-[10px] font-mono font-semibold text-neutral-400 bg-black/60 border border-white/10 rounded-md">
              <span>⌘</span>K
            </kbd>
          </div>
        </div>

        {/* Filtro por Categorias com Rolagem Horizontal Touch Suave */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1 scrollbar-none overscroll-x-contain touch-pan-x [-webkit-overflow-scrolling:touch] -mx-1 px-1">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => handleCategorySelect(cat)}
                className={`min-h-[40px] px-3.5 py-2 rounded-xl text-xs font-mono tracking-wider uppercase transition-all duration-200 shrink-0 select-none whitespace-nowrap cursor-pointer touch-manipulation active:scale-95 ${
                  isSelected
                    ? "bg-red-600 text-white font-bold shadow-[0_0_15px_rgba(255,7,58,0.4)] border border-red-400/40"
                    : "bg-white/[0.04] text-neutral-400 hover:text-white hover:bg-white/[0.08] border border-white/5"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid de Artigos: 1 Coluna no Mobile, 2 no Tablet, 3 no Desktop */}
      {currentArticles.length === 0 ? (
        <div className="py-12 sm:py-20 text-center rounded-2xl sm:rounded-3xl bg-white/[0.02] border border-white/5 p-6 sm:p-8">
          <BookOpen className="w-10 h-10 sm:w-12 sm:h-12 text-neutral-600 mx-auto mb-4" />
          <h3 className="text-lg sm:text-xl font-bold text-white mb-2">Nenhum artigo encontrado</h3>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-md mx-auto mb-6 leading-relaxed">
            Não encontramos artigos correspondentes a "{searchTerm}". Tente pesquisar por outros termos como "Docker", "n8n", "WhatsApp" ou selecione outra categoria.
          </p>
          <Button variant="fired" onClick={handleClearSearch} className="min-h-[44px]">
            Limpar Filtros e Ver Todos
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {currentArticles.map((art) => {
            const readingMinutes = art.readingTime || "7 min";
            const dateFormatted = art.createdAt
              ? new Date(art.createdAt).toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })
              : "Edição 2026";

            return (
              <GlassCard
                key={art.id}
                variant="interactive"
                glow
                className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 hover:border-red-500/50 transition-all duration-300 p-0 touch-manipulation active:scale-[0.99] cursor-pointer"
                onClick={() => setActiveArticle(art)}
              >
                <div>
                  {/* Capa do Artigo com Proporção Consistente e Fallback */}
                  <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full bg-neutral-950 overflow-hidden border-b border-white/5 shrink-0">
                    {art.coverImage ? (
                      <img
                        src={art.coverImage}
                        alt={art.title}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-90 contrast-105"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = "none";
                        }}
                      />
                    ) : null}

                    {/* Gradiente de Fusão sobre a Capa */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-black/40 to-transparent pointer-events-none" />

                    {/* Badges Flutuantes sobre a Capa */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
                      <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold tracking-widest uppercase bg-black/80 backdrop-blur-md border border-white/10 text-neutral-200 max-w-[70%] truncate">
                        {art.category || "AUTOMAÇÃO"}
                      </span>
                      {art.isFeatured && (
                        <span className="px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold tracking-wider uppercase bg-red-600/90 text-white shadow-[0_0_10px_#ff073a] shrink-0">
                          DESTAQUE
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Conteúdo do Card */}
                  <div className="p-4 sm:p-5 space-y-2.5 sm:space-y-3">
                    {/* Metadados: Data e Leitura */}
                    <div className="flex items-center gap-2.5 text-xs text-neutral-400 font-mono">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                        <span>{dateFormatted}</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                        <span>{readingMinutes}</span>
                      </span>
                    </div>

                    {/* Título */}
                    <h3 className="text-base font-bold text-white group-hover:text-red-400 transition-colors line-clamp-2 leading-snug break-words">
                      {art.title}
                    </h3>

                    {/* Resumo Excerpt */}
                    <p className="text-xs sm:text-sm text-neutral-300 font-light line-clamp-3 leading-relaxed break-words">
                      {art.excerpt}
                    </p>
                  </div>
                </div>

                {/* Rodapé do Card com CTA */}
                <div className="p-4 sm:p-5 pt-0 mt-auto flex items-center justify-between border-t border-white/5 text-xs font-mono text-neutral-400 pt-3">
                  <span className="text-red-400 font-semibold group-hover:translate-x-1 transition-transform flex items-center gap-1.5">
                    <span>Ler artigo completo</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                  <span className="text-[11px] text-neutral-500">ID #{art.id}</span>
                </div>
              </GlassCard>
            );
          })}
        </div>
      )}

      {/* Paginação Touch-Friendly */}
      {totalPages > 1 && (
        <div className="mt-8 sm:mt-12 flex flex-wrap items-center justify-center gap-2">
          <Button
            variant="glass"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => {
              setCurrentPage((p) => Math.max(1, p - 1));
              document.getElementById("artigos")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="min-h-[44px] min-w-[44px] gap-1 font-mono text-xs touch-manipulation active:scale-95"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden xs:inline">Anterior</span>
          </Button>

          <div className="flex items-center gap-1 px-3 py-2 min-h-[44px] rounded-xl bg-white/[0.04] border border-white/5 font-mono text-xs text-neutral-300">
            Página <span className="text-white font-bold mx-1">{currentPage}</span> de <span className="text-neutral-400 ml-1">{totalPages}</span>
          </div>

          <Button
            variant="glass"
            size="sm"
            disabled={currentPage === totalPages}
            onClick={() => {
              setCurrentPage((p) => Math.min(totalPages, p + 1));
              document.getElementById("artigos")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="min-h-[44px] min-w-[44px] gap-1 font-mono text-xs touch-manipulation active:scale-95"
          >
            <span className="hidden xs:inline">Próxima</span>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Modal / Leitor de Artigo Completo (Full-Screen no Mobile, Alta Fidelidade Notion) */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 md:p-6 overflow-hidden bg-black/90 backdrop-blur-2xl animate-in fade-in duration-200">
          <div
            className="relative w-full h-full sm:h-auto sm:max-w-4xl sm:max-h-[90vh] flex flex-col bg-[#08080a] border-0 sm:border sm:border-white/15 rounded-none sm:rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.95),0_0_50px_rgba(255,7,58,0.2)] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Fixo do Leitor com Touch Target Amplo */}
            <div className="sticky top-0 z-20 px-4 py-3 sm:p-6 bg-[#08080a]/95 backdrop-blur-xl border-b border-white/10 flex items-center justify-between gap-3 shrink-0">
              <div className="space-y-0.5 sm:space-y-1 min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <Badge variant="red" className="text-[10px] uppercase truncate max-w-[150px] sm:max-w-none">
                    {activeArticle.category || "ARTIGO TÉCNICO"}
                  </Badge>
                  <span className="text-[11px] sm:text-xs text-neutral-400 font-mono truncate">
                    {activeArticle.readingTime || "7 min de leitura"}
                  </span>
                </div>
                <h2 className="text-sm sm:text-xl font-bold text-white truncate">
                  {activeArticle.title}
                </h2>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Button
                  variant="glass"
                  size="sm"
                  onClick={() => handleShare(activeArticle)}
                  className="min-h-[44px] px-3 gap-1.5 text-xs font-mono touch-manipulation active:scale-95"
                  title="Compartilhar"
                >
                  <Share2 className="w-4 h-4" />
                  <span className="hidden sm:inline">
                    {copyFeedback ? "Copiado!" : "Compartilhar"}
                  </span>
                </Button>

                <button
                  onClick={() => setActiveArticle(null)}
                  className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-xl bg-white/5 hover:bg-red-600 hover:text-white border border-white/10 flex items-center justify-center text-neutral-300 transition-all cursor-pointer touch-manipulation active:scale-95"
                  title="Fechar (Esc)"
                  aria-label="Fechar artigo"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Corpo do Artigo com Scroll Suave e Tipografia Fluida */}
            <div className="p-4 sm:p-8 md:p-10 overflow-y-auto space-y-6 sm:space-y-8 flex-1 overscroll-y-contain">
              {/* Capa Ampliada se existir */}
              {activeArticle.coverImage && (
                <div className="w-full aspect-[16/9] sm:aspect-[21/9] rounded-2xl overflow-hidden relative border border-white/10 bg-neutral-950 shrink-0">
                  <img
                    src={activeArticle.coverImage}
                    alt={activeArticle.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                </div>
              )}

              {/* Título Completo & Metadados */}
              <div className="space-y-3 sm:space-y-4">
                <h1 className="text-xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight break-words">
                  {activeArticle.title}
                </h1>

                <div className="p-3.5 sm:p-4 rounded-xl bg-white/[0.02] border border-white/5 text-xs sm:text-sm text-neutral-300 italic leading-relaxed break-words">
                  "{activeArticle.excerpt}"
                </div>
              </div>

              {/* Renderização do HTML do Artigo com Proteção de Código e Tabelas */}
              <div
                className="prose-soberana prose prose-invert max-w-none text-neutral-300 leading-relaxed space-y-4 text-sm sm:text-base selection:bg-red-500/30 font-light break-words [&_pre]:overflow-x-auto [&_pre]:p-4 [&_pre]:rounded-2xl [&_pre]:bg-black/80 [&_pre]:border [&_pre]:border-white/10 [&_pre]:text-xs [&_pre]:sm:text-sm [&_code]:break-words sm:[&_code]:break-normal [&_img]:rounded-2xl [&_img]:max-w-full [&_table]:w-full [&_table]:overflow-x-auto [&_table]:block"
                dangerouslySetInnerHTML={{
                  __html: sanitizeDangerousHtml(activeArticle.contentHtml || `<p>${activeArticle.excerpt}</p>`),
                }}
              />

              {/* Banner de Encerramento com CTA para Automação Adaptado ao Mobile */}
              <div className="mt-8 sm:mt-12 p-5 sm:p-8 rounded-2xl bg-gradient-to-br from-red-950/40 via-black to-neutral-900 border border-red-500/30 flex flex-col sm:flex-row items-center justify-between gap-5 sm:gap-6">
                <div className="space-y-2 text-center sm:text-left">
                  <span className="text-[10px] font-mono text-red-400 uppercase tracking-widest font-bold">
                    QUER APLICAR ESTE CONHECIMENTO?
                  </span>
                  <h4 className="text-base sm:text-lg font-bold text-white">
                    Implemente esta solução sob medida com Mateus Celestino Pro
                  </h4>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Consultoria de hiperautomação, agentes com IA e arquitetura corporativa.
                  </p>
                </div>

                <a
                  href="/contato"
                  className="w-full sm:w-auto shrink-0"
                >
                  <Button variant="fired" size="md" className="w-full sm:w-auto min-h-[44px] gap-2 justify-center">
                    <MessageSquare className="w-4 h-4" />
                    <span>Solicitar Atendimento</span>
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
