"use client";

import React, { useState } from 'react';
import { 
  ChevronUp, 
  ChevronDown, 
  Trash2, 
  Type, 
  AlignLeft, 
  Mail, 
  Phone, 
  ListFilter, 
  Sliders, 
  Award, 
  Plus, 
  X, 
  Asterisk, 
  Sparkles,
  Layers,
  HelpCircle
} from 'lucide-react';
import { FormField, FieldType } from '@/components/builder/types';

interface FormCanvasProps {
  fields: FormField[];
  onUpdateFields: React.Dispatch<React.SetStateAction<FormField[]>> | ((fields: FormField[]) => void);
  accentColor: string;
  formTitle: string;
  onUpdateTitle: React.Dispatch<React.SetStateAction<string>> | ((title: string) => void);
  formDescription: string;
  onUpdateDescription: React.Dispatch<React.SetStateAction<string>> | ((desc: string) => void);
}

const TYPE_ICONS: Record<FieldType, React.ComponentType<{ className?: string }>> = {
  text: Type,
  email: Mail,
  phone: Phone,
  select: ListFilter,
  scale: Sliders,
  nps: Award,
  textarea: AlignLeft,
};

const TYPE_LABELS: Record<FieldType, string> = {
  text: 'Texto Curto',
  email: 'E-mail',
  phone: 'Telefone',
  select: 'Múltipla Escolha',
  scale: 'Escala 1 a 10',
  nps: 'NPS 0 a 10',
  textarea: 'Parágrafo / Longo',
};

