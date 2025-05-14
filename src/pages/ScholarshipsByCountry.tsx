
import { useState } from 'react';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';
import OpportunityCard from '../components/OpportunityCard';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { Tables } from '@/integrations/supabase/types';

interface Opportunity extends Tables<'opportunities'> {
  id: string;
  title: string;
  organization: string;
  deadline: string;
  type: 'scholarship' | 'job';
  description: string;
  attachments: any[];
  created_at: string;
}

const countryMapping: Record<string, string> = {
  'usa': 'United States',
  'uk': 'United Kingdom',
  'canada': 'Canada',
  'australia': 'Australia',
  'germany': 'Germany',
  'france': 'France',
  'japan': 'Japan',
  'china': 'China',
  'india': 'India',
  'nigeria': 'Nigeria',
};

const ScholarshipsByCountry = () => {
  const { country } = useParams<{ country: string }>();
  const [visibleCount, setVisibleCount] = useState(9);
  
  const countryName = country ? countryMapping[country.toLowerCase()] || country : '';

  // We can't filter by country in the database because the column doesn't exist
  // So we'll fetch all scholarships and filter them in the frontend
  const fetchScholarships = async () => {
    const { data, error } = await supabase
      .from('opportunities')
      .select('*')
      .eq('type', 'scholarship')
      .order('created_at', { ascending: false });
    
    if (error) {
      toast.error("Error loading scholarships. Please try again later.");
      throw error;
    }
    
    // Since we can't filter by country in the database, we need to check
    // if the description or title contains the country name
    if (countryName) {
      return (data as Opportunity[]).filter(scholarship => 
        scholarship.description.toLowerCase().includes(countryName.toLowerCase()) ||
        scholarship.title.toLowerCase().includes(countryName.toLowerCase())
      );
    }
    
    return data as Opportunity[];
  };

  const { data: scholarships = [], isLoading, error } = useQuery({
    queryKey: ['scholarships-by-country', country],
    queryFn: fetchScholarships,
  });

  const loadMore = () => {
    setVisibleCount(prev => prev + 6);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="pt-36 pb-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 text-center"
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Scholarships in {countryName || 'Selected Country'}
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Discover scholarship opportunities available in {countryName || 'this country'}.
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
                  <p className="text-lg text-gray-500">No scholarships found for {countryName}. Please check back later.</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScholarshipsByCountry;
