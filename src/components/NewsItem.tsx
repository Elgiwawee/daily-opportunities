
import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, Share2, Calendar, Clock } from 'lucide-react';
import { format } from 'date-fns';
import DonationButton from './DonationButton';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { toast } from 'sonner';

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
  expandedNewsId: string | null;
  onToggleExpand: (newsId: string) => void;
}

const NewsItem = ({ 
  news, 
  activeVideoId, 
  isMuted, 
  onVideoToggle, 
  onToggleMute,
  expandedNewsId,
  onToggleExpand 
}: NewsItemProps) => {
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [shareMenuOpen, setShareMenuOpen] = useState(false);
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

  const handleShare = (platform: string) => {
    const shareUrl = `${window.location.origin}/?news=${news.id}`;
    const shareText = `${news.subject} - ${news.body.substring(0, 100)}...`;
    
    let shareLink = '';
    
    switch (platform) {
      case 'facebook':
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`;
        break;
      case 'twitter':
        shareLink = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
        break;
      case 'whatsapp':
        shareLink = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' - ' + shareUrl)}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(shareUrl).then(() => {
          toast.success('Link copied to clipboard!');
        }).catch(() => {
          toast.error('Unable to copy link');
        });
        setShareMenuOpen(false);
        return;
      default:
        break;
    }
    
    if (shareLink) {
      window.open(shareLink, '_blank', 'width=600,height=400');
    }
    
    setShareMenuOpen(false);
  };

  // Get first image for preview
  const previewImage = news.attachments && news.attachments.length > 0 
    ? news.attachments.find(att => att.type === 'image')?.url 
    : null;

  return (
    <motion.div
      ref={articleRef}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-lg shadow-md overflow-hidden"
    >
      {/* News preview card similar to opportunity card */}
      <div className="relative aspect-video w-full overflow-hidden">
        {previewImage && imagesLoaded ? (
          <img
            src={previewImage}
            alt={news.subject}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <h3 className="text-2xl font-bold text-white text-center px-4">{news.subject}</h3>
          </div>
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-4">
          <h3 className="text-lg md:text-xl font-bold text-white">{news.subject}</h3>
        </div>
        
        <div className="absolute top-2 left-2 px-3 py-1 text-xs font-semibold text-white rounded bg-red-600">
          News
        </div>
        
        <div className="absolute top-2 right-2">
          <div className="relative inline-block">
            <Button
              onClick={() => setShareMenuOpen(!shareMenuOpen)}
              variant="outline"
              size="sm"
              className="bg-white/80 hover:bg-white text-gray-700"
            >
              <Share2 className="h-4 w-4" />
            </Button>
            
            {shareMenuOpen && (
              <div className="absolute right-0 mt-2 w-36 bg-white rounded-md shadow-lg z-10 border border-gray-100">
                <div className="py-1">
                  <button
                    onClick={() => handleShare('facebook')}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-blue-50"
                  >
                    Facebook
                  </button>
                  <button
                    onClick={() => handleShare('twitter')}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-blue-50"
                  >
                    Twitter
                  </button>
                  <button
                    onClick={() => handleShare('whatsapp')}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-blue-50"
                  >
                    WhatsApp
                  </button>
                  <button
                    onClick={() => handleShare('copy')}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-blue-50"
                  >
                    Copy Link
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Calendar className="h-4 w-4" />
            {news.created_at && format(new Date(news.created_at), 'MMMM d, yyyy')}
          </div>
          <DonationButton 
            variant="outline"
            size="sm"
            label="Support"
          />
        </div>
        
        <p className="text-gray-700 text-sm mb-4 line-clamp-3">{news.body.replace(/<[^>]*>/g, '').substring(0, 150)}...</p>
        
        <Accordion 
          type="single" 
          collapsible 
          className="w-full" 
          value={expandedNewsId === news.id ? "details" : undefined}
          onValueChange={(value) => {
            if (value === "details") {
              onToggleExpand(news.id);
            } else {
              onToggleExpand(news.id);
            }
          }}
        >
          <AccordionItem value="details" className="border-none">
            <AccordionTrigger className="text-sm font-medium text-blue-700 hover:underline bg-transparent border-none p-0 h-auto hover:no-underline">
              Read Full Article
            </AccordionTrigger>
            <AccordionContent className="pt-4 pb-0">
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>Published: {news.created_at && format(new Date(news.created_at), 'MMMM d, yyyy')}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="mr-2 h-4 w-4" />
                    <span>News Article</span>
                  </div>
                </div>
                
                {/* Attachments displayed in expanded view */}
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
                                <div className="relative pb-[56.25%] bg-black">
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
                                    
                                    <div className="absolute inset-0 flex items-center justify-center hover:bg-black/40 transition-colors duration-300">
                                      <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center transform transition-transform duration-300 hover:bg-red-700 hover:scale-110 shadow-lg">
                                        <Play className="h-8 w-8 text-white ml-1" />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                
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
                <div className="prose max-w-none">
                  <h4 className="font-semibold mb-2">Full Article</h4>
                  <div 
                    className="text-gray-700 text-sm leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: news.body }}
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        
        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center gap-2">
            <div className="relative inline-block">
              <Button
                onClick={() => setShareMenuOpen(!shareMenuOpen)}
                variant="outline"
                size="sm"
                className="flex items-center gap-2 text-blue-700 border-blue-200 hover:bg-blue-50"
              >
                <Share2 className="h-4 w-4" />
                Share
              </Button>
              
              {shareMenuOpen && (
                <div className="absolute left-0 bottom-full mb-2 w-36 bg-white rounded-md shadow-lg z-10 border border-gray-100">
                  <div className="py-1">
                    <button
                      onClick={() => handleShare('facebook')}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-blue-50"
                    >
                      Facebook
                    </button>
                    <button
                      onClick={() => handleShare('twitter')}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-blue-50"
                    >
                      Twitter
                    </button>
                    <button
                      onClick={() => handleShare('whatsapp')}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-blue-50"
                    >
                      WhatsApp
                    </button>
                    <button
                      onClick={() => handleShare('copy')}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-blue-50"
                    >
                      Copy Link
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            <DonationButton 
              variant="outline" 
              size="sm" 
              label="Support"
              className="text-amber-700 border-amber-200 hover:bg-amber-50"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default NewsItem;
