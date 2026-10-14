'use client';

import React, { useState, useMemo } from 'react';
import { Search, Clock, ArrowUpRight, Sparkles, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';
import RippleGridShader from '@/components/shaders/RippleGridShader';
import { ArticleData } from './ArticleModal';

export interface CategoryItem {
  name: string;
  slug: string;
  count: number;
}

export interface MainNotionLayoutProps {
  articles: ArticleData[];
  categories?: CategoryItem[];
  profile?: any;
  onSelectArticle: (article: ArticleData) => void;
  searchInputRef?: React.RefObject<HTMLInputElement | null>;
}

export function MainNotionLayout({
  articles,
  categories,
  profile,
  onSelectArticle,
  searchInputRef,
}: MainNotionLayoutProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // 6 cards essenciais e curados por página (2 linhas x 3 colunas)

  // Filtragem precisa dos 176 artigos originais
  const filteredArticles = useMemo(() => {
    return articles.filter((art) => {
      const matchSearch =
        !searchTerm ||
        art.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        art.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        art.category.toLowerCase().includes(searchTerm.toLowerCase());

      let matchCat = true;
      if (selectedCategory !== 'all') {
        const catUpper = (art.category || '').toUpperCase();
        if (selectedCategory === 'ia') {
          matchCat = catUpper.includes('INTELIGÊNCIA') || catUpper.includes('IA');
        } else if (selectedCategory === 'ferramentas') {
          matchCat = catUpper.includes('FERRAMENTAS');
        } else if (selectedCategory === 'business') {
          matchCat = catUpper.includes('BUSINESS');
        } else if (selectedCategory === 'linux') {
          matchCat = catUpper.includes('LINUX');
        }
      }

      return matchSearch && matchCat;
    });
  }, [articles, searchTerm, selectedCategory]);

  const totalPages = Math.ceil(filteredArticles.length / itemsPerPage) || 1;
  const paginatedArticles = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredArticles.slice(start, start + itemsPerPage);
  }, [filteredArticles, currentPage]);

  const handleCategorySelect = (slug: string) => {
    setSelectedCategory(slug);
    setCurrentPage(1);
  };

  return (
    <section id="publicacoes" className="py-12 w-full relative overflow-hidden">
      {/* SHADER 2: RippleGrid (Personal OS - Energetic Fired Neon Blaster Red) */}
      <RippleGridShader
        className="z-0 mix-blend-screen"
        gridColor="#ff073a"
        rippleIntensity={0.07}
        gridSize={13.0}
        glowIntensity={0.32}
        opacity={0.45}
      />

      {/* Zonas de Transição Internas com Blur e Escurecimento Progressivo */}
      <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-black via-black/85 to-transparent pointer-events-none z-1 backdrop-blur-[6px]" />
      <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-black via-black/85 to-transparent pointer-events-none z-1 backdrop-blur-[6px]" />
      
      {/* =========================================================================
          FULL-SCREEN MINIMALIST BLOG & GALLERY CONTAINER
          ========================================================================= */}
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 relative z-10">
        
        {/* Barra de Controle Horizontal Minimalista em Vidro Líquido */}
        <div className="glass-crystal p-6 sm:p-8 rounded-3xl mb-8 border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.85)]">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-white/[0.08]">
            
            {/* Título & Badge Minimalista */}
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ff073a] shadow-[0_0_12px_#ff073a] animate-pulse" />
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight uppercase">
                  PUBLICAÇÕES & GUIAS TÉCNICOS
                </h2>
                <span className="px-3 py-1 rounded-full glass-pill text-xs font-mono font-bold text-[#ff073a] border border-[#ff073a]/30">
                  {filteredArticles.length} GUIAS
                </span>
                <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass-pill text-[10px] font-mono font-bold text-[#ff073a] border border-[#ff073a]/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ff073a] shadow-[0_0_8px_#ff073a] animate-ping" />
                  SHADER 02: RIPPLE GRID
                </span>
              </div>
              <p className="text-xs sm:text-sm text-zinc-400 font-light mt-1.5">
                Galeria imersiva de artigos sobre automação avançada, n8n, Typebot, IA generativa e infraestrutura Linux.
              </p>
            </div>

            {/* Barra de Pesquisa Minimalista em Vidro */}
            <div className="relative w-full lg:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#ff073a]" />
              <input
                ref={searchInputRef as any}
                type="text"
                placeholder="Pesquisar artigos por título, tecnologia ou tema... (⌘K)"
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                className="w-full pl-11 pr-12 py-3 rounded-2xl glass-input text-white text-xs sm:text-sm placeholder-zinc-500 transition-all font-sans"
              />
              {searchTerm && (
                <button
                  onClick={() => { setSearchTerm(''); setCurrentPage(1); }}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] font-mono text-zinc-400 hover:text-white px-2 py-0.5 rounded-md bg-white/10 cursor-pointer"
                >
                  Limpar
                </button>
              )}
            </div>

          </div>

          {/* Dock Horizontal de Categorias (Filtros em Pílulas de Cristal) */}
          <div className="pt-6 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full scrollbar-none">
              <button
                onClick={() => handleCategorySelect('all')}
                className={`px-4 py-2 rounded-2xl text-xs font-mono font-bold flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
                  selectedCategory === 'all'
                    ? 'glass-button-fired text-white shadow-xl scale-[1.02]'
                    : 'glass-pill text-zinc-400 hover:text-white hover:border-white/30'
                }`}
              >
                <span>TODOS</span>
                <span className={`px-2 py-0.5 rounded-lg text-[10px] ${
                  selectedCategory === 'all' ? 'bg-black/40 text-white' : 'glass-pill-red text-[#ff073a]'
                }`}>
                  {articles.length}
                </span>
              </button>

              {categories && categories.filter(c => c.slug !== 'all').map((cat) => {
                const isSelected = selectedCategory === cat.slug;
                return (
                  <button
                    key={cat.slug}
                    onClick={() => handleCategorySelect(cat.slug)}
                    className={`px-4 py-2 rounded-2xl text-xs font-mono font-bold flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
                      isSelected
                        ? 'glass-button-fired text-white shadow-xl scale-[1.02]'
                        : 'glass-pill text-zinc-400 hover:text-white hover:border-white/30'
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span className={`px-2 py-0.5 rounded-lg text-[10px] ${
                      isSelected ? 'bg-black/40 text-white' : 'glass-pill-red text-[#ff073a]'
                    }`}>
                      {cat.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Aviso Sutil LEIA-ME em Vidro */}
            <div className="hidden xl:flex items-center gap-2 text-[11px] font-mono text-zinc-400">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff073a]" />
              <span>Clique no card para abrir o leitor editorial de cinema</span>
            </div>
          </div>
        </div>

        {/* =========================================================================
            GRADE GALERIA FULL-SCREEN EM CARDS DE ULTRA LUXO (3 COLUNAS)
            ========================================================================= */}
        {paginatedArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {paginatedArticles.map((art) => (
              <article
                key={art.id}
                onClick={() => onSelectArticle(art)}
                className="glass-card-luxury flex flex-col justify-between cursor-pointer group"
              >
                {/* Top: Imagem de Capa Full Bleed com Fusão de Vidro */}
                <div>
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-black">
                    <img
                      src={art.coverImage || '/assets/hero_cover.webp'}
                      alt={art.title}
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                      loading="lazy"
                    />
                    
                    {/* Gradiente de Fusão na Base da Imagem com o Vidro */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/30 to-transparent opacity-90" />
                    
                    {/* Linha de Refração Especular na Foto */}
                    <div className="absolute inset-0 border-b border-white/10" />

                    {/* Tag de Categoria Flutuante de Cristal */}
                    <div className="absolute top-3 left-3 z-10">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl glass-pill-red text-[10px] font-mono font-bold text-[#ff073a] shadow-lg backdrop-blur-md border border-[#ff073a]/40">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#ff073a] shadow-[0_0_6px_#ff073a]" />
                        {art.category}
                      </span>
                    </div>

                    {/* Badge de Tempo de Leitura Flutuante */}
                    <div className="absolute top-3 right-3 z-10">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl glass-pill text-[10px] font-mono text-zinc-300 shadow-lg backdrop-blur-md border border-white/20">
                        <Clock className="w-3 h-3 text-[#ff073a]" />
                        {art.readingTime || 5} min
                      </span>
                    </div>
                  </div>

                  {/* Conteúdo Textual com Tipografia Nobre */}
                  <div className="p-5 sm:p-6">
                    <h3 className="font-bold text-base sm:text-lg text-white group-hover:text-[#ff073a] transition-colors duration-300 leading-snug line-clamp-2 tracking-tight">
                      {art.title}
                    </h3>

                    <p className="mt-2.5 text-xs sm:text-sm text-zinc-400 font-light line-clamp-2 leading-relaxed">
                      {art.excerpt}
                    </p>
                  </div>
                </div>

                {/* Bottom: Micro-Dock de Ação e Metadados do Card */}
                <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-2">
                  <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-zinc-800 border border-white/20 flex items-center justify-center overflow-hidden">
                        <span className="text-[9px] font-mono text-[#ff073a] font-bold">MC</span>
                      </div>
                      <span className="text-[11px] font-mono text-zinc-400">
                        {art.createdAt || 'Mateus Celestino'}
                      </span>
                    </div>

                    {/* Botão Tátil de Ação em Vidro com Ícone com Efeito */}
                    <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#ff073a] group-hover:text-white transition-colors">
                      <span className="text-[11px] uppercase tracking-wider">Ler Guia</span>
                      <div className="w-6 h-6 rounded-lg glass-pill flex items-center justify-center group-hover:bg-[#ff073a] group-hover:text-white group-hover:border-[#ff073a] transition-all">
                        <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          /* Estado Vazio de Busca */
          <div className="glass-crystal p-12 rounded-3xl text-center max-w-xl mx-auto my-12">
            <BookOpen className="w-12 h-12 text-[#ff073a] mx-auto mb-4 opacity-80" />
            <h3 className="text-xl font-bold text-white mb-2">Nenhum artigo encontrado</h3>
            <p className="text-xs font-mono text-zinc-400 mb-6">
              Não encontramos nenhuma publicação para o termo "{searchTerm}". Tente buscar por palavras-chave mais genéricas como "n8n", "IA", "Docker" ou "Linux".
            </p>
            <button
              onClick={() => { setSearchTerm(''); setSelectedCategory('all'); }}
              className="glass-button-fired px-6 py-2.5 rounded-2xl text-xs font-mono font-bold text-white cursor-pointer"
            >
              Resetar Filtros
            </button>
          </div>
        )}

        {/* =========================================================================
            BARRA DE PAGINAÇÃO EM VIDRO LÍQUIDO
            ========================================================================= */}
        {totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2.5 rounded-xl glass-crystal border border-white/10 text-zinc-300 disabled:opacity-30 disabled:pointer-events-none hover:text-white hover:border-[#ff073a]/40 transition-all cursor-pointer"
              title="Página Anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-1.5 px-3 py-1 rounded-2xl glass-crystal border border-white/10">
              {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                let pageNumber = i + 1;
                if (totalPages > 7) {
                  if (currentPage > 4) {
                    pageNumber = currentPage - 3 + i;
                    if (pageNumber > totalPages) pageNumber = totalPages - (6 - i);
                  }
                }
                const isActive = currentPage === pageNumber;
                return (
                  <button
                    key={pageNumber}
                    onClick={() => setCurrentPage(pageNumber)}
                    className={`w-8 h-8 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                      isActive
                        ? 'glass-button-fired text-white shadow-lg scale-105'
                        : 'text-zinc-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2.5 rounded-xl glass-crystal border border-white/10 text-zinc-300 disabled:opacity-30 disabled:pointer-events-none hover:text-white hover:border-[#ff073a]/40 transition-all cursor-pointer"
              title="Próxima Página"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </section>
  );
}

export default MainNotionLayout;
