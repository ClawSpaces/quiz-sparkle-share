import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Curated pool of diverse, high-quality Unsplash photos (verified real IDs)
const PHOTO_POOL = [
  "photo-1506744038136-46273834b3fb", // mountain landscape
  "photo-1470071459604-3b5ec3a7fe05", // forest green
  "photo-1441974231531-c6227db76b6e", // sunlit forest
  "photo-1518837695005-2083093ee35b", // ocean wave
  "photo-1504384308090-c894fdcc538d", // tech laptop
  "photo-1519125323398-675f0ddb6308", // coffee morning
  "photo-1488590528505-98d2b5aba04b", // computer code
  "photo-1531297484001-80022131f5a1", // blue tech
  "photo-1485827404703-89b55fcc595e", // robot
  "photo-1526374965328-7f61d4dc18c5", // matrix code
  "photo-1550751827-4bd374c3f58b", // cybersecurity
  "photo-1558618666-fcd25c85f82e", // gaming
  "photo-1542281286-9e0a16bb7366", // books
  "photo-1493612276216-ee3925520721", // abstract colorful
  "photo-1501594907352-04cda38ebc29", // golden gate
  "photo-1464822759023-fed622ff2c3b", // mountain peak
  "photo-1507525428034-b723cf961d3e", // tropical beach
  "photo-1476842634003-7dcca8f832de", // sunset clouds
  "photo-1517694712202-14dd9538aa97", // coding laptop
  "photo-1498050108023-c5249f4df085", // desk workspace
  "photo-1454165804606-c3d57bc86b40", // business meeting
  "photo-1522202176988-66273c2fd55f", // students
  "photo-1511671782779-c97d3d27a1d4", // concert
  "photo-1514525253161-7a46d19cd819", // party lights
  "photo-1504674900247-0877df9cc836", // food platter
  "photo-1540189549336-e6e99c3679fe", // neon city
  "photo-1494790108377-be9c29b29330", // portrait woman
  "photo-1507003211169-0a1dd7228f2d", // portrait man
  "photo-1516321318423-f06f85e504b3", // space
  "photo-1451187580459-43490279c0fa", // earth from space
  "photo-1535082623926-b39352a03fb7", // starry sky
  "photo-1473496169904-658ba7c44d8a", // nature sunset
  "photo-1534447677768-be436bb09401", // abstract gradient
  "photo-1557682250-33bd709cbe85", // purple abstract
  "photo-1558591710-4b4a1ae0f04d", // neon abstract
];

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { table = "posts" } = await req.json();

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const textField = table === "categories" ? "name" : table === "questions" ? "text" : "title";
    const selectCols = `id, ${textField}, image_url`;

    const { data: records, error: fetchError } = await supabase
      .from(table)
      .select(selectCols)
      .not("image_url", "is", null)
      .neq("image_url", "");

    if (fetchError) throw fetchError;
    if (!records || records.length === 0) {
      return new Response(JSON.stringify({ message: "No records", table }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Find duplicates
    const urlGroups: Record<string, any[]> = {};
    for (const r of records) {
      const url = r.image_url;
      if (!url) continue;
      if (!urlGroups[url]) urlGroups[url] = [];
      urlGroups[url].push(r);
    }

    const needsNewImage: { id: string; text: string }[] = [];
    for (const [_url, group] of Object.entries(urlGroups)) {
      if (group.length > 1) {
        for (let i = 1; i < group.length; i++) {
          needsNewImage.push({ id: group[i].id, text: group[i][textField] || "" });
        }
      }
    }

    if (needsNewImage.length === 0) {
      return new Response(JSON.stringify({ table, duplicates: 0, message: "All images unique" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Collect already-used URLs to avoid creating new duplicates
    const usedUrls = new Set(records.map((r: any) => r.image_url));

    // Assign from pool, skipping already-used URLs
    const availablePhotos = PHOTO_POOL.filter(
      (p) => !usedUrls.has(`https://images.unsplash.com/${p}?w=800&h=500&fit=crop`)
    );

    let updated = 0;
    for (let i = 0; i < needsNewImage.length; i++) {
      const photoId = availablePhotos[i % availablePhotos.length];
      const newUrl = `https://images.unsplash.com/${photoId}?w=800&h=500&fit=crop`;

      const { error: updateError } = await supabase
        .from(table)
        .update({ image_url: newUrl })
        .eq("id", needsNewImage[i].id);

      if (!updateError) {
        updated++;
        // Mark as used so subsequent items don't get the same URL
        usedUrls.add(newUrl);
      } else {
        console.error(`Failed to update ${needsNewImage[i].id}:`, updateError);
      }
    }

    return new Response(JSON.stringify({
      table,
      total: records.length,
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
