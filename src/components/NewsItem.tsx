
import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { format } from 'date-fns';
import DonationButton from './DonationButton';

interface Attachment {
  name: string;
  url: string;
  type: string;
  path: string;
}

interface NewsItemProps {
  news: {
    id: string;
    subject: string;
    body: string;
    created_at: string;
    updated_at: string;
    attachments: Attachment[];
  };
  activeVideoId: string | null;
  isMuted: boolean;
  onVideoToggle: (id: string) => void;
  onToggleMute: () => void;
}

const NewsItem = ({ news, activeVideoId, isMuted, onVideoToggle, onToggleMute }: NewsItemProps) => {
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const articleRef = useRef<HTMLDivElement>(null);
  
  // Intersection observer to load images only when they come into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !imagesLoaded) {
          setImagesLoaded(true);
        }
      },
      { threshold: 0.1 }
    );

    if (articleRef.current) {
      observer.observe(articleRef.current);
    }

    return () => {
      if (articleRef.current) {
        observer.unobserve(articleRef.current);
      }
    };
  }, [imagesLoaded]);

  return (
    <motion.div
      ref={articleRef}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
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
        
        {/* Attachments displayed first */}
        {news.attachments && news.attachments.length > 0 && imagesLoaded && (
          <div className="mb-6 space-y-4">
            {news.attachments.map((attachment, index) => (
              <div key={index} className="border rounded-lg overflow-hidden">
                {attachment.type === 'image' ? (
                  <img 
                    src={attachment.url} 
                    alt={attachment.name || 'News image'} 
                    className="w-full h-auto max-h-96 object-contain"
                    loading="lazy"
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
                            onClick={() => onVideoToggle(`${news.id}-${index}`)}
                            className="bg-white/80 hover:bg-white text-gray-700 p-2 rounded-full shadow"
                            aria-label="Pause video"
                          >
                            <Pause className="h-5 w-5" />
                          </button>
                          <button 
                            onClick={onToggleMute}
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
                        onClick={() => onVideoToggle(`${news.id}-${index}`)}
                      >
                        {/* YouTube-style video preview with play button */}
                        <div className="relative pb-[56.25%] bg-black">
                          {/* Video thumbnail */}
                          <div className="absolute inset-0 flex items-center justify-center bg-black">
                            <img 
                              src={`${attachment.url.split('.')[0]}.jpg`} 
                              alt="Video thumbnail"
                              className="w-full h-full object-cover"
                              loading="lazy"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = "https://images.unsplash.com/photo-1516054575922-f0b8eeadec1a?ixlib=rb-4.0.3";
                              }}
                            />
                            
                            {/* Enhanced YouTube-like play button with red background */}
                            <div className="absolute inset-0 flex items-center justify-center hover:bg-black/40 transition-colors duration-300">
                              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center transform transition-transform duration-300 hover:bg-red-700 hover:scale-110 shadow-lg">
                                <Play className="h-8 w-8 text-white ml-1" />
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* YouTube-style video title and info */}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4">
                          <p className="text-white font-medium text-lg truncate">
                            {attachment.name || `Video ${index + 1}`}
                          </p>
                          <p className="text-gray-300 text-sm flex items-center">
                            <span className="mr-2">Click to play</span>
                            <span className="bg-black/30 px-1 rounded text-xs">HD</span>
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
        
        {/* News content */}
        <div 
          className="prose max-w-none mt-4" 
          dangerouslySetInnerHTML={{ __html: news.body }}
        />
      </div>
    </motion.div>
  );
};

export default NewsItem;
