#!/usr/bin/env node
/**
 * Post-build prerender script for SEO.
 * Generates static HTML files for quiz pages so Google can index them
 * without needing to execute JavaScript.
 *
 * Runs after `vite build` — reads dist/index.html as template,
 * fetches quiz data from Supabase, generates quiz-specific HTML files.
 *
 * Usage: node scripts/prerender.js [--limit 50] [--offset 0]
 */

const fs = require('fs');
const path = require('path');

const SUPABASE_URL = 'https://gymwbfevlbbyanobpiwr.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd5bXdiZmV2bGJieWFub2JwaXdyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwMDYyNzYsImV4cCI6MjA4ODU4MjI3Nn0.u-esnjA-SDnBbBeO_LYpLvMhq9frrMQuEarYtS2lHhg';
const BASE_URL = 'https://fizzty.com';
const DIST_DIR = path.resolve(__dirname, '../dist');

// Parse CLI args
const args = process.argv.slice(2);
let LIMIT = 50;
let OFFSET = 0;
let ALL = true; // Default: fetch ALL quizzes in batches
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--limit' && args[i + 1]) { LIMIT = parseInt(args[i + 1]); ALL = false; }
  if (args[i] === '--offset' && args[i + 1]) { OFFSET = parseInt(args[i + 1]); ALL = false; }
}

async function fetchQuizzes(limit, offset) {
  const url = `${SUPABASE_URL}/rest/v1/quizzes?select=id,title,slug,description,image_url,category_id,created_at,updated_at,categories(name,slug)&is_published=eq.true&order=created_at.asc&limit=${limit}&offset=${offset}`;
  const res = await fetch(url, {
    headers: { apikey: SUPABASE_ANON_KEY },
  });
  if (!res.ok) throw new Error(`Failed to fetch quizzes: ${res.status}`);
  return res.json();
}

// Store all quizzes and articles for cross-linking
let ALL_QUIZZES = [];
let ALL_ARTICLES = [];

function findRelatedArticles(quiz) {
  // Find articles related to this quiz by category + keyword matching
  const quizWords = new Set(quiz.title.toLowerCase().replace(/[^a-z0-9 ]/g, '').split(/\s+/).filter(w => w.length > 3));
  
  return ALL_ARTICLES
    .filter(a => a.slug) // must have slug
    .map(a => {
      let score = 0;
      // Same category = +3
      if (a.category_id === quiz.category_id) score += 3;
      // Word overlap in title
      const artWords = a.title.toLowerCase().replace(/[^a-z0-9 ]/g, '').split(/\s+/).filter(w => w.length > 3);
      for (const w of artWords) {
        if (quizWords.has(w)) score += 2;
      }
      return { ...a, score };
    })
    .filter(a => a.score >= 3)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}

async function fetchRelatedQuizzes(quiz) {
  // Return up to 6 related quizzes: same category first, then popular ones
  const sameCat = ALL_QUIZZES.filter(q => q.id !== quiz.id && q.category_id === quiz.category_id).slice(0, 4);
  const otherIds = new Set([quiz.id, ...sameCat.map(q => q.id)]);
  const others = ALL_QUIZZES.filter(q => !otherIds.has(q.id)).slice(0, 6 - sameCat.length);
  return [...sameCat, ...others];
}

async function fetchQuizQuestions(quizId) {
  const url = `${SUPABASE_URL}/rest/v1/questions?quiz_id=eq.${quizId}&select=text,answers(text)&order=sort_order.asc`;
  const res = await fetch(url, {
    headers: { apikey: SUPABASE_ANON_KEY },
  });
  if (!res.ok) return [];
  return res.json();
}

function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function truncate(str, len) {
  if (!str) return '';
  const clean = str.replace(/\n+/g, ' ').trim();
  return clean.length > len ? clean.substring(0, len - 3) + '...' : clean;
}

function buildSchemaJson(quiz, questions, category) {
  const schemas = [];

  // Quiz schema
  const quizSchema = {
    '@context': 'https://schema.org',
    '@type': 'Quiz',
    name: quiz.title,
    description: truncate(quiz.description, 300),
    image: quiz.image_url || undefined,
    publisher: {
      '@type': 'Organization',
      name: 'Fizzty',
      url: BASE_URL,
      logo: { '@type': 'ImageObject', url: `${BASE_URL}/favicon.ico` },
    },
    provider: {
      '@type': 'Organization',
      name: 'Fizzty',
      url: BASE_URL,
    },
  };

  if (category) {
    quizSchema.educationalAlignment = {
      '@type': 'AlignmentObject',
      alignmentType: 'educationalSubject',
      targetName: category.name,
    };
    quizSchema.about = { '@type': 'Thing', name: category.name };
  }

  if (questions.length > 0) {
    quizSchema.hasPart = questions.map((q) => ({
      '@type': 'Question',
      name: q.text,
      acceptedAnswer: {
        '@type': 'Answer',
        text: q.answers.map((a) => a.text).join(', '),
      },
    }));
  }

  schemas.push(quizSchema);

  // Breadcrumb schema
  const crumbs = [{ name: 'Home', url: BASE_URL }];
  if (category) {
    crumbs.push({
      name: category.name,
      url: `${BASE_URL}/category/${category.slug}`,
    });
  }
  crumbs.push({ name: quiz.title });

  schemas.push({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      ...(item.url ? { item: item.url } : {}),
    })),
  });

  // FAQPage schema
  const faqItems = [
    { q: `Is the "${quiz.title}" quiz accurate?`, a: `This quiz uses scenario-based questions grounded in established psychological frameworks. While no online quiz replaces professional assessment, our methodology provides meaningful insights for self-discovery.` },
    { q: `How long does this quiz take?`, a: `The quiz takes approximately 3-5 minutes to complete. It consists of ${questions.length} carefully designed questions. Answer honestly with your gut reaction for the most accurate result.` },
    { q: `Can I retake the quiz?`, a: `Yes, you can retake the quiz as many times as you like. Your answers may vary depending on your current life circumstances and personal growth.` },
  ];
  schemas.push({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  });

  // MedicalWebPage schema for health quizzes
  const HEALTH_CATEGORY_ID = 'ffb0f553-d361-4050-b4c3-ccfb40065514';
  if (quiz.category_id === HEALTH_CATEGORY_ID) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'MedicalWebPage',
      name: quiz.title,
      description: truncate(quiz.description, 300),
      url: `${BASE_URL}/quiz/${quiz.slug}`,
      lastReviewed: (quiz.updated_at || quiz.created_at || new Date().toISOString()).split('T')[0],
      reviewedBy: {
        '@type': 'Organization',
        name: 'Fizzty Editorial Team',
        url: `${BASE_URL}/about`,
      },
      mainContentOfPage: {
        '@type': 'WebPageElement',
        cssSelector: 'article',
      },
      specialty: 'Health',
    });
  }

  return schemas.map((s) => JSON.stringify(s)).join('\n');
}

