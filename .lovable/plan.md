

## Πλάνο: BuzzFeed-style Quiz Platform (Ελληνικά, με Admin Panel + Supabase)

### Βήμα 1: Lovable Cloud Setup (Database + Auth)

**Database Tables:**
- `categories` — Κατηγορίες quizzes (Personality, Celebrity, Movies, Sports κλπ.)
- `quizzes` — Τα quizzes (τίτλος, εικόνα, κατηγορία, τύπος, δημοσίευση status)
- `questions` — Ερωτήσεις κάθε quiz (κείμενο, εικόνα, σειρά)
- `answers` — Απαντήσεις κάθε ερώτησης (κείμενο, εικόνα, σύνδεση με αποτέλεσμα)
- `results` — Αποτελέσματα quiz (τίτλος, περιγραφή, εικόνα)
- `quiz_attempts` — Tracking πόσοι έπαιξαν κάθε quiz
- `user_roles` — Admin roles (security definer pattern)

**Auth:** Email login μόνο για admin. Οι χρήστες παίζουν quizzes χωρίς login.

### Βήμα 2: Frontend Pages & Components

**Public Pages:**
- **Homepage** (`/`) — Hero section, trending quizzes, κατηγορίες grid, popular quizzes. BuzzFeed-style layout με colorful cards και bold typography
- **Category Page** (`/category/:slug`) — Λίστα quizzes ανά κατηγορία
- **Quiz Page** (`/quiz/:id`) — Το quiz gameplay: μία ερώτηση κάθε φορά, progress bar, image-based answers
- **Results Page** — Αποτέλεσμα quiz με social sharing buttons (Facebook, Twitter/X, WhatsApp, copy link)

**Admin Pages (protected):**
- **Admin Login** (`/admin`)
- **Dashboard** (`/admin/dashboard`) — Στατιστικά (total quizzes, plays, popular)
- **Quiz Editor** (`/admin/quizzes/new`) — Form δημιουργίας quiz με ερωτήσεις, απαντήσεις, αποτελέσματα
- **Quiz List** (`/admin/quizzes`) — Διαχείριση quizzes (edit, delete, publish/unpublish)
- **Categories Manager** (`/admin/categories`)

**Shared Components:**
- `Header` — Logo, navigation (Αρχική, Κατηγορίες), search
- `Footer` — Links, copyright
- `QuizCard` — Card component για quiz preview (εικόνα, τίτλος, κατηγορία, plays count)
- `AdPlaceholder` — Divs σε στρατηγικά σημεία για Google AdSense (μεταξύ ερωτήσεων, sidebar, μετά το αποτέλεσμα)
- `ShareButtons` — Social media sharing
- `QuizPlayer` — Ο engine που τρέχει τα quizzes

### Βήμα 3: Ad Placement Strategy

Θέσεις για AdSense ads:
- Header banner (leaderboard 728x90)
- Μεταξύ quiz cards στο homepage (native ad style)
- Sidebar στο quiz page
- Μεταξύ ερωτήσεων (κάθε 3-4 ερωτήσεις)
- Στη σελίδα αποτελεσμάτων (πριν και μετά το result)

Θα χρησιμοποιήσουμε placeholder divs που μπορείς εύκολα να αντικαταστήσεις με τον AdSense κώδικα.

### Βήμα 4: SEO & Social Sharing

- Dynamic meta tags ανά quiz (Open Graph, Twitter Cards)
- Shareable result URLs
- Ελληνικά meta descriptions

### Κατηγορίες Quiz (αρχικές)

1. Προσωπικότητα (Personality)
2. Διασημότητες (Celebrity)
3. Ταινίες & Σειρές
4. Αθλητικά
5. Μουσική
6. Γενικές Γνώσεις (Trivia)

### Σειρά Υλοποίησης

Επειδή το project είναι μεγάλο, θα το χτίσουμε σε φάσεις:

1. **Φάση 1:** Homepage layout + Header/Footer + QuizCard component + Routing (με sample data)
2. **Φάση 2:** Supabase setup — tables, auth, RLS policies
3. **Φάση 3:** Admin panel — login, quiz creator, categories manager
4. **Φάση 4:** Quiz player engine + results page + social sharing
5. **Φάση 5:** Category pages, search, ad placeholders, SEO

### Τεχνικές Λεπτομέρειες

- **Stack:** React + TypeScript + Tailwind + Supabase (Lovable Cloud)
- **State:** React Query για data fetching
- **Routing:** React Router (ήδη εγκατεστημένο)
- **Quiz Types:** Personality (κάθε απάντηση δίνει πόντους σε result) + Trivia (σωστό/λάθος)
- **Design:** Colorful, bold, BuzzFeed-inspired — vibrant colors, large images, playful typography

Θα ξεκινήσω με τη **Φάση 1** — το frontend layout με sample quizzes για να δεις αμέσως κάτι ζωντανό.

