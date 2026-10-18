"use client";

import React, { useEffect, useRef, useState } from 'react';
import { Renderer, Program, Mesh, Triangle } from 'ogl';
import { isWebGLSupported, hexToRgb } from '@/lib/shaders/webgl-utils';

export interface LiquidChromeShaderProps {
  className?: string;
  baseColor?: string; // Hex obscured red
  speed?: number;
  amplitude?: number;
  frequencyX?: number;
  frequencyY?: number;
  opacity?: number;
}

export default function LiquidChromeShader({
  className = '',
  baseColor = '#8a0012',
  speed = 0.25,
  amplitude = 0.3,
  frequencyX = 2.5,
  frequencyY = 2.5,
  opacity = 0.35,
}: LiquidChromeShaderProps) {
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
      uniform float uTime;
      uniform vec3 uResolution;
      uniform vec3 uBaseColor;
      uniform float uAmplitude;
      uniform float uFrequencyX;
      uniform float uFrequencyY;
      uniform float uOpacity;
      varying vec2 vUv;

      vec4 renderImage(vec2 uvCoord) {
        vec2 fragCoord = uvCoord * uResolution.xy;
        vec2 uv = (2.0 * fragCoord - uResolution.xy) / min(uResolution.x, uResolution.y);

        for (float i = 1.0; i < 8.0; i++){
          uv.x += (uAmplitude / i) * cos(i * uFrequencyX * uv.y + uTime);
          uv.y += (uAmplitude / i) * cos(i * uFrequencyY * uv.x + uTime);
        }

        float wave = abs(sin(uTime - uv.y - uv.x));
        vec3 color = uBaseColor / max(wave, 0.15);
        color = clamp(color, vec3(0.0), vec3(1.0));
        return vec4(color, 1.0);
      }

      void main() {
        vec4 col = renderImage(vUv);
        float alpha = clamp(max(col.r, max(col.g, col.b)) * 1.5, 0.0, 1.0) * uOpacity;
        gl_FragColor = vec4(col.rgb * alpha, alpha);
      }
    `;

    const geometry = new Triangle(gl);
    const rgb = hexToRgb(baseColor);

    const program = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: [gl.canvas.width || 1, gl.canvas.height || 1, 1] },
        uBaseColor: { value: new Float32Array([rgb[0] * 0.45, rgb[1] * 0.45, rgb[2] * 0.45]) },
        uAmplitude: { value: amplitude },
        uFrequencyX: { value: frequencyX },
        uFrequencyY: { value: frequencyY },
        uOpacity: { value: opacity },
      },
    });

    const mesh = new Mesh(gl, { geometry, program });

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 1;
      const h = container.clientHeight || 1;
      renderer.setSize(w, h);
      program.uniforms.uResolution.value = [w * dpr, h * dpr, w / h];
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
      program.uniforms.uTime.value = time * 0.001 * speed;
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
  }, [baseColor, speed, amplitude, frequencyX, frequencyY, opacity]);

  if (!hasWebGL) return null;

  return <div ref={containerRef} className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`} />;
}
