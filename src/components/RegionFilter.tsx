
import React from 'react';
import { Button } from '@/components/ui/button';

export interface RegionFilterProps {
  onRegionChange: (region: string | null) => void;
  activeRegion: string | null;
}

const RegionFilter = ({ onRegionChange, activeRegion }: RegionFilterProps) => {
  const regions = [
    { id: 'all', name: 'All Regions' },
    { id: 'africa', name: 'Africa' },
    { id: 'asia', name: 'Asia' },
    { id: 'europe', name: 'Europe' },
    { id: 'north_america', name: 'North America' },
    { id: 'south_america', name: 'South America' },
    { id: 'oceania', name: 'Oceania' },
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {regions.map((region) => (
        <Button
          key={region.id}
          onClick={() => onRegionChange(region.id === 'all' ? null : region.id)}
          variant={activeRegion === (region.id === 'all' ? null : region.id) ? 'default' : 'outline'}
          className={activeRegion === (region.id === 'all' ? null : region.id) 
            ? 'bg-olive-600 hover:bg-olive-700' 
            : 'border border-olive-600 text-olive-700 hover:bg-olive-50'}
        >
          {region.name}
        </Button>
      ))}
    </div>
  );
};

export default RegionFilter;
