import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Termos de Uso Soberanos | Mateus Celestino Pro X",
  description:
    "Condições gerais de uso, licenciamento de código-fonte de alta performance, regras de acesso à comunidade restrita, proteção de propriedade intelectual e governança técnica da plataforma Mateus Celestino Pro X.",
  keywords: [
    "Termos de Uso",
    "Termos de Uso Soberanos",
    "Licenciamento de Ativos",
    "Propriedade Intelectual",
    "Mateus Celestino Pro X",
    "Regras da Comunidade",
    "Contrato de Adesão",
  ],
  openGraph: {
    title: "Termos de Uso Soberanos | Mateus Celestino Pro X",
    description:
      "Condições gerais de uso, licenciamento de ativos de código e governança técnica da plataforma Mateus Celestino Pro X.",
    images: [{ url: "/assets/hero_cover.webp", width: 1200, height: 630 }],
  },
};

export default function TermosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
