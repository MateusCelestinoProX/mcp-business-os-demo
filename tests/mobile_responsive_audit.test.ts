import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { getAdaptiveDPR, isMobileViewport } from '../src/lib/shaders/webgl-utils';

describe('Auditoria Completa de Responsividade Mobile, Touch Targets & Performance de Shaders', () => {
  const baseDir = path.resolve(__dirname, '..');
  const layoutPath = path.join(baseDir, 'src/app/layout.tsx');
  const mobileNavPath = path.join(baseDir, 'src/components/layout/MobileBottomNav.tsx');
  const shadersDir = path.join(baseDir, 'src/components/shaders');
  const transitionZonePath = path.join(shadersDir, 'ShaderTransitionZone.tsx');
  const shaderSelectorPath = path.join(shadersDir, 'ShaderSelector.tsx');

  describe('1. Viewport Meta Tag e Classes Responsivas no Layout Global', () => {
    test('layout.tsx deve exportar configuração de viewport com device-width e scale adaptativo', () => {
      assert.ok(fs.existsSync(layoutPath), 'layout.tsx deve existir');
      const content = fs.readFileSync(layoutPath, 'utf-8');

      assert.ok(content.includes('viewport: Viewport'), 'Deve exportar objeto viewport tipado');
      assert.ok(content.includes('width: "device-width"'), 'Deve conter width: device-width');
      assert.ok(content.includes('initialScale: 1'), 'Deve conter initialScale: 1');
      assert.ok(content.includes('viewportFit: "cover"'), 'Deve conter viewportFit: cover para safe area em entalhes de tela');
    });

    test('layout.tsx deve conter classes de blindagem contra overflow horizontal no body e html', () => {
      const content = fs.readFileSync(layoutPath, 'utf-8');
      assert.ok(content.includes('overflow-x-hidden'), 'body deve conter overflow-x-hidden');
      assert.ok(content.includes('min-h-screen'), 'body deve conter min-h-screen');
    });

    test('layout.tsx deve renderizar MobileBottomNav com espaçamento responsivo no main', () => {
      const content = fs.readFileSync(layoutPath, 'utf-8');
      assert.ok(content.includes('MobileBottomNav'), 'layout.tsx deve importar MobileBottomNav');
      assert.ok(content.includes('<MobileBottomNav'), 'layout.tsx deve instanciar <MobileBottomNav />');
      assert.ok(
        content.includes('pb-20 md:pb-0') || content.includes('pb-16 md:pb-0') || content.includes('pb-24 md:pb-0'),
        'main deve conter padding-bottom móvel para não sobrepor a barra de navegação'
      );
    });
  });

  describe('2. Acessibilidade de Touch Targets (Tamanho Mínimo >= 44px)', () => {
    test('MobileBottomNav.tsx deve fornecer touch targets de no mínimo 44px', () => {
      assert.ok(fs.existsSync(mobileNavPath), 'MobileBottomNav.tsx deve existir');
      const content = fs.readFileSync(mobileNavPath, 'utf-8');

      // h-12 = 48px, min-w-[66px] > 44px
      const hasAccessibleHeight = content.includes('h-12') || content.includes('min-h-[44px]') || content.includes('h-14');
      assert.ok(hasAccessibleHeight, 'Os itens de toque na barra móvel devem ter altura mínima de 44px (ou h-12/48px)');

      const hasTouchPadding = content.includes('py-') && content.includes('px-');
      assert.ok(hasTouchPadding, 'Os botões de toque devem conter preenchimento de segurança py e px');
    });

    test('ShaderSelector.tsx deve possuir touch targets acessíveis de no mínimo 44px nos controles principais', () => {
      assert.ok(fs.existsSync(shaderSelectorPath), 'ShaderSelector.tsx deve existir');
      const content = fs.readFileSync(shaderSelectorPath, 'utf-8');

      assert.ok(content.includes('min-h-[44px]'), 'Botões e seletores devem conter min-h-[44px]');
      assert.ok(content.includes('p-2.5') || content.includes('py-2.5'), 'Botões devem ter preenchimento de toque adequado');
    });
  });

  describe('3. Validação de Prevenção de Overflow e Larguras Fixas em Shaders e Telas Móveis', () => {
    test('ShaderTransitionZone.tsx deve garantir contenção total de overflow no mobile', () => {
      assert.ok(fs.existsSync(transitionZonePath), 'ShaderTransitionZone.tsx deve existir');
      const content = fs.readFileSync(transitionZonePath, 'utf-8');

      assert.ok(content.includes('overflow-x-hidden'), 'ShaderTransitionZone deve conter overflow-x-hidden');
      assert.ok(content.includes('max-w-full'), 'ShaderTransitionZone deve conter max-w-full');
      assert.ok(!content.includes('w-[1200px]'), 'Não deve possuir larguras fixas em pixels desresponsivizadas');
    });

    test('ShaderSelector.tsx deve prevenir transbordamento horizontal em viewports móveis', () => {
      const content = fs.readFileSync(shaderSelectorPath, 'utf-8');

      assert.ok(
        content.includes('max-w-[calc(100vw-2rem)]') || content.includes('w-[calc(100vw-2rem)]'),
        'Painel expansível do ShaderSelector deve limitar sua largura no mobile'
      );
      assert.ok(content.includes('bottom-20') || content.includes('bottom-24'), 'Deve estar elevado no mobile para não cobrir o MobileBottomNav');
    });

    test('Nenhum componente de shader deve possuir larguras fixas rígidas sem breakpoint', () => {
      const files = fs.readdirSync(shadersDir).filter((f) => f.endsWith('.tsx'));
      const fixedWidthRegex = /(?<!(sm:|md:|lg:|xl:|2xl:))w-\[(?:[5-9]\d{2}|[1-9]\d{3,})px\]/;

      const offenders: string[] = [];
      for (const file of files) {
        const filePath = path.join(shadersDir, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        if (fixedWidthRegex.test(content)) {
          offenders.push(file);
        }
      }

      assert.deepStrictEqual(offenders, [], `Shaders não devem conter classes w-[...px] desresponsivizadas: ${offenders.join(', ')}`);
    });
  });

  describe('4. Auditoria de Cálculo Adaptativo de DPR em Shaders WebGL', () => {
    const shaderFiles = [
      'BalatroShader.tsx',
      'Beams.tsx',
      'CinematicCanvas.tsx',
      'ColorBends.tsx',
      'FaultyTerminalShader.tsx',
      'Galaxy.tsx',
      'GridScanShader.tsx',
      'LightningShader.tsx',
      'LineWavesShader.tsx',
      'LiquidChromeShader.tsx',
      'RippleGridShader.tsx',
      'SilkShader.tsx',
    ];

    test('Todos os shaders WebGL do ecossistema devem implementar cálculo de DPR adaptativo para mobile', () => {
      const missingDPR: string[] = [];

      for (const fileName of shaderFiles) {
        const filePath = path.join(shadersDir, fileName);
        assert.ok(fs.existsSync(filePath), `Shader ${fileName} deve existir`);
        const content = fs.readFileSync(filePath, 'utf-8');

        const hasMobileDprCheck =
          content.includes('isMobile') ||
          content.includes('targetDpr') ||
          content.includes('getAdaptiveDPR') ||
          content.includes('innerWidth < 768');

        const hasDprMobileLimit =
          content.includes('1.2') ||
          content.includes('[1, 1.2]');

        if (!hasMobileDprCheck || !hasDprMobileLimit) {
          missingDPR.push(fileName);
        }
      }

      assert.deepStrictEqual(
        missingDPR,
        [],
        `Os seguintes shaders não possuem otimização de DPR adaptativo para mobile (teto 1.2): ${missingDPR.join(', ')}`
      );
    });

    test('Nenhum shader deve fixar DPR em 1.0 puro (proibido por visual stability)', () => {
      const badDprRegex = /(?:const dpr = 1\.0;|setPixelRatio\(1\.0\))/;
      const offenders: string[] = [];

      for (const fileName of shaderFiles) {
        const filePath = path.join(shadersDir, fileName);
        const content = fs.readFileSync(filePath, 'utf-8');
        if (badDprRegex.test(content)) {
          offenders.push(fileName);
        }
      }

      assert.deepStrictEqual(offenders, [], `Shaders com DPR fixo em 1.0 proibido: ${offenders.join(', ')}`);
    });

    test('Função getAdaptiveDPR e isMobileViewport devem operar de forma determinística e segura', () => {
      // Em ambiente de teste sem window
      assert.strictEqual(getAdaptiveDPR(), 1, 'Em SSR deve retornar 1 por segurança');
      assert.strictEqual(isMobileViewport(), false, 'Em SSR deve retornar false');

      // Simulando ambiente Mobile
      const originalWindow = global.window;
      try {
        (global as any).window = {
          innerWidth: 390,
          devicePixelRatio: 3.0, // Ex: iPhone Retina 3x
        };

        assert.strictEqual(isMobileViewport(), true, 'Deve identificar viewport mobile (< 768px)');
        const mobileDpr = getAdaptiveDPR();
        assert.strictEqual(mobileDpr, 1.2, 'Em mobile, DPR deve ser rigorosamente limitado ao teto 1.2 para 60 FPS');

        // Simulando ambiente Desktop
        (global as any).window = {
          innerWidth: 1920,
          devicePixelRatio: 2.0, // Ex: MacBook Retina 2x
        };

        assert.strictEqual(isMobileViewport(), false, 'Deve identificar viewport desktop (>= 768px)');
        const desktopDpr = getAdaptiveDPR();
        assert.strictEqual(desktopDpr, 1.5, 'Em desktop, DPR deve atingir o teto de 1.5');
      } finally {
        if (originalWindow === undefined) {
          delete (global as any).window;
        } else {
          (global as any).window = originalWindow;
        }
      }
    });
  });

  describe('5. Preservação de Caminhos, Botões e Elementos do Desktop no Mobile', () => {
    test('MobileBottomNav.tsx deve preservar as 6 rotas do dock Android soberano e omitir rotas poluidoras', () => {
      const content = fs.readFileSync(mobileNavPath, 'utf-8');

      const rotasEssenciais = [
        { path: '/', label: 'Portal' },
        { path: '/showcase', label: 'Showcase' },
        { path: '/shop', label: 'Shop' },
        { path: '/comunidade', label: 'Comunidade' },
        { path: '/biblioteca', label: 'Free Resources' },
        { path: '/admin', label: 'Admin' },
      ];

      for (const rota of rotasEssenciais) {
        assert.ok(content.includes(`href: "${rota.path}"`), `Rota ${rota.path} deve estar presente`);
        assert.ok(content.includes(`name: "${rota.label}"`), `Rótulo "${rota.label}" deve estar presente`);
      }

      assert.ok(!content.includes('href: "/artigos"'), 'Artigos não deve poluir a barra dock mobile');
      assert.ok(!content.includes('href: "/contato"'), 'Contato não deve poluir a barra dock mobile');
    });

    test('MobileBottomNav.tsx deve implementar exclusividade mobile (md:hidden) e safe area insets', () => {
      const content = fs.readFileSync(mobileNavPath, 'utf-8');

      assert.ok(content.includes('md:hidden'), 'Deve ser exclusivo de telas móveis via classe md:hidden');
      assert.ok(content.includes('env(safe-area-inset-bottom'), 'Deve respeitar safe area no iOS e Android');
      assert.ok(content.includes('vibrate'), 'Deve suportar haptic feedback tátil em dispositivos móveis');
    });
  });
});
