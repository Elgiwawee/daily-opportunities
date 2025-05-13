
import { useState } from 'react';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Calendar, Clock } from 'lucide-react';
import { toast } from 'sonner';

interface NewsItem {
  id: string;
  subject: string;
  body: string;
  created_at: string;
  attachments: any[];
}

const News = () => {
  const [visibleCount, setVisibleCount] = useState(5);

  const fetchNews = async () => {
    // Fetch from news_items table
    const { data, error } = await supabase
      .from('news_items')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      toast.error("Error loading news. Please try again later.");
      throw error;
    }
    
    return data as NewsItem[];
  };

  const { data: newsItems = [], isLoading, error } = useQuery({
    queryKey: ['news'],
    queryFn: fetchNews,
  });

  const loadMore = () => {
    setVisibleCount(prev => prev + 5);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
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
              Stay updated with the latest news and announcements.
            </p>
          </motion.div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-olive-600"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12 text-red-500">
              Error loading news. Please try again later.
            </div>
          ) : (
            <>
              <div className="space-y-8">
                {newsItems.slice(0, visibleCount).map((news) => (
                  <div key={news.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    {news.attachments && news.attachments[0] && (
                      <div className="relative h-64 w-full">
                        <img 
                          src={news.attachments[0].url} 
                          alt={news.subject} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex items-center text-sm text-gray-500 mb-2">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span>{formatDate(news.created_at)}</span>
                        <span className="mx-2">•</span>
                        <Clock className="w-4 h-4 mr-1" />
                        <span>News</span>
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">{news.subject}</h2>
                      <p className="text-gray-600 mb-4 line-clamp-3">{news.body}</p>
                      <div className="flex justify-end">
                        <Button 
                          variant="outline" 
                          className="border border-olive-600 text-olive-700 hover:bg-olive-50"
                          onClick={() => {
                            // For now, just show the full content in a modal or expand it
                            toast.info("Full news viewer will be implemented soon!");
                          }}
                        >
                          Read More
                        </Button>
                      </div>
                    </div>

                    {/* Display additional attachments if any */}
                    {news.attachments && news.attachments.length > 1 && (
                      <div className="px-6 pb-6">
                        <h3 className="text-sm font-medium text-gray-700 mb-2">Media Gallery</h3>
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                          {news.attachments.slice(1, 5).map((attachment, index) => (
                            <div key={index} className="aspect-square overflow-hidden rounded-md">
                              {attachment.type?.startsWith("image/") ? (
                                <img
                                  src={attachment.url}
                                  alt={`Media ${index + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              ) : attachment.type?.startsWith("video/") ? (
                                <video
                                  src={attachment.url}
                                  className="w-full h-full object-cover"
                                  controls
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                  File
                                </div>
                              )}
                            </div>
                          ))}
                          {news.attachments.length > 5 && (
                            <div className="aspect-square flex items-center justify-center bg-gray-100 rounded-md">
                              +{news.attachments.length - 5} more
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {newsItems.length > visibleCount && (
                <div className="flex justify-center mt-10">
                  <Button 
                    onClick={loadMore}
                    variant="outline"
                    className="border border-olive-600 text-olive-700 hover:bg-olive-50"
                  >
                    Load More News
                  </Button>
                </div>
              )}

              {newsItems.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-lg text-gray-500">No news articles found. Please check back later.</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default News;
