"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  BookOpen,
  Clock,
  Sparkles,
  ArrowRight,
  Filter,
  Flame,
  ChevronLeft,
  ChevronRight,
  Layers,
} from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { getAllArticles, getCategoriesWithCounts, Article } from "@/lib/articles";
import RippleGridShader from "@/components/shaders/RippleGridShader";

const ITEMS_PER_PAGE = 12;

export default function ArtigosPortalPage() {
  const allArticles = useMemo(() => getAllArticles(), []);
  const categories = useMemo(() => getCategoriesWithCounts(), []);

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Filtragem combinada por categoria e termo de busca
  const filteredArticles = useMemo(() => {
    return allArticles.filter((article) => {
      // Filtro de categoria
      const matchesCategory =
        selectedCategory === "all" ||
        (selectedCategory === "ia" &&
          (article.category.toUpperCase().includes("INTELIGÊNCIA ARTIFICIAL") ||
            article.category.toUpperCase().includes("IA"))) ||
        (selectedCategory === "ferramentas" &&
          article.category.toUpperCase().includes("FERRAMENTAS")) ||
        (selectedCategory === "business" &&
          article.category.toUpperCase().includes("BUSINESS")) ||
        (selectedCategory === "linux" &&
          article.category.toUpperCase().includes("LINUX"));

      // Filtro de busca textual
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        article.title.toLowerCase().includes(q) ||
        article.excerpt.toLowerCase().includes(q) ||
        article.category.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [allArticles, selectedCategory, searchQuery]);

  // Paginação
  const totalPages = Math.ceil(filteredArticles.length / ITEMS_PER_PAGE) || 1;
  const paginatedArticles = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredArticles.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredArticles, currentPage]);

  const handleCategoryChange = (slug: string) => {
    setSelectedCategory(slug);
    setCurrentPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen py-6 sm:py-10 px-4 sm:px-6 lg:px-10 xl:px-16 w-full space-y-8 sm:space-y-12 relative overflow-hidden">
      {/* Shader WebGL do Acervo de Artigos: RippleGrid */}
      <RippleGridShader
        className="z-0 mix-blend-screen pointer-events-none"
        gridColor="#ff073a"
        rippleIntensity={0.06}
        gridSize={18.0}
        glowIntensity={0.25}
        opacity={0.3}
      />

      {/* Header do Acervo */}
      <section className="text-center space-y-4 pt-2 sm:pt-4 pb-2 relative z-10">

        <div className="inline-flex items-center gap-2">
          <Badge variant="red" dot className="py-1 px-3 text-[11px] sm:text-xs">
            ACERVO EDITORIAL SOBERANO • 176 GUIAS PRÁTICOS
          </Badge>
        </div>

        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight break-words">
          Conhecimento Profundo em{" "}
          <span className="text-gradient-neon">Automação, IA & Engenharia</span>
        </h1>

        <p className="text-neutral-400 text-xs sm:text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
          Explore o arquivo completo com 176 artigos técnicos, manuais operacionais de n8n,
          workflows agentivos, infraestrutura de software e estratégias de negócios por Mateus
          Celestino.
        </p>

        {/* Barra de Pesquisa Cinemática Touch-Friendly */}
        <div className="max-w-xl mx-auto pt-2 sm:pt-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Buscar tópicos, ferramentas (n8n, IA, Docker, LLMs)..."
              className="glass-input w-full rounded-2xl pl-11 pr-14 sm:pr-16 py-3 sm:py-3.5 min-h-[44px] text-xs sm:text-sm placeholder:text-neutral-500 shadow-xl outline-none focus:border-red-500/50"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-mono text-neutral-400 hover:text-white px-2.5 py-1 rounded-lg bg-white/10 min-h-[30px] flex items-center justify-center cursor-pointer touch-manipulation active:scale-95"
              >
                Limpar
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Categorias & Contadores com Scroll Horizontal Touch no Mobile */}
      <div className="relative max-w-full overflow-hidden">
        <div className="flex items-center sm:justify-center gap-2 sm:gap-3 overflow-x-auto sm:flex-wrap pb-2 pt-1 sm:pb-0 no-scrollbar overscroll-x-contain touch-pan-x [-webkit-overflow-scrolling:touch] px-1 sm:px-0">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.slug;
            return (
              <button
                key={cat.slug}
                onClick={() => handleCategoryChange(cat.slug)}
                className={`min-h-[44px] flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer shrink-0 whitespace-nowrap touch-manipulation active:scale-95 ${
                  isActive
                    ? "bg-red-600/30 text-white border border-red-500/60 shadow-[0_0_20px_rgba(255,7,58,0.35)]"
                    : "glass-pill text-neutral-400 hover:text-white hover:border-white/20"
                }`}
              >
                <span>{cat.name}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                    isActive ? "bg-red-500 text-white" : "bg-white/10 text-neutral-400"
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Status da Filtragem */}
      <div className="flex items-center justify-between text-[11px] sm:text-xs text-neutral-400 px-1 sm:px-2 gap-2">
        <span className="truncate">
          Mostrando <strong className="text-white">{filteredArticles.length}</strong> artigos
          {searchQuery && ` para "${searchQuery}"`}
        </span>
        <span className="shrink-0 font-mono">
          Pág <strong className="text-white">{currentPage}</strong> de{" "}
          <strong className="text-white">{totalPages}</strong>
        </span>
      </div>

      {/* Grid de Artigos: 1 Coluna no Mobile, 2 no Tablet, 3 no Desktop */}
      {paginatedArticles.length === 0 ? (
        <GlassCard variant="crystal" className="p-8 sm:p-16 text-center space-y-4 rounded-2xl sm:rounded-3xl">
          <BookOpen className="w-10 h-10 sm:w-12 sm:h-12 text-neutral-600 mx-auto" />
          <h3 className="text-lg sm:text-xl font-bold text-white">Nenhum artigo encontrado</h3>
          <p className="text-neutral-400 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
            Não encontramos nenhum artigo correspondente à sua busca. Tente buscar por outros
            termos ou alterne as categorias.
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("all");
            }}
            className="min-h-[44px]"
          >
            Redefinir Filtros
          </Button>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {paginatedArticles.map((article) => {
            const isAI = article.category.toUpperCase().includes("INTELIGÊNCIA ARTIFICIAL");
            const isTool = article.category.toUpperCase().includes("FERRAMENTAS");
            const isLinux = article.category.toUpperCase().includes("LINUX");

            return (
              <Link
                key={article.id}
                href={`/artigos/${article.slug}`}
                className="group block h-full focus:outline-none touch-manipulation"
              >
                <GlassCard
                  variant="interactive"
                  className="h-full flex flex-col justify-between overflow-hidden p-0 rounded-2xl border border-white/10 group-hover:border-red-500/40 transition-all duration-300"
                >
                  {/* Capa com Proporção Consistente e Badge Alinhado */}
                  <div className="relative aspect-[16/10] sm:aspect-video w-full overflow-hidden bg-neutral-900 border-b border-white/10 shrink-0">
                    <img
                      src={article.coverImage || "/assets/recursos_cover.webp"}
                      alt={article.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/assets/recursos_cover.webp";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
                      <Badge
                        variant={isAI ? "red" : isTool ? "gold" : isLinux ? "success" : "default"}
                        className="text-[10px] py-0.5 max-w-[70%] truncate"
                      >
                        {article.category}
                      </Badge>

                      <div className="flex items-center gap-1 text-[10px] sm:text-[11px] font-mono text-neutral-300 bg-black/70 px-2 py-0.5 rounded-md backdrop-blur-md border border-white/10 shrink-0">
                        <Clock className="w-3 h-3 text-red-400 shrink-0" />
                        <span>{article.readingTime || "5 min"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Conteúdo do Card */}
                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3 sm:space-y-4">
                    <div className="space-y-2">
                      <h2 className="text-base sm:text-lg font-bold text-white group-hover:text-red-400 transition-colors line-clamp-2 leading-snug break-words">
                        {article.title}
                      </h2>
                      <p className="text-neutral-400 text-xs sm:text-sm line-clamp-3 leading-relaxed break-words">
                        {article.excerpt}
                      </p>
                    </div>

                    {/* Footer do Card */}
                    <div className="pt-3.5 border-t border-white/10 flex items-center justify-between text-xs text-neutral-400">
                      <div className="flex items-center gap-2 min-w-0">
                        <img
                          src="/assets/mateus_avatar.webp"
                          alt="Mateus Celestino"
                          className="w-5 h-5 rounded-full object-cover border border-red-500/40 shrink-0"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = "none";
                          }}
                        />
                        <span className="font-medium text-neutral-300 text-xs truncate">Mateus Celestino</span>
                      </div>

                      <span className="flex items-center gap-1 text-red-400 font-semibold group-hover:translate-x-1 transition-transform shrink-0">
                        <span>Ler</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </GlassCard>
              </Link>
            );
          })}
        </div>
      )}

      {/* Controles de Paginação Touch-Friendly */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4 sm:pt-6 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="min-h-[44px] min-w-[44px] gap-1 flex items-center touch-manipulation active:scale-95"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden xs:inline">Anterior</span>
          </Button>

          <div className="flex items-center gap-1 px-3 py-2 min-h-[44px] rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-neutral-300">
            <span>{currentPage}</span>
            <span className="text-neutral-600">/</span>
            <span>{totalPages}</span>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="min-h-[44px] min-w-[44px] gap-1 flex items-center touch-manipulation active:scale-95"
          >
            <span className="hidden xs:inline">Próxima</span>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* CTA de Rodapé Responsivo */}
      <section className="pt-8 sm:pt-12">
        <GlassCard variant="ultra" className="text-center p-6 sm:p-10 lg:p-12 space-y-5 sm:space-y-6 max-w-4xl mx-auto rounded-2xl sm:rounded-3xl">
          <Badge variant="gold" dot className="text-xs">
            ACESSO COMPLETO & COMUNIDADE FECHADA
          </Badge>
          <h3 className="text-xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight break-words">
            Quer colocar esses artigos em prática com suporte direto?
          </h3>
          <p className="text-neutral-300 text-xs sm:text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            Na Comunidade Soberana de Mateus Celestino Pro, você tem acesso a pipelines prontos de
            n8n, prompts refinados e o cofre com 406 códigos e blueprints executáveis.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center pt-2">
            <Link href="/comunidade" className="w-full sm:w-auto">
              <Button variant="primary" size="lg" className="w-full sm:w-auto min-h-[44px] gap-2 justify-center">
                <Sparkles className="w-4 h-4" />
                <span>Explorar a Comunidade PRO</span>
              </Button>
            </Link>
            <Link href="/#contato" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto min-h-[44px] justify-center">
                Falar com Mateus Celestino
              </Button>
            </Link>
          </div>
        </GlassCard>
      </section>
    </div>
  );
}
