"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  X,
  Save,
  Eye,
  Edit3,
  Columns,
  Image as ImageIcon,
  Link as LinkIcon,
  Video,
  Bookmark,
  Sparkles,
  HelpCircle,
  Clock,
  Tag,
  FileText,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  RefreshCw,
  FolderOpen,
  ArrowRight,
  Upload,
  Maximize2,
  Minimize2,
  Sliders,
  ChevronDown,
  ChevronUp,
  Wand2,
  Code2,
  ListOrdered,
  List,
  CheckSquare,
  Minus,
  Table,
  Layers,
  ExternalLink,
  BookOpen,
  Check,
  Flame,
  LayoutTemplate,
  Info,
  AlertTriangle,
  ShieldAlert,
} from "lucide-react";
import {
  parseNotionMarkdown,
  calculateReadingTime,
  extractExcerpt,
  NOTION_ARTICLE_TEMPLATES,
} from "@/lib/notion-diary-parser";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import AdminRedShader from "@/components/admin/AdminRedShader";

export interface PostEditorData {
  id?: string;
  title: string;
  slug?: string;
  category: string;
  summary: string;
  content: string;
  coverUrl: string;
  readingTime?: string;
  isPublished?: boolean;
}

interface PostEditorModalProps {
  isOpen: boolean;
  initialPost?: PostEditorData | null;
  onClose: () => void;
  onSaved: () => void;
}

// Presets de capas de alta resolução do acervo do portal
const COVER_PRESETS = [
  { label: "IA & Modelos", url: "/assets/covers/ia_generativa.webp" },
  { label: "Automação n8n", url: "/assets/covers/automacao_n8n.webp" },
  { label: "Engenharia Reversa", url: "/assets/covers/engenharia_reversa.webp" },
  { label: "Linux & Infra", url: "/assets/covers/linux_soberano.webp" },
  { label: "Recursos Globais", url: "/assets/recursos_cover.webp" },
];

