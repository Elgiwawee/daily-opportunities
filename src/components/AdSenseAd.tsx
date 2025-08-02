import { useEffect } from 'react';

interface AdSenseAdProps {
  className?: string;
  adSlot?: string;
  adFormat?: string;
  adLayout?: string;
  style?: React.CSSProperties;
}

const AdSenseAd: React.FC<AdSenseAdProps> = ({
  className = "",
  adSlot = "1787815615",
  adFormat = "fluid",
  adLayout = "in-article",
  style = { display: 'block', textAlign: 'center' }
}) => {
  useEffect(() => {
    try {
      // Load Google AdSense script if not already loaded
      if (!document.querySelector('script[src*="adsbygoogle.js"]')) {
        const script = document.createElement('script');
        script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1418673216471192';
        script.async = true;
        script.crossOrigin = 'anonymous';
        document.head.appendChild(script);
      }

      // Initialize the ad
      const adsbygoogle = (window as any).adsbygoogle || [];
      adsbygoogle.push({});
    } catch (error) {
      console.error('AdSense error:', error);
    }
  }, []);

  return (
    <div className={`my-8 ${className}`}>
      <ins
        className="adsbygoogle"
        style={style}
        data-ad-layout={adLayout}
        data-ad-format={adFormat}
        data-ad-client="ca-pub-1418673216471192"
        data-ad-slot={adSlot}
      />
    </div>
  );
};

export default AdSenseAd;