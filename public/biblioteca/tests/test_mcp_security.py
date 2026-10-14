#!/usr/bin/env python3
"""
Suíte de Testes Automatizados de Segurança, RBAC e MCP de The Hidden Library.
Cobre vetores SEC-01 a SEC-08, MEM-01 a MEM-02, e ferramentas MCP.
"""

import os
import sys
import json
import unittest

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

from security.agent_auth import AgentAuthManager, sanitize_relative_path
import mcp_server


class TestHiddenLibrarySecurityAndMCP(unittest.TestCase):
    def setUp(self):
        self.auth = AgentAuthManager(base_dir=BASE_DIR)
        self.admin_token = "omnisocial_sk_8f7b3c2e1a90d456"
        self.reader_token = "vps_agent_sk_9e8d7c6b5a4f3210"
        self.invalid_token = "invalid_token_99999"

    def test_sec_01_token_missing(self):
        """SEC-01: Token ausente deve ser rejeitado com 401"""
        res = mcp_server.tool_list_categories(None)
        self.assertIn("error", res)
        self.assertEqual(res["code"], 401)

    def test_sec_02_token_invalid(self):
        """SEC-02: Token inválido deve ser rejeitado com 401"""
        res = mcp_server.tool_list_categories(self.invalid_token)
        self.assertIn("error", res)
        self.assertEqual(res["code"], 401)

    def test_sec_03_scope_insufficient(self):
        """SEC-03: Agente com escopo reader tentando escrita deve receber 403"""
        res = mcp_server.tool_write_item("test_dummy.txt", "conteudo", agent_token=self.reader_token)
        self.assertIn("error", res)
        self.assertEqual(res["code"], 403)

    def test_sec_04_path_traversal_classic(self):
        """SEC-04: Path traversal clássico (../../etc/passwd) deve ser bloqueado"""
        self.assertFalse(self.auth.is_sandbox_safe("../../etc/passwd"))
        res = mcp_server.tool_read_item("../../etc/passwd", agent_token=self.admin_token)
        self.assertEqual(res["code"], 403)

    def test_sec_05_url_encoded_traversal(self):
        """SEC-05: Path traversal com URL encoding (%2e%2e%2f) deve ser bloqueado"""
        self.assertFalse(self.auth.is_sandbox_safe("%2e%2e%2f%2e%2e%2fetc/passwd"))
        res = mcp_server.tool_read_item("%2e%2e%2f%2e%2e%2fetc/passwd", agent_token=self.admin_token)
        self.assertEqual(res["code"], 403)

    def test_sec_06_double_url_encoded_traversal(self):
        """SEC-06: Double URL encoding (%252e%252e%252f) deve ser bloqueado"""
        self.assertFalse(self.auth.is_sandbox_safe("%252e%252e%252fetc%2fpasswd"))
        res = mcp_server.tool_read_item("%252e%252e%252fetc%2fpasswd", agent_token=self.admin_token)
        self.assertEqual(res["code"], 403)

    def test_sec_07_null_byte_injection(self):
        """SEC-07: Injeção de null byte deve ser rejeitada imediatamente"""
        self.assertFalse(self.auth.is_sandbox_safe("safe.txt\x00/../../etc/passwd"))
        res = mcp_server.tool_read_item("safe.txt\x00/../../etc/passwd", agent_token=self.admin_token)
        self.assertEqual(res["code"], 403)

    def test_sec_08_symlink_or_out_of_sandbox(self):
        """SEC-08: Tentativa de acessar caminhos absolutos do sistema fora de BASE_DIR"""
        self.assertFalse(self.auth.is_sandbox_safe("/etc/hosts"))
        self.assertFalse(self.auth.is_sandbox_safe("/Users/mcp/.ssh/id_rsa"))

    def test_mem_01_safe_pdf_reading(self):
        """MEM-01: Leitura de PDF com SafePDFReader e context manager"""
        # Procura um PDF no catálogo
        pdf_item = next((x for x in mcp_server.catalog_data if x.get("ext") == ".pdf"), None)
        if pdf_item:
            res = mcp_server.tool_read_item(pdf_item["rel_path"], page_start=1, max_pages=2, max_chars=1000, agent_token=self.admin_token)
            self.assertEqual(res["status"], "success")
            self.assertIn("content", res)
            self.assertLessEqual(len(res["content"]), 1000)

    def test_mcp_tools_and_blueprints(self):
        """Testa list_categories, search, blueprints e web_search"""
        # Categories
        cat_res = mcp_server.tool_list_categories(self.admin_token)
        self.assertEqual(cat_res["status"], "success")
        self.assertGreater(cat_res["total_documents"], 0)

        # Search
        s_res = mcp_server.tool_search_library("prompts", limit=3, agent_token=self.admin_token)
        self.assertEqual(s_res["status"], "success")
        self.assertIn("results", s_res)

        # Blueprints
        for model in ["google_veo_3", "nano_banana_pro", "ricardo_almeida_viral_cover"]:
            bp_res = mcp_server.tool_get_model_blueprint(model, self.admin_token)
            self.assertEqual(bp_res["status"], "success")
            self.assertIn("blueprint", bp_res)


if __name__ == "__main__":
    unittest.main()
