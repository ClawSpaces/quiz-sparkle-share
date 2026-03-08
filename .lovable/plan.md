

## Quizzes Page — BuzzFeed Style

### Πρόβλημα
Το tab "Quizzes" δείχνει στο `/` (αρχική). Χρειάζεται ξεχωριστή σελίδα `/quizzes` σαν το BuzzFeed: μεγάλος τίτλος "Quizzes", filter tags (κατηγορίες), featured quiz hero, trending quizzes grid.

### Αλλαγές

#### 1. `src/pages/QuizzesPage.tsx` — Νέα σελίδα (BuzzFeed style)
- **Τίτλος** "Quizzes" μεγάλος bold heading
- **Category filter chips** — scrollable row με tags (Latest, Προσωπικότητα, Διασημότητες, Ταινίες, κλπ.) από τα categories data
- **Featured quiz** — πρώτο trending quiz σε wide image + τίτλο + description (hero style)
- **Trending Quizzes** section — 2-col grid με thumbnail + τίτλο (horizontal cards)
- **More Quizzes** — υπόλοιπα quizzes σε grid cards

#### 2. `src/components/Header.tsx` — Fix navigation
- Quizzes path: `/` → `/quizzes`

#### 3. `src/App.tsx` — Route
- Προσθήκη `/quizzes` → QuizzesPage

### Αρχεία
- `src/pages/QuizzesPage.tsx` (νέο)
- `src/components/Header.tsx` (αλλαγή path)
- `src/App.tsx` (νέο route)

