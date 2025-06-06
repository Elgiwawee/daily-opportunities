
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';
import ContactSection from '../components/ContactSection';

const Contact = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ContactSection />
        </div>
      </div>
    </div>
  );
};

export default Contact;
