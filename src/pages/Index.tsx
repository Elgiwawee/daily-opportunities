
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import Opportunities from '../components/Opportunities';
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <HeroSection />
      <Opportunities />
      <div className="fixed bottom-4 right-4">
        <Link
          to="/auth"
          className="bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors"
        >
          Admin Login
        </Link>
      </div>
    </div>
  );
};

export default Index;
