
import { useState } from 'react';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  content: string;
  image_url?: string;
  created_at: string;
  author?: string;
}

const News = () => {
  const [visibleCount, setVisibleCount] = useState(6);

  const fetchNews = async () => {
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    return data as NewsItem[];
  };

  const { data: newsItems = [], isLoading, error } = useQuery({
    queryKey: ['news'],
    queryFn: fetchNews,
  });

  const loadMore = () => {
    setVisibleCount(prev => prev + 6);
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
              Stay updated with the latest news about scholarships, education, and career opportunities.
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
                {newsItems.slice(0, visibleCount).map((news) => (
                  <motion.div
                    key={news.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -5 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all"
                  >
                    {news.image_url && (
                      <div className="aspect-video w-full overflow-hidden">
                        <img
                          src={news.image_url}
                          alt={news.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-xs text-gray-500">
                          {format(new Date(news.created_at), 'MMMM d, yyyy')}
                        </span>
                        {news.author && (
                          <span className="text-xs text-olive-600 font-medium">
                            By {news.author}
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl font-bold mb-2 line-clamp-2">{news.title}</h3>
                      <p className="text-gray-600 mb-4 line-clamp-3">{news.summary}</p>
                      <Link
                        to={`/news/${news.id}`}
                        className="text-olive-700 font-medium hover:underline"
                      >
                        Read More
                      </Link>
                    </div>
                  </motion.div>
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
                  <p className="text-lg text-gray-500">No news found. Please check back later.</p>
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
