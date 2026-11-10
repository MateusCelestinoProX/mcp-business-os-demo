'use client';

import React from 'react';
import {
  Laptop,
  Bot,
  Filter,
  Target,
  GraduationCap,
  TrendingUp,
  Layers,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

interface ServiceItem {
  id: string;
  index: string;
  title: string;
  description: string;
  featured?: boolean;
  badge?: string;
  icon: React.ComponentType<{ className?: string }>;
}

const SERVICES: ServiceItem[] = [
  {
    id: 'software-sob-medida',
    index: '01',
    title: 'Criação de Software Sob Medida',
    description:
      'Desenvolvimento completo de sistemas, plataformas web customizadas e portais corporativos que resolvem gargalos de forma elegante e ultra-rápida.',
    featured: true,
    badge: 'Especialidade',
    icon: Laptop,
  },
  {
    id: 'ai-chatbots',
    index: '02',
    title: 'AI Chatbots Inteligentes',
    description:
      'Robôs treinados com a inteligência do seu produto que entendem as dúvidas do cliente, qualificam e conduzem até a reunião com seu time de vendas.',
    icon: Bot,
  },
  {
    id: 'qualificacao-leads',
    index: '03',
    title: 'Qualificação de Leads',
    description:
      'Identificação e triagem instantânea do fit de cada cliente em segundos no seu banco de dados, disparando alertas apenas para leads quentes.',
    icon: Filter,
  },
  {
    id: 'prospeccao-ativa',
    index: '04',
    title: 'Prospecção Ativa Automatizada',
    description:
      'Equipe virtual de outbound configurada para buscar, filtrar e abordar os tomadores de decisão ideais com copys ultra-personalizados.',
    icon: Target,
  },
  {
    id: 'sistemas-treinamento',
    index: '05',
    title: 'Sistemas de Treinamento',
    description:
      'Análise automática de calls com feedbacks em tempo real de pontos de conversão, tratamento de objeções e insights do time comercial.',
    icon: GraduationCap,
  },
  {
    id: 'inteligencia-mercado',
    index: '06',
    title: 'Inteligência de Mercado',
    description:
      'Varreduras constantes do mercado e concorrência para monitorar preços, mudanças de posições de produtos de forma autônoma.',
    icon: TrendingUp,
  },
];

export function ServicosSection() {
  return (
    <section id="servicos" className="pt-10 pb-12 sm:pt-14 sm:pb-16 relative overflow-hidden w-full">
      {/* Zonas de fusão suave com as seções adjacentes */}
      <div className="absolute top-0 left-0 right-0 h-10 sm:h-14 bg-gradient-to-b from-[#000000] via-[#000000]/65 to-transparent pointer-events-none z-[1]" />
      <div className="absolute bottom-0 left-0 right-0 h-10 sm:h-14 bg-gradient-to-t from-[#030305]/85 to-transparent pointer-events-none z-[1]" />

      {/* Halo óptico carmesim central alinhado à estética da Home */}
      <div
        className="absolute top-10 left-1/2 -translate-x-1/2 w-80 sm:w-[42rem] h-28 rounded-full pointer-events-none opacity-20 z-[1]"
        style={{
          background: 'radial-gradient(ellipse at center, #ff073a 0%, rgba(138,0,18,0.4) 40%, transparent 75%)',
          filter: 'blur(54px)',
        }}
      />

      <div className="w-full px-3.5 sm:px-6 lg:px-10 xl:px-16 relative z-10">
        {/* Header em Vidro — Idêntico ao padrão da Home (SobreSection) */}
        <div className="glass-crystal p-5 sm:p-8 lg:p-10 rounded-2xl sm:rounded-3xl mb-6 sm:mb-8 border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.85)]">
          <div className="flex flex-wrap items-center justify-between gap-2.5 mb-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-pill-red text-[11px] sm:text-xs font-mono text-[#ff073a] uppercase tracking-wider font-bold">
              <Layers className="w-3.5 h-3.5" />
              <span>SOLUÇÕES AVANÇADAS</span>
            </div>
            <span className="px-3 py-1 rounded-full glass-pill text-[10px] sm:text-xs font-mono text-zinc-300 uppercase tracking-wider">
              06 Frentes Operacionais
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            Serviços Oferecidos
          </h2>
          <p className="mt-1.5 text-sm sm:text-base font-mono text-[#ff073a] font-bold max-w-3xl leading-relaxed">
            Projetamos e executamos as melhores estratégias e soluções técnicas para o seu negócio.
          </p>
        </div>

        {/* Grid Responsiva de Serviços */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {SERVICES.map((service) => {
            const Icon = service.icon;
            return (
              <article
                key={service.id}
                className={`${
                  service.featured
                    ? 'glass-card-luxury border-[#ff073a]/50 shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_30px_rgba(255,7,58,0.18)]'
                    : 'glass-crystal glass-interactive border-white/10'
                } p-5 sm:p-7 rounded-2xl border flex flex-col justify-between touch-manipulation group`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-4 sm:mb-5">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl glass-pill-red flex items-center justify-center text-[#ff073a] shrink-0 group-hover:scale-105 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>

                    {service.badge ? (
                      <Badge variant="glow" dot className="text-[10px] font-mono shrink-0">
                        {service.badge}
                      </Badge>
                    ) : (
                      <span className="text-[11px] font-mono font-bold text-zinc-500 group-hover:text-[#ff073a] transition-colors">
                        {service.index}
                      </span>
                    )}
                  </div>

                  <h3
                    className={`text-base sm:text-xl font-black text-white leading-snug tracking-tight ${
                      service.featured
                        ? 'underline decoration-[#ff073a] decoration-2 underline-offset-4'
                        : 'group-hover:text-white'
                    }`}
                  >
                    {service.title}
                  </h3>

                  <p className="mt-2.5 text-xs sm:text-sm text-zinc-300/90 leading-relaxed font-light">
                    {service.description}
                  </p>
                </div>

                {/* Linha sutil especular na base */}
                <div className="mt-5 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-zinc-500 group-hover:text-zinc-300 transition-colors">
                  <span>{service.featured ? 'CORE ARCHITECTURE' : 'SOLUÇÃO ATIVA'}</span>
                  <span className="w-2 h-2 rounded-full bg-[#ff073a]/60 group-hover:bg-[#ff073a] group-hover:shadow-[0_0_8px_#ff073a] transition-all" />
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default ServicosSection;
