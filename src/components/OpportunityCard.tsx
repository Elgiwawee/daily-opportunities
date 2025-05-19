
import { motion } from 'framer-motion';
import { Image, Video, ExternalLink, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import DonationButton from './DonationButton';
import { useTranslation } from 'react-i18next';
import arSA from 'date-fns/locale/ar-SA';

interface Attachment {
  name: string;
  url: string;
  type?: string;
  path?: string;
}

interface OpportunityCardProps {
  id: string;
  title: string;
  organization: string;
  deadline: string;
  type: 'scholarship' | 'job';
  description: string;
  attachments?: Attachment[] | any[];
  featured?: boolean;
  external_url?: string;
}

const OpportunityCard = ({
  id,
  title,
  organization,
  deadline,
  type,
  description,
  attachments = [],
  featured = false,
  external_url,
}: OpportunityCardProps) => {
  const { t, i18n } = useTranslation();
  const [shareMenuOpen, setShareMenuOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(true);
  const isRtl = i18n.language === 'ar';
  
  // Try to parse the deadline to a readable format
  let formattedDate = deadline;
  try {
    // Assuming deadline is stored in ISO format
    const date = new Date(deadline);
    if (!isNaN(date.getTime())) {
      formattedDate = format(date, 'MMMM d, yyyy', { 
        locale: isRtl ? arSA : undefined 
      });
    }
  } catch (e) {
    // If parsing fails, use the original string
    console.log('Date parsing failed for:', deadline);
  }

  // Fix to ensure attachments is always an array and properly processed
  const normalizedAttachments = Array.isArray(attachments) ? attachments : [];
  
  // Find and set the appropriate image URL for the card background
  useEffect(() => {
    const loadImage = () => {
      setImageLoading(true);
      
      if (normalizedAttachments && normalizedAttachments.length > 0) {
        const firstAttachment = normalizedAttachments[0];
        
        // Check if the URL is directly available or needs to be accessed as a property
        if (firstAttachment && firstAttachment.url) {
          console.log("Using attachment URL for opportunity card:", firstAttachment.url);
          setImageUrl(firstAttachment.url);
          return;
        }
      }
      
      // Default images based on opportunity type
      const defaultImageUrl = type === 'scholarship' 
        ? 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1' 
        : 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40';
      
      console.log("Using default image for opportunity card:", defaultImageUrl);
      setImageUrl(defaultImageUrl);
    };

    loadImage();
  }, [normalizedAttachments, type]);

  const handleImageError = () => {
    console.log("Image failed to load, using fallback for type:", type);
    const fallbackUrl = type === 'scholarship' 
      ? 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1' 
      : 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40';
    setImageUrl(fallbackUrl);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleShare = (platform: string) => {
    // Get the current page URL + opportunity ID for sharing
    const baseUrl = window.location.origin;
    const shareUrl = `${baseUrl}/opportunity/${id}`;
    
    // Get image URL if available
    const shareImageUrl = imageUrl || '';
    
    let shareLink = '';
    
    switch (platform) {
      case 'facebook':
        // Facebook sharing with image
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(title)}&picture=${encodeURIComponent(shareImageUrl)}`;
        break;
      case 'twitter':
        // Twitter doesn't directly support image sharing via URL parameters
        shareLink = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(title)}`;
        break;
      case 'whatsapp':
        shareLink = `https://api.whatsapp.com/send?text=${encodeURIComponent(title + ' - ' + shareUrl)}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(shareUrl).then(() => {
          toast.success(t('opportunity.copied'));
        });
        return;
      default:
        break;
    }
    
    if (shareLink) {
      window.open(shareLink, '_blank', 'width=600,height=400');
    }
    
    setShareMenuOpen(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className={`overflow-hidden border border-gray-200 rounded-lg shadow-sm hover:shadow-md ${featured ? 'col-span-1 md:col-span-2 lg:col-span-1' : ''}`}
    >
      <div className="relative aspect-video w-full overflow-hidden">
        {imageLoading && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
        )}
        
        {imageUrl && (
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
            onError={handleImageError}
            onLoad={handleImageLoad}
            loading="lazy"
          />
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-4">
          <h3 className="text-lg md:text-xl font-bold text-white">{title}</h3>
        </div>
        
        <div className={`absolute top-2 left-2 px-3 py-1 text-xs font-semibold text-white rounded ${
          type === 'scholarship' ? 'bg-blue-700' : 'bg-green-700'
        }`}>
          {type === 'scholarship' ? t('scholarships.title') : t('jobs.title')}
        </div>
        
        {/* Share button positioned away from navbar */}
        <div className={`absolute top-10 ${isRtl ? 'left-2' : 'right-2'}`}>
          <div className="relative inline-block">
            <button 
              onClick={() => setShareMenuOpen(!shareMenuOpen)}
              className="flex items-center justify-center bg-white/80 hover:bg-white text-gray-700 p-1.5 rounded-full"
            >
              <Share2 className="w-4 h-4" />
            </button>
            
            {shareMenuOpen && (
              <div className={`absolute ${isRtl ? 'left-0' : 'right-0'} mt-2 w-36 bg-white rounded-md shadow-lg z-10 border border-gray-100`}>
                <div className="py-1">
                  <button
                    onClick={() => handleShare('facebook')}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-blue-50"
                  >
                    {t('opportunity.share.facebook')}
                  </button>
                  <button
                    onClick={() => handleShare('twitter')}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-blue-50"
                  >
                    {t('opportunity.share.twitter')}
                  </button>
                  <button
                    onClick={() => handleShare('whatsapp')}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-blue-50"
                  >
                    {t('opportunity.share.whatsapp')}
                  </button>
                  <button
                    onClick={() => handleShare('copy')}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-blue-50"
                  >
                    {t('opportunity.share.copy')}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-gray-700">{organization}</span>
          <span className="text-xs text-gray-500">{formattedDate}</span>
        </div>
        
        <p className="text-gray-700 text-sm mb-4 line-clamp-2">{description}</p>
        
        <div className="flex justify-between items-center mt-2">
          <Link
            to={`/opportunity/${id}`}
            className="text-sm font-medium text-blue-700 hover:underline"
          >
            {type === 'scholarship' ? t('scholarships.howToApply') : t('jobs.viewDetails')}
          </Link>
          
          <div className="flex items-center gap-2">
            {external_url && (
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-1 text-blue-700 border-blue-200 hover:bg-blue-50"
                asChild
              >
                <a href={external_url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-3 h-3" />
                  {t('buttons.apply')}
                </a>
              </Button>
            )}
            
            <DonationButton 
              variant="outline" 
              size="sm" 
              label={t('buttons.support')}
              className="text-amber-700 border-amber-200 hover:bg-amber-50"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default OpportunityCard;
