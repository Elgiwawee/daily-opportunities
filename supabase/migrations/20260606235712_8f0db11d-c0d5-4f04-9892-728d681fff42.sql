REVOKE EXECUTE ON FUNCTION public.delete_expired_pdf_documents() FROM anon, authenticated;

CREATE EXTENSION IF NOT EXISTS pg_cron;

SELECT cron.schedule(
  'cleanup-expired-pdfs',
  '0 * * * *',
  $$ SELECT public.delete_expired_pdf_documents(); $$
);