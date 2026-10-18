/**
 * WebGL Utilities & Resource Management
 * Plataforma Unificada Soberana — Mateus Celestino Pro
 * 
 * Fornece detecção segura de WebGL (SSR-safe), conversão de cores
 * e liberação determinística de contextos WebGL/Three.js/OGL.
 */

import * as THREE from 'three';

/**
 * Verifica se WebGL (ou WebGL2) está disponível e funcional no cliente atual.
 * Executa estritamente no cliente com tratamento de erro e limpeza imediata.
 */
export function isWebGLAvailable(requireWebGL2: boolean = false): boolean {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return false;
  }

  try {
    const canvas = document.createElement('canvas');
    const gl = requireWebGL2
      ? canvas.getContext('webgl2')
      : canvas.getContext('webgl2') || canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

    if (!gl) {
      return false;
    }

    // Libera o contexto de teste imediatamente
    const loseContext = (gl as WebGLRenderingContext).getExtension('WEBGL_lose_context');
    if (loseContext) {
      loseContext.loseContext();
    }
    return true;
  } catch {
    return false;
  }
}

/**
 * Converte cor Hex (#RRGGBB ou #RGB) para valores RGB normalizados [0.0 - 1.0].
 */
export function hexToRgb(hex: string): [number, number, number] {
  let c = hex.replace('#', '').trim();
  if (c.length === 3) {
    c = c.split('').map((x) => x + x).join('');
  }
  const num = parseInt(c, 16) || 0;
  return [
    ((num >> 16) & 255) / 255,
    ((num >> 8) & 255) / 255,
    (num & 255) / 255,
  ];
}

/**
 * Converte cor Hex (#RRGGBB ou #RRGGBBAA) para vetor de 4 dimensões [r, g, b, a].
 */
export function hexToVec4(hex: string): [number, number, number, number] {
  const hexStr = hex.replace('#', '').trim();
  let r = 0, g = 0, b = 0, a = 1;
  if (hexStr.length === 3) {
    const expanded = hexStr.split('').map((x) => x + x).join('');
    r = parseInt(expanded.slice(0, 2), 16) / 255;
    g = parseInt(expanded.slice(2, 4), 16) / 255;
    b = parseInt(expanded.slice(4, 6), 16) / 255;
  } else if (hexStr.length === 6) {
    r = parseInt(hexStr.slice(0, 2), 16) / 255;
    g = parseInt(hexStr.slice(2, 4), 16) / 255;
    b = parseInt(hexStr.slice(4, 6), 16) / 255;
  } else if (hexStr.length === 8) {
    r = parseInt(hexStr.slice(0, 2), 16) / 255;
    g = parseInt(hexStr.slice(2, 4), 16) / 255;
    b = parseInt(hexStr.slice(4, 6), 16) / 255;
    a = parseInt(hexStr.slice(6, 8), 16) / 255;
  }
  return [r, g, b, a];
}

/**
 * Converte Hex para ângulo de matiz Hue (0 a 360 graus).
 */
export function hexToHueShift(hex: string): number {
  const [r, g, b] = hexToRgb(hex);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  if (max === min) {
    h = 0;
  } else if (max === r) {
    h = (60 * ((g - b) / (max - min)) + 360) % 360;
  } else if (max === g) {
    h = (60 * ((b - r) / (max - min)) + 120) % 360;
  } else {
    h = (60 * ((r - g) / (max - min)) + 240) % 360;
  }
  return Math.round(h);
}

/**
 * Converte cor Hex em THREE.Color linear (SRGB para Linear).
 */
export function srgbColor(hex: string): THREE.Color {
  const c = new THREE.Color(hex);
  return c.convertSRGBToLinear();
}

/**
 * Suavização vetorial (SmoothDamp) para transições orgânicas de ponteiro do mouse.
 */
