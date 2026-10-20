import type { Viewport } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { PortalNavbar } from "@/components/portal/PortalNavbar";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import LiquidGlassBackground from "@/components/portal/LiquidGlassBackground";
import { constructMetadata } from "@/services/seo/metadata";
import {
  buildOrganizationAndPersonSchema,
  buildWebSiteSchema,
  buildGraphSchema,
} from "@/services/seo/structured-data";
import { JsonLd } from "@/components/seo/JsonLd";
import { SmartCacheEngine } from "@/components/cache/SmartCacheEngine";

export const viewport: Viewport = {
  themeColor: "#030305",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

export const metadata = constructMetadata({
  path: '/',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const globalSchema = buildGraphSchema([
    buildOrganizationAndPersonSchema(),
    buildWebSiteSchema(),
  ]);

  return (
    <html lang="pt-BR" className="dark">
      <head>
        {/* Preconnect & DNS-Prefetch Inteligente para Máxima Performance de Rede */}
        <link rel="preconnect" href="https://ik.imagekit.io" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://ik.imagekit.io" />
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://api.dicebear.com" />

        {/* Schema.org Global: Organização, Especialista E-E-A-T & Google Sitelinks Searchbox */}
        <JsonLd data={globalSchema} id="global-sovereign-schema" />
        <link rel="alternate" type="application/rss+xml" title="Feed RSS Mateus Celestino Pro X" href="/feed.xml" />
      </head>
      <body className="bg-[#0c0003] text-[#f3f4f6] antialiased selection:bg-red-500/30 selection:text-white min-h-screen flex flex-col relative overflow-x-hidden">
        {/* Motor de Cache Inteligente Soberano, Service Worker & Speculation Rules (Instant Load 0ms) */}
        <SmartCacheEngine />

        {/* Fundo Global: Piscina de Energia Vermelha Massiva e Escurricredia */}
        <LiquidGlassBackground />

        {/* Barra de Navegação Soberana Superior */}
        <Navbar />

        {/* Sub-Header de Navegação do Sistema Universal */}
        <PortalNavbar />

        {/* Conteúdo Principal com espaço inteligente: mobile-first enxuto e desktop com espaço para as duas barras fixas */}
        <main className="flex-1 pt-16 sm:pt-20 lg:pt-32 pb-20 md:pb-0 relative z-10 flex flex-col min-h-screen">
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
