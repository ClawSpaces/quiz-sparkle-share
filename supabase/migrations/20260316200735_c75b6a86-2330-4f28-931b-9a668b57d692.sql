
INSERT INTO storage.buckets (id, name, public)
VALUES ('cover-images', 'cover-images', true);

CREATE POLICY "Public read access for cover images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'cover-images');

CREATE POLICY "Service role can upload cover images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'cover-images');
