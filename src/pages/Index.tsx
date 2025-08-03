
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import Opportunities from '../components/Opportunities';
import AboutSection from '../components/AboutSection';
import ContactSection from '../components/ContactSection';
import AdSenseAd from '../components/AdSenseAd';

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
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
