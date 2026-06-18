import { Metadata } from 'next';

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  image?: string;
  type?: 'website' | 'article';
  publishedAt?: string;
  tags?: string[];
}

export function generateMetadata({
  title,
  description,
  canonical,
  image = '/og-image.jpg',
  type = 'website',
  publishedAt,
  tags,
}: SEOProps): Metadata {
  const siteName = 'AkInteriors';
  const fullTitle = `${title} | ${siteName}`;

  return {
    title: fullTitle,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title: fullTitle,
      description,
      url: canonical,
      siteName,
      images: [{ url: image, width: 1200, height: 630 }],
      type,
      ...(publishedAt && { publishedTime: publishedAt }),
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [image],
    },
    ...(tags && { keywords: tags.join(', ') }),
  };
}
