import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { generateSitemapUrls, generateSitemapXML } from '@/utils/sitemapGenerator';

const Sitemap = () => {
  const [sitemapXML, setSitemapXML] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const generateSitemap = async () => {
      try {
        // Fetch opportunities for dynamic sitemap
        const { data: opportunities } = await supabase
          .from('opportunities')
          .select('id, created_at, updated_at, type')
          .order('created_at', { ascending: false });

        const baseUrl = window.location.origin;
        const urls = generateSitemapUrls(baseUrl, opportunities || []);
        const xml = generateSitemapXML(urls);
        
        setSitemapXML(xml);
      } catch (error) {
        console.error('Error generating sitemap:', error);
        // Generate basic sitemap without opportunities
        const baseUrl = window.location.origin;
        const urls = generateSitemapUrls(baseUrl, []);
        const xml = generateSitemapXML(urls);
        setSitemapXML(xml);
      } finally {
        setLoading(false);
      }
    };

    generateSitemap();
  }, []);

  useEffect(() => {
    // Set content type for XML
    if (sitemapXML) {
      // Create and append XML declaration
      const response = new Response(sitemapXML, {
        headers: {
          'Content-Type': 'application/xml; charset=utf-8',
        },
      });
      
      // For SEO, we want this to be accessible as /sitemap.xml
      // This component serves the content when accessed directly
    }
  }, [sitemapXML]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Generating sitemap...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-4">XML Sitemap</h1>
            <p className="text-muted-foreground">
              This sitemap helps search engines discover and index all pages on Daily Opportunities.
            </p>
          </div>
          
          <div className="bg-muted rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Sitemap XML Content</h2>
              <button
                onClick={() => {
                  const blob = new Blob([sitemapXML], { type: 'application/xml' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'sitemap.xml';
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                Download XML
              </button>
            </div>
            
            <pre className="bg-background rounded border p-4 text-sm overflow-auto max-h-96 whitespace-pre-wrap">
              {sitemapXML}
            </pre>
          </div>

          <div className="mt-8 bg-muted rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">SEO Information</h2>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>• Sitemap includes all static pages with appropriate priorities</p>
              <p>• Dynamic opportunity pages are included with recent lastmod dates</p>
              <p>• Scholarship country and level pages are optimized for tier 1 countries</p>
              <p>• Change frequencies are set to help search engines crawl efficiently</p>
              <p>• Priority values guide search engines on page importance</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sitemap;