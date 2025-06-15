
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const HeroSection = () => {
  const { t } = useTranslation();

  return (
    <div className="relative bg-gradient-to-br from-olive-50 to-olive-100 py-20 overflow-hidden">
      <div className="absolute inset-0 bg-white/70 backdrop-blur-sm"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Link
                to="/scholarships"
                className="bg-olive-600 hover:bg-olive-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors shadow-lg hover:shadow-xl transform hover:scale-105 transition-transform inline-block"
              >
                Find Scholarships
              </Link>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Link
                to="/jobs"
                className="bg-white hover:bg-gray-50 text-olive-700 border-2 border-olive-600 px-8 py-4 rounded-lg font-semibold text-lg transition-colors shadow-lg hover:shadow-xl transform hover:scale-105 transition-transform inline-block"
              >
                Explore Jobs
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HeroSection;
