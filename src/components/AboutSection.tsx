
import { motion } from 'framer-motion';

const AboutSection = () => {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium text-indigo-600 mb-2 block">
            Who We Are
          </span>
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
            About Daily Opportunities
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Learn more about our mission to connect talented individuals with life-changing opportunities.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-72 h-72 bg-indigo-100 rounded-lg -z-10"></div>
              <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80" 
                alt="Team working together" 
                className="rounded-lg shadow-xl w-full h-auto object-cover"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-bold text-gray-900">Our Mission</h3>
            <p className="text-gray-600">
              At Daily Opportunities, we believe that everyone deserves access to quality opportunities that can transform their lives. Our platform bridges the gap between talented individuals and organizations offering scholarships and job openings.
            </p>
            <p className="text-gray-600">
              We curate and verify each opportunity to ensure our users have access to legitimate and valuable prospects. Our team works tirelessly to bring you the most relevant opportunities tailored to various fields and interests.
            </p>

            <h3 className="text-2xl font-bold text-gray-900 pt-4">Our Values</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-indigo-100 flex items-center justify-center">
                  <span className="text-indigo-600 text-sm font-bold">✓</span>
                </div>
                <p className="ml-3 text-gray-600"><span className="font-medium text-gray-900">Accessibility</span> - Making opportunities available to everyone regardless of background</p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-indigo-100 flex items-center justify-center">
                  <span className="text-indigo-600 text-sm font-bold">✓</span>
                </div>
                <p className="ml-3 text-gray-600"><span className="font-medium text-gray-900">Quality</span> - Verifying all opportunities to ensure they meet our standards</p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-indigo-100 flex items-center justify-center">
                  <span className="text-indigo-600 text-sm font-bold">✓</span>
                </div>
                <p className="ml-3 text-gray-600"><span className="font-medium text-gray-900">Diversity</span> - Promoting opportunities across various fields and disciplines</p>
              </li>
            </ul>
          </motion.div>
        </div>

        <div className="mt-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-8 md:p-12 shadow-sm"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Story</h3>
            <p className="text-gray-600 mb-6">
              Daily Opportunities started with a simple idea: to create a centralized platform where people could find legitimate scholarships and job opportunities. Our founders experienced firsthand the challenges of navigating fragmented information across multiple sources.
            </p>
            <p className="text-gray-600">
              Since our launch, we've helped thousands of individuals find scholarships that funded their education and jobs that kickstarted their careers. We continue to grow our network of partner organizations to bring you the best opportunities available.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
