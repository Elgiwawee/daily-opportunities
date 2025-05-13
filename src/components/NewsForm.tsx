
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, UploadCloud } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

// Define the form schema
const formSchema = z.object({
  subject: z.string().min(1, "Subject is required"),
  body: z.string().min(1, "News content is required"),
});

type FormValues = z.infer<typeof formSchema>;

interface NewsFormProps {
  onSuccess: () => void;
  newsItem?: {
    id: string;
    subject: string;
    body: string;
    attachments: any[];
  } | null;
}

export function NewsForm({ onSuccess, newsItem }: NewsFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [existingAttachments, setExistingAttachments] = useState<any[]>(
    newsItem?.attachments || []
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subject: newsItem?.subject || "",
      body: newsItem?.body || "",
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileList = Array.from(e.target.files);
      setAttachments([...attachments, ...fileList]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const removeExistingAttachment = (index: number) => {
    setExistingAttachments(existingAttachments.filter((_, i) => i !== index));
  };

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);

    try {
      // Process any new attachments
      const uploadedAttachments = [];

      // Upload any new files
      for (const file of attachments) {
        try {
          const fileName = `${uuidv4()}-${file.name}`;
          const fileExtension = fileName.split('.').pop()?.toLowerCase();
          
          // Determine content type
          let contentType = 'application/octet-stream';
          if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension || '')) {
            contentType = `image/${fileExtension}`;
          } else if (['mp4', 'webm'].includes(fileExtension || '')) {
            contentType = `video/${fileExtension}`;
          }

          // Convert file to base64 for storing directly in Supabase
          const reader = new FileReader();
          const base64Promise = new Promise<string>((resolve) => {
            reader.onload = (e) => {
              const base64 = e.target?.result as string;
              resolve(base64);
            };
          });
          
          reader.readAsDataURL(file);
          const base64Data = await base64Promise;

          uploadedAttachments.push({
            name: fileName,
            type: contentType,
            url: base64Data,
            size: file.size
          });
        } catch (error) {
          console.error("Error uploading file:", error);
          toast.error(`Failed to upload ${file.name}`);
        }
      }

      const finalAttachments = [...existingAttachments, ...uploadedAttachments];

      if (newsItem) {
        // Update existing news item
        const { error } = await supabase
          .from('news_items')
          .update({
            subject: values.subject,
            body: values.body,
            attachments: finalAttachments,
          })
          .eq('id', newsItem.id);

        if (error) throw error;
        toast.success("News item updated successfully!");
      } else {
        // Create new news item
        const { error } = await supabase.from('news_items').insert({
          subject: values.subject,
          body: values.body,
          attachments: finalAttachments,
        });

        if (error) throw error;
        toast.success("News item created successfully!");
      }

      onSuccess();
      form.reset();
      setAttachments([]);
      setExistingAttachments([]);
      setIsSubmitting(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to save news item");
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subject</FormLabel>
              <FormControl>
                <Input placeholder="News title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="body"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Write your news content here..."
                  className="min-h-[200px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <FormLabel className="block">Attachments</FormLabel>
          <div className="border-2 border-dashed border-gray-300 rounded-md p-6">
            <div className="flex flex-col items-center">
              <UploadCloud className="h-10 w-10 text-gray-400 mb-2" />
              <p className="text-sm text-gray-500 mb-2">
                Upload images or videos for your news
              </p>
              <div className="mt-2">
                <Input
                  id="file-upload"
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={handleFileChange}
                  className="sr-only"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Select Files
                </label>
              </div>
            </div>
          </div>

          {/* Preview existing attachments */}
          {existingAttachments.length > 0 && (
            <div className="mt-4">
              <h3 className="font-medium text-sm">Existing Attachments:</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-2">
                {existingAttachments.map((attachment, index) => (
                  <div
                    key={index}
                    className="relative border rounded-md p-2 overflow-hidden"
                  >
                    {attachment.type?.startsWith("image/") ? (
                      <img
                        src={attachment.url}
                        alt={attachment.name}
                        className="w-full h-20 object-cover"
                      />
                    ) : attachment.type?.startsWith("video/") ? (
                      <video
                        controls
                        className="w-full h-20 object-cover"
                        src={attachment.url}
                      />
                    ) : (
                      <div className="w-full h-20 flex items-center justify-center bg-gray-100">
                        {attachment.name}
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => removeExistingAttachment(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Preview new attachments */}
          {attachments.length > 0 && (
            <div className="mt-4">
              <h3 className="font-medium text-sm">New Attachments:</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-2">
                {attachments.map((file, index) => (
                  <div
                    key={index}
                    className="relative border rounded-md p-2 overflow-hidden"
                  >
                    {file.type.startsWith("image/") ? (
                      <img
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        className="w-full h-20 object-cover"
                      />
                    ) : file.type.startsWith("video/") ? (
                      <video
                        controls
                        className="w-full h-20 object-cover"
                        src={URL.createObjectURL(file)}
                      />
                    ) : (
                      <div className="w-full h-20 flex items-center justify-center bg-gray-100">
                        {file.name}
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => removeAttachment(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : newsItem ? (
            "Update News"
          ) : (
            "Create News"
          )}
        </Button>
      </form>
    </Form>
  );
}
