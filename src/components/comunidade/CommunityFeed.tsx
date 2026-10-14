'use client';

import React, { useState } from 'react';
import {
  MessageSquare,
  Heart,
  Share2,
  Sparkles,
  Send,
  Pin,
  Copy,
  Check,
  UserCheck,
  Code2,
  Filter,
} from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';

export interface PostComment {
  id: string;
  authorName: string;
  authorTier: 'free' | 'pro' | 'vip';
  content: string;
  createdAt: string;
}

export interface CommunityPost {
  id: string;
  authorName: string;
  authorAvatar?: string;
  authorRole: string;
  authorTier: 'free' | 'pro' | 'vip';
  category: 'Comunicado Oficial' | 'Trilhas & Prompts' | 'Networking' | 'Showcase';
  content: string;
  promptSnippet?: string;
  isPinned?: boolean;
  likesCount: number;
  isLiked?: boolean;
  comments: PostComment[];
  tags: string[];
  createdAt: string;
}

const INITIAL_POSTS: CommunityPost[] = [
  {
    id: 'post_1',
    authorName: 'Mateus Celestino Pro',
    authorRole: 'Founder & Visionary Architect',
    authorTier: 'vip',
    category: 'Comunicado Oficial',
    isPinned: true,
    content:
      '🚀 Sejam bem-vindos à Área de Membros Soberana! O motor visual e a camada unificada de dados em PostgreSQL já estão em plena operação. Disponibilizamos hoje a nova masterclass com o pipeline completo de Midjourney v6 + Kling para vídeos hiper-realistas.',
    promptSnippet:
      'cinematic film still, high-contrast chiaroscuro lighting, anamorphic 35mm lens, atmospheric haze, deep crimson shadows, hyper-realistic skin texture, 8k resolution, shot on Arri Alexa 65 --ar 16:9 --style raw',
    likesCount: 142,
    isLiked: false,
    tags: ['Oficial', 'Masterclass', 'Kling', 'Midjourney'],
    createdAt: 'Há 2 horas',
    comments: [
      {
        id: 'c1',
        authorName: 'Lucas Albuquerque',
        authorTier: 'vip',
        content: 'Sensacional Mateus! A fidelidade dos shaders na plataforma nova ficou impecável.',
        createdAt: 'Há 1 hora',
      },
      {
        id: 'c2',
        authorName: 'Camila Drummond',
        authorTier: 'pro',
        content: 'O prompt anamórfico testado aqui no Midjourney deu uma profundidade absurda!',
        createdAt: 'Há 45 minutos',
      },
    ],
  },
  {
    id: 'post_2',
    authorName: 'Gabriel Siqueira',
    authorRole: 'AI Motion Designer',
    authorTier: 'pro',
    category: 'Trilhas & Prompts',
    content:
      'Compartilhando com vocês a fórmula de câmera lenta e renderização líquida que usei no teaser de lançamento da marca:',
    promptSnippet:
      'liquid obsidian and red laser refractive particles colliding in zero gravity, ray tracing, macro lens, glassmorphism caustics, ultra high-speed camera 1000fps, photorealistic render in Octane --v 6.0',
    likesCount: 58,
    isLiked: false,
    tags: ['Motion', 'Octane', 'PromptShare'],
    createdAt: 'Há 4 horas',
    comments: [
      {
        id: 'c3',
        authorName: 'Rodrigo Fontes',
        authorTier: 'vip',
        content: 'Muito bom! Vou aplicar no nosso próximo comercial.',
        createdAt: 'Há 2 horas',
      },
    ],
  },
  {
    id: 'post_3',
    authorName: 'Ana Beatriz Mendes',
    authorRole: 'Creative Director',
    authorTier: 'vip',
    category: 'Showcase',
    content:
      'Acabei de fechar um contrato internacional de branding e usei os presets de vidros cinemáticos e cards interativos que aprendemos aqui na comunidade. A percepção de valor dos gringos explodiu!',
    likesCount: 89,
    isLiked: false,
    tags: ['Showcase', 'Cases', 'BrandingSoberano'],
    createdAt: 'Há 7 horas',
    comments: [],
  },
];

