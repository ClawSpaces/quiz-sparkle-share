

## Fix All Remaining Broken Quiz Cover Images

### Root Cause
All 54 published quizzes have `image_url` values, but many contain **fake Unsplash photo IDs** that return 404s. The `fix-broken-images` edge function was only run for a few batches previously — the remaining broken ones were never processed.

### Plan

**Step 1: Run the fix-broken-images function across all quizzes in batches**
- Invoke the existing `fix-broken-images` edge function for the `quizzes` table in batches of 25 (offset 0, 25, 50) to cover all 54 quizzes
- The function already does HEAD requests to detect 404s and replaces them with real Unsplash URLs via the AI gateway

**Step 2: Fix the onError handler to prevent infinite loops**
- Update `QuizCard.tsx` and `QuizzesPage.tsx` onError handlers to check if src is already the placeholder before setting it again (prevents potential re-trigger loops)
- Pattern: `if (!e.currentTarget.src.endsWith('/placeholder.svg')) e.currentTarget.src = '/placeholder.svg'`

**Step 3: Run fix-broken-images for other tables too**
- Run for `posts`, `categories`, `questions`, `results`, and `answers` tables to ensure complete coverage

### Files to modify
- `src/components/QuizCard.tsx` — safer onError handler
- `src/pages/QuizzesPage.tsx` — safer onError handler  
- No new files needed — the edge function already exists

### Execution
- Invoke the edge function 3 times for quizzes (batches of 25)
- Then run for posts, categories, etc.
- Total: ~6-8 function invocations to cover all tables

