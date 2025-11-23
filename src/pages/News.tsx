
import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ChevronDown } from 'lucide-react';
import { Json } from '@/integrations/supabase/types';
import DonationButton from '../components/DonationButton';
import { Skeleton } from '@/components/ui/skeleton';
import NewsItem from '../components/NewsItem';
import { useTranslation } from 'react-i18next';
import { updateMetaTags } from '@/utils/metaUtils';
import AdSenseAd from '@/components/AdSenseAd';
import WhatsAppGroups from '../components/WhatsAppGroups';

interface Attachment {
  name: string;
  url: string;
  type: string;
  path: string;
}

interface NewsItem {
  id: string;
  subject: string;
  body: string;
  created_at: string;
  updated_at: string;
  attachments: Attachment[];
}

const News = () => {
  const { t } = useTranslation();
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [visibleCount, setVisibleCount] = useState<number>(3);
  const [expandedNewsId, setExpandedNewsId] = useState<string | null>(null);
  
  useEffect(() => {
    // Check for shared news URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const sharedNewsId = urlParams.get('news');
    
    if (sharedNewsId) {
      setExpandedNewsId(sharedNewsId);
      // Find and update meta tags for shared news
      fetchSharedNews(sharedNewsId);
    }
  }, []);

  const fetchSharedNews = async (newsId: string) => {
    try {
      const { data, error } = await supabase
        .from('news_items')
        .select('*')
        .eq('id', newsId)
        .single();

      if (error) {
        console.error('Error fetching shared news:', error);
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
        
        // If no attachment image, use default news image
        if (!imageUrl) {
          imageUrl = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200&h=630&fit=crop';
        }

        // Ensure imageUrl has proper dimensions for social sharing
        if (imageUrl && !imageUrl.includes('w=1200')) {
          if (imageUrl.includes('unsplash.com')) {
            imageUrl += imageUrl.includes('?') ? '&w=1200&h=630&fit=crop' : '?w=1200&h=630&fit=crop';
          }
        }

        console.log('Updating meta tags for shared news:', {
          title: data.subject,
          description: data.body,
          imageUrl: imageUrl,
          id: data.id,
          type: 'news'
        });

        // Update meta tags for social sharing
        updateMetaTags({
          title: data.subject,
          description: data.body,
          imageUrl: imageUrl,
          id: data.id,
          type: 'news'
        });
      }
    } catch (error) {
      console.error('Error fetching shared news:', error);
    }
  };
  
  // Fetch news with pagination limit
  const { data: allNewsItems = [], isLoading } = useQuery({
    queryKey: ['news'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('news_items')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error("Error fetching news:", error);
          throw error;
        }
        
        // Process and convert the attachments properly
        return (data || []).map(item => ({
          ...item,
          // Ensure attachments is an array and has the correct type
          attachments: Array.isArray(item.attachments) 
            ? item.attachments.map((att: Json) => att as unknown as Attachment)
            : []
        })) as NewsItem[];
      } catch (error) {
        console.error("Failed to load news:", error);
        return [];
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  });
  
  // Only show the number of news items based on visibleCount
  const newsItems = allNewsItems.slice(0, visibleCount);

  const handleVideoToggle = (newsId: string) => {
    if (activeVideoId === newsId) {
      setActiveVideoId(null);
    } else {
      setActiveVideoId(newsId);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    // Find all video elements and update muted status
    const videos = document.querySelectorAll('video');
    videos.forEach(video => {
      video.muted = !isMuted;
    });
  };
  
  const loadMore = () => {
    setVisibleCount(prev => prev + 3);
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
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{t('news.title')}</h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {t('news.subtitle')}
            </p>
            <div className="mt-6">
              <DonationButton size="lg" />
            </div>
          </motion.div>

          <WhatsAppGroups />

          {isLoading ? (
            <div className="space-y-10">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden p-6">
                  <Skeleton className="h-8 w-2/3 mb-3" />
                  <Skeleton className="h-4 w-1/4 mb-6" />
                  <div className="space-y-4 mb-6">
                    <Skeleton className="h-64 w-full rounded-lg" />
                  </div>
                  <div className="space-y-3">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : newsItems.length > 0 ? (
            <div className="space-y-10">
              {newsItems.map((news, index) => (
                <div key={news.id}>
                  <NewsItem 
                    news={news}
                    activeVideoId={activeVideoId}
                    isMuted={isMuted}
                    onVideoToggle={handleVideoToggle}
                    onToggleMute={toggleMute}
                    expandedNewsId={expandedNewsId}
                    onToggleExpand={(newsId) => {
                      setExpandedNewsId(expandedNewsId === newsId ? null : newsId);
                    }}
                  />
                  
                  {/* Add ad after every 2 news items */}
                  {(index + 1) % 2 === 0 && index < newsItems.length - 1 && (
                    <AdSenseAd />
                  )}
                </div>
              ))}
              
              {allNewsItems.length > visibleCount && (
                <div className="flex justify-center mt-8">
                  <button
                    onClick={loadMore}
                    className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 transition-colors"
                  >
                    {t('news.loadMore')}
                    <ChevronDown className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-gray-500">{t('news.empty')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default News;
