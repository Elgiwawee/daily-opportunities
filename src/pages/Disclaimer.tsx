import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import AdSenseAd from '../components/AdSenseAd';
import Footer from '../components/Footer';
import MobileStickyAd from '../components/MobileStickyAd';

const Disclaimer = () => {
  return (
    <div className="min-h-screen bg-white pb-16 md:pb-0">
      <Navbar />
      <div className="pt-36 pb-12 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <AdSenseAd variant="in-feed" />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 text-center"
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Disclaimer
            </h1>
            <div className="h-1 w-24 bg-olive-500 mx-auto mb-8"></div>
          </motion.div>

          <div className="prose prose-lg max-w-none">
            <p className="mb-6">
              The information provided on Daily Opportunities is for general informational purposes only. All information on the site is provided in good faith; however, we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the site.
            </p>
            
            <p className="mb-6">
              Under no circumstance shall we have any liability to you for any loss or damage of any kind incurred as a result of the use of the site or reliance on any information provided on the site. Your use of the site and your reliance on any information on the site is solely at your own risk.
            </p>
            
            <h2 className="text-xl font-semibold mb-4 mt-8">External Links Disclaimer</h2>
            <p className="mb-6">
              The site may contain links to external websites that are not provided or maintained by or in any way affiliated with Daily Opportunities. Please note that Daily Opportunities does not guarantee the accuracy, relevance, timeliness, or completeness of any information on these external websites.
            </p>
            
            <h2 className="text-xl font-semibold mb-4 mt-8">Scholarships and Job Opportunities</h2>
            <p className="mb-6">
              We strive to provide accurate and up-to-date information about scholarships and job opportunities. However, we cannot guarantee that all information is current or correct. Scholarship and job availability, requirements, and application deadlines may change without notice. We recommend that users verify all information directly with the scholarship provider or employer before taking any action.
            </p>
            
            <h2 className="text-xl font-semibold mb-4 mt-8">Contact Us</h2>
            <p className="mb-6">
              If you have any questions about this disclaimer, please contact us through our <a href="/contact" className="text-blue-600 hover:underline">contact page</a>.
            </p>
            
            <p className="text-sm text-gray-500 mt-8">
              Last updated: May 14, 2025
            </p>
          </div>
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

export default Disclaimer;
