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
    title: 'Seu Infoproduto 1 (Demo)',
    price: 120.0,
    tier: 'pro',
    description: 'Acesso demonstrativo ao catálogo de infoprodutos e recursos digitais.',
  },
  'ai-portraits-pro': {
    slug: 'ai-portraits-pro',
    title: 'Seu Infoproduto 2 (Demo)',
    price: 120.0,
    tier: 'pro',
    description: 'Acervo demonstrativo de materiais e recursos de aprendizagem.',
  },
  'ai-effects-pro': {
    slug: 'ai-effects-pro',
    title: 'Seu Infoproduto 3 (Demo)',
    price: 120.0,
    tier: 'pro',
    description: 'Efeitos cinemáticos, componentes e templates demonstrativos.',
  },
  'membership-vip': {
    slug: 'membership-vip',
    title: 'Passe VIP Infoprodutos (Demo)',
    price: 297.0,
    tier: 'vip',
    description: 'Acesso total aos infoprodutos, catálogo e suporte demonstrativo.',
  },
  'membership-anual': {
    slug: 'membership-anual',
    title: 'Passe Anual Infoprodutos (Demo)',
    price: 497.0,
    tier: 'vip',
    description: 'Plano anual demonstrativo com atualizações contínuas de infoprodutos.',
  },
};
