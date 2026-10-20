import { ReactNode } from "react";
import { constructMetadata } from "@/services/seo/metadata";
import {
  buildBreadcrumbSchema,
  buildGraphSchema,
  canonicalUrl,
} from "@/services/seo/structured-data";
import {
  SITE_URL,
  SITE_NAME,
  AUTHOR_NAME,
  AUTHOR_EMAIL,
  AUTHOR_PHONE,
  AUTHOR_WHATSAPP,
  AUTHOR_LINKEDIN,
  AUTHOR_INSTAGRAM,
} from "@/constants/seo";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata = constructMetadata({
  title: "Contato Oficial — Consultoria & Ativação de Automações",
  description:
    "Entre em contato diretamente com Mateus Celestino via WhatsApp, ProtonMail ou envie sua proposta de projeto para desenvolvimento de agentes de IA e engenharia de software.",
  path: "/contato",
  keywords: [
    "Contato Mateus Celestino",
    "Consultoria de Automação",
    "Contratar Agentes de IA",
    "WhatsApp Mateus Celestino",
    "Projetos de Software",
  ],
});

export default function ContatoLayout({ children }: { children: ReactNode }) {
  const contactPageSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "@id": `${canonicalUrl("/contato")}#contactpage`,
    name: "Contato Oficial — Mateus Celestino Pro X",
    url: canonicalUrl("/contato"),
    description: "Canais oficiais de comunicação direta, WhatsApp e e-mail de Mateus Celestino.",
    mainEntity: {
      "@type": "Person",
      name: AUTHOR_NAME,
      email: AUTHOR_EMAIL,
      telephone: AUTHOR_PHONE,
      sameAs: [AUTHOR_LINKEDIN, AUTHOR_INSTAGRAM, AUTHOR_WHATSAPP],
    },
  };

  const breadcrumbs = buildBreadcrumbSchema([
    { name: "Contato", url: "/contato" },
  ]);

  const schema = buildGraphSchema([contactPageSchema, breadcrumbs]);

  return (
    <>
      <JsonLd data={schema} id="contato-structured-data" />
      {children}
    </>
  );
}
