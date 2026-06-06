CREATE TABLE public.pdf_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size BIGINT,
  created_by UUID,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + interval '24 hours'),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT ON public.pdf_documents TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.pdf_documents TO authenticated;
GRANT ALL ON public.pdf_documents TO service_role;

ALTER TABLE public.pdf_documents ENABLE ROW LEVEL SECURITY;

-- Anyone can view a PDF only while it has not expired
CREATE POLICY "Anyone can view non-expired pdf documents"
  ON public.pdf_documents FOR SELECT
  USING (expires_at > now());

CREATE POLICY "Only admins can insert pdf documents"
  ON public.pdf_documents FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can update pdf documents"
  ON public.pdf_documents FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can delete pdf documents"
  ON public.pdf_documents FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_pdf_documents_updated_at
  BEFORE UPDATE ON public.pdf_documents
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Helper to permanently remove expired PDF records (and let cron call it)
CREATE OR REPLACE FUNCTION public.delete_expired_pdf_documents()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.pdf_documents WHERE expires_at <= now();
END;
$$;