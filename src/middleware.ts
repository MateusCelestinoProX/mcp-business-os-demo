import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth/jwt';

/**
 * ============================================================
 * MIDDLEWARE DE SEGURANÇA SOBERANA (NEXT.JS 15 APP ROUTER)
 * ============================================================
 * Validação de sessão server-side, rate limiting e cabeçalhos de segurança HTTP
 */

// Rotas de API restritas a administradores e moderadores
function isRestrictedAdminRoute(pathname: string, method?: string, searchParams?: URLSearchParams): boolean {
  if (pathname.startsWith('/api/members')) return true;
  if (pathname.startsWith('/api/finance')) return true;
  if (pathname.startsWith('/api/leads') && method === 'GET') return true;
  if (pathname.startsWith('/api/articles') && method && method !== 'GET') return true;
  if (pathname.startsWith('/api/admin/libraries')) return true;
  if (pathname.startsWith('/api/admin/shop-resources') && method && method !== 'GET') return true;
  if (pathname.startsWith('/api/storage/imagekit')) {
    if (method && method !== 'GET') return true;
    const action = searchParams?.get('action');
    if (action === 'list' || action === 'auth') return true;
  }
  return false;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const method = request.method;

  // 1. Sanitização: remove cabeçalhos de identidade forjados pelo cliente
  const requestHeaders = new Headers(request.headers);
  requestHeaders.delete('x-user-id');
  requestHeaders.delete('x-user-email');
  requestHeaders.delete('x-user-role');

  // 2. Extração segura de token (Cookie HTTP-Only prioritário ou Authorization Bearer)
  let token = request.cookies.get('mcp_session_token')?.value;
  const authHeader = request.headers.get('authorization');
  if (!token && authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7).trim();
  }

  let session = null;
  if (token) {
    session = await verifyToken(token);
    if (session) {
      requestHeaders.set('x-user-id', session.userId);
      requestHeaders.set('x-user-email', session.email);
      requestHeaders.set('x-user-role', session.role);
    }
  }

  const isAllowed = Boolean(
    session && (
      session.role === 'admin' ||
      (session as any).role === 'moder' ||
      (session as any).role === 'moderator'
    )
  );

  // 3. Blindagem de Páginas Administrativas (/admin, /admin/shop, /admin/library-control)
  if (pathname.startsWith('/admin')) {
    if (session && !isAllowed) {
      const forbiddenUrl = new URL('/comunidade', request.url);
      forbiddenUrl.searchParams.set('error', 'acesso_negado');
      return NextResponse.redirect(forbiddenUrl);
    }

    const isSubAdminPage = pathname !== '/admin' && pathname !== '/admin/';
    if (!session && isSubAdminPage) {
      const loginUrl = new URL('/comunidade/login', request.url);
      loginUrl.searchParams.set('redirectUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 4. Proteção de endpoints de API administrativos restritos
  if (isRestrictedAdminRoute(pathname, method, request.nextUrl.searchParams)) {
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Acesso restrito. Autenticação de administrador necessária.' },
        { status: 401 }
      );
    }

    if (!isAllowed) {
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

  // 5. Cabeçalhos de Segurança HTTP (OWASP Recommended)
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');

  return response;
}

export const config = {
  matcher: [
    '/api/:path*',
    '/admin',
    '/admin/:path*',
  ],
};
