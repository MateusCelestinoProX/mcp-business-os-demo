import { describe, it } from 'node:test';
import assert from 'node:assert';
import fs from 'fs';
import path from 'path';

describe('Server Fortification & Guardian Suite', () => {
  const rootDir = path.resolve(__dirname, '..');

  it('1. Arquivos essenciais de fortificação e boundaries devem existir', () => {
    const requiredFiles = [
      'src/app/api/health/route.ts',
      'src/app/error.tsx',
      'src/app/global-error.tsx',
      'src/instrumentation.ts',
      'scripts/server-guardian.js',
    ];

    for (const relPath of requiredFiles) {
      const fullPath = path.join(rootDir, relPath);
      assert.ok(fs.existsSync(fullPath), `Arquivo de blindagem ${relPath} DEVE existir`);
    }
  });

  it('2. GET /api/health deve responder 200 com payload estruturado de saúde', async () => {
    const res = await fetch('http://localhost:3000/api/health');
    assert.strictEqual(res.status, 200, 'Health endpoint deve retornar 200 OK');

    const data = await res.json();
    assert.strictEqual(data.status, 'healthy');
    assert.ok(typeof data.uptimeSeconds === 'number', 'uptimeSeconds deve ser número');
    assert.ok(typeof data.timestamp === 'string', 'timestamp deve ser string ISO');
    assert.ok(data.memory && typeof data.memory.rssMB === 'number', 'memory.rssMB deve estar presente');
  });

  it('3. HEAD /api/health deve responder 200 sem corpo para checagens ultra-rápidas', async () => {
    const res = await fetch('http://localhost:3000/api/health', { method: 'HEAD' });
    assert.strictEqual(res.status, 200, 'HEAD /api/health deve retornar status 200');
    assert.strictEqual(res.headers.get('x-server-health'), 'OK');
  });

  it('4. Boundary de Erro (src/app/error.tsx) deve conter botões de reset e recuperação', () => {
    const errorFile = fs.readFileSync(path.join(rootDir, 'src/app/error.tsx'), 'utf-8');
    assert.ok(errorFile.includes("'use client'"), 'error.tsx deve ser client component');
    assert.ok(errorFile.includes('reset()'), 'error.tsx deve permitir acionar reset()');
    assert.ok(errorFile.includes('Retornar ao Início') || errorFile.includes('Tentar Novamente'));
  });

  it('5. Global Error Boundary (src/app/global-error.tsx) deve encapsular html e body', () => {
    const globalErrorFile = fs.readFileSync(path.join(rootDir, 'src/app/global-error.tsx'), 'utf-8');
    assert.ok(globalErrorFile.includes('<html'), 'global-error.tsx deve fornecer a tag html');
    assert.ok(globalErrorFile.includes('<body'), 'global-error.tsx deve fornecer a tag body');
  });
});
