import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth/jwt';

/**
 * ============================================================
 * MIDDLEWARE DE SEGURANÇA SOBERANA (NEXT.JS 15 APP ROUTER)
 * ============================================================
 * Bunker criptográfico na borda (Edge Runtime):
 * - Isolamento total de /admin e /admin/* para contas com role === 'admin'
 * - Redirecionamento forçado de não autenticados para /comunidade/login
 * - Redirecionamento de não-admins autenticados para /comunidade?error=acesso_negado
 * - Blindagem de endpoints administrativos /api/admin/*
 * - Prevenção contra spoofing de cabeçalhos de identidade
 * - Cabeçalhos anti-clickjacking (X-Frame-Options: DENY) e no-store
 */

function isRestrictedAdminRoute(pathname: string, method?: string, searchParams?: URLSearchParams): boolean {
  if (pathname === '/api/admin' || pathname.startsWith('/api/admin/')) return true;
  if (pathname.startsWith('/api/members')) return true;
  if (pathname.startsWith('/api/finance')) return true;
  if (pathname.startsWith('/api/send-email') && method && method !== 'OPTIONS') return true;
  if (pathname.startsWith('/api/leads') && method === 'GET') return true;
  if (pathname.startsWith('/api/articles') && method && method !== 'GET') return true;
  if (pathname.startsWith('/api/cache/status') && method && method !== 'GET') return true;
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

  // 1. Sanitização de borda: remove cabeçalhos de identidade forjados pelo cliente
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

  const session = token ? await verifyToken(token) : null;
  const isStrictAdmin = session?.role === 'admin';
  const isAdminOrModer = Boolean(
    session &&
      (session.role === 'admin' ||
        (session.role as string) === 'moder' ||
        (session.role as string) === 'moderator')
  );

  // 3. Blindagem Absoluta do Bunker /admin e subpáginas (/admin, /admin/*)
  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    // Se não há sessão autenticada, redireciona imediatamente para login com redirectUrl
    if (!session) {
      const loginUrl = new URL('/comunidade/login', request.url);
      loginUrl.searchParams.set('redirectUrl', pathname);
      const redirectRes = NextResponse.redirect(loginUrl);
      redirectRes.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
      redirectRes.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
      return redirectRes;
    }

    // Se autenticado mas NÃO é administrador de nível 'admin', bloqueia acesso
    if (!isStrictAdmin) {
      const forbiddenUrl = new URL('/comunidade', request.url);
      forbiddenUrl.searchParams.set('error', 'acesso_negado');
      const redirectRes = NextResponse.redirect(forbiddenUrl);
      redirectRes.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
      redirectRes.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
      return redirectRes;
    }
  }

  // 4. Proteção de endpoints de API administrativos restritos
  if (isRestrictedAdminRoute(pathname, method, request.nextUrl.searchParams)) {
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Acesso restrito. Autenticação de administrador necessária.' },
        {
          status: 401,
          headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate, private',
            'X-Robots-Tag': 'noindex, nofollow, noarchive',
          },
        }
      );
    }

    // Rotas em /api/admin/* são estritamente para admin
    const requiresStrictAdmin = pathname === '/api/admin' || pathname.startsWith('/api/admin/');
    const hasRoutePermission = requiresStrictAdmin ? isStrictAdmin : isAdminOrModer;

    if (!hasRoutePermission) {
      return NextResponse.json(
        { success: false, error: 'Acesso negado. Privilégios insuficientes.' },
        {
          status: 403,
          headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate, private',
            'X-Robots-Tag': 'noindex, nofollow, noarchive',
          },
        }
      );
    }
  }

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  // 5. Cabeçalhos de Segurança HTTP (OWASP & Borda Soberana)
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  // Para rotas administrativas, aplicar proteção máxima anti-frame e no-store
  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('Content-Security-Policy', "frame-ancestors 'none'");
    response.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
  } else {
    response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  }

  // Prevenir cache em todas as rotas dinâmicas de API de autenticação ou admin
  if (pathname.startsWith('/api/admin') || pathname.startsWith('/api/auth')) {
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    response.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
  }

  return response;
}

export const config = {
  matcher: [
    '/api/:path*',
    '/admin',
    '/admin/:path*',
  ],
};
