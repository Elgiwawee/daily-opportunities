
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import OpportunityCard from './OpportunityCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Search, Filter } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import RegionFilter from './RegionFilter';
import { useTranslation } from 'react-i18next';

interface OpportunitiesProps {
  type?: "scholarship" | "job" | "all";
  featured?: boolean;
  limit?: number;
  showFilters?: boolean;
  region?: string | null;
}

const Opportunities = ({ type = "all", featured = false, limit = 9, showFilters = true, region = null }: OpportunitiesProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<"scholarship" | "job" | "all">(type);
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [filteredOpportunities, setFilteredOpportunities] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentLimit, setLimit] = useState(limit);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(region);

  // Fixed the useQuery call to use the proper object format
  const { isLoading, error } = useQuery({
    queryKey: ['opportunities', activeTab, currentLimit, selectedRegion, featured],
    queryFn: async () => {
      let query = supabase
        .from('opportunities')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(0, currentLimit - 1);

      if (activeTab !== 'all') {
        query = query.eq('type', activeTab);
      }

      if (selectedRegion !== 'all' && selectedRegion !== null) {
        query = query.eq('region', selectedRegion);
      }

      if (featured) {
        query = query.eq('featured', true);
      }

      const { data, error, count } = await query;

      if (error) {
        throw new Error(error.message);
      }

      setTotalCount(count || 0);
      setOpportunities(data || []);
      return data;
    }
  });

  useEffect(() => {
    // Apply search filter
    const filtered = opportunities.filter(opportunity =>
      opportunity.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredOpportunities(filtered);
  }, [searchTerm, opportunities]);

  useEffect(() => {
    // Reset limit when tab changes
    setLimit(limit);
    setActiveTab(type);
  }, [type, limit]);

  useEffect(() => {
    // Fetch data when region changes
    setSelectedRegion(region || null);
  }, [region]);

  const handleOpportunityClick = (opportunity: any) => {
    navigate(`/opportunity/${opportunity.id}`);
  };

  const handleRegionChange = (newRegion: string | null) => {
    setSelectedRegion(newRegion);
  };

  return (
    <div className="container mx-auto px-4">
      {showFilters && (
        <div>
          <Tabs value={activeTab} onValueChange={(value) => {
            setActiveTab(value as "scholarship" | "job" | "all");
            navigate(`/?type=${value}`);
          }}>
            <TabsList>
              <TabsTrigger value="all">{t('nav.home')}</TabsTrigger>
              <TabsTrigger value="scholarship">{t('scholarships.title')}</TabsTrigger>
              <TabsTrigger value="job">{t('jobs.title')}</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="relative mt-4">
            <Input
              type="search"
              placeholder={t('buttons.search')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
          </div>

          <RegionFilter onRegionChange={handleRegionChange} activeRegion={selectedRegion} />
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {isLoading ? (
          <>
            {[...Array(9)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-48 w-full bg-gray-200 animate-pulse rounded-md"></div>
                <div className="h-4 w-3/4 bg-gray-200 animate-pulse rounded-md"></div>
                <div className="h-4 w-1/2 bg-gray-200 animate-pulse rounded-md"></div>
                <div className="h-4 w-5/6 bg-gray-200 animate-pulse rounded-md"></div>
              </div>
            ))}
          </>
        ) : filteredOpportunities.length === 0 ? (
          <div className="col-span-3 text-center py-12">
            <p className="text-lg text-gray-500">{t('scholarships.empty')}</p>
          </div>
        ) : (
          <>
            {filteredOpportunities.map((opportunity) => (
              <div key={opportunity.id} className="h-full">
                {featured && opportunity.featured ? (
                  <div className="relative h-full">
                    <div className="absolute -top-2 -right-2 z-10">
                      <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                        {t('opportunity.featured')}
                      </span>
                    </div>
                    <OpportunityCard
                      opportunity={opportunity}
                      onClick={handleOpportunityClick}
                    />
                  </div>
                ) : (
                  <OpportunityCard
                    opportunity={opportunity}
                    onClick={handleOpportunityClick}
                  />
                )}
              </div>
            ))}
          </>
        )}
      </div>
      
      {!isLoading && filteredOpportunities.length > 0 && totalCount > filteredOpportunities.length && (
        <div className="mt-8 flex justify-center">
          <Button onClick={() => setLimit(prev => prev + 9)} className="px-6">
            {t('buttons.loadMore')}
          </Button>
        </div>
      )}
    </div>
  );
};

export default Opportunities;
