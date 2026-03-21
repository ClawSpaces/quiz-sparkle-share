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
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--limit' && args[i + 1]) LIMIT = parseInt(args[i + 1]);
  if (args[i] === '--offset' && args[i + 1]) OFFSET = parseInt(args[i + 1]);
}

async function fetchQuizzes(limit, offset) {
  const url = `${SUPABASE_URL}/rest/v1/quizzes?select=id,title,slug,description,image_url,category_id,created_at,updated_at,categories(name,slug)&is_published=eq.true&order=created_at.asc&limit=${limit}&offset=${offset}`;
  const res = await fetch(url, {
    headers: { apikey: SUPABASE_ANON_KEY },
  });
  if (!res.ok) throw new Error(`Failed to fetch quizzes: ${res.status}`);
  return res.json();
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

  return schemas.map((s) => JSON.stringify(s)).join('\n');
}

function generateQuizHtml(template, quiz, questions, category) {
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
      </article>
    `;

  html = html.replace(
    '<div id="root"></div>',
    `<div id="root">${visibleContent}</div>`
  );

  return html;
}

async function main() {
  // Read the compiled index.html as template
  const templatePath = path.join(DIST_DIR, 'index.html');
  if (!fs.existsSync(templatePath)) {
    console.error('ERROR: dist/index.html not found. Run `vite build` first.');
    process.exit(1);
  }
  const template = fs.readFileSync(templatePath, 'utf8');

  console.log(`Fetching quizzes (limit=${LIMIT}, offset=${OFFSET})...`);
  const quizzes = await fetchQuizzes(LIMIT, OFFSET);
  console.log(`Got ${quizzes.length} quizzes`);

  let success = 0;
  let skipped = 0;

  for (const quiz of quizzes) {
    if (!quiz.slug) {
      skipped++;
      continue;
    }

    const outDir = path.join(DIST_DIR, 'quiz', quiz.slug);
    const outFile = path.join(outDir, 'index.html');

    // Skip if already pre-rendered
    if (fs.existsSync(outFile)) {
      console.log(`  SKIP ${quiz.slug} (already exists)`);
      skipped++;
      continue;
    }

    try {
      // Fetch questions for this quiz
      const questions = await fetchQuizQuestions(quiz.id);

      // Get category info
      const category = quiz.categories || null;

      // Generate HTML
      const html = generateQuizHtml(template, quiz, questions, category);

      // Write file
      fs.mkdirSync(outDir, { recursive: true });
      fs.writeFileSync(outFile, html, 'utf8');

      success++;
      console.log(`  OK ${quiz.slug} (${questions.length}Q)`);
    } catch (err) {
      console.error(`  ERR ${quiz.slug}: ${err.message}`);
    }
  }

  console.log(`\nDone! ${success} pre-rendered, ${skipped} skipped.`);
  console.log(`Total files in dist/quiz/: ${fs.readdirSync(path.join(DIST_DIR, 'quiz')).length}`);
}

main().catch(console.error);
