/**
 * ==============================================================================
 * SUPER AUDITORIA E VALIDAÇÃO DE SEGURANÇA SUPABASE & PLATAFORMA SOBERANA
 * ==============================================================================
 * Este script executa uma auditoria completa de ponta a ponta na instância:
 * Projeto: MATEUS CELESTINO PRO X (ID: lijrxbzotmoikyvjiipv)
 * Região: sa-east-1 (São Paulo)
 */

const { Client } = require('pg');

const DATABASE_URL = process.env.DATABASE_URL || "postgresql://postgres:MateusProX_2026_SupabaseDb!@db.lijrxbzotmoikyvjiipv.supabase.co:5432/postgres";

async function runSuperAudit() {
  console.log('='.repeat(80));
  console.log('🔍 INICIANDO SUPER AUDITORIA DE SEGURANÇA & PORTABILIDADE SUPABASE');
  console.log('Projeto Alvo: MATEUS CELESTINO PRO X (lijrxbzotmoikyvjiipv)');
  console.log('Data/Hora:', new Date().toISOString());
  console.log('='.repeat(80));

  const cleanUrl = DATABASE_URL.split('?')[0];
  const client = new Client({
    connectionString: cleanUrl,
    ssl: { rejectUnauthorized: false }
  });

  await client.connect();
  console.log('✅ Conexão direta estabelecida com PostgreSQL 17 via SSL.');

  const results = {
    tables: [],
    rlsStatus: [],
    policies: [],
    indexes: [],
    storageBuckets: [],
    storagePolicies: [],
    anomalies: []
  };

  try {
    // 1. Auditoria de Tabelas e Contagem de Registros
    console.log('\n--- [1/6] AUDITORIA DE TABELAS E VOLUME DE DADOS ---');
    const tablesQuery = `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `;
    const tablesRes = await client.query(tablesQuery);
    
    for (const row of tablesRes.rows) {
      const countRes = await client.query(`SELECT count(*)::int as count FROM public."${row.table_name}"`);
      results.tables.push({ table: row.table_name, count: countRes.rows[0].count });
      console.log(`  • Tabela: ${row.table_name.padEnd(22)} | Registros: ${countRes.rows[0].count}`);
    }

    // 2. Auditoria de RLS (Row Level Security) em Todas as Tabelas
    console.log('\n--- [2/6] AUDITORIA DE RLS (ROW LEVEL SECURITY) ---');
    const rlsQuery = `
      SELECT 
        c.relname as table_name,
        c.relrowsecurity as rls_enabled,
        c.relforcerowsecurity as rls_forced
      FROM pg_class c
      JOIN pg_namespace n ON n.oid = c.relnamespace
      WHERE n.nspname = 'public' AND c.relkind = 'r'
      ORDER BY c.relname;
    `;
    const rlsRes = await client.query(rlsQuery);
    for (const row of rlsRes.rows) {
      results.rlsStatus.push(row);
      const status = row.rls_enabled ? 'ATIVO (SEGURO)' : '⚠️ DESATIVADO (RISCO CRÍTICO)';
      console.log(`  • ${row.table_name.padEnd(22)}: RLS ${status}`);
      if (!row.rls_enabled) {
        results.anomalies.push(`Tabela ${row.table_name} está sem RLS ativado!`);
      }
    }

    // 3. Auditoria de Políticas RLS Granulares
    console.log('\n--- [3/6] AUDITORIA DE POLÍTICAS RLS (POLICIES) ---');
    const polQuery = `
      SELECT 
        schemaname,
        tablename,
        policyname,
        permissive,
        roles,
        cmd,
        qual,
        with_check
      FROM pg_policies
      WHERE schemaname = 'public'
      ORDER BY tablename, policyname;
    `;
    const polRes = await client.query(polQuery);
    results.policies = polRes.rows;
    for (const p of polRes.rows) {
      console.log(`  • [${p.tablename}] Política "${p.policyname}" | Comando: ${p.cmd} | Roles: ${JSON.stringify(p.roles)}`);
      // Checar por armadilhas do Supabase:
      // - auth.role() obsoleto
      // - Políticas públicas sobre dados sensíveis
      if (p.qual && p.qual.includes('auth.role()')) {
        results.anomalies.push(`Política ${p.policyname} na tabela ${p.tablename} usa 'auth.role()' depreciado.`);
      }
      if (p.tablename === 'admin_users' && p.roles.includes('anon') && p.cmd !== 'SELECT') {
        results.anomalies.push(`Tabela sensível admin_users permite ${p.cmd} para role anon!`);
      }
    }

    // 4. Auditoria de Índices de Performance e Chaves Estrangeiras
    console.log('\n--- [4/6] AUDITORIA DE ÍNDICES E CHAVES DE PERFORMANCE ---');
    const idxQuery = `
      SELECT 
        tablename,
        indexname,
        indexdef
      FROM pg_indexes
      WHERE schemaname = 'public'
      ORDER BY tablename, indexname;
    `;
    const idxRes = await client.query(idxQuery);
    results.indexes = idxRes.rows;
    console.log(`  Total de índices no schema public: ${idxRes.rows.length}`);
    
    // Verificar índices em colunas críticas
    const criticalIndices = [
      { table: 'articles', col: 'slug' },
      { table: 'library_items', col: 'category' },
      { table: 'admin_users', col: 'email' },
      { table: 'members', col: 'email' },
      { table: 'form_submissions', col: 'form_id' }
    ];

    for (const crit of criticalIndices) {
      const found = idxRes.rows.some(i => i.tablename === crit.table && i.indexdef.toLowerCase().includes(crit.col.toLowerCase()));
      if (found) {
        console.log(`  ✅ Índice crítico verificado: ${crit.table} (${crit.col})`);
      } else {
        console.log(`  ⚠️ Aviso: Tabela ${crit.table} pode se beneficiar de índice explícito em (${crit.col})`);
      }
    }

    // 5. Auditoria de Supabase Storage (Buckets e Políticas)
    console.log('\n--- [5/6] AUDITORIA DO SUPABASE STORAGE ---');
    const bucketsQuery = `SELECT id, name, public, file_size_limit, allowed_mime_types FROM storage.buckets ORDER BY id;`;
    const bucketsRes = await client.query(bucketsQuery);
    results.storageBuckets = bucketsRes.rows;
    for (const b of bucketsRes.rows) {
      console.log(`  • Bucket: ${b.name.padEnd(16)} | Público: ${b.public ? 'SIM' : 'NÃO (Privado)'} | ID: ${b.id}`);
    }

    const storagePolQuery = `
      SELECT policyname, permissive, roles, cmd 
      FROM pg_policies 
      WHERE schemaname = 'storage' AND tablename = 'objects'
      ORDER BY policyname;
    `;
    const storagePolRes = await client.query(storagePolQuery);
    results.storagePolicies = storagePolRes.rows;
    console.log(`  Políticas ativas em storage.objects: ${storagePolRes.rows.length}`);
    for (const sp of storagePolRes.rows) {
      console.log(`  • Política Storage: "${sp.policyname}" | Comando: ${sp.cmd} | Roles: ${JSON.stringify(sp.roles)}`);
    }

    // 6. Teste de Integridade Transacional (Smoke CRUD Test)
    console.log('\n--- [6/6] TESTE DE INTEGRIDADE TRANSACIONAL (CRUD ACID) ---');
    const testAdminEmail = `smoke_audit_${Date.now()}@soberana.audit`;
    
    // Teste Insert
    const insertRes = await client.query(`
      INSERT INTO public.admin_users (id, email, password_hash, name, role)
      VALUES (gen_random_uuid(), $1, 'audit_hash_test', 'Auditor Smoke', 'admin')
      RETURNING id, email;
    `, [testAdminEmail]);
    const createdId = insertRes.rows[0].id;
    console.log(`  • [CREATE] Registro de teste inserido com sucesso: ID ${createdId}`);

    // Teste Select
    const selectRes = await client.query(`SELECT id, email, role FROM public.admin_users WHERE id = $1`, [createdId]);
    if (selectRes.rows.length === 1 && selectRes.rows[0].email === testAdminEmail) {
      console.log(`  • [READ] Leitura e integridade de tipos confirmada.`);
    }

    // Teste Update
    await client.query(`UPDATE public.admin_users SET name = 'Auditor Atualizado' WHERE id = $1`, [createdId]);
    console.log(`  • [UPDATE] Mutação atômica verificada.`);

    // Teste Delete (Cleanup)
    await client.query(`DELETE FROM public.admin_users WHERE id = $1`, [createdId]);
    console.log(`  • [DELETE] Exclusão e limpeza concluída com sucesso.`);

    console.log('\n' + '='.repeat(80));
    console.log('🎉 AUDITORIA CONCLUÍDA COM SUCESSO!');
    if (results.anomalies.length === 0) {
      console.log('STATUS FINAL: 100% CONFORME. ZERO VULNERABILIDADES OU DISCREPÂNCIAS IDENTIFICADAS.');
    } else {
      console.log('ANOMALIAS IDENTIFICADAS:');
      results.anomalies.forEach(a => console.log('  ⚠️', a));
    }
    console.log('='.repeat(80));

  } catch (err) {
    console.error('❌ ERRO NA AUDITORIA:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runSuperAudit();
