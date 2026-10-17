'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { isWebGLAvailable, srgbColor, smoothDampVec2 } from '@/lib/shaders/webgl-utils';

export interface GridScanShaderProps {
  className?: string;
  style?: React.CSSProperties;
  linesColor?: string;
  scanColor?: string;
  lineThickness?: number;
  gridScale?: number;
  bloomIntensity?: number;
  scanDuration?: number;
  scanGlow?: number;
  scanOnClick?: boolean;
  opacity?: number;
}

const vertSource = `
varying vec2 vUv;
void main(){
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

const fragSource = `
precision highp float;
uniform vec3 iResolution;
uniform float iTime;
uniform vec2 uSkew;
uniform float uTilt;
uniform float uYaw;
uniform float uLineThickness;
uniform vec3 uLinesColor;
uniform vec3 uScanColor;
uniform float uGridScale;
uniform float uLineStyle;
uniform float uLineJitter;
uniform float uScanOpacity;
uniform float uScanDirection;
uniform float uNoise;
uniform float uBloomOpacity;
uniform float uScanGlow;
uniform float uScanSoftness;
uniform float uPhaseTaper;
uniform float uScanDuration;
uniform float uScanDelay;
varying vec2 vUv;

uniform float uScanStarts[8];
uniform float uScanCount;

const int MAX_SCANS = 8;

float smoother01(float a, float b, float x){
  float t = clamp((x - a) / max(1e-5, (b - a)), 0.0, 1.0);
  return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
}

