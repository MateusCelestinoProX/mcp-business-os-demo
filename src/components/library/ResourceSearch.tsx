"use client";

import React, { useState, useEffect } from "react";
import { 
  Search, 
  X, 
  Grid, 
  List, 
  SlidersHorizontal, 
  Sparkles, 
  Filter,
  CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ResourceSearchProps {
  onSearchChange: (query: string) => void;
  onCategoryChange: (category: string) => void;
  onExtChange: (ext: string) => void;
  onViewModeChange: (mode: "grid" | "list") => void;
  selectedCategory: string;
  selectedExt: string;
  viewMode: "grid" | "list";
  totalCount: number;
  filteredCount: number;
  categories: { group: string; count: number }[];
}

export const ResourceSearch: React.FC<ResourceSearchProps> = ({
  onSearchChange,
  onCategoryChange,
  onExtChange,
  onViewModeChange,
  selectedCategory,
  selectedExt,
  viewMode,
  totalCount,
  filteredCount,
  categories,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Debounce de 250ms na busca instantânea
  useEffect(() => {
    const handler = setTimeout(() => {
      onSearchChange(searchTerm);
    }, 250);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm, onSearchChange]);

  const clearSearch = () => {
    setSearchTerm("");
    onSearchChange("");
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    onSearchChange("");
    onCategoryChange("Todos");
    onExtChange("all");
  };

  const hasActiveFilters = 
    searchTerm.trim().length > 0 || 
    (selectedCategory && selectedCategory !== "Todos") || 
    (selectedExt && selectedExt !== "all");

  const extFilters = [
    { label: "Todos Formatos", value: "all" },
    { label: "PDF", value: ".pdf" },
    { label: "Markdown", value: ".md" },
    { label: "Prompt / TXT", value: ".txt" },
    { label: "APK Android", value: ".apk" },
    { label: "DOCX", value: ".docx" },
    { label: "HTML", value: ".html" },
  ];

  return (
    <div className="space-y-5 mb-8">
      {/* Top Search Bar & View Mode Toggle */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        {/* Instant Search Input */}
        <div className="relative flex-1 w-full">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-400">
            <Search className="w-5 h-5 group-focus-within:text-red-400 transition-colors" />
          </div>

          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por prompt, estilo visual, capítulo, código, formato ou palavra-chave..."
            className="w-full pl-11 pr-10 py-3.5 rounded-xl glass-input text-sm md:text-base font-normal placeholder:text-neutral-400 text-white focus:outline-none focus:ring-1 focus:ring-red-500/50 transition-all"
          />

          {searchTerm && (
            <button
              onClick={clearSearch}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-neutral-400 hover:text-white transition-colors"
              title="Limpar busca"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/[0.04] border border-white/10 self-end sm:self-auto flex-shrink-0">
          <button
            onClick={() => onViewModeChange("grid")}
            className={cn(
              "p-2.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5",
              viewMode === "grid"
                ? "bg-red-500/20 text-white border border-red-500/40 shadow-[0_0_15px_rgba(255,7,58,0.2)]"
                : "text-neutral-400 hover:text-white"
            )}
            title="Visualização em Grade"
          >
            <Grid className="w-4 h-4" />
            <span className="hidden md:inline">Grade</span>
          </button>
          <button
            onClick={() => onViewModeChange("list")}
            className={cn(
              "p-2.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5",
              viewMode === "list"
                ? "bg-red-500/20 text-white border border-red-500/40 shadow-[0_0_15px_rgba(255,7,58,0.2)]"
                : "text-neutral-400 hover:text-white"
            )}
            title="Visualização em Lista"
          >
            <List className="w-4 h-4" />
            <span className="hidden md:inline">Lista</span>
          </button>
        </div>
      </div>

      {/* Category Pills Filters */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-neutral-400 px-1">
          <span className="flex items-center gap-1.5 uppercase tracking-wider font-mono text-[11px]">
            <Filter className="w-3.5 h-3.5 text-red-400" />
            Filtrar por Categoria
          </span>
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="text-red-400 hover:text-red-300 transition-colors text-xs flex items-center gap-1"
            >
              <X className="w-3 h-3" />
              Limpar Filtros
            </button>
          )}
        </div>

        {/* Categories Horizontal Scroll / Flex */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none no-scrollbar">
          <button
            onClick={() => onCategoryChange("Todos")}
            className={cn(
              "px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all select-none border",
              selectedCategory === "Todos"
                ? "bg-red-500 text-white border-red-400 shadow-[0_0_15px_rgba(255,7,58,0.4)]"
                : "bg-white/[0.04] text-neutral-400 hover:text-white border-white/10 hover:border-white/20"
            )}
          >
            Todos ({totalCount})
          </button>

          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.group;
            return (
              <button
                key={cat.group}
                onClick={() => onCategoryChange(cat.group)}
                className={cn(
                  "px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all select-none border flex items-center gap-1.5",
                  isSelected
                    ? "bg-red-500 text-white border-red-400 shadow-[0_0_15px_rgba(255,7,58,0.4)]"
                    : "bg-white/[0.04] text-neutral-400 hover:text-white border-white/10 hover:border-white/20"
                )}
              >
                <span>{cat.group}</span>
                <span className={cn(
                  "text-[10px] px-1.5 py-0.2 rounded-full",
                  isSelected ? "bg-white/20 text-white" : "bg-white/5 text-neutral-400"
                )}>
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Extension Filters & Results Counter */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1 border-t border-white/5">
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 scrollbar-none">
          <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider mr-1">
            Formato:
          </span>
          {extFilters.map((fmt) => (
            <button
              key={fmt.value}
              onClick={() => onExtChange(fmt.value)}
              className={cn(
                "px-2.5 py-1 rounded-md text-[11px] font-mono transition-all border",
                selectedExt === fmt.value
                  ? "bg-white/20 text-white border-white/40"
                  : "bg-white/[0.02] text-neutral-400 hover:text-white border-white/5 hover:border-white/10"
              )}
            >
              {fmt.label}
            </button>
          ))}
        </div>

        {/* Counter Info */}
        <div className="text-xs text-neutral-400 font-mono flex items-center gap-2 self-end sm:self-auto">
          <span>
            Exibindo <strong className="text-white font-semibold">{filteredCount}</strong> de{" "}
            <strong>{totalCount}</strong> recursos
          </span>
          {filteredCount < totalCount && (
            <span className="inline-block w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          )}
        </div>
      </div>
    </div>
  );
};
