'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Layers,
  Bot,
  Cpu,
  Workflow,
  Database,
  Server,
  Shield,
  Zap,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Activity,
  Code,
  Terminal,
  ExternalLink,
  MessageSquare,
  Lock,
  Boxes,
  Compass,
} from 'lucide-react';
import GridScanShader from '@/components/shaders/GridScanShader';
import siteData from '@/data/siteData.json';

interface TechItem {
  id: string;
  name: string;
  category: 'automation' | 'web' | 'data' | 'infra' | 'ai';
  categoryLabel: string;
  badge: string;
  icon: React.ComponentType<{ className?: string }>;
  metrics: string;
  description: string;
  tags: string[];
  highlightColor?: string;
}

interface SquadAgent {
  id: string;
  code: string;
  name: string;
  role: string;
  archetype: 'Cognitivo' | 'Orquestrador' | 'Dados' | 'Marketing' | 'Criativo' | 'DevOps';
  autonomy: string;
  stack: string;
  status: string;
  icon: React.ComponentType<{ className?: string }>;
  responsibilities: string[];
}

const TECH_STACK: TechItem[] = [
  {
    id: 'n8n',
    name: 'n8n Enterprise Automation',
    category: 'automation',
    categoryLabel: 'Hiperautomação & Orquestração',
    badge: 'Core Engine',
    icon: Workflow,
    metrics: '99.98% Uptime · Webhooks Real-Time',
    description: 'Espinha dorsal de automação do ecossistema MCP. Conecta microsserviços, Webhooks, APIs corporativas e modelos de linguagem com resiliência a falhas e filas distribuídas.',
    tags: ['Workflows Distribuídos', 'Webhooks Bidirecionais', 'Filas BullMQ', 'Self-Hosted'],
    highlightColor: '#ff073a',
  },
  {
    id: 'typebot',
    name: 'Typebot Pro Conversational',
    category: 'automation',
    categoryLabel: 'Agentes Conversacionais & SDR',
    badge: 'UX Conversacional',
    icon: Bot,
    metrics: 'Atendimento 24/7 · Multi-Canais',
    description: 'Motor conversacional dinâmico de alta fidelidade. Qualifica leads, conduz triagens de atendimento, agenda reuniões e conecta-se a LLMs com retenção e precisão.',
    tags: ['Chatbots Cognitivos', 'WhatsApp API', 'Qualificação BANT', 'Web Embed'],
    highlightColor: '#f59e0b',
  },
  {
    id: 'postgres-drizzle',
    name: 'PostgreSQL & Drizzle ORM',
    category: 'data',
    categoryLabel: 'Dados & Persistência Relacional',
    badge: 'Data Foundation',
    icon: Database,
    metrics: 'ACID Compliance · Type-Safe',
    description: 'Camada estruturada de armazenamento de alta performance. Queries 100% tipadas em TypeScript, migrações determinísticas e integridade de dados soberana.',
    tags: ['PostgreSQL 16', 'Drizzle ORM', 'TypeScript Nativo', 'Modelagem Relacional'],
    highlightColor: '#3b82f6',
  },
  {
    id: 'nextjs',
    name: 'Next.js 15 App Router & React 19',
    category: 'web',
    categoryLabel: 'Frontend & Arquitetura Web Soberana',
    badge: 'Web Engine',
    icon: Code,
    metrics: '0ms Latência · Streaming SSR',
    description: 'Arquitetura web moderna de altíssimo padrão. Server Components, renderização híbrida rápida, pré-render via Speculation Rules e SEO otimizado para os SERPs.',
    tags: ['React 19', 'Next.js 15', 'Server Components', 'Speculation Rules', 'SEO E-E-A-T'],
    highlightColor: '#10b981',
  },
  {
    id: 'docker-linux',
    name: 'Docker Swarm & Linux VPS Infra',
    category: 'infra',
    categoryLabel: 'Infraestrutura & DevOps',
    badge: 'Blindagem & Uptime',
    icon: Server,
    metrics: 'Containers Isolados · Auto-Healing',
    description: 'Ambientes conteinerizados em servidores Linux de alto desempenho. Nginx reverse proxy, certificados SSL automatizados, blindagem de portas e backups contínuos.',
    tags: ['Docker Swarm', 'Ubuntu VPS', 'Nginx Reverse Proxy', 'Firewall UFW', 'SSL Let\'s Encrypt'],
    highlightColor: '#8b5cf6',
  },
  {
    id: 'baserow-mautic',
    name: 'Baserow CRM & Mautic Automation',
    category: 'data',
    categoryLabel: 'CRM & Marketing Open Source',
    badge: 'Zero Lock-In',
    icon: Boxes,
    metrics: 'Contatos Ilimitados · Entregabilidade Alta',
    description: 'Stack de marketing e relacionamento soberana e independente. Banco de dados relacional flexível combinado com nutrição comportamental em funis de venda.',
    tags: ['Baserow API', 'Mautic 5', 'SMTP Transacional', 'Segmentação Dinâmica'],
    highlightColor: '#ec4899',
  },
  {
    id: 'ai-models',
    name: 'Modelos de IA & LLMs Cognitivas',
    category: 'ai',
    categoryLabel: 'Inteligência Artificial & RAG',
    badge: 'Cognitive Brain',
    icon: Cpu,
    metrics: 'Multimodal · Raciocínio Profundo',
    description: 'Integração orquestrada de modelos de fronteira (Gemini 2.5/3, Claude 3.7, OpenAI, modelos open-weights) para sumarização, geração e agentes investigativos.',
    tags: ['Google Gemini API', 'Claude Anthropic', 'OpenAI', 'Function Calling', 'Embeddings RAG'],
    highlightColor: '#06b6d4',
  },
  {
    id: 'shaders-design',
    name: 'WebGL Shaders & Sovereign UI Glass',
    category: 'web',
    categoryLabel: 'Design System & Efeitos Visuais',
    badge: 'Visual High-End',
    icon: Sparkles,
    metrics: '60-120 FPS · Aceleração por GPU',
    description: 'Identidade visual cinematográfica dark mode baseada em shaders WebGL personalizados (Liquid Chrome, Grid Scan, Silk, Balatro) e componentes táticos glassmorphism.',
    tags: ['GLSL Canvas', 'Tailwind CSS v4', 'Glassmorphism', 'Touch-First UI'],
    highlightColor: '#ff073a',
  },
];

