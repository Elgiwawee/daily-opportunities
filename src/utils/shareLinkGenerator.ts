import { generateSlug } from './slugUtils';

// Generate shareable links that social media platforms can properly preview
export const generateShareableLink = (opportunity: {
  id: string;
  title: string;
  organization: string;
  description: string;
  imageUrl?: string;
  type: 'scholarship' | 'job';
}) => {
  const baseUrl = window.location.origin;
  const slug = generateSlug(opportunity.title);
  const shortId = opportunity.id.substring(0, 8);
  
  // SEO-friendly URL with title slug and short ID
  const opportunityUrl = `${baseUrl}/opportunity/${slug}-${shortId}`;
  
  return {
    shareUrl: opportunityUrl,
    fallbackUrl: opportunityUrl,
    
    // Generate specific social media share URLs using the SEO-friendly URL
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${opportunity.title} - ${opportunity.organization}\n\n${opportunity.description.substring(0, 100)}...\n\nView full details: ${opportunityUrl}`)}`,
    
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(opportunityUrl)}`,
    
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(`${opportunity.title} - ${opportunity.organization}`)}&url=${encodeURIComponent(opportunityUrl)}`,
    
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(opportunityUrl)}`
  };
};

// Function to copy link and show appropriate message
export const copyShareLink = async (opportunity: any) => {
  const links = generateShareableLink(opportunity);
  
  try {
    await navigator.clipboard.writeText(links.shareUrl);
    return { success: true, message: 'Share link copied to clipboard!' };
  } catch (error) {
    console.error('Failed to copy link:', error);
    return { success: false, message: 'Failed to copy link' };
  }
};