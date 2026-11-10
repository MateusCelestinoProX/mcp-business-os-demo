'use client';

import React from 'react';
import { Users, Globe } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

interface SquadMember {
  id: string;
  name: string;
  watermark: string;
  role: string;
  image: string;
  fallbackImage: string;
  titles: { text: string; primary?: boolean }[];
  bio: string;
  websiteUrl?: string;
  websiteLabel?: string;
  statusLabel?: string;
  linkedinUrl: string;
  linkedinAriaLabel: string;
}

const SQUAD_MEMBERS: SquadMember[] = [
  {
    id: 'mateus-celestino',
    name: 'Mateus Celestino',
    watermark: 'MATEUS CELESTINO PRO',
    role: 'FOUNDER',
    image: '/assets/squad_mateus.webp',
    fallbackImage: '/smartflow/mateus.png',
    titles: [
      { text: 'Professional Marketer', primary: true },
      { text: 'Sales & Automation Manager', primary: false },
    ],
    bio: 'Formado em Marketing Digital por uma das principais faculdades do Brasil, com carreira construída unindo tecnologia, automação e estratégia digital de vendas. Especialista certificado em Typebot, N8N, Mautic, Baserow e outras ferramentas open-source altamente robustas.',
    websiteUrl: 'https://mateus-celestino-pro.bullet.site/',
    websiteLabel: 'Website Oficial',
    linkedinUrl: 'https://www.linkedin.com/in/mateus-celestino/',
    linkedinAriaLabel: 'LinkedIn Mateus Celestino',
  },
  {
    id: 'odilon',
    name: 'Odilon',
    watermark: 'ODILON DEV',
    role: 'ENGINEER',
    image: '/assets/squad_odilon.webp',
    fallbackImage: '/smartflow/odilon.png',
    titles: [{ text: 'Front End & Backend Dev', primary: true }],
    bio: 'Desenvolvedor Fullstack com anos de estrada em linguagens de alta performance e frameworks modernos. Especialista em empilhar backends eficientes, gerenciar microsserviços e criar interfaces web elegantes com foco total em usabilidade do usuário.',
    statusLabel: 'Disponível para Projetos',
    linkedinUrl: 'https://www.linkedin.com/in/odilon-dev/',
    linkedinAriaLabel: 'LinkedIn Odilon',
  },
];

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 shrink-0" aria-hidden="true">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77Z" />
    </svg>
  );
}

