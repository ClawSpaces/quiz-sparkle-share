

## Mobile-Optimized News/Magazine Layout

Ναι, καταλαβαίνω -- το site πρέπει να μοιάζει με σωστό news magazine (BuzzFeed style), όχι random grid με cards. Χρειάζεται news-feed flow, proper mobile navigation, tighter spacing, και editorial feel.

### Αλλαγές

#### 1. Header -- Mobile scrollable tab bar
- Αντί για hamburger menu μόνο, προσθήκη **horizontal scrollable nav bar** κάτω από το logo στο mobile (όπως BuzzFeed/news apps)
- Tabs: Quizzes | Trending | Shopping | Celebrity | Buzz Chat
- Active tab με underline indicator
- Αφαίρεση hamburger menu (τα tabs είναι πάντα visible)

#### 2. Homepage (Index.tsx) -- News feed restructure

**Mobile layout:**
- **"Trending Now" section header** με bold title + "See All" link
- **#1 post:** Full-width tall card με image overlay, title, reactions
- **#2-#4 posts:** Horizontal compact cards (thumbnail left, rank number + title right) -- news-list style
- **Divider lines** μεταξύ sections για editorial feel
- **Tighter spacing:** `py-4` αντί `py-10`, smaller gaps

**Section order (news-feed flow):**
1. Trending Now (hero + numbered list)
2. Ad (native)
3. Popular Quizzes (2-column grid on mobile, 3 on desktop)
4. Ad (banner)
5. Latest News feed -- mix of remaining posts as vertical list cards
6. Buzz Chat (single featured card)
7. Shopping + Celebrity side by side (desktop) / stacked (mobile)
8. Quiz Categories
9. Ad (leaderboard)

**Desktop:** Keeps current grid layouts but with editorial section headers and dividers.

#### 3. PostCard -- New `list` variant for mobile news feed
- Full-width horizontal card: large thumbnail left (120x80), title + category tag + time ago right
- No reactions in list view (cleaner news feel)
- Category color-coded tag badge

#### 4. General mobile polish
- Section headers: Bold uppercase with thin border-bottom divider (like newspaper sections)
- Remove emoji icons from section headers (replace with clean text + colored accent)
- Compact `ReactionBar` on mobile hero only (not on every card in feed)
- Add "time ago" display (e.g., "2 ώρες πριν") on posts for freshness feel
- Smaller border-radius on mobile cards (`rounded-lg` instead of `rounded-xl`)

### Files to modify
- `src/components/Header.tsx` -- scrollable mobile tab bar, remove hamburger
- `src/pages/Index.tsx` -- restructured news-feed layout with sections and dividers
- `src/components/PostCard.tsx` -- new `list` variant for news feed
- `src/data/samplePosts.ts` -- add helper for time-ago formatting

