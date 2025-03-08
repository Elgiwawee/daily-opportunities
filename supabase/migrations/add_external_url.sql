
-- Add external_url column to opportunities table
ALTER TABLE opportunities ADD COLUMN IF NOT EXISTS external_url TEXT;

-- If there are any existing application_url values, move them to the new column
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'opportunities' AND column_name = 'application_url') THEN
    UPDATE opportunities SET external_url = application_url WHERE application_url IS NOT NULL;
    ALTER TABLE opportunities DROP COLUMN application_url;
  END IF;
END $$;
