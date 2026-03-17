import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { table = "posts" } = await req.json();

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY")!;

    // Determine text field
    const textField = table === "categories" ? "name" : table === "questions" ? "text" : "title";
    const selectCols = `id, ${textField}, image_url`;

    // Fetch all records with image URLs
    const { data: records, error: fetchError } = await supabase
      .from(table)
      .select(selectCols)
      .not("image_url", "is", null)
      .neq("image_url", "");

    if (fetchError) throw fetchError;
    if (!records || records.length === 0) {
      return new Response(JSON.stringify({ message: "No records found", table }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Group by image_url to find duplicates
    const urlGroups: Record<string, any[]> = {};
    for (const r of records) {
      const url = r.image_url;
      if (!url) continue;
      if (!urlGroups[url]) urlGroups[url] = [];
      urlGroups[url].push(r);
    }

    // Collect items that share an image with others (keep the first, replace the rest)
    const needsNewImage: { id: string; text: string }[] = [];
    for (const [_url, group] of Object.entries(urlGroups)) {
      if (group.length > 1) {
        // Keep the first record's image, replace the rest
        for (let i = 1; i < group.length; i++) {
          const r = group[i];
          needsNewImage.push({ id: r.id, text: r[textField] || "" });
        }
      }
    }

    if (needsNewImage.length === 0) {
      return new Response(JSON.stringify({ table, duplicates: 0, message: "All images are unique" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log(`Found ${needsNewImage.length} items with duplicate images in ${table}`);

    // Use text AI to assign unique Unsplash URLs
    const systemPrompt = `You are an image search expert. For each item, provide a UNIQUE and relevant Unsplash photo URL.
Use this format: https://images.unsplash.com/photo-{PHOTO_ID}?w=800&h=500&fit=crop
Use REAL Unsplash photo IDs. Each item MUST get a DIFFERENT photo ID - no duplicates allowed.
Match the photo subject to the item's text content.`;

    const userPrompt = `Assign a unique, relevant Unsplash image URL to each of these ${needsNewImage.length} items. Each MUST have a different photo. Return ONLY the function call.

Items:
${needsNewImage.map((item, i) => `${i + 1}. [${item.id}] "${item.text}"`).join("\n")}`;

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
        tools: [{
          type: "function",
          function: {
            name: "assign_images",
            description: "Assign unique Unsplash image URLs to items",
            parameters: {
              type: "object",
              properties: {
                assignments: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      id: { type: "string" },
                      image_url: { type: "string" },
                    },
                    required: ["id", "image_url"],
                  },
                },
              },
              required: ["assignments"],
            },
          },
        }],
        tool_choice: { type: "function", function: { name: "assign_images" } },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`AI error: ${response.status} ${errText}`);
    }

    const aiData = await response.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) throw new Error("No tool call in AI response");

    const { assignments } = JSON.parse(toolCall.function.arguments);

    // Verify no duplicate URLs in assignments
    const assignedUrls = new Set<string>();
    const uniqueAssignments = assignments.filter((a: any) => {
      if (assignedUrls.has(a.image_url)) return false;
      assignedUrls.add(a.image_url);
      return true;
    });

    // Update records
    let updated = 0;
    for (const assignment of uniqueAssignments) {
      const { error: updateError } = await supabase
        .from(table)
        .update({ image_url: assignment.image_url })
        .eq("id", assignment.id);

      if (!updateError) updated++;
      else console.error(`Failed to update ${assignment.id}:`, updateError);
    }

    return new Response(JSON.stringify({
      table,
      total_records: records.length,
      duplicates_found: needsNewImage.length,
      updated,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("deduplicate-images error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
