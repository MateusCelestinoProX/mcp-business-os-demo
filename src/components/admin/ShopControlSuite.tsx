'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  ShoppingBag,
  Plus,
  Trash2,
  Edit3,
  Copy,
  ArrowUp,
  ArrowDown,
  Sparkles,
  Check,
  ExternalLink,
  MessageSquare,
  ArrowRight,
  RefreshCw,
  Sliders,
  Image as ImageIcon,
  Save,
  Eye,
  CheckCircle2,
  FileCode,
  ShieldCheck,
  Bot,
  Layers,
  Search,
  X,
  Flame,
  Info,
} from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import AlternatingHeroBanner from '@/components/portal/AlternatingHeroBanner';
import { parseNotionMarkdown } from '@/lib/notion-diary-parser';
import { ShopFeature, ShopHero, ShopProductItem, ShopServiceItem, ShopData } from '@/components/portal/ShopSection';
import siteData from '@/data/siteData.json';

interface ShopControlSuiteProps {
  onNotify?: (message: string) => void;
}

const PRESET_COVERS = [
  { label: 'Typebot Pack Oficial', url: '/assets/notion/shop/products/typebot/ChatGPT_Image_9_de_jun._de_2025_13_14_33.png' },
  { label: 'Robô Sala Futurista (n8n)', url: '/assets/notion/shop/products/n8n/Robo_Central_em_Sala_Futurista.png' },
  { label: 'Make / Integromat Neon', url: '/assets/notion/shop/products/make/ChatGPT_Image_9_de_jun._de_2025_20_18_41.png' },
  { label: 'I.A PRO Formação', url: '/assets/notion/shop/products/curso_iapro/I.A_PRO.png' },
  { label: 'Agentes de IA Vermelho', url: '/assets/notion/shop/services/ai_agents/Robo_Elegante_em_Neon_Vermelho.png' },
  { label: 'Página de Links Cidade Neon', url: '/assets/notion/shop/services/link_tree/Acordo_Futurista_na_Cidade_Neon.png' },
  { label: 'Hero Art Principal', url: '/assets/notion/shop/hero_art.png' },
  { label: 'Capa Hero Global', url: '/assets/hero_cover.webp' },
];

