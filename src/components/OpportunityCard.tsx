
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';

// Import specific exports from date-fns locales (not default exports)
import { arSA } from 'date-fns/locale/ar-SA';
import { enUS } from 'date-fns/locale/en-US';

const OpportunityCard = ({ opportunity, onClick }) => {
  const { t, i18n } = useTranslation();

  // Select locale based on current language
  const locale = i18n.language === 'ar' ? arSA : enUS;

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-bold line-clamp-2">{opportunity.title}</CardTitle>
          {opportunity.type && (
            <Badge variant="outline" className="ml-2">
              {opportunity.type}
            </Badge>
          )}
        </div>
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
      
      <CardFooter className="pt-2">
        <Button onClick={() => onClick(opportunity)} className="w-full">
          {t('buttons.viewDetails')}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default OpportunityCard;
