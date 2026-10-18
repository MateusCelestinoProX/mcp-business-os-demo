import { NextRequest, NextResponse } from 'next/server';
import { db, systemSettings } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { verifyAdminRequest, unauthorizedResponse } from '@/lib/auth/admin-guard';

export const dynamic = 'force-dynamic';

const SETTINGS_KEY = 'shop_and_resources_config';

const DEFAULT_CONFIG = {
  shop: {
    hero: {
      welcome: 'SEJA BEM VINDO A LOJA VIRTUAL DE MATEUS CELESTINO PRO',
      tagline: 'AQUI VOCÊ ENCONTRA UMA LOJA VIRTUAL COM MEUS PRODUTOS E MEUS SERVIÇOS DISPONÍVEIS PARA A COMPRA.',
      artImages: [
        '/assets/notion/shop/hero_art.png',
        '/assets/hero_cover.webp',
      ],
      features: [
        {
          icon: '🚀',
          title: 'Produtos de Alta Performance',
          desc: 'Cada item disponível aqui foi criado com foco total em resultado, praticidade e performance.',
        },
        {
          icon: '🤖',
          title: 'Serviços Inteligentes, Prontos para Executar',
          desc: 'Automatizações, fluxos prontos, ferramentas e soluções estratégicas testadas.',
        },
        {
          icon: '🎯',
          title: 'Para Profissionais Exigentes',
          desc: 'Se você busca excelência, agilidade e inovação, você está no lugar certo.',
        },
      ],
      idealFor: [
        'Gestores de automação',
        'Infoprodutores',
        'Freelancers e agências',
        'Criadores de conteúdo',
        'Donos de negócio digital',
      ],
    },
    produtos: [
      {
        id: 'prod-typebot',
        title: 'ULTIMATE TYPEBOT PACK',
        tag: 'MAIS DE 800 FLOWS',
        badge: 'PRODUTO DIGITAL',
        price: 'Entrega Imediata',
        cover: '/assets/notion/shop/products/typebot/ChatGPT_Image_9_de_jun._de_2025_13_14_33.png',
        headline: 'PARE DE PERDER HORAS DESENHANDO FLUXOS DO ZERO',
        description: 'O acervo definitivo com mais de 800 fluxos prontos de Typebot para substituir landing pages tradicionais.',
        pageLink: '/biblioteca',
        highlights: [
          'Mais de 800 flows prontos, validados e categorizados',
          'Substitui landing page tradicional e suporte manual ao cliente',
          'Lógica condicional avançada, variáveis dinâmicas e chamadas HTTP',
          'Pronto para plugar em WhatsApp, websites e funis de venda',
        ],
        cta: 'OBTER TYPEBOT PACK',
        whatsappMessage: 'Oi Mateus, tenho interesse no ULTIMATE TYPEBOT PACK com mais de 800 flows!',
      },
      {
        id: 'prod-n8n',
        title: 'ULTIMATE N8N PACK',
        tag: 'WORKFLOWS MESTRES',
        badge: 'NODEMATION MESTRE',
        price: 'Entrega Imediata',
        cover: '/assets/notion/shop/products/n8n/Robo_Central_em_Sala_Futurista.png',
        headline: 'PULANDO DIRETO PARA A PARTE QUE IMPORTA: USAR, APLICAR E FATURAR',
        description: 'Acervo valioso de workflows do n8n prontos, testados e otimizados ao longo de meses de operação real.',
        pageLink: '/biblioteca',
        highlights: [
          'Acervo completo de workflows prontos e testados para produção',
          'Nutrição e qualificação de leads sem esforço manual',
          'Integração pronta com Baserow, Supabase, CRM e bancos SQL',
        ],
        cta: 'OBTER N8N PACK',
        whatsappMessage: 'Oi Mateus, tenho interesse no ULTIMATE N8N PACK!',
      },
      {
        id: 'prod-make',
        title: 'ULTIMATE MAKE PACK',
        tag: 'MAKE / INTEGROMAT',
        badge: 'FLUXOS TESTADOS',
        price: 'Entrega Imediata',
        cover: '/assets/notion/shop/products/make/ChatGPT_Image_9_de_jun._de_2025_20_18_41.png',
        headline: 'BLUEPRINTS COMPLETOS E CONEXÕES ROBUSTAS NO MAKE.COM',
        description: 'Coleção de cenários testados no Make/Integromat para quem precisa de integrações rápidas e eficientes.',
        pageLink: '/artigos',
        highlights: [
          'Blueprints prontos para importação em 1 clique',
          'Estruturação otimizada para baixo consumo de operações',
          'Integração com gateways de pagamento, Google Sheets e WhatsApp',
        ],
        cta: 'OBTER MAKE PACK',
        whatsappMessage: 'Oi Mateus, tenho interesse no ULTIMATE MAKE PACK!',
      },
      {
        id: 'prod-curso-iapro',
        title: 'I.A PRO (CURSO)',
        tag: 'FORMAÇÃO COMPLETA',
        badge: 'CERTIFICADO OFICIAL',
        price: 'Vagas Limitadas',
        cover: '/assets/notion/shop/products/curso_iapro/I.A_PRO.png',
        headline: 'UM CURSO COMPLETO COM MATERIAIS EXCLUSIVOS PARA VOCÊ DOMINAR AUTOMAÇÃO',
        description: 'Aprenda os fundamentos de n8n, APIs e crie sua própria A.I Automation Agency (AAA).',
        pageLink: '/comunidade',
        highlights: [
          'Aprenda n8n do zero aos nós mais avançados sem precisar saber programar',
          'BÔNUS EXCLUSIVO: Acesso completo ao Ultimate n8n Pack incluso no curso',
          'Módulo completo sobre Como Criar sua A.I Automation Agency e Vender',
        ],
        cta: 'GARANTIR VAGA NO I.A PRO',
        whatsappMessage: 'Oi Mateus, quero garantir minha vaga na formação I.A PRO!',
      },
    ],
    servicos: [
      {
        id: 'serv-ai-agents',
        title: 'A.I AGENTS',
        tag: 'ATENDIMENTO & VENDAS 24/7',
        badge: 'SOLUÇÃO SOB MEDIDA',
        cover: '/assets/notion/shop/services/ai_agents/Robo_Elegante_em_Neon_Vermelho.png',
        headline: 'UM TIME VIRTUAL DE AGENTES VENDENDO PARA VOCÊ 24 HORAS POR DIA',
        description: 'Implementação de robôs digitais dotados de conhecimento profundo do seu negócio.',
        pageLink: '/#contato',
        highlights: [
          'Time de Atendimento e Suporte 24/7 sem fila de espera',
          'Agente SDR inteligente de prospecção e qualificação de clientes',
          'Agente Agendador integrado diretamente à sua agenda Google/Cal',
        ],
        cta: 'CONTRATAR A.I AGENTS',
        whatsappMessage: 'Oi Mateus, quero contratar a implementação de A.I AGENTS para a minha empresa!',
      },
      {
        id: 'serv-link-tree',
        title: 'PÁGINA DE LINKS (SUPERIOR)',
        tag: 'WEB DESIGN & AUTORIDADE',
        badge: 'PAGAMENTO ÚNICO',
        cover: '/assets/notion/shop/services/link_tree/Acordo_Futurista_na_Cidade_Neon.png',
        headline: 'UMA PÁGINA SUPERIOR, COM DESIGN SUPERIOR, PARA UM NEGÓCIO SUPERIOR',
        description: 'Árvore de links ultra-profissional com design cinematográfico e sofisticado.',
        pageLink: '/#contato',
        highlights: [
          'Design elegante, limpo e customizado para sua identidade visual',
          '100% responsiva com tempo de carregamento ultrarrápido',
          'Sem mensalidades, sem taxas recorrentes: pague apenas uma vez',
        ],
        cta: 'SOLICITAR PÁGINA SUPERIOR',
        whatsappMessage: 'Oi Mateus, quero criar minha PÁGINA DE LINKS SUPERIOR sem mensalidades!',
      },
    ],
  },
  recursos: {
    hero: {
      title: 'SEJA BEM VINDO A SESSÃO DE RECURSOS DE MATEUS CELESTINO PRO',
      description: 'AQUI VOCÊ ENCONTRARÁ TODOS OS PRODUTOS E RECURSOS QUE EU TENHO DISPONÍVEIS. Materiais coletados, desenvolvidos e validados na prática para você estudar, vender e implementar sem restrições.',
      artImages: [
        '/assets/recursos_cover.webp',
        '/assets/hero_cover.webp',
      ],
    },
    packs: [
      {
        id: 'rec-automation-pack',
        title: 'AUTOMATION PACK',
        subtitle: 'Kits e Templates Prontos para Automação Open Source (Typebot & n8n)',
        badge: '100% GRATUITO · OPEN SOURCE',
        cover: '/assets/notion/recursos/packs/automation_pack/Robo_com_Energia_Vermelha_Radiante.png',
        manifesto: 'UM PODEROSO KIT DE TEMPLATES PRONTOS PARA AUTOMAÇÃO EM FERRAMENTAS OPEN SOURCE, TOTALMENTE DE GRAÇA…',
        description: 'Um compilado de altíssima qualidade reunindo fluxos validados de n8n e Typebot.',
        pageLink: '/biblioteca',
        highlights: [
          'Templates prontos de Typebot com lógica condicional avançada',
          'Workflows mestres para n8n (Nodemation) com tratamento de erro',
          'Agentes de IA: Agendador, SDR e Acompanhamento de Leads',
        ],
        ctaText: 'OBTER AUTOMATION PACK FREE',
        whatsappMessage: 'Oi Mateus, vim pelo site e quero receber o AUTOMATION PACK gratuito!',
      },
      {
        id: 'rec-wordpress-pack',
        title: 'THE ULTIMATE WORDPRESS PACK',
        subtitle: 'Coleção Completa de Plugins PRO / Premium para WordPress sob Licença GPL',
        badge: '100% LEGAL · LICENÇA GPL',
        cover: '/assets/notion/recursos/packs/wordpress_pack/Icone_WordPress_em_Chamas_e_Circuitos.png',
        manifesto: 'EU OFEREÇO A VOCÊ UMA COLEÇÃO COMPLETA DE PLUGINS PRO/PREMIUM PARA WORDPRESS, 100% GRATUITO.',
        description: 'Tenha acesso às versões PRO do Elementor Pro + Elementor Add-ons + JetEngine (All) para construir websites de alta conversão.',
        pageLink: '/biblioteca',
        highlights: [
          'Elementor PRO: o melhor e mais usado page builder sem gambiarra',
          'Elementor PRO Add-ons: dezenas de widgets e efeitos premium',
          'JetEngine (All): custom post types, campos personalizados e listagens dinâmicas',
        ],
        ctaText: 'BAIXAR THE ULTIMATE WP PACK',
        whatsappMessage: 'Oi Mateus, vim pelo site e quero o THE ULTIMATE WORDPRESS PACK gratuito sob licença GPL!',
      },
    ],
  },
};

