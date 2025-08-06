import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import OpportunityCard from '@/components/OpportunityCard';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslation } from 'react-i18next';

interface RelatedOpportunitiesProps {
  currentOpportunityId: string;
  type: 'scholarship' | 'job';
  organization?: string;
  className?: string;
}

export const RelatedOpportunities = ({ 
  currentOpportunityId, 
  type, 
  organization,
  className = "" 
}: RelatedOpportunitiesProps) => {
  const { t } = useTranslation();

  const fetchRelatedOpportunities = async () => {
    let query = supabase
      .from('opportunities')
      .select('*')
      .eq('type', type)
      .neq('id', currentOpportunityId)
      .order('created_at', { ascending: false })
      .limit(6);

    // If organization is provided, prioritize opportunities from the same organization
    if (organization) {
      const { data: sameOrgData } = await query
        .eq('organization', organization)
        .limit(3);
      
      const { data: differentOrgData } = await supabase
        .from('opportunities')
        .select('*')
        .eq('type', type)
        .neq('id', currentOpportunityId)
        .neq('organization', organization)
        .order('created_at', { ascending: false })
        .limit(3);

      return [...(sameOrgData || []), ...(differentOrgData || [])].slice(0, 6);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  };

  const { data: opportunities, isLoading } = useQuery({
    queryKey: ['relatedOpportunities', currentOpportunityId, type, organization],
    queryFn: fetchRelatedOpportunities,
  });

  if (isLoading) {
    return (
      <div className={`w-full ${className}`}>
        <h2 className="text-2xl font-bold mb-6 text-foreground">
          {type === 'scholarship' ? 'Related Scholarships' : 'Related Jobs'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="p-4">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2 mb-4" />
              <Skeleton className="h-20 w-full mb-4" />
              <Skeleton className="h-4 w-1/3" />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!opportunities || opportunities.length === 0) {
    return null;
  }

  return (
    <div className={`w-full ${className}`}>
      <h2 className="text-2xl font-bold mb-6 text-foreground">
        {type === 'scholarship' 
          ? t('opportunityDetails.relatedScholarships', 'Related Scholarships')
          : t('opportunityDetails.relatedJobs', 'Related Jobs')
        }
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {opportunities.map((opportunity) => (
          <OpportunityCard 
            key={opportunity.id} 
            id={opportunity.id}
            title={opportunity.title}
            organization={opportunity.organization}
            deadline={opportunity.deadline}
            type={opportunity.type}
            description={opportunity.description}
            attachments={opportunity.attachments as any[]}
            external_url={opportunity.external_url}
          />
        ))}
      </div>
    </div>
  );
};