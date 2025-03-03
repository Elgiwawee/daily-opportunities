
import { useState } from 'react';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';
import OpportunityCard from '../components/OpportunityCard';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import RegionFilter from '../components/RegionFilter';
import { toast } from 'sonner';

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
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="pt-36 pb-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 text-center"
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Scholarships</h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Discover scholarship opportunities from around the world to fund your education.
            </p>
          </motion.div>

          <RegionFilter
            selectedRegion={selectedRegion}
            setSelectedRegion={setSelectedRegion}
          />

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
                  <p className="text-lg text-gray-500">No scholarships found for this region. Please try another region.</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Scholarships;
