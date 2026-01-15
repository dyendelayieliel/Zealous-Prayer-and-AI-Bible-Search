import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface DailyVerseRequest {
  userFeelings: string[];
  date: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userFeelings, date }: DailyVerseRequest = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Build context from user's feeling history
    const feelingsContext = userFeelings.length > 0
      ? `The user has recently shared these feelings and experiences: ${userFeelings.slice(-5).join("; ")}`
      : "This is a new user with no history yet.";

    const systemPrompt = `You are a compassionate Bible verse selector for the Zealous app. Your job is to select an encouraging, relevant Bible verse for the user's daily devotional.

${feelingsContext}

Based on their journey, select ONE Bible verse that would speak to their heart today. The verse should:
1. Be encouraging and uplifting
2. Relate to their recent feelings if they have shared any
3. Be from the NIV or NLT translation
4. Include the full verse text and reference

Respond ONLY with a JSON object in this exact format (no markdown, no code blocks):
{"verse": "The full verse text here", "reference": "Book Chapter:Verse", "reflection": "A brief 1-2 sentence reflection on why this verse might speak to them today"}`;

    console.log("Fetching personalized verse for date:", date);
    console.log("User feelings count:", userFeelings.length);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Please select an encouraging Bible verse for today (${date}). Make sure it's different from common verses like Jeremiah 29:11 or Philippians 4:13 - find something that might be new to them.` }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        console.error("Rate limit exceeded");
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        console.error("Payment required");
        return new Response(
          JSON.stringify({ error: "Service temporarily unavailable." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("Failed to get verse from AI");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No content in AI response");
    }

    console.log("AI response:", content);

    // Parse the JSON response
    let verseData;
    try {
      // Clean up potential markdown formatting
      const cleanContent = content.replace(/```json\n?|\n?```/g, '').trim();
      verseData = JSON.parse(cleanContent);
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      // Fallback verse if parsing fails
      verseData = {
        verse: "The Lord is my shepherd; I shall not want. He makes me lie down in green pastures. He leads me beside still waters. He restores my soul.",
        reference: "Psalm 23:1-3",
        reflection: "May you find peace and restoration in God's loving care today."
      };
    }

    console.log("Returning verse:", verseData.reference);

    return new Response(JSON.stringify(verseData), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error getting daily verse:", error);
    
    // Return a fallback verse instead of an error
    const fallbackVerse = {
      verse: "The Lord is my shepherd; I shall not want. He makes me lie down in green pastures. He leads me beside still waters. He restores my soul.",
      reference: "Psalm 23:1-3",
      reflection: "May you find peace and restoration in God's loving care today."
    };
    
    return new Response(JSON.stringify(fallbackVerse), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
