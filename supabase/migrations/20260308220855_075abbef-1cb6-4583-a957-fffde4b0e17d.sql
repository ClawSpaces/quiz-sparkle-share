
-- Create post_type enum
CREATE TYPE public.post_type AS ENUM ('article', 'shopping', 'celebrity', 'trending_news');

-- Posts table
CREATE TABLE public.posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  content TEXT,
  post_type post_type NOT NULL DEFAULT 'article',
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  is_published BOOLEAN NOT NULL DEFAULT false,
  is_trending BOOLEAN NOT NULL DEFAULT false,
  views_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Post reactions (aggregate)
CREATE TABLE public.post_reactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  emoji TEXT NOT NULL,
  count INTEGER NOT NULL DEFAULT 0,
  UNIQUE(post_id, emoji)
);

-- Buzz chats
CREATE TABLE public.buzz_chats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT NOT NULL,
  image_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Buzz chat replies
CREATE TABLE public.buzz_chat_replies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  buzz_chat_id UUID NOT NULL REFERENCES public.buzz_chats(id) ON DELETE CASCADE,
  reply_text TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX idx_posts_post_type ON public.posts(post_type);
CREATE INDEX idx_posts_is_published ON public.posts(is_published);
CREATE INDEX idx_posts_is_trending ON public.posts(is_trending);
CREATE INDEX idx_posts_category_id ON public.posts(category_id);
CREATE INDEX idx_post_reactions_post_id ON public.post_reactions(post_id);
CREATE INDEX idx_buzz_chat_replies_chat_id ON public.buzz_chat_replies(buzz_chat_id);

-- Trigger for updated_at on posts
CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON public.posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS on posts
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published posts viewable by everyone" ON public.posts FOR SELECT USING (is_published = true);
CREATE POLICY "Admins view all posts" ON public.posts FOR SELECT USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins insert posts" ON public.posts FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update posts" ON public.posts FOR UPDATE USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete posts" ON public.posts FOR DELETE USING (has_role(auth.uid(), 'admin'));

-- RLS on post_reactions
ALTER TABLE public.post_reactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Reactions viewable by everyone" ON public.post_reactions FOR SELECT USING (true);
CREATE POLICY "Anyone can insert reactions" ON public.post_reactions FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update reaction counts" ON public.post_reactions FOR UPDATE USING (true);

-- RLS on buzz_chats
ALTER TABLE public.buzz_chats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Active buzz chats viewable by everyone" ON public.buzz_chats FOR SELECT USING (is_active = true);
CREATE POLICY "Admins manage buzz chats" ON public.buzz_chats FOR ALL USING (has_role(auth.uid(), 'admin'));

-- RLS on buzz_chat_replies
ALTER TABLE public.buzz_chat_replies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Replies viewable by everyone" ON public.buzz_chat_replies FOR SELECT USING (true);
CREATE POLICY "Anyone can reply" ON public.buzz_chat_replies FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins manage replies" ON public.buzz_chat_replies FOR DELETE USING (has_role(auth.uid(), 'admin'));

-- Increment views function
CREATE OR REPLACE FUNCTION public.increment_views(post_id_param UUID)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE public.posts SET views_count = views_count + 1 WHERE id = post_id_param;
$$;

-- Upsert reaction function (increment emoji count)
CREATE OR REPLACE FUNCTION public.upsert_reaction(p_post_id UUID, p_emoji TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.post_reactions (post_id, emoji, count)
  VALUES (p_post_id, p_emoji, 1)
  ON CONFLICT (post_id, emoji)
  DO UPDATE SET count = post_reactions.count + 1;
END;
$$;
