import React from "react";
import Link from "next/link";
import { Shield, Sparkles, Terminal, Cpu, Database, Heart } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative z-20 mt-24 border-t border-white/10 bg-[#030305]/90 backdrop-blur-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Coluna 1: Branding MCP */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-600 to-black p-[1px] flex items-center justify-center shadow-[0_0_15px_rgba(255,7,58,0.4)]">
                <div className="w-full h-full bg-[#030305] rounded-[7px] flex items-center justify-center">
                  <span className="font-extrabold text-xs text-white">MCP</span>
                </div>
              </div>
              <span className="font-bold text-sm tracking-wide text-white">
                MATEUS CELESTINO <span className="text-red-500">PRO</span>
              </span>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Plataforma unificada soberana integrando alta engenharia de software,
              shaders cinematográficos WebGL, área de membros restrita e cofre digital de ativos.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-neutral-500 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>SISTEMA 100% OPERACIONAL</span>
            </div>
          </div>

          {/* Coluna 2: Módulos do Ecossistema */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-300 mb-4 flex items-center gap-2">
              <Cpu className="w-3.5 h-3.5 text-red-400" />
              Módulos Soberanos
            </h3>
            <ul className="space-y-2.5 text-xs text-neutral-400">
              <li>
                <Link
                  href="/"
                  className="hover:text-red-400 transition-colors flex items-center justify-between"
                >
                  <span>Portal Institucional</span>
                  <span className="text-[10px] text-neutral-600">/</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/comunidade"
                  className="hover:text-red-400 transition-colors flex items-center justify-between"
                >
                  <span>Área de Membros (Visuals)</span>
                  <span className="text-[10px] text-red-500/80">PRO</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/builder"
                  className="hover:text-red-400 transition-colors flex items-center justify-between"
                >
                  <span>Form Builder Cinemático</span>
                  <span className="text-[10px] text-neutral-600">SaaS</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/biblioteca"
                  className="hover:text-red-400 transition-colors flex items-center justify-between"
                >
                  <span>Biblioteca Oculta (Cofre)</span>
                  <span className="text-[10px] text-amber-500/80">VAULT</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Coluna 3: Infraestrutura & Camada de Dados */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-300 mb-4 flex items-center gap-2">
              <Database className="w-3.5 h-3.5 text-red-400" />
              Infraestrutura
            </h3>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li className="flex items-center gap-2">
                <span className="text-neutral-500">•</span>
                <span>Next.js 15 App Router & React 19</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-neutral-500">•</span>
                <span>PostgreSQL Universal & Drizzle ORM</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-neutral-500">•</span>
                <span>Three.js + OGL Shaders a 60 FPS</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-neutral-500">•</span>
                <span>Tailwind CSS v4 & Glassmorphism</span>
              </li>
            </ul>
          </div>

          {/* Coluna 4: Governança & Contato */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-300 mb-4 flex items-center gap-2">
              <Shield className="w-3.5 h-3.5 text-red-400" />
              Governança
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed mb-3">
              Desenvolvido sob o selo de soberania e integridade técnica absoluta por Mateus Celestino.
            </p>
            <div className="glass-pill rounded-xl p-3 text-[11px] text-neutral-300 space-y-1">
              <div className="text-neutral-400">Arquiteto Oficial:</div>
              <div className="font-semibold text-white">Mateus Celestino</div>
              <div className="text-neutral-500 text-[10px] font-mono">
                202405039459@alunos.estacio.br
              </div>
            </div>
          </div>
        </div>

        {/* Linha Inferior com Copyright */}
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <div>
            &copy; {currentYear} Mateus Celestino Pro Software. Todos os direitos reservados.
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="text-neutral-400">Privacidade Blindada</span>
            <span>•</span>
            <span className="text-neutral-400">Termos de Uso Soberanos</span>
            <span>•</span>
            <span className="text-red-500 font-mono">v2.0.0-UNIFIED</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
