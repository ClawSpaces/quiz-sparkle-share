

## Full English Translation — UI + Database Content

This is a massive undertaking covering **two parts**: all hardcoded UI strings (23 files) AND all database content.

### Database Content Scale

| Table | Rows | Fields to translate |
|-------|------|-------------------|
| categories | 6 | name, description, slug |
| quizzes | 18 | title, description |
| posts | 8 | title, description |
| questions | 380 | text |
| answers | 2,186 | text |
| results | 128 | title, description |
| buzz_chats | 4 | question |

**Total: ~2,730 rows** need translation across 7 tables.

### Approach

**Phase 1 — UI strings (23 files)**
All hardcoded Greek text in components and pages translated to English, as outlined in the previously approved plan. Pure string replacements, no logic changes.

**Phase 2 — Database content**
Use the data insert tool to run UPDATE statements translating all Greek content to English. This will be done table by table:

1. **categories** — Update name, description, and slug to English equivalents (e.g. "Προσωπικότητα" → "Personality", slug "prosopikotita" → "personality")
2. **quizzes** — Update title and description for all 18 quizzes
3. **posts** — Update title and description for all 8 posts
4. **buzz_chats** — Update question text for all 4 entries
5. **results** — Update title and description for all 128 results
6. **questions** — Update text for all 380 questions
7. **answers** — Update text for all 2,186 answers

### Important Notes

- **Slug changes** in categories will require updating any code that references old Greek slugs (e.g. route paths, links)
- Category slugs are used in URL routing — all references in `sampleQuizzes.ts`, route definitions, and navigation links need updating
- The `sampleQuizzes.ts` and `samplePosts.ts` files with hardcoded Greek data also need full translation
- Date locale imports (`el` from date-fns) will be switched to `enUS`

### Risk
With 2,186 answers and 380 questions, the translation will need to be done in batches. Some quiz-specific content (e.g. "Ποιο ελληνικό νησί σου ταιριάζει;" — Greek island quizzes) may need creative adaptation rather than literal translation since they're culturally specific.

### Files to Edit (~25 files)
All 23 UI files from the previous plan, plus `src/data/sampleQuizzes.ts` and `src/data/samplePosts.ts`.

### Database Operations
~7 batch UPDATE operations across all content tables.

