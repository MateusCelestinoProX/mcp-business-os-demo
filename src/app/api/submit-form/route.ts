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
      responses, 
      notionToken, 
      notionPageUrl, 
      resendApiKey, 
      notifyEmail 
    } = body;

    const results = {
      dbSaved: false,
      notionSaved: false,
      resendSent: false,
      error: null as string | null
    };

    // Client IP tracking
    const clientIp = 
      req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      req.headers.get('x-real-ip') ||
      '127.0.0.1';

    // Target Admin Email
    const recipientEmail = notifyEmail || 'mateusgomes6667@gmail.com';

    // 1. DATABASE PERSISTENCE IF CONFIGURED
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
            const [created] = await db
              .insert(forms)
              .values({
                title: formTitle,
                slug: formId,
                description: 'Criado dinamicamente via Form Builder',
                schemaJson: { formTitle, responses },
                isActive: true,
              })
              .returning();
            if (created) actualFormUuid = created.id;
          }
        }

        if (actualFormUuid) {
          await db
            .insert(formSubmissions)
            .values({
              formId: actualFormUuid,
              dataJson: {
                formTitle,
                responses,
                submittedAt: new Date().toISOString(),
              },
              ipAddress: clientIp,
            });
          results.dbSaved = true;
        }
      } catch (dbErr: any) {
        console.warn('⚠️ [Submit-Form Route] DB note:', dbErr.message);
      }
    }

    // 2. NOTION INTEGRATION
    const effectiveNotionToken = notionToken || process.env.NOTION_API_KEY;
    const effectiveNotionUrl = notionPageUrl || process.env.NOTION_PAGE_URL;

    if (effectiveNotionToken && effectiveNotionUrl) {
      try {
        const match = effectiveNotionUrl.match(/([a-f0-9]{32})/i) || effectiveNotionUrl.match(/([a-f0-9-]{36})/i);
        const parentPageId = match ? match[1].replace(/-/g, '') : null;

        if (parentPageId) {
          const blocks = [
            {
              object: 'block',
              type: 'callout',
              callout: {
                rich_text: [{ type: 'text', text: { content: `📋 Novo Preenchimento: ${formTitle} | ${new Date().toLocaleString('pt-BR')}` } }],
                icon: { emoji: '🚀' },
                color: 'red_background'
              }
            },
            {
              object: 'block',
              type: 'heading_2',
              heading_2: {
                rich_text: [{ type: 'text', text: { content: 'Respostas do Formulário' } }]
              }
            }
          ];

          if (Array.isArray(responses)) {
            responses.forEach((r: { label: string; answer: string }) => {
              blocks.push({
                object: 'block',
                type: 'paragraph',
                paragraph: {
                  rich_text: [
                    { type: 'text', text: { content: `${r.label}: ` }, annotations: { bold: true } },
                    { type: 'text', text: { content: String(r.answer || 'Não preenchido') } }
                  ]
                }
              } as any);
            });
          }

          const notionRes = await fetch(`https://api.notion.com/v1/blocks/${parentPageId}/children`, {
            method: 'PATCH',
            headers: {
              'Authorization': `Bearer ${effectiveNotionToken}`,
              'Notion-Version': '2022-06-28',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ children: blocks })
          });

          if (notionRes.ok) {
            results.notionSaved = true;
          }
        }
      } catch (err: any) {
        console.error('Erro na integração do Notion:', err);
      }
    }

    // 3. RESEND EMAIL NOTIFICATION INTEGRATION
    const effectiveResendKey = resendApiKey || process.env.RESEND_API_KEY;

    if (effectiveResendKey) {
      try {
        const formattedResponsesHtml = Array.isArray(responses)
          ? responses.map(r => `<p><strong>${r.label}:</strong> ${r.answer || 'N/A'}</p>`).join('')
          : '<p>Sem respostas formatadas.</p>';

        const resendRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${effectiveResendKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: 'MCP Form System <onboarding@resend.dev>',
            to: [recipientEmail],
            subject: `🔔 [Novo Lead] Formulário Preenchido: ${formTitle}`,
            html: `
              <div style="font-family: Arial, sans-serif; background-color: #030305; color: #ffffff; padding: 24px; border-radius: 12px;">
                <h2 style="color: #FF0033;">Novo Formulário Recebido!</h2>
                <p><strong>Formulário:</strong> ${formTitle}</p>
                <p><strong>Data:</strong> ${new Date().toLocaleString('pt-BR')}</p>
                <hr style="border-color: #333;" />
                <h3>Respostas:</h3>
                ${formattedResponsesHtml}
              </div>
            `
          })
        });

        if (resendRes.ok) {
          results.resendSent = true;
        }
      } catch (err: any) {
        console.error('Erro no envio de e-mail com Resend:', err);
      }
    }

    return NextResponse.json({ success: true, results });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
