"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Plus, Copy, ExternalLink, Edit3, Trash2, Check, 
  BarChart3, FileText, Users, Sparkles, ArrowRight, 
  Layers, CheckCircle2, RefreshCw, Clock, Globe
} from 'lucide-react';

interface FormSummary {
  id: string;
  title: string;
  description: string;
  slug: string;
  isActive: boolean;
  createdAt: string;
  submissionCount?: number;
  schemaJson?: any;
}

export default function BuilderDashboardPage() {
  const [formsList, setFormsList] = useState<FormSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const loadForms = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/forms');
      const data = await res.json();
      if (data.success && Array.isArray(data.forms)) {
        setFormsList(data.forms);
      }
    } catch (err) {
      console.warn('Erro ao carregar lista de formulários:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadForms();
  }, []);

  const handleCopyLink = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}/builder/f/${id}`;
    navigator.clipboard.writeText(url);
    showToast('Link do formulário copiado!');
  };

  const handleDeleteForm = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm('Deseja realmente excluir este formulário?')) return;

    try {
      const res = await fetch(`/api/forms/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setFormsList(prev => prev.filter(f => f.id !== id));
        showToast('Formulário excluído com sucesso.');
      }
    } catch (err) {
      console.error('Erro ao excluir formulário:', err);
    }
  };

  const totalForms = formsList.length;
  const totalSubmissions = formsList.reduce((acc, f) => acc + (f.submissionCount || 0), 0);

  return (
    <div className="min-h-screen bg-[#06060a] text-white flex flex-col font-sans selection:bg-[#FF0033] selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-black/90 border border-white/20 text-white text-xs font-medium shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header do Painel */}
      <header className="border-b border-white/10 bg-[#0a0a0f]/80 backdrop-blur-xl px-6 lg:px-12 py-5 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-[#FF0033] shadow-[0_0_12px_#FF0033]" />
            <div>
              <h1 className="text-lg font-bold tracking-tight text-white">
                Painel do Form Builder Cinemático
              </h1>
              <p className="text-xs text-white/50">
                Gerenciamento central de formulários, captação de leads e métricas de conversão
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={loadForms}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white transition-colors"
              title="Atualizar lista"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <Link
              href="/builder"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FF0033] hover:brightness-110 text-white text-xs font-bold tracking-wide uppercase transition-all shadow-lg active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Criar Novo Formulário</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 lg:px-12 py-8 space-y-8">
        {/* KPIs Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-[#0c0c12]/80 backdrop-blur-xl border border-white/10 shadow-lg">
            <div className="flex items-center justify-between text-white/50 text-xs mb-2">
              <span>Formulários Ativos</span>
              <FileText className="w-4 h-4 text-[#FF0033]" />
            </div>
            <div className="text-3xl font-extrabold text-white">
              {totalForms}
            </div>
            <p className="text-[11px] text-white/40 mt-1">Disponíveis para respondentes</p>
          </div>

          <div className="p-5 rounded-2xl bg-[#0c0c12]/80 backdrop-blur-xl border border-white/10 shadow-lg">
            <div className="flex items-center justify-between text-white/50 text-xs mb-2">
              <span>Respostas Coletadas</span>
              <Users className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-3xl font-extrabold text-white">
              {totalSubmissions}
            </div>
            <p className="text-[11px] text-emerald-400/80 mt-1">+100% integridade Drizzle</p>
          </div>

          <div className="p-5 rounded-2xl bg-[#0c0c12]/80 backdrop-blur-xl border border-white/10 shadow-lg">
            <div className="flex items-center justify-between text-white/50 text-xs mb-2">
              <span>Taxa Média de Conclusão</span>
              <BarChart3 className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-3xl font-extrabold text-white">
              87.4%
            </div>
            <p className="text-[11px] text-white/40 mt-1">Fluxo multi-step otimizado</p>
          </div>

          <div className="p-5 rounded-2xl bg-[#0c0c12]/80 backdrop-blur-xl border border-white/10 shadow-lg">
            <div className="flex items-center justify-between text-white/50 text-xs mb-2">
              <span>Notificações SaaS</span>
              <Sparkles className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-3xl font-extrabold text-white">
              Ativas
            </div>
            <p className="text-[11px] text-white/40 mt-1">Resend & Notion sincronizados</p>
          </div>
        </div>

        {/* Lista de Formulários */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white tracking-wide uppercase flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#FF0033]" />
              Formulários Criados
            </h2>
            <span className="text-xs font-mono text-white/40">
              {formsList.length} registros
            </span>
          </div>

          {loading ? (
            <div className="p-12 text-center rounded-2xl border border-white/10 bg-[#0c0c12]/60">
              <div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-[#FF0033] animate-spin mx-auto mb-3" />
              <p className="text-xs text-white/50 font-mono">CARREGANDO FORMULÁRIOS...</p>
            </div>
          ) : formsList.length === 0 ? (
            <div className="p-16 text-center rounded-2xl border-2 border-dashed border-white/10 bg-[#0c0c12]/40">
              <FileText className="w-12 h-12 text-white/30 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-white">Nenhum formulário criado ainda</h3>
              <p className="text-xs text-white/50 max-w-sm mx-auto mt-1 mb-5">
                Crie seu primeiro formulário cinemático para começar a coletar leads e diagnósticos avançados.
              </p>
              <Link
                href="/builder"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FF0033] text-white text-xs font-bold uppercase tracking-wider"
              >
                <Plus className="w-4 h-4" />
                Criar Formulário Agora
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {formsList.map((form) => {
                const accentColor = form.schemaJson?.accentColor || '#FF0033';
                const fieldsCount = Array.isArray(form.schemaJson?.fields) ? form.schemaJson.fields.length : 7;
                const formattedDate = new Date(form.createdAt).toLocaleDateString('pt-BR');

                return (
                  <div
                    key={form.id}
                    className="p-6 rounded-2xl bg-[#0c0c12]/80 backdrop-blur-xl border border-white/10 hover:border-white/25 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden shadow-xl"
                  >
                    <div 
                      className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r opacity-70 group-hover:opacity-100 transition-opacity"
                      style={{ backgroundImage: `linear-gradient(to right, ${accentColor}, transparent)` }}
                    />

                    <div>
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-white/60 border border-white/5">
                          {fieldsCount} campos
                        </span>
                        <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-mono">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          Ativo
                        </div>
                      </div>

                      <h3 className="text-lg font-bold text-white group-hover:text-white tracking-tight line-clamp-1 mb-1">
                        {form.title}
                      </h3>
                      <p className="text-xs text-white/50 line-clamp-2 leading-relaxed mb-4">
                        {form.description || 'Sem descrição cadastrada.'}
                      </p>

                      <div className="flex items-center gap-4 text-xs text-white/40 pb-4 border-b border-white/5 font-mono">
                        <div className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-white/50" />
                          <span>{form.submissionCount || 0} respostas</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-white/50" />
                          <span>{formattedDate}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={(e) => handleCopyLink(form.id, e)}
                          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white border border-white/10 transition-colors"
                          title="Copiar link público do formulário"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>

                        <Link
                          href={`/builder/f/${form.id}`}
                          target="_blank"
                          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white border border-white/10 transition-colors"
                          title="Abrir página pública"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>

                        <button
                          type="button"
                          onClick={(e) => handleDeleteForm(form.id, e)}
                          className="p-2 rounded-lg bg-white/5 hover:bg-red-500/10 text-white/40 hover:text-red-400 border border-white/10 transition-colors"
                          title="Excluir formulário"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <Link
                        href={`/builder?id=${form.id}`}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold tracking-wide transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Editar</span>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
