/**
 * A.I VISUALS — Members Area v8.0 (Production Ready)
 * Backend: Supabase — MATEUS CELESTINO PRO X (lijrxbzotmoikyvjiipv)
 * Payments: Mercado Pago Checkout Pro
 * Design: Apple Liquid Glass (Zero Neon, VisionOS)
 */

// MCP Business OS [Demo] — Contingência Local Segura e Offline-First
const SUPABASE_URL = '';
const SUPABASE_ANON_KEY = '';
const MP_PUBLIC_KEY = '';
const _supabase = null;
const sb = null;

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
    'ai-portraits-pro': '/shop',
    'ai-art':           '/shop',
    'ai-effects-pro':   '/shop',
    'infoproduto-free': '/shop',
    'infoproduto-pago': '/shop',
    'infoproduto-vip':  '/shop',
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

  function formatMarkdown(content) {
    if (!content) return '';
    let html = escapeHtml(content);

    // Code blocks ```code```
    html = html.replace(/```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g, function(_, lang, code) {
      return `<pre class="my-2.5 p-3.5 rounded-xl bg-black/90 border border-white/10 font-mono text-xs text-red-200 overflow-x-auto whitespace-pre-wrap">${code}</pre>`;
    });

    // Inline code `code`
    html = html.replace(/`([^`\n]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-white/10 border border-white/10 text-red-300 font-mono text-xs">$1</code>');

    // Bold **text**
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-bold text-white">$1</strong>');

    // Italic *text*
    html = html.replace(/\*([^*]+)\*/g, '<em class="italic text-gray-200">$1</em>');

    // Headers ### Title and ## Title
    html = html.replace(/^### (.*$)/gim, '<h3 class="text-sm font-bold text-white mt-2.5 mb-1">$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2 class="text-base font-bold text-white mt-3 mb-1">$1</h2>');

    // Blockquote > quote
    html = html.replace(/^> (.*$)/gim, '<blockquote class="border-l-2 border-red-500/80 pl-3 py-1 my-2 text-gray-300 italic bg-white/[0.02] rounded-r">$1</blockquote>');

    // Bullet points - item or * item
    html = html.replace(/^[•\-\*] (.*$)/gim, '<div class="flex items-start space-x-2 my-1"><span class="text-red-400 leading-relaxed">•</span><span class="flex-1">$1</span></div>');

    // Markdown Links [title](url)
    html = html.replace(/\[([^\]]+)\]\((https?:\/\/[^\s\)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-red-400 hover:text-red-300 underline underline-offset-2">$1 ↗</a>');

    // Line breaks
    html = html.replace(/\n/g, '<br>');
    return html;
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
        name: roleStored === 'admin' ? 'Administrador Demo' : 'Membro Demo',
        role: roleStored,
        isLoggedIn: true
      };
    }

    if (isUserLogged && user) {
      isLoggedIn = true;
      currentUserId = user.id || null;
      currentUserNameStr = user.name || (user.role === 'admin' ? 'Administrador Demo' : 'Membro Demo');
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

      const res = await fetch('/api/auth/me', {
        headers,
        credentials: 'same-origin',
        cache: 'no-store'
      });
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
          name: u.name || (role === 'admin' ? 'Administrador Demo' : 'Membro Demo'),
          email: u.email,
          avatar: existingAvatar || (role === 'admin' ? USER_ROLES.admin.avatar : USER_ROLES.free.avatar),
          tier: u.tier || (role === 'admin' ? 'max' : 'vip')
        };
        localStorage.setItem('mcp_session_user', JSON.stringify(sessionUser));
        localStorage.setItem('mcp_user_role', sessionUser.role);
        localStorage.setItem('mcp_admin_auth', role === 'admin' ? 'true' : 'false');
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
        if (!hasSbSession) {
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
      if (['feed', 'prompts', 'challenges', 'saved', 'tag-editor', 'tags'].includes(subTab)) {
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

    // 2. Fallback de Contingência Local Soberana (Posts Reais do Usuário / LocalStorage)
    var localCustomPosts = [];
    try {
      var raw = localStorage.getItem('mcp_local_community_posts');
      if (raw) {
        var parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          var legacyMockIds = new Set(['post_welcome_admin', 'post_flux_crimson', 'post_effects_style', 'post_desafio_semanal']);
          localCustomPosts = parsed.filter(function(p) { return p && p.id && !legacyMockIds.has(p.id); });
        }
      }
    } catch(e) {}

    communityPosts = [...localCustomPosts];
    if (communityPosts.length === 0) {
      communityPosts = [
        {
          id: 'post_demo_welcome',
          user_id: 'user_admin_demo',
          user_name: 'Administrador Demo',
          user_avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Admin',
          user_role: 'admin',
          title: '📌 Boas-vindas à Comunidade Demo do Business OS',
          content: 'Este é o espaço demonstrativo para troca de experiências, discussões sobre arquiteturas de automação, pipelines de dados e agentes autônomos de IA. Sinta-se livre para explorar os canais e testar publicações.',
          link_url: '',
          link_title: '',
          images: [],
          is_pinned: true,
          likes: 24,
          likedBy: [],
          created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
          comments: [
            {
              id: 'comment_demo_1',
              user_id: 'user_demo_1',
              user_name: 'Carlos Tech Lead',
              user_avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Carlos',
              user_role: 'moderator',
              content: 'Excelente arquitetura e fluidez! O ecossistema modular está impressionante.',
              created_at: new Date(Date.now() - 3600000 * 2).toISOString()
            }
          ]
        },
        {
          id: 'post_demo_workflows',
          user_id: 'user_demo_2',
          user_name: 'Mariana Dev Senior',
          user_avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Mariana',
          user_role: 'full',
          title: '⚡ Novo pipeline de automação assíncrona',
          content: 'Acabei de validar uma esteira integrando webhooks corporativos com filas de mensagens e processamento em lote. A latência caiu mais de 65% em produção.',
          link_url: '',
          link_title: '',
          images: [],
          is_pinned: false,
          likes: 18,
          likedBy: [],
          created_at: new Date(Date.now() - 3600000 * 8).toISOString(),
          comments: []
        }
      ];
    }
  }

  // ──────────────────────────────────────────────────────────────────────────
  // CARREGADOR DE ESTATÍSTICAS REAIS DA COMUNIDADE (Zero Mockups)
  // ──────────────────────────────────────────────────────────────────────────
  let communityStats = { members: 0, prompts: 0, posts: 0, comments: 0 };
  async function loadCommunityStats() {
    try {
      const res = await fetch('/api/community/stats');
      if (res.ok) {
        const data = await res.json();
        if (data && data.success) {
          communityStats = {
            members: data.members || 0,
            prompts: data.prompts || 0,
            posts: data.posts || 0,
            comments: data.comments || 0
          };
        }
      }
    } catch(e) {}
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
              name: data.user.name || (role === 'admin' ? 'Administrador Demo' : 'Membro Demo'),
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

    // ──────────────────────────────────────────────────────────────────────────
    // MOBILE NAVIGATION DOCK & FAST SEARCH SYSTEM
    // ──────────────────────────────────────────────────────────────────────────
    const mobileDockHome = document.getElementById('mobileDockHomeBtn');
    const mobileDockCommunity = document.getElementById('mobileDockCommunityBtn');
    const mobileDockServers = document.getElementById('mobileDockServersBtn');
    const mobileDockSearch = document.getElementById('mobileDockSearchBtn');
    const mobileDockProfile = document.getElementById('mobileDockProfileBtn');

    mobileDockHome?.addEventListener('click', (e) => {
      e.preventDefault();
      closeMobileSearch();
      navigateToHome();
    });

    mobileDockCommunity?.addEventListener('click', (e) => {
      e.preventDefault();
      closeMobileSearch();
      navigateToCommunity();
    });

    mobileDockServers?.addEventListener('click', (e) => {
      e.preventDefault();
      closeMobileSearch();
      navigateToServers();
    });

    mobileDockSearch?.addEventListener('click', (e) => {
      e.preventDefault();
      openMobileSearch();
    });

    mobileDockProfile?.addEventListener('click', (e) => {
      e.preventDefault();
      closeMobileSearch();
      if (isLoggedIn) navigateToProfile();
      else showAuthModal();
    });

    // Mobile buttons no header da barra soberana
    const msbMobileSearchBtn = document.getElementById('msb-mobile-search-btn');
    const msbMobileAvatarBtn = document.getElementById('msb-mobile-avatar-btn');

    msbMobileSearchBtn?.addEventListener('click', (e) => {
      e.preventDefault();
      openMobileSearch();
    });

    msbMobileAvatarBtn?.addEventListener('click', (e) => {
      e.preventDefault();
      if (isLoggedIn) navigateToProfile();
      else showAuthModal();
    });

    // Mobile Search Overlay Controls
    const mobileSearchOverlay = document.getElementById('mobileSearchOverlay');
    const mobileSearchInput = document.getElementById('mobileSearchInput');
    const mobileSearchCloseBtn = document.getElementById('mobileSearchCloseBtn');
    const mobileSearchClearBtn = document.getElementById('mobileSearchClearBtn');

    function openMobileSearch() {
      if (!mobileSearchOverlay) return;
      mobileSearchOverlay.classList.add('open');
      mobileSearchOverlay.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      if (mobileSearchInput) {
        setTimeout(() => mobileSearchInput.focus(), 150);
      }
    }

    function closeMobileSearch() {
      if (!mobileSearchOverlay) return;
      mobileSearchOverlay.classList.remove('open');
      mobileSearchOverlay.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      if (mobileSearchInput) mobileSearchInput.blur();
    }

    window.openMobileSearch = openMobileSearch;
    window.closeMobileSearch = closeMobileSearch;

    mobileSearchCloseBtn?.addEventListener('click', (e) => {
      e.preventDefault();
      closeMobileSearch();
    });

    mobileSearchClearBtn?.addEventListener('click', (e) => {
      e.preventDefault();
      if (mobileSearchInput) {
        mobileSearchInput.value = '';
        mobileSearchClearBtn.classList.add('hidden');
        handleMobileSearch('');
        mobileSearchInput.focus();
      }
    });

    let mobileSearchDebounce = null;
    mobileSearchInput?.addEventListener('input', (e) => {
      const q = e.target.value.trim();
      if (mobileSearchClearBtn) {
        mobileSearchClearBtn.classList.toggle('hidden', q.length === 0);
      }
      clearTimeout(mobileSearchDebounce);
      mobileSearchDebounce = setTimeout(() => {
        handleMobileSearch(q);
      }, 120);
    });

    // Chips de busca rápida
    document.querySelectorAll('.mobile-search-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const term = chip.getAttribute('data-chip');
        if (term && mobileSearchInput) {
          mobileSearchInput.value = term;
          if (mobileSearchClearBtn) mobileSearchClearBtn.classList.remove('hidden');
          handleMobileSearch(term);
        }
      });
    });

    function handleMobileSearch(term) {
      const resultsContainer = document.getElementById('mobileSearchResults');
      if (!resultsContainer) return;

      const q = (term || '').toLowerCase().trim();
      if (!q) {
        resultsContainer.innerHTML = `
          <div class="py-12 text-center text-white/40 text-xs font-mono">
            Digite um termo acima ou toque em uma sugestão rápida.
          </div>`;
        return;
      }

      const results = [];

      // 1. Prompts & Categorias dos Produtos
      (allProducts || []).forEach(prod => {
        (prod.categories || []).forEach(cat => {
          if ((cat.title || '').toLowerCase().includes(q)) {
            results.push({
              type: 'category',
              title: cat.title,
              subtitle: `${prod.title} • Estilo`,
              image: cat.hero_image,
              action: () => { closeMobileSearch(); navigateToCategory(prod.slug, cat.id); }
            });
          }
          (cat.prompts || []).forEach(p => {
            if ((p.prompt_text || '').toLowerCase().includes(q) || (p.title || '').toLowerCase().includes(q)) {
              results.push({
                type: 'prompt',
                title: p.title || 'Prompt IA',
                subtitle: `${cat.title}`,
                promptText: p.prompt_text,
                image: p.image_url,
                pSlug: prod.slug
              });
            }
          });
        });
      });

      // 2. Servidores e Aulas
      (serversData || []).forEach(srv => {
        if ((srv.title || '').toLowerCase().includes(q)) {
          results.push({
            type: 'server',
            title: srv.title,
            subtitle: `Servidor • ${srv.lessons?.length || 0} aulas`,
            image: srv.hero_image,
            action: () => { closeMobileSearch(); navigateToServerDetail(srv.id); }
          });
        }
        (srv.lessons || []).forEach(l => {
          if ((l.title || '').toLowerCase().includes(q) || (l.content_markdown || '').toLowerCase().includes(q)) {
            results.push({
              type: 'lesson',
              title: l.title,
              subtitle: `Aula em ${srv.title}`,
              image: srv.hero_image,
              action: () => { closeMobileSearch(); navigateToServerDetail(srv.id, l.id); }
            });
          }
        });
      });

      // 3. Posts da Comunidade
      (communityPosts || []).forEach(post => {
        if ((post.title || '').toLowerCase().includes(q) || (post.content || '').toLowerCase().includes(q) || (post.ai_prompt || '').toLowerCase().includes(q)) {
          results.push({
            type: 'community',
            title: post.title || 'Post da Comunidade',
            subtitle: `Por ${post.user_name || 'Membro'}`,
            promptText: post.ai_prompt,
            image: post.images?.[0] || null,
            action: () => { closeMobileSearch(); navigateToCommunity(); }
          });
        }
      });

      if (results.length === 0) {
        resultsContainer.innerHTML = `
          <div class="py-16 text-center text-white/40 text-xs font-mono space-y-2">
            <div class="text-3xl">🔍</div>
            <p>Nenhum resultado para "<span class="text-white">${escapeHtml(q)}</span>"</p>
            <p class="text-[11px] text-white/30">Tente buscar por termos como Flux, Midjourney, Retrato ou Efeitos.</p>
          </div>`;
        return;
      }

      // Renderiza resultados compactos táteis
      resultsContainer.innerHTML = `
        <div class="text-[11px] text-white/50 font-mono mb-2 flex items-center justify-between">
          <span>${results.length} resultado(s) encontrado(s)</span>
          <span class="text-red-400 font-bold uppercase text-[10px]">Toque para abrir</span>
        </div>
        <div class="space-y-2 pb-6">
          ${results.slice(0, 30).map((r, idx) => {
            const hasAction = typeof r.action === 'function';
            const actionId = `mob_res_${idx}`;
            if (hasAction) {
              window[actionId] = r.action;
            }
            return `
              <div class="p-3 rounded-2xl bg-white/[0.05] border border-white/10 active:bg-white/[0.1] transition-all flex items-center gap-3">
                ${r.image ? `
                  <img src="${r.image}" class="w-12 h-12 rounded-xl object-cover border border-white/10 flex-shrink-0" onerror="this.style.display='none'">
                ` : `
                  <div class="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-base flex-shrink-0">
                    ${r.type === 'server' ? '🖥️' : r.type === 'lesson' ? '📚' : r.type === 'community' ? '💬' : '✨'}
                  </div>
                `}
                <div class="min-w-0 flex-1 ${hasAction ? 'cursor-pointer' : ''}" ${hasAction ? `onclick="window.${actionId}()"` : ''}>
                  <p class="text-xs font-bold text-white truncate">${escapeHtml(r.title)}</p>
                  <p class="text-[11px] text-white/50 truncate">${escapeHtml(r.subtitle)}</p>
                </div>
                ${r.promptText ? `
                  <button onclick="window.appCopyMobilePrompt('${encodeURIComponent(r.promptText)}')" class="px-3 py-1.5 rounded-xl bg-red-600/80 hover:bg-red-600 active:scale-95 text-white text-[11px] font-bold tracking-wide flex-shrink-0 transition-all flex items-center gap-1 shadow-md">
                    <span>📋</span>
                    <span>Copiar</span>
                  </button>
                ` : hasAction ? `
                  <button onclick="window.${actionId}()" class="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-white text-[11px] font-bold flex-shrink-0 transition-all">
                    Abrir →
                  </button>
                ` : ''}
              </div>`;
          }).join('')}
        </div>`;
    }

    window.appCopyMobilePrompt = (enc) => {
      if (!isLoggedIn) {
        showToast('⚠️ Faça login para copiar este prompt.');
        showAuthModal('Faça login ou crie sua conta para copiar os prompts exclusivos.');
        return;
      }
      navigator.clipboard.writeText(decodeURIComponent(enc)).then(() => {
        showToast('✅ Prompt copiado com sucesso!');
      });
    };
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
    navigateToHome();
    if (window.appShowProductOverview) {
      window.appShowProductOverview(slug);
    }
  }

  function navigateToCategory(ps, ci) {
    navigateToHome();
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
    await loadCommunityStats();
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
  window.appGoCommunity = navigateToCommunity;
  window.appGoServers = navigateToServers;
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

    const hasAdminAccess = isLoggedIn && currentUserRole === 'admin';
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
        challenges: 'Desafios Semanais',
        saved: 'Meus Salvos',
        'tag-editor': 'Tag Editor & Taxonomia'
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
    const isHome = (currentView === 'home' || currentView === 'product' || currentView === 'category' || currentView === 'search');
    const isCommunity = (currentView === 'community');
    const isServers = (currentView === 'servers' || currentView === 'server_detail');

    document.querySelectorAll('.nav-item').forEach(item => {
      const v = item.getAttribute('data-view');
      const isActive = (v === 'home' && isHome) ||
                       (v === 'community' && isCommunity) ||
                       (v === 'servers' && isServers) ||
                       (v === currentView);

      item.classList.toggle('active', isActive);

      // Liquid Glass Bubble dinâmico de destaque
      item.classList.toggle('bg-white/10', isActive);
      item.classList.toggle('border-white/20', isActive);
      item.classList.toggle('text-white', isActive);
      item.classList.toggle('backdrop-blur-md', isActive);
      item.classList.toggle('shadow-sm', isActive);

      item.classList.toggle('border-transparent', !isActive);
      item.classList.toggle('text-graphite', !isActive);
    });

    // Sincroniza Bottom Dock Mobile
    document.querySelectorAll('.mobile-dock-btn').forEach(btn => {
      const v = btn.getAttribute('data-view');
      if (v) {
        btn.classList.toggle('active', v === currentView || (v === 'servers' && currentView === 'server_detail'));
      }
    });
  }

  // ──────────────────────────────────────────────────────────────────────────
  // VIEW 1: HOME (Apple Liquid Glass & Dynamic 3s Image Rotation)
  // ──────────────────────────────────────────────────────────────────────────
  function renderHomeView() {
    mainAppContainer.innerHTML = `
      <section class="py-6 sm:py-12 px-3 sm:px-6 lg:px-8 max-w-[1600px] mx-auto relative z-10">

        <!-- Hero Banner se existir -->
        ${renderHeroBanner()}

        <!-- Headline Monumental Solicitado: "Seus infoprodutos free e pagos aqui" -->
        <div class="mb-10 sm:mb-14 text-center anim-element anim-fade-up">
          <span class="inline-block px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-[11px] sm:text-xs font-mono font-bold tracking-wider uppercase mb-3 sm:mb-4 backdrop-blur-xl">✨ HUB DE INFOPRODUTOS & COMUNIDADE // DEMO</span>
          <h1 class="text-3xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight text-white mb-4 sm:mb-6 drop-shadow-2xl leading-tight">
            Seus infoprodutos <span class="bg-gradient-to-r from-red-500 via-rose-300 to-white bg-clip-text text-transparent">free e pagos</span> aqui
          </h1>
          <p class="text-graphite text-base sm:text-xl max-w-3xl mx-auto leading-relaxed">
            Área de distribuição e entrega de infoprodutos digitais de alta performance e comunidade interativa de membros.
          </p>
          <div class="mt-6 sm:mt-8 flex flex-wrap items-center justify-center gap-3">
            <button onclick="window.appGoCommunity()" class="px-7 py-3.5 rounded-full font-bold bg-white text-black hover:bg-zinc-200 active:scale-95 transition-all text-xs min-h-[46px] inline-flex items-center justify-center gap-2 shadow-2xl">
              <span>💬 Acessar Feed da Comunidade</span>
            </button>
            <button onclick="window.appGoServers()" class="px-7 py-3.5 rounded-full font-bold bg-white/10 hover:bg-white/20 border border-white/15 text-white active:scale-95 transition-all text-xs min-h-[46px] inline-flex items-center justify-center gap-2 backdrop-blur-md">
              <span>🖥️ Servidores & Aulas</span>
            </button>
          </div>
        </div>

        <!-- Grade de Infoprodutos (Sem navegação interna de prompts) -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-8">
          ${[
            {
              slug: 'infoproduto-free',
              title: 'Seu Infoproduto Free Aqui',
              desc: 'Sua descrição aqui. Ebook, kit de automações ou mini-curso gratuito para atração e conversão de novos membros.',
              price: 'R$ 0,00',
              badge: 'FREE TIER',
              tag: 'Download Imediato',
              img: './public/assets/images/opt_0008_img_exact_87ca3.webp'
            },
            {
              slug: 'infoproduto-pago',
              title: 'Seu Infoproduto Pago Aqui',
              desc: 'Sua descrição aqui. Pack premium com esteiras n8n, blueprints de agentes autônomos e arquiteturas de alta conversão.',
              price: 'R$ 120,00',
              badge: 'PRO TIER',
              tag: 'Acesso Completo',
              img: './public/assets/images/opt_0000_img_exact_29e38.webp'
            },
            {
              slug: 'infoproduto-vip',
              title: 'Sua Masterclass VIP Aqui',
              desc: 'Sua descrição aqui. Mentoria gravada, servidores dedicados e suporte direto com a comunidade.',
              price: 'R$ 240,00',
              badge: 'VIP TIER',
              tag: 'Masterclass + Suporte',
              img: './public/assets/images/opt_0740_img_exact_666ee.webp'
            }
          ].map((item, idx) => `
            <div class="img-card glass-card group anim-element anim-scale relative rounded-3xl overflow-hidden hover:border-white/40 transition-all duration-500 flex flex-col">
              <div class="h-56 sm:h-80 w-full overflow-hidden relative">
                <img src="${item.img}" alt="${item.title}" class="w-full h-full object-cover group-hover:scale-105 transition-all duration-1000 ease-in-out">
                <div class="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent"></div>
                <span class="absolute top-3 sm:top-4 left-3 sm:left-4 text-xs font-bold px-3 py-1.5 rounded-full bg-black/60 text-white border border-white/20 backdrop-blur-xl">${item.price}</span>
                <span class="absolute top-3 sm:top-4 right-3 sm:right-4 text-[0.65rem] font-mono px-2.5 py-1 rounded-full bg-white/10 text-white/80 border border-white/20 backdrop-blur-md">${item.badge}</span>
              </div>
              <div class="p-5 sm:p-8 flex-1 flex flex-col justify-between">
                <div>
                  <h3 class="text-2xl sm:text-3xl font-extrabold text-white mb-2 group-hover:text-white/80 transition-colors">${item.title}</h3>
                  <p class="text-graphite text-xs sm:text-sm leading-relaxed mb-5 sm:mb-6">${item.desc}</p>
                </div>
                <div class="space-y-2.5 sm:space-y-3 border-t border-white/10 pt-4">
                  <div class="flex items-center justify-between">
                    <span class="text-xs font-mono text-white/80">✨ ${item.tag}</span>
                    <button onclick="window.appShowProductOverview('${item.slug}')" class="text-xs font-bold px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white active:scale-95 transition-all min-h-[42px] flex items-center justify-center">Detalhes do Infoproduto →</button>
                  </div>
                  <a href="/shop" class="block w-full text-center py-3 rounded-xl font-bold bg-white text-black text-xs shadow-lg hover:bg-white/90 active:scale-95 transition-all min-h-[44px] flex items-center justify-center">
                    Ver Vitrine no Shop ↗
                  </a>
                </div>
              </div>
            </div>`).join('')}
        </div>
      </section>`;

    window.appShowAuth = showAuthModal;
    setTimeout(triggerAnimObservers, 100);
  }

  // ──────────────────────────────────────────────────────────────────────────
  // VIEW 2 & 3: ISOLADAS — NAVEGAÇÃO INTERNA DE PROMPTS REMOVIDA
  // ──────────────────────────────────────────────────────────────────────────
  function renderProductView() {
    navigateToHome();
  }

  function renderCategoryView() {
    navigateToHome();
  }

  window.appShowProductOverview = function(slug) {
    const titles = {
      'infoproduto-free': 'Seu Infoproduto Free Aqui',
      'infoproduto-pago': 'Seu Infoproduto Pago Aqui',
      'infoproduto-vip': 'Sua Masterclass VIP Aqui'
    };
    const title = titles[slug] || 'Infoproduto Demo';
    showToast(`📦 ${title}: Conteúdo integrado à área de membros da comunidade.`);
  };

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
  let communityActiveTab = 'feed'; // 'feed' | 'prompts' | 'challenges' | 'saved' | 'tag-editor'
  let communityActiveFilter = 'all'; // 'all' | tag.id
  let communityPromptModelFilter = 'all'; // 'all' | 'Flux.1' | 'Midjourney' | 'ComfyUI' | 'SD 3.5'
  let communitySearchQuery = '';
  let communitySelectedCategory = 'prompts';
  let communitySelectedSubtags = [];
  let communityComposerMode = 'write'; // 'write' | 'preview'
  let communityPromptBoxOpen = false;
  let communityLinkBoxOpen = false;

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

    const displayMembers = (communityStats.members > 0 ? communityStats.members : (isLoggedIn ? 1 : 0));
    const displayPrompts = (communityStats.prompts > 0 ? communityStats.prompts : communityPosts.filter(p => p.ai_prompt || p.tag === 'prompts').length);
    const displayPosts = communityPosts.length;
    const displayComments = communityPosts.reduce((a,p)=>a+(p.comments?.length||0),0);

    const trendingTags = (function() {
      const counts = {};
      communityPosts.forEach(p => {
        const text = `${p.title || ''} ${p.content || ''}`;
        const matches = text.match(/#[A-Za-z0-9_]+/g) || [];
        matches.forEach(t => { counts[t] = (counts[t] || 0) + 1; });
        if (p.tag) {
          const t = '#' + p.tag.replace(/^#/, '');
          counts[t] = (counts[t] || 0) + 1;
        }
      });
      return Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([tag, count]) => ({ tag, count }));
    })();

    return `
      <!-- FILTROS DE TAGS DINÂMICAS & BUSCA INTEGRADA COMPACTA -->
      <div class="mb-5 sm:mb-6 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div class="flex items-center space-x-1.5 sm:space-x-2 overflow-x-auto no-scrollbar -mx-1 px-1 touch-pan-x pb-1 text-xs">
          <button onclick="window.appFilterCommunity('all')"
            class="px-3.5 py-2 rounded-full font-bold transition-all whitespace-nowrap active:scale-95 ${communityActiveFilter === 'all' ? 'bg-white text-black shadow-md' : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/10'}">
            🌟 Todos (${communityPosts.length})
          </button>
          ${tags.map(t => {
            const count = getTagPostCount(t.id);
            const isAct = communityActiveFilter === t.id;
            return `
              <button onclick="window.appFilterCommunity('${t.id}')"
                class="px-3.5 py-2 rounded-full font-bold transition-all whitespace-nowrap flex items-center space-x-1.5 active:scale-95 ${isAct ? 'bg-white text-black shadow-md' : 'bg-white/5 text-gray-300 hover:text-white hover:bg-white/10 border border-white/10'}">
                <span>${t.icon || '🏷️'}</span>
                <span>${escapeHtml(t.name)}</span>
                <span class="text-[10px] opacity-70">(${count})</span>
              </button>
            `;
          }).join('')}
          <button onclick="window.appSwitchCommunityTab('tag-editor')" title="Gerenciar e editar tags"
            class="px-3 py-2 rounded-full font-bold transition-all whitespace-nowrap text-xs text-white/50 hover:text-white bg-white/5 hover:bg-white/10 active:scale-95 border border-dashed border-white/20 flex items-center space-x-1">
            <span>⚙️</span>
            <span>Tag Editor</span>
          </button>
        </div>

        <div class="relative w-full md:w-64">
          <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs">🔍</span>
          <input type="text" id="communitySearchInput" placeholder="Buscar no feed..."
            value="${escapeHtml(communitySearchQuery)}"
            oninput="window.appSearchCommunity(this.value)"
            class="w-full bg-white/5 border border-white/15 focus:border-white/30 rounded-full pl-9 pr-3 py-2 text-base sm:text-xs text-white placeholder-white/30 focus:outline-none focus:bg-black/60 transition-all font-medium">
        </div>
      </div>

      <!-- LAYOUT ORIGINAL 2 COLUNAS: FEED (2/3) + SIDEBAR (1/3) -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-7">
        <div class="lg:col-span-2 space-y-4 sm:space-y-5">

          <!-- POST COMPOSER SOBERANO DE ELITE REFORMULADO -->
          <div class="glass-card rounded-3xl overflow-hidden p-5 sm:p-6 border border-white/15 relative shadow-2xl transition-all hover:border-red-500/30">
            <div class="absolute -top-12 -right-12 w-48 h-48 bg-red-600/10 rounded-full blur-3xl pointer-events-none"></div>

            <!-- Top Composer Header: Author & Mode Switcher -->
            <div class="flex items-center justify-between pb-3.5 mb-3.5 border-b border-white/10 gap-2 relative z-10">
              <div class="flex items-center space-x-3 min-w-0">
                <div class="relative flex-shrink-0 cursor-pointer" onclick="window.appGoProfile()" title="Ver seu perfil">
                  <img src="${currentUserAvatarUrl}" class="w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-white/20 object-cover ${currentUserRole === 'admin' ? 'border-red-500 shadow-[0_0_12px_rgba(239,68,68,0.45)]' : ''}">
                  ${currentUserRole === 'admin' ? '<span class="absolute -top-1 -right-1 text-xs">👑</span>' : ''}
                </div>
                <div class="min-w-0">
                  <div class="flex items-center space-x-2">
                    <span class="text-xs sm:text-sm font-extrabold text-white truncate max-w-[140px] sm:max-w-none">${currentUserNameStr}</span>
                    ${getBadge(currentUserRole)}
                  </div>
                  <div class="flex items-center space-x-2 mt-0.5">
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span class="text-[10px] text-gray-400 font-mono">Editor Soberano</span>
                    <span id="composerDraftIndicator" class="text-[10px] font-mono text-emerald-400/90 hidden sm:inline-flex items-center space-x-1 opacity-0 transition-opacity">
                      <span>•</span><span>💾 Rascunho salvo</span>
                    </span>
                  </div>
                </div>
              </div>

              <!-- Switcher Escrever / Prévia -->
              <div class="flex items-center space-x-1 bg-black/60 p-1 rounded-xl border border-white/10 text-xs font-bold flex-shrink-0">
                <button type="button" id="composerModeWriteBtn" onclick="window.setComposerMode('write')"
                  class="px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1.5 bg-white text-black shadow-sm font-bold">
                  <span>✏️</span><span>Escrever</span>
                </button>
                <button type="button" id="composerModePreviewBtn" onclick="window.setComposerMode('preview')"
                  class="px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1.5 text-gray-400 hover:text-white hover:bg-white/5 font-bold">
                  <span>👁️</span><span>Prévia</span>
                </button>
              </div>
            </div>

            <!-- Toolbar de Formatação Markdown Rápida -->
            <div id="composerFormattingToolbar" class="flex items-center justify-between gap-1 pb-2.5 mb-3 border-b border-white/5 overflow-x-auto no-scrollbar text-xs relative z-10">
              <div class="flex items-center space-x-1">
                <button type="button" onclick="window.insertMarkdownFormat('**', '**')" title="Negrito (**texto**)"
                  class="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 active:scale-95 border border-white/10 text-gray-200 hover:text-white font-bold transition-all text-xs font-mono min-h-[30px] flex items-center justify-center">
                  <strong>B</strong>
                </button>
                <button type="button" onclick="window.insertMarkdownFormat('*', '*')" title="Itálico (*texto*)"
                  class="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 active:scale-95 border border-white/10 text-gray-200 hover:text-white italic transition-all text-xs font-mono min-h-[30px] flex items-center justify-center">
                  <em>I</em>
                </button>
                <button type="button" onclick="window.insertMarkdownFormat('### ', '')" title="Título de Seção (### Título)"
                  class="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 active:scale-95 border border-white/10 text-gray-200 hover:text-white font-bold transition-all text-xs font-mono min-h-[30px] flex items-center justify-center">
                  H3
                </button>
                <button type="button" onclick="window.insertMarkdownFormat('\`', '\`')" title="Código Inline (\`código\`)"
                  class="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 active:scale-95 border border-white/10 text-gray-200 hover:text-white transition-all text-xs font-mono min-h-[30px] flex items-center justify-center">
                  &lt;/&gt;
                </button>
                <button type="button" onclick="window.insertMarkdownFormat('\`\`\`\\n', '\\n\`\`\`')" title="Bloco de Código"
                  class="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 active:scale-95 border border-white/10 text-gray-200 hover:text-white transition-all text-xs font-mono min-h-[30px] flex items-center justify-center">
                  { }
                </button>
                <button type="button" onclick="window.insertMarkdownFormat('> ', '')" title="Citação em Destaque"
                  class="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 active:scale-95 border border-white/10 text-gray-200 hover:text-white transition-all text-xs font-mono min-h-[30px] flex items-center justify-center">
                  “ ”
                </button>
                <button type="button" onclick="window.insertMarkdownFormat('- ', '')" title="Lista com Marcadores"
                  class="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 active:scale-95 border border-white/10 text-gray-200 hover:text-white transition-all text-xs font-mono min-h-[30px] flex items-center justify-center">
                  • Lista
                </button>
              </div>

              <div class="hidden sm:flex items-center space-x-1 pl-2 border-l border-white/10">
                ${['✨', '🔥', '🚀', '💡', '🎨', '⚡'].map(emoji => `
                  <button type="button" onclick="window.insertEmoji('${emoji}')" class="px-1.5 py-0.5 rounded hover:bg-white/10 transition-colors text-xs active:scale-90" title="Inserir emoji ${emoji}">${emoji}</button>
                `).join('')}
              </div>
            </div>

            <!-- Área de Escrita (Editor) -->
            <div id="composerWriteArea" class="space-y-3 relative z-10">
              <div class="relative">
                <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none">✍️</span>
                <input type="text" id="newPostTitle" placeholder="Título marcante para sua publicação (opcional)..."
                  oninput="window.handleComposerInput()"
                  class="w-full bg-black/40 border border-white/15 focus:border-red-500/50 focus:ring-1 focus:ring-red-500/30 rounded-2xl pl-9 pr-4 py-2.5 text-base sm:text-sm font-bold text-white placeholder-white/30 focus:outline-none transition-all">
              </div>

              <div class="relative">
                <textarea id="newPostContent" rows="4" placeholder="Compartilhe uma ideia, prompt, análise visual ou dúvida com a comunidade... (suporta Markdown completo)"
                  oninput="window.handleComposerInput()"
                  class="w-full bg-black/40 border border-white/15 focus:border-red-500/50 focus:ring-1 focus:ring-red-500/30 rounded-2xl p-4 pb-8 text-base sm:text-sm text-white focus:outline-none transition-all resize-none placeholder-white/30 leading-relaxed min-h-[110px]"></textarea>
                <div class="absolute right-3.5 bottom-2.5 text-[10px] font-mono text-gray-400 pointer-events-none" id="composerWordCount">
                  0 caracteres • 0 palavras
                </div>
              </div>
            </div>

            <!-- Área de Pré-visualização em Tempo Real (Inicialmente Oculta) -->
            <div id="composerPreviewArea" class="hidden p-4 rounded-2xl bg-black/60 border border-white/15 space-y-3 relative z-10">
              <div class="flex items-center justify-between border-b border-white/10 pb-2">
                <span class="text-xs font-mono font-bold text-emerald-400 flex items-center space-x-1.5">
                  <span>👁️</span><span>Prévia em Tempo Real da Publicação</span>
                </span>
                <span class="text-[10px] text-gray-400 font-mono">Simulação fiel do Feed</span>
              </div>
              <div id="composerLivePreviewCard"></div>
            </div>

            <!-- AI Prompt Studio Module (Expansível) -->
            <div id="composerPromptBox" class="${communityPromptBoxOpen ? '' : 'hidden'} mt-3 p-4 rounded-2xl bg-black/85 border border-red-500/35 space-y-3 relative z-10 shadow-xl">
              <div class="flex items-center justify-between border-b border-red-500/20 pb-2.5">
                <span class="text-xs font-bold text-red-400 flex items-center space-x-1.5 font-mono">
                  <span>🔮</span><span>AI Prompt Studio (Engine de Geração)</span>
                </span>
                <select id="newPostPromptModel" onchange="window.saveComposerDraft()" class="bg-black/90 border border-red-500/30 rounded-lg px-2.5 py-1 text-xs sm:text-[11px] text-white focus:outline-none font-mono">
                  <option value="Flux.1 Dev">Flux.1 Dev</option>
                  <option value="Flux.1 Schnell">Flux.1 Schnell</option>
                  <option value="Midjourney v6.1">Midjourney v6.1</option>
                  <option value="Midjourney v7">Midjourney v7</option>
                  <option value="Ideogram 2.0">Ideogram 2.0</option>
                  <option value="ComfyUI Pipeline">ComfyUI Pipeline</option>
                  <option value="Stable Diffusion 3.5">Stable Diffusion 3.5</option>
                  <option value="DALL-E 3">DALL-E 3</option>
                  <option value="Recraft V3">Recraft V3</option>
                </select>
              </div>
              <textarea id="newPostPromptCode" rows="2" placeholder="Cole aqui o prompt textual exato..."
                oninput="window.handleComposerInput()"
                class="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-base sm:text-xs font-mono text-gray-200 placeholder-white/30 focus:outline-none focus:border-red-500/40 leading-relaxed"></textarea>
              <div class="space-y-1.5">
                <input type="text" id="newPostPromptParams" placeholder="Parâmetros ou flags (ex: --ar 16:9 --v 6.1 --stylize 350)"
                  oninput="window.handleComposerInput()"
                  class="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-base sm:text-xs font-mono text-gray-300 placeholder-white/30 focus:outline-none focus:border-red-500/40">
                <div class="flex flex-wrap items-center gap-1 text-[10px] font-mono text-gray-400 pt-0.5">
                  <span class="mr-1">Flags rápidas:</span>
                  ${['--ar 16:9', '--ar 9:16', '--v 6.1', '--stylize 250', '--chaos 15', '--quality 2'].map(fl => `
                    <button type="button" onclick="window.appendPromptParam('${fl}')" class="px-1.5 py-0.5 rounded bg-white/5 hover:bg-white/15 border border-white/10 text-red-300 transition-colors">${fl}</button>
                  `).join('')}
                </div>
              </div>
            </div>

            <!-- Preview de Upload de Imagens -->
            <div id="postImageUploadPreview" class="hidden grid grid-cols-3 sm:grid-cols-5 gap-2 pt-2 relative z-10"></div>

            <!-- Campo de Link -->
            <div id="postLinkField" class="hidden mt-3 p-3.5 bg-white/5 rounded-2xl border border-white/10 space-y-2 relative z-10">
              <input type="url" id="newPostLinkUrl" placeholder="URL do link (https://...)" oninput="window.handleComposerInput()" class="w-full bg-transparent text-base sm:text-xs text-white placeholder-white/30 focus:outline-none border-b border-white/10 pb-1.5 font-mono">
              <input type="text" id="newPostLinkTitle" placeholder="Título do link (opcional, ex: Repositório GitHub / Artigo)" oninput="window.handleComposerInput()" class="w-full bg-transparent text-base sm:text-xs text-white placeholder-white/30 focus:outline-none">
            </div>

            <!-- PAINEL REFORMULADO DE TAXONOMIA & ATRIBUIÇÃO DE TAGS (ESTRUTURA COMPLETA) -->
            <div class="mt-4 pt-3.5 border-t border-white/10 rounded-2xl bg-white/[0.02] p-4 border border-white/10 space-y-3.5 relative z-10 shadow-inner">
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-2.5">
                <div class="flex items-center space-x-2">
                  <span class="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                  <span class="text-xs font-mono font-extrabold text-white uppercase tracking-wider flex items-center space-x-1.5">
                    <span>🏷️</span>
                    <span>Atribuição de Categoria & Tags</span>
                  </span>
                  <span class="text-[11px] text-gray-400 font-mono hidden md:inline">• Taxonomia de indexação</span>
                </div>

                <div class="flex items-center space-x-2 self-start sm:self-auto">
                  <div id="composerActiveTagBadge" class="flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold border transition-all">
                    <!-- Renderizado dinamicamente -->
                  </div>
                  ${(currentUserRole === 'admin' || currentUserRole === 'moderator') ? `
                    <button type="button" onclick="window.appOpenTagModal()" title="Criar ou editar taxonomias oficiais"
                      class="px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold text-red-300 bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 hover:border-red-500/50 transition-all flex items-center space-x-1 active:scale-95">
                      <span>+</span><span>Nova Tag</span>
                    </button>
                  ` : ''}
                </div>
              </div>

              <!-- Seletor 1: Categoria Principal -->
              <div>
                <label class="block text-[11px] font-mono text-gray-300 font-bold mb-2">
                  1. Categoria Principal do Post (Obrigatória):
                </label>
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-2" id="composerPrimaryTagGrid">
                  ${tags.map(t => {
                    const isSel = (communitySelectedCategory || (tags[0] && tags[0].id)) === t.id;
                    const count = getTagPostCount(t.id);
                    const colMap = TAG_COLOR_MAP[t.color] || TAG_COLOR_MAP.red;
                    return `
                      <button type="button" data-tag-id="${t.id}" data-tag-color="${t.color || 'red'}" onclick="window.selectPostCategory('${t.id}')"
                        class="post-cat-card p-3 rounded-2xl border text-left transition-all active:scale-95 cursor-pointer relative overflow-hidden ${isSel ? `${colMap.badge} shadow-lg ring-1 ring-white/20` : 'bg-white/[0.03] text-gray-400 border-white/10 hover:border-white/25 hover:bg-white/[0.06] hover:text-white'}">
                        <div class="flex items-center justify-between mb-1">
                          <span class="text-base">${t.icon || '🏷️'}</span>
                          <span class="cat-check-indicator text-xs font-bold ${isSel ? '' : 'hidden'}">✓</span>
                        </div>
                        <p class="text-xs font-bold text-white truncate leading-tight">${escapeHtml(t.name)}</p>
                        <p class="text-[10px] text-gray-400 truncate mt-0.5">${count} posts</p>
                      </button>
                    `;
                  }).join('')}
                </div>
              </div>

              <!-- Seletor 2: Sub-tópicos e Palavras-chave Adicionais (Multi-tags) -->
              <div class="pt-2 border-t border-white/5 space-y-2">
                <div class="flex items-center justify-between">
                  <label class="text-[11px] font-mono text-gray-300 font-bold flex items-center space-x-1.5">
                    <span>⚡</span>
                    <span>2. Sub-tópicos & Palavras-chave Adicionais (Multi-tagging):</span>
                  </label>
                  <span class="text-[10px] text-gray-400 font-mono">Indexação inteligente</span>
                </div>

                <div id="composerSelectedSubtagsList" class="flex flex-wrap items-center gap-1.5 empty:hidden">
                  <!-- Chips das subtags ativas -->
                </div>

                <div class="flex flex-wrap items-center gap-1.5 text-xs">
                  <span class="text-[10px] font-mono text-gray-400 mr-1">Sugestões:</span>
                  ${['#Flux1Dev', '#MidjourneyV6', '#ComfyUI', '#PromptStudio', '#Photorealism', '#Workflow', '#DicaRápida', '#Render4K', '#Cyberpunk'].map(st => `
                    <button type="button" onclick="window.toggleSubtag('${st}')"
                      class="composer-subtag-preset px-2 py-0.5 rounded-md border text-[11px] font-mono transition-all active:scale-95 bg-white/5 text-gray-300 border-white/10 hover:border-white/20 hover:text-white">
                      ${st}
                    </button>
                  `).join('')}
                </div>

                <!-- Input para sub-tag customizada -->
                <div class="flex items-center space-x-2 pt-1 max-w-sm">
                  <div class="relative flex-1">
                    <span class="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 font-mono text-xs">#</span>
                    <input type="text" id="composerCustomSubtagInput" placeholder="Adicionar sub-tag personalizada..."
                      onkeydown="if(event.key==='Enter'){event.preventDefault();window.addCustomSubtag();}"
                      class="w-full bg-black/50 border border-white/10 rounded-xl pl-6 pr-3 py-1.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-red-500/40 font-mono">
                  </div>
                  <button type="button" onclick="window.addCustomSubtag()"
                    class="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-mono font-bold text-white transition-all active:scale-95">
                    + Adicionar
                  </button>
                </div>
              </div>

              <!-- Destino de Indexação -->
              <p id="composerTagDestinationNote" class="text-[11px] font-mono text-gray-400 pt-1 border-t border-white/5 flex items-center space-x-1.5">
                <!-- Injetado dinamicamente -->
              </p>
            </div>

            <!-- Controles Exclusivos para Administração Soberana -->
            ${currentUserRole === 'admin' ? `
              <div class="mt-3.5 p-3 rounded-2xl bg-gradient-to-r from-red-950/40 to-black/60 border border-red-500/30 flex items-center justify-between relative z-10">
                <div class="flex items-center space-x-2.5">
                  <span class="text-base">📌</span>
                  <div>
                    <p class="text-xs font-bold text-white">Fixar esta publicação no topo do Feed Soberano</p>
                    <p class="text-[10px] text-gray-400">Ativa o banner de destaque de comunicado no feed</p>
                  </div>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" id="newPostPinnedToggle" onchange="window.saveComposerDraft()" class="sr-only peer">
                  <div class="w-9 h-5 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-red-600"></div>
                </label>
              </div>
            ` : ''}

            <input type="file" id="communityFileInput" multiple accept="image/*" class="hidden">

            <!-- Composer Footer Action Toolbar -->
            <div class="flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 pt-3.5 mt-3.5 border-t border-white/10 relative z-10">
              <div class="flex items-center space-x-1.5 sm:space-x-2 overflow-x-auto no-scrollbar py-1">
                <button type="button" onclick="document.getElementById('communityFileInput').click()"
                  class="flex items-center space-x-1.5 text-xs text-white/80 hover:text-white bg-white/5 hover:bg-white/10 active:scale-95 border border-white/10 px-3.5 py-2 rounded-full transition-all whitespace-nowrap min-h-[36px]">
                  <span>📷</span>
                  <span class="hidden sm:inline">Upload Imagens</span>
                  <span class="sm:hidden">Fotos</span>
                  <span id="composerImageCountBadge" class="hidden px-1.5 py-0.2 rounded-full text-[10px] bg-red-600 text-white font-bold font-mono">0</span>
                </button>
                <button type="button" onclick="window.toggleComposerPromptBox()"
                  class="flex items-center space-x-1.5 text-xs text-white/80 hover:text-white bg-white/5 hover:bg-white/10 active:scale-95 border border-white/10 px-3.5 py-2 rounded-full transition-all whitespace-nowrap min-h-[36px]">
                  <span>🔮</span>
                  <span>Prompt Studio</span>
                  <span id="composerPromptDot" class="${communityPromptBoxOpen ? '' : 'hidden'} w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                </button>
                <button type="button" onclick="window.togglePostLink()"
                  class="flex items-center space-x-1.5 text-xs text-white/80 hover:text-white bg-white/5 hover:bg-white/10 active:scale-95 border border-white/10 px-3.5 py-2 rounded-full transition-all whitespace-nowrap min-h-[36px]">
                  <span>🔗</span>
                  <span>Link</span>
                  <span id="composerLinkDot" class="${communityLinkBoxOpen ? '' : 'hidden'} w-2 h-2 rounded-full bg-blue-400"></span>
                </button>
                <button type="button" onclick="window.clearComposerDraft()" title="Limpar rascunho do editor"
                  class="flex items-center space-x-1 text-xs text-gray-400 hover:text-red-400 bg-white/5 hover:bg-white/10 active:scale-95 border border-white/10 px-2.5 py-2 rounded-full transition-all whitespace-nowrap min-h-[36px]">
                  <span>🗑️</span>
                </button>
              </div>

              <div class="flex items-center space-x-2.5 w-full sm:w-auto justify-end">
                <span class="text-[10px] font-mono text-gray-400 hidden lg:inline">⌘ + Enter para publicar</span>
                <button id="submitPostBtn" onclick="window.appCreatePost()"
                  class="w-full sm:w-auto px-7 py-2.5 rounded-full font-extrabold bg-gradient-to-r from-white via-gray-100 to-gray-200 text-black text-xs shadow-[0_0_20px_rgba(255,255,255,0.25)] hover:shadow-[0_0_25px_rgba(255,255,255,0.4)] hover:scale-105 active:scale-95 transition-all min-h-[42px] flex items-center justify-center space-x-2">
                  <span>Publicar Post</span>
                  <span>🚀</span>
                </button>
              </div>
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

          <!-- 2. Estatísticas & Métricas da Comunidade (Dinâmicas & Reais) -->
          <div class="glass-card rounded-3xl p-5 border border-white/10">
            <h3 class="text-sm font-bold text-white mb-3 flex items-center justify-between">
              <span>📊 Estatísticas</span>
              <span class="text-[10px] text-emerald-400 font-mono font-bold">Ao Vivo</span>
            </h3>
            <div class="grid grid-cols-2 gap-2.5">
              <div class="bg-white/5 rounded-xl p-2.5 text-center border border-white/10">
                <p class="text-lg font-extrabold text-white">${displayMembers}</p>
                <p class="text-[10px] text-gray-400">Membros VIP Ativos</p>
              </div>
              <div class="bg-white/5 rounded-xl p-2.5 text-center border border-white/10">
                <p class="text-lg font-extrabold text-white">${displayPrompts}</p>
                <p class="text-[10px] text-gray-400">Prompts & Workflows</p>
              </div>
              <div class="bg-white/5 rounded-xl p-2.5 text-center border border-white/10">
                <p class="text-lg font-extrabold text-white">${displayPosts}</p>
                <p class="text-[10px] text-gray-400">Posts no Feed</p>
              </div>
              <div class="bg-white/5 rounded-xl p-2.5 text-center border border-white/10">
                <p class="text-lg font-extrabold text-white">${displayComments}</p>
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

          <!-- 4. Trending Prompts (Dinâmico com base em posts reais) -->
          <div class="glass-card rounded-3xl p-5 border border-white/10">
            <h3 class="text-sm font-bold text-white mb-3 flex items-center space-x-2">
              <span>🔥</span><span>Trending Prompts</span>
            </h3>
            <div class="space-y-2 text-xs">
              ${trendingTags.length === 0 ? `
                <p class="text-[11px] text-gray-400 italic py-1">Nenhuma hashtag em alta no momento.</p>
              ` : trendingTags.map(t => `
                <div onclick="window.appSearchCommunity('${escapeJs(t.tag)}')" class="flex items-center justify-between p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-all cursor-pointer">
                  <span class="font-mono text-red-300 font-bold">${escapeHtml(t.tag)}</span>
                  <span class="text-[10px] text-gray-400">${t.count} ${t.count === 1 ? 'post' : 'posts'}</span>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- 5. Salas Rápidas -->
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
              <button onclick="window.appSwitchCommunityTab('challenges')" class="w-full flex items-center justify-between p-1.5 rounded-lg hover:bg-white/5 text-gray-300 hover:text-white transition-all text-left">
                <span># desafios-semanais</span>
                <span class="text-[10px] text-amber-400">Desafios</span>
              </button>
              <button onclick="window.appSwitchCommunityTab('saved')" class="w-full flex items-center justify-between p-1.5 rounded-lg hover:bg-white/5 text-gray-300 hover:text-white transition-all text-left">
                <span># salvos-favoritos</span>
                <span class="text-[10px] text-cyan-400">Salvos</span>
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

  function renderCommunityChallengesTab() {
    const challengePosts = (communityPosts || []).filter(p => {
      const text = `${p.title || ''} ${p.content || ''}`.toLowerCase();
      return text.includes('#desafio') || text.includes('#desafiocarmesim') || p.tag === 'showcase';
    });

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
                  <span class="text-white">Destaque na Home VIP • Badge Exclusivo de Criador</span>
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

          ${challengePosts.length === 0 ? `
            <div class="text-center py-16 glass-card-community rounded-3xl border border-white/10">
              <div class="text-4xl mb-3">🎨</div>
              <h4 class="text-sm font-bold text-white mb-1">Nenhuma submissão enviada ainda</h4>
              <p class="text-xs text-gray-400 max-w-sm mx-auto">Seja o primeiro a submeter sua criação com a hashtag #DesafioCarmesim no feed!</p>
              <button onclick="window.appJoinChallenge('#DesafioCarmesim')" class="mt-4 px-5 py-2.5 rounded-full bg-red-600 hover:bg-red-500 text-xs font-bold text-white shadow-lg transition-all">Participar do Desafio</button>
            </div>
          ` : `
            <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
              ${challengePosts.slice(0, 6).map(p => `
                <div class="glass-card-community rounded-3xl overflow-hidden border border-white/15">
                  ${p.images && p.images[0] ? `<img src="${escapeHtml(p.images[0])}" class="w-full h-48 object-cover">` : `<div class="w-full h-48 bg-black/40 flex items-center justify-center text-3xl">🎨</div>`}
                  <div class="p-4 space-y-2">
                    <span class="px-2 py-0.5 rounded text-[9px] font-mono bg-red-500/20 text-red-300">${escapeHtml(p.tag || 'Showcase')}</span>
                    <h4 class="text-xs font-bold text-white line-clamp-1">${escapeHtml(p.title || 'Criação da Comunidade')}</h4>
                    <p class="text-[10px] text-gray-400 font-mono">Por ${escapeHtml(p.user_name || 'Membro')} • ${p.likes || 0} curtidas</p>
                  </div>
                </div>
              `).join('')}
            </div>
          `}
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
    const safeContent = formatMarkdown(post.content || '');
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
      <article class="glass-card-community rounded-3xl overflow-hidden p-4 sm:p-6 border border-white/15 relative transition-all duration-300 hover:border-red-500/30" id="post-${post.id}">
        <!-- Pinned Banner -->
        ${post.is_pinned ? `
          <div class="mb-3.5 sm:mb-4 px-3 sm:px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-red-950/60 to-red-900/30 border border-red-500/40 text-red-200 text-xs font-bold flex items-center space-x-2">
            <span>📌</span>
            <span class="truncate">POST FIXADO PELA ADMINISTRAÇÃO SOBERANA</span>
          </div>` : ''}

        <!-- Post Header -->
        <div class="flex items-start justify-between mb-3.5 sm:mb-4 gap-2">
          <div class="flex items-center space-x-3 sm:space-x-3.5 min-w-0">
            <div class="relative flex-shrink-0">
              <img src="${post.user_avatar}" class="w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-white/20 object-cover ${post.user_role === 'admin' ? 'border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.4)]' : ''}">
              ${post.user_role === 'admin' ? '<span class="absolute -top-1 -right-1 text-xs">👑</span>' : ''}
            </div>
            <div class="min-w-0">
              <div class="flex items-center flex-wrap gap-x-1.5 sm:gap-x-2 gap-y-1">
                <span class="text-xs sm:text-sm font-extrabold text-white truncate max-w-[130px] sm:max-w-none">${safeUserName}</span>
                ${getBadge(post.user_role)}
                <button type="button" onclick="window.appFilterCommunity('${escapeJs(postTagId)}'); event.stopPropagation();"
                  title="Filtrar feed por #${escapeHtml(postTagId)}"
                  class="px-2 py-0.5 rounded-full text-[10px] font-mono border font-bold transition-transform hover:scale-105 active:scale-95 flex items-center space-x-1 cursor-pointer ${tagColorClasses.badge}">
                  <span>${tagIcon}</span>
                  <span class="truncate max-w-[100px] sm:max-w-none">${escapeHtml(tagName)}</span>
                </button>
              </div>
              <span class="text-[10px] sm:text-[11px] text-gray-400 font-mono mt-0.5 block">${formatDate(post.created_at)}</span>
            </div>
          </div>

          <div class="flex items-center space-x-1 flex-shrink-0">
            ${canDel ? `<button onclick="window.appDeletePost('${post.id}')" class="text-xs text-red-400/60 hover:text-red-400 p-2 rounded-xl hover:bg-white/5 active:scale-95 transition-all" title="Excluir post">✕</button>` : ''}
          </div>
        </div>

        <!-- Post Title -->
        ${post.title ? `<h3 class="text-base sm:text-lg font-extrabold text-white mb-2 leading-snug">${safeTitle}</h3>` : ''}

        <!-- Post Content -->
        ${post.content ? `<div class="text-xs sm:text-sm text-gray-200 leading-relaxed mb-3 sm:mb-4 font-normal">${safeContent}</div>` : ''}

        <!-- Sub-Tags & Palavras-chave do Post -->
        ${(() => {
          const postTags = Array.isArray(post.tags) ? post.tags : (post.tag ? [post.tag] : []);
          const secondary = postTags.filter(t => t !== postTagId && t !== post.category && t !== (matchedTag && matchedTag.id));
          if (!secondary.length) return '';
          return `
            <div class="flex flex-wrap items-center gap-1.5 mb-3 sm:mb-4">
              ${secondary.map(st => `
                <button type="button" onclick="window.appSearchCommunity('${escapeJs(st)}'); event.stopPropagation();"
                  class="text-[10px] font-mono text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 px-2.5 py-1 rounded-lg transition-all active:scale-95 flex items-center space-x-1"
                  title="Filtrar posts por #${escapeHtml(st)}">
                  <span class="text-red-400">#</span><span>${escapeHtml(st)}</span>
                </button>
              `).join('')}
            </div>
          `;
        })()}

        <!-- AI PROMPT STUDIO CARD (IF AVAILABLE) -->
        ${post.ai_prompt ? `
          <div class="my-3 sm:my-4 p-3.5 sm:p-4 rounded-2xl bg-black/85 border border-red-500/35 relative overflow-hidden group shadow-inner">
            <div class="flex items-center justify-between pb-2 mb-2 sm:pb-2.5 sm:mb-2.5 border-b border-red-500/20 text-xs font-mono gap-2">
              <span class="text-red-400 font-bold flex items-center space-x-1.5 truncate">
                <span>🔮</span>
                <span class="truncate">MODELO: ${escapeHtml(post.ai_model || 'FLUX / MIDJOURNEY')}</span>
              </span>
              <button onclick="window.appCopyPrompt(this, ${JSON.stringify(post.ai_prompt)})"
                class="px-3 py-1.5 rounded-xl bg-red-950/70 hover:bg-red-900 border border-red-500/50 text-red-200 text-[11px] font-bold transition-all flex items-center space-x-1.5 shadow-md active:scale-95 flex-shrink-0 min-h-[36px]">
                <span>📋</span><span>Copiar Prompt</span>
              </button>
            </div>
            <pre class="text-xs text-gray-200 font-mono whitespace-pre-wrap leading-relaxed select-all bg-white/5 p-2.5 sm:p-3 rounded-xl border border-white/5">${escapeHtml(post.ai_prompt)}</pre>
            ${post.ai_params ? `
              <div class="mt-2.5 pt-2 border-t border-white/10 text-[10px] font-mono text-red-300/80 flex items-center space-x-2">
                <span class="font-bold">⚙️ Flags:</span>
                <span class="text-white/70">${escapeHtml(post.ai_params)}</span>
              </div>` : ''}
          </div>` : ''}

        <!-- Link Preview Card -->
        ${post.link_url ? `
          <a href="${safeLinkUrl}" target="_blank" rel="noopener noreferrer" class="mb-3 sm:mb-4 flex items-center space-x-3 p-3 rounded-2xl bg-white/5 border border-white/10 hover:border-red-500/40 hover:bg-white/10 active:scale-95 transition-all group">
            <div class="w-8 h-8 rounded-xl bg-red-500/20 border border-red-500/30 flex items-center justify-center text-sm flex-shrink-0 text-red-300">🔗</div>
            <div class="min-w-0 flex-1">
              <p class="text-xs font-bold text-white group-hover:text-red-300 transition-colors truncate">${safeLinkTitle}</p>
              <p class="text-[11px] text-graphite truncate">${safeLinkUrl}</p>
            </div>
            <span class="text-white/40 group-hover:text-white text-xs mr-1">↗</span>
          </a>` : ''}

        <!-- Image Gallery with Lightbox -->
        ${post.images?.length ? renderEnhancedImageGrid(post.images, post.title || safeUserName) : ''}

        <!-- Actions Bar -->
        <div class="mt-4 sm:mt-5 pt-3 sm:pt-4 flex items-center justify-between border-t border-white/10">
          <div class="flex items-center space-x-2 sm:space-x-3">
            <button onclick="window.appLikePost('${post.id}')" id="like-btn-${post.id}"
              class="flex items-center space-x-2 text-xs font-bold px-3.5 sm:px-4 py-2 rounded-full border active:scale-95 transition-all min-h-[40px] ${isLiked ? 'bg-red-600 text-white border-red-500 shadow-[0_0_15px_rgba(220,38,38,0.4)]' : 'bg-white/5 text-white/80 border-white/15 hover:bg-white/10'}">
              <span>${isLiked ? '❤️' : '🤍'}</span>
              <span id="like-count-${post.id}">${post.likes || 0}</span>
            </button>

            <button onclick="window.appToggleComments('${post.id}')"
              class="flex items-center space-x-2 text-xs font-bold px-3.5 sm:px-4 py-2 rounded-full border border-white/15 bg-white/5 text-white/80 hover:bg-white/10 active:scale-95 transition-all min-h-[40px]">
              <span>💬</span>
              <span id="comment-count-${post.id}">${cCount}</span>
            </button>
          </div>

          <div class="flex items-center space-x-1.5 sm:space-x-2">
            <button onclick="window.appSharePost('${post.id}')" class="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 active:scale-95 border border-white/10 text-white/70 hover:text-white text-xs transition-all flex items-center justify-center" title="Copiar link do post">
              <span>🔗</span>
            </button>
            <button onclick="window.appBookmarkPost('${post.id}')" class="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 active:scale-95 border border-white/10 text-white/70 hover:text-white text-xs transition-all flex items-center justify-center" title="Salvar publicação">
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
          <div class="flex items-center space-x-2 pt-2">
            <img src="${currentUserAvatarUrl}" class="w-8 h-8 rounded-full border border-white/20 flex-shrink-0">
            <input type="text" id="comment_input_${post.id}" placeholder="Escreva uma resposta..."
              class="flex-1 bg-white/5 border border-white/15 rounded-full px-4 py-2.5 text-base sm:text-xs text-white placeholder-white/30 focus:outline-none focus:border-red-500/50"
              onkeydown="if(event.key==='Enter') window.appAddComment('${post.id}')">
            <button onclick="window.appAddComment('${post.id}')"
              class="px-4 sm:px-5 py-2.5 bg-white text-black font-extrabold text-xs rounded-full hover:bg-gray-200 active:scale-95 transition-all shadow-md min-h-[40px] flex items-center justify-center">
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

    // Category & Tag Selector in Composer (Completo e Reativo)
    window.selectPostCategory = function(cat) {
      communitySelectedCategory = cat;
      const allTags = getCommunityTags();
      const activeTag = allTags.find(t => t.id === cat) || allTags[0];
      const color = activeTag?.color || 'red';
      const colMap = TAG_COLOR_MAP[color] || TAG_COLOR_MAP.red;

      // Atualiza visual de todos os cards da Categoria Principal
      document.querySelectorAll('.post-cat-card').forEach(card => {
        const cId = card.getAttribute('data-tag-id');
        const cColor = card.getAttribute('data-tag-color') || 'red';
        const cardColMap = TAG_COLOR_MAP[cColor] || TAG_COLOR_MAP.red;
        if (cId === cat) {
          card.className = `post-cat-card p-3 rounded-2xl border text-left transition-all active:scale-95 cursor-pointer relative overflow-hidden ${cardColMap.badge} shadow-lg ring-1 ring-white/20`;
          const checkEl = card.querySelector('.cat-check-indicator');
          if (checkEl) checkEl.classList.remove('hidden');
        } else {
          card.className = `post-cat-card p-3 rounded-2xl border text-left transition-all active:scale-95 cursor-pointer relative overflow-hidden bg-white/[0.03] text-gray-400 border-white/10 hover:border-white/25 hover:bg-white/[0.06] hover:text-white`;
          const checkEl = card.querySelector('.cat-check-indicator');
          if (checkEl) checkEl.classList.add('hidden');
        }
      });

      // Atualiza badge de tag ativa no cabeçalho do painel
      const activeBadge = document.getElementById('composerActiveTagBadge');
      if (activeBadge && activeTag) {
        activeBadge.className = `flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold border transition-all ${colMap.badge}`;
        activeBadge.innerHTML = `<span>${activeTag.icon || '🏷️'}</span><span>${escapeHtml(activeTag.name)}</span>`;
      }

      // Atualiza nota descritiva de destino
      const noteEl = document.getElementById('composerTagDestinationNote');
      if (noteEl && activeTag) {
        noteEl.innerHTML = `<span>📍</span><span>Este post será indexado na aba <strong>${escapeHtml(activeTag.name)}</strong> (${activeTag.desc || 'Tópico especializado'}).</span>`;
      }

      window.saveComposerDraft();
      if (communityComposerMode === 'preview') window.updateComposerPreview();
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

    // ────────────────────────────────────────────────────────────────────────
    // SUÍTE DE COMPOSIÇÃO DE POSTS & TAXONOMIA VIP
    // ────────────────────────────────────────────────────────────────────────

    // File Input change & Imagens
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
        const countBadge = document.getElementById('composerImageCountBadge');
        if (countBadge) {
          countBadge.textContent = files.length;
          countBadge.classList.remove('hidden');
        }
        if (previewContainer) {
          previewContainer.classList.remove('hidden');
          previewContainer.innerHTML = files.map((f, idx) => `
            <div class="h-16 sm:h-20 rounded-xl overflow-hidden border border-white/20 bg-black/60 relative group shadow-md">
              <img src="${URL.createObjectURL(f)}" class="w-full h-full object-cover">
              <button type="button" onclick="window.removeUploadFile(${idx})" class="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-600/90 hover:bg-red-500 text-white text-[10px] flex items-center justify-center shadow-lg transition-all" title="Remover imagem">✕</button>
            </div>`).join('');
        }
        if (communityComposerMode === 'preview') window.updateComposerPreview();
      };
    }

    window.removeUploadFile = function(idx) {
      selectedFilesToUpload.splice(idx, 1);
      const previewContainer = document.getElementById('postImageUploadPreview');
      const countBadge = document.getElementById('composerImageCountBadge');
      if (countBadge) {
        if (selectedFilesToUpload.length > 0) {
          countBadge.textContent = selectedFilesToUpload.length;
          countBadge.classList.remove('hidden');
        } else {
          countBadge.classList.add('hidden');
        }
      }
      if (!previewContainer) return;
      if (!selectedFilesToUpload.length) {
        previewContainer.classList.add('hidden');
        previewContainer.innerHTML = '';
      } else {
        previewContainer.innerHTML = selectedFilesToUpload.map((f, i) => `
          <div class="h-16 sm:h-20 rounded-xl overflow-hidden border border-white/20 bg-black/60 relative group shadow-md">
            <img src="${URL.createObjectURL(f)}" class="w-full h-full object-cover">
            <button type="button" onclick="window.removeUploadFile(${i})" class="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-600/90 hover:bg-red-500 text-white text-[10px] flex items-center justify-center shadow-lg transition-all" title="Remover imagem">✕</button>
          </div>`).join('');
      }
      if (communityComposerMode === 'preview') window.updateComposerPreview();
    };

    window.togglePostLink = function() {
      communityLinkBoxOpen = !communityLinkBoxOpen;
      const field = document.getElementById('postLinkField');
      const dot = document.getElementById('composerLinkDot');
      if (field) field.classList.toggle('hidden');
      if (dot) dot.classList.toggle('hidden', !communityLinkBoxOpen);
      if (communityLinkBoxOpen) {
        setTimeout(() => document.getElementById('newPostLinkUrl')?.focus(), 50);
      }
    };

    window.toggleComposerPromptBox = function() {
      communityPromptBoxOpen = !communityPromptBoxOpen;
      const box = document.getElementById('composerPromptBox');
      const dot = document.getElementById('composerPromptDot');
      if (box) box.classList.toggle('hidden');
      if (dot) dot.classList.toggle('hidden', !communityPromptBoxOpen);
      if (communityPromptBoxOpen) {
        setTimeout(() => document.getElementById('newPostPromptCode')?.focus(), 50);
      }
    };

    window.appendPromptParam = function(param) {
      const input = document.getElementById('newPostPromptParams');
      if (!input) return;
      const cur = input.value.trim();
      if (!cur.includes(param)) {
        input.value = cur ? `${cur} ${param}` : param;
      }
      window.handleComposerInput();
    };

    // Formatação de Markdown rápida no textarea
    window.insertMarkdownFormat = function(prefix, suffix) {
      const textarea = document.getElementById('newPostContent');
      if (!textarea) return;
      textarea.focus();
      const start = textarea.selectionStart || 0;
      const end = textarea.selectionEnd || 0;
      const text = textarea.value;
      const selected = text.substring(start, end);
      const replacement = prefix + (selected || 'texto') + suffix;
      textarea.value = text.substring(0, start) + replacement + text.substring(end);
      const newCursor = start + prefix.length + (selected ? selected.length : 'texto'.length);
      textarea.setSelectionRange(newCursor, newCursor);
      window.handleComposerInput();
    };

    window.insertEmoji = function(emoji) {
      const textarea = document.getElementById('newPostContent');
      if (!textarea) return;
      textarea.focus();
      const start = textarea.selectionStart || 0;
      const end = textarea.selectionEnd || 0;
      const text = textarea.value;
      textarea.value = text.substring(0, start) + emoji + text.substring(end);
      const newCursor = start + emoji.length;
      textarea.setSelectionRange(newCursor, newCursor);
      window.handleComposerInput();
    };

    // Sub-tags e Multi-tagging
    window.toggleSubtag = function(tagStr) {
      const clean = tagStr.replace(/^#/, '').trim();
      if (!clean) return;
      const idx = communitySelectedSubtags.indexOf(clean);
      if (idx >= 0) {
        communitySelectedSubtags.splice(idx, 1);
      } else {
        if (communitySelectedSubtags.length >= 6) {
          showToast('⚠️ Limite de 6 sub-tags por publicação atingido.');
          return;
        }
        communitySelectedSubtags.push(clean);
      }
      window.renderSubtagsUI();
      window.saveComposerDraft();
      if (communityComposerMode === 'preview') window.updateComposerPreview();
    };

    window.addCustomSubtag = function() {
      const input = document.getElementById('composerCustomSubtagInput');
      if (!input) return;
      const val = input.value.replace(/^[#\s]+|[#\s]+$/g, '').trim();
      if (!val) return;
      if (communitySelectedSubtags.includes(val)) {
        showToast('ℹ️ Esta sub-tag já foi adicionada.');
        input.value = '';
        return;
      }
      if (communitySelectedSubtags.length >= 6) {
        showToast('⚠️ Limite de 6 sub-tags por publicação atingido.');
        return;
      }
      communitySelectedSubtags.push(val);
      input.value = '';
      window.renderSubtagsUI();
      window.saveComposerDraft();
      if (communityComposerMode === 'preview') window.updateComposerPreview();
    };

    window.removeSubtag = function(val) {
      communitySelectedSubtags = communitySelectedSubtags.filter(s => s !== val);
      window.renderSubtagsUI();
      window.saveComposerDraft();
      if (communityComposerMode === 'preview') window.updateComposerPreview();
    };

    window.renderSubtagsUI = function() {
      const container = document.getElementById('composerSelectedSubtagsList');
      if (!container) return;
      if (!communitySelectedSubtags.length) {
        container.innerHTML = '';
        container.classList.add('hidden');
      } else {
        container.classList.remove('hidden');
        container.innerHTML = communitySelectedSubtags.map(st => `
          <span class="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-white/10 text-white border border-white/20 shadow-sm animate-fade-in">
            <span>#${escapeHtml(st)}</span>
            <button type="button" onclick="window.removeSubtag('${escapeJs(st)}')" class="text-white/60 hover:text-white hover:bg-white/20 rounded-full w-4 h-4 flex items-center justify-center text-[10px] transition-colors">✕</button>
          </span>
        `).join('');
      }

      document.querySelectorAll('.composer-subtag-preset').forEach(btn => {
        const txt = btn.textContent.trim().replace(/^#/, '');
        if (communitySelectedSubtags.includes(txt)) {
          btn.className = 'composer-subtag-preset px-2 py-0.5 rounded-md border text-[11px] font-mono transition-all active:scale-95 bg-red-500/20 text-red-200 border-red-500/40 shadow-sm font-bold';
        } else {
          btn.className = 'composer-subtag-preset px-2 py-0.5 rounded-md border text-[11px] font-mono transition-all active:scale-95 bg-white/5 text-gray-300 border-white/10 hover:border-white/20 hover:text-white';
        }
      });
    };

    // Modo do Composer: Escrever vs Prévia
    window.setComposerMode = function(mode) {
      communityComposerMode = mode;
      const writeArea = document.getElementById('composerWriteArea');
      const previewArea = document.getElementById('composerPreviewArea');
      const toolbar = document.getElementById('composerFormattingToolbar');
      const writeBtn = document.getElementById('composerModeWriteBtn');
      const prevBtn = document.getElementById('composerModePreviewBtn');

      if (mode === 'preview') {
        if (writeArea) writeArea.classList.add('hidden');
        if (toolbar) toolbar.classList.add('hidden');
        if (previewArea) previewArea.classList.remove('hidden');
        if (writeBtn) writeBtn.className = 'px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1.5 text-gray-400 hover:text-white hover:bg-white/5 font-bold';
        if (prevBtn) prevBtn.className = 'px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1.5 bg-white text-black shadow-sm font-bold';
        window.updateComposerPreview();
      } else {
        if (writeArea) writeArea.classList.remove('hidden');
        if (toolbar) toolbar.classList.remove('hidden');
        if (previewArea) previewArea.classList.add('hidden');
        if (writeBtn) writeBtn.className = 'px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1.5 bg-white text-black shadow-sm font-bold';
        if (prevBtn) prevBtn.className = 'px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1.5 text-gray-400 hover:text-white hover:bg-white/5 font-bold';
      }
    };

    window.updateComposerPreview = function() {
      const container = document.getElementById('composerLivePreviewCard');
      if (!container) return;

      const title = document.getElementById('newPostTitle')?.value?.trim() || '';
      const content = document.getElementById('newPostContent')?.value?.trim() || '';
      const promptCode = document.getElementById('newPostPromptCode')?.value?.trim() || '';
      const promptParams = document.getElementById('newPostPromptParams')?.value?.trim() || '';
      const promptModel = document.getElementById('newPostPromptModel')?.value || 'Flux.1 Dev';
      const linkUrl = document.getElementById('newPostLinkUrl')?.value?.trim() || '';
      const linkTitle = document.getElementById('newPostLinkTitle')?.value?.trim() || '';
      const isPinned = document.getElementById('newPostPinnedToggle')?.checked || false;

      const allTags = getCommunityTags();
      const activeTag = allTags.find(t => t.id === communitySelectedCategory) || allTags[0];
      const color = activeTag?.color || 'red';
      const colMap = TAG_COLOR_MAP[color] || TAG_COLOR_MAP.red;

      const formattedHtml = formatMarkdown(content);

      container.innerHTML = `
        <article class="glass-card-community rounded-3xl p-4 sm:p-6 border border-white/15 bg-black/70 relative">
          ${isPinned ? `
            <div class="mb-3.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-red-950/60 to-red-900/30 border border-red-500/40 text-red-200 text-xs font-bold flex items-center space-x-2">
              <span>📌</span><span>POST FIXADO PELA ADMINISTRAÇÃO SOBERANA</span>
            </div>` : ''}

          <div class="flex items-center space-x-3 mb-3.5">
            <div class="relative flex-shrink-0">
              <img src="${currentUserAvatarUrl}" class="w-10 h-10 rounded-full border border-white/20 object-cover ${currentUserRole === 'admin' ? 'border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.4)]' : ''}">
              ${currentUserRole === 'admin' ? '<span class="absolute -top-1 -right-1 text-xs">👑</span>' : ''}
            </div>
            <div>
              <div class="flex items-center flex-wrap gap-1.5">
                <span class="text-xs sm:text-sm font-bold text-white">${escapeHtml(currentUserNameStr)}</span>
                ${getBadge(currentUserRole)}
                <span class="px-2 py-0.5 rounded-full text-[10px] font-mono border font-bold flex items-center space-x-1 ${colMap.badge}">
                  <span>${activeTag.icon || '🏷️'}</span>
                  <span>${escapeHtml(activeTag.name)}</span>
                </span>
              </div>
              <span class="text-[10px] text-gray-400 font-mono">Agora (Pré-visualização)</span>
            </div>
          </div>

          ${title ? `<h3 class="text-base sm:text-lg font-extrabold text-white mb-2 leading-snug">${escapeHtml(title)}</h3>` : ''}

          ${content ? `<div class="text-xs sm:text-sm text-gray-200 leading-relaxed mb-3 font-normal">${formattedHtml}</div>` : '<p class="text-xs text-gray-500 italic mb-3">Nenhum texto inserido ainda.</p>'}

          ${communitySelectedSubtags.length > 0 ? `
            <div class="flex flex-wrap items-center gap-1.5 mb-3">
              ${communitySelectedSubtags.map(st => `<span class="text-[10px] font-mono text-gray-300 bg-white/5 border border-white/10 px-2 py-0.5 rounded-md">#${escapeHtml(st)}</span>`).join('')}
            </div>` : ''}

          ${promptCode ? `
            <div class="my-3 p-3.5 rounded-2xl bg-black/90 border border-red-500/35">
              <div class="flex items-center justify-between pb-2 mb-2 border-b border-red-500/20 text-xs font-mono text-red-400 font-bold">
                <span>🔮 MODELO: ${escapeHtml(promptModel)}</span>
                <span class="text-[10px] text-gray-400">AI Prompt Studio</span>
              </div>
              <pre class="text-xs text-gray-200 font-mono whitespace-pre-wrap select-all bg-white/5 p-2.5 rounded-xl border border-white/5">${escapeHtml(promptCode)}</pre>
              ${promptParams ? `<div class="mt-2 text-[10px] font-mono text-red-300 flex items-center space-x-1.5"><span class="font-bold">⚙️ Flags:</span><span>${escapeHtml(promptParams)}</span></div>` : ''}
            </div>` : ''}

          ${linkUrl ? `
            <div class="mb-3 flex items-center space-x-3 p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs">
              <span class="text-red-300">🔗</span>
              <div class="min-w-0 flex-1">
                <p class="font-bold text-white truncate">${escapeHtml(linkTitle || linkUrl)}</p>
                <p class="text-[10px] text-gray-400 truncate">${escapeHtml(linkUrl)}</p>
              </div>
            </div>` : ''}

          ${selectedFilesToUpload.length > 0 ? `
            <div class="grid grid-cols-3 sm:grid-cols-4 gap-2 my-2">
              ${selectedFilesToUpload.map(f => `<img src="${URL.createObjectURL(f)}" class="h-20 w-full object-cover rounded-xl border border-white/10">`).join('')}
            </div>` : ''}
        </article>
      `;
    };

    // Contador de palavras e caracteres + Salvamento de rascunho
    window.handleComposerInput = function() {
      const content = document.getElementById('newPostContent')?.value || '';
      const charCount = content.length;
      const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;

      const countEl = document.getElementById('composerWordCount');
      if (countEl) countEl.textContent = `${charCount} caracteres • ${wordCount} palavras`;

      window.saveComposerDraft();
      if (communityComposerMode === 'preview') window.updateComposerPreview();
    };

    window.saveComposerDraft = function() {
      try {
        const draft = {
          title: document.getElementById('newPostTitle')?.value || '',
          content: document.getElementById('newPostContent')?.value || '',
          category: communitySelectedCategory,
          subtags: communitySelectedSubtags,
          promptModel: document.getElementById('newPostPromptModel')?.value || 'Flux.1 Dev',
          promptCode: document.getElementById('newPostPromptCode')?.value || '',
          promptParams: document.getElementById('newPostPromptParams')?.value || '',
          linkUrl: document.getElementById('newPostLinkUrl')?.value || '',
          linkTitle: document.getElementById('newPostLinkTitle')?.value || '',
          isPinned: document.getElementById('newPostPinnedToggle')?.checked || false
        };
        localStorage.setItem('mcp_composer_draft', JSON.stringify(draft));
        const ind = document.getElementById('composerDraftIndicator');
        if (ind) {
          ind.classList.remove('opacity-0');
        }
      } catch(e) {}
    };

    window.restoreComposerDraft = function() {
      try {
        const raw = localStorage.getItem('mcp_composer_draft');
        if (!raw) return;
        const draft = JSON.parse(raw);
        if (draft.title && document.getElementById('newPostTitle')) document.getElementById('newPostTitle').value = draft.title;
        if (draft.content && document.getElementById('newPostContent')) {
          document.getElementById('newPostContent').value = draft.content;
          const charCount = draft.content.length;
          const wordCount = draft.content.trim().split(/\s+/).length;
          const countEl = document.getElementById('composerWordCount');
          if (countEl) countEl.textContent = `${charCount} caracteres • ${wordCount} palavras`;
        }
        if (draft.category) communitySelectedCategory = draft.category;
        if (Array.isArray(draft.subtags)) communitySelectedSubtags = draft.subtags;
        if (draft.promptModel && document.getElementById('newPostPromptModel')) document.getElementById('newPostPromptModel').value = draft.promptModel;
        if (draft.promptCode && document.getElementById('newPostPromptCode')) {
          document.getElementById('newPostPromptCode').value = draft.promptCode;
          communityPromptBoxOpen = true;
          document.getElementById('composerPromptBox')?.classList.remove('hidden');
          document.getElementById('composerPromptDot')?.classList.remove('hidden');
        }
        if (draft.promptParams && document.getElementById('newPostPromptParams')) document.getElementById('newPostPromptParams').value = draft.promptParams;
        if (draft.linkUrl && document.getElementById('newPostLinkUrl')) {
          document.getElementById('newPostLinkUrl').value = draft.linkUrl;
          communityLinkBoxOpen = true;
          document.getElementById('postLinkField')?.classList.remove('hidden');
          document.getElementById('composerLinkDot')?.classList.remove('hidden');
        }
        if (draft.linkTitle && document.getElementById('newPostLinkTitle')) document.getElementById('newPostLinkTitle').value = draft.linkTitle;
        if (draft.isPinned && document.getElementById('newPostPinnedToggle')) document.getElementById('newPostPinnedToggle').checked = true;

        window.renderSubtagsUI();
        window.selectPostCategory(communitySelectedCategory);
      } catch(e) {}
    };

    window.clearComposerDraft = function() {
      localStorage.removeItem('mcp_composer_draft');
      if (document.getElementById('newPostTitle')) document.getElementById('newPostTitle').value = '';
      if (document.getElementById('newPostContent')) document.getElementById('newPostContent').value = '';
      if (document.getElementById('newPostPromptCode')) document.getElementById('newPostPromptCode').value = '';
      if (document.getElementById('newPostPromptParams')) document.getElementById('newPostPromptParams').value = '';
      if (document.getElementById('newPostLinkUrl')) document.getElementById('newPostLinkUrl').value = '';
      if (document.getElementById('newPostLinkTitle')) document.getElementById('newPostLinkTitle').value = '';
      if (document.getElementById('newPostPinnedToggle')) document.getElementById('newPostPinnedToggle').checked = false;
      const countEl = document.getElementById('composerWordCount');
      if (countEl) countEl.textContent = '0 caracteres • 0 palavras';
      const ind = document.getElementById('composerDraftIndicator');
      if (ind) ind.classList.add('opacity-0');

      communitySelectedSubtags = [];
      selectedFilesToUpload = [];
      const prev = document.getElementById('postImageUploadPreview');
      if (prev) { prev.classList.add('hidden'); prev.innerHTML = ''; }
      const countBadge = document.getElementById('composerImageCountBadge');
      if (countBadge) countBadge.classList.add('hidden');

      window.renderSubtagsUI();
      window.selectPostCategory(getCommunityTags()[0]?.id || 'prompts');
      window.setComposerMode('write');
      showToast('🗑️ Rascunho limpo com sucesso.');
    };

    function saveLocalCommunityPosts() {
      try {
        localStorage.setItem('mcp_local_community_posts', JSON.stringify(communityPosts));
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
      const isPinned = currentUserRole === 'admin' ? (document.getElementById('newPostPinnedToggle')?.checked || false) : false;
      const btn = document.getElementById('submitPostBtn');

      if (!content && !title && !promptCode && !selectedFilesToUpload.length) {
        showToast('⚠️ Escreva um texto, prompt ou selecione imagens para publicar.');
        return;
      }

      if (btn) { btn.innerHTML = '<span>Enviando...</span><span class="animate-spin">⏳</span>'; btn.disabled = true; }

      let uploadedImageUrls = [];
      if (selectedFilesToUpload.length > 0) {
        for (const file of selectedFilesToUpload) {
          const url = await uploadFileToSupabase(file, 'community-media');
          if (url) uploadedImageUrls.push(url);
          else uploadedImageUrls.push(URL.createObjectURL(file));
        }
      }

      // Constrói array completo de tags (Categoria Primária + Sub-tags)
      const combinedTags = [communitySelectedCategory || 'prompts'];
      (communitySelectedSubtags || []).forEach(st => {
        const clean = st.replace(/^#/, '').trim();
        if (clean && !combinedTags.includes(clean)) combinedTags.push(clean);
      });

      const newPostId = 'post_' + Date.now();
      const newPostObj = {
        id: newPostId,
        user_id: currentUserId,
        user_name: currentUserNameStr || 'Membro VIP',
        user_avatar: currentUserAvatarUrl || USER_ROLES.free.avatar,
        user_role: currentUserRole,
        category: communitySelectedCategory || 'prompts',
        tag: communitySelectedCategory || 'prompts',
        tags: combinedTags,
        title: title || '',
        content: content || '',
        ai_prompt: promptCode || '',
        ai_params: promptParams || '',
        ai_model: promptCode ? promptModel : '',
        link_url: link_url || '',
        link_title: link_title || '',
        images: uploadedImageUrls.length > 0 ? uploadedImageUrls : [],
        is_pinned: isPinned,
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
            images: uploadedImageUrls.length > 0 ? uploadedImageUrls : null,
            is_pinned: isPinned,
            category: communitySelectedCategory || 'prompts',
            tag: communitySelectedCategory || 'prompts'
          });
        } catch(sbPostErr) {
          console.warn('[A.I VISUALS] Post salvo localmente:', sbPostErr.message);
        }
      }

      communityPosts.unshift(newPostObj);
      saveLocalCommunityPosts();

      // Limpeza de estado e rascunho
      localStorage.removeItem('mcp_composer_draft');
      selectedFilesToUpload = [];
      communitySelectedSubtags = [];
      communityPromptBoxOpen = false;
      communityLinkBoxOpen = false;
      communityComposerMode = 'write';

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

    // Restaura rascunho salvo do composer e inicializa atalhos de teclado
    setTimeout(() => {
      window.restoreComposerDraft();
    }, 40);

    // Atalho global Cmd+Enter ou Ctrl+Enter para publicar direto do composer
    if (!window._composerKeyboardListenerAttached) {
      window._composerKeyboardListenerAttached = true;
      document.addEventListener('keydown', (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
          const contentEl = document.getElementById('newPostContent');
          const titleEl = document.getElementById('newPostTitle');
          const activeEl = document.activeElement;
          if (activeEl === contentEl || activeEl === titleEl || activeEl?.id === 'newPostPromptCode' || activeEl?.id === 'newPostPromptParams') {
            e.preventDefault();
            window.appCreatePost();
          }
        }
      });
    }
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

        <div class="flex flex-col lg:grid lg:grid-cols-4 gap-6">
          <!-- MAIN VIEWER (NO TOPO NO MOBILE, DIREITA NO DESKTOP) -->
          <div class="order-1 lg:order-2 lg:col-span-3 space-y-5">
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
                <div class="glass-card rounded-3xl p-6 sm:p-12 text-center space-y-3">
                  <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-xl sm:text-2xl">📄</div>
                  <h3 class="text-sm sm:text-base font-bold text-white">Artigo Técnico de Treinamento</h3>
                  <p class="text-graphite text-xs max-w-md mx-auto leading-relaxed">Esta aula contém diretrizes completas em texto, prompts detalhados e materiais para estudo prático.</p>
                </div>`}

              <!-- Barra Ergonômica de Navegação Rápida entre Aulas (Thumb Zone) -->
              <div class="flex items-center justify-between gap-2 p-3 rounded-2xl bg-white/[0.04] border border-white/10">
                ${prev ? `
                  <button onclick="window.appGoServerDetail('${srv.id}','${prev.id}')" class="px-3 sm:px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-white text-xs font-bold transition-all flex items-center gap-1.5 min-h-[40px]">
                    <span>←</span><span class="truncate max-w-[100px] sm:max-w-none">Anterior</span>
                  </button>
                ` : `<span class="text-[11px] text-white/30 px-2 py-2">Primeira aula</span>`}

                <span class="text-[11px] font-mono text-white/50 text-center">Aula ${lesIdx + 1} de ${lessons.length}</span>

                ${next ? `
                  <button onclick="window.appGoServerDetail('${srv.id}','${next.id}')" class="px-3 sm:px-4 py-2 rounded-xl bg-white text-black hover:bg-white/90 active:scale-95 text-xs font-bold transition-all flex items-center gap-1.5 min-h-[40px] shadow-md">
                    <span class="truncate max-w-[100px] sm:max-w-none">Próxima</span><span>→</span>
                  </button>
                ` : `<span class="text-[11px] text-emerald-400 font-bold px-2 py-2">Última aula 🎉</span>`}
              </div>

              <!-- Materiais & Recursos para Download (Skool Resources Box) -->
              ${lesson.resources && lesson.resources.length > 0 ? `
                <div class="glass-card rounded-3xl p-4 sm:p-6 space-y-3 border-emerald-500/20 bg-emerald-950/10 shadow-lg">
                  <div class="flex items-center justify-between pb-2 border-b border-white/10">
                    <h3 class="text-xs font-bold uppercase tracking-wider text-emerald-300 flex items-center space-x-2">
                      <span>📎 Materiais de Apoio & Downloads (${lesson.resources.length})</span>
                    </h3>
                    <span class="text-[0.65rem] text-white/40">Anexos desta aula</span>
                  </div>
                  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3">
                    ${lesson.resources.map(res => `
                      <a href="${escapeHtml(res.url)}" target="_blank" rel="noopener noreferrer" class="p-3 sm:p-3.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] active:scale-95 border border-white/10 hover:border-emerald-500/40 transition-all flex items-center justify-between group shadow-sm">
                        <div class="flex items-center space-x-3 min-w-0">
                          <span class="text-lg sm:text-xl flex-shrink-0">${typeIcons[res.type] || '📎'}</span>
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
              <div class="glass-card rounded-3xl p-4 sm:p-8 space-y-4">
                <div class="flex items-center justify-between flex-wrap gap-2 pb-4 border-b border-white/10">
                  <div class="space-y-0.5 min-w-0 flex-1">
                    <span class="text-[0.65rem] font-bold uppercase tracking-wider text-white/50">${escapeHtml(lesson.module)}</span>
                    <h2 class="text-base sm:text-xl font-bold text-white truncate">${escapeHtml(lesson.title)}</h2>
                  </div>
                  <div class="flex items-center space-x-2 flex-shrink-0">
                    <button onclick="window.toggleCompleteLesson('${lesson.id}')" class="px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 active:scale-95 min-h-[40px] ${isCurrentLessonCompleted ? 'bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.4)]' : 'bg-white/10 hover:bg-white/20 text-white border border-white/15'}">
                      <span>${isCurrentLessonCompleted ? '✓ Concluída' : 'Marcar como Concluída'}</span>
                    </button>
                    ${(currentUserRole==='admin'||currentUserRole==='moderator') ? `
                      <button onclick="window.appOpenLessonEditorModal('${srv.id}', '${lesson.id}')" class="px-3 sm:px-3.5 py-2 bg-white/15 hover:bg-white/25 border border-white/20 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center space-x-1.5 min-h-[40px] active:scale-95" title="Editar Aula no Skool Studio">
                        <span>✏️</span>
                      </button>` : ''}
                  </div>
                </div>

                <div class="prose prose-invert max-w-none leading-relaxed text-gray-200 text-sm sm:text-base">
                  ${renderMarkdown(lesson.cleanContent || lesson.content_markdown || '')}
                </div>
              </div>
            ` : ''}
          </div>

          <!-- LESSON SIDEBAR (ABAIXO NO MOBILE, ESQUERDA NO DESKTOP) -->
          <div class="order-2 lg:order-1 lg:col-span-1">
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
                              <button type="button" onclick="event.stopPropagation(); window.toggleCompleteLesson('${l.id}')" title="${isCompleted ? 'Desmarcar conclusão' : 'Marcar como concluída'}" class="w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 transition-all ${isCompleted ? 'bg-emerald-500 border-emerald-400 text-black text-[0.65rem] font-bold' : 'border-white/30 hover:border-white text-transparent'}">
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
      <section class="py-6 sm:py-10 px-3 sm:px-6 lg:px-8 max-w-[860px] mx-auto relative z-10">

        <!-- PROFILE CARD -->
        <div class="glass-card rounded-3xl overflow-hidden mb-6">
          <div class="h-28 bg-white/10 relative"></div>
          <div class="px-5 sm:px-6 pb-7 relative">
            <div class="flex items-end justify-between -mt-10 mb-5">
              <div class="relative group cursor-pointer" onclick="document.getElementById('profileAvatarInput').click()">
                <img id="profileBigAvatar" src="${currentUserAvatarUrl}" class="w-20 h-20 rounded-full border-4 border-black shadow-2xl object-cover">
                <div class="absolute inset-0 rounded-full bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span class="text-white text-xs font-bold">Upload 📷</span>
                </div>
              </div>
              <button onclick="window.appSaveProfile()" class="px-5 py-2.5 min-h-[44px] flex items-center justify-center rounded-full font-bold bg-white text-black text-xs shadow-xl hover:scale-105 active:scale-95 transition-all">
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
                  class="w-full bg-white/5 border border-white/10 rounded-2xl p-3 text-base sm:text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/30 resize-none">${currentUserProfile?.bio||''}</textarea>
              </div>
            </div>
          </div>
        </div>

        <!-- MERCADO PAGO STATUS -->
        <div class="glass-card rounded-3xl p-5 sm:p-6 mb-6">
          <h3 class="text-sm font-bold text-white mb-2">💳 Gateway Mercado Pago</h3>
          <p class="text-xs text-graphite mb-2">Os pagamentos são processados com segurança diretamente pelo backend oficial.</p>
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Checkout Pro & Pix Ativos
          </span>
        </div>

        <!-- ACCOUNT LOGOUT -->
        <div class="glass-card rounded-3xl p-5 sm:p-6">
          <h3 class="text-sm font-bold text-red-400 mb-3">⚙️ Gerenciar Conta</h3>
          <button onclick="window.appLogout()" class="px-5 py-2.5 min-h-[44px] flex items-center justify-center bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl text-xs font-bold active:scale-95 transition-all">Sair da Conta</button>
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
      localStorage.removeItem('mp_access_token');
      localStorage.removeItem('mp_public_key');
      showToast('ℹ️ O Mercado Pago é gerenciado com segurança nas variáveis de ambiente do servidor.');
    };

    window.appLogout = async () => {
      try {
        localStorage.removeItem('mcp_session_user');
        localStorage.removeItem('mcp_auth_token');
        localStorage.removeItem('mp_access_token');
        localStorage.removeItem('mp_public_key');
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
    toastMessage.textContent = msg.replace(/^[✅❌ℹ️👑🔑🛡️📋🔗🔖]\s*/, '');
    toast.style.borderColor = borderColor;
    toast.style.zIndex = '100001';

    toast.classList.remove('opacity-0', 'scale-95', 'translate-y-4', 'translate-y-[200%]');
    toast.classList.add('opacity-100', 'scale-100', 'translate-y-0');
    toast.style.pointerEvents = 'none';
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('opacity-100', 'scale-100', 'translate-y-0');
      toast.classList.add('opacity-0', 'scale-95', 'translate-y-4');
    }, 2800);
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
    const hasAdminAccess = currentUserRole === 'admin';
    if (!isLoggedIn || !hasAdminAccess) {
      showToast('⚠️ Acesso restrito exclusivamente a Administradores.');
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
  window.appGoCommunity = navigateToCommunity;
  window.appGoServers = navigateToServers;
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

      const countToday = profiles.filter(p => p.created_at && p.created_at.startsWith(todayStr)).length;
      const count7d    = profiles.filter(p => p.created_at && new Date(p.created_at) >= d7).length;
      const count30d   = profiles.filter(p => p.created_at && new Date(p.created_at) >= d30).length;
      const countTotal = profiles.length;

      const freeMembers = profiles.filter(p => p.role === 'free' || !p.role).length;
      const paidMembers = profiles.filter(p => ['level_0','level_1','level_2','full','admin'].includes(p.role)).length;

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

      if (profiles.length === 0 && isLoggedIn && currentUserId) {
        profiles = [
          { id: currentUserId, name: currentUserNameStr || 'Administrador Demo', email: currentUserEmailStr || 'admin@demo.local', role: currentUserRole || 'admin', created_at: new Date().toISOString() }
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
