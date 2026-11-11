"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Cookie, Shield, Mail } from "lucide-react";
import { openCookiePreferences } from "@/lib/cookies";

export default function PoliticaPrivacidadePage() {
  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-16 text-neutral-200">
      {/* Navegação de Topo Simples */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-mono text-neutral-400 hover:text-white transition-colors group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
          <span>Voltar ao início</span>
        </Link>

        <div className="flex items-center gap-4 text-xs font-mono">
          <span className="text-white font-medium border-b border-red-500 pb-0.5">
            Privacidade
          </span>
          <Link
            href="/termos"
            className="text-neutral-400 hover:text-white transition-colors"
          >
            Termos de Uso
          </Link>
        </div>
      </div>

      {/* Cabeçalho Minimalista */}
      <header className="mb-10 space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          Política de Privacidade
        </h1>
        <p className="text-xs sm:text-sm font-mono text-neutral-400">
          Última atualização: Novembro de 2026
        </p>
      </header>

      {/* Conteúdo Jurídico Estruturado e Limpo */}
      <article className="space-y-8 text-sm leading-relaxed text-neutral-300">
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-semibold text-white tracking-tight">
            1. Visão Geral e Compromisso
          </h2>
          <p>
            Esta Política de Privacidade descreve como a plataforma Mateus Celestino Pro X
            coleta, utiliza, armazena e protege os dados dos usuários que acessam nossos
            serviços, em estrita conformidade com a Lei Geral de Proteção de Dados Pessoais
            (LGPD – Lei nº 13.709/2018) e o Marco Civil da Internet (Lei nº 12.965/2014).
          </p>
          <p>
            Nosso compromisso fundamental é a preservação da sua privacidade. Não vendemos,
            alugamos, permutamos ou comercializamos dados pessoais com terceiros ou redes de
            anúncios direcionados.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-semibold text-white tracking-tight">
            2. Informações Coletadas
          </h2>
          <p>Coletamos apenas as informações estritamente necessárias para a prestação e aprimoramento dos serviços:</p>
          <ul className="list-disc pl-5 space-y-2 text-neutral-300">
            <li>
              <strong className="text-white">Dados fornecidos voluntariamente:</strong> Nome,
              endereço de e-mail e mensagens quando você entra em contato conosco, se cadastra
              na plataforma ou participa de áreas restritas da comunidade.
            </li>
            <li>
              <strong className="text-white">Telemetria e dados técnicos anônimos:</strong>{" "}
              Informações como tipo de dispositivo, navegador, idioma e páginas visitadas,
              processadas de forma agregada e desprovidas de identificação direta.
            </li>
          </ul>
        </section>

        <section className="space-y-3 bg-white/[0.02] border border-white/5 rounded-2xl p-5 sm:p-6">
          <div className="flex items-center gap-2.5 text-white font-semibold">
            <Cookie className="w-5 h-5 text-red-500 shrink-0" />
            <h2 className="text-base sm:text-lg tracking-tight">
              3. Política de Cookies e Telemetria (Umami Analytics)
            </h2>
          </div>
          <p>
            Utilizamos tecnologias mínimas de armazenamento local e telemetria para garantir o
            correto funcionamento técnico da plataforma e mensurar o tráfego de maneira ética e
            anônima:
          </p>
          <div className="space-y-3 pt-2">
            <div>
              <h3 className="font-medium text-white text-xs uppercase font-mono tracking-wider">
                • Cookies Essenciais (Técnicos)
              </h3>
              <p className="text-xs text-neutral-400 mt-1">
                Utilizados para memorizar suas preferências essenciais (como a decisão de
                consentimento de cookies através do registro de cookie local com duração de 1
                ano) e manter sessões ativas quando você realiza login. Não requerem consentimento
                prévio por serem indispensáveis para a entrega do serviço solicitado.
              </p>
            </div>

            <div>
              <h3 className="font-medium text-white text-xs uppercase font-mono tracking-wider">
                • Telemetria Anônima com Umami Analytics
              </h3>
              <p className="text-xs text-neutral-400 mt-1">
                Adotamos o <strong className="text-neutral-200">Umami Analytics</strong> como
                nossa solução oficial de análise de audiência. O Umami é uma plataforma focada
                em privacidade que opera por padrão sem cookies de rastreamento invasivo (cookieless),
                sem coletar dados pessoais identificáveis (PII) e sem rastrear usuários entre
                diferentes sites. As métricas geradas são totalmente agregadas.
              </p>
            </div>
          </div>

          <div className="pt-3">
            <button
              type="button"
              onClick={openCookiePreferences}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono text-white bg-white/5 hover:bg-white/10 border border-white/10 hover:border-red-500/40 transition-colors"
            >
              <Shield className="w-3.5 h-3.5 text-red-500" />
              <span>Gerenciar preferências de cookies</span>
            </button>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-semibold text-white tracking-tight">
            4. Finalidade do Tratamento de Dados
          </h2>
          <p>Os dados tratados destinam-se exclusivamente às seguintes finalidades:</p>
          <ul className="list-disc pl-5 space-y-1.5 text-neutral-300">
            <li>Autenticação e controle de acesso a recursos e conteúdos restritos;</li>
            <li>Comunicação institucional e resposta a dúvidas ou solicitações enviadas;</li>
            <li>Monitoramento de performance, segurança contra ataques e estabilidade técnica;</li>
            <li>Cumprimento de obrigações legais e regulatórias cabíveis.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-semibold text-white tracking-tight">
            5. Compartilhamento de Dados
          </h2>
          <p>
            Não compartilhamos seus dados com terceiros, ressalvados os fornecedores de infraestrutura
            estritamente necessários para a hospedagem do site (como Vercel) e os casos exigidos por
            ordem judicial ou determinação de autoridade competente.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-semibold text-white tracking-tight">
            6. Segurança e Retenção
          </h2>
          <p>
            Adotamos medidas técnicas adequadas, como criptografia de tráfego HTTPS/TLS, controles
            de acesso e princípios de minimização de dados. Suas informações são retidas apenas
            pelo período necessário para cumprir as finalidades desta política ou pelo prazo exigido
            pela legislação aplicável.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-semibold text-white tracking-tight">
            7. Seus Direitos (LGPD – Art. 18)
          </h2>
          <p>
            Como titular dos dados, você pode a qualquer momento exercer seus direitos previstos no
            artigo 18 da LGPD, incluindo:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-neutral-300">
            <li>Confirmação da existência de tratamento;</li>
            <li>Acesso aos dados coletados;</li>
            <li>Correção de dados incompletos, inexatos ou desatualizados;</li>
            <li>Anonimização, bloqueio ou eliminação de dados desnecessários ou excessivos;</li>
            <li>Revogação do consentimento concedido.</li>
          </ul>
        </section>

        <section className="space-y-3 border-t border-white/10 pt-6">
          <h2 className="text-base sm:text-lg font-semibold text-white tracking-tight">
            8. Contato e Encarregado de Dados
          </h2>
          <p>
            Para esclarecer qualquer dúvida sobre esta Política de Privacidade ou para exercer seus
            direitos como titular de dados, entre em contato através do nosso canal oficial:
          </p>
          <div className="flex items-center gap-2 text-xs font-mono text-neutral-300">
            <Mail className="w-4 h-4 text-red-500" />
            <span>privacidade@business-os.demo</span>
          </div>
        </section>
      </article>
    </div>
  );
}
