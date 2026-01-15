import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface PrayerRequestPayload {
  name: string;
  email: string;
  prayerRequest: string;
  userId?: string | null;
}

// HTML escape function to prevent XSS
function escapeHtml(text: string): string {
  const htmlEscapes: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, (char) => htmlEscapes[char]);
}

// Input validation
function validateInput(payload: any): { valid: boolean; error?: string } {
  const { name, email, prayerRequest } = payload;

  // Check required fields
  if (!name || typeof name !== 'string') {
    return { valid: false, error: 'Name is required' };
  }
  if (!prayerRequest || typeof prayerRequest !== 'string') {
    return { valid: false, error: 'Prayer request is required' };
  }

  // Check length limits
  if (name.trim().length === 0 || name.length > 100) {
    return { valid: false, error: 'Name must be between 1 and 100 characters' };
  }
  if (prayerRequest.trim().length === 0 || prayerRequest.length > 2000) {
    return { valid: false, error: 'Prayer request must be between 1 and 2000 characters' };
  }

  // Validate email format if provided
  if (email && typeof email === 'string' && email.trim().length > 0) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email) || email.length > 255) {
      return { valid: false, error: 'Invalid email format' };
    }
  }

  return { valid: true };
}

const handler = async (req: Request): Promise<Response> => {
  console.log("Received prayer request submission");

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payload = await req.json();
    
    // Validate input
    const validation = validateInput(payload);
    if (!validation.valid) {
      console.log("Validation failed:", validation.error);
      return new Response(
        JSON.stringify({ error: validation.error }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const { name, email, prayerRequest, userId }: PrayerRequestPayload = payload;

    // Sanitize inputs for HTML
    const safeName = escapeHtml(name.trim());
    const safeEmail = email ? escapeHtml(email.trim()) : 'Not provided';
    const safePrayerRequest = escapeHtml(prayerRequest.trim());

    console.log(`Processing prayer request from ${safeName}${userId ? ` (user: ${userId})` : ' (anonymous)'}`);

    // Store prayer request in database
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const { data: dbData, error: dbError } = await supabase
      .from('prayer_requests')
      .insert({
        name: name.trim(),
        email: email?.trim() || null,
        prayer_request: prayerRequest.trim(),
        status: 'pending',
        user_id: userId || null
      })
      .select('id')
      .single();

    if (dbError) {
      console.error("Database error:", dbError);
      // Continue with email even if DB fails - don't block the user
    } else {
      console.log("Prayer request stored with ID:", dbData?.id);
    }

    // Send email notification
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Zealous App <onboarding@resend.dev>",
        to: ["scripturalzealous@gmail.com"],
        subject: `New Prayer Request from ${safeName}`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #000; border-bottom: 2px solid #000; padding-bottom: 10px;">New Prayer Request</h1>
            
            <div style="margin: 20px 0;">
              <p style="margin: 5px 0;"><strong>Name:</strong> ${safeName}</p>
              <p style="margin: 5px 0;"><strong>Email:</strong> ${safeEmail}</p>
              ${dbData?.id ? `<p style="margin: 5px 0;"><strong>Request ID:</strong> ${dbData.id}</p>` : ''}
            </div>
            
            <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #333;">Prayer Request:</h3>
              <p style="color: #333; line-height: 1.6; white-space: pre-wrap;">${safePrayerRequest}</p>
            </div>
            
            <p style="color: #666; font-size: 12px; margin-top: 30px;">
              This prayer request was submitted through the Zealous app.
            </p>
          </div>
        `,
      }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error("Resend API error:", errorData);
      throw new Error("Failed to send email");
    }

    const emailResponse = await res.json();
    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, data: emailResponse }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error sending prayer request email:", error);
    
    // Return generic error to client - don't expose internal error details
    return new Response(
      JSON.stringify({ error: "Unable to process prayer request. Please try again later." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
