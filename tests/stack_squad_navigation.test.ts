import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

describe('Suíte de Validação: Migração das 3 Seções (Serviços, Stacks, Squad) do Showcase para a Home Page', () => {
  const baseDir = path.resolve(__dirname, '..');
  const navbarPath = path.join(baseDir, 'src/components/layout/Navbar.tsx');
  const mobileNavPath = path.join(baseDir, 'src/components/layout/MobileBottomNav.tsx');
  const footerPath = path.join(baseDir, 'src/components/layout/Footer.tsx');
  const sitemapPath = path.join(baseDir, 'src/app/sitemap.ts');

  const homePagePath = path.join(baseDir, 'src/app/page.tsx');
  const servicosSectionPath = path.join(baseDir, 'src/components/portal/ServicosSection.tsx');
  const stacksSectionPath = path.join(baseDir, 'src/components/portal/StacksSection.tsx');
  const squadSectionPath = path.join(baseDir, 'src/components/portal/SquadSection.tsx');
  const portalNavbarPath = path.join(baseDir, 'src/components/portal/PortalNavbar.tsx');
  const sitemapModalPath = path.join(baseDir, 'src/components/portal/UniversalSitemapModal.tsx');

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

  test('4. Showcase não deve mais conter as 3 seções SmartFlow movidas para a Home Page', () => {
    const html = fs.readFileSync(showcaseHtmlPath, 'utf-8');

    const certIdx = html.indexOf('id="certifications"');
    const contactIdx = html.indexOf('id="contact"');
    assert.ok(certIdx !== -1 && contactIdx > certIdx, 'Showcase deve conectar #certifications diretamente antes de #contact');

    for (const removedToken of [
      'id="smartflow-showcase-bundle"',
      'id="smartflow-showcase-styles"',
      'id="smartflow-stacks-canvas-script"',
      'id="servicos"',
      'id="stacks"',
      'id="squad"',
      'id="stacks-canvas"',
      'href="#servicos"',
      'href="#stacks"',
      'href="#squad"',
      'fa-hexagon-nodes',
    ]) {
      assert.ok(!html.includes(removedToken), `Showcase não deve mais conter ${removedToken}`);
    }
  });

  test('5. Home Page deve renderizar Serviços, Stacks e Squad traduzidos ao layout glassmorphism carmesim', () => {
    const home = fs.readFileSync(homePagePath, 'utf-8');
    const servicosCode = fs.readFileSync(servicosSectionPath, 'utf-8');
    const stacksCode = fs.readFileSync(stacksSectionPath, 'utf-8');
    const squadCode = fs.readFileSync(squadSectionPath, 'utf-8');
    const portalNavCode = fs.readFileSync(portalNavbarPath, 'utf-8');
    const sitemapModalCode = fs.readFileSync(sitemapModalPath, 'utf-8');

    // Ordem na Home Page: Sobre -> Serviços -> Stacks -> Squad -> Contato
    const sobreIdx = home.indexOf('<SobreSection');
    const servicosIdx = home.indexOf('<ServicosSection');
    const stacksIdx = home.indexOf('<StacksSection');
    const squadIdx = home.indexOf('<SquadSection');
    const contatoIdx = home.indexOf('id="contato"');

    assert.ok(sobreIdx !== -1, 'SobreSection deve estar na Home');
    assert.ok(servicosIdx > sobreIdx, 'ServicosSection deve vir após SobreSection');
    assert.ok(stacksIdx > servicosIdx, 'StacksSection deve vir após ServicosSection');
    assert.ok(squadIdx > stacksIdx, 'SquadSection deve vir após StacksSection');
    assert.ok(contatoIdx > squadIdx, 'Contato deve vir após SquadSection');

    // Regras de Estabilidade Visual (sem backdrop-blur nem classes sf-ultra-glass legadas)
    for (const [label, code] of [
      ['ServicosSection', servicosCode],
      ['StacksSection', stacksCode],
      ['SquadSection', squadCode],
    ]) {
      assert.ok(!code.includes('backdrop-blur'), `${label} não deve usar backdrop-blur`);
      assert.ok(!code.includes('sf-ultra-glass'), `${label} não deve usar sf-ultra-glass legado`);
      assert.ok(code.includes('glass-crystal'), `${label} deve adotar design system .glass-crystal`);
    }

    // Seção 1: Serviços Oferecidos
    assert.ok(servicosCode.includes('id="servicos"'), 'ServicosSection deve definir id="servicos"');
    for (const expected of [
      'SOLUÇÕES AVANÇADAS',
      'Serviços Oferecidos',
      'Especialidade',
      'Criação de Software Sob Medida',
      'AI Chatbots Inteligentes',
      'Qualificação de Leads',
      'Prospecção Ativa Automatizada',
      'Sistemas de Treinamento',
      'Inteligência de Mercado',
    ]) {
      assert.ok(servicosCode.includes(expected), `ServicosSection deve conter "${expected}"`);
    }

    // Seção 2: Nossas Stacks Digitais
    assert.ok(stacksCode.includes('id="stacks"'), 'StacksSection deve definir id="stacks"');
    assert.ok(stacksCode.includes('id="stacks-canvas"'), 'StacksSection deve conter canvas #stacks-canvas');
    assert.ok(stacksCode.includes('IntersectionObserver'), 'StacksSection deve pausar canvas via IntersectionObserver');
    assert.ok(stacksCode.includes('getAdaptiveDPR'), 'StacksSection deve usar DPR adaptativo');
    assert.ok(stacksCode.includes('01010101SMARTFLOWINTELLIGENCECODELIMITLESS'), 'Deve conter motor ASCII 3D de #stacks-canvas');
    for (const tech of ['React', 'Node.js', 'Node', 'Firebase', 'Supabase', 'n8n', 'Airtable', 'Notion', 'WhatsApp API', 'Email AI', 'Linux', 'Docker', 'CRM']) {
      assert.ok(stacksCode.includes(`'${tech}'`), `StacksSection deve conter tecnologia "${tech}"`);
    }

    // Seção 3: Squad
    assert.ok(squadCode.includes('id="squad"'), 'SquadSection deve definir id="squad"');
    for (const squadToken of [
      'ENGENHARIA E ESTRATÉGIA',
      'Mateus Celestino',
      'MATEUS CELESTINO PRO',
      'FOUNDER',
      '/assets/squad_mateus.webp',
      'https://mateus-celestino-pro.bullet.site/',
      'https://www.linkedin.com/in/mateus-celestino/',
      'Odilon',
      'ODILON DEV',
      'ENGINEER',
      '/assets/squad_odilon.webp',
      'Disponível para Projetos',
      'https://www.linkedin.com/in/odilon-dev/',
    ]) {
      assert.ok(squadCode.includes(squadToken), `SquadSection deve conter "${squadToken}"`);
    }

    for (const asset of ['public/assets/squad_mateus.webp', 'public/assets/squad_odilon.webp']) {
      assert.ok(fs.existsSync(path.join(baseDir, asset)), `Asset otimizado ${asset} deve existir`);
    }

    // Navegação da Home Page (PortalNavbar + UniversalSitemapModal)
    for (const sectionId of ['servicos', 'stacks', 'squad']) {
      assert.ok(portalNavCode.includes(`'${sectionId}'`), `PortalNavbar deve incluir âncora #${sectionId}`);
      assert.ok(sitemapModalCode.includes(`target: '${sectionId}'`), `UniversalSitemapModal deve incluir âncora #${sectionId}`);
    }
  });
});
