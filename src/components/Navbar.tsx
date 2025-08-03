import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Search, LogOut, Settings, ChevronDown } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import NotificationManager from './NotificationManager';
import LanguageSwitcher from './LanguageSwitcher';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

// Navigation configuration
const navItems = [
  { href: '/', label: 'Home', key: 'home' },
  { 
    href: '/scholarships', 
    label: 'Scholarships', 
    key: 'scholarships',
    submenu: [
      { href: '/scholarships', label: 'All Scholarships' },
      { href: '/scholarships/country/usa', label: 'USA Scholarships' },
      { href: '/scholarships/country/canada', label: 'Canada Scholarships' },
      { href: '/scholarships/country/uk', label: 'UK Scholarships' },
      { href: '/scholarships/level/undergraduate', label: 'Undergraduate' },
      { href: '/scholarships/level/graduate', label: 'Graduate' },
    ]
  },
  { href: '/jobs', label: 'Jobs', key: 'jobs' },
  { href: '/news', label: 'News', key: 'news' },
  { href: '/blog', label: 'Blog', key: 'blog' },
  { href: '/about', label: 'About', key: 'about' },
  { href: '/contact', label: 'Contact', key: 'contact' },
];

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  // Check authentication state
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsLoggedIn(!!session);
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Helper functions
  const isActiveRoute = (href: string) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname.startsWith(href);
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/scholarships?search=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm('');
      setIsMobileMenuOpen(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  // Desktop Navigation Component
  const DesktopNav = () => (
    <div className="hidden md:flex items-center space-x-1">
      {navItems.map((item) => (
        item.submenu ? (
          <DropdownMenu key={item.key}>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className={cn(
                  "h-10 px-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                  isActiveRoute(item.href) && "bg-accent text-accent-foreground"
                )}
              >
                {item.label}
                <ChevronDown className="ml-1 h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              {item.submenu.map((subItem) => (
                <DropdownMenuItem key={subItem.href} asChild>
                  <Link to={subItem.href} className="w-full">
                    {subItem.label}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button
            key={item.key}
            variant="ghost"
            asChild
            className={cn(
              "h-10 px-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
              isActiveRoute(item.href) && "bg-accent text-accent-foreground"
            )}
          >
            <Link to={item.href}>{item.label}</Link>
          </Button>
        )
      ))}
    </div>
  );

  // Mobile Navigation Component
  const MobileNav = () => (
    <div className="flex flex-col space-y-2 p-4">
      {navItems.map((item) => (
        <div key={item.key}>
          {item.submenu ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className={cn(
                    "w-full justify-between h-12 text-base font-medium",
                    isActiveRoute(item.href) && "bg-accent text-accent-foreground"
                  )}
                  >
                  {item.label}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full">
                {item.submenu.map((subItem) => (
                  <DropdownMenuItem key={subItem.href} asChild>
                    <Link 
                      to={subItem.href} 
                      className="w-full"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {subItem.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              variant="ghost"
              asChild
              className={cn(
                "w-full justify-start h-12 text-base font-medium",
                isActiveRoute(item.href) && "bg-accent text-accent-foreground"
              )}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Link to={item.href}>{item.label}</Link>
            </Button>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo and Brand */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <img 
              src="/lovable-uploads/d2e18fd4-e699-4d61-9f78-1c76ece71cb9.png" 
              alt="Daily Opportunities Logo" 
              className="h-12 w-12 object-contain"
              onError={(e) => {
                console.error('Logo failed to load:', e);
                e.currentTarget.style.display = 'none';
              }}
            />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <DesktopNav />

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-2">
          {/* Search */}
          <form onSubmit={handleSearchSubmit} className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 w-64"
              />
            </div>
          </form>

          {/* User Actions */}
          <div className="flex items-center space-x-1">
            <NotificationManager />
            <LanguageSwitcher />
            
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Settings className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link to="/admin">Admin</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/settings">Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild variant="default" size="sm">
                <Link to="/auth">Login</Link>
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        <div className="flex md:hidden items-center space-x-2">
          <LanguageSwitcher />
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <SheetHeader>
                <SheetTitle className="text-left">
                  اپورچونیٹی ہنٹر
                </SheetTitle>
              </SheetHeader>
              
              {/* Mobile Search */}
              <form onSubmit={handleSearchSubmit} className="mt-6">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </form>

              {/* Mobile Navigation */}
              <div className="mt-6">
                <MobileNav />
              </div>

              {/* Mobile Auth Section */}
              <div className="mt-6 pt-6 border-t">
                {isLoggedIn ? (
                  <div className="space-y-2">
                    <Button variant="ghost" asChild className="w-full justify-start">
                      <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)}>
                        <Settings className="mr-2 h-4 w-4" />
                        Admin
                      </Link>
                    </Button>
                    <Button variant="ghost" asChild className="w-full justify-start">
                      <Link to="/settings" onClick={() => setIsMobileMenuOpen(false)}>
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </Link>
                    </Button>
                    <Button variant="ghost" onClick={handleLogout} className="w-full justify-start">
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </Button>
                  </div>
                ) : (
                  <Button asChild className="w-full">
                    <Link to="/auth" onClick={() => setIsMobileMenuOpen(false)}>
                      Login
                    </Link>
                  </Button>
                )}
              </div>

              {/* Mobile Notifications */}
              <div className="mt-4">
                <NotificationManager />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;