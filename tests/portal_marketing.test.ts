import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { POST, GET } from '../src/app/api/leads/route';
import { signToken } from '../src/lib/auth/jwt';

async function runTests() {
  console.log('🚀 Iniciando Suíte de Testes: Portal Institucional & Tráfego de Alta Conversão\n');

  // ============================================================
  // TESTE 1: Integridade do Acervo dos 176 Artigos
  // ============================================================
  console.log('🧪 Teste 1: Validando catálogo de 176 artigos em src/data/articles.json...');
  const articlesPath = path.resolve(__dirname, '../src/data/articles.json');
  assert.ok(fs.existsSync(articlesPath), 'O arquivo src/data/articles.json deve existir');

  const rawData = fs.readFileSync(articlesPath, 'utf-8');
  const articles = JSON.parse(rawData);
  assert.strictEqual(articles.length, 176, `Esperado exatamente 176 artigos, encontrado ${articles.length}`);

  const slugs = new Set<string>();
  const categories = new Set<string>();

  for (const art of articles) {
    assert.ok(art.id !== undefined && art.id !== null, `Artigo sem ID válido`);
    assert.ok(typeof art.title === 'string' && art.title.length > 5, `Artigo ${art.id} com título inválido`);
    assert.ok(typeof art.slug === 'string' && art.slug.length > 2, `Artigo ${art.id} com slug inválido`);
    assert.ok(typeof art.excerpt === 'string', `Artigo ${art.id} sem excerpt`);
    assert.ok(typeof art.category === 'string', `Artigo ${art.id} sem categoria`);
    assert.ok(!slugs.has(art.slug), `Slug duplicado detectado: ${art.slug}`);
    slugs.add(art.slug);
    categories.add(art.category);
  }
  console.log(`✅ Teste 1 APROVADO: 176 artigos íntegros com ${categories.size} categorias distintas.\n`);

  // ============================================================
  // TESTE 2: Existência das Capas WebP em public/assets/covers/
  // ============================================================
  console.log('🧪 Teste 2: Validando presença das 176 capas de artigos em public/assets/covers/ ...');
  const coversDir = path.resolve(__dirname, '../public/assets/covers');
  assert.ok(fs.existsSync(coversDir), 'Diretório public/assets/covers deve existir');

  const coverFiles = fs.readdirSync(coversDir).filter(f => f.endsWith('.webp'));
  assert.ok(coverFiles.length >= 176, `Esperado pelo menos 176 capas .webp, encontrado ${coverFiles.length}`);
  console.log(`✅ Teste 2 APROVADO: ${coverFiles.length} capas .webp encontradas e validadas.\n`);

  // ============================================================
  // TESTE 3: Rota POST /api/leads com UTM do TikTok Ads
  // ============================================================
  console.log('🧪 Teste 3: Validando POST /api/leads com tráfego TikTok Ads...');
  const tikTokPayload = {
    name: 'Mateus Lead TikTok',
    email: 'tiktok.lead@test.com',
    phone: '(31) 98888-7777',
    source: 'tiktok',
    utm_source: 'tiktok_ads',
    utm_campaign: 'black_friday_2026',
    utm_medium: 'cpc',
    utm_content: 'video_hook_01',
    metadata: { service: 'Agentes de Atendimento WhatsApp' }
  };

  const reqTikTok = new Request('http://localhost:3000/api/leads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(tikTokPayload)
  });

  const resTikTok = await POST(reqTikTok);
  assert.strictEqual(resTikTok.status, 201, `Esperado HTTP 201, recebido ${resTikTok.status}`);
  const jsonTikTok = await resTikTok.json();
  assert.strictEqual(jsonTikTok.success, true, 'Propriedade success deve ser true');
  assert.ok(typeof jsonTikTok.leadId === 'string' && jsonTikTok.leadId.length > 0, 'leadId deve ser retornado');
  console.log(`✅ Teste 3 APROVADO: Lead TikTok Ads processado com HTTP 201 (leadId: ${jsonTikTok.leadId}).\n`);

  // ============================================================
  // TESTE 4: Rota POST /api/leads com UTM do Meta Ads
  // ============================================================
  console.log('🧪 Teste 4: Validando POST /api/leads com tráfego Meta Ads...');
  const metaPayload = {
    name: 'Ana Carolina Meta',
    email: 'ana.meta@corporativo.com',
    phone: '31999998888',
    utm_source: 'facebook',
    utm_campaign: 'hiperautomacao_n8n',
    metadata: { service: 'Hiperautomação de Processos com n8n' }
  };

  const reqMeta = new Request('http://localhost:3000/api/leads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(metaPayload)
  });

  const resMeta = await POST(reqMeta);
  assert.strictEqual(resMeta.status, 201, `Esperado HTTP 201, recebido ${resMeta.status}`);
  const jsonMeta = await resMeta.json();
  assert.strictEqual(jsonMeta.success, true, 'Propriedade success deve ser true');
  assert.ok(jsonMeta.leadId, 'leadId deve ser gerado');
  console.log(`✅ Teste 4 APROVADO: Lead Meta Ads processado com HTTP 201 (leadId: ${jsonMeta.leadId}).\n`);

  // ============================================================
  // TESTE 5: Rota POST /api/leads - Validação de Campos Obrigatórios
  // ============================================================
  console.log('🧪 Teste 5: Validando rejeição de payload inválido em POST /api/leads...');
  
  // Nome muito curto
  const reqInvalidName = new Request('http://localhost:3000/api/leads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'A', email: 'teste@teste.com', phone: '11999998888' })
  });
  const resInvalidName = await POST(reqInvalidName);
  assert.strictEqual(resInvalidName.status, 400, 'Nome < 2 caracteres deve retornar 400');

  // E-mail inválido
  const reqInvalidEmail = new Request('http://localhost:3000/api/leads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Fulano Silva', email: 'email-invalido', phone: '11999998888' })
  });
  const resInvalidEmail = await POST(reqInvalidEmail);
  assert.strictEqual(resInvalidEmail.status, 400, 'E-mail inválido deve retornar 400');

  // Telefone inválido / curto
  const reqInvalidPhone = new Request('http://localhost:3000/api/leads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Fulano Silva', email: 'fulano@teste.com', phone: '123' })
  });
  const resInvalidPhone = await POST(reqInvalidPhone);
  assert.strictEqual(resInvalidPhone.status, 400, 'Telefone < 8 dígitos deve retornar 400');

  console.log('✅ Teste 5 APROVADO: Validação segura de campos obrigatórios confirmada com HTTP 400.\n');

  // ============================================================
  // TESTE 6: Rota GET /api/leads (Consulta Paginada)
  // ============================================================
  console.log('🧪 Teste 6: Validando GET /api/leads com paginação...');
  const adminToken = await signToken({
    userId: 'admin-test',
    email: 'mcp6667@proton.me',
    name: 'Mateus Celestino',
    role: 'admin',
  });
  const reqGet = new Request('http://localhost:3000/api/leads?page=1&limit=10', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${adminToken}`,
    },
  });
  const resGet = await GET(reqGet);
  assert.strictEqual(resGet.status, 200, `Esperado HTTP 200 no GET /api/leads, recebido ${resGet.status}`);
  const jsonGet = await resGet.json();
  assert.strictEqual(jsonGet.success, true, 'GET deve retornar success: true');
  assert.ok(Array.isArray(jsonGet.leads), 'GET deve retornar array de leads');
  assert.strictEqual(jsonGet.page, 1, 'Página deve ser 1');
  assert.strictEqual(jsonGet.limit, 10, 'Limite deve ser 10');
  console.log(`✅ Teste 6 APROVADO: Consulta administrativa paginada funcional com HTTP 200.\n`);

  // ============================================================
  // TESTE 7: Verificação dos Componentes do Portal
  // ============================================================
  console.log('🧪 Teste 7: Verificando existência de todos os arquivos de componentes do Portal...');
  const components = [
    'src/app/page.tsx',
    'src/components/portal/OriginalHeader.tsx',
    'src/components/portal/MainNotionLayout.tsx',
    'src/components/portal/SobreSection.tsx',
    'src/components/portal/ContatoSection.tsx',
    'src/components/portal/LiquidGlassBackground.tsx',
    'src/components/shaders/ShaderTransitionZone.tsx',
    'src/app/api/leads/route.ts',
  ];

  for (const comp of components) {
    const compPath = path.resolve(__dirname, '..', comp);
    assert.ok(fs.existsSync(compPath), `Componente ${comp} deve existir`);
    const content = fs.readFileSync(compPath, 'utf-8');
    assert.ok(content.length > 100, `Componente ${comp} deve ter conteúdo substancial`);
  }
  console.log('✅ Teste 7 APROVADO: Todos os componentes criados e validados com integridade real.\n');

  console.log('🎉 TODOS OS 7 TESTES PASSARAM COM 100% DE SUCESSO!');
}

runTests().catch((err) => {
  console.error('❌ Falha na suíte de testes:', err);
  process.exit(1);
});
