
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";

interface OpportunityFormProps {
  opportunity?: any;
  onSuccess: () => void;
}

const OpportunityForm = ({ opportunity, onSuccess }: OpportunityFormProps) => {
  const [formData, setFormData] = useState({
    title: '',
    organization: '',
    description: '',
    deadline: '',
    type: 'scholarship'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (opportunity) {
      setFormData({
        title: opportunity.title,
        organization: opportunity.organization,
        description: opportunity.description,
        deadline: opportunity.deadline,
        type: opportunity.type
      });
    }
  }, [opportunity]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Not authenticated');
      }

      if (opportunity) {
        const { error } = await supabase
          .from('opportunities')
          .update(formData)
          .eq('id', opportunity.id);

        if (error) throw error;
        toast.success('Opportunity updated successfully!');
      } else {
        const { error } = await supabase
          .from('opportunities')
          .insert([{ ...formData, created_by: user.id }]);

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
            onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as 'scholarship' | 'job' }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="scholarship">Scholarship</option>
            <option value="job">Job Opening</option>
          </select>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
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
