
-- Create enum for quiz types
CREATE TYPE public.quiz_type AS ENUM ('personality', 'trivia');

-- Create enum for app roles
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator');

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- USER ROLES TABLE (must exist before has_role function)
CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- Security definer function (after user_roles table exists)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- CATEGORIES TABLE
CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT DEFAULT '📂',
  color TEXT DEFAULT 'primary',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Categories viewable by everyone" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Admins insert categories" ON public.categories FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update categories" ON public.categories FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete categories" ON public.categories FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON public.categories FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- QUIZZES TABLE
CREATE TABLE public.quizzes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  type public.quiz_type NOT NULL DEFAULT 'personality',
  is_published BOOLEAN NOT NULL DEFAULT false,
  is_trending BOOLEAN NOT NULL DEFAULT false,
  plays_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published quizzes viewable by everyone" ON public.quizzes FOR SELECT USING (is_published = true);
CREATE POLICY "Admins view all quizzes" ON public.quizzes FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins insert quizzes" ON public.quizzes FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update quizzes" ON public.quizzes FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete quizzes" ON public.quizzes FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER update_quizzes_updated_at BEFORE UPDATE ON public.quizzes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- RESULTS TABLE
CREATE TABLE public.results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  quiz_id UUID NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.results ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Results viewable by everyone" ON public.results FOR SELECT USING (true);
CREATE POLICY "Admins insert results" ON public.results FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update results" ON public.results FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete results" ON public.results FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- QUESTIONS TABLE
CREATE TABLE public.questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  quiz_id UUID NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  image_url TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Questions viewable by everyone" ON public.questions FOR SELECT USING (true);
CREATE POLICY "Admins insert questions" ON public.questions FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update questions" ON public.questions FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete questions" ON public.questions FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- ANSWERS TABLE
CREATE TABLE public.answers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  image_url TEXT,
  result_id UUID REFERENCES public.results(id) ON DELETE SET NULL,
  is_correct BOOLEAN DEFAULT false,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.answers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Answers viewable by everyone" ON public.answers FOR SELECT USING (true);
CREATE POLICY "Admins insert answers" ON public.answers FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update answers" ON public.answers FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete answers" ON public.answers FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- QUIZ ATTEMPTS TABLE
CREATE TABLE public.quiz_attempts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  quiz_id UUID NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
  result_id UUID REFERENCES public.results(id) ON DELETE SET NULL,
  score INTEGER,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can insert quiz attempts" ON public.quiz_attempts FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins view quiz attempts" ON public.quiz_attempts FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- INCREMENT PLAYS FUNCTION
CREATE OR REPLACE FUNCTION public.increment_plays(quiz_id_param UUID)
RETURNS VOID
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE public.quizzes SET plays_count = plays_count + 1 WHERE id = quiz_id_param;
$$;

-- INDEXES
CREATE INDEX idx_quizzes_category ON public.quizzes(category_id);
CREATE INDEX idx_quizzes_published ON public.quizzes(is_published);
CREATE INDEX idx_quizzes_trending ON public.quizzes(is_trending);
CREATE INDEX idx_questions_quiz ON public.questions(quiz_id);
CREATE INDEX idx_answers_question ON public.answers(question_id);
CREATE INDEX idx_results_quiz ON public.results(quiz_id);
CREATE INDEX idx_quiz_attempts_quiz ON public.quiz_attempts(quiz_id);
CREATE INDEX idx_user_roles_user ON public.user_roles(user_id);
