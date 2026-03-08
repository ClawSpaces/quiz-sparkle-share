

## Fix — Trending Hero Section (BuzzFeed Style)

### Πρόβλημα
Το hero section είναι πολύ ψηλό (420px min-height) και η αναλογία 2:1 cols κάνει τo layout να φαίνεται "σπασμένο". Στο BuzzFeed, το trending section είναι **4 columns** με παρόμοιο ύψος — το πρώτο item είναι λίγο μεγαλύτερο αλλά όχι δραματικά.

### Αλλαγή — `src/pages/Index.tsx`

Desktop trending grid → **4-column layout** σαν BuzzFeed:
- **Item 1**: Λίγο ψηλότερο (~300px), aspect-[4/3], μεγαλύτερο τίτλο, numbered overlay "1"
- **Items 2-4**: Ίδιο ύψος, aspect-[4/3] thumbnail, τίτλος + reactions κάτω, numbered overlay
- Αφαίρεση `min-h-[420px]`, `col-span-2`, `row-span-2`
- Κάθε card: rounded image, τίτλος bold κάτω, reaction emojis
- Compact, magazine-style — όλα ίδιο row, χωρίς τεράστιο hero

### Αρχεία
- `src/pages/Index.tsx` (desktop trending grid section, lines 44-92)

