
import { Dispatch, SetStateAction } from 'react';
import { Button } from '@/components/ui/button';

export interface RegionFilterProps {
  selectedRegion: string | null;
  setSelectedRegion: Dispatch<SetStateAction<string | null>>;
}

const RegionFilter = ({ selectedRegion, setSelectedRegion }: RegionFilterProps) => {
  const regions = [
    { id: 'All', name: 'All Regions' },
    { id: 'Africa', name: 'Africa' },
    { id: 'Asia', name: 'Asia' },
    { id: 'Europe', name: 'Europe' },
    { id: 'North America', name: 'North America' },
    { id: 'South America', name: 'South America' },
    { id: 'Oceania', name: 'Oceania' },
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {regions.map((region) => (
        <Button
          key={region.id}
          onClick={() => setSelectedRegion(region.id === 'All' ? null : region.id)}
          variant={selectedRegion === region.id || (region.id === 'All' && selectedRegion === null) ? 'default' : 'outline'}
          className={selectedRegion === region.id || (region.id === 'All' && selectedRegion === null) 
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
