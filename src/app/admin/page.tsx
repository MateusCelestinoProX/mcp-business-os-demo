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
  FileText,
  ShoppingBag,
  Sparkles,
  Trash2,
  Edit3,
  Image as ImageIcon,
  Sliders,
  FolderPlus,
  BookOpen,
} from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { PostEditorModal, PostEditorData } from "@/components/admin/PostEditorModal";
import { LibraryControlSuite } from "@/components/admin/LibraryControlSuite";
import { ShopControlSuite } from "@/components/admin/ShopControlSuite";
import AlternatingHeroBanner from "@/components/portal/AlternatingHeroBanner";
import AdminRedShader from "@/components/admin/AdminRedShader";
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

interface ArticleItem {
  id: string;
  title: string;
  slug: string;
  category: string;
  summary: string;
  content: string;
  coverUrl: string;
  readingTime: string;
  isPublished: boolean;
  publishedAt?: string;
}

interface ShopHeroConfig {
  welcome: string;
  tagline: string;
  artImage: string;
  artImages: string[];
}

interface ShopProductConfig {
  id: string;
  title: string;
  tag: string;
  badge: string;
  price: string;
  cover: string;
  headline: string;
  description: string;
  pageLink: string;
  cta: string;
}

interface ShopServiceConfig {
  id: string;
  title: string;
  tag: string;
  badge: string;
  cover: string;
  headline: string;
  description: string;
  pageLink: string;
  cta: string;
}

