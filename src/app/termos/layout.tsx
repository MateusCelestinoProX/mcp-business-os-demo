import type { Metadata } from "next";
import { constructMetadata } from "@/services/seo/metadata";

export const metadata: Metadata = constructMetadata({
  title: "Termos de Uso",
  description:
    "Termos e condições gerais de uso, navegação, propriedade intelectual e conduta na plataforma Mateus Celestino Pro X.",
  path: "/termos",
  keywords: [
    "Termos de Uso",
    "Condições Gerais",
    "Propriedade Intelectual",
    "Licenciamento",
    "Diretrizes de Uso",
  ],
});

export default function TermosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
