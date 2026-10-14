import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const htmlPath = path.join(process.cwd(), 'public', 'biblioteca', 'index.html');
    const html = fs.readFileSync(htmlPath, 'utf-8');

    return new NextResponse(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  } catch (error) {
    console.error('Erro ao servir a Free Library original:', error);
    return new NextResponse('Erro ao carregar a interface da biblioteca.', { status: 500 });
  }
}
