
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
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    const { opportunity } = await req.json() as { opportunity: Opportunity };
    
    if (!opportunity || !opportunity.id) {
      return new Response(
        JSON.stringify({ error: "Invalid opportunity data" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
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
