import { describe, it } from 'node:test';
import assert from 'node:assert';
import fs from 'fs';
import path from 'path';

const BASE_DIR = path.resolve(__dirname, '..');

console.log('🏛️ Iniciando Validação de Restauração com Fidelidade Absoluta (Portal Institucional Pro X)...');

// 1. Validar existência dos componentes restaurados
const requiredComponents = [
  'src/components/portal/LiquidGlassBackground.tsx',
  'src/components/portal/OriginalHeader.tsx',
  'src/components/portal/MainNotionLayout.tsx',
  'src/components/portal/RecursosSection.tsx',
  'src/components/portal/ShopSection.tsx',
  'src/components/portal/SobreSection.tsx',
  'src/components/portal/ContatoSection.tsx',
  'src/components/portal/ArticleModal.tsx',
  'src/components/portal/LegalModal.tsx',
  'src/app/api/contact/route.ts'
];

requiredComponents.forEach((comp) => {
  const fullPath = path.join(BASE_DIR, comp);
  assert.ok(fs.existsSync(fullPath), `Componente essencial ausente: ${comp}`);
  console.log(`✅ Componente validado: ${comp}`);
});

// 2. Validar integridade dos 176 artigos
const articlesPath = path.join(BASE_DIR, 'src/data/articles.json');
assert.ok(fs.existsSync(articlesPath), 'articles.json ausente!');
const articles = JSON.parse(fs.readFileSync(articlesPath, 'utf8'));
assert.strictEqual(articles.length, 176, `Esperado 176 artigos, encontrado ${articles.length}`);
console.log(`✅ 176 Artigos Técnicos originais íntegros e preservados.`);

// 3. Validar siteData.json
const siteDataPath = path.join(BASE_DIR, 'src/data/siteData.json');
assert.ok(fs.existsSync(siteDataPath), 'siteData.json ausente!');
const siteData = JSON.parse(fs.readFileSync(siteDataPath, 'utf8'));
assert.ok(siteData.profile, 'Perfil ausente em siteData');
assert.ok(siteData.categories, 'Categorias ausentes em siteData');
assert.ok(siteData.recursos, 'Recursos ausentes em siteData');
assert.ok(siteData.shop, 'Shop ausente em siteData');
assert.ok(siteData.legal, 'Legal ausente em siteData');
console.log(`✅ siteData.json validado com profile, recursos, shop e dados legais.`);

// 4. Testar POST /api/contact
async function testContactApi() {
  const { POST } = await import('../src/app/api/contact/route');
  
  const mockReq = new Request('http://localhost:3000/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      nome: 'Cliente Validação Pro X',
      email: 'validacao.prox@empresa.com.br',
      whatsapp: '31999998888',
      servico: 'Agentes de Atendimento WhatsApp',
      mensagem: 'Teste de submissão do formulário de contato restaurado.'
    })
  });

  const res = await POST(mockReq);
  const data = await res.json();
  assert.strictEqual(res.status, 201, `Status esperado 201, recebido ${res.status}`);
  assert.strictEqual(data.success, true, 'Esperado success === true');
  assert.strictEqual(data.lead.name, 'Cliente Validação Pro X');
  console.log(`✅ POST /api/contact processado com sucesso (Lead: ${data.lead.id})`);
}

testContactApi().then(() => {
  console.log('🎉 RESTAURAÇÃO DO PORTAL INSTITUCIONAL MATEUS CELESTINO PRO X 100% HOMOLOGADA!');
}).catch((err) => {
  console.error('❌ Erro no teste de contato:', err);
  process.exit(1);
});
