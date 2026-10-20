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
import { constructMetadata } from "@/services/seo/metadata";
import { buildArticleSchema, buildBreadcrumbSchema, buildGraphSchema } from "@/services/seo/structured-data";
import { JsonLd } from "@/components/seo/JsonLd";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

// ISR Inteligente: Cache estático soberano regenerado a cada 24 horas no CDN Edge
export const revalidate = 86400;

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
    return constructMetadata({
      title: "Artigo Não Encontrado",
      description: "O artigo solicitado não foi localizado no acervo técnico.",
      noIndex: true,
    });
  }

  return constructMetadata({
    title: article.title,
    description: article.excerpt,
    path: `/artigos/${article.slug}`,
    ogType: "article",
    ogImage: article.coverImage || "/assets/hero_cover.webp",
    publishedTime: article.createdAt,
    section: article.category,
    keywords: [article.category, "Artigo Técnico", "Guia Passo a Passo"],
  });
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

  const articleSchema = buildGraphSchema([
    buildArticleSchema(article),
    buildBreadcrumbSchema([
      { name: "Artigos", url: "/artigos" },
      { name: article.title, url: `/artigos/${article.slug}` },
    ]),
  ]);

  return (
    <article className="min-h-screen py-6 sm:py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8 sm:space-y-10 overflow-hidden">
      {/* Schema.org TechArticle & Breadcrumbs para o Googlebot */}
      <JsonLd data={articleSchema} id="article-structured-data" />

      {/* Barra de Navegação Superior & Breadcrumb */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
        <Breadcrumbs
          items={[
            { name: "Artigos", url: "/artigos" },
            { name: article.title, url: `/artigos/${article.slug}` },
          ]}
        />

        <div className="flex items-center gap-2 shrink-0">
          <Badge
            variant={isAI ? "red" : isTool ? "gold" : isLinux ? "success" : "default"}
            dot
            className="text-xs max-w-[170px] sm:max-w-none truncate"
          >
            {article.category}
          </Badge>
          <span className="text-neutral-600">•</span>
          <span className="text-xs font-mono text-neutral-400 flex items-center gap-1 shrink-0">
            <Clock className="w-3.5 h-3.5 text-red-500" />
            <span>{article.readingTime || "5 min"}</span>
          </span>
        </div>
      </div>

      {/* Hero do Artigo com Imagem e Título de Alto Impacto */}
      <header className="space-y-5 sm:space-y-6">
        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight break-words">
          {article.title}
        </h1>

        <p className="text-neutral-300 text-sm sm:text-base md:text-lg leading-relaxed font-normal break-words">
          {article.excerpt}
        </p>

        {/* Metadados e Autor Adaptado ao Mobile */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl glass-crystal border border-white/10">
          <div className="flex items-center gap-3 min-w-0">
            <img
              src="/assets/mateus_avatar.webp"
              alt="Mateus Celestino"
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-red-500/50 shadow-[0_0_15px_rgba(255,7,58,0.4)] shrink-0"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-bold text-sm text-white">Mateus Celestino</span>
                <Badge variant="red" className="text-[9px] py-0 px-1.5 shrink-0">
                  AUTOR & ESPECIALISTA
                </Badge>
              </div>
              <p className="text-xs text-neutral-400 truncate">
                Especialista em Automação Digital & Marketing Open Source
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs text-neutral-400 font-mono shrink-0">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-neutral-500" />
              <span>{article.createdAt}</span>
            </div>
          </div>
        </div>

        {/* Capa Cinemática em Vidro */}
        <div className="relative aspect-[16/9] sm:aspect-video w-full rounded-2xl sm:rounded-3xl overflow-hidden glass-crystal border border-white/15 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.9)] shrink-0">
          <img
            src={article.coverImage || "/assets/recursos_cover.webp"}
            alt={article.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-transparent to-transparent opacity-80 pointer-events-none" />
        </div>
      </header>

      {/* Conteúdo Imersivo em Layout de Vidro com Proteção Total contra Quebra */}
      <GlassCard
        variant="crystal"
        className="p-4 sm:p-8 lg:p-12 leading-relaxed text-neutral-200 text-sm sm:text-base md:text-lg border border-white/10 shadow-2xl relative rounded-2xl sm:rounded-3xl overflow-hidden"
      >
        <div
          className="prose-soberana space-y-6 break-words max-w-none text-zinc-300 leading-relaxed [&_pre]:overflow-x-auto [&_pre]:p-4 [&_pre]:rounded-2xl [&_pre]:bg-black/80 [&_pre]:border [&_pre]:border-white/10 [&_pre]:text-xs [&_pre]:sm:text-sm [&_code]:break-words sm:[&_code]:break-normal [&_img]:rounded-2xl [&_img]:max-w-full [&_table]:w-full [&_table]:overflow-x-auto [&_table]:block"
          dangerouslySetInnerHTML={{ __html: article.contentHtml }}
        />

        {/* Box de Assinatura do Autor */}
        <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 bg-white/[0.02] p-4 sm:p-6 rounded-2xl border border-white/5">
          <img
            src="/assets/mateus_profile.webp"
            alt="Mateus Celestino"
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border border-red-500/40 shadow-lg shrink-0"
          />
          <div className="space-y-2 text-center sm:text-left flex-1 min-w-0">
            <h4 className="font-bold text-white text-base">Escrito por Mateus Celestino</h4>
            <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed">
              Formado em Marketing Digital, especializado na construção de ecossistemas abertos
              (n8n, Baserow, Mautic, Typebot) e arquiteturas modernas com Shaders e Drizzle ORM.
            </p>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-2">
              <a
                href="https://api.whatsapp.com/send/?phone=553197724257&text=Olá+Mateus!+Li+seu+artigo+e+gostaria+de+conversar.&type=phone_number&app_absent=0"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-red-400 hover:text-red-300 font-semibold flex items-center gap-1 min-h-[44px] px-2 touch-manipulation active:scale-95"
              >
                <span>Falar no WhatsApp</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <span className="text-neutral-700 hidden sm:inline">•</span>
              <a
                href="https://www.linkedin.com/in/mateus-celestino-0ba50626a/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-neutral-400 hover:text-white flex items-center gap-1 min-h-[44px] px-2 touch-manipulation active:scale-95"
              >
                <span>LinkedIn</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* CTA de Rodapé Imersivo */}
      <GlassCard variant="ultra" className="p-6 sm:p-10 text-center space-y-4 sm:space-y-5 rounded-2xl sm:rounded-3xl">
        <Badge variant="red" dot className="text-xs">
          EXECUÇÃO PRÁTICA SOBERANA
        </Badge>
        <h3 className="text-xl sm:text-3xl font-extrabold text-white break-words">
          Gostou deste artigo? Vá além da teoria.
        </h3>
        <p className="text-neutral-300 text-xs sm:text-sm md:text-base max-w-xl mx-auto leading-relaxed">
          Acesse nossa Área de Membros para assistir tutoriais em vídeo, baixar blueprints prontos
          de n8n e interagir com outros especialistas.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-stretch sm:items-center gap-3 pt-2">
          <Link href="/comunidade" className="w-full sm:w-auto">
            <Button variant="primary" size="md" className="w-full sm:w-auto min-h-[44px] gap-2 justify-center">
              <Sparkles className="w-4 h-4" />
              <span>Acessar Comunidade PRO</span>
            </Button>
          </Link>
          <Link href="/#contato" className="w-full sm:w-auto">
            <Button variant="outline" size="md" className="w-full sm:w-auto min-h-[44px] justify-center">
              Solicitar Implementação Sob Medida
            </Button>
          </Link>
        </div>
      </GlassCard>

      {/* Artigos Recomendados */}
      {relatedArticles.length > 0 && (
        <section className="space-y-5 sm:space-y-6 pt-4 sm:pt-6">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight flex items-center gap-2 truncate">
              <span>Artigos Relacionados em {article.category}</span>
            </h3>
            <Link
              href="/artigos"
              className="text-xs text-red-400 hover:text-red-300 font-semibold flex items-center gap-1 shrink-0 min-h-[44px] px-2"
            >
              <span>Ver todos os 176</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            {relatedArticles.map((rel) => (
              <Link
                key={rel.id}
                href={`/artigos/${rel.slug}`}
                className="group block h-full focus:outline-none touch-manipulation"
              >
                <GlassCard
                  variant="interactive"
                  className="h-full flex flex-col justify-between p-4 rounded-2xl border border-white/10 group-hover:border-red-500/40"
                >
                  <div className="space-y-3">
                    <div className="relative aspect-[16/10] sm:aspect-video rounded-xl overflow-hidden bg-neutral-900 shrink-0">
                      <img
                        src={rel.coverImage || "/assets/recursos_cover.webp"}
                        alt={rel.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <h4 className="text-sm font-bold text-white group-hover:text-red-400 transition-colors line-clamp-2 leading-snug break-words">
                      {rel.title}
                    </h4>
                    <p className="text-neutral-400 text-xs line-clamp-2 leading-relaxed break-words">{rel.excerpt}</p>
                  </div>

                  <div className="pt-3 border-t border-white/10 mt-3 flex items-center justify-between text-[11px] text-neutral-400">
                    <span className="font-mono">{rel.readingTime || "5 min"}</span>
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
