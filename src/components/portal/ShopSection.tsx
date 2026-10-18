'use client';

import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Bot, 
  Check, 
  MessageSquare, 
  ArrowRight, 
  Sparkles, 
  X, 
  Info, 
  ExternalLink, 
  Flame, 
  ShieldCheck, 
  Zap, 
  Layers,
  GraduationCap,
  Link as LinkIcon
} from 'lucide-react';
import BalatroShader from '@/components/shaders/BalatroShader';
import AlternatingHeroBanner from '@/components/portal/AlternatingHeroBanner';

export interface ShopFeature {
  icon: string;
  title: string;
  desc: string;
}

export interface ShopHero {
  welcome: string;
  tagline: string;
  artImage?: string;
  artImages?: string[];
  features: ShopFeature[];
  idealFor: string[];
}

export interface ShopProductItem {
  id: string;
  title: string;
  tag: string;
  badge: string;
  price: string;
  cover: string;
  headline: string;
  description: string;
  pageLink?: string;
  highlights: string[];
  details?: {
    entrega?: string;
    segurança?: string;
    ideal?: string;
  };
  cta?: string;
  whatsappMessage?: string;
}

export interface ShopServiceItem {
  id: string;
  title: string;
  tag: string;
  badge: string;
  cover: string;
  headline: string;
  description: string;
  pageLink?: string;
  highlights: string[];
  details?: {
    implementacao?: string;
    tecnologia?: string;
    resultado?: string;
    personalizacao?: string;
  };
  cta?: string;
  whatsappMessage?: string;
}

export interface ShopData {
  hero?: ShopHero;
  produtos?: ShopProductItem[];
  servicos?: ShopServiceItem[];
}

export interface ShopSectionProps {
  shopData?: ShopData;
  onOpenContact?: () => void;
}

