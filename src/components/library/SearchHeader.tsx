'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  Search,
  X,
  Sparkles,
  Wrench,
  Cpu,
  Smartphone,
  Layers,
  FileText,
  FolderOpen,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { QuickCategory } from '@/lib/library/catalog';

export interface SearchHeaderProps {
  query: string;
  onQueryChange: (q: string) => void;
  selectedCategory: QuickCategory;
  onSelectCategory: (cat: QuickCategory) => void;
  totalFiltered: number;
  totalCatalog: number;
  categoriesCount: Record<QuickCategory, number>;
}

const CATEGORY_ITEMS: { id: QuickCategory; label: string; icon: React.ReactNode }[] = [
  { id: 'Todos', label: 'Todos', icon: <FolderOpen className="w-3.5 h-3.5" /> },
  { id: 'Prompts', label: 'Prompts', icon: <Sparkles className="w-3.5 h-3.5" /> },
  { id: 'Ferramentas', label: 'Ferramentas', icon: <Wrench className="w-3.5 h-3.5" /> },
  { id: 'Blueprints', label: 'Blueprints', icon: <Cpu className="w-3.5 h-3.5" /> },
  { id: 'APKs', label: 'APKs', icon: <Smartphone className="w-3.5 h-3.5" /> },
  { id: 'Materiais', label: 'Materiais', icon: <Layers className="w-3.5 h-3.5" /> },
  { id: 'Documentação', label: 'Documentação', icon: <FileText className="w-3.5 h-3.5" /> },
];

export function SearchHeader({
  query,
  onQueryChange,
  selectedCategory,
  onSelectCategory,
  totalFiltered,
  totalCatalog,
  categoriesCount,
}: SearchHeaderProps) {
  const [localQuery, setLocalQuery] = useState(query);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync external query prop
  useEffect(() => {
    setLocalQuery(query);
  }, [query]);

  // Debounced input change
  useEffect(() => {
    const handler = setTimeout(() => {
      if (localQuery !== query) {
        onQueryChange(localQuery);
      }
    }, 250);

    return () => clearTimeout(handler);
  }, [localQuery, onQueryChange, query]);

  // Keyboard shortcut (⌘K or /) to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      } else if (e.key === '/' && document.activeElement !== inputRef.current) {
        // Only trigger if not already in an input/textarea
        if (
          document.activeElement?.tagName !== 'INPUT' &&
          document.activeElement?.tagName !== 'TEXTAREA'
        ) {
          e.preventDefault();
          inputRef.current?.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleClear = () => {
    setLocalQuery('');
    onQueryChange('');
    inputRef.current?.focus();
  };

  return (
    <div className="w-full space-y-6">
      {/* Search Input Container */}
      <div className="relative group max-w-4xl mx-auto">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600/30 via-white/5 to-red-600/30 rounded-2xl blur-lg opacity-40 group-hover:opacity-75 transition duration-500" />
        
        <div className="relative flex items-center bg-[#0d0d12]/90 border border-white/10 group-hover:border-white/20 rounded-2xl shadow-2xl backdrop-blur-xl transition-all">
          <div className="pl-5 text-neutral-400 group-hover:text-red-400 transition-colors">
            <Search className="w-5 h-5" />
          </div>

          <input
            ref={inputRef}
            type="text"
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
            placeholder="Buscar por títulos, prompts, blueprints, scripts, extensões (.pdf, .apk)..."
            className="w-full py-4 pl-3.5 pr-28 bg-transparent text-white placeholder:text-neutral-500 text-sm md:text-base focus:outline-none"
          />

          <div className="absolute right-3.5 flex items-center gap-2">
            {localQuery ? (
              <button
                onClick={handleClear}
                className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
                title="Limpar busca"
              >
                <X className="w-4 h-4" />
              </button>
            ) : null}

            <div className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-neutral-400 text-xs font-mono select-none">
              <span className="text-[10px]">⌘</span>K
            </div>
          </div>
        </div>
      </div>

      {/* Categories Filter Bar & Stats */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 max-w-6xl mx-auto">
        {/* Dynamic Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full pb-2 md:pb-0 scrollbar-none no-scrollbar">
          {CATEGORY_ITEMS.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            const count = categoriesCount[cat.id] ?? 0;

            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={cn(
                  'inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs md:text-sm font-medium whitespace-nowrap transition-all duration-200 select-none cursor-pointer',
                  isSelected
                    ? 'glass-pill-red text-white border-red-500/50 shadow-[0_0_20px_rgba(255,7,58,0.25)]'
                    : 'bg-white/[0.03] hover:bg-white/[0.08] text-neutral-400 hover:text-white border border-white/5 hover:border-white/15'
                )}
              >
                <span className={cn(isSelected ? 'text-red-400' : 'text-neutral-400')}>
                  {cat.icon}
                </span>
                <span>{cat.label}</span>
                <span
                  className={cn(
                    'text-[11px] px-1.5 py-0.5 rounded-full font-mono',
                    isSelected
                      ? 'bg-red-500/30 text-red-200'
                      : 'bg-white/5 text-neutral-400'
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Counter readout */}
        <div className="text-xs text-neutral-400 font-mono whitespace-nowrap flex items-center gap-2 shrink-0 self-end md:self-auto">
          <span className="inline-block w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span>
            Exibindo <strong className="text-white">{totalFiltered}</strong> de{' '}
            <strong className="text-neutral-300">{totalCatalog}</strong> recursos
          </span>
        </div>
      </div>
    </div>
  );
}
