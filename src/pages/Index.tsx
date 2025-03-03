
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import Opportunities from '../components/Opportunities';
import AboutSection from '../components/AboutSection';
import ContactSection from '../components/ContactSection';

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="pt-36"> {/* Added padding to account for fixed navbar */}
        <HeroSection />
        <Opportunities />
        <AboutSection />
        <ContactSection />
      </div>
    </div>
  );
};

export default Index;