export function ShopSection({ shopData, onOpenContact }: ShopSectionProps) {
  const [activeShopTab, setActiveShopTab] = useState<'produtos' | 'servicos'>('produtos');
  const [selectedProduct, setSelectedProduct] = useState<ShopProductItem | null>(null);
  const [selectedService, setSelectedService] = useState<ShopServiceItem | null>(null);

  const defaultHero: ShopHero = {
    welcome: 'SEJA BEM VINDO A LOJA VIRTUAL DE MATEUS CELESTINO PRO',
    tagline: 'AQUI VOCÊ ENCONTRA UMA LOJA VIRTUAL COM MEUS PRODUTOS E MEUS SERVIÇOS DISPONÍVEIS PARA A COMPRA.',
    artImage: '/assets/notion/shop/hero_art.png',
    features: [
      {
        icon: '🚀',
        title: 'Produtos de Alta Performance',
        desc: 'Cada item disponível aqui foi criado com foco total em resultado, praticidade e performance. Do digital ao automatizado, tudo é pensado para facilitar sua vida e impulsionar seus negócios.'
      },
      {
        icon: '🤖',
        title: 'Serviços Inteligentes, Prontos para Executar',
        desc: 'Automatizações, fluxos prontos, ferramentas e soluções estratégicas. Tudo testado, validado e pronto para aplicar no seu negócio agora mesmo.'
      },
      {
        icon: '🎯',
        title: 'Para Profissionais Exigentes',
        desc: 'Se você busca excelência, agilidade, inovação e design superior — você está no lugar certo. Essa loja é para quem não aceita menos que o topo.'
      }
    ],
    idealFor: [
      'Gestores de automação',
      'Infoprodutores',
      'Freelancers e agências',
      'Criadores de conteúdo',
      'Donos de negócio digital'
    ]
  };

  const defaultProdutos: ShopProductItem[] = [
    {
      id: 'prod-typebot',
      title: 'ULTIMATE TYPEBOT PACK',
      tag: 'MAIS DE 800 FLOWS',
      badge: 'PRODUTO DIGITAL',
      price: 'Entrega Imediata',
      cover: '/assets/notion/shop/products/typebot/ChatGPT_Image_9_de_jun._de_2025_13_14_33.png',
      headline: 'PARE DE PERDER HORAS DESENHANDO FLUXOS DO ZERO',
      description: 'O acervo definitivo com mais de 800 fluxos prontos de Typebot para substituir landing pages tradicionais e atendimento humano por conversações interativas que convertem leads 24 horas por dia.',
      highlights: [
        'Mais de 800 flows prontos, validados e categorizados',
        'Substitui landing page tradicional e suporte manual ao cliente',
        'Lógica condicional avançada, variáveis dinâmicas e chamadas HTTP',
        'Pronto para plugar em WhatsApp, websites e funis de venda',
        'Engenharia reversa de elite para estudar e implementar imediatamente'
      ],
      details: {
        entrega: 'Acesso imediato enviado para armazenamento em nuvem segura.',
        segurança: 'Checkout blindado com criptografia e suporte direto.',
        ideal: 'Profissionais que buscam escalar conversão sem depender de atendentes humanos.'
      },
      cta: 'OBTER TYPEBOT PACK',
      whatsappMessage: 'Oi Mateus, tenho interesse no ULTIMATE TYPEBOT PACK com mais de 800 flows!'
    },
    {
      id: 'prod-n8n',
      title: 'ULTIMATE N8N PACK',
      tag: 'WORKFLOWS MESTRES',
      badge: 'NODEMATION MESTRE',
      price: 'Entrega Imediata',
      cover: '/assets/notion/shop/products/n8n/Robo_Central_em_Sala_Futurista.png',
      headline: 'PULANDO DIRETO PARA A PARTE QUE IMPORTA: USAR, APLICAR E FATURAR',
      description: 'Acervo valioso de workflows do n8n prontos, testados e otimizados ao longo de meses de operação real. Nutrição de leads, disparo omni-channel, integração com bancos relacionais e webhooks.',
      highlights: [
        'Acervo completo de workflows prontos e testados para produção',
        'Nutrição e qualificação de leads sem esforço manual',
        'Automações para tarefas urgentes e rotinas críticas de suporte',
        'Integração pronta com Baserow, Supabase, CRM e bancos SQL',
        'Economia massiva de tempo com arquitetura robusta de nós'
      ],
      details: {
        entrega: 'Download dos JSONs organizados por categoria de negócio.',
        segurança: 'Código 100% seu, livre de mensalidades de plataformas proprietárias.',
        ideal: 'Gestores de tráfego, agências e desenvolvedores de automação.'
      },
      cta: 'OBTER N8N PACK',
      whatsappMessage: 'Oi Mateus, tenho interesse no ULTIMATE N8N PACK!'
    },
    {
      id: 'prod-make',
      title: 'ULTIMATE MAKE PACK',
      tag: 'MAKE / INTEGROMAT',
      badge: 'FLUXOS TESTADOS',
      price: 'Entrega Imediata',
      cover: '/assets/notion/shop/products/make/ChatGPT_Image_9_de_jun._de_2025_20_18_41.png',
      headline: 'BLUEPRINTS COMPLETOS E CONEXÕES ROBUSTAS NO MAKE.COM',
      description: 'Coleção de cenários testados no Make/Integromat para quem precisa de integrações rápidas e eficientes entre e-commerces, CRMs, ferramentas de disparo e inteligências artificiais.',
      highlights: [
        'Blueprints prontos para importação em 1 clique',
        'Estruturação otimizada para baixo consumo de operações',
        'Integração com gateways de pagamento, Google Sheets e WhatsApp',
        'Filtros avançados e tratamento nativo de rotas de erro',
        'Economize neurônios e lance suas integrações no mesmo dia'
      ],
      details: {
        entrega: 'Acesso imediato aos blueprints de alta performance.',
        segurança: 'Arquiteturas validadas em operações ativas de mercado.',
        ideal: 'Empresários e freelancers que operam ecossistemas no Make.'
      },
      cta: 'OBTER MAKE PACK',
      whatsappMessage: 'Oi Mateus, tenho interesse no ULTIMATE MAKE PACK!'
    },
    {
      id: 'prod-curso-iapro',
      title: 'I.A PRO (CURSO)',
      tag: 'FORMAÇÃO COMPLETA',
      badge: 'CERTIFICADO OFICIAL',
      price: 'Vagas Limitadas',
      cover: '/assets/notion/shop/products/curso_iapro/I.A_PRO.png',
      headline: 'UM CURSO COMPLETO COM MATERIAIS EXCLUSIVOS PARA VOCÊ DOMINAR AUTOMAÇÃO',
      description: 'Aprenda os fundamentos de n8n, APIs e crie sua própria A.I Automation Agency (AAA). Inclui como bônus oficial acesso integral ao Ultimate n8n Pack, comunidade exclusiva e certificado emitido por Mateus Celestino Pro.',
      highlights: [
        'Aprenda n8n do zero aos nós mais avançados sem precisar saber programar',
        'BÔNUS EXCLUSIVO: Acesso completo ao Ultimate n8n Pack incluso no curso',
        'Módulo completo sobre Como Criar sua A.I Automation Agency e Vender',
        'Comunidade exclusiva em Web-App para networking e dúvidas',
        'Certificado oficial de conclusão emitido por Mateus Celestino Pro'
      ],
      details: {
        entrega: 'Acesso imediato à área de membros exclusiva.',
        segurança: 'Conteúdo constantemente atualizado com o mercado.',
        ideal: 'Profissionais que desejam surfar a maior oportunidade de faturamento da história.'
      },
      cta: 'GARANTIR VAGA NO I.A PRO',
      whatsappMessage: 'Oi Mateus, quero garantir minha vaga na formação I.A PRO!'
    }
  ];

  const defaultServicos: ShopServiceItem[] = [
    {
      id: 'serv-ai-agents',
      title: 'A.I AGENTS',
      tag: 'ATENDIMENTO & VENDAS 24/7',
      badge: 'SOLUÇÃO SOB MEDIDA',
      cover: '/assets/notion/shop/services/ai_agents/Robo_Elegante_em_Neon_Vermelho.png',
      headline: 'UM TIME VIRTUAL DE AGENTES VENDENDO PARA VOCÊ 24 HORAS POR DIA',
      description: 'Implementação de robôs digitais dotados de conhecimento profundo do seu negócio. Não precisam descansar, não tiram férias, não possuem mau humor e eliminam a sobrecarga da equipe humana.',
      highlights: [
        'Time de Atendimento e Suporte 24/7 sem fila de espera',
        'Agente SDR inteligente de prospecção e qualificação de clientes',
        'Agente Agendador integrado diretamente à sua agenda Google/Cal',
        'Base de conhecimento customizada conectada a banco de dados do seu negócio',
        'Operação no WhatsApp com linguagem humanizada e respostas contextuais'
      ],
      details: {
        implementacao: 'Projeto consultivo feito sob medida para seu nicho.',
        tecnologia: 'OpenAI ChatGPT + n8n/Typebot em servidores dedicados autônomos.',
        resultado: 'Aumento imediato de velocidade de resposta e taxa de conversão.'
      },
      cta: 'CONTRATAR A.I AGENTS',
      whatsappMessage: 'Oi Mateus, quero contratar a implementação de A.I AGENTS para a minha empresa!'
    },
    {
      id: 'serv-link-tree',
      title: 'PÁGINA DE LINKS (SUPERIOR)',
      tag: 'WEB DESIGN & AUTORIDADE',
      badge: 'PAGAMENTO ÚNICO',
      cover: '/assets/notion/shop/services/link_tree/Acordo_Futurista_na_Cidade_Neon.png',
      headline: 'UMA PÁGINA SUPERIOR, COM DESIGN SUPERIOR, PARA UM NEGÓCIO SUPERIOR',
      description: 'Árvore de links ultra-profissional com design cinematográfico e sofisticado. Esqueça soluções prontas genéricas e caras como Linktree: pague uma única vez e tenha uma página sua para sempre, sem mensalidades.',
      highlights: [
        'Design elegante, limpo e customizado para sua identidade visual',
        '100% responsiva com tempo de carregamento ultrarrápido',
        'Sem mensalidades, sem taxas recorrentes: pague apenas uma vez',
        'Linktrack ativado para acompanhar cliques, origem e conversão',
        'Integração total com WhatsApp, redes sociais, produtos e formulários'
      ],
      details: {
        implementacao: 'Entrega rápida com domínio personalizado ou subdomínio.',
        personalizacao: 'Total liberdade para adicionar botões, banners e destaques a qualquer momento.',
        resultado: 'Transmissão imediata de sofisticação, profissionalismo e autoridade.'
      },
      cta: 'SOLICITAR PÁGINA SUPERIOR',
      whatsappMessage: 'Oi Mateus, quero criar minha PÁGINA DE LINKS SUPERIOR sem mensalidades!'
    }
  ];

  const hero = shopData?.hero || defaultHero;
  const produtos = (shopData?.produtos && shopData.produtos.length > 0) ? shopData.produtos : defaultProdutos;
  const servicos = (shopData?.servicos && shopData.servicos.length > 0) ? shopData.servicos : defaultServicos;

  return (
    <section id="shop" className="py-24 relative overflow-hidden">
      {/* Balatro Shader — Vermelho Carmesim Profundo */}
      <BalatroShader
        className="z-0 mix-blend-screen"
        color1="#8a0012"
        color2="#3a0008"
        color3="#000000"
        contrast={2.2}
        opacity={0.32}
      />

      {/* Zonas de Transição com Blur Suave */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black via-black/85 to-transparent pointer-events-none z-1 backdrop-blur-[6px]" />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black via-black/85 to-transparent pointer-events-none z-1 backdrop-blur-[6px]" />

      <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-16 relative z-10">
        
        {/* HEADER & HERO DA LOJA ORIGINAL NOTION EM 2 COLUNAS */}
        <div className="glass-crystal p-8 sm:p-12 rounded-3xl mb-14 border border-white/10 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Coluna Esquerda: Textos Originais do Notion */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-pill-red text-xs font-mono text-[#ff073a] font-bold uppercase tracking-wider">
                <ShoppingBag className="w-4 h-4" />
                <span>LOJA VIRTUAL OFICIAL DE MATEUS CELESTINO PRO</span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                {hero.welcome}
              </h2>

              <p className="text-base sm:text-lg text-zinc-300 font-light leading-relaxed">
                {hero.tagline}
              </p>

              {/* 3 Blocos de Destaque Originais */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                {hero.features.map((feat, idx) => (
                  <div key={idx} className="glass-card-nested p-4 rounded-2xl border border-white/10 hover:border-[#ff073a]/40 transition-colors">
                    <span className="text-2xl block mb-2">{feat.icon}</span>
                    <h4 className="text-sm font-bold text-white mb-1.5">{feat.title}</h4>
                    <p className="text-xs text-zinc-400 font-light leading-snug">{feat.desc}</p>
                  </div>
                ))}
              </div>

              {/* Bloco: Ideal Para */}
              <div className="pt-4 border-t border-white/10">
                <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 mb-3 font-semibold uppercase tracking-wider">
                  <Flame className="w-3.5 h-3.5 text-[#ff073a]" />
                  <span>Ideal para:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {hero.idealFor.map((item, idx) => (
                    <span 
                      key={idx}
                      className="px-3 py-1 rounded-xl glass-pill text-xs font-mono text-zinc-200 border border-white/5"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Coluna Direita: Alternating Hero Banner (Se houver múltiplas imagens, alternam suavemente no mesmo espaço) */}
            <div className="lg:col-span-5 flex justify-center w-full">
              <AlternatingHeroBanner
                images={hero.artImages && hero.artImages.length > 0 ? hero.artImages : [hero.artImage || '/assets/notion/shop/hero_art.png']}
                title="Loja Oficial"
                badgeText="100% VALIDADO"
                tagline="Soluções prontas para você economizar tempo e faturar alto."
                aspectRatio="aspect-square"
                intervalMs={4500}
              />
            </div>

          </div>

          {/* Seletor de Abas da Loja (COMPRE AGORA): PRODUTOS vs SERVIÇOS */}
          <div className="mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="w-full sm:w-auto flex p-1.5 rounded-2xl glass-pill border border-white/10">
              <button
                type="button"
                onClick={() => setActiveShopTab('produtos')}
                className={`flex-1 sm:flex-initial px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl text-xs font-mono tracking-wider font-bold transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 min-h-[48px] ${
                  activeShopTab === 'produtos'
                    ? 'glass-button-fired text-white shadow-xl scale-[1.01]'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Layers className="w-4 h-4 text-[#ff073a]" />
                <span>PRODUTOS ({produtos.length})</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveShopTab('servicos')}
                className={`flex-1 sm:flex-initial px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl text-xs font-mono tracking-wider font-bold transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 min-h-[48px] ${
                  activeShopTab === 'servicos'
                    ? 'glass-button-fired text-white shadow-xl scale-[1.01]'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Bot className="w-4 h-4 text-[#ff073a]" />
                <span>SERVIÇOS ({servicos.length})</span>
              </button>
            </div>

            <div className="text-xs font-mono text-zinc-400 flex items-center justify-center sm:justify-end gap-2 py-1">
              <ShieldCheck className="w-4 h-4 text-[#ff073a]" />
              <span>Checkout seguro & atendimento direto</span>
            </div>
          </div>
        </div>

        {/* ABA DE PRODUTOS: OS 4 PRODUTOS AUTÊNTICOS DO NOTION */}
        {activeShopTab === 'produtos' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {produtos.map((prod) => (
              <div
                key={prod.id}
                className="glass-crystal glass-interactive rounded-2xl sm:rounded-3xl p-5 sm:p-8 flex flex-col justify-between group border border-white/10 hover:border-[#ff073a]/50 transition-all duration-300 shadow-xl"
              >
                <div>
                  {/* Capa do Produto */}
                  <div className="relative aspect-[16/9] w-full rounded-xl sm:rounded-2xl overflow-hidden mb-5 sm:mb-6 bg-black border border-white/10 shadow-xl">
                    <img
                      src={prod.cover}
                      alt={prod.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-75" />
                    <div className="absolute top-3 left-3 sm:top-3.5 sm:left-3.5 px-3 py-1 rounded-xl glass-pill-red text-[11px] sm:text-xs font-mono text-[#ff073a] font-bold border border-[#ff073a]/40 shadow-lg">
                      {prod.badge}
                    </div>
                    <div className="absolute top-3 right-3 sm:top-3.5 sm:right-3.5 px-3 py-1 rounded-xl glass-pill text-[11px] sm:text-xs font-mono text-zinc-200 border border-white/15 bg-black/60 shadow-lg">
                      {prod.price}
                    </div>
                  </div>

                  {/* Faixa de Tag e Preço Visível */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                    <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-lg glass-pill text-[#ff073a] font-semibold border border-[#ff073a]/30">
                      {prod.tag}
                    </span>
                    <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded-lg border border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                      {prod.price}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-black text-white group-hover:text-[#ff073a] transition-all">
                    {prod.title}
                  </h3>

                  <p className="mt-1 text-xs font-mono text-zinc-400 font-bold uppercase tracking-wider">
                    {prod.headline}
                  </p>

                  <p className="mt-3 text-xs sm:text-sm text-zinc-300 font-light leading-relaxed">
                    {prod.description}
                  </p>

                  {/* Highlights com ícones de checagem */}
                  <div className="mt-5 pt-4 border-t border-white/10 space-y-2">
                    {prod.highlights.slice(0, 4).map((h, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-zinc-300 font-mono">
                        <Check className="w-4 h-4 text-[#ff073a] shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Ações Mobile-First: Botão Amplo de Contratação + Ações Secundárias */}
                <div className="mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-white/10 flex flex-col gap-2.5 sm:gap-3">
                  <a
                    href={`https://api.whatsapp.com/send/?phone=553197724257&text=${encodeURIComponent(prod.whatsappMessage || `Oi Mateus, tenho interesse no produto ${prod.title}`)}&type=phone_number&app_absent=0`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass-button-fired w-full min-h-[48px] py-3.5 px-4 rounded-xl text-xs sm:text-sm font-mono font-bold text-white shadow-xl flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] transition-transform cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>{prod.cta || 'OBTER AGORA'}</span>
                  </a>

                  <div className={`grid ${prod.pageLink ? 'grid-cols-2' : 'grid-cols-1'} gap-2`}>
                    {prod.pageLink && (
                      <a
                        href={prod.pageLink}
                        target={prod.pageLink.startsWith('http') ? '_blank' : '_self'}
                        rel="noopener noreferrer"
                        className="min-h-[44px] py-2.5 px-3 rounded-xl glass-pill text-xs font-mono text-[#ff073a] hover:text-white hover:bg-[#ff073a]/20 flex items-center justify-center gap-1.5 transition-colors border border-[#ff073a]/30"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Saiba mais</span>
                      </a>
                    )}

                    <button
                      type="button"
                      onClick={() => setSelectedProduct(prod)}
                      className="min-h-[44px] py-2.5 px-3 rounded-xl glass-pill text-xs font-mono text-zinc-300 hover:text-white flex items-center justify-center gap-1.5 cursor-pointer transition-colors border border-white/10 hover:border-white/20"
                    >
                      <Info className="w-3.5 h-3.5" />
                      <span>Ver Detalhes</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ABA DE SERVIÇOS: OS 2 SERVIÇOS AUTÊNTICOS DO NOTION */}
        {activeShopTab === 'servicos' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {servicos.map((serv) => (
              <div
                key={serv.id}
                className="glass-crystal glass-interactive rounded-2xl sm:rounded-3xl p-5 sm:p-8 flex flex-col justify-between group border border-white/10 hover:border-[#ff073a]/50 transition-all duration-300 shadow-xl"
              >
                <div>
                  {/* Capa do Serviço */}
                  <div className="relative aspect-[16/9] w-full rounded-xl sm:rounded-2xl overflow-hidden mb-5 sm:mb-6 bg-black border border-white/10 shadow-xl">
                    <img
                      src={serv.cover}
                      alt={serv.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-75" />
                    <div className="absolute top-3 left-3 sm:top-3.5 sm:left-3.5 px-3 py-1 rounded-xl glass-pill-red text-[11px] sm:text-xs font-mono text-[#ff073a] font-bold border border-[#ff073a]/40 shadow-lg">
                      {serv.badge}
                    </div>
                  </div>

                  {/* Faixa de Tag e Destaque */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                    <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-lg glass-pill text-[#ff073a] font-semibold border border-[#ff073a]/30">
                      {serv.tag}
                    </span>
                    <span className="text-xs font-mono font-bold text-red-300 bg-red-950/60 px-2.5 py-0.5 rounded-lg border border-red-500/40">
                      {serv.badge}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-black text-white group-hover:text-[#ff073a] transition-all">
                    {serv.title}
                  </h3>

                  <p className="mt-1 text-xs font-mono text-zinc-400 font-bold uppercase tracking-wider">
                    {serv.headline}
                  </p>

                  <p className="mt-3 text-xs sm:text-sm text-zinc-300 font-light leading-relaxed">
                    {serv.description}
                  </p>

                  {/* Highlights com ícones */}
                  <div className="mt-5 pt-4 border-t border-white/10 space-y-2">
                    {serv.highlights.map((h, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-zinc-300 font-mono">
                        <Check className="w-4 h-4 text-[#ff073a] shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Ações Mobile-First: Botão Amplo de Contratação + Ações Secundárias */}
                <div className="mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-white/10 flex flex-col gap-2.5 sm:gap-3">
                  <a
                    href={`https://api.whatsapp.com/send/?phone=553197724257&text=${encodeURIComponent(serv.whatsappMessage || `Oi Mateus, tenho interesse no serviço ${serv.title}`)}&type=phone_number&app_absent=0`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass-button-fired w-full min-h-[48px] py-3.5 px-4 rounded-xl text-xs sm:text-sm font-mono font-bold text-white shadow-xl flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] transition-transform cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>{serv.cta || 'CONTRATAR AGORA'}</span>
                  </a>

                  <div className={`grid ${serv.pageLink ? 'grid-cols-2' : 'grid-cols-1'} gap-2`}>
                    {serv.pageLink && (
                      <a
                        href={serv.pageLink}
                        target={serv.pageLink.startsWith('http') ? '_blank' : '_self'}
                        rel="noopener noreferrer"
                        className="min-h-[44px] py-2.5 px-3 rounded-xl glass-pill text-xs font-mono text-[#ff073a] hover:text-white hover:bg-[#ff073a]/20 flex items-center justify-center gap-1.5 transition-colors border border-[#ff073a]/30"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Saiba mais</span>
                      </a>
                    )}

                    <button
                      type="button"
                      onClick={() => setSelectedService(serv)}
                      className="min-h-[44px] py-2.5 px-3 rounded-xl glass-pill text-xs font-mono text-zinc-300 hover:text-white flex items-center justify-center gap-1.5 cursor-pointer transition-colors border border-white/10 hover:border-white/20"
                    >
                      <Info className="w-3.5 h-3.5" />
                      <span>Ver Escopo</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* MODAL DE DETALHES DE PRODUTO */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="relative max-w-2xl w-full max-h-[88vh] overflow-y-auto glass-crystal rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-white/20 shadow-2xl">
            <button
              type="button"
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 sm:top-5 sm:right-5 p-2.5 min-w-[44px] min-h-[44px] rounded-xl glass-pill text-zinc-400 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
              aria-label="Fechar modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative aspect-[16/9] w-full rounded-xl sm:rounded-2xl overflow-hidden mb-5 sm:mb-6 bg-black border border-white/10">
              <img
                src={selectedProduct.cover}
                alt={selectedProduct.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3.5 left-3.5 px-3 py-1 rounded-xl glass-pill-red text-xs font-mono text-[#ff073a] font-bold">
                {selectedProduct.badge}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <span className="text-xs font-mono text-[#ff073a] font-bold px-3 py-1 rounded-lg glass-pill inline-block">
                {selectedProduct.tag}
              </span>
              <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-lg border border-emerald-500/40">
                {selectedProduct.price}
              </span>
            </div>

            <h3 className="text-xl sm:text-3xl font-black text-white">
              {selectedProduct.title}
            </h3>

            <p className="mt-1.5 text-xs sm:text-sm font-mono text-zinc-400 font-semibold">
              {selectedProduct.headline}
            </p>

            <p className="mt-3.5 text-xs sm:text-sm text-zinc-300 font-light leading-relaxed">
              {selectedProduct.description}
            </p>

            <div className="mt-5 p-4 rounded-xl sm:rounded-2xl glass-card-nested border border-white/10 space-y-2.5">
              <h4 className="text-xs font-mono text-white font-bold uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#ff073a]" />
                <span>O QUE ESTÁ INCLUSO:</span>
              </h4>
              <ul className="space-y-2">
                {selectedProduct.highlights.map((h, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-zinc-300 font-mono">
                    <Check className="w-3.5 h-3.5 text-[#ff073a] shrink-0 mt-0.5" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>

            {selectedProduct.details && (
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                {selectedProduct.details.entrega && (
                  <div className="p-3 rounded-xl glass-card-nested border border-white/5">
                    <span className="text-[#ff073a] font-bold block mb-1">📦 Entrega:</span>
                    <span className="text-zinc-300">{selectedProduct.details.entrega}</span>
                  </div>
                )}
                {selectedProduct.details.segurança && (
                  <div className="p-3 rounded-xl glass-card-nested border border-white/5">
                    <span className="text-[#ff073a] font-bold block mb-1">🔒 Segurança:</span>
                    <span className="text-zinc-300">{selectedProduct.details.segurança}</span>
                  </div>
                )}
              </div>
            )}

            <div className="mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2.5 sm:gap-3">
              <button
                type="button"
                onClick={() => setSelectedProduct(null)}
                className="w-full sm:w-auto px-5 py-3 rounded-xl glass-pill text-xs font-mono text-zinc-300 hover:text-white cursor-pointer min-h-[44px] text-center"
              >
                Fechar
              </button>
              {selectedProduct.pageLink && (
                <a
                  href={selectedProduct.pageLink}
                  target={selectedProduct.pageLink.startsWith('http') ? '_blank' : '_self'}
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-5 py-3 rounded-xl glass-pill text-xs font-mono text-[#ff073a] hover:text-white hover:bg-[#ff073a]/20 flex items-center justify-center gap-1.5 border border-[#ff073a]/30 transition-colors min-h-[44px]"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Acessar Página Oficial</span>
                </a>
              )}
              <a
                href={`https://api.whatsapp.com/send/?phone=553197724257&text=${encodeURIComponent(selectedProduct.whatsappMessage || `Oi Mateus, tenho interesse no produto ${selectedProduct.title}`)}&type=phone_number&app_absent=0`}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-button-fired w-full sm:w-auto px-6 py-3 rounded-xl text-xs font-mono font-bold text-white shadow-xl flex items-center justify-center gap-2 min-h-[48px]"
              >
                <MessageSquare className="w-4 h-4" />
                <span>{selectedProduct.cta || 'OBTER AGORA'}</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE DETALHES DE SERVIÇO */}
      {selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="relative max-w-2xl w-full max-h-[88vh] overflow-y-auto glass-crystal rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-white/20 shadow-2xl">
            <button
              type="button"
              onClick={() => setSelectedService(null)}
              className="absolute top-4 right-4 sm:top-5 sm:right-5 p-2.5 min-w-[44px] min-h-[44px] rounded-xl glass-pill text-zinc-400 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
              aria-label="Fechar modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative aspect-[16/9] w-full rounded-xl sm:rounded-2xl overflow-hidden mb-5 sm:mb-6 bg-black border border-white/10">
              <img
                src={selectedService.cover}
                alt={selectedService.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3.5 left-3.5 px-3 py-1 rounded-xl glass-pill-red text-xs font-mono text-[#ff073a] font-bold">
                {selectedService.badge}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <span className="text-xs font-mono text-[#ff073a] font-bold px-3 py-1 rounded-lg glass-pill inline-block">
                {selectedService.tag}
              </span>
              <span className="text-xs font-mono font-bold text-red-300 bg-red-950/60 px-3 py-1 rounded-lg border border-red-500/40">
                {selectedService.badge}
              </span>
            </div>

            <h3 className="text-xl sm:text-3xl font-black text-white">
              {selectedService.title}
            </h3>

            <p className="mt-1.5 text-xs sm:text-sm font-mono text-zinc-400 font-semibold">
              {selectedService.headline}
            </p>

            <p className="mt-3.5 text-xs sm:text-sm text-zinc-300 font-light leading-relaxed">
              {selectedService.description}
            </p>

            <div className="mt-5 p-4 rounded-xl sm:rounded-2xl glass-card-nested border border-white/10 space-y-2.5">
              <h4 className="text-xs font-mono text-white font-bold uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#ff073a]" />
                <span>ESCOPO DO SERVIÇO:</span>
              </h4>
              <ul className="space-y-2">
                {selectedService.highlights.map((h, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-zinc-300 font-mono">
                    <Check className="w-3.5 h-3.5 text-[#ff073a] shrink-0 mt-0.5" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>

            {selectedService.details && (
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                {selectedService.details.implementacao && (
                  <div className="p-3 rounded-xl glass-card-nested border border-white/5">
                    <span className="text-[#ff073a] font-bold block mb-1">⚙️ Implementação:</span>
                    <span className="text-zinc-300">{selectedService.details.implementacao}</span>
                  </div>
                )}
                {selectedService.details.tecnologia && (
                  <div className="p-3 rounded-xl glass-card-nested border border-white/5">
                    <span className="text-[#ff073a] font-bold block mb-1">💻 Stack Técnica:</span>
                    <span className="text-zinc-300">{selectedService.details.tecnologia}</span>
                  </div>
                )}
              </div>
            )}

            <div className="mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2.5 sm:gap-3">
              <button
                type="button"
                onClick={() => setSelectedService(null)}
                className="w-full sm:w-auto px-5 py-3 rounded-xl glass-pill text-xs font-mono text-zinc-300 hover:text-white cursor-pointer min-h-[44px] text-center"
              >
                Fechar
              </button>
              {selectedService.pageLink && (
                <a
                  href={selectedService.pageLink}
                  target={selectedService.pageLink.startsWith('http') ? '_blank' : '_self'}
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-5 py-3 rounded-xl glass-pill text-xs font-mono text-[#ff073a] hover:text-white hover:bg-[#ff073a]/20 flex items-center justify-center gap-1.5 border border-[#ff073a]/30 transition-colors min-h-[44px]"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Acessar Página Oficial</span>
                </a>
              )}
              <a
                href={`https://api.whatsapp.com/send/?phone=553197724257&text=${encodeURIComponent(selectedService.whatsappMessage || `Oi Mateus, tenho interesse no serviço ${selectedService.title}`)}&type=phone_number&app_absent=0`}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-button-fired w-full sm:w-auto px-6 py-3 rounded-xl text-xs font-mono font-bold text-white shadow-xl flex items-center justify-center gap-2 min-h-[48px]"
              >
                <MessageSquare className="w-4 h-4" />
                <span>{selectedService.cta || 'CONTRATAR AGORA'}</span>
              </a>
            </div>
          </div>
        </div>
      )}

    </section>
  );
}

export default ShopSection;
