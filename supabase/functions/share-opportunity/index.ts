import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const opportunityId = url.searchParams.get('id');

    if (!opportunityId) {
      // Redirect to main app if no ID provided
      return new Response(null, {
        status: 302,
        headers: {
          'Location': 'https://daily-opportunities.lovable.app/',
          ...corsHeaders
        }
      });
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch opportunity data
    const { data: opportunity, error } = await supabase
      .from('opportunities')
      .select('*')
      .eq('id', opportunityId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching opportunity:', error);
      return new Response(null, {
        status: 302,
        headers: {
          'Location': 'https://daily-opportunities.lovable.app/',
          ...corsHeaders
        }
      });
    }

    if (!opportunity) {
      return new Response(null, {
        status: 302,
        headers: {
          'Location': 'https://daily-opportunities.lovable.app/',
          ...corsHeaders
        }
      });
    }

    // Extract and format image URL for social media compatibility
    let imageUrl = 'https://daily-opportunities.lovable.app/og-image.png';
    let imageType = 'image/png';
    
    if (opportunity.attachments && opportunity.attachments.length > 0) {
      const firstAttachment = opportunity.attachments[0];
      let rawImageUrl = '';
      
      if (typeof firstAttachment === 'string') {
        rawImageUrl = firstAttachment;
      } else if (firstAttachment && typeof firstAttachment === 'object' && firstAttachment.url) {
        rawImageUrl = firstAttachment.url;
      }
      
      if (rawImageUrl && rawImageUrl.includes('supabase')) {
        // Clean URL and ensure public access
        const cleanUrl = rawImageUrl.split('?')[0];
        // Make sure it's the public URL format
        if (cleanUrl.includes('/storage/v1/object/public/')) {
          imageUrl = cleanUrl;
          // Detect image type from URL
          if (cleanUrl.toLowerCase().includes('.jpg') || cleanUrl.toLowerCase().includes('.jpeg')) {
            imageType = 'image/jpeg';
          } else if (cleanUrl.toLowerCase().includes('.png')) {
            imageType = 'image/png';
          } else if (cleanUrl.toLowerCase().includes('.webp')) {
            imageType = 'image/webp';
          }
        }
      } else if (rawImageUrl) {
        imageUrl = rawImageUrl;
        // Detect type for external URLs too
        if (rawImageUrl.toLowerCase().includes('.jpg') || rawImageUrl.toLowerCase().includes('.jpeg')) {
          imageType = 'image/jpeg';
        }
      }
    }

    // Clean description for meta tags
    const cleanDescription = opportunity.description
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .substring(0, 160) // Limit to 160 characters
      .trim();

    const title = `${opportunity.title} - ${opportunity.organization} - Daily Opportunities`;
    const appUrl = `https://daily-opportunities.lovable.app/?opportunity=${opportunityId}`;

    // Generate HTML with proper meta tags
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    
    <!-- Standard meta tags -->
    <meta name="description" content="${cleanDescription}" />
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="article" />
    <meta property="og:url" content="${appUrl}" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${cleanDescription}" />
    <meta property="og:image" content="${imageUrl}" />
    <meta property="og:site_name" content="Daily Opportunities" />
    
    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image" />
    <meta property="twitter:url" content="${appUrl}" />
    <meta property="twitter:title" content="${title}" />
    <meta property="twitter:description" content="${cleanDescription}" />
    <meta property="twitter:image" content="${imageUrl}" />
    
    <!-- WhatsApp -->
    <meta property="image" content="${imageUrl}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:type" content="${imageType}" />
    <meta property="og:image:secure_url" content="${imageUrl}" />
    
    <!-- Redirect to main app after 2 seconds -->
    <meta http-equiv="refresh" content="2;url=${appUrl}">
    
    <style>
        body {
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            background-color: #f5f5f5;
        }
        .container {
            text-align: center;
            background: white;
            padding: 2rem;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            max-width: 500px;
        }
        .opportunity-title {
            color: #333;
            margin-bottom: 1rem;
        }
        .organization {
            color: #666;
            margin-bottom: 1rem;
        }
        .loading {
            color: #999;
        }
        .btn {
            background: #007bff;
            color: white;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 1rem;
            display: inline-block;
        }
    </style>
</head>
<body>
    <div class="container">
        <h2 class="opportunity-title">${opportunity.title}</h2>
        <p class="organization">${opportunity.organization}</p>
        <p class="loading">Loading opportunity details...</p>
        <p>You will be redirected automatically, or <a href="${appUrl}" class="btn">click here</a> to view now.</p>
    </div>
    
    <script>
        // Immediate redirect as backup
        setTimeout(() => {
            window.location.href = "${appUrl}";
        }, 1000);
    </script>
</body>
</html>`;

    return new Response(html, {
      headers: {
        'Content-Type': 'text/html',
        ...corsHeaders
      }
    });

  } catch (error) {
    console.error('Error in share-opportunity function:', error);
    return new Response(null, {
      status: 302,
      headers: {
        'Location': 'https://daily-opportunities.lovable.app/',
        ...corsHeaders
      }
    });
  }
});