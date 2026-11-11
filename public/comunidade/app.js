/**
 * MCP Business OS — Infoprodutos Demo Engine
 * Apple Liquid Glass & Crimson VisionOS
 */

(function () {
  'use strict';

  // ──────────────────────────────────────────────────────────────────────────
  // 1. VIDEO BACKGROUND PLAYLIST ENGINE (CINEMATIC CROSSFADE, NO SOUND)
  // ──────────────────────────────────────────────────────────────────────────
  const VIDEO_PLAYLIST_SERVER1 = [
    { type: 'mp4', url: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260506_031045_0e1165dd-ab48-46e3-ad3d-5fe77f217647.mp4' },
    { type: 'mp4', url: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_171521_25968ba2-b594-4b32-aab7-f6b69398a6fa.mp4' },
    { type: 'mp4', url: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260429_115139_0fc6bd3d-3631-4d26-ab9b-28293887dcc9.mp4' },
    { type: 'mp4', url: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260411_104032_69319010-2458-492b-b04d-b40a5dfa4482.mp4' },
    { type: 'mp4', url: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260403_050628_c4e32401-fab4-4a27-b7a8-6e9291cd5959.mp4' }
  ];

  const VIDEO_PLAYLIST_SERVER2 = [
    { type: 'youtube', id: '2Gg6Seob5Mg' },
    { type: 'youtube', id: 'hqNkGnR4Lz8' },
    { type: 'youtube', id: 'KKjuRJh_3LY' },
    { type: 'youtube', id: 'CjBoK8f47EI' },
    { type: 'youtube', id: '335MM_5uOl8' }
  ];

  let activeBgServer = localStorage.getItem('bg_server') || 'server1';
  let activeBgBlur = parseInt(localStorage.getItem('bg_blur') || '5', 10);
  let activeBgDarkness = parseInt(localStorage.getItem('bg_darkness') || '13', 10);

  let activeLayer = 'a';
  let ytPlayerA = null;
  let ytPlayerB = null;
  let ytApiReady = false;
  let videoTransitionTimeout = null;

  function getActivePlaylist() {
    return activeBgServer === 'server2' ? VIDEO_PLAYLIST_SERVER2 : VIDEO_PLAYLIST_SERVER1;
  }

  function applyBgSettingsUI() {
    const bgContainer = document.getElementById('bg-video-playlist');
    const blurRange = document.getElementById('bgBlurRange');
    const darknessRange = document.getElementById('bgDarknessRange');
    const serverSelect = document.getElementById('bgServerSelect');
    const blurText = document.getElementById('bgBlurValText');
    const darknessText = document.getElementById('bgDarknessValText');

    if (bgContainer) {
      bgContainer.style.filter = `blur(${activeBgBlur}px)`;
      bgContainer.style.opacity = `${(100 - activeBgDarkness) / 100}`;
    }

    if (blurRange) blurRange.value = activeBgBlur;
    if (darknessRange) darknessRange.value = activeBgDarkness;
    if (serverSelect) serverSelect.value = activeBgServer;
    if (blurText) blurText.textContent = `${activeBgBlur}px`;
    if (darknessText) darknessText.textContent = `${activeBgDarkness}%`;
  }

  function playNextVideoInPlaylist() {
    clearTimeout(videoTransitionTimeout);
    const playlist = getActivePlaylist();
    if (!playlist || playlist.length === 0) return;

    const item = playlist[Math.floor(Math.random() * playlist.length)];
    const nextLayer = activeLayer === 'a' ? 'b' : 'a';
    const currentLayerEl = document.getElementById(`bg-player-${activeLayer}`);
    const nextLayerEl    = document.getElementById(`bg-player-${nextLayer}`);
    const nextVideoEl    = document.getElementById(`video-${nextLayer}`);
    const nextYtWrapEl   = document.getElementById(`yt-wrap-${nextLayer}`);

    if (item.type === 'mp4') {
      if (nextYtWrapEl) nextYtWrapEl.classList.add('hidden');
      if (nextVideoEl) {
        nextVideoEl.classList.remove('hidden');
        nextVideoEl.src = item.url;
        nextVideoEl.muted = true;
        nextVideoEl.play().catch(() => {});
        nextVideoEl.onended = () => playNextVideoInPlaylist();
        videoTransitionTimeout = setTimeout(() => playNextVideoInPlaylist(), 30000);
      }
    } else if (item.type === 'youtube' && window.YT && window.YT.Player) {
      if (nextVideoEl) nextVideoEl.classList.add('hidden');
      if (nextYtWrapEl) nextYtWrapEl.classList.remove('hidden');

      const targetDivId = `yt-player-${nextLayer}`;
      const playerVars = {
        autoplay: 1, controls: 0, showinfo: 0, rel: 0,
        iv_load_policy: 3, modestbranding: 1, playsinline: 1,
        enablejsapi: 1, mute: 1
      };

      const onStateChange = (event) => {
        if (event.data === window.YT.PlayerState.ENDED) {
          playNextVideoInPlaylist();
        }
      };

      if (nextLayer === 'a') {
        if (ytPlayerA && typeof ytPlayerA.loadVideoById === 'function') ytPlayerA.loadVideoById(item.id);
        else {
          ytPlayerA = new window.YT.Player(targetDivId, { videoId: item.id, playerVars, events: { onReady: (e) => e.target.playVideo(), onStateChange } });
        }
      } else {
        if (ytPlayerB && typeof ytPlayerB.loadVideoById === 'function') ytPlayerB.loadVideoById(item.id);
        else {
          ytPlayerB = new window.YT.Player(targetDivId, { videoId: item.id, playerVars, events: { onReady: (e) => e.target.playVideo(), onStateChange } });
        }
      }

      videoTransitionTimeout = setTimeout(() => playNextVideoInPlaylist(), 45000);
    } else {
      videoTransitionTimeout = setTimeout(() => playNextVideoInPlaylist(), 3000);
      return;
    }

    if (nextLayerEl && currentLayerEl) {
      nextLayerEl.classList.remove('opacity-0');
      nextLayerEl.classList.add('opacity-100');
      currentLayerEl.classList.remove('opacity-100');
      currentLayerEl.classList.add('opacity-0');
      activeLayer = nextLayer;
    }
  }

  function initVideoBackgroundEngine() {
    applyBgSettingsUI();
    window.onYouTubeIframeAPIReady = () => {
      ytApiReady = true;
      playNextVideoInPlaylist();
    };
    if (window.YT && window.YT.Player) {
      ytApiReady = true;
      playNextVideoInPlaylist();
    } else {
      setTimeout(() => playNextVideoInPlaylist(), 800);
    }
  }

  // ──────────────────────────────────────────────────────────────────────────
  // 2. TOAST SYSTEM
  // ──────────────────────────────────────────────────────────────────────────
  let toastTimer = null;
  function showToast(msg) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    if (!toast || !toastMessage) return;

    toastMessage.textContent = msg;
    toast.classList.remove('opacity-0', 'scale-95', 'translate-y-4', 'pointer-events-none');
    toast.classList.add('opacity-100', 'scale-100', 'translate-y-0');

    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('opacity-100', 'scale-100', 'translate-y-0');
      toast.classList.add('opacity-0', 'scale-95', 'translate-y-4', 'pointer-events-none');
    }, 2800);
  }
  window.appShowToast = showToast;

  // ──────────────────────────────────────────────────────────────────────────
  // 3. HERO VIEW RENDERER (SEUS INFOPRODUTOS FREE E PAGOS AQUI)
  // ──────────────────────────────────────────────────────────────────────────
  function renderHeroView() {
    const mainAppContainer = document.getElementById('mainAppContainer');
    if (!mainAppContainer) return;

    mainAppContainer.innerHTML = `
      <section class="w-full max-w-4xl mx-auto text-center py-16 sm:py-24 relative anim-element anim-fade-up">
        <!-- Ambient Glow Carmesim Sutil -->
        <div class="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-red-600/15 rounded-full blur-[120px] pointer-events-none -z-10"></div>
        
        <!-- Badge Minimalista Soberano -->
        <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-xl mb-6 sm:mb-8 shadow-[0_0_25px_rgba(220,38,38,0.15)]">
          <span class="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
          <span class="text-xs font-mono font-semibold uppercase tracking-widest text-zinc-300">HUB DE INFOPRODUTOS // DEMO</span>
        </div>

        <!-- Headline Monumental: "Seus infoprodutos free e pagos aqui" -->
        <h1 class="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white mb-6 leading-[1.08] drop-shadow-2xl">
          Seus infoprodutos <span class="bg-gradient-to-r from-red-500 via-rose-300 to-white bg-clip-text text-transparent">free e pagos</span> aqui
        </h1>

        <p class="text-graphite text-base sm:text-xl max-w-2xl mx-auto leading-relaxed font-light mb-10">
          Área de distribuição e entrega de infoprodutos digitais de alta performance e experiências imersivas.
        </p>

        <!-- Ações Rápidas Soberanas para a Demo -->
        <div class="flex flex-wrap items-center justify-center gap-4">
          <a href="/shop" class="px-8 py-4 rounded-full font-bold bg-white text-black hover:bg-zinc-200 hover:scale-105 active:scale-95 transition-all text-sm shadow-[0_10px_35px_rgba(255,255,255,0.2)] flex items-center gap-2">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
            <span>Explorar Vitrine Shop</span>
          </a>
          <a href="/admin" class="px-7 py-4 rounded-full font-semibold bg-white/[0.06] hover:bg-white/10 text-white border border-white/15 hover:border-red-500/40 active:scale-95 transition-all text-sm backdrop-blur-xl flex items-center gap-2">
            <svg class="w-4 h-4 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14"/></svg>
            <span>Painel Administrativo</span>
          </a>
        </div>
      </section>
    `;

    // Revelação suave (IntersectionObserver / CSS anim)
    requestAnimationFrame(() => {
      const el = mainAppContainer.querySelector('.anim-element');
      if (el) el.classList.add('is-visible');
    });
  }

  // ──────────────────────────────────────────────────────────────────────────
  // 4. BOOTSTRAP DA DEMO & CONTROLES DE BACKGROUND
  // ──────────────────────────────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', () => {
    // 1. Inicializa o background de vídeo e controles visuais
    initVideoBackgroundEngine();

    // 2. Conecta listeners do painel flutuante de configurações de background
    const bgTrigger = document.getElementById('bgSettingsTrigger');
    const bgModal = document.getElementById('bgSettingsModal');
    const closeBgModal = document.getElementById('closeBgSettingsModal');
    const blurRange = document.getElementById('bgBlurRange');
    const darknessRange = document.getElementById('bgDarknessRange');
    const serverSelect = document.getElementById('bgServerSelect');
    const bgResetBtn = document.getElementById('bgResetBtn');

    if (bgTrigger && bgModal) {
      bgTrigger.addEventListener('click', (e) => {
        e.stopPropagation();
        const isHidden = bgModal.classList.contains('hidden');
        if (isHidden) {
          bgModal.classList.remove('hidden');
          setTimeout(() => {
            bgModal.classList.remove('opacity-0', 'scale-95');
          }, 10);
        } else {
          bgModal.classList.add('opacity-0', 'scale-95');
          setTimeout(() => bgModal.classList.add('hidden'), 300);
        }
      });
    }

    if (closeBgModal && bgModal) {
      closeBgModal.addEventListener('click', () => {
        bgModal.classList.add('opacity-0', 'scale-95');
        setTimeout(() => bgModal.classList.add('hidden'), 300);
      });
    }

    if (blurRange) {
      blurRange.addEventListener('input', (e) => {
        activeBgBlur = parseInt(e.target.value, 10);
        localStorage.setItem('bg_blur', activeBgBlur);
        applyBgSettingsUI();
      });
    }

    if (darknessRange) {
      darknessRange.addEventListener('input', (e) => {
        activeBgDarkness = parseInt(e.target.value, 10);
        localStorage.setItem('bg_darkness', activeBgDarkness);
        applyBgSettingsUI();
      });
    }

    if (serverSelect) {
      serverSelect.addEventListener('change', (e) => {
        activeBgServer = e.target.value;
        localStorage.setItem('bg_server', activeBgServer);
        applyBgSettingsUI();
        playNextVideoInPlaylist();
        showToast(`Servidor alterado para ${activeBgServer === 'server1' ? 'Server 1' : 'Server 2'}`);
      });
    }

    if (bgResetBtn) {
      bgResetBtn.addEventListener('click', () => {
        activeBgBlur = 5;
        activeBgDarkness = 13;
        activeBgServer = 'server1';
        localStorage.removeItem('bg_blur');
        localStorage.removeItem('bg_darkness');
        localStorage.removeItem('bg_server');
        applyBgSettingsUI();
        playNextVideoInPlaylist();
        showToast('Configurações visuais restauradas.');
      });
    }

    // 3. Ativação dos shaders WebGL vermelhos com opacidade e rotação suave
    const webglContainer = document.getElementById('bg-webgl-container');
    const webglVignette = document.getElementById('bg-webgl-vignette');
    const videoBg = document.getElementById('bg-video-playlist');

    if (webglContainer) {
      webglContainer.style.opacity = '1';
      webglContainer.style.display = 'block';
    }
    if (webglVignette) {
      webglVignette.style.opacity = '0.75';
    }
    if (videoBg) {
      videoBg.style.opacity = '0.08';
    }

    // Dispara shader salvo ou strands default
    const savedShader = localStorage.getItem('mcp_community_active_shader') || 'strands';
    if (typeof window.setCommunityShader === 'function') {
      window.setCommunityShader(savedShader);
    } else if (typeof window.renderWebGLBackground === 'function') {
      window.renderWebGLBackground(savedShader);
    }

    // 4. Renderiza a Hero definitiva e suave
    renderHeroView();

    // Garante que qualquer navegação por hash permaneça na Hero
    window.addEventListener('hashchange', () => {
      renderHeroView();
    });
  });
})();
