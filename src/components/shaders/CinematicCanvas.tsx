'use client';

import React, { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { isWebGLAvailable, hexToRgb, hexToHueShift } from '@/lib/shaders/webgl-utils';

// Carregamento dinâmico SSR-Safe para sub-shaders pesados
const Beams = dynamic(() => import('./Beams'), { ssr: false });
const ColorBends = dynamic(() => import('./ColorBends'), { ssr: false });
const Galaxy = dynamic(() => import('./Galaxy'), { ssr: false });
const GridScanShader = dynamic(() => import('./GridScanShader'), { ssr: false });

export type ShaderMode =
  | 'darkveil'
  | 'strands'
  | 'balatro'
  | 'liquid'
  | 'beams'
  | 'colorbends'
  | 'galaxy'
  | 'gridscan';

export type CinematicShaderMode = ShaderMode;


export interface CinematicCanvasProps {
  shaderStep?: number; // 1: DarkVeil, 2: Strands, 3: Balatro, 4: LiquidEther, 5: Beams, 6: ColorBends, 7: Galaxy, 8: GridScan
  mode?: ShaderMode;
  colorHex?: string;
  opacity?: number;
  className?: string;
  style?: React.CSSProperties;
}

const vsSource = `
  attribute vec2 aPosition;
  varying vec2 vUv;
  void main() {
    vUv = aPosition * 0.5 + 0.5;
    gl_Position = vec4(aPosition, 0.0, 1.0);
  }
`;

const fsSource = `
  precision highp float;
  uniform vec2 uResolution;
  uniform float uTime;
  uniform vec3 uColor;
  uniform float uStep;
  varying vec2 vUv;

  void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * uResolution) / max(uResolution.y, 0.0001);
    float t = uTime * 0.6;

    vec3 col = vec3(0.02, 0.02, 0.04);

    if (uStep == 1.0) {
      // DarkVeil
      float w1 = sin(uv.x * 4.0 + t) * cos(uv.y * 3.5 - t * 0.9);
      float w2 = cos(uv.x * 6.0 - t * 1.4) * sin(uv.y * 5.0 + t * 1.1);
      float wave = (w1 + w2) * 0.5;
      col = mix(col, uColor, smoothstep(-0.6, 0.7, wave));
      col += uColor * pow(max(0.0, wave), 2.0) * 0.5;
    } else if (uStep == 2.0) {
      // Strands
      for (int i = 0; i < 5; i++) {
        float fi = float(i);
        float freq = (2.0 + fi * 0.6);
        float spd = 1.2 + fi * 0.5;
        float w = sin(uv.x * freq + t * spd) * 0.35;
        float d = abs(uv.y - w);
        float glow = 0.03 / (d + 0.025);
        col += uColor * (glow * glow) * 0.6;
      }
    } else if (uStep == 3.0) {
      // Balatro
      float len = length(uv);
      float angle = atan(uv.y, uv.x) + t * 0.45;
      vec2 rotUv = vec2(len * cos(angle), len * sin(angle)) * 6.0;
      for(int i = 0; i < 3; i++) {
        rotUv += sin(rotUv.yx + vec2(t * 0.5, t * 0.4));
      }
      float pattern = sin(rotUv.x + rotUv.y) * 0.5 + 0.5;
      col = mix(col, uColor, pattern * 0.7);
      col += uColor * pow(pattern, 3.0) * 0.5;
    } else {
      // LiquidEther
      vec2 q = vec2(sin(uv.x * 2.5 + t * 0.5), cos(uv.y * 2.5 + t * 0.4));
      vec2 r = vec2(sin(uv.x + 4.5 * q.x + t * 0.6), cos(uv.y + 4.5 * q.y + t * 0.5));
      float f = sin(uv.x * r.x + uv.y * r.y) * 0.5 + 0.5;
      col = mix(col, uColor, clamp(f * f * 2.2, 0.0, 1.0));
    }

    float vignette = length(uv);
    col *= smoothstep(1.4, 0.3, vignette);

    gl_FragColor = vec4(col * 1.1, 1.0);
  }
`;

function resolveEffectiveStep(step?: number, mode?: ShaderMode): number {
  if (step !== undefined && step >= 1 && step <= 8) {
    return step;
  }
  if (!mode) return 1;
  switch (mode) {
    case 'darkveil':
      return 1;
    case 'strands':
      return 2;
    case 'balatro':
      return 3;
    case 'liquid':
      return 4;
    case 'beams':
      return 5;
    case 'colorbends':
      return 6;
    case 'galaxy':
      return 7;
    case 'gridscan':
      return 8;
    default:
      return 1;
  }
}

export default function CinematicCanvas({
  shaderStep,
  mode,
  colorHex = '#FF073A',
  opacity = 0.85,
  className = '',
  style = {},
}: CinematicCanvasProps) {
  const effectiveStep = resolveEffectiveStep(shaderStep, mode);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [hasWebGL, setHasWebGL] = useState<boolean>(true);

  useEffect(() => {
    if (!isWebGLAvailable()) {
      setHasWebGL(false);
    }
  }, []);

  // WebGL Nativo para Passos 1 a 4 (DarkVeil, Strands, Balatro, LiquidEther)
  useEffect(() => {
    if (effectiveStep > 4 || !hasWebGL) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = (canvas.getContext('webgl2') || canvas.getContext('webgl')) as WebGLRenderingContext | null;
    if (!gl) {
      setHasWebGL(false);
      return;
    }

    let animFrameId: number;
    let time = 0;
    let lastTime = performance.now();
    let isVisible = true;

    const resize = () => {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = (canvas.parentElement?.clientWidth || window.innerWidth) * dpr;
      canvas.height = (canvas.parentElement?.clientHeight || window.innerHeight) * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    window.addEventListener('resize', resize, { passive: true });
    resize();

    const createShader = (type: number, source: string) => {
      const s = gl.createShader(type);
      if (!s) return null;
      gl.shaderSource(s, source);
      gl.compileShader(s);
      return s;
    };

    const vs = createShader(gl.VERTEX_SHADER, vsSource);
    const fs = createShader(gl.FRAGMENT_SHADER, fsSource);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;

    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    gl.useProgram(program);

    const posBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
        -1, -1,  1, -1, -1,  1,
        -1,  1,  1, -1,  1,  1
      ]),
      gl.STATIC_DRAW
    );

    const posLoc = gl.getAttribLocation(program, 'aPosition');
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const resLoc = gl.getUniformLocation(program, 'uResolution');
    const timeLoc = gl.getUniformLocation(program, 'uTime');
    const colorLoc = gl.getUniformLocation(program, 'uColor');
    const stepLoc = gl.getUniformLocation(program, 'uStep');

    let io: IntersectionObserver | null = null;
    if (typeof IntersectionObserver !== 'undefined') {
      io = new IntersectionObserver(([entry]) => {
        isVisible = entry.isIntersecting;
      }, { threshold: 0.05 });
      io.observe(canvas);
    }

    const onVisibilityChange = () => {
      isVisible = !document.hidden;
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    const render = (timestamp: number) => {
      animFrameId = requestAnimationFrame(render);
      if (!isVisible || document.hidden) return;

      const dt = (timestamp - lastTime) * 0.001;
      lastTime = timestamp;
      time += dt;

      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.uniform2f(resLoc, canvas.width, canvas.height);
      gl.uniform1f(timeLoc, time);
      gl.uniform1f(stepLoc, effectiveStep);

      const [r, g, b] = hexToRgb(colorHex);
      gl.uniform3f(colorLoc, r, g, b);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
    };

    animFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', resize);
      if (io) io.disconnect();
      document.removeEventListener('visibilitychange', onVisibilityChange);
      cancelAnimationFrame(animFrameId);

      // Limpeza estrita de recursos WebGL nativos
      try {
        if (posBuf) gl.deleteBuffer(posBuf);
        if (vs) gl.deleteShader(vs);
        if (fs) gl.deleteShader(fs);
        if (program) gl.deleteProgram(program);
        gl.getExtension('WEBGL_lose_context')?.loseContext();
      } catch {
        // Safe disposal
      }
    };
  }, [effectiveStep, colorHex, hasWebGL]);

  // Fallback se WebGL desabilitado
  if (!hasWebGL) {
    return (
      <div
        className={`fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden ${className}`}
        style={{
          ...style,
          opacity,
          background: 'radial-gradient(ellipse at 50% 50%, rgba(255, 7, 58, 0.12) 0%, rgba(5, 5, 8, 0.98) 75%, #000000 100%)',
        }}
      />
    );
  }

  // Passo 5: Beams
  if (effectiveStep === 5) {
    return (
      <div
        className={`fixed inset-0 w-full h-full pointer-events-none z-0 ${className}`}
        style={{ ...style, opacity }}
      >
        <Beams
          lightColor={colorHex}
          beamWidth={2.5}
          beamHeight={18}
          beamNumber={14}
          speed={2.2}
          noiseIntensity={1.5}
        />
      </div>
    );
  }

  // Passo 6: ColorBends
  if (effectiveStep === 6) {
    return (
      <div
        className={`fixed inset-0 w-full h-full pointer-events-none z-0 ${className}`}
        style={{ ...style, opacity }}
      >
        <ColorBends
          colors={[colorHex, '#000000', colorHex]}
          rotation={45}
          speed={0.3}
          scale={1.2}
          frequency={1.5}
          warpStrength={1.2}
          intensity={1.8}
        />
      </div>
    );
  }

  // Passo 7: Galaxy
  if (effectiveStep === 7) {
    const hueShift = hexToHueShift(colorHex);
    return (
      <div
        className={`fixed inset-0 w-full h-full pointer-events-none z-0 ${className}`}
        style={{ ...style, opacity }}
      >
        <Galaxy
          hueShift={hueShift}
          density={1.6}
          glowIntensity={0.9}
          saturation={1.0}
          starSpeed={0.8}
          mouseInteraction={true}
          mouseRepulsion={true}
        />
      </div>
    );
  }

  // Passo 8: GridScan
  if (effectiveStep === 8) {
    return (
      <div
        className={`fixed inset-0 w-full h-full pointer-events-none z-0 ${className}`}
        style={{ ...style, opacity }}
      >
        <GridScanShader
          scanColor={colorHex}
          linesColor="#3a000c"
          gridScale={0.1}
          bloomIntensity={0.85}
          scanDuration={2.2}
        />
      </div>
    );
  }

  // Passos 1 a 4: WebGL Nativo
  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 w-full h-full pointer-events-none z-0 ${className}`}
      style={{ ...style, opacity }}
    />
  );
}
