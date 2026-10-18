'use client';

import React from 'react';
import { 
  User, 
  Award, 
  CheckCircle2, 
  ExternalLink, 
  Shield, 
  Cpu, 
  Sparkles, 
  Milestone, 
  TrendingUp, 
  Server, 
  Bot, 
  MessageSquare,
  ArrowRight
} from 'lucide-react';
import GridScanShader from '@/components/shaders/GridScanShader';

export interface SobreSectionProps {
  profile?: {
    whatsapp?: string;
    email?: string;
    linkedin?: string;
    instagram?: string;
  };
}

export function SobreSection({ profile }: SobreSectionProps) {
  const whatsappUrl =
    profile?.whatsapp ||
    'https://api.whatsapp.com/send/?phone=553197724257&text=Olá+Mateus,+conheci+sua+trajetória+no+portal+e+gostaria+de+conversar!&type=phone_number&app_absent=0';

  // Métricas e Conquistas
  const conquistas = [
    {
      valor: '+800',
      label: 'Flows & Workflows Criados',
      sub: 'Typebot & n8n testados',
      icon: Cpu,
    },
    {
      valor: '24/7',
      label: 'Operação de Agentes IA',
      sub: 'Sem paradas ou filas',
      icon: Bot,
    },
    {
      valor: '100%',
      label: 'Soberania de Dados',
      sub: 'Linux & Docker self-hosted',
      icon: Server,
    },
    {
      valor: '+5 Anos',
      label: 'Mercado de Tecnologia',
      sub: 'Marketing digital & automação',
      icon: TrendingUp,
    },
  ];

  // Timeline de Evolução Profissional
  const timeline = [
    {
      periodo: 'Fundação & Raízes',
      titulo: 'Formação em Marketing Digital',
      descricao:
        'Graduado em Marketing Digital por uma das principais instituições do Brasil, especializando-se em copywriting analítico, funis de conversão de alto impacto e psicologia de vendas.',
      badge: 'FORMAÇÃO SÓLIDA',
    },
    {
      periodo: 'Engenharia de Infraestrutura',
      titulo: 'Soberania Linux & Servidores Dedicados',
      descricao:
        'Aprofundamento em arquiteturas de servidores Linux, Docker Swarm, Traefik, PostgreSQL e redes privadas para eliminar o alto custo de plataformas SaaS e garantir privacidade absoluta aos clientes.',
      badge: 'INFRAESTRUTURA',
    },
    {
      periodo: 'Automação & Low-Code',
      titulo: 'Especialista n8n, Typebot & Baserow',
      descricao:
        'Desenvolvimento de centenas de fluxos complexos para captação de leads, automação omni-channel, orquestração de APIs REST e integrações corporativas com webhooks resilientes.',
      badge: 'NODEMATION MESTRE',
    },
    {
      periodo: 'Era da Inteligência Artificial',
      titulo: 'Arquiteto de Agentes Autônomos & MCP OS',
      descricao:
        'Implementação de agentes inteligentes de WhatsApp com LLMs avançadas, RAG em bancos relacionais e criação do ecossistema MCP Business OS para gestão empresarial autônoma 24/7.',
      badge: 'IA APLICADA',
    },
  ];

  // Pilares de Autoridade
  const pilares = [
    {
      icon: Award,
      titulo: 'Marketing Digital com Foco em ROI',
      descricao:
        'Estratégias orientadas à conversão real, retenção e funis de captação de clientes automatizados sem desperdício de verba.',
    },
    {
      icon: Shield,
      titulo: 'Segurança Linux & Infraestrutura',
      descricao:
        'Servidores blindados, Docker Swarm, proxy reverso seguro com SSL automático e independência total de SaaS caros.',
    },
    {
      icon: Bot,
      titulo: 'Atendimento Autônomo WhatsApp',
      descricao:
        'Chatbots e agentes inteligentes treinados com dados específicos do negócio, atendendo e qualificando clientes 24 horas por dia.',
    },
    {
      icon: Cpu,
      titulo: 'Integrações de APIs & Dados',
      descricao:
        'Conexão de ponta a ponta com Webhooks, bancos relacionais, CRMs e inteligência generativa em tempo real.',
    },
  ];

  return (
    <section id="sobre" className="py-16 sm:py-24 relative overflow-hidden w-full">
      {/* 0. Shader WebGL Dedicado da Sessão Sobre: GridScan Holográfico Encorpado */}
      <GridScanShader
        className="z-0 mix-blend-screen pointer-events-none"
        linesColor="#38000a"
        scanColor="#ff073a"
        lineThickness={1.3}
        gridScale={0.11}
        bloomIntensity={0.85}
        scanGlow={0.65}
        opacity={0.65}
      />

      {/* Zonas de Transição Internas com Blur e Escurecimento Progressivo */}
      <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-black/80 via-black/40 to-transparent pointer-events-none z-1" />
      <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none z-1" />

      <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-16 relative z-10">
        
        {/* Header em Vidro Adaptado ao Mobile */}
        <div className="glass-crystal p-6 sm:p-10 rounded-2xl sm:rounded-3xl mb-10 sm:mb-14 border border-white/10 shadow-2xl">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-pill-red text-xs font-mono text-[#ff073a] uppercase tracking-wider font-bold">
              <User className="w-3.5 h-3.5" />
              <span>QUEM ESTÁ POR TRÁS</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-mono text-zinc-300">
              <Sparkles className="w-3.5 h-3.5 text-[#ff073a]" />
              <span>Fundador & Engenheiro Chefe</span>
            </div>
          </div>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
            Sobre Mateus Celestino
          </h2>
          <p className="mt-2 text-sm sm:text-lg font-mono text-[#ff073a] font-bold">
            T.I. & Digital Marketing Automation Specialist
          </p>
        </div>

        {/* 2 Colunas Principais: Biografia e Apresentação */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start mb-14 sm:mb-20">
          
          {/* Coluna Esquerda: Fotografia & Destaque em Vidro */}
          <div className="lg:col-span-5 space-y-6">
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden glass-crystal p-2.5 sm:p-3 group border border-white/10 shadow-2xl">
              <div className="relative aspect-[4/5] w-full rounded-xl sm:rounded-2xl overflow-hidden bg-black border border-white/10 shadow-2xl">
                <img
                  src="/assets/sobre_mateus_photo.webp"
                  alt="Mateus Celestino"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-80" />
                <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 p-3 sm:p-4 rounded-xl sm:rounded-2xl glass-crystal border border-[#ff073a]/40">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <span className="block text-sm sm:text-base font-black text-white">Mateus Celestino</span>
                      <span className="block text-xs font-mono text-[#ff073a] font-semibold">Fundador & Arquiteto Chefe</span>
                    </div>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_#10b981]" title="Disponível para projetos" />
                  </div>
                </div>
              </div>
            </div>

            {/* Ação Rápida WhatsApp no Mobile */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-button-fired w-full py-3.5 px-4 rounded-xl sm:rounded-2xl flex items-center justify-center gap-2 text-xs font-mono font-bold text-white shadow-lg min-h-[48px] hover:scale-[1.01] transition-transform"
            >
              <MessageSquare className="w-4 h-4" />
              <span>FALAR DIRETAMENTE COM MATEUS</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Coluna Direita: Narrativa & Pilares em Vidro */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8">
            <div className="glass-crystal p-6 sm:p-9 rounded-2xl sm:rounded-3xl border border-white/10 shadow-xl">
              <h3 className="text-xl sm:text-2xl font-black text-white mb-4 sm:mb-6 tracking-tight leading-snug">
                A Intersecção Entre Tecnologia, Estratégia & Automação com IA
              </h3>

              <div className="space-y-4 text-zinc-300 font-light text-sm sm:text-base leading-relaxed">
                <p>
                  Sou formado em <strong className="text-white font-semibold">Marketing Digital</strong> por uma das principais faculdades do Brasil, com carreira construída unindo tecnologia de ponta, automação de fluxos e estratégia avançada de vendas.
                </p>
                <p>
                  Apaixonado por inovação desde cedo, especializei-me em <strong className="text-[#ff073a] font-semibold">T.I. e automação de processos empresariais com inteligência artificial</strong>, criando soluções que eliminam tarefas repetitivas e constroem esteiras de vendas autônomas.
                </p>
                <p>
                  Atuo como empreendedor digital focado em arquiteturas self-hosted, atendimento inteligente via WhatsApp sem fricção, e integração profunda de ferramentas modernas como <strong className="text-white font-semibold">n8n, Typebot, Baserow, Docker e LLMs</strong>.
                </p>
                <div className="border-l-2 border-[#ff073a] pl-3.5 sm:pl-4 italic text-zinc-200 glass-pill p-3 sm:p-4 rounded-r-xl sm:rounded-r-2xl text-xs sm:text-sm">
                  &ldquo;Minha missão é transformar ideias em sistemas inteligentes que funcionam de forma autônoma 24/7, liberando seu tempo e energia para focar no crescimento estratégico do seu negócio.&rdquo;
                </div>
              </div>
            </div>

            {/* 4 Pilares de Competência em Cartões de Vidro */}
            <div>
              <div className="text-xs font-mono text-zinc-400 uppercase tracking-widest font-bold mb-3 flex items-center gap-2">
                <Shield className="w-3.5 h-3.5 text-[#ff073a]" />
                <span>PILARES DE COMPETÊNCIA & EXPERTISE TÉCNICA</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                {pilares.map((pilar, idx) => {
                  const IconComp = pilar.icon;
                  return (
                    <div key={idx} className="glass-crystal glass-interactive p-4 sm:p-5 rounded-xl sm:rounded-2xl border border-white/10">
                      <div className="w-8 h-8 rounded-lg glass-pill-red flex items-center justify-center text-[#ff073a] mb-2.5">
                        <IconComp className="w-4 h-4" />
                      </div>
                      <h4 className="text-sm font-bold text-white mb-1">{pilar.titulo}</h4>
                      <p className="text-xs text-zinc-400 leading-relaxed font-light">
                        {pilar.descricao}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

        </div>

        {/* SEÇÃO 2: CONQUISTAS & MÉTRICAS DE AUTORIDADE */}
        <div className="mb-14 sm:mb-20">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-pill text-xs font-mono text-zinc-300 font-bold mb-2">
              <Award className="w-3.5 h-3.5 text-[#ff073a]" />
              <span>RESULTADOS COMPROVADOS</span>
            </div>
            <h3 className="text-xl sm:text-3xl font-black text-white tracking-tight">
              Conquistas & Números de Impacto
            </h3>
            <p className="mt-1.5 text-xs sm:text-sm text-zinc-400 font-light">
              Métricas reais construídas ao longo de anos de implementação e dedicação ao software livre e à automação.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {conquistas.map((item, idx) => {
              const IconItem = item.icon;
              return (
                <div
                  key={idx}
                  className="glass-crystal glass-interactive p-4 sm:p-6 rounded-2xl border border-white/10 flex flex-col justify-between group hover:border-[#ff073a]/40 transition-all"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl sm:text-4xl font-black text-white font-mono group-hover:text-[#ff073a] transition-colors">
                      {item.valor}
                    </span>
                    <div className="w-8 h-8 rounded-lg glass-pill flex items-center justify-center text-[#ff073a] shrink-0">
                      <IconItem className="w-4 h-4" />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-white leading-snug">
                      {item.label}
                    </h4>
                    <p className="text-[11px] sm:text-xs text-zinc-400 font-mono font-light mt-0.5">
                      {item.sub}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* SEÇÃO 3: TIMELINE DE EVOLUÇÃO E CARREIRA */}
        <div className="glass-crystal p-6 sm:p-10 lg:p-12 rounded-2xl sm:rounded-3xl border border-white/10 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8 sm:mb-10 pb-6 border-b border-white/10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-pill-red text-xs font-mono text-[#ff073a] font-bold mb-2">
                <Milestone className="w-3.5 h-3.5" />
                <span>TRAJETÓRIA PROFISSIONAL</span>
              </div>
              <h3 className="text-xl sm:text-3xl font-black text-white tracking-tight">
                Timeline de Construção & Maestria
              </h3>
            </div>
            <span className="text-xs font-mono text-zinc-400">
              Evolução contínua em Marketing & Engenharia
            </span>
          </div>

          {/* Lista em Timeline Vertical Otimizada para Mobile */}
          <div className="relative pl-6 sm:pl-8 border-l-2 border-[#ff073a]/30 space-y-8 sm:space-y-10">
            {timeline.map((step, idx) => (
              <div key={idx} className="relative group">
                {/* Marcador Neon Carmesim da Timeline */}
                <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-black border-2 border-[#ff073a] shadow-[0_0_12px_#ff073a] flex items-center justify-center group-hover:scale-125 transition-transform">
                  <span className="w-1.5 h-1.5 rounded-full bg-white" />
                </div>

                <div className="glass-card-nested p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-white/10 hover:border-white/20 transition-all">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-mono text-[#ff073a] font-bold uppercase tracking-wider">
                      {step.periodo}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full glass-pill text-zinc-300 font-semibold border border-white/5">
                      {step.badge}
                    </span>
                  </div>

                  <h4 className="text-base sm:text-lg font-bold text-white mb-2 group-hover:text-[#ff073a] transition-colors">
                    {step.titulo}
                  </h4>

                  <p className="text-xs sm:text-sm text-zinc-300 font-light leading-relaxed">
                    {step.descricao}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Rodapé da Seção Sobre com CTA */}
          <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 text-center sm:text-left">
              <CheckCircle2 className="w-4 h-4 text-[#ff073a] shrink-0" />
              <span>Pronto para acelerar os processos da sua empresa com inteligência</span>
            </div>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-button-fired w-full sm:w-auto px-6 py-3 rounded-xl text-xs font-mono font-bold text-white shadow-xl flex items-center justify-center gap-2 min-h-[48px]"
            >
              <MessageSquare className="w-4 h-4" />
              <span>SOLICITAR CONSULTORIA DE AUTOMAÇÃO</span>
            </a>
          </div>

        </div>

      </div>
    </section>
  );
}

export default SobreSection;

