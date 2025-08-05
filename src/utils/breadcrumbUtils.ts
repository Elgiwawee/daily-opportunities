// Utility functions for generating breadcrumb data

interface BreadcrumbItem {
  name: string;
  url: string;
  isCurrentPage?: boolean;
}

export const generateBreadcrumbs = (pathname: string, opportunityTitle?: string, countryName?: string, levelName?: string): BreadcrumbItem[] => {
  const breadcrumbs: BreadcrumbItem[] = [
    { name: 'Home', url: '/' }
  ];

  // Split pathname and build breadcrumbs
  const pathSegments = pathname.split('/').filter(segment => segment);

  if (pathSegments.length === 0) {
    return [{ ...breadcrumbs[0], isCurrentPage: true }];
  }

  for (let i = 0; i < pathSegments.length; i++) {
    const segment = pathSegments[i];
    const isLast = i === pathSegments.length - 1;
    
    switch (segment) {
      case 'scholarships':
        breadcrumbs.push({
          name: 'Scholarships',
          url: '/scholarships',
          isCurrentPage: isLast
        });
        break;
        
      case 'jobs':
        breadcrumbs.push({
          name: 'Jobs',
          url: '/jobs',
          isCurrentPage: isLast
        });
        break;
        
      case 'news':
        breadcrumbs.push({
          name: 'News',
          url: '/news',
          isCurrentPage: isLast
        });
        break;
        
      case 'blog':
        breadcrumbs.push({
          name: 'Blog',
          url: '/blog',
          isCurrentPage: isLast
        });
        break;
        
      case 'about':
        breadcrumbs.push({
          name: 'About Us',
          url: '/about',
          isCurrentPage: isLast
        });
        break;
        
      case 'contact':
        breadcrumbs.push({
          name: 'Contact',
          url: '/contact',
          isCurrentPage: isLast
        });
        break;
        
      case 'donate':
        breadcrumbs.push({
          name: 'Donate',
          url: '/donate',
          isCurrentPage: isLast
        });
        break;
        
      case 'disclaimer':
        breadcrumbs.push({
          name: 'Disclaimer',
          url: '/disclaimer',
          isCurrentPage: isLast
        });
        break;
        
      case 'explainer':
        breadcrumbs.push({
          name: 'How It Works',
          url: '/explainer',
          isCurrentPage: isLast
        });
        break;
        
      case 'country':
        if (countryName) {
          breadcrumbs.push({
            name: `${countryName} Scholarships`,
            url: `/scholarships/country/${pathSegments[i + 1]}`,
            isCurrentPage: isLast
          });
        }
        break;
        
      case 'level':
        if (levelName) {
          breadcrumbs.push({
            name: `${levelName} Scholarships`,
            url: `/scholarships/level/${pathSegments[i + 1]}`,
            isCurrentPage: isLast
          });
        }
        break;
        
      case 'opportunity':
        if (opportunityTitle) {
          breadcrumbs.push({
            name: opportunityTitle,
            url: `/opportunity/${pathSegments[i + 1]}`,
            isCurrentPage: isLast
          });
        }
        break;
    }
  }

  return breadcrumbs;
};

// Common breadcrumb configurations for different page types
export const BREADCRUMB_CONFIGS: Record<string, BreadcrumbItem[]> = {
  scholarships: [
    { name: 'Home', url: '/' },
    { name: 'Scholarships', url: '/scholarships', isCurrentPage: true }
  ],
  
  jobs: [
    { name: 'Home', url: '/' },
    { name: 'Jobs', url: '/jobs', isCurrentPage: true }
  ],
  
  news: [
    { name: 'Home', url: '/' },
    { name: 'News', url: '/news', isCurrentPage: true }
  ],
  
  blog: [
    { name: 'Home', url: '/' },
    { name: 'Blog', url: '/blog', isCurrentPage: true }
  ],
  
  about: [
    { name: 'Home', url: '/' },
    { name: 'About Us', url: '/about', isCurrentPage: true }
  ],
  
  contact: [
    { name: 'Home', url: '/' },
    { name: 'Contact', url: '/contact', isCurrentPage: true }
  ]
};