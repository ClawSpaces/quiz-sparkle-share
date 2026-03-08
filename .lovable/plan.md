

## "Ready for more?" + "More from BuzzFeed" — Sections κάτω από κάθε Quiz και Post

### Τι ακριβώς κάνει το BuzzFeed
Κάτω από κάθε quiz/post υπάρχουν **δύο ξεχωριστά sections**:
1. **"Ready for more?"** — 6 σχετικά items ίδιου τύπου και κατηγορίας (π.χ. quiz Harry Potter → άλλα Harry Potter quizzes)
2. **"More from BuzzFeed"** — ~30 mixed items από όλες τις κατηγορίες (quizzes, posts, shopping, celebrity κλπ) — infinite scroll / feed στυλ

### Υλοποίηση

**1. Νέο component: `src/components/ReadyForMore.tsx`**
- Props: `currentId`, `type` ("quiz" | "post"), `categoryId`
- Fetch 6 items ίδιου τύπου + κατηγορίας (exclude current) από Supabase
- Grid: 2 columns mobile, 3 desktop
- Χρησιμοποιεί `QuizCard` ή `PostCard`
- Title: "Ready for more?" / "Θέλεις κι άλλα;"

**2. Νέο component: `src/components/MoreFromBuzzFeed.tsx`**
- Props: `currentId`, `currentType`
- Fetch mixed content: quizzes + posts (published, random order, exclude current), limit ~18
- Εμφανίζει σε single-column feed (σαν BuzzFeed) με εναλλαγή QuizCard / PostCard
- Title: "Περισσότερα από Frenzy" (ή όπως λέγεται το site)
- Grid: 2 columns mobile, 3 desktop

**3. `src/pages/QuizPage.tsx`**
- Στο **intro** phase: κάτω από "Ξεκίνα το Quiz" → `<ReadyForMore>` + `<MoreFromBuzzFeed>`
- Στο **result** phase: κάτω από share buttons → `<ReadyForMore>` + `<MoreFromBuzzFeed>`

**4. `src/pages/PostPage.tsx`**
- Κάτω από reactions + ad → `<ReadyForMore>` + `<MoreFromBuzzFeed>`
- Posts χρησιμοποιούν ακόμα sample data, οπότε `ReadyForMore` θα φιλτράρει τα `samplePosts` κατά `postType`

### Data Flow
- `ReadyForMore` για quizzes: `supabase.from("quizzes").select("*, categories(name, slug)").eq("category_id", categoryId).neq("id", currentId).eq("is_published", true).limit(6)`
- `ReadyForMore` για posts: φιλτράρει `samplePosts` κατά `postType` (μέχρι να μπουν στη DB)
- `MoreFromBuzzFeed`: fetch και quizzes και posts, merge + shuffle, limit 18

### Αρχεία
- `src/components/ReadyForMore.tsx` — νέο
- `src/components/MoreFromSite.tsx` — νέο
- `src/pages/QuizPage.tsx` — προσθήκη 2 sections σε intro + result
- `src/pages/PostPage.tsx` — προσθήκη 2 sections κάτω από content

