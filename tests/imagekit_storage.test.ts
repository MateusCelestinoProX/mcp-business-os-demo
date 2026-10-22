import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  isImageKitConfigured,
  getImageKitAuthParams,
  getCanonicalImageKitFolder,
  getOptimizedMediaUrl,
  uploadToImageKit,
  deleteFromImageKit,
  IMAGEKIT_URL_ENDPOINT,
} from '../src/lib/storage/imagekit';

describe('ImageKit Sovereign Storage Test Suite', () => {
  it('Deve verificar configuração do ImageKit a partir das variáveis de ambiente', () => {
    const configured = isImageKitConfigured();
    assert.strictEqual(typeof configured, 'boolean');
    assert.strictEqual(IMAGEKIT_URL_ENDPOINT, 'https://ik.imagekit.io/lojoakxmk');
  });

  it('Deve gerar parâmetros de autenticação válidos com assinatura HMAC-SHA1', () => {
    process.env.IMAGEKIT_PRIVATE_KEY = process.env.IMAGEKIT_PRIVATE_KEY || 'test_private_key_secure_audit';
    const auth = getImageKitAuthParams(1800);
    assert.ok(auth.token, 'Token deve existir');
    assert.ok(auth.signature, 'Assinatura deve existir');
    assert.strictEqual(typeof auth.signature, 'string');
    assert.strictEqual(auth.signature.length, 40); // SHA-1 hex tem 40 caracteres
    assert.ok(auth.expire > Math.floor(Date.now() / 1000), 'Expire deve ser futuro');
    assert.strictEqual(auth.urlEndpoint, 'https://ik.imagekit.io/lojoakxmk');
  });

  it('Deve classificar as pastas canônicas corretamente para imagens, vídeos e PDFs', () => {
    assert.strictEqual(getCanonicalImageKitFolder('manual.pdf'), '/soberana/pdfs');
    assert.strictEqual(getCanonicalImageKitFolder('foto.png'), '/soberana/images');
    assert.strictEqual(getCanonicalImageKitFolder('foto.webp'), '/soberana/images');
    assert.strictEqual(getCanonicalImageKitFolder('video.mp4'), '/soberana/videos');
    assert.strictEqual(getCanonicalImageKitFolder('video.mov'), '/soberana/videos');
    assert.strictEqual(getCanonicalImageKitFolder('documento.txt'), '/soberana/library');
  });

  it('Deve formatar URLs otimizadas com transformações CDN', () => {
    const optimized = getOptimizedMediaUrl('soberana/images/banner.png', {
      width: 800,
      format: 'webp',
      quality: 85,
    });
    assert.strictEqual(
      optimized,
      'https://ik.imagekit.io/lojoakxmk/soberana/images/banner.png?tr=w-800,q-85,f-webp'
    );
  });

  it('Deve realizar upload e exclusão reais de arquivo de teste na CDN se credenciais forem fornecidas', async (t) => {
    if (!isImageKitConfigured() || !process.env.IMAGEKIT_PRIVATE_KEY?.startsWith('private_')) {
      t.skip('Credenciais ativas do ImageKit não configuradas em .env.local para teste de rede real');
      return;
    }

    // 1x1 pixel PNG
    const pixelBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
    const buffer = Buffer.from(pixelBase64, 'base64');

    const uploadRes = await uploadToImageKit({
      file: buffer,
      fileName: 'automated_test_pixel.png',
      folder: '/soberana/tests',
      tags: ['test-suite', 'automated'],
      useUniqueFileName: true,
    });

    assert.ok(uploadRes.fileId, 'Upload deve retornar fileId');
    assert.ok(uploadRes.url.startsWith('https://ik.imagekit.io/lojoakxmk/'), 'URL deve usar CDN lojoakxmk');

    // Limpeza / Delecão
    const deleted = await deleteFromImageKit(uploadRes.fileId);
    assert.strictEqual(deleted, true, 'Arquivo de teste deve ser excluído com sucesso');
  });
});
