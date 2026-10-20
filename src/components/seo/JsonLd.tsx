import React from 'react';
import { sanitizeJsonLd } from '@/services/seo/structured-data';

interface JsonLdProps {
  data: unknown;
  id?: string;
}

/**
 * Componente Servidor para injeção segura de Schema.org JSON-LD
 * Zero JavaScript enviado ao cliente (renderizado em HTML estático no servidor).
 */
export function JsonLd({ data, id }: JsonLdProps) {
  if (!data) return null;

  return (
    <script
      id={id || 'schema-jsonld'}
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: sanitizeJsonLd(data),
      }}
    />
  );
}
