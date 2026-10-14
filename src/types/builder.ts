export type QuestionType =
  | 'text'
  | 'textarea'
  | 'email'
  | 'phone'
  | 'choice'
  | 'scale'
  | 'nps'
  | 'number';

export interface Question {
  id: string;
  pageId: string;
  type: QuestionType;
  label: string;
  placeholder?: string;
  options?: string[]; // for 'choice'
  required: boolean;
  minScale?: number; // for 'scale', default 1
  maxScale?: number; // for 'scale', default 10
  scaleLabels?: { min?: string; max?: string };
}

export interface FormPage {
  id: string;
  title: string;
  subtitle: string;
  shaderStep?: number; // 1: DarkVeil, 2: Strands, 3: CyberGrid, 4: LiquidLight, 5: Beams, 6: ColorBends, 7: Galaxy
  bannerUrl?: string;
}

export interface FormSchema {
  id: string;
  slug?: string;
  headerName: string;
  formTitle: string;
  description?: string;
  accentColor: string;
  bannerUrl: string;
  shaderStep: number;
  notionToken?: string;
  notionPageUrl?: string;
  resendApiKey?: string;
  notifyEmail?: string;
  pages: FormPage[];
  questions: Question[];
  updatedAt?: string;
}

export interface FormSubmissionPayload {
  formId: string;
  formTitle: string;
  responses: Array<{
    id: string;
    label: string;
    type?: string;
    answer: any;
  }>;
  notionToken?: string;
  notionPageUrl?: string;
  resendApiKey?: string;
  notifyEmail?: string;
}

export const BRAND_COLORS = [
  { id: 'red', hex: '#FF0033', name: 'Neon Blood Red' },
  { id: 'blue', hex: '#0066FF', name: 'Electric Sapphire' },
  { id: 'green', hex: '#00FF66', name: 'Neon Emerald' },
  { id: 'purple', hex: '#A855F7', name: 'Deep Violet' },
  { id: 'orange', hex: '#FF6B00', name: 'Cyber Amber' },
  { id: 'pink', hex: '#EC4899', name: 'Hot Magenta' },
  { id: 'cyan', hex: '#06B6D4', name: 'Cyan Ether' },
  { id: 'gold', hex: '#EAB308', name: 'Luxury Gold' },
  { id: 'teal', hex: '#14B8A6', name: 'Mint Glow' },
  { id: 'indigo', hex: '#6366F1', name: 'Ultra Indigo' },
  { id: 'crimson', hex: '#E11D48', name: 'Sanguine Crimson' },
  { id: 'silver', hex: '#94A3B8', name: 'Titanium Glass' },
];

export const DEFAULT_MASTER_PAGES: FormPage[] = [
  {
    id: 'page_1',
    title: '1. Dados da Empresa',
    subtitle: 'Informações cadastrais e institucionais da sua organização',
    shaderStep: 5,
    bannerUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 'page_2',
    title: '2. Dados do Sócio Responsável',
    subtitle: 'Dados do responsável direto pelo projeto executivo',
    shaderStep: 6,
    bannerUrl: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 'page_3',
    title: '3. Perfil & Diagnóstico do Negócio',
    subtitle: 'Diagnóstico operacional de metas, faturamento e gargalos',
    shaderStep: 7,
    bannerUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 'page_4',
    title: '4. Inteligência Artificial & Meta Soberana',
    subtitle: 'Maturidade tecnológica, investimento e escala operacional',
    shaderStep: 5,
    bannerUrl: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=1200&auto=format&fit=crop',
  },
];

