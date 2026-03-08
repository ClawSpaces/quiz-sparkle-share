

## Desktop Sidebar στα Post Pages

### Τι θα γίνει
Στο desktop, το PostPage θα αποκτήσει layout 2 στηλών: αριστερά το κύριο content, δεξιά ένα sticky sidebar — ίδιο style με αυτό που ήδη υπάρχει στο Index.tsx.

### Υλοποίηση

**1. Νέο component: `src/components/ContentSidebar.tsx`**
- Reusable sidebar που θα χρησιμοποιείται σε Post, Quiz, κλπ
- Περιεχόμενα (ίδιο pattern με Index.tsx sidebar):
  - Ad placeholder (rectangle)
  - "Τελευταία Άρθρα" — top 5 posts από samplePosts
  - "Δημοφιλή Quizzes" — top 5 quizzes από Supabase (by plays_count)
  - "Κατηγορίες" — categories από Supabase
  - Ad placeholder (rectangle) στο τέλος
- Sticky positioning (`sticky top-4`)

**2. `src/pages/PostPage.tsx`**
- Αλλαγή layout: `container max-w-3xl` → `container md:flex md:gap-6`
- Αριστερά: `flex-1 min-w-0` με το υπάρχον content
- Δεξιά: `hidden md:block md:w-[25%]` με `<ContentSidebar />`
- Τα ReadyForMore / MoreFromSite παραμένουν full-width κάτω

**3. Μελλοντικά**: Το ίδιο component μπορεί να μπει και στο QuizPage

### Αρχεία
- `src/components/ContentSidebar.tsx` — νέο
- `src/pages/PostPage.tsx` — layout αλλαγή

