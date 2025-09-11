import Head from 'next/head';
import { config } from '@/lib/config';

interface SEOProps {
  title?: string;
  description?: string;
  ogImage?: string;
  ogType?: string;
  canonical?: string;
}

export default function SEO({
  title,
  description = 'Astrophotography gallery featuring deep sky objects and planetary images captured from the beautiful skies of Hawaii.',
  ogImage,
  ogType = 'website',
  canonical,
}: SEOProps) {
  const siteTitle = title ? `${title} | ${config.siteName}` : config.siteName;
  const imageUrl = ogImage || `${config.staticBaseUrl}/og-default.jpg`;

  return (
    <Head>
      <title>{siteTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      
      {/* Open Graph */}
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:site_name" content={config.siteName} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      
      {/* Additional meta tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="theme-color" content="#000000" />
    </Head>
  );
}
