import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CookieConsent = () => {
  const [showConsent, setShowConsent] = useState(false);

  useEffect(() => {
    // Check if user has already accepted cookies
    const hasAccepted = document.cookie.includes('cookieConsent=accepted');
    if (!hasAccepted) {
      // Show cookie banner after a short delay
      const timer = setTimeout(() => {
        setShowConsent(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptCookies = () => {
    // Set cookie with 1 year expiry
    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 1);
    document.cookie = `cookieConsent=accepted; expires=${expiryDate.toUTCString()}; path=/; SameSite=Lax`;
    setShowConsent(false);
  };

  const declineCookies = () => {
    // Set cookie with 1 day expiry so we don't keep showing the banner
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 1);
    document.cookie = `cookieConsent=declined; expires=${expiryDate.toUTCString()}; path=/; SameSite=Lax`;
    setShowConsent(false);
  };

  if (!showConsent) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 md:p-6 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2">We use cookies</h3>
            <p className="text-gray-600 text-sm mb-2">
              We use cookies to enhance your experience, analyze site traffic, and for our marketing purposes. 
              By continuing to use our site, you accept our use of cookies.
            </p>
            <p className="text-gray-600 text-sm">
              We also use cookies to enable notifications about new opportunities.
            </p>
          </div>
          <div className="flex items-center gap-2 mt-2 md:mt-0">
            <Button
              variant="outline"
              size="sm"
              onClick={declineCookies}
              className="border-gray-300 text-gray-600 hover:bg-gray-100"
            >
              Decline
            </Button>
            <Button
              size="sm"
              onClick={acceptCookies}
              className="bg-olive-600 text-white hover:bg-olive-700"
            >
              Accept
            </Button>
            <button
              onClick={declineCookies}
              className="p-1 text-gray-500 hover:text-gray-700"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
