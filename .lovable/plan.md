

## Fix Broken Quiz Cover Images — Generate Real Images

### Root Cause
The current `fix-broken-images` function asks an AI to provide "real Unsplash photo IDs," but AIs hallucinate URLs. The replacement URLs are also fake and return 404s — creating an endless cycle of broken images.

### Solution: AI-Generated Images + Storage

Instead of guessing Unsplash URLs, we will **generate actual images** using the AI image generation model and store them in the backend.

**Step 1: Create a storage bucket for cover images**
- Create a `cover-images` public storage bucket via SQL migration
- Add RLS policy allowing public read access

**Step 2: Create a new `generate-cover-images` edge function**
- Fetches quizzes (configurable for posts/categories too) with image URLs
- Tests each URL with a HEAD request to find broken ones
- For each broken image, calls the AI image generation model (`google/gemini-2.5-flash-image`) with a prompt based on the quiz title
- Decodes the base64 result and uploads it to the `cover-images` storage bucket
- Updates the database record with the permanent public storage URL
- Processes in batches to avoid timeouts (5-10 per invocation)

**Step 3: Invoke the function across all quizzes**
- Run in batches of 5-10 until all 54 quizzes have verified working cover images
- Then run for posts and categories

### Files to create/modify
- **New**: `supabase/functions/generate-cover-images/index.ts`
- **Migration**: Create `cover-images` storage bucket + RLS
- **Config**: Add function to `supabase/config.toml` (verify_jwt = false)

### Why this works
- Generated images are stored in our own backend — no dependency on external URLs
- Each image is purpose-built for the quiz topic
- Permanent, reliable URLs that never 404

