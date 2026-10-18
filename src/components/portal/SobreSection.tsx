'use client';

import React from 'react';
import { User, Award, Shield, Cpu } from 'lucide-react';
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

      {/* Zonas de Transição Internas com Blur Óptico e Sombras Volumétricas Suaves */}
      <div className="absolute top-0 left-0 right-0 h-32 sm:h-44 bg-gradient-to-b from-[#030305] via-[#030305]/80 to-transparent pointer-events-none z-1" />
      <div className="absolute bottom-0 left-0 right-0 h-32 sm:h-44 bg-gradient-to-t from-[#030305] via-[#030305]/80 to-transparent pointer-events-none z-1" />

      {/* Halo óptico difuso central suave com blur cinematográfico */}
      <div
        className="absolute top-8 left-1/2 -translate-x-1/2 w-96 sm:w-[40rem] h-28 rounded-full pointer-events-none opacity-20 z-1"
        style={{
          background: 'radial-gradient(ellipse at center, #ff073a 0%, rgba(138,0,18,0.4) 40%, transparent 75%)',
          filter: 'blur(54px)',
        }}
      />

      <div className="w-full px-3.5 sm:px-6 lg:px-10 xl:px-16 relative z-10">

        {/* Header em Vidro Adaptado para Mobile */}
        <div className="glass-crystal p-5 sm:p-8 lg:p-10 rounded-2xl sm:rounded-3xl mb-8 sm:mb-12 border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.85)]">
          <div className="flex flex-wrap items-center justify-between gap-2.5 mb-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-pill-red text-[11px] sm:text-xs font-mono text-[#ff073a] uppercase tracking-wider font-bold">
              <User className="w-3.5 h-3.5" />
              <span>QUEM ESTÁ POR TRÁS</span>
            </div>
          </div>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            Sobre Mateus Celestino
          </h2>
          <p className="mt-1.5 text-sm sm:text-lg font-mono text-[#ff073a] font-bold">
            T.I. & Digital Marketing Automation Specialist
          </p>
        </div>

        {/* Grid Responsiva: 1 Coluna no Mobile / 12 Colunas no Desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          {/* Coluna Esquerda: Fotografia & Destaque em Vidro */}
          <div className="lg:col-span-5 w-full space-y-6">
            <div className="relative rounded-3xl overflow-hidden glass-crystal p-2.5 sm:p-3 max-w-sm sm:max-w-md mx-auto lg:max-w-none group shadow-2xl">
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-black border border-white/10 shadow-2xl">
                <img
                  src="/assets/sobre_mateus_photo.webp"
                  alt="Mateus Celestino"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl glass-crystal border border-[#ff073a]/40 shadow-xl">
                  <span className="block text-sm sm:text-base font-black text-white">Mateus Celestino</span>
                  <span className="block text-xs font-mono text-[#ff073a] font-semibold mt-0.5">Fundador & Arquiteto Chefe</span>
                </div>
              </div>
            </div>
          </div>

          {/* Coluna Direita: Narrativa & Pilares em Vidro */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8">
            <div className="glass-crystal p-5 sm:p-8 lg:p-9 rounded-2xl sm:rounded-3xl border border-white/10 shadow-xl">
              <h3 className="text-lg sm:text-2xl font-black text-white mb-4 sm:mb-6 tracking-tight leading-snug">
                A Intersecção Entre Tecnologia, Estratégia & Automação com IA
              </h3>

              <div className="space-y-3.5 sm:space-y-4 text-zinc-300 font-light text-xs sm:text-sm lg:text-base leading-relaxed">
                <p>
                  Sou formado em <strong className="text-white font-semibold">Marketing Digital</strong> por uma das principais faculdades do Brasil, com carreira construída unindo tecnologia, automação e estratégia de vendas.
                </p>
                <p>
                  Estudante de <strong className="text-[#ff073a] font-semibold">I.A. e Automação desde 2022</strong>, sou especialista em diversas ferramentas tradicionais e inovadoras, com mais de <strong className="text-white font-semibold">80 certificados de cursos livres</strong>, <strong className="text-white font-semibold">3 certificações</strong> e uma graduação e meia nas áreas de <strong className="text-white font-semibold">Digital Marketing e T.I. (Security)</strong>.
                </p>
                <p>
                  Com esse percurso, obtive um grande <strong className="text-white font-semibold">know-how</strong> dentro da área de automação, transformando demandas complexas em sistemas autônomos de alta confiabilidade.
                </p>
                <p className="border-l-2 border-[#ff073a] pl-3 sm:pl-4 italic text-zinc-200 glass-pill p-3 sm:p-3.5 rounded-r-2xl text-xs sm:text-sm">
                  &ldquo;Garanto resultados tangíveis, economia de tempo e resolução real de problemas, com o mínimo de atrito possível.&rdquo;
                </p>
              </div>
            </div>

            {/* 4 Pilares de Competência em Cartões de Vidro (Mobile-First 1 ou 2 colunas) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
              <div className="glass-crystal glass-interactive p-4 sm:p-5 rounded-2xl border border-white/10 touch-manipulation">
                <div className="w-8 h-8 rounded-xl glass-pill-red flex items-center justify-center text-[#ff073a] mb-2.5">
                  <Award className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-white leading-snug">Marketing digital && Automação trabalhando em sincronia.</h4>
                <p className="mt-1 text-xs text-zinc-400 leading-relaxed font-light">
                  Estratégias orientadas à conversão, retenção e funis de captação de clientes automatizados operando em perfeita sincronia.
                </p>
              </div>

              <div className="glass-crystal glass-interactive p-4 sm:p-5 rounded-2xl border border-white/10 touch-manipulation">
                <div className="w-8 h-8 rounded-xl glass-pill-red flex items-center justify-center text-[#ff073a] mb-2.5">
                  <Cpu className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-white leading-snug">Automação multi sistema.</h4>
                <p className="mt-1 text-xs text-zinc-400 leading-relaxed font-light">
                  Conexão de ponta a ponta com Webhooks, bancos relacionais, CRMs e ecossistemas inteligentes autônomos.
                </p>
              </div>

              <div className="glass-crystal glass-interactive p-4 sm:p-5 rounded-2xl border border-white/10 touch-manipulation">
                <div className="w-8 h-8 rounded-xl glass-pill-red flex items-center justify-center text-[#ff073a] mb-2.5">
                  <User className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-white leading-snug">Atendimento autônomo multi canal.</h4>
                <p className="mt-1 text-xs text-zinc-400 leading-relaxed font-light">
                  Chatbots e agentes inteligentes treinados com dados da empresa atendendo 24/7 em WhatsApp, Web e redes.
                </p>
              </div>

              <div className="glass-crystal glass-interactive p-4 sm:p-5 rounded-2xl border border-white/10 touch-manipulation">
                <div className="w-8 h-8 rounded-xl glass-pill-red flex items-center justify-center text-[#ff073a] mb-2.5">
                  <Shield className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-white leading-snug">Monitoramento real, resultado real, solução real.</h4>
                <p className="mt-1 text-xs text-zinc-400 leading-relaxed font-light">
                  Servidores blindados, Docker Swarm, telemetria contínua, alta estabilidade e resolução prática de gargalos.
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

export default SobreSection;
