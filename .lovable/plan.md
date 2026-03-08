

## Category Cards — 2 ανά σειρά στο mobile

### Πρόβλημα
Με 3 columns στο mobile, τα cards είναι πολύ στενά και οι τίτλοι κόβονται.

### Αλλαγές

#### `src/pages/Index.tsx` (line 229)
- Αλλαγή grid από `grid-cols-3 md:grid-cols-6` σε `grid-cols-2 md:grid-cols-3` — 2 cards ανά σειρά στο mobile, 3 στο desktop
- Μεγαλύτερα cards = χωράνε οι τίτλοι, φαίνονται καλύτερα οι φωτογραφίες

#### `src/pages/CategoriesPage.tsx`
- Ίδια αλλαγή στο categories page για consistency

