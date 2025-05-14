
import { useState } from 'react';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Play, Pause } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { Json } from '@/integrations/supabase/types';

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
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);

  const { data: newsItems = [], isLoading } = useQuery({
    queryKey: ['news'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('news_items')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        toast.error("Failed to load news");
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
    },
  });

  const handleVideoToggle = (newsId: string) => {
    if (activeVideoId === newsId) {
      setActiveVideoId(null);
    } else {
      setActiveVideoId(newsId);
    }
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
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Latest News</h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Stay updated with the latest news and announcements about scholarships and job opportunities.
            </p>
          </motion.div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-olive-600"></div>
            </div>
          ) : newsItems.length > 0 ? (
            <div className="space-y-10">
              {newsItems.map((news) => (
                <motion.div
                  key={news.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-lg shadow-md overflow-hidden"
                >
                  <div className="p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">{news.subject}</h2>
                    <div className="text-sm text-gray-500 mb-4">
                      {news.created_at && format(new Date(news.created_at), 'MMMM d, yyyy')}
                    </div>
                    <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: news.body }} />
                    
                    {news.attachments && news.attachments.length > 0 && (
                      <div className="mt-6 space-y-4">
                        {news.attachments.map((attachment, index) => (
                          <div key={index} className="border rounded-lg overflow-hidden">
                            {attachment.type === 'image' ? (
                              <img 
                                src={attachment.url} 
                                alt={attachment.name || 'News image'} 
                                className="w-full h-auto max-h-96 object-contain"
                              />
                            ) : attachment.type === 'video' ? (
                              <div className="relative">
                                {activeVideoId === `${news.id}-${index}` ? (
                                  <div className="relative pb-[56.25%] h-0">
                                    <video 
                                      src={attachment.url}
                                      controls
                                      autoPlay
                                      className="absolute top-0 left-0 w-full h-full object-contain bg-black"
                                    />
                                  </div>
                                ) : (
                                  <div 
                                    className="relative cursor-pointer pb-[56.25%] bg-black"
                                    onClick={() => handleVideoToggle(`${news.id}-${index}`)}
                                  >
                                    <div className="absolute inset-0 flex items-center justify-center">
                                      <div className="w-16 h-16 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center">
                                        <Play className="h-8 w-8 text-white" />
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className="p-4 flex items-center justify-between bg-gray-50">
                                <span>{attachment.name}</span>
                                <a 
                                  href={attachment.url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:underline"
                                >
                                  Download
                                </a>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-gray-500">No news items found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default News;
