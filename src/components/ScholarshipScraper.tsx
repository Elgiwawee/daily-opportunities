
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ScrapedScholarship {
  title: string;
  organization: string;
  deadline: string;
  type: 'scholarship';
  description: string;
  attachments: any[];
}

const ScholarshipScraper = () => {
  const [source, setSource] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [scrapedData, setScrapedData] = useState<ScrapedScholarship[]>([]);

  const handleFetchScholarships = async () => {
    if (!source) {
      toast.error('Please enter a source URL');
      return;
    }

    setIsLoading(true);
    try {
      // Call the edge function to fetch scholarships
      const response = await supabase.functions.invoke('fetch-scholarships', {
        body: { source },
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      const { data, success, message } = response.data;
      
      if (!success) {
        throw new Error(message || 'Failed to fetch scholarships');
      }

      setScrapedData(data);
      toast.success(`Successfully fetched ${data.length} scholarships`);
    } catch (error) {
      console.error('Error fetching scholarships:', error);
      toast.error(error.message || 'Failed to fetch scholarships');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveScholarships = async () => {
    if (scrapedData.length === 0) {
      toast.error('No scholarships to save');
      return;
    }

    setIsLoading(true);
    try {
      // Prepare data for insertion
      const scholarshipsToInsert = scrapedData.map(scholarship => ({
        ...scholarship,
        created_at: new Date().toISOString(),
      }));

      // Insert into the database
      const { error } = await supabase
        .from('opportunities')
        .insert(scholarshipsToInsert);

      if (error) {
        throw error;
      }

      toast.success(`Successfully saved ${scrapedData.length} scholarships`);
      setScrapedData([]);
      setSource('');
    } catch (error) {
      console.error('Error saving scholarships:', error);
      toast.error(error.message || 'Failed to save scholarships');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4">
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Source URL
            </label>
            <Input
              type="text"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              placeholder="Enter website URL to scrape scholarships from"
              className="w-full"
            />
          </div>
          <Button 
            onClick={handleFetchScholarships} 
            disabled={isLoading}
            className="bg-olive-600 text-white hover:bg-olive-700"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Fetching...
              </>
            ) : (
              'Fetch Scholarships'
            )}
          </Button>
        </div>

        {/* Scraped data display */}
        {scrapedData.length > 0 && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">
                Fetched Scholarships ({scrapedData.length})
              </h3>
              <Button 
                onClick={handleSaveScholarships} 
                disabled={isLoading}
                className="bg-olive-600 text-white hover:bg-olive-700"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save All to Database'
                )}
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {scrapedData.map((scholarship, index) => (
                <Card key={index} className="shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{scholarship.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-500 mb-2">
                      {scholarship.organization} | Deadline: {scholarship.deadline}
                    </p>
                    <p className="text-sm line-clamp-3">{scholarship.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScholarshipScraper;
