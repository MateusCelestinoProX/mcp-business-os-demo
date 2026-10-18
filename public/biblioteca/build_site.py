#!/usr/bin/env python3
"""
Build script: Reads all supported files (TXT, MD, DOCX, PDF, HTML, Images) 
from the workspace, encrypts the tree JSON and generates a self-contained HTML website.
"""

import os
import json
import re
import zipfile
import xml.etree.ElementTree as ET
import hashlib
import base64

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
OUTPUT_FILE = os.path.join(BASE_DIR, "index.html")

def clean_name(name):
    """Remove author attribution, extensions and clean up display names."""
    name = re.sub(r'\s*-\s*By\s*@xEistibus\s*❤️‍🔥\s*', '', name)
    # Remove typical file extensions
    for ext in ['.txt', '.md', '.docx', '.pdf', '.html', '.htm', '.png', '.jpg', '.jpeg', '.gif', '.webp', '.zip']:
        name = re.sub(re.escape(ext) + r'$', '', name, flags=re.IGNORECASE)
    return name.strip()


def read_txt_file(filepath):
    """Read a TXT or MD file and return its raw content."""
    for enc in ['utf-8', 'utf-8-sig', 'latin-1', 'cp1252']:
        try:
            with open(filepath, 'r', encoding=enc) as f:
                content = f.read()
            # Normalize line endings
            content = content.replace('\r\n', '\n').replace('\r', '\n')
            return content
        except (UnicodeDecodeError, UnicodeError):
            continue
    return None


def read_docx_file(filepath):
    """Read a DOCX file and extract its plain text using native zipfile and xml parser."""
    try:
        with zipfile.ZipFile(filepath) as docx:
            xml_content = docx.read('word/document.xml')
            root = ET.fromstring(xml_content)
            
            # Namespace for Word document elements
            ns = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
            
            paragraphs = []
            for p in root.findall('.//w:p', ns):
                texts = [t.text for t in p.findall('.//w:t', ns) if t.text]
                if texts:
                    paragraphs.append("".join(texts))
                else:
                    paragraphs.append("")
            
            return "\n".join(paragraphs)
    except Exception as e:
        print(f"⚠️ Erro ao extrair texto do DOCX {filepath}: {e}")
        return None


def build_tree(base_dir):
    """Recursively build a tree structure from all folders in the workspace, excluding system ones."""
    tree = {
        'name': 'ΝΞΙΔ - Nova Era da IA™',
        'type': 'root',
        'children': []
    }
    
    # Folders and files to ignore at the root level
    ignored_roots = {
        'RULES', '.git', '.github', '.tmp', '.agents', '__pycache__', 
        'node_modules', '.gemini', 'antigravity-ide'
    }
    
    # Specific files to ignore at root
    ignored_files = {
        'index.html', 'build_site.py', 'app.js', 'style.css',
        'DOCUMENTACAO_COMPLETA.md', 'findings.md', 'gemini.md',
        'progress.md', 'task_plan.md', 'task_plan_backup.md', '.DS_Store'
    }

    def process_dir(dir_path, parent_node):
        items = []
        try:
            entries = sorted(os.listdir(dir_path))
        except OSError:
            return

        for entry in entries:
            full_path = os.path.join(dir_path, entry)
            
            if entry.startswith('.') or entry in ignored_roots:
                continue

            if os.path.isdir(full_path):
                node = {
                    'name': entry,
                    'displayName': clean_name(entry),
                    'type': 'folder',
                    'children': [],
                    'path': os.path.relpath(full_path, base_dir)
                }
                process_dir(full_path, node)
                items.append(node)

            else:
                if entry in ignored_files:
                    continue
                
                ext = entry.split('.')[-1].lower() if '.' in entry else ''
                
                if ext == 'txt':
                    content = read_txt_file(full_path)
                    if content is not None:
                        node = {
                            'name': entry,
                            'displayName': clean_name(entry),
                            'type': 'file',
                            'fileType': 'txt',
                            'content': content,
                            'path': os.path.relpath(full_path, base_dir)
                        }
                        items.append(node)
                
                elif ext == 'md':
                    content = read_txt_file(full_path)
                    if content is not None:
                        node = {
                            'name': entry,
                            'displayName': clean_name(entry),
                            'type': 'file',
                            'fileType': 'md',
                            'content': content,
                            'path': os.path.relpath(full_path, base_dir)
                        }
                        items.append(node)
                
                elif ext == 'docx':
                    content = read_docx_file(full_path)
                    if content is not None:
                        node = {
                            'name': entry,
                            'displayName': clean_name(entry),
                            'type': 'file',
                            'fileType': 'docx',
                            'content': content,
                            'path': os.path.relpath(full_path, base_dir)
                        }
                        items.append(node)
                
                elif ext == 'pdf':
                    node = {
                        'name': entry,
                        'displayName': clean_name(entry),
                        'type': 'file',
                        'fileType': 'pdf',
                        'content': None,
                        'path': os.path.relpath(full_path, base_dir)
                    }
                    items.append(node)
                
                elif ext in ['html', 'htm']:
                    node = {
                        'name': entry,
                        'displayName': clean_name(entry),
                        'type': 'file',
                        'fileType': 'html',
                        'content': None,
                        'path': os.path.relpath(full_path, base_dir)
                    }
                    items.append(node)
                
                elif ext in ['png', 'jpg', 'jpeg', 'gif', 'webp']:
                    node = {
                        'name': entry,
                        'displayName': clean_name(entry),
                        'type': 'file',
                        'fileType': 'image',
                        'content': None,
                        'path': os.path.relpath(full_path, base_dir)
                    }
                    items.append(node)
                
                elif ext == 'zip':
                    node = {
                        'name': entry,
                        'displayName': clean_name(entry),
                        'type': 'file',
                        'fileType': 'zip',
                        'content': None,
                        'path': os.path.relpath(full_path, base_dir)
                    }
                    items.append(node)

        parent_node['children'] = items

    root_items = []
    try:
        entries = sorted(os.listdir(base_dir))
    except OSError:
        return tree

    for entry in entries:
        full_path = os.path.join(base_dir, entry)
        if entry.startswith('.') or entry in ignored_roots or entry in ignored_files:
            continue
        
        if os.path.isdir(full_path):
            node = {
                'name': entry,
                'displayName': clean_name(entry),
                'type': 'folder',
                'children': [],
                'path': os.path.relpath(full_path, base_dir)
            }
            process_dir(full_path, node)
            root_items.append(node)
            
    tree['children'] = root_items
    return tree


