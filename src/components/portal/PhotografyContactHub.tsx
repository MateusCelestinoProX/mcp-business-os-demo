'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

interface PhotografyContactHubProps {
  className?: string;
  isEmbedded?: boolean;
}

// ============================================================================
// 1. VETORES & MATEMÁTICA PARA O CANVAS INTERATIVO SWARM (PHOTOGRAFY)
// ============================================================================
class Vector3D {
  x: number;
  y: number;
  z: number;

  constructor(x = 0, y = 0, z = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  set(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
    return this;
  }

  add(other: Vector3D | number) {
    if (typeof other === 'number') {
      this.x += other;
      this.y += other;
      this.z += other;
      return this;
    }
    this.x += other.x;
    this.y += other.y;
    this.z += other.z;
    return this;
  }

  sub(other: Vector3D | number) {
    if (typeof other === 'number') {
      this.x -= other;
      this.y -= other;
      this.z -= other;
      return this;
    }
    this.x -= other.x;
    this.y -= other.y;
    this.z -= other.z;
    return this;
  }

  mul(other: Vector3D | number) {
    if (typeof other === 'number') {
      this.x *= other;
      this.y *= other;
      this.z *= other;
      return this;
    }
    this.x *= other.x;
    this.y *= other.y;
    this.z *= other.z;
    return this;
  }

  move(dest: Vector3D) {
    dest.x = this.x;
    dest.y = this.y;
    dest.z = this.z;
    return this;
  }

  wrap2d(bounds: Vector3D) {
    let wrapped = false;
    if (this.x > bounds.x) {
      this.x = 0;
      wrapped = true;
    }
    if (this.x < 0) {
      this.x = bounds.x;
      wrapped = true;
    }
    if (this.y > bounds.y) {
      this.y = 0;
      wrapped = true;
    }
    if (this.y < 0) {
      this.y = bounds.y;
      wrapped = true;
    }
    return wrapped;
  }

  distance(other: Vector3D) {
    const dx = this.x - other.x;
    const dy = this.y - other.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  clone() {
    return new Vector3D(this.x, this.y, this.z);
  }
}

class SmallPRNG {
  seed: number;
  constructor(seed: number) {
    this.seed = seed;
  }
  random(min?: number, max?: number) {
    if (min === undefined) return Math.random();
    if (max === undefined) return Math.random() * min;
    return Math.random() * (max - min) + min;
  }
}

class Perlin {
  grad3: Vector3D[];
  p: number[];
  permutation: number[];
  gradP: Vector3D[];
  F3: number;
  G3: number;

  constructor() {
    this.grad3 = [
      new Vector3D(1, 1, 0),
      new Vector3D(-1, 1, 0),
      new Vector3D(1, -1, 0),
      new Vector3D(-1, -1, 0),
      new Vector3D(1, 0, 1),
      new Vector3D(-1, 0, 1),
      new Vector3D(1, 0, -1),
      new Vector3D(-1, 0, -1),
      new Vector3D(0, 1, 1),
      new Vector3D(0, -1, 1),
      new Vector3D(0, 1, -1),
      new Vector3D(0, -1, -1),
    ];

    this.p = [
      0x97, 0xa0, 0x89, 0x5b, 0x5a, 0x0f, 0x83, 0x0d, 0xc9, 0x5f, 0x60, 0x35, 0xc2, 0xe9, 0x07, 0xe1,
      0x8c, 0x24, 0x67, 0x1e, 0x45, 0x8e, 0x08, 0x63, 0x25, 0xf0, 0x15, 0x0a, 0x17, 0xbe, 0x06, 0x94,
      0xf7, 0x78, 0xea, 0x4b, 0x00, 0x1a, 0xc5, 0x3e, 0x5e, 0xfc, 0xdb, 0xcb, 0x75, 0x23, 0x0b, 0x20,
      0x39, 0xb1, 0x21, 0x58, 0xed, 0x95, 0x38, 0x57, 0xae, 0x14, 0x7d, 0x88, 0xab, 0xa8, 0x44, 0xaf,
      0x4a, 0xa5, 0x47, 0x86, 0x8b, 0x30, 0x1b, 0xa6, 0x4d, 0x92, 0x9e, 0xe7, 0x53, 0x6f, 0xe5, 0x7a,
      0x3c, 0xd3, 0x85, 0xe6, 0xdc, 0x69, 0x5c, 0x29, 0x37, 0x2e, 0xf5, 0x28, 0xf4, 0x66, 0x8f, 0x36,
      0x41, 0x19, 0x3f, 0xa1, 0x01, 0xd8, 0x50, 0x49, 0xd1, 0x4c, 0x84, 0xbb, 0xd0, 0x59, 0x12, 0xa9,
      0xc8, 0xc4, 0x87, 0x82, 0x74, 0xbc, 0x9f, 0x56, 0xa4, 0x64, 0x6d, 0xc6, 0xad, 0xba, 0x03, 0x40,
      0x34, 0xd9, 0xe2, 0xfa, 0x7c, 0x7b, 0x05, 0xca, 0x26, 0x93, 0x76, 0x7e, 0xff, 0x52, 0x55, 0xd4,
      0xcf, 0xce, 0x3b, 0xe3, 0x2f, 0x10, 0x3a, 0x11, 0xb6, 0xbd, 0x1c, 0x2a, 0xdf, 0xb7, 0xaa, 0xd5,
      0x77, 0xf8, 0x98, 0x02, 0x2c, 0x9a, 0xa3, 0x46, 0xdd, 0x99, 0x65, 0x9b, 0xa7, 0x2b, 0xac, 0x09,
      0x81, 0x16, 0x27, 0xfd, 0x13, 0x62, 0x6c, 0x6e, 0x4f, 0x71, 0xe0, 0xe8, 0xb2, 0xb9, 0x70, 0x68,
      0xda, 0xf6, 0x61, 0xe4, 0xfb, 0x22, 0xf2, 0xc1, 0xee, 0xd2, 0x90, 0x0c, 0xbf, 0xb3, 0xa2, 0xf1,
      0x51, 0x33, 0x91, 0xeb, 0xf9, 0x0e, 0xef, 0x6b, 0x31, 0xc0, 0xd6, 0x1f, 0xb5, 0xc7, 0x6a, 0x9d,
      0xb8, 0x54, 0xcc, 0xb0, 0x73, 0x79, 0x32, 0x2d, 0x7f, 0x04, 0x96, 0xfe, 0x8a, 0xec, 0xcd, 0x5d,
      0xde, 0x72, 0x43, 0x1d, 0x18, 0x48, 0xf3, 0x8d, 0x80, 0xc3, 0x4e, 0x42, 0xd7, 0x3d, 0x9c, 0xb4,
    ];

    this.permutation = new Array(512);
    this.gradP = new Array(512);
    this.F3 = 1 / 3;
    this.G3 = 1 / 6;
  }

  init(prng: () => number) {
    for (let i = 0; i < 256; i += 1) {
      const randval = this.p[i] ^ prng();
      this.permutation[i] = this.permutation[i + 256] = randval;
      this.gradP[i] = this.gradP[i + 256] = this.grad3[randval % this.grad3.length];
    }
  }

  simplex3d(x: number, y: number, z: number) {
    let n0 = 0,
      n1 = 0,
      n2 = 0,
      n3 = 0,
      i1 = 0,
      j1 = 0,
      k1 = 0,
      i2 = 0,
      j2 = 0,
      k2 = 0;

    const s = (x + y + z) * this.F3;
    let i = Math.floor(x + s);
    let j = Math.floor(y + s);
    let k = Math.floor(z + s);
    const t = (i + j + k) * this.G3;
    const x0 = x - i + t;
    const y0 = y - j + t;
    const z0 = z - k + t;

    if (x0 >= y0) {
      if (y0 >= z0) {
        i1 = 1; j1 = 0; k1 = 0; i2 = 1; j2 = 1; k2 = 0;
      } else if (x0 >= z0) {
        i1 = 1; j1 = 0; k1 = 0; i2 = 1; j2 = 0; k2 = 1;
      } else {
        i1 = 0; j1 = 0; k1 = 1; i2 = 1; j2 = 0; k2 = 1;
      }
    } else {
      if (y0 < z0) {
        i1 = 0; j1 = 0; k1 = 1; i2 = 0; j2 = 1; k2 = 1;
      } else if (x0 < z0) {
        i1 = 0; j1 = 1; k1 = 0; i2 = 0; j2 = 1; k2 = 1;
      } else {
        i1 = 0; j1 = 1; k1 = 0; i2 = 1; j2 = 1; k2 = 0;
      }
    }

    const x1 = x0 - i1 + this.G3;
    const y1 = y0 - j1 + this.G3;
    const z1 = z0 - k1 + this.G3;
    const x2 = x0 - i2 + 2 * this.G3;
    const y2 = y0 - j2 + 2 * this.G3;
    const z2 = z0 - k2 + 2 * this.G3;
    const x3 = x0 - 1 + 3 * this.G3;
    const y3 = y0 - 1 + 3 * this.G3;
    const z3 = z0 - 1 + 3 * this.G3;

    i &= 255;
    j &= 255;
    k &= 255;

    const gi0 = this.gradP[i + this.permutation[j + this.permutation[k]]];
    const gi1 = this.gradP[i + i1 + this.permutation[j + j1 + this.permutation[k + k1]]];
    const gi2 = this.gradP[i + i2 + this.permutation[j + j2 + this.permutation[k + k2]]];
    const gi3 = this.gradP[i + 1 + this.permutation[j + 1 + this.permutation[k + 1]]];

    let t0 = 0.6 - x0 * x0 - y0 * y0 - z0 * z0;
    let t1 = 0.6 - x1 * x1 - y1 * y1 - z1 * z1;
    let t2 = 0.6 - x2 * x2 - y2 * y2 - z2 * z2;
    let t3 = 0.6 - x3 * x3 - y3 * y3 - z3 * z3;

    if (t0 >= 0 && gi0) {
      t0 *= t0;
      n0 = t0 * t0 * (gi0.x * x0 + gi0.y * y0 + gi0.z * z0);
    }
    if (t1 >= 0 && gi1) {
      t1 *= t1;
      n1 = t1 * t1 * (gi1.x * x1 + gi1.y * y1 + gi1.z * z1);
    }
    if (t2 >= 0 && gi2) {
      t2 *= t2;
      n2 = t2 * t2 * (gi2.x * x2 + gi2.y * y2 + gi2.z * z2);
    }
    if (t3 >= 0 && gi3) {
      t3 *= t3;
      n3 = t3 * t3 * (gi3.x * x3 + gi3.y * y3 + gi3.z * z3);
    }

    return 32 * (n0 + n1 + n2 + n3);
  }
}

interface MouseState {
  position: Vector3D;
  state: { left: boolean; middle: boolean; right: boolean };
}

class Particle {
  p: Vector3D;
  t: Vector3D;
  v: Vector3D;
  g: Perlin;
  b: Vector3D;
  r: SmallPRNG;
  m: MouseState;
  i = 0;
  l = 0;

  constructor(generator: Perlin, bounds: Vector3D, rctx: SmallPRNG, mon: MouseState) {
    this.p = new Vector3D();
    this.t = new Vector3D();
    this.v = new Vector3D();
    this.g = generator;
    this.b = bounds;
    this.r = rctx;
    this.m = mon;
    this.reset();
  }

  reset() {
    this.p.x = this.t.x = Math.floor(this.r.random() * Math.max(this.b.x, 10));
    this.p.y = this.t.y = Math.floor(this.r.random() * Math.max(this.b.y, 10));
    this.v.set(1, 1, 0);
    this.i = 0;
    this.l = this.r.random(1000, 10000);
  }

  step() {
    if (this.i++ > this.l) {
      this.reset();
    }

    const xx = this.p.x / 200;
    const yy = this.p.y / 200;
    const zz = Date.now() / 5000;
    const a = this.r.random() * Math.PI * 2;
    const rnd = this.r.random() / 4;

    this.v.x += rnd * Math.sin(a) + this.g.simplex3d(xx, yy, -zz);
    this.v.y += rnd * Math.cos(a) + this.g.simplex3d(xx, yy, zz);

    if (this.m.state.left) {
      this.v.add(this.m.position.clone().sub(this.p).mul(0.00085));
    }

    if (this.m.state.right && this.p.distance(this.m.position) < this.r.random(200, 250)) {
      this.v.add(this.p.clone().sub(this.m.position).mul(0.02));
    }

    if (this.m.state.middle) {
      const d = this.p.distance(this.m.position);
      const l = this.r.random(200, 250);
      if (d < l) {
        this.v.mul(d / l);
      }
    }

    this.p.move(this.t).add(this.v.mul(0.94));

    if (this.p.wrap2d(this.b)) {
      this.p.move(this.t);
    }
  }

  render(context: CanvasRenderingContext2D) {
    context.moveTo(this.t.x, this.t.y);
    context.lineTo(this.p.x, this.p.y);
  }
}

const backgroundImages = [
  '/photografy-contato/l1.jpg',
  '/photografy-contato/l2.jpg',
  '/photografy-contato/l3.jpg',
  '/photografy-contato/l4.jpg',
  '/photografy-contato/l5.jpg',
];

export function PhotografyContactHub({ className = '', isEmbedded = false }: PhotografyContactHubProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const buttonWrapperRef = useRef<HTMLAnchorElement>(null);

  // Background slider cycling every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % backgroundImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // Swarm Particle simulation
  useEffect(() => {
    const canvas = canvasRef.current;
    const wrapper = buttonWrapperRef.current;
    if (!canvas || !wrapper) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    const rctx = new SmallPRNG(Date.now());
    const perlin = new Perlin();
    perlin.init(() => rctx.random(0, 255));

    const bounds = new Vector3D(wrapper.clientWidth || 350, wrapper.clientHeight || 70, 0);
    const mouseMonitor: MouseState = {
      position: new Vector3D(0, 0, 0),
      state: { left: false, middle: false, right: false },
    };

    const handleMouseMove = (event: MouseEvent) => {
      const rect = wrapper.getBoundingClientRect();
      mouseMonitor.position.x = event.clientX - rect.left;
      mouseMonitor.position.y = event.clientY - rect.top;
    };

    const handleMouseDown = (event: MouseEvent) => {
      if (event.button === 0) mouseMonitor.state.left = true;
      if (event.button === 1) mouseMonitor.state.middle = true;
      if (event.button === 2) mouseMonitor.state.right = true;
    };

    const handleMouseUp = () => {
      mouseMonitor.state.left = false;
      mouseMonitor.state.middle = false;
      mouseMonitor.state.right = false;
    };

    const handleContextMenu = (e: MouseEvent) => e.preventDefault();

    wrapper.addEventListener('mousemove', handleMouseMove);
    wrapper.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    wrapper.addEventListener('contextmenu', handleContextMenu);

    let animationFrameId: number;
    let hue = 0;
    const particleCount = 1000;
    const particles: Particle[] = [];

    const resize = () => {
      const rect = wrapper.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        canvas.width = bounds.x = rect.width;
        canvas.height = bounds.y = rect.height;
        context.fillStyle = '#000000';
        context.fillRect(0, 0, rect.width, rect.height);
      }
    };

    resize();
    window.addEventListener('resize', resize);

    for (let i = 0; i < particleCount; i += 1) {
      particles.push(new Particle(perlin, bounds, rctx, mouseMonitor));
    }

    const render = () => {
      animationFrameId = requestAnimationFrame(render);

      const width = bounds.x;
      const height = bounds.y;
      if (width <= 0 || height <= 0) return;

      context.beginPath();
      for (let i = 0; i < particles.length; i += 1) {
        particles[i].step();
        particles[i].render(context);
      }

      context.globalCompositeOperation = 'source-over';
      context.fillStyle = 'rgba(0, 0, 0, .085)';
      context.fillRect(0, 0, width, height);

      context.globalCompositeOperation = 'lighter';
      context.strokeStyle = `hsla(${hue}, 75%, 50%, .55)`;
      context.stroke();
      context.closePath();

      hue = (hue + 0.5) % 360;
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      wrapper.removeEventListener('mousemove', handleMouseMove);
      wrapper.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      wrapper.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div
      className={`relative w-full overflow-hidden text-white flex flex-col items-center justify-center ${
        isEmbedded ? 'min-h-[820px] rounded-3xl py-12 px-4 shadow-[0_0_60px_rgba(0,0,0,0.9)] border border-white/10' : 'h-[100dvh] min-h-[700px]'
      } ${className}`}
      style={{ touchAction: 'pan-y' }}
    >
      {/* 1. Background Slider Container */}
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-none select-none">
        {backgroundImages.map((src, index) => (
          <div
            key={src}
            className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ backgroundImage: `url('${src}')` }}
          />
        ))}
      </div>

      {/* 2. Overlay escura principal */}
      <div className="absolute inset-0 w-full h-full z-[1] pointer-events-none bg-gradient-to-b from-black/85 via-black/75 to-black/95" />

      {/* 3. Main Content Hub */}
      <div className="relative z-10 flex flex-col h-full w-full max-w-md mx-auto px-6 py-6 sm:py-10 animate-fade-in-up">
        {/* SEÇÃO SUPERIOR: Perfil e Links Padrões */}
        <div className="flex-1 flex flex-col items-center justify-center w-full">
          {/* Foto de Perfil */}
          <div className="mb-4 relative">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full p-[2px] bg-gradient-to-tr from-white/20 to-white/50 backdrop-blur-sm shadow-2xl relative overflow-hidden">
              <img
                src="/photografy-contato/kz.jpg"
                alt="Mateus Celestino"
                className="w-full h-full object-cover rounded-full"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://placehold.co/200x200/111/FFF?text=MC';
                }}
              />
            </div>
          </div>

