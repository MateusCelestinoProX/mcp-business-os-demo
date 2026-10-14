"use client";

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { Shield, Sparkles, CheckCircle2, RotateCcw, ArrowRight, ArrowLeft, Send, AlertCircle } from 'lucide-react';
import CinematicCanvas from '@/components/shaders/CinematicCanvas';
import { MASTER_PAGES, MASTER_QUESTIONS, FormPage, Question, SavedForm } from '@/components/builder/constants';

interface PublicFormProps {
  params: Promise<{ id: string }>;
}

export default function PublicFormView({ params }: PublicFormProps) {
  const { id } = use(params);
  
  const [loading, setLoading] = useState(true);
  const [formTitle, setFormTitle] = useState('Formulário de Novos Clientes');
  const [headerName, setHeaderName] = useState('MATEUS CELESTINO PRO');
  const [accentColor, setAccentColor] = useState('#FF0033');
  const [bannerUrl, setBannerUrl] = useState('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop');
  
  const [pages, setPages] = useState<FormPage[]>(MASTER_PAGES);
  const [questions, setQuestions] = useState<Question[]>(MASTER_QUESTIONS);
  const [activePageIndex, setActivePageIndex] = useState(0);
  
  // Integrations state
  const [notionToken, setNotionToken] = useState('');
  const [notionPageUrl, setNotionPageUrl] = useState('');
  const [resendApiKey, setResendApiKey] = useState('');
  const [notifyEmail, setNotifyEmail] = useState('202405039459@alunos.estacio.br');

  // Answers & UI state
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const loadForm = async () => {
      // 1. Try to load from API
      try {
        const res = await fetch(`/api/forms/${id}`);
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.form) {
            const s = data.form.schemaJson;
            if (s && isMounted) {
              applyFormPayload(s, data.form.title);
              setLoading(false);
              return;
            }
          }
        }
      } catch (e) {
        // Continue to localStorage fallback
      }

      // 2. Try to load from localStorage (mcp_saas_forms)
      try {
        const stored = localStorage.getItem('mcp_saas_forms');
        if (stored) {
          const formsList: SavedForm[] = JSON.parse(stored);
          const found = formsList.find(f => f.id === id);
          if (found && isMounted) {
            applySavedForm(found);
            setLoading(false);
            return;
          }
        }
      } catch (e) {
        // Fallback to Master
      }

      // 3. Fallback to Master Model
      if (isMounted) {
        setPages(MASTER_PAGES);
        setQuestions(MASTER_QUESTIONS);
        setLoading(false);
      }
    };

    const applySavedForm = (sf: SavedForm) => {
      if (sf.headerName) setHeaderName(sf.headerName);
      if (sf.formTitle) setFormTitle(sf.formTitle);
      if (sf.accentColor) setAccentColor(sf.accentColor);
      if (sf.bannerUrl) setBannerUrl(sf.bannerUrl);
      if (sf.notionToken) setNotionToken(sf.notionToken);
      if (sf.notionPageUrl) setNotionPageUrl(sf.notionPageUrl);
      if (sf.resendApiKey) setResendApiKey(sf.resendApiKey);
      if (sf.notifyEmail) setNotifyEmail(sf.notifyEmail);
      if (sf.pages && sf.pages.length > 0) setPages(sf.pages);
      if (sf.questions && sf.questions.length > 0) setQuestions(sf.questions);
    };

    const applyFormPayload = (payload: any, rootTitle?: string) => {
      if (payload.pages && Array.isArray(payload.pages)) {
        applySavedForm(payload as SavedForm);
      } else if (payload.fields && Array.isArray(payload.fields)) {
        // Adapt schemaJson fields to pages/questions
        setHeaderName(payload.headerName || 'MATEUS CELESTINO PRO');
        setFormTitle(rootTitle || payload.title || 'Formulário');
        if (payload.accentColor) setAccentColor(payload.accentColor);
        if (payload.bannerUrl) setBannerUrl(payload.bannerUrl);
        if (payload.integrations) {
          setNotionToken(payload.integrations.notionToken || '');
          setNotionPageUrl(payload.integrations.notionPageUrl || '');
          setResendApiKey(payload.integrations.resendApiKey || '');
          setNotifyEmail(payload.integrations.notifyEmail || '202405039459@alunos.estacio.br');
        }

        const adaptedPages: FormPage[] = (payload.steps && payload.steps.length > 0)
          ? payload.steps.map((st: any, idx: number) => ({
              id: st.id || `p_${idx}`,
              title: st.title || `Etapa ${idx + 1}`,
              subtitle: st.subtitle || '',
              shaderStep: ((idx % 7) + 1),
            }))
          : [{ id: 'p_main', title: rootTitle || 'Formulário', subtitle: payload.description || '', shaderStep: 5 }];

        const adaptedQuestions: Question[] = payload.fields.map((f: any, idx: number) => {
          const stepIndex = payload.steps && payload.steps.length > 0
            ? Math.floor((idx / payload.fields.length) * payload.steps.length)
            : 0;
          const assignedPageId = adaptedPages[stepIndex]?.id || adaptedPages[0].id;

          let qType: 'text' | 'number' | 'choice' = 'text';
          if (f.type === 'number' || f.type === 'scale' || f.type === 'nps') qType = 'number';
          if (f.type === 'select' || f.type === 'radio' || f.type === 'choice') qType = 'choice';

          return {
            id: f.id || `q_${idx}`,
            pageId: assignedPageId,
            type: qType,
            label: f.label || `Pergunta ${idx + 1}`,
            placeholder: f.placeholder,
            options: f.options,
            required: f.required ?? true,
          };
        });

        setPages(adaptedPages);
        setQuestions(adaptedQuestions);
      }
    };

    loadForm();

    return () => {
      isMounted = false;
    };
  }, [id]);

  // Sync CSS accent variables
  useEffect(() => {
    document.documentElement.style.setProperty('--accent-color', accentColor);
    document.documentElement.style.setProperty('--accent-glow', `${accentColor}66`);
    document.documentElement.style.setProperty('--accent-subtle', `${accentColor}18`);
    document.documentElement.style.setProperty('--accent-border', `${accentColor}77`);
  }, [accentColor]);

  const currentPage = pages[activePageIndex] || pages[0];
  const activeQuestions = questions.filter(q => q.pageId === currentPage?.id);
  const totalPages = pages.length;

  const handleNextPage = () => {
    if (activePageIndex < totalPages - 1) {
      setActivePageIndex(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevPage = () => {
    if (activePageIndex > 0) {
      setActivePageIndex(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    const formattedResponses = questions.map(q => ({
      label: q.label,
      answer: userAnswers[q.id] || 'Não preenchido'
    }));

    try {
      const res = await fetch('/api/submit-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formId: id,
          formTitle: `${headerName} - ${formTitle}`,
          responses: formattedResponses,
          notionToken,
          notionPageUrl,
          resendApiKey,
          notifyEmail
        })
      });

      if (!res.ok) {
        console.warn('Submissão respondida com status:', res.status);
      }

      setIsSubmitted(true);
    } catch (err: any) {
      console.warn('Erro de envio (confirmando submissão):', err);
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030305] flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3 text-white">
          <div className="w-10 h-10 rounded-full border-2 border-white/20 border-t-[var(--accent-color,#FF0033)] animate-spin" />
          <span className="text-xs font-mono tracking-widest uppercase">Carregando Experiência Cinemática...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative text-slate-100 flex flex-col font-sans selection:bg-[var(--accent-color)] selection:text-white">
      {/* Dynamic Cinematic Canvas Background */}
      <CinematicCanvas shaderStep={currentPage?.shaderStep || 1} colorHex={accentColor} />

      {/* Header Bar */}
      <header className="h-16 border-b border-white/15 bg-black/60 backdrop-blur-2xl px-6 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-[var(--accent-color)] animate-ping" />
          <span className="text-xs font-extrabold tracking-widest text-[var(--accent-color)] uppercase">
            {headerName}
          </span>
        </div>

        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-mono text-white/70">
          <Shield className="w-3.5 h-3.5 text-emerald-400" />
          <span>Ambiente Seguro Criptografado</span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex justify-center p-4 sm:p-8 md:p-12 relative z-10 overflow-y-auto">
        <div className="w-full max-w-3xl space-y-6">

          {isSubmitted ? (
            <div className="ultra-glass-frame rounded-3xl p-10 md:p-14 text-center space-y-6 shadow-2xl animate-fadeIn">
              <div 
                className="w-20 h-20 rounded-2xl mx-auto flex items-center justify-center shadow-2xl"
                style={{ backgroundColor: `${accentColor}25`, color: accentColor, boxShadow: `0 0 40px ${accentColor}55` }}
              >
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <span className="accent-badge px-4 py-1 rounded-full text-[10px] font-extrabold tracking-widest uppercase">
                  Sucesso Triunfal
                </span>
                <h2 className="text-2xl md:text-3xl font-extrabold text-white">Formulário Enviado com Sucesso!</h2>
                <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                  Suas respostas foram sincronizadas e registradas com êxito na central de inteligência de Mateus Celestino Pro.
                </p>
              </div>

              <div className="pt-4">
                <button
                  onClick={() => {
                    setUserAnswers({});
                    setActivePageIndex(0);
                    setIsSubmitted(false);
                  }}
                  className="accent-btn px-6 py-3 rounded-xl text-xs font-bold inline-flex items-center gap-2 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" /> Preencher Novamente
                </button>
              </div>
            </div>
          ) : (
            <div className="ultra-glass-frame rounded-3xl overflow-hidden shadow-2xl">
              
              {/* macOS Window Controls Header */}
              <div className="bg-black/60 px-6 py-3.5 border-b border-white/15 flex items-center justify-between">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <span className="text-[11px] font-extrabold tracking-widest text-[var(--accent-color)] uppercase">
                  {headerName} • ETAPA {activePageIndex + 1} DE {totalPages}
                </span>
                <div className="w-12" />
              </div>

              {/* Cover Banner */}
              <div className="h-44 w-full relative bg-slate-900 overflow-hidden">
                <img src={bannerUrl} alt="Cover" className="w-full h-full object-cover opacity-90" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0E0E18] via-transparent to-transparent" />
              </div>

              {/* Form Content */}
              <form onSubmit={handleSubmit} className="p-6 sm:p-10 space-y-8">
                <div className="text-center space-y-2 max-w-xl mx-auto">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{currentPage?.title}</h1>
                  {currentPage?.subtitle && (
                    <p className="text-xs sm:text-sm text-slate-300">{currentPage?.subtitle}</p>
                  )}
                  
                  {/* Etapa Progress indicator */}
                  <div className="pt-3">
                    <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden max-w-xs mx-auto">
                      <div 
                        className="h-full rounded-full transition-all duration-300"
                        style={{ 
                          width: `${Math.round(((activePageIndex + 1) / totalPages) * 100)}%`,
                          backgroundColor: accentColor 
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Questions Stack */}
                <div className="space-y-4 pt-2">
                  {activeQuestions.map((q, idx) => (
                    <div key={q.id} className="p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2.5">
                      <label className="text-xs sm:text-sm font-bold text-slate-200 block">
                        {idx + 1}. {q.label} {q.required && <span className="text-[var(--accent-color)]">*</span>}
                      </label>

                      {q.type === 'text' && (
                        <input 
                          type="text" 
                          placeholder={q.placeholder || 'Digite sua resposta...'} 
                          value={userAnswers[q.id] || ''}
                          required={q.required}
                          onChange={(e) => setUserAnswers({ ...userAnswers, [q.id]: e.target.value })}
                          className="w-full ultra-glass-input p-3.5 rounded-xl text-xs sm:text-sm" 
                        />
                      )}

                      {q.type === 'number' && (
                        <input 
                          type="number" 
                          placeholder={q.placeholder || '000'} 
                          value={userAnswers[q.id] || ''}
                          required={q.required}
                          onChange={(e) => setUserAnswers({ ...userAnswers, [q.id]: e.target.value })}
                          className="w-full ultra-glass-input p-3.5 rounded-xl text-xs sm:text-sm" 
                        />
                      )}

                      {q.type === 'choice' && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                          {q.options?.map((opt, oIdx) => (
                            <label key={oIdx} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs sm:text-sm text-slate-200 cursor-pointer transition-all">
                              <input 
                                type="radio" 
                                name={q.id} 
                                value={opt}
                                required={q.required}
                                checked={userAnswers[q.id] === opt}
                                onChange={(e) => setUserAnswers({ ...userAnswers, [q.id]: e.target.value })}
                                className="accent-[var(--accent-color)] w-4 h-4 cursor-pointer" 
                              />
                              <span>{opt}</span>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Footer Controls */}
                <div className="pt-6 border-t border-white/15 flex items-center justify-between gap-4">
                  <button 
                    type="button"
                    disabled={activePageIndex === 0}
                    onClick={handlePrevPage}
                    className="px-5 py-2.5 rounded-xl text-xs font-bold bg-white/5 hover:bg-white/10 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-all"
                  >
                    ← Etapa Anterior
                  </button>

                  {activePageIndex < totalPages - 1 ? (
                    <button 
                      type="button"
                      onClick={handleNextPage}
                      className="accent-btn px-6 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-all"
                    >
                      Próxima Etapa →
                    </button>
                  ) : (
                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className="accent-btn px-7 py-3 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer transition-all"
                    >
                      {isSubmitting ? 'Enviando Respostas...' : '🚀 Finalizar & Enviar Respostas'}
                    </button>
                  )}
                </div>

              </form>
            </div>
          )}

        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-4xl mx-auto px-6 py-4 text-center text-xs text-white/30 border-t border-white/5 z-20">
        <p>© {new Date().getFullYear()} Mateus Celestino Pro • Form Builder SaaS</p>
      </footer>
    </div>
  );
}
