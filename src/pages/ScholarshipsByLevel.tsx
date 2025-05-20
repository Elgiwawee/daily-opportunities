
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/Layout';
import OpportunityCard from '@/components/OpportunityCard';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslation } from 'react-i18next';

const ScholarshipsByLevel = () => {
  const { level: educationLevel } = useParams<{level: string}>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [limit, setLimit] = useState(9);
  const [scholarships, setScholarships] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);

  const levelName =
    educationLevel === 'undergraduate'
      ? t('scholarships.level.undergraduate')
      : educationLevel === 'masters'
      ? t('scholarships.level.masters')
      : educationLevel === 'phd'
      ? t('scholarships.level.phd')
      : educationLevel === 'postdoc'
      ? t('scholarships.level.postdoc')
      : '';

  const { isLoading, error } = useQuery({
    queryKey: ['scholarshipsByLevel', educationLevel, limit],
    queryFn: async () => {
      if (!educationLevel) return [];
      
      const { data, error, count } = await supabase
        .from('opportunities')
        .select('*', { count: 'exact' })
        .eq('type', 'scholarship')
        .eq('level', educationLevel)
        .range(0, limit - 1)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      setScholarships(data || []);
      setTotalCount(count || 0);
      return data;
    }
  });

  useEffect(() => {
    if (educationLevel) {
      setLimit(9); // Reset limit when the level changes
    }
  }, [educationLevel]);

  const handleScholarshipClick = (scholarship: any) => {
    navigate(`/opportunity/${scholarship.id}`);
  };

  if (error) {
    return <div className="text-red-500">Error: {(error as Error).message}</div>;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">
          {levelName} {t('scholarships.title')}
        </h1>
        <p className="text-gray-600 mb-6">
          {t('scholarships.subtitle')}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-6">
          {/* Level switcher buttons */}
          <Button 
            variant={educationLevel === 'undergraduate' ? 'default' : 'outline'} 
            onClick={() => navigate('/scholarships/level/undergraduate')}
            className="text-sm"
          >
            Undergraduate
          </Button>
          <Button 
            variant={educationLevel === 'masters' ? 'default' : 'outline'} 
            onClick={() => navigate('/scholarships/level/masters')}
            className="text-sm"
          >
            Master's
          </Button>
          <Button 
            variant={educationLevel === 'phd' ? 'default' : 'outline'} 
            onClick={() => navigate('/scholarships/level/phd')}
            className="text-sm"
          >
            PhD
          </Button>
          <Button 
            variant={educationLevel === 'postdoc' ? 'default' : 'outline'} 
            onClick={() => navigate('/scholarships/level/postdoc')}
            className="text-sm"
          >
            Post-Doctoral
          </Button>
          <Button 
            variant="outline" 
            onClick={() => navigate('/scholarships')}
            className="text-sm"
          >
            All Levels
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            <>
              {[...Array(limit)].map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-1/2" />
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
              <p className="text-lg text-gray-500">
                {t('scholarships.empty')}
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
