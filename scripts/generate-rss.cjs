#!/usr/bin/env node
/**
 * Generate RSS feed (feed.xml) for latest articles.
 */
const fs = require('fs');
const path = require('path');

const SUPABASE_URL = 'https://gymwbfevlbbyanobpiwr.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd5bXdiZmV2bGJieWFub2JwaXdyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwMDYyNzYsImV4cCI6MjA4ODU4MjI3Nn0.u-esnjA-SDnBbBeO_LYpLvMhq9frrMQuEarYtS2lHhg';
const BASE_URL = 'https://fizzty.com';
const DIST_DIR = path.resolve(__dirname, '../dist');

function escapeXml(str) {
  if (!str) return '';
  return str.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case "'": return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

function toRFC2822(dateStr) {
  return new Date(dateStr).toUTCString();
}

async function fetchLatestArticles() {
  const url = `${SUPABASE_URL}/rest/v1/posts?select=title,slug,description,created_at&is_published=eq.true&slug=not.is.null&order=created_at.desc&limit=20`;
  const res = await fetch(url, {
    headers: { apikey: SUPABASE_ANON_KEY },
  });
  if (!res.ok) throw new Error(`Failed to fetch articles: ${res.status}`);
  return res.json();
}

function generateRSS(articles) {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<rss version="2.0">\n';
  xml += '  <channel>\n';
  xml += '    <title>Fizzty</title>\n';
  xml += `    <link>${BASE_URL}</link>\n`;
  xml += '    <description>Latest articles from Fizzty</description>\n';
  xml += '    <language>en</language>\n';

  for (const article of articles) {
    if (!article.slug) continue;
    const link = `${BASE_URL}/article/${escapeXml(article.slug)}`;
    const desc = article.description
      ? escapeXml(article.description.substring(0, 300))
      : '';

    xml += '    <item>\n';
    xml += `      <title>${escapeXml(article.title || '')}</title>\n`;
    xml += `      <link>${link}</link>\n`;
    xml += `      <description>${desc}</description>\n`;
    xml += `      <pubDate>${toRFC2822(article.created_at)}</pubDate>\n`;
    xml += `      <guid isPermaLink="true">${link}</guid>\n`;
    xml += '    </item>\n';
  }

  xml += '  </channel>\n';
  xml += '</rss>';
  return xml;
}

async function main() {
  console.log('Fetching latest articles for RSS feed...');

  const articles = await fetchLatestArticles();
  console.log(`Found ${articles.length} articles`);

  const rss = generateRSS(articles);

  if (!fs.existsSync(DIST_DIR)) {
    fs.mkdirSync(DIST_DIR, { recursive: true });
  }

  const outputPath = path.join(DIST_DIR, 'feed.xml');
  fs.writeFileSync(outputPath, rss, 'utf8');
  console.log(`RSS feed generated: ${outputPath}`);
}

main().catch(console.error);
