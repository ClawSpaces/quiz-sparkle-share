import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { table, offset = 0, limit = 50 } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    let rows: any[] = [];
    let fieldsToTranslate: string[] = [];

    if (table === "questions") {
      fieldsToTranslate = ["text"];
      const { data, error } = await supabase
        .from("questions")
        .select("id, text")
        .order("created_at")
        .range(offset, offset + limit - 1);
      if (error) throw error;
      rows = data || [];
    } else if (table === "answers") {
      fieldsToTranslate = ["text"];
      const { data, error } = await supabase
        .from("answers")
        .select("id, text")
        .order("created_at")
        .range(offset, offset + limit - 1);
      if (error) throw error;
      rows = data || [];
    } else if (table === "results") {
      fieldsToTranslate = ["title", "description"];
      const { data, error } = await supabase
        .from("results")
        .select("id, title, description")
        .order("created_at")
        .range(offset, offset + limit - 1);
      if (error) throw error;
      rows = data || [];
    } else {
      return new Response(JSON.stringify({ error: "Invalid table" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (rows.length === 0) {
      return new Response(
        JSON.stringify({ success: true, translated: 0, message: "No more rows" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if content is already in English (simple heuristic)
    const greekPattern = /[\u0370-\u03FF\u1F00-\u1FFF]/;
    const greekRows = rows.filter(row => {
      return fieldsToTranslate.some(field => row[field] && greekPattern.test(row[field]));
    });

    if (greekRows.length === 0) {
      return new Response(
        JSON.stringify({ success: true, translated: 0, skipped: rows.length, message: "All already in English" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Build translation request
    const itemsToTranslate = greekRows.map(row => {
      const obj: any = { id: row.id };
      fieldsToTranslate.forEach(f => { obj[f] = row[f] || ""; });
      return obj;
    });

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `You are a translator. Translate Greek text to natural, engaging English. Keep the same tone and style. For quiz questions, keep them fun and BuzzFeed-style. Return a JSON array with the same structure as input, with translated text. Keep the id field unchanged. Only output valid JSON, no markdown.`
          },
          {
            role: "user",
            content: `Translate these ${table} from Greek to English. Return a JSON array:\n\n${JSON.stringify(itemsToTranslate)}`
          }
        ],
        temperature: 0.3,
      }),
    });

    if (!aiResponse.ok) {
      const errText = await aiResponse.text();
      throw new Error(`AI error: ${aiResponse.status} ${errText}`);
    }

    const aiData = await aiResponse.json();
    let content = aiData.choices?.[0]?.message?.content || "";
    
    // Clean markdown code blocks if present
    content = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    
    let translated: any[];
    try {
      translated = JSON.parse(content);
    } catch {
      console.error("Failed to parse AI response:", content.substring(0, 500));
      throw new Error("Failed to parse translation response");
    }

    // Update each row
    let updated = 0;
    for (const item of translated) {
      const updateData: any = {};
      fieldsToTranslate.forEach(f => {
        if (item[f]) updateData[f] = item[f];
      });
      
      if (Object.keys(updateData).length > 0) {
        const { error } = await supabase
          .from(table)
          .update(updateData)
          .eq("id", item.id);
        
        if (error) {
          console.error(`Update error for ${item.id}:`, error);
        } else {
          updated++;
        }
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        translated: updated, 
        total_in_batch: rows.length,
        greek_found: greekRows.length,
        offset,
        next_offset: offset + limit 
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("Error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
