import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import Opportunities from '../components/Opportunities';
import AboutSection from '../components/AboutSection';
import AdSenseAd from '../components/AdSenseAd';
import MobileStickyAd from '../components/MobileStickyAd';
import WhatsAppGroups from '../components/WhatsAppGroups';
import StickySidebar from '../components/StickySidebar';
import { SEOHead } from '../components/SEOHead';
import { generateWebsiteSchema, generateOrganizationSchema } from '../utils/structuredData';
import { Link } from 'react-router-dom';
import { GraduationCap, Briefcase, Globe, FileText, ChevronRight } from 'lucide-react';
import Footer from '../components/Footer';

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
    <div className="min-h-screen bg-gray-50 pb-16 md:pb-0">
      <SEOHead
        title="Daily Opportunities - Scholarships & Jobs for International Students"
        description="Discover fully-funded scholarships, grants, and job opportunities from top universities and organizations in US, UK, Canada, Australia, and Europe. Apply for free!"
        keywords="scholarships USA, UK scholarships, Canadian scholarships, Australian grants, European opportunities, international students, funding, education, tier 1 countries"
        structuredData={structuredData}
      />
      <Navbar />
      <div className="pt-20">
        <HeroSection />
        
        {/* In-Feed Ad After Hero */}
        <div className="bg-white py-4">
          <div className="max-w-7xl mx-auto px-4">
            <AdSenseAd variant="in-feed" />
          </div>
        </div>
        
        {/* Main Content with Sidebar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex gap-8">
            {/* Main Content */}
            <div className="flex-1 min-w-0">
              {/* Categories Section */}
              <section className="mb-12">
                <div className="text-center mb-10">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">Browse Opportunities</h2>
                  <p className="text-gray-600 max-w-2xl mx-auto">Find your perfect opportunity from thousands of scholarships and jobs</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {categories.map((category, index) => (
                    <CategoryCard key={index} {...category} />
                  ))}
                </div>
              </section>
              
              {/* In-Feed Ad Between Categories and WhatsApp */}
              <div className="my-8">
                <AdSenseAd variant="in-feed" />
              </div>

              {/* WhatsApp Groups & Services */}
              <WhatsAppGroups />
              
              {/* In-Feed Ad After WhatsApp */}
              <div className="my-8">
                <AdSenseAd variant="in-feed" />
              </div>
            </div>
            
            {/* Sticky Sidebar - Desktop Only */}
            <StickySidebar className="w-80 flex-shrink-0" />
          </div>
        </div>
        
        {/* Latest Opportunities */}
        <Opportunities />
        
        {/* In-Feed Ad After Opportunities */}
        <div className="bg-white py-4">
          <div className="max-w-7xl mx-auto px-4">
            <AdSenseAd variant="in-feed" />
          </div>
        </div>
        
        <AboutSection />
        
        {/* Comprehensive Footer */}
        <Footer />
      </div>
      
      {/* Mobile Sticky Footer Ad */}
      <MobileStickyAd />
    </div>
  );
};

export default Index;
