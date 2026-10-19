import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

describe('Suíte de Validação da Navegação e Otimização Mobile', () => {
  const baseDir = path.resolve(__dirname, '..');
  const mobileNavPath = path.join(baseDir, 'src/components/layout/MobileBottomNav.tsx');
  const layoutPath = path.join(baseDir, 'src/app/layout.tsx');
  const shaderPath = path.join(baseDir, 'src/components/shaders/LiquidChromeShader.tsx');

  test('1. MobileBottomNav.tsx deve existir e implementar todos os elementos do Header do sistema', () => {
    assert.ok(fs.existsSync(mobileNavPath), 'Arquivo MobileBottomNav.tsx deve existir');
    const content = fs.readFileSync(mobileNavPath, 'utf-8');

    assert.ok(content.includes('MobileBottomNav'), 'Deve exportar MobileBottomNav');
    assert.ok(content.includes('mobile-sovereign-bottom-bar'), 'Deve conter o id da barra móvel');
    assert.ok(content.includes('md:hidden'), 'Deve ser exclusivo de telas móveis (md:hidden)');
    assert.ok(content.includes('/showcase'), 'Deve conter link para /showcase (Showcase)');
    assert.ok(content.includes('/shop'), 'Deve conter link para /shop (Shop)');
    assert.ok(content.includes('/comunidade'), 'Deve conter link para /comunidade (Comunidade)');
    assert.ok(content.includes('/biblioteca'), 'Deve conter link para /biblioteca (Free Resources)');
    assert.ok(!content.includes('href: "/artigos"'), 'Não deve conter link de artigos no dock móvel inferior');
    assert.ok(!content.includes('href: "/contato"'), 'Não deve conter link de contato no dock móvel inferior');
    assert.ok(content.includes('/admin'), 'Deve conter link para /admin (Admin)');
    assert.ok(content.includes('Free Resources'), 'Deve exibir label Free Resources do Header');
    assert.ok(content.includes('env(safe-area-inset-bottom'), 'Deve respeitar safe area no Android');
  });

  test('2. RootLayout deve renderizar MobileBottomNav e ter padding responsivo', () => {
    assert.ok(fs.existsSync(layoutPath), 'Arquivo layout.tsx deve existir');
    const layoutContent = fs.readFileSync(layoutPath, 'utf-8');

    assert.ok(layoutContent.includes('MobileBottomNav'), 'layout.tsx deve importar MobileBottomNav');
    assert.ok(layoutContent.includes('<MobileBottomNav'), 'layout.tsx deve renderizar <MobileBottomNav />');
    assert.ok(layoutContent.includes('pb-20 md:pb-0'), 'main deve possuir padding responsivo para a barra móvel');
  });

  test('3. Shaders devem possuir otimização de DPR adaptativa para mobile', () => {
    assert.ok(fs.existsSync(shaderPath), 'Arquivo LiquidChromeShader.tsx deve existir');
    const shaderContent = fs.readFileSync(shaderPath, 'utf-8');

    assert.ok(shaderContent.includes('isMobile'), 'Deve conter checagem de dispositivo móvel');
    assert.ok(shaderContent.includes('Math.min(window.devicePixelRatio || 1, 1.2)'), 'DPR mobile deve ser limitado a 1.2');
  });

  test('4. Shaders adicionais e ShaderTransitionZone devem possuir proteções mobile completas', () => {
    const balatroPath = path.join(baseDir, 'src/components/shaders/BalatroShader.tsx');
    const transitionZonePath = path.join(baseDir, 'src/components/shaders/ShaderTransitionZone.tsx');

    assert.ok(fs.existsSync(balatroPath), 'Arquivo BalatroShader.tsx deve existir');
    const balatroContent = fs.readFileSync(balatroPath, 'utf-8');
    assert.ok(balatroContent.includes('isMobile'), 'BalatroShader deve conter isMobile');
    assert.ok(balatroContent.includes('Math.min(window.devicePixelRatio || 1, 1.2)'), 'BalatroShader deve limitar DPR mobile');

    assert.ok(fs.existsSync(transitionZonePath), 'Arquivo ShaderTransitionZone.tsx deve existir');
    const tzContent = fs.readFileSync(transitionZonePath, 'utf-8');
    assert.ok(tzContent.includes('overflow-x-hidden'), 'ShaderTransitionZone deve conter overflow-x-hidden');
    assert.ok(tzContent.includes('max-w-full'), 'ShaderTransitionZone deve conter max-w-full');
  });
});
