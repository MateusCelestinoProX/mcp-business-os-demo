"use client";

import React, { useEffect, useRef, useState } from 'react';
import { Renderer, Program, Mesh, Triangle } from 'ogl';
import { isWebGLSupported, hexToRgb } from '@/lib/shaders/webgl-utils';

export interface LineWavesShaderProps {
  className?: string;
  speed?: number;
  innerLineCount?: number;
  outerLineCount?: number;
  warpIntensity?: number;
  rotation?: number;
  edgeFadeWidth?: number;
  brightness?: number;
  color1?: string;
  color2?: string;
  color3?: string;
  opacity?: number;
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
uniform float uInnerLines;
uniform float uOuterLines;
uniform float uWarpIntensity;
uniform float uRotation;
uniform float uEdgeFadeWidth;
uniform float uBrightness;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
uniform float uOpacity;

#define HALF_PI 1.5707963

float hashF(float n) {
  return fract(sin(n * 127.1) * 43758.5453123);
}

float smoothNoise(float x) {
  float i = floor(x);
  float f = fract(x);
  float u = f * f * (3.0 - 2.0 * f);
  return mix(hashF(i), hashF(i + 1.0), u);
}

float displaceA(float coord, float t) {
  float result = sin(coord * 2.123) * 0.2;
  result += sin(coord * 4.345 + t * 0.5) * 0.15;
  result += sin(coord * 8.127 + t * 0.8) * 0.08;
  return result * uWarpIntensity;
}

float displaceB(float coord, float t) {
  float result = cos(coord * 1.876) * 0.22;
  result += cos(coord * 3.987 + t * 0.4) * 0.12;
  result += sin(coord * 7.432 + t * 0.7) * 0.06;
  return result * uWarpIntensity;
}

void main() {
  vec2 fragCoord = gl_FragCoord.xy;
  vec2 uv = (fragCoord - 0.5 * uResolution.xy) / min(uResolution.x, uResolution.y);

  float cosR = cos(uRotation);
  float sinR = sin(uRotation);
  uv = vec2(uv.x * cosR - uv.y * sinR, uv.x * sinR + uv.y * cosR);

  float t = uTime * uSpeed;
  float dispA = displaceA(uv.x, t);
  float dispB = displaceB(uv.x, t);

  float distY = uv.y - dispA;
  float innerWave = abs(sin(distY * uInnerLines * 3.14159));
  float outerWave = abs(sin((uv.y - dispB) * uOuterLines * 3.14159));

  float lines = pow(innerWave, 8.0) * 0.7 + pow(outerWave, 12.0) * 0.5;

  float edgeFade = smoothstep(0.5, 0.5 - uEdgeFadeWidth, abs(uv.y));
  float finalAlpha = lines * edgeFade * uBrightness * uOpacity;

  vec3 col = mix(uColor1, uColor2, smoothstep(-0.3, 0.3, uv.y));
  col = mix(col, uColor3, lines * 0.5);

  gl_FragColor = vec4(col * finalAlpha, finalAlpha);
}
`;

export default function LineWavesShader({
  className = '',
  speed = 0.35,
  innerLineCount = 18,
  outerLineCount = 32,
  warpIntensity = 1.0,
  rotation = 0,
  edgeFadeWidth = 0.25,
  brightness = 1.0,
  color1 = '#8a0012',
  color2 = '#420008',
  color3 = '#b3001a',
  opacity = 0.45,
}: LineWavesShaderProps) {
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
    const rotationRad = (rotation * Math.PI) / 180;

    const program = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: [gl.canvas.width || 1, gl.canvas.height || 1, 1] },
        uSpeed: { value: speed },
        uInnerLines: { value: innerLineCount },
        uOuterLines: { value: outerLineCount },
        uWarpIntensity: { value: warpIntensity },
        uRotation: { value: rotationRad },
        uEdgeFadeWidth: { value: edgeFadeWidth },
        uBrightness: { value: brightness },
        uOpacity: { value: opacity },
        uColor1: { value: hexToRgb(color1) },
        uColor2: { value: hexToRgb(color2) },
        uColor3: { value: hexToRgb(color3) },
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
  }, [speed, innerLineCount, outerLineCount, warpIntensity, rotation, edgeFadeWidth, brightness, color1, color2, color3, opacity]);

  if (!hasWebGL) return null;

  return <div ref={containerRef} className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`} />;
}
