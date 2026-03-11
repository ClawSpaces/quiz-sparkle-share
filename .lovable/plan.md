

## Translate Remaining Database Content to English

### Scale
- **37 quizzes** still have Greek titles/descriptions
- **369 questions** in Greek
- **1,767 answers** in Greek  
- **94 results** in Greek

### Approach

This will be done using the data insert tool with UPDATE statements, processed quiz-by-quiz in batches. Each batch will:

1. Update the quiz title and description
2. Update all its questions text
3. Update all its answers text
4. Update all its results title and description

### Translation Strategy

Quizzes will be translated/adapted for an English-speaking audience:

| Greek Title | English Translation |
|---|---|
| Ελληνική Μυθολογία: Είσαι Θεός ή απλός Θνητός; | Greek Mythology: Are You a God or a Mere Mortal? |
| Ποιος Disney χαρακτήρας είσαι; | Which Disney Character Are You? |
| Champions League 2025-26: Πόσο καλά τα ξέρεις; | Champions League 2025-26: How Well Do You Know It? |
| Eurovision 2026... | Eurovision 2026: How Well Do You Know the Contestants? |
| K-pop Quiz... | K-pop Quiz: How ARMY or BLINK Are You Really? |
| etc. | (all 37 quizzes translated) |

Culturally specific content (Greek football, Greek celebrities, Greek 90s hits) will be kept but translated -- the topics stay the same, just the language changes.

### Execution

Due to the volume (~2,200+ rows), this will require multiple batch UPDATE operations:
- **Batch 1-5**: Quiz titles + descriptions (37 rows)
- **Batch 6-15**: Questions (369 rows, ~40 per batch)
- **Batch 16-35**: Answers (1,767 rows, ~90 per batch)  
- **Batch 36-40**: Results (94 rows)

Each batch requires reading the current Greek text, translating it, and issuing UPDATE statements. This is a large but straightforward data operation with no schema or code changes needed.

