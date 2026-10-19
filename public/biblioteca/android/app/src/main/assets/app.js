/* ========================================================
   ΝΞΙΔ — Nova Era da IA™
   Application Logic - Navigation, Search, Rendering
   ======================================================== */

(function () {
  'use strict';

  // --- State ---
  let siteData = null;
  let currentPath = [];
  let currentView = 'categories';
  let searchTimeout = null;
  let searchIndex = [];

  // --- DOM References ---
  const categoriesView = document.getElementById('categories-view');
  const folderView = document.getElementById('folder-view');
  const articleView = document.getElementById('article-view');
  const searchView = document.getElementById('search-view');
  const categoriesGrid = document.getElementById('hero-sessions-container');
  const folderGrid = document.getElementById('folder-grid');
  const folderTitle = document.getElementById('folder-title');
  const folderDesc = document.getElementById('folder-desc');
  const articleTitle = document.getElementById('article-title');
  const articleMeta = document.getElementById('article-meta');
  const articleBody = document.getElementById('article-body');
  const breadcrumb = document.getElementById('breadcrumb');
  const breadcrumbInner = breadcrumb.querySelector('.breadcrumb-inner');
  const searchInput = document.getElementById('search-input');
  const searchResultsList = document.getElementById('search-results-list');
  const searchResultsTitle = document.getElementById('search-results-title');
  const heroStats = document.getElementById('hero-stats');
  const logoHome = document.getElementById('logo-home');

  // --- Icons ---
  const icons = {
    folder: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>',
    file: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>',
    arrow: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>',
    chevron: '›'
  };

  const fileTypeIcons = {
    txt: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>',
    md: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M7 15V9l3.5 4.5L14 9v6M17 13.5l1.5-1.5H15l1.5 1.5v3"/></svg>',
    docx: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M9 12h6M9 16h6"/></svg>',
    pdf: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M10 13a2 2 0 00-2 2v2M14 13a2 2 0 012 2v2"/></svg>',
    image: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>',
    html: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>',
    zip: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="12" y1="3" x2="12" y2="21"/><path d="M12 12H9M12 9H9M12 15H9M12 6h3M12 18h3"/></svg>'
  };

  const categoryIcons = {
    'A.I ANIMATION': '🎬',
    'A.I CREATIVE STUDIO MATERIALS': '🎨',
    'GERAL PROMPTS': '✍️',
    'HISTORIKA AI': '🏛️',
    'MikoAI': '🤖',
    'The Skeleton Method': '💀',
    'nano banana (gumroad).': '🍌',
    'sex scalating': '🔥',
    'NEIA IA - Nova Era da IA™': '⚡',
    'NEIA IA': '⚡'
  };

  // --- Cryptography Functions (SHA-256 and XOR) ---
  async function getSha256Bytes(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    return new Uint8Array(hashBuffer);
  }

  function decryptData(encryptedBase64, keyBytes) {
    const binaryString = atob(encryptedBase64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    
    const keyLen = keyBytes.length;
    const decryptedBytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      decryptedBytes[i] = bytes[i] ^ keyBytes[i % keyLen];
    }
    
    return new TextDecoder().decode(decryptedBytes);
  }

  // --- Authentication Flow ---
  async function tryAuthentication(password, isInteractive = false) {
    try {
      const encryptedData = document.getElementById('site-data').textContent.trim();
      const keyBytes = await getSha256Bytes(password);
      const decryptedJson = decryptData(encryptedData, keyBytes);
      
      siteData = JSON.parse(decryptedJson);
      
      // Save password in localStorage on success
      localStorage.setItem('library_pass', password);
      
      const loginScreen = document.getElementById('login-screen');
      if (loginScreen) {
        loginScreen.classList.remove('active');
        loginScreen.style.pointerEvents = 'none';
        loginScreen.style.display = 'none';
      }

      if (isInteractive) {
        // Exibe a cerimônia de boas-vindas com duração de 5 segundos
        showWelcomeCeremony(() => {
          document.getElementById('main-header').style.display = 'block';
          document.getElementById('main-content').style.display = 'block';
          document.getElementById('main-footer').style.display = 'block';
          initApp();
        });
      } else {
        // Sessão restaurada
        document.getElementById('main-header').style.display = 'block';
        document.getElementById('main-content').style.display = 'block';
        document.getElementById('main-footer').style.display = 'block';
        initApp();
      }

      return true;
    } catch (e) {
      console.error("Autenticação falhou:", e);
      const loginErr = document.getElementById('login-error');
      if (loginErr) loginErr.textContent = "Erro na descriptografia dos dados.";
      return false;
    }
  }

  // --- Welcome Ceremony Controller (5 Seconds Experience) ---
  function showWelcomeCeremony(onComplete) {
    const popup = document.getElementById('welcome-popup');
    if (!popup) {
      if (onComplete) onComplete();
      return;
    }

    // Bloquear scroll durante a cerimônia
    document.body.style.overflow = 'hidden';

    // Ativar o popup de boas-vindas
    popup.classList.add('active');
    
    // Reiniciar barra de progresso suave de 5 segundos
    const progressFill = popup.querySelector('.welcome-progress-fill');
    if (progressFill) {
      progressFill.style.animation = 'none';
      void progressFill.offsetWidth;
      progressFill.style.animation = 'welcomeProgressAnim 5s cubic-bezier(0.25, 1, 0.5, 1) forwards';
    }

    // Duração exata de 5 segundos antes de desvanecer suavemente
    setTimeout(() => {
      popup.style.transition = 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
      popup.style.opacity = '0';
      popup.style.transform = 'scale(1.03)';
      
      setTimeout(() => {
        popup.classList.remove('active');
        popup.style.opacity = '';
        popup.style.transform = '';
        popup.style.transition = '';
        document.body.style.overflow = '';
        if (onComplete) onComplete();
      }, 700);
    }, 5000);
  }

  // --- Video Controller System ---
  function initVideoController() {
    const video = document.getElementById('hero-video');
    if (!video) return;

    let fadeAnimFrame = null;
    let fadingOut = false;

    function fadeVideo(targetOpacity, duration, callback) {
      if (fadeAnimFrame) {
        cancelAnimationFrame(fadeAnimFrame);
      }

      const startOpacity = parseFloat(video.style.opacity) || 0;
      const startTime = performance.now();

      function updateFade(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        video.style.opacity = startOpacity + (targetOpacity - startOpacity) * progress;

        if (progress < 1) {
          fadeAnimFrame = requestAnimationFrame(updateFade);
        } else {
          fadeAnimFrame = null;
          if (callback) callback();
        }
      }

      fadeAnimFrame = requestAnimationFrame(updateFade);
    }

    // Set initial opacity and play
    video.style.opacity = '0';
    video.play().then(() => {
      fadeVideo(1, 500);
    }).catch(err => console.log("Autoplay blocked:", err));

    video.addEventListener('timeupdate', () => {
      const remainingTime = video.duration - video.currentTime;
      if (video.duration && remainingTime <= 0.55 && !fadingOut) {
        fadingOut = true;
        fadeVideo(0, 500);
      }
    });

    video.addEventListener('ended', () => {
      video.style.opacity = '0';
      setTimeout(() => {
        video.currentTime = 0;
        fadingOut = false;
        video.play().then(() => {
          fadeVideo(1, 500);
        });
      }, 100);
    });
  }

  // --- Utility Functions ---
  function countItems(node) {
    if (node.type === 'file') return { files: 1, folders: 0 };
    let files = 0, folders = 0;
    for (const child of (node.children || [])) {
      const counts = countItems(child);
      files += counts.files;
      folders += counts.folders;
      if (child.type === 'folder') folders++;
    }
    return { files, folders };
  }

  function getNodeAtPath(path) {
    let node = siteData;
    for (const idx of path) {
      if (!node.children || !node.children[idx]) return null;
      node = node.children[idx];
    }
    return node;
  }

  function extractNumber(name) {
    const match = name.match(/^(\d+)/);
    return match ? match[1].padStart(2, '0') : '';
  }

  function cleanDisplayName(name) {
    return name.replace(/^\d+\s*[-\.]\s*/, '').trim();
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function getIconForNode(node) {
    return categoryIcons[node.name] || '📂';
  }

  function getFileIconAndMeta(child) {
    const type = child.fileType || 'txt';
    const icon = fileTypeIcons[type] || icons.file;
    let label = 'Documento';
    
    if (type === 'pdf') label = 'Arquivo PDF';
    else if (type === 'docx') label = 'Documento Word';
    else if (type === 'md') label = 'Documento Markdown';
    else if (type === 'image') label = 'Imagem';
    else if (type === 'html') label = 'Página Web';
    else if (type === 'zip') label = 'Arquivo ZIP';

    let meta = label;
    if (child.content) {
      const wordCount = child.content.split(/\s+/).length;
      const readTime = Math.max(1, Math.ceil(wordCount / 200));
      meta += ` · ~${readTime} min de leitura · ${wordCount} palavras`;
    } else {
      meta += ` · Disponível para visualização`;
    }
    
    return { icon, meta };
  }

  // =============================================
  // SMART TEXT FORMATTER
  // Transforms raw TXT into well-structured HTML
  // =============================================
  function formatRawText(rawText) {
    if (!rawText) return '<p class="empty-content">Conteúdo vazio.</p>';

    const lines = rawText.split('\n');
    let html = '';
    let inList = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();

      if (!trimmed) {
        if (inList) {
          html += '</div>';
          inList = false;
        }
        continue;
      }

      const isHeader = isLikelyHeader(trimmed, i, lines);
      const listMatch = trimmed.match(/^([-•*]\s+|(?:\d+[\.\)]\s+)|(?:\t\d+[\.\)]\s*))(.*)/);
      const isUrl = /^https?:\/\/\S+$/.test(trimmed);

      if (isHeader) {
        if (inList) { html += '</div>'; inList = false; }
        html += `<h3 class="section-title">${escapeHtml(trimmed)}</h3>`;
      } else if (listMatch) {
        if (!inList) {
          html += '<div class="content-list">';
          inList = true;
        }
        const prefix = listMatch[1].trim();
        const content = listMatch[2] || '';
        const itemHtml = linkify(escapeHtml(content || trimmed));
        html += `<div class="content-list-item"><span class="list-marker">${escapeHtml(prefix)}</span>${itemHtml}</div>`;
      } else if (isUrl) {
        if (inList) { html += '</div>'; inList = false; }
        html += `<div class="content-link"><a href="${escapeHtml(trimmed)}" target="_blank" rel="noopener noreferrer">${escapeHtml(trimmed)}</a></div>`;
      } else {
        if (inList) { html += '</div>'; inList = false; }
        const paragraphHtml = linkify(escapeHtml(trimmed));
        html += `<p class="content-paragraph">${paragraphHtml}</p>`;
      }
    }

    if (inList) html += '</div>';

    return html || '<p class="empty-content">Conteúdo vazio.</p>';
  }

  function isLikelyHeader(line, lineIndex, allLines) {
    if (line.length > 120) return false;
    if (line.endsWith('.') || line.endsWith(',')) return false;

    if (lineIndex === 0 && line.length < 100) return true;

    if (/^\d+[\.\)\-\s]/.test(line) && line.length < 100) {
      for (let j = lineIndex + 1; j < allLines.length; j++) {
        const nextLine = allLines[j].trim();
        if (nextLine) {
          return nextLine.length > line.length || nextLine.length > 50;
        }
      }
      return true;
    }

    if (/^[A-ZÁÉÍÓÚÀÂÊÔÃÕÇÜ0-9\s\-\—\:\™\$\&\[\]\(\)\+\*\!\?\#\€\®\©\→\←\↓\↑\/\.]{4,}$/.test(line) && line.length < 100) {
      const upperCount = (line.match(/[A-ZÁÉÍÓÚÀÂÊÔÃÕÇÜ]/g) || []).length;
      if (upperCount >= 3) return true;
    }

    if (/^(Introdução|Conclusão|Resumo|Módulo|Aula|Capítulo|Seção|Material|Bônus|Dica|Passo|Etapa|Fase|Parte|Peça|Glossário)/i.test(line) && line.length < 100) {
      return true;
    }

    if (lineIndex > 0 && line.length < 80) {
      const prevLine = allLines[lineIndex - 1]?.trim();
      const nextLine = allLines[lineIndex + 1]?.trim();
      if (prevLine === '' && (nextLine === '' || nextLine === undefined)) {
        return true;
      }
    }

    return false;
  }

  function linkify(html) {
    return html.replace(
      /(https?:\/\/[^\s&lt;&amp;]+)/g,
      '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
    );
  }

  // =============================================
  // VANILLA JS MARKDOWN PARSER
  // =============================================
  function parseMarkdown(md) {
    if (!md) return '<p class="empty-content">Conteúdo vazio.</p>';

    let html = '';
    const lines = md.split('\n');
    let inList = false;
    let listType = null;
    let inBlockquote = false;
    let inCodeBlock = false;
    let codeBlockLines = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();

      if (trimmed.startsWith('```')) {
        if (inCodeBlock) {
          html += `<pre><code>${escapeHtml(codeBlockLines.join('\n'))}</code></pre>`;
          codeBlockLines = [];
          inCodeBlock = false;
        } else {
          inCodeBlock = true;
        }
        continue;
      }

      if (inCodeBlock) {
        codeBlockLines.push(line);
        continue;
      }

      if (!trimmed) {
        if (inList) {
          html += `</${listType}>`;
          inList = false;
          listType = null;
        }
        if (inBlockquote) {
          html += '</blockquote>';
          inBlockquote = false;
        }
        continue;
      }

      if (trimmed.startsWith('>')) {
        if (inList) {
          html += `</${listType}>`;
          inList = false;
          listType = null;
        }
        if (!inBlockquote) {
          html += '<blockquote>';
          inBlockquote = true;
        }
        const quoteContent = line.replace(/^\s*>\s?/, '');
        html += `<p>${inlineMarkdown(escapeHtml(quoteContent))}</p>`;
        continue;
      } else {
        if (inBlockquote) {
          html += '</blockquote>';
          inBlockquote = false;
        }
      }

      const headingMatch = line.match(/^(#{1,6})\s+(.*)$/);
      if (headingMatch) {
        if (inList) { html += `</${listType}>`; inList = false; listType = null; }
        const level = headingMatch[1].length;
        const headingText = headingMatch[2];
        html += `<h${level}>${inlineMarkdown(escapeHtml(headingText))}</h${level}>`;
        continue;
      }

      const ulMatch = line.match(/^(\s*)[-\*\+]\s+(.*)$/);
      if (ulMatch) {
        if (!inList || listType !== 'ul') {
          if (inList) html += `</${listType}>`;
          html += '<ul>';
          inList = true;
          listType = 'ul';
        }
        const itemText = ulMatch[2];
        html += `<li>${inlineMarkdown(escapeHtml(itemText))}</li>`;
        continue;
      }

      const olMatch = line.match(/^(\s*)\d+\.\s+(.*)$/);
      if (olMatch) {
        if (!inList || listType !== 'ol') {
          if (inList) html += `</${listType}>`;
          html += '<ol>';
          inList = true;
          listType = 'ol';
        }
        const itemText = olMatch[2];
        html += `<li>${inlineMarkdown(escapeHtml(itemText))}</li>`;
        continue;
      }

      if (inList) { html += `</${listType}>`; inList = false; listType = null; }
      html += `<p>${inlineMarkdown(escapeHtml(trimmed))}</p>`;
    }

    if (inList) html += `</${listType}>`;
    if (inBlockquote) html += '</blockquote>';
    if (inCodeBlock) html += `<pre><code>${escapeHtml(codeBlockLines.join('\n'))}</code></pre>`;

    return html;
  }

  function inlineMarkdown(text) {
    text = text.replace(/`([^`]+)`/g, '<code>$1</code>');
    text = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    text = text.replace(/__([^_]+)__/g, '<strong>$1</strong>');
    text = text.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    text = text.replace(/_([^_]+)_/g, '<em>$1</em>');
    text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
    text = text.replace(/(?<!href=")(https?:\/\/[^\s<]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>');
    return text;
  }

  // --- Rendering Functions ---

  function renderHeroStats() {
    const counts = countItems(siteData);
    if (!heroStats) return;
    heroStats.innerHTML = `
      <div class="stat-item">
        <span class="stat-value">${counts.files}</span>
        <span class="stat-label">Documentos</span>
      </div>
      <div class="stat-item">
        <span class="stat-value">${siteData.children.length}</span>
        <span class="stat-label">Categorias</span>
      </div>
      <div class="stat-item">
        <span class="stat-value">${counts.folders}</span>
        <span class="stat-label">Seções</span>
      </div>
    `;
  }

  function renderCategories() {
    if (!categoriesGrid) return;
    categoriesGrid.innerHTML = '';

    const glowColors = [
      'rgba(255, 255, 255, 0.05)',  // White glow
      'rgba(0, 150, 255, 0.08)',   // Blue glow
      'rgba(255, 0, 128, 0.08)',   // Pink glow
      'rgba(0, 255, 150, 0.08)',   // Green glow
      'rgba(255, 170, 0, 0.08)',   // Orange glow
      'rgba(150, 0, 255, 0.08)',   // Purple glow
      'rgba(0, 255, 255, 0.08)'    // Cyan glow
    ];

    siteData.children.forEach((category, index) => {
      const counts = countItems(category);
      const icon = categoryIcons[category.name] || '📂';
      const num = String(index + 1).padStart(2, '0');
      const glowColor = glowColors[index % glowColors.length];

      const card = document.createElement('div');
      card.className = 'hero-session-card';
      card.style.setProperty('--glow-color', glowColor);
      card.style.setProperty('--card-index', index);
      card.id = `category-${index}`;

      card.innerHTML = `
        <div class="hero-session-card-top">
          <span class="hero-session-number">MÓDULO ${num}</span>
          <h2 class="hero-session-title">${icon} ${cleanDisplayName(category.displayName || category.name)}</h2>
          <p class="hero-session-desc">Explore a estrutura completa de arquivos, documentos e materiais organizados para esta seção de conhecimento.</p>
        </div>
        <div class="hero-session-card-bottom">
          <div class="hero-session-meta">
            <span class="hero-session-meta-item">
              ${icons.folder}
              <span>${counts.folders} Seções</span>
            </span>
            <span class="hero-session-meta-item">
              ${icons.file}
              <span>${counts.files} Documentos</span>
            </span>
          </div>
          <button class="hero-session-btn">
            Acessar Biblioteca
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </button>
        </div>
      `;

      card.addEventListener('click', () => navigateTo([index]));
      card.addEventListener('mousemove', handleCardMouseMove);

      categoriesGrid.appendChild(card);
    });
  }

  function renderFolder(path) {
    const node = getNodeAtPath(path);
    if (!node) return;

    const icon = getIconForNode(node);
    folderTitle.textContent = `${icon} ${cleanDisplayName(node.displayName || node.name)}`;

    const subfolders = (node.children || []).filter(c => c.type === 'folder');
    const files = (node.children || []).filter(c => c.type === 'file');

    const parts = [];
    if (subfolders.length > 0) parts.push(`${subfolders.length} ${subfolders.length === 1 ? 'pasta' : 'pastas'}`);
    if (files.length > 0) parts.push(`${files.length} ${files.length === 1 ? 'documento' : 'documentos'}`);
    folderDesc.textContent = parts.join(' · ') || 'Pasta vazia';

    folderGrid.innerHTML = '';

    subfolders.forEach((child) => {
      const childIndex = node.children.indexOf(child);
      const childPath = [...path, childIndex];
      const childCounts = countItems(child);
      const childIcon = getIconForNode(child);
      const num = extractNumber(child.name);

      const card = document.createElement('div');
      card.className = 'glass-card';
      card.style.setProperty('--card-index', childIndex);
      card.id = `folder-item-${path.join('-')}-${childIndex}`;

      const subParts = [];
      const subFolders = (child.children || []).filter(c => c.type === 'folder').length;
      const subFiles = childCounts.files;
      if (subFolders > 0) subParts.push(`${subFolders} ${subFolders === 1 ? 'pasta' : 'pastas'}`);
      if (subFiles > 0) subParts.push(`${subFiles} ${subFiles === 1 ? 'doc' : 'docs'}`);

      card.innerHTML = `
        <div class="card-number">${num || `0${childIndex + 1}`}</div>
        <div class="card-title">${childIcon} ${cleanDisplayName(child.displayName || child.name)}</div>
        <div class="card-meta">
          <span class="card-meta-item">
            ${icons.folder}
            <span>${subParts.join(' · ') || 'Pasta vazia'}</span>
          </span>
        </div>
        <div class="card-arrow">${icons.arrow}</div>
      `;

      card.addEventListener('click', () => navigateTo(childPath));
      card.addEventListener('mousemove', handleCardMouseMove);
      folderGrid.appendChild(card);
    });

    files.forEach((child, fIdx) => {
      const childIndex = node.children.indexOf(child);
      const childPath = [...path, childIndex];
      const { icon, meta } = getFileIconAndMeta(child);

      const card = document.createElement('div');
      card.className = 'file-card';
      card.style.setProperty('--card-index', subfolders.length + fIdx);
      card.id = `file-item-${path.join('-')}-${childIndex}`;

      card.innerHTML = `
        <div class="file-icon">${icon}</div>
        <div class="file-info">
          <div class="file-title">${child.displayName || child.name}</div>
          <div class="file-subtitle">${meta}</div>
        </div>
      `;

      card.addEventListener('click', () => navigateTo(childPath));
      folderGrid.appendChild(card);
    });

    if (node.children.length === 0) {
      folderGrid.innerHTML = `
        <div class="empty-folder">
          <div class="empty-folder-icon">📂</div>
          <p>Esta pasta está vazia.</p>
        </div>
      `;
    }
  }

  function renderArticle(path) {
    const node = getNodeAtPath(path);
    if (!node || node.type !== 'file') return;

    articleTitle.textContent = node.displayName || node.name;

    const pathNames = [];
    let tempPath = [];
    for (const idx of path) {
      tempPath.push(idx);
      const n = getNodeAtPath(tempPath);
      if (n) pathNames.push(cleanDisplayName(n.displayName || n.name));
    }

    const { icon, meta } = getFileIconAndMeta(node);

    articleMeta.innerHTML = `
      <span class="article-meta-item">
        ${icon} ${meta}
      </span>
      <span class="article-meta-item">
        ${icons.folder} ${pathNames.slice(0, -1).join(' › ')}
      </span>
    `;

    const type = node.fileType || 'txt';
    if (type === 'pdf') {
      articleBody.innerHTML = `
        <div class="iframe-wrapper">
          <iframe src="${node.path}" title="${escapeHtml(node.displayName || node.name)}"></iframe>
        </div>
      `;
    } else if (type === 'html') {
      articleBody.innerHTML = `
        <div class="iframe-wrapper">
          <iframe src="${node.path}" title="${escapeHtml(node.displayName || node.name)}"></iframe>
        </div>
      `;
    } else if (type === 'image') {
      articleBody.innerHTML = `
        <div class="image-wrapper">
          <img src="${node.path}" alt="${escapeHtml(node.displayName || node.name)}">
          <div class="image-caption">${escapeHtml(node.displayName || node.name)}</div>
        </div>
      `;
    } else if (type === 'zip') {
      articleBody.innerHTML = `
        <div class="zip-download-card">
          <div class="zip-icon">📦</div>
          <div class="zip-title">${escapeHtml(node.displayName || node.name)}</div>
          <p>Este é um arquivo compactado (ZIP). Você pode baixá-lo diretamente para extrair o conteúdo.</p>
          <a href="${node.path}" class="zip-btn" download>Baixar Arquivo ZIP</a>
        </div>
      `;
    } else if (type === 'md') {
      articleBody.innerHTML = `<div class="markdown-content">${parseMarkdown(node.content)}</div>`;
    } else if (type === 'docx') {
      articleBody.innerHTML = formatRawText(node.content);
    } else {
      articleBody.innerHTML = formatRawText(node.content);
    }
  }

  // --- Navigation ---

  function navigateTo(path) {
    currentPath = path;
    searchInput.value = '';

    const node = getNodeAtPath(path);
    if (!node) {
      showView('categories');
      return;
    }

    if (path.length === 0) {
      showView('categories');
    } else if (node.type === 'file') {
      renderArticle(path);
      showView('article');
    } else {
      renderFolder(path);
      showView('folder');
    }

    updateBreadcrumb(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (path.length > 0) {
      const hashPath = path.join('/');
      history.pushState({ path }, '', `#${hashPath}`);
    } else {
      history.pushState({ path: [] }, '', window.location.pathname);
    }
  }

  function showView(viewName) {
    currentView = viewName;

    categoriesView.classList.remove('active');
    folderView.classList.remove('active');
    articleView.classList.remove('active');
    searchView.classList.remove('active');

    switch (viewName) {
      case 'categories':
        categoriesView.classList.add('active');
        breadcrumb.classList.remove('visible');
        // Hide header on homepage categories view to let cinematic hero dominate the viewport
        document.getElementById('main-header').style.display = 'none';
        break;
      case 'folder':
        folderView.classList.add('active');
        breadcrumb.classList.add('visible');
        document.getElementById('main-header').style.display = 'block';
        document.getElementById('main-content').style.paddingTop = `calc(var(--header-height) + var(--breadcrumb-height) + 16px)`;
        break;
      case 'article':
        articleView.classList.add('active');
        breadcrumb.classList.add('visible');
        document.getElementById('main-header').style.display = 'block';
        document.getElementById('main-content').style.paddingTop = `calc(var(--header-height) + var(--breadcrumb-height) + 16px)`;
        break;
      case 'search':
        searchView.classList.add('active');
        breadcrumb.classList.remove('visible');
        document.getElementById('main-header').style.display = 'block';
        document.getElementById('main-content').style.paddingTop = `calc(var(--header-height) + 24px)`;
        break;
    }
  }

  function updateBreadcrumb(path) {
    breadcrumbInner.innerHTML = `
      <span class="breadcrumb-item breadcrumb-home" data-navigate="home">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        Início
      </span>
    `;

    let tempPath = [];
    path.forEach((idx, i) => {
      tempPath.push(idx);
      const node = getNodeAtPath([...tempPath]);
      if (!node) return;

      const isLast = i === path.length - 1;
      const currentTempPath = [...tempPath];

      breadcrumbInner.innerHTML += `
        <span class="breadcrumb-separator">${icons.chevron}</span>
        <span class="breadcrumb-item ${isLast ? 'active' : ''}" data-path="${currentTempPath.join(',')}">
          ${cleanDisplayName(node.displayName || node.name)}
        </span>
      `;
    });

    breadcrumbInner.querySelectorAll('.breadcrumb-item').forEach(item => {
      item.addEventListener('click', () => {
        if (item.dataset.navigate === 'home') {
          navigateTo([]);
        } else if (item.dataset.path) {
          const pathParts = item.dataset.path.split(',').map(Number);
          navigateTo(pathParts);
        }
      });
    });
  }

  // --- Search ---

  function buildSearchIndex() {
    const idxList = [];

    function traverse(node, path, breadcrumbs) {
      if (node.type === 'file') {
        idxList.push({
          type: 'file',
          name: node.displayName || node.name,
          path: [...path],
          breadcrumbs: [...breadcrumbs],
          content: node.content || ''
        });
      }

      if (node.children) {
        node.children.forEach((child, idx) => {
          const newBreadcrumbs = [...breadcrumbs, cleanDisplayName(node.displayName || node.name)];
          traverse(child, [...path, idx], newBreadcrumbs);
        });
      }
    }

    siteData.children.forEach((child, idx) => {
      traverse(child, [idx], []);
    });

    return idxList;
  }

  function performSearch(query) {
    if (!query || query.length < 2) {
      showView(currentPath.length === 0 ? 'categories' :
               getNodeAtPath(currentPath)?.type === 'file' ? 'article' : 'folder');
      return;
    }

    const terms = query.toLowerCase().split(/\s+/).filter(t => t.length >= 2);
    if (terms.length === 0) return;

    const results = [];

    searchIndex.forEach(item => {
      const searchText = `${item.name} ${item.content}`.toLowerCase();
      const allMatch = terms.every(term => searchText.includes(term));

      if (allMatch) {
        let score = 0;
        const nameLower = item.name.toLowerCase();
        terms.forEach(term => {
          if (nameLower.includes(term)) score += 10;
          const regex = new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
          const matches = item.content.match(regex);
          if (matches) score += matches.length;
        });

        let snippet = '';
        const contentLower = item.content.toLowerCase();
        const firstTermIdx = contentLower.indexOf(terms[0]);
        if (firstTermIdx >= 0) {
          const start = Math.max(0, firstTermIdx - 80);
          const end = Math.min(item.content.length, firstTermIdx + 200);
          snippet = (start > 0 ? '...' : '') + item.content.substring(start, end).replace(/\n/g, ' ') + (end < item.content.length ? '...' : '');
        } else {
          snippet = item.content.substring(0, 250).replace(/\n/g, ' ') + '...';
        }

        results.push({ ...item, score, snippet });
      }
    });

    results.sort((a, b) => b.score - a.score);

    renderSearchResults(results, query);
    showView('search');
  }

  function renderSearchResults(results, query) {
    searchResultsTitle.textContent = `${results.length} resultado${results.length !== 1 ? 's' : ''} para "${query}"`;

    if (results.length === 0) {
      searchResultsList.innerHTML = `
        <div class="no-results">
          <div class="no-results-icon">🔍</div>
          <p>Nenhum resultado encontrado para "<strong>${escapeHtml(query)}</strong>"</p>
          <p style="margin-top: 8px; font-size: 0.8rem;">Tente outros termos ou palavras mais curtas.</p>
        </div>
      `;
      return;
    }

    searchResultsList.innerHTML = '';
    const terms = query.toLowerCase().split(/\s+/).filter(t => t.length >= 2);

    results.slice(0, 30).forEach(result => {
      const item = document.createElement('div');
      item.className = 'search-result-item';

      let highlightedSnippet = escapeHtml(result.snippet);
      terms.forEach(term => {
        const regex = new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
        highlightedSnippet = highlightedSnippet.replace(regex, '<span class="search-highlight">$1</span>');
      });

      const pathStr = result.breadcrumbs.filter(b => b).join(' › ');

      item.innerHTML = `
        <div class="search-result-path">${pathStr}</div>
        <div class="search-result-title">${escapeHtml(result.name)}</div>
        <div class="search-result-snippet">${highlightedSnippet}</div>
      `;

      item.addEventListener('click', () => {
        navigateTo(result.path);
      });

      searchResultsList.appendChild(item);
    });
  }

  // --- Card Mouse Follow Effect ---
  function handleCardMouseMove(e) {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty('--mouse-x', `${x}%`);
    card.style.setProperty('--mouse-y', `${y}%`);
  }

  // --- App Initialization (Post-auth) ---
  function initApp() {
    renderHeroStats();
    renderCategories();
    
    // Build search index
    searchIndex = buildSearchIndex();

    // Bind event listeners
    logoHome.addEventListener('click', () => navigateTo([]));

    searchInput.addEventListener('input', (e) => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        performSearch(e.target.value.trim());
      }, 300);
    });

    document.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInput.focus();
      }
      if (e.key === 'Escape') {
        searchInput.blur();
        if (currentView === 'search') {
          searchInput.value = '';
          navigateTo(currentPath);
        }
      }
    });

    document.getElementById('btn-expand-all').addEventListener('click', () => {
      if (currentView !== 'categories') navigateTo([]);
    });

    document.getElementById('btn-collapse-all').addEventListener('click', () => {
      navigateTo([]);
    });

    // Logout via Header Button
    const logoutBtn = document.getElementById('btn-logout');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('library_pass');
        window.location.reload();
      });
    }

    // Init Video Looping and Fades
    initVideoController();
    
    // Handle initial routing via URL hash
    handleInitialHash();
    history.replaceState({ path: currentPath }, '', window.location.href);
  }

  // --- Initial Setup and Event Bindings (Pre-auth) ---
  window.addEventListener('popstate', (e) => {
    if (!siteData) return; // Do nothing if not logged in
    
    if (e.state && e.state.path) {
      currentPath = e.state.path;
      const node = getNodeAtPath(currentPath);
      if (!node || currentPath.length === 0) {
        showView('categories');
      } else if (node.type === 'file') {
        renderArticle(currentPath);
        showView('article');
      } else {
        renderFolder(currentPath);
        showView('folder');
      }
      updateBreadcrumb(currentPath);
    } else {
      currentPath = [];
      showView('categories');
      updateBreadcrumb([]);
    }
  });

  function handleInitialHash() {
    const hash = window.location.hash.slice(1);
    if (hash) {
      const path = hash.split('/').map(Number);
      const node = getNodeAtPath(path);
      if (node) {
        navigateTo(path);
        return;
      }
    }
    navigateTo([]);
  }

  // Bind Login submission events (caso elementos existam na página)
  const passInput = document.getElementById('login-password');
  const submitBtn = document.getElementById('login-submit-btn');

  if (submitBtn && passInput) {
    submitBtn.addEventListener('click', () => {
      const pass = passInput.value.trim() || 'ALEXANDRIA';
      if (pass) {
        tryAuthentication(pass, true);
      }
    });

    passInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const pass = passInput.value.trim() || 'ALEXANDRIA';
        if (pass) {
          tryAuthentication(pass, true);
        }
      }
    });
  }

  // Inicialização Automática com Acesso Livre e Cerimônia de Boas-Vindas
  // Sem tela de login - Acesso total e irrestrito ao sistema Galadriel
  tryAuthentication('ALEXANDRIA', true).catch((err) => {
    console.error("Falha ao inicializar biblioteca:", err);
    document.getElementById('main-header').style.display = 'block';
    document.getElementById('main-content').style.display = 'block';
    document.getElementById('main-footer').style.display = 'block';
    initApp();
  });

  // Init dynamic background system immediately
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDynamicBackgrounds);
  } else {
    initDynamicBackgrounds();
  }

  /* ========================================================
     Dynamic 8-Shader Personal OS Suite & Control System
     Shaders: GhostFibers, GradientWaves, LiquidChrome, AeroShards,
              CosmicGalaxy, CyberGrid, PlasmaLightning, BalatroFlow
     ======================================================== */
  function initDynamicBackgrounds() {
    const container = document.getElementById('dynamic-bg-container');
    if (!container) return;

    const SHADER_NAMES = [
      '✦ 1. GhostFibers',
      '✦ 2. GradientWaves',
      '✦ 3. LiquidChrome',
      '✦ 4. AeroShards',
      '✦ 5. CosmicGalaxy',
      '✦ 6. CyberGrid',
      '✦ 7. PlasmaLightning',
      '✦ 8. BalatroFlow'
    ];
    const TOTAL_SHADERS = 8;
    let activeIndex = 0;
    let prevIndex = -1;
    let transitionEndTime = 0;
    let isAutoRotating = true;
    let autoInterval = null;

    const renderers = new Array(TOTAL_SHADERS).fill(null);
    const wrappers = [];
    for (let i = 0; i < TOTAL_SHADERS; i++) {
      wrappers.push(document.getElementById('bg-wrapper-' + i));
    }

    const titleEl = document.getElementById('active-shader-name');
    const autoBtn = document.getElementById('btn-shader-auto');
    const autoIcon = document.getElementById('auto-cycle-icon');
    const pills = document.querySelectorAll('.shader-pill');

    function updatePillsUI(idx) {
      if (titleEl && SHADER_NAMES[idx]) {
        titleEl.textContent = SHADER_NAMES[idx];
      }
      pills.forEach((p, i) => {
        if (i === idx) {
          p.classList.add('active');
        } else {
          p.classList.remove('active');
        }
      });
    }

    window.switchShader = function(idx) {
      if (idx < 0 || idx >= TOTAL_SHADERS || idx === activeIndex) return;
      prevIndex = activeIndex;
      activeIndex = idx;
      transitionEndTime = performance.now() + 1800;
      wrappers.forEach((w, i) => {
        if (w) {
          if (i === idx) w.classList.add('active');
          else w.classList.remove('active');
        }
      });
      updatePillsUI(idx);
      if (typeof renderers[activeIndex] === 'function') {
        renderers[activeIndex](performance.now());
      }
    };

    function startAutoRotation() {
      if (autoInterval) clearInterval(autoInterval);
      autoInterval = setInterval(() => {
        if (!isAutoRotating) return;
        const nextIdx = (activeIndex + 1) % TOTAL_SHADERS;
        window.switchShader(nextIdx);
      }, 8500);
    }
    startAutoRotation();

    window.toggleShaderAuto = function() {
      isAutoRotating = !isAutoRotating;
      if (autoBtn) {
        if (isAutoRotating) {
          autoBtn.classList.remove('paused');
          autoBtn.classList.add('active');
          if (autoIcon) autoIcon.textContent = '⏵';
        } else {
          autoBtn.classList.add('paused');
          autoBtn.classList.remove('active');
          if (autoIcon) autoIcon.textContent = '⏸';
        }
      }
    };

    if (autoBtn) {
      autoBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        window.toggleShaderAuto();
      });
    }

    // Common WebGL helper
    function createGLContext(canvasId) {
      const canvas = document.getElementById(canvasId);
      if (!canvas) return null;
      const gl = canvas.getContext('webgl2', { antialias: false, alpha: false, preserveDrawingBuffer: false }) ||
                 canvas.getContext('webgl', { antialias: false, alpha: false, preserveDrawingBuffer: false });
      if (!gl) return null;
      return { canvas, gl };
    }

    function createShader(gl, type, source) {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.warn('Shader compile failed:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    }

    function createProgram(gl, vsSource, fsSource) {
      const vs = createShader(gl, gl.VERTEX_SHADER, vsSource);
      const fs = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
      if (!vs || !fs) return null;
      const program = gl.createProgram();
      gl.attachShader(program, vs);
      gl.attachShader(program, fs);
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.warn('Program link failed:', gl.getProgramInfoLog(program));
        return null;
      }
      return program;
    }

    function setupQuad(gl, program) {
      const positionLoc = gl.getAttribLocation(program, 'position');
      const buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        -1, -1,
         1, -1,
        -1,  1,
        -1,  1,
         1, -1,
         1,  1
      ]), gl.STATIC_DRAW);
      gl.enableVertexAttribArray(positionLoc);
      gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);
    }

    // Common Quad Vertex Shader
    const vsSource = `#version 300 es
    in vec2 position;
    void main() {
      gl_Position = vec4(position, 0.0, 1.0);
    }`;

    // Common Global Mouse Tracker
    let mouseX = 0.5, mouseY = 0.5;
    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX / window.innerWidth;
      mouseY = 1.0 - (e.clientY / window.innerHeight);
    }, { passive: true });

    // 0. GhostFibers Background (React Bits)
    (function initGhostFibers() {
      const ctx = createGLContext('canvas-ghostfibers');
      if (!ctx) return;
      const { canvas, gl } = ctx;

      const fsSource = `#version 300 es
      precision highp float;

      uniform vec2 uResolution;
      uniform float uTime;
      uniform float uSpeed;
      uniform float uScale;
      uniform float uRotation;
      uniform float uLayers;
      uniform float uWaveAmplitude;
      uniform float uWaveFrequency;
      uniform float uWaveSpeed;
      uniform float uLayerSpeed;
      uniform float uTwist;
      uniform float uTwistFrequency;
      uniform float uTwistSpeed;
      uniform float uLineFrequency;
      uniform float uLineSpacing;
      uniform float uGlowFalloff;
      uniform float uGlowIntensity;
      uniform float uBrightness;
      uniform float uBlueBoost;
      uniform float uVignette;
      uniform float uGrain;
      uniform float uRotationSpeed;
      uniform float uLightMode;
      uniform vec3 uLineColor;
      uniform vec3 uGlowColor;

      out vec4 fragColor;

      #define MAX_LAYERS 10

      mat2 rotate2d(float angle) {
        float sine = sin(angle);
        float cosine = cos(angle);
        return mat2(cosine, -sine, sine, cosine);
      }

      float grainHash(vec2 point) {
        point = floor(point);
        float hash = 52.9829189 * fract(dot(point, vec2(0.065, 0.005)));
        return fract(hash);
      }

      float layeredGrain(vec2 fragmentPixel) {
        vec2 point = mod(fragmentPixel + vec2(uTime * 30.0, -uTime * 21.0), 1024.0);
        vec2 rotated = mat2(0.8, -0.5, 0.5, 0.8) * point;
        float grain = 0.0;
        grain += 0.40 * grainHash(rotated);
        grain += 0.25 * grainHash(rotated * 2.0 + 17.0);
        grain += 0.20 * grainHash(rotated * 4.0 + 47.0);
        grain += 0.10 * grainHash(rotated * 8.0 + 113.0);
        grain += 0.05 * grainHash(rotated * 16.0 + 191.0);
        return grain;
      }

      void main() {
        vec2 resolution = max(uResolution, vec2(1.0));
        vec2 uv = (2.0 * gl_FragCoord.xy - resolution) / resolution.y;
        float time = uTime * uSpeed;
        vec3 backdrop = mix(vec3(0.015, 0.002, 0.005), vec3(1.0), step(0.5, uLightMode));
        vec3 centerTone = max(uLineColor * 0.85567 - uGlowColor * 0.06186, vec3(0.0));
        vec3 cloudTone = uLineColor * 0.19588 + uGlowColor * 0.2268;
        vec2 p = uv;
        p /= max(uScale, 0.05);
        p = rotate2d(radians(uRotation) + time * uRotationSpeed) * p;

        vec3 accumulator = vec3(0.0);
        float activeLayers = clamp(uLayers, 1.0, float(MAX_LAYERS));

        for (int i = 0; i < MAX_LAYERS; i++) {
          float layerIndex = float(i);
          if (layerIndex >= activeLayers) break;
          float layerFraction = layerIndex / max(activeLayers - 1.0, 1.0);
          float progress = layerIndex + 1.0;
          float layerTime = time + progress * uLayerSpeed;

          vec2 q = p;
          q += vec2(
            sin(layerTime * uWaveSpeed + p.y * uWaveFrequency),
            cos(layerTime * 0.8 * uWaveSpeed + p.x * (uWaveFrequency * 0.9))
          ) * uWaveAmplitude;

          float angle = length(q) * uTwistFrequency - layerTime * uTwistSpeed;
          q = rotate2d(angle * uTwist) * q;

          float wave = sin(q.x * uLineFrequency + layerTime);
          float curve = cos(q.y * (uLineFrequency * 0.8) - layerTime * 1.2);
          float pattern = 0.5 + 0.5 * sin((wave + curve) * uLineSpacing);

          float lineGlow = pow(pattern, max(uGlowFalloff, 0.1)) * uGlowIntensity;
          vec3 layerTone = mix(cloudTone, centerTone, layerFraction);
          accumulator += layerTone * lineGlow;
        }

        accumulator *= uBrightness;
        vec3 blended = accumulator + backdrop;
        float diagonal = length(uv);
        blended = mix(blended, backdrop, clamp(diagonal * (uVignette * 0.5), 0.0, 1.0));
        blended += (layeredGrain(gl_FragCoord.xy) - 0.5) * uGrain;
        fragColor = vec4(clamp(blended, 0.0, 1.0), 1.0);
      }`;

      const program = createProgram(gl, vsSource, fsSource);
      if (!program) return;
      setupQuad(gl, program);

      const uRes = gl.getUniformLocation(program, 'uResolution');
      const uTime = gl.getUniformLocation(program, 'uTime');
      const uSpeed = gl.getUniformLocation(program, 'uSpeed');
      const uScale = gl.getUniformLocation(program, 'uScale');
      const uRotation = gl.getUniformLocation(program, 'uRotation');
      const uRotationSpeed = gl.getUniformLocation(program, 'uRotationSpeed');
      const uLayers = gl.getUniformLocation(program, 'uLayers');
      const uWaveAmplitude = gl.getUniformLocation(program, 'uWaveAmplitude');
      const uWaveFrequency = gl.getUniformLocation(program, 'uWaveFrequency');
      const uWaveSpeed = gl.getUniformLocation(program, 'uWaveSpeed');
      const uLayerSpeed = gl.getUniformLocation(program, 'uLayerSpeed');
      const uTwist = gl.getUniformLocation(program, 'uTwist');
      const uTwistFrequency = gl.getUniformLocation(program, 'uTwistFrequency');
      const uTwistSpeed = gl.getUniformLocation(program, 'uTwistSpeed');
      const uLineFrequency = gl.getUniformLocation(program, 'uLineFrequency');
      const uLineSpacing = gl.getUniformLocation(program, 'uLineSpacing');
      const uGlowFalloff = gl.getUniformLocation(program, 'uGlowFalloff');
      const uGlowIntensity = gl.getUniformLocation(program, 'uGlowIntensity');
      const uBrightness = gl.getUniformLocation(program, 'uBrightness');
      const uBlueBoost = gl.getUniformLocation(program, 'uBlueBoost');
      const uVignette = gl.getUniformLocation(program, 'uVignette');
      const uGrain = gl.getUniformLocation(program, 'uGrain');
      const uLightMode = gl.getUniformLocation(program, 'uLightMode');
      const uLineColor = gl.getUniformLocation(program, 'uLineColor');
      const uGlowColor = gl.getUniformLocation(program, 'uGlowColor');

      function resize() {
        const scale = 0.5;
        const width = Math.max(160, Math.round(window.innerWidth * scale));
        const height = Math.max(160, Math.round(window.innerHeight * scale));
        if (canvas.width !== width || canvas.height !== height) {
          canvas.width = width;
          canvas.height = height;
          gl.viewport(0, 0, width, height);
        }
      }
      window.addEventListener('resize', resize, { passive: true });
      resize();

      let startTime = performance.now();
      renderers[0] = function renderGhostFibers(now) {
        gl.useProgram(program);
        const elapsed = (now - startTime) * 0.001;

        gl.uniform2f(uRes, canvas.width, canvas.height);
        gl.uniform1f(uTime, elapsed);
        gl.uniform1f(uSpeed, 0.2);
        gl.uniform1f(uScale, 2.0);
        gl.uniform1f(uRotation, 0.0);
        gl.uniform1f(uRotationSpeed, 0.25);
        gl.uniform1f(uLayers, 4.0);
        gl.uniform1f(uWaveAmplitude, 0.015);
        gl.uniform1f(uWaveFrequency, 3.0);
        gl.uniform1f(uWaveSpeed, 0.15);
        gl.uniform1f(uLayerSpeed, 0.08);
        gl.uniform1f(uTwist, 0.1);
        gl.uniform1f(uTwistFrequency, 5.0);
        gl.uniform1f(uTwistSpeed, 1.2);
        gl.uniform1f(uLineFrequency, 5.0);
        gl.uniform1f(uLineSpacing, 2.0);
        gl.uniform1f(uGlowFalloff, 8.5);
        gl.uniform1f(uGlowIntensity, 2.8);
        gl.uniform1f(uBrightness, 2.7);
        gl.uniform1f(uBlueBoost, 0.0);
        gl.uniform1f(uVignette, 0.75);
        gl.uniform1f(uGrain, 0.04);
        gl.uniform1f(uLightMode, 0.0);
        // Vermelho Neon Blaster Sanguine Blood Red
        gl.uniform3f(uLineColor, 1.0, 0.02, 0.08);
        gl.uniform3f(uGlowColor, 1.0, 0.06, 0.16);

        gl.drawArrays(gl.TRIANGLES, 0, 6);
      };
    })();

    // 1. GradientWaves Background (React Bits)
    (function initGradientWaves() {
      const ctx = createGLContext('canvas-gradientwaves');
      if (!ctx) return;
      const { canvas, gl } = ctx;

      const fsSource = `#version 300 es
      precision highp float;
      uniform vec2 iResolution;
      uniform float iTime;
      uniform float uSpeed;
      uniform float uAmplitude;
      uniform float uWaveScale;
      uniform float uWaveRatio;
      uniform float uSwell;
      uniform float uTurbulence;
      uniform float uTilt;
      uniform float uZoom;
      uniform float uHeight;
      uniform float uFogDepth;
      uniform float uSteps;
      uniform float uBrightness;
      uniform float uOpacity;
      uniform float uGrain;
      uniform float uGrainIntensity;
      uniform vec2 uMouse;
      uniform float uParallax;
      uniform int uEnableMouse;
      uniform vec3 uHorizonColor;
      uniform vec3 uWaveColor;
      uniform vec3 uCrestColor;

      out vec4 fragColor;

      float hash21(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
      }

      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        float a = hash21(i);
        float b = hash21(i + vec2(1.0, 0.0));
        float c = hash21(i + vec2(0.0, 1.0));
        float d = hash21(i + vec2(1.0, 1.0));
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
      }

      float fbm(vec2 p) {
        float v = 0.0;
        float a = 0.5;
        mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);
        for (int i = 0; i < 4; i++) {
          v += a * noise(p);
          p = rot * p * 2.0;
          a *= 0.5;
        }
        return v;
      }

      void main() {
        vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution) / iResolution.y;
        float t = iTime * uSpeed;

        vec2 mOffset = (uMouse - 0.5) * uParallax;
        uv += mOffset;

        float wave = sin(uv.x * uWaveScale * 3.0 + t) * cos(uv.y * uWaveScale * 2.0 - t * 0.8);
        float n = fbm(uv * uWaveScale * 2.5 + vec2(t * 0.3, wave * 0.5));

        float height = uv.y * uHeight + wave * uAmplitude + n * (uTurbulence * 0.1);
        float shape = smoothstep(-0.6, 0.6, height);

        vec3 col = mix(uHorizonColor, uWaveColor, shape);
        col = mix(col, uCrestColor, pow(shape, 3.5));

        float grain = (hash21(gl_FragCoord.xy + fract(iTime)) - 0.5) * uGrainIntensity;
        col += grain;
        col *= uBrightness;

        float vig = 1.0 - length(uv) * 0.6;
        col *= max(vig, 0.2);

        fragColor = vec4(col, uOpacity);
      }`;

      const program = createProgram(gl, vsSource, fsSource);
      if (!program) return;
      setupQuad(gl, program);

      const uRes = gl.getUniformLocation(program, 'iResolution');
      const uTime = gl.getUniformLocation(program, 'iTime');
      const uSpeed = gl.getUniformLocation(program, 'uSpeed');
      const uAmp = gl.getUniformLocation(program, 'uAmplitude');
      const uScale = gl.getUniformLocation(program, 'uWaveScale');
      const uRatio = gl.getUniformLocation(program, 'uWaveRatio');
      const uSwell = gl.getUniformLocation(program, 'uSwell');
      const uTurb = gl.getUniformLocation(program, 'uTurbulence');
      const uTilt = gl.getUniformLocation(program, 'uTilt');
      const uZoom = gl.getUniformLocation(program, 'uZoom');
      const uHeight = gl.getUniformLocation(program, 'uHeight');
      const uFog = gl.getUniformLocation(program, 'uFogDepth');
      const uSteps = gl.getUniformLocation(program, 'uSteps');
      const uBright = gl.getUniformLocation(program, 'uBrightness');
      const uOpacity = gl.getUniformLocation(program, 'uOpacity');
      const uGrain = gl.getUniformLocation(program, 'uGrain');
      const uGrainInt = gl.getUniformLocation(program, 'uGrainIntensity');
      const uMouse = gl.getUniformLocation(program, 'uMouse');
      const uParallax = gl.getUniformLocation(program, 'uParallax');
      const uEnMouse = gl.getUniformLocation(program, 'uEnableMouse');
      const uHorizCol = gl.getUniformLocation(program, 'uHorizonColor');
      const uWaveCol = gl.getUniformLocation(program, 'uWaveColor');
      const uCrestCol = gl.getUniformLocation(program, 'uCrestColor');

      function resize() {
        const scale = 0.5;
        const width = Math.max(160, Math.round(window.innerWidth * scale));
        const height = Math.max(160, Math.round(window.innerHeight * scale));
        if (canvas.width !== width || canvas.height !== height) {
          canvas.width = width;
          canvas.height = height;
          gl.viewport(0, 0, width, height);
        }
      }
      window.addEventListener('resize', resize, { passive: true });
      resize();

      let startTime = performance.now();
      renderers[1] = function renderGradientWaves(now) {
        gl.useProgram(program);
        const elapsed = (now - startTime) * 0.001;

        gl.uniform2f(uRes, canvas.width, canvas.height);
        gl.uniform1f(uTime, elapsed);
        gl.uniform1f(uSpeed, 0.45);
        gl.uniform1f(uAmp, 3.2);
        gl.uniform1f(uScale, 0.75);
        gl.uniform1f(uRatio, 0.95);
        gl.uniform1f(uSwell, 42.0);
        gl.uniform1f(uTurb, 25.0);
        gl.uniform1f(uTilt, 1.11);
        gl.uniform1f(uZoom, 1.0);
        gl.uniform1f(uHeight, 5.5);
        gl.uniform1f(uFog, 18.0);
        gl.uniform1f(uSteps, 70.0);
        gl.uniform1f(uBright, 1.45);
        gl.uniform1f(uOpacity, 1.0);
        gl.uniform1f(uGrain, 1.0);
        gl.uniform1f(uGrainInt, 0.06);
        gl.uniform2f(uMouse, mouseX, mouseY);
        gl.uniform1f(uParallax, 0.6);
        gl.uniform1i(uEnMouse, 1);

        // Vermelho Neon Blaster Sanguine Blood Red
        gl.uniform3f(uHorizCol, 0.16, 0.004, 0.02);
        gl.uniform3f(uWaveCol, 1.35, 0.02, 0.08);
        gl.uniform3f(uCrestCol, 1.6, 0.08, 0.18);

        gl.drawArrays(gl.TRIANGLES, 0, 6);
      };
    })();

    // 2. LiquidChrome Background (Cybernetic Molten Chrome)
    (function initLiquidChrome() {
      const ctx = createGLContext('canvas-liquidchrome');
      if (!ctx) return;
      const { canvas, gl } = ctx;

      const fsSource = `#version 300 es
      precision highp float;
      uniform vec2 uResolution;
      uniform float uTime;
      uniform vec2 uMouse;
      out vec4 fragColor;

      void main() {
        vec2 uvCoord = gl_FragCoord.xy / uResolution.xy;
        vec2 uv = (2.0 * gl_FragCoord.xy - uResolution.xy) / min(uResolution.x, uResolution.y);
        
        vec2 m = (uMouse - 0.5) * 0.35;
        uv += m;

        float amp = 0.35;
        float freqX = 2.4;
        float freqY = 2.4;
        float t = uTime * 0.45;

        for (float i = 1.0; i < 7.0; i++){
          uv.x += (amp / i) * cos(i * freqX * uv.y + t);
          uv.y += (amp / i) * cos(i * freqY * uv.x + t);
        }

        float wave = abs(sin(t - uv.y - uv.x));
        
        // Sanguine Blood Red & Cyber Chrome
        vec3 baseColor = vec3(1.15, 0.04, 0.14);
        vec3 chromeColor = baseColor / max(wave, 0.14);
        chromeColor = clamp(chromeColor, vec3(0.0), vec3(1.6));

        float spec = pow(max(1.0 - wave, 0.0), 4.0) * 0.85;
        vec3 highlight = vec3(1.0, 0.8, 0.85) * spec;
        
        vec3 col = chromeColor * 0.65 + highlight;
        col += vec3(0.015, 0.002, 0.005);
        float vig = 1.0 - length(uvCoord - 0.5) * 0.75;
        col *= max(vig, 0.2);

        fragColor = vec4(col, 1.0);
      }`;

      const program = createProgram(gl, vsSource, fsSource);
      if (!program) return;
      setupQuad(gl, program);

      const uRes = gl.getUniformLocation(program, 'uResolution');
      const uTime = gl.getUniformLocation(program, 'uTime');
      const uMouse = gl.getUniformLocation(program, 'uMouse');

      function resize() {
        const scale = 0.5;
        const width = Math.max(160, Math.round(window.innerWidth * scale));
        const height = Math.max(160, Math.round(window.innerHeight * scale));
        if (canvas.width !== width || canvas.height !== height) {
          canvas.width = width;
          canvas.height = height;
          gl.viewport(0, 0, width, height);
        }
      }
      window.addEventListener('resize', resize, { passive: true });
      resize();

      let startTime = performance.now();
      renderers[2] = function renderLiquidChrome(now) {
        gl.useProgram(program);
        const elapsed = (now - startTime) * 0.001;
        gl.uniform2f(uRes, canvas.width, canvas.height);
        gl.uniform1f(uTime, elapsed);
        gl.uniform2f(uMouse, mouseX, mouseY);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
      };
    })();

    // 3. AeroShards Background (Raymarched Geometric 3D Prisms)
    (function initAeroShards() {
      const ctx = createGLContext('canvas-aeroshards');
      if (!ctx) return;
      const { canvas, gl } = ctx;

      const fsSource = `#version 300 es
      precision highp float;

      uniform vec2 uResolution;
      uniform float uTime;
      uniform vec2 uMouse;
      out vec4 fragColor;

      mat3 rotateY(float a) {
        float c = cos(a), s = sin(a);
        return mat3(c, 0.0, s, 0.0, 1.0, 0.0, -s, 0.0, c);
      }
      mat3 rotateX(float a) {
        float c = cos(a), s = sin(a);
        return mat3(1.0, 0.0, 0.0, 0.0, c, -s, 0.0, s, c);
      }
      mat3 rotateZ(float a) {
        float c = cos(a), s = sin(a);
        return mat3(c, -s, 0.0, s, c, 0.0, 0.0, 0.0, 1.0);
      }

      float sdOctahedron(vec3 p, float s) {
        p = abs(p);
        return (p.x + p.y * 1.5 + p.z - s) * 0.57735027;
      }

      vec2 map(vec3 p, float time) {
        vec3 q = p;
        q.x += sin(q.y * 0.4 + time * 0.6) * 1.2;
        q.z += cos(q.y * 0.35 + time * 0.5) * 0.8;

        vec3 c = vec3(2.4, 2.0, 2.4);
        vec3 cell = floor(p / c);
        vec3 r = mod(p, c) - 0.5 * c;

        float seed = fract(sin(dot(cell, vec3(12.9898, 78.233, 45.5432))) * 43758.5453);
        float shardSize = 0.28 + seed * 0.22;
        float spin = time * (0.8 + seed * 1.2) + seed * 6.28;

        vec3 pr = rotateY(spin) * rotateX(spin * 0.7) * rotateZ(spin * 0.4) * r;
        float dShard = sdOctahedron(pr, shardSize);

        return vec2(dShard, seed);
      }

      vec3 calcNormal(vec3 p, float time) {
        const float eps = 0.002;
        vec2 h = vec2(eps, 0.0);
        return normalize(vec3(
          map(p + h.xyy, time).x - map(p - h.xyy, time).x,
          map(p + h.yxy, time).x - map(p - h.yxy, time).x,
          map(p + h.yyx, time).x - map(p - h.yyx, time).x
        ));
      }

      void main() {
        vec2 res = max(uResolution, vec2(1.0));
        vec2 uv = (gl_FragCoord.xy - 0.5 * res) / res.y;

        float time = uTime * 0.65;
        vec3 ro = vec3(0.0, time * 1.8, 5.0);
        vec3 rd = normalize(vec3(uv + (uMouse - 0.5) * 0.25, -1.3));

        // Vermelho Neon Blaster Sanguine Blood Red
        vec3 bgCol = vec3(12.0 / 255.0, 2.0 / 255.0, 4.0 / 255.0);
        vec3 shardCol = vec3(190.0 / 255.0, 12.0 / 255.0, 30.0 / 255.0);
        vec3 accentCol = vec3(255.0 / 255.0, 15.0 / 255.0, 45.0 / 255.0);

        vec3 col = bgCol + vec3(0.06, 0.005, 0.015) * (1.0 - length(uv) * 0.7);

        float t = 0.5;
        float maxDist = 18.0;
        float glowAccum = 0.0;

        for (int i = 0; i < 48; i++) {
          vec3 pos = ro + rd * t;
          vec2 resM = map(pos, time);
          float d = resM.x;

          glowAccum += 0.015 / (0.05 + abs(d) * abs(d) * 4.0);

          if (d < 0.004) {
            vec3 n = calcNormal(pos, time);
            vec3 lightDir = normalize(vec3(-0.4, 0.7, 0.6));
            vec3 viewDir = -rd;
            vec3 halfDir = normalize(lightDir + viewDir);

            float diff = max(dot(n, lightDir), 0.0);
            float spec = pow(max(dot(n, halfDir), 0.0), 32.0);
            float fresnel = pow(1.0 - max(dot(n, viewDir), 0.0), 3.0);

            vec3 shardTint = mix(shardCol, accentCol, resM.y);
            vec3 surfaceCol = shardTint * (0.25 + 0.75 * diff);
            surfaceCol += vec3(1.0, 0.85, 0.9) * spec * 0.95;
            surfaceCol += accentCol * fresnel * 1.1;

            float fog = exp(-t * 0.14);
            col = mix(bgCol, surfaceCol, fog);
            break;
          }
          t += max(d * 0.65, 0.02);
          if (t > maxDist) break;
        }

        col += accentCol * glowAccum * 0.075;
        col *= (1.0 - 0.45 * dot(uv, uv));

        fragColor = vec4(col, 1.0);
      }`;

      const program = createProgram(gl, vsSource, fsSource);
      if (!program) return;
      setupQuad(gl, program);

      const uRes = gl.getUniformLocation(program, 'uResolution');
      const uTime = gl.getUniformLocation(program, 'uTime');
      const uMouse = gl.getUniformLocation(program, 'uMouse');

      function resize() {
        const scale = 0.5;
        const width = Math.max(160, Math.round(window.innerWidth * scale));
        const height = Math.max(160, Math.round(window.innerHeight * scale));
        if (canvas.width !== width || canvas.height !== height) {
          canvas.width = width;
          canvas.height = height;
          gl.viewport(0, 0, width, height);
        }
      }
      window.addEventListener('resize', resize, { passive: true });
      resize();

      let startTime = performance.now();
      renderers[3] = function renderAeroShards(now) {
        gl.useProgram(program);
        const elapsed = (now - startTime) * 0.001;

        gl.uniform2f(uRes, canvas.width, canvas.height);
        gl.uniform1f(uTime, elapsed);
        gl.uniform2f(uMouse, mouseX, mouseY);

        gl.drawArrays(gl.TRIANGLES, 0, 6);
      };
    })();

    // 4. CosmicGalaxy Background (Deep Space Vortex & Nebula Core)
    (function initCosmicGalaxy() {
      const ctx = createGLContext('canvas-galaxy');
      if (!ctx) return;
      const { canvas, gl } = ctx;

      const fsSource = `#version 300 es
      precision highp float;
      uniform vec2 uResolution;
      uniform float uTime;
      uniform vec2 uMouse;
      out vec4 fragColor;

      float hash21(vec2 p) {
        p = fract(p * vec2(123.34, 456.21));
        p += dot(p, p + 45.32);
        return fract(p.x * p.y);
      }

      void main() {
        vec2 uv = (gl_FragCoord.xy - 0.5 * uResolution.xy) / min(uResolution.x, uResolution.y);
        uv += (uMouse - 0.5) * 0.12;

        float t = uTime * 0.25;
        float d = length(uv);

        float angle = atan(uv.y, uv.x) + t * 0.4 + 2.4 / (d + 0.18);
        vec2 suv = vec2(cos(angle), sin(angle)) * d;

        float core = 0.07 / (d + 0.04);
        vec3 coreColor = vec3(1.4, 0.12, 0.22) * core;

        float arm1 = smoothstep(0.2, 0.9, sin(suv.x * 12.0 + suv.y * 8.0 - t * 2.0));
        float arm2 = smoothstep(0.2, 0.9, cos(suv.y * 14.0 - suv.x * 10.0 + t * 1.5));
        float nebula = (arm1 * 0.6 + arm2 * 0.4) * exp(-d * 2.8);
        vec3 nebulaColor = mix(vec3(0.55, 0.02, 0.08), vec3(1.0, 0.2, 0.15), arm1) * nebula * 2.2;

        vec2 stUv = uv * 9.0;
        vec2 gv = fract(stUv) - 0.5;
        vec2 id = floor(stUv);
        float seed = hash21(id);
        float starDist = length(gv - (vec2(seed, fract(seed * 34.1)) - 0.5) * 0.7);
        float twinkle = sin(t * 4.0 + seed * 6.28) * 0.5 + 0.5;
        float star = smoothstep(0.06, 0.005, starDist) * (seed > 0.4 ? 1.0 : 0.0) * (0.4 + 0.6 * twinkle);
        vec3 starColor = vec3(1.0, 0.85, 0.9) * star * (0.8 + 0.5 * seed);

        vec3 baseVoid = vec3(0.015, 0.003, 0.006) * (1.0 - d * 0.5);
        vec3 col = baseVoid + coreColor + nebulaColor + starColor;
        fragColor = vec4(col, 1.0);
      }`;

      const program = createProgram(gl, vsSource, fsSource);
      if (!program) return;
      setupQuad(gl, program);

      const uRes = gl.getUniformLocation(program, 'uResolution');
      const uTime = gl.getUniformLocation(program, 'uTime');
      const uMouse = gl.getUniformLocation(program, 'uMouse');

      function resize() {
        const scale = 0.5;
        const width = Math.max(160, Math.round(window.innerWidth * scale));
        const height = Math.max(160, Math.round(window.innerHeight * scale));
        if (canvas.width !== width || canvas.height !== height) {
          canvas.width = width;
          canvas.height = height;
          gl.viewport(0, 0, width, height);
        }
      }
      window.addEventListener('resize', resize, { passive: true });
      resize();

      let startTime = performance.now();
      renderers[4] = function renderCosmicGalaxy(now) {
        gl.useProgram(program);
        const elapsed = (now - startTime) * 0.001;
        gl.uniform2f(uRes, canvas.width, canvas.height);
        gl.uniform1f(uTime, elapsed);
        gl.uniform2f(uMouse, mouseX, mouseY);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
      };
    })();

    // 5. CyberGrid Background (Personal OS 3D Holographic Perspective Grid)
    (function initCyberGrid() {
      const ctx = createGLContext('canvas-gridscan');
      if (!ctx) return;
      const { canvas, gl } = ctx;

      const fsSource = `#version 300 es
      precision highp float;
      uniform vec2 uResolution;
      uniform float uTime;
      uniform vec2 uMouse;
      out vec4 fragColor;

      void main() {
        vec2 uv = (gl_FragCoord.xy - 0.5 * uResolution.xy) / uResolution.y;
        float horizon = -0.15 + (uMouse.y - 0.5) * 0.1;
        float fov = 0.55;
        vec3 col = vec3(0.015, 0.002, 0.005);
        
        float py = uv.y - horizon;
        if (py < 0.0) {
          float z = fov / (-py);
          float x = (uv.x + (uMouse.x - 0.5) * 0.2) * z;
          
          float speed = uTime * 1.6;
          vec2 grid = vec2(x * 1.8, z - speed);
          vec2 fgrid = abs(fract(grid - 0.5) - 0.5) / fwidth(grid);
          float line = 1.0 - min(min(fgrid.x, fgrid.y), 1.0);
          
          float pulse = mod(z * 0.4 - uTime * 1.2, 3.0);
          float scanGlow = exp(-pulse * pulse * 1.5) * 1.8;
          float depthFog = exp(-z * 0.16);

          vec3 gridCol = mix(vec3(0.8, 0.02, 0.1), vec3(1.2, 0.15, 0.35), scanGlow);
          col += gridCol * (line * 0.75 + scanGlow * 0.4) * depthFog;
        } else {
          float glow = exp(-py * 12.0) * 0.85;
          col += vec3(1.1, 0.08, 0.22) * glow;
        }
        
        float vig = 1.0 - length((gl_FragCoord.xy / uResolution.xy) - 0.5) * 0.75;
        col *= max(vig, 0.15);
        fragColor = vec4(col, 1.0);
      }`;

      const program = createProgram(gl, vsSource, fsSource);
      if (!program) return;
      setupQuad(gl, program);

      const uRes = gl.getUniformLocation(program, 'uResolution');
      const uTime = gl.getUniformLocation(program, 'uTime');
      const uMouse = gl.getUniformLocation(program, 'uMouse');

      function resize() {
        const scale = 0.5;
        const width = Math.max(160, Math.round(window.innerWidth * scale));
        const height = Math.max(160, Math.round(window.innerHeight * scale));
        if (canvas.width !== width || canvas.height !== height) {
          canvas.width = width;
          canvas.height = height;
          gl.viewport(0, 0, width, height);
        }
      }
      window.addEventListener('resize', resize, { passive: true });
      resize();

      let startTime = performance.now();
      renderers[5] = function renderCyberGrid(now) {
        gl.useProgram(program);
        const elapsed = (now - startTime) * 0.001;
        gl.uniform2f(uRes, canvas.width, canvas.height);
        gl.uniform1f(uTime, elapsed);
        gl.uniform2f(uMouse, mouseX, mouseY);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
      };
    })();

    // 6. PlasmaLightning Background (Electric Neural Synapse)
    (function initPlasmaLightning() {
      const ctx = createGLContext('canvas-lightning');
      if (!ctx) return;
      const { canvas, gl } = ctx;

      const fsSource = `#version 300 es
      precision highp float;
      uniform vec2 uResolution;
      uniform float uTime;
      uniform vec2 uMouse;
      out vec4 fragColor;

      #define OCTAVES 6

      float hash(vec2 p) {
        p = fract(p * vec2(123.34, 456.21));
        p += dot(p, p + 45.32);
        return fract(p.x * p.y);
      }

      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        float a = hash(i);
        float b = hash(i + vec2(1.0, 0.0));
        float c = hash(i + vec2(0.0, 1.0));
        float d = hash(i + vec2(1.0, 1.0));
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
      }

      float fbm(vec2 p) {
        float v = 0.0;
        float a = 0.5;
        mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);
        for (int i = 0; i < OCTAVES; i++) {
          v += a * noise(p);
          p = rot * p * 2.0;
          a *= 0.5;
        }
        return v;
      }

      void main() {
        vec2 uv = (gl_FragCoord.xy - 0.5 * uResolution.xy) / min(uResolution.x, uResolution.y);
        uv += (uMouse - 0.5) * 0.15;

        float t = uTime * 0.85;
        vec2 p = uv * 2.2;
        float displacement = fbm(p + vec2(t * 1.2, t * 0.4)) * 1.5 - 0.75;
        float arcDist = abs(p.y + displacement * 0.6);

        float tendril = fbm(p * 2.0 - vec2(t * 0.8, -t * 0.6)) * 1.2 - 0.6;
        float tendrilDist = abs(p.x * 0.5 + p.y + tendril * 0.4);

        float energy1 = 0.035 / (arcDist + 0.02);
        float energy2 = 0.02 / (tendrilDist + 0.035);

        float flicker = sin(t * 18.0) * 0.15 + 0.85;
        float totalEnergy = (energy1 * 1.2 + energy2 * 0.7) * flicker;

        vec3 darkBlood = vec3(0.35, 0.0, 0.04);
        vec3 deepCrimson = vec3(0.95, 0.02, 0.14);
        vec3 rubyCore = vec3(1.5, 0.35, 0.55);

        vec3 col = mix(darkBlood, deepCrimson, clamp(totalEnergy * 0.5, 0.0, 1.0));
        col = mix(col, rubyCore, clamp((totalEnergy - 1.2) * 0.6, 0.0, 1.0));
        col *= totalEnergy;
        col += vec3(0.015, 0.002, 0.005);
        
        float vig = 1.0 - length((gl_FragCoord.xy / uResolution.xy) - 0.5) * 0.8;
        col *= max(vig, 0.2);

        fragColor = vec4(col, 1.0);
      }`;

      const program = createProgram(gl, vsSource, fsSource);
      if (!program) return;
      setupQuad(gl, program);

      const uRes = gl.getUniformLocation(program, 'uResolution');
      const uTime = gl.getUniformLocation(program, 'uTime');
      const uMouse = gl.getUniformLocation(program, 'uMouse');

      function resize() {
        const scale = 0.5;
        const width = Math.max(160, Math.round(window.innerWidth * scale));
        const height = Math.max(160, Math.round(window.innerHeight * scale));
        if (canvas.width !== width || canvas.height !== height) {
          canvas.width = width;
          canvas.height = height;
          gl.viewport(0, 0, width, height);
        }
      }
      window.addEventListener('resize', resize, { passive: true });
      resize();

      let startTime = performance.now();
      renderers[6] = function renderPlasmaLightning(now) {
        gl.useProgram(program);
        const elapsed = (now - startTime) * 0.001;
        gl.uniform2f(uRes, canvas.width, canvas.height);
        gl.uniform1f(uTime, elapsed);
        gl.uniform2f(uMouse, mouseX, mouseY);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
      };
    })();

    // 7. BalatroFlow Background (Psychedelic Liquid Flame)
    (function initBalatroFlow() {
      const ctx = createGLContext('canvas-balatro');
      if (!ctx) return;
      const { canvas, gl } = ctx;

      const fsSource = `#version 300 es
      precision highp float;
      uniform vec2 uResolution;
      uniform float uTime;
      uniform vec2 uMouse;
      out vec4 fragColor;

      void main() {
        vec2 screenSize = uResolution.xy;
        vec2 screen_coords = gl_FragCoord.xy;
        float pixel_size = length(screenSize.xy) / 600.0;
        vec2 uv = (floor(screen_coords.xy * (1.0 / pixel_size)) * pixel_size - 0.5 * screenSize.xy) / length(screenSize.xy);
        float uv_len = length(uv);

        float spinRotation = -1.8;
        float spinSpeed = 4.5;
        float speed = (spinRotation * 0.2) * uTime + 302.2;
        float mouseInfluence = (uMouse.x * 2.0 - 1.0);
        speed += mouseInfluence * 0.15;

        float new_pixel_angle = atan(uv.y, uv.x) + speed - 20.0 * (0.28 * uv_len + 0.72);
        vec2 mid = (screenSize.xy / length(screenSize.xy)) / 2.0;
        uv = (vec2(uv_len * cos(new_pixel_angle) + mid.x, uv_len * sin(new_pixel_angle) + mid.y) - mid);

        uv *= 22.0;
        speed = uTime * spinSpeed + mouseInfluence * 2.0;

        vec2 uv2 = vec2(uv.x + uv.y);
        for(int i = 0; i < 4; i++) {
          uv2 += sin(max(uv.x, uv.y)) + uv;
          uv += 0.5 * vec2(cos(5.112 + 0.353 * uv2.y + speed * 0.13), sin(uv2.x - 0.113 * speed));
          uv -= cos(uv.x + uv.y) - sin(uv.x * 0.711 - uv.y);
        }

        float contrast_mod = 2.1;
        float paint_res = min(2.0, max(0.0, length(uv) * 0.038 * contrast_mod));
        float c1p = max(0.0, 1.0 - contrast_mod * abs(1.0 - paint_res));
        float c2p = max(0.0, 1.0 - contrast_mod * abs(paint_res));
        float c3p = 1.0 - min(1.0, c1p + c2p);
        float light = 0.35 * max(c1p * 4.5 - 3.5, 0.0) + 0.45 * max(c2p * 4.5 - 3.5, 0.0);

        vec3 col1 = vec3(1.15, 0.03, 0.15); // Neon Blaster Red
        vec3 col2 = vec3(0.55, 0.01, 0.06); // Dark Arterial Blood
        vec3 col3 = vec3(0.02, 0.003, 0.008); // Obsidian Core

        vec3 col = col1 * c1p + col2 * c2p + col3 * c3p + light;
        fragColor = vec4(col, 1.0);
      }`;

      const program = createProgram(gl, vsSource, fsSource);
      if (!program) return;
      setupQuad(gl, program);

      const uRes = gl.getUniformLocation(program, 'uResolution');
      const uTime = gl.getUniformLocation(program, 'uTime');
      const uMouse = gl.getUniformLocation(program, 'uMouse');

      function resize() {
        const scale = 0.5;
        const width = Math.max(160, Math.round(window.innerWidth * scale));
        const height = Math.max(160, Math.round(window.innerHeight * scale));
        if (canvas.width !== width || canvas.height !== height) {
          canvas.width = width;
          canvas.height = height;
          gl.viewport(0, 0, width, height);
        }
      }
      window.addEventListener('resize', resize, { passive: true });
      resize();

      let startTime = performance.now();
      renderers[7] = function renderBalatroFlow(now) {
        gl.useProgram(program);
        const elapsed = (now - startTime) * 0.001;
        gl.uniform2f(uRes, canvas.width, canvas.height);
        gl.uniform1f(uTime, elapsed);
        gl.uniform2f(uMouse, mouseX, mouseY);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
      };
    })();

    // Loop mestre de alto desempenho: renderiza apenas o shader atualmente visivel e pausa quando app em background
    let isPageVisible = !document.hidden;
    document.addEventListener('visibilitychange', () => {
      isPageVisible = !document.hidden;
    });

    function masterAnimLoop(now) {
      if (isPageVisible) {
        if (typeof renderers[activeIndex] === 'function') {
          renderers[activeIndex](now);
        }
        if (now < transitionEndTime && prevIndex >= 0 && typeof renderers[prevIndex] === 'function') {
          renderers[prevIndex](now);
        }
      }
      requestAnimationFrame(masterAnimLoop);
    }
    requestAnimationFrame(masterAnimLoop);
  }

})();
