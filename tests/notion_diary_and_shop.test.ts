import { test, describe } from 'node:test';
import assert from 'node:assert';
import {
  parseNotionMarkdown,
  calculateReadingTime,
  extractExcerpt,
  NOTION_ARTICLE_TEMPLATES,
} from '../src/lib/notion-diary-parser';

describe('Notion-like Diary Parser & Markdown Extensions', () => {
  test('Deve converter markdown padrão com segurança', () => {
    const raw = '# Título Soberano\n\nEste é um parágrafo de teste com **negrito** e *itálico*.';
    const html = parseNotionMarkdown(raw);
    assert.ok(html.includes('<h1'), 'Deve gerar tag h1');
    assert.ok(html.includes('<strong>negrito</strong>'), 'Deve gerar strong');
    assert.ok(html.includes('<em>itálico</em>'), 'Deve gerar em');
  });

  test('Deve processar bloco :::callout com ícones e classes glass', () => {
    const raw = ':::callout 💡 Dica de Ouro\nEste é um aviso importante com layout glass.\n:::';
    const html = parseNotionMarkdown(raw);
    assert.ok(html.includes('notion-callout'), 'Deve conter classe notion-callout');
    assert.ok(html.includes('💡'), 'Deve preservar o emoji do callout');
    assert.ok(html.includes('Dica de Ouro'), 'Deve conter o título do callout');
  });

  test('Deve processar bloco :::toggle com summary e details sanfonado', () => {
    const raw = ':::toggle Ver Código Oculto\n```python\nprint("Soberano")\n```\n:::';
    const html = parseNotionMarkdown(raw);
    assert.ok(html.includes('<details class="notion-toggle'), 'Deve conter tag details');
    assert.ok(html.includes('<summary'), 'Deve conter tag summary');
    assert.ok(html.includes('Ver Código Oculto'), 'Deve conter o título do toggle');
  });

  test('Deve processar colunas Notion :::columns-2', () => {
    const raw = ':::columns-2\nColuna Esquerda\n---\nColuna Direita\n:::';
    const html = parseNotionMarkdown(raw);
    assert.ok(html.includes('notion-columns-2'), 'Deve conter classe notion-columns-2');
    assert.ok(html.includes('Coluna Esquerda'), 'Deve conter conteúdo da coluna 1');
    assert.ok(html.includes('Coluna Direita'), 'Deve conter conteúdo da coluna 2');
  });

  test('Deve processar embed de YouTube :::embed', () => {
    const raw = ':::embed https://www.youtube.com/watch?v=dQw4w9WgXcQ :::';
    const html = parseNotionMarkdown(raw);
    assert.ok(html.includes('iframe'), 'Deve gerar iframe de embed');
    assert.ok(html.includes('youtube.com/embed/dQw4w9WgXcQ'), 'Deve converter URL para embed seguro');
  });

  test('Deve processar link bookmark :::bookmark', () => {
    const raw = ':::bookmark https://mateuscelestinopro.com | Plataforma Oficial | Ecossistema Unificado :::';
    const html = parseNotionMarkdown(raw);
    assert.ok(html.includes('notion-bookmark'), 'Deve conter classe notion-bookmark');
    assert.ok(html.includes('Plataforma Oficial'), 'Deve conter o título do bookmark');
  });

  test('calculateReadingTime deve calcular estimativa em minutos com base no texto', () => {
    const shortText = 'Palavra '.repeat(100);
    assert.strictEqual(calculateReadingTime(shortText), '1 min');

    const longText = 'Palavra '.repeat(600);
    assert.strictEqual(calculateReadingTime(longText), '3 min');
  });

  test('extractExcerpt deve remover tags de blocos customizados e truncar', () => {
    const content = ':::callout 💡 Dica\nIntrodução técnica importante para automação com inteligência artificial.\n:::';
    const excerpt = extractExcerpt(content, 40);
    assert.ok(!excerpt.includes(':::'), 'Deve retirar os marcadores de bloco');
    assert.ok(excerpt.length <= 45, 'Deve limitar ao tamanho aproximado');
  });

  test('NOTION_ARTICLE_TEMPLATES deve exportar templates válidos', () => {
    assert.ok(Array.isArray(NOTION_ARTICLE_TEMPLATES), 'Deve ser um array');
    assert.ok(NOTION_ARTICLE_TEMPLATES.length >= 3, 'Deve ter pelo menos 3 templates');
    const tutorial = NOTION_ARTICLE_TEMPLATES.find(t => t.id === 'tutorial');
    assert.ok(tutorial, 'Template de tutorial deve existir');
    assert.ok(tutorial.content.includes(':::callout'), 'Template deve conter blocos notion');
  });
});