const SQUAD_AGENTS: SquadAgent[] = [
  {
    id: 'sdr-agent',
    code: 'MCP-AGENT-01',
    name: 'SDR & Qualificador Conversacional 24/7',
    role: 'Captação, Triagem Dinâmica & Agendamento',
    archetype: 'Cognitivo',
    autonomy: '100% Autônomo',
    stack: 'Typebot + n8n + LLM + WhatsApp Cloud API',
    status: 'Operando em Tempo Real',
    icon: Bot,
    responsibilities: [
      'Acolhimento imediato de leads em todos os canais de entrada (Web, WhatsApp e Landing Pages).',
      'Aplicação de matriz de qualificação de projetos, compreendendo necessidades e prazos.',
      'Roteamento instantâneo para o calendário oficial e notificação push direta para o WhatsApp de Mateus Celestino.',
    ],
  },
  {
    id: 'orchestrator-agent',
    code: 'MCP-AGENT-02',
    name: 'Orquestrador de Fluxos & Eventos',
    role: 'Roteamento Multi-Sistema & Execução de Tarefas',
    archetype: 'Orquestrador',
    autonomy: 'Disparo por Evento (Event-Driven)',
    stack: 'n8n Enterprise Core + Webhooks + BullMQ',
    status: 'Operação Contínua',
    icon: Workflow,
    responsibilities: [
      'Processamento assíncrono de eventos com retries automáticos e circuit breakers.',
      'Ponte de comunicação entre pagamentos, liberação de produtos e entrega de ativos digitais.',
      'Execução de pipelines em lote sem gargalos de CPU ou sobrecarga de memória.',
    ],
  },
  {
    id: 'data-agent',
    code: 'MCP-AGENT-03',
    name: 'Guardião de Dados & Inteligência CRM',
    role: 'Estruturação, Deduplicação & Análise',
    archetype: 'Dados',
    autonomy: 'Contínuo em Background',
    stack: 'PostgreSQL + Drizzle ORM + Baserow Database',
    status: 'Integridade 100%',
    icon: Database,
    responsibilities: [
      'Normalização em tempo real de contatos, requisições de suporte e cadastros.',
      'Garantia de conformidade com boas práticas LGPD e segurança de banco de dados.',
      'Sincronização entre tabelas operacionais e dashboards de métricas do negócio.',
    ],
  },
  {
    id: 'growth-agent',
    code: 'MCP-AGENT-04',
    name: 'Motor de Campanhas & Nutrição',
    role: 'Engajamento Comportamental & Funis Open Source',
    archetype: 'Marketing',
    autonomy: 'Autônomo com Triggers Comportamentais',
    stack: 'Mautic 5 + SMTP Transacional + n8n Triggers',
    status: 'Entregabilidade 99.4%',
    icon: Zap,
    responsibilities: [
      'Disparo de comunicados e conteúdos exclusivos do Cofre Intelectual (/biblioteca).',
      'Nutrição de leads baseada no interesse por automação, desenvolvimento web ou IA.',
      'Rastreamento de taxa de engajamento sem violação de privacidade de dados.',
    ],
  },
  {
    id: 'visual-agent',
    code: 'MCP-AGENT-05',
    name: 'Curador & Criador de Visuais IA',
    role: 'Geração de Prompts & Curadoria de Estilos',
    archetype: 'Criativo',
    autonomy: 'Assistido por IA Generativa',
    stack: 'Midjourney + SD / Flux + ImageKit CDN',
    status: 'Acervo Ativo',
    icon: Sparkles,
    responsibilities: [
      'Produção e curadoria dos estilos visuais da plataforma VIP A.I Visuals.',
      'Desenvolvimento de prompts cinematográficos para publicidade, cinema e arte digital.',
      'Otimização de imagens de alta resolução em formatos ultraleves para a web.',
    ],
  },
  {
    id: 'sentinel-agent',
    code: 'MCP-AGENT-06',
    name: 'Sentinela de Uptime, Telemetria & Segurança',
    role: 'Auditoria de Saúde, Containers & Tráfego',
    archetype: 'DevOps',
    autonomy: 'Guardião 24/7 com Alertas Críticos',
    stack: 'Linux Sentinel + Umami Telemetry + Docker Healthcheck',
    status: 'Blindado 24/7',
    icon: Shield,
    responsibilities: [
      'Telemetria de tráfego, requisições maliciosas e tentativas de exploração em portas.',
      'Reinício preventivo de containers e failover em caso de latência anômala.',
      'Notificação push com logs resumidos de segurança diretamente nos canais de monitoramento.',
    ],
  },
];

