import { test, describe, before, after } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import {
  loadAllLibraries,
  createLibrary,
  updateLibrary,
  deleteLibrary,
  loadAllItems,
  createNewDocumentInLibrary,
  getFileContent,
  saveFileContent,
  deleteItemFromLibrary,
  deleteMultipleItems,
  updateLibraryItem,
  resolvePhysicalFilePath,
  LibraryCategory,
  LibraryItem,
} from '../src/lib/library/library-manager';

describe('Library Control & Library Editor — Suíte de Testes de Sincronização Total', () => {
  let createdLib: LibraryCategory | null = null;
  let createdItem: LibraryItem | null = null;

  after(() => {
    // Limpeza após os testes
    if (createdItem) {
      deleteItemFromLibrary(createdItem.id);
    }
    if (createdLib) {
      deleteLibrary(createdLib.id);
    }
  });

  test('1. Deve listar todas as bibliotecas padrão do sistema', () => {
    const libs = loadAllLibraries();
    assert.ok(Array.isArray(libs), 'Deveria retornar uma lista de bibliotecas');
    assert.ok(libs.length >= 10, 'Deve conter pelo menos as 11 bibliotecas originais');
    const promptsLib = libs.find((l) => l.slug.includes('prompt') || l.id.includes('prompt'));
    assert.ok(promptsLib, 'Biblioteca de Prompts deve existir');
    assert.ok(typeof promptsLib.itemCount === 'number', 'Biblioteca deve possuir contagem numérica de itens');
  });

  test('2. Deve criar uma nova biblioteca customizada no backend', () => {
    createdLib = createLibrary({
      name: 'Biblioteca de Automação Soberana',
      slug: 'automacao-soberana-test',
      description: 'Cofre para validação do backend unificado e uploads',
      badge: 'AUTOMATION PRO',
      icon: '⚡',
      gradient: 'from-amber-600/30 via-orange-600/20 to-transparent',
    });

    assert.ok(createdLib, 'A biblioteca deve ter sido criada');
    assert.strictEqual(createdLib.name, 'Biblioteca de Automação Soberana');
    assert.strictEqual(createdLib.slug, 'automacao-soberana-test');

    const allLibs = loadAllLibraries();
    const found = allLibs.find((l) => l.id === createdLib!.id);
    assert.ok(found, 'A biblioteca criada deve estar presente em loadAllLibraries');
  });

  test('3. Deve criar um novo documento (.md) físico diretamente na biblioteca criada', () => {
    assert.ok(createdLib, 'A biblioteca precisa existir');

    createdItem = createNewDocumentInLibrary({
      libraryName: createdLib.name,
      librarySlug: createdLib.slug,
      filename: 'manifesto-executivo.md',
      content: '# Manifesto Executivo Soberano\n\nEste documento atesta a gravação física e sincronização do cofre.',
      title: 'Manifesto Executivo Soberano',
      description: 'Documento criado para teste de sincronização total',
      tags: ['manifesto', 'executivo', 'soberano'],
    });

    assert.ok(createdItem, 'O item deve ter sido criado com sucesso');
    assert.ok(createdItem.id, 'O item deve possuir ID');
    assert.strictEqual(createdItem.category, createdLib.slug);

    // Verificar se o arquivo físico foi gravado no disco
    const physicalPath = resolvePhysicalFilePath(createdItem);
    assert.ok(physicalPath, 'Caminho físico deve ser resolvido');
    assert.ok(fs.existsSync(physicalPath), `Arquivo físico deve existir no disco: ${physicalPath}`);

    const diskContent = fs.readFileSync(physicalPath, 'utf-8');
    assert.ok(diskContent.includes('Manifesto Executivo Soberano'), 'Conteúdo do arquivo em disco deve ser idêntico');
  });

  test('4. Deve ler o conteúdo do arquivo físico para edição em tempo real', () => {
    assert.ok(createdItem, 'Item deve existir');
    const res = getFileContent(createdItem.id);
    assert.strictEqual(res.success, true, 'getFileContent deve retornar sucesso');
    assert.ok(res.content && res.content.includes('Manifesto Executivo Soberano'), 'Texto retornado deve conter o título');
  });

  test('5. Deve atualizar o conteúdo físico do arquivo e os metadados', () => {
    assert.ok(createdItem, 'Item deve existir');

    // 1. Atualizar conteúdo físico no disco
    const updatedContent = '# Manifesto Executivo Soberano v2\n\nConteúdo atualizado e sincronizado em disco via Library Editor.';
    const saveRes = saveFileContent(createdItem.id, updatedContent);
    assert.strictEqual(saveRes.success, true, 'saveFileContent deve retornar sucesso');

    // 2. Atualizar metadados
    const updatedMeta = updateLibraryItem(createdItem.id, {
      title: 'Manifesto Executivo v2 Atualizado',
      tags: ['manifesto', 'v2', 'atualizado'],
    });
    assert.ok(updatedMeta, 'updateLibraryItem deve retornar item atualizado');
    assert.strictEqual(updatedMeta.title, 'Manifesto Executivo v2 Atualizado');

    // 3. Checar integridade no disco
    const physicalPath = resolvePhysicalFilePath(createdItem);
    assert.ok(physicalPath);
    const newDiskContent = fs.readFileSync(physicalPath, 'utf-8');
    assert.ok(newDiskContent.includes('v2 Atualizado') || newDiskContent.includes('Manifesto Executivo Soberano v2'), 'Arquivo no disco deve conter as alterações físicas');
  });

  test('6. Deve deletar o item, removendo-o do catálogo e limpando o disco', () => {
    assert.ok(createdItem, 'Item deve existir');
    const physicalPath = resolvePhysicalFilePath(createdItem);

    const deleted = deleteItemFromLibrary(createdItem.id);
    assert.strictEqual(deleted, true, 'deleteItemFromLibrary deve retornar true');

    // Checar catálogo
    const allItems = loadAllItems();
    const found = allItems.find((it) => it.id === createdItem!.id);
    assert.strictEqual(found, undefined, 'O item não pode mais constar no catálogo');

    // Checar remoção física do disco
    if (physicalPath && physicalPath.includes('/uploads/library/')) {
      assert.strictEqual(fs.existsSync(physicalPath), false, 'Arquivo em disco deve ser removido após exclusão');
    }
    createdItem = null;
  });

  test('7. Deve deletar a biblioteca criada', () => {
    assert.ok(createdLib, 'Biblioteca deve existir');
    const deleted = deleteLibrary(createdLib.id);
    assert.strictEqual(deleted, true, 'deleteLibrary deve retornar true');

    const allLibs = loadAllLibraries();
    const found = allLibs.find((l) => l.id === createdLib!.id);
    assert.strictEqual(found, undefined, 'A biblioteca não deve mais constar na lista');
    createdLib = null;
  });
});
