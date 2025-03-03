
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import Opportunities from '../components/Opportunities';
import AboutSection from '../components/AboutSection';
import ContactSection from '../components/ContactSection'; 
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="pt-36"> {/* Added padding to account for fixed navbar */}
        <Opportunities />
        <AboutSection />
        <ContactSection />
      </div>
      
      {/* Admin login button (visible only at the bottom of the page) */}
      <div className="fixed bottom-4 right-4 opacity-30 hover:opacity-100 transition-opacity">
        <Link
          to="/auth"
          className="bg-gray-200 text-gray-600 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors text-xs"
        >
          Admin
        </Link>
      </div>
    </div>
  );
};

export default Index;
