
import { useState } from 'react';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { Json } from '@/integrations/supabase/types';
import DonationButton from '../components/DonationButton';

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
  const [isMuted, setIsMuted] = useState<boolean>(false);

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

  const toggleMute = () => {
    setIsMuted(!isMuted);
    // Find all video elements and update muted status
    const videos = document.querySelectorAll('video');
    videos.forEach(video => {
      video.muted = !isMuted;
    });
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
            <div className="mt-6">
              <DonationButton size="lg" />
            </div>
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
                    <div className="flex justify-between items-start mb-3">
                      <h2 className="text-2xl font-bold text-gray-900">{news.subject}</h2>
                      <DonationButton 
                        variant="outline"
                        size="sm"
                        label="Support"
                      />
                    </div>
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
                            ) : attachment.type?.includes('video') ? (
                              <div className="relative">
                                {activeVideoId === `${news.id}-${index}` ? (
                                  <div className="relative">
                                    <div className="relative pb-[56.25%] h-0 overflow-hidden bg-black">
                                      <video 
                                        src={attachment.url}
                                        controls
                                        autoPlay
                                        className="absolute top-0 left-0 w-full h-full object-contain"
                                        muted={isMuted}
                                        playsInline
                                        preload="metadata"
                                      />
                                    </div>
                                    <div className="absolute bottom-4 right-4 flex space-x-2">
                                      <button 
                                        onClick={() => handleVideoToggle(`${news.id}-${index}`)}
                                        className="bg-white/80 hover:bg-white text-gray-700 p-2 rounded-full shadow"
                                        aria-label="Pause video"
                                      >
                                        <Pause className="h-5 w-5" />
                                      </button>
                                      <button 
                                        onClick={toggleMute}
                                        className="bg-white/80 hover:bg-white text-gray-700 p-2 rounded-full shadow"
                                        aria-label={isMuted ? "Unmute" : "Mute"}
                                      >
                                        {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <div 
                                    className="video-preview relative cursor-pointer transition-all duration-200 hover:shadow-lg"
                                    onClick={() => handleVideoToggle(`${news.id}-${index}`)}
                                  >
                                    {/* YouTube-like preview with play button */}
                                    <div className="relative pb-[56.25%] bg-black">
                                      {/* Video thumbnail */}
                                      <div className="absolute inset-0 flex items-center justify-center bg-black">
                                        <img 
                                          src={`${attachment.url.split('.')[0]}.jpg`} 
                                          alt="Video thumbnail"
                                          className="w-full h-full object-cover"
                                          onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.src = "https://images.unsplash.com/photo-1516054575922-f0b8eeadec1a?ixlib=rb-4.0.3";
                                          }}
                                        />
                                        
                                        {/* YouTube-like play button with hover effect */}
                                        <div className="absolute inset-0 flex items-center justify-center hover:bg-black/40 transition-colors duration-300">
                                          <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center transform transition-transform duration-300 hover:bg-red-700 hover:scale-110">
                                            <Play className="h-8 w-8 text-white ml-1" />
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    
                                    {/* Video title */}
                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4">
                                      <p className="text-white font-medium text-lg truncate">
                                        {attachment.name || `Video ${index + 1}`}
                                      </p>
                                      <p className="text-gray-300 text-sm">
                                        Click to play
                                      </p>
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
