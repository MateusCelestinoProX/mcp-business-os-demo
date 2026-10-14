"use client";

import React, { useEffect, useRef, useState } from 'react';
import { Renderer, Program, Mesh, Triangle } from 'ogl';
import { isWebGLSupported, cleanupWebGLContext } from '@/lib/shaders/webgl-utils';

export interface LightningShaderProps {
  className?: string;
  speed?: number;
  intensity?: number;
  size?: number;
  xOffset?: number;
  opacity?: number;
}

export default function LightningShader({
  className = '',
  speed = 1.15,
  intensity = 1.7,
  size = 1.1,
  xOffset = 0.0,
  opacity = 0.65
}: LightningShaderProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [hasWebGL, setHasWebGL] = useState<boolean>(true);

  useEffect(() => {
    if (!isWebGLSupported()) {
      setHasWebGL(false);
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let renderer: Renderer;
    try {
      renderer = new Renderer({
        dpr,
        alpha: true,
        premultipliedAlpha: false,
        powerPreference: 'low-power'
      });
    } catch (e) {
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

    const vertex = `
      attribute vec2 position;
      void main() {
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    const fragment = `
      precision highp float;
      uniform vec2 iResolution;
      uniform float iTime;
      uniform float uSpeed;
      uniform float uIntensity;
      uniform float uSize;
      uniform float uXOffset;

      #define OCTAVE_COUNT 8

      float hash11(float p) {
        p = fract(p * .1031);
        p *= p + 33.33;
        p *= p + p;
        return fract(p);
      }

      float hash12(vec2 p) {
        vec3 p3 = fract(vec3(p.xyx) * .1031);
        p3 += dot(p3, p3.yzx + 33.33);
        return fract((p3.x + p3.y) * p3.z);
      }

      mat2 rotate2d(float theta) {
        float c = cos(theta);
        float s = sin(theta);
        return mat2(c, -s, s, c);
      }

      float noise(vec2 p) {
        vec2 ip = floor(p);
        vec2 fp = fract(p);
        float a = hash12(ip);
        float b = hash12(ip + vec2(1.0, 0.0));
        float c = hash12(ip + vec2(0.0, 1.0));
        float d = hash12(ip + vec2(1.0, 1.0));
        vec2 t = smoothstep(0.0, 1.0, fp);
        return mix(mix(a, b, t.x), mix(c, d, t.x), t.y);
      }

      float fbm(vec2 p) {
        float value = 0.0;
        float amplitude = 0.5;
        for (int i = 0; i < OCTAVE_COUNT; ++i) {
          value += amplitude * noise(p);
          p *= rotate2d(0.45);
          p *= 2.0;
          amplitude *= 0.5;
        }
        return value;
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / iResolution.xy;
        uv = 2.0 * uv - 1.0;
        uv.x *= iResolution.x / iResolution.y;
        uv.x += uXOffset;
        uv += 1.8 * fbm(uv * uSize + 0.8 * iTime * uSpeed) - 0.9;
        
        float dist = abs(uv.x);
        
        vec3 darkBlood = vec3(0.35, 0.0, 0.04);
        vec3 deepCrimson = vec3(0.62, 0.01, 0.08);
        vec3 rubyCore = vec3(0.82, 0.02, 0.12);

        float flash = mix(0.015, 0.075, hash11(iTime * uSpeed * 1.5));
        float energy = pow(flash / max(dist, 0.001), 1.05) * uIntensity;

        vec3 col = mix(darkBlood, deepCrimson, clamp(energy * 0.45, 0.0, 1.0));
        col = mix(col, rubyCore, clamp((energy - 1.1) * 0.6, 0.0, 1.0));
        col *= energy;

        float alpha = clamp(max(col.r, max(col.g, col.b)), 0.0, 1.0);
        gl_FragColor = vec4(col, alpha);
      }
    `;

    const geometry = new Triangle(gl);
    const uniforms = {
      iResolution: { value: [gl.canvas.width || 1, gl.canvas.height || 1] },
      iTime: { value: 0 },
      uSpeed: { value: speed },
      uIntensity: { value: intensity },
      uSize: { value: size },
      uXOffset: { value: xOffset }
    };

    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms
    });

    const mesh = new Mesh(gl, { geometry, program });

    const resize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth || 1;
      const h = container.clientHeight || window.innerHeight || 1;
      renderer.setSize(w, h);
      uniforms.iResolution.value = [gl.canvas.width, gl.canvas.height];
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    let isVisible = true;
    const io = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    }, { threshold: 0.05 });
    io.observe(container);

    let raf = 0;
    const startTime = performance.now();
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (!isVisible || document.hidden) return;

      uniforms.iTime.value = (now - startTime) * 0.001;
      renderer.render({ scene: mesh });
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      try {
        if (canvas && canvas.parentNode) {
          canvas.parentNode.removeChild(canvas);
        }
        cleanupWebGLContext(gl);
      } catch (e) {}
    };
  }, [speed, intensity, size, xOffset]);

  if (!hasWebGL) {
    return (
      <div 
        className={`absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_rgba(255,7,58,0.25)_0%,_transparent_70%)] ${className}`}
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
