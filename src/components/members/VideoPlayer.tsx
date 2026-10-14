'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Volume2, 
  VolumeX, 
  Sliders, 
  Sparkles, 
  Maximize2, 
  Minimize2,
  Tv,
  Film,
  Layers,
  Info
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface VideoItem {
  id: string;
  title: string;
  category: string;
  type: 'mp4' | 'youtube';
  url?: string;
  youtubeId?: string;
  duration?: string;
}

export const CLOUDFRONT_PLAYLIST: VideoItem[] = [
  {
    id: 'cf-1',
    title: 'Aura Cósmica & Partículas Volumétricas',
    category: 'Celestial',
    type: 'mp4',
    url: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260506_031045_0e1165dd-ab48-46e3-ad3d-5fe77f217647.mp4',
    duration: '00:30'
  },
  {
    id: 'cf-2',
    title: 'Fluidez Dimensional & Dreamcore Portal',
    category: 'Dreamcore',
    type: 'mp4',
    url: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_171521_25968ba2-b594-4b32-aab7-f6b69398a6fa.mp4',
    duration: '00:45'
  },
  {
    id: 'cf-3',
    title: 'Nebulosa Iridescente Gen-X Soft',
    category: 'Gen-X Soft Club',
    type: 'mp4',
    url: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260429_115139_0fc6bd3d-3631-4d26-ab9b-28293887dcc9.mp4',
    duration: '00:35'
  },
  {
    id: 'cf-4',
    title: 'Cyberpunk Ethereal Raytracing',
    category: 'Digital Art',
    type: 'mp4',
    url: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260411_104032_69319010-2458-492b-b04d-b40a5dfa4482.mp4',
    duration: '00:40'
  },
  {
    id: 'cf-5',
    title: 'Texturas Biomecânicas e Efeitos Fluidos',
    category: 'Effects',
    type: 'mp4',
    url: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260403_050628_c4e32401-fab4-4a27-b7a8-6e9291cd5959.mp4',
    duration: '00:28'
  },
  {
    id: 'cf-6',
    title: 'Gastronomia Molecular & High-End Textures',
    category: 'Food',
    type: 'mp4',
    url: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260324_151826_c7218672-6e92-402c-9e45-f1e0f454bdc4.mp4',
    duration: '00:32'
  },
  {
    id: 'cf-7',
    title: 'Santuário Sagrado Dourado 8K',
    category: 'Celestial',
    type: 'mp4',
    url: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260319_055001_8e16d972-3b2b-441c-86ad-2901a54682f9.mp4',
    duration: '00:50'
  }
];

export const YOUTUBE_PLAYLIST: VideoItem[] = [
  { id: 'yt-1', title: 'Lofi Cyber Ambient Room', category: 'Digital Art', type: 'youtube', youtubeId: '2Gg6Seob5Mg' },
  { id: 'yt-2', title: 'Dreamcore Liminal Highway', category: 'Dreamcore', type: 'youtube', youtubeId: 'hqNkGnR4Lz8' },
  { id: 'yt-3', title: 'Celestial Cathedral Golden Hours', category: 'Celestial', type: 'youtube', youtubeId: 'KKjuRJh_3LY' },
  { id: 'yt-4', title: 'Atmospheric Organic Textures', category: 'Effects', type: 'youtube', youtubeId: 'CjBoK8f47EI' }
];

interface VideoPlayerProps {
  className?: string;
  mode?: 'ambient' | 'card' | 'fullscreen';
  initialServer?: 'cloudfront' | 'youtube';
  showControls?: boolean;
}

