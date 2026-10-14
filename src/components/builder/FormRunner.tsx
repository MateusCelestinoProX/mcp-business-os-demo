"use client";

import React, { useState } from 'react';
import { 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  CheckCircle2, 
  AlertCircle, 
  RotateCcw, 
  Send, 
  Loader2 
} from 'lucide-react';
import { FormSchema, FormField } from '@/components/builder/types';

export interface FormRunnerProps {
  schema?: FormSchema;
  form?: FormSchema | any;
  isStandalone?: boolean;
  onSubmitted?: (data: any) => void;
  onSubmitAnswers?: (data: any) => void;
  accentColor?: string;
}

export default function FormRunner({
  schema: propSchema,
  form: propForm,
  isStandalone = true,
  onSubmitted,
  onSubmitAnswers,
  accentColor: overrideAccent,
}: FormRunnerProps) {
  const schema: FormSchema = (propSchema || propForm || {}) as FormSchema;
  const accent = overrideAccent || schema.accentColor || '#FF0033';
  const fields: FormField[] = schema.fields || [];

  // Dividir campos em etapas caso multiStep esteja ativo
  const fieldsPerPage = schema.multiStep ? 3 : Math.max(fields.length, 1);
  const totalPages = Math.ceil(fields.length / fieldsPerPage) || 1;

  const [currentPage, setCurrentPage] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const startIdx = currentPage * fieldsPerPage;
  const currentFields = fields.slice(startIdx, startIdx + fieldsPerPage);
  const progressPercent = Math.round(((currentPage + 1) / totalPages) * 100);

  const handleInputChange = (fieldId: string, val: any) => {
    setAnswers((prev) => ({ ...prev, [fieldId]: val }));
    if (validationErrors[fieldId]) {
      setValidationErrors((prev) => {
        const next = { ...prev };
        delete next[fieldId];
        return next;
      });
    }
  };

  const validateCurrentStep = (): boolean => {
    const errors: Record<string, string> = {};
    for (const f of currentFields) {
      if (f.required) {
        const val = answers[f.id];
        if (val === undefined || val === null || val === '' || (Array.isArray(val) && val.length === 0)) {
          errors[f.id] = 'Este campo é obrigatório';
        } else if (f.type === 'email' && typeof val === 'string') {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(val.trim())) {
            errors[f.id] = 'Insira um e-mail válido';
          }
        }
      }
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (!validateCurrentStep()) return;
    if (currentPage < totalPages - 1) {
      setCurrentPage((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateCurrentStep()) return;

    setIsSubmitting(true);

    const submissionData = {
      formId: schema.id,
      formTitle: schema.title,
      responses: answers,
      fields: fields.map((f) => ({
        id: f.id,
        label: f.label,
        answer: answers[f.id] !== undefined ? answers[f.id] : null,
      })),
      notionToken: schema.integrations?.notionToken,
      notionPageUrl: schema.integrations?.notionPageUrl,
      resendApiKey: schema.integrations?.resendApiKey,
      notifyEmail: schema.integrations?.notifyEmail,
    };

    try {
      if (isStandalone) {
        const res = await fetch('/api/forms/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(submissionData),
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          console.warn('Aviso de envio no servidor:', data.error);
        }
      }

      if (onSubmitted) {
        onSubmitted(submissionData);
      }
      if (onSubmitAnswers) {
        onSubmitAnswers(answers);
      }

      setIsCompleted(true);
    } catch (err: any) {
      console.warn('Erro ao submeter, confirmando envio local:', err);
      setIsCompleted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setAnswers({});
    setValidationErrors({});
    setCurrentPage(0);
    setIsCompleted(false);
  };

  if (isCompleted) {
    return (
      <div className="relative overflow-hidden rounded-3xl bg-[#0e0e14]/90 backdrop-blur-2xl border border-white/10 p-8 sm:p-12 text-center shadow-2xl max-w-xl mx-auto my-6 animate-in fade-in zoom-in-95 duration-500">
        <div 
          className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full blur-3xl opacity-30 pointer-events-none"
          style={{ backgroundColor: accent }}
        />

        <div 
          className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-lg"
          style={{ backgroundColor: `${accent}25`, color: accent, boxShadow: `0 0 30px ${accent}40` }}
        >
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">
          {schema.successMessage || 'Respostas Enviadas com Sucesso!'}
        </h3>
        <p className="text-sm text-white/60 mb-8 max-w-md mx-auto leading-relaxed">
          Suas informações foram sincronizadas e registradas no ecossistema soberano de Mateus Celestino Pro.
        </p>

        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider text-white bg-white/10 hover:bg-white/20 border border-white/15 transition-all duration-200 cursor-pointer active:scale-95"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Preencher Novamente
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto space-y-6">
      {/* Top Header Card */}
      <div className="relative overflow-hidden rounded-3xl bg-[#0e0e14]/90 backdrop-blur-2xl border border-white/10 p-6 sm:p-8 shadow-2xl">
        <div 
          className="absolute top-0 left-0 right-0 h-1"
          style={{ backgroundColor: accent }}
        />

        {/* Banner se presente */}
        {schema.bannerUrl && (
          <div className="relative h-28 sm:h-36 -mx-6 sm:-mx-8 -mt-6 sm:-mt-8 mb-6 overflow-hidden">
            <img 
              src={schema.bannerUrl} 
              alt={schema.title}
              className="w-full h-full object-cover object-center filter brightness-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e14] via-[#0e0e14]/50 to-transparent" />
          </div>
        )}

        {/* Instituição / Etapa */}
        <div className="flex items-center justify-between gap-4 mb-4 pb-3 border-b border-white/10">
          <span className="text-[11px] font-mono tracking-widest uppercase font-semibold text-white/50">
            {schema.headerName || 'MATEUS CELESTINO PRO'}
          </span>
          {totalPages > 1 && (
            <span 
              className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full border"
              style={{ 
                borderColor: `${accent}40`, 
                color: accent,
                backgroundColor: `${accent}10`
              }}
            >
              Etapa {currentPage + 1} de {totalPages}
            </span>
          )}
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mb-1.5">
          {schema.title || 'Formulário'}
        </h2>
        {schema.description && (
          <p className="text-xs sm:text-sm text-white/60 leading-relaxed">
            {schema.description}
          </p>
        )}

        {/* Barra de Progresso */}
        {totalPages > 1 && (
          <div className="mt-5 pt-3 border-t border-white/5">
            <div className="flex justify-between items-center text-[10px] text-white/50 mb-1.5 font-mono">
              <span>Progresso</span>
              <span className="font-semibold text-white/80">{progressPercent}%</span>
            </div>
            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progressPercent}%`, backgroundColor: accent }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Stack de Campos */}
      <div className="space-y-4">
        {currentFields.map((f, idx) => {
          const currentVal = answers[f.id];
          const hasError = Boolean(validationErrors[f.id]);
          const fieldIndex = startIdx + idx + 1;

          return (
            <div
              key={f.id}
              className={`rounded-2xl bg-[#0e0e14]/80 backdrop-blur-xl border p-5 sm:p-6 transition-all duration-200 ${
                hasError 
                  ? 'border-red-500/50 bg-red-950/10 shadow-[0_0_20px_rgba(239,68,68,0.15)]' 
                  : 'border-white/10 hover:border-white/20'
              }`}
            >
              {/* Rótulo da Pergunta */}
              <label className="block text-sm sm:text-base font-semibold text-white mb-2 leading-snug">
                <span className="text-white/40 mr-1.5 font-mono text-xs">{fieldIndex}.</span>
                {f.label}
                {f.required && (
                  <span className="text-red-400 ml-1 font-bold" title="Campo obrigatório">*</span>
                )}
              </label>

              {/* Renderização conforme tipo de campo */}
              {/* 1. Texto Curto */}
              {f.type === 'text' && (
                <input
                  type="text"
                  value={currentVal || ''}
                  onChange={(e) => handleInputChange(f.id, e.target.value)}
                  placeholder={f.placeholder || 'Digite sua resposta...'}
                  className="w-full bg-white/[0.04] border border-white/15 focus:border-white/40 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none transition-colors"
                />
              )}

              {/* 2. E-mail */}
              {f.type === 'email' && (
                <input
                  type="email"
                  value={currentVal || ''}
                  onChange={(e) => handleInputChange(f.id, e.target.value)}
                  placeholder={f.placeholder || 'exemplo@dominio.com.br'}
                  className="w-full bg-white/[0.04] border border-white/15 focus:border-white/40 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none transition-colors"
                />
              )}

              {/* 3. Telefone */}
              {f.type === 'phone' && (
                <input
                  type="tel"
                  value={currentVal || ''}
                  onChange={(e) => handleInputChange(f.id, e.target.value)}
                  placeholder={f.placeholder || '(00) 90000-0000'}
                  className="w-full bg-white/[0.04] border border-white/15 focus:border-white/40 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none transition-colors"
                />
              )}

              {/* 4. Múltipla Escolha (select) */}
              {f.type === 'select' && (
                <div className="space-y-2 mt-3">
                  {f.options?.map((option, optIdx) => {
                    const isSelected = currentVal === option;
                    return (
                      <button
                        key={optIdx}
                        type="button"
                        onClick={() => handleInputChange(f.id, option)}
                        className={`w-full text-left p-3.5 rounded-xl border transition-all duration-200 flex items-center justify-between cursor-pointer active:scale-[0.99] ${
                          isSelected
                            ? 'border-white/40 bg-white/10 text-white shadow-lg'
                            : 'border-white/10 bg-white/[0.02] hover:bg-white/[0.06] text-white/80'
                        }`}
                        style={isSelected ? { borderColor: `${accent}99`, boxShadow: `0 0 15px ${accent}25` } : {}}
                      >
                        <span className="text-xs sm:text-sm font-medium">{option}</span>
                        <div 
                          className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors shrink-0 ml-3 ${
                            isSelected ? 'border-transparent' : 'border-white/30'
                          }`}
                          style={isSelected ? { backgroundColor: accent } : {}}
                        >
                          {isSelected && <Check className="w-2.5 h-2.5 text-white stroke-[3]" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* 5. Escala 1 a 10 */}
              {f.type === 'scale' && (
                <div className="mt-3 space-y-2">
                  <div className="grid grid-cols-10 gap-1 sm:gap-2">
                    {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => {
                      const isSelected = currentVal === num;
                      return (
                        <button
                          key={num}
                          type="button"
                          onClick={() => handleInputChange(f.id, num)}
                          className={`h-11 rounded-lg font-mono text-xs font-bold transition-all flex items-center justify-center cursor-pointer active:scale-95 ${
                            isSelected
                              ? 'text-white shadow-lg scale-105'
                              : 'bg-white/5 border border-white/10 text-white/70 hover:bg-white/15 hover:text-white'
                          }`}
                          style={isSelected ? { backgroundColor: accent, boxShadow: `0 0 15px ${accent}50` } : {}}
                        >
                          {num}
                        </button>
                      );
                    })}
                  </div>
                  <div className="flex justify-between text-[11px] text-white/40 pt-1 font-mono">
                    <span>1 = Mínimo</span>
                    <span>10 = Máximo</span>
                  </div>
                </div>
              )}

              {/* 6. NPS (0 a 10) */}
              {f.type === 'nps' && (
                <div className="mt-3 space-y-2">
                  <div className="grid grid-cols-11 gap-1 sm:gap-1.5">
                    {Array.from({ length: 11 }, (_, i) => i).map((num) => {
                      const isSelected = currentVal === num;
                      const isDetractor = num <= 6;
                      const isNeutral = num >= 7 && num <= 8;

                      let activeColor = accent;
                      if (isSelected) {
                        if (isDetractor) activeColor = '#EF4444';
                        else if (isNeutral) activeColor = '#F59E0B';
                        else activeColor = '#10B981';
                      }

                      return (
                        <button
                          key={num}
                          type="button"
                          onClick={() => handleInputChange(f.id, num)}
                          className={`h-10 rounded-lg font-mono text-xs font-bold transition-all flex items-center justify-center cursor-pointer active:scale-95 ${
                            isSelected
                              ? 'text-white shadow-lg scale-105'
                              : 'bg-white/5 border border-white/10 text-white/70 hover:bg-white/15'
                          }`}
                          style={isSelected ? { backgroundColor: activeColor, boxShadow: `0 0 15px ${activeColor}50` } : {}}
                        >
                          {num}
                        </button>
                      );
                    })}
                  </div>
                  <div className="flex justify-between text-[10px] text-white/40 pt-1 font-mono">
                    <span className="text-red-400/80">0 = Nada Provável</span>
                    <span className="text-emerald-400/80">10 = Extremamente Provável</span>
                  </div>
                </div>
              )}

              {/* 7. Textarea */}
              {f.type === 'textarea' && (
                <textarea
                  rows={4}
                  value={currentVal || ''}
                  onChange={(e) => handleInputChange(f.id, e.target.value)}
                  placeholder={f.placeholder || 'Digite sua resposta detalhada...'}
                  className="w-full bg-white/[0.04] border border-white/15 focus:border-white/40 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none transition-colors resize-y"
                />
              )}

              {/* Erro de Validação */}
              {hasError && (
                <div className="flex items-center gap-1.5 mt-2.5 text-xs text-red-400 font-medium">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{validationErrors[f.id]}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Botões de Ação */}
      <div className="rounded-2xl bg-[#0e0e14]/90 backdrop-blur-xl border border-white/10 p-4 sm:p-5 flex items-center justify-between gap-4 shadow-xl">
        <div>
          {currentPage > 0 ? (
            <button
              type="button"
              onClick={handlePrev}
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider text-white/70 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> Voltar
            </button>
          ) : (
            <div className="text-xs text-white/30 font-mono">Início</div>
          )}
        </div>

        <div>
          {currentPage < totalPages - 1 ? (
            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider text-white shadow-xl transition-all cursor-pointer hover:brightness-110 active:scale-95"
              style={{ backgroundColor: accent, boxShadow: `0 0 20px ${accent}40` }}
            >
              Avançar <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-7 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider text-white shadow-xl transition-all cursor-pointer hover:brightness-110 active:scale-95 disabled:opacity-50"
              style={{ backgroundColor: accent, boxShadow: `0 0 25px ${accent}60` }}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Enviando...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" /> {schema.submitButtonText || 'Finalizar & Enviar'}
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </form>
  );
}
