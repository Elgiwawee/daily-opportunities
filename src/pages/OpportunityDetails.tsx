import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Trash2, Share2, Facebook, Twitter, Instagram, ExternalLink, Pencil } from 'lucide-react';
import Navbar from '../components/Navbar';
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

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
  external_url: string | null;
}

const OpportunityDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [opportunity, setOpportunity] = useState<Opportunity | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  useEffect(() => {
    const checkIfAdmin = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAdmin(!!session);
    };

    checkIfAdmin();
    fetchOpportunity();
  }, [id]);

  const fetchOpportunity = async () => {
    try {
      const { data, error } = await supabase
        .from('opportunities')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      
      const formattedData = {
        ...data,
        attachments: Array.isArray(data.attachments) ? data.attachments : [],
        external_url: data.external_url || null
      } as unknown as Opportunity;
      
      setOpportunity(formattedData);
      console.log("Fetched opportunity:", formattedData);
    } catch (error) {
      console.error('Error fetching opportunity:', error);
      toast.error('Error loading opportunity');
    } finally {
      setLoading(false);
    }
  };

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

  const handleEdit = () => {
    navigate(`/admin?edit=${opportunity?.id}`);
  };

  const handleShare = (platform: string) => {
    if (!opportunity) return;
    
    const url = window.location.href;
    const title = opportunity.title;
    const description = opportunity.description.substring(0, 100) + '...';
    
    const imageUrl = opportunity.attachments && opportunity.attachments.length > 0 && opportunity.attachments[0].type === 'image'
      ? opportunity.attachments[0].url
      : `${window.location.origin}/${opportunity.type === 'scholarship' 
          ? 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1' 
          : 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40'}`;
    
    let shareUrl = '';
    
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(title)}&picture=${encodeURIComponent(imageUrl)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(title + ' - ' + url)}`;
        break;
      case 'instagram':
        toast.info("Instagram sharing requires the mobile app");
        return;
      default:
        navigator.clipboard.writeText(url).then(() => {
          toast.success('Link copied to clipboard!');
        });
        return;
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400');
    setShareOpen(false);
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex justify-between items-center mb-8">
          <Link to="/" className="inline-flex items-center text-indigo-600 hover:text-indigo-700">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to opportunities
          </Link>
          
          <div className="flex gap-3">
            <div className="relative">
              <Button
                onClick={() => setShareOpen(!shareOpen)}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                Share
              </Button>
              
              {shareOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-100">
                  <div className="py-1">
                    <button
                      onClick={() => handleShare('facebook')}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50"
                    >
                      <Facebook className="w-4 h-4 mr-3 text-blue-600" />
                      Facebook
                    </button>
                    <button
                      onClick={() => handleShare('twitter')}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50"
                    >
                      <Twitter className="w-4 h-4 mr-3 text-blue-400" />
                      Twitter
                    </button>
                    <button
                      onClick={() => handleShare('whatsapp')}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50"
                    >
                      <svg 
                        className="w-4 h-4 mr-3 text-green-500" 
                        viewBox="0 0 24 24" 
                        fill="currentColor"
                      >
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      WhatsApp
                    </button>
                    <button
                      onClick={() => handleShare('instagram')}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50"
                    >
                      <Instagram className="w-4 h-4 mr-3 text-pink-500" />
                      Instagram
                    </button>
                    <button
                      onClick={() => handleShare('copy')}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50"
                    >
                      <svg 
                        className="w-4 h-4 mr-3 text-gray-500" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Copy Link
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {isAdmin && (
              <div className="flex gap-3">
                <Button
                  onClick={handleEdit}
                  className="flex items-center gap-2"
                  variant="default"
                >
                  <Pencil className="w-4 h-4" />
                  Edit
                </Button>
                <Button
                  onClick={handleDelete}
                  className="flex items-center gap-2"
                  variant="destructive"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </Button>
              </div>
            )}
          </div>
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

            {opportunity.external_url && (
              <div className="mt-8">
                <Button
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
                  size="lg"
                  asChild
                >
                  <a 
                    href={opportunity.external_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Apply Now
                  </a>
                </Button>
              </div>
            )}

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

