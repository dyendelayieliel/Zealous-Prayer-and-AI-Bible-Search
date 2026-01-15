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

// Simple in-memory rate limiting (resets on function cold start)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(key: string, maxRequests: number, windowSeconds: number): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const windowMs = windowSeconds * 1000;
  
  const record = rateLimitMap.get(key);
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
    return { allowed: true, remaining: maxRequests - 1 };
  }
  
  if (record.count >= maxRequests) {
    return { allowed: false, remaining: 0 };
  }
  
  record.count++;
  return { allowed: true, remaining: maxRequests - record.count };
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
    // Rate limiting: 5 requests per minute per IP
    const clientIP = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
                     req.headers.get('x-real-ip') || 
                     'unknown';
    
    const rateLimit = checkRateLimit(clientIP, 5, 60);
    
    if (!rateLimit.allowed) {
      console.log(`Rate limit exceeded for IP: ${clientIP}`);
      return new Response(
        JSON.stringify({ error: "Too many requests. Please wait a moment before trying again." }),
        {
          status: 429,
          headers: { 
            "Content-Type": "application/json", 
            "Retry-After": "60",
            ...corsHeaders 
          },
        }
      );
    }

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

    // Store prayer request in database using service role to bypass RLS
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Insert prayer request (without email - email goes to separate restricted table)
    const { data: dbData, error: dbError } = await supabase
      .from('prayer_requests')
      .insert({
        name: name.trim(),
        prayer_request: prayerRequest.trim(),
        status: 'pending',
        user_id: userId || null
      })
      .select('id')
      .single();

    if (dbError) {
      console.error("Database error occurred");
      // Continue with email even if DB fails - don't block the user
    } else {
      console.log("Prayer request stored with ID:", dbData?.id);
      
      // Store email in separate restricted table if provided
      if (email?.trim() && dbData?.id) {
        const { error: contactError } = await supabase
          .from('prayer_contact_info')
          .insert({
            prayer_request_id: dbData.id,
            email: email.trim()
          });
        
        if (contactError) {
          console.error("Failed to store contact info");
        } else {
          console.log("Contact info stored separately");
        }
      }
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
      console.error("Email sending failed");
      throw new Error("Failed to send email");
    }

    const emailResponse = await res.json();
    console.log("Email sent successfully");

    return new Response(JSON.stringify({ success: true, data: emailResponse }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error processing prayer request");
    
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