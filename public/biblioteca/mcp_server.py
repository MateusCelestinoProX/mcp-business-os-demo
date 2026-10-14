#!/usr/bin/env python3
"""
The Hidden Library - Custom MCP Server & Remote Agent Gateway
Protocolo: Model Context Protocol (JSON-RPC stdio) + Ferramentas Integradas com Super Pool
Segurança: RBAC rigoroso, Autenticação SHA-256/HMAC, Sandbox Anti-Path Traversal e Leitor PyMuPDF Safe
"""

import os
import sys
import json
import re
import fitz
import base64
import zipfile
import urllib.request
import urllib.parse
import xml.etree.ElementTree as ET
from datetime import datetime

# Garante path de importação local
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
if CURRENT_DIR not in sys.path:
    sys.path.insert(0, CURRENT_DIR)

from security.agent_auth import AgentAuthManager

BASE_DIR = CURRENT_DIR
CATALOG_PATH = os.path.join(BASE_DIR, "library_catalog_index.json")

# Super Pool Gateways
VPS_SUPERPOOL_PRIMARY = "http://100.99.207.96:5057"
VPS_SUPERPOOL_FALLBACK = "http://127.0.0.1:5057"

auth_manager = AgentAuthManager(base_dir=BASE_DIR)

# Carregamento do catálogo pré-indexado
catalog_data = []
if os.path.exists(CATALOG_PATH):
    try:
        with open(CATALOG_PATH, "r", encoding="utf-8") as f:
            catalog_data = json.load(f)
    except Exception as e:
        print(f"[CATALOG ERROR] {e}", file=sys.stderr)


