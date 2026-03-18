-- Add slug column to quizzes table for SEO-friendly URLs
ALTER TABLE public.quizzes ADD COLUMN IF NOT EXISTS slug text UNIQUE;

-- Create index for fast slug lookups
CREATE INDEX IF NOT EXISTS idx_quizzes_slug ON public.quizzes(slug);

-- Populate slugs for existing quizzes based on title
UPDATE public.quizzes SET slug =
  lower(
    regexp_replace(
      regexp_replace(
        regexp_replace(title, '[^a-zA-Z0-9\s-]', '', 'g'),
        '\s+', '-', 'g'
      ),
      '-+', '-', 'g'
    )
  )
WHERE slug IS NULL;

-- Create email_captures table for collecting emails with quiz context
CREATE TABLE IF NOT EXISTS public.email_captures (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL,
  quiz_id uuid REFERENCES public.quizzes(id),
  quiz_title text,
  result_title text,
  tags text[] DEFAULT '{}',
  captured_at timestamptz DEFAULT now(),
  UNIQUE(email, quiz_id)
);

-- Enable RLS
ALTER TABLE public.email_captures ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (for quiz takers)
CREATE POLICY "Anyone can insert email captures"
  ON public.email_captures FOR INSERT
  WITH CHECK (true);

-- Only authenticated users can read (admin)
CREATE POLICY "Authenticated users can read email captures"
  ON public.email_captures FOR SELECT
  USING (auth.role() = 'authenticated');
