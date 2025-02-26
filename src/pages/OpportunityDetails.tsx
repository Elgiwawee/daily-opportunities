
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft } from 'lucide-react';
import Navbar from '../components/Navbar';

interface Opportunity {
  id: string;
  title: string;
  organization: string;
  deadline: string;
  type: 'scholarship' | 'job';
  description: string;
  attachments?: Array<{
    name: string;
    url: string;
    type: 'image' | 'video';
    path: string;
  }>;
  created_at: string;
}

const OpportunityDetails = () => {
  const { id } = useParams();
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
        setOpportunity(data);
      } catch (error) {
        console.error('Error fetching opportunity:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOpportunity();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="animate-pulse">Loading...</div>
        </div>
      </div>
    );
  }

  if (!opportunity) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">Opportunity not found</h2>
            <Link to="/" className="text-indigo-600 hover:text-indigo-500 mt-4 inline-block">
              Return to home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <Link to="/" className="inline-flex items-center text-indigo-600 hover:text-indigo-500 mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to opportunities
        </Link>

        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
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
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                opportunity.type === 'scholarship' 
                  ? 'bg-purple-50 text-purple-700' 
                  : 'bg-emerald-50 text-emerald-700'
              }`}>
                {opportunity.type === 'scholarship' ? 'Scholarship' : 'Job Opening'}
              </span>
              <span className="text-sm text-gray-500">Deadline: {opportunity.deadline}</span>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">{opportunity.title}</h1>
            <p className="text-lg text-gray-600 mb-6">{opportunity.organization}</p>
            
            <div className="prose max-w-none">
              <p className="whitespace-pre-wrap">{opportunity.description}</p>
            </div>

            {opportunity.attachments && opportunity.attachments.length > 0 && (
              <div className="mt-8 border-t pt-8">
                <h2 className="text-xl font-semibold mb-4">Attachments</h2>
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
                        <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
                          <img
                            src={attachment.url}
                            alt={attachment.name}
                            className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
                          />
                        </div>
                      ) : (
                        <div className="aspect-video rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
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
