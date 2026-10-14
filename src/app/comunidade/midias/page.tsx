'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Film,
  Play,
  Sparkles,
  Search,
  Filter,
  Eye,
  Clock,
  ArrowLeft,
  Download,
  Share2,
  CheckCircle2,
  Layers,
} from 'lucide-react';
import { VideoPlayer } from '@/components/comunidade/VideoPlayer';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface MediaItem {
  id: string;
  title: string;
  description: string;
  category: 'Masterclasses 4K' | 'Shaders & Vidro' | 'Prompts & Kling' | 'Workflows Pro';
  src: string;
  duration: string;
  views: number;
  promptExample: string;
  tags: string[];
}

const MEDIA_CATALOG: MediaItem[] = [
  {
    id: 'vid_1',
    title: 'Masterclass: Renderização Hiper-Realista em 4K e Shaders Cinemáticos',
    description:
      'Aprenda o workflow completo de pós-produção audiovisual utilizando WebGL, iluminação caustica e partículas de vidro líquido aplicadas a branding de software.',
    category: 'Masterclasses 4K',
    src: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260506_031045_0e1165dd-ab48-46e3-ad3d-5fe77f217647.mp4',
    duration: '18:42',
    views: 1420,
    promptExample:
      'ultra-cinematic dark obsidian refractive fluid with neon crimson fiber-optic threads weaving through zero-gravity, volumetric fog, octane render, 8k',
    tags: ['Masterclass', '4K', 'Obsidian', 'Shaders'],
  },
  {
    id: 'vid_2',
    title: 'Apple Liquid Glass: Engenharia de Vidro e Caustics em Tempo Real',
    description:
      'Desmistificando a física óptica do design VisionOS e como atingir 60 FPS estáveis com OGL e Three.js sem penalizar a bateria do dispositivo.',
    category: 'Shaders & Vidro',
    src: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_171521_25968ba2-b594-4b32-aab7-f6b69398a6fa.mp4',
    duration: '12:15',
    views: 980,
    promptExample:
      'frosted glass refractive prism dispersing iridescent spectrum, Apple visionOS interface aesthetic, clean titanium chassis, studio lighting',
    tags: ['LiquidGlass', 'VisionOS', 'ThreeJS'],
  },
  {
    id: 'vid_3',
    title: 'Kling & Midjourney: Geração de Vídeos Cinemáticos Anamórficos',
    description:
      'Estruturação de prompts negativos e positivos para eliminação de artefatos de IA, consistência de personagens e movimentos fluidos de câmera de cinema.',
    category: 'Prompts & Kling',
    src: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260429_115139_0fc6bd3d-3631-4d26-ab9b-28293887dcc9.mp4',
    duration: '24:50',
    views: 2130,
    promptExample:
      '35mm anamorphic film still, subtle chromatic aberration, cinematic lens flare, high contrast noir palette, authentic film grain --ar 2.39:1',
    tags: ['KlingAI', 'Anamorphic', 'Cinematic'],
  },
  {
    id: 'vid_4',
    title: 'Eldritch VFX: Fotografia de Criaturas e Atmosferas Nebulosas',
    description:
      'Técnicas de iluminação direcional e densidade volumétrica de neblina para criar tensão visual de alto impacto em anúncios de branding e entretenimento.',
    category: 'Workflows Pro',
    src: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260411_104032_69319010-2458-492b-b04d-b40a5dfa4482.mp4',
    duration: '15:30',
    views: 870,
    promptExample:
      'towering monolithic creature in dense greenish coastal fog, lone road illuminated by sodium vapor streetlights, cosmic scale tension, 4k ultra realistic',
    tags: ['VFX', 'Atmosphere', 'Monolith'],
  },
  {
    id: 'vid_5',
    title: 'Cosmic Shaders & Galáxias Interativas para WebGL',
    description:
      'Construção passo a passo do componente Galaxy com shaders GLSL customizados para backgrounds de altíssima fidelidade e zero overhead de CPU.',
    category: 'Shaders & Vidro',
    src: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260403_050628_c4e32401-fab4-4a27-b7a8-6e9291cd5959.mp4',
    duration: '21:05',
    views: 1650,
    promptExample:
      'spinning spiral galaxy core, deep space nebula clouds with violet and cyan plasma filaments, millions of twinkling star particles, 8k deep field',
    tags: ['Galaxy', 'GLSL', 'WebGL'],
  },
  {
    id: 'vid_6',
    title: 'Retro Sci-Fi & Holographic HUDs: O Futuro da Computação Espacial',
    description:
      'Composição de interfaces holográficas flutuantes, tipografia futurista retrofuturista e renderização em camadas com blending modes no Three.js.',
    category: 'Workflows Pro',
    src: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260324_151826_c7218672-6e92-402c-9e45-f1e0f454bdc4.mp4',
    duration: '14:18',
    views: 1120,
    promptExample:
      'futuristic transparent glass terminal display, wireframe 3D holograms, amber phosphor glow, sci-fi spacecraft bridge aesthetic, highly detailed UI',
    tags: ['SciFi', 'HUD', 'SpatialUI'],
  },
];