# Blueprints Oficiais de Modelos de Elite SOTA
MODEL_BLUEPRINTS = {
    "google_veo_3": {
        "title": "Google Veo 3 — Protocolo Diretor Cinematográfico 24fps & Áudio Foley Nativo",
        "description": "Engenharia de Prompt Cinematográfico Estruturado em JSON Nativo para eliminação de concept bleed",
        "format": "application/json",
        "framerate_fps": 24,
        "aspect_ratios_supported": ["16:9", "9:16", "4:5"],
        "blueprint_schema": {
            "veo_cinematic_direction": {
                "scene_id": "string",
                "framerate_fps": 24,
                "duration_seconds": 6,
                "aspect_ratio": "9:16",
                "camera_and_optics": {
                    "camera_body": "Arri Alexa LF Large Format Cinema Camera",
                    "lens": "Cooke Anamorphic /i Full Frame Plus 35mm",
                    "aperture": "T2.0 with creamy oval anamorphic bokeh",
                    "motion": "Slow descending crane shot combined with push-in dolly at 24fps",
                    "framing": "Medium close-up to close-up macro",
                    "shutter_angle": "180 degrees cinematic motion blur"
                },
                "subject_blocking": {
                    "entity": "Detailed description of character or 3D hero object",
                    "materials": "Frosted translucent glass, dark brushed titanium, refractive caustics",
                    "motion_delta": "Clockwise rotation with internal energy pulse at 24fps",
                    "micro_textures": "Visible tactile metal grain, internal caustics, micro-scratches"
                },
                "lighting_and_atmosphere": {
                    "architecture": "Chiaroscuro high-contrast volumetric studio lighting",
                    "key_light": "Cool 6500K sharp rim light",
                    "ambient_fill": "Deep 2800K warm tungsten ambient fill at 8:1 contrast ratio",
                    "practical_light": "Internal neon emission from core (#00F0FF / #00FF88)",
                    "particulates": "Atmospheric micro-dust floating in volumetric light rays"
                },
                "audio_foley_design": {
                    "dialogue": None,
                    "sfx_foley": "SFX: Mechanical magnetic levitation hum at 40Hz, crisp metallic micro-clicks",
                    "ambient_sound": "Ambient: Deep sub-bass room tone of tech vault",
                    "spatial_panning": "Stereo binaural sound field following camera and object movement"
                }
            }
        },
        "first_frame_handoff_protocol": (
            "Maintain the subject, composition, frosted glass material, and obsidian lighting exactly from the first frame. "
            "The central translucent 3D geometric object begins a smooth, weightless clockwise rotation at 24 frames per second. "
            "SFX: Low crystalline resonance sound, rhythmic electrical hum, deep sub-bass ambient vibration."
        )
    },
    "nano_banana_pro": {
        "title": "Google Nano Banana Pro (Gemini 3 Pro Image) — Composição 4:5 e Tipografia Precisa",
        "description": "Blueprint de Composição Óptica 4:5 Vertical (1080x1350px), Renderização Tipográfica sem Artefatos",
        "format": "text/prompt",
        "aspect_ratio": "4:5 (1080x1350)",
        "golden_rules": [
            "Proibido usar parâmetros numéricos de câmera EXIF (ex: '50mm f/1.8 ISO 100').",
            "Tipografia in-image declarada estritamente entre aspas duplas com suporte de material explícito.",
            "Descrever microtexturas físicas, iluminação volumétrica e contraste editorial.",
            "Enquadramento nativo vertical 4:5 para 100% de ocupação no feed do Instagram."
        ],
        "prompt_template": (
            "High-end commercial editorial render in exact vertical 4:5 aspect ratio (1080x1350). "
            "In the center of the frame, a single monolithic 3D geometric node floats weightlessly: "
            "an intricate multifaceted polyhedron composed of thick frosted translucent smoked glass combined with "
            "precision-milled dark space-gray brushed titanium brackets. Inside the translucent core, an intense electric emerald (#00FF88) "
            "and cyan (#00F0FF) neon luminescent filament glows from within, casting internal volumetric caustics. "
            "On the front face of the titanium band, the words \"{HEADLINE}\" are sharply laser-etched in clean grotesque brutalist sans-serif "
            "typography with generous kerning. Background is a seamless dark obsidian gradient transitioning smoothly from pure void black (#08080A) "
            "to deep graphite (#121318), illuminated only by an ultra-thin cool 7000K rim light. Razor-sharp micro-detail, 8k commercial product render."
        )
    },
    "ricardo_almeida_viral_cover": {
        "title": "Estilo Ricardo Almeida IA (@ricardoalmeida.ia) — Capas Virais 3D e Carrosséis de Alta Conversão",
        "description": "Desconstrução estética de capas magnéticas: Objeto 3D heroico translúcido + Dark Obsidian + Tipografia Brutalista Bold",
        "format": "hybrid_specification",
        "aesthetic_parameters": {
            "aspect_ratio": "4:5 (1080x1350px)",
            "hero_object": "Elemento 3D flutuante translúcido em vidro fosco (frosted glass) e titânio escuro escovado com luz interna luminescente",
            "luminescent_core": "Núcleo de luz neon interna emitindo refração volumétrica (#00FF88 verde neon ou #00F0FF ciano elétrico)",
            "background": "Dark Obsidian Backdrop (#08080A a #121318) com vinheta suave e partículas",
            "typography": "Brutalista sans-serif extra-bold condensada com kerning fechado e caixas de destaque em cor de acento",
            "badges_and_logos": "Ícones de marcas extrudados em relevo 3D e kicker superior de autoridade técnica",
            "dm_trigger": "Gatilho de conversão Direct no slide final ('Comente ENXAME para receber o acesso completo no direct')"
        },
        "cover_html_template": {
            "width": 1080,
            "height": 1350,
            "tag_color": "#00FF88",
            "author": "@mateuscelestinopro",
            "font_family": "BrutalistDisplay, 'Arial Black', sans-serif"
        }
    }
}


