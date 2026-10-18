#!/usr/bin/env node

/**
 * =========================================================================
 * SERVER GUARDIAN & WATCHDOG DE ALTA DISPONIBILIDADE (FORTIFICADO)
 * =========================================================================
 * Plataforma Unificada Soberana - Mateus Celestino Pro X
 *
 * Funcionalidades:
 * 1. Resolução automática e graciosa de conflitos de porta (EADDRINUSE)
 * 2. Prevenção de corrupção: encerramento gracioso (SIGTERM antes de SIGKILL)
 * 3. Healthcheck tolerante a compilações pesadas (timeout de 20s, 5 tentativas)
 * 4. Auto-recuperação imediata em caso de arquivos .next corrompidos
 * 5. Imunidade a SIGHUP (fechamento de terminais pais)
 * =========================================================================
 */

const { spawn, execSync } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const ROOT_DIR = path.resolve(__dirname, '..');
const NEXT_CACHE_DIR = path.join(ROOT_DIR, '.next');
const LOG_FILE = path.join(ROOT_DIR, 'server.log');

let currentChild = null;
let isShuttingDown = false;
let isRestarting = false;
let isServerReady = false;
let restartCount = 0;
let lastRestartTime = Date.now();
let consecutiveHealthFailures = 0;

function log(msg, type = 'INFO') {
  const ts = new Date().toISOString().replace('T', ' ').substring(0, 19);
  const prefix = {
    INFO: '🛡️  [Guardian]',
    SUCCESS: '✅ [Guardian]',
    WARN: '⚠️  [Guardian]',
    ERROR: '🚨 [Guardian]',
  }[type] || '🛡️  [Guardian]';

  const line = `${prefix} [${ts}] ${msg}`;
  console.log(line);

  try {
    fs.appendFileSync(LOG_FILE, `[${ts}] [${type}] ${msg}\n`);
  } catch (err) {}
}

/**
 * Libera a porta de forma graciosa sem deixar sockets em estado inválido
 */
function freePort(port) {
  try {
    const output = execSync(`lsof -ti :${port}`, { encoding: 'utf-8' }).trim();
    if (output) {
      const pids = output.split('\n').map(p => p.trim()).filter(Boolean);
      log(`Detectado(s) processo(s) na porta ${port} (PIDs: ${pids.join(', ')}). Liberando graciosamente...`, 'WARN');
      for (const pid of pids) {
        if (pid !== String(process.pid)) {
          try {
            process.kill(Number(pid), 'SIGTERM');
          } catch (e) {}
        }
      }
      // Aguarda 1 segundo para liberação limpa
      execSync('sleep 1');

      // Verifica se algum processo ainda sobreviveu
      try {
        const remaining = execSync(`lsof -ti :${port}`, { encoding: 'utf-8' }).trim();
        if (remaining) {
          const remPids = remaining.split('\n').map(p => p.trim()).filter(Boolean);
          for (const pid of remPids) {
            if (pid !== String(process.pid)) {
              try { process.kill(Number(pid), 'SIGKILL'); } catch (e) {}
            }
          }
          execSync('sleep 0.5');
        }
      } catch (e) {}
      log(`Porta ${port} liberada com sucesso.`, 'SUCCESS');
    }
  } catch (error) {}
}

/**
 * Remove a pasta .next com segurança
 */
function cleanNextCache() {
  try {
    if (fs.existsSync(NEXT_CACHE_DIR)) {
      log('Limpando cache de compilação em .next/...', 'WARN');
      fs.rmSync(NEXT_CACHE_DIR, { recursive: true, force: true });
      log('Cache .next redefinido com sucesso.', 'SUCCESS');
    }
  } catch (err) {
    log(`Aviso ao limpar cache .next: ${err.message}`, 'WARN');
  }
}

/**
 * Reinicia o servidor com opção de limpeza de cache
 */
function restartServer(cleanCache = false) {
  if (isRestarting || isShuttingDown) return;
  isRestarting = true;
  isServerReady = false;

  log(`Iniciando ciclo de recuperação${cleanCache ? ' (com limpeza de cache)' : ''}...`, 'WARN');

  if (currentChild) {
    try {
      currentChild.kill('SIGTERM');
    } catch (e) {}
  }

  setTimeout(() => {
    if (currentChild) {
      try { currentChild.kill('SIGKILL'); } catch (e) {}
    }
    freePort(PORT);
    if (cleanCache) {
      cleanNextCache();
    }
    isRestarting = false;
    startNextServer();
  }, 1500);
}

/**
 * Inicia o processo Next.js com supervisão ativa
 */
