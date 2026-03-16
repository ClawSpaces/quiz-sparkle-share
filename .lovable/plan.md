

## Problem

The static meta tags in `index.html` (og:title, og:description, twitter:title, twitter:description, meta description) are not being overridden by `react-helmet-async` because the browser sees them as separate tags. `react-helmet-async` matches tags by their attributes to decide whether to replace or add — but the static tags in `index.html` exist outside React's control in the initial HTML, so Helmet adds duplicates instead of replacing.

## Solution

Two changes:

### 1. Remove duplicate-prone static meta tags from `index.html`

Remove these lines from `index.html` (lines 7, 15-18) since Helmet will handle them dynamically on every page:
- `<meta name="description" content="...">`
- `<meta property="og:title" content="...">`
- `<meta property="og:description" content="...">`
- `<meta name="twitter:title" content="...">`
- `<meta name="twitter:description" content="...">`

Keep in `index.html` only the fallback tags that won't conflict (og:type, og:image, twitter:card, twitter:site, twitter:image) — these serve as defaults for crawlers that don't execute JS, and Helmet will override them when React loads.

### 2. Update `SEO.tsx` to pass the full formatted title to OG/Twitter tags

Currently `og:title` gets just `title` (without " | Fizzty"). Update so:
- `og:title` and `twitter:title` use `fullTitle` (which includes " | Fizzty")
- This matches the user's request for quiz pages showing "quiz.title | Free Quiz | Fizzty"

No changes needed to any page files — the SEO component interface stays the same.

### Files to modify
- `index.html` — remove 5 meta tag lines
- `src/components/SEO.tsx` — use `fullTitle` for og:title and twitter:title

