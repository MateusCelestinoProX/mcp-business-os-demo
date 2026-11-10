'use client';

import React, { useEffect, useRef } from 'react';
import {
  Cpu,
  Hexagon,
  Flame,
  Database,
  Workflow,
  Table2,
  FileText,
  MailOpen,
  BarChart3,
} from 'lucide-react';
import { getAdaptiveDPR } from '@/lib/shaders/webgl-utils';

interface StackItem {
  id: string;
  name: string;
  renderIcon: () => React.ReactNode;
}

function ReactBrandIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-5 h-5" aria-hidden="true">
      <circle cx="12" cy="12" r="2.2" fill="currentColor" stroke="none" />
      <ellipse cx="12" cy="12" rx="10" ry="4.2" />
      <ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(120 12 12)" />
    </svg>
  );
}

function NodeJsBrandIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5" aria-hidden="true">
      <path d="M12 2.5 20.5 7.25v9.5L12 21.5l-8.5-4.75v-9.5L12 2.5Z" />
      <path d="M9.5 15V9l5 6V9" />
    </svg>
  );
}

function WhatsAppBrandIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5" aria-hidden="true">
      <path d="M21 11.5a8.5 8.5 0 0 1-12.55 7.47L3 20.5l1.56-5.22A8.5 8.5 0 1 1 21 11.5Z" />
      <path d="M9.4 9.2c.25-.45.55-.45.82-.45h.45c.2 0 .45.05.62.45l.65 1.55c.1.25.05.5-.12.68l-.45.45a6.2 6.2 0 0 0 2.75 2.75l.45-.45c.18-.17.43-.22.68-.12l1.55.65c.4.17.45.42.45.62v.45c0 .27 0 .57-.45.82-.55.3-1.45.45-2.6.05-1.95-.68-3.85-2.58-4.53-4.53-.4-1.15-.25-2.05.05-2.6Z" />
    </svg>
  );
}

function LinuxBrandIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5" aria-hidden="true">
      <rect x="3" y="4" width="18" height="16" rx="3" />
      <path d="m7.5 9.5 3 2.5-3 2.5" />
      <path d="M12.5 14.5h4" />
    </svg>
  );
}

function DockerBrandIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5" aria-hidden="true">
      <path d="M4 13h14c-.4 3.5-2.9 6-7.2 6C6.4 19 4.2 16.5 4 13Z" />
      <path d="M18 13c1.2-.2 2.4-.9 3-2-.9-.5-2-.4-2.8.2" />
      <path d="M7 10h2.5v2.5H7zM10.5 10H13v2.5h-2.5zM14 10h2.5v2.5H14zM10.5 6.5H13V9h-2.5z" />
    </svg>
  );
}

const STACKS: StackItem[] = [
  { id: 'react', name: 'React', renderIcon: () => <ReactBrandIcon /> },
  { id: 'nodejs', name: 'Node.js', renderIcon: () => <NodeJsBrandIcon /> },
  { id: 'node', name: 'Node', renderIcon: () => <Hexagon className="w-5 h-5" /> },
  { id: 'firebase', name: 'Firebase', renderIcon: () => <Flame className="w-5 h-5" /> },
  { id: 'supabase', name: 'Supabase', renderIcon: () => <Database className="w-5 h-5" /> },
  { id: 'n8n', name: 'n8n', renderIcon: () => <Workflow className="w-5 h-5" /> },
  { id: 'airtable', name: 'Airtable', renderIcon: () => <Table2 className="w-5 h-5" /> },
  { id: 'notion', name: 'Notion', renderIcon: () => <FileText className="w-5 h-5" /> },
  { id: 'whatsapp-api', name: 'WhatsApp API', renderIcon: () => <WhatsAppBrandIcon /> },
  { id: 'email-ai', name: 'Email AI', renderIcon: () => <MailOpen className="w-5 h-5" /> },
  { id: 'linux', name: 'Linux', renderIcon: () => <LinuxBrandIcon /> },
  { id: 'docker', name: 'Docker', renderIcon: () => <DockerBrandIcon /> },
  { id: 'crm', name: 'CRM', renderIcon: () => <BarChart3 className="w-5 h-5" /> },
];

