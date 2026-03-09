

## Στρατηγική Ad Monetization — Σωστή Δομή για Arbitrage

### Το Πρόβλημα (και γιατί χάνεις λεφτά τώρα)

Το site είναι **React SPA**. Όταν ο χρήστης πατάει από quiz σε quiz ή από post σε post, η σελίδα **δεν κάνει reload** — το React απλά αντικαθιστά components. Αυτό σημαίνει:

- Τα ad scripts (AdSense, Taboola) τρέχουν μόνο στο **αρχικό page load**
- Κάθε navigation μέσα στο SPA = **0 νέα ad impressions**
- Ένας χρήστης που παίξει 5 quizzes στη σειρά βλέπει τις **ίδιες** διαφημίσεις ή καθόλου

Αυτό είναι critical για arbitrage — εκεί κερδίζεις ακριβώς από τα **pageviews × ad impressions**.

### Η Σωστή Λύση

**Χρήση κανονικών `<a href>` αντί για React Router `<Link>` σε ΟΛΕΣ τις content-to-content navigations.**

Αυτό σημαίνει:
- Κάθε κλικ σε quiz card, post card, "Θέλεις κι άλλα;", sidebar links → **full page reload**
- Κάθε reload = νέο ad request = νέα διαφήμιση = νέο impression
- Navigation menu (Header links: Trending, Quizzes, Categories κλπ) μπορεί να μείνει `<Link>` γιατί πηγαίνεις σε listing pages, όχι σε content

Αυτό κάνουν **όλα** τα arbitrage sites (BuzzFeed, TheTalko, FactVerse κλπ). Κανένα σοβαρό content site δεν χρησιμοποιεί SPA navigation για content pages.

### Επιπλέον: Ad Component με Refresh Logic

Θα αντικαταστήσω το `AdPlaceholder` με ένα πραγματικό `AdSlot` component που:
- Δέχεται ad network script/tag (AdSense slot ID ή Taboola container)
- Κάνει re-render σωστά σε κάθε page load
- Υποστηρίζει fallback (δείχνει placeholder αν δεν έχει ρυθμιστεί ακόμα ad network)
- Έχει `data-ad-slot` attributes έτοιμα για AdSense

### Τι αλλάζει

**1. Content card components → `<a href>` αντί `<Link>`**
- `src/components/QuizCard.tsx` — αλλαγή `<Link>` → `<a href>`
- `src/components/PostCard.tsx` — αλλαγή `<Link>` → `<a href>`
- `src/components/ReadyForMore.tsx` — αλλαγή `<Link>` → `<a href>`  
- `src/components/MoreFromSite.tsx` — αλλαγή `<Link>` → `<a href>`
- `src/components/ContentSidebar.tsx` — αλλαγή quiz/post links → `<a href>`
- `src/pages/Index.tsx` — αλλαγή post/quiz card links → `<a href>`

**2. Νέο AdSlot component**
- `src/components/AdSlot.tsx` — αντικαθιστά το `AdPlaceholder`
- Δέχεται `slotId`, `format`, `network` props
- Όταν δεν υπάρχει πραγματικό ad config, δείχνει placeholder
- Έτοιμο να δεχτεί AdSense/Taboola script tags

**3. Ad placement optimization**
- Προσθήκη ad slots ανάμεσα σε questions στα quizzes (κάθε 2-3 ερωτήσεις)
- Αυτό είναι standard practice — κάθε question scroll = ad visibility

**Δεν αλλάζει:** Navigation menu links (Header), category page links, admin routes — αυτά μένουν `<Link>` γιατί δεν είναι monetizable content pages.

### Αρχεία που αλλάζουν
- `src/components/QuizCard.tsx`
- `src/components/PostCard.tsx`  
- `src/components/ContentSidebar.tsx`
- `src/components/ReadyForMore.tsx`
- `src/components/MoreFromSite.tsx`
- `src/pages/Index.tsx`
- `src/pages/QuizPage.tsx` (ads between questions)
- **Νέο:** `src/components/AdSlot.tsx`
- **Διαγραφή:** `src/components/AdPlaceholder.tsx` (αντικαθίσταται)

