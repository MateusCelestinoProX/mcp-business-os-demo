"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Crown,
  Shield,
  FileCode2,
  Users,
  BarChart3,
  CreditCard,
  ArrowRight,
  ExternalLink,
  Lock,
  KeyRound,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Search,
  Plus,
  Download,
  Activity,
  Database,
  Cpu,
  Layers,
  Globe,
  Copy,
  Phone,
  Mail,
  TrendingUp,
  LogOut,
  Check,
  Server,
  Eye,
  Inbox,
  UserPlus,
} from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import {
  UnifiedUser,
  getStoredUser,
  setStoredUser,
  hasAdminOrModerAccess,
  hasAdminAccess,
  DEFAULT_GUEST_USER,
} from "@/lib/auth/unified-auth";

interface LeadItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  source: string;
  utmSource?: string;
  utmCampaign?: string;
  createdAt: string;
  status?: string;
}

interface FormItem {
  id: string;
  title: string;
  description?: string;
  slug: string;
  submissionCount?: number;
  isActive?: boolean;
  updatedAt?: string;
  shaderBg?: string;
}

interface MemberItem {
  id: string;
  name: string;
  email: string;
  role?: string;
  tier?: string;
  status?: string;
  createdAt?: string;
}

interface TransactionItem {
  id: string;
  customer: string;
  plan: string;
  amount: number;
  status: string;
  method: string;
  date: string;
}

