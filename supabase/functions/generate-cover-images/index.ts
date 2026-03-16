import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { decode } from "https://deno.land/std@0.168.0/encoding/base64.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { table = "quizzes", offset = 0, limit = 20, max_fix = 2 } = await req.json();

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY")!;
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;

    // Determine columns based on table
    let selectCols: string;
    let textField: string;
    let publishFilter: string | null = null;
    switch (table) {
      case "quizzes":
        selectCols = "id, title, image_url";
        textField = "title";
        publishFilter = "is_published";
        break;
      case "posts":
        selectCols = "id, title, image_url";
        textField = "title";
        publishFilter = "is_published";
        break;
      case "categories":
        selectCols = "id, name, image_url";
        textField = "name";
        break;
      case "questions":
        selectCols = "id, text, image_url";
        textField = "text";
        break;
      case "results":
        selectCols = "id, title, image_url";
        textField = "title";
        break;
      default:
        throw new Error(`Unsupported table: ${table}`);
    }

    // Fetch records
    let query = supabase.from(table).select(selectCols).range(offset, offset + limit - 1);
    if (publishFilter) {
      query = query.eq(publishFilter, true);
    }
    const { data: records, error: fetchError } = await query;
    if (fetchError) throw fetchError;
    if (!records || records.length === 0) {
      return new Response(JSON.stringify({ message: "No more records", table, checked: 0, fixed: 0 }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check which URLs are broken
    const broken: { id: string; text: string }[] = [];
    await Promise.all(
      records.map(async (r: any) => {
        const url = r.image_url;
        if (!url || url === "" || url === "/placeholder.svg") {
          broken.push({ id: r.id, text: r[textField] || "" });
          return;
        }
        // Check if it's already a storage URL (already fixed)
        if (url.includes("/storage/v1/object/public/cover-images/")) {
          return; // Already fixed
        }
        try {
          const res = await fetch(url, { method: "GET", redirect: "follow" });
          if (!res.ok) {
            broken.push({ id: r.id, text: r[textField] || "" });
          } else {
            // Check if the response is actually an image with reasonable size
            const contentLength = res.headers.get("content-length");
            const contentType = res.headers.get("content-type") || "";
            // Consume the body to prevent leaks
            const body = await res.arrayBuffer();
            // If it's less than 1KB or not an image content-type, it's likely broken
            if (body.byteLength < 1000 || (!contentType.includes("image") && !contentType.includes("jpeg") && !contentType.includes("png"))) {
              broken.push({ id: r.id, text: r[textField] || "" });
            }
          }
        } catch {
          broken.push({ id: r.id, text: r[textField] || "" });
        }
      })
    );

    if (broken.length === 0) {
      return new Response(JSON.stringify({
        table, checked: records.length, fixed: 0, remaining_offset: offset + limit,
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log(`Found ${broken.length} broken images in ${table}, will fix up to ${max_fix}...`);
    
    // Only process up to max_fix items per invocation
    const toFix = broken.slice(0, max_fix);

    // Generate and upload images one by one
    let fixed = 0;
    const errors: string[] = [];

    for (const item of toFix) {
      try {
        console.log(`Generating image for: "${item.text}" (${item.id})`);

        // Create a generic prompt that avoids copyrighted references
        const safeTitle = item.text
          .replace(/disney|marvel|pixar|nintendo|pokemon|harry potter|star wars|netflix|anime/gi, "")
          .trim() || "fun quiz challenge";
        const prompt = `Create a vibrant, eye-catching abstract cover image inspired by the theme: "${safeTitle}". Use bold colors, dynamic composition. No text, no characters, no logos. Professional quality thumbnail image.`;

        const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${LOVABLE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-3.1-flash-image-preview",
            messages: [{ role: "user", content: prompt }],
            modalities: ["image", "text"],
          }),
        });

        if (!aiResponse.ok) {
          const errText = await aiResponse.text();
          console.error(`AI error for ${item.id}: ${aiResponse.status} ${errText}`);
          errors.push(`${item.id}: AI ${aiResponse.status}`);
          await new Promise(r => setTimeout(r, 3000));
          continue;
        }

        const aiData = await aiResponse.json();
        console.log(`AI response keys for ${item.id}:`, JSON.stringify(Object.keys(aiData)));
        const msg = aiData.choices?.[0]?.message;
        console.log(`Message keys:`, msg ? JSON.stringify(Object.keys(msg)) : "no message");
        
        // Try multiple paths to find image data
        let imageData = msg?.images?.[0]?.image_url?.url;
        if (!imageData) {
          // Check inline_data format
          const parts = msg?.content?.parts || msg?.parts;
          if (Array.isArray(parts)) {
            for (const part of parts) {
              if (part.inline_data?.data) {
                imageData = `data:${part.inline_data.mime_type || 'image/png'};base64,${part.inline_data.data}`;
                break;
              }
            }
          }
        }

        if (!imageData || !imageData.startsWith("data:image/")) {
          console.error(`No image data for ${item.id}. Full response:`, JSON.stringify(aiData).substring(0, 500));
          errors.push(`${item.id}: no image data`);
          continue;
        }

        // Extract base64 and decode
        const base64Part = imageData.split(",")[1];
        if (!base64Part) {
          errors.push(`${item.id}: invalid base64`);
          continue;
        }

        const imageBytes = decode(base64Part);
        const fileName = `${table}/${item.id}.png`;

        // Upload to storage
        const { error: uploadError } = await supabase.storage
          .from("cover-images")
          .upload(fileName, imageBytes, {
            contentType: "image/png",
            upsert: true,
          });

        if (uploadError) {
          console.error(`Upload error for ${item.id}:`, uploadError);
          errors.push(`${item.id}: upload failed`);
          continue;
        }

        // Get public URL
        const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/cover-images/${fileName}`;

        // Update record
        const { error: updateError } = await supabase
          .from(table)
          .update({ image_url: publicUrl })
          .eq("id", item.id);

        if (updateError) {
          console.error(`Update error for ${item.id}:`, updateError);
          errors.push(`${item.id}: db update failed`);
          continue;
        }

        fixed++;
        console.log(`✅ Fixed: ${item.text} -> ${publicUrl}`);

        // Delay between generations to avoid rate limits
        await new Promise(r => setTimeout(r, 500));
      } catch (e) {
        console.error(`Error processing ${item.id}:`, e);
        errors.push(`${item.id}: ${e.message}`);
      }
    }

    return new Response(JSON.stringify({
      table,
      checked: records.length,
      broken: broken.length,
      fixed,
      errors: errors.length > 0 ? errors : undefined,
      remaining_offset: offset + limit,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-cover-images error:", e);
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
