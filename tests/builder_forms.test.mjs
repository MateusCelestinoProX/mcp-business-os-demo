import { test, describe } from 'node:test';
import assert from 'node:assert';
import { FIELD_DEFINITIONS, BRAND_COLORS } from '../src/components/builder/types.ts';
import { POST as submitHandler } from '../src/app/api/forms/submit/route.ts';
import { GET as getFormsHandler, POST as createFormHandler } from '../src/app/api/forms/route.ts';
import { GET as getSingleFormHandler } from '../src/app/api/forms/[id]/route.ts';

describe('Form Builder SaaS — Testes Funcionais & API de Submissão', () => {
  test('1. Definições de Campos e Cores Oficiais são válidas e completas', () => {
    assert.strictEqual(FIELD_DEFINITIONS.length, 7, 'Deve conter os 7 tipos de campo suportados');
    assert.strictEqual(BRAND_COLORS.length, 11, 'Deve conter as 11 cores oficiais da marca');

    const types = FIELD_DEFINITIONS.map((f) => f.type);
    assert.ok(types.includes('text'), 'Deve incluir text');
    assert.ok(types.includes('email'), 'Deve incluir email');
    assert.ok(types.includes('phone'), 'Deve incluir phone');
    assert.ok(types.includes('select'), 'Deve incluir select');
    assert.ok(types.includes('scale'), 'Deve incluir scale');
    assert.ok(types.includes('nps'), 'Deve incluir nps');
    assert.ok(types.includes('textarea'), 'Deve incluir textarea');
  });

  test('2. /api/forms/submit processa submissão com sucesso em modo resiliente', async () => {
    const mockRequest = new Request('http://localhost:3000/api/forms/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        formId: 'test_form_123',
        formTitle: 'Diagnóstico de Teste Executivo',
        responses: [
          { id: 'f1', label: 'Nome Completo', answer: 'Mateus Celestino' },
          { id: 'f2', label: 'E-mail', answer: 'mateus@mateuscelestinopro.com' },
          { id: 'f3', label: 'NPS', answer: 10 },
        ],
        notifyEmail: 'mateus@mateuscelestinopro.com',
      }),
    });

    const response = await submitHandler(mockRequest);
    assert.strictEqual(response.status, 200);

    const data = await response.json();
    assert.strictEqual(data.success, true);
    assert.ok(data.submissionId, 'Deve retornar um submissionId');
    assert.strictEqual(data.results.dbSaved, true);
  });

  test('3. /api/forms GET retorna lista com formulário template padrão', async () => {
    const response = await getFormsHandler();
    assert.strictEqual(response.status, 200);

    const data = await response.json();
    assert.strictEqual(data.success, true);
    assert.ok(Array.isArray(data.data), 'Data deve ser um array');
    assert.ok(data.data.length > 0, 'Deve conter ao menos 1 formulário');
    assert.ok(data.data[0].formTitle || data.data[0].title, 'Deve conter título');
  });

  test('4. /api/forms POST cria novo formulário com sucesso', async () => {
    const mockRequest = new Request('http://localhost:3000/api/forms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Formulário Automatizado de Teste',
        slug: 'teste-automatizado',
        description: 'Criado via suite de testes',
        schemaJson: {
          title: 'Formulário Automatizado de Teste',
          fields: [],
        },
      }),
    });

    const response = await createFormHandler(mockRequest);
    assert.strictEqual(response.status, 200);

    const data = await response.json();
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.data.title, 'Formulário Automatizado de Teste');
  });

  test('5. /api/forms/[id] GET retorna formulário por slug ou id com fallback gracioso', async () => {
    const mockRequest = new Request('http://localhost:3000/api/forms/master_form');
    const params = Promise.resolve({ id: 'master_form' });

    const response = await getSingleFormHandler(mockRequest, { params });
    assert.strictEqual(response.status, 200);

    const data = await response.json();
    assert.strictEqual(data.success, true);
    assert.ok(data.data, 'Deve retornar os dados do formulário');
  });
});
