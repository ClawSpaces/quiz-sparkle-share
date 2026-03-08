

## Πρόβλημα: Infinite re-render loop στο useAuth

### Root cause

Το `onAuthStateChange` δημιουργεί **νέο `User` object** σε κάθε event (ακόμα και αν είναι ο ίδιος χρήστης). Αυτό trigger-άρει το Effect 2 (`[user]` dependency), το οποίο κάνει `setIsAdmin` / `setLoading` → re-render → `onAuthStateChange` ξαναπυροδοτείται → νέο User object → Effect 2 ξανά → **infinite loop**.

Τα network logs το επιβεβαιώνουν: δεκάδες `has_role` calls ανά δευτερόλεπτο, όλα επιστρέφουν `true`.

### Λύση — `src/hooks/useAuth.ts`

Χρήση `useRef` για track του user ID αντί να εξαρτάται το Effect 2 από το `user` object reference:

1. Προσθήκη `useRef` για `lastCheckedUserId`
2. Effect 2 ελέγχει αν `user.id !== lastCheckedUserId.current` πριν κάνει RPC call
3. Αν ο user ID δεν άλλαξε, skip — αποφεύγεται το loop
4. Reset ref σε `null` όταν ο user γίνεται `null` (logout)

Ένα αρχείο: `src/hooks/useAuth.ts`