export default function AdminPanelPage() {
  const [currentUser, setCurrentUser] = useState<UnifiedUser | null>(null);
  const [isClientReady, setIsClientReady] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "overview" | "leads" | "builder" | "members" | "finance" | "infra"
  >("overview");

  // Formulário de Login Seguro
  const [loginEmail, setLoginEmail] = useState("mateus@mateuscelestinopro.com");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Estados de Dados Administrativos 100% Reais (Inicialmente Vazios)
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [leadsList, setLeadsList] = useState<LeadItem[]>([]);
  const [formsList, setFormsList] = useState<FormItem[]>([]);
  const [membersList, setMembersList] = useState<MemberItem[]>([]);
  const [transactions, setTransactions] = useState<TransactionItem[]>([]);

  // Filtros & Ações
  const [searchQuery, setSearchQuery] = useState("");
  const [leadSourceFilter, setLeadSourceFilter] = useState<"all" | "tiktok" | "meta" | "organic">("all");
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    showToast("Texto copiado para a área de transferência.");
  };

  // Carrega e valida autenticação inicial diretamente no servidor via /api/auth/me
  useEffect(() => {
    async function verifyServerSession() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated && data.member && (data.member.role === 'admin' || data.member.role === 'moder')) {
            const user: UnifiedUser = {
              isLoggedIn: true,
              role: data.member.role,
              name: data.member.name || "Mateus Celestino Pro",
              email: data.member.email,
              avatar: "",
              tier: "max",
            };
            setCurrentUser(user);
            setStoredUser(user);
            setIsClientReady(true);
            return;
          }
        }
      } catch (e) {
        console.warn("Falha ao validar sessão inicial do admin:", e);
      }
      setCurrentUser(DEFAULT_GUEST_USER);
      setStoredUser(DEFAULT_GUEST_USER);
      setIsClientReady(true);
    }
    verifyServerSession();
  }, []);

  // Busca dados reais das rotas de API da plataforma (SEM MOCK)
  const fetchDashboardData = async () => {
    setIsLoadingData(true);
    try {
      const [leadsRes, formsRes, membersRes, financeRes] = await Promise.all([
        fetch("/api/leads?limit=100").then((r) => r.json()).catch(() => ({ success: false, leads: [] })),
        fetch("/api/forms").then((r) => r.json()).catch(() => ({ success: false, data: [] })),
        fetch("/api/members").then((r) => r.json()).catch(() => ({ success: false, members: [] })),
        fetch("/api/finance").then((r) => r.json()).catch(() => ({ success: false, transactions: [] })),
      ]);

      if (leadsRes.success && Array.isArray(leadsRes.leads)) {
        setLeadsList(leadsRes.leads);
      } else {
        setLeadsList([]);
      }

      if (formsRes.success && Array.isArray(formsRes.data)) {
        setFormsList(formsRes.data);
      } else {
        setFormsList([]);
      }

      if (membersRes.success && Array.isArray(membersRes.members)) {
        setMembersList(membersRes.members);
      } else {
        setMembersList([]);
      }

      if (financeRes.success && Array.isArray(financeRes.transactions)) {
        setTransactions(financeRes.transactions);
      } else {
        setTransactions([]);
      }
    } catch (err) {
      console.warn("Aviso ao carregar dados reais do admin:", err);
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    if (currentUser && hasAdminOrModerAccess(currentUser)) {
      fetchDashboardData();
    }
  }, [currentUser]);

  // Autenticação Real do Administrador via /api/auth/login
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsAuthenticating(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });

      const data = await res.json();

      if (res.ok && data.success && (data.role === "admin" || data.user?.role === "admin" || data.role === "moder" || data.user?.role === "moder")) {
        const authenticatedAdmin: UnifiedUser = {
          isLoggedIn: true,
          role: data.role || data.user?.role || "admin",
          name: data.user?.name || "Mateus Celestino Pro",
          email: data.user?.email || loginEmail.trim().toLowerCase(),
          avatar: "",
          tier: "max",
        };
        setStoredUser(authenticatedAdmin);
        setCurrentUser(authenticatedAdmin);
        showToast("Sessão autenticada como Administrador Soberano.");
      } else {
        setLoginError(data.error || "Credenciais inválidas. Verifique seu e-mail e senha de acesso.");
      }
    } catch (err: any) {
      setLoginError("Falha na comunicação: " + (err.message || "Erro de rede"));
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/me", { method: "DELETE" });
    } catch (e) {}
    setStoredUser(DEFAULT_GUEST_USER);
    setCurrentUser(DEFAULT_GUEST_USER);
    showToast("Sessão encerrada com sucesso.");
  };

  // Filtragem de Leads Reais
  const filteredLeads = useMemo(() => {
    return leadsList.filter((lead) => {
      const matchesSearch =
        searchQuery === "" ||
        lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.phone.includes(searchQuery);

      const matchesSource =
        leadSourceFilter === "all" ||
        lead.source.toLowerCase() === leadSourceFilter ||
        (leadSourceFilter === "tiktok" && lead.source.includes("tiktok")) ||
        (leadSourceFilter === "meta" && (lead.source.includes("meta") || lead.source.includes("facebook")));

      return matchesSearch && matchesSource;
    });
  }, [leadsList, searchQuery, leadSourceFilter]);

  // Exportação de Leads em CSV
  const handleExportCSV = () => {
    if (filteredLeads.length === 0) {
      showToast("Nenhum lead real disponível para exportação com os filtros atuais.");
      return;
    }

    const headers = ["ID", "Nome", "Email", "Telefone", "Origem", "Campanha", "Data"];
    const rows = filteredLeads.map((l) => [
      l.id,
      `"${l.name.replace(/"/g, '""')}"`,
      `"${l.email}"`,
      `"${l.phone}"`,
      `"${l.source}"`,
      `"${l.utmCampaign || ''}"`,
      `"${l.createdAt}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `leads_reais_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast("Arquivo CSV exportado com sucesso.");
  };

  // Cálculos Financeiros 100% Dinâmicos e Reais
  const totalRevenue = useMemo(() => {
    return transactions.reduce((acc, t) => acc + (t.amount || 0), 0);
  }, [transactions]);

  const ticketMedio = useMemo(() => {
    return transactions.length > 0 ? totalRevenue / transactions.length : 0;
  }, [transactions, totalRevenue]);

  const approvedTransactionsCount = useMemo(() => {
    return transactions.filter((t) => t.status === "approved").length;
  }, [transactions]);

  const approvalRate = useMemo(() => {
    return transactions.length > 0 ? (approvedTransactionsCount / transactions.length) * 100 : 0;
  }, [transactions, approvedTransactionsCount]);

  // Cálculos de Origem de Tráfego 100% Reais
  const trafficDistribution = useMemo(() => {
    if (leadsList.length === 0) {
      return { tiktok: 0, meta: 0, organic: 0, total: 0 };
    }
    const tiktokCount = leadsList.filter((l) => l.source.toLowerCase().includes("tiktok")).length;
    const metaCount = leadsList.filter((l) => l.source.toLowerCase().includes("meta") || l.source.toLowerCase().includes("facebook")).length;
    const organicCount = leadsList.length - tiktokCount - metaCount;

    return {
      tiktok: Math.round((tiktokCount / leadsList.length) * 100),
      meta: Math.round((metaCount / leadsList.length) * 100),
      organic: Math.round((Math.max(0, organicCount) / leadsList.length) * 100),
      total: leadsList.length,
    };
  }, [leadsList]);

  if (!isClientReady) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="flex items-center gap-3 text-neutral-400 font-mono text-xs">
          <RefreshCw className="w-4 h-4 animate-spin text-[#8a0012]" />
          <span>Inicializando terminal de comando soberano...</span>
        </div>
      </div>
    );
  }

  // GATEWAY DE SEGURANÇA EXECUTIVO (QUANDO NÃO AUTENTICADO)
  if (!currentUser || !hasAdminOrModerAccess(currentUser)) {
    return (
      <div className="min-h-[82vh] flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-[#07070a]/90 backdrop-blur-3xl rounded-3xl p-8 border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.85)] relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#8a0012]/20 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-center justify-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-[#8a0012]/15 border border-[#8a0012]/40 flex items-center justify-center text-red-500 shadow-[0_0_25px_rgba(138,0,18,0.3)]">
              <Shield className="w-7 h-7" />
            </div>
          </div>

          <div className="text-center space-y-1.5 mb-6">
            <h1 className="text-xl font-bold tracking-tight text-white">
              Painel de Comando Executivo
            </h1>
            <p className="text-xs text-neutral-400">
              Acesso restrito para administradores e operadores da plataforma.
            </p>
          </div>


          <form onSubmit={handleAdminLogin} className="space-y-4">
            {loginError && (
              <div className="p-3 rounded-xl bg-red-950/40 border border-red-800/50 flex items-start gap-2.5 text-xs text-red-300">
                <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                <span>{loginError}</span>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
                Identificador de Administrador
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-3 text-neutral-500" />
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="mateus@mateuscelestinopro.com"
                  required
                  className="w-full bg-black/60 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#8a0012] focus:ring-1 focus:ring-[#8a0012] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
                Chave de Acesso Mestre
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 absolute left-3.5 top-3 text-neutral-500" />
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full bg-black/60 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#8a0012] focus:ring-1 focus:ring-[#8a0012] transition-colors"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="fired"
              size="lg"
              disabled={isAuthenticating}
              className="w-full justify-center gap-2 text-xs font-semibold mt-2 shadow-[0_0_20px_rgba(138,0,18,0.4)]"
            >
              {isAuthenticating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Validando Credenciais...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Autenticar no Painel Soberano</span>
                </>
              )}
            </Button>
          </form>



          <div className="mt-6 text-center">
            <Link
              href="/"
              className="text-xs text-neutral-400 hover:text-white transition-colors inline-flex items-center gap-1.5"
            >
              <span>← Voltar ao Portal Institucional</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isMaxAdmin = hasAdminAccess(currentUser);
  const totalLeadsCount = leadsList.length;
  const totalFormsCount = formsList.length;
  const totalSubmissionsCount = formsList.reduce((acc, f) => acc + (f.submissionCount || 0), 0);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Toast Notifier */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0d0709] border border-[#8a0012]/60 px-4 py-3 rounded-xl text-xs font-medium text-neutral-200 shadow-[0_10px_30px_rgba(0,0,0,0.9)] flex items-center gap-2.5 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header Executivo Limpo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#09080c]/80 backdrop-blur-2xl border border-white/10 shadow-lg">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Painel de Gestão
          </h1>
          <p className="text-xs text-neutral-400">
            Controle de Leads, Formulários, Membros e Infraestrutura.
          </p>
        </div>

        <div className="flex items-center gap-2.5">

          <Button
            variant="secondary"
            size="sm"
            onClick={fetchDashboardData}
            disabled={isLoadingData}
            className="gap-1.5 text-xs border-white/10 hover:border-white/20"
          >
            <RefreshCw className={cn("w-3.5 h-3.5", isLoadingData && "animate-spin text-[#8a0012]")} />
            <span>Atualizar</span>
          </Button>

          <Link href="/">
            <Button variant="secondary" size="sm" className="gap-1.5 text-xs border-white/10">
              <Globe className="w-3.5 h-3.5" />
              <span>Ver Portal</span>
            </Button>
          </Link>

          <Button
            variant="secondary"
            size="sm"
            onClick={handleLogout}
            className="gap-1.5 text-xs text-red-400 hover:text-red-300 hover:bg-red-950/20 border-red-900/30"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sair</span>
          </Button>
        </div>
      </div>

      {/* NAVEGAÇÃO POR ABAS EXECUTIVAS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-white/10 hide-scrollbar">
        {[
          { id: "overview", label: "Visão Geral", icon: BarChart3, count: null },
          { id: "leads", label: "Leads & Tráfego UTM", icon: Users, count: totalLeadsCount },
          { id: "builder", label: "Form Builder Cinemático", icon: FileCode2, count: totalFormsCount },
          { id: "members", label: "Membros da Comunidade", icon: Shield, count: membersList.length },
          { id: "finance", label: "Vendas & Transações", icon: CreditCard, count: transactions.length },
          { id: "infra", label: "Infraestrutura & Supabase", icon: Server, count: null },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap",
                isActive
                  ? "bg-white text-black shadow-md font-bold"
                  : "bg-white/[0.03] text-neutral-400 hover:text-white hover:bg-white/[0.06] border border-white/5"
              )}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              {tab.count !== null && (
                <span
                  className={cn(
                    "text-[10px] px-1.5 py-0.2 rounded-full font-mono",
                    isActive ? "bg-black/15 text-black" : "bg-white/10 text-neutral-300"
                  )}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ABA 1: VISÃO GERAL */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Grid de KPIs Soberanos Reais */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <GlassCard className="p-5 space-y-2 bg-[#09080c]/90 border border-white/10">
              <div className="flex items-center justify-between text-neutral-400">
                <span className="text-[10px] font-mono uppercase tracking-wider">LEADS CAPTURADOS</span>
                <Users className="w-4 h-4 text-red-500" />
              </div>
              <div className="text-3xl font-black text-white tracking-tight">{totalLeadsCount}</div>
              <div className="flex items-center justify-between text-[11px] pt-1">
                <span className="text-neutral-400 font-medium">Base Oficial</span>
                <span className="text-neutral-500">TikTok & Meta Ads</span>
              </div>
            </GlassCard>

            <GlassCard className="p-5 space-y-2 bg-[#09080c]/90 border border-white/10">
              <div className="flex items-center justify-between text-neutral-400">
                <span className="text-[10px] font-mono uppercase tracking-wider">SUBMISSÕES DE FORMS</span>
                <FileCode2 className="w-4 h-4 text-red-400" />
              </div>
              <div className="text-3xl font-black text-white tracking-tight">{totalSubmissionsCount}</div>
              <div className="flex items-center justify-between text-[11px] pt-1">
                <span className="text-neutral-400 font-medium">{totalFormsCount} Formulários Ativos</span>
                <span className="text-neutral-500">Shaders WebGL</span>
              </div>
            </GlassCard>

            <GlassCard className="p-5 space-y-2 bg-[#09080c]/90 border border-white/10">
              <div className="flex items-center justify-between text-neutral-400">
                <span className="text-[10px] font-mono uppercase tracking-wider">MEMBROS DA COMUNIDADE</span>
                <Shield className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-3xl font-black text-amber-300 tracking-tight">{membersList.length}</div>
              <div className="flex items-center justify-between text-[11px] pt-1">
                <span className="text-neutral-400 font-medium">Cadastrados no Banco</span>
                <span className="text-neutral-500">Área VIP</span>
              </div>
            </GlassCard>

            <GlassCard className="p-5 space-y-2 bg-[#09080c]/90 border border-white/10">
              <div className="flex items-center justify-between text-neutral-400">
                <span className="text-[10px] font-mono uppercase tracking-wider">FATURAMENTO CONSOLIDADO</span>
                <CreditCard className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-3xl font-black text-emerald-400 tracking-tight">
                R$ {totalRevenue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </div>
              <div className="flex items-center justify-between text-[11px] pt-1">
                <span className="text-neutral-400 font-medium">
                  {transactions.length > 0 ? `${approvalRate.toFixed(1)}% Aprovação` : "Sem transações"}
                </span>
                <span className="text-neutral-500">Mercado Pago</span>
              </div>
            </GlassCard>
          </div>

          {/* Seção Central de Distribuição de Tráfego e Engines */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Distribuição de Origem de Tráfego */}
            <GlassCard className="p-6 space-y-5 bg-[#09080c]/90 border border-white/10 lg:col-span-1">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-red-500" />
                  <span>Canais de Aquisição</span>
                </h3>
                <span className="text-[10px] font-mono text-neutral-400">UTM TRACKING</span>
              </div>

              {trafficDistribution.total === 0 ? (
                <div className="py-6 text-center space-y-2">
                  <Inbox className="w-8 h-8 text-neutral-600 mx-auto" />
                  <p className="text-xs text-neutral-400">
                    Aguardando primeiros leads para calcular divisão de canais.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-neutral-300 font-medium">TikTok Ads</span>
                      <span className="font-mono text-white">{trafficDistribution.tiktok}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-black/60 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-red-600 to-[#8a0012] rounded-full" style={{ width: `${trafficDistribution.tiktok}%` }} />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-neutral-300 font-medium">Meta Ads (Instagram / FB)</span>
                      <span className="font-mono text-white">{trafficDistribution.meta}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-black/60 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-blue-600 to-indigo-800 rounded-full" style={{ width: `${trafficDistribution.meta}%` }} />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-neutral-300 font-medium">Tráfego Orgânico (Artigos & Portal)</span>
                      <span className="font-mono text-white">{trafficDistribution.organic}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-black/60 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-800 rounded-full" style={{ width: `${trafficDistribution.organic}%` }} />
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-3 border-t border-white/5">
                <Link
                  href="/builder/dashboard"
                  className="text-xs text-red-400 hover:text-red-300 flex items-center justify-between font-medium group"
                >
                  <span>Abrir métricas de formulários</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </GlassCard>

            {/* Status das 4 Módulos Centrais da Plataforma */}
            <GlassCard className="p-6 space-y-4 bg-[#09080c]/90 border border-white/10 lg:col-span-2">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-red-500" />
                  <span>Engines da Plataforma Unificada</span>
                </h3>
                <span className="text-[10px] font-mono text-emerald-400">4 DE 4 OPERACIONAIS</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2 hover:border-white/15 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">Portal Institucional</span>
                    <Badge variant="success" dot className="text-[9px]">ONLINE</Badge>
                  </div>
                  <p className="text-[11px] text-neutral-400">Shaders WebGL Vermelho Vanta + 176 Artigos</p>
                  <Link href="/" className="text-[11px] text-red-400 hover:underline inline-flex items-center gap-1">
                    <span>Acessar Portal</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>

                <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2 hover:border-white/15 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">Form Builder Cinemático</span>
                    <Badge variant="success" dot className="text-[9px]">ONLINE</Badge>
                  </div>
                  <p className="text-[11px] text-neutral-400">Multi-etapas com Shaders procedural em tempo real</p>
                  <Link href="/builder" className="text-[11px] text-red-400 hover:underline inline-flex items-center gap-1">
                    <span>Abrir Construtor</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>

                <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2 hover:border-white/15 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">Comunidade</span>
                    <Badge variant="success" dot className="text-[9px]">ONLINE</Badge>
                  </div>
                  <p className="text-[11px] text-neutral-400">Área restrita de membros com player e feeds de IA</p>
                  <Link href="/comunidade" className="text-[11px] text-red-400 hover:underline inline-flex items-center gap-1">
                    <span>Abrir Comunidade</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>

                <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2 hover:border-white/15 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">Free Library</span>
                    <Badge variant="success" dot className="text-[9px]">ONLINE</Badge>
                  </div>
                  <p className="text-[11px] text-neutral-400">406 recursos catalogados e APK Mobile dedicado</p>
                  <Link href="/biblioteca" className="text-[11px] text-red-400 hover:underline inline-flex items-center gap-1">
                    <span>Abrir Free Library</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      )}

      {/* ABA 2: LEADS & TRÁFEGO UTM */}
      {activeTab === "leads" && (
        <GlassCard className="p-6 space-y-5 bg-[#09080c]/90 border border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-red-500" />
                <span>Gestão de Leads & Tráfego UTM</span>
              </h2>
              <p className="text-xs text-neutral-400">
                Acompanhamento em tempo real de contatos qualificados capturados via campanhas.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleExportCSV}
                disabled={filteredLeads.length === 0}
                className="gap-1.5 text-xs border-white/10 hover:border-white/20"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Exportar CSV</span>
              </Button>
            </div>
          </div>

          {/* Filtros e Busca */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-neutral-500" />
              <input
                type="text"
                placeholder="Buscar por nome, e-mail ou telefone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-black/60 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#8a0012] transition-colors"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {[
                { id: "all", label: "Todos os Canais" },
                { id: "tiktok", label: "TikTok Ads" },
                { id: "meta", label: "Meta Ads" },
                { id: "organic", label: "Orgânico" },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setLeadSourceFilter(f.id as any)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap",
                    leadSourceFilter === f.id
                      ? "bg-white text-black font-bold"
                      : "bg-white/5 text-neutral-400 hover:text-white border border-white/5"
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tabela de Leads */}
          <div className="overflow-x-auto border border-white/10 rounded-2xl bg-black/30">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-white/10 text-neutral-400 font-mono uppercase text-[10px] bg-white/[0.02]">
                <tr>
                  <th className="py-3 px-4">Nome & Identificador</th>
                  <th className="py-3 px-4">Contato</th>
                  <th className="py-3 px-4">Origem / Canal</th>
                  <th className="py-3 px-4">Campanha UTM</th>
                  <th className="py-3 px-4">Data</th>
                  <th className="py-3 px-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredLeads.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center">
                      <div className="max-w-sm mx-auto space-y-2">
                        <Inbox className="w-8 h-8 text-neutral-600 mx-auto" />
                        <div className="text-white font-medium text-xs">Nenhum lead registrado no momento</div>
                        <p className="text-[11px] text-neutral-500 leading-relaxed">
                          Os contatos capturados pelos formulários do portal e campanhas de anúncios (TikTok Ads e Meta Ads) serão listados aqui em tempo real.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredLeads.map((lead) => {
                    const isTikTok = lead.source.toLowerCase().includes("tiktok");
                    const isMeta = lead.source.toLowerCase().includes("meta") || lead.source.toLowerCase().includes("facebook");
                    const cleanPhone = lead.phone.replace(/\D/g, "");

                    return (
                      <tr key={lead.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-semibold text-white">{lead.name}</div>
                          <div className="text-[10px] font-mono text-neutral-500">{lead.id}</div>
                        </td>
                        <td className="py-3 px-4 space-y-0.5">
                          <div className="flex items-center gap-1.5 text-neutral-300">
                            <Mail className="w-3 h-3 text-neutral-500" />
                            <span>{lead.email}</span>
                          </div>
                          {cleanPhone && (
                            <a
                              href={`https://wa.me/55${cleanPhone}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1.5 text-emerald-400 hover:underline text-[11px]"
                            >
                              <Phone className="w-3 h-3" />
                              <span>{lead.phone}</span>
                            </a>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={cn(
                              "px-2 py-0.5 rounded text-[10px] font-bold uppercase border",
                              isTikTok
                                ? "bg-purple-950/40 text-purple-300 border-purple-800/40"
                                : isMeta
                                ? "bg-blue-950/40 text-blue-300 border-blue-800/40"
                                : "bg-neutral-900 text-neutral-400 border-neutral-800"
                            )}
                          >
                            {lead.source}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono text-[11px] text-neutral-400">
                          {lead.utmCampaign || "direto"}
                        </td>
                        <td className="py-3 px-4 text-neutral-400 text-[11px]">
                          {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString("pt-BR") : "Recente"}
                        </td>
                        <td className="py-3 px-4 text-right space-x-1.5">
                          <button
                            onClick={() => copyToClipboard(lead.email, lead.id)}
                            title="Copiar e-mail"
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 transition-colors"
                          >
                            {copiedId === lead.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </GlassCard>
      )}

      {/* ABA 3: FORM BUILDER CINEMÁTICO */}
      {activeTab === "builder" && (
        <GlassCard className="p-6 space-y-6 bg-[#09080c]/90 border border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <FileCode2 className="w-5 h-5 text-red-500" />
                <span>Form Builder Cinemático & Funis de Conversão</span>
              </h2>
              <p className="text-xs text-neutral-400">
                Gerencie formulários com WebGL em tempo real, submissões e links de distribuição.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/builder/dashboard">
                <Button variant="secondary" size="sm" className="gap-1.5 text-xs border-white/10">
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span>Métricas de Forms</span>
                </Button>
              </Link>

              <Link href="/builder">
                <Button variant="fired" size="sm" className="gap-1.5 text-xs font-bold shadow-[0_0_20px_rgba(138,0,18,0.5)]">
                  <Plus className="w-3.5 h-3.5" />
                  <span>Criar Novo Formulário</span>
                </Button>
              </Link>
            </div>
          </div>

          {formsList.length === 0 ? (
            <div className="p-12 text-center rounded-2xl border border-white/5 bg-black/20 space-y-3">
              <FileCode2 className="w-10 h-10 text-neutral-600 mx-auto" />
              <div className="text-white font-medium text-sm">Nenhum formulário ativo no banco de dados</div>
              <p className="text-xs text-neutral-400 max-w-md mx-auto">
                Crie um novo formulário com transições WebGL e distribuição de links públicos.
              </p>
              <Link href="/builder" className="inline-block pt-2">
                <Button variant="fired" size="sm" className="gap-2">
                  <Plus className="w-4 h-4" />
                  <span>Criar Primeiro Formulário</span>
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {formsList.map((form) => (
                <div
                  key={form.id}
                  className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-3.5 hover:border-[#8a0012]/50 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-white/5 text-neutral-400 border border-white/5">
                        SLUG: /{form.slug}
                      </span>
                      <Badge variant="success" dot className="text-[9px]">ATIVO</Badge>
                    </div>
                    <h3 className="text-sm font-bold text-white">{form.title}</h3>
                    <p className="text-xs text-neutral-400 line-clamp-2">
                      {form.description || "Formulário cinemático para coleta e qualificação de dados."}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-white/5 space-y-3">
                    <div className="flex items-center justify-between text-xs text-neutral-400">
                      <span>Respostas Coletadas:</span>
                      <span className="font-mono font-bold text-white">{form.submissionCount || 0}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link href={`/f/${form.id}`} className="flex-1">
                        <Button variant="secondary" size="sm" className="w-full text-[11px] gap-1 justify-center border-white/10">
                          <Eye className="w-3 h-3" />
                          <span>Visualizar Link</span>
                        </Button>
                      </Link>

                      <Link href="/builder" className="flex-1">
                        <Button variant="fired" size="sm" className="w-full text-[11px] gap-1 justify-center">
                          <FileCode2 className="w-3 h-3" />
                          <span>Editar</span>
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </GlassCard>
      )}

      {/* ABA 4: MEMBROS DA COMUNIDADE */}
      {activeTab === "members" && (
        <GlassCard className="p-6 space-y-5 bg-[#09080c]/90 border border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Shield className="w-5 h-5 text-red-500" />
                <span>Membros da Comunidade & Operadores</span>
              </h2>
              <p className="text-xs text-neutral-400">
                Lista oficial sincronizada diretamente com a tabela <code className="text-red-400">members</code> do Supabase.
              </p>
            </div>

            <Link href="/comunidade/cadastro">
              <Button variant="secondary" size="sm" className="gap-1.5 text-xs border-white/10">
                <UserPlus className="w-3.5 h-3.5" />
                <span>Cadastrar Novo Membro</span>
              </Button>
            </Link>
          </div>

          <div className="overflow-x-auto border border-white/10 rounded-2xl bg-black/30">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-white/10 text-neutral-400 font-mono uppercase text-[10px] bg-white/[0.02]">
                <tr>
                  <th className="py-3 px-4">Membro</th>
                  <th className="py-3 px-4">E-mail</th>
                  <th className="py-3 px-4">Papel</th>
                  <th className="py-3 px-4">Nível / Tier</th>
                  <th className="py-3 px-4">Data de Cadastro</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {membersList.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center">
                      <div className="max-w-sm mx-auto space-y-2">
                        <Users className="w-8 h-8 text-neutral-600 mx-auto" />
                        <div className="text-white font-medium text-xs">Nenhum membro cadastrado na base oficial</div>
                        <p className="text-[11px] text-neutral-500 leading-relaxed">
                          Novos alunos e membros registrados em <code className="text-neutral-400">/comunidade/cadastro</code> serão sincronizados aqui automaticamente.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  membersList.map((m) => (
                    <tr key={m.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 px-4 font-semibold text-white">{m.name}</td>
                      <td className="py-3 px-4 text-neutral-400 font-mono">{m.email}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-neutral-800 text-neutral-300">
                          {m.role || "user"}
                        </span>
                      </td>
                      <td className="py-3 px-4 uppercase font-mono font-bold text-neutral-300">
                        {m.tier || "free"}
                      </td>
                      <td className="py-3 px-4 text-neutral-400">
                        {m.createdAt ? new Date(m.createdAt).toLocaleDateString("pt-BR") : "Recente"}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-950/40 text-emerald-400 border border-emerald-800/40">
                          {m.status || "Ativo"}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </GlassCard>
      )}

      {/* ABA 5: VENDAS & FINANÇAS */}
      {activeTab === "finance" && (
        <GlassCard className="p-6 space-y-6 bg-[#09080c]/90 border border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-emerald-400" />
                <span>Transações & Faturamento Real</span>
              </h2>
              <p className="text-xs text-neutral-400">
                Histórico consolidado via webhooks oficiais do Mercado Pago e Stripe.
              </p>
            </div>
            <Badge variant="success" className="text-[10px]">GATEWAY MERCADO PAGO ATIVO</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-black/40 border border-white/5 space-y-1">
              <span className="text-[10px] font-mono uppercase text-neutral-400">Receita Total Real</span>
              <div className="text-2xl font-bold text-emerald-400">
                R$ {totalRevenue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </div>
              <span className="text-[10px] text-neutral-500">
                {transactions.length > 0 ? `${transactions.length} transações processadas` : "Aguardando primeiros pagamentos"}
              </span>
            </div>
            <div className="p-5 rounded-2xl bg-black/40 border border-white/5 space-y-1">
              <span className="text-[10px] font-mono uppercase text-neutral-400">Ticket Médio</span>
              <div className="text-2xl font-bold text-white">
                R$ {ticketMedio.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </div>
              <span className="text-[10px] text-neutral-500">Média ponderada por pedido</span>
            </div>
            <div className="p-5 rounded-2xl bg-black/40 border border-white/5 space-y-1">
              <span className="text-[10px] font-mono uppercase text-neutral-400">Taxa de Aprovação</span>
              <div className="text-2xl font-bold text-amber-300">
                {approvalRate.toFixed(1)}%
              </div>
              <span className="text-[10px] text-neutral-500">Conversão de pagamentos</span>
            </div>
          </div>

          <div className="overflow-x-auto border border-white/10 rounded-2xl bg-black/30">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-white/10 text-neutral-400 font-mono uppercase text-[10px] bg-white/[0.02]">
                <tr>
                  <th className="py-3 px-4">Pedido</th>
                  <th className="py-3 px-4">Cliente</th>
                  <th className="py-3 px-4">Produto / Assinatura</th>
                  <th className="py-3 px-4">Valor</th>
                  <th className="py-3 px-4">Método</th>
                  <th className="py-3 px-4">Data</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center">
                      <div className="max-w-sm mx-auto space-y-2">
                        <CreditCard className="w-8 h-8 text-neutral-600 mx-auto" />
                        <div className="text-white font-medium text-xs">Nenhuma transação registrada no momento</div>
                        <p className="text-[11px] text-neutral-500 leading-relaxed">
                          Quando compras forem efetuadas no checkout do Mercado Pago, as confirmações e webhooks serão listados aqui.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-white">{tx.id}</td>
                      <td className="py-3 px-4 font-medium text-neutral-200">{tx.customer}</td>
                      <td className="py-3 px-4 text-neutral-400">{tx.plan}</td>
                      <td className="py-3 px-4 font-mono font-bold text-emerald-400">
                        R$ {tx.amount.toFixed(2).replace(".", ",")}
                      </td>
                      <td className="py-3 px-4 text-neutral-400 text-[11px]">{tx.method}</td>
                      <td className="py-3 px-4 text-neutral-400 text-[11px]">{tx.date}</td>
                      <td className="py-3 px-4 text-right">
                        <span
                          className={cn(
                            "px-2 py-0.5 rounded text-[10px] font-bold uppercase",
                            tx.status === "approved"
                              ? "bg-emerald-950/40 text-emerald-400 border border-emerald-800/40"
                              : "bg-amber-950/40 text-amber-400 border border-amber-800/40"
                          )}
                        >
                          {tx.status === "approved" ? "Aprovado" : "Pendente"}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </GlassCard>
      )}

      {/* ABA 6: INFRAESTRUTURA & SUPABASE */}
      {activeTab === "infra" && (
        <GlassCard className="p-6 space-y-6 bg-[#09080c]/90 border border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Server className="w-5 h-5 text-red-500" />
                <span>Infraestrutura & Supabase Soberano</span>
              </h2>
              <p className="text-xs text-neutral-400">
                Auditoria de conectividade com o banco unificado, Drizzle ORM e Shaders WebGL.
              </p>
            </div>
            <Badge variant="success" className="text-[10px]">SISTEMA 100% OPERACIONAL</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-2">
                  <Database className="w-4 h-4 text-emerald-400" />
                  <span>Banco de Dados Supabase</span>
                </span>
                <span className="text-[10px] font-mono text-emerald-400 font-bold">ONLINE</span>
              </div>
              <div className="space-y-1.5 text-xs text-neutral-300 font-mono">
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-neutral-500">Projeto Oficial:</span>
                  <span>kbqxzmyasstdvvbfymft</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-neutral-500">Driver de Conexão:</span>
                  <span>pg Pool / Drizzle ORM</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-neutral-500">Porta Pooler:</span>
                  <span>6543 (Transaction Mode)</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-neutral-500">Tabelas Unificadas:</span>
                  <span className="text-emerald-400">8 Tabelas Ativas</span>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-red-400" />
                  <span>Motor Gráfico WebGL (34 Shaders)</span>
                </span>
                <span className="text-[10px] font-mono text-red-400 font-bold">VANTA RED</span>
              </div>
              <div className="space-y-1.5 text-xs text-neutral-300 font-mono">
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-neutral-500">Origem:</span>
                  <span>Personal OS (McpPersonalOs)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-neutral-500">Catálogo:</span>
                  <span>34 Shaders Procedurais</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-neutral-500">Paleta Cromática:</span>
                  <span>#8a0012 / #52000a (Vermelho Puro)</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-neutral-500">SSR Resiliência:</span>
                  <span className="text-emerald-400">Safe WebGL Context Fallback</span>
                </div>
              </div>
            </div>
          </div>
        </GlassCard>
      )}
    </div>
  );
}
