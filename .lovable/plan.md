

## Rebrand to "Fizzty" + Replace "Buzz Chat" with "Fizz Chat"

### Changes Overview

**1. Copy logo file into project**
- Copy `user-uploads://fizztylogowhite.png` to `src/assets/fizzty-logo.png`

**2. Header (`src/components/Header.tsx`)**
- Replace text logo "Quiz Mania" with an `<img>` tag using the Fizzty logo (import from `@/assets/fizzty-logo.png`)
- Rename nav item "Buzz Chat" → "Fizz Chat"

**3. Footer (`src/components/Footer.tsx`)**
- Replace text logo "Quiz Mania" with the Fizzty logo image
- Change copyright "QuizMania" → "Fizzty"

**4. Admin sidebar (`src/components/admin/AdminLayout.tsx`)**
- Change "BuzzFeed Admin" → "Fizzty Admin"
- Change nav label "BuzzChat" → "FizzChat"

**5. More from site (`src/components/MoreFromSite.tsx`)**
- "More from QuizMania" → "More from Fizzty"

**6. BuzzChat card (`src/components/BuzzChatCard.tsx`)**
- Badge text "Buzz Chat" → "Fizz Chat"

**7. BuzzChat page (`src/pages/BuzzChatPage.tsx`)**
- Heading "💬 Buzz Chat" → "💬 Fizz Chat"

**8. Index page (`src/pages/Index.tsx`)**
- Section header "Buzz Chat" → "Fizz Chat"

**9. Admin BuzzChats (`src/pages/admin/AdminBuzzChats.tsx`)**
- All UI labels: "BuzzChat" → "FizzChat"

**10. Admin Dashboard (`src/pages/admin/AdminDashboard.tsx`)**
- Label "BuzzChats" → "FizzChats"

**11. Legal pages**
- `src/pages/PrivacyPolicyPage.tsx`: "QuizMania" → "Fizzty", "quizmania.com" → "fizzty.com"
- `src/pages/TermsPage.tsx`: same replacements

**12. HTML meta (`index.html`)**
- Title and OG tags: "Lovable App" → "Fizzty"

All changes are string replacements + one image asset addition. No structural or database changes needed.

