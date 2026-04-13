import type { VercelRequest, VercelResponse } from "@vercel/node";

const SUPABASE_URL = "https://gymwbfevlbbyanobpiwr.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd5bXdiZmV2bGJieWFub2JwaXdyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwMDYyNzYsImV4cCI6MjA4ODU4MjI3Nn0.u-esnjA-SDnBbBeO_LYpLvMhq9frrMQuEarYtS2lHhg";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const id = (req.query.id as string) || "";
  if (!id) return res.redirect(301, "/");

  const filter = UUID_RE.test(id) ? `id=eq.${id}` : `slug=eq.${id}`;
  const url = `${SUPABASE_URL}/rest/v1/posts?${filter}&select=slug&limit=1`;

  try {
    const response = await fetch(url, {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      if (data?.[0]?.slug) {
        // Cache for 1 day — these mappings don't change
        res.setHeader("Cache-Control", "public, max-age=86400, s-maxage=86400");
        return res.redirect(301, `/article/${data[0].slug}`);
      }
    }
  } catch {
    // DB lookup failed
  }

  // Not found — redirect to homepage
  return res.redirect(302, "/");
}
