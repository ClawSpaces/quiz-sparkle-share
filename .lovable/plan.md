

## Category Cards Redesign — Overlay Style

### Πρόβλημα
Τα cards είναι narrow με ξεχωριστή φωτογραφία και τίτλο κάτω. Το "Αθλητικά" δείχνει broken image. Χρειάζεται overlay style όπου ο τίτλος είναι πάνω στη φωτογραφία.

### Αλλαγές

#### 1. `src/components/CategoryCard.tsx` — Overlay card design
- Φωτογραφία full-cover στο card (aspect-ratio 4/3 ή square)
- Dark gradient overlay (`bg-gradient-to-t from-black/60 to-black/20`)
- Τίτλος + quiz count centered πάνω στο overlay σε λευκό χρώμα
- Αφαίρεση του ξεχωριστού text section κάτω από τη φωτογραφία
- Μεγαλύτερο ύψος card (taller aspect ratio)

#### 2. `src/data/sampleQuizzes.ts` — Fix "Αθλητικά" broken image
- Αντικατάσταση του broken Unsplash URL για Αθλητικά με ένα που δουλεύει (π.χ. soccer/stadium photo)

### Αρχεία
- `src/components/CategoryCard.tsx`
- `src/data/sampleQuizzes.ts`

