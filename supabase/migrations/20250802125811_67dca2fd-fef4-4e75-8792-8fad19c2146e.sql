-- Allow anyone (including non-authenticated users) to create blog comments
DROP POLICY IF EXISTS "Authenticated users can create comments" ON blog_comments;

CREATE POLICY "Anyone can create comments" 
ON blog_comments 
FOR INSERT 
WITH CHECK (true);

-- Update the policy to allow users to update/delete their own comments if authenticated
-- or allow anyone to delete comments if not authenticated (for visitor comments)
DROP POLICY IF EXISTS "Users can update their own comments" ON blog_comments;
DROP POLICY IF EXISTS "Users can delete their own comments" ON blog_comments;

CREATE POLICY "Users can update their own comments or visitors can update if no auth" 
ON blog_comments 
FOR UPDATE 
USING (auth.uid() = created_by OR created_by IS NULL);

CREATE POLICY "Users can delete their own comments or visitors can delete if no auth" 
ON blog_comments 
FOR DELETE 
USING (auth.uid() = created_by OR created_by IS NULL);