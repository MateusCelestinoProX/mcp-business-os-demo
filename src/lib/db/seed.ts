import { db, isDbConfigured } from './index';
import { adminUsers, members, articles, libraryItems, leads } from './schema';
import { hashPassword } from '../auth/auth';
import { eq } from 'drizzle-orm';

/**
 * ============================================================
 * SCRIPT DE SEED INICIAL — PLATAFORMA UNIFICADA SOBERANA
 * ============================================================
 * Executa inserções idempotentes dos registros essenciais
 */

export async function runSeed() {
  console.log('🌱 [Seed] Iniciando semeadura do banco de dados unificado...');

  if (!isDbConfigured) {
    console.warn(
      '⚠️ [Seed] DATABASE_URL não está configurada no ambiente. Operação ignorada em modo offline.'
    );
    return { success: false, reason: 'database_not_configured' };
  }

  try {
    const adminPass = process.env.ADMIN_PASSWORD;
    const memberPass = process.env.MEMBER_PASSWORD;
    if (!adminPass || !memberPass) {
      throw new Error('ADMIN_PASSWORD e MEMBER_PASSWORD devem estar configuradas no ambiente (.env.local).');
    }

    const adminPasswordHash = await hashPassword(adminPass);
    const memberPasswordHash = await hashPassword(memberPass);

    // 1. Provisionar Tabelas da Comunidade, Políticas RLS e Buckets no Supabase PostgreSQL
    const connStr = (process.env.DATABASE_URL || '').replace(/[?&]sslmode=[^&]+/g, '').replace(/\?$/, '');
    if (connStr) {
      const { Pool } = await import('pg');
      const allowInsecureSsl = process.env.PG_SSL_ALLOW_INSECURE === 'true';
      const pool = new Pool({
        connectionString: connStr,
        ssl: {
          rejectUnauthorized: !allowInsecureSsl,
          ...(process.env.PG_CA_CERT ? { ca: process.env.PG_CA_CERT } : {}),
        },
      });
      const client = await pool.connect();
      try {
        // Remover eventuais linhas residuais de testes automatizados / XSS
        await client.query(`
          DELETE FROM public.members
          WHERE email LIKE 'xss_test_%'
             OR email LIKE 'mateus_unicode_%'
             OR email LIKE 'membro_179%'
        `);

        // Tabelas do Ecossistema Comunidade (A.I Visuals)
        await client.query(`
          CREATE TABLE IF NOT EXISTS public.profiles (
            id UUID PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            role VARCHAR(50) NOT NULL DEFAULT 'free',
            avatar_url TEXT,
            accessible_products JSONB DEFAULT '[]'::jsonb,
            bio TEXT,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
          );

          CREATE TABLE IF NOT EXISTS public.moderator_permissions (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            moderator_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
            can_manage_servers BOOLEAN NOT NULL DEFAULT true,
            can_manage_community BOOLEAN NOT NULL DEFAULT true,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            UNIQUE(moderator_id)
          );
          CREATE INDEX IF NOT EXISTS idx_moderator_permissions_mod_id ON public.moderator_permissions(moderator_id);

          CREATE TABLE IF NOT EXISTS public.community_posts (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
            title VARCHAR(300),
            content TEXT NOT NULL,
            link_url TEXT,
            link_title VARCHAR(255),
            images JSONB DEFAULT '[]'::jsonb,
            image_url TEXT,
            is_pinned BOOLEAN NOT NULL DEFAULT false,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
          );
          CREATE INDEX IF NOT EXISTS idx_community_posts_user_id ON public.community_posts(user_id);
          CREATE INDEX IF NOT EXISTS idx_community_posts_created_at ON public.community_posts(created_at DESC);

          CREATE TABLE IF NOT EXISTS public.community_comments (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            post_id UUID NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
            user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
            content TEXT NOT NULL,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
          );
          CREATE INDEX IF NOT EXISTS idx_community_comments_post_id ON public.community_comments(post_id);
          CREATE INDEX IF NOT EXISTS idx_community_comments_user_id ON public.community_comments(user_id);

          CREATE TABLE IF NOT EXISTS public.community_likes (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            post_id UUID NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
            user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            UNIQUE(post_id, user_id)
          );
          CREATE INDEX IF NOT EXISTS idx_community_likes_post_id ON public.community_likes(post_id);
          CREATE INDEX IF NOT EXISTS idx_community_likes_user_id ON public.community_likes(user_id);

          CREATE TABLE IF NOT EXISTS public.servers (
            id VARCHAR(100) PRIMARY KEY DEFAULT ('srv_' || substr(md5(random()::text), 1, 10)),
            title VARCHAR(255) NOT NULL,
            description TEXT,
            hero_image TEXT,
            display_order INTEGER NOT NULL DEFAULT 0,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
          );

          CREATE TABLE IF NOT EXISTS public.server_lessons (
            id VARCHAR(100) PRIMARY KEY DEFAULT ('les_' || substr(md5(random()::text), 1, 10)),
            server_id VARCHAR(100) NOT NULL REFERENCES public.servers(id) ON DELETE CASCADE,
            title VARCHAR(255) NOT NULL,
            video_url TEXT,
            content_markdown TEXT,
            display_order INTEGER NOT NULL DEFAULT 0,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
          );
          CREATE INDEX IF NOT EXISTS idx_server_lessons_server_id ON public.server_lessons(server_id);

          CREATE TABLE IF NOT EXISTS public.banners (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            type VARCHAR(50) NOT NULL DEFAULT 'hero',
            title VARCHAR(255) NOT NULL,
            subtitle TEXT,
            image_url TEXT,
            link_url TEXT,
            link_label VARCHAR(100) DEFAULT 'Saiba Mais',
            is_active BOOLEAN NOT NULL DEFAULT true,
            display_order INTEGER NOT NULL DEFAULT 0,
            created_by UUID,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
          );

          CREATE TABLE IF NOT EXISTS public.user_purchases (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
            product_slug VARCHAR(150) NOT NULL,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
          );
          CREATE INDEX IF NOT EXISTS idx_user_purchases_user_id ON public.user_purchases(user_id);
        `);

        // Configuração de Políticas Fortificadas de Row Level Security (RLS)
        const allTables = [
          'profiles', 'moderator_permissions', 'community_posts',
          'community_comments', 'community_likes', 'servers',
          'server_lessons', 'banners', 'user_purchases',
        ];
        for (const tb of allTables) {
          await client.query(`ALTER TABLE public.${tb} ENABLE ROW LEVEL SECURITY;`);
          await client.query(`DROP POLICY IF EXISTS "Public read ${tb}" ON public.${tb};`);
          await client.query(`DROP POLICY IF EXISTS "Authenticated write ${tb}" ON public.${tb};`);
          await client.query(`DROP POLICY IF EXISTS "Admin write ${tb}" ON public.${tb};`);
          await client.query(`DROP POLICY IF EXISTS "Owner write ${tb}" ON public.${tb};`);
          await client.query(`DROP POLICY IF EXISTS "Service role write ${tb}" ON public.${tb};`);
        }

        // 1. Leituras públicas de conteúdo
        for (const tb of ['profiles', 'community_posts', 'community_comments', 'community_likes', 'servers', 'server_lessons', 'banners']) {
          await client.query(`CREATE POLICY "Public read ${tb}" ON public.${tb} FOR SELECT USING (true);`);
        }

        // 2. Tabelas Administrativas: escrita exclusiva para service_role (backend/API)
        for (const tb of ['moderator_permissions', 'servers', 'server_lessons', 'banners', 'user_purchases']) {
          await client.query(
            `CREATE POLICY "Service role write ${tb}" ON public.${tb} FOR ALL TO service_role USING (true) WITH CHECK (true);`
          );
        }

        // 3. User Purchases: leitura permitida apenas ao dono da compra ou service_role
        await client.query(`CREATE POLICY "Owner read user_purchases" ON public.user_purchases FOR SELECT TO authenticated USING (auth.uid() = user_id);`);

        // 4. Profiles: usuário pode criar e editar estritamente seu próprio perfil
        await client.query(`CREATE POLICY "Owner insert profiles" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);`);
        await client.query(`CREATE POLICY "Owner update profiles" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);`);
        await client.query(`CREATE POLICY "Service role write profiles" ON public.profiles FOR ALL TO service_role USING (true) WITH CHECK (true);`);

        // 5. Posts e Comentários: usuário pode criar e gerenciar estritamente os seus
        await client.query(`CREATE POLICY "Owner write community_posts" ON public.community_posts FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);`);
        await client.query(`CREATE POLICY "Service role write community_posts" ON public.community_posts FOR ALL TO service_role USING (true) WITH CHECK (true);`);
        await client.query(`CREATE POLICY "Owner write community_comments" ON public.community_comments FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);`);
        await client.query(`CREATE POLICY "Service role write community_comments" ON public.community_comments FOR ALL TO service_role USING (true) WITH CHECK (true);`);
        await client.query(`CREATE POLICY "Owner write community_likes" ON public.community_likes FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);`);
        await client.query(`CREATE POLICY "Service role write community_likes" ON public.community_likes FOR ALL TO service_role USING (true) WITH CHECK (true);`);

        // Provisionar contas reais em auth.users (via GoTrue Admin API), admin_users, members e profiles
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
        const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        const officialAdmins = [
          {
            email: (process.env.ADMIN_EMAIL || 'mcp6667@proton.me').toLowerCase().trim(),
            name: 'Mateus Celestino Pro X',
            password: adminPass,
            hash: adminPasswordHash,
            isAdmin: true,
            role: 'admin',
            tier: 'vip',
            avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=AdminBoss',
          },
          {
            email: 'membro@mateuscelestinopro.com',
            name: 'Membro Fundador Pro',
            password: memberPass,
            hash: memberPasswordHash,
            isAdmin: false,
            role: 'full',
            tier: 'vip',
            avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=MemberProX',
          },
        ];

        let existingAuthUsers: any[] = [];
        if (supabaseUrl && serviceKey) {
          const listRes = await fetch(`${supabaseUrl}/auth/v1/admin/users`, {
            headers: { Authorization: `Bearer ${serviceKey}`, apikey: serviceKey },
          });
          if (listRes.ok) {
            const listData = await listRes.json();
            existingAuthUsers = listData?.users || [];
          }
        }

        for (const acc of officialAdmins) {
          let authUserId: string | null = null;
          if (supabaseUrl && serviceKey) {
            const foundAuth = existingAuthUsers.find(
              (u: any) => u.email?.toLowerCase() === acc.email.toLowerCase()
            );
            if (!foundAuth) {
              const createRes = await fetch(`${supabaseUrl}/auth/v1/admin/users`, {
                method: 'POST',
                headers: {
                  Authorization: `Bearer ${serviceKey}`,
                  apikey: serviceKey,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  email: acc.email,
                  password: acc.password,
                  email_confirm: true,
                  user_metadata: { name: acc.name },
                  app_metadata: { role: acc.role, tier: acc.tier },
                }),
              });
              if (createRes.ok) {
                const createdUser = await createRes.json();
                authUserId = createdUser.id;
                console.log(`✅ [Seed] Criado em Supabase Auth (auth.users): ${acc.email}`);
              }
            } else {
              authUserId = foundAuth.id;
              await fetch(`${supabaseUrl}/auth/v1/admin/users/${authUserId}`, {
                method: 'PUT',
                headers: {
                  Authorization: `Bearer ${serviceKey}`,
                  apikey: serviceKey,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  password: acc.password,
                  email_confirm: true,
                  user_metadata: { name: acc.name },
                  app_metadata: { role: acc.role, tier: acc.tier },
                }),
              });
              console.log(`✅ [Seed] Sincronizado em Supabase Auth (auth.users): ${acc.email}`);
            }
          }

          if (acc.isAdmin) {
            await client.query(
              `DELETE FROM public.admin_users WHERE email != $1`,
              [acc.email]
            );
            await client.query(
              `INSERT INTO public.admin_users (email, password_hash, role, name)
               VALUES ($1, $2, 'admin', $3)
               ON CONFLICT (email) DO UPDATE SET
                 password_hash = EXCLUDED.password_hash,
                 role = 'admin',
                 name = EXCLUDED.name,
                 updated_at = NOW()`,
              [acc.email, acc.hash, acc.name]
            );
            await client.query(
              `UPDATE public.profiles SET role = 'member' WHERE email != $1 AND role = 'admin'`,
              [acc.email]
            );
          }

          const memRes = await client.query(
            `INSERT INTO public.members (email, password_hash, name, status, tier)
             VALUES ($1, $2, $3, 'active', $4)
             ON CONFLICT (email) DO UPDATE SET
               password_hash = EXCLUDED.password_hash,
               name = EXCLUDED.name,
               status = 'active',
               tier = EXCLUDED.tier
             RETURNING id`,
            [acc.email, acc.hash, acc.name, acc.tier]
          );

          const profileId = authUserId || memRes.rows[0]?.id;
          if (profileId) {
            await client.query(
              `INSERT INTO public.profiles (id, name, email, role, avatar_url, accessible_products, bio)
               VALUES ($1, $2, $3, $4, $5, $6::jsonb, $7)
               ON CONFLICT (email) DO UPDATE SET
                 name = EXCLUDED.name,
                 role = EXCLUDED.role,
                 avatar_url = EXCLUDED.avatar_url,
                 accessible_products = EXCLUDED.accessible_products,
                 updated_at = NOW()`,
              [
                profileId,
                acc.name,
                acc.email,
                acc.role,
                acc.avatar,
                JSON.stringify(['ai-art', 'ai-portraits-pro', 'ai-effects-pro']),
                acc.isAdmin
                  ? 'Fundador & Arquiteto da Plataforma Soberana Mateus Celestino Pro X'
                  : 'Membro Oficial da Comunidade A.I Visuals',
              ]
            );
          }
        }

        // Buckets de Storage (community-media e avatars)
        if (supabaseUrl && serviceKey) {
          for (const bucketName of ['community-media', 'avatars']) {
            await fetch(`${supabaseUrl}/storage/v1/bucket`, {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${serviceKey}`,
                apikey: serviceKey,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                id: bucketName,
                name: bucketName,
                public: true,
                file_size_limit: 5242880,
              }),
            }).catch(() => null);
          }
        }

        // Semeadura de Servers & Aulas da Comunidade
        const srvCount = await client.query('SELECT COUNT(*)::int AS cnt FROM public.servers');
        if (srvCount.rows[0].cnt === 0) {
          await client.query(`
            INSERT INTO public.servers (id, title, description, hero_image, display_order) VALUES
            ('srv_art_pro', 'Masterclass A.I Art Pro', 'Treinamento completo em criação artística de ultra-alta resolução, fotorrealismo e direção de arte com IA.', './public/assets/images/opt_0008_img_exact_87ca3.webp', 1),
            ('srv_prompts_mastery', 'Engenharia de Prompts & Consistência', 'Metodologias avançadas para geração consistente de personagens, estilos autorais e controle de sementes.', './public/assets/images/opt_0000_img_exact_29e38.webp', 2),
            ('srv_effects_commercial', 'A.I Effects & Criação Comercial', 'Efeitos 3D, tipografia dinâmica, iluminação volumétrica e monetização com produtos digitais.', './public/assets/images/opt_0740_img_exact_666ee.webp', 3)
          `);
          await client.query(
            `INSERT INTO public.server_lessons (id, server_id, title, video_url, content_markdown, display_order) VALUES
             ($1, $2, $3, $4, $5, 1),
             ($6, $7, $8, $9, $10, 2),
             ($11, $12, $13, $14, $15, 1),
             ($16, $17, $18, $19, $20, 1)`,
            [
              'les_art_1', 'srv_art_pro', 'Aula 1: Fundamentos da Direção Visual com IA Generativa', 'https://www.youtube.com/embed/dQw4w9WgXcQ', '### Módulo 1: Fundamentos Visuais\n\nNesta masterclass exploramos as bases essenciais da estética visual com modelos generativos, dominando iluminação, texturas fotorrealistas e composição harmônica.',
              'les_art_2', 'srv_art_pro', 'Aula 2: Engenharia de Prompts Fotorrealistas & Câmeras', 'https://www.youtube.com/embed/dQw4w9WgXcQ', '### Módulo 2: Técnicas de Câmera e Objetivas\n\nAprenda a usar parâmetros como f/1.8, 85mm portrait lens, anamorphic bokeh e volumetria de luz natural para resultados de estúdio.',
              'les_pm_1', 'srv_prompts_mastery', 'Aula 1: Consistência Facial e Identidade Visual', 'https://www.youtube.com/embed/dQw4w9WgXcQ', '### Módulo 1: Consistência de Personagem\n\nComo manter o mesmo rosto, roupas e expressividade ao longo de múltiplos ângulos e cenas.',
              'les_ef_1', 'srv_effects_commercial', 'Aula 1: Tipografia Experimental e Efeitos 3D', 'https://www.youtube.com/embed/dQw4w9WgXcQ', '### Módulo 1: Efeitos Visuais de Impacto\n\nCriação de letras infláveis, vidro cromado, materiais translúcidos e iluminação neon.'
            ]
          );
        }

        const postCount = await client.query('SELECT COUNT(*)::int AS cnt FROM public.community_posts');
        if (postCount.rows[0].cnt === 0) {
          const adminProfile = await client.query("SELECT id FROM public.profiles WHERE role = 'admin' LIMIT 1");
          if (adminProfile.rows[0]?.id) {
            await client.query(
              `INSERT INTO public.community_posts (user_id, title, content, images, is_pinned)
               VALUES ($1, $2, $3, $4::jsonb, true)`,
              [
                adminProfile.rows[0].id,
                '✨ Bem-vindos à Comunidade A.I Visuals!',
                'Espaço exclusivo para membros e criadores de elite compartilharem seus prompts, novos estilos e masterclasses generativas. Sintam-se à vontade para postar suas dúvidas, prompts favoritos e feedbacks!',
                JSON.stringify(['./public/assets/images/opt_0008_img_exact_87ca3.webp']),
              ]
            );
          }
        }
      } finally {
        client.release();
        await pool.end();
      }
    }

    // 3. Lead Inicial de Demonstração
    await db.insert(leads).values({
      name: 'Arthur Pendelton',
      email: 'arthur@enterprise.io',
      phone: '+55 11 98877-6655',
      source: 'tiktok',
      utmSource: 'tiktok_ads',
      utmCampaign: 'campanha_agentes_ia_v1',
      status: 'novo',
      metadata: { empresa: 'Enterprise IO', servico: 'Agentes WhatsApp' },
    });
    console.log('✅ [Seed] Lead demonstrativo inserido.');

    // 5. Artigo Inicial
    const articleSlug = 'arquitetura-plataforma-unificada-soberana';
    const existingArticle = await db
      .select()
      .from(articles)
      .where(eq(articles.slug, articleSlug))
      .limit(1);

    if (existingArticle.length === 0) {
      await db.insert(articles).values({
        slug: articleSlug,
        title: 'Arquitetura da Plataforma Unificada Soberana em Next.js 15 & Drizzle',
        summary: 'Como consolidamos os ecossistemas de software em uma infraestrutura resiliente e orientada a performance.',
        content: '# Plataforma Unificada Soberana\n\nConsolidação total de Shaders WebGL, Drizzle ORM e Biblioteca Oculta.',
        category: 'Engenharia de Software',
        readingTime: '6 min',
        isPublished: true,
      });
      console.log(`✅ [Seed] Artigo editorial criado: ${articleSlug}`);
    }

    // 6. Itens Iniciais da Biblioteca Oculta
    const existingLibItem = await db
      .select()
      .from(libraryItems)
      .where(eq(libraryItems.id, 'prompt-pack-visuals-01'))
      .limit(1);

    if (existingLibItem.length === 0) {
      await db.insert(libraryItems).values({
        id: 'prompt-pack-visuals-01',
        title: 'Master Prompt Vault — Midjourney v6 & Flux 1.1',
        category: 'Prompts & IA',
        description: 'Acervo exclusivo com 150+ estruturas testadas para geração ultra-realista.',
        fileUrl: '/data/vault/master-prompts-v6.json',
        sizeBytes: 1048576,
        tags: ['ia', 'midjourney', 'flux', 'prompts'],
        downloadCount: 42,
        isPremium: true,
      });
      console.log('✅ [Seed] Recurso da biblioteca ocultada inserido.');
    }

    console.log('🎉 [Seed] Processo de semeadura finalizado com total sucesso!');
    return { success: true };
  } catch (err: any) {
    console.error('❌ [Seed] Erro durante a semeadura:', err);
    return { success: false, error: err?.message };
  }
}

// Permite execução direta via CLI (ex: tsx src/lib/db/seed.ts)
if (process.argv[1] && process.argv[1].endsWith('seed.ts')) {
  runSeed().then(() => process.exit(0)).catch(() => process.exit(1));
}
