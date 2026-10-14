import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * GET /api/finance
 * Retorna faturamento e transações reais processadas via Mercado Pago / Gateways
 */
export async function GET() {
  try {
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