export function PostEditorModal({
  isOpen,
  initialPost,
  onClose,
  onSaved,
}: PostEditorModalProps) {
  // Modos de Visualização e Layout
  const [viewMode, setViewMode] = useState<"edit" | "split" | "preview">("split");
  const [isPropertiesOpen, setIsPropertiesOpen] = useState(true);
  const [isNativeFullscreen, setIsNativeFullscreen] = useState(false);
  const [coverImageError, setCoverImageError] = useState(false);

  // Campos de Dados do Artigo
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("INTELIGÊNCIA ARTIFICIAL");
  const [coverUrl, setCoverUrl] = useState("/assets/recursos_cover.webp");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [readingTime, setReadingTime] = useState("5 min");
  const [isPublished, setIsPublished] = useState(true);

  // Estados de Operação e Autosave
  const [isSaving, setIsSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [autosaveTime, setAutosaveTime] = useState<string | null>(null);

  // Modais de Inserção Rápida
  const [mediaModalOpen, setMediaModalOpen] = useState(false);
  const [mediaUrl, setMediaUrl] = useState("");
  const [mediaCaption, setMediaCaption] = useState("");
  const [mediaType, setMediaType] = useState<"image" | "video" | "gallery">("image");

  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkText, setLinkText] = useState("");
  const [isBookmarkCard, setIsBookmarkCard] = useState(false);

  const [calloutModalOpen, setCalloutModalOpen] = useState(false);
  const [calloutType, setCalloutType] = useState<"info" | "warning" | "danger" | "success">("info");
  const [calloutTitle, setCalloutTitle] = useState("Destaque Estratégico");
  const [calloutBody, setCalloutBody] = useState("Insira aqui o ponto crucial ou instrução fundamental.");

  const [templateMenuOpen, setTemplateMenuOpen] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Inicialização e Carga dos Dados
  useEffect(() => {
    if (initialPost) {
      setTitle(initialPost.title || "");
      setSlug(initialPost.slug || "");
      setCategory(initialPost.category || "INTELIGÊNCIA ARTIFICIAL");
      setCoverUrl(initialPost.coverUrl || "/assets/recursos_cover.webp");
      setSummary(initialPost.summary || "");
      setContent(initialPost.content || "");
      setReadingTime(initialPost.readingTime || calculateReadingTime(initialPost.content || ""));
      setIsPublished(initialPost.isPublished !== undefined ? initialPost.isPublished : true);
      setCoverImageError(false);
    } else {
      // Tentar restaurar rascunho de post novo do localStorage se existir
      try {
        const savedDraft = localStorage.getItem("plataforma_admin_post_draft");
        if (savedDraft) {
          const parsed = JSON.parse(savedDraft);
          if (parsed && parsed.content && parsed.content.length > 50) {
            setTitle(parsed.title || "");
            setSlug(parsed.slug || "");
            setCategory(parsed.category || "INTELIGÊNCIA ARTIFICIAL");
            setCoverUrl(parsed.coverUrl || "/assets/recursos_cover.webp");
            setSummary(parsed.summary || "");
            setContent(parsed.content);
            setReadingTime(calculateReadingTime(parsed.content));
            setIsPublished(parsed.isPublished !== undefined ? parsed.isPublished : true);
            setCoverImageError(false);
            return;
          }
        }
      } catch (e) {
        // Ignora erro de parsing
      }

      // Fallback para Template Padrão
      setTitle("");
      setSlug("");
      setCategory("INTELIGÊNCIA ARTIFICIAL");
      setCoverUrl("/assets/recursos_cover.webp");
      setSummary("");
      setContent(NOTION_ARTICLE_TEMPLATES[0].content);
      setReadingTime("5 min");
      setIsPublished(true);
      setCoverImageError(false);
    }
    setStatusMsg(null);
  }, [initialPost, isOpen]);

  // Recalcula tempo de leitura e dispara Autosave em localStorage
  useEffect(() => {
    setReadingTime(calculateReadingTime(content));
    if (!summary && content.trim().length > 30) {
      setSummary(extractExcerpt(content, 180));
    }

    // Salvar rascunho localmente apenas se for post novo ou alteração ativa
    const timeout = setTimeout(() => {
      try {
        if (!initialPost?.id && (title.trim() || content.trim())) {
          localStorage.setItem(
            "plataforma_admin_post_draft",
            JSON.stringify({
              title,
              slug,
              category,
              coverUrl,
              summary,
              content,
              isPublished,
              updatedAt: new Date().toISOString(),
            })
          );
          const now = new Date();
          setAutosaveTime(`${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`);
        }
      } catch (e) {
        // Silencioso em caso de cota excedida
      }
    }, 1200);

    return () => clearTimeout(timeout);
  }, [content, title, slug, category, coverUrl, summary, isPublished, initialPost]);

  // Redefinir erro de imagem ao alterar coverUrl
  useEffect(() => {
    setCoverImageError(false);
  }, [coverUrl]);

  // Inserção precisa no cursor do textarea
  const insertTextAtCursor = useCallback((prefix: string, suffix: string = "", placeholder: string = "") => {
    const textarea = textareaRef.current;
    if (!textarea) {
      setContent((prev) => prev + "\n" + prefix + placeholder + suffix);
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = textarea.value.substring(start, end);
    const replacement = prefix + (selected || placeholder) + suffix;

    const newContent =
      textarea.value.substring(0, start) + replacement + textarea.value.substring(end);

    setContent(newContent);

    setTimeout(() => {
      textarea.focus();
      const newPos = start + prefix.length + (selected ? selected.length : placeholder.length);
      textarea.setSelectionRange(newPos, newPos);
    }, 50);
  }, []);

  // Atalhos de teclado (Cmd+S, Cmd+B, Cmd+I, Cmd+K, Esc)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const isCmdOrCtrl = e.metaKey || e.ctrlKey;

      if (isCmdOrCtrl && e.key.toLowerCase() === "s") {
        e.preventDefault();
        handleSavePost();
      } else if (isCmdOrCtrl && e.key.toLowerCase() === "b") {
        e.preventDefault();
        insertTextAtCursor("**", "**", "texto em negrito");
      } else if (isCmdOrCtrl && e.key.toLowerCase() === "i") {
        e.preventDefault();
        insertTextAtCursor("*", "*", "texto itálico");
      } else if (isCmdOrCtrl && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setLinkModalOpen(true);
      } else if (e.key === "Escape") {
        if (mediaModalOpen || linkModalOpen || calloutModalOpen || templateMenuOpen) {
          setMediaModalOpen(false);
          setLinkModalOpen(false);
          setCalloutModalOpen(false);
          setTemplateMenuOpen(false);
        } else {
          onClose();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, mediaModalOpen, linkModalOpen, calloutModalOpen, templateMenuOpen, insertTextAtCursor]);

  // Alternar tela cheia nativa do navegador
  const toggleNativeFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen?.().catch(() => {});
      setIsNativeFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsNativeFullscreen(false);
    }
  };

  // Gerar Slug amigável automaticamente a partir do Título
  const generateSlugFromTitle = () => {
    if (!title) return;
    const clean = title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    setSlug(clean);
  };

  // Inserir Mídia
  const handleInsertMedia = () => {
    if (!mediaUrl.trim()) return;

    if (mediaType === "video") {
      insertTextAtCursor(`\n:::embed ${mediaUrl.trim()} :::\n`, "", "");
    } else if (mediaType === "gallery") {
      const imagesList = mediaUrl
        .split("\n")
        .map((u) => u.trim())
        .filter(Boolean)
        .join("\n");
      insertTextAtCursor(`\n:::gallery Mídias e Ilustrações do Projeto\n${imagesList}\n:::\n`, "", "");
    } else {
      const caption = mediaCaption.trim() ? ` "${mediaCaption.trim()}"` : "";
      insertTextAtCursor(`\n![${mediaCaption.trim() || "Imagem do Artigo"}](${mediaUrl.trim()}${caption})\n`, "", "");
    }

    setMediaUrl("");
    setMediaCaption("");
    setMediaModalOpen(false);
  };

  // Inserir Link / Bookmark Card
  const handleInsertLink = () => {
    if (!linkUrl.trim()) return;

    if (isBookmarkCard) {
      insertTextAtCursor(
        `\n:::bookmark ${linkUrl.trim()} | ${linkText.trim() || linkUrl.trim()} | Link e documentação de referência oficial. :::\n`,
        "",
        ""
      );
    } else {
      insertTextAtCursor(`[${linkText.trim() || linkUrl.trim()}](${linkUrl.trim()})`, "", "");
    }

    setLinkUrl("");
    setLinkText("");
    setIsBookmarkCard(false);
    setLinkModalOpen(false);
  };

  // Inserir Callout Notion Especial
  const handleInsertCallout = () => {
    const icon =
      calloutType === "warning"
        ? "⚠️"
        : calloutType === "danger"
        ? "🛑"
        : calloutType === "success"
        ? "✅"
        : "💡";

    const tagType =
      calloutType === "warning"
        ? "aviso"
        : calloutType === "danger"
        ? "perigo"
        : calloutType === "success"
        ? "sucesso"
        : "info";

    insertTextAtCursor(
      `\n:::callout ${icon} ${calloutTitle} ${tagType}\n${calloutBody}\n:::\n`,
      "",
      ""
    );
    setCalloutModalOpen(false);
  };

  // Salvar no Backend Supabase
  const handleSavePost = async () => {
    if (!title.trim()) {
      setStatusMsg({ type: "error", text: "Por favor, preencha o título do artigo antes de publicar." });
      return;
    }

    if (!content.trim()) {
      setStatusMsg({ type: "error", text: "O artigo precisa de conteúdo em texto ou blocos." });
      return;
    }

    setIsSaving(true);
    setStatusMsg(null);

    try {
      const isEditing = Boolean(initialPost?.id);
      const url = "/api/articles";
      const method = isEditing ? "PUT" : "POST";

      const finalSlug = slug.trim() || title
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

      const payload = {
        id: initialPost?.id,
        title: title.trim(),
        slug: finalSlug,
        category: category.trim(),
        coverUrl: coverUrl.trim(),
        summary: summary.trim() || extractExcerpt(content, 180),
        content: content.trim(),
        readingTime: readingTime.trim(),
        isPublished: isPublished,
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Falha ao gravar artigo no Supabase.");
      }

      // Limpar rascunho temporário do localStorage após salvar com sucesso
      try {
        localStorage.removeItem("plataforma_admin_post_draft");
      } catch (e) {}

      setStatusMsg({ type: "success", text: "Artigo publicado e persistido no Supabase com sucesso total!" });
      setTimeout(() => {
        onSaved();
        onClose();
      }, 1100);
    } catch (err: any) {
      setStatusMsg({ type: "error", text: err.message || "Erro de conexão ao salvar no Supabase." });
    } finally {
      setIsSaving(false);
    }
  };

  // Estatísticas de Escrita
  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
  const charCount = content.length;
  const lineCount = content.split("\n").length;

  if (!isOpen) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] flex flex-col w-screen h-screen overflow-hidden bg-black/40 backdrop-blur-3xl animate-fadeIn select-none"
    >
      {/* SHADER VERMELHO SOBERANO (PERSONAL OS) ATIVO E VISÍVEL AO FUNDO */}
      <AdminRedShader opacity={0.78} speed={0.38} brightness={1.4} interactive={true} />

      {/* CONTAINER PRINCIPAL EM VIDRO ULTRA CLARO CRISTALINO */}
      <div className="relative z-10 flex-1 flex flex-col w-full h-full glass-ultra-clear border-none overflow-hidden">
        
        {/* ========================================================================= */}
        {/* HEADER EXECUTIVO DE PRODUÇÃO NOTION / DIARY OS */}
        {/* ========================================================================= */}
        <header className="flex items-center justify-between gap-3 px-5 py-3 bg-white/[0.03] backdrop-blur-2xl border-b border-white/10 shrink-0">
          {/* Lado Esquerdo: Identidade do Editor & Status */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#ff073a]/15 border border-[#ff073a]/40 flex items-center justify-center text-[#ff073a] shadow-[0_0_20px_rgba(255,7,58,0.35)] shrink-0">
              <Edit3 className="w-5 h-5" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-base font-extrabold text-white tracking-tight">
                  {initialPost?.id ? "Editar Artigo Soberano" : "Novo Artigo Notion-Like"}
                </h1>
                <Badge variant="red" className="text-[9px] px-2 py-0.5 tracking-wider font-mono">
                  DIARY OS V3
                </Badge>
                {autosaveTime && !initialPost?.id && (
                  <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Rascunho salvo ({autosaveTime})
                  </span>
                )}
              </div>
              <p className="text-[11px] text-zinc-400 hidden sm:block">
                Editor infinito de blocos, mídias e markdown com sincronização direta no Supabase.
              </p>
            </div>
          </div>

          {/* Centro: Modos de Visualização (Editor | Lado a Lado | Preview) */}
          <div className="inline-flex p-1 rounded-2xl bg-white/[0.04] border border-white/10 shadow-inner">
            <button
              type="button"
              onClick={() => setViewMode("edit")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-medium transition-all flex items-center gap-1.5 ${
                viewMode === "edit"
                  ? "bg-white text-black font-bold shadow-[0_4px_16px_rgba(255,255,255,0.25)]"
                  : "text-zinc-400 hover:text-white hover:bg-white/5"
              }`}
              title="Modo Foco em Escrita"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Editor</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("split")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-medium transition-all flex items-center gap-1.5 ${
                viewMode === "split"
                  ? "bg-white text-black font-bold shadow-[0_4px_16px_rgba(255,255,255,0.25)]"
                  : "text-zinc-400 hover:text-white hover:bg-white/5"
              }`}
              title="Modo Dividido Lado a Lado"
            >
              <Columns className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Lado a Lado</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("preview")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-medium transition-all flex items-center gap-1.5 ${
                viewMode === "preview"
                  ? "bg-white text-black font-bold shadow-[0_4px_16px_rgba(255,255,255,0.25)]"
                  : "text-zinc-400 hover:text-white hover:bg-white/5"
              }`}
              title="Pré-visualização Final do Leitor"
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Preview</span>
            </button>
          </div>

          {/* Lado Direito: Ações Globais */}
          <div className="flex items-center gap-2">
            {/* Toggle de Propriedades / Metadados */}
            <button
              type="button"
              onClick={() => setIsPropertiesOpen((prev) => !prev)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono border transition-all flex items-center gap-1.5 ${
                isPropertiesOpen
                  ? "bg-white/10 text-white border-white/20"
                  : "bg-white/[0.03] text-zinc-400 border-white/10 hover:text-white"
              }`}
              title={isPropertiesOpen ? "Ocultar Metadados (Modo Foco Zen)" : "Exibir Metadados"}
            >
              <Sliders className="w-3.5 h-3.5 text-[#ff073a]" />
              <span className="hidden md:inline">Metadados</span>
              {isPropertiesOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>

            {/* Alternar Tela Cheia Nativa */}
            <button
              type="button"
              onClick={toggleNativeFullscreen}
              className="w-9 h-9 rounded-xl bg-white/[0.04] hover:bg-white/10 border border-white/10 flex items-center justify-center text-zinc-300 hover:text-white transition-colors"
              title={isNativeFullscreen ? "Sair da Tela Cheia" : "Maximizar em Tela Cheia Nativa"}
            >
              {isNativeFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Botão de Salvar & Publicar com Alta Potência */}
            <Button
              variant="fired"
              size="sm"
              onClick={handleSavePost}
              disabled={isSaving}
              className="gap-2 text-xs font-mono font-bold shadow-[0_0_25px_rgba(255,7,58,0.45)] px-4"
            >
              {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>{isSaving ? "Salvando..." : "Salvar & Publicar"}</span>
              <kbd className="hidden lg:inline text-[9px] px-1 py-0.5 rounded bg-black/30 border border-white/20">
                ⌘S
              </kbd>
            </Button>

            {/* Fechar */}
            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-white/[0.04] hover:bg-red-500/20 hover:text-red-400 border border-white/10 flex items-center justify-center text-zinc-400 transition-colors ml-1"
              title="Fechar Editor (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* FEEDBACK DE STATUS COM AUTO-DISMISS */}
        {statusMsg && (
          <div
            className={`px-6 py-2.5 text-xs font-mono flex items-center justify-between border-b transition-all ${
              statusMsg.type === "success"
                ? "bg-emerald-950/40 text-emerald-300 border-emerald-800/40"
                : "bg-red-950/40 text-red-300 border-red-800/40"
            }`}
          >
            <div className="flex items-center gap-2">
              {statusMsg.type === "success" ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              )}
              <span>{statusMsg.text}</span>
            </div>
            <button
              onClick={() => setStatusMsg(null)}
              className="text-zinc-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* ========================================================================= */}
        {/* BARRA DE METADADOS RETRÁTIL (VIDRO CRISTALINO COM PRESETS DE CAPA) */}
        {/* ========================================================================= */}
        {isPropertiesOpen && (
          <div className="px-6 py-3 bg-white/[0.02] backdrop-blur-xl border-b border-white/10 shrink-0 transition-all">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              
              {/* 1. Categoria */}
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Tag className="w-3 h-3 text-[#ff073a]" />
                  <span>Categoria do Post</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#ff073a] transition-colors"
                >
                  <option value="INTELIGÊNCIA ARTIFICIAL">INTELIGÊNCIA ARTIFICIAL</option>
                  <option value="AUTOMAÇÃO & N8N">AUTOMAÇÃO & N8N</option>
                  <option value="FERRAMENTAS">FERRAMENTAS</option>
                  <option value="BUSINESS & GROWTH">BUSINESS & GROWTH</option>
                  <option value="LINUX & SERVIDORES">LINUX & SERVIDORES</option>
                  <option value="ENGENHARIA REVERSA">ENGENHARIA REVERSA</option>
                </select>
              </div>

              {/* 2. Capa Hero com Presets Rápidos */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                    <ImageIcon className="w-3 h-3 text-[#ff073a]" />
                    <span>Capa Hero</span>
                  </label>
                  <span className="text-[9px] font-mono text-zinc-500">Presets rápidos:</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={coverUrl}
                    onChange={(e) => setCoverUrl(e.target.value)}
                    placeholder="/assets/covers/ia_generativa.webp"
                    className="flex-1 bg-black/40 border border-white/15 rounded-xl px-3 py-1.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-[#ff073a] transition-colors font-mono"
                  />
                  {/* Seletor Rápido de Presets */}
                  <select
                    onChange={(e) => {
                      if (e.target.value) setCoverUrl(e.target.value);
                    }}
                    value=""
                    className="w-8 h-8 rounded-xl bg-white/[0.06] border border-white/15 text-zinc-300 text-xs text-center cursor-pointer hover:border-white/30"
                    title="Escolher capa pré-definida"
                  >
                    <option value="" disabled>🖼️</option>
                    {COVER_PRESETS.map((p) => (
                      <option key={p.url} value={p.url} className="bg-zinc-950 text-white">
                        {p.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 3. Slug Personalizado com Auto-Geração */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                    <FileText className="w-3 h-3 text-[#ff073a]" />
                    <span>Slug Personalizado</span>
                  </label>
                  <button
                    type="button"
                    onClick={generateSlugFromTitle}
                    className="text-[10px] font-mono text-[#ff073a] hover:underline flex items-center gap-1"
                    title="Auto-gerar slug a partir do título"
                  >
                    <Wand2 className="w-2.5 h-2.5" />
                    <span>Gerar</span>
                  </button>
                </div>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="auto-gerado-pelo-titulo"
                  className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-[#ff073a] transition-colors"
                />
              </div>

              {/* 4. Switch de Publicação & Leitura Estimada */}
              <div className="flex items-center justify-between gap-3 pt-4 sm:pt-3">
                <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-zinc-300">
                  <input
                    type="checkbox"
                    checked={isPublished}
                    onChange={(e) => setIsPublished(e.target.checked)}
                    className="rounded accent-red-600 w-4 h-4 cursor-pointer"
                  />
                  <span className="font-semibold text-white">Publicado no Portal</span>
                </label>

                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/[0.04] border border-white/10 text-[11px] font-mono text-zinc-300">
                  <Clock className="w-3 h-3 text-[#ff073a]" />
                  <span>{readingTime}</span>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TOOLBAR NOTION-LIKE & DIARY OS ENGINE */}
        {/* ========================================================================= */}
        <div className="flex flex-wrap items-center gap-1 px-5 py-2 bg-white/[0.02] backdrop-blur-xl border-b border-white/10 overflow-x-auto select-none shrink-0">
          
          {/* Títulos H1, H2, H3 */}
          <div className="flex items-center gap-0.5">
            <button
              type="button"
              onClick={() => insertTextAtCursor("\n# ", "\n", "Título H1 Principal")}
              className="px-2 py-1 rounded-lg text-xs font-mono font-bold text-zinc-300 hover:text-white hover:bg-white/10 transition-colors"
              title="Título 1 (H1)"
            >
              H1
            </button>
            <button
              type="button"
              onClick={() => insertTextAtCursor("\n## ", "\n", "Subtítulo H2")}
              className="px-2 py-1 rounded-lg text-xs font-mono font-bold text-zinc-300 hover:text-white hover:bg-white/10 transition-colors"
              title="Subtítulo 2 (H2)"
            >
              H2
            </button>
            <button
              type="button"
              onClick={() => insertTextAtCursor("\n### ", "\n", "Seção H3")}
              className="px-2 py-1 rounded-lg text-xs font-mono font-bold text-zinc-300 hover:text-white hover:bg-white/10 transition-colors"
              title="Seção 3 (H3)"
            >
              H3
            </button>
          </div>

          <span className="text-white/15 mx-1">|</span>

          {/* Formatação Básica (Bold, Italic, Code, Quote, Strike) */}
          <div className="flex items-center gap-0.5">
            <button
              type="button"
              onClick={() => insertTextAtCursor("**", "**", "texto em negrito")}
              className="px-2 py-1 rounded-lg text-xs font-bold text-zinc-300 hover:text-white hover:bg-white/10 transition-colors"
              title="Negrito (⌘B)"
            >
              B
            </button>
            <button
              type="button"
              onClick={() => insertTextAtCursor("*", "*", "texto itálico")}
              className="px-2 py-1 rounded-lg text-xs italic text-zinc-300 hover:text-white hover:bg-white/10 transition-colors"
              title="Itálico (⌘I)"
            >
              I
            </button>
            <button
              type="button"
              onClick={() => insertTextAtCursor("`", "`", "código")}
              className="px-2 py-1 rounded-lg text-xs font-mono text-zinc-300 hover:text-white hover:bg-white/10 transition-colors"
              title="Código Inline"
            >
              &lt;/&gt;
            </button>
            <button
              type="button"
              onClick={() => insertTextAtCursor("\n> ", "\n", "Citação e destaque de pensamento...")}
              className="px-2 py-1 rounded-lg text-xs font-mono text-zinc-300 hover:text-white hover:bg-white/10 transition-colors"
              title="Citação em Bloco"
            >
              &quot;Quote&quot;
            </button>
            <button
              type="button"
              onClick={() => insertTextAtCursor("\n```typescript\n", "\n```\n", "// Código Soberano")}
              className="px-2 py-1 rounded-lg text-xs font-mono text-zinc-300 hover:text-white hover:bg-white/10 transition-colors flex items-center gap-1"
              title="Bloco de Código"
            >
              <Code2 className="w-3 h-3 text-[#ff073a]" />
              <span className="hidden xl:inline">CodeBlock</span>
            </button>
          </div>

          <span className="text-white/15 mx-1">|</span>

          {/* Listas & Checklist */}
          <div className="flex items-center gap-0.5">
            <button
              type="button"
              onClick={() => insertTextAtCursor("\n- ", "\n", "Item com marcador")}
              className="p-1.5 rounded-lg text-zinc-300 hover:text-white hover:bg-white/10 transition-colors"
              title="Lista com Marcadores"
            >
              <List className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertTextAtCursor("\n1. ", "\n", "Item numerado")}
              className="p-1.5 rounded-lg text-zinc-300 hover:text-white hover:bg-white/10 transition-colors"
              title="Lista Numerada"
            >
              <ListOrdered className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertTextAtCursor("\n- [ ] ", "\n", "Tarefa pendente Notion")}
              className="p-1.5 rounded-lg text-zinc-300 hover:text-white hover:bg-white/10 transition-colors"
              title="Checklist Notion"
            >
              <CheckSquare className="w-3.5 h-3.5 text-emerald-400" />
            </button>
            <button
              type="button"
              onClick={() => insertTextAtCursor("\n---\n", "", "")}
              className="p-1.5 rounded-lg text-zinc-300 hover:text-white hover:bg-white/10 transition-colors"
              title="Divisor Horizontal"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
          </div>

          <span className="text-white/15 mx-1">|</span>

          {/* Inserções de Mídia e Conexões */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setMediaModalOpen(true)}
              className="px-2.5 py-1 rounded-xl text-xs font-mono font-semibold text-red-300 hover:text-white bg-red-950/40 hover:bg-red-950/70 border border-red-800/40 flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(255,7,58,0.2)]"
              title="Inserir Imagem, Vídeo Embed ou Galeria"
            >
              <ImageIcon className="w-3.5 h-3.5 text-[#ff073a]" />
              <span>+ Mídia</span>
            </button>

            <button
              type="button"
              onClick={() => setLinkModalOpen(true)}
              className="px-2.5 py-1 rounded-xl text-xs font-mono font-semibold text-blue-300 hover:text-white bg-blue-950/40 hover:bg-blue-950/70 border border-blue-800/40 flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(59,130,246,0.2)]"
              title="Inserir Link ou Bookmark Card Notion (⌘K)"
            >
              <LinkIcon className="w-3.5 h-3.5 text-blue-400" />
              <span>+ Link</span>
            </button>

            <button
              type="button"
              onClick={() => setCalloutModalOpen(true)}
              className="px-2.5 py-1 rounded-xl text-xs font-mono font-semibold text-amber-300 hover:text-white bg-amber-950/30 hover:bg-amber-950/60 border border-amber-800/40 flex items-center gap-1.5 transition-all"
              title="Criar Callout de Destaque Notion"
            >
              <span>💡</span>
              <span className="hidden md:inline">Callout</span>
            </button>

            <button
              type="button"
              onClick={() => insertTextAtCursor("\n:::toggle ⚡ Título do Acordeão\nConteúdo colapsável secreto ou passo avançado...\n:::\n", "", "")}
              className="px-2.5 py-1 rounded-xl text-xs font-mono font-semibold text-purple-300 hover:text-white bg-purple-950/30 hover:bg-purple-950/60 border border-purple-800/40 flex items-center gap-1.5 transition-all"
              title="Acordeão Colapsável Neon"
            >
              <span>⚡</span>
              <span className="hidden md:inline">Toggle</span>
            </button>

            <button
              type="button"
              onClick={() => insertTextAtCursor("\n:::columns-2\n### Coluna Esquerda\nConteúdo da primeira coluna...\n:::col\n### Coluna Direita\nConteúdo da segunda coluna...\n:::\n", "", "")}
              className="px-2.5 py-1 rounded-xl text-xs font-mono font-semibold text-emerald-300 hover:text-white bg-emerald-950/30 hover:bg-emerald-950/60 border border-emerald-800/40 flex items-center gap-1.5 transition-all"
              title="Estrutura de 2 Colunas Lado a Lado"
            >
              <span>🍱</span>
              <span className="hidden lg:inline">2 Colunas</span>
            </button>
          </div>

          {/* Templates Notions Rápidos */}
          <div className="ml-auto flex items-center gap-1">
            <span className="text-[10px] font-mono text-zinc-500 hidden xl:inline">Templates:</span>
            {NOTION_ARTICLE_TEMPLATES.map((tmpl) => (
              <button
                key={tmpl.id}
                type="button"
                onClick={() => {
                  if (confirm(`Substituir conteúdo atual pelo template Notion "${tmpl.name}"?`)) {
                    setContent(tmpl.content);
                  }
                }}
                className="px-2 py-0.5 rounded-lg text-[10px] font-mono text-zinc-400 hover:text-white bg-white/[0.04] hover:bg-white/10 border border-white/10 transition-colors"
                title={tmpl.description}
              >
                {tmpl.name.split("/")[0].trim()}
              </button>
            ))}
          </div>

        </div>

        {/* ========================================================================= */}
        {/* WORKSPACE PRINCIPAL (EDITOR LIVRE INFINITO / LIVE PREVIEW SOBERANO) */}
        {/* ========================================================================= */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* LADO ESQUERDO: EDITOR DE TEXTO LIVRE INFINITO */}
          {(viewMode === "edit" || viewMode === "split") && (
            <div
              className={`flex-1 flex flex-col p-6 sm:p-8 overflow-y-auto ${
                viewMode === "split"
                  ? "border-r border-white/10 md:w-1/2 bg-black/15"
                  : "w-full max-w-4xl mx-auto"
              }`}
            >
              {/* Título Estilo Notion Imersivo */}
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Título do Artigo Soberano..."
                className="w-full bg-transparent text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight focus:outline-none placeholder-zinc-600 border-b border-transparent focus:border-white/20 pb-3 mb-4 transition"
              />

              {/* Resumo ou Subtítulo Lead */}
              <textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Resumo ou subtítulo do post para SEO, cards do portal e meta tags..."
                rows={2}
                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl p-4 text-xs sm:text-sm text-zinc-200 focus:outline-none focus:border-[#ff073a]/50 mb-5 resize-none placeholder-zinc-500 shadow-inner"
              />

              {/* Área de Escrita Livre Markdown Notion */}
              <textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onKeyDown={(e) => {
                  // Indentação suave com 2 espaços ao pressionar Tab
                  if (e.key === "Tab") {
                    e.preventDefault();
                    insertTextAtCursor("  ", "", "");
                  }
                }}
                placeholder="Comece a redigir seu artigo livremente ou use a barra de ferramentas Notion acima..."
                className="flex-1 w-full bg-transparent text-sm sm:text-base font-mono text-zinc-100 focus:outline-none placeholder-zinc-700 resize-none leading-relaxed min-h-[450px]"
              />
            </div>
          )}

          {/* LADO DIREITO: PREVIEW EM TEMPO REAL RENDERIZADO */}
          {(viewMode === "preview" || viewMode === "split") && (
            <div
              className={`flex-1 p-6 sm:p-10 overflow-y-auto ${
                viewMode === "split" ? "md:w-1/2 bg-black/30" : "w-full max-w-4xl mx-auto"
              }`}
            >
              <div className="max-w-3xl mx-auto space-y-6">
                
                {/* Banner de Capa Hero com Tratamento de Fallback Elegante */}
                <div className="relative aspect-[21/9] w-full rounded-3xl overflow-hidden border border-white/15 bg-black/60 shadow-[0_15px_45px_rgba(0,0,0,0.8)]">
                  {!coverImageError && coverUrl ? (
                    <img
                      src={coverUrl}
                      alt={title || "Capa do Artigo"}
                      onError={() => setCoverImageError(true)}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    // Fallback Cinematográfico caso a imagem não exista ou falhe
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#1c0208] via-[#0d0710] to-[#050508] p-6 text-center">
                      <div className="w-14 h-14 rounded-2xl bg-[#ff073a]/15 border border-[#ff073a]/40 flex items-center justify-center text-[#ff073a] shadow-[0_0_25px_rgba(255,7,58,0.35)] mb-2">
                        <ImageIcon className="w-7 h-7" />
                      </div>
                      <span className="text-xs font-mono text-zinc-400 font-bold uppercase tracking-widest">
                        Capa Hero do Portal Soberano
                      </span>
                      <span className="text-[10px] font-mono text-zinc-600 mt-0.5">
                        {coverUrl || "Nenhuma URL configurada"}
                      </span>
                    </div>
                  )}
                  {/* Gradiente de Fusão */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />
                </div>

                {/* Badge da Categoria e Tempo de Leitura */}
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-xl glass-pill-red text-xs font-mono text-[#ff073a] font-bold uppercase tracking-wider">
                    {category}
                  </span>
                  <span className="text-xs font-mono text-zinc-400 flex items-center gap-1">
                    <span>•</span>
                    <Clock className="w-3 h-3 text-[#ff073a]" />
                    <span>{readingTime}</span>
                  </span>
                </div>

                {/* Título Renderizado */}
                <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                  {title || "Sem Título Definido"}
                </h1>

                {/* Resumo Renderizado */}
                {summary && (
                  <p className="text-sm sm:text-base text-zinc-300 italic border-l-2 border-[#ff073a] pl-4 py-1 leading-relaxed">
                    {summary}
                  </p>
                )}

                <div className="border-t border-white/10 pt-4" />

                {/* Conteúdo com Blocos Notion (Callout, Toggle, Columns, Embed, Code) */}
                <div
                  className="prose-soberana space-y-4 text-zinc-200 text-sm sm:text-base leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: parseNotionMarkdown(content) }}
                />

              </div>
            </div>
          )}

        </div>

        {/* ========================================================================= */}
        {/* RODAPÉ DE TELEMETRIA E DICAS DE PRODUTIVIDADE */}
        {/* ========================================================================= */}
        <footer className="px-6 py-2.5 bg-white/[0.03] backdrop-blur-2xl border-t border-white/10 flex flex-wrap items-center justify-between text-[11px] font-mono text-zinc-400 shrink-0">
          <div className="flex items-center gap-4">
            <span className="text-white font-bold">{wordCount} palavras</span>
            <span>•</span>
            <span>{charCount} caracteres</span>
            <span>•</span>
            <span>{lineCount} linhas</span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${isPublished ? "bg-emerald-400" : "bg-amber-400"}`} />
              <span>Status: {isPublished ? "Público no Portal" : "Rascunho Privado"}</span>
            </span>
          </div>

          <div className="flex items-center gap-4 text-zinc-500 hidden sm:flex">
            <span>Atalhos: ⌘S (Salvar) • ⌘B (Negrito) • ⌘I (Itálico) • ⌘K (Link) • Tab (Espaço)</span>
          </div>
        </footer>

        {/* ========================================================================= */}
        {/* MODAL DE INSERÇÃO DE MÍDIA (IMAGEM / VÍDEO EMBED / GALERIA) */}
        {/* ========================================================================= */}
        {mediaModalOpen && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
            <div className="max-w-md w-full glass-ultra-clear border border-white/20 rounded-3xl p-6 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-[#ff073a]" />
                  <span>Adicionar Mídia ao Artigo</span>
                </h4>
                <button
                  type="button"
                  onClick={() => setMediaModalOpen(false)}
                  className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-zinc-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Seletor de Tipo de Mídia */}
              <div className="flex rounded-2xl bg-white/[0.05] p-1 text-xs border border-white/10">
                <button
                  type="button"
                  onClick={() => setMediaType("image")}
                  className={`flex-1 py-1.5 rounded-xl text-center font-mono font-medium transition-all ${
                    mediaType === "image" ? "bg-white text-black font-bold shadow" : "text-zinc-400 hover:text-white"
                  }`}
                >
                  Imagem
                </button>
                <button
                  type="button"
                  onClick={() => setMediaType("video")}
                  className={`flex-1 py-1.5 rounded-xl text-center font-mono font-medium transition-all ${
                    mediaType === "video" ? "bg-white text-black font-bold shadow" : "text-zinc-400 hover:text-white"
                  }`}
                >
                  Vídeo Embed
                </button>
                <button
                  type="button"
                  onClick={() => setMediaType("gallery")}
                  className={`flex-1 py-1.5 rounded-xl text-center font-mono font-medium transition-all ${
                    mediaType === "gallery" ? "bg-white text-black font-bold shadow" : "text-zinc-400 hover:text-white"
                  }`}
                >
                  Galeria
                </button>
              </div>

              <div>
                <label className="text-[11px] font-mono text-zinc-400 block mb-1">
                  {mediaType === "video"
                    ? "URL do Vídeo (YouTube, Vimeo ou link MP4)"
                    : mediaType === "gallery"
                    ? "URLs das Imagens (uma por linha)"
                    : "URL da Imagem (HTTPS ou /assets/...)"}
                </label>
                {mediaType === "gallery" ? (
                  <textarea
                    value={mediaUrl}
                    onChange={(e) => setMediaUrl(e.target.value)}
                    placeholder="https://...img1.webp&#10;https://...img2.webp"
                    rows={3}
                    className="w-full bg-black/60 border border-white/15 rounded-xl p-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-[#ff073a]"
                  />
                ) : (
                  <input
                    type="text"
                    value={mediaUrl}
                    onChange={(e) => setMediaUrl(e.target.value)}
                    placeholder={
                      mediaType === "video"
                        ? "https://www.youtube.com/watch?v=..."
                        : "/assets/covers/ia_generativa.webp"
                    }
                    className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-[#ff073a]"
                  />
                )}
              </div>

              {mediaType === "image" && (
                <div>
                  <label className="text-[11px] font-mono text-zinc-400 block mb-1">
                    Legenda da Imagem (Opcional)
                  </label>
                  <input
                    type="text"
                    value={mediaCaption}
                    onChange={(e) => setMediaCaption(e.target.value)}
                    placeholder="Ex: Arquitetura de Nós no n8n"
                    className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-[#ff073a]"
                  />
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setMediaModalOpen(false)}
                >
                  Cancelar
                </Button>
                <Button
                  variant="fired"
                  size="sm"
                  onClick={handleInsertMedia}
                  disabled={!mediaUrl.trim()}
                >
                  Inserir no Post
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL DE INSERÇÃO DE LINK & BOOKMARK CARD */}
        {/* ========================================================================= */}
        {linkModalOpen && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
            <div className="max-w-md w-full glass-ultra-clear border border-white/20 rounded-3xl p-6 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <LinkIcon className="w-4 h-4 text-blue-400" />
                  <span>Adicionar Link ao Artigo</span>
                </h4>
                <button
                  type="button"
                  onClick={() => setLinkModalOpen(false)}
                  className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-zinc-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div>
                <label className="text-[11px] font-mono text-zinc-400 block mb-1">
                  Texto do Link / Título do Recurso
                </label>
                <input
                  type="text"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  placeholder="Ex: Documentação Oficial ou Portal Soberano"
                  className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-zinc-400 block mb-1">
                  URL de Destino
                </label>
                <input
                  type="text"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://exemplo.com ou /comunidade"
                  className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={isBookmarkCard}
                  onChange={(e) => setIsBookmarkCard(e.target.checked)}
                  className="rounded accent-blue-600 w-4 h-4"
                />
                <span className="font-medium">Renderizar como Bookmark Card Notion-Like</span>
              </label>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setLinkModalOpen(false)}
                >
                  Cancelar
                </Button>
                <Button
                  variant="fired"
                  size="sm"
                  onClick={handleInsertLink}
                  disabled={!linkUrl.trim()}
                >
                  Inserir Link
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL DE INSERÇÃO DE CALLOUT NOTION */}
        {/* ========================================================================= */}
        {calloutModalOpen && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
            <div className="max-w-md w-full glass-ultra-clear border border-white/20 rounded-3xl p-6 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Inserir Callout Notion</span>
                </h4>
                <button
                  type="button"
                  onClick={() => setCalloutModalOpen(false)}
                  className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-zinc-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Tipo de Callout */}
              <div className="grid grid-cols-4 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setCalloutType("info")}
                  className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                    calloutType === "info"
                      ? "bg-blue-950/50 border-blue-500 text-blue-300"
                      : "bg-white/[0.04] border-white/10 text-zinc-400"
                  }`}
                >
                  <Info className="w-4 h-4 text-blue-400" />
                  <span className="text-[10px]">Info</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCalloutType("warning")}
                  className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                    calloutType === "warning"
                      ? "bg-amber-950/50 border-amber-500 text-amber-300"
                      : "bg-white/[0.04] border-white/10 text-zinc-400"
                  }`}
                >
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span className="text-[10px]">Aviso</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCalloutType("danger")}
                  className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                    calloutType === "danger"
                      ? "bg-red-950/50 border-red-500 text-red-300"
                      : "bg-white/[0.04] border-white/10 text-zinc-400"
                  }`}
                >
                  <ShieldAlert className="w-4 h-4 text-red-400" />
                  <span className="text-[10px]">Perigo</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCalloutType("success")}
                  className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                    calloutType === "success"
                      ? "bg-emerald-950/50 border-emerald-500 text-emerald-300"
                      : "bg-white/[0.04] border-white/10 text-zinc-400"
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="text-[10px]">Sucesso</span>
                </button>
              </div>

              <div>
                <label className="text-[11px] font-mono text-zinc-400 block mb-1">
                  Título do Destaque
                </label>
                <input
                  type="text"
                  value={calloutTitle}
                  onChange={(e) => setCalloutTitle(e.target.value)}
                  placeholder="Ex: Insight Fundamental"
                  className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-zinc-400 block mb-1">
                  Texto do Conteúdo
                </label>
                <textarea
                  value={calloutBody}
                  onChange={(e) => setCalloutBody(e.target.value)}
                  rows={3}
                  placeholder="Descreva a informação ou ponto chave..."
                  className="w-full bg-black/60 border border-white/15 rounded-xl p-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setCalloutModalOpen(false)}
                >
                  Cancelar
                </Button>
                <Button
                  variant="fired"
                  size="sm"
                  onClick={handleInsertCallout}
                >
                  Inserir Callout
                </Button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default PostEditorModal;
