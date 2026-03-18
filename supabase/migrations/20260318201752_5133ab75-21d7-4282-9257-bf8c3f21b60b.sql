ALTER TABLE public.quizzes ADD COLUMN IF NOT EXISTS slug text UNIQUE;
CREATE INDEX IF NOT EXISTS idx_quizzes_slug ON public.quizzes(slug);
CREATE TABLE IF NOT EXISTS public.email_captures (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL,
  quiz_id uuid REFERENCES public.quizzes(id),
  quiz_title text,
  result_title text,
  tags text[] DEFAULT ARRAY[]::text[],
  captured_at timestamptz DEFAULT now(),
  UNIQUE(email, quiz_id)
);
ALTER TABLE public.email_captures ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can insert" ON public.email_captures FOR INSERT WITH CHECK (true);
CREATE POLICY "Auth read" ON public.email_captures FOR SELECT USING (auth.role() = 'authenticated');