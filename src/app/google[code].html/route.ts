import { NextResponse } from 'next/server';

/**
 * Endpoint curinga para Verificação de Propriedade do Google Search Console via Arquivo HTML
 * Responde dinamicamente a qualquer arquivo google[code].html solicitado pelo Googlebot
 */
export async function GET(
  _request: Request,
  context: { params: Promise<{ code: string }> }
) {
  const { code } = await context.params;
  return new NextResponse(`google-site-verification: google${code}.html`, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
