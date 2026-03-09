

## BuzzFeed-Style Quiz Page Redesign

### Key Differences Found

After analyzing the BuzzFeed quiz page, here are the critical differences from our current implementation:

```text
BUZZFEED LAYOUT                    OUR CURRENT LAYOUT
─────────────────                  ──────────────────
Badges (Creator, Quiz)             Hero image with overlay
Category · Date                    Category badge on hero
Title + Description                Title on hero
Author avatar + name               (none)
Share buttons row                  (none on intro)
Quiz Instructions block            (none)
                                   
ALL questions on ONE page          Step-by-step (1 at a time)
  ↓ scroll through them            with progress bar
Image grid answers (3-4 cols)      Text-only answer buttons
  each answer = image + label      
                                   
Sidebar with ads (desktop)         (none on quiz page)
Comments section                   (skip for now)
"Ready for more" at bottom         ✓ already have this
```

### The Biggest Change: All Questions on One Page

BuzzFeed does NOT use step-by-step navigation. All questions are visible on the page at once. You scroll down, answer each one, and when you answer the last one, the result appears at the bottom. This is the core UX change.

### Implementation Plan

**1. Redesign QuizPage.tsx — Remove phased approach**
- Remove `intro` / `playing` / `result` phases
- Show everything on one scrollable page:
  - Top: Category badges, date, title, description, author info, share buttons, instructions
  - Middle: All questions stacked vertically, each with image-grid answers
  - Bottom: Result card (appears after last question answered), then ReadyForMore + MoreFromSite
- Each question locks after answering (greyed out, selected answer highlighted)
- Auto-scroll to next unanswered question after selection
- Result card slides in at the bottom when all questions answered

**2. Image-grid answers for personality quizzes**
- When answers have `image_url`: show 3-column grid (2 on mobile) with image + text label
- When answers are text-only: show standard text buttons (current style)
- The `answers` table already has `image_url` column

**3. Author section**
- Fetch `profiles` data via `quizzes.author_id`
- Show avatar, name, title below the quiz title
- Already have `profiles` table and `author_id` on quizzes

**4. Share buttons row**
- Facebook, Pinterest, Copy Link icons below the author section

**5. Instructions section**
- Show `quiz.instructions` text if present (already have column)

**6. Desktop sidebar**
- Add `ContentSidebar` to quiz page (same as PostPage), right column on desktop

**7. Ad placements**
- Between questions (every 5-6 questions), insert an ad placeholder

### Files to Modify
- `src/pages/QuizPage.tsx` — complete rewrite of layout and UX
- No new components needed, reuse existing ones (ContentSidebar, AdPlaceholder)
- No database changes needed (all columns already exist)

