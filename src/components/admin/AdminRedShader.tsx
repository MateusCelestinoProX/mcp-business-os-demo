"use client";

import React, { useEffect, useRef, useState } from "react";
import { Renderer, Program, Mesh, Triangle } from "ogl";
import { isWebGLSupported } from "@/lib/shaders/webgl-utils";

export interface AdminRedShaderProps {
  className?: string;
  opacity?: number;
  speed?: number;
  brightness?: number;
  interactive?: boolean;
}

const vertexShader = `
attribute vec2 uv;
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragmentShader = `
precision highp float;

uniform float uTime;
uniform vec3 uResolution;
uniform float uSpeed;
uniform float uScale;
uniform float uBrightness;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform float uNoiseFreq;
uniform float uNoiseAmp;
uniform float uBandHeight;
uniform float uBandSpread;
uniform float uOctaveDecay;
uniform float uLayerOffset;
uniform float uColorSpeed;
uniform vec2 uMouse;
uniform float uMouseInfluence;
uniform float uEnableMouse;
uniform float uOpacity;
varying vec2 vUv;

#define TAU 6.28318530718

vec3 gradientHash(vec3 p) {
  p = vec3(
    dot(p, vec3(127.1, 311.7, 234.6)),
    dot(p, vec3(269.5, 183.3, 198.3)),
    dot(p, vec3(169.5, 283.3, 156.9))
  );
  vec3 h = fract(sin(p) * 43758.5453123);
  float phi = acos(2.0 * h.x - 1.0);
  float theta = TAU * h.y;
  return vec3(cos(theta) * sin(phi), sin(theta) * cos(phi), cos(phi));
}

float quinticSmooth(float t) {
  float t2 = t * t;
  float t3 = t * t2;
  return 6.0 * t3 * t2 - 15.0 * t2 * t2 + 10.0 * t3;
}

vec3 cosineGradient(float t, vec3 a, vec3 b, vec3 c, vec3 d) {
  return a + b * cos(TAU * (c * t + d));
}

float perlin3D(float amplitude, float frequency, float px, float py, float pz) {
  float x = px * frequency;
  float y = py * frequency;

  float fx = floor(x); float fy = floor(y); float fz = floor(pz);
  float cx = ceil(x);  float cy = ceil(y);  float cz = ceil(pz);

  vec3 g000 = gradientHash(vec3(fx, fy, fz));
  vec3 g100 = gradientHash(vec3(cx, fy, fz));
  vec3 g010 = gradientHash(vec3(fx, cy, fz));
  vec3 g110 = gradientHash(vec3(cx, cy, fz));
  vec3 g001 = gradientHash(vec3(fx, fy, cz));
  vec3 g101 = gradientHash(vec3(cx, fy, cz));
  vec3 g011 = gradientHash(vec3(fx, cy, cz));
  vec3 g111 = gradientHash(vec3(cx, cy, cz));

  float d000 = dot(g000, vec3(x - fx, y - fy, pz - fz));
  float d100 = dot(g100, vec3(x - cx, y - fy, pz - fz));
  float d010 = dot(g010, vec3(x - fx, y - cy, pz - fz));
  float d110 = dot(g110, vec3(x - cx, y - cy, pz - fz));
  float d001 = dot(g001, vec3(x - fx, y - fy, pz - cz));
  float d101 = dot(g101, vec3(x - cx, y - fy, pz - cz));
  float d011 = dot(g011, vec3(x - fx, y - cy, pz - cz));
  float d111 = dot(g111, vec3(x - cx, y - cy, pz - cz));

  float sx = quinticSmooth(x - fx);
  float sy = quinticSmooth(y - fy);
  float sz = quinticSmooth(pz - fz);

  float lx00 = mix(d000, d100, sx);
  float lx10 = mix(d010, d110, sx);
  float lx01 = mix(d001, d101, sx);
  float lx11 = mix(d011, d111, sx);

  float ly0 = mix(lx00, lx10, sy);
  float ly1 = mix(lx01, lx11, sy);

  return amplitude * mix(ly0, ly1, sz);
}

