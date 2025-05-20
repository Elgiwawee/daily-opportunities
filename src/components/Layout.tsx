
import React from 'react';
import Navbar from './Navbar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <footer className="bg-gray-100 py-6 mt-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
            <div className="mb-4 md:mb-0">© 2025 Scholarship Portal. All rights reserved.</div>
            <div className="flex gap-4">
              <a href="/about" className="hover:text-gray-900">About</a>
              <a href="/contact" className="hover:text-gray-900">Contact</a>
              <a href="/disclaimer" className="hover:text-gray-900">Disclaimer</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
