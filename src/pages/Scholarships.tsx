
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/Layout';
import OpportunityCard from '@/components/OpportunityCard';
import { Button } from '@/components/ui/button';
import RegionFilter from '@/components/RegionFilter';
import { useTranslation } from 'react-i18next';
import { Skeleton } from '@/components/ui/skeleton';

const Scholarships = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [limit, setLimit] = useState(9);
  const [activeRegion, setActiveRegion] = useState<string | null>(null);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['scholarships', limit, activeRegion],
    queryFn: async () => {
      let query = supabase
        .from('opportunities')
        .select('*, country(name, flag)', { count: 'exact' })
        .eq('type', 'scholarship')
        .order('created_at', { ascending: false })
        .range(0, limit - 1);

      if (activeRegion) {
        query = query.eq('region', activeRegion);
      }

      const { data, error, count } = await query;

      if (error) {
        throw new Error(error.message);
      }

      return { data, count };
    }
  });

  const totalCount = data?.count || 0;
  const filteredScholarships = data?.data || [];

  const handleScholarshipClick = (scholarship: any) => {
    navigate(`/opportunity/${scholarship.id}`);
  };

  const handleRegionChange = (region: string | null) => {
    setActiveRegion(region);
    setLimit(9); // Reset limit when region changes
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">{t('scholarships.title')}</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">{t('scholarships.subtitle')}</p>
        
        <RegionFilter onRegionChange={handleRegionChange} activeRegion={activeRegion} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {isLoading ? (
            <>
              {[...Array(9)].map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-4/6" />
                  <Skeleton className="h-4 w-2/6" />
                </div>
              ))}
            </>
          ) : filteredScholarships.length > 0 ? (
            filteredScholarships.map(scholarship => (
              <OpportunityCard
                key={scholarship.id}
                opportunity={scholarship}
                onClick={handleScholarshipClick}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-lg text-gray-500 dark:text-gray-400">{t('scholarships.empty')}</p>
            </div>
          )}
        </div>
        
        {/* Load more button */}
        {!isLoading && filteredScholarships.length > 0 && totalCount > limit && (
          <div className="mt-8 flex justify-center">
            <Button onClick={() => setLimit(prev => prev + 9)} className="px-6">
              {t('scholarships.loadMore')}
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Scholarships;