export function StackSquadView() {
  const [activeTab, setActiveTab] = useState<'all' | 'stack' | 'squad' | 'pipeline'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredTech = TECH_STACK.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const filteredSquad = SQUAD_AGENTS.filter((agent) => {
    return (
      agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.stack.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.responsibilities.some((r) => r.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  return (
    <div className="min-h-screen bg-transparent text-[#ececec] flex flex-col selection:bg-[#ff073a] selection:text-white relative">
      {/* 0. Shader WebGL de Fundo: GridScan Holográfico Carmesim */}
      <GridScanShader
        className="z-0 mix-blend-screen pointer-events-none"
        linesColor="#38000a"
        scanColor="#ff073a"
        lineThickness={1.2}
        gridScale={0.10}
        bloomIntensity={0.80}
        scanGlow={0.60}
        opacity={0.55}
      />

      {/* Zonas de Iluminação Superior / Halo Cinematográfico */}
      <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-[#030305] via-[#030305]/80 to-transparent pointer-events-none z-1" />
      <div
        className="absolute top-12 left-1/2 -translate-x-1/2 w-96 sm:w-[46rem] h-32 rounded-full pointer-events-none opacity-25 z-1"
        style={{
          background: 'radial-gradient(ellipse at center, #ff073a 0%, rgba(138,0,18,0.4) 40%, transparent 75%)',
          filter: 'blur(56px)',
        }}
      />

      {/* Conteúdo Principal com Container Seguro */}
      <div className="relative z-10 w-full px-3.5 sm:px-6 lg:px-10 xl:px-16 pt-20 sm:pt-24 pb-32">
        {/* Breadcrumb Tático Superior */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-6 mb-8 border-b border-white/10">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl glass-crystal text-xs font-mono text-zinc-300 hover:text-white hover:border-[#ff073a]/50 transition-all cursor-pointer group min-h-[44px]"
              title="Voltar para a Home Page"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform text-[#ff073a]" />
              <span>Home Page</span>
            </Link>
            <span className="text-zinc-600 font-mono hidden sm:inline">/</span>
            <Link
              href="/showcase"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl glass-crystal text-xs font-mono text-zinc-300 hover:text-white hover:border-[#ff073a]/50 transition-all cursor-pointer min-h-[44px]"
              title="Ver Showcase Oficial"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#ff073a]" />
              <span>Showcase</span>
            </Link>
            <span className="text-zinc-600 font-mono hidden sm:inline">/</span>
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-white px-2 py-1">
              <Layers className="w-4 h-4 text-[#ff073a]" />
              <span>Stack & Squad</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-[11px] font-mono font-semibold text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Ecossistema Operacional 24/7</span>
            </span>
          </div>
        </div>

        {/* Hero Section: Cabeçalho da Página Stack & Squad */}
        <div className="glass-crystal p-6 sm:p-10 lg:p-12 rounded-3xl mb-10 border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.85)] relative overflow-hidden">
          <div className="relative z-10 max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-pill-red text-[11px] sm:text-xs font-mono text-[#ff073a] uppercase tracking-wider font-bold mb-4">
              <Boxes className="w-3.5 h-3.5" />
              <span>ARQUITETURA & ESQUADRÃO DE IA</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
              Stack & Squad <span className="text-red-500">Pro X</span>
            </h1>

            <p className="mt-3 sm:mt-4 text-sm sm:text-lg text-zinc-300 leading-relaxed font-light">
              Conheça a infraestrutura tecnológica soberana e o esquadrão de agentes autônomos de Inteligência Artificial que operam o ecossistema digital de <strong className="text-white font-semibold">Mateus Celestino Pro X</strong>. Engenharia open source de alto nível, resiliência extrema e hiperautomação orientada a resultados.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs font-mono text-zinc-300">
                <Workflow className="w-4 h-4 text-red-400" />
                <span>Hiperautomação n8n & Typebot</span>
              </div>
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs font-mono text-zinc-300">
                <Database className="w-4 h-4 text-blue-400" />
                <span>PostgreSQL & Drizzle ORM</span>
              </div>
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs font-mono text-zinc-300">
                <Server className="w-4 h-4 text-purple-400" />
                <span>Docker & VPS Linux Blindada</span>
              </div>
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs font-mono text-zinc-300">
                <Bot className="w-4 h-4 text-amber-400" />
                <span>6 Agentes Especialistas Ativos</span>
              </div>
            </div>
          </div>
        </div>

        {/* Barra de Filtros & Navegação de Abas */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-8">
          {/* Abas Principais */}
          <div className="flex flex-wrap p-1.5 rounded-2xl glass-pill border border-white/10 gap-1">
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className={`px-4 sm:px-6 py-2.5 rounded-xl text-xs font-mono font-bold tracking-wider transition-all duration-200 cursor-pointer flex items-center gap-2 min-h-[44px] ${
                activeTab === 'all'
                  ? 'glass-button-fired text-white shadow-lg'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Visão Completa</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('stack')}
              className={`px-4 sm:px-6 py-2.5 rounded-xl text-xs font-mono font-bold tracking-wider transition-all duration-200 cursor-pointer flex items-center gap-2 min-h-[44px] ${
                activeTab === 'stack'
                  ? 'glass-button-fired text-white shadow-lg'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Stack Tecnológica ({TECH_STACK.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('squad')}
              className={`px-4 sm:px-6 py-2.5 rounded-xl text-xs font-mono font-bold tracking-wider transition-all duration-200 cursor-pointer flex items-center gap-2 min-h-[44px] ${
                activeTab === 'squad'
                  ? 'glass-button-fired text-white shadow-lg'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Bot className="w-4 h-4" />
              <span>Squad de Agentes IA ({SQUAD_AGENTS.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('pipeline')}
              className={`px-4 sm:px-6 py-2.5 rounded-xl text-xs font-mono font-bold tracking-wider transition-all duration-200 cursor-pointer flex items-center gap-2 min-h-[44px] ${
                activeTab === 'pipeline'
                  ? 'glass-button-fired text-white shadow-lg'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>Pipeline & Fluxo</span>
            </button>
          </div>

          {/* Campo de Busca Rápida */}
          <div className="relative min-w-[260px] max-w-sm">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filtrar tecnologia ou agente..."
              className="w-full px-4 py-2.5 pl-10 rounded-xl bg-black/60 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-500/60 transition-colors"
            />
            <Terminal className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* =========================================================================
            SEÇÃO 1: STACK TECNOLÓGICA (THE SOVEREIGN TECH STACK)
            ========================================================================= */}
        {(activeTab === 'all' || activeTab === 'stack') && (
          <section className="mb-14">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl glass-pill-red flex items-center justify-center text-[#ff073a]">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    The Sovereign Tech Stack
                  </h2>
                  <p className="text-xs text-zinc-400 font-mono">
                    Pilares de Engenharia, Banco de Dados, Frontend e Automação
                  </p>
                </div>
              </div>

              {/* Filtro secundário por categoria da stack */}
              <div className="hidden lg:flex items-center gap-1.5 text-xs font-mono">
                {[
                  { id: 'all', label: 'Todos' },
                  { id: 'automation', label: 'Automação' },
                  { id: 'web', label: 'Web & UI' },
                  { id: 'data', label: 'Dados' },
                  { id: 'infra', label: 'Infra' },
                  { id: 'ai', label: 'IA' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                      selectedCategory === cat.id
                        ? 'bg-white/10 border-red-500/50 text-white'
                        : 'border-white/5 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Grid de Cards da Stack */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {filteredTech.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.id}
                    className="glass-crystal glass-interactive p-5 sm:p-6 rounded-2xl border border-white/10 flex flex-col justify-between group hover:border-red-500/40 transition-all duration-300"
                  >
                    <div>
                      {/* Top Bar do Card */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 group-hover:border-red-500/40 transition-all">
                          <Icon className="w-5 h-5 text-red-400" />
                        </div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full uppercase font-bold tracking-wider bg-white/5 border border-white/10 text-zinc-300">
                          {item.badge}
                        </span>
                      </div>

                      <div className="text-[11px] font-mono text-red-400 uppercase tracking-wider font-semibold mb-1">
                        {item.categoryLabel}
                      </div>

                      <h3 className="text-base sm:text-lg font-bold text-white tracking-tight mb-2 group-hover:text-red-300 transition-colors">
                        {item.name}
                      </h3>

                      <p className="text-xs text-zinc-400 font-light leading-relaxed mb-4">
                        {item.description}
                      </p>
                    </div>

                    <div>
                      {/* Métrica de Performance */}
                      <div className="pt-3 border-t border-white/10 mb-3 flex items-center justify-between text-[11px] font-mono text-zinc-300">
                        <span className="text-zinc-500">Métrica:</span>
                        <span className="font-semibold text-emerald-400">{item.metrics}</span>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5">
                        {item.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/5 text-zinc-400"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* =========================================================================
            SEÇÃO 2: SQUAD DE AGENTES AUTÔNOMOS DE IA
            ========================================================================= */}
        {(activeTab === 'all' || activeTab === 'squad') && (
          <section className="mb-14">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl glass-pill-red flex items-center justify-center text-[#ff073a]">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    The Autonomous AI Squad
                  </h2>
                  <p className="text-xs text-zinc-400 font-mono">
                    Esquadrão Operacional de Agentes Inteligentes em Produção
                  </p>
                </div>
              </div>

              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950/40 border border-red-500/30 text-[11px] font-mono text-red-400">
                <span>Multi-Agent Swarm</span>
              </span>
            </div>

            {/* Grid dos Agentes do Squad */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredSquad.map((agent) => {
                const AgentIcon = agent.icon;
                return (
                  <div
                    key={agent.id}
                    className="glass-crystal glass-interactive p-6 rounded-2xl border border-white/10 flex flex-col justify-between group hover:border-red-500/50 transition-all duration-300"
                  >
                    <div>
                      {/* Top Header do Agente */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-10 h-10 rounded-xl bg-red-500/15 border border-red-500/30 flex items-center justify-center group-hover:scale-105 transition-transform">
                            <AgentIcon className="w-5 h-5 text-red-400" />
                          </div>
                          <div>
                            <span className="text-[10px] font-mono text-zinc-500 block leading-tight">
                              {agent.code}
                            </span>
                            <span className="text-xs font-mono font-bold text-red-400 uppercase tracking-wider">
                              {agent.archetype}
                            </span>
                          </div>
                        </div>

                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-[10px] font-mono text-emerald-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          <span>{agent.autonomy}</span>
                        </span>
                      </div>

                      <h3 className="text-base sm:text-lg font-bold text-white tracking-tight mb-1 group-hover:text-red-300 transition-colors">
                        {agent.name}
                      </h3>
                      <p className="text-xs text-zinc-400 font-mono mb-3">
                        {agent.role}
                      </p>

                      {/* Responsabilidades táticas */}
                      <div className="space-y-2 mb-4 pt-3 border-t border-white/10">
                        {agent.responsibilities.map((resp, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-xs text-zinc-300 font-light leading-relaxed">
                            <CheckCircle2 className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                            <span>{resp}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-white/10">
                      <div className="text-[11px] font-mono text-zinc-400 mb-1 flex items-center justify-between">
                        <span className="text-zinc-500">Tecnologias:</span>
                        <span className="text-zinc-300 font-medium truncate max-w-[200px]" title={agent.stack}>
                          {agent.stack}
                        </span>
                      </div>
                      <div className="text-[11px] font-mono text-emerald-400 flex items-center justify-between">
                        <span className="text-zinc-500">Status Operacional:</span>
                        <span className="font-semibold">{agent.status}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* =========================================================================
            SEÇÃO 3: PIPELINE DE EXECUÇÃO & ARQUITETURA DE INTEGRAÇÃO
            ========================================================================= */}
        {(activeTab === 'all' || activeTab === 'pipeline') && (
          <section className="mb-14">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 rounded-xl glass-pill-red flex items-center justify-center text-[#ff073a]">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Pipeline Operacional Soberano
                </h2>
                <p className="text-xs text-zinc-400 font-mono">
                  Do Ponto de Entrada à Conversão & Governança Contínua
                </p>
              </div>
            </div>

            <div className="glass-crystal p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 relative">
                {[
                  {
                    step: '01',
                    title: 'Entrada & Ingestão',
                    desc: 'Visitantes, formulários, WhatsApp e Webhooks disparados.',
                    icon: Compass,
                    tag: 'Omnichannel',
                  },
                  {
                    step: '02',
                    title: 'Qualificação IA',
                    desc: 'Agent 01 tria demanda, perfil BANT e contexto do lead.',
                    icon: Bot,
                    tag: 'Typebot + LLM',
                  },
                  {
                    step: '03',
                    title: 'Orquestração',
                    desc: 'Agent 02 roteia eventos assíncronos e pipelines distribuídos.',
                    icon: Workflow,
                    tag: 'n8n Enterprise',
                  },
                  {
                    step: '04',
                    title: 'Persistência & CRM',
                    desc: 'Agent 03 grava dados estruturados no banco e no CRM.',
                    icon: Database,
                    tag: 'Postgres + Baserow',
                  },
                  {
                    step: '05',
                    title: 'Nutrição & Fechamento',
                    desc: 'Agent 04 conduz fluxos de e-mail e checkout de conversão.',
                    icon: Zap,
                    tag: 'Mautic + Stripe',
                  },
                  {
                    step: '06',
                    title: 'Auditoria & Sentinela',
                    desc: 'Agent 06 monitora uptime, telemetria e blindagem 24/7.',
                    icon: Shield,
                    tag: 'Sentinel 24/7',
                  },
                ].map((p, idx) => {
                  const StepIcon = p.icon;
                  return (
                    <div
                      key={p.step}
                      className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col justify-between hover:border-red-500/40 transition-all relative group"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-mono font-black text-red-500">
                            FASE {p.step}
                          </span>
                          <StepIcon className="w-4 h-4 text-zinc-400 group-hover:text-red-400 transition-colors" />
                        </div>
                        <h4 className="text-sm font-bold text-white mb-1">
                          {p.title}
                        </h4>
                        <p className="text-xs text-zinc-400 font-light leading-relaxed mb-3">
                          {p.desc}
                        </p>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-red-400 font-semibold w-fit">
                        {p.tag}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs font-mono text-zinc-400">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  <span>Latência média de processamento de ponta a ponta: &lt; 250ms</span>
                </div>
                <div className="flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 text-zinc-500" />
                  <span>100% dos dados mantidos em infraestrutura soberana própria</span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* =========================================================================
            SEÇÃO FINAL: CALL TO ACTION SOBERANO
            ========================================================================= */}
        <div className="glass-crystal p-6 sm:p-10 rounded-3xl border border-red-500/30 bg-gradient-to-br from-red-950/20 via-black to-black shadow-[0_20px_50px_rgba(255,7,58,0.15)] flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="max-w-2xl">
            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Deseja implementar essa Stack & Squad na sua empresa?
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-zinc-300 font-light leading-relaxed">
              Mateus Celestino constrói operações digitais completas com arquiteturas de automação soberana, agentes de IA personalizados e infraestrutura blindada para empresas de todos os portes.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
            <a
              href={siteData?.profile?.whatsapp || 'https://api.whatsapp.com/send/?phone=553197724257&text=QUERO+AUTOMATIZAR+TUDO.&type=phone_number&app_absent=0'}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold text-xs sm:text-sm font-mono tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,7,58,0.4)] transition-all min-h-[48px]"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Falar Diretamente com Mateus</span>
            </a>

            <Link
              href="/biblioteca"
              className="w-full sm:w-auto px-5 py-3.5 rounded-xl glass-crystal border border-white/10 hover:border-white/20 text-zinc-300 hover:text-white font-mono text-xs sm:text-sm flex items-center justify-center gap-2 transition-all min-h-[48px]"
            >
              <span>Acessar Free Resources</span>
              <ArrowRight className="w-4 h-4 text-red-500" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StackSquadView;