export default function FormCanvas({
  fields,
  onUpdateFields,
  accentColor = '#FF0033',
  formTitle,
  onUpdateTitle,
  formDescription,
  onUpdateDescription,
}: FormCanvasProps) {
  const [newOptionInputs, setNewOptionInputs] = useState<Record<string, string>>({});

  const updateSingleField = (id: string, updates: Partial<FormField>) => {
    const updated = fields.map((f) => (f.id === id ? { ...f, ...updates } : f));
    onUpdateFields(updated);
  };

  const deleteSingleField = (id: string) => {
    const remaining = fields.filter((f) => f.id !== id);
    onUpdateFields(remaining);
  };

  const moveField = (id: string, direction: 'up' | 'down') => {
    const idx = fields.findIndex((f) => f.id === id);
    if (idx < 0) return;
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= fields.length) return;

    const reordered = [...fields];
    const [item] = reordered.splice(idx, 1);
    reordered.splice(targetIdx, 0, item);
    onUpdateFields(reordered);
  };

  const handleAddOption = (fieldId: string) => {
    const text = newOptionInputs[fieldId]?.trim();
    if (!text) return;
    const target = fields.find((f) => f.id === fieldId);
    if (!target) return;
    const opts = target.options || [];
    updateSingleField(fieldId, { options: [...opts, text] });
    setNewOptionInputs((prev) => ({ ...prev, [fieldId]: '' }));
  };

  const handleRemoveOption = (fieldId: string, optIndex: number) => {
    const target = fields.find((f) => f.id === fieldId);
    if (!target) return;
    const opts = (target.options || []).filter((_, i) => i !== optIndex);
    updateSingleField(fieldId, { options: opts });
  };

  const handleUpdateOption = (fieldId: string, optIndex: number, text: string) => {
    const target = fields.find((f) => f.id === fieldId);
    if (!target) return;
    const opts = [...(target.options || [])];
    opts[optIndex] = text;
    updateSingleField(fieldId, { options: opts });
  };

  return (
    <div className="space-y-6">
      {/* Header do Formulário (Editável) */}
      <div className="p-6 md:p-8 rounded-2xl bg-[#0e0e14]/90 backdrop-blur-xl border border-white/10 shadow-2xl relative overflow-hidden">
        <div 
          className="absolute top-0 left-0 right-0 h-1 transition-all"
          style={{ backgroundColor: accentColor }}
        />

        <div className="flex items-center gap-2 mb-4 text-[10px] font-mono tracking-widest uppercase text-white/50">
          <Layers className="w-3.5 h-3.5" style={{ color: accentColor }} />
          <span>Estrutura do Formulário</span>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-white/70 mb-1.5">
              Título do Formulário
            </label>
            <input
              type="text"
              value={formTitle}
              onChange={(e) => onUpdateTitle(e.target.value)}
              placeholder="Ex: Diagnóstico de Maturidade Digital & IA"
              className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-base font-bold text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-white/70 mb-1.5">
              Subtítulo / Descrição Inicial
            </label>
            <textarea
              rows={2}
              value={formDescription}
              onChange={(e) => onUpdateDescription(e.target.value)}
              placeholder="Descreva o propósito e as instruções do formulário..."
              className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2 text-xs text-white/80 placeholder-white/30 focus:outline-none focus:border-white/30 transition-colors resize-y"
            />
          </div>
        </div>
      </div>

      {/* Lista de Campos */}
      <div className="space-y-4">
        {fields.length === 0 ? (
          <div className="p-12 rounded-2xl bg-black/40 border border-dashed border-white/10 text-center">
            <Sparkles className="w-8 h-8 mx-auto mb-3 text-white/30" />
            <h4 className="text-sm font-semibold text-white mb-1">
              Nenhum campo adicionado ainda
            </h4>
            <p className="text-xs text-white/50 max-w-sm mx-auto">
              Utilize a Paleta de Perguntas à esquerda para adicionar campos ao seu formulário.
            </p>
          </div>
        ) : (
          fields.map((field, index) => {
            const Icon = TYPE_ICONS[field.type] || Type;
            const isFirst = index === 0;
            const isLast = index === fields.length - 1;

            return (
              <div
                key={field.id}
                className="group relative bg-[#0e0e14]/90 backdrop-blur-xl border border-white/10 hover:border-white/20 rounded-2xl p-5 shadow-xl transition-all duration-200"
              >
                {/* Linha Superior: Tipo, Ordem e Ações */}
                <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-white/5">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-lg bg-white/5 text-white/60 text-xs font-mono font-bold flex items-center justify-center">
                      {index + 1}
                    </span>
                    <span 
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold"
                      style={{ backgroundColor: `${accentColor}18`, color: accentColor }}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {TYPE_LABELS[field.type]}
                    </span>

                    {field.required && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-red-400 bg-red-500/10 px-2 py-0.5 rounded-md border border-red-500/20">
                        <Asterisk className="w-3 h-3" /> Obrigatório
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    {/* Mover para Cima */}
                    <button
                      type="button"
                      disabled={isFirst}
                      onClick={() => moveField(field.id, 'up')}
                      className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 disabled:opacity-20 transition-colors cursor-pointer"
                      title="Mover para cima"
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>

                    {/* Mover para Baixo */}
                    <button
                      type="button"
                      disabled={isLast}
                      onClick={() => moveField(field.id, 'down')}
                      className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 disabled:opacity-20 transition-colors cursor-pointer"
                      title="Mover para baixo"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>

                    {/* Alternar Obrigatório */}
                    <button
                      type="button"
                      onClick={() => updateSingleField(field.id, { required: !field.required })}
                      className={`px-2.5 py-1 text-xs rounded-lg border transition-all cursor-pointer font-medium ml-1 ${
                        field.required
                          ? 'bg-red-500/20 border-red-500/40 text-red-300'
                          : 'bg-white/5 border-white/10 text-white/40 hover:text-white/70'
                      }`}
                      title="Alternar se o campo é obrigatório"
                    >
                      * Obrigatório
                    </button>

                    {/* Excluir Campo */}
                    <button
                      type="button"
                      onClick={() => deleteSingleField(field.id)}
                      className="p-1.5 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer ml-1"
                      title="Excluir campo"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Campos do Card */}
                <div className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-medium text-white/60 mb-1">
                      Pergunta / Enunciado
                    </label>
                    <input
                      type="text"
                      value={field.label}
                      onChange={(e) => updateSingleField(field.id, { label: e.target.value })}
                      placeholder="Qual a pergunta?"
                      className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition-colors"
                    />
                  </div>

                  {field.type !== 'select' && field.type !== 'scale' && field.type !== 'nps' && (
                    <div>
                      <label className="block text-xs font-medium text-white/60 mb-1">
                        Placeholder / Dica de Preenchimento
                      </label>
                      <input
                        type="text"
                        value={field.placeholder || ''}
                        onChange={(e) => updateSingleField(field.id, { placeholder: e.target.value })}
                        placeholder="Ex: Digite sua resposta..."
                        className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white/80 placeholder-white/30 focus:outline-none focus:border-white/30 transition-colors"
                      />
                    </div>
                  )}

                  {/* Edição de Opções (select) */}
                  {field.type === 'select' && (
                    <div className="pt-2 border-t border-white/5 space-y-2.5">
                      <label className="block text-xs font-semibold text-white/80">
                        Opções de Escolha ({field.options?.length || 0})
                      </label>

                      <div className="space-y-2">
                        {field.options?.map((opt, optIdx) => (
                          <div key={optIdx} className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-white/10 text-[10px] text-white/60 flex items-center justify-center shrink-0">
                              {optIdx + 1}
                            </span>
                            <input
                              type="text"
                              value={opt}
                              onChange={(e) => handleUpdateOption(field.id, optIdx, e.target.value)}
                              className="flex-1 bg-white/[0.03] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-white/30"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveOption(field.id, optIdx)}
                              className="p-1 text-white/30 hover:text-red-400 hover:bg-white/5 rounded transition-colors"
                              title="Remover opção"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>

                      {/* Adicionar Opção */}
                      <div className="flex items-center gap-2 pt-1">
                        <input
                          type="text"
                          value={newOptionInputs[field.id] || ''}
                          onChange={(e) => setNewOptionInputs((prev) => ({ ...prev, [field.id]: e.target.value }))}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddOption(field.id);
                            }
                          }}
                          placeholder="Digite nova opção e aperte Enter..."
                          className="flex-1 bg-white/[0.02] border border-dashed border-white/15 rounded-lg px-3 py-1.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-white/40"
                        />
                        <button
                          type="button"
                          onClick={() => handleAddOption(field.id)}
                          className="px-3 py-1.5 text-xs rounded-lg font-medium text-white bg-white/10 hover:bg-white/20 transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" /> Adicionar
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Informação de Escala e NPS */}
                  {field.type === 'scale' && (
                    <div className="pt-2 border-t border-white/5 text-[11px] text-white/50 flex items-center gap-2">
                      <HelpCircle className="w-3.5 h-3.5 text-white/30" />
                      <span>Escala contínua de 1 a 10 com seletor interativo em vidro.</span>
                    </div>
                  )}

                  {field.type === 'nps' && (
                    <div className="pt-2 border-t border-white/5 text-[11px] text-white/50 flex items-center gap-2">
                      <HelpCircle className="w-3.5 h-3.5 text-white/30" />
                      <span>Net Promoter Score oficial de 0 a 10 com graduação por cores.</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
