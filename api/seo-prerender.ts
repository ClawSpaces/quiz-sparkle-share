/**
 * Vercel Edge Function: SEO Prerender
 *
 * Called via conditional rewrites (vercel.json "has" user-agent matching).
 * Fetches data from Supabase and serves fully-rendered HTML with
 * OG tags, structured data, and visible content for crawlers.
 */

export const config = { runtime: "edge" };

const SUPABASE_URL = "https://gymwbfevlbbyanobpiwr.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd5bXdiZmV2bGJieWFub2JwaXdyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwMDYyNzYsImV4cCI6MjA4ODU4MjI3Nn0.u-esnjA-SDnBbBeO_LYpLvMhq9frrMQuEarYtS2lHhg";
const BASE_URL = "https://fizzty.com";
const DEFAULT_OG_IMAGE =
  "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/99afa513-9269-40cd-9fe9-523dd8068d1f/id-preview-cdc0fd3f--822a068a-b79b-4c77-b043-2d6475162f04.lovable.app-1773066915015.png";

const HEALTH_CATEGORY_ID = "ffb0f553-d361-4050-b4c3-ccfb40065514";

function escapeHtml(str: string): string {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function truncate(str: string, len: number): string {
  if (!str) return "";
  const clean = str.replace(/\n+/g, " ").trim();
  return clean.length > len ? clean.substring(0, len - 3) + "..." : clean;
}

async function supabaseFetch(path: string) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    headers: { apikey: SUPABASE_ANON_KEY },
  });
  if (!res.ok) return null;
  return res.json();
}

function htmlResponse(html: string): Response {
  return new Response(html, {
    status: 200,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "public, max-age=3600, s-maxage=3600",
      "x-robots-tag": "index, follow",
      "x-prerender": "vercel-edge-function",
    },
  });
}

// ── Quiz ────────────────────────────────────────────────────────

async function fetchQuizBySlug(slug: string) {
  const data = await supabaseFetch(
    `quizzes?slug=eq.${slug}&is_published=eq.true&select=id,title,slug,description,image_url,category_id,created_at,updated_at,categories(name,slug)&limit=1`
  );
  return data?.[0] || null;
}

async function fetchQuizQuestions(quizId: string) {
  return (
    (await supabaseFetch(
      `questions?quiz_id=eq.${quizId}&select=text,answers(text)&order=sort_order.asc`
    )) || []
  );
}

async function fetchRelatedQuizzes(quiz: any) {
  const sameCat = await supabaseFetch(
    `quizzes?category_id=eq.${quiz.category_id}&id=neq.${quiz.id}&is_published=eq.true&select=title,slug&limit=4&order=created_at.desc`
  );
  if ((sameCat?.length || 0) >= 6) return sameCat.slice(0, 6);
  const others = await supabaseFetch(
    `quizzes?category_id=neq.${quiz.category_id}&is_published=eq.true&select=title,slug&limit=${6 - (sameCat?.length || 0)}&order=created_at.desc`
  );
  return [...(sameCat || []), ...(others || [])].slice(0, 6);
}