export function CommunityFeed() {
  const [posts, setPosts] = useState<CommunityPost[]>(INITIAL_POSTS);
  const [selectedFilter, setSelectedFilter] = useState<string>('Todos');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostCategory, setNewPostCategory] = useState<CommunityPost['category']>('Trilhas & Prompts');
  const [newPostPrompt, setNewPostPrompt] = useState('');
  const [showPromptInput, setShowPromptInput] = useState(false);
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');
  const [copiedSnippetId, setCopiedSnippetId] = useState<string | null>(null);

  const filterOptions = [
    'Todos',
    'Comunicado Oficial',
    'Trilhas & Prompts',
    'Networking',
    'Showcase',
  ];

  const handleLike = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const isLiked = !p.isLiked;
          return {
            ...p,
            isLiked,
            likesCount: isLiked ? p.likesCount + 1 : p.likesCount - 1,
          };
        }
        return p;
      })
    );
  };

  const handleCopyPrompt = (postId: string, text: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedSnippetId(postId);
      setTimeout(() => setCopiedSnippetId(null), 2000);
    }
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;

    const newPost: CommunityPost = {
      id: `post_${Date.now()}`,
      authorName: 'Você (Membro Soberano)',
      authorRole: 'Membro Ativo',
      authorTier: 'vip',
      category: newPostCategory,
      content: newPostContent.trim(),
      promptSnippet: showPromptInput && newPostPrompt.trim() ? newPostPrompt.trim() : undefined,
      likesCount: 0,
      isLiked: false,
      tags: [newPostCategory.replace(/\s+/g, '')],
      createdAt: 'Agora mesmo',
      comments: [],
    };

    setPosts([newPost, ...posts]);
    setNewPostContent('');
    setNewPostPrompt('');
    setShowPromptInput(false);
  };

  const handleAddComment = (postId: string) => {
    if (!commentText.trim()) return;

    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            comments: [
              ...p.comments,
              {
                id: `c_${Date.now()}`,
                authorName: 'Você',
                authorTier: 'vip',
                content: commentText.trim(),
                createdAt: 'Agora mesmo',
              },
            ],
          };
        }
        return p;
      })
    );

    setCommentText('');
  };

  const filteredPosts = posts.filter((post) => {
    if (selectedFilter === 'Todos') return true;
    return post.category === selectedFilter;
  });

  return (
    <div className="space-y-6">
      {/* Box de Publicação para Membros */}
      <GlassCard className="p-5 md:p-6">
        <form onSubmit={handleCreatePost} className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-red-500/20 text-xs font-bold text-red-400">
                AI
              </span>
              <span className="text-sm font-semibold text-white">Criar Publicação ou Compartilhar Prompt</span>
            </div>
            <select
              value={newPostCategory}
              onChange={(e) => setNewPostCategory(e.target.value as CommunityPost['category'])}
              className="rounded-xl border border-white/10 bg-neutral-900/80 px-3 py-1.5 text-xs text-neutral-300 focus:border-red-500 focus:outline-none"
            >
              <option value="Trilhas & Prompts">Trilhas & Prompts</option>
              <option value="Networking">Networking</option>
              <option value="Showcase">Showcase</option>
            </select>
          </div>

          <textarea
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
            placeholder="Compartilhe suas descobertas, workflows com shaders ou dúvidas com os outros membros..."
            rows={3}
            className="w-full resize-none rounded-xl border border-white/10 bg-black/40 p-3.5 text-sm text-white placeholder-neutral-500 focus:border-white/30 focus:outline-none"
          />

          {showPromptInput && (
            <div className="relative rounded-xl border border-red-500/30 bg-black/60 p-3">
              <div className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-red-400">
                <Code2 className="h-3.5 w-3.5" />
                Snippet de Prompt / Código Executável:
              </div>
              <textarea
                value={newPostPrompt}
                onChange={(e) => setNewPostPrompt(e.target.value)}
                placeholder="Insira o prompt de IA ou parâmetros técnicos..."
                rows={2}
                className="w-full resize-none border-0 bg-transparent font-mono text-xs text-neutral-200 placeholder-neutral-600 focus:outline-none"
              />
            </div>
          )}

          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={() => setShowPromptInput(!showPromptInput)}
              className={cn(
                'flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all',
                showPromptInput
                  ? 'border-red-500/50 bg-red-500/10 text-red-400'
                  : 'border-white/10 bg-white/5 text-neutral-400 hover:border-white/20 hover:text-white'
              )}
            >
              <Code2 className="h-3.5 w-3.5" />
              {showPromptInput ? 'Remover Prompt' : 'Anexar Prompt de IA'}
            </button>

            <Button type="submit" variant="fired" size="sm" className="gap-1.5">
              <Send className="h-3.5 w-3.5" />
              Publicar no Feed
            </Button>
          </div>
        </form>
      </GlassCard>

      {/* Barra de Filtros */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <Filter className="h-4 w-4 text-neutral-500 shrink-0 ml-1 mr-1" />
        {filterOptions.map((filter) => (
          <button
            key={filter}
            onClick={() => setSelectedFilter(filter)}
            className={cn(
              'rounded-full px-3.5 py-1.5 text-xs font-medium tracking-wide whitespace-nowrap transition-all',
              selectedFilter === filter
                ? 'border border-red-500/50 bg-red-500/15 text-red-400 shadow-[0_0_15px_rgba(255,7,58,0.2)]'
                : 'border border-white/5 bg-white/[0.03] text-neutral-400 hover:border-white/15 hover:text-white'
            )}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Lista de Publicações */}
      <div className="space-y-4">
        {filteredPosts.map((post) => (
          <GlassCard
            key={post.id}
            className={cn(
              'p-5 md:p-6 transition-all duration-200 hover:border-white/15',
              post.isPinned && 'border-red-500/30 bg-gradient-to-b from-red-950/10 to-transparent'
            )}
          >
            {/* Header da Postagem */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-gradient-to-tr from-neutral-800 to-neutral-700 text-sm font-bold text-white shadow-md">
                  {post.authorName.charAt(0)}
                  {post.authorTier === 'vip' && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[9px] font-black text-white shadow-[0_0_8px_#ff073a]">
                      ★
                    </span>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">{post.authorName}</span>
                    <Badge
                      variant={post.authorTier === 'vip' ? 'red' : 'gold'}
                      className="text-[0.65rem] px-2 py-0"
                    >
                      {post.authorTier.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-neutral-400">
                    <span>{post.authorRole}</span>
                    <span>•</span>
                    <span>{post.createdAt}</span>
                  </div>
                </div>
              </div>

              {post.isPinned && (
                <div className="flex items-center gap-1 rounded-full border border-red-500/30 bg-red-500/10 px-2.5 py-0.5 text-[0.65rem] font-semibold text-red-400">
                  <Pin className="h-3 w-3" />
                  Fixado
                </div>
              )}
            </div>

            {/* Conteúdo textual */}
            <div className="mt-4 text-sm leading-relaxed text-neutral-200">
              {post.content}
            </div>

            {/* Snippet de Prompt com botão de cópia */}
            {post.promptSnippet && (
              <div className="group relative mt-3 rounded-xl border border-white/10 bg-black/60 p-3.5 backdrop-blur-md">
                <div className="mb-1 flex items-center justify-between text-xs text-neutral-400">
                  <span className="flex items-center gap-1 font-mono text-[0.7rem] text-red-400">
                    <Sparkles className="h-3 w-3" />
                    PROMPT EXCLUSIVO
                  </span>
                  <button
                    onClick={() => handleCopyPrompt(post.id, post.promptSnippet!)}
                    className="flex items-center gap-1 rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[0.7rem] text-neutral-300 transition-all hover:bg-white/10 hover:text-white"
                  >
                    {copiedSnippetId === post.id ? (
                      <>
                        <Check className="h-3 w-3 text-emerald-400" />
                        <span className="text-emerald-400 font-semibold">Copiado</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        <span>Copiar Prompt</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="overflow-x-auto font-mono text-xs text-neutral-300 whitespace-pre-wrap selection:bg-red-500/30">
                  {post.promptSnippet}
                </pre>
              </div>
            )}

            {/* Tags da Postagem */}
            {post.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {post.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-md border border-white/5 bg-white/[0.02] px-2 py-0.5 text-[0.65rem] text-neutral-400"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            )}

            {/* Ações (Curtir, Comentar, Compartilhar) */}
            <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleLike(post.id)}
                  className={cn(
                    'flex items-center gap-1.5 text-xs font-medium transition-all',
                    post.isLiked
                      ? 'text-red-500'
                      : 'text-neutral-400 hover:text-red-400'
                  )}
                >
                  <Heart
                    className={cn('h-4 w-4', post.isLiked && 'fill-current text-red-500')}
                  />
                  <span>{post.likesCount}</span>
                </button>

                <button
                  onClick={() =>
                    setActiveCommentPostId(activeCommentPostId === post.id ? null : post.id)
                  }
                  className="flex items-center gap-1.5 text-xs font-medium text-neutral-400 transition-all hover:text-white"
                >
                  <MessageSquare className="h-4 w-4" />
                  <span>{post.comments.length}</span>
                </button>
              </div>

              <button
                onClick={() => handleCopyPrompt(post.id, post.content)}
                className="flex items-center gap-1.5 text-xs font-medium text-neutral-400 transition-all hover:text-white"
              >
                <Share2 className="h-4 w-4" />
                <span className="hidden sm:inline">Compartilhar</span>
              </button>
            </div>

            {/* Seção Expansível de Comentários */}
            {activeCommentPostId === post.id && (
              <div className="mt-4 space-y-3 rounded-xl border border-white/5 bg-black/40 p-4">
                {post.comments.length > 0 ? (
                  <div className="space-y-2.5">
                    {post.comments.map((c) => (
                      <div key={c.id} className="rounded-lg border border-white/5 bg-neutral-900/60 p-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white">{c.authorName}</span>
                          <span className="text-[0.65rem] text-neutral-500">{c.createdAt}</span>
                        </div>
                        <p className="mt-1 text-xs text-neutral-300 leading-relaxed">{c.content}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-neutral-500 text-center py-2">
                    Nenhum comentário ainda. Seja o primeiro a responder!
                  </p>
                )}

                <div className="flex gap-2 pt-2">
                  <input
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Escreva sua resposta para os membros..."
                    className="flex-1 rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-xs text-white placeholder-neutral-500 focus:border-red-500 focus:outline-none"
                    onKeyDown={(e) => e.key === 'Enter' && handleAddComment(post.id)}
                  />
                  <Button
                    onClick={() => handleAddComment(post.id)}
                    variant="fired"
                    size="sm"
                    className="text-xs px-3"
                  >
                    Enviar
                  </Button>
                </div>
              </div>
            )}
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