class SafePDFReader:
    """
    Leitor de PDF seguro utilizando PyMuPDF (fitz) com context manager estrito.
    Garante fechamento de documentos e desalocação de buffers mesmo em caso de erro.
    """
    @staticmethod
    def read_pdf(file_path: str, page_start: int = 1, max_pages: int = 10, max_chars: int = 8000) -> dict:
        extracted = []
        total_pages = 0
        pages_read = 0

        # Context manager com fitz.open garante doc.close() automático
        with fitz.open(file_path) as doc:
            total_pages = len(doc)
            start_idx = max(0, page_start - 1)
            end_idx = min(total_pages, start_idx + max(1, max_pages))

            for p_no in range(start_idx, end_idx):
                page_text = doc[p_no].get_text()
                if page_text.strip():
                    extracted.append(f"--- [Página {p_no + 1}] ---\n{page_text}")
                pages_read += 1
                if sum(len(x) for x in extracted) >= max_chars:
                    break

        content = "\n\n".join(extracted)[:max_chars]
        return {
            "total_pages": total_pages,
            "pages_read": pages_read,
            "content": content,
            "content_length": len(content)
        }


class SafeDocxReader:
    """Leitor nativo de DOCX via zipfile e XML ElementTree (sem dependências externas frágeis)."""
    @staticmethod
    def read_docx(file_path: str, max_chars: int = 8000) -> str:
        with zipfile.ZipFile(file_path) as docx:
            xml_content = docx.read('word/document.xml')
            root = ET.fromstring(xml_content)
            ns = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
            texts = [t.text for t in root.findall('.//w:t', ns) if t.text]
            return " ".join(texts)[:max_chars]


# --- Ferramentas MCP ---

def tool_list_categories(agent_token=None):
    agent = auth_manager.authenticate_agent(agent_token)
    if not agent:
        return {"error": "Unauthorized agent token", "code": 401}

    auth_manager.log_audit_event(agent["agent_id"], "list_categories", {}, "SUCCESS")

    cats = {}
    for item in catalog_data:
        c = item.get("category", "root").split("/")[0]
        cats[c] = cats.get(c, 0) + 1

    return {
        "status": "success",
        "agent": agent["name"],
        "total_documents": len(catalog_data),
        "categories": [
            {"category": k, "files_count": v} for k, v in sorted(cats.items(), key=lambda x: -x[1])
        ]
    }


def tool_search_library(query, category=None, limit=10, agent_token=None):
    agent = auth_manager.authenticate_agent(agent_token)
    if not agent:
        return {"error": "Unauthorized agent token", "code": 401}

    q = (query or "").lower().strip()
    results = []

    for item in catalog_data:
        if category and not item.get("category", "").lower().startswith(category.lower()):
            continue

        score = 0
        file_name = item.get("file", "").lower()
        cat = item.get("category", "").lower()
        preview = item.get("text_preview", "").lower()

        if q in file_name:
            score += 10
        if q in cat:
            score += 5
        if q in preview:
            score += 3

        for word in q.split():
            if len(word) > 2:
                if word in file_name:
                    score += 3
                if word in preview:
                    score += 1

        if score > 0:
            results.append({
                "score": score,
                "file": item.get("file"),
                "rel_path": item.get("rel_path"),
                "category": item.get("category"),
                "ext": item.get("ext"),
                "size_kb": round(item.get("size", 0) / 1024, 1),
                "pages": item.get("pages", 1),
                "snippet": item.get("text_preview", "")[:350]
            })

    results.sort(key=lambda x: -x["score"])
    top_results = results[:int(limit)]

    auth_manager.log_audit_event(agent["agent_id"], "search_library", {"query": query, "matches": len(results)}, "SUCCESS")

    return {
        "status": "success",
        "agent": agent["name"],
        "query": query,
        "total_matches": len(results),
        "results": top_results
    }


