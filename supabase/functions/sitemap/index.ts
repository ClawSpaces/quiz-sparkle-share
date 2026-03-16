import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const headers = {
  "Content-Type": "application/xml",
  "Cache-Control": "public, max-age=3600",
};

Deno.serve(async () => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!
  );

  const baseUrl = "https://fizzty.com";

  const [{ data: quizzes }, { data: posts }, { data: categories }] = await Promise.all([
    supabase.from("quizzes").select("id, updated_at").eq("is_published", true),
    supabase.from("posts").select("id, updated_at").eq("is_published", true),
    supabase.from("categories").select("slug"),
  ]);

  const staticPages = [
    { loc: "/", priority: "1.0", changefreq: "daily" },
    { loc: "/quizzes", priority: "0.9", changefreq: "daily" },
    { loc: "/categories", priority: "0.8", changefreq: "weekly" },
    { loc: "/trending", priority: "0.8", changefreq: "daily" },
    { loc: "/about", priority: "0.3", changefreq: "monthly" },
    { loc: "/contact", priority: "0.3", changefreq: "monthly" },
    { loc: "/privacy-policy", priority: "0.2", changefreq: "monthly" },
    { loc: "/terms", priority: "0.2", changefreq: "monthly" },
  ];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

  for (const page of staticPages) {
    xml += `
  <url>
    <loc>${baseUrl}${page.loc}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
  }

  for (const quiz of quizzes || []) {
    xml += `
  <url>
    <loc>${baseUrl}/quiz/${quiz.id}</loc>
    <lastmod>${new Date(quiz.updated_at).toISOString().split("T")[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
  }

  for (const post of posts || []) {
    xml += `
  <url>
    <loc>${baseUrl}/post/${post.id}</loc>
    <lastmod>${new Date(post.updated_at).toISOString().split("T")[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
  }

  for (const cat of categories || []) {
    xml += `
  <url>
    <loc>${baseUrl}/category/${cat.slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`;
  }

  xml += `
</urlset>`;

  return new Response(xml, { headers });
});
