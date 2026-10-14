export interface Question {
  id: string;
  pageId: string;
  type: 'text' | 'number' | 'choice';
  label: string;
  placeholder?: string;
  options?: string[];
  required: boolean;
}

export interface FormPage {
  id: string;
  title: string;
  subtitle: string;
  shaderStep: number;
  bannerUrl?: string;
}

export interface SavedForm {
  id: string;
  headerName: string;
  formTitle: string;
  accentColor: string;
  bannerUrl: string;
  notionToken: string;
  notionPageUrl: string;
  resendApiKey: string;
  notifyEmail: string;
  pages: FormPage[];
  questions: Question[];
  updatedAt: string;
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

export const MASTER_PAGES: FormPage[] = [
  { id: 'page_1', title: '1. Dados da Empresa', subtitle: 'Informações cadastrais e institucionais da sua organização', shaderStep: 5 },
  { id: 'page_2', title: '2. Dados do Sócio Responsável', subtitle: 'Dados do responsável que fechou o contrato conosco', shaderStep: 6 },
  { id: 'page_3', title: '3. Perfil & Diagnóstico do Negócio', subtitle: 'Queremos te conhecer em detalhes para alinhar a estratégia', shaderStep: 7 },
  { id: 'page_4', title: '4. Inteligência Artificial & Meta', subtitle: 'Entendendo a maturidade tecnológica e visão de futuro', shaderStep: 4 },
];

export const MASTER_QUESTIONS: Question[] = [
  // Page 1
  { id: 'm1', pageId: 'page_1', type: 'text', label: 'Razão Social da Empresa', placeholder: 'Ex: Celestino Automações Ltda', required: true },
  { id: 'm2', pageId: 'page_1', type: 'text', label: 'CNPJ', placeholder: '00.000.000/0001-00', required: true },
  { id: 'm3', pageId: 'page_1', type: 'text', label: 'E-mail Corporativo', placeholder: 'contato@suaempresa.com.br', required: true },
  { id: 'm4', pageId: 'page_1', type: 'text', label: 'Telefone / WhatsApp Comercial', placeholder: '(00) 90000-0000', required: true },
  { id: 'm5', pageId: 'page_1', type: 'text', label: 'Instagram da Empresa', placeholder: '@suaempresa', required: false },
  { id: 'm6', pageId: 'page_1', type: 'text', label: 'Estado e Cidade', placeholder: 'Ex: São Paulo - SP', required: true },
  { id: 'm7', pageId: 'page_1', type: 'text', label: 'Bairro', placeholder: 'Ex: Itaim Bibi', required: true },
  { id: 'm8', pageId: 'page_1', type: 'text', label: 'Rua - Número - Complemento', placeholder: 'Av. Paulista, 1000 - Cj 42', required: true },

  // Page 2
  { id: 'm9', pageId: 'page_2', type: 'text', label: 'Nome Completo do Sócio Responsável', placeholder: 'Ex: Mateus Celestino', required: true },
  { id: 'm10', pageId: 'page_2', type: 'text', label: 'Naturalidade', placeholder: 'Ex: Brasileiro / SP', required: true },
  { id: 'm11', pageId: 'page_2', type: 'text', label: 'Data de Nascimento', placeholder: 'DD/MM/AAAA', required: true },
  { id: 'm12', pageId: 'page_2', type: 'text', label: 'CEP Residencial', placeholder: '00000-000', required: true },
  { id: 'm13', pageId: 'page_2', type: 'text', label: 'Estado e Cidade do Sócio', placeholder: 'Ex: Rio de Janeiro - RJ', required: true },
  { id: 'm14', pageId: 'page_2', type: 'text', label: 'Bairro do Sócio', placeholder: 'Ex: Leblon', required: true },
  { id: 'm15', pageId: 'page_2', type: 'text', label: 'Telefone de Contato Direto (DDD)', placeholder: '(00) 90000-0000', required: true },

  // Page 3
  { id: 'm16', pageId: 'page_3', type: 'choice', label: 'Quantos anos você tem?', options: ['Menos de 25 anos', '25 a 34 anos', '35 a 44 anos', '45 a 54 anos', '55+ anos'], required: true },
  { id: 'm17', pageId: 'page_3', type: 'choice', label: 'Qual a sua escolaridade?', options: ['Ensino Médio', 'Ensino Superior Cursando', 'Ensino Superior Completo', 'Pós-Graduação / MBA', 'Mestrado / Doutorado'], required: true },
  { id: 'm18', pageId: 'page_3', type: 'choice', label: 'Como você ficou sabendo do nosso trabalho?', options: ['Indicação de Cliente / Amigo', 'Instagram', 'Google / YouTube', 'LinkedIn', 'Outro'], required: true },
  { id: 'm19', pageId: 'page_3', type: 'choice', label: 'Qual a média do faturamento mensal da empresa?', options: ['Até R$ 20.000/mês', 'R$ 20k a R$ 50k/mês', 'R$ 50k a R$ 100k/mês', 'R$ 100k a R$ 300k/mês', 'Acima de R$ 300k/mês'], required: true },
  { id: 'm20', pageId: 'page_3', type: 'text', label: 'Qual a sua meta de faturamento daqui 12 meses?', placeholder: 'Ex: R$ 200.000 / mês', required: true },
  { id: 'm21', pageId: 'page_3', type: 'text', label: 'Qual a sua maior dificuldade para bater essa meta?', placeholder: 'Gargalos operacionais, vendas...', required: true },
  { id: 'm22', pageId: 'page_3', type: 'text', label: 'Como você se sente hoje enfrentando esse desafio?', placeholder: 'Descreva seu sentimento...', required: true },
  { id: 'm23', pageId: 'page_3', type: 'text', label: 'Por que escolheu a Mateus Celestino Pro?', placeholder: 'Sua expectativa principal...', required: true },
  { id: 'm24', pageId: 'page_3', type: 'text', label: 'Se ficou em dúvida, por qual motivo QUASE não fez isso?', placeholder: 'Sincero...', required: true },
  { id: 'm25', pageId: 'page_3', type: 'text', label: 'Se tomasse um café comigo, qual pergunta faria?', placeholder: 'Sua pergunta...', required: true },

  // Page 4
  { id: 'm26', pageId: 'page_4', type: 'choice', label: 'O quanto você sabe sobre Inteligência Artificial?', options: ['1 - Nível Iniciante', '2 - Uso Básico (ChatGPT)', '3 - Intermediário', '4 - Avançado (Agentes)'], required: true },
  { id: 'm27', pageId: 'page_4', type: 'text', label: 'Já tentou implementar IA na sua empresa antes?', placeholder: 'Descreva...', required: true },
  { id: 'm28', pageId: 'page_4', type: 'text', label: 'O que mais espera conseguir implementando IA?', placeholder: 'Economia de tempo...', required: true },
  { id: 'm29', pageId: 'page_4', type: 'text', label: 'Descreva o seu negócio da forma mais detalhada possível.', placeholder: 'Modelo de vendas, produto...', required: true },
  { id: 'm30', pageId: 'page_4', type: 'choice', label: 'Qual seu orçamento disponível para IA e tecnologia?', options: ['Até R$ 5.000', 'R$ 5.000 a R$ 15.000', 'R$ 15.000 a R$ 30.000', 'Acima de R$ 30.000'], required: true },
];
