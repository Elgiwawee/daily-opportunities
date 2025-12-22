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
import AdSenseAd from '../components/AdSenseAd';
import MobileStickyAd from '../components/MobileStickyAd';
import StickySidebar from '../components/StickySidebar';
import { SEOHead } from '../components/SEOHead';
import { generateScholarshipSchema, generateJobSchema, generateBreadcrumbSchema } from '../utils/structuredData';
import { Breadcrumb } from '../components/Breadcrumb';
import { useLocation } from 'react-router-dom';
import { generateBreadcrumbs } from '../utils/breadcrumbUtils';
import { RelatedOpportunities } from '../components/RelatedOpportunities';
import { FAQSection } from '../components/FAQSection';
import { SCHOLARSHIP_FAQS, JOB_FAQS } from '../data/faqData';
import { extractIdFromSlug, generateSlug } from '../utils/slugUtils';

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
  const { slug } = useParams<{ slug: string }>();
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  const location = useLocation();

  const fetchOpportunity = async () => {
    if (!slug) throw new Error('No opportunity slug provided');
    
    // Extract the ID portion from the slug (last 8 chars after final hyphen)
    const idPart = extractIdFromSlug(slug);
    
    // Try multiple methods to find the opportunity
    let data = null;
    let error = null;
    
    // Method 1: Try exact UUID match (for direct ID links)
    const { data: exactMatch, error: exactError } = await supabase
      .from('opportunities')
      .select('*')
      .eq('id', slug)
      .maybeSingle();
    
    if (exactMatch) {
      return exactMatch as Opportunity;
    }
    
    // Method 2: Try ID prefix match (for SEO-friendly slug links)
    if (idPart && idPart.length >= 8) {
      const { data: prefixMatch } = await supabase
        .from('opportunities')
        .select('*')
        .filter('id', 'ilike', `${idPart}%`)
        .limit(1)
        .maybeSingle();
      
      if (prefixMatch) {
        return prefixMatch as Opportunity;
      }
    }
    
    // Method 3: Search all and find by ID prefix (fallback)
    const { data: allOpps } = await supabase
      .from('opportunities')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (allOpps && idPart) {
      const found = allOpps.find(opp => opp.id.startsWith(idPart));
      if (found) {
        return found as Opportunity;
      }
    }
    
    throw new Error('Opportunity not found');
  };

  const { data: opportunity, isLoading, error } = useQuery({
    queryKey: ['opportunity', slug],
    queryFn: fetchOpportunity,
    enabled: !!slug,
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

  // Generate structured data and breadcrumb for the opportunity
  const getStructuredData = () => {
    if (!opportunity) return null;
    
    const breadcrumbItems = [
      { name: 'Home', url: '/' },
      { name: opportunity.type === 'scholarship' ? 'Scholarships' : 'Jobs', url: opportunity.type === 'scholarship' ? '/scholarships' : '/jobs' },
      { name: opportunity.title, url: `/opportunity/${opportunity.id}` }
    ];

    const opportunitySchema = opportunity.type === 'scholarship' 
      ? generateScholarshipSchema(opportunity)
      : generateJobSchema(opportunity);

    return {
      "@context": "https://schema.org",
      "@graph": [
        opportunitySchema,
        generateBreadcrumbSchema(breadcrumbItems)
      ]
    };
  };

  return (
    <div className="min-h-screen bg-white pb-16 md:pb-0">
      {opportunity && (
        <SEOHead
          title={`${opportunity.title} - ${opportunity.organization} | Daily Opportunities`}
          description={`${opportunity.description.replace(/<[^>]*>/g, '').substring(0, 155)}... Apply now for this ${opportunity.type} opportunity.`}
          keywords={`${opportunity.title}, ${opportunity.organization}, ${opportunity.type}, scholarship, job, funding, education, application, tier 1 countries`}
          type={opportunity.type === 'scholarship' ? 'article' : 'article'}
          structuredData={getStructuredData()}
        />
      )}
      <Navbar />
      <div className="pt-36 pb-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {opportunity && (
            <Breadcrumb 
              items={generateBreadcrumbs(location.pathname, opportunity.title)} 
            />
          )}
          
          {/* Top In-Feed Ad */}
          <div className="mb-8">
            <AdSenseAd variant="in-feed" />
          </div>
          
          <div className="flex gap-8">
            {/* Main Content */}
            <div className="flex-1 min-w-0">
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
                <>
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
                      
                      {/* In-Feed Ad Before Description */}
                      <div className="my-6">
                        <AdSenseAd variant="in-feed" />
                      </div>
                      
                      <div className="prose max-w-none mb-8">
                        <h2 className="text-xl font-semibold mb-4">{t('opportunityDetails.description')}</h2>
                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{opportunity.description}</p>
                      </div>
                      
                      {/* In-Feed Ad After Description */}
                      <div className="my-6">
                        <AdSenseAd variant="in-feed" />
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
                  
                  {/* In-Feed Ad After Main Content */}
                  <div className="my-8">
                    <AdSenseAd variant="in-feed" />
                  </div>
                  
                  {/* Related Opportunities Section */}
                  <div className="mt-12">
                    <RelatedOpportunities 
                      currentOpportunityId={opportunity.id}
                      type={opportunity.type}
                      organization={opportunity.organization}
                    />
                  </div>
                  
                  {/* In-Feed Ad Before FAQ */}
                  <div className="my-8">
                    <AdSenseAd variant="in-feed" />
                  </div>
                  
                  {/* FAQ Section */}
                  <div className="mt-16">
                    <FAQSection 
                      title="Frequently Asked Questions"
                      faqs={opportunity?.type === 'scholarship' ? SCHOLARSHIP_FAQS.slice(0, 5) : JOB_FAQS.slice(0, 5)}
                    />
                  </div>
                </>
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
            
            {/* Sticky Sidebar - Desktop Only */}
            <StickySidebar className="w-80 flex-shrink-0" />
          </div>
        </div>
      </div>
      
      {/* Mobile Sticky Footer Ad */}
      <MobileStickyAd />
    </div>
  );
};

export default OpportunityDetails;
