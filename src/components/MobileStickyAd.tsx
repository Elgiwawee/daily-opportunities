import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';

interface MobileStickyAdProps {
  className?: string;
}

const MobileStickyAd: React.FC<MobileStickyAdProps> = ({ className = "" }) => {
  const adRef = useRef<HTMLDivElement>(null);
  const [adLoaded, setAdLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (adLoaded) return;

    const loadAd = () => {
      try {
        const adsbygoogle = (window as any).adsbygoogle || [];
        adsbygoogle.push({});
        setAdLoaded(true);
      } catch (error) {
        console.error('Mobile sticky ad error:', error);
      }
    };

    const timer = setTimeout(loadAd, 100);
    return () => clearTimeout(timer);
  }, [adLoaded]);

  if (!isVisible) return null;

  return (
    <div 
      ref={adRef}
      className={`fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg md:hidden ${className}`}
      style={{ minHeight: '60px' }}
    >
      {/* Close button */}
      <button
        onClick={() => setIsVisible(false)}
        className="absolute -top-8 right-2 bg-gray-800 text-white rounded-full p-1 shadow-md hover:bg-gray-700 transition-colors"
        aria-label="Close ad"
      >
        <X className="w-4 h-4" />
      </button>
      
      {/* Using In-Feed ad format for mobile sticky - better engagement */}
      <ins
        className="adsbygoogle"
        style={{ display: 'block', width: '100%', height: '60px' }}
        data-ad-client="ca-pub-1418673216471192"
        data-ad-slot="5889527945"
        data-ad-format="fluid"
        data-ad-layout-key="-eg-36-5v+52+wi"
        data-full-width-responsive="true"
      />
    </div>
  );
};

export default MobileStickyAd;
