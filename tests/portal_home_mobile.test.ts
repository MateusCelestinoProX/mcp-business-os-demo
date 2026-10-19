import test from "node:test";
import assert from "node:assert";
import fs from "node:fs";
import path from "node:path";

const SRC = path.resolve(process.cwd(), "src");

function readFile(relativePath: string): string {
  return fs.readFileSync(path.join(SRC, relativePath), "utf-8");
}

test("1. PortalNavbar deve ser proporcional e unificado no mobile sem colidir com o Hero", () => {
  const code = readFile("components/portal/PortalNavbar.tsx");

  // Verifica que não usa backdrop-blur para manter 60 FPS
  assert.ok(!code.includes("backdrop-blur"), "PortalNavbar não deve conter classes backdrop-blur");

  // Barra mobile integrada em linha única
  assert.ok(code.includes("lg:hidden"), "Deve conter container responsivo para mobile");
  assert.ok(code.includes("min-h-[36px]"), "Touch targets mobile devem possuir altura mínima de 36px");

  // Itens setoriais obrigatórios
  assert.ok(code.includes("Início"), "Deve conter Início");
  assert.ok(code.includes("Artigos (176)"), "Deve conter Artigos (176)");
  assert.ok(code.includes("Sobre"), "Deve conter Sobre");
  assert.ok(code.includes("Contato"), "Deve conter Contato");

  // CTA WhatsApp presente
  assert.ok(code.includes("whatsappUrl"), "Deve conter link oficial do WhatsApp");
  assert.ok(code.includes("AUTOMATIZAR"), "Deve conter CTA de automação");
});

test("2. OriginalHeader deve conter avatar, título soberano e botão exclusivo de CTA VAMOS AUTOMATIZAR ?!", () => {
  const code = readFile("components/portal/OriginalHeader.tsx");

  // Título e identidade
  assert.ok(code.includes("MATEUS CELESTINO PRO X"), "Título deve ser MATEUS CELESTINO PRO X");
  assert.ok(code.includes("break-words"), "Título deve ter proteção break-words contra overflow horizontal");

  // Avatar e ícone oficial
  assert.ok(code.includes("siteIcon"), "Deve conter ícone oficial de perfil");

  // Botão de ação exclusivo e soberano
  assert.ok(code.includes("VAMOS AUTOMATIZAR ?!"), "Deve conter botão WhatsApp exclusivo");

  // Touch target mínimo de 44px
  assert.ok(code.includes("min-h-[48px]"), "Botão de ação do Hero deve possuir touch target de 48px");
});

test("3. HeroSection deve ser responsivo e conter os botões de ação e autoridade", () => {
  const code = readFile("components/portal/HeroSection.tsx");

  // Título e badges
  assert.ok(code.includes("O Futuro Pertence a Quem"), "Título monumental presente");
  assert.ok(code.includes("O PRIMEIRO SITE SOBRE AUTOMAÇÃO DO BRASIL"), "Badge de autoridade presente");

  // 3 Botões de ação
  assert.ok(code.includes("EXPLORAR OS 176 ARTIGOS"), "Botão de explorar artigos presente");
  assert.ok(code.includes("FALAR NO WHATSAPP"), "Botão WhatsApp presente");
  assert.ok(code.includes("COMUNIDADE VIP"), "Botão Comunidade VIP presente");

  // Touch targets de 44px
  assert.ok(code.includes("min-h-[44px]"), "Botões devem ter min-h-[44px]");
});

test("4. MetricsBanner deve estruturar as métricas em grid de 2 colunas no mobile", () => {
  const code = readFile("components/portal/MetricsBanner.tsx");

  // Grid responsiva de 2 colunas no mobile
  assert.ok(
    code.includes("grid-cols-2 lg:grid-cols-4"),
    "MetricsBanner deve usar grid de 2 colunas no mobile e 4 no desktop"
  );

  // Métricas soberanas
  assert.ok(code.includes("176"), "Métrica 176 presente");
  assert.ok(code.includes("4 em 1"), "Métrica 4 em 1 presente");
  assert.ok(code.includes("406+"), "Métrica 406+ presente");
  assert.ok(code.includes("60 FPS"), "Métrica 60 FPS presente");

  // Export default presente
  assert.ok(code.includes("export default MetricsBanner"), "Deve exportar MetricsBanner por padrão");
});

test("5. AlternatingHeroBanner deve suportar grid responsivo de 2 colunas de métricas", () => {
  const code = readFile("components/portal/AlternatingHeroBanner.tsx");

  // Suporte a métricas em 2 colunas no mobile
  assert.ok(
    code.includes("grid-cols-2 sm:grid-cols-4"),
    "AlternatingHeroBanner deve suportar grid de 2 colunas no mobile"
  );
  assert.ok(code.includes("BannerMetricItem"), "Interface BannerMetricItem deve estar definida");
});

test("6. HomePage (page.tsx) deve blindar contra overflow horizontal e renderizar MetricsBanner", () => {
  const code = readFile("app/page.tsx");

  // Overflow horizontal blindado
  assert.ok(code.includes("overflow-x-hidden"), "HomePage deve conter overflow-x-hidden");

  // MetricsBanner renderizado
  assert.ok(code.includes("<MetricsBanner"), "HomePage deve renderizar MetricsBanner");
  assert.ok(code.includes("<OriginalHeader"), "HomePage deve renderizar OriginalHeader");
});
