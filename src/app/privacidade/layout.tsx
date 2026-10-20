import type { Metadata } from "next";
import { constructMetadata } from "@/services/seo/metadata";

export const metadata: Metadata = constructMetadata({
  title: "Política de Privacidade Blindada",
  description:
    "Diretrizes de privacidade soberana, conformidade estrita com a LGPD (Lei nº 13.709/2018), criptografia de dados ponta a ponta e governança transparente da plataforma Mateus Celestino Pro X.",
  path: "/privacidade",
  keywords: [
    "Política de Privacidade",
    "LGPD",
    "Privacidade Blindada",
    "Soberania de Dados",
    "Segurança da Informação",
  ],
});

export default function PrivacidadeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
