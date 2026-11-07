"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Mail } from "lucide-react";

export default function TermosDeUsoPage() {
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
          <Link
            href="/privacidade"
            className="text-neutral-400 hover:text-white transition-colors"
          >
            Privacidade
          </Link>
          <span className="text-white font-medium border-b border-red-500 pb-0.5">
            Termos de Uso
          </span>
        </div>
      </div>

      {/* Cabeçalho Minimalista */}
      <header className="mb-10 space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          Termos de Uso
        </h1>
        <p className="text-xs sm:text-sm font-mono text-neutral-400">
          Última atualização: Novembro de 2026
        </p>
      </header>

      {/* Conteúdo Jurídico Estruturado e Limpo */}
      <article className="space-y-8 text-sm leading-relaxed text-neutral-300">
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-semibold text-white tracking-tight">
            1. Aceitação dos Termos
          </h2>
          <p>
            Ao acessar, navegar ou utilizar qualquer serviço, recurso digital ou funcionalidade
            disponibilizada na plataforma Mateus Celestino Pro X, você expressa sua concordância
            integral e sem reservas com estes Termos de Uso. Caso discorde de qualquer disposição,
            solicitamos que não utilize a plataforma.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-semibold text-white tracking-tight">
            2. Descrição dos Serviços
          </h2>
          <p>
            A plataforma disponibiliza portal institucional, acervo técnico, vitrine de recursos,
            área de comunidade e ferramentas de engenharia de software e inteligência artificial.
            Buscamos manter os serviços continuamente operacionais, mas ressalvamos que manutenções
            técnicas, atualizações ou interrupções imprevisíveis de infraestrutura externa podem
            ocorrer.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-semibold text-white tracking-tight">
            3. Uso Adequado e Regras de Conduta
          </h2>
          <p>Ao utilizar os serviços, você se compromete a:</p>
          <ul className="list-disc pl-5 space-y-1.5 text-neutral-300">
            <li>Fornecer dados verídicos e manter a confidencialidade de suas credenciais de acesso;</li>
            <li>Não praticar atos ilícitos, fraudes ou tentativas de burlar mecanismos de autenticação;</li>
            <li>Não executar ataques de negação de serviço, injeção de código malicioso ou testes de intrusão não autorizados;</li>
            <li>Não realizar scraping automatizado abusivo que sobrecarregue a infraestrutura da plataforma.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-semibold text-white tracking-tight">
            4. Propriedade Intelectual e Licenciamento
          </h2>
          <p>
            Todos os direitos autorais, marcas, códigos-fonte, logotipos, designs, interfaces e
            conteúdos exibidos nesta plataforma pertencem a Mateus Celestino Pro X ou aos seus
            respectivos licenciantes, sendo protegidos pela legislação de propriedade intelectual
            vigente (Lei nº 9.609/1998 e Lei nº 9.610/1998).
          </p>
          <p>
            A disponibilização de recursos abertos ou de amostras de código concede exclusivamente
            uma licença de uso limitada nos moldes expressamente descritos em cada repositório ou
            recurso, sem implicar transferência de titularidade sobre a marca ou plataforma.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-semibold text-white tracking-tight">
            5. Serviços e Links de Terceiros
          </h2>
          <p>
            A plataforma pode conter links para serviços externos (como GitHub, Vercel, Stripe ou
            redes sociais). Não temos controle sobre as políticas, termos ou conteúdos de terceiros,
            cabendo ao usuário analisar os respectivos termos antes de utilizá-los.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-semibold text-white tracking-tight">
            6. Limitação de Responsabilidade
          </h2>
          <p>
            Na extensão máxima permitida pela legislação aplicável, os serviços são fornecidos no
            estado em que se encontram (“as is”). Não seremos responsáveis por danos indiretos, lucros
            cessantes, perda de dados ou indisponibilidades causadas por falhas na conexão do
            usuário ou fatores fora de nosso controle razoável.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-semibold text-white tracking-tight">
            7. Modificações dos Termos
          </h2>
          <p>
            Reservamo-nos o direito de revisar e atualizar estes Termos periodicamente. Qualquer
            alteração substancial entrará em vigor a partir da publicação da versão revisada nesta
            página. O uso continuado após a atualização implicará a concordância tácita com as novas
            condições.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-semibold text-white tracking-tight">
            8. Legislação Aplicável e Foro
          </h2>
          <p>
            Estes Termos são regidos e interpretados de acordo com as leis da República Federativa
            do Brasil, especialmente o Marco Civil da Internet (Lei nº 12.965/2014) e o Código de
            Defesa do Consumidor, quando aplicável. Fica eleito o foro da comarca de domicílio do
            usuário no Brasil para dirimir quaisquer controvérsias oriundas deste instrumento.
          </p>
        </section>

        <section className="space-y-3 border-t border-white/10 pt-6">
          <h2 className="text-base sm:text-lg font-semibold text-white tracking-tight">
            9. Dúvidas e Contato
          </h2>
          <p>
            Para esclarecimentos sobre estes Termos de Uso, entre em contato diretamente conosco:
          </p>
          <div className="flex items-center gap-2 text-xs font-mono text-neutral-300">
            <Mail className="w-4 h-4 text-red-500" />
            <span>mcp6667@proton.me</span>
          </div>
        </section>
      </article>
    </div>
  );
}
