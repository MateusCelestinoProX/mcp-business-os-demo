'use client';

import React from 'react';
import { User, Award, CheckCircle, ExternalLink, MessageSquare, Mail, Shield, Cpu } from 'lucide-react';
import GridScanShader from '@/components/shaders/GridScanShader';

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
  </svg>
);

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

export interface SobreSectionProps {
  profile?: {
    whatsapp?: string;
    email?: string;
    linkedin?: string;
    instagram?: string;
  };
}

export function SobreSection({ profile }: SobreSectionProps) {
  const socialLinks = [
    { label: 'LinkedIn', href: profile?.linkedin || 'https://www.linkedin.com/in/mateus-celestino-0ba50626a/', icon: LinkedinIcon },
    { label: 'Instagram', href: profile?.instagram || 'https://www.instagram.com/celestinoautomacao/', icon: InstagramIcon },
    { label: 'Email Proton', href: `mailto:${profile?.email || 'CONTATO-SMARTFLOW@proton.me'}`, icon: Mail },
    { label: 'WhatsApp', href: profile?.whatsapp || 'https://api.whatsapp.com/send/?phone=553197724257&text=QUERO+AUTOMATIZAR+TUDO.&type=phone_number&app_absent=0', icon: MessageSquare },
  ];

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
          
          {/* Coluna Esquerda: Fotografia & Redes em Vidro */}
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

            {/* Quick Links Card em Vidro */}
            <div className="glass-crystal p-6 rounded-3xl">
              <h4 className="text-xs font-mono text-zinc-400 uppercase tracking-widest mb-4 font-bold">
                Redes & Canais Oficiais
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {socialLinks.map((s, idx) => {
                  const Icon = s.icon;
                  return (
                    <a
                      key={idx}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="glass-interactive flex items-center gap-2.5 p-3 rounded-2xl text-xs font-mono text-zinc-300 hover:text-white transition-all group"
                    >
                      <Icon className="w-4 h-4 text-[#ff073a]" />
                      <span className="truncate">{s.label}</span>
                    </a>
                  );
                })}
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
