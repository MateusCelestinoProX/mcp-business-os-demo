import type { Metadata } from "next";
import { constructMetadata } from "@/services/seo/metadata";

export const metadata: Metadata = constructMetadata({
  title: "Termos de Uso Soberanos",
  description:
    "Condições gerais de uso, licenciamento de código-fonte de alta performance, regras de acesso à comunidade restrita, proteção de propriedade intelectual e governança técnica da plataforma Mateus Celestino Pro X.",
  path: "/termos",
  keywords: [
    "Termos de Uso",
    "Termos de Uso Soberanos",
    "Licenciamento de Ativos",
    "Propriedade Intelectual",
    "Regras da Comunidade",
  ],
});

export default function TermosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
