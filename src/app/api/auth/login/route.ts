import { NextResponse } from 'next/server';
import { authenticateMember, authenticateAdmin } from '@/lib/auth/auth';

export async function POST(req: Request) {
  try {
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

    // 1. Tenta autenticar como Administrador primeiro
    const adminResult = await authenticateAdmin(cleanEmail, password);
    if (adminResult.success && adminResult.user) {
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

    // 2. Tenta autenticar como Membro da Comunidade
    const authResult = await authenticateMember(cleanEmail, password);
    if (authResult.success && authResult.member) {
      return NextResponse.json(
        {
          success: true,
          message: 'Autenticação de membro bem-sucedida!',
          user: {
            ...authResult.member,
            role: 'user',
          },
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