def encrypt_data(data_str, password):
    """Encrypt plain text data using simple robust XOR cipher based on SHA-256 password hash."""
    key = hashlib.sha256(password.encode('utf-8')).digest()
    data_bytes = data_str.encode('utf-8')
    key_len = len(key)
    
    # XOR key byte loop
    encrypted = bytearray(b ^ key[i % key_len] for i, b in enumerate(data_bytes))
    return base64.b64encode(encrypted).decode('utf-8')


def generate_html(tree):
    """Generate the complete HTML file with encrypted data and cinematic hero UI."""

    css_path = os.path.join(BASE_DIR, 'style.css')
    js_path = os.path.join(BASE_DIR, 'app.js')

    with open(css_path, 'r', encoding='utf-8') as f:
        css_content = f.read()
    with open(js_path, 'r', encoding='utf-8') as f:
        js_content = f.read()

    # Serialize tree to JSON
    tree_json = json.dumps(tree, ensure_ascii=True, indent=None)
    # Encrypt the JSON data using the password 'ALEXANDRIA'
    encrypted_json = encrypt_data(tree_json, "ALEXANDRIA")

    html = f'''<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="GALADRIEL | PERSONAL LIBRARY — Biblioteca e Central de Conhecimento Multimídia.">
    <title>GALADRIEL | PERSONAL LIBRARY</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Instrument+Serif:ital,wght@0,400;1,400&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
    <style>
{css_content}
    </style>
</head>
<body>
    <!-- Dynamic 5-Background System (GhostFibers, AeroShards, Dither, GradientWaves, Grainient) -->
    <div id="dynamic-bg-container" class="dynamic-bg-container">
        <div class="bg-canvas-wrapper active" id="bg-wrapper-0"><canvas id="canvas-ghostfibers"></canvas></div>
        <div class="bg-canvas-wrapper" id="bg-wrapper-1"><canvas id="canvas-aeroshards"></canvas></div>
        <div class="bg-canvas-wrapper" id="bg-wrapper-2"><canvas id="canvas-dither"></canvas></div>
        <div class="bg-canvas-wrapper" id="bg-wrapper-3"><canvas id="canvas-gradientwaves"></canvas></div>
        <div class="bg-canvas-wrapper" id="bg-wrapper-4"><canvas id="canvas-grainient"></canvas></div>
        <div class="bg-blur-veil"></div>
    </div>

    <!-- Welcome Ceremony Popup -->
    <div id="welcome-popup" class="welcome-popup">
        <div class="welcome-popup-backdrop"></div>
        <div class="welcome-popup-content liquid-glass">
            <div class="welcome-halo"></div>
            <div class="welcome-insignia">ΝΞΙΔ · NOVA ERA DA IA™</div>
            <h1 class="welcome-title">Seja Bem Vindo, Galadriel e associados.</h1>
            <div class="welcome-divider"></div>
            <p class="welcome-subtitle">Que o conhecimento esteja sempre contigo.</p>
            <div class="welcome-progress-bar"><div class="welcome-progress-fill"></div></div>
        </div>
    </div>

    <!-- Ambient Light Effects -->
    <div class="ambient-light ambient-light-1"></div>
    <div class="ambient-light ambient-light-2"></div>
    <div class="ambient-light ambient-light-3"></div>

    <!-- Login Screen Removido - Acesso Direto Livre ao Sistema Galadriel -->

    <!-- Main Header (hidden on login, shown on library) -->
    <header id="main-header" style="display: none;">
        <div class="header-inner">
            <div class="logo" id="logo-home">
                <span class="logo-symbol">ΝΞΙΔ</span>
                <span class="logo-divider"></span>
                <span class="logo-text">GALADRIEL</span>
            </div>
            <div class="search-container" id="search-container">
                <div class="search-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                </div>
                <input type="text" id="search-input" placeholder="Buscar na biblioteca..." autocomplete="off">
                <div class="search-shortcut">⌘K</div>
            </div>
            <div class="header-actions">
                <button id="btn-expand-all" class="header-btn" title="Expandir tudo">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>
                </button>
                <button id="btn-collapse-all" class="header-btn" title="Recolher tudo">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 15l-6-6-6 6"/></svg>
                </button>
                <button id="btn-logout" class="header-btn" title="Sair (Logout)" style="display: none;">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                </button>
            </div>
        </div>
    </header>

    <!-- Breadcrumb (hidden on login/homepage, shown inside directories) -->
    <nav id="breadcrumb" class="breadcrumb" style="display: none;">
        <div class="breadcrumb-inner">
            <span class="breadcrumb-item breadcrumb-home" data-navigate="home">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                Início
            </span>
        </div>
    </nav>

    <!-- Main Content Container (hidden on login, shown on library) -->
    <main id="main-content" style="display: none; padding-top: 0;">
        <!-- Landing / Categories View -->
        <div id="categories-view" class="view active">
            <!-- Fullscreen Cinematic Hero -->
            <div class="cinematic-hero">
                <!-- Background Video -->
                <div class="video-container">
                    <video id="hero-video" class="hero-video" muted playsinline>
                        <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_115001_bcdaa3b4-03de-47e7-ad63-ae3e392c32d4.mp4" type="video/mp4">
                    </video>
                </div>
                
                <!-- Overlay Content (Header, Email capture, and social icons removed) -->
                <div class="hero-overlay-content" style="justify-content: center; padding-top: 0;">
                    <!-- Center Content -->
                    <div class="hero-center-content" style="transform: translateY(0);">
                        <h1 class="hero-center-title" style="font-family: 'Instrument Serif', serif; font-size: 5rem; text-shadow: 0 0 60px rgba(255,255,255,0.4); margin-bottom: 24px;">
                            GALADRIEL
                            <span class="hero-center-subtitle" style="display: block; font-family: var(--font-mono); font-size: 0.85rem; letter-spacing: 8px; text-transform: uppercase; color: var(--divine-muted); margin-top: 20px;">PERSONAL LIBRARY</span>
                        </h1>
                    </div>
                </div>
                <!-- Smooth Cinematic Hero Bottom Fade -->
                <div class="hero-bottom-fade"></div>
            </div>

            <!-- Library Modules Grid (Global stats header title removed) -->
            <div class="library-modules-section" id="library-modules-section">
                <div class="hero-section" style="padding: 24px 24px 0;">
                    <div class="hero-glow"></div>
                    <div class="hero-stats" id="hero-stats"></div>
                </div>
                <!-- Homepage Hero Sessions Container -->
                <div class="hero-sessions-container" id="hero-sessions-container"></div>
            </div>
        </div>

        <!-- Subcategories / Folder View -->
        <div id="folder-view" class="view">
            <div class="folder-header" id="folder-header">
                <h2 class="folder-title" id="folder-title"></h2>
                <p class="folder-desc" id="folder-desc"></p>
            </div>
            <div class="folder-grid" id="folder-grid"></div>
        </div>

        <!-- Content / Article View -->
        <div id="article-view" class="view">
            <div class="article-container" id="article-container">
                <div class="article-header" id="article-header">
                    <h1 class="article-title" id="article-title"></h1>
                    <div class="article-meta" id="article-meta"></div>
                </div>
                <div class="article-body" id="article-body"></div>
            </div>
        </div>

        <!-- Search Results -->
        <div id="search-view" class="view">
            <div class="search-results-header">
                <h2 id="search-results-title">Resultados da busca</h2>
            </div>
            <div class="search-results-list" id="search-results-list"></div>
        </div>
    </main>

    <!-- Footer -->
    <footer id="main-footer" style="display: none;">
        <div class="footer-inner">
            <span class="footer-brand">GALADRIEL — PERSONAL LIBRARY</span>
            <span class="footer-credit">By @xEistibus ❤️‍🔥</span>
        </div>
    </footer>

    <!-- Encrypted Data -->
    <script id="site-data" type="text/plain">{encrypted_json}</script>

    <script>
{js_content}
    </script>
</body>
</html>'''

    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        f.write(html)

    print(f"✅ Website gerado com sucesso: {OUTPUT_FILE}")

    # Stats
    def count_files(node):
        if node['type'] == 'file':
            return 1
        return sum(count_files(c) for c in node.get('children', []))

    def count_folders(node):
        if node['type'] == 'file':
            return 0
        return 1 + sum(count_folders(c) for c in node.get('children', []))

    total_files = count_files(tree)
    total_folders = count_folders(tree)
    print(f"📁 {total_folders} pastas / 📄 {total_files} arquivos processados")


if __name__ == '__main__':
    print("🔄 Construindo a árvore de conteúdo a partir de todos os diretórios do workspace...")
    tree = build_tree(BASE_DIR)
    print("🎨 Gerando o website...")
    generate_html(tree)
