
-- Comments table for quizzes and posts
CREATE TABLE public.comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  content_type TEXT NOT NULL,
  content_id UUID NOT NULL,
  author_name TEXT NOT NULL,
  comment_text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- Everyone can read comments
CREATE POLICY "Comments viewable by everyone"
  ON public.comments FOR SELECT
  TO public
  USING (true);

-- Anyone can insert comments
CREATE POLICY "Anyone can insert comments"
  ON public.comments FOR INSERT
  TO public
  WITH CHECK (true);

-- Only admins can delete
CREATE POLICY "Admins delete comments"
  ON public.comments FOR DELETE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.comments;
