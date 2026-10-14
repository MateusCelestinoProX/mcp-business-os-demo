'use client';

import React, { useState } from 'react';
import { 
  Layers, 
  CheckCircle2, 
  ArrowRight, 
  Zap, 
  ShieldCheck, 
  Flame, 
  HeartHandshake, 
  MessageSquare, 
  Globe, 
  X, 
  Info, 
  Share2, 
  FileCode2,
  ExternalLink
} from 'lucide-react';
import LightningShader from '@/components/shaders/LightningShader';

export interface RecursoSocialChannel {
  name: string;
  url: string;
}

export interface RecursoCard {
  title: string;
  desc: string;
}

export interface RecursoItem {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  cover: string;
  manifesto: string;
  description: string;
  quote?: {
    text: string;
    author: string;
  };
  philosophy?: string;
  securityNotice?: string;
  highlights: string[];
  socialChannels?: RecursoSocialChannel[];
  cards?: RecursoCard[];
  ctaText?: string;
  whatsappMessage?: string;
}

export interface RecursosSectionProps {
  recursos?: RecursoItem[];
  onOpenContact?: () => void;
}

export function RecursosSection({ recursos, onOpenContact }: RecursosSectionProps) {
  const [selectedPack, setSelectedPack] = useState<RecursoItem | null>(null);

  const defaultRecursos: RecursoItem[] = [
    {
      id: 'rec-automation-pack',
      title: 'AUTOMATION PACK',
      subtitle: 'Kits e Templates Prontos para Automação Open Source (Typebot & n8n)',
      badge: '100% GRATUITO · OPEN SOURCE',
      cover: '/assets/notion/recursos/packs/automation_pack/Robo_com_Energia_Vermelha_Radiante.png',
      manifesto: 'UM PODEROSO KIT DE TEMPLATES PRONTOS PARA AUTOMAÇÃO EM FERRAMENTAS OPEN SOURCE, TOTALMENTE DE GRAÇA… Eu recebi muito da comunidade OPEN SOURCE, agora, é minha vez de começar a contribuir.',
      description: 'Um compilado de altíssima qualidade reunindo fluxos validados de n8n e Typebot. Pare de ficar caçando templates dispersos pela internet: obtenha em um só lugar tudo que você precisa para estudar, vender e implementar.',
      quote: {
        text: 'O conhecimento é poder. Mas como todo poder, há aqueles que querem mantê-lo para si. O movimento do software livre é a luta para compartilhar esse poder com todos.',
        author: 'Richard Stallman – Fundador do Movimento Software Livre'
      },
      highlights: [
        'Templates prontos de Typebot com lógica condicional avançada',
        'Workflows mestres para n8n (Nodemation) com tratamento de erro',
        'Agentes de IA: Agendador, SDR e Acompanhamento de Leads',
        'Processo simplificado: preencha seu e-mail e receba na hora',
        'Direito de estudo, modificação e implementação comercial'
      ],
      socialChannels: [
        { name: 'Instagram', url: 'https://www.instagram.com/celestinoautomacao/' },
        { name: 'LinkedIn', url: 'https://www.linkedin.com/in/mateus-celestino-0ba50626a/' },
        { name: 'WhatsApp', url: 'https://api.whatsapp.com/send/?phone=553197724257&text=Oi+Mateus,+quero+acessar+o+AUTOMATION+PACK+gratuito.&type=phone_number&app_absent=0' }
      ],
      ctaText: 'OBTER AUTOMATION PACK FREE',
      whatsappMessage: 'Oi Mateus, vim pelo site e quero receber o AUTOMATION PACK gratuito!'
    },
    {
      id: 'rec-wordpress-pack',
      title: 'THE ULTIMATE WORDPRESS PACK',
      subtitle: 'Coleção Completa de Plugins PRO / Premium para WordPress sob Licença GPL',
      badge: '100% LEGAL · LICENÇA GPL',
      cover: '/assets/notion/recursos/packs/wordpress_pack/Icone_WordPress_em_Chamas_e_Circuitos.png',
      manifesto: 'EU OFEREÇO A VOCÊ UMA COLEÇÃO COMPLETA DE PLUGINS PRO/PREMIUM PARA WORDPRESS, 100% GRATUITO. A Licença GPL me permite compartilhar estes plugins de forma 100% legal e dentro da lei, sem qualquer violação de direitos autorais.',
      description: 'Tenha acesso às versões PRO do Elementor Pro + Elementor Add-ons + JetEngine (All) para construir websites de alta conversão sem pagar mensalidades absurdas. Uma doação direta para reduzir as barreiras de entrada no mercado digital.',
      philosophy: 'Por que estou doando de graça ao invés de vender? Bem… todo aquele que ajuda, eventualmente é ajudado um dia. Eu já fui ajudado no início da minha jornada, então se posso retribuir à comunidade, por que não fazer agora?',
      securityNotice: 'Completamente seguro: antes de instalar em seus sites de produção, fique à vontade para escanear todos os arquivos no VirusTotal para atestar a integridade e transparência do código.',
      highlights: [
        'Elementor PRO: o melhor e mais usado page builder sem gambiarra',
        'Elementor PRO Add-ons: dezenas de widgets e efeitos premium',
        'JetEngine (All): custom post types, campos personalizados e listagens dinâmicas',
        'Plugins de Backup PRO e ferramentas de automação interna',
        'Sem pegadinhas, sem assinaturas recorrentes'
      ],
      cards: [
        { title: 'Seu Site Rápido', desc: 'Carregamento veloz e layouts modernos otimizados para conversão.' },
        { title: 'Aprimore Habilidades', desc: 'Construa páginas profissionais sem precisar escrever código do zero.' },
        { title: 'SEO & Dinamismo', desc: 'Estruturação avançada de dados com as suítes do JetEngine.' },
        { title: 'Conquiste Seus Sonhos', desc: 'Tijolos sólidos para você erguer seu império no mercado digital.' }
      ],
      ctaText: 'BAIXAR THE ULTIMATE WP PACK',
      whatsappMessage: 'Oi Mateus, vim pelo site e quero o THE ULTIMATE WORDPRESS PACK gratuito sob licença GPL!'
    }
  ];

  const items = recursos && recursos.length > 0 ? recursos : defaultRecursos;

  return (
    <section id="recursos" className="py-24 relative overflow-hidden">
      {/* Lightning Shader — Vermelho Carmesim */}
      <LightningShader
        className="z-0 mix-blend-screen"
        speed={1.0}
        intensity={1.1}
        size={1.1}
        opacity={0.30}
      />

      {/* Zonas de Transição com Blur */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black via-black/85 to-transparent pointer-events-none z-1 backdrop-blur-[6px]" />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black via-black/85 to-transparent pointer-events-none z-1 backdrop-blur-[6px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* HEADER DA SESSÃO DE RECURSOS ORIGINAL NOTION */}
        <div className="glass-crystal p-8 sm:p-12 rounded-3xl mb-14 border border-white/10 shadow-2xl">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-pill-red text-xs font-mono text-[#ff073a] font-bold uppercase tracking-wider">
              <Layers className="w-4 h-4" />
              <span>RECURSOS GRATUITOS & OPEN SOURCE</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
              <HeartHandshake className="w-4 h-4 text-[#ff073a]" />
              <span>Retribuição à Comunidade Tech</span>
            </div>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            SEJA BEM VINDO A SESSÃO DE RECURSOS DE MATEUS CELESTINO PRO
          </h2>

          <p className="mt-4 text-base sm:text-lg text-zinc-300 font-light leading-relaxed max-w-4xl">
            AQUI VOCÊ ENCONTRARÁ TODOS OS PRODUTOS E RECURSOS QUE EU TENHO DISPONÍVEIS. Materiais coletados, desenvolvidos e validados na prática para você estudar, vender e implementar sem restrições.
          </p>

          <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center gap-6 text-xs font-mono text-zinc-400">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-[#ff073a]" />
              <span className="text-zinc-200 font-bold">ESTUDE</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-[#ff073a]" />
              <span className="text-zinc-200 font-bold">VENDA</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-[#ff073a]" />
              <span className="text-zinc-200 font-bold">IMPLEMENTE</span>
            </div>
          </div>
        </div>

        {/* OS 2 PACKS AUTÊNTICOS DO NOTION */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {items.map((rec) => (
            <div
              key={rec.id}
              className="glass-crystal glass-interactive rounded-3xl p-6 sm:p-10 flex flex-col justify-between group border border-white/10 hover:border-[#ff073a]/50 transition-all duration-300 shadow-2xl"
            >
              <div>
                {/* Capa do Pack */}
                <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden mb-8 bg-black border border-white/10 shadow-2xl">
                  <img
                    src={rec.cover}
                    alt={rec.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                  
                  <div className="absolute top-4 left-4 px-3.5 py-1.5 rounded-xl glass-pill-red text-xs font-mono text-[#ff073a] font-black tracking-wider">
                    {rec.badge}
                  </div>

                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="text-[11px] font-mono text-zinc-300 px-2.5 py-1 rounded-lg glass-pill backdrop-blur-md">
                      MATEUS CELESTINO PRO PRESENTS
                    </span>
                  </div>
                </div>

                <h3 className="text-2xl sm:text-3xl font-black text-white group-hover:text-[#ff073a] transition-all">
                  {rec.title}
                </h3>

                <h4 className="mt-2 text-sm font-mono text-zinc-400 font-semibold">
                  {rec.subtitle}
                </h4>

                {/* Manifesto Autêntico do Notion */}
                <div className="mt-5 p-4 rounded-2xl glass-card-nested border-l-4 border-l-[#ff073a] border border-white/10">
                  <p className="text-xs sm:text-sm text-zinc-200 font-mono italic leading-relaxed">
                    &quot;{rec.manifesto}&quot;
                  </p>
                </div>

                <p className="mt-5 text-sm text-zinc-300 font-light leading-relaxed">
                  {rec.description}
                </p>

                {/* Cards de Valor para o WP Pack se existirem */}
                {rec.cards && rec.cards.length > 0 && (
                  <div className="mt-6 grid grid-cols-2 gap-3">
                    {rec.cards.map((c, idx) => (
                      <div key={idx} className="p-3 rounded-xl glass-card-nested border border-white/5">
                        <div className="text-xs font-bold text-white mb-1 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#ff073a]" />
                          <span>{c.title}</span>
                        </div>
                        <p className="text-[11px] text-zinc-400 font-light leading-snug">{c.desc}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Citação se existir */}
                {rec.quote && (
                  <div className="mt-6 p-4 rounded-xl glass-pill border border-white/5 text-xs text-zinc-300 font-mono">
                    <p className="italic">&quot;{rec.quote.text}&quot;</p>
                    <p className="mt-2 text-[10px] text-zinc-400 font-bold uppercase">— {rec.quote.author}</p>
                  </div>
                )}

                {/* Highlights */}
                <div className="mt-6 pt-5 border-t border-white/10 space-y-2.5">
                  {rec.highlights.map((h, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-zinc-300 font-mono">
                      <CheckCircle2 className="w-4 h-4 text-[#ff073a] shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ações */}
              <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
                <a
                  href={`https://api.whatsapp.com/send/?phone=553197724257&text=${encodeURIComponent(rec.whatsappMessage || `Oi Mateus, quero acessar o ${rec.title}`)}&type=phone_number&app_absent=0`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass-button-fired flex-1 flex items-center justify-center gap-2 py-3 px-5 rounded-xl text-xs font-mono font-bold text-white shadow-xl hover:scale-[1.02] transition-transform"
                >
                  <Zap className="w-4 h-4" />
                  <span>{rec.ctaText || 'OBTER ACESSO AO PACK'}</span>
                </a>

                <button
                  onClick={() => setSelectedPack(rec)}
                  className="px-4 py-3 rounded-xl glass-pill text-xs font-mono text-zinc-300 hover:text-white flex items-center gap-1.5 cursor-pointer transition-colors border border-white/10 hover:border-white/20"
                >
                  <Info className="w-3.5 h-3.5" />
                  <span>Ver Manifesto</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* CITAÇÃO FINAL & FILOSOFIA DE IMPACTO */}
        <div className="mt-14 p-8 sm:p-10 rounded-3xl glass-crystal border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <h4 className="text-lg font-bold text-white flex items-center gap-2">
              <Flame className="w-5 h-5 text-[#ff073a]" />
              <span>&quot;Que ninguém procure uma informação que não seja capaz de encontrar.&quot;</span>
            </h4>
            <p className="text-xs sm:text-sm text-zinc-400 font-light leading-relaxed">
              Conhecimento aberto para todos, de graça. Uma iniciativa de Mateus Celestino Pro para impulsionar a comunidade brasileira de desenvolvedores e gestores de automação.
            </p>
          </div>

          <a
            href="https://api.whatsapp.com/send/?phone=553197724257&text=Oi+Mateus,+vim+pela+aba+de+Recursos+e+gostaria+de+trocar+uma+ideia.&type=phone_number&app_absent=0"
            target="_blank"
            rel="noopener noreferrer"
            className="glass-button-fired px-6 py-3 rounded-xl text-xs font-mono font-bold text-white shadow-lg flex items-center gap-2 shrink-0"
          >
            <MessageSquare className="w-4 h-4" />
            <span>FALAR COM MATEUS NO WHATSAPP</span>
          </a>
        </div>

      </div>

      {/* MODAL DE MANIFESTO COMPLETO DO PACK */}
      {selectedPack && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="relative max-w-2xl w-full max-h-[90vh] overflow-y-auto glass-crystal rounded-3xl p-6 sm:p-8 border border-white/20 shadow-2xl">
            <button
              onClick={() => setSelectedPack(null)}
              className="absolute top-5 right-5 p-2 rounded-xl glass-pill text-zinc-400 hover:text-white cursor-pointer transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden mb-6 bg-black border border-white/10">
              <img
                src={selectedPack.cover}
                alt={selectedPack.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3.5 left-3.5 px-3 py-1 rounded-xl glass-pill-red text-xs font-mono text-[#ff073a] font-bold">
                {selectedPack.badge}
              </div>
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-white">
              {selectedPack.title}
            </h3>

            <p className="mt-1 text-sm font-mono text-zinc-400 font-semibold">
              {selectedPack.subtitle}
            </p>

            <div className="mt-5 p-4 rounded-2xl glass-card-nested border-l-4 border-l-[#ff073a]">
              <p className="text-xs sm:text-sm text-zinc-200 font-mono italic leading-relaxed">
                {selectedPack.manifesto}
              </p>
            </div>

            <div className="mt-5 space-y-3 text-sm text-zinc-300 font-light leading-relaxed">
              <p>{selectedPack.description}</p>
              {selectedPack.philosophy && (
                <div className="p-4 rounded-xl glass-pill border border-white/5">
                  <span className="font-bold text-white block mb-1">💡 Filosofia da Doação:</span>
                  <p className="text-xs text-zinc-300">{selectedPack.philosophy}</p>
                </div>
              )}
              {selectedPack.securityNotice && (
                <div className="p-4 rounded-xl glass-card-nested border border-[#ff073a]/30">
                  <span className="font-bold text-[#ff073a] block mb-1">🛡️ Segurança e Transparência:</span>
                  <p className="text-xs text-zinc-300">{selectedPack.securityNotice}</p>
                </div>
              )}
            </div>

            <div className="mt-6 p-4 rounded-2xl glass-card-nested border border-white/10 space-y-3">
              <h4 className="text-xs font-mono text-white font-bold uppercase tracking-wider">
                CONTEÚDO INCLUSO NO PACK:
              </h4>
              <ul className="space-y-2">
                {selectedPack.highlights.map((h, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-zinc-300 font-mono">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#ff073a] shrink-0 mt-0.5" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-end gap-3">
              <button
                onClick={() => setSelectedPack(null)}
                className="px-5 py-2.5 rounded-xl glass-pill text-xs font-mono text-zinc-300 hover:text-white cursor-pointer"
              >
                Fechar
              </button>
              <a
                href={`https://api.whatsapp.com/send/?phone=553197724257&text=${encodeURIComponent(selectedPack.whatsappMessage || `Oi Mateus, quero o ${selectedPack.title}`)}&type=phone_number&app_absent=0`}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-button-fired px-6 py-2.5 rounded-xl text-xs font-mono font-bold text-white shadow-xl flex items-center gap-2"
              >
                <Zap className="w-4 h-4" />
                <span>{selectedPack.ctaText || 'OBTER AGORA'}</span>
              </a>
            </div>
          </div>
        </div>
      )}

    </section>
  );
}

export default RecursosSection;
