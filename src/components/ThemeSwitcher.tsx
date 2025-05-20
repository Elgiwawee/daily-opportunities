
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

interface ThemeSwitcherProps {
  className?: string;
  showLabel?: boolean;
}

const ThemeSwitcher = ({ className, showLabel = false }: ThemeSwitcherProps) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // Check for system preference or stored preference
    const storedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (storedTheme === 'dark' || (!storedTheme && prefersDark)) {
      setTheme('dark');
      document.documentElement.classList.add('dark');
    } else {
      setTheme('light');
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    
    // Update the class on the document
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Save preference
    localStorage.setItem('theme', newTheme);
  };

  return (
    <div className={`flex items-center ${className || ''}`}>
      {showLabel && (
        <span className="mr-2 text-sm">
          {theme === 'light' ? 'Light' : 'Dark'}
        </span>
      )}
      <div className="flex items-center">
        <Sun className="h-4 w-4 mr-1 text-yellow-500" />
        <Switch 
          checked={theme === 'dark'}
          onCheckedChange={toggleTheme}
          className="mx-1"
        />
        <Moon className="h-4 w-4 ml-1 text-blue-700 dark:text-blue-300" />
      </div>
    </div>
  );
};

export default ThemeSwitcher;
