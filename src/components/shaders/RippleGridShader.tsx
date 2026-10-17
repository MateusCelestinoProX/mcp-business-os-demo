"use client";

import React, { useEffect, useRef, useState } from 'react';
import { Renderer, Program, Mesh, Triangle } from 'ogl';
import { isWebGLSupported, cleanupWebGLContext, hexToRgb } from '@/lib/shaders/webgl-utils';

export interface RippleGridShaderProps {
  className?: string;
  gridColor?: string;
  rippleIntensity?: number;
  gridSize?: number;
  gridThickness?: number;
  glowIntensity?: number;
  opacity?: number;
  fadeDistance?: number;
  vignetteStrength?: number;
}

export default function RippleGridShader({
  className = '',
  gridColor = '#ff073a',
  rippleIntensity = 0.065,
  gridSize = 13.0,
  gridThickness = 16.0,
  glowIntensity = 0.28,
  opacity = 0.75,
  fadeDistance = 1.6,
  vignetteStrength = 1.8
}: RippleGridShaderProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [hasWebGL, setHasWebGL] = useState<boolean>(true);

  useEffect(() => {
    if (!isWebGLSupported()) {
      setHasWebGL(false);
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    const rgb = hexToRgb(gridColor);

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let renderer: Renderer;
    try {
      renderer = new Renderer({
        dpr,
        alpha: true,
        powerPreference: 'low-power'
      });
    } catch (e) {
      setHasWebGL(false);
      return;
    }

    const gl = renderer.gl;
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.canvas.style.width = '100%';
    gl.canvas.style.height = '100%';
    gl.canvas.style.position = 'absolute';
    gl.canvas.style.top = '0';
    gl.canvas.style.left = '0';
    gl.canvas.style.pointerEvents = 'none';
    container.appendChild(gl.canvas);

    const vert = `
      attribute vec2 position;
      varying vec2 vUv;
      void main() {
        vUv = position * 0.5 + 0.5;
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    const frag = `
      precision highp float;
      uniform float iTime;
      uniform vec2 iResolution;
      uniform vec3 gridColor;
      uniform float rippleIntensity;
      uniform float gridSize;
      uniform float gridThickness;
      uniform float fadeDistance;
      uniform float vignetteStrength;
      uniform float glowIntensity;
      uniform float opacity;
      uniform vec2 mousePosition;
      uniform float mouseInfluence;
      varying vec2 vUv;

      float pi = 3.14159265;

      void main() {
        vec2 uv = vUv * 2.0 - 1.0;
        uv.x *= iResolution.x / iResolution.y;

        float dist = length(uv);
        float func = sin(pi * (iTime * 0.8 - dist));
        vec2 rippleUv = uv + uv * func * rippleIntensity;

        if (mouseInfluence > 0.0) {
          vec2 mouseUv = (mousePosition * 2.0 - 1.0);
          mouseUv.x *= iResolution.x / iResolution.y;
          float mouseDist = length(uv - mouseUv);
          float influence = mouseInfluence * exp(-mouseDist * mouseDist / 1.0);
          float mouseWave = sin(pi * (iTime * 2.2 - mouseDist * 3.5)) * influence;
          rippleUv += uv * mouseWave * 0.04;
        }

        vec2 g = abs(fract(rippleUv * gridSize - 0.5) - 0.5) / fwidth(rippleUv * gridSize);
        float line = min(g.x, g.y);
        float grid = 1.0 - min(line / gridThickness, 1.0);

        float d = length(uv);
        float fade = exp(-d * fadeDistance);
        float vig = 1.0 - smoothstep(0.4, vignetteStrength, d);

        float glow = exp(-line * 0.15) * glowIntensity;
        float alpha = (grid + glow) * fade * vig * opacity;

        gl_FragColor = vec4(gridColor, alpha);
      }
    `;

    const geometry = new Triangle(gl);
    const program = new Program(gl, {
      vertex: vert,
      fragment: frag,
      uniforms: {
        iTime: { value: 0 },
        iResolution: { value: [gl.canvas.width || 1, gl.canvas.height || 1] },
        gridColor: { value: rgb },
        rippleIntensity: { value: rippleIntensity },
        gridSize: { value: gridSize },
        gridThickness: { value: gridThickness },
        fadeDistance: { value: fadeDistance },
        vignetteStrength: { value: vignetteStrength },
        glowIntensity: { value: glowIntensity },
        opacity: { value: opacity },
        mousePosition: { value: [0.5, 0.5] },
        mouseInfluence: { value: 0.0 }
      }
    });

    const mesh = new Mesh(gl, { geometry, program });

    const setSize = () => {
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const w = Math.max(1, Math.floor(rect.width));
      const h = Math.max(1, Math.floor(rect.height));
      renderer.setSize(w, h);
      program.uniforms.iResolution.value = [gl.canvas.width, gl.canvas.height];
    };

    const ro = new ResizeObserver(setSize);
    ro.observe(container);
    setSize();

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = 1.0 - (e.clientY - rect.top) / rect.height;
      program.uniforms.mousePosition.value = [x, y];
      program.uniforms.mouseInfluence.value = 1.0;
    };
    const handleMouseLeave = () => {
      program.uniforms.mouseInfluence.value = 0.0;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    container.addEventListener('mouseleave', handleMouseLeave);

    let isDestroyed = false;
    let isVisible = true;
    const io = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    }, { threshold: 0.05 });
    io.observe(container);

    // Garantir que mesh possua children inicializado como array para evitar TypeError em OGL
    if (mesh && !mesh.children) {
      mesh.children = [];
    }

    let raf = 0;
    const loop = (time: number) => {
      if (isDestroyed) return;
      raf = requestAnimationFrame(loop);
      if (!isVisible || document.hidden) return;
      if (!gl || (gl.isContextLost && gl.isContextLost())) return;

      try {
        if (program?.uniforms?.iTime) {
          program.uniforms.iTime.value = time * 0.001;
        }
        if (renderer && mesh && Array.isArray(mesh.children)) {
          renderer.render({ scene: mesh });
        }
      } catch (err) {
        // Previne crashes de WebGL durante transições de viewport ou desmontagem
      }
    };
    raf = requestAnimationFrame(loop);

    return () => {
      isDestroyed = true;
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
      try {
        if (gl.canvas && gl.canvas.parentNode) {
          gl.canvas.parentNode.removeChild(gl.canvas);
        }
        cleanupWebGLContext(gl);
      } catch (e) {}
    };
  }, [gridColor, rippleIntensity, gridSize, gridThickness, glowIntensity, opacity, fadeDistance, vignetteStrength]);

  if (!hasWebGL) {
    return (
      <div 
        className={`absolute inset-0 pointer-events-none bg-[radial-gradient(#ff073a_1px,transparent_1px)] [background-size:20px_20px] opacity-15 ${className}`}
        style={{ opacity }}
      />
    );
  }

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 pointer-events-none overflow-hidden transition-opacity duration-700 ${className}`}
      style={{
        opacity,
        maskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)'
      }}
    />
  );
}
