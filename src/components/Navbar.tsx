import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Search, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import NotificationManager from './NotificationManager';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Check if the user is logged in
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsLoggedIn(!!session);
    };

    checkAuth();

    // Subscribe to auth state changes
    supabase.auth.onAuthStateChange((event, session) => {
      setIsLoggedIn(!!session);
    });
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search logic here
    console.log('Search term:', searchTerm);
  };

  return (
    <nav className="fixed w-full bg-white border-b border-gray-200 z-50">
      <div className="flex justify-between items-center py-4 px-6 max-w-7xl mx-auto">
        {/* Logo and site name */}
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="Daily Opportunities Logo" className="h-8 w-auto" />
          <span className="font-bold text-xl">Daily Opportunities</span>
        </Link>

        {/* Desktop navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className={cn("hover:text-olive-600 transition-colors", {
            'text-olive-600 font-semibold': location.pathname === '/'
          })}>Home</Link>
          <Link to="/scholarships" className={cn("hover:text-olive-600 transition-colors", {
            'text-olive-600 font-semibold': location.pathname === '/scholarships'
          })}>Scholarships</Link>
          <Link to="/jobs" className={cn("hover:text-olive-600 transition-colors", {
            'text-olive-600 font-semibold': location.pathname === '/jobs'
          })}>Job Listings</Link>
          <Link to="/news" className={cn("hover:text-olive-600 transition-colors", {
            'text-olive-600 font-semibold': location.pathname === '/news'
          })}>News</Link>
          
          {/* Add notification manager */}
          <NotificationManager />
          
          {/* Search bar */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="search"
              placeholder="Search"
              value={searchTerm}
              onChange={handleSearchChange}
              className="border border-gray-300 rounded-md px-3 py-2 pl-10 focus:outline-none focus:border-olive-500"
            />
            <div className="absolute inset-y-0 left-2.5 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
          </form>

          {/* Authentication buttons */}
          {isLoggedIn ? (
            <Link to="/admin">
              <Button variant="outline" size="sm">
                <User className="w-4 h-4 mr-2" />
                Admin
              </Button>
            </Link>
          ) : (
            <Link to="/auth">
              <Button variant="outline" size="sm">
                Login
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center">
          {/* Add notification manager for mobile too */}
          <div className="mr-2">
            <NotificationManager />
          </div>
          
          <button onClick={toggleMenu}>
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex flex-col space-y-4">
            <Link to="/" onClick={closeMenu} className="hover:text-olive-600 transition-colors block py-2">Home</Link>
            <Link to="/scholarships" onClick={closeMenu} className="hover:text-olive-600 transition-colors block py-2">Scholarships</Link>
            <Link to="/jobs" onClick={closeMenu} className="hover:text-olive-600 transition-colors block py-2">Job Listings</Link>
            <Link to="/news" onClick={closeMenu} className="hover:text-olive-600 transition-colors block py-2">News</Link>
            
            {/* Search bar */}
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="search"
                placeholder="Search"
                value={searchTerm}
                onChange={handleSearchChange}
                className="border border-gray-300 rounded-md px-3 py-2 pl-10 focus:outline-none focus:border-olive-500 w-full"
              />
              <div className="absolute inset-y-0 left-2.5 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
            </form>

            {/* Authentication buttons */}
            {isLoggedIn ? (
              <Link to="/admin" onClick={closeMenu}>
                <Button variant="outline" size="sm" className="w-full">
                  <User className="w-4 h-4 mr-2" />
                  Admin
                </Button>
              </Link>
            ) : (
              <Link to="/auth" onClick={closeMenu}>
                <Button variant="outline" size="sm" className="w-full">
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
