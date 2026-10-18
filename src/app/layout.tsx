import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { PortalNavbar } from "@/components/portal/PortalNavbar";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import LiquidGlassBackground from "@/components/portal/LiquidGlassBackground";

export const viewport: Viewport = {
  themeColor: "#030305",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

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
    "Cofre de Ativos",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark scroll-smooth">
      <body className="bg-[#0c0003] text-[#f3f4f6] antialiased selection:bg-red-500/30 selection:text-white min-h-screen flex flex-col relative overflow-x-hidden">
        {/* Fundo Global: Piscina de Energia Vermelha Massiva e Escurricredia */}
        <LiquidGlassBackground />

        {/* Barra de Navegação Soberana Superior */}
        <Navbar />

        {/* Sub-Header de Navegação do Sistema Universal */}
        <PortalNavbar />

        {/* Conteúdo Principal com espaço para as duas barras fixas e margem inferior para a barra móvel */}
        <main className="flex-1 pt-28 sm:pt-32 pb-20 md:pb-0 relative z-10 flex flex-col min-h-screen">
          {children}
        </main>

        {/* Barra de Navegação Móvel Flutuante Soberana */}
        <MobileBottomNav />

        {/* Rodapé Oficial da Plataforma */}
        <Footer />
      </body>
    </html>
  );
}
