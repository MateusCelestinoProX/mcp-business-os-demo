"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Crown,
  Shield,
  FileCode2,
  Users,
  BarChart3,
  MessageSquare,
  CreditCard,
  Megaphone,
  ArrowRight,
  ExternalLink,
  Sparkles,
  Lock,
  KeyRound,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Search,
  UserCheck,
  UserX,
  Trash2,
  Plus,
} from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import {
  UserRole,
  UnifiedUser,
  getStoredUser,
  setStoredUser,
  hasAdminOrModerAccess,
  hasAdminAccess,
  DEMO_USERS,
} from "@/lib/auth/unified-auth";

export default function AdminPanelPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<UnifiedUser | null>(null);
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "builder" | "members" | "interactions" | "vendas" | "banners" | "moderators"
  >("dashboard");

  // Estados de dados da administração
  const [stats, setStats] = useState({
    totalMembers: 1420,
    vipMembers: 388,
    formsCreated: 14,
    formSubmissions: 529,
    leadsCapturados: 874,
    faturamentoTotal: 48960.0,
    activeShaders: 7,
  });

  const [membersList, setMembersList] = useState([
    { id: "m1", name: "Mateus Celestino Pro", email: "mateus@mateuscelestinopro.com", role: "admin", tier: "max", date: "Hoje" },
    { id: "m2", name: "Carlos Eduardo Mod", email: "moderador@mateuscelestinopro.com", role: "moder", tier: "vip", date: "Ontem" },
    { id: "m3", name: "Mariana Silva", email: "mariana.silva@gmail.com", role: "user", tier: "vip", date: "12/10/2026" },
    { id: "m4", name: "Lucas Rocha", email: "lucas.rocha@techcorp.io", role: "user", tier: "pro", date: "10/10/2026" },
    { id: "m5", name: "Beatriz Oliveira", email: "beatriz.designer@outlook.com", role: "visitante", tier: "free", date: "08/10/2026" },
  ]);

  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  useEffect(() => {
    const user = getStoredUser();
    setCurrentUser(user);

    // Carrega dados reais das APIs
    const loadRealData = async () => {
      try {
        const [leadsRes, formsRes] = await Promise.all([
          fetch("/api/leads").then((r) => r.json()).catch(() => ({})),
          fetch("/api/forms").then((r) => r.json()).catch(() => ({})),
        ]);

        if (leadsRes.success && typeof leadsRes.total === "number") {
          setStats((prev) => ({ ...prev, leadsCapturados: leadsRes.total }));
        }
        if (formsRes.success && Array.isArray(formsRes.forms)) {
          setStats((prev) => ({
            ...prev,
            formsCreated: formsRes.forms.length,
            formSubmissions: formsRes.forms.reduce(
              (acc: number, f: any) => acc + (f.submissionCount || 0),
              0
            ),
          }));
        }
      } catch (e) {
        console.warn("Erro ao buscar estatísticas reais da API:", e);
      }
    };

    loadRealData();
  }, []);

  // Se o usuário não estiver carregado ou não for admin/moder
  if (!currentUser || !hasAdminOrModerAccess(currentUser)) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full glass-crystal rounded-3xl p-8 border border-white/15 text-center shadow-2xl relative overflow-hidden">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto mb-5 shadow-[0_0_20px_rgba(245,158,11,0.3)]">
            <Lock className="w-8 h-8" />
          </div>

          <Badge variant="gold" className="text-[10px] mb-3">
            ÁREA RESTRITA SOBERANA
          </Badge>

          <h2 className="text-2xl font-bold text-white mb-2">
            Acesso Restrito ao Painel Admin
          </h2>
          <p className="text-xs text-neutral-300 leading-relaxed mb-6">
            Somente <strong>Moderadores</strong> e <strong>Administradores</strong> possuem permissão para acessar o Painel de Gestão e o Form Builder Cinemático.
          </p>

          <div className="space-y-3 pt-2 border-t border-white/10">
            <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block mb-2">
              Autenticação Rápida de Demonstração:
            </span>

            <Button
              variant="fired"
              size="md"
              className="w-full justify-center gap-2"
              onClick={() => {
                setStoredUser(DEMO_USERS.admin);
                setCurrentUser(DEMO_USERS.admin);
                showToast("👑 Acesso concedido como Administrador Soberano!");
              }}
            >
              <Crown className="w-4 h-4" />
              <span>Entrar como Administrador</span>
            </Button>

            <Button
              variant="secondary"
              size="md"
              className="w-full justify-center gap-2 border-amber-500/30 text-amber-300 hover:bg-amber-500/10"
              onClick={() => {
                setStoredUser(DEMO_USERS.moder);
                setCurrentUser(DEMO_USERS.moder);
                showToast("🛡️ Acesso concedido como Moderador!");
              }}
            >
              <Shield className="w-4 h-4" />
              <span>Entrar como Moderador</span>
            </Button>

            <Link href="/" className="block pt-2">
              <span className="text-xs text-neutral-400 hover:text-white transition-colors">
                ← Voltar ao Portal Institucional
              </span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isMaxAdmin = hasAdminAccess(currentUser);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 glass-crystal border border-emerald-500/50 px-5 py-3 rounded-2xl text-xs font-bold text-emerald-300 shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Top Header do Painel Admin */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400">
              MCP SOFTWARE · SISTEMA DE GESTÃO UNIFICADA
            </span>
            <span
              className={cn(
                "text-[9px] px-2 py-0.5 rounded-full font-bold uppercase",
                isMaxAdmin
                  ? "bg-red-500/20 text-red-300 border border-red-500/30"
                  : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
              )}
            >
              {isMaxAdmin ? "👑 ADMIN MAX" : "🛡️ MODERADOR"}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Painel Soberano de Gestão
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Controle integrado da Comunidade VIP, Form Builder Cinemático, Biblioteca e Leads.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/comunidade">
            <Button variant="secondary" size="sm" className="gap-1.5 text-xs">
              <Users className="w-3.5 h-3.5" />
              <span>Ver Comunidade</span>
            </Button>
          </Link>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => showToast("🔄 Dados atualizados com sucesso!")}
            className="gap-1.5 text-xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Atualizar</span>
          </Button>
        </div>
      </div>

      {/* DESTAQUE PRINCIPAL: BOTÃO E CARD EXCLUSIVO PARA O FORM BUILDER */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-red-950/60 via-[#12070a] to-black border border-red-500/30 shadow-[0_15px_40px_rgba(255,7,58,0.25)] flex flex-col lg:flex-row lg:items-center justify-between gap-6 group">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-red-600/30 text-red-400 border border-red-500/40 tracking-wider">
              ACESSO EXCLUSIVO ADMIN & MODER
            </span>
            <span className="text-xs text-neutral-400 font-mono">
              ENGINE CINEMÁTICA
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>Form Builder Cinemático</span>
            <Sparkles className="w-5 h-5 text-red-400" />
          </h2>
          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
            Construtor avançado de formulários com shaders WebGL em tempo real (Galaxy, Aurora, Particles), 11 cores de marca registradas, suporte a multi-etapas, integração automática com Notion e Resend, e links públicos instantâneos.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-shrink-0">
          <Link href="/builder/dashboard">
            <Button variant="secondary" size="md" className="gap-2 text-xs">
              <BarChart3 className="w-4 h-4" />
              <span>Dashboard de Forms ({stats.formsCreated})</span>
            </Button>
          </Link>

          <Link href="/builder">
            <Button
              variant="fired"
              size="lg"
              className="gap-2 text-xs font-bold shadow-[0_0_25px_rgba(255,7,58,0.6)] hover:scale-105 active:scale-95 transition-all"
            >
              <FileCode2 className="w-4 h-4" />
              <span>Abrir Construtor de Formulários</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Tabs de Navegação da Gestão da Comunidade */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-white/10 hide-scrollbar">
        {[
          { id: "dashboard", label: "📊 Métricas & Stats", icon: BarChart3 },
          { id: "members", label: "👥 Gestão de Membros", icon: Users },
          { id: "interactions", label: "💬 Moderação de Posts", icon: MessageSquare },
          { id: "vendas", label: "💳 Transações & Vendas", icon: CreditCard },
          { id: "banners", label: "📢 Banners & Destaques", icon: Megaphone },
          ...(isMaxAdmin ? [{ id: "moderators", label: "🛡️ Moderadores", icon: Shield }] : []),
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap",
                isActive
                  ? "bg-white text-black shadow-lg scale-105"
                  : "bg-white/5 text-neutral-400 hover:text-white border border-white/10"
              )}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* CONTEÚDO DAS ABAS */}
      {activeTab === "dashboard" && (
        <div className="space-y-6">
          {/* Grid de Métricas Principais */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <GlassCard className="p-5 space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">
                MEMBROS TOTAIS
              </span>
              <div className="text-3xl font-black text-white">{stats.totalMembers}</div>
              <span className="text-[10px] text-emerald-400 font-semibold">
                +12% esta semana
              </span>
            </GlassCard>

            <GlassCard className="p-5 space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">
                MEMBROS VIP & PRO
              </span>
              <div className="text-3xl font-black text-amber-300">{stats.vipMembers}</div>
              <span className="text-[10px] text-amber-400 font-semibold">
                Conversão de 27.3%
              </span>
            </GlassCard>

            <GlassCard className="p-5 space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">
                LEADS CAPTURADOS
              </span>
              <div className="text-3xl font-black text-red-400">{stats.leadsCapturados}</div>
              <span className="text-[10px] text-neutral-400">Portal + Artigos</span>
            </GlassCard>

            <GlassCard className="p-5 space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">
                SUBMISSÕES DE FORMS
              </span>
              <div className="text-3xl font-black text-white">{stats.formSubmissions}</div>
              <span className="text-[10px] text-emerald-400 font-semibold">
                {stats.formsCreated} Formulários Ativos
              </span>
            </GlassCard>
          </div>

          {/* Seção de Status dos 4 Softwares Soberanos */}
          <GlassCard className="p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Shield className="w-4 h-4 text-red-400" />
              <span>Status Operacional das 4 Engines Soberanas</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">Portal Institucional</span>
                  <Badge variant="success" dot className="text-[9px]">ONLINE</Badge>
                </div>
                <p className="text-[11px] text-neutral-400">Shaders WebGL & 176 Artigos</p>
                <Link href="/" className="text-[10px] text-red-400 hover:underline block pt-1">
                  Abrir Rota /
                </Link>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">Comunidade VIP</span>
                  <Badge variant="success" dot className="text-[9px]">ONLINE</Badge>
                </div>
                <p className="text-[11px] text-neutral-400">A.I Visuals Members Area</p>
                <Link href="/comunidade" className="text-[10px] text-red-400 hover:underline block pt-1">
                  Abrir Rota /comunidade
                </Link>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">Biblioteca Galadriel</span>
                  <Badge variant="success" dot className="text-[9px]">ONLINE</Badge>
                </div>
                <p className="text-[11px] text-neutral-400">406 Recursos & APK Mobile</p>
                <Link href="/biblioteca" className="text-[10px] text-red-400 hover:underline block pt-1">
                  Abrir Rota /biblioteca
                </Link>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">Form Builder</span>
                  <Badge variant="success" dot className="text-[9px]">ONLINE</Badge>
                </div>
                <p className="text-[11px] text-neutral-400">Multi-Step Cinemático</p>
                <Link href="/builder" className="text-[10px] text-red-400 hover:underline block pt-1">
                  Abrir Rota /builder
                </Link>
              </div>
            </div>
          </GlassCard>
        </div>
      )}

      {/* ABA DE MEMBROS */}
      {activeTab === "members" && (
        <GlassCard className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white">Membros da Comunidade</h3>
              <p className="text-xs text-neutral-400">Controle de acessos, tiers e permissões</p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => showToast("Novo membro adicionado com sucesso!")}
              className="gap-1.5 text-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Adicionar Membro</span>
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-white/10 text-neutral-400 font-mono uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-3">Nome</th>
                  <th className="py-3 px-3">E-mail</th>
                  <th className="py-3 px-3">Papel</th>
                  <th className="py-3 px-3">Plano</th>
                  <th className="py-3 px-3">Cadastro</th>
                  <th className="py-3 px-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {membersList.map((m) => (
                  <tr key={m.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-3 font-semibold text-white">{m.name}</td>
                    <td className="py-3 px-3 text-neutral-400 font-mono">{m.email}</td>
                    <td className="py-3 px-3">
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded text-[10px] font-bold uppercase",
                          m.role === "admin"
                            ? "bg-red-500/20 text-red-400 border border-red-500/30"
                            : m.role === "moder"
                            ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                            : "bg-neutral-800 text-neutral-300"
                        )}
                      >
                        {m.role}
                      </span>
                    </td>
                    <td className="py-3 px-3 uppercase font-mono font-bold text-neutral-300">
                      {m.tier}
                    </td>
                    <td className="py-3 px-3 text-neutral-400">{m.date}</td>
                    <td className="py-3 px-3 text-right space-x-2">
                      {isMaxAdmin && m.role !== "admin" && (
                        <button
                          onClick={() => showToast(`Permissão de ${m.name} alterada!`)}
                          className="px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-white text-[10px] font-bold"
                        >
                          Alterar Papel
                        </button>
                      )}
                      {m.role !== "admin" && (
                        <button
                          onClick={() => showToast(`Membro ${m.name} bloqueado!`)}
                          className="px-2 py-1 rounded bg-red-500/20 hover:bg-red-500/30 text-red-300 text-[10px] font-bold"
                        >
                          Bloquear
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      )}

      {/* ABA DE INTERAÇÕES & POSTS */}
      {activeTab === "interactions" && (
        <GlassCard className="p-6 space-y-4">
          <h3 className="text-lg font-bold text-white">Moderação da Comunidade</h3>
          <p className="text-xs text-neutral-400">Comentários e postagens recentes submetidas pelos alunos</p>
          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-xs">Carlos M.</span>
                  <span className="text-[10px] text-neutral-400">há 12 minutos</span>
                  <Badge variant="success" className="text-[9px]">Aprovado</Badge>
                </div>
                <p className="text-xs text-neutral-300">
                  "Os novos prompts de Midjourney V7 na área VIP estão absurdos! Consegui criar uma campanha inteira."
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => showToast("Comentário fixado!")}
                  className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-white text-[10px] font-bold"
                >
                  Fixar
                </button>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-xs">Ana Paula</span>
                  <span className="text-[10px] text-neutral-400">há 1 hora</span>
                  <Badge variant="gold" className="text-[9px]">Pendente Moderação</Badge>
                </div>
                <p className="text-xs text-neutral-300">
                  "Alguém tem o link do vídeo de animação com Runway Gen-3?"
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => showToast("Comentário aprovado!")}
                  className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold"
                >
                  Aprovar
                </button>
              </div>
            </div>
          </div>
        </GlassCard>
      )}

      {/* ABA DE VENDAS */}
      {activeTab === "vendas" && (
        <GlassCard className="p-6 space-y-4">
          <h3 className="text-lg font-bold text-white">Transações & Faturamento</h3>
          <p className="text-xs text-neutral-400">Integração ativa Mercado Pago e assinaturas de planos</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10">
              <span className="text-[10px] font-mono uppercase text-neutral-400">Total Faturado</span>
              <div className="text-2xl font-bold text-emerald-400 mt-1">R$ 48.960,00</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10">
              <span className="text-[10px] font-mono uppercase text-neutral-400">Ticket Médio</span>
              <div className="text-2xl font-bold text-white mt-1">R$ 126,20</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10">
              <span className="text-[10px] font-mono uppercase text-neutral-400">Taxa de Aprovação</span>
              <div className="text-2xl font-bold text-amber-300 mt-1">94.8%</div>
            </div>
          </div>
        </GlassCard>
      )}

      {/* ABA DE BANNERS */}
      {activeTab === "banners" && (
        <GlassCard className="p-6 space-y-4">
          <h3 className="text-lg font-bold text-white">Sistema de Banners da Plataforma</h3>
          <p className="text-xs text-neutral-400">Gerenciador de avisos do topo e campanhas de conversão</p>
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-white">Banner Ativo: "Novos Prompts Semanais Liberados"</div>
              <span className="text-[10px] text-neutral-400 font-mono">Exibição: Topo da Comunidade VIP</span>
            </div>
            <Badge variant="success">ATIVO</Badge>
          </div>
        </GlassCard>
      )}

      {/* ABA DE MODERADORES (Exclusivo Admin) */}
      {activeTab === "moderators" && isMaxAdmin && (
        <GlassCard className="p-6 space-y-4">
          <h3 className="text-lg font-bold text-white">Equipe de Moderadores</h3>
          <p className="text-xs text-neutral-400">Gerenciamento exclusivo do Administrador Soberano</p>
          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-white">Carlos Eduardo Mod</div>
                <div className="text-[11px] text-neutral-400">moderador@mateuscelestinopro.com</div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="gold">MODERADOR ATIVO</Badge>
                <button
                  onClick={() => showToast("Permissão de moderador atualizada!")}
                  className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-white text-[10px] font-bold"
                >
                  Gerenciar
                </button>
              </div>
            </div>
          </div>
        </GlassCard>
      )}
    </div>
  );
}
