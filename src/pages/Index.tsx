import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import Opportunities from '../components/Opportunities';
import AboutSection from '../components/AboutSection';
import ContactSection from '../components/ContactSection';
import AdSenseAd from '../components/AdSenseAd';
import WhatsAppGroups from '../components/WhatsAppGroups';
import { SEOHead } from '../components/SEOHead';
import { generateWebsiteSchema, generateOrganizationSchema } from '../utils/structuredData';
import { Link } from 'react-router-dom';
import { GraduationCap, Briefcase, Globe, FileText, ChevronRight } from 'lucide-react';

const CategoryCard = ({ icon: Icon, title, description, link, color }: { 
  icon: any; 
  title: string; 
  description: string; 
  link: string;
  color: string;
}) => (
  <Link 
    to={link}
    className="group bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-blue-200"
  >
    <div className={`w-12 h-12 rounded-lg ${color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
      <Icon className="w-6 h-6 text-white" />
    </div>
    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">{title}</h3>
    <p className="text-gray-600 text-sm mb-3">{description}</p>
    <span className="text-blue-600 text-sm font-medium flex items-center">
      Explore <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
    </span>
  </Link>
);

const Index = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      generateWebsiteSchema(),
      generateOrganizationSchema()
    ]
  };

  const categories = [
    {
      icon: GraduationCap,
      title: 'Scholarships',
      description: 'Fully-funded scholarships from top universities worldwide',
      link: '/scholarships',
      color: 'bg-blue-600'
    },
    {
      icon: Briefcase,
      title: 'Jobs',
      description: 'Career opportunities at leading organizations',
      link: '/jobs',
      color: 'bg-green-600'
    },
    {
      icon: Globe,
      title: 'By Country',
      description: 'Find opportunities by destination country',
      link: '/scholarships/country/usa',
      color: 'bg-purple-600'
    },
    {
      icon: FileText,
      title: 'News & Updates',
      description: 'Latest scholarship and job announcements',
      link: '/news',
      color: 'bg-orange-500'
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <SEOHead
        title="Daily Opportunities - Scholarships & Jobs for International Students"
        description="Discover fully-funded scholarships, grants, and job opportunities from top universities and organizations in US, UK, Canada, Australia, and Europe. Apply for free!"
        keywords="scholarships USA, UK scholarships, Canadian scholarships, Australian grants, European opportunities, international students, funding, education, tier 1 countries"
        structuredData={structuredData}
      />
      <Navbar />
      <div className="pt-20">
        <HeroSection />
        
        {/* Ad Banner After Hero */}
        <div className="bg-white py-4">
          <div className="max-w-7xl mx-auto px-4">
            <AdSenseAd />
          </div>
        </div>
        
        {/* Categories Section */}
        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">Browse Opportunities</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">Find your perfect opportunity from thousands of scholarships and jobs</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.map((category, index) => (
                <CategoryCard key={index} {...category} />
              ))}
            </div>
          </div>
        </section>

        {/* WhatsApp Groups & Services */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <WhatsAppGroups />
        </div>
        
        {/* Ad Between Sections */}
        <div className="bg-white py-4">
          <div className="max-w-7xl mx-auto px-4">
            <AdSenseAd />
          </div>
        </div>
        
        {/* Latest Opportunities */}
        <Opportunities />
        
        {/* Ad After Opportunities */}
        <div className="bg-white py-4">
          <div className="max-w-7xl mx-auto px-4">
            <AdSenseAd />
          </div>
        </div>
        
        <AboutSection />
        <ContactSection />
      </div>
    </div>
  );
};

export default Index;
