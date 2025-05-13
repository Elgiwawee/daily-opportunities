
import { useState } from 'react';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Play, Maximize, X } from 'lucide-react';
import { toast } from 'sonner';

interface NewsItem {
  id: string;
  subject: string;
  body: string;
  created_at: string;
  attachments: {
    name: string;
    url: string;
    type: string;
    path: string;
  }[];
}

const News = () => {
  const [visibleCount, setVisibleCount] = useState(5);
  const [activeMedia, setActiveMedia] = useState<{url: string, type: string} | null>(null);

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

  const openMediaViewer = (url: string, type: string) => {
    setActiveMedia({ url, type });
  };

  const closeMediaViewer = () => {
    setActiveMedia(null);
  };

  const isVideo = (type: string) => type.startsWith('video/');
  const isImage = (type: string) => type.startsWith('image/');

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
                        {isImage(news.attachments[0].type) ? (
                          <img 
                            src={news.attachments[0].url} 
                            alt={news.subject} 
                            className="w-full h-full object-cover cursor-pointer"
                            onClick={() => openMediaViewer(news.attachments[0].url, news.attachments[0].type)}
                          />
                        ) : isVideo(news.attachments[0].type) ? (
                          <div className="relative w-full h-full bg-black">
                            <video 
                              src={news.attachments[0].url}
                              className="w-full h-full object-contain"
                              onClick={(e) => e.currentTarget.paused ? e.currentTarget.play() : e.currentTarget.pause()}
                              controls={false}
                            />
                            <div 
                              className="absolute inset-0 flex items-center justify-center cursor-pointer bg-black bg-opacity-30 hover:bg-opacity-10 transition-all"
                              onClick={() => openMediaViewer(news.attachments[0].url, news.attachments[0].type)}
                            >
                              <div className="w-16 h-16 rounded-full bg-white bg-opacity-80 flex items-center justify-center">
                                <Play className="w-8 h-8 text-red-600 ml-1" />
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-100">
                            <p className="text-gray-500">File: {news.attachments[0].name}</p>
                          </div>
                        )}
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
                      <p className="text-gray-600 mb-4 whitespace-pre-wrap">{news.body}</p>
                    </div>

                    {/* Display additional attachments if any */}
                    {news.attachments && news.attachments.length > 1 && (
                      <div className="px-6 pb-6">
                        <h3 className="text-sm font-medium text-gray-700 mb-2">Media Gallery</h3>
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                          {news.attachments.slice(1).map((attachment, index) => (
                            <div key={index} className="aspect-square overflow-hidden rounded-md relative group">
                              {isImage(attachment.type) ? (
                                <img
                                  src={attachment.url}
                                  alt={attachment.name || `Media ${index + 1}`}
                                  className="w-full h-full object-cover cursor-pointer"
                                  onClick={() => openMediaViewer(attachment.url, attachment.type)}
                                />
                              ) : isVideo(attachment.type) ? (
                                <div className="relative w-full h-full">
                                  <video
                                    src={attachment.url}
                                    className="w-full h-full object-cover"
                                    preload="metadata"
                                  />
                                  <div 
                                    className="absolute inset-0 flex items-center justify-center cursor-pointer"
                                    onClick={() => openMediaViewer(attachment.url, attachment.type)}
                                  >
                                    <div className="w-10 h-10 rounded-full bg-white bg-opacity-80 flex items-center justify-center">
                                      <Play className="w-5 h-5 text-red-600 ml-0.5" />
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-100 cursor-pointer" onClick={() => window.open(attachment.url, '_blank')}>
                                  <p className="text-xs text-center text-gray-500 p-2">
                                    {attachment.name || 'File'}
                                  </p>
                                </div>
                              )}
                              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                                <button 
                                  className="p-1 bg-white rounded-full shadow-md"
                                  onClick={() => openMediaViewer(attachment.url, attachment.type)}
                                >
                                  <Maximize className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ))}
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

      {/* Media Viewer Modal */}
      {activeMedia && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <div className="absolute top-4 right-4 z-10">
            <button
              onClick={closeMediaViewer}
              className="p-2 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-70 transition-all"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="max-w-5xl max-h-[90vh] w-full">
            {isVideo(activeMedia.type) ? (
              <video 
                src={activeMedia.url}
                className="w-full max-h-[90vh] object-contain"
                controls
                autoPlay
              />
            ) : (
              <img 
                src={activeMedia.url}
                className="w-full max-h-[90vh] object-contain"
                alt="Media preview"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default News;
