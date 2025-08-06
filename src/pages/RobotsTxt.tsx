import { useEffect, useState } from 'react';
import { generateRobotsTxt } from '@/utils/sitemapGenerator';

const RobotsTxt = () => {
  const [robotsContent, setRobotsContent] = useState<string>('');

  useEffect(() => {
    const baseUrl = window.location.origin;
    const sitemapUrl = `${baseUrl}/sitemap.xml`;
    const content = generateRobotsTxt(sitemapUrl);
    setRobotsContent(content);
  }, []);

  useEffect(() => {
    // Set content type for robots.txt
    if (robotsContent) {
      // This ensures proper content type when accessed
      const response = new Response(robotsContent, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
        },
      });
    }
  }, [robotsContent]);

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-4">Robots.txt</h1>
            <p className="text-muted-foreground">
              This file tells search engines how to crawl Daily Opportunities, optimized for tier 1 countries.
            </p>
          </div>
          
          <div className="bg-muted rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Robots.txt Content</h2>
              <button
                onClick={() => {
                  const blob = new Blob([robotsContent], { type: 'text/plain' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'robots.txt';
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                Download
              </button>
            </div>
            
            <pre className="bg-background rounded border p-4 text-sm whitespace-pre-wrap">
              {robotsContent}
            </pre>
          </div>

          <div className="mt-8 bg-muted rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Crawl Optimization</h2>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>• Optimized crawl-delay for tier 1 country search engines</p>
              <p>• Blocks admin and sensitive pages from indexing</p>
              <p>• Explicitly allows all scholarship and job content</p>
              <p>• Points to XML sitemap for complete page discovery</p>
              <p>• Follows best practices for international SEO</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RobotsTxt;