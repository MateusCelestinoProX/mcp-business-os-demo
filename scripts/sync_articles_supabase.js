const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

async function syncAllArticles() {
  console.log('🚀 [Sync Articles] Iniciando sincronização total com Supabase...');

  // 1. Carrega variáveis de ambiente de .env.local
  const envPath = path.join(__dirname, '../.env.local');
  if (!fs.existsSync(envPath)) {
    throw new Error('.env.local não encontrado.');
  }

  const envContent = fs.readFileSync(envPath, 'utf8');
  let dbUrl = '';
  envContent.split('\n').forEach((line) => {
    if (line.startsWith('DATABASE_URL=')) {
      dbUrl = line.split('=').slice(1).join('=').trim().replace(/^["']/, '').replace(/["']$/, '');
    }
  });

  if (!dbUrl) {
    throw new Error('DATABASE_URL não encontrada no .env.local.');
  }

  const connStr = dbUrl.replace(/[?&]sslmode=[^&]+/g, '').replace(/\?$/, '');
  const pool = new Pool({ connectionString: connStr, ssl: { rejectUnauthorized: false } });
  const client = await pool.connect();

  try {
    // 2. Carrega acervo completo de artigos
    const articlesPath = path.join(__dirname, '../src/data/articles.json');
    const articles = JSON.parse(fs.readFileSync(articlesPath, 'utf8'));
    console.log(`📚 Carregados ${articles.length} artigos de articles.json.`);

    let updatedCount = 0;
    let insertedCount = 0;

    await client.query('BEGIN');

    for (const art of articles) {
      const slug = art.slug || `artigo-${art.id}`;
      const title = art.title || 'Artigo sem título';
      const summary = art.excerpt || art.summary || '';
      const content = art.contentHtml || art.content || art.rawContent || '';
      const category = art.category || 'Geral';
      const coverUrl = art.coverImage || art.coverUrl || '/assets/hero_cover.webp';
      const readingTime = typeof art.readingTime === 'number' ? `${art.readingTime} min` : String(art.readingTime || '5 min');

      const checkRes = await client.query('SELECT id FROM articles WHERE slug = $1', [slug]);

      if (checkRes.rows.length > 0) {
        // Atualiza artigo existente com dados 100% reais do acervo
        await client.query(
          `UPDATE articles 
           SET title = $1, summary = $2, content = $3, category = $4, cover_url = $5, reading_time = $6, is_published = true 
           WHERE slug = $7`,
          [title, summary, content, category, coverUrl, readingTime, slug]
        );
        updatedCount++;
      } else {
        // Insere caso não exista
        await client.query(
          `INSERT INTO articles (slug, title, summary, content, category, cover_url, reading_time, is_published)
           VALUES ($1, $2, $3, $4, $5, $6, $7, true)`,
          [slug, title, summary, content, category, coverUrl, readingTime]
        );
        insertedCount++;
      }
    }

    await client.query('COMMIT');

    console.log(`✅ Sincronização concluída com sucesso!`);
    console.log(`   - Artigos atualizados com conteúdo e capas: ${updatedCount}`);
    console.log(`   - Novos artigos inseridos: ${insertedCount}`);

    // Validação pós-sync
    const auditRes = await client.query(`
      SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN summary != '' THEN 1 END) as with_summary,
        COUNT(CASE WHEN cover_url IS NOT NULL THEN 1 END) as with_cover,
        COUNT(CASE WHEN length(content) > 100 THEN 1 END) as with_content
      FROM articles
    `);
    console.log('📊 Auditoria da tabela articles no Supabase:');
    console.log(auditRes.rows[0]);

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Erro durante sincronização:', err);
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

syncAllArticles()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
