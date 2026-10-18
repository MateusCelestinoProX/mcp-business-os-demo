'use client';

import React from 'react';
import { User, Award, CheckCircle, ExternalLink, Shield, Cpu } from 'lucide-react';
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
    <section id="sobre" className="py-24 relative overflow-hidden w-full">
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

        
        {/* Header em Vidro */}
        <div className="glass-crystal p-8 sm:p-10 rounded-3xl mb-14">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full glass-pill-red text-xs font-mono text-[#a80018] uppercase tracking-wider font-bold">
              <User className="w-3.5 h-3.5" />
              <span>QUEM ESTÁ POR TRÁS</span>
            </div>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Sobre Mateus Celestino
          </h2>
          <p className="mt-2 text-lg font-mono text-[#a80018] font-bold">
            T.I. & Digital Marketing Automation Specialist
          </p>
        </div>

        {/* 2 Colunas em Vidro */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Coluna Esquerda: Fotografia & Destaque em Vidro */}
          <div className="lg:col-span-5 space-y-6">
            <div className="relative rounded-3xl overflow-hidden glass-crystal p-3 group">
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-black border border-white/10 shadow-2xl">
                <img
                  src="/assets/sobre_mateus_photo.webp"
                  alt="Mateus Celestino"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-75" />
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl glass-crystal border border-[#ff073a]/40">
                  <span className="block text-sm font-black text-white">Mateus Celestino</span>
                  <span className="block text-xs font-mono text-[#ff073a] font-semibold">Fundador & Arquiteto Chefe</span>
                </div>
              </div>
            </div>
          </div>

          {/* Coluna Direita: Narrativa & Pilares em Vidro */}
          <div className="lg:col-span-7 space-y-8">
            <div className="glass-crystal p-6 sm:p-9 rounded-3xl">
              <h3 className="text-xl sm:text-2xl font-black text-white mb-6 tracking-tight">
                A Intersecção Entre Tecnologia, Estratégia & Automação com IA
              </h3>

              <div className="space-y-4 text-zinc-300 font-light text-base leading-relaxed">
                <p>
                  Sou formado em <strong className="text-white font-semibold">Marketing Digital</strong> por uma das principais faculdades do Brasil, com carreira construída unindo tecnologia, automação e estratégia de vendas.
                </p>
                <p>
                  Apaixonado por inovação desde cedo, especializei-me em <strong className="text-[#ff073a] font-semibold">T.I. e automação de processos empresariais com inteligência artificial</strong>, criando soluções que eliminam tarefas repetitivas e constroem esteiras de vendas autônomas.
                </p>
                <p>
                  Atuo como empreendedor digital focado em arquiteturas self-hosted, atendimento inteligente via WhatsApp sem fricção, e integração profunda de ferramentas modernas como <strong className="text-white font-semibold">n8n, Typebot, Baserow, Docker e LLMs</strong>.
                </p>
                <p className="border-l-2 border-[#ff073a] pl-4 italic text-zinc-300 glass-pill p-3 rounded-r-2xl">
                  &ldquo;Minha missão é transformar ideias em sistemas inteligentes que funcionam de forma autônoma 24/7, liberando seu tempo e energia para focar no crescimento estratégico do seu negócio.&rdquo;
                </p>
              </div>
            </div>

            {/* 4 Pilares de Competência em Cartões de Vidro */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="glass-crystal glass-interactive p-5 rounded-2xl">
                <div className="w-8 h-8 rounded-xl glass-pill-red flex items-center justify-center text-[#ff073a] mb-3">
                  <Award className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-white">Marketing Digital com Foco em ROI</h4>
                <p className="mt-1 text-xs text-zinc-400 leading-relaxed font-light">
                  Estratégias orientadas à conversão, retenção e funis de captação de clientes automatizados.
                </p>
              </div>

              <div className="glass-crystal glass-interactive p-5 rounded-2xl">
                <div className="w-8 h-8 rounded-xl glass-pill-red flex items-center justify-center text-[#ff073a] mb-3">
                  <Shield className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-white">Segurança Linux & Infraestrutura</h4>
                <p className="mt-1 text-xs text-zinc-400 leading-relaxed font-light">
                  Servidores blindados, Docker Swarm, proxy reverso seguro e independência de SaaS caros.
                </p>
              </div>

              <div className="glass-crystal glass-interactive p-5 rounded-2xl">
                <div className="w-8 h-8 rounded-xl glass-pill-red flex items-center justify-center text-[#ff073a] mb-3">
                  <User className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-white">Atendimento Autônomo WhatsApp</h4>
                <p className="mt-1 text-xs text-zinc-400 leading-relaxed font-light">
                  Chatbots e agentes inteligentes treinados com dados da empresa atendendo 24/7.
                </p>
              </div>

              <div className="glass-crystal glass-interactive p-5 rounded-2xl">
                <div className="w-8 h-8 rounded-xl glass-pill-red flex items-center justify-center text-[#ff073a] mb-3">
                  <Cpu className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-white">Integrações de APIs & Dados</h4>
                <p className="mt-1 text-xs text-zinc-400 leading-relaxed font-light">
                  Conexão de ponta a ponta com Webhooks, bancos relacionais e inteligência generativa.
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