          {/* Título */}
          <h1 className="text-xs sm:text-sm font-light tracking-[0.3em] uppercase text-center mb-6 text-white/90 font-sans">
            Mateus Celestino
            <span className="text-[10px] tracking-[0.4em] text-white/60 mt-1 block">
              Digital Hub
            </span>
          </h1>

          {/* Botões Regulares em Glassmorphism */}
          <div className="w-full flex flex-col gap-3 font-sans">
            {/* Photo Portfolio */}
            <a
              href="https://photografy-home.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="glass-button w-full py-3.5 sm:py-4 px-4 rounded-2xl flex items-center justify-center group relative overflow-hidden bg-white/[0.05] hover:bg-white/[0.15] border border-white/[0.15] hover:border-white/30 backdrop-blur-md transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <span className="font-light tracking-wider text-xs sm:text-sm relative z-10 text-white">
                PHOTO PORTFOLIO
              </span>
            </a>

            {/* AI Portfolio */}
            <a
              href="https://visuals-visuals-home.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="glass-button w-full py-3.5 sm:py-4 px-4 rounded-2xl flex items-center justify-center group relative overflow-hidden bg-white/[0.05] hover:bg-white/[0.15] border border-white/[0.15] hover:border-white/30 backdrop-blur-md transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <span className="font-light tracking-wider text-xs sm:text-sm relative z-10 text-white">
                AI PORTFOLIO
              </span>
            </a>