export function SquadSection() {
  return (
    <section id="squad" className="pt-8 pb-16 sm:pt-12 sm:pb-20 relative overflow-hidden w-full">
      {/* Zonas de fusão: entrada suave e saída direta para o Blackout de Contato */}
      <div className="absolute top-0 left-0 right-0 h-10 sm:h-14 bg-gradient-to-b from-[#030305]/85 to-transparent pointer-events-none z-[1]" />
      <div className="absolute bottom-0 left-0 right-0 h-12 sm:h-16 bg-gradient-to-t from-[#000000] via-[#000000]/85 to-transparent pointer-events-none z-[1]" />

      {/* Halos ópticos carmesim difusos */}
      <div
        className="hidden sm:block absolute top-1/4 left-1/4 w-72 h-72 rounded-full pointer-events-none opacity-15 z-[1]"
        style={{
          background: 'radial-gradient(circle, #ff073a 0%, transparent 70%)',
          filter: 'blur(72px)',
        }}
      />
      <div
        className="hidden sm:block absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full pointer-events-none opacity-15 z-[1]"
        style={{
          background: 'radial-gradient(circle, #8a0012 0%, transparent 70%)',
          filter: 'blur(72px)',
        }}
      />

      <div className="w-full px-3.5 sm:px-6 lg:px-10 xl:px-16 relative z-10">
        {/* Header em Vidro — Idêntico ao padrão da Home (SobreSection) */}
        <div className="glass-crystal p-5 sm:p-8 lg:p-10 rounded-2xl sm:rounded-3xl mb-6 sm:mb-8 border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.85)]">
          <div className="flex flex-wrap items-center justify-between gap-2.5 mb-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-pill-red text-[11px] sm:text-xs font-mono text-[#ff073a] uppercase tracking-wider font-bold">
              <Users className="w-3.5 h-3.5" />
              <span>ENGENHARIA E ESTRATÉGIA</span>
            </div>
            <span className="px-3 py-1 rounded-full glass-pill text-[10px] sm:text-xs font-mono text-zinc-300 uppercase tracking-wider">
              Core Team • Fullstack &amp; Growth
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            Squad
          </h2>
          <p className="mt-1.5 text-sm sm:text-base font-mono text-[#ff073a] font-bold max-w-2xl leading-relaxed">
            Unindo alta estratégia comercial ao mais puro desenvolvimento fullstack.
          </p>
        </div>

        {/* Grid Simétrica de Membros em Vidro Cristalino */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-stretch">
          {SQUAD_MEMBERS.map((member) => (
            <article
              key={member.id}
              className="glass-crystal glass-interactive rounded-3xl p-4 sm:p-6 lg:p-7 border border-white/10 flex flex-col justify-between relative overflow-hidden group shadow-2xl"
            >
              {/* Brilho carmesim interno no canto superior direito */}
              <div
                className="absolute -top-16 -right-16 w-48 h-48 rounded-full pointer-events-none opacity-20 group-hover:opacity-40 transition-opacity duration-300"
                style={{
                  background: 'radial-gradient(circle, #ff073a 0%, transparent 70%)',
                  filter: 'blur(36px)',
                }}
                aria-hidden="true"
              />

              <div>
                {/* Frame de Fotografia com Enquadramento da Home */}
                <div className="relative aspect-[4/3] sm:aspect-[16/11] w-full rounded-2xl overflow-hidden bg-black border border-white/10 shadow-xl mb-5 sm:mb-6">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                    decoding="async"
                    onError={(e) => {
                      const img = e.currentTarget;
                      if (img.dataset.fallbackApplied) return;
                      img.dataset.fallbackApplied = '1';
                      img.src = member.fallbackImage;
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/20 opacity-90 pointer-events-none" />

                  <Badge
                    variant="glow"
                    className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 text-[10px] font-mono font-bold tracking-widest border-[#ff073a]/50"
                  >
                    {member.role}
                  </Badge>

                  {/* Watermark em Vidro Cristalino */}
                  <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 z-10 px-3.5 py-2.5 rounded-xl glass-crystal border border-[#ff073a]/35 shadow-xl flex items-center justify-between gap-2">
                    <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-white truncate">
                      {member.watermark}
                    </span>
                    <span className="w-2 h-2 rounded-full bg-[#ff073a] shadow-[0_0_8px_#ff073a] animate-pulse shrink-0" />
                  </div>
                </div>

                {/* Identidade & Bio */}
                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-tight">
                  {member.name}
                </h3>

                <div className="mt-1.5 flex flex-col gap-0.5">
                  {member.titles.map((title) => (
                    <span
                      key={title.text}
                      className={`text-xs font-mono uppercase tracking-wider ${
                        title.primary ? 'font-bold text-[#ff073a]' : 'text-zinc-300'
                      }`}
                    >
                      {title.text}
                    </span>
                  ))}
                </div>

                <p className="mt-3.5 text-xs sm:text-sm text-zinc-300 font-light leading-relaxed">
                  {member.bio}
                </p>
              </div>

              {/* Rodapé do Card com Ações Táteis (>=44px) */}
              <div className="mt-6 pt-4 sm:pt-5 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
                {member.websiteUrl ? (
                  <a
                    href={member.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-h-[44px] inline-flex items-center gap-2 px-3.5 py-2 rounded-xl glass-pill-red text-xs font-mono font-semibold text-white hover:border-[#ff073a] hover:shadow-[0_0_20px_rgba(255,7,58,0.3)] transition-all touch-manipulation"
                  >
                    <Globe className="w-4 h-4 text-[#ff073a] shrink-0" />
                    <span>{member.websiteLabel || 'Website Oficial'}</span>
                  </a>
                ) : (
                  <span className="min-h-[44px] inline-flex items-center gap-2 px-3.5 py-2 rounded-xl glass-pill text-xs font-mono text-zinc-300">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse shrink-0" />
                    <span>{member.statusLabel}</span>
                  </span>
                )}

                <a
                  href={member.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={member.linkedinAriaLabel}
                  className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl glass-pill border border-white/10 hover:border-[#ff073a]/60 text-zinc-200 hover:text-white text-xs font-mono font-semibold transition-all touch-manipulation"
                >
                  <LinkedInIcon />
                  <span>LinkedIn</span>
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default SquadSection;
