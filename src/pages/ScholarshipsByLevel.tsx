
import { useState } from 'react';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';
import OpportunityCard from '../components/OpportunityCard';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useParams } from 'react-router-dom';

interface Opportunity {
  id: string;
  title: string;
  organization: string;
  deadline: string;
  type: 'scholarship' | 'job';
  description: string;
  attachments: any[];
  level?: string;
  created_at: string;
}

const levelMapping: Record<string, string> = {
  'bachelors': 'Bachelors',
  'undergraduate': 'Undergraduate',
  'masters': 'Masters',
  'phd': 'PhD',
  'postgraduate': 'Postgraduate',
  'research': 'Research',
};

const ScholarshipsByLevel = () => {
  const { level } = useParams<{ level: string }>();
  const [visibleCount, setVisibleCount] = useState(9);
  
  const educationLevel = level ? levelMapping[level.toLowerCase()] || level : '';

  const fetchScholarships = async () => {
    const { data, error } = await supabase
      .from('opportunities')
      .select('*')
      .eq('type', 'scholarship')
      .eq('level', educationLevel)
      .order('created_at', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    return data as Opportunity[];
  };

  const { data: scholarships = [], isLoading, error } = useQuery({
    queryKey: ['scholarships-by-level', level],
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
              {educationLevel || 'Selected Level'} Scholarships
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Discover scholarship opportunities available for {educationLevel || 'this level'} students.
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
                  <p className="text-lg text-gray-500">No scholarships found for {educationLevel} level. Please check back later.</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScholarshipsByLevel;
