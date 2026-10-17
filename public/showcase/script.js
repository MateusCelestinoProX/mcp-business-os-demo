/* ============================================================
   MATEUS CELESTINO PRO — CV CINEMATOGRÁFICO
   JavaScript — Interatividade, Animações & Efeito Spotlight
   ============================================================ */

// --- FORÇAR A PÁGINA A ABRIR DO COMEÇO (SEM ROLAGEM AUTOMÁTICA) ---
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

function forceStartAtTop() {
  window.scrollTo(0, 0);
  if (window.location.hash) {
    window.history.replaceState(null, null, window.location.pathname + window.location.search);
  }
}

forceStartAtTop();
window.addEventListener('load', forceStartAtTop);
window.addEventListener('beforeunload', forceStartAtTop);

document.addEventListener('DOMContentLoaded', () => {
  forceStartAtTop();

  // --- 1. Inicializar Lucide Icons ---
  if (window.lucide) {
    lucide.createIcons();
  }

  // --- 2. Elementos Ativos Imediatamente (Sem Animações de Surgimento) ---
  document.querySelectorAll('.reveal, .reveal-stagger').forEach(el => {
    el.classList.add('active');
  });

  // --- 3. Efeito de Scroll na Navbar ---
  // --- 3. Efeito de Scroll na Navbar ---
  const nav = document.getElementById('navbar');
  if (nav) {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  // --- 4. Menu Mobile Fluído ---
  const mobileBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileOverlay = document.getElementById('mobile-menu-overlay');

  function closeMobileMenu() {
    if (mobileBtn) mobileBtn.classList.remove('open');
    if (mobileMenu) mobileMenu.classList.remove('open');
    if (mobileOverlay) mobileOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  function openMobileMenu() {
    if (mobileBtn) mobileBtn.classList.add('open');
    if (mobileMenu) mobileMenu.classList.add('open');
    if (mobileOverlay) mobileOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  if (mobileBtn && mobileMenu) {
    mobileBtn.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.contains('open');
      if (isOpen) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    if (mobileOverlay) {
      mobileOverlay.addEventListener('click', closeMobileMenu);
    }

    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMobileMenu);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
        closeMobileMenu();
      }
    });
  }

  // --- 5. Rolar Suavemente (Smooth Scroll) ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (!href || href === '#') return;
      
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const navHeight = (nav ? nav.offsetHeight : 70) + 60;
        const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 12;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // --- 6. Accordion de Certificações ---
  document.querySelectorAll('.cert-cat-header-click').forEach(header => {
    header.addEventListener('click', () => {
      const category = header.parentElement;
      category.classList.toggle('open');
    });
  });

  // --- 7. Lightbox para Visualização de Imagens e Vídeos ---
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxVideo = document.getElementById('lightbox-video');
  const lightboxVideoContainer = document.getElementById('lightbox-video-container');
  const lightboxClose = document.getElementById('lightbox-close');

  window.openVideoModal = function(videoSrc, title) {
    if (!lightbox || !lightboxVideo || !lightboxVideoContainer) return;
    if (lightboxImg) lightboxImg.style.display = 'none';
    lightboxVideoContainer.style.display = 'block';
    lightboxVideo.src = videoSrc;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
    lightboxVideo.play().catch(() => {});
  };

  document.querySelectorAll('[data-lightbox]').forEach(item => {
    item.addEventListener('click', () => {
      if (lightbox && lightboxImg) {
        const img = item.querySelector('img');
        if (img) {
          if (lightboxVideoContainer) lightboxVideoContainer.style.display = 'none';
          lightboxImg.style.display = 'block';
          lightboxImg.src = img.src;
          lightbox.classList.add('active');
          document.body.style.overflow = 'hidden';
        }
      }
    });
  });

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  function closeLightbox() {
    if (lightbox) {
      lightbox.classList.remove('active');
      if (lightboxVideo) {
        lightboxVideo.pause();
        lightboxVideo.src = '';
      }
      document.body.style.overflow = '';
    }
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });

  // --- 8. Core Spotlight Reveal Mechanic (Hero 2 - Example 2) ---
  const spotlightSection = document.getElementById('spotlight-section');
  const spotlightCanvas = document.getElementById('spotlight-canvas');
  const revealLayer = document.getElementById('reveal-layer');

  if (spotlightSection && spotlightCanvas && revealLayer) {
    const ctx = spotlightCanvas.getContext('2d');
    const SPOTLIGHT_R = 260;

    let mouse = { x: -9999, y: -9999 };
    let smooth = { x: -9999, y: -9999 };
    let active = false;

    function resizeCanvas() {
      spotlightCanvas.width = window.innerWidth;
      spotlightCanvas.height = window.innerHeight;
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    spotlightSection.addEventListener('mousemove', (e) => {
      const rect = spotlightSection.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      active = true;
    });

    spotlightSection.addEventListener('mouseleave', () => {
      active = false;
    });

    function updateSpotlight() {
      // Lerp smoothing
      if (active) {
        if (smooth.x === -9999) {
          smooth.x = mouse.x;
          smooth.y = mouse.y;
        } else {
          smooth.x += (mouse.x - smooth.x) * 0.1;
          smooth.y += (mouse.y - smooth.y) * 0.1;
        }
      } else {
        // Fade out or move offscreen
        smooth.x += (-9999 - smooth.x) * 0.1;
        smooth.y += (-9999 - smooth.y) * 0.1;
      }

      ctx.clearRect(0, 0, spotlightCanvas.width, spotlightCanvas.height);

      if (smooth.x !== -9999) {
        // Draw the spotlight gradient on canvas
        const gradient = ctx.createRadialGradient(
          smooth.x, smooth.y, 0,
          smooth.x, smooth.y, SPOTLIGHT_R
        );
        gradient.addColorStop(0, 'rgba(255,255,255,1)');
        gradient.addColorStop(0.4, 'rgba(255,255,255,1)');
        gradient.addColorStop(0.6, 'rgba(255,255,255,0.75)');
        gradient.addColorStop(0.75, 'rgba(255,255,255,0.4)');
        gradient.addColorStop(0.88, 'rgba(255,255,255,0.12)');
        gradient.addColorStop(1, 'rgba(255,255,255,0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(smooth.x, smooth.y, SPOTLIGHT_R, 0, Math.PI * 2);
        ctx.fill();

        // Convert canvas to base64 mask URL
        try {
          const dataUrl = spotlightCanvas.toDataURL();
          revealLayer.style.maskImage = `url(${dataUrl})`;
          revealLayer.style.webkitMaskImage = `url(${dataUrl})`;
          revealLayer.style.maskSize = '100% 100%';
          revealLayer.style.webkitMaskSize = '100% 100%';
        } catch (e) {
          // Fallback if dataURL fails
        }
      }

      requestAnimationFrame(updateSpotlight);
    }

    updateSpotlight();
  }

  // --- 9. Canvas Particle Background (Blood Red Energy Orbs connected) ---
  const canvas = document.getElementById('energy-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    let pMouse = { x: -9999, y: -9999 };

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }

    resize();
    window.addEventListener('resize', resize);

    window.addEventListener('mousemove', (e) => {
      pMouse.x = e.clientX;
      pMouse.y = e.clientY;
    }, { passive: true });

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.35;
        this.vy = (Math.random() - 0.5) * 0.35;
        this.baseSize = Math.random() * 2 + 0.5;
        this.size = this.baseSize;
        this.maxGlow = Math.random() * 100 + 40;
        this.alpha = Math.random() * 0.35 + 0.05;
        this.baseAlpha = this.alpha;
        this.pulseSpeed = Math.random() * 0.01 + 0.002;
        this.pulseDir = 1;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        this.alpha += this.pulseSpeed * this.pulseDir;
        if (this.alpha > this.baseAlpha + 0.15) this.pulseDir = -1;
        if (this.alpha < this.baseAlpha * 0.6) this.pulseDir = 1;

        // Interaction with mouse
        const dx = this.x - pMouse.x;
        const dy = this.y - pMouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 180) {
          const force = (180 - dist) / 180;
          this.size = this.baseSize + force * 2.5;
          this.alpha = Math.min(this.baseAlpha + force * 0.25, 0.7);
        } else {
          this.size += (this.baseSize - this.size) * 0.05;
        }
      }

      draw() {
        const gradient = ctx.createRadialGradient(
          this.x, this.y, 0,
          this.x, this.y, this.maxGlow
        );
        gradient.addColorStop(0, `rgba(255, 15, 57, ${this.alpha})`);
        gradient.addColorStop(0.2, `rgba(255, 15, 57, ${this.alpha * 0.35})`);
        gradient.addColorStop(0.6, `rgba(255, 15, 57, ${this.alpha * 0.06})`);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.beginPath();
        ctx.fillStyle = gradient;
        ctx.arc(this.x, this.y, this.maxGlow, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.fillStyle = `rgba(255, 80, 100, ${this.alpha * 1.3})`;
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function initParticles() {
      particles = [];
      const count = window.innerWidth < 768 ? 10 : 22;
      for (let i = 0; i < count; i++) {
        particles.push(new Particle());
      }
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        p1.update();
        p1.draw();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 160) {
            const alpha = (1 - dist / 160) * 0.06;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(255, 15, 57, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(animate);
    }

    initParticles();
    animate();

    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(initParticles, 300);
    });
  }

  // --- 10. Atualizar Link de Menu Ativo no Scroll ---
  const sections = document.querySelectorAll('section[id], div[id].spotlight-section, div[id].bloom-hero, div[id].contact-apple-linktree-section');
  const navLinks = document.querySelectorAll('.nav-links a, .mobile-menu a');

  function updateActiveLink() {
    const scrollPos = window.scrollY + 160;
    sections.forEach(section => {
      const top = section.offsetTop;
      const bottom = top + section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < bottom) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });
  updateActiveLink();

  // --- 11. Transição Suave e Desvanecimento para Vídeos de Fundo ---
  const allBgVideos = document.querySelectorAll('.video-bg-transition-wrapper video, .hero-stream-video, .bloom-video-bg');

  allBgVideos.forEach(video => {
    const computedOpacity = parseFloat(window.getComputedStyle(video).opacity);
    const defaultOpacity = isNaN(computedOpacity) || computedOpacity === 1 ? 0.45 : computedOpacity;
    video.dataset.targetOpacity = defaultOpacity;
    video.style.transition = 'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1)';

    video.addEventListener('timeupdate', () => {
      if (video.duration && !video.paused) {
        const timeRemaining = video.duration - video.currentTime;
        if (timeRemaining < 0.4) {
          video.style.opacity = '0.05';
        } else if (video.currentTime < 0.4) {
          video.style.opacity = video.dataset.targetOpacity;
        }
      }
    });

    video.addEventListener('playing', () => {
      video.style.opacity = video.dataset.targetOpacity;
    });

    video.addEventListener('seeked', () => {
      video.style.opacity = video.dataset.targetOpacity;
    });
  });

  const videoScrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const video = entry.target;
      const targetOpacity = video.dataset.targetOpacity || 0.45;
      if (entry.isIntersecting) {
        video.style.opacity = targetOpacity;
        if (video.paused) video.play().catch(() => {});
      } else {
        video.style.opacity = '0';
      }
    });
  }, {
    threshold: 0.05
  });

  allBgVideos.forEach(v => videoScrollObserver.observe(v));

  // --- 12. Botão Flutuante Voltar ao Topo com Progresso Circular ---
  const backToTopBtn = document.getElementById('back-to-top');
  const progressCircle = document.querySelector('.progress-ring-circle');

  if (backToTopBtn && progressCircle) {
    const radius = progressCircle.r.baseVal.value;
    const circumference = 2 * Math.PI * radius;
    progressCircle.style.strokeDasharray = `${circumference} ${circumference}`;
    progressCircle.style.strokeDashoffset = circumference;

    function updateProgress() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? scrollTop / docHeight : 0;
      const offset = circumference - (scrollPercent * circumference);
      progressCircle.style.strokeDashoffset = offset;

      if (scrollTop > 350) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }

    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --- 13. Previewer Interativo de Entregáveis Notion ---
  window.switchNotionPreview = function(tabKey) {
    const iframe = document.getElementById('notion-live-iframe');
    const loader = document.getElementById('notion-iframe-loader');
    const urlDisplay = document.getElementById('notion-url-display');
    const externalBtn = document.getElementById('notion-external-action-btn');
    const tabLuiz = document.getElementById('tab-btn-luiz');
    const tabJunin = document.getElementById('tab-btn-junin');

    if (!iframe || !loader) return;

    const deliverables = {
      luiz: {
        url: 'https://mateuscelestinopro.notion.site/LUIZ-VPN-3c38112a6332809bbd77e6739e525c78?pvs=73',
        displayUrl: 'mateuscelestinopro.notion.site/LUIZ-VPN',
        title: 'A.I Consultory & VPN'
      },
      junin: {
        url: 'https://infinite-recourses.notion.site/ENTREG-VEIS-JUNIN-X1-38a8112a633280cc80bbf8c5fe635df7',
        displayUrl: 'infinite-recourses.notion.site/ENTREGAVEIS-JUNIN-X1',
        title: 'Visuals Entregáveis'
      }
    };

    const selected = deliverables[tabKey] || deliverables.luiz;

    if (tabLuiz && tabJunin) {
      tabLuiz.classList.toggle('active', tabKey === 'luiz');
      tabJunin.classList.toggle('active', tabKey === 'junin');
    }

    if (urlDisplay) urlDisplay.textContent = selected.displayUrl;
    if (externalBtn) externalBtn.href = selected.url;

    loader.classList.remove('hidden');

    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const targetSrc = isLocal ? `/proxy?url=${encodeURIComponent(selected.url)}` : selected.url;

    iframe.src = targetSrc;
  };

  window.reloadNotionPreview = function() {
    const iframe = document.getElementById('notion-live-iframe');
    const loader = document.getElementById('notion-iframe-loader');
    if (iframe && loader) {
      loader.classList.remove('hidden');
      iframe.src = iframe.src;
    }
  };
});

