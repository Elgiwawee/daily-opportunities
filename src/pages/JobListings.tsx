
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/Layout';
import OpportunityCard from '@/components/OpportunityCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useTranslation } from 'react-i18next';
import { Skeleton } from '@/components/ui/skeleton';

const JobListings = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [industryFilter, setIndustryFilter] = useState('all');
  const [sortOption, setSortOption] = useState('newest');
  const [limit, setLimit] = useState(9);
  const navigate = useNavigate();

  const { data, isLoading, error } = useQuery({
    queryKey: ['jobs', searchTerm, industryFilter, sortOption, limit],
    queryFn: async () => {
      let query = supabase
        .from('opportunities')
        .select('*', { count: 'exact' })
        .eq('type', 'job')
        .ilike('title', `%${searchTerm}%`)
        .range(0, limit - 1);

      if (industryFilter !== 'all') {
        query = query.eq('industry', industryFilter);
      }

      if (sortOption === 'newest') {
        query = query.order('created_at', { ascending: false });
      } else if (sortOption === 'oldest') {
        query = query.order('created_at', { ascending: true });
      } else if (sortOption === 'deadline') {
        query = query.order('deadline', { ascending: true });
      }

      const { data, error, count } = await query;

      if (error) {
        throw new Error(error.message);
      }

      return { data, count };
    }
  });

  const filteredJobs = data?.data || [];
  const totalCount = data?.count || 0;

  const handleJobClick = (job: any) => {
    navigate(`/opportunity/${job.id}`);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">{t('jobs.title')}</h1>
        <p className="text-gray-600 mb-6">{t('jobs.subtitle')}</p>
        
        {/* Search and filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="relative">
            <Input
              type="search"
              placeholder={t('buttons.search')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
          
          <Select value={industryFilter} onValueChange={setIndustryFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by industry" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">All Industries</SelectItem>
                <SelectItem value="technology">Technology</SelectItem>
                <SelectItem value="healthcare">Healthcare</SelectItem>
                <SelectItem value="education">Education</SelectItem>
                <SelectItem value="finance">Finance</SelectItem>
                <SelectItem value="nonprofit">Non-profit</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          
          <Select value={sortOption} onValueChange={setSortOption}>
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="deadline">Deadline (Soonest)</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        
        {/* Jobs listing */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            <>
              {[...Array(9)].map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </>
          ) : filteredJobs.length > 0 ? (
            filteredJobs.map(job => (
              <OpportunityCard
                key={job.id}
                opportunity={job}
                onClick={handleJobClick}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-lg text-gray-500">{t('jobs.empty')}</p>
            </div>
          )}
        </div>
        
        {/* Load more button */}
        {!isLoading && filteredJobs.length > 0 && totalCount > limit && (
          <div className="mt-8 flex justify-center">
            <Button onClick={() => setLimit(prev => prev + 9)} className="px-6">
              {t('jobs.loadMore')}
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default JobListings;
