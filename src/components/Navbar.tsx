
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Search, User, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import NotificationManager from './NotificationManager';
import { useTranslation } from 'react-i18next';
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
import { useIsMobile } from '@/hooks/use-mobile';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import LanguageSwitcher from './LanguageSwitcher';

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [scholarshipsOpen, setScholarshipsOpen] = useState(false);
  const isMobile = useIsMobile();
  const isRtl = i18n.language === 'ar';

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

  const toggleScholarshipsDropdown = () => {
    setScholarshipsOpen(!scholarshipsOpen);
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
            alt={t('app.name')}
            className="h-10 w-auto"
          />
          <span className="font-bold text-xl">{t('app.name')}</span>
        </Link>

        {/* Desktop navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className={cn("hover:text-olive-600 transition-colors", {
            'text-olive-600 font-semibold': location.pathname === '/'
          })}>{t('nav.home')}</Link>
          
          {/* Scholarships dropdown */}
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className={cn(
                  "hover:text-olive-600 transition-colors bg-transparent hover:bg-transparent focus:bg-transparent",
                  {
                    'text-olive-600 font-semibold': location.pathname.includes('/scholarships')
                  }
                )}>{t('nav.scholarships')}</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="w-[200px] p-2">
                    <Link
                      to="/scholarships"
                      className="block px-3 py-2 hover:bg-gray-100 rounded-md"
                      onClick={closeMenu}
                    >
                      {t('scholarships.title')}
                    </Link>
                    <div className="font-medium px-3 py-2 text-sm">{isRtl ? 'حسب الدولة' : 'By Country'}</div>
                    <Link
                      to="/scholarships/country/usa"
                      className="block px-3 py-2 hover:bg-gray-100 rounded-md"
                      onClick={closeMenu}
                    >
                      {isRtl ? 'الولايات المتحدة' : 'USA'}
                    </Link>
                    <Link
                      to="/scholarships/country/uk"
                      className="block px-3 py-2 hover:bg-gray-100 rounded-md"
                      onClick={closeMenu}
                    >
                      {isRtl ? 'المملكة المتحدة' : 'UK'}
                    </Link>
                    <Link
                      to="/scholarships/country/canada"
                      className="block px-3 py-2 hover:bg-gray-100 rounded-md"
                      onClick={closeMenu}
                    >
                      {isRtl ? 'كندا' : 'Canada'}
                    </Link>
                    <div className="font-medium px-3 py-2 text-sm">{isRtl ? 'حسب المستوى' : 'By Level'}</div>
                    <Link
                      to="/scholarships/level/undergraduate"
                      className="block px-3 py-2 hover:bg-gray-100 rounded-md"
                      onClick={closeMenu}
                    >
                      {isRtl ? 'البكالوريوس' : 'Undergraduate'}
                    </Link>
                    <Link
                      to="/scholarships/level/masters"
                      className="block px-3 py-2 hover:bg-gray-100 rounded-md"
                      onClick={closeMenu}
                    >
                      {isRtl ? 'الماجستير' : 'Master\'s'}
                    </Link>
                    <Link
                      to="/scholarships/level/phd"
                      className="block px-3 py-2 hover:bg-gray-100 rounded-md"
                      onClick={closeMenu}
                    >
                      {isRtl ? 'الدكتوراه' : 'PhD'}
                    </Link>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          
          <Link to="/jobs" className={cn("hover:text-olive-600 transition-colors", {
            'text-olive-600 font-semibold': location.pathname === '/jobs'
          })}>{t('nav.jobs')}</Link>
          <Link to="/news" className={cn("hover:text-olive-600 transition-colors", {
            'text-olive-600 font-semibold': location.pathname === '/news'
          })}>{t('nav.news')}</Link>
          
          {/* More dropdown with About Us, Contact, and Disclaimer */}
          <Menubar className="border-none bg-transparent">
            <MenubarMenu>
              <MenubarTrigger className="hover:text-olive-600 transition-colors bg-transparent hover:bg-transparent focus:bg-transparent">
                {isRtl ? 'المزيد' : 'More'} <ChevronDown className="ml-1 h-4 w-4" />
              </MenubarTrigger>
              <MenubarContent>
                <MenubarItem asChild>
                  <Link to="/about">{t('nav.about')}</Link>
                </MenubarItem>
                <MenubarItem asChild>
                  <Link to="/contact">{t('nav.contact')}</Link>
                </MenubarItem>
                <MenubarSeparator />
                <MenubarItem asChild>
                  <Link to="/disclaimer">{t('nav.disclaimer')}</Link>
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
          
          {/* Add notification manager */}
          <NotificationManager />
          
          {/* Language switcher */}
          <LanguageSwitcher />
          
          {/* Search bar */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="search"
              placeholder={t('buttons.search')}
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
                {t('nav.admin')}
              </Button>
            </Link>
          ) : (
            <Link to="/auth">
              <Button variant="outline" size="sm">
                {t('nav.login')}
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
          
          {/* Language switcher for mobile */}
          <div className="mr-2">
            <LanguageSwitcher />
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
            
            {/* Scholarships dropdown - now using DropdownMenu for mobile */}
            <div className="py-2">
              <div className="flex items-center justify-between">
                <button 
                  onClick={toggleScholarshipsDropdown} 
                  className={cn(
                    "hover:text-olive-600 transition-colors flex items-center", 
                    { 'text-olive-600 font-semibold': location.pathname.includes('/scholarships') }
                  )}
                >
                  Scholarships
                  <ChevronDown className={cn("ml-1 h-4 w-4 transition-transform", {
                    "transform rotate-180": scholarshipsOpen
                  })} />
                </button>
              </div>
              
              {scholarshipsOpen && (
                <div className="ml-4 mt-2 space-y-2 bg-white rounded-md shadow-sm border border-gray-100">
                  <Link
                    to="/scholarships"
                    onClick={closeMenu}
                    className="block px-3 py-2 hover:bg-gray-100"
                  >
                    All Scholarships
                  </Link>
                  <div className="text-sm font-medium text-gray-700 px-3 pt-2">By Country</div>
                  <Link
                    to="/scholarships/country/usa"
                    onClick={closeMenu}
                    className="block px-3 py-2 hover:bg-gray-100"
                  >
                    USA
                  </Link>
                  <Link
                    to="/scholarships/country/uk"
                    onClick={closeMenu}
                    className="block px-3 py-2 hover:bg-gray-100"
                  >
                    UK
                  </Link>
                  <Link
                    to="/scholarships/country/canada"
                    onClick={closeMenu}
                    className="block px-3 py-2 hover:bg-gray-100"
                  >
                    Canada
                  </Link>
                  <div className="text-sm font-medium text-gray-700 px-3 pt-2">By Level</div>
                  <Link
                    to="/scholarships/level/undergraduate"
                    onClick={closeMenu}
                    className="block px-3 py-2 hover:bg-gray-100"
                  >
                    Undergraduate
                  </Link>
                  <Link
                    to="/scholarships/level/masters"
                    onClick={closeMenu}
                    className="block px-3 py-2 hover:bg-gray-100"
                  >
                    Master's
                  </Link>
                  <Link
                    to="/scholarships/level/phd"
                    onClick={closeMenu}
                    className="block px-3 py-2 hover:bg-gray-100"
                  >
                    PhD
                  </Link>
                </div>
              )}
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
