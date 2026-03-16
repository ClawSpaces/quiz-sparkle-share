import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { table = "quizzes", offset = 0, limit = 25 } = await req.json();

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Determine columns based on table
    let selectCols: string;
    let textField: string;
    switch (table) {
      case "posts":
        selectCols = "id, title, image_url";
        textField = "title";
        break;
      case "quizzes":
        selectCols = "id, title, image_url";
        textField = "title";
        break;
      case "questions":
        selectCols = "id, text, image_url";
        textField = "text";
        break;
      case "answers":
        selectCols = "id, text, image_url";
        textField = "text";
        break;
      case "results":
        selectCols = "id, title, description, image_url";
        textField = "title";
        break;
      case "categories":
        selectCols = "id, name, image_url";
        textField = "name";
        break;
      case "buzz_chats":
        selectCols = "id, question, image_url";
        textField = "question";
        break;
      default:
        throw new Error(`Unsupported table: ${table}`);
    }

    // Fetch records that have an image_url set
    const { data: records, error: fetchError } = await supabase
      .from(table)
      .select(selectCols)
      .not("image_url", "is", null)
      .neq("image_url", "")
      .range(offset, offset + limit - 1);

    if (fetchError) throw fetchError;
    if (!records || records.length === 0) {
      return new Response(JSON.stringify({ message: "No records to check", table, count: 0 }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Test each URL with a HEAD request
    const broken: { id: string; text: string }[] = [];
    
    await Promise.all(
      records.map(async (r: any) => {
        try {
          const res = await fetch(r.image_url, { method: "HEAD", redirect: "follow" });
          if (!res.ok) {
            const text = r[textField] || r.title || r.text || r.name || r.question || "";
            broken.push({ id: r.id, text: typeof text === "string" ? text : String(text) });
          }
        } catch {
          const text = r[textField] || r.title || r.text || r.name || r.question || "";
          broken.push({ id: r.id, text: typeof text === "string" ? text : String(text) });
        }
      })
    );

    if (broken.length === 0) {
      return new Response(JSON.stringify({
        table,
        checked: records.length,
        broken: 0,
        remaining_offset: offset + limit,
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Use AI to generate replacement URLs
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY")!;

    const systemPrompt = `You are an image search expert. For each item, provide a relevant Unsplash photo URL.
Use this format: https://images.unsplash.com/photo-{PHOTO_ID}?w=600&h=400&fit=crop
Use REAL Unsplash photo IDs that you know exist. Pick photos that visually match the text content.
For food items, use food photos. For places, use landscape photos. For celebrities, use relevant aesthetic photos.
For colors, use photos dominated by that color. For animals, use animal photos. For abstract concepts, use artistic photos.`;

    const userPrompt = `Assign a unique, relevant Unsplash image URL to each of these ${broken.length} items. Return ONLY the function call, nothing else.

Items:
${broken.map((item, i) => `${i + 1}. [${item.id}] "${item.text}"`).join("\n")}`;

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
        .from(table)
        .update({ image_url: assignment.image_url })
        .eq("id", assignment.id);

      if (!updateError) updated++;
      else console.error(`Failed to update ${assignment.id}:`, updateError);
    }

    return new Response(
      JSON.stringify({
        table,
        checked: records.length,
        broken: broken.length,
        updated,
        remaining_offset: offset + limit,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("fix-broken-images error:", e);
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
