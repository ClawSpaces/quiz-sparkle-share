#!/usr/bin/env node
/**
 * Generate llms.txt and llms-full.txt for AI crawlers.
 * llms.txt = site overview + index of all content
 * llms-full.txt = full content dump (quizzes + articles)
 */

const fs = require('fs');
const path = require('path');

const SUPABASE_URL = 'https://gymwbfevlbbyanobpiwr.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd5bXdiZmV2bGJieWFub2JwaXdyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwMDYyNzYsImV4cCI6MjA4ODU4MjI3Nn0.u-esnjA-SDnBbBeO_LYpLvMhq9frrMQuEarYtS2lHhg';
const BASE_URL = 'https://fizzty.com';
const DIST_DIR = path.resolve(__dirname, '../dist');

async function fetchAll(table, select, filter = '') {
  let all = [];
  let offset = 0;
  while (true) {
    const url = `${SUPABASE_URL}/rest/v1/${table}?select=${select}${filter}&limit=100&offset=${offset}`;
    const res = await fetch(url, { headers: { apikey: SUPABASE_ANON_KEY } });
    if (!res.ok) break;
    const data = await res.json();
    if (data.length === 0) break;
    all.push(...data);
    if (data.length < 100) break;
    offset += 100;
  }
  return all;
}

async function main() {
  console.log('Generating llms.txt files...');

  const [quizzes, articles, categories] = await Promise.all([
    fetchAll('quizzes', 'title,slug,description,category_id,categories(name)', '&is_published=eq.true&order=created_at.desc'),
    fetchAll('posts', 'title,slug,description,content,category_id,categories(name)', '&is_published=eq.true&slug=not.is.null&order=created_at.desc'),
    fetchAll('categories', 'name,slug', '&order=name.asc'),
  ]);

  console.log(`Fetched ${quizzes.length} quizzes, ${articles.length} articles, ${categories.length} categories`);

  // ===== llms.txt (overview + index) =====
  let llms = `# Fizzty — Free Personality Quizzes & Self-Assessments

> Fizzty is a quiz platform with ${quizzes.length}+ free personality quizzes, health assessments, and trivia challenges. All quizzes use scenario-based questions grounded in psychological research. No signup required, instant results.

## About

Fizzty creates research-informed personality quizzes and self-assessments. Health-related quizzes are based on established clinical frameworks (AQ, RAADS-R, SCOFF, DSM-5 criteria) and include medical disclaimers and source citations. Content is prepared by the Fizzty Editorial Team.

- Website: ${BASE_URL}
- Contact: john.nedev@gmail.com
- Editorial Standards: ${BASE_URL}/about

## Categories

${categories.map(c => `- [${c.name}](${BASE_URL}/category/${c.slug})`).join('\n')}

## Quizzes (${quizzes.length})

${quizzes.map(q => {
  const cat = q.categories ? q.categories.name : 'General';
  const desc = (q.description || '').replace(/\n/g, ' ').substring(0, 150);
  return `- [${q.title}](${BASE_URL}/quiz/${q.slug}): ${desc}...`;
}).join('\n')}

## Articles (${articles.length})

${articles.map(a => {
  const desc = (a.description || '').replace(/\n/g, ' ').substring(0, 150);
  return `- [${a.title}](${BASE_URL}/article/${a.slug}): ${desc}...`;
}).join('\n')}

## Optional

- [Full content dump](${BASE_URL}/llms-full.txt): Complete text of all quizzes and articles for deep context.
- [Sitemap](${BASE_URL}/sitemap.xml): XML sitemap with all URLs.
`;

  // ===== llms-full.txt (full content) =====
  let full = `# Fizzty — Full Content Dump for AI Systems

> This file contains the full text of all ${quizzes.length} quizzes and ${articles.length} articles on Fizzty.com.
> Generated: ${new Date().toISOString().split('T')[0]}
> Website: ${BASE_URL}

---

`;

  // Add quizzes (title + description only, not questions — those are the interactive part)
  full += `# Quizzes\n\n`;
  for (const q of quizzes) {
    const cat = q.categories ? q.categories.name : 'General';
    const desc = (q.description || '').substring(0, 2000);
    full += `## ${q.title}\n\n`;
    full += `- URL: ${BASE_URL}/quiz/${q.slug}\n`;
    full += `- Category: ${cat}\n\n`;
    full += `${desc}\n\n---\n\n`;
  }

  // Add articles (full content)
  full += `# Articles\n\n`;
  for (const a of articles) {
    const cat = a.categories ? a.categories.name : 'General';
    // Clean content
    let content = (a.content || a.description || '').substring(0, 5000);
    content = content
      .replace(/^#{1,3}\s*(META|ARTICLE META|QUIZ BRIEF|ARTICLE CONTENT|INTERNAL LINKING NOTES).*$/gm, '')
      .replace(/^\*?\*?(Meta Title|Meta Description|Target Keyword|Secondary Keywords?).*$/gm, '')
      .replace(/^- Links? OUT to:.*$/gm, '')
      .replace(/^- Should be linked FROM:.*$/gm, '')
      .replace(/\n{3,}/g, '\n\n')
      .trim();

    full += `## ${a.title}\n\n`;
    full += `- URL: ${BASE_URL}/article/${a.slug}\n`;
    full += `- Category: ${cat}\n\n`;
    full += `${content}\n\n---\n\n`;
  }

  // Write files
  fs.writeFileSync(path.join(DIST_DIR, 'llms.txt'), llms, 'utf8');
  fs.writeFileSync(path.join(DIST_DIR, 'llms-full.txt'), full, 'utf8');

  const llmsSize = (Buffer.byteLength(llms) / 1024).toFixed(0);
  const fullSize = (Buffer.byteLength(full) / 1024).toFixed(0);
  console.log(`llms.txt: ${llmsSize}KB (${quizzes.length} quizzes + ${articles.length} articles index)`);
  console.log(`llms-full.txt: ${fullSize}KB (full content dump)`);
}

main().catch(console.error);
