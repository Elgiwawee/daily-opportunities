import { useEffect, useRef, useState } from 'react';

interface AdSenseAdProps {
  className?: string;
  adSlot?: string;
  adFormat?: 'auto' | 'fluid' | 'rectangle' | 'vertical' | 'horizontal';
  adLayout?: string;
  adLayoutKey?: string;
  style?: React.CSSProperties;
  variant?: 'inline' | 'sidebar' | 'banner' | 'in-article' | 'multiplex' | 'rectangle' | 'in-feed';
}

const AdSenseAd: React.FC<AdSenseAdProps> = ({
  className = "",
  adSlot,
  adFormat,
  adLayout,
  adLayoutKey,
  style,
  variant = 'in-article'
}) => {
  const adRef = useRef<HTMLDivElement>(null);
  const [adLoaded, setAdLoaded] = useState(false);

  // Get appropriate ad slot and settings based on variant
  const getAdConfig = () => {
    switch (variant) {
      case 'in-feed':
        return {
          slot: adSlot || '5889527945',
          format: 'fluid' as const,
          layout: 'in-article',
          layoutKey: adLayoutKey || '-eg-36-5v+52+wi'
        };
      case 'banner':
        return {
          slot: adSlot || '1787815615',
          format: adFormat || 'auto' as const,
          layout: undefined,
          layoutKey: undefined
        };
      case 'sidebar':
        return {
          slot: adSlot || '1787815615',
          format: adFormat || 'auto' as const,
          layout: undefined,
          layoutKey: undefined
        };
      case 'rectangle':
        return {
          slot: adSlot || '1787815615',
          format: adFormat || 'rectangle' as const,
          layout: undefined,
          layoutKey: undefined
        };
      case 'multiplex':
        return {
          slot: adSlot || '1787815615',
          format: adFormat || 'auto' as const,
          layout: undefined,
          layoutKey: undefined
        };
      case 'in-article':
      case 'inline':
      default:
        return {
          slot: adSlot || '1787815615',
          format: 'fluid' as const,
          layout: adLayout || 'in-article',
          layoutKey: undefined
        };
    }
  };

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
      case 'in-feed':
        return { 
          ...baseStyle, 
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

    const timer = setTimeout(loadAd, 100);
    return () => clearTimeout(timer);
  }, [adLoaded]);

  const config = getAdConfig();
  const containerClasses = `adsense-container ${className}`;
  const appliedStyle = style || getVariantStyles();

  return (
    <div 
      ref={adRef}
      className={containerClasses}
      style={{ 
        margin: '16px 0',
        backgroundColor: 'transparent'
      }}
    >
      <ins
        className="adsbygoogle"
        style={appliedStyle}
        data-ad-client="ca-pub-1418673216471192"
        data-ad-slot={config.slot}
        data-ad-format={config.format}
        data-full-width-responsive="true"
        {...(config.layout && { 'data-ad-layout': config.layout })}
        {...(config.layoutKey && { 'data-ad-layout-key': config.layoutKey })}
      />
    </div>
  );
};

export default AdSenseAd;