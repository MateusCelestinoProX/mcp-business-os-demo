"use client";

import React from 'react';
import { 
  Type, 
  AlignLeft, 
  Mail, 
  Phone, 
  ListFilter, 
  Sliders, 
  Award, 
  PlusCircle, 
  Sparkles 
} from 'lucide-react';
import { FieldType, FIELD_DEFINITIONS } from '@/components/builder/types';

interface FieldPaletteProps {
  onAddField: (type: FieldType) => void;
  accentColor: string;
  totalFields?: number;
}

const ICON_MAP: Record<FieldType, React.ElementType> = {
  text: Type,
  email: Mail,
  phone: Phone,
  select: ListFilter,
  scale: Sliders,
  nps: Award,
  textarea: AlignLeft,
};

export default function FieldPalette({
  onAddField,
  accentColor = '#FF0033',
  totalFields = 0,
}: FieldPaletteProps) {
  return (
    <div className="bg-[#0e0e14]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-xl">
      <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-white/5">
        <div className="flex items-center gap-2">
          <PlusCircle className="w-4 h-4" style={{ color: accentColor }} />
          <h4 className="text-xs font-bold uppercase tracking-wider text-white">
            Paleta de Perguntas
          </h4>
        </div>
        <span className="text-[10px] font-mono text-white/40">
          {totalFields} campo(s)
        </span>
      </div>

      <p className="text-[11px] text-white/50 mb-3 leading-relaxed">
        Clique em um bloco para adicioná-lo ao formulário:
      </p>

      <div className="space-y-2">
        {FIELD_DEFINITIONS.map((def) => {
          const IconComponent: any = ICON_MAP[def.type] || Type;

          return (
            <button
              key={def.type}
              type="button"
              onClick={() => onAddField(def.type)}
              className="w-full text-left p-2.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.08] border border-white/5 hover:border-white/15 transition-all duration-200 cursor-pointer flex items-center gap-3 group active:scale-[0.98]"
            >
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-transform group-hover:scale-110"
                style={{ backgroundColor: `${accentColor}18`, color: accentColor }}
              >
                {React.createElement(IconComponent as any, { className: "w-4 h-4" })}
              </div>

              <div className="min-w-0 flex-1">
                <div className="text-xs font-semibold text-white/90 group-hover:text-white transition-colors">
                  {def.title}
                </div>
                <div className="text-[10px] text-white/45 truncate mt-0.5">
                  {def.description}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
