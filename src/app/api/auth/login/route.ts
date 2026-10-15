import { NextResponse } from 'next/server';
import { authenticateMember, authenticateAdmin } from '@/lib/auth/auth';
import { checkRateLimit, resetRateLimit } from '@/lib/auth/rate-limit';

export async function POST(req: Request) {
  try {
    // 1. Proteção de Rate Limiting por IP
    const forwarded = req.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : '127.0.0.1';
    const limit = process.env.NODE_ENV === 'production' ? 10 : 100;
    const rateCheck = checkRateLimit(`login_${ip}`, limit, 15 * 60 * 1000);

    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: `Muitas tentativas de login consecutivas. Aguarde ${rateCheck.resetInSeconds} segundos antes de tentar novamente.`,
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(rateCheck.resetInSeconds),
          },
        }
      );
    }

    const body = await req.json().catch(() => ({}));
    const { email, password } = body;

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'Forneça um e-mail válido.' },
        { status: 400 }
      );
    }

    if (!password || typeof password !== 'string') {
      return NextResponse.json(
        { success: false, error: 'A senha é obrigatória.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // 2. Tenta autenticar como Administrador primeiro
    const adminResult = await authenticateAdmin(cleanEmail, password);
    if (adminResult.success && adminResult.user) {
      resetRateLimit(`login_${ip}`);
      return NextResponse.json(
        {
          success: true,
          message: 'Autenticação de administrador bem-sucedida!',
          user: {
            ...adminResult.user,
            role: 'admin',
            tier: 'max',
          },
          role: 'admin',
          token: adminResult.token,
          redirectUrl: '/admin',
        },
        { status: 200 }
      );
    }

    // 3. Tenta autenticar como Membro da Comunidade
    const authResult = await authenticateMember(cleanEmail, password);
    if (authResult.success && authResult.member) {
      resetRateLimit(`login_${ip}`);
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
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Credenciais inválidas. Verifique seu e-mail e senha de acesso.',
      },
      { status: 401 }
    );
  } catch (error: any) {
    console.error('❌ [Login] Erro interno:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao processar login: ' + (error?.message || 'Inesperado') },
      { status: 500 }
    );
  }
}
