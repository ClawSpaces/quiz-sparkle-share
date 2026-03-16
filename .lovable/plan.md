

## Fix Missing/Broken Cover Images

### Problem
All posts and quizzes have `image_url` values set, but many are **fabricated Unsplash URLs** (the AI generated fake photo IDs that don't actually exist on Unsplash). The fallback is `/placeholder.svg` which only shows when `image_url` is `null` — it doesn't catch broken URLs.

Additionally, 966 answers and 2 buzz_chats have null `image_url` values.

### Solution — Two-pronged approach

**1. Add client-side `onError` fallback for broken images**

Update all image-rendering components to gracefully handle broken URLs by falling back to a themed placeholder:

- `QuizCard.tsx` — quiz listing cards
- `PostCard.tsx` — post listing cards  
- `QuizPage.tsx` — quiz detail page (cover + question/answer images)
- `PostPage.tsx` — post detail page cover
- `QuizzesPage.tsx` — featured/trending quiz images
- `BuzzChatCard.tsx` — buzz chat images
- `Index.tsx` — homepage hero/featured images
- `CategoryCard.tsx` — category images

For each `<img>` tag, add `onError={(e) => { e.currentTarget.src = '/placeholder.svg' }}` to catch 404s from fake Unsplash URLs.

**2. Replace broken database URLs with working ones**

Create a backend function that:
- Tests each unique `image_url` in the database with a HEAD request
- For any that return 404, replaces them with a real, relevant Unsplash image using the Lovable AI gateway (similar to the existing `fix-missing-images` edge function but checking for broken URLs, not just nulls)

### Files to modify
- 6-8 component/page files (add `onError` handler)
- 1 new edge function `fix-broken-images` (or extend existing `fix-missing-images`)
- Invoke the function to fix the database

### Execution order
1. Add `onError` fallback to all `<img>` tags (immediate visual fix)
2. Create and run the edge function to replace broken URLs in the database (permanent fix)

