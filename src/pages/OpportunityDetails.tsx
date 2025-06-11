import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Calendar, Clock, Link as LinkIcon, MapPin, ExternalLink, Download } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';
import { Json } from '@/integrations/supabase/types';

interface Opportunity {
  id: string;
  title: string;
  organization: string;
  deadline: string | null;
  type: 'scholarship' | 'job';
  description: string;
  attachments: any[] | null;
  created_at: string;
  external_url?: string | null;
}

// Define a more specific type for attachments
interface Attachment {
  name: string;
  url: string;
  type: string;
  path: string;
}

const OpportunityDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  const fetchOpportunity = async () => {
    if (!id) throw new Error('No opportunity ID provided');
    
    const { data, error } = await supabase
      .from('opportunities')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching opportunity:', error);
      toast.error('Failed to load opportunity details');
      throw error;
    }
    
    return data as Opportunity;
  };

  const { data: opportunity, isLoading, error } = useQuery({
    queryKey: ['opportunity', id],
    queryFn: fetchOpportunity,
    enabled: !!id,
  });

  useEffect(() => {
    if (error) {
      toast.error('Failed to load opportunity details');
    }
  }, [error]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    toast.success('Link copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  // Type guard to check if attachments is an array of attachment objects
  const hasAttachments = (attachments: any[] | null): attachments is Attachment[] => {
    return Array.isArray(attachments) && 
           attachments.length > 0 && 
           typeof attachments[0] === 'object' &&
           'name' in attachments[0] &&
           'url' in attachments[0];
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="pt-36 pb-12 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-olive-600"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('opportunityDetails.error')}</h2>
              <p className="text-gray-600 mb-8">{t('opportunityDetails.errorMessage')}</p>
              <Button asChild className="bg-olive-600 hover:bg-olive-700">
                <Link to="/">{t('opportunityDetails.backHome')}</Link>
              </Button>
            </div>
          ) : opportunity ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white shadow-lg rounded-lg overflow-hidden"
            >
              <div className="p-6 sm:p-10">
                <div className="flex justify-between items-start">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{opportunity.title}</h1>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={copyToClipboard}
                    className="text-gray-500 hover:text-olive-600"
                  >
                    {copied ? t('opportunityDetails.copied') : t('opportunityDetails.share')}
                    <LinkIcon className="ml-2 h-4 w-4" />
                  </Button>
                </div>
                
                <div className="text-lg text-olive-600 font-semibold mb-6">
                  {opportunity.organization}
                </div>
                
                <div className="flex flex-wrap gap-4 mb-8 text-sm text-gray-500">
                  {opportunity.deadline && (
                    <div className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4" />
                      <span>{t('opportunityDetails.deadline')}: {new Date(opportunity.deadline).toLocaleDateString()}</span>
                    </div>
                  )}
                  <div className="flex items-center">
                    <Clock className="mr-2 h-4 w-4" />
                    <span>{t('opportunityDetails.posted')} {formatDistanceToNow(new Date(opportunity.created_at), { addSuffix: true })}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="mr-2 h-4 w-4" />
                    <span>{opportunity.type === 'scholarship' ? t('opportunityDetails.scholarship') : t('opportunityDetails.job')}</span>
                  </div>
                </div>
                
                <div className="prose max-w-none mb-8">
                  <h2 className="text-xl font-semibold mb-4">{t('opportunityDetails.description')}</h2>
                  <div dangerouslySetInnerHTML={{ __html: opportunity.description.replace(/\n/g, '<br />') }} />
                </div>
                
                {opportunity.external_url && (
                  <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">{t('opportunityDetails.applyNow')}</h2>
                    <Button asChild className="bg-olive-600 hover:bg-olive-700">
                      <a href={opportunity.external_url} target="_blank" rel="noopener noreferrer" className="flex items-center">
                        Click here to apply
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                )}
                
                {hasAttachments(opportunity.attachments) && opportunity.attachments.length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">{t('opportunityDetails.attachments')}</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {opportunity.attachments.map((attachment, index) => (
                        <Card key={index} className="p-4 flex items-center justify-between">
                          <div className="flex items-center">
                            <Download className="h-5 w-5 text-olive-600 mr-3" />
                            <div>
                              <div className="font-medium">{attachment.name}</div>
                              <div className="text-sm text-gray-500">{attachment.type}</div>
                            </div>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            asChild
                            className="ml-2"
                          >
                            <a 
                              href={attachment.url} 
                              download={attachment.name}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {t('opportunityDetails.download')}
                            </a>
                          </Button>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex justify-between items-center mt-10">
                  <Button asChild variant="outline" className="border-olive-600 text-olive-700 hover:bg-olive-50">
                    <Link to={opportunity.type === 'scholarship' ? '/scholarships' : '/jobs'}>
                      {opportunity.type === 'scholarship' ? t('opportunityDetails.backToScholarships') : t('opportunityDetails.backToJobs')}
                    </Link>
                  </Button>
                  
                  <Button asChild className="bg-olive-600 hover:bg-olive-700">
                    <Link to="/">{t('opportunityDetails.backHome')}</Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('opportunityDetails.notFound')}</h2>
              <p className="text-gray-600 mb-8">{t('opportunityDetails.notFoundMessage')}</p>
              <Button asChild className="bg-olive-600 hover:bg-olive-700">
                <Link to="/">{t('opportunityDetails.backHome')}</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OpportunityDetails;
