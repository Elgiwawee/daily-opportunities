import { MessageCircle, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';
import { WHATSAPP_GROUPS } from './WhatsAppPopup';

const WhatsAppGroups = () => {
  // Use the centralized WhatsApp groups data
  const groups = WHATSAPP_GROUPS;

  const services = [
    "Senior Certificate",
    "Transcript",
    "Testimonial",
    "Birth Certificate",
    "Medical Certificate",
    "Police Character",
    "English or Arabic CV & Resume",
    "English Proficiency Certificate (TOEFL, IELTS, IELC)",
    "Arabic Proficiency Certificate",
    "Editing",
    "Research",
    "Project",
    "Translation",
    "And more...",
  ];

  return (
    <div className="space-y-8 my-12">
      {/* WhatsApp Groups Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-8"
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

      {/* Services Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-8"
      >
        <div className="flex flex-col items-center text-center">
          <div className="bg-blue-500 w-16 h-16 rounded-full flex items-center justify-center mb-4">
            <Briefcase className="text-white" size={32} />
          </div>
          
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Services We Offer to Candidates
          </h3>
          
          <ul className="mt-6 text-left space-y-2 text-gray-700 w-full max-w-md">
            {services.map((service, index) => (
              <li key={index} className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                {service}
              </li>
            ))}
          </ul>

          <a
            href="https://wa.me/2347040930552"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-6 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-all transform hover:scale-105"
          >
            <MessageCircle size={20} />
            Message Us
          </a>
        </div>
      </motion.div>
    </div>
  );
};

export default WhatsAppGroups;