export default function MidiasPage() {
  const [selectedVideo, setSelectedVideo] = useState<MediaItem>(MEDIA_CATALOG[0]);
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  const categories = [
    'Todos',
    'Masterclasses 4K',
    'Shaders & Vidro',
    'Prompts & Kling',
    'Workflows Pro',
  ];

  const filteredMedia = MEDIA_CATALOG.filter((item) => {
    const matchesCategory =
      selectedCategory === 'Todos' || item.category === selectedCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCopyPrompt = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(selectedVideo.promptExample);
      setCopiedPrompt(true);
      setTimeout(() => setCopiedPrompt(false), 2000);
    }
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      {/* Top Header & Navigation */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <Link
            href="/comunidade"
            className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors mb-2"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Voltar ao Dashboard da Comunidade</span>
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              Catálogo Cinemático de Mídias & Vídeos 4K
            </h1>
            <Badge variant="red" dot>
              UHD 60FPS
            </Badge>
          </div>
          <p className="text-xs md:text-sm text-neutral-400 mt-1">
            Mídias originais, masterclasses e templates audiovisuais gravados em altíssima definição.
          </p>
        </div>
      </div>

      {/* Featured Video Player Showcase */}
      <div className="space-y-4">
        <VideoPlayer
          src={selectedVideo.src}
          title={selectedVideo.title}
          description={selectedVideo.description}
          category={selectedVideo.category}
          autoPlay={false}
        />

        {/* Technical Prompt Card for Featured Video */}
        <GlassCard className="p-5 md:p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <span className="text-xs font-mono text-red-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5" />
                Workflow & Prompt Utilizado nesta Produção
              </span>
              <p className="mt-1 font-mono text-xs text-neutral-300 leading-relaxed bg-black/50 p-3 rounded-xl border border-white/5 select-all">
                {selectedVideo.promptExample}
              </p>
            </div>

            <Button
              onClick={handleCopyPrompt}
              variant="fired"
              size="sm"
              className="text-xs shrink-0 self-start md:self-center"
            >
              {copiedPrompt ? (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 mr-1.5" />
                  Copiado com Sucesso!
                </>
              ) : (
                <>
                  <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                  Copiar Prompt do Vídeo
                </>
              )}
            </Button>
          </div>
        </GlassCard>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 border-t border-white/5 pt-6">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <Filter className="h-4 w-4 text-neutral-500 shrink-0 mr-1" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                'rounded-full px-4 py-2 text-xs font-semibold whitespace-nowrap transition-all',
                selectedCategory === cat
                  ? 'border border-red-500/50 bg-red-500/15 text-red-400 shadow-[0_0_15px_rgba(255,7,58,0.2)]'
                  : 'border border-white/5 bg-white/[0.03] text-neutral-400 hover:border-white/15 hover:text-white'
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
          <input
            type="text"
            placeholder="Pesquisar por título ou tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-black/50 pl-10 pr-4 py-2 text-xs text-white placeholder-neutral-500 focus:border-red-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Grid of Media Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMedia.map((media) => {
          const isCurrent = selectedVideo.id === media.id;
          return (
            <div
              key={media.id}
              onClick={() => {
                setSelectedVideo(media);
                window.scrollTo({ top: 120, behavior: 'smooth' });
              }}
              className={cn(
                'cursor-pointer group relative rounded-2xl border bg-neutral-900/40 p-4 transition-all duration-300 hover:-translate-y-1 backdrop-blur-md',
                isCurrent
                  ? 'border-red-500 shadow-[0_0_30px_rgba(255,7,58,0.25)] bg-red-950/10'
                  : 'border-white/10 hover:border-white/20 hover:bg-neutral-900/60'
              )}
            >
              {/* Media Thumbnail Container with Video preview */}
              <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black">
                <video
                  src={media.src}
                  muted
                  playsInline
                  preload="metadata"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                />

                {/* Duration Badge */}
                <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1 rounded-md bg-black/80 px-2 py-0.5 text-[0.65rem] font-mono font-bold text-white backdrop-blur-md">
                  <Clock className="h-3 w-3 text-neutral-400" />
                  {media.duration}
                </div>

                {/* 4K Badge */}
                <div className="absolute top-2.5 left-2.5">
                  <Badge variant={isCurrent ? 'red' : 'default'} className="text-[0.65rem] px-2 py-0.5">
                    {media.category}
                  </Badge>
                </div>

                {/* Play Hover Overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-red-500/50 bg-black/80 text-red-500 shadow-lg">
                    <Play className="ml-0.5 h-5 w-5" />
                  </div>
                </div>
              </div>

              {/* Title & Info */}
              <div className="mt-3.5 space-y-1.5">
                <h4 className="text-sm font-bold text-white line-clamp-2 group-hover:text-red-400 transition-colors">
                  {media.title}
                </h4>
                <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                  {media.description}
                </p>

                <div className="flex items-center justify-between pt-2 text-[0.7rem] text-neutral-500 border-t border-white/5">
                  <div className="flex items-center gap-1">
                    <Eye className="h-3.5 w-3.5" />
                    <span>{media.views} visualizações</span>
                  </div>
                  <span className="text-red-400 font-semibold group-hover:underline">
                    Assistir Agora →
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
