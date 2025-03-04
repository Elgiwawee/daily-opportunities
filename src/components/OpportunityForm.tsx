import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useState } from "react";
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
  deadline: z.date().optional(),
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

interface OpportunityFormProps {
  opportunity?: any;
  onSuccess?: () => void;
}

export function OpportunityForm({ opportunity, onSuccess }: OpportunityFormProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [existingAttachments, setExistingAttachments] = useState<Attachment[]>([]);
  const isEditing = !!opportunity;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      organization: "",
      description: "",
      type: "scholarship",
    },
  });

  useEffect(() => {
    if (opportunity) {
      const deadlineDate = opportunity.deadline ? new Date(opportunity.deadline) : new Date();
      
      form.reset({
        title: opportunity.title || "",
        organization: opportunity.organization || "",
        description: opportunity.description || "",
        type: opportunity.type || "scholarship",
        deadline: deadlineDate,
      });

      if (opportunity.attachments && Array.isArray(opportunity.attachments)) {
        setExistingAttachments(opportunity.attachments as Attachment[]);
      }
    }
  }, [opportunity, form]);

  const onSubmit = async (values: FormValues) => {
    setUploading(true);

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        toast.error("You must be logged in to create an opportunity");
        return;
      }

      let attachments: Attachment[] = [...existingAttachments];

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

      const opportunityData: OpportunityData = {
        ...values,
        attachments
      };

      const jsonAttachments = attachments as unknown as Json;

      let error;

      if (isEditing) {
        const result = await supabase
          .from('opportunities')
          .update({
            title: opportunityData.title,
            organization: opportunityData.organization,
            description: opportunityData.description,
            deadline: values.deadline ? values.deadline.toISOString().split('T')[0] : null,
            type: opportunityData.type,
            attachments: jsonAttachments,
            updated_at: new Date().toISOString()
          })
          .eq('id', opportunity.id);
        error = result.error;
      } else {
        const result = await supabase
          .from('opportunities')
          .insert({
            title: opportunityData.title,
            organization: opportunityData.organization,
            description: opportunityData.description,
            deadline: values.deadline ? values.deadline.toISOString().split('T')[0] : null,
            type: opportunityData.type,
            attachments: jsonAttachments,
            created_by: sessionData.session.user.id
          });
        error = result.error;
      }

      if (error) {
        throw error;
      }

      toast.success(isEditing ? "Opportunity updated successfully!" : "Opportunity created successfully!");
      
      if (!isEditing) {
        form.reset({
          title: "",
          organization: "",
          description: "",
          type: "scholarship",
        });
        setFiles([]);
        setExistingAttachments([]);
      }
      
      if (onSuccess) {
        onSuccess();
      }

    } catch (error: any) {
      console.error("Error with opportunity:", error);
      toast.error(error.message || "Failed to save opportunity");
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

  const removeExistingAttachment = (index: number) => {
    setExistingAttachments((prevAttachments) => prevAttachments.filter((_, i) => i !== index));
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="bg-white p-6 rounded-lg shadow-sm mb-4">
          <h2 className="text-xl font-medium mb-4">{isEditing ? 'Edit Opportunity' : 'Create New Opportunity'}</h2>
          
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
                <FormLabel>Deadline (optional)</FormLabel>
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
                          <span>Pick a date (optional)</span>
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
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  The deadline for applying to this opportunity (optional)
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
                    value={field.value}
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
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="space-y-3">
            <FormLabel>Attachments</FormLabel>
            
            {existingAttachments.length > 0 && (
              <div className="mt-4 mb-6">
                <h4 className="text-sm font-medium mb-2">Existing Attachments:</h4>
                <ul className="space-y-2">
                  {existingAttachments.map((attachment, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
                    >
                      <div className="flex items-center">
                        {attachment.type === 'image' && (
                          <img 
                            src={attachment.url} 
                            alt={attachment.name} 
                            className="w-8 h-8 object-cover mr-2 rounded"
                          />
                        )}
                        <span className="text-sm truncate max-w-[250px]">
                          {attachment.name}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeExistingAttachment(index)}
                      >
                        Remove
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
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
                <h4 className="text-sm font-medium mb-2">New Files to Upload:</h4>
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
          
          <div className="mt-6 flex justify-end">
            <Button type="submit" disabled={uploading}>
              {uploading 
                ? (isEditing ? "Updating..." : "Creating...") 
                : (isEditing ? "Update Opportunity" : "Create Opportunity")}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