export const DEFAULT_MASTER_QUESTIONS: Question[] = [
  // Page 1
  { id: 'q1', pageId: 'page_1', type: 'text', label: 'Razão Social da Empresa', placeholder: 'Ex: Celestino Automações Ltda', required: true },
  { id: 'q2', pageId: 'page_1', type: 'text', label: 'CNPJ', placeholder: '00.000.000/0001-00', required: true },
  { id: 'q3', pageId: 'page_1', type: 'email', label: 'E-mail Corporativo', placeholder: 'contato@suaempresa.com.br', required: true },
  { id: 'q4', pageId: 'page_1', type: 'phone', label: 'Telefone / WhatsApp Comercial', placeholder: '(00) 90000-0000', required: true },
  { id: 'q5', pageId: 'page_1', type: 'text', label: 'Instagram da Empresa', placeholder: '@suaempresa', required: false },
  { id: 'q6', pageId: 'page_1', type: 'text', label: 'Cidade e Estado', placeholder: 'Ex: São Paulo - SP', required: true },

  // Page 2
  { id: 'q7', pageId: 'page_2', type: 'text', label: 'Nome Completo do Sócio Responsável', placeholder: 'Ex: Mateus Celestino', required: true },
  { id: 'q8', pageId: 'page_2', type: 'email', label: 'E-mail Direto do Sócio', placeholder: 'socio@empresa.com.br', required: true },
  { id: 'q9', pageId: 'page_2', type: 'phone', label: 'Telefone Direto (WhatsApp)', placeholder: '(00) 99999-9999', required: true },
  { id: 'q10', pageId: 'page_2', type: 'choice', label: 'Qual a sua faixa etária?', options: ['Menos de 25 anos', '25 a 34 anos', '35 a 44 anos', '45 a 54 anos', '55+ anos'], required: true },

  // Page 3
  { id: 'q11', pageId: 'page_3', type: 'choice', label: 'Qual a média do faturamento mensal da empresa?', options: ['Até R$ 20.000/mês', 'R$ 20k a R$ 50k/mês', 'R$ 50k a R$ 100k/mês', 'R$ 100k a R$ 300k/mês', 'Acima de R$ 300k/mês'], required: true },
  { id: 'q12', pageId: 'page_3', type: 'text', label: 'Qual a meta de faturamento daqui 12 meses?', placeholder: 'Ex: R$ 250.000 / mês', required: true },
  { id: 'q13', pageId: 'page_3', type: 'textarea', label: 'Qual o maior gargalo para alcançar essa meta?', placeholder: 'Descreva os desafios operacionais, de vendas ou de processos...', required: true },
  { id: 'q14', pageId: 'page_3', type: 'scale', label: 'Qual o seu nível de urgência para resolver esses gargalos?', minScale: 1, maxScale: 10, scaleLabels: { min: 'Baixa prioridade', max: 'Crítico / Imediato' }, required: true },

  // Page 4
  { id: 'q15', pageId: 'page_4', type: 'choice', label: 'Qual o nível de maturidade em IA da sua equipe?', options: ['1 - Nível Iniciante (Quase nada)', '2 - Básico (ChatGPT esporádico)', '3 - Intermediário (Workflows e Prompts)', '4 - Avançado (Agentes Autônomos & APIs)'], required: true },
  { id: 'q16', pageId: 'page_4', type: 'textarea', label: 'Qual o resultado concreto que você mais deseja atingir com automação?', placeholder: 'Redução de horas manuais, prospecção automática, escala...', required: true },
  { id: 'q17', pageId: 'page_4', type: 'choice', label: 'Qual o orçamento mensal planejado para tecnologia e IA?', options: ['Até R$ 5.000', 'R$ 5.000 a R$ 15.000', 'R$ 15.000 a R$ 30.000', 'Acima de R$ 30.000'], required: true },
  { id: 'q18', pageId: 'page_4', type: 'nps', label: 'Qual a probabilidade de recomendar a metodologia Soberana para um parceiro de negócios?', minScale: 0, maxScale: 10, required: true },
];

export const INITIAL_FORM_TEMPLATE: FormSchema = {
  id: 'master_form',
  slug: 'diagnostico-executivo',
  headerName: 'MATEUS CELESTINO PRO',
  formTitle: 'Diagnóstico de Novos Clientes & IA Soberana',
  description: 'Formulário cinemático para onboarding e diagnóstico executivo de alto impacto.',
  accentColor: '#FF0033',
  bannerUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop',
  shaderStep: 5,
  notionToken: '',
  notionPageUrl: '',
  resendApiKey: '',
  notifyEmail: 'mateus@mateuscelestinopro.com',
  pages: DEFAULT_MASTER_PAGES,
  questions: DEFAULT_MASTER_QUESTIONS,
  updatedAt: new Date().toISOString(),
};
