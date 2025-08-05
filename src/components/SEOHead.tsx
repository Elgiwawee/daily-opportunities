import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'scholarship' | 'job';
  structuredData?: object;
  noIndex?: boolean;
}

export const SEOHead = ({
  title = "Daily Opportunities - Scholarships & Jobs Worldwide",
  description = "Discover latest scholarships, grants, and job opportunities from top universities and organizations worldwide. Free to apply, updated daily.",
  keywords = "scholarships, grants, jobs, opportunities, university, education, funding, international students, tier 1 countries",
  image = "/og-image.png",
  url,
  type = 'website',
  structuredData,
  noIndex = false
}: SEOProps) => {
  const currentUrl = url || window.location.href;
  const imageUrl = image.startsWith('http') ? image : `${window.location.origin}${image}`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={currentUrl} />
      
      {/* Robots */}
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="Daily Opportunities" />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      <meta name="twitter:site" content="@DailyOpport2925" />
      
      {/* Additional Meta for Tier 1 Countries */}
      <meta name="geo.region" content="US,UK,CA,AU,DE,FR,NL,SE,NO,DK" />
      <meta name="geo.placename" content="Global" />
      <meta name="audience" content="international students, professionals, researchers" />
      <meta name="language" content="en" />
      
      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};