function getSourcesForQuiz(slug) {
  const sources = {
    'endometriosis-quiz': [
      '<li><a href="https://www.who.int/news-room/fact-sheets/detail/endometriosis" style="color:#7c3aed">WHO — Endometriosis Fact Sheet</a></li>',
      '<li><a href="https://www.nichd.nih.gov/health/topics/endometri" style="color:#7c3aed">NIH — Endometriosis Information</a></li>',
      '<li>Nnoaham KE, et al. (2011). Impact of endometriosis on quality of life and work productivity. <em>Fertility and Sterility</em>, 96(2), 366-373.</li>',
      '<li><a href="https://endometriosisassn.org/" style="color:#7c3aed">Endometriosis Association</a></li>',
    ],
    'eating-disorder-quiz': [
      '<li><a href="https://www.nationaleatingdisorders.org/screening-tool" style="color:#7c3aed">NEDA — Eating Disorder Screening Tool</a></li>',
      '<li>Morgan JF, Reid F, Lacey JH (1999). The SCOFF questionnaire. <em>BMJ</em>, 319(7223), 1467-1468.</li>',
      '<li><a href="https://www.nimh.nih.gov/health/topics/eating-disorders" style="color:#7c3aed">NIMH — Eating Disorders</a></li>',
      '<li>American Psychiatric Association. <em>DSM-5</em> Feeding and Eating Disorders criteria.</li>',
    ],
    'autistic-quiz': [
      '<li>Baron-Cohen S, et al. (2001). The Autism-Spectrum Quotient (AQ). <em>Journal of Autism and Developmental Disorders</em>, 31(1), 5-17.</li>',
      '<li>Ritvo RA, et al. (2011). The RAADS-R: A reliable instrument for diagnosing adults on the autism spectrum. <em>Journal of Autism and Developmental Disorders</em>, 41(8), 1076-1085.</li>',
      '<li><a href="https://www.cdc.gov/autism/" style="color:#7c3aed">CDC — Autism Spectrum Disorder</a></li>',
      '<li><a href="https://www.autism.org/" style="color:#7c3aed">National Autism Association</a></li>',
    ],
  };
  // Default sources for other health quizzes
  const defaults = [
    '<li>Based on established psychological and health research frameworks.</li>',
    '<li><a href="https://www.who.int/" style="color:#7c3aed">World Health Organization</a></li>',
    '<li><a href="https://www.nih.gov/" style="color:#7c3aed">National Institutes of Health</a></li>',
  ];
  return (sources[slug] || defaults).join('\n            ');
}