void mainImage(out vec4 fragColor, in vec2 fragCoord)
{
    vec2 p = (2.0 * fragCoord - iResolution.xy) / max(iResolution.y, 0.0001);

    vec3 ro = vec3(0.0);
    vec3 rd = normalize(vec3(p, 2.0));

    float cR = cos(uTilt), sR = sin(uTilt);
    rd.xy = mat2(cR, -sR, sR, cR) * rd.xy;

    float cY = cos(uYaw), sY = sin(uYaw);
    rd.xz = mat2(cY, -sY, sY, cY) * rd.xz;

    vec2 skew = clamp(uSkew, vec2(-0.7), vec2(0.7));
    rd.xy += skew * rd.z;

    float minT = 1e20;
    float gridScale = max(1e-5, uGridScale);
    float fadeStrength = 1.8;
    vec2 gridUV = vec2(0.0);

    float hitIsY = 1.0;
    for (int i = 0; i < 4; i++)
    {
        float isY = float(i < 2);
        float pos = mix(-0.25, 0.25, float(i)) * isY + mix(-0.5, 0.5, float(i - 2)) * (1.0 - isY);
        float num = pos - (isY * ro.y + (1.0 - isY) * ro.x);
        float den = isY * rd.y + (1.0 - isY) * rd.x;
        float t = num / max(den, 1e-5);
        vec3 h = ro + rd * t;

        float depthBoost = smoothstep(0.0, 3.0, h.z);
        h.xy += skew * 0.15 * depthBoost;

        bool use = t > 0.0 && t < minT;
        gridUV = use ? mix(h.zy, h.xz, isY) / gridScale : gridUV;
        minT = use ? t : minT;
        hitIsY = use ? isY : hitIsY;
    }

    vec3 hit = ro + rd * minT;
    float dist = length(hit - ro);

    float jitterAmt = clamp(uLineJitter, 0.0, 1.0);
    if (jitterAmt > 0.0) {
      vec2 j = vec2(
        sin(gridUV.y * 2.7 + iTime * 1.8),
        cos(gridUV.x * 2.3 - iTime * 1.6)
      ) * (0.15 * jitterAmt);
      gridUV += j;
    }
    float fx = fract(gridUV.x);
    float fy = fract(gridUV.y);
    float ax = min(fx, 1.0 - fx);
    float ay = min(fy, 1.0 - fy);
    float wx = fwidth(gridUV.x);
    float wy = fwidth(gridUV.y);
    float halfPx = max(0.0, uLineThickness) * 0.5;

    float tx = halfPx * wx;
    float ty = halfPx * wy;

    float aax = wx;
    float aay = wy;

    float lineX = 1.0 - smoothstep(tx, tx + aax, ax);
    float lineY = 1.0 - smoothstep(ty, ty + aay, ay);
    float primaryMask = max(lineX, lineY);

    vec2 gridUV2 = (hitIsY > 0.5 ? hit.xz : hit.zy) / gridScale;
    float fx2 = fract(gridUV2.x);
    float fy2 = fract(gridUV2.y);
    float ax2 = min(fx2, 1.0 - fx2);
    float ay2 = min(fy2, 1.0 - fy2);
    float wx2 = fwidth(gridUV2.x);
    float wy2 = fwidth(gridUV2.y);
    float tx2 = halfPx * wx2;
    float ty2 = halfPx * wy2;
    float lineX2 = 1.0 - smoothstep(tx2, tx2 + wx2, ax2);
    float lineY2 = 1.0 - smoothstep(ty2, ty2 + wy2, ay2);
    float altMask = max(lineX2, lineY2);

    float edgeDistX = min(abs(hit.x - (-0.5)), abs(hit.x - 0.5));
    float edgeDistY = min(abs(hit.y - (-0.25)), abs(hit.y - 0.25));
    float edgeDist = mix(edgeDistY, edgeDistX, hitIsY);
    float edgeGate = 1.0 - smoothstep(gridScale * 0.5, gridScale * 2.0, edgeDist);
    altMask *= edgeGate;

    float lineMask = max(primaryMask, altMask);
    float fade = exp(-dist * fadeStrength);

    float dur = max(0.05, uScanDuration);
    float del = max(0.0, uScanDelay);
    float scanZMax = 2.0;
    float widthScale = max(0.1, uScanGlow);
    float sigma = max(0.001, 0.18 * widthScale * uScanSoftness);
    float sigmaA = sigma * 2.0;

    float combinedPulse = 0.0;
    float combinedAura = 0.0;

    float cycle = dur + del;
    float tCycle = mod(iTime, cycle);
    float phase = (tCycle < dur) ? (tCycle / dur) : (1.0 - (tCycle - dur) / dur);

    float scanZ = phase * scanZMax;
    float dz = abs(hit.z - scanZ);
    float lineBand = exp(-0.5 * (dz * dz) / (sigma * sigma));
    float taper = clamp(uPhaseTaper, 0.0, 0.49);
    float headFade = smoother01(0.0, taper, phase);
    float tailFade = 1.0 - smoother01(1.0 - taper, 1.0, phase);
    float phaseWindow = headFade * tailFade;
    float pulseBase = lineBand * phaseWindow;
    combinedPulse += pulseBase * clamp(uScanOpacity, 0.0, 1.0);
    float auraBand = exp(-0.5 * (dz * dz) / (sigmaA * sigmaA));
    combinedAura += (auraBand * 0.35) * phaseWindow * clamp(uScanOpacity, 0.0, 1.0);

    for (int i = 0; i < MAX_SCANS; i++) {
      if (float(i) >= uScanCount) break;
      float tActiveI = iTime - uScanStarts[i];
      float phaseI = clamp(tActiveI / dur, 0.0, 1.0);
      phaseI = (phaseI < 0.5) ? (phaseI * 2.0) : (1.0 - (phaseI - 0.5) * 2.0);
      float scanZI = phaseI * scanZMax;
      float dzI = abs(hit.z - scanZI);
      float lineBandI = exp(-0.5 * (dzI * dzI) / (sigma * sigma));
      float headFadeI = smoother01(0.0, taper, phaseI);
      float tailFadeI = 1.0 - smoother01(1.0 - taper, 1.0, phaseI);
      float phaseWindowI = headFadeI * tailFadeI;
      combinedPulse += lineBandI * phaseWindowI * clamp(uScanOpacity, 0.0, 1.0);
      float auraBandI = exp(-0.5 * (dzI * dzI) / (sigmaA * sigmaA));
      combinedAura += (auraBandI * 0.35) * phaseWindowI * clamp(uScanOpacity, 0.0, 1.0);
    }

    float lineVis = lineMask;
    vec3 gridCol = uLinesColor * lineVis * fade;
    vec3 scanCol = uScanColor * combinedPulse;
    vec3 scanAura = uScanColor * combinedAura * 1.4;

    vec3 color = gridCol + scanCol + scanAura;
    color += vec3(1.0, 0.8, 0.8) * pow(combinedPulse, 3.0) * 0.9;

    float n = fract(sin(dot(gl_FragCoord.xy + vec2(iTime * 123.4), vec2(12.9898,78.233))) * 43758.5453123);
    color += (n - 0.5) * uNoise;
    color = clamp(color, 0.0, 1.0);
    
    float alpha = clamp(max(lineVis * 0.8, combinedPulse + combinedAura), 0.0, 1.0);
    float gx = 1.0 - smoothstep(tx * 2.0, tx * 2.0 + aax * 2.0, ax);
    float gy = 1.0 - smoothstep(ty * 2.0, ty * 2.0 + aay * 2.0, ay);
    float halo = max(gx, gy) * fade;
    alpha = max(alpha, halo * clamp(uBloomOpacity, 0.0, 1.0));

    fragColor = vec4(color, alpha);
}