export function VideoPlayer({
  className,
  mode = 'card',
  initialServer = 'cloudfront',
  showControls = true
}: VideoPlayerProps) {
  const [server, setServer] = useState<'cloudfront' | 'youtube'>(initialServer);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [blur, setBlur] = useState(4);
  const [darkness, setDarkness] = useState(20);
  const [showSettings, setShowSettings] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const playlist = server === 'cloudfront' ? CLOUDFRONT_PLAYLIST : YOUTUBE_PLAYLIST;
  const currentTrack = playlist[currentIndex] || playlist[0];

  useEffect(() => {
    if (server === 'cloudfront' && videoRef.current) {
      if (isPlaying) {
        videoRef.current.play().catch(() => {
          // Autoplay policy fallback: mute and play
          if (videoRef.current) {
            videoRef.current.muted = true;
            setIsMuted(true);
            videoRef.current.play().catch(() => setIsPlaying(false));
          }
        });
      } else {
        videoRef.current.pause();
      }
    }
  }, [currentIndex, isPlaying, server]);

  const togglePlay = () => {
    if (server === 'cloudfront' && videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    } else {
      setIsMuted(!isMuted);
    }
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % playlist.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + playlist.length) % playlist.length);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative rounded-2xl overflow-hidden border border-white/10 bg-[#0a0a0c]/80 backdrop-blur-xl transition-all duration-300 shadow-2xl",
        mode === 'card' && "w-full max-w-5xl mx-auto aspect-video min-h-[360px]",
        mode === 'ambient' && "w-full h-full",
        isFullscreen && "w-screen h-screen rounded-none border-none",
        className
      )}
    >
      {/* Video Display Layer */}
      <div 
        className="absolute inset-0 w-full h-full overflow-hidden"
        style={{
          filter: `blur(${blur}px)`
        }}
      >
        {server === 'cloudfront' ? (
          <video
            ref={videoRef}
            src={currentTrack.url}
            className="w-full h-full object-cover select-none pointer-events-none"
            autoPlay
            loop
            muted={isMuted}
            playsInline
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />
        ) : (
          <iframe
            className="w-full h-full object-cover scale-125 select-none pointer-events-none"
            src={`https://www.youtube-nocookie.com/embed/${currentTrack.youtubeId}?autoplay=1&mute=${isMuted ? 1 : 0}&controls=0&loop=1&playlist=${currentTrack.youtubeId}&showinfo=0&modestbranding=1`}
            title={currentTrack.title}
            allow="autoplay; encrypted-media"
            allowFullScreen
          />
        )}
      </div>

      {/* Darkness / Tint Overlay */}
      <div 
        className="absolute inset-0 bg-black pointer-events-none transition-colors duration-200"
        style={{ opacity: darkness / 100 }}
      />

      {/* Radial Vignette Effect */}
      <div className="absolute inset-0 bg-radial from-transparent via-black/20 to-black/80 pointer-events-none" />

      {/* Header Info Pill */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20 pointer-events-auto">
        <div className="flex items-center gap-3 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15 text-xs text-white/90">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-semibold tracking-wide uppercase text-[10px] text-emerald-400">
            {server === 'cloudfront' ? 'CloudFront 4K HDR' : 'YouTube Stream'}
          </span>
          <span className="text-white/30">•</span>
          <span className="font-medium truncate max-w-[200px] sm:max-w-xs">{currentTrack.title}</span>
          <span className="text-white/30 hidden sm:inline">•</span>
          <span className="text-white/60 hidden sm:inline">{currentTrack.category}</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Badge Resolução */}
          <div className="bg-white/10 backdrop-blur-md text-[11px] font-mono font-medium text-white/80 px-2.5 py-1 rounded-md border border-white/10 hidden sm:flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>Master 8K 60FPS</span>
          </div>

          <button
            onClick={() => setShowSettings(!showSettings)}
            aria-label="Ajustes de Render"
            className={cn(
              "p-2 rounded-full backdrop-blur-md border border-white/15 transition-all text-white/80 hover:text-white",
              showSettings ? "bg-white/20 text-white" : "bg-black/50 hover:bg-black/80"
            )}
          >
            <Sliders className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Settings Drawer Panel */}
      {showSettings && (
        <div className="absolute top-16 right-4 z-30 w-72 bg-[#0c0d12]/95 backdrop-blur-2xl border border-white/20 rounded-xl p-4 shadow-2xl text-xs space-y-4 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <span className="font-semibold text-white/90 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-indigo-400" /> Ajustes Cinemáticos
            </span>
            <span className="text-[10px] text-white/40">Visuals Engine</span>
          </div>

          {/* Servidor Switch */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-medium text-white/70 flex items-center gap-1">
              <Tv className="w-3 h-3" /> Servidor de Vídeo
            </label>
            <div className="grid grid-cols-2 gap-1.5 p-1 bg-black/40 rounded-lg border border-white/5">
              <button
                type="button"
                onClick={() => { setServer('cloudfront'); setCurrentIndex(0); }}
                className={cn(
                  "py-1.5 px-2 rounded-md text-[11px] font-medium transition-all text-center",
                  server === 'cloudfront' ? "bg-indigo-600 text-white shadow-sm" : "text-white/60 hover:text-white"
                )}
              >
                CloudFront MP4
              </button>
              <button
                type="button"
                onClick={() => { setServer('youtube'); setCurrentIndex(0); }}
                className={cn(
                  "py-1.5 px-2 rounded-md text-[11px] font-medium transition-all text-center",
                  server === 'youtube' ? "bg-indigo-600 text-white shadow-sm" : "text-white/60 hover:text-white"
                )}
              >
                YouTube Ambient
              </button>
            </div>
          </div>

          {/* Blur Range */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-white/70">
              <label htmlFor="blur-range" className="text-[11px]">Desfoque de Fundo (Blur)</label>
              <span className="font-mono text-white/50">{blur}px</span>
            </div>
            <input
              id="blur-range"
              type="range"
              min="0"
              max="20"
              value={blur}
              onChange={(e) => setBlur(Number(e.target.value))}
              className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
          </div>

          {/* Darkness Range */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-white/70">
              <label htmlFor="darkness-range" className="text-[11px]">Escurecimento (Darkness)</label>
              <span className="font-mono text-white/50">{darkness}%</span>
            </div>
            <input
              id="darkness-range"
              type="range"
              min="0"
              max="90"
              value={darkness}
              onChange={(e) => setDarkness(Number(e.target.value))}
              className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
          </div>
        </div>
      )}

      {/* Center Big Play Trigger on Hover/Pause */}
      {!isPlaying && (
        <div 
          onClick={togglePlay}
          className="absolute inset-0 z-10 flex items-center justify-center cursor-pointer bg-black/30 backdrop-blur-[2px] transition-opacity"
        >
          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shadow-2xl hover:scale-110 transition-transform">
            <Play className="w-7 h-7 fill-white ml-1" />
          </div>
        </div>
      )}

      {/* Bottom Glassmorphic Control Bar */}
      {showControls && (
        <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between gap-3 bg-black/60 backdrop-blur-2xl px-4 py-2.5 rounded-xl border border-white/15 text-white shadow-xl">
          {/* Track Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              aria-label="Vídeo anterior"
              className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all"
            >
              <SkipBack className="w-4 h-4" />
            </button>
            <button
              onClick={togglePlay}
              aria-label={isPlaying ? "Pausar vídeo" : "Reproduzir vídeo"}
              className="p-2 rounded-lg bg-white/15 text-white hover:bg-white/25 transition-all shadow-sm"
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
            </button>
            <button
              onClick={handleNext}
              aria-label="Próximo vídeo"
              className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all"
            >
              <SkipForward className="w-4 h-4" />
            </button>
            <button
              onClick={toggleMute}
              aria-label={isMuted ? "Ativar áudio" : "Silenciar áudio"}
              className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all ml-1"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </button>
          </div>

          {/* Playlist Indicator */}
          <div className="hidden md:flex items-center gap-1.5 overflow-x-auto py-1 max-w-sm">
            {playlist.map((track, idx) => (
              <button
                key={track.id}
                onClick={() => setCurrentIndex(idx)}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  idx === currentIndex ? "w-6 bg-indigo-500" : "w-1.5 bg-white/20 hover:bg-white/40"
                )}
                title={track.title}
              />
            ))}
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-white/50 font-mono hidden sm:inline">
              {currentIndex + 1} / {playlist.length}
            </span>
            <button
              onClick={toggleFullscreen}
              aria-label={isFullscreen ? "Sair da tela cheia" : "Tela cheia"}
              className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
