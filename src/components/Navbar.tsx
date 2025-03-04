
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, X, ChevronDown, Search, User } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { toast } from "sonner";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Check if user is admin
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsAdmin(!!user);
    };
    checkUser();
    
    // Subscribe to auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAdmin(!!session?.user);
    });
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setDropdownOpen(null);
  }, [location.pathname]);

  const toggleDropdown = (name: string) => {
    if (dropdownOpen === name) {
      setDropdownOpen(null);
    } else {
      setDropdownOpen(name);
    }
  };

  const handleLogin = () => {
    navigate('/auth');
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Logged out successfully");
      if (location.pathname === '/admin') {
        navigate('/');
      }
    } catch (error: any) {
      toast.error(error.message || "Error logging out");
    }
  };

  return (
    <div className="w-full fixed z-50">
      {/* Logo Section */}
      <div className="bg-white py-4 px-4 border-b border-gray-200">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <img 
              src="/lovable-uploads/0fd8bd36-8cd2-4e3f-b34b-fdcf0692b42a.png" 
              alt="Daily Opportunities Logo" 
              className="h-16 w-auto"
            />
            <div className="ml-2">
              <div className="text-xl font-bold text-teal-600">DAILY</div>
              <div className="text-xl font-bold text-teal-600">OPPORTUNITIES</div>
            </div>
          </Link>
          
          <div>
            {isAdmin ? (
              <div className="flex items-center gap-4">
                <Link to="/admin">
                  <Button variant="outline" className="border border-olive-600 text-olive-700 hover:bg-olive-50">
                    <User size={16} className="mr-2" />
                    Admin Dashboard
                  </Button>
                </Link>
                <Button 
                  onClick={handleLogout}
                  variant="outline" 
                  className="border border-olive-600 text-olive-700 hover:bg-olive-50"
                >
                  Logout
                </Button>
              </div>
            ) : (
              <Button 
                onClick={handleLogin}
                variant="outline" 
                className="border border-olive-600 text-olive-700 hover:bg-olive-50"
              >
                <User size={16} className="mr-2" />
                Admin Login
              </Button>
            )}
          </div>
        </div>
      </div>
      
      {/* Navigation Section */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-olive-700 text-white shadow-md"
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-14">
            <div className="hidden md:flex items-center space-x-1">
              <Link to="/" className="px-3 py-2 flex items-center hover:bg-olive-800">
                <span className="mr-1">🏠</span> Home
              </Link>
              
              <div className="relative group">
                <button 
                  onClick={() => toggleDropdown('scholarships')}
                  className="px-3 py-2 flex items-center hover:bg-olive-800"
                >
                  <span className="mr-1">🎓</span> Scholarships <ChevronDown size={14} />
                </button>
                {dropdownOpen === 'scholarships' && (
                  <div className="absolute left-0 mt-1 bg-white rounded-md shadow-lg overflow-hidden z-20 w-48">
                    <div className="py-1">
                      <Link to="/scholarships" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">All Scholarships</Link>
                      <Link to="/levels/undergraduate" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Undergraduate</Link>
                      <Link to="/levels/masters" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Masters</Link>
                      <Link to="/levels/phd" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">PhD</Link>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="relative group">
                <button 
                  onClick={() => toggleDropdown('countries')}
                  className="px-3 py-2 flex items-center hover:bg-olive-800"
                >
                  <span className="mr-1">🌎</span> Scholarship In Countries <ChevronDown size={14} />
                </button>
                {dropdownOpen === 'countries' && (
                  <div className="absolute left-0 mt-1 bg-white rounded-md shadow-lg overflow-hidden z-20 w-48">
                    <div className="py-1">
                      <Link to="/countries/usa" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">USA</Link>
                      <Link to="/countries/uk" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">UK</Link>
                      <Link to="/countries/canada" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Canada</Link>
                      <Link to="/countries/australia" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Australia</Link>
                      <Link to="/countries/germany" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Germany</Link>
                      <Link to="/countries/nigeria" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Nigeria</Link>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="relative group">
                <button 
                  onClick={() => toggleDropdown('levels')}
                  className="px-3 py-2 flex items-center hover:bg-olive-800"
                >
                  <span className="mr-1">🏆</span> Scholarships By Level <ChevronDown size={14} />
                </button>
                {dropdownOpen === 'levels' && (
                  <div className="absolute left-0 mt-1 bg-white rounded-md shadow-lg overflow-hidden z-20 w-48">
                    <div className="py-1">
                      <Link to="/levels/bachelors" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Bachelors</Link>
                      <Link to="/levels/masters" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Masters</Link>
                      <Link to="/levels/phd" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">PhD</Link>
                    </div>
                  </div>
                )}
              </div>
              
              <Link to="/jobs" className="px-3 py-2 flex items-center hover:bg-olive-800">
                <span className="mr-1">💼</span> Jobs
              </Link>
              
              <Link to="/explainer" className="px-3 py-2 flex items-center hover:bg-olive-800">
                <span className="mr-1">📚</span> Explainer
              </Link>
              
              <Link to="/news" className="px-3 py-2 flex items-center hover:bg-olive-800">
                <span className="mr-1">📰</span> News
              </Link>
              
              <Link to="/about" className="px-3 py-2 flex items-center hover:bg-olive-800">
                <span className="mr-1">ℹ️</span> About Us
              </Link>
              
              <Link to="/contact" className="px-3 py-2 flex items-center hover:bg-olive-800">
                <span className="mr-1">📞</span> Contact Us
              </Link>
            </div>
            
            <div className="hidden md:flex items-center">
              <button className="px-3 py-2 hover:bg-olive-800">
                <Search size={20} />
              </button>
            </div>

            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-white p-2"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-olive-700"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link to="/" className="block px-3 py-2 hover:bg-olive-800 rounded-md">
                <span className="mr-1">🏠</span> Home
              </Link>
              
              {/* Mobile Scholarships Dropdown */}
              <div className="relative">
                <button 
                  onClick={() => toggleDropdown('mobile-scholarships')}
                  className="w-full text-left block px-3 py-2 hover:bg-olive-800 rounded-md flex items-center justify-between"
                >
                  <span><span className="mr-1">🎓</span> Scholarships</span>
                  <ChevronDown size={14} className={dropdownOpen === 'mobile-scholarships' ? 'transform rotate-180' : ''} />
                </button>
                {dropdownOpen === 'mobile-scholarships' && (
                  <div className="bg-olive-600 rounded-md mt-1 py-1">
                    <Link to="/scholarships" className="block px-5 py-2 hover:bg-olive-700">All Scholarships</Link>
                    <Link to="/levels/undergraduate" className="block px-5 py-2 hover:bg-olive-700">Undergraduate</Link>
                    <Link to="/levels/masters" className="block px-5 py-2 hover:bg-olive-700">Masters</Link>
                    <Link to="/levels/phd" className="block px-5 py-2 hover:bg-olive-700">PhD</Link>
                  </div>
                )}
              </div>
              
              {/* Mobile Countries Dropdown */}
              <div className="relative">
                <button 
                  onClick={() => toggleDropdown('mobile-countries')}
                  className="w-full text-left block px-3 py-2 hover:bg-olive-800 rounded-md flex items-center justify-between"
                >
                  <span><span className="mr-1">🌎</span> Scholarship In Countries</span>
                  <ChevronDown size={14} className={dropdownOpen === 'mobile-countries' ? 'transform rotate-180' : ''} />
                </button>
                {dropdownOpen === 'mobile-countries' && (
                  <div className="bg-olive-600 rounded-md mt-1 py-1">
                    <Link to="/countries/usa" className="block px-5 py-2 hover:bg-olive-700">USA</Link>
                    <Link to="/countries/uk" className="block px-5 py-2 hover:bg-olive-700">UK</Link>
                    <Link to="/countries/canada" className="block px-5 py-2 hover:bg-olive-700">Canada</Link>
                    <Link to="/countries/australia" className="block px-5 py-2 hover:bg-olive-700">Australia</Link>
                    <Link to="/countries/germany" className="block px-5 py-2 hover:bg-olive-700">Germany</Link>
                    <Link to="/countries/nigeria" className="block px-5 py-2 hover:bg-olive-700">Nigeria</Link>
                  </div>
                )}
              </div>
              
              {/* Mobile Levels Dropdown */}
              <div className="relative">
                <button 
                  onClick={() => toggleDropdown('mobile-levels')}
                  className="w-full text-left block px-3 py-2 hover:bg-olive-800 rounded-md flex items-center justify-between"
                >
                  <span><span className="mr-1">🏆</span> Scholarships By Level</span>
                  <ChevronDown size={14} className={dropdownOpen === 'mobile-levels' ? 'transform rotate-180' : ''} />
                </button>
                {dropdownOpen === 'mobile-levels' && (
                  <div className="bg-olive-600 rounded-md mt-1 py-1">
                    <Link to="/levels/bachelors" className="block px-5 py-2 hover:bg-olive-700">Bachelors</Link>
                    <Link to="/levels/masters" className="block px-5 py-2 hover:bg-olive-700">Masters</Link>
                    <Link to="/levels/phd" className="block px-5 py-2 hover:bg-olive-700">PhD</Link>
                  </div>
                )}
              </div>
              
              <Link to="/jobs" className="block px-3 py-2 hover:bg-olive-800 rounded-md">
                <span className="mr-1">💼</span> Jobs
              </Link>
              <Link to="/explainer" className="block px-3 py-2 hover:bg-olive-800 rounded-md">
                <span className="mr-1">📚</span> Explainer
              </Link>
              <Link to="/news" className="block px-3 py-2 hover:bg-olive-800 rounded-md">
                <span className="mr-1">📰</span> News
              </Link>
              <Link to="/about" className="block px-3 py-2 hover:bg-olive-800 rounded-md">
                <span className="mr-1">ℹ️</span> About Us
              </Link>
              <Link to="/contact" className="block px-3 py-2 hover:bg-olive-800 rounded-md">
                <span className="mr-1">📞</span> Contact Us
              </Link>
              
              {isAdmin && (
                <Link to="/admin" className="block px-3 py-2 hover:bg-olive-800 rounded-md">
                  <span className="mr-1">👤</span> Admin Dashboard
                </Link>
              )}
              
              <div className="relative pt-2">
                <div className="flex items-center border-2 rounded-lg bg-white">
                  <input type="text" className="w-full px-4 py-1 text-gray-800 rounded-lg" placeholder="Search..." />
                  <button className="bg-gray-300 p-1 rounded-r-lg">
                    <Search size={20} className="text-gray-800" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </motion.nav>
    </div>
  );
};

export default Navbar;
