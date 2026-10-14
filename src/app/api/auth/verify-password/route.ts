import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const { password } = await req.json();
    const serverPassword = process.env.ADMIN_PASSWORD || 'MCP_SuperSecure_Admin_2026!#LiquidGlass';

    if (!password || typeof password !== 'string') {
      return NextResponse.json({ success: false, error: 'Senha é obrigatória.' }, { status: 400 });
    }

    // Timing-safe buffer comparison to prevent timing attacks
    const a = Buffer.from(password);
    const b = Buffer.from(serverPassword);

    let isMatch = false;
    if (a.length === b.length) {
      isMatch = crypto.timingSafeEqual(a, b);
    }

    if (isMatch) {
      const adminToken = crypto.randomBytes(32).toString('hex');
      return NextResponse.json({ 
        success: true, 
        token: adminToken,
        message: 'Autenticação de Administrador concluída com sucesso.' 
      });
    }

    return NextResponse.json({ 
      success: false, 
      error: 'Senha de administrador incorreta. Tente novamente.' 
    }, { status: 401 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
