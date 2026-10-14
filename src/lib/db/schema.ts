import { pgTable, uuid, varchar, text, timestamp, boolean, integer, jsonb } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

/**
 * ============================================================
 * PLATAFORMA UNIFICADA SOBERANA — SCHEMA DRIZZLE ORM (POSTGRESQL)
 * ============================================================
 * Consolidando os 4 ecossistemas:
 * 1. Portal Institucional & Tráfego (mateus-celestino-pro-x)
 * 2. Área de Membros & Comunidade (visuals-app-saas)
 * 3. Form Builder Cinemático (form-builder-saas)
 * 4. Biblioteca Oculta de Recursos (s-a-a-s-full-hidden-library)
 */

// ------------------------------------------------------------
// 1. ADMIN USERS (Gestão Administrativa & Superusuários)
// ------------------------------------------------------------
export const adminUsers = pgTable('admin_users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  role: varchar('role', { length: 50 }).default('admin').notNull(), // 'admin' | 'editor'
  name: varchar('name', { length: 255 }).notNull(),
  lastLogin: timestamp('last_login', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// ------------------------------------------------------------
// 2. LEADS (Tráfego Pago TikTok Ads, Meta Ads & Orgânico)
// ------------------------------------------------------------
export const leads = pgTable('leads', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 100 }).notNull(),
  source: varchar('source', { length: 50 }).default('organic').notNull(), // 'tiktok' | 'meta' | 'organic'
  utmSource: varchar('utm_source', { length: 150 }),
  utmCampaign: varchar('utm_campaign', { length: 150 }),
  utmMedium: varchar('utm_medium', { length: 150 }),
  utmContent: varchar('utm_content', { length: 150 }),
  metadata: jsonb('metadata'),
  status: varchar('status', { length: 50 }).default('novo').notNull(), // 'novo' | 'em_contato' | 'convertido' | 'arquivado'
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// ------------------------------------------------------------
// 3. MEMBERS (Comunidade Fechada, Alunos & Assinantes)
// ------------------------------------------------------------
export const members = pgTable('members', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  status: varchar('status', { length: 50 }).default('active').notNull(), // 'active' | 'pending' | 'inactive'
  tier: varchar('tier', { length: 50 }).default('free').notNull(), // 'free' | 'pro' | 'vip'
  paymentId: varchar('payment_id', { length: 255 }),
  lastLogin: timestamp('last_login', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// ------------------------------------------------------------
// 4. FORMS (Form Builder Cinemático)
// ------------------------------------------------------------
export const forms = pgTable('forms', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  schemaJson: jsonb('schema_json').notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  userId: uuid('user_id'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// ------------------------------------------------------------
// 5. FORM SUBMISSIONS (Respostas & Leads de Formulários)
// ------------------------------------------------------------
export const formSubmissions = pgTable('form_submissions', {
  id: uuid('id').defaultRandom().primaryKey(),
  formId: uuid('form_id')
    .references(() => forms.id, { onDelete: 'cascade' })
    .notNull(),
  dataJson: jsonb('data_json').notNull(),
  ipAddress: varchar('ip_address', { length: 64 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// ------------------------------------------------------------
// 6. LIBRARY ITEMS (Cofre Oculto de Recursos & Mídias)
// ------------------------------------------------------------
export const libraryItems = pgTable('library_items', {
  id: varchar('id', { length: 255 }).primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  category: varchar('category', { length: 100 }).notNull(),
  description: text('description'),
  fileUrl: text('file_url').notNull(),
  sizeBytes: integer('size_bytes').default(0).notNull(),
  tags: jsonb('tags'),
  downloadCount: integer('download_count').default(0).notNull(),
  isPremium: boolean('is_premium').default(false).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// ------------------------------------------------------------
// 7. ARTICLES (Acervo Editorial & Base de Conhecimento)
// ------------------------------------------------------------
export const articles = pgTable('articles', {
  id: uuid('id').defaultRandom().primaryKey(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  title: varchar('title', { length: 300 }).notNull(),
  summary: text('summary').notNull(),
  content: text('content').notNull(),
  category: varchar('category', { length: 100 }).notNull(),
  coverUrl: text('cover_url'),
  readingTime: varchar('reading_time', { length: 50 }).default('5 min').notNull(),
  isPublished: boolean('is_published').default(true).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// ------------------------------------------------------------
// 8. AUTH SESSIONS (Sessões Seguras & Tokens de Acesso)
// ------------------------------------------------------------
export const authSessions = pgTable('auth_sessions', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull(),
  token: text('token').notNull().unique(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// ------------------------------------------------------------
// RELAÇÕES DRIZZLE
// ------------------------------------------------------------
export const formsRelations = relations(forms, ({ many }) => ({
  submissions: many(formSubmissions),
}));

export const formSubmissionsRelations = relations(formSubmissions, ({ one }) => ({
  form: one(forms, {
    fields: [formSubmissions.formId],
    references: [forms.id],
  }),
}));

// ------------------------------------------------------------
// TIPOS INFERIDOS DRIZZLE (TypeScript Types)
// ------------------------------------------------------------
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

export type AuthSession = typeof authSessions.$inferSelect;
export type NewAuthSession = typeof authSessions.$inferInsert;
