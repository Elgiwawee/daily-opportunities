
import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Trash2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import { toast } from "sonner";

interface Attachment {
  name: string;
  url: string;
  type: 'image' | 'video';
  path: string;
}

interface Opportunity {
  id: string;
  title: string;
  organization: string;
  deadline: string;
  type: 'scholarship' | 'job';
  description: string;
  attachments: Attachment[];
  created_at: string;
}

const OpportunityDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [opportunity, setOpportunity] = useState<Opportunity | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOpportunity = async () => {
      try {
        const { data, error } = await supabase
          .from('opportunities')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        
        // Convert JSON attachments to the correct type
        const formattedData = {
          ...data,
          attachments: data.attachments || []
        } as Opportunity;
        
        setOpportunity(formattedData);
      } catch (error) {
        console.error('Error fetching opportunity:', error);
        toast.error('Error loading opportunity');
      } finally {
        setLoading(false);
      }
    };

    fetchOpportunity();
  }, [id]);

  const handleDelete = async () => {
    if (!opportunity || !window.confirm('Are you sure you want to delete this opportunity?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('opportunities')
        .delete()
        .eq('id', opportunity.id);

      if (error) throw error;

      // If there are attachments, delete them from storage
      if (opportunity.attachments?.length > 0) {
        const paths = opportunity.attachments.map(attachment => attachment.path);
        const { error: storageError } = await supabase.storage
          .from('opportunity-attachments')
          .remove(paths);

        if (storageError) throw storageError;
      }

      toast.success('Opportunity deleted successfully');
      navigate('/');
    } catch (error: any) {
      console.error('Error deleting opportunity:', error);
      toast.error(error.message || 'Error deleting opportunity');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="animate-pulse">Loading...</div>
        </div>
      </div>
    );
  }

  if (!opportunity) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">Opportunity not found</h2>
            <Link to="/" className="text-indigo-600 hover:text-indigo-700 mt-4 inline-block">
              Return to home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="flex justify-between items-center mb-8">
          <Link to="/" className="inline-flex items-center text-indigo-600 hover:text-indigo-700">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to opportunities
          </Link>
          <button
            onClick={handleDelete}
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-md hover:from-red-600 hover:to-red-700 transition-colors shadow-md hover:shadow-lg"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Opportunity
          </button>
        </div>

        <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-100">
          {opportunity.attachments?.length > 0 && opportunity.attachments[0].type === 'image' && (
            <div className="aspect-video w-full overflow-hidden">
              <img
                src={opportunity.attachments[0].url}
                alt={opportunity.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <span className={`px-4 py-1.5 rounded-full text-sm font-medium ${
                opportunity.type === 'scholarship' 
                  ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white' 
                  : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white'
              }`}>
                {opportunity.type === 'scholarship' ? 'Scholarship' : 'Job Opening'}
              </span>
              <span className="text-sm text-gray-500">Deadline: {opportunity.deadline}</span>
            </div>

            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 mb-4">
              {opportunity.title}
            </h1>
            <p className="text-lg text-gray-600 mb-6">{opportunity.organization}</p>
            
            <div className="prose max-w-none">
              <p className="whitespace-pre-wrap text-gray-700">{opportunity.description}</p>
            </div>

            {opportunity.attachments && opportunity.attachments.length > 0 && (
              <div className="mt-8 border-t border-gray-100 pt-8">
                <h2 className="text-xl font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                  Attachments
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {opportunity.attachments.map((attachment, index) => (
                    <a
                      key={index}
                      href={attachment.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block group"
                    >
                      {attachment.type === 'image' ? (
                        <div className="aspect-video rounded-lg overflow-hidden bg-gray-100 shadow-md hover:shadow-lg transition-shadow">
                          <img
                            src={attachment.url}
                            alt={attachment.name}
                            className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
                          />
                        </div>
                      ) : (
                        <div className="aspect-video rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center shadow-md hover:shadow-lg transition-shadow">
                          <video
                            src={attachment.url}
                            className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
                          />
                        </div>
                      )}
                      <p className="mt-2 text-sm text-gray-600 truncate">{attachment.name}</p>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpportunityDetails;
