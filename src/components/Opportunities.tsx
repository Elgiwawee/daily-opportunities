
import { motion } from 'framer-motion';
import OpportunityCard from './OpportunityCard';

const Opportunities = () => {
  const scholarships = [
    {
      title: "Global Excellence Scholarship",
      organization: "International Education Fund",
      deadline: "March 15, 2024",
      type: "scholarship" as const,
      description: "Full-ride scholarship for outstanding students pursuing graduate studies in any field.",
    },
    {
      title: "Tech Innovation Grant",
      organization: "Future Technologies Foundation",
      deadline: "April 1, 2024",
      type: "scholarship" as const,
      description: "Supporting next-generation leaders in computer science and engineering.",
    },
  ];

  const jobs = [
    {
      title: "Senior Software Engineer",
      organization: "Tech Innovations Inc.",
      deadline: "Open until filled",
      type: "job" as const,
      description: "Leading development team in creating cutting-edge web applications.",
    },
    {
      title: "Product Manager",
      organization: "Global Solutions Ltd.",
      deadline: "March 30, 2024",
      type: "job" as const,
      description: "Shape the future of our digital products and lead cross-functional teams.",
    },
  ];

  return (
    <div className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-20" id="scholarships">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-sm font-medium text-gray-600 mb-2 block">
              Educational Opportunities
            </span>
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
              Featured Scholarships
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover scholarships that can help fund your educational journey and achieve your academic goals.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {scholarships.map((scholarship, index) => (
              <OpportunityCard key={index} {...scholarship} />
            ))}
          </div>
        </div>

        <div className="mt-20" id="jobs">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-sm font-medium text-gray-600 mb-2 block">
              Career Opportunities
            </span>
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
              Latest Job Openings
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Find your next career opportunity with leading companies across various industries.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {jobs.map((job, index) => (
              <OpportunityCard key={index} {...job} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Opportunities;
