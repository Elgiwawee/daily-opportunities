
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import OpportunityCard from '../components/OpportunityCard';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import Layout from '../components/Layout';

const ScholarshipsByLevel: React.FC = () => {
  const { level } = useParams<{ level: string }>();
  const { t } = useTranslation();
  const [limit, setLimit] = useState(9);

  const { isLoading, error, data: scholarships } = useQuery({
    queryKey: ['scholarships-by-level', level, limit],
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

  if (error) {
    return <div>Error loading scholarships</div>;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">
          {t('scholarships.title')} - {t(`levels.${level || 'undergraduate'}`)}
        </h1>
        <p className="text-gray-600 mb-8">{t('scholarships.subtitle')}</p>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(limit)].map((_, i) => (
              <div key={i} className="bg-gray-100 h-64 rounded-lg animate-pulse"></div>
            ))}
          </div>
        ) : scholarships && scholarships.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {scholarships.map((scholarship) => (
                <OpportunityCard
                  key={scholarship.id}
                  opportunity={scholarship}
                  onClick={() => window.location.href = `/opportunity/${scholarship.id}`}
                />
              ))}
            </div>
            <div className="mt-8 flex justify-center">
              <Button onClick={() => setLimit(prev => prev + 9)} className="px-6">
                {t('scholarships.loadMore')}
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-gray-500">
              {t('scholarships.emptyLevel', { level: level })}
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ScholarshipsByLevel;
