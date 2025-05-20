
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/Layout';
import OpportunityCard from '@/components/OpportunityCard';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { Skeleton } from '@/components/ui/skeleton';

const ScholarshipsByLevel = () => {
  const { level } = useParams<{ level: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [limit, setLimit] = useState(9);

  const levelTitle = level ? {
    undergraduate: 'Undergraduate',
    masters: 'Master\'s',
    phd: 'PhD',
  }[level] || level : '';

  // Fixed using the proper object format for useQuery
  const { data, isLoading } = useQuery({
    queryKey: ['scholarships', 'level', level, limit],
    queryFn: async () => {
      const { data, error, count } = await supabase
        .from('opportunities')
        .select('*', { count: 'exact' })
        .eq('type', 'scholarship')
        .eq('level', level)
        .order('created_at', { ascending: false })
        .range(0, limit - 1);

      if (error) {
        throw new Error(error.message);
      }

      return { data, count };
    }
  });

  const totalCount = data?.count || 0;
  const scholarships = data?.data || [];

  const handleScholarshipClick = (scholarship: any) => {
    navigate(`/opportunity/${scholarship.id}`);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">{levelTitle} {t('scholarships.title')}</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {t('scholarships.subtitle')} - {t(`levels.${level}`)}
        </p>

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
          ) : scholarships.length > 0 ? (
            scholarships.map(scholarship => (
              <OpportunityCard
                key={scholarship.id}
                opportunity={scholarship}
                onClick={handleScholarshipClick}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-lg text-gray-500 dark:text-gray-400">
                {t('scholarships.emptyLevel', { level: levelTitle.toLowerCase() })}
              </p>
            </div>
          )}
        </div>
        
        {/* Load more button */}
        {!isLoading && scholarships.length > 0 && totalCount > limit && (
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
