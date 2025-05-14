import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Search, User, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import NotificationManager from './NotificationManager';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar";

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
          <img 
            src="/lovable-uploads/bfe4b900-aa37-433d-b636-2134c6bb921c.png" 
            alt="Daily Opportunities Logo" 
            className="h-10 w-auto"
          />
          <span className="font-bold text-xl">Daily Opportunities</span>
        </Link>

        {/* Desktop navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className={cn("hover:text-olive-600 transition-colors", {
            'text-olive-600 font-semibold': location.pathname === '/'
          })}>Home</Link>
          
          {/* Scholarships dropdown */}
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className={cn(
                  "hover:text-olive-600 transition-colors bg-transparent hover:bg-transparent focus:bg-transparent",
                  {
                    'text-olive-600 font-semibold': location.pathname.includes('/scholarships')
                  }
                )}>Scholarships</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="w-[200px] p-2">
                    <Link
                      to="/scholarships"
                      className="block px-3 py-2 hover:bg-gray-100 rounded-md"
                      onClick={closeMenu}
                    >
                      All Scholarships
                    </Link>
                    <div className="font-medium px-3 py-2 text-sm">By Country</div>
                    <Link
                      to="/scholarships/country/usa"
                      className="block px-3 py-2 hover:bg-gray-100 rounded-md"
                      onClick={closeMenu}
                    >
                      USA
                    </Link>
                    <Link
                      to="/scholarships/country/uk"
                      className="block px-3 py-2 hover:bg-gray-100 rounded-md"
                      onClick={closeMenu}
                    >
                      UK
                    </Link>
                    <Link
                      to="/scholarships/country/canada"
                      className="block px-3 py-2 hover:bg-gray-100 rounded-md"
                      onClick={closeMenu}
                    >
                      Canada
                    </Link>
                    <div className="font-medium px-3 py-2 text-sm">By Level</div>
                    <Link
                      to="/scholarships/level/undergraduate"
                      className="block px-3 py-2 hover:bg-gray-100 rounded-md"
                      onClick={closeMenu}
                    >
                      Undergraduate
                    </Link>
                    <Link
                      to="/scholarships/level/masters"
                      className="block px-3 py-2 hover:bg-gray-100 rounded-md"
                      onClick={closeMenu}
                    >
                      Master's
                    </Link>
                    <Link
                      to="/scholarships/level/phd"
                      className="block px-3 py-2 hover:bg-gray-100 rounded-md"
                      onClick={closeMenu}
                    >
                      PhD
                    </Link>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          
          <Link to="/jobs" className={cn("hover:text-olive-600 transition-colors", {
            'text-olive-600 font-semibold': location.pathname === '/jobs'
          })}>Job Listings</Link>
          <Link to="/news" className={cn("hover:text-olive-600 transition-colors", {
            'text-olive-600 font-semibold': location.pathname === '/news'
          })}>News</Link>
          
          {/* More dropdown with About Us, Contact, and Disclaimer */}
          <Menubar className="border-none bg-transparent">
            <MenubarMenu>
              <MenubarTrigger className="hover:text-olive-600 transition-colors bg-transparent hover:bg-transparent focus:bg-transparent">
                More <ChevronDown className="ml-1 h-4 w-4" />
              </MenubarTrigger>
              <MenubarContent>
                <MenubarItem asChild>
                  <Link to="/about">About Us</Link>
                </MenubarItem>
                <MenubarItem asChild>
                  <Link to="/contact">Contact</Link>
                </MenubarItem>
                <MenubarSeparator />
                <MenubarItem asChild>
                  <Link to="/disclaimer">Disclaimer</Link>
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
          
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
            
            {/* Scholarships section */}
            <div className="py-2">
              <Link to="/scholarships" onClick={closeMenu} className="hover:text-olive-600 transition-colors block pb-2 font-medium">Scholarships</Link>
              <div className="ml-4 space-y-2 mt-1">
                <div className="text-sm font-medium text-gray-700">By Country</div>
                <Link to="/scholarships/country/usa" onClick={closeMenu} className="hover:text-olive-600 transition-colors block text-sm py-1">USA</Link>
                <Link to="/scholarships/country/uk" onClick={closeMenu} className="hover:text-olive-600 transition-colors block text-sm py-1">UK</Link>
                <Link to="/scholarships/country/canada" onClick={closeMenu} className="hover:text-olive-600 transition-colors block text-sm py-1">Canada</Link>
                
                <div className="text-sm font-medium text-gray-700 mt-2">By Level</div>
                <Link to="/scholarships/level/undergraduate" onClick={closeMenu} className="hover:text-olive-600 transition-colors block text-sm py-1">Undergraduate</Link>
                <Link to="/scholarships/level/masters" onClick={closeMenu} className="hover:text-olive-600 transition-colors block text-sm py-1">Master's</Link>
                <Link to="/scholarships/level/phd" onClick={closeMenu} className="hover:text-olive-600 transition-colors block text-sm py-1">PhD</Link>
              </div>
            </div>
            
            <Link to="/jobs" onClick={closeMenu} className="hover:text-olive-600 transition-colors block py-2">Job Listings</Link>
            <Link to="/news" onClick={closeMenu} className="hover:text-olive-600 transition-colors block py-2">News</Link>
            <Link to="/about" onClick={closeMenu} className="hover:text-olive-600 transition-colors block py-2">About Us</Link>
            <Link to="/contact" onClick={closeMenu} className="hover:text-olive-600 transition-colors block py-2">Contact</Link>
            <Link to="/disclaimer" onClick={closeMenu} className="hover:text-olive-600 transition-colors block py-2">Disclaimer</Link>
            
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
