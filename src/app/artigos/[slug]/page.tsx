import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  ArrowLeft,
  Clock,
  Calendar,
  Share2,
  Bookmark,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  getAllArticles,
  getArticleBySlug,
  getArticlesByCategory,
  Article,
} from "@/lib/articles";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const articles = getAllArticles();
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const article = getArticleBySlug(resolvedParams.slug);

  if (!article) {
    return {
      title: "Artigo Não Encontrado — Mateus Celestino Pro",
    };
  }

  return {
    title: `${article.title} — Mateus Celestino Pro`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: [
        {
          url: article.coverImage || "/assets/hero_cover.webp",
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
      type: "article",
      publishedTime: article.createdAt,
      authors: ["Mateus Celestino"],
    },
  };
}

export default async function ArtigoDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const article = getArticleBySlug(resolvedParams.slug);

  if (!article) {
    notFound();
  }

  // Artigos relacionados da mesma categoria (excluindo o atual)
  const relatedArticles = getArticlesByCategory(article.category)
    .filter((a) => a.slug !== article.slug)
    .slice(0, 3);

  const isAI = article.category.toUpperCase().includes("INTELIGÊNCIA ARTIFICIAL");
  const isTool = article.category.toUpperCase().includes("FERRAMENTAS");
  const isLinux = article.category.toUpperCase().includes("LINUX");

  return (
    <article className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-10">
      {/* Barra de Navegação Superior & Breadcrumb */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
        <Link href="/artigos">
          <Button
            variant="ghost"
            size="sm"
            className="text-neutral-400 hover:text-white gap-1.5 flex items-center"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar aos Artigos</span>
          </Button>
        </Link>

        <div className="flex items-center gap-2">
          <Badge
            variant={isAI ? "red" : isTool ? "gold" : isLinux ? "success" : "default"}
            dot
            className="text-xs"
          >
            {article.category}
          </Badge>
          <span className="text-neutral-600">•</span>
          <span className="text-xs font-mono text-neutral-400 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-red-500" />
            {article.readingTime || "5 min"}
          </span>
        </div>
      </div>

      {/* Hero do Artigo com Imagem e Título de Alto Impacto */}
      <header className="space-y-6">
        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
          {article.title}
        </h1>

        <p className="text-neutral-300 text-base sm:text-lg leading-relaxed font-normal">
          {article.excerpt}
        </p>

        {/* Metadados e Autor */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl glass-crystal border border-white/10">
          <div className="flex items-center gap-3">
            <img
              src="/assets/mateus_avatar.webp"
              alt="Mateus Celestino"
              className="w-12 h-12 rounded-full object-cover border-2 border-red-500/50 shadow-[0_0_15px_rgba(255,7,58,0.4)]"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm text-white">Mateus Celestino</span>
                <Badge variant="red" className="text-[9px] py-0 px-1.5">
                  AUTOR & ESPECIALISTA
                </Badge>
              </div>
              <p className="text-xs text-neutral-400">
                Especialista em Automação Digital & Marketing Open Source
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs text-neutral-400 font-mono">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-neutral-500" />
              <span>{article.createdAt}</span>
            </div>
          </div>
        </div>

        {/* Capa Cinemática em Vidro */}
        <div className="relative aspect-video w-full rounded-3xl overflow-hidden glass-crystal border border-white/15 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.9)]">
          <img
            src={article.coverImage || "/assets/recursos_cover.webp"}
            alt={article.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-transparent to-transparent opacity-80" />
        </div>
      </header>

      {/* Conteúdo Imersivo em Layout de Vidro */}
      <GlassCard
        variant="crystal"
        className="p-6 sm:p-10 lg:p-12 leading-relaxed text-neutral-200 text-base sm:text-lg border border-white/10 shadow-2xl relative"
      >
        <div
          className="prose-soberana space-y-6"
          dangerouslySetInnerHTML={{ __html: article.contentHtml }}
        />

        {/* Box de Assinatura do Autor */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center gap-6 bg-white/[0.02] p-6 rounded-2xl border border-white/5">
          <img
            src="/assets/mateus_profile.webp"
            alt="Mateus Celestino"
            className="w-20 h-20 rounded-2xl object-cover border border-red-500/40 shadow-lg"
          />
          <div className="space-y-2 text-center sm:text-left flex-1">
            <h4 className="font-bold text-white text-base">Escrito por Mateus Celestino</h4>
            <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed">
              Formado em Marketing Digital, especializado na construção de ecossistemas abertos
              (n8n, Baserow, Mautic, Typebot) e arquiteturas modernas com Shaders e Drizzle ORM.
            </p>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-1">
              <a
                href="https://api.whatsapp.com/send/?phone=553197724257&text=Olá+Mateus!+Li+seu+artigo+e+gostaria+de+conversar.&type=phone_number&app_absent=0"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-red-400 hover:text-red-300 font-semibold flex items-center gap-1"
              >
                <span>Falar no WhatsApp</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <span className="text-neutral-700">•</span>
              <a
                href="https://www.linkedin.com/in/mateus-celestino-0ba50626a/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-neutral-400 hover:text-white flex items-center gap-1"
              >
                <span>LinkedIn</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* CTA de Rodapé Imersivo */}
      <GlassCard variant="ultra" className="p-8 sm:p-10 text-center space-y-5">
        <Badge variant="red" dot>
          EXECUÇÃO PRÁTICA SOBERANA
        </Badge>
        <h3 className="text-xl sm:text-3xl font-extrabold text-white">
          Gostou deste artigo? Vá além da teoria.
        </h3>
        <p className="text-neutral-300 text-sm sm:text-base max-w-xl mx-auto">
          Acesse nossa Área de Membros para assistir tutoriais em vídeo, baixar blueprints prontos
          de n8n e interagir com outros especialistas.
        </p>
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <Link href="/comunidade">
            <Button variant="primary" size="md" className="gap-2">
              <Sparkles className="w-4 h-4" />
              <span>Acessar Comunidade PRO</span>
            </Button>
          </Link>
          <Link href="/#contato">
            <Button variant="outline" size="md">
              Solicitar Implementação Sob Medida
            </Button>
          </Link>
        </div>
      </GlassCard>

      {/* Artigos Recomendados */}
      {relatedArticles.length > 0 && (
        <section className="space-y-6 pt-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <span>Artigos Relacionados em {article.category}</span>
            </h3>
            <Link
              href="/artigos"
              className="text-xs text-red-400 hover:text-red-300 font-semibold flex items-center gap-1"
            >
              <span>Ver todos os 176</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedArticles.map((rel) => (
              <Link
                key={rel.id}
                href={`/artigos/${rel.slug}`}
                className="group block h-full focus:outline-none"
              >
                <GlassCard
                  variant="interactive"
                  className="h-full flex flex-col justify-between p-4 border border-white/10 group-hover:border-red-500/40"
                >
                  <div className="space-y-3">
                    <div className="relative aspect-video rounded-xl overflow-hidden bg-neutral-900">
                      <img
                        src={rel.coverImage || "/assets/recursos_cover.webp"}
                        alt={rel.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <h4 className="text-sm font-bold text-white group-hover:text-red-400 transition-colors line-clamp-2">
                      {rel.title}
                    </h4>
                    <p className="text-neutral-400 text-xs line-clamp-2">{rel.excerpt}</p>
                  </div>

                  <div className="pt-3 border-t border-white/10 mt-3 flex items-center justify-between text-[11px] text-neutral-400">
                    <span>{rel.readingTime || "5 min"}</span>
                    <span className="text-red-400 font-semibold flex items-center gap-1">
                      <span>Ler</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </GlassCard>
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
