import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';
import { generateOpportunityUrl } from '@/utils/slugUtils';
import { GraduationCap, ChevronRight, TrendingUp } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface Opportunity {
  id: string;
  title: string;
  organization: string;
  type: 'scholarship' | 'job';
  deadline: string | null;
}

const PopularScholarships = () => {
  const { data: scholarships = [], isLoading } = useQuery({
    queryKey: ['popular-scholarships'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('opportunities')
        .select('id, title, organization, type, deadline')
        .eq('type', 'scholarship')
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      return data as Opportunity[];
    },
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex items-center gap-2 mb-4">
          <Skeleton className="h-5 w-5" />
          <Skeleton className="h-5 w-32" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map(i => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3">
        <div className="flex items-center gap-2 text-white">
          <TrendingUp className="h-4 w-4" />
          <span className="font-semibold text-sm">Popular Scholarships</span>
        </div>
      </div>
      <div className="p-3 space-y-1">
        {scholarships.map((scholarship) => (
          <Link
            key={scholarship.id}
            to={generateOpportunityUrl(scholarship.id, scholarship.title)}
            className="group flex items-start gap-3 p-2 rounded-lg hover:bg-background transition-colors"
          >
            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center mt-0.5">
              <GraduationCap className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                {scholarship.title}
              </h4>
              <p className="text-xs text-muted-foreground mt-0.5 truncate">
                {scholarship.organization}
              </p>
            </div>
            <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-primary flex-shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
        ))}
      </div>
      <div className="px-3 pb-3">
        <Link
          to="/scholarships"
          className="block text-center text-sm text-primary hover:text-primary font-medium py-2 bg-primary/10 hover:bg-primary/10 rounded-lg transition-colors"
        >
          View All Scholarships
        </Link>
      </div>
    </div>
  );
};

export default PopularScholarships;
