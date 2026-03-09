

## Δημιουργία 50 Quiz με AI — Timely για Μάρτιο 2026

### Τρέχουσα Κατάσταση
- 10 quizzes, 3-4 ερωτήσεις, 4 απαντήσεις ανά ερώτηση
- 6 κατηγορίες, 0 profiles (author)
- Χρειαζόμαστε ~40 νέα + update τα υπάρχοντα

### Τι κάνει το BuzzFeed (Μάρτιος 2026)
Από την ανάλυση, τα trending quizzes τώρα είναι:
- **Spring-themed**: "Choose Springtime Sweets", "Pick Cozy Spring Things", "Plan Your Perfect Day → Spring Flower"
- **St. Patrick's Day** (17 Μαρτίου): "Only 10% Can Ace This St. Patrick's Day Quiz"
- **Food/personality combos**: "Eat A-Z Buffet → Guess Bedroom Wall Color", "Dream Coffee → Jacob Elordi Character"
- **Color/aesthetic**: "Pick Favorite Shade of 10 Colors", "Which Butterfly Matches Your Soul"
- **Geography trivia**: "Name 25 Countries", "US State Silhouette Quiz"
- **Pop culture**: "Finish Disney Song Lyrics", "Sabrina Carpenter Lyrics", "The Pitt character quiz"
- **Image-heavy answers**: Κάθε ερώτηση 5-6 εικόνες (φαγητά, τοπία, χρώματα) — χρησιμοποιούν Unsplash/Getty

### Σχέδιο Υλοποίησης

**1. Δημιουργία profile για τον author**
- Migration: Insert 1 profile (π.χ. "Ελληνικό Buzz Team") ώστε τα quizzes να έχουν author

**2. Edge Function `generate-quizzes`**
- Χρήση Lovable AI (gemini-3-flash-preview) για generation quiz content στα ελληνικά
- Κάθε κλήση παράγει 5 quizzes με:
  - 8-10 ερωτήσεις ανά quiz
  - 6 απαντήσεις ανά ερώτηση
  - Image URLs από Unsplash (public, no API key needed)
  - 3-4 results ανά quiz
- Bulk insert σε quizzes → results → questions → answers
- Καλείται 8 φορές (8 × 5 = 40 νέα quizzes)

**3. Θέματα Quiz — Timely για 9 Μαρτίου 2026**

| Κατηγορία | Θέματα (ενδεικτικά) |
|-----------|---------------------|
| Προσωπικότητα | Ποιο ανοιξιάτικο λουλούδι είσαι, Τι χρώμα αντιπροσωπεύει την ψυχή σου, Ποιο ελληνικό νησί σου ταιριάζει, Σχεδίασε το σπίτι σου → αποκαλύπτω την aura σου |
| Διασημότητες | Θα επιβίωνες μια μέρα ως celebrity, Ποιος Έλληνας διάσημος σου μοιάζει, Celebrity couples quiz |
| Ταινίες & Σειρές | Finish Disney lyrics (ελληνικά), Ποιος χαρακτήρας Stranger Things είσαι, Netflix Μαρτίου 2026, Euphoria character quiz |
| Αθλητικά | Champions League trivia 2026, Ολυμπιακοί Αγώνες trivia, Formula 1 2026 season |
| Μουσική | Eurovision 2026 predictions, Sabrina Carpenter lyrics, 90s Greek hits, K-pop quiz |
| Γενικές Γνώσεις | St. Patrick's Day trivia, Παγκόσμια γεωγραφία, Ιστορία Ελλάδας, Spring equinox facts |

**4. Update υπάρχοντα 10 quizzes**
- SQL migration: Προσθήκη 2 extra answers σε κάθε ερώτηση (4 → 6)
- Προσθήκη 4-5 extra ερωτήσεις σε κάθε quiz (3-4 → 8)

### Αρχεία
- `supabase/functions/generate-quizzes/index.ts` — νέο edge function
- `supabase/config.toml` update — verify_jwt = false για το function
- Migration: create profile, set author_id
- Κλήση function μέσω curl 8 φορές μετά το deploy

### Τεχνικές Λεπτομέρειες

Το edge function θα:
1. Δέχεται parameter `batch` (1-8) και `category_id`
2. Καλεί Lovable AI με tool calling για structured output (quiz JSON schema)
3. Κάνει insert σε σειρά: quiz → results → questions → answers
4. Επιστρέφει τα IDs των quizzes που δημιουργήθηκαν
5. Τα image URLs θα είναι Unsplash links (format: `https://images.unsplash.com/photo-XXX?w=600&h=400&fit=crop`)

