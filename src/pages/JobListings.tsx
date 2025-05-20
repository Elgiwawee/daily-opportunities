
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import Layout from '../components/Layout';
import OpportunityCard from '../components/OpportunityCard';

const JobListings = () => {
  const navigate = useNavigate();
  const [limit, setLimit] = useState(9);
  const { t } = useTranslation();

  const { data: jobs, isLoading, error } = useQuery<any[], Error>({
    queryKey: ['jobs', limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('opportunities')
        .select('*')
        .eq('type', 'job')
        .order('created_at', { ascending: false })
        .limit(limit);
        
      if (error) throw error;
      return data || [];
    }
  });

  const handleJobClick = (job: any) => {
    navigate(`/opportunity/${job.id}`);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">{t('jobs.title')}</h1>
        <p className="text-gray-600 mb-8">{t('jobs.subtitle')}</p>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(limit)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-48 w-full bg-gray-200 animate-pulse rounded-md"></div>
                <div className="h-4 w-3/4 bg-gray-200 animate-pulse rounded-md"></div>
                <div className="h-4 w-1/2 bg-gray-200 animate-pulse rounded-md"></div>
                <div className="h-4 w-5/6 bg-gray-200 animate-pulse rounded-md"></div>
              </div>
            ))}
          </div>
        ) : jobs && jobs.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map((job) => (
                <OpportunityCard
                  key={job.id}
                  opportunity={job}
                  onClick={handleJobClick}
                />
              ))}
            </div>
            <div className="mt-8 flex justify-center">
              <Button onClick={() => setLimit(prev => prev + 9)} className="px-6">
                {t('jobs.loadMore')}
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-gray-500">{t('jobs.empty')}</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default JobListings;
