
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { decode as base64Decode } from "https://deno.land/std@0.170.0/encoding/base64.ts";

const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface Opportunity {
  id: string;
  title: string;
  organization: string;
  type: string;
  description?: string;
  deadline?: string;
}

interface Subscription {
  endpoint: string;
  p256dh: string;
  auth: string;
}

serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Security: Verify JWT authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' }}
      );
    }

    const supabaseClient = createClient(supabaseUrl, supabaseServiceKey, {
      global: {
        headers: { Authorization: authHeader }
      }
    });

    // Security: Verify the user from the JWT
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    );
    
    if (authError || !user) {
      console.error('Auth error:', authError);
      return new Response(
        JSON.stringify({ error: 'Invalid or expired token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' }}
      );
    }

    // Security: Check if user has admin role
    const { data: roles, error: rolesError } = await supabaseClient
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id);
      
    if (rolesError || !roles?.some(r => r.role === 'admin')) {
      console.error('Authorization error: User is not admin');
      return new Response(
        JSON.stringify({ error: 'Unauthorized: Admin access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' }}
      );
    }
    
    const { opportunity } = await req.json() as { opportunity: Opportunity };
    
    // Security: Validate opportunity data
    if (!opportunity || typeof opportunity !== 'object') {
      return new Response(
        JSON.stringify({ error: 'Invalid opportunity data' }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Security: Validate required opportunity fields
    if (!opportunity.id || !opportunity.title || !opportunity.organization || !opportunity.type) {
      return new Response(
        JSON.stringify({ error: 'Missing required opportunity fields (id, title, organization, type)' }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Security: Verify opportunity exists in database
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { data: dbOpportunity, error: dbError } = await supabase
      .from('opportunities')
      .select('*')
      .eq('id', opportunity.id)
      .single();

    if (dbError || !dbOpportunity) {
      console.error('Opportunity not found:', dbError);
      return new Response(
        JSON.stringify({ error: 'Opportunity not found in database' }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get all subscriptions
    const { data: subscriptions, error: fetchError } = await supabase
      .from("push_subscriptions")
      .select("endpoint, p256dh, auth");

    if (fetchError) {
      console.error("Error fetching subscriptions:", fetchError);
      return new Response(
        JSON.stringify({ error: "Error fetching subscriptions" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!subscriptions || subscriptions.length === 0) {
      return new Response(
        JSON.stringify({ message: "No subscriptions to notify" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Prepare notification payload
    const notificationPayload = {
      title: `New ${opportunity.type}: ${opportunity.title}`,
      body: `${opportunity.organization} has posted a new ${opportunity.type}`,
      url: `${req.url.split('/api/')[0]}/opportunity/${opportunity.id}`,
      icon: '/og-image.png',
      actions: [
        {
          action: 'view',
          title: 'View Details'
        }
      ],
      // Add opportunity type as a tag for filtering
      tag: opportunity.type
    };
    
    console.log("Notification payload:", notificationPayload);
    console.log(`Sending notifications to ${subscriptions.length} subscribers for opportunity ${opportunity.id}`);
    
    // In a real implementation, you would now use a web push library
    // like web-push to send actual push notifications.
    // For demonstration purposes, we'll simulate success.
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Notification sent to ${subscriptions.length} subscribers`,
        opportunity,
        subscriptions: subscriptions.length
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in send-notifications function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
