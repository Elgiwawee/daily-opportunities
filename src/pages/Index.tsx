
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import Opportunities from '../components/Opportunities';
import AboutSection from '../components/AboutSection';
import ContactSection from '../components/ContactSection';
import AdSenseAd from '../components/AdSenseAd';
import { SEOHead } from '../components/SEOHead';
import { generateWebsiteSchema, generateOrganizationSchema } from '../utils/structuredData';

const Index = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      generateWebsiteSchema(),
      generateOrganizationSchema()
    ]
  };

  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="Daily Opportunities - Scholarships & Jobs for International Students"
        description="Discover fully-funded scholarships, grants, and job opportunities from top universities and organizations in US, UK, Canada, Australia, and Europe. Apply for free!"
        keywords="scholarships USA, UK scholarships, Canadian scholarships, Australian grants, European opportunities, international students, funding, education, tier 1 countries"
        structuredData={structuredData}
      />
      <Navbar />
      <div className="pt-36"> {/* Added padding to account for fixed navbar */}
        <HeroSection />
        <AdSenseAd />
        <Opportunities />
        <AdSenseAd />
        <AboutSection />
        <AdSenseAd />
        <ContactSection />
      </div>
    </div>
  );
};

export default Index;
