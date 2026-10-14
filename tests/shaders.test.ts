import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import * as THREE from 'three';

import {
  hexToRgb,
  hexToVec4,
  hexToHueShift,
  srgbColor,
  smoothDampVec2,
  isWebGLAvailable,
  safeDisposeMesh,
  safeDisposeRenderer,
  cleanupWebGLContext,
} from '../src/lib/shaders/webgl-utils';

import CinematicCanvas from '../src/components/shaders/CinematicCanvas';
import ColorBends from '../src/components/shaders/ColorBends';
import Beams from '../src/components/shaders/Beams';
import Galaxy from '../src/components/shaders/Galaxy';
import GridScanShader from '../src/components/shaders/GridScanShader';
import ShaderBackground from '../src/components/shaders/ShaderBackground';
import ShaderTransitionZone from '../src/components/shaders/ShaderTransitionZone';

describe('WebGL & Shaders Engine Unit Tests', () => {
  describe('Color Math & Shader Helpers (webgl-utils)', () => {
    test('hexToRgb deve converter corretamente formatos #RRGGBB e #RGB', () => {
      // Vermelho Puro
      const [r1, g1, b1] = hexToRgb('#FF0000');
      assert.strictEqual(r1, 1);
      assert.strictEqual(g1, 0);
      assert.strictEqual(b1, 0);

      // Vermelho Carmesim Oficial Mateus Celestino Pro (#FF073A)
      const [rCrimson, gCrimson, bCrimson] = hexToRgb('#FF073A');
      assert.strictEqual(rCrimson, 1.0);
      assert.ok(Math.abs(gCrimson - 7 / 255) < 0.001);
      assert.ok(Math.abs(bCrimson - 58 / 255) < 0.001);

      // Shorthand Hex #FFF
      const [rWhite, gWhite, bWhite] = hexToRgb('#FFF');
      assert.strictEqual(rWhite, 1);
      assert.strictEqual(gWhite, 1);
      assert.strictEqual(bWhite, 1);

      // Shorthand Hex #000
      const [rBlack, gBlack, bBlack] = hexToRgb('#000');
      assert.strictEqual(rBlack, 0);
      assert.strictEqual(gBlack, 0);
      assert.strictEqual(bBlack, 0);
    });

    test('hexToVec4 deve converter corretamente com e sem canal Alfa', () => {
      // 6 caracteres (sem alpha implícito = 1.0)
      const [r1, g1, b1, a1] = hexToVec4('#FF073A');
      assert.strictEqual(r1, 1.0);
      assert.strictEqual(a1, 1.0);

      // 8 caracteres (com alpha explícito de 50% = 0x80 / 255 ~ 0.5019)
      const [r2, g2, b2, a2] = hexToVec4('#FF073A80');
      assert.strictEqual(r2, 1.0);
      assert.ok(Math.abs(a2 - 128 / 255) < 0.01);

      // 3 caracteres
      const [r3, g3, b3, a3] = hexToVec4('#F03');
      assert.strictEqual(r3, 1.0);
      assert.strictEqual(g3, 0.0);
      assert.strictEqual(a3, 1.0);
    });

    test('hexToHueShift deve mapear matizes no círculo cromático [0-360]', () => {
      // Vermelho Puro = 0 graus
      const redHue = hexToHueShift('#FF0000');
      assert.strictEqual(redHue, 0);

      // Verde Puro = 120 graus
      const greenHue = hexToHueShift('#00FF00');
      assert.strictEqual(greenHue, 120);

      // Azul Puro = 240 graus
      const blueHue = hexToHueShift('#0000FF');
      assert.strictEqual(blueHue, 240);

      // Amarelo Puro = 60 graus
      const yellowHue = hexToHueShift('#FFFF00');
      assert.strictEqual(yellowHue, 60);

      // Cinza neutro / Preto = 0 graus
      const blackHue = hexToHueShift('#000000');
      assert.strictEqual(blackHue, 0);
    });

    test('srgbColor deve retornar uma instância linear de THREE.Color', () => {
      const color = srgbColor('#FF073A');
      assert.ok(color instanceof THREE.Color, 'Deve ser instância de THREE.Color');
      assert.strictEqual(color.r, 1.0);
    });
  });

  describe('SmoothDampVec2 Mathematical Stability', () => {
    test('smoothDampVec2 deve convergir suavemente para o alvo sem oscilações infinitas', () => {
      const current = new THREE.Vector2(0, 0);
      const target = new THREE.Vector2(10, 10);
      const currentVelocity = new THREE.Vector2(0, 0);
      const smoothTime = 0.25;
      const maxSpeed = Infinity;
      const dt = 0.016; // ~60fps

      // Simulação de 30 frames
      for (let i = 0; i < 30; i++) {
        const next = smoothDampVec2(current, target, currentVelocity, smoothTime, maxSpeed, dt);
        current.copy(next);
      }

      // Deve estar significativamente próximo do alvo após meio segundo
      assert.ok(current.x > 8.0, `current.x deve ter convergido (>8.0), obtido: ${current.x}`);
      assert.ok(current.y > 8.0, `current.y deve ter convergido (>8.0), obtido: ${current.y}`);
    });

    test('smoothDampVec2 deve respeitar o limite de velocidade maxSpeed', () => {
      const current = new THREE.Vector2(0, 0);
      const target = new THREE.Vector2(100, 100);
      const currentVelocity = new THREE.Vector2(0, 0);
      const smoothTime = 0.1;
      const maxSpeed = 5; // Limite restrito
      const dt = 0.016;

      const next = smoothDampVec2(current, target, currentVelocity, smoothTime, maxSpeed, dt);
      const stepDistance = next.length();

      // O passo não pode ter ultrapassado (maxSpeed * smoothTime + margem segura)
      assert.ok(stepDistance <= 5.5, `Distância percorrida deve respeitar maxSpeed, obtido: ${stepDistance}`);
    });
  });

  describe('SSR Safety & Resource Cleanups', () => {
    test('isWebGLAvailable deve retornar false em ambiente sem DOM/Window (SSR Safe)', () => {
      // No ambiente Node de teste sem DOM simulado, deve retornar false sem lançar exceção
      const isAvailable = isWebGLAvailable();
      assert.strictEqual(typeof isAvailable, 'boolean');
      assert.strictEqual(isAvailable, false);
    });

    test('safeDisposeMesh deve liberar geometrias e materiais sem quebras com null ou undefined', () => {
      assert.doesNotThrow(() => {
        safeDisposeMesh(null);
        safeDisposeMesh(undefined);
      });

      // Com malha Three.js real
      const geom = new THREE.BoxGeometry(1, 1, 1);
      const mat = new THREE.MeshBasicMaterial();
      const mesh = new THREE.Mesh(geom, mat);

      let geomDisposed = false;
      let matDisposed = false;

      geom.addEventListener('dispose', () => {
        geomDisposed = true;
      });
      mat.addEventListener('dispose', () => {
        matDisposed = true;
      });

      safeDisposeMesh(mesh);
      assert.strictEqual(geomDisposed, true, 'Geometria deve ter sido liberada');
      assert.strictEqual(matDisposed, true, 'Material deve ter sido liberado');
    });

    test('safeDisposeRenderer e cleanupWebGLContext devem suportar renderers e mocks com segurança', () => {
      assert.doesNotThrow(() => {
        safeDisposeRenderer(null);
        safeDisposeRenderer(undefined);
        cleanupWebGLContext(null);
        cleanupWebGLContext(undefined);
      });

      let contextLost = false;
      let disposed = false;

      const mockRenderer = {
        dispose: () => {
          disposed = true;
        },
        forceContextLoss: () => {
          contextLost = true;
        },
        domElement: {
          parentNode: null,
        },
      };

      cleanupWebGLContext(mockRenderer);
      assert.strictEqual(contextLost, true, 'Contexto deve ter sido forçado a perda');
      assert.strictEqual(disposed, true, 'Renderer deve ter sido liberado');

      // Teste com mock de contexto WebGL nativo / OGL
      let loseContextCalled = false;
      const mockGL = {
        getExtension: (ext: string) => {
          if (ext === 'WEBGL_lose_context') {
            return {
              loseContext: () => {
                loseContextCalled = true;
              },
            };
          }
          return null;
        },
      };

      cleanupWebGLContext(mockGL);
      assert.strictEqual(loseContextCalled, true, 'loseContext deve ser invocado em contextos OGL/WebGL nativos');
    });
  });

  describe('Shader Component Interface Contracts', () => {
    test('Todos os componentes de shaders exportados devem ser funções React válidas', () => {
      assert.strictEqual(typeof CinematicCanvas, 'function', 'CinematicCanvas deve ser um componente funcional');
      assert.strictEqual(typeof ColorBends, 'function', 'ColorBends deve ser um componente funcional');
      assert.strictEqual(typeof Beams, 'function', 'Beams deve ser um componente funcional');
      assert.strictEqual(typeof Galaxy, 'function', 'Galaxy deve ser um componente funcional');
      assert.strictEqual(typeof GridScanShader, 'function', 'GridScanShader deve ser um componente funcional');
      assert.strictEqual(typeof ShaderBackground, 'function', 'ShaderBackground deve ser um componente funcional');
      assert.strictEqual(typeof ShaderTransitionZone, 'function', 'ShaderTransitionZone deve ser um componente funcional');
    });

    test('ShaderTransitionZone renderiza estrutura válida com props padrão', () => {
      const element = ShaderTransitionZone({
        from: 'INSTITUCIONAL',
        to: 'COMUNIDADE',
        index: '01 // 04',
        accentColor: '#FF073A',
      });

      assert.ok(element, 'Elemento JSX deve ser retornado');
      assert.strictEqual(element.type, 'div');
      assert.ok(element.props.className.includes('relative'), 'Deve conter classes de layout relativas');
    });

    test('ShaderBackground aceita modos especificados no PROJECT.md', () => {
      const modes = ['galaxy', 'beams', 'colorbends', 'gridscan', 'balatro'] as const;

      for (const mode of modes) {
        const bgElement = React.createElement(ShaderBackground, {
          mode,
          opacity: 0.8,
          colorHex: '#FF073A',
          isFixed: true,
        });

        assert.ok(bgElement, `ShaderBackground deve criar elemento React válido para o modo ${mode}`);
        assert.strictEqual(bgElement.type, ShaderBackground);
        assert.strictEqual(bgElement.props.mode, mode);
        assert.strictEqual(bgElement.props.opacity, 0.8);
      }
    });
  });

  describe('Adversarial & Boundary Stress Tests', () => {
    test('Manipulação de entradas Hex anômalas, caracteres especiais e espaços', () => {
      // String vazia e hashes sozinhos
      const [rEmpty, gEmpty, bEmpty] = hexToRgb('');
      assert.strictEqual(rEmpty, 0);
      assert.strictEqual(gEmpty, 0);
      assert.strictEqual(bEmpty, 0);

      const [rHash, gHash, bHash] = hexToRgb('#');
      assert.strictEqual(rHash, 0);
      assert.strictEqual(gHash, 0);
      assert.strictEqual(bHash, 0);

      // Com espaços e caracteres mistos
      const [rSpaced, gSpaced, bSpaced] = hexToRgb('  #FF073A  ');
      assert.strictEqual(rSpaced, 1.0);
      assert.ok(Math.abs(gSpaced - 7 / 255) < 0.001);
      assert.ok(Math.abs(bSpaced - 58 / 255) < 0.001);

      // Hex alfanumérico inválido
      const [rInv, gInv, bInv] = hexToRgb('#ZZZZZZ');
      assert.ok(!isNaN(rInv) && !isNaN(gInv) && !isNaN(bInv), 'Não deve gerar NaN');
    });

    test('Resistência de smoothDampVec2 a tempos extremos e deltas anômalos', () => {
      const current = new THREE.Vector2(5, 5);
      const target = new THREE.Vector2(20, 20);
      const velocity = new THREE.Vector2(0, 0);

      // smoothTime zero ou muito próximo de zero
      assert.doesNotThrow(() => {
        smoothDampVec2(current, target, velocity, 0, 100, 0.016);
      });

      // deltaTime gigante (100 segundos)
      assert.doesNotThrow(() => {
        const result = smoothDampVec2(current, target, velocity, 0.25, 100, 100.0);
        assert.ok(!isNaN(result.x) && !isNaN(result.y), 'Delta grande não deve explodir para NaN');
      });

      // deltaTime zero
      assert.doesNotThrow(() => {
        const result = smoothDampVec2(current, target, velocity, 0.25, 100, 0);
        assert.ok(!isNaN(result.x) && !isNaN(result.y), 'Delta zero não deve gerar erro');
      });
    });

    test('Stress test de limpeza: contextos corrompidos ou com falhas de getExtension', () => {
      const brokenGL = {
        getExtension: () => {
          throw new Error('Falha de hardware WebGL simulada');
        },
      };

      // Não deve estourar exceção para o aplicativo
      assert.doesNotThrow(() => {
        cleanupWebGLContext(brokenGL);
      });
    });
  });
});

