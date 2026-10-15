const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

async function migrate() {
  console.log('🚀 Iniciando Migração Completa para Supabase: MATEUS CELESTINO PRO X');
  
  const pool = new Pool({
    host: 'db.lijrxbzotmoikyvjiipv.supabase.co',
    port: 5432,
    user: 'postgres',
    password: 'MateusProX_2026_SupabaseDb!',
    database: 'postgres',
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 10000,
  });

  const client = await pool.connect();

  try {
    console.log('🔌 Conectado com sucesso ao PostgreSQL 17 do Supabase.');

    await client.query('BEGIN');

    // 1. Extensões
    console.log('1️⃣ Habilitando extensões UUID e criptografia...');
    await client.query(`
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
      CREATE EXTENSION IF NOT EXISTS "pgcrypto";
    `);

    // 2. Drop das tabelas legadas vazias (id integer) para recriação com UUID
    console.log('2️⃣ Limpando tabelas legadas sem dados...');
    await client.query(`
      DROP TABLE IF EXISTS form_submissions CASCADE;
      DROP TABLE IF EXISTS forms CASCADE;
      DROP TABLE IF EXISTS members CASCADE;
      DROP TABLE IF EXISTS auth_sessions CASCADE;
      DROP TABLE IF EXISTS library_items CASCADE;
      DROP TABLE IF EXISTS articles CASCADE;
      DROP TABLE IF EXISTS admin_users CASCADE;
      DROP TABLE IF EXISTS leads CASCADE;
    `);

    // 3. Criação das tabelas unificadas oficiais (Drizzle Schema)
    console.log('3️⃣ Criando tabelas unificadas com UUID v4 e tipagem estrita...');
    await client.query(`
      -- 1. admin_users
      CREATE TABLE admin_users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        role VARCHAR(50) DEFAULT 'admin' NOT NULL,
        name VARCHAR(255) NOT NULL,
        last_login TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
      );

      -- 2. leads
      CREATE TABLE leads (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(100) NOT NULL,
        source VARCHAR(50) DEFAULT 'organic' NOT NULL,
        utm_source VARCHAR(150),
        utm_campaign VARCHAR(150),
        utm_medium VARCHAR(150),
        utm_content VARCHAR(150),
        metadata JSONB,
        status VARCHAR(50) DEFAULT 'novo' NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
      );
      CREATE INDEX leads_email_idx ON leads(email);
      CREATE INDEX leads_source_idx ON leads(source);
      CREATE INDEX leads_created_at_idx ON leads(created_at DESC);

      -- 3. members
      CREATE TABLE members (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        name VARCHAR(255) NOT NULL,
        status VARCHAR(50) DEFAULT 'active' NOT NULL,
        tier VARCHAR(50) DEFAULT 'free' NOT NULL,
        payment_id VARCHAR(255),
        last_login TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
      );
      CREATE INDEX members_email_idx ON members(email);
      CREATE INDEX members_status_idx ON members(status);

      -- 4. forms
      CREATE TABLE forms (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title VARCHAR(255) NOT NULL,
        description TEXT,
        slug VARCHAR(255) NOT NULL UNIQUE,
        schema_json JSONB NOT NULL,
        is_active BOOLEAN DEFAULT true NOT NULL,
        user_id UUID,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
      );
      CREATE INDEX forms_slug_idx ON forms(slug);

      -- 5. form_submissions
      CREATE TABLE form_submissions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        form_id UUID NOT NULL REFERENCES forms(id) ON DELETE CASCADE,
        data_json JSONB NOT NULL,
        ip_address VARCHAR(64),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
      );
      CREATE INDEX form_submissions_form_id_idx ON form_submissions(form_id);

      -- 6. library_items
      CREATE TABLE library_items (
        id VARCHAR(255) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL,
        description TEXT,
        file_url TEXT NOT NULL,
        size_bytes INTEGER DEFAULT 0 NOT NULL,
        tags JSONB,
        download_count INTEGER DEFAULT 0 NOT NULL,
        is_premium BOOLEAN DEFAULT false NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
      );
      CREATE INDEX library_items_category_idx ON library_items(category);
      CREATE INDEX library_items_is_premium_idx ON library_items(is_premium);

      -- 7. articles
      CREATE TABLE articles (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        slug VARCHAR(255) NOT NULL UNIQUE,
        title VARCHAR(300) NOT NULL,
        summary TEXT NOT NULL,
        content TEXT NOT NULL,
        category VARCHAR(100) NOT NULL,
        cover_url TEXT,
        reading_time VARCHAR(50) DEFAULT '5 min' NOT NULL,
        is_published BOOLEAN DEFAULT true NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
      );
      CREATE INDEX articles_slug_idx ON articles(slug);
      CREATE INDEX articles_category_idx ON articles(category);
      CREATE INDEX articles_is_published_idx ON articles(is_published);

      -- 8. auth_sessions
      CREATE TABLE auth_sessions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL,
        token TEXT NOT NULL UNIQUE,
        expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
      );
      CREATE INDEX auth_sessions_token_idx ON auth_sessions(token);
      CREATE INDEX auth_sessions_user_id_idx ON auth_sessions(user_id);

      -- 9. system_settings
      CREATE TABLE IF NOT EXISTS system_settings (
        key VARCHAR(100) PRIMARY KEY,
        value JSONB NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // 4. Aplicando Políticas de Segurança RLS (Row Level Security)
    console.log('4️⃣ Aplicando políticas de Row Level Security (RLS)...');
    await client.query(`
      ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
      ALTER TABLE members ENABLE ROW LEVEL SECURITY;
      ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
      ALTER TABLE forms ENABLE ROW LEVEL SECURITY;
      ALTER TABLE form_submissions ENABLE ROW LEVEL SECURITY;
      ALTER TABLE library_items ENABLE ROW LEVEL SECURITY;
      ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
      ALTER TABLE auth_sessions ENABLE ROW LEVEL SECURITY;
      ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

      -- admin_users: apenas service_role e postgres
      CREATE POLICY "admin_users_service_role_all" ON admin_users FOR ALL TO service_role USING (true) WITH CHECK (true);

      -- members: leitura autenticada / backend total
      CREATE POLICY "members_service_role_all" ON members FOR ALL TO service_role USING (true) WITH CHECK (true);
      CREATE POLICY "members_insert_public" ON members FOR INSERT TO anon, authenticated WITH CHECK (true);
      CREATE POLICY "members_select_public" ON members FOR SELECT TO anon, authenticated USING (true);

      -- leads: inserção pública de leads / gestão apenas backend
      CREATE POLICY "leads_insert_public" ON leads FOR INSERT TO anon, authenticated WITH CHECK (true);
      CREATE POLICY "leads_service_role_all" ON leads FOR ALL TO service_role USING (true) WITH CHECK (true);

      -- forms: visualização pública de forms ativos / gestão backend
      CREATE POLICY "forms_select_active" ON forms FOR SELECT TO anon, authenticated USING (is_active = true);
      CREATE POLICY "forms_service_role_all" ON forms FOR ALL TO service_role USING (true) WITH CHECK (true);

      -- form_submissions: envio público / gestão backend
      CREATE POLICY "form_submissions_insert_public" ON form_submissions FOR INSERT TO anon, authenticated WITH CHECK (true);
      CREATE POLICY "form_submissions_service_role_all" ON form_submissions FOR ALL TO service_role USING (true) WITH CHECK (true);

      -- library_items: leitura pública de não-premium / gestão backend
      CREATE POLICY "library_items_select_public" ON library_items FOR SELECT TO anon, authenticated USING (is_premium = false);
      CREATE POLICY "library_items_service_role_all" ON library_items FOR ALL TO service_role USING (true) WITH CHECK (true);

      -- articles: leitura pública de publicados / gestão backend
      CREATE POLICY "articles_select_published" ON articles FOR SELECT TO anon, authenticated USING (is_published = true);
      CREATE POLICY "articles_service_role_all" ON articles FOR ALL TO service_role USING (true) WITH CHECK (true);

      -- auth_sessions: apenas backend
      CREATE POLICY "auth_sessions_service_role_all" ON auth_sessions FOR ALL TO service_role USING (true) WITH CHECK (true);

      -- system_settings: leitura pública / gestão backend
      CREATE POLICY "system_settings_select_public" ON system_settings FOR SELECT TO anon, authenticated USING (true);
      CREATE POLICY "system_settings_service_role_all" ON system_settings FOR ALL TO service_role USING (true) WITH CHECK (true);
    `);

    // 5. Inserção de Dados Iniciais Seguros
    console.log('5️⃣ Inserindo dados mestres iniciais...');
    
    // Admin com hash bcrypt seguro (12 rounds)
    const adminEmail = '202405039459@alunos.estacio.br';
    const adminPass = 'MateusProX@2026!';
    const adminHash = await bcrypt.hash(adminPass, 12);

    await client.query(`
      INSERT INTO admin_users (name, email, password_hash, role)
      VALUES ($1, $2, $3, 'admin')
      ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash;
    `, ['Mateus Celestino Pro', adminEmail, adminHash]);

    // Membro Demo com hash bcrypt seguro
    const memberEmail = 'membro@mateuscelestinopro.com';
    const memberPass = 'MembroProX@2026!';
    const memberHash = await bcrypt.hash(memberPass, 12);

    await client.query(`
      INSERT INTO members (name, email, password_hash, status, tier)
      VALUES ($1, $2, $3, 'active', 'vip')
      ON CONFLICT (email) DO NOTHING;
    `, ['Membro Fundador Pro', memberEmail, memberHash]);

    // Formulário padrão
    await client.query(`
      INSERT INTO forms (title, description, slug, is_active, schema_json)
      VALUES ($1, $2, $3, true, $4)
      ON CONFLICT (slug) DO NOTHING;
    `, [
      'Diagnóstico de IA & Automação de Processos',
      'Mapeamento estratégico de gargalos e oportunidades para implementação de agentes autônomos.',
      'diagnostico-ia-automacao',
      JSON.stringify({
        steps: [
          {
            id: 'step_1',
            title: 'Identificação',
            fields: [
              { id: 'nome', label: 'Nome Completo', type: 'text', required: true },
              { id: 'email', label: 'E-mail Corporativo', type: 'email', required: true },
              { id: 'whatsapp', label: 'WhatsApp com DDD', type: 'phone', required: true },
            ],
          },
        ],
      })
    ]);

    // Configuração do Sistema
    await client.query(`
      INSERT INTO system_settings (key, value)
      VALUES ('plataforma_soberana', $1)
      ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
    `, [JSON.stringify({
      status: 'active',
      name: 'Plataforma Unificada Soberana',
      datacenter: 'sa-east-1',
      migrated_at: new Date().toISOString(),
      version: '2.0.0-supabase'
    })]);

    function cleanStr(s) {
      if (typeof s !== 'string') return '';
      return s.replace(/\0/g, '').trim();
    }

    // 6. Carga do Catálogo de 406 Recursos da Biblioteca Oculta
    const catalogPath = path.join(__dirname, '../public/data/library_catalog_index.json');
    if (fs.existsSync(catalogPath)) {
      console.log('6️⃣ Importando 406 itens da Biblioteca Oculta...');
      const catalogData = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
      for (const item of catalogData) {
        await client.query(`
          INSERT INTO library_items (id, title, category, description, file_url, size_bytes, tags, is_premium)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          ON CONFLICT (id) DO UPDATE SET
            title = EXCLUDED.title,
            category = EXCLUDED.category,
            file_url = EXCLUDED.file_url;
        `, [
          cleanStr(String(item.id || item.slug)),
          cleanStr(item.title || 'Recurso Sem Título'),
          cleanStr(item.category_group || item.category || 'Geral'),
          cleanStr(item.text_preview || item.title || '').slice(0, 5000),
          cleanStr(item.file || item.rel_path || '#'),
          item.size || 0,
          JSON.stringify(item.tags || []),
          Boolean(item.pages && item.pages > 5)
        ]);
      }
      console.log(`✅ ${catalogData.length} recursos da biblioteca carregados com sucesso.`);
    }

    // 7. Carga do Acervo de 176 Artigos
    const articlesPath = path.join(__dirname, '../src/data/articles.json');
    if (fs.existsSync(articlesPath)) {
      console.log('7️⃣ Importando 176 artigos do Acervo Editorial...');
      const articlesData = JSON.parse(fs.readFileSync(articlesPath, 'utf8'));
      const artsList = Array.isArray(articlesData) ? articlesData : Object.values(articlesData);
      for (const art of artsList) {
        if (!art.slug && !art.id) continue;
        const slug = cleanStr(art.slug || `artigo-${art.id}`);
        await client.query(`
          INSERT INTO articles (slug, title, summary, content, category, cover_url, reading_time, is_published)
          VALUES ($1, $2, $3, $4, $5, $6, $7, true)
          ON CONFLICT (slug) DO UPDATE SET
            title = EXCLUDED.title,
            summary = EXCLUDED.summary,
            content = EXCLUDED.content;
        `, [
          slug,
          cleanStr(art.title || 'Artigo sem título'),
          cleanStr(art.summary || art.description || ''),
          cleanStr(art.content || art.body || art.summary || ''),
          cleanStr(art.category || 'Geral'),
          art.cover_url || art.image ? cleanStr(art.cover_url || art.image) : null,
          cleanStr(art.reading_time || '5 min')
        ]);
      }
      console.log(`✅ ${artsList.length} artigos sincronizados com sucesso.`);
    }

    await client.query('COMMIT');
    console.log('✨ TRANSAÇÃO CONCLUÍDA COM SUCESSO! Banco de dados Supabase 100% transplantado.');

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ ERRO DURANTE A MIGRAÇÃO:', err);
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

migrate().catch((err) => {
  console.error('FATAL:', err.message);
  process.exit(1);
});
