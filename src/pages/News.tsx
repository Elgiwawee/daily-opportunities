
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
  title: string;
  organization: string;
  description: string;
  created_at: string;
  attachments: any[];
}

const News = () => {
  const [visibleCount, setVisibleCount] = useState(5);

  const fetchNews = async () => {
    // For now, we'll just use the opportunities table and filter for the newest scholarships
    // Later, we can create a specific news table if needed
    const { data, error } = await supabase
      .from('opportunities')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);
    
    if (error) {
      toast.error("Error loading news. Please try again later.");
      throw error;
    }
    
    // Convert opportunities to news items
    return data.map(item => ({
      id: item.id,
      title: item.title,
      organization: item.organization,
      description: item.description,
      created_at: item.created_at,
      attachments: item.attachments
    })) as NewsItem[];
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
              Stay updated with the latest scholarship and job opportunity news.
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
                          alt={news.title} 
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
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">{news.title}</h2>
                      <p className="text-gray-600 mb-4 line-clamp-3">{news.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Source: {news.organization}</span>
                        <Button 
                          asChild
                          variant="outline" 
                          className="border border-olive-600 text-olive-700 hover:bg-olive-50"
                        >
                          <a href={`/opportunity/${news.id}`}>Read More</a>
                        </Button>
                      </div>
                    </div>
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
