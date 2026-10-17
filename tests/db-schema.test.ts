import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  adminUsers,
  leads,
  members,
  libraryItems,
  articles,
  authSessions,
} from '../src/lib/db/schema';
import { db, isDbConfigured, checkDatabaseHealth } from '../src/lib/db/index';

describe('Drizzle ORM — Unified Schema & Database Client Tests', () => {
  test('Deve exportar todas as tabelas centrais do schema unificado', () => {
    assert.ok(adminUsers, 'Tabela adminUsers deve estar definida');
    assert.ok(leads, 'Tabela leads deve estar definida');
    assert.ok(members, 'Tabela members deve estar definida');
    assert.ok(libraryItems, 'Tabela libraryItems deve estar definida');
    assert.ok(articles, 'Tabela articles deve estar definida');
    assert.ok(authSessions, 'Tabela authSessions deve estar definida');
  });

  test('Tabela admin_users deve conter colunas esperadas', () => {
    assert.ok(adminUsers.id, 'adminUsers.id deve existir');
    assert.ok(adminUsers.email, 'adminUsers.email deve existir');
    assert.ok(adminUsers.passwordHash, 'adminUsers.passwordHash deve existir');
    assert.ok(adminUsers.role, 'adminUsers.role deve existir');
    assert.ok(adminUsers.name, 'adminUsers.name deve existir');
    assert.ok(adminUsers.createdAt, 'adminUsers.createdAt deve existir');
    assert.ok(adminUsers.updatedAt, 'adminUsers.updatedAt deve existir');
  });

  test('Tabela leads deve conter campos para tráfego pago UTM', () => {
    assert.ok(leads.id, 'leads.id deve existir');
    assert.ok(leads.name, 'leads.name deve existir');
    assert.ok(leads.email, 'leads.email deve existir');
    assert.ok(leads.phone, 'leads.phone deve existir');
    assert.ok(leads.source, 'leads.source deve existir');
    assert.ok(leads.utmSource, 'leads.utmSource deve existir');
    assert.ok(leads.utmCampaign, 'leads.utmCampaign deve existir');
    assert.ok(leads.utmMedium, 'leads.utmMedium deve existir');
    assert.ok(leads.utmContent, 'leads.utmContent deve existir');
    assert.ok(leads.metadata, 'leads.metadata deve existir');
  });

  test('Tabela members deve conter campos de tier e pagamento', () => {
    assert.ok(members.id, 'members.id deve existir');
    assert.ok(members.email, 'members.email deve existir');
    assert.ok(members.passwordHash, 'members.passwordHash deve existir');
    assert.ok(members.status, 'members.status deve existir');
    assert.ok(members.tier, 'members.tier deve existir');
    assert.ok(members.paymentId, 'members.paymentId deve existir');
  });

  test('Tabela library_items deve conter metadados e controle premium', () => {
    assert.ok(libraryItems.id, 'libraryItems.id deve existir');
    assert.ok(libraryItems.title, 'libraryItems.title deve existir');
    assert.ok(libraryItems.category, 'libraryItems.category deve existir');
    assert.ok(libraryItems.fileUrl, 'libraryItems.fileUrl deve existir');
    assert.ok(libraryItems.sizeBytes, 'libraryItems.sizeBytes deve existir');
    assert.ok(libraryItems.downloadCount, 'libraryItems.downloadCount deve existir');
    assert.ok(libraryItems.isPremium, 'libraryItems.isPremium deve existir');
  });

  test('Tabela articles deve conter campos para acervo editorial', () => {
    assert.ok(articles.id, 'articles.id deve existir');
    assert.ok(articles.slug, 'articles.slug deve existir');
    assert.ok(articles.title, 'articles.title deve existir');
    assert.ok(articles.summary, 'articles.summary deve existir');
    assert.ok(articles.content, 'articles.content deve existir');
    assert.ok(articles.category, 'articles.category deve existir');
    assert.ok(articles.readingTime, 'articles.readingTime deve existir');
    assert.ok(articles.isPublished, 'articles.isPublished deve existir');
  });

  test('Tabela auth_sessions deve conter integridade de sessões', () => {
    assert.ok(authSessions.id, 'authSessions.id deve existir');
    assert.ok(authSessions.userId, 'authSessions.userId deve existir');
    assert.ok(authSessions.token, 'authSessions.token deve existir');
    assert.ok(authSessions.expiresAt, 'authSessions.expiresAt deve existir');
  });

  test('Instância do Drizzle deve exportar cliente db e funções de diagnóstico sem falhar a frio', async () => {
    assert.ok(db, 'Instância db deve existir');
    assert.strictEqual(typeof isDbConfigured, 'boolean', 'isDbConfigured deve ser booleano');

    const health = await checkDatabaseHealth();
    assert.ok(health, 'checkDatabaseHealth deve retornar objeto');
    assert.strictEqual(typeof health.connected, 'boolean', 'health.connected deve ser booleano');
    assert.ok(health.mode, 'health.mode deve estar definido');
  });
});
