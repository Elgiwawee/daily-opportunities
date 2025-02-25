
import { motion } from 'framer-motion';

interface OpportunityCardProps {
  title: string;
  organization: string;
  deadline: string;
  type: 'scholarship' | 'job';
  description: string;
}

const OpportunityCard = ({
  title,
  organization,
  deadline,
  type,
  description,
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
        
        <div className="mt-4">
          <button className="text-sm font-medium text-gray-900 hover:text-gray-700 transition-colors">
            Learn More →
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default OpportunityCard;
