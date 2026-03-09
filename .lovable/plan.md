

## Προσθήκη εικόνων σε όλα τα answers/questions/results που λείπουν

### Τρέχουσα κατάσταση
- **756 answers** χωρίς εικόνα (από 2186 σύνολο)
- **146 questions** χωρίς εικόνα (από 380)
- **32 results** χωρίς εικόνα (από 128)

### Σχέδιο

**Νέο Edge Function: `supabase/functions/fix-missing-images/index.ts`**

Θα φτιάξω ένα edge function που:
1. Παίρνει answers/questions/results χωρίς `image_url` (σε batches των 50)
2. Στέλνει τα texts στο Lovable AI (gemini-3-flash-preview) ζητώντας κατάλληλα Unsplash photo IDs για κάθε item
3. Κάνει UPDATE στη βάση με τα νέα image URLs
4. Δέχεται parameter `type` (`answers`, `questions`, `results`) και `offset`

Θα καλεστεί πολλές φορές μέχρι να γεμίσουν όλα:
- ~15 κλήσεις για answers (756 / 50)
- ~3 κλήσεις για questions (146 / 50)  
- ~1 κλήση για results (32)

### Αρχεία
- `supabase/functions/fix-missing-images/index.ts` — νέο
- Κανένα config.toml update (ήδη υπάρχει verify_jwt = false pattern)

