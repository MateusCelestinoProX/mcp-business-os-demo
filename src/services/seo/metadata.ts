import type { Metadata } from 'next';
import {
  SITE_URL,
  SITE_NAME,
  SITE_TITLE_DEFAULT,
  SITE_TITLE_TEMPLATE,
  SITE_DESCRIPTION,
  SITE_LOCALE,
  DEFAULT_OG_IMAGE,
  DEFAULT_OG_IMAGE_ALT,
  OG_IMAGE_WIDTH,
  OG_IMAGE_HEIGHT,
  TWITTER_HANDLE,
  SEO_KEYWORDS,
  AUTHOR_NAME,
  GOOGLE_SITE_VERIFICATION,
  GEO_REGION,
  GEO_PLACENAME,
  GEO_POSITION,
  ICBM,
} from '@/constants/seo';
import { RouteSeoOptions } from '@/types/seo';
import { canonicalUrl } from './structured-data';

/**
 * Constrói metadados completos e padronizados para o Next.js 15 App Router
 * Focado nas diretrizes oficiais do Google Search Essentials.
 */
export function constructMetadata(options: RouteSeoOptions = {}): Metadata {
  const {
    title,
    description = SITE_DESCRIPTION,
    path = '',
    canonical,
    ogType = 'website',
    ogImage = DEFAULT_OG_IMAGE,
    ogImageAlt = DEFAULT_OG_IMAGE_ALT,
    keywords = [],
    noIndex = false,
    publishedTime,
    modifiedTime,
    authors = [AUTHOR_NAME],
    section,
  } = options;

  const url = canonical || canonicalUrl(path);
  const combinedKeywords = Array.from(new Set([...keywords, ...SEO_KEYWORDS]));

  const imageObj = {
    url: ogImage.startsWith('http') ? ogImage : canonicalUrl(ogImage),
    width: OG_IMAGE_WIDTH,
    height: OG_IMAGE_HEIGHT,
    alt: ogImageAlt || title || SITE_NAME,
  };

  const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),
    title: title
      ? {
          default: title,
          template: SITE_TITLE_TEMPLATE,
        }
      : {
          default: SITE_TITLE_DEFAULT,
          template: SITE_TITLE_TEMPLATE,
        },
    description,
    keywords: combinedKeywords,
    authors: authors.map((a) => ({ name: a, url: SITE_URL })),
    creator: AUTHOR_NAME,
    publisher: SITE_NAME,
    category: 'technology',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    alternates: {
      canonical: url,
      languages: {
        'pt-BR': url,
      },
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      title: title ? `${title} | ${SITE_NAME}` : SITE_TITLE_DEFAULT,
      description,
      url,
      siteName: SITE_NAME,
      locale: SITE_LOCALE,
      type: ogType,
      images: [imageObj],
      ...(ogType === 'article'
        ? {
            publishedTime,
            modifiedTime: modifiedTime || publishedTime,
            authors,
            section,
          }
        : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: title ? `${title} | ${SITE_NAME}` : SITE_TITLE_DEFAULT,
      description,
      creator: TWITTER_HANDLE,
      site: TWITTER_HANDLE,
      images: [imageObj.url],
    },
    verification: {
      google: GOOGLE_SITE_VERIFICATION,
    },
    other: {
      'geo.region': GEO_REGION,
      'geo.placename': GEO_PLACENAME,
      'geo.position': GEO_POSITION,
      ICBM: ICBM,
    },
  };

  return metadata;
}
