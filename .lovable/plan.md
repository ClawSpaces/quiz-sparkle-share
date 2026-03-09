

## Ad Placement στο QuizPage — BuzzFeed Style

### Τι κάνει το BuzzFeed
Από την ανάλυση της σελίδας, το BuzzFeed βάζει **Advertisement ανάμεσα σε ΚΑΘΕ ερώτηση** — δηλαδή μετά από κάθε question block υπάρχει ένα ad slot. Αυτό είναι πολύ πιο πυκνό από το δικό μας (που βάζει ad κάθε 5 ερωτήσεις).

```text
BuzzFeed Pattern:
  Question A
  ── Ad ──
  Question B  
  ── Ad ──
  Question C
  ── Ad ──
  ...

Our Current Pattern:
  Question 1-5
  ── Ad ──
  Question 6-10
  ── Ad ──
```

### Αλλαγή

**`src/pages/QuizPage.tsx`** — Μία αλλαγή:
- Γραμμή 425-428: Αλλαγή από `(qIdx + 1) % 5 === 0` σε ad **μετά από κάθε ερώτηση** (εκτός της τελευταίας)
- Format: `rectangle` για κάθε ad slot, ίδιο με τώρα
- Κρατάμε το leaderboard ad πάνω από τις ερωτήσεις (γραμμή 315) — αυτό είναι ήδη σωστό

