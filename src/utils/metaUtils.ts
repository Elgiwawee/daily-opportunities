
export const updateMetaTags = (opportunity: {
  title: string;
  organization: string;
  description: string;
  imageUrl?: string;
  id: string;
}) => {
  const baseUrl = window.location.origin;
  
  // Update Open Graph tags
  updateMetaTag('og:title', `${opportunity.title} - ${opportunity.organization}`);
  updateMetaTag('og:description', opportunity.description.substring(0, 160));
  updateMetaTag('og:url', `${baseUrl}/?opportunity=${opportunity.id}`);
  
  if (opportunity.imageUrl) {
    updateMetaTag('og:image', opportunity.imageUrl);
    updateMetaTag('twitter:image', opportunity.imageUrl);
  }
  
  // Update Twitter Card tags
  updateMetaTag('twitter:title', `${opportunity.title} - ${opportunity.organization}`);
  updateMetaTag('twitter:description', opportunity.description.substring(0, 160));
  
  // Update page title
  document.title = `${opportunity.title} - Daily Opportunities`;
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
