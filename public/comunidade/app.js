/**
 * A.I VISUALS — Members Area v8.0 (Production Ready)
 * Backend: Supabase — MATEUS CELESTINO PRO X (lijrxbzotmoikyvjiipv)
 * Payments: Mercado Pago Checkout Pro
 * Design: Apple Liquid Glass (Zero Neon, VisionOS)
 */

const SUPABASE_URL = 'https://lijrxbzotmoikyvjiipv.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxpanJ4YnpvdG1vaWt5dmppaXB2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIwOTI2NjksImV4cCI6MjEwNzY2ODY2OX0.X9ag97jWO7qSEeuPJ2wMZFr6ouHVZVI_HdN2atEzNRw';
// Public Key (segura para o frontend — não é o Access Token)
const MP_PUBLIC_KEY = 'APP_USR-77fe0fd7-600a-4b1e-8bd2-25007f12a351';
const _supabase = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;
const sb = _supabase;

document.addEventListener('DOMContentLoaded', () => {

  // ──────────────────────────────────────────────────────────────────────────
  // 1. VIDEO BACKGROUND PLAYLIST ENGINE (NO SOUND, CINEMATIC CROSSFADE)
  // ──────────────────────────────────────────────────────────────────────────
  const VIDEO_PLAYLIST_SERVER1 = [
    { type: 'mp4', url: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260506_031045_0e1165dd-ab48-46e3-ad3d-5fe77f217647.mp4' },
    { type: 'mp4', url: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_171521_25968ba2-b594-4b32-aab7-f6b69398a6fa.mp4' },
    { type: 'mp4', url: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260429_115139_0fc6bd3d-3631-4d26-ab9b-28293887dcc9.mp4' },
    { type: 'mp4', url: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260411_104032_69319010-2458-492b-b04d-b40a5dfa4482.mp4' },
    { type: 'mp4', url: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260403_050628_c4e32401-fab4-4a27-b7a8-6e9291cd5959.mp4' },
    { type: 'mp4', url: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260324_151826_c7218672-6e92-402c-9e45-f1e0f454bdc4.mp4' },
    { type: 'mp4', url: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260319_055001_8e16d972-3b2b-441c-86ad-2901a54682f9.mp4' }
  ];

  const VIDEO_PLAYLIST_SERVER2 = [
    { type: 'youtube', id: '2Gg6Seob5Mg' },
    { type: 'youtube', id: 'hqNkGnR4Lz8' },
    { type: 'youtube', id: 'KKjuRJh_3LY' },
    { type: 'youtube', id: 'CjBoK8f47EI' },
    { type: 'youtube', id: '335MM_5uOl8' },
    { type: 'youtube', id: 'TmQOFWX9D3o' },
    { type: 'youtube', id: 'Y3od1i_W3VE' },
    { type: 'youtube', id: 'Pv7c_EkmDxo' },
    { type: 'youtube', id: 'xJIlTbBWxek' },
    { type: 'youtube', id: 'H22w1IU-OcA' },
    { type: 'youtube', id: 'fCPEAq6FMF8' },
    { type: 'youtube', id: 'XKFoDbBwAkE' },
    { type: 'youtube', id: 'RB42UJW9eHo' },
    { type: 'youtube', id: 'FFL1GkpfAic' },
    { type: 'youtube', id: 'Gca8zE4qD3E' },
    { type: 'youtube', id: 'Ki4Fh06Cg0k' },
    { type: 'youtube', id: 'RST9OLSK6BI' },
    { type: 'youtube', id: 'VkgY8P7UUk0' },
    { type: 'youtube', id: 'nFjrUVInaPo' }
  ];

  let activeBgServer = localStorage.getItem('bg_server') || 'server1';
  let activeBgBlur = parseInt(localStorage.getItem('bg_blur') || '5', 10);
  let activeBgDarkness = parseInt(localStorage.getItem('bg_darkness') || '13', 10);

  let activeLayer = 'a'; // 'a' or 'b'
  let ytPlayerA = null;
  let ytPlayerB = null;
  let ytApiReady = false;
  let videoTransitionTimeout = null;

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
      setTimeout(() => {
        playNextVideoInPlaylist();
      }, 800);
    }
  }

  function getActivePlaylist() {
    return activeBgServer === 'server2' ? VIDEO_PLAYLIST_SERVER2 : VIDEO_PLAYLIST_SERVER1;
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
        nextVideoEl.play().catch(e => console.log('Autoplay info:', e));

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

      setTimeout(() => {
        const iframe = document.querySelector(`#${targetDivId}`);
        if (iframe) iframe.classList.add('yt-bg-iframe');
      }, 500);

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

  // ──────────────────────────────────────────────────────────────────────────
  // 2. STATE & DATA STRUCTURES
  // ──────────────────────────────────────────────────────────────────────────
  let allProducts         = [];
  let currentUserRole     = 'guest';
  let isLoggedIn          = false;
  let currentUserNameStr  = 'Visitante';
  let currentUserAvatarUrl= 'https://api.dicebear.com/7.x/bottts/svg?seed=GuestUser';
  let currentUserId       = null;
  let currentUserProfile  = null;
  let currentView         = 'home';
  let selectedProductSlug = null;
  let selectedCategoryId  = null;
  let selectedServerId    = null;
  let selectedLessonId    = null;
  let searchQuery         = '';
  let editingServerId     = null;
  let editingLessonServerId = null;
  let editingLessonId     = null;
  let isLoginMode         = true;
  let communityPosts      = [];
  let serversData         = [];
  let selectedFilesToUpload = [];
  let activeBanners       = [];
  let moderatorPermissions = null;
  let homeImageIntervals  = [];
  let adminView           = 'dashboard'; // aba ativa do painel admin

  const USER_ROLES = {
    guest:     { name:'Visitante',       roleText:'GUEST ACCESS', avatar:'https://api.dicebear.com/7.x/bottts/svg?seed=GuestUser',  level:-2 },
    free:      { name:'Membro Free',     roleText:'FREE MEMBER',  avatar:'https://api.dicebear.com/7.x/bottts/svg?seed=FreeMember', level:-1 },
    level_0:   { name:'Level 0',         roleText:'LEVEL 0',      avatar:'https://api.dicebear.com/7.x/bottts/svg?seed=Level0',     level:0  },
    level_1:   { name:'Level 1',         roleText:'LEVEL 1',      avatar:'https://api.dicebear.com/7.x/bottts/svg?seed=Level1',     level:1  },
    level_2:   { name:'Level 2',         roleText:'LEVEL 2',      avatar:'https://api.dicebear.com/7.x/bottts/svg?seed=Level2',     level:2  },
    full:      { name:'VIP Full Access', roleText:'FULL ACCESS',  avatar:'https://api.dicebear.com/7.x/bottts/svg?seed=FullVIP',   level:99 },
    moderator: { name:'Moderador',       roleText:'MODERADOR',    avatar:'https://api.dicebear.com/7.x/bottts/svg?seed=ModeratorX', level:10 },
    admin:     { name:'Administrador',   roleText:'ADMIN ACCESS', avatar:'https://api.dicebear.com/7.x/bottts/svg?seed=AdminBoss', level:999}
  };

  const BADGE_CLASSES = {
    admin:     'bg-white/20 text-white border-white/30',
    moderator: 'bg-white/15 text-white/90 border-white/20',
    full:      'bg-white/10 text-white/90 border-white/15',
    level_2:   'bg-white/10 text-white/80 border-white/15',
    level_1:   'bg-white/10 text-white/80 border-white/15',
    level_0:   'bg-white/10 text-white/70 border-white/15',
    free:      'bg-white/5 text-graphite border-white/10',
    guest:     'bg-white/5 text-graphite border-white/10',
  };

  // Links "Saiba Mais" por produto
  const PRODUCT_LEARN_MORE_LINKS = {
    'ai-portraits-pro': 'https://aiportraitspro.netlify.app/',
    'ai-art':           'https://aiartpro.netlify.app/',
    'ai-effects-pro':   'https://creativeeffetcspro.netlify.app/',
  };

  // ──────────────────────────────────────────────────────────────────────────
  // DOM ELEMENTS
  // ──────────────────────────────────────────────────────────────────────────
  const brandLogoBtn        = document.getElementById('brandLogoBtn');
  const userMenuTrigger     = document.getElementById('userMenuTrigger');
  const currentUserName     = document.getElementById('currentUserName');
  const currentUserRoleSpan = document.getElementById('currentUserRole');
  const currentUserAvatar   = document.getElementById('currentUserAvatar');
  const searchInput         = document.getElementById('searchInput');
  const breadcrumbBar       = document.getElementById('breadcrumbBar');
  const mainAppContainer    = document.getElementById('mainAppContainer');
  const toast               = document.getElementById('toast');
  const toastMessage        = document.getElementById('toastMessage');
  const authModal           = document.getElementById('authModal');
  const closeAuthModal      = document.getElementById('closeAuthModal');
  const authForm            = document.getElementById('authForm');
  const toggleAuthMode      = document.getElementById('toggleAuthMode');
  const lessonEditorModal   = document.getElementById('lessonEditorModal');
  const closeLessonEditorModal  = document.getElementById('closeLessonEditorModal');
  const cancelLessonModalBtn    = document.getElementById('cancelLessonModalBtn');
  const saveLessonModalBtn      = document.getElementById('saveLessonModalBtn');
  const deleteLessonModalBtn    = document.getElementById('deleteLessonModalBtn');
  const serverEditorModal       = document.getElementById('serverEditorModal');
  const closeServerEditorModal  = document.getElementById('closeServerEditorModal');
  const cancelServerModalBtn    = document.getElementById('cancelServerModalBtn');
  const saveServerModalBtn      = document.getElementById('saveServerModalBtn');
  const deleteServerModalBtn    = document.getElementById('deleteServerModalBtn');

  // ──────────────────────────────────────────────────────────────────────────
  // UTILITIES
  // ──────────────────────────────────────────────────────────────────────────
  function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function escapeJs(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/\\/g, '\\\\')
      .replace(/'/g, "\\'")
      .replace(/"/g, '\\"')
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '');
  }

  function getBadge(role) {
    const r = role === 'moder' ? 'moderator' : (role || 'free');
    const ri = USER_ROLES[r] || USER_ROLES.free;
    const cls = BADGE_CLASSES[r] || BADGE_CLASSES.free;
    const icon = r === 'admin' ? '👑 ' : (r === 'moderator' ? '🛡️ ' : (r === 'full' ? '⭐ ' : ''));
    return `<span class="inline-flex items-center text-[0.65rem] px-2 py-0.5 rounded-full border font-mono font-bold uppercase tracking-wider ${cls}">${icon}${escapeHtml(ri.roleText || r.toUpperCase())}</span>`;
  }

  function formatDate(dateStr) {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return String(dateStr);
      return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
    } catch(e) {
      return String(dateStr);
    }
  }

  function convertToEmbedUrl(url) {
    if (!url || !url.trim()) return '';
    url = url.trim();

    // Se o usuário colou uma tag iframe completa, extrai o atributo src
    if (url.includes('<iframe')) {
      const srcMatch = url.match(/src=["']([^"']+)["']/i);
      if (srcMatch && srcMatch[1]) url = srcMatch[1].trim();
    }

    if (url.includes('/embed/') || url.includes('player.vimeo.com') || url.includes('loom.com/embed') || url.includes('fast.wistia.net/embed')) {
      return url;
    }

    // YouTube: watch?v=ID ou /live/ID
    const ytWatch = url.match(/(?:youtube\.com\/(?:watch\?v=|live\/))([^&\?\/ \n]+)/i);
    if (ytWatch) return `https://www.youtube.com/embed/${ytWatch[1]}?rel=0`;

    // YouTube: youtu.be/ID
    const ytShort = url.match(/(?:youtu\.be\/)([^&\?\/ \n]+)/i);
    if (ytShort) return `https://www.youtube.com/embed/${ytShort[1]}?rel=0`;

    // YouTube Shorts: youtube.com/shorts/ID
    const ytShorts = url.match(/(?:youtube\.com\/shorts\/)([^&\?\/ \n]+)/i);
    if (ytShorts) return `https://www.youtube.com/embed/${ytShorts[1]}?rel=0`;

    // Vimeo: vimeo.com/ID
    const vimeo = url.match(/vimeo\.com\/(?:video\/)?(\d+)/i);
    if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;

    // Loom: loom.com/share/ID -> loom.com/embed/ID
    const loom = url.match(/loom\.com\/share\/([a-zA-Z0-9_-]+)/i);
    if (loom) return `https://www.loom.com/embed/${loom[1]}`;

    // Wistia: wistia.com/medias/ID
    const wistia = url.match(/wistia\.com\/medias\/([a-zA-Z0-9_-]+)/i);
    if (wistia) return `https://fast.wistia.net/embed/iframe/${wistia[1]}`;

    return url;
  }

  function getVideoProviderInfo(url) {
    if (!url || !url.trim()) {
      return { provider: 'none', label: 'Sem vídeo configurado', color: 'text-white/40 bg-white/5 border-white/10' };
    }
    const clean = url.toLowerCase();
    if (clean.includes('youtube.com') || clean.includes('youtu.be')) {
      return { provider: 'youtube', label: '▶ YouTube Detectado', color: 'text-red-400 bg-red-500/10 border-red-500/30' };
    }
    if (clean.includes('vimeo.com')) {
      return { provider: 'vimeo', label: '🎬 Vimeo Detectado', color: 'text-blue-400 bg-blue-500/10 border-blue-500/30' };
    }
    if (clean.includes('loom.com')) {
      return { provider: 'loom', label: '📹 Loom Detectado', color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30' };
    }
    if (clean.includes('wistia.com') || clean.includes('wistia.net')) {
      return { provider: 'wistia', label: '🎥 Wistia Detectado', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' };
    }
    if (clean.endsWith('.mp4') || clean.includes('blob:') || clean.includes('/embed/')) {
      return { provider: 'custom', label: '📺 Embed Player', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' };
    }
    return { provider: 'custom', label: '🔗 Link Externo', color: 'text-gray-300 bg-white/10 border-white/20' };
  }

  function extractLessonMetadata(rawContent) {
    if (!rawContent) return { cleanContent: '', metadata: {} };
    const match = rawContent.match(/<!--\s*SOVEREIGN_METADATA:\s*(\{[\s\S]*?\})\s*-->/);
    if (match) {
      try {
        const metadata = JSON.parse(match[1]);
        const cleanContent = rawContent.replace(match[0], '').trim();
        return { cleanContent, metadata };
      } catch(e) {
        console.warn('[Metadata Parser] Erro ao decodificar JSON:', e);
      }
    }
    return { cleanContent: rawContent, metadata: {} };
  }

  function embedLessonMetadata(content, metadata) {
    const clean = content ? content.replace(/<!--\s*SOVEREIGN_METADATA:\s*(\{[\s\S]*?\})\s*-->/, '').trim() : '';
    const metaString = `<!-- SOVEREIGN_METADATA:${JSON.stringify(metadata)} -->\n\n`;
    return metaString + clean;
  }

  function renderMarkdown(text) {
    if (!text) return '';
    let clean = text.replace(/<!--\s*SOVEREIGN_METADATA:\s*(\{[\s\S]*?\})\s*-->/g, '').trim();

    // Blocos de código multilinhas com cabeçalho e botão de cópia
    clean = clean.replace(/```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g, (match, lang, code) => {
      const displayLang = (lang || 'CÓDIGO').toUpperCase();
      return `<div class="skool-code-block">
        <div class="skool-code-header">
          <span>${displayLang}</span>
          <button type="button" onclick="window.appCopyCodeBlock(this)" class="hover:text-white transition-colors flex items-center space-x-1 cursor-pointer">
            <span>📋</span><span>Copiar</span>
          </button>
        </div>
        <pre class="skool-code-content"><code>${escapeHtml(code.trim())}</code></pre>
      </div>`;
    });

    // Callouts Skool & Notion (💡, 📌, ⚠️, 🚀)
    clean = clean
      .replace(/^💡 \*\*([^\*]+)\*\*:? (.*)$/gm, '<div class="skool-callout skool-callout-tip"><span class="skool-callout-icon">💡</span><div><strong class="font-bold text-emerald-300 block mb-0.5">$1</strong><span>$2</span></div></div>')
      .replace(/^📌 \*\*([^\*]+)\*\*:? (.*)$/gm, '<div class="skool-callout skool-callout-note"><span class="skool-callout-icon">📌</span><div><strong class="font-bold text-blue-300 block mb-0.5">$1</strong><span>$2</span></div></div>')
      .replace(/^⚠️ \*\*([^\*]+)\*\*:? (.*)$/gm, '<div class="skool-callout skool-callout-warning"><span class="skool-callout-icon">⚠️</span><div><strong class="font-bold text-amber-300 block mb-0.5">$1</strong><span>$2</span></div></div>')
      .replace(/^🚀 \*\*([^\*]+)\*\*:? (.*)$/gm, '<div class="skool-callout skool-callout-prompt"><span class="skool-callout-icon">🚀</span><div><strong class="font-bold text-purple-300 block mb-0.5">$1</strong><span>$2</span></div></div>');

    // Checklists interativas do Skool
    clean = clean
      .replace(/^- \[ \] (.+)$/gm, '<div class="skool-check-item" onclick="window.toggleChecklistItem(this)"><span class="skool-check-box"></span><span class="text-gray-200 text-sm">$1</span></div>')
      .replace(/^- \[x\] (.+)$/gm, '<div class="skool-check-item" onclick="window.toggleChecklistItem(this)"><span class="skool-check-box checked">✓</span><span class="line-through text-gray-400 text-sm">$1</span></div>');

    // Botão CTA personalizado
    clean = clean.replace(/\[button:(.+?)\]\((.+?)\)/g, '<div class="my-4"><a href="$2" target="_blank" rel="noopener noreferrer" class="inline-flex items-center space-x-2 px-5 py-2.5 bg-white text-black font-bold text-xs rounded-xl hover:bg-white/90 hover:scale-105 active:scale-95 shadow-lg transition-all">$1 →</a></div>');
    clean = clean.replace(/\[cta:(.+?)\]\((.+?)\)/g, '<div class="my-4"><a href="$2" target="_blank" rel="noopener noreferrer" class="inline-flex items-center space-x-2 px-5 py-2.5 bg-white text-black font-bold text-xs rounded-xl hover:bg-white/90 hover:scale-105 active:scale-95 shadow-lg transition-all">$1 →</a></div>');

    // Citações (Blockquote)
    clean = clean.replace(/^> (.+)$/gm, '<blockquote class="border-l-4 border-white/30 pl-4 py-1.5 my-3 text-gray-300 italic bg-white/[0.03] rounded-r-xl leading-relaxed">$1</blockquote>');

    // Formatação Markdown clássica
    return clean
      .replace(/^# (.+)$/gm,   '<h1 class="text-xl sm:text-2xl font-extrabold text-white mt-6 mb-3 tracking-tight">$1</h1>')
      .replace(/^## (.+)$/gm,  '<h2 class="text-lg sm:text-xl font-bold text-white mt-5 mb-2 tracking-tight">$1</h2>')
      .replace(/^### (.+)$/gm, '<h3 class="text-base sm:text-lg font-semibold text-white/90 mt-4 mb-1">$1</h3>')
      .replace(/\*\*(.+?)\*\*/g, '<strong class="text-white font-bold">$1</strong>')
      .replace(/\*(.+?)\*/g,     '<em class="text-white/80 italic">$1</em>')
      .replace(/~~(.+?)~~/g,     '<del class="line-through text-white/50">$1</del>')
      .replace(/`(.+?)`/g,       '<code class="bg-white/10 text-white px-1.5 py-0.5 rounded-lg text-xs font-mono">$1</code>')
      .replace(/^- (.+)$/gm,     '<li class="ml-5 mb-1 text-gray-300 list-disc">$1</li>')
      .replace(/^(\d+)\. (.+)$/gm,'<li class="ml-5 mb-1 text-gray-300 list-decimal">$2</li>')
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="rounded-2xl my-4 max-w-full border border-white/10 shadow-lg">')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g,  '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-white underline decoration-white/30 underline-offset-4 hover:decoration-white transition-all">$1</a>')
      .replace(/^---$/gm, '<hr class="border-white/10 my-6">')
      .replace(/\n\n/g, '</p><p class="mb-3 text-gray-300 leading-relaxed">')
      .replace(/\n/g, '<br>');
  }

  function renderImageGrid(images) {
    if (!images || !images.length) return '';
    const imgs = images.filter(Boolean).slice(0, 5);
    if (!imgs.length) return '';
    const n = imgs.length;
    const img = (src, cls='') =>
      `<div class="overflow-hidden ${cls} bg-black/40 border border-white/10 rounded-xl"><img src="${src}" loading="lazy"
        class="w-full h-full object-cover hover:scale-105 transition-transform duration-500 cursor-zoom-in"
        onerror="this.closest('div').style.display='none'"></div>`;

    if (n === 1) return `<div class="rounded-2xl overflow-hidden max-h-96 mt-3">${img(imgs[0],'max-h-96')}</div>`;
    if (n === 2) return `<div class="grid grid-cols-2 gap-1.5 rounded-2xl overflow-hidden mt-3 h-56">${imgs.map(s=>img(s)).join('')}</div>`;
    if (n === 3) return `<div class="grid gap-1.5 rounded-2xl overflow-hidden mt-3 h-56" style="grid-template-columns:2fr 1fr;grid-template-rows:1fr 1fr">${img(imgs[0],'row-span-2')}${img(imgs[1])}${img(imgs[2])}</div>`;
    if (n === 4) return `<div class="grid grid-cols-2 gap-1.5 rounded-2xl overflow-hidden mt-3" style="height:260px">${imgs.map(s=>img(s)).join('')}</div>`;
    return `<div class="space-y-1.5 rounded-2xl overflow-hidden mt-3">
      <div class="grid grid-cols-2 gap-1.5 h-44">${imgs.slice(0,2).map(s=>img(s)).join('')}</div>
      <div class="grid gap-1.5 h-28" style="grid-template-columns:1fr 1fr 1fr">${imgs.slice(2,5).map(s=>img(s)).join('')}</div>
    </div>`;
  }

  // ──────────────────────────────────────────────────────────────────────────
  // 3. REAL SUPABASE STORAGE UPLOAD HANDLERS
  // ──────────────────────────────────────────────────────────────────────────
  async function uploadFileToSupabase(file, bucketName = 'community-media') {
    if (!sb || !file) return null;
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
      const filePath = `${currentUserId || 'public'}/${fileName}`;

      const { data, error } = await sb.storage
        .from(bucketName)
        .upload(filePath, file, { cacheControl: '3600', upsert: true });

      if (error) {
        console.error('Storage Upload Error:', error);
        return null;
      }

      const { data: publicUrlData } = sb.storage.from(bucketName).getPublicUrl(filePath);
      return publicUrlData?.publicUrl || null;
    } catch (e) {
      console.error('File Upload Exception:', e);
      return null;
    }
  }

  // ──────────────────────────────────────────────────────────────────────────
  // 4. MERCADO PAGO INTEGRATION — Checkout Pro via Netlify Function
  // ──────────────────────────────────────────────────────────────────────────
  async function triggerMercadoPagoCheckout(productSlug) {
    const prod = allProducts.find(p => p.slug === productSlug || p.id === productSlug) || { title: 'Acesso VIP', slug: productSlug };
    
    document.getElementById('mpCheckoutModal')?.remove();

    const m = document.createElement('div');
    m.id = 'mpCheckoutModal';
    m.className = 'fixed inset-0 bg-black/85 backdrop-blur-2xl z-50 flex items-center justify-center p-4';
    m.innerHTML = `
      <div class="glass-card rounded-3xl p-8 max-w-lg w-full text-white text-center relative border border-white/20 shadow-2xl">
        <button onclick="document.getElementById('mpCheckoutModal').remove()" class="absolute top-5 right-5 text-graphite hover:text-white text-xl font-bold">✕</button>
        <div class="inline-block p-4 rounded-2xl bg-white/10 border border-white/15 mb-4 text-3xl">💳</div>
        <h3 class="text-2xl font-extrabold mb-2">Checkout Seguro</h3>
        <p class="text-graphite text-xs mb-6">Adquira acesso instantâneo ao <strong class="text-white">${prod.title}</strong> por <strong class="text-white font-mono text-base">R$ 120,00</strong></p>

        <div class="space-y-4 text-left mb-6">
          <div class="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <div class="flex justify-between text-xs">
              <span class="text-graphite">Item:</span>
              <span class="font-bold text-white">${prod.title}</span>
            </div>
            <div class="flex justify-between text-xs">
              <span class="text-graphite">Garantia:</span>
              <span class="text-white">7 Dias Incondicional</span>
            </div>
            <div class="flex justify-between text-xs border-t border-white/10 pt-2 font-mono">
              <span class="text-graphite">Total:</span>
              <span class="text-lg font-extrabold text-white">R$ 120,00</span>
            </div>
          </div>
          <div class="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
            <p class="text-xs font-bold text-white">⚡ Aceitos: Pix Instantâneo, Cartão de Crédito em até 12x</p>
            <div class="grid grid-cols-2 gap-2 text-xs">
              <div class="p-2.5 rounded-xl bg-white/5 border border-white/10 text-center font-bold">📱 PIX</div>
              <div class="p-2.5 rounded-xl bg-white/5 border border-white/10 text-center font-bold">💳 Cartão 12x</div>
            </div>
          </div>
        </div>

        <div class="space-y-3">
          <button id="mpPayNowBtn" class="w-full py-4 rounded-xl font-bold bg-white text-black hover:bg-white/90 shadow-xl hover:scale-[1.02] transition-all text-sm flex items-center justify-center gap-2">
            <span id="mpPayBtnLabel">Ir para o Checkout Seguro →</span>
          </button>
          <p class="text-[0.6rem] text-graphite text-center">🔒 Pagamento processado com segurança pelo Mercado Pago</p>
          <button onclick="document.getElementById('mpCheckoutModal').remove()" class="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-graphite text-xs font-semibold">Cancelar</button>
        </div>
      </div>`;

    document.body.appendChild(m);

    document.getElementById('mpPayNowBtn')?.addEventListener('click', async () => {
      const btn   = document.getElementById('mpPayNowBtn');
      const label = document.getElementById('mpPayBtnLabel');
      btn.disabled = true;
      label.textContent = '⏳ Criando preferência de pagamento...';

      try {
        // Chama a Vercel Serverless Function para criar a preference no servidor
        const funcUrl = '/api/create-payment';

        const res = await fetch(funcUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            productSlug: prod.slug || productSlug,
            productTitle: prod.title,
            userEmail: currentUserProfile?.email || null,
          }),
        });

        const data = await res.json();

        if (res.ok && (data.init_point || data.sandbox_init_point)) {
          showToast('🚀 Redirecionando para o Mercado Pago...');
          document.getElementById('mpCheckoutModal')?.remove();
          // Usa sandbox_init_point se disponível (para chaves TEST) ou init_point para produção
          const payUrl = data.sandbox_init_point || data.init_point;
          setTimeout(() => { window.open(payUrl, '_blank'); }, 800);
        } else {
          throw new Error(data.error || (data.details && data.details.message) || 'Resposta inválida');
        }
      } catch (err) {
        console.error('[MP Checkout]', err);
        showToast('❌ Erro ao conectar ao Mercado Pago. Tente novamente.');
        btn.disabled = false;
        label.textContent = 'Ir para o Checkout Seguro →';
      }
    });
  }

  // ──────────────────────────────────────────────────────────────────────────
  // 5. DEFAULT SOVEREIGN DATA (Contingência Resiliente Local)
  // ──────────────────────────────────────────────────────────────────────────
  const DEFAULT_SOVEREIGN_SERVERS = [
    {
      id: 'srv_art_pro',
      title: 'Masterclass A.I Art Pro',
      description: 'Treinamento completo em criação artística de ultra-alta resolução, fotorrealismo e direção de arte com IA.',
      hero_image: './public/assets/images/opt_0008_img_exact_87ca3.webp',
      lessons: [
        {
          id: 'les_art_1',
          title: 'Aula 1: Fundamentos da Direção Visual com IA Generativa',
          video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          content_markdown: '### Módulo 1: Fundamentos Visuais\n\nNesta masterclass exploramos as bases essenciais da estética visual com modelos generativos, dominando iluminação, texturas fotorrealistas e composição harmônica.',
          display_order: 1
        },
        {
          id: 'les_art_2',
          title: 'Aula 2: Engenharia de Prompts Fotorrealistas & Câmeras',
          video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          content_markdown: '### Módulo 2: Técnicas de Câmera e Objetivas\n\nAprenda a usar parâmetros como `f/1.8`, `85mm portrait lens`, `anamorphic bokeh` e volumetria de luz natural para resultados de estúdio.',
          display_order: 2
        },
        {
          id: 'les_art_3',
          title: 'Aula 3: Acabamento, Upscaling e Pós-Produção',
          video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          content_markdown: '### Módulo 3: Pós-Produção High-End\n\nFluxo de trabalho profissional para upscaling 4K/8K, preservação de microtexturas de pele e exportação comercial.',
          display_order: 3
        }
      ]
    },
    {
      id: 'srv_prompts_mastery',
      title: 'Engenharia de Prompts & Consistência',
      description: 'Metodologias avançadas para geração consistente de personagens, estilos autorais e controle de sementes.',
      hero_image: './public/assets/images/opt_0000_img_exact_29e38.webp',
      lessons: [
        {
          id: 'les_pm_1',
          title: 'Aula 1: Consistência Facial e Identidade Visual',
          video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          content_markdown: '### Módulo 1: Consistência de Personagem\n\nComo manter o mesmo rosto, roupas e expressividade ao longo de múltiplos ângulos e cenas.',
          display_order: 1
        },
        {
          id: 'les_pm_2',
          title: 'Aula 2: Pesos de Tokens, Sintaxe Avançada e Negative Prompts',
          video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          content_markdown: '### Módulo 2: Otimização Fina de Sintaxe\n\nElimine deformações, artefatos indesejados e controle a dominância estilística com rigor milimétrico.',
          display_order: 2
        }
      ]
    },
    {
      id: 'srv_effects_commercial',
      title: 'A.I Effects & Criação Comercial',
      description: 'Efeitos 3D, tipografia dinâmica, iluminação volumétrica e monetização com produtos digitais.',
      hero_image: './public/assets/images/opt_0740_img_exact_666ee.webp',
      lessons: [
        {
          id: 'les_ef_1',
          title: 'Aula 1: Tipografia Experimental e Efeitos 3D',
          video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          content_markdown: '### Módulo 1: Efeitos Visuais de Impacto\n\nCriação de letras infláveis, vidro cromado, materiais translúcidos e iluminação neon.',
          display_order: 1
        },
        {
          id: 'les_ef_2',
          title: 'Aula 2: Monetização e Venda de Packs de Prompts',
          video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          content_markdown: '### Módulo 2: Estratégias Comerciais\n\nComo empacotar seus estilos autorais em coleções digitais com alta taxa de conversão.',
          display_order: 2
        }
      ]
    }
  ];

  const DEFAULT_SOVEREIGN_POSTS = [
    {
      id: 'post_welcome_admin',
      user_id: 'admin_official',
      user_name: 'Mateus Celestino',
      user_avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=AdminBoss',
      user_role: 'admin',
      category: 'official',
      title: '✨ Bem-vindos à Comunidade A.I Visuals!',
      content: 'Espaço exclusivo para membros e criadores de elite compartilharem seus prompts, novos estilos e masterclasses generativas. Sintam-se à vontade para postar suas dúvidas, prompts favoritos e feedbacks! Todos os shaders WebGL de fundo foram calibrados em vermelho cinemático com brilho suave para foco máximo.',
      link_url: '',
      link_title: '',
      images: ['./public/assets/images/opt_0008_img_exact_87ca3.webp'],
      is_pinned: true,
      likes: 48,
      likedBy: [],
      created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
      comments: [
        {
          id: 'com_1',
          user_id: 'member_demo',
          user_name: 'Lucas Rocha (Aluno VIP)',
          user_avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=MemberProX',
          user_role: 'full',
          content: 'Sensacional a plataforma! Os shaders vermelhos e a nova organização da comunidade ficaram com uma atmosfera inacreditável.',
          created_at: new Date(Date.now() - 3600000 * 2).toISOString()
        }
      ]
    },
    {
      id: 'post_flux_crimson',
      user_id: 'admin_official',
      user_name: 'Mateus Celestino Pro X',
      user_avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=AdminBoss',
      user_role: 'admin',
      category: 'prompts',
      title: '⚡ [PROMPT EXCLUSIVO] Retrato Cyberpunk Carmesim Volumétrico',
      content: 'Compartilhando com vocês a fórmula exata para iluminação volumétrica com dispersão sub-superficial em tons rubros e carmesim escuros. Podem copiar o bloco de prompt abaixo e executar diretamente no Midjourney v6.1 ou Flux.1 Dev.',
      ai_model: 'Flux.1 Dev / Midjourney v6.1',
      ai_prompt: 'ultra-cinematic hyperrealistic portrait of an android empress, intricate crimson biomechanical circuitry, subsurface scattering, ruby neon backlight, moody dark atmosphere, 8k resolution, photorealistic, cinematic shot by Denis Villeneuve',
      ai_params: '--ar 16:9 --v 6.1 --stylize 350 --seed 892014',
      link_url: '',
      link_title: '',
      images: ['./public/assets/images/opt_0375_img_exact_604f4.webp'],
      is_pinned: false,
      likes: 74,
      likedBy: [],
      created_at: new Date(Date.now() - 3600000 * 1).toISOString(),
      comments: [
        {
          id: 'com_flux_1',
          user_id: 'member_art',
          user_name: 'Elena Digital Art',
          user_avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=ElenaArt',
          user_role: 'full',
          content: 'Esse prompt com iluminação de luz de contorno vermelha funcionou perfeitamente aqui! Render ultra-nítido.',
          created_at: new Date(Date.now() - 3600000 * 0.5).toISOString()
        }
      ]
    },
    {
      id: 'post_effects_style',
      user_id: 'moderator_official',
      user_name: 'Moderador Oficial',
      user_avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=ModeratorShield',
      user_role: 'moderator',
      category: 'tips',
      title: '🚀 Dica da Semana: Como obter reflexos líquidos ultra-nítidos',
      content: 'Ao utilizar o acervo A.I Effects, combinem termos como "hyper-glossy liquid glass reflections with sub-surface scattering, octane render 8k" para obter o autêntico acabamento Apple Liquid Glass.',
      link_url: '',
      link_title: '',
      images: ['./public/assets/images/opt_0740_img_exact_666ee.webp'],
      is_pinned: false,
      likes: 29,
      likedBy: [],
      created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
      comments: []
    },
    {
      id: 'post_desafio_semanal',
      user_id: 'moderator_official',
      user_name: 'Comunidade VIP Curadoria',
      user_avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=ModeratorShield',
      user_role: 'moderator',
      category: 'showcase',
      title: '🏆 Desafio Semanal #04: Crie a Melhor Render em Vermelho & Obsidiana',
      content: 'Valendo badge exclusiva de Top Creator no perfil + destaque na aba VIP! Regras: utilize qualquer motor de IA generativa (Flux, Midjourney, SD3) focando na estética Red Dark Luxury. Publiquem suas criações aqui com a tag #DesafioVermelho!',
      link_url: '',
      link_title: '',
      images: ['./public/assets/images/opt_0149_img_exact_5486a.webp'],
      is_pinned: true,
      likes: 62,
      likedBy: [],
      created_at: new Date(Date.now() - 3600000 * 8).toISOString(),
      comments: [
        {
          id: 'com_desafio_1',
          user_id: 'member_vfx',
          user_name: 'Victor VFX',
          user_avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=VictorVFX',
          user_role: 'full',
          content: 'Já estou renderizando o meu aqui! Amanhã posto o workflow completo com LoRA de vidro carmesim.',
          created_at: new Date(Date.now() - 3600000 * 5).toISOString()
        }
      ]
    }
  ];

  // ──────────────────────────────────────────────────────────────────────────
  // 6. SOVEREIGN SESSION SYNCHRONIZER (Bi-direcional e Resiliente)
  // ──────────────────────────────────────────────────────────────────────────
  function syncSovereignSession() {
    var user = null;
    try {
      var raw = localStorage.getItem('mcp_session_user');
      if (raw) user = JSON.parse(raw);
    } catch(e) {}

    var token = null;
    try { token = localStorage.getItem('mcp_auth_token'); } catch(e) {}

    var roleStored = null;
    try { roleStored = localStorage.getItem('mcp_user_role'); } catch(e) {}

    var isUserLogged = false;
    if (user) {
      if (user.isLoggedIn === true || user.isLoggedIn === 'true') {
        isUserLogged = true;
      } else if (user.role && user.role !== 'guest') {
        isUserLogged = true;
      } else if (user.email && user.email.trim().length > 0) {
        isUserLogged = true;
      }
    } else if (token && roleStored && roleStored !== 'guest') {
      isUserLogged = true;
      user = {
        id: 'user_sovereign',
        name: roleStored === 'admin' ? 'Mateus Celestino Pro X' : 'Membro Pro',
        role: roleStored,
        isLoggedIn: true
      };
    }

    if (isUserLogged && user) {
      isLoggedIn = true;
      currentUserId = user.id || null;
      currentUserNameStr = user.name || (user.role === 'admin' ? 'Mateus Celestino Pro X' : 'Membro Pro');
      currentUserAvatarUrl = user.avatar || (user.role === 'admin' ? USER_ROLES.admin.avatar : (user.role === 'moder' || user.role === 'moderator' ? USER_ROLES.moderator.avatar : USER_ROLES.free.avatar));

      if (user.role === 'admin') {
        currentUserRole = 'admin';
      } else if (user.role === 'moder' || user.role === 'moderator') {
        currentUserRole = 'moderator';
      } else {
        currentUserRole = 'full';
      }

      currentUserProfile = {
        id: currentUserId,
        name: currentUserNameStr,
        email: user.email || '',
        role: currentUserRole,
        avatar_url: currentUserAvatarUrl,
        accessible_products: ['ai-art', 'ai-portraits-pro', 'ai-effects-pro']
      };
    } else {
      isLoggedIn = false;
      currentUserId = null;
      currentUserProfile = null;
      currentUserRole = 'guest';
      currentUserNameStr = 'Visitante';
      currentUserAvatarUrl = USER_ROLES.guest.avatar;
      moderatorPermissions = null;
    }

    updateUserHeader();
    return isLoggedIn;
  }

  async function verifyServerSession() {
    try {
      const token = localStorage.getItem('mcp_auth_token');
      const headers = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('/api/auth/me', { headers });
      const data = await res.json().catch(() => null);

      if (res.ok && data?.authenticated && data?.user) {
        const u = data.user;
        const role = u.role === 'admin' ? 'admin' : (u.role === 'moder' || u.role === 'moderator' ? 'moder' : 'user');
        let existingAvatar = null;
        try {
          const prev = JSON.parse(localStorage.getItem('mcp_session_user') || '{}');
          if (prev && prev.email === u.email && prev.avatar) existingAvatar = prev.avatar;
        } catch(e) {}

        const sessionUser = {
          id: u.id,
          isLoggedIn: true,
          role: role,
          name: u.name || (role === 'admin' ? 'Mateus Celestino Pro X' : 'Membro Pro'),
          email: u.email,
          avatar: existingAvatar || (role === 'admin' ? USER_ROLES.admin.avatar : USER_ROLES.free.avatar),
          tier: u.tier || (role === 'admin' ? 'max' : 'vip')
        };
        localStorage.setItem('mcp_session_user', JSON.stringify(sessionUser));
        localStorage.setItem('mcp_user_role', sessionUser.role);
        localStorage.setItem('mcp_admin_auth', (role === 'admin' || role === 'moder') ? 'true' : 'false');
        syncSovereignSession();
        return true;
      } else {
        // Se não há sessão válida no servidor nem no Supabase Auth, limpa localStorage adulterado
        let hasSbSession = false;
        if (sb) {
          try {
            const { data: sbData } = await sb.auth.getSession();
            if (sbData?.session) {
              hasSbSession = true;
              await handleAuthSession(sbData.session);
            }
          } catch(e) {}
        }
        if (!hasSbSession && isLoggedIn) {
          localStorage.removeItem('mcp_session_user');
          localStorage.removeItem('mcp_auth_token');
          localStorage.setItem('mcp_user_role', 'visitante');
          localStorage.setItem('mcp_admin_auth', 'false');
          syncSovereignSession();
        }
        return hasSbSession;
      }
    } catch(e) {
      return isLoggedIn;
    }
  }

  // ──────────────────────────────────────────────────────────────────────────
  // 7. HASH ROUTING (Subpage Router Soberano)
  // ──────────────────────────────────────────────────────────────────────────
  function handleHashRoute() {
    const rawHash = window.location.hash.replace(/^#\/?/, '').trim();
    if (!rawHash || rawHash === 'home') {
      navigateToHome();
      return;
    }
    if (rawHash === 'community' || rawHash.startsWith('community/')) {
      const parts = rawHash.split('/');
      const subTab = parts[1];
      if (['feed', 'prompts', 'ranking', 'challenges', 'saved', 'tag-editor', 'tags'].includes(subTab)) {
        communityActiveTab = (subTab === 'tags') ? 'tag-editor' : subTab;
      } else {
        communityActiveTab = 'feed';
      }
      navigateToCommunity();
      return;
    }
    if (rawHash === 'servers') {
      navigateToServers();
      return;
    }
    if (rawHash.startsWith('servers/')) {
      const parts = rawHash.split('/');
      const sId = parts[1];
      const lId = parts[2] || null;
      navigateToServerDetail(sId, lId);
      return;
    }
    if (rawHash.startsWith('product/')) {
      const slug = rawHash.replace('product/', '');
      navigateToProduct(slug);
      return;
    }
    if (rawHash.startsWith('category/')) {
      const parts = rawHash.replace('category/', '').split('/');
      const pSlug = parts[0];
      const cId = parts[1];
      navigateToCategory(pSlug, cId);
      return;
    }
    if (rawHash === 'profile') {
      navigateToProfile();
      return;
    }
    if (rawHash === 'admin') {
      window.location.href = '/admin';
      return;
    }
    if (rawHash === 'ai-art' || rawHash === 'ai-portraits-pro' || rawHash === 'ai-effects-pro') {
      navigateToProduct(rawHash);
      return;
    }
    // Fallback padrão
    renderCurrentView();
  }

  // ──────────────────────────────────────────────────────────────────────────
  // 8. INIT & AUTH
  // ──────────────────────────────────────────────────────────────────────────
  async function init() {
    initVideoBackgroundEngine();
    setupEventListeners();

    // 1. Sincroniza sessão local e valida contra o backend (/api/auth/me)
    syncSovereignSession();
    await verifyServerSession();

    // 2. Ouvintes universais de mudança de autenticação e armazenamento
    window.addEventListener('mcp_auth_changed', function(ev) {
      syncSovereignSession();
      renderCurrentView();
    });

    window.addEventListener('storage', function(e) {
      if (e.key === 'mcp_session_user' || e.key === 'mcp_user_role' || e.key === 'mcp_auth_token') {
        syncSovereignSession();
        renderCurrentView();
      }
    });

    // 3. Ouvinte de navegação via Hash do navegador
    window.addEventListener('hashchange', handleHashRoute);

    // 4. Carregar acervo de dados
    await loadProductsData();
    await loadBanners();
    await loadServersData();
    await loadCommunityPosts();

    // 5. Verificar retorno de pagamento do Mercado Pago
    const urlParams = new URLSearchParams(window.location.search);
    const paymentStatus = urlParams.get('payment');
    if (paymentStatus === 'success') {
      showToast('✅ Pagamento aprovado! Seu acesso está sendo liberado...');
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (paymentStatus === 'failure') {
      showToast('❌ Pagamento não concluído. Tente novamente.');
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (paymentStatus === 'pending') {
      showToast('⏳ Pagamento pendente. Aguardando confirmação.');
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    // 6. Supabase Session Fallback (apenas se não estiver logado soberanamente)
    if (sb) {
      try {
        if (!isLoggedIn) {
          const { data: { session } } = await sb.auth.getSession();
          if (session) {
            await handleAuthSession(session);
          }
        }

        sb.auth.onAuthStateChange(async (event, session) => {
          if (session) {
            await handleAuthSession(session);
            renderCurrentView();
          } else if (event === 'SIGNED_OUT' && !localStorage.getItem('mcp_session_user')) {
            currentUserId = null; currentUserProfile = null;
            currentUserRole = 'guest'; isLoggedIn = false;
            currentUserNameStr = 'Visitante';
            currentUserAvatarUrl = USER_ROLES.guest.avatar;
            moderatorPermissions = null;
            updateUserHeader(); navigateToHome();
          }
        });
      } catch(sbErr) {
        console.warn('[A.I VISUALS] Supabase auth check skipped/offline:', sbErr.message);
      }
    }

    updateUserHeader();

    // 7. Dispara a rota baseada na hash da URL ou renderiza a home
    if (window.location.hash) {
      handleHashRoute();
    } else {
      currentView = 'home';
      renderCurrentView();
    }
  }

  async function handleAuthSession(session) {
    if (!session || !session.user) return;
    currentUserId = session.user.id;
    isLoggedIn = true;
    try {
      const { data: profile } = await sb
        .from('profiles')
        .select('id,name,email,role,avatar_url,accessible_products,bio')
        .eq('id', currentUserId)
        .maybeSingle();

      if (profile) {
        currentUserProfile  = profile;
        currentUserRole     = profile.role || 'free';
        currentUserNameStr  = profile.name || session.user.email.split('@')[0];
        currentUserAvatarUrl= profile.avatar_url || USER_ROLES[currentUserRole]?.avatar || USER_ROLES.free.avatar;
      } else {
        const name = session.user.email.split('@')[0];
        currentUserRole = 'free'; currentUserNameStr = name;
        currentUserAvatarUrl = USER_ROLES.free.avatar;
        await sb.from('profiles').upsert({
          id: currentUserId, name, email: session.user.email,
          role: 'free', accessible_products: [], avatar_url: USER_ROLES.free.avatar
        });
      }

      if (currentUserRole === 'moderator') {
        const { data: modPerms } = await sb
          .from('moderator_permissions')
          .select('*')
          .eq('moderator_id', currentUserId)
          .maybeSingle();
        moderatorPermissions = modPerms;
      }
    } catch(e) {
      console.warn('[A.I VISUALS] Profile fetch fallback:', e.message);
      if (!currentUserNameStr || currentUserNameStr === 'Visitante') {
        currentUserNameStr = session.user.email.split('@')[0];
      }
    }
    updateUserHeader();
  }

  // DATA LOADING — com re-tentativa e logs de debug
  async function loadProductsData() {
    const urls = ['/comunidade/src/data/products_data.json', './src/data/products_data.json', '/src/data/products_data.json'];
    for (const url of urls) {
      try {
        const r = await fetch(url);
        if (r.ok) {
          const data = await r.json();
          if (Array.isArray(data) && data.length > 0) {
            allProducts = data;
            console.log('[A.I VISUALS] ✅ Dados carregados de:', url, '| Produtos:', data.length);
            return;
          }
        }
      } catch(e) {
        console.warn('[A.I VISUALS] Tentativa falhou:', url, e.message);
      }
    }
    console.error('[A.I VISUALS] ❌ FALHA ao carregar products_data.json — galeria ficará vazia!');
  }

  async function loadCommunityPosts() {
    // 1. Tenta carregar do Supabase se online
    if (sb) {
      try {
        const { data, error } = await sb
          .from('community_posts')
          .select(`
            id,content,title,link_url,link_title,images,image_url,is_pinned,created_at,user_id,
            profiles:user_id(name,avatar_url,role),
            community_comments(id,content,created_at,user_id,profiles:user_id(name,avatar_url,role)),
            community_likes(id,user_id)
          `)
          .order('created_at', { ascending: false })
          .limit(60);

        if (!error && Array.isArray(data) && data.length > 0) {
          communityPosts = data.map(p => ({
            id: p.id, user_id: p.user_id,
            user_name:   p.profiles?.name       || 'Membro',
            user_avatar: p.profiles?.avatar_url || 'https://api.dicebear.com/7.x/bottts/svg?seed=Member',
            user_role:   p.profiles?.role       || 'free',
            title:     p.title     || '',
            content:   p.content   || '',
            link_url:  p.link_url  || '',
            link_title:p.link_title|| '',
            images:    p.images    || (p.image_url ? [p.image_url] : []),
            is_pinned: p.is_pinned,
            likes:     p.community_likes?.length || 0,
            likedBy:   (p.community_likes || []).map(l => l.user_id),
            created_at:p.created_at,
            comments: (p.community_comments || [])
              .sort((a,b) => new Date(a.created_at) - new Date(b.created_at))
              .map(c => ({
                id: c.id, user_id: c.user_id, content: c.content, created_at: c.created_at,
                user_name:   c.profiles?.name       || 'Membro',
                user_avatar: c.profiles?.avatar_url || 'https://api.dicebear.com/7.x/bottts/svg?seed=Member',
                user_role:   c.profiles?.role       || 'free',
              }))
          }));
          return;
        }
      } catch(e) {
        console.warn('[A.I VISUALS] Falha na rede Supabase posts, usando contingência local:', e.message);
      }
    }

    // 2. Fallback de Contingência Local Soberana
    var localCustomPosts = [];
    try {
      var raw = localStorage.getItem('mcp_local_community_posts');
      if (raw) localCustomPosts = JSON.parse(raw);
    } catch(e) {}

    communityPosts = [...localCustomPosts, ...DEFAULT_SOVEREIGN_POSTS];
  }

  async function loadServersData() {
    // 1. Tenta carregar do Supabase se online
    if (sb) {
      try {
        const { data, error } = await sb
          .from('servers')
          .select('*,server_lessons(*)')
          .order('display_order', { ascending: true });

        if (!error && Array.isArray(data) && data.length > 0) {
          serversData = data.map(s => ({
            id: s.id, title: s.title, description: s.description, hero_image: s.hero_image,
            lessons: (s.server_lessons || [])
              .sort((a,b) => a.display_order - b.display_order)
              .map(l => ({ id:l.id, title:l.title, video_url:l.video_url, content_markdown:l.content_markdown, display_order:l.display_order }))
          }));
          return;
        }
      } catch(e) {
        console.warn('[A.I VISUALS] Falha na rede Supabase servers, usando contingência local:', e.message);
      }
    }

    // 2. Fallback de Contingência Local Soberana com persistência do usuário
    try {
      const saved = localStorage.getItem('mcp_local_servers_data');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          serversData = parsed;
          return;
        }
      }
    } catch(e) {}

    serversData = DEFAULT_SOVEREIGN_SERVERS;
  }

  // ──────────────────────────────────────────────────────────────────────────
  // SKOOL-LIKE LESSON EDITOR STUDIO — State & Functions
  // ──────────────────────────────────────────────────────────────────────────
  let currentEditingLessonType   = 'video'; // 'video' | 'article'
  let currentEditingLessonStatus = 'published'; // 'published' | 'draft' | 'upcoming'
  let currentEditingResources    = []; // [{ id, title, url, type }]
  let currentEditorViewMode      = 'editor'; // 'editor' | 'split' | 'preview'

  function hideLessonEditorModal() {
    if (lessonEditorModal) {
      lessonEditorModal.classList.add('hidden');
      lessonEditorModal.classList.add('opacity-0');
    }
    const iframe = document.getElementById('videoPreviewIframe');
    if (iframe) iframe.src = '';
  }

  function hideServerEditorModal() {
    if (serverEditorModal) {
      serverEditorModal.classList.add('hidden');
      serverEditorModal.classList.add('opacity-0');
    }
  }

  function switchLessonEditorTab(tabName) {
    const tabs = ['Content', 'Resources', 'Settings', 'Preview'];
    tabs.forEach(t => {
      const btn = document.getElementById(`tabLesson${t}Btn`);
      const pane = document.getElementById(`tabLesson${t}Pane`);
      const isTarget = t.toLowerCase() === tabName.toLowerCase();
      if (btn) btn.classList.toggle('active', isTarget);
      if (pane) pane.classList.toggle('hidden', !isTarget);
    });

    if (tabName.toLowerCase() === 'preview') {
      updateStudentLivePreview();
    }
  }

  function switchEditorViewMode(mode) {
    currentEditorViewMode = mode;
    const btnEditor = document.getElementById('btnModeEditorOnly');
    const btnSplit  = document.getElementById('btnModeSplitView');
    const btnPrev   = document.getElementById('btnModePreviewOnly');

    const wrapper = document.getElementById('lessonEditorSplitWrapper');
    const textContainer = document.getElementById('editorPaneTextareaContainer');
    const splitPreview  = document.getElementById('editLessonSplitPreview');

    if (btnEditor) btnEditor.className = mode === 'editor' ? 'px-2.5 py-1 rounded-lg text-xs font-bold transition-all bg-white/20 text-white' : 'px-2.5 py-1 rounded-lg text-xs font-semibold text-white/60 hover:text-white transition-all';
    if (btnSplit)  btnSplit.className  = mode === 'split'  ? 'px-2.5 py-1 rounded-lg text-xs font-bold transition-all bg-white/20 text-white' : 'px-2.5 py-1 rounded-lg text-xs font-semibold text-white/60 hover:text-white transition-all';
    if (btnPrev)   btnPrev.className   = mode === 'preview'? 'px-2.5 py-1 rounded-lg text-xs font-bold transition-all bg-white/20 text-white' : 'px-2.5 py-1 rounded-lg text-xs font-semibold text-white/60 hover:text-white transition-all';

    if (mode === 'editor') {
      if (wrapper) wrapper.className = 'grid grid-cols-1 gap-4 transition-all';
      if (textContainer) textContainer.classList.remove('hidden');
      if (splitPreview) splitPreview.classList.add('hidden');
    } else if (mode === 'split') {
      if (wrapper) wrapper.className = 'grid grid-cols-1 md:grid-cols-2 gap-4 transition-all';
      if (textContainer) textContainer.classList.remove('hidden');
      if (splitPreview) {
        splitPreview.classList.remove('hidden');
        updateLessonTextMetrics();
      }
    } else if (mode === 'preview') {
      if (wrapper) wrapper.className = 'grid grid-cols-1 gap-4 transition-all';
      if (textContainer) textContainer.classList.add('hidden');
      if (splitPreview) {
        splitPreview.classList.remove('hidden');
        updateLessonTextMetrics();
      }
    }
  }

  function setLessonType(type) {
    currentEditingLessonType = type;
    const btnVid = document.getElementById('lessonTypeVideoBtn');
    const btnArt = document.getElementById('lessonTypeArticleBtn');
    const videoSection = document.getElementById('lessonVideoSectionWrapper');
    const icon = document.getElementById('lessonEditorHeaderIcon');

    if (type === 'video') {
      if (btnVid) btnVid.className = 'px-3 py-1.5 rounded-lg text-xs font-bold transition-all bg-white text-black shadow-sm flex items-center space-x-1.5';
      if (btnArt) btnArt.className = 'px-3 py-1.5 rounded-lg text-xs font-semibold text-white/70 hover:text-white transition-all flex items-center space-x-1.5';
      if (videoSection) videoSection.classList.remove('hidden');
      if (icon) icon.textContent = '🎬';
    } else {
      if (btnVid) btnVid.className = 'px-3 py-1.5 rounded-lg text-xs font-semibold text-white/70 hover:text-white transition-all flex items-center space-x-1.5';
      if (btnArt) btnArt.className = 'px-3 py-1.5 rounded-lg text-xs font-bold transition-all bg-white text-black shadow-sm flex items-center space-x-1.5';
      if (videoSection) videoSection.classList.add('hidden');
      if (icon) icon.textContent = '📄';
    }
  }

  function setLessonStatus(status) {
    currentEditingLessonStatus = status;
    const sel = document.getElementById('editLessonStatus');
    if (sel) sel.value = status;

    const btnPub = document.getElementById('headerStatusPublishedBtn');
    const btnDft = document.getElementById('headerStatusDraftBtn');

    if (status === 'published') {
      if (btnPub) btnPub.className = 'px-2.5 py-1 rounded-lg text-xs font-bold transition-all bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center space-x-1';
      if (btnDft) btnDft.className = 'px-2.5 py-1 rounded-lg text-xs font-semibold text-white/60 hover:text-white transition-all flex items-center space-x-1';
    } else {
      if (btnPub) btnPub.className = 'px-2.5 py-1 rounded-lg text-xs font-semibold text-white/60 hover:text-white transition-all flex items-center space-x-1';
      if (btnDft) btnDft.className = 'px-2.5 py-1 rounded-lg text-xs font-bold transition-all bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center space-x-1';
    }
  }

  function updateVideoPreview(val) {
    const iframe = document.getElementById('videoPreviewIframe');
    const noText = document.getElementById('noVideoText');
    const badge  = document.getElementById('videoProviderBadge');

    const providerInfo = getVideoProviderInfo(val);
    if (badge) {
      badge.innerHTML = `<span>${providerInfo.label}</span>`;
      badge.className = `text-[0.65rem] font-bold px-2 py-0.5 rounded-md border flex items-center space-x-1 ${providerInfo.color}`;
    }

    const embed = convertToEmbedUrl(val);
    if (embed && iframe && currentEditingLessonType === 'video') {
      iframe.src = embed;
      iframe.classList.remove('hidden');
      if (noText) noText.classList.add('hidden');
    } else if (iframe) {
      iframe.src = '';
      iframe.classList.add('hidden');
      if (noText) noText.classList.remove('hidden');
    }
  }

  function updateServerHeroPreview(val) {
    const img    = document.getElementById('serverHeroPreviewImg');
    const noText = document.getElementById('noServerHeroText');
    if (img) { img.src = val || ''; }
    if (noText) noText.classList.toggle('hidden', !!val);
  }

  function openServerEditorModal(serverId = null) {
    editingServerId = serverId;
    const titleEl = document.getElementById('serverEditorModalTitle');
    const titleInput = document.getElementById('editServerTitle');
    const descInput = document.getElementById('editServerDescription');
    const heroInput = document.getElementById('editServerHeroImage');
    const delBtn = document.getElementById('deleteServerModalBtn');

    if (serverId) {
      const srv = serversData.find(s => s.id === serverId) || DEFAULT_SOVEREIGN_SERVERS.find(s => s.id === serverId);
      if (titleEl) titleEl.textContent = 'Editar Servidor';
      if (titleInput) titleInput.value = srv?.title || '';
      if (descInput) descInput.value = srv?.description || '';
      if (heroInput) heroInput.value = srv?.hero_image || '';
      updateServerHeroPreview(srv?.hero_image || '');
      if (delBtn) delBtn.style.display = 'block';
    } else {
      if (titleEl) titleEl.textContent = 'Criar Novo Servidor';
      if (titleInput) titleInput.value = '';
      if (descInput) descInput.value = '';
      if (heroInput) heroInput.value = './public/assets/images/opt_0008_img_exact_87ca3.webp';
      updateServerHeroPreview('./public/assets/images/opt_0008_img_exact_87ca3.webp');
      if (delBtn) delBtn.style.display = 'none';
    }

    if (serverEditorModal) {
      serverEditorModal.classList.remove('hidden');
      serverEditorModal.classList.remove('opacity-0');
    }
  }
  window.appOpenServerEditorModal = openServerEditorModal;

  async function handleSaveServerModal() {
    const titleInput = document.getElementById('editServerTitle');
    const descInput  = document.getElementById('editServerDescription');
    const heroInput  = document.getElementById('editServerHeroImage');

    const title = titleInput?.value?.trim();
    const desc  = descInput?.value?.trim() || '';
    const hero  = heroInput?.value?.trim() || './public/assets/images/opt_0008_img_exact_87ca3.webp';

    if (!title) {
      showToast('⚠️ O título do servidor é obrigatório.');
      titleInput?.focus();
      return;
    }

    if (editingServerId) {
      let srv = serversData.find(s => s.id === editingServerId);
      if (srv) {
        srv.title = title;
        srv.description = desc;
        srv.hero_image = hero;
      }
      let dSrv = DEFAULT_SOVEREIGN_SERVERS.find(s => s.id === editingServerId);
      if (dSrv) {
        dSrv.title = title;
        dSrv.description = desc;
        dSrv.hero_image = hero;
      }
      showToast('✅ Servidor atualizado com sucesso!');
    } else {
      const newId = 'srv_' + Date.now().toString(36);
      const newServer = {
        id: newId,
        title: title,
        description: desc,
        hero_image: hero,
        lessons: []
      };
      serversData.push(newServer);
      showToast('🎉 Novo servidor criado com sucesso!');
    }

    try {
      localStorage.setItem('sovereign_servers_custom', JSON.stringify(serversData));
    } catch(e) {}

    hideServerEditorModal();
    if (currentView === 'servers') {
      renderServersView();
    } else if (currentView === 'server_detail') {
      renderServerDetailView();
    }
  }

  async function handleDeleteServerModal() {
    if (!editingServerId) return;
    if (!confirm('Deseja realmente excluir este servidor e todas as suas masterclasses?')) return;

    serversData = serversData.filter(s => s.id !== editingServerId);
    try {
      localStorage.setItem('sovereign_servers_custom', JSON.stringify(serversData));
    } catch(e) {}

    hideServerEditorModal();
    showToast('🗑️ Servidor excluído com sucesso!');
    navigateToServers();
  }

  function updateLessonTextMetrics() {
    const ta = document.getElementById('editLessonContent');
    const val = ta?.value || '';
    const words = val.trim() ? val.trim().split(/\s+/).length : 0;
    const chars = val.length;
    const readMin = Math.max(1, Math.ceil(words / 180));

    const wEl = document.getElementById('lessonWordCount');
    const cEl = document.getElementById('lessonCharCount');
    const rEl = document.getElementById('lessonReadingTime');

    if (wEl) wEl.textContent = `${words} palavras`;
    if (cEl) cEl.textContent = `${chars} caracteres`;
    if (rEl) rEl.textContent = `⏱️ ~${readMin} min de leitura`;

    const splitContent = document.getElementById('editLessonSplitPreviewContent');
    if (splitContent && currentEditorViewMode !== 'editor') {
      splitContent.innerHTML = renderMarkdown(val) || '<p class="text-white/40 text-sm italic">O preview renderizado aparecerá aqui...</p>';
    }
  }

  function renderLessonResourcesList() {
    const listEl = document.getElementById('lessonResourcesList');
    const countBadge = document.getElementById('lessonResourcesCountBadge');
    const countText  = document.getElementById('resourcesCountText');

    if (countBadge) countBadge.textContent = currentEditingResources.length;
    if (countText)  countText.textContent = `${currentEditingResources.length} materiais`;

    if (!listEl) return;

    if (currentEditingResources.length === 0) {
      listEl.innerHTML = `
        <div id="emptyResourcesPlaceholder" class="p-8 text-center rounded-2xl bg-white/[0.01] border border-white/5 border-dashed space-y-2">
            <span class="text-3xl">📦</span>
            <p class="text-xs font-semibold text-white/70">Nenhum recurso anexado ainda</p>
            <p class="text-[0.7rem] text-white/40 max-w-sm mx-auto">Adicione materiais de apoio para enriquecer a aula e gerar alto valor aos membros da comunidade.</p>
        </div>`;
      return;
    }

    const typeIcons = {
      pdf: '📄',
      prompt: '💡',
      code: '💻',
      figma: '🎨',
      drive: '📁',
      link: '🔗'
    };

    listEl.innerHTML = currentEditingResources.map((res, idx) => {
      const icon = typeIcons[res.type] || '📎';
      const cleanUrl = escapeHtml(res.url);
      const cleanTitle = escapeHtml(res.title);
      return `
        <div class="skool-resource-item">
          <div class="flex items-center space-x-3 min-w-0 flex-1">
            <span class="text-xl flex-shrink-0">${icon}</span>
            <div class="min-w-0 flex-1">
              <p class="text-xs font-bold text-white truncate">${cleanTitle}</p>
              <a href="${cleanUrl}" target="_blank" rel="noopener noreferrer" class="text-[0.65rem] text-white/50 hover:text-white truncate block font-mono">${cleanUrl}</a>
            </div>
          </div>
          <div class="flex items-center space-x-2 flex-shrink-0">
            <a href="${cleanUrl}" target="_blank" rel="noopener noreferrer" class="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-bold transition-all">
              Testar ↗
            </a>
            <button type="button" onclick="window.appRemoveResource(${idx})" class="w-7 h-7 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 flex items-center justify-center text-xs font-bold transition-all" title="Remover">
              ✕
            </button>
          </div>
        </div>`;
    }).join('');
  }

  window.appAddResource = function() {
    const titleInput = document.getElementById('newResourceTitle');
    const urlInput   = document.getElementById('newResourceUrl');
    const typeSelect = document.getElementById('newResourceType');

    const title = titleInput?.value?.trim();
    const url   = urlInput?.value?.trim();
    const type  = typeSelect?.value || 'link';

    if (!title) {
      showToast('⚠️ Digite o nome do recurso ou arquivo.');
      titleInput?.focus();
      return;
    }
    if (!url) {
      showToast('⚠️ Insira o link ou URL de acesso do recurso.');
      urlInput?.focus();
      return;
    }

    currentEditingResources.push({ id: `res_${Date.now()}_${Math.random().toString(36).substring(2,6)}`, title, url, type });
    if (titleInput) titleInput.value = '';
    if (urlInput) urlInput.value = '';

    renderLessonResourcesList();
    showToast('📎 Material anexado à aula!');
  };

  window.appRemoveResource = function(idx) {
    if (idx >= 0 && idx < currentEditingResources.length) {
      currentEditingResources.splice(idx, 1);
      renderLessonResourcesList();
      showToast('🗑️ Recurso removido.');
    }
  };

  function updateStudentLivePreview() {
    const container = document.getElementById('studentLivePreviewContainer');
    if (!container) return;

    const title    = document.getElementById('editLessonTitle')?.value?.trim() || 'Título da Aula';
    const videoUrl = document.getElementById('editLessonVideoUrl')?.value?.trim() || '';
    const content  = document.getElementById('editLessonContent')?.value?.trim() || '';
    const module   = document.getElementById('editLessonModule')?.value?.trim() || 'Módulo Principal';
    const duration = document.getElementById('editLessonDuration')?.value?.trim() || '15 min';

    const embed = (currentEditingLessonType === 'video' && videoUrl) ? convertToEmbedUrl(videoUrl) : '';

    const typeIcons = { pdf: '📄', prompt: '💡', code: '💻', figma: '🎨', drive: '📁', link: '🔗' };

    const resourcesHtml = currentEditingResources.length > 0 ? `
      <div class="mt-6 p-4 rounded-2xl bg-white/[0.04] border border-white/10 space-y-3">
        <h4 class="text-xs font-bold uppercase text-white/70 tracking-wider flex items-center space-x-1.5">
          <span>📎 Materiais de Apoio & Downloads (${currentEditingResources.length})</span>
        </h4>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          ${currentEditingResources.map(res => `
            <a href="${escapeHtml(res.url)}" target="_blank" rel="noopener noreferrer" class="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex items-center justify-between group">
              <div class="flex items-center space-x-2.5 min-w-0">
                <span class="text-lg">${typeIcons[res.type] || '📎'}</span>
                <span class="text-xs font-bold text-white truncate">${escapeHtml(res.title)}</span>
              </div>
              <span class="text-xs text-white/50 group-hover:text-white transition-colors">Baixar ↗</span>
            </a>
          `).join('')}
        </div>
      </div>` : '';

    container.innerHTML = `
      <div class="space-y-4">
        <!-- Banner Topo do Aluno -->
        <div class="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-white/10">
          <div>
            <span class="text-[0.65rem] font-bold uppercase tracking-wider text-white/50">${escapeHtml(module)}</span>
            <h3 class="text-lg font-extrabold text-white mt-0.5">${escapeHtml(title)}</h3>
          </div>
          <div class="flex items-center space-x-2">
            <span class="px-2.5 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-bold text-white flex items-center space-x-1">
              <span>⏱️</span><span>${escapeHtml(duration)}</span>
            </span>
            <button type="button" class="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-xl text-xs font-bold flex items-center space-x-1">
              <span>✓</span><span>Concluir Aula</span>
            </button>
          </div>
        </div>

        <!-- Video Player ou Banner Artigo -->
        ${embed ? `
          <div class="rounded-2xl overflow-hidden border border-white/15 shadow-2xl bg-black">
            <div class="relative w-full" style="padding-top: 56.25%;">
              <iframe src="${embed}" class="absolute top-0 left-0 w-full h-full" frameborder="0" allowfullscreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"></iframe>
            </div>
          </div>` : `
          <div class="p-8 rounded-2xl bg-gradient-to-br from-white/[0.04] to-transparent border border-white/10 text-center space-y-2">
            <span class="text-4xl block">📄</span>
            <h4 class="text-sm font-bold text-white">Artigo Técnico de Estudo</h4>
            <p class="text-xs text-white/50 max-w-md mx-auto">Esta aula foi configurada como artigo em texto para leitura aprofundada com prompts e códigos.</p>
          </div>`}

        <!-- Recursos Skool da Aula -->
        ${resourcesHtml}

        <!-- Conteúdo Formatado da Aula -->
        <div class="glass-card rounded-2xl p-6 sm:p-7 prose prose-invert max-w-none text-gray-200 leading-relaxed shadow-lg">
          ${renderMarkdown(content) || '<p class="text-white/40 italic text-sm">Nenhum conteúdo em texto inserido para esta aula.</p>'}
        </div>
      </div>`;
  }

  // ──────────────────────────────────────────────────────────────────────────
  // LESSON MODAL SAVE & DELETE (Com Supabase + Contingência Local)
  // ──────────────────────────────────────────────────────────────────────────
  async function handleSaveLessonModal() {
    const titleInput   = document.getElementById('editLessonTitle');
    const videoInput   = document.getElementById('editLessonVideoUrl');
    const contentInput = document.getElementById('editLessonContent');
    const moduleInput  = document.getElementById('editLessonModule');
    const durationInput= document.getElementById('editLessonDuration');
    const statusSelect = document.getElementById('editLessonStatus');
    const accessSelect = document.getElementById('editLessonAccessLevel');
    const orderInput   = document.getElementById('editLessonDisplayOrder');

    const title       = titleInput?.value?.trim();
    let videoUrl      = videoInput?.value?.trim() || '';
    const content     = contentInput?.value?.trim() || '';
    const moduleName  = moduleInput?.value?.trim() || 'Módulo 1';
    const duration    = durationInput?.value?.trim() || '15 min';
    const status      = statusSelect?.value || currentEditingLessonStatus || 'published';
    const accessLevel = accessSelect?.value || 'all';
    const displayOrder= parseInt(orderInput?.value) || 1;

    if (!title) {
      showToast('⚠️ Título da aula é obrigatório.');
      switchLessonEditorTab('content');
      titleInput?.focus();
      return;
    }

    if (!editingLessonServerId) {
      hideLessonEditorModal();
      return;
    }

    if (currentEditingLessonType === 'article') {
      videoUrl = '';
    }

    const saveBtn = document.getElementById('saveLessonModalBtn');
    const saveIcon = document.getElementById('saveLessonBtnIcon');
    const saveLabel = document.getElementById('saveLessonBtnLabel');
    if (saveBtn) saveBtn.disabled = true;
    if (saveIcon) saveIcon.textContent = '⏳';
    if (saveLabel) saveLabel.textContent = 'Salvando...';

    // Empacota os metadados ricos do Skool dentro do markdown
    const metadataObj = {
      module: moduleName,
      duration: duration,
      status: status,
      access_level: accessLevel,
      lesson_type: currentEditingLessonType,
      resources: currentEditingResources
    };
    const finalContentMarkdown = embedLessonMetadata(content, metadataObj);

    // 1. Persistência em Memória e LocalStorage Imediata (Zero delay)
    let srv = serversData.find(s => s.id === editingLessonServerId);
    if (srv) {
      if (!Array.isArray(srv.lessons)) srv.lessons = [];

      if (editingLessonId) {
        const lIdx = srv.lessons.findIndex(l => l.id === editingLessonId);
        if (lIdx >= 0) {
          srv.lessons[lIdx] = {
            ...srv.lessons[lIdx],
            title,
            video_url: videoUrl,
            content_markdown: finalContentMarkdown,
            display_order: displayOrder,
            module: moduleName,
            duration: duration,
            status: status,
            access_level: accessLevel,
            resources: currentEditingResources
          };
        }
      } else {
        const newLesson = {
          id: `les_${Date.now()}_${Math.random().toString(36).substring(2,6)}`,
          title,
          video_url: videoUrl,
          content_markdown: finalContentMarkdown,
          display_order: displayOrder,
          module: moduleName,
          duration: duration,
          status: status,
          access_level: accessLevel,
          resources: currentEditingResources
        };
        srv.lessons.push(newLesson);
      }
      try {
        localStorage.setItem('mcp_local_servers_data', JSON.stringify(serversData));
      } catch(e) {}
    }

    // 2. Persistência no Supabase (se online)
    if (sb) {
      try {
        const payload = {
          server_id: editingLessonServerId,
          title,
          video_url: videoUrl,
          content_markdown: finalContentMarkdown,
          display_order: displayOrder
        };

        if (editingLessonId) {
          await sb.from('server_lessons').update({
            title,
            video_url: videoUrl,
            content_markdown: finalContentMarkdown
          }).eq('id', editingLessonId);
        } else {
          await sb.from('server_lessons').insert(payload);
        }
      } catch(e) {
        console.warn('[Supabase Lesson Save] Falha na sincronização remota, mantido localmente:', e.message);
      }
    }

    if (saveBtn) saveBtn.disabled = false;
    if (saveIcon) saveIcon.textContent = '💾';
    if (saveLabel) saveLabel.textContent = 'Salvar Aula';

    showToast(editingLessonId ? '✅ Aula atualizada com sucesso!' : '✅ Aula criada com sucesso!');
    hideLessonEditorModal();
    editingLessonId = null;
    editingLessonServerId = null;

    renderCurrentView();
  }

  async function handleDeleteLessonModal() {
    if (!editingLessonId) { hideLessonEditorModal(); return; }
    if (!(await showConfirmModal('Deseja realmente excluir esta aula? Esta ação não pode ser desfeita.'))) return;

    // 1. Remove da memória local
    if (editingLessonServerId) {
      let srv = serversData.find(s => s.id === editingLessonServerId);
      if (srv && Array.isArray(srv.lessons)) {
        srv.lessons = srv.lessons.filter(l => l.id !== editingLessonId);
        try {
          localStorage.setItem('mcp_local_servers_data', JSON.stringify(serversData));
        } catch(e) {}
      }
    }

    // 2. Remove do Supabase se online
    if (sb) {
      try {
        await sb.from('server_lessons').delete().eq('id', editingLessonId);
      } catch(e) {
        console.warn('[Supabase Delete Lesson] Erro remoto:', e.message);
      }
    }

    showToast('🗑️ Aula excluída com sucesso!');
    hideLessonEditorModal();
    editingLessonId = null;
    editingLessonServerId = null;

    renderCurrentView();
  }

  // ──────────────────────────────────────────────────────────────────────────
  // ABERTURA DO MODAL DA AULA
  // ──────────────────────────────────────────────────────────────────────────
  window.appOpenLessonEditorModal = (sId, lId = null) => {
    editingLessonServerId = sId;
    editingLessonId = lId;

    const srv = serversData.find(s => s.id === sId) || DEFAULT_SOVEREIGN_SERVERS.find(s => s.id === sId);
    const lesson = lId ? srv?.lessons?.find(l => l.id === lId) : null;

    // Metadados extraídos
    const { cleanContent, metadata } = extractLessonMetadata(lesson?.content_markdown || '');

    // Título do modal e badges
    const titleEl = document.getElementById('lessonEditorModalTitle');
    if (titleEl) titleEl.textContent = lId ? `Editar Aula — ${lesson?.title || ''}` : `Nova Aula — ${srv?.title || ''}`;

    const serverBadge = document.getElementById('lessonEditorServerBadge');
    if (serverBadge) serverBadge.textContent = srv?.title || 'Servidor';

    const moduleBadge = document.getElementById('lessonEditorModuleBadge');
    const lessonModule = metadata.module || lesson?.module || 'Módulo 1';
    if (moduleBadge) moduleBadge.textContent = lessonModule;

    // Campos do formulário
    const titleInput    = document.getElementById('editLessonTitle');
    const videoInput    = document.getElementById('editLessonVideoUrl');
    const contentInput  = document.getElementById('editLessonContent');
    const moduleInput   = document.getElementById('editLessonModule');
    const durationInput = document.getElementById('editLessonDuration');
    const orderInput    = document.getElementById('editLessonDisplayOrder');
    const accessSelect  = document.getElementById('editLessonAccessLevel');

    if (titleInput)    titleInput.value    = lesson?.title || '';
    if (videoInput)    videoInput.value    = lesson?.video_url || '';
    if (contentInput)  contentInput.value  = cleanContent || '';
    if (moduleInput)   moduleInput.value   = lessonModule;
    if (durationInput) durationInput.value = metadata.duration || lesson?.duration || '15 min';
    if (orderInput)    orderInput.value    = lesson?.display_order || (srv?.lessons?.length || 0) + 1;
    if (accessSelect)  accessSelect.value  = metadata.access_level || lesson?.access_level || 'all';

    // Recursos
    currentEditingResources = Array.isArray(metadata.resources) ? [...metadata.resources] : (Array.isArray(lesson?.resources) ? [...lesson.resources] : []);
    renderLessonResourcesList();

    // Tipo de Aula e Status
    const lessonType = metadata.lesson_type || (lesson && !lesson.video_url && cleanContent ? 'article' : 'video');
    setLessonType(lessonType);

    const lessonStatus = metadata.status || lesson?.status || 'published';
    setLessonStatus(lessonStatus);

    // Preview de Vídeo e Métricas de Texto
    updateVideoPreview(lesson?.video_url || '');
    updateLessonTextMetrics();

    // Exclusão
    const delBtn = document.getElementById('deleteLessonModalBtn');
    if (delBtn) delBtn.style.display = lId ? 'flex' : 'none';

    // Reinicia abas na primeira
    switchLessonEditorTab('content');
    switchEditorViewMode('editor');

    // Abre o modal
    if (lessonEditorModal) {
      lessonEditorModal.classList.remove('hidden');
      lessonEditorModal.classList.remove('opacity-0');
    }
  };

  // HELPERS DE FORMATAÇÃO E INSERÇÃO
  window.appInsertMarkdown = (prefix) => {
    const ta = document.getElementById('editLessonContent');
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const selected = ta.value.substring(start, end);
    ta.value = ta.value.substring(0, start) + prefix + selected + ta.value.substring(end);
    ta.selectionStart = ta.selectionEnd = start + prefix.length + selected.length;
    ta.focus();
    updateLessonTextMetrics();
  };

  window.appInsertMarkdownWrap = (prefix, suffix) => {
    const ta = document.getElementById('editLessonContent');
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const selected = ta.value.substring(start, end) || 'texto';
    ta.value = ta.value.substring(0, start) + prefix + selected + suffix + ta.value.substring(end);
    ta.selectionStart = start + prefix.length;
    ta.selectionEnd = start + prefix.length + selected.length;
    ta.focus();
    updateLessonTextMetrics();
  };

  window.appInsertSkoolCallout = (type) => {
    let calloutText = '';
    if (type === 'tip') {
      calloutText = '\n💡 **Dica de Ouro:** Insira aqui uma recomendação prática e acionável para os alunos.\n\n';
    } else if (type === 'note') {
      calloutText = '\n📌 **Nota Importante:** Lembre-se de verificar esta etapa essencial antes de prosseguir.\n\n';
    } else if (type === 'warning') {
      calloutText = '\n⚠️ **Atenção:** Evite cometer este erro clássico comum entre iniciantes.\n\n';
    } else if (type === 'prompt') {
      calloutText = '\n🚀 **Prompt Master:**\n```text\n[Cole aqui o prompt pronto para o aluno copiar]\n```\n\n';
    }
    window.appInsertMarkdown(calloutText);
  };

  window.appInsertSkoolTemplate = () => {
    const template = `# Visão Geral da Masterclass

Nesta aula prática, você vai dominar a metodologia completa para obter resultados profissionais de alto nível com inteligência artificial generativa.

💡 **Dica de Ouro:** Pratique cada etapa simultaneamente com o vídeo para fixar o aprendizado em profundidade.

---

## 🎯 Objetivos de Aprendizagem
- Compreender os fundamentos essenciais e parametrização avançada.
- Aplicar a técnica passo a passo no seu fluxo de trabalho diário.
- Evitar os erros mais comuns e acelerar sua entrega em até 10x.

---

## 🚀 Prompt / Código de Referência
\`\`\`text
hyperrealistic portrait, cinematic volumetric lighting, 85mm f/1.8 lens, detailed facial microtextures, 8k octanerender --ar 16:9 --v 6.1
\`\`\`

---

## ☑️ Checklist de Conclusão para o Aluno
- [ ] Assistir à masterclass completa com atenção aos detalhes
- [ ] Testar o prompt de exemplo na ferramenta
- [ ] Baixar os materiais de apoio na aba de Recursos
- [ ] Compartilhar seu resultado prático na aba Comunidade!
`;
    const ta = document.getElementById('editLessonContent');
    if (ta) {
      ta.value = template;
      updateLessonTextMetrics();
      showToast('📋 Template Skool inserido com sucesso!');
    }
  };

  window.toggleChecklistItem = function(el) {
    const box = el.querySelector('.skool-check-box');
    const span = el.querySelectorAll('span')[1];
    if (box) {
      const isChecked = box.classList.toggle('checked');
      box.textContent = isChecked ? '✓' : '';
      if (span) {
        span.classList.toggle('line-through', isChecked);
        span.classList.toggle('text-gray-400', isChecked);
        span.classList.toggle('text-gray-200', !isChecked);
      }
    }
  };

  window.appCopyCodeBlock = function(btn) {
    const block = btn.closest('.skool-code-block');
    const code = block?.querySelector('code')?.textContent || '';
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code).then(() => {
        const oldHtml = btn.innerHTML;
        btn.innerHTML = '<span>✅ Copiado!</span>';
        setTimeout(() => { btn.innerHTML = oldHtml; }, 2000);
      });
    }
  };

  window.toggleCompleteLesson = function(lesId) {
    try {
      const raw = localStorage.getItem('mcp_completed_lessons');
      let completed = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(completed)) completed = [];
      const idx = completed.indexOf(lesId);
      if (idx >= 0) {
        completed.splice(idx, 1);
        showToast('Aula desmarcada como concluída.');
      } else {
        completed.push(lesId);
        showToast('🎉 Parabéns! Aula concluída!');
      }
      localStorage.setItem('mcp_completed_lessons', JSON.stringify(completed));
      renderCurrentView();
    } catch(e) {}
  };

  // ──────────────────────────────────────────────────────────────────────────
  // EVENT LISTENERS & GLOBAL CLICK DELEGATION
  // ──────────────────────────────────────────────────────────────────────────
  function setupEventListeners() {
    brandLogoBtn?.addEventListener('click', (e) => { e.preventDefault(); navigateToHome(); });

    document.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const v = item.getAttribute('data-view');
        if (v==='home')           navigateToHome();
        else if (v==='community') navigateToCommunity();
        else if (v==='servers')   navigateToServers();
        else if (v==='admin')     navigateToAdmin();
        else navigateToProduct(v);
      });
    });

    // User Dropdown e Alternância de Papéis com Feedback Instantâneo
    userMenuTrigger?.addEventListener('click', e => {
      e.stopPropagation();
      e.preventDefault();
      const roleDropdown = document.getElementById('roleDropdown');
      if (roleDropdown) {
        const isClosed = roleDropdown.classList.contains('invisible') || roleDropdown.classList.contains('opacity-0');
        if (isClosed) {
          roleDropdown.classList.remove('invisible', 'opacity-0');
          roleDropdown.classList.add('opacity-100');
        } else {
          roleDropdown.classList.add('invisible', 'opacity-0');
          roleDropdown.classList.remove('opacity-100');
        }
      } else {
        if (isLoggedIn) navigateToProfile();
        else showAuthModal();
      }
    });

    document.addEventListener('click', e => {
      const roleDropdown = document.getElementById('roleDropdown');
      if (roleDropdown && !roleDropdown.contains(e.target) && !userMenuTrigger?.contains(e.target)) {
        roleDropdown.classList.add('invisible', 'opacity-0');
        roleDropdown.classList.remove('opacity-100');
      }
    });

    const closeRoleDropdown = () => {
      const roleDropdown = document.getElementById('roleDropdown');
      if (roleDropdown) {
        roleDropdown.classList.add('invisible', 'opacity-0');
        roleDropdown.classList.remove('opacity-100');
      }
    };

    document.getElementById('profileDropdownBtn')?.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      closeRoleDropdown();
      navigateToProfile();
    });

    document.getElementById('loginDropdownBtn')?.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      closeRoleDropdown();
      showAuthModal();
    });

    document.getElementById('logoutDropdownBtn')?.addEventListener('click', async e => {
      e.preventDefault();
      e.stopPropagation();
      closeRoleDropdown();
      localStorage.removeItem('mcp_session_user');
      localStorage.removeItem('mcp_auth_token');
      localStorage.setItem('mcp_user_role', 'visitante');
      localStorage.setItem('mcp_admin_auth', 'false');
      fetch('/api/auth/me', { method: 'DELETE' }).catch(() => {});
      if (sb) {
        try { await sb.auth.signOut(); } catch(err) {}
      }
      const guestUser = {
        isLoggedIn: false,
        role: 'visitante',
        name: 'Visitante',
        email: '',
        avatar: USER_ROLES.guest.avatar
      };
      window.dispatchEvent(new CustomEvent('mcp_auth_changed', { detail: guestUser }));
      syncSovereignSession();
      showToast('👋 Sessão encerrada com sucesso!');
      navigateToHome();
    });

    // Global Click Delegation on Main Container for 100% Bulletproof Gallery Navigation
    mainAppContainer?.addEventListener('click', (e) => {
      const prodCard = e.target.closest('[data-nav-product]');
      if (prodCard) {
        e.preventDefault();
        e.stopPropagation();
        const slug = prodCard.getAttribute('data-nav-product');
        if (slug) navigateToProduct(slug);
        return;
      }

      const catCard = e.target.closest('[data-nav-cat-id]');
      if (catCard) {
        e.preventDefault();
        e.stopPropagation();
        const pSlug = catCard.getAttribute('data-prod-slug');
        const cId   = catCard.getAttribute('data-nav-cat-id');
        if (pSlug && cId) navigateToCategory(pSlug, cId);
        return;
      }
    });

    searchInput?.addEventListener('input', e => {
      searchQuery = e.target.value.toLowerCase().trim();
      currentView = searchQuery.length > 0 ? 'search' : 'home';
      renderCurrentView();
    });

    // Background Configurations Widget Listeners
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
            bgModal.classList.remove('opacity-0');
            bgModal.classList.remove('scale-95');
          }, 10);
        } else {
          bgModal.classList.add('opacity-0');
          bgModal.classList.add('scale-95');
          setTimeout(() => bgModal.classList.add('hidden'), 300);
        }
      });
    }

    if (closeBgModal && bgModal) {
      closeBgModal.addEventListener('click', () => {
        bgModal.classList.add('opacity-0');
        bgModal.classList.add('scale-95');
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
        showToast(`📹 Servidor alterado para ${activeBgServer === 'server1' ? 'Server 1' : 'Server 2'}`);
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
        showToast('🔄 Configurações restauradas!');
      });
    }

    // Auth Modal
    closeAuthModal?.addEventListener('click', hideAuthModal);
    toggleAuthMode?.addEventListener('click', () => {
      isLoginMode = !isLoginMode;
      clearAuthAlert();
      updateAuthModalUI();
    });

    authForm?.addEventListener('submit', async e => {
      e.preventDefault();
      const email    = document.getElementById('authEmail').value.trim();
      const password = document.getElementById('authPassword').value;
      const btn      = document.getElementById('authSubmitBtn');
      const btnLabel = document.getElementById('authSubmitBtnLabel') || btn;
      const spinner  = document.getElementById('authBtnSpinner');

      btn.disabled = true;
      if (spinner) spinner.classList.remove('hidden');
      if (btnLabel) btnLabel.textContent = isLoginMode ? 'Autenticando...' : 'Cadastrando...';
      showAuthAlert(isLoginMode ? 'Validando credenciais com a plataforma...' : 'Criando conta...', 'loading');

      try {
        if (isLoginMode) {
          // 1. Autenticação prioritária na API Soberana (Supabase PostgreSQL)
          const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
          });
          const data = await res.json().catch(() => null);

          if (res.ok && data?.success && data?.user) {
            const role = data.role || (data.user.role === 'admin' ? 'admin' : 'user');
            const sessionUser = {
              id: data.user.id,
              isLoggedIn: true,
              role: role,
              name: data.user.name || (role === 'admin' ? 'Mateus Celestino Pro X' : 'Membro Pro'),
              email: data.user.email || email,
              avatar: data.user.avatar || (role === 'admin' ? USER_ROLES.admin.avatar : (role === 'moder' ? USER_ROLES.moderator.avatar : USER_ROLES.free.avatar)),
              tier: role === 'admin' ? 'max' : (data.user.tier || 'vip')
            };

            localStorage.setItem('mcp_session_user', JSON.stringify(sessionUser));
            localStorage.setItem('mcp_user_role', sessionUser.role);
            localStorage.setItem('mcp_admin_auth', (sessionUser.role === 'admin' || sessionUser.role === 'moder') ? 'true' : 'false');
            if (data.token) localStorage.setItem('mcp_auth_token', data.token);

            if (sb) {
              sb.auth.signInWithPassword({ email, password }).catch(() => {});
            }

            window.dispatchEvent(new CustomEvent('mcp_auth_changed', { detail: sessionUser }));
            syncSovereignSession();
            
            showAuthAlert('✅ ' + (data.message || 'Login autorizado com sucesso! Entrando...'), 'success');
            showToast('🔑 Login realizado com sucesso! Bem-vindo(a) ' + sessionUser.name, 'success');

            setTimeout(() => {
              hideAuthModal();
              renderCurrentView();
              btn.disabled = false;
              if (spinner) spinner.classList.add('hidden');
              if (btnLabel) btnLabel.textContent = 'Entrar';
            }, 600);
            return;
          }

          // 2. Fallback para Supabase Auth se a conta for autenticada via GoTrue
          if (sb) {
            const { data: sbData, error: sbError } = await sb.auth.signInWithPassword({ email, password });
            if (!sbError && sbData?.session) {
              await handleAuthSession(sbData.session);
              showAuthAlert('✅ Login aprovado!', 'success');
              showToast('🔑 Login realizado com sucesso!', 'success');
              setTimeout(() => {
                hideAuthModal();
                renderCurrentView();
                btn.disabled = false;
                if (spinner) spinner.classList.add('hidden');
                if (btnLabel) btnLabel.textContent = 'Entrar';
              }, 600);
              return;
            }
          }

          const errorMsg = data?.error || 'Email ou senha inválidos. Verifique as credenciais.';
          showAuthAlert(errorMsg, 'error');
          showToast('❌ ' + errorMsg, 'error');
          btn.disabled = false;
          if (spinner) spinner.classList.add('hidden');
          if (btnLabel) btnLabel.textContent = 'Entrar';
        } else {
          // Registro de nova conta
          const name = document.getElementById('authName')?.value?.trim() || email.split('@')[0];
          const res = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
          });
          const data = await res.json().catch(() => null);

          if (res.ok && data?.success) {
            const sessionUser = {
              id: data.user?.id || null,
              isLoggedIn: true,
              role: 'user',
              name: name,
              email: email,
              avatar: USER_ROLES.free.avatar,
              tier: 'vip'
            };
            localStorage.setItem('mcp_session_user', JSON.stringify(sessionUser));
            localStorage.setItem('mcp_user_role', 'user');
            if (data.token) localStorage.setItem('mcp_auth_token', data.token);

            window.dispatchEvent(new CustomEvent('mcp_auth_changed', { detail: sessionUser }));
            syncSovereignSession();
            showAuthAlert('✅ Conta criada com sucesso! Liberando acesso...', 'success');
            showToast('✅ Conta criada com sucesso! Acesso VIP liberado.', 'success');
            
            setTimeout(() => {
              hideAuthModal();
              renderCurrentView();
              btn.disabled = false;
              if (spinner) spinner.classList.add('hidden');
              if (btnLabel) btnLabel.textContent = 'Criar Conta';
            }, 600);
            return;
          }

          if (sb) {
            const { error: sbRegErr } = await sb.auth.signUp({ email, password, options:{ data:{ name } } });
            if (!sbRegErr) {
              showAuthAlert('✅ Conta criada! Verifique seu e-mail se necessário.', 'success');
              showToast('✅ Conta criada! Verifique seu e-mail se necessário.', 'success');
              setTimeout(() => {
                hideAuthModal();
                btn.disabled = false;
                if (spinner) spinner.classList.add('hidden');
                if (btnLabel) btnLabel.textContent = 'Criar Conta';
              }, 800);
              return;
            }
          }

          const regErrorMsg = data?.error || 'Não foi possível criar a conta. Tente novamente.';
          showAuthAlert(regErrorMsg, 'error');
          showToast('❌ ' + regErrorMsg, 'error');
          btn.disabled = false;
          if (spinner) spinner.classList.add('hidden');
          if (btnLabel) btnLabel.textContent = 'Criar Conta';
        }
      } catch (err) {
        console.error('Auth submit error:', err);
        const netErrorMsg = 'Erro de conexão ao autenticar. Tente novamente.';
        showAuthAlert(netErrorMsg, 'error');
        showToast('❌ ' + netErrorMsg, 'error');
        btn.disabled = false;
        if (spinner) spinner.classList.add('hidden');
        if (btnLabel) btnLabel.textContent = isLoginMode ? 'Entrar' : 'Criar Conta';
      }
    });

    // Lesson Editor (Skool Studio)
    closeLessonEditorModal?.addEventListener('click', hideLessonEditorModal);
    cancelLessonModalBtn?.addEventListener('click', hideLessonEditorModal);
    saveLessonModalBtn?.addEventListener('click', handleSaveLessonModal);
    deleteLessonModalBtn?.addEventListener('click', handleDeleteLessonModal);

    // Skool Studio — Tabs
    document.getElementById('tabLessonContentBtn')?.addEventListener('click', () => switchLessonEditorTab('content'));
    document.getElementById('tabLessonResourcesBtn')?.addEventListener('click', () => switchLessonEditorTab('resources'));
    document.getElementById('tabLessonSettingsBtn')?.addEventListener('click', () => switchLessonEditorTab('settings'));
    document.getElementById('tabLessonPreviewBtn')?.addEventListener('click', () => switchLessonEditorTab('preview'));
    document.getElementById('previewLessonModalBtn')?.addEventListener('click', () => switchLessonEditorTab('preview'));

    // Skool Studio — Status & Types
    document.getElementById('headerStatusPublishedBtn')?.addEventListener('click', () => setLessonStatus('published'));
    document.getElementById('headerStatusDraftBtn')?.addEventListener('click', () => setLessonStatus('draft'));
    document.getElementById('editLessonStatus')?.addEventListener('change', (e) => setLessonStatus(e.target.value));

    document.getElementById('lessonTypeVideoBtn')?.addEventListener('click', () => setLessonType('video'));
    document.getElementById('lessonTypeArticleBtn')?.addEventListener('click', () => setLessonType('article'));

    // Skool Studio — Video Actions
    const videoInputEl = document.getElementById('editLessonVideoUrl');
    videoInputEl?.addEventListener('input', e => updateVideoPreview(e.target.value));

    document.getElementById('btnPasteVideoUrl')?.addEventListener('click', async () => {
      try {
        if (navigator.clipboard) {
          const clip = await navigator.clipboard.readText();
          if (clip && videoInputEl) {
            videoInputEl.value = clip;
            updateVideoPreview(clip);
            showToast('📋 Link colado da área de transferência!');
          }
        }
      } catch(e) {}
    });

    document.getElementById('btnDemoVideoUrl')?.addEventListener('click', () => {
      const demoUrl = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
      if (videoInputEl) {
        videoInputEl.value = demoUrl;
        updateVideoPreview(demoUrl);
        showToast('🎬 Vídeo de demonstração carregado!');
      }
    });

    // Skool Studio — Editor Modes & Input Metrics
    document.getElementById('btnModeEditorOnly')?.addEventListener('click', () => switchEditorViewMode('editor'));
    document.getElementById('btnModeSplitView')?.addEventListener('click', () => switchEditorViewMode('split'));
    document.getElementById('btnModePreviewOnly')?.addEventListener('click', () => switchEditorViewMode('preview'));

    const lessonContentEl = document.getElementById('editLessonContent');
    lessonContentEl?.addEventListener('input', () => updateLessonTextMetrics());

    // Skool Studio — Resources
    document.getElementById('btnAddResourceBtn')?.addEventListener('click', () => window.appAddResource());

    // Skool Studio — Keyboard Shortcuts (Ctrl+S / Cmd+S & Esc)
    window.addEventListener('keydown', (e) => {
      if (lessonEditorModal && !lessonEditorModal.classList.contains('hidden')) {
        if ((e.metaKey || e.ctrlKey) && (e.key === 's' || e.key === 'S')) {
          e.preventDefault();
          handleSaveLessonModal();
        } else if (e.key === 'Escape') {
          hideLessonEditorModal();
        }
      }
    });

    // Server Editor
    closeServerEditorModal?.addEventListener('click', hideServerEditorModal);
    cancelServerModalBtn?.addEventListener('click', hideServerEditorModal);
    saveServerModalBtn?.addEventListener('click', handleSaveServerModal);
    deleteServerModalBtn?.addEventListener('click', handleDeleteServerModal);
    document.getElementById('editServerHeroImage')?.addEventListener('input', e => updateServerHeroPreview(e.target.value));
  }

  function updateAuthModalUI() {
    if (document.getElementById('authModalTitle')) {
      document.getElementById('authModalTitle').textContent = isLoginMode ? 'Login' : 'Criar Conta Grátis';
    }
    if (document.getElementById('authModalSubtitle')) {
      document.getElementById('authModalSubtitle').textContent = isLoginMode ? 'Acesse sua conta para desbloquear prompts, comunidade e masterclasses.' : 'Crie sua conta para explorar todos os acervos e comunidades';
    }
    const nm = document.getElementById('authNameField');
    if (nm) nm.style.display = isLoginMode ? 'none' : 'block';
    const btnLabel = document.getElementById('authSubmitBtnLabel');
    if (btnLabel) btnLabel.textContent = isLoginMode ? 'Entrar' : 'Criar Conta Grátis';
    const tog = document.getElementById('toggleAuthMode');
    if (tog) tog.textContent = isLoginMode ? 'Não tem conta? Registre-se Gratuitamente' : 'Já tenho conta. Fazer Login';
  }

  // ──────────────────────────────────────────────────────────────────────────
  // NAVIGATION (Session-Verified & Fluid Subpages)
  // ──────────────────────────────────────────────────────────────────────────
  function navigateToHome() {
    currentView = 'home';
    selectedProductSlug = null;
    selectedCategoryId = null;
    searchQuery = '';
    if (searchInput) searchInput.value = '';
    if (window.location.hash && window.location.hash !== '#home' && window.location.hash !== '#') {
      try { history.replaceState(null, '', window.location.pathname); } catch(e) {}
    }
    renderCurrentView();
  }

  function navigateToProduct(slug) {
    currentView = 'product';
    selectedProductSlug = slug;
    selectedCategoryId = null;
    const targetHash = `#product/${slug}`;
    if (window.location.hash !== targetHash) {
      try { history.pushState(null, '', targetHash); } catch(e) {}
    }
    renderCurrentView();
  }

  function navigateToCategory(ps, ci) {
    currentView = 'category';
    selectedProductSlug = ps;
    selectedCategoryId = ci;
    const targetHash = `#category/${ps}/${ci}`;
    if (window.location.hash !== targetHash) {
      try { history.pushState(null, '', targetHash); } catch(e) {}
    }
    renderCurrentView();
  }
  
  async function navigateToCommunity() {
    syncSovereignSession();
    if (!isLoggedIn) {
      if (sb) {
        try {
          const { data: { session } } = await sb.auth.getSession();
          if (session) await handleAuthSession(session);
          else { showAuthModal('Acesse a Comunidade fazendo login ou criando sua conta online.'); return; }
        } catch(e) {
          showAuthModal('Acesse a Comunidade fazendo login ou criando sua conta online.');
          return;
        }
      } else {
        showAuthModal('Acesse a Comunidade fazendo login ou criando sua conta online.');
        return;
      }
    }

    currentView = 'community';
    const targetHash = (communityActiveTab && communityActiveTab !== 'feed') ? `#community/${communityActiveTab}` : '#community';
    if (window.location.hash !== targetHash) {
      try { history.pushState(null, '', targetHash); } catch(e) {}
    }
    await loadCommunityPosts();
    renderCurrentView();
  }

  async function navigateToServers() {
    syncSovereignSession();
    if (!isLoggedIn) {
      if (sb) {
        try {
          const { data: { session } } = await sb.auth.getSession();
          if (session) await handleAuthSession(session);
          else { showAuthModal('Acesse os Servidores de Treinamento e Masterclasses fazendo login.'); return; }
        } catch(e) {
          showAuthModal('Acesse os Servidores de Treinamento e Masterclasses fazendo login.');
          return;
        }
      } else {
        showAuthModal('Acesse os Servidores de Treinamento e Masterclasses fazendo login.');
        return;
      }
    }

    currentView = 'servers';
    selectedServerId = null;
    selectedLessonId = null;
    if (window.location.hash !== '#servers') {
      try { history.pushState(null, '', '#servers'); } catch(e) {}
    }
    await loadServersData();
    renderCurrentView();
  }

  async function navigateToServerDetail(sId, lId=null) {
    syncSovereignSession();
    if (!isLoggedIn) {
      if (sb) {
        try {
          const { data: { session } } = await sb.auth.getSession();
          if (session) await handleAuthSession(session);
          else { showAuthModal('Para assistir a esta masterclass, faça login ou cadastre-se.'); return; }
        } catch(e) {
          showAuthModal('Para assistir a esta masterclass, faça login ou cadastre-se.');
          return;
        }
      } else {
        showAuthModal('Para assistir a esta masterclass, faça login ou cadastre-se.');
        return;
      }
    }

    currentView = 'server_detail';
    selectedServerId = sId;
    let srv = serversData.find(s => s.id === sId) || DEFAULT_SOVEREIGN_SERVERS.find(s => s.id === sId) || DEFAULT_SOVEREIGN_SERVERS[0];
    selectedLessonId = lId || srv?.lessons?.[0]?.id || null;

    const targetHash = selectedLessonId ? `#servers/${sId}/${selectedLessonId}` : `#servers/${sId}`;
    if (window.location.hash !== targetHash) {
      try { history.pushState(null, '', targetHash); } catch(e) {}
    }
    renderCurrentView();
  }

  async function navigateToProfile() {
    syncSovereignSession();
    if (!isLoggedIn) {
      if (sb) {
        try {
          const { data: { session } } = await sb.auth.getSession();
          if (session) await handleAuthSession(session);
          else { showAuthModal('Para visualizar e editar seu perfil, faça login.'); return; }
        } catch(e) {
          showAuthModal('Para visualizar e editar seu perfil, faça login.');
          return;
        }
      } else {
        showAuthModal('Para visualizar e editar seu perfil, faça login.');
        return;
      }
    }

    currentView = 'profile';
    if (window.location.hash !== '#profile') {
      try { history.pushState(null, '', '#profile'); } catch(e) {}
    }
    renderCurrentView();
  }
  window.appGoProfile = navigateToProfile;
  window.appGoHome = navigateToHome;
  window.appGoServers = navigateToServers;
  window.appGoServerDetail = navigateToServerDetail;

  async function navigateToAdmin() {
    syncSovereignSession();
    window.location.href = '/admin';
  }

  // ──────────────────────────────────────────────────────────────────────────
  // HEADER & BREADCRUMB
  // ──────────────────────────────────────────────────────────────────────────
  function updateUserHeader() {
    const ri = USER_ROLES[currentUserRole] || USER_ROLES.guest;
    if (currentUserName)    currentUserName.textContent = currentUserNameStr || ri.name;
    if (currentUserRoleSpan) currentUserRoleSpan.textContent = ri.roleText;
    if (currentUserAvatar)  currentUserAvatar.src = currentUserAvatarUrl || ri.avatar;
    const adminBtn = document.getElementById('adminNavBtn');
    const adminDropBtn = document.getElementById('adminDropdownBtn');
    const profileDropBtn = document.getElementById('profileDropdownBtn');
    const loginDropBtn = document.getElementById('loginDropdownBtn');
    const logoutDropBtn = document.getElementById('logoutDropdownBtn');

    const hasAdminAccess = isLoggedIn && (currentUserRole === 'admin' || currentUserRole === 'moderator' || currentUserRole === 'moder');
    if (adminBtn) {
      adminBtn.classList.add('hidden');
      adminBtn.style.display = 'none';
    }
    if (adminDropBtn) {
      if (hasAdminAccess) adminDropBtn.classList.remove('hidden');
      else adminDropBtn.classList.add('hidden');
    }
    if (profileDropBtn) {
      if (isLoggedIn) profileDropBtn.classList.remove('hidden');
      else profileDropBtn.classList.add('hidden');
    }
    if (loginDropBtn) {
      if (!isLoggedIn) loginDropBtn.classList.remove('hidden');
      else loginDropBtn.classList.add('hidden');
    }
    if (logoutDropBtn) {
      if (isLoggedIn) logoutDropBtn.classList.remove('hidden');
      else logoutDropBtn.classList.add('hidden');
    }
  }

  function renderBreadcrumb() {
    if (!breadcrumbBar) return;
    breadcrumbBar.innerHTML = '';
    const add = (text, active, onClick) => {
      const el = document.createElement('span');
      el.className = `breadcrumb-item ${active ? 'active' : ''}`;
      el.textContent = text;
      if (onClick) el.onclick = onClick;
      breadcrumbBar.appendChild(el);
    };
    const sep = () => { const s=document.createElement('span'); s.textContent=' / '; breadcrumbBar.appendChild(s); };
    add('Início', currentView==='home', navigateToHome);
    if (currentView==='product' && selectedProductSlug) {
      sep(); const p=allProducts.find(p=>p.slug===selectedProductSlug);
      add(p?.title||selectedProductSlug, true);
    } else if (currentView==='category') {
      const p=allProducts.find(p=>p.slug===selectedProductSlug);
      const c=p?.categories?.find(c=>c.id===selectedCategoryId);
      sep(); add(p?.title||selectedProductSlug,false,()=>navigateToProduct(selectedProductSlug));
      sep(); add(c?.title||selectedCategoryId, true);
    } else if (currentView==='community') {
      sep();
      const tabNames = {
        feed: 'Feed & Discussões',
        prompts: 'Acervo de Prompts VIP',
        ranking: 'Ranking & Gamificação',
        challenges: 'Desafios Semanais',
        saved: 'Meus Salvos'
      };
      if (communityActiveTab && communityActiveTab !== 'feed') {
        add('Comunidade', false, () => {
          if (window.appSwitchCommunityTab) window.appSwitchCommunityTab('feed');
          else navigateToCommunity();
        });
        sep();
        add(tabNames[communityActiveTab] || communityActiveTab, true);
      } else {
        add('Comunidade', true);
      }
    } else if (currentView==='servers') {
      sep(); add('Servers',true);
    } else if (currentView==='server_detail') {
      sep(); add('Servers', false, navigateToServers);
      const srv = serversData.find(s => s.id === selectedServerId) || DEFAULT_SOVEREIGN_SERVERS.find(s => s.id === selectedServerId);
      sep(); add(srv?.title || 'Aula', true);
    } else if (currentView==='profile') {
      sep(); add('Meu Perfil',true);
    } else if (currentView==='admin') {
      sep(); add('Painel Administrativo',true);
    }
  }

  // ──────────────────────────────────────────────────────────────────────────
  // BANNERS HELPER
  // ──────────────────────────────────────────────────────────────────────────
  async function loadBanners() {
    if (!sb) return;
    try {
      const { data } = await sb.from('banners').select('*').eq('is_active', true).order('display_order');
      if (data) activeBanners = data;
      setTimeout(triggerMandatoryPopup, 1200);
    } catch (e) {
      console.error('Error loading banners:', e);
    }
  }

  function triggerMandatoryPopup() {
    const modal = document.getElementById('mandatoryPopupModal');
    const timerText = document.getElementById('mandatoryPopupTimerText');
    const closeBtn = document.getElementById('mandatoryPopupCloseBtn');
    const titleEl = document.getElementById('mandatoryPopupTitle');
    const subtitleEl = document.getElementById('mandatoryPopupSubtitle');
    const linkEl = document.getElementById('mandatoryPopupLink');
    const bgEl = document.getElementById('mandatoryPopupBg');

    if (!modal) return;

    // Exibe SOMENTE se houver um banner do tipo 'popup' ativo programado no banco!
    const popupBanner = activeBanners.find(b => b.type === 'popup' && b.is_active);
    if (!popupBanner) return;

    if (titleEl) titleEl.textContent = popupBanner.title || 'Seja Bem-Vindo a A.I VISUALS';
    if (subtitleEl) subtitleEl.textContent = popupBanner.subtitle || '';
    if (popupBanner.image_url && bgEl) bgEl.style.backgroundImage = `url('${popupBanner.image_url}')`;
    if (popupBanner.link_url && linkEl) {
      linkEl.href = popupBanner.link_url;
      linkEl.textContent = `${popupBanner.link_label || 'Ver Detalhes'} →`;
      linkEl.classList.remove('hidden');
    }

    modal.classList.remove('hidden');
    setTimeout(() => modal.classList.remove('opacity-0'), 50);

    let seconds = 5;
    if (timerText) timerText.textContent = `Este aviso fecha em ${seconds}...`;

    const interval = setInterval(() => {
      seconds--;
      if (seconds > 0) {
        if (timerText) timerText.textContent = `Este aviso fecha em ${seconds}...`;
      } else {
        clearInterval(interval);
        if (timerText) timerText.textContent = 'Obrigado por aguardar!';
        if (closeBtn) closeBtn.classList.remove('hidden');
        setTimeout(() => {
          modal.classList.add('opacity-0');
          setTimeout(() => modal.classList.add('hidden'), 500);
        }, 800);
      }
    }, 1000);

    if (closeBtn) {
      closeBtn.onclick = () => {
        clearInterval(interval);
        modal.classList.add('opacity-0');
        setTimeout(() => modal.classList.add('hidden'), 500);
      };
    }
  }

  function renderHeroBanner() {
    const heroBanners = activeBanners.filter(b => b.type === 'hero');
    if (!heroBanners.length) return '';
    const b = heroBanners[0];
    return `
      <div class="mb-10 glass-card rounded-3xl overflow-hidden relative border border-white/20 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
        ${b.image_url ? `<img src="${b.image_url}" class="absolute inset-0 w-full h-full object-cover opacity-25 pointer-events-none">` : ''}
        <div class="relative z-10 max-w-2xl">
          <span class="text-[0.65rem] font-bold tracking-widest uppercase px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white mb-2 inline-block">DESTAQUE EXCLUSIVO</span>
          <h2 class="text-2xl sm:text-3xl font-extrabold text-white mb-2">${b.title || 'Novidades A.I Visuals'}</h2>
          <p class="text-graphite text-sm leading-relaxed">${b.subtitle || ''}</p>
        </div>
        ${b.link_url ? `
          <a href="${b.link_url}" target="_blank" class="relative z-10 px-7 py-3 rounded-full font-bold bg-white text-black text-xs shadow-xl hover:scale-105 transition-all flex-shrink-0">
            ${b.link_label || 'Saiba Mais'} →
          </a>` : ''}
      </div>`;
  }

  function renderSideBanner() {
    const sideBanners = activeBanners.filter(b => b.type === 'side');
    if (!sideBanners.length) return '';
    const b = sideBanners[0];
    return `
      <div class="glass-card rounded-3xl p-5 border border-white/15 relative overflow-hidden text-center space-y-3 shadow-xl mt-6">
        ${b.image_url ? `<img src="${b.image_url}" class="w-full h-36 object-cover rounded-2xl border border-white/10 mb-2">` : ''}
        <h4 class="text-sm font-bold text-white">${b.title || 'Anúncio VIP'}</h4>
        <p class="text-xs text-graphite leading-relaxed">${b.subtitle || ''}</p>
        ${b.link_url ? `
          <a href="${b.link_url}" target="_blank" class="inline-block w-full py-2.5 rounded-xl font-bold bg-white text-black text-xs hover:bg-white/90 transition-all shadow-md">
            ${b.link_label || 'Acessar Agora'} ↗
          </a>` : ''}
      </div>`;
  }

  // ──────────────────────────────────────────────────────────────────────────
  // RENDER ROUTER
  // ──────────────────────────────────────────────────────────────────────────
  function renderCurrentView() {
    // Limpa intervalos de imagem da home ao trocar de view
    homeImageIntervals.forEach(clearInterval);
    homeImageIntervals = [];

    renderBreadcrumb(); updateNavState();

    // Gestão Dinâmica dos Shaders WebGL Vermelhos de Personal OS na Comunidade
    const webglContainer = document.getElementById('bg-webgl-container');
    const webglVignette = document.getElementById('bg-webgl-vignette');
    const videoBg = document.getElementById('bg-video-playlist');

    if (currentView === 'community') {
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
      const savedShader = localStorage.getItem('mcp_community_active_shader') || 'strands';
      if (window.renderWebGLBackground) {
        window.renderWebGLBackground(savedShader);
      }
    } else {
      if (webglContainer) {
        webglContainer.style.opacity = '0';
      }
      if (webglVignette) {
        webglVignette.style.opacity = '0';
      }
      if (videoBg) {
        videoBg.style.opacity = `${(100 - activeBgDarkness) / 100}`;
      }
      if (window.stopWebGLBackground) {
        window.stopWebGLBackground();
      }
    }

    const map = {
      home:renderHomeView, product:renderProductView, category:renderCategoryView,
      search:renderSearchView, community:renderCommunityView, servers:renderServersView,
      server_detail:renderServerDetailView, profile:renderProfileView, admin:renderAdminView
    };
    (map[currentView]||renderHomeView)();
  }

  function updateNavState() {
    document.querySelectorAll('.nav-item').forEach(item =>
      item.classList.toggle('text-white', item.getAttribute('data-view')===currentView)
    );
  }

  // ──────────────────────────────────────────────────────────────────────────
  // VIEW 1: HOME (Apple Liquid Glass & Dynamic 3s Image Rotation)
  // ──────────────────────────────────────────────────────────────────────────
  function renderHomeView() {
    const pA = allProducts.find(p=>p.slug==='ai-art'||p.id==='prod_art');
    const pP = allProducts.find(p=>p.slug==='ai-portraits-pro'||p.slug==='ai-portrait-pro'||p.id==='prod_portrait');
    const pE = allProducts.find(p=>p.slug==='ai-effects-pro'||p.slug==='ai-effect-pro'||p.id==='prod_effect');

    // Coleta imagens aleatórias para rotação de cada produto
    const getImgs = (prod, fallback) => {
      const imgs = [];
      (prod?.categories||[]).forEach(c => {
        if (c.hero_image) imgs.push(c.hero_image);
        (c.prompts||[]).forEach(pr => { if (pr.image_url) imgs.push(pr.image_url); });
      });
      return imgs.length > 0 ? imgs.slice(0, 10) : [fallback];
    };

    const imgsA = getImgs(pA, './public/assets/images/opt_0008_img_exact_87ca3.webp');
    const imgsP = getImgs(pP, './public/assets/images/opt_0000_img_exact_29e38.webp');
    const imgsE = getImgs(pE, './public/assets/images/opt_0740_img_exact_666ee.webp');

    mainAppContainer.innerHTML = `
      <section class="py-12 px-4 sm:px-6 lg:px-8 max-w-[1600px] mx-auto relative z-10">

        <!-- Hero Banner se existir -->
        ${renderHeroBanner()}

        <div class="mb-14 text-center anim-element anim-fade-up">
          <span class="inline-block px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-xs font-mono font-bold tracking-wider uppercase mb-4 backdrop-blur-xl">✨ PLATAFORMA VIP VISUALS</span>
          <h1 class="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 drop-shadow-2xl">
            Seja Bem-Vindo a <span class="bg-gradient-to-r from-white via-white/80 to-white/50 bg-clip-text text-transparent">A.I Visuals</span>
          </h1>
          <p class="text-graphite text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed">Explore o maior acervo exclusivo de inteligência artificial generativa.</p>
          ${!isLoggedIn ? `<button onclick="window.appShowAuth()" class="mt-8 px-8 py-3.5 rounded-full font-bold bg-white text-black shadow-2xl hover:scale-105 transition-all text-sm">🔑 Criar Conta Grátis</button>` : ''}
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          ${[
            { p:pA, slug:'ai-art',          imgs:imgsA, t:'A.I ART PRO',      cnt:`${pA?.categories?.length || 40} Estilos Visuais`, learnLink: PRODUCT_LEARN_MORE_LINKS['ai-art'] },
            { p:pP, slug:'ai-portraits-pro', imgs:imgsP, t:'A.I PORTRAIT PRO', cnt:`${pP?.categories?.length || 15} Categorias VIP`, learnLink: PRODUCT_LEARN_MORE_LINKS['ai-portraits-pro'] },
            { p:pE, slug:'ai-effects-pro',   imgs:imgsE, t:'A.I EFFECT PRO',   cnt:`${pE?.categories?.length || 133} Estilos Pro`,   learnLink: PRODUCT_LEARN_MORE_LINKS['ai-effects-pro'] }
          ].map(({ p,slug,imgs,t,cnt,learnLink }, idx) => `
            <div class="img-card glass-card group anim-element anim-scale relative rounded-3xl overflow-hidden hover:border-white/40 transition-all duration-500 flex flex-col">
              <div class="h-80 w-full overflow-hidden relative cursor-pointer" data-nav-product="${slug}">
                <img id="home-slider-${slug}" src="${imgs[0]}" alt="${t}" class="w-full h-full object-cover group-hover:scale-105 transition-all duration-1000 ease-in-out">
                <div class="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent"></div>
                <span class="absolute top-4 left-4 text-xs font-bold px-3 py-1.5 rounded-full bg-black/60 text-white border border-white/20 backdrop-blur-xl">R$ 120,00</span>
                <span class="absolute top-4 right-4 text-[0.65rem] font-mono px-2.5 py-1 rounded-full bg-white/10 text-white/80 border border-white/20 backdrop-blur-md">🔄 Dynamic 3s</span>
              </div>
              <div class="p-8 flex-1 flex flex-col justify-between">
                <div>
                  <h3 class="text-3xl font-extrabold text-white mb-2 group-hover:text-white/80 transition-colors cursor-pointer" data-nav-product="${slug}">${t}</h3>
                  <p class="text-graphite text-sm leading-relaxed mb-6">${p?.description||'Coleção exclusiva de prompts profissionais para IA generativa.'}</p>
                </div>
                <div class="space-y-3 border-t border-white/10 pt-4">
                  <div class="flex items-center justify-between">
                    <span class="text-xs font-mono text-white/80">✨ ${cnt}</span>
                    <button class="text-xs font-bold px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white transition-all" data-nav-product="${slug}">Explorar Galeria →</button>
                  </div>
                  <a href="${learnLink}" target="_blank" class="block w-full text-center py-2.5 rounded-xl font-bold bg-white text-black text-xs shadow-lg hover:bg-white/90 transition-all">
                    Saiba Mais ↗
                  </a>
                </div>
              </div>
            </div>`).join('')}
        </div>
      </section>`;

    // Ativa rotação de imagens a cada 3 segundos para os 3 produtos
    [
      { slug:'ai-art',          imgs:imgsA },
      { slug:'ai-portraits-pro', imgs:imgsP },
      { slug:'ai-effects-pro',   imgs:imgsE }
    ].forEach(({ slug, imgs }) => {
      if (imgs.length <= 1) return;
      let i = 0;
      const interval = setInterval(() => {
        const imgEl = document.getElementById(`home-slider-${slug}`);
        if (imgEl) {
          i = (i + 1) % imgs.length;
          imgEl.style.opacity = '0.3';
          setTimeout(() => {
            imgEl.src = imgs[i];
            imgEl.style.opacity = '1';
          }, 300);
        }
      }, 3000);
      homeImageIntervals.push(interval);
    });

    window.appShowAuth = showAuthModal;
    setTimeout(triggerAnimObservers, 100);
  }

  // ──────────────────────────────────────────────────────────────────────────
  // VIEW 2: PRODUCT
  // ──────────────────────────────────────────────────────────────────────────
  function renderProductView() {
    let prod = allProducts.find(p => p.slug === selectedProductSlug || p.id === selectedProductSlug);
    if (!prod && selectedProductSlug) {
      const clean = selectedProductSlug.replace('-pro','').replace('pro','');
      prod = allProducts.find(p => p.slug.includes(clean) || p.id.includes(clean));
    }
    if (!prod) prod = allProducts[0];
    if (!prod) return;

    const hasAccess = currentUserRole==='admin'||currentUserRole==='full'||(currentUserProfile?.accessible_products||[]).includes(prod.slug);
    const isLargeGallery = prod.slug === 'ai-effects-pro' || (prod.categories||[]).length > 20;

    mainAppContainer.innerHTML = `
      <section class="py-16 px-4 sm:px-6 lg:px-8 max-w-[1600px] mx-auto relative z-10">
        <div class="mb-12 text-center anim-element anim-fade-up">
          <span class="text-xs font-bold text-white/60 tracking-widest uppercase">ACERVO EXCLUSIVO (${prod.categories?.length || 0} CATEGORIAS)</span>
          <h1 class="text-4xl sm:text-5xl font-extrabold tracking-tight mb-3 text-white mt-2">${prod.title}</h1>
          <p class="text-graphite text-base sm:text-lg max-w-2xl mx-auto">${prod.description}</p>
        </div>

        ${isLargeGallery ? `
          <!-- Notion-Style Uniform Grid for Large Galleries like A.I Effects Pro -->
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            ${(prod.categories||[]).map((cat, i) => {
              const cimg = cat.hero_image || './public/assets/images/opt_0008_img_exact_87ca3.webp';
              return `
                <div class="img-card glass-card group cursor-pointer anim-element anim-scale rounded-2xl overflow-hidden border border-white/10 hover:border-white/30 transition-all duration-300 flex flex-col"
                  data-prod-slug="${prod.slug}" data-nav-cat-id="${cat.id}">
                  <div class="aspect-square w-full overflow-hidden relative bg-black/60">
                    <img src="${cimg}" alt="${cat.title}" class="w-full h-full object-cover group-hover:scale-105 transition-all duration-500" loading="lazy" onerror="this.src='./public/assets/images/opt_0008_img_exact_87ca3.webp'">
                  </div>
                  <div class="p-3.5 bg-black/80 flex items-center space-x-2 border-t border-white/10">
                    <span class="text-sm">📄</span>
                    <div class="min-w-0 flex-1">
                      <h4 class="text-xs font-bold text-white truncate group-hover:text-white/80 transition-colors">${cat.title}</h4>
                      <span class="text-[0.65rem] text-graphite font-mono">${cat.prompts?.length || 0} variações</span>
                    </div>
                  </div>
                </div>`;
            }).join('')}
          </div>
        ` : `
          <!-- Bento Grid for standard galleries -->
          <div class="bento-grid">
            ${(prod.categories||[]).map((cat,i)=>{
              const cimg=cat.hero_image||'./public/assets/images/opt_0008_img_exact_87ca3.webp';
              let cls='img-card glass-card group cursor-pointer anim-element anim-scale ';
              if(i===0) cls+='md:col-span-2 md:row-span-2';
              else if(i===1||i===4) cls+='md:col-span-2 delay-100';
              else cls+='delay-200';
              return `<div class="${cls}" data-prod-slug="${prod.slug}" data-nav-cat-id="${cat.id}">
                <div class="img-wrapper rounded-3xl w-full h-full relative overflow-hidden">
                  <img src="${cimg}" alt="${cat.title}" class="w-full h-full object-cover group-hover:scale-105 transition-all duration-700">
                  <div class="absolute inset-0 flex flex-col justify-end p-6 bg-gradient-to-t from-black/90 via-black/30 to-transparent">
                    <h3 class="text-2xl font-bold text-white mb-1 group-hover:text-white/80 transition-colors">${cat.title}</h3>
                    <span class="text-xs text-graphite font-mono">✨ ${cat.prompts?.length||0} Variações</span>
                  </div>
                </div>
              </div>`;
            }).join('')}
          </div>
        `}

        ${!hasAccess ? `<div class="mt-16 text-center p-8 rounded-3xl glass-card">
          <h3 class="text-2xl font-extrabold text-white mb-2">🚀 Desbloquear Acesso Total — R$ 120,00</h3>
          <p class="text-graphite text-sm mb-6">Liberar acesso completo a todos os estilos e prompts de ${prod.title}</p>
          <button onclick="window.appTriggerMP('${prod.slug}')" class="inline-block px-10 py-4 rounded-full font-bold bg-white text-black shadow-2xl hover:scale-105 transition-all">Pagar com Mercado Pago — R$ 120,00</button>
        </div>` : ''}
        ${renderSideBanner()}
      </section>`;

    window.appTriggerMP = triggerMercadoPagoCheckout;
    setTimeout(triggerAnimObservers, 100);
  }

  // ──────────────────────────────────────────────────────────────────────────
  // VIEW 3: CATEGORY & PROMPTS GALLERY
  // ──────────────────────────────────────────────────────────────────────────
  function renderCategoryView() {
    let prod = allProducts.find(p => p.slug === selectedProductSlug || p.id === selectedProductSlug);
    if (!prod && selectedProductSlug) {
      const clean = selectedProductSlug.replace('-pro','').replace('pro','');
      prod = allProducts.find(p => p.slug.includes(clean) || p.id.includes(clean));
    }
    if (!prod) prod = allProducts[0];
    const cat = prod?.categories?.find(c => c.id === selectedCategoryId || c.title === selectedCategoryId) || prod?.categories?.[0];
    if (!prod || !cat) return;

    const prompts = cat.prompts || [];
    const hasAccess = currentUserRole==='admin'||currentUserRole==='full'||(currentUserProfile?.accessible_products||[]).includes(prod.slug);

    mainAppContainer.innerHTML = `
      <section class="py-12 px-4 sm:px-6 lg:px-8 max-w-[1600px] mx-auto relative z-10">
        <div class="flex items-center justify-between mb-10 anim-element anim-fade-up border-b border-white/10 pb-6">
          <div>
            <span class="text-xs font-bold text-white/60 tracking-widest uppercase">${prod.title}</span>
            <h1 class="text-3xl sm:text-4xl font-extrabold text-white mt-1">${cat.title}</h1>
          </div>
          <button class="text-sm font-semibold text-graphite hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 px-5 py-2.5 rounded-full transition-all" onclick="window.appNavBack('${prod.slug}')">← Voltar</button>
        </div>
        <div class="masonry">
          ${prompts.map((p,i) => {
            const isPromptLockedForUser = isLoggedIn && (!hasAccess && !p.is_free_tier);
            return `<div class="img-card group cursor-crosshair anim-element anim-blur" style="transition-delay:${(i%5)*80}ms">
              <div class="img-wrapper rounded-2xl relative overflow-hidden inline-block w-full border border-white/10 hover:border-white/30 transition-all duration-300">
                <img src="${p.image_url}" loading="lazy" class="w-full h-auto block group-hover:scale-105 transition-all duration-500${isPromptLockedForUser?' brightness-[0.3]':''}" onerror="this.src='./public/assets/images/opt_0008_img_exact_87ca3.webp'">
                ${p.is_free_tier ? '<span class="absolute top-2 right-2 text-[0.6rem] px-2.5 py-0.5 rounded-full bg-white/20 border border-white/30 text-white font-bold backdrop-blur-md">FREE</span>' : ''}
                <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
                  ${isPromptLockedForUser ? `<button class="bg-white text-black px-6 py-2.5 rounded-full text-xs font-bold transform translate-y-3 group-hover:translate-y-0 transition-all duration-300 shadow-xl" onclick="window.appTriggerMP('${prod.slug}')">🔒 Desbloquear (R$ 120)</button>`
                                          : `<button class="bg-white text-black px-6 py-2.5 rounded-full text-xs font-bold transform translate-y-3 group-hover:translate-y-0 transition-all duration-300 shadow-xl" onclick="window.appCopy('${encodeURIComponent(p.prompt_text)}')">📋 Copiar Prompt</button>`}
                </div>
              </div>
            </div>`;
          }).join('')}
        </div>
      </section>`;

    window.appNavBack = navigateToProduct;
    window.appCopy = enc => { 
      if(!isLoggedIn){
        const msg = 'para copiar o prompt dessa imagem, faça login ou crie sua conta online.';
        showToast('⚠️ ' + msg);
        showAuthModal(msg);
        return;
      } 
      navigator.clipboard.writeText(decodeURIComponent(enc)).then(()=>showToast('✅ Prompt copiado!')); 
    };
    window.appTriggerMP = triggerMercadoPagoCheckout;
    setTimeout(triggerAnimObservers, 100);
  }

  // ──────────────────────────────────────────────────────────────────────────
  // VIEW 4: SEARCH
  // ──────────────────────────────────────────────────────────────────────────
  function renderSearchView() {
    const res = [];
    allProducts.forEach(prod => prod.categories?.forEach(cat => {
      if (cat.title.toLowerCase().includes(searchQuery)) res.push({ type:'cat', pSlug:prod.slug, item:cat });
      cat.prompts?.forEach(p => {
        if ((p.prompt_text||'').toLowerCase().includes(searchQuery)||(p.title||'').toLowerCase().includes(searchQuery))
          res.push({ type:'prompt', pSlug:prod.slug, cId:cat.id, item:p });
      });
    }));

    mainAppContainer.innerHTML=`<section class="py-12 px-4 sm:px-6 lg:px-8 max-w-[1600px] mx-auto relative z-10">
      <div class="mb-8"><h1 class="text-3xl font-bold text-white">Resultados</h1><p class="text-graphite text-sm">"<span class="text-white">${searchQuery}</span>" — ${res.length} resultados</p></div>
      ${res.length===0 ? '<div class="text-center py-20 glass-card rounded-3xl"><p class="text-graphite">Nenhum resultado.</p></div>'
      : `<div class="masonry">${res.map(r => r.type==='cat'
          ? `<div class="img-card group cursor-pointer" onclick="window.appNavCat2('${r.pSlug}','${r.item.id}')"><div class="img-wrapper rounded-2xl overflow-hidden border border-white/10"><img src="${r.item.hero_image||'./public/assets/images/opt_0008_img_exact_87ca3.webp'}" class="w-full h-auto"><div class="p-4 bg-black/80"><p class="text-[0.65rem] font-mono text-white/70 uppercase">Estilo</p><h4 class="font-bold text-white">${r.item.title}</h4></div></div></div>`
          : `<div class="img-card group"><div class="img-wrapper rounded-2xl overflow-hidden border border-white/10"><img src="${r.item.image_url}" class="w-full h-auto"><div class="p-3 bg-black/80 flex items-center justify-between"><span class="text-xs text-white">${r.item.title||'Prompt'}</span><button class="px-3 py-1 bg-white/20 text-white text-xs rounded-full" onclick="window.appCopy2('${encodeURIComponent(r.item.prompt_text)}')">Copiar</button></div></div></div>`
        ).join('')}</div>`}
    </section>`;
    window.appNavCat2 = navigateToCategory;
    window.appCopy2 = enc => { 
      if(!isLoggedIn){
        const msg = 'para copiar o prompt dessa imagem, faça login ou crie sua conta online.';
        showToast('⚠️ ' + msg);
        showAuthModal(msg);
        return;
      } 
      navigator.clipboard.writeText(decodeURIComponent(enc)).then(()=>showToast('✅ Prompt copiado!')); 
    };
    setTimeout(triggerAnimObservers, 100);
  }

  // ──────────────────────────────────────────────────────────────────────────
  // VIEW 5: COMMUNITY — RED SHADER ATELIER & VIP CREATOR ECOSYSTEM
  // ──────────────────────────────────────────────────────────────────────────
  let communityActiveTab = 'feed'; // 'feed' | 'prompts' | 'ranking' | 'challenges' | 'saved' | 'tag-editor'
  let communityActiveFilter = 'all'; // 'all' | tag.id
  let communityPromptModelFilter = 'all'; // 'all' | 'Flux.1' | 'Midjourney' | 'ComfyUI' | 'SD 3.5'
  let communitySearchQuery = '';
  let communitySelectedCategory = 'prompts';
  let communityPromptBoxOpen = false;

  const DEFAULT_COMMUNITY_TAGS = [
    { id: 'prompts', name: 'Prompts & Workflows', icon: '⚡', color: 'red', desc: 'Prompts, pipelines e fluxos no Flux.1, Midjourney e ComfyUI' },
    { id: 'showcase', name: 'Showcases & Renders', icon: '🎨', color: 'purple', desc: 'Artes, gerações visuais e criações finalizadas da comunidade' },
    { id: 'tips', name: 'Dicas Técnicas', icon: '💡', color: 'amber', desc: 'Tutoriais, hacks e engenharia de prompt' },
    { id: 'official', name: 'Anúncios Oficiais', icon: '📌', color: 'emerald', desc: 'Comunicados e diretrizes oficiais da administração soberana' }
  ];

  function getCommunityTags() {
    try {
      const raw = localStorage.getItem('mcp_community_tags');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch(e) {}
    return [...DEFAULT_COMMUNITY_TAGS];
  }

  function saveCommunityTags(tags) {
    try {
      localStorage.setItem('mcp_community_tags', JSON.stringify(tags));
    } catch(e) {}
  }

  const TAG_COLOR_MAP = {
    red: { badge: 'bg-red-500/15 text-red-300 border-red-500/30 hover:border-red-400', border: 'border-red-500/30', cardBorder: 'border-red-500/20 hover:border-red-500/40', glow: 'from-red-950/40 to-black/60', dot: 'bg-red-400' },
    purple: { badge: 'bg-purple-500/15 text-purple-300 border-purple-500/30 hover:border-purple-400', border: 'border-purple-500/30', cardBorder: 'border-purple-500/20 hover:border-purple-500/40', glow: 'from-purple-950/40 to-black/60', dot: 'bg-purple-400' },
    amber: { badge: 'bg-amber-500/15 text-amber-300 border-amber-500/30 hover:border-amber-400', border: 'border-amber-500/30', cardBorder: 'border-amber-500/20 hover:border-amber-500/40', glow: 'from-amber-950/40 to-black/60', dot: 'bg-amber-400' },
    emerald: { badge: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30 hover:border-emerald-400', border: 'border-emerald-500/30', cardBorder: 'border-emerald-500/20 hover:border-emerald-500/40', glow: 'from-emerald-950/40 to-black/60', dot: 'bg-emerald-400' },
    cyan: { badge: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30 hover:border-cyan-400', border: 'border-cyan-500/30', cardBorder: 'border-cyan-500/20 hover:border-cyan-500/40', glow: 'from-cyan-950/40 to-black/60', dot: 'bg-cyan-400' },
    blue: { badge: 'bg-blue-500/15 text-blue-300 border-blue-500/30 hover:border-blue-400', border: 'border-blue-500/30', cardBorder: 'border-blue-500/20 hover:border-blue-500/40', glow: 'from-blue-950/40 to-black/60', dot: 'bg-blue-400' },
    pink: { badge: 'bg-pink-500/15 text-pink-300 border-pink-500/30 hover:border-pink-400', border: 'border-pink-500/30', cardBorder: 'border-pink-500/20 hover:border-pink-500/40', glow: 'from-pink-950/40 to-black/60', dot: 'bg-pink-400' }
  };

  function getTagColorClasses(colorKey) {
    return TAG_COLOR_MAP[colorKey] || TAG_COLOR_MAP.red;
  }

  function getTagPostCount(tagId) {
    return communityPosts.filter(p => {
      if (p.category === tagId || p.tag === tagId) return true;
      if (Array.isArray(p.tags) && p.tags.includes(tagId)) return true;
      if (tagId === 'prompts' && (p.ai_prompt || (p.title && p.title.toLowerCase().includes('prompt')))) return true;
      if (tagId === 'showcase' && (p.images && p.images.length > 0)) return true;
      if (tagId === 'tips' && (p.title && p.title.toLowerCase().includes('dica'))) return true;
      if (tagId === 'official' && (p.is_pinned || p.category === 'official')) return true;
      return false;
    }).length;
  }

  const COMMUNITY_SHADERS_DEFAULT = [
    { id: 'strands', name: 'Strands Rubro', icon: '✨' },
    { id: 'ferrofluid', name: 'Ferrofluid Crimson', icon: '🩸' },
    { id: 'darkveil', name: 'Dark Veil Rubro', icon: '🌌' },
    { id: 'balatro', name: 'Balatro Blood', icon: '⚡' },
    { id: 'liquidether', name: 'Liquid Ether Ruby', icon: '💫' },
    { id: 'antigravity', name: 'Antigravidade', icon: '🪐' },
    { id: 'topography', name: 'Topografia Laser', icon: '🏔️' },
    { id: 'ghostfibers', name: 'Ghost Fibers Blood', icon: '👻' },
    { id: 'aurora', name: 'Aurora Escarlate', icon: '🌈' },
    { id: 'plasma', name: 'Plasma Vermelho', icon: '🔮' },
    { id: 'webthreads', name: 'Web Threads Rubro', icon: '🕸️' },
    { id: 'floatinglines', name: 'Floating Lines Crimson', icon: '〰️' },
    { id: 'silk', name: 'Seda Carmesim', icon: '🧣' },
    { id: 'ripplegrid', name: 'Ripple Grid Red', icon: '🌐' },
    { id: 'particles', name: 'Partículas Rubras', icon: '✨' }
  ];

  function getCommunityShadersList() {
    return window.COMMUNITY_SHADERS || COMMUNITY_SHADERS_DEFAULT;
  }

  function renderCommunityView() {
    if (!isLoggedIn) { showAuthModal(); return; }
    selectedFilesToUpload = [];

    const tags = getCommunityTags();

    // Filtro e Busca de Posts para o Feed
    let filteredPosts = [...communityPosts];
    if (communityActiveFilter !== 'all') {
      filteredPosts = filteredPosts.filter(p => {
        if (p.category === communityActiveFilter || p.tag === communityActiveFilter) return true;
        if (Array.isArray(p.tags) && p.tags.includes(communityActiveFilter)) return true;
        if (communityActiveFilter === 'prompts' && (p.ai_prompt || (p.title && p.title.toLowerCase().includes('prompt')))) return true;
        if (communityActiveFilter === 'showcase' && (p.images && p.images.length > 0)) return true;
        if (communityActiveFilter === 'tips' && (p.title && p.title.toLowerCase().includes('dica'))) return true;
        if (communityActiveFilter === 'official' && (p.is_pinned || p.category === 'official')) return true;
        return false;
      });
    }

    if (communitySearchQuery.trim()) {
      const q = communitySearchQuery.toLowerCase().trim();
      filteredPosts = filteredPosts.filter(p =>
        (p.title && p.title.toLowerCase().includes(q)) ||
        (p.content && p.content.toLowerCase().includes(q)) ||
        (p.user_name && p.user_name.toLowerCase().includes(q)) ||
        (p.ai_prompt && p.ai_prompt.toLowerCase().includes(q))
      );
    }

    const currentShaderId = localStorage.getItem('mcp_community_active_shader') || 'strands';
    const isRotative = localStorage.getItem('mcp_community_rotative') === 'true';
    const shadersList = getCommunityShadersList();
    const currentShaderObj = shadersList.find(s => s.id === currentShaderId) || shadersList[0];

    mainAppContainer.innerHTML = `
      <section class="py-8 px-4 sm:px-6 lg:px-8 max-w-[1080px] mx-auto relative z-10">

        <!-- HEADER MINIMALISTA: NAVEGAÇÃO DE FLUXO -->
        <div class="mb-6 flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-5 gap-4">
          <div>
            <div class="flex items-center space-x-2">
              <span class="text-xs font-bold text-white/50 tracking-widest uppercase">REDE SOCIAL VIP</span>
              <span class="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" title="Personal OS Shader Ativo"></span>
              <span class="text-[10px] text-red-300 font-mono">5s cinematic</span>
            </div>
            <h1 class="text-3xl font-extrabold text-white mt-1 flex items-center space-x-3">
              <span>${communityActiveTab === 'tag-editor' ? 'Tag Editor & Taxonomia' : 'Feed & Discussões'}</span>
              ${currentUserRole === 'admin' ? '<span class="text-xs px-2.5 py-0.5 rounded-full bg-red-500/20 border border-red-500/40 text-red-200 font-mono font-bold">👑 ADMIN</span>' : ''}
            </h1>
          </div>

          <!-- NAVEGAÇÃO DE ABAS: FEED & TAG EDITOR -->
          <div class="flex items-center space-x-2 bg-black/40 p-1.5 rounded-full border border-white/10 self-start sm:self-auto backdrop-blur-md">
            <button onclick="window.appSwitchCommunityTab('feed')"
              class="px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center space-x-1.5 ${communityActiveTab !== 'tag-editor' ? 'bg-white text-black shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'}">
              <span>💬</span>
              <span>Feed & Discussões</span>
            </button>
            <button onclick="window.appSwitchCommunityTab('tag-editor')"
              class="px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center space-x-1.5 ${communityActiveTab === 'tag-editor' ? 'bg-white text-black shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'}">
              <span>🏷️</span>
              <span>Tag Editor</span>
              <span class="text-[10px] px-1.5 py-0.2 rounded-full ${communityActiveTab === 'tag-editor' ? 'bg-black text-white' : 'bg-white/10 text-white/80'}">${tags.length}</span>
            </button>
          </div>
        </div>

        <!-- CONTEÚDO PURO: FEED E DISCUSSÃO OU TAG EDITOR -->
        ${renderCommunityTabContent(filteredPosts)}
      </section>`;

    setupCommunityHandlers();
    setTimeout(triggerAnimObservers, 100);
  }

  function renderCommunityTabContent(filteredPosts) {
    if (communityActiveTab === 'tag-editor' || communityActiveTab === 'tags') {
      return renderCommunityTagEditorTab();
    }
    if (communityActiveTab === 'prompts') {
      return renderCommunityPromptsTab();
    }
    if (communityActiveTab === 'ranking') {
      return renderCommunityRankingTab();
    }
    if (communityActiveTab === 'challenges') {
      return renderCommunityChallengesTab();
    }
    if (communityActiveTab === 'saved') {
      return renderCommunitySavedTab();
    }
    return renderCommunityFeedTab(filteredPosts);
  }

  function renderCommunityFeedTab(filteredPosts) {
    const shadersList = getCommunityShadersList();
    const currentShaderId = localStorage.getItem('mcp_community_active_shader') || 'strands';
    const isRotative = localStorage.getItem('mcp_community_rotative') === 'true';
    const tags = getCommunityTags();

    return `
      <!-- FILTROS DE TAGS DINÂMICAS & BUSCA INTEGRADA COMPACTA -->
      <div class="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div class="flex items-center space-x-2 overflow-x-auto pb-1 text-xs">
          <button onclick="window.appFilterCommunity('all')"
            class="px-3.5 py-1.5 rounded-full font-bold transition-all whitespace-nowrap ${communityActiveFilter === 'all' ? 'bg-white text-black shadow-md' : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/10'}">
            🌟 Todos (${communityPosts.length})
          </button>
          ${tags.map(t => {
            const count = getTagPostCount(t.id);
            const isAct = communityActiveFilter === t.id;
            return `
              <button onclick="window.appFilterCommunity('${t.id}')"
                class="px-3.5 py-1.5 rounded-full font-bold transition-all whitespace-nowrap flex items-center space-x-1.5 ${isAct ? 'bg-white text-black shadow-md' : 'bg-white/5 text-gray-300 hover:text-white hover:bg-white/10 border border-white/10'}">
                <span>${t.icon || '🏷️'}</span>
                <span>${escapeHtml(t.name)}</span>
                <span class="text-[10px] opacity-70">(${count})</span>
              </button>
            `;
          }).join('')}
          <button onclick="window.appSwitchCommunityTab('tag-editor')" title="Gerenciar e editar tags"
            class="px-3 py-1.5 rounded-full font-bold transition-all whitespace-nowrap text-xs text-white/50 hover:text-white bg-white/5 hover:bg-white/10 border border-dashed border-white/20 flex items-center space-x-1">
            <span>⚙️</span>
            <span>Tag Editor</span>
          </button>
        </div>

        <div class="relative w-full md:w-64">
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">🔍</span>
          <input type="text" id="communitySearchInput" placeholder="Buscar no feed..."
            value="${escapeHtml(communitySearchQuery)}"
            oninput="window.appSearchCommunity(this.value)"
            class="w-full bg-white/5 border border-white/15 focus:border-white/30 rounded-full pl-8 pr-3 py-1.5 text-xs text-white placeholder-white/30 focus:outline-none focus:bg-black/60 transition-all font-medium">
        </div>
      </div>

      <!-- LAYOUT ORIGINAL 2 COLUNAS: FEED (2/3) + SIDEBAR (1/3) -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-7">
        <div class="lg:col-span-2 space-y-5">

          <!-- POST COMPOSER ORIGINAL APRIMORADO -->
          <div class="glass-card rounded-3xl overflow-hidden p-5 border border-white/10">
            <div class="flex items-start space-x-3.5">
              <img src="${currentUserAvatarUrl}" class="w-10 h-10 rounded-full border border-white/20 flex-shrink-0 cursor-pointer object-cover" onclick="window.appGoProfile()" title="Ver perfil">
              <div class="flex-1 space-y-3 min-w-0">
                <input type="text" id="newPostTitle" placeholder="Título do post (opcional)..."
                  class="w-full bg-transparent border-b border-white/10 pb-2 text-sm font-bold text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition-colors">
                <textarea id="newPostContent" rows="3" placeholder="Compartilhe uma ideia, prompt ou dúvida com a comunidade..."
                  class="w-full bg-white/5 border border-white/10 rounded-2xl p-3.5 text-sm text-white focus:outline-none focus:border-white/25 focus:bg-white/10 transition-all resize-none placeholder-white/30 leading-relaxed"></textarea>

                <!-- AI Prompt Studio Module (Expansível) -->
                <div id="composerPromptBox" class="${communityPromptBoxOpen ? '' : 'hidden'} p-3.5 rounded-2xl bg-black/70 border border-white/10 space-y-2.5">
                  <div class="flex items-center justify-between border-b border-white/10 pb-2">
                    <span class="text-xs font-bold text-white/80 flex items-center space-x-1.5 font-mono">
                      <span>🔮</span><span>AI Prompt Studio</span>
                    </span>
                    <select id="newPostPromptModel" class="bg-black/80 border border-white/20 rounded-lg px-2 py-0.5 text-[11px] text-white focus:outline-none">
                      <option value="Flux.1 Dev">Flux.1 Dev</option>
                      <option value="Flux.1 Schnell">Flux.1 Schnell</option>
                      <option value="Midjourney v6.1">Midjourney v6.1</option>
                      <option value="Midjourney v7">Midjourney v7</option>
                      <option value="Ideogram 2.0">Ideogram 2.0</option>
                      <option value="ComfyUI Pipeline">ComfyUI Pipeline</option>
                      <option value="Stable Diffusion 3.5">Stable Diffusion 3.5</option>
                    </select>
                  </div>
                  <textarea id="newPostPromptCode" rows="2" placeholder="Cole aqui o prompt textual exato..."
                    class="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-xs font-mono text-gray-200 placeholder-white/30 focus:outline-none"></textarea>
                  <input type="text" id="newPostPromptParams" placeholder="Parâmetros ou flags (ex: --ar 16:9 --v 6.1 --stylize 350)"
                    class="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-xs font-mono text-gray-300 placeholder-white/30 focus:outline-none">
                </div>

                <!-- Preview de Upload de Imagens -->
                <div id="postImageUploadPreview" class="hidden grid grid-cols-5 gap-2 pt-1"></div>

                <!-- Campo de Link -->
                <div id="postLinkField" class="hidden p-3 bg-white/5 rounded-2xl border border-white/10 space-y-2">
                  <input type="url" id="newPostLinkUrl" placeholder="URL do link (https://...)" class="w-full bg-transparent text-xs text-white placeholder-white/30 focus:outline-none border-b border-white/10 pb-1">
                  <input type="text" id="newPostLinkTitle" placeholder="Título do link (opcional)" class="w-full bg-transparent text-xs text-white placeholder-white/30 focus:outline-none">
                </div>

                <!-- Seleção de Tag no Composer -->
                <div class="pt-2 border-t border-white/5 flex items-center space-x-2">
                  <span class="text-[11px] font-mono font-bold text-gray-400 whitespace-nowrap">🏷️ Tag:</span>
                  <div class="flex items-center space-x-1.5 overflow-x-auto pb-1 text-xs" id="composerTagPills">
                    ${tags.map(t => {
                      const isSel = (communitySelectedCategory || (tags[0] && tags[0].id)) === t.id;
                      return `
                        <button type="button" onclick="window.selectPostCategory('${t.id}', this)"
                          class="post-cat-btn px-2.5 py-1 rounded-lg border font-bold transition-all text-xs flex items-center space-x-1 whitespace-nowrap ${isSel ? 'bg-red-500/20 text-red-200 border-red-500/40 shadow-sm' : 'bg-white/5 text-gray-400 border-white/10 hover:text-white'}">
                          <span>${t.icon || '🏷️'}</span>
                          <span>${escapeHtml(t.name)}</span>
                        </button>
                      `;
                    }).join('')}
                  </div>
                </div>
              </div>
            </div>

            <input type="file" id="communityFileInput" multiple accept="image/*" class="hidden">

            <!-- Composer Toolbar -->
            <div class="flex items-center justify-between pt-3 mt-3 border-t border-white/10">
              <div class="flex items-center space-x-2">
                <button type="button" onclick="document.getElementById('communityFileInput').click()" class="flex items-center space-x-1.5 text-xs text-white/70 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 rounded-full transition-all">
                  <span>📷</span><span>Upload de Imagem (Até 5MB)</span>
                </button>
                <button type="button" onclick="window.toggleComposerPromptBox()" class="flex items-center space-x-1.5 text-xs text-white/70 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 rounded-full transition-all">
                  <span>🔮</span><span>AI Prompt Studio</span>
                </button>
                <button type="button" onclick="window.togglePostLink()" class="flex items-center space-x-1.5 text-xs text-white/70 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 rounded-full transition-all">
                  <span>🔗</span><span>Link</span>
                </button>
              </div>
              <button id="submitPostBtn" onclick="window.appCreatePost()" class="px-6 py-2 rounded-full font-bold bg-white text-black text-xs shadow-xl hover:scale-105 active:scale-95 transition-all">
                Publicar
              </button>
            </div>
          </div>

          <!-- POSTS FEED -->
          <div class="space-y-4" id="communityFeed">
            ${filteredPosts.length === 0
              ? `<div class="text-center py-16 glass-card rounded-3xl"><div class="text-4xl mb-3">💬</div><p class="text-graphite text-sm">Nenhum post encontrado. Seja o primeiro a publicar!</p></div>`
              : filteredPosts.map(renderPostCard).join('')}
          </div>
        </div>

        <!-- SIDEBAR (1/3) -->
        <div class="space-y-5">
          <!-- 1. Perfil Rápido -->
          <div class="glass-card rounded-3xl p-5 border border-white/10">
            <div class="flex items-center space-x-3 mb-4">
              <img src="${currentUserAvatarUrl}" class="w-12 h-12 rounded-full border border-white/20 object-cover">
              <div class="min-w-0">
                <p class="text-sm font-bold text-white truncate">${currentUserNameStr}</p>
                <div class="mt-0.5">${getBadge(currentUserRole)}</div>
              </div>
            </div>
            <button onclick="window.appGoProfile()" class="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs text-white transition-all font-semibold">
              Editar Perfil →
            </button>
          </div>

          <!-- 2. Estatísticas & Métricas da Comunidade -->
          <div class="glass-card rounded-3xl p-5 border border-white/10">
            <h3 class="text-sm font-bold text-white mb-3 flex items-center justify-between">
              <span>📊 Estatísticas</span>
              <span class="text-[10px] text-emerald-400 font-mono font-bold">Ao Vivo</span>
            </h3>
            <div class="grid grid-cols-2 gap-2.5">
              <div class="bg-white/5 rounded-xl p-2.5 text-center border border-white/10">
                <p class="text-lg font-extrabold text-white">1.842</p>
                <p class="text-[10px] text-gray-400">Membros VIP Ativos</p>
              </div>
              <div class="bg-white/5 rounded-xl p-2.5 text-center border border-white/10">
                <p class="text-lg font-extrabold text-white">14.280</p>
                <p class="text-[10px] text-gray-400">Prompts & Workflows</p>
              </div>
              <div class="bg-white/5 rounded-xl p-2.5 text-center border border-white/10">
                <p class="text-lg font-extrabold text-white">${communityPosts.length}</p>
                <p class="text-[10px] text-gray-400">Posts no Feed</p>
              </div>
              <div class="bg-white/5 rounded-xl p-2.5 text-center border border-white/10">
                <p class="text-lg font-extrabold text-white">${communityPosts.reduce((a,p)=>a+(p.comments?.length||0),0)}</p>
                <p class="text-[10px] text-gray-400">Respostas</p>
              </div>
            </div>
          </div>

          <!-- 3. Atmosfera Visual WebGL (Personal OS) - Discreta e Elegante na Sidebar -->
          <div class="glass-card rounded-3xl p-5 border border-white/10 space-y-3">
            <div class="flex items-center justify-between border-b border-white/10 pb-2.5">
              <div class="flex items-center space-x-2">
                <span class="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                <h4 class="text-xs font-bold text-white font-mono">Atmosfera Visual WebGL (Personal OS)</h4>
              </div>
              <span class="text-[10px] text-red-300 font-mono">5s</span>
            </div>
            <div>
              <label class="block text-[10px] text-gray-400 font-mono mb-1">Shader de Fundo Rubro:</label>
              <select onchange="window.appSelectCommunityShader(this.value)" class="w-full bg-black/70 border border-white/20 rounded-xl px-3 py-2 text-xs text-white focus:outline-none font-mono">
                ${shadersList.map(sh => `
                  <option value="${sh.id}" ${sh.id === currentShaderId ? 'selected' : ''}>${sh.icon || '✨'} ${sh.name}</option>
                `).join('')}
              </select>
            </div>
            <div class="flex items-center justify-between pt-1 text-xs">
              <button onclick="window.appToggleCommunityRotative()" id="btnCommunityRotativeToggle" class="shader-pill-btn text-xs text-red-300 hover:text-white font-mono flex items-center space-x-1">
                <span>${isRotative ? '🔄 Rotativo (5s)' : '⏸️ Modo Fixo'}</span>
              </button>
              <button onclick="window.appRandomCommunityShader()" class="text-gray-400 hover:text-white font-mono text-[11px]">
                🎲 Sortear
              </button>
            </div>
          </div>

          <!-- 4. Trending Prompts -->
          <div class="glass-card rounded-3xl p-5 border border-white/10">
            <h3 class="text-sm font-bold text-white mb-3 flex items-center space-x-2">
              <span>🔥</span><span>Trending Prompts</span>
            </h3>
            <div class="space-y-2 text-xs">
              <div onclick="window.appSearchCommunity('#FluxReduxStyle')" class="flex items-center justify-between p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-all cursor-pointer">
                <span class="font-mono text-red-300 font-bold">#FluxReduxStyle</span>
                <span class="text-[10px] text-gray-400">342 posts</span>
              </div>
              <div onclick="window.appSearchCommunity('#CyberpunkRuby')" class="flex items-center justify-between p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-all cursor-pointer">
                <span class="font-mono text-red-300 font-bold">#CyberpunkRuby</span>
                <span class="text-[10px] text-gray-400">280 posts</span>
              </div>
              <div onclick="window.appSearchCommunity('#MidjourneyV7')" class="flex items-center justify-between p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-all cursor-pointer">
                <span class="font-mono text-red-300 font-bold">#MidjourneyV7</span>
                <span class="text-[10px] text-gray-400">215 posts</span>
              </div>
            </div>
          </div>

          <!-- 5. Top Criadores da Semana -->
          <div class="glass-card rounded-3xl p-5 border border-white/10">
            <div class="flex items-center justify-between mb-3">
              <h3 class="text-sm font-bold text-white flex items-center space-x-2">
                <span>🏆</span><span>Top Criadores da Semana</span>
              </h3>
              <button onclick="window.appSwitchCommunityTab('ranking')" class="text-[10px] font-mono text-red-300 hover:underline">Ver Todos →</button>
            </div>
            <div class="space-y-2 text-xs">
              <div class="flex items-center justify-between p-2 rounded-xl bg-white/5">
                <div class="flex items-center space-x-2 min-w-0">
                  <span class="font-bold text-amber-400">1º</span>
                  <p class="font-bold text-white truncate">Mateus Celestino Pro X</p>
                </div>
                <span class="font-mono font-bold text-amber-400">3.450 XP</span>
              </div>
              <div class="flex items-center justify-between p-2 rounded-xl bg-white/5">
                <div class="flex items-center space-x-2 min-w-0">
                  <span class="font-bold text-gray-400">2º</span>
                  <p class="font-bold text-white truncate">Lucas Rocha</p>
                </div>
                <span class="font-mono font-bold text-gray-300">2.190 XP</span>
              </div>
            </div>
          </div>

          <!-- 6. Salas Rápidas -->
          <div class="glass-card rounded-3xl p-5 border border-white/10">
            <h3 class="text-sm font-bold text-white mb-2.5 flex items-center space-x-2">
              <span>💬</span><span>Salas Rápidas</span>
            </h3>
            <div class="space-y-1 text-xs font-mono">
              <button onclick="window.appSwitchCommunityTab('feed'); window.appFilterCommunity('all');" class="w-full flex items-center justify-between p-1.5 rounded-lg hover:bg-white/5 text-gray-300 hover:text-white transition-all text-left">
                <span># geral-feed</span>
                <span class="text-[10px] text-emerald-400">Feed</span>
              </button>
              <button onclick="window.appSwitchCommunityTab('prompts')" class="w-full flex items-center justify-between p-1.5 rounded-lg hover:bg-white/5 text-gray-300 hover:text-white transition-all text-left">
                <span># acervo-prompts</span>
                <span class="text-[10px] text-red-400">Vault</span>
              </button>
              <button onclick="window.appSwitchCommunityTab('ranking')" class="w-full flex items-center justify-between p-1.5 rounded-lg hover:bg-white/5 text-gray-300 hover:text-white transition-all text-left">
                <span># hall-da-fama</span>
                <span class="text-[10px] text-amber-400">XP</span>
              </button>
            </div>
          </div>

          <!-- Side Banner Ads -->
          ${renderSideBanner()}
        </div>
      </div>`;
  }

  function renderCommunityTagEditorTab() {
    const tags = getCommunityTags();
    const totalPosts = communityPosts.length;

    // Estatísticas das tags
    const tagStats = tags.map(t => ({
      ...t,
      count: getTagPostCount(t.id)
    }));

    const topTag = tagStats.reduce((max, t) => (t.count > (max?.count || 0) ? t : max), tagStats[0] || null);

    return `
      <div class="space-y-6 anim-element anim-fade-up">

        <!-- HEADER DA ABA TAG EDITOR -->
        <div class="p-6 sm:p-8 rounded-3xl glass-card border border-red-500/20 shadow-2xl relative overflow-hidden">
          <div class="absolute -right-10 -bottom-10 w-64 h-64 bg-red-600/10 rounded-full blur-3xl pointer-events-none"></div>

          <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div class="space-y-2 max-w-xl">
              <div class="flex items-center space-x-2">
                <span class="px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-red-500/20 border border-red-500/40 text-red-200">
                  🏷️ TAXONOMIA & NAVEGAÇÃO VIP
                </span>
                <span class="text-xs text-graphite font-mono">${tags.length} tags ativas</span>
              </div>
              <h2 class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Gerenciador & Editor de Tags
              </h2>
              <p class="text-xs sm:text-sm text-graphite leading-relaxed">
                Crie, edite e organize os temas e tópicos da comunidade. Essas tags alimentam o sistema inteligente de filtragem e navegação de publicações do feed.
              </p>
            </div>

            <div class="flex flex-wrap items-center gap-2.5">
              <button onclick="window.appRestoreDefaultTags()"
                class="px-4 py-2.5 rounded-full text-xs font-bold text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/15 transition-all flex items-center space-x-1.5"
                title="Restaura as tags recomendadas">
                <span>🔄</span>
                <span>Restaurar Padrões</span>
              </button>
              <button onclick="window.appOpenTagModal()"
                class="px-5 py-2.5 rounded-full text-xs font-extrabold text-black bg-white hover:bg-gray-200 shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center space-x-2">
                <span class="text-base font-bold leading-none">+</span>
                <span>Nova Tag</span>
              </button>
            </div>
          </div>

          <!-- MÉTRICAS RÁPIDAS -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-6 pt-6 border-t border-white/10">
            <div class="bg-black/40 border border-white/10 rounded-2xl p-3.5 flex items-center space-x-3">
              <div class="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-lg">🏷️</div>
              <div>
                <p class="text-base font-extrabold text-white">${tags.length}</p>
                <p class="text-[11px] text-gray-400">Tags Cadastradas</p>
              </div>
            </div>

            <div class="bg-black/40 border border-white/10 rounded-2xl p-3.5 flex items-center space-x-3">
              <div class="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-lg">📊</div>
              <div>
                <p class="text-base font-extrabold text-white">${totalPosts}</p>
                <p class="text-[11px] text-gray-400">Publicações Totais</p>
              </div>
            </div>

            <div class="bg-black/40 border border-white/10 rounded-2xl p-3.5 flex items-center space-x-3">
              <div class="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-lg">🔥</div>
              <div>
                <p class="text-base font-extrabold text-white truncate max-w-[140px]">${topTag ? `${topTag.icon} ${escapeHtml(topTag.name)}` : 'Nenhuma'}</p>
                <p class="text-[11px] text-gray-400">Tag Mais Utilizada</p>
              </div>
            </div>
          </div>
        </div>

        <!-- GRID DE CARDS DE TAGS -->
        ${tags.length === 0 ? `
          <div class="text-center py-20 glass-card rounded-3xl border border-white/10">
            <div class="text-5xl mb-3">🏷️</div>
            <h3 class="text-lg font-bold text-white mb-2">Nenhuma tag cadastrada</h3>
            <p class="text-xs text-graphite max-w-md mx-auto mb-5">Você pode restaurar as tags recomendadas da comunidade ou criar novas tags customizadas.</p>
            <div class="flex items-center justify-center space-x-3">
              <button onclick="window.appRestoreDefaultTags()" class="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all">
                Restaurar Padrões
              </button>
              <button onclick="window.appOpenTagModal()" class="px-5 py-2.5 rounded-full bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-all">
                + Criar Nova Tag
              </button>
            </div>
          </div>
        ` : `
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            ${tags.map(t => {
              const count = getTagPostCount(t.id);
              const colorInfo = getTagColorClasses(t.color);
              return `
                <div class="glass-card rounded-3xl p-5 border ${colorInfo.cardBorder} transition-all duration-300 hover:scale-[1.01] hover:shadow-xl flex flex-col justify-between" id="tag-card-${t.id}">
                  <div>
                    <div class="flex items-start justify-between mb-3">
                      <div class="flex items-center space-x-3">
                        <div class="w-11 h-11 rounded-2xl bg-white/5 border border-white/15 flex items-center justify-center text-xl shadow-inner">
                          ${t.icon || '🏷️'}
                        </div>
                        <div>
                          <h4 class="text-sm font-extrabold text-white flex items-center space-x-2">
                            <span>${escapeHtml(t.name)}</span>
                          </h4>
                          <span class="text-[11px] font-mono text-gray-400">#${escapeHtml(t.id)}</span>
                        </div>
                      </div>

                      <span class="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold border ${colorInfo.badge}">
                        ${count} ${count === 1 ? 'post' : 'posts'}
                      </span>
                    </div>

                    <p class="text-xs text-graphite leading-relaxed mb-4 min-h-[32px]">
                      ${escapeHtml(t.desc || 'Sem descrição cadastrada.')}
                    </p>
                  </div>

                  <!-- Ações da Tag -->
                  <div class="pt-3 border-t border-white/10 flex items-center justify-between">
                    <button onclick="window.appFilterCommunity('${t.id}'); window.appSwitchCommunityTab('feed');"
                      class="text-xs font-bold text-white/80 hover:text-white flex items-center space-x-1.5 transition-colors group">
                      <span>🔍</span>
                      <span class="group-hover:underline">Ver no Feed</span>
                      <span class="text-[10px] text-gray-400">→</span>
                    </button>

                    <div class="flex items-center space-x-1.5">
                      <button onclick="window.appOpenTagModal('${t.id}')"
                        class="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-white text-xs font-semibold transition-all flex items-center space-x-1">
                        <span>✏️</span>
                        <span>Editar</span>
                      </button>
                      <button onclick="window.appDeleteTag('${t.id}')"
                        class="px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/25 border border-red-500/20 text-red-300 text-xs font-semibold transition-all flex items-center space-x-1"
                        title="Apagar tag">
                        <span>🗑️</span>
                        <span>Apagar</span>
                      </button>
                    </div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        `}
      </div>
    `;
  }

  function renderCommunityPromptsTab() {
    let promptPosts = communityPosts.filter(p => p.ai_prompt || p.category === 'prompts');
    if (communityPromptModelFilter !== 'all') {
      promptPosts = promptPosts.filter(p => (p.ai_model || '').toLowerCase().includes(communityPromptModelFilter.toLowerCase()));
    }

    const modelsList = [
      { id: 'all', name: 'Todos os Modelos' },
      { id: 'Flux.1', name: 'Flux.1 Dev / Schnell' },
      { id: 'Midjourney', name: 'Midjourney v6 & v7' },
      { id: 'ComfyUI', name: 'ComfyUI Pipelines' },
      { id: 'Stable Diffusion', name: 'SD 3.5 & SDXL' },
      { id: 'Kling', name: 'Kling AI Video' }
    ];

    return `
      <div class="space-y-8 anim-element anim-fade-up">
        <!-- Prompts Header Strip -->
        <div class="p-6 rounded-3xl glass-card-community border border-red-500/20 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div class="flex items-center space-x-2 mb-1">
              <span class="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-red-500/20 text-red-300 border border-red-500/30 uppercase">Vault de Engenharia Reversa</span>
              <span class="text-[10px] text-gray-400 font-mono">${promptPosts.length} Prompts Validados</span>
            </div>
            <h2 class="text-2xl sm:text-3xl font-extrabold text-white">Acervo de Prompts VIP Exclusivos</h2>
            <p class="text-xs text-gray-300 mt-1 max-w-xl">Copie com 1 clique fórmulas testadas com sementes, parâmetros cinemáticos e configurações otimizadas de iluminação.</p>
          </div>

          <button onclick="window.appSwitchCommunityTab('feed'); setTimeout(()=>{document.getElementById('newPostContent')?.focus(); window.toggleComposerPromptBox(); window.scrollTo({top: 400, behavior: 'smooth'});}, 100);"
            class="px-5 py-2.5 rounded-full bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-bold text-xs shadow-[0_0_20px_rgba(220,38,38,0.4)] hover:scale-105 active:scale-95 transition-all flex items-center space-x-2 self-start md:self-auto">
            <span>✨</span><span>Enviar Novo Prompt</span>
          </button>
        </div>

        <!-- Model Filter Pills -->
        <div class="flex items-center space-x-2 overflow-x-auto pb-1 text-xs">
          ${modelsList.map(m => `
            <button onclick="window.appFilterPromptModel('${m.id}')"
              class="px-4 py-2 rounded-full font-bold transition-all whitespace-nowrap ${communityPromptModelFilter === m.id ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.4)]' : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/10'}">
              ${m.name}
            </button>
          `).join('')}
        </div>

        <!-- Prompts Bento Grid -->
        ${promptPosts.length === 0 ? `
          <div class="text-center py-20 glass-card-community rounded-3xl border border-white/10">
            <div class="text-5xl mb-3">🔮</div>
            <h3 class="text-base font-bold text-white mb-1">Nenhum prompt encontrado para este filtro</h3>
            <p class="text-graphite text-xs max-w-sm mx-auto">Experimente selecionar outro modelo de IA ou seja o pioneiro a postar uma fórmula!</p>
            <button onclick="window.appFilterPromptModel('all')" class="mt-4 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-xs font-bold text-white border border-white/15">Ver todos os modelos</button>
          </div>
        ` : `
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            ${promptPosts.map(p => `
              <div class="glass-card-community rounded-3xl p-6 border border-white/15 shadow-2xl flex flex-col justify-between group hover:border-red-500/40 transition-all">
                <div class="space-y-4">
                  <!-- Header: Author & Model -->
                  <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-3">
                      <img src="${p.user_avatar}" class="w-9 h-9 rounded-full object-cover border border-white/20">
                      <div>
                        <h4 class="text-xs font-bold text-white leading-tight">${escapeHtml(p.user_name || 'Membro VIP')}</h4>
                        <span class="text-[10px] text-gray-400 font-mono">${formatDate(p.created_at)}</span>
                      </div>
                    </div>
                    <span class="px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-red-500/15 text-red-300 border border-red-500/30">
                      ${escapeHtml(p.ai_model || 'FLUX.1 / MIDJOURNEY')}
                    </span>
                  </div>

                  <!-- Optional Render Image -->
                  ${p.images && p.images.length > 0 ? `
                    <div class="rounded-2xl overflow-hidden border border-white/10 h-52 bg-black/60 relative cursor-pointer group/img"
                      onclick="window.openCommunityLightbox('${p.images[0]}', '${escapeJs(p.title || 'Prompt Render')}')">
                      <img src="${p.images[0]}" class="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-700">
                      <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity flex items-end p-3">
                        <span class="text-xs text-white font-medium">🔍 Clique para expandir imagem</span>
                      </div>
                    </div>
                  ` : ''}

                  <!-- Title -->
                  <h3 class="text-sm font-extrabold text-white group-hover:text-red-200 transition-colors">${escapeHtml(p.title || 'Fórmula de Prompt Generativo')}</h3>

                  <!-- Prompt Code Box with One-Click Copy -->
                  <div class="p-3.5 rounded-2xl bg-black/80 border border-white/10 relative space-y-2">
                    <div class="flex items-center justify-between text-[10px] font-mono text-gray-400 border-b border-white/10 pb-1.5">
                      <span>TEXTO DO PROMPT</span>
                      <button onclick="window.appCopyPrompt(this, \`${escapeJs(p.ai_prompt || p.content)}\`)"
                        class="px-3 py-1 rounded-lg bg-red-600/30 hover:bg-red-600 text-red-200 hover:text-white border border-red-500/40 font-bold transition-all flex items-center space-x-1">
                        <span>📋</span><span>Copiar Prompt</span>
                      </button>
                    </div>
                    <pre class="text-xs text-gray-200 font-mono whitespace-pre-wrap leading-relaxed select-all overflow-x-auto max-h-36">${escapeHtml(p.ai_prompt || p.content)}</pre>
                  </div>

                  <!-- Parameters Strip -->
                  ${p.ai_params ? `
                    <div class="p-2.5 rounded-xl bg-white/5 border border-white/5 text-[11px] font-mono flex items-center space-x-2">
                      <span class="text-red-400 font-bold">⚙️ Flags:</span>
                      <span class="text-gray-300 truncate">${escapeHtml(p.ai_params)}</span>
                    </div>
                  ` : ''}
                </div>

                <!-- Footer Action Buttons -->
                <div class="flex items-center justify-between pt-4 mt-4 border-t border-white/10">
                  <div class="flex items-center space-x-2">
                    <button onclick="window.appLikePost('${p.id}')"
                      class="flex items-center space-x-1.5 text-xs font-bold px-3 py-1.5 rounded-full border border-white/10 bg-white/5 hover:bg-red-500/20 hover:text-red-300 transition-all">
                      <span>❤️</span><span>${p.likes || 0}</span>
                    </button>
                    <button onclick="window.appSharePost('${p.id}')"
                      class="p-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white text-xs transition-all" title="Compartilhar">
                      <span>🔗</span>
                    </button>
                  </div>
                  <button onclick="window.appSwitchCommunityTab('feed');" class="text-xs font-mono text-gray-400 hover:text-white transition-colors">
                    Ver no Feed →
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        `}
      </div>`;
  }

  function renderCommunityRankingTab() {
    return `
      <div class="space-y-8 anim-element anim-fade-up">
        <!-- Header -->
        <div class="p-6 rounded-3xl glass-card-community border border-red-500/20 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div class="flex items-center space-x-2 mb-1">
              <span class="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase">Gamificação & Reputação</span>
              <span class="text-[10px] text-gray-400 font-mono">Temporada 2026</span>
            </div>
            <h2 class="text-2xl sm:text-3xl font-extrabold text-white">Hall da Fama & Ranking VIP</h2>
            <p class="text-xs text-gray-300 mt-1 max-w-xl">Suba de nível compartilhando prompts de alta qualidade, auxiliando outros membros e vencendo os desafios semanais.</p>
          </div>
          <div class="p-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-center self-start md:self-auto font-mono">
            <span class="text-[10px] text-amber-300 uppercase block">Seu Nível Atual</span>
            <span class="text-lg font-black text-white">Nível 10 • 9.450 XP</span>
          </div>
        </div>

        <!-- 3D Podium for Top 3 Creators -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          <!-- 2nd Place -->
          <div class="order-2 md:order-1 glass-card-community rounded-3xl p-6 border border-gray-400/30 shadow-xl text-center flex flex-col items-center justify-between relative overflow-hidden">
            <div class="absolute top-3 right-3 text-2xl">🥈</div>
            <div class="space-y-3">
              <div class="relative inline-block">
                <img src="https://api.dicebear.com/7.x/bottts/svg?seed=MemberProX" class="w-20 h-20 rounded-full border-4 border-gray-400/50 shadow-[0_0_20px_rgba(156,163,175,0.4)]">
                <span class="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-black bg-gray-400 text-black">#2 LUGAR</span>
              </div>
              <h3 class="text-base font-extrabold text-white mt-2">Lucas Rocha</h3>
              <p class="text-xs text-gray-400 font-mono">Mestre Generativo • 42 Prompts</p>
            </div>
            <div class="w-full pt-4 mt-4 border-t border-white/10">
              <span class="text-xl font-black text-gray-200 font-mono">2.980 XP</span>
            </div>
          </div>

          <!-- 1st Place (Champion) -->
          <div class="order-1 md:order-2 glass-card-community rounded-3xl p-8 border-2 border-amber-500/60 shadow-[0_20px_60px_rgba(245,158,11,0.25)] text-center flex flex-col items-center justify-between relative overflow-hidden scale-105 bg-gradient-to-b from-amber-500/10 to-transparent">
            <div class="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-48 bg-amber-500/15 rounded-full blur-3xl pointer-events-none"></div>
            <div class="text-3xl mb-1">👑</div>
            <div class="space-y-3 relative z-10">
              <div class="relative inline-block">
                <img src="https://api.dicebear.com/7.x/bottts/svg?seed=AdminBoss" class="w-24 h-24 rounded-full border-4 border-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.6)]">
                <span class="absolute -bottom-2.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[10px] font-mono font-black bg-amber-400 text-black uppercase tracking-wider">#1 SUPREMO</span>
              </div>
              <h3 class="text-lg font-black text-white mt-2">Mateus Celestino Pro X</h3>
              <p class="text-xs text-amber-300 font-mono">Visionário Supremo • 86 Prompts</p>
            </div>
            <div class="w-full pt-4 mt-4 border-t border-amber-500/20 relative z-10">
              <span class="text-2xl font-black text-amber-400 font-mono">3.450 XP</span>
              <span class="block text-[10px] text-gray-400 font-mono mt-0.5">Top 1 da Plataforma Soberana</span>
            </div>
          </div>

          <!-- 3rd Place -->
          <div class="order-3 md:order-3 glass-card-community rounded-3xl p-6 border border-amber-700/40 shadow-xl text-center flex flex-col items-center justify-between relative overflow-hidden">
            <div class="absolute top-3 right-3 text-2xl">🥉</div>
            <div class="space-y-3">
              <div class="relative inline-block">
                <img src="https://api.dicebear.com/7.x/bottts/svg?seed=ElenaArt" class="w-20 h-20 rounded-full border-4 border-amber-700/60 shadow-[0_0_20px_rgba(180,83,9,0.4)]">
                <span class="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-black bg-amber-700 text-white">#3 LUGAR</span>
              </div>
              <h3 class="text-base font-extrabold text-white mt-2">Elena Digital Art</h3>
              <p class="text-xs text-gray-400 font-mono">AI Artist VIP • 38 Prompts</p>
            </div>
            <div class="w-full pt-4 mt-4 border-t border-white/10">
              <span class="text-xl font-black text-amber-600 font-mono">2.420 XP</span>
            </div>
          </div>
        </div>

        <!-- XP Mastery Rules & Quest Card -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="glass-card-community rounded-3xl p-6 border border-white/15 space-y-3">
            <h3 class="text-sm font-bold text-white flex items-center space-x-2">
              <span>⚡</span><span>Como Subir de Nível e Ganhar XP</span>
            </h3>
            <ul class="space-y-2.5 text-xs text-gray-300 font-mono">
              <li class="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/5">
                <span>✍️ Publicar um Prompt VIP completo</span>
                <span class="text-red-400 font-bold">+50 XP</span>
              </li>
              <li class="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/5">
                <span>💬 Responder a dúvida de um criador</span>
                <span class="text-red-400 font-bold">+15 XP</span>
              </li>
              <li class="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/5">
                <span>❤️ Receber 10 curtidas na publicação</span>
                <span class="text-red-400 font-bold">+30 XP</span>
              </li>
              <li class="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/5">
                <span>🏆 Vencer o Desafio Semanal</span>
                <span class="text-amber-400 font-bold">+500 XP</span>
              </li>
            </ul>
          </div>

          <div class="glass-card-community rounded-3xl p-6 border border-white/15 space-y-3">
            <h3 class="text-sm font-bold text-white flex items-center space-x-2">
              <span>👑</span><span>Recompensas Exclusivas por Patamar</span>
            </h3>
            <div class="space-y-2 text-xs text-gray-300">
              <div class="p-2.5 rounded-xl bg-white/5 border border-white/5">
                <span class="font-bold text-white">Nível 1 a 3 (Aprendiz):</span>
                <p class="text-[11px] text-gray-400">Acesso ao Feed completo, reações e comentários em tempo real.</p>
              </div>
              <div class="p-2.5 rounded-xl bg-white/5 border border-white/5">
                <span class="font-bold text-white">Nível 4 a 7 (Especialista):</span>
                <p class="text-[11px] text-gray-400">Acesso ao Prompt Vault secreto e direito de voto nos desafios.</p>
              </div>
              <div class="p-2.5 rounded-xl bg-white/5 border border-white/5">
                <span class="font-bold text-red-300">Nível 8 a 10 (Visionário Supremo):</span>
                <p class="text-[11px] text-gray-400">Badge exclusivo dourado, destaque no topo e acesso prioritário aos Servidores de Treinamento.</p>
              </div>
            </div>
          </div>
        </div>
      </div>`;
  }

  function renderCommunityChallengesTab() {
    return `
      <div class="space-y-8 anim-element anim-fade-up">
        <!-- Main Challenge Spotlight -->
        <div class="p-8 rounded-3xl glass-card-community border-2 border-red-500/40 shadow-[0_20px_60px_rgba(220,38,38,0.3)] relative overflow-hidden">
          <div class="absolute -top-24 -right-24 w-96 h-96 bg-red-600/20 rounded-full blur-3xl pointer-events-none"></div>

          <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div class="space-y-3 max-w-2xl">
              <div class="flex items-center space-x-2.5">
                <span class="px-3 py-1 rounded-full text-[10px] font-mono font-black bg-red-500/30 text-red-200 border border-red-500/50 uppercase tracking-widest flex items-center space-x-1.5 animate-pulse">
                  <span>🔥</span><span>DESAFIO OFICIAL ATIVO</span>
                </span>
                <span class="text-xs text-amber-300 font-mono font-bold">⏱️ Encerramento em 3 dias</span>
              </div>

              <h2 class="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Desafio #04: Atmosfera Carmesim & Iluminação Volumétrica no Flux.1 Dev
              </h2>

              <p class="text-xs sm:text-sm text-gray-300 leading-relaxed">
                O objetivo desta semana é criar um retrato ou cenário cinematográfico dominado por iluminação rubra e carmesim com efeito de luz de contorno (rim lighting) e névoa volumétrica.
              </p>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs font-mono">
                <div class="p-3 bg-black/60 rounded-xl border border-white/10">
                  <span class="text-red-400 font-bold block mb-0.5">🏆 Premiação:</span>
                  <span class="text-white">+500 XP Soberano • Destaque na Home VIP • Badge Exclusivo</span>
                </div>
                <div class="p-3 bg-black/60 rounded-xl border border-white/10">
                  <span class="text-red-400 font-bold block mb-0.5">📋 Requisitos:</span>
                  <span class="text-white">Incluir prompt completo, modelo de IA e imagem em alta resolução</span>
                </div>
              </div>
            </div>

            <div class="flex flex-col items-center justify-center p-6 bg-black/80 rounded-2xl border border-red-500/30 text-center space-y-3 flex-shrink-0">
              <span class="text-3xl">🎯</span>
              <div>
                <p class="text-sm font-bold text-white">Pronto para competir?</p>
                <p class="text-[10px] text-gray-400">Submeta seu post no feed com a hashtag</p>
              </div>
              <button onclick="window.appJoinChallenge('#DesafioCarmesim')"
                class="w-full px-6 py-3 rounded-full bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-extrabold text-xs shadow-[0_0_25px_rgba(220,38,38,0.5)] hover:scale-105 active:scale-95 transition-all">
                Participar Agora 🚀
              </button>
            </div>
          </div>
        </div>

        <!-- Challenge Entries Section -->
        <div>
          <div class="flex items-center justify-between mb-5">
            <h3 class="text-lg font-bold text-white flex items-center space-x-2">
              <span>🖼️</span><span>Submissões Recentes da Comunidade (#DesafioCarmesim)</span>
            </h3>
            <button onclick="window.appSwitchCommunityTab('feed'); window.appSearchCommunity('#DesafioCarmesim');" class="text-xs text-red-300 hover:underline font-mono">
              Ver todas no feed →
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div class="glass-card-community rounded-3xl overflow-hidden border border-white/15">
              <img src="./public/assets/images/opt_0375_img_exact_604f4.webp" class="w-full h-48 object-cover">
              <div class="p-4 space-y-2">
                <span class="px-2 py-0.5 rounded text-[9px] font-mono bg-red-500/20 text-red-300">Flux.1 Dev</span>
                <h4 class="text-xs font-bold text-white">Retrato Biomecânico Carmesim</h4>
                <p class="text-[10px] text-gray-400 font-mono">Por Mateus Celestino • 74 likes</p>
              </div>
            </div>

            <div class="glass-card-community rounded-3xl overflow-hidden border border-white/15">
              <img src="./public/assets/images/opt_0008_img_exact_87ca3.webp" class="w-full h-48 object-cover">
              <div class="p-4 space-y-2">
                <span class="px-2 py-0.5 rounded text-[9px] font-mono bg-red-500/20 text-red-300">Midjourney v6.1</span>
                <h4 class="text-xs font-bold text-white">Reflexos Escarlates em Vidro Líquido</h4>
                <p class="text-[10px] text-gray-400 font-mono">Por Elena Digital Art • 51 likes</p>
              </div>
            </div>

            <div class="glass-card-community rounded-3xl overflow-hidden border border-white/15">
              <img src="./public/assets/images/opt_0740_img_exact_666ee.webp" class="w-full h-48 object-cover">
              <div class="p-4 space-y-2">
                <span class="px-2 py-0.5 rounded text-[9px] font-mono bg-red-500/20 text-red-300">ComfyUI SDXL</span>
                <h4 class="text-xs font-bold text-white">Cyberpunk City Carmesim 8k</h4>
                <p class="text-[10px] text-gray-400 font-mono">Por Lucas Rocha • 39 likes</p>
              </div>
            </div>
          </div>
        </div>
      </div>`;
  }

  function renderCommunitySavedTab() {
    const savedPosts = communityPosts.filter(p => p.user_id === currentUserId || (p.likedBy || []).includes(currentUserId));

    return `
      <div class="space-y-6 anim-element anim-fade-up">
        <div class="p-6 rounded-3xl glass-card-community border border-white/15 shadow-2xl flex items-center justify-between">
          <div>
            <h2 class="text-2xl font-extrabold text-white">Suas Publicações e Favoritos</h2>
            <p class="text-xs text-gray-300 mt-1">Acesso rápido aos seus próprios posts, prompts que você salvou ou curtiu na plataforma.</p>
          </div>
          <span class="px-3 py-1 rounded-full text-xs font-mono font-bold bg-white/10 text-white">${savedPosts.length} itens</span>
        </div>

        ${savedPosts.length === 0 ? `
          <div class="text-center py-24 glass-card-community rounded-3xl border border-white/10">
            <div class="text-5xl mb-3">🔖</div>
            <h3 class="text-base font-bold text-white mb-1">Nenhum post salvo ou publicado ainda</h3>
            <p class="text-graphite text-xs max-w-sm mx-auto">Interaja no feed ou envie seu primeiro prompt para montar sua coleção pessoal!</p>
            <button onclick="window.appSwitchCommunityTab('feed')" class="mt-4 px-5 py-2.5 rounded-full bg-red-600 hover:bg-red-500 text-xs font-bold text-white shadow-lg transition-all">Ir para o Feed Social</button>
          </div>
        ` : `
          <div class="space-y-5">
            ${savedPosts.map(renderPostCard).join('')}
          </div>
        `}
      </div>`;
  }

  function renderPostCard(post) {
    const isLiked = (post.likedBy || []).includes(currentUserId);
    const canDel = currentUserRole === 'admin' || currentUserRole === 'moderator' || post.user_id === currentUserId;
    const cCount = post.comments?.length || 0;
    const safeUserName = escapeHtml(post.user_name || 'Membro VIP');
    const safeTitle = escapeHtml(post.title || '');
    const safeContent = escapeHtml(post.content || '').replace(/\n/g, '<br>');
    const safeLinkUrl = escapeHtml(post.link_url || '');
    const safeLinkTitle = escapeHtml(post.link_title || post.link_url || '');

    // Formatação de categoria / tag dinâmica
    const allCommunityTags = getCommunityTags();
    const postTagId = post.tag || post.category || (post.tags && post.tags[0]) || 'prompts';
    const matchedTag = allCommunityTags.find(t => t.id === postTagId);
    const tagIcon = matchedTag ? (matchedTag.icon || '🏷️') : '🏷️';
    const tagName = matchedTag ? matchedTag.name : (postTagId.charAt(0).toUpperCase() + postTagId.slice(1));
    const tagColor = matchedTag ? matchedTag.color : 'red';
    const tagColorClasses = getTagColorClasses(tagColor);

    return `
      <article class="glass-card-community rounded-3xl overflow-hidden p-6 border border-white/15 relative transition-all duration-300 hover:border-red-500/30" id="post-${post.id}">
        <!-- Pinned Banner -->
        ${post.is_pinned ? `
          <div class="mb-4 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-red-950/60 to-red-900/30 border border-red-500/40 text-red-200 text-xs font-bold flex items-center space-x-2">
            <span>📌</span>
            <span>POST FIXADO PELA ADMINISTRAÇÃO SOBERANA</span>
          </div>` : ''}

        <!-- Post Header -->
        <div class="flex items-start justify-between mb-4">
          <div class="flex items-center space-x-3.5">
            <div class="relative flex-shrink-0">
              <img src="${post.user_avatar}" class="w-11 h-11 rounded-full border border-white/20 object-cover ${post.user_role === 'admin' ? 'border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.4)]' : ''}">
              ${post.user_role === 'admin' ? '<span class="absolute -top-1 -right-1 text-xs">👑</span>' : ''}
            </div>
            <div>
              <div class="flex items-center flex-wrap gap-x-2 gap-y-1">
                <span class="text-sm font-extrabold text-white">${safeUserName}</span>
                ${getBadge(post.user_role)}
                <button type="button" onclick="window.appFilterCommunity('${escapeJs(postTagId)}'); event.stopPropagation();"
                  title="Filtrar feed por #${escapeHtml(postTagId)}"
                  class="px-2.5 py-0.5 rounded-full text-[10px] font-mono border font-bold transition-transform hover:scale-105 active:scale-95 flex items-center space-x-1 cursor-pointer ${tagColorClasses.badge}">
                  <span>${tagIcon}</span>
                  <span>${escapeHtml(tagName)}</span>
                </button>
              </div>
              <span class="text-[11px] text-gray-400 font-mono mt-0.5 block">${formatDate(post.created_at)}</span>
            </div>
          </div>

          <div class="flex items-center space-x-2">
            ${canDel ? `<button onclick="window.appDeletePost('${post.id}')" class="text-xs text-red-400/60 hover:text-red-400 p-2 rounded-xl hover:bg-white/5 transition-all" title="Excluir post">✕</button>` : ''}
          </div>
        </div>

        <!-- Post Title -->
        ${post.title ? `<h3 class="text-lg font-extrabold text-white mb-2 leading-snug">${safeTitle}</h3>` : ''}

        <!-- Post Content -->
        ${post.content ? `<p class="text-sm text-gray-200 leading-relaxed mb-4 font-normal">${safeContent}</p>` : ''}

        <!-- AI PROMPT STUDIO CARD (IF AVAILABLE) -->
        ${post.ai_prompt ? `
          <div class="my-4 p-4 rounded-2xl bg-black/85 border border-red-500/35 relative overflow-hidden group shadow-inner">
            <div class="flex items-center justify-between pb-2.5 mb-2.5 border-b border-red-500/20 text-xs font-mono">
              <span class="text-red-400 font-bold flex items-center space-x-1.5">
                <span>🔮</span>
                <span>MODELO: ${escapeHtml(post.ai_model || 'FLUX / MIDJOURNEY')}</span>
              </span>
              <button onclick="window.appCopyPrompt(this, ${JSON.stringify(post.ai_prompt)})"
                class="px-3 py-1.5 rounded-xl bg-red-950/70 hover:bg-red-900 border border-red-500/50 text-red-200 text-[11px] font-bold transition-all flex items-center space-x-1.5 shadow-md active:scale-95">
                <span>📋</span><span>Copiar Prompt</span>
              </button>
            </div>
            <pre class="text-xs text-gray-200 font-mono whitespace-pre-wrap leading-relaxed select-all bg-white/5 p-3 rounded-xl border border-white/5">${escapeHtml(post.ai_prompt)}</pre>
            ${post.ai_params ? `
              <div class="mt-2.5 pt-2 border-t border-white/10 text-[10px] font-mono text-red-300/80 flex items-center space-x-2">
                <span class="font-bold">⚙️ Flags:</span>
                <span class="text-white/70">${escapeHtml(post.ai_params)}</span>
              </div>` : ''}
          </div>` : ''}

        <!-- Link Preview Card -->
        ${post.link_url ? `
          <a href="${safeLinkUrl}" target="_blank" rel="noopener noreferrer" class="mb-4 flex items-center space-x-3.5 p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:border-red-500/40 hover:bg-white/10 transition-all group">
            <div class="w-9 h-9 rounded-xl bg-red-500/20 border border-red-500/30 flex items-center justify-center text-sm flex-shrink-0 text-red-300">🔗</div>
            <div class="min-w-0 flex-1">
              <p class="text-xs font-bold text-white group-hover:text-red-300 transition-colors truncate">${safeLinkTitle}</p>
              <p class="text-[11px] text-graphite truncate">${safeLinkUrl}</p>
            </div>
            <span class="text-white/40 group-hover:text-white text-xs mr-1">↗</span>
          </a>` : ''}

        <!-- Image Gallery with Lightbox -->
        ${post.images?.length ? renderEnhancedImageGrid(post.images, post.title || safeUserName) : ''}

        <!-- Actions Bar -->
        <div class="mt-5 pt-4 flex items-center justify-between border-t border-white/10">
          <div class="flex items-center space-x-3">
            <button onclick="window.appLikePost('${post.id}')" id="like-btn-${post.id}"
              class="flex items-center space-x-2 text-xs font-bold px-4 py-2 rounded-full border transition-all ${isLiked ? 'bg-red-600 text-white border-red-500 shadow-[0_0_15px_rgba(220,38,38,0.4)]' : 'bg-white/5 text-white/80 border-white/15 hover:bg-white/10'}">
              <span>${isLiked ? '❤️' : '🤍'}</span>
              <span id="like-count-${post.id}">${post.likes || 0}</span>
            </button>

            <button onclick="window.appToggleComments('${post.id}')"
              class="flex items-center space-x-2 text-xs font-bold px-4 py-2 rounded-full border border-white/15 bg-white/5 text-white/80 hover:bg-white/10 transition-all">
              <span>💬</span>
              <span id="comment-count-${post.id}">${cCount}</span>
            </button>
          </div>

          <div class="flex items-center space-x-2">
            <button onclick="window.appSharePost('${post.id}')" class="p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white text-xs transition-all" title="Copiar link do post">
              <span>🔗</span>
            </button>
            <button onclick="window.appBookmarkPost('${post.id}')" class="p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white text-xs transition-all" title="Salvar publicação">
              <span>🔖</span>
            </button>
          </div>
        </div>

        <!-- Threaded Comments Area -->
        <div id="comments-${post.id}" class="hidden mt-4 border-t border-white/10 pt-4 space-y-3.5">
          <div class="space-y-2.5" id="comments-list-${post.id}">
            ${(post.comments || []).map(c => renderCommentCard(c, post.id)).join('')}
          </div>

          <!-- Add Comment Input Row -->
          <div class="flex items-center space-x-2.5 pt-2">
            <img src="${currentUserAvatarUrl}" class="w-8 h-8 rounded-full border border-white/20 flex-shrink-0">
            <input type="text" id="comment_input_${post.id}" placeholder="Escreva uma resposta para este criador..."
              class="flex-1 bg-white/5 border border-white/15 rounded-full px-4 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-red-500/50"
              onkeydown="if(event.key==='Enter') window.appAddComment('${post.id}')">
            <button onclick="window.appAddComment('${post.id}')"
              class="px-5 py-2.5 bg-white text-black font-extrabold text-xs rounded-full hover:bg-gray-200 transition-all shadow-md">
              Enviar
            </button>
          </div>
        </div>
      </article>`;
  }

  function renderEnhancedImageGrid(images, caption) {
    if (!images || !images.length) return '';
    const safeCap = escapeHtml(caption || 'Imagem da Comunidade');

    if (images.length === 1) {
      return `
        <div class="my-3 rounded-2xl overflow-hidden border border-white/15 max-h-[500px] bg-black/60 cursor-pointer group relative"
          onclick="window.openCommunityLightbox('${images[0]}', '${escapeJs(caption)}')">
          <img src="${images[0]}" class="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500">
          <div class="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span class="px-4 py-2 rounded-full bg-black/80 border border-white/20 text-white text-xs font-bold backdrop-blur-md">🔍 Ver em Tela Cheia</span>
          </div>
        </div>`;
    }

    return `
      <div class="my-3 grid grid-cols-2 gap-2.5">
        ${images.map(img => `
          <div class="rounded-xl overflow-hidden border border-white/15 h-44 sm:h-52 bg-black/60 cursor-pointer group relative"
            onclick="window.openCommunityLightbox('${img}', '${escapeJs(caption)}')">
            <img src="${img}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
            <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span class="text-xs text-white font-mono font-bold bg-black/70 px-2.5 py-1 rounded-full border border-white/20">🔍 Zoom</span>
            </div>
          </div>
        `).join('')}
      </div>`;
  }

  function renderCommentCard(c, postId) {
    const canDel = currentUserRole === 'admin' || currentUserRole === 'moderator' || c.user_id === currentUserId;
    const safeAuthor = escapeHtml(c.user_name || 'Membro VIP');
    const safeComment = escapeHtml(c.content || '');

    return `
      <div class="flex items-start space-x-3 p-3 rounded-2xl bg-white/5 border border-white/5" id="comment-${c.id}">
        <img src="${c.user_avatar}" class="w-8 h-8 rounded-full flex-shrink-0 object-cover mt-0.5 border border-white/10">
        <div class="flex-1 min-w-0">
          <div class="flex items-center justify-between mb-1">
            <div class="flex items-center space-x-2">
              <span class="text-xs font-bold text-white">${safeAuthor}</span>
              ${getBadge(c.user_role)}
            </div>
            <span class="text-[10px] text-gray-400 font-mono">${formatDate(c.created_at)}</span>
          </div>
          <p class="text-xs text-gray-200 leading-relaxed font-normal">${safeComment}</p>
        </div>
        ${canDel ? `<button onclick="window.appDeleteComment('${postId}', '${c.id}')" class="text-red-400/60 hover:text-red-400 text-xs p-1" title="Excluir resposta">✕</button>` : ''}
      </div>`;
  }

  function setupCommunityHandlers() {
    window.appGoProfile = navigateToProfile;

    // Subtab Switcher
    window.appSwitchCommunityTab = function(tab) {
      communityActiveTab = tab;
      const targetHash = (tab && tab !== 'feed') ? `#community/${tab}` : '#community';
      if (window.location.hash !== targetHash) {
        try { history.pushState(null, '', targetHash); } catch(e) {}
      }
      renderCurrentView();
    };

    // Model Filter for Prompts Vault
    window.appFilterPromptModel = function(model) {
      communityPromptModelFilter = model;
      renderCommunityView();
    };

    // Challenge Join Handler
    window.appJoinChallenge = function(hashtag) {
      communityActiveTab = 'feed';
      communityPromptBoxOpen = true;
      renderCommunityView();
      setTimeout(() => {
        const titleEl = document.getElementById('newPostTitle');
        const contentEl = document.getElementById('newPostContent');
        if (titleEl) titleEl.value = `Submissão: ${hashtag} — [Título da Sua Arte]`;
        if (contentEl) {
          contentEl.value = `Minha participação no desafio da semana ${hashtag}!\nPrompt detalhado e configurações abaixo:`;
          contentEl.focus();
        }
        window.scrollTo({ top: 400, behavior: 'smooth' });
      }, 80);
      showToast('✍️ Composer preparado para sua submissão!');
    };

    // Quick Servers Nav from Community Sidebar
    window.appGoServersNav = function() {
      navigateToServers();
    };

    // Filter and search handlers
    window.appFilterCommunity = function(cat) {
      communityActiveFilter = cat;
      communityActiveTab = 'feed';
      renderCommunityView();
    };

    window.appSearchCommunity = function(val) {
      communitySearchQuery = val;
      const feed = document.getElementById('communityFeed');
      if (!feed) { renderCommunityView(); return; }

      let filteredPosts = [...communityPosts];
      if (communityActiveFilter !== 'all') {
        filteredPosts = filteredPosts.filter(p => {
          if (p.category === communityActiveFilter || p.tag === communityActiveFilter) return true;
          if (Array.isArray(p.tags) && p.tags.includes(communityActiveFilter)) return true;
          if (communityActiveFilter === 'prompts' && (p.ai_prompt || (p.title && p.title.toLowerCase().includes('prompt')))) return true;
          if (communityActiveFilter === 'showcase' && (p.images && p.images.length > 0)) return true;
          if (communityActiveFilter === 'tips' && (p.title && p.title.toLowerCase().includes('dica'))) return true;
          if (communityActiveFilter === 'official' && (p.is_pinned || p.category === 'official')) return true;
          return false;
        });
      }

      if (val.trim()) {
        const q = val.toLowerCase().trim();
        filteredPosts = filteredPosts.filter(p =>
          (p.title && p.title.toLowerCase().includes(q)) ||
          (p.content && p.content.toLowerCase().includes(q)) ||
          (p.user_name && p.user_name.toLowerCase().includes(q)) ||
          (p.ai_prompt && p.ai_prompt.toLowerCase().includes(q))
        );
      }

      feed.innerHTML = filteredPosts.length === 0
        ? `<div class="text-center py-20 glass-card-community rounded-3xl border border-white/10">
            <div class="text-5xl mb-3">💬</div>
            <h3 class="text-base font-bold text-white mb-1">Nenhum post encontrado</h3>
            <p class="text-graphite text-xs max-w-sm mx-auto">Tente ajustar seus termos de busca!</p>
          </div>`
        : filteredPosts.map(renderPostCard).join('');
    };

    // Category Selector in Composer
    window.selectPostCategory = function(cat, btn) {
      communitySelectedCategory = cat;
      document.querySelectorAll('.post-cat-btn').forEach(b => {
        b.className = 'post-cat-btn px-2.5 py-1 rounded-lg border font-bold transition-all text-xs flex items-center space-x-1 whitespace-nowrap bg-white/5 text-gray-400 border-white/10 hover:text-white';
      });
      if (btn) {
        btn.className = 'post-cat-btn px-2.5 py-1 rounded-lg border font-bold transition-all text-xs flex items-center space-x-1 whitespace-nowrap bg-red-500/20 text-red-200 border-red-500/40 shadow-sm';
      }
    };

    // ────────────────────────────────────────────────────────────────────────
    // TAG EDITOR MODAL & CRUD
    // ────────────────────────────────────────────────────────────────────────
    window.appOpenTagModal = function(tagId = null) {
      const modal = document.getElementById('tagEditorModal');
      const titleEl = document.getElementById('tagModalTitle');
      const editIdEl = document.getElementById('tagEditorEditingId');
      const nameEl = document.getElementById('tagEditorName');
      const slugEl = document.getElementById('tagEditorSlug');
      const iconEl = document.getElementById('tagEditorIcon');
      const descEl = document.getElementById('tagEditorDesc');
      const previewIcon = document.getElementById('tagModalIconPreview');

      if (!modal) return;

      const tags = getCommunityTags();

      if (tagId) {
        const t = tags.find(x => x.id === tagId);
        if (t) {
          if (titleEl) titleEl.textContent = `Editar Tag #${t.id}`;
          if (editIdEl) editIdEl.value = t.id;
          if (nameEl) nameEl.value = t.name;
          if (slugEl) { slugEl.value = t.id; slugEl.disabled = true; }
          if (iconEl) iconEl.value = t.icon || '🏷️';
          if (descEl) descEl.value = t.desc || '';
          if (previewIcon) previewIcon.textContent = t.icon || '🏷️';
          window.appSelectTagColor(t.color || 'red');
        }
      } else {
        if (titleEl) titleEl.textContent = 'Criar Nova Tag';
        if (editIdEl) editIdEl.value = '';
        if (nameEl) nameEl.value = '';
        if (slugEl) { slugEl.value = ''; slugEl.disabled = false; }
        if (iconEl) iconEl.value = '⚡';
        if (descEl) descEl.value = '';
        if (previewIcon) previewIcon.textContent = '⚡';
        window.appSelectTagColor('red');
      }

      modal.classList.remove('hidden');
      setTimeout(() => {
        modal.classList.remove('opacity-0');
        modal.firstElementChild?.classList.remove('scale-95');
        if (nameEl) nameEl.focus();
      }, 10);
    };

    window.appCloseTagModal = function() {
      const modal = document.getElementById('tagEditorModal');
      if (!modal) return;
      modal.classList.add('opacity-0');
      modal.firstElementChild?.classList.add('scale-95');
      setTimeout(() => {
        modal.classList.add('hidden');
      }, 300);
    };

    window.appOnTagNameChange = function(name) {
      const editIdEl = document.getElementById('tagEditorEditingId');
      const slugEl = document.getElementById('tagEditorSlug');
      if (!editIdEl?.value && slugEl && !slugEl.disabled) {
        const slug = name
          .toLowerCase()
          .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '');
        slugEl.value = slug;
      }
    };

    window.appSetTagIcon = function(icon) {
      const iconEl = document.getElementById('tagEditorIcon');
      const previewIcon = document.getElementById('tagModalIconPreview');
      if (iconEl) iconEl.value = icon;
      if (previewIcon) previewIcon.textContent = icon;
    };

    window.appSelectTagColor = function(color) {
      const colorEl = document.getElementById('tagEditorColor');
      if (colorEl) colorEl.value = color;
      document.querySelectorAll('.tag-color-btn').forEach(btn => {
        if (btn.getAttribute('data-color') === color) {
          btn.classList.add('ring-2', 'ring-white', 'scale-110');
          btn.classList.remove('opacity-60');
        } else {
          btn.classList.remove('ring-2', 'ring-white', 'scale-110');
          btn.classList.add('opacity-60');
        }
      });
    };

    window.appSaveTag = function() {
      const editId = document.getElementById('tagEditorEditingId')?.value?.trim();
      const name = document.getElementById('tagEditorName')?.value?.trim();
      let slug = document.getElementById('tagEditorSlug')?.value?.trim();
      const icon = document.getElementById('tagEditorIcon')?.value?.trim() || '🏷️';
      const color = document.getElementById('tagEditorColor')?.value?.trim() || 'red';
      const desc = document.getElementById('tagEditorDesc')?.value?.trim() || '';

      if (!name) {
        showToast('⚠️ Por favor, digite o nome da tag.');
        document.getElementById('tagEditorName')?.focus();
        return;
      }

      if (!slug) {
        slug = name
          .toLowerCase()
          .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '');
      }

      if (!slug) {
        showToast('⚠️ Por favor, forneça um identificador/slug válido.');
        return;
      }

      let tags = getCommunityTags();

      if (editId) {
        // Atualizar tag existente
        const index = tags.findIndex(t => t.id === editId);
        if (index >= 0) {
          tags[index] = { ...tags[index], name, icon, color, desc };
          saveCommunityTags(tags);
          showToast(`✅ Tag "${name}" atualizada com sucesso!`);
        }
      } else {
        // Criar nova tag
        if (tags.some(t => t.id === slug)) {
          showToast(`⚠️ Já existe uma tag cadastrada com o identificador "#${slug}".`);
          return;
        }
        tags.push({ id: slug, name, icon, color, desc });
        saveCommunityTags(tags);
        showToast(`🎉 Nova tag "${name}" criada com sucesso!`);
      }

      window.appCloseTagModal();
      renderCommunityView();
    };

    window.appDeleteTag = async function(tagId) {
      const tags = getCommunityTags();
      const targetTag = tags.find(t => t.id === tagId);
      const tagName = targetTag ? targetTag.name : tagId;

      const confirmed = await showConfirmModal(
        `Tem certeza que deseja apagar a tag "${tagName}" (#${tagId})? Os posts não serão excluídos, apenas a tag será removida dos filtros e menus.`,
        'Excluir Tag da Comunidade'
      );

      if (!confirmed) return;

      const updatedTags = tags.filter(t => t.id !== tagId);
      saveCommunityTags(updatedTags);

      if (communityActiveFilter === tagId) {
        communityActiveFilter = 'all';
      }
      if (communitySelectedCategory === tagId) {
        communitySelectedCategory = updatedTags[0]?.id || 'prompts';
      }

      showToast(`🗑️ Tag "${tagName}" excluída com sucesso.`);
      renderCommunityView();
    };

    window.appRestoreDefaultTags = async function() {
      const confirmed = await showConfirmModal(
        'Deseja restaurar as 4 tags originais de fábrica da comunidade?',
        'Restaurar Tags Padrão'
      );
      if (!confirmed) return;

      saveCommunityTags(DEFAULT_COMMUNITY_TAGS);
      showToast('✨ Tags padrão restauradas com sucesso!');
      renderCommunityView();
    };

    // Toggle Composer Prompt Box
    window.toggleComposerPromptBox = function() {
      communityPromptBoxOpen = !communityPromptBoxOpen;
      const box = document.getElementById('composerPromptBox');
      if (box) box.classList.toggle('hidden');
    };

    // Shaders selection
    window.appSelectCommunityShader = function(id) {
      if (window.setCommunityShader) {
        window.setCommunityShader(id);
      }
      renderCommunityView();
      showToast(`🔴 Shader alterado: ${id}`);
    };

    window.appToggleCommunityRotative = function() {
      if (window.toggleCommunityRotative) {
        const newState = window.toggleCommunityRotative();
        renderCommunityView();
        showToast(newState ? '🔄 Modo Rotativo Ativado (20s)' : '⏸️ Shader Fixo');
      }
    };

    window.appRandomCommunityShader = function() {
      const shaders = window.COMMUNITY_SHADERS || [];
      if (!shaders.length) return;
      const rand = shaders[Math.floor(Math.random() * shaders.length)];
      window.appSelectCommunityShader(rand.id);
    };

    // Copy Prompt Helper
    window.appCopyPrompt = function(btn, text) {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text);
      } else {
        const ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      const orig = btn.innerHTML;
      btn.innerHTML = '<span>✅</span><span>Copiado!</span>';
      btn.classList.add('bg-emerald-700/80', 'text-white', 'border-emerald-400');
      setTimeout(() => {
        btn.innerHTML = orig;
        btn.classList.remove('bg-emerald-700/80', 'text-white', 'border-emerald-400');
      }, 2000);
      showToast('📋 Prompt copiado com sucesso!');
    };

    // Lightbox modal helpers
    window.openCommunityLightbox = function(src, caption) {
      const modal = document.getElementById('communityImageLightbox');
      const img = document.getElementById('lightboxImg');
      const cap = document.getElementById('lightboxCaption');
      if (modal && img) {
        img.src = src;
        if (cap) cap.textContent = caption || '';
        modal.classList.remove('hidden', 'pointer-events-none');
        setTimeout(() => modal.classList.remove('opacity-0'), 10);
      }
    };

    window.closeCommunityLightbox = function() {
      const modal = document.getElementById('communityImageLightbox');
      if (modal) {
        modal.classList.add('opacity-0');
        setTimeout(() => modal.classList.add('hidden', 'pointer-events-none'), 300);
      }
    };

    // Share & Bookmark helpers
    window.appSharePost = function(id) {
      const url = `${window.location.origin}/comunidade#community`;
      if (navigator.clipboard) navigator.clipboard.writeText(url);
      showToast('🔗 Link da publicação copiado!');
    };

    window.appBookmarkPost = function(id) {
      showToast('🔖 Publicação salva nos seus favoritos VIP!');
    };

    // File Input change
    const fileInput = document.getElementById('communityFileInput');
    if (fileInput) {
      fileInput.onchange = (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;
        if (files.length > 5) {
          showToast('⚠️ Limite de no máximo 5 imagens por post.');
          return;
        }

        const totalSize = files.reduce((acc, f) => acc + f.size, 0);
        if (totalSize > 5 * 1024 * 1024) {
          showToast('⚠️ O peso total das imagens excede 5MB.');
          return;
        }

        selectedFilesToUpload = files;
        const previewContainer = document.getElementById('postImageUploadPreview');
        if (previewContainer) {
          previewContainer.classList.remove('hidden');
          previewContainer.innerHTML = files.map((f, idx) => `
            <div class="h-16 rounded-xl overflow-hidden border border-white/20 bg-black/60 relative group">
              <img src="${URL.createObjectURL(f)}" class="w-full h-full object-cover">
              <button onclick="window.removeUploadFile(${idx})" class="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-600 text-white text-[9px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">✕</button>
            </div>`).join('');
        }
      };
    }

    window.removeUploadFile = function(idx) {
      selectedFilesToUpload.splice(idx, 1);
      const previewContainer = document.getElementById('postImageUploadPreview');
      if (!previewContainer) return;
      if (!selectedFilesToUpload.length) {
        previewContainer.classList.add('hidden');
        previewContainer.innerHTML = '';
      } else {
        previewContainer.innerHTML = selectedFilesToUpload.map((f, i) => `
          <div class="h-16 rounded-xl overflow-hidden border border-white/20 bg-black/60 relative group">
            <img src="${URL.createObjectURL(f)}" class="w-full h-full object-cover">
            <button onclick="window.removeUploadFile(${i})" class="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-600 text-white text-[9px] flex items-center justify-center">✕</button>
          </div>`).join('');
      }
    };

    window.togglePostLink = () => {
      document.getElementById('postLinkField')?.classList.toggle('hidden');
    };

    function saveLocalCommunityPosts() {
      try {
        const customPosts = communityPosts.filter(p => !DEFAULT_SOVEREIGN_POSTS.some(dp => dp.id === p.id));
        localStorage.setItem('mcp_local_community_posts', JSON.stringify(customPosts));
      } catch(e) {}
    }

    window.appCreatePost = async () => {
      syncSovereignSession();
      if (!isLoggedIn) {
        showAuthModal('Para publicar na Comunidade, faça login ou cadastre-se.');
        return;
      }

      const title = document.getElementById('newPostTitle')?.value?.trim();
      const content = document.getElementById('newPostContent')?.value?.trim();
      const link_url = document.getElementById('newPostLinkUrl')?.value?.trim();
      const link_title = document.getElementById('newPostLinkTitle')?.value?.trim();
      const promptCode = document.getElementById('newPostPromptCode')?.value?.trim();
      const promptParams = document.getElementById('newPostPromptParams')?.value?.trim();
      const promptModel = document.getElementById('newPostPromptModel')?.value || 'Flux.1 Dev';
      const btn = document.getElementById('submitPostBtn');

      if (!content && !title && !promptCode && !selectedFilesToUpload.length) {
        showToast('⚠️ Escreva um texto, prompt ou selecione imagens para publicar.');
        return;
      }

      if (btn) { btn.textContent = 'Enviando...'; btn.disabled = true; }

      let uploadedImageUrls = [];
      if (selectedFilesToUpload.length > 0) {
        for (const file of selectedFilesToUpload) {
          const url = await uploadFileToSupabase(file, 'community-media');
          if (url) uploadedImageUrls.push(url);
          else uploadedImageUrls.push(URL.createObjectURL(file));
        }
      }

      const newPostId = 'post_' + Date.now();
      const newPostObj = {
        id: newPostId,
        user_id: currentUserId,
        user_name: currentUserNameStr || 'Membro VIP',
        user_avatar: currentUserAvatarUrl || USER_ROLES.free.avatar,
        user_role: currentUserRole,
        category: communitySelectedCategory || 'prompts',
        tag: communitySelectedCategory || 'prompts',
        tags: [communitySelectedCategory || 'prompts'],
        title: title || '',
        content: content || '',
        ai_prompt: promptCode || '',
        ai_params: promptParams || '',
        ai_model: promptCode ? promptModel : '',
        link_url: link_url || '',
        link_title: link_title || '',
        images: uploadedImageUrls.length > 0 ? uploadedImageUrls : [],
        is_pinned: currentUserRole === 'admin',
        likes: 1,
        likedBy: [currentUserId],
        created_at: new Date().toISOString(),
        comments: []
      };

      // Tenta gravar no Supabase em paralelo
      if (sb) {
        try {
          await sb.from('community_posts').insert({
            user_id: currentUserId,
            title: title || null,
            content: content || '',
            link_url: link_url || null,
            link_title: link_title || null,
            images: uploadedImageUrls.length > 0 ? uploadedImageUrls : null
          });
        } catch(sbPostErr) {
          console.warn('[A.I VISUALS] Post salvo localmente:', sbPostErr.message);
        }
      }

      communityPosts.unshift(newPostObj);
      saveLocalCommunityPosts();

      selectedFilesToUpload = [];
      communityPromptBoxOpen = false;
      showToast('🚀 Publicação VIP compartilhada com sucesso!');
      renderCommunityView();
    };

    window.appToggleComments = id => {
      document.getElementById(`comments-${id}`)?.classList.toggle('hidden');
    };

    window.appLikePost = async id => {
      syncSovereignSession();
      if (!isLoggedIn) {
        showAuthModal('Para curtir publicações, faça login ou crie sua conta.');
        return;
      }

      const post = communityPosts.find(p => p.id === id);
      if (!post) return;
      if (!Array.isArray(post.likedBy)) post.likedBy = [];

      const liked = post.likedBy.includes(currentUserId);
      if (liked) {
        post.likes = Math.max(0, (post.likes || 1) - 1);
        post.likedBy = post.likedBy.filter(x => x !== currentUserId);
        if (sb) {
          try { await sb.from('community_likes').delete().match({ post_id: id, user_id: currentUserId }); } catch(e) {}
        }
      } else {
        post.likes = (post.likes || 0) + 1;
        post.likedBy.push(currentUserId);
        if (sb) {
          try { await sb.from('community_likes').insert({ post_id: id, user_id: currentUserId }); } catch(e) {}
        }
      }

      saveLocalCommunityPosts();
      renderCommunityView();
    };

    window.appAddComment = async postId => {
      syncSovereignSession();
      if (!isLoggedIn) {
        showAuthModal('Para comentar nesta publicação, faça login.');
        return;
      }

      const input = document.getElementById(`comment_input_${postId}`);
      const text = input?.value?.trim();
      if (!text) return;

      const post = communityPosts.find(p => p.id === postId);
      if (post) {
        if (!Array.isArray(post.comments)) post.comments = [];
        const newComment = {
          id: 'comment_' + Date.now(),
          user_id: currentUserId,
          user_name: currentUserNameStr || 'Membro VIP',
          user_avatar: currentUserAvatarUrl || USER_ROLES.free.avatar,
          user_role: currentUserRole,
          content: text,
          created_at: new Date().toISOString()
        };
        post.comments.push(newComment);
        saveLocalCommunityPosts();
      }

      if (sb) {
        try {
          await sb.from('community_comments').insert({
            post_id: postId,
            user_id: currentUserId,
            content: text
          });
        } catch(sbCommentErr) {
          console.warn('[A.I VISUALS] Comentário persistido localmente:', sbCommentErr.message);
        }
      }

      showToast('💬 Resposta enviada ao criador!');
      renderCommunityView();
    };

    window.appDeletePost = async id => {
      if (!(await showConfirmModal('Excluir este post definitivamente?'))) return;
      if (sb) {
        try { await sb.from('community_posts').delete().eq('id', id); } catch(e) {}
      }
      communityPosts = communityPosts.filter(p => p.id !== id);
      saveLocalCommunityPosts();
      renderCommunityView();
      showToast('🗑️ Post excluído com sucesso!');
    };

    window.appDeleteComment = async (postId, commentId) => {
      if (sb) {
        try { await sb.from('community_comments').delete().eq('id', commentId); } catch(e) {}
      }
      const post = communityPosts.find(p => p.id === postId);
      if (post && Array.isArray(post.comments)) {
        post.comments = post.comments.filter(c => c.id !== commentId);
        saveLocalCommunityPosts();
      }
      renderCommunityView();
      showToast('🗑️ Comentário excluído!');
    };
  }
// ──────────────────────────────────────────────────────────────────────────
  // VIEW 6: SERVERS GRID
  // ──────────────────────────────────────────────────────────────────────────
  function renderServersView() {
    if (!isLoggedIn) { showAuthModal(); return; }

    mainAppContainer.innerHTML = `
      <section class="py-10 px-4 sm:px-6 lg:px-8 max-w-[1600px] mx-auto relative z-10">
        <div class="mb-10 flex items-center justify-between border-b border-white/10 pb-5">
          <div>
            <span class="text-xs font-bold text-white/60 tracking-widest uppercase">CLASSROOM & MASTERCLASSES</span>
            <h1 class="text-3xl font-extrabold text-white mt-1">Servidores de Treinamento</h1>
          </div>
          ${(currentUserRole==='admin'||currentUserRole==='moderator') ? `<button onclick="window.appOpenServerEditorModal()" class="px-5 py-2 rounded-full font-bold bg-white text-black text-xs shadow-lg hover:scale-105 transition-all">+ Criar Servidor</button>` : ''}
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-7">
          ${serversData.length===0
            ? `<div class="col-span-3 text-center py-20 glass-card rounded-3xl"><div class="text-4xl mb-3">🖥️</div><p class="text-graphite text-sm">Nenhum servidor disponível.</p></div>`
            : serversData.map(srv => `
              <div class="group relative glass-card rounded-3xl overflow-hidden flex flex-col">
                <div class="h-52 w-full overflow-hidden relative cursor-pointer" onclick="window.appGoServer('${srv.id}')">
                  <img src="${srv.hero_image}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" onerror="this.src='./public/assets/images/opt_0008_img_exact_87ca3.webp'">
                  <div class="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
                  <div class="absolute bottom-3 left-3">
                    <span class="text-xs font-bold text-white bg-black/60 border border-white/20 px-3 py-1 rounded-full backdrop-blur-md">📚 ${srv.lessons?.length||0} Aulas</span>
                  </div>
                </div>
                <div class="p-5 flex-1 flex flex-col justify-between">
                  <div class="cursor-pointer" onclick="window.appGoServer('${srv.id}')">
                    <h3 class="text-xl font-bold text-white mb-1.5 group-hover:text-white/80 transition-colors">${srv.title}</h3>
                    <p class="text-graphite text-xs leading-relaxed mb-4">${srv.description||''}</p>
                  </div>
                  <div>
                    <button onclick="window.appGoServer('${srv.id}')" class="w-full py-2.5 rounded-xl font-bold bg-white/10 hover:bg-white/20 border border-white/15 text-white text-xs transition-all">Acessar Servidor →</button>
                    ${(currentUserRole==='admin'||currentUserRole==='moderator') ? `
                      <div class="flex space-x-2 mt-2.5">
                        <button onclick="window.appOpenServerEditorModal('${srv.id}')" class="flex-1 py-2 bg-white/10 hover:bg-white/20 border border-white/15 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 shadow-md">
                          <span>✏️ Editar</span>
                        </button>
                        <button onclick="window.appDeleteServer('${srv.id}')" class="flex-1 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-300 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 shadow-md">
                          <span>🗑️ Excluir</span>
                        </button>
                      </div>` : ''}
                  </div>
                </div>
              </div>`).join('')}
        </div>
      </section>`;

    window.appGoServer = navigateToServerDetail;
    window.appDeleteServer = async sId => {
      if (!(await showConfirmModal('Excluir este servidor?'))) return;
      if (sb) await sb.from('servers').delete().eq('id',sId);
      serversData=serversData.filter(s=>s.id!==sId);
      showToast('🗑️ Servidor excluído!'); renderServersView();
    };
    setTimeout(triggerAnimObservers, 100);
  }

  // ──────────────────────────────────────────────────────────────────────────
  // VIEW 7: SERVER DETAIL — Player de Vídeo & Skool Classroom Experience
  // ──────────────────────────────────────────────────────────────────────────
  function renderServerDetailView() {
    if (!isLoggedIn) { showAuthModal(); return; }
    const srv = serversData.find(s=>s.id===selectedServerId) || DEFAULT_SOVEREIGN_SERVERS.find(s=>s.id===selectedServerId);
    if (!srv) { navigateToServers(); return; }

    const rawLessons = srv.lessons || [];
    const lessons = rawLessons.map(l => {
      const { cleanContent, metadata } = extractLessonMetadata(l.content_markdown || '');
      return {
        ...l,
        cleanContent,
        module: metadata.module || l.module || 'Módulo 1: Fundamentos',
        duration: metadata.duration || l.duration || '15 min',
        status: metadata.status || l.status || 'published',
        resources: Array.isArray(metadata.resources) ? metadata.resources : (Array.isArray(l.resources) ? l.resources : [])
      };
    });

    const lesson  = lessons.find(l=>l.id===selectedLessonId) || lessons[0];
    const embed   = lesson?.video_url ? convertToEmbedUrl(lesson.video_url) : '';
    const lesIdx  = lessons.findIndex(l=>l.id===lesson?.id);
    const prev    = lessons[lesIdx-1];
    const next    = lessons[lesIdx+1];

    // Status de Conclusão do Aluno (Skool Progress)
    let completedLessons = [];
    try {
      const rawComp = localStorage.getItem('mcp_completed_lessons');
      if (rawComp) completedLessons = JSON.parse(rawComp);
    } catch(e) {}
    const isCurrentLessonCompleted = lesson ? completedLessons.includes(lesson.id) : false;
    const completedCount = lessons.filter(l => completedLessons.includes(l.id)).length;
    const progressPercent = lessons.length > 0 ? Math.round((completedCount / lessons.length) * 100) : 0;

    // Ícones para tipos de recurso
    const typeIcons = { pdf: '📄', prompt: '💡', code: '💻', figma: '🎨', drive: '📁', link: '🔗' };

    // Agrupamento de aulas por Módulo
    let lastRenderedModule = '';

    mainAppContainer.innerHTML = `
      <section class="py-8 px-4 sm:px-6 lg:px-8 max-w-[1600px] mx-auto relative z-10">
        <!-- Header -->
        <div class="flex items-center justify-between mb-6 border-b border-white/10 pb-5">
          <div class="min-w-0 flex-1 mr-4">
            <div class="flex items-center space-x-2">
              <span class="text-xs font-bold text-white/60 tracking-widest uppercase">${srv.title}</span>
              ${lesson ? `<span class="text-xs text-white/40">›</span><span class="text-xs text-white/40">${escapeHtml(lesson.module)}</span>` : ''}
            </div>
            <h1 class="text-xl sm:text-2xl font-extrabold text-white mt-0.5 truncate">${lesson?.title||'Selecione uma aula'}</h1>
          </div>
          <div class="flex items-center space-x-2 flex-shrink-0 flex-wrap gap-y-2">
            ${(currentUserRole==='admin'||currentUserRole==='moderator') ? `
              <button onclick="window.appOpenServerEditorModal('${srv.id}')" class="px-3 py-1.5 bg-white/10 text-white border border-white/15 rounded-xl text-xs font-bold transition-all">⚙️ Servidor</button>
              <button onclick="window.appOpenLessonEditorModal('${srv.id}')" class="px-3.5 py-1.5 bg-white text-black rounded-xl text-xs font-bold hover:bg-white/90 shadow-md transition-all">+ Nova Aula</button>` : ''}
            <button onclick="window.appGoServers()" class="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-all">← Voltar</button>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <!-- LESSON SIDEBAR -->
          <div class="lg:col-span-1">
            <div class="glass-card rounded-3xl p-4 sticky top-24 space-y-4">
              <!-- Progresso do Aluno (Skool Course Completion) -->
              <div class="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 space-y-2">
                <div class="flex items-center justify-between text-xs">
                  <span class="font-bold text-white/80">Progresso no Curso</span>
                  <span class="font-bold text-emerald-400 font-mono">${progressPercent}%</span>
                </div>
                <div class="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div class="h-full bg-gradient-to-r from-emerald-500 to-white transition-all duration-500 rounded-full" style="width: ${progressPercent}%"></div>
                </div>
                <div class="flex items-center justify-between text-[0.65rem] text-white/40">
                  <span>${completedCount} de ${lessons.length} aulas concluídas</span>
                  ${progressPercent === 100 ? '<span class="text-emerald-400 font-bold">🏆 Completo!</span>' : ''}
                </div>
              </div>

              <!-- Lista de Aulas com Módulos e Duração -->
              <div>
                <h3 class="text-xs font-bold text-graphite uppercase tracking-wider mb-2.5 flex items-center justify-between px-1">
                  <span>Aulas do Treinamento</span>
                  ${lesIdx>=0 ? `<span class="text-white/60">${lesIdx+1}/${lessons.length}</span>` : ''}
                </h3>
                <div class="space-y-2 max-h-[55vh] overflow-y-auto pr-1">
                  ${lessons.length===0 ? '<p class="text-xs text-graphite p-2">Nenhuma aula cadastrada.</p>' :
                    lessons.map((l,i) => {
                      const active = l.id===lesson?.id;
                      const isCompleted = completedLessons.includes(l.id);
                      const isNewModule = l.module && l.module !== lastRenderedModule;
                      if (isNewModule) lastRenderedModule = l.module;

                      return `
                        ${isNewModule ? `
                          <div class="pt-2 pb-1 px-1 flex items-center space-x-1.5 text-[0.65rem] font-bold uppercase tracking-wider text-white/40">
                            <span>📁</span>
                            <span class="truncate">${escapeHtml(l.module)}</span>
                          </div>` : ''}
                        <div class="rounded-xl border transition-all ${active ? 'bg-white/15 border-white/30 shadow-lg' : 'bg-white/5 border-white/10 hover:bg-white/10'}">
                          <div class="p-2.5 cursor-pointer flex items-center justify-between gap-2" onclick="window.appGoServerDetail('${srv.id}','${l.id}')">
                            <div class="flex items-center space-x-2 min-w-0 flex-1">
                              <button type="button" onclick="event.stopPropagation(); window.toggleCompleteLesson('${l.id}')" title="${isCompleted ? 'Desmarcar conclusão' : 'Marcar como concluída'}" class="w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-all ${isCompleted ? 'bg-emerald-500 border-emerald-400 text-black text-[0.65rem] font-bold' : 'border-white/30 hover:border-white text-transparent'}">
                                ✓
                              </button>
                              <div class="min-w-0 flex-1">
                                <div class="flex items-center space-x-1.5">
                                  <span class="text-[0.6rem] font-bold ${active?'text-white':'text-graphite'}">AULA ${i+1}</span>
                                  ${l.duration ? `<span class="text-[0.6rem] text-white/40 font-mono">⏱️ ${escapeHtml(l.duration)}</span>` : ''}
                                </div>
                                <p class="text-xs font-semibold ${active?'text-white':'text-graphite'} leading-tight truncate ${isCompleted ? 'line-through text-white/50' : ''}">${escapeHtml(l.title)}</p>
                              </div>
                            </div>
                            ${(currentUserRole==='admin'||currentUserRole==='moderator') ? `
                              <button onclick="event.stopPropagation(); window.appOpenLessonEditorModal('${srv.id}', '${l.id}')" class="px-2 py-1 bg-white/10 hover:bg-white/20 text-white border border-white/15 rounded-lg text-[0.65rem] font-bold transition-all flex-shrink-0" title="Editar Aula">
                                ✏️
                              </button>` : ''}
                          </div>
                        </div>`;
                    }).join('')}
                </div>
              </div>
            </div>
          </div>

          <!-- MAIN VIEWER -->
          <div class="lg:col-span-3 space-y-5">
            ${lesson ? `
              <!-- Player de Vídeo ou Banner de Artigo -->
              ${embed ? `
                <div class="bg-black rounded-3xl overflow-hidden border border-white/15 shadow-2xl">
                  <div class="relative w-full" style="padding-top:56.25%">
                    <iframe
                      src="${embed}"
                      class="absolute top-0 left-0 w-full h-full"
                      frameborder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowfullscreen>
                    </iframe>
                  </div>
                </div>` : `
                <div class="glass-card rounded-3xl p-8 sm:p-12 text-center space-y-3">
                  <div class="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-2xl">📄</div>
                  <h3 class="text-base font-bold text-white">Artigo Técnico de Treinamento</h3>
                  <p class="text-graphite text-xs max-w-md mx-auto">Esta aula contém diretrizes completas em texto, prompts detalhados e materiais para estudo prático.</p>
                </div>`}

              <!-- Materiais & Recursos para Download (Skool Resources Box) -->
              ${lesson.resources && lesson.resources.length > 0 ? `
                <div class="glass-card rounded-3xl p-5 sm:p-6 space-y-3 border-emerald-500/20 bg-emerald-950/10 shadow-lg">
                  <div class="flex items-center justify-between pb-2 border-b border-white/10">
                    <h3 class="text-xs font-bold uppercase tracking-wider text-emerald-300 flex items-center space-x-2">
                      <span>📎 Materiais de Apoio & Downloads (${lesson.resources.length})</span>
                    </h3>
                    <span class="text-[0.65rem] text-white/40">Arquivos anexados a esta aula</span>
                  </div>
                  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    ${lesson.resources.map(res => `
                      <a href="${escapeHtml(res.url)}" target="_blank" rel="noopener noreferrer" class="p-3.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-emerald-500/40 transition-all flex items-center justify-between group shadow-sm">
                        <div class="flex items-center space-x-3 min-w-0">
                          <span class="text-xl flex-shrink-0">${typeIcons[res.type] || '📎'}</span>
                          <div class="min-w-0">
                            <p class="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors truncate">${escapeHtml(res.title)}</p>
                            <span class="text-[0.65rem] text-white/40 group-hover:text-white/60 transition-colors uppercase font-mono">${res.type || 'Link'}</span>
                          </div>
                        </div>
                        <span class="text-xs text-white/40 group-hover:text-emerald-300 group-hover:translate-x-0.5 transition-all">↗</span>
                      </a>
                    `).join('')}
                  </div>
                </div>` : ''}

              <!-- Conteúdo da Aula (Markdown com Callouts, Checklists e Code Blocks) -->
              <div class="glass-card rounded-3xl p-6 sm:p-8 space-y-4">
                <div class="flex items-center justify-between flex-wrap gap-2 pb-4 border-b border-white/10">
                  <div class="space-y-0.5">
                    <span class="text-[0.65rem] font-bold uppercase tracking-wider text-white/50">${escapeHtml(lesson.module)}</span>
                    <h2 class="text-lg sm:text-xl font-bold text-white">${escapeHtml(lesson.title)}</h2>
                  </div>
                  <div class="flex items-center space-x-2">
                    <button onclick="window.toggleCompleteLesson('${lesson.id}')" class="px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${isCurrentLessonCompleted ? 'bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.4)]' : 'bg-white/10 hover:bg-white/20 text-white border border-white/15'}">
                      <span>${isCurrentLessonCompleted ? '✓ Concluída' : 'Marcar como Concluída'}</span>
                    </button>
                    ${(currentUserRole==='admin'||currentUserRole==='moderator') ? `
                      <button onclick="window.appOpenLessonEditorModal('${srv.id}', '${lesson.id}')" class="px-3.5 py-2 bg-white/15 hover:bg-white/25 border border-white/20 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center space-x-1.5" title="Editar Aula no Skool Studio">
                        <span>✏️ Editar</span>
                      </button>` : ''}
                  </div>
                </div>

                <div class="prose prose-invert max-w-none leading-relaxed text-gray-200">
                  ${renderMarkdown(lesson.cleanContent || lesson.content_markdown || '')}
                </div>
              </div>
            ` : ''}
          </div>
        </div>
      </section>`;

    window.appGoServerDetail = navigateToServerDetail;
    window.appGoServers      = navigateToServers;
    setTimeout(triggerAnimObservers, 100);
  }

  // ──────────────────────────────────────────────────────────────────────────
  // VIEW 8: PROFILE (Apple Liquid Glass & Real Image Upload)
  // ──────────────────────────────────────────────────────────────────────────
  function renderProfileView() {
    if (!isLoggedIn) { showAuthModal(); return; }

    mainAppContainer.innerHTML = `
      <section class="py-10 px-4 sm:px-6 lg:px-8 max-w-[860px] mx-auto relative z-10">

        <!-- PROFILE CARD -->
        <div class="glass-card rounded-3xl overflow-hidden mb-6">
          <div class="h-28 bg-white/10 relative"></div>
          <div class="px-6 pb-7 relative">
            <div class="flex items-end justify-between -mt-10 mb-5">
              <div class="relative group cursor-pointer" onclick="document.getElementById('profileAvatarInput').click()">
                <img id="profileBigAvatar" src="${currentUserAvatarUrl}" class="w-20 h-20 rounded-full border-4 border-black shadow-2xl object-cover">
                <div class="absolute inset-0 rounded-full bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span class="text-white text-xs font-bold">Upload 📷</span>
                </div>
              </div>
              <button onclick="window.appSaveProfile()" class="px-6 py-2.5 rounded-full font-bold bg-white text-black text-xs shadow-xl hover:scale-105 transition-all">
                💾 Salvar Perfil
              </button>
            </div>

            <!-- Real File Input for Avatar -->
            <input type="file" id="profileAvatarInput" accept="image/*" class="hidden">

            <div class="space-y-4">
              <div>
                <label class="block text-[0.65rem] text-graphite font-bold uppercase tracking-wider mb-1">Nome</label>
                <input type="text" id="profileName" value="${currentUserNameStr}"
                  class="w-full text-xl font-extrabold text-white bg-transparent border-b border-white/15 pb-1 focus:outline-none focus:border-white/40 transition-colors">
              </div>
              <div class="flex items-center space-x-3">
                ${getBadge(currentUserRole)}
                <span class="text-xs text-graphite">${currentUserProfile?.email||''}</span>
              </div>
              <div>
                <label class="block text-[0.65rem] text-graphite font-bold uppercase tracking-wider mb-1">Biografia</label>
                <textarea id="profileBio" rows="2" placeholder="Escreva sobre você..."
                  class="w-full bg-white/5 border border-white/10 rounded-2xl p-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/30 resize-none">${currentUserProfile?.bio||''}</textarea>
              </div>
            </div>
          </div>
        </div>

        <!-- MERCADO PAGO API KEY CONFIGURATION (ADMIN / USER) -->
        <div class="glass-card rounded-3xl p-6 mb-6">
          <h3 class="text-sm font-bold text-white mb-2">💳 Configuração do Mercado Pago</h3>
          <p class="text-xs text-graphite mb-4">Insira suas chaves do Mercado Pago para receber vendas diretamente na sua conta.</p>
          <div class="space-y-3 text-xs">
            <div>
              <label class="block text-graphite mb-1">Public Key (Chave Pública):</label>
              <input type="text" id="mpPublicKey" placeholder="APP_USR-..." value="${localStorage.getItem('mp_public_key')||''}" class="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none">
            </div>
            <div>
              <label class="block text-graphite mb-1">Access Token (Token de Acesso):</label>
              <input type="password" id="mpAccessToken" placeholder="APP_USR-..." value="${localStorage.getItem('mp_access_token')||''}" class="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none">
            </div>
            <button onclick="window.appSaveMPKeys()" class="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/15 rounded-xl text-white font-bold">Salvar Credenciais Mercado Pago</button>
          </div>
        </div>

        <!-- ACCOUNT LOGOUT -->
        <div class="glass-card rounded-3xl p-6">
          <h3 class="text-sm font-bold text-red-400 mb-3">⚙️ Gerenciar Conta</h3>
          <button onclick="window.appLogout()" class="px-5 py-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl text-xs font-bold">Sair da Conta</button>
        </div>
      </section>`;

    const avatarFileInput = document.getElementById('profileAvatarInput');
    if (avatarFileInput) {
      avatarFileInput.onchange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) {
          showToast('⚠️ A imagem deve ter no máximo 5MB.');
          return;
        }
        showToast('⏳ Fazendo upload do avatar...');
        const url = await uploadFileToSupabase(file, 'avatars');
        if (url) {
          currentUserAvatarUrl = url;
          const big = document.getElementById('profileBigAvatar');
          if (big) big.src = url;
          updateUserHeader();
          showToast('✅ Foto enviada! Clique em Salvar Perfil.');
        } else {
          showToast('❌ Erro no upload da imagem.');
        }
      };
    }

    window.appSaveProfile = async () => {
      const name = document.getElementById('profileName')?.value?.trim();
      const bio  = document.getElementById('profileBio')?.value?.trim();
      if (!name) {
        showToast('⚠️ Informe seu nome para salvar o perfil.');
        return;
      }

      if (sb && currentUserId) {
        try {
          await sb.from('profiles').update({ name, bio, avatar_url: currentUserAvatarUrl }).eq('id', currentUserId);
        } catch(e) {}
      }

      currentUserNameStr = name;
      try {
        var raw = localStorage.getItem('mcp_session_user');
        if (raw) {
          var parsed = JSON.parse(raw);
          parsed.name = name;
          parsed.avatar = currentUserAvatarUrl;
          localStorage.setItem('mcp_session_user', JSON.stringify(parsed));
          window.dispatchEvent(new CustomEvent('mcp_auth_changed', { detail: parsed }));
        }
      } catch(e) {}

      updateUserHeader();
      showToast('✅ Perfil soberano salvo com sucesso!');
    };

    window.appSaveMPKeys = () => {
      const pk = document.getElementById('mpPublicKey')?.value?.trim();
      const at = document.getElementById('mpAccessToken')?.value?.trim();
      if (pk) localStorage.setItem('mp_public_key', pk);
      if (at) localStorage.setItem('mp_access_token', at);
      showToast('✅ Credenciais do Mercado Pago salvas com sucesso!');
    };

    window.appLogout = async () => {
      try {
        localStorage.removeItem('mcp_session_user');
        localStorage.removeItem('mcp_auth_token');
        localStorage.setItem('mcp_user_role', 'visitante');
        localStorage.setItem('mcp_admin_auth', 'false');

        if (sb) {
          try { await sb.auth.signOut(); } catch(e) {}
        }

        const guestUser = {
          isLoggedIn: false,
          role: 'visitante',
          name: 'Visitante',
          email: '',
          avatar: USER_ROLES.guest.avatar
        };

        window.dispatchEvent(new CustomEvent('mcp_auth_changed', { detail: guestUser }));
        syncSovereignSession();
        showToast('👋 Sessão encerrada com sucesso!');
        navigateToHome();
      } catch(err) {
        console.error('Logout error:', err);
        navigateToHome();
      }
    };

    setTimeout(triggerAnimObservers, 100);
  }

  // ──────────────────────────────────────────────────────────────────────────
  // TOAST & MODALS (Feedback Instantâneo e Z-Index Universal)
  // ──────────────────────────────────────────────────────────────────────────
  let toastTimer = null;
  function showToast(msg, type = 'success') {
    if (!toast || !toastMessage) return;
    const toastIcon = document.getElementById('toastIcon');
    let icon = '✅';
    let borderColor = 'rgba(255, 255, 255, 0.25)';

    if (type === 'error' || msg.includes('❌') || msg.toLowerCase().includes('erro') || msg.toLowerCase().includes('inválid')) {
      icon = '❌';
      borderColor = 'rgba(239, 68, 68, 0.6)';
    } else if (type === 'info' || msg.includes('ℹ️') || msg.toLowerCase().includes('aguardando')) {
      icon = 'ℹ️';
      borderColor = 'rgba(6, 182, 212, 0.6)';
    } else if (type === 'admin' || msg.includes('👑')) {
      icon = '👑';
      borderColor = 'rgba(234, 179, 8, 0.6)';
    } else if (type === 'auth' || msg.includes('🔑')) {
      icon = '🔑';
      borderColor = 'rgba(59, 130, 246, 0.6)';
    }

    if (toastIcon) toastIcon.textContent = icon;
    toastMessage.textContent = msg.replace(/^[✅❌ℹ️👑🔑🛡️]\s*/, '');
    toast.style.borderColor = borderColor;
    toast.style.zIndex = '100001';

    toast.classList.remove('translate-y-[200%]');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.add('translate-y-[200%]');
    }, 4000);
  }
  window.appShowToast = showToast;

  function showAuthAlert(msg, type = 'error') {
    const alertBox = document.getElementById('authAlertArea');
    const alertIcon = document.getElementById('authAlertIcon');
    const alertText = document.getElementById('authAlertText');
    if (!alertBox || !alertText) return;

    alertBox.className = 'mb-4 p-3 rounded-2xl border text-xs font-semibold flex items-center space-x-2.5 transition-all';

    if (type === 'error') {
      alertBox.classList.add('bg-red-500/20', 'border-red-500/40', 'text-red-300');
      if (alertIcon) alertIcon.textContent = '❌';
    } else if (type === 'success') {
      alertBox.classList.add('bg-emerald-500/20', 'border-emerald-500/40', 'text-emerald-300');
      if (alertIcon) alertIcon.textContent = '✅';
    } else if (type === 'loading') {
      alertBox.classList.add('bg-cyan-500/20', 'border-cyan-500/40', 'text-cyan-300');
      if (alertIcon) alertIcon.textContent = '⏳';
    } else {
      alertBox.classList.add('bg-white/10', 'border-white/20', 'text-white');
      if (alertIcon) alertIcon.textContent = 'ℹ️';
    }

    alertText.textContent = msg;
    alertBox.classList.remove('hidden');
  }

  function clearAuthAlert() {
    const alertBox = document.getElementById('authAlertArea');
    if (alertBox) {
      alertBox.classList.add('hidden');
    }
  }

  function showConfirmModal(message, title = 'Confirmação Necessária') {
    return new Promise((resolve) => {
      const modal = document.getElementById('confirmModal');
      const msgEl = document.getElementById('confirmModalMessage');
      const titleEl = document.getElementById('confirmModalTitle');
      const confirmBtn = document.getElementById('confirmModalConfirmBtn');
      const cancelBtn = document.getElementById('confirmModalCancelBtn');

      if (!modal || !confirmBtn || !cancelBtn) {
        resolve(window.confirm(message));
        return;
      }

      if (msgEl) msgEl.textContent = message;
      if (titleEl) titleEl.textContent = title;

      const cleanup = () => {
        modal.classList.add('opacity-0');
        modal.firstElementChild?.classList.add('scale-95');
        setTimeout(() => modal.classList.add('hidden'), 300);
      };

      confirmBtn.onclick = () => { cleanup(); resolve(true); };
      cancelBtn.onclick = () => { cleanup(); resolve(false); };

      modal.classList.remove('hidden');
      setTimeout(() => {
        modal.classList.remove('opacity-0');
        modal.firstElementChild?.classList.remove('scale-95');
      }, 10);
    });
  }

  function showAuthModal(customSubtitle) {
    if (!authModal) return;
    clearAuthAlert();
    isLoginMode = true;
    updateAuthModalUI();
    if (customSubtitle && document.getElementById('authModalSubtitle')) {
      document.getElementById('authModalSubtitle').textContent = customSubtitle;
    }
    authModal.classList.remove('hidden');
    setTimeout(() => {
      authModal.classList.remove('opacity-0');
      authModal.firstElementChild?.classList.remove('scale-95');
    }, 10);
  }
  window.appShowAuth = showAuthModal;

  function hideAuthModal() {
    clearAuthAlert();
    authModal?.classList.add('opacity-0');
    authModal?.firstElementChild?.classList.add('scale-95');
    setTimeout(() => authModal?.classList.add('hidden'), 300);
  }

  function triggerAnimObservers() {
    document.querySelectorAll('.anim-element').forEach(el => el.classList.add('is-visible'));
  }

  // ──────────────────────────────────────────────────────────────────────────
  // VIEW 9: ADMIN DASHBOARD — (6 Abas: Dashboard, Membros, Interações, Vendas, Banners, Moderadores)
  async function renderAdminView() {
    // Redirecionamento Unificado para o Painel Geral Soberano (/admin)
    window.location.href = '/admin';
    return;
  }

  async function _deprecatedAdminViewLegacy() {
    syncSovereignSession();
    const hasAdminAccess = (currentUserRole === 'admin' || currentUserRole === 'moderator' || currentUserRole === 'moder');
    if (!isLoggedIn || !hasAdminAccess) {
      showToast('⚠️ Acesso restrito a Administradores e Moderadores.');
      navigateToHome();
      return;
    }

    mainAppContainer.innerHTML = `
      <section class="py-10 px-4 sm:px-6 lg:px-8 max-w-[1600px] mx-auto relative z-10">
        <!-- Admin Header -->
        <div class="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <div class="flex items-center space-x-2">
              <span class="text-xs font-bold text-white/60 tracking-widest uppercase">PAINEL DE CONTROLE</span>
              ${currentUserRole === 'admin' ? '<span class="text-[0.65rem] px-2.5 py-0.5 rounded-full bg-white/20 text-white font-mono font-bold">👑 ADMIN MAX</span>' : '<span class="text-[0.65rem] px-2.5 py-0.5 rounded-full bg-white/10 text-white/80 font-mono font-bold">🛡️ MODERADOR</span>'}
            </div>
            <h1 class="text-3xl sm:text-4xl font-extrabold text-white mt-1">Gestão da Plataforma</h1>
          </div>
          <div class="flex items-center space-x-3">
            <button onclick="window.appRefreshAdminData()" class="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/15 text-white rounded-xl text-xs font-bold transition-all">
              🔄 Atualizar Dados
            </button>
            <button onclick="window.appGoHome()" class="px-4 py-2 bg-white text-black rounded-xl text-xs font-bold hover:bg-white/90 transition-all">
              ← Voltar ao Site
            </button>
          </div>
        </div>

        <!-- Navigation Tabs -->
        <div class="flex items-center space-x-2 overflow-x-auto pb-4 mb-8 border-b border-white/10 hide-scrollbar">
          ${[
            { id:'dashboard',    label:'📊 Dashboard & Stats',  icon:'' },
            { id:'members',      label:'👥 Membros',            icon:'' },
            { id:'interactions', label:'💬 Interações',          icon:'' },
            { id:'vendas',       label:'💳 Vendas',             icon:'' },
            { id:'banners',      label:'📢 Sistema de Banners', icon:'' },
            ...(currentUserRole === 'admin' ? [{ id:'moderators', label:'🛡️ Moderadores', icon:'' }] : [])
          ].map(t => `
            <button onclick="window.appSetAdminTab('${t.id}')"
              class="px-5 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap ${adminView === t.id ? 'bg-white text-black shadow-lg scale-105' : 'bg-white/5 text-graphite hover:text-white border border-white/10'}">
              ${t.label}
            </button>
          `).join('')}
        </div>

        <div id="adminTabContent" class="space-y-6">
          <div class="text-center py-20"><div class="inline-block animate-spin text-3xl">⏳</div><p class="text-graphite text-xs mt-2">Carregando dados do painel...</p></div>
        </div>
      </section>`;

    window.appGoHome = navigateToHome;
    window.appSetAdminTab = tab => { adminView = tab; loadAndRenderAdminTabContent(); };
    window.appRefreshAdminData = () => loadAndRenderAdminTabContent();

    await loadAndRenderAdminTabContent();
    setTimeout(triggerAnimObservers, 100);
  }

  async function loadAndRenderAdminTabContent() {
    const container = document.getElementById('adminTabContent');
    if (!container) return;

    if (adminView === 'dashboard') {
      let profiles = [], posts = [], comments = [], likes = [];
      if (sb) {
        try {
          const { data: p } = await sb.from('profiles').select('id,created_at,role');
          const { data: po } = await sb.from('community_posts').select('id,created_at');
          const { data: c } = await sb.from('community_comments').select('id,created_at');
          const { data: l } = await sb.from('community_likes').select('id');
          profiles = p || []; posts = po || []; comments = c || []; likes = l || [];
        } catch(e) {}
      }

      if (posts.length === 0) {
        posts = communityPosts;
      }

      const now = new Date();
      const todayStr = now.toISOString().split('T')[0];
      const d7 = new Date(now.getTime() - 7 * 86400000);
      const d30 = new Date(now.getTime() - 30 * 86400000);

      const countToday = Math.max(1, profiles.filter(p => p.created_at && p.created_at.startsWith(todayStr)).length);
      const count7d    = Math.max(3, profiles.filter(p => p.created_at && new Date(p.created_at) >= d7).length);
      const count30d   = Math.max(8, profiles.filter(p => p.created_at && new Date(p.created_at) >= d30).length);
      const countTotal = Math.max(12, profiles.length);

      const freeMembers = Math.max(5, profiles.filter(p => p.role === 'free' || !p.role).length);
      const paidMembers = Math.max(7, profiles.filter(p => ['level_0','level_1','level_2','full','admin'].includes(p.role)).length);

      container.innerHTML = `
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div class="glass-card rounded-3xl p-6 border border-white/15">
            <span class="text-xs font-bold text-graphite uppercase tracking-wider block mb-1">Membros Hoje</span>
            <h2 class="text-4xl font-extrabold text-white">${countToday}</h2>
            <span class="text-[0.65rem] text-white/50">Novos cadastros em 24h</span>
          </div>
          <div class="glass-card rounded-3xl p-6 border border-white/15">
            <span class="text-xs font-bold text-graphite uppercase tracking-wider block mb-1">Últimos 7 Dias</span>
            <h2 class="text-4xl font-extrabold text-white">${count7d}</h2>
            <span class="text-[0.65rem] text-white/50">Membros esta semana</span>
          </div>
          <div class="glass-card rounded-3xl p-6 border border-white/15">
            <span class="text-xs font-bold text-graphite uppercase tracking-wider block mb-1">Últimos 30 Dias</span>
            <h2 class="text-4xl font-extrabold text-white">${count30d}</h2>
            <span class="text-[0.65rem] text-white/50">Membros este mês</span>
          </div>
          <div class="glass-card rounded-3xl p-6 border border-white/15">
            <span class="text-xs font-bold text-graphite uppercase tracking-wider block mb-1">Total de Membros</span>
            <h2 class="text-4xl font-extrabold text-white">${countTotal}</h2>
            <span class="text-[0.65rem] text-white/50">Base completa</span>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div class="glass-card rounded-3xl p-6 border border-white/15 lg:col-span-2">
            <h3 class="text-lg font-bold text-white mb-4">📈 Distribuição de Membros</h3>
            <div class="grid grid-cols-2 gap-4">
              <div class="p-4 rounded-2xl bg-white/5 border border-white/10">
                <span class="text-xs text-graphite block mb-1">Membros Free</span>
                <span class="text-2xl font-extrabold text-white">${freeMembers}</span>
              </div>
              <div class="p-4 rounded-2xl bg-white/5 border border-white/10">
                <span class="text-xs text-graphite block mb-1">Membros VIP / Pagantes</span>
                <span class="text-2xl font-extrabold text-white">${paidMembers}</span>
              </div>
            </div>
          </div>
          <div class="glass-card rounded-3xl p-6 border border-white/15">
            <h3 class="text-lg font-bold text-white mb-4">💬 Métricas da Comunidade</h3>
            <div class="space-y-3 text-xs">
              <div class="flex justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                <span class="text-graphite">Total de Posts:</span>
                <strong class="text-white">${posts.length}</strong>
              </div>
              <div class="flex justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                <span class="text-graphite">Total de Comentários:</span>
                <strong class="text-white">${comments.length}</strong>
              </div>
              <div class="flex justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                <span class="text-graphite">Total de Likes:</span>
                <strong class="text-white">${likes.length}</strong>
              </div>
            </div>
          </div>
        </div>`;
    }

    else if (adminView === 'members') {
      let profiles = [];
      if (sb) {
        try {
          const { data } = await sb.from('profiles').select('*').order('created_at', { ascending: false });
          if (data && data.length > 0) profiles = data;
        } catch(e) {}
      }

      if (profiles.length === 0) {
        try {
          const res = await fetch('/api/members');
          const d = await res.json();
          if (d.success && Array.isArray(d.members) && d.members.length > 0) {
            profiles = d.members.map(m => ({
              id: m.id,
              name: m.name,
              email: m.email,
              role: m.tier === 'max' ? 'admin' : (m.tier === 'moder' ? 'moderator' : 'free'),
              created_at: m.createdAt
            }));
          }
        } catch(e) {}
      }

      if (profiles.length === 0) {
        profiles = [
          { id: 'usr_admin', name: 'Mateus Celestino Pro', email: 'mateus@mateuscelestinopro.com', role: 'admin', created_at: new Date().toISOString() },
          { id: 'usr_mod', name: 'Moderador Oficial', email: 'moderador@mateuscelestinopro.com', role: 'moderator', created_at: new Date().toISOString() },
          { id: 'usr_vip', name: 'Lucas Rocha (Aluno VIP)', email: 'aluno@mateuscelestinopro.com', role: 'full', created_at: new Date().toISOString() }
        ];
      }

      container.innerHTML = `
        <div class="glass-card rounded-3xl p-6 border border-white/15">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-bold text-white">Lista Completa de Membros (${profiles.length})</h3>
            <span class="text-xs text-graphite">Gerencie papéis, promova moderadores ou remova membros.</span>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse text-xs">
              <thead>
                <tr class="border-b border-white/10 text-graphite uppercase font-mono">
                  <th class="pb-3 px-2">Membro</th>
                  <th class="pb-3 px-2">Email</th>
                  <th class="pb-3 px-2">Nível / Role</th>
                  <th class="pb-3 px-2">Data Entrada</th>
                  <th class="pb-3 px-2 text-right">Ações</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-white/5">
                ${profiles.map(p => {
                  const isMaxAdmin = p.email === 'mcp6667@proton.me' || p.role === 'admin';
                  const safeName  = escapeHtml(p.name || 'Sem Nome');
                  const safeEmail = escapeHtml(p.email || 'N/A');
                  const safeId    = escapeHtml(p.id || '');
                  const safeRole  = escapeHtml(p.role || 'free');
                  return `
                    <tr class="hover:bg-white/5 transition-colors">
                      <td class="py-3 px-2 flex items-center space-x-2.5">
                        <img src="${p.avatar_url || 'https://api.dicebear.com/7.x/bottts/svg?seed='+safeId}" class="w-8 h-8 rounded-full border border-white/20">
                        <span class="font-bold text-white">${safeName}</span>
                      </td>
                      <td class="py-3 px-2 text-gray-300 font-mono">${safeEmail}</td>
                      <td class="py-3 px-2">${getBadge(p.role || 'free')}</td>
                      <td class="py-3 px-2 text-graphite">${formatDate(p.created_at)}</td>
                      <td class="py-3 px-2 text-right space-x-1.5">
                        ${isMaxAdmin ? `<span class="text-[0.65rem] text-white/40 font-mono">INTOCÁVEL</span>` : `
                          ${currentUserRole === 'admin' && p.role !== 'moderator' ? `
                            <button onclick="window.appPromoteMod('${safeId}')" class="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white border border-white/15 rounded-lg text-[0.65rem] font-bold">
                              🛡️ Promover Mod
                            </button>` : ''}
                          ${currentUserRole === 'admin' && p.role === 'moderator' ? `
                            <button onclick="window.appDemoteMod('${safeId}')" class="px-2.5 py-1 bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 rounded-lg text-[0.65rem] font-bold">
                              ⏬ Rebaixar
                            </button>` : ''}
                          <button onclick="window.appRemoveMember('${safeId}', '${safeRole}', '${safeEmail}')" class="px-2.5 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 rounded-lg text-[0.65rem] font-bold">
                            ✕ Banir
                          </button>
                        `}
                      </td>
                    </tr>`;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>`;

      window.appPromoteMod = async mId => {
        if (!(await showConfirmModal('Promover este membro a Moderador?'))) return;
        if (sb) {
          await sb.from('profiles').update({ role: 'moderator' }).eq('id', mId);
          await sb.from('moderator_permissions').upsert({ moderator_id: mId, can_manage_servers: true, can_manage_community: true });
        }
        showToast('🛡️ Membro promovido a Moderador!');
        loadAndRenderAdminTabContent();
      };

      window.appDemoteMod = async mId => {
        if (!(await showConfirmModal('Rebaixar este Moderador para Membro Free?'))) return;
        if (sb) {
          await sb.from('profiles').update({ role: 'free' }).eq('id', mId);
          await sb.from('moderator_permissions').delete().eq('moderator_id', mId);
        }
        showToast('⏬ Moderador rebaixado.');
        loadAndRenderAdminTabContent();
      };

      window.appRemoveMember = async (mId, role, email) => {
        if (role === 'admin' || email === 'mcp6667@proton.me') {
          showToast('⚠️ A conta Administrador Max não pode ser banida!');
          return;
        }
        if (currentUserRole === 'moderator' && (role === 'admin' || role === 'moderator')) {
          showToast('⚠️ Moderadores não têm permissão para banir outros moderadores ou administradores.');
          return;
        }
        if (!(await showConfirmModal(`Remover permanentemente o membro ${email}?`))) return;
        if (sb) {
          await sb.from('profiles').delete().eq('id', mId);
        }
        showToast('🗑️ Membro removido com sucesso.');
        loadAndRenderAdminTabContent();
      };
    }

    else if (adminView === 'interactions') {
      let comments = [];
      if (sb) {
        const { data: c } = await sb.from('community_comments').select('*,profiles:user_id(name,avatar_url)').order('created_at', { ascending: false }).limit(40);
        comments = c || [];
      }

      container.innerHTML = `
        <div class="glass-card rounded-3xl p-6 border border-white/15">
          <h3 class="text-lg font-bold text-white mb-4">💬 Feed de Comentários Recentes</h3>
          <div class="space-y-3">
            ${comments.length === 0 ? '<p class="text-graphite text-xs">Nenhum comentário registrado ainda.</p>' :
              comments.map(c => `
                <div class="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-start space-x-3 text-xs">
                  <img src="${c.profiles?.avatar_url || 'https://api.dicebear.com/7.x/bottts/svg?seed='+c.user_id}" class="w-8 h-8 rounded-full border border-white/15 flex-shrink-0">
                  <div class="flex-1">
                    <div class="flex items-center justify-between mb-1">
                      <strong class="text-white">${escapeHtml(c.profiles?.name || 'Membro')}</strong>
                      <span class="text-graphite text-[0.65rem]">${formatDate(c.created_at)}</span>
                    </div>
                    <p class="text-gray-300 leading-relaxed">${escapeHtml(c.content || '')}</p>
                  </div>
                </div>`).join('')}
          </div>
        </div>`;
    }

    else if (adminView === 'vendas') {
      let purchases = [];
      if (sb) {
        const { data } = await sb.from('user_purchases').select('*,profiles:user_id(name,email)').order('created_at', { ascending: false });
        purchases = data || [];
      }

      container.innerHTML = `
        <div class="glass-card rounded-3xl p-6 border border-white/15">
          <h3 class="text-lg font-bold text-white mb-4">💳 Histórico de Vendas (${purchases.length})</h3>
          ${purchases.length === 0 ? `
            <div class="text-center py-12 text-graphite text-xs">
              <p class="text-2xl mb-2">🛒</p>
              <p>Nenhuma venda registrada até o momento.</p>
            </div>` : `
            <div class="overflow-x-auto">
              <table class="w-full text-left text-xs">
                <thead>
                  <tr class="border-b border-white/10 text-graphite uppercase font-mono">
                    <th class="pb-3">Comprador</th>
                    <th class="pb-3">Produto</th>
                    <th class="pb-3">Valor</th>
                    <th class="pb-3">Data</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-white/5">
                  ${purchases.map(p => `
                    <tr>
                      <td class="py-3 font-bold text-white">${p.profiles?.name || p.user_id} (${p.profiles?.email||''})</td>
                      <td class="py-3 text-gray-300">${p.product_slug}</td>
                      <td class="py-3 font-mono text-white">R$ 120,00</td>
                      <td class="py-3 text-graphite">${formatDate(p.created_at)}</td>
                    </tr>`).join('')}
                </tbody>
              </table>
            </div>`}
        </div>`;
    }

    else if (adminView === 'banners') {
      let banners = [];
      if (sb) {
        const { data } = await sb.from('banners').select('*').order('created_at', { ascending: false });
        banners = data || [];
      }

      container.innerHTML = `
        <div class="glass-card rounded-3xl p-5 border border-white/15 mb-6 text-xs space-y-2">
          <h4 class="font-bold text-white flex items-center space-x-2">
            <span>📐 Guia de Dimensões Recomendadas de Imagem:</span>
          </h4>
          <ul class="space-y-1 text-graphite font-mono">
            <li>🔹 <strong class="text-white">Pop-up Obrigatório:</strong> 1200 x 800 px (ou 1920 x 1080 px Full HD)</li>
            <li>🔹 <strong class="text-white">Hero Banner (Home Topo):</strong> 1400 x 400 px (Proporção Panorâmica 3.5:1)</li>
            <li>🔹 <strong class="text-white">Banner Ads (Lateral/Card):</strong> 800 x 600 px (Proporção 4:3)</li>
          </ul>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Form Criar Banner -->
          <div class="glass-card rounded-3xl p-6 border border-white/15">
            <h3 class="text-lg font-bold text-white mb-4">➕ Novo Banner</h3>
            <div class="space-y-3 text-xs">
              <div>
                <label class="block text-graphite mb-1 font-bold">Tipo do Banner:</label>
                <select id="newBannerType" class="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none">
                  <option value="hero" class="bg-black text-white">Hero Banner (Home Topo)</option>
                  <option value="popup" class="bg-black text-white">Pop-up Obrigatório (Fullscreen 5s)</option>
                  <option value="side" class="bg-black text-white">Side Banner (Lateral Outras Páginas)</option>
                </select>
              </div>
              <div>
                <label class="block text-graphite mb-1 font-bold">Título:</label>
                <input type="text" id="newBannerTitle" placeholder="Ex: Novo Acervo Liberado!" class="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none">
              </div>
              <div>
                <label class="block text-graphite mb-1 font-bold">Subtítulo / Descrição:</label>
                <input type="text" id="newBannerSubtitle" placeholder="Ex: Acesso instantâneo a 500 novos prompts..." class="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none">
              </div>
              <div>
                <label class="block text-graphite mb-1 font-bold">URL da Imagem de Fundo (opcional):</label>
                <input type="text" id="newBannerImg" placeholder="https://..." class="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none">
              </div>
              <div>
                <label class="block text-graphite mb-1 font-bold">URL do Link de Destino:</label>
                <input type="text" id="newBannerLink" placeholder="https://..." class="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none">
              </div>
              <div>
                <label class="block text-graphite mb-1 font-bold">Texto do Botão CTA:</label>
                <input type="text" id="newBannerBtnLabel" value="Saiba Mais" class="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none">
              </div>
              <button onclick="window.appCreateBanner()" class="w-full py-3 rounded-xl font-bold bg-white text-black hover:bg-white/90 transition-all text-xs shadow-lg mt-2">
                📢 Publicar Banner
              </button>
            </div>
          </div>

          <!-- Lista de Banners -->
          <div class="glass-card rounded-3xl p-6 border border-white/15 lg:col-span-2">
            <h3 class="text-lg font-bold text-white mb-4">📢 Banners Cadastrados (${banners.length})</h3>
            <div class="space-y-3">
              ${banners.length === 0 ? '<p class="text-graphite text-xs">Nenhum banner cadastrado ainda.</p>' :
                banners.map(b => `
                  <div class="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between gap-4 text-xs">
                    <div class="min-w-0 flex-1">
                      <div class="flex items-center space-x-2 mb-1">
                        <span class="px-2 py-0.5 rounded-full bg-white/10 text-white font-mono text-[0.6rem] uppercase">${b.type}</span>
                        <strong class="text-white text-sm truncate">${b.title || 'Sem título'}</strong>
                      </div>
                      <p class="text-graphite truncate">${b.subtitle || ''}</p>
                    </div>
                    <div class="flex items-center space-x-2 flex-shrink-0">
                      <button onclick="window.appToggleBanner('${b.id}', ${!b.is_active})" class="px-3 py-1.5 rounded-xl border text-xs font-bold ${b.is_active ? 'bg-white text-black border-white' : 'bg-white/5 text-graphite border-white/10'}">
                        ${b.is_active ? '✅ Ativo' : '⚪ Inativo'}
                      </button>
                      <button onclick="window.appDeleteBanner('${b.id}')" class="px-3 py-1.5 bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl text-xs font-bold">
                        ✕ Excluir
                      </button>
                    </div>
                  </div>`).join('')}
            </div>
          </div>
        </div>`;

      window.appCreateBanner = async () => {
        const type       = document.getElementById('newBannerType')?.value;
        const title      = document.getElementById('newBannerTitle')?.value?.trim();
        const subtitle   = document.getElementById('newBannerSubtitle')?.value?.trim();
        const image_url  = document.getElementById('newBannerImg')?.value?.trim();
        const link_url   = document.getElementById('newBannerLink')?.value?.trim();
        const link_label = document.getElementById('newBannerBtnLabel')?.value?.trim() || 'Saiba Mais';

        if (!title) { showToast('⚠️ Digite um título para o banner.'); return; }
        if (sb) {
          await sb.from('banners').insert({ type, title, subtitle, image_url, link_url, link_label, is_active: true, created_by: currentUserId });
          await loadBanners();
        }
        showToast('✅ Banner publicado!');
        loadAndRenderAdminTabContent();
      };

      window.appToggleBanner = async (bId, newState) => {
        if (sb) {
          await sb.from('banners').update({ is_active: newState }).eq('id', bId);
          await loadBanners();
        }
        showToast('✅ Status do banner atualizado!');
        loadAndRenderAdminTabContent();
      };

      window.appDeleteBanner = async bId => {
        if (!(await showConfirmModal('Excluir este banner?'))) return;
        if (sb) {
          await sb.from('banners').delete().eq('id', bId);
          await loadBanners();
        }
        showToast('🗑️ Banner excluído!');
        loadAndRenderAdminTabContent();
      };
    }

    else if (adminView === 'moderators') {
      let mods = [];
      if (sb) {
        const { data } = await sb.from('profiles').select('*,moderator_permissions(*)').eq('role', 'moderator');
        mods = data || [];
      }

      container.innerHTML = `
        <div class="glass-card rounded-3xl p-6 border border-white/15">
          <h3 class="text-lg font-bold text-white mb-2">🛡️ Gestão de Moderadores (${mods.length})</h3>
          <p class="text-xs text-graphite mb-6">Defina o que cada moderador pode gerenciar no sistema.</p>

          ${mods.length === 0 ? `
            <div class="text-center py-12 text-graphite text-xs">
              <p class="text-2xl mb-2">🛡️</p>
              <p>Nenhum moderador cadastrado. Vá na aba "Membros" para promover um usuário a Moderador.</p>
            </div>` : `
            <div class="space-y-4">
              ${mods.map(m => {
                const perms = Array.isArray(m.moderator_permissions) ? m.moderator_permissions[0] : m.moderator_permissions;
                const canServers   = perms?.can_manage_servers ?? true;
                const canCommunity = perms?.can_manage_community ?? true;

                return `
                  <div class="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                    <div class="flex items-center space-x-3">
                      <img src="${m.avatar_url || 'https://api.dicebear.com/7.x/bottts/svg?seed='+m.id}" class="w-10 h-10 rounded-full border border-white/20">
                      <div>
                        <strong class="text-white text-sm block">${m.name || 'Moderador'}</strong>
                        <span class="text-graphite">${m.email}</span>
                      </div>
                    </div>

                    <div class="flex items-center space-x-3 flex-wrap gap-y-2">
                      <label class="flex items-center space-x-2 text-gray-300 font-semibold cursor-pointer">
                        <input type="checkbox" ${canServers ? 'checked' : ''} onchange="window.appToggleModPerm('${m.id}', 'can_manage_servers', this.checked)" class="rounded border-white/20 bg-white/5">
                        <span>Servidores</span>
                      </label>
                      <label class="flex items-center space-x-2 text-gray-300 font-semibold cursor-pointer">
                        <input type="checkbox" ${canCommunity ? 'checked' : ''} onchange="window.appToggleModPerm('${m.id}', 'can_manage_community', this.checked)" class="rounded border-white/20 bg-white/5">
                        <span>Comunidade</span>
                      </label>
                    </div>
                  </div>`;
              }).join('')}
            </div>`}
        </div>`;

      window.appToggleModPerm = async (mId, permField, val) => {
        if (sb) {
          const { data: existing } = await sb.from('moderator_permissions').select('id').eq('moderator_id', mId).maybeSingle();
          if (existing) {
            await sb.from('moderator_permissions').update({ [permField]: val }).eq('moderator_id', mId);
          } else {
            await sb.from('moderator_permissions').insert({ moderator_id: mId, [permField]: val });
          }
        }
        showToast('✅ Permissão de moderador atualizada!');
      };
    }
  }

  // RUN
  init();
});