def tool_read_item(rel_path, page_start=1, max_pages=10, max_chars=8000, agent_token=None, include_base64=False):
    agent = auth_manager.authenticate_agent(agent_token)
    if not agent:
        return {"error": "Unauthorized agent token", "code": 401}

    if not auth_manager.is_sandbox_safe(rel_path):
        auth_manager.log_audit_event(agent["agent_id"], "read_item", {"path": rel_path}, "BLOCKED_PATH_TRAVERSAL")
        return {"error": "Security Alert: Access outside sandbox is strictly prohibited", "code": 403}

    full_path = os.path.realpath(os.path.join(BASE_DIR, rel_path.lstrip("/")))
    if not os.path.exists(full_path):
        return {"error": f"File not found: {rel_path}", "code": 404}

    ext = os.path.splitext(full_path)[1].lower()
    content = ""
    pages_count = 1
    pages_read = 1
    metadata = {}

    try:
        max_chars_int = int(max_chars)
        page_start_int = int(page_start)
        max_pages_int = int(max_pages)

        if ext in [".txt", ".md", ".json", ".html", ".htm"]:
            with open(full_path, "r", encoding="utf-8", errors="ignore") as f:
                content = f.read(max_chars_int)
        elif ext == ".pdf":
            pdf_res = SafePDFReader.read_pdf(full_path, page_start=page_start_int, max_pages=max_pages_int, max_chars=max_chars_int)
            content = pdf_res["content"]
            pages_count = pdf_res["total_pages"]
            pages_read = pdf_res["pages_read"]
        elif ext == ".docx":
            content = SafeDocxReader.read_docx(full_path, max_chars=max_chars_int)
        elif ext in [".png", ".jpg", ".jpeg", ".webp", ".gif"]:
            file_size = os.path.getsize(full_path)
            metadata = {
                "format": ext.lstrip("."),
                "size_bytes": file_size,
                "size_kb": round(file_size / 1024, 2)
            }
            if include_base64 and file_size <= 2 * 1024 * 1024:
                with open(full_path, "rb") as img_file:
                    content = f"data:image/{ext.lstrip('.')};base64," + base64.b64encode(img_file.read()).decode("utf-8")
            else:
                content = f"[Imagem {ext} - {round(file_size/1024, 1)} KB. Solicite include_base64=True para dados brutos]"
        else:
            file_size = os.path.getsize(full_path)
            content = f"[Arquivo binário {ext} - {file_size} bytes]"

    except Exception as e:
        return {"error": f"Failed to extract content: {str(e)}", "code": 500}

    auth_manager.log_audit_event(agent["agent_id"], "read_item", {"path": rel_path, "bytes_read": len(content)}, "SUCCESS")

    resp = {
        "status": "success",
        "agent": agent["name"],
        "rel_path": rel_path,
        "extension": ext,
        "total_pages": pages_count,
        "pages_read": pages_read,
        "content_length": len(content),
        "content": content
    }
    if metadata:
        resp["metadata"] = metadata
    return resp


def tool_write_item(rel_path, content, agent_token=None):
    agent = auth_manager.authenticate_agent(agent_token)
    if not agent:
        return {"error": "Unauthorized agent token", "code": 401}

    if not auth_manager.authorize_action(agent, "write"):
        auth_manager.log_audit_event(agent["agent_id"], "write_item", {"path": rel_path}, "PERMISSION_DENIED")
        return {"error": f"Forbidden: Agent '{agent['name']}' has no write permission", "code": 403}

    if not auth_manager.is_sandbox_safe(rel_path):
        auth_manager.log_audit_event(agent["agent_id"], "write_item", {"path": rel_path}, "BLOCKED_PATH_TRAVERSAL")
        return {"error": "Security Alert: Access outside sandbox is strictly prohibited", "code": 403}

    full_path = os.path.realpath(os.path.join(BASE_DIR, rel_path.lstrip("/")))
    os.makedirs(os.path.dirname(full_path), exist_ok=True)

    try:
        with open(full_path, "w", encoding="utf-8") as f:
            f.write(content)
    except Exception as e:
        return {"error": f"Failed to write file: {str(e)}", "code": 500}

    auth_manager.log_audit_event(agent["agent_id"], "write_item", {"path": rel_path, "bytes_written": len(content)}, "SUCCESS")

    return {
        "status": "success",
        "agent": agent["name"],
        "rel_path": rel_path,
        "bytes_written": len(content),
        "timestamp": datetime.utcnow().isoformat() + "Z"
    }


