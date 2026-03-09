

## Diagnosis

The `types.ts` file is **out of sync** with the database. The database has `profiles` table and `author_id`/`instructions` columns on `quizzes`, but `types.ts` does not include them. This file is auto-generated and cannot be manually edited.

This means any code referencing these new columns through the typed Supabase client will cause TypeScript build errors, which is likely triggering the internal errors.

## Plan: Create AuthorCard.tsx (safe approach)

**One file only**: `src/components/AuthorCard.tsx`

- Define a **local interface** for props (name, avatar_url, bio, title) -- no dependency on `types.ts`
- Simple presentational component: avatar, name, title/bio
- Uses existing `Avatar`, `AvatarImage`, `AvatarFallback` from UI components
- Does NOT import from `types.ts` or call Supabase directly
- The parent component (QuizPage) will fetch profile data and pass it as props later

This approach completely avoids the types.ts sync issue. The component is purely presentational.

