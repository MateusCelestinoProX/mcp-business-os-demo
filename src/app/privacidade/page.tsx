'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Shield,
  Lock,
  Eye,
  Database,
  Cpu,
  FileCheck,
  Server,
  UserCheck,
  CheckCircle2,
  Copy,
  Check,
  Printer,
  ArrowLeft,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Sliders,
  Scale,
  RefreshCw,
  Search,
  AlertCircle,
  HelpCircle,
  Terminal,
} from 'lucide-react';
import ShaderBackground, { ShaderBackgroundMode } from '@/components/shaders/ShaderBackground';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface Section {
  id: string;
  number: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  tag: string;
}

const SECTIONS: Section[] = [
  { id: 'principios', number: '01', title: 'Soberania e Princípio Zero-Trust', icon: Shield, tag: 'PILAR FUNDAMENTAL' },
  { id: 'controlador', number: '02', title: 'Controlador e Responsabilidade Técnica', icon: UserCheck, tag: 'GOVERNANÇA' },
  { id: 'dados-coletados', number: '03', title: 'Dados Coletados e Origem', icon: Database, tag: 'TELEMETRIA & INPUT' },
  { id: 'finalidades', number: '04', title: 'Finalidades Estritas do Tratamento', icon: Cpu, tag: 'FINALIDADE' },
  { id: 'seguranca', number: '05', title: 'Blindagem e Segurança Criptográfica', icon: Lock, tag: 'INFRAESTRUTURA' },
  { id: 'compartilhamento', number: '06', title: 'Compartilhamento Controlado e Não-Venda', icon: Eye, tag: 'ZERO-DATA-SALE' },
  { id: 'inteligencia-artificial', number: '07', title: 'Inteligência Artificial e Agentes Autônomos', icon: Terminal, tag: 'IA & PRIVACIDADE' },
  { id: 'cookies', number: '08', title: 'Armazenamento Local e Cookies Funcionais', icon: Sliders, tag: 'SESSÃO' },
  { id: 'direitos-titular', number: '09', title: 'Direitos do Titular (LGPD Art. 18)', icon: Scale, tag: 'SEUS DIREITOS' },
  { id: 'retencao', number: '10', title: 'Retenção e Descarte Seguro de Dados', icon: RefreshCw, tag: 'CICLO DE VIDA' },
  { id: 'contato-dpo', number: '11', title: 'Encarregado de Dados (DPO) e Contato', icon: FileCheck, tag: 'CANAL OFICIAL' },
];

