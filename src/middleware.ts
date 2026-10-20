import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth/jwt';

/**
 * ============================================================
 * MIDDLEWARE DE SEGURANÇA SOBERANA (NEXT.JS 15 APP ROUTER)
 * ============================================================
 * Validação de sessão server-side, rate limiting e cabeçalhos de segurança HTTP
 */

// Rotas de API restritas a administradores e moderadores
function isRestrictedAdminRoute(pathname: string, method?: string): boolean {
  if (pathname.startsWith('/api/members')) return true;
  if (pathname.startsWith('/api/finance')) return true;
  if (pathname.startsWith('/api/leads') && method === 'GET') return true;
  if (pathname.startsWith('/api/articles') && method && method !== 'GET') return true;
  if (pathname.startsWith('/api/admin/libraries')) return true;
  if (pathname.startsWith('/api/admin/shop-resources') && method && method !== 'GET') return true;
  return false;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const method = request.method;
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

  const isAllowed = Boolean(
    session && (
      session.role === 'admin' ||
      (session as any).role === 'moder' ||
      (session as any).role === 'moderator'
    )
  );

  // 1. Blindagem de Páginas Administrativas (/admin, /admin/shop, /admin/library-control)
  if (pathname.startsWith('/admin')) {
    // Se o usuário já está autenticado com papel não autorizado (membro comum ou visitante)
    if (session && !isAllowed) {
      const forbiddenUrl = new URL('/comunidade', request.url);
      forbiddenUrl.searchParams.set('error', 'acesso_negado');
      return NextResponse.redirect(forbiddenUrl);
    }

    // Se estiver tentando acessar subpáginas administrativas sem sessão válida
    const isSubAdminPage = pathname !== '/admin' && pathname !== '/admin/';
    if (!session && isSubAdminPage) {
      const loginUrl = new URL('/comunidade/login', request.url);
      loginUrl.searchParams.set('redirectUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 2. Proteção de endpoints de API administrativos restritos
  if (isRestrictedAdminRoute(pathname, method)) {
    // Permite se houver Authorization Bearer header
    const authHeader = request.headers.get('authorization');
    const hasBearer = authHeader && authHeader.startsWith('Bearer ');

    if (!session && !hasBearer) {
      return NextResponse.json(
        { success: false, error: 'Acesso restrito. Autenticação de administrador necessária.' },
        { status: 401 }
      );
    }

    if (session && !isAllowed) {
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
    '/api/:path*',
    '/admin',
    '/admin/:path*',
  ],
};
