
import { useState } from 'react';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';
import OpportunityCard from '../components/OpportunityCard';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import RegionFilter from '../components/RegionFilter';
import { toast } from 'sonner';
import DonationButton from '../components/DonationButton';
import { useTranslation } from 'react-i18next';
import AdSenseAd from '../components/AdSenseAd';
import WhatsAppGroups from '../components/WhatsAppGroups';
import StickySidebar from '../components/StickySidebar';
import { Breadcrumb } from '../components/Breadcrumb';
import { BREADCRUMB_CONFIGS } from '../utils/breadcrumbUtils';
import { SEOHead } from '../components/SEOHead';
import { generateWebsiteSchema } from '../utils/structuredData';

interface Job {
  id: string;
  title: string;
  organization: string;
  deadline: string | null;
  type: 'job';
  description: string;
  attachments: any[] | null;
  created_at: string;
}

const JobListings = () => {
  const { t } = useTranslation();
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(9);

  const fetchJobs = async () => {
    try {
      const { data, error } = await supabase
        .from('opportunities')
        .select('*')
        .eq('type', 'job')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error("Database error:", error);
        toast.error("Error loading jobs. Please try again later.");
        throw error;
      }
      
      // For debugging
      console.log("Fetched jobs:", data?.length || 0);
      
      if (!data || data.length === 0) {
        return [];
      }
      
      // Filter by region if selected
      if (selectedRegion) {
        return (data as Job[]).filter(job => 
          (job.description?.toLowerCase() || '').includes(selectedRegion.toLowerCase()) ||
          (job.title?.toLowerCase() || '').includes(selectedRegion.toLowerCase())
        );
      }
      
      return data as Job[];
    } catch (error) {
      console.error("Error fetching jobs:", error);
      toast.error("Failed to load jobs");
      return [];
    }
  };

  const { data: jobs = [], isLoading, error } = useQuery({
    queryKey: ['jobs', selectedRegion],
    queryFn: fetchJobs,
  });

  const loadMore = () => {
    setVisibleCount(prev => prev + 6);
  };

  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="Jobs - Daily Opportunities | International Career Opportunities"
        description="Explore international job opportunities and career positions from leading companies in tier 1 countries. Apply for jobs in USA, UK, Canada, Australia, Europe."
        keywords="international jobs, career opportunities, jobs abroad, employment, tier 1 countries, USA jobs, UK jobs, Canadian jobs, professional careers"
        structuredData={generateWebsiteSchema()}
      />
      <Navbar />
      <div className="pt-36 pb-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={BREADCRUMB_CONFIGS.jobs} />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 text-center"
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{t('jobs.title')}</h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {t('jobs.subtitle')}
            </p>
            <div className="mt-6">
              <DonationButton size="lg" />
            </div>
          </motion.div>

          <div className="flex gap-8">
            {/* Main Content */}
            <div className="flex-1 min-w-0">
              <RegionFilter
                selectedRegion={selectedRegion}
                setSelectedRegion={setSelectedRegion}
              />

              <WhatsAppGroups />

              {isLoading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-olive-600"></div>
                </div>
              ) : error ? (
                <div className="text-center py-12 text-red-500">
                  Error loading jobs. Please try again later.
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                    {jobs.slice(0, visibleCount).map((job, index) => (
                      <div key={job.id} className="col-span-1">
                        <OpportunityCard {...job} />
                        {(index + 1) % 4 === 0 && (
                          <div className="mt-6">
                            <AdSenseAd variant="in-article" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  <AdSenseAd variant="multiplex" className="mt-8" />

                  {jobs.length > visibleCount && (
                    <div className="flex justify-center mt-10">
                      <Button 
                        onClick={loadMore}
                        variant="outline"
                        className="border border-olive-600 text-olive-700 hover:bg-olive-50"
                      >
                        {t('jobs.loadMore')}
                      </Button>
                    </div>
                  )}

                  {jobs.length === 0 && (
                    <div className="text-center py-12">
                      <p className="text-lg text-gray-500">{t('jobs.empty')}</p>
                    </div>
                  )}
                </>
              )}
            </div>
            
            {/* Sticky Sidebar - Desktop Only */}
            <StickySidebar className="w-80 flex-shrink-0" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobListings;
