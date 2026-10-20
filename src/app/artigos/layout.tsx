import { ReactNode } from "react";
import { constructMetadata } from "@/services/seo/metadata";
import { buildItemListSchema, buildBreadcrumbSchema, buildGraphSchema } from "@/services/seo/structured-data";
import { getAllArticles } from "@/lib/articles";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata = constructMetadata({
  title: "Acervo de Artigos Técnicos & Guias de IA e Automação",
  description: "Explore mais de 170 artigos e tutoriais aprofundados sobre Inteligência Artificial, Agentes Autônomos, n8n, Typebot, Linux e Engenharia de Software.",
  path: "/artigos",
  keywords: [
    "Artigos Inteligência Artificial",
    "Tutoriais n8n",
    "Tutoriais Typebot",
    "Agentes Autônomos de IA",
    "Engenharia de Prompt",
    "Automação Comercial",
    "Linux Avançado",
  ],
});

export default function ArtigosLayout({ children }: { children: ReactNode }) {
  const articles = getAllArticles().slice(0, 30);
  const items = articles.map((a) => ({
    name: a.title,
    url: `/artigos/${a.slug}`,
    image: a.coverImage,
  }));

  const schema = buildGraphSchema([
    buildItemListSchema(items, "Acervo Editorial Técnico — Mateus Celestino Pro X"),
    buildBreadcrumbSchema([{ name: "Artigos", url: "/artigos" }]),
  ]);

  return (
    <>
      <JsonLd data={schema} id="artigos-index-schema" />
      {children}
    </>
  );
}
