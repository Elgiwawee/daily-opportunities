
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';
import AboutSection from '../components/AboutSection';

const AboutUs = () => {
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
            <h1 className="text-3xl font-bold text-gray-900 mb-4">About Us</h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Learn more about Scholarship Region and our mission to connect students with global opportunities.
            </p>
          </motion.div>
          
          <AboutSection />
          
          <div className="mt-16 bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-olive-800">Our Mission</h2>
            <p className="text-gray-700 mb-6">
              Our mission at Scholarship Region is to bridge the gap between ambitious students and global educational opportunities. 
              We strive to make quality education accessible to all by providing comprehensive information about scholarships, 
              grants, and educational programs from around the world.
            </p>
            
            <h2 className="text-2xl font-bold mb-6 text-olive-800">Our Vision</h2>
            <p className="text-gray-700 mb-6">
              We envision a world where financial barriers do not hinder educational pursuits. 
              Our platform aims to be the primary resource for students seeking funding for their education, 
              regardless of their background or geographical location.
            </p>
            
            <h2 className="text-2xl font-bold mb-6 text-olive-800">Our Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-32 h-32 rounded-full bg-olive-100 mx-auto mb-4 flex items-center justify-center">
                  <span className="text-3xl font-bold text-olive-700">SR</span>
                </div>
                <h3 className="text-lg font-bold">John Doe</h3>
                <p className="text-gray-600">Founder & CEO</p>
              </div>
              <div className="text-center">
                <div className="w-32 h-32 rounded-full bg-olive-100 mx-auto mb-4 flex items-center justify-center">
                  <span className="text-3xl font-bold text-olive-700">SR</span>
                </div>
                <h3 className="text-lg font-bold">Jane Smith</h3>
                <p className="text-gray-600">Scholarship Coordinator</p>
              </div>
              <div className="text-center">
                <div className="w-32 h-32 rounded-full bg-olive-100 mx-auto mb-4 flex items-center justify-center">
                  <span className="text-3xl font-bold text-olive-700">SR</span>
                </div>
                <h3 className="text-lg font-bold">Michael Brown</h3>
                <p className="text-gray-600">Content Director</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
