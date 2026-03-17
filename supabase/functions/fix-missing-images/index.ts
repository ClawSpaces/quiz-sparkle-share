import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { type = "answers", offset = 0, limit = 25 } = await req.json();
    
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Fetch records missing image_url
    const selectCols = type === "results" ? "id, title, description" : "id, text";
    const { data: records, error: fetchError } = await supabase
      .from(type)
      .select(selectCols)
      .is("image_url", null)
      .range(offset, offset + limit - 1);

    if (fetchError) throw fetchError;
    if (!records || records.length === 0) {
      return new Response(JSON.stringify({ message: "No records to fix", type, count: 0 }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Build items list for AI
    const items = records.map((r: any) => ({
      id: r.id,
      text: type === "results" ? `${r.title}: ${r.description || ""}` : r.text,
    }));

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY")!;

    const systemPrompt = `You are an image search expert. For each item, provide a relevant Unsplash photo URL.
Use this format: https://images.unsplash.com/photo-{PHOTO_ID}?w=600&h=400&fit=crop
Use REAL Unsplash photo IDs. Pick photos that visually match the text content.
For food items, use food photos. For places, use landscape photos. For people/celebrities, use relevant aesthetic photos.
For colors, use photos dominated by that color. For animals, use animal photos. For abstract concepts, use artistic photos.`;

    const userPrompt = `Assign a unique, relevant Unsplash image URL to each of these ${items.length} items. Return ONLY the function call, nothing else.

Items:
${items.map((item: any, i: number) => `${i + 1}. [${item.id}] "${item.text}"`).join("\n")}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "assign_images",
              description: "Assign Unsplash image URLs to items",
              parameters: {
                type: "object",
                properties: {
                  assignments: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "string", description: "The record UUID" },
                        image_url: { type: "string", description: "Full Unsplash URL" },
                      },
                      required: ["id", "image_url"],
                      additionalProperties: false,
                    },
                  },
                },
                required: ["assignments"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "assign_images" } },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("AI error:", response.status, errText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const aiData = await response.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) throw new Error("No tool call in AI response");

    const { assignments } = JSON.parse(toolCall.function.arguments);
    
    // Update records in DB
    let updated = 0;
    for (const assignment of assignments) {
      const { error: updateError } = await supabase
        .from(type)
        .update({ image_url: assignment.image_url })
        .eq("id", assignment.id);
      
      if (!updateError) updated++;
      else console.error(`Failed to update ${assignment.id}:`, updateError);
    }

    return new Response(
      JSON.stringify({
        type,
        total_records: records.length,
        updated,
        remaining_offset: offset + limit,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("fix-missing-images error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
