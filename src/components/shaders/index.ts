/**
 * Exportações Unificadas do Módulo de Shaders WebGL
 * Plataforma Unificada Soberana - Mateus Celestino Pro
 */

export { default as CinematicCanvas } from './CinematicCanvas';
export type { CinematicCanvasProps, CinematicShaderMode } from './CinematicCanvas';

export { default as ColorBends } from './ColorBends';
export type { ColorBendsProps } from './ColorBends';

export { default as Beams } from './Beams';
export type { BeamsProps } from './Beams';

export { default as Galaxy } from './Galaxy';
export type { GalaxyProps } from './Galaxy';

export { default as GridScanShader } from './GridScanShader';
export type { GridScanShaderProps } from './GridScanShader';

export { default as BalatroShader } from './BalatroShader';
export type { BalatroShaderProps } from './BalatroShader';

export { default as RippleGridShader } from './RippleGridShader';
export type { RippleGridShaderProps } from './RippleGridShader';

export { default as LightningShader } from './LightningShader';
export type { LightningShaderProps } from './LightningShader';

export { default as FaultyTerminalShader } from './FaultyTerminalShader';
export type { FaultyTerminalShaderProps } from './FaultyTerminalShader';

export { default as ShaderBackground } from './ShaderBackground';
export type { ShaderBackgroundProps, ShaderBackgroundMode } from './ShaderBackground';

export { default as ShaderTransitionZone } from './ShaderTransitionZone';
export type { ShaderTransitionZoneProps } from './ShaderTransitionZone';

export { default as ShaderSelector } from './ShaderSelector';
export type { ShaderSelectorProps } from './ShaderSelector';

export * from '@/lib/shaders/webgl-utils';
