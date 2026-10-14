'use client';

import React from 'react';
import { Layers, CheckCircle2, ArrowRight, Zap, Shield } from 'lucide-react';
import LightningShader from '@/components/shaders/LightningShader';

export interface RecursoItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  badge: string;
  cover: string;
  highlights: string[];
}

export interface RecursosSectionProps {
  recursos?: RecursoItem[];
  onOpenContact?: () => void;
}

export function RecursosSection({ recursos, onOpenContact }: RecursosSectionProps) {
  const defaultRecursos: RecursoItem[] = [
    {
      id: "rec-1",
      title: "PACK 01: FLUXOS MESTRES N8N ENTERPRISE",
      subtitle: "Pacote Supremo de Workflows para n8n, Typebot e Integrações",
      description: "Mais de 150 workflows prontos com tratamento de erro nativo, controle de fila Redis, disparo multicanal e sincronização bidirecional de bancos de dados.",
      badge: "PACK OFICIAL N8N",
      cover: "/assets/recursos_cover.webp",
      highlights: [
        "Templates n8n prontos para importação direta",
        "Integração profunda Baserow, Supabase & Webhooks",
        "Filtro de erros com auto-retry e logs em tempo real"
      ]
    },
    {
      id: "rec-2",
      title: "PACK 02: INFRAESTRUTURA DOCKER SWARM & LINUX",
      subtitle: "Ambiente de Alta Disponibilidade, Traefik & Portainer",
      description: "Scripts de deploy automatizado para cluster Docker Swarm, proxy reverso com Traefik, emissão automática de certificados SSL e backups redundantes.",
      badge: "INFRA & PERFORMANCE",
      cover: "/assets/recursos_cover.webp",
      highlights: [
        "Compose files otimizados para produção",
        "Segurança, Firewall UFW & Hardening Linux",
        "Monitoramento com Portainer e Uptime Kuma"
      ]
    },
    {
      id: "rec-3",
      title: "PACK 03: AGENTES IA & TYPEBOT SUPREME",
      subtitle: "Atendimento Autônomo Multimodal 24/7",
      description: "Esteiras completas de qualificação de leads, agendamento de reuniões, recuperação de carrinho e agentes LLM com base de conhecimento vetorial RAG.",
      badge: "AGENTE IA 24/7",
      cover: "/assets/shop_banner.webp",
      highlights: [
        "Fluxos Typebot com lógica condicional avançada",
        "Conexão com OpenAI, Claude e Ollama local",
        "Zero fricção no WhatsApp sem risco de bloqueio"
      ]
    },
    {
      id: "rec-4",
      title: "PACK 04: BASEROW MASTER DATABASE",
      subtitle: "Bancos de Dados No-Code & Esteiras Comerciais",
      description: "Estruturas relacionais pré-modeladas para gestão de propostas, histórico de conversões, métricas de tráfego pago e controle de SLA de chamados.",
      badge: "DATA MATRIX",
      cover: "/assets/hero_cover.webp",
      highlights: [
        "Modelagem com fórmulas e campos de rollup",
        "Webhooks ativados por evento de atualização",
        "Compatibilidade 100% com n8n e Typebot"
      ]
    }
  ];

  const items = recursos && recursos.length > 0 ? recursos : defaultRecursos;

  return (
    <section id="recursos" className="py-20 relative overflow-hidden">
      {/* Lightning Shader — Vermelho Obscurecido */}
      <LightningShader
        className="z-0 mix-blend-screen"
        speed={1.0}
        intensity={1.2}
        size={1.1}
        opacity={0.28}
      />

      {/* Zonas de Transição Internas com Blur e Escurecimento Progressivo */}
      <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-black via-black/85 to-transparent pointer-events-none z-1 backdrop-blur-[6px]" />
      <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-black via-black/85 to-transparent pointer-events-none z-1 backdrop-blur-[6px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header em Vidro Líquido */}
        <div className="glass-crystal p-8 sm:p-10 rounded-3xl mb-12">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full glass-pill-red text-xs font-mono text-[#a80018] uppercase tracking-wider font-bold">
              <Layers className="w-3.5 h-3.5" />
              <span>KITS & RECURSOS OFICIAIS DE AUTOMAÇÃO</span>
            </div>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Recursos Prontos Para Produção
          </h2>
          <p className="mt-3 text-base text-zinc-300 font-light leading-relaxed max-w-3xl">
            Packs de fluxos, arquiteturas e templates desenvolvidos e validados em operações reais por Mateus Celestino Pro. Economize semanas de desenvolvimento e configure seu ambiente em poucas horas.
          </p>
        </div>

        {/* Grid de Recursos em Vidro Líquido */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {items.map((rec) => (
            <div
              key={rec.id}
              className="glass-crystal glass-interactive rounded-3xl p-6 sm:p-8 flex flex-col justify-between group"
            >
              <div>
                <div className="relative aspect-[16/8] w-full rounded-2xl overflow-hidden mb-6 bg-black border border-white/10 shadow-xl">
                  <img
                    src={rec.cover}
                    alt={rec.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                  <div className="absolute top-3.5 left-3.5 px-3 py-1 rounded-xl glass-pill-red text-xs font-mono text-[#ff073a] font-black tracking-wider">
                    {rec.badge}
                  </div>
                </div>

                <h3 className="text-2xl font-black text-white group-hover:text-[#ff073a] transition-all">
                  {rec.title}
                </h3>
                <h4 className="mt-1 text-sm font-mono text-zinc-400 font-semibold">
                  {rec.subtitle}
                </h4>

                <p className="mt-3.5 text-sm text-zinc-300 font-light leading-relaxed">
                  {rec.description}
                </p>

                {/* Highlights em Pílulas de Vidro */}
                <div className="mt-6 pt-5 border-t border-white/10 space-y-2.5">
                  {rec.highlights?.map((h, idx) => (
                    <div key={idx} className="flex items-center gap-2.5 text-xs text-zinc-300 font-mono">
                      <CheckCircle2 className="w-4 h-4 text-[#ff073a] shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
                <a
                  href={`https://api.whatsapp.com/send/?phone=553197724257&text=Oi+Mateus,+quero+acessar+o+${encodeURIComponent(rec.title)}.&type=phone_number&app_absent=0`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass-button-fired flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-mono font-bold text-white shadow-lg"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>SOLICITAR ACESSO AO PACK</span>
                </a>

                {onOpenContact && (
                  <button
                    onClick={onOpenContact}
                    className="text-xs font-mono text-zinc-400 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    Tirar dúvidas técnicas →
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Stack Strip em Vidro */}
        <div className="mt-10 p-6 rounded-3xl glass-crystal flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-[#ff073a]" />
            <span className="text-xs font-mono text-zinc-300 uppercase tracking-wider font-semibold">
              TECNOLOGIAS HOMOLOGADAS: n8n Enterprise, Typebot, Baserow, Docker Swarm, Redis, Linux Debian/Ubuntu
            </span>
          </div>
          <a
            href="https://api.whatsapp.com/send/?phone=553197724257&text=QUERO+AUTOMATIZAR+TUDO.&type=phone_number&app_absent=0"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-mono text-[#ff073a] hover:underline flex items-center gap-1 font-bold"
          >
            Falar diretamente com Mateus <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
}

export default RecursosSection;
