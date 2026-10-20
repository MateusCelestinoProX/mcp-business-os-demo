import { ReactNode } from "react";
import { constructMetadata } from "@/services/seo/metadata";
import {
  buildProductSchema,
  buildBreadcrumbSchema,
  buildGraphSchema,
} from "@/services/seo/structured-data";
import siteData from "@/data/siteData.json";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata = constructMetadata({
  title: "Loja Oficial — Produtos de Automação, Packs & Serviços de IA",
  description:
    "Adquira templates e workflows validados para Typebot, n8n, automações de marketing, curso I.A Pro e contrate desenvolvimento de agentes autônomos de IA sob medida.",
  path: "/shop",
  keywords: [
    "Comprar Pack Typebot",
    "Pack n8n Workflows",
    "Curso IA Pro",
    "Desenvolvimento Agentes IA",
    "Templates Make Integromat",
    "Automações Prontas",
    "Loja Mateus Celestino",
  ],
});

export default function ShopLayout({ children }: { children: ReactNode }) {
  const produtos = (siteData?.shop?.produtos || []).map((p: any) =>
    buildProductSchema({
      name: p.title,
      description: p.desc || p.details?.headline || "Solução de alta performance para automação digital.",
      image: p.cover,
      sku: p.id,
      url: `/shop#${p.id}`,
      category: "Software & Templates",
    })
  );

  const servicos = (siteData?.shop?.servicos || []).map((s: any) =>
    buildProductSchema({
      name: s.title,
      description: s.desc || s.details?.headline || "Serviço especializado de inteligência e automação.",
      image: s.cover,
      sku: s.id,
      url: `/shop#${s.id}`,
      category: "Serviços Especializados",
    })
  );

  const breadcrumbs = buildBreadcrumbSchema([
    { name: "Loja Oficial", url: "/shop" },
  ]);

  const shopSchema = buildGraphSchema([...produtos, ...servicos, breadcrumbs]);

  return (
    <>
      <JsonLd data={shopSchema} id="shop-structured-data" />
      {children}
    </>
  );
}
