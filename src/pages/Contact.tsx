import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';
import ContactSection from '../components/ContactSection';
import AdSenseAd from '../components/AdSenseAd';
import WhatsAppGroups from '../components/WhatsAppGroups';
import Footer from '../components/Footer';
import MobileStickyAd from '../components/MobileStickyAd';

const Contact = () => {
  return (
    <div className="min-h-screen bg-white pb-16 md:pb-0">
      <Navbar />
      <div className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AdSenseAd variant="in-feed" />
          <WhatsAppGroups />
          <ContactSection />
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

export default Contact;
