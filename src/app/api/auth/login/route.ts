import { NextResponse } from 'next/server';
import { authenticateMember } from '@/lib/auth/auth';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { email, password } = body;

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'Forneça um e-mail de membro válido.' },
        { status: 400 }
      );
    }

    if (!password || typeof password !== 'string') {
      return NextResponse.json(
        { success: false, error: 'A senha é obrigatória.' },
        { status: 400 }
      );
    }

    const authResult = await authenticateMember(email, password);

    if (!authResult.success || !authResult.member) {
      return NextResponse.json(
        {
          success: false,
          error: authResult.error || 'Credenciais inválidas. Verifique seu e-mail e senha.',
        },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Autenticação bem-sucedida!',
        member: authResult.member,
        token: authResult.token,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('❌ [Login] Erro interno:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao processar login: ' + (error?.message || 'Inesperado') },
      { status: 500 }
    );
  }
}
