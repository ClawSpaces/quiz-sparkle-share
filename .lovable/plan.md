

## Sidebar δεξιά — ΜΕΤΑ το hero section (25% width)

Ίδιο πλάνο με πριν, μόνο το sidebar γίνεται **25%** αντί 30%.

### Αλλαγές — `src/pages/Index.tsx`

1. Hero/trending section μένει **full-width ως έχει**
2. Μετά το trending, wrap sections 2-9 σε 2-column layout:
   - **Left** (`flex-1 min-w-0`): όλα τα existing sections (quizzes, latest, buzzchat, shopping/celebrity, categories) — αφαίρεση `container` classes από τα inner sections
   - **Right** (`hidden md:block w-[25%] flex-shrink-0 sticky top-4`): sidebar widgets

3. **Sidebar widgets:**
   - Ad (`AdPlaceholder format="rectangle"`)
   - "Latest Posts" — dark header bar + numbered list (thumbnail + title + date), 5 items
   - "Trending" — dark header bar + numbered list, 5 items
   - "Categories" — grid of category links

### Αρχεία
- `src/pages/Index.tsx`

