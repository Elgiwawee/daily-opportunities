
import { motion } from 'framer-motion';
import { Image, Video, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

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
}

const OpportunityCard = ({
  id,
  title,
  organization,
  deadline,
  type,
  description,
  attachments = [],
}: OpportunityCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100"
    >
      {attachments.length > 0 && attachments[0].type === 'image' && (
        <div className="aspect-video w-full overflow-hidden">
          <img
            src={attachments[0].url}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            type === 'scholarship' 
              ? 'bg-purple-50 text-purple-700' 
              : 'bg-emerald-50 text-emerald-700'
          }`}>
            {type === 'scholarship' ? 'Scholarship' : 'Job Opening'}
          </span>
          <span className="text-sm text-gray-500">Deadline: {deadline}</span>
        </div>
        
        <h3 className="text-xl font-semibold mb-2 text-gray-900">{title}</h3>
        <p className="text-sm text-gray-600 mb-3">{organization}</p>
        <p className="text-gray-700 line-clamp-3">{description}</p>
        
        {attachments.length > 0 && (
          <div className="mt-4 flex items-center gap-2">
            <span className="text-sm text-gray-500">Attachments:</span>
            <div className="flex items-center gap-1">
              {attachments.map((attachment, index) => (
                <a
                  key={index}
                  href={attachment.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-gray-700"
                >
                  {attachment.type === 'image' ? (
                    <Image className="w-4 h-4" />
                  ) : (
                    <Video className="w-4 h-4" />
                  )}
                </a>
              ))}
            </div>
          </div>
        )}
        
        <div className="mt-4 flex justify-between items-center">
          <Link
            to={`/opportunity/${id}`}
            className="text-sm font-medium text-gray-900 hover:text-gray-700 transition-colors"
          >
            Learn More →
          </Link>
          
          {type === 'scholarship' && (
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1 text-purple-700 border-purple-200 hover:bg-purple-50"
              asChild
            >
              <Link to={`/opportunity/${id}`}>
                <ExternalLink className="w-4 h-4" />
                Apply Now
              </Link>
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default OpportunityCard;
