#!/usr/bin/env node
/**
 * Generate sitemap.xml for all quizzes and static pages.
 * Fetches quiz data from Supabase and creates XML sitemap.
 */

const fs = require('fs');
const path = require('path');

const SUPABASE_URL = 'https://gymwbfevlbbyanobpiwr.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd5bXdiZmV2bGJieWFub2JwaXdyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwMDYyNzYsImV4cCI6MjA4ODU4MjI3Nn0.u-esnjA-SDnBbBeO_LYpLvMhq9frrMQuEarYtS2lHhg';
const BASE_URL = 'https://fizzty.com';
const DIST_DIR = path.resolve(__dirname, '../dist');

async function fetchAllQuizzes() {
  let allQuizzes = [];
  let offset = 0;
  const batchSize = 100;

  while (true) {
    const url = `${SUPABASE_URL}/rest/v1/quizzes?select=slug,updated_at,created_at&is_published=eq.true&order=created_at.asc&limit=${batchSize}&offset=${offset}`;
    const res = await fetch(url, {
      headers: { apikey: SUPABASE_ANON_KEY },
    });
    if (!res.ok) throw new Error(`Failed to fetch quizzes: ${res.status}`);
    
    const quizzes = await res.json();
    if (quizzes.length === 0) break;
    
    allQuizzes = allQuizzes.concat(quizzes);
    if (quizzes.length < batchSize) break;
    offset += batchSize;
  }

  return allQuizzes;
}

async function fetchAllArticles() {
  let allArticles = [];
  let offset = 0;
  const batchSize = 100;

  while (true) {
    const url = `${SUPABASE_URL}/rest/v1/posts?select=id,slug,updated_at,created_at&is_published=eq.true&slug=not.is.null&order=created_at.asc&limit=${batchSize}&offset=${offset}`;
    const res = await fetch(url, {
      headers: { apikey: SUPABASE_ANON_KEY },
    });
    if (!res.ok) return allArticles;

    const articles = await res.json();
    if (articles.length === 0) break;

    allArticles = allArticles.concat(articles);
    if (articles.length < batchSize) break;
    offset += batchSize;
  }

  return allArticles;
}

async function fetchAllCategories() {
  const url = `${SUPABASE_URL}/rest/v1/categories?select=slug,updated_at,created_at&order=created_at.asc`;
  const res = await fetch(url, {
    headers: { apikey: SUPABASE_ANON_KEY },
  });
  if (!res.ok) return [];
  return res.json();
}

function formatDate(dateStr) {
  return new Date(dateStr).toISOString().split('T')[0];
}

function escapeXml(str) {
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

async function fetchNewsArticles() {
  const fortyEightHoursAgo = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();
  const url = `${SUPABASE_URL}/rest/v1/posts?select=title,slug,created_at,primary_keyword&is_published=eq.true&slug=like.news-*&created_at=gte.${fortyEightHoursAgo}&order=created_at.desc`;
  const res = await fetch(url, {
    headers: { apikey: SUPABASE_ANON_KEY },
  });
  if (!res.ok) return [];
  return res.json();
}

function generateNewsSitemap(articles) {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n';
  xml += '        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">\n';

  for (const article of articles) {
    if (!article.slug) continue;
    xml += '  <url>\n';
    xml += `    <loc>${BASE_URL}/article/${escapeXml(article.slug)}</loc>\n`;
    xml += '    <news:news>\n';
    xml += '      <news:publication>\n';
    xml += '        <news:name>Fizzty</news:name>\n';
    xml += '        <news:language>en</news:language>\n';
    xml += '      </news:publication>\n';
    xml += `      <news:publication_date>${new Date(article.created_at).toISOString()}</news:publication_date>\n`;
    xml += `      <news:title>${escapeXml(article.title || '')}</news:title>\n`;
    xml += `      <news:keywords>${escapeXml(article.primary_keyword || '')}</news:keywords>\n`;
    xml += '    </news:news>\n';
    xml += '  </url>\n';
  }

  xml += '</urlset>';
  return xml;
}

function generateSitemap(quizzes, categories, articles) {
  const now = new Date().toISOString().split('T')[0];
  
  // Static pages
  const staticPages = [
    { loc: BASE_URL, priority: '1.0', changefreq: 'daily' },
    { loc: `${BASE_URL}/quizzes`, priority: '0.9', changefreq: 'daily' },
    { loc: `${BASE_URL}/categories`, priority: '0.8', changefreq: 'weekly' },
    { loc: `${BASE_URL}/trending`, priority: '0.7', changefreq: 'daily' },
    { loc: `${BASE_URL}/about`, priority: '0.5', changefreq: 'monthly' },
    { loc: `${BASE_URL}/contact`, priority: '0.5', changefreq: 'monthly' },
    { loc: `${BASE_URL}/privacy-policy`, priority: '0.3', changefreq: 'yearly' },
    { loc: `${BASE_URL}/terms`, priority: '0.3', changefreq: 'yearly' },
  ];

  // Category pages
  const categoryPages = categories.map(cat => ({
    loc: `${BASE_URL}/category/${escapeXml(cat.slug)}`,
    lastmod: formatDate(cat.updated_at || cat.created_at),
    priority: '0.6',
    changefreq: 'weekly'
  }));

  // Quiz pages
  const quizPages = quizzes.map(quiz => ({
    loc: `${BASE_URL}/quiz/${escapeXml(quiz.slug)}`,
    lastmod: formatDate(quiz.updated_at || quiz.created_at),
    priority: '0.8',
    changefreq: 'monthly'
  }));

  // Article pages
  const articlePages = articles.filter(a => a.slug).map(article => ({
    loc: `${BASE_URL}/article/${escapeXml(article.slug)}`,
    lastmod: formatDate(article.updated_at || article.created_at),
    priority: '0.7',
    changefreq: 'monthly'
  }));

  const allUrls = [...staticPages, ...categoryPages, ...quizPages, ...articlePages];

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  for (const url of allUrls) {
    xml += '  <url>\n';
    xml += `    <loc>${url.loc}</loc>\n`;
    if (url.lastmod) xml += `    <lastmod>${url.lastmod}</lastmod>\n`;
    xml += `    <changefreq>${url.changefreq}</changefreq>\n`;
    xml += `    <priority>${url.priority}</priority>\n`;
    xml += '  </url>\n';
  }

  xml += '</urlset>';
  return xml;
}

async function main() {
  console.log('Fetching quizzes and categories...');
  
  const [quizzes, categories, articles] = await Promise.all([
    fetchAllQuizzes(),
    fetchAllCategories(),
    fetchAllArticles()
  ]);

  console.log(`Found ${quizzes.length} quizzes, ${categories.length} categories, ${articles.length} articles`);

  const sitemap = generateSitemap(quizzes, categories, articles);
  const outputPath = path.join(DIST_DIR, 'sitemap.xml');
  
  fs.writeFileSync(outputPath, sitemap, 'utf8');
  console.log(`Sitemap generated: ${outputPath}`);
  console.log(`Total URLs: ${quizzes.length + categories.length + articles.length + 8}`);

  // Generate Google News sitemap
  const newsArticles = await fetchNewsArticles();
  const newsSitemap = generateNewsSitemap(newsArticles);
  const newsOutputPath = path.join(DIST_DIR, 'sitemap-news.xml');
  fs.writeFileSync(newsOutputPath, newsSitemap, 'utf8');
  console.log(`News sitemap generated: ${newsOutputPath} (${newsArticles.length} articles)`);
}

main().catch(console.error);