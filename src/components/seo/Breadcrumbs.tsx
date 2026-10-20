import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { BreadcrumbItem } from '@/types/seo';
import { buildBreadcrumbSchema } from '@/services/seo/structured-data';
import { JsonLd } from './JsonLd';

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

/**
 * Componente de Navegação Estruturada (Migalhas de Pão)
 * Renderiza a hierarquia visual acessível + Schema.org BreadcrumbList para o Google.
 */
export function Breadcrumbs({ items, className = '' }: BreadcrumbsProps) {
  const fullItems: BreadcrumbItem[] = [
    { name: 'Início', url: '/' },
    ...items,
  ];

  const schema = buildBreadcrumbSchema(fullItems);

  return (
    <>
      <JsonLd data={schema} id="breadcrumbs-schema" />
      <nav aria-label="Breadcrumb" className={`flex items-center text-xs md:text-sm text-gray-400 ${className}`}>
        <ol className="flex items-center space-x-2 flex-wrap">
          {fullItems.map((item, index) => {
            const isLast = index === fullItems.length - 1;

            return (
              <li key={item.url} className="flex items-center space-x-2">
                {index > 0 && <ChevronRight className="w-3.5 h-3.5 text-gray-600 flex-shrink-0" />}
                {isLast ? (
                  <span className="text-red-400 font-medium truncate max-w-[200px] sm:max-w-xs md:max-w-md" aria-current="page">
                    {item.name}
                  </span>
                ) : (
                  <Link
                    href={item.url}
                    className="hover:text-white transition-colors flex items-center gap-1.5"
                  >
                    {index === 0 && <Home className="w-3.5 h-3.5" />}
                    <span>{item.name}</span>
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