/**
 * Normaliza qualquer configuração recebida (legada do Notion ou moderna do Admin)
 * garantindo compatibilidade total com Portal, Loja, Recursos e Painel Administrativo.
 */
function normalizeShopResourcesConfig(raw: any) {
  if (!raw || typeof raw !== 'object') {
    return {
      shopHero: DEFAULT_CONFIG.shop.hero,
      shopProducts: DEFAULT_CONFIG.shop.produtos,
      shopServices: DEFAULT_CONFIG.shop.servicos,
      recursosHero: DEFAULT_CONFIG.recursos.hero,
      recursosItems: DEFAULT_CONFIG.recursos.packs,
      shop: DEFAULT_CONFIG.shop,
      recursos: DEFAULT_CONFIG.recursos,
    };
  }

  const shopHero = raw.shopHero || raw.shop?.hero || DEFAULT_CONFIG.shop.hero;
  const shopProducts = Array.isArray(raw.shopProducts)
    ? raw.shopProducts
    : Array.isArray(raw.shop?.produtos)
    ? raw.shop.produtos
    : DEFAULT_CONFIG.shop.produtos;
  const shopServices = Array.isArray(raw.shopServices)
    ? raw.shopServices
    : Array.isArray(raw.shop?.servicos)
    ? raw.shop.servicos
    : DEFAULT_CONFIG.shop.servicos;
  const recursosHero = raw.recursosHero || raw.recursos?.hero || DEFAULT_CONFIG.recursos.hero;
  const recursosItems = Array.isArray(raw.recursosItems)
    ? raw.recursosItems
    : Array.isArray(raw.recursos?.packs)
    ? raw.recursos.packs
    : DEFAULT_CONFIG.recursos.packs;

  const resolvedArtImages = Array.isArray(shopHero.artImages) && shopHero.artImages.length > 0
    ? shopHero.artImages
    : [shopHero.artImage || '/assets/notion/shop/hero_art.png'];

  const finalHero = {
    ...DEFAULT_CONFIG.shop.hero,
    ...shopHero,
    artImages: resolvedArtImages,
    artImage: resolvedArtImages[0] || '/assets/notion/shop/hero_art.png',
  };

  return {
    shopHero: finalHero,
    shopProducts,
    shopServices,
    recursosHero,
    recursosItems,
    shop: {
      hero: finalHero,
      produtos: shopProducts,
      servicos: shopServices,
    },
    recursos: {
      hero: recursosHero,
      packs: recursosItems,
    },
  };
}

