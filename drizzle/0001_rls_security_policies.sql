-- ==============================================================================
-- PLATAFORMA UNIFICADA SOBERANA — ROW LEVEL SECURITY (RLS) & POLICIES
-- Compatível com Supabase PostgreSQL & Neon
-- ==============================================================================

-- 1. Habilitar RLS em todas as tabelas sensíveis
ALTER TABLE IF EXISTS admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS members ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS form_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS library_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS auth_sessions ENABLE ROW LEVEL SECURITY;

-- 2. admin_users: Nenhum acesso via chave anônima (apenas service_role backend)
DROP POLICY IF EXISTS "admin_users_service_role_all" ON admin_users;
CREATE POLICY "admin_users_service_role_all" ON admin_users
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- 3. members: Apenas backend (service_role e conexões diretas do servidor)
DROP POLICY IF EXISTS "members_service_role_all" ON members;
CREATE POLICY "members_service_role_all" ON members
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Garante que políticas públicas inseguras antigas sejam removidas
DROP POLICY IF EXISTS "members_insert_public" ON members;
DROP POLICY IF EXISTS "members_select_public" ON members;

-- 4. leads: Inserção pública permitida (captação de tráfego TikTok / Meta Ads)
DROP POLICY IF EXISTS "leads_insert_public" ON leads;
CREATE POLICY "leads_insert_public" ON leads
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "leads_service_role_select" ON leads;
CREATE POLICY "leads_service_role_select" ON leads
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- 5. forms: Leitura pública de formulários ativos
DROP POLICY IF EXISTS "forms_select_active" ON forms;
CREATE POLICY "forms_select_active" ON forms
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

DROP POLICY IF EXISTS "forms_service_role_manage" ON forms;
CREATE POLICY "forms_service_role_manage" ON forms
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- 6. form_submissions: Inserção pública de respostas de leads
DROP POLICY IF EXISTS "form_submissions_insert_public" ON form_submissions;
CREATE POLICY "form_submissions_insert_public" ON form_submissions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "form_submissions_service_role_manage" ON form_submissions;
CREATE POLICY "form_submissions_service_role_manage" ON form_submissions
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- 7. articles: Leitura pública de artigos publicados
DROP POLICY IF EXISTS "articles_select_published" ON articles;
CREATE POLICY "articles_select_published" ON articles
  FOR SELECT
  TO anon, authenticated
  USING (is_published = true);

DROP POLICY IF EXISTS "articles_service_role_manage" ON articles;
CREATE POLICY "articles_service_role_manage" ON articles
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- 8. library_items: Leitura pública de itens gratuitos e controle via backend
DROP POLICY IF EXISTS "library_items_select_public" ON library_items;
CREATE POLICY "library_items_select_public" ON library_items
  FOR SELECT
  TO anon, authenticated
  USING (is_premium = false);

DROP POLICY IF EXISTS "library_items_service_role_manage" ON library_items;
CREATE POLICY "library_items_service_role_manage" ON library_items
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