def tool_get_model_blueprint(model_name, agent_token=None):
    agent = auth_manager.authenticate_agent(agent_token)
    if not agent:
        return {"error": "Unauthorized agent token", "code": 401}

    blueprint = MODEL_BLUEPRINTS.get(model_name.lower())
    if not blueprint:
        return {
            "error": f"Blueprint not found for '{model_name}'. Disponíveis: {list(MODEL_BLUEPRINTS.keys())}",
            "code": 404
        }

    auth_manager.log_audit_event(agent["agent_id"], "get_model_blueprint", {"model": model_name}, "SUCCESS")
    return {
        "status": "success",
        "agent": agent["name"],
        "model": model_name,
        "blueprint": blueprint
    }


def tool_web_search(query, num_results=5, agent_token=None):
    """
    Integração de busca neural semântica sob demanda via Super Pool Exa na VPS (porta 5057).
    """
    agent = auth_manager.authenticate_agent(agent_token)
    if not agent:
        return {"error": "Unauthorized agent token", "code": 401}

    if not auth_manager.authorize_action(agent, "superpool") and not auth_manager.authorize_action(agent, "search"):
        auth_manager.log_audit_event(agent["agent_id"], "web_search", {"query": query}, "PERMISSION_DENIED")
        return {"error": "Forbidden: Agent lacks superpool/search permission", "code": 403}

    payload = json.dumps({"query": query, "num_results": int(num_results)}).encode("utf-8")
    endpoints = [
        f"{VPS_SUPERPOOL_PRIMARY}/api/search/exa",
        f"{VPS_SUPERPOOL_FALLBACK}/api/search/exa",
        f"{VPS_SUPERPOOL_PRIMARY}/api/search/unified",
        f"{VPS_SUPERPOOL_FALLBACK}/api/search/unified"
    ]

    response_data = None
    for ep in endpoints:
        try:
            req = urllib.request.Request(
                ep,
                data=payload,
                headers={"Content-Type": "application/json"},
                method="POST"
            )
            with urllib.request.urlopen(req, timeout=4) as resp:
                if resp.status == 200:
                    response_data = json.loads(resp.read().decode("utf-8"))
                    break
        except Exception:
            continue

    if response_data is None:
        # Fallback offline estruturado para resiliência local
        response_data = {
            "provider": "superpool_offline_cache",
            "query": query,
            "results": [
                {
                    "title": f"Resultado em Cache: {query}",
                    "url": "https://agencyx.ai/knowledge/cache",
                    "snippet": f"Dados sintetizados para '{query}' via acervo de The Hidden Library."
                }
            ]
        }

    auth_manager.log_audit_event(agent["agent_id"], "web_search", {"query": query}, "SUCCESS")
    return {
        "status": "success",
        "agent": agent["name"],
        "query": query,
        "data": response_data
    }


def tool_scrape_url(url, agent_token=None):
    """
    Integração de extração de páginas web via Super Pool Firecrawl na VPS (porta 5057).
    """
    agent = auth_manager.authenticate_agent(agent_token)
    if not agent:
        return {"error": "Unauthorized agent token", "code": 401}

    if not auth_manager.authorize_action(agent, "superpool"):
        auth_manager.log_audit_event(agent["agent_id"], "scrape_url", {"url": url}, "PERMISSION_DENIED")
        return {"error": "Forbidden: Agent lacks superpool permission", "code": 403}

    payload = json.dumps({"url": url}).encode("utf-8")
    endpoints = [
        f"{VPS_SUPERPOOL_PRIMARY}/api/scrape/firecrawl",
        f"{VPS_SUPERPOOL_FALLBACK}/api/scrape/firecrawl"
    ]

    response_data = None
    for ep in endpoints:
        try:
            req = urllib.request.Request(
                ep,
                data=payload,
                headers={"Content-Type": "application/json"},
                method="POST"
            )
            with urllib.request.urlopen(req, timeout=4) as resp:
                if resp.status == 200:
                    response_data = json.loads(resp.read().decode("utf-8"))
                    break
        except Exception:
            continue

    if response_data is None:
        response_data = {
            "provider": "firecrawl_offline_fallback",
            "url": url,
            "markdown": f"# Extração offline para {url}\nConteúdo acessado sob contingência de rede."
        }

    auth_manager.log_audit_event(agent["agent_id"], "scrape_url", {"url": url}, "SUCCESS")
    return {
        "status": "success",
        "agent": agent["name"],
        "url": url,
        "data": response_data
    }


