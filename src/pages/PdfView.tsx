import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { extractIdFromSlug } from "@/utils/slugUtils";
import {
  FileText,
  Download,
  Home,
  Clock,
  FileWarning,
  Loader2,
} from "lucide-react";

interface PdfDocument {
  id: string;
  title: string;
  file_url: string;
  file_path: string;
  file_size: number | null;
  expires_at: string;
  created_at: string;
}

const formatSize = (bytes: number | null) => {
  if (!bytes) return "";
  const mb = bytes / (1024 * 1024);
  if (mb >= 1) return `${mb.toFixed(1)} MB`;
  return `${(bytes / 1024).toFixed(0)} KB`;
};

const PdfView = () => {
  const { slug } = useParams<{ slug: string }>();
  const [doc, setDoc] = useState<PdfDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const fetchDoc = async () => {
      if (!slug) {
        setLoading(false);
        return;
      }
      setLoading(true);
      const idPart = extractIdFromSlug(slug);

      // Exact id match first (only valid UUIDs)
      let found: PdfDocument | null = null;
      const isUuid =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
          slug
        );
      if (isUuid) {
        const { data: exact } = await supabase
          .from("pdf_documents")
          .select("*")
          .eq("id", slug)
          .maybeSingle();
        if (exact) found = exact as PdfDocument;
      }

      // Otherwise match by the 8-char id prefix embedded in the slug.
      // `ilike` is not supported on uuid columns via PostgREST, so fetch the
      // (small) set of non-expired docs and match the prefix client-side.
      if (!found && idPart) {
        const prefix = idPart.toLowerCase();
        const { data: rows } = await supabase
          .from("pdf_documents")
          .select("*");
        if (rows) {
          found =
            (rows as PdfDocument[]).find((r) =>
              r.id.toLowerCase().startsWith(prefix)
            ) ?? null;
        }
      }

      setDoc(found);
      setLoading(false);
    };

    fetchDoc();
  }, [slug]);

  const handleDownload = async () => {
    if (!doc) return;
    setDownloading(true);
    try {
      const res = await fetch(doc.file_url);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${doc.title}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      window.open(doc.file_url, "_blank");
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Not found OR expired (RLS hides expired rows, so they return null)
  if (!doc) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4 text-center">
        <Helmet>
          <title>Document Unavailable</title>
          <meta name="robots" content="noindex" />
        </Helmet>
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-amber-100 text-amber-600">
          <FileWarning size={40} />
        </div>
        <h1 className="mt-6 text-2xl font-bold text-slate-800">
          This document is no longer available
        </h1>
        <p className="mt-2 max-w-md text-slate-500">
          The link may have expired. Shared PDFs are only available for 24 hours
          after they are posted.
        </p>
        <Link to="/" className="mt-6">
          <Button variant="outline" className="gap-2">
            <Home size={16} /> Back to Home
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 px-4 py-10">
      <Helmet>
        <title>{doc.title}</title>
        <meta name="description" content={`Download ${doc.title} (PDF).`} />
      </Helmet>

      <div className="mx-auto max-w-2xl">
        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-2 text-sm text-slate-500 transition-colors hover:text-slate-800"
        >
          <Home size={16} /> Home
        </Link>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
          {/* Header band */}
          <div className="relative bg-gradient-to-r from-red-500 to-rose-600 px-8 py-10 text-white">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm ring-1 ring-white/30">
                <FileText size={34} />
              </div>
              <div className="min-w-0">
                <span className="inline-block rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide">
                  PDF Document
                </span>
                <h1 className="mt-1 break-words text-2xl font-bold leading-snug">
                  {doc.title}
                </h1>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="p-8">
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
              {doc.file_size && (
                <span className="inline-flex items-center gap-1.5">
                  <FileText size={15} /> {formatSize(doc.file_size)}
                </span>
              )}
              <span className="inline-flex items-center gap-1.5 text-amber-600">
                <Clock size={15} /> Link expires 24h after posting
              </span>
            </div>

            <Button
              onClick={handleDownload}
              disabled={downloading}
              size="lg"
              className="mt-6 w-full gap-2 bg-gradient-to-r from-red-500 to-rose-600 text-base font-semibold hover:from-red-600 hover:to-rose-700"
            >
              {downloading ? (
                <>
                  <Loader2 size={18} className="animate-spin" /> Preparing...
                </>
              ) : (
                <>
                  <Download size={18} /> Download PDF
                </>
              )}
            </Button>

            <p className="mt-4 text-center text-xs text-slate-400">
              Click the button above to download this document to your device.
            </p>
          </div>
        </div>

        {/* Inline preview */}
        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
          <object
            data={`${doc.file_url}#toolbar=0`}
            type="application/pdf"
            className="h-[70vh] w-full"
          >
            <div className="p-8 text-center text-sm text-slate-500">
              Preview not available in this browser.{" "}
              <button
                onClick={handleDownload}
                className="font-semibold text-red-600 underline"
              >
                Download the PDF
              </button>{" "}
              instead.
            </div>
          </object>
        </div>
      </div>
    </div>
  );
};

export default PdfView;
