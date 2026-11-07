'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Sparkles,
  Flame,
  Plus,
  Save,
  RefreshCw,
  Eye,
  Edit3,
  Trash2,
  Copy,
  Check,
  Globe,
  Clock,
  Tag,
  ArrowRight,
  ShieldAlert,
  Power,
  Sliders,
  ExternalLink,
  Layers,
  X,
} from 'lucide-react';
import { SmartBanner, BannerType, BannerFrequency, BannerTheme, BannersConfig } from '@/types/banners';
import defaultBannersData from '@/data/banners.json';

interface BannersControlSuiteProps {
  onNotify?: (message: string) => void;
}

export function BannersControlSuite({ onNotify }: BannersControlSuiteProps) {
  const [config, setConfig] = useState<BannersConfig>(defaultBannersData as unknown as BannersConfig);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<'all' | BannerType>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  // Estado do Modal de Edição/Criação
  const [editingBanner, setEditingBanner] = useState<SmartBanner | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  // Estado do Modal de Preview ao Vivo
  const [previewBanner, setPreviewBanner] = useState<SmartBanner | null>(null);
  const [copiedCoupon, setCopiedCoupon] = useState(false);

  const notify = (msg: string) => {
    if (onNotify) onNotify(msg);
  };

  // Carrega configuração do servidor
  const fetchBanners = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/banners');
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setConfig(json.data);
        }
      } else {
        notify('Usando dados de fallback locais.');
      }
    } catch (err) {
      console.error('[BannersControlSuite] Erro:', err);
      notify('Erro de conexão ao carregar banners.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  // Salva no banco de dados / nuvem
  const saveAllChanges = async (newConfig?: BannersConfig) => {
    const payload = newConfig || config;
    setIsSaving(true);
    try {
      const res = await fetch('/api/admin/banners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setConfig(json.data);
        notify('Banners sincronizados e salvos com sucesso na nuvem!');
      } else {
        notify(json.error || 'Erro ao salvar alterações.');
      }
    } catch (err: any) {
      console.error('[BannersControlSuite] Erro ao salvar:', err);
      notify('Falha de rede ao tentar salvar.');
    } finally {
      setIsSaving(false);
    }
  };

  // Alterna o status ativo/inativo de um banner com persistência imediata
  const toggleBannerStatus = async (id: string, currentStatus: boolean) => {
    const updatedBanners = config.banners.map((b) =>
      b.id === id ? { ...b, isActive: !currentStatus, updatedAt: new Date().toISOString() } : b
    );
    const updatedConfig = { ...config, banners: updatedBanners };
    setConfig(updatedConfig);
    notify(`Banner ${!currentStatus ? 'ativado' : 'pausado'} com sucesso!`);
    await saveAllChanges(updatedConfig);
  };

  // Deleta um banner
  const handleDeleteBanner = async (id: string, title: string) => {
    if (!confirm(`Tem certeza que deseja excluir o banner "${title}"?`)) return;

    try {
      const res = await fetch(`/api/admin/banners?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setConfig(json.data);
        notify('Banner excluído com sucesso!');
      } else {
        notify(json.error || 'Erro ao excluir banner.');
      }
    } catch (err) {
      notify('Falha ao excluir o banner.');
    }
  };

  // Abre editor para criar novo banner
  const handleOpenCreateModal = () => {
    const newId = `banner-${Date.now()}`;
    const emptyBanner: SmartBanner = {
      id: newId,
      title: 'ESPERE! UMA ÚLTIMA OFERTA ANTES DE IR...',
      subtitle: 'OPORTUNIDADE EXCLUSIVA MCP',
      content: 'Aproveite agora esta condição especial válida apenas durante a sua visita.',
      type: 'exit_intent',
      targetPages: ['*'],
      ctaText: 'ACESSAR OFERTA AGORA',
      ctaUrl: '/shop',
      secondaryCtaText: 'Talvez mais tarde',
      secondaryCtaUrl: '',
      discountCode: 'MCPVIP',
      imageUrl: '',
      badge: 'EXCLUSIVO',
      isActive: true,
      delaySeconds: 0,
      frequency: 'once_per_session',
      theme: 'cyber_red',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setEditingBanner(emptyBanner);
    setIsEditorOpen(true);
  };

  // Abre editor para alterar existente
  const handleOpenEditModal = (banner: SmartBanner) => {
    setEditingBanner({ ...banner });
    setIsEditorOpen(true);
  };

  // Salva banner editado/novo
  const handleSaveEditor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBanner) return;

    const existingIdx = config.banners.findIndex((b) => b.id === editingBanner.id);
    let updatedBanners: SmartBanner[];

    if (existingIdx >= 0) {
      updatedBanners = [...config.banners];
      updatedBanners[existingIdx] = {
        ...editingBanner,
        updatedAt: new Date().toISOString(),
      };
    } else {
      updatedBanners = [
        {
          ...editingBanner,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        ...config.banners,
      ];
    }

    const updatedConfig = { ...config, banners: updatedBanners };
    setConfig(updatedConfig);
    setIsEditorOpen(false);
    setEditingBanner(null);
    notify('Banner salvo com sucesso!');
    await saveAllChanges(updatedConfig);
  };

  // Duplicar banner
  const handleDuplicate = async (banner: SmartBanner) => {
    const duplicated: SmartBanner = {
      ...banner,
      id: `banner-${Date.now()}`,
      title: `${banner.title} (Cópia)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updatedConfig = {
      ...config,
      banners: [duplicated, ...config.banners],
    };
    setConfig(updatedConfig);
    notify('Banner duplicado com sucesso!');
    await saveAllChanges(updatedConfig);
  };

  // Banners filtrados
  const filteredBanners = useMemo(() => {
    return config.banners.filter((b) => {
      if (selectedTypeFilter !== 'all' && b.type !== selectedTypeFilter) return false;
      if (selectedStatusFilter === 'active' && !b.isActive) return false;
      if (selectedStatusFilter === 'inactive' && b.isActive) return false;

      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        b.title.toLowerCase().includes(q) ||
        b.subtitle.toLowerCase().includes(q) ||
        b.content.toLowerCase().includes(q) ||
        (b.discountCode && b.discountCode.toLowerCase().includes(q)) ||
        b.targetPages.some((p) => p.toLowerCase().includes(q))
      );
    });
  }, [config.banners, selectedTypeFilter, selectedStatusFilter, searchQuery]);

  const stats = useMemo(() => {
    return {
      total: config.banners.length,
      active: config.banners.filter((b) => b.isActive).length,
      exitIntent: config.banners.filter((b) => b.type === 'exit_intent').length,
      onboarding: config.banners.filter((b) => b.type === 'onboarding').length,
    };
  }, [config.banners]);

  return (
    <div className="space-y-6">
      {/* =========================================================================
          HEADER DA SUITE DE BANNERS
          ========================================================================= */}
      <div className="p-6 rounded-3xl bg-gradient-to-b from-[#14080b]/90 to-[#070304]/90 border border-red-500/20 backdrop-blur-2xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_#ff073a]" />
              <span className="text-[11px] font-mono uppercase tracking-wider text-red-400 font-bold">
                Módulo Soberano de Retenção & Conversão
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
              <span>Banners Inteligentes & Exit-Intent</span>
              <span className="px-2 py-0.5 rounded-lg bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-mono font-bold">
                2026 Core
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1">
              Controle mestre de modais de saída (Exit-Intent), guias de boas-vindas (Onboarding) e gatilhos por rota.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              type="button"
              onClick={fetchBanners}
              disabled={isLoading}
              className="px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 text-xs font-mono flex items-center gap-1.5 border border-white/10 transition-colors"
              title="Recarregar dados"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-red-400' : ''}`} />
              <span className="hidden sm:inline">Recarregar</span>
            </button>

            <button
              type="button"
              onClick={() => saveAllChanges()}
              disabled={isSaving}
              className="px-4 py-2.5 rounded-xl bg-red-600/30 hover:bg-red-600/50 text-red-200 border border-red-500/40 text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(255,7,58,0.2)]"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? 'Salvando...' : 'Salvar Nuvem'}</span>
            </button>

            <button
              type="button"
              onClick={handleOpenCreateModal}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-[#ff073a] hover:from-red-500 hover:to-red-600 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(255,7,58,0.4)]"
            >
              <Plus className="w-4 h-4" />
              <span>Novo Banner</span>
            </button>
          </div>
        </div>

        {/* CARDS DE KPIS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-white/10">
          <div className="p-3 rounded-2xl bg-black/40 border border-white/5">
            <span className="text-[10px] font-mono text-neutral-400 uppercase">Total Cadastrado</span>
            <div className="text-xl sm:text-2xl font-black text-white mt-0.5">{stats.total}</div>
          </div>

          <div className="p-3 rounded-2xl bg-black/40 border border-white/5">
            <span className="text-[10px] font-mono text-emerald-400 uppercase flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Ativos em Produção
            </span>
            <div className="text-xl sm:text-2xl font-black text-emerald-400 mt-0.5">{stats.active}</div>
          </div>

          <div className="p-3 rounded-2xl bg-black/40 border border-white/5">
            <span className="text-[10px] font-mono text-red-400 uppercase flex items-center gap-1">
              <Flame className="w-3 h-3 text-red-400" />
              Exit-Intent (Saída)
            </span>
            <div className="text-xl sm:text-2xl font-black text-red-400 mt-0.5">{stats.exitIntent}</div>
          </div>

          <div className="p-3 rounded-2xl bg-black/40 border border-white/5">
            <span className="text-[10px] font-mono text-cyan-400 uppercase flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              Onboarding (Entrada)
            </span>
            <div className="text-xl sm:text-2xl font-black text-cyan-400 mt-0.5">{stats.onboarding}</div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          BARRA DE FERRAMENTAS & FILTROS
          ========================================================================= */}
      <div className="p-4 rounded-2xl bg-[#0c0507]/90 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-3 backdrop-blur-xl">
        <div className="w-full md:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por título, cupom ou rota..."
            className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-red-500/50"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <select
            value={selectedTypeFilter}
            onChange={(e) => setSelectedTypeFilter(e.target.value as any)}
            className="px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-neutral-300 focus:outline-none focus:border-red-500/50"
          >
            <option value="all">Todos os Tipos</option>
            <option value="exit_intent">Apenas Exit-Intent</option>
            <option value="onboarding">Apenas Onboarding</option>
          </select>

          <select
            value={selectedStatusFilter}
            onChange={(e) => setSelectedStatusFilter(e.target.value as any)}
            className="px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-neutral-300 focus:outline-none focus:border-red-500/50"
          >
            <option value="all">Todos os Status</option>
            <option value="active">Apenas Ativos</option>
            <option value="inactive">Apenas Pausados</option>
          </select>
        </div>
      </div>

      {/* =========================================================================
          LISTAGEM PRINCIPAL DOS BANNERS
          ========================================================================= */}
      <div className="space-y-4">
        {filteredBanners.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-white/[0.02] border border-white/5">
            <Layers className="w-8 h-8 text-neutral-600 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-neutral-300">Nenhum banner encontrado</h3>
            <p className="text-xs text-neutral-500 mt-1">Crie um novo banner ou altere os filtros aplicados.</p>
          </div>
        ) : (
          filteredBanners.map((banner) => {
            const isExit = banner.type === 'exit_intent';

            return (
              <div
                key={banner.id}
                className="p-5 rounded-2xl bg-gradient-to-b from-[#100608]/90 to-[#070204]/90 border border-white/10 hover:border-red-500/30 transition-all shadow-[0_8px_30px_rgba(0,0,0,0.6)] space-y-4"
              >
                {/* Linha 1: Status, Tipo, Badges e Botões de Ação */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    {/* Botão Power Toggle Instantâneo */}
                    <button
                      type="button"
                      onClick={() => toggleBannerStatus(banner.id, banner.isActive)}
                      className={`px-3 py-1 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all border ${
                        banner.isActive
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                          : 'bg-white/5 text-neutral-400 border-white/10'
                      }`}
                      title="Clique para ativar/desativar em tempo real"
                    >
                      <Power className="w-3.5 h-3.5" />
                      <span>{banner.isActive ? 'ATIVO' : 'PAUSADO'}</span>
                    </button>

                    {/* Badge do Tipo */}
                    <span
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider border flex items-center gap-1 ${
                        isExit
                          ? 'bg-red-500/20 text-red-300 border-red-500/40'
                          : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                      }`}
                    >
                      {isExit ? <Flame className="w-3 h-3 text-red-400" /> : <Sparkles className="w-3 h-3" />}
                      <span>{isExit ? 'Exit Intent' : 'Onboarding'}</span>
                    </span>

                    {banner.badge && (
                      <span className="px-2 py-0.5 rounded-md bg-white/5 text-neutral-300 border border-white/10 text-[10px] font-mono">
                        {banner.badge}
                      </span>
                    )}

                    {banner.discountCode && (
                      <span className="px-2 py-0.5 rounded-md bg-yellow-500/10 text-yellow-300 border border-yellow-500/30 text-[10px] font-mono flex items-center gap-1">
                        <Tag className="w-2.5 h-2.5" />
                        <span>{banner.discountCode}</span>
                      </span>
                    )}
                  </div>

                  {/* Ações da Linha */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setPreviewBanner(banner)}
                      className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 text-xs font-semibold flex items-center gap-1.5 border border-white/10 transition-colors"
                      title="Visualizar preview ao vivo"
                    >
                      <Eye className="w-3.5 h-3.5 text-neutral-400" />
                      <span>Preview</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDuplicate(banner)}
                      className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-colors border border-white/10"
                      title="Duplicar banner"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenEditModal(banner)}
                      className="px-3 py-1.5 rounded-xl bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Editar</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteBanner(banner.id, banner.title)}
                      className="p-1.5 rounded-xl bg-white/5 hover:bg-red-950/40 text-neutral-500 hover:text-red-400 transition-colors border border-white/10"
                      title="Excluir banner"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Linha 2: Título, Subtítulo e Conteúdo */}
                <div>
                  {banner.subtitle && (
                    <div className="text-[11px] font-mono uppercase tracking-wider text-red-400 font-bold mb-0.5">
                      {banner.subtitle}
                    </div>
                  )}
                  <h3 className="text-base sm:text-lg font-black text-white">{banner.title}</h3>
                  <p className="text-xs sm:text-sm text-neutral-300 mt-1 line-clamp-2">{banner.content}</p>
                </div>

                {/* Linha 3: Meta Informações (Rotas, Delay, Frequência, CTA) */}
                <div className="pt-3 border-t border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs text-neutral-400 font-mono">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="flex items-center gap-1 text-neutral-400">
                      <Globe className="w-3 h-3 text-red-400" />
                      <span>Rotas:</span>
                    </span>
                    {banner.targetPages.map((page, i) => (
                      <span key={i} className="px-1.5 py-0.5 rounded bg-black/40 border border-white/5 text-[10px] text-neutral-200">
                        {page}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-4 flex-wrap">
                    {banner.type === 'onboarding' && (
                      <span className="flex items-center gap-1 text-neutral-400">
                        <Clock className="w-3 h-3" />
                        <span>Delay: {banner.delaySeconds}s</span>
                      </span>
                    )}

                    <span className="text-neutral-400">
                      Freq: {banner.frequency === 'once_per_session' ? '1x por Sessão' : banner.frequency === 'once_per_user' ? '1x por Visitante' : 'Sempre'}
                    </span>

                    <span className="text-red-400 flex items-center gap-1">
                      <span>CTA: {banner.ctaText}</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* =========================================================================
          MODAL DE CRIAÇÃO / EDIÇÃO DE BANNER
          ========================================================================= */}
      {isEditorOpen && editingBanner && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-2xl animate-in fade-in duration-200"
          onClick={() => setIsEditorOpen(false)}
        >
          <div
            className="relative w-full max-w-3xl max-h-[92vh] flex flex-col rounded-3xl bg-[#090305] border border-red-500/30 shadow-[0_0_80px_rgba(255,7,58,0.25)] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header do Editor */}
            <div className="p-5 sm:p-6 border-b border-white/10 flex items-center justify-between bg-black/40">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-red-600/30 border border-red-500/40 flex items-center justify-center text-red-400">
                  <Edit3 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">
                    {editingBanner.createdAt ? 'Editar Banner Inteligente' : 'Criar Novo Banner'}
                  </h3>
                  <span className="text-xs font-mono text-neutral-400">ID: {editingBanner.id}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsEditorOpen(false)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Formulário com Scroll Suave */}
            <form onSubmit={handleSaveEditor} className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs font-sans">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Tipo de Banner */}
                <div>
                  <label className="block text-neutral-400 font-mono mb-1.5 uppercase tracking-wider text-[10px]">
                    Tipo de Disparo *
                  </label>
                  <select
                    value={editingBanner.type}
                    onChange={(e) => setEditingBanner({ ...editingBanner, type: e.target.value as BannerType })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white focus:outline-none focus:border-red-500"
                  >
                    <option value="exit_intent">Exit-Intent (Quando o usuário move o mouse para sair)</option>
                    <option value="onboarding">Onboarding (Ao abrir o site ou páginas com delay)</option>
                  </select>
                </div>

                {/* Tema Visual */}
                <div>
                  <label className="block text-neutral-400 font-mono mb-1.5 uppercase tracking-wider text-[10px]">
                    Tema Visual
                  </label>
                  <select
                    value={editingBanner.theme}
                    onChange={(e) => setEditingBanner({ ...editingBanner, theme: e.target.value as BannerTheme })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white focus:outline-none focus:border-red-500"
                  >
                    <option value="cyber_red">Cyber Vermelho Neon (Padrão MCP OS)</option>
                    <option value="gold_vip">Ouro VIP & Exclusivo</option>
                    <option value="emerald_stealth">Esmeralda Stealth</option>
                    <option value="dark_minimal">Minimalista Noturno</option>
                  </select>
                </div>
              </div>

              {/* Título Principal */}
              <div>
                <label className="block text-neutral-400 font-mono mb-1.5 uppercase tracking-wider text-[10px]">
                  Título Principal do Banner *
                </label>
                <input
                  type="text"
                  required
                  value={editingBanner.title}
                  onChange={(e) => setEditingBanner({ ...editingBanner, title: e.target.value })}
                  placeholder="Ex: ESPERE! NÃO VÁ EMBORA DE MÃOS VAZIAS"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white font-bold focus:outline-none focus:border-red-500"
                />
              </div>

              {/* Subtítulo & Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-400 font-mono mb-1.5 uppercase tracking-wider text-[10px]">
                    Subtítulo / Tagline
                  </label>
                  <input
                    type="text"
                    value={editingBanner.subtitle}
                    onChange={(e) => setEditingBanner({ ...editingBanner, subtitle: e.target.value })}
                    placeholder="Ex: OFERTA EXCLUSIVA DE SAÍDA"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 font-mono mb-1.5 uppercase tracking-wider text-[10px]">
                    Badge de Destaque
                  </label>
                  <input
                    type="text"
                    value={editingBanner.badge || ''}
                    onChange={(e) => setEditingBanner({ ...editingBanner, badge: e.target.value })}
                    placeholder="Ex: ÚLTIMA CHANCE, BOAS-VINDAS"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              {/* Conteúdo Persuasivo */}
              <div>
                <label className="block text-neutral-400 font-mono mb-1.5 uppercase tracking-wider text-[10px]">
                  Conteúdo / Descrição Persuasiva *
                </label>
                <textarea
                  required
                  rows={3}
                  value={editingBanner.content}
                  onChange={(e) => setEditingBanner({ ...editingBanner, content: e.target.value })}
                  placeholder="Descreva o benefício inegável ou a chamada para que o usuário tome a ação agora..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white leading-relaxed focus:outline-none focus:border-red-500"
                />
              </div>

              {/* Páginas-Alvo & Cupom de Desconto */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-400 font-mono mb-1.5 uppercase tracking-wider text-[10px]">
                    Páginas-Alvo (separadas por vírgula, use * para todas) *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingBanner.targetPages.join(', ')}
                    onChange={(e) =>
                      setEditingBanner({
                        ...editingBanner,
                        targetPages: e.target.value
                          .split(',')
                          .map((p) => p.trim())
                          .filter(Boolean),
                      })
                    }
                    placeholder="Ex: *, /, /shop, /biblioteca"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white focus:outline-none focus:border-red-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 font-mono mb-1.5 uppercase tracking-wider text-[10px]">
                    Cupom de Desconto (Opcional)
                  </label>
                  <input
                    type="text"
                    value={editingBanner.discountCode || ''}
                    onChange={(e) => setEditingBanner({ ...editingBanner, discountCode: e.target.value })}
                    placeholder="Ex: MCPVIP10"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white focus:outline-none focus:border-red-500 font-mono"
                  />
                </div>
              </div>

              {/* CTA Texto & URL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-400 font-mono mb-1.5 uppercase tracking-wider text-[10px]">
                    Texto do Botão CTA Principal *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingBanner.ctaText}
                    onChange={(e) => setEditingBanner({ ...editingBanner, ctaText: e.target.value })}
                    placeholder="Ex: QUERO MEU ACESSO COM DESCONTO"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white font-bold focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 font-mono mb-1.5 uppercase tracking-wider text-[10px]">
                    URL de Destino do CTA *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingBanner.ctaUrl}
                    onChange={(e) => setEditingBanner({ ...editingBanner, ctaUrl: e.target.value })}
                    placeholder="Ex: /shop, /biblioteca ou link de checkout"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white focus:outline-none focus:border-red-500 font-mono"
                  />
                </div>
              </div>

              {/* Botão Secundário & Delay */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-neutral-400 font-mono mb-1.5 uppercase tracking-wider text-[10px]">
                    Texto Botão Secundário
                  </label>
                  <input
                    type="text"
                    value={editingBanner.secondaryCtaText || ''}
                    onChange={(e) => setEditingBanner({ ...editingBanner, secondaryCtaText: e.target.value })}
                    placeholder="Ex: Continuar navegando"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 font-mono mb-1.5 uppercase tracking-wider text-[10px]">
                    Delay (Segundos)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="60"
                    value={editingBanner.delaySeconds}
                    onChange={(e) => setEditingBanner({ ...editingBanner, delaySeconds: parseInt(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white focus:outline-none focus:border-red-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 font-mono mb-1.5 uppercase tracking-wider text-[10px]">
                    Frequência de Exibição
                  </label>
                  <select
                    value={editingBanner.frequency}
                    onChange={(e) => setEditingBanner({ ...editingBanner, frequency: e.target.value as BannerFrequency })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white focus:outline-none focus:border-red-500"
                  >
                    <option value="once_per_session">1x por Sessão (Recomendado)</option>
                    <option value="once_per_user">1x por Usuário (Permanente)</option>
                    <option value="always">Sempre Exibir (Testes)</option>
                  </select>
                </div>
              </div>

              {/* Status Ativo / Inativo */}
              <div className="p-3.5 rounded-2xl bg-black/50 border border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white block">Status do Banner</span>
                  <span className="text-[10px] text-neutral-400 font-mono">
                    {editingBanner.isActive ? 'Banner ativo e disparando em produção' : 'Banner pausado (não aparece para visitantes)'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setEditingBanner({ ...editingBanner, isActive: !editingBanner.isActive })}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all border ${
                    editingBanner.isActive
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-white/5 text-neutral-400 border-white/10'
                  }`}
                >
                  {editingBanner.isActive ? 'ATIVADO' : 'PAUSADO'}
                </button>
              </div>

              {/* Footer do Modal com Botões */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 text-xs font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-[#ff073a] hover:from-red-500 hover:to-red-600 text-white text-xs font-bold shadow-[0_0_20px_rgba(255,7,58,0.4)]"
                >
                  Salvar Banner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL DE PREVIEW AO VIVO PARA O ADMIN
          ========================================================================= */}
      {previewBanner && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-2xl animate-in fade-in duration-200"
          onClick={() => setPreviewBanner(null)}
        >
          <div
            className="relative w-full max-w-xl md:max-w-2xl bg-[#090305]/95 rounded-3xl border border-red-500/35 shadow-[0_0_90px_rgba(255,7,58,0.3)] overflow-hidden p-6 sm:p-8 backdrop-blur-3xl animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute top-2 left-4 px-2 py-0.5 rounded bg-red-600/30 border border-red-500/50 text-[9px] font-mono text-red-300 uppercase">
              MODO PREVIEW ADMIN
            </div>

            <button
              type="button"
              onClick={() => setPreviewBanner(null)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-all border border-white/10"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header com Badges */}
            <div className="flex flex-wrap items-center gap-2 mb-3 mt-3 pr-10">
              {previewBanner.badge && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold tracking-wider uppercase border bg-red-500/15 text-red-400 border-red-500/30">
                  {previewBanner.type === 'exit_intent' ? <Flame className="w-3 h-3 text-red-400" /> : <Sparkles className="w-3 h-3" />}
                  <span>{previewBanner.badge}</span>
                </span>
              )}
              <span className="px-2 py-0.5 rounded-md bg-white/5 text-neutral-400 border border-white/10 text-[10px] font-mono uppercase">
                {previewBanner.type === 'exit_intent' ? 'Exit-Intent Inteligente' : 'Tour & Boas-Vindas'}
              </span>
            </div>

            {previewBanner.subtitle && (
              <p className="text-xs sm:text-sm font-mono uppercase tracking-wider text-red-400/90 font-bold mb-1.5 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                <span>{previewBanner.subtitle}</span>
              </p>
            )}

            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight leading-tight mb-3">
              {previewBanner.title}
            </h2>

            <div className="text-sm sm:text-base text-neutral-300 leading-relaxed font-sans mb-6 bg-white/[0.02] p-3.5 sm:p-4 rounded-2xl border border-white/5">
              {previewBanner.content}
            </div>

            {previewBanner.discountCode && (
              <div className="mb-6 p-3 sm:p-3.5 rounded-2xl bg-black/60 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 text-xs font-mono text-neutral-300">
                  <Tag className="w-4 h-4 text-red-400" />
                  <span>Use o cupom na finalização:</span>
                </div>
                <div className="flex items-center gap-2">
                  <code className="px-3 py-1 rounded-lg bg-red-950/60 border border-red-500/40 text-red-300 font-mono font-bold text-xs">
                    {previewBanner.discountCode}
                  </code>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={() => {
                  alert(`Ação de teste: redirecionaria para ${previewBanner.ctaUrl}`);
                }}
                className="w-full sm:flex-1 py-3.5 px-6 rounded-2xl font-bold text-sm tracking-wide bg-gradient-to-r from-red-600 via-[#ff073a] to-red-700 text-white shadow-[0_0_35px_rgba(255,7,58,0.5)] flex items-center justify-center gap-2"
              >
                <span>{previewBanner.ctaText}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setPreviewBanner(null)}
                className="w-full sm:w-auto py-3 px-5 rounded-2xl bg-white/5 hover:bg-white/10 text-neutral-400 text-xs font-semibold border border-white/5"
              >
                {previewBanner.secondaryCtaText || 'Fechar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