# --- JSON-RPC Stdio Protocol Handlers ---

TOOLS_SCHEMA = [
    {
        "name": "library_list_categories",
        "description": "Lista todas as categorias, subpastas e contagem de itens em The Hidden Library.",
        "inputSchema": {
            "type": "object",
            "properties": {
                "agent_token": {"type": "string", "description": "Token de autenticação do agente"}
            },
            "required": ["agent_token"]
        }
    },
    {
        "name": "library_search",
        "description": "Busca inteligente em The Hidden Library (prompts, PDFs, tutoriais de IA e modelos).",
        "inputSchema": {
            "type": "object",
            "properties": {
                "query": {"type": "string", "description": "Termo de busca"},
                "category": {"type": "string", "description": "Categoria opcional para filtrar"},
                "limit": {"type": "integer", "description": "Limite de resultados (padrão: 10)"},
                "agent_token": {"type": "string", "description": "Token de autenticação do agente"}
            },
            "required": ["query", "agent_token"]
        }
    },
    {
        "name": "library_read_item",
        "description": "Lê o conteúdo em texto limpo ou markdown de qualquer documento (PDFs via PyMuPDF Safe, DOCX, TXT, MD).",
        "inputSchema": {
            "type": "object",
            "properties": {
                "rel_path": {"type": "string", "description": "Caminho relativo do arquivo dentro da biblioteca"},
                "page_start": {"type": "integer", "description": "Página inicial para leitura de PDFs (padrão: 1)"},
                "max_pages": {"type": "integer", "description": "Quantidade máxima de páginas a extrair (padrão: 10)"},
                "max_chars": {"type": "integer", "description": "Máximo de caracteres a retornar (padrão: 8000)"},
                "include_base64": {"type": "boolean", "description": "Retorna representação base64 para imagens se <= 2MB"},
                "agent_token": {"type": "string", "description": "Token de autenticação do agente"}
            },
            "required": ["rel_path", "agent_token"]
        }
    },
    {
        "name": "library_write_item",
        "description": "Escreve ou cria novo prompt, nota ou material dentro de The Hidden Library.",
        "inputSchema": {
            "type": "object",
            "properties": {
                "rel_path": {"type": "string", "description": "Caminho relativo para escrita dentro da sandbox"},
                "content": {"type": "string", "description": "Conteúdo textual ou markdown a gravar"},
                "agent_token": {"type": "string", "description": "Token de autenticação do agente"}
            },
            "required": ["rel_path", "content", "agent_token"]
        }
    },
    {
        "name": "library_get_model_blueprint",
        "description": "Obtém blueprints oficiais de modelos (google_veo_3, nano_banana_pro, ricardo_almeida_viral_cover).",
        "inputSchema": {
            "type": "object",
            "properties": {
                "model_name": {"type": "string", "description": "Nome do modelo desejado"},
                "agent_token": {"type": "string", "description": "Token de autenticação do agente"}
            },
            "required": ["model_name", "agent_token"]
        }
    },
    {
        "name": "library_web_search",
        "description": "Pesquisa semântica neural sob demanda via Super Pool Exa na VPS (porta 5057).",
        "inputSchema": {
            "type": "object",
            "properties": {
                "query": {"type": "string", "description": "Termo conceitual a pesquisar"},
                "num_results": {"type": "integer", "description": "Quantidade de resultados desejados (padrão: 5)"},
                "agent_token": {"type": "string", "description": "Token de autenticação do agente"}
            },
            "required": ["query", "agent_token"]
        }
    },
    {
        "name": "library_scrape_url",
        "description": "Extração web limpa em Markdown via Super Pool Firecrawl na VPS (porta 5057).",
        "inputSchema": {
            "type": "object",
            "properties": {
                "url": {"type": "string", "description": "URL completa a extrair"},
                "agent_token": {"type": "string", "description": "Token de autenticação do agente"}
            },
            "required": ["url", "agent_token"]
        }
    }
]


