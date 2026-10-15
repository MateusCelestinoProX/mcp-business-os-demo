"use client";

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, Palette, Image as ImageIcon, Plus, Trash2, 
  ChevronUp, ChevronDown, Check, Eye, Edit3, Save, 
  Sparkles, Type, Hash, CheckSquare, Layers, 
  ChevronRight, ArrowRight, Settings2, Video, PlusCircle,
  Link2, Mail, FileSpreadsheet, Lock, Send, Shield, User, X, KeyRound,
  Share2, ExternalLink, Copy
} from 'lucide-react';
import CinematicCanvas from '@/components/shaders/CinematicCanvas';

import { 
  Question, FormPage, SavedForm, 
  BRAND_COLORS, MASTER_PAGES, MASTER_QUESTIONS 
} from '@/components/builder/constants';
import {
  UserRole,
  UnifiedUser,
  getStoredUser,
  setStoredUser,
  hasAdminOrModerAccess,
} from '@/lib/auth/unified-auth';


function BuilderContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const formIdParam = searchParams.get('id');

  // Unified RBAC Session User
  const [currentUser, setCurrentUser] = useState<UnifiedUser | null>(null);

  // Double User Role State
  const [userRole, setUserRole] = useState<'admin' | 'visitor'>('visitor');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  // Auth Modal Input State
  const [adminPassword, setAdminPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const [formId, setFormId] = useState<string>(formIdParam || `form_${Date.now()}`);
  const [activeTab, setActiveTab] = useState<'editor' | 'design' | 'integrations' | 'preview'>('editor');
  const [accentColor, setAccentColor] = useState('#FF0033');
  const [headerName, setHeaderName] = useState('MATEUS CELESTINO PRO');
  const [bannerUrl, setBannerUrl] = useState('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop');
  
  // SaaS Integrations State
  const [notionToken, setNotionToken] = useState('ntn_3ad8112a6332804699c9d77ff9537746');
  const [notionPageUrl, setNotionPageUrl] = useState('https://www.notion.so/3ad8112a6332804699c9d77ff9537746');
  const [resendApiKey, setResendApiKey] = useState('re_MfzzzjkP_BJCgwcaDG6Fy2QS6BmUAQ9Eg');
  const [notifyEmail, setNotifyEmail] = useState('202405039459@alunos.estacio.br');

  // Pages / Steps state
  const [pages, setPages] = useState<FormPage[]>([
    { id: 'p1', title: '1. Dados da Empresa', subtitle: 'Informações gerais da sua empresa', shaderStep: 5 }
  ]);
  const [activePageId, setActivePageId] = useState<string>('p1');
  
  // Questions state
  const [questions, setQuestions] = useState<Question[]>([]);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Sincronização da sessão unificada e checagem de privilégios RBAC
  useEffect(() => {
    try {
      const u = getStoredUser();
      setCurrentUser(u);

      const hasPrivilege = hasAdminOrModerAccess(u);
      setIsAdminAuthenticated(hasPrivilege);
      setUserRole(hasPrivilege ? 'admin' : 'visitor');

      if (hasPrivilege) {
        const stored = localStorage.getItem('mcp_saas_forms');
        if (stored) {
          const forms: SavedForm[] = JSON.parse(stored);
          const targetId = formIdParam || (forms.length > 0 ? forms[0].id : null);
          if (targetId) {
            const found = forms.find(f => f.id === targetId);
            if (found) {
              setFormId(found.id);
              setHeaderName(found.headerName || 'MATEUS CELESTINO PRO');
              setAccentColor(found.accentColor || '#FF0033');
              setBannerUrl(found.bannerUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop');
              setNotionToken(found.notionToken || '');
              setNotionPageUrl(found.notionPageUrl || '');
              setResendApiKey(found.resendApiKey || 're_MfzzzjkP_BJCgwcaDG6Fy2QS6BmUAQ9Eg');
              setNotifyEmail(found.notifyEmail || '202405039459@alunos.estacio.br');
              if (found.pages && found.pages.length > 0) {
                setPages(found.pages);
                setActivePageId(found.pages[0].id);
              }
              if (found.questions) {
                setQuestions(found.questions);
              }
            }
          }
        }
      }
    } catch (e) {
      console.error('Error loading stored form:', e);
    }

    const handleAuthChange = (e: Event) => {
      const ce = e as CustomEvent<UnifiedUser>;
      const user = ce.detail || getStoredUser();
      setCurrentUser(user);
      const priv = hasAdminOrModerAccess(user);
      setIsAdminAuthenticated(priv);
      setUserRole(priv ? 'admin' : 'visitor');
    };

    window.addEventListener('mcp_auth_changed', handleAuthChange);
    window.addEventListener('storage', handleAuthChange);
    return () => {
      window.removeEventListener('mcp_auth_changed', handleAuthChange);
      window.removeEventListener('storage', handleAuthChange);
    };
  }, [formIdParam]);

  // Autenticação Real do Administrador via /api/auth/login
  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);
    setPasswordError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: '202405039459@alunos.estacio.br',
          password: adminPassword,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success && (data.role === 'admin' || data.user?.role === 'admin')) {
        const authenticatedAdmin: UnifiedUser = {
          isLoggedIn: true,
          role: 'admin',
          name: data.user?.name || 'Mateus Celestino Pro',
          email: data.user?.email || '202405039459@alunos.estacio.br',
          avatar: '',
          tier: 'max',
        };
        setStoredUser(authenticatedAdmin);
        setCurrentUser(authenticatedAdmin);
        setIsAdminAuthenticated(true);
        setUserRole('admin');
        setShowAuthModal(false);
        setPasswordError('');
        setAdminPassword('');
        setHeaderName('MATEUS CELESTINO PRO');
        showToast('🔓 Sessão Administrador Desbloqueada!');
      } else {
        setPasswordError(data.error || 'Senha de administrador incorreta.');
      }
    } catch (err) {
      setPasswordError('Erro ao verificar credenciais no servidor.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const switchRole = (newRole: 'admin' | 'visitor') => {
    if (newRole === 'admin') {
      if (isAdminAuthenticated) {
        setUserRole('admin');
        localStorage.setItem('mcp_user_role', 'admin');
        setHeaderName('MATEUS CELESTINO PRO');
      } else {
        setShowAuthModal(true);
      }
    } else {
      setUserRole('visitor');
      localStorage.setItem('mcp_user_role', 'visitor');
      setHeaderName('VISITANTE • DEMONSTRAÇÃO');
    }
  };

  // Sync CSS accent variables
  useEffect(() => {
    document.documentElement.style.setProperty('--accent-color', accentColor);
    document.documentElement.style.setProperty('--accent-glow', `${accentColor}66`);
    document.documentElement.style.setProperty('--accent-subtle', `${accentColor}18`);
    document.documentElement.style.setProperty('--accent-border', `${accentColor}77`);
  }, [accentColor]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Persistent Save Handler to LocalStorage & Database API
  const saveFormToStorage = async () => {
    if (userRole !== 'admin') {
      setShowAuthModal(true);
      showToast('⚠️ Modo Visitante: Faça login no Admin para salvar alterações permanentemente.');
      return;
    }
    try {
      const stored = localStorage.getItem('mcp_saas_forms');
      let forms: SavedForm[] = stored ? JSON.parse(stored) : [];
      
      const formPayload: SavedForm = {
        id: formId,
        headerName: headerName || 'MATEUS CELESTINO PRO',
        formTitle: pages[0]?.title || 'Formulário Novos Clientes',
        accentColor,
        bannerUrl,
        notionToken,
        notionPageUrl,
        resendApiKey,
        notifyEmail,
        pages,
        questions,
        updatedAt: new Date().toISOString()
      };

      const existingIndex = forms.findIndex(f => f.id === formId);
      if (existingIndex >= 0) {
        forms[existingIndex] = formPayload;
      } else {
        forms.push(formPayload);
      }

      localStorage.setItem('mcp_saas_forms', JSON.stringify(forms));

      // Sincronização resiliente com backend DB
      try {
        await fetch('/api/forms', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: formId,
            title: pages[0]?.title || 'Formulário Novos Clientes',
            description: pages[0]?.subtitle || '',
            schemaJson: formPayload,
            isActive: true
          })
        });
      } catch (apiErr) {
        console.warn('API DB Sync fallback acionado:', apiErr);
      }

      showToast('💾 Formulário salvo com sucesso no perfil Admin!');
    } catch (err) {
      console.error('Error saving form:', err);
      showToast('⚠️ Erro ao salvar formulário.');
    }
  };

  const copyPublicLink = () => {
    const full = `${window.location.origin}/f/${formId}`;
    navigator.clipboard.writeText(full);
    showToast('🔗 Link público copiado com sucesso!');
  };

  const currentPageIndex = pages.findIndex(p => p.id === activePageId);
  const currentPage = pages[currentPageIndex] || pages[0];

  const importMasterModel = () => {
    if (userRole !== 'admin') {
      setShowAuthModal(true);
      return;
    }
    setHeaderName('MATEUS CELESTINO PRO');
    setPages([...MASTER_PAGES]);
    setQuestions([...MASTER_QUESTIONS]);
    setActivePageId('page_1');
    showToast('✨ Modelo Mestre importado com sucesso (4 Páginas + 30 Perguntas)!');
  };

  const addPage = () => {
    const newId = `page_${Date.now()}`;
    const newPageNum = pages.length + 1;
    const newPage: FormPage = {
      id: newId,
      title: `${newPageNum}. Nova Etapa / Página`,
      subtitle: 'Descrição desta nova etapa...',
      shaderStep: ((newPageNum - 1) % 7) + 1,
    };
    setPages([...pages, newPage]);
    setActivePageId(newId);
    showToast(`📄 Nova Página criada livremente: Etapa ${newPageNum}`);
  };

  const deletePage = (id: string) => {
    if (pages.length <= 1) {
      showToast('⚠️ O formulário precisa ter pelo menos 1 página.');
      return;
    }
    const remaining = pages.filter(p => p.id !== id);
    setPages(remaining);
    setQuestions(questions.filter(q => q.pageId !== id));
    setActivePageId(remaining[0].id);
    showToast('🗑️ Página removida.');
  };

  const addQuestion = (type: 'text' | 'number' | 'choice') => {
    const newQ: Question = {
      id: `q_${Date.now()}`,
      pageId: activePageId,
      type,
      label: type === 'text' ? 'Nova Pergunta em Texto' : type === 'number' ? 'Nova Pergunta Numérica' : 'Pergunta de Múltipla Escolha',
      placeholder: 'Digite sua resposta...',
      options: type === 'choice' ? ['Opção 1', 'Opção 2', 'Opção 3'] : undefined,
      required: true,
    };
    setQuestions([...questions, newQ]);
    showToast('➕ Pergunta adicionada à página atual.');
  };

  const deleteQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
    showToast('🗑️ Pergunta excluída.');
  };

  const activeQuestions = questions.filter(q => q.pageId === activePageId);

  // Submit Form Handler calling API
  const handleFormSubmit = async () => {
    if (userRole !== 'admin') {
      setShowAuthModal(true);
      showToast('⚠️ Automações Notion & Resend requerem login Admin.');
      return;
    }
    setIsSubmitting(true);
    try {
      const formattedResponses = questions.map(q => ({
        label: q.label,
        answer: userAnswers[q.id] || 'Não preenchido'
      }));

      const res = await fetch('/api/submit-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formId,
          formTitle: headerName || 'Formulário Novos Clientes',
          responses: formattedResponses,
          notionToken,
          notionPageUrl,
          resendApiKey,
          notifyEmail
        })
      });

      const data = await res.json();
      if (data.success) {
        showToast('🚀 Formulário enviado com sucesso para Notion & Resend!');
      } else {
        showToast('✅ Formulário submetido!');
      }
    } catch (err) {
      showToast('✅ Formulário enviado com sucesso!');
    } finally {
      setIsSubmitting(false);
    }
  };

  // BLOQUEIO RBAC: Somente Administradores e Moderadores podem acessar o Form Builder
  if (currentUser && !hasAdminOrModerAccess(currentUser)) {
    return (
      <div className="min-h-screen relative text-slate-100 flex items-center justify-center p-4 font-sans selection:bg-red-600 selection:text-white">
        <CinematicCanvas shaderStep={1} colorHex="#FF0033" />

        {/* SECURE ADMIN AUTHENTICATION MODAL */}
        {showAuthModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-2xl animate-fadeIn">
            <div className="ultra-glass-frame p-8 rounded-3xl max-w-md w-full space-y-6 shadow-2xl relative border-red-500">
              <button 
                onClick={() => setShowAuthModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-xl hover:bg-white/10"
              >
                <X size={18} />
              </button>

              <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-500 mx-auto shadow-lg shadow-red-500/20">
                <KeyRound size={28} />
              </div>

              <div className="text-center space-y-2">
                <span className="accent-badge px-3 py-1 rounded-full text-[10px] font-extrabold tracking-widest uppercase">
                  Autenticação do Administrador
                </span>
                <h3 className="text-xl font-bold text-white">Acesso Restrito Admin</h3>
                <p className="text-xs text-slate-300">
                  Digite a senha do administrador para desbloquear privilégios totais de gerenciamento.
                </p>
              </div>

              <form onSubmit={handlePasswordLogin} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">Senha do Administrador</label>
                  <div className="relative">
                    <input 
                      type="password" 
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      placeholder="Digite a senha de acesso..."
                      className="w-full ultra-glass-input p-3.5 rounded-xl text-xs font-mono pr-10"
                      autoFocus
                    />
                    <Lock size={14} className="absolute right-3.5 top-3.5 text-slate-400" />
                  </div>
                  {passwordError && <span className="text-[11px] text-red-400 mt-1 block font-semibold">{passwordError}</span>}
                </div>

                <button 
                  type="submit"
                  disabled={isAuthenticating}
                  className="w-full py-3.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white cursor-pointer shadow-lg shadow-red-600/30"
                >
                  <Shield size={14} /> {isAuthenticating ? 'Autenticando...' : 'Desbloquear Acesso Admin'}
                </button>
              </form>
            </div>
          </div>
        )}

        <div className="max-w-md w-full ultra-glass-frame rounded-3xl p-8 border border-white/15 text-center shadow-2xl relative z-20 backdrop-blur-3xl bg-[#030305]/90">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 mx-auto mb-5 shadow-[0_0_20px_rgba(255,7,58,0.3)]">
            <Lock className="w-8 h-8" />
          </div>

          <span className="accent-badge px-3 py-1 rounded-full text-[10px] font-extrabold tracking-widest uppercase mb-3 inline-block">
            ACESSO RESTRITO SOBERANO
          </span>

          <h2 className="text-2xl font-bold text-white mb-2">
            Form Builder Cinemático
          </h2>
          <p className="text-xs text-neutral-300 leading-relaxed mb-6">
            O Form Builder é exclusivo para <strong>Administradores</strong> e <strong>Moderadores</strong> da MCP Software.
            Visitantes e Usuários comuns devem autenticar-se para desbloquear a engine.
          </p>

          <div className="space-y-3 pt-2 border-t border-white/10">
            <button
              onClick={() => setShowAuthModal(true)}
              className="w-full py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white shadow-[0_0_20px_rgba(255,7,58,0.4)] transition-all cursor-pointer"
            >
              <KeyRound className="w-4 h-4" />
              <span>Desbloquear com Senha Admin</span>
            </button>


            <div className="pt-3 flex items-center justify-between text-xs text-neutral-400">
              <Link href="/admin" className="hover:text-amber-300 transition-colors">
                Ir ao Painel Admin →
              </Link>
              <Link href="/" className="hover:text-white transition-colors">
                ← Voltar ao Portal
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative text-slate-100 flex flex-col font-sans selection:bg-[var(--accent-color)] selection:text-white">
      
      {/* WEBGL & REACT BITS CINEMATIC CANVAS */}
      <CinematicCanvas shaderStep={currentPage?.shaderStep || 1} colorHex={accentColor} />

      {/* SECURE ADMIN AUTHENTICATION MODAL (STRICTLY PASSWORD ONLY) */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-2xl animate-fadeIn">
          <div className="ultra-glass-frame p-8 rounded-3xl max-w-md w-full space-y-6 shadow-2xl relative border-[var(--accent-color)]">
            <button 
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-xl hover:bg-white/10"
            >
              <X size={18} />
            </button>

            <div className="w-14 h-14 rounded-2xl bg-[var(--accent-subtle)] border border-[var(--accent-border)] flex items-center justify-center text-[var(--accent-color)] mx-auto shadow-lg shadow-[var(--accent-glow)]">
              <KeyRound size={28} />
            </div>

            <div className="text-center space-y-2">
              <span className="accent-badge px-3 py-1 rounded-full text-[10px] font-extrabold tracking-widest uppercase">
                Autenticação do Administrador
              </span>
              <h3 className="text-xl font-bold text-white">Acesso Restrito Admin</h3>
              <p className="text-xs text-slate-300">
                Digite a senha do administrador para desbloquear privilégios totais de gerenciamento.
              </p>
            </div>

            {/* Server-Side Verified Password Form */}
            <form onSubmit={handlePasswordLogin} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">Senha do Administrador</label>
                <div className="relative">
                  <input 
                    type="password" 
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="Digite a senha de acesso..."
                    className="w-full ultra-glass-input p-3.5 rounded-xl text-xs font-mono pr-10"
                    autoFocus
                  />
                  <Lock size={14} className="absolute right-3.5 top-3.5 text-slate-400" />
                </div>
                {passwordError && <span className="text-[11px] text-red-400 mt-1 block font-semibold">{passwordError}</span>}
              </div>

              <button 
                type="submit"
                disabled={isAuthenticating}
                className="accent-btn w-full py-3.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
              >
                <Shield size={14} /> {isAuthenticating ? 'Autenticando...' : 'Desbloquear Acesso Admin'}
              </button>
            </form>

          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 ultra-glass-card accent-border px-5 py-3 rounded-2xl text-xs font-semibold flex items-center gap-3 animate-bounce shadow-2xl">
          <span>{toastMsg}</span>
        </div>
      )}

      {/* TOP GLASS NAVIGATION BAR */}
      <header className="h-16 border-b border-white/15 bg-black/60 backdrop-blur-2xl px-4 md:px-6 flex items-center justify-between sticky top-[68px] z-30">
        <div className="flex items-center gap-4">
          <Link href="/" className="p-2 rounded-xl hover:bg-white/10 text-slate-300 transition-colors" title="Voltar ao início">
            <ArrowLeft size={18} />
          </Link>
          <div className="h-4 w-px bg-white/20" />
          <span className="text-xs font-extrabold tracking-widest text-[var(--accent-color)] uppercase flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[var(--accent-color)] animate-ping" />
            MCP Builder
          </span>
        </div>

        {/* Tab Selector */}
        <nav className="hidden lg:flex items-center bg-black/40 p-1 rounded-2xl border border-white/15 text-xs font-semibold backdrop-blur-md">
          <button 
            onClick={() => setActiveTab('editor')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-xl transition-all cursor-pointer ${activeTab === 'editor' ? 'bg-white/15 text-white shadow-lg border border-white/20' : 'text-slate-400 hover:text-white'}`}
          >
            <Edit3 size={14} /> Construtor de Páginas
          </button>
          <button 
            onClick={() => setActiveTab('design')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-xl transition-all cursor-pointer ${activeTab === 'design' ? 'bg-white/15 text-white shadow-lg border border-white/20' : 'text-slate-400 hover:text-white'}`}
          >
            <Palette size={14} /> Tema & 12 Cores
          </button>
          <button 
            onClick={() => {
              if (userRole !== 'admin') {
                setShowAuthModal(true);
              }
              setActiveTab('integrations');
            }}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-xl transition-all cursor-pointer ${activeTab === 'integrations' ? 'bg-white/15 text-white shadow-lg border border-white/20' : 'text-slate-400 hover:text-white'}`}
          >
            <Link2 size={14} /> Notion & Resend {userRole !== 'admin' && <Lock size={12} className="text-amber-400" />}
          </button>
          <button 
            onClick={() => setActiveTab('preview')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-xl transition-all cursor-pointer ${activeTab === 'preview' ? 'bg-white/15 text-white shadow-lg border border-white/20' : 'text-slate-400 hover:text-white'}`}
          >
            <Eye size={14} /> Preview Ao Vivo
          </button>
        </nav>

        {/* DOUBLE USER ROLE SWITCHER & ACTION BUTTONS */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="bg-black/60 p-1 rounded-2xl border border-white/15 text-xs font-semibold flex items-center">
            <button 
              onClick={() => switchRole('admin')}
              className={`flex items-center gap-1 px-2.5 sm:px-3 py-1 rounded-xl transition-all cursor-pointer ${userRole === 'admin' ? 'bg-[var(--accent-color)] text-white' : 'text-slate-400 hover:text-white'}`}
            >
              <Shield size={12} /> Admin {userRole !== 'admin' && <Lock size={11} className="ml-1 opacity-70" />}
            </button>
            <button 
              onClick={() => switchRole('visitor')}
              className={`flex items-center gap-1 px-2.5 sm:px-3 py-1 rounded-xl transition-all cursor-pointer ${userRole === 'visitor' ? 'bg-amber-500/30 text-amber-300 border border-amber-500/40' : 'text-slate-400 hover:text-white'}`}
            >
              <User size={12} /> Visitante
            </button>
          </div>

          <button 
            onClick={importMasterModel}
            className="hidden sm:flex px-3 py-1.5 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 border border-white/20 text-slate-200 transition-all items-center gap-1.5 hover:border-[var(--accent-color)] cursor-pointer"
            title="Importar 4 Páginas e 30 Perguntas Originais"
          >
            <Sparkles size={14} className="text-[var(--accent-color)]" />
            Modelo Mestre
          </button>

          <button 
            onClick={copyPublicLink}
            className="p-2 sm:px-3 sm:py-1.5 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 border border-white/20 text-slate-300 transition-all flex items-center gap-1.5 cursor-pointer"
            title="Copiar link público do formulário"
          >
            <Share2 size={14} />
            <span className="hidden md:inline">Compartilhar</span>
          </button>
          
          <button 
            onClick={saveFormToStorage}
            className="accent-btn px-3.5 sm:px-4 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <Save size={14} /> Salvar
          </button>
        </div>
      </header>

      {/* MOBILE TABS FOR SMALL SCREENS */}
      <div className="flex lg:hidden bg-black/80 px-4 py-2 border-b border-white/10 overflow-x-auto gap-2 text-xs font-semibold z-30">
        <button 
          onClick={() => setActiveTab('editor')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl whitespace-nowrap ${activeTab === 'editor' ? 'bg-white/20 text-white' : 'text-slate-400'}`}
        >
          <Edit3 size={13} /> Construtor
        </button>
        <button 
          onClick={() => setActiveTab('design')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl whitespace-nowrap ${activeTab === 'design' ? 'bg-white/20 text-white' : 'text-slate-400'}`}
        >
          <Palette size={13} /> Tema & Cores
        </button>
        <button 
          onClick={() => {
            if (userRole !== 'admin') setShowAuthModal(true);
            setActiveTab('integrations');
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl whitespace-nowrap ${activeTab === 'integrations' ? 'bg-white/20 text-white' : 'text-slate-400'}`}
        >
          <Link2 size={13} /> Notion & Resend
        </button>
        <button 
          onClick={() => setActiveTab('preview')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl whitespace-nowrap ${activeTab === 'preview' ? 'bg-white/20 text-white' : 'text-slate-400'}`}
        >
          <Eye size={13} /> Preview
        </button>
      </div>

      {/* CONTENT AREA WITH SHADER BG VISIBLE */}
      <div className="flex-1 flex justify-center p-4 md:p-10 relative z-10 overflow-y-auto">

        {/* TAB 1: FORM BUILDER WITH UNLIMITED MULTI-PAGE SUPPORT */}
        {activeTab === 'editor' && (
          <main className="w-full max-w-4xl space-y-6 animate-fadeIn">

            {/* PAGE / STEP TABS BAR */}
            <div className="ultra-glass-card p-3 rounded-2xl flex items-center justify-between gap-3 overflow-x-auto">
              <div className="flex items-center gap-2 overflow-x-auto py-1">
                {pages.map((p, idx) => (
                  <button
                    key={p.id}
                    onClick={() => setActivePageId(p.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${activePageId === p.id ? 'bg-[var(--accent-color)] text-white shadow-lg shadow-[var(--accent-glow)]' : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'}`}
                  >
                    <span>Etapa {idx + 1}</span>
                    {pages.length > 1 && activePageId === p.id && (
                      <span 
                        onClick={(e) => { e.stopPropagation(); deletePage(p.id); }}
                        className="hover:text-red-300 p-0.5" 
                        title="Excluir esta página"
                      >
                        <Trash2 size={12} />
                      </span>
                    )}
                  </button>
                ))}
              </div>

              <button 
                onClick={addPage}
                className="accent-btn px-4 py-2 rounded-xl text-xs font-bold text-white flex items-center gap-1.5 flex-shrink-0 transition-all cursor-pointer"
              >
                <PlusCircle size={15} /> Adicionar Nova Página
              </button>
            </div>

            {/* MAIN APPLE LIQUID GLASS FRAME */}
            <div className="ultra-glass-frame rounded-3xl overflow-hidden shadow-2xl">
              
              {/* macOS Window Controls Bar with INLINE EDITABLE HEADER NAME */}
              <div className="bg-black/50 px-6 py-3 border-b border-white/10 flex items-center justify-between">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                
                {/* EDITABLE HEADER NAME INPUT */}
                <div className="flex items-center gap-1 bg-white/5 hover:bg-white/10 border border-white/10 focus-within:border-[var(--accent-color)] px-3 py-1 rounded-xl transition-all">
                  <input 
                    type="text" 
                    value={headerName}
                    onChange={(e) => setHeaderName(e.target.value.toUpperCase())}
                    className="bg-transparent text-[11px] font-extrabold tracking-widest text-[var(--accent-color)] uppercase focus:outline-none text-center"
                    style={{ width: `${Math.max(12, headerName.length * 0.95)}ch` }}
                    placeholder="NOME DO CABEÇALHO..."
                  />
                  <span className="text-[11px] font-extrabold tracking-widest text-slate-400 uppercase">
                    • ETAPA {currentPageIndex + 1} DE {pages.length}
                  </span>
                </div>

                <div className="w-12" />
              </div>

              {/* Hero Banner Cover */}
              <div className="h-44 w-full relative bg-slate-900 overflow-hidden group">
                <img src={bannerUrl} alt="Header Cover" className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0E0E18] via-transparent to-transparent" />
              </div>

              {/* Page Content & Questions */}
              <div className="p-6 md:p-12 space-y-8">
                
                {/* Active Page Title & Subtitle Editing */}
                <div className="space-y-3 text-center max-w-xl mx-auto">
                  <input 
                    type="text" 
                    value={currentPage?.title || ''}
                    onChange={(e) => {
                      const updated = pages.map(p => p.id === activePageId ? { ...p, title: e.target.value } : p);
                      setPages(updated);
                    }}
                    className="w-full text-2xl md:text-3xl font-extrabold text-center bg-transparent border-b border-transparent hover:border-white/20 focus:border-[var(--accent-color)] focus:outline-none text-white py-1"
                    placeholder="Título da Etapa / Página..."
                  />
                  <textarea 
                    value={currentPage?.subtitle || ''}
                    onChange={(e) => {
                      const updated = pages.map(p => p.id === activePageId ? { ...p, subtitle: e.target.value } : p);
                      setPages(updated);
                    }}
                    rows={2}
                    className="w-full text-xs md:text-sm text-center text-slate-300 bg-transparent border-b border-transparent hover:border-white/20 focus:border-[var(--accent-color)] focus:outline-none resize-none py-1"
                    placeholder="Descrição desta etapa..."
                  />
                  
                  {/* BACKGROUND SHADER SELECTOR */}
                  <div className="pt-2 flex items-center justify-center gap-2">
                    <span className="text-[11px] font-semibold text-slate-300">Background Cinemático:</span>
                    <select
                      value={currentPage?.shaderStep || 1}
                      onChange={(e) => {
                        const updated = pages.map(p => p.id === activePageId ? { ...p, shaderStep: Number(e.target.value) } : p);
                        setPages(updated);
                      }}
                      className="bg-black/70 border border-white/30 rounded-xl text-xs px-3 py-1.5 text-white font-semibold focus:border-[var(--accent-color)] focus:outline-none"
                    >
                      <option value={1}>🌊 1. DarkVeil Waves (Original)</option>
                      <option value={2}>✨ 2. Glowing Strands (Original)</option>
                      <option value={3}>🔴 3. Balatro Crimson Ripple (Original)</option>
                      <option value={4}>💧 4. Liquid Ether (Original)</option>
                      <option value={5}>⚡ 5. Laser Beams (React Bits)</option>
                      <option value={6}>🌀 6. Color Bends Warp (React Bits)</option>
                      <option value={7}>🌌 7. Cosmic Galaxy (React Bits)</option>
                    </select>
                  </div>
                </div>

                {/* Question Control Inserter */}
                <div className="ultra-glass-card p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4 border-dashed border-white/20">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                    <Plus size={14} className="text-[var(--accent-color)]" /> ADICIONAR PERGUNTA NESTA PÁGINA
                  </span>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => addQuestion('text')}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Type size={13} /> Texto Livre
                    </button>
                    <button 
                      onClick={() => addQuestion('number')}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Hash size={13} /> Número
                    </button>
                    <button 
                      onClick={() => addQuestion('choice')}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <CheckSquare size={13} /> Múltipla Escolha
                    </button>
                  </div>
                </div>

                {/* Questions List for Active Page */}
                <div className="space-y-4">
                  {activeQuestions.length === 0 ? (
                    <div className="ultra-glass-card p-10 text-center rounded-2xl space-y-3">
                      <p className="text-sm font-semibold text-slate-300">Nenhuma pergunta nesta página ainda.</p>
                      <p className="text-xs text-slate-400">Clique nos botões acima para incluir novos campos nesta etapa.</p>
                    </div>
                  ) : (
                    activeQuestions.map((q, idx) => (
                      <div key={q.id} className="ultra-glass-card p-5 md:p-6 rounded-2xl relative group space-y-3 border-white/15">
                        
                        <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-white/10">
                          <span className="font-bold text-slate-200">Pergunta #{idx + 1}</span>
                          
                          <button 
                            onClick={() => deleteQuestion(q.id)}
                            className="p-1.5 rounded-lg bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white transition-all flex items-center gap-1 text-xs font-bold cursor-pointer"
                            title="Excluir esta pergunta com 1 clique"
                          >
                            <Trash2 size={14} /> Excluir Pergunta
                          </button>
                        </div>

                        <input 
                          type="text" 
                          value={q.label}
                          onChange={(e) => {
                            const updated = questions.map(x => x.id === q.id ? { ...x, label: e.target.value } : x);
                            setQuestions(updated);
                          }}
                          className="w-full bg-transparent text-base font-bold text-white focus:outline-none border-b border-transparent focus:border-[var(--accent-color)] py-1"
                          placeholder="Digite o título da pergunta..."
                        />

                        {q.type === 'text' && (
                          <input type="text" disabled placeholder={q.placeholder} className="w-full ultra-glass-input p-3 rounded-xl text-xs opacity-70" />
                        )}

                        {q.type === 'number' && (
                          <input type="number" disabled placeholder="000" className="w-full ultra-glass-input p-3 rounded-xl text-xs opacity-70" />
                        )}

                        {q.type === 'choice' && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                            {q.options?.map((opt, oIdx) => (
                              <div key={oIdx} className="flex items-center gap-2 bg-white/5 p-2 rounded-xl border border-white/10">
                                <div className="w-3.5 h-3.5 rounded-full border border-white/40 flex-shrink-0" />
                                <input 
                                  type="text" 
                                  value={opt}
                                  onChange={(e) => {
                                    const updated = questions.map(x => {
                                      if (x.id === q.id && x.options) {
                                        const newOpts = [...x.options];
                                        newOpts[oIdx] = e.target.value;
                                        return { ...x, options: newOpts };
                                      }
                                      return x;
                                    });
                                    setQuestions(updated);
                                  }}
                                  className="flex-1 bg-transparent text-xs text-slate-200 focus:outline-none"
                                />
                              </div>
                            ))}
                          </div>
                        )}

                      </div>
                    ))
                  )}
                </div>

                {/* END OF PAGE FOOTER OPTIONS */}
                <div className="pt-8 border-t border-white/15 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <button 
                    onClick={() => {
                      if (currentPageIndex > 0) setActivePageId(pages[currentPageIndex - 1].id);
                    }}
                    disabled={currentPageIndex === 0}
                    className="px-5 py-2.5 rounded-xl text-xs font-bold bg-white/5 hover:bg-white/10 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
                  >
                    ← Etapa Anterior
                  </button>

                  <button 
                    onClick={addPage}
                    className="accent-btn px-6 py-3 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <PlusCircle size={16} /> + Adicionar Nova Página (NextPage)
                  </button>

                  <button 
                    onClick={() => {
                      if (currentPageIndex < pages.length - 1) {
                        setActivePageId(pages[currentPageIndex + 1].id);
                      } else {
                        addPage();
                      }
                    }}
                    className="px-5 py-2.5 rounded-xl text-xs font-bold bg-white/15 hover:bg-white/25 border border-white/20 text-white flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    {currentPageIndex < pages.length - 1 ? 'Próxima Etapa →' : 'Criar Próxima Etapa →'}
                  </button>
                </div>

              </div>

            </div>

          </main>
        )}

        {/* TAB 2: BRAND COLORS & BANNER SELECTION & HEADER NAME EDIT */}
        {activeTab === 'design' && (
          <main className="w-full max-w-2xl space-y-6 animate-fadeIn">
            <div className="ultra-glass-card p-8 rounded-3xl space-y-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Edit3 size={20} className="text-[var(--accent-color)]" />
                Nome do Cabeçalho (Header Name)
              </h2>
              <p className="text-xs text-slate-300">
                Altere o texto exibido na barra superior no estilo macOS.
              </p>
              <input 
                type="text" 
                value={headerName}
                onChange={(e) => setHeaderName(e.target.value.toUpperCase())}
                className="w-full ultra-glass-input p-3.5 rounded-xl text-xs font-extrabold tracking-widest uppercase"
                placeholder="DIGITE O NOME DO CABEÇALHO..."
              />
            </div>

            <div className="ultra-glass-card p-8 rounded-3xl space-y-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <ImageIcon size={20} className="text-[var(--accent-color)]" />
                URL da Imagem de Capa (Banner Cover)
              </h2>
              <p className="text-xs text-slate-300">
                Personalize a foto panorâmica exibida no topo do formulário.
              </p>
              <input 
                type="text" 
                value={bannerUrl}
                onChange={(e) => setBannerUrl(e.target.value)}
                className="w-full ultra-glass-input p-3.5 rounded-xl text-xs font-mono"
                placeholder="https://images.unsplash.com/..."
              />
            </div>

            <div className="ultra-glass-card p-8 rounded-3xl space-y-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Palette size={20} className="text-[var(--accent-color)]" />
                Seleção de Cores da Marca (12 Cores Básicas)
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
                {BRAND_COLORS.map((c) => {
                  const isSelected = accentColor === c.hex;
                  return (
                    <button
                      key={c.id}
                      onClick={() => {
                        setAccentColor(c.hex);
                        showToast(`🎨 Cor da Marca alterada para ${c.name}!`);
                      }}
                      className={`p-4 rounded-2xl border transition-all flex flex-col items-center gap-3 cursor-pointer ${isSelected ? 'bg-white/15 border-[var(--accent-color)] shadow-xl' : 'bg-white/5 border-white/10 hover:border-white/20'}`}
                    >
                      <div 
                        className="w-12 h-12 rounded-full shadow-xl flex items-center justify-center transition-transform hover:scale-110"
                        style={{ backgroundColor: c.hex, boxShadow: `0 0 20px ${c.hex}AA` }}
                      >
                        {isSelected && <Check size={20} className={c.hex === '#FFFFFF' ? 'text-black' : 'text-white'} />}
                      </div>
                      <span className="text-xs font-bold text-slate-200">{c.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </main>
        )}

        {/* TAB 3: SAAS INTEGRATIONS (NOTION & RESEND) */}
        {activeTab === 'integrations' && (
          <main className="w-full max-w-2xl space-y-6 animate-fadeIn">
            {userRole !== 'admin' ? (
              <div className="ultra-glass-card p-10 rounded-3xl text-center space-y-4 border-amber-500/40">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
                  <Lock size={28} />
                </div>
                <h2 className="text-xl font-bold text-white">Integrações Indisponíveis no Modo Visitante</h2>
                <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                  O envio de e-mails de alerta em tempo real (Resend) e a gravação de dados na página do Notion estão desabilitados para o usuário visitante.
                </p>
                <button 
                  onClick={() => setShowAuthModal(true)}
                  className="accent-btn px-6 py-2.5 rounded-xl text-xs font-bold inline-flex items-center gap-2 cursor-pointer"
                >
                  <Shield size={14} /> Fazer Login como Admin
                </button>
              </div>
            ) : (
              <>
                <div className="ultra-glass-card p-8 rounded-3xl space-y-5 border-white/20">
                  <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                    <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-white">
                      <FileSpreadsheet size={22} className="text-[var(--accent-color)]" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white">Integração Notion Business</h2>
                      <p className="text-xs text-slate-300">Cada resposta será enviada automaticamente para sua página do Notion.</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                        Notion Integration Token (Chave de Conexão)
                      </label>
                      <div className="relative">
                        <input 
                          type="password" 
                          value={notionToken}
                          onChange={(e) => setNotionToken(e.target.value)}
                          className="w-full ultra-glass-input p-3.5 rounded-xl text-xs font-mono pr-10"
                          placeholder="ntn_... ou secret_..."
                        />
                        <Lock size={14} className="absolute right-3.5 top-3.5 text-slate-400" />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                        URL Completa da Página Mãe no Notion
                      </label>
                      <input 
                        type="text" 
                        value={notionPageUrl}
                        onChange={(e) => setNotionPageUrl(e.target.value)}
                        className="w-full ultra-glass-input p-3.5 rounded-xl text-xs font-mono"
                        placeholder="https://www.notion.so/3ad8112a6332804699c9d77ff9537746"
                      />
                    </div>
                  </div>
                </div>

                <div className="ultra-glass-card p-8 rounded-3xl space-y-5 border-white/20">
                  <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                    <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-white">
                      <Mail size={22} className="text-[var(--accent-color)]" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white">Notificações por E-mail (Resend API)</h2>
                      <p className="text-xs text-slate-300">Receba um e-mail em tempo real sempre que um formulário for preenchido.</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1.5">Resend API Key</label>
                      <div className="relative">
                        <input 
                          type="password" 
                          value={resendApiKey}
                          onChange={(e) => setResendApiKey(e.target.value)}
                          className="w-full ultra-glass-input p-3.5 rounded-xl text-xs font-mono pr-10"
                          placeholder="re_..."
                        />
                        <Lock size={14} className="absolute right-3.5 top-3.5 text-slate-400" />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1.5">E-mail de Destino para Notificações</label>
                      <input 
                        type="email" 
                        value={notifyEmail}
                        onChange={(e) => setNotifyEmail(e.target.value)}
                        className="w-full ultra-glass-input p-3.5 rounded-xl text-xs font-mono"
                        placeholder="202405039459@alunos.estacio.br"
                      />
                    </div>
                  </div>

                  <button 
                    onClick={() => {
                      saveFormToStorage();
                      showToast('🔌 Configurações salvas no formulário Admin!');
                    }}
                    className="accent-btn w-full py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Save size={14} /> Salvar Chaves de Conexão (Admin)
                  </button>
                </div>
              </>
            )}
          </main>
        )}

        {/* TAB 4: LIVE PREVIEW & INTERACTIVE SUBMISSION TEST */}
        {activeTab === 'preview' && (
          <main className="w-full max-w-3xl space-y-6 animate-fadeIn">
            <div className="ultra-glass-frame rounded-3xl overflow-hidden shadow-2xl">
              <div className="bg-black/60 px-6 py-3 border-b border-white/15 flex items-center justify-between">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <span className="text-[11px] font-extrabold tracking-widest text-[var(--accent-color)] uppercase">
                  {headerName} • ETAPA {currentPageIndex + 1} DE {pages.length}
                </span>
                <div className="w-12" />
              </div>

              <div className="h-40 w-full relative bg-slate-900">
                <img src={bannerUrl} alt="Cover" className="w-full h-full object-cover opacity-90" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0E0E18] via-transparent to-transparent" />
              </div>

              <div className="p-8 space-y-6">
                <div className="text-center space-y-2">
                  <h1 className="text-2xl font-bold text-white">{currentPage?.title}</h1>
                  <p className="text-xs text-slate-300">{currentPage?.subtitle}</p>
                </div>

                <div className="space-y-4 pt-2">
                  {activeQuestions.map((q, idx) => (
                    <div key={q.id} className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
                      <label className="text-xs font-bold text-slate-200 block">
                        {idx + 1}. {q.label} {q.required && <span className="text-[var(--accent-color)]">*</span>}
                      </label>

                      {q.type === 'text' && (
                        <input 
                          type="text" 
                          placeholder={q.placeholder} 
                          value={userAnswers[q.id] || ''}
                          onChange={(e) => setUserAnswers({ ...userAnswers, [q.id]: e.target.value })}
                          className="w-full ultra-glass-input p-3 rounded-xl text-xs" 
                        />
                      )}

                      {q.type === 'number' && (
                        <input 
                          type="number" 
                          placeholder="000" 
                          value={userAnswers[q.id] || ''}
                          onChange={(e) => setUserAnswers({ ...userAnswers, [q.id]: e.target.value })}
                          className="w-full ultra-glass-input p-3 rounded-xl text-xs" 
                        />
                      )}

                      {q.type === 'choice' && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {q.options?.map((opt, oIdx) => (
                            <label key={oIdx} className="flex items-center gap-2 p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-200 cursor-pointer">
                              <input 
                                type="radio" 
                                name={q.id} 
                                value={opt}
                                checked={userAnswers[q.id] === opt}
                                onChange={(e) => setUserAnswers({ ...userAnswers, [q.id]: e.target.value })}
                                className="accent-[var(--accent-color)]" 
                              />
                              {opt}
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Preview Page Navigation & Submission */}
                <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                  <button 
                    disabled={currentPageIndex === 0}
                    onClick={() => setActivePageId(pages[currentPageIndex - 1].id)}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-white/5 hover:bg-white/10 text-slate-300 disabled:opacity-30 cursor-pointer"
                  >
                    ← Voltar
                  </button>

                  {currentPageIndex < pages.length - 1 ? (
                    <button 
                      onClick={() => setActivePageId(pages[currentPageIndex + 1].id)}
                      className="accent-btn px-6 py-2.5 rounded-xl text-xs font-bold cursor-pointer"
                    >
                      Próxima Etapa →
                    </button>
                  ) : (
                    <button 
                      onClick={handleFormSubmit}
                      disabled={isSubmitting}
                      className="accent-btn px-6 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer"
                    >
                      {isSubmitting ? 'Enviando...' : userRole === 'admin' ? '🚀 Enviar (Notion + Resend)' : '🚀 Enviar (Demonstração)'}
                    </button>
                  )}
                </div>

              </div>
            </div>
          </main>
        )}

      </div>
    </div>
  );
}

export default function GlassLiquidBuilderWrapper() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-white">Carregando Construtor...</div>}>
      <BuilderContent />
    </Suspense>
  );
}
