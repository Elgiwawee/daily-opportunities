import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { generateSlug } from "@/utils/slugUtils";
import {
  FileText,
  Upload,
  Copy,
  Trash2,
  Share2,
  Clock,
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

const timeLeft = (expiresAt: string) => {
  const diff = new Date(expiresAt).getTime() - Date.now();
  if (diff <= 0) return "Expired";
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}h ${minutes}m left`;
};

export const PdfManager = () => {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [docs, setDocs] = useState<PdfDocument[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDocs = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("pdf_documents")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      toast.error("Failed to load PDFs");
    } else {
      setDocs((data as PdfDocument[]) || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const getShareUrl = (doc: PdfDocument) =>
    `${window.location.origin}/pdf/${generateSlug(doc.title)}-${doc.id.substring(0, 8)}`;

  const handleUpload = async () => {
    if (!title.trim()) {
      toast.error("Please enter a title");
      return;
    }
    if (!file) {
      toast.error("Please choose a PDF file");
      return;
    }
    if (file.type !== "application/pdf") {
      toast.error("Only PDF files are allowed");
      return;
    }

    setUploading(true);
    try {
      const filePath = `pdfs/${uuidv4()}.pdf`;
      const { error: uploadError } = await supabase.storage
        .from("opportunity-attachments")
        .upload(filePath, file, { contentType: "application/pdf" });
      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("opportunity-attachments")
        .getPublicUrl(filePath);

      const { data: sessionData } = await supabase.auth.getSession();

      const { error: insertError } = await supabase.from("pdf_documents").insert({
        title: title.trim(),
        file_url: urlData.publicUrl,
        file_path: filePath,
        file_size: file.size,
        created_by: sessionData.session?.user.id ?? null,
      });
      if (insertError) throw insertError;

      toast.success("PDF uploaded! It will be available for 24 hours.");
      setTitle("");
      setFile(null);
      (document.getElementById("pdf-file-input") as HTMLInputElement | null)?.value &&
        ((document.getElementById("pdf-file-input") as HTMLInputElement).value = "");
      fetchDocs();
    } catch (err: any) {
      toast.error(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleCopy = async (doc: PdfDocument) => {
    try {
      await navigator.clipboard.writeText(getShareUrl(doc));
      toast.success("Link copied to clipboard!");
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const handleShare = async (doc: PdfDocument) => {
    const url = getShareUrl(doc);
    if (navigator.share) {
      try {
        await navigator.share({ title: doc.title, url });
      } catch {
        /* user cancelled */
      }
    } else {
      handleCopy(doc);
    }
  };

  const handleDelete = async (doc: PdfDocument) => {
    if (!confirm(`Delete "${doc.title}"?`)) return;
    await supabase.storage.from("opportunity-attachments").remove([doc.file_path]);
    const { error } = await supabase.from("pdf_documents").delete().eq("id", doc.id);
    if (error) {
      toast.error("Failed to delete");
    } else {
      toast.success("PDF deleted");
      fetchDocs();
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload card */}
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 text-red-600">
            <FileText size={20} />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Upload a PDF</h3>
            <p className="text-sm text-muted-foreground">
              Shareable link expires automatically after 24 hours.
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="pdf-title">PDF Title</Label>
            <Input
              id="pdf-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Scholarship Application Guide"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pdf-file-input">PDF File</Label>
            <Input
              id="pdf-file-input"
              type="file"
              accept="application/pdf"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
          </div>
        </div>

        <Button onClick={handleUpload} disabled={uploading} className="mt-4 gap-2">
          {uploading ? (
            <>
              <Loader2 size={16} className="animate-spin" /> Uploading...
            </>
          ) : (
            <>
              <Upload size={16} /> Upload PDF
            </>
          )}
        </Button>
      </div>

      {/* List */}
      <div>
        <h3 className="mb-3 text-lg font-semibold">Shared PDFs</h3>
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading...</p>
        ) : docs.length === 0 ? (
          <p className="text-sm text-muted-foreground">No PDFs uploaded yet.</p>
        ) : (
          <div className="space-y-3">
            {docs.map((doc) => {
              const expired = new Date(doc.expires_at).getTime() <= Date.now();
              return (
                <div
                  key={doc.id}
                  className="flex flex-col gap-3 rounded-lg border bg-card p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-600">
                      <FileText size={22} />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-medium">{doc.title}</p>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                        {doc.file_size && <span>{formatSize(doc.file_size)}</span>}
                        <span
                          className={`inline-flex items-center gap-1 ${
                            expired ? "text-destructive" : "text-amber-600"
                          }`}
                        >
                          <Clock size={12} /> {timeLeft(doc.expires_at)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1"
                      onClick={() => handleCopy(doc)}
                    >
                      <Copy size={14} /> Copy link
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1"
                      onClick={() => handleShare(doc)}
                    >
                      <Share2 size={14} /> Share
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="gap-1"
                      onClick={() => handleDelete(doc)}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default PdfManager;
