'use client';

import React, { useState, useMemo } from 'react';
import { Search, Clock, ArrowUpRight, Sparkles, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';
import { ArticleData } from './ArticleModal';
import RippleGridShader from '../shaders/RippleGridShader';

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
      {/* 0. Shader WebGL Dedicado da Sessão Publicações: RippleGrid Encorpado */}
      <RippleGridShader
        className="z-0 mix-blend-screen pointer-events-none"
        gridColor="#ff073a"
        rippleIntensity={0.085}
        gridSize={14.0}
        glowIntensity={0.45}
        opacity={0.60}
      />

      {/* Cyber Dot-Grid Sutil de Alta Fidelidade */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: 'radial-gradient(rgba(255, 7, 58, 0.4) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />
      
      {/* =========================================================================
          FULL-SCREEN MINIMALIST BLOG & GALLERY CONTAINER (LARGURA TOTAL E COMPLETA)
          ========================================================================= */}
      <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-16 relative z-10">

        
        {/* Barra de Controle Horizontal Minimalista em Vidro Líquido */}
        <div className="glass-crystal p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl mb-8 border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.85)]">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-5 sm:gap-6 pb-6 border-b border-white/[0.08]">
            
            {/* Título & Contador Minimalista */}
            <div>
              <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#9e0015] shadow-[0_0_12px_#9e0015] animate-pulse shrink-0" />
                <h2 className="text-lg sm:text-2xl lg:text-3xl font-black text-white tracking-tight uppercase">
                  PUBLICAÇÕES & GUIAS TÉCNICOS
                </h2>
                <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full glass-pill text-xs font-mono font-bold text-[#a80018] border border-[#a80018]/30 shrink-0">
                  {filteredArticles.length} GUIAS
                </span>
              </div>
              <p className="text-xs sm:text-sm text-zinc-400 font-light mt-1.5 leading-relaxed">
                Galeria imersiva de artigos sobre automação avançada, n8n, Typebot, IA generativa e infraestrutura Linux.
              </p>
            </div>

            {/* Barra de Pesquisa Minimalista em Vidro Touch-Friendly */}
            <div className="relative w-full lg:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#ff073a] pointer-events-none" />
              <input
                ref={searchInputRef as any}
                type="text"
                placeholder="Pesquisar artigos por título ou tema..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                className="w-full pl-11 pr-16 py-3 min-h-[44px] rounded-2xl glass-input text-white text-xs sm:text-sm placeholder-zinc-500 transition-all font-sans outline-none focus:border-[#ff073a]/50"
              />
              {searchTerm && (
                <button
                  onClick={() => { setSearchTerm(''); setCurrentPage(1); }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono text-zinc-400 hover:text-white px-2.5 py-1 rounded-lg bg-white/10 active:bg-white/20 transition-colors cursor-pointer touch-manipulation min-h-[30px]"
                >
                  Limpar
                </button>
              )}
            </div>

          </div>

          {/* Dock Horizontal de Categorias (Filtros em Pílulas de Cristal com Scroll Touch Suave) */}
          <div className="pt-5 sm:pt-6 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1 max-w-full scrollbar-none overscroll-x-contain -mx-1 px-1 touch-pan-x [-webkit-overflow-scrolling:touch]">
              <button
                onClick={() => handleCategorySelect('all')}
                className={`min-h-[40px] px-3.5 sm:px-4 py-2 rounded-xl sm:rounded-2xl text-xs font-mono font-bold flex items-center gap-2 transition-all shrink-0 whitespace-nowrap cursor-pointer touch-manipulation active:scale-95 ${
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
                    className={`min-h-[40px] px-3.5 sm:px-4 py-2 rounded-xl sm:rounded-2xl text-xs font-mono font-bold flex items-center gap-2 transition-all shrink-0 whitespace-nowrap cursor-pointer touch-manipulation active:scale-95 ${
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
            GRADE GALERIA FULL-SCREEN EM CARDS DE ULTRA LUXO (1 COLUNA NO MOBILE, 2 NO MD, 3 NO LG)
            ========================================================================= */}
        {paginatedArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8">
            {paginatedArticles.map((art) => (
              <article
                key={art.id}
                onClick={() => onSelectArticle(art)}
                className="glass-card-luxury flex flex-col justify-between cursor-pointer group overflow-hidden rounded-2xl sm:rounded-3xl border border-white/10 hover:border-red-500/40 transition-all duration-300 touch-manipulation active:scale-[0.99]"
              >
                {/* Top: Imagem de Capa Full Bleed com Fusão de Vidro */}
                <div>
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-black shrink-0">
                    <img
                      src={art.coverImage || '/assets/hero_cover.webp'}
                      alt={art.title}
                      className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500 ease-out"
                      loading="lazy"
                    />
                    
                    {/* Gradiente de Fusão na Base da Imagem com o Vidro */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/30 to-transparent opacity-90" />
                    
                    {/* Linha de Refração Especular na Foto */}
                    <div className="absolute inset-0 border-b border-white/10 pointer-events-none" />

                    {/* Tag de Categoria Flutuante de Cristal */}
                    <div className="absolute top-3 left-3 z-10 max-w-[65%]">
                      <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-xl glass-pill-red text-[10px] font-mono font-bold text-[#ff073a] shadow-lg border border-[#ff073a]/40 max-w-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#ff073a] shadow-[0_0_6px_#ff073a] shrink-0" />
                        <span className="truncate">{art.category}</span>
                      </span>
                    </div>

                    {/* Badge de Tempo de Leitura Flutuante */}
                    <div className="absolute top-3 right-3 z-10 shrink-0">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl glass-pill text-[10px] font-mono text-zinc-300 shadow-lg border border-white/20">
                        <Clock className="w-3 h-3 text-[#ff073a] shrink-0" />
                        <span>{art.readingTime || 5} min</span>
                      </span>
                    </div>
                  </div>

                  {/* Conteúdo Textual com Tipografia Nobre */}
                  <div className="p-4 sm:p-6">
                    <h3 className="font-bold text-base sm:text-lg text-white group-hover:text-[#ff073a] transition-colors duration-300 leading-snug line-clamp-2 tracking-tight break-words">
                      {art.title}
                    </h3>

                    <p className="mt-2 text-xs sm:text-sm text-zinc-400 font-light line-clamp-2 leading-relaxed break-words">
                      {art.excerpt}
                    </p>
                  </div>
                </div>

                {/* Bottom: Micro-Dock de Ação e Metadados do Card */}
                <div className="px-4 pb-4 sm:px-6 sm:pb-6 pt-1">
                  <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-5 h-5 rounded-full bg-zinc-800 border border-white/20 flex items-center justify-center overflow-hidden shrink-0">
                        <span className="text-[9px] font-mono text-[#ff073a] font-bold">MC</span>
                      </div>
                      <span className="text-[11px] font-mono text-zinc-400 truncate">
                        {art.createdAt || 'Mateus Celestino'}
                      </span>
                    </div>

                    {/* Botão Tátil de Ação em Vidro com Ícone com Efeito */}
                    <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#ff073a] group-hover:text-white transition-colors shrink-0">
                      <span className="text-[11px] uppercase tracking-wider hidden xs:inline">Ler Guia</span>
                      <div className="w-7 h-7 sm:w-6 sm:h-6 rounded-lg glass-pill flex items-center justify-center group-hover:bg-[#ff073a] group-hover:text-white group-hover:border-[#ff073a] transition-all">
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
          <div className="glass-crystal p-6 sm:p-12 rounded-2xl sm:rounded-3xl text-center max-w-xl mx-auto my-8 sm:my-12">
            <BookOpen className="w-10 h-10 sm:w-12 sm:h-12 text-[#ff073a] mx-auto mb-4 opacity-80" />
            <h3 className="text-lg sm:text-xl font-bold text-white mb-2">Nenhum artigo encontrado</h3>
            <p className="text-xs font-mono text-zinc-400 mb-6 leading-relaxed">
              Não encontramos nenhuma publicação para o termo "{searchTerm}". Tente buscar por palavras-chave como "n8n", "IA", "Docker" ou "Linux".
            </p>
            <button
              onClick={() => { setSearchTerm(''); setSelectedCategory('all'); }}
              className="glass-button-fired px-6 py-3 min-h-[44px] rounded-2xl text-xs font-mono font-bold text-white cursor-pointer active:scale-95 transition-all"
            >
              Resetar Filtros
            </button>
          </div>
        )}

        {/* =========================================================================
            BARRA DE PAGINAÇÃO EM VIDRO LÍQUIDO TOUCH-FRIENDLY
            ========================================================================= */}
        {totalPages > 1 && (
          <div className="mt-8 sm:mt-12 flex items-center justify-center gap-2 flex-wrap">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="min-w-[40px] min-h-[40px] p-2.5 rounded-xl glass-crystal border border-white/10 text-zinc-300 disabled:opacity-30 disabled:pointer-events-none hover:text-white hover:border-[#ff073a]/40 transition-all cursor-pointer flex items-center justify-center touch-manipulation active:scale-95"
              title="Página Anterior"
              aria-label="Página Anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 rounded-2xl glass-crystal border border-white/10 max-w-full overflow-x-auto scrollbar-none">
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
                    className={`min-w-[36px] min-h-[36px] w-9 h-9 sm:w-8 sm:h-8 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center justify-center touch-manipulation ${
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
              className="min-w-[40px] min-h-[40px] p-2.5 rounded-xl glass-crystal border border-white/10 text-zinc-300 disabled:opacity-30 disabled:pointer-events-none hover:text-white hover:border-[#ff073a]/40 transition-all cursor-pointer flex items-center justify-center touch-manipulation active:scale-95"
              title="Próxima Página"
              aria-label="Próxima Página"
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