export function StacksSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = sectionRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const MAX_CHARS = 160;
    const SEPARATION = 1.25;
    let width = 0;
    let height = 0;
    let dpr = getAdaptiveDPR();

    interface Vec3 {
      x: number;
      y: number;
      z: number;
    }

    const camera: Vec3 = { x: 0, y: 0, z: SEPARATION + 1 };

    const chars: Array<{ letter: string; pos: Vec3 }> = [];
    const alphabet = '01010101SMARTFLOWINTELLIGENCECODELIMITLESS'.split('');
    const signedRandom = () => Math.random() - Math.random();

    for (let i = 0; i < MAX_CHARS; i++) {
      chars.push({
        letter: alphabet[Math.floor(Math.random() * alphabet.length)],
        pos: {
          x: signedRandom() * SEPARATION,
          y: signedRandom() * SEPARATION,
          z: signedRandom() * SEPARATION,
        },
      });
    }

    const rotatePos = (pos: Vec3, axis: 'x' | 'y', ang: number) => {
      const sin = Math.sin(ang);
      const cos = Math.cos(ang);
      if (axis === 'x') {
        const y = pos.y * cos - pos.z * sin;
        const z = pos.y * sin + pos.z * cos;
        pos.y = y;
        pos.z = z;
      } else {
        const x = pos.x * cos - pos.z * sin;
        const z = pos.x * sin + pos.z * cos;
        pos.x = x;
        pos.z = z;
      }
    };

    const setDimensions = () => {
      if (!container || !canvas) return;
      dpr = getAdaptiveDPR();
      width = container.clientWidth || window.innerWidth || 1200;
      height = container.clientHeight || 560;
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    setDimensions();

    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(setDimensions);
      ro.observe(container);
    } else {
      window.addEventListener('resize', setDimensions);
    }

    let isVisible = true;
    let io: IntersectionObserver | null = null;
    if (typeof IntersectionObserver !== 'undefined') {
      io = new IntersectionObserver(
        ([entry]) => {
          isVisible = entry.isIntersecting;
        },
        { threshold: 0.02 }
      );
      io.observe(container);
    }

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    let time = 0;
    const drawFrame = () => {
      ctx.clearRect(0, 0, width, height);
      const cx = width / 2;
      const cy = height / 2;
      const dx = 0.0028 * Math.sin(time * 0.0005);
      const dy = 0.0028 * Math.cos(time * 0.0005);

      for (let i = 0; i < chars.length; i++) {
        const item = chars[i];
        if (!prefersReducedMotion) {
          rotatePos(item.pos, 'x', dx);
          rotatePos(item.pos, 'y', dy);
        }
        const zp = item.pos.z + camera.z;
        if (zp <= 0.15) continue;
        const div = zp / (height || 500);
        const xp = (item.pos.x + camera.x) / div + cx;
        const yp = (item.pos.y + camera.y) / div + cy;
        const maxSize = 36;
        const size = Math.max(8, Math.min(maxSize, ((1 / zp) * maxSize) | 0));
        const brightness = Math.min(1, size / maxSize);

        ctx.fillStyle = `rgba(255, 7, 58, ${(brightness * 0.55).toFixed(3)})`;
        ctx.font = `700 ${size}px ui-monospace, SFMono-Regular, Menlo, monospace`;
        ctx.fillText(item.letter, xp, yp);
      }

      time += 1;
    };

    drawFrame();

    let rafId = 0;
    const loop = () => {
      rafId = window.requestAnimationFrame(loop);
      if (!isVisible || document.hidden || prefersReducedMotion) return;
      drawFrame();
    };
    rafId = window.requestAnimationFrame(loop);

    return () => {
      window.cancelAnimationFrame(rafId);
      if (io) io.disconnect();
      if (ro) ro.disconnect();
      else window.removeEventListener('resize', setDimensions);
    };
  }, []);

  return (
    <section
      id="stacks"
      ref={sectionRef}
      className="pt-8 pb-12 sm:pt-12 sm:pb-16 relative overflow-hidden w-full"
    >
      {/* Motor de Partículas 3D Canvas em Carmesim (pausado quando fora de tela) */}
      <canvas
        ref={canvasRef}
        id="stacks-canvas"
        aria-hidden="true"
        className="absolute inset-0 w-full h-full pointer-events-none opacity-80 z-0"
        style={{
          maskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)',
        }}
      />

      {/* Transições suaves de topo e base */}
      <div className="absolute top-0 left-0 right-0 h-10 sm:h-14 bg-gradient-to-b from-[#030305]/85 to-transparent pointer-events-none z-[1]" />
      <div className="absolute bottom-0 left-0 right-0 h-10 sm:h-14 bg-gradient-to-t from-[#030305]/85 to-transparent pointer-events-none z-[1]" />

      {/* Halo luminoso carmesim */}
      <div
        className="absolute top-12 left-1/2 -translate-x-1/2 w-80 sm:w-[40rem] h-28 rounded-full pointer-events-none opacity-20 z-[1]"
        style={{
          background: 'radial-gradient(ellipse at center, #ff073a 0%, rgba(138,0,18,0.4) 40%, transparent 75%)',
          filter: 'blur(54px)',
        }}
      />

      <div className="w-full px-3.5 sm:px-6 lg:px-10 xl:px-16 relative z-10">
        {/* Header em Vidro — Idêntico ao padrão da Home */}
        <div className="glass-crystal p-5 sm:p-8 lg:p-10 rounded-2xl sm:rounded-3xl mb-6 sm:mb-8 border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.85)]">
          <div className="flex flex-wrap items-center justify-between gap-2.5 mb-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-pill-red text-[11px] sm:text-xs font-mono text-[#ff073a] uppercase tracking-wider font-bold">
              <Cpu className="w-3.5 h-3.5" />
              <span>NOSSA TECNOLOGIA</span>
            </div>
            <span className="px-3 py-1 rounded-full glass-pill text-[10px] sm:text-xs font-mono text-zinc-300 uppercase tracking-wider">
              13 Stacks Principais
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            Nossas Stacks Digitais
          </h2>
          <p className="mt-1.5 text-sm sm:text-base font-mono text-[#ff073a] font-bold max-w-2xl leading-relaxed">
            Empregamos as tecnologias mais velozes e estáveis para desenvolver e integrar a sua infraestrutura.
          </p>
        </div>

        {/* Grade Simétrica Centralizada das 13 Stacks */}
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
          {STACKS.map((stack) => (
            <div
              key={stack.id}
              className="w-[calc((100%-0.75rem)/2)] sm:w-[calc((100%-2rem)/3)] md:w-[calc((100%-3rem)/4)] lg:w-[calc((100%-6rem)/7)] glass-crystal glass-interactive rounded-2xl p-4 sm:p-5 border border-white/10 flex flex-col items-center justify-center text-center gap-2.5 min-h-[112px] sm:min-h-[120px] group touch-manipulation"
            >
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl glass-pill-red flex items-center justify-center text-[#ff073a] group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(255,7,58,0.4)] transition-all duration-300 shrink-0">
                {stack.renderIcon()}
              </div>
              <h3 className="text-[11px] sm:text-xs font-mono font-bold text-white uppercase tracking-wider leading-tight">
                {stack.name}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default StacksSection;
