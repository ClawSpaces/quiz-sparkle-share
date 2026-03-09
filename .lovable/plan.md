

## BuzzFeed-Style Result Card, Comments & Share Buttons

### 1. Result Card Redesign (QuizPage.tsx)

Based on the screenshot, the BuzzFeed result card has:
- Purple/blue **sunburst** radial background pattern (CSS gradient)
- Vertical **"QUIZ RESULT"** text with sparkles on the left side
- White card inside with: result title (bold), full-width image, description text
- **"SHARE WITH FRIENDS!"** badge (yellow circle, bottom-right)
- Share row at bottom: "Share to Comments" button + link/Facebook/Pinterest/Bluesky icons

Implementation: Replace the current simple result card with this BuzzFeed-style layout using CSS radial gradients for the sunburst effect, rotated text for the vertical label, and proper share icons.

### 2. Comments System

**Database**: New `comments` table:
- `id` (uuid), `content_type` (text — 'quiz' or 'post'), `content_id` (uuid), `author_name` (text), `comment_text` (text), `created_at` (timestamptz)
- RLS: Everyone can SELECT and INSERT, only admins can DELETE
- No auth required — anonymous comments with display name input

**Component**: `src/components/CommentsSection.tsx`
- Props: `contentType` ('quiz' | 'post'), `contentId` (string)
- Shows existing comments with name + time + text
- Input form: name field + textarea + submit button
- Real-time updates via Supabase realtime

**Integration**: Add `<CommentsSection>` to both QuizPage and PostPage, placed after the result card (quiz) or after the article content (post).

### 3. Share Buttons (Enhanced)

Update share row to include all BuzzFeed platforms:
- **Copy Link** — clipboard copy with toast confirmation
- **Facebook** — `facebook.com/sharer/sharer.php`
- **Pinterest** — `pinterest.com/pin/create/button` with image
- **Bluesky** — `bsky.app/intent/compose` with text

Place share buttons in two locations:
- Top of quiz (already exists — add Pinterest + Bluesky)
- Inside result card (new — matches screenshot)

### Files
- `src/pages/QuizPage.tsx` — result card redesign + share buttons + comments integration
- `src/pages/PostPage.tsx` — add comments integration
- `src/components/CommentsSection.tsx` — new
- Database migration: `comments` table + RLS + realtime

