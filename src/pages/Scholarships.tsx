
import { useState } from 'react';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';
import OpportunityCard from '../components/OpportunityCard';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import RegionFilter from '../components/RegionFilter';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import AdSenseAd from '../components/AdSenseAd';
import MobileStickyAd from '../components/MobileStickyAd';
import WhatsAppGroups from '../components/WhatsAppGroups';
import StickySidebar from '../components/StickySidebar';
import { Breadcrumb } from '../components/Breadcrumb';
import { BREADCRUMB_CONFIGS } from '../utils/breadcrumbUtils';
import { SEOHead } from '../components/SEOHead';
import { generateWebsiteSchema } from '../utils/structuredData';

interface Opportunity {
  id: string;
  title: string;
  organization: string;
  deadline: string;
  type: 'scholarship' | 'job';
  description: string;
  attachments: any[];
  created_at: string;
}

const Scholarships = () => {
  const { t } = useTranslation();
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(9);

  const fetchScholarships = async () => {
    let query = supabase
      .from('opportunities')
      .select('*')
      .eq('type', 'scholarship')
      .order('created_at', { ascending: false });
    
    const { data, error } = await query;
    
    if (error) {
      toast.error("Error loading scholarships. Please try again later.");
      throw error;
    }
    
    // Filter by region if a region is selected
    // Since we can't filter by region in the database, we'll do it client-side
    if (selectedRegion) {
      return (data as Opportunity[]).filter(scholarship => 
        scholarship.description.toLowerCase().includes(selectedRegion.toLowerCase()) ||
        scholarship.title.toLowerCase().includes(selectedRegion.toLowerCase())
      );
    }
    
    return data as Opportunity[];
  };

  const { data: scholarships = [], isLoading, error } = useQuery({
    queryKey: ['scholarships', selectedRegion],
    queryFn: fetchScholarships,
  });

  const loadMore = () => {
    setVisibleCount(prev => prev + 6);
  };

  return (
    <div className="min-h-screen bg-white pb-16 md:pb-0">
      <SEOHead
        title="Scholarships - Daily Opportunities | Fully Funded Education"
        description="Discover fully-funded scholarships and grants from top universities in USA, UK, Canada, Australia, Europe. Free applications for international students from tier 1 countries."
        keywords="scholarships, fully funded scholarships, international students, USA scholarships, UK scholarships, Canadian scholarships, education funding, tier 1 countries"
        structuredData={generateWebsiteSchema()}
      />
      <Navbar />
      <div className="pt-36 pb-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={BREADCRUMB_CONFIGS.scholarships} />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 text-center"
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{t('scholarships.title')}</h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {t('scholarships.subtitle')}
            </p>
          </motion.div>
          
          {/* Top In-Feed Ad */}
          <div className="mb-8">
            <AdSenseAd variant="in-feed" />
          </div>

          <div className="flex gap-8">
            {/* Main Content */}
            <div className="flex-1 min-w-0">
              <RegionFilter
                selectedRegion={selectedRegion}
                setSelectedRegion={setSelectedRegion}
              />

              <WhatsAppGroups />
              
              {/* In-Feed Ad After WhatsApp */}
              <div className="my-6">
                <AdSenseAd variant="in-feed" />
              </div>

              {isLoading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-olive-600"></div>
                </div>
              ) : error ? (
                <div className="text-center py-12 text-red-500">
                  Error loading scholarships. Please try again later.
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                    {scholarships.slice(0, visibleCount).map((scholarship, index) => (
                      <div key={scholarship.id} className="col-span-1">
                        <OpportunityCard {...scholarship} />
                        {/* In-Feed Ad after every 4 items */}
                        {(index + 1) % 4 === 0 && (
                          <div className="mt-6">
                            <AdSenseAd variant="in-feed" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  {/* In-Feed Ad After Grid */}
                  <div className="my-8">
                    <AdSenseAd variant="in-feed" />
                  </div>

                  {scholarships.length > visibleCount && (
                    <div className="flex justify-center mt-10">
                      <Button 
                        onClick={loadMore}
                        variant="outline"
                        className="border border-olive-600 text-olive-700 hover:bg-olive-50"
                      >
                        {t('scholarships.loadMore')}
                      </Button>
                    </div>
                  )}

                  {scholarships.length === 0 && (
                    <div className="text-center py-12">
                      <p className="text-lg text-gray-500">{t('scholarships.empty')}</p>
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
      
      {/* Mobile Sticky Footer Ad */}
      <MobileStickyAd />
    </div>
  );
};

export default Scholarships;
