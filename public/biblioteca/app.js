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
     Dynamic 3-Background Rotation System (7 Seconds Crossfade)
     Backgrounds: GhostFibers, AeroShards, Dither (Hyper-Amplified)
     ======================================================== */
  function initDynamicBackgrounds() {
    const container = document.getElementById('dynamic-bg-container');
    if (!container) return;

    // Cycle between 5 backgrounds every 7 seconds
    let activeIndex = 0;
    const wrappers = [
      document.getElementById('bg-wrapper-0'),
      document.getElementById('bg-wrapper-1'),
      document.getElementById('bg-wrapper-2'),
      document.getElementById('bg-wrapper-3'),
      document.getElementById('bg-wrapper-4')
    ];

    setInterval(() => {
      activeIndex = (activeIndex + 1) % 5;
      wrappers.forEach((w, i) => {
        if (w) {
          if (i === activeIndex) {
            w.classList.add('active');
          } else {
            w.classList.remove('active');
          }
        }
      });
    }, 7000);

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

    // 1. GhostFibers Background (React Bits)
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
      uniform float uLineSharpness;
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
        vec3 color = vec3(0.0);
        float fiberField = 0.0;

        for (int index = 0; index < MAX_LAYERS; index++) {
          float fi = float(index) + 1.0;
          if (fi > uLayers) break;

          p += uWaveAmplitude * sin(p.yx * fi * uWaveFrequency + time * (uWaveSpeed + fi * uLayerSpeed));

          float radius = length(p);
          float polarAngle = atan(p.y, p.x);
          polarAngle += sin(radius * uTwistFrequency - time * uTwistSpeed + fi) * uTwist;
          p = vec2(cos(polarAngle), sin(polarAngle)) * radius;

          float lines = abs(sin(p.x * (uLineFrequency + fi * uLineSpacing) + sin(p.y * 3.0 + time)));
          lines = pow(max(0.0, 1.0 - lines), uLineSharpness);
          fiberField += lines / fi;
          color += uLineColor * lines / fi;

          float glow = exp(-uGlowFalloff * abs(sin(p.x * 3.0 + time + fi)));
          color += uGlowColor * glow * uGlowIntensity / (fi * 2.0);
        }

        float center = exp(-2.2 * dot(uv, uv));
        color += centerTone * center;

        float cloud = exp(-1.5 * length(uv + vec2(sin(time * 0.3) * 0.25, cos(time * 0.25) * 0.18)));
        color += cloudTone * cloud;

        float vignette = 1.0 - smoothstep(0.35, 1.45, length(uv));
        color *= mix(1.0 - uVignette, 1.0, vignette);
        color = 1.0 - exp(-color * uBrightness);
        color.b *= uBlueBoost;

        vec3 outputColor = backdrop + color;
        float noise = (layeredGrain(gl_FragCoord.xy) - 0.5) * uGrain;
        outputColor = clamp(outputColor + noise, 0.0, 1.0);
        fragColor = vec4(outputColor, 1.0);
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
      const uLineSharpness = gl.getUniformLocation(program, 'uLineSharpness');
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
        const width = Math.max(300, window.innerWidth);
        const height = Math.max(300, window.innerHeight);
        if (canvas.width !== width || canvas.height !== height) {
          canvas.width = width;
          canvas.height = height;
          gl.viewport(0, 0, width, height);
        }
      }
      window.addEventListener('resize', resize);
      resize();

      let startTime = performance.now();
      function render(now) {
        resize();
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
        requestAnimationFrame(render);
      }
      requestAnimationFrame(render);
    })();

    // 2. AeroShards Background (React Bits procedural geometric shard flow)
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
        vec3 rd = normalize(vec3(uv, -1.3));

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

      let mouseX = 0.5, mouseY = 0.5;
      window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX / window.innerWidth;
        mouseY = 1.0 - (e.clientY / window.innerHeight);
      });

      function resize() {
        const width = Math.max(300, window.innerWidth);
        const height = Math.max(300, window.innerHeight);
        if (canvas.width !== width || canvas.height !== height) {
          canvas.width = width;
          canvas.height = height;
          gl.viewport(0, 0, width, height);
        }
      }
      window.addEventListener('resize', resize);
      resize();

      let startTime = performance.now();
      function render(now) {
        resize();
        gl.useProgram(program);
        const elapsed = (now - startTime) * 0.001;

        gl.uniform2f(uRes, canvas.width, canvas.height);
        gl.uniform1f(uTime, elapsed);
        gl.uniform2f(uMouse, mouseX, mouseY);

        gl.drawArrays(gl.TRIANGLES, 0, 6);
        requestAnimationFrame(render);
      }
      requestAnimationFrame(render);
    })();

    // 3. Dither Background (React Bits - AMPLIFICADO AO MÁXIMO)
    (function initDither() {
      const ctx = createGLContext('canvas-dither');
      if (!ctx) return;
      const { canvas, gl } = ctx;

      const fsSource = `#version 300 es
      precision highp float;

      uniform vec2 resolution;
      uniform float time;
      uniform float waveSpeed;
      uniform float waveFrequency;
      uniform float waveAmplitude;
      uniform vec2 mousePos;
      uniform int enableMouseInteraction;
      uniform float mouseRadius;
      uniform float colorNum;
      uniform float pixelSize;

      out vec4 fragColor;

      const float bayerMatrix8x8[64] = float[64](
        0.0/64.0, 48.0/64.0, 12.0/64.0, 60.0/64.0,  3.0/64.0, 51.0/64.0, 15.0/64.0, 63.0/64.0,
        32.0/64.0,16.0/64.0, 44.0/64.0, 28.0/64.0, 35.0/64.0,19.0/64.0, 47.0/64.0, 31.0/64.0,
        8.0/64.0, 56.0/64.0,  4.0/64.0, 52.0/64.0, 11.0/64.0,59.0/64.0,  7.0/64.0, 55.0/64.0,
        40.0/64.0,24.0/64.0, 36.0/64.0, 20.0/64.0, 43.0/64.0,27.0/64.0, 39.0/64.0, 23.0/64.0,
        2.0/64.0, 50.0/64.0, 14.0/64.0, 62.0/64.0,  1.0/64.0,49.0/64.0, 13.0/64.0, 61.0/64.0,
        34.0/64.0,18.0/64.0, 46.0/64.0, 30.0/64.0, 33.0/64.0,17.0/64.0, 45.0/64.0, 29.0/64.0,
        10.0/64.0,58.0/64.0,  6.0/64.0, 54.0/64.0,  9.0/64.0,57.0/64.0,  5.0/64.0, 53.0/64.0,
        42.0/64.0,26.0/64.0, 38.0/64.0, 22.0/64.0, 41.0/64.0,25.0/64.0, 37.0/64.0, 21.0/64.0
      );

      vec4 mod289(vec4 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
      vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
      vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
      vec2 fade(vec2 t) { return t*t*t*(t*(t*6.0-15.0)+10.0); }

      float cnoise(vec2 P) {
        vec4 Pi = floor(P.xyxy) + vec4(0.0,0.0,1.0,1.0);
        vec4 Pf = fract(P.xyxy) - vec4(0.0,0.0,1.0,1.0);
        Pi = mod289(Pi);
        vec4 ix = Pi.xzxz;
        vec4 iy = Pi.yyww;
        vec4 fx = Pf.xzxz;
        vec4 fy = Pf.yyww;
        vec4 i = permute(permute(ix) + iy);
        vec4 gx = fract(i * (1.0/41.0)) * 2.0 - 1.0;
        vec4 gy = abs(gx) - 0.5;
        vec4 tx = floor(gx + 0.5);
        gx = gx - tx;
        vec2 g00 = vec2(gx.x, gy.x);
        vec2 g10 = vec2(gx.y, gy.y);
        vec2 g01 = vec2(gx.z, gy.z);
        vec2 g11 = vec2(gx.w, gy.w);
        vec4 norm = taylorInvSqrt(vec4(dot(g00,g00), dot(g01,g01), dot(g10,g10), dot(g11,g11)));
        g00 *= norm.x; g01 *= norm.y; g10 *= norm.z; g11 *= norm.w;
        float n00 = dot(g00, vec2(fx.x, fy.x));
        float n10 = dot(g10, vec2(fx.y, fy.y));
        float n01 = dot(g01, vec2(fx.z, fy.z));
        float n11 = dot(g11, vec2(fx.w, fy.w));
        vec2 fade_xy = fade(Pf.xy);
        vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
        return 2.3 * mix(n_x.x, n_x.y, fade_xy.y);
      }

      const int OCTAVES = 4;
      float fbm(vec2 p) {
        float value = 0.0;
        float amp = 1.0;
        float freq = waveFrequency;
        for (int i = 0; i < OCTAVES; i++) {
          value += amp * abs(cnoise(p));
          p *= freq;
          amp *= waveAmplitude;
        }
        return value;
      }

      float pattern(vec2 p) {
        vec2 p2 = p - time * waveSpeed;
        return fbm(p + fbm(p2)); 
      }

      vec3 dither(vec2 uv, vec3 color) {
        vec2 scaledCoord = floor(uv * resolution / pixelSize);
        int x = int(mod(scaledCoord.x, 8.0));
        int y = int(mod(scaledCoord.y, 8.0));
        float threshold = bayerMatrix8x8[y * 8 + x] - 0.25;
        float stepVal = 1.0 / (colorNum - 1.0);
        color += threshold * stepVal;
        float luminance = dot(color, vec3(0.2126, 0.7152, 0.0722));
        float bias = mix(0.2, 0.0, smoothstep(0.45, 0.8, luminance));
        color = clamp(color - bias, 0.0, 1.0);
        return floor(color * (colorNum - 1.0) + 0.5) / (colorNum - 1.0);
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / resolution.xy;
        vec2 p = uv - 0.5;
        p.x *= resolution.x / resolution.y;

        float f = pattern(p * 2.2);

        if (enableMouseInteraction == 1) {
          vec2 mouseNDC = (mousePos / resolution - 0.5) * vec2(1.0, -1.0);
          mouseNDC.x *= resolution.x / resolution.y;
          float dist = length(p - mouseNDC);
          float effect = 1.0 - smoothstep(0.0, mouseRadius, dist);
          f -= 0.65 * effect;
        }

        // AMPLIFICADO AO MÁXIMO:
        // Paleta Ultra Vívida Neon Cyberpunk (Electric Magenta, Cyber Cyan, Violet & Radiant Sun)
        vec3 bgDeep = vec3(0.04, 0.01, 0.07);
        vec3 colMagenta = vec3(1.15, 0.08, 0.75);
        vec3 colCyan = vec3(0.05, 1.10, 1.25);
        vec3 colGold = vec3(1.18, 0.85, 0.15);
        vec3 colViolet = vec3(0.65, 0.05, 1.20);

        float tVal = clamp(f * 1.35, 0.0, 1.0);
        vec3 dynamicWaveColor;
        if (tVal < 0.35) {
          dynamicWaveColor = mix(bgDeep, colViolet, tVal / 0.35);
        } else if (tVal < 0.7) {
          dynamicWaveColor = mix(colViolet, colMagenta, (tVal - 0.35) / 0.35);
        } else {
          dynamicWaveColor = mix(colMagenta, mix(colCyan, colGold, sin(time * 1.5 + uv.x * 3.0) * 0.5 + 0.5), (tVal - 0.7) / 0.3);
        }

        vec3 finalColor = dither(uv, dynamicWaveColor);

        fragColor = vec4(finalColor, 1.0);
      }`;

      const program = createProgram(gl, vsSource, fsSource);
      if (!program) return;
      setupQuad(gl, program);

      const uRes = gl.getUniformLocation(program, 'resolution');
      const uTime = gl.getUniformLocation(program, 'time');
      const uWaveSpeed = gl.getUniformLocation(program, 'waveSpeed');
      const uWaveFreq = gl.getUniformLocation(program, 'waveFrequency');
      const uWaveAmp = gl.getUniformLocation(program, 'waveAmplitude');
      const uMousePos = gl.getUniformLocation(program, 'mousePos');
      const uMouseInteract = gl.getUniformLocation(program, 'enableMouseInteraction');
      const uMouseRad = gl.getUniformLocation(program, 'mouseRadius');
      const uColorNum = gl.getUniformLocation(program, 'colorNum');
      const uPixelSize = gl.getUniformLocation(program, 'pixelSize');

      let mouseX = 0, mouseY = 0;
      window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
      });

      function resize() {
        const width = Math.max(300, window.innerWidth);
        const height = Math.max(300, window.innerHeight);
        if (canvas.width !== width || canvas.height !== height) {
          canvas.width = width;
          canvas.height = height;
          gl.viewport(0, 0, width, height);
        }
      }
      window.addEventListener('resize', resize);
      resize();

      let startTime = performance.now();
      function render(now) {
        resize();
        gl.useProgram(program);
        const elapsed = (now - startTime) * 0.001;

        gl.uniform2f(uRes, canvas.width, canvas.height);
        gl.uniform1f(uTime, elapsed);
        gl.uniform1f(uWaveSpeed, 0.08);
        gl.uniform1f(uWaveFreq, 3.4);
        gl.uniform1f(uWaveAmp, 0.45);
        gl.uniform2f(uMousePos, mouseX, mouseY);
        gl.uniform1i(uMouseInteract, 1);
        gl.uniform1f(uMouseRad, 0.45);
        gl.uniform1f(uColorNum, 6.0);
        gl.uniform1f(uPixelSize, 3.0);

        gl.drawArrays(gl.TRIANGLES, 0, 6);
        requestAnimationFrame(render);
      }
      requestAnimationFrame(render);
    })();

    // 4. GradientWaves Background (React Bits - Cores Alteradas & Intensidade Aumentada)
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
      uniform bool uEnableMouse;
      uniform vec3 uHorizonColor;
      uniform vec3 uWaveColor;
      uniform vec3 uCrestColor;
      out vec4 fragColor;

      const float MAX_DIST = 20000.0;

      float hash21(vec2 p) {
        vec3 p3 = fract(vec3(p.xyx) * 0.1031);
        p3 += dot(p3, p3.yzx + 33.33);
        return fract((p3.x + p3.y) * p3.z);
      }

      float plasma(vec3 r, vec2 freq, vec4 tc) {
        float mx = r.x + tc.x;
        mx += uSwell * sin((r.y + mx) / 20.0 + tc.y);
        float my = r.y - tc.z;
        my += uTurbulence * cos(r.x / 23.0 + tc.w);
        return r.z - (sin(mx * freq.x) * uAmplitude + sin(my * freq.y) * uAmplitude + uHeight);
      }

      float raymarch(vec3 pos, vec3 dir, vec2 freq, vec4 tc) {
        float dist = 0.0;
        for (int i = 0; i < 128; i++) {
          if (float(i) >= uSteps) break;
          float dscene = plasma(pos + dist * dir, freq, tc);
          if (abs(dscene) < 0.1) break;
          dist += 0.9 * dscene;
          if (!(abs(dist) < MAX_DIST)) return MAX_DIST;
        }
        return dist;
      }

      void main() {
        float T = iTime * uSpeed;
        vec2 freq = vec2(uWaveScale / 7.0, (uWaveScale * uWaveRatio) / 3.0);
        vec4 tc = vec4(T / 0.130, T / 0.810, T / 0.200, T / 0.710);
        float c, s;
        float vfov = (3.14159 / 2.3) / max(uZoom, 0.05);
        vec3 cam = vec3(0.0, 0.0, 30.0);
        vec2 uv = (gl_FragCoord.xy / iResolution.xy) - 0.5;
        uv.x *= iResolution.x / iResolution.y;
        uv.y *= -1.0;

        vec3 dir = vec3(0.0, 0.0, -1.0);
        float ulen = length(uv);
        float xrot = vfov * ulen;
        c = cos(xrot); s = sin(xrot);
        dir = mat3(1.0, 0.0, 0.0, 0.0, c, -s, 0.0, s, c) * dir;
        vec2 nuv = ulen > 1e-5 ? uv / ulen : vec2(1.0, 0.0);
        c = nuv.x; s = nuv.y;
        dir = mat3(c, -s, 0.0, s, c, 0.0, 0.0, 0.0, 1.0) * dir;
        c = cos(uTilt); s = sin(uTilt);
        dir = mat3(c, 0.0, s, 0.0, 1.0, 0.0, -s, 0.0, c) * dir;

        if (uEnableMouse) {
          float yaw = (uMouse.x - 0.5) * uParallax * 0.4;
          float pitch = (uMouse.y - 0.5) * uParallax * 0.4;
          c = cos(yaw); s = sin(yaw);
          dir = mat3(c, 0.0, s, 0.0, 1.0, 0.0, -s, 0.0, c) * dir;
          c = cos(pitch); s = sin(pitch);
          dir = mat3(1.0, 0.0, 0.0, 0.0, c, -s, 0.0, s, c) * dir;
        }

        float dist = raymarch(cam, dir, freq, tc);
        vec3 pos = cam + dist * dir;

        float t = clamp(uFogDepth / max(dist, 0.001), 0.0, 1.0);
        vec3 body = mix(uWaveColor, uCrestColor, clamp(pos.z * 0.08 + 0.5, 0.0, 1.0));
        vec3 col = mix(uHorizonColor, body, t);
        col *= uBrightness;
        col = clamp(col, 0.0, 1.0);

        float alpha = clamp(t, 0.0, 1.0) * uOpacity;
        if (uGrain > 0.5) {
          float g = hash21(gl_FragCoord.xy + mod(iTime, 64.0) * 11.0);
          alpha += (g - 0.5) * uGrainIntensity;
        }
        alpha = clamp(alpha, 0.0, 1.0);
        fragColor = vec4(col * alpha, alpha);
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

      let targetMouseX = 0.5, targetMouseY = 0.5;
      let currMouseX = 0.5, currMouseY = 0.5;
      window.addEventListener('mousemove', (e) => {
        targetMouseX = e.clientX / window.innerWidth;
        targetMouseY = 1.0 - (e.clientY / window.innerHeight);
      });

      function resize() {
        const width = Math.max(300, window.innerWidth);
        const height = Math.max(300, window.innerHeight);
        if (canvas.width !== width || canvas.height !== height) {
          canvas.width = width;
          canvas.height = height;
          gl.viewport(0, 0, width, height);
        }
      }
      window.addEventListener('resize', resize);
      resize();

      let startTime = performance.now();
      function render(now) {
        resize();
        gl.useProgram(program);
        const elapsed = (now - startTime) * 0.001;

        currMouseX += (targetMouseX - currMouseX) * 0.05;
        currMouseY += (targetMouseY - currMouseY) * 0.05;

        gl.uniform2f(uRes, canvas.width, canvas.height);
        gl.uniform1f(uTime, elapsed);
        gl.uniform1f(uSpeed, 0.45);
        gl.uniform1f(uAmp, 3.2); // Intensidade aumentada
        gl.uniform1f(uScale, 0.75);
        gl.uniform1f(uRatio, 0.95);
        gl.uniform1f(uSwell, 42.0);
        gl.uniform1f(uTurb, 25.0);
        gl.uniform1f(uTilt, 1.11);
        gl.uniform1f(uZoom, 1.0);
        gl.uniform1f(uHeight, 5.5);
        gl.uniform1f(uFog, 18.0);
        gl.uniform1f(uSteps, 70.0);
        gl.uniform1f(uBright, 1.4); // Brilho amplificado
        gl.uniform1f(uOpacity, 1.0);
        gl.uniform1f(uGrain, 1.0);
        gl.uniform1f(uGrainInt, 0.06);
        gl.uniform2f(uMouse, currMouseX, currMouseY);
        gl.uniform1f(uParallax, 0.6);
        gl.uniform1i(uEnMouse, 1);

        // Vermelho Neon Blaster Sanguine Blood Red
        gl.uniform3f(uHorizCol, 0.16, 0.004, 0.02); // Deep Sanguine Blood Void
        gl.uniform3f(uWaveCol, 1.35, 0.02, 0.08);   // Arterial Blood Wave Core
        gl.uniform3f(uCrestCol, 1.6, 0.08, 0.18);   // Blazing Neon Blaster Blood Crest

        gl.drawArrays(gl.TRIANGLES, 0, 6);
        requestAnimationFrame(render);
      }
      requestAnimationFrame(render);
    })();

    // 5. Grainient Background (React Bits - Cores Alteradas & Intensidade Aumentada)
    (function initGrainient() {
      const ctx = createGLContext('canvas-grainient');
      if (!ctx) return;
      const { canvas, gl } = ctx;

      const fsSource = `#version 300 es
      precision highp float;
      uniform vec2 iResolution;
      uniform float iTime;
      uniform float uTimeSpeed;
      uniform float uColorBalance;
      uniform float uWarpStrength;
      uniform float uWarpFrequency;
      uniform float uWarpSpeed;
      uniform float uWarpAmplitude;
      uniform float uBlendAngle;
      uniform float uBlendSoftness;
      uniform float uRotationAmount;
      uniform float uNoiseScale;
      uniform float uGrainAmount;
      uniform float uGrainScale;
      uniform float uGrainAnimated;
      uniform float uContrast;
      uniform float uGamma;
      uniform float uSaturation;
      uniform vec2 uCenterOffset;
      uniform float uZoom;
      uniform vec3 uColor1;
      uniform vec3 uColor2;
      uniform vec3 uColor3;
      out vec4 fragColor;

      #define S(a,b,t) smoothstep(a,b,t)
      mat2 Rot(float a){float s=sin(a),c=cos(a);return mat2(c,-s,s,c);} 
      vec2 hash(vec2 p){p=vec2(dot(p,vec2(2127.1,81.17)),dot(p,vec2(1269.5,283.37)));return fract(sin(p)*43758.5453);} 
      float noise(vec2 p){vec2 i=floor(p),f=fract(p),u=f*f*(3.0-2.0*f);float n=mix(mix(dot(-1.0+2.0*hash(i+vec2(0.0,0.0)),f-vec2(0.0,0.0)),dot(-1.0+2.0*hash(i+vec2(1.0,0.0)),f-vec2(1.0,0.0)),u.x),mix(dot(-1.0+2.0*hash(i+vec2(0.0,1.0)),f-vec2(0.0,1.0)),dot(-1.0+2.0*hash(i+vec2(1.0,1.0)),f-vec2(1.0,1.0)),u.x),u.y);return 0.5+0.5*n;}

      void main() {
        float t = iTime * uTimeSpeed;
        vec2 uv = gl_FragCoord.xy / iResolution.xy;
        float ratio = iResolution.x / iResolution.y;
        vec2 tuv = uv - 0.5 + uCenterOffset;
        tuv /= max(uZoom, 0.001);

        float degree = noise(vec2(t * 0.1, tuv.x * tuv.y) * uNoiseScale);
        tuv.y *= 1.0 / ratio;
        tuv *= Rot(radians((degree - 0.5) * uRotationAmount + 180.0));
        tuv.y *= ratio;

        float frequency = uWarpFrequency;
        float ws = max(uWarpStrength, 0.001);
        float amplitude = uWarpAmplitude / ws;
        float warpTime = t * uWarpSpeed;
        tuv.x += sin(tuv.y * frequency + warpTime) / amplitude;
        tuv.y += sin(tuv.x * (frequency * 1.5) + warpTime) / (amplitude * 0.5);

        vec3 col1 = uColor1;
        vec3 col2 = uColor2;
        vec3 col3 = uColor3;
        float b = uColorBalance;
        float s = max(uBlendSoftness, 0.0);
        mat2 blendRot = Rot(radians(uBlendAngle));
        float blendX = (tuv * blendRot).x;
        float edge0 = -0.3 - b - s;
        float edge1 = 0.2 - b + s;
        float v0 = 0.5 - b + s;
        float v1 = -0.3 - b - s;
        vec3 layer1 = mix(col3, col2, S(edge0, edge1, blendX));
        vec3 layer2 = mix(col2, col1, S(edge0, edge1, blendX));
        vec3 col = mix(layer1, layer2, S(v0, v1, tuv.y));

        vec2 grainUv = uv * max(uGrainScale, 0.001);
        if (uGrainAnimated > 0.5) { grainUv += vec2(iTime * 0.05); } 
        float grain = fract(sin(dot(grainUv, vec2(12.9898, 78.233))) * 43758.5453);
        col += (grain - 0.5) * uGrainAmount;

        col = (col - 0.5) * uContrast + 0.5;
        float luma = dot(col, vec3(0.2126, 0.7152, 0.0722));
        col = mix(vec3(luma), col, uSaturation);
        col = pow(max(col, 0.0), vec3(1.0 / max(uGamma, 0.001)));
        col = clamp(col, 0.0, 1.0);

        fragColor = vec4(col, 1.0);
      }`;

      const program = createProgram(gl, vsSource, fsSource);
      if (!program) return;
      setupQuad(gl, program);

      const uRes = gl.getUniformLocation(program, 'iResolution');
      const uTime = gl.getUniformLocation(program, 'iTime');
      const uTimeSpeed = gl.getUniformLocation(program, 'uTimeSpeed');
      const uColorBalance = gl.getUniformLocation(program, 'uColorBalance');
      const uWarpStrength = gl.getUniformLocation(program, 'uWarpStrength');
      const uWarpFrequency = gl.getUniformLocation(program, 'uWarpFrequency');
      const uWarpSpeed = gl.getUniformLocation(program, 'uWarpSpeed');
      const uWarpAmplitude = gl.getUniformLocation(program, 'uWarpAmplitude');
      const uBlendAngle = gl.getUniformLocation(program, 'uBlendAngle');
      const uBlendSoftness = gl.getUniformLocation(program, 'uBlendSoftness');
      const uRotationAmount = gl.getUniformLocation(program, 'uRotationAmount');
      const uNoiseScale = gl.getUniformLocation(program, 'uNoiseScale');
      const uGrainAmount = gl.getUniformLocation(program, 'uGrainAmount');
      const uGrainScale = gl.getUniformLocation(program, 'uGrainScale');
      const uGrainAnimated = gl.getUniformLocation(program, 'uGrainAnimated');
      const uContrast = gl.getUniformLocation(program, 'uContrast');
      const uGamma = gl.getUniformLocation(program, 'uGamma');
      const uSaturation = gl.getUniformLocation(program, 'uSaturation');
      const uCenterOffset = gl.getUniformLocation(program, 'uCenterOffset');
      const uZoom = gl.getUniformLocation(program, 'uZoom');
      const uColor1 = gl.getUniformLocation(program, 'uColor1');
      const uColor2 = gl.getUniformLocation(program, 'uColor2');
      const uColor3 = gl.getUniformLocation(program, 'uColor3');

      function resize() {
        const width = Math.max(300, window.innerWidth);
        const height = Math.max(300, window.innerHeight);
        if (canvas.width !== width || canvas.height !== height) {
          canvas.width = width;
          canvas.height = height;
          gl.viewport(0, 0, width, height);
        }
      }
      window.addEventListener('resize', resize);
      resize();

      let startTime = performance.now();
      function render(now) {
        resize();
        gl.useProgram(program);
        const elapsed = (now - startTime) * 0.001;

        gl.uniform2f(uRes, canvas.width, canvas.height);
        gl.uniform1f(uTime, elapsed);
        gl.uniform1f(uTimeSpeed, 0.28);
        gl.uniform1f(uColorBalance, 0.05);
        gl.uniform1f(uWarpStrength, 1.6); // Warp aumentado
        gl.uniform1f(uWarpFrequency, 5.2);
        gl.uniform1f(uWarpSpeed, 2.2);
        gl.uniform1f(uWarpAmplitude, 55.0);
        gl.uniform1f(uBlendAngle, 25.0);
        gl.uniform1f(uBlendSoftness, 0.06);
        gl.uniform1f(uRotationAmount, 580.0);
        gl.uniform1f(uNoiseScale, 2.2);
        gl.uniform1f(uGrainAmount, 0.12);
        gl.uniform1f(uGrainScale, 2.0);
        gl.uniform1f(uGrainAnimated, 1.0);
        gl.uniform1f(uContrast, 1.85); // Contraste amplificado
        gl.uniform1f(uGamma, 1.0);
        gl.uniform1f(uSaturation, 1.45); // Saturacao amplificada
        gl.uniform2f(uCenterOffset, 0.0, 0.0);
        gl.uniform1f(uZoom, 0.9);

        // Cores alteradas e ultra intensas: Solar Ember Orange + Neon Pink Magenta + Deep Galactic Violet
        gl.uniform3f(uColor1, 1.2, 0.35, 0.05); // Solar Ember Orange
        gl.uniform3f(uColor2, 1.3, 0.0, 0.65);  // Electric Laser Pink
        gl.uniform3f(uColor3, 0.05, 0.0, 0.32); // Deep Galactic Violet

        gl.drawArrays(gl.TRIANGLES, 0, 6);
        requestAnimationFrame(render);
      }
      requestAnimationFrame(render);
    })();
  }

})();
