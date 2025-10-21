
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Calendar, Clock, MapPin, ExternalLink, Download, X } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';

interface Opportunity {
  id: string;
  title: string;
  organization: string;
  deadline: string | null;
  type: 'scholarship' | 'job';
  description: string;
  attachments: any[] | null;
  created_at: string;
  external_url?: string | null;
}

interface Attachment {
  name: string;
  url: string;
  type: string;
  path: string;
}

interface OpportunityModalProps {
  opportunityId: string;
  isOpen: boolean;
  onClose: () => void;
}

const OpportunityModal = ({ opportunityId, isOpen, onClose }: OpportunityModalProps) => {
  const { t } = useTranslation();

  const fetchOpportunity = async () => {
    const { data, error } = await supabase
      .from('opportunities')
      .select('*')
      .eq('id', opportunityId)
      .single();
    
    if (error) {
      console.error('Error fetching opportunity:', error);
      toast.error('Failed to load opportunity details');
      throw error;
    }
    
    return data as Opportunity;
  };

  const { data: opportunity, isLoading, error } = useQuery({
    queryKey: ['opportunity', opportunityId],
    queryFn: fetchOpportunity,
    enabled: !!opportunityId && isOpen,
  });

  const hasAttachments = (attachments: any[] | null): attachments is Attachment[] => {
    return Array.isArray(attachments) && 
           attachments.length > 0 && 
           typeof attachments[0] === 'object' &&
           'name' in attachments[0] &&
           'url' in attachments[0];
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="sticky top-0 bg-white border-b flex justify-between items-center p-4">
            <h2 className="text-xl font-bold">Opportunity Details</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="p-6">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-olive-600"></div>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Error loading details</h3>
                <p className="text-gray-600">Please try again later.</p>
              </div>
            ) : opportunity ? (
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{opportunity.title}</h1>
                <div className="text-lg text-olive-600 font-semibold mb-6">
                  {opportunity.organization}
                </div>
                
                <div className="flex flex-wrap gap-4 mb-8 text-sm text-gray-500">
                  {opportunity.deadline && (
                    <div className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4" />
                      <span>Deadline: {new Date(opportunity.deadline).toLocaleDateString()}</span>
                    </div>
                  )}
                  <div className="flex items-center">
                    <Clock className="mr-2 h-4 w-4" />
                    <span>Posted {formatDistanceToNow(new Date(opportunity.created_at), { addSuffix: true })}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="mr-2 h-4 w-4" />
                    <span>{opportunity.type === 'scholarship' ? 'Scholarship' : 'Job'}</span>
                  </div>
                </div>
                
                <div className="prose max-w-none mb-8">
                  <h3 className="text-xl font-semibold mb-4">Description</h3>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{opportunity.description}</p>
                </div>
                
                {opportunity.external_url && (
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold mb-4">Apply Now</h3>
                    <Button asChild className="bg-olive-600 hover:bg-olive-700">
                      <a href={opportunity.external_url} target="_blank" rel="noopener noreferrer" className="flex items-center">
                        Click here to apply
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                )}
                
                {hasAttachments(opportunity.attachments) && opportunity.attachments.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold mb-4">Attachments</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {opportunity.attachments.map((attachment, index) => (
                        <Card key={index} className="p-4 flex items-center justify-between">
                          <div className="flex items-center">
                            <Download className="h-5 w-5 text-olive-600 mr-3" />
                            <div>
                              <div className="font-medium">{attachment.name}</div>
                              <div className="text-sm text-gray-500">{attachment.type}</div>
                            </div>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            asChild
                            className="ml-2"
                          >
                            <a 
                              href={attachment.url} 
                              download={attachment.name}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Download
                            </a>
                          </Button>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default OpportunityModal;
