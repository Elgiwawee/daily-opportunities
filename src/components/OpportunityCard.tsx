
import { motion } from 'framer-motion';
import { Image, Video, ExternalLink, Share2, Calendar, Clock, MapPin, Download } from 'lucide-react';
import { generateShareableLink, copyShareLink } from '../utils/shareLinkGenerator';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { format } from 'date-fns';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import DonationButton from './DonationButton';
import { useTranslation } from 'react-i18next';
import { arSA } from 'date-fns/locale';

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
    const date = new Date(deadline);
    if (!isNaN(date.getTime())) {
      formattedDate = format(date, 'MMMM d, yyyy', { 
        locale: isRtl ? arSA : undefined 
      });
    }
  } catch (e) {
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
        
        if (firstAttachment && firstAttachment.url) {
          console.log("Using attachment URL for opportunity card:", firstAttachment.url);
          setImageUrl(firstAttachment.url);
          return;
        }
      }
      
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

  const handleShare = async (platform: string) => {
    const opportunity = {
      id,
      title,
      organization,
      description,
      imageUrl,
      type
    };
    
    const links = generateShareableLink(opportunity);
    
    switch (platform) {
      case 'facebook':
        window.open(links.facebook, '_blank', 'width=600,height=400');
        break;
      case 'twitter':
        window.open(links.twitter, '_blank', 'width=600,height=400');
        break;
      case 'whatsapp':
        window.open(links.whatsapp, '_blank', 'width=600,height=400');
        break;
      case 'copy':
        const result = await copyShareLink(opportunity);
        if (result.success) {
          toast.success(result.message);
        } else {
          toast.error(result.message);
        }
        break;
      default:
        break;
    }
    
    setShareMenuOpen(false);
  };

  const hasAttachments = (attachments: any[] | null): attachments is Attachment[] => {
    return Array.isArray(attachments) && 
           attachments.length > 0 && 
           typeof attachments[0] === 'object' &&
           'name' in attachments[0] &&
           'url' in attachments[0];
  };

  // Check if this opportunity should be expanded based on URL parameter
  const urlParams = new URLSearchParams(window.location.search);
  const expandedOpportunityId = urlParams.get('opportunity');
  const shouldExpand = expandedOpportunityId === id;

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
        
        <Accordion type="single" collapsible className="w-full" defaultValue={shouldExpand ? "details" : undefined}>
          <AccordionItem value="details" className="border-none">
            <AccordionTrigger className="text-sm font-medium text-blue-700 hover:underline bg-transparent border-none p-0 h-auto hover:no-underline">
              How to Apply
            </AccordionTrigger>
            <AccordionContent className="pt-4 pb-0">
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  {deadline && (
                    <div className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4" />
                      <span>Deadline: {formattedDate}</span>
                    </div>
                  )}
                  <div className="flex items-center">
                    <MapPin className="mr-2 h-4 w-4" />
                    <span>{type === 'scholarship' ? 'Scholarship' : 'Job'}</span>
                  </div>
                </div>
                
                {/* Enhanced image display section */}
                {imageUrl && (
                  <div className="mb-4">
                    <img
                      src={imageUrl}
                      alt={title}
                      className="w-full max-w-md mx-auto rounded-lg shadow-md object-cover"
                      style={{ maxHeight: '300px' }}
                    />
                  </div>
                )}
                
                <div className="prose prose-sm max-w-none">
                  <h4 className="font-semibold mb-2">Description</h4>
                  <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">{description}</p>
                </div>
                
                {external_url && (
                  <div className="pt-2">
                    <Button 
                      asChild 
                      className="bg-olive-600 hover:bg-olive-700 w-full sm:w-auto"
                    >
                      <a href={external_url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
                        Click here to apply
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                )}
                
                {hasAttachments(normalizedAttachments) && normalizedAttachments.length > 0 && (
                  <div className="pt-2">
                    <h4 className="font-semibold mb-2">Attachments</h4>
                    <div className="grid grid-cols-1 gap-2">
                      {normalizedAttachments.map((attachment, index) => (
                        <Card key={index} className="p-3 flex items-center justify-between">
                          <div className="flex items-center">
                            <Download className="h-4 w-4 text-olive-600 mr-2" />
                            <div>
                              <div className="font-medium text-sm">{attachment.name}</div>
                              <div className="text-xs text-gray-500">{attachment.type}</div>
                            </div>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            asChild
                          >
                            <a 
                              href={attachment.url} 
                              download={attachment.name}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Download
                            </a>
                          </Button>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        
        <div className="flex justify-between items-center mt-4">
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
