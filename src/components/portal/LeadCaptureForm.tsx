"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Send,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Shield,
  Zap,
  Phone,
  Mail,
  User,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";

// Tipagem dos parâmetros capturados de tráfego pago
interface CapturedUTMs {
  utm_source: string;
  utm_campaign: string;
  utm_medium: string;
  utm_content: string;
  utm_term: string;
  fbclid: string;
  ttclid: string;
  referrer: string;
  detectedPlatform: "tiktok" | "meta" | "organic";
}

/**
 * Subcomponente interno para capturar com segurança os parâmetros de busca da URL
 */
function UTMTracker({ onCapture }: { onCapture: (utms: CapturedUTMs) => void }) {
  const searchParams = useSearchParams();

  useEffect(() => {
    const utm_source = searchParams?.get("utm_source") || "";
    const utm_campaign = searchParams?.get("utm_campaign") || "";
    const utm_medium = searchParams?.get("utm_medium") || "";
    const utm_content = searchParams?.get("utm_content") || "";
    const utm_term = searchParams?.get("utm_term") || "";
    const fbclid = searchParams?.get("fbclid") || "";
    const ttclid = searchParams?.get("ttclid") || "";
    const referrer = typeof document !== "undefined" ? document.referrer || "" : "";

    let detectedPlatform: "tiktok" | "meta" | "organic" = "organic";
    if (ttclid || utm_source.toLowerCase().includes("tiktok")) {
      detectedPlatform = "tiktok";
    } else if (
      fbclid ||
      utm_source.toLowerCase().includes("meta") ||
      utm_source.toLowerCase().includes("facebook") ||
      utm_source.toLowerCase().includes("instagram")
    ) {
      detectedPlatform = "meta";
    }

    onCapture({
      utm_source,
      utm_campaign,
      utm_medium,
      utm_content,
      utm_term,
      fbclid,
      ttclid,
      referrer,
      detectedPlatform,
    });
  }, [searchParams, onCapture]);

  return null;
}

