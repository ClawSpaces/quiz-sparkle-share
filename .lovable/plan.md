

## Fix — Trending Section: 1 μεγάλο αριστερά + 2×2 grid δεξιά

### Layout
Αντί για 4 ίσες στήλες, το desktop trending section γίνεται:

```text
┌──────────────┬────────┬────────┐
│              │  #2    │  #3    │
│    #1        │────────│────────│
│   (μεγάλο)   │  #4    │  #5    │
└──────────────┴────────┴────────┘
```

- **Αριστερά**: 1 μεγάλο featured article (~50% width), ψηλό, με overlay τίτλο
- **Δεξιά**: 2×2 grid (4 μικρότερα articles), aspect-[4/3] thumbnails + τίτλος κάτω

### Αλλαγή — `src/pages/Index.tsx` (lines 43-69)

- Desktop grid → `md:grid-cols-2 md:gap-4`
- Πρώτο item: full height, `aspect-[3/4]` ή auto height, overlay gradient + τίτλος
- Δεύτερο cell: nested `grid grid-cols-2 gap-4` με items #2-#5
- Χρειάζονται 5 trending posts αντί για 4 (`trendingPosts.slice(0, 5)`)
- Reactions compact κάτω από κάθε card

### Αρχεία
- `src/pages/Index.tsx`

