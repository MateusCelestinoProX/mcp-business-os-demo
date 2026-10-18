/**
 * ============================================================
 * INSTRUMENTATION & FORTIFICAÇÃO DE PROCESSO NODE.JS
 * ============================================================
 * Registra listeners globais para blindar o servidor interno
 * contra quedas por unhandledRejection e uncaughtException.
 */

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // 1. Blindagem contra Rejeições de Promises não tratadas
    process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
      const errorMsg = reason?.message || String(reason);
      const isNoise =
        errorMsg.includes('ECONNRESET') ||
        errorMsg.includes('EPIPE') ||
        errorMsg.includes('aborted');

      if (!isNoise) {
        console.error('🛡️ [Server Guardian] unhandledRejection interceptada (servidor mantido vivo):', {
          reason: reason?.stack || reason,
          time: new Date().toISOString(),
        });
      }
    });

    // 2. Blindagem contra Exceções não capturadas
    process.on('uncaughtException', (error: Error, origin: string) => {
      console.error('🛡️ [Server Guardian] uncaughtException interceptada em:', origin, {
        message: error?.message,
        stack: error?.stack,
        time: new Date().toISOString(),
      });
      // Mantém o servidor rodando para requisições de outros clientes
    });

    // 3. Log de inicialização protegida
    console.log('✅ [Server Guardian] Blindagem de processos Node.js e captura global de exceções ativada.');
  }
}
