
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, X, ChevronDown, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleDropdown = (name: string) => {
    if (dropdownOpen === name) {
      setDropdownOpen(null);
    } else {
      setDropdownOpen(name);
    }
  };

  return (
    <div className="w-full z-50">
      {/* Logo Section */}
      <div className="bg-white py-4 px-4 border-b border-gray-200">
        <div className="max-w-7xl mx-auto flex items-center">
          <Link to="/" className="flex items-center">
            <div className="w-16 h-16 bg-white border border-olive-600 rounded-md flex items-center justify-center">
              <span className="text-3xl font-bold text-olive-700">S<sub className="text-sm">R</sub></span>
            </div>
            <div className="ml-2">
              <div className="text-xl font-bold text-olive-700">SCHOLARSHIP</div>
              <div className="text-xl font-bold text-olive-700">REGION</div>
            </div>
          </Link>
        </div>
      </div>
      
      {/* Navigation Section */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-900 text-white shadow-md"
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-14">
            <div className="hidden md:flex items-center space-x-1">
              <Link to="/" className="px-3 py-2 flex items-center hover:bg-gray-800">
                <span className="mr-1">🏠</span> Home
              </Link>
              
              <div className="relative group">
                <button 
                  onClick={() => toggleDropdown('scholarships')}
                  className="px-3 py-2 flex items-center hover:bg-gray-800"
                >
                  <span className="mr-1">🎓</span> Scholarships <ChevronDown size={14} />
                </button>
                {dropdownOpen === 'scholarships' && (
                  <div className="absolute left-0 mt-1 bg-white rounded-md shadow-lg overflow-hidden z-20 w-48">
                    <div className="py-1">
                      <Link to="/scholarships/undergraduate" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Undergraduate</Link>
                      <Link to="/scholarships/masters" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Masters</Link>
                      <Link to="/scholarships/phd" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">PhD</Link>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="relative group">
                <button 
                  onClick={() => toggleDropdown('countries')}
                  className="px-3 py-2 flex items-center hover:bg-gray-800"
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
                    </div>
                  </div>
                )}
              </div>
              
              <div className="relative group">
                <button 
                  onClick={() => toggleDropdown('levels')}
                  className="px-3 py-2 flex items-center hover:bg-gray-800"
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
              
              <Link to="/explainer" className="px-3 py-2 flex items-center hover:bg-gray-800">
                <span className="mr-1">📚</span> Explainer
              </Link>
              
              <Link to="/news" className="px-3 py-2 flex items-center hover:bg-gray-800">
                <span className="mr-1">📰</span> News
              </Link>
              
              <Link to="/about" className="px-3 py-2 flex items-center hover:bg-gray-800">
                <span className="mr-1">ℹ️</span> About Us
              </Link>
              
              <Link to="/contact" className="px-3 py-2 flex items-center hover:bg-gray-800">
                <span className="mr-1">📞</span> Contact Us
              </Link>
            </div>
            
            <div className="hidden md:flex items-center">
              <button className="px-3 py-2 hover:bg-gray-800">
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
            className="md:hidden bg-gray-900"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link to="/" className="block px-3 py-2 hover:bg-gray-800 rounded-md">
                <span className="mr-1">🏠</span> Home
              </Link>
              <Link to="/scholarships" className="block px-3 py-2 hover:bg-gray-800 rounded-md">
                <span className="mr-1">🎓</span> Scholarships
              </Link>
              <Link to="/countries" className="block px-3 py-2 hover:bg-gray-800 rounded-md">
                <span className="mr-1">🌎</span> Scholarship In Countries
              </Link>
              <Link to="/levels" className="block px-3 py-2 hover:bg-gray-800 rounded-md">
                <span className="mr-1">🏆</span> Scholarships By Level
              </Link>
              <Link to="/explainer" className="block px-3 py-2 hover:bg-gray-800 rounded-md">
                <span className="mr-1">📚</span> Explainer
              </Link>
              <Link to="/news" className="block px-3 py-2 hover:bg-gray-800 rounded-md">
                <span className="mr-1">📰</span> News
              </Link>
              <Link to="/about" className="block px-3 py-2 hover:bg-gray-800 rounded-md">
                <span className="mr-1">ℹ️</span> About Us
              </Link>
              <Link to="/contact" className="block px-3 py-2 hover:bg-gray-800 rounded-md">
                <span className="mr-1">📞</span> Contact Us
              </Link>
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
