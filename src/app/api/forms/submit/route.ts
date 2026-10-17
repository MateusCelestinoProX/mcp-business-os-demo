import { NextResponse } from 'next/server';
import { db, isDbConfigured } from '@/lib/db';
import { forms, formSubmissions } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
      formId = 'master_form', 
      formTitle = 'Formulário Sem Título', 
      responses = [], 
      notionToken, 
      notionPageUrl, 
      resendApiKey, 
      notifyEmail 
    } = body;

    const results = {
      dbSaved: false,
      notionSaved: false,
      resendSent: false,
      errors: [] as string[],
    };

    // Client IP tracking
    const clientIp = 
      req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      req.headers.get('x-real-ip') ||
      '127.0.0.1';

    // 1. DRIZZLE ORM DATABASE INSERTION
    let submissionId = `sub_${Date.now()}`;
    if (isDbConfigured) {
      try {
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(formId);
        let actualFormUuid: string | null = null;

        if (isUuid) {
          const existing = await db.query.forms.findFirst({
            where: eq(forms.id, formId),
          });
          if (existing) actualFormUuid = existing.id;
        } else {
          const bySlug = await db.query.forms.findFirst({
            where: eq(forms.slug, formId),
          });
          if (bySlug) {
            actualFormUuid = bySlug.id;
          } else {
            // Auto-register form in db if not present yet
            const [created] = await db
              .insert(forms)
              .values({
                title: formTitle,
                slug: formId,
                description: 'Criado dinamicamente via Form Builder',
                schemaJson: { formTitle, pages: [], questions: [] },
                isActive: true,
              })
              .returning();
            if (created) actualFormUuid = created.id;
          }
        }

        if (actualFormUuid) {
          const [inserted] = await db
            .insert(formSubmissions)
            .values({
              formId: actualFormUuid,
              dataJson: {
                formTitle,
                responses,
                submittedAt: new Date().toISOString(),
              },
              ipAddress: clientIp,
            })
            .returning();

          if (inserted) {
            results.dbSaved = true;
            submissionId = inserted.id;
          }
        }
      } catch (dbErr: any) {
        console.warn('⚠️ [Submit Route] Aviso ao persistir no banco de dados:', dbErr.message);
        results.errors.push(`DB: ${dbErr.message}`);
      }
    } else {
      console.log('ℹ️ [Submit Route] Modo offline: gravando submissão em logs locais.');
      results.dbSaved = true;
    }

    // 2. NOTION INTEGRATION
    const effectiveNotionToken = notionToken || process.env.NOTION_API_KEY;
    const effectiveNotionUrl = notionPageUrl || process.env.NOTION_PAGE_URL;

    if (effectiveNotionToken && effectiveNotionUrl) {
      try {
        const match = effectiveNotionUrl.match(/([a-f0-9]{32})/i) || effectiveNotionUrl.match(/([a-f0-9-]{36})/i);
        const parentPageId = match ? match[1].replace(/-/g, '') : null;

        if (parentPageId) {
          const blocks: any[] = [
            {
              object: 'block',
              type: 'callout',
              callout: {
                rich_text: [
                  { 
                    type: 'text', 
                    text: { 
                      content: `📋 Novo Preenchimento: ${formTitle} | ${new Date().toLocaleString('pt-BR')}` 
                    } 
                  }
                ],
                icon: { emoji: '⚡' },
                color: 'red_background',
              },
            },
            {
              object: 'block',
              type: 'heading_2',
              heading_2: {
                rich_text: [{ type: 'text', text: { content: 'Respostas dos Campos' } }],
              },
            },
          ];

          if (Array.isArray(responses)) {
            responses.forEach((r: { label: string; answer: any }) => {
              const answerText = typeof r.answer === 'object' 
                ? JSON.stringify(r.answer) 
                : String(r.answer || 'Não preenchido');

              blocks.push({
                object: 'block',
                type: 'paragraph',
                paragraph: {
                  rich_text: [
                    { type: 'text', text: { content: `${r.label}: ` }, annotations: { bold: true } },
                    { type: 'text', text: { content: answerText } },
                  ],
                },
              });
            });
          }

          const notionRes = await fetch(`https://api.notion.com/v1/blocks/${parentPageId}/children`, {
            method: 'PATCH',
            headers: {
              'Authorization': `Bearer ${effectiveNotionToken}`,
              'Notion-Version': '2022-06-28',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ children: blocks }),
          });

          if (notionRes.ok) {
            results.notionSaved = true;
          } else {
            const errBody = await notionRes.text();
            results.errors.push(`Notion HTTP ${notionRes.status}: ${errBody.slice(0, 100)}`);
          }
        }
      } catch (notionErr: any) {
        console.error('Erro na integração do Notion:', notionErr);
        results.errors.push(`Notion: ${notionErr.message}`);
      }
    }

    // 3. RESEND EMAIL NOTIFICATION INTEGRATION
    const effectiveResendKey = resendApiKey || process.env.RESEND_API_KEY;
    const recipientEmail = notifyEmail || process.env.NOTIFY_EMAIL || 'mateus@mateuscelestinopro.com';

    if (effectiveResendKey) {
      try {
        const escapeHtml = (str: any) =>
          String(str ?? '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');

        const formattedResponsesHtml = Array.isArray(responses)
          ? responses
              .map(
                (r: { label: string; answer: any }) =>
                  `<div style="margin-bottom: 12px; padding: 10px; background: rgba(255,255,255,0.05); border-radius: 8px; border: 1px solid rgba(255,255,255,0.1);"><strong style="color: #FF0033;">${escapeHtml(r.label)}:</strong> <span style="color: #ffffff;">${typeof r.answer === 'object' ? escapeHtml(JSON.stringify(r.answer)) : escapeHtml(r.answer || 'N/A')}</span></div>`
              )
              .join('')
          : '<p style="color: #aaa;">Sem respostas formatadas.</p>';

        const resendRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${effectiveResendKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'Mateus Celestino Pro <notificacoes@mateuscelestinopro.com>',
            to: [recipientEmail],
            subject: `🔔 [Novo Preenchimento] ${formTitle}`,
            html: `
              <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #050508; color: #ffffff; padding: 32px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.1); max-width: 600px; margin: 0 auto;">
                <div style="border-bottom: 1px solid rgba(255,0,51,0.3); padding-bottom: 16px; margin-bottom: 24px;">
                  <span style="font-size: 11px; font-weight: 700; letter-spacing: 2px; color: #FF0033; text-transform: uppercase;">Plataforma Unificada Soberana</span>
                  <h1 style="font-size: 22px; font-weight: 800; margin: 8px 0 4px 0; color: #ffffff;">Novo Formulário Recebido</h1>
                  <p style="font-size: 13px; color: #888899; margin: 0;">${formTitle} • ${new Date().toLocaleString('pt-BR')}</p>
                </div>

                <div style="margin-bottom: 24px;">
                  <h3 style="font-size: 14px; text-transform: uppercase; letter-spacing: 1px; color: #aaa; margin-bottom: 12px;">Respostas Coletadas:</h3>
                  ${formattedResponsesHtml}
                </div>

                <div style="border-top: 1px solid rgba(255,255,255,0.08); padding-top: 16px; font-size: 11px; color: #555566; display: flex; justify-content: space-between;">
                  <span>IP do Respondente: ${clientIp}</span>
                  <span>ID: ${submissionId}</span>
                </div>
              </div>
            `,
          }),
        });

        if (resendRes.ok) {
          results.resendSent = true;
        } else {
          const errText = await resendRes.text();
          results.errors.push(`Resend HTTP ${resendRes.status}: ${errText.slice(0, 100)}`);
        }
      } catch (resendErr: any) {
        console.error('Erro no envio de e-mail com Resend:', resendErr);
        results.errors.push(`Resend: ${resendErr.message}`);
      }
    }

    return NextResponse.json({
      success: true,
      submissionId,
      message: 'Formulário submetido e processado com sucesso!',
      results,
    });
  } catch (error: any) {
    console.error('Erro crítico no endpoint /api/forms/submit:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Erro interno ao processar submissão',
      },
      { status: 500 }
    );
  }
}
