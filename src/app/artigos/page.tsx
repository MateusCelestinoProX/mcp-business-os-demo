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
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-10 xl:px-16 w-full space-y-12 relative overflow-hidden">
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
      <section className="text-center space-y-4 pt-4 pb-2 relative z-10">

        <div className="inline-flex items-center gap-2">
          <Badge variant="red" dot className="py-1 px-3">
            ACERVO EDITORIAL SOBERANO • 176 GUIAS PRÁTICOS
          </Badge>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight">
          Conhecimento Profundo em{" "}
          <span className="text-gradient-neon">Automação, IA & Engenharia</span>
        </h1>

        <p className="text-neutral-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          Explore o arquivo completo com 176 artigos técnicos, manuais operacionais de n8n,
          workflows agentivos, infraestrutura de software e estratégias de negócios por Mateus
          Celestino.
        </p>

        {/* Barra de Pesquisa Cinemática */}
        <div className="max-w-xl mx-auto pt-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Buscar por tópicos, ferramentas (n8n, IA, Docker, LLMs)..."
              className="glass-input w-full rounded-2xl pl-11 pr-4 py-3.5 text-sm sm:text-base placeholder:text-neutral-500 shadow-xl"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-white px-2 py-1 rounded bg-white/10"
              >
                Limpar
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Categorias & Contadores */}
      <section className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.slug;
          return (
            <button
              key={cat.slug}
              onClick={() => handleCategoryChange(cat.slug)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
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
      </section>

      {/* Status da Filtragem */}
      <div className="flex items-center justify-between text-xs text-neutral-400 px-2">
        <span>
          Mostrando <strong className="text-white">{filteredArticles.length}</strong> artigos
          {searchQuery && ` para a busca "${searchQuery}"`}
        </span>
        <span>
          Página <strong className="text-white">{currentPage}</strong> de{" "}
          <strong className="text-white">{totalPages}</strong>
        </span>
      </div>

      {/* Grid de Artigos */}
      {paginatedArticles.length === 0 ? (
        <GlassCard variant="crystal" className="p-16 text-center space-y-4">
          <BookOpen className="w-12 h-12 text-neutral-600 mx-auto" />
          <h3 className="text-xl font-bold text-white">Nenhum artigo encontrado</h3>
          <p className="text-neutral-400 text-sm max-w-md mx-auto">
            Não encontramos nenhum artigo correspondente à sua busca. Tente buscar por outros
            termos ou alterne as categorias.
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("all");
            }}
          >
            Redefinir Filtros
          </Button>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedArticles.map((article) => {
            const isAI = article.category.toUpperCase().includes("INTELIGÊNCIA ARTIFICIAL");
            const isTool = article.category.toUpperCase().includes("FERRAMENTAS");
            const isLinux = article.category.toUpperCase().includes("LINUX");

            return (
              <Link
                key={article.id}
                href={`/artigos/${article.slug}`}
                className="group block h-full focus:outline-none"
              >
                <GlassCard
                  variant="interactive"
                  className="h-full flex flex-col justify-between overflow-hidden p-0 border border-white/10 group-hover:border-red-500/40 transition-all duration-300"
                >
                  {/* Capa com Badge */}
                  <div className="relative aspect-video w-full overflow-hidden bg-neutral-900 border-b border-white/10">
                    <img
                      src={article.coverImage || "/assets/recursos_cover.webp"}
                      alt={article.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        // Fallback suave
                        (e.target as HTMLImageElement).src = "/assets/recursos_cover.webp";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <Badge
                        variant={isAI ? "red" : isTool ? "gold" : isLinux ? "success" : "default"}
                        className="text-[10px] py-0.5"
                      >
                        {article.category}
                      </Badge>
                    </div>

                    <div className="absolute bottom-3 right-3 flex items-center gap-1 text-[11px] font-mono text-neutral-300 bg-black/60 px-2 py-0.5 rounded-md backdrop-blur-md">
                      <Clock className="w-3 h-3 text-red-400" />
                      <span>{article.readingTime || "5 min"}</span>
                    </div>
                  </div>

                  {/* Conteúdo do Card */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <h2 className="text-base sm:text-lg font-bold text-white group-hover:text-red-400 transition-colors line-clamp-2 leading-snug">
                        {article.title}
                      </h2>
                      <p className="text-neutral-400 text-xs sm:text-sm line-clamp-3 leading-relaxed">
                        {article.excerpt}
                      </p>
                    </div>

                    {/* Footer do Card */}
                    <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-neutral-400">
                      <div className="flex items-center gap-2">
                        <img
                          src="/assets/mateus_avatar.webp"
                          alt="Mateus Celestino"
                          className="w-5 h-5 rounded-full object-cover border border-red-500/40"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = "none";
                          }}
                        />
                        <span className="font-medium text-neutral-300">Mateus Celestino</span>
                      </div>

                      <span className="flex items-center gap-1 text-red-400 font-semibold group-hover:translate-x-1 transition-transform">
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

      {/* Controles de Paginação */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="gap-1 flex items-center"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Anterior</span>
          </Button>

          <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-neutral-300">
            <span>{currentPage}</span>
            <span className="text-neutral-600">/</span>
            <span>{totalPages}</span>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="gap-1 flex items-center"
          >
            <span>Próxima</span>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* CTA de Rodapé */}
      <section className="pt-12">
        <GlassCard variant="ultra" className="text-center p-8 sm:p-12 space-y-6 max-w-4xl mx-auto">
          <Badge variant="gold" dot>
            ACESSO COMPLETO & COMUNIDADE FECHADA
          </Badge>
          <h3 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Quer colocar esses artigos em prática com suporte direto?
          </h3>
          <p className="text-neutral-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Na Comunidade Soberana de Mateus Celestino Pro, você tem acesso a pipelines prontos de
            n8n, prompts refinados e o cofre com 406 códigos e blueprints executáveis.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-2">
            <Link href="/comunidade">
              <Button variant="primary" size="lg" className="gap-2">
                <Sparkles className="w-4 h-4" />
                <span>Explorar a Comunidade PRO</span>
              </Button>
            </Link>
            <Link href="/#contato">
              <Button variant="outline" size="lg">
                Falar com Mateus Celestino
              </Button>
            </Link>
          </div>
        </GlassCard>
      </section>
    </div>
  );
}
