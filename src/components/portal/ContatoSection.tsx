'use client';

import React, { useState } from 'react';
import {
  MessageSquare,
  Mail,
  ArrowUpRight,
  Copy,
  Check,
  Camera,
  Cpu,
  FileText,
} from 'lucide-react';

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
  </svg>
);

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
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

export function ContatoSection({ profile }: ContatoSectionProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const whatsappNumber = profile?.whatsappNumber || '+55 (31) 9772-4257';
  const whatsappLink =
    profile?.whatsapp ||
    'https://api.whatsapp.com/send/?phone=553197724257&text=QUERO+AUTOMATIZAR+TUDO.&type=phone_number&app_absent=0';

  const email = profile?.email || 'mcp6667@proton.me';
  const emailHref = email.startsWith('mailto:') ? email : `mailto:${email}`;
  const linkedinUrl = profile?.linkedin || 'https://www.linkedin.com/in/mateus-celestino-0ba50626a/';
  const instagramUrl = profile?.instagram || 'https://www.instagram.com/celestinoautomacao/';
  const photoPortfolioUrl = profile?.photoPortfolio || 'https://photografy-home.vercel.app/';
  const aiPortfolioUrl = profile?.aiPortfolio || 'https://visuals-visuals-home.vercel.app/';
  const curriculumUrl = profile?.curriculum || 'https://outros-c-v.vercel.app/';

  const handleCopy = async (text: string, field: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Falha ao copiar:', err);
    }
  };

  return (
    <section
      id="contato"
      className="scroll-mt-20 sm:scroll-mt-28 py-16 sm:py-24 relative overflow-hidden w-full flex flex-col justify-center bg-transparent"
    >
      {/* Sombra ambiente sutil para profundidade editorial limpa */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_70%_45%_at_50%_35%,rgba(255,7,58,0.035),transparent_70%)]" />

      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Container Minimalista Refinado */}
        <div className="rounded-2xl sm:rounded-3xl border border-white/[0.08] bg-[#07070a]/95 p-6 sm:p-10 md:p-12 relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
          
          {/* Linha superior de luz sutil */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

          {/* 1. Header Minimalista: Identidade Direta & Disponibilidade Real */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-8 border-b border-white/[0.06]">
            <div className="flex items-center gap-3.5">
              <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-full overflow-hidden border border-white/15 bg-black shrink-0">
                <img
                  src="/photografy-contato/kz.jpg"
                  alt="Mateus Celestino"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://placehold.co/100x100/111/FFF?text=MC';
                  }}
                />
              </div>
              <div>
                <h3 className="text-sm font-semibold tracking-wide text-white uppercase font-sans">
                  Mateus Celestino
                </h3>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                  <span className="text-xs font-mono text-zinc-400">
                    Disponível para novos projetos
                  </span>
                </div>
              </div>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white/[0.03] border border-white/[0.08] text-[11px] font-mono text-zinc-400 self-start sm:self-auto">
              <span>CANAL DIRETO OFICIAL</span>
            </div>
          </div>

          {/* 2. Proposta e Convite Direto */}
          <div className="mt-8 mb-8">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-light tracking-tight text-white font-sans">
              Entre em contato direto.
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-zinc-400 font-light max-w-xl leading-relaxed">
              Conecte-se para consultoria técnica, agentes autônomos de IA no WhatsApp, automações empresariais em n8n e infraestrutura de alta performance.
            </p>
          </div>

          {/* 3. Canais Principais: WhatsApp e E-mail (Cards Utilitários de Alto Padrão) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* WhatsApp */}
            <div className="rounded-xl border border-white/[0.08] hover:border-emerald-500/40 bg-white/[0.02] hover:bg-white/[0.03] p-5 sm:p-6 transition-all duration-200 flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-lg bg-emerald-950/40 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider font-semibold">
                    CANAL PRINCIPAL
                  </span>
                </div>

                <div className="mt-4">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 block">
                    WHATSAPP OFICIAL
                  </span>
                  <span className="text-base sm:text-lg font-mono font-medium text-white tracking-tight block mt-0.5">
                    {whatsappNumber}
                  </span>
                  <p className="text-xs text-zinc-400 font-light mt-1">
                    Atendimento ágil para decisões e novos projetos.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-5 pt-4 border-t border-white/[0.06]">
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-white/[0.06] hover:bg-emerald-600 text-white text-xs font-medium transition-colors"
                >
                  <span>Abrir WhatsApp</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
                <button
                  type="button"
                  onClick={(e) => handleCopy('+55 31 9772-4257', 'wpp', e)}
                  title="Copiar número de WhatsApp"
                  className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border border-white/[0.08] hover:bg-white/[0.06] text-xs font-mono text-zinc-300 transition-colors"
                >
                  {copiedField === 'wpp' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copiado</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-zinc-400" />
                      <span>Copiar</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* E-mail Corporativo */}
            <div className="rounded-xl border border-white/[0.08] hover:border-red-500/40 bg-white/[0.02] hover:bg-white/[0.03] p-5 sm:p-6 transition-all duration-200 flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-lg bg-red-950/40 border border-red-500/20 text-red-400 flex items-center justify-center">
                    <Mail className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
                    CRIPTOGRAFADO
                  </span>
                </div>

                <div className="mt-4">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 block">
                    E-MAIL
                  </span>
                  <span
                    className="text-base sm:text-lg font-mono font-medium text-white tracking-tight block mt-0.5 truncate"
                    title={email}
                  >
                    {email}
                  </span>
                  <p className="text-xs text-zinc-400 font-light mt-1 truncate">
                    Proton Mail com criptografia ponta a ponta.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-5 pt-4 border-t border-white/[0.06]">
                <a
                  href={emailHref}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-white/[0.06] hover:bg-red-600 text-white text-xs font-medium transition-colors"
                >
                  <span>Enviar e-mail</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
                <button
                  type="button"
                  onClick={(e) => handleCopy(email, 'email', e)}
                  title="Copiar endereço de e-mail"
                  className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border border-white/[0.08] hover:bg-white/[0.06] text-xs font-mono text-zinc-300 transition-colors"
                >
                  {copiedField === 'email' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copiado</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-zinc-400" />
                      <span>Copiar</span>
                    </>
                  )}
                </button>
              </div>
            </div>

          </div>

          {/* 4. Redes Profissionais (Minimalistas e Diretas) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
            
            {/* LinkedIn */}
            <a
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3.5 sm:p-4 rounded-xl border border-white/[0.08] hover:border-white/20 bg-white/[0.02] hover:bg-white/[0.04] transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <LinkedinIcon className="w-4 h-4 text-zinc-400 group-hover:text-white transition-colors shrink-0" />
                <div className="truncate">
                  <span className="text-[10px] text-zinc-400 uppercase font-mono block">
                    LINKEDIN
                  </span>
                  <span className="text-xs sm:text-sm font-medium text-white group-hover:text-zinc-200 transition-colors truncate block">
                    Mateus Celestino
                  </span>
                </div>
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
            </a>

            {/* Instagram */}
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3.5 sm:p-4 rounded-xl border border-white/[0.08] hover:border-white/20 bg-white/[0.02] hover:bg-white/[0.04] transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <InstagramIcon className="w-4 h-4 text-zinc-400 group-hover:text-white transition-colors shrink-0" />
                <div className="truncate">
                  <span className="text-[10px] text-zinc-400 uppercase font-mono block">
                    INSTAGRAM
                  </span>
                  <span className="text-xs sm:text-sm font-medium text-white group-hover:text-zinc-200 transition-colors truncate block">
                    @celestinoautomacao
                  </span>
                </div>
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
            </a>

          </div>

          {/* 5. Ecossistema de Ativos & Portfólios (Touch-Friendly Links) */}
          <div className="pt-6 mt-6 sm:mt-8 border-t border-white/[0.06] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs font-mono text-zinc-400">
            <span className="text-[11px] uppercase tracking-wider text-zinc-400">
              ACERVO & PORTFÓLIOS:
            </span>
            <div className="flex flex-wrap items-center gap-2 sm:gap-4">
              <a
                href={photoPortfolioUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 min-h-[44px] px-3.5 py-2 rounded-xl glass-crystal border border-white/10 hover:border-white/20 text-zinc-300 hover:text-white transition-all group touch-manipulation active:scale-95"
              >
                <Camera className="w-3.5 h-3.5 text-[#ff073a] group-hover:scale-110 transition-transform" />
                <span>Photo Portfolio</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-white" />
              </a>
              <a
                href={aiPortfolioUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 min-h-[44px] px-3.5 py-2 rounded-xl glass-crystal border border-white/10 hover:border-white/20 text-zinc-300 hover:text-white transition-all group touch-manipulation active:scale-95"
              >
                <Cpu className="w-3.5 h-3.5 text-[#ff073a] group-hover:scale-110 transition-transform" />
                <span>AI Portfolio</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-white" />
              </a>
              <a
                href={curriculumUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 min-h-[44px] px-3.5 py-2 rounded-xl glass-crystal border border-white/10 hover:border-white/20 text-zinc-300 hover:text-white transition-all group touch-manipulation active:scale-95"
              >
                <FileText className="w-3.5 h-3.5 text-[#ff073a] group-hover:scale-110 transition-transform" />
                <span>Currículo Online</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-white" />
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default ContatoSection;