export default function PoliticaPrivacidadePage() {
  const [activeShader, setActiveShader] = useState<ShaderBackgroundMode>('silk');
  const [activeSection, setActiveSection] = useState<string>('principios');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedHash, setCopiedHash] = useState<boolean>(false);
  const [copiedEmail, setCopiedEmail] = useState<boolean>(false);

  const DOCUMENT_HASH = 'SHA256: 8f4e2a7b9c1d0e3f5a6b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f';
  const OFFICIAL_EMAIL = '202405039459@alunos.estacio.br';

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;
      for (const section of SECTIONS) {
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
    navigator.clipboard.writeText(DOCUMENT_HASH);
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

  const filteredSections = SECTIONS.filter(
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

      {/* Orbes adicionais de refração do vidro cáustico */}
      <div className="liquid-glow-orb top-20 -left-20 w-[600px] h-[600px] bg-red-700/12 pointer-events-none" />
      <div className="liquid-glow-orb top-[45%] -right-20 w-[550px] h-[550px] bg-red-900/10 pointer-events-none" />
      <div className="liquid-glow-orb bottom-10 left-[25%] w-[500px] h-[500px] bg-red-950/15 pointer-events-none" />

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
              <Shield className="w-4 h-4 text-red-500" />
              <span>Privacidade Blindada</span>
            </div>
          </div>

          {/* Centro: Seletor de Shaders em Vidro */}
          <div className="flex items-center gap-1.5 bg-black/40 border border-white/10 rounded-xl p-1 backdrop-blur-xl">
            <span className="text-[10px] font-mono text-neutral-400 px-2 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-red-400 animate-spin" style={{ animationDuration: '6s' }} />
              <span className="hidden sm:inline">Shader:</span>
            </span>
            {(['silk', 'liquidchrome', 'linewaves', 'gridscan', 'beams', 'galaxy'] as ShaderBackgroundMode[]).map((mode) => (
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
              href="/termos"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-950/40 hover:bg-red-900/40 border border-red-500/30 hover:border-red-500/60 text-xs font-mono text-red-300 hover:text-white transition-all"
            >
              <span>Termos de Uso</span>
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
                <span>CONFORMIDADE LGPD // LEI Nº 13.709/2018</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-[11px] font-mono text-neutral-300">
                <Lock className="w-3 h-3 text-red-400" />
                <span>CRIPTOGRAFIA PONTA A PONTA SOBERANA</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-[11px] font-mono text-emerald-400">
                <CheckCircle2 className="w-3 h-3" />
                <span>VIGÊNCIA VÁLIDA</span>
              </div>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight mb-4">
              Política de Privacidade <span className="text-red-500">Blindada</span>
            </h1>

            <p className="text-base sm:text-lg text-neutral-300 font-light leading-relaxed mb-8">
              A presente política estabelece as diretrizes irrevogáveis de proteção integral à privacidade,
              governança de dados e respeito absoluto aos direitos fundamentais de liberdade e autodeterminação
              informativa no ecossistema <strong className="text-white">Mateus Celestino Pro X</strong>.
            </p>

            {/* Grid de Metadados em Vidro */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-white/10">
              <div className="glass-ultra-pane rounded-xl p-3">
                <span className="text-[10px] font-mono text-neutral-400 block uppercase">Versão do Sistema</span>
                <span className="text-xs sm:text-sm font-bold text-white font-mono">v2.4.0-SOBERANA</span>
              </div>
              <div className="glass-ultra-pane rounded-xl p-3">
                <span className="text-[10px] font-mono text-neutral-400 block uppercase">Última Revisão</span>
                <span className="text-xs sm:text-sm font-bold text-white font-mono">Outubro de 2026</span>
              </div>
              <div className="glass-ultra-pane rounded-xl p-3">
                <span className="text-[10px] font-mono text-neutral-400 block uppercase">Padrão Criptográfico</span>
                <span className="text-xs sm:text-sm font-bold text-red-400 font-mono">AES-256 + TLS 1.3</span>
              </div>
              <div className="glass-ultra-pane rounded-xl p-3">
                <span className="text-[10px] font-mono text-neutral-400 block uppercase">Controlador Titular</span>
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
                  placeholder="Filtrar cláusula ou tema..."
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
                  <FileCheck className="w-3.5 h-3.5 text-red-400" />
                  Índice das Cláusulas
                </span>
                <span className="text-[10px] font-mono text-neutral-500">
                  {filteredSections.length} capítulos
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
                  Hash de Integridade
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
                {DOCUMENT_HASH}
              </p>
            </div>

            {/* Card de Contato Oficial do DPO */}
            <div className="glass-crystal rounded-2xl p-4 border border-red-500/20 shadow-md space-y-2">
              <span className="text-[10px] font-mono text-red-400 uppercase font-bold block">
                Canal Oficial de Privacidade
              </span>
              <p className="text-xs text-neutral-300">
                Para exercer qualquer direito previsto no Art. 18 da LGPD, entre em contato diretamente com o responsável técnico:
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

          {/* COLUNA DIREITA: AS 11 CLÁUSULAS EM PLACAS DE VIDRO LAPIDADO */}
          <main className="lg:col-span-8 space-y-8">
            {/* 01. PRINCÍPIO ZERO-TRUST */}
            <article id="principios" className="glass-crystal rounded-3xl p-6 sm:p-8 border border-white/15 shadow-xl relative scroll-mt-36">
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-red-500/30 to-transparent" />
              <div className="flex items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-400 font-mono font-bold text-sm">
                    01
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-red-400 uppercase tracking-wider block">Pilar Fundamental</span>
                    <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Soberania e Princípio Zero-Trust</h2>
                  </div>
                </div>
                <Shield className="w-5 h-5 text-red-400 hidden sm:block" />
              </div>

              <div className="text-sm text-neutral-300 space-y-4 leading-relaxed font-light">
                <p>
                  O ecossistema <strong>Mateus Celestino Pro X</strong> opera sob a premissa de <em>Privacidade por Design e por Padrão (Privacy by Design &amp; by Default)</em>. Não consideramos a privacidade um complemento operacional, mas a base estruturante de cada módulo, pipeline de automação e interface WebGL desenvolvida.
                </p>
                <div className="p-4 rounded-2xl bg-red-950/30 border border-red-500/20 text-xs text-neutral-300 space-y-2">
                  <div className="font-bold text-red-400 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Compromisso Soberano de Não-Venda</span>
                  </div>
                  <p>
                    Em hipótese alguma vendemos, permutamos, alugamos ou monetizamos dados pessoais com corretores de dados (data brokers), redes de anúncios comportamentais invasivos ou empresas terceiras. Seus dados permanecem estritamente sob sua soberania.
                  </p>
                </div>
              </div>
            </article>

            {/* 02. CONTROLADOR DOS DADOS */}
            <article id="controlador" className="glass-crystal rounded-3xl p-6 sm:p-8 border border-white/15 shadow-xl relative scroll-mt-36">
              <div className="flex items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-red-400 font-mono font-bold text-sm">
                    02
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block">Identificação Oficial</span>
                    <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Controlador e Responsabilidade Técnica</h2>
                  </div>
                </div>
                <UserCheck className="w-5 h-5 text-red-400 hidden sm:block" />
              </div>

              <div className="text-sm text-neutral-300 space-y-4 leading-relaxed font-light">
                <p>
                  Para os fins previstos na Lei Geral de Proteção de Dados Pessoais (LGPD – Lei Federal nº 13.709/2018), o controlador encarregado das decisões referentes ao tratamento de dados pessoais é:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 space-y-1">
                    <span className="text-neutral-500 font-mono">Controlador &amp; Arquiteto:</span>
                    <div className="font-bold text-white text-sm">Mateus Celestino</div>
                    <div className="text-neutral-400 text-[11px]">Mateus Celestino Pro Software // Pro X</div>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 space-y-1">
                    <span className="text-neutral-500 font-mono">Canal Exclusivo de Contato:</span>
                    <div className="font-bold text-red-400 font-mono">{OFFICIAL_EMAIL}</div>
                    <div className="text-neutral-400 text-[11px]">Atendimento aos titulares e à ANPD</div>
                  </div>
                </div>
              </div>
            </article>

            {/* 03. DADOS COLETADOS */}
            <article id="dados-coletados" className="glass-crystal rounded-3xl p-6 sm:p-8 border border-white/15 shadow-xl relative scroll-mt-36">
              <div className="flex items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-red-400 font-mono font-bold text-sm">
                    03
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block">Inventário Mínimo</span>
                    <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Dados Coletados e Origem</h2>
                  </div>
                </div>
                <Database className="w-5 h-5 text-red-400 hidden sm:block" />
              </div>

              <div className="text-sm text-neutral-300 space-y-4 leading-relaxed font-light">
                <p>
                  Coletamos exclusivamente o conjunto mínimo e indispensável de dados para prestar os serviços de alta tecnologia e permitir seu acesso às áreas exclusivas:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2">
                    <div className="font-bold text-white flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-red-500" />
                      <span>Fornecidos Voluntariamente por Você</span>
                    </div>
                    <ul className="space-y-1.5 text-neutral-400 list-disc list-inside">
                      <li>Nome e identificação profissional;</li>
                      <li>Endereço de e-mail verificado;</li>
                      <li>Número de WhatsApp / telefone corporativo (quando submetido em formulários);</li>
                      <li>Credenciais de autenticação (hashes criptográficos, nunca senhas em texto puro);</li>
                      <li>Mensagens e solicitações de automação enviadas aos canais oficiais.</li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2">
                    <div className="font-bold text-white flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-500" />
                      <span>Telemetria Técnica e Desempenho</span>
                    </div>
                    <ul className="space-y-1.5 text-neutral-400 list-disc list-inside">
                      <li>Endereço IP e timestamp de acesso para mitigação de ataques DDoS;</li>
                      <li>Capacidade gráfica do dispositivo (suporte a WebGL 1.0/2.0 e taxas de FPS para renderizar shaders);</li>
                      <li>Identificador da sessão autenticada;</li>
                      <li>Logs de erro técnico em tempo de execução para manter os 99.9% de disponibilidade.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </article>

            {/* 04. FINALIDADES DO TRATAMENTO */}
            <article id="finalidades" className="glass-crystal rounded-3xl p-6 sm:p-8 border border-white/15 shadow-xl relative scroll-mt-36">
              <div className="flex items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-red-400 font-mono font-bold text-sm">
                    04
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block">Base Legal LGPD</span>
                    <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Finalidades Estritas do Tratamento</h2>
                  </div>
                </div>
                <Cpu className="w-5 h-5 text-red-400 hidden sm:block" />
              </div>

              <div className="text-sm text-neutral-300 space-y-3 leading-relaxed font-light">
                <p>
                  Todo tratamento é respaldado nas bases legais do <strong>Artigo 7º da LGPD</strong> (execução de contrato, cumprimento de obrigação legal e legítimo interesse estrito):
                </p>
                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-start gap-3">
                    <span className="font-mono text-red-400 shrink-0 font-bold">4.1</span>
                    <div>
                      <strong className="text-white block mb-0.5">Disponibilização da Área de Membros e Ativos:</strong>
                      Permitir autenticação soberana, download de pacotes de automação, fluxos n8n, Typebot e templates.
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-start gap-3">
                    <span className="font-mono text-red-400 shrink-0 font-bold">4.2</span>
                    <div>
                      <strong className="text-white block mb-0.5">Comunicação e Suporte Direto:</strong>
                      Envio de atualizações críticas sobre o ecossistema, orientações de engenharia e respostas às solicitações enviadas.
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-start gap-3">
                    <span className="font-mono text-red-400 shrink-0 font-bold">4.3</span>
                    <div>
                      <strong className="text-white block mb-0.5">Segurança da Infraestrutura:</strong>
                      Detecção de tentativas de invasão, abuso de APIs, extração não autorizada de dados (scraping abusivo) e proteção dos demais membros.
                    </div>
                  </div>
                </div>
              </div>
            </article>

            {/* 05. BLINDAGEM E SEGURANÇA */}
            <article id="seguranca" className="glass-crystal rounded-3xl p-6 sm:p-8 border border-white/15 shadow-xl relative scroll-mt-36">
              <div className="flex items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-400 font-mono font-bold text-sm">
                    05
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-red-400 uppercase tracking-wider block">Arquitetura de Defesa</span>
                    <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Blindagem e Segurança Criptográfica</h2>
                  </div>
                </div>
                <Lock className="w-5 h-5 text-red-400 hidden sm:block" />
              </div>

              <div className="text-sm text-neutral-300 space-y-4 leading-relaxed font-light">
                <p>
                  A plataforma Mateus Celestino Pro X implementa padrões de segurança cibernética equivalentes aos empregados em infraestruturas bancárias e de defesa:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-4 rounded-2xl bg-black/40 border border-white/10 text-center space-y-2">
                    <div className="w-8 h-8 rounded-lg bg-red-500/20 border border-red-500/40 mx-auto flex items-center justify-center text-red-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-white block">TLS 1.3 / HTTPS</span>
                    <p className="text-[11px] text-neutral-400">Todo tráfego em trânsito é cifrado com curvas elípticas modernas e Perfect Forward Secrecy.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-black/40 border border-white/10 text-center space-y-2">
                    <div className="w-8 h-8 rounded-lg bg-red-500/20 border border-red-500/40 mx-auto flex items-center justify-center text-red-400">
                      <Database className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-white block">PostgreSQL + Drizzle</span>
                    <p className="text-[11px] text-neutral-400">Bancos de dados isolados, criptografia em repouso AES-256 e queries tipadas contra injeção SQL.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-black/40 border border-white/10 text-center space-y-2">
                    <div className="w-8 h-8 rounded-lg bg-red-500/20 border border-red-500/40 mx-auto flex items-center justify-center text-red-400">
                      <Shield className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-white block">Isolamento Zero-Trust</span>
                    <p className="text-[11px] text-neutral-400">Princípio de menor privilégio (PoLP) aplicado a cada chave de API e microsserviço.</p>
                  </div>
                </div>
              </div>
            </article>

            {/* 06. COMPARTILHAMENTO CONTROLADO */}
            <article id="compartilhamento" className="glass-crystal rounded-3xl p-6 sm:p-8 border border-white/15 shadow-xl relative scroll-mt-36">
              <div className="flex items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-red-400 font-mono font-bold text-sm">
                    06
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block">Garantia Transparente</span>
                    <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Compartilhamento Controlado e Não-Venda</h2>
                  </div>
                </div>
                <Eye className="w-5 h-5 text-red-400 hidden sm:block" />
              </div>

              <div className="text-sm text-neutral-300 space-y-3 leading-relaxed font-light">
                <p>
                  Compartilhamos dados exclusivamente com provedores essenciais para a execução técnica dos serviços, sob acordos contratuais de estrita confidencialidade:
                </p>
                <ul className="space-y-2 text-xs text-neutral-300">
                  <li className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                    <span><strong>Provedores de Nuvem e Edge:</strong> Vercel &amp; infraestrutura de borda global para servir assets e WebGL com latência mínima.</span>
                    <Badge variant="outline">INFRA</Badge>
                  </li>
                  <li className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                    <span><strong>Gateways de Pagamento:</strong> Processadores regulados pelo Banco Central para transações criptografadas. Dados de cartão nunca transitam por nossos servidores.</span>
                    <Badge variant="outline">FINANCEIRO</Badge>
                  </li>
                  <li className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                    <span><strong>Serviço de Mensageria Criptografada:</strong> Provedores homologados para autenticação e e-mails transacionais.</span>
                    <Badge variant="outline">MENSAGENS</Badge>
                  </li>


                </ul>
              </div>
            </article>

            {/* 07. IA E AGENTES AUTÔNOMOS */}
            <article id="inteligencia-artificial" className="glass-crystal rounded-3xl p-6 sm:p-8 border border-white/15 shadow-xl relative scroll-mt-36">
              <div className="flex items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-400 font-mono font-bold text-sm">
                    07
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-red-400 uppercase tracking-wider block">Governança Avançada</span>
                    <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Inteligência Artificial e Agentes Autônomos</h2>
                  </div>
                </div>
                <Terminal className="w-5 h-5 text-red-400 hidden sm:block" />
              </div>

              <div className="text-sm text-neutral-300 space-y-4 leading-relaxed font-light">
                <p>
                  Como referência em hiperautomação e agentes de IA autônomos, assumimos uma política rigorosa sobre o uso de inteligência artificial:
                </p>
                <div className="space-y-2 text-xs">
                  <div className="p-4 rounded-2xl bg-black/40 border border-red-500/20 space-y-1">
                    <strong className="text-white block font-mono text-xs flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      Não-Treinamento de Modelos Públicos
                    </strong>
                    <p className="text-neutral-400">
                      Nenhum dado, prompt, conversa de suporte ou informação técnica submetida por membros ou clientes é utilizada para treinar modelos fundacionais públicos (como OpenAI, Google ou Meta). Todas as instâncias operam em modo isolado com cláusula expressa de zero-data-retention nos provedores de LLM.
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-1">
                    <strong className="text-white block font-mono text-xs flex items-center gap-2">
                      <Lock className="w-3.5 h-3.5 text-red-400" />
                      Supervisão Humana Soberana
                    </strong>
                    <p className="text-neutral-400">
                      Decisões que afetem o status de conta, segurança ou direitos dos usuários nunca são tomadas exclusivamente por IA sem a supervisão e validação do Arquiteto Oficial Mateus Celestino.
                    </p>
                  </div>
                </div>
              </div>
            </article>

            {/* 08. COOKIES E ARMAZENAMENTO */}
            <article id="cookies" className="glass-crystal rounded-3xl p-6 sm:p-8 border border-white/15 shadow-xl relative scroll-mt-36">
              <div className="flex items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-red-400 font-mono font-bold text-sm">
                    08
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block">Armazenamento Local</span>
                    <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Armazenamento Local e Cookies Funcionais</h2>
                  </div>
                </div>
                <Sliders className="w-5 h-5 text-red-400 hidden sm:block" />
              </div>

              <div className="text-sm text-neutral-300 space-y-3 leading-relaxed font-light">
                <p>
                  Utilizamos armazenamento local exclusivamente para funcionalidades operacionais do sistema:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10 space-y-1">
                    <span className="font-bold text-white">Sessão e Autenticação:</span>
                    <p className="text-neutral-400 text-[11px]">Tokens seguros (`mcp_auth_user`) para manter o usuário autenticado na área restrita.</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10 space-y-1">
                    <span className="font-bold text-white">Preferências de Shaders:</span>
                    <p className="text-neutral-400 text-[11px]">Armazenamento da preferência de shader ativo para garantir a melhor taxa de quadros (FPS).</p>
                  </div>
                </div>
                <p className="text-xs text-neutral-400">
                  Você pode limpar todos os dados de armazenamento a qualquer momento através das ferramentas de desenvolvedor do seu navegador ou limpando o cache.
                </p>
              </div>
            </article>

            {/* 09. DIREITOS DO TITULAR (LGPD ART. 18) */}
            <article id="direitos-titular" className="glass-crystal rounded-3xl p-6 sm:p-8 border border-red-500/30 shadow-[0_0_50px_rgba(138,0,18,0.2)] relative scroll-mt-36">
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-red-500/60 to-transparent" />
              <div className="flex items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-600/30 border border-red-500/40 flex items-center justify-center text-red-400 font-mono font-bold text-sm">
                    09
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-red-400 uppercase tracking-wider block font-bold">Garantia Legal Imutável</span>
                    <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Direitos do Titular (LGPD Art. 18)</h2>
                  </div>
                </div>
                <Scale className="w-5 h-5 text-red-400 hidden sm:block" />
              </div>

              <div className="text-sm text-neutral-300 space-y-4 leading-relaxed font-light">
                <p>
                  Em total alinhamento ao Artigo 18 da Lei Federal nº 13.709/2018, você pode exercer os seguintes direitos a qualquer momento, de forma simplificada e gratuita:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                  {[
                    { num: 'I', title: 'Confirmação e Acesso', desc: 'Saber se tratamos seus dados e solicitar cópia completa de suas informações.' },
                    { num: 'II', title: 'Correção de Dados', desc: 'Solicitar a retificação imediata de informações incompletas, inexatas ou desatualizadas.' },
                    { num: 'III', title: 'Anonimização e Eliminação', desc: 'Exigir o bloqueio ou descarte seguro de dados excessivos ou tratados em desconformidade.' },
                    { num: 'IV', title: 'Portabilidade Soberana', desc: 'Receber seus dados em formato estruturado (JSON ou CSV) para transferência a outro serviço.' },
                    { num: 'V', title: 'Revogação do Consentimento', desc: 'Retirar o consentimento previamente fornecido com apenas uma solicitação direta.' },
                    { num: 'VI', title: 'Informação sobre Terceiros', desc: 'Conhecer as entidades públicas e privadas com as quais houve compartilhamento.' },
                  ].map((item) => (
                    <div key={item.num} className="p-3 rounded-xl bg-black/50 border border-white/10 space-y-1">
                      <div className="flex items-center gap-2 font-bold text-white">
                        <span className="text-red-400 font-mono text-[11px]">{item.num}.</span>
                        <span>{item.title}</span>
                      </div>
                      <p className="text-[11px] text-neutral-400 leading-normal">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </article>

            {/* 10. RETENÇÃO E DESCARTE SEGURO */}
            <article id="retencao" className="glass-crystal rounded-3xl p-6 sm:p-8 border border-white/15 shadow-xl relative scroll-mt-36">
              <div className="flex items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-red-400 font-mono font-bold text-sm">
                    10
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block">Ciclo de Vida</span>
                    <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Retenção e Descarte Seguro de Dados</h2>
                  </div>
                </div>
                <RefreshCw className="w-5 h-5 text-red-400 hidden sm:block" />
              </div>

              <div className="text-sm text-neutral-300 space-y-3 leading-relaxed font-light">
                <p>
                  Armazenamos os dados pessoais somente pelo período estritamente necessário para cumprir as finalidades para as quais foram coletados, ou para resguardo de obrigações fiscais e legais:
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-neutral-300 border-collapse">
                    <thead>
                      <tr className="border-b border-white/10 text-neutral-400 font-mono text-[11px]">
                        <th className="py-2 px-3">Categoria de Dado</th>
                        <th className="py-2 px-3">Prazo de Retenção</th>
                        <th className="py-2 px-3">Fundamento Legal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      <tr>
                        <td className="py-2.5 px-3 font-semibold text-white">Dados de Cadastro e Conta</td>
                        <td className="py-2.5 px-3">Enquanto a conta permanecer ativa</td>
                        <td className="py-2.5 px-3 font-mono text-neutral-400">Execução de Contrato</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 font-semibold text-white">Dados Fiscais e Cobrança</td>
                        <td className="py-2.5 px-3">5 anos a contar do ano subsequente</td>
                        <td className="py-2.5 px-3 font-mono text-neutral-400">Art. 173 do CTN</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 font-semibold text-white">Logs de Acesso e Conexão</td>
                        <td className="py-2.5 px-3">6 meses</td>
                        <td className="py-2.5 px-3 font-mono text-neutral-400">Marco Civil (Lei 12.965/14)</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 font-semibold text-white">Telemetria de Shaders / Erros</td>
                        <td className="py-2.5 px-3">30 dias (anonimizados)</td>
                        <td className="py-2.5 px-3 font-mono text-neutral-400">Legítimo Interesse Técnico</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </article>

            {/* 11. ENCARREGADO DE DADOS (DPO) */}
            <article id="contato-dpo" className="glass-crystal rounded-3xl p-6 sm:p-8 border border-white/15 shadow-xl relative scroll-mt-36">
              <div className="flex items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-400 font-mono font-bold text-sm">
                    11
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-red-400 uppercase tracking-wider block">Canal Oficial</span>
                    <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Encarregado de Dados (DPO) e Contato</h2>
                  </div>
                </div>
                <FileCheck className="w-5 h-5 text-red-400 hidden sm:block" />
              </div>

              <div className="text-sm text-neutral-300 space-y-4 leading-relaxed font-light">
                <p>
                  Para exercer seus direitos de titular, formular dúvidas sobre o tratamento de dados ou enviar notificações formais, entre em contato diretamente com o Encarregado pelo Tratamento de Dados Pessoais:
                </p>
                <div className="p-5 rounded-2xl bg-black/60 border border-red-500/30 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <span className="text-[10px] font-mono text-neutral-400 block uppercase">Encarregado Oficial (DPO)</span>
                      <strong className="text-base text-white">Mateus Celestino</strong>
                      <span className="text-xs text-neutral-400 block">Arquiteto de Software &amp; Gestor do Ecossistema Pro X</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-neutral-400 block uppercase">E-mail Oficial Homologado</span>
                      <a
                        href={`mailto:${OFFICIAL_EMAIL}`}
                        className="text-sm font-mono text-red-400 hover:text-white transition-colors underline decoration-red-500/40"
                      >
                        {OFFICIAL_EMAIL}
                      </a>
                      <span className="text-[11px] text-neutral-500 block">Canal oficial verificado para comunicações da ANPD</span>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <span className="text-neutral-400">
                      Prazo regulamentar de resposta: até 15 dias úteis (conforme Art. 19 da LGPD).
                    </span>
                    <a
                      href={`mailto:${OFFICIAL_EMAIL}?subject=Solicita%C3%A7%C3%A3o%20de%20Privacidade%20LGPD%20-%20Mateus%20Celestino%20Pro%20X`}
                      className="px-4 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-semibold transition-all shadow-[0_0_15px_rgba(255,7,58,0.4)]"
                    >
                      Abrir Chamado LGPD
                    </a>
                  </div>
                </div>
              </div>
            </article>

            {/* SELO FINAL DE AUTORIDADE E TERMOS SOBERANOS */}
            <div className="glass-crystal rounded-3xl p-6 sm:p-8 border border-white/10 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-red-600/20 border border-red-500/40 mx-auto flex items-center justify-center text-red-400 shadow-[0_0_20px_rgba(255,7,58,0.3)]">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">
                Soberania Técnica, Integridade e Transparência Absoluta
              </h3>
              <p className="text-xs text-neutral-400 max-w-xl mx-auto leading-relaxed">
                Este documento é revisto continuamente para acompanhar as atualizações regulatórias da ANPD e da jurisprudência brasileira de tecnologia.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <Link href="/termos">
                  <Button variant="glass" size="sm" className="gap-2">
                    <span>Consultar Termos de Uso</span>
                    <ChevronRight className="w-4 h-4" />
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
          </main>
        </div>
      </div>
    </div>
  );
}