export async function GET() {
  try {
    const existing = await db
      .select()
      .from(systemSettings)
      .where(eq(systemSettings.key, SETTINGS_KEY))
      .limit(1);

    const raw = existing && existing.length > 0 && existing[0].value ? existing[0].value : DEFAULT_CONFIG;
    const normalized = normalizeShopResourcesConfig(raw);

    return NextResponse.json({
      success: true,
      source: existing && existing.length > 0 ? 'supabase' : 'default_preset',
      config: normalized,
      data: normalized,
    });
  } catch (err: any) {
    const fallback = normalizeShopResourcesConfig(DEFAULT_CONFIG);
    return NextResponse.json({
      success: true,
      source: 'fallback',
      config: fallback,
      data: fallback,
      warning: err?.message,
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await verifyAdminRequest(request);
    if (!auth.authorized) {
      return unauthorizedResponse(auth.error);
    }

    const body = await request.json();

    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { success: false, error: 'Configuração inválida fornecida.' },
        { status: 400 }
      );
    }

    const normalized = normalizeShopResourcesConfig(body);

    // Upsert no Supabase (systemSettings)
    await db
      .insert(systemSettings)
      .values({
        key: SETTINGS_KEY,
        value: normalized,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: systemSettings.key,
        set: {
          value: normalized,
          updatedAt: new Date(),
        },
      });

    // Sincronização segura de fallback local em siteData.json
    try {
      const fs = await import('fs');
      const path = await import('path');
      const siteDataPath = path.resolve(process.cwd(), 'src/data/siteData.json');
      if (fs.existsSync(siteDataPath)) {
        const rawJson = JSON.parse(fs.readFileSync(siteDataPath, 'utf8'));
        rawJson.shop = normalized.shop;
        fs.writeFileSync(siteDataPath, JSON.stringify(rawJson, null, 2), 'utf8');
      }
    } catch (fsErr) {
      console.warn('Aviso ao sincronizar siteData.json local:', fsErr);
    }

    return NextResponse.json({
      success: true,
      message: 'Configurações de Shop e Recursos salvas com sucesso no Supabase!',
      config: normalized,
      data: normalized,
    });
  } catch (error: any) {
    console.error('Erro ao salvar shop-resources:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Falha ao gravar configurações no banco de dados.' },
      { status: 500 }
    );
  }
}
