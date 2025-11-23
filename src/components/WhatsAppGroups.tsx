import { MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const WhatsAppGroups = () => {
  const groups = [
    { name: "Daily Opportunities Group 1", url: "https://chat.whatsapp.com/group1" },
    { name: "Daily Opportunities Group 2", url: "https://chat.whatsapp.com/group2" },
    { name: "Daily Opportunities Group 3", url: "https://chat.whatsapp.com/group3" },
    { name: "Daily Opportunities Group 4", url: "https://chat.whatsapp.com/group4" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-8 my-12"
    >
      <div className="flex flex-col items-center text-center">
        <div className="bg-green-500 w-16 h-16 rounded-full flex items-center justify-center mb-4">
          <MessageCircle className="text-white" size={32} />
        </div>
        
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Join any of these WhatsApp Groups to receive Scholarship alerts on WhatsApp
        </h3>
        
        <ul className="mt-6 space-y-3 w-full max-w-md">
          {groups.map((group, index) => (
            <li key={index}>
              <a
                href={group.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-white hover:bg-green-50 text-green-700 font-semibold py-3 px-6 rounded-lg border-2 border-green-300 hover:border-green-500 transition-all transform hover:scale-105"
              >
                {group.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
};

export default WhatsAppGroups;
