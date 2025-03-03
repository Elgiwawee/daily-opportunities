
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export const ScholarshipScraper = () => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url) {
      toast.error('Please enter a URL');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('fetch-scholarships', {
        body: { url }
      });
      
      if (error) {
        console.error('Error fetching scholarships:', error);
        toast.error('Failed to fetch scholarships: ' + error.message);
        return;
      }
      
      console.log('Scholarship import response:', data);
      toast.success(`Successfully imported scholarships from ${url}`);
      setUrl('');
    } catch (error) {
      console.error('Error:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-olive-800">Import Scholarships</h2>
      <p className="mb-4 text-gray-600">
        Enter the URL of a website to automatically scrape and import scholarship data.
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
            Website URL
          </label>
          <Input
            id="url"
            type="url"
            placeholder="https://example.com/scholarships"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full"
            required
          />
        </div>
        
        <Button
          type="submit"
          className="w-full bg-olive-700 hover:bg-olive-800 text-white"
          disabled={isLoading}
        >
          {isLoading ? 'Importing...' : 'Import Scholarships'}
        </Button>
      </form>
      
      <div className="mt-4 text-sm text-gray-500">
        <p>Note: This tool will attempt to extract scholarship information from the specified website.</p>
        <p>For best results, provide direct links to scholarship listing pages.</p>
      </div>
    </div>
  );
};

export default ScholarshipScraper;