float auroraGlow(float t, vec2 shift) {
  vec2 uv = gl_FragCoord.xy / max(uResolution.y, 1.0);
  uv += shift;

  float noiseVal = 0.0;
  float freq = uNoiseFreq;
  float amp = uNoiseAmp;
  vec2 samplePos = uv * uScale;

  for (float i = 0.0; i < 3.0; i += 1.0) {
    noiseVal += perlin3D(amp, freq, samplePos.x, samplePos.y, t);
    amp *= uOctaveDecay;
    freq *= 2.0;
  }

  float yBand = uv.y * 10.0 - uBandHeight * 10.0;
  return 0.35 * max(exp(uBandSpread * (1.0 - 1.15 * abs(noiseVal + yBand))), 0.0);
}

void main() {
  vec2 uv = gl_FragCoord.xy / max(uResolution.xy, vec2(1.0));
  float t = uSpeed * 0.42 * uTime;

  vec2 shift = vec2(0.0);
  if (uEnableMouse > 0.5) {
    shift = (uMouse - 0.5) * uMouseInfluence;
  }

  float glow1 = auroraGlow(t, shift);
  float glow2 = auroraGlow(t + uLayerOffset, shift);

  // Gradientes harmônicos em Vermelho Carmesim e Sanguíneo Vanta
  vec3 gradient1 = cosineGradient(uv.x + uTime * uSpeed * 0.18 * uColorSpeed, vec3(0.5, 0.1, 0.12), vec3(0.5, 0.1, 0.1), vec3(1.0, 0.8, 0.5), vec3(0.3, 0.15, 0.15));
  vec3 gradient2 = cosineGradient(uv.x + uTime * uSpeed * 0.12 * uColorSpeed, vec3(0.4, 0.05, 0.08), vec3(0.5, 0.1, 0.1), vec3(1.8, 1.0, 0.5), vec3(0.5, 0.15, 0.2));

  vec3 col = 1.1 * glow1 * gradient1 * uColor1;
  col += 1.1 * glow2 * gradient2 * uColor2;

  // Realce vibrante nos picos de onda
  col += vec3(glow1 * glow2 * 0.35, 0.0, 0.04);
  col *= uBrightness;

  float alpha = clamp(length(col) * 1.4, 0.0, 1.0) * uOpacity;
  gl_FragColor = vec4(col, alpha);
}
`;

export default function AdminRedShader({
  className = "",
  opacity = 0.75,
  speed = 0.5,
  brightness = 1.35,
  interactive = true,
}: AdminRedShaderProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [hasWebGL, setHasWebGL] = useState<boolean>(true);

  useEffect(() => {
    if (!isWebGLSupported()) {
      setHasWebGL(false);
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    // Resolução calibrada para performance extrema e 120 FPS no mobile
    const isMobile = typeof window !== "undefined" && (window.innerWidth < 768 || /Android|iPhone|iPad/i.test(navigator.userAgent));
    const dpr = isMobile ? 0.65 : Math.min(window.devicePixelRatio || 1, 1.25);
    let renderer: Renderer;
    try {
      renderer = new Renderer({
        dpr,
        alpha: true,
        powerPreference: "high-performance",
        premultipliedAlpha: false,
      });
    } catch {
      setHasWebGL(false);
      return;
    }

    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);

    const canvas = gl.canvas;
    canvas.style.position = "absolute";
    canvas.style.inset = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.display = "block";
    canvas.style.pointerEvents = "none";
    container.appendChild(canvas);

    const geometry = new Triangle(gl);

    // Paleta de Vermelho Soberano (Personal OS Red Master)
    // uColor1: Vermelho Carmesim Neon Radiante (#ff073a)
    // uColor2: Vermelho Sanguíneo Vanta Profundo (#8a0012)
    const color1 = [1.0, 0.03, 0.22];
    const color2 = [0.54, 0.0, 0.07];

    let currentMouse = [0.5, 0.5];
    let targetMouse = [0.5, 0.5];

    const program = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: [gl.canvas.width || 1, gl.canvas.height || 1, 1] },
        uSpeed: { value: speed },
        uScale: { value: 1.35 },
        uBrightness: { value: brightness },
        uColor1: { value: color1 },
        uColor2: { value: color2 },
        uNoiseFreq: { value: 2.3 },
        uNoiseAmp: { value: 1.0 },
        uBandHeight: { value: 0.48 },
        uBandSpread: { value: 1.15 },
        uOctaveDecay: { value: 0.12 },
        uLayerOffset: { value: 0.15 },
        uColorSpeed: { value: 0.8 },
        uMouse: { value: new Float32Array([0.5, 0.5]) },
        uMouseInfluence: { value: 0.28 },
        uEnableMouse: { value: interactive ? 1.0 : 0.0 },
        uOpacity: { value: opacity },
      },
    });

    const mesh = new Mesh(gl, { geometry, program });

    let cachedWidth = typeof window !== "undefined" ? window.innerWidth : 1;
    let cachedHeight = typeof window !== "undefined" ? window.innerHeight : 1;

    const handleResize = () => {
      if (!container) return;
      cachedWidth = container.clientWidth || window.innerWidth || 1;
      cachedHeight = container.clientHeight || window.innerHeight || 1;
      renderer.setSize(cachedWidth, cachedHeight);
      program.uniforms.uResolution.value = [
        gl.canvas.width,
        gl.canvas.height,
        gl.canvas.width / (gl.canvas.height || 1),
      ];
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);
    handleResize();

    // Elimina completamente getBoundingClientRect() e reflows durante o touchmove
    const handlePointer = (clientX: number, clientY: number) => {
      targetMouse = [
        clientX / cachedWidth,
        1.0 - (clientY / cachedHeight),
      ];
    };

    const onMouseMove = (e: MouseEvent) => handlePointer(e.clientX, e.clientY);
    const onMouseLeave = () => {
      targetMouse = [0.5, 0.5];
    };

    // No mobile, desativa touchmove no background para garantir 100% da fluidez de scroll nativo
    if (interactive && !isMobile) {
      window.addEventListener("mousemove", onMouseMove, { passive: true });
      window.addEventListener("mouseleave", onMouseLeave, { passive: true });
    }

    let animationFrameId: number;
    let isVisible = true;
    let isScrolling = false;
    let scrollTimeout: ReturnType<typeof setTimeout>;

    const onScroll = () => {
      isScrolling = true;
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        isScrolling = false;
      }, 100);
    };

    if (isMobile) {
      window.addEventListener("scroll", onScroll, { passive: true });
    }

    const onVisibilityChange = () => {
      isVisible = !document.hidden;
    };
    document.addEventListener("visibilitychange", onVisibilityChange, { passive: true });

    let lastRenderTime = 0;
    const animate = (time: number) => {
      animationFrameId = requestAnimationFrame(animate);
      if (!isVisible) return;

      // Durante scroll rápido no mobile, suspende o render do shader para priorizar 120 FPS no compositor
      if (isScrolling && isMobile) return;

      // Limita taxa do shader no mobile para evitar sobrecarga de GPU
      if (isMobile && time - lastRenderTime < 20) return;
      lastRenderTime = time;

      program.uniforms.uTime.value = time * 0.001;

      if (interactive && !isMobile) {
        currentMouse[0] += 0.04 * (targetMouse[0] - currentMouse[0]);
        currentMouse[1] += 0.04 * (targetMouse[1] - currentMouse[1]);
        program.uniforms.uMouse.value[0] = currentMouse[0];
        program.uniforms.uMouse.value[1] = currentMouse[1];
      }

      renderer.render({ scene: mesh });
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      if (isMobile) {
        window.removeEventListener("scroll", onScroll);
        clearTimeout(scrollTimeout);
      }
      if (interactive && !isMobile) {
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseleave", onMouseLeave);
      }
      resizeObserver.disconnect();
      try {
        if (canvas.parentNode === container) {
          container.removeChild(canvas);
        }
      } catch {}
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [opacity, speed, brightness, interactive]);

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 pointer-events-none z-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {/* 1. Camada de Fundo Preto Vanta Profundo com transição para permitir que o shader brilhe */}
      <div className="absolute inset-0 bg-[#040407]" />

      {/* 2. Glows Ambientais Carmesim Subjacentes via Radial Gradients puros (zero overhead de blur filter na GPU) */}
      <div
        className="absolute -top-32 left-1/4 w-[700px] h-[700px] pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(255, 7, 58, 0.14) 0%, transparent 68%)",
        }}
      />
      <div
        className="absolute top-1/3 -right-32 w-[600px] h-[600px] pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(138, 0, 18, 0.20) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute -bottom-24 left-1/3 w-[650px] h-[650px] pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(82, 0, 10, 0.16) 0%, transparent 72%)",
        }}
      />

      {/* 3. Grid Holográfico Sutil de Precisão */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.15) 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
        }}
      />

      {/* Fallback CSS Elegante caso WebGL seja desativado */}
      {!hasWebGL && (
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(255,7,58,0.35),rgba(4,4,7,0.95))]" />
      )}
    </div>
  );
}