export function ShopControlSuite({ onNotify }: ShopControlSuiteProps) {
  // Estado de carregamento e salvamento
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'produtos' | 'servicos' | 'hero'>('produtos');
  const [searchTerm, setSearchTerm] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Configurações do Hero da Loja
  const [shopHero, setShopHero] = useState<ShopHero>({
    welcome: siteData.shop?.hero?.welcome || 'SEJA BEM VINDO A LOJA VIRTUAL DE MATEUS CELESTINO PRO',
    tagline: siteData.shop?.hero?.tagline || 'AQUI VOCÊ ENCONTRA UMA LOJA VIRTUAL COM MEUS PRODUTOS E MEUS SERVIÇOS DISPONÍVEIS PARA A COMPRA.',
    artImage: siteData.shop?.hero?.artImage || '/assets/notion/shop/hero_art.png',
    artImages: (siteData.shop?.hero as any)?.artImages && (siteData.shop?.hero as any).artImages.length > 0
      ? (siteData.shop?.hero as any).artImages
      : [siteData.shop?.hero?.artImage || '/assets/notion/shop/hero_art.png', '/assets/hero_cover.webp'],
    features: siteData.shop?.hero?.features || [
      {
        icon: '🚀',
        title: 'Produtos de Alta Performance',
        desc: 'Cada item disponível aqui foi criado com foco total em resultado, praticidade e performance.',
      },
      {
        icon: '🤖',
        title: 'Serviços Inteligentes, Prontos para Executar',
        desc: 'Automatizações, fluxos prontos, ferramentas e soluções estratégicas testadas.',
      },
      {
        icon: '🎯',
        title: 'Para Profissionais Exigentes',
        desc: 'Se você busca excelência, agilidade e inovação, você está no lugar certo.',
      },
    ],
    idealFor: siteData.shop?.hero?.idealFor || [
      'Gestores de automação',
      'Infoprodutores',
      'Freelancers e agências',
      'Criadores de conteúdo',
      'Donos de negócio digital',
    ],
  });

  // Lista de Produtos e Serviços
  const [products, setProducts] = useState<ShopProductItem[]>(siteData.shop?.produtos || []);
  const [services, setServices] = useState<ShopServiceItem[]>(siteData.shop?.servicos || []);

  // Novo item de imagem de Hero
  const [newHeroImgUrl, setNewHeroImgUrl] = useState('');

  // Modal de Criação / Edição de Card
  const [editingCardType, setEditingCardType] = useState<'produto' | 'servico' | null>(null);
  const [isNewCard, setIsNewCard] = useState(false);
  const [activeModalEditorTab, setActiveModalEditorTab] = useState<'form' | 'markdown_preview'>('form');

  // Estado do Card em Edição
  const [editingProduct, setEditingProduct] = useState<ShopProductItem | null>(null);
  const [editingService, setEditingService] = useState<ShopServiceItem | null>(null);
  const [newHighlightText, setNewHighlightText] = useState('');

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    if (onNotify) onNotify(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Carrega configurações da API
  const fetchConfig = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/shop-resources');
      const data = await res.json();
      if (data.success && data.config?.shop) {
        const sh = data.config.shop;
        if (sh.hero) {
          setShopHero({
            welcome: sh.hero.welcome || 'SEJA BEM VINDO A LOJA VIRTUAL DE MATEUS CELESTINO PRO',
            tagline: sh.hero.tagline || 'AQUI VOCÊ ENCONTRA UMA LOJA VIRTUAL COM MEUS PRODUTOS E MEUS SERVIÇOS DISPONÍVEIS PARA A COMPRA.',
            artImage: sh.hero.artImage || '/assets/notion/shop/hero_art.png',
            artImages: Array.isArray(sh.hero.artImages) && sh.hero.artImages.length > 0
              ? sh.hero.artImages
              : [sh.hero.artImage || '/assets/notion/shop/hero_art.png'],
            features: sh.hero.features || shopHero.features,
            idealFor: sh.hero.idealFor || shopHero.idealFor,
          });
        }
        if (Array.isArray(sh.produtos)) {
          setProducts(sh.produtos);
        }
        if (Array.isArray(sh.servicos)) {
          setServices(sh.servicos);
        }
        triggerToast('Dados do Shop sincronizados com sucesso.');
      }
    } catch (err: any) {
      triggerToast('Aviso: usando dados locais de siteData. ' + (err?.message || ''));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  // Salvar tudo no Supabase / Banco de Dados
  const handleSaveAll = async () => {
    setIsSaving(true);
    try {
      const payload = {
        shop: {
          hero: shopHero,
          produtos: products,
          servicos: services,
        },
      };

      const res = await fetch('/api/admin/shop-resources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        triggerToast('✅ Configurações e cards do Shop salvos com sucesso no banco!');
      } else {
        triggerToast('❌ Erro ao salvar: ' + (data.error || 'Falha de autorização'));
      }
    } catch (err: any) {
      triggerToast('❌ Falha de rede ao salvar: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  // Restaurar presets originais do Notion
  const handleRestorePresets = () => {
    if (!window.confirm('Deseja restaurar os 4 produtos e 2 serviços originais oficiais do Notion?')) return;
    setShopHero({
      welcome: siteData.shop?.hero?.welcome || 'SEJA BEM VINDO A LOJA VIRTUAL DE MATEUS CELESTINO PRO',
      tagline: siteData.shop?.hero?.tagline || 'AQUI VOCÊ ENCONTRA UMA LOJA VIRTUAL COM MEUS PRODUTOS E MEUS SERVIÇOS DISPONÍVEIS PARA A COMPRA.',
      artImage: siteData.shop?.hero?.artImage || '/assets/notion/shop/hero_art.png',
      artImages: (siteData.shop?.hero as any)?.artImages || [siteData.shop?.hero?.artImage || '/assets/notion/shop/hero_art.png'],
      features: siteData.shop?.hero?.features || [],
      idealFor: siteData.shop?.hero?.idealFor || [],
    });
    setProducts(siteData.shop?.produtos || []);
    setServices(siteData.shop?.servicos || []);
    triggerToast('Presets oficiais restaurados na tela. Clique em "Salvar" para confirmar.');
  };

  // Abrir criação de Produto
  const handleNewProduct = () => {
    const id = `prod-${Date.now()}`;
    setEditingProduct({
      id,
      title: 'NOVO PRODUTO DIGITAL',
      tag: 'NOVA CATEGORIA',
      badge: 'PRODUTO DIGITAL',
      price: 'Entrega Imediata',
      cover: PRESET_COVERS[0].url,
      headline: 'SUA HEADLINE PODEROSA EM CAIXA ALTA AQUI',
      description: 'Escreva aqui a descrição detalhada do seu produto. Você pode usar formatação em **Markdown**, adicionar listas e links!',
      highlights: [
        'Acesso imediato enviado por e-mail ou nuvem',
        'Modelos e templates testados e validados para conversão',
        'Suporte técnico direto via WhatsApp e comunidade',
        'Garantia incondicional de qualidade e atualização contínua',
      ],
      details: {
        entrega: 'Acesso imediato enviado para armazenamento em nuvem segura.',
        segurança: 'Checkout blindado com criptografia e suporte direto.',
        ideal: 'Profissionais e empresas que buscam escalar operações digitais.',
      },
      actionType: 'modal',
      pageLink: '',
      cta: 'OBTER PRODUTO AGORA',
      whatsappMessage: 'Olá Mateus, tenho interesse em adquirir o novo produto digital!',
    });
    setIsNewCard(true);
    setEditingCardType('produto');
    setActiveModalEditorTab('form');
  };

  // Abrir criação de Serviço
  const handleNewService = () => {
    const id = `serv-${Date.now()}`;
    setEditingService({
      id,
      title: 'NOVO SERVIÇO SOB MEDIDA',
      tag: 'CONSULTORIA & ENGENHARIA',
      badge: 'SOLUÇÃO SOB MEDIDA',
      cover: PRESET_COVERS[4].url,
      headline: 'IMPLEMENTAÇÃO EXCLUSIVA DE ALTO IMPACTO PARA SEU NEGÓCIO',
      description: 'Descrição do serviço em **Markdown**. Explique como sua solução resolve dores críticas do cliente e gera faturamento real.',
      highlights: [
        'Diagnóstico aprofundado dos gargalos e oportunidades',
        'Desenvolvimento ágil com as tecnologias mais modernas do mercado',
        'Treinamento operacional para equipe e suporte dedicado',
        'Acompanhamento de métricas e taxa de conversão pós-entrega',
      ],
      details: {
        implementacao: 'Projeto consultivo feito sob medida para seu nicho.',
        tecnologia: 'Open Source + APIs robustas em servidores dedicados autônomos.',
        resultado: 'Aumento imediato de velocidade de resposta e faturamento.',
        personalizacao: 'Personalização total de fluxos e integrações.',
      },
      actionType: 'modal',
      pageLink: '',
      cta: 'CONTRATAR SERVIÇO AGORA',
      whatsappMessage: 'Olá Mateus, gostaria de um orçamento para o novo serviço sob medida!',
    });
    setIsNewCard(true);
    setEditingCardType('servico');
    setActiveModalEditorTab('form');
  };

  // Duplicar Produto
  const handleDuplicateProduct = (prod: ShopProductItem) => {
    const clone: ShopProductItem = {
      ...prod,
      id: `prod-${Date.now()}`,
      title: `${prod.title} (CÓPIA)`,
    };
    setProducts([clone, ...products]);
    triggerToast(`Produto "${prod.title}" duplicado com sucesso!`);
  };

  // Duplicar Serviço
  const handleDuplicateService = (serv: ShopServiceItem) => {
    const clone: ShopServiceItem = {
      ...serv,
      id: `serv-${Date.now()}`,
      title: `${serv.title} (CÓPIA)`,
    };
    setServices([clone, ...services]);
    triggerToast(`Serviço "${serv.title}" duplicado com sucesso!`);
  };

  // Remover Produto
  const handleRemoveProduct = (id: string) => {
    const target = products.find((p) => p.id === id);
    if (!window.confirm(`Tem certeza que deseja remover o produto "${target?.title || id}"?`)) return;
    setProducts(products.filter((p) => p.id !== id));
    triggerToast('Produto removido da lista.');
  };

  // Remover Serviço
  const handleRemoveService = (id: string) => {
    const target = services.find((s) => s.id === id);
    if (!window.confirm(`Tem certeza que deseja remover o serviço "${target?.title || id}"?`)) return;
    setServices(services.filter((s) => s.id !== id));
    triggerToast('Serviço removido da lista.');
  };

  // Mover item para cima/baixo
  const moveProduct = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= products.length) return;
    const newArr = [...products];
    const [moved] = newArr.splice(index, 1);
    newArr.splice(targetIndex, 0, moved);
    setProducts(newArr);
  };

  const moveService = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= services.length) return;
    const newArr = [...services];
    const [moved] = newArr.splice(index, 1);
    newArr.splice(targetIndex, 0, moved);
    setServices(newArr);
  };

  // Salvar Card do Modal
  const handleSaveModalCard = () => {
    if (editingCardType === 'produto' && editingProduct) {
      if (!editingProduct.title.trim()) {
        alert('Por favor informe o título do produto.');
        return;
      }
      if (isNewCard) {
        setProducts([editingProduct, ...products]);
        triggerToast(`Card de Produto "${editingProduct.title}" criado com sucesso!`);
      } else {
        setProducts(products.map((p) => (p.id === editingProduct.id ? editingProduct : p)));
        triggerToast(`Card "${editingProduct.title}" atualizado.`);
      }
    } else if (editingCardType === 'servico' && editingService) {
      if (!editingService.title.trim()) {
        alert('Por favor informe o título do serviço.');
        return;
      }
      if (isNewCard) {
        setServices([editingService, ...services]);
        triggerToast(`Card de Serviço "${editingService.title}" criado com sucesso!`);
      } else {
        setServices(services.map((s) => (s.id === editingService.id ? editingService : s)));
        triggerToast(`Card "${editingService.title}" atualizado.`);
      }
    }
    setEditingCardType(null);
    setEditingProduct(null);
    setEditingService(null);
  };

  // Filtragem
  const filteredProducts = useMemo(() => {
    if (!searchTerm.trim()) return products;
    const q = searchTerm.toLowerCase();
    return products.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.tag.toLowerCase().includes(q) ||
        p.headline.toLowerCase().includes(q)
    );
  }, [products, searchTerm]);

  const filteredServices = useMemo(() => {
    if (!searchTerm.trim()) return services;
    const q = searchTerm.toLowerCase();
    return services.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.tag.toLowerCase().includes(q) ||
        s.headline.toLowerCase().includes(q)
    );
  }, [services, searchTerm]);

  return (
    <div className="space-y-8">
      {/* Toast Notifier */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#8a0012] border border-red-500/50 text-white px-5 py-3 rounded-2xl shadow-2xl text-xs font-mono font-bold flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4 text-white" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* HEADER MASTER DA SUITE SHOP */}
      <GlassCard className="p-6 bg-white/[0.04] border border-white/15 backdrop-blur-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2.5">
              <ShoppingBag className="w-6 h-6 text-[#ff073a]" />
              <span>Painel Admin // Gerenciador de Shop</span>
            </h1>
            <Badge variant="outline" className="text-[10px] text-red-400 border-red-500/30">
              BOTÃO ÚNICO &bull; CARDS EM MARKDOWN &bull; SUPABASE SYNC
            </Badge>
          </div>
          <p className="text-xs text-neutral-400 mt-1.5 max-w-2xl leading-relaxed">
            Personalize os heros com imagens alternadas, titles e descrições em Markdown. Crie e edite cards exatamente
            iguais aos da interface oficial com apenas o botão único <strong className="text-white">&quot;Saiba mais&quot;</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Link
            href="/shop"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl glass-pill text-xs font-mono text-zinc-300 hover:text-white border border-white/10 hover:border-white/20 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#ff073a]" />
            <span>Ver Loja Oficial (/shop)</span>
          </Link>

          <Button
            variant="secondary"
            size="sm"
            onClick={fetchConfig}
            disabled={isLoading}
            className="gap-1.5 text-xs border-white/10"
            title="Recarregar dados do banco"
          >
            <RefreshCw className={cn('w-3.5 h-3.5', isLoading && 'animate-spin text-red-500')} />
            <span>Recarregar</span>
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={handleRestorePresets}
            className="gap-1.5 text-xs border-white/10 text-neutral-300 hover:text-white"
            title="Restaurar cards padrões oficiais"
          >
            <span>Restaurar Presets</span>
          </Button>

          <Button
            size="sm"
            onClick={handleSaveAll}
            disabled={isSaving}
            className="gap-1.5 text-xs bg-[#ff073a] hover:bg-[#d0002e] text-white font-bold shadow-[0_0_20px_rgba(255,7,58,0.4)] cursor-pointer"
          >
            {isSaving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            <span>Salvar no Banco de Dados</span>
          </Button>
        </div>
      </GlassCard>

      {/* SELETOR DE SEÇÕES (HERO, PRODUTOS, SERVIÇOS) */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-3 overflow-x-auto hide-scrollbar">
        <button
          type="button"
          onClick={() => setActiveTab('produtos')}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'produtos'
              ? 'glass-button-fired text-white shadow-lg'
              : 'text-zinc-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Layers className="w-4 h-4 text-[#ff073a]" />
          <span>Cards de Produtos Digitais ({products.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('servicos')}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'servicos'
              ? 'glass-button-fired text-white shadow-lg'
              : 'text-zinc-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Bot className="w-4 h-4 text-[#ff073a]" />
          <span>Cards de Serviços Sob Medida ({services.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('hero')}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'hero'
              ? 'glass-button-fired text-white shadow-lg'
              : 'text-zinc-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Sliders className="w-4 h-4 text-[#ff073a]" />
          <span>Configuração do Hero & Banners Alternados</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* ABA 1: CARDS DE PRODUTOS DIGITAIS */}
      {/* ========================================================================= */}
      {activeTab === 'produtos' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
              <input
                type="text"
                placeholder="Buscar produto por título ou tag..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-black/60 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#ff073a]"
              />
            </div>

            <Button
              size="sm"
              onClick={handleNewProduct}
              className="bg-[#ff073a] hover:bg-[#d0002e] text-white font-bold text-xs gap-1.5 shadow-[0_0_15px_rgba(255,7,58,0.3)] cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Criar Novo Card de Produto</span>
            </Button>
          </div>

          {filteredProducts.length === 0 ? (
            <GlassCard className="p-12 text-center space-y-3 border-dashed border-white/10">
              <ShoppingBag className="w-10 h-10 text-neutral-600 mx-auto" />
              <p className="text-sm font-bold text-white">Nenhum produto digital encontrado</p>
              <p className="text-xs text-neutral-400">Clique no botão acima para criar seu primeiro card.</p>
            </GlassCard>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredProducts.map((prod, idx) => (
                <div
                  key={prod.id || idx}
                  className="glass-crystal rounded-2xl sm:rounded-3xl p-5 sm:p-7 flex flex-col justify-between group border border-white/10 hover:border-[#ff073a]/50 transition-all duration-300 shadow-xl relative"
                >
                  {/* BARRA DE FERRAMENTAS DO ADMIN NO TOPO DO CARD */}
                  <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-white/10">
                    <span className="text-[10px] font-mono text-zinc-400 font-semibold uppercase flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span>Slot #{idx + 1} &bull; ID: {prod.id}</span>
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => moveProduct(idx, 'up')}
                        disabled={idx === 0}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Mover para cima"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveProduct(idx, 'down')}
                        disabled={idx === products.length - 1}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Mover para baixo"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDuplicateProduct(prod)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white"
                        title="Duplicar Card"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingProduct({ ...prod });
                          setIsNewCard(false);
                          setEditingCardType('produto');
                          setActiveModalEditorTab('form');
                        }}
                        className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 border border-red-800/40 text-red-400 hover:text-white"
                        title="Editar Card Completo"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveProduct(prod.id)}
                        className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 border border-red-800/40 text-red-400 hover:text-white"
                        title="Excluir Card"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* VISUAL REAL EXATAMENTE IGUAL AO CARD DA LOJA */}
                  <div>
                    {/* Capa com Badges */}
                    <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full rounded-xl sm:rounded-2xl overflow-hidden mb-4 sm:mb-6 bg-black border border-white/10 shadow-lg">
                      <img
                        src={prod.cover}
                        alt={prod.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                      <div className="absolute top-2.5 left-2.5 sm:top-3.5 sm:left-3.5 px-2.5 py-1 rounded-lg sm:rounded-xl glass-pill-red text-[10px] sm:text-xs font-mono text-[#ff073a] font-bold">
                        {prod.badge}
                      </div>
                      <div className="absolute top-2.5 right-2.5 sm:top-3.5 sm:right-3.5 px-2.5 py-1 rounded-lg sm:rounded-xl glass-pill text-[10px] sm:text-xs font-mono text-zinc-300">
                        {prod.price}
                      </div>
                    </div>

                    {/* Tag de Categoria */}
                    <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
                      <span className="text-[10px] sm:text-[11px] font-mono px-2.5 py-0.5 rounded-md sm:rounded-lg glass-pill text-[#ff073a] font-semibold">
                        {prod.tag}
                      </span>
                    </div>

                    {/* Título */}
                    <h3 className="text-xl sm:text-2xl font-black text-white group-hover:text-[#ff073a] transition-colors leading-tight">
                      {prod.title}
                    </h3>

                    {/* Headline */}
                    <p className="mt-1 sm:mt-1.5 text-[11px] sm:text-xs font-mono text-zinc-400 font-bold uppercase tracking-wider leading-snug">
                      {prod.headline}
                    </p>

                    {/* Descrição em Markdown */}
                    <div
                      className="mt-2.5 sm:mt-3 text-xs sm:text-sm text-zinc-300 font-light leading-relaxed prose prose-invert prose-red max-w-none line-clamp-3 prose-p:my-0 prose-headings:text-white prose-strong:text-white prose-a:text-[#ff073a]"
                      dangerouslySetInnerHTML={{ __html: parseNotionMarkdown(prod.description) }}
                    />

                    {/* Highlights */}
                    <div className="mt-4 sm:mt-6 pt-3.5 sm:pt-5 border-t border-white/10 space-y-2 sm:space-y-2.5">
                      {prod.highlights.slice(0, 4).map((h, hIdx) => (
                        <div key={hIdx} className="flex items-start gap-2 sm:gap-2.5 text-xs text-zinc-300 font-mono">
                          <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#ff073a] shrink-0 mt-0.5" />
                          <span className="leading-tight">{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* BLOCO COM O BOTÃO ÚNICO: Saiba mais */}
                  <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-white/10 space-y-2">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingProduct({ ...prod });
                        setIsNewCard(false);
                        setEditingCardType('produto');
                      }}
                      className="glass-button-fired w-full min-h-[48px] py-3 px-4 rounded-xl text-xs font-mono font-bold text-white shadow-xl flex items-center justify-center gap-2 active:scale-[0.98] transition-all touch-manipulation cursor-pointer group/btn"
                    >
                      <span>Saiba mais</span>
                      <ArrowRight className="w-4 h-4 shrink-0 text-white/90 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                    <div className="text-[10px] font-mono text-neutral-500 text-center">
                      Ação: {prod.actionType === 'link' && prod.pageLink ? `Link Direto (${prod.pageLink})` : 'Modal de Detalhes com Markdown'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* ABA 2: CARDS DE SERVIÇOS SOB MEDIDA */}
      {/* ========================================================================= */}
      {activeTab === 'servicos' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
              <input
                type="text"
                placeholder="Buscar serviço por título ou tag..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-black/60 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#ff073a]"
              />
            </div>

            <Button
              size="sm"
              onClick={handleNewService}
              className="bg-[#ff073a] hover:bg-[#d0002e] text-white font-bold text-xs gap-1.5 shadow-[0_0_15px_rgba(255,7,58,0.3)] cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Criar Novo Card de Serviço</span>
            </Button>
          </div>

          {filteredServices.length === 0 ? (
            <GlassCard className="p-12 text-center space-y-3 border-dashed border-white/10">
              <Bot className="w-10 h-10 text-neutral-600 mx-auto" />
              <p className="text-sm font-bold text-white">Nenhum serviço cadastrado</p>
              <p className="text-xs text-neutral-400">Clique no botão acima para criar seu primeiro card de serviço.</p>
            </GlassCard>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredServices.map((serv, idx) => (
                <div
                  key={serv.id || idx}
                  className="glass-crystal rounded-2xl sm:rounded-3xl p-5 sm:p-7 flex flex-col justify-between group border border-white/10 hover:border-[#ff073a]/50 transition-all duration-300 shadow-xl relative"
                >
                  {/* BARRA DE FERRAMENTAS DO ADMIN NO TOPO DO CARD */}
                  <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-white/10">
                    <span className="text-[10px] font-mono text-zinc-400 font-semibold uppercase flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span>Slot #{idx + 1} &bull; ID: {serv.id}</span>
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => moveService(idx, 'up')}
                        disabled={idx === 0}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Mover para cima"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveService(idx, 'down')}
                        disabled={idx === services.length - 1}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Mover para baixo"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDuplicateService(serv)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white"
                        title="Duplicar Card"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingService({ ...serv });
                          setIsNewCard(false);
                          setEditingCardType('servico');
                          setActiveModalEditorTab('form');
                        }}
                        className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 border border-red-800/40 text-red-400 hover:text-white"
                        title="Editar Card Completo"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveService(serv.id)}
                        className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 border border-red-800/40 text-red-400 hover:text-white"
                        title="Excluir Card"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* VISUAL REAL EXATAMENTE IGUAL AO CARD DA LOJA */}
                  <div>
                    {/* Capa com Badge */}
                    <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full rounded-xl sm:rounded-2xl overflow-hidden mb-4 sm:mb-6 bg-black border border-white/10 shadow-lg">
                      <img
                        src={serv.cover}
                        alt={serv.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                      <div className="absolute top-2.5 left-2.5 sm:top-3.5 sm:left-3.5 px-2.5 py-1 rounded-lg sm:rounded-xl glass-pill-red text-[10px] sm:text-xs font-mono text-[#ff073a] font-bold">
                        {serv.badge}
                      </div>
                    </div>

                    {/* Tag de Categoria */}
                    <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
                      <span className="text-[10px] sm:text-[11px] font-mono px-2.5 py-0.5 rounded-md sm:rounded-lg glass-pill text-[#ff073a] font-semibold">
                        {serv.tag}
                      </span>
                    </div>

                    {/* Título */}
                    <h3 className="text-xl sm:text-2xl font-black text-white group-hover:text-[#ff073a] transition-colors leading-tight">
                      {serv.title}
                    </h3>

                    {/* Headline */}
                    <p className="mt-1 sm:mt-1.5 text-[11px] sm:text-xs font-mono text-zinc-400 font-bold uppercase tracking-wider leading-snug">
                      {serv.headline}
                    </p>

                    {/* Descrição em Markdown */}
                    <div
                      className="mt-2.5 sm:mt-3 text-xs sm:text-sm text-zinc-300 font-light leading-relaxed prose prose-invert prose-red max-w-none line-clamp-3 prose-p:my-0 prose-headings:text-white prose-strong:text-white prose-a:text-[#ff073a]"
                      dangerouslySetInnerHTML={{ __html: parseNotionMarkdown(serv.description) }}
                    />

                    {/* Highlights */}
                    <div className="mt-4 sm:mt-6 pt-3.5 sm:pt-5 border-t border-white/10 space-y-2 sm:space-y-2.5">
                      {serv.highlights.slice(0, 4).map((h, hIdx) => (
                        <div key={hIdx} className="flex items-start gap-2 sm:gap-2.5 text-xs text-zinc-300 font-mono">
                          <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#ff073a] shrink-0 mt-0.5" />
                          <span className="leading-tight">{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* BLOCO COM O BOTÃO ÚNICO: Saiba mais */}
                  <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-white/10 space-y-2">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingService({ ...serv });
                        setIsNewCard(false);
                        setEditingCardType('servico');
                      }}
                      className="glass-button-fired w-full min-h-[48px] py-3 px-4 rounded-xl text-xs font-mono font-bold text-white shadow-xl flex items-center justify-center gap-2 active:scale-[0.98] transition-all touch-manipulation cursor-pointer group/btn"
                    >
                      <span>Saiba mais</span>
                      <ArrowRight className="w-4 h-4 shrink-0 text-white/90 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                    <div className="text-[10px] font-mono text-neutral-500 text-center">
                      Ação: {serv.actionType === 'link' && serv.pageLink ? `Link Direto (${serv.pageLink})` : 'Modal de Detalhes com Markdown'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* ABA 3: HERO DA LOJA COM IMAGENS ALTERNADAS E TEXTOS */}
      {/* ========================================================================= */}
      {activeTab === 'hero' && (
        <div className="space-y-8">
          <GlassCard className="p-6 space-y-6 bg-white/[0.04] border border-white/15 backdrop-blur-2xl">
            <div className="border-b border-white/10 pb-3">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#ff073a]" />
                <span>Configurações do Hero & Banner Alternado da Loja</span>
              </h2>
              <p className="text-xs text-neutral-400 mt-0.5">
                Altere os títulos, a descrição e a galeria de imagens que alternam de forma suave e contínua no banner da loja.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Formulário do Hero */}
              <div className="lg:col-span-7 space-y-5">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1.5 font-bold">
                    Título Principal de Boas-Vindas
                  </label>
                  <input
                    type="text"
                    value={shopHero.welcome}
                    onChange={(e) => setShopHero({ ...shopHero, welcome: e.target.value })}
                    className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#ff073a]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1.5 font-bold">
                    Subtítulo / Tagline da Loja (Suporta Markdown)
                  </label>
                  <textarea
                    rows={3}
                    value={shopHero.tagline}
                    onChange={(e) => setShopHero({ ...shopHero, tagline: e.target.value })}
                    className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#ff073a] resize-none"
                  />
                </div>

                {/* Slot para Múltiplas Hero Images */}
                <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-white uppercase flex items-center gap-2">
                      <ImageIcon className="w-3.5 h-3.5 text-[#ff073a]" />
                      <span>Imagens do Hero (Alternância Contínua): {shopHero.artImages?.length || 0}</span>
                    </span>
                    <Badge variant="outline" className="text-[10px] text-zinc-400">
                      Cross-fade Automático 4.5s
                    </Badge>
                  </div>

                  <p className="text-[11px] text-neutral-400 leading-relaxed">
                    Cadastre uma ou mais imagens. Elas ocupam o mesmo espaço alternando com efeito suave.
                  </p>

                  {/* Lista de Imagens */}
                  <div className="space-y-2">
                    {shopHero.artImages &&
                      shopHero.artImages.map((imgUrl, idx) => (
                        <div key={idx} className="flex items-center gap-2 p-2 rounded-xl bg-white/[0.02] border border-white/5">
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-black shrink-0 border border-white/10">
                            <img src={imgUrl} alt={`Banner ${idx + 1}`} className="w-full h-full object-cover" />
                          </div>
                          <input
                            type="text"
                            value={imgUrl}
                            onChange={(e) => {
                              const newArr = [...(shopHero.artImages || [])];
                              newArr[idx] = e.target.value;
                              setShopHero({ ...shopHero, artImages: newArr });
                            }}
                            className="flex-1 bg-black/40 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white font-mono"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const newArr = (shopHero.artImages || []).filter((_, i) => i !== idx);
                              setShopHero({ ...shopHero, artImages: newArr });
                            }}
                            className="p-1.5 rounded-lg text-red-400 hover:bg-red-950/40 border border-red-900/30 cursor-pointer"
                            title="Remover Imagem"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                  </div>

                  {/* Adicionar Nova Imagem */}
                  <div className="flex items-center gap-2 pt-2">
                    <input
                      type="text"
                      value={newHeroImgUrl}
                      onChange={(e) => setNewHeroImgUrl(e.target.value)}
                      placeholder="https://... ou /assets/notion/shop/..."
                      className="flex-1 bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#ff073a]"
                    />
                    <Button
                      size="sm"
                      onClick={() => {
                        if (!newHeroImgUrl.trim()) return;
                        const current = shopHero.artImages || [];
                        setShopHero({
                          ...shopHero,
                          artImages: [...current, newHeroImgUrl.trim()],
                        });
                        setNewHeroImgUrl('');
                      }}
                      className="bg-white/10 hover:bg-white/20 text-white text-xs border border-white/10 shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5 mr-1" />
                      <span>Adicionar Imagem</span>
                    </Button>
                  </div>

                  {/* Atalhos Rápidos */}
                  <div className="pt-2">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase block mb-1.5">Atalhos do Acervo:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {PRESET_COVERS.map((preset, pIdx) => (
                        <button
                          key={pIdx}
                          type="button"
                          onClick={() => {
                            const current = shopHero.artImages || [];
                            if (!current.includes(preset.url)) {
                              setShopHero({
                                ...shopHero,
                                artImages: [...current, preset.url],
                              });
                            }
                          }}
                          className="px-2 py-0.5 rounded-md bg-white/5 hover:bg-white/10 border border-white/5 text-[10px] text-zinc-400 hover:text-white"
                        >
                          + {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 3 Blocos de Destaque (Features) */}
                <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3">
                  <span className="text-xs font-mono font-bold text-white uppercase block">
                    3 Blocos de Destaque Originais (Features):
                  </span>
                  <div className="space-y-3">
                    {shopHero.features.map((feat, fIdx) => (
                      <div key={fIdx} className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={feat.icon}
                            onChange={(e) => {
                              const newF = [...shopHero.features];
                              newF[fIdx].icon = e.target.value;
                              setShopHero({ ...shopHero, features: newF });
                            }}
                            className="w-10 text-center bg-black/50 border border-white/10 rounded-lg py-1 text-sm"
                            title="Ícone Emoji"
                          />
                          <input
                            type="text"
                            value={feat.title}
                            onChange={(e) => {
                              const newF = [...shopHero.features];
                              newF[fIdx].title = e.target.value;
                              setShopHero({ ...shopHero, features: newF });
                            }}
                            className="flex-1 bg-black/50 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white font-bold"
                            placeholder="Título do Bloco"
                          />
                        </div>
                        <textarea
                          rows={2}
                          value={feat.desc}
                          onChange={(e) => {
                            const newF = [...shopHero.features];
                            newF[fIdx].desc = e.target.value;
                            setShopHero({ ...shopHero, features: newF });
                          }}
                          className="w-full bg-black/50 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-zinc-300 resize-none"
                          placeholder="Descrição do Bloco"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Ideal Para */}
                <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3">
                  <div className="flex items-center gap-1.5 text-xs font-mono text-zinc-400 font-semibold uppercase">
                    <Flame className="w-3.5 h-3.5 text-[#ff073a]" />
                    <span>Chips &quot;Ideal Para&quot;:</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {shopHero.idealFor.map((item, iIdx) => (
                      <span
                        key={iIdx}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl glass-pill text-xs font-mono text-zinc-200 border border-white/10"
                      >
                        <span>{item}</span>
                        <button
                          type="button"
                          onClick={() => {
                            const newIdeal = shopHero.idealFor.filter((_, i) => i !== iIdx);
                            setShopHero({ ...shopHero, idealFor: newIdeal });
                          }}
                          className="text-red-400 hover:text-white"
                        >
                          &times;
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Coluna Direita: Live Preview */}
              <div className="lg:col-span-5 flex flex-col items-center">
                <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-2 font-semibold flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-[#ff073a]" />
                  <span>Visualização em Tempo Real na Loja:</span>
                </span>
                <div className="w-full max-w-sm">
                  <AlternatingHeroBanner
                    images={
                      shopHero.artImages && shopHero.artImages.length > 0
                        ? shopHero.artImages
                        : [shopHero.artImage || '/assets/notion/shop/hero_art.png']
                    }
                    title="Loja Oficial"
                    badgeText="100% VALIDADO"
                    tagline={shopHero.tagline}
                    aspectRatio="aspect-square"
                    intervalMs={3500}
                  />
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL MESTRE DE CRIAÇÃO / EDIÇÃO DE CARDS (EXATAMENTE IGUAIS AO PADRÃO) */}
      {/* ========================================================================= */}
      {editingCardType && (editingProduct || editingService) && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setEditingCardType(null);
              setEditingProduct(null);
              setEditingService(null);
            }
          }}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-6xl w-full max-h-[92vh] overflow-y-auto glass-crystal rounded-3xl p-5 sm:p-8 border border-white/20 shadow-2xl cursor-default space-y-6"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-[#ff073a]" />
                  <span>
                    {isNewCard ? 'Criar Novo Card' : 'Editar Card'}:{' '}
                    {editingCardType === 'produto' ? 'Produto Digital' : 'Serviço Profissional'}
                  </span>
                </h3>
                <p className="text-xs text-neutral-400 mt-1">
                  Configure titles, imagens hero e a descrição em Markdown exatamente conforme a interface padrão.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setEditingCardType(null);
                  setEditingProduct(null);
                  setEditingService(null);
                }}
                className="p-2 rounded-xl glass-pill text-zinc-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* SPLIT VIEW: FORMULÁRIO À ESQUERDA vs LIVE CARD PREVIEW À DIREITA */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* FORMULÁRIO */}
              <div className="lg:col-span-7 space-y-4">
                
                {/* Abas do Formulário */}
                <div className="flex items-center gap-2 border-b border-white/10 pb-2">
                  <button
                    type="button"
                    onClick={() => setActiveModalEditorTab('form')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-colors ${
                      activeModalEditorTab === 'form' ? 'bg-[#ff073a] text-white' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    1. Dados do Card & Links
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveModalEditorTab('markdown_preview')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-colors ${
                      activeModalEditorTab === 'markdown_preview' ? 'bg-[#ff073a] text-white' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    2. Editor & Preview Markdown
                  </button>
                </div>

                {activeModalEditorTab === 'form' ? (
                  <div className="space-y-4">
                    {/* Título Principal */}
                    <div>
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-1 font-bold">
                        Título Principal do Card *
                      </label>
                      <input
                        type="text"
                        value={editingCardType === 'produto' ? editingProduct?.title || '' : editingService?.title || ''}
                        onChange={(e) => {
                          if (editingCardType === 'produto' && editingProduct) {
                            setEditingProduct({ ...editingProduct, title: e.target.value });
                          } else if (editingCardType === 'servico' && editingService) {
                            setEditingService({ ...editingService, title: e.target.value });
                          }
                        }}
                        placeholder="Ex: ULTIMATE TYPEBOT PACK"
                        className="w-full bg-black/60 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white font-bold placeholder-neutral-600 focus:outline-none focus:border-[#ff073a]"
                      />
                    </div>

                    {/* Tag e Badges */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[10px] font-mono uppercase text-neutral-400 mb-1">
                          Tag de Categoria
                        </label>
                        <input
                          type="text"
                          value={editingCardType === 'produto' ? editingProduct?.tag || '' : editingService?.tag || ''}
                          onChange={(e) => {
                            if (editingCardType === 'produto' && editingProduct) {
                              setEditingProduct({ ...editingProduct, tag: e.target.value });
                            } else if (editingCardType === 'servico' && editingService) {
                              setEditingService({ ...editingService, tag: e.target.value });
                            }
                          }}
                          placeholder="Ex: MAIS DE 800 FLOWS"
                          className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono uppercase text-neutral-400 mb-1">
                          Badge Superior (Capa)
                        </label>
                        <input
                          type="text"
                          value={editingCardType === 'produto' ? editingProduct?.badge || '' : editingService?.badge || ''}
                          onChange={(e) => {
                            if (editingCardType === 'produto' && editingProduct) {
                              setEditingProduct({ ...editingProduct, badge: e.target.value });
                            } else if (editingCardType === 'servico' && editingService) {
                              setEditingService({ ...editingService, badge: e.target.value });
                            }
                          }}
                          placeholder="Ex: PRODUTO DIGITAL"
                          className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white"
                        />
                      </div>

                      {editingCardType === 'produto' && (
                        <div>
                          <label className="block text-[10px] font-mono uppercase text-neutral-400 mb-1">
                            Preço / Status
                          </label>
                          <input
                            type="text"
                            value={editingProduct?.price || ''}
                            onChange={(e) => {
                              if (editingProduct) setEditingProduct({ ...editingProduct, price: e.target.value });
                            }}
                            placeholder="Ex: Entrega Imediata"
                            className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white"
                          />
                        </div>
                      )}
                    </div>

                    {/* Headline */}
                    <div>
                      <label className="block text-[10px] font-mono uppercase text-neutral-400 mb-1">
                        Headline em Caixa Alta (Subtítulo)
                      </label>
                      <input
                        type="text"
                        value={editingCardType === 'produto' ? editingProduct?.headline || '' : editingService?.headline || ''}
                        onChange={(e) => {
                          if (editingCardType === 'produto' && editingProduct) {
                            setEditingProduct({ ...editingProduct, headline: e.target.value });
                          } else if (editingCardType === 'servico' && editingService) {
                            setEditingService({ ...editingService, headline: e.target.value });
                          }
                        }}
                        placeholder="Ex: PARE DE PERDER HORAS DESENHANDO FLUXOS DO ZERO"
                        className="w-full bg-black/60 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white uppercase font-mono"
                      />
                    </div>

                    {/* Imagem da Capa (Cover Hero) */}
                    <div className="space-y-2">
                      <label className="block text-[10px] font-mono uppercase text-neutral-400 font-bold">
                        URL da Imagem da Capa (Cover / Hero)
                      </label>
                      <input
                        type="text"
                        value={editingCardType === 'produto' ? editingProduct?.cover || '' : editingService?.cover || ''}
                        onChange={(e) => {
                          if (editingCardType === 'produto' && editingProduct) {
                            setEditingProduct({ ...editingProduct, cover: e.target.value });
                          } else if (editingCardType === 'servico' && editingService) {
                            setEditingService({ ...editingService, cover: e.target.value });
                          }
                        }}
                        placeholder="https://... ou /assets/notion/shop/..."
                        className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono"
                      />

                      {/* Atalhos Rápidos */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {PRESET_COVERS.map((preset, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              if (editingCardType === 'produto' && editingProduct) {
                                setEditingProduct({ ...editingProduct, cover: preset.url });
                              } else if (editingCardType === 'servico' && editingService) {
                                setEditingService({ ...editingService, cover: preset.url });
                              }
                            }}
                            className="px-2 py-0.5 rounded-md bg-white/5 hover:bg-white/10 border border-white/5 text-[10px] text-zinc-400 hover:text-white"
                          >
                            {preset.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Highlights (Bullets com Check Vermelho) */}
                    <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-mono font-bold text-white uppercase flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-[#ff073a]" />
                          <span>Destaques com Check (Highlights):</span>
                        </label>
                      </div>

                      <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                        {(editingCardType === 'produto' ? editingProduct?.highlights : editingService?.highlights)?.map(
                          (item, hIdx) => (
                            <div key={hIdx} className="flex items-center gap-2">
                              <Check className="w-3.5 h-3.5 text-[#ff073a] shrink-0" />
                              <input
                                type="text"
                                value={item}
                                onChange={(e) => {
                                  if (editingCardType === 'produto' && editingProduct) {
                                    const h = [...editingProduct.highlights];
                                    h[hIdx] = e.target.value;
                                    setEditingProduct({ ...editingProduct, highlights: h });
                                  } else if (editingCardType === 'servico' && editingService) {
                                    const h = [...editingService.highlights];
                                    h[hIdx] = e.target.value;
                                    setEditingService({ ...editingService, highlights: h });
                                  }
                                }}
                                className="flex-1 bg-black/40 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  if (editingCardType === 'produto' && editingProduct) {
                                    setEditingProduct({
                                      ...editingProduct,
                                      highlights: editingProduct.highlights.filter((_, i) => i !== hIdx),
                                    });
                                  } else if (editingCardType === 'servico' && editingService) {
                                    setEditingService({
                                      ...editingService,
                                      highlights: editingService.highlights.filter((_, i) => i !== hIdx),
                                    });
                                  }
                                }}
                                className="text-red-400 hover:text-white p-1"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          )
                        )}
                      </div>

                      <div className="flex items-center gap-2 pt-1">
                        <input
                          type="text"
                          placeholder="Novo destaque..."
                          value={newHighlightText}
                          onChange={(e) => setNewHighlightText(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              if (!newHighlightText.trim()) return;
                              if (editingCardType === 'produto' && editingProduct) {
                                setEditingProduct({
                                  ...editingProduct,
                                  highlights: [...editingProduct.highlights, newHighlightText.trim()],
                                });
                              } else if (editingCardType === 'servico' && editingService) {
                                setEditingService({
                                  ...editingService,
                                  highlights: [...editingService.highlights, newHighlightText.trim()],
                                });
                              }
                              setNewHighlightText('');
                            }
                          }}
                          className="flex-1 bg-black/60 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white"
                        />
                        <Button
                          size="sm"
                          onClick={() => {
                            if (!newHighlightText.trim()) return;
                            if (editingCardType === 'produto' && editingProduct) {
                              setEditingProduct({
                                ...editingProduct,
                                highlights: [...editingProduct.highlights, newHighlightText.trim()],
                              });
                            } else if (editingCardType === 'servico' && editingService) {
                              setEditingService({
                                ...editingService,
                                highlights: [...editingService.highlights, newHighlightText.trim()],
                              });
                            }
                            setNewHighlightText('');
                          }}
                          className="text-xs bg-white/10 hover:bg-white/20 text-white shrink-0"
                        >
                          <Plus className="w-3.5 h-3.5 mr-1" />
                          <span>Adicionar</span>
                        </Button>
                      </div>
                    </div>

                    {/* COMPORTAMENTO DO BOTÃO "SAIBA MAIS" & LINKS */}
                    <div className="p-3.5 rounded-2xl bg-red-950/20 border border-red-900/40 space-y-3">
                      <label className="text-[11px] font-mono font-bold text-red-400 uppercase flex items-center gap-1.5">
                        <ArrowRight className="w-3.5 h-3.5" />
                        <span>Comportamento do Botão &quot;Saiba mais&quot;:</span>
                      </label>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            if (editingCardType === 'produto' && editingProduct) {
                              setEditingProduct({ ...editingProduct, actionType: 'modal' });
                            } else if (editingCardType === 'servico' && editingService) {
                              setEditingService({ ...editingService, actionType: 'modal' });
                            }
                          }}
                          className={`p-2.5 rounded-xl border text-left text-xs font-mono transition-all ${
                            (editingCardType === 'produto' ? editingProduct?.actionType : editingService?.actionType) !== 'link'
                              ? 'bg-red-950/60 border-red-500 text-white font-bold'
                              : 'bg-black/40 border-white/10 text-neutral-400'
                          }`}
                        >
                          <span className="block text-white font-bold">1. Abrir Modal de Detalhes</span>
                          <span className="text-[10px] text-neutral-400">Exibe markdown completo, destaques e botão oficial.</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            if (editingCardType === 'produto' && editingProduct) {
                              setEditingProduct({ ...editingProduct, actionType: 'link' });
                            } else if (editingCardType === 'servico' && editingService) {
                              setEditingService({ ...editingService, actionType: 'link' });
                            }
                          }}
                          className={`p-2.5 rounded-xl border text-left text-xs font-mono transition-all ${
                            (editingCardType === 'produto' ? editingProduct?.actionType : editingService?.actionType) === 'link'
                              ? 'bg-red-950/60 border-red-500 text-white font-bold'
                              : 'bg-black/40 border-white/10 text-neutral-400'
                          }`}
                        >
                          <span className="block text-white font-bold">2. Redirecionar para URL</span>
                          <span className="text-[10px] text-neutral-400">Abre diretamente o Page Link cadastrado.</span>
                        </button>
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono uppercase text-neutral-400 mb-1">
                          Slot de Page Link (URL de Destino)
                        </label>
                        <input
                          type="text"
                          value={editingCardType === 'produto' ? editingProduct?.pageLink || '' : editingService?.pageLink || ''}
                          onChange={(e) => {
                            if (editingCardType === 'produto' && editingProduct) {
                              setEditingProduct({ ...editingProduct, pageLink: e.target.value });
                            } else if (editingCardType === 'servico' && editingService) {
                              setEditingService({ ...editingService, pageLink: e.target.value });
                            }
                          }}
                          placeholder="https://... ou /biblioteca"
                          className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white font-mono"
                        />
                      </div>
                    </div>

                    {/* Botão de Compra / WhatsApp CTA */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="block text-[10px] font-mono uppercase text-neutral-400 mb-1">
                          Texto CTA do Botão no Modal
                        </label>
                        <input
                          type="text"
                          value={editingCardType === 'produto' ? editingProduct?.cta || '' : editingService?.cta || ''}
                          onChange={(e) => {
                            if (editingCardType === 'produto' && editingProduct) {
                              setEditingProduct({ ...editingProduct, cta: e.target.value });
                            } else if (editingCardType === 'servico' && editingService) {
                              setEditingService({ ...editingService, cta: e.target.value });
                            }
                          }}
                          placeholder="Ex: OBTER AGORA"
                          className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-1.5 text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono uppercase text-neutral-400 mb-1">
                          Mensagem do WhatsApp
                        </label>
                        <input
                          type="text"
                          value={editingCardType === 'produto' ? editingProduct?.whatsappMessage || '' : editingService?.whatsappMessage || ''}
                          onChange={(e) => {
                            if (editingCardType === 'produto' && editingProduct) {
                              setEditingProduct({ ...editingProduct, whatsappMessage: e.target.value });
                            } else if (editingCardType === 'servico' && editingService) {
                              setEditingService({ ...editingService, whatsappMessage: e.target.value });
                            }
                          }}
                          placeholder="Oi Mateus, tenho interesse no item..."
                          className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-1.5 text-white"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  /* ABA DO EDITOR DE MARKDOWN */
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-mono font-bold text-white uppercase flex items-center gap-1.5">
                          <FileCode className="w-4 h-4 text-[#ff073a]" />
                          <span>Descrição em Markdown:</span>
                        </label>
                        <span className="text-[10px] font-mono text-zinc-500">GFM Habilitado (negrito, links, listas)</span>
                      </div>
                      <textarea
                        rows={8}
                        value={editingCardType === 'produto' ? editingProduct?.description || '' : editingService?.description || ''}
                        onChange={(e) => {
                          if (editingCardType === 'produto' && editingProduct) {
                            setEditingProduct({ ...editingProduct, description: e.target.value });
                          } else if (editingCardType === 'servico' && editingService) {
                            setEditingService({ ...editingService, description: e.target.value });
                          }
                        }}
                        placeholder="Escreva a descrição em Markdown..."
                        className="w-full bg-black/70 border border-white/10 rounded-xl p-3.5 text-xs text-white font-mono focus:outline-none focus:border-[#ff073a] leading-relaxed resize-y"
                      />
                    </div>

                    <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 space-y-2">
                      <span className="text-[11px] font-mono font-bold text-neutral-400 uppercase flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5 text-[#ff073a]" />
                        <span>Visualização Renderizada do Markdown:</span>
                      </span>
                      <div
                        className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-zinc-300 font-light leading-relaxed prose prose-invert prose-red max-w-none prose-p:my-1.5 prose-headings:text-white prose-strong:text-white"
                        dangerouslySetInnerHTML={{
                          __html: parseNotionMarkdown(
                            (editingCardType === 'produto' ? editingProduct?.description : editingService?.description) ||
                              '*Nenhuma descrição informada ainda.*'
                          ),
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* LIVE CARD PREVIEW À DIREITA */}
              <div className="lg:col-span-5 space-y-3">
                <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider font-semibold flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-[#ff073a]" />
                  <span>Prévia do Card em Tempo Real:</span>
                </span>

                <div className="glass-crystal rounded-2xl sm:rounded-3xl p-5 flex flex-col justify-between group border border-white/20 shadow-2xl bg-black/80">
                  <div>
                    {/* Capa */}
                    <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full rounded-xl sm:rounded-2xl overflow-hidden mb-4 bg-black border border-white/10 shadow-lg">
                      <img
                        src={(editingCardType === 'produto' ? editingProduct?.cover : editingService?.cover) || PRESET_COVERS[0].url}
                        alt="Preview Capa"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                      <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-lg glass-pill-red text-[10px] font-mono text-[#ff073a] font-bold">
                        {(editingCardType === 'produto' ? editingProduct?.badge : editingService?.badge) || 'BADGE'}
                      </div>
                      {editingCardType === 'produto' && (
                        <div className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-lg glass-pill text-[10px] font-mono text-zinc-300">
                          {editingProduct?.price || 'Entrega Imediata'}
                        </div>
                      )}
                    </div>

                    {/* Tag */}
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-md glass-pill text-[#ff073a] font-semibold">
                        {(editingCardType === 'produto' ? editingProduct?.tag : editingService?.tag) || 'CATEGORIA'}
                      </span>
                    </div>

                    {/* Título */}
                    <h3 className="text-lg font-black text-white leading-tight">
                      {(editingCardType === 'produto' ? editingProduct?.title : editingService?.title) || 'Título do Card'}
                    </h3>

                    {/* Headline */}
                    <p className="mt-1 text-[10px] font-mono text-zinc-400 font-bold uppercase tracking-wider leading-snug">
                      {(editingCardType === 'produto' ? editingProduct?.headline : editingService?.headline) || 'HEADLINE AQUI'}
                    </p>

                    {/* Descrição em Markdown */}
                    <div
                      className="mt-2.5 text-xs text-zinc-300 font-light leading-relaxed prose prose-invert prose-red max-w-none line-clamp-3 prose-p:my-0"
                      dangerouslySetInnerHTML={{
                        __html: parseNotionMarkdown(
                          (editingCardType === 'produto' ? editingProduct?.description : editingService?.description) ||
                            'Descrição de exemplo...'
                        ),
                      }}
                    />

                    {/* Highlights */}
                    <div className="mt-4 pt-3 border-t border-white/10 space-y-1.5">
                      {(editingCardType === 'produto' ? editingProduct?.highlights : editingService?.highlights)
                        ?.slice(0, 3)
                        .map((h, hIdx) => (
                          <div key={hIdx} className="flex items-start gap-2 text-xs text-zinc-300 font-mono">
                            <Check className="w-3.5 h-3.5 text-[#ff073a] shrink-0 mt-0.5" />
                            <span className="leading-tight text-[11px]">{h}</span>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Botão Único Saiba mais no Preview */}
                  <div className="mt-5 pt-3.5 border-t border-white/10">
                    <div className="glass-button-fired w-full min-h-[44px] py-2.5 px-4 rounded-xl text-xs font-mono font-bold text-white shadow-xl flex items-center justify-center gap-2 cursor-pointer">
                      <span>Saiba mais</span>
                      <ArrowRight className="w-4 h-4 shrink-0 text-white/90" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Ações do Rodapé do Modal */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setEditingCardType(null);
                  setEditingProduct(null);
                  setEditingService(null);
                }}
                className="text-xs border-white/10"
              >
                Cancelar
              </Button>

              <Button
                size="sm"
                onClick={handleSaveModalCard}
                className="bg-[#ff073a] hover:bg-[#d0002e] text-white font-bold text-xs gap-1.5 shadow-[0_0_15px_rgba(255,7,58,0.4)] cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Salvar Card</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