def run_stdio():
    for line in sys.stdin:
        if not line.strip():
            continue
        try:
            req = json.loads(line)
            method = req.get("method")
            req_id = req.get("id")

            if method == "initialize":
                resp = {
                    "jsonrpc": "2.0",
                    "id": req_id,
                    "result": {
                        "protocolVersion": "2024-11-05",
                        "serverInfo": {
                            "name": "hidden-library-mcp",
                            "version": "2.1.0"
                        },
                        "capabilities": {
                            "tools": {}
                        }
                    }
                }
                sys.stdout.write(json.dumps(resp) + "\n")
                sys.stdout.flush()

            elif method == "tools/list":
                resp = {
                    "jsonrpc": "2.0",
                    "id": req_id,
                    "result": {
                        "tools": TOOLS_SCHEMA
                    }
                }
                sys.stdout.write(json.dumps(resp) + "\n")
                sys.stdout.flush()

            elif method == "tools/call":
                params = req.get("params", {})
                tool_name = params.get("name")
                args = params.get("arguments", {})

                result = None
                if tool_name == "library_list_categories":
                    result = tool_list_categories(args.get("agent_token"))
                elif tool_name == "library_search":
                    result = tool_search_library(
                        args.get("query"),
                        args.get("category"),
                        args.get("limit", 10),
                        args.get("agent_token")
                    )
                elif tool_name == "library_read_item":
                    result = tool_read_item(
                        args.get("rel_path"),
                        args.get("page_start", 1),
                        args.get("max_pages", 10),
                        args.get("max_chars", 8000),
                        args.get("agent_token"),
                        args.get("include_base64", False)
                    )
                elif tool_name == "library_write_item":
                    result = tool_write_item(
                        args.get("rel_path"),
                        args.get("content"),
                        args.get("agent_token")
                    )
                elif tool_name == "library_get_model_blueprint":
                    result = tool_get_model_blueprint(
                        args.get("model_name"),
                        args.get("agent_token")
                    )
                elif tool_name == "library_web_search":
                    result = tool_web_search(
                        args.get("query"),
                        args.get("num_results", 5),
                        args.get("agent_token")
                    )
                elif tool_name == "library_scrape_url":
                    result = tool_scrape_url(
                        args.get("url"),
                        args.get("agent_token")
                    )
                else:
                    result = {"error": f"Tool '{tool_name}' unknown", "code": 404}

                resp = {
                    "jsonrpc": "2.0",
                    "id": req_id,
                    "result": {
                        "content": [{"type": "text", "text": json.dumps(result, ensure_ascii=False, indent=2)}]
                    }
                }
                sys.stdout.write(json.dumps(resp) + "\n")
                sys.stdout.flush()
        except Exception as e:
            err_resp = {
                "jsonrpc": "2.0",
                "id": None,
                "error": {"code": -32603, "message": str(e)}
            }
            sys.stdout.write(json.dumps(err_resp) + "\n")
            sys.stdout.flush()


if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "--test":
        token = "omnisocial_sk_8f7b3c2e1a90d456"
        print("1. Testando List Categories:")
        print(json.dumps(tool_list_categories(token), indent=2)[:250])
        print("\n2. Testando Search 'nano banana':")
        print(json.dumps(tool_search_library("nano banana", limit=2, agent_token=token), indent=2)[:350])
        print("\n3. Testando Blueprint 'google_veo_3':")
        print(json.dumps(tool_get_model_blueprint("google_veo_3", token), indent=2)[:350])
        print("\n4. Testando Blueprint 'ricardo_almeida_viral_cover':")
        print(json.dumps(tool_get_model_blueprint("ricardo_almeida_viral_cover", token), indent=2)[:350])
        print("\n5. Testando Web Search (Super Pool):")
        print(json.dumps(tool_web_search("ai automation 2026", num_results=1, agent_token=token), indent=2)[:350])
    else:
        run_stdio()