export function LeadCaptureForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "Agentes de Atendimento WhatsApp",
    message: "",
  });

  const [utms, setUtms] = useState<CapturedUTMs>({
    utm_source: "",
    utm_campaign: "",
    utm_medium: "",
    utm_content: "",
    utm_term: "",
    fbclid: "",
    ttclid: "",
    referrer: "",
    detectedPlatform: "organic",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [createdLeadId, setCreatedLeadId] = useState<string | null>(null);

  // Formatação de máscara brasileira para WhatsApp
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "");
    if (val.length > 11) val = val.slice(0, 11);

    if (val.length > 6) {
      val = `(${val.slice(0, 2)}) ${val.slice(2, 7)}-${val.slice(7)}`;
    } else if (val.length > 2) {
      val = `(${val.slice(0, 2)}) ${val.slice(2)}`;
    }
    setFormData((prev) => ({ ...prev, phone: val }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus("idle");
    setErrorMessage("");

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          source: utms.detectedPlatform,
          utm_source: utms.utm_source,
          utm_campaign: utms.utm_campaign,
          utm_medium: utms.utm_medium,
          utm_content: utms.utm_content,
          metadata: {
            service: formData.service,
            message: formData.message,
            utm_term: utms.utm_term,
            fbclid: utms.fbclid,
            ttclid: utms.ttclid,
            referrer: utms.referrer,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Falha ao enviar formulário.");
      }

      setCreatedLeadId(data.leadId);
      setStatus("success");
    } catch (err: any) {
      console.error("Erro no formulário de lead:", err);
      setStatus("error");
      setErrorMessage(err.message || "Ocorreu um erro ao enviar. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Gerador de mensagem formatada para WhatsApp Comercial oficial
  const openWhatsAppDirect = () => {
    const text = `*SOLICITAÇÃO DE AUTOMAÇÃO — MATEUS CELESTINO PRO X*%0A%0A*Nome:* ${encodeURIComponent(
      formData.name
    )}%0A*Email:* ${encodeURIComponent(
      formData.email
    )}%0A*WhatsApp:* ${encodeURIComponent(
      formData.phone
    )}%0A*Interesse:* ${encodeURIComponent(
      formData.service
    )}%0A*Origem:* ${encodeURIComponent(
      utms.detectedPlatform.toUpperCase()
    )}%0A*Mensagem:* ${encodeURIComponent(
      formData.message || "Quero automatizar meus processos e escalar meu negócio."
    )}`;

    const url = `https://api.whatsapp.com/send/?phone=553197724257&text=${text}&type=phone_number&app_absent=0`;
    window.open(url, "_blank");
  };

  return (
    <section id="captura-leads" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full relative">
      {/* Capturador de UTMs em Suspense */}
      <Suspense fallback={null}>
        <UTMTracker onCapture={setUtms} />
      </Suspense>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        {/* Coluna da Esquerda: Autoridade e Canais Oficiais */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-pill-red text-xs font-mono text-[#ff073a] uppercase tracking-widest font-bold">
              <Zap className="w-3.5 h-3.5" />
              <span>CANAL DE TRÁFEGO DIRETO</span>
            </div>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              Vamos Automatizar Seu Negócio?
            </h2>
            <p className="text-xs sm:text-base text-neutral-300 font-light leading-relaxed">
              Solicite uma arquitetura personalizada com Mateus Celestino Pro. Da automação de atendimento
              com inteligência artificial até a blindagem completa de servidores corporativos.
            </p>
          </div>

          {/* Badge de Tráfego Detectado */}
          {utms.detectedPlatform !== "organic" && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-3">
              <Sparkles className="w-4 h-4 text-red-400 shrink-0" />
              <span className="text-xs font-mono text-neutral-200">
                Campanha Ativa:{" "}
                <strong className="text-red-400 uppercase">{utms.detectedPlatform} ADS</strong>
                {utms.utm_campaign && ` (${utms.utm_campaign})`}
              </span>
            </div>
          )}

          {/* Cards de Contato Rápido em Vidro com WhatsApp Destacado */}
          <div className="space-y-3.5 sm:space-y-4 pt-1 sm:pt-2">
            <a
              href="https://api.whatsapp.com/send/?phone=553197724257&text=QUERO%20AUTOMATIZAR%20TUDO"
              target="_blank"
              rel="noopener noreferrer"
              className="glass-crystal glass-interactive p-4 sm:p-5 rounded-2xl flex items-center gap-4 group transition-all border border-[#ff073a]/50 bg-[#ff073a]/10 hover:border-[#ff073a] hover:bg-[#ff073a]/20 shadow-[0_0_25px_rgba(255,7,58,0.25)] relative overflow-hidden min-h-[72px]"
            >
              <div className="w-12 h-12 rounded-xl bg-[#ff073a]/20 border border-[#ff073a]/40 flex items-center justify-center text-[#ff073a] group-hover:scale-105 group-hover:bg-[#ff073a]/30 transition-all shrink-0">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-[10px] font-mono text-[#ff073a] font-bold uppercase tracking-wider">
                    WHATSAPP COMERCIAL OFICIAL
                  </span>
                  <span className="text-[9px] font-mono font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/50 shrink-0">
                    &lt; 15 MIN
                  </span>
                </div>
                <div className="text-base font-bold text-white group-hover:text-[#ff073a] transition-colors">
                  +55 (11) 99999-0000
                </div>
                <p className="text-xs text-neutral-300 truncate">
                  Atendimento comercial Business OS Demo
                </p>
              </div>
            </a>

            <a
              href="mailto:contato@business-os.demo"
              className="glass-crystal glass-interactive p-4 sm:p-5 rounded-2xl flex items-center gap-4 group transition-all border border-white/10 hover:border-white/20 min-h-[72px]"
            >
              <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-neutral-300 group-hover:text-[#ff073a] transition-colors shrink-0">
                <Mail className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-neutral-400 font-bold uppercase tracking-wider">
                    E-MAIL CORPORATIVO
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 text-neutral-500 group-hover:text-white transition-colors" />
                </div>
                <div className="text-sm sm:text-base font-bold text-white group-hover:text-[#ff073a] transition-colors truncate">
                  contato@mateuscelestinopro.com
                </div>
                <p className="text-xs text-neutral-400 truncate">
                  Propostas, parcerias B2B e contratos de engenharia
                </p>
              </div>
            </a>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>Privacidade & Segurança Absoluta</span>
            </div>
            <p className="text-xs text-neutral-400 font-light leading-relaxed">
              Seus dados são armazenados na infraestrutura PostgreSQL com isolamento rigoroso
              e nunca serão compartilhados com terceiros.
            </p>
          </div>
        </div>

        {/* Coluna da Direita: Formulário de Alta Conversão com Inputs >= 16px no mobile */}
        <div className="lg:col-span-7">
          <GlassCard
            variant="luxury"
            glow
            className="p-5 sm:p-8 lg:p-10 rounded-2xl sm:rounded-3xl border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_40px_rgba(255,7,58,0.15)]"
          >
            {status === "success" ? (
              <div className="py-6 sm:py-8 text-center space-y-6 animate-in fade-in zoom-in-95 duration-300">
                <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl sm:text-3xl font-extrabold text-white">
                    Solicitação Registrada com Sucesso!
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-300 max-w-md mx-auto leading-relaxed">
                    Olá <strong className="text-white">{formData.name}</strong>, seus dados foram
                    recebidos com sucesso e nossa equipe técnica entrará em contato em menos de 2 horas.
                  </p>
                  {createdLeadId && (
                    <div className="text-[11px] font-mono text-neutral-500 pt-1">
                      Protocolo Soberano: <span className="text-neutral-300 font-semibold">{createdLeadId}</span>
                    </div>
                  )}
                </div>

                {/* Acelerador: Iniciar no WhatsApp Agora */}
                <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 w-full">
                  <Button
                    variant="fired"
                    size="lg"
                    onClick={openWhatsAppDirect}
                    className="w-full sm:w-auto min-h-[48px] gap-2 font-mono text-xs sm:text-sm font-bold uppercase"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Acelerar no WhatsApp Agora</span>
                  </Button>

                  <Button
                    variant="glass"
                    size="lg"
                    onClick={() => {
                      setStatus("idle");
                      setFormData({
                        name: "",
                        email: "",
                        phone: "",
                        service: "Agentes de Atendimento WhatsApp",
                        message: "",
                      });
                    }}
                    className="w-full sm:w-auto min-h-[48px] font-mono text-xs sm:text-sm font-bold"
                  >
                    Novo Envio
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                <div className="border-b border-white/10 pb-3 mb-2">
                  <h3 className="text-lg sm:text-xl font-bold text-white">
                    Formulário de Ativação Soberana
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1">
                    Preencha os campos abaixo para receber diagnóstico e proposta técnica personalizada.
                  </p>
                </div>

                {status === "error" && (
                  <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-3 text-red-400 text-xs">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Campo Nome com text-base no mobile (>=16px) para evitar auto-zoom */}
                <Input
                  label="Seu Nome Completo"
                  placeholder="Ex: Mateus Celestino"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  required
                  icon={<User className="w-4 h-4" />}
                  className="text-base sm:text-sm min-h-[48px]"
                />

                {/* Grid com Email e WhatsApp */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="E-mail Corporativo ou Pessoal"
                    type="email"
                    placeholder="voce@empresa.com"
                    value={formData.email}
                    onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                    required
                    icon={<Mail className="w-4 h-4" />}
                    className="text-base sm:text-sm min-h-[48px]"
                  />

                  <Input
                    label="WhatsApp / Telefone"
                    type="tel"
                    placeholder="(31) 99999-9999"
                    value={formData.phone}
                    onChange={handlePhoneChange}
                    required
                    icon={<Phone className="w-4 h-4" />}
                    className="text-base sm:text-sm min-h-[48px]"
                  />
                </div>

                {/* Dropdown de Serviços com text-base no mobile */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400">
                    Área Principal de Interesse
                  </label>
                  <select
                    value={formData.service}
                    onChange={(e) => setFormData((prev) => ({ ...prev, service: e.target.value }))}
                    className="glass-input w-full rounded-xl px-4 py-3 sm:py-3.5 text-base sm:text-sm text-white bg-neutral-900 border border-white/10 focus:border-[#ff073a] focus:outline-none transition-all cursor-pointer min-h-[48px]"
                  >
                    <option value="Agentes de Atendimento WhatsApp" className="bg-[#0a0a0c] text-white">
                      Agentes Autônomos de Atendimento WhatsApp (IA)
                    </option>
                    <option value="Hiperautomação de Processos com n8n" className="bg-[#0a0a0c] text-white">
                      Hiperautomação de Processos com n8n & Typebot
                    </option>
                    <option value="Formulários Cinemáticos & SaaS" className="bg-[#0a0a0c] text-white">
                      Construtor de Formulários Cinemáticos (Form Builder)
                    </option>
                    <option value="Área de Membros & Comunidade" className="bg-[#0a0a0c] text-white">
                      Área de Membros & Streaming de Vídeos Exclusivo
                    </option>
                    <option value="Infraestrutura de Servidores Linux & Docker" className="bg-[#0a0a0c] text-white">
                      Blindagem de Servidores Linux, VPS & Docker
                    </option>
                    <option value="Consultoria Geral em Engenharia de Software" className="bg-[#0a0a0c] text-white">
                      Consultoria Geral com Mateus Celestino Pro
                    </option>
                  </select>
                </div>

                {/* Mensagem Opcional com text-base no mobile */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400">
                    Mensagem ou Detalhes do Projeto (Opcional)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Conte resumidamente seu desafio atual ou objetivo de escala..."
                    value={formData.message}
                    onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
                    className="glass-input w-full rounded-xl px-4 py-3 text-base sm:text-sm text-white placeholder:text-neutral-500 focus:border-[#ff073a] focus:outline-none transition-all resize-none min-h-[96px]"
                  />
                </div>

                {/* Botão de Envio em Largura Total (w-full) com min-h de 50px */}
                <Button
                  type="submit"
                  variant="fired"
                  size="lg"
                  isLoading={isSubmitting}
                  className="w-full min-h-[50px] gap-2.5 font-mono text-xs sm:text-sm tracking-wider uppercase mt-3 sm:mt-4 shadow-[0_0_30px_rgba(255,7,58,0.4)] cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>SOLICITAR AUTOMAÇÃO SOBERANA</span>
                </Button>
              </form>
            )}
          </GlassCard>
        </div>
      </div>
    </section>
  );
}