void main(){
  vec4 c;
  mainImage(c, vUv * iResolution.xy);
  gl_FragColor = c;
}
`;

export default function GridScanShader({
  className = '',
  style = {},
  linesColor = '#3a000c',
  scanColor = '#ff073a',
  lineThickness = 1.2,
  gridScale = 0.1,
  bloomIntensity = 0.85,
  scanDuration = 2.2,
  scanGlow = 0.65,
  scanOnClick = true,
  opacity = 0.65,
}: GridScanShaderProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [hasWebGL, setHasWebGL] = useState<boolean>(true);

  useEffect(() => {
    if (!isWebGLAvailable()) {
      setHasWebGL(false);
    }
  }, []);

  useEffect(() => {
    if (!hasWebGL) return;
    const container = containerRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
    } catch {
      setHasWebGL(false);
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = '0';
    renderer.domElement.style.left = '0';
    renderer.domElement.style.pointerEvents = 'none';
    container.appendChild(renderer.domElement);

    const MAX_SCANS = 8;
    const scanStarts: number[] = [];

    const uniforms = {
      iResolution: {
        value: new THREE.Vector3(container.clientWidth || 1, container.clientHeight || 1, renderer.getPixelRatio()),
      },
      iTime: { value: 0 },
      uSkew: { value: new THREE.Vector2(0, 0) },
      uTilt: { value: 0 },
      uYaw: { value: 0 },
      uLineThickness: { value: lineThickness },
      uLinesColor: { value: srgbColor(linesColor) },
      uScanColor: { value: srgbColor(scanColor) },
      uGridScale: { value: gridScale },
      uLineStyle: { value: 0 },
      uLineJitter: { value: 0.05 },
      uScanOpacity: { value: 0.95 },
      uScanDirection: { value: 2 },
      uNoise: { value: 0.015 },
      uBloomOpacity: { value: bloomIntensity },
      uScanGlow: { value: scanGlow },
      uScanSoftness: { value: 2.0 },
      uPhaseTaper: { value: 0.9 },
      uScanDuration: { value: scanDuration },
      uScanDelay: { value: 0.5 },
      uScanStarts: { value: new Array(MAX_SCANS).fill(0) },
      uScanCount: { value: 0 },
    };

    const pushScan = (t: number) => {
      if (scanStarts.length >= MAX_SCANS) scanStarts.shift();
      scanStarts.push(t);
      const buf = new Array(MAX_SCANS).fill(0);
      for (let i = 0; i < scanStarts.length && i < MAX_SCANS; i++) buf[i] = scanStarts[i];
      uniforms.uScanStarts.value = buf;
      uniforms.uScanCount.value = scanStarts.length;
    };

    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: vertSource,
      fragmentShader: fragSource,
      transparent: true,
      depthWrite: false,
      depthTest: false,
    });

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const geometry = new THREE.PlaneGeometry(2, 2);
    const quad = new THREE.Mesh(geometry, material);
    scene.add(quad);

    const lookTarget = new THREE.Vector2(0, 0);
    const lookCurrent = new THREE.Vector2(0, 0);
    const lookVel = new THREE.Vector2(0, 0);

    const skewScale = 0.12;
    const smoothTime = 0.25;
    const maxSpeed = Infinity;

    const resize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth || 1;
      const h = container.clientHeight || window.innerHeight || 1;
      renderer.setSize(w, h);
      material.uniforms.iResolution.value.set(w, h, renderer.getPixelRatio());
    };
    resize();

    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(resize);
      ro.observe(container);
    } else {
      window.addEventListener('resize', resize);
    }

    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const clientX = 'touches' in e && e.touches[0] ? e.touches[0].clientX : (e as MouseEvent).clientX;
      const clientY = 'touches' in e && e.touches[0] ? e.touches[0].clientY : (e as MouseEvent).clientY;
      if (clientX === undefined || clientY === undefined) return;

      const isInside =
        clientX >= rect.left &&
        clientX <= rect.right &&
        clientY >= rect.top &&
        clientY <= rect.bottom;

      if (!isInside) {
        lookTarget.set(0, 0);
        return;
      }

      const nx = Math.max(-1, Math.min(1, ((clientX - rect.left) / (rect.width || 1)) * 2 - 1));
      const ny = Math.max(-1, Math.min(1, -(((clientY - rect.top) / (rect.height || 1)) * 2 - 1)));
      lookTarget.set(nx, ny);
    };

    const onLeave = () => {
      lookTarget.set(0, 0);
    };

    const onScroll = () => {
      if (!container) return;
      const rect = container.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) {
        lookTarget.set(0, 0);
      }
    };

    const onClick = () => {
      if (scanOnClick) pushScan(performance.now() / 1000);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('touchmove', onMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    container.addEventListener('mouseleave', onLeave);
    if (scanOnClick) {
      window.addEventListener('click', onClick);
    }

    let isVisible = true;
    let io: IntersectionObserver | null = null;
    if (typeof IntersectionObserver !== 'undefined') {
      io = new IntersectionObserver(([entry]) => {
        isVisible = entry.isIntersecting;
      }, { threshold: 0.05 });
      io.observe(container);
    }

    const onVisibilityChange = () => {
      isVisible = !document.hidden;
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    let last = performance.now();
    let raf = 0;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      if (!isVisible || document.hidden) return;

      const now = performance.now();
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;

      material.uniforms.iTime.value = now * 0.001;

      const c = smoothDampVec2(lookCurrent, lookTarget, lookVel, smoothTime, maxSpeed, dt);
      lookCurrent.copy(c);

      material.uniforms.uSkew.value.set(c.x * skewScale, c.y * skewScale * 1.3);
      material.uniforms.uTilt.value = -c.y * 0.18;
      material.uniforms.uYaw.value = c.x * 0.18;

      renderer.render(scene, camera);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      if (io) io.disconnect();
      if (ro) ro.disconnect();
      else window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('scroll', onScroll);
      container.removeEventListener('mouseleave', onLeave);
      if (scanOnClick) window.removeEventListener('click', onClick);
      document.removeEventListener('visibilitychange', onVisibilityChange);

      try {
        if (renderer.domElement && renderer.domElement.parentNode) {
          renderer.domElement.parentNode.removeChild(renderer.domElement);
        }
        material.dispose();
        geometry.dispose();
        renderer.dispose();
        renderer.forceContextLoss();
      } catch {
        // Safe disposal
      }
    };
  }, [linesColor, scanColor, lineThickness, gridScale, bloomIntensity, scanDuration, scanGlow, scanOnClick, hasWebGL]);

  if (!hasWebGL) {
    return (
      <div
        className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}
        style={{
          ...style,
          opacity,
          background: 'radial-gradient(ellipse at 50% 50%, rgba(255, 7, 58, 0.1) 0%, rgba(0,0,0,0.9) 80%)',
        }}
      >
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(to right, ${scanColor}22 1px, transparent 1px), linear-gradient(to bottom, ${scanColor}22 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 pointer-events-none overflow-hidden transition-opacity duration-700 ${className}`}
      style={{
        ...style,
        opacity,
        maskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)',
      }}
    />
  );
}
