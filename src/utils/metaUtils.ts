
export const updateMetaTags = (content: {
  title: string;
  organization?: string;
  description: string;
  imageUrl?: string;
  id: string;
  type?: 'opportunity' | 'news';
}) => {
  const baseUrl = window.location.origin;
  const isNews = content.type === 'news';
  
  // Create appropriate title and URL
  const pageTitle = isNews 
    ? `${content.title} - Daily Opportunities News`
    : `${content.title} - ${content.organization} - Daily Opportunities`;
  
  const pageUrl = isNews 
    ? `${baseUrl}/?news=${content.id}`
    : `${baseUrl}/?opportunity=${content.id}`;
  
  // Clean description - remove HTML tags and limit length
  const cleanDescription = content.description
    .replace(/<[^>]*>/g, '')
    .substring(0, 160)
    .trim();
  
  // Update document title
  document.title = pageTitle;
  
  // Update Open Graph tags
  updateMetaTag('og:title', pageTitle);
  updateMetaTag('og:description', cleanDescription);
  updateMetaTag('og:url', pageUrl);
  updateMetaTag('og:type', 'website');
  updateMetaTag('og:site_name', 'Daily Opportunities');
  
  if (content.imageUrl) {
    updateMetaTag('og:image', content.imageUrl);
    updateMetaTag('og:image:width', '1200');
    updateMetaTag('og:image:height', '630');
    updateMetaTag('og:image:type', 'image/jpeg');
    updateMetaTag('og:image:alt', `${content.title} - ${content.organization || 'Daily Opportunities'}`);
  }
  
  // Update Twitter Card tags
  updateMetaTag('twitter:card', 'summary_large_image');
  updateMetaTag('twitter:title', pageTitle);
  updateMetaTag('twitter:description', cleanDescription);
  updateMetaTag('twitter:site', '@DailyOpportunities');
  
  if (content.imageUrl) {
    updateMetaTag('twitter:image', content.imageUrl);
  }
  
  // Update standard meta tags
  updateMetaTag('description', cleanDescription);
  
  // Add WhatsApp specific meta tags
  if (content.imageUrl) {
    updateMetaTag('image', content.imageUrl);
  }
};

const updateMetaTag = (property: string, content: string) => {
  // Remove existing meta tag
  let existingMeta = document.querySelector(`meta[property="${property}"]`) || 
                     document.querySelector(`meta[name="${property}"]`);
  
  if (existingMeta) {
    existingMeta.remove();
  }
  
  // Create new meta tag
  const meta = document.createElement('meta');
  
  if (property.startsWith('og:') || property.startsWith('twitter:')) {
    meta.setAttribute('property', property);
  } else {
    meta.setAttribute('name', property);
  }
  
  meta.setAttribute('content', content);
  document.head.appendChild(meta);
};
