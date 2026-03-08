

## Quizzes: Από hardcoded σε database + Quiz-taking pages

### Τι κάνουμε

1. **Seed hardcoded data στη database** μέσω edge function — περνάμε τα 10 sample quizzes με ερωτήσεις, απαντήσεις και results
2. **Αντικατάσταση hardcoded imports** — QuizzesPage, Index, QuizCard τραβάνε data από database αντί `sampleQuizzes.ts`
3. **Δημιουργία Quiz-taking page** (`/quiz/:id`) — ο user παίρνει το quiz ερώτηση-ερώτηση και βλέπει αποτέλεσμα στο τέλος

### Αρχεία

**Νέα:**
- `src/pages/QuizPage.tsx` — Η σελίδα που ο user κάνει το quiz:
  - Fetch quiz + questions + answers + results από database
  - Μια ερώτηση τη φορά, progress bar, επιλογή απάντησης
  - **Trivia**: μετράει σωστές/λάθος, δείχνει score στο τέλος
  - **Personality**: μετράει ποιο result_id έχει τις περισσότερες απαντήσεις, δείχνει το αντίστοιχο result
  - Increment plays_count μέσω `increment_plays` RPC
  - Αποθηκεύει quiz_attempt στο τέλος
  - Share buttons / "Δοκίμασε ξανά" button
- Edge function `seed-quizzes` (temporary) — περνάει τα 10 sample quizzes με ερωτήσεις/απαντήσεις/results στη database

**Τροποποιούνται:**
- `src/pages/QuizzesPage.tsx` — αντί `sampleQuizzes`, fetch από `supabase.from("quizzes")` με join σε categories
- `src/components/QuizCard.tsx` — προσαρμογή interface για database schema (plays_count αντί plays, κλπ)
- `src/pages/Index.tsx` — τα quiz sections τραβάνε από database αντί hardcoded
- `src/App.tsx` — προσθήκη route `/quiz/:id`

### Quiz-taking flow

```text
Quiz landing → [Start] → Question 1/N → Question 2/N → ... → Result screen
                          ↑ progress bar                      ↑ score ή personality result
                          ↑ 4 answer buttons                  ↑ share + retry buttons
```

### Seed data
Τα 10 quizzes από `sampleQuizzes.ts` θα περαστούν στη database. Για κάθε quiz θα δημιουργηθούν 3-4 sample ερωτήσεις με 4 απαντήσεις η καθεμία, και 3-4 results (personality) ή score-based results (trivia).