function generateQuizHtml(template, quiz, questions, category, relatedQuizzes, relatedArticles) {
  const title = `${quiz.title} | Fizzty`;
  const description = truncate(quiz.description, 160);
  const canonical = `${BASE_URL}/quiz/${quiz.slug}`;
  const image = quiz.image_url || `${BASE_URL}/favicon.png`;
  const schemaJson = buildSchemaJson(quiz, questions, category);

  // Split description into paragraphs for readable content
  const descParagraphs = (quiz.description || '')
    .split(/\n\n+/)
    .filter((p) => p.trim())
    .slice(0, 3) // First 3 paragraphs
    .map((p) => `<p>${escapeHtml(p.trim())}</p>`)
    .join('\n        ');

  // Build question list for visible content
  const questionsList = questions
    .slice(0, 5) // First 5 questions
    .map(
      (q, i) =>
        `<li><strong>Question ${i + 1}:</strong> ${escapeHtml(q.text)}</li>`
    )
    .join('\n          ');

  // Replace the <head> content in the template
  let html = template;

  // Replace title
  html = html.replace(
    /<title>.*?<\/title>/,
    `<title>${escapeHtml(title)}</title>`
  );

  // Replace meta description
  html = html.replace(
    /<meta name="description" content="[^"]*" \/>/,
    `<meta name="description" content="${escapeHtml(description)}" />`
  );

  // Add canonical, OG tags, Twitter cards, and structured data before </head>
  const seoTags = `
    <link rel="canonical" href="${canonical}" />

    <!-- Open Graph -->
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:image" content="${escapeHtml(image)}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:type" content="website" />

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
    <meta name="twitter:image" content="${escapeHtml(image)}" />

    <!-- Structured Data -->
    ${schemaJson
      .split('\n')
      .map((s) => `<script type="application/ld+json">${s}</script>`)
      .join('\n    ')}
  `;

  html = html.replace('</head>', `${seoTags}\n  </head>`);

  // Add visible content inside <div id="root"> for Google to index
  const visibleContent = `
      <article style="max-width:800px;margin:0 auto;padding:20px;font-family:system-ui,sans-serif">
        <nav aria-label="breadcrumb" style="margin-bottom:16px;font-size:14px;color:#666">
          <a href="/" style="color:#7c3aed;text-decoration:none">Home</a>
          ${category ? ` &rsaquo; <a href="/category/${category.slug}" style="color:#7c3aed;text-decoration:none">${escapeHtml(category.name)}</a>` : ''}
          &rsaquo; <span>${escapeHtml(quiz.title)}</span>
        </nav>
        <h1 style="font-size:32px;font-weight:bold;color:#1a1a2e;margin-bottom:16px">${escapeHtml(quiz.title)}</h1>
        ${quiz.image_url ? `<img src="${escapeHtml(quiz.image_url)}" alt="${escapeHtml(quiz.title)}" width="800" height="400" style="width:100%;height:auto;border-radius:12px;margin-bottom:20px" />` : ''}
        <div style="color:#444;line-height:1.7">
        ${descParagraphs}
        </div>
        ${
          questionsList
            ? `<h2 style="font-size:24px;margin-top:24px;color:#1a1a2e">Quiz Questions</h2>
        <ol style="color:#444;line-height:1.8">
          ${questionsList}
        </ol>`
            : ''
        }
        <p style="margin-top:24px"><a href="/quiz/${quiz.slug}" style="display:inline-block;padding:12px 32px;background:#7c3aed;color:#fff;border-radius:8px;text-decoration:none;font-weight:bold">Take This Quiz</a></p>
        ${relatedQuizzes.length > 0 ? `
        <section style="margin-top:40px;padding-top:24px;border-top:1px solid #e5e7eb">
          <h2 style="font-size:24px;font-weight:bold;color:#1a1a2e;margin-bottom:16px">You Might Also Like</h2>
          <ul style="list-style:none;padding:0;display:grid;grid-template-columns:repeat(2,1fr);gap:12px">
            ${relatedQuizzes.map(rq => `<li><a href="/quiz/${escapeHtml(rq.slug)}" style="display:block;padding:12px;border:1px solid #e5e7eb;border-radius:8px;text-decoration:none;color:#7c3aed;font-weight:600">${escapeHtml(rq.title)}</a></li>`).join('\n            ')}
          </ul>
        </section>` : ''}
        ${relatedArticles.length > 0 ? `
        <section style="margin-top:24px;padding-top:24px;border-top:1px solid #e5e7eb">
          <h2 style="font-size:20px;font-weight:bold;color:#1a1a2e;margin-bottom:12px">📚 Recommended Reading</h2>
          <ul style="list-style:none;padding:0">
            ${relatedArticles.map(a => `<li style="margin-bottom:8px"><a href="/article/${escapeHtml(a.slug)}" style="color:#7c3aed;font-weight:600;text-decoration:none">${escapeHtml(a.title)}</a></li>`).join('\n            ')}
          </ul>
        </section>` : ''}
        ${quiz.category_id === 'ffb0f553-d361-4050-b4c3-ccfb40065514' ? `
        <section style="margin-top:32px;padding:16px;background:#fef3c7;border-radius:8px;border:1px solid #f59e0b">
          <p style="font-size:14px;color:#92400e;margin:0"><strong>⚕️ Medical Disclaimer:</strong> This quiz is for educational and self-reflection purposes only. It is not a diagnostic tool and does not replace professional medical advice, diagnosis, or treatment. If you have concerns about your health, please consult a qualified healthcare provider.</p>
        </section>
        <section style="margin-top:24px;padding-top:24px;border-top:1px solid #e5e7eb">
          <h2 style="font-size:20px;font-weight:bold;color:#1a1a2e;margin-bottom:12px">Sources &amp; References</h2>
          <p style="font-size:14px;color:#666;margin-bottom:8px">This quiz was developed using questions informed by the following research and clinical frameworks:</p>
          <ul style="font-size:14px;color:#444;line-height:1.8;padding-left:20px">
            ${getSourcesForQuiz(quiz.slug)}
          </ul>
          <p style="font-size:13px;color:#888;margin-top:12px">Content prepared by the <a href="/about" style="color:#7c3aed">Fizzty Editorial Team</a> based on published research. Last reviewed: ${(quiz.updated_at || quiz.created_at || new Date().toISOString()).split('T')[0]}.</p>
        </section>` : ''}
        <section style="margin-top:32px;padding-top:24px;border-top:1px solid #e5e7eb">
          <h2 style="font-size:20px;font-weight:bold;color:#1a1a2e;margin-bottom:12px">Frequently Asked Questions</h2>
          <div>
            <h3 style="font-size:16px;font-weight:600;color:#1a1a2e;margin-top:12px">Is this quiz accurate?</h3>
            <p style="color:#444;line-height:1.6">This quiz uses scenario-based questions grounded in established psychological frameworks. While no online quiz replaces professional assessment, our methodology provides meaningful insights for self-discovery.</p>
            <h3 style="font-size:16px;font-weight:600;color:#1a1a2e;margin-top:12px">How long does this quiz take?</h3>
            <p style="color:#444;line-height:1.6">The quiz takes approximately 3-5 minutes to complete. It consists of ${questions.length} carefully designed questions. Answer honestly with your gut reaction for the most accurate result.</p>
            <h3 style="font-size:16px;font-weight:600;color:#1a1a2e;margin-top:12px">Can I retake the quiz?</h3>
            <p style="color:#444;line-height:1.6">Yes, you can retake the quiz as many times as you like. Your answers may vary depending on your current life circumstances and personal growth.</p>
          </div>
        </section>
      </article>
    `;

  html = html.replace(
    '<div id="root"></div>',
    `<div id="root">${visibleContent}</div>`
  );

  return html;
}

async function processQuizzes(template, quizzes) {
  let success = 0;
  let skipped = 0;

  for (const quiz of quizzes) {
    if (!quiz.slug) {
      skipped++;
      continue;
    }

    const quizDir = path.join(DIST_DIR, 'quiz');
    const outFile = path.join(quizDir, `${quiz.slug}.html`);

    // Skip if already pre-rendered
    if (fs.existsSync(outFile)) {
      skipped++;
      continue;
    }

    try {
      const questions = await fetchQuizQuestions(quiz.id);
      const category = quiz.categories || null;
      const relatedQuizzes = await fetchRelatedQuizzes(quiz);
      const relatedArticles = findRelatedArticles(quiz);
      const html = generateQuizHtml(template, quiz, questions, category, relatedQuizzes, relatedArticles);
      fs.mkdirSync(quizDir, { recursive: true });
      fs.writeFileSync(outFile, html, 'utf8');
      success++;
      console.log(`  OK ${quiz.slug} (${questions.length}Q)`);
    } catch (err) {
      console.error(`  ERR ${quiz.slug}: ${err.message}`);
    }
  }

  return { success, skipped };
}

