'use client';

import React, { useState } from 'react';
import { ShoppingBag, Bot, Server, ShieldAlert, Cpu, Check, MessageSquare, ArrowRight } from 'lucide-react';
import BalatroShader from '@/components/shaders/BalatroShader';

export interface ShopServiceItem {
  id: string;
  title: string;
  tag: string;
  description: string;
  cta?: string;
}

export interface ShopProductItem {
  id: string;
  title: string;
  tag: string;
  description: string;
  price: string;
}

export interface ShopData {
  servicos?: ShopServiceItem[];
  produtos?: ShopProductItem[];
}

export interface ShopSectionProps {
  shopData?: ShopData;
  onOpenContact?: () => void;
}

export function ShopSection({ shopData, onOpenContact }: ShopSectionProps) {
  const [activeShopTab, setActiveShopTab] = useState<'servicos' | 'produtos'>('servicos');

  const defaultServicos: ShopServiceItem[] = [
    {
      id: "serv-1",
      title: "Agentes Autônomos de Atendimento WhatsApp",
      tag: "ATENDIMENTO 24/7",
      description: "Funcionários digitais inteligentes que qualificam, tiram dúvidas e fecham vendas de forma humanizada, operando 24 horas por dia.",
      cta: "Contratar Atendimento Autônomo"
    },
    {
      id: "serv-2",
      title: "Consultoria & Gestão de Automação Empresarial",
      tag: "CONSULTORIA PRO",
      description: "Mapeamento minucioso de gargalos, desenho de esteiras de automação e implantação orientada a ROI.",
      cta: "Agendar Diagnóstico"
    },
    {
      id: "serv-3",
      title: "Hardening & Segurança de Servidores Linux",
      tag: "CYBERSECURITY",
      description: "Blindagem de portas, configuração de UFW, Fail2ban, chaves SSH ed25519, auditoria de processos e Docker isolation.",
      cta: "Blindar Servidor"
    }
  ];

  const defaultProdutos: ShopProductItem[] = [
    {
      id: "prod-1",
      title: "Cérebro Cibernético & Redes de Dados",
      tag: "ARQUITETURA IA",
      description: "Desenho e implementação de base de conhecimento vetorial com RAG para atendimento empresarial sem alucinação.",
      price: "Consulte Escopo"
    },
    {
      id: "prod-2",
      title: "Stack Completa Self-Hosted",
      tag: "INFRAESTRUTURA",
      description: "Ambiente Docker Swarm e Linux com n8n, Typebot, MinIO, Traefik e PostgreSQL com backup automatizado.",
      price: "Consulte Escopo"
    }
  ];

  const servicos = shopData?.servicos || defaultServicos;
  const produtos = shopData?.produtos || defaultProdutos;

  return (
    <section id="shop" className="py-20 relative overflow-hidden">
      {/* SHADER 4: Balatro (Personal OS - Energetic Fired Neon Blaster Red) */}
      <BalatroShader
        className="z-0 mix-blend-screen"
        color1="#ff073a"
        color2="#9b0016"
        color3="#0e0003"
        contrast={3.2}
        opacity={0.38}
      />

      {/* Zonas de Transição Internas com Blur e Escurecimento Progressivo */}
      <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-black via-black/85 to-transparent pointer-events-none z-1 backdrop-blur-[6px]" />
      <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-black via-black/85 to-transparent pointer-events-none z-1 backdrop-blur-[6px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header em Vidro Líquido */}
        <div className="glass-crystal p-8 sm:p-10 rounded-3xl mb-12">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full glass-pill-red text-xs font-mono text-[#ff073a] uppercase tracking-wider font-bold">
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>LOJA VIRTUAL & SERVIÇOS PRO</span>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass-pill text-[10px] font-mono font-bold text-[#ff073a] border border-[#ff073a]/30">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff073a] shadow-[0_0_8px_#ff073a] animate-ping" />
              SHADER 04: BALATRO VORTEX
            </span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Soluções & Serviços Inteligentes
          </h2>
          <p className="mt-3 text-base text-zinc-300 font-light leading-relaxed max-w-3xl">
            Produtos digitais de alta performance e consultoria especializada para quem busca excelência em automação, atendimento e infraestrutura autônoma.
          </p>

          {/* Seletor de Abas em Cápsula de Vidro */}
          <div className="mt-7 inline-flex p-1.5 rounded-2xl glass-pill">
            <button
              onClick={() => setActiveShopTab('servicos')}
              className={`px-5 py-2.5 rounded-xl text-xs font-mono tracking-wider transition-all duration-300 cursor-pointer ${
                activeShopTab === 'servicos'
                  ? 'glass-button-fired font-black text-white shadow-xl'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              SERVIÇOS DE AUTOMAÇÃO ({servicos.length})
            </button>
            <button
              onClick={() => setActiveShopTab('produtos')}
              className={`px-5 py-2.5 rounded-xl text-xs font-mono tracking-wider transition-all duration-300 cursor-pointer ${
                activeShopTab === 'produtos'
                  ? 'glass-button-fired font-black text-white shadow-xl'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              PRODUTOS & ARQUITETURAS ({produtos.length})
            </button>
          </div>
        </div>

        {/* Serviços Grid em Vidro Líquido */}
        {activeShopTab === 'servicos' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {servicos.map((serv, idx) => {
              const icons = [Bot, Cpu, ShieldAlert];
              const Icon = icons[idx % icons.length];
              return (
                <div
                  key={serv.id}
                  className="glass-crystal glass-interactive rounded-3xl p-6 sm:p-7 flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <div className="w-12 h-12 rounded-2xl glass-pill flex items-center justify-center text-[#ff073a] shadow-lg group-hover:scale-110 transition-transform">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="px-3 py-1 rounded-xl glass-pill-red text-[10px] font-mono text-[#ff073a] font-bold">
                        {serv.tag}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-white group-hover:text-[#ff073a] transition-all">
                      {serv.title}
                    </h3>

                    <p className="mt-3 text-sm text-zinc-300 font-light leading-relaxed">
                      {serv.description}
                    </p>

                    <div className="mt-6 pt-5 border-t border-white/10 space-y-2.5">
                      <div className="flex items-center gap-2 text-xs text-zinc-300 font-mono">
                        <Check className="w-3.5 h-3.5 text-[#ff073a]" />
                        <span>Implementação End-to-End</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-zinc-300 font-mono">
                        <Check className="w-3.5 h-3.5 text-[#ff073a]" />
                        <span>Acompanhamento Técnico Direto</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-zinc-300 font-mono">
                        <Check className="w-3.5 h-3.5 text-[#ff073a]" />
                        <span>Código e Dados 100% Seus</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-5 border-t border-white/10">
                    <a
                      href={`https://api.whatsapp.com/send/?phone=553197724257&text=Oi+Mateus,+tenho+interesse+no+serviço:+${encodeURIComponent(serv.title)}.&type=phone_number&app_absent=0`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="glass-button-fired w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-xs font-mono font-bold text-white shadow-xl"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>{serv.cta || 'CONTRATAR AGORA'}</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Produtos Grid em Vidro Líquido */}
        {activeShopTab === 'produtos' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {produtos.map((prod) => (
              <div
                key={prod.id}
                className="glass-crystal glass-interactive rounded-3xl p-6 sm:p-8 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3.5 py-1 rounded-xl glass-pill-red text-xs font-mono text-[#ff073a] font-bold">
                      {prod.tag}
                    </span>
                    <span className="text-sm font-mono text-zinc-400">
                      {prod.price}
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold text-white group-hover:text-[#ff073a] transition-all">
                    {prod.title}
                  </h3>

                  <p className="mt-3 text-sm text-zinc-300 font-light leading-relaxed">
                    {prod.description}
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
                  <a
                    href={`https://api.whatsapp.com/send/?phone=553197724257&text=Oi+Mateus,+tenho+interesse+no+produto:+${encodeURIComponent(prod.title)}.&type=phone_number&app_absent=0`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass-button-fired px-6 py-2.5 rounded-xl text-xs font-mono font-bold text-white shadow-lg flex items-center gap-2"
                  >
                    <span>CONTRATAR ARQUITETURA</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>

                  {onOpenContact && (
                    <button
                      onClick={onOpenContact}
                      className="text-xs font-mono text-zinc-400 hover:text-white transition-colors cursor-pointer"
                    >
                      Dúvidas?
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default ShopSection;
