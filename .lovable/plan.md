

## Fix: Admin panel κολλάει στο "Φόρτωση..."

### Πρόβλημα

Η `has_role` RPC κλήση δεν εκτελείται ποτέ — δεν φαίνεται καν στα network requests. Αυτό συμβαίνει επειδή η Supabase SDK αποκλείει async Supabase calls μέσα στο `onAuthStateChange` callback (deadlock). Αποτέλεσμα: `isAdmin` μένει `false`, `loading` μένει `true` → stuck στο "Φόρτωση...".

### Λύση — `src/hooks/useAuth.ts`

Διαχωρισμός σε δύο βήματα:
1. `onAuthStateChange` + `getSession` θέτουν **μόνο** session/user (sync, χωρίς async Supabase calls)
2. Ξεχωριστό `useEffect` που παρακολουθεί το `user` και κάνει το `has_role` RPC call εκεί

```text
useEffect #1: onAuthStateChange → set user/session only
useEffect #2: when user changes → call has_role RPC → set isAdmin → set loading=false
```

Αυτό αποφεύγει το deadlock και εξασφαλίζει ότι η role check τρέχει σωστά.

### Αρχεία
- `src/hooks/useAuth.ts` — refactor για αποφυγή async calls μέσα στο auth callback

