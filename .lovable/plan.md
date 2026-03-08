

## Admin Panel — Διαχείριση Άρθρων, Quizzes, Κατηγοριών & BuzzChats

### Τι χτίζουμε
Ένα πλήρες admin panel στο `/admin` με authentication, protected routes, και CRUD για όλα τα entities του site. Μόνο users με role `admin` θα έχουν πρόσβαση.

### Δομή

```text
/admin/login     → Login page (email/password)
/admin           → Dashboard (overview stats)
/admin/posts     → Λίστα & CRUD άρθρων
/admin/quizzes   → Λίστα & CRUD quizzes
/admin/categories → Λίστα & CRUD κατηγοριών
/admin/buzzchat  → Λίστα & CRUD buzz chats
```

### Αρχεία που δημιουργούνται

1. **`src/pages/admin/AdminLogin.tsx`** — Login form (email + password), χρησιμοποιεί `supabase.auth.signInWithPassword`, redirect στο `/admin` αν ο user έχει admin role

2. **`src/hooks/useAuth.ts`** — Hook για auth state + admin role check μέσω `has_role` RPC

3. **`src/components/admin/AdminLayout.tsx`** — Layout wrapper με sidebar navigation (Posts, Quizzes, Categories, BuzzChat), header με logout button. Ελέγχει admin role, αλλιώς redirect στο `/admin/login`

4. **`src/pages/admin/AdminDashboard.tsx`** — Overview: counts (posts, quizzes, categories), recent activity

5. **`src/pages/admin/AdminPosts.tsx`** — Table με posts (title, type, published, views, date). Actions: create, edit, delete, toggle publish/trending

6. **`src/pages/admin/AdminPostForm.tsx`** — Form για create/edit post (title, description, content, image_url, post_type select, category select, is_published, is_trending)

7. **`src/pages/admin/AdminQuizzes.tsx`** — Table με quizzes. Actions: create, edit, delete, toggle publish/trending

8. **`src/pages/admin/AdminQuizForm.tsx`** — Form για create/edit quiz (title, description, image_url, type, category, is_published, is_trending) + nested management of questions, answers, results

9. **`src/pages/admin/AdminCategories.tsx`** — Table + inline create/edit/delete categories

10. **`src/pages/admin/AdminBuzzChats.tsx`** — Table + create/edit/delete buzz chats, toggle active

11. **`src/App.tsx`** — Προσθήκη routes για `/admin/*`

### Τεχνικές λεπτομέρειες

- Όλα τα queries γίνονται μέσω Supabase client — τα RLS policies ήδη υπάρχουν και επιτρέπουν CRUD μόνο σε admins
- Auth check: `supabase.auth.getSession()` + `supabase.rpc('has_role', { _user_id: user.id, _role: 'admin' })`
- Χρήση `@tanstack/react-query` για data fetching & mutations
- Χρήση existing UI components (Table, Button, Input, Dialog, Select, Switch, Tabs)
- Δεν χρειάζονται database migrations — τα tables και RLS policies υπάρχουν ήδη

### Δεν αλλάζει
- Κανένα database schema change
- Κανένα υπάρχον frontend component

