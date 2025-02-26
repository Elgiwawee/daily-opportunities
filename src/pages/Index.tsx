
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import Opportunities from '../components/Opportunities';
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      <Navbar />
      <HeroSection />
      <Opportunities />
      <div className="fixed bottom-4 right-4">
        <Link
          to="/auth"
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors shadow-lg"
        >
          Admin Login
        </Link>
      </div>
    </div>
  );
};

export default Index;
