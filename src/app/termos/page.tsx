'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FileText,
  Shield,
  Lock,
  Cpu,
  Terminal,
  Scale,
  AlertTriangle,
  CheckCircle2,
  Copy,
  Check,
  Printer,
  ArrowLeft,
  Sparkles,
  ChevronRight,
  Search,
  BookOpen,
  Code,
  Users,
  Compass,
  Zap,
} from 'lucide-react';
import ShaderBackground, { ShaderBackgroundMode } from '@/components/shaders/ShaderBackground';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface TermSection {
  id: string;
  number: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  tag: string;
}

const TERM_SECTIONS: TermSection[] = [
  { id: 'objeto-aceitacao', number: '01', title: 'Objeto e Aceitação dos Termos', icon: Compass, tag: 'CONTRATO DE ADESÃO' },
  { id: 'acesso-elegibilidade', number: '02', title: 'Acesso Inclusivo e Elegibilidade', icon: Users, tag: 'UNIVERSALIDADE' },
  { id: 'licenciamento-ativos', number: '03', title: 'Licença de Uso de Ativos e Códigos', icon: Code, tag: 'LICENCIAMENTO' },
  { id: 'restricoes-scraping', number: '04', title: 'Restrições, Proibição de Scraping e IA Abusiva', icon: AlertTriangle, tag: 'RESTRIÇÕES VEDAÇÕES' },
  { id: 'propriedade-intelectual', number: '05', title: 'Propriedade Intelectual e Marca Pro X', icon: Shield, tag: 'AUTORIA EXCLUSIVA' },
  { id: 'area-membros', number: '06', title: 'Área de Membros e Conduta Técnica', icon: Lock, tag: 'COMUNIDADE RESTRITA' },
  { id: 'disponibilidade-shaders', number: '07', title: 'Disponibilidade e Shaders a 60 FPS', icon: Zap, tag: 'INFRAESTRUTURA' },
  { id: 'limitacao-responsabilidade', number: '08', title: 'Limitação de Responsabilidade e IA', icon: Cpu, tag: 'LIMITAÇÃO DE RISCO' },
  { id: 'sancoes-suspensao', number: '09', title: 'Sanções, Suspensão e Desativação', icon: Scale, tag: 'PENALIDADES' },
  { id: 'foro-legislacao', number: '10', title: 'Foro de Eleição e Legislação Vigente', icon: BookOpen, tag: 'DISPOSIÇÕES FINAIS' },
];