export function smoothDampVec2(
  current: THREE.Vector2,
  target: THREE.Vector2,
  currentVelocity: THREE.Vector2,
  smoothTime: number,
  maxSpeed: number,
  deltaTime: number
): THREE.Vector2 {
  const out = current.clone();
  const safeSmoothTime = Math.max(0.0001, smoothTime);
  const omega = 2 / safeSmoothTime;
  const x = omega * deltaTime;
  const exp = 1 / (1 + x + 0.48 * x * x + 0.235 * x * x * x);

  const change = current.clone().sub(target);
  const originalTo = target.clone();

  const maxChange = maxSpeed * safeSmoothTime;
  if (change.length() > maxChange) {
    change.setLength(maxChange);
  }

  const newTarget = current.clone().sub(change);
  const temp = currentVelocity.clone().addScaledVector(change, omega).multiplyScalar(deltaTime);
  currentVelocity.sub(temp.clone().multiplyScalar(omega));
  currentVelocity.multiplyScalar(exp);

  out.copy(newTarget.clone().add(change.add(temp).multiplyScalar(exp)));

  const origMinusCurrent = originalTo.clone().sub(current);
  const outMinusOrig = out.clone().sub(originalTo);
  if (origMinusCurrent.dot(outMinusOrig) > 0) {
    out.copy(originalTo);
    currentVelocity.set(0, 0);
  }
  return out;
}

/**
 * Liberação limpa de geometrias e materiais Three.js para evitar memory leaks.
 */
export function safeDisposeMesh(mesh: THREE.Mesh | null | undefined): void {
  if (!mesh) return;
  if (mesh.geometry) {
    mesh.geometry.dispose();
  }
  if (mesh.material) {
    if (Array.isArray(mesh.material)) {
      mesh.material.forEach((mat) => mat.dispose());
    } else {
      mesh.material.dispose();
    }
  }
}

/**
 * Liberação determinística de WebGLRenderer Three.js.
 */
export function safeDisposeRenderer(renderer: THREE.WebGLRenderer | null | undefined, container?: HTMLElement | null): void {
  if (!renderer) return;
  try {
    if (renderer.domElement && container && container.contains(renderer.domElement)) {
      container.removeChild(renderer.domElement);
    }
    renderer.dispose();
    renderer.forceContextLoss();
  } catch {
    // Ignore dispose error on unmount
  }
}

export const isWebGLSupported = isWebGLAvailable;

/**
 * Liberação determinística universal de contextos WebGL (Three.js WebGLRenderer, OGL ou WebGL nativo).
 */
export function cleanupWebGLContext(target: any, container?: HTMLElement | null): void {
  if (!target) return;
  try {
    if (typeof target.forceContextLoss === 'function') {
      target.forceContextLoss();
    }
    if (typeof target.dispose === 'function') {
      target.dispose();
    }
    if (target.domElement && container && container.contains(target.domElement)) {
      container.removeChild(target.domElement);
    }
    if (typeof target.getExtension === 'function') {
      const ext = target.getExtension('WEBGL_lose_context');
      if (ext && typeof ext.loseContext === 'function') {
        ext.loseContext();
      }
    }
    if (target.canvas && container && container.contains(target.canvas)) {
      container.removeChild(target.canvas);
    }
  } catch {
    // Ignore dispose errors on unmount
  }
}

/**
 * Identifica se a execução ocorre em viewport mobile (< 768px).
 * SSR-safe.
 */
export function isMobileViewport(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 768;
}

/**
 * Retorna o Device Pixel Ratio (DPR) adaptativo para mobile e desktop,
 * preservando 60 FPS estáveis e prevenindo sobreaquecimento de GPU em telas móveis.
 * Mobile (< 768px): DPR limitado a no máximo 1.2.
 * Desktop: DPR limitado a no máximo 1.5 (ou maxDesktopDPR).
 */
export function getAdaptiveDPR(maxMobileDPR: number = 1.2, maxDesktopDPR: number = 1.5): number {
  if (typeof window === 'undefined') return 1;
  const isMobile = window.innerWidth < 768;
  const rawDpr = window.devicePixelRatio || 1;
  return isMobile ? Math.min(rawDpr, maxMobileDPR) : Math.min(rawDpr, maxDesktopDPR);
}

