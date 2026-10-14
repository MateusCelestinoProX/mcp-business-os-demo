export type FieldType = 
  | 'text' 
  | 'email' 
  | 'phone' 
  | 'select' 
  | 'scale' 
  | 'nps' 
  | 'textarea';

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  description?: string;
  required: boolean;
  options?: string[];
  min?: number;
  max?: number;
  stepId?: string;
}

export interface FormStep {
  id: string;
  title: string;
  subtitle?: string;
  shaderStep?: number;
}

export interface FormIntegrations {
  notionToken?: string;
  notionPageUrl?: string;
  resendApiKey?: string;
  notifyEmail?: string;
}

export interface FormSchema {
  id: string;
  title: string;
  description?: string;
  slug?: string;
  headerName?: string;
  accentColor: string;
  bannerUrl?: string;
  multiStep?: boolean;
  steps: FormStep[];
  fields: FormField[];
  submitButtonText?: string;
  successMessage?: string;
  integrations?: FormIntegrations;
  createdAt?: string;
  updatedAt?: string;
}

export interface FormSubmissionData {
  formId: string;
  formTitle: string;
  responses: Record<string, any>;
  fields: { id: string; label: string; answer: any }[];
  submittedAt?: string;
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
  { id: 'silver', hex: '#94A3B8', name: 'Titanium Glass' },
];

export const FIELD_DEFINITIONS: {
  type: FieldType;
  title: string;
  description: string;
  iconName: string;
  defaultField: Partial<FormField>;
}[] = [
  {
    type: 'text',
    title: 'Texto Curto',
    description: 'Nomes, cargos, respostas em linha única',
    iconName: 'Type',
    defaultField: {
      type: 'text',
      label: 'Qual é o seu nome completo?',
      placeholder: 'Digite aqui...',
      required: true,
    },
  },
  {
    type: 'email',
    title: 'E-mail',
    description: 'Validação automática de endereço de e-mail',
    iconName: 'Mail',
    defaultField: {
      type: 'email',
      label: 'Seu melhor e-mail',
      placeholder: 'nome@empresa.com.br',
      required: true,
    },
  },
  {
    type: 'phone',
    title: 'Telefone / WhatsApp',
    description: 'Contato com formato telefônico comercial',
    iconName: 'Phone',
    defaultField: {
      type: 'phone',
      label: 'WhatsApp com DDD',
      placeholder: '(11) 99999-9999',
      required: true,
    },
  },
  {
    type: 'select',
    title: 'Múltipla Escolha',
    description: 'Seleção única ou múltipla de alternativas',
    iconName: 'ListFilter',
    defaultField: {
      type: 'select',
      label: 'Qual a sua faixa de faturamento mensal?',
      required: true,
      options: [
        'Até R$ 20.000 / mês',
        'R$ 20.000 a R$ 50.000 / mês',
        'R$ 50.000 a R$ 150.000 / mês',
        'Acima de R$ 150.000 / mês',
      ],
    },
  },
  {
    type: 'scale',
    title: 'Escala 1 a 10',
    description: 'Avaliação numérica contínua de intensidade',
    iconName: 'Sliders',
    defaultField: {
      type: 'scale',
      label: 'De 1 a 10, qual o nível de prioridade dessa solução hoje?',
      required: true,
      min: 1,
      max: 10,
    },
  },
  {
    type: 'nps',
    title: 'NPS (0 a 10)',
    description: 'Net Promoter Score com indicadores visuais de probabilidade',
    iconName: 'Award',
    defaultField: {
      type: 'nps',
      label: 'Qual a probabilidade de você nos recomendar a um parceiro?',
      required: true,
      min: 0,
      max: 10,
    },
  },
  {
    type: 'textarea',
    title: 'Texto Longo',
    description: 'Descrições de projeto, desafios ou dúvidas',
    iconName: 'AlignLeft',
    defaultField: {
      type: 'textarea',
      label: 'Descreva os principais desafios operacionais do seu negócio',
      placeholder: 'Conte em detalhes o que mais consome o tempo da sua equipe...',
      required: false,
    },
  },
];
