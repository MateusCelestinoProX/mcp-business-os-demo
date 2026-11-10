import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';

const BASE_DIR = path.resolve(__dirname, '..');

describe('Painel Admin — Layout com Coluna Vertical à Esquerda (Internal Pages)', () => {
  const sidebarPath = path.join(BASE_DIR, 'src/components/admin/AdminSidebar.tsx');
  const adminPagePath = path.join(BASE_DIR, 'src/app/admin/page.tsx');
  const shopAdminPath = path.join(BASE_DIR, 'src/app/admin/shop/page.tsx');
  const libraryAdminPath = path.join(BASE_DIR, 'src/app/admin/library-control/page.tsx');

  it('1. Deve existir o componente master AdminSidebar para a coluna vertical de navegação', () => {
    assert.ok(fs.existsSync(sidebarPath), 'AdminSidebar.tsx deve existir');
    const content = fs.readFileSync(sidebarPath, 'utf8');

    // Validação de posicionamento à esquerda
    assert.ok(content.includes('w-full lg:w-72 xl:w-80'), 'Coluna deve ter largura fixa e responsiva à esquerda');
    assert.ok(content.includes('lg:sticky lg:top-24'), 'Coluna deve ser sticky na rolagem no desktop');
    assert.ok(content.includes('Páginas Internas'), 'Deve conter rótulo para páginas internas');

    // Validação de todas as 8 páginas internas na coluna vertical
    const expectedTabs = [
      'overview',
      'posts',
      'library_control',
      'shop_resources',
      'leads',
      'members',
      'finance',
      'infra',
    ];

    for (const tab of expectedTabs) {
      assert.ok(
        content.includes(`id: "${tab}"`) || content.includes(`id: '${tab}'`),
        `Página interna ${tab} deve estar presente na coluna vertical`
      );
    }

    // Validação de atalhos e ações
    assert.ok(content.includes('Ecossistema Externo'), 'Deve conter atalhos para os portais externos');
    assert.ok(content.includes('Atualizar Dados'), 'Deve conter ação de atualizar dados');
    assert.ok(content.includes('Encerrar Sessão'), 'Deve conter ação de logout');
  });

  it('2. A página principal /admin deve posicionar a coluna vertical à esquerda do conteúdo', () => {
    assert.ok(fs.existsSync(adminPagePath), 'admin/page.tsx deve existir');
    const content = fs.readFileSync(adminPagePath, 'utf8');

    assert.ok(content.includes('<AdminSidebar'), 'Deve renderizar AdminSidebar na página do admin');
    assert.ok(content.includes('flex flex-col lg:flex-row'), 'Layout deve ser de duas colunas no desktop');
    assert.ok(content.includes('handleSelectTab'), 'Deve gerenciar a troca de abas e páginas internas');
    assert.ok(content.includes('pageMetaMap'), 'Deve manter o mapeamento contextual do cabeçalho da página ativa');
  });

  it('3. A página /admin/shop deve manter a coluna vertical à esquerda integrada', () => {
    assert.ok(fs.existsSync(shopAdminPath), 'admin/shop/page.tsx deve existir');
    const content = fs.readFileSync(shopAdminPath, 'utf8');

    assert.ok(content.includes('<AdminSidebar activeTab="shop_resources"'), 'Deve renderizar AdminSidebar com tab shop_resources ativa');
    assert.ok(content.includes('flex flex-col lg:flex-row'), 'Deve manter estrutura de duas colunas');
  });

  it('4. A página /admin/library-control deve manter a coluna vertical à esquerda integrada', () => {
    assert.ok(fs.existsSync(libraryAdminPath), 'admin/library-control/page.tsx deve existir');
    const content = fs.readFileSync(libraryAdminPath, 'utf8');

    assert.ok(content.includes('<AdminSidebar activeTab="library_control"'), 'Deve renderizar AdminSidebar com tab library_control ativa');
    assert.ok(content.includes('flex flex-col lg:flex-row'), 'Deve manter estrutura de duas colunas');
  });

  it('5. As rotas /admin não devem empilhar padding-top redundante (pt-24/pt-28/lg:pt-32) abaixo da Navbar', () => {
    const rootLayout = fs.readFileSync(path.join(BASE_DIR, 'src/app/layout.tsx'), 'utf8');
    const bannersAdmin = fs.readFileSync(path.join(BASE_DIR, 'src/app/admin/banners/page.tsx'), 'utf8');

    assert.ok(
      !rootLayout.includes('lg:pt-32'),
      'layout.tsx não deve aplicar lg:pt-32 globalmente pois PortalNavbar existe apenas na Home (/)'
    );

    const adminPages = [
      { name: 'admin/page.tsx', content: fs.readFileSync(adminPagePath, 'utf8') },
      { name: 'admin/shop/page.tsx', content: fs.readFileSync(shopAdminPath, 'utf8') },
      { name: 'admin/library-control/page.tsx', content: fs.readFileSync(libraryAdminPath, 'utf8') },
      { name: 'admin/banners/page.tsx', content: bannersAdmin },
    ];

    for (const page of adminPages) {
      assert.ok(
        !/\b(?:sm:|lg:)?pt-(?:24|28|32)\b/.test(page.content),
        `${page.name} não deve aplicar pt-24/pt-28/pt-32 redundante sobre o <main> do layout global`
      );
    }
  });
});
