import { NextResponse } from 'next/server';
import { authenticateMember, authenticateAdmin } from '@/lib/auth/auth';
import { checkRateLimit, resetRateLimit } from '@/lib/auth/rate-limit';
import { getClientIp } from '@/lib/security/request-ip';
import { hashDigestHex } from '@/lib/security/sanitize';
import { isTrustedOrigin } from '@/lib/security/url-guard';
import { NO_STORE_HEADERS } from '@/lib/auth/admin-guard';

export async function POST(req: Request) {
  try {
    // 0. Validação de CSRF quando o header Origin estiver presente
    const origin = req.headers.get('origin');
    if (origin && !isTrustedOrigin(origin)) {
      return NextResponse.json(
        { success: false, error: 'Origem não autorizada (violação de política CSRF).' },
        { status: 403, headers: NO_STORE_HEADERS }
      );
    }

    // 1. Rate Limiting estrito e segregado por IP + e-mail
    const ip = getClientIp(req);
    const limit = process.env.NODE_ENV === 'production' ? 10 : 100;
    const globalLimit = process.env.NODE_ENV === 'production' ? 25 : 200;

    const globalCheck = checkRateLimit(`login_global_${ip}`, globalLimit, 15 * 60 * 1000);
    if (!globalCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: `Muitas tentativas de login consecutivas. Aguarde ${globalCheck.resetInSeconds} segundos antes de tentar novamente.`,
        },
        {
          status: 429,
          headers: {
            ...NO_STORE_HEADERS,
            'Retry-After': String(globalCheck.resetInSeconds),
          },
        }
      );
    }

    const body = await req.json().catch(() => ({}));
    const { email, password } = body;

    if (!email || typeof email !== 'string' || email.length > 254 || !email.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'Forneça um e-mail válido.' },
        { status: 400, headers: NO_STORE_HEADERS }
      );
    }

    if (!password || typeof password !== 'string' || password.length > 128) {
      return NextResponse.json(
        { success: false, error: 'A senha é obrigatória.' },
        { status: 400, headers: NO_STORE_HEADERS }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const emailHash = hashDigestHex(cleanEmail).slice(0, 16);
    const accountKey = `login_acct_${ip}_${emailHash}`;
    const emailKey = `login_email_${emailHash}`;

    // Checagem rate limit por e-mail (previne ataque distribuído contra uma única conta)
    const emailCheck = checkRateLimit(emailKey, limit, 15 * 60 * 1000);
    if (!emailCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: `Muitas tentativas para esta conta. Aguarde ${emailCheck.resetInSeconds} segundos antes de tentar novamente.`,
        },
        {
          status: 429,
          headers: {
            ...NO_STORE_HEADERS,
            'Retry-After': String(emailCheck.resetInSeconds),
          },
        }
      );
    }

    const accountCheck = checkRateLimit(accountKey, limit, 15 * 60 * 1000);
    if (!accountCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: `Muitas tentativas para esta conta a partir do seu IP. Aguarde ${accountCheck.resetInSeconds} segundos antes de tentar novamente.`,
        },
        {
          status: 429,
          headers: {
            ...NO_STORE_HEADERS,
            'Retry-After': String(accountCheck.resetInSeconds),
          },
        }
      );
    }

    // 2. Tenta autenticar como Administrador primeiro
    const adminResult = await authenticateAdmin(cleanEmail, password);
    if (adminResult.success && adminResult.user) {
      resetRateLimit(accountKey);
      resetRateLimit(emailKey);
      const role = adminResult.user.role === 'admin' ? 'admin' : 'moder';
      return NextResponse.json(
        {
          success: true,
          message: 'Autenticação de administrador bem-sucedida!',
          user: {
            ...adminResult.user,
            role,
            tier: 'max',
          },
          role,
          token: adminResult.token,
          redirectUrl: '/admin',
        },
        { status: 200, headers: NO_STORE_HEADERS }
      );
    }

    // 3. Tenta autenticar como Membro da Comunidade
    const authResult = await authenticateMember(cleanEmail, password);
    if (authResult.success && authResult.member) {
      resetRateLimit(accountKey);
      resetRateLimit(emailKey);
      return NextResponse.json(
        {
          success: true,
          message: 'Autenticação de membro bem-sucedida!',
          user: {
            ...authResult.member,
            role: 'user',
          },
          member: authResult.member,
          role: 'user',
          token: authResult.token,
          redirectUrl: '/comunidade',
        },
        { status: 200, headers: NO_STORE_HEADERS }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Credenciais inválidas. Verifique seu e-mail e senha de acesso.',
      },
      { status: 401, headers: NO_STORE_HEADERS }
    );
  } catch (error: any) {
    console.error('❌ [Login] Erro interno:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao processar login. Verifique os dados fornecidos.' },
      { status: 500, headers: NO_STORE_HEADERS }
    );
  }
}