function buildQuizSchema(quiz: any, questions: any[], category: any) {
  const schemas: any[] = [];

  const quizSchema: any = {
    "@context": "https://schema.org",
    "@type": "Quiz",
    name: quiz.title,
    description: truncate(quiz.description, 300),
    image: quiz.image_url || undefined,
    url: `${BASE_URL}/quiz/${quiz.slug}`,
    publisher: {
      "@type": "Organization",
      "@id": `${BASE_URL}/#organization`,
      name: "Fizzty",
      url: BASE_URL,
      logo: { "@type": "ImageObject", url: `${BASE_URL}/favicon.png`, width: 512, height: 512 },
    },
    provider: { "@type": "Organization", name: "Fizzty", url: BASE_URL },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${BASE_URL}/quiz/${quiz.slug}` },
    datePublished: quiz.created_at,
    dateModified: quiz.updated_at || quiz.created_at,
    author: {
      "@type": "Person",
      "@id": `${BASE_URL}/author/fizzty-editorial#person`,
      name: "Fizzty Editorial Team",
    },
  };

  if (category) {
    quizSchema.educationalAlignment = {
      "@type": "AlignmentObject",
      alignmentType: "educationalSubject",
      targetName: category.name,
    };
    quizSchema.about = { "@type": "Thing", name: category.name };
  }

  if (questions.length > 0) {
    quizSchema.hasPart = questions.map((q: any) => ({
      "@type": "Question",
      name: q.text,
      acceptedAnswer: {
        "@type": "Answer",
        text: q.answers.map((a: any) => a.text).join(", "),
      },
    }));
  }

  schemas.push(quizSchema);

  const crumbs = [{ name: "Home", url: BASE_URL }];
  if (category) {
    crumbs.push({ name: category.name, url: `${BASE_URL}/category/${category.slug}` });
  }
  crumbs.push({ name: quiz.title, url: "" });

  schemas.push({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      ...(c.url ? { item: c.url } : {}),
    })),
  });

  schemas.push({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `Is the "${quiz.title}" quiz accurate?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: "This quiz uses scenario-based questions grounded in established psychological frameworks. While no online quiz replaces professional assessment, our methodology provides meaningful insights for self-discovery.",
        },
      },
      {
        "@type": "Question",
        name: "How long does this quiz take?",
        acceptedAnswer: {
          "@type": "Answer",
          text: `The quiz takes approximately 3-5 minutes to complete. It consists of ${questions.length} carefully designed questions. Answer honestly with your gut reaction for the most accurate result.`,
        },
      },
      {
        "@type": "Question",
        name: "Can I retake the quiz?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, you can retake the quiz as many times as you like. Your answers may vary depending on your current life circumstances and personal growth.",
        },
      },
    ],
  });

  if (quiz.category_id === HEALTH_CATEGORY_ID) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "MedicalWebPage",
      name: quiz.title,
      description: truncate(quiz.description, 300),
      url: `${BASE_URL}/quiz/${quiz.slug}`,
      lastReviewed: (quiz.updated_at || quiz.created_at || new Date().toISOString()).split("T")[0],
      reviewedBy: {
        "@type": "Organization",
        name: "Fizzty Editorial Team",
        url: `${BASE_URL}/about`,
      },
      specialty: "Health",
    });
  }

  return schemas;
}

function renderQuizHtml(quiz: any, questions: any[], category: any, relatedQuizzes: any[], schemas: any[]): string {
  const title = `${quiz.title} | Fizzty`;
  const description = truncate(quiz.description, 160);
  const canonical = `${BASE_URL}/quiz/${quiz.slug}`;
  const image = quiz.image_url || DEFAULT_OG_IMAGE;

  const descParagraphs = (quiz.description || "")
    .split(/\n\n+/)
    .filter((p: string) => p.trim())
    .slice(0, 3)
    .map((p: string) => `<p>${escapeHtml(p.trim())}</p>`)
    .join("\n        ");

  const questionsList = questions
    .slice(0, 5)
    .map((q: any, i: number) => `<li><strong>Question ${i + 1}:</strong> ${escapeHtml(q.text)}</li>`)
    .join("\n          ");

  const schemaScripts = schemas
    .map((s) => `<script type="application/ld+json">${JSON.stringify(s)}</script>`)
    .join("\n    ");

  const healthDisclaimer =
    quiz.category_id === HEALTH_CATEGORY_ID
      ? `<section style="margin-top:32px;padding:16px;background:#fef3c7;border-radius:8px;border:1px solid #f59e0b">
          <p style="font-size:14px;color:#92400e;margin:0"><strong>Medical Disclaimer:</strong> This quiz is for educational and self-reflection purposes only. It is not a diagnostic tool and does not replace professional medical advice, diagnosis, or treatment. If you have concerns about your health, please consult a qualified healthcare provider.</p>
        </section>`
      : "";

  const relatedSection =
    relatedQuizzes.length > 0
      ? `<section style="margin-top:40px;padding-top:24px;border-top:1px solid #e5e7eb">
          <h2 style="font-size:24px;font-weight:bold;color:#1a1a2e;margin-bottom:16px">You Might Also Like</h2>
          <ul style="list-style:none;padding:0;display:grid;grid-template-columns:repeat(2,1fr);gap:12px">
            ${relatedQuizzes.map((rq: any) => `<li><a href="/quiz/${escapeHtml(rq.slug)}" style="display:block;padding:12px;border:1px solid #e5e7eb;border-radius:8px;text-decoration:none;color:#7c3aed;font-weight:600">${escapeHtml(rq.title)}</a></li>`).join("\n            ")}
          </ul>
        </section>`
      : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="#7c3aed" />
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />

    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}" />
    <meta name="author" content="Fizzty" />
    <link rel="canonical" href="${canonical}" />
    <link rel="icon" href="/favicon.png" type="image/png" />

    <!-- Open Graph -->
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:image" content="${escapeHtml(image)}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Fizzty" />
    <meta property="og:locale" content="en_US" />

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
    <meta name="twitter:image" content="${escapeHtml(image)}" />
    <meta name="twitter:site" content="@Fizzty" />

    <!-- Structured Data -->
    ${schemaScripts}
</head>
<body>
    <article style="max-width:800px;margin:0 auto;padding:20px;font-family:system-ui,sans-serif">
        <nav aria-label="breadcrumb" style="margin-bottom:16px;font-size:14px;color:#666">
          <a href="/" style="color:#7c3aed;text-decoration:none">Home</a>
          ${category ? ` &rsaquo; <a href="/category/${category.slug}" style="color:#7c3aed;text-decoration:none">${escapeHtml(category.name)}</a>` : ""}
          &rsaquo; <span>${escapeHtml(quiz.title)}</span>
        </nav>

        <h1 style="font-size:32px;font-weight:bold;color:#1a1a2e;margin-bottom:16px">${escapeHtml(quiz.title)}</h1>

        ${image ? `<img src="${escapeHtml(image)}" alt="${escapeHtml(quiz.title)}" width="800" height="400" style="width:100%;height:auto;border-radius:12px;margin-bottom:20px" />` : ""}

        <div style="color:#444;line-height:1.7">
          ${descParagraphs}
        </div>

        ${questionsList ? `
        <h2 style="font-size:24px;margin-top:24px;color:#1a1a2e">Quiz Questions</h2>
        <ol style="color:#444;line-height:1.8">
          ${questionsList}
        </ol>` : ""}

        <p style="margin-top:24px">
          <a href="/quiz/${quiz.slug}" style="display:inline-block;padding:12px 32px;background:#7c3aed;color:#fff;border-radius:8px;text-decoration:none;font-weight:bold">Take This Quiz</a>
        </p>

        ${relatedSection}
        ${healthDisclaimer}

        <section style="margin-top:32px;padding-top:24px;border-top:1px solid #e5e7eb">
          <h2 style="font-size:20px;font-weight:bold;color:#1a1a2e;margin-bottom:12px">Frequently Asked Questions</h2>
          <h3 style="font-size:16px;font-weight:600;color:#1a1a2e;margin-top:12px">Is this quiz accurate?</h3>
          <p style="color:#444;line-height:1.6">This quiz uses scenario-based questions grounded in established psychological frameworks. While no online quiz replaces professional assessment, our methodology provides meaningful insights for self-discovery.</p>
          <h3 style="font-size:16px;font-weight:600;color:#1a1a2e;margin-top:12px">How long does this quiz take?</h3>
          <p style="color:#444;line-height:1.6">The quiz takes approximately 3-5 minutes to complete. It consists of ${questions.length} carefully designed questions. Answer honestly with your gut reaction for the most accurate result.</p>
          <h3 style="font-size:16px;font-weight:600;color:#1a1a2e;margin-top:12px">Can I retake the quiz?</h3>
          <p style="color:#444;line-height:1.6">Yes, you can retake the quiz as many times as you like. Your answers may vary depending on your current life circumstances and personal growth.</p>
        </section>
    </article>
</body>
</html>`;
}

// ── Article ─────────────────────────────────────────────────────

async function fetchArticleBySlug(slug: string) {
  const data = await supabaseFetch(
    `posts?slug=eq.${slug}&is_published=eq.true&select=id,title,slug,description,content,image_url,category_id,created_at,updated_at,primary_keyword,meta_title,meta_description,niche,categories(name,slug)&limit=1`
  );
  return data?.[0] || null;
}

function renderArticleHtml(article: any, category: any): string {
  const title = `${article.title} | Fizzty`;
  const description = truncate(article.description || article.title, 160);
  const canonical = `${BASE_URL}/article/${article.slug}`;
  const image = article.image_url || DEFAULT_OG_IMAGE;

  let cleanContent = (article.content || "").substring(0, 4000);
  cleanContent = cleanContent
    .replace(/^#{1,3}\s*(META|ARTICLE META|QUIZ BRIEF|ARTICLE CONTENT|QUIZ CTA|INTERNAL LINKING NOTES).*$/gm, "")
    .replace(/^\*?\*?(Meta Title|Meta Description|Target Keyword|Secondary Keywords?|OG Image|Slug|Category|Type).*$/gm, "")
    .replace(/^- Links? OUT to:.*$/gm, "")
    .replace(/^- Should be linked FROM:.*$/gm, "")
    .replace(/^---\s*$/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  const contentHtml = cleanContent
    .split(/\n\n+/)
    .filter((p: string) => p.trim())
    .slice(0, 8)
    .map((p: string) => {
      const trimmed = p.trim();
      if (trimmed.startsWith("## ")) return `<h2 style="font-size:24px;font-weight:bold;color:#1a1a2e;margin-top:24px">${escapeHtml(trimmed.slice(3))}</h2>`;
      if (trimmed.startsWith("### ")) return `<h3 style="font-size:20px;font-weight:600;color:#1a1a2e;margin-top:16px">${escapeHtml(trimmed.slice(4))}</h3>`;
      return `<p>${escapeHtml(trimmed)}</p>`;
    })
    .join("\n        ");

  const isNews = article.slug?.startsWith("news-");
  const articleSchema: any = {
    "@context": "https://schema.org",
    "@type": isNews ? "NewsArticle" : "Article",
    "@id": `${canonical}#article`,
    headline: article.title,
    description,
    image: { "@type": "ImageObject", url: image, width: 1200, height: 630 },
    url: canonical,
    mainEntityOfPage: { "@type": "WebPage", "@id": canonical },
    datePublished: article.created_at,
    dateModified: article.updated_at || article.created_at,
    isAccessibleForFree: true,
    publisher: {
      "@type": "Organization",
      "@id": `${BASE_URL}/#organization`,
      name: "Fizzty",
      url: BASE_URL,
      logo: { "@type": "ImageObject", url: `${BASE_URL}/favicon.png`, width: 512, height: 512 },
    },
    author: {
      "@type": "Person",
      "@id": `${BASE_URL}/author/fizzty-editorial#person`,
      name: "Fizzty Editorial Team",
      url: `${BASE_URL}/about`,
      description: "Psychology & Self-Discovery Experts",
      knowsAbout: ["psychology", "personality types", "self-discovery", "mental health"],
    },
  };
  if (article.primary_keyword) {
    articleSchema.keywords = article.primary_keyword;
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
      ...(category
        ? [{ "@type": "ListItem", position: 2, name: category.name, item: `${BASE_URL}/category/${category.slug}` }]
        : []),
      { "@type": "ListItem", position: category ? 3 : 2, name: article.title },
    ],
  };

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="#7c3aed" />
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />

    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}" />
    <meta name="author" content="Fizzty Editorial Team" />
    <link rel="canonical" href="${canonical}" />
    <link rel="icon" href="/favicon.png" type="image/png" />

    <!-- Open Graph -->
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:image" content="${escapeHtml(image)}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:type" content="article" />
    <meta property="og:site_name" content="Fizzty" />
    <meta property="og:locale" content="en_US" />
    <meta property="article:published_time" content="${article.created_at}" />
    ${article.updated_at ? `<meta property="article:modified_time" content="${article.updated_at}" />` : ""}
    ${isNews && article.primary_keyword ? `<meta name="news_keywords" content="${escapeHtml(article.primary_keyword)}" />` : ""}

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
    <meta name="twitter:image" content="${escapeHtml(image)}" />
    <meta name="twitter:site" content="@Fizzty" />

    <!-- Structured Data -->
    <script type="application/ld+json">${JSON.stringify(articleSchema)}</script>
    <script type="application/ld+json">${JSON.stringify(breadcrumbSchema)}</script>
</head>
<body>
    <article style="max-width:800px;margin:0 auto;padding:20px;font-family:system-ui,sans-serif">
        <nav aria-label="breadcrumb" style="margin-bottom:16px;font-size:14px;color:#666">
          <a href="/" style="color:#7c3aed;text-decoration:none">Home</a>
          ${category ? ` &rsaquo; <a href="/category/${category.slug}" style="color:#7c3aed;text-decoration:none">${escapeHtml(category.name)}</a>` : ""}
          &rsaquo; <span>${escapeHtml(article.title)}</span>
        </nav>

        <h1 style="font-size:32px;font-weight:bold;color:#1a1a2e;margin-bottom:16px">${escapeHtml(article.title)}</h1>

        ${image ? `<img src="${escapeHtml(image)}" alt="${escapeHtml(article.title)}" width="800" height="400" style="width:100%;height:auto;border-radius:12px;margin-bottom:20px" />` : ""}

        <div style="color:#444;line-height:1.7">
          ${contentHtml}
        </div>

        <p style="margin-top:24px">
          <a href="/article/${article.slug}" style="display:inline-block;padding:12px 32px;background:#7c3aed;color:#fff;border-radius:8px;text-decoration:none;font-weight:bold">Read Full Article</a>
        </p>
    </article>
</body>
</html>`;
}

// ── Author ──────────────────────────────────────────────────────

function renderAuthorHtml(author: any): string {
  const canonical = `${BASE_URL}/author/${author.slug}`;
  const title = `${author.name}${author.credentials ? `, ${author.credentials}` : ""} | Fizzty`;
  const description = truncate(author.bio || `Articles and quizzes by ${author.name} on Fizzty`, 155);

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${canonical}#person`,
    name: author.name,
    url: canonical,
    description: author.credentials || undefined,
    image: author.image_url || undefined,
    knowsAbout: author.expertise || ["psychology", "personality types"],
    sameAs: [
      ...(author.social_links?.linkedin ? [author.social_links.linkedin] : []),
      ...(author.social_links?.twitter ? [author.social_links.twitter] : []),
    ],
  };

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}" />
    <link rel="canonical" href="${canonical}" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    ${author.image_url ? `<meta property="og:image" content="${escapeHtml(author.image_url)}" />` : ""}
    <meta property="og:url" content="${canonical}" />
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <script type="application/ld+json">${JSON.stringify(personSchema)}</script>
</head>
<body>
    <div style="max-width:800px;margin:0 auto;padding:20px;font-family:system-ui,sans-serif">
        <h1>${escapeHtml(author.name)}</h1>
        ${author.credentials ? `<p style="color:#666">${escapeHtml(author.credentials)}</p>` : ""}
        ${author.bio ? `<p>${escapeHtml(author.bio)}</p>` : ""}
    </div>
