import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidade Blindada | Mateus Celestino Pro X",
  description:
    "Diretrizes de privacidade soberana, conformidade estrita com a LGPD (Lei nº 13.709/2018), criptografia de dados ponta a ponta e governança transparente da plataforma Mateus Celestino Pro X.",
  keywords: [
    "Política de Privacidade",
    "LGPD",
    "Privacidade Blindada",
    "Soberania de Dados",
    "Mateus Celestino Pro X",
    "Criptografia Ponta a Ponta",
    "Segurança da Informação",
  ],
  openGraph: {
    title: "Política de Privacidade Blindada | Mateus Celestino Pro X",
    description:
      "Diretrizes de privacidade soberana, conformidade estrita com a LGPD e criptografia ponta a ponta.",
    images: [{ url: "/assets/hero_cover.webp", width: 1200, height: 630 }],
  },
};

export default function PrivacidadeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
