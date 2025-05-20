
import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';
import OpportunityCard from '../components/OpportunityCard';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

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

const levelKeywords: Record<string, string[]> = {
  'undergraduate': ['undergraduate', 'bachelor', 'bachelors', 'bachelor\'s'],
  'masters': ['masters', 'master', 'master\'s', 'postgraduate', 'post-graduate', 'msc', 'ma', 'mba'],
  'phd': ['phd', 'doctorate', 'doctoral', 'doctor of philosophy']
};

const ScholarshipsByLevel = () => {
  const { level } = useParams<{ level: string }>();
  const [visibleCount, setVisibleCount] = useState(9);
  const navigate = useNavigate();
  
  // Validate level parameter
  useEffect(() => {
    if (level && !levelKeywords[level.toLowerCase()]) {
      navigate('/scholarships', { replace: true });
      toast.error(`Invalid level filter: ${level}`);
    }
  }, [level, navigate]);
  
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
      console.log("Current level param:", level);
      
      if (!data || data.length === 0) {
        return [];
      }
      
      // Filter by level if specified
      if (level && levelKeywords[level.toLowerCase()]) {
        const keywords = levelKeywords[level.toLowerCase()];
        console.log("Filtering by keywords:", keywords);
        
        const filtered = (data as Opportunity[]).filter(scholarship => {
          const descLower = scholarship.description?.toLowerCase() || '';
          const titleLower = scholarship.title?.toLowerCase() || '';
          
          return keywords.some(keyword => 
            descLower.includes(keyword) || titleLower.includes(keyword)
          );
        });
        
        console.log(`Filtered to ${filtered.length} scholarships for ${level} level`);
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
    queryKey: ['scholarships-by-level', level],
    queryFn: fetchScholarships,
  });

  const loadMore = () => {
    setVisibleCount(prev => prev + 6);
  };

  const formatLevel = (level: string | undefined) => {
    if (!level) return 'All Levels';
    if (level.toLowerCase() === 'undergraduate') return 'Undergraduate';
    if (level.toLowerCase() === 'masters') return 'Master\'s';
    if (level.toLowerCase() === 'phd') return 'PhD';
    return level;
  };

  const levelTitle = formatLevel(level);

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
              {levelTitle} Scholarships
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Discover {levelTitle.toLowerCase()} scholarship opportunities from around the world.
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
                  <p className="text-lg text-gray-500">No {levelTitle.toLowerCase()} scholarships found. Please check back later.</p>
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
