
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Upload } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";
import { Json } from "@/integrations/supabase/types";

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  organization: z.string().min(2, {
    message: "Organization must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  deadline: z.date({
    required_error: "A deadline is required.",
  }),
  type: z.enum(["scholarship", "job"], {
    required_error: "You need to select an opportunity type.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

interface Attachment {
  name: string;
  url: string;
  type: 'image' | 'video';
  path: string;
}

interface OpportunityData extends FormValues {
  attachments: Attachment[];
}

export function OpportunityForm() {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      organization: "",
      description: "",
      type: "scholarship",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setUploading(true);

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        toast.error("You must be logged in to create an opportunity");
        return;
      }

      const attachments: Attachment[] = [];

      // Upload files if there are any
      if (files.length > 0) {
        for (const file of files) {
          const fileExt = file.name.split('.').pop();
          const fileName = `${uuidv4()}.${fileExt}`;
          const filePath = `${fileName}`;
          
          const { error: uploadError } = await supabase.storage
            .from('opportunity-attachments')
            .upload(filePath, file);

          if (uploadError) {
            throw uploadError;
          }

          const { data } = supabase.storage
            .from('opportunity-attachments')
            .getPublicUrl(filePath);

          const fileType = file.type.startsWith('image/') ? 'image' : 'video';

          attachments.push({
            name: file.name,
            url: data.publicUrl,
            type: fileType,
            path: filePath
          });
        }
      }

      // Create the opportunity data with attachments
      const opportunityData: OpportunityData = {
        ...values,
        attachments
      };

      // Convert attachments to a JSON-compatible format
      const jsonAttachments = attachments as unknown as Json;

      // Insert into the database
      const { error } = await supabase
        .from('opportunities')
        .insert({
          title: opportunityData.title,
          organization: opportunityData.organization,
          description: opportunityData.description,
          deadline: opportunityData.deadline.toISOString().split('T')[0],
          type: opportunityData.type,
          attachments: jsonAttachments,
          created_by: sessionData.session.user.id
        });

      if (error) {
        throw error;
      }

      toast.success("Opportunity created successfully!");
      // Reset the form
      form.reset({
        title: "",
        organization: "",
        description: "",
        type: "scholarship",
      });
      setFiles([]);

    } catch (error: any) {
      console.error("Error creating opportunity:", error);
      toast.error(error.message || "Failed to create opportunity");
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter opportunity title" {...field} />
              </FormControl>
              <FormDescription>
                A clear, concise title for the opportunity
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="organization"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Organization</FormLabel>
              <FormControl>
                <Input placeholder="Enter organization name" {...field} />
              </FormControl>
              <FormDescription>
                The name of the company or institution
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter opportunity details"
                  className="resize-y min-h-32"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Detailed information about the opportunity
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="deadline"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Deadline</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date < new Date(new Date().setHours(0, 0, 0, 0))
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>
                The deadline for applying to this opportunity
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Opportunity Type</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="scholarship" />
                    </FormControl>
                    <FormLabel className="font-normal">Scholarship</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="job" />
                    </FormControl>
                    <FormLabel className="font-normal">Job Opening</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-3">
          <FormLabel>Attachments</FormLabel>
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="dropzone-file"
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-8 h-8 mb-3 text-gray-500" />
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-xs text-gray-500">
                  Images or supporting documents
                </p>
              </div>
              <input
                id="dropzone-file"
                type="file"
                className="hidden"
                multiple
                onChange={handleFileChange}
              />
            </label>
          </div>
          {files.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">Selected Files:</h4>
              <ul className="space-y-2">
                {files.map((file, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
                  >
                    <span className="text-sm truncate max-w-[250px]">
                      {file.name}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                    >
                      Remove
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <Button type="submit" disabled={uploading}>
          {uploading ? "Creating..." : "Create Opportunity"}
        </Button>
      </form>
    </Form>
  );
}
