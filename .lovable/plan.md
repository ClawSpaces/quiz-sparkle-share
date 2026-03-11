

## Fix All Remaining Greek Content

After investigation, there are **three categories** of Greek content still present:

### 1. Database Content (posts.content + quizzes.instructions)

| Table | Field | Greek Rows |
|-------|-------|-----------|
| posts | content (HTML body) | 8 |
| quizzes | instructions | 44 |

The `posts.content` field contains the full article body in Greek HTML — this is what you're seeing on the post page. The titles/descriptions were translated but the actual article content was missed.

### 2. Admin UI — 8 Files with Greek strings

All admin panel labels, toasts, buttons, placeholders, and confirmation dialogs are in Greek:

- `src/components/admin/AdminLayout.tsx` — "Φόρτωση...", "Αποσύνδεση"
- `src/pages/admin/AdminLogin.tsx` — "Σφάλμα", "Σύνδεση..."
- `src/pages/admin/AdminPosts.tsx` — table headers, dialogs, buttons
- `src/pages/admin/AdminQuizzes.tsx` — same pattern
- `src/pages/admin/AdminCategories.tsx` — form labels, toasts
- `src/pages/admin/AdminPostForm.tsx` — all form labels
- `src/pages/admin/AdminQuizForm.tsx` — all form labels
- `src/pages/admin/AdminBuzzChats.tsx` — all form labels

### 3. Edge Function — generate-quizzes/index.ts

The quiz generator still has Greek theme prompts and instructs the AI to write in Greek. It also references old Greek category slugs. This needs to be updated so future quizzes are generated in English.

### Plan

**Step 1**: Translate all 8 admin UI files (pure string replacements)

**Step 2**: Translate `posts.content` for all 8 posts — use the translate-content edge function (extended to support posts) or direct SQL updates with translated HTML

**Step 3**: Translate `quizzes.instructions` for all 44 quizzes via SQL updates

**Step 4**: Update `generate-quizzes/index.ts` — change all Greek themes to English, update the system prompt to generate in English, and update old category slug references to new English ones

### Files to modify
- 8 admin UI files (string replacements)
- 1 edge function (generate-quizzes)
- Database: posts.content (8 rows), quizzes.instructions (44 rows)

