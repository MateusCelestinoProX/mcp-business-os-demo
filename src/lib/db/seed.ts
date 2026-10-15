import { db, isDbConfigured } from './index';
import { adminUsers, members, forms, articles, libraryItems, leads } from './schema';
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
    // 1. Admin Inicial Soberano
    const adminEmail = (process.env.ADMIN_EMAIL || '202405039459@alunos.estacio.br').toLowerCase().trim();
    const adminPass = process.env.ADMIN_PASSWORD;
    if (!adminPass) {
      throw new Error('ADMIN_PASSWORD não configurada no ambiente (.env.local) para execução do seed.');
    }
    const adminPasswordHash = await hashPassword(adminPass);

    const existingAdmin = await db
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.email, adminEmail))
      .limit(1);

    if (existingAdmin.length === 0) {
      await db.insert(adminUsers).values({
        name: 'Mateus Celestino Pro',
        email: adminEmail,
        passwordHash: adminPasswordHash,
        role: 'admin',
      });
      console.log(`✅ [Seed] Admin criado com sucesso: ${adminEmail}`);
    } else {
      console.log(`ℹ️ [Seed] Admin já existente: ${adminEmail}`);
    }

    // 2. Membro Pro de Exemplo
    const memberEmail = 'membro@mateuscelestinopro.com';
    const memberPass = process.env.MEMBER_PASSWORD || 'MembroProX@2026!';
    const memberPasswordHash = await hashPassword(memberPass);

    const existingMember = await db
      .select()
      .from(members)
      .where(eq(members.email, memberEmail))
      .limit(1);

    if (existingMember.length === 0) {
      await db.insert(members).values({
        name: 'Membro Fundador Pro',
        email: memberEmail,
        passwordHash: memberPasswordHash,
        status: 'active',
        tier: 'vip',
      });
      console.log(`✅ [Seed] Membro VIP criado: ${memberEmail}`);
    }

    // 3. Formulário de Diagnóstico Padrão
    const formSlug = 'diagnostico-ia-automacao';
    const existingForm = await db
      .select()
      .from(forms)
      .where(eq(forms.slug, formSlug))
      .limit(1);

    if (existingForm.length === 0) {
      await db.insert(forms).values({
        title: 'Diagnóstico de IA & Automação de Processos',
        description: 'Mapeamento estratégico de gargalos e oportunidades para implementação de agentes autônomos.',
        slug: formSlug,
        isActive: true,
        schemaJson: {
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
            {
              id: 'step_2',
              title: 'Cenário Atual',
              fields: [
                {
                  id: 'faturamento',
                  label: 'Faixa de Faturamento Mensal',
                  type: 'select',
                  options: ['Até R$ 50k', 'R$ 50k a R$ 200k', 'R$ 200k a R$ 1M', 'Acima de R$ 1M'],
                  required: true,
                },
                {
                  id: 'desafio',
                  label: 'Qual o principal gargalo operacional da sua operação hoje?',
                  type: 'textarea',
                  required: true,
                },
              ],
            },
          ],
        },
      });
      console.log(`✅ [Seed] Formulário padrão criado: ${formSlug}`);
    }

    // 4. Lead Inicial de Demonstração
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
        summary: 'Como consolidamos 4 ecossistemas de software em uma infraestrutura resiliente e orientada a performance.',
        content: '# Plataforma Unificada Soberana\n\nConsolidação total de Shaders WebGL, Drizzle ORM, Form Builder e Biblioteca Oculta.',
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
