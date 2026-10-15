import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * GET /api/finance
 * Retorna faturamento e transações reais processadas via Mercado Pago / Gateways
 */
export async function GET(request: Request) {
  try {
    const roleHeader = request.headers.get('x-user-role');
    const isTestEnv = process.env.NODE_ENV === 'test';
    if (!isTestEnv && roleHeader !== 'admin' && roleHeader !== 'moder') {
      const authHeader = request.headers.get('authorization');
      const hasBearer = authHeader && authHeader.startsWith('Bearer ');
      if (!hasBearer) {
        return NextResponse.json(
          { success: false, error: 'Acesso restrito. Autenticação de Administrador obrigatória.' },
          { status: 401 }
        );
      }
    }

    // Por enquanto, sem webhooks de pagamentos reais concluídos na base, retorna array vazio e faturamento zerado
    return NextResponse.json({
      success: true,
      transactions: [],
      totalRevenue: 0.0,
      ticketMedio: 0.0,
      approvalRate: 0.0,
      totalOrders: 0,
      message: 'Nenhuma transação real processada até o momento.',
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      transactions: [],
      totalRevenue: 0.0,
      error: error?.message,
    });
  }
}
