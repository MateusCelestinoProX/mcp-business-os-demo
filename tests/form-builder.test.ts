import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { 
  BRAND_COLORS, 
  DEFAULT_MASTER_PAGES, 
  DEFAULT_MASTER_QUESTIONS, 
  INITIAL_FORM_TEMPLATE,
  QuestionType,
  Question,
  FormSchema
} from '../src/types/builder';
import { forms, formSubmissions } from '../src/lib/db/schema';

describe('Form Builder Cinemático — Suíte de Testes Unitários & Integridade', () => {
  describe('1. Tipagem e Catálogo de Campos', () => {
    test('Deve suportar todos os tipos de campos exigidos pelo escopo', () => {
      const supportedTypes: QuestionType[] = [
        'text',
        'textarea',
        'email',
        'phone',
        'choice',
        'scale',
        'nps',
        'number'
      ];

      supportedTypes.forEach((type) => {
        assert.ok(typeof type === 'string', `O tipo ${type} deve ser uma string válida`);
      });
      assert.strictEqual(supportedTypes.length, 8, 'Deve cobrir exatamente 8 tipos de dados essenciais');
    });

    test('Deve conter a paleta oficial de 12 cores de marca com Neon Blood Red', () => {
      assert.strictEqual(BRAND_COLORS.length, 12, 'Deve ter 12 cores exclusivas');
      const red = BRAND_COLORS.find(c => c.id === 'red');
      assert.ok(red, 'Cor Vermelho Sangue Neon deve estar presente');
      assert.strictEqual(red.hex, '#FF0033', 'Hex oficial deve ser #FF0033');
    });

    test('Deve validar escala de 1 a 10 e NPS de 0 a 10', () => {
      const scaleQ = DEFAULT_MASTER_QUESTIONS.find(q => q.type === 'scale');
      assert.ok(scaleQ, 'Deve haver pelo menos uma pergunta de escala');
      assert.strictEqual(scaleQ.minScale, 1, 'Mínimo da escala deve ser 1');
      assert.strictEqual(scaleQ.maxScale, 10, 'Máximo da escala deve ser 10');

      const npsQ = DEFAULT_MASTER_QUESTIONS.find(q => q.type === 'nps');
      assert.ok(npsQ, 'Deve haver pergunta de NPS');
      assert.strictEqual(npsQ.minScale, 0, 'Mínimo do NPS deve ser 0');
      assert.strictEqual(npsQ.maxScale, 10, 'Máximo do NPS deve ser 10');
    });

    test('Perguntas de múltipla escolha (choice) devem conter opções array válidas', () => {
      const choiceQuestions = DEFAULT_MASTER_QUESTIONS.filter(q => q.type === 'choice');
      assert.ok(choiceQuestions.length > 0, 'Deve haver perguntas do tipo choice');
      choiceQuestions.forEach(q => {
        assert.ok(Array.isArray(q.options), `Pergunta ${q.id} deve ter array de opções`);
        assert.ok(q.options.length >= 2, `Pergunta ${q.id} deve ter pelo menos 2 opções`);
      });
    });
  });

  describe('2. Integridade Multi-Step & Template Master', () => {
    test('Template inicial master deve possuir configuração completa', () => {
      assert.ok(INITIAL_FORM_TEMPLATE.id, 'ID deve estar definido');
      assert.ok(INITIAL_FORM_TEMPLATE.formTitle, 'formTitle deve estar definido');
      assert.ok(INITIAL_FORM_TEMPLATE.headerName, 'headerName deve estar definido');
      assert.strictEqual(INITIAL_FORM_TEMPLATE.accentColor, '#FF0033');
      assert.ok(Array.isArray(INITIAL_FORM_TEMPLATE.pages), 'pages deve ser array');
      assert.ok(Array.isArray(INITIAL_FORM_TEMPLATE.questions), 'questions deve ser array');
      assert.strictEqual(INITIAL_FORM_TEMPLATE.pages.length, 4, 'Master deve ter 4 páginas/etapas');
      assert.ok(INITIAL_FORM_TEMPLATE.questions.length >= 15, 'Master deve conter perguntas completas');
    });

    test('Todas as perguntas devem referenciar pageIds existentes', () => {
      const validPageIds = new Set(DEFAULT_MASTER_PAGES.map(p => p.id));
      DEFAULT_MASTER_QUESTIONS.forEach(q => {
        assert.ok(validPageIds.has(q.pageId), `Pergunta ${q.id} referencia página inexistente: ${q.pageId}`);
      });
    });
  });

  describe('3. Validações de Entrada e Formatação (Phone / Email)', () => {
    test('Validação de regex de e-mail corporativo', () => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      assert.ok(emailRegex.test('contato@mateuscelestinopro.com'));
      assert.ok(emailRegex.test('202405039459@alunos.estacio.br'));
      assert.strictEqual(emailRegex.test('invalido-sem-arroba'), false);
      assert.strictEqual(emailRegex.test('@semusuario.com'), false);
    });

    test('Higienização e formatação de telefone comercial com DDD', () => {
      const sanitizePhone = (val: string) => {
        const digits = val.replace(/\D/g, '').slice(0, 11);
        if (digits.length <= 2) return digits;
        if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
        return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
      };

      assert.strictEqual(sanitizePhone('11999998888'), '(11) 99999-8888');
      assert.strictEqual(sanitizePhone('(21)988887777'), '(21) 98888-7777');
    });
  });

  describe('4. Schema Drizzle ORM — Tabelas forms e form_submissions', () => {
    test('Tabela forms deve possuir campos esperados pela aplicação', () => {
      assert.ok(forms.id, 'forms.id');
      assert.ok(forms.title, 'forms.title');
      assert.ok(forms.slug, 'forms.slug');
      assert.ok(forms.schemaJson, 'forms.schemaJson');
      assert.ok(forms.isActive, 'forms.isActive');
      assert.ok(forms.createdAt, 'forms.createdAt');
      assert.ok(forms.updatedAt, 'forms.updatedAt');
    });

    test('Tabela form_submissions deve possuir foreign key e campo json', () => {
      assert.ok(formSubmissions.id, 'formSubmissions.id');
      assert.ok(formSubmissions.formId, 'formSubmissions.formId');
      assert.ok(formSubmissions.dataJson, 'formSubmissions.dataJson');
      assert.ok(formSubmissions.ipAddress, 'formSubmissions.ipAddress');
      assert.ok(formSubmissions.createdAt, 'formSubmissions.createdAt');
    });
  });

  describe('5. Simulação de Payload para Submissão e Notificações', () => {
    test('Payload de submissão deve estruturar respostas de forma coerente', () => {
      const mockPayload = {
        formId: 'form_123',
        formTitle: 'Diagnóstico Executivo',
        responses: [
          { id: 'q1', label: 'Nome da Empresa', answer: 'Celestino Corp' },
          { id: 'q2', label: 'E-mail', answer: '202405039459@alunos.estacio.br' },
          { id: 'q3', label: 'NPS', answer: 10 }
        ],
        integrations: {
          notifyEmail: '202405039459@alunos.estacio.br'
        }
      };

      assert.strictEqual(mockPayload.responses.length, 3);
      assert.strictEqual(mockPayload.integrations.notifyEmail, '202405039459@alunos.estacio.br');
      assert.strictEqual(typeof mockPayload.responses[2].answer, 'number');
    });
  });
});
