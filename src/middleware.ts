import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth/jwt';

/**
 * ============================================================
 * MIDDLEWARE DE SEGURANÇA SOBERANA (NEXT.JS 15 APP ROUTER)
 * ============================================================
 * Validação de sessão server-side, rate limiting e cabeçalhos de segurança HTTP
 */

const ADMIN_API_ROUTES = ['/api/members'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('mcp_session_token')?.value;

  // Clone headers para repassar identidade decodificada se autenticado
  const requestHeaders = new Headers(request.headers);

  let session = null;
  if (token) {
    session = await verifyToken(token);
    if (session) {
      requestHeaders.set('x-user-id', session.userId);
      requestHeaders.set('x-user-email', session.email);
      requestHeaders.set('x-user-role', session.role);
    }
  }

  // 1. Proteção de endpoints de API administrativos restritos
  const isAdminApi = ADMIN_API_ROUTES.some((route) => pathname.startsWith(route));
  if (isAdminApi) {
    // Permite se houver Authorization Bearer header
    const authHeader = request.headers.get('authorization');
    const hasBearer = authHeader && authHeader.startsWith('Bearer ');

    if (!session && !hasBearer) {
      return NextResponse.json(
        { success: false, error: 'Acesso restrito. Autenticação de administrador necessária.' },
        { status: 401 }
      );
    }

    if (session && session.role !== 'admin' && (session as any).role !== 'moder') {
      return NextResponse.json(
        { success: false, error: 'Acesso negado. Privilégios insuficientes.' },
        { status: 403 }
      );
    }
  }

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  // 2. Cabeçalhos de Segurança HTTP (OWASP Recommended)
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-XSS-Protection', '1; mode=block');

  return response;
}

export const config = {
  matcher: [
    /*
     * Intercepta todas as rotas exceto arquivos estáticos e _next
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp4)$).*)',
  ],
};
