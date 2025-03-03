
import { motion } from 'framer-motion';
import { Image, Video, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

interface Attachment {
  name: string;
  url: string;
  type: 'image' | 'video';
  path: string;
}

interface OpportunityCardProps {
  id: string;
  title: string;
  organization: string;
  deadline: string;
  type: 'scholarship' | 'job';
  description: string;
  attachments?: Attachment[];
  featured?: boolean;
  applicationUrl?: string;
}

const OpportunityCard = ({
  id,
  title,
  organization,
  deadline,
  type,
  description,
  attachments = [],
  featured = false,
  applicationUrl,
}: OpportunityCardProps) => {
  // Try to parse the deadline to a readable format
  let formattedDate = deadline;
  try {
    // Assuming deadline is stored in ISO format
    const date = new Date(deadline);
    if (!isNaN(date.getTime())) {
      formattedDate = format(date, 'MMMM d, yyyy');
    }
  } catch (e) {
    // If parsing fails, use the original string
    console.log('Date parsing failed for:', deadline);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className={`overflow-hidden border border-gray-200 rounded-lg shadow-sm hover:shadow-md ${featured ? 'col-span-1 md:col-span-2 lg:col-span-1' : ''}`}
    >
      <div className="relative aspect-video w-full overflow-hidden">
        {attachments.length > 0 && attachments[0].type === 'image' ? (
          <img
            src={attachments[0].url}
            alt={title}
            className="w-full h-full object-cover"
          />
        ) : (
          <img
            src={type === 'scholarship' 
              ? 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1' 
              : 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40'}
            alt={title}
            className="w-full h-full object-cover"
          />
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-4">
          <h3 className="text-lg md:text-xl font-bold text-white">{title}</h3>
        </div>
        
        <div className={`absolute top-2 left-2 px-3 py-1 text-xs font-semibold text-white rounded ${
          type === 'scholarship' ? 'bg-blue-700' : 'bg-green-700'
        }`}>
          {type === 'scholarship' ? 'Scholarship' : 'Job Opening'}
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-gray-700">{organization}</span>
          <span className="text-xs text-gray-500">{formattedDate}</span>
        </div>
        
        <p className="text-gray-700 text-sm mb-4 line-clamp-2">{description}</p>
        
        <div className="flex justify-between items-center mt-2">
          <Link
            to={`/opportunity/${id}`}
            className="text-sm font-medium text-blue-700 hover:underline"
          >
            {type === 'scholarship' ? 'How to Apply' : 'View Details'}
          </Link>
          
          {type === 'scholarship' && (
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1 text-blue-700 border-blue-200 hover:bg-blue-50"
              asChild
            >
              {applicationUrl ? (
                <a href={applicationUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-3 h-3" />
                  Apply Now
                </a>
              ) : (
                <Link to={`/opportunity/${id}`}>
                  <ExternalLink className="w-3 h-3" />
                  Apply Now
                </Link>
              )}
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default OpportunityCard;
