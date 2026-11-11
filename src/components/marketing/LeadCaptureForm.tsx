"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Send,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  PhoneCall,
  Flame,
  ArrowRight,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";

interface FormData {
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
}

const SERVICES_LIST = [
  "Automação Inteligente de Processos (n8n & IA)",
  "Form Builder Cinemático & Workflows",
  "Área de Membros & Ecossistema de Infoproduto",
  "Infraestrutura Aberta (Mautic, Baserow, Docker)",
  "Consultoria Soberana & Branding Visual",
];

function LeadCaptureFormInternal() {
  const searchParams = useSearchParams();

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    service: SERVICES_LIST[0],
    message: "",
  });

  const [utmParams, setUtmParams] = useState({
    utm_source: "",
    utm_campaign: "",
    utm_medium: "",
    utm_content: "",
    source: "organic",
  });

  const [trafficChannel, setTrafficChannel] = useState<{
    label: string;
    variant: "red" | "gold" | "success" | "default";
    icon: string;
  }>({
    label: "Canal Direto / Soberano",
    variant: "default",
    icon: "🚀",
  });

  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [leadResultId, setLeadResultId] = useState("");

  // Captura e detecção de tráfego pago na montagem
  useEffect(() => {
    if (!searchParams) return;

    const utm_source = searchParams.get("utm_source") || "";
    const utm_campaign = searchParams.get("utm_campaign") || "";
    const utm_medium = searchParams.get("utm_medium") || "";
    const utm_content = searchParams.get("utm_content") || "";
    const ttclid = searchParams.get("ttclid");
    const fbclid = searchParams.get("fbclid");

    let source = "organic";
    if (ttclid || utm_source.toLowerCase().includes("tiktok")) {
      source = "tiktok";
      setTrafficChannel({
        label: "Tráfego Especializado: TikTok Ads",
        variant: "red",
        icon: "⚡",
      });
    } else if (
      fbclid ||
      utm_source.toLowerCase().includes("meta") ||
      utm_source.toLowerCase().includes("facebook") ||
      utm_source.toLowerCase().includes("instagram")
    ) {
      source = "meta";
      setTrafficChannel({
        label: "Tráfego Qualificado: Meta Ads",
        variant: "gold",
        icon: "🎯",
      });
    } else if (utm_source) {
      source = utm_source;
      setTrafficChannel({
        label: `Campanha Externa: ${utm_source.toUpperCase()}`,
        variant: "success",
        icon: "🔥",
      });
    }

    setUtmParams({
      utm_source,
      utm_campaign,
      utm_medium,
      utm_content,
      source,
    });
  }, [searchParams]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        service: formData.service,
        message: formData.message,
        source: utmParams.source,
        utm_source: utmParams.utm_source,
        utm_campaign: utmParams.utm_campaign,
        utm_medium: utmParams.utm_medium,
        utm_content: utmParams.utm_content,
        metadata: {
          submittedUrl: typeof window !== "undefined" ? window.location.href : "",
          screenResolution:
            typeof window !== "undefined"
              ? `${window.innerWidth}x${window.innerHeight}`
              : "unknown",
        },
      };

      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Erro ao registrar suas informações.");
      }

      setLeadResultId(data.leadId || "");
      setStatus("success");
    } catch (err: any) {
      console.error("Erro ao enviar lead:", err);
      setErrorMessage(
        err.message || "Não foi possível enviar suas informações no momento. Tente novamente."
      );
      setStatus("error");
    }
  };

  return (
    <GlassCard variant="ultra" className="w-full max-w-2xl mx-auto shadow-2xl relative">
      {/* Detecção Visual de Tráfego */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-white/10 mb-6">
        <div className="flex items-center gap-2">
          <Badge variant={trafficChannel.variant} dot>
            {trafficChannel.icon} {trafficChannel.label}
          </Badge>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-neutral-400 font-mono">
          <ShieldCheck className="w-3.5 h-3.5 text-red-500" />
          <span>Atendimento Direto Mateus Celestino</span>
        </div>
      </div>

      {status === "success" ? (
        <div className="text-center py-8 space-y-6 animate-in fade-in zoom-in-95 duration-300">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 mx-auto flex items-center justify-center text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-white tracking-tight">
              Solicitação Registrada com Sucesso!
            </h3>
            <p className="text-neutral-300 text-sm max-w-md mx-auto">
              Recebemos seu briefing com prioridade máxima. Nossa equipe técnica analisará seus
              requisitos em poucos minutos.
            </p>
            {leadResultId && (
              <p className="text-[11px] font-mono text-neutral-500">
                Protocolo Soberano: {leadResultId}
              </p>
            )}
          </div>

          <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center items-center">
            <a
              href="/contato"
              className="w-full sm:w-auto"
            >
              <Button variant="primary" size="lg" className="w-full gap-2 shadow-xl">
                <PhoneCall className="w-4 h-4" />
                <span>Prosseguir para Atendimento</span>
              </Button>
            </a>

            <Button
              variant="outline"
              size="lg"
              onClick={() => {
                setStatus("idle");
                setFormData({
                  name: "",
                  email: "",
                  phone: "",
                  service: SERVICES_LIST[0],
                  message: "",
                });
              }}
              className="w-full sm:w-auto"
            >
              Enviar Outro Projeto
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1">
            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <span>Construa seu Próximo Software de Elite</span>
              <Sparkles className="w-5 h-5 text-red-500 animate-pulse" />
            </h3>
            <p className="text-neutral-400 text-xs sm:text-sm">
              Preencha o formulário abaixo para receber um diagnóstico técnico e plano de
              implementação personalizado.
            </p>
          </div>

          {status === "error" && (
            <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs flex items-center gap-2.5 animate-in shake duration-200">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Nome Completo"
              name="name"
              placeholder="Ex: Alexandre Silveira"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={status === "submitting"}
            />

            <Input
              label="E-mail Profissional"
              name="email"
              type="email"
              placeholder="seuemail@empresa.com"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={status === "submitting"}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="WhatsApp com DDD"
              name="phone"
              type="tel"
              placeholder="(31) 99999-9999"
              value={formData.phone}
              onChange={handleChange}
              required
              disabled={status === "submitting"}
            />

            <div className="w-full space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400">
                Solução Desejada
              </label>
              <select
                name="service"
                value={formData.service}
                onChange={handleChange}
                disabled={status === "submitting"}
                className="glass-input w-full rounded-xl px-4 py-3 text-sm focus:outline-none transition-all cursor-pointer bg-[#0c0c12] text-white border border-white/10"
              >
                {SERVICES_LIST.map((srv) => (
                  <option key={srv} value={srv} className="bg-[#121218] text-white">
                    {srv}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400">
              Briefing do Projeto ou Desafio Atual
            </label>
            <textarea
              name="message"
              rows={3}
              placeholder="Conte brevemente sobre o fluxo que deseja automatizar ou a plataforma que deseja construir..."
              value={formData.message}
              onChange={handleChange}
              disabled={status === "submitting"}
              className="glass-input w-full rounded-xl px-4 py-3 text-sm focus:outline-none transition-all placeholder:text-neutral-500 resize-none"
            />
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full gap-2 shadow-2xl relative overflow-hidden group"
              isLoading={status === "submitting"}
            >
              <Zap className="w-4 h-4 text-yellow-300" />
              <span className="font-bold tracking-wide">
                Solicitar Diagnóstico & Iniciar Projeto
              </span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          <p className="text-[11px] text-center text-neutral-500 pt-1">
            Seus dados estão protegidos por criptografia de ponta a ponta. Sem spam.
          </p>
        </form>
      )}
    </GlassCard>
  );
}

export function LeadCaptureForm() {
  return (
    <Suspense
      fallback={
        <GlassCard variant="ultra" className="w-full max-w-2xl mx-auto p-12 text-center">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-white/10 rounded w-1/2 mx-auto"></div>
            <div className="h-4 bg-white/5 rounded w-3/4 mx-auto"></div>
            <div className="h-10 bg-white/10 rounded w-full"></div>
          </div>
        </GlassCard>
      }
    >
      <LeadCaptureFormInternal />
    </Suspense>
  );
}

export default LeadCaptureForm;
