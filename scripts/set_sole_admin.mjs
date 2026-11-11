import { Pool } from 'pg';
import bcrypt from 'bcryptjs';

async function setSoleAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const email = (process.env.ADMIN_EMAIL || 'mcp6667@proton.me').toLowerCase().trim();
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error('ADMIN_EMAIL ou ADMIN_PASSWORD não definidos em .env.local');
  }

  console.log(`🔒 Provisionando único admin: ${email}`);
  const passwordHash = await bcrypt.hash(password, 10);

  // 1. Supabase Auth (auth.users via GoTrue Admin API)
  let authUserId = null;
  if (supabaseUrl && serviceKey) {
    const listRes = await fetch(`${supabaseUrl}/auth/v1/admin/users`, {
      headers: { Authorization: `Bearer ${serviceKey}`, apikey: serviceKey },
    });
    if (listRes.ok) {
      const data = await listRes.json();
      const existing = (data?.users || []).find((u) => u.email?.toLowerCase() === email);
      if (existing) {
        authUserId = existing.id;
        console.log(`✅ Usuário ${email} já existe no Supabase Auth: ${authUserId}`);
        const updateRes = await fetch(`${supabaseUrl}/auth/v1/admin/users/${authUserId}`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${serviceKey}`,
            apikey: serviceKey,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            password: password,
            email_confirm: true,
            user_metadata: { name: 'Mateus Celestino Pro X' },
            app_metadata: { role: 'admin', tier: 'vip' },
          }),
        });
        console.log(`✅ Atualização de senha GoTrue status: ${updateRes.status}`);
      } else {
        const createRes = await fetch(`${supabaseUrl}/auth/v1/admin/users`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${serviceKey}`,
            apikey: serviceKey,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: email,
            password: password,
            email_confirm: true,
            user_metadata: { name: 'Mateus Celestino Pro X' },
            app_metadata: { role: 'admin', tier: 'vip' },
          }),
        });
        console.log(`✅ Criação GoTrue status: ${createRes.status}`);
        if (createRes.ok) {
          const created = await createRes.json();
          authUserId = created.id;
        }
      }

      // Remover flag de admin nos outros usuários no GoTrue se houver
      for (const u of data?.users || []) {
        if (u.email?.toLowerCase() !== email && (u.user_metadata?.role === 'admin' || u.app_metadata?.role === 'admin')) {
          await fetch(`${supabaseUrl}/auth/v1/admin/users/${u.id}`, {
            method: 'PUT',
            headers: {
              Authorization: `Bearer ${serviceKey}`,
              apikey: serviceKey,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              user_metadata: { ...u.user_metadata, role: 'member' },
              app_metadata: { ...u.app_metadata, role: 'member' },
            }),
          });
          console.log(`ℹ️ Role admin removida de metadata em auth.users: ${u.email}`);
        }
      }
    }
  }

  // 2. PostgreSQL
  const connStr = (process.env.DATABASE_URL || '').replace(/[?&]sslmode=[^&]+/g, '').replace(/\?$/, '');
  const allowInsecureSsl = process.env.PG_SSL_ALLOW_INSECURE === 'true';
  const pool = new Pool({ connectionString: connStr, ssl: { rejectUnauthorized: !allowInsecureSsl } });
  const client = await pool.connect();

  try {
    // Apenas UM user admin em public.admin_users: deletar todos os outros
    const delRes = await client.query('DELETE FROM public.admin_users WHERE email != $1', [email]);
    console.log(`🗑️ Removidos ${delRes.rowCount} admins secundários de public.admin_users.`);

    // Inserir ou atualizar mcp6667@proton.me como único admin em admin_users
    await client.query(
      `INSERT INTO public.admin_users (email, password_hash, role, name)
       VALUES ($1, $2, 'admin', 'Mateus Celestino Pro X')
       ON CONFLICT (email) DO UPDATE SET
         password_hash = EXCLUDED.password_hash,
         role = 'admin',
         name = EXCLUDED.name,
         updated_at = NOW()`,
      [email, passwordHash]
    );
    console.log(`✅ public.admin_users configurado com sucesso para único admin: ${email}`);

    // Inserir ou atualizar em public.members
    const memRes = await client.query(
      `INSERT INTO public.members (email, password_hash, name, status, tier)
       VALUES ($1, $2, 'Mateus Celestino Pro X', 'active', 'vip')
       ON CONFLICT (email) DO UPDATE SET
         password_hash = EXCLUDED.password_hash,
         name = EXCLUDED.name,
         status = 'active',
         tier = 'vip'
       RETURNING id`,
      [email, passwordHash]
    );
    const memberId = memRes.rows[0]?.id;

    // Atualizar perfis existentes: apenas mcp6667@proton.me deve ser admin
    await client.query("UPDATE public.profiles SET role = 'member' WHERE email != $1 AND role = 'admin'", [email]);

    // Inserir ou atualizar perfil de mcp6667@proton.me
    const finalProfileId = authUserId || memberId;
    if (finalProfileId) {
      await client.query(
        `INSERT INTO public.profiles (id, name, email, role, avatar_url, accessible_products, bio)
         VALUES ($1, 'Mateus Celestino Pro X', $2, 'admin', 'https://api.dicebear.com/7.x/bottts/svg?seed=AdminBoss', $3::jsonb, $4)
         ON CONFLICT (email) DO UPDATE SET
           name = EXCLUDED.name,
           role = 'admin',
           avatar_url = EXCLUDED.avatar_url,
           accessible_products = EXCLUDED.accessible_products,
           bio = EXCLUDED.bio,
           updated_at = NOW()`,
        [
          finalProfileId,
          email,
          JSON.stringify(['ai-art', 'ai-portraits-pro', 'ai-effects-pro']),
          'Fundador & Arquiteto Soberano da Plataforma Mateus Celestino Pro X',
        ]
      );
      console.log(`✅ public.profiles configurado com sucesso para admin: ${email}`);
    }

    // Conferência do estado final
    const finalAdmins = await client.query('SELECT id, email, role, name FROM public.admin_users');
    console.log('👑 ESTADO FINAL public.admin_users:', finalAdmins.rows);

    const finalAdminProfiles = await client.query("SELECT id, email, role, name FROM public.profiles WHERE role = 'admin'");
    console.log('👑 ESTADO FINAL public.profiles (admins):', finalAdminProfiles.rows);

    console.log('✨ Único administrador provisionado com sucesso absoluto.');
  } finally {
    client.release();
    await pool.end();
  }
}

setSoleAdmin().catch((err) => {
  console.error('❌ Falha:', err);
  process.exit(1);
});
