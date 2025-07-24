import { useEffect } from 'react';
import { cn } from '@/lib/utils';

interface GoogleAdCardProps {
  adSlot: string;
  adFormat?: 'horizontal' | 'vertical' | 'square';
  className?: string;
}

const GoogleAdCard = ({ adSlot, adFormat = 'horizontal', className }: GoogleAdCardProps) => {
  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.log('AdSense error:', err);
    }
  }, []);

  const getAdStyle = () => {
    switch (adFormat) {
      case 'horizontal':
        return {
          display: 'block',
          width: '100%',
          height: '120px'
        };
      case 'vertical':
        return {
          display: 'block',
          width: '300px',
          height: '600px'
        };
      case 'square':
        return {
          display: 'block',
          width: '300px',
          height: '250px'
        };
      default:
        return {
          display: 'block',
          width: '100%',
          height: '120px'
        };
    }
  };

  return (
    <div className={cn("flex justify-center bg-muted/20 border border-border rounded-lg p-4", className)}>
      <ins
        className="adsbygoogle"
        style={getAdStyle()}
        data-ad-client="ca-pub-4656c562-5e21-4973-90e8-d81b29bc4aeb"
        data-ad-slot={adSlot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
};

export default GoogleAdCard;