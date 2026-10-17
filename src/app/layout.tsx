import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { PortalNavbar } from "@/components/portal/PortalNavbar";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: "Mateus Celestino Pro X",
  description:
    "Ecossistema de hiperautomação, agentes autônomos com IA, engenharia de sistemas e cofre de recursos de alta performance.",
  icons: {
    icon: [
      { url: '/assets/site_icon.webp', type: 'image/webp' },
      { url: '/icon.png', sizes: '256x256', type: 'image/png' },
      { url: '/favicon.ico', sizes: '32x32' },
    ],
    shortcut: '/favicon.ico',
    apple: '/icon.png',
  },
  authors: [{ name: "Mateus Celestino", url: "https://mateuscelestino.pro" }],
  keywords: [
    "Mateus Celestino Pro X",
    "Hiperautomação",
    "Agentes Autônomos IA",
    "Shaders WebGL",
    "Comunidade Exclusiva",
    "Form Builder Cinemático",
    "Cofre de Ativos",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <body className="bg-[#030305] text-[#f3f4f6] antialiased selection:bg-red-500/30 selection:text-white min-h-screen flex flex-col relative overflow-x-hidden">
        {/* Glows de Fundo Ambientais Soberanos */}
        <div
          className="liquid-glow-orb -top-40 left-1/4 w-[600px] h-[600px] bg-red-600/15"
          aria-hidden="true"
        />
        <div
          className="liquid-glow-orb top-[40%] -right-40 w-[500px] h-[500px] bg-red-800/10"
          aria-hidden="true"
        />
        <div
          className="liquid-glow-orb bottom-20 left-10 w-[450px] h-[450px] bg-red-950/15"
          aria-hidden="true"
        />

        {/* Barra de Navegação Soberana Superior */}
        <Navbar />

        {/* Sub-Header de Navegação do Sistema Universal */}
        <PortalNavbar />

        {/* Conteúdo Principal com espaço para as duas barras fixas */}
        <main className="flex-1 pt-32 relative z-10 flex flex-col">{children}</main>

        {/* Rodapé Oficial da Plataforma */}
        <Footer />
      </body>
    </html>
  );
}
