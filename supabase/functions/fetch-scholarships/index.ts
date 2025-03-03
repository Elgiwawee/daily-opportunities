
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.42.1'

// Define the CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

export const handler = async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create a Supabase client with the service role key
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { url } = await req.json()

    // Log the request
    console.log(`Fetching scholarships from URL: ${url}`)

    // Validate that we received a proper URL
    if (!url || typeof url !== 'string') {
      return new Response(
        JSON.stringify({ 
          error: 'URL is required and must be a string' 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
          status: 400 
        }
      )
    }

    // Placeholder for actual scraping logic
    // In a real implementation, you would use a more advanced method or service to scrape data
    const scholarships = await fetchScholarshipsFromWebsite(url)

    // Store the fetched scholarships in the database
    const { data, error } = await supabaseAdmin
      .from('opportunities')
      .insert(scholarships)
      .select()

    if (error) {
      console.error('Error storing scholarships:', error)
      throw error
    }

    // Return the success response
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Successfully imported ${scholarships.length} scholarships`, 
        data 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
        status: 200 
      }
    )
  } catch (error) {
    console.error('Scholarship fetch error:', error)
    return new Response(
      JSON.stringify({ error: error.message || 'An unexpected error occurred' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
        status: 500 
      }
    )
  }
}

// This is a simplified placeholder function for scholarship scraping
// In a real implementation, you would use a proper scraping service or library
async function fetchScholarshipsFromWebsite(url: string) {
  // For demonstration purposes, we'll return mock data
  // In a real implementation, you would:
  // 1. Fetch the HTML content from the URL
  // 2. Parse it to extract scholarship information
  // 3. Format the data according to your database schema
  
  try {
    const response = await fetch(url)
    const html = await response.text()
    
    console.log(`Successfully fetched HTML content from ${url}`)
    
    // Here you would parse the HTML and extract scholarship information
    // For now, we'll return mock data
    return [
      {
        title: `Scholarship from ${new URL(url).hostname}`,
        organization: `Sourced from ${new URL(url).hostname}`,
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
        type: 'scholarship',
        description: `This scholarship was automatically scraped from ${url}. The description would typically contain details about the scholarship, requirements, and application process.`,
        country: 'Various',
        level: 'Undergraduate',
        region: 'International',
        attachments: [],
        source_url: url,
        created_at: new Date().toISOString(),
      }
    ]
  } catch (error) {
    console.error(`Error fetching content from ${url}:`, error)
    throw new Error(`Failed to fetch scholarship data from ${url}: ${error.message}`)
  }
}

Deno.serve(handler)
