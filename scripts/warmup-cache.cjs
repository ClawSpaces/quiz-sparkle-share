/**
 * warmup-cache.cjs — Post-deploy cache warmer
 *
 * Pings key pages with crawler user-agent to prime the Vercel edge cache.
 * This ensures Googlebot's first hit is fast (cached) instead of cold (Supabase fetch).
 *
 * Runs automatically after build via package.json "build" script.
 */

const SUPABASE_URL = 'https://gymwbfevlbbyanobpiwr.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd5bXdiZmV2bGJieWFub2JwaXdyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwMDYyNzYsImV4cCI6MjA4ODU4MjI3Nn0.u-esnjA-SDnBbBeO_LYpLvMhq9frrMQuEarYtS2lHhg';
const BASE_URL = 'https://fizzty.com';
const CRAWLER_UA = 'Googlebot/2.1 (+http://www.google.com/bot.html)';

async function fetchSlugs() {
  const headers = { apikey: SUPABASE_ANON_KEY };

  const [quizRes, articleRes] = await Promise.all([
    fetch(`${SUPABASE_URL}/rest/v1/quizzes?is_published=eq.true&select=slug&order=created_at.desc&limit=20`, { headers }),
    fetch(`${SUPABASE_URL}/rest/v1/articles?is_published=eq.true&select=slug&order=published_at.desc&limit=20`, { headers }),
  ]);

  const quizzes = await quizRes.json();
  const articles = await articleRes.json();

  const urls = ['/'];

  for (const q of quizzes) {
    urls.push(`/quiz/${q.slug}`);
  }
  for (const a of articles) {
    urls.push(`/article/${a.slug}`);
  }

  return urls;
}

async function warmUrl(url) {
  const fullUrl = `${BASE_URL}${url}`;
  try {
    const start = Date.now();
    const res = await fetch(fullUrl, {
      headers: { 'User-Agent': CRAWLER_UA },
    });
    const ms = Date.now() - start;
    const prerender = res.headers.get('x-prerender') || 'none';
    console.log(`  ${res.status} ${ms}ms [${prerender}] ${url}`);
    return res.ok;
  } catch (err) {
    console.log(`  ERR ${url}: ${err.message}`);
    return false;
  }
}

async function main() {
  console.log('🔥 Cache warmup — pinging pages with crawler UA...\n');

  const urls = await fetchSlugs();
  console.log(`Found ${urls.length} URLs to warm.\n`);

  let ok = 0;
  let fail = 0;

  // Warm in batches of 5 to avoid overwhelming
  for (let i = 0; i < urls.length; i += 5) {
    const batch = urls.slice(i, i + 5);
    const results = await Promise.all(batch.map(warmUrl));
    ok += results.filter(Boolean).length;
    fail += results.filter(r => !r).length;
  }

  console.log(`\n✅ Warmup complete: ${ok} OK, ${fail} failed out of ${urls.length} URLs`);
}

main().catch(err => {
  console.error('Warmup failed:', err.message);
  // Don't exit(1) — warmup failure shouldn't break the build
});
