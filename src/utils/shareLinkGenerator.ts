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
  
  // Use the edge function for proper social media meta tags
  const shareUrl = `https://mkcvqqaumfwyrkurfohh.supabase.co/functions/v1/share-opportunity?id=${opportunity.id}`;
  
  // Regular app URL for direct access
  const fallbackUrl = `${baseUrl}/?opportunity=${opportunity.id}`;
  
  return {
    shareUrl,
    fallbackUrl,
    
    // Generate specific social media share URLs using the special share URL
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${opportunity.title} - ${opportunity.organization}\n\n${opportunity.description.substring(0, 100)}...\n\nView full details: ${shareUrl}`)}`,
    
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(`${opportunity.title} - ${opportunity.organization}`)}&url=${encodeURIComponent(shareUrl)}`,
    
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
  };
};

// Function to copy link and show appropriate message
export const copyShareLink = async (opportunity: any) => {
  const links = generateShareableLink(opportunity);
  
  try {
    // Use the special share URL for better social media previews
    await navigator.clipboard.writeText(links.shareUrl);
    return { success: true, message: 'Share link copied to clipboard!' };
  } catch (error) {
    console.error('Failed to copy link:', error);
    return { success: false, message: 'Failed to copy link' };
  }
};