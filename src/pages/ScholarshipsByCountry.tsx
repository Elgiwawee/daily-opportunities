import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/Layout';
import OpportunityCard from '@/components/OpportunityCard';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslation } from 'react-i18next';

const ScholarshipsByCountry = () => {
  const { country } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [limit, setLimit] = useState(9);
  const [scholarships, setScholarships] = useState([]);
  const [totalCount, setTotalCount] = useState(0);

  const countryName =
    country === 'usa'
      ? 'USA'
      : country === 'uk'
      ? 'UK'
      : country === 'canada'
      ? 'Canada'
      : country === 'australia'
      ? 'Australia'
      : country === 'germany'
      ? 'Germany'
      : 'Unknown Country';

  const countryFlag =
    country === 'usa'
      ? 'https://flagcdn.com/w320/us.png'
      : country === 'uk'
      ? 'https://flagcdn.com/w320/gb.png'
      : country === 'canada'
      ? 'https://flagcdn.com/w320/ca.png'
      : country === 'australia'
      ? 'https://flagcdn.com/w320/au.png'
      : country === 'germany'
      ? 'https://flagcdn.com/w320/de.png'
      : null;

  const fetchScholarships = async () => {
    const { data, error, count } = await supabase
      .from('opportunities')
      .select('*', { count: 'exact' })
      .eq('type', 'scholarship')
      .eq('region', country)
      .range(0, limit - 1)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching scholarships:', error);
      return;
    }

    setScholarships(data || []);
    setTotalCount(count || 0);
  };

  const { isLoading, isError } = useQuery(
    ['scholarships', country, limit],
    fetchScholarships
  );

  useEffect(() => {
    fetchScholarships();
  }, [country, limit]);

  const handleScholarshipClick = (scholarship) => {
    navigate(`/opportunity/${scholarship.id}`);
  };

  const filteredScholarships = scholarships.filter((scholarship) =>
    scholarship.type === 'scholarship'
  );

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {countryName} {t('scholarships.title')}
            </h1>
            <p className="text-gray-600">
              {t('scholarships.subtitle')}
            </p>
          </div>
          
          {/* Add country flag if available */}
          {countryFlag && (
            <div className="hidden md:block">
              <img 
                src={countryFlag} 
                alt={`${countryName} flag`} 
                className="h-16 w-auto shadow-sm rounded"
              />
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {/* Country switcher buttons */}
          <Button 
            variant={country === 'usa' ? 'default' : 'outline'} 
            onClick={() => navigate('/scholarships/country/usa')}
            className="text-sm"
          >
            USA
          </Button>
          <Button 
            variant={country === 'uk' ? 'default' : 'outline'} 
            onClick={() => navigate('/scholarships/country/uk')}
            className="text-sm"
          >
            UK
          </Button>
          <Button 
            variant={country === 'canada' ? 'default' : 'outline'} 
            onClick={() => navigate('/scholarships/country/canada')}
            className="text-sm"
          >
            Canada
          </Button>
          <Button 
            variant={country === 'australia' ? 'default' : 'outline'} 
            onClick={() => navigate('/scholarships/country/australia')}
            className="text-sm"
          >
            Australia
          </Button>
          <Button 
            variant={country === 'germany' ? 'default' : 'outline'} 
            onClick={() => navigate('/scholarships/country/germany')}
            className="text-sm"
          >
            Germany
          </Button>
          <Button 
            variant="outline" 
            onClick={() => navigate('/scholarships')}
            className="text-sm"
          >
            All Countries
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {isLoading ? (
            <>
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-4/6" />
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
              <p className="text-lg text-gray-500">
                {t('scholarships.empty')}
              </p>
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

export default ScholarshipsByCountry;
