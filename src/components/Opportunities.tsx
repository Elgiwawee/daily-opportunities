
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import OpportunityCard from './OpportunityCard';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { updateMetaTags } from '@/utils/metaUtils';

interface Attachment {
  name: string;
  url: string;
  type: string;
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
  external_url?: string;
}

// AdSense component
const AdSenseAd = ({ slot, style = {} }: { slot: string; style?: React.CSSProperties }) => {
  useEffect(() => {
    try {
      // Push the ad if adsbygoogle is available
      if (typeof window !== 'undefined' && (window as any).adsbygoogle) {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      }
    } catch (error) {
      console.error('AdSense error:', error);
    }
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={{ display: 'block', ...style }}
      data-ad-client="ca-pub-1418673216471192"
      data-ad-slot={slot}
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
};

const Opportunities = () => {
  const [featuredOpportunities, setFeaturedOpportunities] = useState<Opportunity[]>([]);
  const [otherOpportunities, setOtherOpportunities] = useState<Opportunity[]>([]);
  const [visibleCount, setVisibleCount] = useState(6);
  const [lastNotificationTime, setLastNotificationTime] = useState<number>(
    parseInt(localStorage.getItem('lastNotificationTime') || '0')
  );

  useEffect(() => {
    // Initial fetch of opportunities
    fetchOpportunities();
    
    // Check for shared opportunity URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const sharedOpportunityId = urlParams.get('opportunity');
    
    if (sharedOpportunityId) {
      // Find and update meta tags for shared opportunity
      fetchSharedOpportunity(sharedOpportunityId);
    }
    
    // Prompt for notifications on page load after a delay
    const timer = setTimeout(() => {
      promptForNotifications();
    }, 5000);
    
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
      clearTimeout(timer);
    };
  }, []);

  const fetchSharedOpportunity = async (opportunityId: string) => {
    try {
      const { data, error } = await supabase
        .from('opportunities')
        .select('*')
        .eq('id', opportunityId)
        .single();

      if (error) {
        console.error('Error fetching shared opportunity:', error);
        return;
      }

      if (data) {
        // Process attachments to get image URL
        let imageUrl = '';
        if (data.attachments && Array.isArray(data.attachments) && data.attachments.length > 0) {
          const firstAttachment = data.attachments[0];
          if (firstAttachment && typeof firstAttachment === 'object' && 'url' in firstAttachment) {
            imageUrl = firstAttachment.url as string;
          }
        }
        
        // If no attachment image, use default based on type
        if (!imageUrl) {
          imageUrl = data.type === 'scholarship' 
            ? 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&h=630&fit=crop' 
            : 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&h=630&fit=crop';
        }

        // Ensure imageUrl has proper dimensions for social sharing
        if (imageUrl && !imageUrl.includes('w=1200')) {
          if (imageUrl.includes('unsplash.com')) {
            imageUrl += imageUrl.includes('?') ? '&w=1200&h=630&fit=crop' : '?w=1200&h=630&fit=crop';
          }
        }

        console.log('Updating meta tags for shared opportunity:', {
          title: data.title,
          organization: data.organization,
          description: data.description,
          imageUrl: imageUrl,
          id: data.id
        });

        // Update meta tags for social sharing
        updateMetaTags({
          title: data.title,
          organization: data.organization,
          description: data.description,
          imageUrl: imageUrl,
          id: data.id,
          type: 'opportunity'
        });
      }
    } catch (error) {
      console.error('Error fetching shared opportunity:', error);
    }
  };

  const promptForNotifications = () => {
    // Only prompt if they haven't been asked recently (in the last 3 days)
    const THREE_DAYS = 3 * 24 * 60 * 60 * 1000;
    const now = Date.now();
    
    if (now - lastNotificationTime > THREE_DAYS) {
      // Only prompt if not already granted
      if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
        toast(
          'Never miss new opportunities!',
          {
            description: 'Get notified when new scholarships and jobs are posted.',
            action: {
              label: 'Enable Notifications',
              onClick: () => {
                requestNotificationPermission();
                // Update the last notification time
                setLastNotificationTime(now);
                localStorage.setItem('lastNotificationTime', now.toString());
              }
            },
            duration: 10000,
          }
        );
      }
    }
  };
  
  const requestNotificationPermission = async () => {
    try {
      const result = await Notification.requestPermission();
      if (result === 'granted') {
        // Subscribe the user to push notifications
        subscribeUserToPush();
      }
    } catch (error) {
      console.error('Error requesting permission:', error);
    }
  };
  
  const subscribeUserToPush = async () => {
    try {
      if ('serviceWorker' in navigator && 'PushManager' in window) {
        const registration = await navigator.serviceWorker.ready;
        
        // Subscribe to push
        const subscriptionOptions = {
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(
            // In real implementation, this key should come from your server
            'BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U'
          )
        };
        
        const subscription = await registration.pushManager.subscribe(subscriptionOptions);
        
        // Save the subscription to your server
        await saveSubscription(subscription);
        
        toast.success('You will now be notified about new opportunities!');
      }
    } catch (error) {
      console.error('Failed to subscribe to push notifications:', error);
    }
  };

  // Helper function for creating application server key
  const urlBase64ToUint8Array = (base64String) => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');
    
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

  // Save subscription to database
  const saveSubscription = async (subscription) => {
    const subscriptionJSON = subscription.toJSON();
    const endpoint = subscription.endpoint;
    const p256dh = subscriptionJSON.keys?.p256dh;
    const auth = subscriptionJSON.keys?.auth;

    if (!p256dh || !auth) {
      throw new Error('Invalid subscription keys');
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      const userId = user?.id;
      
      const { error } = await supabase
        .from('push_subscriptions')
        .upsert({ 
          endpoint, 
          p256dh, 
          auth, 
          user_id: userId || null
        }, { 
          onConflict: 'endpoint' 
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error saving subscription:', error);
      throw error;
    }
  };

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
        console.log("Opportunities data from database:", data);
        
        // Process all opportunities
        const processedData = data.map(item => {
          console.log(`Processing opportunity ${item.id}:`, item);
          let processedAttachments = [];
          
          // Ensure attachments is always a properly formatted array
          if (item.attachments) {
            if (Array.isArray(item.attachments)) {
              processedAttachments = item.attachments;
            } else if (typeof item.attachments === 'string') {
              try {
                processedAttachments = JSON.parse(item.attachments);
              } catch (e) {
                console.error("Error parsing attachments:", e);
                processedAttachments = [];
              }
            }
          }
          
          return {
            ...item,
            attachments: processedAttachments
          };
        });
        
        console.log("Processed opportunities:", processedData);
        
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
        <div key={`ad-${index}`} className="col-span-1 md:col-span-3 bg-gray-100 rounded-lg p-4 min-h-[200px] flex items-center justify-center">
          <AdSenseAd slot="1234567890" style={{ minHeight: '200px', width: '100%' }} />
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
          <div className="my-8 bg-gray-100 rounded-lg p-6 text-center min-h-[120px]">
            <AdSenseAd slot="9876543210" style={{ minHeight: '120px', width: '100%' }} />
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
              onClick={() => setVisibleCount(prevCount => prevCount + 6)}
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
