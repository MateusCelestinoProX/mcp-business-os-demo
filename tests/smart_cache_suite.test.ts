import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { MemoryCache, memoryCache } from '../src/lib/cache/memory-cache';

describe('🚀 Suíte Soberana de Cache Inteligente & Performance Máxima (Next.js 15 & Hubs)', () => {

  describe('1. Motor de Cache em Memória (MemoryCache LRU & TTL)', () => {
    test('1.1 Deve armazenar e recuperar dados respeitando o TTL', async () => {
      const cache = new MemoryCache({ maxSize: 10, defaultTtlSeconds: 1 });
      cache.set('chave_teste', { valor: 42 });

      const recuperado = cache.get<{ valor: number }>('chave_teste');
      assert.ok(recuperado, 'Item deve existir no cache');
      assert.equal(recuperado.valor, 42);

      // Chave inexistente deve retornar null e contabilizar miss
      const inexistente = cache.get('chave_inexistente');
      assert.equal(inexistente, null);
    });

    test('1.2 getOrSet deve reaproveitar dados em memória sem reexecutar fetcher', async () => {
      const cache = new MemoryCache();
      let fetchCount = 0;
      const fetcher = async () => {
        fetchCount++;
        return { nome: 'Mateus Celestino Pro' };
      };

      const res1 = await cache.getOrSet('perfil', fetcher, 60);
      assert.equal(res1.source, 'fresh_fetch');
      assert.equal(res1.data.nome, 'Mateus Celestino Pro');
      assert.equal(fetchCount, 1);

      const res2 = await cache.getOrSet('perfil', fetcher, 60);
      assert.equal(res2.source, 'memory_cache');
      assert.equal(res2.data.nome, 'Mateus Celestino Pro');
      assert.equal(fetchCount, 1, 'Fetcher não deve ser chamado na 2ª vez');
    });

    test('1.3 Deve invalidar chaves por padrão e prefixo (Purge seletivo)', () => {
      const cache = new MemoryCache();
      cache.set('shop:cat1', 'v1');
      cache.set('shop:cat2', 'v2');
      cache.set('articles:post1', 'v3');

      const purgados = cache.invalidatePattern('shop:');
      assert.equal(purgados, 2);
      assert.equal(cache.get('shop:cat1'), null);
      assert.equal(cache.get('shop:cat2'), null);
      assert.equal(cache.get('articles:post1'), 'v3', 'Chave de outro prefixo deve ser preservada');
    });

    test('1.4 Deve respeitar política de evicção LRU quando a capacidade máxima for atingida', () => {
      const smallCache = new MemoryCache({ maxSize: 3, defaultTtlSeconds: 60 });
      smallCache.set('k1', 'val1');
      smallCache.set('k2', 'val2');
      smallCache.set('k3', 'val3');

      // Acessa k1 para torná-lo mais recente que k2
      smallCache.get('k1');

      // Insere o 4º item, forçando a evicção de k2 (o menos recentemente utilizado)
      smallCache.set('k4', 'val4');

      assert.equal(smallCache.get('k2'), null, 'k2 deve ter sido evictado pela política LRU');
      assert.ok(smallCache.get('k1'), 'k1 deve persistir no cache');
      assert.ok(smallCache.get('k4'), 'k4 deve persistir no cache');
    });

    test('1.5 Telemetria getStats deve calcular taxa de acerto (Hit Ratio) com exatidão', () => {
      const cache = new MemoryCache();
      cache.set('hit_key', 'ok');

      cache.get('hit_key'); // 1 hit
      cache.get('miss_key'); // 1 miss

      const stats = cache.getStats();
      assert.equal(stats.hits, 1);
      assert.equal(stats.misses, 1);
      assert.equal(stats.hitRatio, 0.5);
    });
  });

  describe('2. Configuração de Cache no next.config.ts', () => {
    const configPath = path.resolve(__dirname, '../next.config.ts');
    const content = fs.readFileSync(configPath, 'utf8');

    test('2.1 Deve possuir minimumCacheTTL de 1 ano para imagens', () => {
      assert.match(content, /minimumCacheTTL:\s*31536000/, 'minimumCacheTTL deve ser de 31536000 segundos');
    });

    test('2.2 Deve conter otimização de imports de pacotes (optimizePackageImports)', () => {
      assert.match(content, /optimizePackageImports:/, 'Deve otimizar imports de pacotes');
      assert.match(content, /lucide-react/, 'Deve otimizar imports de lucide-react');
      assert.match(content, /three/, 'Deve otimizar imports de three');
    });

    test('2.3 Deve conter compressão ativa e poweredByHeader desativado', () => {
      assert.match(content, /compress:\s*true/, 'compress deve ser true');
      assert.match(content, /poweredByHeader:\s*false/, 'poweredByHeader deve ser false');
    });

    test('2.4 Deve definir cabeçalhos Cache-Control com max-age longo e immutable para assets estáticos', () => {
      assert.match(content, /Cache-Control/, 'Deve conter regras de Cache-Control');
      assert.match(content, /max-age=31536000,\s*immutable/, 'Deve definir cache imutável de 1 ano para assets');
      assert.match(content, /X-DNS-Prefetch-Control/, 'Deve conter prefetch de DNS');
    });

    test('2.5 Deve garantir revalidação imediata do Service Worker /sw.js', () => {
      assert.match(content, /\/sw\.js/, 'Deve configurar headers específicos para sw.js');
      assert.match(content, /max-age=0,\s*must-revalidate/, 'Service Worker deve revalidar imediatamente');
    });
  });

  describe('3. Service Worker Soberano & PWA Cache (public/sw.js)', () => {
    const swPath = path.resolve(__dirname, '../public/sw.js');

    test('3.1 O arquivo public/sw.js deve existir e conter versão definida', () => {
      assert.ok(fs.existsSync(swPath), 'public/sw.js deve existir');
      const swCode = fs.readFileSync(swPath, 'utf8');
      assert.match(swCode, /CACHE_VERSION/, 'Deve possuir versão de cache');
      assert.match(swCode, /mcp-static-/, 'Deve possuir cache de estáticos');
      assert.match(swCode, /mcp-pages-/, 'Deve possuir cache de páginas');
    });

    test('3.2 Deve implementar estratégias Cache-First e Stale-While-Revalidate', () => {
      const swCode = fs.readFileSync(swPath, 'utf8');
      assert.match(swCode, /caches\.match\(request\)/, 'Deve interceptar requisições no cache');
      assert.match(swCode, /skipWaiting\(\)/, 'Deve ativar imediatamente novas versões');
      assert.match(swCode, /clients\.claim\(\)/, 'Deve assumir controle de clientes abertos');
    });

    test('3.3 Deve proteger e fazer bypass de rotas administrativas e financeiras', () => {
      const swCode = fs.readFileSync(swPath, 'utf8');
      assert.match(swCode, /\/admin/, 'Deve fazer bypass de rotas de admin');
      assert.match(swCode, /\/api\/checkout/, 'Deve fazer bypass de checkout');
      assert.match(swCode, /\/api\/auth/, 'Deve fazer bypass de autenticação');
    });
  });

  describe('4. Speculation Rules API & Smart Navigation Prefetcher', () => {
    const enginePath = path.resolve(__dirname, '../src/components/cache/SmartCacheEngine.tsx');
    const layoutPath = path.resolve(__dirname, '../src/app/layout.tsx');

    test('4.1 SmartCacheEngine deve injetar Speculation Rules com eagerness moderate', () => {
      assert.ok(fs.existsSync(enginePath), 'SmartCacheEngine.tsx deve existir');
      const engineCode = fs.readFileSync(enginePath, 'utf8');
      assert.match(engineCode, /speculationrules/, 'Deve conter script speculationrules');
      assert.match(engineCode, /prerender/, 'Deve configurar prerender');
      assert.match(engineCode, /eagerness:\s*['"]moderate['"]/, 'Eagerness deve ser moderate para 0ms latency');
    });

    test('4.2 RootLayout deve renderizar SmartCacheEngine e preconnects de alta performance', () => {
      const layoutCode = fs.readFileSync(layoutPath, 'utf8');
      assert.match(layoutCode, /SmartCacheEngine/, 'RootLayout deve incluir SmartCacheEngine');
      assert.match(layoutCode, /rel="preconnect"\s+href="https:\/\/ik\.imagekit\.io"/, 'Deve ter preconnect ImageKit');
      assert.match(layoutCode, /rel="dns-prefetch"\s+href="https:\/\/ik\.imagekit\.io"/, 'Deve ter dns-prefetch ImageKit');
    });
  });

  describe('5. Integração com Hubs Soberanos (Biblioteca, Comunidade, Showcase)', () => {
    test('5.1 Biblioteca deve registrar o Service Worker e possuir Speculation Rules', () => {
      const bibPath = path.resolve(__dirname, '../public/biblioteca/index.html');
      const html = fs.readFileSync(bibPath, 'utf8');
      assert.match(html, /navigator\.serviceWorker\.register\('\/sw\.js'/, 'Deve registrar sw.js');
      assert.match(html, /speculationrules/, 'Deve ter speculation rules');
    });

    test('5.2 Comunidade VIP deve registrar o Service Worker e possuir Speculation Rules', () => {
      const comPath = path.resolve(__dirname, '../public/comunidade/index.html');
      const html = fs.readFileSync(comPath, 'utf8');
      assert.match(html, /navigator\.serviceWorker\.register\('\/sw\.js'/, 'Deve registrar sw.js');
      assert.match(html, /speculationrules/, 'Deve ter speculation rules');
    });

    test('5.3 Showcase deve registrar o Service Worker e possuir Speculation Rules', () => {
      const shwPath = path.resolve(__dirname, '../public/showcase/index.html');
      const html = fs.readFileSync(shwPath, 'utf8');
      assert.match(html, /navigator\.serviceWorker\.register\('\/sw\.js'/, 'Deve registrar sw.js');
      assert.match(html, /speculationrules/, 'Deve ter speculation rules');
    });
  });

  describe('6. Rotas de API e Cabeçalhos de Cache HTTP', () => {
    test('6.1 /api/admin/shop-resources deve usar memoryCache e cabeçalho Cache-Control', () => {
      const routePath = path.resolve(__dirname, '../src/app/api/admin/shop-resources/route.ts');
      const code = fs.readFileSync(routePath, 'utf8');
      assert.match(code, /memoryCache/, 'Deve importar e usar memoryCache');
      assert.match(code, /Cache-Control/, 'Deve retornar cabeçalho Cache-Control');
      assert.match(code, /stale-while-revalidate/, 'Deve implementar stale-while-revalidate');
      assert.match(code, /memoryCache\.invalidatePattern\('shop:'\)/, 'Deve invalidar cache no salvamento');
    });

    test('6.2 /api/articles deve usar memoryCache e cabeçalho Cache-Control', () => {
      const routePath = path.resolve(__dirname, '../src/app/api/articles/route.ts');
      const code = fs.readFileSync(routePath, 'utf8');
      assert.match(code, /memoryCache/, 'Deve importar e usar memoryCache');
      assert.match(code, /Cache-Control/, 'Deve retornar cabeçalho Cache-Control');
      assert.match(code, /memoryCache\.invalidatePattern\('articles:'\)/, 'Deve invalidar cache em mutações');
    });

    test('6.3 /api/library deve usar memoryCache e cabeçalho Cache-Control', () => {
      const routePath = path.resolve(__dirname, '../src/app/api/library/route.ts');
      const code = fs.readFileSync(routePath, 'utf8');
      assert.match(code, /memoryCache/, 'Deve importar e usar memoryCache');
      assert.match(code, /Cache-Control/, 'Deve retornar cabeçalho Cache-Control');
    });

    test('6.4 /api/cache/status deve existir com endpoint de telemetria e purge', () => {
      const statusRoute = path.resolve(__dirname, '../src/app/api/cache/status/route.ts');
      assert.ok(fs.existsSync(statusRoute), '/api/cache/status/route.ts deve existir');
      const code = fs.readFileSync(statusRoute, 'utf8');
      assert.match(code, /GET/, 'Deve exportar método GET para status');
      assert.match(code, /POST/, 'Deve exportar método POST para expurgo (purge)');
      assert.match(code, /verifyAdminRequest/, 'Deve proteger método POST com guard de administrador');
    });
  });
});
