'use client';

import React, { useEffect, useState } from 'react';
import {
  MessageSquare,
  Mail,
  ExternalLink,
  Shield,
  Phone,
  Sparkles,
  Camera,
  Cpu,
  FileText,
  CheckCircle2,
  ArrowUpRight,
  Send,
} from 'lucide-react';
import LineWavesShader from '@/components/shaders/LineWavesShader';

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

export interface ContatoSectionProps {
  profile?: {
    whatsapp?: string;
    email?: string;
    whatsappNumber?: string;
    linkedin?: string;
    instagram?: string;
    photoPortfolio?: string;
    aiPortfolio?: string;
    curriculum?: string;
  };
}

const backgroundImages = [
  '/photografy-contato/l1.jpg',
  '/photografy-contato/l2.jpg',
  '/photografy-contato/l3.jpg',
  '/photografy-contato/l4.jpg',
  '/photografy-contato/l5.jpg',
];

export function ContatoSection({ profile }: ContatoSectionProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [quickName, setQuickName] = useState('');
  const [quickMessage, setQuickMessage] = useState('');

  // Background slider cycling a cada 4 segundos
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % backgroundImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const whatsappLink =
    profile?.whatsapp ||
    'https://api.whatsapp.com/send/?phone=553197724257&text=QUERO+AUTOMATIZAR+TUDO.&type=phone_number&app_absent=0';

  const email = profile?.email || 'CONTATO-SMARTFLOW@proton.me';
  const emailHref = email.startsWith('mailto:') ? email : `mailto:${email}`;
  const linkedinUrl = profile?.linkedin || 'https://www.linkedin.com/in/mateus-celestino-0ba50626a/';
  const instagramUrl = profile?.instagram || 'https://www.instagram.com/celestinoautomacao/';
  const photoPortfolioUrl = profile?.photoPortfolio || 'https://photografy-home.vercel.app/';
  const aiPortfolioUrl = profile?.aiPortfolio || 'https://visuals-visuals-home.vercel.app/';
  const curriculumUrl = profile?.curriculum || 'https://outros-c-v.vercel.app/';

  // Envio rápido pelo WhatsApp
  const handleQuickSend = (e: React.FormEvent) => {
    e.preventDefault();
    const text = `*MENSAGEM RÁPIDA VIA PORTAL*%0A%0A*Nome:* ${encodeURIComponent(quickName.trim() || 'Visitante do Portal')}%0A*Mensagem:* ${encodeURIComponent(quickMessage.trim() || 'Olá Mateus, gostaria de iniciar uma consultoria de automação!')}`;
    window.open(`https://api.whatsapp.com/send/?phone=553197724257&text=${text}&type=phone_number&app_absent=0`, '_blank');
  };

  return (
    <section
      id="contato"
      className="scroll-mt-28 py-8 sm:py-12 lg:py-16 min-h-[calc(100vh-4rem)] flex flex-col justify-center relative overflow-hidden w-full"
    >
      {/* =========================================================================
          0. BACKGROUND SLIDER DINÂMICO DE TELA CHEIA (ORIGINAL PHOTOGRAFY HUB)
          ========================================================================= */}
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-none select-none">
        {backgroundImages.map((src, index) => (
          <div
            key={src}
            className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
            }`}
            style={{
              backgroundImage: `url('${src}')`,
              transitionProperty: 'opacity, transform',
              transitionDuration: '1500ms',
            }}
          />
        ))}
      </div>

      {/* Overlays escuras cinematográficas com gradiente e vinheta profunda */}
      <div className="absolute inset-0 w-full h-full z-[1] pointer-events-none bg-gradient-to-b from-black/90 via-black/75 to-black/95" />
      <div className="absolute inset-0 w-full h-full z-[2] pointer-events-none shadow-[inset_0_0_120px_rgba(0,0,0,0.95)]" />

      {/* Shader WebGL LineWaves sutil em mix-blend para conferir a assinatura tecnológica */}
      <LineWavesShader
        className="z-[3] mix-blend-screen pointer-events-none opacity-30"
        color1="#ff073a"
        color2="#8a0012"
        color3="#3a0006"
        opacity={0.35}
        speed={0.2}
        warpIntensity={0.65}
      />

      {/* Halos de iluminação ambiente carmesim neon */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-red-600/15 rounded-full blur-[140px] pointer-events-none z-[4]" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-red-950/30 rounded-full blur-[140px] pointer-events-none z-[4]" />

      {/* =========================================================================
          CONTEÚDO PRINCIPAL: PÁGINA COMPLETA DE CONTATO // DIGITAL HUB OFICIAL
          ========================================================================= */}
      <div className="w-full max-w-5xl mx-auto px-3.5 sm:px-6 lg:px-8 relative z-10 flex-1 flex flex-col justify-center py-4 sm:py-8">
        
        {/* Box Soberano em Vidro Cristalino de Alta Fidelidade */}
        <div className="glass-crystal rounded-2xl sm:rounded-3xl lg:rounded-[2.5rem] p-5 sm:p-9 lg:p-12 w-full border border-white/15 shadow-[0_30px_90px_rgba(0,0,0,0.85),0_0_50px_rgba(255,7,58,0.15)] relative overflow-hidden">
          
          {/* Luz interna suave no box */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-gradient-to-b from-white/10 to-transparent pointer-events-none rounded-t-3xl" />

          {/* 1. Header do Perfil & Identidade */}
          <div className="flex flex-col items-center text-center relative z-10 mb-6 sm:mb-8">
            
            {/* Badge de Status Oficial Ativo */}
            <div className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-[10px] sm:text-[11px] font-mono text-emerald-400 font-semibold mb-4 sm:mb-6 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>CANAL OFICIAL ATIVO // ATENDIMENTO PRIORITÁRIO</span>
            </div>

            {/* Foto de Perfil com Anel de Vidro e Gradiente Carmesim */}
            <div className="mb-4 sm:mb-5 relative">
              <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full p-[2.5px] sm:p-[3px] bg-gradient-to-tr from-[#ff073a] via-white/40 to-white shadow-[0_0_35px_rgba(255,7,58,0.4)] relative overflow-hidden group">
                <img
                  src="/photografy-contato/kz.jpg"
                  alt="Mateus Celestino"
                  className="w-full h-full object-cover rounded-full transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://placehold.co/200x200/111/FFF?text=MC';
                  }}
                />
              </div>
              {/* Ponto de Status Online */}
              <span
                className="absolute bottom-1 right-1 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-emerald-500 border-2 border-black shadow-[0_0_12px_#10b981]"
                title="Online // Atendimento Direto Disponível"
              />
            </div>

            {/* Nome e Título da Marca */}
            <h1 className="text-lg sm:text-3xl font-light tracking-[0.2em] sm:tracking-[0.25em] uppercase text-white font-sans">
              MATEUS CELESTINO
            </h1>
            <div className="text-[11px] sm:text-sm font-mono tracking-[0.25em] sm:tracking-[0.35em] text-[#ff073a] font-bold mt-1 uppercase">
              DIGITAL HUB // CANAIS OFICIAIS & CONTATO DIRETO
            </div>

            <p className="mt-2.5 sm:mt-3 text-xs sm:text-sm text-zinc-300 font-light max-w-2xl leading-relaxed">
              Conecte-se diretamente com Mateus Celestino para projetos de automação empresarial, agentes autônomos de IA no WhatsApp, integrações n8n e infraestrutura soberana.
            </p>
          </div>

          {/* 2. Grade dos 4 Canais Oficiais com WHATSAPP SUPREMO DESTACADO */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 relative z-10 mb-6">
            
            {/* Canal 1: WhatsApp Oficial SUPREMO com Borda Carmesim & Glow */}
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-crystal glass-interactive p-4 sm:p-6 rounded-2xl sm:rounded-3xl flex items-start gap-3.5 sm:gap-4 group transition-all duration-300 border-2 border-[#ff073a]/60 bg-[#ff073a]/10 hover:border-[#ff073a] hover:bg-[#ff073a]/20 shadow-[0_0_35px_rgba(255,7,58,0.3)] relative overflow-hidden min-h-[80px]"
            >
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-[#ff073a]/25 border border-[#ff073a]/50 flex items-center justify-center text-[#ff073a] group-hover:scale-110 transition-transform shadow-lg shrink-0">
                <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-[10px] sm:text-[11px] font-mono text-[#ff073a] font-black uppercase tracking-wider">
                    WHATSAPP OFICIAL DIRETO
                  </span>
                  <span className="text-[9px] sm:text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/50 shrink-0">
                    &lt; 15 MIN
                  </span>
                </div>
                <div className="text-base sm:text-lg font-black text-white mt-0.5 group-hover:text-[#ff073a] transition-colors truncate">
                  +55 (31) 9772-4257
                </div>
                <p className="text-xs text-zinc-300 font-light mt-1 flex items-center gap-1 leading-relaxed">
                  <span className="truncate">Mensagem rápida: &ldquo;QUERO AUTOMATIZAR TUDO.&rdquo;</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#ff073a] group-hover:text-white transition-colors shrink-0" />
                </p>
              </div>
            </a>

            {/* Canal 2: E-mail Corporativo Proton */}
            <a
              href={emailHref}
              className="glass-crystal glass-interactive p-4 sm:p-6 rounded-2xl sm:rounded-3xl flex items-start gap-3.5 sm:gap-4 group transition-all duration-300 border border-white/10 hover:border-[#ff073a]/40 relative overflow-hidden min-h-[80px]"
            >
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl glass-pill flex items-center justify-center text-zinc-300 group-hover:text-[#ff073a] group-hover:scale-110 transition-transform shadow-lg shrink-0">
                <Mail className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-[10px] sm:text-[11px] font-mono text-zinc-400 font-bold uppercase tracking-wider">
                    E-MAIL CORPORATIVO
                  </span>
                  <span className="text-[9px] sm:text-[10px] font-mono font-bold text-zinc-300 bg-white/5 px-2 py-0.5 rounded-full border border-white/10 shrink-0">
                    CRIPTOGRAFADO
                  </span>
                </div>
                <div className="text-sm sm:text-base font-bold text-white mt-0.5 group-hover:text-[#ff073a] transition-colors truncate" title={email}>
                  {email}
                </div>
                <p className="text-xs text-zinc-400 font-light mt-1 flex items-center gap-1 leading-relaxed">
                  <span className="truncate">Proton Mail criptografado</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-white transition-colors shrink-0" />
                </p>
              </div>
            </a>

            {/* Canal 3: Instagram Oficial */}
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-crystal glass-interactive p-4 sm:p-6 rounded-2xl sm:rounded-3xl flex items-start gap-3.5 sm:gap-4 group transition-all duration-300 border border-white/10 hover:border-[#ff073a]/40 relative overflow-hidden min-h-[80px]"
            >
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl glass-pill flex items-center justify-center text-zinc-300 group-hover:text-[#ff073a] group-hover:scale-110 transition-transform shadow-lg shrink-0">
                <InstagramIcon className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-[10px] sm:text-[11px] font-mono text-zinc-400 font-bold uppercase tracking-wider">
                    INSTAGRAM OFICIAL
                  </span>
                  <span className="text-[9px] sm:text-[10px] font-mono font-bold text-zinc-400 bg-white/5 px-2 py-0.5 rounded-full border border-white/10 shrink-0">
                    CONTEÚDO & IA
                  </span>
                </div>
                <div className="text-base sm:text-lg font-bold text-white mt-0.5 group-hover:text-[#ff073a] transition-colors truncate">
                  @celestinoautomacao
                </div>
                <p className="text-xs text-zinc-400 font-light mt-1 flex items-center gap-1 leading-relaxed">
                  <span className="truncate">Bastidores e engenharia prática</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-white transition-colors shrink-0" />
                </p>
              </div>
            </a>

            {/* Canal 4: LinkedIn Executivo */}
            <a
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-crystal glass-interactive p-4 sm:p-6 rounded-2xl sm:rounded-3xl flex items-start gap-3.5 sm:gap-4 group transition-all duration-300 border border-white/10 hover:border-[#ff073a]/40 relative overflow-hidden min-h-[80px]"
            >
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl glass-pill flex items-center justify-center text-zinc-300 group-hover:text-[#ff073a] group-hover:scale-110 transition-transform shadow-lg shrink-0">
                <LinkedinIcon className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-[10px] sm:text-[11px] font-mono text-zinc-400 font-bold uppercase tracking-wider">
                    LINKEDIN PROFISSIONAL
                  </span>
                  <span className="text-[9px] sm:text-[10px] font-mono font-bold text-zinc-400 bg-white/5 px-2 py-0.5 rounded-full border border-white/10 shrink-0">
                    B2B & CONEXÕES
                  </span>
                </div>
                <div className="text-base sm:text-lg font-bold text-white mt-0.5 group-hover:text-[#ff073a] transition-colors truncate">
                  Mateus Celestino
                </div>
                <p className="text-xs text-zinc-400 font-light mt-1 flex items-center gap-1 leading-relaxed">
                  <span className="truncate">Conexões e parcerias corporativas</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-white transition-colors shrink-0" />
                </p>
              </div>
            </a>

          </div>

          {/* 2.5 Formulário Responsivo de Mensagem Rápida com Inputs >= 16px no mobile */}
          <div className="relative z-10 my-6 p-4 sm:p-6 rounded-2xl glass-card-nested border border-white/10">
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#ff073a]" />
                <h3 className="text-xs sm:text-sm font-bold text-white font-mono uppercase tracking-wider">
                  Envio Direto de Mensagem ao WhatsApp Oficial
                </h3>
              </div>
              <span className="text-[10px] font-mono text-zinc-400 hidden sm:inline">
                Abertura instantânea
              </span>
            </div>

            <form onSubmit={handleQuickSend} className="space-y-3">
              <div>
                <input
                  type="text"
                  placeholder="Seu Nome ou Empresa"
                  value={quickName}
                  onChange={(e) => setQuickName(e.target.value)}
                  className="glass-input w-full rounded-xl px-4 py-3 text-base sm:text-sm text-white placeholder:text-neutral-500 focus:border-[#ff073a] focus:outline-none transition-all min-h-[46px]"
                />
              </div>
              <div>
                <textarea
                  rows={2}
                  placeholder="Descreva resumidamente o que você precisa automatizar..."
                  value={quickMessage}
                  onChange={(e) => setQuickMessage(e.target.value)}
                  className="glass-input w-full rounded-xl px-4 py-3 text-base sm:text-sm text-white placeholder:text-neutral-500 focus:border-[#ff073a] focus:outline-none transition-all resize-none min-h-[76px]"
                />
              </div>
              <button
                type="submit"
                className="glass-button-fired w-full py-3.5 px-5 rounded-xl font-mono text-xs sm:text-sm font-bold text-white shadow-xl flex items-center justify-center gap-2 min-h-[48px] cursor-pointer hover:scale-[1.01] active:scale-[0.99] transition-transform"
              >
                <Send className="w-4 h-4" />
                <span>ENVIAR MENSAGEM NO WHATSAPP COM 1 CLIQUE</span>
              </button>
            </form>
          </div>

          {/* 3. Ecossistema de Portfólios & Hubs Complementares */}
          <div className="relative z-10 pt-4 pb-2 border-t border-white/10">
            <div className="text-[10px] sm:text-[11px] font-mono text-zinc-400 uppercase tracking-widest text-center mb-3 font-semibold">
              ECOSSISTEMA DE PORTFÓLIOS & HUB DE ATIVOS
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
              
              {/* Photo Portfolio */}
              <a
                href={photoPortfolioUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-interactive py-3 px-4 rounded-xl sm:rounded-2xl flex items-center justify-center gap-2 group transition-all text-xs font-mono text-zinc-300 hover:text-white min-h-[44px]"
              >
                <Camera className="w-4 h-4 text-[#ff073a]" />
                <span className="tracking-wider">PHOTO PORTFOLIO</span>
                <ArrowUpRight className="w-3 h-3 text-zinc-500 group-hover:text-white transition-colors" />
              </a>

              {/* AI Portfolio */}
              <a
                href={aiPortfolioUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-interactive py-3 px-4 rounded-xl sm:rounded-2xl flex items-center justify-center gap-2 group transition-all text-xs font-mono text-zinc-300 hover:text-white min-h-[44px]"
              >
                <Cpu className="w-4 h-4 text-[#ff073a]" />
                <span className="tracking-wider">AI PORTFOLIO</span>
                <ArrowUpRight className="w-3 h-3 text-zinc-500 group-hover:text-white transition-colors" />
              </a>

              {/* Curriculum Online */}
              <a
                href={curriculumUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-interactive py-3 px-4 rounded-xl sm:rounded-2xl flex items-center justify-center gap-2 group transition-all text-xs font-mono text-zinc-300 hover:text-white min-h-[44px]"
              >
                <FileText className="w-4 h-4 text-[#ff073a]" />
                <span className="tracking-wider">CURRICULUM ONLINE</span>
                <ArrowUpRight className="w-3 h-3 text-zinc-500 group-hover:text-white transition-colors" />
              </a>

            </div>
          </div>

          {/* 4. Botão Especial Master PRO // CTA de Alta Performance */}
          <div className="relative z-10 pt-4 pb-2">
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-button-fired w-full py-4 sm:py-5 px-5 sm:px-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left group cursor-pointer shadow-[0_15px_40px_rgba(255,7,58,0.35)] hover:scale-[1.01] active:scale-[0.99] transition-all min-h-[52px]"
            >
              <div className="flex items-center gap-3 sm:gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-black/40 border border-white/20 flex items-center justify-center text-white shrink-0 group-hover:rotate-6 transition-transform">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-bold tracking-[0.12em] sm:tracking-[0.15em] text-sm sm:text-base text-white uppercase">
                    MATEUS CELESTINO PRO
                  </div>
                  <div className="font-light tracking-wider sm:tracking-widest text-[10px] sm:text-xs text-white/80 font-mono">
                    (AUTOMATION & HIGH PERFORMANCE SERVICES) // INICIAR PROJETO
                  </div>
                </div>
              </div>
              <div className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-xs font-mono font-bold text-white shrink-0 min-h-[42px]">
                <span>QUERO AUTOMATIZAR TUDO</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </a>
          </div>

          {/* 5. Rodapé Institucional com Selos de Garantia e Confiabilidade */}
          <div className="relative z-10 pt-5 mt-4 border-t border-white/10 flex flex-wrap items-center justify-center sm:justify-between gap-2.5 sm:gap-3 text-[10px] sm:text-[11px] font-mono text-zinc-400">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/5">
              <Shield className="w-3.5 h-3.5 text-[#ff073a]" />
              <span>Sigilo & NDA Garantidos</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/5">
              <Sparkles className="w-3.5 h-3.5 text-[#ff073a]" />
              <span>Atendimento Pessoal Direto</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/5">
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>Brasil & Internacional</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default ContatoSection;
