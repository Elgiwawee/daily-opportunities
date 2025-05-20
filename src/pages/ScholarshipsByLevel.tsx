
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/Layout';
import OpportunityCard from '@/components/OpportunityCard';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

const ScholarshipsByLevel = () => {
  const { level } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [limit, setLimit] = useState(9);

  // Fix TypeScript error by explicitly defining types
  const { data: scholarships, isLoading, error } = useQuery<any[], Error>({
    queryKey: ['scholarshipsByLevel', level, limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('opportunities')
        .select('*')
        .eq('type', 'scholarship')
        .eq('level', level)
        .limit(limit);
        
      if (error) throw error;
      return data || [];
    }
  });

  const handleScholarshipClick = (scholarship: any) => {
    navigate(`/opportunity/${scholarship.id}`);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">{t('levels.' + level)}</h1>
        <p className="text-gray-600 mb-8">{t('scholarships.subtitle')}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            <>
              {[...Array(limit)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-48 w-full bg-gray-200 animate-pulse rounded-md"></div>
                  <div className="h-4 w-3/4 bg-gray-200 animate-pulse rounded-md"></div>
                  <div className="h-4 w-1/2 bg-gray-200 animate-pulse rounded-md"></div>
                  <div className="h-4 w-5/6 bg-gray-200 animate-pulse rounded-md"></div>
                </div>
              ))}
            </>
          ) : scholarships && scholarships.length > 0 ? (
            scholarships.map((scholarship) => (
              <OpportunityCard
                key={scholarship.id}
                opportunity={scholarship}
                onClick={handleScholarshipClick}
              />
            ))
          ) : (
            <div className="col-span-3 text-center py-12">
              <p className="text-xl text-gray-500">
                {t('scholarships.emptyLevel', { level })}
              </p>
            </div>
          )}
        </div>
        
        {scholarships && scholarships.length > 0 && limit < 30 && (
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

export default ScholarshipsByLevel;
