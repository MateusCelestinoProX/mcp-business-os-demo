import os
import json
import time
import hashlib
import hmac
import urllib.parse
from datetime import datetime, timezone

SECURITY_DIR = os.path.dirname(os.path.abspath(__file__))
BASE_DIR = os.path.dirname(SECURITY_DIR)
REGISTRY_PATH = os.path.join(SECURITY_DIR, "agent_registry.json")
AUDIT_LOG_PATH = os.path.join(SECURITY_DIR, "audit_access_log.jsonl")
MAX_AUDIT_LOG_BYTES = 5 * 1024 * 1024  # 5 MB

DEFAULT_REGISTRY = {
    "agents": {
        "omnisocial_master": {
            "name": "OmniSocial Master Engine",
            "token_hash": hashlib.sha256(b"omnisocial_sk_8f7b3c2e1a90d456").hexdigest(),
            "role": "admin",
            "permissions": ["read", "write", "search", "export", "manage", "superpool"],
            "scopes": ["read", "write", "search", "export", "manage", "superpool", "admin"],
            "created_at": "2026-10-10T14:30:00Z"
        },
        "antigravity_mac": {
            "name": "Google Antigravity Mac Instance",
            "token_hash": hashlib.sha256(b"antigravity_sk_4a2c9e7b1d8f3065").hexdigest(),
            "role": "admin",
            "permissions": ["read", "write", "search", "export", "manage", "superpool"],
            "scopes": ["read", "write", "search", "export", "manage", "superpool", "admin"],
            "created_at": "2026-10-10T14:30:00Z"
        },
        "reverse_prompter": {
            "name": "Reverse Prompt Studio",
            "token_hash": hashlib.sha256(b"revprompter_sk_3d5a7b9c1e2f4680").hexdigest(),
            "role": "contributor",
            "permissions": ["read", "write", "search"],
            "scopes": ["read", "write", "search"],
            "created_at": "2026-10-10T14:30:00Z"
        },
        "media_generator": {
            "name": "Media Generator Engine",
            "token_hash": hashlib.sha256(b"mediagen_sk_5c7e9a1b3d4f6802").hexdigest(),
            "role": "contributor",
            "permissions": ["read", "write", "search"],
            "scopes": ["read", "write", "search"],
            "created_at": "2026-10-10T14:30:00Z"
        },
        "copiloto_reuniao": {
            "name": "Copiloto Reuniao Agent",
            "token_hash": hashlib.sha256(b"copiloto_sk_1a2b3c4d5e6f7890").hexdigest(),
            "role": "contributor",
            "permissions": ["read", "write", "search"],
            "scopes": ["read", "write", "search"],
            "created_at": "2026-10-10T14:30:00Z"
        },
        "vps_external_agent": {
            "name": "VPS Remote Agent",
            "token_hash": hashlib.sha256(b"vps_agent_sk_9e8d7c6b5a4f3210").hexdigest(),
            "role": "reader",
            "permissions": ["read", "search"],
            "scopes": ["read", "search"],
            "created_at": "2026-10-10T14:30:00Z"
        }
    }
}


def sanitize_relative_path(rel_path: str) -> str:
    """
    Decodifica recursivamente representações URL-encoded (incluindo double encoding)
    e normaliza barras.
    Rejeita null bytes gerando ValueError.
    """
    if not isinstance(rel_path, str):
        raise ValueError("rel_path deve ser uma string")
    
    if "\x00" in rel_path:
        raise ValueError("Null byte detectado no caminho")

    current = rel_path
    for _ in range(5):  # Descompactação iterativa de até 5 níveis de encoding
        decoded = urllib.parse.unquote(current)
        if "\x00" in decoded:
            raise ValueError("Null byte detectado após decodificação de URL")
        if decoded == current:
            break
        current = decoded

    # Normalizar separadores de diretório
    normalized = current.replace("\\", "/")
    return normalized


