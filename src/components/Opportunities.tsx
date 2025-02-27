
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import OpportunityCard from './OpportunityCard';
import { supabase } from '@/integrations/supabase/client';

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
  attachments: Attachment[] | any; // Making it more flexible for different data types
  created_at: string;
}

const Opportunities = () => {
  const [scholarships, setScholarships] = useState<Opportunity[]>([]);
  const [jobs, setJobs] = useState<Opportunity[]>([]);

  useEffect(() => {
    // Initial fetch of opportunities
    fetchOpportunities();
    
    // Set up real-time subscription
    const channel = supabase
      .channel('opportunities-changes')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all changes (insert, update, delete)
          schema: 'public',
          table: 'opportunities'
        },
        (payload) => {
          console.log('Real-time change:', payload);
          // Refresh the opportunities list when any change occurs
          fetchOpportunities();
        }
      )
      .subscribe();

    // Cleanup subscription
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchOpportunities = async () => {
    try {
      const { data, error } = await supabase
        .from('opportunities')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      if (data) {
        const scholarshipsData = data.filter(item => item.type === 'scholarship').map(item => ({
          ...item,
          attachments: item.attachments || [] // Ensure attachments is always an array
        }));
        const jobsData = data.filter(item => item.type === 'job').map(item => ({
          ...item,
          attachments: item.attachments || [] // Ensure attachments is always an array
        }));
        
        setScholarships(scholarshipsData as Opportunity[]);
        setJobs(jobsData as Opportunity[]);
      }
    } catch (error) {
      console.error('Error fetching opportunities:', error);
    }
  };

  return (
    <div className="py-24 bg-gradient-to-b from-purple-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-20" id="scholarships">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-sm font-medium text-indigo-600 mb-2 block">
              Educational Opportunities
            </span>
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              Featured Scholarships
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover scholarships that can help fund your educational journey and achieve your academic goals.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {scholarships.map((scholarship) => (
              <OpportunityCard key={scholarship.id} {...scholarship} />
            ))}
          </div>
        </div>

        <div className="mt-20" id="jobs">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-sm font-medium text-indigo-600 mb-2 block">
              Career Opportunities
            </span>
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              Latest Job Openings
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Find your next career opportunity with leading companies across various industries.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {jobs.map((job) => (
              <OpportunityCard key={job.id} {...job} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Opportunities;
