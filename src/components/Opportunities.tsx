
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import OpportunityCard from './OpportunityCard';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import { toast } from 'sonner';

interface Attachment {
  name: string;
  url: string;
  type: 'image' | 'video';
  path: string;
}

interface Opportunity {
  id: string;
  title: string;
  organization: string;
  deadline: string;
  type: 'scholarship' | 'job';
  description: string;
  attachments: Attachment[] | any; // Making it more flexible for different data types
  created_at: string;
}

const Opportunities = () => {
  const [featuredOpportunities, setFeaturedOpportunities] = useState<Opportunity[]>([]);
  const [otherOpportunities, setOtherOpportunities] = useState<Opportunity[]>([]);
  const [visibleCount, setVisibleCount] = useState(6);

  useEffect(() => {
    // Initial fetch of opportunities
    fetchOpportunities();
    
    // Set up real-time subscription
    const channel = supabase
      .channel('opportunities-changes')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all changes (insert, update, delete)
          schema: 'public',
          table: 'opportunities'
        },
        (payload) => {
          console.log('Real-time change:', payload);
          // Refresh the opportunities list when any change occurs
          fetchOpportunities();
          
          // Show notification for new opportunities
          if (payload.eventType === 'INSERT') {
            const newOpportunity = payload.new as Opportunity;
            showNewOpportunityNotification(newOpportunity);
          }
        }
      )
      .subscribe();

    // Cleanup subscription
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchOpportunities = async () => {
    try {
      const { data, error } = await supabase
        .from('opportunities')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        toast.error('Error fetching opportunities. Please try again later.');
        throw error;
      }

      if (data) {
        // Process all opportunities
        const processedData = data.map(item => ({
          ...item,
          attachments: item.attachments || [] // Ensure attachments is always an array
        }));
        
        // First 3 items are featured
        const featured = processedData.slice(0, 3);
        // Rest of the items
        const others = processedData.slice(3);
        
        setFeaturedOpportunities(featured as Opportunity[]);
        setOtherOpportunities(others as Opportunity[]);
      }
    } catch (error) {
      console.error('Error fetching opportunities:', error);
    }
  };

  const showNewOpportunityNotification = (opportunity: Opportunity) => {
    // Show toast notification for all users
    toast(
      `New ${opportunity.type}: ${opportunity.title}`,
      {
        description: `From ${opportunity.organization}`,
        action: {
          label: 'View',
          onClick: () => window.location.href = `/opportunity/${opportunity.id}`
        },
        duration: 10000,
      }
    );
    
    // Try to show push notification if available and permission granted
    if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
      try {
        navigator.serviceWorker.ready.then(registration => {
          registration.showNotification(`New ${opportunity.type}: ${opportunity.title}`, {
            body: `From ${opportunity.organization}`,
            icon: '/og-image.png',
            badge: '/favicon.ico',
            data: {
              url: `/opportunity/${opportunity.id}`
            }
          });
        });
      } catch (error) {
        console.error('Error showing notification:', error);
      }
    }
  };

  const loadMore = () => {
    setVisibleCount(prevCount => prevCount + 6);
  };

  // Function to determine where to place ads
  const renderAdPlaceholder = (index: number) => {
    // Show ad after every 3 opportunities
    if ((index + 1) % 3 === 0) {
      return (
        <div className="col-span-1 md:col-span-3 bg-gray-100 rounded-lg p-4 min-h-[200px] flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-500 font-medium">Advertisement</p>
            <p className="text-sm text-gray-400">Ad space available</p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="py-8 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Featured Section */}
        <div className="mb-12">
          <div className="bg-gray-800 text-white py-2 px-4 inline-block mb-6">
            <h2 className="text-lg font-bold">RECOMMENDED</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredOpportunities.map((opportunity) => (
              <OpportunityCard 
                key={opportunity.id} 
                {...opportunity} 
                featured={true} 
              />
            ))}
          </div>
          
          {/* Ad banner below featured section */}
          <div className="my-8 bg-gray-100 rounded-lg p-6 text-center">
            <p className="text-gray-500 font-medium">Advertisement</p>
            <div className="h-[120px] flex items-center justify-center">
              <p className="text-sm text-gray-400">Premium ad space</p>
            </div>
          </div>
        </div>

        {/* Other Opportunities */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {otherOpportunities.slice(0, visibleCount).map((opportunity, index) => (
            <>
              <OpportunityCard key={opportunity.id} {...opportunity} />
              {renderAdPlaceholder(index)}
            </>
          ))}
        </div>

        {/* Load More Button */}
        {otherOpportunities.length > visibleCount && (
          <div className="flex justify-center mt-10">
            <Button 
              onClick={loadMore}
              variant="outline"
              className="border border-gray-300 hover:bg-gray-100 text-gray-800"
            >
              Load more <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Opportunities;
