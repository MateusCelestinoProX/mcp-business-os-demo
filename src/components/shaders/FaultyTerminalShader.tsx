"use client";

import React, { useEffect, useRef, useState } from 'react';
import { Renderer, Program, Mesh, Triangle, Color } from 'ogl';
import { isWebGLSupported, cleanupWebGLContext, hexToRgb } from '@/lib/shaders/webgl-utils';

export interface FaultyTerminalShaderProps {
  className?: string;
  scale?: number;
  tint?: string;
  scanlineIntensity?: number;
  glitchAmount?: number;
  flickerAmount?: number;
  noiseAmp?: number;
  brightness?: number;
  opacity?: number;
}

export default function FaultyTerminalShader({
  className = '',
  scale = 1.3,
  tint = '#ff073a',
  scanlineIntensity = 0.85,
  glitchAmount = 0.9,
  flickerAmount = 0.7,
  noiseAmp = 0.9,
  brightness = 1.25,
  opacity = 0.6
}: FaultyTerminalShaderProps) {
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
      attribute vec2 uv;
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    const fragmentShader = `
      precision mediump float;

      varying vec2 vUv;

      uniform float iTime;
      uniform vec3  iResolution;
      uniform float uScale;

      uniform vec2  uGridMul;
      uniform float uDigitSize;
      uniform float uScanlineIntensity;
      uniform float uGlitchAmount;
      uniform float uFlickerAmount;
      uniform float uNoiseAmp;
      uniform vec3  uTint;
      uniform vec2  uMouse;
      uniform float uBrightness;

      float time;

      float hash21(vec2 p){
        p = fract(p * 234.56);
        p += dot(p, p + 34.56);
        return fract(p.x * p.y);
      }

      float noise(vec2 p) {
        return sin(p.x * 10.0) * sin(p.y * (3.0 + sin(time * 0.090909))) + 0.2; 
      }

      mat2 rotate(float angle) {
        float c = cos(angle);
        float s = sin(angle);
        return mat2(c, -s, s, c);
      }

      float fbm(vec2 p) {
        p *= 1.1;
        float f = 0.0;
        float amp = 0.5 * uNoiseAmp;
        
        mat2 modify0 = rotate(time * 0.02);
        f += amp * noise(p);
        p = modify0 * p * 2.0;
        amp *= 0.454545;
        
        mat2 modify1 = rotate(time * 0.02);
        f += amp * noise(p);
        p = modify1 * p * 2.0;
        amp *= 0.454545;
        
        mat2 modify2 = rotate(time * 0.08);
        f += amp * noise(p);
        
        return f;
      }

      float pattern(vec2 p, out vec2 q, out vec2 r) {
        vec2 offset1 = vec2(1.0);
        vec2 offset0 = vec2(0.0);
        mat2 rot01 = rotate(0.1 * time);
        mat2 rot1 = rotate(0.1);
        
        q = vec2(fbm(p + offset1), fbm(rot01 * p + offset1));
        r = vec2(fbm(rot1 * q + offset0), fbm(q + offset0));
        return fbm(p + r);
      }

      float digit(vec2 p){
          vec2 grid = uGridMul * 15.0;
          vec2 s = floor(p * grid) / grid;
          p = p * grid;
          vec2 q, r;
          float intensity = pattern(s * 0.1, q, r) * 1.3 - 0.03;
          
          vec2 mouseWorld = uMouse * uScale;
          float distToMouse = distance(s, mouseWorld);
          float mouseInfluence = exp(-distToMouse * 8.0) * 5.0;
          intensity += mouseInfluence;
          
          float ripple = sin(distToMouse * 20.0 - iTime * 5.0) * 0.1 * mouseInfluence;
          intensity += ripple;
          
          p = fract(p);
          p *= uDigitSize;
          
          float px5 = p.x * 5.0;
          float py5 = (1.0 - p.y) * 5.0;
          float x = fract(px5);
          float y = fract(py5);
          
          float i = floor(py5) - 2.0;
          float j = floor(px5) - 2.0;
          float n = i * i + j * j;
          float f = n * 0.0625;
          
          float isOn = step(0.1, intensity - f);
          float bright = isOn * (0.2 + y * 0.8) * (0.75 + x * 0.25);
          
          return step(0.0, p.x) * step(p.x, 1.0) * step(0.0, p.y) * step(p.y, 1.0) * bright;
      }

      float onOff(float a, float b, float c) {
        return step(c, sin(iTime + a * cos(iTime * b))) * uFlickerAmount;
      }

      float displace(vec2 look) {
          float y = look.y - mod(iTime * 0.25, 1.0);
          float window = 1.0 / (1.0 + 50.0 * y * y);
          return sin(look.y * 20.0 + iTime) * 0.0125 * onOff(4.0, 2.0, 0.8) * (1.0 + cos(iTime * 60.0)) * window;
      }

      vec3 getColor(vec2 p){
          float bar = step(mod(p.y + time * 20.0, 1.0), 0.2) * 0.4 + 1.0;
          bar *= uScanlineIntensity;
          
          float displacement = displace(p);
          p.x += displacement;

          if (uGlitchAmount != 1.0) {
            float extra = displacement * (uGlitchAmount - 1.0);
            p.x += extra;
          }

          float middle = digit(p);
          
          const float off = 0.002;
          float sum = digit(p + vec2(-off, -off)) + digit(p + vec2(0.0, -off)) + digit(p + vec2(off, -off)) +
                      digit(p + vec2(-off, 0.0)) + digit(p + vec2(0.0, 0.0)) + digit(p + vec2(off, 0.0)) +
                      digit(p + vec2(-off, off)) + digit(p + vec2(0.0, off)) + digit(p + vec2(off, off));
          
          vec3 baseColor = vec3(0.9) * middle + sum * 0.15 * vec3(1.0) * bar;
          return baseColor;
      }

      void main() {
          time = iTime * 0.333333;
          vec2 uv = vUv;
          
          vec2 p = uv * uScale;
          vec3 col = getColor(p);

          col *= uTint;
          col *= uBrightness;

          float alpha = clamp(length(col) * 1.6, 0.0, 1.0);
          gl_FragColor = vec4(col, alpha);
      }
    `;

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let renderer: Renderer;
    try {
      renderer = new Renderer({ dpr, alpha: true, powerPreference: 'low-power' });
    } catch (e) {
      setHasWebGL(false);
      return;
    }

    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    const canvas = gl.canvas;
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.display = 'block';
    canvas.style.pointerEvents = 'none';
    container.appendChild(canvas);

    const geometry = new Triangle(gl);
    const tintVec = hexToRgb(tint);

    const program = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        iTime: { value: 0 },
        iResolution: {
          value: new Color(gl.canvas.width || 100, gl.canvas.height || 100, (gl.canvas.width || 100) / (gl.canvas.height || 100))
        },
        uScale: { value: scale },
        uGridMul: { value: new Float32Array([2, 1]) },
        uDigitSize: { value: 1.2 },
        uScanlineIntensity: { value: scanlineIntensity },
        uGlitchAmount: { value: glitchAmount },
        uFlickerAmount: { value: flickerAmount },
        uNoiseAmp: { value: noiseAmp },
        uTint: { value: new Color(tintVec[0], tintVec[1], tintVec[2]) },
        uMouse: { value: new Float32Array([0.5, 0.5]) },
        uBrightness: { value: brightness }
      }
    });

    const mesh = new Mesh(gl, { geometry, program });

    const setSize = () => {
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const w = Math.max(1, Math.floor(rect.width));
      const h = Math.max(1, Math.floor(rect.height));
      renderer.setSize(w, h);
      program.uniforms.iResolution.value = new Color(gl.canvas.width, gl.canvas.height, gl.canvas.width / (gl.canvas.height || 1));
    };

    const ro = new ResizeObserver(setSize);
    ro.observe(container);
    setSize();

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      program.uniforms.uMouse.value = new Float32Array([x, y]);
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
  }, [scale, tint, scanlineIntensity, glitchAmount, flickerAmount, noiseAmp, brightness]);

  if (!hasWebGL) {
    return (
      <div 
        className={`absolute inset-0 pointer-events-none bg-[repeating-linear-gradient(0deg,rgba(0,0,0,0.15),rgba(0,0,0,0.15)_1px,transparent_1px,transparent_2px)] ${className}`}
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