async function main() {
  const templatePath = path.join(DIST_DIR, 'index.html');
  if (!fs.existsSync(templatePath)) {
    console.error('ERROR: dist/index.html not found. Run `vite build` first.');
    process.exit(1);
  }
  const template = fs.readFileSync(templatePath, 'utf8');

  let totalSuccess = 0;
  let totalSkipped = 0;

  // Pre-fetch all quizzes for related quiz linking
  console.log('Pre-fetching all quizzes for internal linking...');
  {
    let off = 0;
    while (true) {
      const batch = await fetchQuizzes(100, off);
      if (batch.length === 0) break;
      ALL_QUIZZES.push(...batch);
      if (batch.length < 100) break;
      off += 100;
    }
  }
  console.log(`Loaded ${ALL_QUIZZES.length} quizzes for internal linking`);

  // Pre-fetch all articles for quiz↔article cross-linking
  console.log('Pre-fetching articles for cross-linking...');
  {
    let off = 0;
    while (true) {
      const url = `${SUPABASE_URL}/rest/v1/posts?select=id,title,slug,category_id&is_published=eq.true&slug=not.is.null&limit=100&offset=${off}`;
      const res = await fetch(url, { headers: { apikey: SUPABASE_ANON_KEY } });
      if (!res.ok) break;
      const batch = await res.json();
      if (batch.length === 0) break;
      ALL_ARTICLES.push(...batch);
      if (batch.length < 100) break;
      off += 100;
    }
  }
  console.log(`Loaded ${ALL_ARTICLES.length} articles for cross-linking`);

  // Pre-render static pages with proper meta tags AND visible content + internal links
  console.log('\nPre-rendering static pages with internal links...');

  // Group quizzes by category for listing pages
  const quizzesByCategory = {};
  const categoryMap = {};
  for (const q of ALL_QUIZZES) {
    const cat = q.categories || { name: 'Other', slug: 'other' };
    if (!quizzesByCategory[cat.slug]) quizzesByCategory[cat.slug] = [];
    quizzesByCategory[cat.slug].push(q);
    categoryMap[cat.slug] = cat;
  }

  function generateListingContent(pagePath) {
    if (pagePath === 'quizzes') {
      // All quizzes grouped by category with links
      let sections = '';
      for (const [catSlug, quizzes] of Object.entries(quizzesByCategory)) {
        const cat = categoryMap[catSlug];
        const catName = cat ? escapeHtml(cat.name) : 'Other';
        const quizLinks = quizzes.slice(0, 30).map(q =>
          `<li style="margin-bottom:8px"><a href="/quiz/${escapeHtml(q.slug)}" style="color:#7c3aed;text-decoration:none;font-weight:500">${escapeHtml(q.title)}</a></li>`
        ).join('\n              ');
        sections += `
          <section style="margin-bottom:32px">
            <h2 style="font-size:22px;color:#1a1a2e;margin-bottom:12px"><a href="/category/${escapeHtml(catSlug)}" style="color:#1a1a2e;text-decoration:none">${catName}</a> <span style="color:#999;font-size:14px">(${quizzes.length} quizzes)</span></h2>
            <ul style="list-style:none;padding:0">
              ${quizLinks}
            </ul>
          </section>`;
      }
      return `
      <div style="max-width:900px;margin:0 auto;padding:20px;font-family:system-ui,sans-serif">
        <nav style="margin-bottom:16px;font-size:14px;color:#666"><a href="/" style="color:#7c3aed;text-decoration:none">Home</a> &rsaquo; <span>All Quizzes</span></nav>
        <h1 style="font-size:32px;font-weight:bold;color:#1a1a2e;margin-bottom:8px">Free Personality Quizzes & Trivia</h1>
        <p style="color:#666;margin-bottom:24px">Take ${ALL_QUIZZES.length}+ free personality quizzes, trivia challenges, and self-assessments. Instant results!</p>
        ${sections}
        ${ALL_ARTICLES.length > 0 ? `
        <section style="margin-top:40px;padding-top:24px;border-top:1px solid #e5e7eb">
          <h2 style="font-size:22px;color:#1a1a2e;margin-bottom:12px">Latest Articles</h2>
          <ul style="list-style:none;padding:0">
            ${ALL_ARTICLES.slice(-10).reverse().map(a => `<li style="margin-bottom:8px"><a href="/article/${escapeHtml(a.slug)}" style="color:#7c3aed;text-decoration:none;font-weight:500">${escapeHtml(a.title)}</a></li>`).join('\n            ')}
          </ul>
        </section>` : ''}
      </div>`;
    }

    if (pagePath === 'categories') {
      const catCards = Object.entries(quizzesByCategory).map(([catSlug, quizzes]) => {
        const cat = categoryMap[catSlug];
        const catName = cat ? escapeHtml(cat.name) : 'Other';
        const sampleLinks = quizzes.slice(0, 5).map(q =>
          `<li><a href="/quiz/${escapeHtml(q.slug)}" style="color:#7c3aed;text-decoration:none;font-size:14px">${escapeHtml(q.title)}</a></li>`
        ).join('\n                ');
        return `
            <div style="border:1px solid #e5e7eb;border-radius:12px;padding:20px">
              <h2 style="font-size:20px;margin-bottom:8px"><a href="/category/${escapeHtml(catSlug)}" style="color:#1a1a2e;text-decoration:none">${catName}</a></h2>
              <p style="color:#666;font-size:14px;margin-bottom:12px">${quizzes.length} quizzes</p>
              <ul style="list-style:none;padding:0">
                ${sampleLinks}
              </ul>
              <a href="/category/${escapeHtml(catSlug)}" style="display:inline-block;margin-top:12px;color:#7c3aed;font-weight:600;text-decoration:none">View all &rarr;</a>
            </div>`;
      }).join('\n');
      return `
      <div style="max-width:900px;margin:0 auto;padding:20px;font-family:system-ui,sans-serif">
        <nav style="margin-bottom:16px;font-size:14px;color:#666"><a href="/" style="color:#7c3aed;text-decoration:none">Home</a> &rsaquo; <span>Categories</span></nav>
        <h1 style="font-size:32px;font-weight:bold;color:#1a1a2e;margin-bottom:8px">Quiz Categories</h1>
        <p style="color:#666;margin-bottom:24px">Browse personality tests, health assessments, career quizzes, and more.</p>
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:20px">
          ${catCards}
        </div>
      </div>`;
    }

    if (pagePath === 'trending') {
      // Show most recent quizzes as "trending" + recent articles
      const recentQuizzes = ALL_QUIZZES.slice(-20).reverse();
      const quizLinks = recentQuizzes.map(q =>
        `<li style="margin-bottom:12px"><a href="/quiz/${escapeHtml(q.slug)}" style="color:#7c3aed;text-decoration:none;font-weight:500;font-size:16px">${escapeHtml(q.title)}</a>${q.categories ? `<span style="color:#999;font-size:13px;margin-left:8px">${escapeHtml(q.categories.name)}</span>` : ''}</li>`
      ).join('\n            ');
      return `
      <div style="max-width:900px;margin:0 auto;padding:20px;font-family:system-ui,sans-serif">
        <nav style="margin-bottom:16px;font-size:14px;color:#666"><a href="/" style="color:#7c3aed;text-decoration:none">Home</a> &rsaquo; <span>Trending</span></nav>
        <h1 style="font-size:32px;font-weight:bold;color:#1a1a2e;margin-bottom:8px">Trending Quizzes</h1>
        <p style="color:#666;margin-bottom:24px">The most popular personality tests and self-assessments right now.</p>
        <ul style="list-style:none;padding:0">
          ${quizLinks}
        </ul>
        ${ALL_ARTICLES.length > 0 ? `
        <section style="margin-top:40px;padding-top:24px;border-top:1px solid #e5e7eb">
          <h2 style="font-size:22px;color:#1a1a2e;margin-bottom:12px">Latest Articles</h2>
          <ul style="list-style:none;padding:0">
            ${ALL_ARTICLES.slice(-8).reverse().map(a => `<li style="margin-bottom:8px"><a href="/article/${escapeHtml(a.slug)}" style="color:#7c3aed;text-decoration:none;font-weight:500">${escapeHtml(a.title)}</a></li>`).join('\n            ')}
          </ul>
        </section>` : ''}
      </div>`;
    }

    return ''; // about, contact, privacy, terms — no quiz links needed
  }

  const staticPages = [
    { path: 'quizzes', title: 'Free Personality Quizzes & Trivia | Fizzty', desc: 'Take free personality quizzes, trivia challenges, and self-assessments. 470+ quizzes on psychology, health, career, and entertainment. Instant results!', priority: 'high' },
    { path: 'categories', title: 'Quiz Categories — Personality, Health, Career & More | Fizzty', desc: 'Browse quiz categories: personality tests, health assessments, career quizzes, entertainment trivia, and more. Find the perfect quiz for you.' },
    { path: 'trending', title: 'Trending Quizzes — Most Popular Right Now | Fizzty', desc: 'See what quizzes are trending right now. The most popular personality tests, trivia challenges, and self-assessments on Fizzty.' },
    { path: 'about', title: 'About Fizzty — Our Mission & Editorial Standards', desc: 'Learn about Fizzty, our editorial standards, and how we create research-informed personality quizzes and health assessments.' },
    { path: 'contact', title: 'Contact Fizzty — Get in Touch', desc: 'Have a question or suggestion? Contact the Fizzty team. We\'d love to hear from you.' },
    { path: 'privacy-policy', title: 'Privacy Policy | Fizzty', desc: 'Read Fizzty\'s privacy policy. Learn how we collect, use, and protect your data.' },
    { path: 'terms', title: 'Terms of Service | Fizzty', desc: 'Read Fizzty\'s terms of service and conditions of use.' },
  ];

  for (const page of staticPages) {
    const outFile = path.join(DIST_DIR, `${page.path}.html`);
    if (fs.existsSync(outFile)) continue;

    let html = template;
    html = html.replace(/<title>.*?<\/title>/, `<title>${escapeHtml(page.title)}</title>`);
    html = html.replace(
      /<meta name="description" content="[^"]*" \/>/,
      `<meta name="description" content="${escapeHtml(page.desc)}" />`
    );
    const canonical = `${BASE_URL}/${page.path}`;
    const seoTags = `
    <link rel="canonical" href="${canonical}" />
    <meta property="og:title" content="${escapeHtml(page.title)}" />
    <meta property="og:description" content="${escapeHtml(page.desc)}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:type" content="website" />
  `;
    html = html.replace('</head>', `${seoTags}\n  </head>`);

    // Inject visible content with internal links for listing pages
    const listingContent = generateListingContent(page.path);
    if (listingContent) {
      html = html.replace('<div id="root"></div>', `<div id="root">${listingContent}</div>`);
    }

    fs.writeFileSync(outFile, html, 'utf8');
  }
  console.log(`Static pages: ${staticPages.length} pre-rendered (with internal links)`);

  // Pre-render individual category pages with quiz links
  console.log('Pre-rendering category pages...');
  let catCount = 0;
  for (const [catSlug, quizzes] of Object.entries(quizzesByCategory)) {
    const catDir = path.join(DIST_DIR, 'category');
    const outFile = path.join(catDir, `${catSlug}.html`);
    if (fs.existsSync(outFile)) continue;

    const cat = categoryMap[catSlug];
    const catName = cat ? cat.name : catSlug;
    const catTitle = `${catName} Quizzes — Free ${catName} Personality Tests | Fizzty`;
    const catDesc = `Take free ${catName.toLowerCase()} quizzes and personality tests. ${quizzes.length} quizzes with instant results on Fizzty.`;

    let html = template;
    html = html.replace(/<title>.*?<\/title>/, `<title>${escapeHtml(catTitle)}</title>`);
    html = html.replace(
      /<meta name="description" content="[^"]*" \/>/,
      `<meta name="description" content="${escapeHtml(catDesc)}" />`
    );
    const canonical = `${BASE_URL}/category/${catSlug}`;
    const seoTags = `
    <link rel="canonical" href="${canonical}" />
    <meta property="og:title" content="${escapeHtml(catTitle)}" />
    <meta property="og:description" content="${escapeHtml(catDesc)}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:type" content="website" />
  `;
    html = html.replace('</head>', `${seoTags}\n  </head>`);

    const quizLinks = quizzes.map(q =>
      `<li style="margin-bottom:10px"><a href="/quiz/${escapeHtml(q.slug)}" style="color:#7c3aed;text-decoration:none;font-weight:500;font-size:16px">${escapeHtml(q.title)}</a></li>`
    ).join('\n            ');

    // Find articles in this category
    const catArticles = ALL_ARTICLES.filter(a => a.category_id === (cat && quizzes[0] ? quizzes[0].category_id : null)).slice(0, 6);

    const catContent = `
      <div style="max-width:900px;margin:0 auto;padding:20px;font-family:system-ui,sans-serif">
        <nav style="margin-bottom:16px;font-size:14px;color:#666">
          <a href="/" style="color:#7c3aed;text-decoration:none">Home</a>
          &rsaquo; <a href="/categories" style="color:#7c3aed;text-decoration:none">Categories</a>
          &rsaquo; <span>${escapeHtml(catName)}</span>
        </nav>
        <h1 style="font-size:32px;font-weight:bold;color:#1a1a2e;margin-bottom:8px">${escapeHtml(catName)} Quizzes</h1>
        <p style="color:#666;margin-bottom:24px">${quizzes.length} free ${escapeHtml(catName.toLowerCase())} personality quizzes and self-assessments.</p>
        <ul style="list-style:none;padding:0">
          ${quizLinks}
        </ul>
        ${catArticles.length > 0 ? `
        <section style="margin-top:40px;padding-top:24px;border-top:1px solid #e5e7eb">
          <h2 style="font-size:22px;color:#1a1a2e;margin-bottom:12px">Related Articles</h2>
          <ul style="list-style:none;padding:0">
            ${catArticles.map(a => `<li style="margin-bottom:8px"><a href="/article/${escapeHtml(a.slug)}" style="color:#7c3aed;text-decoration:none;font-weight:500">${escapeHtml(a.title)}</a></li>`).join('\n            ')}
          </ul>
        </section>` : ''}
      </div>`;

    html = html.replace('<div id="root"></div>', `<div id="root">${catContent}</div>`);
    fs.mkdirSync(catDir, { recursive: true });
    fs.writeFileSync(outFile, html, 'utf8');
    catCount++;
  }
  console.log(`Category pages: ${catCount} pre-rendered with quiz links`);

  if (ALL) {
    // Process ALL quizzes in batches of 50
    let offset = 0;
    const batchSize = 50;
    let batch = 1;

    while (true) {
      console.log(`Batch ${batch}: processing quizzes (offset=${offset})...`);
      const quizzes = ALL_QUIZZES.slice(offset, offset + batchSize);
      if (quizzes.length === 0) break;

      const { success, skipped } = await processQuizzes(template, quizzes);
      totalSuccess += success;
      totalSkipped += skipped;

      if (quizzes.length < batchSize) break;
      offset += batchSize;
      batch++;
    }
  } else {
    // Single batch with custom limit/offset
    console.log(`Fetching quizzes (limit=${LIMIT}, offset=${OFFSET})...`);
    const quizzes = await fetchQuizzes(LIMIT, OFFSET);
    console.log(`Got ${quizzes.length} quizzes`);
    const { success, skipped } = await processQuizzes(template, quizzes);
    totalSuccess = success;
    totalSkipped = skipped;
  }

  const quizDirCount = path.join(DIST_DIR, 'quiz');
  const total = fs.existsSync(quizDirCount) ? fs.readdirSync(quizDirCount).filter(f => f.endsWith('.html')).length : 0;
  console.log(`\nQuizzes: ${totalSuccess} pre-rendered, ${totalSkipped} skipped.`);
  console.log(`Total files in dist/quiz/: ${total}`);

  // Pre-render articles
  console.log('\nPre-rendering articles...');
  let articleSuccess = 0;
  let articleSkipped = 0;
  let articleOffset = 0;
  const articleBatchSize = 100;

  while (true) {
    const url = `${SUPABASE_URL}/rest/v1/posts?select=id,title,slug,description,content,image_url,category_id,created_at,updated_at,categories(name,slug)&is_published=eq.true&slug=not.is.null&order=created_at.asc&limit=${articleBatchSize}&offset=${articleOffset}`;
    const res = await fetch(url, { headers: { apikey: SUPABASE_ANON_KEY } });
    if (!res.ok) break;
    const articles = await res.json();
    if (articles.length === 0) break;

    for (const article of articles) {
      if (!article.slug) { articleSkipped++; continue; }
      const artDir = path.join(DIST_DIR, 'article');
      const outFile = path.join(artDir, `${article.slug}.html`);
      if (fs.existsSync(outFile)) { articleSkipped++; continue; }

      try {
        const artTitle = `${article.title} | Fizzty`;
        const artDesc = truncate(article.description || article.title, 160);
        const canonical = `${BASE_URL}/article/${article.slug}`;
        const image = article.image_url || `${BASE_URL}/favicon.png`;
        const category = article.categories || null;

        // Clean content for display
        let cleanContent = (article.content || '').substring(0, 3000);
        // Strip meta sections
        cleanContent = cleanContent
          .replace(/^#{1,3}\s*(META|ARTICLE META|QUIZ BRIEF|ARTICLE CONTENT|QUIZ CTA|INTERNAL LINKING NOTES).*$/gm, '')
          .replace(/^\*?\*?(Meta Title|Meta Description|Target Keyword|Secondary Keywords?|OG Image|Slug|Category|Type).*$/gm, '')
          .replace(/^- Links? OUT to:.*$/gm, '')
          .replace(/^- Should be linked FROM:.*$/gm, '')
          .replace(/^---\s*$/gm, '')
          .replace(/\n{3,}/g, '\n\n')
          .trim();

        const contentHtml = cleanContent
          .split(/\n\n+/)
          .filter(p => p.trim())
          .slice(0, 6)
          .map(p => `<p>${escapeHtml(p.trim())}</p>`)
          .join('\n        ');

        // Build article schema
        const articleSchema = JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: article.title,
          description: artDesc,
          image: image,
          url: canonical,
          datePublished: article.created_at,
          dateModified: article.updated_at || article.created_at,
          publisher: { '@type': 'Organization', name: 'Fizzty', url: BASE_URL },
          author: { '@type': 'Organization', name: 'Fizzty Editorial Team' },
        });

        let html = template;
        html = html.replace(/<title>.*?<\/title>/, `<title>${escapeHtml(artTitle)}</title>`);
        html = html.replace(
          /<meta name="description" content="[^"]*" \/>/,
          `<meta name="description" content="${escapeHtml(artDesc)}" />`
        );

        const seoTags = `
    <link rel="canonical" href="${canonical}" />
    <meta property="og:title" content="${escapeHtml(artTitle)}" />
    <meta property="og:description" content="${escapeHtml(artDesc)}" />
    <meta property="og:image" content="${escapeHtml(image)}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:type" content="article" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(artTitle)}" />
    <meta name="twitter:description" content="${escapeHtml(artDesc)}" />
    <meta name="twitter:image" content="${escapeHtml(image)}" />
    <script type="application/ld+json">${articleSchema}</script>
  `;
        html = html.replace('</head>', `${seoTags}\n  </head>`);

        const visibleContent = `
      <article style="max-width:800px;margin:0 auto;padding:20px;font-family:system-ui,sans-serif">
        <nav aria-label="breadcrumb" style="margin-bottom:16px;font-size:14px;color:#666">
          <a href="/" style="color:#7c3aed;text-decoration:none">Home</a>
          ${category ? ` &rsaquo; <a href="/category/${category.slug}" style="color:#7c3aed;text-decoration:none">${escapeHtml(category.name)}</a>` : ''}
          &rsaquo; <span>${escapeHtml(article.title)}</span>
        </nav>
        <h1 style="font-size:32px;font-weight:bold;color:#1a1a2e;margin-bottom:16px">${escapeHtml(article.title)}</h1>
        ${image ? `<img src="${escapeHtml(image)}" alt="${escapeHtml(article.title)}" width="800" height="400" style="width:100%;height:auto;border-radius:12px;margin-bottom:20px" />` : ''}
        <div style="color:#444;line-height:1.7">
        ${contentHtml}
        </div>
        <p style="margin-top:24px"><a href="/article/${article.slug}" style="display:inline-block;padding:12px 32px;background:#7c3aed;color:#fff;border-radius:8px;text-decoration:none;font-weight:bold">Read Full Article</a></p>
        ${(() => {
          // Find related quizzes for this article
          const artWords = new Set(article.title.toLowerCase().replace(/[^a-z0-9 ]/g, '').split(/\s+/).filter(w => w.length > 3));
          const relQuizzes = ALL_QUIZZES
            .map(q => {
              let score = 0;
              if (q.category_id === article.category_id) score += 3;
              const qWords = q.title.toLowerCase().replace(/[^a-z0-9 ]/g, '').split(/\s+/).filter(w => w.length > 3);
              for (const w of qWords) { if (artWords.has(w)) score += 2; }
              return { ...q, score };
            })
            .filter(q => q.score >= 3)
            .sort((a, b) => b.score - a.score)
            .slice(0, 6);
          const relArticles = ALL_ARTICLES
            .filter(a => a.id !== article.id && a.slug)
            .filter(a => a.category_id === article.category_id)
            .slice(0, 4);
          let html = '';
          if (relQuizzes.length > 0) {
            html += `
        <section style="margin-top:40px;padding-top:24px;border-top:1px solid #e5e7eb">
          <h2 style="font-size:24px;font-weight:bold;color:#1a1a2e;margin-bottom:16px">Related Quizzes</h2>
          <ul style="list-style:none;padding:0;display:grid;grid-template-columns:repeat(2,1fr);gap:12px">
            ${relQuizzes.map(q => `<li><a href="/quiz/${escapeHtml(q.slug)}" style="display:block;padding:12px;border:1px solid #e5e7eb;border-radius:8px;text-decoration:none;color:#7c3aed;font-weight:600">${escapeHtml(q.title)}</a></li>`).join('\n            ')}
          </ul>
        </section>`;
          }
          if (relArticles.length > 0) {
            html += `
        <section style="margin-top:24px;padding-top:24px;border-top:1px solid #e5e7eb">
          <h2 style="font-size:20px;font-weight:bold;color:#1a1a2e;margin-bottom:12px">More Articles</h2>
          <ul style="list-style:none;padding:0">
            ${relArticles.map(a => `<li style="margin-bottom:8px"><a href="/article/${escapeHtml(a.slug)}" style="color:#7c3aed;font-weight:600;text-decoration:none">${escapeHtml(a.title)}</a></li>`).join('\n            ')}
          </ul>
        </section>`;
          }
          return html;
        })()}
      </article>
    `;

        html = html.replace('<div id="root"></div>', `<div id="root">${visibleContent}</div>`);

        fs.mkdirSync(artDir, { recursive: true });
        fs.writeFileSync(outFile, html, 'utf8');
        articleSuccess++;
        if (articleSuccess % 20 === 0) console.log(`  ${articleSuccess} articles pre-rendered...`);
      } catch (err) {
        console.error(`  ERR article ${article.slug}: ${err.message}`);
      }
    }

    if (articles.length < articleBatchSize) break;
    articleOffset += articleBatchSize;
  }

  const articleDirCount = path.join(DIST_DIR, 'article');
  const totalArticles = fs.existsSync(articleDirCount) ? fs.readdirSync(articleDirCount).filter(f => f.endsWith('.html')).length : 0;
  console.log(`Articles: ${articleSuccess} pre-rendered, ${articleSkipped} skipped.`);
  console.log(`Total files in dist/article/: ${totalArticles}`);

  // Pre-render homepage with visible content + internal links (CRITICAL for Googlebot)
  console.log('\nPre-rendering homepage with internal links...');
  {
    let homepageHtml = template;
    const homeTitle = 'Fizzty — Free Personality Quizzes, Trivia & Self-Discovery';
    const homeDesc = 'Take free personality quizzes, trivia challenges, and self-assessments. Discover your personality type, test your knowledge, and explore trending quizzes. Instant results!';
    homepageHtml = homepageHtml.replace(/<title>.*?<\/title>/, `<title>${escapeHtml(homeTitle)}</title>`);
    homepageHtml = homepageHtml.replace(
      /<meta name="description" content="[^"]*" \/>/,
      `<meta name="description" content="${escapeHtml(homeDesc)}" />`
    );
    const homeSeoTags = `
    <link rel="canonical" href="${BASE_URL}/" />
    <meta property="og:title" content="${escapeHtml(homeTitle)}" />
    <meta property="og:description" content="${escapeHtml(homeDesc)}" />
    <meta property="og:url" content="${BASE_URL}/" />
    <meta property="og:type" content="website" />
    <meta property="og:image" content="${BASE_URL}/favicon.png" />
  `;
    homepageHtml = homepageHtml.replace('</head>', `${homeSeoTags}\n  </head>`);

    // Build homepage visible content: featured quizzes + categories + articles
    const featuredQuizzes = ALL_QUIZZES.slice(-12).reverse();
    const categories = Object.entries(quizzesByCategory);
    const recentArticles = ALL_ARTICLES.slice(-6).reverse();

    const homeContent = `
      <div style="max-width:1000px;margin:0 auto;padding:20px;font-family:system-ui,sans-serif">
        <header style="text-align:center;margin-bottom:40px">
          <h1 style="font-size:36px;font-weight:bold;color:#1a1a2e">Fizzty</h1>
          <p style="font-size:18px;color:#666;max-width:600px;margin:8px auto">Free personality quizzes, trivia challenges, and self-discovery assessments. ${ALL_QUIZZES.length}+ quizzes with instant results.</p>
        </header>

        <section style="margin-bottom:40px">
          <h2 style="font-size:24px;font-weight:bold;color:#1a1a2e;margin-bottom:16px">Popular Quizzes</h2>
          <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:16px">
            ${featuredQuizzes.map(q => `
            <a href="/quiz/${escapeHtml(q.slug)}" style="display:block;border:1px solid #e5e7eb;border-radius:12px;padding:16px;text-decoration:none">
              <h3 style="font-size:16px;font-weight:600;color:#7c3aed;margin-bottom:4px">${escapeHtml(q.title)}</h3>
              ${q.categories ? `<span style="font-size:13px;color:#999">${escapeHtml(q.categories.name)}</span>` : ''}
            </a>`).join('\n')}
          </div>
          <p style="margin-top:16px"><a href="/quizzes" style="color:#7c3aed;font-weight:600;text-decoration:none">Browse all ${ALL_QUIZZES.length} quizzes &rarr;</a></p>
        </section>

        <section style="margin-bottom:40px">
          <h2 style="font-size:24px;font-weight:bold;color:#1a1a2e;margin-bottom:16px">Categories</h2>
          <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:12px">
            ${categories.map(([slug, quizzes]) => {
              const cat = categoryMap[slug];
              return `<a href="/category/${escapeHtml(slug)}" style="display:block;padding:16px;border:1px solid #e5e7eb;border-radius:8px;text-decoration:none">
              <span style="font-weight:600;color:#1a1a2e">${escapeHtml(cat ? cat.name : slug)}</span>
              <span style="display:block;font-size:13px;color:#999;margin-top:4px">${quizzes.length} quizzes</span>
            </a>`;
            }).join('\n')}
          </div>
          <p style="margin-top:16px"><a href="/categories" style="color:#7c3aed;font-weight:600;text-decoration:none">View all categories &rarr;</a></p>
        </section>

        ${recentArticles.length > 0 ? `
        <section style="margin-bottom:40px">
          <h2 style="font-size:24px;font-weight:bold;color:#1a1a2e;margin-bottom:16px">Latest Articles</h2>
          <ul style="list-style:none;padding:0">
            ${recentArticles.map(a => `<li style="margin-bottom:12px"><a href="/article/${escapeHtml(a.slug)}" style="color:#7c3aed;font-weight:600;text-decoration:none;font-size:16px">${escapeHtml(a.title)}</a></li>`).join('\n            ')}
          </ul>
        </section>` : ''}

        <nav style="margin-top:24px;padding-top:24px;border-top:1px solid #e5e7eb">
          <p style="color:#666;font-size:14px">
            <a href="/quizzes" style="color:#7c3aed;margin-right:16px">All Quizzes</a>
            <a href="/categories" style="color:#7c3aed;margin-right:16px">Categories</a>
            <a href="/trending" style="color:#7c3aed;margin-right:16px">Trending</a>
            <a href="/about" style="color:#7c3aed;margin-right:16px">About</a>
            <a href="/contact" style="color:#7c3aed">Contact</a>
          </p>
        </nav>
      </div>`;

    homepageHtml = homepageHtml.replace('<div id="root"></div>', `<div id="root">${homeContent}</div>`);
    fs.writeFileSync(path.join(DIST_DIR, 'index.html'), homepageHtml, 'utf8');
    console.log('Homepage pre-rendered with internal links to all content');
  }

  // Generate /post/:id → /article/:slug 301 redirects
  // Google indexed old /post/UUID URLs; this transfers ranking equity to canonical URLs
  console.log('\nGenerating /post/ → /article/ redirects...');
  const redirectLines = ['# Legacy /post/:id → /article/:slug redirects (SEO consolidation)'];
  let redirectCount = 0;

  // Fetch all posts with their UUIDs for redirect mapping
  let redirOffset = 0;
  while (true) {
    const url = `${SUPABASE_URL}/rest/v1/posts?select=id,slug&is_published=eq.true&slug=not.is.null&limit=100&offset=${redirOffset}`;
    const res = await fetch(url, { headers: { apikey: SUPABASE_ANON_KEY } });
    if (!res.ok) break;
    const batch = await res.json();
    if (batch.length === 0) break;
    for (const post of batch) {
      if (post.id && post.slug) {
        redirectLines.push(`/post/${post.id} /article/${post.slug} 301`);
        redirectCount++;
      }
    }
    if (batch.length < 100) break;
    redirOffset += 100;
  }

  const redirectsPath = path.join(DIST_DIR, '_redirects');
  fs.writeFileSync(redirectsPath, redirectLines.join('\n') + '\n', 'utf8');
  console.log(`Generated ${redirectCount} post→article redirects in _redirects`);
}

main().catch(console.error);
