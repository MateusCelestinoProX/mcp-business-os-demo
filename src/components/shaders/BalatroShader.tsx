"use client";

import React, { useEffect, useRef, useState } from 'react';
import { Renderer, Program, Mesh, Triangle } from 'ogl';
import { isWebGLSupported, cleanupWebGLContext, hexToVec4 } from '@/lib/shaders/webgl-utils';

export interface BalatroShaderProps {
  className?: string;
  spinRotation?: number;
  spinSpeed?: number;
  contrast?: number;
  lighting?: number;
  spinAmount?: number;
  pixelFilter?: number;
  color1?: string;
  color2?: string;
  color3?: string;
  opacity?: number;
}

export default function BalatroShader({
  className = '',
  spinRotation = -1.8,
  spinSpeed = 6.0,
  contrast = 3.2,
  lighting = 0.45,
  spinAmount = 0.25,
  pixelFilter = 750.0,
  color1 = '#ff073a',
  color2 = '#9b0016',
  color3 = '#0e0003',
  opacity = 0.55
}: BalatroShaderProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [hasWebGL, setHasWebGL] = useState<boolean>(true);

  useEffect(() => {
    if (!isWebGLSupported()) {
      setHasWebGL(false);
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    const vertexShader = `
      attribute vec2 position;
      void main() { gl_Position = vec4(position, 0, 1); }
    `;

    const fragmentShader = `
      precision highp float;
      #define PI 3.14159265359

      uniform float iTime;
      uniform vec3 iResolution;
      uniform float uSpinRotation;
      uniform float uSpinSpeed;
      uniform vec4 uColor1;
      uniform vec4 uColor2;
      uniform vec4 uColor3;
      uniform float uContrast;
      uniform float uLighting;
      uniform float uSpinAmount;
      uniform float uPixelFilter;
      uniform vec2 uMouse;

      void main() {
        vec2 screenSize = iResolution.xy;
        vec2 screen_coords = gl_FragCoord.xy;
        float pixel_size = length(screenSize.xy) / uPixelFilter;
        vec2 uv = (floor(screen_coords.xy * (1.0 / pixel_size)) * pixel_size - 0.5 * screenSize.xy) / length(screenSize.xy);
        float uv_len = length(uv);
        
        float speed = (uSpinRotation * 0.2) * iTime + 302.2;
        float mouseInfluence = (uMouse.x * 2.0 - 1.0);
        speed += mouseInfluence * 0.15;
        
        float new_pixel_angle = atan(uv.y, uv.x) + speed - 20.0 * (uSpinAmount * uv_len + (1.0 - uSpinAmount));
        vec2 mid = (screenSize.xy / length(screenSize.xy)) / 2.0;
        uv = (vec2(uv_len * cos(new_pixel_angle) + mid.x, uv_len * sin(new_pixel_angle) + mid.y) - mid);
        
        uv *= 26.0;
        float baseSpeed = iTime * uSpinSpeed;
        speed = baseSpeed + mouseInfluence * 2.0;
        
        vec2 uv2 = vec2(uv.x + uv.y);
        for(int i = 0; i < 5; i++) {
            uv2 += sin(max(uv.x, uv.y)) + uv;
            uv += 0.5 * vec2(cos(5.1123314 + 0.353 * uv2.y + speed * 0.131121), sin(uv2.x - 0.113 * speed));
            uv -= cos(uv.x + uv.y) - sin(uv.x * 0.711 - uv.y);
        }
        
        float contrast_mod = (0.25 * uContrast + 0.5 * uSpinAmount + 1.2);
        float paint_res = min(2.0, max(0.0, length(uv) * 0.035 * contrast_mod));
        float c1p = max(0.0, 1.0 - contrast_mod * abs(1.0 - paint_res));
        float c2p = max(0.0, 1.0 - contrast_mod * abs(paint_res));
        float c3p = 1.0 - min(1.0, c1p + c2p);
        float light = (uLighting - 0.2) * max(c1p * 5.0 - 4.0, 0.0) + uLighting * max(c2p * 5.0 - 4.0, 0.0);
        
        gl_FragColor = (0.3 / uContrast) * uColor1 + (1.0 - 0.3 / uContrast) * (uColor1 * c1p + uColor2 * c2p + vec4(c3p * uColor3.rgb, c3p * uColor1.a)) + light;
      }
    `;

    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const dpr = isMobile
      ? Math.min(window.devicePixelRatio || 1, 1.2)
      : Math.min(window.devicePixelRatio || 1, 1.5);
    let renderer: Renderer;
    try {
      renderer = new Renderer({ dpr, antialias: false, powerPreference: 'low-power' });
    } catch (e) {
      setHasWebGL(false);
      return;
    }

    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 1);
    const canvas = gl.canvas;
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.display = 'block';
    canvas.style.pointerEvents = 'none';
    container.appendChild(canvas);

    const geometry = new Triangle(gl);
    const program = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        iTime: { value: 0 },
        iResolution: { value: [gl.canvas.width || 1, gl.canvas.height || 1, 1] },
        uSpinRotation: { value: spinRotation },
        uSpinSpeed: { value: spinSpeed },
        uColor1: { value: hexToVec4(color1) },
        uColor2: { value: hexToVec4(color2) },
        uColor3: { value: hexToVec4(color3) },
        uContrast: { value: contrast },
        uLighting: { value: lighting },
        uSpinAmount: { value: spinAmount },
        uPixelFilter: { value: pixelFilter },
        uMouse: { value: [0.5, 0.5] }
      }
    });

    const mesh = new Mesh(gl, { geometry, program });

    const setSize = () => {
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const w = Math.max(1, Math.floor(rect.width));
      const h = Math.max(1, Math.floor(rect.height));
      renderer.setSize(w, h);
      program.uniforms.iResolution.value = [gl.canvas.width, gl.canvas.height, gl.canvas.width / (gl.canvas.height || 1)];
    };

    const ro = new ResizeObserver(setSize);
    ro.observe(container);
    setSize();

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = 1.0 - (e.clientY - rect.top) / rect.height;
      program.uniforms.uMouse.value = [x, y];
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    let isVisible = true;
    const io = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    }, { threshold: 0.05 });
    io.observe(container);

    let raf = 0;
    const loop = (time: number) => {
      raf = requestAnimationFrame(loop);
      if (!isVisible || document.hidden) return;

      program.uniforms.iTime.value = time * 0.001;
      renderer.render({ scene: mesh });
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener('mousemove', handleMouseMove);
      try {
        if (canvas && canvas.parentNode) {
          canvas.parentNode.removeChild(canvas);
        }
        cleanupWebGLContext(gl);
      } catch (e) {}
    };
  }, [spinRotation, spinSpeed, contrast, lighting, spinAmount, pixelFilter, color1, color2, color3]);

  if (!hasWebGL) {
    return (
      <div 
        className={`absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,_rgba(255,7,58,0.2),_rgba(3,3,5,0.9))] ${className}`}
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
