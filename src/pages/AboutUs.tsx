import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';
import AboutSection from '../components/AboutSection';
import AdSenseAd from '../components/AdSenseAd';
import WhatsAppGroups from '../components/WhatsAppGroups';
import Footer from '../components/Footer';
import MobileStickyAd from '../components/MobileStickyAd';

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-white pb-16 md:pb-0">
      <Navbar />
      <div className="pt-36 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 text-center"
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-4">About Us</h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Learn more about Daily Opportunities and our mission to connect students with global opportunities.
            </p>
          </motion.div>
          
          <AdSenseAd variant="in-feed" />
          <WhatsAppGroups />
          <AboutSection />
          <AdSenseAd variant="in-feed" />
        </div>
      </div>
      
      {/* Comprehensive Footer */}
      <Footer />
      
      {/* Mobile Sticky Footer Ad */}
      <MobileStickyAd />
    </div>
  );
};

export default AboutUs;