export default function TermosDeUsoPage() {
  const [activeShader, setActiveShader] = useState<ShaderBackgroundMode>('liquidchrome');
  const [activeSection, setActiveSection] = useState<string>('objeto-aceitacao');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedHash, setCopiedHash] = useState<boolean>(false);
  const [copiedEmail, setCopiedEmail] = useState<boolean>(false);

  const TERMS_HASH = 'SHA256: d3b9a1c8e7f5024b69d8a1c3e5f7b9a0c2d4e6f8a0b2c4d6e8f0a2b4c6d8e0f2';
  const OFFICIAL_EMAIL = '202405039459@alunos.estacio.br';

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;
      for (const section of TERM_SECTIONS) {
        const el = document.getElementById(section.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCopyHash = () => {
    navigator.clipboard.writeText(TERMS_HASH);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2500);
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(OFFICIAL_EMAIL);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const filteredSections = TERM_SECTIONS.filter(
    (s) =>
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.tag.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative min-h-screen w-full bg-[#030305] text-[#f3f4f6] selection:bg-red-500/30 selection:text-white pb-32">
      {/* 1. LAYER DE SHADERS WEBGL DINÂMICOS A 60 FPS */}
      <ShaderBackground
        mode={activeShader}
        colorHex="#8a0012"
        opacity={0.38}
        fixed={true}
      />

      {/* Orbes de refração e cáustica de vidro líquido */}
      <div className="liquid-glow-orb top-24 -right-20 w-[600px] h-[600px] bg-red-700/12 pointer-events-none" />
      <div className="liquid-glow-orb top-[40%] -left-20 w-[550px] h-[550px] bg-red-900/10 pointer-events-none" />
      <div className="liquid-glow-orb bottom-10 right-[20%] w-[500px] h-[500px] bg-red-950/15 pointer-events-none" />

      {/* 2. SUB-BARRA DE CONTROLE EM VIDRO CRISTALINO */}
      <div className="sticky top-20 z-40 w-full px-4 sm:px-6 lg:px-10 xl:px-16 pt-2 pb-4">

        <div className="glass-crystal rounded-2xl px-4 py-3 flex flex-wrap items-center justify-between gap-3 border border-white/15 shadow-[0_10px_35px_rgba(0,0,0,0.6)]">
          {/* Lado Esquerdo: Breadcrumb e Voltar */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-red-500/40 text-xs font-mono text-neutral-300 hover:text-white transition-all group"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-red-500 group-hover:-translate-x-1 transition-transform" />
              <span>Início</span>
            </Link>
            <span className="text-neutral-600 font-mono text-xs">/</span>
            <div className="flex items-center gap-2 text-xs font-mono font-semibold text-white">
              <FileText className="w-4 h-4 text-red-500" />
              <span>Termos de Uso Soberanos</span>
            </div>
          </div>

          {/* Centro: Seletor de Shaders em Vidro */}
          <div className="flex items-center gap-1.5 bg-black/40 border border-white/10 rounded-xl p-1 backdrop-blur-xl">
            <span className="text-[10px] font-mono text-neutral-400 px-2 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-red-400 animate-spin" style={{ animationDuration: '6s' }} />
              <span className="hidden sm:inline">Shader:</span>
            </span>
            {(['liquidchrome', 'silk', 'linewaves', 'gridscan', 'beams', 'galaxy'] as ShaderBackgroundMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setActiveShader(mode)}
                className={`px-2 py-1 rounded-lg text-[10px] font-mono uppercase tracking-wider transition-all cursor-pointer ${
                  activeShader === mode
                    ? 'bg-red-600/30 text-white border border-red-500/60 shadow-[0_0_12px_rgba(255,7,58,0.4)]'
                    : 'text-neutral-400 hover:text-neutral-200 hover:bg-white/5'
                }`}
                title={`Alternar para shader ${mode}`}
              >
                {mode}
              </button>
            ))}
          </div>

          {/* Lado Direito: Ações em Vidro */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-mono text-neutral-300 hover:text-white transition-all cursor-pointer"
              title="Imprimir documento ou salvar como PDF"
            >
              <Printer className="w-3.5 h-3.5 text-neutral-400" />
              <span className="hidden md:inline">Imprimir</span>
            </button>
            <Link
              href="/privacidade"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-950/40 hover:bg-red-900/40 border border-red-500/30 hover:border-red-500/60 text-xs font-mono text-red-300 hover:text-white transition-all"
            >
              <span>Privacidade</span>
              <ChevronRight className="w-3.5 h-3.5 text-red-400" />
            </Link>
          </div>
        </div>
      </div>

      {/* 3. CONTEÚDO PRINCIPAL EM VIDRO ESTRUTURADO */}
      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-10 xl:px-16 pt-4">

        {/* HERO CARD DE VIDRO HIPER-LAPIDADO */}
        <div className="glass-crystal rounded-3xl p-6 sm:p-10 mb-10 border border-white/20 shadow-[0_20px_70px_rgba(0,0,0,0.8)] relative overflow-hidden">
          {/* Linha reflexiva superior */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-red-500/50 to-transparent pointer-events-none" />

          <div className="relative z-10 max-w-4xl">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950/60 border border-red-500/40 text-[11px] font-mono font-bold text-red-400 tracking-wide">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                <span>CONTRATO DE ADESÃO SOBERANO // VIGÊNCIA PLENA</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-[11px] font-mono text-neutral-300">
                <Shield className="w-3 h-3 text-red-400" />
                <span>PROPRIEDADE INTELECTUAL REGISTRADA</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-[11px] font-mono text-emerald-400">
                <CheckCircle2 className="w-3 h-3" />
                <span>AUDITORIA v2.1</span>
              </div>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight mb-4">
              Termos de Uso <span className="text-red-500">Soberanos</span>
            </h1>

            <p className="text-base sm:text-lg text-neutral-300 font-light leading-relaxed mb-8">
              Estes Termos regulam o acesso, licenciamento de ativos digitais, uso de código-fonte de alta performance,
              conduta na área de membros restrita e governança técnica da plataforma <strong className="text-white">Mateus Celestino Pro X</strong>.
            </p>

            {/* Grid de Metadados em Vidro */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-white/10">
              <div className="glass-ultra-pane rounded-xl p-3">
                <span className="text-[10px] font-mono text-neutral-400 block uppercase">Versão Contratual</span>
                <span className="text-xs sm:text-sm font-bold text-white font-mono">v2.1.0-ENTERPRISE</span>
              </div>
              <div className="glass-ultra-pane rounded-xl p-3">
                <span className="text-[10px] font-mono text-neutral-400 block uppercase">Atualização Oficial</span>
                <span className="text-xs sm:text-sm font-bold text-white font-mono">Outubro de 2026</span>
              </div>
              <div className="glass-ultra-pane rounded-xl p-3">
                <span className="text-[10px] font-mono text-neutral-400 block uppercase">Jurisdição / Foro</span>
                <span className="text-xs sm:text-sm font-bold text-red-400 font-mono">Brasil (Marco Civil)</span>
              </div>
              <div className="glass-ultra-pane rounded-xl p-3">
                <span className="text-[10px] font-mono text-neutral-400 block uppercase">Arquiteto Oficial</span>
                <span className="text-xs sm:text-sm font-bold text-white truncate block">Mateus Celestino</span>
              </div>
            </div>
          </div>
        </div>

        {/* LAYOUT EM DUAS COLUNAS: ÍNDICE FLUTUANTE EM VIDRO + CONTEÚDO DAS CLÁUSULAS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* COLUNA ESQUERDA: ÍNDICE LATERAL EM VIDRO (STICKY) */}
          <aside className="lg:col-span-4 sticky top-36 space-y-4">
            {/* Card de Busca nas Cláusulas */}
            <div className="glass-crystal rounded-2xl p-4 border border-white/15 shadow-xl">
              <div className="relative">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filtrar cláusula ou tópico..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-red-500/60 transition-all font-mono"
                />
              </div>
            </div>

            {/* Sumário Navegável em Vidro */}
            <div className="glass-crystal rounded-2xl p-5 border border-white/15 shadow-xl">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
                <span className="text-xs font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5 text-red-400" />
                  Índice dos Termos
                </span>
                <span className="text-[10px] font-mono text-neutral-500">
                  {filteredSections.length} seções
                </span>
              </div>

              <nav className="space-y-1 max-h-[55vh] overflow-y-auto pr-1">
                {filteredSections.map((sec) => {
                  const Icon = sec.icon;
                  const isActive = activeSection === sec.id;
                  return (
                    <button
                      key={sec.id}
                      onClick={() => scrollToSection(sec.id)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-all group cursor-pointer ${
                        isActive
                          ? 'bg-red-600/20 border border-red-500/40 text-white font-semibold shadow-[0_0_15px_rgba(255,7,58,0.25)]'
                          : 'text-neutral-400 hover:text-white hover:bg-white/[0.04] border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <span className="text-[10px] font-mono text-red-400 shrink-0">{sec.number}</span>
                        <span className="truncate">{sec.title}</span>
                      </div>
                      <Icon className={`w-3.5 h-3.5 shrink-0 transition-transform ${isActive ? 'text-red-400 scale-110' : 'text-neutral-600 group-hover:text-neutral-400'}`} />
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Card de Integridade Criptográfica do Documento */}
            <div className="glass-ultra-pane rounded-2xl p-4 border border-white/10 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-neutral-400 flex items-center gap-1.5">
                  <Lock className="w-3 h-3 text-red-400" />
                  Hash do Contrato
                </span>
                <button
                  onClick={handleCopyHash}
                  className="text-[10px] font-mono text-neutral-400 hover:text-white flex items-center gap-1 px-2 py-0.5 rounded bg-white/5 border border-white/10 transition-all cursor-pointer"
                  title="Copiar hash SHA-256"
                >
                  {copiedHash ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400">Copiado</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copiar</span>
                    </>
                  )}
                </button>
              </div>
              <p className="text-[10px] font-mono text-neutral-500 break-all leading-tight">
                {TERMS_HASH}
              </p>
            </div>

            {/* Card de Suporte & Dúvidas Contratuais */}
            <div className="glass-crystal rounded-2xl p-4 border border-red-500/20 shadow-md space-y-2">
              <span className="text-[10px] font-mono text-red-400 uppercase font-bold block">
                Canal Jurídico &amp; Governança
              </span>
              <p className="text-xs text-neutral-300">
                Dúvidas sobre licenciamento comercial ou permissões corporativas podem ser enviadas diretamente:
              </p>
              <div className="flex items-center justify-between p-2 rounded-xl bg-black/50 border border-white/10">
                <span className="text-[11px] font-mono text-neutral-300 truncate">
                  {OFFICIAL_EMAIL}
                </span>
                <button
                  onClick={handleCopyEmail}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-neutral-400 hover:text-white transition-all cursor-pointer"
                  title="Copiar e-mail"
                >
                  {copiedEmail ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
            </div>
          </aside>

          {/* COLUNA DIREITA: AS 10 SEÇÕES DE TERMOS EM PLACAS DE VIDRO */}
          <div className="lg:col-span-8 space-y-8">
            {/* 01. OBJETO E ACEITAÇÃO */}
            <article id="objeto-aceitacao" className="glass-crystal rounded-3xl p-6 sm:p-8 border border-white/15 shadow-xl relative scroll-mt-36">
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-red-500/30 to-transparent" />
              <div className="flex items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-400 font-mono font-bold text-sm">
                    01
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-red-400 uppercase tracking-wider block">Acordo Vinculativo</span>
                    <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Objeto e Aceitação dos Termos</h2>
                  </div>
                </div>
                <Compass className="w-5 h-5 text-red-400 hidden sm:block" />
              </div>

              <div className="text-sm text-neutral-300 space-y-4 leading-relaxed font-light">
                <p>
                  Bem-vindo à plataforma <strong>Mateus Celestino Pro X</strong>. Estes Termos de Uso regulam o acesso, navegação e utilização de todo o ecossistema tecnológico, compreendendo o Portal Institucional, Acervo Editorial de Artigos, Cofre de Ativos Digitais (Shop &amp; Vault), Área de Membros, Shaders Cinemáticos WebGL e os Agentes Autônomos de Inteligência Artificial.
                </p>
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-xs text-neutral-300">
                  Ao navegar, cadastrar-se ou adquirir qualquer recurso ou serviço nesta plataforma, você declara expressamente haver lido, compreendido e concordado integralmente com todos os termos e condições aqui dispostos.
                </div>
              </div>
            </article>

            {/* 02. ACESSO E ELEGIBILIDADE */}
            <article id="acesso-elegibilidade" className="glass-crystal rounded-3xl p-6 sm:p-8 border border-white/15 shadow-xl relative scroll-mt-36">
              <div className="flex items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-red-400 font-mono font-bold text-sm">
                    02
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block">Universalidade</span>
                    <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Acesso Inclusivo e Elegibilidade</h2>
                  </div>
                </div>
                <Users className="w-5 h-5 text-red-400 hidden sm:block" />
              </div>

              <div className="text-sm text-neutral-300 space-y-4 leading-relaxed font-light">
                <p>
                  O acesso aos conteúdos públicos e editoriais da plataforma é irrestrito e universal para todos os indivíduos interessados em engenharia de software, automação inteligente, WebGL e marketing técnico.
                </p>
                <p>
                  Para a aquisição de ativos pagos, contratação de serviços corporativos ou ingresso na Área de Membros restrita, o usuário declara possuir plena capacidade civil (maior de 18 anos ou devidamente emancipado) ou estar agindo em representação legítima de pessoa jurídica constituída.
                </p>
              </div>
            </article>

            {/* 03. LICENCIAMENTO DE ATIVOS */}
            <article id="licenciamento-ativos" className="glass-crystal rounded-3xl p-6 sm:p-8 border border-white/15 shadow-xl relative scroll-mt-36">
              <div className="flex items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-400 font-mono font-bold text-sm">
                    03
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-red-400 uppercase tracking-wider block">Direitos de Uso</span>
                    <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Licença de Uso de Ativos e Códigos</h2>
                  </div>
                </div>
                <Code className="w-5 h-5 text-red-400 hidden sm:block" />
              </div>

              <div className="text-sm text-neutral-300 space-y-4 leading-relaxed font-light">
                <p>
                  Os ativos disponibilizados no <strong>Shop &amp; Vault</strong> (incluindo templates Typebot, fluxos complexos n8n, snippets WebGL/Three.js/OGL, prompts estruturados e integrações de banco de dados) são concedidos sob as seguintes regras estritas:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-2">
                    <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      Permitido:
                    </span>
                    <ul className="space-y-1 text-neutral-300 list-disc list-inside">
                      <li>Uso em projetos pessoais e profissionais do adquirente;</li>
                      <li>Implementação em clientes finais sob forma de serviço consultivo;</li>
                      <li>Modificação e adaptação do código para adequação aos objetivos de negócio.</li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-2xl bg-red-950/30 border border-red-500/40 space-y-2">
                    <span className="font-bold text-red-400 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4" />
                      Terminantemente Proibido:
                    </span>
                    <ul className="space-y-1 text-neutral-300 list-disc list-inside">
                      <li>Revenda, redistribuição ou compartilhamento público dos arquivos brutos;</li>
                      <li>Criação de produtos concorrentes diretos a partir do código original;</li>
                      <li>Disponibilização em repositórios abertos sem autorização prévia por escrito.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </article>

            {/* 04. RESTRIÇÕES E VEDAÇÃO A SCRAPING */}
            <article id="restricoes-scraping" className="glass-crystal rounded-3xl p-6 sm:p-8 border border-red-500/30 shadow-[0_0_50px_rgba(138,0,18,0.2)] relative scroll-mt-36">
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-red-500/60 to-transparent" />
              <div className="flex items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-600/30 border border-red-500/40 flex items-center justify-center text-red-400 font-mono font-bold text-sm">
                    04
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-red-400 uppercase tracking-wider block font-bold">Proteção Ativa</span>
                    <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Restrições, Proibição de Scraping e IA Abusiva</h2>
                  </div>
                </div>
                <AlertTriangle className="w-5 h-5 text-red-400 hidden sm:block" />
              </div>

              <div className="text-sm text-neutral-300 space-y-4 leading-relaxed font-light">
                <p>
                  Para preservar a integridade dos servidores, a exclusividade dos membros e a propriedade intelectual da plataforma, é expressamente vedado:
                </p>
                <div className="space-y-2 text-xs">
                  <div className="p-3.5 rounded-xl bg-black/50 border border-white/10 flex items-start gap-3">
                    <span className="font-mono text-red-400 font-bold shrink-0">4.1</span>
                    <div>
                      <strong className="text-white block mb-0.5">Scraping e Extração Automatizada de Dados:</strong>
                      Utilizar robôs, spiders, scrapers ou métodos automatizados para extrair o acervo de 176 artigos, mídias, componentes ou metadados sem autorização formal.
                    </div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-black/50 border border-white/10 flex items-start gap-3">
                    <span className="font-mono text-red-400 font-bold shrink-0">4.2</span>
                    <div>
                      <strong className="text-white block mb-0.5">Treinamento de Modelos de IA Não-Autorizados:</strong>
                      Alimentar modelos públicos ou proprietários de terceiros com o material autoral ou códigos da plataforma para fins de reprodução sintética.
                    </div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-black/50 border border-white/10 flex items-start gap-3">
                    <span className="font-mono text-red-400 font-bold shrink-0">4.3</span>
                    <div>
                      <strong className="text-white block mb-0.5">Engenharia Reversa e Ataques Cibernéticos:</strong>
                      Tentativas de injeção de payload malicioso, ataque aos endpoints de API, bypass de autenticação ou quebra da criptografia dos ativos digitais.
                    </div>
                  </div>
                </div>
              </div>
            </article>

            {/* 05. PROPRIEDADE INTELECTUAL */}
            <article id="propriedade-intelectual" className="glass-crystal rounded-3xl p-6 sm:p-8 border border-white/15 shadow-xl relative scroll-mt-36">
              <div className="flex items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-red-400 font-mono font-bold text-sm">
                    05
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block">Autoria Soberana</span>
                    <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Propriedade Intelectual e Marca Pro X</h2>
                  </div>
                </div>
                <Shield className="w-5 h-5 text-red-400 hidden sm:block" />
              </div>

              <div className="text-sm text-neutral-300 space-y-4 leading-relaxed font-light">
                <p>
                  Todos os elementos gráficos, shaders GLSL customizados, lógica em TypeScript/React, design system de vidro, marcas, logotipos e identidades visuais associadas a <strong>Mateus Celestino Pro X</strong> são criações intelectuais protegidas pela Lei de Direitos Autorais (Lei Federal nº 9.610/1998) e pela Lei de Propriedade Industrial (Lei nº 9.279/1996).
                </p>
                <p className="text-xs text-neutral-400">
                  O uso indevido da marca ou a apropriação indevida de autoria sujeitará o infrator às medidas cíveis de indenização e criminais pertinentes perante os tribunais competentes.
                </p>
              </div>
            </article>

            {/* 06. ÁREA DE MEMBROS */}
            <article id="area-membros" className="glass-crystal rounded-3xl p-6 sm:p-8 border border-white/15 shadow-xl relative scroll-mt-36">
              <div className="flex items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-red-400 font-mono font-bold text-sm">
                    06
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block">Comunidade Exclusiva</span>
                    <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Área de Membros e Conduta Técnica</h2>
                  </div>
                </div>
                <Lock className="w-5 h-5 text-red-400 hidden sm:block" />
              </div>

              <div className="text-sm text-neutral-300 space-y-4 leading-relaxed font-light">
                <p>
                  As credenciais de acesso à Área de Membros (login, senha e tokens de sessão) são de caráter estritamente pessoal e intransferível.
                </p>
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 text-xs text-neutral-300 space-y-2">
                  <div className="font-bold text-white">Regras de Ouro da Convivência Técnica:</div>
                  <ul className="space-y-1.5 text-neutral-400 list-disc list-inside">
                    <li>É vedado o compartilhamento simultâneo de contas entre múltiplos operadores;</li>
                    <li>O ambiente de membros visa colaboração técnica de alto nível; comportamentos hostis ou spam acarretam banimento imediato sem reembolso;</li>
                    <li>Sistemas de detecção de anomalia monitoram acessos geográficos simultâneos para evitar vazamento de credenciais.</li>
                  </ul>
                </div>
              </div>
            </article>

            {/* 07. DISPONIBILIDADE E SHADERS A 60 FPS */}
            <article id="disponibilidade-shaders" className="glass-crystal rounded-3xl p-6 sm:p-8 border border-white/15 shadow-xl relative scroll-mt-36">
              <div className="flex items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-red-400 font-mono font-bold text-sm">
                    07
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block">Performance WebGL</span>
                    <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Disponibilidade e Shaders a 60 FPS</h2>
                  </div>
                </div>
                <Zap className="w-5 h-5 text-red-400 hidden sm:block" />
              </div>

              <div className="text-sm text-neutral-300 space-y-4 leading-relaxed font-light">
                <p>
                  Trabalhamos para garantir 99.9% de uptime operacional em todas as rotas e microsserviços. Os shaders WebGL são otimizados para operar a 60 FPS com baixo consumo de memória GPU através da biblioteca OGL e Three.js.
                </p>
                <p className="text-xs text-neutral-400">
                  Em dispositivos que não possuam aceleração de hardware WebGL habilitada ou com limitações de driver gráfico, a plataforma aciona automaticamente o fallback em CSS puro e gradientes carmesim, assegurando a leitura e usabilidade integral de todo o conteúdo.
                </p>
              </div>
            </article>

            {/* 08. LIMITAÇÃO DE RESPONSABILIDADE */}
            <article id="limitacao-responsabilidade" className="glass-crystal rounded-3xl p-6 sm:p-8 border border-white/15 shadow-xl relative scroll-mt-36">
              <div className="flex items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-red-400 font-mono font-bold text-sm">
                    08
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block">Limitação Legal</span>
                    <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Limitação de Responsabilidade e IA</h2>
                  </div>
                </div>
                <Cpu className="w-5 h-5 text-red-400 hidden sm:block" />
              </div>

              <div className="text-sm text-neutral-300 space-y-3 leading-relaxed font-light">
                <p>
                  As soluções de automação e agentes autônomos de inteligência artificial são ferramentas de alta performance fornecidas para apoiar operações corporativas. O contratante ou operador mantém a supervisão sobre as credenciais de API conectadas (como chaves OpenAI, Anthropic, WhatsApp API ou Webhooks bancários).
                </p>
                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-neutral-400 space-y-1">
                  Não nos responsabilizamos por instabilidades decorrentes de interrupções de provedores de terceiros (Meta/WhatsApp, OpenAI, Stripe ou operadoras de telecomunicações) alheios ao controle soberano da nossa infraestrutura.
                </div>
              </div>
            </article>

            {/* 09. SANÇÕES E SUSPENSÃO */}
            <article id="sancoes-suspensao" className="glass-crystal rounded-3xl p-6 sm:p-8 border border-white/15 shadow-xl relative scroll-mt-36">
              <div className="flex items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-red-400 font-mono font-bold text-sm">
                    09
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block">Penalidades</span>
                    <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Sanções, Suspensão e Desativação</h2>
                  </div>
                </div>
                <Scale className="w-5 h-5 text-red-400 hidden sm:block" />
              </div>

              <div className="text-sm text-neutral-300 space-y-3 leading-relaxed font-light">
                <p>
                  A violação de qualquer das cláusulas destes Termos de Uso autoriza a Mateus Celestino Pro Software a adotar, a seu exclusivo critério, as seguintes medidas:
                </p>
                <ul className="space-y-1.5 text-xs text-neutral-400 list-disc list-inside">
                  <li>Advertência formal com notificação via e-mail cadastrado;</li>
                  <li>Suspensão temporária do acesso à Área de Membros e revogação de tokens de API;</li>
                  <li>Cancelamento definitivo da conta sem direito a restituição, caso configurado dano deliberado à comunidade ou infraestrutura;</li>
                  <li>Abertura de procedimento judicial de apuração de perdas e danos.</li>
                </ul>
              </div>
            </article>

            {/* 10. FORO E LEGISLAÇÃO */}
            <article id="foro-legislacao" className="glass-crystal rounded-3xl p-6 sm:p-8 border border-white/15 shadow-xl relative scroll-mt-36">
              <div className="flex items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-400 font-mono font-bold text-sm">
                    10
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-red-400 uppercase tracking-wider block">Disposições Finais</span>
                    <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Foro de Eleição e Legislação Vigente</h2>
                  </div>
                </div>
                <BookOpen className="w-5 h-5 text-red-400 hidden sm:block" />
              </div>

              <div className="text-sm text-neutral-300 space-y-4 leading-relaxed font-light">
                <p>
                  Estes Termos são regidos e interpretados em conformidade estrita com as leis da <strong>República Federativa do Brasil</strong>, em especial o Marco Civil da Internet (Lei nº 12.965/2014) e o Código Civil Brasileiro.
                </p>
                <div className="p-4 rounded-2xl bg-black/60 border border-red-500/30 text-xs text-neutral-300 space-y-2">
                  <div className="font-bold text-white flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Foro Eleito e Resolução Amigável</span>
                  </div>
                  <p>
                    Fica eleito o Foro da Comarca de domicílio do desenvolvedor e administrador da plataforma para dirimir quaisquer litígios oriundos deste instrumento, com renúncia expressa a qualquer outro, por mais privilegiado que seja ou venha a ser.
                  </p>
                </div>
              </div>
            </article>

            {/* SELO FINAL DE AUTORIDADE E PRIVACIDADE BLINDADA */}
            <div className="glass-crystal rounded-3xl p-6 sm:p-8 border border-white/10 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-red-600/20 border border-red-500/40 mx-auto flex items-center justify-center text-red-400 shadow-[0_0_20px_rgba(255,7,58,0.3)]">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">
                Contrato Soberano Validado e em Plena Eficácia
              </h3>
              <p className="text-xs text-neutral-400 max-w-xl mx-auto leading-relaxed">
                A continuidade do uso desta plataforma consolida a aceitação tácita e expressa de todos os termos aqui pactuados.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <Link href="/privacidade">
                  <Button variant="glass" size="sm" className="gap-2">
                    <Shield className="w-4 h-4" />
                    <span>Consultar Política de Privacidade</span>
                  </Button>
                </Link>
                <Link href="/">
                  <Button variant="outline" size="sm" className="gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    <span>Retornar ao Portal Institucional</span>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
