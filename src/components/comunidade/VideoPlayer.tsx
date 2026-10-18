'use client';

import React, { useRef, useState, useEffect } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  RotateCcw,
  Sparkles,
  Film,
  CheckCircle2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';

export interface VideoPlayerProps {
  src?: string;
  youtubeId?: string;
  title: string;
  description?: string;
  category?: string;
  poster?: string;
  autoPlay?: boolean;
  className?: string;
}

export function VideoPlayer({
  src,
  youtubeId,
  title,
  description,
  category = 'Masterclass 4K',
  poster,
  autoPlay = false,
  className,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.85);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [copied, setCopied] = useState(false);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-hide controls timer
  const resetControlsTimeout = () => {
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    setShowControls(true);
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3500);
    }
  };

  useEffect(() => {
    if (isPlaying) {
      resetControlsTimeout();
    } else {
      setShowControls(true);
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    }
    return () => {
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, [isPlaying]);

  // Fallback default sample 4K video from visuals-app-saas if neither src nor youtubeId is provided
  const videoSource =
    src ||
    'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260506_031045_0e1165dd-ab48-46e3-ad3d-5fe77f217647.mp4';

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    const handleLoadedMetadata = () => setDuration(video.duration);
    const handleEnded = () => {
      setIsPlaying(false);
      setShowControls(true);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('ended', handleEnded);
    };
  }, [src]);

  // Handle Fullscreen change
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
      setShowControls(true);
    } else {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
      resetControlsTimeout();
    }
  };

  const handleVideoTouchOrClick = () => {
    if (!showControls) {
      resetControlsTimeout();
    } else {
      togglePlay();
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const nextMuted = !isMuted;
    videoRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      videoRef.current.muted = val === 0;
      setIsMuted(val === 0);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const seekTime = parseFloat(e.target.value);
    setCurrentTime(seekTime);
    if (videoRef.current) {
      videoRef.current.currentTime = seekTime;
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const restartVideo = () => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = 0;
    videoRef.current.play().catch(() => {});
    setIsPlaying(true);
  };

  const copyPromptOrShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => isPlaying && setShowControls(false)}
      onTouchStart={resetControlsTimeout}
      className={cn(
        'group relative overflow-hidden rounded-2xl sm:rounded-3xl border border-white/10 bg-neutral-950/80 shadow-[0_0_50px_rgba(0,0,0,0.8)] backdrop-blur-2xl transition-all duration-300 w-full max-w-full',
        className
      )}
    >
      {/* Container 16:9 estrito e responsivo */}
      <div className="relative aspect-video w-full overflow-hidden bg-black select-none">
        {youtubeId ? (
          <iframe
            src={`https://www.youtube.com/embed/${youtubeId}?enablejsapi=1&autoplay=${autoPlay ? 1 : 0}&modestbranding=1&rel=0`}
            title={title}
            className="h-full w-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <>
            <video
              ref={videoRef}
              src={videoSource}
              poster={poster}
              playsInline
              autoPlay={autoPlay}
              onClick={handleVideoTouchOrClick}
              className="h-full w-full cursor-pointer object-cover"
            />

            {/* Play Button Overlay (quando pausado) */}
            {!isPlaying && (
              <div
                onClick={togglePlay}
                className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/40 backdrop-blur-[2px] transition-all hover:bg-black/20 touch-manipulation"
              >
                <div className="relative flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full border border-red-500/40 bg-neutral-900/90 text-white shadow-[0_0_35px_rgba(255,7,58,0.4)] backdrop-blur-xl transition-all duration-300 hover:scale-110 hover:border-red-500 hover:shadow-[0_0_50px_rgba(255,7,58,0.7)]">
                  <Play className="ml-1 h-7 w-7 sm:h-8 sm:w-8 text-red-500" />
                </div>
              </div>
            )}
          </>
        )}

        {/* Top Badges Bar Responsiva */}
        <div
          className={cn(
            'pointer-events-none absolute top-3 sm:top-4 left-3 sm:left-4 right-3 sm:right-4 flex items-center justify-between gap-2 transition-opacity duration-300 z-10',
            showControls || !isPlaying ? 'opacity-100' : 'opacity-0'
          )}
        >
          <div className="pointer-events-auto flex items-center gap-1.5 sm:gap-2 flex-wrap">
            <Badge variant="red" dot className="text-[0.65rem] px-2 py-0.5">
              {category}
            </Badge>
            <span className="rounded-md border border-white/10 bg-black/60 px-2 py-0.5 text-[0.6rem] sm:text-[0.65rem] font-bold text-neutral-300 backdrop-blur-md">
              4K UHD 60FPS
            </span>
          </div>

          <button
            onClick={copyPromptOrShare}
            className="pointer-events-auto flex items-center gap-1.5 rounded-full border border-white/10 bg-neutral-900/80 px-3 py-1.5 text-xs text-neutral-300 backdrop-blur-md transition-all hover:border-white/30 hover:text-white shrink-0 min-h-[34px] touch-manipulation"
            aria-label="Compartilhar vídeo"
          >
            {copied ? (
              <>
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-emerald-400 text-xs font-semibold">Copiado</span>
              </>
            ) : (
              <>
                <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                <span className="text-xs">Compartilhar</span>
              </>
            )}
          </button>
        </div>

        {/* Bottom Custom Controls Bar (Touch-First para MP4 nativo) */}
        {!youtubeId && (
          <div
            className={cn(
              'absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 via-black/75 to-transparent p-3 sm:p-4 pt-10 sm:pt-12 transition-all duration-300 z-10',
              showControls || !isPlaying ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0 pointer-events-none'
            )}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Timeline Progress Bar Touch-Friendly */}
            <div className="group/slider mb-2.5 sm:mb-3 flex items-center gap-2 sm:gap-3">
              <span className="text-[11px] sm:text-xs font-mono text-neutral-400 shrink-0 min-w-[36px]">
                {formatTime(currentTime)}
              </span>
              <div className="relative flex-1 py-2 flex items-center">
                <input
                  type="range"
                  min="0"
                  max={duration || 100}
                  step="0.1"
                  value={currentTime}
                  onChange={handleSeek}
                  aria-label="Progresso do vídeo"
                  className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-white/20 accent-red-500 transition-all hover:h-2.5 touch-manipulation"
                />
              </div>
              <span className="text-[11px] sm:text-xs font-mono text-neutral-400 shrink-0 min-w-[36px]">
                {formatTime(duration)}
              </span>
            </div>

            {/* Controls Actions Row Touch-First */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={togglePlay}
                  className="flex h-10 w-10 sm:h-9 sm:w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white transition-all hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-400 touch-manipulation"
                  aria-label={isPlaying ? 'Pausar vídeo' : 'Reproduzir vídeo'}
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="ml-0.5 h-4 w-4" />}
                </button>

                <button
                  type="button"
                  onClick={restartVideo}
                  className="flex h-10 w-10 sm:h-9 sm:w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-neutral-400 transition-all hover:bg-white/10 hover:text-white touch-manipulation"
                  title="Reiniciar vídeo"
                  aria-label="Reiniciar vídeo"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>

                {/* Volume Section */}
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <button
                    type="button"
                    onClick={toggleMute}
                    className="flex h-10 w-10 sm:h-9 sm:w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-neutral-300 transition-all hover:bg-white/10 hover:text-white touch-manipulation"
                    aria-label={isMuted ? 'Ativar som' : 'Desativar som'}
                  >
                    {isMuted || volume === 0 ? (
                      <VolumeX className="h-4 w-4 text-red-400" />
                    ) : (
                      <Volume2 className="h-4 w-4" />
                    )}
                  </button>
                  <div className="hidden sm:block">
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={isMuted ? 0 : volume}
                      onChange={handleVolumeChange}
                      aria-label="Controle de volume"
                      className="h-1.5 w-16 cursor-pointer appearance-none rounded-md bg-white/20 accent-neutral-200"
                    />
                  </div>
                </div>
              </div>

              {/* Title display on desktop */}
              <div className="hidden max-w-[35%] truncate text-xs font-medium text-neutral-300 lg:block">
                <span className="text-red-400">Tocando: </span>
                {title}
              </div>

              {/* Right tools (Fullscreen) */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={toggleFullscreen}
                  className="flex h-10 w-10 sm:h-9 sm:w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-neutral-300 transition-all hover:bg-white/10 hover:text-white touch-manipulation"
                  title={isFullscreen ? 'Sair da tela cheia' : 'Tela cheia'}
                  aria-label={isFullscreen ? 'Sair da tela cheia' : 'Tela cheia'}
                >
                  {isFullscreen ? (
                    <Minimize className="h-4 w-4" />
                  ) : (
                    <Maximize className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Video Details Bottom Card */}
      <div className="border-t border-white/5 bg-neutral-900/40 p-5">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Film className="h-4 w-4 text-red-500" />
              <h3 className="text-base font-bold text-white tracking-tight">{title}</h3>
            </div>
            {description && (
              <p className="mt-1 text-xs leading-relaxed text-neutral-400">{description}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
