/**
 * TIPOS DE SEO & ESTRUTURAÇÃO DE DADOS SCHEMA.ORG (JSON-LD)
 * Tipagem estrita para Rich Snippets do Google, Sitemaps e Metadados.
 */

export type SchemaType =
  | 'Organization'
  | 'Person'
  | 'WebSite'
  | 'WebPage'
  | 'Article'
  | 'TechArticle'
  | 'BlogPosting'
  | 'Product'
  | 'Offer'
  | 'BreadcrumbList'
  | 'FAQPage'
  | 'ItemList'
  | 'SoftwareApplication'
  | 'ContactPage'
  | 'CollectionPage';

export interface BaseJsonLd {
  '@context'?: string;
  '@type'?: string;
  '@id'?: string;
  '@graph'?: any[];
  [key: string]: any;
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface RouteSeoOptions {
  title?: string;
  description?: string;
  path?: string;
  canonical?: string;
  ogType?: 'website' | 'article' | 'profile';
  ogImage?: string;
  ogImageAlt?: string;
  keywords?: string[];
  noIndex?: boolean;
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  section?: string;
}

export interface SitemapEntry {
  url: string;
  lastModified?: string | Date;
  changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}
