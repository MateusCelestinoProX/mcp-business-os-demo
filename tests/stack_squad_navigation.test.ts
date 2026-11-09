import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

describe('Suíte de Validação: Remoção Completa de Stack & Squad do Header e Injeção SmartFlow no Showcase', () => {
  const baseDir = path.resolve(__dirname, '..');
  const navbarPath = path.join(baseDir, 'src/components/layout/Navbar.tsx');
  const mobileNavPath = path.join(baseDir, 'src/components/layout/MobileBottomNav.tsx');
  const footerPath = path.join(baseDir, 'src/components/layout/Footer.tsx');
  const sitemapPath = path.join(baseDir, 'src/app/sitemap.ts');

  const comunidadeHtmlPath = path.join(baseDir, 'public/comunidade/index.html');
  const showcaseHtmlPath = path.join(baseDir, 'public/showcase/index.html');
  const bibliotecaHtmlPath = path.join(baseDir, 'public/biblioteca/index.html');

  const removedPaths = [
    path.join(baseDir, 'src/app/stack-squad'),
    path.join(baseDir, 'src/app/smartflow'),
    path.join(baseDir, 'src/components/stack-squad'),
    path.join(baseDir, 'public/smartflow/index.html'),
  ];

  test('1. Navbar.tsx, MobileBottomNav.tsx, Footer.tsx e sitemap.ts não devem conter /stack-squad nem Stack & Squad', () => {
    for (const filePath of [navbarPath, mobileNavPath, footerPath, sitemapPath]) {
      assert.ok(fs.existsSync(filePath), `${filePath} deve existir`);
      const content = fs.readFileSync(filePath, 'utf-8');
      assert.ok(!content.includes('/stack-squad'), `${filePath} não deve referenciar /stack-squad`);
      assert.ok(!content.includes('Stack & Squad'), `${filePath} não deve referenciar Stack & Squad`);
      assert.ok(!content.includes('/smartflow'), `${filePath} não deve referenciar /smartflow`);
    }
  });

  test('2. Rotas e páginas autônomas /stack-squad e /smartflow devem estar completamente removidas', () => {
    for (const target of removedPaths) {
      assert.ok(!fs.existsSync(target), `${target} deve ter sido removido`);
    }
  });

  test('3. Headers e Docks estáticos de Comunidade, Showcase e Biblioteca não devem conter Stack & Squad', () => {
    for (const filePath of [comunidadeHtmlPath, showcaseHtmlPath, bibliotecaHtmlPath]) {
      assert.ok(fs.existsSync(filePath), `${filePath} deve existir`);
      const content = fs.readFileSync(filePath, 'utf-8');
      assert.ok(!content.includes('/stack-squad'), `${filePath} não deve conter href="/stack-squad"`);
      assert.ok(!content.includes('Stack & Squad'), `${filePath} não deve conter texto Stack & Squad`);
    }
  });

  test('4. Showcase deve conter as 3 seções SmartFlow injetadas ao final (Serviços Oferecidos, Nossas Stacks Digitais e Squad)', () => {
    const html = fs.readFileSync(showcaseHtmlPath, 'utf-8');

    // Ordem correta no final da página: #certifications -> #servicos -> #stacks -> #squad -> #contact
    const certIdx = html.indexOf('id="certifications"');
    const bundleIdx = html.indexOf('id="smartflow-showcase-bundle"');
    const servicesIdx = html.indexOf('id="servicos"');
    const stacksIdx = html.indexOf('id="stacks"');
    const squadIdx = html.indexOf('id="squad"');
    const contactIdx = html.indexOf('id="contact"');

    assert.ok(certIdx !== -1, 'Seção #certifications deve existir');
    assert.ok(bundleIdx > certIdx, 'Bundle SmartFlow deve vir após #certifications');
    assert.ok(servicesIdx > bundleIdx && stacksIdx > servicesIdx && squadIdx > stacksIdx, 'Ordem deve ser Serviços -> Stacks -> Squad');
    assert.ok(contactIdx > squadIdx, 'Seções SmartFlow devem preceder o bloco final de Contato/Footer (#contact)');

    // Seção 1: Serviços Oferecidos
    for (const expected of [
      'Serviços Oferecidos',
      'Especialidade',
      'Criação de Software Sob Medida',
      'AI Chatbots Inteligentes',
      'Qualificação de Leads',
      'Prospecção Ativa Automatizada',
      'Sistemas de Treinamento',
      'Inteligência de Mercado',
    ]) {
      assert.ok(html.includes(expected), `Showcase deve conter "${expected}"`);
    }

    // Seção 2: Nossas Stacks Digitais + canvas + FA 6.7.2
    assert.ok(html.includes('Nossas Stacks Digitais'), 'Deve conter Nossas Stacks Digitais');
    assert.ok(html.includes('id="stacks-canvas"'), 'Deve conter canvas #stacks-canvas');
    assert.ok(html.includes('01010101SMARTFLOWINTELLIGENCECODELIMITLESS'), 'Deve conter motor ASCII 3D de #stacks-canvas');
    assert.ok(html.includes('font-awesome/6.7.2/css/all.min.css'), 'Deve carregar FontAwesome 6.7.2 para fa-hexagon-nodes');
    assert.ok(html.includes('fa-hexagon-nodes'), 'Deve conter ícone Node (fa-hexagon-nodes)');
    for (const tech of ['React', 'Node.js', 'Node', 'Firebase', 'Supabase', 'n8n', 'Airtable', 'Notion', 'WhatsApp API', 'Email AI', 'Linux', 'Docker', 'CRM']) {
      assert.ok(html.includes(`>${tech}<`), `Stacks deve exibir tecnologia "${tech}"`);
    }

    // Seção 3: Squad
    for (const squadToken of [
      'Engenharia e Estratégia',
      'Mateus Celestino',
      'MATEUS CELESTINO PRO',
      'FOUNDER',
      '/smartflow/mateus.png',
      'https://mateus-celestino-pro.bullet.site/',
      'https://www.linkedin.com/in/mateus-celestino/',
      'Odilon',
      'ODILON DEV',
      'ENGINEER',
      '/smartflow/odilon.png',
      'https://www.linkedin.com/in/odilon-dev/',
      '/smartflow/vid2.mp4',
    ]) {
      assert.ok(html.includes(squadToken), `Squad deve conter "${squadToken}"`);
    }

    // Verificar existência física dos assets referenciados
    for (const asset of ['public/smartflow/mateus.png', 'public/smartflow/odilon.png', 'public/smartflow/vid2.mp4']) {
      assert.ok(fs.existsSync(path.join(baseDir, asset)), `Asset obrigatório ${asset} deve existir`);
    }
  });
});
