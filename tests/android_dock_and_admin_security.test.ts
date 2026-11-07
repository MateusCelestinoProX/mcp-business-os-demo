import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

describe('Suíte de Validação: Android Docker Navbar, Footer Navigation & Blindagem Admin', () => {
  const baseDir = path.resolve(__dirname, '..');
  const mobileNavPath = path.join(baseDir, 'src/components/layout/MobileBottomNav.tsx');
  const footerPath = path.join(baseDir, 'src/components/layout/Footer.tsx');
  const navbarPath = path.join(baseDir, 'src/components/layout/Navbar.tsx');
  const adminPagePath = path.join(baseDir, 'src/app/admin/page.tsx');

  test('1. MobileBottomNav deve possuir formato flutuante Android Docker com safe area', () => {
    assert.ok(fs.existsSync(mobileNavPath), 'MobileBottomNav.tsx deve existir');
    const content = fs.readFileSync(mobileNavPath, 'utf-8');

    // Estrutura do Docker Flutuante
    assert.ok(content.includes('fixed bottom-3'), 'Deve flutuar a bottom-3 estilo dock');
    assert.ok(content.includes('rounded-2xl'), 'Deve possuir cantos arredondados de dock');
    assert.ok(content.includes('env(safe-area-inset-bottom'), 'Deve respeitar safe area no Android');
    assert.ok(content.includes('vibrate'), 'Deve acionar haptic feedback');
    assert.ok(content.includes('visibleNavItems'), 'Deve filtrar itens visíveis');
    assert.ok(content.includes('adminOnly'), 'Admin deve ser restrito via adminOnly');
  });

  test('2. Footer deve incorporar os botões da barra principal do header', () => {
    assert.ok(fs.existsSync(footerPath), 'Footer.tsx deve existir');
    const content = fs.readFileSync(footerPath, 'utf-8');

    assert.ok(!content.includes('Navegação Geral do Sistema'), 'Texto redundante de navegação geral não deve estar presente');
    assert.ok(content.includes('Portal Institucional'), 'Deve conter Portal Institucional');
    assert.ok(content.includes('Showcase'), 'Deve conter Showcase');
    assert.ok(content.includes('Shop Oficial'), 'Deve conter Shop Oficial');
    assert.ok(content.includes('Comunidade VIP'), 'Deve conter Comunidade VIP');
    assert.ok(content.includes('Free Resources'), 'Deve conter Free Resources');
    assert.ok(content.includes('Contato Direto'), 'Deve conter Contato Direto');
    assert.ok(content.includes('isUserAdmin'), 'Painel Admin no Footer deve checar isUserAdmin');
    assert.ok(content.includes('Política de Privacidade'), 'Deve preservar Política de Privacidade');
    assert.ok(content.includes('Termos de Uso'), 'Deve preservar Termos de Uso');
  });

  test('3. Navbar deve condicionar acesso e botão do Admin exclusivamente a administradores', () => {
    assert.ok(fs.existsSync(navbarPath), 'Navbar.tsx deve existir');
    const content = fs.readFileSync(navbarPath, 'utf-8');

    // Botão Desktop
    assert.ok(content.includes('{isUserAdmin && ('), 'Desktop Painel Admin deve estar condicionado a isUserAdmin');
    // Botão Mobile Drawer
    assert.ok(content.includes('isUserAdmin'), 'Mobile Drawer Painel Admin deve estar condicionado a isUserAdmin');
  });

  test('4. Admin Page deve validar e restringir acesso exclusivamente ao admin mestre', () => {
    assert.ok(fs.existsSync(adminPagePath), 'admin/page.tsx deve existir');
    const content = fs.readFileSync(adminPagePath, 'utf-8');

    assert.ok(content.includes('hasAdminAccess(currentUser)'), 'Gateway deve exigir hasAdminAccess');
    assert.ok(content.includes("target.role === 'admin'"), 'Sessão inicial deve exigir role admin');
  });
});
