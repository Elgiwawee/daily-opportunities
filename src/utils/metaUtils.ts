
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
    ? content.title 
    : `${content.title} - ${content.organization}`;
  
  const pageUrl = isNews 
    ? `${baseUrl}/?news=${content.id}`
    : `${baseUrl}/?opportunity=${content.id}`;
  
  // Update Open Graph tags
  updateMetaTag('og:title', pageTitle);
  updateMetaTag('og:description', content.description.substring(0, 160));
  updateMetaTag('og:url', pageUrl);
  
  if (content.imageUrl) {
    updateMetaTag('og:image', content.imageUrl);
    updateMetaTag('twitter:image', content.imageUrl);
  }
  
  // Update Twitter Card tags
  updateMetaTag('twitter:title', pageTitle);
  updateMetaTag('twitter:description', content.description.substring(0, 160));
  
  // Update page title
  document.title = isNews 
    ? `${content.title} - Daily Opportunities News`
    : `${content.title} - Daily Opportunities`;
};

const updateMetaTag = (property: string, content: string) => {
  let meta = document.querySelector(`meta[property="${property}"]`) || 
             document.querySelector(`meta[name="${property}"]`);
  
  if (!meta) {
    meta = document.createElement('meta');
    if (property.startsWith('og:') || property.startsWith('twitter:')) {
      meta.setAttribute('property', property);
    } else {
      meta.setAttribute('name', property);
    }
    document.head.appendChild(meta);
  }
  
  meta.setAttribute('content', content);
};
