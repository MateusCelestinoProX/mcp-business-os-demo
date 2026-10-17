'use client';

import React, { useState } from 'react';
import { Mail, MessageSquare, ExternalLink, Send, CheckCircle2, Shield, Phone, Sparkles } from 'lucide-react';
import { PhotografyContactHub } from './PhotografyContactHub';

export interface ContatoSectionProps {
  profile?: {
    whatsapp?: string;
    email?: string;
    tallyForm?: string;
    whatsappNumber?: string;
  };
}

export function ContatoSection({ profile }: ContatoSectionProps) {
  const [viewMode, setViewMode] = useState<'hub' | 'form'>('hub');
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    whatsapp: '',
    mensagem: '',
    servico: 'Agentes de Atendimento WhatsApp'
  });
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Dispara persistência no backend soberano (/api/leads e /api/contact)
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.nome,
          email: formData.email,
          phone: formData.whatsapp,
          source: 'organic',
          metadata: {
            service: formData.servico,
            message: formData.mensagem,
            channel: 'portal_institucional'
          }
        })
      }).catch((err) => console.warn('Aviso ao sincronizar lead com /api/leads:', err));

      // Também sincroniza com /api/contact para manter 100% de compatibilidade
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      }).catch((err) => console.warn('Aviso ao sincronizar com /api/contact:', err));
    } catch (err) {
      console.warn('Erro ao disparar gravação:', err);
    }

    const text = `*NOVO CONTATO VIA SITE MATEUS CELESTINO PRO X*%0A%0A*Nome:* ${encodeURIComponent(formData.nome)}%0A*Email:* ${encodeURIComponent(formData.email)}%0A*WhatsApp:* ${encodeURIComponent(formData.whatsapp)}%0A*Interesse:* ${encodeURIComponent(formData.servico)}%0A*Mensagem:* ${encodeURIComponent(formData.mensagem)}`;
    const url = `https://api.whatsapp.com/send/?phone=553197724257&text=${text}&type=phone_number&app_absent=0`;
    
    if (typeof window !== 'undefined') {
      window.open(url, '_blank');
    }
    
    setSent(true);
    setSubmitting(false);
    setTimeout(() => setSent(false), 8000);
  };

  const whatsappLink =
    profile?.whatsapp ||
    'https://api.whatsapp.com/send/?phone=553197724257&text=QUERO+AUTOMATIZAR+TUDO.&type=phone_number&app_absent=0';

  const email = profile?.email || 'CONTATO-SMARTFLOW@proton.me';
  const tallyForm = profile?.tallyForm || 'https://tally.so/r/w2V6LL';

  return (
    <section id="contato" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header em Vidro Líquido com Seletor de Modo */}
        <div className="glass-crystal p-6 sm:p-8 rounded-3xl mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full glass-pill-red text-xs font-mono text-[#ff073a] uppercase tracking-wider mb-3 font-bold">
              <Mail className="w-3.5 h-3.5" />
              <span>CANAL DIRETO & CONTATO</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              {viewMode === 'hub' ? 'Digital Hub & Fotografia Contato' : 'Vamos Automatizar Seu Negócio?'}
            </h2>
            <p className="mt-2 text-sm text-zinc-300 font-light leading-relaxed max-w-2xl">
              {viewMode === 'hub'
                ? 'Acesse os canais exclusivos, portfólios fotográficos, inteligência artificial e serviços de automação de Mateus Celestino.'
                : 'Seja para implementar fluxos inteligentes com n8n, criar atendentes autônomos com IA ou blindar seus servidores Linux, entre em contato direto.'}
            </p>
          </div>

          {/* Seletor de visualização */}
          <div className="flex items-center p-1.5 rounded-2xl bg-black/60 border border-white/10 backdrop-blur-xl shrink-0 self-start md:self-center">
            <button
              type="button"
              onClick={() => setViewMode('hub')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                viewMode === 'hub'
                  ? 'bg-gradient-to-r from-[#9e0015] to-[#50000a] text-white shadow-[0_0_15px_rgba(158,0,21,0.6)] border border-red-500/40'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#ff073a]" />
              <span>HUB OFICIAL (PHOTOGRAFY)</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('form')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                viewMode === 'form'
                  ? 'bg-gradient-to-r from-[#9e0015] to-[#50000a] text-white shadow-[0_0_15px_rgba(158,0,21,0.6)] border border-red-500/40'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>FORMULÁRIO B2B</span>
            </button>
          </div>
        </div>

        {/* Conteúdo da Aba de Contato */}
        {viewMode === 'hub' ? (
          <div className="w-full flex flex-col items-center justify-center">
            <PhotografyContactHub isEmbedded={true} />

            {/* Atalho para alternar para o briefing */}
            <div className="mt-8 text-center">
              <button
                type="button"
                onClick={() => setViewMode('form')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl glass-crystal text-xs font-mono text-zinc-300 hover:text-white hover:border-[#ff073a]/50 transition-all cursor-pointer shadow-lg group"
              >
                <span>Prefere solicitar um orçamento detalhado ou briefing técnico?</span>
                <span className="text-[#ff073a] font-bold group-hover:underline flex items-center gap-1">
                  Abrir Formulário B2B <ExternalLink className="w-3 h-3" />
                </span>
              </button>
            </div>
          </div>
        ) : (
          /* 2 Colunas em Vidro */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Canais Oficiais em Cartões de Vidro */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* WhatsApp Card */}
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-crystal glass-interactive p-6 rounded-3xl flex items-start gap-4 block group"
            >
              <div className="w-12 h-12 rounded-2xl glass-pill-red flex items-center justify-center text-[#ff073a] shadow-lg shrink-0">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-[#ff073a] font-bold uppercase tracking-wider">WHATSAPP OFICIAL</span>
                  <ExternalLink className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" />
                </div>
                <h4 className="text-lg font-bold text-white mt-1 group-hover:text-[#ff073a] transition-all">
                  +55 (31) 9772-4257
                </h4>
                <p className="mt-1 text-xs text-zinc-400 font-light leading-relaxed">
                  Mensagem instantânea: &ldquo;QUERO AUTOMATIZAR TUDO.&rdquo; Atendimento rápido e prioritário.
                </p>
              </div>
            </a>

            {/* Email Proton Card */}
            <a
              href={`mailto:${email}`}
              className="glass-crystal glass-interactive p-6 rounded-3xl flex items-start gap-4 block group"
            >
              <div className="w-12 h-12 rounded-2xl glass-pill flex items-center justify-center text-zinc-300 group-hover:text-[#ff073a] shrink-0">
                <Mail className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-zinc-400 font-bold uppercase tracking-wider">E-MAIL CORPORATIVO</span>
                  <ExternalLink className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" />
                </div>
                <h4 className="text-base font-bold text-white mt-1 group-hover:text-[#ff073a] transition-all break-all">
                  {email}
                </h4>
                <p className="mt-1 text-xs text-zinc-400 font-light leading-relaxed">
                  Comunicação criptografada de ponta a ponta via Proton Mail para contratos confidenciais.
                </p>
              </div>
            </a>

            {/* Tally Form Card */}
            <a
              href={tallyForm}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-crystal glass-interactive p-6 rounded-3xl flex items-start gap-4 block group"
            >
              <div className="w-12 h-12 rounded-2xl glass-pill flex items-center justify-center text-zinc-300 group-hover:text-[#ff073a] shrink-0">
                <Shield className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-zinc-400 font-bold uppercase tracking-wider">FORMULÁRIO OFICIAL TALLY</span>
                  <ExternalLink className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" />
                </div>
                <h4 className="text-base font-bold text-white mt-1 group-hover:text-[#ff073a] transition-all">
                  Questionário de Diagnóstico
                </h4>
                <p className="mt-1 text-xs text-zinc-400 font-light leading-relaxed">
                  Preencha o briefing detalhado do seu projeto e receba uma análise de viabilidade técnica.
                </p>
              </div>
            </a>
          </div>

          {/* Formulário em Vidro Líquido */}
          <div className="lg:col-span-7">
            <div className="glass-crystal p-8 sm:p-9 rounded-3xl shadow-2xl relative">
              <h3 className="text-xl sm:text-2xl font-black text-white mb-2 tracking-tight">
                Envie Uma Proposta ou Dúvida
              </h3>
              <p className="text-xs font-mono text-zinc-400 mb-6">
                Preencha os campos abaixo para abrir um canal direto prioritário com Mateus Celestino.
              </p>

              {sent && (
                <div className="mb-6 p-4 rounded-2xl glass-pill-red text-white text-xs font-mono flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Mensagem preparada e enviada com sucesso para o WhatsApp!</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-zinc-400 uppercase tracking-wider mb-2 font-bold">
                      Seu Nome Completo
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Mateus Silva"
                      value={formData.nome}
                      onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl glass-input text-white text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-zinc-400 uppercase tracking-wider mb-2 font-bold">
                      Seu E-mail Profissional
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="Ex: contato@empresa.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl glass-input text-white text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-zinc-400 uppercase tracking-wider mb-2 font-bold">
                      WhatsApp com DDD
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="Ex: (31) 99999-9999"
                      value={formData.whatsapp}
                      onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl glass-input text-white text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-zinc-400 uppercase tracking-wider mb-2 font-bold">
                      Área de Interesse
                    </label>
                    <select
                      value={formData.servico}
                      onChange={(e) => setFormData({ ...formData, servico: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl glass-input text-white text-sm bg-black/80"
                    >
                      <option value="Agentes de Atendimento WhatsApp">Agentes de Atendimento WhatsApp</option>
                      <option value="Automação Empresarial n8n">Automação Empresarial n8n</option>
                      <option value="Infraestrutura Linux & Docker">Infraestrutura Linux & Docker</option>
                      <option value="Consultoria Estratégica Pro">Consultoria Estratégica Pro</option>
                      <option value="Acesso aos Packs de Automação">Acesso aos Packs de Automação</option>
                      <option value="Outro Projeto">Outro Projeto Customizado</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-400 uppercase tracking-wider mb-2 font-bold">
                    Descreva Brevemente o Seu Desafio ou Objetivo
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Conte sobre sua operação, processos que deseja automatizar ou dúvidas técnicas..."
                    value={formData.mensagem}
                    onChange={(e) => setFormData({ ...formData, mensagem: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl glass-input text-white text-sm resize-none"
                  />
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-400">
                    <Shield className="w-3.5 h-3.5 text-[#ff073a]" />
                    <span>Seus dados são confidenciais e nunca serão compartilhados.</span>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="glass-button-fired px-8 py-3.5 rounded-2xl text-xs font-mono font-bold text-white flex items-center justify-center gap-2.5 shadow-xl w-full sm:w-auto cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>{submitting ? 'ENVIANDO...' : 'ENVIAR PARA WHATSAPP'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>

        </div>
      )}

      </div>
    </section>
  );
}

export default ContatoSection;
