-- Add missing author_id column to posts table for article uploads
-- This fixes the Publisher subagent being unable to upload quiz articles

BEGIN;

-- Add author_id column to posts table
ALTER TABLE posts 
ADD COLUMN IF NOT EXISTS author_id UUID REFERENCES auth.users(id);

-- Set default author for existing posts (if any)
-- Replace with actual author UUID when known
-- UPDATE posts SET author_id = '8c272f0d-9852-48c0-ae62-b422d49f8d30' WHERE author_id IS NULL;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_posts_author_id ON posts(author_id);

-- Add comment for documentation
COMMENT ON COLUMN posts.author_id IS 'References auth.users - required for article publishing workflow';

COMMIT;