</body>
</html>`;
}

// ── Topic ───────────────────────────────────────────────────────

function renderTopicHtml(hub: any): string {
  const canonical = `${BASE_URL}/topic/${hub.slug}`;
  const title = `${hub.title} | Fizzty`;
  const description = truncate(hub.description || `Explore ${hub.title} articles and quizzes on Fizzty`, 155);

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${canonical}#collection`,
    name: hub.title,
    description,
    url: canonical,
    isPartOf: { "@id": `${BASE_URL}/#organization` },
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
      { "@type": "ListItem", position: 2, name: hub.title },
    ],
  };

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}" />
    <link rel="canonical" href="${canonical}" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:type" content="website" />
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <script type="application/ld+json">${JSON.stringify(collectionSchema)}</script>
    <script type="application/ld+json">${JSON.stringify(breadcrumbSchema)}</script>
</head>
<body>
    <div style="max-width:800px;margin:0 auto;padding:20px;font-family:system-ui,sans-serif">
        <nav style="font-size:14px;color:#666;margin-bottom:16px"><a href="/" style="color:#7c3aed">Home</a> &rsaquo; ${escapeHtml(hub.title)}</nav>
        <h1>${escapeHtml(hub.title)}</h1>
        ${hub.description ? `<p>${escapeHtml(hub.description)}</p>` : ""}
    </div>
