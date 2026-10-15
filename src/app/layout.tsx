import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: "Mateus Celestino Pro — Plataforma Unificada Soberana",
  description:
    "Ecossistema unificado de branding visual com shaders, área de membros restrita, construtor cinemático de formulários e cofre oculto de recursos.",
  authors: [{ name: "Mateus Celestino", url: "https://mateuscelestino.pro" }],
  keywords: [
    "Mateus Celestino Pro",
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
      <head>
        <style
          dangerouslySetInnerHTML={{
            __html: `
              html, body {
                background-color: #030305 !important;
                color: #f3f4f6 !important;
                margin: 0;
                padding: 0;
                font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif;
              }
              a { color: inherit; text-decoration: none; }
              *, *::before, *::after { box-sizing: border-box; }
            `,
          }}
        />
      </head>
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

        {/* Barra de Navegação Soberana */}
        <Navbar />

        {/* Conteúdo Principal com espaço para Navbar fixa */}
        <main className="flex-1 pt-24 relative z-10 flex flex-col">{children}</main>

        {/* Rodapé Oficial da Plataforma */}
        <Footer />
      </body>
    </html>
  );
}
