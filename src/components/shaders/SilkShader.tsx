"use client";

import React, { useEffect, useRef, useState } from 'react';
import { Renderer, Program, Mesh, Triangle } from 'ogl';
import { isWebGLSupported, hexToRgb } from '@/lib/shaders/webgl-utils';

export interface SilkShaderProps {
  className?: string;
  speed?: number;
  scale?: number;
  color?: string; // Hex obscured red
  noiseIntensity?: number;
  opacity?: number;
}

const vertexShader = `
attribute vec2 position;
attribute vec2 uv;
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragmentShader = `
precision highp float;

varying vec2 vUv;
uniform float uTime;
uniform vec3 uColor;
uniform float uSpeed;
uniform float uScale;
uniform float uNoiseIntensity;
uniform float uOpacity;

const float e = 2.71828182845904523536;

float noise(vec2 texCoord) {
  float G = e;
  vec2 r = (G * sin(G * texCoord));
  return fract(r.x * r.y * (1.0 + texCoord.x));
}

void main() {
  float rnd = noise(gl_FragCoord.xy);
  vec2 uv = (vUv - 0.5) * uScale;
  float tOffset = uSpeed * uTime;

  uv.y += 0.04 * sin(7.0 * uv.x - tOffset);

  float pattern = 0.5 +
                  0.35 * sin(4.5 * (uv.x + uv.y + cos(2.8 * uv.x + 4.2 * uv.y) + 0.02 * tOffset) +
                             sin(16.0 * (uv.x + uv.y - 0.1 * tOffset)));

  float grain = (rnd / 18.0) * uNoiseIntensity;
  vec3 result = uColor * pattern - vec3(grain);

  float alpha = clamp(length(result) * 1.8, 0.0, 1.0) * uOpacity;
  gl_FragColor = vec4(result * alpha, alpha);
}
`;

export default function SilkShader({
  className = '',
  speed = 0.8,
  scale = 1.2,
  color = '#8a0012',
  noiseIntensity = 1.0,
  opacity = 0.35,
}: SilkShaderProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [hasWebGL, setHasWebGL] = useState<boolean>(true);

  useEffect(() => {
    if (!isWebGLSupported()) {
      setHasWebGL(false);
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const dpr = isMobile
      ? Math.min(window.devicePixelRatio || 1, 1.2)
      : Math.min(window.devicePixelRatio || 1, 1.5);
    let renderer: Renderer;
    try {
      renderer = new Renderer({
        dpr,
        alpha: true,
        powerPreference: 'low-power',
      });
    } catch {
      setHasWebGL(false);
      return;
    }

    const gl = renderer.gl;
    const canvas = gl.canvas;
    canvas.style.position = 'absolute';
    canvas.style.inset = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.display = 'block';
    canvas.style.pointerEvents = 'none';
    container.appendChild(canvas);

    const geometry = new Triangle(gl);
    const rgb = hexToRgb(color);

    const program = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: rgb },
        uSpeed: { value: speed },
        uScale: { value: scale },
        uNoiseIntensity: { value: noiseIntensity },
        uOpacity: { value: opacity },
      },
    });

    const mesh = new Mesh(gl, { geometry, program });

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 1;
      const h = container.clientHeight || 1;
      renderer.setSize(w, h);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    let isVisible = true;
    let io: IntersectionObserver | null = null;
    if (typeof IntersectionObserver !== 'undefined') {
      io = new IntersectionObserver(
        ([entry]) => {
          isVisible = entry.isIntersecting;
        },
        { threshold: 0.05 }
      );
      io.observe(container);
    }

    let raf = 0;
    const loop = (time: number) => {
      raf = requestAnimationFrame(loop);
      if (!isVisible || document.hidden) return;
      program.uniforms.uTime.value = time * 0.001;
      renderer.render({ scene: mesh });
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', handleResize);
      if (io) io.disconnect();
      try {
        if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
        gl.getExtension('WEBGL_lose_context')?.loseContext();
      } catch {
        // Safe disposal
      }
    };
  }, [speed, scale, color, noiseIntensity, opacity]);

  if (!hasWebGL) return null;

  return <div ref={containerRef} className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`} />;
}
