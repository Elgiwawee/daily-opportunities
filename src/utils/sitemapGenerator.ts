// Sitemap generation utilities for SEO

interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

interface OpportunityData {
  id: string;
  created_at: string;
  updated_at?: string;
  type: 'scholarship' | 'job';
}

// Static pages configuration
export const STATIC_PAGES: SitemapUrl[] = [
  {
    loc: '/',
    changefreq: 'daily',
    priority: 1.0
  },
  {
    loc: '/scholarships',
    changefreq: 'daily',
    priority: 0.9
  },
  {
    loc: '/jobs',
    changefreq: 'daily',
    priority: 0.9
  },
  {
    loc: '/news',
    changefreq: 'daily',
    priority: 0.8
  },
  {
    loc: '/blog',
    changefreq: 'weekly',
    priority: 0.7
  },
  {
    loc: '/about',
    changefreq: 'monthly',
    priority: 0.6
  },
  {
    loc: '/contact',
    changefreq: 'monthly',
    priority: 0.6
  },
  {
    loc: '/explainer',
    changefreq: 'monthly',
    priority: 0.5
  },
  {
    loc: '/donate',
    changefreq: 'monthly',
    priority: 0.4
  },
  {
    loc: '/disclaimer',
    changefreq: 'yearly',
    priority: 0.3
  }
];

// Scholarship countries and levels for dynamic pages
export const SCHOLARSHIP_COUNTRIES = [
  'united-states', 'united-kingdom', 'canada', 'australia', 'germany',
  'netherlands', 'sweden', 'norway', 'denmark', 'france', 'switzerland'
];

export const SCHOLARSHIP_LEVELS = [
  'undergraduate', 'masters', 'phd', 'postdoc', 'high-school'
];

export const generateSitemapUrls = (
  baseUrl: string, 
  opportunities: OpportunityData[] = []
): SitemapUrl[] => {
  const urls: SitemapUrl[] = [];
  
  // Add static pages
  STATIC_PAGES.forEach(page => {
    urls.push({
      ...page,
      loc: `${baseUrl}${page.loc}`,
      lastmod: new Date().toISOString().split('T')[0]
    });
  });

  // Add scholarship country pages
  SCHOLARSHIP_COUNTRIES.forEach(country => {
    urls.push({
      loc: `${baseUrl}/scholarships/country/${country}`,
      changefreq: 'daily',
      priority: 0.8,
      lastmod: new Date().toISOString().split('T')[0]
    });
  });

  // Add scholarship level pages
  SCHOLARSHIP_LEVELS.forEach(level => {
    urls.push({
      loc: `${baseUrl}/scholarships/level/${level}`,
      changefreq: 'daily',
      priority: 0.8,
      lastmod: new Date().toISOString().split('T')[0]
    });
  });

  // Add individual opportunity pages
  opportunities.forEach(opportunity => {
    const lastmod = opportunity.updated_at || opportunity.created_at;
    urls.push({
      loc: `${baseUrl}/opportunity/${opportunity.id}`,
      changefreq: 'weekly',
      priority: opportunity.type === 'scholarship' ? 0.7 : 0.6,
      lastmod: new Date(lastmod).toISOString().split('T')[0]
    });
  });

  return urls;
};

export const generateSitemapXML = (urls: SitemapUrl[]): string => {
  const header = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;
  
  const footer = `</urlset>`;
  
  const urlEntries = urls.map(url => {
    let entry = `  <url>
    <loc>${url.loc}</loc>`;
    
    if (url.lastmod) {
      entry += `
    <lastmod>${url.lastmod}</lastmod>`;
    }
    
    if (url.changefreq) {
      entry += `
    <changefreq>${url.changefreq}</changefreq>`;
    }
    
    if (url.priority !== undefined) {
      entry += `
    <priority>${url.priority}</priority>`;
    }
    
    entry += `
  </url>`;
    
    return entry;
  }).join('\n');
  
  return `${header}
${urlEntries}
${footer}`;
};

// Generate robots.txt content
export const generateRobotsTxt = (sitemapUrl: string): string => {
  return `User-agent: *
Allow: /

# Sitemaps
Sitemap: ${sitemapUrl}

# Crawl-delay for tier 1 countries optimization
Crawl-delay: 1

# Block admin and auth pages
Disallow: /admin
Disallow: /auth
Disallow: /settings

# Allow all scholarship and job pages
Allow: /scholarships
Allow: /jobs
Allow: /opportunity
Allow: /news
Allow: /blog
`;
};