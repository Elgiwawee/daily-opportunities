
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from '@/components/ui/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import Layout from '@/components/Layout';
import { useTranslation } from 'react-i18next';
import { arSA } from 'date-fns/locale/ar-SA';
import { enUS } from 'date-fns/locale/en-US';

const OpportunityDetails = () => {
  const { t, i18n } = useTranslation();
  const { id } = useParams();
  const [copied, setCopied] = useState(false);
  
  // Select locale based on current language
  const locale = i18n.language === 'ar' ? arSA : enUS;

  const { data: opportunity, isLoading } = useQuery({
    queryKey: ['opportunity', id],
    queryFn: async () => {
      if (!id) return null;
      
      const { data, error } = await supabase
        .from('opportunities')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) {
        throw new Error(error.message);
      }
      
      return data;
    },
  });

  useEffect(() => {
    if (copied) {
      const timeout = setTimeout(() => {
        setCopied(false);
      }, 2000);
      
      return () => clearTimeout(timeout);
    }
  }, [copied]);

  const handleShare = (platform: string) => {
    const url = window.location.href;
    let shareUrl = '';
    
    switch(platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(opportunity?.title || '')}`;
        break;
      case 'whatsapp':
        shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${opportunity?.title} ${url}`)}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        setCopied(true);
        toast({
          title: t('opportunity.copied'),
          duration: 2000,
        });
        return;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'noopener,noreferrer');
    }
  };

  // Helper function to safely get attachment properties
  const getAttachmentProperty = (attachment: any, property: string) => {
    if (!attachment) return null;
    if (typeof attachment === 'object' && property in attachment) {
      return attachment[property];
    }
    return null;
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-64 w-full" />
          </div>
        ) : opportunity ? (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <h1 className="text-3xl font-bold">{opportunity.title}</h1>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Share2 className="h-4 w-4 mr-2" />
                    {t('opportunity.share.title')}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleShare('facebook')}>
                    {t('opportunity.share.facebook')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleShare('twitter')}>
                    {t('opportunity.share.twitter')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleShare('whatsapp')}>
                    {t('opportunity.share.whatsapp')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleShare('copy')}>
                    {copied ? '✓' : ''} {t('opportunity.share.copy')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            <div className="flex flex-wrap gap-4 text-gray-600 dark:text-gray-300">
              <div>
                <span className="font-medium">{t('opportunity.organization')}:</span> {opportunity.organization}
              </div>
              <div>
                <span className="font-medium">{t('opportunity.deadline')}:</span> {opportunity.deadline}
              </div>
              <div>
                <span className="font-medium">{t('opportunity.type')}:</span> {t(`opportunity.types.${opportunity.type}`)}
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
              <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: opportunity.description }}></div>
            </div>
            
            {/* Display attachments if they exist */}
            {opportunity.attachments && Array.isArray(opportunity.attachments) && opportunity.attachments.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-medium mb-4">{t('opportunity.attachments')} ({opportunity.attachments.length})</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {opportunity.attachments.map((attachment: any, index: number) => {
                    // Handle both string and object attachment formats for backward compatibility
                    if (typeof attachment === 'string') {
                      return (
                        <Card key={index} className="overflow-hidden">
                          <CardContent className="p-4">
                            <a 
                              href={attachment}
                              target="_blank"
                              rel="noreferrer"
                              className="text-blue-600 dark:text-blue-400 hover:underline flex items-center"
                            >
                              {t('opportunity.attachment')} {index + 1}
                            </a>
                          </CardContent>
                        </Card>
                      );
                    } else {
                      const name = getAttachmentProperty(attachment, 'name') || `${t('opportunity.file')} ${index + 1}`;
                      const url = getAttachmentProperty(attachment, 'url') || '#';
                      const type = getAttachmentProperty(attachment, 'type');
                      
                      return (
                        <Card key={index} className="overflow-hidden">
                          <CardContent className="p-4">
                            {type?.startsWith('image/') ? (
                              <div className="relative">
                                <a 
                                  href={url}
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  <img 
                                    src={url} 
                                    alt={name} 
                                    className="w-full h-32 object-cover mb-2 rounded" 
                                  />
                                  <p className="text-sm text-blue-600 dark:text-blue-400 hover:underline truncate">
                                    {name}
                                  </p>
                                </a>
                              </div>
                            ) : type?.startsWith('video/') ? (
                              <div>
                                <video
                                  src={url}
                                  controls
                                  className="w-full h-32 object-cover mb-2 rounded"
                                />
                                <a 
                                  href={url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                                >
                                  {name}
                                </a>
                              </div>
                            ) : (
                              <a 
                                href={url}
                                target="_blank"
                                rel="noreferrer"
                                className="text-blue-600 dark:text-blue-400 hover:underline flex items-center"
                              >
                                <span className="truncate">{name}</span>
                              </a>
                            )}
                          </CardContent>
                        </Card>
                      );
                    }
                  })}
                </div>
              </div>
            )}
            
            {opportunity.external_url && (
              <div className="mt-8">
                <Button 
                  className="w-full sm:w-auto" 
                  onClick={() => window.open(opportunity.external_url, '_blank', 'noopener,noreferrer')}
                >
                  {t('buttons.apply')}
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">{t('opportunity.notFound')}</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default OpportunityDetails;
