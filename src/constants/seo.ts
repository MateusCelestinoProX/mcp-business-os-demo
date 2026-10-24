/**
 * CONSTANTES DE SEO & IDENTIDADE DIGITAL SOBERANA
 * Fonte única da verdade para metadados, canonicals, Schema.org e Open Graph.
 * Mateus Celestino Pro X — MCP Business OS
 */

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || 
  process.env.NEXT_PUBLIC_APP_URL ||
  process.env.SITE_URL || 
  'https://mcp-business-os.vercel.app'
).replace(/\/$/, '');

export const SITE_NAME = 'Mateus Celestino Pro X';
export const SITE_TAGLINE = 'Plataforma Unificada de Hiperautomação, Agentes de IA & Engenharia Soberana';

export const SITE_TITLE_DEFAULT = 'Mateus Celestino Pro X — Hiperautomação, Agentes Autônomos de IA & Business OS';
export const SITE_TITLE_TEMPLATE = '%s | Mateus Celestino Pro X';

export const SITE_DESCRIPTION = 
  'Plataforma oficial de hiperautomação, agentes autônomos de IA com n8n e Typebot, engenharia de software de alta performance, shaders WebGL e cofre aberto com mais de 400 recursos e 170+ artigos especializados.';

export const SITE_LOCALE = 'pt_BR';
export const SITE_LANG = 'pt-BR';

export const AUTHOR_NAME = 'Mateus Celestino';
export const AUTHOR_TITLE = 'Especialista em Automação Digital & Arquiteto de Agentes IA';
export const AUTHOR_EMAIL = 'mcp6667@proton.me';
export const AUTHOR_PHONE = '+55 31 9772-4257';
export const AUTHOR_GITHUB = 'https://github.com/MateusCelestinoProX';
export const AUTHOR_LINKEDIN = 'https://www.linkedin.com/in/mateus-celestino-0ba50626a/';
export const AUTHOR_INSTAGRAM = 'https://www.instagram.com/celestinoautomacao/';
export const AUTHOR_WHATSAPP = 'https://api.whatsapp.com/send/?phone=553197724257&text=QUERO+AUTOMATIZAR+TUDO.&type=phone_number&app_absent=0';

export const DEFAULT_OG_IMAGE = `${SITE_URL}/assets/hero_cover.webp`;
export const DEFAULT_OG_IMAGE_ALT = 'Mateus Celestino Pro X — Plataforma Unificada';
export const OG_IMAGE_WIDTH = 1200;
export const OG_IMAGE_HEIGHT = 630;

export const TWITTER_HANDLE = '@celestinoautomacao';
export const TWITTER_CARD = 'summary_large_image';

export const GOOGLE_SITE_VERIFICATION = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || 'google-site-verification-mateus-celestino-pro';

export const SEO_KEYWORDS = [
  'Mateus Celestino Pro X',
  'Mateus Celestino',
  'Hiperautomação',
  'Agentes Autônomos IA',
  'Automação de Processos',
  'Workflows n8n',
  'Templates Typebot',
  'Mautic Automação',
  'Baserow CRM',
  'Shaders WebGL',
  'Next.js 15 App Router',
  'Drizzle ORM Postgres',
  'Inteligência Artificial para Negócios',
  'Software Livre GPL',
  'Transformação Digital',
  'Marketing Open Source',
  'Arquitetura de Software',
  'Sistemas Soberanos'
];

export const GEO_REGION = 'BR-MG';
export const GEO_PLACENAME = 'Belo Horizonte';
export const GEO_POSITION = '-19.9167;-43.9345';
export const ICBM = '-19.9167, -43.9345';