function startNextServer() {
  if (isShuttingDown) return;

  freePort(PORT);

  log(`Iniciando servidor Next.js na porta ${PORT}...`, 'INFO');

  const nextBin = path.join(ROOT_DIR, 'node_modules', '.bin', 'next');
  const command = fs.existsSync(nextBin) ? nextBin : 'npx';
  const args = fs.existsSync(nextBin) ? ['dev', '-p', String(PORT)] : ['next', 'dev', '-p', String(PORT)];

  const child = spawn(command, args, {
    cwd: ROOT_DIR,
    env: {
      ...process.env,
      PORT: String(PORT),
      NODE_ENV: process.env.NODE_ENV || 'development',
    },
    stdio: ['inherit', 'pipe', 'pipe'],
  });

  currentChild = child;
  isServerReady = false;
  consecutiveHealthFailures = 0;

  child.stdout.on('data', (data) => {
    const text = data.toString();
    process.stdout.write(text);

    if (text.includes('Ready in') || text.includes('Local:')) {
      isServerReady = true;
      consecutiveHealthFailures = 0;
    }
  });

  child.stderr.on('data', (data) => {
    const text = data.toString();
    process.stderr.write(text);

    // Detecção autônoma de corrupção irrecuperável do Webpack / Next.js
    const isCorrupted =
      text.includes('routes-manifest.json') ||
      text.includes('vendor-chunks/next.js') ||
      text.includes('PageNotFoundError') ||
      text.includes('Cannot find module for page: /_document') ||
      (text.includes('MODULE_NOT_FOUND') && text.includes('webpack-runtime.js'));

    if (isCorrupted && !isShuttingDown && !isRestarting) {
      log('Detectada inconsistência estrutural no cache .next! Acionando autocura...', 'ERROR');
      restartServer(true);
    }
  });

  child.on('error', (err) => {
    log(`Erro fatal no processo filho: ${err.message}`, 'ERROR');
  });

  child.on('close', (code, signal) => {
    currentChild = null;
    isServerReady = false;
    if (isShuttingDown || isRestarting) return;

    log(`Servidor Next.js encerrou (code: ${code}, signal: ${signal || 'none'}).`, 'WARN');

    const now = Date.now();
    if (now - lastRestartTime < 15000) {
      restartCount++;
    } else {
      restartCount = 1;
    }
    lastRestartTime = now;

    if (restartCount > 4) {
      log('Crashes repetidos em curto intervalo. Aguardando 4s e limpando cache...', 'WARN');
      restartServer(true);
    } else {
      setTimeout(startNextServer, 1000);
    }
  });
}

/**
 * Healthcheck interno com alta tolerância a picos de compilação
 */
function performHealthCheck() {
  if (isShuttingDown || isRestarting || !currentChild || !isServerReady) return;

  // Timeout generoso de 15 segundos para dar tempo em compilações concorrentes
  const req = http.request(
    {
      hostname: '127.0.0.1',
      port: PORT,
      path: '/api/health',
      method: 'GET',
      timeout: 15000,
    },
    (res) => {
      if (res.statusCode >= 200 && res.statusCode < 400) {
        consecutiveHealthFailures = 0;
      } else {
        consecutiveHealthFailures++;
        log(`Healthcheck HTTP ${res.statusCode} (falhas consecutivas: ${consecutiveHealthFailures}/5)`, 'WARN');
        checkHealthThreshold();
      }
    }
  );

  req.on('error', (err) => {
    // Só contabiliza falha após o servidor estar rodando há mais de 20s
    if (Date.now() - lastRestartTime > 20000) {
      consecutiveHealthFailures++;
      log(`Healthcheck erro de conexão: ${err.message} (falhas: ${consecutiveHealthFailures}/5)`, 'WARN');
      checkHealthThreshold();
    }
  });

  req.on('timeout', () => {
    req.destroy();
    if (Date.now() - lastRestartTime > 20000) {
      consecutiveHealthFailures++;
      log(`Healthcheck timeout de 15s atingido (falhas: ${consecutiveHealthFailures}/5)`, 'WARN');
      checkHealthThreshold();
    }
  });

  req.end();
}

function checkHealthThreshold() {
  // Exige 5 falhas consecutivas antes de reiniciar (garante que não reinicie por lentidão temporária)
  if (consecutiveHealthFailures >= 5 && !isShuttingDown && !isRestarting) {
    log('Servidor persistentemente unresponsive após 5 tentativas de healthcheck. Reiniciando...', 'ERROR');
    consecutiveHealthFailures = 0;
    restartServer(true);
  }
}

// Checagem a cada 20 segundos
setInterval(performHealthCheck, 20000);

// Encerramento gracioso
function gracefulShutdown(signal) {
  log(`Recebido sinal ${signal}. Encerrando Guardian e servidor...`, 'INFO');
  isShuttingDown = true;

  if (currentChild) {
    try {
      currentChild.kill('SIGTERM');
      setTimeout(() => {
        try { currentChild.kill('SIGKILL'); } catch (e) {}
        freePort(PORT);
        process.exit(0);
      }, 2000);
    } catch (e) {
      freePort(PORT);
      process.exit(0);
    }
  } else {
    freePort(PORT);
    process.exit(0);
  }
}

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGHUP', () => {
  log('Recebido sinal SIGHUP. Mantendo Guardian e servidor ativos!', 'INFO');
});

// Inicialização principal
log('====================================================', 'INFO');
log('Iniciando Server Guardian Blindado (Auto-Cura Ativa)', 'SUCCESS');
log(`Porta de monitoramento: ${PORT}`, 'INFO');
log('====================================================', 'INFO');

startNextServer();
