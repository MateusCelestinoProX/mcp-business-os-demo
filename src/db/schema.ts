import { pgTable, serial, text, varchar, timestamp, boolean, jsonb, integer, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ==============================================================================
// 1. ADMIN USERS (Painel Administrativo & Controle Soberano)
// ==============================================================================
export const adminUsers = pgTable('admin_users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 150 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  role: varchar('role', { length: 50 }).default('admin').notNull(), // 'admin' | 'superadmin' | 'editor'
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  lastLogin: timestamp('last_login', { withTimezone: true }),
});

// ==============================================================================
// 2. LEADS (Tráfego Pago, TikTok Ads, Meta Ads & Orgânico)
// ==============================================================================
export const leads = pgTable('leads', {
  id: serial('id').primaryKey(),
  nome: varchar('nome', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  whatsapp: varchar('whatsapp', { length: 100 }).notNull(),
  servico: varchar('servico', { length: 200 }).notNull(),
  mensagem: text('mensagem').notNull(),
  canalOrigem: varchar('canal_origem', { length: 50 }).default('organico').notNull(), // 'tiktok_ads' | 'meta_ads' | 'organico' | 'google_ads' | 'direto'
  status: varchar('status', { length: 50 }).default('novo').notNull(), // 'novo' | 'em_contato' | 'convertido' | 'arquivado'
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index('idx_leads_created_at').on(table.createdAt),
  index('idx_leads_canal_origem').on(table.canalOrigem),
  index('idx_leads_status').on(table.status),
]);

// ==============================================================================
// 3. MEMBERS (Área de Membros Visuals & Comunidade Fechada)
// ==============================================================================
export const members = pgTable('members', {
  id: serial('id').primaryKey(),
  nome: varchar('nome', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  nivelAcesso: varchar('nivel_acesso', { length: 50 }).default('free').notNull(), // 'free' | 'vip' | 'pro'
  statusPagamento: varchar('status_pagamento', { length: 50 }).default('pendente').notNull(), // 'ativo' | 'pendente' | 'cancelado' | 'gratuito'
  dataInscricao: timestamp('data_inscricao', { withTimezone: true }).defaultNow().notNull(),
  ultimoAcesso: timestamp('ultimo_acesso', { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index('idx_members_email').on(table.email),
  index('idx_members_nivel').on(table.nivelAcesso),
  index('idx_members_status_pagamento').on(table.statusPagamento),
]);

// ==============================================================================
// 4. FORMS (Form Builder Cinemático Multi-Step)
// ==============================================================================
export const forms = pgTable('forms', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  fields: jsonb('fields').$type<Array<{
    id: string;
    label: string;
    type: string;
    placeholder?: string;
    required?: boolean;
    options?: string[];
  }>>().notNull().default([]),
  notionConfig: jsonb('notion_config').$type<{
    token?: string;
    pageUrl?: string;
    databaseId?: string;
    enabled?: boolean;
  }>().default({}),
  resendConfig: jsonb('resend_config').$type<{
    apiKey?: string;
    recipientEmail?: string;
    fromEmail?: string;
    enabled?: boolean;
  }>().default({}),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index('idx_forms_slug').on(table.slug),
]);

// ==============================================================================
// 5. FORM SUBMISSIONS (Submissões e Leads Capturados pelos Formulários)
// ==============================================================================
export const formSubmissions = pgTable('form_submissions', {
  id: serial('id').primaryKey(),
  formId: integer('form_id').references(() => forms.id, { onDelete: 'cascade' }),
  responses: jsonb('responses').$type<Array<{
    fieldId?: string;
    label: string;
    answer: string;
  }>>().notNull().default([]),
  leadEmail: varchar('lead_email', { length: 255 }),
  status: varchar('status', { length: 50 }).default('recebido').notNull(), // 'recebido' | 'processado' | 'erro'
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index('idx_form_submissions_form_id').on(table.formId),
  index('idx_form_submissions_created_at').on(table.createdAt),
]);

// ==============================================================================
// 6. LIBRARY ITEMS (Biblioteca Oculta de Recursos & Vault)
// ==============================================================================
export const libraryItems = pgTable('library_items', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 300 }).notNull(),
  category: varchar('category', { length: 255 }).notNull(),
  description: text('description'),
  tags: jsonb('tags').$type<string[]>().default([]),
  downloadUrl: text('download_url'),
  isLocked: boolean('is_locked').default(false).notNull(),
  fileExt: varchar('file_ext', { length: 30 }),
  fileSize: integer('file_size'),
  relPath: text('rel_path'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index('idx_library_category').on(table.category),
  index('idx_library_locked').on(table.isLocked),
]);

// ==============================================================================
// 7. ARTICLES (176 Artigos Dinâmicos Institucionais & Blog de Alta Performance)
// ==============================================================================
export const articles = pgTable('articles', {
  id: serial('id').primaryKey(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  title: varchar('title', { length: 300 }).notNull(),
  category: varchar('category', { length: 100 }).notNull(),
  excerpt: text('excerpt'),
  contentHtml: text('content_html').notNull(),
  coverImage: text('cover_image'),
  readingTime: varchar('reading_time', { length: 50 }).default('5 min'),
  isFeatured: boolean('is_featured').default(false).notNull(),
  published: boolean('published').default(true).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index('idx_articles_slug').on(table.slug),
  index('idx_articles_category').on(table.category),
  index('idx_articles_published').on(table.published),
  index('idx_articles_featured').on(table.isFeatured),
]);

// ==============================================================================
// 8. CATEGORIES (Categorias Unificadas de Conteúdo e Biblioteca)
// ==============================================================================
export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  name: varchar('name', { length: 150 }).notNull(),
  module: varchar('module', { length: 50 }).default('branding').notNull(), // 'branding' | 'visuals' | 'library' | 'builder'
  description: text('description'),
  count: integer('count').default(0).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// ==============================================================================
// 9. SYSTEM SETTINGS (Configurações Gerais & Feature Flags)
// ==============================================================================
export const systemSettings = pgTable('system_settings', {
  key: varchar('key', { length: 100 }).primaryKey(),
  value: jsonb('value').notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// ==============================================================================
// DRIZZLE RELATIONS
// ==============================================================================
export const formsRelations = relations(forms, ({ many }) => ({
  submissions: many(formSubmissions),
}));

export const formSubmissionsRelations = relations(formSubmissions, ({ one }) => ({
  form: one(forms, {
    fields: [formSubmissions.formId],
    references: [forms.id],
  }),
}));

// ==============================================================================
// TYPESCRIPT TYPES
// ==============================================================================
export type AdminUser = typeof adminUsers.$inferSelect;
export type NewAdminUser = typeof adminUsers.$inferInsert;

export type Lead = typeof leads.$inferSelect;
export type NewLead = typeof leads.$inferInsert;

export type Member = typeof members.$inferSelect;
export type NewMember = typeof members.$inferInsert;

export type Form = typeof forms.$inferSelect;
export type NewForm = typeof forms.$inferInsert;

export type FormSubmission = typeof formSubmissions.$inferSelect;
export type NewFormSubmission = typeof formSubmissions.$inferInsert;

export type LibraryItem = typeof libraryItems.$inferSelect;
export type NewLibraryItem = typeof libraryItems.$inferInsert;

export type Article = typeof articles.$inferSelect;
export type NewArticle = typeof articles.$inferInsert;

export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;

export type SystemSetting = typeof systemSettings.$inferSelect;
export type NewSystemSetting = typeof systemSettings.$inferInsert;
