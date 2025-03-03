
import { useState } from 'react';
import { ChevronDown, X } from 'lucide-react';

interface RegionFilterProps {
  onFilterChange: (regions: string[]) => void;
}

const RegionFilter = ({ onFilterChange }: RegionFilterProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  
  const regions = [
    'North America',
    'Europe',
    'Asia',
    'Africa',
    'South America',
    'Oceania',
    'Middle East'
  ];
  
  const countries = {
    'North America': ['USA', 'Canada', 'Mexico'],
    'Europe': ['UK', 'Germany', 'France', 'Spain', 'Italy'],
    'Asia': ['Japan', 'China', 'India', 'South Korea', 'Singapore'],
    'Africa': ['Nigeria', 'South Africa', 'Kenya', 'Egypt', 'Ghana'],
    'South America': ['Brazil', 'Argentina', 'Colombia', 'Chile', 'Peru'],
    'Oceania': ['Australia', 'New Zealand', 'Fiji'],
    'Middle East': ['UAE', 'Saudi Arabia', 'Qatar', 'Israel', 'Turkey']
  };
  
  const toggleRegion = (region: string) => {
    setSelectedRegions(prev => {
      const newSelection = prev.includes(region)
        ? prev.filter(r => r !== region)
        : [...prev, region];
      
      onFilterChange(newSelection);
      return newSelection;
    });
  };
  
  const clearFilters = () => {
    setSelectedRegions([]);
    onFilterChange([]);
  };
  
  return (
    <div className="mb-8">
      <div className="flex flex-wrap items-center gap-2 mb-2">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm text-gray-700 hover:bg-gray-50"
        >
          Filter by Region
          <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        
        {selectedRegions.map(region => (
          <div key={region} className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-sm">
            {region}
            <button 
              onClick={() => toggleRegion(region)}
              className="text-blue-600 hover:text-blue-800"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
        
        {selectedRegions.length > 0 && (
          <button
            onClick={clearFilters}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Clear all
          </button>
        )}
      </div>
      
      {isOpen && (
        <div className="bg-white border border-gray-200 rounded-md shadow-lg p-4 mt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {regions.map(region => (
              <div key={region} className="space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={`region-${region}`}
                    checked={selectedRegions.includes(region)}
                    onChange={() => toggleRegion(region)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor={`region-${region}`} className="font-medium text-gray-700">
                    {region}
                  </label>
                </div>
                
                <div className="pl-6 space-y-1">
                  {countries[region as keyof typeof countries].map(country => (
                    <div key={country} className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">
                        • {country}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RegionFilter;
