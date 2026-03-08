

## Αντικατάσταση Emoji με Φωτογραφίες στις Quiz Categories

### Αλλαγές

#### 1. `src/data/sampleQuizzes.ts` — Προσθήκη `image` field στο Category interface + Unsplash URLs
- Προσθήκη `image: string` στο `Category` interface
- Κάθε category παίρνει μια σχετική Unsplash φωτογραφία (π.χ. Αθλητικά → stadium photo, Μουσική → concert photo, κλπ.)

#### 2. `src/components/CategoryCard.tsx` — Photo-based card με proper text handling
- Αντικατάσταση του `<span className="text-4xl">` emoji με `<img>` (rounded, object-cover, fixed height ~80px)
- Title: `line-clamp-2` + `text-sm` για να χωράει πάντα χωρίς overflow
- Maintain hover effects και link behavior

### Αρχεία
- `src/data/sampleQuizzes.ts` — add `image` to Category interface + data
- `src/components/CategoryCard.tsx` — replace emoji with photo, fix text overflow