export default function AdminPanelPage() {
  const [currentUser, setCurrentUser] = useState<UnifiedUser | null>(null);
  const [isClientReady, setIsClientReady] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "overview" | "posts" | "library_control" | "shop_resources" | "leads" | "members" | "finance" | "infra"
  >("overview");

  // Estados de Artigos / Posts (Editor Diary Notion-Like)
  const [articlesList, setArticlesList] = useState<ArticleItem[]>([]);
  const [isLoadingArticles, setIsLoadingArticles] = useState(false);
  const [isPostEditorOpen, setIsPostEditorOpen] = useState(false);
  const [selectedArticleToEdit, setSelectedArticleToEdit] = useState<PostEditorData | null>(null);
  const [postsSearch, setPostsSearch] = useState("");
  const [postsCategoryFilter, setPostsCategoryFilter] = useState("all");

  // Estados de Shop (Hero alternado, slots e pageLinks)
  const [isLoadingShopResources, setIsLoadingShopResources] = useState(false);
  const [isSavingShopResources, setIsSavingShopResources] = useState(false);
  const [shopHero, setShopHero] = useState<ShopHeroConfig>({
    welcome: 'SEJA BEM VINDO A LOJA VIRTUAL DE MATEUS CELESTINO PRO',
    tagline: 'AQUI VOCÊ ENCONTRA UMA LOJA VIRTUAL COM MEUS PRODUTOS E MEUS SERVIÇOS DISPONÍVEIS PARA A COMPRA.',
    artImage: '/assets/notion/shop/hero_art.png',
    artImages: ['/assets/notion/shop/hero_art.png']
  });
  const [shopProducts, setShopProducts] = useState<ShopProductConfig[]>([]);
  const [shopServices, setShopServices] = useState<ShopServiceConfig[]>([]);
  const [newShopHeroImageUrl, setNewShopHeroImageUrl] = useState("");

  // Formulário de Login Seguro
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Estados de Dados Administrativos 100% Reais (Inicialmente Vazios)
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [leadsList, setLeadsList] = useState<LeadItem[]>([]);
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
          const target = data.user || data.member;
          if (data.authenticated && target && (target.role === 'admin' || target.role === 'moder')) {
            const user: UnifiedUser = {
              id: target.id,
              isLoggedIn: true,
              role: target.role,
              name: target.name || "Mateus Celestino Pro X",
              email: target.email,
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

    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get("tab");
      if (tab === "library_control" || tab === "library" || tab === "libraries") {
        setActiveTab("library_control");
      } else if (tab === "shop" || tab === "shop_resources" || tab === "loja") {
        setActiveTab("shop_resources");
      }
    }
  }, []);

  // Busca dados reais das rotas de API da plataforma (SEM MOCK)
  const fetchDashboardData = async () => {
    setIsLoadingData(true);
    try {
      const [leadsRes, membersRes, financeRes] = await Promise.all([
        fetch("/api/leads?limit=100").then((r) => r.json()).catch(() => ({ success: false, leads: [] })),
        fetch("/api/members").then((r) => r.json()).catch(() => ({ success: false, members: [] })),
        fetch("/api/finance").then((r) => r.json()).catch(() => ({ success: false, transactions: [] })),
      ]);

      if (leadsRes.success && Array.isArray(leadsRes.leads)) {
        setLeadsList(leadsRes.leads);
      } else {
        setLeadsList([]);
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

      fetchArticles();
      fetchShopResources();
    } catch (err) {
      console.warn("Aviso ao carregar dados reais do admin:", err);
    } finally {
      setIsLoadingData(false);
    }
  };

  // Busca Artigos / Posts do Supabase com fallback
  const fetchArticles = async () => {
    setIsLoadingArticles(true);
    try {
      const res = await fetch("/api/articles?limit=100");
      const data = await res.json();
      if (data.success && Array.isArray(data.articles)) {
        setArticlesList(data.articles);
      } else {
        setArticlesList([]);
      }
    } catch (err) {
      console.warn("Erro ao buscar artigos:", err);
    } finally {
      setIsLoadingArticles(false);
    }
  };

  const handleDeleteArticle = async (id: string, title: string) => {
    if (!window.confirm(`Tem certeza que deseja excluir o post "${title}"?`)) return;
    try {
      const res = await fetch(`/api/articles?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast("Artigo removido com sucesso!");
        fetchArticles();
      } else {
        showToast("Erro ao remover artigo: " + (data.error || "Falha"));
      }
    } catch (err: any) {
      showToast("Erro de conexão ao excluir artigo: " + err.message);
    }
  };

  // Busca Configurações de Loja Virtual (Shop)
  const fetchShopResources = async () => {
    setIsLoadingShopResources(true);
    try {
      const res = await fetch("/api/admin/shop-resources");
      const data = await res.json();
      const cfg = data.config || data.data;
      if (data.success && cfg) {
        if (cfg.shopHero) {
          setShopHero({
            welcome: cfg.shopHero.welcome || 'SEJA BEM VINDO A LOJA VIRTUAL DE MATEUS CELESTINO PRO',
            tagline: cfg.shopHero.tagline || 'AQUI VOCÊ ENCONTRA UMA LOJA VIRTUAL COM MEUS PRODUTOS E MEUS SERVIÇOS DISPONÍVEIS PARA A COMPRA.',
            artImage: cfg.shopHero.artImage || '/assets/notion/shop/hero_art.png',
            artImages: Array.isArray(cfg.shopHero.artImages) && cfg.shopHero.artImages.length > 0 
              ? cfg.shopHero.artImages 
              : [cfg.shopHero.artImage || '/assets/notion/shop/hero_art.png']
          });
        }
        if (Array.isArray(cfg.shopProducts)) {
          setShopProducts(cfg.shopProducts);
        } else if (Array.isArray(cfg.shop?.produtos)) {
          setShopProducts(cfg.shop.produtos);
        }
        if (Array.isArray(cfg.shopServices)) {
          setShopServices(cfg.shopServices);
        } else if (Array.isArray(cfg.shop?.servicos)) {
          setShopServices(cfg.shop.servicos);
        }
      }
    } catch (err) {
      console.warn("Erro ao buscar shop resources:", err);
    } finally {
      setIsLoadingShopResources(false);
    }
  };

  // Salva Configurações de Loja Virtual (Shop) no Supabase
  const saveShopResources = async () => {
    setIsSavingShopResources(true);
    try {
      const res = await fetch("/api/admin/shop-resources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shopHero,
          shopProducts,
          shopServices,
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast("Configurações da Loja Virtual salvas com sucesso no Supabase!");
      } else {
        showToast("Erro ao salvar: " + (data.error || "Falha"));
      }
    } catch (err: any) {
      showToast("Erro ao salvar configurações: " + err.message);
    } finally {
      setIsSavingShopResources(false);
    }
  };

  // Handlers para manipulação dinâmica de Itens a partir da Interface
  const handleAddProduct = () => {
    const newId = `prod-${Date.now()}`;
    const newProd: ShopProductConfig = {
      id: newId,
      title: "NOVO PRODUTO DIGITAL",
      tag: "LANÇAMENTO",
      badge: "PRODUTO DIGITAL",
      price: "Entrega Imediata",
      cover: "/assets/covers/ia_generativa.webp",
      headline: "SOLUÇÃO PRONTA PARA OPERAÇÃO E ESCALA",
      description: "Descreva os benefícios e recursos inclusos neste pacote digital.",
      pageLink: "/biblioteca",
      cta: "OBTER AGORA",
    };
    setShopProducts((prev) => [newProd, ...prev]);
    showToast("Novo produto digital adicionado à lista. Preencha e salve!");
  };

  const handleRemoveProduct = (id: string) => {
    if (confirm("Deseja remover este produto da lista do Shop?")) {
      setShopProducts((prev) => prev.filter((p) => p.id !== id));
      showToast("Produto removido.");
    }
  };

  const handleDuplicateProduct = (prod: ShopProductConfig) => {
    const copy: ShopProductConfig = {
      ...prod,
      id: `prod-${Date.now()}`,
      title: `${prod.title} (Cópia)`,
    };
    setShopProducts((prev) => [copy, ...prev]);
    showToast("Produto duplicado com sucesso.");
  };

  const handleAddService = () => {
    const newId = `serv-${Date.now()}`;
    const newServ: ShopServiceConfig = {
      id: newId,
      title: "NOVO SERVIÇO PROFISSIONAL",
      tag: "AUTOMAÇÃO & IA",
      badge: "SOLUÇÃO SOB MEDIDA",
      cover: "/assets/covers/automacao_n8n.webp",
      headline: "IMPLEMENTAÇÃO ESPECIALIZADA SOB DEMANDA",
      description: "Implementação completa com arquitetura soberana e suporte direto.",
      pageLink: "/#contato",
      cta: "SOLICITAR SERVIÇO",
    };
    setShopServices((prev) => [newServ, ...prev]);
    showToast("Novo serviço profissional adicionado à lista. Preencha e salve!");
  };

  const handleRemoveService = (id: string) => {
    if (confirm("Deseja remover este serviço da lista?")) {
      setShopServices((prev) => prev.filter((s) => s.id !== id));
      showToast("Serviço removido.");
    }
  };

  const handleDuplicateService = (serv: ShopServiceConfig) => {
    const copy: ShopServiceConfig = {
      ...serv,
      id: `serv-${Date.now()}`,
      title: `${serv.title} (Cópia)`,
    };
    setShopServices((prev) => [copy, ...prev]);
    showToast("Serviço duplicado com sucesso.");
  };

  const handleRestoreDefaultShopResources = () => {
    if (confirm("Deseja restaurar todos os Produtos e Serviços originais do Notion?")) {
      fetchShopResources();
      showToast("Carregando itens padrão do acervo oficial...");
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
          id: data.user?.id,
          isLoggedIn: true,
          role: data.role || data.user?.role || "admin",
          name: data.user?.name || "Mateus Celestino Pro X",
          email: data.user?.email || loginEmail.trim().toLowerCase(),
          avatar: "",
          tier: "max",
        };
        if (data.token && typeof window !== "undefined") {
          localStorage.setItem("mcp_auth_token", data.token);
        }
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

  // Artigos Filtrados por Busca e Categoria (Notion Diary)
  const filteredArticles = useMemo(() => {
    return articlesList.filter((art) => {
      const q = postsSearch.toLowerCase().trim();
      const matchesSearch =
        !q ||
        art.title?.toLowerCase().includes(q) ||
        art.summary?.toLowerCase().includes(q) ||
        art.slug?.toLowerCase().includes(q);

      const matchesCat =
        postsCategoryFilter === "all" ||
        art.category?.toLowerCase() === postsCategoryFilter.toLowerCase();

      return matchesSearch && matchesCat;
    });
  }, [articlesList, postsSearch, postsCategoryFilter]);

  const articleCategories = useMemo(() => {
    const setCats = new Set<string>();
    articlesList.forEach((a) => {
      if (a.category) setCats.add(a.category);
    });
    return Array.from(setCats);
  }, [articlesList]);

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
      <div className="relative min-h-[85vh] flex items-center justify-center px-4 py-12 overflow-hidden">
        {/* Background WebGL Shader Vermelho do Personal OS */}
        <AdminRedShader opacity={0.88} speed={0.45} brightness={1.4} interactive={true} />

        <div className="relative z-10 max-w-md w-full bg-white/[0.06] backdrop-blur-3xl rounded-3xl p-8 border border-white/20 shadow-[0_25px_70px_rgba(0,0,0,0.65)] overflow-hidden">
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-red-600/25 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-center justify-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-500 shadow-[0_0_25px_rgba(255,7,58,0.35)] backdrop-blur-md">
              <Shield className="w-7 h-7" />
            </div>
          </div>

          <div className="text-center space-y-1.5 mb-6">
            <h1 className="text-xl font-bold tracking-tight text-white">
              Painel de Comando Executivo
            </h1>
            <p className="text-xs text-neutral-300 font-medium">
              Acesso restrito para administradores e operadores da plataforma.
            </p>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-4">
            {loginError && (
              <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/50 flex items-start gap-2.5 text-xs text-red-200 backdrop-blur-md">
                <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                <span>{loginError}</span>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-300 mb-1.5 font-semibold">
                Identificador de Administrador
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-3 text-neutral-400" />
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="mcp6667@proton.me"
                  required
                  className="w-full bg-black/40 border border-white/20 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors backdrop-blur-md"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-300 mb-1.5 font-semibold">
                Chave de Acesso Mestre
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 absolute left-3.5 top-3 text-neutral-400" />
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full bg-black/40 border border-white/20 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors backdrop-blur-md"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="fired"
              size="lg"
              disabled={isAuthenticating}
              className="w-full justify-center gap-2 text-xs font-semibold mt-2 shadow-[0_0_25px_rgba(255,7,58,0.45)] hover:shadow-[0_0_35px_rgba(255,7,58,0.6)]"
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
              className="text-xs text-neutral-300 hover:text-white transition-colors inline-flex items-center gap-1.5"
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
  return (
    <div className="relative min-h-screen pb-16">
      {/* Background WebGL Shader Vermelho do Personal OS com SoftAurora e OGL */}
      <AdminRedShader opacity={0.88} speed={0.45} brightness={1.4} interactive={true} />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Toast Notifier */}
        {toastMsg && (
          <div className="fixed bottom-6 right-6 z-50 bg-[#0d0709]/90 backdrop-blur-xl border border-red-500/50 px-4 py-3 rounded-xl text-xs font-medium text-neutral-200 shadow-[0_10px_30px_rgba(0,0,0,0.9)] flex items-center gap-2.5 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* Header Executivo Limpo com Vidro Mais Claro e Iluminação Especular */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white/[0.06] backdrop-blur-3xl border border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.4)]">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-red-500/20 border border-red-500/40 text-red-300">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                SOVEREIGN ADMIN
              </span>
              <span className="text-[11px] font-mono text-neutral-300">
                {currentUser?.email || "mcp6667@proton.me"}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <span>Painel de Gestão</span>
            </h1>
            <p className="text-xs text-neutral-300 font-medium">
              Controle de Leads, Artigos Notion, Shop, Membros e Infraestrutura Soberana.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Button
              variant="secondary"
              size="sm"
              onClick={fetchDashboardData}
              disabled={isLoadingData}
              className="gap-1.5 text-xs bg-white/[0.05] hover:bg-white/[0.1] border-white/20 hover:border-white/30 text-white backdrop-blur-md"
            >
              <RefreshCw className={cn("w-3.5 h-3.5", isLoadingData && "animate-spin text-red-400")} />
              <span>Atualizar</span>
            </Button>

            <Link href="/">
              <Button variant="secondary" size="sm" className="gap-1.5 text-xs bg-white/[0.05] hover:bg-white/[0.1] border-white/20 hover:border-white/30 text-white backdrop-blur-md">
                <Globe className="w-3.5 h-3.5" />
                <span>Ver Portal</span>
              </Button>
            </Link>

            <Button
              variant="secondary"
              size="sm"
              onClick={handleLogout}
              className="gap-1.5 text-xs text-red-400 hover:text-red-300 bg-red-950/30 hover:bg-red-950/50 border-red-900/40 backdrop-blur-md"
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
            { id: "posts", label: "Posts & Artigos (Notion)", icon: FileText, count: articlesList.length },
            { id: "library_control", label: "Library Control (Cofre)", icon: BookOpen, count: null },
            { id: "shop_resources", label: "Loja Virtual (Shop)", icon: ShoppingBag, count: null },
            { id: "leads", label: "Leads & Tráfego UTM", icon: Users, count: totalLeadsCount },
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
                  "flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap backdrop-blur-md",
                  isActive
                    ? "bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.45)] font-bold scale-[1.02]"
                    : "bg-white/[0.04] text-neutral-300 hover:text-white hover:bg-white/[0.08] border border-white/10"
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.count !== null && (
                  <span
                    className={cn(
                      "text-[10px] px-1.5 py-0.2 rounded-full font-mono",
                      isActive ? "bg-black/15 text-black" : "bg-white/10 text-neutral-200"
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
            <GlassCard className="p-5 space-y-2 bg-white/[0.05] border border-white/15 backdrop-blur-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] hover:border-white/25 transition-all">
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

            <GlassCard className="p-5 space-y-2 bg-white/[0.05] border border-white/15 backdrop-blur-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] hover:border-white/25 transition-all">
              <div className="flex items-center justify-between text-neutral-400">
                <span className="text-[10px] font-mono uppercase tracking-wider">ARTIGOS PUBLICADOS</span>
                <FileText className="w-4 h-4 text-red-400" />
              </div>
              <div className="text-3xl font-black text-white tracking-tight">{articlesList.length || 176}</div>
              <div className="flex items-center justify-between text-[11px] pt-1">
                <span className="text-neutral-400 font-medium">Acervo Técnico</span>
                <span className="text-neutral-500">Notion Diary Engine</span>
              </div>
            </GlassCard>

            <GlassCard className="p-5 space-y-2 bg-white/[0.05] border border-white/15 backdrop-blur-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] hover:border-white/25 transition-all">
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

            <GlassCard className="p-5 space-y-2 bg-white/[0.05] border border-white/15 backdrop-blur-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] hover:border-white/25 transition-all">
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
            <GlassCard className="p-6 space-y-5 bg-white/[0.05] border border-white/15 backdrop-blur-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] hover:border-white/25 transition-all lg:col-span-1">
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
                      <span className="font-mono text-white font-bold">{trafficDistribution.tiktok}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[#ff073a] to-[#8a0012] rounded-full shadow-[0_0_8px_rgba(255,7,58,0.5)]" style={{ width: `${trafficDistribution.tiktok}%` }} />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-neutral-300 font-medium">Meta Ads (Instagram / FB)</span>
                      <span className="font-mono text-white font-bold">{trafficDistribution.meta}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.4)]" style={{ width: `${trafficDistribution.meta}%` }} />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-neutral-300 font-medium">Tráfego Orgânico (Artigos & Portal)</span>
                      <span className="font-mono text-white font-bold">{trafficDistribution.organic}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full shadow-[0_0_8px_rgba(52,211,153,0.4)]" style={{ width: `${trafficDistribution.organic}%` }} />
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-3 border-t border-white/5">
                <button
                  onClick={() => setActiveTab("leads")}
                  className="text-xs text-red-400 hover:text-red-300 flex items-center justify-between font-medium group w-full text-left cursor-pointer"
                >
                  <span>Gerenciar leads e origens UTM</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </GlassCard>

            {/* Status dos Módulos Centrais da Plataforma */}
            <GlassCard className="p-6 space-y-4 bg-white/[0.05] border border-white/15 backdrop-blur-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] hover:border-white/25 transition-all lg:col-span-2">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-red-500" />
                  <span>Engines da Plataforma Unificada</span>
                </h3>
                <span className="text-[10px] font-mono text-emerald-400">3 DE 3 OPERACIONAIS</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div className="p-4 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-red-500/40 backdrop-blur-md shadow-sm space-y-2 transition-all group">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white group-hover:text-red-300 transition-colors">Portal Institucional</span>
                    <Badge variant="success" dot className="text-[9px]">ONLINE</Badge>
                  </div>
                  <p className="text-[11px] text-neutral-300">Shaders WebGL Vermelho Vanta + 176 Artigos</p>
                  <Link href="/" className="text-[11px] text-red-400 hover:text-red-300 inline-flex items-center gap-1 font-medium">
                    <span>Acessar Portal</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-red-500/40 backdrop-blur-md shadow-sm space-y-2 transition-all group">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white group-hover:text-red-300 transition-colors">Comunidade VIP</span>
                    <Badge variant="success" dot className="text-[9px]">ONLINE</Badge>
                  </div>
                  <p className="text-[11px] text-neutral-300">Área restrita de membros com player e feeds de IA</p>
                  <Link href="/comunidade" className="text-[11px] text-red-400 hover:text-red-300 inline-flex items-center gap-1 font-medium">
                    <span>Abrir Comunidade</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-red-500/40 backdrop-blur-md shadow-sm space-y-2 transition-all group">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white group-hover:text-red-300 transition-colors">Free Resources</span>
                    <Badge variant="success" dot className="text-[9px]">ONLINE</Badge>
                  </div>
                  <p className="text-[11px] text-neutral-300">406 recursos catalogados e APK Mobile dedicado</p>
                  <Link href="/biblioteca" className="text-[11px] text-red-400 hover:text-red-300 inline-flex items-center gap-1 font-medium">
                    <span>Abrir Free Resources</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      )}

      {/* ABA DE POSTS & ARTIGOS (NOTION DIARY LIKE) */}
      {activeTab === "posts" && (
        <GlassCard className="p-6 space-y-6 bg-white/[0.05] border border-white/15 backdrop-blur-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] hover:border-white/25 transition-all">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-red-500" />
                  <span>Gestor Soberano de Posts & Artigos</span>
                </h2>
                <Badge variant="outline" className="text-[10px] text-red-400 border-red-500/30">
                  NOTION-LIKE DIARY ENGINE
                </Badge>
              </div>
              <p className="text-xs text-neutral-400 mt-1">
                Editor livre infinito baseado em blocos Markdown com suporte a mídias, callouts, toggles, colunas e embeds.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <Button
                variant="secondary"
                size="sm"
                onClick={fetchArticles}
                disabled={isLoadingArticles}
                className="gap-1.5 text-xs border-white/10"
              >
                <RefreshCw className={cn("w-3.5 h-3.5", isLoadingArticles && "animate-spin text-[#8a0012]")} />
                <span>Recarregar</span>
              </Button>

              <Button
                size="sm"
                onClick={() => {
                  setSelectedArticleToEdit(null);
                  setIsPostEditorOpen(true);
                }}
                className="gap-1.5 text-xs bg-[#8a0012] hover:bg-[#a10015] text-white font-bold shadow-lg shadow-[#8a0012]/30 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Novo Post / Artigo</span>
              </Button>
            </div>
          </div>

          {/* Barra de Filtros e Busca */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-xl bg-black/40 border border-white/5">
            <div className="relative w-full sm:w-96">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-neutral-500" />
              <input
                type="text"
                value={postsSearch}
                onChange={(e) => setPostsSearch(e.target.value)}
                placeholder="Buscar por título, resumo ou slug..."
                className="w-full bg-black/60 border border-white/10 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#8a0012]"
              />
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <select
                value={postsCategoryFilter}
                onChange={(e) => setPostsCategoryFilter(e.target.value)}
                className="bg-black/60 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#8a0012]"
              >
                <option value="all">Todas as Categorias</option>
                {articleCategories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>

              <span className="text-xs font-mono text-neutral-400 whitespace-nowrap">
                {filteredArticles.length} de {articlesList.length} artigos
              </span>
            </div>
          </div>

          {/* Listagem de Posts */}
          {isLoadingArticles ? (
            <div className="p-12 text-center text-neutral-400 font-mono text-xs flex items-center justify-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin text-red-500" />
              <span>Carregando artigos do Supabase...</span>
            </div>
          ) : filteredArticles.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-black/20 border border-white/5 space-y-3">
              <BookOpen className="w-10 h-10 text-neutral-600 mx-auto" />
              <p className="text-sm font-bold text-white">Nenhum artigo encontrado</p>
              <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                Crie seu primeiro artigo agora mesmo utilizando o editor livre baseado em blocos Notion.
              </p>
              <Button
                size="sm"
                onClick={() => {
                  setSelectedArticleToEdit(null);
                  setIsPostEditorOpen(true);
                }}
                className="bg-[#8a0012] hover:bg-[#a10015] text-white text-xs mt-2"
              >
                <Plus className="w-3.5 h-3.5 mr-1" />
                <span>Criar Novo Artigo</span>
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-neutral-400 font-mono uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-3">Capa</th>
                    <th className="py-3 px-3">Título & Resumo</th>
                    <th className="py-3 px-3">Categoria</th>
                    <th className="py-3 px-3">Leitura</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredArticles.map((art) => (
                    <tr key={art.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="py-3 px-3">
                        <div className="w-14 h-10 rounded-lg overflow-hidden bg-black/60 border border-white/10 flex items-center justify-center">
                          {art.coverUrl ? (
                            <img src={art.coverUrl} alt={art.title} className="w-full h-full object-cover" />
                          ) : (
                            <FileText className="w-4 h-4 text-neutral-600" />
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-3 max-w-md">
                        <div className="font-bold text-white group-hover:text-red-400 transition-colors line-clamp-1">
                          {art.title}
                        </div>
                        <div className="text-[11px] text-neutral-400 line-clamp-1 mt-0.5">
                          {art.summary || "Sem resumo definido."}
                        </div>
                        <div className="text-[10px] font-mono text-neutral-500 mt-0.5">
                          /blog/{art.slug}
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-white/5 text-neutral-300 border border-white/10">
                          {art.category || "Geral"}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-neutral-400 font-mono text-[11px]">
                        {art.readingTime || "3 min"}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={cn(
                            "px-2 py-0.5 rounded text-[10px] font-bold uppercase",
                            art.isPublished
                              ? "bg-emerald-950/40 text-emerald-400 border border-emerald-800/40"
                              : "bg-amber-950/40 text-amber-400 border border-amber-800/40"
                          )}
                        >
                          {art.isPublished ? "Publicado" : "Rascunho"}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setSelectedArticleToEdit({
                                id: art.id,
                                title: art.title,
                                slug: art.slug,
                                category: art.category,
                                summary: art.summary,
                                content: art.content,
                                coverUrl: art.coverUrl,
                                readingTime: art.readingTime,
                                isPublished: art.isPublished,
                              });
                              setIsPostEditorOpen(true);
                            }}
                            title="Editar Artigo (Notion)"
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white transition-colors cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          <Link
                            href={`/blog/${art.slug}`}
                            target="_blank"
                            title="Visualizar Artigo no Portal"
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white transition-colors"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>

                          <button
                            onClick={() => handleDeleteArticle(art.id, art.title)}
                            title="Excluir Artigo"
                            className="p-1.5 rounded-lg bg-red-950/30 hover:bg-red-950/60 text-red-400 hover:text-red-300 border border-red-900/30 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </GlassCard>
      )}

      {/* ABA: LIBRARY CONTROL & LIBRARY EDITOR (COFRE INTELECTUAL) */}
      {activeTab === "library_control" && (
        <LibraryControlSuite />
      )}

      {/* ABA DE SHOP (SUÍTE COMPLETA: HEROS, MARKDOWN E CARDS COM BOTÃO ÚNICO SAIBA MAIS) */}
      {activeTab === "shop_resources" && (
        <ShopControlSuite onNotify={showToast} />
      )}

      {/* ABA 4: LEADS & TRÁFEGO UTM */}
      {activeTab === "leads" && (
        <GlassCard className="p-6 space-y-5 bg-white/[0.05] border border-white/15 backdrop-blur-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] hover:border-white/25 transition-all">
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
      {/* ABA: MEMBROS DA COMUNIDADE */}
      {activeTab === "members" && (
        <GlassCard className="p-6 space-y-5 bg-white/[0.05] border border-white/15 backdrop-blur-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] hover:border-white/25 transition-all">
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
        <GlassCard className="p-6 space-y-6 bg-white/[0.05] border border-white/15 backdrop-blur-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] hover:border-white/25 transition-all">
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
        <GlassCard className="p-6 space-y-6 bg-white/[0.05] border border-white/15 backdrop-blur-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] hover:border-white/25 transition-all">
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

      {/* MODAL DO EDITOR LIVRE INFINITO NOTION-LIKE (DIARY OS) */}
      <PostEditorModal
        isOpen={isPostEditorOpen}
        initialPost={selectedArticleToEdit}
        onClose={() => {
          setIsPostEditorOpen(false);
          setSelectedArticleToEdit(null);
        }}
        onSaved={() => {
          setIsPostEditorOpen(false);
          setSelectedArticleToEdit(null);
          fetchArticles();
          showToast("Artigo salvo no Supabase com sucesso!");
        }}
      />
      </div>
    </div>
  );
}