            {/* Curriculum Online */}
            <a
              href="https://outros-c-v.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="glass-button w-full py-3.5 sm:py-4 px-4 rounded-2xl flex items-center justify-center group relative overflow-hidden bg-white/[0.05] hover:bg-white/[0.15] border border-white/[0.15] hover:border-white/30 backdrop-blur-md transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <span className="font-light tracking-wider text-xs sm:text-sm relative z-10 text-white">
                CURRICULUM ONLINE
              </span>
            </a>

            {/* WhatsApp */}
            <a
              href="https://wa.me/5531998622489"
              target="_blank"
              rel="noopener noreferrer"
              className="glass-button w-full py-3.5 sm:py-4 px-4 rounded-2xl flex items-center justify-center group relative overflow-hidden bg-white/[0.05] hover:bg-white/[0.15] border border-white/[0.15] hover:border-white/30 backdrop-blur-md transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <span className="font-light tracking-wider text-xs sm:text-sm relative z-10 text-white">
                WHATSAPP
              </span>
            </a>

            {/* Email */}
            <a
              href="mailto:mateusgomes6667@gmail.com"
              className="glass-button w-full py-3.5 sm:py-4 px-4 rounded-2xl flex items-center justify-center group relative overflow-hidden bg-white/[0.05] hover:bg-white/[0.15] border border-white/[0.15] hover:border-white/30 backdrop-blur-md transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <span className="font-light tracking-wider text-xs sm:text-sm relative z-10 text-white">
                E-MAIL
              </span>
            </a>
          </div>
        </div>

        {/* SEÇÃO INFERIOR: Botão PRO Especial com Canvas Swarm Integrado */}
        <div className="flex-shrink-0 flex items-end justify-center w-full pt-4 pb-2">
          <a
            ref={buttonWrapperRef}
            href="https://saas-social-hub.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            id="pro-btn-wrapper"
            className="w-full rounded-xl relative overflow-hidden flex flex-col items-center justify-center text-center group border border-white/40 hover:border-white/70 bg-white/10 backdrop-blur-md transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-lg min-h-[64px]"
          >
            <canvas
              ref={canvasRef}
              id="swarm"
              className="absolute inset-0 w-full h-full z-0 mix-blend-screen opacity-90"
            />
            <div className="py-4 px-2 sm:px-4 relative z-10 pointer-events-none flex flex-col items-center justify-center w-full h-full font-sans">
              <span className="font-bold tracking-[0.15em] text-xs sm:text-sm mb-1 text-white uppercase drop-shadow-md">
                MATEUS CELESTINO PRO
              </span>
              <span className="font-light tracking-widest text-[9px] sm:text-[10px] text-white opacity-85 drop-shadow-sm">
                (AUTOMATION & MARKETING SERVICES)
              </span>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}

export default PhotografyContactHub;