</body>
</html>`;
}

// ── Main handler ────────────────────────────────────────────────

export default async function handler(request: Request) {
  const url = new URL(request.url);
  const type = url.searchParams.get("type");
  const slug = url.searchParams.get("slug");

  if (!type || !slug) {
    return new Response("Missing type or slug", { status: 400 });
  }

  try {
    if (type === "quiz") {
      const quiz = await fetchQuizBySlug(slug);
      if (!quiz) return new Response("Not found", { status: 404 });

      const [questions, relatedQuizzes] = await Promise.all([
        fetchQuizQuestions(quiz.id),
        fetchRelatedQuizzes(quiz),
      ]);

      const category = quiz.categories || null;
      const schemas = buildQuizSchema(quiz, questions, category);
      return htmlResponse(renderQuizHtml(quiz, questions, category, relatedQuizzes, schemas));
    }

    if (type === "article") {
      const article = await fetchArticleBySlug(slug);
      if (!article) return new Response("Not found", { status: 404 });

      const category = article.categories || null;
      return htmlResponse(renderArticleHtml(article, category));
    }

    if (type === "author") {
      const authorData = await supabaseFetch(
        `authors?slug=eq.${slug}&select=name,slug,bio,credentials,image_url,social_links,expertise&limit=1`
      );
      const author = authorData?.[0];
      if (!author) return new Response("Not found", { status: 404 });

      return htmlResponse(renderAuthorHtml(author));
    }

    if (type === "topic") {
      const hubData = await supabaseFetch(
        `topic_hubs?slug=eq.${slug}&select=title,slug,description,niche&limit=1`
      );
      const hub = hubData?.[0];
      if (!hub) return new Response("Not found", { status: 404 });

      return htmlResponse(renderTopicHtml(hub));
    }

    return new Response("Unknown type", { status: 400 });
  } catch (err) {
    console.error("SEO prerender error:", err);
    return new Response("Internal error", { status: 500 });
  }
}
