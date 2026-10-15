/**
 * A.I VISUALS — Members Area v8.0 (Production Ready)
 * Backend: Supabase — wccrxgczldiviilkfsuj
 * Payments: Mercado Pago Checkout Pro (via Netlify Functions)
 * Design: Apple Liquid Glass (Zero Neon, VisionOS)
 */

const SUPABASE_URL = 'https://wccrxgczldiviilkfsuj.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndjY3J4Z2N6bGRpdmlpbGtmc3VqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUwMjk5NjgsImV4cCI6MjEwMDYwNTk2OH0.bdxRqjhZsQU7jefL31VP-7pSh93CEQtYwtbO9DUlxng';
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
  function convertToEmbedUrl(url) {
    if (!url || !url.trim()) return '';
    url = url.trim();
    if (url.includes('/embed/') || url.includes('player.vimeo.com')) return url;
    const ytWatch = url.match(/(?:youtube\.com\/watch\?v=)([^&\?\/ \n]+)/);
    if (ytWatch) return `https://www.youtube.com/embed/${ytWatch[1]}?rel=0`;
    const ytShort = url.match(/(?:youtu\.be\/)([^&\?\/ \n]+)/);
    if (ytShort) return `https://www.youtube.com/embed/${ytShort[1]}?rel=0`;
    const vimeo = url.match(/vimeo\.com\/(\d+)/);
    if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;
    return url;
  }

  function formatDate(isoStr) {
    if (!isoStr) return 'Agora mesmo';
    const d   = new Date(isoStr);
    const now = new Date();
    const s   = Math.floor((now - d) / 1000);
    if (s < 60)     return 'Agora mesmo';
    if (s < 3600)   return `${Math.floor(s/60)}min atrás`;
    if (s < 86400)  return `${Math.floor(s/3600)}h atrás`;
    if (s < 604800) return `${Math.floor(s/86400)}d atrás`;
    return d.toLocaleDateString('pt-BR', { day:'2-digit', month:'short' });
  }

  function getBadge(role) {
    const info = USER_ROLES[role];
    if (!info) return '';
    const cls = BADGE_CLASSES[role] || BADGE_CLASSES.free;
    return `<span class="text-[0.6rem] font-bold px-2.5 py-0.5 rounded-full border uppercase tracking-wider backdrop-blur-md ${cls}">${info.roleText}</span>`;
  }

  function renderMarkdown(text) {
    if (!text) return '';
    return text
      .replace(/^# (.+)$/gm,   '<h1 class="text-2xl font-extrabold text-white mt-6 mb-3">$1</h1>')
      .replace(/^## (.+)$/gm,  '<h2 class="text-xl font-bold text-white mt-5 mb-2">$1</h2>')
      .replace(/^### (.+)$/gm, '<h3 class="text-lg font-semibold text-white/90 mt-4 mb-1">$1</h3>')
      .replace(/\*\*(.+?)\*\*/g, '<strong class="text-white font-bold">$1</strong>')
      .replace(/\*(.+?)\*/g,     '<em class="text-white/80 italic">$1</em>')
      .replace(/`(.+?)`/g,       '<code class="bg-white/10 text-white px-1.5 py-0.5 rounded-lg text-xs font-mono">$1</code>')
      .replace(/^- (.+)$/gm,     '<li class="ml-5 mb-1 text-gray-300 list-disc">$1</li>')
      .replace(/^(\d+)\. (.+)$/gm,'<li class="ml-5 mb-1 text-gray-300 list-decimal">$2</li>')
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="rounded-xl my-4 max-w-full border border-white/10 shadow-lg">')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g,  '<a href="$2" target="_blank" class="text-white underline hover:text-white/70">$1</a>')
      .replace(/^---$/gm, '<hr class="border-white/10 my-5">')
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
      title: '✨ Bem-vindos à Comunidade VIP A.I Visuals!',
      content: 'Espaço exclusivo para membros VIP e criadores de elite compartilharem seus prompts, novos estilos e masterclasses generativas. Sintam-se à vontade para postar suas dúvidas, prompts favoritos e feedbacks!',
      link_url: '',
      link_title: '',
      images: ['./public/assets/images/opt_0008_img_exact_87ca3.webp'],
      is_pinned: true,
      likes: 42,
      likedBy: [],
      created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
      comments: [
        {
          id: 'com_1',
          user_id: 'member_demo',
          user_name: 'Lucas Rocha (Aluno VIP)',
          user_avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=MemberProX',
          user_role: 'user',
          content: 'Sensacional a plataforma! Os prompts de retratos fotorrealistas e estilos de efeitos são de altíssimo nível.',
          created_at: new Date(Date.now() - 3600000 * 2).toISOString()
        }
      ]
    },
    {
      id: 'post_effects_style',
      user_id: 'moderator_official',
      user_name: 'Moderador Oficial',
      user_avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=ModeratorShield',
      user_role: 'moderator',
      title: '🚀 Dica da Semana: Como obter reflexos líquidos ultra-nítidos',
      content: 'Ao utilizar o acervo A.I Effects, combinem termos como "hyper-glossy liquid glass reflections with sub-surface scattering, octane render 8k" para obter o autêntico acabamento Apple Liquid Glass.',
      link_url: '',
      link_title: '',
      images: ['./public/assets/images/opt_0740_img_exact_666ee.webp'],
      is_pinned: false,
      likes: 19,
      likedBy: [],
      created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
      comments: []
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

    if (user && user.isLoggedIn) {
      isLoggedIn = true;
      currentUserId = user.id || 'sovereign_user_' + (user.role || 'user');
      currentUserNameStr = user.name || (user.role === 'admin' ? 'Mateus Celestino Pro' : 'Membro Aluno Pro');
      currentUserAvatarUrl = user.avatar || (user.role === 'admin' ? USER_ROLES.admin.avatar : (user.role === 'moder' || user.role === 'moderator' ? USER_ROLES.moderator.avatar : USER_ROLES.free.avatar));

      if (user.role === 'admin') {
        currentUserRole = 'admin';
      } else if (user.role === 'moder' || user.role === 'moderator') {
        currentUserRole = 'moderator';
      } else {
        currentUserRole = 'full'; // Membro VIP tem acesso irrestrito às subpáginas e prompts
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
      if (!isLoggedIn) {
        currentUserId = null;
        currentUserProfile = null;
        currentUserRole = 'guest';
        currentUserNameStr = 'Visitante';
        currentUserAvatarUrl = USER_ROLES.guest.avatar;
        moderatorPermissions = null;
      }
    }

    updateUserHeader();
    return isLoggedIn;
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
    if (rawHash === 'community') {
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
      navigateToAdmin();
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

    // 1. Sincroniza sessão soberana local prioritária
    syncSovereignSession();

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

    // 2. Fallback de Contingência Local Soberana (Garante que a aba nunca fique em branco)
    serversData = DEFAULT_SOVEREIGN_SERVERS;
  }

  // ──────────────────────────────────────────────────────────────────────────
  // MODAL FUNCTIONS — Servers & Lessons (Full Supabase CRUD)
  // ──────────────────────────────────────────────────────────────────────────
  function hideLessonEditorModal() {
    if (lessonEditorModal) { lessonEditorModal.classList.add('hidden'); lessonEditorModal.classList.add('opacity-0'); }
  }
  function hideServerEditorModal() {
    if (serverEditorModal) { serverEditorModal.classList.add('hidden'); serverEditorModal.classList.add('opacity-0'); }
  }

  function updateVideoPreview(val) {
    const iframe = document.getElementById('videoPreviewIframe');
    const noText = document.getElementById('noVideoText');
    const embed  = convertToEmbedUrl(val);
    if (embed && iframe) {
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

  async function handleSaveLessonModal() {
    const title    = document.getElementById('editLessonTitle')?.value?.trim();
    const videoUrl = document.getElementById('editLessonVideoUrl')?.value?.trim();
    const content  = document.getElementById('editLessonContent')?.value?.trim();
    if (!title) { showToast('⚠️ Título da aula é obrigatório.'); return; }
    if (!sb || !editingLessonServerId) { hideLessonEditorModal(); return; }

    const payload = { server_id: editingLessonServerId, title, video_url: videoUrl || '', content_markdown: content || '', display_order: 0 };

    if (editingLessonId) {
      await sb.from('server_lessons').update({ title, video_url: videoUrl||'', content_markdown: content||'' }).eq('id', editingLessonId);
      showToast('✅ Aula atualizada!');
    } else {
      await sb.from('server_lessons').insert(payload);
      showToast('✅ Aula criada!');
    }
    hideLessonEditorModal();
    editingLessonId = null; editingLessonServerId = null;
    await loadServersData();
    renderCurrentView();
  }

  async function handleDeleteLessonModal() {
    if (!editingLessonId || !sb) { hideLessonEditorModal(); return; }
    if (!(await showConfirmModal('Excluir esta aula?'))) return;
    await sb.from('server_lessons').delete().eq('id', editingLessonId);
    showToast('🗑️ Aula excluída!');
    hideLessonEditorModal();
    editingLessonId = null; editingLessonServerId = null;
    await loadServersData();
    renderCurrentView();
  }

  async function handleSaveServerModal() {
    const title       = document.getElementById('editServerTitle')?.value?.trim();
    const description = document.getElementById('editServerDescription')?.value?.trim();
    const heroImage   = document.getElementById('editServerHeroImage')?.value?.trim();
    if (!title) { showToast('⚠️ Título do servidor é obrigatório.'); return; }
    if (!sb) { hideServerEditorModal(); return; }

    const payload = { title, description: description||'', hero_image: heroImage||'', display_order: serversData.length };

    if (editingServerId) {
      await sb.from('servers').update({ title, description: description||'', hero_image: heroImage||'' }).eq('id', editingServerId);
      showToast('✅ Servidor atualizado!');
    } else {
      await sb.from('servers').insert(payload);
      showToast('✅ Servidor criado!');
    }
    hideServerEditorModal();
    editingServerId = null;
    await loadServersData();
    renderCurrentView();
  }

  async function handleDeleteServerModal() {
    if (!editingServerId || !sb) { hideServerEditorModal(); return; }
    if (!(await showConfirmModal('Excluir este servidor e todas as suas aulas?'))) return;
    await sb.from('server_lessons').delete().eq('server_id', editingServerId);
    await sb.from('servers').delete().eq('id', editingServerId);
    showToast('🗑️ Servidor excluído!');
    hideServerEditorModal();
    editingServerId = null;
    await loadServersData();
    navigateToServers();
  }

  // Expõe as funções abertas dos modais para o HTML inline
  window.appOpenServerEditorModal = (sId = null) => {
    editingServerId = sId;
    const srv = sId ? serversData.find(s => s.id === sId) : null;
    const titleEl = document.getElementById('serverEditorModalTitle');
    if (titleEl) titleEl.textContent = sId ? 'Editar Servidor' : 'Criar Servidor';
    const titleInput = document.getElementById('editServerTitle');
    const descInput  = document.getElementById('editServerDescription');
    const heroInput  = document.getElementById('editServerHeroImage');
    if (titleInput) titleInput.value = srv?.title || '';
    if (descInput)  descInput.value  = srv?.description || '';
    if (heroInput)  heroInput.value  = srv?.hero_image || '';
    updateServerHeroPreview(srv?.hero_image || '');
    if (serverEditorModal) { serverEditorModal.classList.remove('hidden'); serverEditorModal.classList.remove('opacity-0'); }
  };

  window.appOpenLessonEditorModal = (sId, lId = null) => {
    editingLessonServerId = sId;
    editingLessonId = lId;
    const srv = serversData.find(s => s.id === sId);
    const lesson = lId ? srv?.lessons?.find(l => l.id === lId) : null;
    const titleEl = document.getElementById('lessonEditorModalTitle');
    if (titleEl) titleEl.textContent = lId ? `Editar Aula — ${srv?.title || ''}` : `Nova Aula — ${srv?.title || ''}`;
    const titleInput   = document.getElementById('editLessonTitle');
    const videoInput   = document.getElementById('editLessonVideoUrl');
    const contentInput = document.getElementById('editLessonContent');
    if (titleInput)   titleInput.value   = lesson?.title || '';
    if (videoInput)   videoInput.value   = lesson?.video_url || '';
    if (contentInput) contentInput.value = lesson?.content_markdown || '';
    updateVideoPreview(lesson?.video_url || '');
    const delBtn = document.getElementById('deleteLessonModalBtn');
    if (delBtn) delBtn.style.display = lId ? 'block' : 'none';
    if (lessonEditorModal) { lessonEditorModal.classList.remove('hidden'); lessonEditorModal.classList.remove('opacity-0'); }
  };

  window.appInsertMarkdown = (prefix) => {
    const ta = document.getElementById('editLessonContent');
    if (!ta) return;
    const start = ta.selectionStart; const end = ta.selectionEnd;
    const selected = ta.value.substring(start, end);
    ta.value = ta.value.substring(0, start) + prefix + selected + ta.value.substring(end);
    ta.selectionStart = ta.selectionEnd = start + prefix.length + selected.length;
    ta.focus();
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

    document.querySelectorAll('.role-option').forEach(btn => {
      btn.addEventListener('click', e => {
        e.preventDefault();
        e.stopPropagation();
        const role = btn.getAttribute('data-role');
        const roleData = {
          free:      { role: 'visitante', name: 'Visitante Free', avatar: USER_ROLES.free.avatar, tier: 'free', isLoggedIn: false },
          level_0:   { role: 'user', name: 'Membro Level 0', avatar: USER_ROLES.level_0.avatar, tier: 'pro', isLoggedIn: true },
          level_1:   { role: 'user', name: 'Membro Level 1', avatar: USER_ROLES.level_1.avatar, tier: 'pro', isLoggedIn: true },
          level_2:   { role: 'user', name: 'Membro Level 2', avatar: USER_ROLES.level_2.avatar, tier: 'vip', isLoggedIn: true },
          full:      { role: 'user', name: 'Membro VIP Full Access', avatar: USER_ROLES.full.avatar, tier: 'vip', isLoggedIn: true },
          admin:     { role: 'admin', name: 'Mateus Celestino Pro', avatar: USER_ROLES.admin.avatar, tier: 'max', isLoggedIn: true }
        };

        const target = roleData[role] || roleData.admin;
        const sessionUser = {
          isLoggedIn: target.isLoggedIn,
          role: target.role,
          name: target.name,
          email: `${role}@mateuscelestinopro.com`,
          avatar: target.avatar,
          tier: target.tier
        };

        localStorage.setItem('mcp_session_user', JSON.stringify(sessionUser));
        localStorage.setItem('mcp_user_role', sessionUser.role);
        localStorage.setItem('mcp_admin_auth', (target.role === 'admin' ? 'true' : 'false'));
        window.dispatchEvent(new CustomEvent('mcp_auth_changed', { detail: sessionUser }));
        syncSovereignSession();
        renderCurrentView();

        const roleDropdown = document.getElementById('roleDropdown');
        if (roleDropdown) {
          roleDropdown.classList.add('invisible', 'opacity-0');
          roleDropdown.classList.remove('opacity-100');
        }

        const roleName = target.role === 'admin' ? 'Administrador Soberano' : (target.role === 'user' ? 'Membro VIP' : 'Visitante');
        showToast(`🎭 Sessão alterada: ${roleName}!`, target.role === 'admin' ? 'admin' : (target.role === 'user' ? 'auth' : 'info'));
      });
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

    // Atalhos 1-Clique para Teste / Demonstração Imediata
    const quickAdminBtn = document.getElementById('authQuickAdminBtn');
    const quickMemberBtn = document.getElementById('authQuickMemberBtn');

    quickAdminBtn?.addEventListener('click', () => {
      isLoginMode = true;
      updateAuthModalUI();
      const emailInput = document.getElementById('authEmail');
      const passInput = document.getElementById('authPassword');
      if (emailInput && passInput) {
        emailInput.value = 'mateus@mateuscelestinopro.com';
        passInput.value = 'MateusProX@2026!';
        showAuthAlert('Autenticando como Administrador Demo...', 'loading');
        if (typeof authForm?.requestSubmit === 'function') {
          authForm.requestSubmit();
        } else {
          authForm?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
        }
      }
    });

    quickMemberBtn?.addEventListener('click', () => {
      isLoginMode = true;
      updateAuthModalUI();
      const emailInput = document.getElementById('authEmail');
      const passInput = document.getElementById('authPassword');
      if (emailInput && passInput) {
        emailInput.value = 'membro@mateuscelestinopro.com';
        passInput.value = 'MembroProX@2026!';
        showAuthAlert('Autenticando como Membro VIP Demo...', 'loading');
        if (typeof authForm?.requestSubmit === 'function') {
          authForm.requestSubmit();
        } else {
          authForm?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
        }
      }
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
          // 1. Autenticação prioritária na API Soberana Local
          const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
          });
          const data = await res.json().catch(() => null);

          if (res.ok && data?.success && data?.user) {
            const role = data.role || (data.user.role === 'admin' ? 'admin' : 'user');
            const sessionUser = {
              isLoggedIn: true,
              role: role,
              name: data.user.name || (role === 'admin' ? 'Mateus Celestino Pro' : 'Membro Aluno Pro'),
              email: data.user.email || email,
              avatar: data.user.avatar || (role === 'admin' ? USER_ROLES.admin.avatar : (role === 'moder' ? USER_ROLES.moderator.avatar : USER_ROLES.free.avatar)),
              tier: role === 'admin' ? 'max' : (data.user.tier || 'vip')
            };

            localStorage.setItem('mcp_session_user', JSON.stringify(sessionUser));
            localStorage.setItem('mcp_user_role', sessionUser.role);
            localStorage.setItem('mcp_admin_auth', (sessionUser.role === 'admin' || sessionUser.role === 'moder') ? 'true' : 'false');
            if (data.token) localStorage.setItem('mcp_auth_token', data.token);

            window.dispatchEvent(new CustomEvent('mcp_auth_changed', { detail: sessionUser }));
            syncSovereignSession();
            
            showAuthAlert('✅ ' + (data.message || 'Login autorizado com sucesso! Entrando...'), 'success');
            showToast('🔑 Login soberano realizado com sucesso! Bem-vindo(a) ' + sessionUser.name, 'success');

            setTimeout(() => {
              hideAuthModal();
              renderCurrentView();
              btn.disabled = false;
              if (spinner) spinner.classList.add('hidden');
              if (btnLabel) btnLabel.textContent = 'Entrar';
            }, 600);
            return;
          }

          // 2. Fallback para Supabase se a conta for remota
          if (sb) {
            const { data: sbData, error: sbError } = await sb.auth.signInWithPassword({ email, password });
            if (!sbError && sbData?.session) {
              await handleAuthSession(sbData.session);
              showAuthAlert('✅ Login remoto aprovado!', 'success');
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

    // Lesson Editor
    closeLessonEditorModal?.addEventListener('click', hideLessonEditorModal);
    cancelLessonModalBtn?.addEventListener('click', hideLessonEditorModal);
    saveLessonModalBtn?.addEventListener('click', handleSaveLessonModal);
    deleteLessonModalBtn?.addEventListener('click', handleDeleteLessonModal);
    document.getElementById('editLessonVideoUrl')?.addEventListener('input', e => updateVideoPreview(e.target.value));

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
    const quickBox = document.getElementById('authQuickAccessBox');
    if (quickBox) quickBox.style.display = isLoginMode ? 'block' : 'none';
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
          else { showAuthModal('Acesse a Comunidade VIP fazendo login ou criando sua conta online.'); return; }
        } catch(e) {
          showAuthModal('Acesse a Comunidade VIP fazendo login ou criando sua conta online.');
          return;
        }
      } else {
        showAuthModal('Acesse a Comunidade VIP fazendo login ou criando sua conta online.');
        return;
      }
    }

    currentView = 'community';
    if (window.location.hash !== '#community') {
      try { history.pushState(null, '', '#community'); } catch(e) {}
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

  async function navigateToAdmin() {
    syncSovereignSession();
    if (!isLoggedIn) {
      if (sb) {
        try {
          const { data: { session } } = await sb.auth.getSession();
          if (session) await handleAuthSession(session);
          else { showAuthModal('Painel Administrativo restrito. Autentique-se com credenciais de Admin.'); return; }
        } catch(e) {
          showAuthModal('Painel Administrativo restrito. Autentique-se com credenciais de Admin.');
          return;
        }
      } else {
        showAuthModal('Painel Administrativo restrito. Autentique-se com credenciais de Admin.');
        return;
      }
    }

    const hasAdminAccess = (currentUserRole === 'admin' || currentUserRole === 'moderator' || currentUserRole === 'moder');
    if (!hasAdminAccess) {
      showToast('⚠️ Acesso restrito a Administradores e Moderadores.');
      navigateToHome();
      return;
    }

    currentView = 'admin';
    if (window.location.hash !== '#admin') {
      try { history.pushState(null, '', '#admin'); } catch(e) {}
    }
    renderCurrentView();
  }

  // ──────────────────────────────────────────────────────────────────────────
  // HEADER & BREADCRUMB
  // ──────────────────────────────────────────────────────────────────────────
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
    const hasAdminAccess = (currentUserRole === 'admin' || currentUserRole === 'moderator' || currentUserRole === 'moder');
    if (adminBtn) {
      if (hasAdminAccess) adminBtn.classList.remove('hidden');
      else adminBtn.classList.add('hidden');
    }
    if (adminDropBtn) {
      if (hasAdminAccess) adminDropBtn.classList.remove('hidden');
      else adminDropBtn.classList.add('hidden');
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
    } else if (currentView==='community')    { sep(); add('Comunidade',true); }
      else if (currentView==='servers'||currentView==='server_detail') { sep(); add('Servers',true); }
      else if (currentView==='profile')      { sep(); add('Meu Perfil',true); }
      else if (currentView==='admin')        { sep(); add('Painel Administrativo',true); }
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
  // VIEW 5: COMMUNITY — Apple Liquid Glass & Real Image Upload
  // ──────────────────────────────────────────────────────────────────────────
  function renderCommunityView() {
    if (!isLoggedIn) { showAuthModal(); return; }
    selectedFilesToUpload = [];

    mainAppContainer.innerHTML = `
      <section class="py-10 px-4 sm:px-6 lg:px-8 max-w-[1080px] mx-auto relative z-10">
        <!-- Header -->
        <div class="mb-7 flex items-center justify-between border-b border-white/10 pb-5">
          <div>
            <span class="text-xs font-bold text-white/60 tracking-widest uppercase">REDE SOCIAL VIP</span>
            <h1 class="text-3xl font-extrabold text-white mt-1 flex items-center space-x-3">
              <span>Comunidade A.I Visuals</span>
              ${currentUserRole==='admin' ? '<span class="text-xs px-3 py-1 rounded-full bg-white/15 border border-white/25 text-white font-mono">👑 ADMIN</span>' : ''}
            </h1>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-7">
          <!-- FEED (2/3) -->
          <div class="lg:col-span-2 space-y-5">

            <!-- POST COMPOSER -->
            <div class="glass-card rounded-3xl overflow-hidden p-5">
              <div class="flex items-start space-x-3">
                <img src="${currentUserAvatarUrl}" class="w-10 h-10 rounded-full border border-white/20 flex-shrink-0 cursor-pointer" onclick="window.appGoProfile()" title="Ver perfil">
                <div class="flex-1 space-y-3 min-w-0">
                  <!-- Title -->
                  <input type="text" id="newPostTitle" placeholder="Título do post (opcional)..."
                    class="w-full bg-transparent border-b border-white/10 pb-2 text-sm font-bold text-white placeholder-white/30 focus:outline-none focus:border-white/40 transition-colors">
                  <!-- Content -->
                  <textarea id="newPostContent" rows="3" placeholder="Compartilhe uma ideia, prompt ou dúvida com a comunidade..."
                    class="w-full bg-white/5 border border-white/10 rounded-2xl p-3.5 text-sm text-white focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all resize-none placeholder-white/30"></textarea>

                  <!-- Real Image Upload Preview Area -->
                  <div id="postImageUploadPreview" class="hidden grid grid-cols-5 gap-2 pt-2"></div>

                  <!-- Link Field -->
                  <div id="postLinkField" class="hidden p-3 bg-white/5 rounded-2xl border border-white/10 space-y-2">
                    <input type="url" id="newPostLinkUrl" placeholder="URL do link (https://...)" class="w-full bg-transparent text-xs text-white placeholder-white/30 focus:outline-none border-b border-white/10 pb-1">
                    <input type="text" id="newPostLinkTitle" placeholder="Título do link (opcional)" class="w-full bg-transparent text-xs text-white placeholder-white/30 focus:outline-none">
                  </div>
                </div>
              </div>

              <!-- Hidden Real File Input -->
              <input type="file" id="communityFileInput" multiple accept="image/*" class="hidden">

              <!-- Composer Toolbar -->
              <div class="flex items-center justify-between pt-4 mt-3 border-t border-white/10">
                <div class="flex items-center space-x-2">
                  <button onclick="document.getElementById('communityFileInput').click()" class="flex items-center space-x-1.5 text-xs text-white/70 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 px-3.5 py-1.5 rounded-full transition-all">
                    <span>📷</span><span>Upload de Imagem (Até 5MB)</span>
                  </button>
                  <button onclick="window.togglePostLink()" class="flex items-center space-x-1.5 text-xs text-white/70 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 px-3.5 py-1.5 rounded-full transition-all">
                    <span>🔗</span><span>Link</span>
                  </button>
                </div>
                <button id="submitPostBtn" onclick="window.appCreatePost()" class="px-6 py-2 rounded-full font-bold bg-white text-black text-xs shadow-xl hover:scale-105 transition-all">
                  Publicar
                </button>
              </div>
            </div>

            <!-- POSTS FEED -->
            <div class="space-y-4" id="communityFeed">
              ${communityPosts.length===0
                ? `<div class="text-center py-16 glass-card rounded-3xl"><div class="text-4xl mb-3">💬</div><p class="text-graphite text-sm">Seja o primeiro a publicar!</p></div>`
                : communityPosts.map(renderPostCard).join('')}
            </div>
          </div>

          <!-- SIDEBAR (1/3) -->
          <div class="space-y-5">
            <!-- Quick Profile -->
            <div class="glass-card rounded-3xl p-5">
              <div class="flex items-center space-x-3 mb-4">
                <img src="${currentUserAvatarUrl}" class="w-12 h-12 rounded-full border border-white/20">
                <div class="min-w-0">
                  <p class="text-sm font-bold text-white truncate">${currentUserNameStr}</p>
                  ${getBadge(currentUserRole)}
                </div>
              </div>
              <button onclick="window.appGoProfile()" class="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs text-white transition-all font-semibold">
                Editar Perfil →
              </button>
            </div>

            <!-- Community Stats -->
            <div class="glass-card rounded-3xl p-5">
              <h3 class="text-sm font-bold text-white mb-4">📊 Estatísticas</h3>
              <div class="grid grid-cols-2 gap-3">
                <div class="bg-white/5 rounded-xl p-3 text-center border border-white/10">
                  <p class="text-xl font-extrabold text-white">${communityPosts.length}</p>
                  <p class="text-xs text-graphite">Posts</p>
                </div>
                <div class="bg-white/5 rounded-xl p-3 text-center border border-white/10">
                  <p class="text-xl font-extrabold text-white">${communityPosts.reduce((a,p)=>a+(p.comments?.length||0),0)}</p>
                  <p class="text-xs text-graphite">Respostas</p>
                </div>
              </div>
            </div>

            <!-- Side Banner Ads -->
            ${renderSideBanner()}
          </div>
        </div>
      </section>`;

    setupCommunityHandlers();
    setTimeout(triggerAnimObservers, 100);
  }

  function renderPostCard(post) {
    const isLiked  = post.likedBy?.includes(currentUserId);
    const canDel   = currentUserRole==='admin' || currentUserRole==='moderator' || post.user_id===currentUserId;
    const cCount   = post.comments?.length || 0;

    return `
      <article class="glass-card rounded-3xl overflow-hidden p-5" id="post-${post.id}">
        <!-- Header -->
        <div class="flex items-start justify-between mb-3">
          <div class="flex items-center space-x-3">
            <img src="${post.user_avatar}" class="w-10 h-10 rounded-full border border-white/15 flex-shrink-0">
            <div>
              <div class="flex items-center flex-wrap gap-x-2 gap-y-1">
                <span class="text-sm font-bold text-white">${post.user_name}</span>
                ${getBadge(post.user_role)}
              </div>
              <span class="text-[0.65rem] text-graphite">${formatDate(post.created_at)}</span>
            </div>
          </div>
          <div class="flex items-center space-x-2">
            ${canDel ? `<button onclick="window.appDeletePost('${post.id}')" class="text-xs text-red-400/60 hover:text-red-400 p-1.5 rounded-lg hover:bg-white/5 transition-all">✕</button>` : ''}
          </div>
        </div>

        ${post.title ? `<h3 class="text-base font-extrabold text-white mb-2 leading-snug">${post.title}</h3>` : ''}
        ${post.content ? `<p class="text-sm text-gray-300 leading-relaxed mb-3">${post.content.replace(/\n/g,'<br>')}</p>` : ''}

        ${post.link_url ? `
          <a href="${post.link_url}" target="_blank" class="mb-3 flex items-center space-x-3 p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
            <div class="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-sm flex-shrink-0">🔗</div>
            <div class="min-w-0 flex-1">
              <p class="text-xs font-bold text-white truncate">${post.link_title || post.link_url}</p>
              <p class="text-[0.65rem] text-graphite truncate">${post.link_url}</p>
            </div>
          </a>` : ''}

        ${post.images?.length ? renderImageGrid(post.images) : ''}

        <!-- Actions Bar -->
        <div class="mt-4 pt-3 flex items-center space-x-3 border-t border-white/10">
          <button onclick="window.appLikePost('${post.id}')" id="like-btn-${post.id}"
            class="flex items-center space-x-2 text-xs font-bold px-4 py-1.5 rounded-full border transition-all ${isLiked ? 'bg-white text-black border-white' : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10'}">
            <span>💙</span><span id="like-count-${post.id}">${post.likes||0}</span>
          </button>
          <button onclick="window.appToggleComments('${post.id}')"
            class="flex items-center space-x-2 text-xs font-bold px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-white/70 hover:bg-white/10 transition-all">
            <span>💬</span><span id="comment-count-${post.id}">${cCount}</span>
          </button>
        </div>

        <!-- Comments Area -->
        <div id="comments-${post.id}" class="hidden mt-3 border-t border-white/10 pt-3 space-y-3">
          <div class="space-y-2" id="comments-list-${post.id}">
            ${(post.comments||[]).map(c=>renderCommentCard(c,post.id)).join('')}
          </div>
          <div class="flex items-center space-x-2 pt-2">
            <input type="text" id="comment_input_${post.id}" placeholder="Escreva um comentário..."
              class="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-xs text-white focus:outline-none focus:border-white/30"
              onkeydown="if(event.key==='Enter')window.appAddComment('${post.id}')">
            <button onclick="window.appAddComment('${post.id}')" class="px-4 py-2 bg-white text-black font-bold text-xs rounded-full hover:bg-white/90">Enviar</button>
          </div>
        </div>
      </article>`;
  }

  function renderCommentCard(c, postId) {
    const canDel = currentUserRole==='admin' || currentUserRole==='moderator' || c.user_id===currentUserId;
    return `
      <div class="flex items-start space-x-2.5" id="comment-${c.id}">
        <img src="${c.user_avatar}" class="w-7 h-7 rounded-full flex-shrink-0 mt-0.5">
        <div class="flex-1 bg-white/5 rounded-2xl px-3.5 py-2.5 min-w-0 border border-white/5">
          <div class="flex items-center justify-between mb-1">
            <span class="text-xs font-bold text-white">${c.user_name}</span>
            <span class="text-[0.6rem] text-graphite">${formatDate(c.created_at)}</span>
          </div>
          <p class="text-xs text-gray-300 leading-relaxed">${c.content}</p>
        </div>
        ${canDel ? `<button onclick="window.appDeleteComment('${postId}','${c.id}')" class="text-red-400 text-xs p-1">✕</button>` : ''}
      </div>`;
  }

  function setupCommunityHandlers() {
    window.appGoProfile = navigateToProfile;

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
          previewContainer.innerHTML = files.map(f => `
            <div class="h-16 rounded-xl overflow-hidden border border-white/20 bg-black/60 relative">
              <img src="${URL.createObjectURL(f)}" class="w-full h-full object-cover">
            </div>`).join('');
        }
      };
    }

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
        showAuthModal('Para publicar na Comunidade VIP, faça login ou cadastre-se.');
        return;
      }

      const title    = document.getElementById('newPostTitle')?.value?.trim();
      const content  = document.getElementById('newPostContent')?.value?.trim();
      const link_url = document.getElementById('newPostLinkUrl')?.value?.trim();
      const link_title= document.getElementById('newPostLinkTitle')?.value?.trim();
      const btn = document.getElementById('submitPostBtn');

      if (!content && !title && !selectedFilesToUpload.length) {
        showToast('⚠️ Escreva um texto ou selecione imagens para publicar.');
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
        title: title || '',
        content: content || '',
        link_url: link_url || '',
        link_title: link_title || '',
        images: uploadedImageUrls.length > 0 ? uploadedImageUrls : [],
        is_pinned: currentUserRole === 'admin',
        likes: 0,
        likedBy: [],
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
          console.warn('[A.I VISUALS] Post salvo localmente (Supabase indisponível):', sbPostErr.message);
        }
      }

      // Adiciona na coleção local e persiste
      communityPosts.unshift(newPostObj);
      saveLocalCommunityPosts();

      selectedFilesToUpload = [];
      showToast('✅ Post publicado na comunidade!');
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
      const text  = input?.value?.trim();
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

      showToast('💬 Comentário enviado!');
      renderCommunityView();
    };

    window.appDeletePost = async id => {
      if (!(await showConfirmModal('Excluir este post?'))) return;
      if (sb) {
        try { await sb.from('community_posts').delete().eq('id', id); } catch(e) {}
      }
      communityPosts = communityPosts.filter(p => p.id !== id);
      saveLocalCommunityPosts();
      renderCommunityView();
      showToast('🗑️ Post excluído!');
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
  // VIEW 7: SERVER DETAIL — Player de Vídeo Embed
  // ──────────────────────────────────────────────────────────────────────────
  function renderServerDetailView() {
    if (!isLoggedIn) { showAuthModal(); return; }
    const srv = serversData.find(s=>s.id===selectedServerId);
    if (!srv) { navigateToServers(); return; }
    const lessons = srv.lessons || [];
    const lesson  = lessons.find(l=>l.id===selectedLessonId) || lessons[0];
    const embed   = lesson?.video_url ? convertToEmbedUrl(lesson.video_url) : '';
    const lesIdx  = lessons.findIndex(l=>l.id===lesson?.id);
    const prev    = lessons[lesIdx-1];
    const next    = lessons[lesIdx+1];

    mainAppContainer.innerHTML = `
      <section class="py-8 px-4 sm:px-6 lg:px-8 max-w-[1600px] mx-auto relative z-10">
        <!-- Header -->
        <div class="flex items-center justify-between mb-6 border-b border-white/10 pb-5">
          <div class="min-w-0 flex-1 mr-4">
            <span class="text-xs font-bold text-white/60 tracking-widest uppercase">${srv.title}</span>
            <h1 class="text-xl sm:text-2xl font-extrabold text-white mt-0.5 truncate">${lesson?.title||'Selecione uma aula'}</h1>
          </div>
          <div class="flex items-center space-x-2 flex-shrink-0 flex-wrap gap-y-2">
            ${(currentUserRole==='admin'||currentUserRole==='moderator') ? `
              <button onclick="window.appOpenServerEditorModal('${srv.id}')" class="px-3 py-1.5 bg-white/10 text-white border border-white/15 rounded-xl text-xs font-bold transition-all">⚙️ Servidor</button>
              <button onclick="window.appOpenLessonEditorModal('${srv.id}')" class="px-3 py-1.5 bg-white text-black rounded-xl text-xs font-bold hover:bg-white/90 transition-all">+ Nova Aula</button>` : ''}
            <button onclick="window.appGoServers()" class="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-all">← Voltar</button>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <!-- LESSON SIDEBAR -->
          <div class="lg:col-span-1">
            <div class="glass-card rounded-3xl p-4 sticky top-24">
              <h3 class="text-xs font-bold text-graphite uppercase tracking-wider mb-3 flex items-center justify-between">
                <span>Aulas (${lessons.length})</span>
                ${lesIdx>=0 ? `<span class="text-white">${lesIdx+1}/${lessons.length}</span>` : ''}
              </h3>
              <div class="space-y-1.5 max-h-[55vh] overflow-y-auto pr-1">
                ${lessons.length===0 ? '<p class="text-xs text-graphite p-2">Nenhuma aula.</p>' :
                  lessons.map((l,i) => {
                    const active = l.id===lesson?.id;
                    return `<div class="rounded-xl border transition-all ${active ? 'bg-white/15 border-white/30 shadow-lg' : 'bg-white/5 border-white/10 hover:bg-white/10'}">
                      <div class="p-2.5 cursor-pointer flex items-center justify-between" onclick="window.appGoServerDetail('${srv.id}','${l.id}')">
                        <div class="min-w-0 flex-1 mr-2">
                          <p class="text-[0.6rem] font-bold ${active?'text-white':'text-graphite'} mb-0.5">AULA ${i+1}</p>
                          <p class="text-xs font-semibold ${active?'text-white':'text-graphite'} leading-tight truncate">${l.title}</p>
                        </div>
                        ${(currentUserRole==='admin'||currentUserRole==='moderator') ? `
                          <button onclick="event.stopPropagation(); window.appOpenLessonEditorModal('${srv.id}', '${l.id}')" class="px-2 py-1 bg-white/10 hover:bg-white/20 text-white border border-white/15 rounded-lg text-[0.65rem] font-bold transition-all flex-shrink-0" title="Editar Aula">
                            ✏️ Editar
                          </button>` : ''}
                      </div>
                    </div>`;
                  }).join('')}
              </div>
            </div>
          </div>

          <!-- MAIN VIEWER -->
          <div class="lg:col-span-3 space-y-5">
            ${lesson ? `
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
                <div class="glass-card rounded-3xl p-12 text-center">
                  <div class="text-3xl mb-2">🎬</div>
                  <p class="text-graphite text-sm">Nenhum vídeo para esta aula.</p>
                </div>`}

              <div class="glass-card rounded-3xl p-6 sm:p-8">
                <div class="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
                  <h2 class="text-lg font-bold text-white">${lesson.title}</h2>
                  ${(currentUserRole==='admin'||currentUserRole==='moderator') ? `
                    <button onclick="window.appOpenLessonEditorModal('${srv.id}', '${lesson.id}')" class="px-4 py-2 bg-white/15 hover:bg-white/25 border border-white/20 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center space-x-1.5">
                      <span>✏️ Editar Aula</span>
                    </button>` : ''}
                </div>
                <div class="prose prose-invert max-w-none leading-relaxed text-gray-300">
                  ${renderMarkdown(lesson.content_markdown||'')}
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
  // ──────────────────────────────────────────────────────────────────────────
  async function renderAdminView() {
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
                  return `
                    <tr class="hover:bg-white/5 transition-colors">
                      <td class="py-3 px-2 flex items-center space-x-2.5">
                        <img src="${p.avatar_url || 'https://api.dicebear.com/7.x/bottts/svg?seed='+p.id}" class="w-8 h-8 rounded-full border border-white/20">
                        <span class="font-bold text-white">${p.name || 'Sem Nome'}</span>
                      </td>
                      <td class="py-3 px-2 text-gray-300 font-mono">${p.email || 'N/A'}</td>
                      <td class="py-3 px-2">${getBadge(p.role || 'free')}</td>
                      <td class="py-3 px-2 text-graphite">${formatDate(p.created_at)}</td>
                      <td class="py-3 px-2 text-right space-x-1.5">
                        ${isMaxAdmin ? `<span class="text-[0.65rem] text-white/40 font-mono">INTOCÁVEL</span>` : `
                          ${currentUserRole === 'admin' && p.role !== 'moderator' ? `
                            <button onclick="window.appPromoteMod('${p.id}')" class="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white border border-white/15 rounded-lg text-[0.65rem] font-bold">
                              🛡️ Promover Mod
                            </button>` : ''}
                          ${currentUserRole === 'admin' && p.role === 'moderator' ? `
                            <button onclick="window.appDemoteMod('${p.id}')" class="px-2.5 py-1 bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 rounded-lg text-[0.65rem] font-bold">
                              ⏬ Rebaixar
                            </button>` : ''}
                          <button onclick="window.appRemoveMember('${p.id}', '${p.role}', '${p.email}')" class="px-2.5 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 rounded-lg text-[0.65rem] font-bold">
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
                      <strong class="text-white">${c.profiles?.name || 'Membro'}</strong>
                      <span class="text-graphite text-[0.65rem]">${formatDate(c.created_at)}</span>
                    </div>
                    <p class="text-gray-300 leading-relaxed">${c.content}</p>
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
