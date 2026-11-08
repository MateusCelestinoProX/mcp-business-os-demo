import type { Metadata } from 'next';
import { constructMetadata } from '@/services/seo/metadata';
import { StackSquadView } from '@/components/stack-squad/StackSquadView';

export const metadata: Metadata = constructMetadata({
  title: 'Stack & Squad | Tecnologias & Agentes Autônomos — Mateus Celestino Pro X',
  description:
    'Conheça a infraestrutura tecnológica soberana e o esquadrão de agentes autônomos de Inteligência Artificial que operam o ecossistema digital de Mateus Celestino Pro X.',
  path: '/stack-squad',
  keywords: [
    'Stack Tecnológica',
    'Squad de Agentes IA',
    'Agentes Autônomos',
    'n8n Enterprise',
    'Typebot Pro',
    'PostgreSQL Drizzle',
    'Docker Linux',
    'Hiperautomação',
    'Mateus Celestino',
  ],
});

export default function StackSquadPage() {
  return <StackSquadView />;
}
