import type { Metadata } from "next";
import { constructMetadata } from "@/services/seo/metadata";

export const metadata: Metadata = constructMetadata({
  title: "Política de Privacidade",
  description:
    "Política de privacidade, proteção de dados e transparência no uso de cookies e telemetria anônima em conformidade com a LGPD (Lei nº 13.709/2018).",
  path: "/privacidade",
  keywords: [
    "Política de Privacidade",
    "LGPD",
    "Proteção de Dados",
    "Cookies",
    "Privacidade",
    "Umami Analytics",
  ],
});

export default function PrivacidadeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
