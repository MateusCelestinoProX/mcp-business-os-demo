export interface PlanConfig {
  slug: string;
  title: string;
  price: number;
  tier: 'pro' | 'vip';
  description: string;
}

export const COMMUNITY_PLANS: Record<string, PlanConfig> = {
  'ai-art': {
    slug: 'ai-art',
    title: 'A.I ART PRO',
    price: 120.0,
    tier: 'pro',
    description: 'Acesso vitalício ao acervo completo de prompts de arte surreal e cinematográfica.',
  },
  'ai-portraits-pro': {
    slug: 'ai-portraits-pro',
    title: 'A.I PORTRAIT PRO',
    price: 120.0,
    tier: 'pro',
    description: 'Acervo exclusivo de retratos fotorrealistas e técnicas de iluminação com IA.',
  },
  'ai-effects-pro': {
    slug: 'ai-effects-pro',
    title: 'A.I EFFECT PRO',
    price: 120.0,
    tier: 'pro',
    description: 'Efeitos cinemáticos, shaders e pós-produção audiovisual avançada.',
  },
  'membership-vip': {
    slug: 'membership-vip',
    title: 'MEMBERSHIP VIP SOBERANO',
    price: 297.0,
    tier: 'vip',
    description: 'Acesso total à Área de Membros, Catálogo 4K, Feed Fechado e Suporte Exclusivo.',
  },
  'membership-anual': {
    slug: 'membership-anual',
    title: 'MEMBERSHIP ANUAL COMUNIDADE',
    price: 497.0,
    tier: 'vip',
    description: 'Plano Anual Soberano com mentorias ao vivo com Mateus Celestino e atualizações contínuas.',
  },
};
