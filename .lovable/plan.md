

## Νομικές Σελίδες — Privacy Policy & Terms of Use (AdSense/Taboola Ready)

### Τι χρειάζεται για έγκριση

Βάσει της έρευνας, οι ad networks (Google AdSense, Taboola, κλπ.) απαιτούν:

**Privacy Policy πρέπει να περιλαμβάνει:**
- Ποια δεδομένα συλλέγονται (cookies, analytics, device info)
- Χρήση third-party advertising (Google AdSense, Taboola) και cookies τους
- Google's DoubleClick cookie + opt-out link
- GDPR compliance (δικαιώματα χρηστών EU: πρόσβαση, διαγραφή, φορητότητα)
- Πολιτική για ανηλίκους (COPPA)
- Links σε Google Privacy Policy & Taboola Privacy Policy
- Τρόπος επικοινωνίας

**Terms of Use πρέπει να περιλαμβάνει:**
- Πνευματικά δικαιώματα περιεχομένου
- Αποποίηση ευθυνών (disclaimer)
- Περιορισμός ευθύνης
- Κανόνες χρήσης
- Τροποποιήσεις όρων
- Εφαρμοστέο δίκαιο (Ελληνικό)

### Αλλαγές

#### 1. `src/pages/PrivacyPolicyPage.tsx` — Νέα σελίδα
- Πλήρης Πολιτική Απορρήτου στα Ελληνικά
- Sections: Εισαγωγή, Δεδομένα που συλλέγουμε, Cookies & Τεχνολογίες Tracking, Διαφημίσεις Τρίτων (Google AdSense, Taboola), GDPR Δικαιώματα, Ανήλικοι, Αλλαγές Πολιτικής, Επικοινωνία
- Χρήση Header/Footer layout, proper heading hierarchy

#### 2. `src/pages/TermsPage.tsx` — Νέα σελίδα
- Πλήρεις Όροι Χρήσης στα Ελληνικά
- Sections: Αποδοχή Όρων, Πνευματικά Δικαιώματα, Χρήση Υπηρεσίας, Περιεχόμενο Χρηστών, Διαφημίσεις, Αποποίηση Ευθυνών, Περιορισμός Ευθύνης, Τροποποιήσεις, Εφαρμοστέο Δίκαιο, Επικοινωνία

#### 3. `src/App.tsx` — Routes
- Προσθήκη `/privacy` → PrivacyPolicyPage
- Προσθήκη `/terms` → TermsPage

### Αρχεία
- `src/pages/PrivacyPolicyPage.tsx` (νέο)
- `src/pages/TermsPage.tsx` (νέο)
- `src/App.tsx` (2 νέα routes)

