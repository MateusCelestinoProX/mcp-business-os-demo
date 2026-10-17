'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  BookOpen,
  FolderPlus,
  Upload,
  Cloud,
  Trash2,
  Edit3,
  ExternalLink,
  Search,
  FileText,
  Image as ImageIcon,
  Video,
  FileCode,
  Package,
  CheckCircle2,
  HardDrive,
  Globe,
  Layers,
  ArrowRight,
  ArrowLeft,
  X,
  RefreshCw,
  Eye,
  Download,
  FolderKanban,
  Sparkles,
  Plus,
  FilePlus2,
  Save,
  CheckSquare,
  Square,
  ChevronRight,
  SlidersHorizontal,
} from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { LibraryCategory, LibraryItem } from '@/lib/library/library-manager';

export function LibraryControlSuite() {
  const [libraries, setLibraries] = useState<LibraryCategory[]>([]);
  const [selectedLibrary, setSelectedLibrary] = useState<LibraryCategory | null>(null);
  const [libraryItems, setLibraryItems] = useState<LibraryItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<LibraryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
  const [stats, setStats] = useState({
    totalLibraries: 0,
    totalItems: 0,
    totalBytes: 0,
    macUploads: 0,
    cloudUploads: 0,
  });

  // Modais de Biblioteca (Criar / Editar)
  const [isLibModalOpen, setIsLibModalOpen] = useState(false);
  const [editingLib, setEditingLib] = useState<LibraryCategory | null>(null);
  const [libForm, setLibForm] = useState({
    name: '',
    slug: '',
    description: '',
    icon: '📁',
    badge: 'PRO',
  });

  // Painéis Ativos no Workspace da Biblioteca: 'none' | 'upload' | 'cloud' | 'create_doc'
  const [activeActionPanel, setActiveActionPanel] = useState<'none' | 'upload' | 'cloud' | 'create_doc'>('none');

  // Estados de Upload do Mac
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Estados de Envio da Nuvem
  const [cloudUrl, setCloudUrl] = useState('');
  const [cloudTitle, setCloudTitle] = useState('');
  const [cloudDesc, setCloudDesc] = useState('');
  const [cloudType, setCloudType] = useState<string>('other');
  const [isSubmittingCloud, setIsSubmittingCloud] = useState(false);

  // Estados de Criação de Documento Direto (.md / .txt)
  const [newDocFilename, setNewDocFilename] = useState('');
  const [newDocTitle, setNewDocTitle] = useState('');
  const [newDocContent, setNewDocContent] = useState('');
  const [newDocDesc, setNewDocDesc] = useState('');
  const [isCreatingDoc, setIsCreatingDoc] = useState(false);

  // Estados de Edição Completa de Arquivo (Metadados + Conteúdo)
  const [editingItem, setEditingItem] = useState<LibraryItem | null>(null);
  const [editingItemTitle, setEditingItemTitle] = useState('');
  const [editingItemDesc, setEditingItemDesc] = useState('');
  const [editingItemTags, setEditingItemTags] = useState('');
  const [editingItemCategory, setEditingItemCategory] = useState('');
  const [editingItemContent, setEditingItemContent] = useState('');
  const [isItemContentLoading, setIsItemContentLoading] = useState(false);
  const [isSavingItem, setIsSavingItem] = useState(false);
  const [isEditableText, setIsEditableText] = useState(false);

  // Modal de Preview
  const [previewItem, setPreviewItem] = useState<LibraryItem | null>(null);

  // Filtros e Busca
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Carrega bibliotecas e estatísticas
  const loadLibrariesData = async (targetLibSlug?: string) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/libraries');
      const data = await res.json();
      if (data.success) {
        const libs: LibraryCategory[] = data.libraries || [];
        setLibraries(libs);
        setStats(data.stats || {});

        if (targetLibSlug) {
          const match = libs.find((l) => l.slug === targetLibSlug || l.id === targetLibSlug);
          if (match) {
            setSelectedLibrary(match);
            await loadLibraryFiles(match);
          }
        } else if (selectedLibrary) {
          const match = libs.find((l) => l.slug === selectedLibrary.slug || l.id === selectedLibrary.id);
          if (match) {
            setSelectedLibrary(match);
            await loadLibraryFiles(match);
          }
        }
      }
    } catch (err) {
      console.error('Erro ao carregar bibliotecas:', err);
      showToast('Falha na sincronização com o banco de bibliotecas.');
    } finally {
      setIsLoading(false);
    }
  };

  // Carrega os arquivos reais da biblioteca selecionada
  const loadLibraryFiles = async (lib: LibraryCategory) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/libraries?id=${encodeURIComponent(lib.id || lib.slug)}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.items)) {
        setLibraryItems(data.items);
        setSelectedItemIds([]);
      }
    } catch (err) {
      console.error('Erro ao buscar arquivos da biblioteca:', err);
      showToast('Erro ao carregar arquivos da biblioteca.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadLibrariesData();
  }, []);

  // Filtragem dinâmica dos arquivos
  useEffect(() => {
    let result = [...libraryItems];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (it) =>
          it.title?.toLowerCase().includes(q) ||
          it.file?.toLowerCase().includes(q) ||
          it.description?.toLowerCase().includes(q) ||
          it.tags?.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (selectedTypeFilter !== 'all') {
      result = result.filter((it) => it.type === selectedTypeFilter);
    }

    setFilteredItems(result);
  }, [libraryItems, searchQuery, selectedTypeFilter]);

  // Abertura do Workspace de uma Biblioteca
  const handleOpenLibraryWorkspace = (lib: LibraryCategory) => {
    setSelectedLibrary(lib);
    setActiveActionPanel('none');
    loadLibraryFiles(lib);
  };

  // Voltar para a Visão Geral de todas as Bibliotecas
  const handleBackToOverview = () => {
    setSelectedLibrary(null);
    setActiveActionPanel('none');
    setLibraryItems([]);
    setSelectedItemIds([]);
    loadLibrariesData();
  };

  // Salvar Criação ou Edição de Biblioteca
  const handleSaveLib = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!libForm.name.trim()) {
      showToast('O nome da biblioteca é obrigatório.');
      return;
    }

    try {
      if (editingLib) {
        const res = await fetch('/api/admin/libraries', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingLib.id, ...libForm }),
        });
        const data = await res.json();
        if (data.success) {
          showToast(`Biblioteca "${libForm.name}" atualizada com sucesso.`);
          setIsLibModalOpen(false);
          loadLibrariesData(editingLib.slug);
        } else {
          showToast(data.error || 'Erro ao atualizar.');
        }
      } else {
        const res = await fetch('/api/admin/libraries', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(libForm),
        });
        const data = await res.json();
        if (data.success) {
          showToast(`Biblioteca "${libForm.name}" criada com sucesso.`);
          setIsLibModalOpen(false);
          loadLibrariesData(data.library?.slug);
        } else {
          showToast(data.error || 'Erro ao criar.');
        }
      }
    } catch (err) {
      console.error(err);
      showToast('Erro de comunicação com o servidor.');
    }
  };

  // Excluir Biblioteca
  const handleDeleteLib = async (lib: LibraryCategory) => {
    if (!window.confirm(`Tem certeza que deseja excluir permanentemente a biblioteca "${lib.name}"?`)) return;

    try {
      const res = await fetch(`/api/admin/libraries?id=${encodeURIComponent(lib.id || lib.slug)}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Biblioteca "${lib.name}" removida com sucesso.`);
        if (selectedLibrary?.id === lib.id) {
          handleBackToOverview();
        } else {
          loadLibrariesData();
        }
      } else {
        showToast(data.error || 'Erro ao deletar biblioteca.');
      }
    } catch (err) {
      console.error(err);
      showToast('Erro ao excluir biblioteca.');
    }
  };

  // Upload Direto do Mac para a Biblioteca Selecionada
  const handleUploadFilesToLibrary = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0 || !selectedLibrary) return;

    setIsUploading(true);
    setUploadProgress(20);

    try {
      const formData = new FormData();
      formData.append('categoryName', selectedLibrary.name);
      formData.append('categorySlug', selectedLibrary.slug);

      for (let i = 0; i < fileList.length; i++) {
        formData.append('files', fileList[i]);
      }

      setUploadProgress(50);
      const res = await fetch('/api/admin/libraries/upload', {
        method: 'POST',
        body: formData,
      });

      setUploadProgress(90);
      const data = await res.json();

      if (data.success) {
        showToast(`Upload concluído: ${data.message}`);
        setUploadProgress(100);
        await loadLibraryFiles(selectedLibrary);
        loadLibrariesData(selectedLibrary.slug);
        setActiveActionPanel('none');
      } else {
        showToast(data.error || 'Falha no upload.');
      }
    } catch (err) {
      console.error(err);
      showToast('Erro no envio de arquivos do Mac.');
    } finally {
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }, 500);
    }
  };

  // Importar da Nuvem para a Biblioteca Selecionada
  const handleCloudImport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cloudUrl.trim() || !selectedLibrary) {
      showToast('Insira a URL direta do ativo na nuvem.');
      return;
    }

    setIsSubmittingCloud(true);
    try {
      const res = await fetch('/api/admin/libraries/cloud', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: cloudUrl,
          title: cloudTitle,
          description: cloudDesc,
          categoryName: selectedLibrary.name,
          categorySlug: selectedLibrary.slug,
          customType: cloudType !== 'other' ? cloudType : undefined,
        }),
      });

      const data = await res.json();
      if (data.success) {
        showToast('Ativo da nuvem vinculado com sucesso!');
        setCloudUrl('');
        setCloudTitle('');
        setCloudDesc('');
        await loadLibraryFiles(selectedLibrary);
        loadLibrariesData(selectedLibrary.slug);
        setActiveActionPanel('none');
      } else {
        showToast(data.error || 'Erro ao sincronizar da nuvem.');
      }
    } catch (err) {
      console.error(err);
      showToast('Erro na requisição da nuvem.');
    } finally {
      setIsSubmittingCloud(false);
    }
  };

  // Criar Documento Direto (.md / .txt / prompt)
  const handleCreateDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocFilename.trim() || !selectedLibrary) {
      showToast('Insira o nome do arquivo.');
      return;
    }

    setIsCreatingDoc(true);
    try {
      const res = await fetch('/api/admin/libraries/create-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          libraryName: selectedLibrary.name,
          librarySlug: selectedLibrary.slug,
          filename: newDocFilename,
          title: newDocTitle || newDocFilename,
          description: newDocDesc,
          content: newDocContent,
        }),
      });

      const data = await res.json();
      if (data.success) {
        showToast(`Documento criado com sucesso!`);
        setNewDocFilename('');
        setNewDocTitle('');
        setNewDocContent('');
        setNewDocDesc('');
        await loadLibraryFiles(selectedLibrary);
        loadLibrariesData(selectedLibrary.slug);
        setActiveActionPanel('none');
      } else {
        showToast(data.error || 'Erro ao criar documento.');
      }
    } catch (err) {
      console.error(err);
      showToast('Erro ao criar arquivo.');
    } finally {
      setIsCreatingDoc(false);
    }
  };

  // Abrir Modal de Edição Completa de um Arquivo
  const handleOpenEditItem = async (item: LibraryItem) => {
    setEditingItem(item);
    setEditingItemTitle(item.title || item.file);
    setEditingItemDesc(item.description || '');
    setEditingItemTags(item.tags?.join(', ') || '');
    setEditingItemCategory(item.category_group || item.category);
    setEditingItemContent('');
    setIsEditableText(false);
    setIsItemContentLoading(true);

    try {
      const res = await fetch(`/api/admin/libraries/items/${encodeURIComponent(item.id)}`);
      const data = await res.json();
      if (data.success) {
        setIsEditableText(data.isEditableText || false);
        setEditingItemContent(data.content || item.text_preview || '');
      }
    } catch (err) {
      console.warn('Erro ao carregar conteúdo do item:', err);
    } finally {
      setIsItemContentLoading(false);
    }
  };

  // Salvar Edição Completa do Arquivo
  const handleSaveItemEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    setIsSavingItem(true);
    try {
      const tagsArray = editingItemTags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const targetLib = libraries.find(
        (l) => l.name.toLowerCase() === editingItemCategory.toLowerCase() || l.slug === editingItemCategory
      );

      const res = await fetch(`/api/admin/libraries/items/${encodeURIComponent(editingItem.id)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editingItemTitle,
          description: editingItemDesc,
          tags: tagsArray,
          category_group: targetLib ? targetLib.name : editingItemCategory,
          category: targetLib ? targetLib.slug : editingItem.category,
          content: isEditableText ? editingItemContent : undefined,
        }),
      });

      const data = await res.json();
      if (data.success) {
        showToast('Arquivo atualizado com sucesso no cofre!');
        setEditingItem(null);
        if (selectedLibrary) {
          await loadLibraryFiles(selectedLibrary);
          loadLibrariesData(selectedLibrary.slug);
        }
      } else {
        showToast(data.error || 'Erro ao salvar alterações.');
      }
    } catch (err) {
      console.error(err);
      showToast('Falha ao salvar arquivo.');
    } finally {
      setIsSavingItem(false);
    }
  };

  // Excluir Arquivo Individual
  const handleDeleteItem = async (item: LibraryItem) => {
    if (!window.confirm(`Tem certeza que deseja excluir "${item.title || item.file}"? O arquivo será removido do cofre.`)) return;

    try {
      const res = await fetch(`/api/admin/libraries/items/${encodeURIComponent(item.id)}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        showToast('Arquivo excluído com sucesso.');
        if (selectedLibrary) {
          await loadLibraryFiles(selectedLibrary);
          loadLibrariesData(selectedLibrary.slug);
        }
      } else {
        showToast(data.error || 'Erro ao excluir arquivo.');
      }
    } catch (err) {
      console.error(err);
      showToast('Erro ao deletar item.');
    }
  };

  // Exclusão em Massa de Arquivos Selecionados
  const handleBulkDelete = async () => {
    if (selectedItemIds.length === 0) return;
    if (!window.confirm(`Deseja remover PERMANENTEMENTE os ${selectedItemIds.length} arquivos selecionados?`)) return;

    try {
      const res = await fetch('/api/admin/libraries/bulk-delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedItemIds }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message || `${data.deletedCount} arquivos removidos.`);
        setSelectedItemIds([]);
        if (selectedLibrary) {
          await loadLibraryFiles(selectedLibrary);
          loadLibrariesData(selectedLibrary.slug);
        }
      } else {
        showToast(data.error || 'Erro na exclusão em massa.');
      }
    } catch (err) {
      console.error(err);
      showToast('Erro ao executar remoção em lote.');
    }
  };

  // Toggle Selecionar Todos
  const handleToggleSelectAll = () => {
    if (selectedItemIds.length === filteredItems.length) {
      setSelectedItemIds([]);
    } else {
      setSelectedItemIds(filteredItems.map((i) => i.id));
    }
  };

  // Toggle Selecionar Item Individual
  const handleToggleSelectItem = (id: string) => {
    setSelectedItemIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Helper de ícone por tipo de arquivo
  const getItemIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <ImageIcon className="w-4 h-4 text-emerald-400" />;
      case 'video':
        return <Video className="w-4 h-4 text-purple-400" />;
      case 'pdf':
        return <FileText className="w-4 h-4 text-rose-400" />;
      case 'md':
      case 'txt':
        return <FileText className="w-4 h-4 text-blue-400" />;
      case 'code':
        return <FileCode className="w-4 h-4 text-cyan-400" />;
      case 'apk':
      case 'archive':
        return <Package className="w-4 h-4 text-amber-400" />;
      default:
        return <FileText className="w-4 h-4 text-neutral-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-[#0d0e14]/95 border border-purple-500/40 text-white rounded-xl shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-purple-400" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* HEADER PRINCIPAL */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono tracking-widest uppercase px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300">
              SECRET COFFER ARCHITECTURE
            </span>
            <span className="text-neutral-500 text-xs">•</span>
            <span className="text-xs font-mono text-neutral-400">Mateus Celestino Pro X v2.5</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1 flex items-center gap-3">
            <span>Library Control & Full Editor</span>
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/30">
              👑 ADMIN
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-2xl">
            Gerenciamento total e sincronizado em disco. Cada biblioteca possui seu próprio espaço de upload (Mac e
            Nuvem), visualização, edição de metadados, editor de texto (.md/.txt) e exclusão definitiva.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => {
              if (selectedLibrary) loadLibraryFiles(selectedLibrary);
              loadLibrariesData(selectedLibrary?.slug);
            }}
            variant="outline"
            className="flex items-center gap-2 bg-white/5 border-white/10 hover:bg-white/10 text-xs text-neutral-200"
          >
            <RefreshCw className={cn('w-3.5 h-3.5', isLoading && 'animate-spin')} />
            <span>Sincronizar Disco</span>
          </Button>

          <Button
            onClick={() => {
              setEditingLib(null);
              setLibForm({ name: '', slug: '', description: '', icon: '📁', badge: 'PRO' });
              setIsLibModalOpen(true);
            }}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-purple-600/20 border border-purple-400/30"
          >
            <FolderPlus className="w-4 h-4" />
            <span>+ Nova Biblioteca</span>
          </Button>
        </div>
      </div>

      {/* KPIS REAIS GLOBAIS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <GlassCard className="p-4 bg-white/[0.03] border-white/10">
          <div className="flex items-center justify-between text-neutral-400 mb-1">
            <span className="text-[10px] font-mono uppercase">Bibliotecas</span>
            <BookOpen className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-white">{stats.totalLibraries || libraries.length}</div>
          <div className="text-[10px] text-neutral-500">Módulos Registrados</div>
        </GlassCard>

        <GlassCard className="p-4 bg-white/[0.03] border-white/10">
          <div className="flex items-center justify-between text-neutral-400 mb-1">
            <span className="text-[10px] font-mono uppercase">Total Arquivos</span>
            <Layers className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-white">{stats.totalItems || 406}</div>
          <div className="text-[10px] text-neutral-500">Acervo Intelectual</div>
        </GlassCard>

        <GlassCard className="p-4 bg-white/[0.03] border-white/10">
          <div className="flex items-center justify-between text-neutral-400 mb-1">
            <span className="text-[10px] font-mono uppercase">Uploads Mac</span>
            <HardDrive className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white">{stats.macUploads || 0}</div>
          <div className="text-[10px] text-emerald-400/80">Direto do Mac</div>
        </GlassCard>

        <GlassCard className="p-4 bg-white/[0.03] border-white/10">
          <div className="flex items-center justify-between text-neutral-400 mb-1">
            <span className="text-[10px] font-mono uppercase">Nuvem Sync</span>
            <Globe className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white">{stats.cloudUploads || 0}</div>
          <div className="text-[10px] text-amber-400/80">Links Externos Sincronizados</div>
        </GlassCard>

        <GlassCard className="p-4 bg-white/[0.03] border-white/10">
          <div className="flex items-center justify-between text-neutral-400 mb-1">
            <span className="text-[10px] font-mono uppercase">Hidden Library</span>
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <a
            href="/biblioteca"
            target="_blank"
            rel="noreferrer"
            className="text-xs text-purple-300 hover:text-white font-semibold flex items-center gap-1 mt-1 transition-colors"
          >
            <span>Ver /biblioteca</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <div className="text-[10px] text-neutral-500 mt-1">3 Shaders · Galadriel</div>
        </GlassCard>
      </div>

      {/* ========================================================
          VISÃO 1: QUANDO NENHUMA BIBLIOTECA ESTÁ SELECIONADA
          Mostra todas as bibliotecas existentes com botões diretos
          ======================================================== */}
      {!selectedLibrary && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FolderKanban className="w-4 h-4 text-purple-400" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                Selecione uma Biblioteca para Gerenciar ({libraries.length})
              </h2>
            </div>
            <span className="text-xs text-neutral-400">Clique para abrir os arquivos ou fazer upload dedicado</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {libraries.map((lib) => (
              <div
                key={lib.id || lib.slug}
                className="group relative p-5 rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-purple-500/50 transition-all flex flex-col justify-between backdrop-blur-xl shadow-lg"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl p-2.5 rounded-xl bg-white/5 border border-white/10 group-hover:scale-110 transition-transform">
                        {lib.icon || '📁'}
                      </span>
                      <div>
                        <h3 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">
                          {lib.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-neutral-200">
                            {lib.itemCount || 0} arquivos
                          </span>
                          {lib.badge && (
                            <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-purple-500/20 border border-purple-500/30 text-purple-300 uppercase">
                              {lib.badge}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Ações de Edição/Exclusão da Biblioteca */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingLib(lib);
                          setLibForm({
                            name: lib.name,
                            slug: lib.slug,
                            description: lib.description || '',
                            icon: lib.icon || '📁',
                            badge: lib.badge || 'PRO',
                          });
                          setIsLibModalOpen(true);
                        }}
                        title="Editar metadados da biblioteca"
                        className="p-1.5 rounded-lg hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteLib(lib);
                        }}
                        title="Excluir biblioteca"
                        className="p-1.5 rounded-lg hover:bg-red-500/20 text-neutral-400 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-neutral-400 mt-3 line-clamp-2 leading-relaxed">
                    {lib.description || 'Biblioteca do cofre de conhecimento.'}
                  </p>
                </div>

                {/* BOTÕES DE AÇÃO PRINCIPAL DA BIBLIOTECA */}
                <div className="mt-4 pt-3 border-t border-white/5 space-y-2">
                  <Button
                    onClick={() => handleOpenLibraryWorkspace(lib)}
                    className="w-full flex items-center justify-center gap-2 bg-purple-600/30 hover:bg-purple-600 border border-purple-500/40 text-white text-xs font-bold py-2 rounded-xl transition-all"
                  >
                    <FolderKanban className="w-3.5 h-3.5" />
                    <span>Gerenciar Arquivos ({lib.itemCount || 0})</span>
                    <ArrowRight className="w-3 h-3 ml-auto" />
                  </Button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedLibrary(lib);
                        loadLibraryFiles(lib);
                        setActiveActionPanel('upload');
                      }}
                      className="flex-1 py-1.5 px-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-300 text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors"
                    >
                      <Upload className="w-3 h-3" />
                      <span>Upload Mac</span>
                    </button>

                    <button
                      onClick={() => {
                        setSelectedLibrary(lib);
                        loadLibraryFiles(lib);
                        setActiveActionPanel('cloud');
                      }}
                      className="flex-1 py-1.5 px-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 text-blue-300 text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors"
                    >
                      <Cloud className="w-3 h-3" />
                      <span>Nuvem</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================
          VISÃO 2: WORKSPACE DA BIBLIOTECA SELECIONADA
          Painel Mestre com Uploads, Criação, Tabela de Arquivos,
          Edição Completa e Exclusão Sincronizada
          ======================================================== */}
      {selectedLibrary && (
        <div className="space-y-6">
          {/* BARRA SUPERIOR DO WORKSPACE (BREADCRUMB & TROCA RÁPIDA) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-gradient-to-r from-purple-950/40 via-black/60 to-black/80 border border-purple-500/30">
            <div className="flex items-center gap-3">
              <button
                onClick={handleBackToOverview}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center gap-1 text-xs font-semibold"
                title="Voltar para todas as bibliotecas"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Todas as Bibliotecas</span>
              </button>

              <span className="text-neutral-600">/</span>

              <div className="flex items-center gap-2">
                <span className="text-2xl">{selectedLibrary.icon || '📁'}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-purple-400 uppercase tracking-widest">
                      BIBLIOTECA ATIVA
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-white/10 text-neutral-300">
                      {libraryItems.length} arquivos
                    </span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-extrabold text-white">{selectedLibrary.name}</h2>
                </div>
              </div>
            </div>

            {/* SELETOR RÁPIDO PARA MUDAR DE BIBLIOTECA DIRETAMENTE */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-neutral-400">Alternar biblioteca:</span>
              <select
                value={selectedLibrary.slug}
                onChange={(e) => {
                  const found = libraries.find((l) => l.slug === e.target.value || l.id === e.target.value);
                  if (found) handleOpenLibraryWorkspace(found);
                }}
                className="bg-black/80 border border-white/20 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-purple-400 font-medium"
              >
                {libraries.map((l) => (
                  <option key={l.slug} value={l.slug} className="bg-neutral-900 text-white">
                    {l.icon} {l.name} ({l.itemCount || 0})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* BARRA DE AÇÕES PRINCIPAIS DO WORKSPACE */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/10">
            <div className="flex items-center gap-2 flex-wrap">
              <Button
                onClick={() => setActiveActionPanel(activeActionPanel === 'upload' ? 'none' : 'upload')}
                className={cn(
                  'text-xs font-bold flex items-center gap-1.5 rounded-xl',
                  activeActionPanel === 'upload'
                    ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
                    : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30'
                )}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>+ Upload do Mac</span>
              </Button>

              <Button
                onClick={() => setActiveActionPanel(activeActionPanel === 'cloud' ? 'none' : 'cloud')}
                className={cn(
                  'text-xs font-bold flex items-center gap-1.5 rounded-xl',
                  activeActionPanel === 'cloud'
                    ? 'bg-blue-500 text-black shadow-lg shadow-blue-500/20'
                    : 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/30'
                )}
              >
                <Cloud className="w-3.5 h-3.5" />
                <span>+ Enviar da Nuvem</span>
              </Button>

              <Button
                onClick={() => setActiveActionPanel(activeActionPanel === 'create_doc' ? 'none' : 'create_doc')}
                className={cn(
                  'text-xs font-bold flex items-center gap-1.5 rounded-xl',
                  activeActionPanel === 'create_doc'
                    ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/20'
                    : 'bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/30'
                )}
              >
                <FilePlus2 className="w-3.5 h-3.5" />
                <span>+ Novo Documento (.md)</span>
              </Button>
            </div>

            {/* Ações em Massa */}
            {selectedItemIds.length > 0 && (
              <div className="flex items-center gap-2 animate-in fade-in duration-150">
                <span className="text-xs text-neutral-300 font-mono">
                  {selectedItemIds.length} selecionado(s)
                </span>
                <Button
                  onClick={handleBulkDelete}
                  className="bg-red-600 hover:bg-red-500 text-white text-xs font-bold py-1 px-3 rounded-lg flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Excluir Selecionados</span>
                </Button>
              </div>
            )}
          </div>

          {/* PAINEL DINÂMICO 1: UPLOAD DO MAC */}
          {activeActionPanel === 'upload' && (
            <GlassCard className="p-6 bg-emerald-950/20 border-emerald-500/40 space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-white">
                  <Upload className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-sm font-bold font-mono uppercase tracking-wider">
                    Upload Direto do Mac para &quot;{selectedLibrary.name}&quot;
                  </h3>
                </div>
                <button
                  onClick={() => setActiveActionPanel('none')}
                  className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-neutral-300">
                Envie arquivos diretamente para o cofre desta biblioteca. Formatos suportados: Imagens (.png, .jpg, .webp),
                Vídeos (.mp4, .mov), Documentos PDF (.pdf), Textos (.txt), Markdown (.md), APKs Android (.apk), Arquivos ZIP (.zip)
                e Código (.js, .py, .json).
              </p>

              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  handleUploadFilesToLibrary(e.dataTransfer.files);
                }}
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  'border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3',
                  isDragging
                    ? 'border-emerald-400 bg-emerald-500/20 scale-[1.01]'
                    : 'border-emerald-500/30 hover:border-emerald-400 bg-black/40 hover:bg-black/60'
                )}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  className="hidden"
                  onChange={(e) => handleUploadFilesToLibrary(e.target.files)}
                />

                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                  <Upload className={cn('w-7 h-7', isUploading && 'animate-bounce')} />
                </div>

                <div>
                  <div className="text-sm font-bold text-white">
                    {isUploading ? 'Fazendo upload e sincronizando com o cofre...' : 'Clique para selecionar arquivos do Mac ou arraste para cá'}
                  </div>
                  <div className="text-xs text-neutral-400 mt-1">
                    Destino: <span className="text-emerald-300 font-semibold">{selectedLibrary.name}</span>
                  </div>
                </div>

                {isUploading && (
                  <div className="w-full max-w-sm mt-3">
                    <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-emerald-400 h-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                    <span className="text-[11px] font-mono text-emerald-400 mt-1 block">
                      Enviando para o disco: {uploadProgress}%
                    </span>
                  </div>
                )}
              </div>
            </GlassCard>
          )}

          {/* PAINEL DINÂMICO 2: ENVIAR DA NUVEM */}
          {activeActionPanel === 'cloud' && (
            <GlassCard className="p-6 bg-blue-950/20 border-blue-500/40 space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-white">
                  <Cloud className="w-5 h-5 text-blue-400" />
                  <h3 className="text-sm font-bold font-mono uppercase tracking-wider">
                    Sincronizar Arquivo da Nuvem para &quot;{selectedLibrary.name}&quot;
                  </h3>
                </div>
                <button
                  onClick={() => setActiveActionPanel('none')}
                  className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCloudImport} className="space-y-4">
                <div>
                  <label className="text-xs font-mono text-neutral-300 block mb-1">
                    URL direta do ativo (S3, Cloudflare R2, Google Drive, Dropbox, CDN) *
                  </label>
                  <input
                    type="url"
                    placeholder="https://s3.amazonaws.com/.../documento.pdf"
                    value={cloudUrl}
                    onChange={(e) => setCloudUrl(e.target.value)}
                    required
                    className="w-full bg-black/70 border border-white/20 rounded-xl px-4 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-blue-400 font-mono"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-mono text-neutral-300 block mb-1">Título de Exibição</label>
                    <input
                      type="text"
                      placeholder="Ex: Treinamento Avançado Master"
                      value={cloudTitle}
                      onChange={(e) => setCloudTitle(e.target.value)}
                      className="w-full bg-black/70 border border-white/20 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-blue-400"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono text-neutral-300 block mb-1">Tipo de Arquivo</label>
                    <select
                      value={cloudType}
                      onChange={(e) => setCloudType(e.target.value)}
                      className="w-full bg-black/70 border border-white/20 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-400"
                    >
                      <option value="other">Auto-detectar da URL</option>
                      <option value="video">Vídeo (.mp4, .mov)</option>
                      <option value="pdf">Documento PDF</option>
                      <option value="image">Imagem (.png, .webp)</option>
                      <option value="md">Markdown (.md)</option>
                      <option value="txt">Texto (.txt)</option>
                      <option value="apk">Pacote APK / ZIP</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-mono text-neutral-300 block mb-1">Descrição / Notas</label>
                  <input
                    type="text"
                    placeholder="Notas sobre o arquivo..."
                    value={cloudDesc}
                    onChange={(e) => setCloudDesc(e.target.value)}
                    className="w-full bg-black/70 border border-white/20 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-blue-400"
                  />
                </div>

                <div className="flex items-center justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setActiveActionPanel('none')}
                    className="text-xs bg-white/5 border-white/10 text-neutral-300"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmittingCloud || !cloudUrl.trim()}
                    className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold"
                  >
                    <Cloud className="w-4 h-4 mr-1.5" />
                    <span>{isSubmittingCloud ? 'Sincronizando...' : 'Conectar à Biblioteca'}</span>
                  </Button>
                </div>
              </form>
            </GlassCard>
          )}

          {/* PAINEL DINÂMICO 3: CRIAR DOCUMENTO DIRETO (.md / .txt) */}
          {activeActionPanel === 'create_doc' && (
            <GlassCard className="p-6 bg-purple-950/20 border-purple-500/40 space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-white">
                  <FilePlus2 className="w-5 h-5 text-purple-400" />
                  <h3 className="text-sm font-bold font-mono uppercase tracking-wider">
                    Criar Novo Documento / Prompt para &quot;{selectedLibrary.name}&quot;
                  </h3>
                </div>
                <button
                  onClick={() => setActiveActionPanel('none')}
                  className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateDocument} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-mono text-neutral-300 block mb-1">
                      Nome do Arquivo (ex: prompt-mestre.md) *
                    </label>
                    <input
                      type="text"
                      placeholder="meu-arquivo.md"
                      value={newDocFilename}
                      onChange={(e) => setNewDocFilename(e.target.value)}
                      required
                      className="w-full bg-black/70 border border-white/20 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-purple-400 font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono text-neutral-300 block mb-1">Título de Apresentação</label>
                    <input
                      type="text"
                      placeholder="Prompt Mestre de Engenharia Reversa"
                      value={newDocTitle}
                      onChange={(e) => setNewDocTitle(e.target.value)}
                      className="w-full bg-black/70 border border-white/20 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-purple-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-mono text-neutral-300 block mb-1">Descrição</label>
                  <input
                    type="text"
                    placeholder="Breve resumo sobre este documento..."
                    value={newDocDesc}
                    onChange={(e) => setNewDocDesc(e.target.value)}
                    className="w-full bg-black/70 border border-white/20 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-purple-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-neutral-300 block mb-1">
                    Conteúdo do Documento (Markdown / Texto Puro)
                  </label>
                  <textarea
                    rows={8}
                    placeholder="# Meu Título&#10;&#10;Escreva o conteúdo, prompt ou blueprint aqui..."
                    value={newDocContent}
                    onChange={(e) => setNewDocContent(e.target.value)}
                    className="w-full bg-black/80 border border-white/20 rounded-xl p-3 text-xs text-white font-mono placeholder-neutral-600 focus:outline-none focus:border-purple-400 resize-y leading-relaxed"
                  />
                </div>

                <div className="flex items-center justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setActiveActionPanel('none')}
                    className="text-xs bg-white/5 border-white/10 text-neutral-300"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={isCreatingDoc || !newDocFilename.trim()}
                    className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold"
                  >
                    <Save className="w-4 h-4 mr-1.5" />
                    <span>{isCreatingDoc ? 'Gravando no Disco...' : 'Salvar Documento'}</span>
                  </Button>
                </div>
              </form>
            </GlassCard>
          )}

          {/* BARRA DE PESQUISA E FILTROS DE TIPO */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={handleToggleSelectAll}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 flex items-center gap-1.5 text-xs font-medium border border-white/10"
              >
                {selectedItemIds.length > 0 && selectedItemIds.length === filteredItems.length ? (
                  <CheckSquare className="w-4 h-4 text-purple-400" />
                ) : (
                  <Square className="w-4 h-4 text-neutral-400" />
                )}
                <span>Selecionar Todos ({filteredItems.length})</span>
              </button>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                <input
                  type="text"
                  placeholder="Pesquisar nos arquivos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-black/60 border border-white/15 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-purple-400 w-44 sm:w-60"
                />
              </div>

              <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/10 overflow-x-auto hide-scrollbar">
                {[
                  { id: 'all', label: 'Todos' },
                  { id: 'image', label: 'Imagens' },
                  { id: 'video', label: 'Vídeos' },
                  { id: 'pdf', label: 'PDFs' },
                  { id: 'md', label: 'MD/Txt' },
                  { id: 'apk', label: 'APKs' },
                  { id: 'code', label: 'Código' },
                ].map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => setSelectedTypeFilter(filter.id)}
                    className={cn(
                      'px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all whitespace-nowrap',
                      selectedTypeFilter === filter.id
                        ? 'bg-purple-600 text-white shadow'
                        : 'text-neutral-400 hover:text-white hover:bg-white/5'
                    )}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* TABELA / GRID DE ARQUIVOS */}
          {filteredItems.length === 0 ? (
            <div className="p-12 text-center border border-dashed border-white/10 rounded-2xl bg-white/[0.01]">
              <Package className="w-10 h-10 text-neutral-600 mx-auto mb-3" />
              <div className="text-base font-bold text-white">Nenhum arquivo nesta biblioteca</div>
              <p className="text-xs text-neutral-400 mt-1 max-w-md mx-auto">
                Use os botões no topo para fazer upload do Mac, importar links da nuvem ou criar novos documentos .md.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredItems.map((item) => {
                const isSelected = selectedItemIds.includes(item.id);
                return (
                  <div
                    key={item.id}
                    className={cn(
                      'group p-3.5 rounded-xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-3 backdrop-blur-xl',
                      isSelected
                        ? 'bg-purple-950/30 border-purple-500/50'
                        : 'bg-white/[0.02] border-white/10 hover:border-white/20 hover:bg-white/[0.04]'
                    )}
                  >
                    <div className="flex items-start md:items-center gap-3 min-w-0 flex-1">
                      {/* Checkbox de Seleção */}
                      <button
                        onClick={() => handleToggleSelectItem(item.id)}
                        className="p-1 text-neutral-400 hover:text-white shrink-0 mt-0.5 md:mt-0"
                      >
                        {isSelected ? (
                          <CheckSquare className="w-4 h-4 text-purple-400" />
                        ) : (
                          <Square className="w-4 h-4 text-neutral-600 group-hover:text-neutral-400" />
                        )}
                      </button>

                      {/* Ícone do Tipo */}
                      <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 shrink-0">
                        {getItemIcon(item.type)}
                      </div>

                      {/* Informações do Arquivo */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors truncate">
                            {item.title || item.file}
                          </h4>
                          <span className="text-[10px] font-mono uppercase px-1.5 py-0.2 rounded bg-white/10 text-neutral-300">
                            {item.ext || item.type}
                          </span>
                          <span
                            className={cn(
                              'text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border uppercase',
                              item.source === 'mac'
                                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                                : item.source === 'cloud'
                                ? 'bg-blue-500/10 border-blue-500/20 text-blue-400'
                                : 'bg-white/10 border-white/10 text-neutral-300'
                            )}
                          >
                            {item.source === 'mac' ? 'Mac' : item.source === 'cloud' ? 'Nuvem' : 'Core'}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 text-[11px] text-neutral-400 mt-1 flex-wrap">
                          <span className="font-mono text-neutral-500">{item.file}</span>
                          <span>•</span>
                          <span className="font-mono text-neutral-400">{item.size_formatted}</span>
                          {item.description && (
                            <>
                              <span>•</span>
                              <span className="truncate max-w-xs text-neutral-500">{item.description}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* AÇÕES COMPLETAS DO ARQUIVO */}
                    <div className="flex items-center gap-1.5 shrink-0 self-end md:self-center border-t md:border-t-0 pt-2 md:pt-0 border-white/5">
                      {/* 1. Visualizar */}
                      <button
                        onClick={() => setPreviewItem(item)}
                        className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white transition-colors flex items-center gap-1 text-xs"
                        title="Visualizar arquivo"
                      >
                        <Eye className="w-3.5 h-3.5 text-purple-400" />
                        <span>Ver</span>
                      </button>

                      {/* 2. Editar Completo (Metadados & Texto) */}
                      <button
                        onClick={() => handleOpenEditItem(item)}
                        className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-purple-600/20 text-neutral-300 hover:text-purple-300 border border-transparent hover:border-purple-500/30 transition-all flex items-center gap-1 text-xs font-semibold"
                        title="Editar metadados e conteúdo do arquivo"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-purple-400" />
                        <span>Editar</span>
                      </button>

                      {/* 3. Baixar */}
                      {(item.url || item.rel_path) && (
                        <a
                          href={item.url || `/api/library/download?id=${item.id}&mode=file`}
                          download={item.file}
                          target="_blank"
                          rel="noreferrer"
                          className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-blue-600/20 text-neutral-300 hover:text-blue-300 transition-colors flex items-center gap-1 text-xs"
                          title="Baixar arquivo físico"
                        >
                          <Download className="w-3.5 h-3.5 text-blue-400" />
                          <span>Baixar</span>
                        </a>
                      )}

                      {/* 4. Excluir */}
                      <button
                        onClick={() => handleDeleteItem(item)}
                        className="p-1.5 rounded-lg hover:bg-red-500/20 text-neutral-500 hover:text-red-400 transition-colors"
                        title="Excluir arquivo permanentemente"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================
          MODAL 1: CRIAR OU EDITAR BIBLIOTECA
          ======================================================== */}
      {isLibModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-[#0d0e14] border border-white/20 rounded-2xl p-6 shadow-2xl relative space-y-4">
            <button
              onClick={() => setIsLibModalOpen(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-white/10"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 text-white">
              <FolderPlus className="w-5 h-5 text-purple-400" />
              <h3 className="text-base font-bold">
                {editingLib ? 'Editar Metadados da Biblioteca' : 'Criar Nova Biblioteca'}
              </h3>
            </div>

            <form onSubmit={handleSaveLib} className="space-y-3">
              <div>
                <label className="text-xs font-mono text-neutral-400 block mb-1">Nome da Biblioteca *</label>
                <input
                  type="text"
                  placeholder="Ex: Blueprints de IA & Roteiros"
                  value={libForm.name}
                  onChange={(e) => setLibForm({ ...libForm, name: e.target.value })}
                  required
                  className="w-full bg-black/70 border border-white/20 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-purple-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-mono text-neutral-400 block mb-1">Ícone / Emoji</label>
                  <input
                    type="text"
                    placeholder="Ex: ⚡ ou 📁"
                    value={libForm.icon}
                    onChange={(e) => setLibForm({ ...libForm, icon: e.target.value })}
                    className="w-full bg-black/70 border border-white/20 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-purple-400 text-center text-lg"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-neutral-400 block mb-1">Badge de Destaque</label>
                  <input
                    type="text"
                    placeholder="Ex: PRO, VIP, ELITE"
                    value={libForm.badge}
                    onChange={(e) => setLibForm({ ...libForm, badge: e.target.value })}
                    className="w-full bg-black/70 border border-white/20 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-purple-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-mono text-neutral-400 block mb-1">Descrição</label>
                <textarea
                  rows={3}
                  placeholder="Explique o propósito deste cofre de conhecimento..."
                  value={libForm.description}
                  onChange={(e) => setLibForm({ ...libForm, description: e.target.value })}
                  className="w-full bg-black/70 border border-white/20 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-purple-400 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsLibModalOpen(false)}
                  className="text-xs bg-white/5 border-white/10 text-neutral-300"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="text-xs bg-purple-600 hover:bg-purple-500 text-white font-bold"
                >
                  {editingLib ? 'Salvar Alterações' : 'Criar Biblioteca'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 2: EDIÇÃO COMPLETA DE ARQUIVO (METADADOS & TEXTO)
          ======================================================== */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-2xl bg-[#0d0e14] border border-white/20 rounded-2xl p-6 shadow-2xl relative space-y-4 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setEditingItem(null)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-white/10"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2">
              <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                <Edit3 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Editar Arquivo: {editingItem.file}</h3>
                <div className="flex items-center gap-2 text-xs text-neutral-400 font-mono">
                  <span>Formato: {editingItem.ext}</span>
                  <span>•</span>
                  <span>{editingItem.size_formatted}</span>
                </div>
              </div>
            </div>

            <form onSubmit={handleSaveItemEdit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-mono text-neutral-300 block mb-1">Título de Apresentação</label>
                  <input
                    type="text"
                    value={editingItemTitle}
                    onChange={(e) => setEditingItemTitle(e.target.value)}
                    required
                    className="w-full bg-black/70 border border-white/20 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-neutral-300 block mb-1">Biblioteca / Categoria</label>
                  <select
                    value={editingItemCategory}
                    onChange={(e) => setEditingItemCategory(e.target.value)}
                    className="w-full bg-black/70 border border-white/20 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-400"
                  >
                    {libraries.map((l) => (
                      <option key={l.slug} value={l.name}>
                        {l.icon} {l.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-mono text-neutral-300 block mb-1">Descrição</label>
                <textarea
                  rows={2}
                  value={editingItemDesc}
                  onChange={(e) => setEditingItemDesc(e.target.value)}
                  className="w-full bg-black/70 border border-white/20 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-400 resize-none"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-neutral-300 block mb-1">Tags (separadas por vírgula)</label>
                <input
                  type="text"
                  placeholder="ia, prompt, video, blueprint"
                  value={editingItemTags}
                  onChange={(e) => setEditingItemTags(e.target.value)}
                  className="w-full bg-black/70 border border-white/20 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-400"
                />
              </div>

              {/* EDITOR DE CONTEÚDO TEXTUAL CASO SEJA .MD, .TXT OU CÓDIGO */}
              {isEditableText && (
                <div className="space-y-1.5 pt-2 border-t border-white/10">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-mono text-purple-300 font-bold flex items-center gap-1.5">
                      <FileCode className="w-3.5 h-3.5" />
                      <span>Conteúdo Real do Arquivo (Edição Direta no Disco)</span>
                    </label>
                    <span className="text-[10px] text-neutral-500 font-mono">Sincronização Física Ativa</span>
                  </div>

                  {isItemContentLoading ? (
                    <div className="p-8 text-center text-xs text-neutral-400">Carregando conteúdo do disco...</div>
                  ) : (
                    <textarea
                      rows={12}
                      value={editingItemContent}
                      onChange={(e) => setEditingItemContent(e.target.value)}
                      className="w-full bg-black/90 border border-white/20 rounded-xl p-3 text-xs text-neutral-200 font-mono focus:outline-none focus:border-purple-400 resize-y leading-relaxed"
                    />
                  )}
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    handleDeleteItem(editingItem);
                    setEditingItem(null);
                  }}
                  className="text-xs bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20"
                >
                  <Trash2 className="w-3.5 h-3.5 mr-1" />
                  <span>Excluir Arquivo</span>
                </Button>

                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setEditingItem(null)}
                    className="text-xs bg-white/5 border-white/10 text-neutral-300"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSavingItem}
                    className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold"
                  >
                    <Save className="w-4 h-4 mr-1.5" />
                    <span>{isSavingItem ? 'Gravando...' : 'Salvar Alterações'}</span>
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 3: PREVIEW DE ARQUIVO
          ======================================================== */}
      {previewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-2xl bg-[#0d0e14] border border-white/20 rounded-2xl p-6 shadow-2xl relative space-y-4 max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setPreviewItem(null)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-white/10"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-white/5 border border-white/10">{getItemIcon(previewItem.type)}</div>
              <div>
                <h3 className="text-base font-bold text-white">{previewItem.title || previewItem.file}</h3>
                <div className="flex items-center gap-2 text-xs text-neutral-400 font-mono">
                  <span>{previewItem.category_group}</span>
                  <span>•</span>
                  <span>{previewItem.size_formatted}</span>
                  <span>•</span>
                  <span className="uppercase">{previewItem.source}</span>
                </div>
              </div>
            </div>

            {/* Conteúdo Renderizado */}
            <div className="rounded-xl border border-white/10 bg-black/60 p-4">
              {previewItem.type === 'image' && (
                <div className="flex items-center justify-center">
                  <img
                    src={previewItem.url || `/api/library/download?id=${previewItem.id}&mode=file`}
                    alt={previewItem.title}
                    className="max-h-96 rounded-lg object-contain"
                  />
                </div>
              )}

              {previewItem.type === 'video' && (
                <div className="flex items-center justify-center">
                  <video
                    controls
                    src={previewItem.url || `/api/library/download?id=${previewItem.id}&mode=file`}
                    className="max-h-96 rounded-lg w-full"
                  />
                </div>
              )}

              {(previewItem.type === 'md' || previewItem.type === 'txt' || previewItem.text_preview) && (
                <pre className="text-xs font-mono text-neutral-200 whitespace-pre-wrap max-h-80 overflow-y-auto leading-relaxed">
                  {previewItem.text_preview || 'Arquivo textual.'}
                </pre>
              )}

              {previewItem.type === 'pdf' && (
                <div className="text-center py-6 space-y-2">
                  <FileText className="w-12 h-12 text-rose-400 mx-auto" />
                  <div className="text-xs text-neutral-300">Documento PDF Oficial</div>
                  <a
                    href={previewItem.url || `/api/library/download?id=${previewItem.id}&mode=file`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-purple-300 hover:text-white font-semibold underline mt-2"
                  >
                    <span>Abrir PDF em nova aba</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}

              {['archive', 'apk', 'other', 'code'].includes(previewItem.type) && !previewItem.text_preview && (
                <div className="text-center py-6 space-y-2">
                  <Package className="w-12 h-12 text-amber-400 mx-auto" />
                  <div className="text-xs text-neutral-300">Pacote Binário ({previewItem.ext})</div>
                  <div className="text-[11px] text-neutral-500">Pronto para download e execução direta</div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-neutral-500 font-mono">ID: {previewItem.id}</span>
              {(previewItem.url || previewItem.rel_path) && (
                <a
                  href={previewItem.url || `/api/library/download?id=${previewItem.id}&mode=file`}
                  download={previewItem.file}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-purple-600/20"
                >
                  <Download className="w-4 h-4" />
                  <span>Baixar Arquivo Físico</span>
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
