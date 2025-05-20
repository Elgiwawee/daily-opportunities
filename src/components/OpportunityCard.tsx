
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { Support } from 'lucide-react';

// Import specific exports from date-fns locales (not default exports)
import { arSA } from 'date-fns/locale/ar-SA';
import { enUS } from 'date-fns/locale/en-US';

// Define proper type for opportunity prop
interface OpportunityCardProps {
  opportunity: {
    id: string;
    title: string;
    organization: string;
    deadline?: string | Date;
    type?: string;
    description?: string;
    attachments?: any;
    created_at?: string;
    external_url?: string;
    featured?: boolean;
    image?: string;
  };
  onClick: (opportunity: any) => void;
}

const OpportunityCard: React.FC<OpportunityCardProps> = ({ opportunity, onClick }) => {
  const { t, i18n } = useTranslation();

  // Select locale based on current language
  const locale = i18n.language === 'ar' ? arSA : enUS;

  // Default placeholder image if none is provided
  const imageUrl = opportunity.image || '/placeholder.svg';

  return (
    <Card className="h-full flex flex-col hover:shadow-md transition-shadow overflow-hidden">
      <div className="relative">
        <div className="h-48 w-full bg-gray-200 overflow-hidden">
          <img 
            src={imageUrl} 
            alt={opportunity.title} 
            className="w-full h-full object-cover"
          />
        </div>
        {opportunity.type && (
          <div className="absolute top-2 left-2">
            <Badge className="bg-primary text-white">
              {t(`opportunity.types.${opportunity.type}`)}
            </Badge>
          </div>
        )}
        <div className="absolute top-2 right-2">
          <button className="bg-white/80 p-1 rounded-full hover:bg-white transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
            </svg>
          </button>
        </div>
      </div>
      
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold line-clamp-2">{opportunity.title}</CardTitle>
      </CardHeader>
      
      <CardContent className="py-2 flex-grow">
        <div className="text-sm text-gray-600 mb-1">
          {opportunity.organization}
        </div>
        {opportunity.deadline && (
          <div className="text-xs text-gray-500">
            <span className="font-medium">{t('opportunity.deadline')}: </span>
            {typeof opportunity.deadline === 'string' 
              ? opportunity.deadline
              : format(new Date(opportunity.deadline), 'PPP', { locale })}
          </div>
        )}
        <div className="mt-3 line-clamp-3 text-sm text-gray-700">
          {opportunity.description ? (
            <div dangerouslySetInnerHTML={{ __html: opportunity.description.substring(0, 150) + '...' }} />
          ) : (
            <p>{t('opportunity.noDescription')}</p>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="pt-2 flex gap-2">
        <Button onClick={() => onClick(opportunity)} className="flex-1 bg-primary hover:bg-primary/90">
          {t('opportunity.howToApply')}
        </Button>
        <Button variant="outline" className="px-2">
          <Support className="h-5 w-5" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default OpportunityCard;
