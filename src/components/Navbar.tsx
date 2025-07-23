import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Search, User, ChevronDown, Home, BookOpen, Briefcase, Newspaper, FileText, Users, Phone, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import NotificationManager from './NotificationManager';
import { useTranslation } from 'react-i18next';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import LanguageSwitcher from './LanguageSwitcher';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

// Navigation items configuration
const navigationItems = [
  {
    id: 'home',
    label: 'nav.home',
    path: '/',
    icon: Home,
    exact: true
  },
  {
    id: 'scholarships',
    label: 'nav.scholarships',
    path: '/scholarships',
    icon: BookOpen,
    hasDropdown: true,
    dropdownItems: [
      { label: 'scholarships.title', path: '/scholarships' },
      { type: 'separator', label: 'By Country' },
      { label: 'USA', path: '/scholarships/country/usa' },
      { label: 'UK', path: '/scholarships/country/uk' },
      { label: 'Canada', path: '/scholarships/country/canada' },
      { type: 'separator', label: 'By Level' },
      { label: 'Undergraduate', path: '/scholarships/level/undergraduate' },
      { label: "Master's", path: '/scholarships/level/masters' },
      { label: 'PhD', path: '/scholarships/level/phd' }
    ]
  },
  {
    id: 'jobs',
    label: 'nav.jobs',
    path: '/jobs',
    icon: Briefcase
  },
  {
    id: 'news',
    label: 'nav.news',
    path: '/news',
    icon: Newspaper
  },
  {
    id: 'blog',
    label: 'Blog',
    path: '/blog',
    icon: FileText
  },
  {
    id: 'more',
    label: 'More',
    hasDropdown: true,
    icon: Users,
    dropdownItems: [
      { label: 'nav.about', path: '/about', icon: Users },
      { label: 'nav.contact', path: '/contact', icon: Phone },
      { type: 'separator' },
      { label: 'nav.disclaimer', path: '/disclaimer', icon: Shield }
    ]
  }
];

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDropdowns, setOpenDropdowns] = useState<{ [key: string]: boolean }>({});
  const isMobile = useIsMobile();
  const isRtl = i18n.language === 'ar';

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsLoggedIn(!!session);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsLoggedIn(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
    setOpenDropdowns({});
  }, [location.pathname]);

  const toggleDropdown = (id: string) => {
    setOpenDropdowns(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Search term:', searchTerm);
  };

  const isActiveRoute = (item: any) => {
    if (item.exact) {
      return location.pathname === item.path;
    }
    return location.pathname.startsWith(item.path) || 
           (item.id === 'blog' && location.pathname.includes('/blog'));
  };

  const NavLink = ({ item, mobile = false, onClick }: any) => {
    const Icon = item.icon;
    const active = isActiveRoute(item);
    
    const baseClasses = cn(
      "relative flex items-center gap-2 transition-all duration-200",
      "hover:text-primary hover:scale-105",
      mobile ? "w-full px-4 py-3 text-base" : "px-3 py-2 text-sm font-medium",
      active ? "text-primary font-semibold" : "text-muted-foreground",
      active && !mobile && "after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary after:rounded-full"
    );

    return (
      <Link 
        to={item.path} 
        className={baseClasses}
        onClick={onClick}
      >
        {Icon && <Icon className="h-4 w-4" />}
        {t(item.label) || item.label}
      </Link>
    );
  };

  const DropdownNavItem = ({ item, mobile = false }: any) => {
    const Icon = item.icon;
    const active = item.dropdownItems?.some((subItem: any) => 
      subItem.path && location.pathname.startsWith(subItem.path)
    ) || (item.id === 'scholarships' && location.pathname.includes('/scholarships'));

    if (mobile) {
      return (
        <div className="w-full">
          <button
            onClick={() => toggleDropdown(item.id)}
            className={cn(
              "flex items-center justify-between w-full px-4 py-3 text-base transition-colors",
              "hover:text-primary hover:bg-accent/50 rounded-lg",
              active ? "text-primary font-semibold bg-accent/30" : "text-muted-foreground"
            )}
          >
            <div className="flex items-center gap-2">
              {Icon && <Icon className="h-4 w-4" />}
              {t(item.label) || item.label}
            </div>
            <ChevronDown 
              className={cn(
                "h-4 w-4 transition-transform duration-200",
                openDropdowns[item.id] && "rotate-180"
              )} 
            />
          </button>
          
          {openDropdowns[item.id] && (
            <div className="ml-6 mt-2 space-y-1 animate-fade-in">
              {item.dropdownItems.map((subItem: any, index: number) => {
                if (subItem.type === 'separator') {
                  return (
                    <div key={index} className="px-3 py-1 text-xs font-medium text-muted-foreground">
                      {isRtl ? 
                        (subItem.label === 'By Country' ? 'حسب الدولة' : 
                         subItem.label === 'By Level' ? 'حسب المستوى' : subItem.label) 
                        : subItem.label}
                    </div>
                  );
                }
                const SubIcon = subItem.icon;
                const subActive = location.pathname === subItem.path;
                return (
                  <Link
                    key={index}
                    to={subItem.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 text-sm transition-colors rounded-md",
                      "hover:text-primary hover:bg-accent/50",
                      subActive ? "text-primary font-medium bg-accent/30" : "text-muted-foreground"
                    )}
                  >
                    {SubIcon && <SubIcon className="h-3 w-3" />}
                    {t(subItem.label) || subItem.label}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      );
    }

    return (
      <DropdownMenu>
        <DropdownMenuTrigger 
          className={cn(
            "flex items-center gap-1 px-3 py-2 text-sm font-medium transition-all duration-200",
            "hover:text-primary hover:scale-105 focus:outline-none",
            "relative",
            active ? "text-primary font-semibold" : "text-muted-foreground",
            active && "after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary after:rounded-full"
          )}
        >
          {Icon && <Icon className="h-4 w-4" />}
          {t(item.label) || item.label}
          <ChevronDown className="h-3 w-3 ml-1" />
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          className="w-56 bg-background/95 backdrop-blur-sm border shadow-lg animate-scale-in"
          align="start"
        >
          {item.dropdownItems.map((subItem: any, index: number) => {
            if (subItem.type === 'separator') {
              return (
                <div key={index}>
                  <div className="px-3 py-2 text-xs font-medium text-muted-foreground">
                    {isRtl ? 
                      (subItem.label === 'By Country' ? 'حسب الدولة' : 
                       subItem.label === 'By Level' ? 'حسب المستوى' : subItem.label) 
                      : subItem.label}
                  </div>
                  {index < item.dropdownItems.length - 1 && <DropdownMenuSeparator />}
                </div>
              );
            }
            const SubIcon = subItem.icon;
            return (
              <DropdownMenuItem key={index} asChild>
                <Link 
                  to={subItem.path}
                  className="flex items-center gap-2 cursor-pointer hover:bg-accent"
                >
                  {SubIcon && <SubIcon className="h-4 w-4" />}
                  {t(subItem.label) || subItem.label}
                </Link>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  return (
    <nav className="fixed top-0 w-full bg-background/95 backdrop-blur-sm border-b border-border z-50 shadow-sm">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <img 
              src="/lovable-uploads/bfe4b900-aa37-433d-b636-2134c6bb921c.png" 
              alt={t('app.name')}
              className="h-8 w-auto"
            />
            <span className="font-bold text-lg text-foreground hidden sm:block">
              {t('app.name')}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navigationItems.map((item) => (
              <div key={item.id}>
                {item.hasDropdown ? (
                  <DropdownNavItem item={item} />
                ) : (
                  <NavLink item={item} />
                )}
              </div>
            ))}
          </div>

          {/* Desktop Right Section */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Search */}
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="search"
                placeholder={t('buttons.search')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-48 px-3 py-2 pl-9 text-sm border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </form>

            <NotificationManager />
            <LanguageSwitcher />

            {/* Auth Button */}
            {isLoggedIn ? (
              <Button variant="outline" size="sm" asChild>
                <Link to="/admin" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  {t('nav.admin')}
                </Link>
              </Button>
            ) : (
              <Button variant="default" size="sm" asChild>
                <Link to="/auth">
                  {t('nav.login')}
                </Link>
              </Button>
            )}
          </div>

          {/* Mobile Right Section */}
          <div className="flex lg:hidden items-center gap-2">
            <NotificationManager />
            <LanguageSwitcher />
            
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="p-2">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 p-0">
                <div className="flex flex-col h-full">
                  {/* Mobile Header */}
                  <div className="flex items-center justify-between p-4 border-b">
                    <span className="font-semibold text-lg">{t('app.name')}</span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setIsMenuOpen(false)}
                      className="p-2"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>

                  {/* Mobile Navigation */}
                  <div className="flex-1 overflow-y-auto py-4">
                    <div className="space-y-1 px-2">
                      {navigationItems.map((item) => (
                        <div key={item.id}>
                          {item.hasDropdown ? (
                            <DropdownNavItem item={item} mobile />
                          ) : (
                            <NavLink item={item} mobile onClick={() => setIsMenuOpen(false)} />
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Mobile Search */}
                    <div className="px-4 mt-6">
                      <form onSubmit={handleSearchSubmit} className="relative">
                        <input
                          type="search"
                          placeholder={t('buttons.search')}
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full px-3 py-2 pl-9 text-sm border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      </form>
                    </div>
                  </div>

                  {/* Mobile Auth */}
                  <div className="p-4 border-t">
                    {isLoggedIn ? (
                      <Button variant="outline" className="w-full" asChild>
                        <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          {t('nav.admin')}
                        </Link>
                      </Button>
                    ) : (
                      <Button className="w-full" asChild>
                        <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                          {t('nav.login')}
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;