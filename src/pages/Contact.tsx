
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';
import ContactSection from '../components/ContactSection';

const Contact = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="pt-36 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 text-center"
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Contact Us</h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Have questions? We're here to help! Reach out to our team for assistance.
            </p>
          </motion.div>
          
          <ContactSection />
        </div>
      </div>
    </div>
  );
};

export default Contact;
