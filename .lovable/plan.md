

## Πλάνο: Επέκταση πλατφόρμας με BuzzFeed-style sections

Από το BuzzFeed, οι κύριες κατηγορίες/sections στο navigation είναι:

1. **Quizzes** — Ήδη υπάρχει
2. **Shopping** — Listicles με προϊόντα/συστάσεις ("35 Products You Need")
3. **Trending News** — Viral άρθρα/internet finds με reactions
4. **Celebrity** — Celebrity news & gossip
5. **Buzz Chat** — Community polls/discussions ("Which movie have you rewatched the most?")
6. **Arcade** — Mini games (stretch goal)

Επίσης κάθε post έχει **emoji reactions** (👍❤️😂😭🤯😡🙄😬) και σχόλια.

---

### Τι θα χτίσουμε

#### 1. Νέο content model: `posts` table
Ένα γενικό "post" model που καλύπτει articles, shopping lists, celebrity news, trending news — πέρα από quizzes.

**Database migration:**
- `posts` table: `id`, `title`, `description`, `image_url`, `content` (markdown/rich text), `post_type` (enum: `article`, `shopping`, `celebrity`, `trending_news`), `category_id`, `is_published`, `is_trending`, `views_count`, `created_at`, `updated_at`
- `post_reactions` table: `id`, `post_id`, `emoji` (text), `count` (integer) — aggregate reactions
- `buzz_chats` table: `id`, `question`, `image_url`, `is_active`, `created_at`
- `buzz_chat_replies` table: `id`, `buzz_chat_id`, `reply_text`, `created_at`
- RLS: Public read, admin write (same pattern as quizzes)

#### 2. Νέες σελίδες & routes
- `/trending` — Trending News feed
- `/shopping` — Shopping listicles
- `/celebrity` — Celebrity content
- `/buzzchat` — Community discussions
- `/post/:id` — Single post/article view

#### 3. Νέα components
- `PostCard` — Για articles (image, title, category tag, reactions bar, comments count). 3 variants: large, default, compact (like QuizCard)
- `ReactionBar` — Emoji reactions row (👍❤️😂😭🤯😡🙄😬) — click to react, show counts
- `BuzzChatCard` — "JOIN THE DISCUSSION" card with question + "Add Your Answer" button + reply count
- `ShoppingCard` — Product list preview card

#### 4. Updated Header navigation
Αντικατάσταση τρέχοντος nav με BuzzFeed-style tabs:
**Quizzes | Shopping | Trending News | Celebrity | Buzz Chat**

#### 5. Updated Homepage
Homepage sections in order:
1. **Trending** carousel (mixed: quizzes + posts)
2. **Ad (leaderboard)**
3. **Popular Quizzes** grid
4. **Popular on Shopping** sidebar-style
5. **Buzz Chat** "Join the Discussion" card
6. **Celebrity** section
7. **Ad**
8. **More trending posts** feed

#### 6. Sample data
Greek sample content for each type — articles, shopping, celebrity, buzz chats.

### Τεχνικές λεπτομέρειες

- New enum `post_type` in database
- `PostCard` component reuses design patterns from `QuizCard`
- `ReactionBar` stores reactions in `post_reactions` table (anonymous, no auth needed for reactions)
- `BuzzChat` replies are anonymous (INSERT policy for everyone)
- All new tables get same RLS pattern: public SELECT, admin INSERT/UPDATE/DELETE

### Σειρά υλοποίησης
1. Database migration (new tables + enum + RLS)
2. Sample data insertion
3. New components (`PostCard`, `ReactionBar`, `BuzzChatCard`)
4. New pages + routing
5. Updated Header + Homepage layout

