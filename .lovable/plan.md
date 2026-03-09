

## Φωτογραφίες στα Category Cards

### Πρόβλημα
Ο πίνακας `categories` δεν έχει στήλη `image_url`. Το `CategoryCard` component ελέγχει για `category.image` αλλά δεν υπάρχει ποτέ, οπότε δείχνει μόνο gradient + emoji.

### Αλλαγές

**1. Database migration** — Προσθήκη `image_url` στήλης στον πίνακα `categories` με default τιμές για κάθε κατηγορία (Unsplash photos):
- Προσωπικότητα → personality/self-discovery image
- Διασημότητες → celebrities/red carpet image
- Ταινίες & Σειρές → cinema/movies image
- Αθλητικά → sports/stadium image
- Μουσική → music/concert image
- Γενικές Γνώσεις → books/knowledge image

**2. `src/components/CategoryCard.tsx`**
- Αφαίρεση emoji icon display
- Χρήση `category.image_url` αντί `category.image` για τη φωτογραφία
- Διατήρηση overlay gradient + text

**3. `src/pages/admin/AdminCategories.tsx`**
- Προσθήκη `image_url` input field στη φόρμα δημιουργίας/επεξεργασίας κατηγοριών

### Αρχεία
- **Migration:** Add `image_url` column + set default images
- **Edit:** `src/components/CategoryCard.tsx`
- **Edit:** `src/pages/admin/AdminCategories.tsx`

