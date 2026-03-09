

## Μετάβαση Posts & BuzzChats από Hardcoded → Database

### Τρέχουσα Κατάσταση
- **Posts table**: Κενό (0 records). Όλα τα posts προέρχονται από hardcoded `samplePosts` στο `src/data/samplePosts.ts`
- **Buzz_chats table**: Κενό (0 records). Ομοίως hardcoded `sampleBuzzChats`
- 8 sample posts και 4 sample buzz chats υπάρχουν μόνο στον κώδικα
- Όλα τα posts έχουν ήδη Unsplash image URLs στο sample data

### Σχέδιο

**1. Insert τα 8 posts στη database**
- Χρήση insert tool για να βάλω τα 8 posts με τίτλους, descriptions, images, post_type, views_count
- Θα τα κάνω `is_published = true` και τα trending `is_trending = true`
- Όλα έχουν ήδη εικόνες — δεν λείπει κανένα cover

**2. Insert τα 4 buzz_chats στη database**
- Ομοίως, τα 2 από τα 4 έχουν εικόνα, τα άλλα 2 όχι (by design — οι ερωτήσεις χωρίς εικόνα είναι text-only)

**3. Insert post_reactions για κάθε post**
- Κάθε post έχει reactions (emojis + counts) — θα τα βάλω στον πίνακα `post_reactions`

**4. Update τις σελίδες να διαβάζουν από τη database αντί για sample data**
- `Index.tsx` — fetch posts από DB αντί για `samplePosts`
- `PostPage.tsx` — fetch single post από DB
- `TrendingPage.tsx`, `ShoppingPage.tsx`, `CelebrityPage.tsx` — fetch filtered posts
- `BuzzChatPage.tsx` — fetch buzz_chats από DB
- `ContentSidebar.tsx`, `ReadyForMore.tsx`, `MoreFromSite.tsx` — update imports
- Αφαίρεση/cleanup του `samplePosts.ts` (κρατάμε μόνο utility functions: `formatViews`, `timeAgo`)

### Αρχεία που αλλάζουν
- `src/data/samplePosts.ts` — cleanup, κρατάμε μόνο types + utilities
- `src/pages/Index.tsx` — fetch posts + buzz_chats από DB
- `src/pages/PostPage.tsx` — fetch single post από DB
- `src/pages/TrendingPage.tsx` — fetch trending posts
- `src/pages/ShoppingPage.tsx` — fetch shopping posts
- `src/pages/CelebrityPage.tsx` — fetch celebrity posts
- `src/pages/BuzzChatPage.tsx` — fetch buzz_chats
- `src/components/ContentSidebar.tsx` — fetch posts
- `src/components/ReadyForMore.tsx` — update
- `src/components/MoreFromSite.tsx` — update
- `src/components/PostCard.tsx` — update type interface

