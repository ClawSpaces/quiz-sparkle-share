

## Αλλαγές για Ad Arbitrage Readiness (χωρίς SEO/metadata)

Παραλείπουμε index.html/SEO — εφαρμόζουμε τα υπόλοιπα 4 σημεία.

### 1. QuizzesPage — `<Link>` → `<a href>`
- Featured quiz card (line 115): `<Link to>` → `<a href>`
- Trending quiz cards (line 154): `<Link to>` → `<a href>`
- Αφαίρεση `import { Link }` (δεν χρησιμοποιείται πλέον)
- **Γιατί:** Χωρίς αυτό, κάθε κλικ σε quiz από τη listing page = 0 ad impressions

### 2. Footer — Dynamic categories από database
- Αφαίρεση `import { categories } from "@/data/sampleQuizzes"`
- Fetch categories με `useEffect` + `supabase.from("categories").select().order("sort_order")`
- Render δυναμικά αντί για hardcoded data

### 3. CookieConsent component (νέο)
- `src/components/CookieConsent.tsx`
- Banner στο κάτω μέρος με "Αποδοχή" / "Απόρριψη"
- Αποθήκευση στο `localStorage` — εμφανίζεται μόνο μία φορά
- Mount στο `App.tsx`
- **Απαιτείται** για GDPR compliance και AdSense έγκριση σε EU

### 4. ads.txt (νέο)
- `public/ads.txt` με placeholder comment
- Ο χρήστης θα αντικαταστήσει με πραγματικό publisher ID μετά την έγκριση AdSense

### Αρχεία
- **Edit:** `src/pages/QuizzesPage.tsx`
- **Edit:** `src/components/Footer.tsx`
- **Edit:** `src/App.tsx` (add CookieConsent)
- **Νέο:** `src/components/CookieConsent.tsx`
- **Νέο:** `public/ads.txt`

