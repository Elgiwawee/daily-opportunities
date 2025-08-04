
import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';
import OpportunityCard from '../components/OpportunityCard';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import AdSenseAd from '../components/AdSenseAd';

interface Opportunity {
  id: string;
  title: string;
  organization: string;
  deadline: string | null;
  type: 'scholarship' | 'job';
  description: string;
  attachments: any[] | null;
  created_at: string;
}

const countryKeywords: Record<string, string[]> = {
  'usa': ['usa', 'united states', 'america', 'american', 'u.s.', 'u.s.a.'],
  'uk': ['uk', 'united kingdom', 'britain', 'british', 'england', 'scotland', 'wales'],
  'canada': ['canada', 'canadian']
};

const ScholarshipsByCountry = () => {
  const { country } = useParams<{ country: string }>();
  const [visibleCount, setVisibleCount] = useState(9);
  const navigate = useNavigate();
  
  // Validate country parameter
  useEffect(() => {
    if (country && !countryKeywords[country.toLowerCase()]) {
      navigate('/scholarships', { replace: true });
      toast.error(`Invalid country filter: ${country}`);
    }
  }, [country, navigate]);
  
  const fetchScholarships = async () => {
    try {
      const { data, error } = await supabase
        .from('opportunities')
        .select('*')
        .eq('type', 'scholarship')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error("Database error:", error);
        toast.error("Error loading scholarships. Please try again later.");
        throw error;
      }
      
      // For debugging
      console.log("Fetched scholarships:", data?.length || 0);
      console.log("Current country param:", country);
      
      if (!data || data.length === 0) {
        return [];
      }
      
      // Filter by country if specified
      if (country && countryKeywords[country.toLowerCase()]) {
        const keywords = countryKeywords[country.toLowerCase()];
        console.log("Filtering by country keywords:", keywords);
        
        const filtered = (data as Opportunity[]).filter(scholarship => {
          const descLower = scholarship.description?.toLowerCase() || '';
          const titleLower = scholarship.title?.toLowerCase() || '';
          const orgLower = scholarship.organization?.toLowerCase() || '';
          
          return keywords.some(keyword => 
            descLower.includes(keyword) || 
            titleLower.includes(keyword) ||
            orgLower.includes(keyword)
          );
        });
        
        console.log(`Filtered to ${filtered.length} scholarships for ${country}`);
        return filtered;
      }
      
      return data as Opportunity[];
    } catch (error) {
      console.error("Error fetching scholarships:", error);
      toast.error("Failed to load scholarships");
      return [];
    }
  };

  const { data: scholarships = [], isLoading, error } = useQuery({
    queryKey: ['scholarships-by-country', country],
    queryFn: fetchScholarships,
  });

  const loadMore = () => {
    setVisibleCount(prev => prev + 6);
  };

  const formatCountry = (country: string | undefined) => {
    if (!country) return 'All Countries';
    if (country.toLowerCase() === 'usa') return 'USA';
    if (country.toLowerCase() === 'uk') return 'UK';
    if (country.toLowerCase() === 'canada') return 'Canada';
    return country;
  };

  const countryTitle = formatCountry(country);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="pt-36 pb-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AdSenseAd />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 text-center"
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Scholarships in {countryTitle}
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Discover scholarship opportunities in {countryTitle}.
            </p>
          </motion.div>

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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
                {scholarships.slice(0, visibleCount).map((scholarship) => (
                  <OpportunityCard
                    key={scholarship.id}
                    {...scholarship}
                  />
                ))}
              </div>

              {scholarships.length > visibleCount && (
                <div className="flex justify-center mt-10">
                  <Button 
                    onClick={loadMore}
                    variant="outline"
                    className="border border-olive-600 text-olive-700 hover:bg-olive-50"
                  >
                    Load More Scholarships
                  </Button>
                </div>
              )}

              {scholarships.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-lg text-gray-500">No scholarships found for {countryTitle}. Please check back later.</p>
                </div>
              )}
              <AdSenseAd />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScholarshipsByCountry;
