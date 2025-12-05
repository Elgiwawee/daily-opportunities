import { MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const WhatsAppGroups = () => {
  const groups = [
    { name: "Daily Opportunities Group 1", url: "https://chat.whatsapp.com/HExFL8M75643wWgFz8J2Wk" },
    { name: "Daily Opportunities Group 2", url: "https://chat.whatsapp.com/HqYT7FF4HAZ7taWX3t7LjU" },
    { name: "Daily Opportunities Group 3", url: "https://chat.whatsapp.com/I4IiWpHjlIi4HPf8h0eVss" },
    { name: "WhatsApp Channel", url: "https://whatsapp.com/channel/0029VbAWCijHbFVELXgqdg0i" },
  ];

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

        {/* Services Section */}
        <div className="mt-10 w-full max-w-md">
          <h4 className="text-xl font-bold text-gray-900 mb-4">
            Services We Offer to Candidates
          </h4>
          <ul className="text-left space-y-2 text-gray-700">
            {services.map((service, index) => (
              <li key={index} className="flex items-start">
                <span className="text-green-500 mr-2">•</span>
                {service}
              </li>
            ))}
          </ul>
          <a
            href="https://wa.me/2347040930552"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-6 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition-all transform hover:scale-105"
          >
            <MessageCircle size={20} />
            Message Us
          </a>
        </div>
      </div>
    </motion.div>
  );
};

export default WhatsAppGroups;
