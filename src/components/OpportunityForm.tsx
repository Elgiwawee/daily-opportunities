
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";
import { Image, Video, Upload, Trash, Plus } from 'lucide-react';

type OpportunityType = 'scholarship' | 'job';

interface Attachment {
  name: string;
  url: string;
  type: 'image' | 'video';
  path: string;
}

interface OpportunityData {
  id?: string;
  title: string;
  organization: string;
  description: string;
  deadline: string;
  type: OpportunityType;
  attachments?: Attachment[];
  created_by?: string;
}

interface OpportunityFormProps {
  opportunity?: OpportunityData;
  onSuccess: () => void;
}

const OpportunityForm = ({ opportunity, onSuccess }: OpportunityFormProps) => {
  const [formData, setFormData] = useState<Omit<OpportunityData, 'attachments' | 'created_by'>>({
    title: '',
    organization: '',
    description: '',
    deadline: '',
    type: 'scholarship' as OpportunityType,
  });
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (opportunity) {
      setFormData({
        title: opportunity.title,
        organization: opportunity.organization,
        description: opportunity.description,
        deadline: opportunity.deadline,
        type: opportunity.type,
      });
      setAttachments(opportunity.attachments || []);
    }
  }, [opportunity]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const newAttachments: Attachment[] = [];

    try {
      for (const file of Array.from(files)) {
        const fileType = file.type.startsWith('image/') ? 'image' : 'video';
        if (!['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/webm'].includes(file.type)) {
          toast.error(`Unsupported file type: ${file.type}`);
          continue;
        }

        const filePath = `${crypto.randomUUID()}-${file.name}`;
        const { error: uploadError, data } = await supabase.storage
          .from('opportunity-attachments')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('opportunity-attachments')
          .getPublicUrl(filePath);

        newAttachments.push({
          name: file.name,
          url: publicUrl,
          type: fileType,
          path: filePath
        });
      }

      setAttachments(prev => [...prev, ...newAttachments]);
      toast.success('Files uploaded successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Error uploading files');
    } finally {
      setIsUploading(false);
      // Clear the input
      e.target.value = '';
    }
  };

  const handleRemoveAttachment = async (attachment: Attachment) => {
    try {
      const { error } = await supabase.storage
        .from('opportunity-attachments')
        .remove([attachment.path]);

      if (error) throw error;

      setAttachments(prev => prev.filter(a => a.path !== attachment.path));
      toast.success('File removed successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Error removing file');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Not authenticated');
      }

      const opportunityData: OpportunityData = {
        ...formData,
        attachments,
        created_by: user.id
      };

      if (opportunity?.id) {
        const { error } = await supabase
          .from('opportunities')
          .update(opportunityData)
          .eq('id', opportunity.id);

        if (error) throw error;
        toast.success('Opportunity updated successfully!');
      } else {
        const { error } = await supabase
          .from('opportunities')
          .insert([opportunityData]);

        if (error) throw error;
        toast.success('Opportunity created successfully!');
      }

      onSuccess();
    } catch (error: any) {
      toast.error(error.message || 'Error saving opportunity');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-sm rounded-lg p-6 mb-8">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Organization</label>
          <input
            type="text"
            required
            value={formData.organization}
            onChange={(e) => setFormData(prev => ({ ...prev, organization: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            required
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Deadline</label>
          <input
            type="text"
            required
            value={formData.deadline}
            onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="e.g., March 15, 2024"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Type</label>
          <select
            value={formData.type}
            onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as OpportunityType }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="scholarship">Scholarship</option>
            <option value="job">Job Opening</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Attachments</label>
          <div className="space-y-4">
            {attachments.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {attachments.map((attachment, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-video rounded-lg border border-gray-200 overflow-hidden bg-gray-50">
                      {attachment.type === 'image' ? (
                        <img
                          src={attachment.url}
                          alt={attachment.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <video
                          src={attachment.url}
                          className="w-full h-full object-cover"
                          controls
                        />
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveAttachment(attachment)}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                    <p className="mt-1 text-xs text-gray-500 truncate">{attachment.name}</p>
                  </div>
                ))}
              </div>
            )}
            <div className="flex items-center space-x-4">
              <label className="flex items-center justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none">
                <div className="flex flex-col items-center space-y-2">
                  {isUploading ? (
                    <div className="text-sm text-gray-600">Uploading...</div>
                  ) : (
                    <>
                      <Plus className="w-6 h-6 text-gray-600" />
                      <div className="flex flex-col items-center">
                        <span className="font-medium text-gray-600">Add files</span>
                        <span className="text-xs text-gray-500">Images or Videos</span>
                      </div>
                    </>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/gif,video/mp4,video/webm"
                  multiple
                  className="hidden"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                />
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting || isUploading}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : opportunity ? 'Update Opportunity' : 'Create Opportunity'}
          </button>
        </div>
      </div>
    </form>
  );
};

export default OpportunityForm;