class AgentAuthManager:
    """
    Gerenciador RBAC e Sandbox Criptográfico de The Hidden Library.
    Implementa:
    - Autenticação de tokens via SHA-256 e hmac.compare_digest contra timing attacks.
    - Autorização de escopos granulares (read, write, admin, superpool, search, export).
    - Sandbox anti-path traversal estrito com os.path.realpath e rejeição de symlinks externos.
    - Ledger append-only JSONL com rotação automática acima de 5MB.
    """

    def __init__(self, base_dir: str = None):
        self.base_dir = os.path.realpath(base_dir or BASE_DIR)
        self.load_registry()

    def load_registry(self):
        if not os.path.exists(REGISTRY_PATH):
            with open(REGISTRY_PATH, "w", encoding="utf-8") as f:
                json.dump(DEFAULT_REGISTRY, f, indent=2)
            self.registry = DEFAULT_REGISTRY
        else:
            try:
                with open(REGISTRY_PATH, "r", encoding="utf-8") as f:
                    self.registry = json.load(f)
            except Exception:
                self.registry = DEFAULT_REGISTRY

    def authenticate_agent(self, raw_token: str):
        """
        Valida o token do agente via hmac.compare_digest contra o hash SHA-256 armazenado.
        Retorna perfil do agente autenticado ou None se inválido/inexistente.
        """
        if not raw_token or not isinstance(raw_token, str):
            return None
        
        token_hash = hashlib.sha256(raw_token.strip().encode("utf-8")).hexdigest()
        
        for agent_id, data in self.registry.get("agents", {}).items():
            stored_hash = data.get("token_hash", "")
            # hmac.compare_digest para eliminar vulnerabilidade de timing attacks
            if hmac.compare_digest(stored_hash, token_hash):
                perms = list(data.get("permissions", []))
                scopes = list(data.get("scopes", perms))
                if data.get("role") == "admin":
                    if "admin" not in scopes:
                        scopes.append("admin")
                    if "manage" not in perms:
                        perms.append("manage")
                return {
                    "agent_id": agent_id,
                    "name": data.get("name"),
                    "role": data.get("role"),
                    "permissions": perms,
                    "scopes": scopes
                }
        return None

    def authorize_action(self, agent_profile, required_permission: str) -> bool:
        """Verifica se o agente possui permissão/escopo para executar a ação."""
        if not agent_profile:
            return False
        perms = agent_profile.get("permissions", [])
        scopes = agent_profile.get("scopes", perms)
        role = agent_profile.get("role", "")

        if role == "admin" or "manage" in perms or "admin" in scopes:
            return True

        return (required_permission in perms) or (required_permission in scopes)

    def authorize_scope(self, agent_profile, required_scope: str) -> bool:
        """Alias para verificação de escopos granulares."""
        return self.authorize_action(agent_profile, required_scope)

    def is_sandbox_safe(self, rel_path: str, base_dir: str = None) -> bool:
        """
        Garante blindagem contra Path Traversal e Symlink escapes.
        - Rejeita null bytes.
        - Decodifica URLs recursivamente.
        - Resolve links simbólicos via os.path.realpath.
        - Compara caminhos canônicos garantindo que target pertença a base_dir.
        """
        if not isinstance(rel_path, str):
            return False

        try:
            cleaned = sanitize_relative_path(rel_path)
        except ValueError:
            return False

        # Bloqueio explícito de padrões de subida de diretório antes de concatenar
        parts = cleaned.replace("\\", "/").split("/")
        if ".." in parts:
            return False

        root = os.path.realpath(base_dir or self.base_dir)
        try:
            # Se for caminho absoluto, valida direto contra a raiz permitida
            if os.path.isabs(cleaned):
                target = os.path.normpath(cleaned)
            else:
                target = os.path.normpath(os.path.join(root, cleaned))

            # Caminho real resolvendo links simbólicos
            real_target = os.path.realpath(target)

            # Deve estar estritamente contido em 'root'
            common = os.path.commonpath([root, real_target])
            if common != root:
                return False

            return True
        except Exception:
            return False

    def log_audit_event(self, agent_id: str, action: str, details: dict, status: str):
        """
        Registra cada evento de auditoria no ledger de segurança JSONL.
        Executa rotação atômica se o arquivo exceder MAX_AUDIT_LOG_BYTES (5MB).
        """
        self._rotate_log_if_needed()

        event = {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "agent_id": agent_id,
            "action": action,
            "details": details,
            "status": status
        }
        try:
            with open(AUDIT_LOG_PATH, "a", encoding="utf-8") as f:
                f.write(json.dumps(event, ensure_ascii=False) + "\n")
        except Exception as e:
            print(f"[AUTH LOG ERROR] {e}")

    def _rotate_log_if_needed(self):
        """Rotaciona o arquivo de auditoria se exceder o limite estabelecido."""
        try:
            if os.path.exists(AUDIT_LOG_PATH):
                size = os.path.getsize(AUDIT_LOG_PATH)
                if size >= MAX_AUDIT_LOG_BYTES:
                    rotated_path = f"{AUDIT_LOG_PATH}.1"
                    if os.path.exists(rotated_path):
                        os.remove(rotated_path)
                    os.rename(AUDIT_LOG_PATH, rotated_path)
        except Exception as e:
            print(f"[ROTATION LOG ERROR] {e}")
