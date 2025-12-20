import { useEffect, useRef, useState } from 'react';

interface AdSenseAdProps {
  className?: string;
  adSlot?: string;
  adFormat?: 'auto' | 'fluid' | 'rectangle' | 'vertical' | 'horizontal';
  adLayout?: string;
  style?: React.CSSProperties;
  variant?: 'inline' | 'sidebar' | 'banner' | 'in-article' | 'multiplex' | 'rectangle';
}

const AdSenseAd: React.FC<AdSenseAdProps> = ({
  className = "",
  adSlot = "1787815615",
  adFormat = "auto",
  adLayout,
  style,
  variant = 'in-article'
}) => {
  const adRef = useRef<HTMLDivElement>(null);
  const [adLoaded, setAdLoaded] = useState(false);

  // Get appropriate styles based on variant
  const getVariantStyles = (): React.CSSProperties => {
    const baseStyle: React.CSSProperties = { display: 'block' };
    
    switch (variant) {
      case 'banner':
        return { 
          ...baseStyle, 
          minHeight: '90px',
          width: '100%',
          maxWidth: '728px',
          margin: '0 auto'
        };
      case 'sidebar':
        return { 
          ...baseStyle, 
          minHeight: '250px',
          width: '100%',
          maxWidth: '300px'
        };
      case 'rectangle':
        return { 
          ...baseStyle, 
          minHeight: '250px',
          width: '100%',
          maxWidth: '336px',
          margin: '0 auto'
        };
      case 'multiplex':
        return { 
          ...baseStyle, 
          minHeight: '200px',
          width: '100%'
        };
      case 'in-article':
      case 'inline':
      default:
        return { 
          ...baseStyle, 
          textAlign: 'center' as const,
          minHeight: '100px',
          width: '100%'
        };
    }
  };

  useEffect(() => {
    // Prevent duplicate ad loading
    if (adLoaded) return;

    const loadAd = () => {
      try {
        const adsbygoogle = (window as any).adsbygoogle || [];
        adsbygoogle.push({});
        setAdLoaded(true);
      } catch (error) {
        console.error('AdSense push error:', error);
      }
    };

    // Small delay to ensure DOM is ready
    const timer = setTimeout(loadAd, 100);

    return () => clearTimeout(timer);
  }, [adLoaded]);

  const containerClasses = `adsense-container ${className}`;
  const appliedStyle = style || getVariantStyles();
  const appliedLayout = adLayout || (variant === 'in-article' ? 'in-article' : undefined);
  const appliedFormat = variant === 'in-article' ? 'fluid' : adFormat;

  return (
    <div 
      ref={adRef}
      className={containerClasses}
      style={{ 
        minHeight: '100px', 
        margin: '16px 0',
        backgroundColor: 'transparent'
      }}
    >
      <ins
        className="adsbygoogle"
        style={appliedStyle}
        data-ad-client="ca-pub-1418673216471192"
        data-ad-slot={adSlot}
        data-ad-format={appliedFormat}
        data-full-width-responsive="true"
        {...(appliedLayout && { 'data-ad-layout': appliedLayout })}
      />
    </div>
  );
};

export default AdSenseAd;